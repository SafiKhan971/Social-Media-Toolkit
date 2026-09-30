import Business from '../models/Business.js'
import Post from '../models/Post.js'
import { generateQuoteImage } from '../helpers/canvas/generateQuoteImage.js'
import { generateOfferImage } from '../helpers/canvas/generateOfferImage.js'
import { generateTipImage } from '../helpers/canvas/generateTipImage.js'
import { generateAnnouncementImage } from '../helpers/canvas/generateAnnouncementImage.js'
import { generateBeforeAfterImage } from '../helpers/canvas/generateBeforeAfterImage.js'
import { generateSeasonalImage } from '../helpers/canvas/generateSeasonalImage.js'
import { generateExternalImage } from '../helpers/canvas/generateExternalImage.js'
import { generateText } from '../helpers/generateText.js'
import { generateCaption } from '../helpers/generateCaption.js'
import Package from '../models/Package.js'
import postRequest from '../requests/postRequest.js'
import { getFallbackImage, getUnsplashImageUrl, searchUnsplashImages } from '../helpers/unsplash.js'

export async function getBusinessImages(query, count = 30) {
  return searchUnsplashImages(query, { count, orientation: 'squarish' })
}

// generate package posts
export async function generatePosts(req, res) {
  try {
    const { businessId, type, packageIds, numberOfPosts, description, seasonalType, customDescription, customBackground } = req.body
    const beforeImage = req.files?.beforeImage?.[0]
    const afterImage = req.files?.afterImage?.[0]
    const backgroundImage = req.files?.backgroundImage?.[0]

    // Validation
    postRequest({
      businessId,
      type,
      packageIds,
      numberOfPosts,
      description,
      seasonalType,
      customDescription,
      customBackground,
      beforeImage: beforeImage ? beforeImage : null,
      afterImage: afterImage ? afterImage : null,
      backgroundImage: backgroundImage ? backgroundImage : null,
    })

    // Prepare data
    const business = await Business.findById(businessId).populate('category')
    const imageQuery = `${business.category.name}, ${business.category.tags.join(', ')}`
    let backgroundUrl = null
    let images = []

    if (backgroundImage) {
      backgroundUrl = backgroundImage.path // or build a public URL
    } else {
      images = await searchUnsplashImages(imageQuery, { count: 30, orientation: 'squarish' })
    }

    // Generate posts
    const posts = []
    const errors = []
    let imagePath = null

    for (let i = 0; i < numberOfPosts; i++) {
      try {
        const text = description ? description : await generateText(business, type, seasonalType)
        const caption = await generateCaption(business)
        let currentBackground = backgroundUrl

        if (!backgroundImage) {
          const image = images[i % images.length]
          currentBackground = getUnsplashImageUrl(image)
        }

        const commonParams = {
          business,
          backgroundUrl: currentBackground,
          description: text,
        }

        switch (type) {
          case 'quote':
            imagePath = await generateQuoteImage({
              ...commonParams,
            })
            break

          case 'tip':
            imagePath = await generateTipImage({
              ...commonParams,
            })
            break

          case 'announcement':
            imagePath = await generateAnnouncementImage({
              ...commonParams,
            })
            break

          case 'before_after':
            imagePath = await generateBeforeAfterImage({
              ...commonParams,
              beforeImage,
              afterImage,
            })
            break

          case 'seasonal':
            imagePath = await generateSeasonalImage({
              ...commonParams,
              seasonalType,
            })
            break

          case 'external':
            imagePath = await generateExternalImage({
              ...commonParams,
            })
            break

          case 'offer': {
            const packages = await Package.find({
              _id: { $in: packageIds },
            }).populate('currency', 'name code symbol')

            imagePath = await generateOfferImage({
              ...commonParams,
              packages,
            })
            break
          }

          default:
            throw new Error(`Unsupported post type: ${type}`)
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

    const records = posts.map(post => ({
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

    const posts = await Post.find().populate('businessId', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit)

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
