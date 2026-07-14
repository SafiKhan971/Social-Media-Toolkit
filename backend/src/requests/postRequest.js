export default function postRequest({ businessId, type, packageIds, numberOfPosts, description, seasonalType, beforeImage, afterImage }) {
    if (!businessId) {
        throw new Error('Business is required')
    }

    const count = Number(numberOfPosts)

    if (!count || count < 1) {
        throw new Error('Number of posts must be greater than 0')
    }

    const ids = [
        ...(Array.isArray(packageIds) ? packageIds : []),
    ]

    if (type === 'offer' && !ids.length) {
        throw new Error('At least one offer is required')
    }

    if (type === 'announcement' && !description) {
        throw new Error('Description is required')
    }

    if (type === 'before_after' && !beforeImage) {
        throw new Error('Before image is required')
    }

    if (type === 'before_after' && !afterImage) {
        throw new Error('After image is required')
    }

    if (type === 'seasonal' && !seasonalType) {
        throw new Error('Seasonal type is required')
    }
}