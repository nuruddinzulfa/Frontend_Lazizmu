import { useEffect, useState } from "react";
import { useInView } from "../../hooks/useInView";
import API_URL from "@/lib/api";
import { api } from "../../services/api";

interface FinancialReport {
  id: number;
  title: string;
  type: string;
  year: number;
  description?: string | null;
  thumbnail?: string | null;
  file: string;
  published_at?: string | null;
}

interface FinancialReportResponse {
  success: boolean;
  message?: string;
  data: FinancialReport[];
}

/*
|--------------------------------------------------------------------------
| BACKEND STORAGE URL
|--------------------------------------------------------------------------
*/

function getStorageUrl(
  path?: string | null
) {
  if (!path) {
    return "";
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  const backendUrl =
    API_URL.replace(
      /\/api\/?$/,
      ""
    );

  const cleanPath =
    path.replace(/^\/+/, "");

  return `${backendUrl}/storage/${cleanPath}`;
}

/*
|--------------------------------------------------------------------------
| DATE
|--------------------------------------------------------------------------
*/

function formatDate(
  value?: string | null
) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  ).format(date);
}

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function FinancialTransparency() {
  const { inView, ref } =
    useInView();

  const [
    reports,
    setReports,
  ] = useState<
    FinancialReport[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | ACTIVE FILTER
  |--------------------------------------------------------------------------
  */

  const [
    activeType,
    setActiveType,
  ] = useState("Semua");

  /*
  |--------------------------------------------------------------------------
  | FETCH REPORTS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchReports =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await api.get<FinancialReportResponse>(
              "/financial-reports"
            );

          if (!response.success) {
            throw new Error(
              response.message ||
                "Gagal mengambil laporan keuangan."
            );
          }

          const data =
            Array.isArray(
              response.data
            )
              ? response.data
              : [];

          setReports(data);
        } catch (error) {
          console.error(
            "FINANCIAL REPORT ERROR:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "Gagal mengambil laporan keuangan."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchReports();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | REPORT TYPES
  |--------------------------------------------------------------------------
  |
  | Filter dibuat otomatis berdasarkan
  | report.type dari backend.
  |
  */

  const reportTypes = [
    "Semua",
    ...Array.from(
      new Set(
        reports
          .map(
            (report) =>
              report.type
          )
          .filter(
            (
              type
            ): type is string =>
              Boolean(type)
          )
      )
    ),
  ];

  /*
  |--------------------------------------------------------------------------
  | FILTERED REPORTS
  |--------------------------------------------------------------------------
  */

  const filteredReports =
    activeType === "Semua"
      ? reports
      : reports.filter(
          (report) =>
            report.type ===
            activeType
        );

  /*
  |--------------------------------------------------------------------------
  | DOWNLOAD
  |--------------------------------------------------------------------------
  */

  const handleDownload = (
    report: FinancialReport
  ) => {
    const fileUrl =
      getStorageUrl(
        report.file
      );

    if (!fileUrl) {
      return;
    }

    window.open(
      fileUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section
      id="transparency"
      className="landing-section landing-section--soft landing-section--orb-r"
    >

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ===================================================
            HEADING
        =================================================== */}

        <div
          ref={
            ref as React.RefObject<HTMLDivElement>
          }
          className={`mx-auto mb-8 max-w-2xl text-center transition-all duration-700 ${
            inView
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
        >

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#EA6113]/15 bg-white/80 px-4 py-2 shadow-sm ">

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFE3B3] text-sm text-[#EA6113]">
              ✓
            </span>

            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#EA6113]">
              Transparansi
            </span>

          </div>

          <h2
            className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl"
            style={{
              fontFamily:
                "'Fraunces', serif",
            }}
          >
            Transparansi Laporan
          </h2>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full  bg-[#EA6113] " />

          <p className="mx-auto mt-5 text-sm leading-7 text-gray-600 sm:text-base">
            Lazismu Pemalang berkomitmen
            memberikan akses informasi laporan
            dan publikasi secara transparan
            kepada masyarakat.
          </p>

        </div>

        {/* ===================================================
            FILTER
        =================================================== */}

        {!loading &&
          !error &&
          reports.length > 0 && (
            <div
              className={`mb-10 flex flex-wrap justify-center gap-2 transition-all duration-700 delay-100 ${
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >

              {reportTypes.map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setActiveType(
                        type
                      )
                    }
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                      activeType ===
                      type
                        ? "border-[#EA6113] bg-[#EA6113] text-white shadow-md "
                        : "border-[#E8CDAA] bg-white/80 text-gray-600 hover:border-[#EA6113] hover:text-[#EA6113]"
                    }`}
                  >
                    {type}
                  </button>
                )
              )}

            </div>
          )}

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div
          className={`transition-all duration-700 delay-200 ${
            inView
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="rounded-[28px] border border-[#E8CDAA] bg-white/80 py-14 text-center shadow-sm ">

              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#EA6113] border-t-transparent" />

              <p className="text-sm font-medium text-gray-500">
                Mengambil laporan...
              </p>

            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading &&
            error && (
              <div className="mx-auto max-w-xl rounded-[28px] border border-red-200 bg-red-50 p-7 text-center shadow-sm">

                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-500">
                  !
                </div>

                <p className="text-sm leading-6 text-red-600">
                  {error}
                </p>

              </div>
            )}

          {/* =================================================
              EMPTY DATABASE
          ================================================= */}

          {!loading &&
            !error &&
            reports.length ===
              0 && (
              <div className="mx-auto max-w-xl rounded-[28px] border border-[#E8CDAA] bg-white/85 p-10 text-center shadow-sm ">

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFE3B3] text-3xl shadow-sm">
                  📄
                </div>

                <p
                  className="mb-2 font-bold text-gray-800"
                  style={{
                    fontFamily:
                      "'Fraunces', serif",
                  }}
                >
                  Belum ada laporan
                </p>

                <p className="text-sm leading-6 text-gray-400">
                  Laporan akan ditampilkan
                  setelah dipublikasikan oleh
                  admin.
                </p>

              </div>
            )}

          {/* =================================================
              FILTER EMPTY
          ================================================= */}

          {!loading &&
            !error &&
            reports.length > 0 &&
            filteredReports.length ===
              0 && (
              <div className="mx-auto max-w-xl rounded-[28px] border border-[#E8CDAA] bg-white/85 p-10 text-center shadow-sm ">

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFE3B3] text-3xl shadow-sm">
                  📄
                </div>

                <p
                  className="mb-2 font-bold text-gray-800"
                  style={{
                    fontFamily:
                      "'Fraunces', serif",
                  }}
                >
                  Belum ada laporan
                </p>

                <p className="text-sm leading-6 text-gray-400">
                  Belum ada laporan untuk
                  kategori{" "}
                  <span className="font-semibold text-[#EA6113]">
                    {activeType}
                  </span>
                  .
                </p>

              </div>
            )}

          {/* =================================================
              REPORT GRID
          ================================================= */}

          {!loading &&
            !error &&
            filteredReports.length >
              0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                {filteredReports.map(
                  (report) => {
                    const thumbnail =
                      getStorageUrl(
                        report.thumbnail
                      );

                    return (
                      <article
                        key={
                          report.id
                        }
                        className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-[#E8CDAA] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#EA6113]/40 shadow-sm"
                      >

                        {/* CARD GLOW */}

                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#EA6113]/5  transition-all duration-300 group-hover:bg-[#EA6113]/10"
                        />

                        {/* =================================================
                            THUMBNAIL
                        ================================================= */}

                        <div className="relative h-52 overflow-hidden bg-[#FFE3B3]">

                          {thumbnail ? (
                            <img
                              src={
                                thumbnail
                              }
                              alt={
                                report.title
                              }
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center  bg-[#FFF8EA]  ">

                              <div className="text-center">

                                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm">
                                  📄
                                </div>

                                <div className="text-xs font-bold uppercase tracking-wider text-[#EA6113]">
                                  Lazismu
                                  Pemalang
                                </div>

                              </div>

                            </div>
                          )}

                          {/* IMAGE OVERLAY */}

                          <div className="absolute inset-0  bg-black/60  " />

                          {/* TYPE */}

                          <div className="absolute left-4 top-4">

                            <span className="rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-xs font-bold text-[#EA6113] shadow-sm ">
                              {report.type}
                            </span>

                          </div>

                          {/* YEAR */}

                          <div className="absolute right-4 top-4">

                            <span className="rounded-full bg-[#EA6113] px-3 py-1.5 text-xs font-bold text-white shadow-md">
                              {report.year}
                            </span>

                          </div>

                        </div>

                        {/* =================================================
                            BODY
                        ================================================= */}

                        <div className="relative flex flex-1 flex-col p-6">

                          <h3
                            className="mb-3 line-clamp-2 text-base font-bold leading-6 text-gray-900 transition-colors duration-200 group-hover:text-[#EA6113]"
                            style={{
                              fontFamily:
                                "'Fraunces', serif",
                            }}
                          >
                            {report.title}
                          </h3>

                          <p className="mb-5 line-clamp-3 flex-1 text-sm leading-7 text-gray-500">
                            {report.description ||
                              "Publikasi resmi Lazismu Pemalang."}
                          </p>

                          {/* DATE */}

                          <div className="mb-5 flex items-center gap-2 border-t border-[#E8CDAA] pt-4">

                            <svg
                              className="h-4 w-4 text-[#EA6113]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.8}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>

                            <span className="text-xs text-gray-400">
                              Dipublikasikan{" "}
                              {formatDate(
                                report.published_at
                              )}
                            </span>

                          </div>

                          {/* DOWNLOAD */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDownload(
                                report
                              )
                            }
                            className="group/button flex w-full items-center justify-center gap-2 rounded-xl  bg-[#EA6113]  py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                            style={{
                              fontFamily:
                                "'Fraunces', serif",
                            }}
                          >

                            <svg
                              className="h-4 w-4 transition-transform duration-200 group-hover/button:translate-y-0.5"
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

                            Unduh Laporan

                          </button>

                        </div>

                        {/* BOTTOM ACCENT */}

                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#EA6113] transition-all duration-300 group-hover:w-full" />

                      </article>
                    );
                  }
                )}

              </div>
            )}

          {/* =================================================
              INFO
          ================================================= */}

          {!loading &&
            !error &&
            filteredReports.length >
              0 && (
              <div className="relative mt-8 overflow-hidden rounded-[24px] border border-[#E8CDAA] bg-white/75 p-6 shadow-sm ">

                <div
                  aria-hidden="true"
                  className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#EA6113]/5 "
                />

                <div className="relative flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFE3B3] text-[#EA6113]">
                    ✓
                  </div>

                  <p className="max-w-2xl text-sm leading-6 text-gray-500">
                    Menampilkan{" "}
                    <span className="font-semibold text-gray-700">
                      {
                        filteredReports.length
                      }
                    </span>{" "}
                    laporan{" "}
                    {activeType !==
                      "Semua" && (
                      <>
                        kategori{" "}
                        <span className="font-semibold text-[#EA6113]">
                          {activeType}
                        </span>
                      </>
                    )}
                    .
                  </p>

                </div>

              </div>
            )}

        </div>

      </div>
    </section>
  );
}