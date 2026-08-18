'use client'

import type { NavPage } from '../../App'

interface ProgramPageProps {
  onNavigate?: (page: NavPage) => void
  onDonateProgram?: (program: string) => void
  onOpenPillar?: (category: string) => void
}

/*
|--------------------------------------------------------------------------
| DATA 6 PILAR
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function ProgramPage({
  onNavigate,
  onDonateProgram,
  onOpenPillar,
}: ProgramPageProps) {
  /*
  |--------------------------------------------------------------------------
  | OPEN PILAR
  |--------------------------------------------------------------------------
  */

  const handleOpenPillar = (
    category: string
  ) => {
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

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-[#FFF8F2]">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <section className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] py-16 pt-32 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}

          <div className="mb-3 text-sm opacity-80">
            <span>Beranda</span>

            <span className="mx-2">
              /
            </span>

            <span>
              Program & Kampanye
            </span>
          </div>

          {/* Title */}

          <h1
            className="text-3xl font-bold sm:text-4xl lg:text-5xl"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Program & Kampanye
          </h1>

          {/* Description */}

          <p className="mt-4 max-w-2xl text-lg leading-relaxed opacity-90">
            Mengenal pilar program LAZISMU Pemalang
            dan berbagai bentuk kebaikan yang
            diwujudkan melalui program serta kampanye
            nyata untuk masyarakat.
          </p>

        </div>
      </section>

      {/* ============================================================
          6 PILAR
      ============================================================ */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        {/* Section Header */}

        <div className="mb-10 text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F58220] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
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

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500">
            Setiap pilar mewakili komitmen LAZISMU
            Pemalang dalam memberdayakan masyarakat
            secara menyeluruh dan berkelanjutan.
          </p>

        </div>

        {/* ==========================================================
            PILLAR CARDS
        ========================================================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {pillars.map((pillar) => (
            <button
              key={pillar.name}
              type="button"
              onClick={() =>
                handleOpenPillar(
                  pillar.name
                )
              }
              className="group w-full rounded-2xl border border-[#F3DEC8] bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#F58220] hover:shadow-md"
            >

              {/* Card Header */}

              <div className="flex items-start justify-between">

                {/* Icon */}

                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#FEF0E4] text-2xl transition-colors duration-200 group-hover:bg-[#F58220]">

                  <span className="transition-transform duration-200 group-hover:scale-110">
                    {pillar.icon}
                  </span>

                </div>

                {/* Arrow */}

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF8F2] text-[#F58220] transition-all group-hover:bg-[#F58220] group-hover:text-white">

                  <svg
                    className="h-4 w-4"
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
                className="mt-5 text-base font-bold text-gray-900"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {pillar.name}
              </h3>

              {/* Description */}

              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {pillar.desc}
              </p>

              {/* Action */}

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#F58220]">

                <span>
                  Lihat Program
                </span>

                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
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

      {/* ============================================================
          INFO
      ============================================================ */}

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-6 sm:p-8">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

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

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
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