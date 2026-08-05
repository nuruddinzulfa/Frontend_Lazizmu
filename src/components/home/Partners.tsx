import { useInView } from '../../hooks/useInView'

const partners = [
  { name: 'PP Muhammadiyah', initials: 'PP MHM' },
  { name: 'Kemenag RI', initials: 'KEMENAG' },
  { name: 'BAZNAS', initials: 'BAZNAS' },
  { name: 'Pemkab Pemalang', initials: 'PEMKAB' },
  { name: 'BNI Syariah', initials: 'BNI SYR' },
  { name: 'BSI', initials: 'BSI' },
  { name: 'Rumah Zakat', initials: 'RZ' },
  { name: 'Dompet Dhuafa', initials: 'DD' },
]

export default function Partners() {
  const { inView, ref } = useInView()

  return (
    <section className="py-16 bg-white border-t border-[#F3DEC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-10 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <span className="text-gray-400 text-sm font-medium">Didukung & bermitra dengan</span>
        </div>

        <div
          className={`grid grid-cols-4 sm:grid-cols-8 gap-4 transition-all duration-700 delay-200 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {partners.map(p => (
            <div
              key={p.name}
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-[#FFF8F2] transition-colors duration-200 cursor-default group"
            >
              <div className="w-14 h-14 rounded-xl bg-gray-100 group-hover:bg-[#FEF0E4] transition-colors flex items-center justify-center">
                <span
                  className="text-xs font-bold text-gray-400 group-hover:text-[#F58220] transition-colors text-center leading-tight"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {p.initials}
                </span>
              </div>
              <span className="text-xs text-gray-400 text-center leading-tight">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
