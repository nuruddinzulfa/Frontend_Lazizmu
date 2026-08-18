import { useEffect, useMemo, useState } from "react";
import type { NavPage } from "../../App";
import { api } from "../../services/api";

interface ProgramPageProps {
  onNavigate?: (page: NavPage) => void;
  onDonateProgram?: (program: string) => void;
}

/*
|--------------------------------------------------------------------------
| Program Backend
|--------------------------------------------------------------------------
*/

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
| Campaign Backend
|--------------------------------------------------------------------------
*/

interface Campaign {
  id: number;
  title: string;
  slug: string;

  description?: string | null;
  image?: string | null;

  category?: string | null;

  target_amount?: number | string | null;
  collected_amount?: number | string | null;

  donor_count?: number | null;

  status?: string;
  featured?: boolean | number;
}

interface CampaignResponse {
  success: boolean;
  message?: string;

  data:
    | Campaign[]
    | {
        data: Campaign[];
      };
}

/*
|--------------------------------------------------------------------------
| Filters
|--------------------------------------------------------------------------
*/

const filters = [
  "Semua",
  "Pendidikan",
  "Kesehatan",
  "Ekonomi",
  "Sosial Dakwah",
  "Kemanusiaan",
  "Lingkungan",
];

/*
|--------------------------------------------------------------------------
| Category Helper
|--------------------------------------------------------------------------
*/

function getProgramCategory(program: Program) {
  const title = program.title.toLowerCase();

  if (title.includes("kemanusiaan")) {
    return "Kemanusiaan";
  }

  if (
    title.includes("sosial") &&
    title.includes("dakwah")
  ) {
    return "Sosial Dakwah";
  }

  return program.pillar || program.title;
}

function getCategoryColor(category?: string | null) {
  const value =
    category?.toLowerCase() ?? "";

  if (value.includes("pendidikan")) {
    return "bg-blue-100 text-blue-700";
  }

  if (value.includes("kesehatan")) {
    return "bg-red-100 text-red-700";
  }

  if (value.includes("ekonomi")) {
    return "bg-green-100 text-green-700";
  }

  if (
    value.includes("sosial") ||
    value.includes("dakwah")
  ) {
    return "bg-purple-100 text-purple-700";
  }

  if (value.includes("kemanusiaan")) {
    return "bg-orange-100 text-orange-700";
  }

  if (value.includes("lingkungan")) {
    return "bg-emerald-100 text-emerald-700";
  }

  return "bg-gray-100 text-gray-700";
}

/*
|--------------------------------------------------------------------------
| Icon
|--------------------------------------------------------------------------
*/

function getProgramIcon(category?: string | null) {
  const value =
    category?.toLowerCase() ?? "";

  if (value.includes("pendidikan")) {
    return "📚";
  }

  if (value.includes("kesehatan")) {
    return "🏥";
  }

  if (value.includes("ekonomi")) {
    return "💼";
  }

  if (
    value.includes("sosial") ||
    value.includes("dakwah")
  ) {
    return "🕌";
  }

  if (value.includes("kemanusiaan")) {
    return "🤝";
  }

  if (value.includes("lingkungan")) {
    return "🌱";
  }

  return "🤲";
}

/*
|--------------------------------------------------------------------------
| Rupiah
|--------------------------------------------------------------------------
*/

function formatRupiah(
  value: number | string | null | undefined
) {
  const number = Number(value ?? 0);

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(
    Number.isFinite(number)
      ? number
      : 0
  );
}

/*
|--------------------------------------------------------------------------
| Progress
|--------------------------------------------------------------------------
*/

function calculateProgress(
  collected: number,
  target: number
) {
  if (target <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round(
      (collected / target) * 100
    )
  );
}

/*
|--------------------------------------------------------------------------
| Program Page
|--------------------------------------------------------------------------
*/

