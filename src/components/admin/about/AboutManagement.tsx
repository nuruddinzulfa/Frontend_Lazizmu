'use client'
import RichTextEditor from '../../RichTextEditor'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  createOrganizationProfile,
  getAdminOrganizationProfiles,
  updateOrganizationProfile,
  getOrganizationLogoUrl,
  type OrganizationProfile,
  type OrganizationProfilePayload,
} from '../../../service/organization-profile.service'

import {
  createOrganizationMember,
  deleteOrganizationMember,
  getAdminOrganizationMembers,
  updateOrganizationMember,
  getOrganizationMemberPhotoUrl,
  type OrganizationMember,
  type OrganizationMemberPayload,
} from '../../../service/organization-member.service'

type ActiveTab = 'profile' | 'members'
const emptyProfile: OrganizationProfilePayload = {
  name: '',
  tagline: '',
  description: '',
  history: '',
  vision: '',
  mission: '',
  logo: null,
  address: '',
  phone: '',
  email: '',
  website: '',
  status: 'active',
}

const emptyMember: OrganizationMemberPayload = {
  name: '',
  position: '',
  photo: null,
  description: '',
  period: '',
  email: '',
  phone: '',
  sort_order: 0,
  status: 'active',
}

export default function AboutManagement() {
  const [activeTab, setActiveTab] =
    useState<ActiveTab>('profile')

  const [profile, setProfile] =
    useState<OrganizationProfile | null>(null)

  const [members, setMembers] =
    useState<OrganizationMember[]>([])

  const [loadingProfile, setLoadingProfile] =
    useState(true)

  const [loadingMembers, setLoadingMembers] =
    useState(true)

  const [savingProfile, setSavingProfile] =
    useState(false)

  const [savingMember, setSavingMember] =
    useState(false)

  const [deletingMemberId, setDeletingMemberId] =
    useState<number | null>(null)

  const [profileForm, setProfileForm] =
    useState<OrganizationProfilePayload>(
      emptyProfile
    )

  const [memberForm, setMemberForm] =
    useState<OrganizationMemberPayload>(
      emptyMember
    )

  const [profileLogoPreview, setProfileLogoPreview] =
    useState<string | null>(null)

  const [memberPhotoPreview, setMemberPhotoPreview] =
    useState<string | null>(null)

  const [editingMember, setEditingMember] =
    useState<OrganizationMember | null>(null)

  const [showMemberModal, setShowMemberModal] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const [success, setSuccess] =
    useState<string | null>(null)

  /*
  |--------------------------------------------------------------------------
  | PROFILE
  |--------------------------------------------------------------------------
  */

  const loadProfile = useCallback(
    async () => {
      try {
        setLoadingProfile(true)
        setError(null)

        const profiles =
          await getAdminOrganizationProfiles()

        const firstProfile =
          profiles[0] ?? null

        setProfile(firstProfile)

        if (firstProfile) {
          setProfileForm({
            name: firstProfile.name,
            tagline:
              firstProfile.tagline ?? '',
            description:
              firstProfile.description ?? '',
            history:
              firstProfile.history ?? '',
            vision:
              firstProfile.vision ?? '',
            mission:
              firstProfile.mission ?? '',
            logo: null,
            address:
              firstProfile.address ?? '',
            phone:
              firstProfile.phone ?? '',
            email:
              firstProfile.email ?? '',
            website:
              firstProfile.website ?? '',
            status:
              firstProfile.status,
          })

          setProfileLogoPreview(
            getOrganizationLogoUrl(
              firstProfile.logo
            )
          )
        } else {
          setProfileForm({
            ...emptyProfile,
          })

          setProfileLogoPreview(null)
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Gagal mengambil profil organisasi.'
        )
      } finally {
        setLoadingProfile(false)
      }
    },
    []
  )

  /*
  |--------------------------------------------------------------------------
  | MEMBERS
  |--------------------------------------------------------------------------
  */

  const loadMembers = useCallback(
    async () => {
      try {
        setLoadingMembers(true)
        setError(null)

        const data =
          await getAdminOrganizationMembers()

        setMembers(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Gagal mengambil struktur organisasi.'
        )
      } finally {
        setLoadingMembers(false)
      }
    },
    []
  )

  useEffect(() => {
    loadProfile()
    loadMembers()
  }, [
    loadProfile,
    loadMembers,
  ])

  /*
  |--------------------------------------------------------------------------
  | PROFILE HANDLERS
  |--------------------------------------------------------------------------
  */

  function handleProfileLogoChange(
    file: File | null
  ) {
    setProfileForm((current) => ({
      ...current,
      logo: file,
    }))

    if (!file) {
      setProfileLogoPreview(
        profile
          ? getOrganizationLogoUrl(
              profile.logo
            )
          : null
      )

      return
    }

    const previewUrl =
      URL.createObjectURL(file)

    setProfileLogoPreview(
      previewUrl
    )
  }

  async function handleProfileSubmit() {
    setError(null)
    setSuccess(null)

    if (!profileForm.name.trim()) {
      setError(
        'Nama organisasi wajib diisi.'
      )
      return
    }

    try {
      setSavingProfile(true)

      const payload: OrganizationProfilePayload = {
        ...profileForm,
        name:
          profileForm.name.trim(),
        tagline:
          profileForm.tagline?.trim() || '',
        description:
          profileForm.description?.trim() || '',
        history:
          profileForm.history?.trim() || '',
        vision:
          profileForm.vision?.trim() || '',
        mission:
          profileForm.mission?.trim() || '',
        address:
          profileForm.address?.trim() || '',
        phone:
          profileForm.phone?.trim() || '',
        email:
          profileForm.email?.trim() || '',
        website:
          profileForm.website?.trim() || '',
      }

      if (profile) {
        const updated =
          await updateOrganizationProfile(
            profile.id,
            payload
          )

        setProfile(updated)

        setProfileForm({
          name: updated.name,
          tagline:
            updated.tagline ?? '',
          description:
            updated.description ?? '',
          history:
            updated.history ?? '',
          vision:
            updated.vision ?? '',
          mission:
            updated.mission ?? '',
          logo: null,
          address:
            updated.address ?? '',
          phone:
            updated.phone ?? '',
          email:
            updated.email ?? '',
          website:
            updated.website ?? '',
          status:
            updated.status,
        })

        setProfileLogoPreview(
          getOrganizationLogoUrl(
            updated.logo
          )
        )

        setSuccess(
          'Profil organisasi berhasil diperbarui.'
        )
      } else {
        const created =
          await createOrganizationProfile(
            payload
          )

        setProfile(created)

        setProfileForm({
          name: created.name,
          tagline:
            created.tagline ?? '',
          description:
            created.description ?? '',
          history:
            created.history ?? '',
          vision:
            created.vision ?? '',
          mission:
            created.mission ?? '',
          logo: null,
          address:
            created.address ?? '',
          phone:
            created.phone ?? '',
          email:
            created.email ?? '',
          website:
            created.website ?? '',
          status:
            created.status,
        })

        setProfileLogoPreview(
          getOrganizationLogoUrl(
            created.logo
          )
        )

        setSuccess(
          'Profil organisasi berhasil dibuat.'
        )
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan profil organisasi.'
      )
    } finally {
      setSavingProfile(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | MEMBER MODAL
  |--------------------------------------------------------------------------
  */

  function openCreateMember() {
    setEditingMember(null)

    setMemberForm({
      ...emptyMember,
    })

    setMemberPhotoPreview(null)
    setError(null)
    setShowMemberModal(true)
  }

  function openEditMember(
    member: OrganizationMember
  ) {
    setEditingMember(member)

    setMemberForm({
      name: member.name,
      position: member.position,
      photo: null,
      description:
        member.description ?? '',
      period:
        member.period ?? '',
      email:
        member.email ?? '',
      phone:
        member.phone ?? '',
      sort_order:
        member.sort_order,
      status:
        member.status,
    })

    setMemberPhotoPreview(
      getOrganizationMemberPhotoUrl(
        member.photo
      )
    )

    setError(null)
    setShowMemberModal(true)
  }

  function closeMemberModal() {
    if (savingMember) {
      return
    }

    setShowMemberModal(false)
    setEditingMember(null)

    setMemberForm({
      ...emptyMember,
    })

    setMemberPhotoPreview(null)
  }

  function handleMemberPhotoChange(
    file: File | null
  ) {
    setMemberForm((current) => ({
      ...current,
      photo: file,
    }))

    if (!file) {
      setMemberPhotoPreview(
        editingMember
          ? getOrganizationMemberPhotoUrl(
              editingMember.photo
            )
          : null
      )

      return
    }

    const previewUrl =
      URL.createObjectURL(file)

    setMemberPhotoPreview(
      previewUrl
    )
  }

  /*
  |--------------------------------------------------------------------------
  | MEMBER SAVE
  |--------------------------------------------------------------------------
  */

  async function handleMemberSubmit() {
    setError(null)
    setSuccess(null)

    if (!memberForm.name.trim()) {
      setError(
        'Nama pengurus wajib diisi.'
      )
      return
    }

    if (!memberForm.position.trim()) {
      setError(
        'Jabatan wajib diisi.'
      )
      return
    }

    if (
      Number(
        memberForm.sort_order ?? 0
      ) < 0
    ) {
      setError(
        'Urutan tidak boleh kurang dari 0.'
      )
      return
    }

    try {
      setSavingMember(true)

      const payload: OrganizationMemberPayload = {
        name:
          memberForm.name.trim(),
        position:
          memberForm.position.trim(),
        photo:
          memberForm.photo ?? null,
        description:
          memberForm.description?.trim() || '',
        period:
          memberForm.period?.trim() || '',
        email:
          memberForm.email?.trim() || '',
        phone:
          memberForm.phone?.trim() || '',
        sort_order:
          Number(
            memberForm.sort_order ?? 0
          ),
        status:
          memberForm.status,
      }

      if (editingMember) {
        const updated =
          await updateOrganizationMember(
            editingMember.id,
            payload
          )

        setMembers((current) =>
          current
            .map((item) =>
              item.id === updated.id
                ? updated
                : item
            )
            .sort(
              (a, b) =>
                a.sort_order -
                  b.sort_order ||
                a.id - b.id
            )
        )

        setSuccess(
          'Pengurus berhasil diperbarui.'
        )
      } else {
        const created =
          await createOrganizationMember(
            payload
          )

        setMembers((current) =>
          [
            ...current,
            created,
          ].sort(
            (a, b) =>
              a.sort_order -
                b.sort_order ||
              a.id - b.id
          )
        )

        setSuccess(
          'Pengurus berhasil ditambahkan.'
        )
      }

      closeMemberModal()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan pengurus.'
      )
    } finally {
      setSavingMember(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | MEMBER DELETE
  |--------------------------------------------------------------------------
  */

  async function handleDeleteMember(
    member: OrganizationMember
  ) {
    const confirmed =
      window.confirm(
        `Hapus pengurus "${member.name}"?`
      )

    if (!confirmed) {
      return
    }

    try {
      setDeletingMemberId(
        member.id
      )

      setError(null)
      setSuccess(null)

      await deleteOrganizationMember(
        member.id
      )

      setMembers((current) =>
        current.filter(
          (item) =>
            item.id !== member.id
        )
      )

      setSuccess(
        'Pengurus berhasil dihapus.'
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menghapus pengurus.'
      )
    } finally {
      setDeletingMemberId(null)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | SORTED MEMBERS
  |--------------------------------------------------------------------------
  */

  const sortedMembers =
    useMemo(() => {
      return [...members].sort(
        (a, b) =>
          a.sort_order -
            b.sort_order ||
          a.id - b.id
      )
    }, [members])

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-full bg-[#FFF8F2] p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Tentang Kami
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Kelola profil organisasi dan struktur
          organisasi.
        </p>
      </div>

      {/* TABS */}
      <div className="mb-6 rounded-2xl border border-[#F3DEC8] bg-white p-2 shadow-sm">
        <div className="flex flex-wrap gap-2">

          <button
            type="button"
            onClick={() =>
              setActiveTab('profile')
            }
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === 'profile'
                ? 'bg-[#F58220] text-white'
                : 'text-gray-600 hover:bg-orange-50 hover:text-[#F58220]'
            }`}
          >
            Profil Organisasi
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab('members')
            }
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === 'members'
                ? 'bg-[#F58220] text-white'
                : 'text-gray-600 hover:bg-orange-50 hover:text-[#F58220]'
            }`}
          >
            Struktur Organisasi
          </button>

        </div>
      </div>

      {/* GLOBAL MESSAGE */}
      {success && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =========================================================
          PROFILE
      ========================================================= */}

      {activeTab === 'profile' && (
        <div className="rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">

          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="text-lg font-bold text-gray-900">
              Profil Organisasi
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Informasi utama yang ditampilkan pada
              halaman Tentang Kami.
            </p>
          </div>

          {loadingProfile ? (
            <div className="px-6 py-16 text-center text-sm text-gray-500">
              Memuat profil organisasi...
            </div>
          ) : (
            <>
              <div className="grid gap-6 p-6 md:grid-cols-2">

                {/* NAME */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs font-semibold text-gray-600">
                    Nama Organisasi *
                  </label>

                  <input
                    type="text"
                    value={profileForm.name}
                    disabled={savingProfile}
                    onChange={(event) =>
                      setProfileForm(
                        (current) => ({
                          ...current,
                          name:
                            event.target
                              .value,
                        })
                      )
                    }
                    placeholder="Nama organisasi"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
                  />
                </div>

                {/* TAGLINE */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs font-semibold text-gray-600">
                    Tagline
                  </label>

                  <input
                    type="text"
                    value={
                      profileForm.tagline ||
                      ''
                    }
                    disabled={savingProfile}
                    onChange={(event) =>
                      setProfileForm(
                        (current) => ({
                          ...current,
                          tagline:
                            event.target
                              .value,
                        })
                      )
                    }
                    placeholder="Tagline organisasi"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
                  />
                </div>

                {/* LOGO */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs font-semibold text-gray-600">
                    Logo Organisasi
                  </label>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                    <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                      {profileLogoPreview ? (
                        <img
                          src={
                            profileLogoPreview
                          }
                          alt="Logo organisasi"
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">
                          Belum ada logo
                        </span>
                      )}
                    </div>

                    <div>
                      <input
                        id="organization-logo"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        disabled={savingProfile}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#F58220] hover:file:bg-orange-100"
                        onChange={(event) => {
                          const file =
                            event.target
                              .files?.[0] ??
                            null

                          handleProfileLogoChange(
                            file
                          )
                        }}
                      />

                      <p className="mt-2 text-xs text-gray-400">
                        JPG, PNG, WEBP, atau AVIF.
                      </p>
                    </div>

                  </div>
                </div>

                {/* DESCRIPTION */}
<div className="md:col-span-2">
  <label
    htmlFor="organization-description"
    className="mb-2 block text-xs font-semibold text-gray-600"
  >
    Deskripsi
  </label>

  <RichTextEditor
    value={profileForm.description || ''}
    onChange={(value) =>
      setProfileForm((current) => ({
        ...current,
        description: value,
      }))
    }
    placeholder="Tulis deskripsi organisasi..."
  />
</div>

                {/* HISTORY */}
                <div className="md:col-span-2">
  <label
    htmlFor="organization-history"
    className="mb-2 block text-xs font-semibold text-gray-600"
  >
    Sejarah
  </label>

  <RichTextEditor
    value={profileForm.history || ''}
    onChange={(value) =>
      setProfileForm((current) => ({
        ...current,
        history: value,
      }))
    }
    placeholder="Tulis sejarah organisasi..."
  />
</div>

                {/* VISION */}
                <div>
  <label
    htmlFor="organization-vision"
    className="mb-2 block text-xs font-semibold text-gray-600"
  >
    Visi
  </label>

  <RichTextEditor
    value={profileForm.vision || ''}
    onChange={(value) =>
      setProfileForm((current) => ({
        ...current,
        vision: value,
      }))
    }
    placeholder="Tulis visi organisasi..."
  />
</div>

                {/* MISSION */}
                <div>
  <label
    htmlFor="organization-mission"
    className="mb-2 block text-xs font-semibold text-gray-600"
  >
    Misi
  </label>

  <RichTextEditor
    value={profileForm.mission || ''}
    onChange={(value) =>
      setProfileForm((current) => ({
        ...current,
        mission: value,
      }))
    }
    placeholder="Tulis misi organisasi..."
  />
</div>

                {/* ADDRESS */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs font-semibold text-gray-600">
                    Alamat
                  </label>

                  <textarea
                    rows={3}
                    value={
                      profileForm.address ||
                      ''
                    }
                    disabled={savingProfile}
                    onChange={(event) =>
                      setProfileForm(
                        (current) => ({
                          ...current,
                          address:
                            event.target
                              .value,
                        })
                      )
                    }
                    placeholder="Alamat organisasi"
                    className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F58220]"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-600">
                    Telepon
                  </label>

                  <input
                    type="text"
                    value={
                      profileForm.phone ||
                      ''
                    }
                    disabled={savingProfile}
                    onChange={(event) =>
                      setProfileForm(
                        (current) => ({
                          ...current,
                          phone:
                            event.target
                              .value,
                        })
                      )
                    }
                    placeholder="Nomor telepon"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-600">
                    Email
                  </label>

                  <input
                    type="email"
                    value={
                      profileForm.email ||
                      ''
                    }
                    disabled={savingProfile}
                    onChange={(event) =>
                      setProfileForm(
                        (current) => ({
                          ...current,
                          email:
                            event.target
                              .value,
                        })
                      )
                    }
                    placeholder="Email organisasi"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
                  />
                </div>

                {/* WEBSITE */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-600">
                    Website
                  </label>

                  <input
                    type="url"
                    value={
                      profileForm.website ||
                      ''
                    }
                    disabled={savingProfile}
                    onChange={(event) =>
                      setProfileForm(
                        (current) => ({
                          ...current,
                          website:
                            event.target
                              .value,
                        })
                      )
                    }
                    placeholder="https://..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
                  />
                </div>

                {/* STATUS */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-600">
                    Status
                  </label>

                  <select
                    value={
                      profileForm.status
                    }
                    disabled={savingProfile}
                    onChange={(event) =>
                      setProfileForm(
                        (current) => ({
                          ...current,
                          status:
                            event.target
                              .value as
                              | 'active'
                              | 'inactive',
                        })
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
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

              <div className="flex justify-end border-t border-gray-100 px-6 py-4">
                <button
                  type="button"
                  disabled={savingProfile}
                  onClick={
                    handleProfileSubmit
                  }
                  className="rounded-xl bg-[#F58220] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#D96D0A] disabled:opacity-50"
                >
                  {savingProfile
                    ? 'Menyimpan...'
                    : profile
                      ? 'Simpan Perubahan'
                      : 'Simpan Profil'}
                </button>
              </div>
            </>
          )}

        </div>
      )}

      {/* =========================================================
          MEMBERS
      ========================================================= */}

      {activeTab === 'members' && (
        <div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Struktur Organisasi
              </h2>

              <p className="text-sm text-gray-500">
                Kelola pengurus dan struktur organisasi.
              </p>
            </div>

            <button
              type="button"
              onClick={
                openCreateMember
              }
              className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#D96D0A]"
            >
              + Tambah Pengurus
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Pengurus
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Jabatan
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Periode
                    </th>

                    <th className="px-5 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                      Urutan
                    </th>

                    <th className="px-5 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                      Aksi
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {loadingMembers ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-sm text-gray-500"
                      >
                        Memuat struktur organisasi...
                      </td>
                    </tr>
                  ) : sortedMembers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-sm text-gray-500"
                      >
                        Belum ada data pengurus.
                      </td>
                    </tr>
                  ) : (
                    sortedMembers.map(
                      (member) => (
                        <tr
                          key={member.id}
                          className="border-b border-gray-100 last:border-0"
                        >

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">

                              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                                {getOrganizationMemberPhotoUrl(
                                  member.photo
                                ) ? (
                                  <img
                                    src={
                                      getOrganizationMemberPhotoUrl(
                                        member.photo
                                      )!
                                    }
                                    alt={
                                      member.name
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-400">
                                    {member.name
                                      .charAt(
                                        0
                                      )
                                      .toUpperCase()}
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="font-semibold text-gray-900">
                                  {member.name}
                                </p>

                                {member.email && (
                                  <p className="text-xs text-gray-400">
                                    {member.email}
                                  </p>
                                )}
                              </div>

                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-700">
                            {member.position}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {member.period ||
                              '—'}
                          </td>

                          <td className="px-5 py-4 text-center text-sm text-gray-600">
                            {member.sort_order}
                          </td>

                          <td className="px-5 py-4 text-center">
                            {member.status ===
                            'active' ? (
                              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                Aktif
                              </span>
                            ) : (
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                                Nonaktif
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  openEditMember(
                                    member
                                  )
                                }
                                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#F58220] hover:text-[#F58220]"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                disabled={
                                  deletingMemberId ===
                                  member.id
                                }
                                onClick={() =>
                                  handleDeleteMember(
                                    member
                                  )
                                }
                                className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
                              >
                                {deletingMemberId ===
                                member.id
                                  ? '...'
                                  : 'Hapus'}
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

            {!loadingMembers &&
              sortedMembers.length > 0 && (
                <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
                  Total {sortedMembers.length}{' '}
                  pengurus
                </div>
              )}

          </div>
        </div>
      )}

      {/* =========================================================
          MEMBER MODAL
      ========================================================= */}

      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingMember
                    ? 'Edit Pengurus'
                    : 'Tambah Pengurus'}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Kelola informasi pengurus organisasi.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeMemberModal
                }
                disabled={savingMember}
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>

            </div>

            <div className="space-y-5 p-6">

              {/* PHOTO */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-600">
                  Foto
                </label>

                <div className="flex items-center gap-4">

                  <div className="h-24 w-24 overflow-hidden rounded-full border border-dashed border-gray-300 bg-gray-50">
                    {memberPhotoPreview ? (
                      <img
                        src={
                          memberPhotoPreview
                        }
                        alt="Preview foto"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        Belum ada foto
                      </div>
                    )}
                  </div>

                  <div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      disabled={savingMember}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#F58220]"
                      onChange={(event) => {
                        const file =
                          event.target
                            .files?.[0] ??
                          null

                        handleMemberPhotoChange(
                          file
                        )
                      }}
                    />

                    <p className="mt-2 text-xs text-gray-400">
                      JPG, PNG, WEBP, atau AVIF.
                    </p>
                  </div>

                </div>
              </div>

              {/* NAME */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-600">
                  Nama *
                </label>

                <input
                  type="text"
                  value={
                    memberForm.name
                  }
                  disabled={savingMember}
                  onChange={(event) =>
                    setMemberForm(
                      (current) => ({
                        ...current,
                        name:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="Nama pengurus"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
                />
              </div>

              {/* POSITION */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-600">
                  Jabatan *
                </label>

                <input
                  type="text"
                  value={
                    memberForm.position
                  }
                  disabled={savingMember}
                  onChange={(event) =>
                    setMemberForm(
                      (current) => ({
                        ...current,
                        position:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="Contoh: Ketua"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-600">
                  Deskripsi
                </label>

                <textarea
                  rows={4}
                  value={
                    memberForm.description ||
                    ''
                  }
                  disabled={savingMember}
                  onChange={(event) =>
                    setMemberForm(
                      (current) => ({
                        ...current,
                        description:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="Deskripsi singkat pengurus"
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F58220]"
                />
              </div>

              {/* PERIOD */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-600">
                  Periode
                </label>

                <input
                  type="text"
                  value={
                    memberForm.period ||
                    ''
                  }
                  disabled={savingMember}
                  onChange={(event) =>
                    setMemberForm(
                      (current) => ({
                        ...current,
                        period:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="Contoh: 2022-2026"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
                />
              </div>

              {/* EMAIL + PHONE */}
              <div className="grid gap-4 md:grid-cols-2">

                {/* <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-600">
                    Email
                  </label>

                  <input
                    type="email"
                    value={
                      memberForm.email ||
                      ''
                    }
                    disabled={savingMember}
                    onChange={(event) =>
                      setMemberForm(
                        (current) => ({
                          ...current,
                          email:
                            event.target
                              .value,
                        })
                      )
                    }
                    placeholder="Email pengurus"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-600">
                    Telepon
                  </label>

                  <input
                    type="text"
                    value={
                      memberForm.phone ||
                      ''
                    }
                    disabled={savingMember}
                    onChange={(event) =>
                      setMemberForm(
                        (current) => ({
                          ...current,
                          phone:
                            event.target
                              .value,
                        })
                      )
                    }
                    placeholder="Nomor telepon"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
                  />
                </div> */}

              </div>

              {/* SORT + STATUS */}
              <div className="grid gap-4 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-600">
                    Urutan
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={
                      memberForm.sort_order ??
                      0
                    }
                    disabled={savingMember}
                    onChange={(event) =>
                      setMemberForm(
                        (current) => ({
                          ...current,
                          sort_order:
                            Number(
                              event.target
                                .value
                            ),
                        })
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-600">
                    Status *
                  </label>

                  <select
                    value={
                      memberForm.status
                    }
                    disabled={savingMember}
                    onChange={(event) =>
                      setMemberForm(
                        (current) => ({
                          ...current,
                          status:
                            event.target
                              .value as
                              | 'active'
                              | 'inactive',
                        })
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
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

            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">

              <button
                type="button"
                onClick={
                  closeMemberModal
                }
                disabled={savingMember}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={
                  handleMemberSubmit
                }
                disabled={savingMember}
                className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#D96D0A] disabled:opacity-50"
              >
                {savingMember
                  ? 'Menyimpan...'
                  : editingMember
                    ? 'Simpan Perubahan'
                    : 'Tambah Pengurus'}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}