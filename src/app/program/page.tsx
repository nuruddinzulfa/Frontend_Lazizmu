import { useState } from 'react'
import type { NavPage } from '../../App'

interface ProgramPageProps {
  onNavigate?: (page: NavPage) => void
  onDonateProgram?: (program: string) => void
}

const programs = [
  {
    id: 1,
    title: 'Beasiswa Pendidikan',
    category: 'Pendidikan',
    description: 'Program beasiswa untuk pelajar kurang mampu dari SD hingga perguruan tinggi agar dapat melanjutkan pendidikan.',
    target: 100000000,
    collected: 73500000,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop'
  },
  {
    id: 2,
    title: 'Bantuan Kesehatan',
    category: 'Kesehatan',
    description: 'Layanan kesehatan gratis dan bantuan biaya pengobatan bagi masyarakat yang tidak mampu.',
    target: 75000000,
    collected: 42000000,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
  },
  {
    id: 3,
    title: 'Pemberdayaan Ekonomi',
    category: 'Ekonomi',
    description: 'Modal usaha dan pelatihan keterampilan untuk keluarga kurang mampu agar mandiri secara ekonomi.',
    target: 150000000,
    collected: 98000000,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop'
  },
  {
    id: 4,
    title: 'Bantuan Pangan',
    category: 'Kemanusiaan',
    description: 'Distribusi paket sembako dan makanan bergizi untuk keluarga dhuafa dan lansia terlantar.',
    target: 50000000,
    collected: 50000000,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=250&fit=crop'
  },
  {
    id: 5,
    title: 'Pembangunan Masjid',
    category: 'Sosial Dakwah',
    description: 'Pembangunan dan renovasi masjid di daerah terpencil Kabupaten Pemalang sebagai pusat ibadah.',
    target: 200000000,
    collected: 134000000,
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400&h=250&fit=crop'
  },
  {
    id: 6,
    title: 'Pertanian Berkelanjutan',
    category: 'Lingkungan',
    description: 'Bantuan alat pertanian, bibit, dan pendampingan untuk petani kecil di wilayah Pemalang.',
    target: 80000000,
    collected: 31000000,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop'
  },
  {
    id: 7,
    title: 'Tanggap Bencana',
    category: 'Kemanusiaan',
    description: 'Bantuan cepat tanggap untuk korban bencana alam berupa logistik, sandang, dan pangan.',
    target: 60000000,
    collected: 18000000,
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=250&fit=crop'
  },
]

const categoryColors: Record<string, string> = {
  Pendidikan: 'bg-blue-100 text-blue-700',
  Kesehatan: 'bg-green-100 text-green-700',
  Ekonomi: 'bg-purple-100 text-purple-700',
  'Sosial Dakwah': 'bg-orange-100 text-orange-700',
  Kemanusiaan: 'bg-orange-100 text-orange-700',
  Lingkungan: 'bg-green-100 text-green-700',
}

/* =========================
   DATA KAMPANYE
========================= */

const campaign = [
  {
    id: 1,
    title: 'Ramadhan Berbagi',
    category: 'Kemanusiaan',
    description: 'Berbagi paket pangan dan kebutuhan pokok untuk keluarga dhuafa selama bulan Ramadhan.',
    target: 100000000,
    collected: 73500000,
    image: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=400&h=250&fit=crop'
  },
  {
    id: 2,
    title: 'Sedekah Air Bersih',
    category: 'Lingkungan',
    description: 'Penyediaan akses air bersih untuk masyarakat di wilayah yang mengalami kesulitan air.',
    target: 75000000,
    collected: 42000000,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=250&fit=crop'
  },
  {
    id: 3,
    title: 'Bantu Yatim Berprestasi',
    category: 'Pendidikan',
    description: 'Dukungan pendidikan, perlengkapan sekolah, dan beasiswa bagi anak yatim berprestasi.',
    target: 150000000,
    collected: 98000000,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=250&fit=crop'
  },
  {
    id: 4,
    title: 'Peduli Pengobatan Dhuafa',
    category: 'Kesehatan',
    description: 'Membantu biaya pengobatan dan kebutuhan kesehatan bagi masyarakat dhuafa yang membutuhkan.',
    target: 50000000,
    collected: 50000000,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop'
  },
  {
    id: 5,
    title: 'Wakaf Renovasi Masjid',
    category: 'Sosial Dakwah',
    description: 'Penggalangan dana untuk renovasi fasilitas masjid agar lebih nyaman digunakan masyarakat.',
    target: 200000000,
    collected: 134000000,
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400&h=250&fit=crop'
  },
  {
    id: 6,
    title: 'Modal Usaha UMKM',
    category: 'Ekonomi',
    description: 'Pemberian modal dan pendampingan usaha bagi pelaku UMKM dari keluarga kurang mampu.',
    target: 80000000,
    collected: 31000000,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop'
  },
  {
    id: 7,
    title: 'Bantu Korban Bencana',
    category: 'Kemanusiaan',
    description: 'Penggalangan bantuan darurat berupa logistik, makanan, dan kebutuhan pokok bagi korban bencana.',
    target: 60000000,
    collected: 18000000,
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400&h=250&fit=crop'
  },
]

