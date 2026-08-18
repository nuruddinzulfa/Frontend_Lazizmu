'use client'

import API_URL from "@/lib/api"
import { useEffect, useMemo, useState } from 'react'

type BannerStatus = 'active' | 'inactive'
type BannerMediaType = 'image' | 'video'

interface Banner {
  id: number
  title: string
  subtitle: string | null
  media_type: BannerMediaType
  image: string | null
  video: string | null
  button_text: string | null
  button_url: string | null
  status: BannerStatus
  sort_order: number
  created_by: number | null
  updated_by: number | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

interface BannerForm {
  title: string
  subtitle: string
  button_text: string
  button_url: string
  media_type: BannerMediaType
  status: BannerStatus
  sort_order: string
  image: File | null
  video: File | null
}

const emptyForm: BannerForm = {
  title: '',
  subtitle: '',
  button_text: 'Donasi Sekarang',
  button_url: '/donasi',
  media_type: 'image',
  status: 'active',
  sort_order: '0',
  image: null,
  video: null,
}

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

function getBackendUrl() {
  return API_URL.replace(/\/api\/?$/, '')
}

function getMediaUrl(path: string | null) {
  if (!path) return null

  if (
    path.startsWith('http://') ||
    path.startsWith('https://')
  ) {
    return path
  }

  const cleanPath = path
    .replace(/^\/+/, '')
    .replace(/^storage\//, '')

  return `${getBackendUrl()}/storage/${cleanPath}`
}

function normalizeList(payload: unknown): Banner[] {
  if (Array.isArray(payload)) {
    return payload as Banner[]
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload
  ) {
    const data = (payload as { data?: unknown }).data

    if (Array.isArray(data)) {
      return data as Banner[]
    }

    if (
      data &&
      typeof data === 'object' &&
      'data' in data &&
      Array.isArray((data as { data?: unknown }).data)
    ) {
      return (data as { data: Banner[] }).data
    }
  }

  return []
}

function normalizeItem(payload: unknown): Banner {
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
      return data as Banner
    }
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'id' in payload
  ) {
    return payload as Banner
  }

  throw new Error('Format data banner dari server tidak dikenali.')
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
        const firstError = Object.values(objectPayload.errors)
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

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState<'all' | BannerStatus>('all')
  const [mediaFilter, setMediaFilter] =
    useState<'all' | BannerMediaType>('all')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<BannerForm>(emptyForm)

  const [detailBanner, setDetailBanner] =
    useState<Banner | null>(null)

  const [imagePreview, setImagePreview] =
    useState<string | null>(null)

