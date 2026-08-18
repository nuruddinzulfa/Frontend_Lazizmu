'use client'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  getAdminCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  type Campaign,
  type CampaignPayload,
} from '@/service/campaign.service'

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const fmt = (
  value: number | string | null | undefined
) => {
  const number = Number(value || 0)

  return (
    'Rp ' +
    number.toLocaleString('id-ID')
  )
}

/*
|--------------------------------------------------------------------------
| 6 Pilar Program
|--------------------------------------------------------------------------
*/

const CAMPAIGN_CATEGORIES = [
  'Pendidikan',
  'Kesehatan',
  'Ekonomi',
  'Sosial Dakwah',
  'Kemanusiaan',
  'Lingkungan',
]

/*
|--------------------------------------------------------------------------
| Thumbnail URL
|--------------------------------------------------------------------------
*/

const getThumbnailUrl = (
  thumbnail: string | null
) => {
  if (!thumbnail) {
    return null
  }

  if (thumbnail.startsWith('http')) {
    return thumbnail
  }

  return `http://127.0.0.1:8000/storage/${thumbnail}`
}

/*
|--------------------------------------------------------------------------
| Initial Form
|--------------------------------------------------------------------------
*/

const initialForm: CampaignPayload = {
  title: '',
  slug: '',
  category: '',
  short_description: '',
  description: '',
  target_amount: '',
  start_date: '',
  end_date: '',
  featured: false,
  urgent: false,
  status: 'draft',
  thumbnail: null,
}

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function CampaignManagement() {
  /*
  |--------------------------------------------------------------------------
  | Data
  |--------------------------------------------------------------------------
  */

  const [campaigns, setCampaigns] =
    useState<Campaign[]>([])

  const [loading, setLoading] =
    useState(true)

  const [submitting, setSubmitting] =
    useState(false)

  const [deletingId, setDeletingId] =
    useState<number | null>(null)

  /*
  |--------------------------------------------------------------------------
  | Message
  |--------------------------------------------------------------------------
  */

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')

  /*
  |--------------------------------------------------------------------------
  | Search & Filter
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] =
    useState('')

  const [campaignFilter, setCampaignFilter] =
    useState<
      'all' | 'draft' | 'published' | 'closed'
    >('all')

  /*
  |--------------------------------------------------------------------------
  | Form State
  |--------------------------------------------------------------------------
  */

  const [showForm, setShowForm] =
    useState(false)

  const [editingCampaign, setEditingCampaign] =
    useState<Campaign | null>(null)

  const [form, setForm] =
    useState<CampaignPayload>(
      initialForm
    )

  /*
  |--------------------------------------------------------------------------
  | Load Campaigns
  |--------------------------------------------------------------------------
  */

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      setError('')

      const data =
        await getAdminCampaigns()

      setCampaigns(data)
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil campaign.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCampaigns()
  }, [])

  /*
  |--------------------------------------------------------------------------
  | Filter Campaign
  |--------------------------------------------------------------------------
  */

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(
      (campaign) => {
        const matchesSearch =
          campaign.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )

        const matchesStatus =
          campaignFilter === 'all' ||
          campaign.status ===
            campaignFilter

        return (
          matchesSearch &&
          matchesStatus
        )
      }
    )
  }, [
    campaigns,
    search,
    campaignFilter,
  ])

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const totalCampaign =
    campaigns.length

  const publishedCampaigns =
    campaigns.filter(
      (item) =>
        item.status === 'published'
    ).length

  const draftCampaigns =
    campaigns.filter(
      (item) =>
        item.status === 'draft'
    ).length

  const closedCampaigns =
    campaigns.filter(
      (item) =>
        item.status === 'closed'
    ).length

  const totalCollected =
    campaigns.reduce(
      (total, campaign) =>
        total +
        Number(
          campaign.collected_amount || 0
        ),
      0
    )

  /*
  |--------------------------------------------------------------------------
  | Form Helpers
  |--------------------------------------------------------------------------
  */

  const updateForm = (
    field: keyof CampaignPayload,
    value:
      | string
      | boolean
      | File
      | null
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  /*
  |--------------------------------------------------------------------------
  | Generate Slug
  |--------------------------------------------------------------------------
  */

  const generateSlug = (
    title: string
  ) => {
    return title
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9\s-]/g,
        ''
      )
      .replace(
        /\s+/g,
        '-'
      )
      .replace(
        /-+/g,
        '-'
      )
  }

  /*
  |--------------------------------------------------------------------------
  | Title Change
  |--------------------------------------------------------------------------
  */

  const handleTitleChange = (
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      title: value,
      slug: generateSlug(value),
    }))
  }

  /*
  |--------------------------------------------------------------------------
  | Reset Form
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      category: '',
      short_description: '',
      description: '',
      target_amount: '',
      start_date: '',
      end_date: '',
      featured: false,
      urgent: false,
      status: 'draft',
      thumbnail: null,
    })

    setEditingCampaign(null)
  }

  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  const handleCreate = () => {
    resetForm()

    setError('')
    setSuccess('')

    setShowForm(true)
  }

  /*
  |--------------------------------------------------------------------------
  | Edit
  |--------------------------------------------------------------------------
  */

  const handleEdit = (
    campaign: Campaign
  ) => {
    setEditingCampaign(campaign)

    setForm({
      title: campaign.title,
      slug: campaign.slug,
      category: campaign.category,
      short_description:
        campaign.short_description,
      description:
        campaign.description,
      target_amount:
        campaign.target_amount,
      start_date:
        campaign.start_date || '',
      end_date:
        campaign.end_date || '',
      featured:
        Boolean(campaign.featured),
      urgent:
        Boolean(campaign.urgent),
      status:
        campaign.status,

      /*
       * Thumbnail sengaja null.
       *
       * Jika tidak memilih file baru,
       * backend mempertahankan thumbnail lama.
       */
      thumbnail: null,
    })

    setError('')
    setSuccess('')

    setShowForm(true)
  }

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async () => {
    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    if (!form.title.trim()) {
      setError(
        'Judul campaign wajib diisi.'
      )
      return
    }

    if (!form.slug.trim()) {
      setError(
        'Slug campaign wajib diisi.'
      )
      return
    }

    if (!form.category.trim()) {
      setError(
        'Pilar program wajib dipilih.'
      )
      return
    }

    if (
      !form.short_description.trim()
    ) {
      setError(
        'Deskripsi singkat wajib diisi.'
      )
      return
    }

    if (
      !form.description.trim()
    ) {
      setError(
        'Deskripsi campaign wajib diisi.'
      )
      return
    }

    if (
      form.target_amount === '' ||
      Number(form.target_amount) < 0
    ) {
      setError(
        'Target dana tidak valid.'
      )
      return
    }

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      /*
      |--------------------------------------------------------------------------
      | UPDATE
      |--------------------------------------------------------------------------
      */

      if (editingCampaign) {
        const updated =
          await updateCampaign(
            editingCampaign.id,
            form
          )

        setCampaigns(
          (current) =>
            current.map(
              (campaign) =>
                campaign.id ===
                editingCampaign.id
                  ? updated
                  : campaign
            )
        )

        setSuccess(
          'Campaign berhasil diperbarui.'
        )
      }

      /*
      |--------------------------------------------------------------------------
      | CREATE
      |--------------------------------------------------------------------------
      */

      else {
        const created =
          await createCampaign(
            form
          )

        setCampaigns(
          (current) => [
            created,
            ...current,
          ]
        )

        setSuccess(
          'Campaign berhasil dibuat.'
        )
      }

      /*
      |--------------------------------------------------------------------------
      | Close Form
      |--------------------------------------------------------------------------
      */

      resetForm()
      setShowForm(false)
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : editingCampaign
            ? 'Gagal memperbarui campaign.'
            : 'Gagal membuat campaign.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (
    id: number
  ) => {
    const confirmed =
      window.confirm(
        'Apakah Anda yakin ingin menghapus campaign ini?'
      )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(id)

      setError('')
      setSuccess('')

      await deleteCampaign(id)

      setCampaigns(
        (current) =>
          current.filter(
            (campaign) =>
              campaign.id !== id
          )
      )

      setSuccess(
        'Campaign berhasil dihapus.'
      )
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menghapus campaign.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-5">

      {/* ================================================================
          HEADER
      ================================================================ */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1
            className="text-lg font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Campaign
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola campaign penggalangan
            dana LAZISMU.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          + Tambah Campaign
        </button>

      </div>

      {/* ================================================================
          ERROR
      ================================================================ */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ================================================================
          SUCCESS
      ================================================================ */}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* ================================================================
          FORM
      ================================================================ */}

      {showForm && (
        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

          {/* Header Form */}

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2
                className="font-bold text-gray-900"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {editingCampaign
                  ? 'Edit Campaign'
                  : 'Tambah Campaign'}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {editingCampaign
                  ? 'Perbarui informasi campaign.'
                  : 'Data akan langsung disimpan ke database.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetForm()
                setShowForm(false)
              }}
              disabled={submitting}
              className="text-sm text-gray-400 hover:text-gray-700 disabled:opacity-50"
            >
              ✕
            </button>

          </div>

          {/* ============================================================
              FORM FIELDS
          ============================================================ */}

          <div className="grid gap-4 md:grid-cols-2">

            {/* Title */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Judul Campaign
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  handleTitleChange(
                    e.target.value
                  )
                }
                placeholder="Contoh: Bantuan Pendidikan Anak Yatim"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
              />
            </div>

            {/* Slug */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Slug
              </label>

              <input
                type="text"
                value={form.slug}
                onChange={(e) =>
                  updateForm(
                    'slug',
                    e.target.value
                  )
                }
                placeholder="bantuan-pendidikan-anak-yatim"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
              />
            </div>

            {/* Category */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Pilar Program
              </label>

              <select
                value={form.category}
                onChange={(e) =>
                  updateForm(
                    'category',
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-[#F3DEC8] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
              >
                <option value="">
                  Pilih Pilar Program
                </option>

                {CAMPAIGN_CATEGORIES.map(
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

            {/* Target */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Target Dana
              </label>

              <input
                type="number"
                min="0"
                value={
                  form.target_amount
                }
                onChange={(e) =>
                  updateForm(
                    'target_amount',
                    e.target.value
                  )
                }
                placeholder="100000000"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
              />
            </div>

            {/* Status */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  updateForm(
                    'status',
                    e.target.value as
                      | 'draft'
                      | 'published'
                      | 'closed'
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
              >
                <option value="draft">
                  Draft
                </option>

                <option value="published">
                  Published
                </option>

                <option value="closed">
                  Closed
                </option>
              </select>
            </div>

            {/* Start Date */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Tanggal Mulai
              </label>

              <input
                type="date"
                value={
                  form.start_date || ''
                }
                onChange={(e) =>
                  updateForm(
                    'start_date',
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
              />
            </div>

            {/* End Date */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Tanggal Selesai
              </label>

              <input
                type="date"
                value={
                  form.end_date || ''
                }
                onChange={(e) =>
                  updateForm(
                    'end_date',
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
              />
            </div>

            {/* Short Description */}

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Deskripsi Singkat
              </label>

              <textarea
                value={
                  form.short_description
                }
                onChange={(e) =>
                  updateForm(
                    'short_description',
                    e.target.value
                  )
                }
                rows={3}
                placeholder="Ringkasan singkat campaign..."
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
              />
            </div>

            {/* Description */}

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Deskripsi Campaign
              </label>

              <textarea
                value={
                  form.description
                }
                onChange={(e) =>
                  updateForm(
                    'description',
                    e.target.value
                  )
                }
                rows={7}
                placeholder="Jelaskan campaign secara lengkap..."
                className="w-full resize-y rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
              />
            </div>

            {/* Thumbnail */}

            <div className="md:col-span-2">

              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Thumbnail
              </label>

              {editingCampaign &&
                editingCampaign.thumbnail && (
                  <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#FFF8F2] p-3">

                    <img
                      src={
                        getThumbnailUrl(
                          editingCampaign.thumbnail
                        ) || ''
                      }
                      alt={
                        editingCampaign.title
                      }
                      className="h-16 w-24 rounded-lg object-cover"
                    />

                    <div>
                      <p className="text-xs font-semibold text-gray-700">
                        Thumbnail saat ini
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Pilih file baru jika ingin menggantinya.
                      </p>
                    </div>

                  </div>
                )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) =>
                  updateForm(
                    'thumbnail',
                    e.target.files?.[0] ??
                      null
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
              />

              <p className="mt-1 text-xs text-gray-400">
                JPG, PNG, atau WEBP.
                Maksimal 2MB.
              </p>

            </div>

          </div>

          {/* ============================================================
              CAMPAIGN FLAGS
          ============================================================ */}

          <div className="mt-4 space-y-3">

            {/* Featured */}

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">

              <input
                type="checkbox"
                checked={
                  Boolean(form.featured)
                }
                onChange={(e) =>
                  updateForm(
                    'featured',
                    e.target.checked
                  )
                }
                className="h-4 w-4 accent-[#F58220]"
              />

              <span>
                Tandai sebagai campaign unggulan
              </span>

            </label>

            {/* Urgent */}

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">

              <input
                type="checkbox"
                checked={
                  Boolean(form.urgent)
                }
                onChange={(e) =>
                  updateForm(
                    'urgent',
                    e.target.checked
                  )
                }
                className="h-4 w-4 accent-red-500"
              />

              <span>
                Tandai sebagai campaign urgent
              </span>

            </label>

          </div>

          {/* ============================================================
              ACTIONS
          ============================================================ */}

          <div className="mt-5 flex justify-end gap-2">

            <button
              type="button"
              onClick={() => {
                resetForm()
                setShowForm(false)
              }}
              disabled={submitting}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? 'Menyimpan...'
                : editingCampaign
                  ? 'Simpan Perubahan'
                  : 'Simpan Campaign'}
            </button>

          </div>

        </div>
      )}

      {/* ================================================================
          STATISTICS
      ================================================================ */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Total Campaign
          </p>

          <p className="mt-1 text-xl font-bold text-gray-900">
            {totalCampaign}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Published
          </p>

          <p className="mt-1 text-xl font-bold text-green-600">
            {publishedCampaigns}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Draft
          </p>

          <p className="mt-1 text-xl font-bold text-gray-600">
            {draftCampaigns}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Closed
          </p>

          <p className="mt-1 text-xl font-bold text-blue-600">
            {closedCampaigns}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Dana Terkumpul
          </p>

          <p className="mt-1 text-sm font-bold text-[#F58220]">
            {fmt(totalCollected)}
          </p>
        </div>

      </div>

      {/* ================================================================
          SEARCH
      ================================================================ */}

      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

        <label className="mb-2 block text-xs font-medium text-gray-600">
          Cari Campaign
        </label>

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Cari berdasarkan nama campaign..."
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
        />

      </div>

      {/* ================================================================
          FILTER
      ================================================================ */}

      <div className="flex flex-wrap items-center gap-2">

        {[
          ['all', 'Semua'],
          ['published', 'Published'],
          ['draft', 'Draft'],
          ['closed', 'Closed'],
        ].map(
          ([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setCampaignFilter(
                  value as
                    | 'all'
                    | 'draft'
                    | 'published'
                    | 'closed'
                )
              }
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                campaignFilter === value
                  ? 'bg-[#F58220] text-white'
                  : 'border border-[#F3DEC8] bg-white text-gray-600 hover:bg-orange-50'
              }`}
            >
              {label}
            </button>
          )
        )}

      </div>

      {/* ================================================================
          LIST
      ================================================================ */}

      <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">

        <div className="border-b border-gray-100 p-5">

          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Daftar Campaign
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Menampilkan{' '}
            {filteredCampaigns.length}{' '}
            campaign.
          </p>

        </div>

        {/* Loading */}

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Memuat campaign...
          </div>

        ) : filteredCampaigns.length ===
          0 ? (
          <div className="p-10 text-center text-sm text-gray-400">
            Belum ada campaign.
          </div>

        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Campaign
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Kategori
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Target
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Terkumpul
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

                {filteredCampaigns.map(
                  (campaign) => {

                    const target =
                      Number(
                        campaign.target_amount
                      )

                    const collected =
                      Number(
                        campaign.collected_amount
                      )

                    const percentage =
                      target > 0
                        ? Math.min(
                            Math.round(
                              (collected /
                                target) *
                                100
                            ),
                            100
                          )
                        : 0

                    const thumbnail =
                      getThumbnailUrl(
                        campaign.thumbnail
                      )

                    return (
                      <tr
                        key={
                          campaign.id
                        }
                        className="transition-colors hover:bg-gray-50"
                      >

                        {/* Campaign */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            {thumbnail ? (
                              <img
                                src={
                                  thumbnail
                                }
                                alt={
                                  campaign.title
                                }
                                className="h-12 w-16 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-[#FFF8F2] text-xs text-gray-400">
                                No Image
                              </div>
                            )}

                            <div className="min-w-0">

                              <div className="font-medium text-gray-900">
                                {
                                  campaign.title
                                }
                              </div>

                              <div className="mt-1 text-[11px] text-gray-400">
                                {percentage}%
                                tercapai
                              </div>

                              <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-gray-100">

                                <div
                                  className="h-full rounded-full bg-[#F58220]"
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                />

                              </div>

                            </div>

                          </div>

                        </td>

                        {/* Category */}

                        <td className="px-5 py-4 text-gray-600">
                          {
                            campaign.category
                          }
                        </td>

                        {/* Target */}

                        <td className="px-5 py-4 font-medium text-gray-700">
                          {fmt(
                            campaign.target_amount
                          )}
                        </td>

                        {/* Collected */}

                        <td className="px-5 py-4 font-semibold text-[#F58220]">
                          {fmt(
                            campaign.collected_amount
                          )}
                        </td>

                        {/* Status */}

                        <td className="px-5 py-4">

                          <div className="flex flex-wrap gap-1.5">

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                campaign.status ===
                                'published'
                                  ? 'bg-green-100 text-green-700'
                                  : campaign.status ===
                                      'closed'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {
                                campaign.status
                              }
                            </span>

                            {campaign.featured && (
                              <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
                                Unggulan
                              </span>
                            )}

                            {campaign.urgent && (
                              <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                                Urgent
                              </span>
                            )}

                          </div>

                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  campaign
                                )
                              }
                              className="font-medium text-[#F58220] hover:underline"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  campaign.id
                                )
                              }
                              disabled={
                                deletingId ===
                                campaign.id
                              }
                              className="font-medium text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId ===
                              campaign.id
                                ? 'Menghapus...'
                                : 'Hapus'}
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  )
}