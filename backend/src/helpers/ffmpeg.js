import { createRequire } from 'module'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const require = createRequire(import.meta.url)
const ffmpegPath = require('ffmpeg-static')
const ffprobePath = require('ffprobe-static').path

function runCommand(bin, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, {
      cwd,
      windowsHide: true,
    })

    let stdout = ''
    let stderr = ''
    child.stdout.on('data', chunk => {
      stdout += chunk.toString()
    })
    child.stderr.on('data', chunk => {
      stderr += chunk.toString()
    })
    child.on('error', reject)
    child.on('close', code => {
      if (code === 0) {
        resolve({ stdout, stderr })
        return
      }

      reject(new Error(stderr.slice(-2500) || stdout.slice(-2500) || `Command failed with code ${code}`))
    })
  })
}

export async function probeDuration(filePath) {
  const { stdout, stderr } = await runCommand(ffprobePath, [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'default=noprint_wrappers=1:nokey=1',
    filePath,
  ])

  const duration = parseFloat(`${stdout}\n${stderr}`.trim())
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error('Could not read audio duration')
  }

  return duration
}

export async function concatAudioFiles(inputPaths, outputPath, cwd) {
  const listPath = path.join(cwd, 'audios.txt')
  const list = inputPaths.map(file => `file '${path.basename(file).replace(/'/g, "'\\''")}'`).join('\n')
  fs.writeFileSync(listPath, list)

  try {
    await runCommand(
      ffmpegPath,
      ['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', outputPath],
      cwd
    )
  } catch {
    await runCommand(
      ffmpegPath,
      ['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-c:a', 'aac', outputPath.replace(/\.mp3$/i, '.m4a')],
      cwd
    )
    return outputPath.replace(/\.mp3$/i, '.m4a')
  }

  return outputPath
}

export async function speedUpAudio(inputPath, outputPath, tempo, cwd) {
  const filters = []
  let remaining = tempo

  while (remaining > 2.0001) {
    filters.push('atempo=2.0')
    remaining /= 2
  }
  while (remaining < 0.5) {
    filters.push('atempo=0.5')
    remaining /= 0.5
  }
  filters.push(`atempo=${remaining.toFixed(4)}`)

  await runCommand(
    ffmpegPath,
    ['-y', '-i', inputPath, '-filter:a', filters.join(','), outputPath],
    cwd
  )

  return outputPath
}

export async function createStillClip(framePath, duration, clipPath, cwd) {
  await runCommand(
    ffmpegPath,
    [
      '-y',
      '-loop',
      '1',
      '-framerate',
      '30',
      '-t',
      duration.toFixed(3),
      '-i',
      framePath,
      '-vf',
      'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-profile:v',
      'high',
      '-tune',
      'stillimage',
      '-preset',
      'veryfast',
      '-crf',
      '20',
      clipPath,
    ],
    cwd
  )

  return clipPath
}

export async function createSceneClip({ sourcePath, overlayPath, duration, outputPath, cwd, loop = false, startTime = 0 }) {
  const args = ['-y']

  if (loop) {
    args.push('-stream_loop', '-1')
  } else if (startTime > 0.05) {
    args.push('-ss', startTime.toFixed(3))
  }

  args.push('-i', sourcePath)

  if (overlayPath) {
    args.push('-i', overlayPath)
  }

  args.push('-t', duration.toFixed(3))

  const scaleCrop = 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,setsar=1'
  const filter = overlayPath
    ? `[0:v]${scaleCrop}[v];[v][1:v]overlay=0:0`
    : scaleCrop

  if (overlayPath) {
    args.push('-filter_complex', filter)
  } else {
    args.push('-vf', filter)
  }

  args.push(
    '-an',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-profile:v',
    'high',
    '-preset',
    'veryfast',
    '-crf',
    '20',
    outputPath
  )

  await runCommand(ffmpegPath, args, cwd)
  return outputPath
}

export async function extractThumbnail(videoPath, outputPath, cwd) {
  await runCommand(
    ffmpegPath,
    [
      '-y',
      '-ss',
      '0.4',
      '-i',
      videoPath,
      '-frames:v',
      '1',
      '-vf',
      'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920',
      outputPath,
    ],
    cwd
  )

  return outputPath
}

export async function concatVideoClips(clipPaths, outputPath, cwd) {
  const listPath = path.join(cwd, 'clips.txt')
  const list = clipPaths.map(file => `file '${path.basename(file)}'`).join('\n')
  fs.writeFileSync(listPath, list)

  try {
    await runCommand(
      ffmpegPath,
      ['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', outputPath],
      cwd
    )
  } catch {
    await runCommand(
      ffmpegPath,
      [
        '-y',
        '-f',
        'concat',
        '-safe',
        '0',
        '-i',
        listPath,
        '-c:v',
        'libx264',
        '-pix_fmt',
        'yuv420p',
        '-preset',
        'veryfast',
        outputPath,
      ],
      cwd
    )
  }

  return outputPath
}

export async function muxVideoAudio(videoPath, audioPath, outputPath, cwd, captionsPath) {
  const args = ['-y', '-i', videoPath, '-i', audioPath]

  if (captionsPath) {
    args.push(
      '-vf',
      `ass=${path.basename(captionsPath)}`,
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-preset',
      'veryfast',
      '-crf',
      '20'
    )
  } else {
    args.push('-c:v', 'copy')
  }

  args.push('-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', outputPath)

  await runCommand(ffmpegPath, args, cwd)
  return outputPath
}
