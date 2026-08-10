import { useState } from 'react'
import type { NavPage } from '../../App'
import { login } from "@/service/auth.service";

interface LoginPageProps {
  onNavigate?: (page: NavPage) => void
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError("");

    if (!email || !password) {
        setError("Email dan kata sandi wajib diisi.");
        return;
    }

    try {

        setIsLoading(true);

        const result = await login({
    email,
    password,
});

console.log(result);

localStorage.setItem(
    "token",
    result.data.token
);

localStorage.setItem(
    "user",
    JSON.stringify(result.data.user)
);

const role = result.data.user.role;

if (
    role === "Super Admin" ||
    role === "Admin Donasi" ||
    role === "Admin Konten"
) {
    onNavigate?.("dashboard");
} else {
    setError("Role pengguna tidak dikenali.");
}

alert("Login berhasil!");

    } catch (err: any) {

        setError(err.message);

    } finally {

        setIsLoading(false);

    }

};

    // setIsLoading(true)
    // // await new Promise(r => setTimeout(r, 1500))
    // setIsLoading(false)
    // setError('Email atau kata sandi tidak valid.')
  

  return (
    <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md bg-white border border-[#F3DEC8] rounded-2xl shadow-sm p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F58220] to-[#D96D0A] flex items-center justify-center mx-auto mb-3">
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
              <path d="M20 6 L26 14 L34 14 L28 20 L31 29 L20 23 L9 29 L12 20 L6 14 L14 14 Z" fill="white" opacity="0.9" />
            </svg>
          </div>
          <div className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>LAZISMU Pemalang</div>
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

