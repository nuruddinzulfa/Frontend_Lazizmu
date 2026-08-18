import { useEffect, useMemo, useState } from "react";

import {
  getAdminNews,
  type News,
} from "@/service/news.service";

import {
  getAdminArticles,
  type Article,
} from "@/service/article.service";

import {
  getAdminReports,
  type FinancialReport,
} from "@/service/report.service";

import { api } from "@/services/api";

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

interface Program {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  pillar?: string | null;
  sort_order?: number | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface ProgramResponse {
  success: boolean;
  message?: string;
  data: Program[];
}

interface Campaign {
  id: number;
  title: string;
  slug: string;
  category?: string | null;
  status?: string;
  featured?: boolean | number;
  created_at?: string;
  updated_at?: string;
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

interface Banner {
  id: number;
  title: string;
  status?: string;
  sort_order?: number | null;
  created_at?: string;
  updated_at?: string;
}

interface BannerResponse {
  success: boolean;
  message?: string;
  data: Banner[];
}

interface ContentItem {
  id: number;
  title: string;
  type:
    | "Berita"
    | "Artikel";
  views: number;
  status: string;
  date: string | null;
}

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function formatDate(
  date?: string | null
) {
  if (!date) {
    return "-";
  }

  return new Date(
    date
  ).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function normalizeCampaignData(
  response: CampaignResponse
): Campaign[] {
  if (
    Array.isArray(
      response.data
    )
  ) {
    return response.data;
  }

  if (
    response.data &&
    Array.isArray(
      response.data.data
    )
  ) {
    return response.data.data;
  }

  return [];
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized =
    status.toLowerCase();

  const className =
    normalized ===
      "published" ||
    normalized === "active"
      ? "bg-green-100 text-green-700"
      : normalized === "draft"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-gray-100 text-gray-600";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {status}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function ContentDashboard() {
  const [news, setNews] =
    useState<News[]>([]);

  const [
    articles,
    setArticles,
  ] =
    useState<Article[]>([]);

  const [
    reports,
    setReports,
  ] =
    useState<
      FinancialReport[]
    >([]);

  const [
    programs,
    setPrograms,
  ] =
    useState<Program[]>([]);

  const [
    campaigns,
    setCampaigns,
  ] =
    useState<Campaign[]>([]);

  const [
    banners,
    setBanners,
  ] =
    useState<Banner[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | FETCH
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          newsData,
          articleData,
          reportData,
          programResponse,
          campaignResponse,
          bannerResponse,
        ] = await Promise.all([
          getAdminNews(),

          getAdminArticles(),

          getAdminReports(),

          api.get<ProgramResponse>(
            "/programs"
          ),

          api.get<CampaignResponse>(
            "/campaigns"
          ),

          api.get<BannerResponse>(
            "/banners"
          ),
        ]);

        if (!mounted) {
          return;
        }

        setNews(newsData);
        setArticles(
          articleData
        );
        setReports(reportData);

        setPrograms(
          programResponse.success &&
            Array.isArray(
              programResponse.data
            )
            ? programResponse.data
            : []
        );

        setCampaigns(
          campaignResponse.success
            ? normalizeCampaignData(
                campaignResponse
              )
            : []
        );

        setBanners(
          bannerResponse.success &&
            Array.isArray(
              bannerResponse.data
            )
            ? bannerResponse.data
            : []
        );
      } catch (err) {
        console.error(
          "CONTENT DASHBOARD ERROR:",
          err
        );

        if (!mounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil data dashboard."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SUMMARY
  |--------------------------------------------------------------------------
  */

  const publishedNews =
    news.filter(
      (item) =>
        item.status ===
        "published"
    ).length;

  const draftNews =
    news.filter(
      (item) =>
        item.status === "draft"
    ).length;

  const publishedArticles =
    articles.filter(
      (item) =>
        item.status ===
        "published"
    ).length;

  const draftArticles =
    articles.filter(
      (item) =>
        item.status === "draft"
    ).length;

  const publishedReports =
    reports.filter(
      (item) =>
        item.status ===
        "published"
    ).length;

  const draftReports =
    reports.filter(
      (item) =>
        item.status === "draft"
    ).length;

  const activeCampaigns =
    campaigns.filter(
      (campaign) =>
        !campaign.status ||
        campaign.status ===
          "published"
    ).length;

  const activeBanners =
    banners.filter(
      (banner) =>
        !banner.status ||
        banner.status ===
          "active"
    ).length;

  const totalDraft =
    draftNews +
    draftArticles +
    draftReports;

  const totalPublished =
    publishedNews +
    publishedArticles +
    publishedReports;

  const totalManaged =
    news.length +
    articles.length +
    reports.length;

  /*
  |--------------------------------------------------------------------------
  | CONTENT PERFORMANCE
  |--------------------------------------------------------------------------
  */

  const contentItems =
    useMemo<ContentItem[]>(
      () => {
        const newsItems: ContentItem[] =
          news.map(
            (item) => ({
              id: item.id,
              title:
                item.title,
              type:
                "Berita",
              views:
                Number(
                  item.views ??
                    0
                ),
              status:
                item.status,
              date:
                item.published_at ??
                item.updated_at ??
                item.created_at,
            })
          );

        const articleItems: ContentItem[] =
          articles.map(
            (item) => ({
              id: item.id,
              title:
                item.title,
              type:
                "Artikel",
              views:
                Number(
                  item.views ??
                    0
                ),
              status:
                item.status,
              date:
                item.published_at ??
                item.updated_at ??
                item.created_at,
            })
          );

        return [
          ...newsItems,
          ...articleItems,
        ];
      },
      [news, articles]
    );

  const mostViewed =
    useMemo(
      () =>
        [
          ...contentItems,
        ]
          .sort(
            (a, b) =>
              b.views -
              a.views
          )
          .slice(0, 5),
      [contentItems]
    );

  const latestContents =
    useMemo(
      () =>
        [
          ...contentItems,
        ]
          .sort(
            (a, b) => {
              const dateA =
                a.date
                  ? new Date(
                      a.date
                    ).getTime()
                  : 0;

              const dateB =
                b.date
                  ? new Date(
                      b.date
                    ).getTime()
                  : 0;

              return (
                dateB -
                dateA
              );
            }
          )
          .slice(0, 6),
      [contentItems]
    );

  const draftContents =
    useMemo(
      () =>
        contentItems
          .filter(
            (item) =>
              item.status ===
              "draft"
          )
          .slice(0, 6),
      [contentItems]
    );

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#F58220] border-t-transparent" />

          <p className="text-sm text-gray-500">
            Memuat dashboard
            konten...
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard Admin
          Konten
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Ringkasan konten
          website LAZISMU
          Pemalang berdasarkan
          data backend.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          <p className="font-semibold">
            Sebagian data gagal
            dimuat
          </p>

          <p className="mt-1">
            {error}
          </p>
        </div>
      )}

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

        <SummaryCard
          label="Total Berita"
          value={news.length}
          description={`${publishedNews} published`}
        />

        <SummaryCard
          label="Total Artikel"
          value={
            articles.length
          }
          description={`${publishedArticles} published`}
        />

        <SummaryCard
          label="Program Publik"
          value={
            programs.length
          }
          description="Tersedia di website"
        />

        <SummaryCard
          label="Campaign Aktif"
          value={
            activeCampaigns
          }
          description="Campaign published"
          valueClass="text-green-600"
        />

        <SummaryCard
          label="Total Laporan"
          value={
            reports.length
          }
          description={`${publishedReports} published`}
        />

        <SummaryCard
          label="Banner Aktif"
          value={
            activeBanners
          }
          description="Banner website"
          valueClass="text-[#F58220]"
        />

      </div>

      {/* STATUS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        <div className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-base font-bold text-gray-900">
            Status Konten
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Status berita,
            artikel, dan laporan
            yang dikelola admin.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <StatusCard
              label="Published"
              value={
                totalPublished
              }
              description="Sudah tampil"
            />

            <StatusCard
              label="Draft"
              value={
                totalDraft
              }
              description="Belum dipublikasikan"
            />

            <StatusCard
              label="Total Dikelola"
              value={
                totalManaged
              }
              description="Berita, artikel & laporan"
            />

          </div>
        </div>

        {/* BREAKDOWN */}
        <div className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">

          <h2 className="text-base font-bold text-gray-900">
            Ringkasan Draft
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Konten yang masih
            perlu ditinjau.
          </p>

          <div className="mt-6 space-y-4">

            <BreakdownRow
              label="Berita"
              value={
                draftNews
              }
            />

            <BreakdownRow
              label="Artikel"
              value={
                draftArticles
              }
            />

            <BreakdownRow
              label="Laporan"
              value={
                draftReports
              }
            />

          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Total Draft
              </span>

              <span className="text-lg font-bold text-yellow-600">
                {totalDraft}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* PERFORMANCE */}
      <div className="overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">

