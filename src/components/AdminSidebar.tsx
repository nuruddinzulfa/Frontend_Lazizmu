'use client';

import React from 'react';
import SidebarUser from './SidebarUser';
import SidebarMenu from './SidebarMenu';
import SidebarFooter from './SidebarFooter';

interface AdminSidebarProps {
    activeMenu: string;
    onMenuChange: (menu: string) => void;
    onLogout: () => void;
}

export default function AdminSidebar({
    activeMenu,
    onMenuChange,
    onLogout,
}: AdminSidebarProps) {
    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-orange-100 bg-white">
            {/* Logo */}
            <div className="flex h-20 shrink-0 items-center border-b border-orange-100 px-6">
                <div>
                    <div
                        className="text-xl font-bold text-[#F58220]"
                        style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                    >
                        lazismu
                    </div>

                    <div className="text-xs text-gray-500">
                        Kabupaten Pemalang
                    </div>
                </div>
            </div>

            {/* User */}
            <SidebarUser />

            {/* Menu */}
            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
                <SidebarMenu
                    activeMenu={activeMenu}
                    onMenuChange={onMenuChange}
                />
            </div>

            {/* Footer */}
            <div className="shrink-0">
                <SidebarFooter onLogout={onLogout} />
            </div>
        </aside>
    );
}