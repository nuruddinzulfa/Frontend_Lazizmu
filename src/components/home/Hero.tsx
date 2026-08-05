import { useState, useEffect } from 'react'
import logo from '../../imports/4.png'

type NavPage = 'home' | 'zakat' | 'donasi'
interface HeroProps { onNavigate: (page: NavPage) => void }

const stats = [
  { value: '12.847', label: 'Penerima Manfaat' },
  { value: '4.2M', label: 'Dana Terkumpul' },
  { value: '38', label: 'Program Aktif' },
]

export default function Hero({ onNavigate }: HeroProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1630568419655-6dfb1ca30cfa?w=1600&h=900&fit=crop&auto=format"
          alt="Anak-anak penerima manfaat LAZISMU Pemalang"
          className="w-full h-full object-cover"
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Orange accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F58220]/20 via-transparent to-transparent" />
      </div>

      {/* Islamic Geometric Ornament (top right) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          <polygon points="100,10 190,55 190,145 100,190 10,145 10,55" stroke="#F58220" strokeWidth="1" fill="none" />
          <polygon points="100,30 170,67 170,133 100,170 30,133 30,67" stroke="#F58220" strokeWidth="0.8" fill="none" />
          <polygon points="100,50 150,79 150,121 100,150 50,121 50,79" stroke="#F58220" strokeWidth="0.6" fill="none" />
          <circle cx="100" cy="100" r="40" stroke="#F58220" strokeWidth="0.8" fill="none" />
          <circle cx="100" cy="100" r="25" stroke="#F58220" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      {/* Mountain Silhouette (Gunung Slamet) - bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" className="w-full">
          <path
            d="M0 120 L0 80 L200 40 L400 70 L500 25 L620 60 L720 10 L820 55 L950 30 L1100 65 L1250 45 L1380 70 L1440 50 L1440 120 Z"
            fill="white"
            opacity="0.08"
          />
          <path
            d="M0 120 L0 90 L300 55 L500 80 L720 30 L900 70 L1100 50 L1300 75 L1440 60 L1440 120 Z"
            fill="white"
            opacity="0.05"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-3 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-6 transition-all duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <img src={logo} alt="LAZISMU Kabupaten Pemalang" className="h-7 w-auto object-contain" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#F58220] animate-pulse" />
              <span className="text-white/90 text-xs font-semibold">Amanah & Transparan</span>
            </div>

            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 transition-all duration-700 delay-100 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Bersama Wujudkan{' '}
              <span className="text-[#F58220]">Kebaikan</span>
              <br />
              untuk{' '}
              <span className="text-[#F58220]">Pemalang</span>
            </h1>

            <p
              className={`text-white/80 text-lg leading-relaxed mb-8 max-w-lg transition-all duration-700 delay-200 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Salurkan zakat, infak, sedekah, dan wakaf Anda melalui LAZISMU Pemalang.
              Bersama kita membangun masyarakat yang sejahtera dan berakhlak mulia.
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-wrap gap-4 mb-12 transition-all duration-700 delay-300 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <button
                onClick={() => onNavigate('donasi')}
                className="btn-primary px-7 py-3.5 text-base font-semibold inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Donasi Sekarang
              </button>
              <a
                href="#programs"
                className="px-7 py-3.5 text-base font-semibold text-white border-2 border-white/40 rounded-xl hover:bg-white/10 transition-all duration-200 inline-flex items-center gap-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Pelajari Program
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            {/* Stats row */}
            <div
              className={`flex flex-wrap gap-6 transition-all duration-700 delay-400 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {s.value}
                  </span>
                  <span className="text-white/60 text-xs mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating Donation Card */}
          <div
            className={`transition-all duration-700 delay-300 ${
              mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="animate-float">
              <div className="glass-card rounded-2xl p-6 max-w-sm mx-auto lg:ml-auto shadow-2xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#F58220] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Beasiswa Pendidikan
                    </div>
                    <div className="text-xs text-gray-500">Campaign Unggulan</div>
                  </div>
                  <span className="ml-auto text-xs font-bold px-2 py-1 bg-red-100 text-red-600 rounded-full">Urgent</span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Terkumpul</span>
                    <span className="font-semibold text-[#F58220]">78%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#F58220] to-[#D96D0A] rounded-full transition-all duration-1000"
                      style={{ width: '78%' }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm font-bold text-gray-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Rp 78.500.000
                    </span>
                    <span className="text-xs text-gray-400">dari Rp 100.000.000</span>
                  </div>
                </div>

                <div className="flex gap-3 text-xs text-gray-500 mb-5">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-[#F58220]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    284 donatur
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-[#F58220]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    12 hari lagi
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('donasi')}
                  className="btn-primary block w-full text-center py-3 text-sm font-semibold"
                >
                  Donasi Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-xs">
        <span>Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-white/60 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
