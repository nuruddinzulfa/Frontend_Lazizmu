import { useEffect, useState } from "react";
import { useInView } from "../../hooks/useInView";
import type { NavPage } from "../../App";
import { api } from "../../services/api";

interface FeaturedCampaignsProps {
  onNavigate: (page: NavPage) => void;
}

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
  days_left?: number | null;

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
| Format Rupiah
|--------------------------------------------------------------------------
*/

function formatRupiah(
  value: number | string | null | undefined
): string {
  const number = Number(value ?? 0);

  if (!Number.isFinite(number)) {
    return "Rp 0";
  }

  if (number >= 1_000_000_000) {
    return `Rp ${(number / 1_000_000_000)
      .toFixed(1)
      .replace(".0", "")} M`;
  }

  if (number >= 1_000_000) {
    return `Rp ${(number / 1_000_000)
      .toFixed(1)
      .replace(".0", "")} jt`;
  }

  if (number >= 1_000) {
    return `Rp ${Math.round(
      number / 1_000
    )} rb`;
  }

  return `Rp ${number.toLocaleString("id-ID")}`;
}

/*
|--------------------------------------------------------------------------
| Category Color
|--------------------------------------------------------------------------
*/

function getCategoryColor(category?: string | null) {
  const value =
    category?.toLowerCase() ?? "";

  if (value.includes("pendidikan")) {
    return "bg-blue-100 text-blue-700";
  }

  if (
    value.includes("ekonomi") ||
    value.includes("umkm")
  ) {
    return "bg-green-100 text-green-700";
  }

  if (
    value.includes("dakwah") ||
    value.includes("keagamaan") ||
    value.includes("masjid")
  ) {
    return "bg-purple-100 text-purple-700";
  }

  if (
    value.includes("kesehatan")
  ) {
    return "bg-red-100 text-red-700";
  }

  if (
    value.includes("kemanusiaan") ||
    value.includes("sosial")
  ) {
    return "bg-orange-100 text-orange-700";
  }

  return "bg-gray-100 text-gray-700";
}

/*
|--------------------------------------------------------------------------
| Campaign Card
|--------------------------------------------------------------------------
*/

