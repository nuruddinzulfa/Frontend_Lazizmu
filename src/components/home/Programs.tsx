'use client'

import { useEffect, useState } from 'react'

import {
  getPublicCampaigns,
  type Campaign,
} from '@/service/campaign.service'

interface ProgramsProps {
  onOpenCampaign?: (id: number) => void
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

const formatRupiah = (
  value: number | string | null | undefined
) => {
  return (
    'Rp ' +
    Number(value || 0).toLocaleString('id-ID')
  )
}

export default function Programs({
  onOpenCampaign,
}: ProgramsProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const loadCampaigns = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getPublicCampaigns()

        if (!mounted) {
          return
        }

        setCampaigns(
          Array.isArray(data) ? data : []
        )
      } catch (err) {
        console.error(
          '[Programs] Gagal mengambil campaign:',
          err
        )

        if (!mounted) {
          return
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Gagal mengambil program.'
        )
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadCampaigns()

    return () => {
      mounted = false
    }
  }, [])

  /*
   * Beranda hanya menampilkan maksimal
   * 3 campaign.
   */
  const displayedCampaigns = campaigns.slice(0, 3)

  /*
   * Loading
   */
  if (loading) {
    return (
      <section className="bg-[#FFF8F2] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-10 text-center text-gray-500">
            Memuat program...
          </div>
        </div>
      </section>
    )
  }

  /*
   * Error
   */
  if (error) {
    console.error('[Programs] Error:', error)

    return null
  }

  /*
   * Tidak ada campaign
   */
  if (displayedCampaigns.length === 0) {
    return null
  }

  return (
    <section className="bg-[#FFF8F2] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#F58220]">
            Program
          </p>

          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Program Unggulan Kami
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base">
            Dukung berbagai program dan kampanye
            kebaikan yang sedang berjalan di Lazismu.
          </p>
        </div>

        {/* CAMPAIGN CARDS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedCampaigns.map((campaign) => {
            const target = Number(
              campaign.target_amount || 0
            )

            const collected = Number(
              campaign.collected_amount || 0
            )

            const percentage =
              target > 0
                ? Math.min(
                    Math.round(
                      (collected / target) * 100
                    ),
                    100
                  )
                : 0

            const thumbnail = getThumbnailUrl(
              campaign.thumbnail
            )

            return (
              <div
                key={campaign.id}
                className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                {/* THUMBNAIL */}
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={campaign.title}
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-[#FFF0DE]">
                    <span className="text-xl font-bold text-[#F58220]">
                      LAZISMU
                    </span>
                  </div>
                )}

                {/* CONTENT */}
                <div className="p-5">

                  {/* CATEGORY */}
                  <span className="inline-flex rounded-full bg-[#FEF0E4] px-3 py-1 text-xs font-semibold text-[#F58220]">
                    {campaign.category}
                  </span>

                  {/* TITLE */}
                  <h3 className="mt-3 line-clamp-2 text-lg font-bold text-gray-900">
                    {campaign.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                    {campaign.short_description}
                  </p>

                  {/* PROGRESS */}
                  <div className="mt-5">

                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-gray-500">
                        Terkumpul
                      </span>

                      <span className="font-semibold text-[#F58220]">
                        {percentage}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#F58220]"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 flex justify-between text-xs">
                      <span className="text-gray-400">
                        {formatRupiah(collected)}
                      </span>

                      <span className="text-gray-400">
                        dari {formatRupiah(target)}
                      </span>
                    </div>

                  </div>

                  {/* DONASI */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!onOpenCampaign) {
                        console.error(
                          '[Programs] onOpenCampaign belum diberikan dari parent.'
                        )

                        return
                      }

                      onOpenCampaign(campaign.id)
                    }}
                    className="mt-5 w-full rounded-xl bg-[#F58220] px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Donasi Sekarang
                  </button>

                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}