const pillars = [
  {
    icon: '📚',
    name: 'Pendidikan',
    desc: 'Pendidikan adalah kunci utama untuk membuka pintu masa depan yang cerah. Lazismu, dengan komitmennya dalam membangun masyarakat yang lebih baik, terus berupaya memberikan akses pendidikan berkualitas bagi seluruh lapisan masyarakat, terutama mereka yang kurang beruntung.'
  },
  {
    icon: '🏥',
    name: 'Kesehatan',
    desc: 'Dalam hiruk pikuk kehidupan modern, kesehatan menjadi aset yang tak ternilai. Namun, tidak semua orang memiliki akses yang sama terhadap layanan kesehatan berkualitas. Di sinilah Lazismu hadir, dengan komitmennya untuk mewujudkan masyarakat Indonesia yang sehat dan sejahtera.'
  },
  {
    icon: '💼',
    name: 'Ekonomi',
    desc: 'Lazismu, sebagai lembaga zakat yang peduli pada kesejahteraan masyarakat, tidak hanya fokus pada aspek sosial dan pendidikan, namun juga pada pengembangan ekonomi masyarakat. Melalui Pilar Ekonomi, Lazismu berkomitmen untuk memberdayakan masyarakat, khususnya mereka yang berada di garis kemiskinan, agar dapat meningkatkan taraf hidup mereka.'
  },
  {
    icon: '🤲',
    name: 'Sosial Dakwah',
    desc: 'Lazismu, sebagai lembaga filantropi yang berakar pada nilai-nilai Islam, tidak hanya fokus pada aspek ekonomi dan pendidikan, namun juga pada pengembangan sosial dan dakwah. Melalui Pilar Sosial Dakwah, Lazismu berkomitmen untuk membangun masyarakat yang lebih baik dengan cara menebar kebaikan dan merangkul sesama.'
  },
  {
    icon: '🫂',
    name: 'Kemanusiaan',
    desc: 'Lazismu, sebagai lembaga filantropi yang berakar pada nilai-nilai Islam, senantiasa hadir di tengah masyarakat untuk memberikan bantuan dan dukungan. Pilar Kemanusiaan Lazismu menjadi manifestasi nyata dari komitmen kami untuk meringankan beban sesama dan membangun masyarakat yang lebih baik.'
  },
  {
    icon: '🌱',
    name: 'Lingkungan',
    desc: 'Lazismu, sebagai lembaga filantropi yang peduli terhadap kesejahteraan umat manusia, tidak hanya fokus pada aspek sosial dan ekonomi, namun juga pada pelestarian lingkungan. Pilar Lingkungan Lazismu menjadi manifestasi nyata dari komitmen kami untuk menjaga kelestarian alam dan memberikan kontribusi positif bagi generasi mendatang.'
  },
]

