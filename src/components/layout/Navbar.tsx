import { useEffect, useState } from "react";
import logo from "../../imports/3-2.png";

import type { NavPage } from "../../App";
import { authService } from "../../services/auth.service";

interface NavbarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
}

const pageNavLinks: {
  label: string;
  page: NavPage;
}[] = [
  {
    label: "Beranda",
    page: "home",
  },
  {
    label: "Tentang Kami",
    page: "about",
  },
  {
    label: "Program & Kampanye",
    page: "program",
  },
  {
    label: "Berita",
    page: "berita",
  },
  {
    label: "Artikel",
    page: "artikel",
  },
  {
    label: "Laporan",
    page: "publikasi",
  },
];

export default function Navbar({
  currentPage,
  onNavigate,
}: NavbarProps) {
  const [scrolled, setScrolled] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Navbar Scroll
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handler = () => {
      setScrolled(
        window.scrollY > 20
      );
    };

    window.addEventListener(
      "scroll",
      handler
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handler
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Check Login
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    setIsLoggedIn(!!token);
  }, [currentPage]);

  /*
  |--------------------------------------------------------------------------
  | Logo
  |--------------------------------------------------------------------------
  */

  const handleLogoClick = () => {
    onNavigate("home");

    setMobileOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Navigation
  |--------------------------------------------------------------------------
  */

  const handleNav = (
    page: NavPage
  ) => {
    onNavigate(page);

    setMobileOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await authService.logout();

      localStorage.removeItem("user");

      sessionStorage.removeItem(
        "adminDashboard"
      );

      setIsLoggedIn(false);
      setMobileOpen(false);

      onNavigate("home");
    } catch (error) {
      console.error(
        "Logout gagal:",
        error
      );

      /*
      |--------------------------------------------------------------------------
      | Tetap bersihkan session lokal
      |--------------------------------------------------------------------------
      */

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      sessionStorage.removeItem(
        "adminDashboard"
      );

      setIsLoggedIn(false);
      setMobileOpen(false);

      onNavigate("login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-[#F3DEC8]"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">

          {/* Logo */}
          <button
            onClick={
              handleLogoClick
            }
            className="flex-shrink-0 cursor-pointer"
            aria-label="Beranda LAZISMU Pemalang"
          >
            <img
              src={logo}
              alt="LAZISMU Kabupaten Pemalang"
              className="h-9 sm:h-11 lg:h-13 w-auto object-contain"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {pageNavLinks.map(
              (link) => (
                <button
                  key={link.label}
                  onClick={() =>
                    handleNav(
                      link.page
                    )
                  }
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    currentPage ===
                    link.page
                      ? "bg-[#FEF0E4] text-[#F58220]"
                      : "text-gray-600 hover:text-[#F58220] hover:bg-[#FEF0E4]"
                  }`}
                  style={{
                    fontFamily:
                      "'Inter', sans-serif",
                  }}
                >
                  {link.label}
                </button>
              )
            )}

            <button
              onClick={() =>
                handleNav(
                  "zakat"
                )
              }
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                currentPage ===
                "zakat"
                  ? "bg-[#FEF0E4] text-[#F58220]"
                  : "text-gray-600 hover:text-[#F58220] hover:bg-[#FEF0E4]"
              }`}
              style={{
                fontFamily:
                  "'Inter', sans-serif",
              }}
            >
              Kalkulator Zakat
            </button>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() =>
                    handleNav(
                      "dashboard"
                    )
                  }
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    currentPage ===
                    "dashboard"
                      ? "bg-[#FEF0E4] text-[#F58220]"
                      : "text-gray-600 hover:text-[#F58220] hover:bg-[#FEF0E4]"
                  }`}
                >
                  Dashboard
                </button>

                <button
                  onClick={
                    handleLogout
                  }
                  disabled={
                    isLoggingOut
                  }
                  className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoggingOut
                    ? "Keluar..."
                    : "Keluar"}
                </button>
              </>
            ) : (
              <button
                onClick={() =>
                  handleNav(
                    "login"
                  )
                }
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  currentPage ===
                  "login"
                    ? "bg-[#FEF0E4] text-[#F58220]"
                    : "text-gray-600 hover:text-[#F58220] hover:bg-[#FEF0E4]"
                }`}
              >
                Masuk
              </button>
            )}

            <button
              onClick={() =>
                handleNav(
                  "donasi"
                )
              }
              className="btn-primary px-5 py-2.5 text-sm font-semibold"
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Donasi Sekarang
            </button>
          </div>

          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => {
                setMobileOpen(
                  false
                );

                onNavigate(
                  "donasi"
                );
              }}
              className="btn-primary px-3 py-1.5 text-xs font-semibold rounded-lg"
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Donasi
            </button>

            <button
              className="p-1.5 rounded-lg text-gray-600 hover:bg-[#FEF0E4] transition-colors"
              onClick={() =>
                setMobileOpen(
                  !mobileOpen
                )
              }
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={
                      2
                    }
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={
                      2
                    }
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#F3DEC8] px-4 py-3 space-y-1 shadow-lg">

          {pageNavLinks.map(
            (link) => (
              <button
                key={link.label}
                onClick={() =>
                  handleNav(
                    link.page
                  )
                }
                className={`block w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  currentPage ===
                  link.page
                    ? "bg-[#FEF0E4] text-[#F58220]"
                    : "text-gray-700 hover:text-[#F58220] hover:bg-[#FEF0E4]"
                }`}
              >
                {link.label}
              </button>
            )
          )}

          <button
            onClick={() =>
              handleNav(
                "zakat"
              )
            }
            className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-[#F58220] hover:bg-[#FEF0E4] rounded-lg transition-colors"
          >
            Kalkulator Zakat
          </button>

          {isLoggedIn ? (
            <>
              <button
                onClick={() =>
                  handleNav(
                    "dashboard"
                  )
                }
                className={`block w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  currentPage ===
                  "dashboard"
                    ? "bg-[#FEF0E4] text-[#F58220]"
                    : "text-gray-600 hover:text-[#F58220] hover:bg-[#FEF0E4]"
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={
                  handleLogout
                }
                disabled={
                  isLoggingOut
                }
                className="block w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
              >
                {isLoggingOut
                  ? "Keluar..."
                  : "Keluar"}
              </button>
            </>
          ) : (
            <button
              onClick={() =>
                handleNav(
                  "login"
                )
              }
              className={`block w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                currentPage ===
                "login"
                  ? "bg-[#FEF0E4] text-[#F58220]"
                  : "text-gray-600 hover:text-[#F58220] hover:bg-[#FEF0E4]"
              }`}
            >
              Masuk
            </button>
          )}

          <div className="pt-1 pb-1">
            <button
              onClick={() =>
                handleNav(
                  "donasi"
                )
              }
              className="btn-primary block w-full text-center px-5 py-2.5 text-sm font-semibold"
            >
              Donasi Sekarang
            </button>
          </div>
        </div>
      )}
    </header>
  );
}