'use client'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { NavPage } from '../../App'
import { api } from '../../services/api'

interface ProgramPageProps {
  onNavigate?: (page: NavPage) => void
  onDonateProgram?: (program: string) => void
  onOpenPillar?: (category: string) => void
}

interface Program {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  thumbnail?: string | null
  pillar?: string | null
  published_at?: string | null
  views?: number | null
  sort_order?: number | null
}

interface ProgramResponse {
  success: boolean
  message?: string
  data: Program[]
}

interface Campaign {
  id: number
  title: string
  slug: string
  short_description?: string | null
  description?: string | null
  image?: string | null
  thumbnail?: string | null
  category?: string | null
  target_amount?: number | string | null
  collected_amount?: number | string | null
  donor_count?: number | null
  status?: string
  featured?: boolean | number
}

interface CampaignResponse {
  success: boolean
  message?: string
  data:
    | Campaign[]
    | {
        data: Campaign[]
      }
}

/* =========================================================
   PILAR ICON
========================================================= */

function PillarIcon({
  name,
  className = 'h-8 w-8',
}: {
  name: string
  className?: string
}) {
  switch (name) {
    case 'Pendidikan':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
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
          className={className}
        >
          <path
            d="M32 51C30.8 49.9 13 35.2 13 23.5C13 16.8 17.7 12 24 12C27.8 12 30.6 14 32 17C33.4 14 36.2 12 40 12C46.3 12 51 16.8 51 23.5C51 35.2 33.2 49.9 32 51Z"
            fill="white"
          />

          <path
            d="M17 31H25L29 23L34 39L39 29L42 31H48"
            stroke="#E94224"
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
          className={className}
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
          className={className}
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
            fill="#F9B233"
          />

          <path
            d="M9 48H55V53H9V48Z"
            fill="white"
          />
        </svg>
      )

    case 'Kemanusiaan':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
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
          className={className}
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

/* =========================================================
   PILARS
========================================================= */

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

/* =========================================================
   HELPERS
========================================================= */

function getProgramCategory(
  program: Program
) {
  const title =
    program.title.toLowerCase()

  if (
    title.includes('kemanusiaan')
  ) {
    return 'Kemanusiaan'
  }

  if (
    title.includes('sosial') &&
    title.includes('dakwah')
  ) {
    return 'Sosial Dakwah'
  }

  return (
    program.pillar ||
    program.title
  )
}

function getCategoryColor(
  category?: string | null
) {
  const value =
    category?.toLowerCase() ?? ''

  if (
    value.includes('pendidikan')
  ) {
    return 'bg-orange-100 text-orange-700'
  }

  if (
    value.includes('kesehatan')
  ) {
    return 'bg-red-100 text-red-700'
  }

  if (
    value.includes('ekonomi')
  ) {
    return 'bg-red-100 text-red-800'
  }

  if (
    value.includes('sosial') ||
    value.includes('dakwah')
  ) {
    return 'bg-yellow-100 text-yellow-700'
  }

  if (
    value.includes('kemanusiaan')
  ) {
    return 'bg-lime-100 text-lime-700'
  }

  if (
    value.includes('lingkungan')
  ) {
    return 'bg-lime-200 text-lime-800'
  }

  return 'bg-gray-100 text-gray-700'
}

function formatRupiah(
  value:
    | number
    | string
    | null
    | undefined
) {
  const number =
    Number(value ?? 0)

  return new Intl.NumberFormat(
    'id-ID',
    {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }
  ).format(
    Number.isFinite(number)
      ? number
      : 0
  )
}

function calculateProgress(
  collected: number,
  target: number
) {
  if (target <= 0) {
    return 0
  }

  return Math.min(
    100,
    Math.round(
      (collected / target) * 100
    )
  )
}

function getImageUrl(
  image:
    | string
    | null
    | undefined
) {
  if (!image) {
    return null
  }

  if (
    image.startsWith('http://') ||
    image.startsWith('https://')
  ) {
    return image
  }

  if (
    image.startsWith('/storage/')
  ) {
    return image
  }

  if (
    image.startsWith('storage/')
  ) {
    return `/${image}`
  }

  return `/storage/${image.replace(
    /^\/+/,
    ''
  )}`
}

/* =========================================================
   PAGE
========================================================= */

export default function ProgramPage({
  onDonateProgram,
  onOpenPillar,
}: ProgramPageProps) {
  const [
    activeFilter,
    setActiveFilter,
  ] = useState('Semua')

  const [
    programs,
    setPrograms,
  ] = useState<Program[]>([])

  const [
    campaigns,
    setCampaigns,
  ] = useState<Campaign[]>([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')

  /* =======================================================
     OPEN PILAR
  ======================================================= */

  const handleOpenPillar = (
    category: string
  ) => {
    if (!onOpenPillar) {
      console.warn(
        '[ProgramPage] onOpenPillar belum diberikan dari App.tsx'
      )

      return
    }

    onOpenPillar(category)
  }

  /* =======================================================
     FETCH DATA
  ======================================================= */

  useEffect(() => {
    const fetchData =
      async () => {
        try {
          setLoading(true)
          setError('')

          const [
            programResponse,
            campaignResponse,
          ] = await Promise.all([
            api.get<ProgramResponse>(
              '/programs'
            ),

            api.get<CampaignResponse>(
              '/campaigns'
            ),
          ])

          if (
            !programResponse.success
          ) {
            throw new Error(
              programResponse.message ||
                'Gagal mengambil data program.'
            )
          }

          const programData =
            Array.isArray(
              programResponse.data
            )
              ? programResponse.data
              : []

          const sortedPrograms =
            [...programData].sort(
              (a, b) =>
                Number(
                  a.sort_order ?? 0
                ) -
                Number(
                  b.sort_order ?? 0
                )
            )

          setPrograms(
            sortedPrograms
          )

          if (
            !campaignResponse.success
          ) {
            throw new Error(
              campaignResponse.message ||
                'Gagal mengambil data Campaign.'
            )
          }

          let campaignData:
            Campaign[] = []

          if (
            Array.isArray(
              campaignResponse.data
            )
          ) {
            campaignData =
              campaignResponse.data
          } else if (
            campaignResponse.data &&
            Array.isArray(
              campaignResponse.data
                .data
            )
          ) {
            campaignData =
              campaignResponse.data
                .data
          }

          setCampaigns(
            campaignData.filter(
              (campaign) =>
                !campaign.status ||
                campaign.status ===
                  'published'
            )
          )
        } catch (
          fetchError
        ) {
          console.error(
            'PROGRAM PAGE ERROR:',
            fetchError
          )

          setError(
            fetchError instanceof
              Error
              ? fetchError.message
              : 'Terjadi kesalahan saat mengambil data.'
          )
        } finally {
          setLoading(false)
        }
      }

    fetchData()
  }, [])

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredPrograms =
    useMemo(() => {
      if (
        activeFilter ===
        'Semua'
      ) {
        return programs
      }

      return programs.filter(
        (program) =>
          getProgramCategory(
            program
          ) === activeFilter
      )
    }, [
      programs,
      activeFilter,
    ])

  const filteredCampaigns =
    useMemo(() => {
      if (
        activeFilter ===
        'Semua'
      ) {
        return campaigns
      }

      return campaigns.filter(
        (campaign) =>
          campaign.category ===
          activeFilter
      )
    }, [
      campaigns,
      activeFilter,
    ])

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8F2]">
        <div className="text-center">

          <div
            className="
              mx-auto
              mb-4
              h-10
              w-10
              animate-spin
              rounded-full
              border-4
              border-[#F58220]
              border-t-transparent
            "
          />

          <p className="text-sm text-gray-500">
            Mengambil data program
            dan campaign...
          </p>

        </div>
      </div>
    )
  }

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#FFF8F2]
      "
    >

      {/* =====================================================
          BACKGROUND PAGE
      ===================================================== */}

      {/* Glow kiri atas */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-48
          top-[180px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#F58220]/10
          blur-3xl
        "
      />

      {/* Glow kanan */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-56
          top-[650px]
          h-[600px]
          w-[600px]
          rounded-full
          bg-[#F58220]/10
          blur-3xl
        "
      />

      {/* Glow bawah */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-40
          bottom-[-180px]
          h-[450px]
          w-[450px]
          rounded-full
          bg-[#FFD8B5]/30
          blur-3xl
        "
      />

      {/* Lingkaran kanan */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-[-110px]
          top-[330px]
          h-[320px]
          w-[320px]
          rounded-full
          border
          border-[#F58220]/10
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-[-50px]
          top-[390px]
          h-[200px]
          w-[200px]
          rounded-full
          border
          border-[#F58220]/10
        "
      />

      {/* Titik kiri */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-6
          top-[520px]
          h-28
          w-28
          opacity-30
        "
        style={{
          backgroundImage:
            'radial-gradient(#F58220 1.5px, transparent 1.5px)',
          backgroundSize:
            '12px 12px',
        }}
      />

      {/* Titik kanan bawah */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[300px]
          right-8
          h-28
          w-28
          opacity-25
        "
        style={{
          backgroundImage:
            'radial-gradient(#F58220 1.5px, transparent 1.5px)',
          backgroundSize:
            '12px 12px',
        }}
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10">

        {/* ===================================================
            HEADER
        =================================================== */}

        <section
          className="
            relative
            overflow-hidden
            bg-gradient-to-br
            from-[#F58220]
            to-[#D96D0A]
            py-16
            pt-32
            text-white
          "
        >

          {/* Dekorasi header */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-20
              -top-24
              h-72
              w-72
              rounded-full
              border
              border-white/10
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-8
              -top-12
              h-48
              w-48
              rounded-full
              border
              border-white/10
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-0
              left-0
              h-32
              w-32
              rounded-full
              bg-white/5
              blur-2xl
            "
          />

          <div
            className="
              relative
              mx-auto
              max-w-7xl
              px-4
              sm:px-6
              lg:px-8
            "
          >

            <div className="mb-3 text-sm opacity-80">
              <span>
                Beranda
              </span>

              <span className="mx-2">
                /
              </span>

              <span>
                Program & Campaign
              </span>
            </div>

            <h1
              className="
                text-3xl
                font-bold
                sm:text-4xl
                lg:text-5xl
              "
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Program & Campaign
            </h1>

            <p
              className="
                mt-4
                max-w-2xl
                text-lg
                leading-relaxed
                opacity-90
              "
            >
              Mengenal pilar program
              Lazismu Pemalang dan
              berbagai bentuk kebaikan
              yang diwujudkan melalui
              program serta campaign
              nyata untuk masyarakat.
            </p>

          </div>

        </section>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div
            className="
              mx-auto
              max-w-7xl
              px-4
              pt-8
              sm:px-6
              lg:px-8
            "
          >
            <div
              className="
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-5
                text-sm
                text-red-600
              "
            >
              {error}
            </div>
          </div>
        )}

        {/* ===================================================
            6 PILAR
        =================================================== */}

        <section
          className="
            relative
            py-16
            sm:py-20
          "
        >

          <div
            className="
              relative
              mx-auto
              max-w-7xl
              px-4
              sm:px-6
              lg:px-8
            "
          >

            {/* HEADER PILAR */}

            <div
              className="
                mx-auto
                mb-12
                max-w-2xl
                text-center
              "
            >

              <div
                className="
                  mb-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#F58220]/15
                  bg-white/90
                  px-4
                  py-2
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-[#F58220]
                  shadow-sm
                "
              >

                <span
                  className="
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    bg-[#FFF0E4]
                  "
                >
                  ✦
                </span>

                Pilar Utama

              </div>

              <h2
                className="
                  text-3xl
                  font-bold
                  leading-tight
                  text-gray-900
                  sm:text-4xl
                "
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                6 Pilar Program
                Unggulan
              </h2>

              <div
                className="
                  mx-auto
                  mt-4
                  h-1
                  w-14
                  rounded-full
                  bg-gradient-to-r
                  from-[#F58220]
                  to-[#D96808]
                "
              />

              <p
                className="
                  mx-auto
                  mt-5
                  max-w-xl
                  text-sm
                  leading-7
                  text-gray-600
                  sm:text-base
                "
              >
                Setiap pilar mewakili
                komitmen Lazismu
                Pemalang dalam
                memberdayakan masyarakat
                secara menyeluruh dan
                berkelanjutan.
              </p>

            </div>

            {/* GRID PILAR */}

            <div
              className="
                grid
                grid-cols-1
                gap-6
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >

              {pillars.map(
                (
                  pillar
                ) => (
                  <button
                    key={
                      pillar.name
                    }
                    type="button"
                    onClick={() =>
                      handleOpenPillar(
                        pillar.name
                      )
                    }
                    className="
                      group
                      relative
                      flex
                      h-full
                      min-h-[350px]
                      flex-col
                      w-full
                      overflow-hidden
                      rounded-3xl
                      border
                      border-[#F1D9C1]
                      bg-white
                      p-6
                      text-left
                      shadow-[0_10px_35px_rgba(70,45,24,0.055)]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#E8C4A2]
                      hover:shadow-[0_18px_42px_rgba(70,45,24,0.1)]
                      sm:p-7
                    "
                  >

                    <div
                      aria-hidden="true"
                      className="
                        absolute
                        inset-x-7
                        top-0
                        h-[3px]
                        rounded-full
                        opacity-80
                      "
                      style={{
                        backgroundColor:
                          pillar.color,
                      }}
                    />

                    {/* Header card */}

                    <div
                      className="
                        relative
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <div
                        className="
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-[18px]
                          shadow-[0_6px_14px_rgba(70,45,24,0.12)]
                          transition-transform
                          duration-300
                          group-hover:scale-[1.03]
                        "
                        style={{
                          backgroundColor:
                            pillar.color,
                        }}
                      >
                        <PillarIcon
                          name={
                            pillar.name
                          }
                          className="h-10 w-10"
                        />
                      </div>

                    </div>

                    {/* Title */}

                    <h3
                      className="
                        relative
                        mt-7
                        text-xl
                        font-semibold
                        tracking-[-0.02em]
                        text-[#1E293B]
                        transition-colors
                        duration-200
                        group-hover:text-[#C96513]
                      "
                      style={{
                        fontFamily:
                          "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {pillar.name}
                    </h3>

                    {/* Description */}

                    <p
                      className="
                        relative
                        mt-3
                        flex-1
                        text-sm
                        leading-7
                        text-[#64748B]
                      "
                    >
                      {pillar.desc}
                    </p>

                    {/* Action */}

                    <div
                      className="
                        relative
                        mt-6
                        flex
                        items-center
                        justify-between
                        border-t
                        border-[#F1E6DC]
                        pt-5
                        text-sm
                        font-semibold
                        text-[#C96513]
                      "
                    >
                      <span>
                        Jelajahi pilar
                      </span>

                      <svg
                        className="
                          h-4
                          w-4
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
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

        {/* ===================================================
            CAMPAIGN
        =================================================== */}

        <section
          className="
            relative
            mx-auto
            max-w-7xl
            px-4
            pb-20
            sm:px-6
            lg:px-8
          "
        >

          {/* Campaign header */}

          <div
            className="
              relative
              mb-10
              text-center
            "
          >

            <div
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#F58220]
                px-4
                py-1.5
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-white
                shadow-sm
              "
            >
              Campaign
            </div>

            <h2
              className="
                text-3xl
                font-bold
                text-gray-900
              "
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Campaign Amal
            </h2>

            <div
              className="
                mx-auto
                mt-4
                h-1
                w-12
                rounded-full
                bg-[#F58220]
              "
            />

            <p
              className="
                mx-auto
                mt-4
                max-w-xl
                text-sm
                leading-relaxed
                text-gray-500
              "
            >
              Dukung campaign aktif
              Lazismu Pemalang dan
              bersama-sama wujudkan
              manfaat bagi masyarakat.
            </p>

          </div>

          {/* Campaign cards */}

          {filteredCampaigns.length ===
          0 ? (
            <div
              className="
                rounded-2xl
                border
                border-[#F3DEC8]
                bg-white
                p-10
                text-center
                shadow-sm
              "
            >

              <div className="mb-3 text-4xl">
                🤲
              </div>

              <p className="text-sm text-gray-500">
                Belum ada campaign aktif
                untuk kategori ini.
              </p>

            </div>
          ) : (
            <div
              className="
                grid
                grid-cols-1
                gap-6
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >

              {filteredCampaigns.map(
                (campaign) => {
                  const collected =
                    Number(
                      campaign.collected_amount ??
                        0
                    )

                  const target =
                    Number(
                      campaign.target_amount ??
                        0
                    )

                  const progress =
                    calculateProgress(
                      collected,
                      target
                    )

                  const category =
                    campaign.category ||
                    'Campaign'

                  const image =
                    campaign.image ||
                    campaign.thumbnail ||
                    null

                  const imageUrl =
                    getImageUrl(
                      image
                    )

                  return (
                    <div
                      key={
                        campaign.id
                      }
                      className="
                        group
                        flex
                        flex-col
                        overflow-hidden
                        rounded-2xl
                        border
                        border-[#F3DEC8]
                        bg-white
                        shadow-[0_8px_25px_rgba(120,70,30,0.05)]
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-[0_16px_35px_rgba(120,70,30,0.12)]
                      "
                    >

                      {/* Image */}

                      <div
                        className="
                          relative
                          h-48
                          overflow-hidden
                          bg-[#FEF0E4]
                        "
                      >

                        {imageUrl ? (
                          <img
                            src={
                              imageUrl
                            }
                            alt={
                              campaign.title
                            }
                            className="
                              h-full
                              w-full
                              object-cover
                              transition-transform
                              duration-500
                              group-hover:scale-105
                            "
                          />
                        ) : (
                          <div
                            className="
                              flex
                              h-full
                              w-full
                              items-center
                              justify-center
                              bg-gradient-to-br
                              from-[#FEF0E4]
                              to-[#FFF8F2]
                            "
                          >

                            <div className="flex flex-col items-center">

                              <div
                                className="
                                  flex
                                  h-20
                                  w-20
                                  items-center
                                  justify-center
                                  rounded-2xl
                                  bg-[#F58220]
                                  shadow-md
                                "
                              >
                                <PillarIcon
                                  name={
                                    category
                                  }
                                  className="h-12 w-12"
                                />
                              </div>

                              <div
                                className="
                                  mt-3
                                  text-xs
                                  font-semibold
                                  text-[#F58220]
                                "
                              >
                                Lazismu Pemalang
                              </div>

                            </div>

                          </div>
                        )}

                        {/* Category */}

                        <span
                          className={`
                            absolute
                            left-3
                            top-3
                            flex
                            items-center
                            gap-2
                            rounded-full
                            px-2.5
                            py-1.5
                            text-xs
                            font-semibold
                            shadow-sm
                            ${getCategoryColor(
                              category
                            )}
                          `}
                        >

                          <span
                            className="
                              flex
                              h-5
                              w-5
                              items-center
                              justify-center
                              rounded-full
                              bg-white/70
                            "
                          >
                            <PillarIcon
                              name={
                                category
                              }
                              className="h-3.5 w-3.5"
                            />
                          </span>

                          {category}

                        </span>

                      </div>

                      {/* Content */}

                      <div
                        className="
                          flex
                          flex-1
                          flex-col
                          p-5
                        "
                      >

                        <h3
                          className="
                            mb-2
                            text-sm
                            font-bold
                            text-gray-900
                          "
                          style={{
                            fontFamily:
                              "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {campaign.title}
                        </h3>

                        <div
  className="
    campaign-description
    mb-5
    line-clamp-3
    flex-1
    text-xs
    leading-relaxed
    text-gray-500
    [&_strong]:font-bold
    [&_b]:font-bold
    [&_em]:italic
    [&_i]:italic
    [&_u]:underline
    [&_p]:m-0
    [&_ul]:ml-4
    [&_ul]:list-disc
    [&_ol]:ml-4
    [&_ol]:list-decimal
    [&_li]:ml-1
  "
  dangerouslySetInnerHTML={{
    __html:
      campaign.short_description ||
      campaign.description ||
      '<p>Campaign Amal Lazismu Pemalang.</p>',
  }}
/>

                        {/* Progress */}

                        <div className="mb-4 space-y-2">

                          <div
                            className="
                              flex
                              justify-between
                              text-xs
                              text-gray-500
                            "
                          >

                            <span>
                              Terkumpul
                            </span>

                            <span
                              className="
                                font-semibold
                                text-[#F58220]
                              "
                            >
                              {progress}%
                            </span>

                          </div>

                          <div
                            className="
                              h-2
                              w-full
                              overflow-hidden
                              rounded-full
                              bg-gray-100
                            "
                          >
                            <div
                              className="
                                h-2
                                rounded-full
                                bg-[#F58220]
                                transition-all
                              "
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>

                          <div
                            className="
                              flex
                              justify-between
                              gap-2
                              text-xs
                            "
                          >

                            <span className="text-gray-500">
                              {formatRupiah(
                                collected
                              )}
                            </span>

                            {target >
                              0 && (
                              <span className="text-right text-gray-400">
                                dari{' '}
                                {formatRupiah(
                                  target
                                )}
                              </span>
                            )}

                          </div>

                        </div>

                        {/* Donor */}

                        {campaign.donor_count !==
                          undefined &&
                          campaign.donor_count !==
                            null && (
                            <div
                              className="
                                mb-4
                                text-xs
                                text-gray-400
                              "
                            >
                              {
                                campaign.donor_count
                              }{' '}
                              donatur
                            </div>
                          )}

                        {/* Button */}

                        <button
                          type="button"
                          className="
                            btn-primary
                            mt-auto
                            w-full
                            rounded-xl
                            py-2.5
                            text-sm
                            font-semibold
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                          "
                          onClick={() =>
                            onDonateProgram?.(
                              campaign.title
                            )
                          }
                        >
                          Donasi Sekarang
                        </button>

                      </div>

                    </div>
                  )
                }
              )}

            </div>
          )}

        </section>

        {/* ===================================================
            INFO BAWAH
        =================================================== */}

        <section
          className="
            relative
            mx-auto
            max-w-7xl
            px-4
            pb-20
            sm:px-6
            lg:px-8
          "
        >

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-[#F3DEC8]
              bg-white
              p-7
              shadow-[0_8px_30px_rgba(120,70,30,0.05)]
              sm:p-9
            "
          >

            {/* Dekorasi info */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -right-16
                -top-16
                h-40
                w-40
                rounded-full
                bg-[#F58220]/5
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                bottom-0
                right-20
                h-20
                w-20
                opacity-20
              "
              style={{
                backgroundImage:
                  'radial-gradient(#F58220 1.3px, transparent 1.3px)',
                backgroundSize:
                  '10px 10px',
              }}
            />

            <div className="relative">

              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-[#F58220]
                "
              >
                Dari Program Menjadi
                Dampak
              </span>

              <h3
                className="
                  mt-2
                  text-xl
                  font-bold
                  text-gray-900
                  sm:text-2xl
                "
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Setiap pilar diwujudkan
                melalui program dan
                campaign nyata.
              </h3>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-relaxed
                  text-gray-500
                "
              >
                Pilih salah satu pilar
                untuk melihat detail
                program. Kamu juga dapat
                memilih campaign untuk
                langsung menunaikan
                donasi.
              </p>

            </div>

          </div>

        </section>

      </div>
    </div>
  )
}
