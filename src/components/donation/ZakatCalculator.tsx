import { useState, useEffect } from 'react'

const GOLD_PRICE = 1_050_000
const NISAB_GRAMS = 85
const NISAB = GOLD_PRICE * NISAB_GRAMS
const ZAKAT_RATE = 0.025

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

function parseNumber(s: string): number {
  return parseFloat(s.replace(/\./g, '').replace(',', '.')) || 0
}

interface CalcResult {
  income: number
  nisab: number
  zakatAmount: number
  isWajib: boolean
}

interface ZakatCalculatorProps {
  onPayZakat: (amount: number) => void
}

export default function ZakatCalculator({ onPayZakat }: ZakatCalculatorProps) {
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [otherIncome, setOtherIncome] = useState('')
  const [result, setResult] = useState<CalcResult | null>(null)
  const [tab, setTab] = useState<'profesi' | 'info'>('profesi')

  useEffect(() => {
    const income = parseNumber(monthlyIncome)
    const other = parseNumber(otherIncome)
    if (income === 0 && other === 0) {
      setResult(null)
      return
    }
    const total = (income + other) * 12
    const zakatAmount = total >= NISAB ? total * ZAKAT_RATE : 0
    setResult({
      income: total,
      nisab: NISAB,
      zakatAmount,
      isWajib: total >= NISAB,
    })
  }, [monthlyIncome, otherIncome])

  const handleInput = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    setter(raw ? parseInt(raw).toLocaleString('id-ID') : '')
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] relative overflow-hidden">
        <div className="absolute inset-0 islamic-geo-bg opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-2 mb-6 text-white text-xs font-semibold">
            <span>🕌</span>
            Kalkulator Zakat LAZISMU Pemalang
          </div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Hitung Zakat Anda
          </h1>
          <p className="text-white/80 max-w-xl mx-auto leading-relaxed">
            Hitung kewajiban zakat profesi Anda dengan mudah dan akurat.
            Nisab mengacu pada harga emas terkini sebesar{' '}
            <span className="font-semibold text-white">{formatRupiah(GOLD_PRICE)}/gram</span>.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-1 border border-[#F3DEC8] w-fit">
          <button
            onClick={() => setTab('profesi')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tab === 'profesi' ? 'bg-[#F58220] text-white shadow-sm' : 'text-gray-600 hover:text-[#F58220]'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Zakat Profesi
          </button>
          <button
            onClick={() => setTab('info')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tab === 'info' ? 'bg-[#F58220] text-white shadow-sm' : 'text-gray-600 hover:text-[#F58220]'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Panduan Zakat
          </button>
        </div>

        {tab === 'profesi' ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-[#F3DEC8] p-8 shadow-sm">
                <h2
                  className="text-xl font-bold text-gray-800 mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Zakat Profesi / Penghasilan
                </h2>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                  Masukkan penghasilan bulanan Anda. Zakat profesi dihitung berdasarkan total
                  penghasilan setahun dibandingkan dengan nisab emas (85 gram).
                </p>

                <div className="space-y-5">
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Penghasilan Tetap per Bulan *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rp</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={monthlyIncome}
                        onChange={handleInput(setMonthlyIncome)}
                        placeholder="Contoh: 5.000.000"
                        className="w-full bg-[#FFF8F2] border border-[#F3DEC8] rounded-xl pl-12 pr-4 py-3.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 transition-all"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">Gaji pokok + tunjangan tetap</p>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Penghasilan Lain per Bulan (opsional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rp</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={otherIncome}
                        onChange={handleInput(setOtherIncome)}
                        placeholder="Contoh: 1.000.000"
                        className="w-full bg-[#FFF8F2] border border-[#F3DEC8] rounded-xl pl-12 pr-4 py-3.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 transition-all"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">Bonus, freelance, bisnis sampingan, dll.</p>
                  </div>
                </div>

                {/* Nisab info */}
                <div className="mt-6 p-4 bg-[#FEF0E4] rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F58220]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#F58220]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#D96D0A] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Informasi Nisab
                      </div>
                      <div className="text-xs text-[#D96D0A]/80 leading-relaxed">
                        Nisab zakat profesi = 85 gram emas × {formatRupiah(GOLD_PRICE)}/gram
                        = <strong>{formatRupiah(NISAB)}/tahun</strong> atau{' '}
                        <strong>{formatRupiah(NISAB / 12)}/bulan</strong>.
                        Harga emas berdasarkan harga terkini.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-[#F3DEC8] p-6 shadow-sm sticky top-24">
                <h3
                  className="font-bold text-gray-800 mb-5"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Hasil Perhitungan
                </h3>

                {result === null ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-[#FEF0E4] flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#F58220]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm">Masukkan penghasilan Anda untuk melihat hasil perhitungan zakat.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Status badge */}
                    <div
                      className={`w-full text-center py-3 rounded-xl font-bold text-sm ${
                        result.isWajib
                          ? 'bg-[#F58220] text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {result.isWajib ? '✓ Wajib Zakat' : '○ Belum Wajib Zakat'}
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Total Penghasilan/Tahun</span>
                        <span className="font-semibold text-gray-800 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {formatRupiah(result.income)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Nisab (85 gr emas)</span>
                        <span className="font-semibold text-gray-800 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {formatRupiah(result.nisab)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Kadar Zakat</span>
                        <span className="font-semibold text-gray-800 text-sm">2.5%</span>
                      </div>
                    </div>

                    {result.isWajib && (
                      <div className="bg-[#FFF8F2] border border-[#F58220]/30 rounded-xl p-4">
                        <div className="text-xs text-gray-500 mb-1">Zakat yang wajib dikeluarkan</div>
                        <div
                          className="text-2xl font-bold text-[#F58220]"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {formatRupiah(result.zakatAmount)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          per tahun atau {formatRupiah(result.zakatAmount / 12)}/bulan
                        </div>
                      </div>
                    )}

                    {!result.isWajib && result.income > 0 && (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <p className="text-sm text-gray-500 leading-relaxed">
                          Penghasilan Anda belum mencapai nisab. Namun Anda tetap dianjurkan untuk
                          bersedekah dan berinfak semampunya.
                        </p>
                      </div>
                    )}

                    {result.isWajib && (
                      <button
                        type="button"
                        onClick={() => onPayZakat(result.zakatAmount)}
                        className="btn-primary w-full text-center py-3 text-sm font-bold"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        Bayar Zakat Sekarang →
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Zakat Profesi',
                icon: '💼',
                nisab: '85 gram emas/tahun',
                kadar: '2.5%',
                desc: 'Zakat atas penghasilan dari profesi atau pekerjaan seperti gaji, honorarium, dan sejenisnya.',
              },
              {
                title: 'Zakat Maal (Harta)',
                icon: '💰',
                nisab: '85 gram emas',
                kadar: '2.5%',
                desc: 'Zakat atas harta yang telah mencapai nisab dan dimiliki selama satu haul (satu tahun).',
              },
              {
                title: 'Zakat Fitrah',
                icon: '🌙',
                nisab: 'Setiap muslim',
                kadar: '2.5 kg/3.5 liter beras',
                desc: 'Zakat yang wajib dikeluarkan setiap muslim di bulan Ramadan menjelang Idul Fitri.',
              },
              {
                title: 'Zakat Pertanian',
                icon: '🌾',
                nisab: '653 kg (5 wasaq)',
                kadar: '5-10%',
                desc: '5% jika menggunakan irigasi berbayar, 10% jika tadah hujan/air alami.',
              },
              {
                title: 'Zakat Emas & Perak',
                icon: '✨',
                nisab: '85 gr emas / 595 gr perak',
                kadar: '2.5%',
                desc: 'Zakat atas kepemilikan emas dan perak yang telah mencapai nisab dan haul.',
              },
              {
                title: 'Zakat Perdagangan',
                icon: '🏪',
                nisab: '85 gram emas',
                kadar: '2.5%',
                desc: 'Zakat atas nilai barang dagangan (aset lancar) yang telah mencapai nisab dan haul.',
              },
            ].map(z => (
              <div key={z.title} className="bg-white rounded-2xl border border-[#F3DEC8] p-6 card-hover">
                <div className="text-4xl mb-4">{z.icon}</div>
                <h3 className="font-bold text-gray-800 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {z.title}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex gap-2 text-xs">
                    <span className="text-gray-400 w-12 flex-shrink-0">Nisab</span>
                    <span className="font-semibold text-gray-700">{z.nisab}</span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="text-gray-400 w-12 flex-shrink-0">Kadar</span>
                    <span className="font-semibold text-[#F58220]">{z.kadar}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{z.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-br from-[#F58220] to-[#D96D0A] rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 islamic-geo-bg opacity-20 pointer-events-none" />
          <div className="relative z-10">
            <h3
              className="text-xl font-bold text-white mb-3"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Bayar Zakat dengan Mudah
            </h3>
            <p className="text-white/80 text-sm mb-5 max-w-md mx-auto">
              Setelah menghitung zakat, Anda dapat langsung membayarnya melalui LAZISMU Pemalang.
              Aman, amanah, dan tersalurkan ke mustahik yang tepat.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => result?.isWajib ? onPayZakat(result.zakatAmount) : onPayZakat(0)}
                className="bg-white text-[#F58220] hover:bg-[#FEF0E4] transition-colors px-7 py-3 rounded-xl font-bold text-sm"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Bayar Zakat Sekarang
              </button>
              <a
                href="https://wa.me/628122345678"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 text-white hover:bg-white/30 transition-colors px-7 py-3 rounded-xl font-semibold text-sm flex items-center gap-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Konsultasi via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
