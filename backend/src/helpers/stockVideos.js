import axios from 'axios'
import { downloadFile } from './unsplash.js'

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

function pickUnused(items, usedUrls) {
  return shuffle(items).find(item => item?.url && !usedUrls.has(item.url)) || null
}

function pickPexelsFile(video) {
  const files = (video.video_files || []).filter(file => {
    const type = String(file.file_type || file.link || '').toLowerCase()
    const quality = String(file.quality || '').toLowerCase()
    return type.includes('mp4') && quality !== 'hls'
  })

  if (!files.length) return null

  const scored = files.map(file => {
    const width = file.width || 0
    const height = file.height || 0
    const pixels = width * height
    const portrait = height > width
    const tooBig = pixels > 1920 * 1080 * 1.4
    const tooSmall = pixels > 0 && pixels < 480 * 854
    return { file, portrait, tooBig, tooSmall, sizeScore: Math.abs(width - 1080) }
  })

  scored.sort((a, b) => {
    if (a.tooSmall !== b.tooSmall) return a.tooSmall ? 1 : -1
    if (a.portrait !== b.portrait) return a.portrait ? -1 : 1
    if (a.tooBig !== b.tooBig) return a.tooBig ? 1 : -1
    return a.sizeScore - b.sizeScore
  })

  return scored[0]?.file || null
}

async function searchPexelsVideos(query, count = 8) {
  if (!process.env.PEXELS_API_KEY?.trim()) return []

  async function search(orientation) {
    const response = await axios.get('https://api.pexels.com/v1/videos/search', {
      params: {
        query,
        per_page: Math.min(count, 80),
        ...(orientation ? { orientation } : {}),
        size: 'small',
      },
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
      timeout: 15000,
    })

    return (response.data.videos || [])
      .map(video => {
        const file = pickPexelsFile(video)
        if (!file?.link) return null
        return {
          url: file.link,
          thumbnail: video.image,
          duration: video.duration || 0,
        }
      })
      .filter(Boolean)
  }

  try {
    const portrait = await search('portrait')
    if (portrait.length) return portrait
    return search(null)
  } catch (err) {
    console.error('Pexels video search failed:', err.message)
    return []
  }
}

function pickPixabayFile(hit) {
  const videos = hit.videos || {}
  const candidates = ['medium', 'large', 'small', 'tiny']
    .map(key => videos[key])
    .filter(file => file?.url)

  if (!candidates.length) return null

  candidates.sort((a, b) => {
    const aPortrait = (a.height || 0) > (a.width || 0)
    const bPortrait = (b.height || 0) > (b.width || 0)
    if (aPortrait !== bPortrait) return aPortrait ? -1 : 1
    return Math.abs((a.width || 0) - 1080) - Math.abs((b.width || 0) - 1080)
  })

  return candidates[0]
}

async function searchPixabayVideos(query, count = 8) {
  if (!process.env.PIXABAY_API_KEY?.trim()) return []

  try {
    const response = await axios.get('https://pixabay.com/api/videos/', {
      params: {
        key: process.env.PIXABAY_API_KEY,
        q: query,
        video_type: 'all',
        safesearch: 'true',
        per_page: Math.min(Math.max(count, 3), 20),
      },
      timeout: 15000,
    })

    return (response.data.hits || [])
      .map(hit => {
        const file = pickPixabayFile(hit)
        if (!file?.url) return null
        return {
          url: file.url,
          thumbnail: hit.videos?.tiny?.url ? null : hit.picture_id,
          duration: hit.duration || 0,
        }
      })
      .filter(Boolean)
  } catch (err) {
    console.error('Pixabay video search failed:', err.message)
    return []
  }
}

export async function findRelatedVideo(query, usedUrls = new Set()) {
  const [pexels, pixabay] = await Promise.all([
    searchPexelsVideos(query),
    searchPixabayVideos(query),
  ])

  return pickUnused([...pexels, ...pixabay], usedUrls)
}

export async function downloadVideo(url, destPath) {
  return downloadFile(url, destPath, { timeout: 60000 })
}
