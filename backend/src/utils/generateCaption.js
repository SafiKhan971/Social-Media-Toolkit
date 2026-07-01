import { groqClient } from './groqClient.js'

export async function generateCaption(business) {
  try {
    const prompt = `Write a short engaging social media caption (1-2 sentences).
    Business name: ${business.name}
    Business description: ${business.description}
    Make it natural, marketing friendly, and engaging.`

    const completion = await groqClient.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 60,
    })

    const caption = completion.choices[0].message.content.trim()

    if (!caption) {
      throw new Error('No caption generated')
    }

    return caption
  } catch (err) {
    throw new Error(`Caption generation failed: ${err.message}`)
  }
}