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

/* =========================================================
   FORMAT RUPIAH
========================================================= */

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
    return `Rp ${Math.round(amount / 1_000)} rb`;
  }

  return `Rp ${amount.toLocaleString("id-ID")}`;
}

/* =========================================================
   THUMBNAIL URL
========================================================= */

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

  const baseUrl = API_URL.replace(/\/api\/?$/, "");

  return `${baseUrl}/storage/${thumbnail.replace(
    /^\/+/,
    ""
  )}`;
}

/* =========================================================
   CATEGORY STYLE
========================================================= */

function getCategoryColor(
  category: string | null
): string {
  const value = category?.toLowerCase() ?? "";

  if (value.includes("pendidikan")) {
    return "bg-blue-50 text-blue-700 border-blue-100";
  }

  if (
    value.includes("ekonomi") ||
    value.includes("umkm")
  ) {
    return "bg-green-50 text-green-700 border-green-100";
  }

  if (
    value.includes("dakwah") ||
    value.includes("keagamaan") ||
    value.includes("masjid")
  ) {
    return "bg-purple-50 text-purple-700 border-purple-100";
  }

  if (value.includes("kesehatan")) {
    return "bg-red-50 text-red-700 border-red-100";
  }

  if (
    value.includes("kemanusiaan") ||
    value.includes("sosial")
  ) {
    return "bg-orange-50 text-orange-700 border-orange-100";
  }

  return "bg-gray-50 text-gray-700 border-gray-100";
}

/* =========================================================
   CAMPAIGN CARD
========================================================= */

