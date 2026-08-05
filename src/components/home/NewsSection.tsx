import { useState } from 'react'
import { useInView } from '../../hooks/useInView'
import type { NavPage } from '../../App'

interface NewsSectionProps { onNavigate: (page: NavPage) => void }

const categories = ['Semua', 'Program', 'Berita', 'Kegiatan', 'Transparansi', 'Artikel']

const items = [
  {
    id: 1,
    title: 'LAZISMU Pemalang Salurkan 500 Paket Beasiswa untuk Pelajar Kurang Mampu',
    excerpt: 'Menyambut tahun ajaran baru, LAZISMU Pemalang kembali menyalurkan beasiswa pendidikan untuk 500 pelajar dari keluarga dhuafa di 14 kecamatan.',
    category: 'Program',
    date: '28 Jul 2025',
    image: 'https://images.unsplash.com/photo-1549431971-f54b3f5c82d8?w=600&h=400&fit=crop&auto=format',
    alt: 'Penyerahan beasiswa',
    featured: true,
    readTime: '3 menit',
    page: 'berita' as NavPage,
  },
  {
    id: 2,
    title: 'Laporan Keuangan Semester I 2025 Telah Dipublikasikan',
    excerpt: 'Sebagai bentuk akuntabilitas, LAZISMU Pemalang mempublikasikan laporan keuangan semester pertama 2025 dengan total penerimaan Rp 2,1 miliar.',
    category: 'Transparansi',
    date: '15 Jul 2025',
    image: 'https://images.unsplash.com/photo-1708481686679-1bfebe1afefc?w=600&h=400&fit=crop&auto=format',
    alt: 'Laporan keuangan',
    featured: false,
    readTime: '2 menit',
    page: 'publikasi' as NavPage,
  },
  {
    id: 3,
    title: 'Hukum Zakat Profesi: Panduan Lengkap Menurut Ulama Kontemporer',
    excerpt: 'Zakat profesi menjadi kewajiban bagi setiap Muslim yang memiliki penghasilan melebihi nisab. Berikut panduan lengkapnya.',
    category: 'Artikel',
    date: '10 Jul 2025',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&h=400&fit=crop&auto=format',
    alt: 'Artikel zakat profesi',
    featured: false,
    readTime: '5 menit',
    page: 'artikel' as NavPage,
  },
  {
    id: 4,
    title: 'Program Klinik Keliling Jangkau Desa Terpencil di Pegunungan',
    excerpt: 'Klinik keliling LAZISMU Pemalang berhasil melayani lebih dari 800 warga di desa-desa terpencil di sekitar lereng Gunung Slamet.',
    category: 'Berita',
    date: '18 Jun 2025',
    image: 'https://images.unsplash.com/photo-1650247452475-b5866374545d?w=600&h=400&fit=crop&auto=format',
    alt: 'Klinik keliling',
    featured: false,
    readTime: '4 menit',
    page: 'berita' as NavPage,
  },
]

function NewsCard({ article, featured = false, onNavigate }: { article: typeof items[0]; featured?: boolean; onNavigate: (page: NavPage) => void }) {
  if (featured) {
    return (
      <div
        onClick={() => onNavigate(article.page)}
        className="card-hover bg-white rounded-2xl overflow-hidden border border-[#F3DEC8] shadow-sm lg:col-span-2 flex flex-col lg:flex-row cursor-pointer"
      >
        <div className="relative lg:w-1/2 h-56 lg:h-auto bg-orange-50 overflow-hidden flex-shrink-0">
          <img src={article.image} alt={article.alt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <span className="absolute top-3 left-3 text-xs font-bold px-3 py-1.5 bg-[#F58220] text-white rounded-full">Unggulan</span>
        </div>
        <div className="p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold px-2.5 py-1 bg-[#FEF0E4] text-[#F58220] rounded-full">{article.category}</span>
              <span className="text-xs text-gray-400">{article.date}</span>
              <span className="text-xs text-gray-400">· {article.readTime} baca</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{article.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{article.excerpt}</p>
          </div>
          <div className="flex items-center gap-2 text-[#F58220] text-sm font-semibold mt-5 hover:gap-3 transition-all duration-200" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Baca Selengkapnya
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => onNavigate(article.page)}
      className="card-hover bg-white rounded-2xl overflow-hidden border border-[#F3DEC8] shadow-sm flex flex-col cursor-pointer"
    >
      <div className="relative h-44 bg-orange-50 overflow-hidden">
        <img src={article.image} alt={article.alt} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#FEF0E4] text-[#F58220] rounded-full">{article.category}</span>
          <span className="text-xs text-gray-400">{article.date}</span>
        </div>
        <h3 className="font-bold text-gray-800 text-sm leading-snug mb-2 flex-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{article.title}</h3>
        <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center gap-1.5 text-[#F58220] text-xs font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Baca Selengkapnya
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default function NewsSection({ onNavigate }: NewsSectionProps) {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const { inView, ref } = useInView()

  const filtered = activeCategory === 'Semua' ? items : items.filter(n => n.category === activeCategory)

  // destination for "Lihat Semua" based on active tab
  const lihatSemuaPage: NavPage = activeCategory === 'Artikel' ? 'artikel' : activeCategory === 'Transparansi' ? 'publikasi' : 'berita'

  return (
    <section id="news" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div>
            <span className="text-[#F58220] text-sm font-semibold uppercase tracking-wider">Berita & Artikel</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Kabar Terkini
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === c ? 'bg-[#F58220] text-white' : 'bg-[#FEF0E4] text-gray-600 hover:bg-[#F58220] hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {filtered.map((article, i) => (
            <NewsCard
              key={article.id}
              article={article}
              featured={article.featured && i === 0 && activeCategory === 'Semua'}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => onNavigate('berita')}
            className="border-2 border-[#F58220] text-[#F58220] hover:bg-[#F58220] hover:text-white transition-all duration-200 px-6 py-3 rounded-xl font-semibold text-sm"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Semua Berita →
          </button>
          <button
            onClick={() => onNavigate('artikel')}
            className="border-2 border-gray-200 text-gray-600 hover:border-[#F58220] hover:text-[#F58220] transition-all duration-200 px-6 py-3 rounded-xl font-semibold text-sm"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Semua Artikel →
          </button>
        </div>
      </div>
    </section>
  )
}
