import React from 'react'

interface Donation {
  id: number
  date: string
  program: string
  amount: number
  status: string
}

interface DashboardContentProps {
  donations: Donation[]
  fmt: (amount: number) => string
}

export default function DashboardContent({
  donations,
  fmt,
}: DashboardContentProps) {
  const adminStats = [
    {
      label: 'Total Donasi',
      value: 'Rp 2.500.000',
      description: 'Seluruh donasi masuk',
      color: 'text-[#F58220]',
      bg: 'bg-[#FEF0E4]',
    },
    {
      label: 'Total Transaksi',
      value: '8',
      description: 'Transaksi tercatat',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Campaign Aktif',
      value: '5',
      description: 'Campaign sedang berjalan',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Pengguna',
      value: '128',
      description: 'Pengguna terdaftar',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-r from-[#F58220] to-[#E87516] p-6 text-white shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1
              className="text-xl font-bold"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Assalamu&apos;alaikum, Super Admin
            </h1>

            <p className="mt-1 text-sm text-white/90">
              Selamat datang di Panel Administrasi LAZISMU Kabupaten
              Pemalang.
            </p>
          </div>

          <div className="rounded-xl bg-white/15 px-4 py-2 text-xs font-medium">
            Administrator Sistem
          </div>

        </div>
      </div>

      {/* Statistics */}
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
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
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

      {/* Donasi Terbaru */}
      <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

          <div>
            <h2
              className="font-bold text-gray-900"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Donasi Terbaru
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Transaksi donasi yang terbaru masuk ke sistem
            </p>
          </div>

        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Tanggal
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Program
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

              {donations.map((donation) => (
                <tr
                  key={donation.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-5 py-3.5 text-xs text-gray-500">
                    {donation.date}
                  </td>

                  <td className="px-5 py-3.5 font-medium text-gray-900">
                    {donation.program}
                  </td>

                  <td className="px-5 py-3.5 font-semibold text-[#F58220]">
                    {fmt(donation.amount)}
                  </td>

                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        donation.status === 'Berhasil'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>

      {/* Ringkasan Sistem & Aktivitas */}
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Ringkasan Sistem */}
        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

          <div className="mb-5">
            <h2
              className="font-bold text-gray-900"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Ringkasan Sistem
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Gambaran umum data administrasi
            </p>
          </div>

          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Total Program
              </span>

              <span className="font-semibold text-gray-900">
                12
              </span>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Campaign Aktif
              </span>

              <span className="font-semibold text-gray-900">
                5
              </span>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Berita Terbit
              </span>

              <span className="font-semibold text-gray-900">
                24
              </span>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Artikel Terbit
              </span>

              <span className="font-semibold text-gray-900">
                18
              </span>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Total Pengguna
              </span>

              <span className="font-semibold text-gray-900">
                128
              </span>
            </div>

          </div>
        </div>

        {/* Aktivitas Terbaru */}
        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

          <div className="mb-5">
            <h2
              className="font-bold text-gray-900"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Aktivitas Terbaru
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Aktivitas yang terjadi di dalam sistem
            </p>
          </div>

          <div className="space-y-4">

            <div className="flex items-start gap-3">
              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#F58220]" />

              <div>
                <p className="text-sm text-gray-700">
                  Donasi baru masuk
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Baru saja
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />

              <div>
                <p className="text-sm text-gray-700">
                  Program diperbarui
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  1 jam lalu
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-green-500" />

              <div>
                <p className="text-sm text-gray-700">
                  Pengguna baru terdaftar
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  2 jam lalu
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-purple-500" />

              <div>
                <p className="text-sm text-gray-700">
                  Artikel baru diterbitkan
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  3 jam lalu
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Perlu Perhatian */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

        <div className="mb-5">
          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Perlu Perhatian
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Hal-hal yang mungkin membutuhkan tindakan Super Admin
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">

          <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-4">
            <div className="text-sm font-semibold text-yellow-800">
              Transaksi Pending
            </div>

            <div className="mt-1 text-xs text-yellow-700">
              1 transaksi membutuhkan pemeriksaan
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="text-sm font-semibold text-blue-800">
              Campaign Aktif
            </div>

            <div className="mt-1 text-xs text-blue-700">
              5 campaign sedang berjalan
            </div>
          </div>

          <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
            <div className="text-sm font-semibold text-purple-800">
              Pengguna
            </div>

            <div className="mt-1 text-xs text-purple-700">
              128 pengguna terdaftar dalam sistem
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}