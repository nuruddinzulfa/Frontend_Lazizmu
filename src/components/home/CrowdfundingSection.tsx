import { useState } from 'react'
import { useInView } from '../../hooks/useInView'
import type { NavPage } from '../../App'

interface CrowdfundingProps { onNavigate: (page: NavPage) => void }

const campaigns = [
  {
    id: 1,
    title: 'Renovasi Sekolah Dasar di Desa Purana',
    category: 'Pendidikan',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop&auto=format',
    alt: 'Sekolah dasar',
    collected: 32500000,
    target: 80000000,
    donors: 124,
    daysLeft: 28,
    isNew: true,
    isTrending: false,
  },
  {
    id: 2,
    title: 'Sumur Bor Bersama untuk 3 Dusun Kekeringan',
    category: 'Air Bersih',
    image: 'https://images.unsplash.com/photo-1611087802810-046bb671e644?w=600&h=400&fit=crop&auto=format',
    alt: 'Proyek air bersih',
    collected: 56000000,
    target: 60000000,
    donors: 231,
    daysLeft: 5,
    isNew: false,
    isTrending: true,
  },
  {
    id: 3,
    title: 'Beasiswa 50 Anak Yatim Semester Ganjil 2025',
    category: 'Pendidikan',
    image: 'https://images.unsplash.com/photo-1648518295678-f78670c35924?w=600&h=400&fit=crop&auto=format',
    alt: 'Anak-anak yatim',
    collected: 18750000,
    target: 50000000,
    donors: 89,
    daysLeft: 44,
    isNew: true,
    isTrending: false,
  },
  {
    id: 4,
    title: 'Dapur Umum Lansia Tidak Mampu Pemalang',
    category: 'Sosial',
    image: 'https://images.unsplash.com/photo-1637034132661-4f015591b84a?w=600&h=400&fit=crop&auto=format',
    alt: 'Dapur umum lansia',
    collected: 9800000,
    target: 25000000,
    donors: 67,
    daysLeft: 60,
    isNew: false,
    isTrending: false,
  },
  {
    id: 5,
    title: 'Alat Produksi UMKM Kerajinan Batik Dhuafa',
    category: 'Ekonomi',
    image: 'https://images.unsplash.com/photo-1541064828014-503911d13103?w=600&h=400&fit=crop&auto=format',
    alt: 'UMKM batik',
    collected: 41200000,
    target: 45000000,
    donors: 178,
    daysLeft: 9,
    isNew: false,
    isTrending: true,
  },
  {
    id: 6,
    title: 'Majelis Tahfidz Quran untuk 30 Santri',
    category: 'Keagamaan',
    image: 'https://images.unsplash.com/photo-1708481686679-1bfebe1afefc?w=600&h=400&fit=crop&auto=format',
    alt: 'Majelis tahfidz',
    collected: 14300000,
    target: 36000000,
    donors: 58,
    daysLeft: 52,
    isNew: true,
    isTrending: false,
  },
]

const filterTabs = ['Semua', 'Pendidikan', 'Kesehatan', 'Sosial', 'Ekonomi', 'Keagamaan', 'Air Bersih']

function formatRupiah(n: number): string {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`
  return `Rp ${(n / 1_000).toFixed(0)}rb`
}

export default function CrowdfundingSection({ onNavigate }: CrowdfundingProps) {
  const [activeFilter, setActiveFilter] = useState('Semua')
  const { inView, ref } = useInView()

  const filtered = activeFilter === 'Semua' ? campaigns : campaigns.filter((c) => c.category === activeFilter)

  return (
    <section id="crowdfunding" className="py-20 bg-[#FFF8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div>
            <span className="text-[#F58220] text-sm font-semibold uppercase tracking-wider">Crowdfunding</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Galang Dana Bersama
            </h2>
            <p className="text-gray-500 max-w-lg">
              Dukung kampanye kebaikan pilihan Anda. Setiap kontribusi, sekecil apapun, berarti bagi mereka yang membutuhkan.
            </p>
          </div>
          <div className="flex gap-6 flex-shrink-0">
            {[{ n: '38+', label: 'Kampanye Aktif' }, { n: '2.1K+', label: 'Total Donatur' }, { n: '4.2M', label: 'Dana Terkumpul' }].map((s) => (
              <div key={s.label} className="text-right">
                <div className="text-xl font-bold text-[#F58220]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.n}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`flex flex-wrap gap-2 mb-8 transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {filterTabs.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === f ? 'bg-[#F58220] text-white shadow-sm' : 'bg-white text-gray-500 border border-[#F3DEC8] hover:border-[#F58220] hover:text-[#F58220]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {filtered.map((c) => {
            const pct = Math.min(Math.round((c.collected / c.target) * 100), 100)
            const isAlmostDone = pct >= 85
            return (
              <div key={c.id} className="card-hover bg-white rounded-2xl overflow-hidden border border-[#F3DEC8] shadow-sm flex flex-col">
                <div className="relative h-48 bg-orange-50 overflow-hidden">
                  <img src={c.image} alt={c.alt} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-gray-700">{c.category}</span>
                    {c.isNew && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500 text-white">Baru</span>}
                    {c.isTrending && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F58220] text-white">🔥 Trending</span>}
                  </div>
                  {c.daysLeft <= 10 && (
                    <div className="absolute bottom-3 right-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500 text-white">{c.daysLeft} hari lagi!</span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-800 leading-snug mb-3 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.title}</h3>

                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1.5 text-xs">
                      <span className="text-gray-400">Terkumpul</span>
                      <span className={`font-bold ${isAlmostDone ? 'text-green-600' : 'text-[#F58220]'}`}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isAlmostDone ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-[#F58220] to-[#D96D0A]'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <div className="text-base font-bold text-gray-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{formatRupiah(c.collected)}</div>
                      <div className="text-xs text-gray-400">dari {formatRupiah(c.target)}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {c.donors} donatur
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {c.daysLeft} hari
                    </div>
                  </div>

                  <button onClick={() => onNavigate('donasi')} className="btn-primary block w-full text-center py-2.5 text-sm font-semibold mt-auto">
                    Dukung Sekarang
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => onNavigate('program')}
            className="border-2 border-[#F58220] text-[#F58220] hover:bg-[#F58220] hover:text-white transition-all duration-200 px-8 py-3 rounded-xl font-semibold text-sm"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Lihat Semua Kampanye →
          </button>
        </div>
      </div>
    </section>
  )
}
