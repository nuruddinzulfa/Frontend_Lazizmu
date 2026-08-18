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

const pillarDescriptions: Record<
  string,
  {
    description: string
    icon: string
  }
> = {
  Pendidikan: {
    icon: '📚',
    description:
      'Program pemberdayaan masyarakat melalui pendidikan untuk membuka akses belajar dan meningkatkan kualitas generasi masa depan.',
  },

  Kesehatan: {
    icon: '🏥',
    description:
      'Program kesehatan untuk membantu masyarakat memperoleh layanan kesehatan yang layak dan meningkatkan kualitas hidup.',
  },

  Ekonomi: {
    icon: '💼',
    description:
      'Program pemberdayaan ekonomi untuk membantu masyarakat menjadi lebih mandiri dan meningkatkan kesejahteraan.',
  },

  'Sosial Dakwah': {
    icon: '🤲',
    description:
      'Program sosial dan dakwah untuk memperkuat kepedulian, nilai keislaman, serta kebermanfaatan bagi masyarakat.',
  },

  Kemanusiaan: {
    icon: '❤️',
    description:
      'Program kemanusiaan untuk membantu masyarakat yang membutuhkan, terutama dalam kondisi darurat dan bencana.',
  },

  Lingkungan: {
    icon: '🌱',
    description:
      'Program kepedulian lingkungan untuk menciptakan lingkungan yang sehat, bersih, dan berkelanjutan.',
  },
}

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

function formatRupiah(
  value: number | string
): string {
  return `Rp ${Number(value).toLocaleString(
    'id-ID'
  )}`
}

function getProgress(
  collected: number | string,
  target: number | string
): number {
  const collectedAmount = Number(collected)
  const targetAmount = Number(target)

  if (
    !targetAmount ||
    targetAmount <= 0
  ) {
    return 0
  }

  return Math.min(
    100,
    Math.round(
      (collectedAmount / targetAmount) * 100
    )
  )
}

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

  const pillar = pillarDescriptions[
    category
  ] ?? {
    icon: '📌',
    description:
      'Program pemberdayaan masyarakat LAZISMU.',
  }

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

  return (
    <div className="min-h-screen bg-[#FFF8F2]">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <section className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] pt-32 pb-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <button
            type="button"
            onClick={onBack}
            className="mb-6 text-sm opacity-90 transition hover:opacity-100"
          >
            ← Kembali ke Program
          </button>

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl">
              {pillar.icon}
            </div>

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

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
            {pillar.description}
          </p>

        </div>
      </section>

      {/* ============================================================
          CAMPAIGN
      ============================================================ */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

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

        {/* Loading */}

        {loading && (
          <div className="rounded-2xl border border-[#F3DEC8] bg-white p-12 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#F58220] border-t-transparent" />

            <p className="text-sm text-gray-500">
              Memuat campaign...
            </p>
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          filteredCampaigns.length === 0 && (
            <div className="rounded-2xl border border-[#F3DEC8] bg-white p-12 text-center">

              <div className="mb-4 text-4xl">
                📭
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

        {/* Campaign Grid */}

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

                      {/* Thumbnail */}

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
                            <div className="flex h-full items-center justify-center">
                              <span className="text-4xl">
                                {pillar.icon}
                              </span>
                            </div>
                          )}

                          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#F58220] shadow-sm">
                            {campaign.category}
                          </span>

                        </div>
                      </button>

                      {/* Content */}

                      <div className="p-5">

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

                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500">
                          {
                            campaign.short_description
                          }
                        </p>

                        {/* Progress */}

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

                        {/* Button */}

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