  const [videoPreview, setVideoPreview] =
    useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }

      if (videoPreview) {
        URL.revokeObjectURL(videoPreview)
      }
    }
  }, [imagePreview, videoPreview])

  const loadBanners = async () => {
    try {
      setLoading(true)
      setError('')

      const payload = await apiRequest('/admin/banners')
      setBanners(normalizeList(payload))
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil data banner.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBanners()
  }, [])

  const filteredBanners = useMemo(() => {
    const keyword = search.toLowerCase().trim()

    return banners.filter((banner) => {
      const matchesSearch =
        !keyword ||
        banner.title.toLowerCase().includes(keyword) ||
        (banner.subtitle ?? '')
          .toLowerCase()
          .includes(keyword) ||
        (banner.button_text ?? '')
          .toLowerCase()
          .includes(keyword)

      const matchesStatus =
        statusFilter === 'all' ||
        banner.status === statusFilter

      const matchesMedia =
        mediaFilter === 'all' ||
        banner.media_type === mediaFilter

      return matchesSearch && matchesStatus && matchesMedia
    })
  }, [banners, search, statusFilter, mediaFilter])

  const activeCount = banners.filter(
    (banner) => banner.status === 'active'
  ).length

  const imageCount = banners.filter(
    (banner) => banner.media_type === 'image'
  ).length

  const videoCount = banners.filter(
    (banner) => banner.media_type === 'video'
  ).length

  const resetPreview = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
    }

    setImagePreview(null)
    setVideoPreview(null)
  }

  const openCreateForm = () => {
    resetPreview()
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
      resetPreview()

      const payload = await apiRequest(`/admin/banners/${id}`)
      const banner = normalizeItem(payload)

      setEditingId(banner.id)
      setForm({
        title: banner.title,
        subtitle: banner.subtitle ?? '',
        button_text: banner.button_text ?? '',
        button_url: banner.button_url ?? '',
        media_type: banner.media_type ?? 'image',
        status: banner.status,
        sort_order: String(banner.sort_order ?? 0),
        image: null,
        video: null,
      })

      setShowForm(true)
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil detail banner.'
      )
    } finally {
      setLoadingDetail(false)
    }
  }

  const closeForm = () => {
    if (submitting) return

    resetPreview()
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const changeMediaType = (
    mediaType: BannerMediaType
  ) => {
    resetPreview()

    setForm((current) => ({
      ...current,
      media_type: mediaType,
      image: null,
      video: null,
    }))
  }

  const handleImageChange = (
    file: File | null
  ) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    const preview =
      file ? URL.createObjectURL(file) : null

    setImagePreview(preview)

    setForm((current) => ({
      ...current,
      image: file,
      video: null,
    }))
  }

  const handleVideoChange = (
    file: File | null
  ) => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
    }

    const preview =
      file ? URL.createObjectURL(file) : null

    setVideoPreview(preview)

    setForm((current) => ({
      ...current,
      video: file,
      image: null,
    }))
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError('Judul banner wajib diisi.')
      return
    }

    if (
      editingId === null &&
      form.media_type === 'image' &&
      !form.image
    ) {
      setError('Gambar banner wajib dipilih.')
      return
    }

    if (
      editingId === null &&
      form.media_type === 'video' &&
      !form.video
    ) {
      setError('Video banner wajib dipilih.')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      const formData = new FormData()

      formData.append('title', form.title.trim())
      formData.append('subtitle', form.subtitle.trim())
      formData.append('button_text', form.button_text.trim())
      formData.append('button_url', form.button_url.trim())
      formData.append('media_type', form.media_type)
      formData.append('status', form.status)

      formData.append(
        'sort_order',
        String(Number(form.sort_order || 0))
      )

      if (
        form.media_type === 'image' &&
        form.image
      ) {
        formData.append('image', form.image)
      }

      if (
        form.media_type === 'video' &&
        form.video
      ) {
        formData.append('video', form.video)
      }

      if (editingId === null) {
        await apiRequest('/admin/banners', {
          method: 'POST',
          body: formData,
        })

        setSuccess('Banner berhasil ditambahkan.')
      } else {
        formData.append('_method', 'PUT')

        await apiRequest(`/admin/banners/${editingId}`, {
          method: 'POST',
          body: formData,
        })

        setSuccess('Banner berhasil diperbarui.')
      }

      await loadBanners()
      closeForm()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan banner.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDetail = async (id: number) => {
    try {
      setLoadingDetail(true)
      setError('')

      const payload = await apiRequest(`/admin/banners/${id}`)
      setDetailBanner(normalizeItem(payload))
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil detail banner.'
      )
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin menghapus banner ini?'
    )

    if (!confirmed) return

    try {
      setDeletingId(id)
      setError('')
      setSuccess('')

      await apiRequest(`/admin/banners/${id}`, {
        method: 'DELETE',
      })

      setBanners((current) =>
        current.filter((banner) => banner.id !== id)
      )

      setSuccess('Banner berhasil dihapus.')
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menghapus banner.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  const editingBanner =
    editingId !== null
      ? banners.find(
          (banner) => banner.id === editingId
        ) ?? null
      : null

  const currentEditImage =
    editingBanner?.media_type === 'image'
      ? getMediaUrl(editingBanner.image)
      : null

  const currentEditVideo =
    editingBanner?.media_type === 'video'
      ? getMediaUrl(editingBanner.video)
      : null

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-lg font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Banner / Hero
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola Hero website dalam bentuk gambar atau video.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          + Tambah Banner
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
          label="Total Banner"
          value={banners.length}
        />

        <StatCard
          label="Banner Aktif"
          value={activeCount}
          valueClass="text-green-600"
        />

        <StatCard
          label="Gambar"
          value={imageCount}
          valueClass="text-blue-600"
        />

        <StatCard
          label="Video"
          value={videoCount}
          valueClass="text-[#F58220]"
        />
      </div>

      {/* FILTER */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Cari Banner
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Cari judul, subtitle, atau tombol..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Tipe Media
            </label>

            <select
              value={mediaFilter}
              onChange={(e) =>
                setMediaFilter(
                  e.target.value as
                    | 'all'
                    | BannerMediaType
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="all">
                Semua Media
              </option>

              <option value="image">
                Gambar
              </option>

              <option value="video">
                Video
              </option>
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
                  e.target.value as
                    | 'all'
                    | BannerStatus
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="all">
                Semua Status
              </option>

              <option value="active">
                Aktif
              </option>

              <option value="inactive">
                Tidak Aktif
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
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Daftar Banner
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Menampilkan {filteredBanners.length} banner.
          </p>
        </div>

        {loading ? (
          <div className="px-5 py-12 text-center text-sm text-gray-400">
            Memuat banner...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Banner
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Media
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Tombol
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Urutan
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
                {filteredBanners.map((banner) => {
                  const imageUrl =
                    getMediaUrl(banner.image)

                  const videoUrl =
                    getMediaUrl(banner.video)

                  return (
                    <tr
                      key={banner.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="max-w-lg px-5 py-4">
                        <div className="flex items-center gap-3">
                          {banner.media_type === 'video' &&
                          videoUrl ? (
                            <video
                              src={videoUrl}
                              muted
                              preload="metadata"
                              className="h-16 w-28 shrink-0 rounded-lg bg-black object-cover"
                            />
                          ) : imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={banner.title}
                              className="h-16 w-28 shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400">
                              No Media
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="font-medium leading-5 text-gray-900">
                              {banner.title}
                            </p>

                            {banner.subtitle && (
                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-400">
                                {banner.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            banner.media_type === 'video'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {banner.media_type === 'video'
                            ? 'Video'
                            : 'Gambar'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs font-medium text-gray-700">
                          {banner.button_text || '-'}
                        </p>

                        <p className="mt-1 max-w-40 truncate text-xs text-gray-400">
                          {banner.button_url || '-'}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {banner.sort_order ?? 0}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            banner.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {banner.status === 'active'
                            ? 'Aktif'
                            : 'Tidak Aktif'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleDetail(banner.id)
                            }
                            className="text-xs font-medium text-[#F58220] hover:underline"
                          >
                            Detail
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(banner.id)
                            }
                            className="text-xs font-medium text-blue-600 hover:underline"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={
                              deletingId === banner.id
                            }
                            onClick={() =>
                              handleDelete(banner.id)
                            }
                            className="text-xs font-medium text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === banner.id
                              ? 'Menghapus...'
                              : 'Hapus'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {!loading &&
                  filteredBanners.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-10 text-center text-sm text-gray-400"
                      >
                        Banner tidak ditemukan.
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
                    ? 'Tambah Banner'
                    : 'Edit Banner'}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Banner dapat menggunakan gambar atau video.
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
                  Judul Banner
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
                  placeholder="Masukkan judul banner"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Subtitle
                </label>

                <textarea
                  value={form.subtitle}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      subtitle: e.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Subtitle atau deskripsi singkat banner..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                />
              </div>

              {/* MEDIA TYPE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Tipe Media
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() =>
                      changeMediaType('image')
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      form.media_type === 'image'
                        ? 'border-[#F58220] bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-orange-200'
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      Gambar
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Hero menggunakan JPG, PNG, WEBP, atau AVIF.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      changeMediaType('video')
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      form.media_type === 'video'
                        ? 'border-[#F58220] bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-orange-200'
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      Video
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Hero menggunakan MP4 atau WEBM dan akan diloop.
                    </p>
                  </button>
                </div>
              </div>

              {/* MEDIA UPLOAD */}
              {form.media_type === 'image' ? (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Gambar Banner
                  </label>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={(e) =>
                      handleImageChange(
                        e.target.files?.[0] ?? null
                      )
                    }
                    className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    Maksimal 4 MB. Gunakan gambar landscape.
                  </p>

                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview gambar baru"
                      className="mt-3 h-52 w-full rounded-xl border border-gray-100 object-cover"
                    />
                  ) : (
                    editingBanner &&
                    form.media_type === 'image' &&
                    currentEditImage && (
                      <div className="mt-3">
                        <p className="mb-2 text-xs font-medium text-gray-500">
                          Gambar saat ini
                        </p>

                        <img
                          src={currentEditImage}
                          alt={editingBanner.title}
                          className="h-52 w-full rounded-xl border border-gray-100 object-cover"
                        />
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Video Banner
                  </label>

                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={(e) =>
                      handleVideoChange(
                        e.target.files?.[0] ?? null
                      )
                    }
                    className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    MP4 atau WEBM, maksimal 50 MB. Disarankan video pendek tanpa audio.
                  </p>

                  {videoPreview ? (
                    <video
                      src={videoPreview}
                      controls
                      muted
                      loop
                      playsInline
                      className="mt-3 h-64 w-full rounded-xl bg-black object-cover"
                    />
                  ) : (
                    editingBanner &&
                    form.media_type === 'video' &&
                    currentEditVideo && (
                      <div className="mt-3">
                        <p className="mb-2 text-xs font-medium text-gray-500">
                          Video saat ini
                        </p>

                        <video
                          src={currentEditVideo}
                          controls
                          muted
                          loop
                          playsInline
                          className="h-64 w-full rounded-xl bg-black object-cover"
                        />
                      </div>
                    )
                  )}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Teks Tombol
                  </label>

                  <input
                    type="text"
                    value={form.button_text}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        button_text: e.target.value,
                      }))
                    }
                    placeholder="Contoh: Donasi Sekarang"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    URL Tombol
                  </label>

                  <input
                    type="text"
                    value={form.button_url}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        button_url: e.target.value,
                      }))
                    }
                    placeholder="/donasi atau https://..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
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
                          e.target.value as BannerStatus,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                  >
                    <option value="active">
                      Aktif
                    </option>

                    <option value="inactive">
                      Tidak Aktif
                    </option>
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
                    ? 'Simpan Banner'
                    : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailBanner && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">
                Detail Banner
              </h2>

              <button
                type="button"
                onClick={() =>
                  setDetailBanner(null)
                }
                className="rounded-lg px-3 py-1.5 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 p-6">
              {detailBanner.media_type === 'video' &&
              getMediaUrl(detailBanner.video) ? (
                <video
                  src={
                    getMediaUrl(
                      detailBanner.video
                    )!
                  }
                  controls
                  muted
                  loop
                  playsInline
                  className="h-72 w-full rounded-xl bg-black object-cover"
                />
              ) : getMediaUrl(
                  detailBanner.image
                ) ? (
                <img
                  src={
                    getMediaUrl(
                      detailBanner.image
                    )!
                  }
                  alt={detailBanner.title}
                  className="h-72 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-72 w-full items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
                  Tidak ada media
                </div>
              )}

              <div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      detailBanner.media_type ===
                      'video'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {detailBanner.media_type ===
                    'video'
                      ? 'Video'
                      : 'Gambar'}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      detailBanner.status ===
                      'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {detailBanner.status ===
                    'active'
                      ? 'Aktif'
                      : 'Tidak Aktif'}
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-bold text-gray-900">
                  {detailBanner.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {detailBanner.subtitle || '-'}
                </p>
              </div>

              <div className="grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-3">
                <DetailInfo
                  label="Teks Tombol"
                  value={
                    detailBanner.button_text || '-'
                  }
                />

                <DetailInfo
                  label="URL Tombol"
                  value={
                    detailBanner.button_url || '-'
                  }
                />

                <DetailInfo
                  label="Urutan"
                  value={String(
                    detailBanner.sort_order ?? 0
                  )}
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

      <p
        className={`mt-1 text-xl font-bold ${valueClass}`}
      >
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

      <p className="mt-1 break-words text-sm font-semibold text-gray-700">
        {value}
      </p>
    </div>
  )
}