import { useState } from 'react'
import type { NavPage } from '../../App'
import logo from '../../imports/3-2.png'

interface RegisterPageProps {
  onNavigate?: (page: NavPage) => void
}

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [form, setForm] = useState({ nama: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [agreed, setAgreed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.nama || !form.email || !form.phone || !form.password) {
      setError('Semua field wajib diisi.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Kata sandi dan konfirmasi tidak cocok.')
      return
    }
    if (!agreed) {
      setError('Anda harus menyetujui syarat dan ketentuan.')
      return
    }
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md bg-white border border-[#F3DEC8] rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <img src={logo} alt="Lazismu Pemalang" className="h-16 w-auto object-contain mx-auto mb-1" />
          <h1 className="text-2xl font-bold text-gray-900 mt-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Daftar Akun Baru</h1>
          <p className="text-sm text-gray-500 mt-1">Bergabung dan mulai berdonasi dengan mudah</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Nama Lengkap', field: 'nama', type: 'text', placeholder: 'Ahmad Fauzi' },
            { label: 'Email', field: 'email', type: 'email', placeholder: 'email@anda.com' },
            { label: 'No. HP', field: 'phone', type: 'tel', placeholder: '08xxxxxxxxxx' },
            { label: 'Kata Sandi', field: 'password', type: 'password', placeholder: '••••••••' },
            { label: 'Konfirmasi Kata Sandi', field: 'confirmPassword', type: 'password', placeholder: '••••••••' },
          ].map(({ label, field, type, placeholder }) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
              <input
                type={type}
                value={form[field as keyof typeof form]}
                onChange={update(field)}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-[#F3DEC8] rounded-xl text-sm focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#FEF0E4] transition-all"
              />
            </div>
          ))}

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#F58220]"
            />
            <span className="text-sm text-gray-600">
              Saya menyetujui{' '}
              <button type="button" className="text-[#F58220] hover:underline font-semibold">Syarat &amp; Ketentuan</button>
              {' '}dan{' '}
              <button type="button" className="text-[#F58220] hover:underline font-semibold">Kebijakan Privasi</button>
            </span>
          </label>

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
            ) : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?{' '}
          <button onClick={() => onNavigate?.('login')} className="text-[#F58220] font-semibold hover:underline">
            Masuk
          </button>
        </p>
      </div>
    </div>
  )
}
