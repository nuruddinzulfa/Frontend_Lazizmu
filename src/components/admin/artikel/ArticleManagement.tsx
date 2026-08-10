'use client'

import { useState } from 'react'

interface Article {
  id: number
  title: string
  category: string
  author: string
  date: string
  status: 'Published' | 'Draft'
  views: number
}

const initialArticles: Article[] = [
  {
    id: 1,
    title: 'Keutamaan Menunaikan Zakat di Bulan Ramadhan',
    category: 'Zakat',
    author: 'Admin LAZISMU',
    date: '14 Jan 2025',
    status: 'Published',
    views: 1560,
  },
  {
    id: 2,
    title: 'Cara Menghitung Zakat Maal dengan Benar',
    category: 'Zakat',
    author: 'Admin LAZISMU',
    date: '8 Jan 2025',
    status: 'Published',
    views: 1280,
  },
  {
    id: 3,
    title: 'Mengenal Infaq dan Sedekah dalam Islam',
    category: 'Keislaman',
    author: 'Admin LAZISMU',
    date: '3 Jan 2025',
    status: 'Published',
    views: 945,
  },
  {
    id: 4,
    title: 'Pentingnya Pendidikan bagi Generasi Masa Depan',
    category: 'Pendidikan',
    author: 'Admin LAZISMU',
    date: '25 Des 2024',
    status: 'Published',
    views: 830,
  },
  {
    id: 5,
    title: 'Panduan Berdonasi Melalui LAZISMU',
    category: 'Panduan',
    author: 'Admin LAZISMU',
    date: '18 Des 2024',
    status: 'Draft',
    views: 0,
  },
]

export default function ArticleManagement() {
  const [articles, setArticles] =
    useState<Article[]>(initialArticles)

  const [search, setSearch] = useState('')

  const filteredArticles = articles.filter(
    (article) =>
      article.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      article.category
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      article.author
        .toLowerCase()
        .includes(search.toLowerCase())
  )

  const publishedArticles = articles.filter(
    (article) => article.status === 'Published'
  ).length

  const draftArticles = articles.filter(
    (article) => article.status === 'Draft'
  ).length

  const totalViews = articles.reduce(
    (total, article) => total + article.views,
    0
  )

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin menghapus artikel ini?'
    )

    if (!confirmed) return

    setArticles((current) =>
      current.filter((article) => article.id !== id)
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
            Artikel
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola artikel dan informasi edukasi LAZISMU.
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          + Tambah Artikel
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Total Artikel
          </p>

          <p className="mt-1 text-xl font-bold text-gray-900">
            {articles.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Published
          </p>

          <p className="mt-1 text-xl font-bold text-green-600">
            {publishedArticles}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Draft
          </p>

          <p className="mt-1 text-xl font-bold text-gray-500">
            {draftArticles}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Total Dilihat
          </p>

          <p className="mt-1 text-xl font-bold text-[#F58220]">
            {totalViews.toLocaleString('id-ID')}
          </p>
        </div>

      </div>

      {/* Filter */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

        <div className="grid gap-4 lg:grid-cols-2">

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Cari Artikel
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul, kategori, atau penulis..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Status
            </label>

            <select
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            >
              <option>Semua Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>

        </div>

      </div>

      {/* Article Table */}
      <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">

        <div className="border-b border-gray-100 p-5">
          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Daftar Artikel
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Menampilkan {filteredArticles.length} artikel.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-50">
              <tr>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Judul Artikel
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Kategori
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Penulis
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Tanggal
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Dilihat
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

              {filteredArticles.map((article) => (
                <tr
                  key={article.id}
                  className="transition-colors hover:bg-gray-50"
                >

                  {/* Title */}
                  <td className="max-w-sm px-5 py-4">
                    <div className="font-medium leading-5 text-gray-900">
                      {article.title}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-[#F58220]">
                      {article.category}
                    </span>
                  </td>

                  {/* Author */}
                  <td className="px-5 py-4 text-gray-600">
                    {article.author}
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-xs text-gray-500">
                    {article.date}
                  </td>

                  {/* Views */}
                  <td className="px-5 py-4 text-gray-600">
                    {article.views.toLocaleString('id-ID')}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        article.status === 'Published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {article.status}
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
                          handleDelete(article.id)
                        }
                        className="text-xs font-medium text-red-500 hover:underline"
                      >
                        Hapus
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

              {filteredArticles.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-sm text-gray-400"
                  >
                    Artikel tidak ditemukan.
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