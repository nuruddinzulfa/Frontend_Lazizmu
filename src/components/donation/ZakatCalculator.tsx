import { useEffect, useState } from "react";
import { api } from "@/services/api";

interface ZakatCalculatorProps {
  onPayZakat: (amount: number) => void;
}

interface GoldPriceResponse {
  success: boolean;
  message: string;
  data: {
    currency: string;
    price_gram_24k: number | null;
    updated_at: string | null;
  };
}

interface ProfesiResponse {
  success: boolean;
  message: string;
  data: {
    period: "monthly" | "yearly";
    salary: number;
    other_income: number;
    needs: number;
    total_income: number;
    net_income: number;
    gold_price_per_gram: number;
    nisab_gold_gram: number;
    nisab: number;
    eligible: boolean;
    zakat_rate: number;
    zakat_amount: number;
  };
}

interface HartaResponse {
  success: boolean;
  message: string;
  data: {
    period: "monthly" | "yearly";
    savings: number;
    precious_assets: number;
    property_vehicle: number;
    other_assets: number;
    debt: number;
    total_assets: number;
    net_assets: number;
    gold_price_per_gram: number;
    nisab_gold_gram: number;
    nisab: number;
    eligible: boolean;
    zakat_rate: number;
    zakat_amount: number;
  };
}

type Tab = "profesi" | "harta" | "info";

function formatRupiah(value: number | null | undefined) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function parseNumber(value: string) {
  return Number(
    value.replace(/\./g, "").replace(/[^\d]/g, "")
  );
}

function formatInput(value: string) {
  const clean = value.replace(/\D/g, "");

  if (!clean) {
    return "";
  }

  return Number(clean).toLocaleString("id-ID");
}