export default function ProgramPage({
  onDonateProgram
}: ProgramPageProps) {
  const [activeFilter, setActiveFilter] = useState('Semua')

  const filters = [
    'Semua',
    'Pendidikan',
    'Kesehatan',
    'Ekonomi',
    'Sosial Dakwah',
    'Kemanusiaan',
    'Lingkungan'
  ]

  const filtered =
    activeFilter === 'Semua'
      ? programs
      : programs.filter(p => p.category === activeFilter)

  const filteredCampaign =
    activeFilter === 'Semua'
      ? campaign
      : campaign.filter(c => c.category === activeFilter)

  const fmt = (n: number) =>
    'Rp ' + n.toLocaleString('id-ID')

  const pct = (c: number, t: number) =>
    Math.min(Math.round((c / t) * 100), 100)

  /* =========================
     CARD KAMPANYE
  ========================= */

  const renderCampaignCard = (
    item: typeof campaign[number]
  ) => (
    <div
      key={item.id}
      className="bg-white border border-[#F3DEC8] rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
    >
      <div className="relative">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-48 object-cover"
        />

        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${
            categoryColors[item.category]
          }`}
        >
          {item.category}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-bold text-gray-900 mb-2 text-sm"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}
        >
          {item.title}
        </h3>

        <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-1">
          {item.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Terkumpul</span>

            <span className="font-semibold text-[#F58220]">
              {pct(item.collected, item.target)}%
            </span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-[#F58220] h-2 rounded-full"
              style={{
                width: `${pct(
                  item.collected,
                  item.target
                )}%`
              }}
            />
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-gray-500">
              {fmt(item.collected)}
            </span>

            <span className="text-gray-400">
              dari {fmt(item.target)}
            </span>
          </div>
        </div>

        <button
          className="btn-primary w-full py-2 text-sm font-semibold rounded-xl"
          onClick={() =>
            onDonateProgram?.(item.title)
          }
        >
          Donasi Sekarang
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FFF8F2]">

      {/* =========================
          HEADER
      ========================= */}

      <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] text-white py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-sm mb-3 opacity-80">
            <span>Beranda</span>
            <span className="mx-2">/</span>
            <span>Program</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            Program Kami
          </h1>

          <p className="mt-4 text-lg opacity-90 max-w-2xl">
            Berbagai program nyata yang menyentuh kehidupan masyarakat Kabupaten Pemalang.
          </p>
        </div>
      </div>

      {/* =========================
          6 PILAR
      ========================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-2 bg-[#F58220] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
            Pilar Utama
          </div>

          <h2
            className="text-3xl font-bold text-gray-900"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
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

              <h3
                className="font-bold text-gray-900 mb-1 text-sm"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}
              >
                {pilar.name}
              </h3>

              <p className="text-xs text-gray-500 leading-relaxed">
                {pilar.desc}
              </p>

            </div>

          ))}

        </div>
      </div>

      {/* =========================
          FILTER
      ========================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">

        <div className="flex flex-wrap gap-3">

          {filters.map(f => (

            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeFilter === f
                  ? 'bg-[#F58220] text-white shadow-md'
                  : 'bg-white border border-[#F3DEC8] text-gray-600 hover:border-[#F58220] hover:text-[#F58220]'
              }`}
            >
              {f}
            </button>

          ))}

        </div>
      </div>

      {/* =========================
          PROGRAM
      ========================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        <div className="mb-8 mt-8">

          <div className="inline-flex items-center gap-2 bg-[#F58220] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-3">
            Program
          </div>

          <h2
            className="text-3xl font-bold text-gray-900"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            Program Unggulan
          </h2>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {filtered.map(program => (

            <div
              key={program.id}
              className="bg-white border border-[#F3DEC8] rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
            >

              <div className="relative">

                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-48 object-cover"
                />

                <span
                  className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${
                    categoryColors[program.category]
                  }`}
                >
                  {program.category}
                </span>

              </div>

              <div className="p-4 flex flex-col flex-1">

                <h3
                  className="font-bold text-gray-900 mb-2 text-sm"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}
                >
                  {program.title}
                </h3>

                <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-1">
                  {program.description}
                </p>

                <div className="space-y-2 mb-4">

                  <div className="flex justify-between text-xs text-gray-500">

                    <span>Terkumpul</span>

                    <span className="font-semibold text-[#F58220]">
                      {pct(
                        program.collected,
                        program.target
                      )}%
                    </span>

                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2">

                    <div
                      className="bg-[#F58220] h-2 rounded-full"
                      style={{
                        width: `${pct(
                          program.collected,
                          program.target
                        )}%`
                      }}
                    />

                  </div>

                  <div className="flex justify-between text-xs">

                    <span className="text-gray-500">
                      {fmt(program.collected)}
                    </span>

                    <span className="text-gray-400">
                      dari {fmt(program.target)}
                    </span>

                  </div>

                </div>

                <button
                  className="btn-primary w-full py-2 text-sm font-semibold rounded-xl"
                  onClick={() =>
                    onDonateProgram?.(
                      program.title
                    )
                  }
                >
                  Donasi Sekarang
                </button>

              </div>

            </div>

          ))}

        </div>
      </div>

      {/* =========================
          KAMPANYE
      ========================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-2 bg-[#F58220] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
            Kampanye
          </div>

          <h2
            className="text-3xl font-bold text-gray-900"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            Kampanye Kebaikan
          </h2>

          <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Dukung kampanye pilihan kami dan bersama-sama wujudkan kebaikan yang berdampak bagi masyarakat.
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {filteredCampaign.map(renderCampaignCard)}

        </div>

      </div>

    </div>
  )
}