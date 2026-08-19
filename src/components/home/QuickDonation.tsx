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
      className="relative overflow-hidden bg-gradient-to-br from-[#FFF8F2] via-[#FFF1E5] to-[#FFE3CA] py-20 sm:py-24"
    >

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[430px] w-[430px] rounded-full bg-[#F58220]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-[-100px] h-[500px] w-[500px] rounded-full bg-[#F58220]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-100px] top-[-120px] h-[340px] w-[340px] rounded-full border-2 border-[#F58220]/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-30px] top-[-50px] h-[220px] w-[220px] rounded-full border-2 border-[#F58220]/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-10 top-28 h-24 w-24 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(#F58220 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-20 right-16 h-24 w-24 opacity-20"
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

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg shadow-orange-100">

              <svg
                viewBox="0 0 80 80"
                fill="none"
                className="h-12 w-12"
              >
                <polygon
                  points="40,5 75,22 75,58 40,75 5,58 5,22"
                  stroke="#F58220"
                  strokeWidth="2"
                  opacity="0.4"
                />

                <polygon
                  points="40,18 62,29 62,51 40,62 18,51 18,29"
                  stroke="#F58220"
                  strokeWidth="1.5"
                  opacity="0.3"
                />

                <circle
                  cx="40"
                  cy="40"
                  r="12"
                  stroke="#F58220"
                  strokeWidth="2"
                  opacity="0.5"
                />

                <circle
                  cx="40"
                  cy="40"
                  r="4"
                  fill="#F58220"
                  opacity="0.8"
                />
              </svg>

            </div>


            {/* LABEL */}

            <span className="text-sm font-bold uppercase tracking-[0.14em] text-[#F58220]">
              Donasi Mudah
            </span>


            {/* TITLE */}

            <h2
              className="mt-2 mb-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl"
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Tunaikan Kebaikan
              <br />

              <span className="orange-gradient-text">
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

              <div className="absolute bottom-12 left-6 top-12 w-px bg-gradient-to-b from-[#F58220]/30 via-[#F58220]/20 to-transparent" />

              {steps.map(
                (step, index) => (
                  <div
                    key={step.n}
                    className="group relative flex items-start gap-5"
                  >

                    {/* ICON */}

                    <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-[#F3DEC8] bg-white text-[#F58220] shadow-sm transition-all duration-300 group-hover:border-[#F58220] group-hover:bg-[#F58220] group-hover:text-white group-hover:shadow-md">
                      {step.icon}
                    </div>


                    {/* TEXT */}

                    <div className="pt-0.5">

                      <div className="mb-2 flex items-center gap-2">

                        <span
                          className="rounded-full bg-[#FEF0E4] px-2.5 py-1 text-[11px] font-bold text-[#F58220]"
                          style={{
                            fontFamily:
                              "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {step.n}
                        </span>

                        <span
                          className="text-sm font-bold text-gray-800"
                          style={{
                            fontFamily:
                              "'Plus Jakarta Sans', sans-serif",
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
                className="absolute -inset-5 rounded-[38px] bg-[#F58220]/10 blur-2xl"
              />


              {/* MAIN CARD */}

              <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white p-7 shadow-[0_20px_60px_rgba(120,70,30,0.12)] sm:p-10">

                {/* CARD DECORATION */}

                <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#F58220]/10 blur-2xl" />

                <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[#FFB66F]/10 blur-2xl" />

                <div className="absolute right-6 top-6 h-20 w-20 rounded-full border border-[#F58220]/10" />

                <div className="absolute right-10 top-10 h-12 w-12 rounded-full border border-[#F58220]/10" />


                {/* CONTENT */}

                <div className="relative z-10 text-center">

                  {/* HEART */}

                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#F58220] to-[#D96D0A] shadow-lg shadow-orange-200">

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
                        "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    Siap Berdonasi?
                  </h3>


                  {/* TEXT */}

                  <p className="mx-auto mb-8 max-w-sm text-sm leading-7 text-gray-500">
                    Pilih program yang ingin Anda
                    dukung dan salurkan donasi melalui
                    layanan LAZISMU Pemalang.
                  </p>


                  {/* PRIMARY BUTTON */}

                  <button
                    onClick={() =>
                      onNavigate('donasi')
                    }
                    className="btn-primary mb-3 w-full rounded-xl py-4 text-base font-bold shadow-lg shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                    style={{
                      fontFamily:
                        "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    Mulai Berdonasi Sekarang
                  </button>


                  {/* SECONDARY BUTTON */}

                  <button
                    onClick={() =>
                      onNavigate('zakat')
                    }
                    className="w-full rounded-xl border-2 border-[#F3DEC8] bg-white py-3.5 text-sm font-semibold text-gray-600 transition-all duration-200 hover:border-[#F58220] hover:bg-[#FFF8F2] hover:text-[#F58220]"
                    style={{
                      fontFamily:
                        "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    Hitung Zakat Terlebih Dahulu →
                  </button>


                  {/* FEATURES */}

                  <div className="mt-8 grid grid-cols-3 gap-3 border-t border-[#F3DEC8] pt-6">

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

                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FEF0E4] text-xs font-bold text-[#F58220]">
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