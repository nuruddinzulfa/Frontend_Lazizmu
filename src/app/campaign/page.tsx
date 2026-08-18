'use client'

import { useEffect, useState } from 'react'

import {
  getPublicCampaigns,
  type Campaign,
} from '@/service/campaign.service'

interface CampaignPageProps {
  onOpenCampaign?: (id: number) => void
}

const categories = [
  'Semua',
  'Pendidikan',
  'Kesehatan',
  'Ekonomi',
  'Sosial Dakwah',
  'Kemanusiaan',
  'Lingkungan',
]

const formatRupiah = (
  value: number | string
) => {
  return (
    'Rp ' +
    Number(value || 0).toLocaleString(
      'id-ID'
    )
  )
}

const getThumbnailUrl = (
  thumbnail: string | null
) => {
  if (!thumbnail) {
    return null
  }

  if (thumbnail.startsWith('http')) {
    return thumbnail
  }

  return `http://127.0.0.1:8000/storage/${thumbnail}`
}

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

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true)
        setError('')

        const data =
          await getPublicCampaigns()

        setCampaigns(data)
      } catch (err) {
        console.error(err)

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

  const filteredCampaigns =
    campaigns.filter((campaign) => {
      const matchCategory =
        activeCategory === 'Semua' ||
        campaign.category ===
          activeCategory

      const keyword =
        search.toLowerCase().trim()

      const matchSearch =
        !keyword ||
        campaign.title
          .toLowerCase()
          .includes(keyword) ||
        campaign.short_description
          .toLowerCase()
          .includes(keyword)

      return (
        matchCategory &&
        matchSearch
      )
    })

  const handleOpenCampaign = (id: number) => {
  console.log('[DEBUG CampaignPage] Tombol/Gambar diklik untuk ID:', id)
  
  if (!onOpenCampaign) {
    console.error('[DEBUG CampaignPage] ERROR: Prop onOpenCampaign bernilai undefined!')
    return
  }

  onOpenCampaign(id)
}

  return (
    <div className="min-h-screen bg-[#FFF8F2]">

      {/* HEADER */}

      <div className="mx-auto max-w-7xl px-4 pb-6 pt-28 sm:px-6 lg:px-8">

        {/* SEARCH */}

        <div className="relative max-w-md">
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
            className="w-full rounded-xl border border-[#F3DEC8] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#F58220]"
          />
        </div>

        {/* CATEGORY */}

        <div className="mt-5 flex flex-wrap gap-3">

          {categories.map(
            (category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setActiveCategory(
                    category
                  )
                }
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeCategory ===
                  category
                    ? 'bg-[#F58220] text-white'
                    : 'border border-[#F3DEC8] bg-white text-gray-600 hover:border-[#F58220] hover:text-[#F58220]'
                }`}
              >
                {category}
              </button>
            )
          )}

        </div>

      </div>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">

        {loading && (
          <div className="py-20 text-center text-gray-500">
            Memuat campaign...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          filteredCampaigns.length ===
            0 && (
            <div className="py-20 text-center text-gray-400">
              Campaign tidak ditemukan.
            </div>
          )}

        {!loading &&
          !error &&
          filteredCampaigns.length >
            0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredCampaigns.map(
                (campaign) => {
                  const target =
                    Number(
                      campaign.target_amount
                    )

                  const collected =
                    Number(
                      campaign.collected_amount
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

                  return (
                    <div
                      key={campaign.id}
                      className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >

                      {/* IMAGE */}

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
                          <img
                            src={thumbnail}
                            alt={
                              campaign.title
                            }
                            className="h-48 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-48 items-center justify-center bg-[#FFF0DE]">
                            <span className="font-bold text-[#F58220]">
                              LAZISMU
                            </span>
                          </div>
                        )}
                      </button>

                      {/* BODY */}

                      <div className="p-5">

                        <span className="inline-flex rounded-full bg-[#FEF0E4] px-3 py-1 text-xs font-semibold text-[#F58220]">
                          {
                            campaign.category
                          }
                        </span>

                        <h2 className="mt-3 line-clamp-2 text-lg font-bold text-gray-900">
                          {
                            campaign.title
                          }
                        </h2>

                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                          {
                            campaign.short_description
                          }
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
                          className="mt-5 w-full rounded-xl bg-[#F58220] px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
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