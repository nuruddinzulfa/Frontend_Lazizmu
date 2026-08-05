import { useState } from 'react'
import type { NavPage } from '../../App'

interface ArtikelPageProps {
  onNavigate?: (page: NavPage) => void
  onOpenContent?: (type: 'berita' | 'artikel', id: number) => void
}

const articles = [
  { id: 1, title: 'Hukum Zakat Profesi dalam Islam', category: 'Zakat', excerpt: 'Pembahasan mendalam tentang kewajiban zakat bagi karyawan dan profesional modern berdasarkan dalil Al-Quran dan hadis.', author: 'Ustaz Ahmad Fauzi', date: '20 Januari 2025', readTime: '5 menit', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop' },
  { id: 2, title: 'Keutamaan Infaq di Jalan Allah', category: 'Infaq', excerpt: 'Allah SWT menjanjikan balasan berlipat ganda bagi orang yang berinfaq dengan ikhlas. Pelajari keutamaan dan manfaatnya.', author: 'Ustazah Rina Marliana', date: '15 Januari 2025', readTime: '4 menit', image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=250&fit=crop' },
  { id: 3, title: 'Cara Menghitung Zakat Maal dengan Benar', category: 'Zakat', excerpt: 'Panduan praktis menghitung zakat harta kekayaan sesuai nisab dan haul yang berlaku dalam syariat Islam.', author: 'Ust. Bambang Sutrisno', date: '10 Januari 2025', readTime: '7 menit', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop' },
  { id: 4, title: 'Wakaf Produktif di Era Modern', category: 'Wakaf', excerpt: 'Inovasi pengelolaan wakaf produktif yang dapat menghasilkan manfaat berkelanjutan bagi umat Islam.', author: 'Dr. Supriyadi', date: '5 Januari 2025', readTime: '6 menit', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop' },
  { id: 5, title: 'Kisah Sahabat yang Dermawan', category: 'Inspirasi', excerpt: 'Mengambil hikmah dari kisah kedermawanan para sahabat Nabi SAW yang rela mengorbankan harta di jalan Allah.', author: 'Ustaz Ahmad Fauzi', date: '28 Desember 2024', readTime: '8 menit', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop' },
  { id: 6, title: 'Fikih Zakat Fitrah: Hukum dan Tata Cara', category: 'Fiqih', excerpt: 'Penjelasan lengkap tentang hukum, waktu, besaran, dan tata cara menunaikan zakat fitrah menjelang Idul Fitri.', author: 'Ustazah Rina Marliana', date: '20 Desember 2024', readTime: '10 menit', image: 'https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?w=400&h=250&fit=crop' },
]

const catColors: Record<string, string> = {
  Zakat: 'bg-blue-100 text-blue-700',
  Infaq: 'bg-green-100 text-green-700',
  Sedekah: 'bg-purple-100 text-purple-700',
  Wakaf: 'bg-orange-100 text-orange-700',
  Fiqih: 'bg-red-100 text-red-700',
  Inspirasi: 'bg-yellow-100 text-yellow-700',
}

export default function ArtikelPage({ onOpenContent }: ArtikelPageProps) {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [search, setSearch] = useState('')
  const categories = ['Semua', 'Zakat', 'Infaq', 'Sedekah', 'Wakaf', 'Fiqih', 'Inspirasi']

  const filtered = articles.filter(a => {
    const matchCat = activeCategory === 'Semua' || a.category === activeCategory
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#FFF8F2]">
      <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] text-white py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-sm mb-3 opacity-80"><span>Beranda</span><span className="mx-2">/</span><span>Artikel</span></div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Artikel Islami</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl">Perkaya pengetahuan Islam Anda tentang zakat, infaq, sedekah, dan wakaf.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="relative max-w-lg mb-8">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari artikel..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#F3DEC8] rounded-xl text-sm focus:outline-none focus:border-[#F58220] shadow-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeCategory === c ? 'bg-[#F58220] text-white' : 'bg-white border border-[#F3DEC8] text-gray-600 hover:border-[#F58220] hover:text-[#F58220]'}`}>{c}</button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(article => (
            <div
              key={article.id}
              className="bg-white border border-[#F3DEC8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer"
              onClick={() => onOpenContent?.('artikel', article.id)}
            >
              <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
              <div className="p-5 flex flex-col flex-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full self-start mb-3 ${catColors[article.category]}`}>{article.category}</span>
                <h3 className="font-bold text-gray-900 mb-2 leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{article.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{article.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#FEF0E4] flex items-center justify-center">
                      <svg className="w-3 h-3 text-[#F58220]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" /></svg>
                    </div>
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{article.date}</span>
                    <span>·</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
                <button
                  className="mt-3 text-[#F58220] font-semibold text-xs hover:underline text-left"
                  onClick={e => { e.stopPropagation(); onOpenContent?.('artikel', article.id) }}
                >
                  Baca Selengkapnya →
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Artikel tidak ditemukan</p>
          </div>
        )}
      </div>
    </div>
  )
}
