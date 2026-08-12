export default function ContentDashboard() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard Admin Konten
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Kelola dan pantau konten website LAZISMU Pemalang.
                </p>
            </div>

            {/* Ringkasan Utama */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {/* Total Berita */}
                <div className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Berita
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        24
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        Berita tersedia
                    </p>
                </div>

                {/* Total Artikel */}
                <div className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Artikel
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        18
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        Artikel tersedia
                    </p>
                </div>

                {/* Total Program */}
                <div className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Program
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        12
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        Program tersedia
                    </p>
                </div>

                {/* Campaign Aktif */}
                <div className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Campaign Aktif
                    </p>

                    <p className="mt-2 text-2xl font-bold text-green-600">
                        8
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        Sedang berjalan
                    </p>
                </div>

                {/* Laporan Keuangan */}
                <div className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Laporan Keuangan
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        3
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        Laporan tersedia
                    </p>
                </div>

                {/* Banner Aktif */}
                <div className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Banner Aktif
                    </p>

                    <p className="mt-2 text-2xl font-bold text-orange-500">
                        3
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        Banner website
                    </p>
                </div>
            </div>
            {/* Statistik Publikasi Konten */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Grafik */}
                <div className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-gray-900">
                                Publikasi Konten
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                Jumlah konten yang dipublikasikan setiap bulan
                            </p>
                        </div>

                        <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 outline-none focus:border-orange-400">
                            <option>Semua</option>
                            <option>Berita</option>
                            <option>Artikel</option>
                            <option>Program</option>
                        </select>
                    </div>

                    {/* Grafik sederhana */}
                    <div className="mt-8 flex h-56 items-end justify-between gap-3 border-b border-gray-100 px-2">
                        {[
                            { month: 'Jan', value: 8 },
                            { month: 'Feb', value: 12 },
                            { month: 'Mar', value: 10 },
                            { month: 'Apr', value: 15 },
                            { month: 'Mei', value: 13 },
                            { month: 'Jun', value: 18 },
                            { month: 'Jul', value: 16 },
                            { month: 'Agu', value: 21 },
                        ].map((item) => (
                            <div
                                key={item.month}
                                className="flex h-full flex-1 flex-col items-center justify-end"
                            >
                                <span className="mb-2 text-xs font-medium text-gray-500">
                                    {item.value}
                                </span>

                                <div
                                    className="w-full max-w-10 rounded-t-lg bg-[#F58220] transition-all hover:opacity-80"
                                    style={{
                                        height: `${(item.value / 21) * 100}%`,
                                    }}
                                />

                                <span className="mt-3 text-xs text-gray-400">
                                    {item.month}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ringkasan Status */}
                <div className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
                    <h2 className="text-base font-bold text-gray-900">
                        Status Konten
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                        Ringkasan status konten saat ini
                    </p>

                    <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="h-3 w-3 rounded-full bg-green-500" />
                                <span className="text-sm text-gray-600">
                                    Published
                                </span>
                            </div>

                            <span className="font-semibold text-gray-900">
                                42
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                                <span className="text-sm text-gray-600">
                                    Draft
                                </span>
                            </div>

                            <span className="font-semibold text-gray-900">
                                5
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="h-3 w-3 rounded-full bg-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Nonaktif
                                </span>
                            </div>

                            <span className="font-semibold text-gray-900">
                                2
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-5">
                        <p className="text-xs text-gray-400">
                            Total seluruh konten
                        </p>

                        <p className="mt-1 text-xl font-bold text-gray-900">
                            49
                        </p>
                    </div>
                </div>
            </div>
            {/* Performa Berita & Artikel */}
            <div className="overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">
                            Performa Berita & Artikel
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            Konten dengan jumlah views terbanyak
                        </p>
                    </div>

                    <select
                        className="w-fit rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 outline-none focus:border-orange-400"
                        defaultValue="terbaru"
                    >
                        <option value="terbaru">
                            Terbaru
                        </option>

                        <option value="terbanyak">
                            Views terbanyak
                        </option>

                        <option value="terendah">
                            Views terendah
                        </option>
                    </select>
                </div>

                {/* Desktop Table */}
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Konten
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Tipe
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Views
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-50">
                            {[
                                {
                                    title: 'Kegiatan Lazismu Pemalang',
                                    type: 'Berita',
                                    views: '1.240',
                                    status: 'Published',
                                },
                                {
                                    title: 'Pentingnya Zakat dalam Kehidupan',
                                    type: 'Artikel',
                                    views: '980',
                                    status: 'Published',
                                },
                                {
                                    title: 'Program Beasiswa Pendidikan',
                                    type: 'Program',
                                    views: '750',
                                    status: 'Published',
                                },
                                {
                                    title: 'Bantuan Sosial untuk Masyarakat',
                                    type: 'Berita',
                                    views: '620',
                                    status: 'Published',
                                },
                            ].map((content) => (
                                <tr
                                    key={content.title}
                                    className="transition-colors hover:bg-orange-50/40"
                                >
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-gray-900">
                                            {content.title}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                            {content.type}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 font-semibold text-gray-900">
                                        {content.views}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                            {content.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile */}
                <div className="divide-y divide-gray-50 md:hidden">
                    {[
                        {
                            title: 'Kegiatan Lazismu Pemalang',
                            type: 'Berita',
                            views: '1.240',
                            status: 'Published',
                        },
                        {
                            title: 'Pentingnya Zakat dalam Kehidupan',
                            type: 'Artikel',
                            views: '980',
                            status: 'Published',
                        },
                        {
                            title: 'Program Beasiswa Pendidikan',
                            type: 'Program',
                            views: '750',
                            status: 'Published',
                        },
                        {
                            title: 'Bantuan Sosial untuk Masyarakat',
                            type: 'Berita',
                            views: '620',
                            status: 'Published',
                        },
                    ].map((content) => (
                        <div
                            key={content.title}
                            className="space-y-2 p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <p className="text-sm font-medium text-gray-900">
                                    {content.title}
                                </p>

                                <span className="shrink-0 rounded-full bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">
                                    {content.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600">
                                    {content.type}
                                </span>

                                <span className="font-semibold text-gray-700">
                                    {content.views} views
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Konten Terbaru */}
            <div className="overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 p-5">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">
                            Konten Terbaru
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            Konten yang terakhir ditambahkan atau diperbarui
                        </p>
                    </div>

                    <button
                        type="button"
                        className="text-xs font-semibold text-[#F58220] transition-colors hover:text-orange-600 hover:underline"
                    >
                        Lihat Semua
                    </button>
                </div>

                <div className="divide-y divide-gray-50">
                    {[
                        {
                            title: 'Lazismu Pemalang Salurkan Bantuan',
                            type: 'Berita',
                            date: '10 Agustus 2026',
                            status: 'Published',
                        },
                        {
                            title: 'Pentingnya Zakat dalam Kehidupan',
                            type: 'Artikel',
                            date: '11 Agustus 2026',
                            status: 'Published',
                        },
                        {
                            title: 'Beasiswa Pendidikan',
                            type: 'Program',
                            date: '11 Agustus 2026',
                            status: 'Draft',
                        },
                        {
                            title: 'Bantuan Sosial untuk Masyarakat',
                            type: 'Berita',
                            date: '9 Agustus 2026',
                            status: 'Published',
                        },
                    ].map((content) => (
                        <div
                            key={`${content.type}-${content.title}`}
                            className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-orange-50/40 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-gray-900">
                                    {content.title}
                                </p>

                                <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                                    <span>{content.type}</span>

                                    <span>•</span>

                                    <span>{content.date}</span>
                                </div>
                            </div>

                            <span
                                className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${content.status === 'Published'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                    }`}
                            >
                                {content.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            {/* Status Konten Detail */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Draft yang Perlu Diperhatikan */}
                <div className="overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">
                    <div className="border-b border-gray-100 p-5">
                        <h2 className="text-base font-bold text-gray-900">
                            Draft yang Perlu Diperhatikan
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            Konten yang belum dipublikasikan
                        </p>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {[
                            {
                                title: 'Program Beasiswa Pendidikan',
                                type: 'Program',
                                updated: '2 jam lalu',
                            },
                            {
                                title: 'Kegiatan Sosial Lazismu',
                                type: 'Berita',
                                updated: '5 jam lalu',
                            },
                            {
                                title: 'Keutamaan Bersedekah',
                                type: 'Artikel',
                                updated: 'Kemarin',
                            },
                        ].map((content) => (
                            <div
                                key={`${content.type}-${content.title}`}
                                className="flex items-center justify-between gap-4 px-5 py-4"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-gray-900">
                                        {content.title}
                                    </p>

                                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                                        <span>{content.type}</span>

                                        <span>•</span>

                                        <span>
                                            Diperbarui {content.updated}
                                        </span>
                                    </div>
                                </div>

                                <span className="shrink-0 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                                    Draft
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ringkasan Status */}
                <div className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-bold text-gray-900">
                        Ringkasan Status
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                        Distribusi status seluruh konten
                    </p>

                    <div className="mt-6 space-y-5">
                        {/* Published */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Published
                                </span>

                                <span className="text-sm font-semibold text-gray-900">
                                    42
                                </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-full rounded-full bg-green-500"
                                    style={{
                                        width: '86%',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Draft */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Draft
                                </span>

                                <span className="text-sm font-semibold text-gray-900">
                                    5
                                </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-full rounded-full bg-yellow-400"
                                    style={{
                                        width: '10%',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Nonaktif */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Nonaktif
                                </span>

                                <span className="text-sm font-semibold text-gray-900">
                                    2
                                </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-full rounded-full bg-gray-400"
                                    style={{
                                        width: '4%',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-5">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Total Konten
                            </span>

                            <span className="text-lg font-bold text-gray-900">
                                49
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Manajemen Website */}
            <div className="rounded-xl border border-orange-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-5">
                    <h2 className="text-base font-bold text-gray-900">
                        Manajemen Website
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                        Akses cepat untuk mengelola bagian utama website
                        LAZISMU.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            title: 'Banner / Hero',
                            description: 'Kelola banner utama website',
                        },
                        {
                            title: 'Profil',
                            description: 'Kelola informasi profil LAZISMU',
                        },
                        {
                            title: 'Program',
                            description: 'Kelola program LAZISMU',
                        },
                        {
                            title: 'Berita',
                            description: 'Kelola berita website',
                        },
                        {
                            title: 'Artikel',
                            description: 'Kelola artikel edukasi',
                        },
                        {
                            title: 'Laporan Keuangan',
                            description: 'Kelola laporan keuangan',
                        },
                        {
                            title: 'Pengurus',
                            description: 'Kelola struktur pengurus',
                        },
                    ].map((item) => (
                        <button
                            key={item.title}
                            type="button"
                            className="group rounded-xl border border-gray-100 p-4 text-left transition-all hover:border-orange-200 hover:bg-orange-50/40"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {item.title}
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        {item.description}
                                    </p>
                                </div>

                                <span className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-[#F58220]">
                                    →
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}