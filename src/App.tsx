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

  const [zakatType, setZakatType] =
    useState<'profesi' | 'maal' | null>(null)

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
    targetPage: NavPage
  ): string => {
    switch (targetPage) {
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
  | INITIAL URL / DIRECT ACCESS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const pathname =
      window.location.pathname

    const search =
      window.location.search

    /*
    |--------------------------------------------------------------------------
    | DONASI / MIDTRANS RETURN
    |--------------------------------------------------------------------------
    */

    if (pathname === '/donasi') {
      setPage('donasi')

      window.history.replaceState(
        {
          page: 'donasi',
        },
        '',
        `/donasi${search}`
      )

      return
    }

    /*
    |--------------------------------------------------------------------------
    | HOME
    |--------------------------------------------------------------------------
    */

    if (
      pathname === '/' ||
      pathname === ''
    ) {
      setPage('home')

      window.history.replaceState(
        {
          page: 'home',
        },
        '',
        '/'
      )

      return
    }

    /*
    |--------------------------------------------------------------------------
    | BERITA / ARTIKEL DETAIL
    |--------------------------------------------------------------------------
    */

    const contentMatch =
      pathname.match(
        /^\/(berita|artikel)\/(\d+)$/
      )

    if (contentMatch) {
      const type =
        contentMatch[1] as
          | 'berita'
          | 'artikel'

      const id = Number(
        contentMatch[2]
      )

      const content = {
        type,
        id,
      }

      setCurrentContent(content)
      setPage('baca')

      window.history.replaceState(
        {
          page: 'baca',
          content,
        },
        '',
        pathname + search
      )

      return
    }

    /*
    |--------------------------------------------------------------------------
    | CAMPAIGN DETAIL
    |--------------------------------------------------------------------------
    */

    const campaignMatch =
      pathname.match(
        /^\/campaign\/(\d+)$/
      )

    if (campaignMatch) {
      const id = Number(
        campaignMatch[1]
      )

      setCurrentCampaignId(id)
      setCurrentCampaignId(id)
      setPage('campaign-detail')

      window.history.replaceState(
        {
          page: 'campaign-detail',
          campaignId: id,
        },
        '',
        pathname + search
      )

      return
    }

    /*
    |--------------------------------------------------------------------------
    | PILAR DETAIL
    |--------------------------------------------------------------------------
    */

    const pillarMatch =
      pathname.match(
        /^\/program\/(.+)$/
      )

    if (pillarMatch) {
      const slug = decodeURIComponent(
        pillarMatch[1]
      )

      const category = slug
        .split('-')
        .map(
          (word) =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(' ')

      setCurrentPillar(category)
      setPage('pilar-detail')

      window.history.replaceState(
        {
          page: 'pilar-detail',
          category,
        },
        '',
        pathname + search
      )

      return
    }

    /*
    |--------------------------------------------------------------------------
    | HALAMAN NORMAL
    |--------------------------------------------------------------------------
    */

    const pathPage =
      pathname
        .replace(/^\/+/, '')
        .replace(/\/+$/, '') as NavPage

    const validPages: NavPage[] = [
      'home',
      'zakat',
      'donasi',
      'about',
      'program',
      'campaign',
      'berita',
      'artikel',
      'publikasi',
      'login',
      'register',
      'dashboard',
    ]

    if (
      validPages.includes(pathPage)
    ) {
      if (
        pathPage === 'dashboard' &&
        !localStorage.getItem('token')
      ) {
        setPage('login')

        window.history.replaceState(
          {
            page: 'login',
          },
          '',
          '/login'
        )

        return
      }

      setPage(pathPage)

      window.history.replaceState(
        {
          page: pathPage,
        },
        '',
        pathname + search
      )

      return
    }

    /*
    |--------------------------------------------------------------------------
    | FALLBACK
    |--------------------------------------------------------------------------
    */

    setPage('home')

    window.history.replaceState(
      {
        page: 'home',
      },
      '',
      '/'
    )
  }, [])

  /*
  |--------------------------------------------------------------------------
  | GENERAL NAVIGATION
  |--------------------------------------------------------------------------
  */

  const handleNavigate = (
    targetPage: NavPage
  ) => {
    /*
    |--------------------------------------------------------------------------
    | Dashboard membutuhkan login
    |--------------------------------------------------------------------------
    */

    if (targetPage === 'dashboard') {
      const token =
        localStorage.getItem('token')

      if (!token) {
        setPage('login')

        window.history.pushState(
          {
            page: 'login',
          },
          '',
          '/login'
        )

        return
      }

      sessionStorage.setItem(
        'adminDashboard',
        'true'
      )
    } else {
      sessionStorage.removeItem(
        'adminDashboard'
      )
    }

    /*
    |--------------------------------------------------------------------------
    | Reset donation state
    |--------------------------------------------------------------------------
    */

    if (targetPage !== 'donasi') {
      setZakatAmount(null)
      setZakatType(null)
      setSelectedProgram(null)
    }

    /*
    |--------------------------------------------------------------------------
    | Reset content
    |--------------------------------------------------------------------------
    */

    setCurrentContent(null)

    /*
    |--------------------------------------------------------------------------
    | Reset pillar
    |--------------------------------------------------------------------------
    */

    if (
      targetPage !== 'pilar-detail'
    ) {
      setCurrentPillar(null)
    }

    /*
    |--------------------------------------------------------------------------
    | Reset campaign
    |--------------------------------------------------------------------------
    */

    if (
      targetPage !== 'campaign' &&
      targetPage !== 'campaign-detail'
    ) {
      setCurrentCampaignId(null)
    }

    /*
    |--------------------------------------------------------------------------
    | Set page
    |--------------------------------------------------------------------------
    */

    setPage(targetPage)

    /*
    |--------------------------------------------------------------------------
    | Browser history
    |--------------------------------------------------------------------------
    */

    window.history.pushState(
      {
        page: targetPage,
      },
      '',
      getPathForPage(targetPage)
    )

    /*
    |--------------------------------------------------------------------------
    | Scroll top
    |--------------------------------------------------------------------------
    */

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  /*
  |--------------------------------------------------------------------------
  | OPEN PILAR
  |--------------------------------------------------------------------------
  */

  const handleOpenPillar = (
    category: string
  ) => {
    setCurrentPillar(category)

    setCurrentCampaignId(null)
    setCurrentContent(null)

    setZakatAmount(null)
    setZakatType(null)
    setSelectedProgram(null)

    setPage('pilar-detail')

    const slug = category
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')

    window.history.pushState(
      {
        page: 'pilar-detail',
        category,
      },
      '',
      `/program/${slug}`
    )

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
    amount: number,
    type: 'profesi' | 'maal'
  ) => {
    setZakatAmount(amount)
    setZakatType(type)

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
    setSelectedProgram(program)

    setZakatAmount(null)
    setZakatType(null)

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
    const content = {
      type,
      id,
    }

    setCurrentContent(content)

    setCurrentPillar(null)
    setCurrentCampaignId(null)

    setZakatAmount(null)
    setZakatType(null)
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
    setCurrentCampaignId(id)

    setCurrentPillar(null)
    setCurrentContent(null)

    setZakatAmount(null)
    setZakatType(null)
    setSelectedProgram(null)

    setPage('campaign-detail')

    window.history.pushState(
      {
        page: 'campaign-detail',
        campaignId: id,
      },
      '',
      `/campaign/${id}`
    )

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
    const restoreSession =
      async () => {
        const token =
          localStorage.getItem('token')

        if (!token) {
          localStorage.removeItem(
            'user'
          )

          sessionStorage.removeItem(
            'adminDashboard'
          )

          setAuthLoading(false)

          return
        }

        try {
          const user =
            await getProfile()

          const allowedRoles = [
            'Super Admin',
            'Admin Donasi',
            'Admin Konten',
          ]

          if (
            !user.role ||
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

          localStorage.setItem(
            'user',
            JSON.stringify(user)
          )

          const shouldOpenDashboard =
            sessionStorage.getItem(
              'adminDashboard'
            ) === 'true'

          if (
            shouldOpenDashboard &&
            window.location.pathname !==
              '/donasi'
          ) {
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

          /*
          |--------------------------------------------------------------------------
          | Jangan ganggu return Midtrans
          |--------------------------------------------------------------------------
          */

          if (
            window.location.pathname !==
            '/donasi'
          ) {
            setPage('login')
          }
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

      const targetPage =
        state.page as NavPage

      /*
      |--------------------------------------------------------------------------
      | Dashboard protection
      |--------------------------------------------------------------------------
      */

      if (
        targetPage === 'dashboard' &&
        !localStorage.getItem('token')
      ) {
        setPage('login')

        return
      }

      setPage(targetPage)

      /*
      |--------------------------------------------------------------------------
      | Content
      |--------------------------------------------------------------------------
      */

      if (
        targetPage === 'baca' &&
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
      | Pilar
      |--------------------------------------------------------------------------
      */

      if (
        targetPage === 'pilar-detail'
      ) {
        setCurrentPillar(
          state.category ?? null
        )
      } else {
        setCurrentPillar(null)
      }

      /*
      |--------------------------------------------------------------------------
      | Campaign
      |--------------------------------------------------------------------------
      */

      if (
        targetPage ===
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
      | Donation
      |--------------------------------------------------------------------------
      */

      if (
        targetPage !== 'donasi'
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
    'login',
    'dashboard',
  ]

  const showFooter =
    !noFooterPages.includes(page)

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
            initialZakatType={
              zakatType ??
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
      | PROGRAM
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
      | CAMPAIGN
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
              onNavigate={
                handleNavigate
              }
            />
          )
        }

        return (
          <BacaPage
            content={
              currentContent
            }
            onNavigate={
              handleNavigate
            }
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
  }

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
    )
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