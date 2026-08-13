'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  getAdminReports,
  createReport,
  updateReport,
  deleteReport,
  getReportFileUrl,
  getReportThumbnailUrl,
  type FinancialReport,
  type FinancialReportPayload,
} from '@/service/report.service'

type PublicationType =
  | 'Laporan Keuangan'
  | 'Laporan Tahunan'
  | 'Laporan Program'

const publicationTypes: PublicationType[] = [
  'Laporan Keuangan',
  'Laporan Tahunan',
  'Laporan Program',
]

interface FormState {
  title: string
  type: PublicationType
  year: string
  description: string
  status: 'draft' | 'published'
  thumbnail: File | null
  file: File | null
}

const initialForm: FormState = {
  title: '',
  type: 'Laporan Keuangan',
  year: new Date().getFullYear().toString(),
  description: '',
  status: 'published',
  thumbnail: null,
  file: null,
}

export default function PublicationManagement() {
  const [publications, setPublications] = useState<FinancialReport[]>([])

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('Semua')
  const [yearFilter, setYearFilter] = useState('Semua')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReport, setEditingReport] =
    useState<FinancialReport | null>(null)

  const [form, setForm] = useState<FormState>(initialForm)

  /*
  |--------------------------------------------------------------------------
  | LOAD DATA
  |--------------------------------------------------------------------------
  */

  const loadPublications = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getAdminReports()

      setPublications(data)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal mengambil data publikasi.'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPublications()
  }, [])

  /*
  |--------------------------------------------------------------------------
  | SUCCESS MESSAGE
  |--------------------------------------------------------------------------
  */

  const showSuccess = (message: string) => {
    setSuccess(message)

    window.setTimeout(() => {
      setSuccess('')
    }, 3000)
  }

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const availableYears = useMemo(() => {
    const years = publications.map(
      (publication) => publication.year
    )

    return Array.from(new Set(years)).sort(
      (a, b) => b - a
    )
  }, [publications])

  const filteredPublications = useMemo(() => {
    return publications.filter((publication) => {
      const keyword = search.toLowerCase().trim()

      const matchesSearch =
        !keyword ||
        publication.title
          .toLowerCase()
          .includes(keyword) ||
        (publication.description ?? '')
          .toLowerCase()
          .includes(keyword)

      const matchesType =
        typeFilter === 'Semua' ||
        publication.type === typeFilter

      const matchesYear =
        yearFilter === 'Semua' ||
        publication.year.toString() === yearFilter

      return (
        matchesSearch &&
        matchesType &&
        matchesYear
      )
    })
  }, [
    publications,
    search,
    typeFilter,
    yearFilter,
  ])

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const publishedCount = publications.filter(
    (publication) =>
      publication.status === 'published'
  ).length

  const draftCount = publications.filter(
    (publication) =>
      publication.status === 'draft'
  ).length

  const activeYear =
    publications.length > 0
      ? Math.max(
          ...publications.map(
            (publication) => publication.year
          )
        )
      : null

  const typeCounts = publicationTypes.map(
    (type) => ({
      type,
      count: publications.filter(
        (publication) =>
          publication.type === type
      ).length,
    })
  )

  /*
  |--------------------------------------------------------------------------
  | OPEN CREATE MODAL
  |--------------------------------------------------------------------------
  */

  const openCreateModal = () => {
    setEditingReport(null)

    setForm({
      ...initialForm,
      year: new Date()
        .getFullYear()
        .toString(),
    })

    setError('')
    setIsModalOpen(true)
  }

  /*
  |--------------------------------------------------------------------------
  | OPEN EDIT MODAL
  |--------------------------------------------------------------------------
  */

  const openEditModal = (
    report: FinancialReport
  ) => {
    setEditingReport(report)

    setForm({
      title: report.title,
      type: report.type as PublicationType,
      year: report.year.toString(),
      description:
        report.description ?? '',
      status: report.status,
      thumbnail: null,
      file: null,
    })

    setError('')
    setIsModalOpen(true)
  }

  /*
  |--------------------------------------------------------------------------
  | CLOSE MODAL
  |--------------------------------------------------------------------------
  */

  const closeModal = () => {
    if (saving) return

    setIsModalOpen(false)
    setEditingReport(null)
    setForm(initialForm)
  }

  /*
  |--------------------------------------------------------------------------
  | FORM HANDLER
  |--------------------------------------------------------------------------
  */

  const updateForm = <
    K extends keyof FormState
  >(
    field: K,
    value: FormState[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setError('')

    if (!form.title.trim()) {
      setError(
        'Judul publikasi wajib diisi.'
      )
      return
    }

    if (!form.year) {
      setError(
        'Tahun publikasi wajib diisi.'
      )
      return
    }

    /*
     * PDF wajib ketika membuat data baru.
     *
     * Saat edit, file lama tetap dipakai
     * jika admin tidak memilih file baru.
     */
    if (!editingReport && !form.file) {
      setError(
        'File publikasi PDF wajib dipilih.'
      )
      return
    }

    if (
      form.file &&
      form.file.type !==
        'application/pdf'
    ) {
      setError(
        'File publikasi harus berupa PDF.'
      )
      return
    }

    try {
      setSaving(true)

      const payload: FinancialReportPayload =
        {
          title: form.title.trim(),
          type: form.type,
          year: Number(form.year),
          description:
            form.description.trim() ||
            undefined,
          status: form.status,
          thumbnail: form.thumbnail,
          file: form.file,
        }

      if (editingReport) {
        await updateReport(
          editingReport.id,
          payload
        )

        showSuccess(
          'Publikasi berhasil diperbarui.'
        )
      } else {
        await createReport(payload)

        showSuccess(
          'Publikasi berhasil ditambahkan.'
        )
      }

      closeModal()

      await loadPublications()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan publikasi.'

      setError(message)
    } finally {
      setSaving(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (
    report: FinancialReport
  ) => {
    const confirmed =
      window.confirm(
        `Apakah Anda yakin ingin menghapus publikasi "${report.title}"?`
      )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteReport(report.id)

      showSuccess(
        'Publikasi berhasil dihapus.'
      )

      await loadPublications()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal menghapus publikasi.'

      setError(message)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | FILE ACTION
  |--------------------------------------------------------------------------
  */

  const handleViewFile = (
    file: string | null
  ) => {
    const url = getReportFileUrl(file)

    if (!url) {
      setError(
        'File publikasi tidak tersedia.'
      )
      return
    }

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const handleDownloadFile = (
    file: string | null
  ) => {
    const url = getReportFileUrl(file)

    if (!url) {
      setError(
        'File publikasi tidak tersedia.'
      )
      return
    }

    const link =
      document.createElement('a')

    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.download = ''

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-5">

      {/* ================================================================
          HEADER
      ================================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1
            className="text-lg font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Publikasi
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola laporan dan dokumen publikasi
            LAZISMU.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          + Tambah Publikasi
        </button>

      </div>

      {/* ================================================================
          ALERT ERROR
      ================================================================= */}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              setError('')
            }
            className="font-bold"
          >
            ×
          </button>

        </div>
      )}

      {/* ================================================================
          ALERT SUCCESS
      ================================================================= */}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
          {success}
        </div>
      )}

      {/* ================================================================
          STATISTICS
      ================================================================= */}

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
            Tersedia
          </p>

          <p className="mt-1 text-xl font-bold text-green-600">
            {publishedCount}
          </p>

        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">

          <p className="text-xs text-gray-500">
            Draft
          </p>

          <p className="mt-1 text-xl font-bold text-[#F58220]">
            {draftCount}
          </p>

        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">

          <p className="text-xs text-gray-500">
            Periode Aktif
          </p>

          <p className="mt-1 text-xl font-bold text-[#F58220]">
            {activeYear ?? '-'}
          </p>

        </div>

      </div>

      {/* ================================================================
          SUMMARY
      ================================================================= */}

      <div className="grid gap-5 lg:grid-cols-2">

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Ringkasan Publikasi
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Ringkasan berdasarkan data publikasi
            yang tersimpan.
          </p>

          <div className="mt-5 space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Total Publikasi
              </span>

              <span className="text-sm font-bold text-gray-900">
                {publications.length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Publikasi Published
              </span>

              <span className="text-sm font-bold text-green-600">
                {publishedCount}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Publikasi Draft
              </span>

              <span className="text-sm font-bold text-[#F58220]">
                {draftCount}
              </span>
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Jenis Publikasi
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Jumlah publikasi berdasarkan jenis.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {typeCounts.map(
              ({ type, count }) => (
                <span
                  key={type}
                  className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-[#F58220]"
                >
                  {type} ({count})
                </span>
              )
            )}

          </div>

        </div>

      </div>

      {/* ================================================================
          FILTER
      ================================================================= */}

      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

        <div className="grid gap-4 lg:grid-cols-3">

          {/* Search */}

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Cari Publikasi
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Cari judul atau deskripsi..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            />
          </div>

          {/* Type */}

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Jenis Publikasi
            </label>

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="Semua">
                Semua Jenis
              </option>

              {publicationTypes.map(
                (type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                )
              )}

            </select>
          </div>

          {/* Year */}

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Periode
            </label>

            <select
              value={yearFilter}
              onChange={(event) =>
                setYearFilter(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="Semua">
                Semua Periode
              </option>

              {availableYears.map(
                (year) => (
                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                )
              )}

            </select>
          </div>

        </div>

      </div>

      {/* ================================================================
          TABLE
      ================================================================= */}

      <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">

        <div className="border-b border-gray-100 p-5">

          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Daftar Publikasi
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Menampilkan{' '}
            {filteredPublications.length}{' '}
            publikasi.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px] text-sm">

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
                  File
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Dibuat
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

              {loading ? (

                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-gray-400"
                  >
                    Memuat data publikasi...
                  </td>
                </tr>

              ) : filteredPublications.length ===
                0 ? (

                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center"
                  >

                    <div className="text-sm text-gray-400">
                      Publikasi tidak ditemukan.
                    </div>

                    <button
                      type="button"
                      onClick={
                        openCreateModal
                      }
                      className="mt-3 text-xs font-semibold text-[#F58220] hover:underline"
                    >
                      + Tambah publikasi
                    </button>

                  </td>
                </tr>

              ) : (

                filteredPublications.map(
                  (publication) => (
                    <tr
                      key={publication.id}
                      className="transition-colors hover:bg-gray-50"
                    >

                      {/* Publication */}

                      <td className="max-w-md px-5 py-4">

                        <div className="flex items-center gap-3">

                          {getReportThumbnailUrl(
                            publication.thumbnail
                          ) ? (

                            <img
                              src={getReportThumbnailUrl(
                                publication.thumbnail
                              ) ?? ''}
                              alt={
                                publication.title
                              }
                              className="h-10 w-10 rounded-lg border border-gray-100 object-cover"
                            />

                          ) : (

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 3h8l4 4v14H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14 3v5h5"
                                />
                              </svg>
                            </div>

                          )}

                          <div className="min-w-0">

                            <div className="truncate font-medium text-gray-900">
                              {publication.title}
                            </div>

                            {publication.description && (
                              <div className="mt-1 line-clamp-1 text-xs text-gray-400">
                                {
                                  publication.description
                                }
                              </div>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* Type */}

                      <td className="px-5 py-4">

                        <span className="whitespace-nowrap rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-[#F58220]">
                          {publication.type}
                        </span>

                      </td>

                      {/* Year */}

                      <td className="px-5 py-4 text-gray-600">
                        {publication.year}
                      </td>

                      {/* File */}

                      <td className="px-5 py-4">

                        {publication.file ? (

                          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-500">
                            PDF
                          </span>

                        ) : (

                          <span className="text-xs text-gray-400">
                            Tidak ada
                          </span>

                        )}

                      </td>

                      {/* Created */}

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">

                        {new Date(
                          publication.created_at
                        ).toLocaleDateString(
                          'id-ID',
                          {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}

                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            publication.status ===
                            'published'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {publication.status ===
                          'published'
                            ? 'Tersedia'
                            : 'Draft'}
                        </span>

                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3 whitespace-nowrap">

                          <button
                            type="button"
                            onClick={() =>
                              handleViewFile(
                                publication.file
                              )
                            }
                            disabled={
                              !publication.file
                            }
                            className="text-xs font-medium text-[#F58220] hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Lihat
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDownloadFile(
                                publication.file
                              )
                            }
                            disabled={
                              !publication.file
                            }
                            className="text-xs font-medium text-blue-600 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Download
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                publication
                              )
                            }
                            className="text-xs font-medium text-blue-600 hover:underline"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                publication
                              )
                            }
                            className="text-xs font-medium text-red-500 hover:underline"
                          >
                            Hapus
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================================================================
          MODAL
      ================================================================= */}

      {isModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

              <div>

                <h2
                  className="text-lg font-bold text-gray-900"
                  style={{
                    fontFamily:
                      "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {editingReport
                    ? 'Edit Publikasi'
                    : 'Tambah Publikasi'}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {editingReport
                    ? 'Perbarui data publikasi.'
                    : 'Upload publikasi baru ke sistem.'}
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="text-xl text-gray-400 hover:text-gray-700 disabled:opacity-50"
              >
                ×
              </button>

            </div>

            {/* Modal Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 px-6 py-6"
            >

              {/* Title */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Judul Publikasi{' '}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    updateForm(
                      'title',
                      event.target.value
                    )
                  }
                  placeholder="Contoh: Laporan Keuangan LAZISMU 2026"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                  required
                />

              </div>

              {/* Type + Year */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Jenis Publikasi{' '}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    value={form.type}
                    onChange={(event) =>
                      updateForm(
                        'type',
                        event.target
                          .value as PublicationType
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                  >

                    {publicationTypes.map(
                      (type) => (
                        <option
                          key={type}
                          value={type}
                        >
                          {type}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Tahun{' '}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="number"
                    min="2000"
                    max="2100"
                    value={form.year}
                    onChange={(event) =>
                      updateForm(
                        'year',
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                    required
                  />

                </div>

              </div>

              {/* Status */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateForm(
                      'status',
                      event.target
                        .value as
                        | 'draft'
                        | 'published'
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                >

                  <option value="published">
                    Published
                  </option>

                  <option value="draft">
                    Draft
                  </option>

                </select>

              </div>

              {/* Description */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Deskripsi
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm(
                      'description',
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Masukkan deskripsi publikasi..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                />

              </div>

              {/* Thumbnail */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Thumbnail / Cover
                </label>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={(event) =>
                    updateForm(
                      'thumbnail',
                      event.target
                        .files?.[0] ?? null
                    )
                  }
                  className="block w-full rounded-xl border border-gray-200 bg-white text-sm file:mr-4 file:border-0 file:bg-orange-50 file:px-4 file:py-3 file:font-semibold file:text-[#F58220]"
                />

                <p className="mt-1 text-xs text-gray-400">
                  JPG, JPEG, PNG atau WEBP.
                </p>

              </div>

              {/* PDF */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">

                  File Publikasi PDF{' '}

                  {!editingReport && (
                    <span className="text-red-500">
                      *
                    </span>
                  )}

                </label>

                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(event) =>
                    updateForm(
                      'file',
                      event.target
                        .files?.[0] ?? null
                    )
                  }
                  className="block w-full rounded-xl border border-gray-200 bg-white text-sm file:mr-4 file:border-0 file:bg-red-50 file:px-4 file:py-3 file:font-semibold file:text-red-500"
                  required={!editingReport}
                />

                <p className="mt-1 text-xs text-gray-400">
                  File harus berupa PDF.
                  {editingReport &&
                    ' Kosongkan jika ingin menggunakan file lama.'}
                </p>

              </div>

              {/* Existing File */}

              {editingReport?.file && (
                <div className="rounded-xl bg-gray-50 p-4">

                  <p className="text-xs text-gray-500">
                    File saat ini
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleViewFile(
                        editingReport.file
                      )
                    }
                    className="mt-1 text-sm font-semibold text-[#F58220] hover:underline"
                  >
                    Lihat PDF saat ini
                  </button>

                </div>
              )}

              {/* Modal Footer */}

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? 'Menyimpan...'
                    : editingReport
                      ? 'Simpan Perubahan'
                      : 'Simpan Publikasi'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}