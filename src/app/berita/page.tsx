import { useEffect, useState } from 'react'
import type { NavPage } from '../../App'
import { getNews, type News } from '../../service/news.service'
import API_URL from '../../lib/api'

interface BeritaPageProps {
  onNavigate?: (page: NavPage) => void
  onOpenContent?: (type: 'berita' | 'artikel', id: number) => void
}

const categoryColors: Record<string, string> = {
  Kegiatan: 'bg-blue-100 text-blue-700',
  Pengumuman: 'bg-yellow-100 text-yellow-700',
  Laporan: 'bg-green-100 text-green-700',
}

function getThumbnailUrl(thumbnail: string | null) {
  if (!thumbnail) {
    return null
  }

  return `${API_URL.replace('/api', '')}/storage/${thumbnail}`
}

function formatDate(date: string | null) {
  if (!date) {
    return '-'
  }

  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function BeritaPage({
  onOpenContent,
}: BeritaPageProps) {

  const [newsData, setNewsData] = useState<News[]>([])
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const categories = [
    'Semua',
    'Kegiatan',
    'Pengumuman',
    'Laporan',
  ]

  useEffect(() => {

    const loadNews = async () => {

      try {

        setIsLoading(true)
        setError('')

        const data = await getNews()

        setNewsData(data)

      } catch (err) {

        console.error('Gagal mengambil berita:', err)

        setError(
          err instanceof Error
            ? err.message
            : 'Gagal mengambil berita.'
        )

      } finally {

        setIsLoading(false)

      }
    }

    loadNews()

  }, [])

  const featured = newsData[0]

  const regular = newsData.slice(1)

  const filtered =
    activeCategory === 'Semua'
      ? regular
      : regular.filter(
          news => news.category === activeCategory
        )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">

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
      <div className="min-h-screen flex items-center justify-center px-4">

        <div className="text-center">

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

      {/* Header */}

      <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] text-white py-16 pt-32">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <p className="mt-4 text-lg opacity-90 max-w-2xl">
            Beranda / Berita
          </p>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            Berita & Informasi
          </h1>

          <p className="mt-4 text-lg opacity-90 max-w-2xl">
            Informasi terkini kegiatan dan pengumuman
            LAZISMU Pemalang.
          </p>

        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}

          <div className="lg:col-span-2 space-y-8">

            {/* Featured */}

            {featured && (
              <div
                className="bg-white border border-[#F3DEC8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() =>
                  onOpenContent?.(
                    'berita',
                    featured.id
                  )
                }
              >

                {getThumbnailUrl(featured.thumbnail) ? (
                  <img
                    src={getThumbnailUrl(featured.thumbnail)!}
                    alt={featured.title}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">
                      Tidak ada thumbnail
                    </span>
                  </div>
                )}

                <div className="p-6">

                  <div className="flex items-center gap-3 mb-3">

                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        categoryColors[featured.category] ??
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {featured.category}
                    </span>

                    <span className="text-xs text-gray-400">
                      {formatDate(
                        featured.published_at ??
                        featured.created_at
                      )}
                    </span>

                    <span className="text-xs bg-[#FEF0E4] text-[#F58220] font-semibold px-2 py-1 rounded-full">
                      Terbaru
                    </span>

                  </div>

                  <h2
                    className="text-xl font-bold text-gray-900 mb-3"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif"
                    }}
                  >
                    {featured.title}
                  </h2>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {featured.excerpt ||
                      'Tidak ada ringkasan berita.'}
                  </p>

                  <button
                    className="text-[#F58220] font-semibold text-sm hover:underline"
                    onClick={e => {
                      e.stopPropagation()

                      onOpenContent?.(
                        'berita',
                        featured.id
                      )
                    }}
                  >
                    Baca Selengkapnya →
                  </button>

                </div>

              </div>
            )}

            {/* Filter */}

            <div className="flex flex-wrap gap-3">

              {categories.map(category => (

                <button
                  key={category}
                  onClick={() =>
                    setActiveCategory(category)
                  }
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === category
                      ? 'bg-[#F58220] text-white'
                      : 'bg-white border border-[#F3DEC8] text-gray-600 hover:border-[#F58220] hover:text-[#F58220]'
                  }`}
                >
                  {category}
                </button>

              ))}

            </div>

            {/* News Grid */}

            {filtered.length === 0 ? (

              <div className="bg-white border border-[#F3DEC8] rounded-2xl p-10 text-center">

                <p className="text-gray-500">
                  Belum ada berita pada kategori ini.
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {filtered.map(news => {

                  const thumbnail =
                    getThumbnailUrl(
                      news.thumbnail
                    )

                  return (

                    <div
                      key={news.id}
                      className="bg-white border border-[#F3DEC8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                      onClick={() =>
                        onOpenContent?.(
                          'berita',
                          news.id
                        )
                      }
                    >

                      {thumbnail ? (

                        <img
                          src={thumbnail}
                          alt={news.title}
                          className="w-full h-44 object-cover"
                        />

                      ) : (

                        <div className="w-full h-44 bg-gray-100 flex items-center justify-center">

                          <span className="text-xs text-gray-400">
                            Tidak ada thumbnail
                          </span>

                        </div>

                      )}

                      <div className="p-4">

                        <div className="flex items-center gap-2 mb-2">

                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              categoryColors[
                                news.category
                              ] ??
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {news.category}
                          </span>

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
                              "'Plus Jakarta Sans', sans-serif"
                          }}
                        >
                          {news.title}
                        </h3>

                        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                          {news.excerpt ||
                            'Tidak ada ringkasan berita.'}
                        </p>

                        <button
                          className="text-[#F58220] font-semibold text-xs hover:underline"
                          onClick={e => {

                            e.stopPropagation()

                            onOpenContent?.(
                              'berita',
                              news.id
                            )

                          }}
                        >
                          Baca Selengkapnya →
                        </button>

                      </div>

                    </div>

                  )

                })}

              </div>

            )}

          </div>

          {/* Sidebar */}

          <div className="space-y-6">

            {/* Categories */}

            <div className="bg-white border border-[#F3DEC8] rounded-2xl p-6 shadow-sm">

              <h3
                className="font-bold text-gray-900 mb-4"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif"
                }}
              >
                Kategori
              </h3>

              <div className="space-y-2">

                {categories
                  .filter(c => c !== 'Semua')
                  .map(category => (

                    <button
                      key={category}
                      onClick={() =>
                        setActiveCategory(category)
                      }
                      className="flex items-center justify-between w-full px-3 py-2 rounded-xl hover:bg-[#FEF0E4] transition-colors group"
                    >

                      <span className="text-sm text-gray-600 group-hover:text-[#F58220]">
                        {category}
                      </span>

                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {
                          newsData.filter(
                            news =>
                              news.category ===
                              category
                          ).length
                        }
                      </span>

                    </button>

                  ))}

              </div>

            </div>

            {/* Latest News */}

            <div className="bg-white border border-[#F3DEC8] rounded-2xl p-6 shadow-sm">

              <h3
                className="font-bold text-gray-900 mb-4"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif"
                }}
              >
                Berita Terbaru
              </h3>

              <div className="space-y-4">

                {newsData
                  .slice(0, 4)
                  .map(news => {

                    const thumbnail =
                      getThumbnailUrl(
                        news.thumbnail
                      )

                    return (

                      <div
                        key={news.id}
                        className="flex gap-3 cursor-pointer group"
                        onClick={() =>
                          onOpenContent?.(
                            'berita',
                            news.id
                          )
                        }
                      >

                        {thumbnail ? (

                          <img
                            src={thumbnail}
                            alt={news.title}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                          />

                        ) : (

                          <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">

                            <span className="text-[10px] text-gray-400 text-center">
                              No Image
                            </span>

                          </div>

                        )}

                        <div>

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

                  })}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}