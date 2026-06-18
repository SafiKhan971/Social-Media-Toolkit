import axios from 'axios'
import Business from '../models/Business.js'

// Picsum returns a random placeholder image. Using a random seed per call
// so each generated post gets a different image.
function getPlaceholderImageUrl() {
  const seed = Math.floor(Math.random() * 100000)
  return `https://picsum.photos/seed/${seed}/600/400`
}

// Calls a local Hugging Face inference server (e.g. text-generation-inference,
// or any server exposing a compatible HTTP API) running on your machine.
// Configure the URL and model via env vars — no API key needed for local.
async function generateCaption(business) {
  const baseUrl = process.env.HF_LOCAL_API_URL || 'http://localhost:8080'
  const apiKey = process.env.HF_API_KEY || ''

  const prompt = `Write a short, engaging social media caption (1-2 sentences) for a business named "${business.name}". Business description: ${business.description}.`

  try {
    const response = await axios.post(
      `${baseUrl}/generate`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 60,
          temperature: 0.8,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        timeout: 30000,
      }
    )

    // text-generation-inference typically returns { generated_text: "..." }
    // or an array of such objects depending on server/version. Handle both.
    const data = response.data
    const generatedText = Array.isArray(data)
      ? data[0]?.generated_text
      : data.generated_text

    if (!generatedText) {
      throw new Error('No generated_text in response from local model server')
    }

    return generatedText.trim()
  } catch (err) {
    // Re-throw with a clearer message so the route handler can surface it
    throw new Error(
      `Caption generation failed (is your local HF server running at ${baseUrl}?): ${err.message}`
    )
  }
}

// POST /api/posts/generate
// body: { businessId, numberOfPosts }
export async function generatePosts(req, res) {
  try {
    const { businessId, numberOfPosts } = req.body

    if (!businessId || !numberOfPosts) {
      return res
        .status(400)
        .json({ message: 'businessId and numberOfPosts are required' })
    }

    const count = parseInt(numberOfPosts, 10)
    if (Number.isNaN(count) || count < 1) {
      return res.status(400).json({ message: 'numberOfPosts must be a positive number' })
    }

    const business = await Business.findById(businessId)
    if (!business) {
      return res.status(404).json({ message: 'Business not found' })
    }

    const posts = []
    const errors = []

    for (let i = 0; i < count; i++) {
      const imageUrl = getPlaceholderImageUrl()

      try {
        const caption = await generateCaption(business)
        posts.push({ imageUrl, caption })
      } catch (err) {
        // Keep going so one failed caption doesn't kill the whole batch —
        // surface the image and the error for that post instead.
        posts.push({ imageUrl, caption: null, error: err.message })
        errors.push(err.message)
      }
    }

    res.json({
      business: { id: business._id, name: business.name },
      posts,
      ...(errors.length ? { warnings: errors } : {}),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
