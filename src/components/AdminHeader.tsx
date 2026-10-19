'use client'

import React from 'react'

interface AdminHeaderProps {
  title?: string
  subtitle?: string
}

interface UserData {
  name?: string
  role?: string
}

export default function AdminHeader({
  title,
  subtitle = 'Panel Administrasi Lazismu Pemalang',
}: AdminHeaderProps) {
  const [user, setUser] = React.useState<UserData | null>(null)

  React.useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')

      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Gagal membaca data user:', error)
    }
  }, [])

  const displayName = user?.name || 'Pengguna'
  const displayRole = user?.role || 'Administrator'

  const displayTitle =
    title ||
    (user?.role === 'Admin Konten'
      ? 'Dashboard Admin Konten'
      : user?.role === 'Admin Donasi'
        ? 'Dashboard Admin Donasi'
        : 'Dashboard Super Admin')

  return (
    <header className="sticky top-0 z-30 border-b border-[#EDE1D4] bg-white/95 shadow-[0_5px_22px_rgba(32,38,49,0.035)] backdrop-blur-xl">
          <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ============================================================
            LEFT - PAGE IDENTITY
        ============================================================ */}

        <div className="min-w-0">
          <h1
            className="truncate text-lg font-bold tracking-[-0.025em] text-[#202631]"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {displayTitle}
          </h1>

          <p className="hidden truncate text-xs text-gray-500 sm:block">
            {subtitle}
          </p>
        </div>

        {/* ============================================================
            RIGHT - ADMIN PROFILE
        ============================================================ */}

        <div className="flex items-center">

          {/* Divider */}

          <div className="hidden h-8 w-px bg-gray-200 sm:block" />

          {/* Admin Profile */}

          <div className="flex items-center gap-3 px-2 py-1.5">

            {/* Name & Role */}

            <div className="hidden text-right sm:block">
              <div
                className="text-sm font-semibold text-gray-900"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {displayName}
              </div>

              <div className="text-xs text-gray-500">
                {displayRole}
              </div>
            </div>

            {/* Avatar */}

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-[#F58220]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 20.25a7.5 7.5 0 0115 0"
                />
              </svg>
            </div>

          </div>
        </div>
      </div>
    </header>
  )
}
