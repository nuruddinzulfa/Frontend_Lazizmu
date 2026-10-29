'use client'

import { useEffect, useState } from 'react'
import {
  getPublicCampaigns,
  type Campaign,
} from '@/service/campaign.service'

interface CampaignPageProps {
  onOpenCampaign?: (id: number) => void
}

/* ============================================================================
   CATEGORY
============================================================================ */

const categories = [
  'Semua',
  'Pendidikan',
  'Kesehatan',
  'Ekonomi',
  'Sosial Dakwah',
  'Kemanusiaan',
  'Lingkungan',
]

/* ============================================================================
   PILLAR ICON
   Icon ini digunakan bersama oleh Program dan Campaign.
============================================================================ */

function PillarIcon({
  name,
  className = 'h-8 w-8',
}: {
  name: string
  className?: string
}) {
  switch (name) {
    /* ------------------------------------------------------------------------
       PENDIDIKAN
    ------------------------------------------------------------------------ */

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
            stroke="#176B4D"
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

    /* ------------------------------------------------------------------------
       KESEHATAN
    ------------------------------------------------------------------------ */

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
            stroke="#2F855A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )

    /* ------------------------------------------------------------------------
       EKONOMI
    ------------------------------------------------------------------------ */

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

    /* ------------------------------------------------------------------------
       SOSIAL DAKWAH
    ------------------------------------------------------------------------ */

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
            fill="#F4C542"
          />

          <path
            d="M9 48H55V53H9V48Z"
            fill="white"
          />

          <circle
            cx="24"
            cy="37"
            r="2"
            fill="#F4C542"
          />

          <circle
            cx="40"
            cy="37"
            r="2"
            fill="#F4C542"
          />
        </svg>
      )

    /* ------------------------------------------------------------------------
       KEMANUSIAAN
    ------------------------------------------------------------------------ */

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

    /* ------------------------------------------------------------------------
       LINGKUNGAN
    ------------------------------------------------------------------------ */

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

/* ============================================================================
   CATEGORY CONFIG
============================================================================ */

const categoryConfig: Record<
  string,
  {
    color: string
    light: string
  }
> = {
  Pendidikan: {
    color: '#176B4D',
    light: '#F5E9A6',
  },

  Kesehatan: {
    color: '#2F855A',
    light: '#FDEAE6',
  },

  Ekonomi: {
    color: '#176B4D',
    light: '#FBE7E8',
  },

  'Sosial Dakwah': {
    color: '#F4C542',
    light: '#FFF5DD',
  },

  Kemanusiaan: {
    color: '#94C11F',
    light: '#F1F8DE',
  },

  Lingkungan: {
    color: '#C8D52D',
    light: '#F7F9D9',
  },
}

/* ============================================================================
   HELPERS
============================================================================ */

const formatRupiah = (
  value: number | string | null | undefined
) => {
  return (
    'Rp ' +
    Number(value || 0).toLocaleString('id-ID')
  )
}
const stripHtml = (
  html: string | null | undefined
): string => {
  if (!html) return ''

  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

const normalizeRichText = (
  html: string | null | undefined
): string => {
  if (!html) return ''

  let result = html

  result = result
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&')

  return result
}

const getThumbnailUrl = (
  thumbnail: string | null | undefined
) => {
  if (!thumbnail) {
    return null
  }

  if (
    thumbnail.startsWith('http://') ||
    thumbnail.startsWith('https://')
  ) {
    return thumbnail
  }

  return `http://127.0.0.1:8000/storage/${thumbnail}`
}

const getCategoryConfig = (
  category: string | null | undefined
) => {
  if (!category) {
    return categoryConfig.Pendidikan
  }

  return (
    categoryConfig[category] ||
    categoryConfig.Pendidikan
  )
}

/* ============================================================================
   COMPONENT
============================================================================ */

export default function ProgramPage({
  onOpenCampaign,
}: CampaignPageProps) {
  const [campaigns, setCampaigns] =
    useState<Campaign[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [activeCategory, setActiveCategory] =
    useState('Semua')

  const [search, setSearch] =
    useState('')

  /* --------------------------------------------------------------------------
     LOAD CAMPAIGNS
  -------------------------------------------------------------------------- */

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true)
        setError('')

        const data =
          await getPublicCampaigns()

        setCampaigns(
          Array.isArray(data)
            ? data
            : []
        )
      } catch (err) {
        console.error(
          '[CampaignPage] Gagal mengambil campaign:',
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : 'Gagal mengambil campaign.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadCampaigns()
  }, [])

  /* --------------------------------------------------------------------------
     FILTER
  -------------------------------------------------------------------------- */

  const filteredCampaigns =
    campaigns.filter((campaign) => {
      const matchCategory =
        activeCategory === 'Semua' ||
        campaign.category === activeCategory

      const keyword =
        search.toLowerCase().trim()

     const matchSearch =
  !keyword ||
  stripHtml(campaign.title)
    .toLowerCase()
    .includes(keyword) ||
  stripHtml(campaign.short_description)
    .toLowerCase()
    .includes(keyword)

      return (
        matchCategory &&
        matchSearch
      )
    })

  /* --------------------------------------------------------------------------
     OPEN CAMPAIGN
  -------------------------------------------------------------------------- */

  const handleOpenCampaign = (
    id: number
  ) => {
    if (!onOpenCampaign) {
      console.error(
        '[CampaignPage] onOpenCampaign belum diberikan.'
      )

      return
    }

    onOpenCampaign(id)
  }

  /* --------------------------------------------------------------------------
     RENDER
  -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-[#F7F6E8]">

      {/* HEADER */}

      <div className="mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-6 lg:px-8">

        <div className="text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#176B4D] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            Campaign
          </div>

          <h1
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
            style={{
              fontFamily:
                "'Fraunces', serif",
            }}
          >
            Kampanye Kebaikan
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base">
            Dukung campaign pilihan Anda dan
            ikut menghadirkan manfaat nyata
            bagi masyarakat.
          </p>

        </div>

        {/* SEARCH */}

        <div className="mx-auto mt-8 max-w-md">

          <div className="relative">

            <svg
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <input
              type="text"
              placeholder="Cari campaign..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-[#D7DCC0] bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#176B4D] focus:ring-1 focus:ring-[#176B4D]"
            />

          </div>

        </div>

        {/* CATEGORY FILTER */}

        <div className="mt-6 flex flex-wrap justify-center gap-3">

          {categories.map(
            (category) => {

              const config =
                categoryConfig[
                  category
                ]

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setActiveCategory(
                      category
                    )
                  }
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeCategory ===
                    category
                      ? 'text-white shadow-sm'
                      : 'border border-[#D7DCC0] bg-white text-gray-600 hover:border-[#176B4D] hover:text-[#176B4D]'
                  }`}
                  style={
                    activeCategory ===
                    category &&
                    config
                      ? {
                          backgroundColor:
                            config.color,
                        }
                      : undefined
                  }
                >

                  {category !==
                    'Semua' &&
                    config && (
                      <span
                        className="pillar-icon-shell flex h-7 w-7 items-center justify-center rounded-full border border-black/10"
                        style={{
                          backgroundColor:
                            activeCategory ===
                            category
                              ? 'rgba(255,255,255,0.2)'
                              : config.light,
                        }}
                      >
                        <PillarIcon
                          name={category}
                          className="h-4 w-4"
                        />
                      </span>
                    )}

                  {category}

                </button>
              )
            }
          )}

        </div>

      </div>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">

        {/* LOADING */}

        {loading && (
          <div className="py-20 text-center text-gray-500">
            Memuat campaign...
          </div>
        )}

        {/* ERROR */}

        {error && !loading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          filteredCampaigns.length ===
            0 && (
            <div className="rounded-2xl border border-[#D7DCC0] bg-white py-20 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5E9A6]">
                <svg
                  className="h-8 w-8 text-[#176B4D]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M20 12H4m8-8v16"
                  />
                </svg>
              </div>

              <p className="mt-4 text-sm font-semibold text-gray-700">
                Campaign tidak ditemukan.
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Coba gunakan kata kunci atau
                kategori lainnya.
              </p>

            </div>
          )}

        {/* CAMPAIGN CARDS */}

        {!loading &&
          !error &&
          filteredCampaigns.length >
            0 && (

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredCampaigns.map(
                (campaign) => {

                  const target =
                    Number(
                      campaign.target_amount || 0
                    )

                  const collected =
                    Number(
                      campaign.collected_amount || 0
                    )

                  const percentage =
                    target > 0
                      ? Math.min(
                          Math.round(
                            (collected /
                              target) *
                              100
                          ),
                          100
                        )
                      : 0

                  const thumbnail =
                    getThumbnailUrl(
                      campaign.thumbnail
                    )

                  /*
                   * Gunakan konfigurasi warna
                   * berdasarkan pilar campaign.
                   */
                  const config =
                    getCategoryConfig(
                      campaign.category
                    )

                  /*
                   * Gunakan kategori aman
                   * untuk icon.
                   */
                  const category =
                    categoryConfig[
                      campaign.category
                    ]
                      ? campaign.category
                      : 'Pendidikan'

                  return (
                    <div
                      key={campaign.id}
                      className="group overflow-hidden rounded-2xl border border-[#D7DCC0] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                    >

                      {/* ==================================================
                          IMAGE / CATEGORY
                      ================================================== */}

                      <button
                        type="button"
                        onClick={() =>
                          handleOpenCampaign(
                            campaign.id
                          )
                        }
                        className="block w-full text-left"
                      >

                        {thumbnail ? (

                          <div className="relative">

                            <img
                              src={thumbnail}
                              alt={
                                campaign.title
                              }
                              className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                            />

                            {/* CATEGORY */}

                            <div className="absolute left-4 top-4">

                              <div className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 shadow-sm ">

                                <span
                                className="pillar-icon-shell flex h-8 w-8 items-center justify-center rounded-full border border-black/10"
                                  style={{
                                    backgroundColor:
                                      config.color,
                                  }}
                                >
                                  <PillarIcon
                                    name={category}
                                    className="h-4 w-4"
                                  />
                                </span>

                                <span className="text-xs font-semibold text-gray-700">
                                  {
                                    campaign.category
                                  }
                                </span>

                              </div>

                            </div>

                          </div>

                        ) : (

                          /* FALLBACK */

                          <div
                            className="relative flex h-52 items-center justify-center"
                            style={{
                              backgroundColor:
                                config.color,
                            }}
                          >

                            {/* ICON UTAMA */}

                            <div className="flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                              <PillarIcon
                                name={category}
                                className="h-20 w-20"
                              />
                            </div>

                            {/* BRAND */}

                            <span className="absolute bottom-4 text-sm font-bold text-white">
                              Lazismu
                            </span>

                            {/* CATEGORY */}

                            <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-700">
                              {
                                campaign.category
                              }
                            </div>

                          </div>

                        )}

                      </button>

                      {/* ==================================================
                          BODY
                      ================================================== */}

                      <div className="p-5">

                        {/* CATEGORY */}

                        <div className="flex items-center gap-2">

                          <span
                            className="pillar-icon-shell flex h-8 w-8 items-center justify-center rounded-full border border-black/10"
                            style={{
                              backgroundColor:
                                config.color,
                            }}
                          >
                            <PillarIcon
                              name={category}
                              className="h-4 w-4"
                            />
                          </span>

                          <span
                            className="text-xs font-semibold"
                            style={{
                              color:
                                config.color,
                            }}
                          >
                            {
                              campaign.category
                            }
                          </span>

                        </div>

                        {/* TITLE */}

                        <h2 className="mt-3 line-clamp-2 text-lg font-bold text-gray-900">
                          {
                            campaign.title
                          }
                        </h2>

                       {/* DESCRIPTION */}

{campaign.short_description && (
  <div
    className="
      mt-2
      line-clamp-2
      overflow-hidden
      text-sm
      leading-relaxed
      text-gray-500

      [&_p]:m-0
      [&_p]:mb-1

      [&_strong]:font-bold
      [&_em]:italic
      [&_u]:underline

      [&_ol]:ml-5
      [&_ol]:list-decimal

      [&_ul]:ml-5
      [&_ul]:list-disc

      [&_li]:mb-1
    "
    dangerouslySetInnerHTML={{
      __html: normalizeRichText(
        campaign.short_description
      ),
    }}
  />
)}

                        {/* PROGRESS */}

                        <div className="mt-5">

                          <div className="mb-2 flex justify-between text-xs">

                            <span className="text-gray-500">
                              Terkumpul
                            </span>

                            <span
                              className="font-semibold"
                              style={{
                                color:
                                  config.color,
                              }}
                            >
                              {
                                percentage
                              }%
                            </span>

                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-gray-100">

                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor:
                                  config.color,
                              }}
                            />

                          </div>

                          <div className="mt-2 flex justify-between text-xs">

                            <span className="text-gray-400">
                              {formatRupiah(
                                collected
                              )}
                            </span>

                            <span className="text-gray-400">
                              dari{' '}
                              {formatRupiah(
                                target
                              )}
                            </span>

                          </div>

                        </div>

                        {/* DETAIL */}

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenCampaign(
                              campaign.id
                            )
                          }
                          className="mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                          style={{
                            backgroundColor:
                              config.color,
                          }}
                        >
                          Lihat Detail
                        </button>

                      </div>

                    </div>
                  )
                }
              )}

            </div>
          )}

      </div>

    </div>
  )
}
