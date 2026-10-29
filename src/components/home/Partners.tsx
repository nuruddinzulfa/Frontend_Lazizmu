import { useEffect, useState } from "react";
import { useInView } from "../../hooks/useInView";
import { api } from "../../services/api";
import API_URL from "@/lib/api";

interface Partner {
  id: number;
  name: string;
  logo?: string | null;
  url?: string | null;
  sort_order?: number | null;
  status?: string;
}

interface PartnerResponse {
  success: boolean;
  message?: string;
  data: Partner[];
}

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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function Partners() {
  const { inView, ref } =
    useInView();

  const [
    partners,
    setPartners,
  ] = useState<Partner[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchPartners =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await api.get<PartnerResponse>(
              "/partners"
            );

          if (!response.success) {
            throw new Error(
              response.message ||
                "Gagal mengambil mitra."
            );
          }

          const data =
            Array.isArray(
              response.data
            )
              ? response.data
              : [];

          const activePartners =
            data
              .filter(
                (partner) =>
                  !partner.status ||
                  partner.status ===
                    "active"
              )
              .sort(
                (a, b) =>
                  Number(
                    a.sort_order ?? 0
                  ) -
                  Number(
                    b.sort_order ?? 0
                  )
              );

          setPartners(
            activePartners
          );
        } catch (error) {
          console.error(
            "PARTNERS ERROR:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "Gagal mengambil mitra."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchPartners();
  }, []);

  return (
    <section className="landing-section landing-section--surface landing-section--compact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div
          ref={
            ref as React.RefObject<HTMLDivElement>
          }
          className={`text-center mb-10 transition-all duration-700 ${
            inView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <span className="text-gray-400 text-sm font-medium">
            Didukung & bermitra
            dengan
          </span>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-[#EA6113] border-t-transparent rounded-full animate-spin mb-3" />

            <p className="text-sm text-gray-400">
              Mengambil data mitra...
            </p>
          </div>
        )}

        {!loading &&
          error && (
            <div className="max-w-xl mx-auto bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          partners.length ===
            0 && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">
                Belum ada mitra
                aktif.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          partners.length >
            0 && (
            <div
              className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 transition-all duration-700 delay-200 ${
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              {partners.map(
                (partner) => {
                  const logo =
                    getStorageUrl(
                      partner.logo
                    );

                  const content = (
                    <div className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-[#FFF8EA] transition-colors duration-200 group h-full">

                      <div className="w-16 h-16 rounded-xl bg-gray-100 group-hover:bg-[#FFE3B3] transition-colors flex items-center justify-center overflow-hidden">

                        {logo ? (
                          <img
                            src={logo}
                            alt={
                              partner.name
                            }
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <span
                            className="text-xs font-bold text-gray-400 group-hover:text-[#EA6113] transition-colors text-center leading-tight px-1"
                            style={{
                              fontFamily:
                                "'Fraunces', serif",
                            }}
                          >
                            {getInitials(
                              partner.name
                            )}
                          </span>
                        )}

                      </div>

                      <span className="text-xs text-gray-500 text-center leading-tight">
                        {partner.name}
                      </span>

                    </div>
                  );

                  if (
                    partner.url
                  ) {
                    return (
                      <a
                        key={
                          partner.id
                        }
                        href={
                          partner.url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <div
                      key={
                        partner.id
                      }
                    >
                      {content}
                    </div>
                  );
                }
              )}
            </div>
          )}
      </div>
    </section>
  );
}