export default function ZakatCalculator({
  onPayZakat,
}: ZakatCalculatorProps) {
  const [tab, setTab] =
    useState<Tab>("profesi");

  /*
  |--------------------------------------------------------------------------
  | Gold Price
  |--------------------------------------------------------------------------
  */

  const [goldPrice, setGoldPrice] =
    useState<number | null>(null);

  const [goldLoading, setGoldLoading] =
    useState(true);

  const [goldError, setGoldError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Zakat Profesi
  |--------------------------------------------------------------------------
  */

  const [salary, setSalary] =
    useState("");

  const [otherIncome, setOtherIncome] =
    useState("");

  const [needs, setNeeds] =
    useState("");

  const [
    profesiResult,
    setProfesiResult,
  ] =
    useState<ProfesiResponse["data"] | null>(
      null
    );

  const [
    profesiLoading,
    setProfesiLoading,
  ] = useState(false);

  const [
    profesiError,
    setProfesiError,
  ] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Zakat Harta
  |--------------------------------------------------------------------------
  */

  const [savings, setSavings] =
    useState("");

  const [
    preciousAssets,
    setPreciousAssets,
  ] = useState("");

  const [
    propertyVehicle,
    setPropertyVehicle,
  ] = useState("");

  const [
    otherAssets,
    setOtherAssets,
  ] = useState("");

  const [debt, setDebt] =
    useState("");

  const [
    hartaResult,
    setHartaResult,
  ] =
    useState<HartaResponse["data"] | null>(
      null
    );

  const [
    hartaLoading,
    setHartaLoading,
  ] = useState(false);

  const [
    hartaError,
    setHartaError,
  ] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Get Gold Price
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        setGoldLoading(true);
        setGoldError("");

        const response =
          await api.get<GoldPriceResponse>(
            "/gold-price"
          );

        if (
          !response.success ||
          !response.data.price_gram_24k
        ) {
          throw new Error(
            response.message ||
              "Harga emas tidak tersedia."
          );
        }

        setGoldPrice(
          Number(
            response.data
              .price_gram_24k
          )
        );
      } catch (error) {
        console.error(
          "GOLD PRICE ERROR:",
          error
        );

        setGoldError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil harga emas."
        );
      } finally {
        setGoldLoading(false);
      }
    };

    fetchGoldPrice();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Input Handler
  |--------------------------------------------------------------------------
  */

  const handleInput =
    (
      setter: React.Dispatch<
        React.SetStateAction<string>
      >
    ) =>
    (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setter(
        formatInput(event.target.value)
      );
    };

  /*
  |--------------------------------------------------------------------------
  | Hitung Zakat Profesi
  |--------------------------------------------------------------------------
  */

  const handleProfesiSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setProfesiError("");
    setProfesiResult(null);

    const salaryValue =
      parseNumber(salary);

    if (salaryValue <= 0) {
      setProfesiError(
        "Penghasilan tetap wajib diisi."
      );

      return;
    }

    try {
      setProfesiLoading(true);

      const response =
        await api.post<ProfesiResponse>(
          "/zakat/profesi",
          {
            period: "monthly",
            salary: salaryValue,
            other_income:
              parseNumber(otherIncome),
            needs:
              parseNumber(needs),
          }
        );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Perhitungan zakat gagal."
        );
      }

      setProfesiResult(
        response.data
      );

      setGoldPrice(
        Number(
          response.data
            .gold_price_per_gram
        )
      );
    } catch (error) {
      console.error(
        "ZAKAT PROFESI ERROR:",
        error
      );

      setProfesiError(
        error instanceof Error
          ? error.message
          : "Gagal menghitung zakat profesi."
      );
    } finally {
      setProfesiLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Hitung Zakat Harta
  |--------------------------------------------------------------------------
  */

  const handleHartaSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setHartaError("");
    setHartaResult(null);

    const totalInput =
      parseNumber(savings) +
      parseNumber(preciousAssets) +
      parseNumber(propertyVehicle) +
      parseNumber(otherAssets);

    if (totalInput <= 0) {
      setHartaError(
        "Masukkan minimal satu nilai harta."
      );

      return;
    }

    try {
      setHartaLoading(true);

      const response =
        await api.post<HartaResponse>(
          "/zakat/harta",
          {
            period: "yearly",
            savings:
              parseNumber(savings),

            precious_assets:
              parseNumber(
                preciousAssets
              ),

            property_vehicle:
              parseNumber(
                propertyVehicle
              ),

            other_assets:
              parseNumber(otherAssets),

            debt:
              parseNumber(debt),
          }
        );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Perhitungan zakat gagal."
        );
      }

      setHartaResult(
        response.data
      );

      setGoldPrice(
        Number(
          response.data
            .gold_price_per_gram
        )
      );
    } catch (error) {
      console.error(
        "ZAKAT HARTA ERROR:",
        error
      );

      setHartaError(
        error instanceof Error
          ? error.message
          : "Gagal menghitung zakat harta."
      );
    } finally {
      setHartaLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Result Component
  |--------------------------------------------------------------------------
  */

  const renderResult = (
    result:
      | ProfesiResponse["data"]
      | HartaResponse["data"]
      | null
  ) => {
    if (!result) {
      return (
        <div className="text-center py-10">
          <div className="w-16 h-16 rounded-full bg-[#FEF0E4] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">
              🧮
            </span>
          </div>

          <p className="text-gray-400 text-sm">
            Isi data kemudian tekan tombol
            hitung untuk melihat hasil zakat.
          </p>
        </div>
      );
    }

    const income =
      "net_income" in result
        ? result.net_income
        : result.net_assets;

    return (
      <div className="space-y-4">
        <div
          className={`w-full text-center py-3 rounded-xl font-bold text-sm ${
            result.eligible
              ? "bg-[#F58220] text-white"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {result.eligible
            ? "✓ Wajib Zakat"
            : "○ Belum Wajib Zakat"}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between gap-4 py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">
              Harta/Penghasilan Bersih
            </span>

            <span className="font-semibold text-gray-800 text-sm text-right">
              {formatRupiah(income)}
            </span>
          </div>

          <div className="flex justify-between gap-4 py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">
              Harga Emas / Gram
            </span>

            <span className="font-semibold text-gray-800 text-sm text-right">
              {formatRupiah(
                result.gold_price_per_gram
              )}
            </span>
          </div>

          <div className="flex justify-between gap-4 py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">
              Nisab (
              {result.nisab_gold_gram} gr)
            </span>

            <span className="font-semibold text-gray-800 text-sm text-right">
              {formatRupiah(
                result.nisab
              )}
            </span>
          </div>

          <div className="flex justify-between gap-4 py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">
              Kadar Zakat
            </span>

            <span className="font-semibold text-gray-800 text-sm">
              {result.zakat_rate}%
            </span>
          </div>
        </div>

        {result.eligible ? (
          <>
            <div className="bg-[#FFF8F2] border border-[#F58220]/30 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">
                Zakat yang wajib
                dikeluarkan
              </div>

              <div
                className="text-2xl font-bold text-[#F58220]"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {formatRupiah(
                  result.zakat_amount
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onPayZakat(
                  Number(
                    result.zakat_amount
                  )
                )
              }
              className="btn-primary w-full text-center py-3 text-sm font-bold"
            >
              Bayar Zakat Sekarang →
            </button>
          </>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500 leading-relaxed">
              Nilai belum mencapai
              nisab zakat.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-20">
      {/* Header */}

      <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] relative overflow-hidden">
        <div className="absolute inset-0 islamic-geo-bg opacity-20" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-2 mb-6 text-white text-xs font-semibold">
            <span>🕌</span>
            Kalkulator Zakat LAZISMU
            Pemalang
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Hitung Zakat Anda
          </h1>

          {goldLoading ? (
            <p className="text-white/80 text-sm">
              Mengambil harga emas
              terbaru...
            </p>
          ) : goldError ? (
            <p className="text-white/80 text-sm">
              Harga emas akan diperbarui
              saat perhitungan dilakukan.
            </p>
          ) : (
            <p className="text-white/80 max-w-xl mx-auto leading-relaxed">
              Nisab menggunakan harga
              emas 24K terbaru sebesar{" "}
              <span className="font-semibold text-white">
                {formatRupiah(
                  goldPrice
                )}
                /gram
              </span>
              .
            </p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Tabs */}

        <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-xl p-1 border border-[#F3DEC8] w-fit">
          <button
            onClick={() =>
              setTab("profesi")
            }
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === "profesi"
                ? "bg-[#F58220] text-white"
                : "text-gray-600 hover:text-[#F58220]"
            }`}
          >
            Zakat Profesi
          </button>

          <button
            onClick={() =>
              setTab("harta")
            }
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === "harta"
                ? "bg-[#F58220] text-white"
                : "text-gray-600 hover:text-[#F58220]"
            }`}
          >
            Zakat Harta
          </button>

          <button
            onClick={() =>
              setTab("info")
            }
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === "info"
                ? "bg-[#F58220] text-white"
                : "text-gray-600 hover:text-[#F58220]"
            }`}
          >
            Panduan
          </button>
        </div>

        {/* PROFESI */}

        {tab === "profesi" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <form
                onSubmit={
                  handleProfesiSubmit
                }
                className="bg-white rounded-2xl border border-[#F3DEC8] p-8 shadow-sm"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Zakat Profesi /
                  Penghasilan
                </h2>

                <p className="text-gray-400 text-sm mb-8">
                  Masukkan penghasilan
                  bulanan Anda.
                </p>

                <div className="space-y-5">
                  <MoneyInput
                    label="Penghasilan Tetap per Bulan *"
                    value={salary}
                    onChange={handleInput(
                      setSalary
                    )}
                  />

                  <MoneyInput
                    label="Penghasilan Lain per Bulan"
                    value={
                      otherIncome
                    }
                    onChange={handleInput(
                      setOtherIncome
                    )}
                  />

                  <MoneyInput
                    label="Kebutuhan Pokok / Pengurang"
                    value={needs}
                    onChange={handleInput(
                      setNeeds
                    )}
                  />
                </div>

                {profesiError && (
                  <div className="mt-5 bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl text-sm">
                    {profesiError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    profesiLoading
                  }
                  className="btn-primary w-full mt-6 py-3 font-bold disabled:opacity-50"
                >
                  {profesiLoading
                    ? "Menghitung..."
                    : "Hitung Zakat Profesi"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-[#F3DEC8] p-6 shadow-sm sticky top-24">
                <h3 className="font-bold text-gray-800 mb-5">
                  Hasil Perhitungan
                </h3>

                {renderResult(
                  profesiResult
                )}
              </div>
            </div>
          </div>
        )}

        {/* HARTA */}

        {tab === "harta" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <form
                onSubmit={
                  handleHartaSubmit
                }
                className="bg-white rounded-2xl border border-[#F3DEC8] p-8 shadow-sm"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Zakat Maal / Harta
                </h2>

                <p className="text-gray-400 text-sm mb-8">
                  Masukkan nilai harta
                  yang telah dimiliki
                  selama satu haul.
                </p>

                <div className="space-y-5">
                  <MoneyInput
                    label="Tabungan / Uang Tunai"
                    value={savings}
                    onChange={handleInput(
                      setSavings
                    )}
                  />

                  <MoneyInput
                    label="Emas / Logam Mulia / Aset Berharga"
                    value={
                      preciousAssets
                    }
                    onChange={handleInput(
                      setPreciousAssets
                    )}
                  />

                  <MoneyInput
                    label="Properti / Kendaraan yang Diperhitungkan"
                    value={
                      propertyVehicle
                    }
                    onChange={handleInput(
                      setPropertyVehicle
                    )}
                  />

                  <MoneyInput
                    label="Aset Lainnya"
                    value={
                      otherAssets
                    }
                    onChange={handleInput(
                      setOtherAssets
                    )}
                  />

                  <MoneyInput
                    label="Utang Jatuh Tempo"
                    value={debt}
                    onChange={handleInput(
                      setDebt
                    )}
                  />
                </div>

                {hartaError && (
                  <div className="mt-5 bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl text-sm">
                    {hartaError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    hartaLoading
                  }
                  className="btn-primary w-full mt-6 py-3 font-bold disabled:opacity-50"
                >
                  {hartaLoading
                    ? "Menghitung..."
                    : "Hitung Zakat Harta"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-[#F3DEC8] p-6 shadow-sm sticky top-24">
                <h3 className="font-bold text-gray-800 mb-5">
                  Hasil Perhitungan
                </h3>

                {renderResult(
                  hartaResult
                )}
              </div>
            </div>
          </div>
        )}

        {/* INFO */}

        {tab === "info" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard
              icon="💼"
              title="Zakat Profesi"
              nisab="85 gram emas"
              kadar="2,5%"
              description="Zakat atas penghasilan dari pekerjaan, gaji, honorarium, maupun penghasilan lainnya."
            />

            <InfoCard
              icon="💰"
              title="Zakat Maal"
              nisab="85 gram emas"
              kadar="2,5%"
              description="Zakat atas harta yang telah mencapai nisab dan memenuhi ketentuan haul."
            />
          </div>
        )}
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Money Input
|--------------------------------------------------------------------------
*/

function MoneyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          Rp
        </span>

        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={onChange}
          placeholder="0"
          className="w-full bg-[#FFF8F2] border border-[#F3DEC8] rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
        />
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Info Card
|--------------------------------------------------------------------------
*/

function InfoCard({
  icon,
  title,
  nisab,
  kadar,
  description,
}: {
  icon: string;
  title: string;
  nisab: string;
  kadar: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#F3DEC8] p-6">
      <div className="text-4xl mb-4">
        {icon}
      </div>

      <h3 className="font-bold text-gray-800 mb-4">
        {title}
      </h3>

      <div className="text-sm space-y-2 mb-4">
        <div>
          <span className="text-gray-400">
            Nisab:{" "}
          </span>

          <strong>{nisab}</strong>
        </div>

        <div>
          <span className="text-gray-400">
            Kadar:{" "}
          </span>

          <strong className="text-[#F58220]">
            {kadar}
          </strong>
        </div>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}