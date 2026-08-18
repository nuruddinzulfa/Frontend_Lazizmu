import { useEffect, useState } from 'react'

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

/*
|--------------------------------------------------------------------------
| PROGRAM / PILAR
|--------------------------------------------------------------------------
*/

import PillarDetail from './components/program/PillarDetail'

/*
|--------------------------------------------------------------------------
| CAMPAIGN
|--------------------------------------------------------------------------
*/

import CampaignPage from './app/campaign/page'
import CampaignDetail from './components/campaign/CampaignDetail'

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/

import { getProfile } from './service/auth.service'

/*
|--------------------------------------------------------------------------
| NAV PAGE
|--------------------------------------------------------------------------
*/

export type NavPage =
  | 'home'
  | 'zakat'
  | 'donasi'
  | 'about'
  | 'program'
  | 'pilar-detail'
  | 'campaign'
  | 'campaign-detail'
  | 'berita'
  | 'artikel'
  | 'publikasi'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'baca'

/*
|--------------------------------------------------------------------------
| APP
|--------------------------------------------------------------------------
*/

export default function App() {
  /*
  |--------------------------------------------------------------------------
  | PAGE STATE
  |--------------------------------------------------------------------------
  */

  const [page, setPage] =
    useState<NavPage>('home')

  const [authLoading, setAuthLoading] =
    useState(true)

  /*
  |--------------------------------------------------------------------------
  | DONATION STATE
  |--------------------------------------------------------------------------
  */

  const [zakatAmount, setZakatAmount] =
    useState<number | null>(null)

  const [selectedProgram, setSelectedProgram] =
    useState<string | null>(null)

  /*
  |--------------------------------------------------------------------------
  | NEWS / ARTICLE STATE
  |--------------------------------------------------------------------------
  */

  const [currentContent, setCurrentContent] =
    useState<{
      type: 'berita' | 'artikel'
      id: number
    } | null>(null)

  /*
  |--------------------------------------------------------------------------
  | PILAR STATE
  |--------------------------------------------------------------------------
  */

  const [currentPillar, setCurrentPillar] =
    useState<string | null>(null)

  /*
  |--------------------------------------------------------------------------
  | CAMPAIGN STATE
  |--------------------------------------------------------------------------
  */

  const [currentCampaignId, setCurrentCampaignId] =
    useState<number | null>(null)

  /*
  |--------------------------------------------------------------------------
  | PATH
  |--------------------------------------------------------------------------
  */

  const getPathForPage = (
    p: NavPage
  ): string => {
    switch (p) {
      case 'home':
        return '/'

      case 'zakat':
        return '/zakat'

      case 'donasi':
        return '/donasi'

      case 'about':
        return '/about'

      case 'program':
        return '/program'

      case 'campaign':
        return '/campaign'

      case 'berita':
        return '/berita'

      case 'artikel':
        return '/artikel'

      case 'publikasi':
        return '/publikasi'

      case 'login':
        return '/login'

      case 'register':
        return '/register'

      case 'dashboard':
        return '/dashboard'

      default:
        return '/'
    }
  }
  /*
  |--------------------------------------------------------------------------
  | GENERAL NAVIGATION
  |--------------------------------------------------------------------------
  */

  const handleNavigate = (
    p: NavPage
  ) => {
    console.log(
      '[DEBUG App] Navigate:',
      p
    )

    /*
    |--------------------------------------------------------------------------
    | Reset donation state
    |--------------------------------------------------------------------------
    */

    if (p !== 'donasi') {
      setZakatAmount(null)
      setSelectedProgram(null)
    }

    /*
    |--------------------------------------------------------------------------
    | Reset article / news state
    |--------------------------------------------------------------------------
    */

    setCurrentContent(null)

    /*
    |--------------------------------------------------------------------------
    | Reset pillar state
    |--------------------------------------------------------------------------
    */

    if (p !== 'pilar-detail') {
      setCurrentPillar(null)
    }

    /*
    |--------------------------------------------------------------------------
    | Reset campaign state
    |--------------------------------------------------------------------------
    */

    if (
      p !== 'campaign' &&
      p !== 'campaign-detail'
    ) {
      setCurrentCampaignId(null)
    }

    /*
    |--------------------------------------------------------------------------
    | Set page
    |--------------------------------------------------------------------------
    */

    setPage(p)

    /*
    |--------------------------------------------------------------------------
    | Browser history
    |--------------------------------------------------------------------------
    */

    window.history.pushState(
      {
        page: p,
      },
      '',
      getPathForPage(p)
    )

    /*
    |--------------------------------------------------------------------------
    | Scroll top
    |--------------------------------------------------------------------------
    */

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
  |--------------------------------------------------------------------------
  | OPEN PILAR
  |--------------------------------------------------------------------------
  */

  const handleOpenPillar = (
    category: string
  ) => {
    console.log(
      '[DEBUG App] Membuka pilar:',
      category
    )

    /*
    |--------------------------------------------------------------------------
    | Set state
    |--------------------------------------------------------------------------
    */

    setCurrentPillar(category)

    setCurrentCampaignId(null)

    setCurrentContent(null)

    setZakatAmount(null)

    setSelectedProgram(null)

    setPage('pilar-detail')

    /*
    |--------------------------------------------------------------------------
    | Buat slug URL
    |--------------------------------------------------------------------------
    */

    const slug = category
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')

    /*
    |--------------------------------------------------------------------------
    | Browser history
    |--------------------------------------------------------------------------
    */

    window.history.pushState(
      {
        page: 'pilar-detail',
        category,
      },
      '',
      `/program/${slug}`
    )

    /*
    |--------------------------------------------------------------------------
    | Scroll
    |--------------------------------------------------------------------------
    */

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  /*
  |--------------------------------------------------------------------------
  | PAY ZAKAT
  |--------------------------------------------------------------------------
  */

  const handlePayZakat = (
    amount: number
  ) => {
    setZakatAmount(amount)

    setCurrentContent(null)

    setCurrentPillar(null)

    setCurrentCampaignId(null)

    setSelectedProgram(null)

    setPage('donasi')

    window.history.pushState(
      {
        page: 'donasi',
      },
      '',
      '/donasi'
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  /*
  |--------------------------------------------------------------------------
  | PROGRAM -> DONASI
  |--------------------------------------------------------------------------
  */

  const handleNavigateToDonasiWithProgram = (
    program: string
  ) => {
    console.log(
      '[DEBUG App] Donasi program:',
      program
    )

    setSelectedProgram(program)

    setZakatAmount(null)

    setCurrentContent(null)

    setCurrentPillar(null)

    setCurrentCampaignId(null)

    setPage('donasi')

    window.history.pushState(
      {
        page: 'donasi',
        program,
      },
      '',
      '/donasi'
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  /*
  |--------------------------------------------------------------------------
  | OPEN NEWS / ARTICLE
  |--------------------------------------------------------------------------
  */

  const handleOpenContent = (
    type: 'berita' | 'artikel',
    id: number
  ) => {
    console.log(
      '[DEBUG App] Membuka content:',
      type,
      id
    )

    const content = {
      type,
      id,
    }

    setCurrentContent(content)

    setCurrentPillar(null)

    setCurrentCampaignId(null)

    setZakatAmount(null)

    setSelectedProgram(null)

    setPage('baca')

    window.history.pushState(
      {
        page: 'baca',
        content,
      },
      '',
      `/${type}/${id}`
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  /*
  |--------------------------------------------------------------------------
  | OPEN CAMPAIGN
  |--------------------------------------------------------------------------
  */

  const handleOpenCampaign = (
    id: number
  ) => {
    console.log(
      '[DEBUG App] Membuka campaign:',
      id
    )

    /*
    |--------------------------------------------------------------------------
    | Set campaign
    |--------------------------------------------------------------------------
    */

    setCurrentCampaignId(id)

    /*
    |--------------------------------------------------------------------------
    | Campaign detail bukan pillar detail lagi
    |--------------------------------------------------------------------------
    */

    setCurrentPillar(null)

    setCurrentContent(null)

    setZakatAmount(null)

    setSelectedProgram(null)

    setPage('campaign-detail')

    /*
    |--------------------------------------------------------------------------
    | Browser history
    |--------------------------------------------------------------------------
    */

    window.history.pushState(
      {
        page: 'campaign-detail',
        campaignId: id,
      },
      '',
      `/campaign/${id}`
    )

    /*
    |--------------------------------------------------------------------------
    | Scroll
    |--------------------------------------------------------------------------
    */

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  /*
  |--------------------------------------------------------------------------
  | RESTORE AUTH SESSION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const restoreSession = async () => {
      const token =
        localStorage.getItem('token')

      /*
      |--------------------------------------------------------------------------
      | Tidak ada token
      |--------------------------------------------------------------------------
      */

      if (!token) {
        setAuthLoading(false)
        return
      }

      try {
        const user =
          await getProfile()

        localStorage.setItem(
          'user',
          JSON.stringify(user)
        )

        /*
        |--------------------------------------------------------------------------
        | Role admin yang diperbolehkan
        |--------------------------------------------------------------------------
        */

        const allowedRoles = [
          'Super Admin',
          'Admin Donasi',
          'Admin Konten',
        ]

        /*
        |--------------------------------------------------------------------------
        | Role tidak valid
        |--------------------------------------------------------------------------
        */

        if (
          !allowedRoles.includes(
            user.role
          )
        ) {
          localStorage.removeItem(
            'token'
          )

          localStorage.removeItem(
            'user'
          )

          sessionStorage.removeItem(
            'adminDashboard'
          )

          setPage('login')

          return
        }

        /*
        |--------------------------------------------------------------------------
        | Restore dashboard
        |--------------------------------------------------------------------------
        */

        const shouldOpenDashboard =
          sessionStorage.getItem(
            'adminDashboard'
          ) === 'true'

        if (shouldOpenDashboard) {
          setPage('dashboard')
        }
      } catch (error) {
        console.error(
          'Session tidak valid:',
          error
        )

        localStorage.removeItem(
          'token'
        )

        localStorage.removeItem(
          'user'
        )

        sessionStorage.removeItem(
          'adminDashboard'
        )

        setPage('login')
      } finally {
        setAuthLoading(false)
      }
    }

    restoreSession()
  }, [])

  /*
  |--------------------------------------------------------------------------
  | BROWSER BACK / FORWARD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handlePopState = (
      event: PopStateEvent
    ) => {
      const state =
        event.state

      console.log(
        '[DEBUG App] PopState:',
        state
      )

      /*
      |--------------------------------------------------------------------------
      | Tidak ada state
      |--------------------------------------------------------------------------
      */

      if (!state?.page) {
        setPage('home')

        setCurrentContent(null)

        setCurrentPillar(null)

        setCurrentCampaignId(null)

        setZakatAmount(null)

        setSelectedProgram(null)

        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })

        return
      }

      /*
      |--------------------------------------------------------------------------
      | PAGE
      |--------------------------------------------------------------------------
      */

      setPage(
        state.page as NavPage
      )

      /*
      |--------------------------------------------------------------------------
      | NEWS / ARTICLE
      |--------------------------------------------------------------------------
      */

      if (
        state.page === 'baca' &&
        state.content
      ) {
        setCurrentContent(
          state.content
        )
      } else {
        setCurrentContent(null)
      }

      /*
      |--------------------------------------------------------------------------
      | PILAR
      |--------------------------------------------------------------------------
      */

      if (
        state.page === 'pilar-detail'
      ) {
        setCurrentPillar(
          state.category ?? null
        )
      } else {
        setCurrentPillar(null)
      }

      /*
      |--------------------------------------------------------------------------
      | CAMPAIGN
      |--------------------------------------------------------------------------
      */

      if (
        state.page ===
        'campaign-detail'
      ) {
        const campaignId =
          Number(
            state.campaignId
          )

        setCurrentCampaignId(
          Number.isNaN(
            campaignId
          )
            ? null
            : campaignId
        )
      } else {
        setCurrentCampaignId(null)
      }

      /*
      |--------------------------------------------------------------------------
      | DONATION
      |--------------------------------------------------------------------------
      */

      if (
        state.page !== 'donasi'
      ) {
        setZakatAmount(null)
        setSelectedProgram(null)
      }

      /*
      |--------------------------------------------------------------------------
      | Scroll
      |--------------------------------------------------------------------------
      */

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }

    window.addEventListener(
      'popstate',
      handlePopState
    )

    return () => {
      window.removeEventListener(
        'popstate',
        handlePopState
      )
    }
  }, [])

  /*
  |--------------------------------------------------------------------------
  | INITIAL HISTORY
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    /*
    |--------------------------------------------------------------------------
    | Jangan menimpa history jika sudah ada
    |--------------------------------------------------------------------------
    */

    if (!window.history.state) {
      window.history.replaceState(
        {
          page: 'home',
        },
        '',
        '/'
      )
    }
  }, [])

  /*
  |--------------------------------------------------------------------------
  | FOOTER
  |--------------------------------------------------------------------------
  */

  const noFooterPages: NavPage[] = [
    "login",
    "dashboard",
  ];

  const showFooter =
    !noFooterPages.includes(
      page
    )

  /*
  |--------------------------------------------------------------------------
  | RENDER PAGE
  |--------------------------------------------------------------------------
  */

  const renderPage = () => {
    switch (page) {
      /*
      |--------------------------------------------------------------------------
      | HOME
      |--------------------------------------------------------------------------
      */

  case 'home':
  return (
    <HomePage
      onNavigate={
        handleNavigate
      }
      onOpenPillar={
        handleOpenPillar
      }
    />
  )

      /*
      |--------------------------------------------------------------------------
      | ZAKAT
      |--------------------------------------------------------------------------
      */

      case 'zakat':
        return (
          <ZakatCalculator
            onPayZakat={
              handlePayZakat
            }
          />
        )

      /*
      |--------------------------------------------------------------------------
      | DONASI
      |--------------------------------------------------------------------------
      */

      case 'donasi':
        return (
          <DonationForm
            initialZakatAmount={
              zakatAmount ??
              undefined
            }
            initialProgram={
              selectedProgram ??
              undefined
            }
          />
        )

      /*
      |--------------------------------------------------------------------------
      | ABOUT
      |--------------------------------------------------------------------------
      */

      case 'about':
        return (
          <AboutPage />
        )

      /*
      |--------------------------------------------------------------------------
      | PROGRAM / 6 PILAR
      |--------------------------------------------------------------------------
      */

      case 'program':
        return (
          <ProgramPage
            onNavigate={
              handleNavigate
            }
            onDonateProgram={
              handleNavigateToDonasiWithProgram
            }
            onOpenPillar={
              handleOpenPillar
            }
          />
        )

      /*
      |--------------------------------------------------------------------------
      | PILAR DETAIL
      |--------------------------------------------------------------------------
      */

      case 'pilar-detail':
        if (!currentPillar) {
          return (
            <ProgramPage
              onNavigate={
                handleNavigate
              }
              onDonateProgram={
                handleNavigateToDonasiWithProgram
              }
              onOpenPillar={
                handleOpenPillar
              }
            />
          )
        }

        return (
          <PillarDetail
            category={
              currentPillar
            }
            onBack={() =>
              handleNavigate(
                'program'
              )
            }
            onOpenCampaign={
              handleOpenCampaign
            }
          />
        )

      /*
      |--------------------------------------------------------------------------
      | CAMPAIGN LIST
      |--------------------------------------------------------------------------
      */

      case 'campaign':
        return (
          <CampaignPage
            onOpenCampaign={
              handleOpenCampaign
            }
          />
        )

      /*
      |--------------------------------------------------------------------------
      | CAMPAIGN DETAIL
      |--------------------------------------------------------------------------
      */

      case 'campaign-detail':
        if (
          currentCampaignId ===
          null
        ) {
          return (
            <CampaignPage
              onOpenCampaign={
                handleOpenCampaign
              }
            />
          )
        }

        return (
          <CampaignDetail
            id={
              currentCampaignId
            }
          />
        )

      /*
      |--------------------------------------------------------------------------
      | BERITA
      |--------------------------------------------------------------------------
      */

      case 'berita':
        return (
          <BeritaPage
            onNavigate={
              handleNavigate
            }
            onOpenContent={
              handleOpenContent
            }
          />
        )

      /*
      |--------------------------------------------------------------------------
      | ARTIKEL
      |--------------------------------------------------------------------------
      */

      case 'artikel':
        return (
          <ArtikelPage
            onNavigate={
              handleNavigate
            }
            onOpenContent={
              handleOpenContent
            }
          />
        )

      /*
      |--------------------------------------------------------------------------
      | BACA
      |--------------------------------------------------------------------------
      */

      case 'baca':
        if (!currentContent) {
          return (
            <HomePage
              onNavigate={handleNavigate}
            />
          )
        }

        return (
          <BacaPage
            content={currentContent}
            onNavigate={handleNavigate}
          />
        )

      /*
      |--------------------------------------------------------------------------
      | PUBLIKASI
      |--------------------------------------------------------------------------
      */

      case 'publikasi':
        return (
          <PublikasiPage />
        )

      /*
      |--------------------------------------------------------------------------
      | LOGIN
      |--------------------------------------------------------------------------
      */

      case 'login':
        return (
          <LoginPage
            onNavigate={
              handleNavigate
            }
          />
        )

      /*
      |--------------------------------------------------------------------------
      | REGISTER
      |--------------------------------------------------------------------------
      */

      case 'register':
        return (
          <RegisterPage
            onNavigate={
              handleNavigate
            }
          />
        )

      /*
      |--------------------------------------------------------------------------
      | DASHBOARD
      |--------------------------------------------------------------------------
      */

      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={
              handleNavigate
            }
          />
        )

      /*
      |--------------------------------------------------------------------------
      | FALLBACK
      |--------------------------------------------------------------------------
      */

      default:
        return (
          <HomePage
            onNavigate={
              handleNavigate
            }
          />
        )
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Auth Loading
  |--------------------------------------------------------------------------
  */

  /*
  |--------------------------------------------------------------------------
  | AUTH LOADING
  |--------------------------------------------------------------------------
  */

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8F2]">
        <div className="text-center">

          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#F58220] border-t-transparent" />

          <p className="text-sm text-gray-500">
            Mohon Tunggu...
          </p>

        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | APP UI
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor:
          '#FFF8F2',
        fontFamily:
          "'Inter', sans-serif",
      }}
    >

      {page !== 'dashboard' && (
        <Navbar
          currentPage={page}
          onNavigate={
            handleNavigate
          }
        />
      )}

      {renderPage()}

      {showFooter && (
        <Footer
          onNavigate={
            handleNavigate
          }
        />
      )}

      {page !== 'dashboard' && (
        <FloatingElements />
      )}

    </div>
  )
}