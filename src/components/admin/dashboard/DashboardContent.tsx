'use client'

import API_URL from '@/lib/api'
import { useCallback, useEffect, useMemo, useState } from 'react'

type PaymentStatus = string

interface CampaignRef {
  id: number
  title: string
}

interface Donation {
  id: number
  donor_name: string
  amount: string | number
  payment_status: PaymentStatus
  created_at: string
  updated_at?: string
  campaign?: CampaignRef | null
}

interface ZakatTransaction {
  id: number
  zakat_type: 'profesi' | 'maal'
  payer_name: string
  amount: string | number
  payment_status: PaymentStatus
  created_at: string
  updated_at?: string
  order_id?: string
}

type RecentTransaction = {
  key: string
  name: string
  type: 'Donasi' | 'Zakat'
  source: string
  amount: number
  payment_status: PaymentStatus
  created_at: string
}

interface Campaign {
  id: number
  title: string
  status?: string
  featured?: boolean
  created_at?: string
  updated_at?: string
}

interface Program {
  id: number
  title: string
  status?: string
  created_at?: string
  updated_at?: string
}

interface News {
  id: number
  title: string
  status?: string
  created_at?: string
  updated_at?: string
}

interface Article {
  id: number
  title: string
  status?: string
  created_at?: string
  updated_at?: string
}

interface AdminUser {
  id: number
  name: string
  email: string
  status: string
  role?: string | null
  created_at: string
  updated_at?: string
}

interface ApiListResponse<T> {
  data?: T[] | { data?: T[] }
  message?: string
}

type DashboardActivity = {
  key: string
  label: string
  description: string
  timestamp: string
  dotClass: string
}

const SUCCESS_PAYMENT_STATUSES = new Set([
  'settlement',
  'capture',
  'success',
])

function getToken(): string {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('Anda belum login.')
  }

  return token
}

function normalizeList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[]
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload
  ) {
    const data = (payload as ApiListResponse<T>).data

    if (Array.isArray(data)) {
      return data
    }

    if (
      data &&
      typeof data === 'object' &&
      'data' in data &&
      Array.isArray(data.data)
    ) {
      return data.data
    }
  }

  return []
}

async function adminGet<T>(path: string): Promise<T[]> {
  const token = getToken()

  const response = await fetch(
    `${API_URL}${path}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  let payload: unknown = null

  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    let message = 'Gagal mengambil data dashboard.'

    if (
      payload &&
      typeof payload === 'object' &&
      'message' in payload &&
      typeof (payload as { message?: unknown }).message === 'string'
    ) {
      message = (payload as { message: string }).message
    }

    throw new Error(message)
  }

  return normalizeList<T>(payload)
}

function toAmount(value: string | number | null | undefined) {
  const numberValue = Number(value ?? 0)

  return Number.isFinite(numberValue)
    ? numberValue
    : 0
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function formatRelativeTime(value: string | null | undefined) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  const diffMs = Date.now() - date.getTime()
  const diffSeconds = Math.max(
    0,
    Math.floor(diffMs / 1000)
  )

  if (diffSeconds < 60) {
    return 'Baru saja'
  }

  const minutes = Math.floor(diffSeconds / 60)

  if (minutes < 60) {
    return `${minutes} menit lalu`
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours} jam lalu`
  }

  const days = Math.floor(hours / 24)

  if (days < 30) {
    return `${days} hari lalu`
  }

  return formatDate(value)
}

function isPublished(status?: string | null) {
  return (
    status === 'published' ||
    status === 'active'
  )
}

function paymentStatusLabel(status: string) {
  switch (status) {
    case 'settlement':
    case 'capture':
    case 'success':
      return 'Berhasil'
    case 'pending':
      return 'Pending'
    case 'failed':
      return 'Gagal'
    case 'expire':
      return 'Kedaluwarsa'
    case 'cancel':
      return 'Dibatalkan'
    case 'deny':
      return 'Ditolak'
    default:
      return status || '-'
  }
}

