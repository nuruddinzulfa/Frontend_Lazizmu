'use client'

import { useState } from 'react'

export default function SettingsManagement() {
  const [siteName, setSiteName] = useState(
    'LAZISMU Kabupaten Pemalang'
  )

  const [email, setEmail] = useState(
    'admin@lazismupemalang.org'
  )

  const [phone, setPhone] = useState(
    '0284-123456'
  )

  const [address, setAddress] = useState(
    'Kabupaten Pemalang, Jawa Tengah'
  )

  const [maintenance, setMaintenance] = useState(false)

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 3000)
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1
          className="text-lg font-bold text-gray-900"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Pengaturan
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Kelola pengaturan sistem administrasi LAZISMU.
        </p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Pengaturan berhasil disimpan.
        </div>
      )}

      {/* General Settings */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

        <div className="mb-5">
          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Informasi Website
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Informasi dasar yang digunakan pada website
            LAZISMU.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {/* Site Name */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Nama Website
            </label>

            <input
              type="text"
              value={siteName}
              onChange={(event) =>
                setSiteName(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Email Administrasi
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Nomor Telepon
            </label>

            <input
              type="text"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            />
          </div>

          {/* Address */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Alamat
            </label>

            <input
              type="text"
              value={address}
              onChange={(event) =>
                setAddress(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            />
          </div>

        </div>
      </div>

      {/* System Settings */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

        <div className="mb-5">
          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Pengaturan Sistem
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Pengaturan operasional sistem administrasi.
          </p>
        </div>

        <div className="space-y-5">

          {/* Maintenance */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">

            <div>
              <div className="text-sm font-semibold text-gray-900">
                Mode Maintenance
              </div>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                Aktifkan jika website sedang dalam proses
                pemeliharaan.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setMaintenance(!maintenance)
              }
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                maintenance
                  ? 'bg-[#F58220]'
                  : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                  maintenance
                    ? 'left-6'
                    : 'left-1'
                }`}
              />
            </button>

          </div>

          {/* Session */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">

            <div>
              <div className="text-sm font-semibold text-gray-900">
                Keamanan Sesi
              </div>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                Sesi login administrator dilindungi
                menggunakan autentikasi sistem.
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
              Aktif
            </span>

          </div>

        </div>
      </div>

      {/* Access Information */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

        <div className="mb-5">
          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Informasi Hak Akses
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Pengaturan hak akses dilakukan berdasarkan
            role administrator.
          </p>
        </div>

        <div className="space-y-3">

          <div className="flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3">
            <span className="text-sm font-medium text-gray-700">
              Super Admin
            </span>

            <span className="text-xs font-semibold text-[#F58220]">
              Akses Penuh
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
            <span className="text-sm font-medium text-gray-700">
              Admin Donasi
            </span>

            <span className="text-xs font-semibold text-blue-600">
              Donasi & Campaign
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-3">
            <span className="text-sm font-medium text-gray-700">
              Admin Konten
            </span>

            <span className="text-xs font-semibold text-green-600">
              Konten Website
            </span>
          </div>

        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">

        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl bg-[#F58220] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Simpan Pengaturan
        </button>

      </div>

    </div>
  )
}