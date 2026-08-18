import { useEffect, useState } from "react";
import { useInView } from "../../hooks/useInView";
import type { NavPage } from "../../App";
import { api } from "../../services/api";

interface ProgramsProps {
  onNavigate: (page: NavPage) => void;
}

interface Program {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  thumbnail?: string | null;
  pillar?: string | null;
  published_at?: string | null;
  views?: number | null;
  sort_order?: number | null;
}

interface ProgramResponse {
  success: boolean;
  message?: string;
  data: Program[];
}

/*
|--------------------------------------------------------------------------
| Warna Pillar
|--------------------------------------------------------------------------
*/

function getPillarColor(pillar?: string | null) {
  const value = pillar?.toLowerCase() ?? "";

  if (value.includes("pendidikan")) {
    return "bg-blue-100 text-blue-700";
  }

  if (value.includes("kesehatan")) {
    return "bg-red-100 text-red-700";
  }

  if (value.includes("ekonomi")) {
    return "bg-green-100 text-green-700";
  }

  if (value.includes("sosial")) {
    return "bg-orange-100 text-orange-700";
  }

  if (value.includes("dakwah")) {
    return "bg-purple-100 text-purple-700";
  }

  if (value.includes("lingkungan")) {
    return "bg-emerald-100 text-emerald-700";
  }

  return "bg-gray-100 text-gray-700";
}

/*
|--------------------------------------------------------------------------
| Placeholder Icon
|--------------------------------------------------------------------------
*/

function getProgramIcon(pillar?: string | null) {
  const value = pillar?.toLowerCase() ?? "";

  if (value.includes("pendidikan")) {
    return "🎓";
  }

  if (value.includes("kesehatan")) {
    return "🏥";
  }

  if (value.includes("ekonomi")) {
    return "💼";
  }

  if (value.includes("sosial")) {
    return "🤝";
  }

  if (value.includes("dakwah")) {
    return "🕌";
  }

  if (value.includes("lingkungan")) {
    return "🌱";
  }

  return "🤲";
}

export default function Programs({
  onNavigate,
}: ProgramsProps) {
  const { inView, ref } = useInView();

  const [programs, setPrograms] =
    useState<Program[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Fetch Program
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<ProgramResponse>(
            "/programs"
          );

        if (!response.success) {
          throw new Error(
            response.message ||
              "Gagal mengambil program."
          );
        }

        const data = Array.isArray(
          response.data
        )
          ? response.data
          : [];

        /*
        |--------------------------------------------------------------------------
        | Urutkan berdasarkan sort_order
        |--------------------------------------------------------------------------
        */

        const sorted = [...data].sort(
          (a, b) =>
            Number(a.sort_order ?? 0) -
            Number(b.sort_order ?? 0)
        );

        setPrograms(sorted.slice(0, 6));
      } catch (error) {
        console.error(
          "PROGRAM ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil program."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <section
      id="programs"
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
            Program
          </span>

          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Program Unggulan Kami
          </h2>

          <p className="text-gray-500 max-w-xl mx-auto">
            Program LAZISMU Pemalang
            hadir untuk mendukung
            pendidikan, kesehatan,
            ekonomi, sosial, dakwah,
            dan lingkungan masyarakat.
          </p>
        </div>

        {/* Loading */}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-9 h-9 border-4 border-[#F58220] border-t-transparent rounded-full animate-spin mb-3" />

            <p className="text-sm text-gray-400">
              Mengambil program...
            </p>
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="max-w-xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          programs.length === 0 && (
            <div className="max-w-xl mx-auto bg-white border border-[#F3DEC8] rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">
                🤲
              </div>

              <p className="font-semibold text-gray-700 mb-1">
                Belum ada program
              </p>

              <p className="text-sm text-gray-400">
                Program akan
                ditampilkan setelah
                dipublikasikan oleh
                admin.
              </p>
            </div>
          )}

        {/* Program Grid */}

        {!loading &&
          !error &&
          programs.length > 0 && (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {programs.map(
                (program) => (
                  <div
                    key={program.id}
                    onClick={() =>
                      onNavigate(
                        "program"
                      )
                    }
                    className="card-hover group bg-white rounded-2xl overflow-hidden border border-[#F3DEC8] shadow-sm cursor-pointer"
                  >

                    {/* Image */}

                    <div className="relative h-44 bg-orange-50 overflow-hidden">
                      {program.thumbnail ? (
                        <img
                          src={
                            program.thumbnail
                          }
                          alt={
                            program.title
                          }
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FEF0E4] to-[#FFF8F2]">
                          <div className="text-center">
                            <div className="text-5xl mb-2">
                              {getProgramIcon(
                                program.pillar
                              )}
                            </div>

                            <div className="text-xs font-semibold text-[#F58220]">
                              LAZISMU
                              Pemalang
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                      {program.pillar && (
                        <span
                          className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1.5 rounded-full ${getPillarColor(
                            program.pillar
                          )}`}
                        >
                          {program.pillar}
                        </span>
                      )}
                    </div>

                    {/* Content */}

                    <div className="p-5">
                      <h3
                        className="font-bold text-gray-800 mb-3"
                        style={{
                          fontFamily:
                            "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {program.title}
                      </h3>

                      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                        {program.excerpt ||
                          "Informasi program LAZISMU Pemalang."}
                      </p>

                      <div
                        className="flex items-center gap-1.5 text-[#F58220] text-sm font-semibold group-hover:gap-3 transition-all duration-200"
                        style={{
                          fontFamily:
                            "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        Lihat Detail

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
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

        {/* All Programs */}

        <div className="text-center mt-10">
          <button
            type="button"
            onClick={() =>
              onNavigate("program")
            }
            className="border-2 border-[#F58220] text-[#F58220] hover:bg-[#F58220] hover:text-white transition-all duration-200 px-8 py-3 rounded-xl font-semibold text-sm"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Lihat Semua Program →
          </button>
        </div>
      </div>
    </section>
  );
}