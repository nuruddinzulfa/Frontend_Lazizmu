'use client'

import { useState } from 'react'

interface News {
    id: number
    title: string
    category: string
    author: string
    date: string
    status: 'Published' | 'Draft'
    views: number
}

const initialNews: News[] = [
    {
        id: 1,
        title: 'LAZISMU Pemalang Salurkan Bantuan Pendidikan',
        category: 'Pendidikan',
        author: 'Admin LAZISMU',
        date: '15 Jan 2025',
        status: 'Published',
        views: 1240,
    },
    {
        id: 2,
        title: 'Program Bantuan Pangan untuk Masyarakat Pemalang',
        category: 'Sosial',
        author: 'Admin LAZISMU',
        date: '10 Jan 2025',
        status: 'Published',
        views: 980,
    },
    {
        id: 3,
        title: 'LAZISMU Pemalang Tingkatkan Penghimpunan Zakat',
        category: 'Zakat',
        author: 'Admin LAZISMU',
        date: '5 Jan 2025',
        status: 'Published',
        views: 756,
    },
    {
        id: 4,
        title: 'Pembangunan Masjid Melalui Program Filantropi',
        category: 'Dakwah',
        author: 'Admin LAZISMU',
        date: '28 Des 2024',
        status: 'Published',
        views: 642,
    },
    {
        id: 5,
        title: 'Persiapan Program Tanggap Bencana LAZISMU',
        category: 'Kemanusiaan',
        author: 'Admin LAZISMU',
        date: '20 Des 2024',
        status: 'Draft',
        views: 0,
    },
]

