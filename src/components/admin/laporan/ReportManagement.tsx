'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  getAdminReports,
  createReport,
  updateReport,
  deleteReport,
  getReportFileUrl,
  type FinancialReport,
  type FinancialReportPayload,
  type PublicationType,
} from '@/service/report.service'

type ReportStatus = 'Tersedia' | 'Diproses'

const publicationTypes: PublicationType[] = [
  'Laporan Keuangan',
  'Laporan Tahunan',
  'Laporan Program',
]

const formatDate = (date: string | null) => {
  if (!date) return '-'

  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getStatus = (
  status: FinancialReport['status']
): ReportStatus => {
  return status === 'published'
    ? 'Tersedia'
    : 'Diproses'
}

export default function ReportManagement() {
  const [reports, setReports] = useState<FinancialReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [periodFilter, setPeriodFilter] = useState('Semua')
  const [typeFilter, setTypeFilter] = useState('Semua')

  const [showModal, setShowModal] = useState(false)
  const [editingReport, setEditingReport] =
    useState<FinancialReport | null>(null)

  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] =
    useState<number | null>(null)

  const [form, setForm] = useState<{
    title: string
    type: PublicationType
    year: number
    description: string
    status: 'draft' | 'published'
    file: File | null
  }>({
    title: '',
    type: 'Laporan Keuangan',
    year: new Date().getFullYear(),
    description: '',
    status: 'published',
    file: null,
  })

  /*
  |--------------------------------------------------------------------------
  | LOAD DATA
  |--------------------------------------------------------------------------
  */

  const loadReports = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getAdminReports()

      setReports(data)
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil data publikasi.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  /*
  |--------------------------------------------------------------------------
  | FILTER TAHUN
  |--------------------------------------------------------------------------
  */

  const periods = useMemo(() => {
    const years = Array.from(
      new Set(
        reports.map((report) =>
          String(report.year)
        )
      )
    )

    return years.sort(
      (a, b) => Number(b) - Number(a)
    )
  }, [reports])

  /*
  |--------------------------------------------------------------------------
  | FILTER DATA
  |--------------------------------------------------------------------------
  */

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchYear =
        periodFilter === 'Semua' ||
        String(report.year) === periodFilter

      const matchType =
        typeFilter === 'Semua' ||
        report.type === typeFilter

      return matchYear && matchType
    })
  }, [
    reports,
    periodFilter,
    typeFilter,
  ])

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const availableReports = reports.filter(
    (report) => report.status === 'published'
  ).length

  const processingReports = reports.filter(
    (report) => report.status === 'draft'
  ).length

  const activePeriod =
    reports.length > 0
      ? Math.max(
          ...reports.map(
            (report) => report.year
          )
        )
      : '-'

  /*
  |--------------------------------------------------------------------------
  | MODAL CREATE
  |--------------------------------------------------------------------------
  */

  const openCreateModal = () => {
    setEditingReport(null)

    setForm({
      title: '',
      type: 'Laporan Keuangan',
      year: new Date().getFullYear(),
      description: '',
      status: 'published',
      file: null,
    })

    setError('')
    setShowModal(true)
  }

  /*
  |--------------------------------------------------------------------------
  | MODAL EDIT
  |--------------------------------------------------------------------------
  */

  const openEditModal = (
    report: FinancialReport
  ) => {
    setEditingReport(report)

    setForm({
      title: report.title,
      type: report.type,
      year: report.year,
      description: report.description || '',
      status: report.status,
      file: null,
    })

    setError('')
    setShowModal(true)
  }

  /*
  |--------------------------------------------------------------------------
  | CLOSE MODAL
  |--------------------------------------------------------------------------
  */

  const closeModal = () => {
    if (saving) return

    setShowModal(false)
    setEditingReport(null)
  }

  /*
  |--------------------------------------------------------------------------
  | FORM INPUT
  |--------------------------------------------------------------------------
  */

  const handleInputChange = (
    field:
      | 'title'
      | 'type'
      | 'year'
      | 'description'
      | 'status',
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]:
        field === 'year'
          ? Number(value)
          : value,
    }))
  }

  /*
  |--------------------------------------------------------------------------
  | PDF
  |--------------------------------------------------------------------------
  */

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0] || null

    if (file && file.type !== 'application/pdf') {
      setError(
        'File publikasi harus berupa PDF.'
      )

      event.target.value = ''
      return
    }

    setError('')

    setForm((current) => ({
      ...current,
      file,
    }))
  }

  /*
  |--------------------------------------------------------------------------
  | CREATE / UPDATE
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!form.title.trim()) {
      setError(
        'Judul publikasi wajib diisi.'
      )
      return
    }

    if (!form.type) {
      setError(
        'Jenis publikasi wajib dipilih.'
      )
      return
    }

    if (!form.year) {
      setError(
        'Tahun publikasi wajib diisi.'
      )
      return
    }

    if (!editingReport && !form.file) {
      setError(
        'File PDF publikasi wajib dipilih.'
      )
      return
    }

    try {
      setSaving(true)
      setError('')

      const payload: FinancialReportPayload = {
        title: form.title.trim(),
        type: form.type,
        year: form.year,
        description:
          form.description.trim() || undefined,
        status: form.status,
        file: form.file,
      }

      if (editingReport) {
        await updateReport(
          editingReport.id,
          payload
        )
      } else {
        await createReport(payload)
      }

      setShowModal(false)
      setEditingReport(null)

      await loadReports()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : editingReport
            ? 'Gagal memperbarui publikasi.'
            : 'Gagal membuat publikasi.'
      )
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
    const confirmed = window.confirm(
      `Hapus publikasi "${report.title}"?\n\nFile publikasi juga akan dihapus dari sistem.`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(report.id)
      setError('')

      await deleteReport(report.id)

      await loadReports()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menghapus publikasi.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | VIEW PDF
  |--------------------------------------------------------------------------
  */

  const handleView = (
    report: FinancialReport
  ) => {
    if (report.status !== 'published') {
      return
    }

    const url = getReportFileUrl(
      report.file
    )

    if (!url) {
      alert(
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

  /*
  |--------------------------------------------------------------------------
  | DOWNLOAD PDF
  |--------------------------------------------------------------------------
  */

  const handleDownload = (
    report: FinancialReport
  ) => {
    if (report.status !== 'published') {
      return
    }

    const url = getReportFileUrl(
      report.file
    )

    if (!url) {
      alert(
        'File publikasi tidak tersedia.'
      )
      return
    }

    const link =
      document.createElement('a')

    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.click()
  }

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
            Publikasi
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola laporan publikasi Lazismu.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E87513]"
        >
          <span className="text-lg leading-none">
            +
          </span>

          Tambah Publikasi
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError('')}
            className="font-bold text-red-500 hover:text-red-700"
          >
            ×
          </button>

        </div>
      )}

      {/* STATISTICS */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Total Publikasi
          </p>

          <p className="mt-1 text-xl font-bold text-gray-900">
            {loading
              ? '...'
              : reports.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Tersedia
          </p>

          <p className="mt-1 text-xl font-bold text-green-600">
            {loading
              ? '...'
              : availableReports}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Draft
          </p>

          <p className="mt-1 text-xl font-bold text-yellow-600">
            {loading
              ? '...'
              : processingReports}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Periode Aktif
          </p>

          <p className="mt-1 text-xl font-bold text-[#F58220]">
            {loading
              ? '...'
              : activePeriod}
          </p>
        </div>

      </div>

      {/* SUMMARY */}

      <div className="grid gap-4 lg:grid-cols-2">

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

              <span className="text-sm font-semibold text-gray-900">
                {reports.length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Publikasi Published
              </span>

              <span className="text-sm font-semibold text-green-600">
                {availableReports}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Publikasi Draft
              </span>

              <span className="text-sm font-semibold text-yellow-600">
                {processingReports}
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
            Jenis publikasi yang tersimpan.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {publicationTypes.map((type) => {
              const count =
                reports.filter(
                  (report) =>
                    report.type === type
                ).length

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setTypeFilter(
                      typeFilter === type
                        ? 'Semua'
                        : type
                    )
                  }
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    typeFilter === type
                      ? 'bg-[#F58220] text-white'
                      : 'bg-orange-50 text-[#F58220] hover:bg-orange-100'
                  }`}
                >
                  {type} ({count})
                </button>
              )
            })}

          </div>
        </div>

      </div>

      {/* FILTER */}

      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

        <div className="grid gap-4 md:grid-cols-2">

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

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Periode
            </label>

            <select
              value={periodFilter}
              onChange={(event) =>
                setPeriodFilter(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="Semua">
                Semua Periode
              </option>

              {periods.map((year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              ))}
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
            Daftar Publikasi
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            {loading
              ? 'Memuat publikasi...'
              : `Menampilkan ${filteredReports.length} publikasi.`}
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px] text-sm">

            <thead className="bg-gray-50">
              <tr>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Nama Publikasi
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

              {loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-sm text-gray-400"
                  >
                    Memuat publikasi...
                  </td>
                </tr>
              )}

              {!loading &&
                filteredReports.map(
                  (report) => {
                    const status =
                      getStatus(
                        report.status
                      )

                    return (
                      <tr
                        key={report.id}
                        className="transition-colors hover:bg-gray-50"
                      >

                        <td className="max-w-sm px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-xs font-bold text-red-500">
                              PDF
                            </div>

                            <div className="min-w-0">

                              <div className="truncate font-medium text-gray-900">
                                {report.title}
                              </div>

                              {report.description && (
                                <div className="mt-1 line-clamp-1 text-xs text-gray-400">
                                  {
                                    report.description
                                  }
                                </div>
                              )}

                            </div>

                          </div>

                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-[#F58220]">
                            {report.type}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {report.year}
                        </td>

                        <td className="px-5 py-4">

                          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                            PDF
                          </span>

                        </td>

                        <td className="px-5 py-4 text-xs text-gray-500">
                          {formatDate(
                            report.created_at
                          )}
                        </td>

                        <td className="px-5 py-4">

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              status ===
                              'Tersedia'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {status}
                          </span>

                        </td>

                        <td className="px-5 py-4">

                          <div className="flex flex-wrap items-center gap-3">

                            <button
                              type="button"
                              disabled={
                                status !==
                                'Tersedia'
                              }
                              onClick={() =>
                                handleView(
                                  report
                                )
                              }
                              className="text-xs font-medium text-[#F58220] hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Lihat
                            </button>

                            <button
                              type="button"
                              disabled={
                                status !==
                                'Tersedia'
                              }
                              onClick={() =>
                                handleDownload(
                                  report
                                )
                              }
                              className="text-xs font-medium text-blue-600 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Download
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  report
                                )
                              }
                              className="text-xs font-medium text-gray-600 hover:underline"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              disabled={
                                deletingId ===
                                report.id
                              }
                              onClick={() =>
                                handleDelete(
                                  report
                                )
                              }
                              className="text-xs font-medium text-red-600 hover:underline disabled:opacity-40"
                            >
                              {deletingId ===
                              report.id
                                ? 'Menghapus...'
                                : 'Hapus'}
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  }
                )}

              {!loading &&
                filteredReports.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-sm text-gray-400"
                    >
                      Publikasi tidak
                      ditemukan.
                    </td>
                  </tr>
                )}

            </tbody>

          </table>

        </div>
      </div>

      {/* MODAL CREATE / EDIT */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingReport
                    ? 'Edit Publikasi'
                    : 'Tambah Publikasi'}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {editingReport
                    ? 'Perbarui informasi publikasi.'
                    : 'Upload publikasi baru ke sistem.'}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="text-2xl text-gray-400 hover:text-gray-700 disabled:opacity-40"
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* JUDUL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Judul Publikasi
                  <span className="text-red-500">
                    {' '}*
                  </span>
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    handleInputChange(
                      'title',
                      event.target.value
                    )
                  }
                  placeholder="Contoh: Laporan Keuangan Tahun 2025"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                  required
                />
              </div>

              {/* TYPE + YEAR */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Jenis Publikasi
                    <span className="text-red-500">
                      {' '}*
                    </span>
                  </label>

                  <select
                    value={form.type}
                    onChange={(event) =>
                      handleInputChange(
                        'type',
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                    required
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
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Tahun
                    <span className="text-red-500">
                      {' '}*
                    </span>
                  </label>

                  <input
                    type="number"
                    min="2000"
                    max="2100"
                    value={form.year}
                    onChange={(event) =>
                      handleInputChange(
                        'year',
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                    required
                  />
                </div>

              </div>

              {/* STATUS */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    handleInputChange(
                      'status',
                      event.target.value
                    )
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

              {/* DESKRIPSI */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Deskripsi
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    handleInputChange(
                      'description',
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Deskripsi singkat publikasi..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                />
              </div>

              {/* PDF */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  File Publikasi PDF
                  {!editingReport && (
                    <span className="text-red-500">
                      {' '}*
                    </span>
                  )}
                </label>

                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-red-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-red-600"
                  required={!editingReport}
                />

                <p className="mt-1 text-xs text-gray-400">
                  File harus berupa PDF.
                  {editingReport &&
                    ' Kosongkan jika tidak ingin mengganti PDF.'}
                </p>

                {editingReport && (
                  <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
                    File saat ini:{' '}
                    <span className="font-medium text-gray-700">
                      {editingReport.file}
                    </span>
                  </p>
                )}
              </div>

              {/* FOOTER */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#E87513] disabled:cursor-not-allowed disabled:opacity-60"
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