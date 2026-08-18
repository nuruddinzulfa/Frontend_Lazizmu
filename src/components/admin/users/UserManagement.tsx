'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  getAdminUsers,
  getAdminUser,
  createAdminUser,
  updateAdminUser,
  updateAdminUserStatus,
  deleteAdminUser,
  type AdminUser,
  type AdminUserRole,
  type AdminUserStatus,
} from '../../../service/user.service'

/*
|--------------------------------------------------------------------------
| FORM TYPES
|--------------------------------------------------------------------------
*/

interface CreateFormState {
  name: string
  email: string
  phone: string
  password: string
  password_confirmation: string
  role: AdminUserRole
  status: AdminUserStatus
  photo: File | null
}

interface EditFormState {
  name: string
  email: string
  phone: string
  password: string
  password_confirmation: string
  role: AdminUserRole
  status: AdminUserStatus
  photo: File | null
}

const initialCreateForm: CreateFormState = {
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  role: 'Admin Konten',
  status: 'active',
  photo: null,
}

const initialEditForm: EditFormState = {
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  role: 'Admin Konten',
  status: 'active',
  photo: null,
}

const VALID_ROLES: AdminUserRole[] = [
  'Super Admin',
  'Admin Donasi',
  'Admin Konten',
]

const VALID_STATUSES: AdminUserStatus[] = ['active', 'inactive']

const MAX_PHOTO_SIZE = 2 * 1024 * 1024

const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/*
|--------------------------------------------------------------------------
| PASSWORD INPUT (shared UI, no shared state)
|--------------------------------------------------------------------------
*/

interface PasswordFieldProps {
  label: string
  name: string
  value: string
  visible: boolean
  disabled: boolean
  placeholder: string
  onChange: (value: string) => void
  onToggleVisible: () => void
}

