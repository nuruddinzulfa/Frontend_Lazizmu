import type { NavPage } from '../../App'

interface BacaPageProps {
  content: { type: 'berita' | 'artikel'; id: number } | null
  onNavigate: (page: NavPage) => void
}

const beritaData = [
  {
    id: 1,
    title: 'LAZISMU Pemalang Salurkan 500 Paket Sembako untuk Warga Dhuafa',
    excerpt: 'Dalam rangka menyambut bulan Ramadan, LAZISMU Pemalang menyalurkan 500 paket sembako kepada warga kurang mampu di 14 kecamatan.',
    category: 'Kegiatan',
    date: '15 Januari 2025',
    readTime: '4 menit',
    author: 'Tim Redaksi LAZISMU',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&h=500&fit=crop',
    tags: ['Sembako', 'Ramadan', 'Dhuafa', 'Pemalang'],
    body: [
      'Alhamdulillah, dalam rangka menyambut bulan suci Ramadan 1446 H, LAZISMU Pemalang berhasil menghimpun dan menyalurkan 500 paket sembako kepada warga kurang mampu yang tersebar di 14 kecamatan di Kabupaten Pemalang. Program penyaluran ini merupakan bagian dari Program Sosial Ramadan yang diinisiasi setiap tahunnya oleh lembaga.',
      'Setiap paket sembako berisi 5 kg beras, 2 liter minyak goreng, 1 kg gula pasir, 1 bungkus teh, dan berbagai kebutuhan pokok lainnya yang dipilih berdasarkan kebutuhan nyata keluarga penerima manfaat di lapangan. Proses distribusi dilakukan secara bertahap selama tiga hari berturut-turut untuk memastikan semua penerima terlayani dengan baik.',
      'Ketua LAZISMU Pemalang, Dr. H. Ahmad Fauzi, M.Ag, menyampaikan bahwa program ini merupakan wujud nyata kepedulian muzaki kepada saudara-saudara yang membutuhkan. "Kami sangat berterima kasih kepada seluruh donatur yang telah mempercayakan zakatnya kepada LAZISMU Pemalang. Amanah ini kami jaga sebaik-baiknya agar sampai kepada yang benar-benar berhak," ujar beliau.',
      'Penerima manfaat merupakan keluarga yang telah melalui proses verifikasi dan validasi data oleh tim lapangan LAZISMU bersama pengurus masjid setempat. Prioritas diberikan kepada janda lansia, keluarga dengan anggota difabel, dan kepala keluarga yang kehilangan mata pencaharian. Kegiatan ini diharapkan dapat meringankan beban hidup mereka, khususnya dalam menyambut Ramadan dengan penuh kegembiraan.',
      'Program penyaluran sembako Ramadan ini akan terus dilanjutkan pada tahun-tahun berikutnya dengan cakupan yang lebih luas. LAZISMU Pemalang mengajak seluruh lapisan masyarakat untuk turut berpartisipasi dalam program ini melalui donasi zakat, infaq, dan sedekah yang dapat disalurkan melalui rekening resmi lembaga maupun melalui website lazismu-pemalang.org.',
    ],
  },
  {
    id: 2,
    title: 'Pembukaan Program Beasiswa 2025 untuk 200 Pelajar Berprestasi',
    excerpt: 'LAZISMU Pemalang membuka pendaftaran beasiswa bagi pelajar berprestasi dari keluarga kurang mampu untuk tahun akademik 2025.',
    category: 'Pengumuman',
    date: '10 Januari 2025',
    readTime: '5 menit',
    author: 'Divisi Program LAZISMU',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=500&fit=crop',
    tags: ['Beasiswa', 'Pendidikan', 'Pelajar', '2025'],
    body: [
      'LAZISMU Pemalang dengan bangga mengumumkan pembukaan Program Beasiswa Pendidikan 2025 yang menyasar 200 pelajar berprestasi dari keluarga kurang mampu di seluruh wilayah Kabupaten Pemalang. Program ini merupakan wujud komitmen LAZISMU dalam mendukung pendidikan generasi muda Muslim yang cerdas dan berakhlak mulia.',
      'Beasiswa ini terbuka untuk jenjang SD, SMP, SMA, dan perguruan tinggi. Setiap penerima beasiswa akan mendapatkan bantuan biaya pendidikan, perlengkapan sekolah, dan akses program mentoring dari relawan LAZISMU yang berpengalaman di bidang akademik dan pengembangan karakter.',
      'Kriteria utama penerima beasiswa adalah memiliki nilai akademik minimal 8,0 (skala 10), berasal dari keluarga dengan penghasilan di bawah Rp 3 juta per bulan, aktif dalam kegiatan keagamaan di sekolah atau lingkungan tempat tinggal, serta memiliki semangat belajar yang tinggi meskipun keterbatasan ekonomi.',
      'Proses pendaftaran dapat dilakukan mulai 10 Januari hingga 28 Februari 2025 melalui kantor LAZISMU Pemalang atau secara online melalui formulir yang tersedia di website resmi. Calon penerima diwajibkan melampirkan dokumen seperti rapor, surat keterangan tidak mampu, dan surat rekomendasi dari kepala sekolah atau pimpinan pondok pesantren.',
      'LAZISMU Pemalang berharap program beasiswa ini dapat melahirkan generasi muda yang tidak hanya unggul secara akademik, tetapi juga memiliki kesadaran sosial yang tinggi. Di masa depan, penerima beasiswa diharapkan menjadi penggerak perubahan di komunitas mereka dan turut berkontribusi dalam membangun masyarakat yang lebih adil dan sejahtera.',
    ],
  },
  {
    id: 4,
    title: 'Pelatihan UMKM Gratis bagi 50 Penerima Manfaat Program Ekonomi',
    excerpt: 'Puluhan penerima manfaat program pemberdayaan ekonomi LAZISMU mengikuti pelatihan kewirausahaan selama tiga hari.',
    category: 'Kegiatan',
    date: '28 Desember 2024',
    readTime: '4 menit',
    author: 'Divisi Ekonomi LAZISMU',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=500&fit=crop',
    tags: ['UMKM', 'Pelatihan', 'Pemberdayaan', 'Ekonomi'],
    body: [
      'Sebanyak 50 penerima manfaat Program Pemberdayaan Ekonomi LAZISMU Pemalang mengikuti pelatihan kewirausahaan intensif selama tiga hari yang diadakan di Gedung Muhammadiyah Pemalang. Pelatihan ini merupakan kelanjutan dari program modal usaha yang telah diberikan kepada para mustahik pada semester pertama tahun 2024.',
      'Materi pelatihan mencakup manajemen keuangan usaha sederhana, strategi pemasaran digital melalui media sosial, teknik pengemasan produk yang menarik, serta pengetahuan dasar tentang perizinan usaha mikro. Para peserta juga mendapatkan sesi praktik langsung dan pendampingan satu-satu dari mentor yang berpengalaman di bidang UMKM.',
      'Peserta pelatihan berasal dari berbagai latar belakang usaha, mulai dari pedagang makanan, pengrajin batik, peternak kecil, hingga petani hortikultura. Masing-masing peserta telah menerima modal usaha antara Rp 1 juta hingga Rp 5 juta yang disalurkan melalui program zakat produktif LAZISMU Pemalang.',
      'Salah satu peserta, Ibu Suminah (45) dari Kecamatan Comal, mengungkapkan rasa syukurnya atas program ini. "Dengan ilmu yang saya dapat hari ini, insya Allah usaha kue basah saya bisa lebih berkembang dan saya bisa membuka lapangan kerja untuk tetangga saya," ujarnya dengan semangat.',
      'LAZISMU Pemalang berencana untuk terus mengadakan pelatihan serupa secara berkala dan memperluas jangkauan penerima manfaat. Melalui program ekonomi produktif ini, LAZISMU berharap dapat mengangkat status para mustahik menjadi muzaki di masa mendatang, sesuai dengan cita-cita zakat sebagai instrumen transformasi sosial dalam Islam.',
    ],
  },
  {
    id: 5,
    title: 'Pengumuman Penerimaan Relawan LAZISMU 2025',
    excerpt: 'LAZISMU Pemalang membuka pendaftaran relawan untuk membantu berbagai program sosial sepanjang tahun 2025.',
    category: 'Pengumuman',
    date: '20 Desember 2024',
    readTime: '3 menit',
    author: 'Tim SDM LAZISMU',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=500&fit=crop',
    tags: ['Relawan', 'Volunter', 'Sosial', '2025'],
    body: [
      'LAZISMU Pemalang membuka kesempatan bagi masyarakat umum, mahasiswa, dan pemuda Muhammadiyah untuk bergabung sebagai relawan dalam berbagai program sosial sepanjang tahun 2025. Relawan yang terpilih akan dilibatkan dalam kegiatan distribusi bantuan, pendampingan penerima manfaat, serta edukasi zakat kepada masyarakat.',
      'Kami mencari individu yang memiliki jiwa sosial tinggi, komitmen kuat, dan kesediaan untuk belajar bersama tim. Tidak diperlukan pengalaman khusus karena seluruh relawan akan mendapatkan pelatihan dasar tentang filantropi Islam, teknik komunikasi sosial, dan prosedur operasional standar LAZISMU.',
      'Posisi yang tersedia meliputi: Relawan Distribusi Bantuan, Relawan Edukasi Zakat ke Sekolah dan Masjid, Relawan Dokumentasi dan Media Sosial, serta Relawan Pendampingan Mustahik. Setiap relawan akan mendapatkan sertifikat resmi, kaos relawan, dan pengalaman berharga dalam pelayanan sosial berbasis nilai Islam.',
      'Pendaftaran dibuka mulai 20 Desember 2024 hingga 15 Januari 2025. Formulir pendaftaran dapat diisi secara online melalui website LAZISMU Pemalang atau langsung datang ke kantor kami di Jalan Ahmad Yani No. 12, Pemalang. Wawancara singkat akan dilakukan pada akhir Januari 2025.',
      'Mari bersama-sama menjadi bagian dari gerakan kebaikan ini. Setiap aksi nyata Anda sebagai relawan adalah investasi kebaikan yang tak ternilai. LAZISMU Pemalang mengucapkan terima kasih atas kepedulian dan semangat para calon relawan dalam mendukung program-program pemberdayaan masyarakat.',
    ],
  },
  {
    id: 7,
    title: 'Tanggap Darurat Banjir Pemalang: LAZISMU Kirim Tim ke 5 Desa',
    excerpt: 'Tim tanggap bencana LAZISMU Pemalang segera bergerak ke 5 desa terdampak banjir dengan membawa logistik darurat.',
    category: 'Kegiatan',
    date: '10 Desember 2024',
    readTime: '4 menit',
    author: 'Tim Tanggap Bencana LAZISMU',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&h=500&fit=crop',
    tags: ['Bencana', 'Banjir', 'Tanggap Darurat', 'Logistik'],
    body: [
      'Merespons bencana banjir yang melanda lima desa di Kecamatan Comal dan Ulujami, Kabupaten Pemalang, tim tanggap bencana LAZISMU Pemalang bergerak cepat dalam waktu kurang dari 24 jam untuk memberikan bantuan logistik darurat kepada warga terdampak. Tim yang terdiri dari 15 relawan terlatih ini membawa 300 paket makanan siap saji, selimut, obat-obatan, dan perlengkapan sanitasi.',
      'Koordinasi dilakukan bersama Badan Penanggulangan Bencana Daerah (BPBD) Kabupaten Pemalang dan aparat desa setempat untuk memastikan bantuan tepat sasaran dan tidak terjadi duplikasi. Tim LAZISMU juga mendirikan dapur umum darurat di titik pengungsian yang dapat melayani hingga 200 orang per hari.',
      'Kondisi di lapangan cukup memprihatinkan. Ratusan rumah terendam air hingga setinggi 1 meter lebih, dan warga mengungsi ke tempat-tempat yang lebih tinggi seperti sekolah dan masjid. Tim LAZISMU membantu mendistribusikan bantuan hingga ke lokasi-lokasi yang sulit dijangkau menggunakan perahu karet yang dipinjamkan oleh relawan setempat.',
      'Selain bantuan logistik, tim LAZISMU juga memberikan pendampingan psikososial kepada warga yang mengalami trauma akibat bencana, khususnya anak-anak dan lansia. Konselor relawan dari jaringan Muhammadiyah turut dilibatkan untuk memberikan dukungan mental dan spiritual kepada para korban.',
      'LAZISMU Pemalang terus membuka donasi darurat bencana untuk mendukung operasional tim di lapangan dan memperluas jangkauan bantuan. Donasi dapat disalurkan melalui rekening khusus bencana yang tercantum di website resmi. LAZISMU berkomitmen untuk tetap hadir dan melayani masyarakat dalam setiap situasi darurat yang membutuhkan respons cepat.',
    ],
  },
]

