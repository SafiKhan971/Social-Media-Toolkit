import { groqClient } from './groqClient.js'

export async function generateTagline(business) {
  try {
    const prompt = `Write one attractive marketing tagline (maximum 12 words) for this business.
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

    const tagline = completion.choices[0].message.content.trim()

    if (!tagline) {
      throw new Error('No tagline generated')
    }

    return tagline
  } catch (err) {
    throw new Error(`Tagline generation failed: ${err.message}`)
  }
}