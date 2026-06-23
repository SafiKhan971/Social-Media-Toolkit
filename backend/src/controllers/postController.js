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

    const image = response.data.results?.[0]

    return image?.urls?.regular || getFallbackImage()
  } catch (err) {
    console.log(
      'Unsplash error:',
      err.response?.status,
      err.response?.data || err.message
    )

    return getFallbackImage()
  }
}

export async function getBusinessImages(query, count = 10) {
  try {
    const response = await axios.get(
      'https://api.unsplash.com/search/photos',
      {
        params: {
          query,
          per_page: count,
        },
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    )

    return response.data.results || []
  } catch (err) {
    console.error(err.message)
    return []
  }
}

export async function generatePosts(req, res) {
  try {
    const {
      postType = 'business',
      businessId,
      description,
      numberOfPosts,
    } = req.body

    if (postType === 'business' && !businessId) {
      return res.status(400).json({
        message: 'Business is required',
      })
    }

    if (postType === 'instant' && !description?.trim()) {
      return res.status(400).json({
        message: 'Description is required',
      })
    }

    const count = parseInt(numberOfPosts, 10)

    if (Number.isNaN(count) || count < 1) {
      return res.status(400).json({
        message: 'numberOfPosts must be a positive number',
      })
    }

    let business = null
    let imageQuery = ''
    let captionData = {}

    if (postType === 'business') {
      business = await Business.findById(businessId)

      if (!business) {
        return res.status(404).json({
          message: 'Business not found',
        })
      }

      imageQuery = `${business.category} ${business.description}`

      captionData = {
        name: business.name,
        category: business.category,
        description: business.description,
      }
    } else {
      imageQuery = description

      captionData = {
        name: 'Instant Post',
        category: 'Custom',
        description,
      }
    }

    // Fetch multiple images once
    const images = await getBusinessImages(imageQuery, Math.max(count, 10))

    const posts = []
    const errors = []

    for (let i = 0; i < count; i++) {
      try {
        const caption = await generateCaption(captionData)

        const image =
          images.length > 0
            ? images[i % images.length]
            : null

        const imageUrl =
          image?.urls?.regular ||
          image?.urls?.small ||
          getFallbackImage()

        posts.push({
          imageUrl,
          caption,
        })
      } catch (err) {
        posts.push({
          imageUrl: getFallbackImage(),
          caption: null,
          error: err.message,
        })

        errors.push(err.message)
      }
    }

    return res.json({
      postType,
      ...(business && {
        business: {
          id: business._id,
          name: business.name,
        },
      }),
      posts,
      ...(errors.length > 0 && {
        warnings: errors,
      }),
    })
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    })
  }
}
export async function savePosts(req, res) {
  try {
    const { businessId, posts } = req.body

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

export async function deletePost(req, res) {
  try {
    const { id } = req.params

    const post = await Post.findByIdAndDelete(id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.json({ message: 'Post deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
