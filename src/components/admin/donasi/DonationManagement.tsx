import { useMemo, useState } from 'react'

interface Donation {
  id: number
  date: string
  program: string
  amount: number
  status: 'Berhasil' | 'Pending' | 'Gagal'
  donor: string
  type: 'Zakat' | 'Infaq' | 'Donasi'
}

const donations: Donation[] = [
  {
    id: 1001,
    date: '15 Jan 2025',
    program: 'Beasiswa Pendidikan',
    amount: 500000,
    status: 'Berhasil',
    donor: 'Ahmad Fauzi',
    type: 'Donasi',
  },
  {
    id: 1002,
    date: '10 Jan 2025',
    program: 'Bantuan Pangan',
    amount: 200000,
    status: 'Berhasil',
    donor: 'Siti Aminah',
    type: 'Infaq',
  },
  {
    id: 1003,
    date: '5 Jan 2025',
    program: 'Zakat Maal',
    amount: 1200000,
    status: 'Berhasil',
    donor: 'Muhammad Rizki',
    type: 'Zakat',
  },
  {
    id: 1004,
    date: '28 Des 2024',
    program: 'Pembangunan Masjid',
    amount: 300000,
    status: 'Berhasil',
    donor: 'Budi Santoso',
    type: 'Donasi',
  },
  {
    id: 1005,
    date: '20 Des 2024',
    program: 'Tanggap Bencana',
    amount: 300000,
    status: 'Pending',
    donor: 'Hamba Allah',
    type: 'Donasi',
  },
  {
    id: 1006,
    date: '18 Des 2024',
    program: 'Zakat Fitrah',
    amount: 150000,
    status: 'Berhasil',
    donor: 'Nur Hasanah',
    type: 'Zakat',
  },
  {
    id: 1007,
    date: '15 Des 2024',
    program: 'Bantuan Pendidikan',
    amount: 750000,
    status: 'Gagal',
    donor: 'Rina Wulandari',
    type: 'Donasi',
  },
]

const formatRupiah = (amount: number) => {
  return 'Rp ' + amount.toLocaleString('id-ID')
}

export default function DonationManagement() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [typeFilter, setTypeFilter] = useState('Semua')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const searchValue = search.toLowerCase()

      const matchesSearch =
        donation.donor.toLowerCase().includes(searchValue) ||
        donation.program.toLowerCase().includes(searchValue) ||
        donation.id.toString().includes(searchValue)

      const matchesStatus =
        statusFilter === 'Semua' ||
        donation.status === statusFilter

      const matchesType =
        typeFilter === 'Semua' ||
        donation.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [search, statusFilter, typeFilter])

  const totalDonation = donations
    .filter((donation) => donation.status === 'Berhasil')
    .reduce((total, donation) => total + donation.amount, 0)

  const successfulTransactions = donations.filter(
    (donation) => donation.status === 'Berhasil'
  ).length

  const pendingTransactions = donations.filter(
    (donation) => donation.status === 'Pending'
  ).length

  const failedTransactions = donations.filter(
    (donation) => donation.status === 'Gagal'
  ).length

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1
          className="text-xl font-bold text-gray-900"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Donasi & Transaksi
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Kelola seluruh donasi dan transaksi yang masuk ke
          LAZISMU Kabupaten Pemalang.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500">
            Total Donasi Berhasil
          </p>

          <p
            className="mt-2 text-xl font-bold text-[#F58220]"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
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

          <p
            className="mt-2 text-xl font-bold text-green-600"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
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

          <p
            className="mt-2 text-xl font-bold text-yellow-600"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
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

          <p
            className="mt-2 text-xl font-bold text-red-600"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
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
          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Filter Transaksi
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Cari dan filter transaksi berdasarkan informasi tertentu.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">

          {/* Search */}
          <div className="md:col-span-1">
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Cari transaksi
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setCurrentPage(1)
              }}
              placeholder="Nama, program, atau ID..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value)
                setCurrentPage(1)
              }}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-2 focus:ring-orange-100"
            >
              <option value="Semua">Semua Status</option>
              <option value="Berhasil">Berhasil</option>
              <option value="Pending">Pending</option>
              <option value="Gagal">Gagal</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Jenis Donasi
            </label>

            <select
              value={typeFilter}
              onChange={(event) => {
                setTypeFilter(event.target.value)
                setCurrentPage(1)
              }}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-2 focus:ring-orange-100"
            >
              <option value="Semua">Semua Jenis</option>
              <option value="Zakat">Zakat</option>
              <option value="Infaq">Infaq</option>
              <option value="Donasi">Donasi</option>
            </select>
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">

        <div className="border-b border-gray-100 px-5 py-4">
          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Daftar Transaksi
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Menampilkan {filteredDonations.length} transaksi.
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

              {filteredDonations.length > 0 ? (
                filteredDonations.map((donation) => (
                  <tr
                    key={donation.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-5 py-3.5 text-xs font-medium text-gray-500">
                      #{donation.id}
                    </td>

                    <td className="px-5 py-3.5 font-medium text-gray-900">
                      {donation.donor}
                    </td>

                    <td className="px-5 py-3.5 text-gray-700">
                      {donation.program}
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        {donation.type}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 font-semibold text-[#F58220]">
                      {formatRupiah(donation.amount)}
                    </td>

                    <td className="px-5 py-3.5 text-xs text-gray-500">
                      {donation.date}
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          donation.status === 'Berhasil'
                            ? 'bg-green-100 text-green-700'
                            : donation.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {donation.status}
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-sm text-gray-400"
                  >
                    Tidak ada transaksi yang sesuai dengan filter.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">

          <p className="text-xs text-gray-400">
            Halaman {currentPage}
          </p>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sebelumnya
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => page + 1)
              }
              className="rounded-lg bg-[#F58220] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#E87516]"
            >
              Berikutnya
            </button>

          </div>
        </div>

      </div>

    </div>
  )
}