        <div className="border-b border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-900">
            Performa Berita &
            Artikel
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Konten berdasarkan
            jumlah views tertinggi.
          </p>
        </div>

        {mostViewed.length ===
        0 ? (
          <EmptyState text="Belum ada data berita atau artikel." />
        ) : (
          <>
            {/* DESKTOP */}
            <div className="hidden overflow-x-auto md:block">

              <table className="w-full text-sm">

                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Konten
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Tipe
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Views
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">

                  {mostViewed.map(
                    (item) => (
                      <tr
                        key={`${item.type}-${item.id}`}
                        className="hover:bg-orange-50/40"
                      >
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {
                            item.title
                          }
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                            {
                              item.type
                            }
                          </span>
                        </td>

                        <td className="px-5 py-4 font-semibold text-gray-900">
                          {item.views.toLocaleString(
                            "id-ID"
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={
                              item.status
                            }
                          />
                        </td>
                      </tr>
                    )
                  )}

                </tbody>
              </table>
            </div>

            {/* MOBILE */}
            <div className="divide-y divide-gray-50 md:hidden">

              {mostViewed.map(
                (item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="space-y-3 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">

                      <p className="text-sm font-medium text-gray-900">
                        {
                          item.title
                        }
                      </p>

                      <StatusBadge
                        status={
                          item.status
                        }
                      />

                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        {
                          item.type
                        }
                      </span>

                      <span className="font-semibold">
                        {item.views.toLocaleString(
                          "id-ID"
                        )}{" "}
                        views
                      </span>
                    </div>
                  </div>
                )
              )}

            </div>
          </>
        )}
      </div>

      {/* LATEST */}
      <div className="overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">

        <div className="border-b border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-900">
            Konten Terbaru
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Berita dan artikel
            terbaru berdasarkan
            data backend.
          </p>
        </div>

        {latestContents.length ===
        0 ? (
          <EmptyState text="Belum ada konten." />
        ) : (
          <div className="divide-y divide-gray-50">

            {latestContents.map(
              (item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium text-gray-900">
                      {
                        item.title
                      }
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      <span>
                        {
                          item.type
                        }
                      </span>

                      <span>
                        •
                      </span>

                      <span>
                        {formatDate(
                          item.date
                        )}
                      </span>
                    </div>

                  </div>

                  <StatusBadge
                    status={
                      item.status
                    }
                  />

                </div>
              )
            )}

          </div>
        )}
      </div>

      {/* DRAFT */}
      <div className="overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">

        <div className="border-b border-gray-100 p-5">

          <h2 className="text-base font-bold text-gray-900">
            Draft yang Perlu
            Diperhatikan
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Berita dan artikel
            yang belum
            dipublikasikan.
          </p>

        </div>

        {draftContents.length ===
        0 ? (
          <EmptyState text="Tidak ada draft berita atau artikel." />
        ) : (
          <div className="divide-y divide-gray-50">

            {draftContents.map(
              (item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >

                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium text-gray-900">
                      {
                        item.title
                      }
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">

                      <span>
                        {
                          item.type
                        }
                      </span>

                      <span>
                        •
                      </span>

                      <span>
                        {formatDate(
                          item.date
                        )}
                      </span>

                    </div>
                  </div>

                  <StatusBadge status="draft" />

                </div>
              )
            )}

          </div>
        )}
      </div>

      {/* WEBSITE SUMMARY */}
      <div className="rounded-xl border border-orange-100 bg-white shadow-sm">

        <div className="border-b border-gray-100 p-5">

          <h2 className="text-base font-bold text-gray-900">
            Ringkasan Website
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Data publik yang
            sedang tersedia di
            website LAZISMU
            Pemalang.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">

          <WebsiteItem
            title="Program"
            value={
              programs.length
            }
          />

          <WebsiteItem
            title="Campaign Aktif"
            value={
              activeCampaigns
            }
          />

          <WebsiteItem
            title="Banner Aktif"
            value={
              activeBanners
            }
          />

        </div>

      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| SUB COMPONENTS
|--------------------------------------------------------------------------
*/

function SummaryCard({
  label,
  value,
  description,
  valueClass = "text-gray-900",
}: {
  label: string;
  value: number;
  description: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${valueClass}`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {description}
      </p>
    </div>
  );
}

function StatusCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-[#FFF8F2] p-5">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {description}
      </p>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">
        {label}
      </span>

      <span className="font-semibold text-gray-900">
        {value}
      </span>
    </div>
  );
}

function WebsiteItem({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <p className="text-sm font-semibold text-gray-900">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-[#F58220]">
        {value}
      </p>
    </div>
  );
}

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="p-8 text-center text-sm text-gray-400">
      {text}
    </div>
  );
}