import { useState } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import FloatingElements from './components/ui/FloatingElements'
import ZakatCalculator from './components/donation/ZakatCalculator'
import DonationForm from './app/donasi/page'
import HomePage from './app/page'
import AboutPage from './app/about/page'
import ProgramPage from './app/program/page'
import BeritaPage from './app/berita/page'
import ArtikelPage from './app/artikel/page'
import PublikasiPage from './app/publikasi/page'
import LoginPage from './app/login/page'
import RegisterPage from './app/register/page'
import DashboardPage from './app/dashboard/page'
import BacaPage from './app/baca/page'

export type NavPage = 'home' | 'zakat' | 'donasi' | 'about' | 'program' | 'berita' | 'artikel' | 'publikasi' | 'login' | 'register' | 'dashboard' | 'baca'

export default function App() {
  const [page, setPage] = useState<NavPage>('home')
  const [zakatAmount, setZakatAmount] = useState<number | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)
  const [currentContent, setCurrentContent] = useState<{ type: 'berita' | 'artikel'; id: number } | null>(null)

  const handleNavigate = (p: NavPage) => {
    if (p !== 'donasi') {
      setZakatAmount(null)
      setSelectedProgram(null)
    }
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePayZakat = (amount: number) => {
    setZakatAmount(amount)
    setPage('donasi')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateToDonasiWithProgram = (program: string) => {
    setSelectedProgram(program)
    setZakatAmount(null)
    setPage('donasi')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenContent = (type: 'berita' | 'artikel', id: number) => {
    setCurrentContent({ type, id })
    setPage('baca')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const noFooterPages: NavPage[] = ['login', 'register']
  const showFooter = !noFooterPages.includes(page)

  const renderPage = () => {
    switch (page) {
      case 'zakat':
        return <ZakatCalculator onPayZakat={handlePayZakat} />
      case 'donasi':
        return <DonationForm initialZakatAmount={zakatAmount ?? undefined} initialProgram={selectedProgram ?? undefined} />
      case 'about':
        return <AboutPage />
      case 'program':
        return <ProgramPage onNavigate={handleNavigate} onDonateProgram={handleNavigateToDonasiWithProgram} />
      case 'berita':
        return <BeritaPage onNavigate={handleNavigate} onOpenContent={handleOpenContent} />
      case 'artikel':
        return <ArtikelPage onNavigate={handleNavigate} onOpenContent={handleOpenContent} />
      case 'publikasi':
        return <PublikasiPage />
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />
      case 'baca':
        return <BacaPage content={currentContent} onNavigate={handleNavigate} />
      default:
        return <HomePage onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F2', fontFamily: "'Inter', sans-serif" }}>
      <Navbar currentPage={page} onNavigate={handleNavigate} />

      {renderPage()}

      {showFooter && <Footer onNavigate={handleNavigate} />}

      <FloatingElements />
    </div>
  )
}
