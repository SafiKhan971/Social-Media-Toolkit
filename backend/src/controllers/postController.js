import axios from 'axios'
import Business from '../models/Business.js'
import Post from '../models/Post.js'
import { groqClient } from '../utils/groqClient.js'

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

function getFallbackImage() {
  return 'https://picsum.photos/600/400'
}

export async function getBusinessImageUrl(query) {
  try {
    const response = await axios.get(
      'https://api.unsplash.com/search/photos',
      {
        params: {
          query,
          per_page: 1,
        },
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    )

    const image = response.data.results[0]

    return image?.urls?.regular || getFallbackImage()
  } catch (err) {
    return getFallbackImage()
  }
}

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
      const imageUrl = await getBusinessImageUrl(business.name)

      try {
        const caption = await generateCaption(business)
        // const caption = "This is sample caption"
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

export async function savePosts(req, res) {
  try {
    const { businessId, posts } = req.body

    console.log("posts", posts)

    if (!businessId || !posts?.length) {
      return res.status(400).json({
        message: 'businessId and posts are required',
      })
    }

    const business = await Business.findById(businessId)

    if (!business) {
      return res.status(404).json({
        message: 'Business not found',
      })
    }

    const records = posts.map((post) => ({
      businessId,
      imageUrl: post.imageUrl,
      caption: post.caption,
    }))

    const savedPosts = await Post.insertMany(records)

    res.json({
      message: 'Posts saved successfully',
      posts: savedPosts,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
}

export async function getPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 6

    const skip = (page - 1) * limit

    const posts = await Post.find()
      .populate('businessId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Post.countDocuments()

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
