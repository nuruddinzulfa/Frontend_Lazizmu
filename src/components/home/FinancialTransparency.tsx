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
| Backend Storage URL
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

  return `${backendUrl}/storage/${path}`;
}

/*
|--------------------------------------------------------------------------
| Date
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
| Component
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
  | Fetch Reports
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
  | Download
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
      className="py-20 bg-[#FFF8F2]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}

        <div
          ref={
            ref as React.RefObject<HTMLDivElement>
          }
          className={`text-center mb-14 transition-all duration-700 ${
            inView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-[#F58220] text-sm font-semibold uppercase tracking-wider">
            Transparansi
          </span>

          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Transparansi Laporan
          </h2>

          <p className="text-gray-500 max-w-xl mx-auto">
            LAZISMU Pemalang
            berkomitmen memberikan
            akses informasi laporan
            dan publikasi secara
            transparan kepada
            masyarakat.
          </p>
        </div>

        {/* Content */}

        <div
          className={`transition-all duration-700 delay-200 ${
            inView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >

          {/* Loading */}

          {loading && (
            <div className="flex flex-col items-center justify-center py-14">
              <div className="w-9 h-9 border-4 border-[#F58220] border-t-transparent rounded-full animate-spin mb-3" />

              <p className="text-sm text-gray-400">
                Mengambil laporan...
              </p>
            </div>
          )}

          {/* Error */}

          {!loading &&
            error && (
              <div className="max-w-xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

          {/* Empty */}

          {!loading &&
            !error &&
            reports.length ===
              0 && (
              <div className="max-w-xl mx-auto bg-white border border-[#F3DEC8] rounded-2xl p-8 text-center">
                <div className="text-4xl mb-3">
                  📄
                </div>

                <p className="font-semibold text-gray-700 mb-1">
                  Belum ada laporan
                </p>

                <p className="text-sm text-gray-400">
                  Laporan akan
                  ditampilkan setelah
                  dipublikasikan oleh
                  admin.
                </p>
              </div>
            )}

          {/* Report Grid */}

          {!loading &&
            !error &&
            reports.length >
              0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {reports.map(
                  (report) => {
                    const thumbnail =
                      getStorageUrl(
                        report.thumbnail
                      );

                    return (
                      <div
                        key={
                          report.id
                        }
                        className="bg-white rounded-2xl border border-[#F3DEC8] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                      >

                        {/* Thumbnail */}

                        <div className="relative h-48 bg-[#FEF0E4] overflow-hidden">

                          {thumbnail ? (
                            <img
                              src={
                                thumbnail
                              }
                              alt={
                                report.title
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FEF0E4] to-[#FFF8F2]">

                              <div className="text-center">

                                <div className="text-5xl mb-2">
                                  📄
                                </div>

                                <div className="text-xs font-semibold text-[#F58220]">
                                  LAZISMU
                                  Pemalang
                                </div>

                              </div>

                            </div>
                          )}

                          <div className="absolute top-3 left-3">
                            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/90 text-[#F58220] shadow-sm">
                              {report.type}
                            </span>
                          </div>

                          <div className="absolute top-3 right-3">
                            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#F58220] text-white">
                              {report.year}
                            </span>
                          </div>

                        </div>

                        {/* Body */}

                        <div className="p-6 flex flex-col flex-1">

                          <h3
                            className="font-bold text-gray-900 mb-2"
                            style={{
                              fontFamily:
                                "'Plus Jakarta Sans', sans-serif",
                            }}
                          >
                            {report.title}
                          </h3>

                          <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">
                            {report.description ||
                              "Publikasi resmi LAZISMU Pemalang."}
                          </p>

                          <div className="text-xs text-gray-400 mb-5">
                            Dipublikasikan{" "}
                            {formatDate(
                              report.published_at
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleDownload(
                                report
                              )
                            }
                            className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2"
                          >
                            <svg
                              className="w-4 h-4"
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
                      </div>
                    );
                  }
                )}

              </div>
            )}

          {/* Info */}

          {!loading &&
            !error &&
            reports.length >
              0 && (
              <div className="mt-8 bg-white border border-[#F3DEC8] rounded-2xl p-5 text-center">
                <p className="text-sm text-gray-500">
                  Dokumen yang
                  ditampilkan merupakan
                  publikasi resmi yang
                  telah dipublikasikan
                  melalui sistem
                  LAZISMU Pemalang.
                </p>
              </div>
            )}

        </div>
      </div>
    </section>
  );
}