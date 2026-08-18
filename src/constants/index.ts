export const PROGRAMS = [
  { id: 'beasiswa', label: 'Beasiswa Pendidikan', category: 'Zakat' },
  { id: 'kesehatan', label: 'Bantuan Kesehatan', category: 'Infaq' },
  { id: 'ekonomi', label: 'Pemberdayaan Ekonomi', category: 'Zakat' },
  { id: 'pangan', label: 'Bantuan Pangan', category: 'Sedekah' },
  { id: 'masjid', label: 'Pembangunan Masjid', category: 'Wakaf' },
  { id: 'pertanian', label: 'Pertanian Berkelanjutan', category: 'Infaq' },
  { id: 'bencana', label: 'Tanggap Bencana', category: 'Sedekah' },
  { id: 'wakaf-produktif', label: 'Wakaf Produktif', category: 'Wakaf' },
]

export const PAYMENT_METHODS = [
  { id: 'bca', name: 'Bank BCA', type: 'bank' },
  { id: 'bri', name: 'Bank BRI', type: 'bank' },
  { id: 'bni', name: 'Bank BNI', type: 'bank' },
  { id: 'mandiri', name: 'Bank Mandiri', type: 'bank' },
  { id: 'gopay', name: 'GoPay', type: 'ewallet' },
  { id: 'ovo', name: 'OVO', type: 'ewallet' },
  { id: 'dana', name: 'DANA', type: 'ewallet' },
  { id: 'qris', name: 'QRIS', type: 'qris' },
]

export const ZAKAT_TYPES = [
  { id: 'maal', label: 'Zakat Maal', nisabMultiplier: 85 },
  { id: 'profesi', label: 'Zakat Profesi', nisabMultiplier: 85 },
  { id: 'fitrah', label: 'Zakat Fitrah', fixedAmount: 45000 },
  { id: 'perdagangan', label: 'Zakat Perdagangan', nisabMultiplier: 85 },
  { id: 'pertanian', label: 'Zakat Pertanian', nisabMultiplier: 653 },
]

export const NISAB_GOLD_PRICE = 1000000 // per gram (approximate)

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/admin/login",
    PROFILE: "/admin/profile",
    LOGOUT: "/admin/logout",
  },
  CAMPAIGNS: '/campaigns',
  NEWS: '/news',
  ARTICLES: '/articles',
  PUBLICATIONS: '/publications',
  DONATIONS: '/donations',
  PAYMENT_METHODS: '/payment-methods',
  DASHBOARD: '/dashboard',
  USERS: '/users',
}

export const NAV_ITEMS = [
  { key: 'home', label: 'Beranda' },
  { key: 'about', label: 'Tentang Kami' },
  { key: 'program', label: 'Program' },
  { key: 'berita', label: 'Berita' },
  { key: 'artikel', label: 'Artikel' },
  { key: 'publikasi', label: 'Publikasi' },
  { key: 'donasi', label: 'Donasi' },
]
