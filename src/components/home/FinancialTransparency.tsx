import { useState } from 'react'
import { useInView } from '../../hooks/useInView'

const allocationData = [
  { label: 'Program Pendidikan', pct: 32, color: '#3B82F6' },
  { label: 'Program Kesehatan', pct: 18, color: '#10B981' },
  { label: 'Pemberdayaan Ekonomi', pct: 22, color: '#F58220' },
  { label: 'Pembangunan Masjid', pct: 14, color: '#8B5CF6' },
  { label: 'Tanggap Bencana', pct: 9, color: '#EF4444' },
  { label: 'Operasional (5%)', pct: 5, color: '#6B7280' },
]

const reports = [
  { year: '2024', title: 'Laporan Tahunan 2024', size: '2.4 MB', icon: '' },
  { year: '2023', title: 'Laporan Tahunan 2023', size: '1.9 MB', icon: '' },
  { year: 'Q1 2025', title: 'Laporan Triwulan I 2025', size: '856 KB', icon: '' },
]

function DonutChart() {
  const size = 200
  const cx = size / 2
  const cy = size / 2
  const r = 72
  const stroke = 28

  const circumference = 2 * Math.PI * r

  let offset = 0
  const segments = allocationData.map(d => {
    const dash = (d.pct / 100) * circumference
    const gap = circumference - dash
    const rotation = (offset / 100) * 360 - 90
    offset += d.pct
    return { ...d, dash, gap, rotation }
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-sm">
      {segments.map((s, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={s.color}
          strokeWidth={stroke}
          strokeDasharray={`${s.dash} ${s.gap}`}
          style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${s.rotation}deg)` }}
          opacity={0.9}
        />
      ))}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="10" fill="#6B7280" fontFamily="Inter, sans-serif">
        Total Dana
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1C1C1E" fontFamily="Plus Jakarta Sans, sans-serif">
        Rp 4.2M
      </text>
    </svg>
  )
}

export default function FinancialTransparency() {
  const [tab, setTab] = useState<'allocation' | 'reports'>('allocation')
  const { inView, ref } = useInView()

  return (
    <section id="transparency" className="py-20 bg-[#FFF8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <span className="text-[#F58220] text-sm font-semibold uppercase tracking-wider">Transparansi</span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Keuangan yang Terbuka
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Kami berkomitmen pada transparansi penuh. Laporan keuangan dipublikasikan dan dapat diakses oleh siapapun.
          </p>
        </div>

        <div
          className={`transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 border border-[#F3DEC8] flex gap-1">
              <button
                onClick={() => setTab('allocation')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tab === 'allocation' ? 'bg-[#F58220] text-white shadow-sm' : 'text-gray-600 hover:text-[#F58220]'
                }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Alokasi Dana
              </button>
              <button
                onClick={() => setTab('reports')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tab === 'reports' ? 'bg-[#F58220] text-white shadow-sm' : 'text-gray-600 hover:text-[#F58220]'
                }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Unduh Laporan
              </button>
            </div>
          </div>

          {tab === 'allocation' ? (
            <div className="bg-white rounded-2xl border border-[#F3DEC8] p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center">
                <DonutChart />
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-gray-800 mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Alokasi Dana Terhimpun 2024
                </h3>
                {allocationData.map(d => (
                  <div key={d.label} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700 truncate">{d.label}</span>
                        <span className="text-sm font-bold text-gray-800 ml-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {d.pct}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${d.pct}%`, background: d.color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-4 bg-[#FEF0E4] rounded-xl text-sm text-[#D96D0A] font-medium">
                  ✓ Laporan keuangan diaudit oleh auditor independen bersertifikat.
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {reports.map(r => (
                <div key={r.year} className="bg-white rounded-2xl border border-[#F3DEC8] p-6 card-hover group">
                  <div className="text-4xl mb-4">{r.icon}</div>
                  <div className="font-bold text-gray-800 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {r.title}
                  </div>
                  <div className="text-gray-400 text-sm mb-5">{r.size} · PDF</div>
                  <button className="flex items-center gap-2 text-[#F58220] text-sm font-semibold group-hover:gap-3 transition-all duration-200" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Unduh Laporan
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
