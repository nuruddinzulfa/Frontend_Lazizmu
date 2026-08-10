'use client'

import { useMemo, useState } from 'react'

type ReportType =
  | 'Keuangan'
  | 'Donasi'
  | 'Program'
  | 'Campaign'

interface Report {
  id: number
  name: string
  type: ReportType
  period: string
  createdAt: string
  status: 'Tersedia' | 'Diproses'
}

const initialReports: Report[] = [
  {
    id: 1,
    name: 'Laporan Keuangan Januari 2025',
    type: 'Keuangan',
    period: 'Januari 2025',
    createdAt: '31 Jan 2025',
    status: 'Tersedia',
  },
  {
    id: 2,
    name: 'Laporan Donasi Januari 2025',
    type: 'Donasi',
    period: 'Januari 2025',
    createdAt: '31 Jan 2025',
    status: 'Tersedia',
  },
  {
    id: 3,
    name: 'Laporan Program Januari 2025',
    type: 'Program',
    period: 'Januari 2025',
    createdAt: '31 Jan 2025',
    status: 'Tersedia',
  },
  {
    id: 4,
    name: 'Laporan Campaign Januari 2025',
    type: 'Campaign',
    period: 'Januari 2025',
    createdAt: '31 Jan 2025',
    status: 'Tersedia',
  },
  {
    id: 5,
    name: 'Laporan Keuangan Februari 2025',
    type: 'Keuangan',
    period: 'Februari 2025',
    createdAt: '28 Feb 2025',
    status: 'Diproses',
  },
]

const formatRupiah = (amount: number) => {
  return 'Rp ' + amount.toLocaleString('id-ID')
}

export default function ReportManagement() {
  const [reports] = useState<Report[]>(initialReports)

  const [typeFilter, setTypeFilter] = useState('Semua')
  const [periodFilter, setPeriodFilter] = useState('Semua')

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesType =
        typeFilter === 'Semua' ||
        report.type === typeFilter

      const matchesPeriod =
        periodFilter === 'Semua' ||
        report.period === periodFilter

      return matchesType && matchesPeriod
    })
  }, [reports, typeFilter, periodFilter])

  const availableReports = reports.filter(
    (report) => report.status === 'Tersedia'
  ).length

  const processingReports = reports.filter(
    (report) => report.status === 'Diproses'
  ).length

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1
          className="text-lg font-bold text-gray-900"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Laporan
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Lihat dan kelola laporan administrasi LAZISMU.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Total Laporan
          </p>

          <p className="mt-1 text-xl font-bold text-gray-900">
            {reports.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Tersedia
          </p>

          <p className="mt-1 text-xl font-bold text-green-600">
            {availableReports}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Diproses
          </p>

          <p className="mt-1 text-xl font-bold text-yellow-600">
            {processingReports}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Periode Aktif
          </p>

          <p className="mt-1 text-xl font-bold text-[#F58220]">
            2025
          </p>
        </div>

      </div>

      {/* Report Summary */}
      <div className="grid gap-4 lg:grid-cols-2">

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Ringkasan Keuangan
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Ringkasan data keuangan sementara.
          </p>

          <div className="mt-5 space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Total Donasi
              </span>

              <span className="text-sm font-semibold text-[#F58220]">
                {formatRupiah(2500000)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Zakat
              </span>

              <span className="text-sm font-semibold text-gray-900">
                {formatRupiah(1200000)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Infaq
              </span>

              <span className="text-sm font-semibold text-gray-900">
                {formatRupiah(1300000)}
              </span>
            </div>

          </div>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Ringkasan Aktivitas
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Ringkasan aktivitas administrasi.
          </p>

          <div className="mt-5 space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Transaksi
              </span>

              <span className="text-sm font-semibold text-gray-900">
                8
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Program Aktif
              </span>

              <span className="text-sm font-semibold text-gray-900">
                4
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Campaign Aktif
              </span>

              <span className="text-sm font-semibold text-gray-900">
                2
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

        <div className="grid gap-4 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Jenis Laporan
            </label>

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="Semua">
                Semua Jenis
              </option>

              <option value="Keuangan">
                Keuangan
              </option>

              <option value="Donasi">
                Donasi
              </option>

              <option value="Program">
                Program
              </option>

              <option value="Campaign">
                Campaign
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Periode
            </label>

            <select
              value={periodFilter}
              onChange={(event) =>
                setPeriodFilter(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="Semua">
                Semua Periode
              </option>

              <option value="Januari 2025">
                Januari 2025
              </option>

              <option value="Februari 2025">
                Februari 2025
              </option>
            </select>
          </div>

        </div>
      </div>

      {/* Reports Table */}
      <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">

        <div className="border-b border-gray-100 p-5">
          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Daftar Laporan
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Menampilkan {filteredReports.length} laporan.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-sm">

            <thead className="bg-gray-50">
              <tr>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Nama Laporan
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Jenis
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Periode
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Dibuat
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

              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="transition-colors hover:bg-gray-50"
                >

                  <td className="max-w-sm px-5 py-4">
                    <div className="font-medium text-gray-900">
                      {report.name}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-[#F58220]">
                      {report.type}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {report.period}
                  </td>

                  <td className="px-5 py-4 text-xs text-gray-500">
                    {report.createdAt}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        report.status === 'Tersedia'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <button
                        type="button"
                        className="text-xs font-medium text-[#F58220] hover:underline"
                      >
                        Lihat
                      </button>

                      <button
                        type="button"
                        disabled={report.status !== 'Tersedia'}
                        className="text-xs font-medium text-blue-600 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Download
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

              {filteredReports.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-gray-400"
                  >
                    Laporan tidak ditemukan.
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        </div>
      </div>

    </div>
  )
}