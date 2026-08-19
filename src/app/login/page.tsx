import { useState } from "react";
import logo from "../../imports/3-2.png";
import type { NavPage } from "../../App";
import { authService } from "@/services/auth.service";

interface LoginPageProps {
  onNavigate?: (page: NavPage) => void;
}

export default function LoginPage({
  onNavigate,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError(
        "Email dan kata sandi wajib diisi."
      );
      return;
    }

    try {
      setIsLoading(true);

      const result = await authService.login(
        email.trim(),
        password
      );

      const user = result.data.user;

      const allowedRoles = [
        "Super Admin",
        "Admin Konten",
        "Admin Donasi",
      ];

      if (
        !user.role ||
        !allowedRoles.includes(user.role)
      ) {
        localStorage.removeItem("token");

        setError(
          "Akun Anda tidak memiliki akses ke dashboard."
        );

        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      sessionStorage.setItem(
        "adminDashboard",
        "true"
      );

      onNavigate?.("dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Login gagal."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md bg-white border border-[#F3DEC8] rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src={logo}
              alt="LAZISMU Kabupaten Pemalang"
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* <div
            className="text-lg font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            LAZISMU Pemalang
          </div> */}

          <h1
            className="text-2xl font-bold text-gray-900 mt-4"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Masuk ke Akun Anda
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Masukkan kredensial Anda untuk
            melanjutkan
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="email@anda.com"
              autoComplete="email"
              className="w-full px-4 py-3 border border-[#F3DEC8] rounded-xl text-sm focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#FEF0E4] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Kata Sandi
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="••••••••"
              autoComplete="current-password"
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
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />

                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>

                Memproses...
              </span>
            ) : (
              "Masuk"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}