function paymentStatusClass(status: string) {
  if (SUCCESS_PAYMENT_STATUSES.has(status)) {
    return 'bg-green-50 text-green-800 ring-green-600/25'
  }

  if (status === 'pending') {
    return 'bg-amber-50 text-amber-900 ring-amber-600/30'
  }

  if (
    status === 'failed' ||
    status === 'expire' ||
    status === 'cancel' ||
    status === 'deny'
  ) {
    return 'bg-red-50 text-red-800 ring-red-600/25'
  }

  // Status tidak dikenali: tampilkan netral, label tetap memakai nilai asli.
  return 'bg-gray-100 text-gray-700 ring-gray-500/25'
}

type StatIconName =
  | 'rupiah'
  | 'transactions'
  | 'campaign'
  | 'users'

// Design tokens (class string statis agar terdeteksi Tailwind)
const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B84E08] focus-visible:ring-offset-2'
const CARD =
  'rounded-2xl border border-[#F3DEC8] bg-white shadow-sm'
const SECTION_TITLE =
  'text-lg font-semibold leading-snug text-gray-900'
const SECTION_DESC = 'mt-1 text-sm text-gray-500'
const TH =
  'px-4 py-3 text-left text-xs font-semibold text-gray-600 sm:px-5'
const TD = 'px-4 py-3.5 sm:px-5'

