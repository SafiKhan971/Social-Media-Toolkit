import path from 'path'
import Business from '../models/Business.js'
import Package from '../models/Package.js'
import { createError } from '../utils/createError.js'

export function validateRequest(data) {
  const {
    businessId,
    type,
    packageId,
    packageIds,
    numberOfPosts,
  } = data

  if (!businessId) {
    throw createError(400, 'Business is required')
  }

  const count = Number(numberOfPosts)

  if (!count || count < 1) {
    throw createError(
      400,
      'Number of posts must be greater than 0'
    )
  }

  const ids = [
    ...(Array.isArray(packageIds) ? packageIds : []),
    ...(packageId ? [packageId] : []),
  ]

  if (type === '2' && !ids.length) {
    throw createError(
      400,
      'At least one package is required'
    )
  }
}

export async function getBusiness(id) {
  const business = await Business.findById(id)

  if (!business) {
    throw createError(404, 'Business not found')
  }

  return business
}

export async function getPackages(
  type,
  packageId,
  packageIds
) {
  if (type !== '2') return []

  const ids = [
    ...(Array.isArray(packageIds) ? packageIds : []),
    ...(packageId ? [packageId] : []),
  ]

  const packages = await Package.find({
    _id: { $in: ids },
  })

  if (!packages.length) {
    throw createError(404, 'Package not found')
  }

  return packages
}

export function buildPromptData(business) {
  return {
    name: business.name,
    category: business.category,
    description: business.description,
    services: business.services,
  }
}

export function getLogoPath(logo) {
  if (!logo) return null

  return path.join(
    process.cwd(),
    logo.replace(/^\//, '')
  )
}