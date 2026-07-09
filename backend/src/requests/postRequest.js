export default function postRequest({ businessId, type, packageIds, numberOfPosts }) {
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

    if (type === '2' && !ids.length) {
        throw new Error('At least one package is required')
    }
}