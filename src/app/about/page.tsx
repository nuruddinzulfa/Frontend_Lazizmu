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

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return (
    parts[0][0] + parts[1][0]
  ).toUpperCase()
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

        if (!mounted) return

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
        if (!mounted) return

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

      {/* HERO */}
      <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] text-white py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-sm mb-3 opacity-80">
            <span>Beranda</span>
            <span className="mx-2">/</span>
            <span>Tentang Kami</span>
          </div>

          <div className="flex items-center gap-5">
            {logoUrl && (
              <div className="hidden sm:flex w-20 h-20 rounded-2xl bg-white items-center justify-center p-3">
                <img
                  src={logoUrl}
                  alt={organizationName}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Tentang {organizationName}
              </h1>

              <p className="mt-4 text-lg opacity-90 max-w-2xl">
                {profile?.tagline ||
                  'Lembaga yang amanah, transparan, dan berdampak.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PROFIL */}
      {profile?.description && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#FEF0E4] text-[#F58220] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Tentang Kami
            </div>

            <h2
              className="text-3xl font-bold text-gray-900 mb-6"
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Mengenal {organizationName}
            </h2>

            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {profile.description}
            </p>
          </div>
        </div>
      )}

      {/* SEJARAH */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#FEF0E4] text-[#F58220] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Sejarah Kami
          </div>

          <h2
            className="text-3xl font-bold text-gray-900 mb-6"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Perjalanan {organizationName}
          </h2>

          <div className="whitespace-pre-line text-gray-600 leading-relaxed">
            {profile?.history || (
              <p>
                Informasi sejarah organisasi
                belum tersedia.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* VISI MISI */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#FEF0E4] text-[#F58220] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* VISI */}
            <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] rounded-2xl p-8 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
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
                className="text-2xl font-bold mb-3"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Visi
              </h3>

              <p className="whitespace-pre-line text-white/90 leading-relaxed">
                {profile?.vision ||
                  'Visi organisasi belum tersedia.'}
              </p>
            </div>

            {/* MISI */}
            <div className="bg-white border border-[#F3DEC8] rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-[#FEF0E4] rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#F58220]"
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
                className="text-2xl font-bold mb-3 text-gray-900"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Misi
              </h3>

              <div className="whitespace-pre-line text-gray-600 leading-relaxed">
                {profile?.mission || (
                  <p>
                    Misi organisasi belum tersedia.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STRUKTUR ORGANISASI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FEF0E4] text-[#F58220] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
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
              Data struktur organisasi belum
              tersedia.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                  className="bg-white border border-[#F3DEC8] rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* HEADER CARD */}
                  <div
                    className="p-6 text-center cursor-pointer select-none"
                    onClick={() =>
                      toggleCard(person.id)
                    }
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    onKeyDown={(event) => {
                      if (
                        event.key === 'Enter' ||
                        event.key === ' '
                      ) {
                        event.preventDefault()
                        toggleCard(person.id)
                      }
                    }}
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F58220] to-[#D96D0A] flex items-center justify-center mx-auto mb-4 overflow-hidden">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span
                          className="text-white font-bold text-lg"
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

                    <div className="text-xs font-semibold text-[#F58220] uppercase tracking-wide mb-1">
                      {person.position}
                    </div>

                    <div
                      className="font-bold text-gray-900 text-sm mb-2"
                      style={{
                        fontFamily:
                          "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {person.name}
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 border-[#F3DEC8] flex items-center justify-center mx-auto transition-transform duration-200 ${
                        isExpanded
                          ? 'rotate-180 border-[#F58220]'
                          : ''
                      }`}
                    >
                      <svg
                        className={`w-3 h-3 transition-colors ${
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
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F58220] to-[#D96D0A] flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold text-sm">
                              {getInitials(
                                person.name
                              )}
                            </span>
                          )}
                        </div>

                        <div>
                          <div
                            className="font-bold text-gray-900 text-xs leading-tight"
                            style={{
                              fontFamily:
                                "'Plus Jakarta Sans', sans-serif",
                            }}
                          >
                            {person.name}
                          </div>

                          <div className="text-[10px] text-[#F58220] font-semibold">
                            {person.position}
                          </div>
                        </div>
                      </div>

                      {person.period && (
                        <div className="flex items-center gap-2 mb-3">
                          <svg
                            className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
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
                        <p className="text-xs text-gray-600 leading-relaxed mb-3 whitespace-pre-line">
                          {person.description}
                        </p>
                      )}

                      {person.email && (
                        <div className="bg-white border border-[#F3DEC8] rounded-xl px-3 py-2 mb-2">
                          <span className="text-xs text-gray-500">
                            Email: {person.email}
                          </span>
                        </div>
                      )}

                      {person.phone && (
                        <div className="bg-white border border-[#F3DEC8] rounded-xl px-3 py-2 mb-3">
                          <span className="text-xs text-gray-500">
                            Telepon:{' '}
                            {person.phone}
                          </span>
                        </div>
                      )}

                      {!person.email &&
                        !person.phone && (
                          <div className="flex items-center gap-2 bg-white border border-[#F3DEC8] rounded-xl px-3 py-2 mb-3">
                            <svg
                              className="w-3.5 h-3.5 text-[#F58220] flex-shrink-0"
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
                          setExpandedId(null)
                        }
                        className="w-full text-xs font-semibold text-gray-400 hover:text-[#F58220] transition-colors py-1 flex items-center justify-center gap-1"
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
      </div>
    </div>
  )
}