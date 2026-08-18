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
    return parts[0]
      .slice(0, 2)
      .toUpperCase()
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
      className={className}
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
    profile?.name || 'Tentang Kami'

  const logoUrl =
    getOrganizationLogoUrl(
      profile?.logo ?? null
    )

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8F2]">
        <div className="text-sm text-gray-500">
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
    <div className="min-h-screen bg-[#FFF8F2]">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] py-16 pt-32 text-white">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-3 text-sm opacity-80">
            <span>Beranda</span>

            <span className="mx-2">
              /
            </span>

            <span>Tentang Kami</span>
          </div>

          <div className="flex items-center gap-5">

            {logoUrl && (
              <div className="hidden h-20 w-20 items-center justify-center rounded-2xl bg-white p-3 sm:flex">
                <img
                  src={logoUrl}
                  alt={organizationName}
                  className="h-full w-full object-contain"
                />
              </div>
            )}

            <div>

              <h1
                className="text-3xl font-bold sm:text-4xl lg:text-5xl"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Tentang {organizationName}
              </h1>

              <p className="mt-4 max-w-2xl text-lg opacity-90">
                {profile?.tagline ||
                  'Lembaga yang amanah, transparan, dan berdampak.'}
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          DESKRIPSI
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-4xl">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#FEF0E4] px-4 py-1.5 text-sm font-semibold text-[#F58220]">
            Tentang Kami
          </div>

          <h2
            className="mb-6 text-3xl font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Tentang {organizationName}
          </h2>

          {profile?.description ? (
            <RichTextContent
              content={profile.description}
              className="leading-relaxed text-gray-600"
            />
          ) : (
            <p className="leading-relaxed text-gray-500">
              Deskripsi organisasi belum
              tersedia.
            </p>
          )}

        </div>

      </section>

      {/* =====================================================
          SEJARAH
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-4xl">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#FEF0E4] px-4 py-1.5 text-sm font-semibold text-[#F58220]">
            Sejarah Kami
          </div>

          <h2
            className="mb-6 text-3xl font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Perjalanan {organizationName}
          </h2>

          {profile?.history ? (
            <RichTextContent
              content={profile.history}
              className="leading-relaxed text-gray-600"
            />
          ) : (
            <p className="leading-relaxed text-gray-500">
              Informasi sejarah organisasi
              belum tersedia.
            </p>
          )}

        </div>

      </section>

      {/* =====================================================
          VISI & MISI
      ===================================================== */}

      <section className="bg-white py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-12 text-center">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#FEF0E4] px-4 py-1.5 text-sm font-semibold text-[#F58220]">
              Visi &amp; Misi
            </div>

            <h2
              className="text-3xl font-bold text-gray-900"
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Arah &amp; Tujuan Kami
            </h2>

          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

            {/* VISI */}

            <div className="rounded-2xl bg-gradient-to-br from-[#F58220] to-[#D96D0A] p-8 text-white">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">

                <svg
                  className="h-6 w-6 text-white"
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

              <h3
                className="mb-3 text-2xl font-bold"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Visi
              </h3>

              {profile?.vision ? (
                <RichTextContent
                  content={profile.vision}
                  className="leading-relaxed text-white/90"
                />
              ) : (
                <p className="leading-relaxed text-white/90">
                  Visi organisasi belum
                  tersedia.
                </p>
              )}

            </div>

            {/* MISI */}

            <div className="rounded-2xl border border-[#F3DEC8] bg-white p-8 shadow-sm">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FEF0E4]">

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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>

              </div>

              <h3
                className="mb-3 text-2xl font-bold text-gray-900"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Misi
              </h3>

              {profile?.mission ? (
                <RichTextContent
                  content={profile.mission}
                  className="leading-relaxed text-gray-600"
                />
              ) : (
                <p className="leading-relaxed text-gray-600">
                  Misi organisasi belum
                  tersedia.
                </p>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          STRUKTUR ORGANISASI
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        <div className="mb-12 text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#FEF0E4] px-4 py-1.5 text-sm font-semibold text-[#F58220]">
            Struktur Organisasi
          </div>

          <h2
            className="text-3xl font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Tim Pengurus {organizationName}
          </h2>

        </div>

        {members.length === 0 ? (
          <div className="rounded-2xl border border-[#F3DEC8] bg-white p-10 text-center shadow-sm">

            <p className="text-sm text-gray-500">
              Data struktur organisasi
              belum tersedia.
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
                  className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm transition-all hover:shadow-md"
                >

                  {/* CARD HEADER */}

                  <div
                    className="cursor-pointer select-none p-6 text-center"
                    onClick={() =>
                      toggleCard(person.id)
                    }
                    role="button"
                    tabIndex={0}
                    aria-expanded={
                      isExpanded
                    }
                    onKeyDown={(
                      event
                    ) => {
                      if (
                        event.key ===
                          'Enter' ||
                        event.key === ' '
                      ) {
                        event.preventDefault()

                        toggleCard(
                          person.id
                        )
                      }
                    }}
                  >

                    {/* FOTO */}

                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#F58220] to-[#D96D0A]">

                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={person.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span
                          className="text-lg font-bold text-white"
                          style={{
                            fontFamily:
                              "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {getInitials(
                            person.name
                          )}
                        </span>
                      )}

                    </div>

                    {/* JABATAN */}

                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#F58220]">
                      {person.position}
                    </div>

                    {/* NAMA */}

                    <div
                      className="mb-2 text-sm font-bold text-gray-900"
                      style={{
                        fontFamily:
                          "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {person.name}
                    </div>

                    {/* ARROW */}

                    <div
                      className={`mx-auto flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#F3DEC8] transition-transform duration-200 ${
                        isExpanded
                          ? 'rotate-180 border-[#F58220]'
                          : ''
                      }`}
                    >
                      <svg
                        className={`h-3 w-3 ${
                          isExpanded
                            ? 'text-[#F58220]'
                            : 'text-gray-400'
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

                  </div>

                  {/* DETAIL */}

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >

                    <div className="border-t border-[#F3DEC8] bg-[#FFF8F2] px-5 py-4">

                      <div className="mb-3 flex items-center gap-3">

                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#F58220] to-[#D96D0A]">

                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={person.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-bold text-white">
                              {getInitials(
                                person.name
                              )}
                            </span>
                          )}

                        </div>

                        <div>

                          <div
                            className="text-xs font-bold leading-tight text-gray-900"
                            style={{
                              fontFamily:
                                "'Plus Jakarta Sans', sans-serif",
                            }}
                          >
                            {person.name}
                          </div>

                          <div className="text-[10px] font-semibold text-[#F58220]">
                            {person.position}
                          </div>

                        </div>

                      </div>

                      {person.period && (
                        <div className="mb-3 flex items-center gap-2">

                          <svg
                            className="h-3.5 w-3.5 flex-shrink-0 text-gray-400"
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

                          <span className="text-xs text-gray-500">
                            Masa bakti:{' '}
                            <span className="font-semibold text-gray-700">
                              {person.period}
                            </span>
                          </span>

                        </div>
                      )}

                      {person.description && (
                        <p className="mb-3 whitespace-pre-line text-xs leading-relaxed text-gray-600">
                          {person.description}
                        </p>
                      )}

                      {person.email && (
                        <div className="mb-2 rounded-xl border border-[#F3DEC8] bg-white px-3 py-2">
                          <span className="text-xs text-gray-500">
                            Email:{' '}
                            {person.email}
                          </span>
                        </div>
                      )}

                      {person.phone && (
                        <div className="mb-3 rounded-xl border border-[#F3DEC8] bg-white px-3 py-2">
                          <span className="text-xs text-gray-500">
                            Telepon:{' '}
                            {person.phone}
                          </span>
                        </div>
                      )}

                      {!person.email &&
                        !person.phone && (
                          <div className="mb-3 flex items-center gap-2 rounded-xl border border-[#F3DEC8] bg-white px-3 py-2">

                            <svg
                              className="h-3.5 w-3.5 flex-shrink-0 text-[#F58220]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>

                            <span className="text-xs text-gray-500">
                              Hubungi via kantor{' '}
                              {organizationName}
                            </span>

                          </div>
                        )}

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(
                            null
                          )
                        }
                        className="flex w-full items-center justify-center gap-1 py-1 text-xs font-semibold text-gray-400 transition-colors hover:text-[#F58220]"
                      >
                        <span>×</span>
                        Tutup
                      </button>

                    </div>

                  </div>

                </div>
              )
            })}

          </div>
        )}

      </section>

    </div>
  )
}