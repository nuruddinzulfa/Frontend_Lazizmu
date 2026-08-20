import { useEffect, useMemo, useState } from 'react'
import {
  getAdminDonations,
  type Donation,
} from '@/service/donation.service'
import { api } from '@/services/api'

type TransactionStatus =
  | 'settlement'
  | 'capture'
  | 'pending'
  | 'failed'
  | 'failure'
  | 'deny'
  | 'cancel'
  | 'cancelled'
  | 'expire'
  | 'expired'
  | string

interface ZakatTransaction {
  id: number
  zakat_type: 'profesi' | 'maal'
  payer_name: string
  email?: string | null
  phone?: string | null
  amount: number | string
  order_id: string
  transaction_id?: string | null
  payment_method?: string | null
  payment_status: TransactionStatus
  paid_at?: string | null
  created_at: string
}

interface ZakatTransactionResponse {
  success: boolean
  message?: string
  data:
    | ZakatTransaction[]
    | {
        data: ZakatTransaction[]
      }
}

interface TransactionRow {
  key: string
  id: number
  orderId: string
  name: string
  programOrType: string
  type: 'Donasi' | 'Zakat'
  amount: number
  createdAt: string
  paymentStatus: TransactionStatus
  rawDonation?: Donation
  rawZakat?: ZakatTransaction
}

