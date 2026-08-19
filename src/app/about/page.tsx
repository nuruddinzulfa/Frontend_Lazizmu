'use client'

import { useEffect, useState } from 'react'

import {
  getPublicOrganizationProfile,
  getOrganizationLogoUrl,
  type OrganizationProfile,
} from '../../service/organization-profile.service'

import {
  getPublicOrganizationMembers,
  getOrganizationMemberPhotoUrl,
  type OrganizationMember,
} from '../../service/organization-member.service'

function getInitials(name: string) {
  const parts = name
    .replace(/[^a-zA-Z\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) {
    return '?'
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return (
    parts[0][0] +
    parts[1][0]
  ).toUpperCase()
}

function RichTextContent({
  content,
  className = '',
}: {
  content: string | null | undefined
  className?: string
}) {
  if (!content) {
    return null
  }

  return (
    <div
      className={`
        ${className}
        [&_p]:mb-4
        [&_strong]:font-bold
        [&_em]:italic
        [&_u]:underline
        [&_ul]:my-4
        [&_ul]:list-disc
        [&_ul]:pl-6
        [&_ol]:my-4
        [&_ol]:list-decimal
        [&_ol]:pl-6
        [&_li]:mb-2
        [&_h1]:mb-4
        [&_h1]:text-2xl
        [&_h1]:font-bold
        [&_h2]:mb-4
        [&_h2]:text-xl
        [&_h2]:font-bold
        [&_h3]:mb-3
        [&_h3]:text-lg
        [&_h3]:font-bold
        [&_a]:text-[#F58220]
        [&_a]:underline
      `}
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  )
}

export default function AboutPage() {
  const [profile, setProfile] =
    useState<OrganizationProfile | null>(null)

  const [members, setMembers] =
    useState<OrganizationMember[]>([])

  const [expandedId, setExpandedId] =
    useState<number | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadAboutData() {
      try {
        setLoading(true)
        setError(null)

        const [
          profileData,
          memberData,
        ] = await Promise.all([
          getPublicOrganizationProfile(),
          getPublicOrganizationMembers(),
        ])

        if (!mounted) {
          return
        }

        setProfile(profileData)

        setMembers(
          [...memberData].sort(
            (a, b) =>
              a.sort_order -
              b.sort_order ||
              a.id - b.id
          )
        )
      } catch (err) {
        if (!mounted) {
          return
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Gagal mengambil informasi organisasi.'
        )
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadAboutData()

    return () => {
      mounted = false
    }
  }, [])

  const toggleCard = (id: number) => {
    setExpandedId((prev) =>
      prev === id ? null : id
    )
  }

  const organizationName =
    profile?.name || 'LAZISMU Kabupaten Pemalang'

  const logoUrl =
    getOrganizationLogoUrl(
      profile?.logo ?? null
    )

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8F2]">
        <div className="rounded-full border border-[#F3DEC8] bg-white px-5 py-3 text-sm text-gray-500 shadow-sm">
          Memuat informasi organisasi...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8F2] px-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          {error}
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#FFF8F2]">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#F58220] to-[#E96F0A]">

        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />

        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full border border-white/10" />

        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full border border-white/10" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-12 pt-24 sm:px-6 sm:pb-14 sm:pt-28 lg:px-8">

          {/* Breadcrumb */}

          <div className="mb-8 flex items-center gap-2 text-sm text-white/80">
            <span>Beranda</span>
            <span>/</span>
            <span className="font-medium text-white">
              Tentang Kami
            </span>
          </div>


          {/* Hero content */}

          <div className="grid items-center gap-8 md:grid-cols-[0.95fr_1.05fr]">

            {/* LOGO */}

            <div className="relative">

              <div className="absolute -inset-4 rounded-[32px] bg-white/10 blur-2xl" />

              <div className="relative flex h-[190px] items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-white p-8 shadow-2xl sm:h-[230px]">

                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={organizationName}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="text-sm text-gray-400">
                    Logo organisasi
                  </div>
                )}

              </div>

            </div>


            {/* TEXT */}

            <div className="text-white">

              <div className="mb-4 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur-sm">
                Tentang Kami
              </div>

              <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl lg:text-[46px]">
                {organizationName}
              </h1>

              <div className="mt-5 h-1 w-14 rounded-full bg-white/80" />

              <p className="mt-5 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
                {profile?.tagline ||
                  'Lembaga Amil Zakat, Infak, dan Sedekah Muhammadiyah Kabupaten Pemalang'}
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          TENTANG KAMI
      ===================================================== */}

      <section className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">

        <div className="pointer-events-none absolute -right-32 top-0 h-72 w-72 rounded-full bg-[#F58220]/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl">

          <div className="rounded-3xl border border-[#F3DEC8] bg-white p-7 shadow-sm sm:p-10">

            <div className="mb-4 inline-flex rounded-full bg-[#FEF0E4] px-4 py-1.5 text-sm font-semibold text-[#F58220]">
              Tentang Kami
            </div>

            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Tentang {organizationName}
            </h2>

            <div className="mt-4 h-1 w-14 rounded-full bg-[#F58220]" />

            <div className="mt-7 max-w-5xl">

              {profile?.description ? (
                <RichTextContent
                  content={profile.description}
                  className="text-base leading-8 text-gray-600"
                />
              ) : (
                <p className="text-gray-500">
                  Deskripsi organisasi belum tersedia.
                </p>
              )}

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          SEJARAH
      ===================================================== */}

      <section className="relative overflow-hidden bg-white px-4 py-12 sm:px-6 lg:px-8">

        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-[#F58220]/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl">

          <div className="grid gap-8 md:grid-cols-[100px_1fr]">

            {/* Decorative timeline */}

            <div className="hidden md:flex justify-center">

              <div className="relative">

                <div className="absolute left-1/2 top-10 h-[calc(100%-40px)] w-px -translate-x-1/2 bg-gradient-to-b from-[#F58220] to-[#F58220]/10" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F58220] text-white shadow-lg shadow-orange-200">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 2"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      strokeWidth={2}
                    />
                  </svg>
                </div>

              </div>

            </div>


            {/* History card */}

            <div className="rounded-3xl border border-[#F3DEC8] bg-[#FFF8F2] p-7 sm:p-10">

              <div className="mb-4 inline-flex rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[#F58220] shadow-sm">
                Sejarah Kami
              </div>

              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Perjalanan {organizationName}
              </h2>

              <div className="mt-4 h-1 w-14 rounded-full bg-[#F58220]" />

              <div className="mt-7 max-w-5xl">

                {profile?.history ? (
                  <RichTextContent
                    content={profile.history}
                    className="text-base leading-8 text-gray-600"
                  />
                ) : (
                  <p className="text-gray-500">
                    Informasi sejarah organisasi
                    belum tersedia.
                  </p>
                )}

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          VISI & MISI
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#FFF8F2] px-4 py-14 sm:px-6 lg:px-8">

        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#F58220]/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl">

          <div className="mb-9 text-center">

            <div className="mb-4 inline-flex rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[#F58220] shadow-sm">
              Visi &amp; Misi
            </div>

            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Arah &amp; Tujuan Kami
            </h2>

            <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-[#F58220]" />

          </div>


          <div className="grid gap-7 md:grid-cols-2">

            {/* VISI */}

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F58220] to-[#D96D0A] p-8 text-white shadow-lg">

              <div className="pointer-events-none absolute -right-10 -top-10 text-[160px] font-black leading-none text-white/5">
                “
              </div>

              <div className="relative z-10">

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">

                  <svg
                    className="h-6 w-6"
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
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>

                </div>

                <h3 className="mb-4 text-2xl font-bold">
                  Visi
                </h3>

                {profile?.vision ? (
                  <RichTextContent
                    content={profile.vision}
                    className="leading-8 text-white/90"
                  />
                ) : (
                  <p className="text-white/80">
                    Visi organisasi belum tersedia.
                  </p>
                )}

              </div>

            </div>


            {/* MISI */}

            <div className="relative overflow-hidden rounded-3xl border border-[#F3DEC8] bg-white p-8 shadow-sm">

              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F58220]/5" />

              <div className="relative z-10">

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FEF0E4]">

                  <svg
                    className="h-6 w-6 text-[#F58220]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5a3 3 0 006 0"
                    />
                  </svg>

                </div>

                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Misi
                </h3>

                {profile?.mission ? (
                  <RichTextContent
                    content={profile.mission}
                    className="leading-8 text-gray-600"
                  />
                ) : (
                  <p className="text-gray-500">
                    Misi organisasi belum tersedia.
                  </p>
                )}

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          STRUKTUR ORGANISASI
      ===================================================== */}

      <section className="relative overflow-hidden bg-white px-4 py-14 sm:px-6 lg:px-8">

        {/* Pattern */}

        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(#F58220 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl">

          <div className="mb-9 text-center">

            <div className="mb-4 inline-flex rounded-full bg-[#FEF0E4] px-4 py-1.5 text-sm font-semibold text-[#F58220]">
              Struktur Organisasi
            </div>

            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Tim Pengurus {organizationName}
            </h2>

            <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-[#F58220]" />

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500">
              Tim yang menjalankan amanah dan
              pelayanan organisasi.
            </p>

          </div>


          {members.length === 0 ? (

            <div className="rounded-3xl border border-[#F3DEC8] bg-white p-10 text-center shadow-sm">

              <p className="text-sm text-gray-500">
                Data struktur organisasi belum
                tersedia.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">

              {members.map((person) => {

                const isExpanded =
                  expandedId === person.id

                const photoUrl =
                  getOrganizationMemberPhotoUrl(
                    person.photo
                  )

                return (
                  <div
                    key={person.id}
                    className="overflow-hidden rounded-3xl border border-[#F3DEC8] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >

                    {/* CARD */}

                    <button
                      type="button"
                      onClick={() =>
                        toggleCard(person.id)
                      }
                      className="w-full p-6 text-center"
                      aria-expanded={
                        isExpanded
                      }
                    >

                      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#FEF0E4] ring-4 ring-white shadow-md">

                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt={person.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-bold text-[#F58220]">
                            {getInitials(
                              person.name
                            )}
                          </span>
                        )}

                      </div>

                      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#F58220]">
                        {person.position}
                      </div>

                      <div className="text-base font-bold text-gray-900">
                        {person.name}
                      </div>

                      <div className="mx-auto mt-4 flex h-7 w-7 items-center justify-center rounded-full border border-[#F3DEC8] bg-[#FFF8F2]">

                        <svg
                          className={`h-3.5 w-3.5 text-[#F58220] transition-transform ${
                            isExpanded
                              ? 'rotate-180'
                              : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>

                      </div>

                    </button>


                    {/* DETAIL */}

                    <div
                      className={`grid transition-all duration-300 ${
                        isExpanded
                          ? 'grid-rows-[1fr]'
                          : 'grid-rows-[0fr]'
                      }`}
                    >

                      <div className="overflow-hidden">

                        <div className="border-t border-[#F3DEC8] bg-[#FFF8F2] px-5 py-4">

                          {person.period && (
                            <div className="mb-3 text-xs text-gray-500">
                              Masa bakti:{' '}
                              <span className="font-semibold text-gray-700">
                                {person.period}
                              </span>
                            </div>
                          )}

                          {person.description && (
                            <p className="text-xs leading-6 text-gray-600">
                              {person.description}
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(
                                null
                              )
                            }
                            className="mt-4 w-full text-xs font-semibold text-gray-400 hover:text-[#F58220]"
                          >
                            Tutup
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>
                )
              })}

            </div>

          )}

        </div>

      </section>

    </main>
  )
}