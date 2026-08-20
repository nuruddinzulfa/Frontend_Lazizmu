'use client'

import { useEffect, useState } from 'react'

import type { NavPage } from '../../App'

import API_URL from '../../lib/api'

import {
  getPublicNewsById,
  type News,
} from '../../service/news.service'

import {
  getPublicArticleById,
  type Article,
} from '../../service/article.service'

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

interface BacaPageProps {
  content: {
    type: 'berita' | 'artikel'
    id: number
  } | null

  onNavigate: (page: NavPage) => void
}

type ContentData = News | Article

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

/**
 * Mengubah path thumbnail dari Laravel
 * menjadi URL yang dapat digunakan browser.
 */
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

  const cleanThumbnail =
    thumbnail.replace(
      /^\/?(storage\/)?/,
      ''
    )

  const backendUrl =
    API_URL.replace(
      /\/api\/?$/,
      ''
    )

  return `${backendUrl}/storage/${cleanThumbnail}`
}

/**
 * Format tanggal ke Bahasa Indonesia.
 */
function formatDate(
  date: string | null | undefined
): string {
  if (!date) {
    return '-'
  }

  const parsedDate = new Date(date)

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return '-'
  }

  return parsedDate.toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  )
}

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function BacaPage({
  content,
  onNavigate,
}: BacaPageProps) {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [
    contentData,
    setContentData,
  ] =
    useState<ContentData | null>(
      null
    )

  const [
    loading,
    setLoading,
  ] =
    useState(true)

  const [
    error,
    setError,
  ] =
    useState('')

  const [
    copied,
    setCopied,
  ] =
    useState(false)

  /*
  |--------------------------------------------------------------------------
  | LOAD CONTENT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true

    async function loadContent() {
      if (!content) {
        setContentData(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        setContentData(null)

        let result:
          | News
          | Article

        if (
          content.type ===
          'berita'
        ) {
          result =
            await getPublicNewsById(
              content.id
            )
        } else {
          result =
            await getPublicArticleById(
              content.id
            )
        }

        if (!mounted) {
          return
        }

        setContentData(result)
      } catch (err) {
        if (!mounted) {
          return
        }

        console.error(
          'Gagal mengambil detail konten:',
          err
        )

        setContentData(null)

        setError(
          err instanceof Error
            ? err.message
            : 'Gagal mengambil konten.'
        )
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadContent()

    return () => {
      mounted = false
    }
  }, [content])

  /*
  |--------------------------------------------------------------------------
  | COPY LINK
  |--------------------------------------------------------------------------
  */

  const handleCopyLink =
    async () => {
      try {
        await navigator.clipboard.writeText(
          window.location.href
        )

        setCopied(true)

        window.setTimeout(() => {
          setCopied(false)
        }, 2000)
      } catch (err) {
        console.error(
          'Gagal menyalin link:',
          err
        )
      }
    }

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#FFF8F2]
          px-4
          pt-32
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              mb-4
              h-8
              w-8
              animate-spin
              rounded-full
              border-4
              border-[#F58220]
              border-t-transparent
            "
          />

          <p className="text-sm text-gray-500">
            Memuat konten...
          </p>
        </div>
      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR / EMPTY
  |--------------------------------------------------------------------------
  */

  if (
    !content ||
    !contentData
  ) {
    const backPage:
      | 'berita'
      | 'artikel' =
      content?.type ===
      'artikel'
        ? 'artikel'
        : 'berita'

    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#FFF8F2]
          px-4
          pt-32
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-2xl
            border
            border-[#F3DEC8]
            bg-white
            p-8
            text-center
            shadow-sm
          "
        >
          <h2
            className="
              mb-2
              text-xl
              font-bold
              text-gray-900
            "
          >
            Konten Tidak Tersedia
          </h2>

          <p className="text-sm text-gray-500">
            {error ||
              'Konten tidak ditemukan.'}
          </p>

          <button
            type="button"
            onClick={() =>
              onNavigate(
                backPage
              )
            }
            className="
              mt-5
              font-semibold
              text-[#F58220]
              hover:underline
            "
          >
            ← Kembali ke{' '}
            {backPage ===
            'artikel'
              ? 'Artikel'
              : 'Berita'}
          </button>
        </div>
      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | CONTENT VARIABLES
  |--------------------------------------------------------------------------
  */

  const isArticle =
    content.type ===
    'artikel'

  const contentLabel =
    isArticle
      ? 'Artikel'
      : 'Berita'

  const thumbnailUrl =
    getThumbnailUrl(
      contentData.thumbnail
    )

  const formattedDate =
    formatDate(
      contentData.published_at ??
        contentData.created_at
    )

  const currentUrl =
    typeof window !==
    'undefined'
      ? window.location.href
      : ''

  const shareText =
    `${contentData.title} - Lazismu Pemalang`

  /*
  |--------------------------------------------------------------------------
  | SHARE
  |--------------------------------------------------------------------------
  */

  const handleShare = (
    platform:
      | 'whatsapp'
      | 'facebook'
      | 'twitter'
      | 'telegram'
  ) => {
    const encodedUrl =
      encodeURIComponent(
        currentUrl
      )

    const encodedText =
      encodeURIComponent(
        shareText
      )

    let shareUrl = ''

    switch (platform) {
      case 'whatsapp':
        shareUrl =
          `https://wa.me/?text=${encodedText}%20${encodedUrl}`
        break

      case 'facebook':
        shareUrl =
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break

      case 'twitter':
        shareUrl =
          `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break

      case 'telegram':
        shareUrl =
          `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
        break
    }

    window.open(
      shareUrl,
      '_blank',
      'noopener,noreferrer'
    )
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="
        min-h-screen
        bg-[#FFF8F2]
      "
    >

      {/* ================================================================
          HERO
      ================================================================= */}

      <section className="pt-24">
        <div
          className="
            mx-auto
            max-w-6xl
            px-4
            sm:px-6
            lg:px-8
          "
        >

          {thumbnailUrl ? (
            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-[#F3DEC8]
                bg-white
                shadow-sm
              "
            >

              <img
                src={thumbnailUrl}
                alt={contentData.title}
                className="
                  block
                  max-h-[520px]
                  w-full
                  object-cover
                  object-center
                "
              />

              {/* OVERLAY */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/75
                  via-black/20
                  to-transparent
                "
              />

              {/* TITLE */}

              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  p-6
                  sm:p-10
                "
              >
                <div className="max-w-4xl">

                  <h1
                    className="
                      text-2xl
                      font-bold
                      leading-tight
                      text-white
                      sm:text-4xl
                      lg:text-5xl
                    "
                    style={{
                      fontFamily:
                        "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {contentData.title}
                  </h1>

                </div>
              </div>
            </div>
          ) : (
            <div
              className="
                rounded-2xl
                bg-gradient-to-br
                from-[#F58220]
                to-[#D96D0A]
                p-8
                text-white
                sm:p-12
              "
            >

              <h1
                className="
                  text-2xl
                  font-bold
                  leading-tight
                  sm:text-4xl
                  lg:text-5xl
                "
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {contentData.title}
              </h1>

            </div>
          )}

        </div>
      </section>

      {/* ================================================================
          CONTENT
      ================================================================= */}

      <main
        className="
          mx-auto
          max-w-6xl
          px-4
          py-10
          sm:px-6
          lg:px-8
        "
      >

        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            onNavigate(
              isArticle
                ? 'artikel'
                : 'berita'
            )
          }
          className="
            mb-8
            flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-[#F58220]
            transition
            hover:text-[#D96D0A]
          "
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>

          Kembali ke {contentLabel}
        </button>

        <div
          className="
            grid
            grid-cols-1
            gap-10
            lg:grid-cols-3
          "
        >

          {/* ============================================================
              MAIN CONTENT
          ============================================================= */}

          <div className="lg:col-span-2">

            {/* META */}

            <div
              className="
                mb-8
                flex
                flex-wrap
                items-center
                gap-4
                border-b
                border-[#F3DEC8]
                pb-6
                text-sm
                text-gray-400
              "
            >

              {/* DATE */}

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                "
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>

                <span>
                  {formattedDate}
                </span>
              </div>

              {/* VIEWS */}

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                "
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>

                <span>
                  {contentData.views ??
                    0}{' '}
                  kali dilihat
                </span>
              </div>

            </div>

            {/* ==========================================================
                EXCERPT
            =========================================================== */}

            {contentData.excerpt && (
              <div
                className="
                  mb-8
                  rounded-2xl
                  border
                  border-[#F3DEC8]
                  bg-white
                  p-6
                  shadow-sm
                "
              >
                <p
                  className="
                    text-base
                    font-medium
                    leading-relaxed
                    text-gray-600
                  "
                >
                  {contentData.excerpt}
                </p>
              </div>
            )}

            {/* ==========================================================
                BODY
            =========================================================== */}

            <article
              className="
                prose
                prose-gray
                max-w-none
                leading-8
                text-gray-700
                prose-headings:font-bold
                prose-headings:text-gray-900
                prose-a:text-[#F58220]
                prose-strong:text-gray-900
                prose-blockquote:border-[#F58220]
                prose-blockquote:text-gray-600
              "
              dangerouslySetInnerHTML={{
                __html:
                  contentData.content,
              }}
            />

            {/* ==========================================================
                SHARE
            =========================================================== */}

            <div
              className="
                mt-10
                border-t
                border-[#F3DEC8]
                pt-6
              "
            >

              <p
                className="
                  mb-4
                  text-sm
                  font-bold
                  text-gray-900
                "
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Bagikan {contentLabel}
              </p>

              <div
                className="
                  flex
                  flex-wrap
                  gap-3
                "
              >

                {/* WHATSAPP */}

                <button
                  type="button"
                  onClick={() =>
                    handleShare(
                      'whatsapp'
                    )
                  }
                  className="
                    rounded-xl
                    bg-green-500
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    text-white
                    transition
                    hover:opacity-90
                  "
                >
                  WhatsApp
                </button>

                {/* FACEBOOK */}

                <button
                  type="button"
                  onClick={() =>
                    handleShare(
                      'facebook'
                    )
                  }
                  className="
                    rounded-xl
                    bg-blue-600
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    text-white
                    transition
                    hover:opacity-90
                  "
                >
                  Facebook
                </button>

                {/* TWITTER */}

                <button
                  type="button"
                  onClick={() =>
                    handleShare(
                      'twitter'
                    )
                  }
                  className="
                    rounded-xl
                    bg-gray-800
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    text-white
                    transition
                    hover:opacity-90
                  "
                >
                  X / Twitter
                </button>

                {/* TELEGRAM */}

                <button
                  type="button"
                  onClick={() =>
                    handleShare(
                      'telegram'
                    )
                  }
                  className="
                    rounded-xl
                    bg-sky-500
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    text-white
                    transition
                    hover:opacity-90
                  "
                >
                  Telegram
                </button>

                {/* COPY LINK */}

                <button
                  type="button"
                  onClick={
                    handleCopyLink
                  }
                  className="
                    rounded-xl
                    border
                    border-[#F3DEC8]
                    bg-white
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    text-gray-700
                    transition
                    hover:bg-orange-50
                    hover:text-[#F58220]
                  "
                >
                  {copied
                    ? '✓ Link Disalin'
                    : '🔗 Salin Link'}
                </button>

              </div>
            </div>

          </div>

          {/* ============================================================
              SIDEBAR
          ============================================================= */}

          <aside
            className="
              space-y-6
            "
          >

            {/* INFORMATION */}

            <div
              className="
                rounded-2xl
                border
                border-[#F3DEC8]
                bg-white
                p-5
                shadow-sm
              "
            >

              <p
                className="
                  mb-4
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-gray-400
                "
              >
                Informasi {contentLabel}
              </p>

              <div className="space-y-4">

                {/* DATE */}

                <div>
                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    Tanggal Publikasi
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-semibold
                      text-gray-800
                    "
                  >
                    {formattedDate}
                  </p>
                </div>

                {/* VIEWS */}

                <div>
                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    Dilihat
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-semibold
                      text-gray-800
                    "
                  >
                    {contentData.views ??
                      0}{' '}
                    kali
                  </p>
                </div>

              </div>
            </div>

            {/* OTHER CONTENT */}

            <div
              className="
                rounded-2xl
                border
                border-[#F3DEC8]
                bg-white
                p-5
                shadow-sm
              "
            >

              <p
                className="
                  mb-3
                  text-sm
                  font-bold
                  text-gray-900
                "
              >
                Ingin membaca{' '}
                {isArticle
                  ? 'artikel'
                  : 'berita'}{' '}
                lainnya?
              </p>

              <button
                type="button"
                onClick={() =>
                  onNavigate(
                    isArticle
                      ? 'artikel'
                      : 'berita'
                  )
                }
                className="
                  w-full
                  rounded-xl
                  bg-[#F58220]
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-orange-600
                "
              >
                Lihat Semua{' '}
                {contentLabel}
              </button>

            </div>

          </aside>

        </div>
      </main>
    </div>
  )
}