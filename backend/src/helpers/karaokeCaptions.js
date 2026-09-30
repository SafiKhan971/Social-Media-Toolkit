import fs from 'fs'
import { createCanvas } from 'canvas'

const PLAY_WIDTH = 1080
const FONT_SIZE = 78
const MAX_TEXT_WIDTH = 900
const MAX_LINES = 2
const MAX_WORDS = 6
const ACTIVE_COLOR = '&H0000F2FF&'
const IDLE_COLOR = '&H00FFFFFF&'

function boundaryText(boundary) {
  if (!boundary) return ''
  if (typeof boundary.text === 'string') return boundary.text.trim()
  if (typeof boundary.text?.Text === 'string') return boundary.text.Text.trim()
  return ''
}

export function boundariesToWords(boundaries, estimatedDuration) {
  const items = (boundaries || [])
    .map(boundary => ({
      text: boundaryText(boundary),
      offset: Number(boundary?.offset) || 0,
      duration: Number(boundary?.duration) || 0,
    }))
    .filter(item => item.text)

  if (!items.length) return []

  const lastEnd = items[items.length - 1].offset + items[items.length - 1].duration
  const duration = Number(estimatedDuration) || 0
  let divisor = 10_000_000

  if (duration > 0) {
    const asTicks = lastEnd / 10_000_000
    const asSeconds = lastEnd
    if (Math.abs(asSeconds - duration) < Math.abs(asTicks - duration)) {
      divisor = 1
    }
  }

  return items
    .map(item => ({
      text: item.text,
      start: item.offset / divisor,
      end: (item.offset + item.duration) / divisor,
    }))
    .filter(word => word.end > word.start)
}

function captionFont(script) {
  const text = String(script || '')
  if (/[\u0600-\u06FF]/.test(text)) return 'Segoe UI'
  if (/[\u0900-\u097F]/.test(text)) return 'Nirmala UI'
  return 'Arial'
}

function escapeAss(text) {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\r?\n/g, ' ')
}

function formatAssTime(seconds) {
  const totalCentis = Math.max(0, Math.round(Number(seconds) * 100))
  const centis = totalCentis % 100
  const totalSecs = Math.floor(totalCentis / 100)
  const secs = totalSecs % 60
  const totalMinutes = Math.floor(totalSecs / 60)
  const minutes = totalMinutes % 60
  const hours = Math.floor(totalMinutes / 60)
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(centis).padStart(2, '0')}`
}

function mergePunctuation(words) {
  const merged = []

  for (const word of words) {
    const text = String(word.text || '').trim()
    if (!text) continue

    if (/^[^\p{L}\p{N}]+$/u.test(text) && merged.length) {
      merged[merged.length - 1].text += text
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, word.end)
      continue
    }

    merged.push({ text, start: word.start, end: word.end })
  }

  return merged
}

function estimateWords(script, duration) {
  const parts = String(script || '').split(/\s+/).filter(Boolean)
  if (!parts.length || !(duration > 0)) return []

  const weights = parts.map(word => Math.max([...word].length, 1))
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  let cursor = 0

  return parts.map((text, index) => {
    const slice = (weights[index] / total) * duration
    const start = cursor
    cursor += slice
    return { text, start, end: cursor }
  })
}

function wordsLookValid(words, duration) {
  if (!words.length || !(duration > 0)) return false
  const end = words[words.length - 1].end
  return end > duration * 0.35 && end < duration * 1.5
}

function clampWords(words, duration) {
  return words
    .map(word => ({
      text: word.text,
      start: Math.min(Math.max(word.start, 0), duration),
      end: Math.min(Math.max(word.end, 0), duration),
    }))
    .filter(word => word.text && word.end - word.start >= 0.03)
}

export function prepareCaptionWords(words, duration, script) {
  const sorted = mergePunctuation(
    (words || [])
      .filter(word => word && word.text)
      .map(word => ({
        text: String(word.text).trim(),
        start: Number(word.start) || 0,
        end: Number(word.end) || 0,
      }))
      .filter(word => word.text && word.end > word.start)
      .sort((a, b) => a.start - b.start)
  )

  if (wordsLookValid(sorted, duration)) return clampWords(sorted, duration)
  return estimateWords(script, duration)
}

function measureContext(fontName) {
  const ctx = createCanvas(32, 32).getContext('2d')
  ctx.font = `bold ${FONT_SIZE}px "${fontName}"`
  return ctx
}

function lineCount(ctx, words) {
  let lines = 1
  let width = 0
  const space = ctx.measureText(' ').width

  for (const word of words) {
    const wordWidth = ctx.measureText(word.text).width
    if (width > 0 && width + space + wordWidth > MAX_TEXT_WIDTH) {
      lines += 1
      width = wordWidth
    } else {
      width += (width > 0 ? space : 0) + wordWidth
    }
  }

  return lines
}

function groupWords(ctx, words) {
  const groups = []
  let current = []

  for (const word of words) {
    const trial = [...current, word]
    if (current.length && (trial.length > MAX_WORDS || lineCount(ctx, trial) > MAX_LINES)) {
      groups.push(current)
      current = [word]
    } else {
      current = trial
    }
  }

  if (current.length) groups.push(current)
  return groups
}

function renderPhrase(ctx, group, activeIndex) {
  const space = ctx.measureText(' ').width
  let width = 0
  const parts = []

  group.forEach((word, index) => {
    const wordWidth = ctx.measureText(word.text).width
    if (width > 0 && width + space + wordWidth > MAX_TEXT_WIDTH) {
      parts.push('\\N')
      width = 0
    } else if (width > 0) {
      parts.push(' ')
      width += space
    }

    const color = index === activeIndex ? ACTIVE_COLOR : IDLE_COLOR
    parts.push(`{\\c${color}}${escapeAss(word.text)}`)
    width += wordWidth
  })

  return parts.join('')
}

function buildEvents(ctx, words) {
  const events = []

  for (const group of groupWords(ctx, words)) {
    for (let index = 0; index < group.length; index++) {
      const start = group[index].start
      const end = index + 1 < group.length ? group[index + 1].start : group[index].end
      if (!(end > start)) continue

      events.push({
        start,
        end,
        text: renderPhrase(ctx, group, index),
      })
    }
  }

  return events
}

export function buildKaraokeAss({ words, duration, script }) {
  const fontName = captionFont(script)
  const timed = prepareCaptionWords(words, duration, script)
  if (!timed.length) return ''

  const events = buildEvents(measureContext(fontName), timed)
  if (!events.length) return ''

  const dialogue = events
    .map(event => {
      return `Dialogue: 0,${formatAssTime(event.start)},${formatAssTime(event.end)},Caption,,0,0,0,,${event.text}`
    })
    .join('\n')

  return `[Script Info]
ScriptType: v4.00+
PlayResX: ${PLAY_WIDTH}
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Caption,${fontName},${FONT_SIZE},&H00FFFFFF,&H000000FF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,8,1,2,80,80,460,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${dialogue}
`
}

export function writeKaraokeAss(outputPath, options) {
  const content = buildKaraokeAss(options)
  if (!content) return null

  fs.writeFileSync(outputPath, `\uFEFF${content}`, 'utf8')
  return outputPath
}
