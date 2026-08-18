'use client'

export default function SettingsManagement() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1
          className="text-lg font-bold text-gray-900"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Pengaturan
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Informasi konfigurasi sistem administrasi LAZISMU.
        </p>
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <h2 className="text-sm font-bold text-blue-800">
          Informasi Profil Lembaga
        </h2>

        <p className="mt-2 text-sm leading-6 text-blue-700">
          Nama lembaga, alamat, email, nomor telepon, website,
          logo, visi, misi, sejarah, dan informasi organisasi
          dikelola melalui menu <strong>Tentang Kami</strong>.
        </p>
      </div>

      {/* System Status */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Status Sistem
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Informasi konfigurasi operasional aplikasi.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-900">
                Mode Maintenance
              </div>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                Fitur maintenance belum dikonfigurasi melalui backend.
                Saat ini tidak ada tombol perubahan agar tidak menampilkan
                pengaturan yang sebenarnya tidak tersimpan.
              </p>
            </div>

            <span className="w-fit shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
              Belum Tersedia
            </span>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-900">
                Autentikasi Administrator
              </div>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                Akses panel admin menggunakan autentikasi dan token sesi
                berdasarkan akun administrator.
              </p>
            </div>

            <span className="w-fit shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Aktif
            </span>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-900">
                Hak Akses Berbasis Role
              </div>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                Menu dan fitur administrasi dibatasi berdasarkan role
                Super Admin, Admin Donasi, dan Admin Konten.
              </p>
            </div>

            <span className="w-fit shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Aktif
            </span>
          </div>
        </div>
      </div>

      {/* Role Access */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2
            className="font-bold text-gray-900"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Informasi Hak Akses
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Ringkasan cakupan akses berdasarkan role administrator.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-orange-50 p-4">
            <div className="text-sm font-semibold text-[#F58220]">
              Super Admin
            </div>

            <p className="mt-2 text-xs leading-5 text-gray-600">
              Memiliki akses penuh ke seluruh fitur administrasi,
              pengguna, konten, donasi, publikasi, dan pengaturan.
            </p>
          </div>

          <div className="rounded-xl bg-blue-50 p-4">
            <div className="text-sm font-semibold text-blue-600">
              Admin Donasi
            </div>

            <p className="mt-2 text-xs leading-5 text-gray-600">
              Berfokus pada pengelolaan transaksi donasi dan
              fitur administrasi donasi yang diberikan sistem.
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-4">
            <div className="text-sm font-semibold text-green-600">
              Admin Konten
            </div>

            <p className="mt-2 text-xs leading-5 text-gray-600">
              Berfokus pada pengelolaan konten website seperti
              program, berita, artikel, banner, partner, publikasi,
              dan informasi organisasi sesuai hak akses.
            </p>
          </div>
        </div>
      </div>

      {/* Guidance */}
      <div className="rounded-2xl border border-[#F3DEC8] bg-white p-5 shadow-sm">
        <h2
          className="font-bold text-gray-900"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Catatan Konfigurasi
        </h2>

        <div className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
          <p>
            Pengelolaan akun administrator dilakukan melalui menu
            <strong> Pengguna & Admin</strong>.
          </p>

          <p>
            Pengelolaan identitas lembaga dilakukan melalui menu
            <strong> Tentang Kami</strong>.
          </p>

          <p>
            Pengaturan teknis seperti maintenance mode sebaiknya
            diaktifkan setelah tersedia endpoint backend khusus agar
            setiap perubahan benar-benar tersimpan dan berlaku pada
            website.
          </p>
        </div>
      </div>
    </div>
  )
}