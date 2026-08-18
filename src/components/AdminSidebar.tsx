'use client'

import React from 'react'
import logo from '../imports/3-2.png'

import SidebarUser from './SidebarUser'
import SidebarMenu from './SidebarMenu'
import SidebarFooter from './SidebarFooter'

interface AdminSidebarProps {
  activeMenu: string
  onMenuChange: (menu: string) => void
  onLogout: () => void
}

type AdminRole =
  | 'Super Admin'
  | 'Admin Konten'
  | 'Admin Donasi'

const roleMenus: Record<AdminRole, string[]> = {
  'Super Admin': [
    'dashboard',
    'donasi',
    'campaign',
    'program',
    'berita',
    'artikel',
    'banner',
    'publikasi',
    'tentang-kami',
    'users',
    'pengaturan',
  ],

  'Admin Konten': [
    'dashboard',
    'campaign',
    'program',
    'berita',
    'artikel',
    'banner',
    'publikasi',
    'tentang-kami',
  ],

  'Admin Donasi': [
    'dashboard',
    'donasi',
  ],
}

export default function AdminSidebar({
  activeMenu,
  onMenuChange,
  onLogout,
}: AdminSidebarProps) {
  /*
  |--------------------------------------------------------------------------
  | Ambil user dari localStorage
  |--------------------------------------------------------------------------
  */

  let user: any = null

  try {
    const userStorage =
      localStorage.getItem('user')

    if (userStorage) {
      user = JSON.parse(userStorage)
    }
  } catch (error) {
    console.error(
      'Gagal membaca data user:',
      error
    )
  }

  const role =
    user?.role as AdminRole | undefined

  /*
  |--------------------------------------------------------------------------
  | Tentukan menu berdasarkan role
  |--------------------------------------------------------------------------
  */

  const allowedMenus =
    role && roleMenus[role]
      ? roleMenus[role]
      : ['dashboard']

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
        border-[#F3DEC8]
        bg-white
      "
    >
      {/* LOGO */}
      <div className="flex h-[62px] items-center justify-center border-b border-[#F3DEC8] px-4">
        <img
          src={logo}
          alt="LAZISMU Kabupaten Pemalang"
          className="h-11 w-auto object-contain"
        />
      </div>

      {/* USER */}
      <SidebarUser
        name={user?.name ?? 'Administrator'}
        role={role ?? 'Administrator'}
        photo={user?.photo ?? null}
      />

      {/* MENU */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <SidebarMenu
          activeMenu={activeMenu}
          onMenuChange={onMenuChange}
          allowedMenus={allowedMenus}
        />
      </div>

      {/* FOOTER */}
      <SidebarFooter
        onLogout={onLogout}
      />
    </aside>
  )
}