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
    desc: 'Pengelolaan zakat, infak, sedekah, dan dana sosial keagamaan lainnya dilakukan dengan mengedepankan amanah, profesionalitas, dan transparan.',
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
    desc: 'Website Lazismu Pemalang membantu masyarakat melihat program dan melakukan donasi secara lebih mudah melalui layanan digital.',
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
  },
]

export default function WhyLazismu() {
  const { inView, ref } = useInView()

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[430px] w-[430px] rounded-full bg-[#F58220]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-[-120px] h-[500px] w-[500px] rounded-full bg-[#F58220]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full border-2 border-[#F58220]/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-[-60px] h-[190px] w-[190px] rounded-full border-2 border-[#F58220]/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-10 top-36 h-24 w-24 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(#F58220 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 right-12 h-24 w-24 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(#F58220 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ===================================================
            HEADING
        =================================================== */}

        <div
          ref={
            ref as React.RefObject<HTMLDivElement>
          }
          className={`mx-auto mb-14 max-w-2xl text-center transition-all duration-700 ${
            inView
              ? 'translate-y-0 opacity-100'
              : 'translate-y-6 opacity-0'
          }`}
        >

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F58220]/15 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFF0E4] text-xs font-bold text-[#F58220]">
              ✦
            </span>

            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#F58220]">
              Mengapa Kami
            </span>

          </div>

          <h2
            className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Kenapa Pilih Lazismu
            Pemalang?
          </h2>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-[#F58220] to-[#D96808]" />

          <p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base">
            Kami berkomitmen mengelola dana umat
            secara amanah, profesional, transparan,
            dan berorientasi pada pemberdayaan
            masyarakat.
          </p>

        </div>


        {/* ===================================================
            REASONS
        =================================================== */}

        <div
          className={`grid grid-cols-1 gap-6 transition-all duration-700 delay-200 sm:grid-cols-2 lg:grid-cols-3 ${
            inView
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
        >

          {reasons.map(
            (reason, index) => (
              <div
                key={reason.title}
                className="group relative overflow-hidden rounded-[26px] border border-[#F1D9C1] bg-white/90 p-7 shadow-[0_8px_30px_rgba(120,70,30,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#F58220]/40 hover:shadow-[0_18px_45px_rgba(120,70,30,0.12)]"
              >

                {/* CARD GLOW */}

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#F58220]/5 blur-2xl transition-all duration-300 group-hover:bg-[#F58220]/10"
                />

                {/* NUMBER */}

                <div className="absolute right-5 top-5 text-5xl font-black text-[#F58220]/[0.05]">
                  {String(
                    index + 1
                  ).padStart(2, '0')}
                </div>


                {/* ICON */}

                <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFF0E4] to-[#FFE4CC] text-[#F58220] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-2 group-hover:shadow-md">
                  {reason.icon}
                </div>


                {/* TITLE */}

                <h3
                  className="relative mb-3 text-base font-bold text-gray-800"
                  style={{
                    fontFamily:
                      "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {reason.title}
                </h3>


                {/* DESCRIPTION */}

                <p className="relative text-sm leading-7 text-gray-500">
                  {reason.desc}
                </p>


                {/* BOTTOM ACCENT */}

                <div className="mt-6 h-1 w-8 rounded-full bg-[#F58220]/30 transition-all duration-300 group-hover:w-16 group-hover:bg-[#F58220]" />

              </div>
            )
          )}

        </div>

      </div>
    </section>
  )
}
