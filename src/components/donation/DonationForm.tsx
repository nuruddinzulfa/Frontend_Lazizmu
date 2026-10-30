'use client'

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { api } from '@/services/api'
import API_URL from '@/lib/api'

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

interface DonasiPageProps {
  initialZakatAmount?: number
  initialZakatEligible?: boolean
  initialZakatType?: 'profesi' | 'maal'
  initialProgram?: string

  /**
   * Campaign yang dikirim langsung dari Hero / Campaign Detail.
   *
   * Jika ada nilai ini, user langsung masuk Step 2.
   */
  initialCampaignId?: number | null

  /**
   * Step awal dari halaman sebelumnya.
   *
   * Default:
   * - campaign ada -> Step 2
   * - campaign tidak ada -> Step 1
   */
  initialStep?: DonationStep
}

interface Campaign {
  id: number
  title: string
  slug: string
  description?: string | null
  image?: string | null
  thumbnail?: string | null
  target_amount?: number | string | null
  collected_amount?: number | string | null
  donor_count?: number | null
  category?: string | null
  status?: string
}

interface CampaignResponse {
  success: boolean
  message?: string
  data:
    | Campaign[]
    | {
        data: Campaign[]
      }
}

interface DonationResponse {
  success: boolean
  message: string
  data: {
    donation: {
      id: number
      campaign_id: number
      order_id: string
      donor_name: string
      amount: number
      anonymous: boolean
      payment_status: string
      created_at: string
    }

    campaign?: {
      id: number
      title: string
      slug: string
    }

    snap_token?: string
    redirect_url?: string
  }
}

interface ZakatTransactionResponse {
  success: boolean
  message: string
  data: {
    transaction: {
      id: number
      zakat_type: 'profesi' | 'maal'
      order_id: string
      payer_name: string
      amount: number
      payment_status: string
      created_at: string
    }

    snap_token?: string
    redirect_url?: string
  }
}

interface PaymentStatusResponse {
  success: boolean
  message?: string
  data: {
    id: number
    order_id: string
    payment_status: string
  }
}

interface StoredDonation {
  donationId?: number
  transactionId?: number
  orderId?: string
  campaignId?: number
  amount?: number
  donorName?: string
  campaignTitle?: string
  transactionType?: 'donation' | 'zakat'
  zakatType?: 'profesi' | 'maal'
}

type DonationStep = 1 | 2 | 3

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function formatRupiah(
  value: number | string | null | undefined,
) {
  const number = Number(value ?? 0)

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(
    Number.isFinite(number)
      ? number
      : 0,
  )
}

function formatNumberInput(
  value: string,
) {
  const clean = value.replace(
    /\D/g,
    '',
  )

  if (!clean) {
    return ''
  }

  return Number(clean).toLocaleString(
    'id-ID',
  )
}

function parseNumber(
  value: string,
) {
  const clean = value
    .replace(/\./g, '')
    .replace(/[^\d]/g, '')

  const number = Number(clean)

  return Number.isFinite(number)
    ? number
    : 0
}

function normalizePhone(
  phone: string,
) {
  let clean = phone.replace(
    /\D/g,
    '',
  )

  if (clean.startsWith('62')) {
    return clean
  }

  if (clean.startsWith('0')) {
    clean = clean.substring(1)
  }

  return `62${clean}`
}

function getCampaignImageUrl(
  image: string | null | undefined,
): string | null {
  if (!image) {
    return null
  }

  if (
    image.startsWith('http://') ||
    image.startsWith('https://')
  ) {
    return image
  }

  const cleanImage = image
    .replace(/^\/+/, '')
    .replace(/^storage\//, '')

  const backendUrl =
    API_URL.replace(
      /\/api\/?$/,
      '',
    )

  return `${backendUrl}/storage/${cleanImage}`
}

function getCampaignIdFromUrl() {
  if (
    typeof window ===
    'undefined'
  ) {
    return null
  }

  const params =
    new URLSearchParams(
      window.location.search,
    )

  const rawCampaign =
    params.get('campaign')

  if (!rawCampaign) {
    return null
  }

  const value =
    Number(rawCampaign)

  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return null
  }

  return value
}

function getStepFromUrl(): DonationStep {
  if (
    typeof window ===
    'undefined'
  ) {
    return 1
  }

  const params =
    new URLSearchParams(
      window.location.search,
    )

  const rawStep =
    Number(params.get('step'))

  if (rawStep === 3) {
    return 3
  }

  if (rawStep === 2) {
    return 2
  }

  /*
  |--------------------------------------------------------------------------
  | JIKA ADA CAMPAIGN
  |--------------------------------------------------------------------------
  |
  | Campaign berarti user datang dari tombol
  | "Donasi Sekarang".
  |
  | Maka langsung Step 2.
  |--------------------------------------------------------------------------
  */

  if (
    getCampaignIdFromUrl()
  ) {
    return 2
  }

  return 1
}

/*
|--------------------------------------------------------------------------
| DONATION FORM
|--------------------------------------------------------------------------
*/

