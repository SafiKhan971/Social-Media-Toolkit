import { groqChatModel, groqClient } from '../helpers/groqClient.js'

export async function generateCaption(business) {
  try {
    const prompt = `Write one attractive marketing caption (maximum 12 words) for this business.
    Business name: ${business.name}
    Business description: ${business.description}`

    const completion = await groqClient.chat.completions.create({
      model: groqChatModel,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 512,
      reasoning_effort: 'low',
    })

    const caption = completion.choices[0]?.message?.content?.trim()

    if (!caption) {
      throw new Error('No caption generated')
    }

    return caption
  } catch (err) {
    throw new Error(`Caption generation failed: ${err.message}`)
  }
}