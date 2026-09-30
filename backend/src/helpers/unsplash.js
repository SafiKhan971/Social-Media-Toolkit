import axios from 'axios'
import fs from 'fs'
import path from 'path'

export function getFallbackImage(width = 600, height = 400) {
  return `https://picsum.photos/${width}/${height}`
}

export async function searchUnsplashImages(query, { count = 30, orientation = 'squarish', fallback = true } = {}) {
  const size = orientation === 'portrait' ? [1080, 1920] : [1080, 1080]

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        order_by: 'relevant',
        per_page: Math.min(count, 30),
        orientation,
      },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    })

    const images = response.data.results || []

    if (images.length === 0) {
      if (!fallback) return []
      console.log(`No images found for "${query}". Using fallback image.`)
      return [getFallbackImage(...size)]
    }

    return images.sort(() => Math.random() - 0.5)
  } catch (err) {
    console.error(err.message)
    if (!fallback) return []
    console.log('Using fallback image.')
    return [getFallbackImage(...size)]
  }
}

export function getUnsplashImageUrl(image) {
  if (typeof image === 'string') return image
  return image?.urls?.regular || image?.urls?.small || image?.urls?.full || getFallbackImage()
}

export async function downloadFile(url, destPath, { timeout = 20000 } = {}) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout,
    headers: {
      'User-Agent': 'SMT-Shorts/1.0',
    },
  })

  fs.mkdirSync(path.dirname(destPath), { recursive: true })
  fs.writeFileSync(destPath, Buffer.from(response.data))
  return destPath
}

export async function downloadImage(url, destPath) {
  return downloadFile(url, destPath)
}
