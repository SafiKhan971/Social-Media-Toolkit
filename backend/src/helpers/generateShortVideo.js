import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { splitScriptIntoScenes } from './splitScript.js'
import { extractImageQueries } from './extractImageQueries.js'
import { downloadImage, findRelatedImageUrl } from './stockImages.js'
import { downloadVideo, findRelatedVideo } from './stockVideos.js'
import { generateShortFrame } from './canvas/generateShortFrame.js'
import { generateShortOverlay } from './canvas/generateShortOverlay.js'
import { resolveVoice, splitTextForTts, textToSpeechFile } from './tts.js'
import {
  concatAudioFiles,
  concatVideoClips,
  createSceneClip,
  createStillClip,
  extractThumbnail,
  muxVideoAudio,
  probeDuration,
  speedUpAudio,
} from './ffmpeg.js'
import { generateShortCaption } from './generateShortCaption.js'
import { writeKaraokeAss } from './karaokeCaptions.js'

const MAX_SHORT_SECONDS = 59

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function sceneDurations(scenes, totalDuration) {
  const weights = scenes.map(scene => Math.max(String(scene).length, 24))
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  return weights.map(weight => (weight / totalWeight) * totalDuration)
}

async function collectSceneMedia(scenes, queries, workDir) {
  const videosDir = path.join(workDir, 'videos')
  const imagesDir = path.join(workDir, 'images')
  ensureDir(videosDir)
  ensureDir(imagesDir)

  const usedUrls = new Set()
  const media = []

  for (let i = 0; i < scenes.length; i++) {
    const video = await findRelatedVideo(queries[i], usedUrls)

    if (video?.url) {
      usedUrls.add(video.url)
      const destPath = path.join(videosDir, `source-${i}.mp4`)
      try {
        await downloadVideo(video.url, destPath)
        media.push({ type: 'video', path: destPath, sourceDuration: video.duration || 0 })
        continue
      } catch (err) {
        console.error('Video download failed:', err.message)
      }
    }

    const imageUrl = await findRelatedImageUrl(queries[i], usedUrls, i + Date.now())
    usedUrls.add(imageUrl)
    const destPath = path.join(imagesDir, `image-${i}.jpg`)
    try {
      await downloadImage(imageUrl, destPath)
    } catch (err) {
      console.error('Image download failed:', err.message)
      await downloadImage(`https://picsum.photos/1080/1920?random=${i + Date.now()}`, destPath)
    }
    media.push({ type: 'image', path: destPath, sourceDuration: 0 })
  }

  return media
}

async function createNarration(script, voice, workDir) {
  const chunks = splitTextForTts(script)
  const audioDir = path.join(workDir, 'audio')
  ensureDir(audioDir)

  if (chunks.length === 1) {
    const result = await textToSpeechFile(chunks[0], path.join(audioDir, 'narration'), voice)
    return { path: result.path, words: result.words || [] }
  }

  const chunkPaths = []
  const words = []
  let offset = 0

  for (let i = 0; i < chunks.length; i++) {
    const result = await textToSpeechFile(chunks[i], path.join(audioDir, `chunk-${i}`), voice)
    chunkPaths.push(result.path)
    const chunkDuration = await probeDuration(result.path)

    for (const word of result.words || []) {
      words.push({
        text: word.text,
        start: word.start + offset,
        end: word.end + offset,
      })
    }

    offset += chunkDuration
  }

  return {
    path: await concatAudioFiles(chunkPaths, path.join(audioDir, 'narration.mp3'), audioDir),
    words,
  }
}

