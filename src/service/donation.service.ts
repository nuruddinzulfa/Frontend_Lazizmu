import API_URL from '@/lib/api'

export interface Donation {
  id: number
  campaign_id: number
  donor_name: string
  email: string | null
  phone: string | null
  amount: number | string
  message: string | null
  anonymous: boolean
  order_id: string
  transaction_id: string | null
  snap_token: string | null
  payment_method: string | null
  payment_status:
    | 'pending'
    | 'settlement'
    | 'capture'
    | 'deny'
    | 'cancel'
    | 'expire'
    | 'failure'
  paid_at: string | null
  created_at: string
  updated_at: string
  campaign?: {
    id: number
    name?: string
    title?: string
  } | null
}

interface DonationListResponse {
  success: boolean
  message: string
  data: Donation[]
}

interface DonationResponse {
  success: boolean
  message: string
  data: Donation
}

function getToken(): string {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('Anda belum login.')
  }

  return token
}

export async function getAdminDonations(): Promise<Donation[]> {
  const token = getToken()

  const response = await fetch(
    `${API_URL}/admin/donations`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data: DonationListResponse =
    await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Gagal mengambil daftar donasi.'
    )
  }

  return data.data
}

export async function getDonationById(
  id: number
): Promise<Donation> {
  const token = getToken()

  const response = await fetch(
    `${API_URL}/admin/donations/${id}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data: DonationResponse =
    await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Gagal mengambil detail donasi.'
    )
  }

  return data.data
}