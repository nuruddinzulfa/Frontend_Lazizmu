'use client'

import { useEffect, useState } from 'react'
import type { NavPage } from '../../App'

import AdminSidebar from '../../components/AdminSidebar'
import AdminHeader from '../../components/AdminHeader'

import DashboardContent from '../../components/admin/dashboard/DashboardContent'
import DonationManagement from '../../components/admin/donasi/DonationManagement'
import CampaignManagement from '../../components/admin/campaign/CampaignManagement'
import ProgramManagement from '../../components/admin/program/ProgramManagement'
import NewsManagement from '../../components/admin/berita/NewsManagement'
import ArticleManagement from '../../components/admin/artikel/ArticleManagement'
import PublicationManagement from '../../components/admin/publikasi/PublicationManagement'
import UserManagement from '../../components/admin/users/UserManagement'
import ReportManagement from '../../components/admin/laporan/ReportManagement'
import SettingsManagement from '../../components/admin/pengaturan/SettingsManagement'
import AboutManagement from '../../components/admin/about/AboutManagement'

interface DashboardPageProps {
  onNavigate?: (page: NavPage) => void
}

type AdminRole =
  | 'Super Admin'
  | 'Admin Konten'
  | 'Admin Donasi'

type MenuKey =
  | 'dashboard'
  | 'donasi'
  | 'campaign'
  | 'program'
  | 'berita'
  | 'artikel'
  | 'publikasi'
  |'tentang-kami'
  | 'users'
  | 'laporan'
  | 'pengaturan'

interface StoredUser {
  id: number
  name: string
  email: string
  phone?: string | null
  photo?: string | null
  status: string
  role: AdminRole
}

/*
|--------------------------------------------------------------------------
| Data sementara Dashboard
|--------------------------------------------------------------------------
|
| Nanti kalau API donation sudah selesai,
| data ini bisa dipindahkan ke donation.service.ts.
|
*/

const donations = [
  {
    id: 1,
    date: '15 Jan 2025',
    program: 'Beasiswa Pendidikan',
    amount: 500000,
    status: 'Berhasil',
  },
  {
    id: 2,
    date: '10 Jan 2025',
    program: 'Bantuan Pangan',
    amount: 200000,
    status: 'Berhasil',
  },
  {
    id: 3,
    date: '5 Jan 2025',
    program: 'Zakat Maal',
    amount: 1200000,
    status: 'Berhasil',
  },
  {
    id: 4,
    date: '28 Des 2024',
    program: 'Pembangunan Masjid',
    amount: 300000,
    status: 'Berhasil',
  },
  {
    id: 5,
    date: '20 Des 2024',
    program: 'Tanggap Bencana',
    amount: 300000,
    status: 'Pending',
  },
]

const fmt = (n: number) => {
  return 'Rp ' + n.toLocaleString('id-ID')
}

/*
|--------------------------------------------------------------------------
| Menu berdasarkan Role
|--------------------------------------------------------------------------
|
| Ini hanya untuk menentukan UI.
|
| Proteksi API tetap dilakukan oleh Laravel middleware.
|
*/

const roleMenus: Record<AdminRole, MenuKey[]> = {
  'Super Admin': [
    'dashboard',
    'donasi',
    'campaign',
    'program',
    'berita',
    'artikel',
    'publikasi',
    'tentang-kami',
    'users',
    'laporan',
    'pengaturan',
  ],

  'Admin Konten': [
    'dashboard',
    'campaign',
    'program',
    'berita',
    'artikel',
    'publikasi',
    'tentang-kami',
  ],

  'Admin Donasi': [
    'dashboard',
    'donasi',
  ],
}

