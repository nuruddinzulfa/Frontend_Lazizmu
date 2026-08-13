import { useEffect, useMemo, useState } from 'react'
import {
  getAdminDonations,
  type Donation,
} from '@/service/donation.service'

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
  status: Donation['payment_status']
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

export default function DonationManagement() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [typeFilter, setTypeFilter] = useState('Semua')
  const [currentPage, setCurrentPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDonations = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getAdminDonations()

      setDonations(data)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Gagal mengambil data donasi.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDonations()
  }, [])

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const searchValue = search.toLowerCase()

      const donorName = (
        donation.anonymous
          ? 'Hamba Allah'
          : donation.donor_name
      ).toLowerCase()

      const program = getProgramName(
        donation
      ).toLowerCase()

      const id = donation.id.toString()

      const status = getStatusLabel(
        donation.payment_status
      )

      const matchesSearch =
        donorName.includes(searchValue) ||
        program.includes(searchValue) ||
        id.includes(searchValue) ||
        donation.order_id
          .toLowerCase()
          .includes(searchValue)

      const matchesStatus =
        statusFilter === 'Semua' ||
        status === statusFilter

      /*
       * Backend donations belum memiliki
       * kolom jenis donasi.
       *
       * Untuk sementara semua ditampilkan
       * sebagai "Donasi".
       */
      const type = 'Donasi'

      const matchesType =
        typeFilter === 'Semua' ||
        type === typeFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      )
    })
  }, [
    donations,
    search,
    statusFilter,
    typeFilter,
  ])

  const totalDonation = donations
    .filter(
      (donation) =>
        donation.payment_status ===
          'settlement' ||
        donation.payment_status ===
          'capture'
    )
    .reduce(
      (total, donation) =>
        total + Number(donation.amount),
      0
    )

  const successfulTransactions =
    donations.filter(
      (donation) =>
        donation.payment_status ===
          'settlement' ||
        donation.payment_status ===
          'capture'
    ).length

  const pendingTransactions =
    donations.filter(
      (donation) =>
        donation.payment_status ===
        'pending'
    ).length

  const failedTransactions =
    donations.filter(
      (donation) =>
        ![
          'pending',
          'settlement',
          'capture',
        ].includes(
          donation.payment_status
        )
    ).length

  const pageSize = 10

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredDonations.length /
        pageSize
    )
  )

  const paginatedDonations =
    filteredDonations.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )

  useEffect(() => {
    if (
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  return (
    <div className="space-y-6">

      {/* Header */}
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
          yang masuk ke LAZISMU Kabupaten
          Pemalang.
        </p>
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
            Total Donasi Berhasil
          </p>

          <p className="mt-2 text-xl font-bold text-[#F58220]">
            {formatRupiah(totalDonation)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Akumulasi transaksi berhasil
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
            Transaksi telah berhasil
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
            Membutuhkan pemeriksaan
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
              placeholder="Nama, program, atau ID..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Status
            </label>

            <select
              value={statusFilter}
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
              Jenis Donasi
            </label>

            <select
              value={typeFilter}
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
              : `Menampilkan ${filteredDonations.length} transaksi.`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-sm">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  ID
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Donatur
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Program
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
                  Aksi
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
              ) : paginatedDonations.length > 0 ? (
                paginatedDonations.map(
                  (donation) => {
                    const status =
                      getStatusLabel(
                        donation.payment_status
                      )

                    return (
                      <tr
                        key={donation.id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-5 py-3.5 text-xs font-medium text-gray-500">
                          #{donation.id}
                        </td>

                        <td className="px-5 py-3.5 font-medium text-gray-900">
                          {donation.anonymous
                            ? 'Hamba Allah'
                            : donation.donor_name}
                        </td>

                        <td className="px-5 py-3.5 text-gray-700">
                          {getProgramName(
                            donation
                          )}
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                            Donasi
                          </span>
                        </td>

                        <td className="px-5 py-3.5 font-semibold text-[#F58220]">
                          {formatRupiah(
                            donation.amount
                          )}
                        </td>

                        <td className="px-5 py-3.5 text-xs text-gray-500">
                          {formatDate(
                            donation.created_at
                          )}
                        </td>

                        <td className="px-5 py-3.5">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              status === 'Berhasil'
                                ? 'bg-green-100 text-green-700'
                                : status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <button
                            type="button"
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#F58220] transition hover:bg-orange-50"
                          >
                            Detail
                          </button>
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
                    Math.max(1, page - 1)
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
                currentPage >= totalPages
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