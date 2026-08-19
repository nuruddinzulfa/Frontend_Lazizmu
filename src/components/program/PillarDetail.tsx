'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  getPublicCampaigns,
  type Campaign,
} from '../../service/campaign.service'

interface PillarDetailProps {
  category: string
  onBack: () => void
  onOpenCampaign: (id: number) => void
}

/* ============================================================
   DATA PILAR
============================================================ */

const pillarDescriptions: Record<
  string,
  {
    description: string
  }
> = {
  Pendidikan: {
    description:
      'Program pemberdayaan masyarakat melalui pendidikan untuk membuka akses belajar dan meningkatkan kualitas generasi masa depan.',
  },

  Kesehatan: {
    description:
      'Program kesehatan untuk membantu masyarakat memperoleh layanan kesehatan yang layak dan meningkatkan kualitas hidup.',
  },

  Ekonomi: {
    description:
      'Program pemberdayaan ekonomi untuk membantu masyarakat menjadi lebih mandiri dan meningkatkan kesejahteraan.',
  },

  'Sosial Dakwah': {
    description:
      'Program sosial dan dakwah untuk memperkuat kepedulian, nilai keislaman, serta kebermanfaatan bagi masyarakat.',
  },

  Kemanusiaan: {
    description:
      'Program kemanusiaan untuk membantu masyarakat yang membutuhkan, terutama dalam kondisi darurat dan bencana.',
  },

  Lingkungan: {
    description:
      'Program kepedulian lingkungan untuk menciptakan lingkungan yang sehat, bersih, dan berkelanjutan.',
  },
}

/* ============================================================
   WARNA ICON PILAR
============================================================ */

const pillarColors: Record<string, string> = {
  Pendidikan: '#F58220',
  Kesehatan: '#E94224',
  Ekonomi: '#D21F26',
  'Sosial Dakwah': '#F9B233',
  Kemanusiaan: '#94C11F',
  Lingkungan: '#C8D52D',
}

/* ============================================================
   ICON PILAR
============================================================ */

