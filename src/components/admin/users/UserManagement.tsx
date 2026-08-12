'use client'

import { useEffect, useState } from 'react'

import {
  getAdminUsers,
  getAdminUser,
  createAdminUser,
  updateAdminUser,
  updateAdminUserStatus,
  deleteAdminUser,
  type AdminUser,
} from '../../../service/user.service'

type UserRole =
  | 'Super Admin'
  | 'Admin Donasi'
  | 'Admin Konten'

type UserStatus =
  | 'active'
  | 'inactive'

export default function UserManagement() {
  /*
  |--------------------------------------------------------------------------
  | USERS
  |--------------------------------------------------------------------------
  */

  const [users, setUsers] =
    useState<AdminUser[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  /*
  |--------------------------------------------------------------------------
  | DETAIL USER
  |--------------------------------------------------------------------------
  */

  const [selectedUser, setSelectedUser] =
    useState<AdminUser | null>(null)

  const [detailLoading, setDetailLoading] =
    useState(false)

  const [detailError, setDetailError] =
    useState<string | null>(null)

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] =
    useState('')

  const [roleFilter, setRoleFilter] =
    useState('Semua')

  const [statusFilter, setStatusFilter] =
    useState('Semua')

  /*
  |--------------------------------------------------------------------------
  | CREATE USER FORM
  |--------------------------------------------------------------------------
  */

  const [createForm, setCreateForm] =
    useState({
      name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
      role: 'Admin Konten' as UserRole,
      status: 'active' as UserStatus,
      photo: null as File | null,
    })

  const [createLoading, setCreateLoading] =
    useState(false)

  const [showCreateModal, setShowCreateModal] =
    useState(false)

  const [createError, setCreateError] =
    useState<string | null>(null)

  /*
  |--------------------------------------------------------------------------
  | EDIT USER FORM
  |--------------------------------------------------------------------------
  */

  const [showEditModal, setShowEditModal] =
    useState(false)

  const [editUserId, setEditUserId] =
    useState<number | null>(null)

  const [editCurrentPhoto, setEditCurrentPhoto] =
    useState<string | null>(null)

  const [editForm, setEditForm] =
    useState({
      name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
      role: 'Admin Konten' as UserRole,
      status: 'active' as UserStatus,
      photo: null as File | null,
    })

  const [editLoading, setEditLoading] =
    useState(false)

  const [editError, setEditError] =
    useState<string | null>(null)

  /*
  |--------------------------------------------------------------------------
  | STATUS USER
  |--------------------------------------------------------------------------
  | 6.3
  |--------------------------------------------------------------------------
  */

  const [statusLoadingId, setStatusLoadingId] =
    useState<number | null>(null)

  const [statusError, setStatusError] =
    useState<string | null>(null)

  /*
|--------------------------------------------------------------------------
| DELETE USER
|--------------------------------------------------------------------------
| 7.6
|--------------------------------------------------------------------------
*/

  const [deleteLoadingId, setDeleteLoadingId] =
    useState<number | null>(null)

  const [deleteError, setDeleteError] =
    useState<string | null>(null)

  /*
  |--------------------------------------------------------------------------
  | CREATE FORM HELPERS
  |--------------------------------------------------------------------------
  */

  function resetCreateForm() {
    setCreateForm({
      name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
      role: 'Admin Konten',
      status: 'active',
      photo: null,
    })

    setCreateError(null)
  }

  function handleCreateInputChange(
    field: keyof typeof createForm,
    value: string
  ) {
    setCreateForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleCreatePhotoChange(
    file: File | null
  ) {
    setCreateForm((current) => ({
      ...current,
      photo: file,
    }))
  }

  /*
  |--------------------------------------------------------------------------
  | EDIT FORM HELPERS
  |--------------------------------------------------------------------------
  */

  function resetEditForm() {
    setEditUserId(null)
    setEditCurrentPhoto(null)

    setEditForm({
      name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
      role: 'Admin Konten',
      status: 'active',
      photo: null,
    })

    setEditError(null)
  }

  function handleEditInputChange(
    field: keyof typeof editForm,
    value: string
  ) {
    setEditForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleEditPhotoChange(
    file: File | null
  ) {
    setEditForm((current) => ({
      ...current,
      photo: file,
    }))
  }

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadUsers()
  }, [])

  /*
  |--------------------------------------------------------------------------
  | LOAD USERS
  |--------------------------------------------------------------------------
  */

  async function loadUsers() {
    try {
      setLoading(true)
      setError(null)

      const data =
        await getAdminUsers()

      setUsers(data)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Gagal mengambil data pengguna.'
      )
    } finally {
      setLoading(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | DETAIL USER
  |--------------------------------------------------------------------------
  */

  async function handleDetail(
    id: number
  ) {
    try {
      setDetailLoading(true)
      setDetailError(null)
      setSelectedUser(null)

      const user =
        await getAdminUser(id)

      setSelectedUser(user)
    } catch (error) {
      setDetailError(
        error instanceof Error
          ? error.message
          : 'Gagal mengambil detail pengguna.'
      )
    } finally {
      setDetailLoading(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | CLOSE DETAIL
  |--------------------------------------------------------------------------
  */

  function closeDetail() {
    setSelectedUser(null)
    setDetailError(null)
    setDetailLoading(false)
  }

  /*
  |--------------------------------------------------------------------------
  | OPEN EDIT USER
  |--------------------------------------------------------------------------
  */

  async function handleEdit(
    id: number
  ) {
    try {
      setEditLoading(true)
      setEditError(null)

      resetEditForm()

      const user =
        await getAdminUser(id)

      setEditUserId(user.id)

      setEditCurrentPhoto(
        user.photo
      )

      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        password_confirmation: '',
        role:
          (user.role as UserRole) ||
          'Admin Konten',
        status:
          (user.status as UserStatus) ||
          'active',
        photo: null,
      })

      setShowEditModal(true)
    } catch (error) {
      setEditError(
        error instanceof Error
          ? error.message
          : 'Gagal mengambil data pengguna.'
      )

      setShowEditModal(true)
    } finally {
      setEditLoading(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | CLOSE EDIT
  |--------------------------------------------------------------------------
  */

  function closeEdit() {
    if (editLoading) {
      return
    }

    setShowEditModal(false)
    resetEditForm()
  }

  /*
  |--------------------------------------------------------------------------
  | VALIDATE CREATE
  |--------------------------------------------------------------------------
  */

  function validateCreateForm(): string | null {
    const name =
      createForm.name.trim()

    const email =
      createForm.email.trim()

    if (!name) {
      return 'Nama lengkap wajib diisi.'
    }

    if (!email) {
      return 'Email wajib diisi.'
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(email)) {
      return 'Format email tidak valid.'
    }

    if (!createForm.password) {
      return 'Password wajib diisi.'
    }

    if (
      createForm.password.length < 8
    ) {
      return 'Password minimal 8 karakter.'
    }

    if (
      !createForm.password_confirmation
    ) {
      return 'Konfirmasi password wajib diisi.'
    }

    if (
      createForm.password !==
      createForm.password_confirmation
    ) {
      return 'Password dan konfirmasi password tidak sama.'
    }

    const validRoles: UserRole[] = [
      'Super Admin',
      'Admin Donasi',
      'Admin Konten',
    ]

    if (
      !validRoles.includes(
        createForm.role
      )
    ) {
      return 'Role pengguna tidak valid.'
    }

    const validStatuses: UserStatus[] = [
      'active',
      'inactive',
    ]

    if (
      !validStatuses.includes(
        createForm.status
      )
    ) {
      return 'Status pengguna tidak valid.'
    }

    if (createForm.photo) {
      const maxSize =
        2 * 1024 * 1024

      if (
        createForm.photo.size >
        maxSize
      ) {
        return 'Ukuran foto maksimal 2 MB.'
      }

      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
      ]

      if (
        !allowedTypes.includes(
          createForm.photo.type
        )
      ) {
        return 'Format foto harus JPG, JPEG, atau WEBP.'
      }
    }

    return null
  }

  /*
  |--------------------------------------------------------------------------
  | CREATE USER
  |--------------------------------------------------------------------------
  */

  async function handleCreateUser() {
    const validationError =
      validateCreateForm()

    if (validationError) {
      setCreateError(
        validationError
      )

      return
    }

    try {
      setCreateLoading(true)
      setCreateError(null)

      await createAdminUser({
        name: createForm.name.trim(),
        email: createForm.email.trim(),
        phone: createForm.phone.trim(),
        password:
          createForm.password,
        password_confirmation:
          createForm.password_confirmation,
        role: createForm.role,
        status: createForm.status,
        photo: createForm.photo,
      })

      await loadUsers()

      resetCreateForm()

      setShowCreateModal(false)
    } catch (error) {
      setCreateError(
        error instanceof Error
          ? error.message
          : 'Gagal menambahkan pengguna.'
      )
    } finally {
      setCreateLoading(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | VALIDATE EDIT
  |--------------------------------------------------------------------------
  */

  function validateEditForm(): string | null {
    const name =
      editForm.name.trim()

    const email =
      editForm.email.trim()

    if (!name) {
      return 'Nama lengkap wajib diisi.'
    }

    if (!email) {
      return 'Email wajib diisi.'
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(email)) {
      return 'Format email tidak valid.'
    }

    /*
    |--------------------------------------------------------------------------
    | PASSWORD OPTIONAL
    |--------------------------------------------------------------------------
    */

    if (editForm.password) {
      if (
        editForm.password.length < 8
      ) {
        return 'Password minimal 8 karakter.'
      }

      if (
        !editForm.password_confirmation
      ) {
        return 'Konfirmasi password wajib diisi jika password diubah.'
      }

      if (
        editForm.password !==
        editForm.password_confirmation
      ) {
        return 'Password dan konfirmasi password tidak sama.'
      }
    }

    const validRoles: UserRole[] = [
      'Super Admin',
      'Admin Donasi',
      'Admin Konten',
    ]

    if (
      !validRoles.includes(
        editForm.role
      )
    ) {
      return 'Role pengguna tidak valid.'
    }

    const validStatuses: UserStatus[] = [
      'active',
      'inactive',
    ]

    if (
      !validStatuses.includes(
        editForm.status
      )
    ) {
      return 'Status pengguna tidak valid.'
    }

    /*
    |--------------------------------------------------------------------------
    | PHOTO
    |--------------------------------------------------------------------------
    */

    if (editForm.photo) {
      const maxSize =
        2 * 1024 * 1024

      if (
        editForm.photo.size >
        maxSize
      ) {
        return 'Ukuran foto maksimal 2 MB.'
      }

      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
      ]

      if (
        !allowedTypes.includes(
          editForm.photo.type
        )
      ) {
        return 'Format foto harus JPG, JPEG, atau WEBP.'
      }
    }

    return null
  }

  /*
  |--------------------------------------------------------------------------
  | UPDATE USER
  |--------------------------------------------------------------------------
  */

  async function handleUpdateUser() {
    if (editUserId === null) {
      setEditError(
        'ID pengguna tidak ditemukan.'
      )

      return
    }

    const validationError =
      validateEditForm()

    if (validationError) {
      setEditError(
        validationError
      )

      return
    }

    try {
      setEditLoading(true)
      setEditError(null)

      await updateAdminUser(
        editUserId,
        {
          name:
            editForm.name.trim(),

          email:
            editForm.email.trim(),

          phone:
            editForm.phone.trim(),

          password:
            editForm.password ||
            undefined,

          password_confirmation:
            editForm.password_confirmation ||
            undefined,

          role:
            editForm.role,

          status:
            editForm.status,

          photo:
            editForm.photo,
        }
      )

      await loadUsers()

      setShowEditModal(false)

      resetEditForm()

    } catch (error) {
      setEditError(
        error instanceof Error
          ? error.message
          : 'Gagal memperbarui pengguna.'
      )
    } finally {
      setEditLoading(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | TOGGLE USER STATUS
  |--------------------------------------------------------------------------
  | 6.1 - 6.8
  |--------------------------------------------------------------------------
  */

  async function handleToggleStatus(
    user: AdminUser
  ) {
    /*
    |--------------------------------------------------------------------------
    | CEGAH DOUBLE CLICK
    |--------------------------------------------------------------------------
    */

    if (
      statusLoadingId !== null
    ) {
      return
    }

    /*
    |--------------------------------------------------------------------------
    | SUPER ADMIN
    |--------------------------------------------------------------------------
    |
    | Pengaman tambahan di frontend.
    |
    */

    if (
      user.role === 'Super Admin'
    ) {
      setStatusError(
        'Status Super Admin tidak dapat diubah dari halaman ini.'
      )

      return
    }

    /*
    |--------------------------------------------------------------------------
    | TENTUKAN STATUS BARU
    |--------------------------------------------------------------------------
    */

    const nextStatus: UserStatus =
      user.status === 'active'
        ? 'inactive'
        : 'active'

    const currentLabel =
      user.status === 'active'
        ? 'Aktif'
        : 'Nonaktif'

    const nextLabel =
      nextStatus === 'active'
        ? 'Aktif'
        : 'Nonaktif'

    /*
    |--------------------------------------------------------------------------
    | CONFIRMATION
    |--------------------------------------------------------------------------
    | 6.5
    |--------------------------------------------------------------------------
    */

    const confirmed =
      window.confirm(
        `Status pengguna "${user.name}" saat ini ${currentLabel}.\n\n` +
        `Apakah Anda yakin ingin mengubahnya menjadi ${nextLabel}?`
      )

    if (!confirmed) {
      return
    }

    /*
    |--------------------------------------------------------------------------
    | REQUEST
    |--------------------------------------------------------------------------
    | 6.3 - 6.4
    |--------------------------------------------------------------------------
    */

    try {
      setStatusLoadingId(
        user.id
      )

      setStatusError(null)

      await updateAdminUserStatus(
        user,
        nextStatus
      )

      /*
      |--------------------------------------------------------------------------
      | REFRESH DATA
      |--------------------------------------------------------------------------
      | 6.6
      |--------------------------------------------------------------------------
      */

      await loadUsers()

    } catch (error) {
      /*
      |--------------------------------------------------------------------------
      | ERROR HANDLING
      |--------------------------------------------------------------------------
      | 6.7
      |--------------------------------------------------------------------------
      */

      setStatusError(
        error instanceof Error
          ? error.message
          : 'Gagal mengubah status pengguna.'
      )
    } finally {
      /*
      |--------------------------------------------------------------------------
      | RESET LOADING
      |--------------------------------------------------------------------------
      */

      setStatusLoadingId(null)
    }
  }

  /*
|--------------------------------------------------------------------------
| DELETE USER
|--------------------------------------------------------------------------
| 7.4 - 7.8
|--------------------------------------------------------------------------
*/

  async function handleDeleteUser(
    user: AdminUser
  ) {
    /*
    |--------------------------------------------------------------------------
    | CEGAH DOUBLE CLICK
    |--------------------------------------------------------------------------
    */

    if (
      deleteLoadingId !== null
    ) {
      return
    }

    /*
    |--------------------------------------------------------------------------
    | SUPER ADMIN
    |--------------------------------------------------------------------------
    |
    | Super Admin tidak boleh dihapus dari
    | tombol ini.
    |
    */

    if (
      user.role === 'Super Admin'
    ) {
      setDeleteError(
        'Akun Super Admin tidak dapat dihapus dari halaman ini.'
      )

      return
    }

    /*
    |--------------------------------------------------------------------------
    | CONFIRMATION
    |--------------------------------------------------------------------------
    | 7.5
    |--------------------------------------------------------------------------
    */

    const confirmed =
      window.confirm(
        `Apakah Anda yakin ingin menghapus pengguna "${user.name}"?\n\n` +
        `Data pengguna akan dihapus dari sistem.`
      )

    if (!confirmed) {
      return
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE REQUEST
    |--------------------------------------------------------------------------
    | 7.7
    |--------------------------------------------------------------------------
    */

    try {
      setDeleteLoadingId(
        user.id
      )

      setDeleteError(null)

      await deleteAdminUser(
        user.id
      )

      /*
      |--------------------------------------------------------------------------
      | REFRESH DATA
      |--------------------------------------------------------------------------
      | 7.8
      |--------------------------------------------------------------------------
      */

      await loadUsers()

    } catch (error) {

      setDeleteError(
        error instanceof Error
          ? error.message
          : 'Gagal menghapus pengguna.'
      )

    } finally {

      setDeleteLoadingId(null)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | FILTERED USERS
  |--------------------------------------------------------------------------
  */

  const filteredUsers =
    users.filter((user) => {
      const searchValue =
        search
          .toLowerCase()
          .trim()

      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(searchValue) ||
        user.email
          .toLowerCase()
          .includes(searchValue)

      const matchesRole =
        roleFilter === 'Semua' ||
        user.role === roleFilter

      const matchesStatus =
        statusFilter === 'Semua' ||
        user.status === statusFilter

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      )
    })

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const activeUsers =
    users.filter(
      (user) =>
        user.status === 'active'
    ).length

  const superAdmins =
    users.filter(
      (user) =>
        user.role === 'Super Admin'
    ).length

  const donationAdmins =
    users.filter(
      (user) =>
        user.role === 'Admin Donasi'
    ).length

  const contentAdmins =
    users.filter(
      (user) =>
        user.role === 'Admin Konten'
    ).length

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  function getStatusLabel(
    status: UserStatus
  ) {
    return status === 'active'
      ? 'Aktif'
      : 'Nonaktif'
  }

  function getRoleClass(
    role: UserRole | undefined
  ) {
    if (
      role === 'Super Admin'
    ) {
      return 'bg-orange-100 text-[#F58220]'
    }

    if (
      role === 'Admin Donasi'
    ) {
      return 'bg-blue-100 text-blue-700'
    }

    return 'bg-green-100 text-green-700'
  }

  function formatDate(
    value: string
  ) {
    if (!value) {
      return '—'
    }

    const date =
      new Date(value)

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '—'
    }

    return date.toLocaleString(
      'id-ID',
      {
        dateStyle: 'medium',
        timeStyle: 'short',
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

      {/* =========================================================
          HEADER
      ========================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1
            className="text-lg font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Pengguna & Admin
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola pengguna, admin, dan hak
            akses sistem LAZISMU.
          </p>

        </div>

        <button
          type="button"
          onClick={() => {
            resetCreateForm()
            setShowCreateModal(true)
          }}
          className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          + Tambah Pengguna
        </button>

      </div>

      {/* =========================================================
          GENERAL ERROR
      ========================================================== */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-red-700">
              {error}
            </p>

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

      {/* =========================================================
          STATUS ERROR
          6.7
      ========================================================== */}

      {statusError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-red-700">
              {statusError}
            </p>

            <button
              type="button"
              onClick={() =>
                setStatusError(null)
              }
              className="w-fit text-sm font-semibold text-red-600 hover:underline"
            >
              Tutup
            </button>

          </div>

        </div>
      )}

      {/* =========================================================
    DELETE ERROR
========================================================== */}

      {deleteError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-red-700">
              {deleteError}
            </p>

            <button
              type="button"
              onClick={() =>
                setDeleteError(null)
              }
              className="w-fit text-sm font-semibold text-red-600 hover:underline"
            >
              Tutup
            </button>

          </div>

        </div>
      )}
      {/* =========================================================
          STATISTICS
      ========================================================== */}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">

          <p className="text-xs text-gray-500">
            Total Pengguna
          </p>

          <p className="mt-1 text-xl font-bold text-gray-900">
            {loading
              ? '...'
              : users.length}
          </p>

        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">

          <p className="text-xs text-gray-500">
            Pengguna Aktif
          </p>

          <p className="mt-1 text-xl font-bold text-green-600">
            {loading
              ? '...'
              : activeUsers}
          </p>

        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">

          <p className="text-xs text-gray-500">
            Admin Donasi
          </p>

          <p className="mt-1 text-xl font-bold text-blue-600">
            {loading
              ? '...'
              : donationAdmins}
          </p>

        </div>

        <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">

          <p className="text-xs text-gray-500">
            Admin Konten
          </p>

          <p className="mt-1 text-xl font-bold text-[#F58220]">
            {loading
              ? '...'
              : contentAdmins}
          </p>

        </div>

      </div>

      {/* =========================================================
          ROLE INFORMATION
      ========================================================== */}

      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">

        <h2
          className="font-bold text-gray-900"
          style={{
            fontFamily:
              "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Hak Akses Admin
        </h2>

        <p className="mt-1 text-xs text-gray-400">
          Pembagian akses berdasarkan role
          pengguna.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">

          <div className="rounded-xl bg-orange-50 p-4">

            <div className="text-sm font-semibold text-[#F58220]">
              Super Admin
            </div>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Memiliki akses penuh terhadap
              seluruh fitur administrasi.
            </p>

            <div className="mt-3 text-xs font-medium text-gray-600">
              {loading
                ? '...'
                : superAdmins}{' '}
              pengguna
            </div>

          </div>

          <div className="rounded-xl bg-blue-50 p-4">

            <div className="text-sm font-semibold text-blue-600">
              Admin Donasi
            </div>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Mengelola donasi, transaksi,
              dan campaign penggalangan dana.
            </p>

            <div className="mt-3 text-xs font-medium text-gray-600">
              {loading
                ? '...'
                : donationAdmins}{' '}
              pengguna
            </div>

          </div>

          <div className="rounded-xl bg-green-50 p-4">

            <div className="text-sm font-semibold text-green-600">
              Admin Konten
            </div>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Mengelola berita, artikel,
              program, dan publikasi website.
            </p>

            <div className="mt-3 text-xs font-medium text-gray-600">
              {loading
                ? '...'
                : contentAdmins}{' '}
              pengguna
            </div>

          </div>

        </div>

      </div>

      {/* =========================================================
          FILTER
      ========================================================== */}

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
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Nama atau email..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            />

          </div>

          <div>

            <label className="mb-2 block text-xs font-medium text-gray-600">
              Role
            </label>

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            >

              <option value="Semua">
                Semua Role
              </option>

              <option value="Super Admin">
                Super Admin
              </option>

              <option value="Admin Donasi">
                Admin Donasi
              </option>

              <option value="Admin Konten">
                Admin Konten
              </option>

            </select>

          </div>

          <div>

            <label className="mb-2 block text-xs font-medium text-gray-600">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            >

              <option value="Semua">
                Semua Status
              </option>

              <option value="active">
                Aktif
              </option>

              <option value="inactive">
                Nonaktif
              </option>

            </select>

          </div>

        </div>

      </div>

      {/* =========================================================
          USER TABLE
      ========================================================== */}

      <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">

        <div className="border-b border-gray-100 p-5">

          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Daftar Pengguna
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            {loading
              ? 'Memuat data pengguna...'
              : `Menampilkan ${filteredUsers.length} pengguna.`}
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
                  Login Terakhir
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
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-gray-400"
                  >
                    Memuat data pengguna...
                  </td>

                </tr>
              )}

              {!loading &&
                !error &&
                filteredUsers.map(
                  (user) => (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-gray-50"
                    >

                      <td className="px-5 py-4">

                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>

                        <div className="mt-1 text-xs text-gray-400">
                          {user.email}
                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleClass(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.status ===
                            'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          {getStatusLabel(
                            user.status
                          )}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-xs text-gray-500">
                        —
                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          {/* DETAIL */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDetail(
                                user.id
                              )
                            }
                            className="text-xs font-medium text-[#F58220] hover:underline"
                          >
                            Detail
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                user.id
                              )
                            }
                            disabled={
                              statusLoadingId ===
                              user.id
                            }
                            className="text-xs font-medium text-blue-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Edit
                          </button>

                          {/* STATUS + DELETE */}

                          {user.role !==
                            'Super Admin' && (
                              <>

                                {/* =====================================================
                                  6.1 - 6.8 STATUS BUTTON
                              ====================================================== */}

                                <button
                                  type="button"
                                  disabled={
                                    statusLoadingId ===
                                    user.id
                                  }
                                  onClick={() =>
                                    handleToggleStatus(
                                      user
                                    )
                                  }
                                  className="text-xs font-medium text-gray-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {statusLoadingId ===
                                    user.id
                                    ? 'Memproses...'
                                    : user.status ===
                                      'active'
                                      ? 'Nonaktifkan'
                                      : 'Aktifkan'}
                                </button>

                                {/* =====================================================
                                  DELETE
                                  Akan dikerjakan pada langkah berikutnya.
                              ====================================================== */}

                                <button
                                  type="button"
                                  disabled={
                                    deleteLoadingId === user.id ||
                                    statusLoadingId === user.id
                                  }
                                  onClick={() =>
                                    handleDeleteUser(user)
                                  }
                                  className="text-xs font-medium text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {deleteLoadingId === user.id
                                    ? 'Menghapus...'
                                    : 'Hapus'}
                                </button>

                              </>
                            )}

                        </div>

                      </td>

                    </tr>
                  )
                )}

              {!loading &&
                !error &&
                filteredUsers.length ===
                0 && (
                  <tr>

                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-sm text-gray-400"
                    >
                      Pengguna tidak ditemukan.
                    </td>

                  </tr>
                )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =========================================================
          DETAIL MODAL
      ========================================================== */}

      {(detailLoading ||
        selectedUser ||
        detailError) && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">

                <div>

                  <h2 className="text-base font-bold text-gray-900">
                    Detail Pengguna
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Informasi akun pengguna.
                  </p>

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

              {!detailLoading &&
                detailError && (

                  <div className="px-6 py-8">

                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                      <p className="text-sm text-red-700">
                        {detailError}
                      </p>

                    </div>

                  </div>

                )}

              {!detailLoading &&
                !detailError &&
                selectedUser && (

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

                          {selectedUser.name
                            .charAt(0)
                            .toUpperCase()}

                        </div>

                      )}

                      <div>

                        <h3 className="font-bold text-gray-900">
                          {selectedUser.name}
                        </h3>

                        <span
                          className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleClass(
                            selectedUser.role
                          )}`}
                        >
                          {selectedUser.role}
                        </span>

                      </div>

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <div>

                        <p className="text-xs text-gray-400">
                          Email
                        </p>

                        <p className="mt-1 break-words text-sm font-medium text-gray-900">
                          {selectedUser.email}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs text-gray-400">
                          Telepon
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {selectedUser.phone ||
                            '—'}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs text-gray-400">
                          Status
                        </p>

                        <span
                          className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${selectedUser.status ===
                            'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          {getStatusLabel(
                            selectedUser.status
                          )}
                        </span>

                      </div>

                      <div>

                        <p className="text-xs text-gray-400">
                          ID Pengguna
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          #{selectedUser.id}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs text-gray-400">
                          Dibuat
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {formatDate(
                            selectedUser.created_at
                          )}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs text-gray-400">
                          Diperbarui
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {formatDate(
                            selectedUser.updated_at
                          )}
                        </p>

                      </div>

                    </div>

                  </div>

                )}

              {!detailLoading && (

                <div className="flex justify-end border-t border-gray-100 px-6 py-4">

                  <button
                    type="button"
                    onClick={closeDetail}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Tutup
                  </button>

                </div>

              )}

            </div>

          </div>

        )}

      {/* =========================================================
          CREATE USER MODAL
      ========================================================== */}

      {showCreateModal && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">

              <div>

                <h2 className="text-base font-bold text-gray-900">
                  Tambah Pengguna
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Tambahkan pengguna atau admin baru.
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false)
                  setCreateError(null)
                }}
                className="text-xl leading-none text-gray-400 hover:text-gray-700"
                aria-label="Tutup"
              >
                ×
              </button>

            </div>

            <div className="space-y-5 px-6 py-6">

              {createError && (

                <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                  <p className="text-sm text-red-700">
                    {createError}
                  </p>

                </div>

              )}

              <div>

                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Nama Lengkap *
                </label>

                <input
                  type="text"
                  value={createForm.name}
                  onChange={(event) =>
                    handleCreateInputChange(
                      'name',
                      event.target.value
                    )
                  }
                  placeholder="Masukkan nama lengkap"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                />

              </div>

              <div>

                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Email *
                </label>

                <input
                  type="email"
                  name="create-user-email"
                  autoComplete="off"
                  value={createForm.email}
                  onChange={(event) =>
                    handleCreateInputChange(
                      'email',
                      event.target.value
                    )
                  }
                  placeholder="contoh@email.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                />

              </div>

              <div>

                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Nomor Telepon
                </label>

                <input
                  type="tel"
                  value={createForm.phone}
                  onChange={(event) =>
                    handleCreateInputChange(
                      'phone',
                      event.target.value
                    )
                  }
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                />

              </div>

              <div className="grid gap-4 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-xs font-medium text-gray-600">
                    Password *
                  </label>

                  <input
                    type="password"
                    name="new-password"
                    autoComplete="new-password"
                    value={editForm.password}
                    disabled={editLoading}
                    onChange={(event) =>
                      handleEditInputChange(
                        'password',
                        event.target.value
                      )
                    }
                    placeholder="Minimal 8 karakter"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs font-medium text-gray-600">
                    Konfirmasi Password *
                  </label>

                  <input
                    type="password"
                    value={
                      createForm.password_confirmation
                    }
                    onChange={(event) =>
                      handleCreateInputChange(
                        'password_confirmation',
                        event.target.value
                      )
                    }
                    placeholder="Ulangi password"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                  />

                </div>

              </div>

              <div className="grid gap-4 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-xs font-medium text-gray-600">
                    Role *
                  </label>

                  <select
                    value={createForm.role}
                    onChange={(event) =>
                      handleCreateInputChange(
                        'role',
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                  >

                    <option value="Super Admin">
                      Super Admin
                    </option>

                    <option value="Admin Donasi">
                      Admin Donasi
                    </option>

                    <option value="Admin Konten">
                      Admin Konten
                    </option>

                  </select>

                </div>

                <div>

                  <label className="mb-2 block text-xs font-medium text-gray-600">
                    Status *
                  </label>

                  <select
                    value={createForm.status}
                    onChange={(event) =>
                      handleCreateInputChange(
                        'status',
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                  >

                    <option value="active">
                      Aktif
                    </option>

                    <option value="inactive">
                      Nonaktif
                    </option>

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
                  onChange={(event) =>
                    handleCreatePhotoChange(
                      event.target.files?.[0] ||
                      null
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-orange-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#F58220]"
                />

                <p className="mt-1 text-xs text-gray-400">
                  JPG, JPEG, PNG, atau WEBP. Maksimal 2 MB.
                </p>

                {createForm.photo && (

                  <p className="mt-2 text-xs text-gray-500">

                    File dipilih:{' '}

                    <span className="font-medium">
                      {createForm.photo.name}
                    </span>

                  </p>

                )}

              </div>

            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                disabled={createLoading}
                onClick={() => {
                  setShowCreateModal(false)
                  setCreateError(null)
                }}
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
                {createLoading
                  ? 'Menyimpan...'
                  : 'Simpan Pengguna'}
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =========================================================
          EDIT USER MODAL
      ========================================================== */}

      {showEditModal && (

        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">

              <div>

                <h2 className="text-base font-bold text-gray-900">
                  Edit Pengguna
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Perbarui informasi akun pengguna.
                </p>

              </div>

              <button
                type="button"
                disabled={editLoading}
                onClick={closeEdit}
                className="text-xl leading-none text-gray-400 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Tutup"
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <div className="space-y-5 px-6 py-6">

              {/* ERROR */}

              {editError && (

                <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                  <p className="text-sm text-red-700">
                    {editError}
                  </p>

                </div>

              )}

              {/* LOADING */}

              {editLoading &&
                !editUserId && (

                  <div className="rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-500">
                    Memuat data pengguna...
                  </div>

                )}

              {/* NAMA */}

              <div>

                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Nama Lengkap *
                </label>

                <input
                  type="text"
                  value={editForm.name}
                  disabled={editLoading}
                  onChange={(event) =>
                    handleEditInputChange(
                      'name',
                      event.target.value
                    )
                  }
                  placeholder="Masukkan nama lengkap"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Email *
                </label>

                <input
                  type="email"
                  name="edit-user-email"
                  autoComplete="off"
                  value={editForm.email}
                  disabled={editLoading}
                  onChange={(event) =>
                    handleEditInputChange(
                      'email',
                      event.target.value
                    )
                  }
                  placeholder="contoh@email.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                />

              </div>

              {/* PHONE */}

              <div>

                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Nomor Telepon
                </label>

                <input
                  type="tel"
                  name="edit-user-phone"
                  autoComplete="off"
                  value={editForm.phone}
                  disabled={editLoading}
                  onChange={(event) =>
                    handleEditInputChange(
                      'phone',
                      event.target.value
                    )
                  }
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                />

              </div>

              {/* PASSWORD */}

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

                <p className="mb-4 text-xs font-semibold text-gray-700">
                  Ubah Password
                </p>

                <p className="mb-4 text-xs text-gray-400">
                  Kosongkan jika password tidak ingin diubah.
                </p>

                <div className="grid gap-4 md:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-xs font-medium text-gray-600">
                      Password Baru
                    </label>

                    <input
                      type="password"
                      value={
                        editForm.password
                      }
                      disabled={editLoading}
                      onChange={(event) =>
                        handleEditInputChange(
                          'password',
                          event.target.value
                        )
                      }
                      placeholder="Minimal 8 karakter"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-xs font-medium text-gray-600">
                      Konfirmasi Password
                    </label>

                    <input
                      type="password"
                      name="new-password-confirmation"
                      autoComplete="new-password"
                      value={editForm.password_confirmation}
                      disabled={editLoading}
                      onChange={(event) =>
                        handleEditInputChange(
                          'password_confirmation',
                          event.target.value
                        )
                      }
                      placeholder="Ulangi password baru"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                    />

                  </div>

                </div>

              </div>

              {/* ROLE + STATUS */}

              <div className="grid gap-4 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-xs font-medium text-gray-600">
                    Role *
                  </label>

                  <select
                    value={editForm.role}
                    disabled={editLoading}
                    onChange={(event) =>
                      handleEditInputChange(
                        'role',
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                  >

                    <option value="Super Admin">
                      Super Admin
                    </option>

                    <option value="Admin Donasi">
                      Admin Donasi
                    </option>

                    <option value="Admin Konten">
                      Admin Konten
                    </option>

                  </select>

                </div>

                <div>

                  <label className="mb-2 block text-xs font-medium text-gray-600">
                    Status *
                  </label>

                  <select
                    value={editForm.status}
                    disabled={editLoading}
                    onChange={(event) =>
                      handleEditInputChange(
                        'status',
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                  >

                    <option value="active">
                      Aktif
                    </option>

                    <option value="inactive">
                      Nonaktif
                    </option>

                  </select>

                </div>

              </div>

              {/* CURRENT PHOTO */}

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

                      <p className="text-sm font-medium text-gray-700">
                        Foto profil saat ini
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Pilih foto baru di bawah jika ingin menggantinya.
                      </p>

                    </div>

                  </div>

                ) : (

                  <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">

                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-xl font-bold text-[#F58220]">
                      {editForm.name
                        ? editForm.name
                          .charAt(0)
                          .toUpperCase()
                        : '?'}
                    </div>

                    <div>

                      <p className="text-sm font-medium text-gray-700">
                        Belum ada foto profil
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Kamu dapat menambahkan foto baru.
                      </p>

                    </div>

                  </div>

                )}

              </div>

              {/* NEW PHOTO */}

              <div>

                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Ganti Foto Profil
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={editLoading}
                  onChange={(event) =>
                    handleEditPhotoChange(
                      event.target.files?.[0] ||
                      null
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-orange-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#F58220] disabled:cursor-not-allowed disabled:bg-gray-50"
                />

                <p className="mt-1 text-xs text-gray-400">
                  JPG, JPEG, PNG, atau WEBP. Maksimal 2 MB.
                </p>

                {editForm.photo && (

                  <p className="mt-2 text-xs text-gray-500">

                    File baru:{' '}

                    <span className="font-medium">
                      {editForm.photo.name}
                    </span>

                  </p>

                )}

              </div>

            </div>

            {/* FOOTER */}

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
                disabled={
                  editLoading ||
                  editUserId === null
                }
                onClick={
                  handleUpdateUser
                }
                className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editLoading
                  ? 'Menyimpan...'
                  : 'Simpan Perubahan'}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}