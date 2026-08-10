'use client';

import React from 'react';

interface SidebarMenuProps {
    activeMenu: string;
    onMenuChange: (menu: string) => void;
}

interface MenuItem {
    key: string;
    label: string;
    section: 'Utama' | 'Manajemen' | 'Sistem';
    icon: string;
}

const menuItems: MenuItem[] = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        section: 'Utama',
        icon:
            'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
        key: 'donasi',
        label: 'Donasi & Transaksi',
        section: 'Manajemen',
        icon:
            'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
        key: 'campaign',
        label: 'Campaign',
        section: 'Manajemen',
        icon:
            'M11 5.882V19.24a1.76 1.76 0 01-3.417.592L6.5 15H4a2 2 0 01-2-2v-2a2 2 0 012-2h2.5l1.083-4.832A1.76 1.76 0 0111 5.882z',
    },
    {
        key: 'program',
        label: 'Program',
        section: 'Manajemen',
        icon:
            'M4 6h16M4 10h16M4 14h16M4 18h10',
    },
    {
        key: 'berita',
        label: 'Berita',
        section: 'Manajemen',
        icon:
            'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2zM7 8h10M7 12h10M7 16h6',
    },
    {
        key: 'artikel',
        label: 'Artikel',
        section: 'Manajemen',
        icon:
            'M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM8 7h8M8 11h8M8 15h5',
    },
    {
        key: 'publikasi',
        label: 'Publikasi',
        section: 'Manajemen',
        icon:
            'M6 2h9l5 5v15H6a2 2 0 01-2-2V4a2 2 0 012-2zM14 2v6h6M8 12h8M8 16h8',
    },
    {
        key: 'users',
        label: 'Pengguna & Admin',
        section: 'Sistem',
        icon:
            'M17 20h5v-2a4 4 0 00-4-4h-1M9 20H2v-2a4 4 0 014-4h3m5-8a4 4 0 11-8 0 4 4 0 018 0zm6 2a3 3 0 11-6 0',
    },
    {
        key: 'laporan',
        label: 'Laporan',
        section: 'Sistem',
        icon:
            'M3 3v18h18M7 16v-5M12 16V7M17 16v-8',
    },
    {
        key: 'pengaturan',
        label: 'Pengaturan',
        section: 'Sistem',
        icon:
            'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.827 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.065 2.573c.94 1.543-.827 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.065c-1.543.94-.827-3.31-2.37-2.37a1.724 1.724 0 00-1.065-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.065-2.572c-.94-1.543.827-3.31 2.37-2.37a1.724 1.724 0 002.573-1.066z',
    },
];

const sections: MenuItem['section'][] = [
    'Utama',
    'Manajemen',
    'Sistem',
];

export default function SidebarMenu({
    activeMenu,
    onMenuChange,
}: SidebarMenuProps) {
    return (
        <nav className="space-y-5">
            {sections.map((section) => {
                const items = menuItems.filter(
                    (item) => item.section === section
                );

                return (
                    <div key={section}>
                        <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                            {section}
                        </div>

                        <div className="space-y-1">
                            {items.map((item) => {
                                const isActive = activeMenu === item.key;

                                return (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => onMenuChange(item.key)}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${isActive
                                                ? 'bg-[#F58220] text-white shadow-sm'
                                                : 'text-gray-600 hover:bg-orange-50 hover:text-[#F58220]'
                                            }`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            className="h-[18px] w-[18px] shrink-0"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d={item.icon}
                                            />
                                        </svg>

                                        <span className="truncate">
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </nav>
    );
}