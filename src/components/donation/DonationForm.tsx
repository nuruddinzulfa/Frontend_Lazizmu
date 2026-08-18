import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import API_URL from "@/lib/api";

interface DonasiPageProps {
  initialZakatAmount?: number;
  initialProgram?: string;
}

interface Campaign {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  target_amount?: number | string | null;
  collected_amount?: number | string | null;
  donor_count?: number | null;
  category?: string | null;
  status?: string;
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

interface DonationResponse {
  success: boolean;
  message: string;
  data: {
    donation: {
      id: number;
      campaign_id: number;
      order_id: string;
      donor_name: string;
      amount: number;
      anonymous: boolean;
      payment_status: string;
      created_at: string;
    };

    campaign?: {
      id: number;
      title: string;
      slug: string;
    };

    snap_token?: string;
    redirect_url?: string;
  };
}

interface StoredDonation {
  donationId?: number;
  orderId?: string;
  campaignId?: number;
  amount?: number;
  donorName?: string;
  campaignTitle?: string;
}

function formatRupiah(
  value: number | string | null | undefined
) {
  const number = Number(value ?? 0);

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(number) ? number : 0);
}

function formatNumberInput(value: string) {
  const clean = value.replace(/\D/g, "");

  if (!clean) {
    return "";
  }

  return Number(clean).toLocaleString("id-ID");
}

function parseNumber(value: string) {
  const number = Number(
    value
      .replace(/\./g, "")
      .replace(/[^\d]/g, "")
  );

  return Number.isFinite(number) ? number : 0;
}

function normalizePhone(phone: string) {
  let clean = phone.replace(/\D/g, "");

  if (clean.startsWith("62")) {
    return clean;
  }

  if (clean.startsWith("0")) {
    clean = clean.substring(1);
  }

  return `62${clean}`;
}

