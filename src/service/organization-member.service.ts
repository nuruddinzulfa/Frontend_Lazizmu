import API_URL from '@/lib/api'

export interface OrganizationMemberUser {
  id: number
  name: string
  email: string
}

export interface OrganizationMember {
  id: number
  name: string
  position: string
  photo: string | null
  description: string | null
  period: string | null
  email: string | null
  phone: string | null
  sort_order: number
  status: 'active' | 'inactive'
  created_by: number | null
  updated_by: number | null
  created_at: string
  updated_at: string

  creator?: OrganizationMemberUser | null
  updater?: OrganizationMemberUser | null
}

export interface OrganizationMemberPayload {
  name: string
  position: string
  photo?: File | null
  description?: string
  period?: string
  email?: string
  phone?: string
  sort_order?: number
  status: 'active' | 'inactive'
}

interface MemberListResponse {
  success: boolean
  message: string
  data: OrganizationMember[]
}

interface MemberResponse {
  success: boolean
  message: string
  data: OrganizationMember
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

export async function getAdminOrganizationMembers(): Promise<
  OrganizationMember[]
> {
  const token = getToken()

  const response = await fetch(
    `${API_URL}/admin/organization-members`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data: MemberListResponse =
    await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Gagal mengambil daftar pengurus.'
    )
  }

  return data.data
}

/*
|--------------------------------------------------------------------------
| ADMIN - GET DETAIL
|--------------------------------------------------------------------------
*/

export async function getAdminOrganizationMemberById(
  id: number
): Promise<OrganizationMember> {
  const token = getToken()

  const response = await fetch(
    `${API_URL}/admin/organization-members/${id}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data: MemberResponse =
    await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Gagal mengambil detail pengurus.'
    )
  }

  return data.data
}

/*
|--------------------------------------------------------------------------
| ADMIN - CREATE
|--------------------------------------------------------------------------
*/

export async function createOrganizationMember(
  payload: OrganizationMemberPayload
): Promise<OrganizationMember> {
  const token = getToken()

  const formData = new FormData()

  formData.append(
    'name',
    payload.name
  )

  formData.append(
    'position',
    payload.position
  )

  formData.append(
    'description',
    payload.description || ''
  )

  formData.append(
    'period',
    payload.period || ''
  )

  formData.append(
    'email',
    payload.email || ''
  )

  formData.append(
    'phone',
    payload.phone || ''
  )

  formData.append(
    'sort_order',
    String(
      payload.sort_order ?? 0
    )
  )

  formData.append(
    'status',
    payload.status
  )

  if (payload.photo) {
    formData.append(
      'photo',
      payload.photo
    )
  }

  const response = await fetch(
    `${API_URL}/admin/organization-members`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  )

  const data: MemberResponse =
    await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Gagal menambahkan pengurus.'
    )
  }

  return data.data
}

/*
|--------------------------------------------------------------------------
| ADMIN - UPDATE
|--------------------------------------------------------------------------
*/

export async function updateOrganizationMember(
  id: number,
  payload: OrganizationMemberPayload
): Promise<OrganizationMember> {
  const token = getToken()

  const formData = new FormData()

  formData.append(
    'name',
    payload.name
  )

  formData.append(
    'position',
    payload.position
  )

  formData.append(
    'description',
    payload.description || ''
  )

  formData.append(
    'period',
    payload.period || ''
  )

  formData.append(
    'email',
    payload.email || ''
  )

  formData.append(
    'phone',
    payload.phone || ''
  )

  formData.append(
    'sort_order',
    String(
      payload.sort_order ?? 0
    )
  )

  formData.append(
    'status',
    payload.status
  )

  if (payload.photo) {
    formData.append(
      'photo',
      payload.photo
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Laravel multipart update
  |--------------------------------------------------------------------------
  */

  const response = await fetch(
    `${API_URL}/admin/organization-members/${id}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  )

  const data: MemberResponse =
    await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Gagal memperbarui pengurus.'
    )
  }

  return data.data
}

/*
|--------------------------------------------------------------------------
| ADMIN - DELETE
|--------------------------------------------------------------------------
*/

export async function deleteOrganizationMember(
  id: number
): Promise<void> {
  const token = getToken()

  const response = await fetch(
    `${API_URL}/admin/organization-members/${id}`,
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
        'Gagal menghapus pengurus.'
    )
  }
}

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

export async function getPublicOrganizationMembers(): Promise<
  OrganizationMember[]
> {
  const response = await fetch(
    `${API_URL}/organization-members`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }
  )

  const data: MemberListResponse =
    await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Gagal mengambil pengurus organisasi.'
    )
  }

  return data.data
}

/*
|--------------------------------------------------------------------------
| PHOTO URL
|--------------------------------------------------------------------------
*/

export function getOrganizationMemberPhotoUrl(
  photo: string | null
): string | null {
  if (!photo) {
    return null
  }

  if (
    photo.startsWith('http://') ||
    photo.startsWith('https://')
  ) {
    return photo
  }

  const backendUrl =
    API_URL.replace(/\/api\/?$/, '')

  const cleanPhoto = photo
    .replace(/^\/+/, '')
    .replace(/^storage\//, '')

  return `${backendUrl}/storage/${cleanPhoto}`
}