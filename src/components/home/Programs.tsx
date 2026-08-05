import { useInView } from '../../hooks/useInView'
import type { NavPage } from '../../App'

interface ProgramsProps { onNavigate: (page: NavPage) => void }

const programs = [
  {
    title: 'Pendidikan',
    desc: 'Beasiswa untuk anak kurang mampu, bantuan alat tulis, dan program mentoring akademik.',
    image: 'https://images.unsplash.com/photo-1549431971-f54b3f5c82d8?w=600&h=400&fit=crop&auto=format',
    alt: 'Program pendidikan',
    tag: '12 Sub-program',
    tagColor: 'bg-blue-100 text-blue-700',
    beneficiaries: '3.420',
  },
  {
    title: 'Kesehatan',
    desc: 'Layanan kesehatan gratis, santunan berobat, dan klinik keliling untuk daerah terpencil.',
    image: 'https://images.unsplash.com/photo-1533734635438-fa92e72a1f0e?w=600&h=400&fit=crop&auto=format',
    alt: 'Program kesehatan',
    tag: '8 Sub-program',
    tagColor: 'bg-red-100 text-red-700',
    beneficiaries: '2.185',
  },
  {
    title: 'Tanggap Bencana',
    desc: 'Respon darurat cepat, distribusi logistik, dan pemulihan pasca bencana alam.',
    image: 'https://images.unsplash.com/photo-1637034132661-4f015591b84a?w=600&h=400&fit=crop&auto=format',
    alt: 'Tanggap bencana',
    tag: '5 Sub-program',
    tagColor: 'bg-orange-100 text-orange-700',
    beneficiaries: '1.890',
  },
  {
    title: 'Pemberdayaan Ekonomi',
    desc: 'Modal usaha, pelatihan keterampilan, dan pendampingan usaha mikro keluarga dhuafa.',
    image: 'https://images.unsplash.com/photo-1611087802810-046bb671e644?w=600&h=400&fit=crop&auto=format',
    alt: 'Pemberdayaan ekonomi',
    tag: '6 Sub-program',
    tagColor: 'bg-green-100 text-green-700',
    beneficiaries: '980',
  },
  {
    title: 'Pembangunan Masjid',
    desc: 'Renovasi dan pembangunan masjid serta musholla di desa-desa yang membutuhkan.',
    image: 'https://images.unsplash.com/photo-1708481686679-1bfebe1afefc?w=600&h=400&fit=crop&auto=format',
    alt: 'Pembangunan masjid',
    tag: '4 Sub-program',
    tagColor: 'bg-purple-100 text-purple-700',
    beneficiaries: '4.200',
  },
  {
    title: 'Bantuan Pangan',
    desc: 'Distribusi sembako, dapur umum, dan program ketahanan pangan keluarga miskin.',
    image: 'https://images.unsplash.com/photo-1710093072228-8c3129f27357?w=600&h=400&fit=crop&auto=format',
    alt: 'Bantuan pangan',
    tag: '7 Sub-program',
    tagColor: 'bg-yellow-100 text-yellow-700',
    beneficiaries: '2.872',
  },
]

export default function Programs({ onNavigate }: ProgramsProps) {
  const { inView, ref } = useInView()

  return (
    <section id="programs" className="py-20 bg-[#FFF8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <span className="text-[#F58220] text-sm font-semibold uppercase tracking-wider">Program</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Program Unggulan Kami
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Dari pendidikan hingga pemberdayaan ekonomi — kami hadir di setiap aspek kehidupan masyarakat Pemalang.
          </p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {programs.map((p) => (
            <div
              key={p.title}
              onClick={() => onNavigate('program')}
              className="card-hover group bg-white rounded-2xl overflow-hidden border border-[#F3DEC8] shadow-sm cursor-pointer"
            >
              <div className="relative h-44 bg-orange-50 overflow-hidden">
                <img src={p.image} alt={p.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1.5 rounded-full ${p.tagColor}`}>{p.tag}</span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.title}</h3>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Penerima</div>
                    <div className="text-sm font-bold text-[#F58220]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.beneficiaries}</div>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{p.desc}</p>
                <div className="flex items-center gap-1.5 text-[#F58220] text-sm font-semibold group-hover:gap-3 transition-all duration-200" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Lihat Detail
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => onNavigate('program')}
            className="border-2 border-[#F58220] text-[#F58220] hover:bg-[#F58220] hover:text-white transition-all duration-200 px-8 py-3 rounded-xl font-semibold text-sm"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Lihat Semua Program →
          </button>
        </div>
      </div>
    </section>
  )
}