export default function DashboardPage({
  onNavigate,
}: DashboardPageProps) {
  const [activeMenu, setActiveMenu] =
    useState<MenuKey>('dashboard')

  const [user, setUser] =
    useState<StoredUser | null>(null)

  const [checkingSession, setCheckingSession] =
    useState(true)

  /*
  |--------------------------------------------------------------------------
  | Restore User Session
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    try {
      const token =
        localStorage.getItem('token')

      const userStorage =
        localStorage.getItem('user')

      /*
      |--------------------------------------------------------------------------
      | Tidak ada session
      |--------------------------------------------------------------------------
      */

      if (!token || !userStorage) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        onNavigate?.('login')
        return
      }

      const parsedUser =
        JSON.parse(userStorage) as StoredUser

      /*
      |--------------------------------------------------------------------------
      | Validasi role frontend
      |--------------------------------------------------------------------------
      */

      const validRoles: AdminRole[] = [
        'Super Admin',
        'Admin Konten',
        'Admin Donasi',
      ]

      if (
        !parsedUser.role ||
        !validRoles.includes(parsedUser.role)
      ) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        onNavigate?.('login')
        return
      }

      /*
      |--------------------------------------------------------------------------
      | Session valid
      |--------------------------------------------------------------------------
      */

      setUser(parsedUser)

      setActiveMenu('dashboard')
    } catch (error) {
      console.error(
        'Gagal membaca session:',
        error
      )

      localStorage.removeItem('token')
      localStorage.removeItem('user')

      onNavigate?.('login')
    } finally {
      setCheckingSession(false)
    }
  }, [onNavigate])

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setUser(null)
    setActiveMenu('dashboard')

    onNavigate?.('home')
  }

  /*
  |--------------------------------------------------------------------------
  | Handle Menu
  |--------------------------------------------------------------------------
  */

  const handleMenuChange = (
    menu: string
  ) => {
    if (!user) {
      return
    }

    const allowedMenus =
      roleMenus[user.role]

    /*
    |--------------------------------------------------------------------------
    | Jangan izinkan frontend membuka menu
    | yang tidak dimiliki role.
    |
    | Catatan:
    | keamanan sebenarnya tetap di backend.
    |--------------------------------------------------------------------------
    */

    if (
      !allowedMenus.includes(
        menu as MenuKey
      )
    ) {
      console.warn(
        `Role ${user.role} tidak memiliki akses ke menu ${menu}`
      )

      return
    }

    setActiveMenu(menu as MenuKey)
  }

  /*
  |--------------------------------------------------------------------------
  | Render Content
  |--------------------------------------------------------------------------
  */

  const renderContent = () => {
    switch (activeMenu) {
      /*
      |--------------------------------------------------------------------------
      | Dashboard
      |--------------------------------------------------------------------------
      */

      case 'dashboard':
        return (
          <DashboardContent
            donations={donations}
            fmt={fmt}
          />
        )

      /*
      |--------------------------------------------------------------------------
      | Donasi
      |--------------------------------------------------------------------------
      */

      case 'donasi':
        return <DonationManagement />

       /*
      |--------------------------------------------------------------------------
      | About
      |--------------------------------------------------------------------------
      */

      case 'tentang-kami':
        return <AboutManagement />

      /*
      |--------------------------------------------------------------------------
      | Campaign
      |--------------------------------------------------------------------------
      */

      case 'campaign':
        return <CampaignManagement />

      /*
      |--------------------------------------------------------------------------
      | Program
      |--------------------------------------------------------------------------
      */

      case 'program':
        return <ProgramManagement />

      /*
      |--------------------------------------------------------------------------
      | Berita
      |--------------------------------------------------------------------------
      */

      case 'berita':
        return <NewsManagement />

      /*
      |--------------------------------------------------------------------------
      | Artikel
      |--------------------------------------------------------------------------
      */

      case 'artikel':
        return <ArticleManagement />

      /*
      |--------------------------------------------------------------------------
      | Publikasi
      |--------------------------------------------------------------------------
      */

      case 'publikasi':
        return <PublicationManagement />

      /*
      |--------------------------------------------------------------------------
      | User
      |--------------------------------------------------------------------------
      */

      case 'users':
        return <UserManagement />

      /*
      |--------------------------------------------------------------------------
      | Laporan
      |--------------------------------------------------------------------------
      */

      case 'laporan':
        return <ReportManagement />

      /*
      |--------------------------------------------------------------------------
      | Pengaturan
      |--------------------------------------------------------------------------
      */

      case 'pengaturan':
        return <SettingsManagement />

      /*
      |--------------------------------------------------------------------------
      | Fallback
      |--------------------------------------------------------------------------
      */

      default:
        return (
          <DashboardContent
            donations={donations}
            fmt={fmt}
          />
        )
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Loading Session
  |--------------------------------------------------------------------------
  */

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-[#F58220]" />

          <p className="text-sm text-gray-500">
            Memeriksa sesi...
          </p>
        </div>
      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | User tidak ada
  |--------------------------------------------------------------------------
  */

  if (!user) {
    return null
  }

  /*
  |--------------------------------------------------------------------------
  | Dashboard
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-[#FFF8F2]">

      {/* ================================================================
          SIDEBAR
      ================================================================= */}

      <AdminSidebar
        activeMenu={activeMenu}
        onMenuChange={handleMenuChange}
        onLogout={handleLogout}
      />

      {/* ================================================================
          AREA KANAN
      ================================================================= */}

      <div className="min-h-screen lg:ml-52">

        {/* ==============================================================
            HEADER
        =============================================================== */}

        <div className="px-4 py-6 sm:px-6 lg:px-8">

          <AdminHeader />

          {/* ============================================================
              CONTENT
          ============================================================= */}

          <main className="mt-6 min-w-0">
            {renderContent()}
          </main>

        </div>

      </div>

    </div>
  )
}