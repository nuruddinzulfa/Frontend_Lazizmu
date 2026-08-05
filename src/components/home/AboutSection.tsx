import { useInView } from '../../hooks/useInView'
import type { NavPage } from '../../App'

interface AboutSectionProps { onNavigate: (page: NavPage) => void }

const orgStructure = {
  top: { role: 'Dewan Pengawas Syariah', name: 'Dr. H. Ahmad Fauzi, M.Ag.', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  head: { role: 'Ketua', name: 'H. Muhamad Ridwan, S.E.', color: 'bg-[#F58220] text-white' },
  deputies: [
    { role: 'Wakil Ketua I', name: 'Drs. H. Suharto, M.Pd.', color: 'bg-orange-50 border-orange-200' },
    { role: 'Wakil Ketua II', name: 'Ir. H. Bambang Eko, M.T.', color: 'bg-orange-50 border-orange-200' },
  ],
  support: [
    { role: 'Sekretaris', name: 'Ahmad Zainudin, S.H.', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { role: 'Bendahara', name: 'Hj. Siti Rohmah, S.E.', color: 'bg-green-50 border-green-200 text-green-700' },
  ],
  divisions: [
    { role: 'Div. Penghimpunan', name: 'Faisal Maulana, S.E.', icon: '📥' },
    { role: 'Div. Pendayagunaan', name: 'Nur Hidayah, S.Sos.', icon: '🤲' },
    { role: 'Div. Keuangan', name: 'Tri Wahyuni, S.Ak.', icon: '💼' },
    { role: 'Div. IT & Humas', name: 'Rizal Firmansyah, S.Kom.', icon: '📡' },
  ],
}

const misi = [
  'Meningkatkan kualitas pengelolaan ZIS yang amanah, profesional, dan transparan.',
  'Meningkatkan pendayagunaan ZIS yang kreatif, inovatif, dan produktif.',
  'Meningkatkan kualitas pelayanan kepada donatur dan mustahik.',
]

const milestones = [
  { year: '2002', label: 'Didirikan PP. Muhammadiyah', icon: '🏛️' },
  { year: '2002', label: 'SK Menag No. 457 — LAZNAS Nasional', icon: '📜' },
  { year: '2016', label: 'SK Menag No. 730 — Dikukuhkan kembali', icon: '✅' },
  { year: '2022', label: 'SK Menag No. 90 — Perpanjangan izin', icon: '🔄' },
]

export default function AboutSection({ onNavigate }: AboutSectionProps) {
  const { inView, ref } = useInView()
  const { inView: inView2, ref: ref2 } = useInView()

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── TENTANG KAMI ── */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Left: visual */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-orange-50">
              <img
                src="https://images.unsplash.com/photo-1708481686679-1bfebe1afefc?w=800&h=600&fit=crop&auto=format"
                alt="LAZISMU Pemalang"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#F58220]/40 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-4 sm:-right-8 bg-white rounded-2xl shadow-xl border border-[#F3DEC8] p-5 max-w-[220px]">
              <div className="text-3xl font-bold text-[#F58220] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>20+</div>
              <div className="text-xs text-gray-500 leading-snug">Tahun melayani umat dan masyarakat Indonesia</div>
            </div>
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-2xl opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #F58220 1.5px, transparent 1.5px)', backgroundSize: '8px 8px' }} />
          </div>

          {/* Right: text */}
          <div>
            <span className="text-[#F58220] text-sm font-semibold uppercase tracking-wider">Tentang Kami</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-5 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Lembaga Zakat Nasional<br />
              <span className="orange-gradient-text">yang Amanah & Terpercaya</span>
            </h2>

            <div className="space-y-4 text-gray-500 text-sm leading-relaxed">
              <p>
                LAZISMU adalah lembaga zakat tingkat nasional yang berkhidmat dalam pemberdayaan masyarakat
                melalui pendayagunaan secara produktif dana zakat, infaq, wakaf, dan dana kedermawanan lainnya —
                baik dari perseorangan, lembaga, maupun perusahaan.
              </p>
              <p>
                Didirikan oleh PP. Muhammadiyah pada tahun 2002 dan dikukuhkan Menteri Agama RI sebagai
                Lembaga Amil Zakat Nasional melalui SK No. 457. Izin operasional terakhir diperbarui melalui
                SK Menag No. 90 Tahun 2022.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {milestones.map((m) => (
                <div key={m.year + m.label} className="flex items-start gap-3 p-3 rounded-xl bg-[#FFF8F2] border border-[#F3DEC8]">
                  <span className="text-xl flex-shrink-0">{m.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-[#F58220]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.year}</div>
                    <div className="text-xs text-gray-500 leading-snug mt-0.5">{m.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('about')}
              className="mt-8 btn-primary px-7 py-3 text-sm font-semibold"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Selengkapnya Tentang Kami →
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#F3DEC8] mb-20" />

        {/* ── VISI & MISI ── */}
        <div
          ref={ref2 as React.RefObject<HTMLDivElement>}
          className={`transition-all duration-700 delay-100 ${inView2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-12">
            <span className="text-[#F58220] text-sm font-semibold uppercase tracking-wider">Arah & Tujuan</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Visi dan Misi LAZISMU
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F58220] to-[#D96D0A] p-10">
              <div className="absolute top-0 right-0 w-40 h-40 opacity-10 pointer-events-none">
                <svg viewBox="0 0 160 160" fill="none">
                  <polygon points="80,8 152,44 152,116 80,152 8,116 8,44" stroke="white" strokeWidth="1.5" fill="none" />
                  <polygon points="80,28 132,56 132,104 80,132 28,104 28,56" stroke="white" strokeWidth="1" fill="none" />
                  <circle cx="80" cy="80" r="28" stroke="white" strokeWidth="1" fill="none" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-3">Visi</div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Menjadi Lembaga Zakat <span className="text-white/90 underline decoration-wavy decoration-white/40">Terpercaya</span>
                </h3>
                <p className="text-white/75 text-sm mt-4 leading-relaxed">
                  Kepercayaan publik adalah fondasi utama kami. Setiap kebijakan dan program dirancang untuk memperkuat integritas dan akuntabilitas lembaga.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-[#FFF8F2] border border-[#F3DEC8] p-10">
              <div className="w-14 h-14 rounded-2xl bg-[#FEF0E4] flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#F58220]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="text-[#F58220] text-sm font-semibold uppercase tracking-wider mb-3">Misi</div>
              <h3 className="text-xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tiga Pilar Utama Kami</h3>
              <div className="space-y-4">
                {misi.map((m, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#F58220] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                    <p className="text-gray-600 text-sm leading-relaxed pt-1">{m}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {['Amanah', 'Profesional', 'Transparan', 'Inovatif', 'Produktif'].map((v) => (
                  <span key={v} className="px-3 py-1.5 rounded-full bg-white border border-[#F3DEC8] text-[#F58220] text-xs font-semibold">{v}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#F3DEC8] mb-20 mt-4" />

        {/* ── STRUKTUR ORGANISASI ── */}
        <OrgChart onNavigate={onNavigate} />
      </div>
    </section>
  )
}

function OrgChart({ onNavigate }: { onNavigate: (page: NavPage) => void }) {
  const { inView, ref } = useInView()

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="text-center mb-12">
        <span className="text-[#F58220] text-sm font-semibold uppercase tracking-wider">Kepengurusan</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Struktur Organisasi</h2>
        <p className="text-gray-400 text-sm mt-3">Periode 2022–2026</p>
      </div>

      <div className="flex flex-col items-center gap-0">
        <div className={`px-7 py-4 rounded-2xl border-2 text-center ${orgStructure.top.color} w-64 shadow-sm`}>
          <div className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">{orgStructure.top.role}</div>
          <div className="font-bold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{orgStructure.top.name}</div>
        </div>
        <div className="w-px h-8 bg-[#F3DEC8]" />
        <div className={`px-8 py-4 rounded-2xl text-center ${orgStructure.head.color} w-72 shadow-md`}>
          <div className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-1">{orgStructure.head.role}</div>
          <div className="font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{orgStructure.head.name}</div>
        </div>
        <div className="w-px h-8 bg-[#F3DEC8]" />
        <div className="relative flex gap-6 justify-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-80px)] h-px bg-[#F3DEC8]" />
          {orgStructure.deputies.map((d) => (
            <div key={d.role} className="flex flex-col items-center">
              <div className="w-px h-8 bg-[#F3DEC8]" />
              <div className={`px-6 py-4 rounded-2xl border-2 text-center ${d.color} w-52 shadow-sm`}>
                <div className="text-xs font-semibold text-[#F58220] uppercase tracking-wide mb-1">{d.role}</div>
                <div className="font-bold text-sm text-gray-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{d.name}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-px h-8 bg-[#F3DEC8]" />
        <div className="relative flex gap-6 justify-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-80px)] h-px bg-[#F3DEC8]" />
          {orgStructure.support.map((s) => (
            <div key={s.role} className="flex flex-col items-center">
              <div className="w-px h-8 bg-[#F3DEC8]" />
              <div className={`px-6 py-4 rounded-2xl border-2 text-center ${s.color} w-52 shadow-sm`}>
                <div className="text-xs font-semibold uppercase tracking-wide mb-1 opacity-70">{s.role}</div>
                <div className="font-bold text-sm text-gray-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.name}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-px h-8 bg-[#F3DEC8]" />
        <div className="relative w-full max-w-3xl">
          <div className="absolute top-0 left-0 right-0 h-px bg-[#F3DEC8]" />
          <div className="flex justify-around">
            {orgStructure.divisions.map((div) => (
              <div key={div.role} className="flex flex-col items-center">
                <div className="w-px h-8 bg-[#F3DEC8]" />
                <div className="bg-white border-2 border-[#F3DEC8] hover:border-[#F58220] rounded-2xl p-4 text-center w-40 shadow-sm transition-all duration-200">
                  <div className="text-2xl mb-2">{div.icon}</div>
                  <div className="text-xs font-bold text-[#F58220] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{div.role}</div>
                  <div className="text-xs text-gray-500 leading-snug">{div.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => onNavigate('about')}
          className="border-2 border-[#F58220] text-[#F58220] hover:bg-[#F58220] hover:text-white transition-all duration-200 px-8 py-3 rounded-xl font-semibold text-sm"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Lihat Profil Lengkap →
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        * Nama pengurus bersifat ilustratif. Silakan hubungi kantor LAZISMU Pemalang untuk data resmi terkini.
      </p>
    </div>
  )
}
