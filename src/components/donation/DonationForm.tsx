import { useState } from 'react'

type TabKey = 'zakat' | 'infaq' | 'pilar'| 'kampanye'

interface ProgramItem {
  id: string
  tab: TabKey
  type: string
  label: string
  image: string
  terkumpul: number
  donatur: number
}

const zakatPrograms: ProgramItem[] = [
  {
    id: 'zakat-maal',
    tab: 'zakat',
    type: 'Zakat',
    label: 'Zakat Maal',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&auto=format',
    terkumpul: 15128672470,
    donatur: 3610,
  },
  {
    id: 'zakat-fidyah',
    tab: 'zakat',
    type: 'Zakat',
    label: 'Bayar Hutang Puasa Dengan Fidyah Untuk Fakir Miskin',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop&auto=format',
    terkumpul: 1751485254,
    donatur: 3745,
  },
  {
    id: 'zakat-profesi',
    tab: 'zakat',
    type: 'Zakat',
    label: 'Zakat Profesi / Penghasilan',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop&auto=format',
    terkumpul: 4833548504,
    donatur: 5898,
  },
  {
    id: 'zakat-corporate',
    tab: 'zakat',
    type: 'Zakat',
    label: 'Zakat Perusahaan Berdayakan Negeri',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop&auto=format',
    terkumpul: 94466560,
    donatur: 27,
  },
]

const infaqPrograms: ProgramItem[] = [
  {
    id: 'infaq-santri',
    tab: 'infaq',
    type: 'Infaq',
    label: 'Orang Tua Asuh Santri Unggul',
    image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=400&fit=crop&auto=format',
    terkumpul: 64917549,
    donatur: 722,
  },
  {
    id: 'infaq-bencana',
    tab: 'infaq',
    type: 'Infaq',
    label: 'Peduli Bencana Sumatera Lazismu dan Gramedia',
    image: 'https://images.unsplash.com/photo-1547652577-f44addd22b1f?w=600&h=400&fit=crop&auto=format',
    terkumpul: 81189767,
    donatur: 585,
  },
  {
    id: 'infaq-aksi',
    tab: 'infaq',
    type: 'Infaq',
    label: 'Aksi Nyata: Bantu Indonesia Pulih Segera',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop&auto=format',
    terkumpul: 594204186,
    donatur: 3000,
  },
  {
    id: 'infaq-dakwah',
    tab: 'infaq',
    type: 'Infaq',
    label: 'Jadikan Kontribusimu Amal Jariyah di Dakwah Digital Umat',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop&auto=format',
    terkumpul: 19332330,
    donatur: 190,
  },
  {
    id: 'infaq-sekolah',
    tab: 'infaq',
    type: 'Infaq',
    label: 'SOS! Save Our School — Wujudkan Pendidikan Bermutu Untuk Semua',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop&auto=format',
    terkumpul: 22965122,
    donatur: 213,
  },
  {
    id: 'infaq-buku',
    tab: 'infaq',
    type: 'Infaq',
    label: 'Sejuta Buku Islami Untuk Negeri',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=400&fit=crop&auto=format',
    terkumpul: 26947411,
    donatur: 242,
  },
]

const pilarPrograms: ProgramItem[] = [
  {
    id: 'pilar-pangan',
    tab: 'pilar',
    type: 'Program Pilar',
    label: 'Bantuan Pangan Keluarga Dhuafa',
    image: 'https://images.unsplash.com/photo-1587523048818-301f81bdadfa?w=600&h=400&fit=crop&auto=format',
    terkumpul: 48750000,
    donatur: 312,
  },
  {
    id: 'pilar-masjid',
    tab: 'pilar',
    type: 'Program Pilar',
    label: 'Renovasi Masjid Desa Terpencil',
    image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&h=400&fit=crop&auto=format',
    terkumpul: 134200000,
    donatur: 521,
  },
  {
    id: 'pilar-sumur',
    tab: 'pilar',
    type: 'Program Pilar',
    label: 'Sumur Bor untuk 3 Dusun Kekeringan',
    image: 'https://images.unsplash.com/photo-1608377205691-45d9c10df9a7?w=600&h=400&fit=crop&auto=format',
    terkumpul: 67800000,
    donatur: 289,
  },
  {
    id: 'pilar-yatim',
    tab: 'pilar',
    type: 'Program Pilar',
    label: 'Beasiswa 50 Anak Yatim Semester Ganjil 2025',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop&auto=format',
    terkumpul: 92300000,
    donatur: 418,
  },
  {
    id: 'pilar-umkm',
    tab: 'pilar',
    type: 'Program Pilar',
    label: 'Alat Produksi UMKM Kerajinan Batik Dhuafa',
    image: 'https://images.unsplash.com/photo-1611087802810-046bb671e644?w=600&h=400&fit=crop&auto=format',
    terkumpul: 38450000,
    donatur: 176,
  },
  {
    id: 'pilar-tahfidz',
    tab: 'pilar',
    type: 'Program Pilar',
    label: 'Majelis Tahfidz Quran untuk 30 Santri',
    image: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600&h=400&fit=crop&auto=format',
    terkumpul: 54100000,
    donatur: 234,
  },
]

