'use client'

import API_URL from '../../../lib/api'
import { useEffect, useMemo, useState } from 'react'
import RichTextEditor from '../../RichTextEditor'
import {
  getAdminArticles,
  getAdminArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  type Article,
  type ArticlePayload,
} from '../../../service/article.service'

type FormMode = 'create' | 'edit'

type ArticleCategory =
  | 'Zakat'
  | 'Infaq'
  | 'Sedekah'
  | 'Wakaf'
  | 'Fiqih'
  | 'Inspirasi'

interface ArticleForm {
  title: string
  excerpt: string
  content: string
  category: ArticleCategory
  status: 'draft' | 'published'
  thumbnail: File | null
}

const emptyForm: ArticleForm = {
  title: '',
  excerpt: '',
  content: '',
  category: 'Zakat',
  status: 'draft',
  thumbnail: null,
}

const categoryOptions: ArticleCategory[] = [
  'Zakat',
  'Infaq',
  'Sedekah',
  'Wakaf',
  'Fiqih',
  'Inspirasi',
]


function getThumbnailUrl(thumbnail: string | null) {
  if (!thumbnail) return null

  if (
    thumbnail.startsWith('http://') ||
    thumbnail.startsWith('https://')
  ) {
    return thumbnail
  }

  const cleanThumbnail = thumbnail
    .replace(/^\/+/, '')
    .replace(/^storage\//, '')

  const backendUrl = API_URL.replace(/\/api\/?$/, '')

  return `${backendUrl}/storage/${cleanThumbnail}`
}

export default function ArticleManagement() {
  const [articles, setArticles] = useState<Article[]>([])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState<'all' | 'published' | 'draft'>('all')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] =
    useState<number | null>(null)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [formMode, setFormMode] =
    useState<FormMode>('create')

  const [editingId, setEditingId] =
    useState<number | null>(null)

  const [form, setForm] =
    useState<ArticleForm>(emptyForm)

  const [detailArticle, setDetailArticle] =
    useState<Article | null>(null)

  const [loadingDetail, setLoadingDetail] =
    useState(false)

  /*
  |--------------------------------------------------------------------------
  | GET ARTICLES
  |--------------------------------------------------------------------------
  */

  const loadArticles = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getAdminArticles()

      setArticles(data)
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil data artikel.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadArticles()
  }, [])

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filteredArticles = useMemo(() => {
    const keyword = search.toLowerCase().trim()

    return articles.filter((article) => {
      const matchesSearch =
        !keyword ||
        article.title
          .toLowerCase()
          .includes(keyword) ||
        article.category
          .toLowerCase()
          .includes(keyword) ||
        article.slug
          .toLowerCase()
          .includes(keyword)

      const matchesStatus =
        statusFilter === 'all' ||
        article.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [articles, search, statusFilter])

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const publishedArticles = articles.filter(
    (article) => article.status === 'published'
  ).length

  const draftArticles = articles.filter(
    (article) => article.status === 'draft'
  ).length

  const totalViews = articles.reduce(
    (total, article) =>
      total + article.views,
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

    setShowForm(true)
  }

  const openEditForm = async (id: number) => {
    try {
      setLoadingDetail(true)
      setError('')
      setSuccess('')

      const article =
        await getAdminArticleById(id)

      setFormMode('edit')
      setEditingId(article.id)

      setForm({
        title: article.title,
        excerpt: article.excerpt ?? '',
        content: article.content,
        category: article.category,
        status: article.status,
        thumbnail: null,
      })

      setShowForm(true)
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil detail artikel.'
      )
    } finally {
      setLoadingDetail(false)
    }
  }

  const closeForm = () => {
    if (submitting) return

    setShowForm(false)
    setEditingId(null)
    setFormMode('create')
    setForm(emptyForm)
  }

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError('Judul artikel wajib diisi.')
      return
    }

    if (!form.content.trim()) {
      setError('Isi artikel wajib diisi.')
      return
    }

    if (!form.category) {
      setError('Kategori artikel wajib dipilih.')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      const payload: ArticlePayload = {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        category: form.category,
        status: form.status,
        thumbnail: form.thumbnail,
      }

      if (formMode === 'create') {
        await createArticle(payload)

        await loadArticles()

        setSuccess(
          'Artikel berhasil ditambahkan.'
        )

        closeForm()
        return
      }

      if (
        formMode === 'edit' &&
        editingId !== null
      ) {
        await updateArticle(
          editingId,
          payload
        )

        await loadArticles()

        setSuccess(
          'Artikel berhasil diperbarui.'
        )

        closeForm()
        return
      }

      closeForm()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan artikel.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | DETAIL
  |--------------------------------------------------------------------------
  */

  const handleDetail = async (id: number) => {
    try {
      setLoadingDetail(true)
      setError('')

      const article =
        await getAdminArticleById(id)

      setDetailArticle(article)
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil detail artikel.'
      )
    } finally {
      setLoadingDetail(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin menghapus artikel ini?'
    )

    if (!confirmed) return

    try {
      setDeletingId(id)
      setError('')
      setSuccess('')

      await deleteArticle(id)

      setArticles((current) =>
        current.filter(
          (article) =>
            article.id !== id
        )
      )

      setSuccess(
        'Artikel berhasil dihapus.'
      )
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menghapus artikel.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  const formatDate = (
    date: string | null
  ) => {
    if (!date) return '-'

    return new Date(date).toLocaleDateString(
      'id-ID',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    )
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-5">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1
            className="text-lg font-bold text-gray-900"
            style={{
              fontFamily:
                "'Times New Roman', sans-serif",
            }}
          >
            Artikel
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola artikel dan informasi edukasi
            Lazismu.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          + Tambah Artikel
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* STATISTICS */}

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

      {/* FILTER */}

      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

        <div className="grid gap-4 lg:grid-cols-2">

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Cari Artikel
            </label>

            <input
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
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Status
            </label>

            <select
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

      {/* TABLE */}

      <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">

        <div className="border-b border-gray-100 p-5">

          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily:
                "'Times New Roman', sans-serif",
            }}
          >
            Daftar Artikel
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Menampilkan{' '}
            {filteredArticles.length}{' '}
            artikel.
          </p>

        </div>

        {loading ? (
          <div className="px-5 py-12 text-center text-sm text-gray-400">
            Memuat artikel...
          </div>
        ) : (
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

                {filteredArticles.map(
                  (article) => (

                    <tr
                      key={article.id}
                      className="transition-colors hover:bg-gray-50"
                    >

                      {/* TITLE */}

                      <td className="max-w-sm px-5 py-4">

                        <div className="font-medium leading-5 text-gray-900">
                          {article.title}
                        </div>

                        <div className="mt-1 text-xs text-gray-400">
                          /{article.slug}
                        </div>

                      </td>

                      {/* CATEGORY */}

                      <td className="px-5 py-4">

                        <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-[#F58220]">
                          {article.category}
                        </span>

                      </td>

                      {/* AUTHOR */}

                      <td className="px-5 py-4 text-gray-600">
                        {article.created_by
                          ? `Admin #${article.created_by}`
                          : '-'}
                      </td>

                      {/* DATE */}

                      <td className="px-5 py-4 text-xs text-gray-500">
                        {formatDate(
                          article.published_at ??
                          article.created_at
                        )}
                      </td>

                      {/* VIEWS */}

                      <td className="px-5 py-4 text-gray-600">
                        {article.views.toLocaleString(
                          'id-ID'
                        )}
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${article.status ===
                              'published'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          {article.status ===
                            'published'
                            ? 'Published'
                            : 'Draft'}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <button
                            type="button"
                            onClick={() =>
                              handleDetail(
                                article.id
                              )
                            }
                            className="text-xs font-medium text-[#F58220] hover:underline"
                          >
                            Detail
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(
                                article.id
                              )
                            }
                            className="text-xs font-medium text-blue-600 hover:underline"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={
                              deletingId ===
                              article.id
                            }
                            onClick={() =>
                              handleDelete(
                                article.id
                              )
                            }
                            className="text-xs font-medium text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId ===
                              article.id
                              ? 'Menghapus...'
                              : 'Hapus'}
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

                {!loading &&
                  filteredArticles.length ===
                  0 && (
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
        )}

      </div>

      {/* ================================================================
          FORM MODAL
      ================================================================ */}

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-6">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {formMode === 'create'
                    ? 'Tambah Artikel'
                    : 'Edit Artikel'}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Lengkapi data artikel di bawah.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg px-3 py-1.5 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>

            </div>

            <div className="space-y-5 p-6">

              {/* TITLE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Judul Artikel
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Masukkan judul artikel"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                />
              </div>

              {/* EXCERPT */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Ringkasan
                </label>

                <textarea
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      excerpt:
                        e.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Ringkasan artikel..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                />
              </div>

              {/* CATEGORY + STATUS */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Kategori
                  </label>

                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        category:
                          e.target.value as ArticleCategory,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                  >
                    {categoryOptions.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        status:
                          e.target.value as
                          | 'draft'
                          | 'published',
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                  >
                    <option value="draft">
                      Draft
                    </option>

                    <option value="published">
                      Published
                    </option>
                  </select>
                </div>

              </div>

              {/* CONTENT */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Isi Artikel
                </label>

                <RichTextEditor
                  value={form.content}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      content: value,
                    }))
                  }
                  placeholder="Tulis isi berita..."
                />
              </div>

              {/* THUMBNAIL */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Thumbnail
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      thumbnail:
                        e.target.files?.[0] ??
                        null,
                    }))
                  }
                  className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />

                <p className="mt-1 text-xs text-gray-400">
                  JPG, JPEG, PNG, atau WEBP. Maksimal
                  2MB.
                </p>

                {formMode === 'edit' &&
                  editingId !== null &&
                  !form.thumbnail &&
                  getThumbnailUrl(
                    articles.find((article) => article.id === editingId)
                      ?.thumbnail ?? null
                  ) && (
                    <div className="mt-3">
                      <p className="mb-2 text-xs font-medium text-gray-500">
                        Thumbnail saat ini
                      </p>

                      <img
                        src={
                          getThumbnailUrl(
                            articles.find(
                              (article) => article.id === editingId
                            )?.thumbnail ?? null
                          )!
                        }
                        alt="Thumbnail artikel saat ini"
                        className="h-40 w-full max-w-sm rounded-xl border border-gray-100 object-cover"
                      />
                    </div>
                  )}


              </div>

            </div>

            {/* FORM FOOTER */}

            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">

              <button
                type="button"
                onClick={closeForm}
                disabled={submitting}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
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
                    ? 'Simpan Artikel'
                    : 'Simpan Perubahan'}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================================================================
          DETAIL MODAL
      ================================================================ */}

      {detailArticle && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-4 py-6">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">

              <h2 className="text-lg font-bold text-gray-900">
                Detail Artikel
              </h2>

              <button
                type="button"
                onClick={() =>
                  setDetailArticle(null)
                }
                className="rounded-lg px-3 py-1.5 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>

            </div>

            <div className="space-y-5 p-6">

              {getThumbnailUrl(detailArticle.thumbnail) && (
                <img
                  src={getThumbnailUrl(detailArticle.thumbnail)!}
                  alt={detailArticle.title}
                  className="h-64 w-full rounded-xl object-cover"
                />
              )}

              <div>

                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-[#F58220]">
                  {detailArticle.category}
                </span>

                <h3 className="mt-3 text-2xl font-bold text-gray-900">
                  {detailArticle.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {detailArticle.excerpt}
                </p>

              </div>

              <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-4">

                <div>
                  <p className="text-xs text-gray-400">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    {detailArticle.status}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Views
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    {detailArticle.views.toLocaleString(
                      'id-ID'
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Created By
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    {detailArticle.created_by ??
                      '-'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Tanggal
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    {formatDate(
                      detailArticle.created_at
                    )}
                  </p>
                </div>

              </div>

              <div>

                <h4 className="mb-2 text-sm font-bold text-gray-900">
                  Isi Artikel
                </h4>

                <div
                  className="prose prose-sm max-w-none rounded-xl border border-gray-100 p-4 text-gray-600 prose-headings:text-gray-900 prose-a:text-[#F58220] prose-strong:text-gray-900"
                  dangerouslySetInnerHTML={{
                    __html: detailArticle.content,
                  }}
                />

              </div>

            </div>

          </div>

        </div>
      )}

      {/* DETAIL LOADING */}

      {loadingDetail && (
        <div className="fixed bottom-5 right-5 z-[120] rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">
          Memuat data...
        </div>
      )}

    </div>
  )
}