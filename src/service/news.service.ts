import API_URL from "../lib/api";

export interface News {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  thumbnail: string | null;
  category: "Kegiatan" | "Pengumuman" | "Laporan";
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
  category: "Kegiatan" | "Pengumuman" | "Laporan";
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

function getToken(): string {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Anda belum login.");
  }

  return token;
}

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

/**
 * Ambil berita published untuk website masyarakat.
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

  return data.data;
}

/**
 * Detail berita published untuk masyarakat.
 */
export async function getPublicNewsById(
  id: number
): Promise<News> {
  const response = await fetch(
    `${API_URL}/news/${id}`,
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
        "Gagal mengambil detail berita."
    );
  }

  return data.data;
}


/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

/**
 * Ambil semua berita untuk dashboard admin.
 *
 * Termasuk:
 * - published
 * - draft
 */
export async function getAdminNews(): Promise<News[]> {
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

  return data.data;
}

/**
 * Detail berita untuk admin.
 *
 * Bisa mengambil draft maupun published.
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

  return data.data;
}


/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
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

  return data.data;
}


/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
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

  return data.data;
}


/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Gagal menghapus berita."
    );
  }
}