function getCampaignImageUrl(
  image: string | null | undefined
): string | null {
  if (!image) {
    return null;
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  const cleanImage = image
    .replace(/^\/+/, "")
    .replace(/^storage\//, "");

  const backendUrl =
    API_URL.replace(/\/api\/?$/, "");

  return `${backendUrl}/storage/${cleanImage}`;
}

export default function DonationForm({
  initialZakatAmount,
  initialProgram,
}: DonasiPageProps) {
  /*
  |--------------------------------------------------------------------------
  | Midtrans Redirect
  |--------------------------------------------------------------------------
  */

  const queryParams = useMemo(
    () =>
      new URLSearchParams(
        window.location.search
      ),
    []
  );

  const transactionStatus =
    queryParams.get(
      "transaction_status"
    );

  const statusCode =
    queryParams.get("status_code");

  const returnedOrderId =
    queryParams.get("order_id");

  const isPaymentSuccess =
    transactionStatus === "settlement" ||
    transactionStatus === "capture";

  const isPaymentPending =
    transactionStatus === "pending";

  const isPaymentFailed =
    transactionStatus === "deny" ||
    transactionStatus === "cancel" ||
    transactionStatus === "expire" ||
    transactionStatus === "failure";

  /*
  |--------------------------------------------------------------------------
  | Last Donation
  |--------------------------------------------------------------------------
  */

  const lastDonation =
    useMemo<StoredDonation | null>(() => {
      try {
        const stored =
          sessionStorage.getItem(
            "lastDonation"
          );

        if (!stored) {
          return null;
        }

        return JSON.parse(
          stored
        ) as StoredDonation;
      } catch {
        return null;
      }
    }, []);

  /*
  |--------------------------------------------------------------------------
  | Campaign
  |--------------------------------------------------------------------------
  */

  const [campaigns, setCampaigns] =
    useState<Campaign[]>([]);

  const [
    campaignLoading,
    setCampaignLoading,
  ] = useState(true);

  const [
    campaignError,
    setCampaignError,
  ] = useState("");

  const [
    campaignId,
    setCampaignId,
  ] = useState<number | null>(
    null
  );

  /*
  |--------------------------------------------------------------------------
  | Donor
  |--------------------------------------------------------------------------
  */

  const [name, setName] =
    useState("");

  const [
    isAnonymous,
    setIsAnonymous,
  ] = useState(false);

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Amount
  |--------------------------------------------------------------------------
  */

  const [
    selectedAmount,
    setSelectedAmount,
  ] = useState<number | null>(
    initialZakatAmount &&
      initialZakatAmount > 0
      ? initialZakatAmount
      : null
  );

  const [
    customAmount,
    setCustomAmount,
  ] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Process
  |--------------------------------------------------------------------------
  */

  const [step, setStep] =
    useState<1 | 2 | 3>(
      initialZakatAmount &&
        initialZakatAmount > 0
        ? 2
        : 1
    );

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    submitError,
    setSubmitError,
  ] = useState("");

  const presets = [
    10_000,
    25_000,
    50_000,
    100_000,
    250_000,
    500_000,
  ];

  const amount =
    selectedAmount !== null
      ? selectedAmount
      : parseNumber(
          customAmount
        );

  const selectedCampaign =
    useMemo(
      () =>
        campaigns.find(
          (campaign) =>
            campaign.id ===
            campaignId
        ) ?? null,
      [campaigns, campaignId]
    );

  const displayName =
    isAnonymous
      ? "Hamba Allah"
      : name.trim();

  /*
  |--------------------------------------------------------------------------
  | Fetch Campaign
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    /*
    |--------------------------------------------------------------------------
    | Kalau sedang kembali dari Midtrans,
    | tidak perlu fetch campaign.
    |--------------------------------------------------------------------------
    */

    if (
      isPaymentSuccess ||
      isPaymentPending ||
      isPaymentFailed
    ) {
      setCampaignLoading(false);
      return;
    }

    const fetchCampaigns =
      async () => {
        try {
          setCampaignLoading(
            true
          );

          setCampaignError("");

          const response =
            await api.get<CampaignResponse>(
              "/campaigns"
            );

          if (!response.success) {
            throw new Error(
              response.message ||
                "Gagal mengambil daftar program."
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

          setCampaigns(data);

          /*
          |--------------------------------------------------------------------------
          | Dari halaman program
          |--------------------------------------------------------------------------
          */

          if (
            data.length > 0 &&
            initialProgram
          ) {
            const keyword =
              initialProgram.toLowerCase();

            const match =
              data.find(
                (
                  campaign
                ) =>
                  campaign.title
                    ?.toLowerCase()
                    .includes(
                      keyword
                    ) ||
                  keyword.includes(
                    campaign.title?.toLowerCase() ??
                      ""
                  ) ||
                  campaign.slug
                    ?.toLowerCase()
                    .includes(
                      keyword.replace(
                        /\s+/g,
                        "-"
                      )
                    )
              );

            if (match) {
              setCampaignId(
                match.id
              );
            }
          }

          /*
          |--------------------------------------------------------------------------
          | Dari kalkulator zakat
          |--------------------------------------------------------------------------
          */

          if (
            data.length > 0 &&
            initialZakatAmount &&
            initialZakatAmount >
              0
          ) {
            const zakatCampaign =
              data.find(
                (
                  campaign
                ) =>
                  campaign.title
                    ?.toLowerCase()
                    .includes(
                      "zakat"
                    ) ||
                  campaign.slug
                    ?.toLowerCase()
                    .includes(
                      "zakat"
                    )
              );

            if (
              zakatCampaign
            ) {
              setCampaignId(
                zakatCampaign.id
              );
            }
          }
        } catch (error) {
          console.error(
            "CAMPAIGN ERROR:",
            error
          );

          setCampaignError(
            error instanceof
              Error
              ? error.message
              : "Gagal mengambil daftar program."
          );
        } finally {
          setCampaignLoading(
            false
          );
        }
      };

    fetchCampaigns();
  }, [
    initialProgram,
    initialZakatAmount,
    isPaymentSuccess,
    isPaymentPending,
    isPaymentFailed,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Custom Amount
  |--------------------------------------------------------------------------
  */

  const handleCustomAmount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedAmount(null);

    setCustomAmount(
      formatNumberInput(
        event.target.value
      )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Anonymous
  |--------------------------------------------------------------------------
  */

  const handleAnonymous =
    () => {
      setIsAnonymous(
        (current) =>
          !current
      );

      if (!isAnonymous) {
        setName("");
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  const validateStepTwo =
    () => {
      if (!campaignId) {
        setSubmitError(
          "Program donasi belum dipilih."
        );

        return false;
      }

      if (
        !isAnonymous &&
        !name.trim()
      ) {
        setSubmitError(
          "Nama donatur wajib diisi."
        );

        return false;
      }

      if (!phone.trim()) {
        setSubmitError(
          "Nomor WhatsApp wajib diisi."
        );

        return false;
      }

      if (!email.trim()) {
        setSubmitError(
          "Email wajib diisi."
        );

        return false;
      }

      if (
        !email.includes("@")
      ) {
        setSubmitError(
          "Format email tidak valid."
        );

        return false;
      }

      if (amount < 1000) {
        setSubmitError(
          "Nominal donasi minimal Rp1.000."
        );

        return false;
      }

      setSubmitError("");

      return true;
    };

  /*
  |--------------------------------------------------------------------------
  | Submit Donation
  |--------------------------------------------------------------------------
  */

  const handleSubmit =
    async (
      event: React.FormEvent
    ) => {
      event.preventDefault();

      if (
        !validateStepTwo()
      ) {
        return;
      }

      if (!campaignId) {
        return;
      }

      try {
        setIsSubmitting(true);

        setSubmitError("");

        const response =
          await api.post<DonationResponse>(
            "/donations",
            {
              campaign_id:
                campaignId,

              donor_name:
                displayName,

              email:
                email.trim(),

              phone:
                normalizePhone(
                  phone
                ),

              amount,

              message: null,

              anonymous:
                isAnonymous,
            }
          );

        if (
          !response.success
        ) {
          throw new Error(
            response.message ||
              "Gagal membuat transaksi donasi."
          );
        }

        sessionStorage.setItem(
          "lastDonation",
          JSON.stringify({
            donationId:
              response.data
                .donation.id,

            orderId:
              response.data
                .donation
                .order_id,

            campaignId,

            campaignTitle:
              selectedCampaign?.title,

            donorName:
              displayName,

            amount:
              response.data
                .donation
                .amount,
          })
        );

        /*
        |--------------------------------------------------------------------------
        | Redirect Midtrans
        |--------------------------------------------------------------------------
        */

        if (
          response.data
            .redirect_url
        ) {
          window.location.href =
            response.data
              .redirect_url;

          return;
        }

        if (
          response.data
            .snap_token
        ) {
          throw new Error(
            "Transaksi berhasil dibuat, tetapi URL pembayaran Midtrans tidak tersedia."
          );
        }

        throw new Error(
          "Backend tidak mengembalikan metode pembayaran Midtrans."
        );
      } catch (error) {
        console.error(
          "DONATION ERROR:",
          error
        );

        setSubmitError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat membuat donasi."
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Kembali ke Website
  |--------------------------------------------------------------------------
  */

  const handleBackHome =
    () => {
      sessionStorage.removeItem(
        "lastDonation"
      );

      window.history.replaceState(
        {},
        "",
        "/"
      );

      window.location.href =
        "/";
    };

  /*
  |--------------------------------------------------------------------------
  | Donasi Lagi
  |--------------------------------------------------------------------------
  */

  const handleDonateAgain =
    () => {
      sessionStorage.removeItem(
        "lastDonation"
      );

      window.history.replaceState(
        {},
        "",
        "/donasi"
      );

      window.location.href =
        "/donasi";
    };

  /*
  |--------------------------------------------------------------------------
  | PAYMENT SUCCESS
  |--------------------------------------------------------------------------
  */

  if (isPaymentSuccess) {
    const successOrderId =
      returnedOrderId ||
      lastDonation?.orderId ||
      "-";

    const successAmount =
      lastDonation?.amount;

    return (
      <div className="min-h-screen bg-[#FFF8F2] pt-20 px-4 flex items-center justify-center relative overflow-hidden">
        {/* Decorative */}

        <div className="absolute top-28 left-[10%] w-36 h-36 rounded-full bg-[#F58220]/5 blur-2xl" />

        <div className="absolute bottom-20 right-[10%] w-44 h-44 rounded-full bg-green-500/5 blur-2xl" />

        <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl border border-[#F3DEC8] shadow-xl overflow-hidden">

          {/* Header */}

          <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 islamic-geo-bg opacity-20" />

            <div className="relative z-10">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={
                        2.8
                      }
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <div className="inline-flex items-center bg-white/20 border border-white/30 rounded-full px-4 py-2 text-xs text-white font-semibold mb-4">
                ✓ Pembayaran Berhasil
              </div>

              <h1
                className="text-3xl sm:text-4xl font-bold text-white"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Jazakumullahu
                Khairan
              </h1>
            </div>
          </div>

          {/* Content */}

          <div className="p-7 sm:p-9 text-center">
            <p className="text-gray-600 leading-relaxed mb-6">
              Terima kasih telah
              menunaikan kebaikan
              melalui{" "}
              <strong className="text-[#F58220]">
                LAZISMU Pemalang
              </strong>
              .
            </p>

            <p className="text-gray-500 text-sm leading-relaxed mb-7">
              Pembayaran Anda
              telah berhasil
              diterima. Semoga
              setiap kebaikan
              yang ditunaikan
              menjadi amal yang
              bermanfaat dan
              membawa keberkahan.
            </p>

            {/* Transaction */}

            <div className="bg-[#FFF8F2] border border-[#F3DEC8] rounded-2xl p-5 mb-6 text-left space-y-4">
              <div className="flex justify-between gap-5 text-sm">
                <span className="text-gray-400">
                  Status
                </span>

                <span className="font-bold text-green-600">
                  Pembayaran
                  Berhasil
                </span>
              </div>

              {successAmount !==
                undefined && (
                <div className="flex justify-between gap-5 text-sm">
                  <span className="text-gray-400">
                    Total Donasi
                  </span>

                  <span className="font-bold text-[#F58220]">
                    {formatRupiah(
                      successAmount
                    )}
                  </span>
                </div>
              )}

              {lastDonation?.campaignTitle && (
                <div className="flex justify-between gap-5 text-sm">
                  <span className="text-gray-400">
                    Program
                  </span>

                  <span className="font-semibold text-gray-700 text-right max-w-[65%]">
                    {
                      lastDonation.campaignTitle
                    }
                  </span>
                </div>
              )}

              <div className="border-t border-[#F3DEC8]" />

              <div>
                <div className="text-xs text-gray-400 mb-1">
                  Nomor
                  Transaksi
                </div>

                <div className="font-mono text-xs sm:text-sm font-semibold text-gray-700 break-all">
                  {successOrderId}
                </div>
              </div>
            </div>

            {/* WA information */}

            <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-7 text-left">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">
                    ✓
                  </span>
                </div>

                <div>
                  <div className="font-semibold text-green-800 text-sm mb-1">
                    Konfirmasi
                    Donasi
                  </div>

                  <p className="text-xs sm:text-sm text-green-700 leading-relaxed">
                    Konfirmasi
                    pembayaran
                    akan dikirim
                    melalui
                    WhatsApp
                    sesuai nomor
                    yang Anda
                    masukkan saat
                    berdonasi.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Button */}

            <button
              type="button"
              onClick={
                handleBackHome
              }
              className="btn-primary w-full py-4 font-bold text-base mb-3"
              style={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Kembali ke Website
              →
            </button>

            <button
              type="button"
              onClick={
                handleDonateAgain
              }
              className="w-full py-3 text-sm font-semibold text-[#F58220] hover:text-[#D96D0A] hover:bg-[#FEF0E4] rounded-xl transition-all"
            >
              Donasi Lagi
            </button>

            <p className="text-[11px] text-gray-400 mt-6">
              LAZISMU Pemalang —
              Amanah, Profesional,
              Transparan
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PAYMENT PENDING
  |--------------------------------------------------------------------------
  */

  if (isPaymentPending) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] pt-20 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-[#F3DEC8] shadow-lg p-8 sm:p-10 text-center">

          <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">
              ⏳
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Menunggu
            Pembayaran
          </h1>

          <p className="text-gray-500 text-sm leading-relaxed mb-7">
            Transaksi Anda
            berhasil dibuat,
            tetapi pembayaran
            belum dikonfirmasi.
            Silakan selesaikan
            pembayaran sesuai
            instruksi Midtrans.
          </p>

          {returnedOrderId && (
            <div className="bg-[#FFF8F2] rounded-xl border border-[#F3DEC8] p-4 mb-6">
              <div className="text-xs text-gray-400 mb-1">
                Nomor Transaksi
              </div>

              <div className="font-mono text-sm font-semibold break-all">
                {
                  returnedOrderId
                }
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={
              handleBackHome
            }
            className="btn-primary w-full py-3.5 font-bold"
          >
            Kembali ke Website
          </button>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PAYMENT FAILED
  |--------------------------------------------------------------------------
  */

  if (isPaymentFailed) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] pt-20 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-[#F3DEC8] shadow-lg p-8 sm:p-10 text-center">

          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">
              ×
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Pembayaran Belum
            Berhasil
          </h1>

          <p className="text-gray-500 text-sm leading-relaxed mb-7">
            Pembayaran belum
            berhasil diproses.
            Anda dapat kembali
            ke halaman donasi
            untuk mencoba
            kembali.
          </p>

          {statusCode && (
            <p className="text-xs text-gray-400 mb-5">
              Status code:{" "}
              {statusCode}
            </p>
          )}

          <button
            type="button"
            onClick={
              handleDonateAgain
            }
            className="btn-primary w-full py-3.5 font-bold"
          >
            Coba Donasi Lagi
          </button>

          <button
            type="button"
            onClick={
              handleBackHome
            }
            className="w-full mt-3 py-3 text-sm text-gray-500 hover:text-[#F58220]"
          >
            Kembali ke Website
          </button>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Loading Campaign
  |--------------------------------------------------------------------------
  */

  if (campaignLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-9 h-9 border-4 border-[#F58220] border-t-transparent rounded-full animate-spin mx-auto mb-3" />

          <p className="text-sm text-gray-500">
            Mengambil program
            donasi...
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main Donation Form
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-20">

      {/* Header */}

      <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] relative overflow-hidden">
        <div className="absolute inset-0 islamic-geo-bg opacity-20" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-2 mb-5 text-white text-xs font-semibold">
            ❤️ Formulir Donasi
            — LAZISMU Pemalang
          </div>

          <h1
            className="text-3xl sm:text-4xl font-bold text-white mb-3"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Tunaikan Kebaikan
            Anda
          </h1>

          <p className="text-white/75 text-sm">
            Pilih program, isi
            data, kemudian
            lanjutkan pembayaran
            melalui Midtrans.
          </p>
        </div>
      </div>

      {/* Step Indicator */}

      <div className="bg-white border-b border-[#F3DEC8] sticky top-16 z-30">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex justify-center items-center gap-3">
            {[1, 2, 3].map(
              (number) => (
                <div
                  key={number}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step ===
                      number
                        ? "bg-[#F58220] text-white"
                        : step >
                          number
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {step >
                    number
                      ? "✓"
                      : number}
                  </div>

                  <span
                    className={`hidden sm:block text-xs font-semibold ${
                      step ===
                      number
                        ? "text-[#F58220]"
                        : "text-gray-400"
                    }`}
                  >
                    {number === 1
                      ? "Pilih Program"
                      : number ===
                        2
                      ? "Data & Nominal"
                      : "Konfirmasi"}
                  </span>

                  {number < 3 && (
                    <div
                      className={`w-10 h-px ${
                        step >
                        number
                          ? "bg-green-400"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form
          onSubmit={
            handleSubmit
          }
        >

          {/* STEP 1 */}

          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Pilih Tujuan
                Donasi
              </h2>

              <p className="text-gray-400 text-sm mb-6">
                Program di bawah
                diambil langsung
                dari database
                LAZISMU.
              </p>

              {campaignError && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm">
                  {
                    campaignError
                  }
                </div>
              )}

              {campaigns.length ===
              0 ? (
                <div className="bg-white border border-[#F3DEC8] rounded-2xl p-8 text-center">
                  <p className="text-gray-500">
                    Belum ada
                    program donasi
                    yang
                    dipublikasikan.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {campaigns.map(
                    (
                      campaign
                    ) => {
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

                      const percentage =
                        target > 0
                          ? Math.min(
                              100,
                              (collected /
                                target) *
                                100
                            )
                          : 0;

                      return (
                        <button
                          key={
                            campaign.id
                          }
                          type="button"
                          onClick={() =>
                            setCampaignId(
                              campaign.id
                            )
                          }
                          className={`text-left bg-white rounded-2xl overflow-hidden border-2 transition-all ${
                            campaignId ===
                            campaign.id
                              ? "border-[#F58220] ring-2 ring-[#F58220]/20"
                              : "border-[#F3DEC8] hover:border-[#F58220]"
                          }`}
                        >
                          <div className="h-40 bg-orange-50 overflow-hidden">
                            {getCampaignImageUrl(campaign.image) ? (
                              <img
                                src={
                                  getCampaignImageUrl(campaign.image)!
                                }
                                alt={
                                  campaign.title
                                }
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl">
                                🤲
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <h3 className="font-bold text-gray-800 text-sm mb-3 line-clamp-2">
                              {
                                campaign.title
                              }
                            </h3>

                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
                              <div
                                className="h-full bg-[#F58220]"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>

                            <div className="flex justify-between text-xs">
                              <div>
                                <div className="text-gray-400">
                                  Terkumpul
                                </div>

                                <strong className="text-gray-700">
                                  {formatRupiah(
                                    collected
                                  )}
                                </strong>
                              </div>

                              {target >
                                0 && (
                                <div className="text-right">
                                  <div className="text-gray-400">
                                    Target
                                  </div>

                                  <strong className="text-gray-700">
                                    {formatRupiah(
                                      target
                                    )}
                                  </strong>
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              )}

              <button
                type="button"
                disabled={
                  !campaignId
                }
                onClick={() =>
                  setStep(2)
                }
                className={`w-full py-4 rounded-xl font-bold ${
                  campaignId
                    ? "btn-primary"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Lanjut — Isi
                Data & Nominal
                →
              </button>
            </div>
          )}

          {/* STEP 2 */}

          {step === 2 && (
            <div>
              {selectedCampaign && (
                <div className="bg-[#FEF0E4] border border-[#F58220]/30 rounded-xl p-4 mb-6">
                  <div className="text-xs text-gray-500 mb-1">
                    Program dipilih
                  </div>

                  <div className="font-bold text-[#D96D0A]">
                    {
                      selectedCampaign.title
                    }
                  </div>
                </div>
              )}

              {initialZakatAmount &&
                initialZakatAmount >
                  0 && (
                  <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 text-sm">
                    Nominal zakat{" "}
                    <strong>
                      {formatRupiah(
                        initialZakatAmount
                      )}
                    </strong>{" "}
                    otomatis terisi
                    dari Kalkulator
                    Zakat.
                  </div>
                )}

              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Isi Data Donatur
              </h2>

              <div className="space-y-6">

                {/* Name */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Donatur
                  </label>

                  <input
                    type="text"
                    disabled={
                      isAnonymous
                    }
                    value={
                      isAnonymous
                        ? "Hamba Allah"
                        : name
                    }
                    onChange={(
                      event
                    ) =>
                      setName(
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="Masukkan nama"
                    className="w-full bg-white border border-[#F3DEC8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F58220]"
                  />

                  <label className="flex items-center gap-2 mt-3 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        isAnonymous
                      }
                      onChange={
                        handleAnonymous
                      }
                    />

                    Sembunyikan
                    nama sebagai
                    Hamba Allah
                  </label>
                </div>

                {/* Phone */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nomor WhatsApp
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      +62
                    </span>

                    <input
                      type="tel"
                      value={phone}
                      onChange={(
                        event
                      ) =>
                        setPhone(
                          event.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                      placeholder="8xxxxxxxxxx"
                      className="w-full bg-white border border-[#F3DEC8] rounded-xl pl-14 pr-4 py-3 text-sm focus:outline-none focus:border-[#F58220]"
                    />
                  </div>
                </div>

                {/* Email */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(
                      event
                    ) =>
                      setEmail(
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="nama@email.com"
                    className="w-full bg-white border border-[#F3DEC8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F58220]"
                  />
                </div>

                {/* Amount */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Nominal Donasi
                  </label>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {presets.map(
                      (
                        preset
                      ) => (
                        <button
                          type="button"
                          key={
                            preset
                          }
                          onClick={() => {
                            setSelectedAmount(
                              preset
                            );

                            setCustomAmount(
                              ""
                            );
                          }}
                          className={`py-3 rounded-xl text-sm font-semibold ${
                            selectedAmount ===
                            preset
                              ? "bg-[#F58220] text-white"
                              : "bg-white border border-[#F3DEC8] text-gray-700"
                          }`}
                        >
                          {formatRupiah(
                            preset
                          )}
                        </button>
                      )
                    )}
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      Rp
                    </span>

                    <input
                      type="text"
                      inputMode="numeric"
                      value={
                        selectedAmount !==
                          null &&
                        !presets.includes(
                          selectedAmount
                        )
                          ? selectedAmount.toLocaleString(
                              "id-ID"
                            )
                          : customAmount
                      }
                      onChange={
                        handleCustomAmount
                      }
                      onFocus={() => {
                        if (
                          selectedAmount !==
                            null &&
                          !presets.includes(
                            selectedAmount
                          )
                        ) {
                          setCustomAmount(
                            selectedAmount.toLocaleString(
                              "id-ID"
                            )
                          );

                          setSelectedAmount(
                            null
                          );
                        }
                      }}
                      placeholder="Nominal lainnya"
                      className="w-full bg-white border border-[#F3DEC8] rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#F58220]"
                    />
                  </div>

                  {amount >
                    0 && (
                    <div className="mt-3 bg-[#FEF0E4] rounded-xl px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-600">
                        Total
                      </span>

                      <strong className="text-[#F58220]">
                        {formatRupiah(
                          amount
                        )}
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              {submitError && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                  {submitError}
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() =>
                    setStep(1)
                  }
                  className="px-6 py-3 rounded-xl border border-[#F3DEC8]"
                >
                  ← Kembali
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (
                      validateStepTwo()
                    ) {
                      setStep(
                        3
                      );
                    }
                  }}
                  className="flex-1 btn-primary py-3 font-bold"
                >
                  Lanjut —
                  Konfirmasi →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Konfirmasi
                Donasi
              </h2>

              <div className="bg-white border border-[#F3DEC8] rounded-2xl p-6 space-y-4">
                <Summary
                  label="Program"
                  value={
                    selectedCampaign?.title ??
                    "-"
                  }
                />

                <Summary
                  label="Donatur"
                  value={
                    displayName
                  }
                />

                <Summary
                  label="WhatsApp"
                  value={`+${normalizePhone(
                    phone
                  )}`}
                />

                <Summary
                  label="Email"
                  value={email}
                />

                <div className="border-t border-[#F3DEC8]" />

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">
                    Total Donasi
                  </span>

                  <span className="text-2xl font-bold text-[#F58220]">
                    {formatRupiah(
                      amount
                    )}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 mt-5">
                Setelah menekan
                tombol bayar,
                Anda akan
                diarahkan ke
                halaman pembayaran
                Midtrans untuk
                memilih QRIS,
                Virtual Account,
                atau metode
                pembayaran lain
                yang tersedia.
              </div>

              {submitError && (
                <div className="mt-5 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                  {submitError}
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  disabled={
                    isSubmitting
                  }
                  onClick={() =>
                    setStep(2)
                  }
                  className="px-6 py-4 rounded-xl border border-[#F3DEC8]"
                >
                  ← Kembali
                </button>

                <button
                  type="submit"
                  disabled={
                    isSubmitting
                  }
                  className="flex-1 btn-primary py-4 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? "Membuat Transaksi..."
                    : `Bayar ${formatRupiah(
                        amount
                      )}`}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function Summary({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-5 text-sm">
      <span className="text-gray-400">
        {label}
      </span>

      <span className="font-semibold text-gray-800 text-right">
        {value}
      </span>
    </div>
  );
}