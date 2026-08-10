'use client'

import { useState } from 'react'

type UserRole =
  | 'Super Admin'
  | 'Admin Donasi'
  | 'Admin Konten'

type UserStatus = 'Aktif' | 'Nonaktif'

interface User {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  lastLogin: string
}

const initialUsers: User[] = [
  {
    id: 1,
    name: 'Super Admin',
    email: 'admin@lazismupemalang.org',
    role: 'Super Admin',
    status: 'Aktif',
    lastLogin: 'Hari ini, 08:30',
  },
  {
    id: 2,
    name: 'Admin Donasi',
    email: 'donasi@lazismupemalang.org',
    role: 'Admin Donasi',
    status: 'Aktif',
    lastLogin: 'Hari ini, 09:15',
  },
  {
    id: 3,
    name: 'Admin Konten',
    email: 'konten@lazismupemalang.org',
    role: 'Admin Konten',
    status: 'Aktif',
    lastLogin: 'Kemarin, 15:40',
  },
  {
    id: 4,
    name: 'Operator LAZISMU',
    email: 'operator@lazismupemalang.org',
    role: 'Admin Konten',
    status: 'Nonaktif',
    lastLogin: '10 Jan 2025',
  },
]

export default function UserManagement() {
  const [users, setUsers] =
    useState<User[]>(initialUsers)

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('Semua')
  const [statusFilter, setStatusFilter] = useState('Semua')

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase()

    const matchesSearch =
      user.name.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue)

    const matchesRole =
      roleFilter === 'Semua' ||
      user.role === roleFilter

    const matchesStatus =
      statusFilter === 'Semua' ||
      user.status === statusFilter

    return (
      matchesSearch &&
      matchesRole &&
      matchesStatus
    )
  })

  const activeUsers = users.filter(
    (user) => user.status === 'Aktif'
  ).length

  const superAdmins = users.filter(
    (user) => user.role === 'Super Admin'
  ).length

  const donationAdmins = users.filter(
    (user) => user.role === 'Admin Donasi'
  ).length

  const contentAdmins = users.filter(
    (user) => user.role === 'Admin Konten'
  ).length

  const handleDelete = (id: number) => {
    const user = users.find(
      (item) => item.id === id
    )

    if (!user) return

    if (user.role === 'Super Admin') {
      window.alert(
        'Super Admin tidak dapat dihapus dari halaman ini.'
      )
      return
    }

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus ${user.name}?`
    )

    if (!confirmed) return

    setUsers((current) =>
      current.filter((item) => item.id !== id)
    )
  }

  const handleToggleStatus = (id: number) => {
    setUsers((current) =>
      current.map((user) => {
        if (user.id !== id) return user

        return {
          ...user,
          status:
            user.status === 'Aktif'
              ? 'Nonaktif'
              : 'Aktif',
        }
      })
    )
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-lg font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Pengguna & Admin
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola pengguna, admin, dan hak akses
            sistem LAZISMU.
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          + Tambah Pengguna
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Total Pengguna
          </p>

          <p className="mt-1 text-xl font-bold text-gray-900">
            {users.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Pengguna Aktif
          </p>

          <p className="mt-1 text-xl font-bold text-green-600">
            {activeUsers}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Admin Donasi
          </p>

          <p className="mt-1 text-xl font-bold text-blue-600">
            {donationAdmins}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Admin Konten
          </p>

          <p className="mt-1 text-xl font-bold text-[#F58220]">
            {contentAdmins}
          </p>
        </div>

      </div>

      {/* Role Information */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

        <h2
          className="font-bold text-gray-900"
          style={{
            fontFamily:
              "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Hak Akses Admin
        </h2>

        <p className="mt-1 text-xs text-gray-400">
          Pembagian akses berdasarkan role pengguna.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">

          <div className="rounded-xl bg-orange-50 p-4">
            <div className="text-sm font-semibold text-[#F58220]">
              Super Admin
            </div>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Memiliki akses penuh terhadap seluruh
              fitur administrasi.
            </p>

            <div className="mt-3 text-xs font-medium text-gray-600">
              {superAdmins} pengguna
            </div>
          </div>

          <div className="rounded-xl bg-blue-50 p-4">
            <div className="text-sm font-semibold text-blue-600">
              Admin Donasi
            </div>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Mengelola donasi, transaksi, dan campaign
              penggalangan dana.
            </p>

            <div className="mt-3 text-xs font-medium text-gray-600">
              {donationAdmins} pengguna
            </div>
          </div>

          <div className="rounded-xl bg-green-50 p-4">
            <div className="text-sm font-semibold text-green-600">
              Admin Konten
            </div>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Mengelola berita, artikel, program, dan
              publikasi website.
            </p>

            <div className="mt-3 text-xs font-medium text-gray-600">
              {contentAdmins} pengguna
            </div>
          </div>

        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

        <div className="grid gap-4 md:grid-cols-3">

          {/* Search */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Cari Pengguna
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Nama atau email..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Role
            </label>

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="Semua">
                Semua Role
              </option>

              <option value="Super Admin">
                Super Admin
              </option>

              <option value="Admin Donasi">
                Admin Donasi
              </option>

              <option value="Admin Konten">
                Admin Konten
              </option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="Semua">
                Semua Status
              </option>

              <option value="Aktif">
                Aktif
              </option>

              <option value="Nonaktif">
                Nonaktif
              </option>
            </select>
          </div>

        </div>
      </div>

      {/* User Table */}
      <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">

        <div className="border-b border-gray-100 p-5">
          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Daftar Pengguna
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Menampilkan {filteredUsers.length}{' '}
            pengguna.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">

            <thead className="bg-gray-50">
              <tr>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Pengguna
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Role
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Login Terakhir
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Aksi
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">

              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-gray-50"
                >

                  {/* User */}
                  <td className="px-5 py-4">

                    <div className="font-medium text-gray-900">
                      {user.name}
                    </div>

                    <div className="mt-1 text-xs text-gray-400">
                      {user.email}
                    </div>

                  </td>

                  {/* Role */}
                  <td className="px-5 py-4">

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.role === 'Super Admin'
                          ? 'bg-orange-100 text-[#F58220]'
                          : user.role ===
                              'Admin Donasi'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {user.role}
                    </span>

                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.status === 'Aktif'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {user.status}
                    </span>

                  </td>

                  {/* Last Login */}
                  <td className="px-5 py-4 text-xs text-gray-500">
                    {user.lastLogin}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <button
                        type="button"
                        className="text-xs font-medium text-[#F58220] hover:underline"
                      >
                        Detail
                      </button>

                      <button
                        type="button"
                        className="text-xs font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </button>

                      {user.role !==
                        'Super Admin' && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleStatus(
                                user.id
                              )
                            }
                            className="text-xs font-medium text-gray-600 hover:underline"
                          >
                            {user.status ===
                            'Aktif'
                              ? 'Nonaktifkan'
                              : 'Aktifkan'}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                user.id
                              )
                            }
                            className="text-xs font-medium text-red-500 hover:underline"
                          >
                            Hapus
                          </button>
                        </>
                      )}

                    </div>

                  </td>

                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-gray-400"
                  >
                    Pengguna tidak ditemukan.
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        </div>

      </div>

    </div>
  )
}