import API_URL from '@/lib/api'

/*
|--------------------------------------------------------------------------
| TYPE
|--------------------------------------------------------------------------
*/

export type PublicationType =
  | 'Laporan Keuangan'
  | 'Laporan Tahunan'
  | 'Laporan Program'

/*
|--------------------------------------------------------------------------
| MODEL
|--------------------------------------------------------------------------
*/

export interface FinancialReport {
  id: number
  title: string
  type: PublicationType
  year: number
  description: string | null
  thumbnail: string | null
  file: string
  status: 'draft' | 'published'
  published_at: string | null
  created_by: number | null
  updated_by: number | null
  created_at: string
  updated_at: string
}

/*
|--------------------------------------------------------------------------
| PAYLOAD
|--------------------------------------------------------------------------
*/

export interface FinancialReportPayload {
  title: string
  type: PublicationType
  year: number
  description?: string
  thumbnail?: File | null
  file?: File | null
  status: 'draft' | 'published'
}

/*
|--------------------------------------------------------------------------
| RESPONSE
|--------------------------------------------------------------------------
*/

interface ReportListResponse {
  success: boolean
  message: string
  data: FinancialReport[]
}

interface ReportResponse {
  success: boolean
  message: string
  data: FinancialReport
}

/*
|--------------------------------------------------------------------------
| HELPER - TOKEN
|--------------------------------------------------------------------------
*/

function getToken(): string {
  if (typeof window === 'undefined') {
    throw new Error(
      'Akses hanya dapat dilakukan dari browser.'
    )
  }

  const token =
    localStorage.getItem('token')

  if (!token) {
    throw new Error(
      'Anda belum login.'
    )
  }

  return token
}

/*
|--------------------------------------------------------------------------
| HELPER - ERROR RESPONSE
|--------------------------------------------------------------------------
*/

async function getErrorMessage(
  response: Response,
  defaultMessage: string
): Promise<string> {
  try {
    const data =
      await response.json()

    if (
      data.errors &&
      typeof data.errors ===
        'object'
    ) {
      const errors =
        Object.values(
          data.errors
        ) as string[][]

      const firstError =
        errors
          .flat()
          .find(Boolean)

      if (firstError) {
        return firstError
      }
    }

    if (data.message) {
      return data.message
    }
  } catch {
    // Response bukan JSON
  }

  return defaultMessage
}

/*
|--------------------------------------------------------------------------
| HELPER - BUILD FORM DATA
|--------------------------------------------------------------------------
*/

function buildFormData(
  payload: FinancialReportPayload
): FormData {
  const formData =
    new FormData()

  formData.append(
    'title',
    payload.title
  )

  formData.append(
    'type',
    payload.type
  )

  formData.append(
    'year',
    String(payload.year)
  )

  formData.append(
    'description',
    payload.description || ''
  )

  formData.append(
    'status',
    payload.status
  )

  if (payload.thumbnail) {
    formData.append(
      'thumbnail',
      payload.thumbnail
    )
  }

  if (payload.file) {
    formData.append(
      'file',
      payload.file
    )
  }

  return formData
}

/*
|--------------------------------------------------------------------------
| ADMIN - GET ALL
|--------------------------------------------------------------------------
*/

export async function getAdminReports(): Promise<
  FinancialReport[]
> {
  const token = getToken()

  const response =
    await fetch(
      `${API_URL}/admin/financial-reports`,
      {
        method: 'GET',

        headers: {
          Accept:
            'application/json',

          Authorization:
            `Bearer ${token}`,
        },
      }
    )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Gagal mengambil daftar publikasi.'
      )
    )
  }

  const data:
    ReportListResponse =
      await response.json()

  return data.data
}

/*
|--------------------------------------------------------------------------
| ADMIN - GET DETAIL
|--------------------------------------------------------------------------
*/

export async function getAdminReportById(
  id: number
): Promise<FinancialReport> {
  const token = getToken()

  const response =
    await fetch(
      `${API_URL}/admin/financial-reports/${id}`,
      {
        method: 'GET',

        headers: {
          Accept:
            'application/json',

          Authorization:
            `Bearer ${token}`,
        },
      }
    )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Gagal mengambil detail publikasi.'
      )
    )
  }

  const data:
    ReportResponse =
      await response.json()

  return data.data
}

