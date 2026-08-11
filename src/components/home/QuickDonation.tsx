import { useInView } from '../../hooks/useInView'

const steps = [
  {
    n: '01',
    title: 'Pilih Tujuan Donasi',
    desc: 'Tentukan jenis donasi (Zakat, Infak, Sedekah, atau Wakaf) dan pilih program atau kampanye yang ingin Anda dukung.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Isi Data & Nominal',
    desc: 'Masukkan nama (atau pilih anonim sebagai Hamba Allah), nomor HP, email, dan nominal donasi sesuai kemampuan Anda.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Pilih Metode & Konfirmasi',
    desc: 'Pilih metode pembayaran (QRIS, transfer bank, atau e-wallet) dan selesaikan transaksi. Bukti donasi dikirim via WhatsApp & Email.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

interface QuickDonationProps {
  onNavigate: (page: 'home' | 'zakat' | 'donasi') => void
}

export default function QuickDonation({ onNavigate }: QuickDonationProps) {
  const { inView, ref } = useInView()

  return (
    <section id="quick-donation" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Steps */}
          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
          >
            <div className="w-16 h-16 mb-6">
              <svg viewBox="0 0 80 80" fill="none">
                <polygon points="40,5 75,22 75,58 40,75 5,58 5,22" stroke="#F58220" strokeWidth="2" fill="none" opacity="0.4" />
                <polygon points="40,18 62,29 62,51 40,62 18,51 18,29" stroke="#F58220" strokeWidth="1.5" fill="none" opacity="0.3" />
                <circle cx="40" cy="40" r="12" stroke="#F58220" strokeWidth="2" fill="none" opacity="0.5" />
                <circle cx="40" cy="40" r="4" fill="#F58220" opacity="0.8" />
              </svg>
            </div>

            <span className="text-[#F58220] text-sm font-semibold uppercase tracking-wider">Donasi Mudah</span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Tunaikan Kebaikan
              <br />
              <span className="orange-gradient-text">dalam 3 Langkah</span>
            </h2>
            <p className="text-gray-500 mb-10 leading-relaxed">
              Proses donasi dirancang semudah mungkin — cepat, aman, dan terpercaya.
              Dana langsung tersalurkan kepada yang membutuhkan di Kabupaten Pemalang.
            </p>

            <div className="space-y-6">
              {steps.map((s, i) => (
                <div key={s.n} className="flex gap-5 items-start group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#FEF0E4] text-[#F58220] flex items-center justify-center group-hover:bg-[#F58220] group-hover:text-white transition-all duration-300">
                    {s.icon}
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#F58220] bg-[#FEF0E4] px-2 py-0.5 rounded-full" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {s.n}
                      </span>
                      <span className="font-bold text-gray-800 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {s.title}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                    {i < steps.length - 1 && (
                      <div className="mt-4 ml-0.5 w-px h-4 bg-[#F3DEC8]" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: CTA card */}
          <div
            className={`transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
          >
            <div className="bg-[#FFF8F2] rounded-3xl border border-[#F3DEC8] p-10 text-center relative overflow-hidden">
              {/* Islamic ornament bg */}
              <div className="absolute inset-0 islamic-geo-bg opacity-30 pointer-events-none" />

              <div className="relative z-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F58220] to-[#D96D0A] flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>

                <h3
                  className="text-2xl font-bold text-gray-800 mb-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Siap Berdonasi?
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                  Setiap rupiah yang Anda donasikan adalah investasi kebaikan yang nyata bagi masyarakat Pemalang.
                </p>

                <button
                  onClick={() => onNavigate('donasi')}
                  className="btn-primary w-full py-4 text-base font-bold mb-4"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Mulai Berdonasi Sekarang
                </button>

                <button
                  onClick={() => onNavigate('zakat')}
                  className="w-full py-3.5 rounded-xl border-2 border-[#F3DEC8] text-gray-600 text-sm font-semibold hover:border-[#F58220] hover:text-[#F58220] transition-all duration-200"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Hitung Zakat Terlebih Dahulu →
                </button>

                {/* Trust badges */}
                <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-[#F3DEC8]">
                  {[
                    { icon: '', label: 'Transaksi Aman' },
                    { icon: '', label: 'Resmi LAZNAS' },
                    { icon: '', label: 'Transparan' },
                  ].map(b => (
                    <div key={b.label} className="flex flex-col items-center gap-1">
                      <span className="text-xl">{b.icon}</span>
                      <span className="text-xs text-gray-400 font-medium">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