const kampanyePrograms: ProgramItem[] = [
    {
    id: 'kampanye-pendidikan',
    tab: 'kampanye',
    type: 'kampanye',
    label: 'Beasiswa Anak Kurang Mampu Pemalang',
    image: 'https://images.unsplash.com/photo-1549431971-f54b3f5c82d8?w=600&h=400&fit=crop&auto=format',
    terkumpul: 48750000,
    donatur: 312,
  },
  {
    id: 'kampanye-kemanusiaan',
    tab: 'kampanye',
    type: 'kampanye',
    label: 'Bantuan Pangan Keluarga Dhuafa',
    image: 'https://images.unsplash.com/photo-1637034132661-4f015591b84a?w=600&h=400&fit=crop&auto=format',
    terkumpul: 134200000,
    donatur: 521,
  },
  {
    id: 'kampanye-Sosial Dakwah',
    tab: 'kampanye',
    type: 'kampanye',
    label: 'Renovasi Masjid Desa Terpencil',
    image: 'https://images.unsplash.com/photo-1708481686679-1bfebe1afefc?w=600&h=400&fit=crop&auto=format',
    terkumpul: 67800000,
    donatur: 289,
  },
  {
    id: 'pilar-yatim',
    tab: 'pilar',
    type: 'Program Pilar',
    label: 'Beasiswa 50 Anak Yatim Semester Ganjil 2025',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop&auto=format',
    terkumpul: 92300000,
    donatur: 418,
  },
  {
    id: 'kampanye-umkm',
    tab: 'kampanye',
    type: 'kampanye',
    label: 'Alat Produksi UMKM Kerajinan Batik Dhuafa',
    image: 'https://images.unsplash.com/photo-1611087802810-046bb671e644?w=600&h=400&fit=crop&auto=format',
    terkumpul: 38450000,
    donatur: 176,
  },
  {
    id: 'kampanye-tahfidz',
    tab: 'kampanye',
    type: 'kampanye',
    label: 'Majelis Tahfidz Quran untuk 30 Santri',
    image: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600&h=400&fit=crop&auto=format',
    terkumpul: 54100000,
    donatur: 234,
  },
]

const allPrograms: ProgramItem[] = [...zakatPrograms, ...infaqPrograms, ...pilarPrograms, ...kampanyePrograms]

const programsByTab: Record<TabKey, ProgramItem[]> = {
  zakat: zakatPrograms,
  infaq: infaqPrograms,
  pilar: pilarPrograms,
  kampanye: kampanyePrograms,
}

const tabs: { key: TabKey; label: string }[] = [
  { key: 'zakat', label: 'Zakat' },
  { key: 'infaq', label: 'Infaq' },
  { key: 'pilar', label: 'Program Pilar' },
  { key: 'kampanye', label: 'kampanye' },
]

const presets = [10000, 25000, 50000, 100000, 250000, 500000]

