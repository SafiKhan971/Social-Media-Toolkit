export function splitScriptIntoScenes(script, { maxScenes = 8 } = {}) {
  const cleaned = String(script || '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!cleaned) return []

  let parts = cleaned
    .split(/(?<=[.!?۔؟।])\s+/)
    .map(part => part.trim())
    .filter(Boolean)

  if (parts.length <= 1) {
    parts = cleaned
      .split(/[,;:\n]+/)
      .map(part => part.trim())
      .filter(part => part.length > 8)
  }

  if (parts.length <= 1) {
    const words = cleaned.split(' ')
    const chunkSize = 14
    parts = []
    for (let i = 0; i < words.length; i += chunkSize) {
      parts.push(words.slice(i, i + chunkSize).join(' '))
    }
  }

  const scenes = []
  for (const part of parts) {
    if (scenes.length && part.split(' ').length < 4) {
      scenes[scenes.length - 1] += ` ${part}`
    } else {
      scenes.push(part)
    }
  }

  while (scenes.length > maxScenes) {
    const last = scenes.pop()
    scenes[scenes.length - 1] += ` ${last}`
  }

  return scenes.filter(Boolean)
}
