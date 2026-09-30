import axios from 'axios'
import { downloadImage, getFallbackImage, getUnsplashImageUrl, searchUnsplashImages } from './unsplash.js'

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

function isStockUrl(url) {
  return Boolean(url) && !String(url).includes('picsum.photos')
}

function pickUnused(urls, usedUrls) {
  return shuffle(urls.filter(isStockUrl)).find(url => !usedUrls.has(url)) || null
}

async function searchUnsplashUrls(query, count = 8) {
  if (!process.env.UNSPLASH_ACCESS_KEY?.trim()) return []

  const results = await searchUnsplashImages(query, {
    count,
    orientation: 'portrait',
    fallback: false,
  })

  return results.map(getUnsplashImageUrl).filter(isStockUrl)
}

async function searchPexelsUrls(query, count = 8) {
  if (!process.env.PEXELS_API_KEY?.trim()) return []

  try {
    const response = await axios.get('https://api.pexels.com/v1/search', {
      params: {
        query,
        per_page: Math.min(count, 80),
        orientation: 'portrait',
      },
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
      timeout: 15000,
    })

    return (response.data.photos || [])
      .map(photo => photo.src?.portrait || photo.src?.large2x || photo.src?.large)
      .filter(Boolean)
  } catch (err) {
    console.error('Pexels search failed:', err.message)
    return []
  }
}

async function searchPixabayUrls(query, count = 8) {
  if (!process.env.PIXABAY_API_KEY?.trim()) return []

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: process.env.PIXABAY_API_KEY,
        q: query,
        orientation: 'vertical',
        image_type: 'photo',
        safesearch: 'true',
        per_page: Math.min(Math.max(count, 3), 20),
      },
      timeout: 15000,
    })

    return (response.data.hits || [])
      .map(hit => hit.largeImageURL || hit.webformatURL)
      .filter(Boolean)
  } catch (err) {
    console.error('Pixabay search failed:', err.message)
    return []
  }
}

export function picsumPortraitUrl(seed = Date.now()) {
  return `${getFallbackImage(1080, 1920)}?random=${seed}`
}

export async function findRelatedImageUrl(query, usedUrls = new Set(), seed = Date.now()) {
  const [unsplashUrls, pexelsUrls] = await Promise.all([
    searchUnsplashUrls(query),
    searchPexelsUrls(query),
  ])

  const primary = pickUnused([...unsplashUrls, ...pexelsUrls], usedUrls)
  if (primary) return primary

  const pixabayUrls = await searchPixabayUrls(query)
  const secondary = pickUnused(pixabayUrls, usedUrls)
  if (secondary) return secondary

  return picsumPortraitUrl(seed)
}

export { downloadImage }