const artikelData = [
  {
    id: 1,
    title: 'Hukum Zakat Profesi dalam Islam',
    category: 'Zakat',
    excerpt: 'Pembahasan mendalam tentang kewajiban zakat bagi karyawan dan profesional modern berdasarkan dalil Al-Quran dan hadis.',
    author: 'Ustaz Ahmad Fauzi',
    date: '20 Januari 2025',
    readTime: '5 menit',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=500&fit=crop',
    tags: ['Zakat', 'Profesi', 'Fikih', 'Modern'],
    body: [
      'Zakat profesi atau zakat penghasilan adalah salah satu topik yang sering menjadi pertanyaan di kalangan Muslim modern. Seiring berkembangnya perekonomian dan munculnya berbagai profesi baru, para ulama kontemporer telah berijtihad untuk menetapkan hukum zakat bagi penghasilan yang diperoleh dari pekerjaan, baik sebagai karyawan, wirausahawan, maupun tenaga ahli profesional.',
      'Dasar hukum zakat profesi merujuk pada Quran Surat Al-Baqarah ayat 267 yang artinya: "Hai orang-orang yang beriman, nafkahkanlah (di jalan Allah) sebagian dari hasil usahamu yang baik-baik." Para ulama seperti Yusuf al-Qaradhawi berpendapat bahwa penghasilan dari profesi termasuk dalam cakupan ayat ini, sehingga wajib dizakati apabila telah memenuhi nisab.',
      'Nisab zakat profesi setara dengan 85 gram emas murni per tahun. Jika penghasilan bersih seorang profesional dalam setahun melebihi nilai tersebut, maka ia wajib mengeluarkan zakat sebesar 2,5% dari total penghasilan bersihnya. Perhitungan dapat dilakukan secara bulanan (2,5% dari gaji bersih per bulan) atau secara tahunan (2,5% dari total pendapatan setahun dikurangi kebutuhan pokok).',
      'LAZISMU Pemalang menyediakan layanan konsultasi zakat profesi secara gratis bagi masyarakat yang ingin memahami lebih lanjut tentang kewajiban ini. Tim amil yang berpengalaman siap membantu menghitung kewajiban zakat Anda berdasarkan kondisi keuangan pribadi secara akurat dan sesuai dengan ketentuan syariat.',
      'Membayar zakat profesi bukan sekadar memenuhi kewajiban agama, tetapi juga merupakan investasi sosial yang memiliki dampak nyata bagi pembangunan masyarakat. Setiap rupiah zakat yang Anda tunaikan melalui LAZISMU Pemalang akan dikelola secara amanah dan disalurkan kepada delapan golongan mustahik yang berhak sesuai ketentuan Al-Quran.',
    ],
  },
  {
    id: 2,
    title: 'Keutamaan Infaq di Jalan Allah',
    category: 'Infaq',
    excerpt: 'Allah SWT menjanjikan balasan berlipat ganda bagi orang yang berinfaq dengan ikhlas. Pelajari keutamaan dan manfaatnya.',
    author: 'Ustazah Rina Marliana',
    date: '15 Januari 2025',
    readTime: '4 menit',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&h=500&fit=crop',
    tags: ['Infaq', 'Sedekah', 'Keutamaan', 'Motivasi'],
    body: [
      'Infaq adalah salah satu amalan mulia yang sangat dianjurkan dalam Islam. Berbeda dengan zakat yang bersifat wajib, infaq bersifat sunnah dan tidak terikat batasan nisab maupun haul. Siapapun dapat berinfaq sesuai kemampuannya, dan Allah SWT menjanjikan balasan yang berlipat ganda bagi setiap harta yang diinfaqkan di jalan-Nya.',
      'Allah berfirman dalam Quran Surat Al-Baqarah ayat 261: "Perumpamaan orang yang menginfaqkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai, pada setiap tangkai ada seratus biji. Allah melipatgandakan bagi siapa yang Dia kehendaki, dan Allah Maha Luas, Maha Mengetahui." Ayat ini menggambarkan betapa luar biasanya balasan dari Allah bagi orang yang berinfaq dengan ikhlas.',
      'Selain balasan di akhirat, infaq juga memberikan manfaat nyata di dunia. Studi psikologi menunjukkan bahwa tindakan memberi dapat meningkatkan kebahagiaan dan kepuasan hidup seseorang. Dalam perspektif Islam, infaq membersihkan hati dari sifat kikir, memperkuat tali silaturahmi, dan membangun solidaritas sosial antar sesama Muslim.',
      'LAZISMU Pemalang mengelola dana infaq secara transparan dan profesional. Setiap donasi yang masuk dicatat, diaudit, dan dilaporkan secara berkala kepada publik. Anda dapat memilih program infaq yang sesuai dengan minat Anda, mulai dari beasiswa pendidikan, bantuan kesehatan, pemberdayaan ekonomi, hingga program dakwah digital.',
      'Jangan biarkan kekhawatiran tentang kekurangan harta menghalangi Anda dari berinfaq. Rasulullah SAW bersabda bahwa sedekah tidak akan mengurangi harta. Justru sebaliknya, Allah akan membukakan pintu-pintu rezeki yang tidak terduga bagi orang yang senantiasa berinfaq dengan penuh keikhlasan dan tawakal.',
    ],
  },
  {
    id: 3,
    title: 'Cara Menghitung Zakat Maal dengan Benar',
    category: 'Zakat',
    excerpt: 'Panduan praktis menghitung zakat harta kekayaan sesuai nisab dan haul yang berlaku dalam syariat Islam.',
    author: 'Ust. Bambang Sutrisno',
    date: '10 Januari 2025',
    readTime: '7 menit',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=500&fit=crop',
    tags: ['Zakat Maal', 'Nisab', 'Haul', 'Panduan'],
    body: [
      'Zakat maal adalah zakat yang dikenakan atas harta kekayaan yang dimiliki oleh seorang Muslim apabila telah memenuhi dua syarat utama, yaitu nisab (batas minimum harta yang wajib dizakati) dan haul (kepemilikan selama satu tahun penuh). Memahami cara menghitung zakat maal dengan benar adalah kewajiban setiap Muslim yang hartanya telah mencapai ambang batas tersebut.',
      'Nisab zakat maal setara dengan 85 gram emas murni. Jika harga emas saat ini misalnya Rp 1 juta per gram, maka nisab zakat maal adalah Rp 85 juta. Apabila total harta bersih Anda (setelah dikurangi hutang dan kebutuhan pokok) mencapai atau melebihi Rp 85 juta dan telah dimiliki selama satu tahun penuh, maka Anda wajib mengeluarkan zakat sebesar 2,5% dari total harta tersebut.',
      'Harta yang termasuk dalam kategori zakat maal meliputi: uang tunai dan tabungan di bank, emas dan perak, saham dan investasi, piutang yang diharapkan kembali, serta hasil pertanian dan perniagaan. Harta yang tidak termasuk dalam perhitungan adalah rumah tinggal, kendaraan untuk keperluan sehari-hari, dan peralatan yang digunakan untuk bekerja.',
      'Contoh perhitungan: Seseorang memiliki tabungan Rp 50 juta, emas senilai Rp 40 juta, dan piutang Rp 10 juta. Total harta = Rp 100 juta. Jika nisab zakat maal adalah Rp 85 juta dan telah dimiliki selama satu tahun, maka zakat yang harus dikeluarkan adalah 2,5% x Rp 100 juta = Rp 2,5 juta.',
      'LAZISMU Pemalang menyediakan kalkulator zakat online dan layanan konsultasi untuk membantu Anda menghitung kewajiban zakat maal secara akurat. Jangan ragu untuk menghubungi kantor kami atau mengakses kalkulator zakat di website resmi kami. Tunaikan zakat Anda tepat waktu sebagai bentuk syukur atas nikmat harta yang Allah amanahkan kepada Anda.',
    ],
  },
  {
    id: 4,
    title: 'Wakaf Produktif di Era Modern',
    category: 'Wakaf',
    excerpt: 'Inovasi pengelolaan wakaf produktif yang dapat menghasilkan manfaat berkelanjutan bagi umat Islam.',
    author: 'Dr. Supriyadi',
    date: '5 Januari 2025',
    readTime: '6 menit',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=500&fit=crop',
    tags: ['Wakaf', 'Produktif', 'Inovasi', 'Modern'],
    body: [
      'Wakaf produktif merupakan konsep pengelolaan aset wakaf secara modern yang tidak hanya berfungsi sebagai sarana ibadah semata, tetapi juga dikelola secara profesional untuk menghasilkan keuntungan yang kemudian digunakan untuk mendanai berbagai program sosial dan pemberdayaan umat secara berkelanjutan.',
      'Berbeda dengan wakaf konvensional yang umumnya berupa tanah masjid atau makam, wakaf produktif dapat berupa gedung komersial, lahan pertanian, perkebunan, saham perusahaan, atau bahkan wakaf uang. Hasil dari pengelolaan aset wakaf produktif ini kemudian didistribusikan kepada program-program yang telah ditetapkan oleh pewakaf (waqif) sesuai ketentuan syariat.',
      'Di Indonesia, regulasi wakaf produktif semakin berkembang dengan diterbitkannya Undang-Undang No. 41 Tahun 2004 tentang Wakaf. LAZISMU sebagai lembaga pengelola wakaf yang terdaftar dan terakreditasi berkomitmen untuk mengelola aset wakaf secara transparan, profesional, dan sesuai dengan prinsip-prinsip tata kelola lembaga keuangan syariah.',
      'LAZISMU Pemalang mengelola beberapa program wakaf produktif, di antaranya Wakaf Tanah Pertanian yang hasilnya digunakan untuk beasiswa pelajar, Wakaf Ruko yang memberikan pendapatan rutin untuk operasional program sosial, dan Wakaf Sumur Bor yang menyediakan air bersih bagi masyarakat di wilayah kekeringan.',
      'Berwakaf tidak harus menunggu kaya. Dengan program Wakaf Uang mulai dari Rp 100 ribu, siapapun dapat menjadi wakif dan mendapatkan pahala yang terus mengalir selama harta wakafnya memberikan manfaat. Hubungi LAZISMU Pemalang untuk informasi lebih lanjut tentang pilihan program wakaf yang sesuai dengan kemampuan dan keinginan Anda.',
    ],
  },
  {
    id: 5,
    title: 'Kisah Sahabat yang Dermawan',
    category: 'Inspirasi',
    excerpt: 'Mengambil hikmah dari kisah kedermawanan para sahabat Nabi SAW yang rela mengorbankan harta di jalan Allah.',
    author: 'Ustaz Ahmad Fauzi',
    date: '28 Desember 2024',
    readTime: '8 menit',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=500&fit=crop',
    tags: ['Inspirasi', 'Sahabat', 'Dermawan', 'Kisah'],
    body: [
      'Di antara para sahabat Nabi Muhammad SAW, terdapat teladan-teladan luar biasa tentang kedermawanan yang dapat menginspirasi kita di era modern ini. Kisah-kisah mereka bukan sekadar catatan sejarah, melainkan panduan hidup tentang bagaimana seharusnya seorang Muslim memandang dan mengelola harta kekayaan yang diamanahkan Allah kepadanya.',
      'Sahabat Abu Bakar Ash-Shiddiq ra dikenal sebagai salah satu dermawan terbesar dalam sejarah Islam. Dalam Perang Tabuk, ketika Rasulullah SAW menyerukan infaq untuk membiayai ekspedisi, Abu Bakar menyumbangkan seluruh hartanya. Ketika Rasulullah bertanya apa yang ia tinggalkan untuk keluarganya, Abu Bakar menjawab: "Allah dan Rasul-Nya." Kisah ini mengajarkan kita tentang keikhlasan tertinggi dalam bersedekah.',
      'Usman bin Affan ra adalah contoh lain tentang kedermawanan yang luar biasa. Beliau memborong seluruh kafilah dagang yang membawa kebutuhan umat Islam saat paceklik dan menyumbangkannya tanpa bayaran. Selain itu, Usman membiayai penggalian sumur Raumah yang sebelumnya dikuasai oleh orang Yahudi, kemudian menghibahkannya untuk kepentingan seluruh kaum Muslimin.',
      'Abdurrahman bin Auf ra adalah saudagar sukses yang tidak pernah lupa menunaikan kewajibannya kepada Allah dan sesama. Beliau pernah menginfaqkan separuh hartanya, kemudian sisa hartanya berkembang berlipat ganda. Kisah ini membuktikan janji Allah bahwa sedekah tidak akan mengurangi harta, melainkan justru membuka pintu keberkahan.',
      'Dari kisah para sahabat ini, kita belajar bahwa harta adalah titipan Allah yang harus dikelola dengan penuh tanggung jawab. Salah satu cara mengelola harta sesuai tuntunan Nabi adalah dengan menunaikan zakat, infaq, dan sedekah melalui lembaga terpercaya seperti LAZISMU Pemalang. Mari jadikan kisah para sahabat sebagai motivasi untuk terus meningkatkan amal kebaikan kita.',
    ],
  },
  {
    id: 6,
    title: 'Fikih Zakat Fitrah: Hukum dan Tata Cara',
    category: 'Fiqih',
    excerpt: 'Penjelasan lengkap tentang hukum, waktu, besaran, dan tata cara menunaikan zakat fitrah menjelang Idul Fitri.',
    author: 'Ustazah Rina Marliana',
    date: '20 Desember 2024',
    readTime: '10 menit',
    image: 'https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?w=1200&h=500&fit=crop',
    tags: ['Zakat Fitrah', 'Fikih', 'Ramadan', 'Idul Fitri'],
    body: [
      'Zakat fitrah adalah zakat yang diwajibkan atas setiap jiwa Muslim yang hidup pada saat matahari terbenam di malam terakhir Ramadan. Hukumnya adalah wajib bagi setiap Muslim yang mampu, termasuk bayi yang baru lahir sebelum matahari terbenam di hari terakhir Ramadan. Zakat fitrah diwajibkan bersamaan dengan pensyariatan puasa Ramadan pada tahun kedua hijriah.',
      'Besaran zakat fitrah adalah satu sha atau setara dengan 2,5 kg beras atau makanan pokok lainnya yang biasa dikonsumsi di daerah setempat. Jika dibayarkan dalam bentuk uang, besarannya disesuaikan dengan harga beras kualitas sedang yang berlaku di pasaran setempat. LAZISMU Pemalang setiap tahun menerbitkan standar pembayaran zakat fitrah dalam bentuk uang berdasarkan harga beras terkini.',
      'Waktu pembayaran zakat fitrah dimulai sejak awal Ramadan dan wajib dikeluarkan sebelum shalat Idul Fitri. Waktu yang paling utama adalah pada malam hari Idul Fitri dan pagi harinya sebelum shalat Id. Zakat fitrah yang dibayarkan setelah shalat Id tidak sah sebagai zakat fitrah, melainkan dihitung sebagai sedekah biasa.',
      'Zakat fitrah dapat diserahkan langsung kepada mustahik atau melalui amil zakat yang amanah. Amil zakat bertugas mengumpulkan dan mendistribusikan zakat fitrah kepada delapan golongan penerima, dengan prioritas utama kepada fakir dan miskin agar mereka dapat merayakan Idul Fitri dengan layak. LAZISMU Pemalang membuka posko penerimaan zakat fitrah di berbagai titik strategis setiap Ramadan.',
      'Menunaikan zakat fitrah dengan tepat waktu dan melalui saluran yang benar adalah bentuk kepatuhan seorang Muslim kepada perintah Allah dan sunnah Nabi-Nya. Zakat fitrah bukan sekadar ritual keagamaan, tetapi juga merupakan mekanisme sosial yang memastikan bahwa seluruh anggota masyarakat, termasuk yang paling lemah sekalipun, dapat merasakan kebahagiaan di hari raya Idul Fitri.',
    ],
  },
]