const paymentMethods = [
  {
    id: 'va-bca',
    label: 'Virtual Account BCA',
    group: 'Virtual Account',
    accountNumber: '8000-1234-5678-9012',
    bank: 'BCA',
    logo: '',
  },
  {
    id: 'va-bsi',
    label: 'Virtual Account BSI',
    group: 'Virtual Account',
    accountNumber: '9000-8765-4321-0987',
    bank: 'BSI',
    logo: '',
  },
  {
    id: 'va-mandiri',
    label: 'Virtual Account Mandiri',
    group: 'Virtual Account',
    accountNumber: '8855-0011-2233-4455',
    bank: 'Mandiri',
    logo: '',
  },
  {
    id: 'va-bni',
    label: 'Virtual Account BNI',
    group: 'Virtual Account',
    accountNumber: '9889-1122-3344-5566',
    bank: 'BNI',
    logo: '',
  },
  {
    id: 'qris',
    label: 'QRIS (Semua e-Wallet)',
    group: 'QRIS',
    accountNumber: '',
    bank: 'QRIS',
    logo: '',
  },
  {
    id: 'transfer-bca',
    label: 'Transfer Manual BCA',
    group: 'Transfer Bank',
    accountNumber: '123-456-7890',
    bank: 'BCA a.n. LAZISMU Pemalang',
    logo: '',
  },
  {
    id: 'transfer-bsi',
    label: 'Transfer Manual BSI',
    group: 'Transfer Bank',
    accountNumber: '710-1234-567',
    bank: 'BSI a.n. LAZISMU Pemalang',
    logo: '',
  },
]

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n)
}

type Step = 1 | 2 | 3
type UIState = 'form' | 'payment' | 'success'

interface DonasiPageProps {
  initialZakatAmount?: number
  initialProgram?: string
}

function resolveInitialProgram(initialProgram: string | undefined): { tab: TabKey; campaignId: string; step: Step } {
  if (!initialProgram) return { tab: 'zakat', campaignId: '', step: 1 }
  const lower = initialProgram.toLowerCase()
  let tab: TabKey = 'infaq'
  if (lower.includes('zakat')) tab = 'zakat'
  else if (lower.includes('masjid') || lower.includes('wakaf')) tab = 'pilar'
  const match = allPrograms.find(p => p.label.toLowerCase().includes(lower) || lower.includes(p.label.toLowerCase().split(' ')[0]))
  if (match) return { tab: match.tab, campaignId: match.id, step: 2 }
  return { tab, campaignId: '', step: 1 }
}

