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
    return 'bg-green-100 text-green-700'
  }

  if (status === 'pending') {
    return 'bg-yellow-100 text-yellow-700'
  }

  return 'bg-red-100 text-red-700'
}

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
        dotClass: 'bg-emerald-500',
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
        dotClass: 'bg-blue-500',
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
        dotClass: 'bg-green-500',
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
        dotClass: 'bg-purple-500',
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

  const adminStats = [
    {
      label: 'Total Dana Berhasil',
      value: formatRupiah(totalSuccessfulAmount),
      description:
        `${successfulTransactionCount} transaksi berhasil`,
      color: 'text-[#F58220]',
      bg: 'bg-[#FEF0E4]',
    },
    {
      label: 'Total Transaksi',
      value: String(totalTransactions),
      description: 'Seluruh transaksi tercatat',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Campaign Aktif',
      value: String(activeCampaigns),
      description:
        'Campaign berstatus aktif/terbit',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Pengguna',
      value: String(users.length),
      description:
        `${activeUsers} pengguna aktif`,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-[#F58220]" />

          <p className="text-sm text-gray-500">
            Memuat dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-[#F58220] to-[#E87516] p-6 text-white shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1
              className="text-xl font-bold"
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Assalamu&apos;alaikum, Super Admin
            </h1>

            <p className="mt-1 text-sm text-white/90">
              Selamat datang di Panel Administrasi Lazismu Pemalang.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            className="rounded-xl bg-white/15 px-4 py-2 text-xs font-semibold transition hover:bg-white/20"
          >
            Muat Ulang Data
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  {stat.label}
                </p>

                <p
                  className={`mt-2 text-xl font-bold ${stat.color}`}
                  style={{
                    fontFamily:
                      "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {stat.description}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    stat.color === 'text-[#F58220]'
                      ? 'bg-[#F58220]'
                      : stat.color === 'text-blue-600'
                        ? 'bg-blue-600'
                        : stat.color === 'text-green-600'
                          ? 'bg-green-600'
                          : 'bg-purple-600'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Transaksi Terbaru
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Data transaksi terbaru langsung dari sistem
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Tanggal
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Nama
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Program / Jenis Zakat
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Jumlah
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {recentTransactions.map((transaction) => (
                <tr
                  key={transaction.key}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-5 py-3.5 text-xs text-gray-500">
                    {formatDate(transaction.created_at)}
                  </td>

                  <td className="px-5 py-3.5 font-medium text-gray-900">
                    {transaction.name}
                  </td>

                  <td className="px-5 py-3.5 text-gray-700">
                    {transaction.source}
                  </td>

                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        transaction.type === 'Zakat'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 font-semibold text-[#F58220]">
                    {formatRupiah(transaction.amount)}
                  </td>

                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${paymentStatusClass(
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
                    className="px-5 py-10 text-center text-sm text-gray-400"
                  >
                    Belum ada transaksi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2
              className="font-bold text-gray-900"
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Ringkasan Sistem
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Gambaran umum data administrasi
            </p>
          </div>

          <div className="space-y-4">
            <SummaryRow
              label="Total Program"
              value={programs.length}
              detail={`${publishedPrograms} terbit`}
            />
            <Divider />
            <SummaryRow
              label="Campaign Aktif"
              value={activeCampaigns}
              detail={`${campaigns.length} total`}
            />
            <Divider />
            <SummaryRow
              label="Berita Terbit"
              value={publishedNews}
              detail={`${news.length} total`}
            />
            <Divider />
            <SummaryRow
              label="Artikel Terbit"
              value={publishedArticles}
              detail={`${articles.length} total`}
            />
            <Divider />
            <SummaryRow
              label="Total Pengguna"
              value={users.length}
              detail={`${activeUsers} aktif`}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2
              className="font-bold text-gray-900"
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Aktivitas Data Terbaru
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Dibentuk dari data terbaru yang tersedia di sistem
            </p>
          </div>

          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.key}
                className="flex items-start gap-3"
              >
                <div
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${activity.dotClass}`}
                />

                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700">
                    {activity.label}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {activity.description}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {activities.length === 0 && (
              <p className="text-sm text-gray-400">
                Belum ada aktivitas data yang dapat ditampilkan.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Perlu Perhatian
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Ringkasan kondisi berdasarkan data aktual
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-4">
            <div className="text-sm font-semibold text-yellow-800">
              Transaksi Pending
            </div>

            <div className="mt-1 text-xs text-yellow-700">
              {pendingTransactions}{' '}
              transaksi masih menunggu pembayaran
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="text-sm font-semibold text-blue-800">
              Campaign Aktif
            </div>

            <div className="mt-1 text-xs text-blue-700">
              {activeCampaigns}{' '}
              campaign sedang aktif/terbit
            </div>
          </div>

          <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
            <div className="text-sm font-semibold text-purple-800">
              Pengguna
            </div>

            <div className="mt-1 text-xs text-purple-700">
              {users.length}{' '}
              pengguna terdaftar,{' '}
              {activeUsers} aktif
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  detail,
}: {
  label: string
  value: number
  detail?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <div className="text-right">
        <span className="font-semibold text-gray-900">
          {value}
        </span>

        {detail && (
          <p className="mt-0.5 text-[11px] text-gray-400">
            {detail}
          </p>
        )}
      </div>
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-gray-100" />
}