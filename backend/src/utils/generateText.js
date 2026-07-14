import { groqClient } from './groqClient.js'

export async function generateText(business, type, seasonalType) {
  if(type === 'announcement' || type === 'before_after') {
    return `${type} type does not require text generation.`
  }

  try {
    let prompt

    if (type === 'quote') {
      prompt = `Generate a short, engaging quote for social media (maximum 2 sentences). related to the business.
      Business name: ${business.name}
      Business description: ${business.description}`
    } else if (type === 'offer') {
      prompt = `Generate a short, compelling tagline for social media (maximum 12 words) related to the business.
      Business name: ${business.name}
      Business description: ${business.description}`
    } else if (type === 'tip') {
      prompt = `You are a social media copywriter. Write ONE practical tip for customers of the following business.
        Business Name: ${business.name}
        Business Description: ${business.description}
        Rules:
        - Maximum 20 words.
        - Only one sentence.
        - Write directly to the customer using "you" or "your".
        - Make it useful and actionable.
        - Do NOT mention the business name.
        - Do NOT advertise, sell, or mention offers.
        - Do NOT use hashtags, emojis, or quotation marks.
        - Return only the tip.`
    } else if (type === 'seasonal') {
      prompt = `You are a social media copywriter. Write ONE short, engaging tagline for a seasonal post (maximum 12 words) related to the seasonal type.
        Seasonal Type: ${seasonalType}`
    }

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

    const text = completion.choices[0].message.content.trim()

    if (!text) {
      throw new Error('No text generated')
    }

    return text
  } catch (err) {
    throw new Error(`Text generation failed: ${err.message}`)
  }
}
