import fs from 'fs'
import path from 'path'
import Short from '../models/Short.js'
import { generateShortVideo } from '../helpers/generateShortVideo.js'
import { SHORT_VOICES } from '../helpers/tts.js'

function publicUrl(req, filePath) {
  return `${req.protocol}://${req.get('host')}${filePath}`
}

function folderFromMediaUrl(mediaUrl) {
  try {
    const pathname = new URL(mediaUrl).pathname
    const relative = pathname.replace(/^\//, '')
    return path.dirname(path.join(process.cwd(), relative))
  } catch {
    return null
  }
}

export function getShortVoices(req, res) {
  res.json({ voices: SHORT_VOICES })
}

export async function generateShort(req, res) {
  try {
    req.setTimeout(240000)
    res.setTimeout(240000)

    const { script, voice } = req.body
    const cleanedScript = String(script || '').trim()

    if (cleanedScript.length < 20) {
      return res.status(400).json({ message: 'Voice script must be at least 20 characters' })
    }

    if (cleanedScript.length > 1500) {
      return res.status(400).json({ message: 'Voice script must be 1500 characters or less' })
    }

    const generated = await generateShortVideo({
      script: cleanedScript,
      voice,
    })

    return res.json({
      message: 'YouTube Short generated successfully',
      short: {
        script: cleanedScript,
        videoUrl: publicUrl(req, generated.videoPath),
        thumbnailUrl: publicUrl(req, generated.thumbnailPath),
        caption: generated.caption,
        duration: generated.duration,
        voice: generated.voice,
        scenes: generated.scenes.map(scene => ({
          text: scene.text,
          query: scene.query,
          imageUrl: publicUrl(req, scene.imagePath),
        })),
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      message: err.message || 'Failed to generate YouTube Short',
    })
  }
}

export async function saveShort(req, res) {
  try {
    const { script, videoUrl, thumbnailUrl, caption, duration, voice } = req.body

    if (!script || !videoUrl || !thumbnailUrl) {
      return res.status(400).json({
        message: 'script, videoUrl and thumbnailUrl are required',
      })
    }

    const saved = await Short.create({
      script,
      videoUrl,
      thumbnailUrl,
      caption: caption || '',
      duration: duration || 0,
      voice: voice || '',
    })

    return res.json({
      message: 'Short saved successfully',
      short: saved,
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function getShorts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 6
    const skip = (page - 1) * limit

    const shorts = await Short.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
    const total = await Short.countDocuments()

    res.json({
      shorts,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function deleteShort(req, res) {
  try {
    const short = await Short.findByIdAndDelete(req.params.id)
    if (!short) {
      return res.status(404).json({ message: 'Short not found' })
    }

    const folder = folderFromMediaUrl(short.videoUrl)
    if (folder && folder.includes(`${path.sep}shorts${path.sep}`) && fs.existsSync(folder)) {
      fs.rmSync(folder, { recursive: true, force: true })
    }

    res.json({ message: 'Short deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
