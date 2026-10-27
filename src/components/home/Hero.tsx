'use client'

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
  target_amount: string | number
  collected_amount: string | number
  featured: boolean | number
  urgent: boolean | number
  status: 'draft' | 'published' | 'closed'
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

/* ============================================================
   MEDIA URL
============================================================ */

function getMediaUrl(path: string | null): string | null {
  if (!path) return null

  if (
    path.startsWith('http://') ||
    path.startsWith('https://')
  ) {
    return path
  }

  const backendUrl = API_URL.replace(/\/api\/?$/, '')

  const cleanPath = path
    .replace(/^\/+/, '')
    .replace(/^storage\//, '')

  return `${backendUrl}/storage/${cleanPath}`
}

/* ============================================================
   FORMAT RUPIAH
============================================================ */

function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

/* ============================================================
   STRIP HTML
============================================================ */

function stripHtml(
  html: string | null | undefined
): string {
  if (!html) return ''

  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

/* ============================================================
   HERO
============================================================ */

export default function Hero({
  onNavigate,
}: HeroProps) {
  const [mounted, setMounted] = useState(false)

  const [banner, setBanner] =
    useState<Banner | null>(null)

  const [urgentCampaigns, setUrgentCampaigns] =
    useState<Campaign[]>([])

  const [isLoading, setIsLoading] =
    useState(true)

  const [urgentIndex, setUrgentIndex] =
    useState(0)

  /* ============================================================
     MOUNT
  ============================================================ */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true)
    }, 100)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  /* ============================================================
     LOAD BANNER + CAMPAIGN
  ============================================================ */

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        setIsLoading(true)

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

        if (!active) return

        /* ========================================================
           BANNER
        ======================================================== */

        if (
          bannerResponse.ok &&
          bannerResult.success &&
          Array.isArray(bannerResult.data) &&
          bannerResult.data.length > 0
        ) {
          const sortedBanners = [
            ...bannerResult.data,
          ].sort(
            (a, b) =>
              a.sort_order - b.sort_order
          )

          setBanner(sortedBanners[0])
        } else {
          setBanner(null)
        }

        /* ========================================================
           CAMPAIGN URGENT
        ======================================================== */

        if (
          campaignResponse.ok &&
          campaignResult.success &&
          Array.isArray(campaignResult.data)
        ) {
          const urgent =
            campaignResult.data.filter(
              (campaign) =>
                campaign.status === 'published' &&
                Boolean(campaign.urgent)
            )

          setUrgentCampaigns(
            urgent.slice(0, 3)
          )

          setUrgentIndex(0)
        } else {
          setUrgentCampaigns([])
        }
      } catch (error) {
        console.error(
          'Gagal mengambil data Hero:',
          error
        )

        if (active) {
          setBanner(null)
          setUrgentCampaigns([])
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [])

  /* ============================================================
     AUTO SLIDER
  ============================================================ */

  useEffect(() => {
    if (urgentCampaigns.length <= 1) {
      return
    }

    const interval =
      window.setInterval(() => {
        setUrgentIndex(
          (current) =>
            (current + 1) %
            urgentCampaigns.length
        )
      }, 5000)

    return () => {
      window.clearInterval(interval)
    }
  }, [urgentCampaigns.length])

  /* ============================================================
     CURRENT CAMPAIGN
  ============================================================ */

  const currentUrgent =
    urgentCampaigns[urgentIndex] ?? null

  /* ============================================================
     MEDIA
  ============================================================ */

  const heroImage =
    getMediaUrl(
      banner?.image ?? null
    )

  const heroVideo =
    getMediaUrl(
      banner?.video ?? null
    )

  const campaignImage =
    getMediaUrl(
      currentUrgent?.thumbnail ?? null
    )

  /* ============================================================
     PROGRESS
  ============================================================ */

  const collected = currentUrgent
    ? Number(
        currentUrgent.collected_amount || 0
      )
    : 0

  const target = currentUrgent
    ? Number(
        currentUrgent.target_amount || 0
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

  /* ============================================================
     BANNER BUTTON
  ============================================================ */

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

  /* ============================================================
     SLIDER NAVIGATION
  ============================================================ */

  const goToPreviousUrgent = () => {
    if (urgentCampaigns.length <= 1) {
      return
    }

    setUrgentIndex(
      (current) =>
        current === 0
          ? urgentCampaigns.length - 1
          : current - 1
    )
  }

  const goToNextUrgent = () => {
    if (urgentCampaigns.length <= 1) {
      return
    }

    setUrgentIndex(
      (current) =>
        (current + 1) %
        urgentCampaigns.length
    )
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <section
      id="hero"
      className="
        editorial-hero
        relative
        flex
        min-h-[calc(100vh-3.5rem)]
        items-center
        overflow-hidden
        pt-14
        sm:min-h-[calc(100vh-4rem)]
        sm:pt-16
        lg:min-h-[calc(100vh-5rem)]
        lg:pt-20
      "
    >

      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0">

        {/* LOADING = HITAM POLOS */}
        {isLoading ? (
          <div className="h-full w-full bg-black" />
        ) : banner?.media_type === 'video' &&
          heroVideo ? (

          <video
            key={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          >
            <source src={heroVideo} />
          </video>

        ) : heroImage ? (

          <img
            src={heroImage}
            alt={
              stripHtml(
                banner?.title
              ) || 'LAZISMU Pemalang'
            }
            className="h-full w-full object-cover"
          />

        ) : (

          <div
            className="
              h-full
              w-full
              bg-gradient-to-br
              from-gray-900
              via-gray-800
              to-[#8A470E]
            "
          />
        )}

        {/* OVERLAY HANYA SETELAH LOADING */}
        {!isLoading && (
          <>
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-black/75
                via-black/55
                to-black/20
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/60
                via-transparent
                to-transparent
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-[#F58220]/20
                via-transparent
                to-transparent
              "
            />
          </>
        )}
      </div>

      {/* ======================================================
          DECORATION
      ====================================================== */}

      {!isLoading && (
        <div
          className="
            pointer-events-none
            absolute
            right-0
            top-0
            hidden
            h-[500px]
            w-[500px]
            opacity-10
            lg:block
          "
        >
          <svg
            viewBox="0 0 200 200"
            fill="none"
            className="h-full w-full"
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
      )}

      {/* ======================================================
          CONTENT
      ====================================================== */}

      {!isLoading && (
        <div
          className="
            relative
            z-10
            mx-auto
            w-full
            max-w-7xl
            px-4
            pb-20
            pt-4
            sm:px-6
            sm:pt-6
            lg:px-8
            lg:pt-8
          "
        >
          <div
            className="
              grid
              grid-cols-1
              items-center
              gap-12
              lg:grid-cols-2
            "
          >

            {/* ==================================================
                LEFT CONTENT
            ================================================== */}

            <div>

              {/* BADGE */}

              <div
                className={`
                  mb-6
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  border
                  border-white/20
                  bg-white/10
                  px-4
                  py-2
                  transition-all
                  duration-700
                  ${
                    mounted
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-4 opacity-0'
                  }
                `}
              >
                <img
                  src={logo}
                  alt="Lazismu Pemalang"
                  className="
                    h-7
                    w-auto
                    object-contain
                  "
                />

                <span
                  className="
                    h-1.5
                    w-1.5
                    animate-pulse
                    rounded-full
                    bg-[#F58220]
                  "
                />

                <span
                  className="
                    text-xs
                    font-semibold
                    text-white/90
                  "
                >
                  Amanah & Transparan
                </span>
              </div>

              {/* ==================================================
                  TITLE DARI ADMIN
              ================================================== */}

              {banner?.title && (
                <div
                  className={`
                    text-4xl
                    font-bold
                    leading-tight
                    text-white
                    transition-all
                    duration-700
                    delay-100
                    sm:text-5xl
                    lg:text-6xl
                    ${
                      mounted
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-6 opacity-0'
                    }

                    [&_p]:m-0
                    [&_strong]:font-extrabold
                    [&_em]:italic
                    [&_u]:underline
                    [&_ul]:list-disc
                    [&_ul]:pl-6
                    [&_ol]:list-decimal
                    [&_ol]:pl-6
                    [&_li]:mb-1
                  `}
                  style={{
                    fontFamily:
                      "'Plus Jakarta Sans', sans-serif",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: banner.title,
                  }}
                />
              )}

              {/* ==================================================
                  SUBTITLE DARI ADMIN
              ================================================== */}

              {banner?.subtitle && (
                <div
                  className={`
                    mb-8
                    max-w-lg
                    text-lg
                    leading-relaxed
                    text-white/80
                    transition-all
                    duration-700
                    delay-200
                    ${
                      mounted
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-6 opacity-0'
                    }

                    [&_p]:m-0
                    [&_p]:mb-2
                    [&_strong]:font-bold
                    [&_em]:italic
                    [&_u]:underline
                    [&_ul]:list-disc
                    [&_ul]:pl-6
                    [&_ol]:list-decimal
                    [&_ol]:pl-6
                    [&_li]:mb-1
                  `}
                  dangerouslySetInnerHTML={{
                    __html:
                      banner.subtitle,
                  }}
                />
              )}

              {/* ==================================================
                  BUTTONS
              ================================================== */}

              <div
                className={`
                  mb-12
                  flex
                  flex-wrap
                  gap-4
                  transition-all
                  duration-700
                  ${
                    mounted
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-6 opacity-0'
                  }
                `}
              >

                {/* DONASI */}

                <button
                  type="button"
                  onClick={
                    handleBannerButton
                  }
                  className="
                    btn-primary
                    inline-flex
                    items-center
                    gap-2
                    px-7
                    py-3.5
                    text-base
                    font-semibold
                  "
                >
                  <svg
                    className="h-5 w-5"
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

                {/* PROGRAM */}

                <a
                  href="#programs"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border-2
                    border-white/40
                    px-7
                    py-3.5
                    text-base
                    font-semibold
                    text-white
                    transition-all
                    duration-200
                    hover:bg-white/10
                  "
                >
                  Pelajari Program

                  <svg
                    className="h-5 w-5"
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

            {/* ==================================================
                RIGHT - URGENT CAMPAIGN
            ================================================== */}

            <div>

              {currentUrgent && (
                <div
                  className={`
                    transition-all
                    duration-700
                    ${
                      mounted
                        ? 'translate-x-0 opacity-100'
                        : 'translate-x-8 opacity-0'
                    }
                  `}
                >

                  <div
                    className="
                      relative
                      mx-auto
                      w-full
                      max-w-sm
                    "
                  >

                    {/* CARD */}

                    <div
                      className="
                        hero-impact-card
                        relative
                        h-[640px]
                        w-full
                        overflow-hidden
                        rounded-2xl
                        bg-white/95
                        shadow-2xl
                        backdrop-blur-sm
                        sm:h-[565px]
                      "
                    >

                      {/* IMAGE */}

                      <div
                        className="
                          flex
                          h-[225px]
                          w-full
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          bg-white
                          sm:h-[235px]
                        "
                      >
                        {campaignImage ? (
                          <img
                            key={
                              currentUrgent.id
                            }
                            src={campaignImage}
                            alt={
                              currentUrgent.title
                            }
                            className="
                              h-full
                              w-full
                              object-contain
                              transition-opacity
                              duration-300
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
                              bg-[#FFF0DE]
                            "
                          >
                            <span
                              className="
                                text-sm
                                font-semibold
                                text-[#F58220]
                              "
                            >
                              Lazismu
                            </span>
                          </div>
                        )}
                      </div>

                      {/* CARD CONTENT */}

                      <div
                        className="
                          flex
                          h-[330px]
                          flex-col
                          p-5
                        "
                      >

                        {/* HEADER */}

                        <div
                          className="
                            mb-4
                            flex
                            min-h-[58px]
                            shrink-0
                            items-start
                            gap-3
                          "
                        >
                          <div
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-red-500
                            "
                          >
                            <svg
                              className="h-5 w-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01M10.29 3.86l-7.82 14A2 2 0 004.21 21h15.58a2 2 0 001.74-3.14l-7.82-14a2 2 0 00-3.42 0z"
                              />
                            </svg>
                          </div>

                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >
                            <div
                              className="
                                mb-1
                                text-[11px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-red-500
                              "
                            >
                              Campaign Urgent
                            </div>

                            <div
                              className="
                                line-clamp-2
                                min-h-[40px]
                                text-sm
                                font-bold
                                leading-5
                                text-gray-800
                              "
                              style={{
                                fontFamily:
                                  "'Plus Jakarta Sans', sans-serif",
                              }}
                            >
                              {currentUrgent.title}
                            </div>

                            <div
                              className="
                                mt-1
                                truncate
                                text-xs
                                text-gray-500
                              "
                            >
                              {currentUrgent.category}
                            </div>
                          </div>
                        </div>

                        {/* SHORT DESCRIPTION */}

                        {currentUrgent.short_description && (
                          <div
                            className="
                              mb-4
                              line-clamp-4
                              max-h-[72px]
                              overflow-hidden
                              text-xs
                              leading-relaxed
                              text-gray-500

                              [&_p]:m-0
                              [&_p]:mb-2
                              [&_strong]:font-bold
                              [&_em]:italic
                              [&_u]:underline

                              [&_ul]:list-disc
                              [&_ul]:pl-5

                              [&_ol]:list-decimal
                              [&_ol]:pl-5

                              [&_li]:mb-1
                            "
                            dangerouslySetInnerHTML={{
                              __html:
                                currentUrgent.short_description,
                            }}
                          />
                        )}

                        {/* PROGRESS */}

                        <div className="mb-5">

                          <div
                            className="
                              mb-2
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
                              {percentage}%
                            </span>
                          </div>

                          <div
                            className="
                              h-2.5
                              overflow-hidden
                              rounded-full
                              bg-gray-100
                            "
                          >
                            <div
                              className="
                                h-full
                                rounded-full
                                bg-gradient-to-r
                                from-[#F58220]
                                to-[#D96D0A]
                                transition-all
                                duration-700
                              "
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>

                          <div
                            className="
                              mt-2
                              flex
                              items-end
                              justify-between
                              gap-3
                            "
                          >
                            <span
                              className="
                                text-sm
                                font-bold
                                text-gray-800
                              "
                            >
                              {formatRupiah(
                                collected
                              )}
                            </span>

                            <span
                              className="
                                text-right
                                text-xs
                                text-gray-400
                              "
                            >
                              dari{' '}
                              {formatRupiah(
                                target
                              )}
                            </span>
                          </div>
                        </div>

                        {/* DONATE */}

                        <div className="mt-auto">

                          <button
                            type="button"
                            onClick={() => {
                              window.location.href =
                                `/donasi?campaign=${currentUrgent.id}&step=2`
                            }}
                            className="
                              btn-primary
                              block
                              w-full
                              py-3
                              text-center
                              text-sm
                              font-semibold
                            "
                          >
                            Donasi Sekarang
                          </button>

                        </div>

                      </div>
                    </div>

                    {/* PREVIOUS */}

                    {urgentCampaigns.length > 1 && (
                      <button
                        type="button"
                        onClick={
                          goToPreviousUrgent
                        }
                        className="
                          absolute
                          left-[-22px]
                          top-1/2
                          z-20
                          flex
                          h-9
                          w-9
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-full
                          bg-white/90
                          text-gray-700
                          shadow-md
                          transition
                          hover:scale-105
                        "
                        aria-label="Campaign urgent sebelumnya"
                      >
                        ‹
                      </button>
                    )}

                    {/* NEXT */}

                    {urgentCampaigns.length > 1 && (
                      <button
                        type="button"
                        onClick={
                          goToNextUrgent
                        }
                        className="
                          absolute
                          right-[-22px]
                          top-1/2
                          z-20
                          flex
                          h-9
                          w-9
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-full
                          bg-white/90
                          text-gray-700
                          shadow-md
                          transition
                          hover:scale-105
                        "
                        aria-label="Campaign urgent berikutnya"
                      >
                        ›
                      </button>
                    )}

                  </div>

                  {/* DOT */}

                  {urgentCampaigns.length > 1 && (
                    <div
                      className="
                        mt-4
                        flex
                        h-2
                        justify-center
                        gap-2
                      "
                    >
                      {urgentCampaigns.map(
                        (
                          urgent,
                          index
                        ) => (
                          <button
                            key={
                              urgent.id
                            }
                            type="button"
                            onClick={() =>
                              setUrgentIndex(
                                index
                              )
                            }
                            aria-label={`Tampilkan campaign urgent ${
                              index + 1
                            }`}
                            className={`
                              h-2
                              rounded-full
                              transition-all
                              duration-300
                              ${
                                index ===
                                urgentIndex
                                  ? 'w-7 bg-[#F58220]'
                                  : 'w-2 bg-white/60'
                              }
                            `}
                          />
                        )
                      )}
                    </div>
                  )}

                  {/* COUNTER */}

                  {urgentCampaigns.length > 1 && (
                    <p
                      className="
                        mt-2
                        text-center
                        text-xs
                        text-white/60
                      "
                    >
                      {urgentIndex + 1} dari{' '}
                      {urgentCampaigns.length}{' '}
                      campaign urgent
                    </p>
                  )}

                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          SCROLL INDICATOR
      ====================================================== */}

      {!isLoading && (
        <div
          className="
            absolute
            bottom-8
            left-1/2
            hidden
            -translate-x-1/2
            flex-col
            items-center
            gap-2
            text-xs
            text-white/50
            lg:flex
          "
        >
          <span>
            Scroll
          </span>

          <div
            className="
              flex
              h-8
              w-5
              items-start
              justify-center
              rounded-full
              border-2
              border-white/30
              pt-1.5
            "
          >
            <div
              className="
                h-2
                w-1
                animate-bounce
                rounded-full
                bg-white/60
              "
            />
          </div>
        </div>
      )}

    </section>
  )
}