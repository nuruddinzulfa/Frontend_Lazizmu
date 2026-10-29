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

          if (
            window.matchMedia(
              '(prefers-reduced-motion: reduce)'
            ).matches
          ) {
            setCount(item.value)
            return
          }

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
      className="flex h-full flex-col border-t border-white/40 pt-6"
    >
      {/* ICON */}
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/50 text-white">
        {item.iconElement}
      </div>

      {/* NUMBER */}
      <div
        className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        {count.toLocaleString('id-ID')}

        {item.suffix && (
          <span className="ml-1 text-[#FFF0D0]">
            {item.suffix}
          </span>
        )}
      </div>

      {/* LABEL */}
      <div
        className="mt-2 text-sm font-bold text-[#2B1A12]"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        {item.label}
      </div>

      {/* SUBLABEL */}
      {item.sublabel && (
        <div className="mt-1 text-xs font-medium text-[#2B1A12]/80">
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
    <section className="landing-section landing-section--accent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">

          {/* HEADER (rata kiri, berbeda dari section lain) */}
          <div>
            <span className="eyebrow">Dampak Nyata</span>

            <h2
              className="mt-5 text-3xl font-bold text-white sm:text-4xl"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Angka yang Berbicara
            </h2>

            <div className="mt-4 h-1 w-14 rounded-full bg-white/80" />

            <p className="mt-5 max-w-md text-sm font-medium leading-7 text-[#2B1A12] sm:text-base">
              Data dampak dan jangkauan program Lazismu Pemalang yang
              terus bertumbuh bersama kebaikan Anda.
            </p>
          </div>

          {/* STATISTICS */}
          {loading ? (
            <div className="rounded-2xl border border-white/40 py-12 text-center">
              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-white/30 border-t-white" />

              <p className="text-sm font-medium text-[#2B1A12]">
                Memuat data dampak...
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-x-10 gap-y-10 ${
                stats.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
              }`}
            >
              {stats.map((stat) => (
                <StatCounter key={stat.id} item={stat} />
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
