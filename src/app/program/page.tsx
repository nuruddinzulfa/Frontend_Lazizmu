import { useState } from 'react'
import type { NavPage } from '../../App'

interface ProgramPageProps {
  onNavigate?: (page: NavPage) => void
  onDonateProgram?: (program: string) => void
}

const programs = [
  { id: 1, title: 'Beasiswa Pendidikan', category: 'Zakat', description: 'Program beasiswa untuk pelajar kurang mampu dari SD hingga perguruan tinggi agar dapat melanjutkan pendidikan.', target: 100000000, collected: 73500000, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop' },
  { id: 2, title: 'Bantuan Kesehatan', category: 'Infaq', description: 'Layanan kesehatan gratis dan bantuan biaya pengobatan bagi masyarakat yang tidak mampu.', target: 75000000, collected: 42000000, image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop' },
  { id: 3, title: 'Pemberdayaan Ekonomi', category: 'Zakat', description: 'Modal usaha dan pelatihan keterampilan untuk keluarga kurang mampu agar mandiri secara ekonomi.', target: 150000000, collected: 98000000, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop' },
  { id: 4, title: 'Bantuan Pangan', category: 'Sedekah', description: 'Distribusi paket sembako dan makanan bergizi untuk keluarga dhuafa dan lansia terlantar.', target: 50000000, collected: 50000000, image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=250&fit=crop' },
  { id: 5, title: 'Pembangunan Masjid', category: 'Wakaf', description: 'Pembangunan dan renovasi masjid di daerah terpencil Kabupaten Pemalang sebagai pusat ibadah.', target: 200000000, collected: 134000000, image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400&h=250&fit=crop' },
  { id: 6, title: 'Pertanian Berkelanjutan', category: 'Infaq', description: 'Bantuan alat pertanian, bibit, dan pendampingan untuk petani kecil di wilayah Pemalang.', target: 80000000, collected: 31000000, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop' },
  { id: 7, title: 'Tanggap Bencana', category: 'Sedekah', description: 'Bantuan cepat tanggap untuk korban bencana alam berupa logistik, sandang, dan pangan.', target: 60000000, collected: 18000000, image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=250&fit=crop' },
  { id: 8, title: 'Wakaf Produktif', category: 'Wakaf', description: 'Program wakaf aset produktif yang hasilnya digunakan untuk mendanai program sosial secara berkelanjutan.', target: 500000000, collected: 210000000, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop' },
]

const categoryColors: Record<string, string> = {
  Zakat: 'bg-blue-100 text-blue-700',
  Infaq: 'bg-green-100 text-green-700',
  Sedekah: 'bg-purple-100 text-purple-700',
  Wakaf: 'bg-orange-100 text-orange-700',
}

const pillars = [
  { icon: '📚', name: 'Pendidikan', desc: 'Beasiswa & Mentoring untuk generasi unggul' },
  { icon: '🏥', name: 'Kesehatan', desc: 'Klinik gratis & santunan biaya pengobatan' },
  { icon: '💼', name: 'Ekonomi', desc: 'Modal UMKM & pelatihan kewirausahaan' },
  { icon: '🤲', name: 'Sosial', desc: 'Pangan dhuafa & respons kemanusiaan' },
  { icon: '🕌', name: 'Dakwah', desc: 'Masjid & program Tahfidz Quran' },
  { icon: '🌱', name: 'Lingkungan', desc: 'Pertanian berkelanjutan & air bersih' },
]

export default function ProgramPage({ onDonateProgram }: ProgramPageProps) {
  const [activeFilter, setActiveFilter] = useState('Semua')
  const filters = ['Semua', 'Zakat', 'Infaq', 'Sedekah', 'Wakaf']
  const filtered = activeFilter === 'Semua' ? programs : programs.filter(p => p.category === activeFilter)
  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
  const pct = (c: number, t: number) => Math.min(Math.round((c / t) * 100), 100)

  return (
    <div className="min-h-screen bg-[#FFF8F2]">
      <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] text-white py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-sm mb-3 opacity-80"><span>Beranda</span><span className="mx-2">/</span><span>Program</span></div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Program Kami</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl">Berbagai program nyata yang menyentuh kehidupan masyarakat Kabupaten Pemalang.</p>
        </div>
      </div>

      {/* 6 Pilar Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#F58220] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
            Pilar Utama
          </div>
          <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            6 Pilar Program Unggulan
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Setiap pilar mewakili komitmen LAZISMU Pemalang dalam memberdayakan masyarakat secara menyeluruh dan berkelanjutan.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {pillars.map((pilar) => (
            <div
              key={pilar.name}
              className="bg-white border border-[#F3DEC8] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#F58220] transition-all group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FEF0E4] rounded-xl mb-4 text-2xl group-hover:bg-[#F58220] transition-colors">
                <span>{pilar.icon}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{pilar.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{pilar.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="flex flex-wrap gap-3">
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeFilter === f ? 'bg-[#F58220] text-white shadow-md' : 'bg-white border border-[#F3DEC8] text-gray-600 hover:border-[#F58220] hover:text-[#F58220]'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(program => (
            <div key={program.id} className="bg-white border border-[#F3DEC8] rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
              <div className="relative">
                <img src={program.image} alt={program.title} className="w-full h-48 object-cover" />
                <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[program.category]}`}>{program.category}</span>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 mb-2 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{program.title}</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-1">{program.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Terkumpul</span>
                    <span className="font-semibold text-[#F58220]">{pct(program.collected, program.target)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-[#F58220] h-2 rounded-full" style={{ width: `${pct(program.collected, program.target)}%` }} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">{fmt(program.collected)}</span>
                    <span className="text-gray-400">dari {fmt(program.target)}</span>
                  </div>
                </div>
                <button
                  className="btn-primary w-full py-2 text-sm font-semibold rounded-xl"
                  onClick={() => onDonateProgram?.(program.title)}
                >
                  Donasi Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
