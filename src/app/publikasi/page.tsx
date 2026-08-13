'use client'

import { useEffect, useState } from 'react'
import {
  getPublicReports,
  getReportFileUrl,
  type FinancialReport,
  type PublicationType,
} from '@/service/report.service'

const tabs: PublicationType[] = [
  'Laporan Keuangan',
  'Laporan Tahunan',
  'Laporan Program',
]

export default function PublikasiPage() {
  const [activeTab, setActiveTab] =
    useState<PublicationType>('Laporan Keuangan')

  const [reports, setReports] =
    useState<FinancialReport[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  /*
  |--------------------------------------------------------------------------
  | Ambil laporan dari API
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true)
        setError(null)

        const data = await getPublicReports()

        setReports(data)
      } catch (err) {
        console.error(
          'Gagal mengambil laporan:',
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : 'Gagal mengambil data laporan.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [])

  /*
  |--------------------------------------------------------------------------
  | Filter berdasarkan tab
  |--------------------------------------------------------------------------
  */

  const filteredReports =
    reports.filter(
      report =>
        report.type === activeTab
    )

  /*
  |--------------------------------------------------------------------------
  | Download / lihat PDF
  |--------------------------------------------------------------------------
  */

  function handleView(
    report: FinancialReport
  ) {
    const url =
      getReportFileUrl(report.file)

    if (!url) {
      alert(
        'File laporan belum tersedia.'
      )

      return
    }

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Format tanggal
  |--------------------------------------------------------------------------
  */

  function formatDate(
    date: string | null
  ) {
    if (!date) {
      return ''
    }

    return new Date(
      date
    ).toLocaleDateString(
      'id-ID',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2]">

      {/* ================================================================ */}
      {/* HERO */}
      {/* ================================================================ */}

      <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] text-white py-16 pt-32">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-sm mb-3 opacity-80">

            <span>
              Beranda
            </span>

            <span className="mx-2">
              /
            </span>

            <span>
              Laporan
            </span>

          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Laporan
          </h1>

          <p className="mt-4 text-lg opacity-90 max-w-2xl">
            Laporan keuangan dan program
            LAZISMU Pemalang yang transparan
            dan akuntabel.
          </p>

        </div>

      </div>


      {/* ================================================================ */}
      {/* CONTENT */}
      {/* ================================================================ */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ============================================================ */}
        {/* TABS */}
        {/* ============================================================ */}

        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-[#F3DEC8] shadow-sm w-fit">

          {tabs.map(tab => (

            <button
              key={tab}
              onClick={() =>
                setActiveTab(tab)
              }
              className={`
                px-5
                py-2.5
                rounded-xl
                text-sm
                font-semibold
                transition-all
                ${
                  activeTab === tab
                    ? 'bg-[#F58220] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#F58220]'
                }
              `}
            >
              {tab}
            </button>

          ))}

        </div>


        {/* ============================================================ */}
        {/* ERROR */}
        {/* ============================================================ */}

        {error && (

          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4">

            <p className="font-semibold">
              Gagal mengambil laporan
            </p>

            <p className="text-sm mt-1">
              {error}
            </p>

          </div>

        )}


        {/* ============================================================ */}
        {/* LOADING */}
        {/* ============================================================ */}

        {loading && (

          <div className="bg-white border border-[#F3DEC8] rounded-2xl p-12 text-center">

            <div className="inline-flex items-center gap-3 text-gray-500">

              <div className="w-5 h-5 border-2 border-[#F58220] border-t-transparent rounded-full animate-spin" />

              <span>
                Memuat laporan...
              </span>

            </div>

          </div>

        )}


        {/* ============================================================ */}
        {/* EMPTY */}
        {/* ============================================================ */}

        {!loading &&
          !error &&
          filteredReports.length === 0 && (

            <div className="bg-white border border-[#F3DEC8] rounded-2xl p-12 text-center">

              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4">

                <svg
                  className="w-6 h-6 text-[#F58220]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
                  />
                </svg>

              </div>

              <h3 className="font-bold text-gray-900">
                Belum ada laporan
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Laporan yang telah dipublikasikan
                akan muncul di halaman ini.
              </p>

            </div>

          )}


        {/* ============================================================ */}
        {/* REPORT GRID */}
        {/* ============================================================ */}

        {!loading &&
          !error &&
          filteredReports.length > 0 && (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredReports.map(
                report => (

                  <div
                    key={report.id}
                    className="bg-white border border-[#F3DEC8] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
                  >

                    {/* ================================================= */}
                    {/* HEADER */}
                    {/* ================================================= */}

                    <div className="flex items-start gap-4 mb-4">

                      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">

                        <svg
                          className="w-6 h-6 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 3h7l5 5v13H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 3v6h6"
                          />

                        </svg>

                      </div>


                      <div className="flex-1 min-w-0">

                        <h3
                          className="font-bold text-gray-900 text-sm leading-snug mb-1"
                          style={{
                            fontFamily:
                              "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {report.title}
                        </h3>

                        <p className="text-xs text-gray-500">
                          Tahun {report.year}
                        </p>

                      </div>

                    </div>


                    {/* ================================================= */}
                    {/* DESCRIPTION */}
                    {/* ================================================= */}

                    {report.description && (

                      <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                        {report.description}
                      </p>

                    )}


                    {/* ================================================= */}
                    {/* DATE */}
                    {/* ================================================= */}

                    {report.published_at && (

                      <p className="text-xs text-gray-400 mb-4">

                        Dipublikasikan{' '}

                        {formatDate(
                          report.published_at
                        )}

                      </p>

                    )}


                    {/* ================================================= */}
                    {/* ACTION */}
                    {/* ================================================= */}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">

                      <div className="flex items-center gap-1 text-xs text-gray-400">

                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 3h7l5 5v13H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 3v6h6"
                          />

                        </svg>

                        <span>
                          PDF
                        </span>

                      </div>


                      <div className="flex items-center gap-2">

                        {/* Lihat */}

                        <button
                          onClick={() =>
                            handleView(
                              report
                            )
                          }
                          className="text-xs font-semibold text-[#F58220] hover:underline"
                        >
                          Lihat
                        </button>


                        {/* Download */}

                        <a
                          href={getReportFileUrl(
                            report.file
                          ) ?? '#'}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 bg-[#FEF0E4] text-[#F58220] hover:bg-[#F58220] hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                        >

                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>

                          Unduh

                        </a>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}


        {/* ============================================================ */}
        {/* TRANSPARANSI */}
        {/* ============================================================ */}

        {!loading &&
          !error &&
          reports.length > 0 && (

            <div className="mt-8 bg-[#FFF7ED] border border-[#F3DEC8] rounded-2xl p-5">

              <div className="flex items-start gap-4">

                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">

                  <svg
                    className="w-5 h-5 text-[#F58220]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      strokeWidth={2}
                    />

                    <path
                      strokeLinecap="round"
                      strokeWidth={2}
                      d="M12 11v5"
                    />

                    <circle
                      cx="12"
                      cy="8"
                      r="1"
                      fill="currentColor"
                    />

                  </svg>

                </div>


                <div>

                  <h3 className="font-bold text-gray-900 text-sm">
                    Transparansi LAZISMU
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Dokumen laporan yang tersedia
                    pada halaman ini merupakan laporan
                    yang telah dipublikasikan oleh
                    administrator LAZISMU.
                  </p>

                </div>

              </div>

            </div>

          )}

      </div>

    </div>
  )
}