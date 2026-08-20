import { useEffect, useMemo, useState } from 'react'
import type { NavPage } from '../../App'
import API_URL from "@/lib/api";
import {
  getPublicArticles,
  type Article,
} from '../../service/article.service'

interface ArtikelPageProps {
  onNavigate?: (page: NavPage) => void
  onOpenContent?: (
    type: 'berita' | 'artikel',
    id: number
  ) => void
}

const categories = [
  'Semua',
  'Zakat',
  'Infaq',
  'Sedekah',
  'Wakaf',
  'Fiqih',
  'Inspirasi',
]

const catColors: Record<string, string> = {
  Zakat: 'bg-blue-100 text-blue-700',
  Infaq: 'bg-green-100 text-green-700',
  Sedekah: 'bg-purple-100 text-purple-700',
  Wakaf: 'bg-orange-100 text-orange-700',
  Fiqih: 'bg-red-100 text-red-700',
  Inspirasi: 'bg-yellow-100 text-yellow-700',
}

/*
|--------------------------------------------------------------------------
| Helper
|--------------------------------------------------------------------------
*/

/**
 * Format tanggal dari backend menjadi:
 * 20 Januari 2025
 */
function formatDate(date: string | null): string {
  if (!date) {
    return '-'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return parsedDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Estimasi waktu baca berdasarkan jumlah kata.
 *
 * Rata-rata membaca:
 * ±200 kata/menit
 */
function getReadTime(content: string): string {
  if (!content) {
    return ''
  }

  const plainText = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const wordCount = plainText
    ? plainText.split(' ').length
    : 0

  const minutes = Math.max(
    1,
    Math.ceil(wordCount / 200)
  )

  return `${minutes} menit`
}

/**
 * Thumbnail bisa berupa:
 *
 * 1. URL lengkap
 * 2. path storage seperti:
 *    articles/xxxxx.png
 *
 * Kalau backend sudah mengembalikan URL lengkap,
 * langsung digunakan.
 */
function getThumbnailUrl(
  thumbnail: string | null
): string {
  if (!thumbnail) {
    return ''
  }

  if (
    thumbnail.startsWith('http://') ||
    thumbnail.startsWith('https://')
  ) {
    return thumbnail
  }

  const backendUrl = API_URL.replace(
    /\/api\/?$/,
    ''
  )

  return `${backendUrl}/storage/${thumbnail}`
}

export default function ArtikelPage({
  onOpenContent,
}: ArtikelPageProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [activeCategory, setActiveCategory] =
    useState('Semua')

  const [search, setSearch] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /*
  |--------------------------------------------------------------------------
  | GET PUBLIC ARTICLES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false

    const loadArticles = async () => {
      try {
        setLoading(true)
        setError('')

        const data =
          await getPublicArticles()

        if (!cancelled) {
          setArticles(data)
        }
      } catch (err) {
        console.error(
          'Gagal mengambil artikel:',
          err
        )

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Gagal mengambil artikel.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadArticles()

    return () => {
      cancelled = true
    }
  }, [])

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filteredArticles = useMemo(() => {
    const keyword =
      search.trim().toLowerCase()

    return articles.filter((article) => {
      const matchCategory =
        activeCategory === 'Semua' ||
        article.category === activeCategory

      const matchSearch =
        !keyword ||
        article.title
          .toLowerCase()
          .includes(keyword) ||
        (article.excerpt ?? '')
          .toLowerCase()
          .includes(keyword)

      return (
        matchCategory &&
        matchSearch
      )
    })
  }, [
    articles,
    activeCategory,
    search,
  ])

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-[#FFF8F2]">

      {/* ================================================================
          HERO
      ================================================================= */}

      <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] text-white py-16 pt-32">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-sm mb-3 opacity-80">
            <span>Beranda</span>

            <span className="mx-2">
              /
            </span>

            <span>Artikel</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Artikel Islami
          </h1>

          <p className="mt-4 text-lg opacity-90 max-w-2xl">
            Perkaya pengetahuan Islam Anda
            tentang zakat, infaq, sedekah,
            dan wakaf.
          </p>

        </div>
      </div>


      {/* ================================================================
          CONTENT
      ================================================================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ================================================================
            SEARCH
        ================================================================= */}

        <div className="relative max-w-lg mb-8">

          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
            placeholder="Cari artikel..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#F3DEC8] rounded-xl text-sm focus:outline-none focus:border-[#F58220] shadow-sm"
          />

        </div>


        {/* ================================================================
            CATEGORY FILTER
        ================================================================= */}

        <div className="flex flex-wrap gap-3 mb-8">

          {categories.map((category) => (
            <button
              key={category}
              type="button"
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


        {/* ================================================================
            LOADING
        ================================================================= */}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white border border-[#F3DEC8] rounded-2xl overflow-hidden shadow-sm animate-pulse"
              >

                <div className="w-full h-48 bg-gray-200" />

                <div className="p-5">

                  <div className="w-20 h-5 bg-gray-200 rounded-full mb-4" />

                  <div className="w-full h-5 bg-gray-200 rounded mb-2" />

                  <div className="w-4/5 h-5 bg-gray-200 rounded mb-4" />

                  <div className="w-full h-4 bg-gray-200 rounded mb-2" />

                  <div className="w-3/4 h-4 bg-gray-200 rounded" />

                </div>

              </div>
            ))}

          </div>
        )}


        {/* ================================================================
            ERROR
        ================================================================= */}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}


        {/* ================================================================
            ARTICLE GRID
        ================================================================= */}

        {!loading &&
          !error &&
          filteredArticles.length > 0 && (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredArticles.map(
                (article) => {

                  const thumbnail =
                    getThumbnailUrl(
                      article.thumbnail
                    )

                  return (
                    <div
                      key={article.id}
                      className="bg-white border border-[#F3DEC8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer"
                      onClick={() =>
                        onOpenContent?.(
                          'artikel',
                          article.id
                        )
                      }
                    >

                      {/* ==================================================
                          THUMBNAIL
                      ================================================== */}

                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={article.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-[#FEF0E4] flex items-center justify-center">

                          <svg
                            className="w-12 h-12 text-[#F58220]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM8 7h8M8 11h8M8 15h5"
                            />
                          </svg>

                        </div>
                      )}


                      {/* ==================================================
                          ARTICLE BODY
                      ================================================== */}

                      <div className="p-5 flex flex-col flex-1">

                        {/* Category */}

                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full self-start mb-3 ${
                            catColors[
                              article.category
                            ] ??
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {article.category}
                        </span>


                        {/* Title */}

                        <h3
                          className="font-bold text-gray-900 mb-2 leading-snug"
                          style={{
                            fontFamily:
                              "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {article.title}
                        </h3>


                        {/* Excerpt */}

                        <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-3">
                          {article.excerpt ??
                            'Baca artikel selengkapnya untuk mengetahui informasi lebih lanjut.'}
                        </p>


                        {/* Meta */}

                        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">

                          <div className="flex items-center gap-2">

                            <div className="w-5 h-5 rounded-full bg-[#FEF0E4] flex items-center justify-center">

                              <svg
                                className="w-3 h-3 text-[#F58220]"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
                              </svg>

                            </div>

                            <span>
                              Lazismu Pemalang
                            </span>

                          </div>


                          <div className="flex items-center gap-2">

                            <span>
                              {formatDate(
                                article.published_at
                              )}
                            </span>

                            <span>
                              ·
                            </span>

                            <span>
                              {getReadTime(
                                article.content
                              )}
                            </span>

                          </div>

                        </div>


                        {/* Read More */}

                        <button
                          type="button"
                          className="mt-3 text-[#F58220] font-semibold text-xs hover:underline text-left"
                          onClick={(e) => {
                            e.stopPropagation()

                            onOpenContent?.(
                              'artikel',
                              article.id
                            )
                          }}
                        >
                          Baca Selengkapnya →
                        </button>

                      </div>

                    </div>
                  )
                }
              )}

            </div>
          )}


        {/* ================================================================
            EMPTY
        ================================================================= */}

        {!loading &&
          !error &&
          filteredArticles.length === 0 && (

            <div className="text-center py-16 text-gray-400">

              <svg
                className="w-12 h-12 mx-auto mb-4 opacity-40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <p>
                {search
                  ? 'Artikel tidak ditemukan.'
                  : 'Belum ada artikel yang dipublikasikan.'}
              </p>

            </div>
          )}

      </div>
    </div>
  )
}