export default function NewsManagement() {
    const [news, setNews] = useState<News[]>(initialNews)
    const [search, setSearch] = useState('')

    const [showAddForm, setShowAddForm] = useState(false)

    const [newNews, setNewNews] = useState({
        title: '',
        category: '',
        author: 'Admin LAZISMU',
        date: '',
        status: 'Draft' as News['status'],
    })

    const filteredNews = news.filter(
        (item) =>
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase()) ||
            item.author.toLowerCase().includes(search.toLowerCase())
    )

    const publishedNews = news.filter(
        (item) => item.status === 'Published'
    ).length

    const draftNews = news.filter(
        (item) => item.status === 'Draft'
    ).length

    const totalViews = news.reduce(
        (total, item) => total + item.views,
        0
    )

    const handleDelete = (id: number) => {
        const confirmed = window.confirm(
            'Apakah Anda yakin ingin menghapus berita ini?'
        )

        if (!confirmed) return

        setNews((current) =>
            current.filter((item) => item.id !== id)
        )
    }

    const handleAddNews = () => {
        if (
            !newNews.title.trim() ||
            !newNews.category.trim() ||
            !newNews.date
        ) {
            alert('Judul, kategori, dan tanggal wajib diisi.')
            return
        }

        const newItem: News = {
            id:
                news.length > 0
                    ? Math.max(...news.map((item) => item.id)) + 1
                    : 1,
            title: newNews.title.trim(),
            category: newNews.category.trim(),
            author: newNews.author.trim() || 'Admin LAZISMU',
            date: newNews.date,
            status: newNews.status,
            views: 0,
        }

        setNews((current) => [newItem, ...current])

        setNewNews({
            title: '',
            category: '',
            author: 'Admin LAZISMU',
            date: '',
            status: 'Draft',
        })

        setShowAddForm(false)
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
                        Berita
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Kelola berita yang ditampilkan pada website LAZISMU.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                    + Tambah Berita
                </button>
            </div>

            {/* Form Tambah Berita */}
            {showAddForm && (
                <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2
                                className="font-bold text-gray-900"
                                style={{
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                }}
                            >
                                Tambah Berita
                            </h2>

                            <p className="mt-1 text-xs text-gray-400">
                                Tambahkan berita baru untuk ditampilkan pada website LAZISMU.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="text-sm text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Judul */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-xs font-medium text-gray-600">
                                Judul Berita
                            </label>

                            <input
                                type="text"
                                value={newNews.title}
                                onChange={(e) =>
                                    setNewNews({
                                        ...newNews,
                                        title: e.target.value,
                                    })
                                }
                                placeholder="Masukkan judul berita..."
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                            />
                        </div>

                        {/* Kategori */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-600">
                                Kategori
                            </label>

                            <select
                                value={newNews.category}
                                onChange={(e) =>
                                    setNewNews({
                                        ...newNews,
                                        category: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                            >
                                <option value="">Pilih Kategori</option>
                                <option value="Pendidikan">Pendidikan</option>
                                <option value="Sosial">Sosial</option>
                                <option value="Zakat">Zakat</option>
                                <option value="Dakwah">Dakwah</option>
                                <option value="Kemanusiaan">Kemanusiaan</option>
                            </select>
                        </div>

                        {/* Tanggal */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-600">
                                Tanggal
                            </label>

                            <input
                                type="date"
                                value={newNews.date}
                                onChange={(e) =>
                                    setNewNews({
                                        ...newNews,
                                        date: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                            />
                        </div>

                        {/* Penulis */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-600">
                                Penulis
                            </label>

                            <input
                                type="text"
                                value={newNews.author}
                                onChange={(e) =>
                                    setNewNews({
                                        ...newNews,
                                        author: e.target.value,
                                    })
                                }
                                placeholder="Nama penulis..."
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-600">
                                Status
                            </label>

                            <select
                                value={newNews.status}
                                onChange={(e) =>
                                    setNewNews({
                                        ...newNews,
                                        status: e.target.value as News['status'],
                                    })
                                }
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                            >
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                            </select>
                        </div>
                    </div>

                    {/* Tombol */}
                    <div className="mt-5 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                        >
                            Batal
                        </button>

                        <button
                            type="button"
                            onClick={handleAddNews}
                            className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                        >
                            Simpan Berita
                        </button>
                    </div>
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4"></div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
                    <p className="text-xs text-gray-500">
                        Total Berita
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-900">
                        {news.length}
                    </p>
                </div>

                <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
                    <p className="text-xs text-gray-500">
                        Published
                    </p>

                    <p className="mt-1 text-xl font-bold text-green-600">
                        {publishedNews}
                    </p>
                </div>

                <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
                    <p className="text-xs text-gray-500">
                        Draft
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-500">
                        {draftNews}
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
                            Cari Berita
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

            {/* News Table */}
            <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">
                <div className="border-b border-gray-100 p-5">
                    <h2
                        className="font-bold text-gray-900"
                        style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                    >
                        Daftar Berita
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                        Menampilkan {filteredNews.length} berita.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Judul Berita
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
                            {filteredNews.map((item) => (
                                <tr
                                    key={item.id}
                                    className="transition-colors hover:bg-gray-50"
                                >
                                    {/* Title */}
                                    <td className="max-w-sm px-5 py-4">
                                        <div className="font-medium leading-5 text-gray-900">
                                            {item.title}
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="px-5 py-4">
                                        <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-[#F58220]">
                                            {item.category}
                                        </span>
                                    </td>

                                    {/* Author */}
                                    <td className="px-5 py-4 text-gray-600">
                                        {item.author}
                                    </td>

                                    {/* Date */}
                                    <td className="px-5 py-4 text-xs text-gray-500">
                                        {item.date}
                                    </td>

                                    {/* Views */}
                                    <td className="px-5 py-4 text-gray-600">
                                        {item.views.toLocaleString('id-ID')}
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-4">
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'Published'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {item.status}
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
                                                    handleDelete(item.id)
                                                }
                                                className="text-xs font-medium text-red-500 hover:underline"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredNews.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-5 py-10 text-center text-sm text-gray-400"
                                    >
                                        Berita tidak ditemukan.
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