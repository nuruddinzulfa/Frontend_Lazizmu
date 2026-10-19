'use client'

import type { NavPage } from '../../App'

interface ProgramsProps {
  onNavigate?: (page: NavPage) => void
  onOpenPillar?: (category: string) => void
}

/*
|--------------------------------------------------------------------------
| ICON PILAR
|--------------------------------------------------------------------------
*/

function PillarIcon({
  name,
}: {
  name: string
}) {
  switch (name) {
    case 'Pendidikan':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
        >
          <path
            d="M8 21L32 12L56 21L32 30L8 21Z"
            fill="white"
          />

          <path
            d="M14 25V38C14 40 15.5 42 18 43L32 49L46 43C48.5 42 50 40 50 38V25L32 32L14 25Z"
            fill="white"
          />

          <path
            d="M32 30V48"
            stroke="#F58220"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="M51 22V34"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <circle
            cx="51"
            cy="36"
            r="2"
            fill="white"
          />
        </svg>
      )

    case 'Kesehatan':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
        >
          <path
            d="M32 51C30.8 49.9 13 35.2 13 23.5C13 16.8 17.7 12 24 12C27.8 12 30.6 14 32 17C33.4 14 36.2 12 40 12C46.3 12 51 16.8 51 23.5C51 35.2 33.2 49.9 32 51Z"
            fill="white"
          />

          <path
            d="M17 31H25L29 23L34 39L39 29L42 31H48"
            stroke="#F58220"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )

    case 'Ekonomi':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
        >
          <path
            d="M10 48H55"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />

          <path
            d="M14 44L27 33L35 38L52 20"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M44 20H52V28"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M16 43V36"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
          />

          <path
            d="M28 43V30"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
          />

          <path
            d="M40 43V34"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'Sosial Dakwah':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
        >
          <path
            d="M17 31C18.5 21 24 15 32 15C40 15 45.5 21 47 31H17Z"
            fill="white"
          />

          <path
            d="M31 8C27 9 25 12 26 15C27 18 30 19 33 18C29 17 28 14 29 12C30 10 32 9 34 9C33 8 32 8 31 8Z"
            fill="white"
          />

          <path
            d="M13 30H20V48H13V30Z"
            fill="white"
          />

          <path
            d="M44 30H51V48H44V30Z"
            fill="white"
          />

          <path
            d="M19 30H45V48H19V30Z"
            fill="white"
          />

          <path
            d="M28 48V39C28 36.8 29.8 35 32 35C34.2 35 36 36.8 36 39V48H28Z"
            fill="#F58220"
          />

          <path
            d="M9 48H55V53H9V48Z"
            fill="white"
          />

          <circle
            cx="24"
            cy="37"
            r="2"
            fill="#F58220"
          />

          <circle
            cx="40"
            cy="37"
            r="2"
            fill="#F58220"
          />
        </svg>
      )

    case 'Kemanusiaan':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
        >
          <circle
            cx="32"
            cy="18"
            r="6"
            fill="white"
          />

          <circle
            cx="18"
            cy="23"
            r="5"
            fill="white"
          />

          <circle
            cx="46"
            cy="23"
            r="5"
            fill="white"
          />

          <path
            d="M23 41C23 33.3 27 28 32 28C37 28 41 33.3 41 41V47H23V41Z"
            fill="white"
          />

          <path
            d="M10 43C10 36.5 13.2 32 18 32C20.4 32 22.4 33 24 35C21.8 38 21 41.5 21 46H10V43Z"
            fill="white"
          />

          <path
            d="M54 43C54 36.5 50.8 32 46 32C43.6 32 41.6 33 40 35C42.2 38 43 41.5 43 46H54V43Z"
            fill="white"
          />

          <path
            d="M14 48C18 44 24 43 32 43C40 43 46 44 50 48"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'Lingkungan':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
        >
          <circle
            cx="32"
            cy="34"
            r="17"
            stroke="white"
            strokeWidth="4"
          />

          <path
            d="M15 34H49"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d="M32 17C27 22 25 28 25 34C25 40 27 46 32 51"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d="M32 17C37 22 39 28 39 34C39 40 37 46 32 51"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d="M32 17V7"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d="M32 12C25 12 21 8 21 4C27 4 31 7 32 12Z"
            fill="white"
          />

          <path
            d="M32 12C39 12 43 8 43 4C37 4 33 7 32 12Z"
            fill="white"
          />
        </svg>
      )

    default:
      return null
  }
}

/*
|--------------------------------------------------------------------------
| DATA 6 PILAR PROGRAM
|--------------------------------------------------------------------------
*/