async function buildSceneClip(media, duration, index, workDir) {
  const overlaysDir = path.join(workDir, 'overlays')
  const clipsDir = path.join(workDir, 'clips')
  ensureDir(overlaysDir)
  ensureDir(clipsDir)

  const overlayPath = path.join(overlaysDir, `overlay-${index}.png`)
  await generateShortOverlay({ outputPath: overlayPath })
  const clipPath = path.join(clipsDir, `clip-${index}.mp4`)

  if (media.type === 'video') {
    let sourceDuration = media.sourceDuration
    try {
      sourceDuration = await probeDuration(media.path)
    } catch {
      sourceDuration = media.sourceDuration || 0
    }

    const sceneDuration = Math.max(duration, 0.8)
    const loop = sourceDuration > 0 && sourceDuration + 0.15 < sceneDuration
    const maxStart = Math.max(sourceDuration - sceneDuration, 0)
    const startTime = loop || maxStart <= 0 ? 0 : Math.random() * maxStart

    await createSceneClip({
      sourcePath: media.path,
      overlayPath,
      duration: sceneDuration,
      outputPath: clipPath,
      cwd: clipsDir,
      loop,
      startTime,
    })
    return clipPath
  }

  const framePath = path.join(workDir, 'frames', `frame-${index}.png`)
  ensureDir(path.dirname(framePath))
  await generateShortFrame({
    backgroundPath: media.path,
    outputPath: framePath,
  })
  await createStillClip(framePath, Math.max(duration, 0.8), clipPath, clipsDir)
  return clipPath
}

export async function generateShortVideo({ script, voice }) {
  const shortId = randomUUID()
  const workDir = path.join(process.cwd(), 'uploads', 'shorts', shortId)
  const clipsDir = path.join(workDir, 'clips')
  ensureDir(clipsDir)

  const scenes = splitScriptIntoScenes(script)
  if (!scenes.length) {
    throw new Error('Voice script is empty')
  }

  const queries = await extractImageQueries(scenes)
  const media = await collectSceneMedia(scenes, queries, workDir)

  const resolvedVoice = resolveVoice(script, voice)
  let narration = await createNarration(script, resolvedVoice, workDir)
  let audioPath = narration.path
  let words = narration.words
  let duration = await probeDuration(audioPath)

  if (duration > MAX_SHORT_SECONDS) {
    const before = duration
    const spedPath = path.join(workDir, 'audio', 'narration-fast.mp3')
    audioPath = await speedUpAudio(audioPath, spedPath, duration / MAX_SHORT_SECONDS, workDir)
    duration = await probeDuration(audioPath)
    const scale = duration / before
    words = words.map(word => ({
      text: word.text,
      start: word.start * scale,
      end: word.end * scale,
    }))
  }

  const durations = sceneDurations(scenes, duration)
  const clipPaths = []
  for (let i = 0; i < scenes.length; i++) {
    const clipPath = await buildSceneClip(media[i], durations[i], i, workDir)
    clipPaths.push(clipPath)
  }

  const silentVideoPath = path.join(workDir, 'video-silent.mp4')
  await concatVideoClips(clipPaths, silentVideoPath, clipsDir)

  const captionsPath = writeKaraokeAss(path.join(workDir, 'captions.ass'), {
    words,
    duration,
    script,
  })

  const videoPath = path.join(workDir, 'video.mp4')
  await muxVideoAudio(silentVideoPath, audioPath, videoPath, workDir, captionsPath)

  const thumbnailPath = path.join(workDir, 'thumbnail.png')
  await extractThumbnail(videoPath, thumbnailPath, workDir)

  const sceneThumbnails = []
  for (let i = 0; i < clipPaths.length; i++) {
    const sceneThumb = path.join(workDir, `scene-thumb-${i}.png`)
    try {
      await extractThumbnail(clipPaths[i], sceneThumb, workDir)
      sceneThumbnails.push(`/uploads/shorts/${shortId}/scene-thumb-${i}.png`)
    } catch {
      sceneThumbnails.push(`/uploads/shorts/${shortId}/thumbnail.png`)
    }
  }

  const caption = await generateShortCaption(script)

  return {
    id: shortId,
    duration: Number(duration.toFixed(2)),
    videoPath: `/uploads/shorts/${shortId}/video.mp4`,
    thumbnailPath: `/uploads/shorts/${shortId}/thumbnail.png`,
    caption,
    voice: resolvedVoice,
    scenes: scenes.map((text, index) => ({
      text,
      query: queries[index],
      imagePath: sceneThumbnails[index],
    })),
  }
}
