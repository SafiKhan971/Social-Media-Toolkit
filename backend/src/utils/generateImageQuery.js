import { groqClient } from './groqClient.js'

export async function generateImageQuery(business) {
  try {
    const prompt = `Generate a concise Unsplash image search query.
    Business name: ${business.name}
    Business description: ${business.description}`

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

    const imageQuery = completion.choices[0].message.content.trim()

    if (!imageQuery) {
      throw new Error('No imageQuery generated')
    }

    return imageQuery
  } catch (err) {
    throw new Error(`ImageQuery generation failed: ${err.message}`)
  }
}