function CampaignCard({
  campaign,
  delay,
}: {
  campaign: Campaign;
  delay: number;
}) {
  const [favorited, setFavorited] = useState(false);

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

  const thumbnailUrl = getThumbnailUrl(
    campaign.thumbnail
  );

  const category =
    campaign.category?.trim() || "Campaign";

  /*
  |--------------------------------------------------------------------------
  | DONASI CAMPAIGN
  |--------------------------------------------------------------------------
  |
  | Jangan gunakan:
  |
  | onNavigate("donasi")
  |
  | karena itu hanya membuka halaman donasi tanpa mengetahui
  | campaign mana yang dipilih.
  |
  | Kita kirim ID campaign melalui query parameter.
  |
  | Contoh:
  |
  | /donasi?campaign=5
  |
  | DonationForm kemudian akan membaca campaign tersebut
  | dan langsung masuk ke Step 2.
  |
  */

  const handleDonate = () => {
    window.location.href = `/donasi?campaign=${campaign.id}`;
  };

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[#F1D9C1] bg-white shadow-[0_10px_35px_rgba(120,70,30,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(120,70,30,0.14)]"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {/* IMAGE */}

      <div className="relative h-56 overflow-hidden bg-[#FEF0E4]">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={campaign.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-sm">
                🤲
              </div>

              <p className="text-xs font-semibold text-[#F58220]">
                Lazismu Pemalang
              </p>
            </div>
          </div>
        )}

        {/* IMAGE OVERLAY */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />

        {/* CATEGORY */}

        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold backdrop-blur-sm ${getCategoryColor(
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
            setFavorited((current) => !current)
          }
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 shadow-sm backdrop-blur transition-all duration-200 hover:scale-110 hover:bg-white"
          aria-label="Favoritkan campaign"
        >
          <svg
            className={`h-5 w-5 ${
              favorited
                ? "fill-current text-red-500"
                : "text-gray-500"
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

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3
          className="mb-2 line-clamp-2 text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#F58220]"
          style={{
            fontFamily:
              "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {campaign.title}
        </h3>

        {campaign.short_description && (
          <p className="mb-5 line-clamp-2 text-sm leading-6 text-gray-500">
            {campaign.short_description}
          </p>
        )}

        <div className="mt-auto">
          {/* PROGRESS */}

          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-gray-500">
              Progress donasi
            </span>

            <span className="font-bold text-[#F58220]">
              {percentage}%
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-[#F5E9DE]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#F58220] via-[#F47716] to-[#D96808] transition-all duration-700"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>

          {/* AMOUNT */}

          <div className="mt-4 flex items-end justify-between">
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
                <div className="mt-0.5 text-xs text-gray-400">
                  dari {formatRupiah(target)}
                </div>
              )}
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF1E5] text-[#F58220] transition-transform duration-300 group-hover:translate-x-1">
              →
            </div>
          </div>

          {/* BUTTON */}

          <button
            type="button"
            onClick={handleDonate}
            className="btn-primary mt-5 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
          >
            Donasi Sekarang
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   FEATURED CAMPAIGNS
========================================================= */

export default function FeaturedCampaigns({
  onNavigate,
}: FeaturedCampaignsProps) {
  const { inView, ref } = useInView();

  const [campaigns, setCampaigns] =
    useState<Campaign[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  /* =======================================================
     FETCH CAMPAIGNS
  ======================================================= */

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/campaigns`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data: CampaignResponse =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Gagal mengambil campaign."
          );
        }

        const published =
          data.data.filter(
            (campaign) =>
              campaign.status ===
              "published"
          );

        const featured =
          published.filter(
            (campaign) =>
              campaign.featured === true ||
              campaign.featured === 1
          );

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
            : "Gagal mengambil campaign."
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
      className="relative overflow-hidden bg-gradient-to-br from-[#FFF9F4] via-[#FFF1E5] to-[#FFE1C4] py-20 sm:py-24"
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[430px] w-[430px] rounded-full bg-[#F58220]/15 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-[#F58220]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-200px] left-[30%] h-[450px] w-[450px] rounded-full bg-[#FFAD63]/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-[320px] w-[320px] rounded-full border-2 border-[#F58220]/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-[-70px] h-[210px] w-[210px] rounded-full border-2 border-[#F58220]/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-[300px] w-[300px] rounded-full border-2 border-[#F58220]/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-8 top-28 h-28 w-28 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(#F58220 1.5px, transparent 1.5px)",
          backgroundSize: "12px 12px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 right-12 h-24 w-24 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(#F58220 1.5px, transparent 1.5px)",
          backgroundSize: "12px 12px",
        }}
      />

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
          className={`mb-12 text-center transition-all duration-700 ${
            inView
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F58220]/15 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFF0E4] text-xs font-bold text-[#F58220]">
              ✦
            </span>

            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#F58220]">
              Program Kebaikan
            </span>
          </div>

          <h2
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Campaign Unggulan
          </h2>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-[#F58220] to-[#D96808]" />

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            Pilih campaign yang sesuai
            dengan niat kebaikan Anda.
            Bersama Lazismu, setiap
            donasi menjadi manfaat bagi
            mereka yang membutuhkan.
          </p>
        </div>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <div className="relative overflow-hidden rounded-3xl border border-[#F1D9C1] bg-white/80 py-16 text-center shadow-sm backdrop-blur-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#F58220] border-t-transparent" />

            <p className="text-sm font-medium text-gray-500">
              Mengambil campaign...
            </p>
          </div>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {!loading && error && (
          <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-red-50 p-7 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-500">
              !
            </div>

            <p className="text-sm font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* ===================================================
            EMPTY
        =================================================== */}

        {!loading &&
          !error &&
          campaigns.length === 0 && (
            <div className="mx-auto max-w-xl rounded-3xl border border-[#F1D9C1] bg-white/90 p-10 text-center shadow-sm backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0E4] text-3xl">
                🤲
              </div>

              <p className="mb-2 font-bold text-gray-800">
                Belum ada campaign
                unggulan
              </p>

              <p className="text-sm leading-6 text-gray-400">
                Tandai campaign sebagai
                unggulan melalui dashboard
                admin.
              </p>
            </div>
          )}

        {/* ===================================================
            CAMPAIGN CARDS
        =================================================== */}

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
                (campaign, index) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    delay={index * 100}
                  />
                )
              )}
            </div>
          )}

        {/* ===================================================
            ALL CAMPAIGNS
        =================================================== */}

        <div className="mt-12 flex flex-col items-center">
          <p className="mb-3 text-xs font-medium text-gray-500">
            Temukan lebih banyak
            program kebaikan
          </p>

          <button
            type="button"
            onClick={() =>
              onNavigate("program")
            }
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-[#F58220] bg-white/90 px-7 py-3 text-sm font-semibold text-[#F58220] shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F58220] hover:text-white hover:shadow-lg"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Lihat Semua Campaign

            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}