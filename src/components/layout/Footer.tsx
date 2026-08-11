import logo from '../../imports/4.png'

type Page = 'home' | 'zakat'

interface FooterProps {
  onNavigate: (page: Page) => void
}

const socialLinks = [
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: 'Twitter/X',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
]

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Mountain silhouette divider */}
      <div className="w-full overflow-hidden bg-[#FFF8F2]">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full block">
          <path d="M0 0 L0 60 L180 30 L360 50 L540 15 L720 45 L900 20 L1080 48 L1260 25 L1440 40 L1440 0 Z" fill="#111827" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img src={logo} alt="LAZISMU Kabupaten Pemalang" className="h-14 w-auto object-contain" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Lembaga Amil Zakat, Infak, dan Sedekah Muhammadiyah Kabupaten Pemalang.
              Amanah, transparan, dan berdampak.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-gray-800 text-gray-400 hover:bg-[#F58220] hover:text-white flex items-center justify-center transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Layanan
            </h4>
            <ul className="space-y-2.5 text-sm">
              {['Donasi Online', 'Kalkulator Zakat', 'Laporan Keuangan', 'Daftar Relawan', 'Program Beasiswa'].map(l => (
                <li key={l}>
                  <button
                    onClick={() => l === 'Kalkulator Zakat' ? onNavigate('zakat') : undefined}
                    className="text-gray-400 hover:text-[#F58220] transition-colors text-left"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Program
            </h4>
            <ul className="space-y-2.5 text-sm">
              {['Pendidikan', 'Kesehatan', 'Ekonomi', 'Sosial Dakwah', 'Kemanusiaan', 'lingkungan'].map(l => (
                <li key={l}>
                  <a href="#programs" className="text-gray-400 hover:text-[#F58220] transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Kontak
            </h4>
            <ul className="space-y-3 text-sm text-gray-400 mb-6">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-[#F58220] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Jl. Ahmad Yani No. 12, Pemalang, Jawa Tengah 52312</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#F58220]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>(0284) 321-456</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#F58220]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@lazismu-pemalang.or.id</span>
              </li>
            </ul>

    
            <div>
              <div></div>
              <div>
                <button>
                  <svg >
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>© 2025 LAZISMU Kabupaten Pemalang. Semua hak dilindungi.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#F58220] transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-[#F58220] transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-[#F58220] transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