function PasswordField(props: PasswordFieldProps) {
  const {
    label,
    name,
    value,
    visible,
    disabled,
    placeholder,
    onChange,
    onToggleVisible,
  } = props

  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-gray-600">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          name={name}
          autoComplete="new-password"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-11 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
        />

        <button
          type="button"
          disabled={disabled}
          onClick={onToggleVisible}
          aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
        >
          {visible ? '🙈' : '👁️'}
        </button>
      </div>
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| MAIN COMPONENT
|--------------------------------------------------------------------------
*/

export default function UserManagement() {
  /* USERS LIST */
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* DETAIL */
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  /* FILTER */
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('Semua')
  const [statusFilter, setStatusFilter] = useState('Semua')

  /* CREATE FORM */
  const [createForm, setCreateForm] = useState<CreateFormState>(initialCreateForm)
  const [createLoading, setCreateLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [showCreatePassword, setShowCreatePassword] = useState(false)
  const [showCreatePasswordConfirmation, setShowCreatePasswordConfirmation] = useState(false)

  /* EDIT FORM */
  const [showEditModal, setShowEditModal] = useState(false)
  const [editUserId, setEditUserId] = useState<number | null>(null)
  const [editCurrentPhoto, setEditCurrentPhoto] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditFormState>(initialEditForm)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [showEditPassword, setShowEditPassword] = useState(false)
  const [showEditPasswordConfirmation, setShowEditPasswordConfirmation] = useState(false)

  /* STATUS TOGGLE */
  const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null)
  const [statusError, setStatusError] = useState<string | null>(null)

  /* DELETE */
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  /*
  |--------------------------------------------------------------------------
  | LOAD USERS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      setLoading(true)
      setError(null)

      const data = await getAdminUsers()

      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengambil data pengguna.')
    } finally {
      setLoading(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | DETAIL
  |--------------------------------------------------------------------------
  */

  async function handleDetail(id: number) {
    try {
      setDetailLoading(true)
      setDetailError(null)
      setSelectedUser(null)

      const user = await getAdminUser(id)

      setSelectedUser(user)
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : 'Gagal mengambil detail pengguna.')
    } finally {
      setDetailLoading(false)
    }
  }

  function closeDetail() {
    setSelectedUser(null)
    setDetailError(null)
    setDetailLoading(false)
  }

  /*
  |--------------------------------------------------------------------------
  | CREATE FORM HELPERS
  |--------------------------------------------------------------------------
  */

  function resetCreateForm() {
    setCreateForm(initialCreateForm)
    setShowCreatePassword(false)
    setShowCreatePasswordConfirmation(false)
    setCreateError(null)
  }

  function handleCreateInputChange(field: keyof CreateFormState, value: string) {
    setCreateForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleCreatePhotoChange(file: File | null) {
    setCreateForm((current) => ({
      ...current,
      photo: file,
    }))
  }

  function openCreate() {
    resetCreateForm()
    setShowCreateModal(true)
  }

  function closeCreate() {
    if (createLoading) {
      return
    }

    setShowCreateModal(false)
    resetCreateForm()
  }

  function validateCreateForm(): string | null {
    const name = createForm.name.trim()
    const email = createForm.email.trim()

    if (!name) {
      return 'Nama lengkap wajib diisi.'
    }

    if (!email) {
      return 'Email wajib diisi.'
    }

    if (!EMAIL_PATTERN.test(email)) {
      return 'Format email tidak valid.'
    }

    if (!createForm.password) {
      return 'Password wajib diisi.'
    }

    if (createForm.password.length < 8) {
      return 'Password minimal 8 karakter.'
    }

    if (!createForm.password_confirmation) {
      return 'Konfirmasi password wajib diisi.'
    }

    if (createForm.password !== createForm.password_confirmation) {
      return 'Password dan konfirmasi password tidak sama.'
    }

    if (!VALID_ROLES.includes(createForm.role)) {
      return 'Role pengguna tidak valid.'
    }

    if (!VALID_STATUSES.includes(createForm.status)) {
      return 'Status pengguna tidak valid.'
    }

    if (createForm.photo) {
      if (createForm.photo.size > MAX_PHOTO_SIZE) {
        return 'Ukuran foto maksimal 2 MB.'
      }

      if (!ALLOWED_PHOTO_TYPES.includes(createForm.photo.type)) {
        return 'Format foto harus JPG, JPEG, PNG, atau WEBP.'
      }
    }

    return null
  }

  async function handleCreateUser() {
    const validationError = validateCreateForm()

    if (validationError) {
      setCreateError(validationError)
      return
    }

    try {
      setCreateLoading(true)
      setCreateError(null)

      await createAdminUser({
        name: createForm.name.trim(),
        email: createForm.email.trim(),
        phone: createForm.phone.trim(),
        password: createForm.password,
        password_confirmation: createForm.password_confirmation,
        role: createForm.role,
        status: createForm.status,
        photo: createForm.photo,
      })

      await loadUsers()

      resetCreateForm()
      setShowCreateModal(false)
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Gagal menambahkan pengguna.')
    } finally {
      setCreateLoading(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | EDIT FORM HELPERS
  |--------------------------------------------------------------------------
  */

  function resetEditForm() {
    setEditUserId(null)
    setEditCurrentPhoto(null)
    setEditForm(initialEditForm)
    setShowEditPassword(false)
    setShowEditPasswordConfirmation(false)
    setEditError(null)
  }

  function handleEditInputChange(field: keyof EditFormState, value: string) {
    setEditForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleEditPhotoChange(file: File | null) {
    setEditForm((current) => ({
      ...current,
      photo: file,
    }))
  }

  async function handleEdit(id: number) {
    try {
      setEditLoading(true)
      setEditError(null)

      resetEditForm()

      const user = await getAdminUser(id)

      setEditUserId(user.id)
      setEditCurrentPhoto(user.photo)

      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        password_confirmation: '',
        role: user.role || 'Admin Konten',
        status: user.status || 'active',
        photo: null,
      })

      setShowEditModal(true)
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Gagal mengambil data pengguna.')
      setShowEditModal(true)
    } finally {
      setEditLoading(false)
    }
  }

  function closeEdit() {
    if (editLoading) {
      return
    }

    setShowEditModal(false)
    resetEditForm()
  }

  function validateEditForm(): string | null {
    const name = editForm.name.trim()
    const email = editForm.email.trim()

    if (!name) {
      return 'Nama lengkap wajib diisi.'
    }

    if (!email) {
      return 'Email wajib diisi.'
    }

    if (!EMAIL_PATTERN.test(email)) {
      return 'Format email tidak valid.'
    }

    if (editForm.password) {
      if (editForm.password.length < 8) {
        return 'Password minimal 8 karakter.'
      }

      if (!editForm.password_confirmation) {
        return 'Konfirmasi password wajib diisi jika password diubah.'
      }

      if (editForm.password !== editForm.password_confirmation) {
        return 'Password dan konfirmasi password tidak sama.'
      }
    }

    if (!VALID_ROLES.includes(editForm.role)) {
      return 'Role pengguna tidak valid.'
    }

    if (!VALID_STATUSES.includes(editForm.status)) {
      return 'Status pengguna tidak valid.'
    }

    if (editForm.photo) {
      if (editForm.photo.size > MAX_PHOTO_SIZE) {
        return 'Ukuran foto maksimal 2 MB.'
      }

      if (!ALLOWED_PHOTO_TYPES.includes(editForm.photo.type)) {
        return 'Format foto harus JPG, JPEG, PNG, atau WEBP.'
      }
    }

    return null
  }

  async function handleUpdateUser() {
    if (editUserId === null) {
      setEditError('ID pengguna tidak ditemukan.')
      return
    }

    const validationError = validateEditForm()

    if (validationError) {
      setEditError(validationError)
      return
    }

    try {
      setEditLoading(true)
      setEditError(null)

      await updateAdminUser(editUserId, {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        password: editForm.password || undefined,
        password_confirmation: editForm.password_confirmation || undefined,
        role: editForm.role,
        status: editForm.status,
        photo: editForm.photo,
      })

      await loadUsers()

      setShowEditModal(false)
      resetEditForm()
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Gagal memperbarui pengguna.')
    } finally {
      setEditLoading(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | TOGGLE STATUS
  |--------------------------------------------------------------------------
  */

  async function handleToggleStatus(user: AdminUser) {
    if (statusLoadingId !== null) {
      return
    }

    if (user.role === 'Super Admin') {
      setStatusError('Status Super Admin tidak dapat diubah dari halaman ini.')
      return
    }

    const nextStatus: AdminUserStatus = user.status === 'active' ? 'inactive' : 'active'
    const currentLabel = user.status === 'active' ? 'Aktif' : 'Nonaktif'
    const nextLabel = nextStatus === 'active' ? 'Aktif' : 'Nonaktif'

    const confirmed = window.confirm(
      `Status pengguna "${user.name}" saat ini ${currentLabel}.\n\nApakah Anda yakin ingin mengubahnya menjadi ${nextLabel}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setStatusLoadingId(user.id)
      setStatusError(null)

      await updateAdminUserStatus(user, nextStatus)

      await loadUsers()
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : 'Gagal mengubah status pengguna.')
    } finally {
      setStatusLoadingId(null)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  async function handleDeleteUser(user: AdminUser) {
    if (deleteLoadingId !== null) {
      return
    }

    if (user.role === 'Super Admin') {
      setDeleteError('Akun Super Admin tidak dapat dihapus dari halaman ini.')
      return
    }

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus pengguna "${user.name}"?\n\nData pengguna akan dihapus dari sistem.`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeleteLoadingId(user.id)
      setDeleteError(null)

      await deleteAdminUser(user.id)

      await loadUsers()
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Gagal menghapus pengguna.')
    } finally {
      setDeleteLoadingId(null)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | DERIVED DATA
  |--------------------------------------------------------------------------
  */

  const filteredUsers = useMemo(() => {
    const searchValue = search.toLowerCase().trim()

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue)

      const matchesRole = roleFilter === 'Semua' || user.role === roleFilter
      const matchesStatus = statusFilter === 'Semua' || user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, search, roleFilter, statusFilter])

  const activeUsers = useMemo(
    () => users.filter((user) => user.status === 'active').length,
    [users]
  )

  const superAdmins = useMemo(
    () => users.filter((user) => user.role === 'Super Admin').length,
    [users]
  )

  const donationAdmins = useMemo(
    () => users.filter((user) => user.role === 'Admin Donasi').length,
    [users]
  )

  const contentAdmins = useMemo(
    () => users.filter((user) => user.role === 'Admin Konten').length,
    [users]
  )

  function getStatusLabel(status: AdminUserStatus) {
    return status === 'active' ? 'Aktif' : 'Nonaktif'
  }

  function getRoleClass(role: AdminUserRole | undefined) {
    if (role === 'Super Admin') {
      return 'bg-orange-100 text-[#F58220]'
    }

    if (role === 'Admin Donasi') {
      return 'bg-blue-100 text-blue-700'
    }

    return 'bg-green-100 text-green-700'
  }

  function formatDate(value: string) {
    if (!value) {
      return '—'
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return '—'
    }

    return date.toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
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
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Pengguna & Admin
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola pengguna, admin, dan hak akses sistem LAZISMU.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          + Tambah Pengguna
        </button>
      </div>

      {/* GENERAL ERROR */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={loadUsers}
              className="w-fit text-sm font-semibold text-red-600 hover:underline"
            >
              Coba lagi
            </button>
          </div>
        </div>
      )}

      {/* STATUS ERROR */}
      {statusError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-700">{statusError}</p>

            <button
              type="button"
              onClick={() => setStatusError(null)}
              className="w-fit text-sm font-semibold text-red-600 hover:underline"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* DELETE ERROR */}
      {deleteError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-700">{deleteError}</p>

            <button
              type="button"
              onClick={() => setDeleteError(null)}
              className="w-fit text-sm font-semibold text-red-600 hover:underline"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* STATISTICS */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Total Pengguna</p>
          <p className="mt-1 text-xl font-bold text-gray-900">
            {loading ? '...' : users.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Pengguna Aktif</p>
          <p className="mt-1 text-xl font-bold text-green-600">
            {loading ? '...' : activeUsers}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Admin Donasi</p>
          <p className="mt-1 text-xl font-bold text-blue-600">
            {loading ? '...' : donationAdmins}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Admin Konten</p>
          <p className="mt-1 text-xl font-bold text-[#F58220]">
            {loading ? '...' : contentAdmins}
          </p>
        </div>
      </div>

      {/* ROLE INFORMATION */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
        <h2
          className="font-bold text-gray-900"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Hak Akses Admin
        </h2>

        <p className="mt-1 text-xs text-gray-400">
          Pembagian akses berdasarkan role pengguna.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-orange-50 p-4">
            <div className="text-sm font-semibold text-[#F58220]">Super Admin</div>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Memiliki akses penuh terhadap seluruh fitur administrasi.
            </p>
            <div className="mt-3 text-xs font-medium text-gray-600">
              {loading ? '...' : superAdmins} pengguna
            </div>
          </div>

          <div className="rounded-xl bg-blue-50 p-4">
            <div className="text-sm font-semibold text-blue-600">Admin Donasi</div>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Mengelola donasi, transaksi, dan campaign penggalangan dana.
            </p>
            <div className="mt-3 text-xs font-medium text-gray-600">
              {loading ? '...' : donationAdmins} pengguna
            </div>
          </div>

          <div className="rounded-xl bg-green-50 p-4">
            <div className="text-sm font-semibold text-green-600">Admin Konten</div>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Mengelola berita, artikel, program, dan publikasi website.
            </p>
            <div className="mt-3 text-xs font-medium text-gray-600">
              {loading ? '...' : contentAdmins} pengguna
            </div>
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Cari Pengguna
            </label>

            <input
              type="search"
              name="user-search"
              autoComplete="off"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nama atau email..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">Role</label>

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="Semua">Semua Role</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin Donasi">Admin Donasi</option>
              <option value="Admin Konten">Admin Konten</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">Status</label>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="Semua">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
        </div>
      </div>

      {/* USER TABLE */}
      <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h2
            className="font-bold text-gray-900"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Daftar Pengguna
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            {loading ? 'Memuat data pengguna...' : `Menampilkan ${filteredUsers.length} pengguna.`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Pengguna
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Role
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Tanggal Dibuat
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-gray-400">
                    Memuat data pengguna...
                  </td>
                </tr>
              )}

              {!loading && !error && filteredUsers.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="mt-1 text-xs text-gray-400">{user.email}</div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleClass(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {getStatusLabel(user.status)}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-xs text-gray-500">
                    {formatDate(user.created_at)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleDetail(user.id)}
                        className="text-xs font-medium text-[#F58220] hover:underline"
                      >
                        Detail
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(user.id)}
                        disabled={statusLoadingId === user.id}
                        className="text-xs font-medium text-blue-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Edit
                      </button>

                      {user.role !== 'Super Admin' && (
                        <>
                          <button
                            type="button"
                            disabled={statusLoadingId === user.id}
                            onClick={() => handleToggleStatus(user)}
                            className="text-xs font-medium text-gray-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {statusLoadingId === user.id
                              ? 'Memproses...'
                              : user.status === 'active'
                              ? 'Nonaktifkan'
                              : 'Aktifkan'}
                          </button>

                          <button
                            type="button"
                            disabled={deleteLoadingId === user.id || statusLoadingId === user.id}
                            onClick={() => handleDeleteUser(user)}
                            className="text-xs font-medium text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deleteLoadingId === user.id ? 'Menghapus...' : 'Hapus'}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && !error && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">
                    Pengguna tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {(detailLoading || selectedUser || detailError) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">Detail Pengguna</h2>
                <p className="mt-1 text-xs text-gray-400">Informasi akun pengguna.</p>
              </div>

              <button
                type="button"
                onClick={closeDetail}
                className="text-xl leading-none text-gray-400 hover:text-gray-700"
                aria-label="Tutup"
              >
                ×
              </button>
            </div>

            {detailLoading && (
              <div className="px-6 py-10 text-center text-sm text-gray-400">
                Memuat detail pengguna...
              </div>
            )}

            {!detailLoading && detailError && (
              <div className="px-6 py-8">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-700">{detailError}</p>
                </div>
              </div>
            )}

            {!detailLoading && !detailError && selectedUser && (
              <div className="space-y-5 px-6 py-6">
                <div className="flex items-center gap-4">
                  {selectedUser.photo ? (
                    <img
                      src={selectedUser.photo}
                      alt={selectedUser.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-xl font-bold text-[#F58220]">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-gray-900">{selectedUser.name}</h3>
                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleClass(selectedUser.role)}`}
                    >
                      {selectedUser.role}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="mt-1 break-words text-sm font-medium text-gray-900">
                      {selectedUser.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Telepon</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {selectedUser.phone || '—'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Status</p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                        selectedUser.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {getStatusLabel(selectedUser.status)}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Dibuat</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatDate(selectedUser.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">Tambah Pengguna</h2>
                <p className="mt-1 text-xs text-gray-400">Buat akun pengguna atau admin baru.</p>
              </div>

              <button
                type="button"
                disabled={createLoading}
                onClick={closeCreate}
                className="text-xl leading-none text-gray-400 hover:text-gray-700 disabled:cursor-not-allowed"
                aria-label="Tutup"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 px-6 py-6">
              {createError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-700">{createError}</p>
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Nama Lengkap *
                </label>

                <input
                  type="text"
                  value={createForm.name}
                  disabled={createLoading}
                  onChange={(event) => handleCreateInputChange('name', event.target.value)}
                  placeholder="Nama lengkap"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">Email *</label>

                <input
                  type="email"
                  value={createForm.email}
                  disabled={createLoading}
                  onChange={(event) => handleCreateInputChange('email', event.target.value)}
                  placeholder="nama@lazismu.org"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Nomor Telepon
                </label>

                <input
                  type="text"
                  value={createForm.phone}
                  disabled={createLoading}
                  onChange={(event) => handleCreateInputChange('phone', event.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <PasswordField
                  label="Password *"
                  name="new-user-password"
                  value={createForm.password}
                  visible={showCreatePassword}
                  disabled={createLoading}
                  placeholder="Minimal 8 karakter"
                  onChange={(value) => handleCreateInputChange('password', value)}
                  onToggleVisible={() => setShowCreatePassword((current) => !current)}
                />

                <PasswordField
                  label="Konfirmasi Password *"
                  name="new-user-password-confirmation"
                  value={createForm.password_confirmation}
                  visible={showCreatePasswordConfirmation}
                  disabled={createLoading}
                  placeholder="Ulangi password"
                  onChange={(value) => handleCreateInputChange('password_confirmation', value)}
                  onToggleVisible={() =>
                    setShowCreatePasswordConfirmation((current) => !current)
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-600">Role *</label>

                  <select
                    value={createForm.role}
                    disabled={createLoading}
                    onChange={(event) => handleCreateInputChange('role', event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin Donasi">Admin Donasi</option>
                    <option value="Admin Konten">Admin Konten</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-600">
                    Status *
                  </label>

                  <select
                    value={createForm.status}
                    disabled={createLoading}
                    onChange={(event) => handleCreateInputChange('status', event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Foto Profil
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={createLoading}
                  onChange={(event) =>
                    handleCreatePhotoChange(event.target.files?.[0] || null)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-orange-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                />

                <p className="mt-1 text-xs text-gray-400">
                  JPG, JPEG, PNG, atau WEBP. Maksimal 2 MB.
                </p>

                {createForm.photo && (
                  <p className="mt-2 text-xs text-gray-500">
                    File dipilih: <span className="font-medium">{createForm.photo.name}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={createLoading}
                onClick={closeCreate}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={createLoading}
                onClick={handleCreateUser}
                className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createLoading ? 'Menyimpan...' : 'Simpan Pengguna'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">Edit Pengguna</h2>
                <p className="mt-1 text-xs text-gray-400">Perbarui data akun pengguna.</p>
              </div>

              <button
                type="button"
                disabled={editLoading}
                onClick={closeEdit}
                className="text-xl leading-none text-gray-400 hover:text-gray-700 disabled:cursor-not-allowed"
                aria-label="Tutup"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 px-6 py-6">
              {editError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-700">{editError}</p>
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Nama Lengkap *
                </label>

                <input
                  type="text"
                  value={editForm.name}
                  disabled={editLoading}
                  onChange={(event) => handleEditInputChange('name', event.target.value)}
                  placeholder="Nama lengkap"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">Email *</label>

                <input
                  type="email"
                  value={editForm.email}
                  disabled={editLoading}
                  onChange={(event) => handleEditInputChange('email', event.target.value)}
                  placeholder="nama@lazismu.org"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Nomor Telepon
                </label>

                <input
                  type="text"
                  value={editForm.phone}
                  disabled={editLoading}
                  onChange={(event) => handleEditInputChange('phone', event.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                />
              </div>

              <div>
                <p className="mb-4 text-xs font-semibold text-gray-700">Ubah Password</p>
                <p className="mb-4 text-xs text-gray-400">
                  Kosongkan jika password tidak ingin diubah.
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <PasswordField
                    label="Password Baru"
                    name="edit-user-password"
                    value={editForm.password}
                    visible={showEditPassword}
                    disabled={editLoading}
                    placeholder="Minimal 8 karakter"
                    onChange={(value) => handleEditInputChange('password', value)}
                    onToggleVisible={() => setShowEditPassword((current) => !current)}
                  />

                  <PasswordField
                    label="Konfirmasi Password"
                    name="edit-user-password-confirmation"
                    value={editForm.password_confirmation}
                    visible={showEditPasswordConfirmation}
                    disabled={editLoading}
                    placeholder="Ulangi password baru"
                    onChange={(value) => handleEditInputChange('password_confirmation', value)}
                    onToggleVisible={() =>
                      setShowEditPasswordConfirmation((current) => !current)
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-600">Role *</label>

                  <select
                    value={editForm.role}
                    disabled={editLoading}
                    onChange={(event) => handleEditInputChange('role', event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin Donasi">Admin Donasi</option>
                    <option value="Admin Konten">Admin Konten</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-600">
                    Status *
                  </label>

                  <select
                    value={editForm.status}
                    disabled={editLoading}
                    onChange={(event) => handleEditInputChange('status', event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Foto Profil Saat Ini
                </label>

                {editCurrentPhoto ? (
                  <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <img
                      src={editCurrentPhoto}
                      alt="Foto profil saat ini"
                      className="h-16 w-16 rounded-full object-cover"
                    />

                    <div>
                      <p className="text-sm font-medium text-gray-700">Foto profil saat ini</p>
                      <p className="mt-1 text-xs text-gray-400">
                        Pilih foto baru di bawah jika ingin menggantinya.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-xl font-bold text-[#F58220]">
                      {editForm.name ? editForm.name.charAt(0).toUpperCase() : '?'}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Belum ada foto profil</p>
                      <p className="mt-1 text-xs text-gray-400">
                        Kamu dapat menambahkan foto baru.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Ganti Foto Profil
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={editLoading}
                  onChange={(event) =>
                    handleEditPhotoChange(event.target.files?.[0] || null)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-orange-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                />

                <p className="mt-1 text-xs text-gray-400">
                  JPG, JPEG, PNG, atau WEBP. Maksimal 2 MB.
                </p>

                {editForm.photo && (
                  <p className="mt-2 text-xs text-gray-500">
                    File baru: <span className="font-medium">{editForm.photo.name}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={editLoading}
                onClick={closeEdit}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={editLoading || editUserId === null}
                onClick={handleUpdateUser}
                className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}