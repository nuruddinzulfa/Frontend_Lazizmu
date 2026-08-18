import { useEffect, useState } from "react";
import { useInView } from "../../hooks/useInView";
import type { NavPage } from "../../App";
import API_URL from "../../lib/api";

interface FeaturedCampaignsProps {
  onNavigate: (page: NavPage) => void;
}

interface Campaign {
  id: number;
  title: string;
  slug: string;
  category: string | null;
  short_description: string | null;
  description: string | null;
  thumbnail: string | null;
  target_amount: number | string;
  collected_amount: number | string;
  featured: boolean | number;
  urgent: boolean | number;
  status: "draft" | "published" | "closed";
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

interface CampaignResponse {
  success: boolean;
  message: string;
  data: Campaign[];
}

/*
|--------------------------------------------------------------------------
| FORMAT RUPIAH
|--------------------------------------------------------------------------
*/

function formatRupiah(
  value: number | string | null | undefined
): string {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return "Rp 0";
  }

  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000)
      .toFixed(1)
      .replace(".0", "")} M`;
  }

  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000)
      .toFixed(1)
      .replace(".0", "")} jt`;
  }

  if (amount >= 1_000) {
    return `Rp ${Math.round(
      amount / 1_000
    )} rb`;
  }

  return `Rp ${amount.toLocaleString(
    "id-ID"
  )}`;
}

/*
|--------------------------------------------------------------------------
| THUMBNAIL URL
|--------------------------------------------------------------------------
*/

function getThumbnailUrl(
  thumbnail: string | null
): string | null {
  if (!thumbnail) {
    return null;
  }

  if (
    thumbnail.startsWith("http://") ||
    thumbnail.startsWith("https://")
  ) {
    return thumbnail;
  }

  const baseUrl = API_URL.replace(
    /\/api\/?$/,
    ""
  );

  return `${baseUrl}/storage/${thumbnail.replace(
    /^\/+/,
    ""
  )}`;
}

/*
|--------------------------------------------------------------------------
| CATEGORY COLOR
|--------------------------------------------------------------------------
*/

function getCategoryColor(
  category: string | null
): string {
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

  if (value.includes("kesehatan")) {
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
| CAMPAIGN CARD
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

  const thumbnailUrl =
    getThumbnailUrl(
      campaign.thumbnail
    );

  const category =
    campaign.category?.trim() ||
    "Kampanye";

  return (
    <div
      className="card-hover flex flex-col overflow-hidden rounded-2xl border border-[#F3DEC8] bg-white shadow-sm"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {/* IMAGE */}

      <div className="relative h-52 overflow-hidden bg-orange-50">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={campaign.title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(event) => {
              console.error(
                "[FeaturedCampaigns] Gagal memuat gambar:",
                thumbnailUrl
              );

              event.currentTarget.style.display =
                "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#FEF0E4]">
            <div className="text-center">
              <div className="mb-2 text-5xl">
                🤲
              </div>

              <p className="text-xs font-semibold text-[#F58220]">
                LAZISMU Pemalang
              </p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* CATEGORY */}

        <div className="absolute left-3 top-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getCategoryColor(
              campaign.category
            )}`}
          >
            {category}
          </span>
        </div>

        {/* FAVORITE */}

        <button
          type="button"
          onClick={() =>
            setFavorited(
              (current) => !current
            )
          }
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-transform hover:scale-110"
          aria-label="Favoritkan campaign"
        >
          <svg
            className={`h-4 w-4 ${
              favorited
                ? "fill-current text-red-500"
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

      {/* CONTENT */}

      <div className="flex flex-1 flex-col p-5">
        <h3
          className="mb-3 line-clamp-2 font-bold leading-snug text-gray-800"
          style={{
            fontFamily:
              "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {campaign.title}
        </h3>

        {/* PROGRESS */}

        <div className="mb-3">
          <div className="mb-1.5 flex justify-between text-xs text-gray-500">
            <span>Progress</span>

            <span className="font-semibold text-[#F58220]">
              {percentage}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#F58220] to-[#D96D0A] transition-all duration-500"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>

        {/* AMOUNT */}

        <div className="mb-4 flex items-end justify-between">
          <div>
            <div
              className="text-base font-bold text-gray-900"
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {formatRupiah(
                collected
              )}
            </div>

            {target > 0 && (
              <div className="text-xs text-gray-400">
                dari{" "}
                {formatRupiah(target)}
              </div>
            )}
          </div>
        </div>

        {/* ACTION */}

        <button
          type="button"
          onClick={() =>
            onNavigate("donasi")
          }
          className="btn-primary mt-auto block w-full py-2.5 text-center text-sm font-semibold"
        >
          Donasi Sekarang
        </button>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| FEATURED CAMPAIGNS
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
  | FETCH CAMPAIGNS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchCampaigns =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await fetch(
              `${API_URL}/campaigns`,
              {
                method: "GET",
                headers: {
                  Accept:
                    "application/json",
                },
              }
            );

          const data: CampaignResponse =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Gagal mengambil kampanye."
            );
          }

          /*
          |--------------------------------------------------------------------------
          | HANYA PUBLISHED
          |--------------------------------------------------------------------------
          */

          const published =
            data.data.filter(
              (campaign) =>
                campaign.status ===
                "published"
            );

          /*
          |--------------------------------------------------------------------------
          | HANYA UNGGULAN
          |--------------------------------------------------------------------------
          |
          | featured = true
          |
          */

          const featured =
            published.filter(
              (campaign) =>
                campaign.featured ===
                  true ||
                campaign.featured === 1
            );

          /*
          |--------------------------------------------------------------------------
          | MAKSIMAL 3 CAMPAIGN
          |--------------------------------------------------------------------------
          */

          setCampaigns(
            featured.slice(0, 3)
          );
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
      className="bg-[#FFF8F2] py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HEADING */}

        <div
          ref={
            ref as React.RefObject<HTMLDivElement>
          }
          className={`mb-12 text-center transition-all duration-700 ${
            inView
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-[#F58220]">
            Kampanye
          </span>

          <h2
            className="mb-4 mt-2 text-3xl font-bold text-gray-900 sm:text-4xl"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Kampanye Unggulan
          </h2>

          <p className="mx-auto max-w-xl text-gray-500">
            Pilih kampanye yang
            sesuai dengan niat
            kebaikan Anda. Setiap
            rupiah bernilai
            ibadah.
          </p>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-3 h-9 w-9 animate-spin rounded-full border-4 border-[#F58220] border-t-transparent" />

            <p className="text-sm text-gray-400">
              Mengambil kampanye...
            </p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          campaigns.length === 0 && (
            <div className="mx-auto max-w-xl rounded-2xl border border-[#F3DEC8] bg-white p-8 text-center">
              <div className="mb-3 text-4xl">
                🤲
              </div>

              <p className="mb-1 font-semibold text-gray-700">
                Belum ada kampanye
                unggulan
              </p>

              <p className="text-sm text-gray-400">
                Tandai campaign sebagai
                unggulan melalui
                dashboard admin.
              </p>
            </div>
          )}

        {/* CAMPAIGN CARDS */}

        {!loading &&
          !error &&
          campaigns.length > 0 && (
            <div
              className={`grid grid-cols-1 gap-6 transition-all duration-700 delay-200 md:grid-cols-2 lg:grid-cols-3 ${
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
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

        {/* ALL CAMPAIGNS */}

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() =>
              onNavigate("program")
            }
            className="rounded-xl border-2 border-[#F58220] px-8 py-3 text-sm font-semibold text-[#F58220] transition-all duration-200 hover:bg-[#F58220] hover:text-white"
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