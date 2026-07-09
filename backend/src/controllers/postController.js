import axios from 'axios'
import Business from '../models/Business.js'
import Post from '../models/Post.js'
import { generatePostImage } from '../utils/post-designs/general/generatePostImage.js'
import { classicPost } from '../utils/post-designs/package/classicPost.js'
import { generateCaption } from '../utils/generateCaption.js'
import { generateTagline } from '../utils/generateTagline.js'
import { generateQuote } from '../utils/generateQuote.js'
import path from 'path'
import Package from '../models/Package.js'
import postRequest from '../requests/postRequest.js'

function getFallbackImage() {
  return 'https://picsum.photos/600/400'
}

export async function getBusinessImages(query, count = 10) {
  try {
    const response = await axios.get(
      'https://api.unsplash.com/search/photos',
      {
        params: {
          query,
          order_by: 'relevant',
          per_page: count,
          orientation: 'squarish',
        },
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    )

    const images = response.data.results || []

    if (images.length === 0) {
      console.log(`No images found for "${query}". Using fallback image.`)
      return [getFallbackImage()]
    }

    return images
  } catch (err) {
    console.error(err.message)
    console.log('Using fallback image.')
    return [getFallbackImage()]
  }
}

// generate package posts
export async function generatePosts(req, res) {
  try {
    const { businessId, type, packageIds, numberOfPosts } = req.body

    // Validation
    postRequest({
      businessId,
      type,
      packageIds,
      numberOfPosts,
    })

    // Prepare data
    const business = await Business.findById(businessId)
    const imageQuery = `${business.category}`
    const tagline = await generateTagline(business)
    const caption = await generateCaption(business)
    const quote = await generateQuote(business)
    const images = await getBusinessImages(imageQuery, Math.max(numberOfPosts, 10))

    // Generate posts
    const posts = []
    const errors = []
    let imagePath = null

    for (let i = 0; i < numberOfPosts; i++) {
      try {

        const image = images.length > 0 ? images[i % images.length] : null
        const backgroundUrl = image?.urls?.regular || image?.urls?.small

        const logoPath = business?.logo ? path.join(
          process.cwd(),
          business.logo.replace(/^\//, '')
        )
          : null

        if (type === '1') {
           imagePath = await generatePostImage({
            business: business,
            description: quote,
            logoUrl: logoPath,
            backgroundUrl,
          })
        } else {
          const packages = await Package.find({ _id: { $in: packageIds } })
          imagePath = await classicPost({
            business: business,
            tagline: tagline,
            packages: packages,
            logoUrl: logoPath,
            backgroundUrl
          })
        }

        posts.push({
          caption: caption,
          imageUrl: `${req.protocol}://${req.get('host')}${imagePath}`,
        })
      } catch (err) {
        console.error(err)

        posts.push({
          caption: null,
          imageUrl: getFallbackImage(),
          error: err.message,
        })

        errors.push(err.message)
      }
    }

    return res.json({
      message: 'Posts generated successfully',
      type,
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
    console.error(err)

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


