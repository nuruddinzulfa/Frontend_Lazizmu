'use client'
import API_URL from "@/lib/api"
import { useEffect, useMemo, useState } from 'react'
import {
  getAdminNews,
  getAdminNewsById,
  createNews,
  updateNews,
  deleteNews,
  type News,
  type NewsPayload,
} from "@/service/news.service";

type FormMode = 'create' | 'edit' | null

interface NewsForm {
  title: string
  excerpt: string
  content: string
  category: NewsPayload['category']
  status: NewsPayload['status']
  thumbnail: File | null
}

const emptyForm: NewsForm = {
  title: '',
  excerpt: '',
  content: '',
  category: 'Kegiatan',
  status: 'draft',
  thumbnail: null,
}

const categoryColors: Record<string, string> = {
  Kegiatan: 'bg-blue-100 text-blue-700',
  Pengumuman: 'bg-yellow-100 text-yellow-700',
  Laporan: 'bg-purple-100 text-purple-700',
}

function formatDate(date: string | null) {
  if (!date) return '-'

  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getThumbnailUrl(thumbnail: string | null) {
  if (!thumbnail) return null

  // Kalau backend sudah mengirim URL lengkap
  if (
    thumbnail.startsWith('http://') ||
    thumbnail.startsWith('https://')
  ) {
    return thumbnail
  }

  // API_URL biasanya: http://127.0.0.1:8000/api
  const backendUrl = API_URL.replace(/\/api\/?$/, '')

  return `${backendUrl}/storage/${thumbnail}`
}

export default function NewsManagement() {
  const [news, setNews] = useState<News[]>([])

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'published' | 'draft'
  >('all')

  const [formMode, setFormMode] = useState<FormMode>(null)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [form, setForm] = useState<NewsForm>(emptyForm)

  /*
  |--------------------------------------------------------------------------
  | GET NEWS
  |--------------------------------------------------------------------------
  */

  const loadNews = async () => {
  try {
    setLoading(true);
    setError("");

    const data = await getAdminNews();

    setNews(data);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Gagal mengambil berita."
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadNews()
  }, [])

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filteredNews = useMemo(() => {
    const keyword = search.toLowerCase().trim()

    return news.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        item.slug.toLowerCase().includes(keyword)

      const matchesStatus =
        statusFilter === 'all' ||
        item.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [news, search, statusFilter])

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const publishedNews = news.filter(
    (item) => item.status === 'published'
  ).length

  const draftNews = news.filter(
    (item) => item.status === 'draft'
  ).length

  const totalViews = news.reduce(
    (total, item) => total + Number(item.views || 0),
    0
  )

  /*
  |--------------------------------------------------------------------------
  | FORM
  |--------------------------------------------------------------------------
  */

  const openCreateForm = () => {
    setFormMode('create')
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setSuccess('')
  }

  const openEditForm = (item: News) => {
    setFormMode('edit')
    setEditingId(item.id)

    setForm({
      title: item.title,
      excerpt: item.excerpt ?? '',
      content: item.content ?? '',
      category: item.category,
      status: item.status,
      thumbnail: null,
    })

    setError('')
    setSuccess('')
  }

  const closeForm = () => {
    if (submitting) return

    setFormMode(null)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleInputChange = (
    field: keyof NewsForm,
    value: string | File | null
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  /*
  |--------------------------------------------------------------------------
  | CREATE / UPDATE
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError('Judul berita wajib diisi.')
      return
    }

    if (!form.content.trim()) {
      setError('Isi berita wajib diisi.')
      return
    }

    if (!form.category) {
      setError('Kategori berita wajib dipilih.')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      const payload: NewsPayload = {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        category: form.category,
        status: form.status,
        thumbnail: form.thumbnail,
      }

      if (formMode === 'create') {
        const created = await createNews(payload)

        setNews((current) => [
          created,
          ...current,
        ])

        setSuccess('Berita berhasil ditambahkan.')
      }

      if (formMode === 'edit' && editingId !== null) {
        const updated = await updateNews(
          editingId,
          payload
        )

        setNews((current) =>
          current.map((item) =>
            item.id === editingId
              ? updated
              : item
          )
        )

        setSuccess('Berita berhasil diperbarui.')
      }

      closeForm()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan berita.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin menghapus berita ini?'
    )

    if (!confirmed) return

    try {
      setError('')
      setSuccess('')

      await deleteNews(id)

      setNews((current) =>
        current.filter((item) => item.id !== id)
      )

      setSuccess('Berita berhasil dihapus.')
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menghapus berita.'
      )
    }
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

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
          onClick={openCreateForm}
          className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          + Tambah Berita
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Form */}
      {formMode && (
        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2
                className="font-bold text-gray-900"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {formMode === 'create'
                  ? 'Tambah Berita'
                  : 'Edit Berita'}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                {formMode === 'create'
                  ? 'Tambahkan berita baru.'
                  : 'Perbarui informasi berita.'}
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              disabled={submitting}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            {/* Title */}
            <div className="md:col-span-2">
              <label
                htmlFor="news-title"
                className="mb-2 block text-xs font-medium text-gray-600"
              >
                Judul Berita
              </label>

              <input
                id="news-title"
                type="text"
                value={form.title}
                onChange={(e) =>
                  handleInputChange(
                    'title',
                    e.target.value
                  )
                }
                placeholder="Masukkan judul berita..."
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="news-category"
                className="mb-2 block text-xs font-medium text-gray-600"
              >
                Kategori
              </label>

              <select
                id="news-category"
                value={form.category}
                onChange={(e) =>
                  handleInputChange(
                    'category',
                    e.target.value as NewsPayload['category']
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
              >
                <option value="Kegiatan">
                  Kegiatan
                </option>

                <option value="Pengumuman">
                  Pengumuman
                </option>

                <option value="Laporan">
                  Laporan
                </option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="news-status"
                className="mb-2 block text-xs font-medium text-gray-600"
              >
                Status
              </label>

              <select
                id="news-status"
                value={form.status}
                onChange={(e) =>
                  handleInputChange(
                    'status',
                    e.target.value as NewsPayload['status']
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
              >
                <option value="draft">
                  Draft
                </option>

                <option value="published">
                  Published
                </option>
              </select>
            </div>

            {/* Excerpt */}
            <div className="md:col-span-2">
              <label
                htmlFor="news-excerpt"
                className="mb-2 block text-xs font-medium text-gray-600"
              >
                Ringkasan
              </label>

              <textarea
                id="news-excerpt"
                value={form.excerpt}
                onChange={(e) =>
                  handleInputChange(
                    'excerpt',
                    e.target.value
                  )
                }
                rows={3}
                placeholder="Ringkasan singkat berita..."
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
              />
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              <label
                htmlFor="news-content"
                className="mb-2 block text-xs font-medium text-gray-600"
              >
                Isi Berita
              </label>

              <textarea
                id="news-content"
                value={form.content}
                onChange={(e) =>
                  handleInputChange(
                    'content',
                    e.target.value
                  )
                }
                rows={10}
                placeholder="Tulis isi berita..."
                className="w-full resize-y rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
              />
            </div>

            {/* Thumbnail */}
            <div className="md:col-span-2">
              <label
                htmlFor="news-thumbnail"
                className="mb-2 block text-xs font-medium text-gray-600"
              >
                Thumbnail
              </label>

              <input
                id="news-thumbnail"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) =>
                  handleInputChange(
                    'thumbnail',
                    e.target.files?.[0] ?? null
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
              />

              <p className="mt-1 text-xs text-gray-400">
                JPG, JPEG, PNG, atau WEBP. Maksimal 2MB.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-5 flex justify-end gap-3">

            <button
              type="button"
              onClick={closeForm}
              disabled={submitting}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? 'Menyimpan...'
                : formMode === 'create'
                  ? 'Simpan Berita'
                  : 'Simpan Perubahan'}
            </button>

          </div>
        </div>
      )}

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
            <label
              htmlFor="news-search"
              className="mb-2 block text-xs font-medium text-gray-600"
            >
              Cari Berita
            </label>

            <input
              id="news-search"
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Cari judul, kategori, atau slug..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            />
          </div>

          <div>
            <label
              htmlFor="news-status-filter"
              className="mb-2 block text-xs font-medium text-gray-600"
            >
              Status
            </label>

            <select
              id="news-status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | 'all'
                    | 'published'
                    | 'draft'
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="all">
                Semua Status
              </option>

              <option value="published">
                Published
              </option>

              <option value="draft">
                Draft
              </option>
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

        {loading ? (
          <div className="px-5 py-12 text-center text-sm text-gray-400">
            Memuat berita...
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50">
                <tr>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Berita
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Kategori
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

                {filteredNews.map((item) => {

                  const thumbnailUrl =
                    getThumbnailUrl(item.thumbnail)

                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-gray-50"
                    >

                      {/* News */}
                      <td className="max-w-md px-5 py-4">

                        <div className="flex items-center gap-3">

                          {thumbnailUrl ? (
                            <img
                              src={thumbnailUrl}
                              alt={item.title}
                              className="h-14 w-20 shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400">
                              No Image
                            </div>
                          )}

                          <div className="min-w-0">

                            <div className="font-medium leading-5 text-gray-900">
                              {item.title}
                            </div>

                            <div className="mt-1 text-xs text-gray-400">
                              /{item.slug}
                            </div>

                          </div>

                        </div>

                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            categoryColors[item.category] ??
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item.category}
                        </span>

                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-xs text-gray-500">
                        {formatDate(item.published_at)}
                      </td>

                      {/* Views */}
                      <td className="px-5 py-4 text-gray-600">
                        {Number(
                          item.views || 0
                        ).toLocaleString('id-ID')}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            item.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {item.status === 'published'
                            ? 'Published'
                            : 'Draft'}
                        </span>

                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(item)
                            }
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
                  )
                })}

                {filteredNews.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-sm text-gray-400"
                    >
                      {loading
                        ? 'Memuat berita...'
                        : 'Berita tidak ditemukan.'}
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  )
}