export default function DashboardContent() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [zakatTransactions, setZakatTransactions] =
    useState<ZakatTransaction[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [news, setNews] = useState<News[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [
        donationData,
        zakatData,
        campaignData,
        programData,
        newsData,
        articleData,
        userData,
      ] = await Promise.all([
        adminGet<Donation>('/admin/donations'),
        adminGet<ZakatTransaction>('/admin/zakat-transactions'),
        adminGet<Campaign>('/admin/campaigns'),
        adminGet<Program>('/admin/programs'),
        adminGet<News>('/admin/news'),
        adminGet<Article>('/admin/articles'),
        adminGet<AdminUser>('/admin/users'),
      ])

      setDonations(donationData)
      setZakatTransactions(zakatData)
      setCampaigns(campaignData)
      setPrograms(programData)
      setNews(newsData)
      setArticles(articleData)
      setUsers(userData)
      setHasLoaded(true)
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil data dashboard.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const successfulDonations = useMemo(
    () =>
      donations.filter((donation) =>
        SUCCESS_PAYMENT_STATUSES.has(
          donation.payment_status
        )
      ),
    [donations]
  )

  const successfulZakat = useMemo(
    () =>
      zakatTransactions.filter((transaction) =>
        SUCCESS_PAYMENT_STATUSES.has(
          transaction.payment_status
        )
      ),
    [zakatTransactions]
  )

  const totalSuccessfulAmount = useMemo(
    () =>
      successfulDonations.reduce(
        (total, donation) =>
          total + toAmount(donation.amount),
        0
      ) +
      successfulZakat.reduce(
        (total, transaction) =>
          total + toAmount(transaction.amount),
        0
      ),
    [
      successfulDonations,
      successfulZakat,
    ]
  )

  const totalTransactions =
    donations.length +
    zakatTransactions.length

  const successfulTransactionCount =
    successfulDonations.length +
    successfulZakat.length

  const pendingTransactions = useMemo(
    () =>
      donations.filter(
        (donation) =>
          donation.payment_status === 'pending'
      ).length +
      zakatTransactions.filter(
        (transaction) =>
          transaction.payment_status === 'pending'
      ).length,
    [
      donations,
      zakatTransactions,
    ]
  )

  const activeCampaigns = useMemo(
    () =>
      campaigns.filter((campaign) =>
        isPublished(campaign.status)
      ).length,
    [campaigns]
  )

  const activeUsers = useMemo(
    () =>
      users.filter(
        (user) => user.status === 'active'
      ).length,
    [users]
  )

  const publishedPrograms = useMemo(
    () =>
      programs.filter((program) =>
        isPublished(program.status)
      ).length,
    [programs]
  )

  const publishedNews = useMemo(
    () =>
      news.filter((item) =>
        isPublished(item.status)
      ).length,
    [news]
  )

  const publishedArticles = useMemo(
    () =>
      articles.filter((item) =>
        isPublished(item.status)
      ).length,
    [articles]
  )

  const recentTransactions = useMemo<RecentTransaction[]>(
    () => {
      const donationRows: RecentTransaction[] =
        donations.map((donation) => ({
          key: `donation-${donation.id}`,
          name:
            donation.donor_name || 'Anonim',
          type: 'Donasi',
          source:
            donation.campaign?.title || '-',
          amount:
            toAmount(donation.amount),
          payment_status:
            donation.payment_status,
          created_at:
            donation.created_at,
        }))

      const zakatRows: RecentTransaction[] =
        zakatTransactions.map((transaction) => ({
          key: `zakat-${transaction.id}`,
          name:
            transaction.payer_name || '-',
          type: 'Zakat',
          source:
            transaction.zakat_type === 'maal'
              ? 'Zakat Maal'
              : 'Zakat Penghasilan',
          amount:
            toAmount(transaction.amount),
          payment_status:
            transaction.payment_status,
          created_at:
            transaction.created_at,
        }))

      return [
        ...donationRows,
        ...zakatRows,
      ]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )
        .slice(0, 8)
    },
    [
      donations,
      zakatTransactions,
    ]
  )

  const activities = useMemo<DashboardActivity[]>(() => {
    const data: DashboardActivity[] = []

    const latestDonation = [...donations].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )[0]

    if (latestDonation) {
      data.push({
        key: `donation-${latestDonation.id}`,
        label: 'Donasi terbaru',
        description:
          latestDonation.campaign?.title ||
          'Donasi masuk ke sistem',
        timestamp: latestDonation.created_at,
        dotClass: 'bg-[#F58220]',
      })
    }

    const latestZakat = [...zakatTransactions].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )[0]

    if (latestZakat) {
      data.push({
        key: `zakat-${latestZakat.id}`,
        label: 'Zakat terbaru',
        description:
          latestZakat.zakat_type === 'maal'
            ? 'Zakat Maal'
            : 'Zakat Penghasilan',
        timestamp: latestZakat.created_at,
        dotClass: 'bg-emerald-600',
      })
    }

    const latestProgram = [...programs].sort(
      (a, b) =>
        new Date(
          b.updated_at || b.created_at || 0
        ).getTime() -
        new Date(
          a.updated_at || a.created_at || 0
        ).getTime()
    )[0]

    if (
      latestProgram &&
      (latestProgram.updated_at ||
        latestProgram.created_at)
    ) {
      data.push({
        key: `program-${latestProgram.id}`,
        label: 'Program terbaru',
        description: latestProgram.title,
        timestamp:
          latestProgram.updated_at ||
          latestProgram.created_at ||
          '',
        dotClass: 'bg-sky-600',
      })
    }

    const latestUser = [...users].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )[0]

    if (latestUser) {
      data.push({
        key: `user-${latestUser.id}`,
        label: 'Pengguna terbaru',
        description: latestUser.name,
        timestamp: latestUser.created_at,
        dotClass: 'bg-gray-500',
      })
    }

    const latestArticle = [...articles].sort(
      (a, b) =>
        new Date(
          b.updated_at || b.created_at || 0
        ).getTime() -
        new Date(
          a.updated_at || a.created_at || 0
        ).getTime()
    )[0]

    if (
      latestArticle &&
      (latestArticle.updated_at ||
        latestArticle.created_at)
    ) {
      data.push({
        key: `article-${latestArticle.id}`,
        label: 'Artikel terbaru',
        description: latestArticle.title,
        timestamp:
          latestArticle.updated_at ||
          latestArticle.created_at ||
          '',
        dotClass: 'bg-violet-500',
      })
    }

    return data
      .filter((item) => item.timestamp)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() -
          new Date(a.timestamp).getTime()
      )
      .slice(0, 4)
  }, [
    donations,
    zakatTransactions,
    programs,
    users,
    articles,
  ])

  const adminStats: {
    label: string
    value: string
    description: string
    icon: StatIconName
    iconClass: string
  }[] = [
    {
      label: 'Total Dana Berhasil',
      value: formatRupiah(totalSuccessfulAmount),
      description:
        `${successfulTransactionCount} transaksi berhasil`,
      icon: 'rupiah',
      iconClass: 'bg-[#FEF0E4] text-[#B84E08]',
    },
    {
      label: 'Total Transaksi',
      value: String(totalTransactions),
      description: 'Seluruh transaksi tercatat',
      icon: 'transactions',
      iconClass: 'bg-[#FEF0E4] text-[#B84E08]',
    },
    {
      label: 'Campaign Aktif',
      value: String(activeCampaigns),
      description:
        'Campaign berstatus aktif/terbit',
      icon: 'campaign',
      iconClass: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Total Pengguna',
      value: String(users.length),
      description:
        `${activeUsers} pengguna aktif`,
      icon: 'users',
      iconClass: 'bg-gray-100 text-gray-700',
    },
  ]

  // Gagal memuat dan belum pernah ada data: jangan tampilkan angka 0 seolah valid.
  const dataUnavailable = Boolean(error) && !hasLoaded
  const show = (value: number | string) =>
    dataUnavailable ? '—' : value

  if (loading && !hasLoaded) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-[420px] items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]"
      >
        <div className="text-center">
          <div
            aria-hidden="true"
            className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-[#F58220] motion-reduce:animate-none"
          />

          <p className="text-sm text-gray-600">
            Memuat dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif] text-gray-900 antialiased">
      <section
        aria-labelledby="dashboard-title"
        className="rounded-2xl bg-gradient-to-r from-[#C85A0A] to-[#A94608] p-5 text-white shadow-sm sm:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1
              id="dashboard-title"
              className="text-2xl font-bold leading-tight tracking-tight"
            >
              Assalamu&apos;alaikum, Super Admin
            </h1>

            <p className="mt-1.5 text-sm leading-relaxed text-white/90 sm:text-base">
              Selamat datang di Panel Administrasi Lazismu Pemalang.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            aria-busy={loading}
            className={`inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/40 bg-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#A94608] disabled:cursor-wait disabled:opacity-80 sm:self-center`}
          >
            {loading && (
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none"
              />
            )}
            {loading ? 'Memuat...' : 'Muat Ulang Data'}
          </button>
        </div>
      </section>

      {loading && (
        <p role="status" className="sr-only">
          Memuat ulang data dashboard...
        </p>
      )}

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="min-w-0 break-words">
            <span className="font-semibold">
              Data tidak dapat dimuat.
            </span>{' '}
            {error}
          </p>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className={`shrink-0 self-start rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-semibold text-red-800 transition-colors hover:bg-red-100 disabled:cursor-wait disabled:opacity-70 sm:self-auto ${FOCUS_RING}`}
          >
            Coba lagi
          </button>
        </div>
      )}

      <section
        aria-label="Statistik utama"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {adminStats.map((stat) => (
          <div
            key={stat.label}
            className={`${CARD} flex h-full flex-col p-5`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-gray-600">
                {stat.label}
              </p>

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.iconClass}`}
              >
                <StatIcon name={stat.icon} />
              </div>
            </div>

            <p className="mt-3 break-words text-2xl font-bold leading-tight tracking-tight text-gray-900 tabular-nums">
              {show(stat.value)}
            </p>

            <p className="mt-1.5 text-sm text-gray-500">
              {dataUnavailable
                ? 'Data belum dapat dimuat'
                : stat.description}
            </p>
          </div>
        ))}
      </section>

      <section
        aria-labelledby="recent-transactions-title"
        className={`${CARD} overflow-hidden`}
      >
        <div className="border-b border-gray-100 px-4 py-4 sm:px-5">
          <h2
            id="recent-transactions-title"
            className={SECTION_TITLE}
          >
            Transaksi Terbaru
          </h2>

          <p className={SECTION_DESC}>
            Data transaksi terbaru langsung dari sistem
          </p>
        </div>

        <div
          role="region"
          aria-labelledby="recent-transactions-title"
          tabIndex={0}
          className={`overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B84E08]`}
        >
          <table className="w-full min-w-[820px] text-sm">
            <caption className="sr-only">
              Daftar transaksi donasi dan zakat terbaru
            </caption>

            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className={TH}>
                  Tanggal
                </th>
                <th scope="col" className={TH}>
                  Nama
                </th>
                <th scope="col" className={TH}>
                  Program / Jenis Zakat
                </th>
                <th scope="col" className={TH}>
                  Jenis
                </th>
                <th
                  scope="col"
                  className={`${TH} text-right`}
                >
                  Jumlah
                </th>
                <th scope="col" className={TH}>
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {recentTransactions.map((transaction) => (
                <tr
                  key={transaction.key}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td
                    className={`${TD} whitespace-nowrap text-gray-600 tabular-nums`}
                  >
                    {formatDate(transaction.created_at)}
                  </td>

                  <td
                    className={`${TD} max-w-[220px] truncate font-medium text-gray-900`}
                    title={transaction.name}
                  >
                    {transaction.name}
                  </td>

                  <td
                    className={`${TD} max-w-[260px] truncate text-gray-700`}
                    title={transaction.source}
                  >
                    {transaction.source}
                  </td>

                  <td className={TD}>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                        transaction.type === 'Zakat'
                          ? 'bg-orange-50 text-orange-900 ring-orange-600/25'
                          : 'bg-gray-100 text-gray-700 ring-gray-500/25'
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>

                  <td
                    className={`${TD} whitespace-nowrap text-right font-semibold text-gray-900 tabular-nums`}
                  >
                    {formatRupiah(transaction.amount)}
                  </td>

                  <td className={TD}>
                    <span
                      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${paymentStatusClass(
                        transaction.payment_status
                      )}`}
                    >
                      {paymentStatusLabel(
                        transaction.payment_status
                      )}
                    </span>
                  </td>
                </tr>
              ))}

              {recentTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    {dataUnavailable
                      ? 'Data transaksi tidak dapat dimuat.'
                      : 'Belum ada transaksi.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section
          aria-labelledby="system-summary-title"
          className={`${CARD} p-5`}
        >
          <div className="mb-3">
            <h2
              id="system-summary-title"
              className={SECTION_TITLE}
            >
              Ringkasan Sistem
            </h2>

            <p className={SECTION_DESC}>
              Gambaran umum data administrasi
            </p>
          </div>

          <dl className="divide-y divide-gray-100">
            <SummaryRow
              label="Total Program"
              value={show(programs.length)}
              detail={
                dataUnavailable
                  ? undefined
                  : `${publishedPrograms} terbit`
              }
            />
            <SummaryRow
              label="Campaign Aktif"
              value={show(activeCampaigns)}
              detail={
                dataUnavailable
                  ? undefined
                  : `${campaigns.length} total`
              }
            />
            <SummaryRow
              label="Berita Terbit"
              value={show(publishedNews)}
              detail={
                dataUnavailable
                  ? undefined
                  : `${news.length} total`
              }
            />
            <SummaryRow
              label="Artikel Terbit"
              value={show(publishedArticles)}
              detail={
                dataUnavailable
                  ? undefined
                  : `${articles.length} total`
              }
            />
            <SummaryRow
              label="Total Pengguna"
              value={show(users.length)}
              detail={
                dataUnavailable
                  ? undefined
                  : `${activeUsers} aktif`
              }
            />
          </dl>
        </section>

        <section
          aria-labelledby="recent-activity-title"
          className={`${CARD} p-5`}
        >
          <div className="mb-4">
            <h2
              id="recent-activity-title"
              className={SECTION_TITLE}
            >
              Aktivitas Data Terbaru
            </h2>

            <p className={SECTION_DESC}>
              Dibentuk dari data terbaru yang tersedia di sistem
            </p>
          </div>

          {activities.length > 0 && (
            <ol className="space-y-4">
              {activities.map((activity) => (
                <li
                  key={activity.key}
                  className="flex items-start gap-3"
                >
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${activity.dotClass}`}
                  />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {activity.label}
                    </p>

                    <p className="mt-0.5 break-words text-sm text-gray-600">
                      {activity.description}
                    </p>

                    <time
                      dateTime={activity.timestamp}
                      title={formatDate(activity.timestamp)}
                      className="mt-1 block text-xs text-gray-500"
                    >
                      {formatRelativeTime(activity.timestamp)}
                    </time>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {activities.length === 0 && (
            <p className="text-sm text-gray-500">
              {dataUnavailable
                ? 'Data aktivitas tidak dapat dimuat.'
                : 'Belum ada aktivitas data yang dapat ditampilkan.'}
            </p>
          )}
        </section>
      </div>

      <section
        aria-labelledby="attention-title"
        className={`${CARD} p-5`}
      >
        <div className="mb-4">
          <h2 id="attention-title" className={SECTION_TITLE}>
            Perlu Perhatian
          </h2>

          <p className={SECTION_DESC}>
            Ringkasan kondisi berdasarkan data aktual
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <AttentionItem
            tone="warning"
            title="Transaksi Pending"
            value={show(pendingTransactions)}
            description="transaksi masih menunggu pembayaran"
            hideDescription={dataUnavailable}
          />

          <AttentionItem
            tone="success"
            title="Campaign Aktif"
            value={show(activeCampaigns)}
            description="campaign sedang aktif/terbit"
            hideDescription={dataUnavailable}
          />

          <AttentionItem
            tone="neutral"
            title="Pengguna"
            value={show(users.length)}
            description={`pengguna terdaftar, ${activeUsers} aktif`}
            hideDescription={dataUnavailable}
          />
        </div>
      </section>
    </div>
  )
}

function StatIcon({ name }: { name: StatIconName }) {
  if (name === 'rupiah') {
    return (
      <span
        aria-hidden="true"
        className="text-sm font-bold leading-none"
      >
        Rp
      </span>
    )
  }

  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  if (name === 'transactions') {
    return (
      <svg {...common}>
        <path d="M7 7h13M16 3l4 4-4 4M17 17H4M8 13l-4 4 4 4" />
      </svg>
    )
  }

  if (name === 'campaign') {
    return (
      <svg {...common}>
        <path d="M5 21V4M5 4h12l-2.5 4.5L17 13H5" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M17 14.5c2.6 0 4.5 1.8 4.5 4.5" />
    </svg>
  )
}

function SummaryRow({
  label,
  value,
  detail,
}: {
  label: string
  value: number | string
  detail?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <dt className="text-sm text-gray-600">{label}</dt>

      <dd className="text-right">
        <span className="text-lg font-semibold text-gray-900 tabular-nums">
          {value}
        </span>

        {detail && (
          <span className="block text-xs text-gray-500">
            {detail}
          </span>
        )}
      </dd>
    </div>
  )
}

function AttentionItem({
  tone,
  title,
  value,
  description,
  hideDescription,
}: {
  tone: 'warning' | 'success' | 'neutral'
  title: string
  value: number | string
  description: string
  hideDescription?: boolean
}) {
  const toneClass =
    tone === 'warning'
      ? 'border-amber-200 bg-amber-50'
      : 'border-gray-200 bg-gray-50'

  const valueClass =
    tone === 'warning'
      ? 'text-amber-900'
      : tone === 'success'
        ? 'text-emerald-700'
        : 'text-gray-900'

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <h3 className="text-sm font-semibold text-gray-900">
        {title}
      </h3>

      <p
        className={`mt-2 text-2xl font-bold leading-none tabular-nums ${valueClass}`}
      >
        {value}
      </p>

      {!hideDescription && (
        <p className="mt-1.5 text-sm text-gray-600">
          {description}
        </p>
      )}
    </div>
  )
}