function PillarIcon({
  name,
  className = 'h-8 w-8',
}: {
  name: string
  className?: string
}) {
  switch (name) {
    /* --------------------------------------------------------
       PENDIDIKAN
    -------------------------------------------------------- */
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

    /* --------------------------------------------------------
       KESEHATAN
    -------------------------------------------------------- */
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

    /* --------------------------------------------------------
       EKONOMI
    -------------------------------------------------------- */
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

    /* --------------------------------------------------------
       SOSIAL DAKWAH
    -------------------------------------------------------- */
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

    /* --------------------------------------------------------
       KEMANUSIAAN
    -------------------------------------------------------- */
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

    /* --------------------------------------------------------
       LINGKUNGAN
    -------------------------------------------------------- */
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

/* ============================================================
   HELPER THUMBNAIL
============================================================ */

function getThumbnailUrl(
  thumbnail: string | null
): string | null {
  if (!thumbnail) {
    return null
  }

  if (thumbnail.startsWith('http')) {
    return thumbnail
  }

  return `http://127.0.0.1:8000/storage/${thumbnail}`
}

/* ============================================================
   FORMAT RUPIAH
============================================================ */

function formatRupiah(
  value: number | string
): string {
  return `Rp ${Number(value).toLocaleString(
    'id-ID'
  )}`
}

/* ============================================================
   PROGRESS
============================================================ */

function getProgress(
  collected: number | string,
  target: number | string
): number {
  const collectedAmount = Number(collected)
  const targetAmount = Number(target)

  if (!targetAmount || targetAmount <= 0) {
    return 0
  }

  return Math.min(
    100,
    Math.round(
      (collectedAmount / targetAmount) * 100
    )
  )
}

/* ============================================================
   COMPONENT
============================================================ */

export default function PillarDetail({
  category,
  onBack,
  onOpenCampaign,
}: PillarDetailProps) {
  const [campaigns, setCampaigns] =
    useState<Campaign[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  /* ============================================================
     LOAD CAMPAIGNS
  ============================================================ */

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true)
        setError('')

        const data =
          await getPublicCampaigns()

        setCampaigns(data)
      } catch (err) {
        console.error(
          'Gagal mengambil campaign:',
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

  /* ============================================================
     DATA PILAR
  ============================================================ */

  const pillar =
    pillarDescriptions[category] ?? {
      description:
        'Program pemberdayaan masyarakat LAZISMU.',
    }

  const pillarColor =
    pillarColors[category] ?? '#F58220'

  /* ============================================================
     FILTER CAMPAIGN SESUAI PILAR
  ============================================================ */

  const filteredCampaigns =
    useMemo(() => {
      return campaigns.filter(
        (campaign) =>
          campaign.status === 'published' &&
          campaign.category
            .toLowerCase()
            .trim() ===
            category
              .toLowerCase()
              .trim()
      )
    }, [campaigns, category])

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="min-h-screen bg-[#FFF8F2]">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] pt-32 pb-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* BACK */}
          <button
            type="button"
            onClick={onBack}
            className="mb-6 text-sm opacity-90 transition hover:opacity-100"
          >
            ← Kembali ke Program
          </button>

          {/* TITLE */}
          <div className="flex items-center gap-4">

            {/* ICON PILAR */}
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
              style={{
                backgroundColor: pillarColor,
              }}
            >
              <PillarIcon
                name={category}
                className="h-9 w-9"
              />
            </div>

            {/* TITLE */}
            <div>
              <p className="mb-1 text-sm font-medium opacity-80">
                PILAR PROGRAM
              </p>

              <h1
                className="text-3xl font-bold sm:text-4xl"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {category}
              </h1>
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
            {pillar.description}
          </p>

        </div>
      </section>

      {/* ======================================================
          CAMPAIGN
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* HEADER CAMPAIGN */}
        <div className="mb-8">

          <span className="inline-flex rounded-full bg-[#FEF0E4] px-3 py-1 text-xs font-semibold text-[#F58220]">
            CAMPAIGN
          </span>

          <h2
            className="mt-3 text-2xl font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Campaign {category}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Program nyata yang sedang dijalankan
            dalam pilar {category}.
          </p>
        </div>

        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="rounded-2xl border border-[#F3DEC8] bg-white p-12 text-center">

            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#F58220] border-t-transparent" />

            <p className="text-sm text-gray-500">
              Memuat campaign...
            </p>

          </div>
        )}

        {/* ==================================================
            ERROR
        ================================================== */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

            <p className="text-sm text-red-600">
              {error}
            </p>

          </div>
        )}

        {/* ==================================================
            EMPTY
        ================================================== */}

        {!loading &&
          !error &&
          filteredCampaigns.length === 0 && (
            <div className="rounded-2xl border border-[#F3DEC8] bg-white p-12 text-center">

              {/* ICON */}
              <div
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: pillarColor,
                }}
              >
                <PillarIcon
                  name={category}
                  className="h-9 w-9"
                />
              </div>

              <h3 className="font-semibold text-gray-800">
                Belum ada campaign
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Saat ini belum ada campaign
                aktif untuk pilar {category}.
              </p>

            </div>
          )}

        {/* ==================================================
            CAMPAIGN GRID
        ================================================== */}

        {!loading &&
          !error &&
          filteredCampaigns.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredCampaigns.map(
                (campaign) => {
                  const thumbnail =
                    getThumbnailUrl(
                      campaign.thumbnail
                    )

                  const progress =
                    getProgress(
                      campaign.collected_amount,
                      campaign.target_amount
                    )

                  return (
                    <article
                      key={campaign.id}
                      className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >

                      {/* ==================================================
                          THUMBNAIL
                      ================================================== */}

                      <button
                        type="button"
                        onClick={() =>
                          onOpenCampaign(
                            campaign.id
                          )
                        }
                        className="block w-full text-left"
                      >

                        <div className="relative h-48 overflow-hidden bg-[#FFF1E4]">

                          {thumbnail ? (
                            <img
                              src={thumbnail}
                              alt={
                                campaign.title
                              }
                              className="h-full w-full object-cover transition duration-300 hover:scale-105"
                            />
                          ) : (
                            <div
                              className="flex h-full items-center justify-center"
                              style={{
                                backgroundColor:
                                  pillarColor,
                              }}
                            >
                              <PillarIcon
                                name={category}
                                className="h-16 w-16"
                              />
                            </div>
                          )}

                          {/* CATEGORY */}
                          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#F58220] shadow-sm">
                            {campaign.category}
                          </span>

                        </div>

                      </button>

                      {/* ==================================================
                          CONTENT
                      ================================================== */}

                      <div className="p-5">

                        {/* TITLE */}
                        <button
                          type="button"
                          onClick={() =>
                            onOpenCampaign(
                              campaign.id
                            )
                          }
                          className="text-left"
                        >
                          <h3
                            className="line-clamp-2 font-bold text-gray-900 hover:text-[#F58220]"
                            style={{
                              fontFamily:
                                "'Plus Jakarta Sans', sans-serif",
                            }}
                          >
                            {campaign.title}
                          </h3>
                        </button>

                        {/* DESCRIPTION */}
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500">
                          {
                            campaign.short_description
                          }
                        </p>

                        {/* ==================================================
                            PROGRESS
                        ================================================== */}

                        <div className="mt-5">

                          <div className="mb-2 flex items-center justify-between text-xs">

                            <span className="text-gray-500">
                              Terkumpul
                            </span>

                            <span className="font-semibold text-[#F58220]">
                              {progress}%
                            </span>

                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-gray-100">

                            <div
                              className="h-full rounded-full bg-[#F58220] transition-all"
                              style={{
                                width: `${progress}%`,
                              }}
                            />

                          </div>

                          <div className="mt-3 flex items-center justify-between text-xs">

                            <span className="font-semibold text-gray-800">
                              {formatRupiah(
                                campaign.collected_amount
                              )}
                            </span>

                            <span className="text-gray-400">
                              dari{' '}
                              {formatRupiah(
                                campaign.target_amount
                              )}
                            </span>

                          </div>

                        </div>

                        {/* ==================================================
                            BUTTON
                        ================================================== */}

                        <button
                          type="button"
                          onClick={() =>
                            onOpenCampaign(
                              campaign.id
                            )
                          }
                          className="mt-5 w-full rounded-xl bg-[#F58220] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#D96D0A]"
                        >
                          Lihat Campaign
                        </button>

                      </div>

                    </article>
                  )
                }
              )}

            </div>
          )}

      </section>
    </div>
  )
}