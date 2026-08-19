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

const pillars = [
  {
    name: 'Pendidikan',
    color: '#F58220',
    desc: 'Pendidikan adalah kunci utama untuk membuka pintu masa depan yang cerah. LAZISMU terus berupaya memberikan akses pendidikan berkualitas bagi seluruh lapisan masyarakat, terutama mereka yang kurang beruntung.',
  },
  {
    name: 'Kesehatan',
    color: '#E94224',
    desc: 'Kesehatan menjadi aset yang tak ternilai. LAZISMU hadir dengan komitmen untuk membantu masyarakat memperoleh akses layanan kesehatan yang layak dan mewujudkan masyarakat yang sehat dan sejahtera.',
  },
  {
    name: 'Ekonomi',
    color: '#D21F26',
    desc: 'Melalui Pilar Ekonomi, LAZISMU berkomitmen memberdayakan masyarakat, khususnya mereka yang berada di garis kemiskinan, agar mampu meningkatkan taraf hidup dan kemandirian ekonomi.',
  },
  {
    name: 'Sosial Dakwah',
    color: '#F9B233',
    desc: 'Pilar Sosial Dakwah berfokus pada penguatan kehidupan sosial dan dakwah dengan menebarkan kebaikan, kepedulian, serta membangun masyarakat yang lebih baik.',
  },
  {
    name: 'Kemanusiaan',
    color: '#94C11F',
    desc: 'LAZISMU senantiasa hadir di tengah masyarakat untuk memberikan bantuan dan dukungan. Pilar Kemanusiaan menjadi wujud nyata komitmen untuk meringankan beban sesama.',
  },
  {
    name: 'Lingkungan',
    color: '#C8D52D',
    desc: 'Pilar Lingkungan berfokus pada kepedulian terhadap kelestarian alam serta kontribusi positif bagi lingkungan dan generasi yang akan datang.',
  },
]
const filters = [
  'Semua',
  'Pendidikan',
  'Kesehatan',
  'Ekonomi',
  'Sosial Dakwah',
  'Kemanusiaan',
  'Lingkungan',
]

function getProgramCategory(program: Program) {
  const title = program.title.toLowerCase()

  if (title.includes('kemanusiaan')) {
    return 'Kemanusiaan'
  }

  if (
    title.includes('sosial') &&
    title.includes('dakwah')
  ) {
    return 'Sosial Dakwah'
  }

  return program.pillar || program.title
}

