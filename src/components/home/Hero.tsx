import { useEffect, useState } from 'react'
import logo from '../../imports/4.png'
import API_URL from '../../lib/api'

type NavPage = 'home' | 'zakat' | 'donasi'

interface HeroProps {
  onNavigate: (page: NavPage) => void
}

type BannerMediaType = 'image' | 'video'

interface Banner {
  id: number
  title: string
  subtitle: string | null
  media_type: BannerMediaType
  image: string | null
  video: string | null
  button_text: string | null
  button_url: string | null
  sort_order: number
}

interface Campaign {
  id: number
  title: string
  slug: string
  category: string
  short_description: string | null
  description: string | null
  thumbnail: string | null
  target_amount: string
  collected_amount: string
  featured: boolean
  status: string
  start_date: string | null
  end_date: string | null
}

interface BannerResponse {
  success: boolean
  message: string
  data: Banner[]
}

interface CampaignResponse {
  success: boolean
  message: string
  data: Campaign[]
}

function getMediaUrl(path: string | null): string | null {
  if (!path) {
    return null
  }

  if (
    path.startsWith('http://') ||
    path.startsWith('https://')
  ) {
    return path
  }

  const backendUrl =
    API_URL.replace(/\/api\/?$/, '')

  const cleanPath = path
    .replace(/^\/+/, '')
    .replace(/^storage\//, '')

  return `${backendUrl}/storage/${cleanPath}`
}

function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function Hero({
  onNavigate,
}: HeroProps) {
  const [mounted, setMounted] =
    useState(false)

  const [banner, setBanner] =
    useState<Banner | null>(null)

  const [campaign, setCampaign] =
    useState<Campaign | null>(null)

  useEffect(() => {
    const timer = setTimeout(
      () => setMounted(true),
      100
    )

    return () =>
      clearTimeout(timer)
  }, [])

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        const [
          bannerResponse,
          campaignResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/banners`, {
            headers: {
              Accept: 'application/json',
            },
          }),

          fetch(`${API_URL}/campaigns`, {
            headers: {
              Accept: 'application/json',
            },
          }),
        ])

        const bannerResult: BannerResponse =
          await bannerResponse.json()

        const campaignResult: CampaignResponse =
          await campaignResponse.json()

        if (!active) {
          return
        }

        if (
          bannerResponse.ok &&
          bannerResult.success &&
          bannerResult.data.length > 0
        ) {
          const sorted = [
            ...bannerResult.data,
          ].sort(
            (a, b) =>
              a.sort_order -
              b.sort_order
          )

          setBanner(sorted[0])
        }

        if (
          campaignResponse.ok &&
          campaignResult.success
        ) {
          const published =
            campaignResult.data.filter(
              (item) =>
                item.status ===
                'published'
            )

          const featured =
            published.find(
              (item) => item.featured
            ) ?? published[0]

          setCampaign(featured ?? null)
        }
      } catch (error) {
        console.error(
          'Gagal mengambil data Hero:',
          error
        )
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [])

  const heroImage =
    getMediaUrl(banner?.image ?? null)

  const heroVideo =
    getMediaUrl(banner?.video ?? null)

  const campaignImage =
    getMediaUrl(
      campaign?.thumbnail ?? null
    )

  const collected = campaign
    ? Number(
        campaign.collected_amount || 0
      )
    : 0

  const target = campaign
    ? Number(
        campaign.target_amount || 0
      )
    : 0

  const percentage =
    target > 0
      ? Math.min(
          Math.round(
            (collected / target) * 100
          ),
          100
        )
      : 0

  function handleBannerButton() {
    const url =
      banner?.button_url?.trim()

    if (!url) {
      onNavigate('donasi')
      return
    }

    if (
      url === '/donasi' ||
      url === 'donasi'
    ) {
      onNavigate('donasi')
      return
    }

    if (
      url === '/zakat' ||
      url === 'zakat'
    ) {
      onNavigate('zakat')
      return
    }

    if (
      url.startsWith('http://') ||
      url.startsWith('https://')
    ) {
      window.open(
        url,
        '_blank',
        'noopener,noreferrer'
      )
      return
    }

    window.location.href = url
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        {banner?.media_type === 'video' && heroVideo ? (
          <video
            key={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          >
            <source src={heroVideo} />
          </video>
        ) : heroImage ? (
          <img
            src={heroImage}
            alt={
              banner?.title ||
              'LAZISMU Pemalang'
            }
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-[#8A470E]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#F58220]/20 via-transparent to-transparent" />
      </div>

      {/* ORNAMEN */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-10 pointer-events-none">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          className="w-full h-full"
        >
          <polygon
            points="100,10 190,55 190,145 100,190 10,145 10,55"
            stroke="#F58220"
            strokeWidth="1"
          />

          <polygon
            points="100,30 170,67 170,133 100,170 30,133 30,67"
            stroke="#F58220"
            strokeWidth="0.8"
          />

          <polygon
            points="100,50 150,79 150,121 100,150 50,121 50,79"
            stroke="#F58220"
            strokeWidth="0.6"
          />

          <circle
            cx="100"
            cy="100"
            r="40"
            stroke="#F58220"
            strokeWidth="0.8"
          />
        </svg>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div>
            <div
              className={`inline-flex items-center gap-3 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-6 transition-all duration-700 ${
                mounted
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              <img
                src={logo}
                alt="LAZISMU Kabupaten Pemalang"
                className="h-7 w-auto object-contain"
              />

              <span className="w-1.5 h-1.5 rounded-full bg-[#F58220] animate-pulse" />

              <span className="text-white/90 text-xs font-semibold">
                Amanah & Transparan
              </span>
            </div>

            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 transition-all duration-700 delay-100 ${
                mounted
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              }`}
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {banner?.title ||
                'LAZISMU Pemalang'}
            </h1>

            <p
              className={`text-white/80 text-lg leading-relaxed mb-8 max-w-lg transition-all duration-700 delay-200 ${
                mounted
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              }`}
            >
              {banner?.subtitle ||
                'Salurkan kebaikan melalui LAZISMU Pemalang.'}
            </p>

            <div
              className={`flex flex-wrap gap-4 mb-12 transition-all duration-700 delay-300 ${
                mounted
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              }`}
            >
              <button
                onClick={
                  handleBannerButton
                }
                className="btn-primary px-7 py-3.5 text-base font-semibold inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>

                {banner?.button_text ||
                  'Donasi Sekarang'}
              </button>

              <a
                href="#programs"
                className="px-7 py-3.5 text-base font-semibold text-white border-2 border-white/40 rounded-xl hover:bg-white/10 transition-all duration-200 inline-flex items-center gap-2"
              >
                Pelajari Program

                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* FEATURED CAMPAIGN */}
          {campaign && (
            <div
              className={`transition-all duration-700 delay-300 ${
                mounted
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-8'
              }`}
            >
              <div className="animate-float">
                <div className="glass-card rounded-2xl overflow-hidden max-w-sm mx-auto lg:ml-auto shadow-2xl">

                  {campaignImage && (
                    <div className="h-36">
                      <img
                        src={campaignImage}
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-[#F58220] flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <div
                          className="text-sm font-bold text-gray-800"
                          style={{
                            fontFamily:
                              "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {campaign.title}
                        </div>

                        <div className="text-xs text-gray-500 mt-1">
                          {campaign.featured
                            ? 'Campaign Unggulan'
                            : campaign.category}
                        </div>
                      </div>
                    </div>

                    {campaign.short_description && (
                      <p className="text-xs text-gray-500 leading-relaxed mb-4">
                        {
                          campaign.short_description
                        }
                      </p>
                    )}

                    <div className="mb-5">
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>
                          Terkumpul
                        </span>

                        <span className="font-semibold text-[#F58220]">
                          {percentage}%
                        </span>
                      </div>

                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#F58220] to-[#D96D0A] rounded-full transition-all duration-1000"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between items-end gap-3 mt-2">
                        <span
                          className="text-sm font-bold text-gray-800"
                          style={{
                            fontFamily:
                              "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {formatRupiah(
                            collected
                          )}
                        </span>

                        <span className="text-xs text-gray-400 text-right">
                          dari{' '}
                          {formatRupiah(
                            target
                          )}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        onNavigate(
                          'donasi'
                        )
                      }
                      className="btn-primary block w-full text-center py-3 text-sm font-semibold"
                    >
                      Donasi Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SCROLL */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-xs">
        <span>Scroll</span>

        <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-white/60 animate-bounce" />
        </div>
      </div>
    </section>
  )
}