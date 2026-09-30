import { groqChatModel, groqClient } from './groqClient.js'

function parseJsonArray(text) {
  const match = String(text || '').match(/\[[\s\S]*\]/)
  if (!match) return null

  try {
    const parsed = JSON.parse(match[0])
    if (!Array.isArray(parsed)) return null
    return parsed.map(item => String(item).trim()).filter(Boolean)
  } catch {
    return null
  }
}

function fallbackQueries(scenes) {
  return scenes.map(scene => {
    const words = scene
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 5)
      .join(' ')

    return words || scene.split(/\s+/).slice(0, 4).join(' ')
  })
}

export async function extractImageQueries(scenes) {
  const fallback = fallbackQueries(scenes)

  try {
    const numbered = scenes.map((scene, index) => `${index + 1}. ${scene}`).join('\n')
    const prompt = `Extract stock footage search queries from this voiceover script.
Return ONLY a JSON array of strings with exactly ${scenes.length} items.
Each query must be 2 to 5 visual words (objects, places, people, actions) that match that scene and would work as a short video clip.
Do not use abstract words like success, quality, or motivation.
Do not mention brands or business names.
Scenes:
${numbered}`

    const completion = await groqClient.chat.completions.create({
      model: groqChatModel,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 512,
      reasoning_effort: 'low',
    })

    const parsed = parseJsonArray(completion.choices[0]?.message?.content)
    if (!parsed?.length) return fallback

    return scenes.map((_, index) => parsed[index] || fallback[index] || fallback[0])
  } catch (err) {
    console.error('Image query extraction failed:', err.message)
    return fallback
  }
}
