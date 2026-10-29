import { useInView } from '../../hooks/useInView'

const steps = [
  {
    n: '01',
    title: 'Pilih Program Donasi',
    desc: 'Pilih campaign atau program donasi yang tersedia sesuai tujuan kebaikan yang ingin Anda dukung.',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Isi Data & Nominal',
    desc: 'Masukkan data donatur dan nominal donasi. Anda juga dapat memilih berdonasi sebagai Hamba Allah jika tersedia pada formulir.',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Selesaikan Pembayaran',
    desc: 'Pilih metode pembayaran yang tersedia, selesaikan transaksi melalui halaman pembayaran, lalu sistem akan memproses status donasi Anda.',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
]

interface QuickDonationProps {
  onNavigate: (
    page: 'home' | 'zakat' | 'donasi'
  ) => void
}

export default function QuickDonation({
  onNavigate,
}: QuickDonationProps) {
  const { inView, ref } = useInView()

  return (
    <section
      id="quick-donation"
      className="landing-section landing-section--surface landing-section--orb-l"
    >

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* =================================================
              LEFT
          ================================================= */}

          <div
            ref={
              ref as React.RefObject<HTMLDivElement>
            }
            className={`transition-all duration-700 ${
              inView
                ? 'translate-x-0 opacity-100'
                : '-translate-x-8 opacity-0'
            }`}
          >

            {/* ICON */}

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg ">

              <svg
                viewBox="0 0 80 80"
                fill="none"
                className="h-12 w-12"
              >
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="#EA6113"
                  strokeWidth="2"
                  opacity="0.4"
                />

                <circle
                  cx="40"
                  cy="40"
                  r="22"
                  stroke="#EA6113"
                  strokeWidth="1.5"
                  opacity="0.3"
                />

                <circle
                  cx="40"
                  cy="40"
                  r="12"
                  stroke="#EA6113"
                  strokeWidth="2"
                  opacity="0.5"
                />

                <circle
                  cx="40"
                  cy="40"
                  r="4"
                  fill="#EA6113"
                  opacity="0.8"
                />
              </svg>

            </div>


            {/* LABEL */}

            <span className="text-sm font-bold uppercase tracking-[0.14em] text-[#EA6113]">
              Donasi Mudah
            </span>


            {/* TITLE */}

            <h2
              className="mt-2 mb-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl"
              style={{
                fontFamily:
                  "'Fraunces', serif",
              }}
            >
              Tunaikan Kebaikan
              <br />

              <span className="accent-text">
                dalam 3 Langkah
              </span>
            </h2>


            {/* DESCRIPTION */}

            <p className="mb-10 max-w-xl leading-7 text-gray-500">
              Proses donasi dirancang agar mudah
              digunakan mulai dari memilih program
              hingga menyelesaikan pembayaran secara
              online.
            </p>


            {/* STEPS */}

            <div className="relative space-y-7">

              {/* CONNECTING LINE */}

              <div className="absolute bottom-12 left-6 top-12 w-px  bg-[#EA6113]  " />

              {steps.map(
                (step, index) => (
                  <div
                    key={step.n}
                    className="group relative flex items-start gap-5"
                  >

                    {/* ICON */}

                    <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-[#E8CDAA] bg-white text-[#EA6113] shadow-sm transition-all duration-300 group-hover:border-[#EA6113] group-hover:bg-[#EA6113] group-hover:text-white group-hover:shadow-md">
                      {step.icon}
                    </div>


                    {/* TEXT */}

                    <div className="pt-0.5">

                      <div className="mb-2 flex items-center gap-2">

                        <span
                          className="rounded-full bg-[#FFE3B3] px-2.5 py-1 text-[11px] font-bold text-[#EA6113]"
                          style={{
                            fontFamily:
                              "'Fraunces', serif",
                          }}
                        >
                          {step.n}
                        </span>

                        <span
                          className="text-sm font-bold text-gray-800"
                          style={{
                            fontFamily:
                              "'Fraunces', serif",
                          }}
                        >
                          {step.title}
                        </span>

                      </div>

                      <p className="max-w-xl text-sm leading-6 text-gray-500">
                        {step.desc}
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>


          {/* =================================================
              RIGHT
          ================================================= */}

          <div
            className={`transition-all duration-700 delay-200 ${
              inView
                ? 'translate-x-0 opacity-100'
                : 'translate-x-8 opacity-0'
            }`}
          >

            <div className="relative">

              {/* OUTER GLOW */}

              <div
                aria-hidden="true"
                className="absolute -inset-5 rounded-[38px] bg-[#EA6113]/10 "
              />


              {/* MAIN CARD */}

              <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white p-7 shadow-sm sm:p-10">

                {/* CARD DECORATION */}

                <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#EA6113]/10 " />

                <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[#F88F22]/10 " />

                <div className="absolute right-6 top-6 h-20 w-20 rounded-full border border-[#EA6113]/10" />

                <div className="absolute right-10 top-10 h-12 w-12 rounded-full border border-[#EA6113]/10" />


                {/* CONTENT */}

                <div className="relative z-10 text-center">

                  {/* HEART */}

                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full  bg-[#EA6113]  shadow-lg ">

                    <svg
                      className="h-10 w-10 text-white"
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

                  </div>


                  {/* TITLE */}

                  <h3
                    className="mb-3 text-2xl font-bold text-gray-800"
                    style={{
                      fontFamily:
                        "'Fraunces', serif",
                    }}
                  >
                    Siap Berdonasi?
                  </h3>


                  {/* TEXT */}

                  <p className="mx-auto mb-8 max-w-sm text-sm leading-7 text-gray-500">
                    Pilih program yang ingin Anda
                    dukung dan salurkan donasi melalui
                    layanan Lazismu Pemalang.
                  </p>


                  {/* PRIMARY BUTTON */}

                  <button
                    onClick={() =>
                      onNavigate('donasi')
                    }
                    className="btn-primary mb-3 w-full rounded-xl py-4 text-base font-bold shadow-lg  transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                    style={{
                      fontFamily:
                        "'Fraunces', serif",
                    }}
                  >
                    Mulai Berdonasi Sekarang
                  </button>


                  {/* SECONDARY BUTTON */}

                  <button
                    onClick={() =>
                      onNavigate('zakat')
                    }
                    className="w-full rounded-xl border-2 border-[#E8CDAA] bg-white py-3.5 text-sm font-semibold text-gray-600 transition-all duration-200 hover:border-[#EA6113] hover:bg-[#FFF8EA] hover:text-[#EA6113]"
                    style={{
                      fontFamily:
                        "'Fraunces', serif",
                    }}
                  >
                    Hitung Zakat Terlebih Dahulu →
                  </button>


                  {/* FEATURES */}

                  <div className="mt-8 grid grid-cols-3 gap-3 border-t border-[#E8CDAA] pt-6">

                    {[
                      {
                        label:
                          'Pembayaran Online',
                        icon: '✓',
                      },
                      {
                        label:
                          'Mudah Digunakan',
                        icon: '✓',
                      },
                      {
                        label:
                          'Transparan',
                        icon: '✓',
                      },
                    ].map(
                      (item) => (
                        <div
                          key={
                            item.label
                          }
                          className="flex flex-col items-center gap-2"
                        >

                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFE3B3] text-xs font-bold text-[#EA6113]">
                            {item.icon}
                          </div>

                          <span className="text-[11px] font-medium leading-4 text-gray-400">
                            {item.label}
                          </span>

                        </div>
                      )
                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
