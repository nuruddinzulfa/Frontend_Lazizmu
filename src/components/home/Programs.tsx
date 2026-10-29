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
          className="h-12 w-12"
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
            stroke="#EA6113"
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
          className="h-12 w-12"
        >
          <path
            d="M32 51C30.8 49.9 13 35.2 13 23.5C13 16.8 17.7 12 24 12C27.8 12 30.6 14 32 17C33.4 14 36.2 12 40 12C46.3 12 51 16.8 51 23.5C51 35.2 33.2 49.9 32 51Z"
            fill="white"
          />

          <path
            d="M17 31H25L29 23L34 39L39 29L42 31H48"
            stroke="#EA6113"
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
          className="h-12 w-12"
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
          className="h-12 w-12"
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
            fill="#EA6113"
          />

          <path
            d="M9 48H55V53H9V48Z"
            fill="white"
          />

          <circle
            cx="24"
            cy="37"
            r="2"
            fill="#EA6113"
          />

          <circle
            cx="40"
            cy="37"
            r="2"
            fill="#EA6113"
          />
        </svg>
      )

    case 'Kemanusiaan':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12"
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
          className="h-12 w-12"
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
    color: '#EA6113',
    desc: 'Pendidikan adalah kunci utama untuk membuka pintu masa depan yang cerah. Lazismu terus berupaya memberikan akses pendidikan berkualitas bagi seluruh lapisan masyarakat, terutama mereka yang kurang beruntung.',
  },
  {
    name: 'Kesehatan',
    color: '#F88F22',
    desc: 'Kesehatan menjadi aset yang tak ternilai. Lazismu hadir dengan komitmen untuk membantu masyarakat memperoleh akses layanan kesehatan yang layak dan mewujudkan masyarakat yang sehat dan sejahtera.',
  },
  {
    name: 'Ekonomi',
    color: '#EA6113',
    desc: 'Melalui Pilar Ekonomi, Lazismu berkomitmen memberdayakan masyarakat, khususnya mereka yang berada di garis kemiskinan, agar mampu meningkatkan taraf hidup dan kemandirian ekonomi.',
  },
  {
    name: 'Sosial Dakwah',
    color: '#FBB931',
    desc: 'Pilar Sosial Dakwah berfokus pada penguatan kehidupan sosial dan dakwah dengan menebarkan kebaikan, kepedulian, serta membangun masyarakat yang lebih baik.',
  },
  {
    name: 'Kemanusiaan',
    color: '#F88F22',
    desc: 'Lazismu senantiasa hadir di tengah masyarakat untuk memberikan bantuan dan dukungan. Pilar Kemanusiaan menjadi wujud nyata komitmen untuk meringankan beban sesama.',
  },
  {
    name: 'Lingkungan',
    color: '#FBB931',
    desc: 'Pilar Lingkungan berfokus pada kepedulian terhadap kelestarian alam serta kontribusi positif bagi lingkungan dan generasi yang akan datang.',
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
      className="landing-section landing-section--cream landing-section--orb-l"
    >

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="mx-auto mb-12 max-w-2xl text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#EA6113]/15 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#EA6113] shadow-sm ">

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFE3B3] text-sm">
              ✦
            </span>

            Pilar Utama

          </div>

          <h2
            className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl"
            style={{
              fontFamily:
                "'Fraunces', serif",
            }}
          >
            6 Pilar Program
            Unggulan
          </h2>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full  bg-[#EA6113] " />

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
                className="group relative w-full overflow-hidden rounded-[28px] border border-[#E8CDAA] bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#EA6113]/40 shadow-sm sm:p-7"
              >

                {/* CARD GLOW */}

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full opacity-0  transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    backgroundColor:
                      pillar.color,
                  }}
                />

                {/* HEADER */}

                <div className="relative flex items-start justify-between">

                  {/* ICON */}

                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-md transition-all duration-300 group-hover:scale-105 group-hover:rotate-2 group-hover:shadow-lg"
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

                  {/* ARROW */}

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF8EA] text-[#EA6113] transition-all duration-300 group-hover:bg-[#EA6113] group-hover:text-white">

                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
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

                {/* TITLE */}

                <h3
                  className="relative mt-6 text-lg font-bold text-gray-900 transition-colors duration-200 group-hover:text-[#EA6113]"
                  style={{
                    fontFamily:
                      "'Fraunces', serif",
                  }}
                >
                  {pillar.name}
                </h3>

                {/* DESCRIPTION */}

                <p className="relative mt-3 text-sm leading-7 text-gray-500">
                  {pillar.desc}
                </p>

                {/* ACTION */}

                <div className="relative mt-6 flex items-center gap-2 text-sm font-bold text-[#EA6113]">

                  <span>
                    Lihat Program
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

                {/* BOTTOM ACCENT */}

                <div
                  className="absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full"
                  style={{
                    backgroundColor:
                      pillar.color,
                  }}
                />

              </button>
            )
          )}

        </div>

      </div>
    </section>
  )
}
