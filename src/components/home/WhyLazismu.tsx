import { useInView } from '../../hooks/useInView'

const reasons = [
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: 'Amanah & Terpercaya',
    desc: 'Pengelolaan zakat, infak, sedekah, dan dana sosial dilakukan dengan mengedepankan amanah, profesionalitas, dan tanggung jawab.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    ),
    title: 'Transparan',
    desc: 'Informasi program dan laporan lembaga dapat disampaikan kepada masyarakat sebagai bagian dari komitmen terhadap keterbukaan dan akuntabilitas.',
    color: 'text-[#F58220]',
    bg: 'bg-orange-50',
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: 'Responsif',
    desc: 'Program dirancang untuk merespons kebutuhan masyarakat melalui berbagai bidang pelayanan dan pemberdayaan.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2c0-1.306.835-2.418 2-2.83M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: 'Berorientasi Pemberdayaan',
    desc: 'Penyaluran dana tidak hanya berfokus pada bantuan, tetapi juga diarahkan untuk mendukung kemandirian dan kesejahteraan masyarakat.',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    title: 'Donasi Lebih Mudah',
    desc: 'Website LAZISMU Pemalang membantu masyarakat melihat program dan melakukan donasi secara lebih mudah melalui layanan digital.',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    title: 'Berlandaskan Nilai Islam',
    desc: 'Pengelolaan dan pendayagunaan dana dilaksanakan dengan memperhatikan nilai-nilai Islam dan kemaslahatan masyarakat.',
    color: 'text-rose-500',
    bg: 'bg-rose-50',
  },
]

export default function WhyLazismu() {
  const { inView, ref } = useInView()

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-14 transition-all duration-700 ${
            inView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="text-[#F58220] text-sm font-semibold uppercase tracking-wider">
            Mengapa Kami
          </span>

          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Kenapa Pilih LAZISMU Pemalang?
          </h2>

          <p className="text-gray-500 max-w-xl mx-auto">
            Kami berkomitmen mengelola dana umat
            secara amanah, profesional, transparan,
            dan berorientasi pada pemberdayaan
            masyarakat.
          </p>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${
            inView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="group p-7 rounded-2xl bg-[#FFF8F2] border border-[#F3DEC8] hover:border-[#F58220] hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${reason.bg} ${reason.color} transition-all duration-300 group-hover:scale-110`}
              >
                {reason.icon}
              </div>

              <h3
                className="font-bold text-gray-800 mb-2"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {reason.title}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}