import { useEffect, useMemo, useState } from "react";
import { useInView } from "../../hooks/useInView";
import type { NavPage } from "../../App";
import { api } from "../../services/api";
import { getNewsThumbnailUrl } from "../../service/news.service";

interface NewsSectionProps {
  onNavigate: (page: NavPage) => void;
}

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  thumbnail?: string | null;
  category?: string | null;
  status?: string | null;
  published_at?: string | null;
  views?: number | null;
}

interface NewsResponse {
  success: boolean;
  message?: string;
  data: NewsItem[];
}

const categories = [
  "Semua",
  "Kegiatan",
  "Pengumuman",
  "Laporan",
];

function formatDate(
  date?: string | null
) {
  if (!date) {
    return "-";
  }

  const parsed = new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(parsed);
}

function getCategoryColor(
  category?: string | null
) {
  const value =
    category?.toLowerCase() ?? "";

  if (
    value.includes("kegiatan")
  ) {
    return "bg-blue-100 text-blue-700";
  }

  if (
    value.includes("pengumuman")
  ) {
    return "bg-yellow-100 text-yellow-700";
  }

  if (
    value.includes("laporan")
  ) {
    return "bg-green-100 text-green-700";
  }

  return "bg-gray-100 text-gray-700";
}

function NewsCard({
  article,
  featured = false,
  onNavigate,
}: {
  article: NewsItem;
  featured?: boolean;
  onNavigate: (page: NavPage) => void;
}) {
  if (featured) {
    return (
      <div
        onClick={() =>
          onNavigate("berita")
        }
        className="card-hover bg-white rounded-2xl overflow-hidden border border-[#F3DEC8] shadow-sm lg:col-span-2 flex flex-col lg:flex-row cursor-pointer"
      >
        <div className="relative lg:w-1/2 h-56 lg:h-auto bg-orange-50 overflow-hidden flex-shrink-0">
          {article.thumbnail ? (
            <img
              src={getNewsThumbnailUrl(article.thumbnail) || ""}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FEF0E4] to-[#FFF8F2]">
              <div className="text-center">
                <div className="text-5xl mb-2">
                  📰
                </div>

                <div className="text-xs font-semibold text-[#F58220]">
                  LAZISMU Pemalang
                </div>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          <span className="absolute top-3 left-3 text-xs font-bold px-3 py-1.5 bg-[#F58220] text-white rounded-full">
            Terbaru
          </span>
        </div>

        <div className="p-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getCategoryColor(
                  article.category
                )}`}
              >
                {article.category ||
                  "Berita"}
              </span>

              <span className="text-xs text-gray-400">
                {formatDate(
                  article.published_at
                )}
              </span>

              {article.views !==
                undefined &&
                article.views !==
                null && (
                  <span className="text-xs text-gray-400">
                    ·{" "}
                    {
                      article.views
                    }{" "}
                    dilihat
                  </span>
                )}
            </div>

            <h3
              className="text-xl font-bold text-gray-800 mb-3 leading-snug"
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {article.title}
            </h3>

            <p className="text-gray-500 text-sm leading-relaxed">
              {article.excerpt ||
                "Informasi terbaru dari LAZISMU Pemalang."}
            </p>
          </div>

          <div
            className="flex items-center gap-2 text-[#F58220] text-sm font-semibold mt-5 hover:gap-3 transition-all duration-200"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Baca Selengkapnya

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
    );
  }

  return (
    <div
      onClick={() =>
        onNavigate("berita")
      }
      className="card-hover bg-white rounded-2xl overflow-hidden border border-[#F3DEC8] shadow-sm flex flex-col cursor-pointer"
    >
      <div className="relative h-44 bg-orange-50 overflow-hidden">
        {article.thumbnail ? (
          <img
            src={getNewsThumbnailUrl(article.thumbnail) || ""}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FEF0E4] to-[#FFF8F2]">
            <div className="text-center">
              <div className="text-4xl mb-2">
                📰
              </div>

              <div className="text-xs font-semibold text-[#F58220]">
                LAZISMU Pemalang
              </div>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getCategoryColor(
              article.category
            )}`}
          >
            {article.category ||
              "Berita"}
          </span>

          <span className="text-xs text-gray-400">
            {formatDate(
              article.published_at
            )}
          </span>
        </div>

        <h3
          className="font-bold text-gray-800 text-sm leading-snug mb-2 flex-1"
          style={{
            fontFamily:
              "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {article.title}
        </h3>

        <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
          {article.excerpt ||
            "Informasi terbaru dari LAZISMU Pemalang."}
        </p>

        <div
          className="flex items-center gap-1.5 text-[#F58220] text-xs font-semibold"
          style={{
            fontFamily:
              "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Baca Selengkapnya

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
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function NewsSection({
  onNavigate,
}: NewsSectionProps) {
  const [
    activeCategory,
    setActiveCategory,
  ] = useState("Semua");

  const { inView, ref } =
    useInView();

  const [items, setItems] =
    useState<NewsItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchNews =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await api.get<NewsResponse>(
              "/news"
            );

          if (!response.success) {
            throw new Error(
              response.message ||
              "Gagal mengambil berita."
            );
          }

          const data =
            Array.isArray(
              response.data
            )
              ? response.data
              : [];

          const published =
            data.filter(
              (item) =>
                !item.status ||
                item.status ===
                "published"
            );

          setItems(
            published.slice(
              0,
              6
            )
          );
        } catch (error) {
          console.error(
            "NEWS ERROR:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "Gagal mengambil berita."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchNews();
  }, []);

  const filtered =
    useMemo(() => {
      if (
        activeCategory ===
        "Semua"
      ) {
        return items;
      }

      return items.filter(
        (item) =>
          item.category ===
          activeCategory
      );
    }, [
      items,
      activeCategory,
    ]);

  return (
    <section
      id="news"
      className="py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div
          ref={
            ref as React.RefObject<HTMLDivElement>
          }
          className={`flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 transition-all duration-700 ${inView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
            }`}
        >
          <div>
            <span className="text-[#F58220] text-sm font-semibold uppercase tracking-wider">
              Berita
            </span>

            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2"
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Kabar Terkini
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(
              (category) => (
                <button
                  key={
                    category
                  }
                  type="button"
                  onClick={() =>
                    setActiveCategory(
                      category
                    )
                  }
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory ===
                    category
                    ? "bg-[#F58220] text-white"
                    : "bg-[#FEF0E4] text-gray-600 hover:bg-[#F58220] hover:text-white"
                    }`}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </div>

        {loading && (
          <div className="py-12 text-center">
            <div className="w-9 h-9 border-4 border-[#F58220] border-t-transparent rounded-full animate-spin mx-auto mb-3" />

            <p className="text-sm text-gray-400">
              Mengambil berita...
            </p>
          </div>
        )}

        {!loading &&
          error && (
            <div className="max-w-xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          filtered.length ===
          0 && (
            <div className="max-w-xl mx-auto bg-[#FFF8F2] border border-[#F3DEC8] rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">
                📰
              </div>

              <p className="font-semibold text-gray-700 mb-1">
                Belum ada berita
              </p>

              <p className="text-sm text-gray-400">
                Belum ada berita
                pada kategori ini.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          filtered.length >
          0 && (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 delay-200 ${inView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                }`}
            >
              {filtered.map(
                (
                  article,
                  index
                ) => (
                  <NewsCard
                    key={
                      article.id
                    }
                    article={
                      article
                    }
                    featured={
                      index ===
                      0 &&
                      activeCategory ===
                      "Semua"
                    }
                    onNavigate={
                      onNavigate
                    }
                  />
                )
              )}
            </div>
          )}

        <div className="flex justify-center mt-10">
          <button
            type="button"
            onClick={() =>
              onNavigate(
                "berita"
              )
            }
            className="border-2 border-[#F58220] text-[#F58220] hover:bg-[#F58220] hover:text-white transition-all duration-200 px-6 py-3 rounded-xl font-semibold text-sm"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Semua Berita →
          </button>
        </div>
      </div>
    </section>
  );
}