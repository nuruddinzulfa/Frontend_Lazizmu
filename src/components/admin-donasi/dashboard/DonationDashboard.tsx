'use client'

import API_URL from '@/lib/api'
import { useCallback, useEffect, useMemo, useState } from 'react'

type PaymentStatus =
  | 'pending'
  | 'settlement'
  | 'capture'
  | 'success'
  | 'failed'
  | 'expire'
  | 'cancel'
  | 'deny'
  | string

interface Campaign {
  id: number
  title: string
}

interface Donation {
  id: number
  donor_name: string
  email: string | null
  phone: string | null
  amount: string | number
  message: string | null
  anonymous: boolean
  order_id: string
  payment_status: PaymentStatus
  payment_method: string | null
  transaction_id: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
  campaign?: Campaign | null
}

interface DonationListResponse {
  success: boolean
  message?: string
  data: Donation[]
}

interface ZakatTransaction {
  id: number
  zakat_type: 'profesi' | 'maal'
  payer_name: string
  email: string | null
  phone: string | null
  amount: string | number
  order_id: string
  payment_status: PaymentStatus
  payment_method: string | null
  transaction_id: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

interface ZakatListResponse {
  success: boolean
  message?: string
  data:
    | ZakatTransaction[]
    | {
        data?: ZakatTransaction[]
      }
}

type CombinedTransaction = {
  key: string
  name: string
  type: 'Donasi' | 'Zakat'
  programOrZakat: string
  amount: number
  paymentStatus: PaymentStatus
  paymentMethod: string | null
  createdAt: string
}

const SUCCESS_STATUSES = new Set([
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

function toNumber(value: string | number) {
  const parsed = Number(value)

  return Number.isFinite(parsed)
    ? parsed
    : 0
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string | null) {
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

function statusLabel(status: string) {
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

function statusClass(status: string) {
  if (SUCCESS_STATUSES.has(status)) {
    return 'bg-green-100 text-green-700'
  }

  if (status === 'pending') {
    return 'bg-yellow-100 text-yellow-700'
  }

  return 'bg-red-100 text-red-700'
}

export default function DonationDashboard() {
  const [donations, setDonations] =
    useState<Donation[]>([])

  const [zakatTransactions, setZakatTransactions] =
    useState<ZakatTransaction[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const loadTransactions = useCallback(
    async () => {
      try {
        setLoading(true)
        setError(null)

        const token = getToken()

        const [
          donationResponse,
          zakatResponse,
        ] = await Promise.all([
          fetch(
            `${API_URL}/admin/donations`,
            {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          fetch(
            `${API_URL}/admin/zakat-transactions`,
            {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ])

        const donationData: DonationListResponse =
          await donationResponse.json()

        const zakatData: ZakatListResponse =
          await zakatResponse.json()

        if (!donationResponse.ok) {
          throw new Error(
            donationData.message ||
              'Gagal mengambil data donasi.'
          )
        }

        if (!zakatResponse.ok) {
          throw new Error(
            zakatData.message ||
              'Gagal mengambil data zakat.'
          )
        }

        setDonations(
          Array.isArray(donationData.data)
            ? donationData.data
            : []
        )

        let zakatList: ZakatTransaction[] = []

        if (Array.isArray(zakatData.data)) {
          zakatList = zakatData.data
        } else if (
          zakatData.data &&
          Array.isArray(zakatData.data.data)
        ) {
          zakatList = zakatData.data.data
        }

        setZakatTransactions(zakatList)
      } catch (err) {
        console.error(err)

        setError(
          err instanceof Error
            ? err.message
            : 'Gagal mengambil data transaksi.'
        )
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  const successfulDonations =
    useMemo(
      () =>
        donations.filter((item) =>
          SUCCESS_STATUSES.has(
            item.payment_status
          )
        ),
      [donations]
    )

  const successfulZakat =
    useMemo(
      () =>
        zakatTransactions.filter((item) =>
          SUCCESS_STATUSES.has(
            item.payment_status
          )
        ),
      [zakatTransactions]
    )

  const totalSuccessfulFunds =
    useMemo(
      () =>
        successfulDonations.reduce(
          (total, item) =>
            total + toNumber(item.amount),
          0
        ) +
        successfulZakat.reduce(
          (total, item) =>
            total + toNumber(item.amount),
          0
        ),
      [
        successfulDonations,
        successfulZakat,
      ]
    )

  const successfulCount =
    successfulDonations.length +
    successfulZakat.length

  const totalTransactionCount =
    donations.length +
    zakatTransactions.length

  const pendingCount =
    useMemo(
      () =>
        donations.filter(
          (item) =>
            item.payment_status ===
            'pending'
        ).length +
        zakatTransactions.filter(
          (item) =>
            item.payment_status ===
            'pending'
        ).length,
      [
        donations,
        zakatTransactions,
      ]
    )

  const failedCount =
    useMemo(
      () =>
        donations.filter(
          (item) =>
            !SUCCESS_STATUSES.has(
              item.payment_status
            ) &&
            item.payment_status !==
              'pending'
        ).length +
        zakatTransactions.filter(
          (item) =>
            !SUCCESS_STATUSES.has(
              item.payment_status
            ) &&
            item.payment_status !==
              'pending'
        ).length,
      [
        donations,
        zakatTransactions,
      ]
    )

  const latestTransactions =
    useMemo<CombinedTransaction[]>(
      () => {
        const donationRows: CombinedTransaction[] =
          donations.map((donation) => ({
            key: `donation-${donation.id}`,
            name: donation.anonymous
              ? 'Hamba Allah'
              : donation.donor_name,
            type: 'Donasi',
            programOrZakat:
              donation.campaign?.title || '-',
            amount:
              toNumber(donation.amount),
            paymentStatus:
              donation.payment_status,
            paymentMethod:
              donation.payment_method,
            createdAt:
              donation.created_at,
          }))

        const zakatRows: CombinedTransaction[] =
          zakatTransactions.map((transaction) => ({
            key: `zakat-${transaction.id}`,
            name:
              transaction.payer_name,
            type: 'Zakat',
            programOrZakat:
              transaction.zakat_type === 'maal'
                ? 'Zakat Maal'
                : 'Zakat Penghasilan',
            amount:
              toNumber(transaction.amount),
            paymentStatus:
              transaction.payment_status,
            paymentMethod:
              transaction.payment_method,
            createdAt:
              transaction.created_at,
          }))

        return [
          ...donationRows,
          ...zakatRows,
        ]
          .sort(
            (a, b) =>
              new Date(
                b.createdAt
              ).getTime() -
              new Date(
                a.createdAt
              ).getTime()
          )
          .slice(0, 10)
      },
      [
        donations,
        zakatTransactions,
      ]
    )

  const campaignSummary =
    useMemo(() => {
      const map = new Map<
        number,
        {
          id: number
          title: string
          total: number
          transactions: number
        }
      >()

      for (const donation of successfulDonations) {
        const campaignId =
          donation.campaign?.id ?? 0

        const title =
          donation.campaign?.title ??
          'Campaign tidak diketahui'

        const current =
          map.get(campaignId) ?? {
            id: campaignId,
            title,
            total: 0,
            transactions: 0,
          }

        current.total += toNumber(
          donation.amount
        )

        current.transactions += 1

        map.set(
          campaignId,
          current
        )
      }

      return [...map.values()]
        .sort(
          (a, b) =>
            b.total - a.total
        )
        .slice(0, 5)
    }, [successfulDonations])

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#F58220] border-t-transparent" />

          <p className="text-sm text-gray-500">
            Memuat dashboard donasi...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-2xl bg-gradient-to-r from-[#F58220] to-[#E87516] p-6 text-white shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Dashboard Admin Donasi
            </h1>

            <p className="mt-1 text-sm text-white/90">
              Ringkasan transaksi donasi dan zakat LAZISMU Pemalang.
            </p>
          </div>

          <button
            type="button"
            onClick={loadTransactions}
            className="rounded-xl bg-white/15 px-4 py-2 text-xs font-semibold transition hover:bg-white/20"
          >
            Muat Ulang
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* STATISTIK */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Dana Berhasil"
          value={formatRupiah(
            totalSuccessfulFunds
          )}
          description={`${successfulCount} transaksi berhasil`}
          valueClass="text-[#F58220]"
        />

        <StatCard
          label="Total Transaksi"
          value={String(
            totalTransactionCount
          )}
          description="Seluruh transaksi tercatat"
          valueClass="text-blue-600"
        />

        <StatCard
          label="Pending"
          value={String(
            pendingCount
          )}
          description="Menunggu pembayaran"
          valueClass="text-yellow-600"
        />

        <StatCard
          label="Gagal / Tidak Selesai"
          value={String(
            failedCount
          )}
          description="Gagal, batal, ditolak, atau kedaluwarsa"
          valueClass="text-red-600"
        />
      </div>

      {/* DONASI TERBARU */}
      <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-bold text-gray-900">
            Transaksi Terbaru
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            10 transaksi donasi dan zakat terbaru
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Tanggal
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Nama
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Program / Jenis Zakat
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Jenis
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Nominal
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Metode
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {latestTransactions.map(
                (transaction) => (
                  <tr
                    key={transaction.key}
                    className="hover:bg-orange-50/30"
                  >
                    <td className="px-5 py-4 text-xs text-gray-500">
                      {formatDate(
                        transaction.createdAt
                      )}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-900">
                      {transaction.name}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {
                        transaction.programOrZakat
                      }
                    </td>

                    <td className="px-5 py-4">
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

                    <td className="px-5 py-4 font-semibold text-[#F58220]">
                      {formatRupiah(
                        transaction.amount
                      )}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {
                        transaction.paymentMethod ||
                        '-'
                      }
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(
                          transaction.paymentStatus
                        )}`}
                      >
                        {statusLabel(
                          transaction.paymentStatus
                        )}
                      </span>
                    </td>
                  </tr>
                )
              )}

              {latestTransactions.length ===
                0 && (
                <tr>
                  <td
                    colSpan={7}
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

      {/* RINGKASAN */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-gray-900">
            Status Transaksi
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Kondisi transaksi pembayaran saat ini
          </p>

          <div className="mt-5 space-y-4">
            <SummaryRow
              label="Berhasil"
              value={
                successfulCount
              }
            />

            <Divider />

            <SummaryRow
              label="Pending"
              value={pendingCount}
            />

            <Divider />

            <SummaryRow
              label="Tidak Selesai"
              value={failedCount}
            />

            <Divider />

            <SummaryRow
              label="Total Transaksi"
              value={totalTransactionCount}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-gray-900">
            Campaign dengan Donasi Terbesar
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Berdasarkan transaksi pembayaran yang berhasil
          </p>

          <div className="mt-5 space-y-4">
            {campaignSummary.map(
              (campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {campaign.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {campaign.transactions}{' '}
                      transaksi
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-bold text-[#F58220]">
                    {formatRupiah(
                      campaign.total
                    )}
                  </p>
                </div>
              )
            )}

            {campaignSummary.length ===
              0 && (
              <p className="text-sm text-gray-400">
                Belum ada donasi berhasil.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  description,
  valueClass,
}: {
  label: string
  value: string
  description: string
  valueClass: string
}) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium text-gray-500">
        {label}
      </p>

      <p
        className={`mt-2 text-xl font-bold ${valueClass}`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {description}
      </p>
    </div>
  )
}

function SummaryRow({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="font-semibold text-gray-900">
        {value}
      </span>
    </div>
  )
}

function Divider() {
  return (
    <div className="h-px bg-gray-100" />
  )
}