export default function DonationForm({
  initialZakatAmount,
  initialZakatEligible,
  initialZakatType,
  initialProgram,
  initialCampaignId = null,
  initialStep,
}: DonasiPageProps) {
  /*
  |--------------------------------------------------------------------------
  | ZAKAT
  |--------------------------------------------------------------------------
  */

  const hasCalculatedZakatAmount =
    Boolean(
      initialZakatAmount &&
        initialZakatAmount > 0,
    )

  // Jenis zakat tetap menandai formulir sebagai transaksi zakat,
  // meskipun kalkulator menyatakan belum wajib dan nominal belum ditentukan.
  const isZakat =
    Boolean(initialZakatType) ||
    hasCalculatedZakatAmount

  const zakatType =
    initialZakatType ??
    'profesi'

  /*
  |--------------------------------------------------------------------------
  | URL CAMPAIGN
  |--------------------------------------------------------------------------
  */

  const urlCampaignId =
    getCampaignIdFromUrl()

  /*
  |--------------------------------------------------------------------------
  | FINAL CAMPAIGN ID
  |--------------------------------------------------------------------------
  |
  | Prioritas:
  |
  | 1. initialCampaignId
  | 2. campaign dari URL
  |
  |--------------------------------------------------------------------------
  */

  const resolvedInitialCampaignId =
    initialCampaignId ??
    urlCampaignId

  /*
  |--------------------------------------------------------------------------
  | INITIAL STEP
  |--------------------------------------------------------------------------
  |
  | Prioritas:
  |
  | 1. initialStep
  | 2. step dari URL
  | 3. campaign -> Step 2
  | 4. default -> Step 1
  |--------------------------------------------------------------------------
  */

  const resolvedInitialStep =
    initialStep ??
    (
      resolvedInitialCampaignId
        ? getStepFromUrl()
        : 1
    )

  /*
  |--------------------------------------------------------------------------
  | CAMPAIGNS
  |--------------------------------------------------------------------------
  */

  const [
    campaigns,
    setCampaigns,
  ] = useState<Campaign[]>([])

  const [
    campaignLoading,
    setCampaignLoading,
  ] = useState(
    !isZakat,
  )

  const [
    campaignError,
    setCampaignError,
  ] = useState('')

  /*
  |--------------------------------------------------------------------------
  | SELECTED CAMPAIGN
  |--------------------------------------------------------------------------
  */

  const [
    campaignId,
    setCampaignId,
  ] = useState<
    number | null
  >(
    resolvedInitialCampaignId,
  )

  /*
  |--------------------------------------------------------------------------
  | STEP
  |--------------------------------------------------------------------------
  */

  const [
    step,
    setStep,
  ] = useState<DonationStep>(
    () => {
      if (isZakat) {
        return 2
      }

      return resolvedInitialStep
    },
  )

  /*
  |--------------------------------------------------------------------------
  | DONOR
  |--------------------------------------------------------------------------
  */

  const [
    name,
    setName,
  ] = useState('')

  const [
    isAnonymous,
    setIsAnonymous,
  ] = useState(false)

  const [
    phone,
    setPhone,
  ] = useState('')

  const [
    email,
    setEmail,
  ] = useState('')

  /*
  |--------------------------------------------------------------------------
  | AMOUNT
  |--------------------------------------------------------------------------
  */

  const [
    selectedAmount,
    setSelectedAmount,
  ] = useState<
    number | null
  >(
    initialZakatAmount &&
      initialZakatAmount > 0
      ? initialZakatAmount
      : null,
  )

  const [
    customAmount,
    setCustomAmount,
  ] = useState('')

  /*
  |--------------------------------------------------------------------------
  | PAYMENT
  |--------------------------------------------------------------------------
  */

  const [
    transactionStatus,
    setTransactionStatus,
  ] = useState<
    string | null
  >(null)

  const [
    returnedOrderId,
    setReturnedOrderId,
  ] = useState<
    string | null
  >(null)

  const [
    lastDonation,
    setLastDonation,
  ] = useState<
    StoredDonation | null
  >(null)

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)

  const [
    submitError,
    setSubmitError,
  ] = useState('')

  /*
  |--------------------------------------------------------------------------
  | PRESET
  |--------------------------------------------------------------------------
  */

  const presets = [
    10_000,
    25_000,
    50_000,
    100_000,
    250_000,
    500_000,
  ]

  /*
  |--------------------------------------------------------------------------
  | AMOUNT
  |--------------------------------------------------------------------------
  */

  const amount =
    selectedAmount !== null
      ? selectedAmount
      : parseNumber(
          customAmount,
        )

  /*
  |--------------------------------------------------------------------------
  | SELECTED CAMPAIGN
  |--------------------------------------------------------------------------
  */

  const selectedCampaign =
    useMemo(() => {
      return (
        campaigns.find(
          (campaign) =>
            campaign.id ===
            campaignId,
        ) ?? null
      )
    }, [
      campaigns,
      campaignId,
    ])

  /*
  |--------------------------------------------------------------------------
  | DISPLAY NAME
  |--------------------------------------------------------------------------
  */

  const displayName =
    isZakat
      ? name.trim()
      : isAnonymous
        ? 'Hamba Allah'
        : name.trim()

  /*
  |--------------------------------------------------------------------------
  | PAYMENT STATUS
  |--------------------------------------------------------------------------
  */

  const isPaymentSuccess =
    transactionStatus ===
      'settlement'

  const isPaymentPending =
    transactionStatus ===
      'pending'

  const isPaymentChecking =
    transactionStatus ===
      'checking'

  const isPaymentFailed =
    transactionStatus ===
      'failed' ||
    transactionStatus ===
      'failure' ||
    transactionStatus ===
      'cancelled' ||
    transactionStatus ===
      'expired'

  const isZakatTransaction =
    lastDonation?.transactionType ===
      'zakat' ||
    lastDonation?.orderId?.startsWith(
      'ZKT-',
    ) ||
    returnedOrderId?.startsWith(
      'ZKT-',
    ) ||
    isZakat

  /*
  |--------------------------------------------------------------------------
  | INITIAL CAMPAIGN / STEP
  |--------------------------------------------------------------------------
  |
  | Ini adalah bagian penting untuk memperbaiki
  | masalah campaign kembali ke Step 1.
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (isZakat) {
      setCampaignId(null)
      setStep(2)

      return
    }

    /*
    |--------------------------------------------------------------------------
    | PRIORITAS INITIAL CAMPAIGN
    |--------------------------------------------------------------------------
    */

    if (
      initialCampaignId !==
      null &&
      initialCampaignId !==
        undefined
    ) {
      setCampaignId(
        initialCampaignId,
      )

      setStep(
        initialStep ?? 2,
      )

      return
    }

    /*
    |--------------------------------------------------------------------------
    | PRIORITAS URL CAMPAIGN
    |--------------------------------------------------------------------------
    */

    const campaignFromUrl =
      getCampaignIdFromUrl()

    if (campaignFromUrl) {
      setCampaignId(
        campaignFromUrl,
      )

      setStep(
        getStepFromUrl(),
      )

      return
    }

    /*
    |--------------------------------------------------------------------------
    | TANPA CAMPAIGN
    |--------------------------------------------------------------------------
    */

    setCampaignId(null)

    setStep(1)
  }, [
    initialCampaignId,
    initialStep,
    isZakat,
  ])

  /*
  |--------------------------------------------------------------------------
  | FETCH CAMPAIGNS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (isZakat) {
      setCampaigns([])
      setCampaignLoading(false)

      return
    }

    const fetchCampaigns =
      async () => {
        try {
          setCampaignLoading(true)
          setCampaignError('')

          const response =
            await api.get<CampaignResponse>(
              '/campaigns',
            )

          if (
            !response.success
          ) {
            throw new Error(
              response.message ||
                'Gagal mengambil daftar program.',
            )
          }

          let data: Campaign[] =
            []

          /*
          |--------------------------------------------------------------------------
          | RESPONSE ARRAY
          |--------------------------------------------------------------------------
          */

          if (
            Array.isArray(
              response.data,
            )
          ) {
            data =
              response.data
          }

          /*
          |--------------------------------------------------------------------------
          | RESPONSE NESTED
          |--------------------------------------------------------------------------
          */

          if (
            response.data &&
            !Array.isArray(
              response.data,
            ) &&
            Array.isArray(
              response.data.data,
            )
          ) {
            data =
              response.data.data
          }

          setCampaigns(data)

          /*
          |--------------------------------------------------------------------------
          | CAMPAIGN DARI URL / PROPS
          |--------------------------------------------------------------------------
          */

          const requestedCampaignId =
            initialCampaignId ??
            getCampaignIdFromUrl()

          if (
            requestedCampaignId
          ) {
            const matchedCampaign =
              data.find(
                (
                  campaign,
                ) =>
                  campaign.id ===
                  requestedCampaignId,
              )

            if (
              matchedCampaign
            ) {
              setCampaignId(
                matchedCampaign.id,
              )

              /*
              |--------------------------------------------------------------------------
              | JANGAN KEMBALI KE STEP 1
              |--------------------------------------------------------------------------
              */

              setStep(
                initialStep ??
                  getStepFromUrl(),
              )
            }
          }

          /*
          |--------------------------------------------------------------------------
          | INITIAL PROGRAM
          |--------------------------------------------------------------------------
          */

          if (
            initialProgram &&
            !requestedCampaignId
          ) {
            const keyword =
              initialProgram
                .toLowerCase()
                .trim()

            const normalizedSlug =
              keyword.replace(
                /\s+/g,
                '-',
              )

            const match =
              data.find(
                (
                  campaign,
                ) => {
                  const title =
                    campaign.title
                      ?.toLowerCase()
                      .trim() ??
                    ''

                  const slug =
                    campaign.slug
                      ?.toLowerCase()
                      .trim() ??
                    ''

                  return (
                    title.includes(
                      keyword,
                    ) ||
                    keyword.includes(
                      title,
                    ) ||
                    slug.includes(
                      normalizedSlug,
                    )
                  )
                },
              )

            if (match) {
              setCampaignId(
                match.id,
              )

              /*
              |--------------------------------------------------------------------------
              | INITIAL PROGRAM JUGA LANGSUNG STEP 2
              |--------------------------------------------------------------------------
              */

              setStep(2)
            }
          }
        } catch (error) {
          console.error(
            'CAMPAIGN ERROR:',
            error,
          )

          setCampaignError(
            error instanceof
              Error
              ? error.message
              : 'Gagal mengambil daftar program.',
          )
        } finally {
          setCampaignLoading(false)
        }
      }

    fetchCampaigns()
  }, [
    initialCampaignId,
    initialProgram,
    initialStep,
    isZakat,
  ])

  /*
  |--------------------------------------------------------------------------
  | DOKU RETURN / PAYMENT STATUS
  |--------------------------------------------------------------------------
  |
  | DOKU hanya mengembalikan pengguna ke website.
  | Status pembayaran yang dipercaya tetap berasal dari webhook DOKU
  | yang sudah tersimpan di backend.
  |
  | Setelah kembali dari DOKU, transaksi terakhir dibaca dari sessionStorage
  | lalu frontend mengecek status ke endpoint backend.
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      typeof window ===
      'undefined'
    ) {
      return
    }

    let cancelled = false

    const checkPaymentStatus =
      async () => {
        try {
          const stored =
            sessionStorage.getItem(
              'lastDonation',
            )

          if (!stored) {
            return
          }

          const storedDonation =
            JSON.parse(
              stored,
            ) as StoredDonation

          setLastDonation(
            storedDonation,
          )

          setReturnedOrderId(
            storedDonation.orderId ??
              null,
          )

          const isStoredZakat =
            storedDonation.transactionType ===
              'zakat' ||
            storedDonation.orderId?.startsWith(
              'ZKT-',
            )

          const transactionId =
            isStoredZakat
              ? storedDonation.transactionId
              : storedDonation.donationId

          if (!transactionId) {
            return
          }

          setTransactionStatus(
            'checking',
          )

          /*
          |--------------------------------------------------------------------------
          | Polling singkat
          |--------------------------------------------------------------------------
          |
          | Redirect browser bisa kembali sedikit lebih cepat daripada webhook.
          | Karena itu status dicek beberapa kali sebelum dianggap masih pending.
          |--------------------------------------------------------------------------
          */

          for (
            let attempt = 0;
            attempt < 10;
            attempt += 1
          ) {
            if (cancelled) {
              return
            }

            const endpoint =
              isStoredZakat
                ? `/zakat-transactions/${transactionId}/status`
                : `/donations/${transactionId}/status`

            const response =
              await api.get<PaymentStatusResponse>(
                endpoint,
              )

            if (
              !response.success
            ) {
              throw new Error(
                response.message ||
                  'Gagal memeriksa status pembayaran.',
              )
            }

            const paymentStatus =
              String(
                response.data
                  .payment_status ??
                  'pending',
              )
                .toLowerCase()
                .trim()

            if (cancelled) {
              return
            }

            setReturnedOrderId(
              response.data.order_id ||
                storedDonation.orderId ||
                null,
            )

            if (
              paymentStatus ===
                'settlement' ||
              paymentStatus ===
                'failed' ||
              paymentStatus ===
                'failure' ||
              paymentStatus ===
                'cancelled' ||
              paymentStatus ===
                'expired'
            ) {
              setTransactionStatus(
                paymentStatus,
              )

              return
            }

            if (attempt < 9) {
              await new Promise(
                (resolve) =>
                  window.setTimeout(
                    resolve,
                    1500,
                  ),
              )
            }
          }

          if (!cancelled) {
            setTransactionStatus(
              'pending',
            )
          }
        } catch (error) {
          console.error(
            'DOKU STATUS ERROR:',
            error,
          )

          if (!cancelled) {
            setTransactionStatus(
              'pending',
            )
          }
        }
      }

    checkPaymentStatus()

    return () => {
      cancelled = true
    }
  }, [])

  /*
  |--------------------------------------------------------------------------
  | CUSTOM AMOUNT
  |--------------------------------------------------------------------------
  */

  const handleCustomAmount =
    (
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      setSelectedAmount(null)

      setCustomAmount(
        formatNumberInput(
          event.target.value,
        ),
      )
    }

  /*
  |--------------------------------------------------------------------------
  | ANONYMOUS
  |--------------------------------------------------------------------------
  */

  const handleAnonymous =
    () => {
      setIsAnonymous(
        (current) =>
          !current,
      )

      if (!isAnonymous) {
        setName('')
      }
    }

  /*
  |--------------------------------------------------------------------------
  | SELECT CAMPAIGN
  |--------------------------------------------------------------------------
  */

  const handleSelectCampaign =
    (
      id: number,
    ) => {
      setCampaignId(id)
      setSubmitError('')
    }

  /*
  |--------------------------------------------------------------------------
  | STEP 1 → STEP 2
  |--------------------------------------------------------------------------
  */

  const handleContinueToData =
    () => {
      if (!campaignId) {
        setSubmitError(
          'Silakan pilih program donasi terlebih dahulu.',
        )

        return
      }

      setSubmitError('')
      setStep(2)
    }

  /*
  |--------------------------------------------------------------------------
  | VALIDATE STEP 2
  |--------------------------------------------------------------------------
  */

  const validateStepTwo =
    () => {
      if (
        !isZakat &&
        !campaignId
      ) {
        setSubmitError(
          'Program donasi belum dipilih.',
        )

        return false
      }

      if (
        !isAnonymous &&
        !name.trim()
      ) {
        setSubmitError(
          isZakat
            ? 'Nama muzaki wajib diisi.'
            : 'Nama donatur wajib diisi.',
        )

        return false
      }

      if (!phone.trim()) {
        setSubmitError(
          'Nomor WhatsApp wajib diisi.',
        )

        return false
      }

      if (
        phone.replace(
          /\D/g,
          '',
        ).length < 8
      ) {
        setSubmitError(
          'Nomor WhatsApp tidak valid.',
        )

        return false
      }

      if (!email.trim()) {
        setSubmitError(
          'Email wajib diisi.',
        )

        return false
      }

      if (
        !email.includes('@')
      ) {
        setSubmitError(
          'Format email tidak valid.',
        )

        return false
      }

      if (amount < 1000) {
        setSubmitError(
          isZakat
            ? 'Nominal zakat minimal Rp1.000.'
            : 'Nominal donasi minimal Rp1.000.',
        )

        return false
      }

      setSubmitError('')

      return true
    }

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault()

      if (
        !validateStepTwo()
      ) {
        return
      }

      try {
        setIsSubmitting(true)
        setSubmitError('')

        /*
        |--------------------------------------------------------------------------
        | ZAKAT
        |--------------------------------------------------------------------------
        */

        if (isZakat) {
          const response =
            await api.post<ZakatTransactionResponse>(
              '/zakat-transactions',
              {
                zakat_type:
                  zakatType,

                payer_name:
                  name.trim(),

                email:
                  email.trim(),

                phone:
                  normalizePhone(
                    phone,
                  ),

                amount,
              },
            )

          if (
            !response.success
          ) {
            throw new Error(
              response.message ||
                'Gagal membuat transaksi zakat.',
            )
          }

          sessionStorage.setItem(
            'lastDonation',
            JSON.stringify({
              transactionId:
                response.data
                  .transaction.id,

              orderId:
                response.data
                  .transaction
                  .order_id,

              donorName:
                response.data
                  .transaction
                  .payer_name,

              amount:
                response.data
                  .transaction
                  .amount,

              transactionType:
                'zakat',

              zakatType:
                response.data
                  .transaction
                  .zakat_type,
            }),
          )

          if (
            response.data
              .redirect_url
          ) {
            window.location.href =
              response.data
                .redirect_url

            return
          }

          throw new Error(
            'Backend tidak mengembalikan URL pembayaran DOKU.',
          )
        }

        /*
        |--------------------------------------------------------------------------
        | DONATION
        |--------------------------------------------------------------------------
        */

        if (!campaignId) {
          throw new Error(
            'Campaign belum dipilih.',
          )
        }

        const response =
          await api.post<DonationResponse>(
            '/donations',
            {
              campaign_id:
                campaignId,

              donor_name:
                displayName,

              email:
                email.trim(),

              phone:
                normalizePhone(
                  phone,
                ),

              amount,

              message: null,

              anonymous:
                isAnonymous,
            },
          )

        if (
          !response.success
        ) {
          throw new Error(
            response.message ||
              'Gagal membuat transaksi donasi.',
          )
        }

        sessionStorage.setItem(
          'lastDonation',
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

            transactionType:
              'donation',
          }),
        )

        if (
          response.data
            .redirect_url
        ) {
          window.location.href =
            response.data
              .redirect_url

          return
        }

        throw new Error(
          'Backend tidak mengembalikan URL pembayaran DOKU.',
        )
      } catch (error) {
        console.error(
          'PAYMENT ERROR:',
          error,
        )

        setSubmitError(
          error instanceof
            Error
            ? error.message
            : 'Terjadi kesalahan saat membuat transaksi.',
        )
      } finally {
        setIsSubmitting(false)
      }
    }

  /*
  |--------------------------------------------------------------------------
  | NAVIGATION
  |--------------------------------------------------------------------------
  */

  const handleBackHome =
    () => {
      sessionStorage.removeItem(
        'lastDonation',
      )

      window.location.href =
        '/'
    }

  const handleDonateAgain =
    () => {
      sessionStorage.removeItem(
        'lastDonation',
      )

      window.location.href =
        '/donasi'
    }

  /*
  |--------------------------------------------------------------------------
  | CHECKING PAYMENT
  |--------------------------------------------------------------------------
  */

  if (isPaymentChecking) {
  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-[#FFF8F2] px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-[#F3DEC8] bg-white p-6 text-center shadow-lg sm:p-8">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#F58220] border-t-transparent" />
        </div>

        <h1 className="payment-status-title mb-3 text-gray-900">
          Memverifikasi Pembayaran
        </h1>

        <p className="mx-auto max-w-sm text-sm leading-6 text-gray-500">
          Mohon tunggu sebentar. Kami sedang mencocokkan status pembayaran
          DOKU dengan sistem LAZISMU Pemalang.
        </p>
      </div>
    </div>
  )
}

  /*
  |--------------------------------------------------------------------------
  | SUCCESS
  |--------------------------------------------------------------------------
  */

  if (isPaymentSuccess) {
    const successOrderId =
      returnedOrderId ||
      lastDonation?.orderId ||
      '-'

    const successAmount =
      lastDonation?.amount

    const successZakatType =
      lastDonation?.zakatType === 'maal'
        ? 'Zakat Maal'
        : 'Zakat Penghasilan'

    return (
      <div className="min-h-[100svh] bg-[#FFF8F2] px-4 pt-28 pb-10 flex flex-col items-center">
        <div className="my-auto w-full max-w-md bg-white rounded-3xl border border-[#F3DEC8] shadow-xl overflow-hidden">

          <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] px-7 py-8 text-center">

            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">

              <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center">

                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.8}
                    d="M5 13l4 4L19 7"
                  />
                </svg>

              </div>

            </div>

            <div className="mb-3 inline-flex items-center rounded-full border border-white/60 bg-white/15 px-3 py-1 text-[10px] font-semibold text-white">
              ✓{' '}
              {isZakatTransaction
                ? 'Pembayaran Zakat Berhasil'
                : 'Pembayaran Donasi Berhasil'}
            </div>

            <h1
  className="font-bold leading-tight"
  style={{
    fontSize: "32px",
    color: "#FFFFFF",
    WebkitTextFillColor: "#FFFFFF",
    fontWeight: 700
  }}