const formatRupiah = (amount: number | string) => {
  return 'Rp ' + Number(amount).toLocaleString('id-ID')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getStatusLabel = (
  status: TransactionStatus
) => {
  if (
    status === 'settlement' ||
    status === 'capture'
  ) {
    return 'Berhasil'
  }

  if (status === 'pending') {
    return 'Pending'
  }

  return 'Gagal'
}

const getProgramName = (
  donation: Donation
) => {
  return (
    donation.campaign?.name ||
    donation.campaign?.title ||
    `Campaign #${donation.campaign_id}`
  )
}

const getZakatTypeLabel = (
  type: ZakatTransaction['zakat_type']
) => {
  return type === 'maal'
    ? 'Zakat Maal'
    : 'Zakat Penghasilan'
}

export default function DonationManagement() {
  const [donations, setDonations] =
    useState<Donation[]>([])

  const [zakatTransactions, setZakatTransactions] =
    useState<ZakatTransaction[]>([])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('Semua')
  const [typeFilter, setTypeFilter] =
    useState('Semua')
  const [currentPage, setCurrentPage] =
    useState(1)

  const [loading, setLoading] =
    useState(true)
  const [error, setError] =
    useState('')

  const loadTransactions = async () => {
    try {
      setLoading(true)
      setError('')

      const [
        donationData,
        zakatResponse,
      ] = await Promise.all([
        getAdminDonations(),
        api.get<ZakatTransactionResponse>(
          '/admin/zakat-transactions'
        ),
      ])

      setDonations(donationData)

      if (!zakatResponse.success) {
        throw new Error(
          zakatResponse.message ||
            'Gagal mengambil transaksi zakat.'
        )
      }

      let zakatData: ZakatTransaction[] = []

      if (
        Array.isArray(
          zakatResponse.data
        )
      ) {
        zakatData =
          zakatResponse.data
      } else if (
        zakatResponse.data &&
        Array.isArray(
          zakatResponse.data.data
        )
      ) {
        zakatData =
          zakatResponse.data.data
      }

      setZakatTransactions(zakatData)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Gagal mengambil data transaksi.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  const transactions =
    useMemo<TransactionRow[]>(() => {
      const donationRows: TransactionRow[] =
        donations.map(
          (donation) => ({
            key: `donation-${donation.id}`,
            id: donation.id,
            orderId: donation.order_id,
            name: donation.anonymous
              ? 'Hamba Allah'
              : donation.donor_name,
            programOrType:
              getProgramName(donation),
            type: 'Donasi',
            amount: Number(
              donation.amount
            ),
            createdAt:
              donation.created_at,
            paymentStatus:
              donation.payment_status,
            rawDonation: donation,
          })
        )

      const zakatRows: TransactionRow[] =
        zakatTransactions.map(
          (transaction) => ({
            key: `zakat-${transaction.id}`,
            id: transaction.id,
            orderId:
              transaction.order_id,
            name:
              transaction.payer_name,
            programOrType:
              getZakatTypeLabel(
                transaction.zakat_type
              ),
            type: 'Zakat',
            amount: Number(
              transaction.amount
            ),
            createdAt:
              transaction.created_at,
            paymentStatus:
              transaction.payment_status,
            rawZakat: transaction,
          })
        )

      return [
        ...donationRows,
        ...zakatRows,
      ].sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      )
    }, [
      donations,
      zakatTransactions,
    ])

  const filteredTransactions =
    useMemo(() => {
      return transactions.filter(
        (transaction) => {
          const searchValue =
            search
              .trim()
              .toLowerCase()

          const status =
            getStatusLabel(
              transaction.paymentStatus
            )

          const matchesSearch =
            !searchValue ||
            transaction.name
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            transaction.programOrType
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            transaction.id
              .toString()
              .includes(
                searchValue
              ) ||
            transaction.orderId
              .toLowerCase()
              .includes(
                searchValue
              )

          const matchesStatus =
            statusFilter ===
              'Semua' ||
            status ===
              statusFilter

          const matchesType =
            typeFilter ===
              'Semua' ||
            transaction.type ===
              typeFilter

          return (
            matchesSearch &&
            matchesStatus &&
            matchesType
          )
        }
      )
    }, [
      transactions,
      search,
      statusFilter,
      typeFilter,
    ])

  const successfulRows =
    transactions.filter(
      (transaction) =>
        getStatusLabel(
          transaction.paymentStatus
        ) === 'Berhasil'
    )

  const totalSuccessfulFunds =
    successfulRows.reduce(
      (total, transaction) =>
        total +
        transaction.amount,
      0
    )

  const successfulTransactions =
    successfulRows.length

  const pendingTransactions =
    transactions.filter(
      (transaction) =>
        getStatusLabel(
          transaction.paymentStatus
        ) === 'Pending'
    ).length

  const failedTransactions =
    transactions.filter(
      (transaction) =>
        getStatusLabel(
          transaction.paymentStatus
        ) === 'Gagal'
    ).length

  const pageSize = 10

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTransactions.length /
        pageSize
    )
  )

  const paginatedTransactions =
    filteredTransactions.slice(
      (currentPage - 1) *
        pageSize,
      currentPage * pageSize
    )

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      )
    }
  }, [
    currentPage,
    totalPages,
  ])

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1
            className="text-xl font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Donasi & Transaksi
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola seluruh donasi dan transaksi
            zakat yang masuk ke LAZISMU Kabupaten
            Pemalang.
          </p>
        </div>

        <button
          type="button"
          onClick={
            loadTransactions
          }
          disabled={loading}
          className="rounded-xl bg-[#F58220] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#E87516] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? 'Memuat...'
            : 'Muat Ulang Data'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500">
            Total Dana Berhasil
          </p>

          <p className="mt-2 text-xl font-bold text-[#F58220]">
            {formatRupiah(
              totalSuccessfulFunds
            )}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Donasi + zakat yang berhasil
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500">
            Transaksi Berhasil
          </p>

          <p className="mt-2 text-xl font-bold text-green-600">
            {successfulTransactions}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Seluruh transaksi berhasil
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500">
            Transaksi Pending
          </p>

          <p className="mt-2 text-xl font-bold text-yellow-600">
            {pendingTransactions}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Menunggu pembayaran / konfirmasi
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500">
            Transaksi Gagal
          </p>

          <p className="mt-2 text-xl font-bold text-red-600">
            {failedTransactions}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Transaksi tidak berhasil
          </p>
        </div>

      </div>

      {/* Filter */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

        <div className="mb-4">
          <h2 className="font-bold text-gray-900">
            Filter Transaksi
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Cari dan filter transaksi
            berdasarkan informasi tertentu.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Cari transaksi
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value
                )
                setCurrentPage(1)
              }}
              placeholder="Nama, program, jenis zakat, atau ID..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Status
            </label>

            <select
              value={
                statusFilter
              }
              onChange={(event) => {
                setStatusFilter(
                  event.target.value
                )
                setCurrentPage(1)
              }}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none"
            >
              <option value="Semua">
                Semua Status
              </option>
              <option value="Berhasil">
                Berhasil
              </option>
              <option value="Pending">
                Pending
              </option>
              <option value="Gagal">
                Gagal
              </option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Jenis Transaksi
            </label>

            <select
              value={
                typeFilter
              }
              onChange={(event) => {
                setTypeFilter(
                  event.target.value
                )
                setCurrentPage(1)
              }}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none"
            >
              <option value="Semua">
                Semua Jenis
              </option>
              <option value="Donasi">
                Donasi
              </option>
              <option value="Zakat">
                Zakat
              </option>
            </select>
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">

        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-bold text-gray-900">
            Daftar Transaksi
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            {loading
              ? 'Memuat data...'
              : `Menampilkan ${filteredTransactions.length} transaksi.`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  ID
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Nama
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Program / Jenis Zakat
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Jenis
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Nominal
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Tanggal
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Order ID
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">

              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-sm text-gray-400"
                  >
                    Memuat transaksi...
                  </td>
                </tr>
              ) : paginatedTransactions.length >
                0 ? (
                paginatedTransactions.map(
                  (transaction) => {
                    const status =
                      getStatusLabel(
                        transaction.paymentStatus
                      )

                    return (
                      <tr
                        key={
                          transaction.key
                        }
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-5 py-3.5 text-xs font-medium text-gray-500">
                          #{transaction.id}
                        </td>

                        <td className="px-5 py-3.5 font-medium text-gray-900">
                          {transaction.name}
                        </td>

                        <td className="px-5 py-3.5 text-gray-700">
                          {
                            transaction.programOrType
                          }
                        </td>

                        <td className="px-5 py-3.5">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              transaction.type ===
                              'Zakat'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {
                              transaction.type
                            }
                          </span>
                        </td>

                        <td className="px-5 py-3.5 font-semibold text-[#F58220]">
                          {formatRupiah(
                            transaction.amount
                          )}
                        </td>

                        <td className="px-5 py-3.5 text-xs text-gray-500">
                          {formatDate(
                            transaction.createdAt
                          )}
                        </td>

                        <td className="px-5 py-3.5">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              status ===
                              'Berhasil'
                                ? 'bg-green-100 text-green-700'
                                : status ===
                                    'Pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 font-mono text-xs text-gray-500">
                          {
                            transaction.orderId
                          }
                        </td>
                      </tr>
                    )
                  }
                )
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-sm text-gray-400"
                  >
                    Tidak ada transaksi.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">

          <p className="text-xs text-gray-400">
            Halaman {currentPage} dari {totalPages}
          </p>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      1,
                      page - 1
                    )
                )
              }
              disabled={
                currentPage === 1
              }
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sebelumnya
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                )
              }
              disabled={
                currentPage >=
                totalPages
              }
              className="rounded-lg bg-[#F58220] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#E87516] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Berikutnya
            </button>

          </div>
        </div>

      </div>

    </div>
  )
}