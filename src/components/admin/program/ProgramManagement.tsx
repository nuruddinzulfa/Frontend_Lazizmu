'use client'

import { useState } from 'react'

interface Program {
  id: number
  name: string
  category: string
  description: string
  beneficiaries: number
  status: 'Aktif' | 'Tidak Aktif'
}

const initialPrograms: Program[] = [
  {
    id: 1,
    name: 'Beasiswa Pendidikan',
    category: 'Pendidikan',
    description:
      'Program bantuan pendidikan untuk anak-anak yang membutuhkan.',
    beneficiaries: 120,
    status: 'Aktif',
  },
  {
    id: 2,
    name: 'Bantuan Pangan',
    category: 'Sosial',
    description:
      'Penyaluran bantuan kebutuhan pangan bagi masyarakat kurang mampu.',
    beneficiaries: 250,
    status: 'Aktif',
  },
  {
    id: 3,
    name: 'Zakat Maal',
    category: 'Zakat',
    description:
      'Program penghimpunan dan penyaluran zakat maal kepada mustahik.',
    beneficiaries: 180,
    status: 'Aktif',
  },
  {
    id: 4,
    name: 'Pembangunan Masjid',
    category: 'Dakwah',
    description:
      'Program pembangunan dan renovasi fasilitas ibadah masyarakat.',
    beneficiaries: 80,
    status: 'Aktif',
  },
  {
    id: 5,
    name: 'Tanggap Bencana',
    category: 'Kemanusiaan',
    description:
      'Program bantuan untuk masyarakat yang terdampak bencana.',
    beneficiaries: 95,
    status: 'Tidak Aktif',
  },
]

export default function ProgramManagement() {
  const [programs, setPrograms] =
    useState<Program[]>(initialPrograms)

  const [search, setSearch] = useState('')

  const filteredPrograms = programs.filter(
    (program) =>
      program.name.toLowerCase().includes(search.toLowerCase()) ||
      program.category.toLowerCase().includes(search.toLowerCase())
  )

  const activePrograms = programs.filter(
    (program) => program.status === 'Aktif'
  ).length

  const totalBeneficiaries = programs.reduce(
    (total, program) => total + program.beneficiaries,
    0
  )

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin menghapus program ini?'
    )

    if (!confirmed) return

    setPrograms((current) =>
      current.filter((program) => program.id !== id)
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
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Program
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola seluruh program LAZISMU Kabupaten Pemalang.
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          + Tambah Program
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Total Program
          </p>

          <p className="mt-1 text-xl font-bold text-gray-900">
            {programs.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Program Aktif
          </p>

          <p className="mt-1 text-xl font-bold text-green-600">
            {activePrograms}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Program Tidak Aktif
          </p>

          <p className="mt-1 text-xl font-bold text-gray-500">
            {programs.length - activePrograms}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Total Penerima Manfaat
          </p>

          <p className="mt-1 text-xl font-bold text-[#F58220]">
            {totalBeneficiaries}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
        <label className="mb-2 block text-xs font-medium text-gray-600">
          Cari Program
        </label>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama program atau kategori..."
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
        />
      </div>

      {/* Program List */}
      <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Daftar Program
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Menampilkan {filteredPrograms.length} program.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Program
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Kategori
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Deskripsi
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Penerima
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredPrograms.map((program) => (
                <tr
                  key={program.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">
                      {program.name}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-[#F58220]">
                      {program.category}
                    </span>
                  </td>

                  <td className="max-w-xs px-5 py-4 text-xs leading-5 text-gray-500">
                    {program.description}
                  </td>

                  <td className="px-5 py-4 font-medium text-gray-700">
                    {program.beneficiaries}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        program.status === 'Aktif'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {program.status}
                    </span>
                  </td>

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
                        onClick={() =>
                          handleDelete(program.id)
                        }
                        className="text-xs font-medium text-red-500 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPrograms.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-gray-400"
                  >
                    Program tidak ditemukan.
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