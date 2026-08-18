import { useEffect, useMemo, useState } from 'react'
import { useInView } from '../../hooks/useInView'
import type { NavPage } from '../../App'
import API_URL from '../../lib/api'

interface CrowdfundingProps {
  onNavigate: (page: NavPage) => void
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
  status: 'draft' | 'published' | 'closed'
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

interface CampaignResponse {
  success: boolean
  message: string
  data: Campaign[]
}

function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

function getThumbnailUrl(
  thumbnail: string | null
): string | null {
  if (!thumbnail) {
    return null
  }

  if (
    thumbnail.startsWith('http://') ||
    thumbnail.startsWith('https://')
  ) {
    return thumbnail
  }

  const backendUrl =
    API_URL.replace(/\/api\/?$/, '')

  return `${backendUrl}/storage/${thumbnail}`
}

function getDaysLeft(
  endDate: string | null
): number | null {
  if (!endDate) {
    return null
  }

  const end = new Date(endDate)
  const now = new Date()

  const diff = end.getTime() - now.getTime()

  if (diff <= 0) {
    return 0
  }

  return Math.ceil(
    diff / (1000 * 60 * 60 * 24)
  )
}

export default function CrowdfundingSection({
  onNavigate,
}: CrowdfundingProps) {
  const { inView, ref } = useInView()

  const [campaigns, setCampaigns] =
    useState<Campaign[]>([])

  const [activeFilter, setActiveFilter] =
    useState('Semua')

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState(false)

  useEffect(() => {
    let mounted = true

    async function loadCampaigns() {
      try {
        setLoading(true)
        setError(false)

        const response = await fetch(
          `${API_URL}/campaigns`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          }
        )

        const result: CampaignResponse =
          await response.json()

        if (!response.ok) {
          throw new Error(
            result.message ||
              'Gagal mengambil campaign.'
          )
        }

        if (!mounted) {
          return
        }

        const published =
          result.data.filter(
            (campaign) =>
              campaign.status === 'published'
          )

        setCampaigns(published)
      } catch (err) {
        if (!mounted) {
          return
        }

        console.error(
          'Gagal mengambil campaign:',
          err
        )

        setCampaigns([])
        setError(true)
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

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        campaigns
          .map((campaign) =>
            campaign.category?.trim()
          )
          .filter(Boolean)
      )
    )

    return ['Semua', ...uniqueCategories]
  }, [campaigns])

  const filteredCampaigns =
    activeFilter === 'Semua'
      ? campaigns
      : campaigns.filter(
          (campaign) =>
            campaign.category === activeFilter
        )

  const totalCollected =
    campaigns.reduce(
      (total, campaign) =>
        total +
        Number(
          campaign.collected_amount || 0
        ),
      0
    )

  const totalTarget =
    campaigns.reduce(
      (total, campaign) =>
        total +
        Number(
          campaign.target_amount || 0
        ),
      0
    )

