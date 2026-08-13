'use client'

import { useEffect, useState } from 'react'
import type { NavPage } from '../../App'

import {
  getPublicNewsById,
  type News,
} from '../../service/news.service'

import {
  getPublicArticleById,
  type Article,
} from '../../service/article.service'

interface BacaPageProps {
  content: {
    type: 'berita' | 'artikel'
    id: number
  } | null

  onNavigate: (page: NavPage) => void
}

const catColors: Record<string, string> = {
  // Berita
  Kegiatan: 'bg-blue-100 text-blue-700',
  Pengumuman: 'bg-yellow-100 text-yellow-700',
  Laporan: 'bg-green-100 text-green-700',

  // Artikel
  Zakat: 'bg-blue-100 text-blue-700',
  Infaq: 'bg-green-100 text-green-700',
  Sedekah: 'bg-purple-100 text-purple-700',
  Wakaf: 'bg-orange-100 text-orange-700',
  Fiqih: 'bg-red-100 text-red-700',
  Inspirasi: 'bg-yellow-100 text-yellow-700',
}

type ContentData = News | Article

export default function BacaPage({
  content,
  onNavigate,
}: BacaPageProps) {
  const [contentData, setContentData] =
    useState<ContentData | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  /*
  |--------------------------------------------------------------------------
  | URL
  |--------------------------------------------------------------------------
  */

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : ''

  /*
  |--------------------------------------------------------------------------
  | Copy Link
  |--------------------------------------------------------------------------
  */

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      )

      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error(
        'Gagal menyalin link:',
        error
      )
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Ambil konten dari API
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadContent = async () => {
      if (!content) {
        setContentData(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        setContentData(null)

        /*
        |--------------------------------------------------------------------------
        | BERITA
        |--------------------------------------------------------------------------
        */

        if (content.type === 'berita') {
          const result =
            await getPublicNewsById(
              content.id
            )

          setContentData(result)

          return
        }

        /*
        |--------------------------------------------------------------------------
        | ARTIKEL
        |--------------------------------------------------------------------------
        */

        if (content.type === 'artikel') {
          const result =
            await getPublicArticleById(
              content.id
            )

          setContentData(result)

          return
        }
      } catch (err) {
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
        setLoading(false)
      }
    }

    loadContent()
  }, [content])

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#F58220] border-t-transparent" />

          <p className="text-sm text-gray-500">
            Memuat konten...
          </p>
        </div>
      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Content kosong
  |--------------------------------------------------------------------------
  */

  if (!content || !contentData) {
    const backPage =
      content?.type === 'artikel'
        ? 'artikel'
        : 'berita'

    return (
      <div className="min-h-screen bg-[#FFF8F2] pt-32 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-lg">
            {error || 'Konten tidak ditemukan.'}
          </p>

          <button
            type="button"
            onClick={() =>
              onNavigate(backPage)
            }
            className="mt-4 text-[#F58220] font-semibold hover:underline"
          >
            ← Kembali ke{' '}
            {backPage === 'artikel'
              ? 'Artikel'
              : 'Berita'}
          </button>
        </div>
      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Tipe konten
  |--------------------------------------------------------------------------
  */

  const isArticle =
    content.type === 'artikel'

  const contentLabel = isArticle
    ? 'Artikel'
    : 'Berita'

  /*
  |--------------------------------------------------------------------------
  | Thumbnail
  |--------------------------------------------------------------------------
  */

  const thumbnailUrl =
    contentData.thumbnail
      ? contentData.thumbnail.startsWith(
          'http'
        )
        ? contentData.thumbnail
        : `http://localhost:8000/storage/${contentData.thumbnail}`
      : null

  /*
  |--------------------------------------------------------------------------
  | Share
  |--------------------------------------------------------------------------
  */

  const shareText =
    `${contentData.title} - LAZISMU Pemalang`

  const handleShare = (
    platform:
      | 'whatsapp'
      | 'facebook'
      | 'twitter'
      | 'telegram'
  ) => {
    const encodedUrl =
      encodeURIComponent(currentUrl)

    const encodedText =
      encodeURIComponent(shareText)

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
  | Date
  |--------------------------------------------------------------------------
  */

  const formattedDate =
    contentData.published_at
      ? new Date(
          contentData.published_at
        ).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : new Date(
          contentData.created_at
        ).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

  return (
    <div className="min-h-screen bg-[#FFF8F2]">

      {/* ================================================================
          HERO
      ================================================================= */}

      <div className="pt-20">
        <div className="relative">

          {thumbnailUrl && (
            <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">

              <img
                src={thumbnailUrl}
                alt={contentData.title}
                className="
                  block
                  h-auto
                  max-h-[520px]
                  w-full
                  object-cover
                  object-center
                "
              />

            </div>
          )}

          {/* Overlay */}

          {thumbnailUrl && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-2xl" />
          )}

          {/* Hero content */}

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <div className="mx-auto max-w-5xl">

              <span
                className={`
                  inline-block
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  ${
                    catColors[
                      contentData.category
                    ] ??
                    'bg-gray-100 text-gray-700'
                  }
                `}
              >
                {contentData.category}
              </span>

              <h1
                className="
                  mt-3
                  text-2xl
                  font-bold
                  leading-tight
                  text-white
                  sm:text-4xl
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
      </div>

      {/* ================================================================
          CONTENT
      ================================================================= */}

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Back */}

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
            transition-colors
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

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">

          {/* ============================================================
              MAIN
          ============================================================ */}

          <div className="lg:col-span-2">

            {/* Meta */}

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

              {/* Category */}

              <div className="flex items-center gap-2">
                <span
                  className={`
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    ${
                      catColors[
                        contentData.category
                      ] ??
                      'bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  {contentData.category}
                </span>
              </div>

              {/* Date */}

              <div className="flex items-center gap-1">

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

              {/* Views */}

              <div className="flex items-center gap-1">

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
                  {contentData.views ?? 0}{' '}
                  kali dilihat
                </span>

              </div>

            </div>

            {/* Excerpt */}

            {contentData.excerpt && (
              <div className="mb-8 rounded-2xl border border-[#F3DEC8] bg-white p-6">

                <p className="text-base font-medium leading-relaxed text-gray-600">
                  {contentData.excerpt}
                </p>

              </div>
            )}

            {/* Body */}

          <article
  className="
    prose
    prose-gray
    max-w-none
    text-gray-700
    leading-8
    prose-headings:font-bold
    prose-headings:text-gray-900
    prose-a:text-[#F58220]
    prose-strong:text-gray-900
    prose-blockquote:border-[#F58220]
    prose-blockquote:text-gray-600
  "
  dangerouslySetInnerHTML={{
    __html: contentData.content,
  }}
/>

            {/* Share */}

            <div className="mt-10 border-t border-[#F3DEC8] pt-6">

              <p
                className="mb-4 text-sm font-bold text-gray-900"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Bagikan {contentLabel}
              </p>

              <div className="flex flex-wrap gap-3">

                {/* WhatsApp */}

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
                  💬 WhatsApp
                </button>

                {/* Facebook */}

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
                  📘 Facebook
                </button>

                {/* X */}

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
                  𝕏 Twitter
                </button>

                {/* Telegram */}

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
                  ✈️ Telegram
                </button>

                {/* Copy */}

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
          ============================================================ */}

          <div className="space-y-6">

            {/* Info */}

            <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Informasi {contentLabel}
              </p>

              <div className="space-y-4">

                <div>
                  <p className="text-xs text-gray-400">
                    Kategori
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {contentData.category}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Tanggal Publikasi
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {formattedDate}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Dilihat
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {contentData.views ??
                      0}{' '}
                    kali
                  </p>
                </div>

              </div>

            </div>

            {/* Category */}

            <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Kategori
              </p>

              <span
                className={`
                  inline-block
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  ${
                    catColors[
                      contentData.category
                    ] ??
                    'bg-gray-100 text-gray-700'
                  }
                `}
              >
                {contentData.category}
              </span>

            </div>

            {/* Back */}

            <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

              <p className="mb-3 text-sm font-bold text-gray-900">
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

          </div>

        </div>

      </div>

    </div>
  )
}