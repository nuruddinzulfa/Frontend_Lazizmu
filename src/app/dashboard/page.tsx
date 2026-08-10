import { useState } from 'react'
import type { NavPage } from '../../App'

const donations = [
  { id: 1, date: '15 Jan 2025', program: 'Beasiswa Pendidikan', amount: 500000, status: 'Berhasil' },
  { id: 2, date: '10 Jan 2025', program: 'Bantuan Pangan', amount: 200000, status: 'Berhasil' },
  { id: 3, date: '5 Jan 2025', program: 'Zakat Maal', amount: 1200000, status: 'Berhasil' },
  { id: 4, date: '28 Des 2024', program: 'Pembangunan Masjid', amount: 300000, status: 'Berhasil' },
  { id: 5, date: '20 Des 2024', program: 'Tanggap Bencana', amount: 300000, status: 'Pending' },
]

const menuItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    key: 'donasi',
    label: 'Donasi & Transaksi',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    key: 'campaign',
    label: 'Campaign',
    icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592L6.5 15H4a2 2 0 01-2-2v-2a2 2 0 012-2h2.5l1.083-4.832A1.76 1.76 0 0111 5.882zM15 12h.01M19 12h.01',
  },
  {
    key: 'program',
    label: 'Program',
    icon: 'M4 6h16M4 10h16M4 14h16M4 18h10',
  },
  {
    key: 'berita',
    label: 'Berita',
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2zM7 8h10M7 12h10M7 16h6',
  },
  {
    key: 'artikel',
    label: 'Artikel',
    icon: 'M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM8 7h8M8 11h8M8 15h5',
  },
  {
    key: 'publikasi',
    label: 'Publikasi',
    icon: 'M6 2h9l5 5v15H6a2 2 0 01-2-2V4a2 2 0 012-2zM14 2v6h6M8 12h8M8 16h8',
  },
  {
    key: 'users',
    label: 'Pengguna & Admin',
    icon: 'M17 20h5v-2a4 4 0 00-4-4h-1M9 20H2v-2a4 4 0 014-4h3m5-8a4 4 0 11-8 0 4 4 0 018 0zm6 2a3 3 0 11-6 0',
  },
  {
    key: 'laporan',
    label: 'Laporan',
    icon: 'M3 3v18h18M7 16v-5M12 16V7M17 16v-8',
  },
  {
    key: 'pengaturan',
    label: 'Pengaturan',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.827 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.065 2.573c.94 1.543-.827 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.572-1.065c-1.543.94-3.31-.827-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35A1.724 1.724 0 005.383 7.75c-.94-1.543.827-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z',
  },
]

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')

interface DashboardPageProps {
  onNavigate?: (page: NavPage) => void
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [activeMenu, setActiveMenu] = useState('dashboard')

  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white border border-[#F3DEC8] rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 bg-gradient-to-br from-[#F58220] to-[#D96D0A] text-white">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div className="font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Super Admin </div>
                <div className="text-xs opacity-80">LAZISMU Kabupaten Pemalang</div>
              </div>
              <nav className="p-3 space-y-1">
                {menuItems.map(item => (
                  <button key={item.key} onClick={() => setActiveMenu(item.key)} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeMenu === item.key ? 'bg-[#FEF0E4] text-[#F58220]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                    {item.label}
                  </button>
                ))}
                <button onClick={() => onNavigate?.('home')} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Keluar
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-6">
            {/* Welcome */}
            <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] rounded-2xl p-6 text-white">
              <div className="text-lg font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Assalamu'alaikum, Super Admin</div>
              <p className="text-sm opacity-90">Selamat datang di Panel Administrasi LAZISMU Kabupaten Pemalang.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Donasi', value: 'Rp 2.500.000', color: 'text-[#F58220]' },
                { label: 'Jumlah Transaksi', value: '8 kali', color: 'text-blue-600' },
                { label: 'Zakat Terbayar', value: 'Rp 1.200.000', color: 'text-green-600' },
                { label: 'Infaq', value: 'Rp 1.300.000', color: 'text-purple-600' },
              ].map(stat => (
                <div key={stat.label} className="bg-white border border-[#F3DEC8] rounded-2xl p-4 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                  <div className={`font-bold text-sm ${stat.color}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Donation History Table */}
            <div className="bg-white border border-[#F3DEC8] rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Riwayat Donasi</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Tanggal', 'Program', 'Jumlah', 'Status'].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {donations.map(d => (
                      <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 text-gray-500 text-xs">{d.date}</td>
                        <td className="px-5 py-3.5 font-medium text-gray-900">{d.program}</td>
                        <td className="px-5 py-3.5 font-semibold text-[#F58220]">{fmt(d.amount)}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${d.status === 'Berhasil' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{d.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Certificate Card */}
            <div className="bg-white border border-[#F3DEC8] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FEF0E4] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#F58220]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sertifikat Zakat 1446 H</h3>
                  <p className="text-sm text-gray-500">Zakat Maal - Rp 1.200.000 - 5 Januari 2025</p>
                </div>
                <button className="flex items-center gap-1.5 bg-[#FEF0E4] text-[#F58220] hover:bg-[#F58220] hover:text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Unduh
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
