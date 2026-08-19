import API_URL from "../lib/api";

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

export interface News {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;

  thumbnail: string | null;

  category:
  | "Kegiatan"
  | "Pengumuman"
  | "Laporan";

  status: "draft" | "published";

  published_at: string | null;
  views: number;

  created_by: number | null;
  updated_by: number | null;

  created_at: string;
  updated_at: string;
}

export interface NewsPayload {
  title: string;
  excerpt?: string;
  content: string;

  category:
  | "Kegiatan"
  | "Pengumuman"
  | "Laporan";

  status: "draft" | "published";

  thumbnail?: File | null;
}

interface NewsListResponse {
  success: boolean;
  message: string;
  data: News[];
}

interface NewsResponse {
  success: boolean;
  message: string;
  data: News;
}

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

/**
 * Mengambil token login.
 */
function getToken(): string {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Anda belum login.");
  }

  return token;
}

/**
 * Mengubah path thumbnail Laravel
 * menjadi URL yang bisa langsung digunakan browser.
 *
 * Contoh:
 *
 * news/thumbnails/image.png
 *
 * menjadi:
 *
 * http://127.0.0.1:8000/storage/news/thumbnails/image.png
 */
export function getNewsThumbnailUrl(
  thumbnail: string | null
): string | null {
  if (!thumbnail) {
    return null;
  }

  /**
   * Jika backend sudah mengirim URL lengkap,
   * jangan diproses lagi.
   */
  if (
    thumbnail.startsWith("http://") ||
    thumbnail.startsWith("https://")
  ) {
    return thumbnail;
  }

  /**
   * API_URL:
   *
   * http://127.0.0.1:8000/api
   *
   * Backend URL:
   *
   * http://127.0.0.1:8000
   */
  const backendUrl = API_URL.replace(
    /\/api\/?$/,
    ""
  );

  /**
   * Bersihkan slash di awal.
   */
  const cleanThumbnail = thumbnail
    .replace(/^\/+/, "")
    .replace(/^storage\//, "");

  return `${backendUrl}/storage/${cleanThumbnail}`;
}

/**
 * Normalisasi data berita dari backend.
 *
 * Thumbnail akan otomatis menjadi URL
 * yang dapat digunakan oleh <img src="..." />.
 */
function normalizeNews(news: News): News {
  return {
    ...news,
    thumbnail: getNewsThumbnailUrl(
      news.thumbnail
    ),
  };
}

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

/**
 * Mengambil seluruh berita published.
 *
 * GET /api/news
 */
export async function getNews(): Promise<News[]> {
  const response = await fetch(
    `${API_URL}/news`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data: NewsListResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Gagal mengambil daftar berita."
    );
  }

  return data.data.map(normalizeNews);
}

/**
 * Mengambil detail berita berdasarkan slug.
 *
 * GET /api/news/{slug}
 */
export async function getPublicNewsBySlug(
  slug: string
): Promise<News> {
  const response = await fetch(
    `${API_URL}/news/${encodeURIComponent(slug)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data: NewsResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Berita tidak ditemukan."
    );
  }

  return normalizeNews(data.data);
}

/**
 * Compatibility untuk halaman detail
 * yang masih menggunakan ID.
 */
export async function getPublicNewsById(
  id: number
): Promise<News> {
  const newsList = await getNews();

  const selectedNews = newsList.find(
    (news) => news.id === id
  );

  if (!selectedNews) {
    throw new Error(
      "Berita tidak ditemukan."
    );
  }

  return getPublicNewsBySlug(
    selectedNews.slug
  );
}

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

/**
 * Mengambil seluruh berita untuk admin.
 *
 * GET /api/admin/news
 */
export async function getAdminNews(): Promise<
  News[]
> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/admin/news`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data: NewsListResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Gagal mengambil daftar berita admin."
    );
  }

  return data.data.map(normalizeNews);
}

/**
 * Mengambil detail berita admin.
 *
 * GET /api/admin/news/{id}
 */
export async function getAdminNewsById(
  id: number
): Promise<News> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/admin/news/${id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data: NewsResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Gagal mengambil detail berita admin."
    );
  }

  return normalizeNews(data.data);
}

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

/**
 * Membuat berita baru.
 *
 * POST /api/admin/news
 */
export async function createNews(
  payload: NewsPayload
): Promise<News> {
  const token = getToken();

  const formData = new FormData();

  formData.append(
    "title",
    payload.title
  );

  formData.append(
    "excerpt",
    payload.excerpt || ""
  );

  formData.append(
    "content",
    payload.content
  );

  formData.append(
    "category",
    payload.category
  );

  formData.append(
    "status",
    payload.status
  );

  if (payload.thumbnail) {
    formData.append(
      "thumbnail",
      payload.thumbnail
    );
  }

  const response = await fetch(
    `${API_URL}/admin/news`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data: NewsResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Gagal membuat berita."
    );
  }

  return normalizeNews(data.data);
}

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

/**
 * Memperbarui berita.
 *
 * POST /api/admin/news/{id}
 */
export async function updateNews(
  id: number,
  payload: NewsPayload
): Promise<News> {
  const token = getToken();

  const formData = new FormData();

  formData.append(
    "title",
    payload.title
  );

  formData.append(
    "excerpt",
    payload.excerpt || ""
  );

  formData.append(
    "content",
    payload.content
  );

  formData.append(
    "category",
    payload.category
  );

  formData.append(
    "status",
    payload.status
  );

  if (payload.thumbnail) {
    formData.append(
      "thumbnail",
      payload.thumbnail
    );
  }

  const response = await fetch(
    `${API_URL}/admin/news/${id}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data: NewsResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Gagal memperbarui berita."
    );
  }

  return normalizeNews(data.data);
}

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

/**
 * Menghapus berita.
 *
 * DELETE /api/admin/news/{id}
 */
export async function deleteNews(
  id: number
): Promise<void> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/admin/news/${id}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data: {
    success: boolean;
    message: string;
  } = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Gagal menghapus berita."
    );
  }
}