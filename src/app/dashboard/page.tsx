import { useState } from 'react'
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

interface DashboardPageProps {
  onNavigate?: (page: NavPage) => void
}

export default function DashboardPage({
  onNavigate,
}: DashboardPageProps) {
  const [activeMenu, setActiveMenu] =
    useState('dashboard')

  const handleLogout = () => {
    onNavigate?.('home')
  }

  const renderContent = () => {
  switch (activeMenu) {
    case 'dashboard':
      return (
        <DashboardContent
          donations={donations}
          fmt={fmt}
        />
      )

    case 'donasi':
      return <DonationManagement />

    case 'campaign':
      return <CampaignManagement />

    case 'program':
      return <ProgramManagement />

    case 'berita':
      return <NewsManagement />

    case 'artikel':
      return <ArticleManagement />

    case 'publikasi':
      return <PublicationManagement />

    case 'users':
      return <UserManagement />

    case 'laporan':
      return <ReportManagement />

    case 'pengaturan':
      return <SettingsManagement />

    default:
      return (
        <DashboardContent
          donations={donations}
          fmt={fmt}
        />
      )
  }
}

  return (
    <div className="min-h-screen bg-[#FFF8F2]">

      {/* SIDEBAR */}
      <AdminSidebar
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        onLogout={handleLogout}
      />

      {/* AREA KANAN */}
      <div className="min-h-screen lg:ml-52">

        {/* HEADER + CONTENT */}
        <div className="px-4 py-6 sm:px-6 lg:px-8">

          <AdminHeader />

          <main className="mt-6 min-w-0">
            {renderContent()}
          </main>

        </div>

      </div>

    </div>
  )
}