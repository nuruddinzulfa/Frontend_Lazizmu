import { useEffect, useState } from "react";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import FloatingElements from "./components/ui/FloatingElements";
import ZakatCalculator from "./components/donation/ZakatCalculator";

import DonationForm from "./app/donasi/page";
import HomePage from "./app/page";
import AboutPage from "./app/about/page";
import ProgramPage from "./app/program/page";
import BeritaPage from "./app/berita/page";
import ArtikelPage from "./app/artikel/page";
import PublikasiPage from "./app/publikasi/page";
import LoginPage from "./app/login/page";
import DashboardPage from "./app/dashboard/page";
import BacaPage from "./app/baca/page";

import { authService } from "./services/auth.service";

export type NavPage =
  | "home"
  | "zakat"
  | "donasi"
  | "about"
  | "program"
  | "berita"
  | "artikel"
  | "publikasi"
  | "login"
  | "dashboard"
  | "baca";

export default function App() {
  const [page, setPage] =
    useState<NavPage>("home");

  const [authLoading, setAuthLoading] =
    useState(true);

  const [zakatAmount, setZakatAmount] =
    useState<number | null>(null);

  const [
    selectedProgram,
    setSelectedProgram,
  ] = useState<string | null>(null);

  const [
    currentContent,
    setCurrentContent,
  ] = useState<{
    type: "berita" | "artikel";
    id: number;
  } | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Path
  |--------------------------------------------------------------------------
  */

  const getPathForPage = (
    targetPage: NavPage
  ) => {
    if (targetPage === "home") {
      return "/";
    }

    return `/${targetPage}`;
  };

  /*
  |--------------------------------------------------------------------------
  | Initial URL / Direct Access
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const pathname =
      window.location.pathname;

    const search =
      window.location.search;

    /*
    |--------------------------------------------------------------------------
    | Midtrans return / halaman donasi
    |--------------------------------------------------------------------------
    */

    if (pathname === "/donasi") {
      setPage("donasi");

      window.history.replaceState(
        {
          page: "donasi",
        },
        "",
        `/donasi${search}`
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Beranda
    |--------------------------------------------------------------------------
    */

    if (
      pathname === "/" ||
      pathname === ""
    ) {
      setPage("home");

      window.history.replaceState(
        {
          page: "home",
        },
        "",
        "/"
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Berita / Artikel detail
    |--------------------------------------------------------------------------
    */

    const contentMatch =
      pathname.match(
        /^\/(berita|artikel)\/(\d+)$/
      );

    if (contentMatch) {
      const type =
        contentMatch[1] as
          | "berita"
          | "artikel";

      const id = Number(
        contentMatch[2]
      );

      const content = {
        type,
        id,
      };

      setCurrentContent(content);
      setPage("baca");

      window.history.replaceState(
        {
          page: "baca",
          content,
        },
        "",
        pathname + search
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Halaman normal
    |--------------------------------------------------------------------------
    */

    const pathPage =
      pathname
        .replace(/^\/+/, "")
        .replace(/\/+$/, "") as NavPage;

    const validPages: NavPage[] = [
      "home",
      "zakat",
      "donasi",
      "about",
      "program",
      "berita",
      "artikel",
      "publikasi",
      "login",
      "dashboard",
      "baca",
    ];

    if (
      validPages.includes(pathPage)
    ) {
      if (
        pathPage === "dashboard" &&
        !localStorage.getItem("token")
      ) {
        setPage("login");

        window.history.replaceState(
          {
            page: "login",
          },
          "",
          "/login"
        );

        return;
      }

      setPage(pathPage);

      window.history.replaceState(
        {
          page: pathPage,
        },
        "",
        pathname + search
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Fallback
    |--------------------------------------------------------------------------
    */

    setPage("home");

    window.history.replaceState(
      {
        page: "home",
      },
      "",
      "/"
    );
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Navigation
  |--------------------------------------------------------------------------
  */

  const handleNavigate = (
    targetPage: NavPage
  ) => {
    if (targetPage === "dashboard") {
      const token =
        localStorage.getItem("token");

      if (!token) {
        setPage("login");

        window.history.pushState(
          {
            page: "login",
          },
          "",
          "/login"
        );

        return;
      }

      sessionStorage.setItem(
        "adminDashboard",
        "true"
      );
    } else {
      sessionStorage.removeItem(
        "adminDashboard"
      );
    }

    if (targetPage !== "donasi") {
      setZakatAmount(null);
      setSelectedProgram(null);
    }

    setCurrentContent(null);
    setPage(targetPage);

    window.history.pushState(
      {
        page: targetPage,
      },
      "",
      getPathForPage(targetPage)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Bayar Zakat
  |--------------------------------------------------------------------------
  */

  const handlePayZakat = (
    amount: number
  ) => {
    setZakatAmount(amount);
    setSelectedProgram(null);
    setCurrentContent(null);

    setPage("donasi");

    window.history.pushState(
      {
        page: "donasi",
      },
      "",
      "/donasi"
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Restore Login Session
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const restoreSession =
      async () => {
        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {
          localStorage.removeItem(
            "user"
          );

          sessionStorage.removeItem(
            "adminDashboard"
          );

          setAuthLoading(false);

          return;
        }

        try {
          const user =
            await authService.getCurrentUser();

          const allowedRoles = [
            "Super Admin",
            "Admin Donasi",
            "Admin Konten",
          ];

          if (
            !user.role ||
            !allowedRoles.includes(
              user.role
            )
          ) {
            localStorage.removeItem(
              "token"
            );

            localStorage.removeItem(
              "user"
            );

            sessionStorage.removeItem(
              "adminDashboard"
            );

            setPage("login");

            return;
          }

          localStorage.setItem(
            "user",
            JSON.stringify(user)
          );

          const shouldOpenDashboard =
            sessionStorage.getItem(
              "adminDashboard"
            ) === "true";

          if (
            shouldOpenDashboard &&
            window.location.pathname !==
              "/donasi"
          ) {
            setPage("dashboard");
          }
        } catch (error) {
          console.error(
            "Session tidak valid:",
            error
          );

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          sessionStorage.removeItem(
            "adminDashboard"
          );

          /*
          |--------------------------------------------------------------------------
          | Jangan ganggu return dari Midtrans
          |--------------------------------------------------------------------------
          */

          if (
            window.location.pathname !==
            "/donasi"
          ) {
            setPage("login");
          }
        } finally {
          setAuthLoading(false);
        }
      };

    restoreSession();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Donation Program
  |--------------------------------------------------------------------------
  */

  const handleNavigateToDonasiWithProgram =
    (program: string) => {
      setSelectedProgram(program);
      setZakatAmount(null);
      setCurrentContent(null);

      setPage("donasi");

      window.history.pushState(
        {
          page: "donasi",
        },
        "",
        "/donasi"
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  /*
  |--------------------------------------------------------------------------
  | Open Berita / Artikel
  |--------------------------------------------------------------------------
  */

  const handleOpenContent = (
    type: "berita" | "artikel",
    id: number
  ) => {
    const content = {
      type,
      id,
    };

    setCurrentContent(content);
    setPage("baca");

    window.history.pushState(
      {
        page: "baca",
        content,
      },
      "",
      `/${type}/${id}`
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Browser Back / Forward
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handlePopState = (
      event: PopStateEvent
    ) => {
      const state =
        event.state;

      if (state?.page) {
        const targetPage =
          state.page as NavPage;

        if (
          targetPage ===
            "dashboard" &&
          !localStorage.getItem(
            "token"
          )
        ) {
          setPage("login");
          return;
        }

        setPage(targetPage);

        if (state.content) {
          setCurrentContent(
            state.content
          );
        } else {
          setCurrentContent(
            null
          );
        }

        if (
          targetPage !==
          "donasi"
        ) {
          setZakatAmount(
            null
          );

          setSelectedProgram(
            null
          );
        }
      } else {
        const pathname =
          window.location.pathname;

        if (
          pathname ===
          "/donasi"
        ) {
          setPage(
            "donasi"
          );
        } else {
          setPage("home");
        }

        setCurrentContent(
          null
        );

        setZakatAmount(
          null
        );

        setSelectedProgram(
          null
        );
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Footer
  |--------------------------------------------------------------------------
  */

  const noFooterPages: NavPage[] = [
    "login",
    "dashboard",
  ];

  const showFooter =
    !noFooterPages.includes(
      page
    );

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  const renderPage = () => {
    switch (page) {
      case "zakat":
        return (
          <ZakatCalculator
            onPayZakat={
              handlePayZakat
            }
          />
        );

      case "donasi":
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
        );

      case "about":
        return <AboutPage />;

      case "program":
        return (
          <ProgramPage
            onNavigate={
              handleNavigate
            }
            onDonateProgram={
              handleNavigateToDonasiWithProgram
            }
          />
        );

      case "berita":
        return (
          <BeritaPage
            onNavigate={
              handleNavigate
            }
            onOpenContent={
              handleOpenContent
            }
          />
        );

      case "artikel":
        return (
          <ArtikelPage
            onNavigate={
              handleNavigate
            }
            onOpenContent={
              handleOpenContent
            }
          />
        );

      case "publikasi":
        return (
          <PublikasiPage />
        );

      case "login":
        return (
          <LoginPage
            onNavigate={
              handleNavigate
            }
          />
        );

      case "dashboard":
        return (
          <DashboardPage
            onNavigate={
              handleNavigate
            }
          />
        );

      case "baca":
        return (
          <BacaPage
            content={
              currentContent
            }
            onNavigate={
              handleNavigate
            }
          />
        );

      default:
        return (
          <HomePage
            onNavigate={
              handleNavigate
            }
          />
        );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Auth Loading
  |--------------------------------------------------------------------------
  */

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F2]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#F58220] border-t-transparent rounded-full mx-auto mb-3" />

          <p className="text-sm text-gray-500">
            Memeriksa sesi...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor:
          "#FFF8F2",

        fontFamily:
          "'Inter', sans-serif",
      }}
    >
      {page !==
        "dashboard" && (
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

      {page !==
        "dashboard" && (
        <FloatingElements />
      )}
    </div>
  );
}