import API_URL from '../lib/api'


/*
|--------------------------------------------------------------------------
| USER TYPES
|--------------------------------------------------------------------------
*/

export type AdminUserRole =
  | 'Super Admin'
  | 'Admin Donasi'
  | 'Admin Konten'


export type AdminUserStatus =
  | 'active'
  | 'inactive'


export interface AdminUser {
  id: number
  name: string
  email: string
  phone: string | null
  photo: string | null
  status: AdminUserStatus
  role: AdminUserRole
  created_at: string
  updated_at: string
}


/*
|--------------------------------------------------------------------------
| CREATE USER PAYLOAD
|--------------------------------------------------------------------------
*/

export interface CreateAdminUserPayload {
  name: string
  email: string
  phone?: string
  password: string
  password_confirmation: string
  role: AdminUserRole
  status: AdminUserStatus
  photo?: File | null
}


/*
|--------------------------------------------------------------------------
| UPDATE USER PAYLOAD
|--------------------------------------------------------------------------
*/

export interface UpdateAdminUserPayload {
  name: string
  email: string
  phone?: string
  password?: string
  password_confirmation?: string
  role: AdminUserRole
  status: AdminUserStatus
  photo?: File | null
}


/*
|--------------------------------------------------------------------------
| API RESPONSE
|--------------------------------------------------------------------------
*/

interface UsersResponse {
  success: boolean
  message: string
  data: AdminUser[]
}


interface UserResponse {
  success: boolean
  message: string
  data: AdminUser
}


/*
|--------------------------------------------------------------------------
| AUTH HEADERS
|--------------------------------------------------------------------------
*/

function getAuthHeaders(): HeadersInit {
  const token =
    localStorage.getItem('token')

  return {
    Accept: 'application/json',

    ...(token
      ? {
          Authorization:
            `Bearer ${token}`,
        }
      : {}),
  }
}


/*
|--------------------------------------------------------------------------
| GET ADMIN USERS
|--------------------------------------------------------------------------
|
| GET /api/admin/users
|
*/

export async function getAdminUsers(): Promise<
  AdminUser[]
> {
  const response = await fetch(
    `${API_URL}/admin/users`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  )

  let data: UsersResponse

  try {
    data = await response.json()
  } catch {
    throw new Error(
      'Response server tidak valid.'
    )
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        'Gagal mengambil daftar pengguna.'
    )
  }

  return data.data
}


/*
|--------------------------------------------------------------------------
| GET ADMIN USER
|--------------------------------------------------------------------------
|
| GET /api/admin/users/{id}
|
*/

export async function getAdminUser(
  id: number
): Promise<AdminUser> {
  const response = await fetch(
    `${API_URL}/admin/users/${id}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  )

  let data: UserResponse

  try {
    data = await response.json()
  } catch {
    throw new Error(
      'Response server tidak valid.'
    )
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        'Gagal mengambil detail pengguna.'
    )
  }

  return data.data
}


/*
|--------------------------------------------------------------------------
| CREATE ADMIN USER
|--------------------------------------------------------------------------
|
| POST /api/admin/users
|
*/

export async function createAdminUser(
  payload: CreateAdminUserPayload
): Promise<AdminUser> {
  const formData = new FormData()

  formData.append(
    'name',
    payload.name
  )

  formData.append(
    'email',
    payload.email
  )

  formData.append(
    'password',
    payload.password
  )

  formData.append(
    'password_confirmation',
    payload.password_confirmation
  )

  formData.append(
    'role',
    payload.role
  )

  formData.append(
    'status',
    payload.status
  )

  if (payload.phone) {
    formData.append(
      'phone',
      payload.phone
    )
  }

  if (payload.photo) {
    formData.append(
      'photo',
      payload.photo
    )
  }

  const response = await fetch(
    `${API_URL}/admin/users`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    }
  )

  let data: UserResponse

  try {
    data = await response.json()
  } catch {
    throw new Error(
      'Response server tidak valid.'
    )
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        'Gagal menambahkan pengguna.'
    )
  }

  return data.data
}


/*
|--------------------------------------------------------------------------
| UPDATE ADMIN USER
|--------------------------------------------------------------------------
|
| POST /api/admin/users/{id}
|
| Digunakan untuk:
|
| - nama
| - email
| - nomor telepon
| - password
| - role
| - status
| - foto
|
*/

export async function updateAdminUser(
  id: number,
  payload: UpdateAdminUserPayload
): Promise<AdminUser> {
  const formData = new FormData()

  formData.append(
    'name',
    payload.name
  )

  formData.append(
    'email',
    payload.email
  )

  formData.append(
    'phone',
    payload.phone || ''
  )

  formData.append(
    'role',
    payload.role
  )

  formData.append(
    'status',
    payload.status
  )

  /*
  |--------------------------------------------------------------------------
  | PASSWORD
  |--------------------------------------------------------------------------
  |
  | Password hanya dikirim jika diisi.
  |
  */

  if (payload.password) {
    formData.append(
      'password',
      payload.password
    )

    formData.append(
      'password_confirmation',
      payload.password_confirmation || ''
    )
  }

  /*
  |--------------------------------------------------------------------------
  | PHOTO
  |--------------------------------------------------------------------------
  */

  if (payload.photo) {
    formData.append(
      'photo',
      payload.photo
    )
  }

  const response = await fetch(
    `${API_URL}/admin/users/${id}`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    }
  )

  let data: UserResponse

  try {
    data = await response.json()
  } catch {
    throw new Error(
      'Response server tidak valid.'
    )
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        'Gagal memperbarui pengguna.'
    )
  }

  return data.data
}


/*
|--------------------------------------------------------------------------
| UPDATE ADMIN USER STATUS
|--------------------------------------------------------------------------
|
| POST /api/admin/users/{id}
|
| Mengubah:
|
| active   -> inactive
| inactive -> active
|
*/

export async function updateAdminUserStatus(
  user: AdminUser,
  status: AdminUserStatus
): Promise<AdminUser> {
  const formData = new FormData()

  /*
  |--------------------------------------------------------------------------
  | USER DATA
  |--------------------------------------------------------------------------
  */

  formData.append(
    'name',
    user.name
  )

  formData.append(
    'email',
    user.email
  )

  formData.append(
    'phone',
    user.phone || ''
  )

  formData.append(
    'role',
    user.role
  )

  formData.append(
    'status',
    status
  )

  /*
  |--------------------------------------------------------------------------
  | REQUEST
  |--------------------------------------------------------------------------
  */

  const response = await fetch(
    `${API_URL}/admin/users/${user.id}`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    }
  )

  let data: UserResponse

  try {
    data = await response.json()
  } catch {
    throw new Error(
      'Response server tidak valid.'
    )
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        'Gagal mengubah status pengguna.'
    )
  }

  return data.data
}


/*
|--------------------------------------------------------------------------
| DELETE ADMIN USER
|--------------------------------------------------------------------------
|
| DELETE /api/admin/users/{id}
|
| Menghapus user/admin.
|
*/

export async function deleteAdminUser(
  id: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/admin/users/${id}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }
  )

  let data: {
    success: boolean
    message: string
  }

  try {
    data = await response.json()
  } catch {
    throw new Error(
      'Response server tidak valid.'
    )
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        'Gagal menghapus pengguna.'
    )
  }
}