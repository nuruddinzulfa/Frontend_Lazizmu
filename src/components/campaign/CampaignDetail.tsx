'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  getPublicCampaignById,
  type Campaign,
} from '@/service/campaign.service'

interface CampaignDetailProps {
  id: number
}

const fmt = (
  value: number | string | null | undefined
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

  if (
    thumbnail.startsWith('http://') ||
    thumbnail.startsWith('https://')
  ) {
    return thumbnail
  }

  return `http://127.0.0.1:8000/storage/${thumbnail}`
}

export default function CampaignDetail({
  id,
}: CampaignDetailProps) {
  const [campaign, setCampaign] =
    useState<Campaign | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        setLoading(true)
        setError('')

        const data =
          await getPublicCampaignById(id)

        setCampaign(data)
      } catch (err) {
        console.error(err)

        setError(
          err instanceof Error
            ? err.message
            : 'Campaign tidak ditemukan.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadCampaign()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] pt-28">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center text-gray-500">
          Memuat campaign...
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] pt-28">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="rounded-2xl border border-[#F3DEC8] bg-white p-8 text-center">
            <h1 className="text-xl font-bold text-gray-900">
              Campaign Tidak Ditemukan
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {error ||
                'Campaign tidak tersedia.'}
            </p>

            <button
              type="button"
              onClick={() =>
                window.history.back()
              }
              className="mt-5 rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white"
            >
              ← Kembali
            </button>
          </div>
        </div>
      </div>
    )
  }

  const target =
    Number(campaign.target_amount)

  const collected =
    Number(campaign.collected_amount)

  const percentage =
    target > 0
      ? Math.min(
          Math.round(
            (collected / target) * 100
          ),
          100
        )
      : 0

  const thumbnail =
    getThumbnailUrl(
      campaign.thumbnail
    )

  /*
  |--------------------------------------------------------------------------
  | DONASI LANGSUNG CAMPAIGN
  |--------------------------------------------------------------------------
  |
  | Campaign ID dikirim ke halaman /donasi.
  |
  | Contoh:
  | /donasi?campaign=12
  |
  | DonationForm kemudian membaca parameter
  | tersebut dan langsung membuka Step 2.
  |--------------------------------------------------------------------------
  */

  const handleDonate = () => {
    window.location.href =
      `/donasi?campaign=${campaign.id}`
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2] pb-16 pt-28">

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}

        <div className="mb-6 text-sm text-gray-400">
          <button
            type="button"
            onClick={() =>
              window.history.back()
            }
            className="hover:text-[#F58220]"
          >
            ← Kembali ke Campaign
          </button>
        </div>

        {/* Main */}

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* LEFT */}

          <div>

            {/* Thumbnail */}

            {thumbnail ? (
              <div className="mb-6 overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white">
                <img
                  src={thumbnail}
                  alt={campaign.title}
                  className="h-[380px] w-full object-cover"
                />
              </div>
            ) : (
              <div className="mb-6 flex h-[380px] items-center justify-center rounded-2xl border border-[#F3DEC8] bg-[#FFF0DE]">
                <span className="font-semibold text-[#F58220]">
                  Lazismu
                </span>
              </div>
            )}

            {/* Category */}

            <span className="inline-flex rounded-full bg-[#FEF0E4] px-3 py-1 text-xs font-semibold text-[#F58220]">
              {campaign.category}
            </span>

            {/* Title */}

            <h1
              className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl"
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {campaign.title}
            </h1>

            {/* Short description */}

            <p className="mt-4 text-base leading-relaxed text-gray-500">
              {campaign.short_description}
            </p>

            {/* Description */}

            <div className="mt-8 rounded-2xl border border-[#F3DEC8] bg-white p-6 sm:p-8">

              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Tentang Campaign
              </h2>

              <div className="whitespace-pre-line text-sm leading-7 text-gray-600">
                {campaign.description}
              </div>

            </div>

          </div>

          {/* RIGHT */}

          <aside>

            <div className="sticky top-24 rounded-2xl border border-[#F3DEC8] bg-white p-6 shadow-sm">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Progress Donasi
              </p>

              <div className="mt-4 flex items-end justify-between">

                <div>
                  <p className="text-xs text-gray-400">
                    Terkumpul
                  </p>

                  <p className="mt-1 text-xl font-bold text-[#F58220]">
                    {fmt(collected)}
                  </p>
                </div>

                <span className="text-sm font-bold text-gray-700">
                  {percentage}%
                </span>

              </div>

              {/* Progress */}

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">

                <div
                  className="h-full rounded-full bg-[#F58220] transition-all"
                  style={{
                    width: `${percentage}%`,
                  }}
                />

              </div>

              <div className="mt-3 flex justify-between text-xs text-gray-400">

                <span>
                  Target
                </span>

                <span className="font-semibold text-gray-600">
                  {fmt(target)}
                </span>

              </div>

              {/* Dates */}

              {(campaign.start_date ||
                campaign.end_date) && (
                <div className="mt-5 border-t border-gray-100 pt-5">

                  <p className="text-xs font-semibold text-gray-500">
                    Periode Campaign
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    {campaign.start_date ||
                      '-'}{' '}
                    —{' '}
                    {campaign.end_date ||
                      '-'}
                  </p>

                </div>
              )}

              {/* Status */}

              <div className="mt-5">

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    campaign.status ===
                    'published'
                      ? 'bg-green-100 text-green-700'
                      : campaign.status ===
                          'closed'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {campaign.status}
                </span>

              </div>

              {/* Donate */}

              {campaign.status ===
                'published' && (
                <button
                  type="button"
                  onClick={handleDonate}
                  className="mt-6 w-full rounded-xl bg-[#F58220] px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                  Donasi Sekarang →
                </button>
              )}

              {campaign.status ===
                'closed' && (
                <div className="mt-6 rounded-xl bg-gray-100 px-4 py-3 text-center text-sm font-semibold text-gray-500">
                  Campaign telah ditutup
                </div>
              )}

            </div>

          </aside>

        </div>

      </div>

    </div>
  )
}