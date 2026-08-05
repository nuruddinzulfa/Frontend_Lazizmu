import { useState } from 'react'
import type { NavPage } from '../../App'

interface BeritaPageProps {
  onNavigate?: (page: NavPage) => void
  onOpenContent?: (type: 'berita' | 'artikel', id: number) => void
}

const newsData = [
  { id: 1, title: 'LAZISMU Pemalang Salurkan 500 Paket Sembako untuk Warga Dhuafa', excerpt: 'Dalam rangka menyambut bulan Ramadan, LAZISMU Pemalang menyalurkan 500 paket sembako kepada warga kurang mampu di 14 kecamatan.', category: 'Kegiatan', date: '15 Januari 2025', image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=400&fit=crop', featured: true },
  { id: 2, title: 'Pembukaan Program Beasiswa 2025 untuk 200 Pelajar Berprestasi', excerpt: 'LAZISMU Pemalang membuka pendaftaran beasiswa bagi pelajar berprestasi dari keluarga kurang mampu untuk tahun akademik 2025.', category: 'Pengumuman', date: '10 Januari 2025', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop', featured: false },
  { id: 4, title: 'Pelatihan UMKM Gratis bagi 50 Penerima Manfaat Program Ekonomi', excerpt: 'Puluhan penerima manfaat program pemberdayaan ekonomi LAZISMU mengikuti pelatihan kewirausahaan selama tiga hari.', category: 'Kegiatan', date: '28 Desember 2024', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop', featured: false },
  { id: 5, title: 'Pengumuman Penerimaan Relawan LAZISMU 2025', excerpt: 'LAZISMU Pemalang membuka pendaftaran relawan untuk membantu berbagai program sosial sepanjang tahun 2025.', category: 'Pengumuman', date: '20 Desember 2024', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=250&fit=crop', featured: false },
  { id: 7, title: 'Tanggap Darurat Banjir Pemalang: LAZISMU Kirim Tim ke 5 Desa', excerpt: 'Tim tanggap bencana LAZISMU Pemalang segera bergerak ke 5 desa terdampak banjir dengan membawa logistik darurat.', category: 'Kegiatan', date: '10 Desember 2024', image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=250&fit=crop', featured: false },
]

const categoryColors: Record<string, string> = {
  Kegiatan: 'bg-blue-100 text-blue-700',
  Pengumuman: 'bg-yellow-100 text-yellow-700',
}

export default function BeritaPage({ onOpenContent }: BeritaPageProps) {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const categories = ['Semua', 'Kegiatan', 'Pengumuman']
  const featured = newsData.find(n => n.featured)!
  const regular = newsData.filter(n => !n.featured)
  const filtered = activeCategory === 'Semua' ? regular : regular.filter(n => n.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#FFF8F2]">
      <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] text-white py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-sm mb-3 opacity-80"><span>Beranda</span><span className="mx-2">/</span><span>Berita</span></div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Berita &amp; Informasi</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl">Informasi terkini kegiatan dan pengumuman LAZISMU Pemalang.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured */}
            <div
              className="bg-white border border-[#F3DEC8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => onOpenContent?.('berita', featured.id)}
            >
              <img src={featured.image} alt={featured.title} className="w-full h-64 object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[featured.category] ?? 'bg-gray-100 text-gray-700'}`}>{featured.category}</span>
                  <span className="text-xs text-gray-400">{featured.date}</span>
                  <span className="text-xs bg-[#FEF0E4] text-[#F58220] font-semibold px-2 py-1 rounded-full">Featured</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{featured.title}</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{featured.excerpt}</p>
                <button
                  className="text-[#F58220] font-semibold text-sm hover:underline"
                  onClick={e => { e.stopPropagation(); onOpenContent?.('berita', featured.id) }}
                >
                  Baca Selengkapnya →
                </button>
              </div>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-3">
              {categories.map(c => (
                <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeCategory === c ? 'bg-[#F58220] text-white' : 'bg-white border border-[#F3DEC8] text-gray-600 hover:border-[#F58220] hover:text-[#F58220]'}`}>{c}</button>
              ))}
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filtered.map(news => (
                <div
                  key={news.id}
                  className="bg-white border border-[#F3DEC8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => onOpenContent?.('berita', news.id)}
                >
                  <img src={news.image} alt={news.title} className="w-full h-44 object-cover" />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[news.category] ?? 'bg-gray-100 text-gray-700'}`}>{news.category}</span>
                      <span className="text-xs text-gray-400">{news.date}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{news.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{news.excerpt}</p>
                    <button
                      className="text-[#F58220] font-semibold text-xs hover:underline"
                      onClick={e => { e.stopPropagation(); onOpenContent?.('berita', news.id) }}
                    >
                      Baca Selengkapnya →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-[#F3DEC8] rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Kategori</h3>
              <div className="space-y-2">
                {categories.filter(c => c !== 'Semua').map(c => (
                  <button key={c} onClick={() => setActiveCategory(c)} className="flex items-center justify-between w-full px-3 py-2 rounded-xl hover:bg-[#FEF0E4] transition-colors group">
                    <span className="text-sm text-gray-600 group-hover:text-[#F58220]">{c}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{newsData.filter(n => n.category === c).length}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#F3DEC8] rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Berita Terbaru</h3>
              <div className="space-y-4">
                {newsData.slice(0, 4).map(n => (
                  <div
                    key={n.id}
                    className="flex gap-3 cursor-pointer group"
                    onClick={() => onOpenContent?.('berita', n.id)}
                  >
                    <img src={n.image} alt={n.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800 leading-snug mb-1 line-clamp-2 group-hover:text-[#F58220] transition-colors">{n.title}</p>
                      <p className="text-xs text-gray-400">{n.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
