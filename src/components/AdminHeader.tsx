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
  subtitle = 'Panel Administrasi LAZISMU Kabupaten Pemalang',
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
    <header className="sticky top-0 z-30 border-b border-orange-100 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left - Page Identity */}
        <div className="min-w-0">
          <h1
            className="truncate text-lg font-bold text-gray-900"
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

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Notification */}
          <button
            type="button"
            aria-label="Notifikasi"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-orange-50 hover:text-[#F58220]"
          >
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
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9a6 6 0 00-12 0v.75a8.967 8.967 0 01-2.31 6.022c1.733.64 3.557 1.075 5.453 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>

            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F58220] px-1 text-[9px] font-bold text-white">
              3
            </span>
          </button>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-gray-200 sm:block" />

          {/* Admin Profile */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={`Profil ${displayName}`}
              className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-orange-50"
            >
              {/* Name */}
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

              {/* Dropdown indicator */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="hidden h-4 w-4 text-gray-400 sm:block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}