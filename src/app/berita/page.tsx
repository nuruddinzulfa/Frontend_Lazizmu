import { useEffect, useState } from 'react'
import type { NavPage } from '../../App'
import { getNews, type News } from '../../service/news.service'

interface BeritaPageProps {
  onNavigate?: (page: NavPage) => void
  onOpenContent?: (
    type: 'berita' | 'artikel',
    id: number
  ) => void
}

// const categories = [
//   'Semua',
//   'Kegiatan',
//   'Pengumuman',
//   'Laporan',
// ]

const categoryColors: Record<string, string> = {
  Kegiatan: 'bg-blue-100 text-blue-700',
  Pengumuman: 'bg-yellow-100 text-yellow-700',
  Laporan: 'bg-green-100 text-green-700',
}

function getThumbnailUrl(
  thumbnail: string | null
): string | null {
  return thumbnail || null
}

function formatDate(
  date: string | null | undefined
): string {
  if (!date) {
    return '-'
  }

  return new Date(date).toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  )
}

export default function BeritaPage({
  onOpenContent,
}: BeritaPageProps) {
  const [newsData, setNewsData] =
    useState<News[]>([])

  // const [activeCategory, setActiveCategory] =
  //   useState('Semua')

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    let mounted = true

    async function loadNews() {
      try {
        setIsLoading(true)
        setError('')

        const data = await getNews()

        if (!mounted) {
          return
        }

        setNewsData(data)
      } catch (err) {
        if (!mounted) {
          return
        }

        console.error(
          'Gagal mengambil berita:',
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : 'Gagal mengambil berita.'
        )
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadNews()

    return () => {
      mounted = false
    }
  }, [])

  const featured =
    newsData.length > 0
      ? newsData[0]
      : null

  const regular =
    newsData.slice(1)

const filtered = regular

  const openNews = (id: number) => {
    onOpenContent?.('berita', id)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFCF9]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#F58220] border-t-transparent rounded-full mx-auto mb-4" />

          <p className="text-sm text-gray-500">
            Memuat berita...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#FFFCF9]">
        <div className="bg-white border border-red-100 rounded-2xl p-8 text-center max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Gagal memuat berita
          </h2>

          <p className="text-sm text-red-500">
            {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFCF9]">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] text-white py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-sm mb-3 opacity-80">
            <span>Beranda</span>
            <span className="mx-2">/</span>
            <span>Berita</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold"
            style={{
              fontFamily:
                "'Playfair Display', serif",
            }}
          >
            Berita & Informasi
          </h1>

          <p className="mt-4 text-lg opacity-90 max-w-2xl">
            Informasi terkini kegiatan,
            pengumuman, dan laporan Lazismu
            Pemalang.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {newsData.length === 0 ? (
          <div className="bg-white border border-[#F3DEC8] rounded-2xl p-10 text-center">
            <h2
              className="text-xl font-bold text-gray-900 mb-2"
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Belum Ada Berita
            </h2>

            <p className="text-gray-500 text-sm">
              Berita terbaru akan ditampilkan
              di halaman ini setelah
              dipublikasikan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* MAIN CONTENT */}
            <div className="lg:col-span-2 space-y-8">

              {/* FEATURED */}
              {featured && (
                <FeaturedNews
                  news={featured}
                  onOpen={() =>
                    openNews(featured.id)
                  }
                />
              )}

              {/* FILTER */}
              {/* <div className="flex flex-wrap gap-3">
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
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                        activeCategory ===
                        category
                          ? 'bg-[#F58220] text-white'
                          : 'bg-white border border-[#F3DEC8] text-gray-600 hover:border-[#F58220] hover:text-[#F58220]'
                      }`}
                    >
                      {category}
                    </button>
                  )
                )}
              </div> */}

              {/* NEWS GRID */}
              {filtered.length === 0 ? (
                <div className="bg-white border border-[#F3DEC8] rounded-2xl p-10 text-center">
                  <p className="text-gray-500">
                    Belum ada berita pada
                    kategori ini.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filtered.map(
                    (news) => (
                      <NewsCard
                        key={news.id}
                        news={news}
                        onOpen={() =>
                          openNews(news.id)
                        }
                      />
                    )
                  )}
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <aside className="space-y-6">

              {/* CATEGORY */}
              {/* <div className="bg-white border border-[#F3DEC8] rounded-2xl p-6 shadow-sm">
                <h3
                  className="font-bold text-gray-900 mb-4"
                  style={{
                    fontFamily:
                      "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Kategori
                </h3>

                <div className="space-y-2">
                  {categories
                    .filter(
                      (category) =>
                        category !==
                        'Semua'
                    )
                    .map(
                      (category) => {
                        const count =
                          newsData.filter(
                            (news) =>
                              news.category ===
                              category
                          ).length

                        return (
                          <button
                            key={
                              category
                            }
                            type="button"
                            onClick={() =>
                              setActiveCategory(
                                category
                              )
                            }
                            className={`flex items-center justify-between w-full px-3 py-2 rounded-xl transition-colors group ${
                              activeCategory ===
                              category
                                ? 'bg-[#FEF0E4]'
                                : 'hover:bg-[#FEF0E4]'
                            }`}
                          >
                            <span
                              className={`text-sm ${
                                activeCategory ===
                                category
                                  ? 'text-[#F58220] font-semibold'
                                  : 'text-gray-600 group-hover:text-[#F58220]'
                              }`}
                            >
                              {
                                category
                              }
                            </span>

                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                              {count}
                            </span>
                          </button>
                        )
                      }
                    )}
                </div>
              </div> */}

              {/* LATEST NEWS */}
              <div className="bg-white border border-[#F3DEC8] rounded-2xl p-6 shadow-sm">
                <h3
                  className="font-bold text-gray-900 mb-4"
                  style={{
                    fontFamily:
                      "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Berita Terbaru
                </h3>

                <div className="space-y-4">
                  {newsData
                    .slice(0, 4)
                    .map(
                      (news) => (
                        <LatestNewsItem
                          key={
                            news.id
                          }
                          news={news}
                          onOpen={() =>
                            openNews(
                              news.id
                            )
                          }
                        />
                      )
                    )}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

function FeaturedNews({
  news,
  onOpen,
}: {
  news: News
  onOpen: () => void
}) {
  const thumbnail =
    getThumbnailUrl(news.thumbnail)

  return (
    <article
      className="bg-white border border-[#F3DEC8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={onOpen}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={news.title}
          className="w-full h-64 object-cover"
        />
      ) : (
        <ThumbnailPlaceholder
          className="h-64"
        />
      )}

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <CategoryBadge
            category={news.category}
          />

          <span className="text-xs text-gray-400">
            {formatDate(
              news.published_at ??
                news.created_at
            )}
          </span>

          <span className="text-xs bg-[#FEF0E4] text-[#F58220] font-semibold px-2 py-1 rounded-full">
            Terbaru
          </span>
        </div>

        <h2
          className="text-xl font-bold text-gray-900 mb-3"
          style={{
            fontFamily:
              "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {news.title}
        </h2>

        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {news.excerpt ||
            'Ringkasan berita belum tersedia.'}
        </p>

        <button
          type="button"
          className="text-[#F58220] font-semibold text-sm hover:underline"
          onClick={(event) => {
            event.stopPropagation()
            onOpen()
          }}
        >
          Baca Selengkapnya →
        </button>
      </div>
    </article>
  )
}

function NewsCard({
  news,
  onOpen,
}: {
  news: News
  onOpen: () => void
}) {
  const thumbnail =
    getThumbnailUrl(news.thumbnail)

  return (
    <article
      className="bg-white border border-[#F3DEC8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={onOpen}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={news.title}
          className="w-full h-44 object-cover"
        />
      ) : (
        <ThumbnailPlaceholder
          className="h-44"
        />
      )}

      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <CategoryBadge
            category={news.category}
          />

          <span className="text-xs text-gray-400">
            {formatDate(
              news.published_at ??
                news.created_at
            )}
          </span>
        </div>

        <h3
          className="font-bold text-gray-900 mb-2 text-sm leading-snug"
          style={{
            fontFamily:
              "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {news.title}
        </h3>

        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
          {news.excerpt ||
            'Ringkasan berita belum tersedia.'}
        </p>

        <button
          type="button"
          className="text-[#F58220] font-semibold text-xs hover:underline"
          onClick={(event) => {
            event.stopPropagation()
            onOpen()
          }}
        >
          Baca Selengkapnya →
        </button>
      </div>
    </article>
  )
}

function LatestNewsItem({
  news,
  onOpen,
}: {
  news: News
  onOpen: () => void
}) {
  const thumbnail =
    getThumbnailUrl(news.thumbnail)

  return (
    <div
      className="flex gap-3 cursor-pointer group"
      onClick={onOpen}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={news.title}
          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-16 h-16 rounded-xl bg-[#FFF8F2] border border-[#F3DEC8] flex items-center justify-center flex-shrink-0">
          <svg
            className="w-6 h-6 text-[#F58220]/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM8.5 11.5l2.5 2.5 4-4 4 4"
            />
          </svg>
        </div>
      )}

      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-800 leading-snug mb-1 line-clamp-2 group-hover:text-[#F58220] transition-colors">
          {news.title}
        </p>

        <p className="text-xs text-gray-400">
          {formatDate(
            news.published_at ??
              news.created_at
          )}
        </p>
      </div>
    </div>
  )
}

function CategoryBadge({
  category,
}: {
  category: string
}) {
  return (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded-full ${
        categoryColors[category] ??
        'bg-gray-100 text-gray-700'
      }`}
    >
      {category}
    </span>
  )
}

function ThumbnailPlaceholder({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={`w-full bg-gradient-to-br from-[#FFF8F2] to-[#FEF0E4] flex items-center justify-center ${className ?? ''}`}
    >
      <div className="text-center">
        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto">
          <svg
            className="w-7 h-7 text-[#F58220]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM8.5 11.5l2.5 2.5 4-4 4 4"
            />
          </svg>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          Thumbnail belum tersedia
        </p>
      </div>
    </div>
  )
}