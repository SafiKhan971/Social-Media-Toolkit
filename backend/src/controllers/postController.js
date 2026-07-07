import axios from 'axios'
import Business from '../models/Business.js'
import Post from '../models/Post.js'
import { generatePostImage } from '../utils/generatePostImage.js'
import { classicPost } from '../utils/post-designs/package/classicPost.js'
import { generateCaption } from '../utils/generateCaption.js'
import { generateTagline } from '../utils/generateTagline.js'
import path from 'path'
import Package from '../models/Package.js'

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
    const {
      businessId,
      type,
      packageId,
      packageIds,
      description,
      numberOfPosts,
    } = req.body

    if (!businessId) {
      return res.status(400).json({
        message: 'Business is required',
      })
    }

    const selectedPackageIds = Array.isArray(packageIds)
      ? packageIds.filter(Boolean)
      : packageId
        ? [packageId]
        : []

    if (type === '2' && selectedPackageIds.length === 0) {
      return res.status(400).json({
        message: 'At least one package is required',
      })
    }

    const count = parseInt(numberOfPosts, 10)

    if (Number.isNaN(count) || count < 1) {
      return res.status(400).json({
        message: 'Number of posts must be greater than 0',
      })
    }

    let business = null
    let packageOptions = []
    let imageQuery = ''
    let promptData = {}

    business = await Business.findById(businessId)

      if (!business) {
        return res.status(404).json({
          message: 'Business not found',
        })
      }

      if (type === '2') {
        packageOptions = await Package.find({
          _id: { $in: selectedPackageIds },
        })

        if (packageOptions.length === 0) {
          return res.status(404).json({
            message: 'Package not found',
          })
        }
      }

      imageQuery = `${business.category}`

      promptData = {
        name: business.name,
        category: business.category,
        description: business.description,
        services: business.services,
      }

    const images = await getBusinessImages(
      imageQuery,
      Math.max(count, 10)
    )

    const posts = []
    const errors = []

    for (let i = 0; i < count; i++) {
      try {
        let text = ''

        const packageDataForPost =
          type === '2' && packageOptions.length > 0
            ? packageOptions[i % packageOptions.length]
            : null

        if (type === '2') {
          text = await generateTagline(promptData)
        } else {
          text = await generateCaption(promptData)
        }

        const image =
          images.length > 0
            ? images[i % images.length]
            : null


        const backgroundUrl = image?.urls?.regular || image?.urls?.small

        const logoPath =
          business?.logo
            ? path.join(
              process.cwd(),
              business.logo.replace(/^\//, '')
            )
            : null

        const imagePath = await classicPost({
          businessName: business.name,
          tagline: text,
          packages: type === '2' ? packageOptions : [packageDataForPost],
          packageData: packageDataForPost,
          logoUrl: logoPath,
          backgroundUrl,
          phones: business.phones,
          website: business.website,
          email: business.email,
          officeAddress: business.officeAddress,
          socialLinks: business.socialLinks,
        })

        posts.push({
          caption: text,
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
      ...(packageOptions.length > 0 && {
        packages: packageOptions.map((pkg) => ({
          id: pkg._id,
          title: pkg.title,
          price: pkg.price,
        })),
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

// generate general posts 
// export async function generatePosts(req, res) {
//   try {
//     const {
//       postType = 'business',
//       businessId,
//       description,
//       numberOfPosts,
//     } = req.body

//     if (postType === 'business' && !businessId) {
//       return res.status(400).json({ message: 'Business is required' })
//     }

//     if (postType === 'instant' && !description?.trim()) {
//       return res.status(400).json({ message: 'Description is required' })
//     }

//     const count = parseInt(numberOfPosts, 10)

//     if (Number.isNaN(count) || count < 1) {
//       return res.status(400).json({ message: 'numberOfPosts must be a positive number' })
//     }

//     let business = null
//     let imageQuery = ''
//     let captionData = {}

//     if (postType === 'business') {
//       business = await Business.findById(businessId)

//       if (!business) {
//         return res.status(404).json({ message: 'Business not found' })
//       }

//       imageQuery = `${business.category} ${business.description}`

//       captionData = {
//         name: business.name,
//         category: business.category,
//         description: business.description,
//         services: business.services,
//         logoUrl: business.logo
//           ? `${req.protocol}://${req.get('host')}${business.logo}`
//           : null,
//       }

//     } else {
//       imageQuery = description

//       captionData = {
//         name: 'Instant Post',
//         category: 'Custom',
//         description,
//         logoUrl: null,
//       }
//     }

//     const images = await getBusinessImages(imageQuery, Math.max(count, 10))

//     const posts = []
//     const errors = []

//     for (let i = 0; i < count; i++) {
//       try {
//         const caption = await generateCaption(captionData)

//         const image =
//           images.length > 0 ? images[i % images.length] : null

//         const backgroundUrl =
//           image?.urls?.regular ||
//           image?.urls?.small ||
//           getFallbackImage()


//         console.log('business.logo:', business?.logo)

//         const logoPath = business?.logo
//           ? path.join(process.cwd(), business.logo.replace(/^\//, ''))
//           : null

//         console.log('resolved logoPath:', logoPath)

//         // 🔥 THIS IS THE IMPORTANT PART
//         const imagePath = await generatePostImage({
//           businessName: captionData.name,
//           description: caption,
//           logoUrl: logoPath,
//           backgroundUrl,
//         })

//         posts.push({
//           caption,
//           imageUrl: `${req.protocol}://${req.get('host')}${imagePath}`,
//         })
//       } catch (err) {
//         posts.push({
//           imageUrl: getFallbackImage(),
//           caption: null,
//           error: err.message,
//         })

//         errors.push(err.message)
//       }
//     }

//     return res.json({
//       postType,
//       ...(business && {
//         business: {
//           id: business._id,
//           name: business.name,
//         },
//       }),
//       posts,
//       ...(errors.length > 0 && { warnings: errors }),
//     })
//   } catch (err) {
//     return res.status(500).json({ message: err.message })
//   }
// }



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

// export async function generatePosts(req, res) {
//   try {
//     const {
//       postType = 'business',
//       businessId,
//       description,
//       numberOfPosts,
//     } = req.body

//     if (postType === 'business' && !businessId) {
//       return res.status(400).json({
//         message: 'Business is required',
//       })
//     }

//     if (postType === 'instant' && !description?.trim()) {
//       return res.status(400).json({
//         message: 'Description is required',
//       })
//     }

//     const count = parseInt(numberOfPosts, 10)

//     if (Number.isNaN(count) || count < 1) {
//       return res.status(400).json({
//         message: 'numberOfPosts must be a positive number',
//       })
//     }

//     let business = null
//     let imageQuery = ''
//     let captionData = {}

//     if (postType === 'business') {
//       business = await Business.findById(businessId)

//       if (!business) {
//         return res.status(404).json({
//           message: 'Business not found',
//         })
//       }

//       imageQuery = `${business.category} ${business.description}`

//       captionData = {
//         name: business.name,
//         category: business.category,
//         description: business.description,
//       }
//     } else {
//       imageQuery = description

//       captionData = {
//         name: 'Instant Post',
//         category: 'Custom',
//         description,
//       }
//     }

//     // Fetch multiple images once
//     const images = await getBusinessImages(imageQuery, Math.max(count, 10))

//     const posts = []
//     const errors = []

//     for (let i = 0; i < count; i++) {
//       try {
//         const caption = await generateCaption(captionData)

//         const image =
//           images.length > 0
//             ? images[i % images.length]
//             : null

//         const imageUrl =
//           image?.urls?.regular ||
//           image?.urls?.small ||
//           getFallbackImage()

//         posts.push({
//           imageUrl,
//           caption,
//         })
//       } catch (err) {
//         posts.push({
//           imageUrl: getFallbackImage(),
//           caption: null,
//           error: err.message,
//         })

//         errors.push(err.message)
//       }
//     }

//     return res.json({
//       postType,
//       ...(business && {
//         business: {
//           id: business._id,
//           name: business.name,
//         },
//       }),
//       posts,
//       ...(errors.length > 0 && {
//         warnings: errors,
//       }),
//     })
//   } catch (err) {
//     return res.status(500).json({
//       message: err.message,
//     })
//   }
// }


