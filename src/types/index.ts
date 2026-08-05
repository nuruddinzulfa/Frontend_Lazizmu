export interface User {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface Campaign {
  id: string
  title: string
  category: string
  description: string
  image: string
  target: number
  collected: number
  createdAt: string
  featured: boolean
}

export interface News {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  image: string
  date: string
  featured: boolean
}

export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  image: string
  author: string
  date: string
  readTime: string
}

export interface Publication {
  id: string
  title: string
  type: 'Laporan Keuangan' | 'Laporan Tahunan' | 'Laporan Program'
  period: string
  fileSize: string
  fileUrl: string
  year: number
}

export interface Donation {
  id: string
  userId: string
  campaignId: string
  campaignTitle: string
  amount: number
  paymentMethod: string
  status: 'Berhasil' | 'Pending' | 'Gagal'
  date: string
}

export interface PaymentMethod {
  id: string
  name: string
  code: string
  logo: string
  type: 'bank' | 'ewallet' | 'qris'
}

export interface DashboardStats {
  totalDonation: number
  transactionCount: number
  zakatPaid: number
  infaqTotal: number
}

export interface DonationSummary {
  month: string
  amount: number
}

export interface Certificate {
  id: string
  type: string
  amount: number
  date: string
  fileUrl: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  totalPages: number
  total: number
}