  return (
    <section
      id="crowdfunding"
      className="py-20 bg-[#FFF8F2]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={
            ref as React.RefObject<HTMLDivElement>
          }
          className={`flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 transition-all duration-700 ${
            inView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          <div>
            <span className="text-[#F58220] text-sm font-semibold uppercase tracking-wider">
              Crowdfunding
            </span>

            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-2"
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Galang Dana Bersama
            </h2>

            <p className="text-gray-500 max-w-lg">
              Dukung kampanye kebaikan pilihan
              Anda. Setiap kontribusi berarti bagi
              masyarakat yang membutuhkan.
            </p>
          </div>

          {!loading &&
            !error &&
            campaigns.length > 0 && (
              <div className="flex flex-wrap gap-6 flex-shrink-0">
                <div className="lg:text-right">
                  <div
                    className="text-xl font-bold text-[#F58220]"
                    style={{
                      fontFamily:
                        "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {campaigns.length}
                  </div>

                  <div className="text-xs text-gray-400">
                    Kampanye Aktif
                  </div>
                </div>

                <div className="lg:text-right">
                  <div
                    className="text-xl font-bold text-[#F58220]"
                    style={{
                      fontFamily:
                        "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {formatRupiah(
                      totalCollected
                    )}
                  </div>

                  <div className="text-xs text-gray-400">
                    Dana Terkumpul
                  </div>
                </div>

                <div className="lg:text-right">
                  <div
                    className="text-xl font-bold text-[#F58220]"
                    style={{
                      fontFamily:
                        "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {formatRupiah(totalTarget)}
                  </div>

                  <div className="text-xs text-gray-400">
                    Total Target
                  </div>
                </div>
              </div>
            )}
        </div>

        {!loading &&
          !error &&
          campaigns.length > 0 && (
            <div
              className={`flex flex-wrap gap-2 mb-8 transition-all duration-700 delay-100 ${
                inView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    setActiveFilter(category)
                  }
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeFilter === category
                      ? 'bg-[#F58220] text-white shadow-sm'
                      : 'bg-white text-gray-500 border border-[#F3DEC8] hover:border-[#F58220] hover:text-[#F58220]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

        {loading && (
          <div className="bg-white border border-[#F3DEC8] rounded-2xl p-10 text-center">
            <p className="text-sm text-gray-400">
              Memuat campaign...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-white border border-red-100 rounded-2xl p-10 text-center">
            <p className="text-sm text-red-500">
              Campaign gagal dimuat.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          campaigns.length === 0 && (
            <div className="bg-white border border-[#F3DEC8] rounded-2xl p-10 text-center">
              <p className="text-sm text-gray-400">
                Belum ada campaign yang tersedia.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          filteredCampaigns.length > 0 && (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${
                inView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {filteredCampaigns.map(
                (campaign) => {
                  const collected = Number(
                    campaign.collected_amount || 0
                  )

                  const target = Number(
                    campaign.target_amount || 0
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

                  const almostDone =
                    percentage >= 85

                  const thumbnailUrl =
                    getThumbnailUrl(
                      campaign.thumbnail
                    )

                  const daysLeft =
                    getDaysLeft(
                      campaign.end_date
                    )

                  return (
                    <div
                      key={campaign.id}
                      className="card-hover bg-white rounded-2xl overflow-hidden border border-[#F3DEC8] shadow-sm flex flex-col"
                    >
                      <div className="relative h-48 bg-orange-50 overflow-hidden">
                        {thumbnailUrl ? (
                          <img
                            src={thumbnailUrl}
                            alt={campaign.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FFF4E9] to-[#FFE3C7]">
                            <div className="text-center px-6">
                              <div className="w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center shadow-sm">
                                <svg
                                  className="w-8 h-8 text-[#F58220]"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.8}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                        <div className="absolute top-3 left-3">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-gray-700">
                            {
                              campaign.category
                            }
                          </span>
                        </div>

                        {daysLeft !== null &&
                          daysLeft > 0 &&
                          daysLeft <= 10 && (
                            <div className="absolute bottom-3 right-3">
                              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500 text-white">
                                {daysLeft} hari
                                lagi!
                              </span>
                            </div>
                          )}
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h3
                          className="font-bold text-gray-800 leading-snug mb-2"
                          style={{
                            fontFamily:
                              "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {campaign.title}
                        </h3>

                        {campaign.short_description && (
                          <p className="text-gray-500 text-sm leading-relaxed mb-4">
                            {
                              campaign.short_description
                            }
                          </p>
                        )}

                        <div className="mb-3 mt-auto">
                          <div className="flex justify-between items-center mb-1.5 text-xs">
                            <span className="text-gray-400">
                              Terkumpul
                            </span>

                            <span
                              className={`font-bold ${
                                almostDone
                                  ? 'text-green-600'
                                  : 'text-[#F58220]'
                              }`}
                            >
                              {percentage}%
                            </span>
                          </div>

                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                almostDone
                                  ? 'bg-gradient-to-r from-green-400 to-green-600'
                                  : 'bg-gradient-to-r from-[#F58220] to-[#D96D0A]'
                              }`}
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="mb-5">
                          <div
                            className="text-base font-bold text-gray-800"
                            style={{
                              fontFamily:
                                "'Plus Jakarta Sans', sans-serif",
                            }}
                          >
                            {formatRupiah(
                              collected
                            )}
                          </div>

                          <div className="text-xs text-gray-400">
                            dari{' '}
                            {formatRupiah(target)}
                          </div>
                        </div>

                        {daysLeft !== null && (
                          <div className="text-xs text-gray-400 mb-4">
                            {daysLeft > 0
                              ? `${daysLeft} hari tersisa`
                              : 'Campaign telah berakhir'}
                          </div>
                        )}

                        <button
                          onClick={() =>
                            onNavigate('donasi')
                          }
                          className="btn-primary block w-full text-center py-2.5 text-sm font-semibold"
                        >
                          Dukung Sekarang
                        </button>
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          )}

        <div className="text-center mt-10">
          <button
            onClick={() =>
              onNavigate('program')
            }
            className="border-2 border-[#F58220] text-[#F58220] hover:bg-[#F58220] hover:text-white transition-all duration-200 px-8 py-3 rounded-xl font-semibold text-sm"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Lihat Semua Kampanye →
          </button>
        </div>
      </div>
    </section>
  )
}