function CampaignCard({
  campaign,
  delay,
  onNavigate,
}: {
  campaign: Campaign;
  delay: number;
  onNavigate: (page: NavPage) => void;
}) {
  const [favorited, setFavorited] =
    useState(false);

  const collected = Number(
    campaign.collected_amount ?? 0
  );

  const target = Number(
    campaign.target_amount ?? 0
  );

  const percentage =
    target > 0
      ? Math.min(
          100,
          Math.round(
            (collected / target) * 100
          )
        )
      : 0;

  const category =
    campaign.category?.trim() ||
    "Kampanye";

  return (
    <div
      className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-[#F3DEC8] flex flex-col"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Image */}

      <div className="relative h-52 bg-orange-50 overflow-hidden">
        {campaign.image ? (
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#FEF0E4]">
            <div className="text-center">
              <div className="text-5xl mb-2">
                🤲
              </div>

              <p className="text-xs text-[#F58220] font-semibold">
                LAZISMU Pemalang
              </p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Category */}

        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryColor(
              category
            )}`}
          >
            {category}
          </span>
        </div>

        {/* Favorite */}

        <button
          type="button"
          onClick={() =>
            setFavorited(
              (current) => !current
            )
          }
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          aria-label="Favoritkan"
        >
          <svg
            className={`w-4 h-4 transition-colors ${
              favorited
                ? "text-red-500 fill-current"
                : "text-gray-400"
            }`}
            fill={
              favorited
                ? "currentColor"
                : "none"
            }
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Content */}

      <div className="p-5 flex flex-col flex-1">
        <h3
          className="font-bold text-gray-800 mb-3 line-clamp-2 leading-snug"
          style={{
            fontFamily:
              "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {campaign.title}
        </h3>

        {/* Progress */}

        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Progress</span>

            <span className="font-semibold text-[#F58220]">
              {percentage}%
            </span>
          </div>

          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F58220] to-[#D96D0A] rounded-full transition-all duration-500"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>

        {/* Amount */}

        <div className="flex justify-between items-end mb-4">
          <div>
            <div
              className="text-base font-bold text-gray-900"
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {formatRupiah(collected)}
            </div>

            {target > 0 && (
              <div className="text-xs text-gray-400">
                dari{" "}
                {formatRupiah(target)}
              </div>
            )}
          </div>
        </div>

        {/* Donor / Days */}

        <div className="flex items-center justify-between text-xs text-gray-400 mb-4 min-h-[20px]">
          {campaign.donor_count !==
          undefined &&
          campaign.donor_count !==
            null ? (
            <div className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

              <span>
                {campaign.donor_count.toLocaleString(
                  "id-ID"
                )}{" "}
                donatur
              </span>
            </div>
          ) : (
            <span />
          )}

          {campaign.days_left !==
            undefined &&
            campaign.days_left !==
              null &&
            campaign.days_left >= 0 && (
              <div className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <span>
                  {campaign.days_left}{" "}
                  hari lagi
                </span>
              </div>
            )}
        </div>

        {/* Donate */}

        <button
          type="button"
          onClick={() =>
            onNavigate("donasi")
          }
          className="btn-primary block w-full text-center py-2.5 text-sm font-semibold mt-auto"
        >
          Donasi Sekarang
        </button>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Featured Campaigns
|--------------------------------------------------------------------------
*/

export default function FeaturedCampaigns({
  onNavigate,
}: FeaturedCampaignsProps) {
  const { inView, ref } =
    useInView();

  const [
    campaigns,
    setCampaigns,
  ] = useState<Campaign[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Fetch API
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchCampaigns =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await api.get<CampaignResponse>(
              "/campaigns"
            );

          if (!response.success) {
            throw new Error(
              response.message ||
                "Gagal mengambil kampanye."
            );
          }

          let data: Campaign[] =
            [];

          if (
            Array.isArray(
              response.data
            )
          ) {
            data =
              response.data;
          } else if (
            response.data &&
            Array.isArray(
              response.data.data
            )
          ) {
            data =
              response.data.data;
          }

          /*
          |--------------------------------------------------------------------------
          | Hanya campaign published
          |--------------------------------------------------------------------------
          */

          const published =
            data.filter(
              (campaign) =>
                !campaign.status ||
                campaign.status ===
                  "published"
            );

          /*
          |--------------------------------------------------------------------------
          | Prioritaskan featured
          |--------------------------------------------------------------------------
          |
          | Kalau backend punya featured=true,
          | campaign tersebut ditampilkan lebih dulu.
          |
          */

          const featured =
            published.filter(
              (campaign) =>
                campaign.featured ===
                  true ||
                campaign.featured ===
                  1
            );

          if (
            featured.length > 0
          ) {
            setCampaigns(
              featured.slice(0, 3)
            );
          } else {
            /*
            |--------------------------------------------------------------------------
            | Kalau belum ada campaign featured,
            | tampilkan 3 campaign published pertama.
            |--------------------------------------------------------------------------
            */

            setCampaigns(
              published.slice(0, 3)
            );
          }
        } catch (error) {
          console.error(
            "FEATURED CAMPAIGN ERROR:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "Gagal mengambil kampanye."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchCampaigns();
  }, []);

  return (
    <section
      id="campaigns"
      className="py-20 bg-[#FFF8F2]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}

        <div
          ref={
            ref as React.RefObject<HTMLDivElement>
          }
          className={`text-center mb-12 transition-all duration-700 ${
            inView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-[#F58220] text-sm font-semibold uppercase tracking-wider">
            Kampanye
          </span>

          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Kampanye Unggulan
          </h2>

          <p className="text-gray-500 max-w-xl mx-auto">
            Pilih kampanye yang
            sesuai dengan niat
            kebaikan Anda. Setiap
            rupiah bernilai
            ibadah.
          </p>
        </div>

        {/* Loading */}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-9 h-9 border-4 border-[#F58220] border-t-transparent rounded-full animate-spin mb-3" />

            <p className="text-sm text-gray-400">
              Mengambil kampanye...
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
          campaigns.length === 0 && (
            <div className="max-w-xl mx-auto bg-white border border-[#F3DEC8] rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">
                🤲
              </div>

              <p className="font-semibold text-gray-700 mb-1">
                Belum ada kampanye
                aktif
              </p>

              <p className="text-sm text-gray-400">
                Kampanye akan
                ditampilkan setelah
                dipublikasikan oleh
                admin.
              </p>
            </div>
          )}

        {/* Campaign Cards */}

        {!loading &&
          !error &&
          campaigns.length > 0 && (
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {campaigns.map(
                (
                  campaign,
                  index
                ) => (
                  <CampaignCard
                    key={
                      campaign.id
                    }
                    campaign={
                      campaign
                    }
                    delay={
                      index * 100
                    }
                    onNavigate={
                      onNavigate
                    }
                  />
                )
              )}
            </div>
          )}

        {/* All Campaign */}

        <div className="text-center mt-10">
          <button
            type="button"
            onClick={() =>
              onNavigate(
                "program"
              )
            }
            className="border-2 border-[#F58220] text-[#F58220] hover:bg-[#F58220] hover:text-white transition-all duration-200 px-8 py-3 rounded-xl font-semibold text-sm"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Lihat Semua Kampanye →
          </button>
        </div>
      </div>
    </section>
  );
}