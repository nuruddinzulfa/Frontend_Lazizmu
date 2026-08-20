import { useState } from 'react'
import { useInView } from '../../hooks/useInView'

const faqs = [
  {
    q: 'Apakah Lazismu Pemalang sudah resmi dan terpercaya?',
    a: 'Ya. Lazismu adalah Lembaga Amil Zakat Nasional (LAZNAS) yang telah mendapat izin resmi dari Kementerian Agama RI sejak 2002. Lazismu Pemalang adalah cabang resmi yang beroperasi di Pemalang dengan pengawasan dari Dewan Pengawas Syariah dan auditor independen.',
  },
  {
    q: 'Bagaimana cara berdonasi melalui Lazismu Pemalang?',
    a: 'Donasi dapat dilakukan melalui: (1) Website ini menggunakan QRIS, transfer bank, atau e-wallet; (2) Transfer langsung ke rekening Lazismu Pemalang; (3) Datang langsung ke kantor kami di Jl. Ahmad Yani No. 12, Pemalang; (4) Melalui relawan kami yang tersebar di 14 kecamatan.',
  },
  {
    q: 'Berapa nisab zakat profesi saat ini?',
    a: 'Nisab zakat profesi mengikuti nisab emas (85 gram emas) atau setara gandum (520 kg). Dengan harga emas saat ini sekitar Rp 1.050.000/gram, nisab sekitar Rp 89.250.000/tahun atau Rp 7.437.500/bulan. Gunakan kalkulator zakat kami untuk perhitungan yang lebih akurat.',
  },
  {
    q: 'Apakah ada laporan tentang penggunaan dana donasi?',
    a: 'Ya, kami berkomitmen pada transparansi penuh. Laporan keuangan triwulanan dan tahunan dipublikasikan di website ini dan dapat diunduh oleh siapapun. Kami juga mengirimkan laporan penyaluran kepada donatur yang mendaftar untuk notifikasi.',
  },
  {
    q: 'Bagaimana cara menjadi relawan Lazismu Pemalang?',
    a: 'Anda bisa mendaftar sebagai relawan melalui formulir pendaftaran di website kami, menghubungi kantor Lazismu Pemalang, atau menghubungi WhatsApp di 0812-XXXX-XXXX. Tidak ada syarat khusus — cukup niat tulus untuk membantu sesama.',
  },
  {
    q: 'Apakah donasi saya bisa untuk program tertentu yang saya pilih?',
    a: 'Tentu saja. Anda dapat menentukan program atau kategori tertentu yang ingin Anda dukung saat berdonasi — misalnya beasiswa pendidikan, renovasi masjid, atau bantuan pangan. Dana Anda akan disalurkan sesuai pilihan Anda.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const { inView, ref } = useInView()

  return (
    <section className="py-20 bg-[#FFF8F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <span className="text-[#F58220] text-sm font-semibold uppercase tracking-wider">FAQ</span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Pertanyaan yang Sering Ditanyakan
          </h2>
          <p className="text-gray-500">
            Tidak menemukan jawaban? Hubungi kami melalui WhatsApp atau email.
          </p>
        </div>

        <div
          className={`space-y-3 transition-all duration-700 delay-200 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                open === i ? 'bg-white border-[#F58220] shadow-sm' : 'bg-white border-[#F3DEC8]'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span
                  className={`font-semibold text-sm pr-8 leading-snug ${
                    open === i ? 'text-[#F58220]' : 'text-gray-800'
                  }`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {faq.q}
                </span>
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                    open === i ? 'bg-[#F58220] text-white rotate-45' : 'bg-[#FEF0E4] text-[#F58220]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v12M6 12h12" />
                  </svg>
                </div>
              </button>

              {open === i && (
                <div className="px-6 pb-6">
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div
          className={`mt-12 bg-gradient-to-r from-[#F58220] to-[#D96D0A] rounded-2xl p-8 text-center transition-all duration-700 delay-400 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h3
            className="text-xl font-bold text-white mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Masih ada pertanyaan?
          </h3>
          <p className="text-white/80 text-sm mb-5">
            Tim kami siap membantu Anda setiap hari, pukul 08.00–16.00 WIB.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/628112993327"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#F58220] hover:bg-[#FEF0E4] transition-colors px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat WhatsApp
            </a>
            {/* <a
              href="mailto:info@Lazismu-pemalang.or.id"
              className="bg-white/20 text-white hover:bg-white/30 transition-colors px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Kirim Email
            </a> */}
          </div>
        </div>
      </div>
    </section>
  )
}