const catColors: Record<string, string> = {
  Kegiatan: 'bg-blue-100 text-blue-700',
  Pengumuman: 'bg-yellow-100 text-yellow-700',
  Zakat: 'bg-blue-100 text-blue-700',
  Infaq: 'bg-green-100 text-green-700',
  Sedekah: 'bg-purple-100 text-purple-700',
  Wakaf: 'bg-orange-100 text-orange-700',
  Fiqih: 'bg-red-100 text-red-700',
  Inspirasi: 'bg-yellow-100 text-yellow-700',
}

export default function BacaPage({ content, onNavigate }: BacaPageProps) {
  if (!content) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] pt-32 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-lg">Konten tidak ditemukan.</p>
          <button onClick={() => onNavigate('berita')} className="mt-4 text-[#F58220] font-semibold hover:underline">
            ← Kembali ke Berita
          </button>
        </div>
      </div>
    )
  }

  const isBerita = content.type === 'berita'
  const article = isBerita
    ? beritaData.find(a => a.id === content.id)
    : artikelData.find(a => a.id === content.id)

  if (!article) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] pt-32 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p>Artikel tidak ditemukan.</p>
          <button onClick={() => onNavigate(isBerita ? 'berita' : 'artikel')} className="mt-4 text-[#F58220] font-semibold hover:underline">
            ← Kembali
          </button>
        </div>
      </div>
    )
  }

  const relatedItems = isBerita
    ? beritaData.filter(a => a.id !== content.id).slice(0, 3)
    : artikelData.filter(a => a.id !== content.id).slice(0, 3)

  const backPage: NavPage = isBerita ? 'berita' : 'artikel'
  const backLabel = isBerita ? 'Kembali ke Berita' : 'Kembali ke Artikel'

  return (
    <div className="min-h-screen bg-[#FFF8F2]">
      {/* Hero */}
      <div className="pt-20">
        <div className="relative">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-72 sm:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-5xl mx-auto">
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${catColors[article.category] ?? 'bg-gray-100 text-gray-700'}`}>
              {article.category}
            </span>
            <h1
              className="text-2xl sm:text-4xl font-bold text-white leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back button */}
        <button
          onClick={() => onNavigate(backPage)}
          className="flex items-center gap-2 text-sm font-semibold text-[#F58220] hover:text-[#D96D0A] transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {backLabel}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main article */}
          <div className="lg:col-span-2">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-[#F3DEC8]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#FEF0E4] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#F58220]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-600">{article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{article.readTime} baca</span>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-5 text-gray-700 leading-relaxed">
              {article.body.map((para, i) => (
                <p key={i} className="text-base">{para}</p>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-[#F3DEC8]">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Tag</p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span key={tag} className="bg-[#FEF0E4] text-[#F58220] text-xs font-semibold px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-8 bg-white border border-[#F3DEC8] rounded-2xl p-6">
              <p className="font-bold text-gray-900 mb-4 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Bagikan Artikel
              </p>
              <div className="flex gap-3">
                {[
                  { label: 'WhatsApp', color: 'bg-green-500', icon: '💬' },
                  { label: 'Facebook', color: 'bg-blue-600', icon: '📘' },
                  { label: 'Twitter / X', color: 'bg-gray-800', icon: '🐦' },
                  { label: 'Telegram', color: 'bg-sky-500', icon: '✈️' },
                ].map(s => (
                  <button
                    key={s.label}
                    className={`flex items-center gap-2 ${s.color} text-white text-xs font-semibold px-3 py-2 rounded-xl hover:opacity-90 transition-opacity`}
                  >
                    <span>{s.icon}</span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author card */}
            <div className="bg-white border border-[#F3DEC8] rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Penulis</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F58220] to-[#D96D0A] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {article.author.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{article.author}</p>
                  <p className="text-xs text-gray-400">Tim LAZISMU Pemalang</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Pengurus LAZISMU Pemalang yang aktif dalam pengelolaan zakat dan edukasi filantropi Islam di Kabupaten Pemalang.
              </p>
            </div>

            {/* Tags sidebar */}
            <div className="bg-white border border-[#F3DEC8] rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Tag Terkait</p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span key={tag} className="bg-[#FEF0E4] text-[#F58220] text-xs font-semibold px-2.5 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent articles */}
            <div className="bg-white border border-[#F3DEC8] rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                {isBerita ? 'Berita Lainnya' : 'Artikel Lainnya'}
              </p>
              <div className="space-y-4">
                {(isBerita ? beritaData : artikelData).filter(a => a.id !== content.id).slice(0, 3).map(a => (
                  <div
                    key={a.id}
                    className="flex gap-3 cursor-pointer group"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                      onNavigate('baca')
                    }}
                  >
                    <img src={a.image} alt={a.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#F58220] transition-colors">{a.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{a.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related articles at bottom */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#FEF0E4] text-[#F58220] px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
              {isBerita ? 'Berita Terkait' : 'Artikel Terkait'}
            </div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Baca Juga
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedItems.map(a => (
              <div
                key={a.id}
                className="bg-white border border-[#F3DEC8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                <img src={a.image} alt={a.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${catColors[a.category] ?? 'bg-gray-100 text-gray-700'}`}>{a.category}</span>
                  <h3 className="font-bold text-gray-900 mt-2 text-sm leading-snug line-clamp-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{a.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{a.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
