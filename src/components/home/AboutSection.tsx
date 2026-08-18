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

import { useInView } from '../../hooks/useInView'
import type { NavPage } from '../../App'

interface AboutSectionProps {
  onNavigate: (page: NavPage) => void
}

/*
|--------------------------------------------------------------------------
| DATA MILESTONE
|--------------------------------------------------------------------------
| Tetap digunakan karena API OrganizationProfile saat ini belum
| menyediakan field milestone/timeline.
|--------------------------------------------------------------------------
*/

const milestones = [
  {
    year: '2002',
    label: 'Didirikan PP. Muhammadiyah',
    icon: '',
  },
  {
    year: '2002',
    label: 'SK Menag No. 457 — LAZNAS Nasional',
    icon: '',
  },
  {
    year: '2016',
    label: 'SK Menag No. 730 — Dikukuhkan kembali',
    icon: '',
  },
  {
    year: '2022',
    label: 'SK Menag No. 90 — Perpanjangan izin',
    icon: '',
  },
]

/*
|--------------------------------------------------------------------------
| ABOUT SECTION
|--------------------------------------------------------------------------
*/

export default function AboutSection({
  onNavigate,
}: AboutSectionProps) {
  const { inView, ref } = useInView()
  const { inView: inView2, ref: ref2 } = useInView()

  /*
  |--------------------------------------------------------------------------
  | PROFILE STATE
  |--------------------------------------------------------------------------
  */

  const [profile, setProfile] =
    useState<OrganizationProfile | null>(null)

  const [profileLoading, setProfileLoading] =
    useState(true)

  const [profileError, setProfileError] =
    useState(false)

  /*
  |--------------------------------------------------------------------------
  | LOAD ORGANIZATION PROFILE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      try {
        setProfileLoading(true)
        setProfileError(false)

        const data =
          await getPublicOrganizationProfile()

        if (!mounted) {
          return
        }

        setProfile(data)
      } catch (error) {
        console.error(
          'Gagal mengambil profil organisasi:',
          error
        )

        if (!mounted) {
          return
        }

        setProfileError(true)
        setProfile(null)
      } finally {
        if (mounted) {
          setProfileLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      mounted = false
    }
  }, [])

  /*
  |--------------------------------------------------------------------------
  | PROFILE IMAGE
  |--------------------------------------------------------------------------
  */

  const logoUrl = profile
    ? getOrganizationLogoUrl(profile.logo)
    : null

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section
      id="about"
      className="py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================================================================
            TENTANG KAMI
        ================================================================ */}

        <div
          ref={
            ref as React.RefObject<HTMLDivElement>
          }
          className={`
            grid grid-cols-1 lg:grid-cols-2
            gap-16 items-center mb-24
            transition-all duration-700
            ${
              inView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }
          `}
        >

          {/* ============================================================
              VISUAL
          ============================================================ */}

          <div className="relative">

            <div
              className="
                relative rounded-3xl
                overflow-hidden aspect-[4/3]
                bg-orange-50
              "
            >

              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={
                    profile?.name ||
                    'Logo organisasi'
                  }
                  className="
                    w-full h-full
                    object-contain
                    p-10
                    bg-white
                  "
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1708481686679-1bfebe1afefc?w=800&h=600&fit=crop&auto=format"
                  alt="LAZISMU"
                  className="
                    w-full h-full
                    object-cover
                  "
                />
              )}

              <div
                className="
                  absolute inset-0
                  bg-gradient-to-t
                  from-[#F58220]/40
                  to-transparent
                  pointer-events-none
                "
              />

            </div>

            {/* BADGE */}

            <div
              className="
                absolute -bottom-6
                -right-4 sm:-right-8
                bg-white
                rounded-2xl
                shadow-xl
                border border-[#F3DEC8]
                p-5
                max-w-[220px]
              "
            >

              <div
                className="
                  text-3xl font-bold
                  text-[#F58220]
                  mb-1
                "
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                20+
              </div>

              <div
                className="
                  text-xs
                  text-gray-500
                  leading-snug
                "
              >
                Tahun melayani umat
                dan masyarakat Indonesia
              </div>

            </div>

            {/* DECORATION */}

            <div
              className="
                absolute -top-6 -left-6
                w-24 h-24
                rounded-2xl
                opacity-20
              "
              style={{
                backgroundImage:
                  'radial-gradient(circle, #F58220 1.5px, transparent 1.5px)',
                backgroundSize: '8px 8px',
              }}
            />

          </div>

          {/* ============================================================
              TEXT
          ============================================================ */}

          <div>

            <span
              className="
                text-[#F58220]
                text-sm
                font-semibold
                uppercase
                tracking-wider
              "
            >
              Tentang Kami
            </span>

            <h2
              className="
                text-3xl sm:text-4xl
                font-bold
                text-gray-900
                mt-2 mb-5
                leading-tight
              "
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >

              {profile?.name || 'LAZISMU'}

              <br />

              <span className="orange-gradient-text">
                {profile?.tagline ||
                  'yang Amanah & Terpercaya'}
              </span>

            </h2>

            {/* ========================================================
                LOADING
            ======================================================== */}

            {profileLoading && (
              <div
                className="
                  space-y-3
                  text-gray-400
                  text-sm
                "
              >
                <div>
                  Memuat informasi
                  Tentang Kami...
                </div>
              </div>
            )}

            {/* ========================================================
                ERROR
            ======================================================== */}

            {!profileLoading &&
              profileError && (
                <div
                  className="
                    rounded-xl
                    bg-red-50
                    border border-red-100
                    p-4
                    text-sm
                    text-red-500
                  "
                >
                  Data Tentang Kami
                  gagal dimuat.
                </div>
              )}

            {/* ========================================================
                PROFILE DATA
            ======================================================== */}

            {!profileLoading &&
              !profileError &&
              profile && (
                <div
                  className="
                    space-y-4
                    text-gray-500
                    text-sm
                    leading-relaxed
                  "
                >

                  {/* DESCRIPTION */}

                  {profile.description && (
                    <div
                      className="
                        prose prose-sm
                        max-w-none
                        text-gray-500
                      "
                      dangerouslySetInnerHTML={{
                        __html:
                          profile.description,
                      }}
                    />
                  )}

                  {/* HISTORY */}

                  {profile.history && (
                    <div
                      className="
                        prose prose-sm
                        max-w-none
                        text-gray-500
                      "
                      dangerouslySetInnerHTML={{
                        __html:
                          profile.history,
                      }}
                    />
                  )}

                </div>
              )}

            {/* ========================================================
                EMPTY
            ======================================================== */}

            {!profileLoading &&
              !profileError &&
              !profile && (
                <p
                  className="
                    text-sm
                    text-gray-400
                  "
                >
                  Informasi Tentang Kami
                  belum tersedia.
                </p>
              )}

            {/* ========================================================
                MILESTONE
            ======================================================== */}

            <div
              className="
                mt-8
                grid grid-cols-2
                gap-3
              "
            >

              {milestones.map((milestone) => (
                <div
                  key={
                    milestone.year +
                    milestone.label
                  }
                  className="
                    flex items-start
                    gap-3
                    p-3
                    rounded-xl
                    bg-[#FFF8F2]
                    border
                    border-[#F3DEC8]
                  "
                >

                  <span
                    className="
                      text-xl
                      flex-shrink-0
                    "
                  >
                    {milestone.icon}
                  </span>

                  <div>

                    <div
                      className="
                        text-xs
                        font-bold
                        text-[#F58220]
                      "
                      style={{
                        fontFamily:
                          "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {milestone.year}
                    </div>

                    <div
                      className="
                        text-xs
                        text-gray-500
                        leading-snug
                        mt-0.5
                      "
                    >
                      {milestone.label}
                    </div>

                  </div>

                </div>
              ))}

            </div>

            {/* BUTTON */}

            <button
              onClick={() =>
                onNavigate('about')
              }
              className="
                mt-8
                btn-primary
                px-7 py-3
                text-sm
                font-semibold
              "
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Selengkapnya Tentang Kami →
            </button>

          </div>

        </div>

        {/* ================================================================
            DIVIDER
        ================================================================ */}

        <div
          className="
            border-t
            border-[#F3DEC8]
            mb-20
          "
        />

        {/* ================================================================
            VISI & MISI
        ================================================================ */}

        <div
          ref={
            ref2 as React.RefObject<HTMLDivElement>
          }
          className={`
            transition-all duration-700 delay-100
            ${
              inView2
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }
          `}
        >

          {/* HEADER */}

          <div className="text-center mb-12">

            <span
              className="
                text-[#F58220]
                text-sm
                font-semibold
                uppercase
                tracking-wider
              "
            >
              Arah & Tujuan
            </span>

            <h2
              className="
                text-3xl sm:text-4xl
                font-bold
                text-gray-900
                mt-2
              "
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Visi dan Misi LAZISMU
            </h2>

          </div>

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
              gap-8
            "
          >

            {/* ==========================================================
                VISI
            ========================================================== */}

            <div
              className="
                relative
                overflow-hidden
                rounded-3xl
                bg-gradient-to-br
                from-[#F58220]
                to-[#D96D0A]
                p-10
              "
            >

              <div
                className="
                  absolute
                  top-0 right-0
                  w-40 h-40
                  opacity-10
                  pointer-events-none
                "
              >

                <svg
                  viewBox="0 0 160 160"
                  fill="none"
                >
                  <polygon
                    points="
                      80,8
                      152,44
                      152,116
                      80,152
                      8,116
                      8,44
                    "
                    stroke="white"
                    strokeWidth="1.5"
                    fill="none"
                  />

                  <polygon
                    points="
                      80,28
                      132,56
                      132,104
                      80,132
                      28,104
                      28,56
                    "
                    stroke="white"
                    strokeWidth="1"
                    fill="none"
                  />

                  <circle
                    cx="80"
                    cy="80"
                    r="28"
                    stroke="white"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>

              </div>

              <div className="relative z-10">

                <div
                  className="
                    w-14 h-14
                    rounded-2xl
                    bg-white/20
                    flex items-center
                    justify-center
                    mb-6
                  "
                >
                  <svg
                    className="
                      w-7 h-7
                      text-white
                    "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="
                        M15 12a3 3 0 11-6 0
                        3 3 0 016 0z
                      "
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="
                        M2.458 12C3.732 7.943
                        7.523 5 12 5
                        c4.478 0 8.268 2.943
                        9.542 7
                        -1.274 4.057
                        -5.064 7
                        -9.542 7
                        -4.477 0
                        -8.268-2.943
                        -9.542-7z
                      "
                    />
                  </svg>
                </div>

                <div
                  className="
                    text-white/70
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                    mb-3
                  "
                >
                  Visi
                </div>

                {profileLoading ? (
                  <p
                    className="
                      text-white/70
                      text-sm
                    "
                  >
                    Memuat visi...
                  </p>
                ) : (
                  <div
                    className="
                      prose prose-invert
                      max-w-none
                      text-white
                      text-lg
                      sm:text-xl
                      leading-relaxed
                    "
                    dangerouslySetInnerHTML={{
                      __html:
                        profile?.vision ||
                        '<p>Visi belum tersedia.</p>',
                    }}
                  />
                )}

              </div>

            </div>

            {/* ==========================================================
                MISI
            ========================================================== */}

            <div
              className="
                rounded-3xl
                bg-[#FFF8F2]
                border
                border-[#F3DEC8]
                p-10
              "
            >

              <div
                className="
                  w-14 h-14
                  rounded-2xl
                  bg-[#FEF0E4]
                  flex items-center
                  justify-center
                  mb-6
                "
              >

                <svg
                  className="
                    w-7 h-7
                    text-[#F58220]
                  "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="
                      M9 5H7a2 2 0 00-2 2v12
                      a2 2 0 002 2h10
                      a2 2 0 002-2V7
                      a2 2 0 00-2-2h-2
                      M9 5a2 2 0 002 2h2
                      a2 2 0 002-2
                      M9 5a2 2 0 012-2h2
                      a2 2 0 012 2
                      m-6 9l2 2 4-4
                    "
                  />
                </svg>

              </div>

              <div
                className="
                  text-[#F58220]
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wider
                  mb-3
                "
              >
                Misi
              </div>

              <h3
                className="
                  text-xl
                  font-bold
                  text-gray-800
                  mb-6
                "
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Misi Kami
              </h3>

              {profileLoading ? (
                <p
                  className="
                    text-sm
                    text-gray-400
                  "
                >
                  Memuat misi...
                </p>
              ) : (
                <div
                  className="
                    prose
                    prose-sm
                    max-w-none
                    text-gray-600
                  "
                  dangerouslySetInnerHTML={{
                    __html:
                      profile?.mission ||
                      '<p>Misi belum tersedia.</p>',
                  }}
                />
              )}

              {/* NILAI */}

              <div
                className="
                  mt-8
                  flex flex-wrap
                  gap-2
                "
              >
                {[
                  'Amanah',
                  'Profesional',
                  'Transparan',
                  'Inovatif',
                  'Produktif',
                ].map((value) => (
                  <span
                    key={value}
                    className="
                      px-3 py-1.5
                      rounded-full
                      bg-white
                      border
                      border-[#F3DEC8]
                      text-[#F58220]
                      text-xs
                      font-semibold
                    "
                  >
                    {value}
                  </span>
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* ================================================================
            DIVIDER
        ================================================================ */}

        <div
          className="
            border-t
            border-[#F3DEC8]
            mb-20
            mt-4
          "
        />

        {/* ================================================================
            STRUKTUR ORGANISASI
        ================================================================ */}

        <OrgChart
          onNavigate={onNavigate}
        />

      </div>
    </section>
  )
}

/*
|--------------------------------------------------------------------------
| ORGANIZATION CHART
|--------------------------------------------------------------------------
*/

function OrgChart({
  onNavigate,
}: {
  onNavigate: (page: NavPage) => void
}) {
  const { inView, ref } = useInView()

  const [members, setMembers] =
    useState<OrganizationMember[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState(false)

  /*
  |--------------------------------------------------------------------------
  | LOAD ORGANIZATION MEMBERS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true

    async function loadMembers() {
      try {
        setLoading(true)
        setError(false)

        const data =
          await getPublicOrganizationMembers()

        if (!mounted) {
          return
        }

        setMembers(data)
      } catch (error) {
        console.error(
          'Gagal mengambil struktur organisasi:',
          error
        )

        if (!mounted) {
          return
        }

        setError(true)
        setMembers([])
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadMembers()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div
      ref={
        ref as React.RefObject<HTMLDivElement>
      }
      className={`
        transition-all duration-700 delay-100
        ${
          inView
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }
      `}
    >

      {/* ==============================================================
          HEADER
      ============================================================== */}

      <div className="text-center mb-12">

        <span
          className="
            text-[#F58220]
            text-sm
            font-semibold
            uppercase
            tracking-wider
          "
        >
          Kepengurusan
        </span>

        <h2
          className="
            text-3xl sm:text-4xl
            font-bold
            text-gray-900
            mt-2
          "
          style={{
            fontFamily:
              "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Struktur Organisasi
        </h2>

        <p
          className="
            text-gray-400
            text-sm
            mt-3
          "
        >
          Data pengurus terbaru
        </p>

      </div>

      {/* ==============================================================
          LOADING
      ============================================================== */}

      {loading && (
        <div
          className="
            bg-white
            border
            border-[#F3DEC8]
            rounded-2xl
            p-10
            text-center
          "
        >
          <p
            className="
              text-sm
              text-gray-400
            "
          >
            Memuat data struktur
            organisasi...
          </p>
        </div>
      )}

      {/* ==============================================================
          ERROR
      ============================================================== */}

      {!loading && error && (
        <div
          className="
            bg-white
            border
            border-red-100
            rounded-2xl
            p-10
            text-center
          "
        >
          <p
            className="
              text-sm
              text-red-500
            "
          >
            Data struktur organisasi
            gagal dimuat.
          </p>
        </div>
      )}

      {/* ==============================================================
          EMPTY
      ============================================================== */}

      {!loading &&
        !error &&
        members.length === 0 && (
          <div
            className="
              bg-white
              border
              border-[#F3DEC8]
              rounded-2xl
              p-10
              text-center
            "
          >
            <p
              className="
                text-sm
                text-gray-400
              "
            >
              Data struktur organisasi
              belum tersedia.
            </p>
          </div>
        )}

      {/* ==============================================================
          MEMBERS
      ============================================================== */}

      {!loading &&
        !error &&
        members.length > 0 && (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-5
            "
          >

            {members.map((person) => {
              const photoUrl =
                getOrganizationMemberPhotoUrl(
                  person.photo
                )

              return (
                <div
                  key={person.id}
                  className="
                    bg-white
                    border-2
                    border-[#F3DEC8]
                    hover:border-[#F58220]
                    rounded-2xl
                    p-5
                    shadow-sm
                    transition-all
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                    "
                  >

                    {/* FOTO */}

                    <div
                      className="
                        w-14 h-14
                        rounded-full
                        bg-[#FEF0E4]
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                        overflow-hidden
                      "
                    >

                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={person.name}
                          className="
                            w-full
                            h-full
                            object-cover
                          "
                        />
                      ) : (
                        <span
                          className="
                            text-[#F58220]
                            font-bold
                            text-lg
                          "
                        >
                          {person.name
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      )}

                    </div>

                    {/* INFORMASI */}

                    <div className="min-w-0">

                      <div
                        className="
                          font-bold
                          text-gray-900
                        "
                        style={{
                          fontFamily:
                            "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {person.name}
                      </div>

                      <div
                        className="
                          text-sm
                          font-semibold
                          text-[#F58220]
                          mt-1
                        "
                      >
                        {person.position}
                      </div>

                      {person.period && (
                        <div
                          className="
                            text-xs
                            text-gray-400
                            mt-2
                          "
                        >
                          Periode {person.period}
                        </div>
                      )}

                    </div>

                  </div>

                </div>
              )
            })}

          </div>
        )}

      {/* ==============================================================
          BUTTON
      ============================================================== */}

      <div
        className="
          text-center
          mt-10
        "
      >

        <button
          onClick={() =>
            onNavigate('about')
          }
          className="
            border-2
            border-[#F58220]
            text-[#F58220]
            hover:bg-[#F58220]
            hover:text-white
            transition-all
            duration-200
            px-8 py-3
            rounded-xl
            font-semibold
            text-sm
          "
        >
          Lihat Profil Lengkap →
        </button>

      </div>

    </div>
  )
}