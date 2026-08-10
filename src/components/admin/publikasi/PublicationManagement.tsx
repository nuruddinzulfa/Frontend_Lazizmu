'use client'

import { useState } from 'react'

interface Publication {
  id: number
  title: string
  type: 'Laporan' | 'Dokumen' | 'Brosur'
  year: number
  description: string
  status: 'Published' | 'Draft'
  downloads: number
}

const initialPublications: Publication[] = [
  {
    id: 1,
    title: 'Laporan Keuangan LAZISMU Pemalang 2024',
    type: 'Laporan',
    year: 2024,
    description:
      'Laporan keuangan dan transparansi pengelolaan dana LAZISMU.',
    status: 'Published',
    downloads: 325,
  },
  {
    id: 2,
    title: 'Laporan Tahunan LAZISMU Pemalang 2024',
    type: 'Laporan',
    year: 2024,
    description:
      'Ringkasan kegiatan dan capaian program LAZISMU selama satu tahun.',
    status: 'Published',
    downloads: 218,
  },
  {
    id: 3,
    title: 'Brosur Program LAZISMU',
    type: 'Brosur',
    year: 2025,
    description:
      'Informasi berbagai program sosial, pendidikan, kemanusiaan, dan dakwah.',
    status: 'Published',
    downloads: 184,
  },
  {
    id: 4,
    title: 'Profil LAZISMU Kabupaten Pemalang',
    type: 'Dokumen',
    year: 2025,
    description:
      'Profil organisasi dan informasi umum LAZISMU Kabupaten Pemalang.',
    status: 'Published',
    downloads: 156,
  },
  {
    id: 5,
    title: 'Laporan Program Semester I 2025',
    type: 'Laporan',
    year: 2025,
    description:
      'Dokumentasi dan laporan pelaksanaan program semester pertama.',
    status: 'Draft',
    downloads: 0,
  },
]

export default function PublicationManagement() {
  const [publications, setPublications] =
    useState<Publication[]>(initialPublications)

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('Semua')

  const filteredPublications = publications.filter((publication) => {
    const matchesSearch =
      publication.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      publication.description
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchesType =
      typeFilter === 'Semua' ||
      publication.type === typeFilter

    return matchesSearch && matchesType
  })

  const publishedCount = publications.filter(
    (publication) => publication.status === 'Published'
  ).length

  const draftCount = publications.filter(
    (publication) => publication.status === 'Draft'
  ).length

  const totalDownloads = publications.reduce(
    (total, publication) =>
      total + publication.downloads,
    0
  )

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin menghapus publikasi ini?'
    )

    if (!confirmed) return

    setPublications((current) =>
      current.filter((publication) => publication.id !== id)
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
            Publikasi
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola publikasi dan dokumen LAZISMU.
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          + Tambah Publikasi
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Total Publikasi
          </p>

          <p className="mt-1 text-xl font-bold text-gray-900">
            {publications.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Published
          </p>

          <p className="mt-1 text-xl font-bold text-green-600">
            {publishedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Draft
          </p>

          <p className="mt-1 text-xl font-bold text-gray-500">
            {draftCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Total Download
          </p>

          <p className="mt-1 text-xl font-bold text-[#F58220]">
            {totalDownloads.toLocaleString('id-ID')}
          </p>
        </div>

      </div>

      {/* Filter */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

        <div className="grid gap-4 lg:grid-cols-2">

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Cari Publikasi
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Cari judul atau deskripsi..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Jenis Publikasi
            </label>

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="Semua">
                Semua Jenis
              </option>

              <option value="Laporan">
                Laporan
              </option>

              <option value="Dokumen">
                Dokumen
              </option>

              <option value="Brosur">
                Brosur
              </option>
            </select>
          </div>

        </div>

      </div>

      {/* Publication Table */}
      <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">

        <div className="border-b border-gray-100 p-5">
          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Daftar Publikasi
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Menampilkan {filteredPublications.length} publikasi.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">

            <thead className="bg-gray-50">
              <tr>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Publikasi
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Jenis
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Tahun
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Download
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

              {filteredPublications.map((publication) => (
                <tr
                  key={publication.id}
                  className="transition-colors hover:bg-gray-50"
                >

                  {/* Publication */}
                  <td className="max-w-md px-5 py-4">

                    <div className="font-medium text-gray-900">
                      {publication.title}
                    </div>

                    <div className="mt-1 text-xs leading-5 text-gray-400">
                      {publication.description}
                    </div>

                  </td>

                  {/* Type */}
                  <td className="px-5 py-4">

                    <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-[#F58220]">
                      {publication.type}
                    </span>

                  </td>

                  {/* Year */}
                  <td className="px-5 py-4 text-gray-600">
                    {publication.year}
                  </td>

                  {/* Downloads */}
                  <td className="px-5 py-4 text-gray-600">
                    {publication.downloads.toLocaleString(
                      'id-ID'
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        publication.status === 'Published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {publication.status}
                    </span>

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

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(publication.id)
                        }
                        className="text-xs font-medium text-red-500 hover:underline"
                      >
                        Hapus
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

              {filteredPublications.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-gray-400"
                  >
                    Publikasi tidak ditemukan.
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