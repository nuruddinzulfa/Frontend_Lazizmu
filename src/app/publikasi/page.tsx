import { useState } from 'react'

const reports = {
  'Laporan Keuangan': [
    { id: 1, title: 'Laporan Keuangan Q1 2025', period: 'Januari - Maret 2025', size: '2.4 MB', year: 2025 },
    { id: 2, title: 'Laporan Keuangan Q4 2024', period: 'Oktober - Desember 2024', size: '2.1 MB', year: 2024 },
    { id: 3, title: 'Laporan Keuangan Q3 2024', period: 'Juli - September 2024', size: '1.9 MB', year: 2024 },
    { id: 4, title: 'Laporan Keuangan Q2 2024', period: 'April - Juni 2024', size: '2.0 MB', year: 2024 },
    { id: 5, title: 'Laporan Keuangan Q1 2024', period: 'Januari - Maret 2024', size: '1.8 MB', year: 2024 },
    { id: 6, title: 'Laporan Keuangan Tahunan 2023', period: 'Januari - Desember 2023', size: '5.2 MB', year: 2023 },
  ],
  'Laporan Tahunan': [
    { id: 7, title: 'Annual Report 2024', period: 'Tahun 2024', size: '8.7 MB', year: 2024 },
    { id: 8, title: 'Annual Report 2023', period: 'Tahun 2023', size: '7.5 MB', year: 2023 },
    { id: 9, title: 'Annual Report 2022', period: 'Tahun 2022', size: '6.9 MB', year: 2023 },
  ],
  'Laporan Program': [
    { id: 10, title: 'Laporan Program Beasiswa 2024', period: 'Tahun 2024', size: '3.2 MB', year: 2024 },
    { id: 11, title: 'Laporan Program Kesehatan 2024', period: 'Tahun 2024', size: '2.8 MB', year: 2024 },
    { id: 12, title: 'Laporan Program Ekonomi 2024', period: 'Tahun 2024', size: '2.5 MB', year: 2024 },
    { id: 13, title: 'Laporan Tanggap Bencana 2024', period: 'Semester II 2024', size: '1.6 MB', year: 2024 },
    { id: 14, title: 'Laporan Program Wakaf 2023', period: 'Tahun 2023', size: '3.0 MB', year: 2023 },
  ],
}

export default function PublikasiPage() {
  const [activeTab, setActiveTab] = useState('Laporan Keuangan')
  const tabs = ['Laporan Keuangan', 'Laporan Tahunan', 'Laporan Program']
  const items = reports[activeTab as keyof typeof reports]

  return (
    <div className="min-h-screen bg-[#FFF8F2]">
      <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] text-white py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-sm mb-3 opacity-80"><span>Beranda</span><span className="mx-2">/</span><span>Laporan</span></div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Laporan</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl">Laporan keuangan dan program LAZISMU Pemalang yang transparan dan akuntabel.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-[#F3DEC8] shadow-sm w-fit">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab ? 'bg-[#F58220] text-white shadow-sm' : 'text-gray-600 hover:text-[#F58220]'}`}>{tab}</button>
          ))}
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(report => (
            <div key={report.id} className="bg-white border border-[#F3DEC8] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 4h5v7h7v9H6V4z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{report.title}</h3>
                  <p className="text-xs text-gray-500">{report.period}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  <span>PDF · {report.size}</span>
                </div>
                <button className="flex items-center gap-1.5 bg-[#FEF0E4] text-[#F58220] hover:bg-[#F58220] hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Unduh
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