>
  {isZakatTransaction
    ? 'Alhamdulillah, Zakat Anda Telah Ditunaikan'
    : 'Jazakumullahu Khairan'}
</h1>

          </div>

          <div className="p-6 text-center">

            <p className="text-xs leading-relaxed text-gray-500">
              {isZakatTransaction
                ? 'Terima kasih telah mempercayakan penunaian zakat melalui '
                : 'Terima kasih telah mempercayakan kebaikan melalui '}
              <strong className="text-[#F58220]">
                LAZISMU Pemalang
              </strong>
              .
            </p>

            <p className="mt-5 text-xs leading-6 text-gray-500">
              {isZakatTransaction
                ? 'Zakat Anda telah berhasil diterima. Semoga Allah memberikan pahala atas zakat, infak, dan shodaqoh yang ditunaikan, memberikan keberkahan pada harta yang disimpan, dan menjadikannya sebagai pembersih (dosa).'
                : 'Donasi Anda telah berhasil diterima. Semoga Allah memberikan pahala atas zakat, infak, dan shodaqoh yang ditunaikan, memberikan keberkahan pada harta yang disimpan, dan menjadikannya sebagai pembersih (dosa).'}
            </p>

            <div className="mt-5 rounded-2xl border border-[#F3DEC8] bg-[#FFF8F2] p-4 text-left">

              <Summary
                label="Status"
                value="Pembayaran Berhasil"
                valueClassName="text-green-600"
              />

              {isZakatTransaction ? (
                <>
                  <div className="my-3 border-t border-[#F3DEC8]" />

                  <Summary
                    label="Jenis Zakat"
                    value={successZakatType}
                  />
                </>
              ) : (
                <>
                  {lastDonation?.campaignTitle && (
                    <>
                      <div className="my-3 border-t border-[#F3DEC8]" />

                      <Summary
                        label="Program"
                        value={lastDonation.campaignTitle}
                      />
                    </>
                  )}

                  {successAmount !== undefined && (
                    <>
                      <div className="my-3 border-t border-[#F3DEC8]" />

                      <Summary
                        label="Total Donasi"
                        value={formatRupiah(successAmount)}
                        valueClassName="text-[#F58220]"
                      />
                    </>
                  )}
                </>
              )}

              <div className="my-3 border-t border-[#F3DEC8]" />

              <div>
                <div className="mb-1 text-[10px] text-gray-400">
                  Nomor Transaksi
                </div>

                <div className="break-all font-mono text-[11px] font-semibold text-gray-700">
                  {successOrderId}
                </div>
              </div>

            </div>

            <div className="mt-4 flex gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-left">

              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
                ✓
              </div>

              <div>
                <p className="text-xs font-bold text-green-700">
                  {isZakatTransaction
                    ? 'Konfirmasi Zakat'
                    : 'Konfirmasi Donasi'}
                </p>

                <p className="mt-1 text-[11px] leading-5 text-green-700">
                  Konfirmasi transaksi akan dikirim melalui Email ke nomor yang Anda masukkan saat melakukan pembayaran.
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={handleBackHome}
              className="btn-primary mt-5 w-full py-3.5 text-sm font-bold"
            >
              Kembali ke Website →
            </button>

            <button
              type="button"
              onClick={handleDonateAgain}
              className="mt-2 w-full py-3 text-xs font-semibold text-[#F58220]"
            >
              {isZakatTransaction
                ? 'Hitung & Bayar Zakat Lagi'
                : 'Donasi Lagi'}
            </button>

            <p className="mt-5 text-[9px] text-gray-300">
              LAZISMU Pemalang — Amanah, Profesional, Transparan
            </p>

          </div>

        </div>
      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | PENDING
  |--------------------------------------------------------------------------
  */

  if (isPaymentPending) {
  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-[#FFF8F2] px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-[#F3DEC8] bg-white p-6 text-center shadow-lg sm:p-8">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-3xl">
          ⏳
        </div>

        <h1 className="payment-status-title mb-3 text-gray-900">
          Menunggu Pembayaran
        </h1>

        <p className="mx-auto mb-6 max-w-sm text-sm leading-6 text-gray-500">
          Transaksi Anda berhasil dibuat, tetapi pembayaran belum dikonfirmasi.
          Status akan diperbarui setelah pembayaran terverifikasi.
        </p>

        {returnedOrderId && (
          <div className="mb-5 rounded-xl border border-[#F3DEC8] bg-[#FFF8F2] p-4">
            <p className="mb-2 text-xs text-gray-500">
              Nomor Transaksi
            </p>

            <p className="break-all font-mono text-xs font-semibold leading-5 text-gray-800 sm:text-sm">
              {returnedOrderId}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleBackHome}
          className="btn-primary w-full rounded-xl py-3.5 text-sm font-bold"
        >
          Kembali ke Website
        </button>
      </div>
    </div>
  )
}

  /*
  |--------------------------------------------------------------------------
  | FAILED
  |--------------------------------------------------------------------------
  */

  if (isPaymentFailed) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] pt-20 flex items-center justify-center px-4">

        <div className="max-w-lg w-full bg-white rounded-3xl border border-[#F3DEC8] shadow-lg p-10 text-center">

          <div className="text-5xl mb-5">
            ×
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Pembayaran Belum Berhasil
          </h1>

          <p className="text-gray-500 text-sm mb-7">
            Pembayaran belum berhasil
            diproses. Silakan coba
            kembali.
          </p>

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
            className="w-full mt-3 py-3 text-sm text-gray-500"
          >
            Kembali ke Website
          </button>

        </div>

      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (
    !isZakat &&
    campaignLoading
  ) {
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
    )
  }

  /*
  |--------------------------------------------------------------------------
  | MAIN
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-20">

      {/* HEADER */}

      <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] relative overflow-hidden">

        <div className="absolute inset-0 islamic-geo-bg opacity-20" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">

          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-2 mb-5 text-white text-xs font-semibold">
            {isZakat
              ? '🕌 Formulir Zakat — LAZISMU Pemalang'
              : '❤️ Formulir Donasi — LAZISMU Pemalang'}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold !text-white mb-3">
  {isZakat
    ? 'Tunaikan Zakat Anda'
    : 'Tunaikan Kebaikan Anda'}
