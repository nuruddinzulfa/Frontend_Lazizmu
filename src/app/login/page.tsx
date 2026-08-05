import { useState } from 'react'
import type { NavPage } from '../../App'
import logo from '../../imports/3-2.png'

interface LoginPageProps {
  onNavigate?: (page: NavPage) => void
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Email dan kata sandi wajib diisi.')
      return
    }
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsLoading(false)
    setError('Email atau kata sandi tidak valid.')
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md bg-white border border-[#F3DEC8] rounded-2xl shadow-sm p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logo} alt="LAZISMU Kabupaten Pemalang" className="h-16 w-auto object-contain mx-auto mb-1" />
          <h1 className="text-2xl font-bold text-gray-900 mt-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Masuk ke Akun Anda</h1>
          <p className="text-sm text-gray-500 mt-1">Masukkan kredensial Anda untuk melanjutkan</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@anda.com"
              className="w-full px-4 py-3 border border-[#F3DEC8] rounded-xl text-sm focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#FEF0E4] transition-all"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-gray-700">Kata Sandi</label>
              <button type="button" className="text-xs text-[#F58220] hover:underline">Lupa Password?</button>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-[#F3DEC8] rounded-xl text-sm focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#FEF0E4] transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Memproses...
              </span>
            ) : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun?{' '}
          <button onClick={() => onNavigate?.('register')} className="text-[#F58220] font-semibold hover:underline">
            Daftar
          </button>
        </p>
      </div>
    </div>
  )
}
