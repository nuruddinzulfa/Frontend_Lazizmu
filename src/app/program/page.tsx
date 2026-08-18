'use client'

import type { NavPage } from '../../App'

interface ProgramPageProps {
  onNavigate?: (page: NavPage) => void
  onDonateProgram?: (program: string) => void
  onOpenPillar?: (category: string) => void
}

const pillars = [
  {
    icon: '📚',
    name: 'Pendidikan',
    desc: 'Pendidikan adalah kunci utama untuk membuka pintu masa depan yang cerah. LAZISMU terus berupaya memberikan akses pendidikan berkualitas bagi seluruh lapisan masyarakat, terutama mereka yang kurang beruntung.',
  },
  {
    icon: '🏥',
    name: 'Kesehatan',
    desc: 'Kesehatan menjadi aset yang tak ternilai. LAZISMU hadir dengan komitmen untuk membantu masyarakat memperoleh akses layanan kesehatan yang layak dan mewujudkan masyarakat yang sehat dan sejahtera.',
  },
  {
    icon: '💼',
    name: 'Ekonomi',
    desc: 'Melalui Pilar Ekonomi, LAZISMU berkomitmen memberdayakan masyarakat, khususnya mereka yang berada di garis kemiskinan, agar mampu meningkatkan taraf hidup dan kemandirian ekonomi.',
  },
  {
    icon: '🤲',
    name: 'Sosial Dakwah',
    desc: 'Pilar Sosial Dakwah berfokus pada penguatan kehidupan sosial dan dakwah dengan menebarkan kebaikan, kepedulian, serta membangun masyarakat yang lebih baik.',
  },
  {
    icon: '🫂',
    name: 'Kemanusiaan',
    desc: 'LAZISMU senantiasa hadir di tengah masyarakat untuk memberikan bantuan dan dukungan. Pilar Kemanusiaan menjadi wujud nyata komitmen untuk meringankan beban sesama.',
  },
  {
    icon: '🌱',
    name: 'Lingkungan',
    desc: 'Pilar Lingkungan berfokus pada kepedulian terhadap kelestarian alam serta kontribusi positif bagi lingkungan dan generasi yang akan datang.',
  },
]

export default function ProgramPage({
  onNavigate,
  onDonateProgram,
  onOpenPillar,
}: ProgramPageProps) {
  const handleOpenPillar = (category: string) => {
    console.log(
      '[DEBUG ProgramPage] Pilar diklik:',
      category
    )

    if (!onOpenPillar) {
      console.warn(
        '[DEBUG ProgramPage] onOpenPillar belum diberikan dari App.tsx'
      )
      return
    }

    onOpenPillar(category)
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] text-white py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-sm mb-3 opacity-80">
            <span>Beranda</span>

            <span className="mx-2">
              /
            </span>

            <span>Program & Kampanye</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Program & Kampanye
          </h1>

          <p className="mt-4 text-lg opacity-90 max-w-2xl">
            Mengenal pilar program LAZISMU Pemalang
            dan berbagai bentuk kebaikan yang
            diwujudkan melalui program serta kampanye
            nyata untuk masyarakat.
          </p>

        </div>
      </div>

      {/* =====================================================
          6 PILAR
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-2 bg-[#F58220] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
            Pilar Utama
          </div>

          <h2
            className="text-3xl font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            6 Pilar Program Unggulan
          </h2>

          <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Setiap pilar mewakili komitmen LAZISMU
            Pemalang dalam memberdayakan masyarakat
            secara menyeluruh dan berkelanjutan.
          </p>

        </div>

        {/* =====================================================
            PILLAR CARDS
        ===================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {pillars.map((pilar) => (

            <button
              key={pilar.name}
              type="button"
              onClick={() =>
                handleOpenPillar(pilar.name)
              }
              className="group w-full text-left bg-white border border-[#F3DEC8] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#F58220] transition-all duration-200"
            >

              {/* Icon */}

              <div className="flex items-start justify-between">

                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FEF0E4] rounded-xl text-2xl group-hover:bg-[#F58220] transition-colors duration-200">
                  <span className="group-hover:scale-110 transition-transform">
                    {pilar.icon}
                  </span>
                </div>

                {/* Arrow */}

                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FFF8F2] text-[#F58220] group-hover:bg-[#F58220] group-hover:text-white transition-all">

                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>

                </div>

              </div>

              {/* Title */}

              <h3
                className="mt-5 font-bold text-gray-900 text-base"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {pilar.name}
              </h3>

              {/* Description */}

              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {pilar.desc}
              </p>

              {/* Action */}

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#F58220]">

                Lihat Program

                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 6l6 6-6 6"
                  />
                </svg>

              </div>

            </button>

          ))}

        </div>

      </section>

      {/* =====================================================
          INFO
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        <div className="rounded-2xl bg-white border border-[#F3DEC8] p-6 sm:p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <span className="text-xs font-bold uppercase tracking-wide text-[#F58220]">
                Dari Program Menjadi Dampak
              </span>

              <h3
                className="mt-2 text-xl font-bold text-gray-900"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Setiap pilar diwujudkan melalui
                program dan kampanye nyata.
              </h3>

              <p className="mt-2 text-sm text-gray-500 max-w-2xl leading-relaxed">
                Pilih salah satu pilar untuk melihat
                program yang dijalankan serta kampanye
                yang sedang berlangsung di dalamnya.
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  )
}