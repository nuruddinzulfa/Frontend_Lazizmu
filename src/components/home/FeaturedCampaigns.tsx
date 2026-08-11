import { useState } from 'react'
import { useInView } from '../../hooks/useInView'
import type { NavPage } from '../../App'

interface FeaturedCampaignsProps { onNavigate: (page: NavPage) => void }

const campaigns = [
  {
    id: 1,
    title: 'Beasiswa Anak Kurang Mampu Pemalang',
    category: 'Pendidikan',
    categoryColor: 'bg-blue-100 text-blue-700',
    image: 'https://images.unsplash.com/photo-1549431971-f54b3f5c82d8?w=600&h=400&fit=crop&auto=format',
    alt: 'Anak sedang belajar',
    collected: 78500000,
    target: 100000000,
    donors: 284,
    daysLeft: 12,
    urgent: true,
  },
  {
    id: 2,
    title: 'Bantuan Pangan Keluarga Dhuafa',
    category: 'Ekonomi',
    categoryColor: 'bg-green-100 text-green-700',
    image: 'https://images.unsplash.com/photo-1637034132661-4f015591b84a?w=600&h=400&fit=crop&auto=format',
    alt: 'Distribusi bantuan pangan',
    collected: 45200000,
    target: 75000000,
    donors: 156,
    daysLeft: 21,
    urgent: false,
  },
  {
    id: 3,
    title: 'Renovasi Masjid Desa Terpencil',
    category: 'Sosial Dakwah',
    categoryColor: 'bg-purple-100 text-purple-700',
    image: 'https://images.unsplash.com/photo-1708481686679-1bfebe1afefc?w=600&h=400&fit=crop&auto=format',
    alt: 'Masjid yang akan direnovasi',
    collected: 112000000,
    target: 150000000,
    donors: 478,
    daysLeft: 35,
    urgent: false,
  },
]

function formatRupiah(n: number): string {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}rb`
  return `Rp ${n.toLocaleString('id-ID')}`
}

function CampaignCard({ campaign, delay, onNavigate }: { campaign: typeof campaigns[0]; delay: number; onNavigate: (page: NavPage) => void }) {
  const [favorited, setFavorited] = useState(false)
  const pct = Math.round((campaign.collected / campaign.target) * 100)

  return (
    <div
      className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-[#F3DEC8] flex flex-col"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative h-52 bg-orange-50 overflow-hidden">
        <img src={campaign.image} alt={campaign.alt} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${campaign.categoryColor}`}>{campaign.category}</span>
          {campaign.urgent && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500 text-white animate-pulse">Urgent</span>
          )}
        </div>
        <button
          onClick={() => setFavorited(!favorited)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          aria-label="Favoritkan"
        >
          <svg className={`w-4 h-4 transition-colors ${favorited ? 'text-red-500 fill-current' : 'text-gray-400'}`} fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {campaign.title}
        </h3>

        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Progress</span>
            <span className="font-semibold text-[#F58220]">{pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#F58220] to-[#D96D0A] rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="text-base font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{formatRupiah(campaign.collected)}</div>
            <div className="text-xs text-gray-400">dari {formatRupiah(campaign.target)}</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{campaign.donors.toLocaleString('id-ID')} donatur</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{campaign.daysLeft} hari lagi</span>
          </div>
        </div>

        <button onClick={() => onNavigate('donasi')} className="btn-primary block w-full text-center py-2.5 text-sm font-semibold mt-auto">
          Donasi Sekarang
        </button>
      </div>
    </div>
  )
}

export default function FeaturedCampaigns({ onNavigate }: FeaturedCampaignsProps) {
  const { inView, ref } = useInView()

  return (
    <section id="campaigns" className="py-20 bg-[#FFF8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-12 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <span className="text-[#F58220] text-sm font-semibold uppercase tracking-wider">Kampanye</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Kampanye Unggulan
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Pilih Kampanye yang sesuai dengan niat kebaikan Anda. Setiap rupiah bernilai ibadah.
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {campaigns.map((c, i) => (
            <CampaignCard key={c.id} campaign={c} delay={i * 100} onNavigate={onNavigate} />
          ))}
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
