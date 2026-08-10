'use client'

import { useState } from 'react'

interface Campaign {
    id: number
    title: string
    program: string
    target: number
    collected: number
    donors: number
    urgent: boolean
    status: 'Aktif' | 'Selesai' | 'Draft'
}

const initialCampaigns: Campaign[] = [
    {
        id: 1,
        title: 'Beasiswa Pendidikan',
        program: 'Pendidikan',
        target: 100000000,
        collected: 78500000,
        donors: 284,
        urgent: true,
        status: 'Aktif',
    },
    {
        id: 2,
        title: 'Bantuan Pangan Ramadhan',
        program: 'Sosial',
        target: 50000000,
        collected: 32500000,
        donors: 156,
        urgent: false,
        status: 'Aktif',
    },
    {
        id: 3,
        title: 'Pembangunan Masjid',
        program: 'Dakwah',
        target: 75000000,
        collected: 75000000,
        donors: 198,
        urgent: false,
        status: 'Selesai',
    },
    {
        id: 4,
        title: 'Tanggap Bencana',
        program: 'Kemanusiaan',
        target: 100000000,
        collected: 15000000,
        donors: 72,
        urgent: false,
        status: 'Draft',
    },
]

const fmt = (n: number) => {
    return 'Rp ' + n.toLocaleString('id-ID')
}

