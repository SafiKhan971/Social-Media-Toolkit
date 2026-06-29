import api from './api'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/packages`

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})

export async function getPackages(page = 1, businessId = '') {
  const params = {
    page,
  }

  if (businessId) {
    params.business = businessId
  }

  const response = await api.get(API_URL, {
    ...getAuthConfig(),
    params,
  })

  return response.data
}

export async function getPackageById(id) {
  const response = await api.get(`${API_URL}/${id}`, getAuthConfig())

  return response.data
}

export async function createPackage(packageData) {
  const response = await api.post(
    API_URL,
    packageData,
    getAuthConfig()
  )

  return response.data
}

export async function updatePackage(id, packageData) {
  const response = await api.put(
    `${API_URL}/${id}`,
    packageData,
    getAuthConfig()
  )

  return response.data
}

export async function deletePackage(id) {
  const response = await api.delete(
    `${API_URL}/${id}`,
    getAuthConfig()
  )

  return response.data
}