'use client'

import API_URL from "@/lib/api"
import { useEffect, useMemo, useState } from 'react'
import RichTextEditor from '../../RichTextEditor'

type ProgramStatus = 'draft' | 'published'

type ProgramPillar =
  | 'Pendidikan'
  | 'Kesehatan'
  | 'Ekonomi'
  | 'Sosial'
  | 'Dakwah'
  | 'Lingkungan'

interface Program {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  thumbnail: string | null
  pillar: ProgramPillar
  status: ProgramStatus
  published_at: string | null
  views: number
  created_by: number | null
  updated_by: number | null
  sort_order: number | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

interface ProgramForm {
  title: string
  excerpt: string
  content: string
  pillar: ProgramPillar
  status: ProgramStatus
  sort_order: string
  thumbnail: File | null
}

const emptyForm: ProgramForm = {
  title: '',
  excerpt: '',
  content: '',
  pillar: 'Pendidikan',
  status: 'draft',
  sort_order: '0',
  thumbnail: null,
}

const pillarOptions: ProgramPillar[] = [
  'Pendidikan',
  'Kesehatan',
  'Ekonomi',
  'Sosial',
  'Dakwah',
  'Lingkungan',
]

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

function getBackendUrl() {
  return API_URL.replace(/\/api\/?$/, '')
}

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

  return `${getBackendUrl()}/storage/${cleanThumbnail}`
}

function formatDate(date: string | null | undefined) {
  if (!date) return '-'

  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function normalizeList(payload: unknown): Program[] {
  if (Array.isArray(payload)) {
    return payload as Program[]
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload
  ) {
    const data = (payload as { data?: unknown }).data

    if (Array.isArray(data)) {
      return data as Program[]
    }

    if (
      data &&
      typeof data === 'object' &&
      'data' in data &&
      Array.isArray((data as { data?: unknown }).data)
    ) {
      return (data as { data: Program[] }).data
    }
  }

  return []
}

function normalizeItem(payload: unknown): Program {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload
  ) {
    const data = (payload as { data?: unknown }).data

    if (
      data &&
      typeof data === 'object' &&
      'id' in data
    ) {
      return data as Program
    }
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'id' in payload
  ) {
    return payload as Program
  }

  throw new Error('Format data program dari server tidak dikenali.')
}

async function apiRequest(
  path: string,
  options: RequestInit = {}
) {
  const token = getToken()

  const headers = new Headers(options.headers)

  headers.set('Accept', 'application/json')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  let payload: unknown = null

  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    let message = 'Terjadi kesalahan pada server.'

    if (
      payload &&
      typeof payload === 'object'
    ) {
      const objectPayload = payload as {
        message?: string
        errors?: Record<string, string[]>
      }

      if (objectPayload.message) {
        message = objectPayload.message
      }

      if (objectPayload.errors) {
        const firstError = Object.values(
          objectPayload.errors
        )
          .flat()
          .find(Boolean)

        if (firstError) {
          message = firstError
        }
      }
    }

    throw new Error(message)
  }

  return payload
}

