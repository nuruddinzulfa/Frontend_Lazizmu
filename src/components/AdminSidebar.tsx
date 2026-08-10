'use client';

import React from 'react';
import logo from '../imports/3-2.png';
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
    <aside
      className="
        fixed
        left-0
        top-0
        z-40
        flex
        h-screen
        w-52
        flex-col
        border-r
        border-orange-100
        bg-white
      "
    >
 {/* Logo */}
<div className="flex h-[72px] items-center px-4 border-b border-orange-100">
    <img
        src={logo}
        alt="LAZISMU Kabupaten Pemalang"
        className="h-16 w-auto object-contain"
    />
</div>

      {/* User */}
      <div className="shrink-0">
        <SidebarUser />
      </div>

      {/* Menu */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-4">
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