export default function DonasiPage({ initialZakatAmount, initialProgram }: DonasiPageProps) {
  const fromZakat = initialZakatAmount !== undefined && initialZakatAmount > 0
  const progResolved = resolveInitialProgram(initialProgram)

  const [step, setStep] = useState<Step>(fromZakat ? 2 : progResolved.step)
  const [uiState, setUiState] = useState<UIState>('form')
  const [activeTab, setActiveTab] = useState<TabKey>(fromZakat ? 'zakat' : progResolved.tab)
  const [campaign, setCampaign] = useState(fromZakat ? 'zakat-profesi' : progResolved.campaignId)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(fromZakat ? initialZakatAmount : null)
  const [customAmount, setCustomAmount] = useState('')
  const [name, setName] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('va-bca')

  const amount = selectedAmount !== null
    ? selectedAmount
    : customAmount
    ? parseInt(customAmount.replace(/\./g, ''))
    : 0
  const displayName = isAnonymous ? 'Hamba Allah' : name

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    setCustomAmount(raw ? parseInt(raw).toLocaleString('id-ID') : '')
    setSelectedAmount(null)
  }

  const handleAnonymous = (checked: boolean) => {
    setIsAnonymous(checked)
    if (checked) setName('')
  }

  const canGoStep2 = campaign !== ''
  const canGoStep3 = amount >= 10000 && (isAnonymous || name.trim() !== '') && phone.trim() !== '' && email.trim() !== ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUiState('payment')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleConfirmPayment = () => {
    setUiState('success')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    setUiState('form')
    setStep(1)
    setCampaign('')
    setActiveTab('zakat')
    setSelectedAmount(null)
    setCustomAmount('')
    setName('')
    setPhone('')
    setEmail('')
    setIsAnonymous(false)
    setPaymentMethod('va-bca')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectedCampaign = allPrograms.find(c => c.id === campaign)
  const selectedMethod = paymentMethods.find(m => m.id === paymentMethod)

  /* ── HALAMAN INSTRUKSI PEMBAYARAN ── */
  if (uiState === 'payment') {
    const isQris = selectedMethod?.id === 'qris'
    const isVA = selectedMethod?.group === 'Virtual Account'
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const expiryStr = expiry.toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })

    return (
      <div className="min-h-screen bg-[#FFF8F2] pt-20">
        <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] relative overflow-hidden">
          <div className="absolute inset-0 islamic-geo-bg opacity-20" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-2 mb-4 text-white text-xs font-semibold">
              💳 Instruksi Pembayaran
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Selesaikan Pembayaran Anda
            </h1>
            <p className="text-white/75 text-sm">Ikuti instruksi di bawah untuk menyelesaikan donasi.</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-5">
          <div className="bg-white rounded-2xl border border-[#F3DEC8] p-6 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 mb-1">Total yang harus dibayar</div>
              <div className="text-3xl font-bold text-[#F58220]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {formatRupiah(amount)}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {selectedCampaign?.type} · {selectedCampaign?.label}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-1">Batas waktu bayar</div>
              <div className="text-sm font-semibold text-red-500">{expiryStr}</div>
              <div className="text-xs text-gray-400">24 jam dari sekarang</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#F3DEC8] overflow-hidden">
            <div className="bg-[#FFF8F2] border-b border-[#F3DEC8] px-6 py-4 flex items-center gap-3">
              <span className="text-2xl">{selectedMethod?.logo}</span>
              <div>
                <div className="font-bold text-gray-800 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {selectedMethod?.label}
                </div>
                <div className="text-xs text-gray-400">{selectedMethod?.group}</div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {isQris ? (
                <div className="text-center py-4">
                  <div className="w-48 h-48 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-gray-200">
                    <div className="text-center text-gray-400">
                      <div className="text-4xl mb-2">📱</div>
                      <div className="text-xs">QR Code QRIS</div>
                      <div className="text-xs">akan muncul di sini</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                    Scan QR Code ini menggunakan aplikasi e-wallet atau m-Banking yang mendukung QRIS
                    (GoPay, OVO, Dana, ShopeePay, LinkAja, dll).
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">
                      {isVA ? 'Nomor Virtual Account' : 'Nomor Rekening'}
                    </div>
                    <div className="flex items-center justify-between bg-[#FFF8F2] rounded-xl border border-[#F3DEC8] px-4 py-3">
                      <span className="text-lg font-bold text-gray-800 tracking-widest" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {selectedMethod?.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(selectedMethod?.accountNumber ?? '')}
                        className="text-xs font-semibold text-[#F58220] hover:text-[#D96D0A] transition-colors ml-3 flex items-center gap-1 flex-shrink-0"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Salin
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Bank Tujuan</div>
                      <div className="font-semibold text-gray-800">{selectedMethod?.bank}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Nominal Transfer</div>
                      <div className="font-bold text-[#F58220]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {formatRupiah(amount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Atas Nama</div>
                      <div className="font-semibold text-gray-800">LAZISMU Pemalang</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Kode Unik</div>
                      <div className="font-bold text-gray-800">{Math.floor(Math.random() * 900) + 100}</div>
                    </div>
                  </div>

                  {isVA && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 leading-relaxed">
                      <span className="font-semibold">ℹ️ Cara bayar Virtual Account:</span> Buka m-Banking → Transfer → Virtual Account → masukkan nomor VA di atas → masukkan nominal yang tertera → konfirmasi.
                    </div>
                  )}
                </>
              )}

              <div className="border-t border-[#F3DEC8] pt-5">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Cara Pembayaran</div>
                <ol className="space-y-2">
                  {(isQris
                    ? ['Buka aplikasi e-wallet atau m-Banking Anda', 'Pilih menu Scan QR / QRIS', 'Scan QR Code di atas', `Pastikan nominal ${formatRupiah(amount)} sudah benar`, 'Konfirmasi dan selesaikan pembayaran']
                    : isVA
                    ? ['Buka aplikasi m-Banking Anda', `Pilih menu Transfer → Virtual Account ${selectedMethod?.bank}`, `Masukkan nomor VA: ${selectedMethod?.accountNumber}`, `Masukkan nominal persis ${formatRupiah(amount)}`, 'Konfirmasi dan selesaikan transaksi']
                    : ['Buka aplikasi m-Banking atau ATM Anda', `Pilih Transfer ke Rekening ${selectedMethod?.bank}`, `Masukkan nomor rekening: ${selectedMethod?.accountNumber}`, `Masukkan nominal ${formatRupiah(amount)}`, 'Simpan bukti transfer untuk konfirmasi']
                  ).map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <span
                        className="w-5 h-5 rounded-full bg-[#FEF0E4] text-[#F58220] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#F3DEC8] p-5 text-sm space-y-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Ringkasan Donasi</div>
            <div className="flex justify-between"><span className="text-gray-400">Donatur</span><span className="font-semibold text-gray-800">{displayName}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">WhatsApp</span><span className="font-semibold text-gray-800">+62{phone}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Email</span><span className="font-semibold text-gray-800">{email}</span></div>
          </div>

          <p className="text-center text-xs text-gray-400">
            🔒 Setelah pembayaran berhasil, bukti donasi otomatis dikirim ke WhatsApp & Email Anda.
          </p>

          <button
            onClick={handleConfirmPayment}
            className="btn-primary w-full py-4 font-bold text-base"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            ✓ Saya Sudah Melakukan Pembayaran
          </button>

          <button
            onClick={() => { setUiState('form'); setStep(3) }}
            className="w-full py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Kembali & Ganti Metode Pembayaran
          </button>
        </div>
      </div>
    )
  }

  /* ── HALAMAN SUKSES ── */
  if (uiState === 'success') {
    return (
      <div className="min-h-screen bg-[#FFF8F2] pt-20 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-[#F3DEC8] shadow-lg p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Jazakallah Khair! 🌟
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-2">
            Donasi <span className="font-semibold text-[#F58220]">{formatRupiah(amount)}</span> atas nama{' '}
            <span className="font-semibold text-gray-700">{displayName}</span> sedang diverifikasi.
          </p>
          <p className="text-gray-400 text-sm mb-8">
            Bukti donasi akan dikirim ke <span className="font-medium">{email}</span> dan WhatsApp{' '}
            <span className="font-medium">+62{phone}</span> setelah pembayaran terkonfirmasi.
          </p>
          <div className="bg-[#FFF8F2] border border-[#F3DEC8] rounded-2xl p-5 text-left space-y-2 mb-8 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Program</span>
              <span className="font-semibold text-gray-700 text-right max-w-[60%]">{selectedCampaign?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Jenis</span>
              <span className="font-semibold text-gray-700">{selectedCampaign?.type ?? ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Metode</span>
              <span className="font-semibold text-gray-700">{selectedMethod?.label}</span>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="btn-primary w-full py-3 font-bold text-sm"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Donasi Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-20">
      <div className="bg-gradient-to-br from-[#F58220] to-[#D96D0A] relative overflow-hidden">
        <div className="absolute inset-0 islamic-geo-bg opacity-20" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-2 mb-5 text-white text-xs font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Formulir Donasi — LAZISMU Pemalang
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Tunaikan Kebaikan Anda
          </h1>
          <p className="text-white/75 text-sm">
            Selesaikan donasi dalam 3 langkah mudah. Aman, amanah, dan tersalurkan.
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white border-b border-[#F3DEC8] sticky top-16 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-center gap-3">
            {([1, 2, 3] as Step[]).map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step === s
                        ? 'bg-[#F58220] text-white shadow-md'
                        : step > s
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {step > s ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : s}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden sm:block ${
                      step === s ? 'text-[#F58220]' : step > s ? 'text-green-500' : 'text-gray-400'
                    }`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {s === 1 ? 'Pilih Program' : s === 2 ? 'Data & Nominal' : 'Konfirmasi'}
                  </span>
                </div>
                {s < 3 && (
                  <div className={`w-12 h-px transition-colors duration-300 ${step > s ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit}>

          {/* ── STEP 1: Pilih Program ── */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2
                className="text-xl font-bold text-gray-800 mb-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Pilih Tujuan Donasi
              </h2>
              <p className="text-gray-400 text-sm mb-6">Pilih dan salurkan donasi untuk program yang berarti bagi Anda dan mereka.</p>

              {/* Tabs */}
              <div className="flex border border-[#F3DEC8] rounded-xl overflow-hidden mb-6 bg-white">
                {tabs.map((tab) => (
                  <button
                    type="button"
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setCampaign('') }}
                    className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-[#FEF0E4] text-[#F58220] border-b-2 border-[#F58220]'
                        : 'text-gray-500 hover:text-[#F58220] hover:bg-[#FFF8F2]'
                    }`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Program cards grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {programsByTab[activeTab].map(c => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setCampaign(c.id)}
                    className={`group relative rounded-2xl overflow-hidden border-2 text-left transition-all duration-200 bg-white shadow-sm ${
                      campaign === c.id
                        ? 'border-[#F58220] ring-2 ring-[#F58220]/25 shadow-md'
                        : 'border-[#F3DEC8] hover:border-[#F58220] hover:shadow-md'
                    }`}
                  >
                    <div className="relative h-32 sm:h-36 overflow-hidden bg-orange-50">
                      <img
                        src={c.image}
                        alt={c.label}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {campaign === c.id && (
                        <div className="absolute inset-0 bg-[#F58220]/10" />
                      )}
                      {campaign === c.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#F58220] flex items-center justify-center shadow-md">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <p className="text-[10px] text-gray-400 mb-1 font-medium uppercase tracking-wide">{c.type}</p>
                      <h3
                        className={`text-xs sm:text-sm font-bold leading-snug mb-2 line-clamp-2 ${
                          campaign === c.id ? 'text-[#D96D0A]' : 'text-gray-800'
                        }`}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {c.label}
                      </h3>
                      <div className="h-0.5 w-8 bg-[#F58220] mb-2.5 rounded-full" />
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[9px] text-gray-400 mb-0.5">Donasi Terkumpul</p>
                          <p className="text-xs font-bold text-gray-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {formatRupiah(c.terkumpul)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-gray-400 mb-0.5">Donatur</p>
                          <p className="text-xs font-bold text-gray-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {c.donatur.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={!canGoStep2}
                onClick={() => setStep(2)}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200 ${
                  canGoStep2 ? 'btn-primary' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Lanjut — Isi Data & Nominal →
              </button>
            </div>
          )}

          {/* ── STEP 2: Data & Nominal ── */}
          {step === 2 && (
            <div className="animate-fade-in">
              {selectedCampaign && (
                <div className="flex items-center gap-3 bg-[#FEF0E4] border border-[#F58220]/30 rounded-xl overflow-hidden mb-6">
                  <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                    <img src={selectedCampaign.image} alt={selectedCampaign.label} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 py-2">
                    <div className="text-[10px] text-gray-400 mb-0.5 uppercase tracking-wide">{selectedCampaign.type}</div>
                    <div className="text-sm font-semibold text-[#D96D0A] leading-tight line-clamp-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {selectedCampaign.label}
                    </div>
                  </div>
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-[#F58220] font-semibold hover:underline flex-shrink-0 pr-4">
                    Ubah
                  </button>
                </div>
              )}

              {fromZakat && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-green-700">
                    Nominal zakat <span className="font-bold">{formatRupiah(initialZakatAmount!)}</span> otomatis terisi dari Kalkulator Zakat.
                  </p>
                </div>
              )}

              <h2 className="text-xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Isi Data & Nominal Donasi
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Nama Donatur <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={isAnonymous ? 'Hamba Allah' : name}
                    onChange={e => { if (!isAnonymous) setName(e.target.value) }}
                    readOnly={isAnonymous}
                    placeholder="Masukkan nama lengkap Anda"
                    className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 transition-all ${
                      isAnonymous ? 'bg-gray-50 border-gray-200 text-gray-400 italic' : 'bg-[#FFF8F2] border-[#F3DEC8]'
                    }`}
                  />
                  <label className="flex items-center gap-2.5 mt-2.5 cursor-pointer select-none">
                    <div
                      onClick={() => handleAnonymous(!isAnonymous)}
                      className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all duration-200 flex-shrink-0 ${
                        isAnonymous ? 'bg-[#F58220] border-[#F58220]' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isAnonymous && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      Sembunyikan nama — tampil sebagai{' '}
                      <span className="font-semibold text-[#F58220]">Hamba Allah</span>
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Nomor HP / WhatsApp <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">+62</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="8xx xxxx xxxx"
                      className="w-full bg-[#FFF8F2] border border-[#F3DEC8] rounded-xl pl-14 pr-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">Bukti donasi akan dikirim ke WhatsApp ini.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-[#FFF8F2] border border-[#F3DEC8] rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">Konfirmasi dan laporan donasi dikirim ke email ini.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Nominal Donasi <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {presets.map(p => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => { setSelectedAmount(p); setCustomAmount('') }}
                        className={`py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          selectedAmount === p
                            ? 'bg-[#F58220] text-white shadow-sm'
                            : 'bg-white text-gray-700 border border-[#F3DEC8] hover:border-[#F58220] hover:text-[#F58220]'
                        }`}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {p >= 1_000_000 ? `${p / 1_000_000}jt` : `${p / 1000}rb`}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={
                        selectedAmount !== null && !presets.includes(selectedAmount)
                          ? selectedAmount.toLocaleString('id-ID')
                          : customAmount
                      }
                      onChange={(e) => {
                        setSelectedAmount(null)
                        handleCustomAmount(e)
                      }}
                      onFocus={() => {
                        if (selectedAmount !== null && !presets.includes(selectedAmount)) {
                          setCustomAmount(selectedAmount.toLocaleString('id-ID'))
                          setSelectedAmount(null)
                        }
                      }}
                      placeholder="Nominal lainnya..."
                      className={`w-full rounded-xl pl-12 pr-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 transition-all ${
                        selectedAmount !== null && !presets.includes(selectedAmount)
                          ? 'bg-[#FEF0E4] border-2 border-[#F58220] font-semibold text-[#D96D0A]'
                          : 'bg-[#FFF8F2] border border-[#F3DEC8]'
                      }`}
                    />
                    {selectedAmount !== null && !presets.includes(selectedAmount) && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#F58220] font-semibold bg-[#FEF0E4] px-1.5 py-0.5 rounded-md">
                        Dari Kalkulator
                      </span>
                    )}
                  </div>
                  {amount > 0 && (
                    <div className="mt-3 bg-[#FEF0E4] rounded-xl px-4 py-3 flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Donasi</span>
                      <span className="font-bold text-[#F58220]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {formatRupiah(amount)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 rounded-xl border-2 border-[#F3DEC8] text-gray-600 font-semibold text-sm hover:border-[#F58220] hover:text-[#F58220] transition-all"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  ← Kembali
                </button>
                <button
                  type="button"
                  disabled={!canGoStep3}
                  onClick={() => setStep(3)}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                    canGoStep3 ? 'btn-primary' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Lanjut — Konfirmasi →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Konfirmasi & Bayar ── */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Pilih Metode & Konfirmasi
              </h2>

              <div className="bg-[#FFF8F2] border border-[#F3DEC8] rounded-2xl p-6 mb-6 space-y-3 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-gray-400">Donatur</span>
                  <span className="font-semibold text-gray-800 text-right">{displayName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Kontak</span>
                  <span className="font-semibold text-gray-800">{phone} · {email}</span>
                </div>
                <div className="border-t border-[#F3DEC8]" />
                <div className="flex justify-between items-start">
                  <span className="text-gray-400">Program</span>
                  <span className="font-semibold text-gray-800 text-right max-w-[60%]">{selectedCampaign?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Jenis</span>
                  <span className="font-semibold text-gray-800">{selectedCampaign?.type ?? ''}</span>
                </div>
                <div className="border-t border-[#F3DEC8]" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">Total Donasi</span>
                  <span className="text-xl font-bold text-[#F58220]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {formatRupiah(amount)}
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <label
                  className="block text-sm font-semibold text-gray-700 mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Metode Pembayaran
                </label>
                <div className="relative">
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full appearance-none bg-[#FFF8F2] border border-[#F3DEC8] rounded-xl px-4 py-3.5 pr-10 text-sm text-gray-800 focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 transition-all cursor-pointer"
                  >
                    {['Virtual Account', 'QRIS', 'Transfer Bank'].map(group => (
                      <optgroup key={group} label={group}>
                        {paymentMethods.filter(m => m.group === group).map(m => (
                          <option key={m.id} value={m.id}>{m.logo} {m.label}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {selectedMethod && (
                  <div className="mt-3 flex items-center gap-3 bg-[#FEF0E4] border border-[#F58220]/20 rounded-xl px-4 py-3">
                    <span className="text-xl">{selectedMethod.logo}</span>
                    <div>
                      <div className="text-sm font-semibold text-[#D96D0A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {selectedMethod.label}
                      </div>
                      {selectedMethod.accountNumber && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {selectedMethod.group === 'Virtual Account' ? 'VA:' : 'Rek:'}{' '}
                          <span className="font-mono font-semibold">{selectedMethod.accountNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-center text-xs text-gray-400 mb-5">
                🔒 Transaksi aman & terenkripsi. Bukti donasi dikirim via WhatsApp & Email.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-4 rounded-xl border-2 border-[#F3DEC8] text-gray-600 font-semibold text-sm hover:border-[#F58220] hover:text-[#F58220] transition-all"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  ← Kembali
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary py-4 font-bold text-base"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Selesaikan Donasi {formatRupiah(amount)}
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  )
}
