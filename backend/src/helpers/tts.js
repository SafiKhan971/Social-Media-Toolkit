import { createRequire } from 'module'
import path from 'path'
import { boundariesToWords } from './karaokeCaptions.js'

const require = createRequire(import.meta.url)
const { EdgeTTS, Constants } = require('@andresaya/edge-tts')

export const SHORT_VOICES = [
  { id: 'en-US-AriaNeural', label: 'Aria (US Female)' },
  { id: 'en-US-GuyNeural', label: 'Guy (US Male)' },
  { id: 'en-US-JennyNeural', label: 'Jenny (US Female)' },
  { id: 'en-GB-SoniaNeural', label: 'Sonia (UK Female)' },
  { id: 'en-GB-RyanNeural', label: 'Ryan (UK Male)' },
  { id: 'ur-PK-UzmaNeural', label: 'Uzma (Urdu Female)' },
  { id: 'ur-PK-AsadNeural', label: 'Asad (Urdu Male)' },
  { id: 'hi-IN-SwaraNeural', label: 'Swara (Hindi Female)' },
  { id: 'hi-IN-MadhurNeural', label: 'Madhur (Hindi Male)' },
]

export function resolveVoice(script, requestedVoice) {
  if (requestedVoice && SHORT_VOICES.some(voice => voice.id === requestedVoice)) {
    return requestedVoice
  }

  if (/[\u0600-\u06FF]/.test(script || '')) {
    return 'ur-PK-UzmaNeural'
  }

  return 'en-US-AriaNeural'
}

export async function textToSpeechFile(text, outputPathWithoutExt, voice) {
  const tts = new EdgeTTS()

  await tts.synthesize(String(text).trim(), voice, {
    outputFormat: Constants.OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3,
  })

  const savedPath = await tts.toFile(outputPathWithoutExt)
  const info = typeof tts.getAudioInfo === 'function' ? tts.getAudioInfo() : null
  const boundaries = typeof tts.getWordBoundaries === 'function' ? tts.getWordBoundaries() : []

  return {
    path: savedPath || `${outputPathWithoutExt}.mp3`,
    estimatedDuration: info?.estimatedDuration || null,
    words: boundariesToWords(boundaries, info?.estimatedDuration),
  }
}

export function splitTextForTts(text, maxChars = 900) {
  const cleaned = String(text || '').trim()
  if (cleaned.length <= maxChars) return [cleaned]

  const scenes = cleaned.split(/(?<=[.!?۔؟।])\s+/)
  const chunks = []
  let current = ''

  for (const scene of scenes) {
    if ((current + ' ' + scene).trim().length > maxChars && current) {
      chunks.push(current.trim())
      current = scene
    } else {
      current = `${current} ${scene}`.trim()
    }
  }

  if (current) chunks.push(current.trim())
  return chunks.filter(Boolean)
}

export function ttsOutputBase(workDir, name = 'narration') {
  return path.join(workDir, name)
}