export default function CampaignManagement() {
    const [campaigns, setCampaigns] =
        useState<Campaign[]>(initialCampaigns)

    const [search, setSearch] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)

    const [newCampaign, setNewCampaign] = useState({
        title: '',
        program: '',
        target: '',
        urgent: false,
        status: 'Draft' as Campaign['status'],
    })
    const [campaignFilter, setCampaignFilter] =
        useState<'all' | 'urgent'>('all')

    const filteredCampaigns = campaigns.filter((campaign) => {
        const matchesSearch = campaign.title
            .toLowerCase()
            .includes(search.toLowerCase())

        const matchesFilter =
            campaignFilter === 'all' || campaign.urgent

        return matchesSearch && matchesFilter
    })

    const handleDelete = (id: number) => {
        const confirmed = window.confirm(
            'Apakah Anda yakin ingin menghapus campaign ini?'
        )

        if (!confirmed) return

        setCampaigns((current) =>
            current.filter((campaign) => campaign.id !== id)
        )
    }
    const handleAddCampaign = () => {
        if (
            !newCampaign.title.trim() ||
            !newCampaign.program.trim() ||
            !newCampaign.target
        ) {
            alert('Judul, program, dan target campaign wajib diisi.')
            return
        }

        const campaign: Campaign = {
            id:
                campaigns.length > 0
                    ? Math.max(...campaigns.map((item) => item.id)) + 1
                    : 1,
            title: newCampaign.title.trim(),
            program: newCampaign.program.trim(),
            target: Number(newCampaign.target),
            collected: 0,
            donors: 0,
            urgent: newCampaign.urgent,
            status: newCampaign.status,
        }

        setCampaigns((current) => [campaign, ...current])

        setNewCampaign({
            title: '',
            program: '',
            target: '',
            urgent: false,
            status: 'Draft',
        })

        setShowAddForm(false)
    }
    const activeCampaigns = campaigns.filter(
        (campaign) => campaign.status === 'Aktif'
    ).length

    const completedCampaigns = campaigns.filter(
        (campaign) => campaign.status === 'Selesai'
    ).length

    const totalCollected = campaigns.reduce(
        (total, campaign) => total + campaign.collected,
        0
    )

    const urgentCampaigns = campaigns.filter(
        (campaign) => campaign.urgent && campaign.status === 'Aktif'
    )

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1
                        className="text-lg font-bold text-gray-900"
                        style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                    >
                        Campaign
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Kelola campaign penggalangan dana LAZISMU.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                    + Tambah Campaign
                </button>
            </div>

            {/* Tambah Campaign */}
            {showAddForm && (
                <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2
                                className="font-bold text-gray-900"
                                style={{
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                }}
                            >
                                Tambah Campaign
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                Tambahkan campaign baru untuk LAZISMU.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="text-sm text-gray-400 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Judul */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                                Nama Campaign
                            </label>

                            <input
                                type="text"
                                value={newCampaign.title}
                                onChange={(e) =>
                                    setNewCampaign({
                                        ...newCampaign,
                                        title: e.target.value,
                                    })
                                }
                                placeholder="Contoh: Bantuan Pendidikan"
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
                            />
                        </div>

                        {/* Program */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                                Program
                            </label>

                            <input
                                type="text"
                                value={newCampaign.program}
                                onChange={(e) =>
                                    setNewCampaign({
                                        ...newCampaign,
                                        program: e.target.value,
                                    })
                                }
                                placeholder="Contoh: Pendidikan"
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
                            />
                        </div>

                        {/* Target */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                                Target Dana
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={newCampaign.target}
                                onChange={(e) =>
                                    setNewCampaign({
                                        ...newCampaign,
                                        target: e.target.value,
                                    })
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
                                value={newCampaign.status}
                                onChange={(e) =>
                                    setNewCampaign({
                                        ...newCampaign,
                                        status: e.target.value as Campaign['status'],
                                    })
                                }
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F58220]"
                            >
                                <option value="Draft">Draft</option>
                                <option value="Aktif">Aktif</option>
                                <option value="Selesai">Selesai</option>
                            </select>
                        </div>
                    </div>

                    {/* Urgent */}
                    <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                        <input
                            type="checkbox"
                            checked={newCampaign.urgent}
                            onChange={(e) =>
                                setNewCampaign({
                                    ...newCampaign,
                                    urgent: e.target.checked,
                                })
                            }
                            className="h-4 w-4 accent-[#F58220]"
                        />

                        Tandai sebagai campaign urgent 🔥
                    </label>

                    {/* Actions */}
                    <div className="mt-5 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                        >
                            Batal
                        </button>

                        <button
                            type="button"
                            onClick={handleAddCampaign}
                            className="rounded-xl bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                        >
                            Simpan Campaign
                        </button>
                    </div>
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
                    <p className="text-xs text-gray-500">
                        Total Campaign
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-900">
                        {campaigns.length}
                    </p>
                </div>

                <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
                    <p className="text-xs text-gray-500">
                        Campaign Aktif
                    </p>

                    <p className="mt-1 text-xl font-bold text-green-600">
                        {activeCampaigns}
                    </p>
                </div>

                <div className="rounded-2xl border border-[#F3DEC8] bg-white p-4 shadow-sm">
                    <p className="text-xs text-gray-500">
                        Campaign Selesai
                    </p>

                    <p className="mt-1 text-xl font-bold text-blue-600">
                        {completedCampaigns}
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

            {/* Campaign Urgent */}
            {urgentCampaigns.length > 0 && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2
                                className="font-bold text-red-700"
                                style={{
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                }}
                            >
                                🔥 Campaign Urgent
                            </h2>

                            <p className="mt-1 text-xs text-red-500">
                                Campaign yang membutuhkan perhatian dan dukungan segera.
                            </p>
                        </div>

                        <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                            {urgentCampaigns.length} Urgent
                        </span>
                    </div>

                    <div className="space-y-3">
                        {urgentCampaigns.map((campaign) => {
                            const percentage = Math.min(
                                Math.round(
                                    (campaign.collected / campaign.target) * 100
                                ),
                                100
                            )

                            return (
                                <div
                                    key={campaign.id}
                                    className="rounded-xl border border-red-100 bg-white p-4"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900">
                                                    {campaign.title}
                                                </h3>

                                                <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-600">
                                                    URGENT
                                                </span>
                                            </div>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Program: {campaign.program}
                                            </p>

                                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className="h-full rounded-full bg-red-500"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>

                                            <div className="mt-2 flex justify-between text-xs">
                                                <span className="font-semibold text-gray-700">
                                                    {fmt(campaign.collected)}
                                                </span>

                                                <span className="text-gray-400">
                                                    dari {fmt(campaign.target)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 lg:shrink-0">
                                            <div className="text-right">
                                                <div className="text-xs text-gray-400">
                                                    Donatur
                                                </div>

                                                <div className="font-semibold text-gray-900">
                                                    {campaign.donors}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                className="rounded-xl bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
                                            >
                                                Lihat Detail
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
                <label className="mb-2 block text-xs font-medium text-gray-600">
                    Cari Campaign
                </label>

                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari berdasarkan nama campaign..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
                />
            </div>

            {/* Campaign Filter */}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setCampaignFilter('all')}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${campaignFilter === 'all'
                            ? 'bg-[#F58220] text-white'
                            : 'border border-[#F3DEC8] bg-white text-gray-600 hover:bg-orange-50'
                        }`}
                >
                    Semua Campaign
                </button>

                <button
                    type="button"
                    onClick={() => setCampaignFilter('urgent')}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${campaignFilter === 'urgent'
                            ? 'bg-red-500 text-white'
                            : 'border border-red-100 bg-white text-red-500 hover:bg-red-50'
                        }`}
                >
                    🔥 Urgent
                </button>
            </div>

            {/* Campaign List */}
            <div className="overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm">
                <div className="border-b border-gray-100 p-5">
                    <h2
                        className="font-bold text-gray-900"
                        style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                    >
                        Daftar Campaign
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                        Menampilkan {filteredCampaigns.length} campaign.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Campaign
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Program
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Target
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Terkumpul
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Donatur
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
                            {filteredCampaigns.map((campaign) => {
                                const percentage = Math.min(
                                    Math.round(
                                        (campaign.collected / campaign.target) * 100
                                    ),
                                    100
                                )

                                return (
                                    <tr
                                        key={campaign.id}
                                        className="transition-colors hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-900">
                                                {campaign.title}
                                            </div>

                                            <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className="h-full rounded-full bg-[#F58220]"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>

                                            <div className="mt-1 text-[11px] text-gray-400">
                                                {percentage}% tercapai
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {campaign.program}
                                        </td>

                                        <td className="px-5 py-4 font-medium text-gray-700">
                                            {fmt(campaign.target)}
                                        </td>

                                        <td className="px-5 py-4 font-semibold text-[#F58220]">
                                            {fmt(campaign.collected)}
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {campaign.donors}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${campaign.status === 'Aktif'
                                                        ? 'bg-green-100 text-green-700'
                                                        : campaign.status === 'Selesai'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                {campaign.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    className="text-xs font-medium text-[#F58220] hover:underline"
                                                >
                                                    Detail
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(campaign.id)
                                                    }
                                                    className="text-xs font-medium text-red-500 hover:underline"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}