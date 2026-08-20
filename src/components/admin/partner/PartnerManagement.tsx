'use client'

import API_URL from "@/lib/api"
import { useEffect, useMemo, useState } from 'react'

type PartnerStatus = 'active' | 'inactive'

interface PartnerUser {
  id: number
  name: string
  email: string
}

interface Partner {
  id: number
  name: string
  logo: string | null
  url: string | null
  sort_order: number
  status: PartnerStatus
  created_by: number | null
  updated_by: number | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
  creator?: PartnerUser | null
  updater?: PartnerUser | null
}

interface PartnerForm {
  name: string
  url: string
  sort_order: string
  status: PartnerStatus
  logo: File | null
}

const emptyForm: PartnerForm = {
  name: '',
  url: '',
  sort_order: '0',
  status: 'active',
  logo: null,
}

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

function getBackendUrl() {
  return API_URL.replace(/\/api\/?$/, '')
}

function getLogoUrl(logo: string | null) {
  if (!logo) return null

  if (
    logo.startsWith('http://') ||
    logo.startsWith('https://')
  ) {
    return logo
  }

  const cleanLogo = logo
    .replace(/^\/+/, '')
    .replace(/^storage\//, '')

  return `${getBackendUrl()}/storage/${cleanLogo}`
}

function normalizeList(payload: unknown): Partner[] {
  if (Array.isArray(payload)) {
    return payload as Partner[]
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload
  ) {
    const data = (payload as { data?: unknown }).data

    if (Array.isArray(data)) {
      return data as Partner[]
    }

    if (
      data &&
      typeof data === 'object' &&
      'data' in data &&
      Array.isArray((data as { data?: unknown }).data)
    ) {
      return (data as { data: Partner[] }).data
    }
  }

  return []
}

function normalizeItem(payload: unknown): Partner {
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
      return data as Partner
    }
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'id' in payload
  ) {
    return payload as Partner
  }

  throw new Error('Format data mitra dari server tidak dikenali.')
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

