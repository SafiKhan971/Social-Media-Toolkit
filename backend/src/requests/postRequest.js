export default function postRequest({ businessId, type, packageIds, numberOfPosts, description, seasonalType, beforeImage, afterImage, backgroundImage, customDescription, customBackground }) {
  if (!businessId) {
    throw new Error('Business is required')
  }

  const count = Number(numberOfPosts)

  if (!count || count < 1) {
    throw new Error('Number of posts must be greater than 0')
  }

  const ids = [...(Array.isArray(packageIds) ? packageIds : [])]

  if (type === 'offer' && !ids.length) {
    throw new Error('At least one offer is required')
  }

  if (type === 'offer' && ids.length > 3) {
    throw new Error('Maximum 3 offers can be selected')
  }

  if (type === 'announcement' && !description) {
    throw new Error('Description is required')
  }

  if (customDescription == true && !description) {
    throw new Error('Description is required')
  }

  if (type === 'before_after' && !beforeImage) {
    throw new Error('Before image is required')
  }

  if (type === 'before_after' && !afterImage) {
    throw new Error('After image is required')
  }

  if (customBackground == true && !backgroundImage) {
    throw new Error('Background image is required')
  }

  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

  if (beforeImage && !ALLOWED_MIME_TYPES.includes(beforeImage.mimetype)) {
    throw new Error(`Before image must be a JPEG, PNG, or WEBP image`)
  }

  if (afterImage && !ALLOWED_MIME_TYPES.includes(afterImage.mimetype)) {
    throw new Error(`After image must be a JPEG, PNG, or WEBP image`)
  }

  if (backgroundImage && !ALLOWED_MIME_TYPES.includes(backgroundImage.mimetype)) {
    throw new Error(`Background image must be a JPEG, PNG, or WEBP image`)
  }

  if (type === 'seasonal' && !seasonalType) {
    throw new Error('Seasonal type is required')
  }
}