/*
|--------------------------------------------------------------------------
| ADMIN - CREATE
|--------------------------------------------------------------------------
*/

export async function createReport(
  payload:
    FinancialReportPayload
): Promise<FinancialReport> {
  const token = getToken()

  const formData =
    buildFormData(payload)

  const response =
    await fetch(
      `${API_URL}/admin/financial-reports`,
      {
        method: 'POST',

        headers: {
          Accept:
            'application/json',

          Authorization:
            `Bearer ${token}`,
        },

        body: formData,
      }
    )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Gagal membuat publikasi.'
      )
    )
  }

  const data:
    ReportResponse =
      await response.json()

  return data.data
}

/*
|--------------------------------------------------------------------------
| ADMIN - UPDATE
|--------------------------------------------------------------------------
*/

export async function updateReport(
  id: number,
  payload:
    FinancialReportPayload
): Promise<FinancialReport> {
  const token = getToken()

  const formData =
    buildFormData(payload)

  const response =
    await fetch(
      `${API_URL}/admin/financial-reports/${id}`,
      {
        method: 'POST',

        headers: {
          Accept:
            'application/json',

          Authorization:
            `Bearer ${token}`,
        },

        body: formData,
      }
    )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Gagal memperbarui publikasi.'
      )
    )
  }

  const data:
    ReportResponse =
      await response.json()

  return data.data
}

/*
|--------------------------------------------------------------------------
| ADMIN - DELETE
|--------------------------------------------------------------------------
*/

export async function deleteReport(
  id: number
): Promise<void> {
  const token = getToken()

  const response =
    await fetch(
      `${API_URL}/admin/financial-reports/${id}`,
      {
        method: 'DELETE',

        headers: {
          Accept:
            'application/json',

          Authorization:
            `Bearer ${token}`,
        },
      }
    )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Gagal menghapus publikasi.'
      )
    )
  }
}

/*
|--------------------------------------------------------------------------
| PUBLIC - GET ALL
|--------------------------------------------------------------------------
*/

export async function getPublicReports(): Promise<
  FinancialReport[]
> {
  const response =
    await fetch(
      `${API_URL}/financial-reports`,
      {
        method: 'GET',

        headers: {
          Accept:
            'application/json',
        },

        cache: 'no-store',
      }
    )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Gagal mengambil laporan publik.'
      )
    )
  }

  const data:
    ReportListResponse =
      await response.json()

  return data.data
}

/*
|--------------------------------------------------------------------------
| PUBLIC - GET DETAIL
|--------------------------------------------------------------------------
*/

export async function getPublicReportById(
  id: number
): Promise<FinancialReport> {
  const response =
    await fetch(
      `${API_URL}/financial-reports/${id}`,
      {
        method: 'GET',

        headers: {
          Accept:
            'application/json',
        },

        cache: 'no-store',
      }
    )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Gagal mengambil detail laporan publik.'
      )
    )
  }

  const data:
    ReportResponse =
      await response.json()

  return data.data
}

/*
|--------------------------------------------------------------------------
| HELPER - STORAGE URL
|--------------------------------------------------------------------------
*/

function getStorageUrl(
  path: string | null
): string | null {
  if (!path) {
    return null
  }

  if (
    path.startsWith(
      'http://'
    ) ||
    path.startsWith(
      'https://'
    )
  ) {
    return path
  }

  const cleanPath =
    path
      .replace(
        /^\/+/,
        ''
      )
      .replace(
        /^storage\//,
        ''
      )

  const backendUrl =
    API_URL.replace(
      /\/api\/?$/,
      ''
    )

  return `${backendUrl}/storage/${cleanPath}`
}

/*
|--------------------------------------------------------------------------
| FILE URL
|--------------------------------------------------------------------------
*/

export function getReportFileUrl(
  file: string | null
): string | null {
  return getStorageUrl(file)
}

/*
|--------------------------------------------------------------------------
| THUMBNAIL URL
|--------------------------------------------------------------------------
*/

export function getReportThumbnailUrl(
  thumbnail: string | null
): string | null {
  return getStorageUrl(
    thumbnail
  )
}