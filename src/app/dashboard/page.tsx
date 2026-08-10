import { useState } from 'react'
import type { NavPage } from '../../App'
import AdminSidebar from '../../components/AdminSidebar'
import AdminHeader from '../../components/AdminHeader'

const donations = [
  {
    id: 1,
    date: '15 Jan 2025',
    program: 'Beasiswa Pendidikan',
    amount: 500000,
    status: 'Berhasil',
  },
  {
    id: 2,
    date: '10 Jan 2025',
    program: 'Bantuan Pangan',
    amount: 200000,
    status: 'Berhasil',
  },
  {
    id: 3,
    date: '5 Jan 2025',
    program: 'Zakat Maal',
    amount: 1200000,
    status: 'Berhasil',
  },
  {
    id: 4,
    date: '28 Des 2024',
    program: 'Pembangunan Masjid',
    amount: 300000,
    status: 'Berhasil',
  },
  {
    id: 5,
    date: '20 Des 2024',
    program: 'Tanggap Bencana',
    amount: 300000,
    status: 'Pending',
  },
]

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')

interface DashboardPageProps {
  onNavigate?: (page: NavPage) => void
}

export default function DashboardPage({
  onNavigate,
}: DashboardPageProps) {
  const [activeMenu, setActiveMenu] = useState('dashboard')

  const handleLogout = () => {
    onNavigate?.('home')
  }

  /*
   * =========================
   * CONTENT DASHBOARD
   * =========================
   */
  const renderDashboard = () => {
    return (
      <>
        {/* Welcome */}
        <div className="rounded-2xl bg-gradient-to-br from-[#F58220] to-[#D96D0A] p-6 text-white">
          <div
            className="mb-1 text-lg font-bold"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Assalamu&apos;alaikum, Super Admin
          </div>

          <p className="text-sm opacity-90">
            Selamat datang di Panel Administrasi LAZISMU Kabupaten
            Pemalang.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: 'Total Donasi',
              value: 'Rp 2.500.000',
              color: 'text-[#F58220]',
            },
            {
              label: 'Jumlah Transaksi',
              value: '8 kali',
              color: 'text-blue-600',
            },
            {
              label: 'Zakat Terbayar',
              value: 'Rp 1.200.000',
              color: 'text-green-600',
            },
            {
              label: 'Infaq',
              value: 'Rp 1.300.000',
              color: 'text-purple-600',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm"
            >
              <div className="mb-1 text-xs text-gray-500">
                {stat.label}
              </div>

              <div
                className={`text-sm font-bold ${stat.color}`}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Donation History */}
        <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <h2
              className="font-bold text-gray-900"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Donasi Terbaru
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    'Tanggal',
                    'Program',
                    'Jumlah',
                    'Status',
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {heading}
                    </th>
                  ))}
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
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
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

        {/* Quick Information */}
        <div className="grid gap-4 lg:grid-cols-2">

          <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
            <h3
              className="mb-4 font-bold text-gray-900"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Ringkasan Sistem
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  Total Program
                </span>

                <span className="font-semibold text-gray-900">
                  12
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  Campaign Aktif
                </span>

                <span className="font-semibold text-gray-900">
                  5
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  Total Pengguna
                </span>

                <span className="font-semibold text-gray-900">
                  128
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  Admin
                </span>

                <span className="font-semibold text-gray-900">
                  4
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
            <h3
              className="mb-4 font-bold text-gray-900"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Aktivitas Terbaru
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  Donasi baru masuk
                </span>

                <span className="text-xs text-gray-400">
                  Baru saja
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  Program diperbarui
                </span>

                <span className="text-xs text-gray-400">
                  1 jam lalu
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  Pengguna baru terdaftar
                </span>

                <span className="text-xs text-gray-400">
                  2 jam lalu
                </span>
              </div>
            </div>
          </div>

        </div>
      </>
    )
  }

  /*
   * =========================
   * CONTENT MENU LAIN
   * =========================
   *
   * Untuk sementara kita tampilkan
   * placeholder agar tidak blank.
   *
   * Nanti masing-masing akan kita
   * kerjakan satu per satu.
   */
  const renderPlaceholder = (
    title: string,
    description: string
  ) => {
    return (
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-8 shadow-sm">
        <h1
          className="mb-2 text-xl font-bold text-gray-900"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {title}
        </h1>

        <p className="text-sm text-gray-500">
          {description}
        </p>

        <div className="mt-6 rounded-xl bg-[#FEF0E4] p-4 text-sm text-[#F58220]">
          Halaman ini akan kita buat pada tahap berikutnya.
        </div>
      </div>
    )
  }

  /*
   * =========================
   * PILIH CONTENT BERDASARKAN
   * MENU AKTIF
   * =========================
   */
 const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return renderDashboard()

      case 'donasi':
        return renderPlaceholder(
          'Donasi & Transaksi',
          'Kelola seluruh donasi dan transaksi yang masuk ke LAZISMU.'
        )

      case 'campaign':
        return renderPlaceholder(
          'Campaign',
          'Kelola campaign penggalangan dana.'
        )

      case 'program':
        return renderPlaceholder(
          'Program',
          'Kelola seluruh program LAZISMU.'
        )

      case 'berita':
        return renderPlaceholder(
          'Berita',
          'Kelola berita yang ditampilkan pada website.'
        )

      case 'artikel':
        return renderPlaceholder(
          'Artikel',
          'Kelola artikel dan informasi edukasi.'
        )

      case 'publikasi':
        return renderPlaceholder(
          'Publikasi',
          'Kelola publikasi dan dokumen LAZISMU.'
        )

      case 'users':
        return renderPlaceholder(
          'Pengguna & Admin',
          'Kelola pengguna, admin, dan hak akses sistem.'
        )

      case 'laporan':
        return renderPlaceholder(
          'Laporan',
          'Lihat dan kelola laporan administrasi LAZISMU.'
        )

      case 'pengaturan':
        return renderPlaceholder(
          'Pengaturan',
          'Kelola pengaturan sistem administrasi.'
        )

      default:
        return renderDashboard()
    }
  }

return (
  <div className="min-h-screen bg-[#FFF8F2]">

    {/* SIDEBAR */}
    <AdminSidebar
      activeMenu={activeMenu}
      onMenuChange={setActiveMenu}
      onLogout={handleLogout}
    />

    {/* AREA KANAN */}
    <div className="min-h-screen lg:ml-52">

      {/* HEADER + CONTENT */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">

        <AdminHeader />

        <main className="mt-6 min-w-0">
          {renderContent()}
        </main>

      </div>

    </div>

  </div>
)
}