function getCategoryColor(
  category?: string | null
) {
  const value =
    category?.toLowerCase() ?? ''

  if (value.includes('pendidikan')) {
    return 'bg-orange-100 text-orange-700'
  }

  if (value.includes('kesehatan')) {
    return 'bg-red-100 text-red-700'
  }

  if (value.includes('ekonomi')) {
    return 'bg-red-100 text-red-800'
  }

  if (
    value.includes('sosial') ||
    value.includes('dakwah')
  ) {
    return 'bg-yellow-100 text-yellow-700'
  }

  if (value.includes('kemanusiaan')) {
    return 'bg-lime-100 text-lime-700'
  }

  if (value.includes('lingkungan')) {
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
  const number = Number(value ?? 0)

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(
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

  if (image.startsWith('/storage/')) {
    return image
  }

  if (image.startsWith('storage/')) {
    return `/${image}`
  }

  return `/storage/${image.replace(
    /^\/+/,
    ''
  )}`
}

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

  useEffect(() => {
    const fetchData = async () => {
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

        if (!programResponse.success) {
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

        setPrograms(sortedPrograms)

        if (!campaignResponse.success) {
          throw new Error(
            campaignResponse.message ||
              'Gagal mengambil data kampanye.'
          )
        }

        let campaignData: Campaign[] = []

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
            campaignResponse.data.data
          )
        ) {
          campaignData =
            campaignResponse.data.data
        }

        setCampaigns(
          campaignData.filter(
            (campaign) =>
              !campaign.status ||
              campaign.status === 'published'
          )
        )
      } catch (fetchError) {
        console.error(
          'PROGRAM PAGE ERROR:',
          fetchError
        )

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Terjadi kesalahan saat mengambil data.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredPrograms = useMemo(() => {
    if (activeFilter === 'Semua') {
      return programs
    }

    return programs.filter(
      (program) =>
        getProgramCategory(program) ===
        activeFilter
    )
  }, [programs, activeFilter])

  const filteredCampaigns = useMemo(() => {
    if (activeFilter === 'Semua') {
      return campaigns
    }

    return campaigns.filter(
      (campaign) =>
        campaign.category === activeFilter
    )
  }, [campaigns, activeFilter])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] pt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#F58220] border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-gray-500">
            Mengambil data program
            dan kampanye...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2]">

      {/* HEADER */}

      <section className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] py-16 pt-32 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-3 text-sm opacity-80">
            <span>Beranda</span>

            <span className="mx-2">
              /
            </span>

            <span>
              Program & Kampanye
            </span>
          </div>

          <h1
            className="text-3xl font-bold sm:text-4xl lg:text-5xl"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Program & Kampanye
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed opacity-90">
            Mengenal pilar program LAZISMU
            Pemalang dan berbagai bentuk
            kebaikan yang diwujudkan melalui
            program serta kampanye nyata
            untuk masyarakat.
          </p>

        </div>
      </section>

      {/* ERROR */}

      {error && (
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            {error}
          </div>
        </div>
      )}

      {/* 6 PILAR */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

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
            Setiap pilar mewakili komitmen
            LAZISMU Pemalang dalam
            memberdayakan masyarakat secara
            menyeluruh dan berkelanjutan.
          </p>

        </div>

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

              <div className="flex items-start justify-between">

<div
  className="flex h-14 w-14 items-center justify-center rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105"
  style={{
    backgroundColor: pillar.color,
  }}
>
  <PillarIcon
    name={pillar.name}
    className="h-9 w-9"
  />
</div>

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

              <h3
                className="mt-5 text-base font-bold text-gray-900"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {pillar.name}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {pillar.desc}
              </p>

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

      {/* FILTER */}

      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">

        <div className="flex flex-wrap gap-3">

          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() =>
                setActiveFilter(filter)
              }
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-[#F58220] text-white shadow-md'
                  : 'border border-[#F3DEC8] bg-white text-gray-600 hover:border-[#F58220] hover:text-[#F58220]'
              }`}
            >
              {filter}
            </button>
          ))}

        </div>

      </section>
      {/* CAMPAIGN */}

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">

        <div className="mb-10 text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F58220] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            Kampanye
          </div>

          <h2
            className="text-3xl font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Kampanye Kebaikan
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500">
            Dukung kampanye aktif LAZISMU
            Pemalang dan bersama-sama
            wujudkan manfaat bagi masyarakat.
          </p>

        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="rounded-2xl border border-[#F3DEC8] bg-white p-8 text-center">

            <div className="mb-3 text-4xl">
              🤲
            </div>

            <p className="text-sm text-gray-500">
              Belum ada kampanye aktif
              untuk kategori ini.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

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
                  'Kampanye'

                const image =
                  campaign.image ||
                  campaign.thumbnail ||
                  null

                const imageUrl =
                  getImageUrl(image)

                return (
                  <div
                    key={campaign.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm transition-all hover:shadow-md"
                  >

                    <div className="relative h-48 overflow-hidden bg-[#FEF0E4]">

                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={
                            campaign.title
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                       <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FEF0E4] to-[#FFF8F2]">

  <div className="flex flex-col items-center">

    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F58220]">
      <PillarIcon
        name={category}
        className="h-12 w-12"
      />
    </div>

    <div className="mt-3 text-xs font-semibold text-[#F58220]">
      LAZISMU Pemalang
    </div>

  </div>

</div>
                      )}

                      <span
  className={`absolute left-3 top-3 flex items-center gap-2 rounded-full px-2.5 py-1.5 text-xs font-semibold ${getCategoryColor(
    category
  )}`}
>
  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/70">
    <PillarIcon
      name={category}
      className="h-3.5 w-3.5"
    />
  </span>

  {category}
</span>

                    </div>

                    <div className="flex flex-1 flex-col p-4">

                      <h3
                        className="mb-2 text-sm font-bold text-gray-900"
                        style={{
                          fontFamily:
                            "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {campaign.title}
                      </h3>

                      <p className="mb-4 line-clamp-3 flex-1 text-xs leading-relaxed text-gray-500">
                        {campaign.description ||
                          'Kampanye kebaikan LAZISMU Pemalang.'}
                      </p>

                      <div className="mb-4 space-y-2">

                        <div className="flex justify-between text-xs text-gray-500">

                          <span>
                            Terkumpul
                          </span>

                          <span className="font-semibold text-[#F58220]">
                            {progress}%
                          </span>

                        </div>

                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">

                          <div
                            className="h-2 rounded-full bg-[#F58220] transition-all"
                            style={{
                              width: `${progress}%`,
                            }}
                          />

                        </div>

                        <div className="flex justify-between gap-2 text-xs">

                          <span className="text-gray-500">
                            {formatRupiah(
                              collected
                            )}
                          </span>

                          {target > 0 && (
                            <span className="text-right text-gray-400">
                              dari{' '}
                              {formatRupiah(
                                target
                              )}
                            </span>
                          )}

                        </div>

                      </div>

                      {campaign.donor_count !==
                        undefined &&
                        campaign.donor_count !==
                          null && (
                          <div className="mb-4 text-xs text-gray-400">
                            {
                              campaign.donor_count
                            }{' '}
                            donatur
                          </div>
                        )}

                      <button
                        type="button"
                        className="btn-primary mt-auto w-full rounded-xl py-2.5 text-sm font-semibold"
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

      {/* INFO */}

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-6 sm:p-8">

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
            Pilih salah satu pilar untuk
            melihat detail program. Kamu
            juga dapat memilih kampanye
            untuk langsung menunaikan donasi.
          </p>

        </div>

      </section>

    </div>
  )
}