import { groqChatModel, groqClient } from './groqClient.js'

export async function generateShortCaption(script) {
  try {
    const prompt = `Write a YouTube Shorts description for this video.
Rules:
- First line is a hook (max 12 words)
- Then 2 short sentences
- Then a hashtag line that includes #Shorts #YouTubeShorts and 4 relevant tags
- Do not use quotation marks
- Do not mention a business name
Voice script: ${script}`

    const completion = await groqClient.chat.completions.create({
      model: groqChatModel,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 512,
      reasoning_effort: 'low',
    })

    const caption = completion.choices[0]?.message?.content?.trim()
    if (!caption) throw new Error('No caption generated')
    return caption
  } catch (err) {
    return `${script.slice(0, 120)}\n\n#Shorts #YouTubeShorts`.trim()
  }
}