export default function ProgramManagement() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState<'all' | ProgramStatus>('all')
  const [pillarFilter, setPillarFilter] =
    useState<'all' | ProgramPillar>('all')

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<ProgramForm>(emptyForm)

  const [detailProgram, setDetailProgram] =
    useState<Program | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const loadPrograms = async () => {
    try {
      setLoading(true)
      setError('')

      const payload = await apiRequest('/admin/programs')
      setPrograms(normalizeList(payload))
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil data program.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPrograms()
  }, [])

  const filteredPrograms = useMemo(() => {
    const keyword = search.toLowerCase().trim()

    return programs.filter((program) => {
      const matchesSearch =
        !keyword ||
        program.title.toLowerCase().includes(keyword) ||
        program.slug.toLowerCase().includes(keyword) ||
        program.pillar.toLowerCase().includes(keyword)

      const matchesStatus =
        statusFilter === 'all' ||
        program.status === statusFilter

      const matchesPillar =
        pillarFilter === 'all' ||
        program.pillar === pillarFilter

      return matchesSearch && matchesStatus && matchesPillar
    })
  }, [programs, search, statusFilter, pillarFilter])

  const publishedCount = programs.filter(
    (program) => program.status === 'published'
  ).length

  const draftCount = programs.filter(
    (program) => program.status === 'draft'
  ).length

  const totalViews = programs.reduce(
    (total, program) => total + Number(program.views || 0),
    0
  )

  const openCreateForm = () => {
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

      const payload = await apiRequest(`/admin/programs/${id}`)
      const program = normalizeItem(payload)

      setEditingId(program.id)
      setForm({
        title: program.title,
        excerpt: program.excerpt ?? '',
        content: program.content ?? '',
        pillar: program.pillar,
        status: program.status,
        sort_order: String(program.sort_order ?? 0),
        thumbnail: null,
      })

      setShowForm(true)
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil detail program.'
      )
    } finally {
      setLoadingDetail(false)
    }
  }

  const closeForm = () => {
    if (submitting) return

    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError('Judul program wajib diisi.')
      return
    }

    if (!form.content.trim()) {
      setError('Isi program wajib diisi.')
      return
    }

    if (!form.pillar) {
      setError('Pilar program wajib dipilih.')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      const formData = new FormData()

      formData.append('title', form.title.trim())
      formData.append('excerpt', form.excerpt.trim())
      formData.append('content', form.content.trim())
      formData.append('pillar', form.pillar)
      formData.append('status', form.status)
      formData.append(
        'sort_order',
        String(Number(form.sort_order || 0))
      )

      if (form.thumbnail) {
        formData.append('thumbnail', form.thumbnail)
      }

      if (editingId === null) {
        await apiRequest('/admin/programs', {
          method: 'POST',
          body: formData,
        })

        setSuccess('Program berhasil ditambahkan.')
      } else {
        /*
         * Laravel lebih aman menerima upload file update
         * melalui POST + method spoofing PUT.
         */
        formData.append('_method', 'PUT')

        await apiRequest(`/admin/programs/${editingId}`, {
          method: 'POST',
          body: formData,
        })

        setSuccess('Program berhasil diperbarui.')
      }

      await loadPrograms()
      closeForm()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan program.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDetail = async (id: number) => {
    try {
      setLoadingDetail(true)
      setError('')

      const payload = await apiRequest(`/admin/programs/${id}`)
      setDetailProgram(normalizeItem(payload))
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil detail program.'
      )
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin menghapus program ini?'
    )

    if (!confirmed) return

    try {
      setDeletingId(id)
      setError('')
      setSuccess('')

      await apiRequest(`/admin/programs/${id}`, {
        method: 'DELETE',
      })

      setPrograms((current) =>
        current.filter((program) => program.id !== id)
      )

      setSuccess('Program berhasil dihapus.')
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menghapus program.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  const editingProgram =
    editingId !== null
      ? programs.find((program) => program.id === editingId) ?? null
      : null

  return (
    <div className="space-y-5">
      {/* HEADER */}
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
            Kelola program Lazismu Pemalang dari data backend.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          + Tambah Program
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* STATISTICS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Program"
          value={programs.length}
        />

        <StatCard
          label="Published"
          value={publishedCount}
          valueClass="text-green-600"
        />

        <StatCard
          label="Draft"
          value={draftCount}
          valueClass="text-gray-500"
        />

        <StatCard
          label="Total Dilihat"
          value={totalViews.toLocaleString('id-ID')}
          valueClass="text-[#F58220]"
        />
      </div>

      {/* FILTER */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Cari Program
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul, slug, atau pilar..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Pilar
            </label>

            <select
              value={pillarFilter}
              onChange={(e) =>
                setPillarFilter(
                  e.target.value as 'all' | ProgramPillar
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="all">Semua Pilar</option>

              {pillarOptions.map((pillar) => (
                <option key={pillar} value={pillar}>
                  {pillar}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as 'all' | ProgramStatus
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="all">Semua Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
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
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Daftar Program
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Menampilkan {filteredPrograms.length} program.
          </p>
        </div>

        {loading ? (
          <div className="px-5 py-12 text-center text-sm text-gray-400">
            Memuat program...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Program
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Pilar
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Urutan
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
                {filteredPrograms.map((program) => {
                  const thumbnailUrl = getThumbnailUrl(
                    program.thumbnail
                  )

                  return (
                    <tr
                      key={program.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="max-w-sm px-5 py-4">
                        <div className="flex items-center gap-3">
                          {thumbnailUrl ? (
                            <img
                              src={thumbnailUrl}
                              alt={program.title}
                              className="h-14 w-20 shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400">
                              No Image
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="font-medium leading-5 text-gray-900">
                              {program.title}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              /{program.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-[#F58220]">
                          {program.pillar}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {program.sort_order ?? 0}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {Number(program.views || 0).toLocaleString(
                          'id-ID'
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            program.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {program.status === 'published'
                            ? 'Published'
                            : 'Draft'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleDetail(program.id)}
                            className="text-xs font-medium text-[#F58220] hover:underline"
                          >
                            Detail
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditForm(program.id)}
                            className="text-xs font-medium text-blue-600 hover:underline"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={deletingId === program.id}
                            onClick={() => handleDelete(program.id)}
                            className="text-xs font-medium text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === program.id
                              ? 'Menghapus...'
                              : 'Hapus'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {!loading && filteredPrograms.length === 0 && (
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
        )}
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingId === null
                    ? 'Tambah Program'
                    : 'Edit Program'}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Lengkapi data program di bawah.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={submitting}
                className="rounded-lg px-3 py-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Judul Program
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
                  placeholder="Masukkan judul program"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Ringkasan
                </label>

                <textarea
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      excerpt: e.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Ringkasan singkat program..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Pilar
                  </label>

                  <select
                    value={form.pillar}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        pillar: e.target.value as ProgramPillar,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                  >
                    {pillarOptions.map((pillar) => (
                      <option key={pillar} value={pillar}>
                        {pillar}
                      </option>
                    ))}
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
                        status: e.target.value as ProgramStatus,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Urutan
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        sort_order: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Isi Program
                </label>

                <RichTextEditor
                  value={form.content}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      content: value,
                    }))
                  }
                  placeholder="Tulis isi program..."
                />
              </div>

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
                      thumbnail: e.target.files?.[0] ?? null,
                    }))
                  }
                  className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />

                <p className="mt-1 text-xs text-gray-400">
                  JPG, JPEG, PNG, atau WEBP.
                </p>

                {editingProgram &&
                  !form.thumbnail &&
                  getThumbnailUrl(editingProgram.thumbnail) && (
                    <div className="mt-3">
                      <p className="mb-2 text-xs font-medium text-gray-500">
                        Thumbnail saat ini
                      </p>

                      <img
                        src={
                          getThumbnailUrl(editingProgram.thumbnail)!
                        }
                        alt={editingProgram.title}
                        className="h-40 w-full max-w-sm rounded-xl border border-gray-100 object-cover"
                      />
                    </div>
                  )}

                {form.thumbnail && (
                  <div className="mt-3">
                    <p className="mb-2 text-xs font-medium text-gray-500">
                      Thumbnail baru
                    </p>

                    <img
                      src={URL.createObjectURL(form.thumbnail)}
                      alt="Preview thumbnail baru"
                      className="h-40 w-full max-w-sm rounded-xl border border-gray-100 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

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
                  : editingId === null
                    ? 'Simpan Program'
                    : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailProgram && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">
                Detail Program
              </h2>

              <button
                type="button"
                onClick={() => setDetailProgram(null)}
                className="rounded-lg px-3 py-1.5 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 p-6">
              {getThumbnailUrl(detailProgram.thumbnail) && (
                <img
                  src={getThumbnailUrl(detailProgram.thumbnail)!}
                  alt={detailProgram.title}
                  className="h-64 w-full rounded-xl object-cover"
                />
              )}

              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-[#F58220]">
                    {detailProgram.pillar}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      detailProgram.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {detailProgram.status === 'published'
                      ? 'Published'
                      : 'Draft'}
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-bold text-gray-900">
                  {detailProgram.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {detailProgram.excerpt || '-'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-4">
                <DetailInfo
                  label="Views"
                  value={Number(
                    detailProgram.views || 0
                  ).toLocaleString('id-ID')}
                />

                <DetailInfo
                  label="Urutan"
                  value={String(detailProgram.sort_order ?? 0)}
                />

                <DetailInfo
                  label="Published"
                  value={formatDate(detailProgram.published_at)}
                />

                <DetailInfo
                  label="Dibuat"
                  value={formatDate(detailProgram.created_at)}
                />
              </div>

              <div>
                <h4 className="mb-2 text-sm font-bold text-gray-900">
                  Isi Program
                </h4>

                <div
                  className="prose prose-sm max-w-none rounded-xl border border-gray-100 p-4 text-gray-600 prose-headings:text-gray-900 prose-a:text-[#F58220] prose-strong:text-gray-900"
                  dangerouslySetInnerHTML={{
                    __html: detailProgram.content,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {loadingDetail && (
        <div className="fixed bottom-5 right-5 z-[120] rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">
          Memuat data...
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  valueClass = 'text-gray-900',
}: {
  label: string
  value: string | number
  valueClass?: string
}) {
  return (
    <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className={`mt-1 text-xl font-bold ${valueClass}`}>
        {value}
      </p>
    </div>
  )
}

function DetailInfo({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-700">
        {value}
      </p>
    </div>
  )
}