import { useEffect, useState } from "react";
import { useInView } from "../../hooks/useInView";
import type { NavPage } from "../../App";
import { api } from "../../services/api";
import { getNewsThumbnailUrl } from "../../service/news.service";

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

interface NewsSectionProps {
  onNavigate: (page: NavPage) => void;
  onOpenContent?: (
    type: "berita" | "artikel",
    id: number
  ) => void;
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

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function formatDate(date?: string | null): string {
  if (!date) {
    return "-";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

/*
|--------------------------------------------------------------------------
| NEWS CARD
|--------------------------------------------------------------------------
*/

interface NewsCardProps {
  article: NewsItem;
  featured?: boolean;
  onOpenContent?: (
    type: "berita" | "artikel",
    id: number
  ) => void;
}

function NewsCard({
  article,
  featured = false,
  onOpenContent,
}: NewsCardProps) {
  const thumbnail = article.thumbnail
    ? getNewsThumbnailUrl(article.thumbnail)
    : null;

  const handleOpenNews = () => {
    onOpenContent?.("berita", article.id);
  };

  /*
  |--------------------------------------------------------------------------
  | FEATURED CARD
  |--------------------------------------------------------------------------
  */

  if (featured) {
    return (
      <article
        onClick={handleOpenNews}
        className="
          group
          relative
          cursor-pointer
          overflow-hidden
          rounded-[28px]
          border
          border-[#F1D9C1]
          bg-white
          shadow-[0_10px_35px_rgba(120,70,30,0.08)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-[0_20px_50px_rgba(120,70,30,0.14)]
          lg:col-span-2
          lg:flex
        "
      >
        {/* IMAGE */}

        <div
          className="
            relative
            h-64
            overflow-hidden
            bg-[#FEF0E4]
            lg:h-auto
            lg:w-1/2
            lg:min-h-[340px]
          "
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={article.title}
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-700
                group-hover:scale-105
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                min-h-[260px]
                w-full
                items-center
                justify-center
                bg-gradient-to-br
                from-[#FFF0E4]
                via-[#FFF8F2]
                to-[#FFE5CD]
              "
            >
              <div className="text-center">
                <div
                  className="
                    mx-auto
                    mb-3
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-4xl
                    shadow-sm
                  "
                >
                  📰
                </div>

                <div
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-[#F58220]
                  "
                >
                  Lazismu Pemalang
                </div>
              </div>
            </div>
          )}

          {/* IMAGE OVERLAY */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/45
              via-black/5
              to-transparent
            "
          />

          {/* TERBARU */}

          <span
            className="
              absolute
              left-5
              top-5
              rounded-full
              bg-[#F58220]
              px-3.5
              py-1.5
              text-xs
              font-bold
              text-white
              shadow-lg
            "
          >
            Terbaru
          </span>
        </div>

        {/* CONTENT */}

        <div
          className="
            flex
            flex-1
            flex-col
            justify-between
            p-7
            sm:p-8
          "
        >
          <div>
            {/* DATE */}

            <div className="mb-4 flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {formatDate(article.published_at)}
              </span>

              {article.views !== undefined &&
                article.views !== null && (
                  <span className="text-xs text-gray-400">
                    · {article.views} dilihat
                  </span>
                )}
            </div>

            {/* TITLE */}

            <h3
              className="
                mb-4
                text-xl
                font-bold
                leading-snug
                text-gray-900
                transition-colors
                duration-200
                group-hover:text-[#F58220]
                sm:text-2xl
              "
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {article.title}
            </h3>

            {/* EXCERPT */}

            <p
              className="
                line-clamp-4
                text-sm
                leading-7
                text-gray-500
              "
            >
              {article.excerpt ||
                "Informasi terbaru dari Lazismu Pemalang."}
            </p>
          </div>

          {/* READ MORE */}

          <div
            className="
              mt-7
              flex
              items-center
              gap-2
              text-sm
              font-bold
              text-[#F58220]
            "
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            <span>Baca Selengkapnya</span>

            <svg
              className="
                h-4
                w-4
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
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
      </article>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | NORMAL CARD
  |--------------------------------------------------------------------------
  */

  return (
    <article
      onClick={handleOpenNews}
      className="
        group
        flex
        h-full
        cursor-pointer
        flex-col
        overflow-hidden
        rounded-[26px]
        border
        border-[#F1D9C1]
        bg-white
        shadow-[0_8px_28px_rgba(120,70,30,0.06)]
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-[#F58220]/30
        hover:shadow-[0_18px_40px_rgba(120,70,30,0.12)]
      "
    >
      {/* IMAGE */}

      <div
        className="
          relative
          h-48
          overflow-hidden
          bg-[#FEF0E4]
        "
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={article.title}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              bg-gradient-to-br
              from-[#FFF0E4]
              via-[#FFF8F2]
              to-[#FFE5CD]
            "
          >
            <div className="text-center">
              <div
                className="
                  mx-auto
                  mb-2
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-3xl
                  shadow-sm
                "
              >
                📰
              </div>

              <div
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-[#F58220]
                "
              >
                Lazismu Pemalang
              </div>
            </div>
          </div>
        )}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/25
            via-transparent
            to-transparent
          "
        />
      </div>

      {/* CONTENT */}

      <div className="flex flex-1 flex-col p-5">
        {/* DATE */}

        <div className="mb-3 flex items-center gap-2">
          <span className="text-[11px] text-gray-400">
            {formatDate(article.published_at)}
          </span>
        </div>

        {/* TITLE */}

        <h3
          className="
            mb-2
            line-clamp-2
            text-sm
            font-bold
            leading-6
            text-gray-800
            transition-colors
            duration-200
            group-hover:text-[#F58220]
          "
          style={{
            fontFamily:
              "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {article.title}
        </h3>

        {/* EXCERPT */}

        <p
          className="
            mb-5
            line-clamp-2
            text-xs
            leading-6
            text-gray-400
          "
        >
          {article.excerpt ||
            "Informasi terbaru dari Lazismu Pemalang."}
        </p>

        {/* READ MORE */}

        <div
          className="
            mt-auto
            flex
            items-center
            gap-1.5
            text-xs
            font-bold
            text-[#F58220]
          "
          style={{
            fontFamily:
              "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <span>Baca Selengkapnya</span>

          <svg
            className="
              h-3.5
              w-3.5
              transition-transform
              duration-200
              group-hover:translate-x-1
            "
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
    </article>
  );
}

/*
|--------------------------------------------------------------------------
| NEWS SECTION
|--------------------------------------------------------------------------
*/

export default function NewsSection({
  onNavigate,
  onOpenContent,
}: NewsSectionProps) {
  const { inView, ref } = useInView();

  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | FETCH NEWS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<NewsResponse>("/news");

        if (!response.success) {
          throw new Error(
            response.message ||
              "Gagal mengambil berita."
          );
        }

        const data = Array.isArray(response.data)
          ? response.data
          : [];

        const published = data.filter(
          (item) =>
            !item.status ||
            item.status === "published"
        );

        setItems(published.slice(0, 6));
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

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section
      id="news"
      className="
        relative
        overflow-hidden
        bg-gradient-to-br
        from-[#FFF9F4]
        via-[#FFF1E5]
        to-[#FFE4CC]
        py-20
        sm:py-24
      "
    >
      {/* BACKGROUND DECORATION */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-40
          -top-40
          h-[430px]
          w-[430px]
          rounded-full
          bg-[#F58220]/10
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-[-120px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#F58220]/10
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-[320px]
          w-[320px]
          rounded-full
          border-2
          border-[#F58220]/10
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-10
          top-[-60px]
          h-[210px]
          w-[210px]
          rounded-full
          border-2
          border-[#F58220]/10
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-8
          top-40
          h-24
          w-24
          opacity-25
        "
        style={{
          backgroundImage:
            "radial-gradient(#F58220 1.5px, transparent 1.5px)",
          backgroundSize: "12px 12px",
        }}
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-24
          right-12
          h-24
          w-24
          opacity-20
        "
        style={{
          backgroundImage:
            "radial-gradient(#F58220 1.5px, transparent 1.5px)",
          backgroundSize: "12px 12px",
        }}
      />

      {/* CONTENT */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* HEADER */}

        <div
          ref={ref as any}
          className={`
            mb-10
            flex
            flex-col
            gap-6
            transition-all
            duration-700
            ${
              inView
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }
          `}
        >
          <div>
            <div
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#F58220]/15
                bg-white/80
                px-4
                py-2
                shadow-sm
                backdrop-blur-sm
              "
            >
              <span
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  bg-[#FFF0E4]
                  text-xs
                  font-bold
                  text-[#F58220]
                "
              >
                ✦
              </span>

              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-[#F58220]
                "
              >
                Berita & Informasi
              </span>
            </div>

            <h2
              className="
                text-3xl
                font-bold
                text-gray-900
                sm:text-4xl
              "
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Kabar Terkini
            </h2>

            <div
              className="
                mt-4
                h-1
                w-14
                rounded-full
                bg-gradient-to-r
                from-[#F58220]
                to-[#D96808]
              "
            />
          </div>
        </div>

        {/* DESCRIPTION */}

        <div
          className={`
            mb-10
            max-w-2xl
            transition-all
            duration-700
            delay-100
            ${
              inView
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }
          `}
        >
          <p className="text-sm leading-7 text-gray-600 sm:text-base">
            Ikuti kabar terbaru dari Lazismu
            Pemalang dalam menjalankan berbagai
            program kebaikan untuk masyarakat.
          </p>
        </div>

        {/* LOADING */}

        {loading && (
          <div
            className="
              rounded-[28px]
              border
              border-[#F1D9C1]
              bg-white/80
              py-14
              text-center
              shadow-sm
              backdrop-blur-sm
            "
          >
            <div
              className="
                mx-auto
                mb-4
                h-10
                w-10
                animate-spin
                rounded-full
                border-4
                border-[#F58220]
                border-t-transparent
              "
            />

            <p className="text-sm font-medium text-gray-500">
              Mengambil berita...
            </p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div
            className="
              mx-auto
              max-w-xl
              rounded-[28px]
              border
              border-red-200
              bg-red-50
              p-7
              text-center
              shadow-sm
            "
          >
            <div
              className="
                mx-auto
                mb-4
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-red-100
                text-xl
                font-bold
                text-red-500
              "
            >
              !
            </div>

            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          items.length === 0 && (
            <div
              className="
                mx-auto
                max-w-xl
                rounded-[28px]
                border
                border-[#F1D9C1]
                bg-white/80
                p-10
                text-center
                shadow-sm
                backdrop-blur-sm
              "
            >
              <div
                className="
                  mx-auto
                  mb-4
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-[#FFF0E4]
                  text-3xl
                "
              >
                📰
              </div>

              <p className="mb-2 font-bold text-gray-800">
                Belum ada berita
              </p>

              <p className="text-sm leading-6 text-gray-400">
                Belum ada berita yang tersedia.
              </p>
            </div>
          )}

        {/* NEWS */}

        {!loading &&
          !error &&
          items.length > 0 && (
            <div
              className={`
                grid
                grid-cols-1
                gap-6
                transition-all
                duration-700
                delay-200
                sm:grid-cols-2
                lg:grid-cols-4
                ${
                  inView
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }
              `}
            >
              {items.map(
                (article, index) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    featured={index === 0}
                    onOpenContent={
                      onOpenContent
                    }
                  />
                )
              )}
            </div>
          )}

        {/* ALL NEWS */}

        <div className="mt-12 flex flex-col items-center">
          <p className="mb-3 text-xs font-medium text-gray-500">
            Ikuti informasi terbaru kami
          </p>

          <button
            type="button"
            onClick={() =>
              onNavigate("berita")
            }
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-xl
              border-2
              border-[#F58220]
              bg-white/90
              px-7
              py-3
              text-sm
              font-semibold
              text-[#F58220]
              shadow-sm
              backdrop-blur-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-[#F58220]
              hover:text-white
              hover:shadow-lg
            "
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Semua Berita

            <span
              className="
                transition-transform
                duration-200
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}