import API_URL from '@/lib/api'

export interface OrganizationUser {
  id: number
  name: string
  email: string
}

export interface OrganizationProfile {
  id: number
  name: string
  tagline: string | null
  description: string | null
  history: string | null
  vision: string | null
  mission: string | null
  logo: string | null
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
  status: 'active' | 'inactive'
  created_by: number | null
  updated_by: number | null
  created_at: string
  updated_at: string

  creator?: OrganizationUser | null
  updater?: OrganizationUser | null
}

export interface OrganizationProfilePayload {
  name: string
  tagline?: string
  description?: string
  history?: string
  vision?: string
  mission?: string
  logo?: File | null
  address?: string
  phone?: string
  email?: string
  website?: string
  status: 'active' | 'inactive'
}

interface ProfileListResponse {
  success: boolean
  message: string
  data: OrganizationProfile[]
}

interface ProfileResponse {
  success: boolean
  message: string
  data: OrganizationProfile
}

function getToken(): string {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('Anda belum login.')
  }

  return token
}

/*
|--------------------------------------------------------------------------
| ADMIN - GET ALL
|--------------------------------------------------------------------------
*/

export async function getAdminOrganizationProfiles(): Promise<
  OrganizationProfile[]
> {
  const token = getToken()

  const response = await fetch(
    `${API_URL}/admin/organization-profile`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data: ProfileListResponse =
    await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Gagal mengambil profil organisasi.'
    )
  }

  return data.data
}

/*
|--------------------------------------------------------------------------
| ADMIN - GET DETAIL
|--------------------------------------------------------------------------
*/

export async function getAdminOrganizationProfileById(
  id: number
): Promise<OrganizationProfile> {
  const token = getToken()

  const response = await fetch(
    `${API_URL}/admin/organization-profile/${id}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data: ProfileResponse =
    await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Gagal mengambil detail profil organisasi.'
    )
  }

  return data.data
}

/*
|--------------------------------------------------------------------------
| ADMIN - CREATE
|--------------------------------------------------------------------------
*/

export async function createOrganizationProfile(
  payload: OrganizationProfilePayload
): Promise<OrganizationProfile> {
  const token = getToken()

  const formData = new FormData()

  formData.append(
    'name',
    payload.name
  )

  formData.append(
    'tagline',
    payload.tagline || ''
  )

  formData.append(
    'description',
    payload.description || ''
  )

  formData.append(
    'history',
    payload.history || ''
  )

  formData.append(
    'vision',
    payload.vision || ''
  )

  formData.append(
    'mission',
    payload.mission || ''
  )

  formData.append(
    'address',
    payload.address || ''
  )

  formData.append(
    'phone',
    payload.phone || ''
  )

  formData.append(
    'email',
    payload.email || ''
  )

  formData.append(
    'website',
    payload.website || ''
  )

  formData.append(
    'status',
    payload.status
  )

  if (payload.logo) {
    formData.append(
      'logo',
      payload.logo
    )
  }

  const response = await fetch(
    `${API_URL}/admin/organization-profile`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  )

  const data: ProfileResponse =
    await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Gagal membuat profil organisasi.'
    )
  }

  return data.data
}

/*
|--------------------------------------------------------------------------
| ADMIN - UPDATE
|--------------------------------------------------------------------------
*/

export async function updateOrganizationProfile(
  id: number,
  payload: OrganizationProfilePayload
): Promise<OrganizationProfile> {
  const token = getToken()

  const formData = new FormData()

  formData.append(
    'name',
    payload.name
  )

  formData.append(
    'tagline',
    payload.tagline || ''
  )

  formData.append(
    'description',
    payload.description || ''
  )

  formData.append(
    'history',
    payload.history || ''
  )

  formData.append(
    'vision',
    payload.vision || ''
  )

  formData.append(
    'mission',
    payload.mission || ''
  )

  formData.append(
    'address',
    payload.address || ''
  )

  formData.append(
    'phone',
    payload.phone || ''
  )

  formData.append(
    'email',
    payload.email || ''
  )

  formData.append(
    'website',
    payload.website || ''
  )

  formData.append(
    'status',
    payload.status
  )

  if (payload.logo) {
    formData.append(
      'logo',
      payload.logo
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Laravel multipart update
  |--------------------------------------------------------------------------
  |
  | Backend menyediakan POST /{id} khusus untuk multipart/form-data.
  |
  */

  const response = await fetch(
    `${API_URL}/admin/organization-profile/${id}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  )

  const data: ProfileResponse =
    await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Gagal memperbarui profil organisasi.'
    )
  }

  return data.data
}

/*
|--------------------------------------------------------------------------
| ADMIN - DELETE
|--------------------------------------------------------------------------
*/

export async function deleteOrganizationProfile(
  id: number
): Promise<void> {
  const token = getToken()

  const response = await fetch(
    `${API_URL}/admin/organization-profile/${id}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data =
    await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Gagal menghapus profil organisasi.'
    )
  }
}

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

export async function getPublicOrganizationProfile(): Promise<
  OrganizationProfile
> {
  const response = await fetch(
    `${API_URL}/organization-profile`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }
  )

  const data: ProfileResponse =
    await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Gagal mengambil profil organisasi.'
    )
  }

  return data.data
}

/*
|--------------------------------------------------------------------------
| LOGO URL
|--------------------------------------------------------------------------
*/

export function getOrganizationLogoUrl(
  logo: string | null
): string | null {
  if (!logo) {
    return null
  }

  if (
    logo.startsWith('http://') ||
    logo.startsWith('https://')
  ) {
    return logo
  }

  const backendUrl =
    API_URL.replace(/\/api\/?$/, '')

  return `${backendUrl}/storage/${logo}`
}