export default function ProgramPage({
  onDonateProgram,
}: ProgramPageProps) {
  const [
    activeFilter,
    setActiveFilter,
  ] = useState("Semua");

  /*
  |--------------------------------------------------------------------------
  | Data
  |--------------------------------------------------------------------------
  */

  const [programs, setPrograms] =
    useState<Program[]>([]);

  const [campaigns, setCampaigns] =
    useState<Campaign[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Fetch
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          programResponse,
          campaignResponse,
        ] = await Promise.all([
          api.get<ProgramResponse>(
            "/programs"
          ),

          api.get<CampaignResponse>(
            "/campaigns"
          ),
        ]);

        /*
        |--------------------------------------------------------------------------
        | Program
        |--------------------------------------------------------------------------
        */

        if (!programResponse.success) {
          throw new Error(
            programResponse.message ||
              "Gagal mengambil data program."
          );
        }

        const programData =
          Array.isArray(
            programResponse.data
          )
            ? programResponse.data
            : [];

        const sortedPrograms =
          [...programData].sort(
            (a, b) =>
              Number(
                a.sort_order ?? 0
              ) -
              Number(
                b.sort_order ?? 0
              )
          );

        setPrograms(
          sortedPrograms
        );

        /*
        |--------------------------------------------------------------------------
        | Campaign
        |--------------------------------------------------------------------------
        */

        if (!campaignResponse.success) {
          throw new Error(
            campaignResponse.message ||
              "Gagal mengambil kampanye."
          );
        }

        let campaignData: Campaign[] =
          [];

        if (
          Array.isArray(
            campaignResponse.data
          )
        ) {
          campaignData =
            campaignResponse.data;
        } else if (
          campaignResponse.data &&
          Array.isArray(
            campaignResponse.data.data
          )
        ) {
          campaignData =
            campaignResponse.data.data;
        }

        const publishedCampaigns =
          campaignData.filter(
            (campaign) =>
              !campaign.status ||
              campaign.status ===
                "published"
          );

        setCampaigns(
          publishedCampaigns
        );
      } catch (error) {
        console.error(
          "PROGRAM PAGE ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Filter Program
  |--------------------------------------------------------------------------
  */

  const filteredPrograms =
    useMemo(() => {
      if (
        activeFilter === "Semua"
      ) {
        return programs;
      }

      return programs.filter(
        (program) =>
          getProgramCategory(
            program
          ) === activeFilter
      );
    }, [
      programs,
      activeFilter,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Filter Campaign
  |--------------------------------------------------------------------------
  */

  const filteredCampaigns =
    useMemo(() => {
      if (
        activeFilter === "Semua"
      ) {
        return campaigns;
      }

      return campaigns.filter(
        (campaign) =>
          campaign.category ===
          activeFilter
      );
    }, [
      campaigns,
      activeFilter,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] pt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#F58220] border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-gray-500">
            Mengambil data program
            dan kampanye...
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-[#FFF8F2]">

      {/* ================================================================
          HEADER
      ================================================================= */}

      <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] text-white py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-sm mb-3 opacity-80">
            <span>Beranda</span>

            <span className="mx-2">
              /
            </span>

            <span>
              Program & Kampanye
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Program & Kampanye
          </h1>

          <p className="mt-4 text-lg opacity-90 max-w-2xl">
            Berbagai program dan
            kampanye LAZISMU Pemalang
            untuk memberikan manfaat
            nyata kepada masyarakat.
          </p>
        </div>
      </div>

      {/* ================================================================
          ERROR
      ================================================================= */}

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-5 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* ================================================================
          6 PILAR
      ================================================================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-2 bg-[#F58220] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
            Pilar Utama
          </div>

          <h2
            className="text-3xl font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            6 Pilar Program Unggulan
          </h2>

          <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Setiap pilar mewakili
            komitmen LAZISMU Pemalang
            dalam pemberdayaan
            masyarakat secara
            menyeluruh dan
            berkelanjutan.
          </p>
        </div>

        {programs.length === 0 ? (
          <div className="bg-white border border-[#F3DEC8] rounded-2xl p-8 text-center">
            <p className="text-gray-500 text-sm">
              Belum ada program yang
              dipublikasikan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">

            {programs
              .slice(0, 6)
              .map((program) => {
                const category =
                  getProgramCategory(
                    program
                  );

                return (
                  <div
                    key={program.id}
                    className="bg-white border border-[#F3DEC8] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#F58220] transition-all group"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FEF0E4] rounded-xl mb-4 text-2xl group-hover:bg-[#F58220]/20 transition-colors">
                      <span>
                        {getProgramIcon(
                          category
                        )}
                      </span>
                    </div>

                    <div
                      className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full mb-3 ${getCategoryColor(
                        category
                      )}`}
                    >
                      {category}
                    </div>

                    <h3
                      className="font-bold text-gray-900 mb-2 text-sm"
                      style={{
                        fontFamily:
                          "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {program.title}
                    </h3>

                    <p className="text-xs text-gray-500 leading-relaxed">
                      {program.excerpt ||
                        "Informasi program LAZISMU Pemalang."}
                    </p>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* ================================================================
          FILTER
      ================================================================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">

        <div className="flex flex-wrap gap-3">

          {filters.map(
            (filter) => (
              <button
                key={filter}
                type="button"
                onClick={() =>
                  setActiveFilter(
                    filter
                  )
                }
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeFilter ===
                  filter
                    ? "bg-[#F58220] text-white shadow-md"
                    : "bg-white border border-[#F3DEC8] text-gray-600 hover:border-[#F58220] hover:text-[#F58220]"
                }`}
              >
                {filter}
              </button>
            )
          )}

        </div>
      </div>

      {/* ================================================================
          PROGRAM
      ================================================================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        <div className="mb-8 mt-8">

          <div className="inline-flex items-center gap-2 bg-[#F58220] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-3">
            Program
          </div>

          <h2
            className="text-3xl font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Program Unggulan
          </h2>

          <p className="text-sm text-gray-500 mt-2 max-w-2xl">
            Program pemberdayaan
            LAZISMU Pemalang yang
            dijalankan sesuai pilar
            pelayanan masyarakat.
          </p>
        </div>

        {filteredPrograms.length ===
        0 ? (
          <div className="bg-white border border-[#F3DEC8] rounded-2xl p-8 text-center">
            <p className="text-gray-500 text-sm">
              Belum ada program untuk
              kategori ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredPrograms.map(
              (program) => {
                const category =
                  getProgramCategory(
                    program
                  );

                return (
                  <div
                    key={program.id}
                    className="bg-white border border-[#F3DEC8] rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
                  >

                    {/* Image */}

                    <div className="relative h-48 bg-[#FEF0E4] overflow-hidden">

                      {program.thumbnail ? (
                        <img
                          src={
                            program.thumbnail
                          }
                          alt={
                            program.title
                          }
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FEF0E4] to-[#FFF8F2]">

                          <div className="text-5xl mb-3">
                            {getProgramIcon(
                              category
                            )}
                          </div>

                          <span className="text-xs font-semibold text-[#F58220]">
                            LAZISMU
                            Pemalang
                          </span>

                        </div>
                      )}

                      {program.thumbnail && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      )}

                      <span
                        className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1.5 rounded-full ${getCategoryColor(
                          category
                        )}`}
                      >
                        {category}
                      </span>
                    </div>

                    {/* Content */}

                    <div className="p-5 flex flex-col flex-1">

                      <h3
                        className="font-bold text-gray-900 mb-3"
                        style={{
                          fontFamily:
                            "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {program.title}
                      </h3>

                      <p className="text-sm text-gray-500 leading-relaxed flex-1">
                        {program.excerpt ||
                          "Informasi program LAZISMU Pemalang."}
                      </p>

                      {program.published_at && (
                        <div className="mt-5 pt-4 border-t border-[#F3DEC8] text-xs text-gray-400">
                          Program dipublikasikan
                          oleh LAZISMU Pemalang
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            )}

          </div>
        )}
      </div>

      {/* ================================================================
          CAMPAIGN
      ================================================================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-2 bg-[#F58220] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
            Kampanye
          </div>

          <h2
            className="text-3xl font-bold text-gray-900"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Kampanye Kebaikan
          </h2>

          <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Dukung kampanye aktif
            LAZISMU Pemalang dan
            bersama-sama wujudkan
            manfaat bagi masyarakat.
          </p>
        </div>

        {filteredCampaigns.length ===
        0 ? (
          <div className="bg-white border border-[#F3DEC8] rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">
              🤲
            </div>

            <p className="text-gray-500 text-sm">
              Belum ada kampanye aktif
              untuk kategori ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {filteredCampaigns.map(
              (campaign) => {
                const collected =
                  Number(
                    campaign.collected_amount ??
                      0
                  );

                const target =
                  Number(
                    campaign.target_amount ??
                      0
                  );

                const progress =
                  calculateProgress(
                    collected,
                    target
                  );

                const category =
                  campaign.category ||
                  "Kampanye";

                return (
                  <div
                    key={campaign.id}
                    className="bg-white border border-[#F3DEC8] rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                  >

                    {/* Image */}

                    <div className="relative h-48 bg-[#FEF0E4] overflow-hidden">

                      {campaign.image ? (
                        <img
                          src={
                            campaign.image
                          }
                          alt={
                            campaign.title
                          }
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FEF0E4] to-[#FFF8F2]">

                          <div className="text-center">
                            <div className="text-5xl mb-2">
                              🤲
                            </div>

                            <div className="text-xs font-semibold text-[#F58220]">
                              LAZISMU
                              Pemalang
                            </div>
                          </div>

                        </div>
                      )}

                      {campaign.image && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      )}

                      <span
                        className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${getCategoryColor(
                          category
                        )}`}
                      >
                        {category}
                      </span>
                    </div>

                    {/* Content */}

                    <div className="p-4 flex flex-col flex-1">

                      <h3
                        className="font-bold text-gray-900 mb-2 text-sm"
                        style={{
                          fontFamily:
                            "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {campaign.title}
                      </h3>

                      <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-1 line-clamp-3">
                        {campaign.description ||
                          "Kampanye kebaikan LAZISMU Pemalang."}
                      </p>

                      {/* Progress */}

                      <div className="space-y-2 mb-4">

                        <div className="flex justify-between text-xs text-gray-500">
                          <span>
                            Terkumpul
                          </span>

                          <span className="font-semibold text-[#F58220]">
                            {progress}%
                          </span>
                        </div>

                        <div className="w-full bg-gray-100 rounded-full h-2">

                          <div
                            className="bg-[#F58220] h-2 rounded-full transition-all"
                            style={{
                              width: `${progress}%`,
                            }}
                          />

                        </div>

                        <div className="flex justify-between gap-2 text-xs">

                          <span className="text-gray-500">
                            {formatRupiah(
                              collected
                            )}
                          </span>

                          {target > 0 && (
                            <span className="text-gray-400 text-right">
                              dari{" "}
                              {formatRupiah(
                                target
                              )}
                            </span>
                          )}

                        </div>
                      </div>

                      {/* Donor */}

                      {campaign.donor_count !==
                        undefined &&
                        campaign.donor_count !==
                          null && (
                          <div className="text-xs text-gray-400 mb-4">
                            {
                              campaign.donor_count
                            }{" "}
                            donatur
                          </div>
                        )}

                      {/* Donate */}

                      <button
                        type="button"
                        className="btn-primary w-full py-2.5 text-sm font-semibold rounded-xl mt-auto"
                        onClick={() =>
                          onDonateProgram?.(
                            campaign.title
                          )
                        }
                      >
                        Donasi Sekarang
                      </button>
                    </div>
                  </div>
                );
              }
            )}

          </div>
        )}
      </div>
    </div>
  );
}