export default function PartnerManagement() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState<'all' | PartnerStatus>('all')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<PartnerForm>(emptyForm)

  const [detailPartner, setDetailPartner] =
    useState<Partner | null>(null)

  const [logoPreview, setLogoPreview] =
    useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview)
      }
    }
  }, [logoPreview])

  const loadPartners = async () => {
    try {
      setLoading(true)
      setError('')

      const payload = await apiRequest('/admin/partners')
      setPartners(normalizeList(payload))
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil data mitra.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPartners()
  }, [])

  const filteredPartners = useMemo(() => {
    const keyword = search.toLowerCase().trim()

    return partners.filter((partner) => {
      const matchesSearch =
        !keyword ||
        partner.name.toLowerCase().includes(keyword) ||
        (partner.url ?? '')
          .toLowerCase()
          .includes(keyword)

      const matchesStatus =
        statusFilter === 'all' ||
        partner.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [partners, search, statusFilter])

  const activeCount = partners.filter(
    (partner) => partner.status === 'active'
  ).length

  const inactiveCount = partners.filter(
    (partner) => partner.status === 'inactive'
  ).length

  const resetPreview = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview)
    }

    setLogoPreview(null)
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

      const payload = await apiRequest(`/admin/partners/${id}`)
      const partner = normalizeItem(payload)

      setEditingId(partner.id)
      setForm({
        name: partner.name,
        url: partner.url ?? '',
        sort_order: String(partner.sort_order ?? 0),
        status: partner.status,
        logo: null,
      })

      setShowForm(true)
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil detail mitra.'
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

  const handleLogoChange = (file: File | null) => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview)
    }

    const preview =
      file ? URL.createObjectURL(file) : null

    setLogoPreview(preview)

    setForm((current) => ({
      ...current,
      logo: file,
    }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError('Nama mitra wajib diisi.')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      const formData = new FormData()

      formData.append('name', form.name.trim())
      formData.append('url', form.url.trim())
      formData.append('status', form.status)

      formData.append(
        'sort_order',
        String(Number(form.sort_order || 0))
      )

      if (form.logo) {
        formData.append('logo', form.logo)
      }

      if (editingId === null) {
        await apiRequest('/admin/partners', {
          method: 'POST',
          body: formData,
        })

        setSuccess('Mitra berhasil ditambahkan.')
      } else {
        formData.append('_method', 'PUT')

        await apiRequest(`/admin/partners/${editingId}`, {
          method: 'POST',
          body: formData,
        })

        setSuccess('Mitra berhasil diperbarui.')
      }

      await loadPartners()
      closeForm()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan mitra.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDetail = async (id: number) => {
    try {
      setLoadingDetail(true)
      setError('')

      const payload = await apiRequest(`/admin/partners/${id}`)
      setDetailPartner(normalizeItem(payload))
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil detail mitra.'
      )
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin menghapus mitra ini?'
    )

    if (!confirmed) return

    try {
      setDeletingId(id)
      setError('')
      setSuccess('')

      await apiRequest(`/admin/partners/${id}`, {
        method: 'DELETE',
      })

      setPartners((current) =>
        current.filter((partner) => partner.id !== id)
      )

      setSuccess('Mitra berhasil dihapus.')
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menghapus mitra.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  const editingPartner =
    editingId !== null
      ? partners.find(
          (partner) => partner.id === editingId
        ) ?? null
      : null

  const currentLogo =
    editingPartner
      ? getLogoUrl(editingPartner.logo)
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
            Mitra / Partner
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola daftar mitra yang tampil pada website Lazismu.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          + Tambah Mitra
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Mitra"
          value={partners.length}
        />

        <StatCard
          label="Mitra Aktif"
          value={activeCount}
          valueClass="text-green-600"
        />

        <StatCard
          label="Tidak Aktif"
          value={inactiveCount}
          valueClass="text-gray-500"
        />
      </div>

      {/* FILTER */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Cari Mitra
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Cari nama atau URL mitra..."
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
                    | PartnerStatus
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
            Daftar Mitra
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Menampilkan {filteredPartners.length} mitra.
          </p>
        </div>

        {loading ? (
          <div className="px-5 py-12 text-center text-sm text-gray-400">
            Memuat mitra...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Mitra
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    URL
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
                {filteredPartners.map((partner) => {
                  const logoUrl =
                    getLogoUrl(partner.logo)

                  return (
                    <tr
                      key={partner.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {logoUrl ? (
                            <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-white p-2">
                              <img
                                src={logoUrl}
                                alt={partner.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400">
                              No Logo
                            </div>
                          )}

                          <p className="font-medium text-gray-900">
                            {partner.name}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {partner.url ? (
                          <a
                            href={partner.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block max-w-56 truncate text-xs font-medium text-blue-600 hover:underline"
                          >
                            {partner.url}
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">
                            -
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {partner.sort_order ?? 0}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            partner.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {partner.status === 'active'
                            ? 'Aktif'
                            : 'Tidak Aktif'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleDetail(partner.id)
                            }
                            className="text-xs font-medium text-[#F58220] hover:underline"
                          >
                            Detail
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(partner.id)
                            }
                            className="text-xs font-medium text-blue-600 hover:underline"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={
                              deletingId === partner.id
                            }
                            onClick={() =>
                              handleDelete(partner.id)
                            }
                            className="text-xs font-medium text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === partner.id
                              ? 'Menghapus...'
                              : 'Hapus'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {!loading &&
                  filteredPartners.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-10 text-center text-sm text-gray-400"
                      >
                        Mitra tidak ditemukan.
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
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingId === null
                    ? 'Tambah Mitra'
                    : 'Edit Mitra'}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Lengkapi informasi mitra website.
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
                  Nama Mitra
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Contoh: Bank Syariah Indonesia"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  URL Mitra
                </label>

                <input
                  type="text"
                  value={form.url}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      url: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Opsional. Isi jika logo mitra ingin diarahkan ke website resmi.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Logo Mitra
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(e) =>
                    handleLogoChange(
                      e.target.files?.[0] ?? null
                    )
                  }
                  className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />

                <p className="mt-1 text-xs text-gray-400">
                  JPG, PNG, WEBP, atau AVIF. Maksimal 4 MB.
                </p>

                {logoPreview ? (
                  <div className="mt-3 flex h-52 w-full items-center justify-center rounded-xl border border-gray-100 bg-white p-5">
                    <img
                      src={logoPreview}
                      alt="Preview logo mitra"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  editingPartner &&
                  currentLogo && (
                    <div className="mt-3">
                      <p className="mb-2 text-xs font-medium text-gray-500">
                        Logo saat ini
                      </p>

                      <div className="flex h-52 w-full items-center justify-center rounded-xl border border-gray-100 bg-white p-5">
                        <img
                          src={currentLogo}
                          alt={editingPartner.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </div>
                  )
                )}
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
                          e.target.value as PartnerStatus,
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
                    ? 'Simpan Mitra'
                    : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailPartner && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">
                Detail Mitra
              </h2>

              <button
                type="button"
                onClick={() =>
                  setDetailPartner(null)
                }
                className="rounded-lg px-3 py-1.5 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 p-6">
              {getLogoUrl(detailPartner.logo) ? (
                <div className="flex h-64 w-full items-center justify-center rounded-xl border border-gray-100 bg-white p-6">
                  <img
                    src={getLogoUrl(detailPartner.logo)!}
                    alt={detailPartner.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-64 w-full items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
                  Tidak ada logo
                </div>
              )}

              <div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    detailPartner.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {detailPartner.status === 'active'
                    ? 'Aktif'
                    : 'Tidak Aktif'}
                </span>

                <h3 className="mt-3 text-2xl font-bold text-gray-900">
                  {detailPartner.name}
                </h3>

                {detailPartner.url ? (
                  <a
                    href={detailPartner.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block break-all text-sm font-medium text-blue-600 hover:underline"
                  >
                    {detailPartner.url}
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-gray-400">
                    URL tidak tersedia.
                  </p>
                )}
              </div>

              <div className="grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-3">
                <DetailInfo
                  label="Urutan"
                  value={String(
                    detailPartner.sort_order ?? 0
                  )}
                />

                <DetailInfo
                  label="Dibuat Oleh"
                  value={
                    detailPartner.creator?.name || '-'
                  }
                />

                <DetailInfo
                  label="Diperbarui Oleh"
                  value={
                    detailPartner.updater?.name || '-'
                  }
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