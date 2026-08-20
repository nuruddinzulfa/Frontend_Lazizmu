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
  onNavigate: (
    page: NavPage,
    sectionId?: string
  ) => void
}

/*
|--------------------------------------------------------------------------
| DATA MILESTONE
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
  const { inView: inView2, ref: ref2 } =
    useInView()

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
      className="
    relative
    overflow-hidden
    bg-[#FFF8F2]
    py-20
  "
    >
      {/* ================================================================
          BACKGROUND DECORATION
      ================================================================ */}

      {/* Orange glow kiri atas */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-40
          -top-40
          h-[420px]
          w-[420px]
          rounded-full
          bg-[#F58220]/10
          blur-3xl
        "
      />

      {/* Orange glow kanan bawah */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-40
          h-[460px]
          w-[460px]
          rounded-full
          bg-[#F58220]/10
          blur-3xl
        "
      />

      {/* Pattern titik kiri */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-6
          top-24
          h-32
          w-32
          opacity-30
        "
        style={{
          backgroundImage:
            'radial-gradient(circle, #F58220 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />

      {/* Pattern titik kanan bawah */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-24
          right-8
          h-36
          w-36
          opacity-20
        "
        style={{
          backgroundImage:
            'radial-gradient(circle, #F58220 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />

      {/* Lingkaran dekoratif kanan atas */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          top-16
          h-48
          w-48
          rounded-full
          border
          border-[#F58220]/10
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-8
          top-24
          h-24
          w-24
          rounded-full
          border
          border-[#F58220]/10
        "
      />

      {/* Lingkaran kecil */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[30%]
          left-[5%]
          h-5
          w-5
          rounded-full
          bg-[#F58220]/10
        "
      />
      <div
        className="
    relative
    z-10
    mx-auto
    max-w-7xl
    px-4
    sm:px-6
    lg:px-8
  "
      >

        {/* ================================================================
            TENTANG KAMI
        ================================================================ */}

        <div
          ref={
            ref as React.RefObject<HTMLDivElement>
          }
          className={`
            grid
            grid-cols-1
            items-center
            gap-16
            lg:grid-cols-2
            mb-24
            transition-all
            duration-700
            ${inView
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
            }
          `}
        >

          {/* ============================================================
              VISUAL
          ============================================================ */}

          <div className="relative">

            <div
              className="
                relative
                aspect-[4/3]
                overflow-hidden
                rounded-3xl
                bg-orange-50
              "
            >

              {/* ========================================================
                  LOGO ORGANISASI
              ======================================================== */}

              {profileLoading ? (
                <div
                  className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    bg-white
                  "
                >
                  <div
                    className="
                      text-sm
                      text-gray-400
                    "
                  >
                    Memuat logo...
                  </div>
                </div>
              ) : logoUrl ? (
                <img
                  src={logoUrl}
                  alt={
                    profile?.name ||
                    'Logo organisasi'
                  }
                  className="
                    h-full
                    w-full
                    bg-white
                    object-contain
                    p-10
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    bg-white
                  "
                >
                  <div
                    className="
                      text-sm
                      text-gray-400
                    "
                  >
                    Logo belum tersedia
                  </div>
                </div>
              )}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#F58220]/40
                  to-transparent
                "
              />

            </div>

            {/* BADGE */}

            <div
              className="
                absolute
                -bottom-25
                -right-4
                max-w-[220px]
                rounded-2xl
                border
                border-[#F3DEC8]
                bg-white
                p-5
                shadow-xl
                sm:-right-8
              "
            >

              <div
                className="
                  mb-1
                  text-3xl
                  font-bold
                  text-[#F58220]
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
                  leading-snug
                  text-gray-500
                "
              >
                Tahun melayani umat dan
                masyarakat Indonesia
              </div>

            </div>

            {/* DECORATION */}

            <div
              className="
                absolute
                -left-6
                -top-6
                h-24
                w-24
                rounded-2xl
                opacity-20
              "
              style={{
                backgroundImage:
                  'radial-gradient(circle, #F58220 1.5px, transparent 1.5px)',
                backgroundSize:
                  '10px 10px',
              }}
            />

          </div>

          {/* ============================================================
              CONTENT
          ============================================================ */}

          <div>

            <span
              className="
                text-sm
                font-semibold
                uppercase
                tracking-wider
                text-[#F58220]
              "
            >
              Tentang Kami
            </span>

            <h2
              className="
                mt-2
                mb-5
                text-3xl
                font-bold
                leading-tight
                text-gray-900
                sm:text-4xl
              "
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {profile?.name || 'Lazismu'}

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
                  text-sm
                  text-gray-400
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
                    border
                    border-red-100
                    bg-red-50
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
                    text-sm
                    leading-relaxed
                    text-gray-500
                  "
                >

                  {profile.description && (
                    <div
                      className="
                        prose
                        prose-sm
                        max-w-none
                        text-gray-500
                      "
                      dangerouslySetInnerHTML={{
                        __html:
                          profile.description,
                      }}
                    />
                  )}

                  {profile.history && (
                    <div
                      className="
                        prose
                        prose-sm
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
                grid
                grid-cols-2
                gap-3
              "
            >

              {milestones.map(
                (milestone) => (
                  <div
                    key={
                      milestone.year +
                      milestone.label
                    }
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-xl
                      border
                      border-[#F3DEC8]
                      bg-[#FFF8F2]
                      p-3
                    "
                  >

                    <span
                      className="
                        flex-shrink-0
                        text-xl
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
                          mt-0.5
                          text-xs
                          leading-snug
                          text-gray-500
                        "
                      >
                        {milestone.label}
                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

            {/* BUTTON */}

            <button
              type="button"
              onClick={() =>
                onNavigate('about')
              }
              className="
                btn-primary
                mt-8
                px-7
                py-3
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
            mb-20
            border-t
            border-[#F3DEC8]
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
    transition-all
    delay-100
    duration-700
    ${
      inView2
        ? 'translate-y-0 opacity-100'
        : 'translate-y-8 opacity-0'
    }
  `}
>
  {/* HEADER */}

  <div className="mb-12 text-center">
    <span
      className="
        text-sm
        font-semibold
        uppercase
        tracking-wider
        text-[#F58220]
      "
    >
      Arah & Tujuan
    </span>

    <h2
      className="
        mt-2
        text-3xl
        font-bold
        text-gray-900
        sm:text-4xl
      "
      style={{
        fontFamily:
          "'Plus Jakarta Sans', sans-serif",
      }}
    >
      Visi dan Misi Lazismu
    </h2>
  </div>

  {/* VISI & MISI */}

  <div
    className="
      grid
      grid-cols-1
      items-start
      gap-8
      lg:grid-cols-2
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
      {/* DECORATION */}

      <div
        className="
          pointer-events-none
          absolute
          right-0
          top-0
          h-40
          w-40
          opacity-10
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

      {/* CONTENT */}

      <div className="relative z-10">
        {/* ICON */}

        <div
          className="
            mb-6
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-white/20
          "
        >
          <svg
            className="h-7 w-7 text-white"
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

        {/* LABEL */}

        <div
          className="
            mb-3
            text-sm
            font-semibold
            uppercase
            tracking-wider
            text-white/70
          "
        >
          Visi
        </div>

        {/* VISION */}

        {profileLoading ? (
          <p className="text-sm text-white/70">
            Memuat visi...
          </p>
        ) : (
          <div
            className="
              prose
              prose-invert
              max-w-none
              text-lg
              leading-relaxed
              text-white
              sm:text-xl
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
        border
        border-[#F3DEC8]
        bg-[#FFF8F2]
        p-10
      "
    >
      {/* ICON */}

      <div
        className="
          mb-6
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-[#FEF0E4]
        "
      >
        <svg
          className="
            h-7
            w-7
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
              a2 2 0 002 2h10a2 2 0 002-2V7
              a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2
              a2 2 0 002-2M9 5a2 2 0 012-2h2
              a2 2 0 012 2m-6 9l2 2 4-4
            "
          />
        </svg>
      </div>

      {/* LABEL */}

      <div
        className="
          mb-3
          text-sm
          font-semibold
          uppercase
          tracking-wider
          text-[#F58220]
        "
      >
        Misi
      </div>

      {/* TITLE */}

      <h3
        className="
          mb-6
          text-xl
          font-bold
          text-gray-800
        "
        style={{
          fontFamily:
            "'Plus Jakarta Sans', sans-serif",
        }}
      >
        Misi Kami
      </h3>

      {/* MISSION */}

      {profileLoading ? (
        <p className="text-sm text-gray-400">
          Memuat misi...
        </p>
      ) : (
        <div
          className="
            prose
            prose-sm
            max-w-none
            text-gray-600
            [&_ol]:list-decimal
            [&_ol]:pl-6
            [&_ol]:space-y-3
            [&_ul]:list-disc
            [&_ul]:pl-6
            [&_ul]:space-y-3
            [&_li]:pl-1
            [&_p]:mb-3
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
          flex
          flex-wrap
          gap-2
        "
      >
        {[
          'Amanah',
          'Transparansi',
          'Profesional',
          'Berkemajuan',
          'Layanan',
        ].map((value) => (
          <span
            key={value}
            className="
              rounded-full
              border
              border-[#F3DEC8]
              bg-white
              px-3
              py-1.5
              text-xs
              font-semibold
              text-[#F58220]
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
            mb-20
            mt-4
            border-t
            border-[#F3DEC8]
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
  onNavigate: (
    page: NavPage,
    sectionId?: string
  ) => void
}) {
  const { inView, ref } = useInView()

  const [members, setMembers] =
    useState<OrganizationMember[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState(false)

  const [expandedId, setExpandedId] =
    useState<number | null>(null)

  const [profile, setProfile] =
    useState<OrganizationProfile | null>(null)

  const organizationName =
    profile?.name || 'Lazismu'

  /*
  |--------------------------------------------------------------------------
  | LOAD MEMBERS
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

        setMembers(
          [...data].sort(
            (a, b) =>
              a.sort_order - b.sort_order ||
              a.id - b.id
          )
        )
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

  /*
  |--------------------------------------------------------------------------
  | LOAD ORGANIZATION PROFILE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      try {
        const data =
          await getPublicOrganizationProfile()

        if (mounted) {
          setProfile(data)
        }
      } catch (error) {
        console.error(
          'Gagal mengambil profil organisasi:',
          error
        )
      }
    }

    loadProfile()

    return () => {
      mounted = false
    }
  }, [])

  /*
  |--------------------------------------------------------------------------
  | TOGGLE CARD
  |--------------------------------------------------------------------------
  */

  const toggleCard = (id: number) => {
    setExpandedId((prev) =>
      prev === id ? null : id
    )
  }

  /*
  |--------------------------------------------------------------------------
  | PREVIEW MEMBERS
  |--------------------------------------------------------------------------
  */

  const previewMembers =
    members.slice(0, 3)

  return (
    <section
      id="struktur-organisasi"
      ref={
        ref as React.RefObject<HTMLDivElement>
      }
      className={`
        scroll-mt-24
        transition-all
        delay-100
        duration-700
        ${inView
          ? 'translate-y-0 opacity-100'
          : 'translate-y-8 opacity-0'
        }
      `}
    >

      {/* HEADER */}

      <div className="mb-12 text-center">

        <div
          className="
            mb-4
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-[#FEF0E4]
            px-4
            py-1.5
            text-sm
            font-semibold
            text-[#F58220]
          "
        >
          Struktur Organisasi
        </div>

        <h2
          className="
            text-3xl
            font-bold
            text-gray-900
          "
          style={{
            fontFamily:
              "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Badan Pengelola {organizationName}
        </h2>

      </div>

      {/* LOADING */}

      {loading ? (
        <div
          className="
            rounded-2xl
            border
            border-[#F3DEC8]
            bg-white
            p-10
            text-center
          "
        >
          <p className="text-sm text-gray-400">
            Memuat struktur organisasi...
          </p>
        </div>
      ) : error ? (

        /* ERROR */

        <div
          className="
            rounded-2xl
            border
            border-red-100
            bg-red-50
            p-10
            text-center
          "
        >
          <p className="text-sm text-red-500">
            Struktur organisasi gagal dimuat.
          </p>
        </div>

      ) : members.length === 0 ? (

        /* EMPTY */

        <div
          className="
            rounded-2xl
            border
            border-[#F3DEC8]
            bg-white
            p-10
            text-center
            shadow-sm
          "
        >
          <p className="text-sm text-gray-500">
            Data struktur organisasi
            belum tersedia.
          </p>
        </div>

      ) : (

        /* MEMBERS */

        <>
          <div
            className="
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              md:grid-cols-3
            "
          >

            {previewMembers.map(
              (person) => {
                const isExpanded =
                  expandedId === person.id

                const photoUrl =
                  getOrganizationMemberPhotoUrl(
                    person.photo
                  )

                return (
                  <div
                    key={person.id}
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[#F3DEC8]
                      bg-white
                      shadow-sm
                      transition-all
                      hover:shadow-md
                    "
                  >

                    {/* CARD HEADER */}

                    <div
                      className="
                        cursor-pointer
                        select-none
                        p-6
                        text-center
                      "
                      onClick={() =>
                        toggleCard(
                          person.id
                        )
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

                      <div
                        className="
                          mx-auto
                          mb-4
                          flex
                          h-16
                          w-16
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-full
                          bg-gradient-to-br
                          from-[#F58220]
                          to-[#D96D0A]
                        "
                      >

                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt={
                              person.name
                            }
                            className="
                              h-full
                              w-full
                              object-cover
                            "
                          />
                        ) : (
                          <span
                            className="
                              text-lg
                              font-bold
                              text-white
                            "
                            style={{
                              fontFamily:
                                "'Plus Jakarta Sans', sans-serif",
                            }}
                          >
                            {person.name
                              .trim()
                              .split(/\s+/)
                              .slice(0, 2)
                              .map(
                                (
                                  part
                                ) =>
                                  part[0]
                              )
                              .join('')
                              .toUpperCase()}
                          </span>
                        )}

                      </div>

                      {/* JABATAN */}

                      <div
                        className="
                          mb-1
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-[#F58220]
                        "
                      >
                        {
                          person.position
                        }
                      </div>

                      {/* NAMA */}

                      <div
                        className="
                          mb-2
                          text-sm
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

                      {/* ARROW */}

                      <div
                        className={`
                          mx-auto
                          flex
                          h-6
                          w-6
                          items-center
                          justify-center
                          rounded-full
                          border-2
                          border-[#F3DEC8]
                          text-[#F58220]
                          transition-transform
                          duration-200
                          ${isExpanded
                            ? 'rotate-180'
                            : ''
                          }
                        `}
                      >
                        ↓
                      </div>

                    </div>

                    {/* DETAIL */}

                    {isExpanded && (
                      <div
                        className="
                          border-t
                          border-[#F3DEC8]
                          bg-[#FFF8F2]
                          p-5
                        "
                      >

                        {person.description && (
                          <div
                            className="
                              mb-4
                              text-sm
                              leading-relaxed
                              text-gray-600
                            "
                          >
                            {
                              person.description
                            }
                          </div>
                        )}


                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId(
                              null
                            )
                          }
                          className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-1
                            py-1
                            text-xs
                            font-semibold
                            text-gray-400
                            transition-colors
                            hover:text-[#F58220]
                          "
                        >
                          <span>×</span>
                          Tutup
                        </button>

                      </div>
                    )}

                  </div>
                )
              }
            )}

          </div>

          {/* ============================================================
              LIHAT SELENGKAPNYA
          ============================================================ */}

          {members.length > 3 && (
            <div className="mt-10 text-center">

              <button
                type="button"
                onClick={() =>
                  onNavigate(
                    'about',
                    'struktur-organisasi'
                  )
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-[#F58220]
                  bg-white
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-[#F58220]
                  transition-all
                  duration-200
                  hover:bg-[#F58220]
                  hover:text-white
                "
              >
                Lihat Selengkapnya

                <span
                  aria-hidden="true"
                  className="
                    text-base
                    transition-transform
                    duration-200
                  "
                >
                  →
                </span>
              </button>

            </div>
          )}

        </>
      )}

    </section>
  )
}