</h1>

          <p className="text-white/75 text-sm">
            {isZakat
              ? 'Isi data muzaki, periksa nominal zakat, kemudian lanjutkan pembayaran melalui DOKU.'
              : step === 1
                ? 'Pilih program donasi terlebih dahulu, kemudian isi data dan nominal donasi.'
                : 'Isi data donatur, tentukan nominal, kemudian lanjutkan pembayaran melalui DOKU.'}
          </p>

        </div>

      </div>

      {/* STEP INDICATOR */}

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
                      step === number
                        ? 'bg-[#F58220] text-white'
                        : step > number
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {step > number
                      ? '✓'
                      : number}
                  </div>

                  <span
                    className={`hidden sm:block text-xs font-semibold ${
                      step === number
                        ? 'text-[#F58220]'
                        : 'text-gray-400'
                    }`}
                  >
                    {number === 1
                      ? 'Pilih Program'
                      : number === 2
                        ? 'Data & Nominal'
                        : 'Konfirmasi'}
                  </span>

                  {number < 3 && (
                    <div
                      className={`w-10 h-px ${
                        step > number
                          ? 'bg-green-400'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}

                </div>
              ),
            )}

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <form
          onSubmit={
            handleSubmit
          }
        >

          {/* ================================================================
              STEP 1
          ================================================================ */}

          {!isZakat &&
            step === 1 && (
              <div>

                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Pilih Tujuan Donasi
                </h2>

                <p className="text-gray-400 text-sm mb-6">
                  Pilih program donasi yang
                  ingin Anda dukung.
                </p>

                {campaignError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm">
                    {campaignError}
                  </div>
                )}

                {campaigns.length ===
                0 ? (
                  <div className="bg-white border border-[#F3DEC8] rounded-2xl p-8 text-center">

                    <p className="text-gray-500">
                      Belum ada program
                      donasi yang
                      dipublikasikan.
                    </p>

                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

                    {campaigns.map(
                      (
                        campaign,
                      ) => {
                        const collected =
                          Number(
                            campaign.collected_amount ??
                              0,
                          )

                        const target =
                          Number(
                            campaign.target_amount ??
                              0,
                          )

                        const percentage =
                          target >
                          0
                            ? Math.min(
                                100,
                                Math.round(
                                  (collected /
                                    target) *
                                    100,
                                ),
                              )
                            : 0

                        const imageUrl =
                          getCampaignImageUrl(
                            campaign.thumbnail ??
                              campaign.image,
                          )

                        const isSelected =
                          campaignId ===
                          campaign.id

                        return (
                          <button
                            key={
                              campaign.id
                            }
                            type="button"
                            onClick={() =>
                              handleSelectCampaign(
                                campaign.id,
                              )
                            }
                            className={`text-left bg-white rounded-2xl overflow-hidden border-2 transition-all ${
                              isSelected
                                ? 'border-[#F58220] ring-2 ring-[#F58220]/20'
                                : 'border-[#F3DEC8] hover:border-[#F58220]'
                            }`}
                          >

                            {/* THUMBNAIL */}

                            <div className="h-40 bg-orange-50 overflow-hidden">

                              {imageUrl ? (
                                <img
                                  src={
                                    imageUrl
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

                              <div className="flex items-start justify-between gap-3 mb-3">

                                <h3 className="font-bold text-gray-800 text-sm line-clamp-2">
                                  {
                                    campaign.title
                                  }
                                </h3>

                                {isSelected && (
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F58220] text-white flex items-center justify-center text-xs">
                                    ✓
                                  </span>
                                )}

                              </div>

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
                                      collected,
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
                                        target,
                                      )}
                                    </strong>

                                  </div>
                                )}

                              </div>

                            </div>

                          </button>
                        )
                      },
                    )}

                  </div>
                )}

                {submitError && (
                  <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                    {submitError}
                  </div>
                )}

                <button
                  type="button"
                  disabled={!campaignId}
                  onClick={
                    handleContinueToData
                  }
                  className={`w-full py-4 rounded-xl font-bold ${
                    campaignId
                      ? 'btn-primary'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Lanjut — Isi Data &
                  Nominal →
                </button>

              </div>
            )}

          {/* ================================================================
              STEP 2
          ================================================================ */}

          {step === 2 && (
            <div>

              {/* PROGRAM TERPILIH */}

              {!isZakat &&
                selectedCampaign && (
                  <div className="bg-[#FEF0E4] border border-[#F58220]/30 rounded-xl p-4 mb-6">

                    <div className="flex items-center gap-4">

                      {getCampaignImageUrl(
                        selectedCampaign.thumbnail ??
                          selectedCampaign.image,
                      ) ? (
                        <img
                          src={
                            getCampaignImageUrl(
                              selectedCampaign.thumbnail ??
                                selectedCampaign.image,
                            ) as string
                          }
                          alt={
                            selectedCampaign.title
                          }
                          className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-16 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 text-2xl">
                          🤲
                        </div>
                      )}

                      <div className="min-w-0">

                        <div className="text-xs text-gray-500 mb-1">
                          Program dipilih
                        </div>

                        <div className="font-bold text-[#D96D0A] line-clamp-2">
                          {
                            selectedCampaign.title
                          }
                        </div>

                      </div>

                    </div>

                  </div>
                )}

              {/* ZAKAT */}

              {initialZakatAmount &&
                initialZakatAmount >
                  0 && (
                  <div className={`${initialZakatEligible === false ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-green-50 border-green-200 text-green-700'} border rounded-xl p-4 mb-6 text-sm`}>
                    {initialZakatEligible === false
                      ? <>Status kalkulator menunjukkan belum wajib zakat. Estimasi kontribusi sukarela sebesar{' '}<strong>{formatRupiah(initialZakatAmount)}</strong>{' '}otomatis terisi. Anda dapat menyesuaikan nominal sebelum melanjutkan.</>
                      : <>Nominal zakat{' '}<strong>{formatRupiah(initialZakatAmount)}</strong>{' '}otomatis terisi dari Kalkulator Zakat.</>}
                  </div>
                )}

              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {isZakat
                  ? 'Isi Data Muzaki'
                  : 'Isi Data Donatur'}
              </h2>

              <div className="space-y-6">

                {/* NAME */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {isZakat
                      ? 'Nama Muzaki'
                      : 'Nama Donatur'}
                  </label>

                  <input
                    type="text"
                    disabled={
                      isAnonymous
                    }
                    value={
                      isAnonymous
                        ? 'Hamba Allah'
                        : name
                    }
                    onChange={(
                      event,
                    ) =>
                      setName(
                        event.target
                          .value,
                      )
                    }
                    placeholder={
                      isZakat
                        ? 'Masukkan nama muzaki'
                        : 'Masukkan nama'
                    }
                    className="w-full bg-white border border-[#F3DEC8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F58220]"
                  />

                  {!isZakat && (
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

                      Sembunyikan nama
                      sebagai Hamba Allah

                    </label>
                  )}

                </div>

                {/* PHONE */}

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
                        event,
                      ) =>
                        setPhone(
                          event.target.value.replace(
                            /\D/g,
                            '',
                          ),
                        )
                      }
                      placeholder="8xxxxxxxxxx"
                      className="w-full bg-white border border-[#F3DEC8] rounded-xl pl-14 pr-4 py-3 text-sm focus:outline-none focus:border-[#F58220]"
                    />

                  </div>

                </div>

                {/* EMAIL */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(
                      event,
                    ) =>
                      setEmail(
                        event.target
                          .value,
                      )
                    }
                    placeholder="nama@email.com"
                    className="w-full bg-white border border-[#F3DEC8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F58220]"
                  />

                </div>

                {/* AMOUNT */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {isZakat
                      ? 'Nominal Zakat'
                      : 'Nominal Donasi'}
                  </label>

                  {isZakat && !hasCalculatedZakatAmount && (
                    <div className="mb-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 text-sm leading-relaxed">
                      Hasil kalkulator menunjukkan bahwa Anda belum wajib zakat. Jika tetap ingin melanjutkan, isi nominal yang ingin disalurkan. Untuk memastikan klasifikasi penyaluran, Anda dapat mengonfirmasikannya kepada petugas LAZISMU.
                    </div>
                  )}

                  {!isZakat && (
                    <div className="grid grid-cols-3 gap-2 mb-3">

                      {presets.map(
                        (preset) => (
                          <button
                            type="button"
                            key={
                              preset
                            }
                            onClick={() => {
                              setSelectedAmount(
                                preset,
                              )

                              setCustomAmount(
                                '',
                              )
                            }}
                            className={`py-3 rounded-xl text-sm font-semibold ${
                              selectedAmount ===
                              preset
                                ? 'bg-[#F58220] text-white'
                                : 'bg-white border border-[#F3DEC8] text-gray-700'
                            }`}
                          >
                            {formatRupiah(
                              preset,
                            )}
                          </button>
                        ),
                      )}

                    </div>
                  )}

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
                          selectedAmount,
                        )
                          ? selectedAmount.toLocaleString(
                              'id-ID',
                            )
                          : customAmount
                      }
                      onChange={
                        handleCustomAmount
                      }
                      readOnly={
                        isZakat &&
                        hasCalculatedZakatAmount
                      }
                      onFocus={() => {
                        if (
                          selectedAmount !==
                            null &&
                          !presets.includes(
                            selectedAmount,
                          )
                        ) {
                          setCustomAmount(
                            selectedAmount.toLocaleString(
                              'id-ID',
                            ),
                          )

                          setSelectedAmount(
                            null,
                          )
                        }
                      }}
                      placeholder={
                        isZakat
                          ? hasCalculatedZakatAmount
                            ? 'Nominal dari kalkulator zakat'
                            : 'Masukkan nominal yang ingin dibayarkan'
                          : 'Nominal lainnya'
                      }
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
                          amount,
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

                {!isZakat && (
                  <button
                    type="button"
                    onClick={() =>
                      setStep(1)
                    }
                    className="px-6 py-3 rounded-xl border border-[#F3DEC8] bg-white"
                  >
                    ← Kembali
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (
                      validateStepTwo()
                    ) {
                      setStep(3)
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

          {/* ================================================================
              STEP 3
          ================================================================ */}

          {step === 3 && (
            <div>

              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Konfirmasi{' '}
                {isZakat
                  ? initialZakatEligible === false
                    ? 'Kontribusi Sukarela'
                    : 'Zakat'
                  : 'Donasi'}
              </h2>

              <div className="bg-white border border-[#F3DEC8] rounded-2xl p-6 space-y-4">

                {isZakat ? (
                  <Summary
                    label="Jenis Zakat"
                    value={
                      zakatType ===
                      'profesi'
                        ? 'Zakat Penghasilan'
                        : 'Zakat Maal'
                    }
                  />
                ) : (
                  <Summary
                    label="Program"
                    value={
                      selectedCampaign?.title ??
                      '-'
                    }
                  />
                )}

                <Summary
                  label={
                    isZakat
                      ? 'Muzaki'
                      : 'Donatur'
                  }
                  value={
                    displayName
                  }
                />

                <Summary
                  label="WhatsApp"
                  value={`+${normalizePhone(
                    phone,
                  )}`}
                />

                <Summary
                  label="Email"
                  value={email}
                />

                <div className="border-t border-[#F3DEC8]" />

                <div className="flex justify-between items-center gap-4">

                  <span className="font-semibold text-gray-600">
                    {isZakat
                      ? (initialZakatEligible === false
                        ? 'Total Kontribusi'
                        : 'Total Zakat')
                      : 'Total Donasi'}
                  </span>

                  <span className="text-2xl font-bold text-[#F58220] text-right">
                    {formatRupiah(
                      amount,
                    )}
                  </span>

                </div>

              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 mt-5">
                Setelah menekan tombol
                bayar, Anda akan diarahkan
                ke halaman pembayaran
                DOKU.
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
                  className="px-6 py-4 rounded-xl border border-[#F3DEC8] bg-white"
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
                    ? 'Membuat Transaksi...'
                    : `Bayar ${formatRupiah(
                        amount,
                      )}`}
                </button>

              </div>

            </div>
          )}

        </form>

      </div>

    </div>
  )
}

/*
|--------------------------------------------------------------------------
| SUMMARY
|--------------------------------------------------------------------------
*/

function Summary({
  label,
  value,
  valueClassName = 'text-gray-800',
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex justify-between gap-5 text-sm">

      <span className="text-gray-400">
        {label}
      </span>

      <span
        className={`font-semibold text-right ${valueClassName}`}
      >
        {value}
      </span>

    </div>
  )
}
