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

function getIcon(icon: string | null) {
  switch (icon) {
    case 'map-pin':
      return (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

function StatCounter({ item }: { item: StatItem }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const element = ref.current

    if (!element) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) {
          return
        }

        started.current = true

        const duration = 1800
        const start = performance.now()

        const tick = (now: number) => {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)

          const eased = 1 - Math.pow(1 - progress, 3)

          setCount(Math.round(item.value * eased))

          if (progress < 1) {
            requestAnimationFrame(tick)
          }
        }

        requestAnimationFrame(tick)
      },
      {
        threshold: 0.4,
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [item.value])

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center group"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#F58220]/10 text-[#F58220] flex items-center justify-center mb-4 group-hover:bg-[#F58220] group-hover:text-white transition-all duration-300">
        {item.iconElement}
      </div>

      <div
        className="text-4xl font-bold text-gray-900 mb-1"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {count.toLocaleString('id-ID')}

        {item.suffix && (
          <span className="text-[#F58220]">
            {item.suffix}
          </span>
        )}
      </div>

      <div
        className="font-semibold text-gray-700 text-sm"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {item.label}
      </div>

      {item.sublabel && (
        <div className="text-gray-400 text-xs mt-0.5">
          {item.sublabel}
        </div>
      )}
    </div>
  )
}

export default function ImpactStats() {
  const [stats, setStats] = useState<StatItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${API_URL}/impact-stats`
        )

        if (!response.ok) {
          throw new Error(
            'Gagal mengambil data impact statistics'
          )
        }

        const result = await response.json()

        const data: ImpactStat[] = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : []

        const formatted = data
          .sort(
            (a, b) =>
              (a.sort_order ?? 0) -
              (b.sort_order ?? 0)
          )
          .map((item) => ({
            ...item,
            value: Number(item.value) || 0,
            iconElement: getIcon(item.icon),
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

  if (!loading && stats.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gradient-to-br from-[#F58220] to-[#D96D0A] relative overflow-hidden">
      <div className="absolute inset-0 islamic-geo-bg opacity-20 pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
          className="w-full opacity-10"
        >
          <path
            d="M0 60 L0 40 L200 20 L400 35 L600 10 L800 30 L1000 15 L1200 35 L1440 20 L1440 60 Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-white/70 text-sm font-semibold uppercase tracking-wider">
            Dampak Nyata
          </span>

          <h2
            className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-4"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Angka yang Berbicara
          </h2>

          <p className="text-white/70 max-w-xl mx-auto">
            Data dampak dan jangkauan program LAZISMU
            Pemalang.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-white/70">
            Memuat data dampak...
          </div>
        ) : (
          <div
            className={`grid gap-8 ${
              stats.length === 1
                ? 'grid-cols-1 max-w-sm mx-auto'
                : stats.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
              >
                <StatCounter item={stat} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}