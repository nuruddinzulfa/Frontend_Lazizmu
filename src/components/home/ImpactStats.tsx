import { useEffect, useRef, useState } from 'react'

interface StatItem {
  end: number
  suffix: string
  label: string
  sublabel: string
  icon: React.ReactNode
}

const stats: StatItem[] = [
  {
    end: 12847,
    suffix: '+',
    label: 'Penerima Manfaat',
    sublabel: 'Jiwa yang terbantu',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    end: 14,
    suffix: '',
    label: 'Kecamatan',
    sublabel: 'Seluruh kab. Pemalang',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    end: 38,
    suffix: '+',
    label: 'Program Aktif',
    sublabel: 'Berbagai bidang',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    end: 420,
    suffix: '+',
    label: 'Relawan Aktif',
    sublabel: 'Siap membantu',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    end: 47,
    suffix: '',
    label: 'Sekolah Terbantu',
    sublabel: 'SD - SMA sederajat',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    end: 23,
    suffix: '',
    label: 'Masjid Dibangun',
    sublabel: 'Dibangun & direnovasi',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
]

function StatCounter({ item }: { item: StatItem }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 2000
          const start = performance.now()
          const tick = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(item.end * eased))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [item.end])

  return (
    <div ref={ref} className="flex flex-col items-center text-center group">
      <div className="w-16 h-16 rounded-2xl bg-[#F58220]/10 text-[#F58220] flex items-center justify-center mb-4 group-hover:bg-[#F58220] group-hover:text-white transition-all duration-300">
        {item.icon}
      </div>
      <div
        className="text-4xl font-bold text-gray-900 mb-1"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {count.toLocaleString('id-ID')}
        <span className="text-[#F58220]">{item.suffix}</span>
      </div>
      <div className="font-semibold text-gray-700 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {item.label}
      </div>
      <div className="text-gray-400 text-xs mt-0.5">{item.sublabel}</div>
    </div>
  )
}

export default function ImpactStats() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#F58220] to-[#D96D0A] relative overflow-hidden">
      {/* Background Islamic pattern */}
      <div className="absolute inset-0 islamic-geo-bg opacity-20 pointer-events-none" />

      {/* Mountain contour accent */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full opacity-10">
          <path d="M0 60 L0 40 L200 20 L400 35 L600 10 L800 30 L1000 15 L1200 35 L1440 20 L1440 60 Z" fill="white" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-white/70 text-sm font-semibold uppercase tracking-wider">Dampak Nyata</span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Angka yang Berbicara
          </h2>
          <p className="text-white/70 max-w-xl mx-auto">
            Sejak berdiri, LAZISMU Pemalang telah menyentuh ribuan kehidupan di seluruh penjuru kabupaten.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <StatCounter item={s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