const pillars = [
  {
    name: 'Pendidikan',
    color: '#F58220',
    desc: 'Membuka akses pendidikan berkualitas bagi masyarakat yang membutuhkan dan membantu mereka membangun masa depan yang lebih baik.',
  },
  {
    name: 'Kesehatan',
    color: '#E94224',
    desc: 'Mendukung masyarakat memperoleh layanan kesehatan yang layak demi kehidupan yang lebih sehat dan sejahtera.',
  },
  {
    name: 'Ekonomi',
    color: '#D21F26',
    desc: 'Memberdayakan masyarakat prasejahtera agar taraf hidup meningkat dan kemandirian ekonomi dapat tumbuh.',
  },
  {
    name: 'Sosial Dakwah',
    color: '#F9B233',
    desc: 'Menguatkan kehidupan sosial dan dakwah melalui semangat kebaikan, kepedulian, dan kebersamaan.',
  },
  {
    name: 'Kemanusiaan',
    color: '#94C11F',
    desc: 'Hadir memberi bantuan dan dukungan untuk meringankan beban sesama.',
  },
  {
    name: 'Lingkungan',
    color: '#C8D52D',
    desc: 'Mendorong kepedulian terhadap kelestarian alam demi lingkungan yang lebih baik bagi generasi mendatang.',
  },
]

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function Programs({
  onOpenPillar,
}: ProgramsProps) {

  const handleOpenPillar = (
    category: string
  ) => {
    console.log(
      '[Programs Home] Pilar diklik:',
      category
    )

    if (!onOpenPillar) {
      console.warn(
        '[Programs Home] onOpenPillar belum diberikan dari HomePage/App.'
      )

      return
    }

    onOpenPillar(category)
  }

  return (
    <section
      id="programs"
      className="relative overflow-hidden bg-white py-20 sm:py-24"
    >

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[430px] w-[430px] rounded-full bg-[#F58220]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-[-120px] h-[500px] w-[500px] rounded-full bg-[#F58220]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-[320px] w-[320px] rounded-full border-2 border-[#F58220]/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-[-60px] h-[210px] w-[210px] rounded-full border-2 border-[#F58220]/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-8 top-40 h-24 w-24 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(#F58220 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 right-12 h-24 w-24 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(#F58220 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="mx-auto mb-12 max-w-2xl text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F58220]/15 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#F58220] shadow-sm backdrop-blur-sm">

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFF0E4] text-sm">
              ✦
            </span>

            Pilar Utama

          </div>

          <h2
            className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            6 Pilar Program
            Unggulan
          </h2>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-[#F58220] to-[#D96808]" />

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
            Setiap pilar mewakili komitmen
            Lazismu Pemalang dalam
            memberdayakan masyarakat secara
            menyeluruh dan berkelanjutan.
          </p>

        </div>

        {/* ===================================================
            PILLAR CARDS
        =================================================== */}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {pillars.map(
            (pillar) => (
              <button
                key={pillar.name}
                type="button"
                onClick={() =>
                  handleOpenPillar(
                    pillar.name
                  )
                }
                className="group relative flex h-full min-h-[350px] w-full flex-col overflow-hidden rounded-3xl border border-[#F1D9C1] bg-white p-6 text-left shadow-[0_10px_35px_rgba(70,45,24,0.055)] transition-all duration-300 hover:-translate-y-1 hover:border-[#E8C4A2] hover:shadow-[0_18px_42px_rgba(70,45,24,0.1)] sm:p-7"
              >

                <div
                  aria-hidden="true"
                  className="absolute inset-x-7 top-0 h-[3px] rounded-full opacity-80"
                  style={{
                    backgroundColor:
                      pillar.color,
                  }}
                />

                {/* HEADER */}

                <div className="relative flex items-center justify-between">

                  {/* ICON */}

                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-[18px] shadow-[0_6px_14px_rgba(70,45,24,0.12)] transition-transform duration-300 group-hover:scale-[1.03]"
                    style={{
                      backgroundColor:
                        pillar.color,
                    }}
                  >
                    <PillarIcon
                      name={
                        pillar.name
                      }
                    />
                  </div>

                </div>

                {/* TITLE */}

                <h3
                  className="relative mt-7 text-xl font-semibold tracking-[-0.02em] text-[#1E293B] transition-colors duration-200 group-hover:text-[#C96513]"
                  style={{
                    fontFamily:
                      "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {pillar.name}
                </h3>

                {/* DESCRIPTION */}

                <p className="relative mt-3 flex-1 text-sm leading-7 text-[#64748B]">
                  {pillar.desc}
                </p>

                {/* ACTION */}

                <div className="relative mt-6 flex items-center justify-between border-t border-[#F1E6DC] pt-5 text-sm font-semibold text-[#C96513]">

                  <span>
                    Jelajahi pilar
                  </span>

                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
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
            )
          )}

        </div>

      </div>
    </section>
  )
}
