import { useEffect, useRef, useState } from 'react'
import API_URL from '../../lib/api'

interface ImpactStat {
  id: number
  label: string
  sublabel: string | null
  value: number
  suffix: string | null
  icon: string | null
  sort_order: number
}

interface StatItem extends ImpactStat {
  iconElement: React.ReactNode
}

/*
|--------------------------------------------------------------------------
| ICON
|--------------------------------------------------------------------------
*/

function getIcon(icon: string | null) {
  switch (icon) {
    case 'map-pin':
      return (
        <svg
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      )

    case 'clipboard':
      return (
        <svg
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      )

    case 'users':
    default:
      return (
        <svg
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      )
  }
}

/*
|--------------------------------------------------------------------------
| COUNTER
|--------------------------------------------------------------------------
*/

function StatCounter({
  item,
}: {
  item: StatItem
}) {
  const [count, setCount] = useState(0)

  const ref =
    useRef<HTMLDivElement>(null)

  const started =
    useRef(false)

  useEffect(() => {
    const element = ref.current

    if (!element) {
      return
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            !entry.isIntersecting ||
            started.current
          ) {
            return
          }

          started.current = true

          const duration = 1800
          const start =
            performance.now()

          const tick = (
            now: number
          ) => {
            const elapsed =
              now - start

            const progress =
              Math.min(
                elapsed / duration,
                1
              )

            const eased =
              1 -
              Math.pow(
                1 - progress,
                3
              )

            setCount(
              Math.round(
                item.value * eased
              )
            )

            if (progress < 1) {
              requestAnimationFrame(
                tick
              )
            }
          }

          requestAnimationFrame(
            tick
          )
        },
        {
          threshold: 0.4,
        }
      )

    observer.observe(element)

    return () =>
      observer.disconnect()
  }, [item.value])

  return (
    <div
      ref={ref}
      className="group flex flex-col items-center text-center"
    >

      {/* ICON */}

      <div className="relative mb-5">

        <div
          aria-hidden="true"
          className="absolute -inset-2 rounded-2xl bg-white/10 blur-md transition-all duration-300 group-hover:bg-white/20"
        />

        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-[#F58220]">
          {item.iconElement}
        </div>

      </div>


      {/* NUMBER */}

      <div
        className="mb-1 text-4xl font-bold tracking-tight text-white sm:text-5xl"
        style={{
          fontFamily:
            "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {count.toLocaleString(
          'id-ID'
        )}

        {item.suffix && (
          <span className="ml-1 text-[#FFE2C5]">
            {item.suffix}
          </span>
        )}
      </div>


      {/* LABEL */}

      <div
        className="text-sm font-bold text-white"
        style={{
          fontFamily:
            "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {item.label}
      </div>


      {/* SUBLABEL */}

      {item.sublabel && (
        <div className="mt-1 text-xs text-white/65">
          {item.sublabel}
        </div>
      )}

    </div>
  )
}

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function ImpactStats() {
  const [stats, setStats] =
    useState<StatItem[]>([])

  const [loading, setLoading] =
    useState(true)

  /*
  |--------------------------------------------------------------------------
  | FETCH
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchStats =
      async () => {
        try {
          const response =
            await fetch(
              `${API_URL}/impact-stats`
            )

          if (!response.ok) {
            throw new Error(
              'Gagal mengambil data impact statistics'
            )
          }

          const result =
            await response.json()

          const data: ImpactStat[] =
            Array.isArray(result)
              ? result
              : Array.isArray(
                  result?.data
                )
                ? result.data
                : []

          const formatted =
            data
              .sort(
                (a, b) =>
                  (a.sort_order ??
                    0) -
                  (b.sort_order ??
                    0)
              )
              .map((item) => ({
                ...item,
                value:
                  Number(
                    item.value
                  ) || 0,
                iconElement:
                  getIcon(
                    item.icon
                  ),
              }))

          setStats(formatted)
        } catch (error) {
          console.error(
            'Error fetching impact statistics:',
            error
          )

          setStats([])
        } finally {
          setLoading(false)
        }
      }

    fetchStats()
  }, [])

  /*
  |--------------------------------------------------------------------------
  | EMPTY
  |--------------------------------------------------------------------------
  */

  if (
    !loading &&
    stats.length === 0
  ) {
    return null
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F58220] via-[#EE7411] to-[#D96D0A] py-20 sm:py-24">

      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-white/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-[-150px] h-[500px] w-[500px] rounded-full bg-[#FFF0D9]/10 blur-3xl"
      />

      {/* =====================================================
          CIRCLES
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-[340px] w-[340px] rounded-full border border-white/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-[-50px] h-[210px] w-[210px] rounded-full border border-white/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-[300px] w-[300px] rounded-full border border-white/10"
      />

      {/* =====================================================
          DOT PATTERN
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-10 top-24 h-24 w-24 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(white 1.5px, transparent 1.5px)',
          backgroundSize:
            '12px 12px',
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 right-12 h-24 w-24 opacity-15"
        style={{
          backgroundImage:
            'radial-gradient(white 1.5px, transparent 1.5px)',
          backgroundSize:
            '12px 12px',
        }}
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="mx-auto mb-14 max-w-2xl text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-sm">
              ✦
            </span>

            Dampak Nyata

          </div>

          <h2
            className="text-3xl font-bold text-white sm:text-4xl"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Angka yang Berbicara
          </h2>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-white/70" />

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
            Data dampak dan jangkauan program
            LAZISMU Pemalang yang terus
            bertumbuh bersama kebaikan Anda.
          </p>

        </div>


        {/* ===================================================
            STATISTICS
        =================================================== */}

        {loading ? (
          <div className="rounded-3xl border border-white/15 bg-white/10 py-12 text-center backdrop-blur-sm">

            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-white/30 border-t-white" />

            <p className="text-sm text-white/70">
              Memuat data dampak...
            </p>

          </div>
        ) : (
          <div
            className={`grid gap-5 ${
              stats.length === 1
                ? 'mx-auto max-w-sm grid-cols-1'
                : stats.length === 2
                  ? 'mx-auto max-w-2xl grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >

            {stats.map(
              (stat) => (
                <div
                  key={stat.id}
                  className="group relative overflow-hidden rounded-[26px] border border-white/15 bg-white/10 px-6 py-8 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.15] hover:shadow-xl"
                >

                  {/* CARD GLOW */}

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                  />

                  {/* TOP ACCENT */}

                  <div className="absolute left-1/2 top-0 h-1 w-10 -translate-x-1/2 rounded-b-full bg-white/60 transition-all duration-300 group-hover:w-20" />

                  <div className="relative z-10">
                    <StatCounter
                      item={stat}
                    />
                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>


      {/* =====================================================
          BOTTOM WAVE
      ===================================================== */}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 opacity-10">

        <svg
          viewBox="0 0 1440 70"
          fill="none"
          preserveAspectRatio="none"
          className="h-14 w-full"
        >
          <path
            d="M0 70V45C180 15 300 55 480 30C660 5 780 50 960 25C1140 0 1260 45 1440 20V70H0Z"
            fill="white"
          />
        </svg>

      </div>

    </section>
  )
}