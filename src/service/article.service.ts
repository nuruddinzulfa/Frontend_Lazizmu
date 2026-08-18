import API_URL from "../lib/api";

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  thumbnail: string | null;

  category:
    | "Zakat"
    | "Infaq"
    | "Sedekah"
    | "Wakaf"
    | "Fiqih"
    | "Inspirasi";

  status: "draft" | "published";

  published_at: string | null;

  views: number;

  created_by: number | null;
  updated_by: number | null;

  created_at: string;
  updated_at: string;
}

export interface ArticlePayload {
  title: string;
  excerpt?: string;
  content: string;

  category:
    | "Zakat"
    | "Infaq"
    | "Sedekah"
    | "Wakaf"
    | "Fiqih"
    | "Inspirasi";

  status: "draft" | "published";

  thumbnail?: File | null;
}

interface ArticleListResponse {
  success: boolean;
  message: string;
  data: Article[];
}

interface ArticleResponse {
  success: boolean;
  message: string;
  data: Article;
}

/*
|--------------------------------------------------------------------------
| TOKEN
|--------------------------------------------------------------------------
*/

function getToken(): string {
  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Anda belum login."
    );
  }

  return token;
}

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

/**
 * Ambil semua artikel published.
 */
export async function getPublicArticles(): Promise<
  Article[]
> {
  const response = await fetch(
    `${API_URL}/articles`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data: ArticleListResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Gagal mengambil daftar artikel."
    );
  }

  return data.data;
}

/**
 * Ambil detail artikel berdasarkan slug.
 *
 * Backend public:
 * GET /api/articles/{slug}
 */
export async function getPublicArticleBySlug(
  slug: string
): Promise<Article> {
  const response = await fetch(
    `${API_URL}/articles/${encodeURIComponent(
      slug
    )}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data: ArticleResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Artikel tidak ditemukan."
    );
  }

  return data.data;
}

/**
 * Compatibility untuk BacaPage.
 *
 * BacaPage masih mengirim ID,
 * sementara backend public detail
 * artikel menggunakan slug.
 */
export async function getPublicArticleById(
  id: number
): Promise<Article> {
  const articles =
    await getPublicArticles();

  const selectedArticle =
    articles.find(
      (article) =>
        article.id === id
    );

  if (!selectedArticle) {
    throw new Error(
      "Artikel tidak ditemukan."
    );
  }

  return getPublicArticleBySlug(
    selectedArticle.slug
  );
}

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

export async function getAdminArticles(): Promise<
  Article[]
> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/admin/articles`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  const data: ArticleListResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Gagal mengambil daftar artikel admin."
    );
  }

  return data.data;
}

export async function getAdminArticleById(
  id: number
): Promise<Article> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/admin/articles/${id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  const data: ArticleResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Gagal mengambil detail artikel admin."
    );
  }

  return data.data;
}

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

export async function createArticle(
  payload: ArticlePayload
): Promise<Article> {
  const token = getToken();

  const formData =
    new FormData();

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
    `${API_URL}/admin/articles`,
    {
      method: "POST",

      headers: {
        Accept: "application/json",
        Authorization:
          `Bearer ${token}`,
      },

      body: formData,
    }
  );

  const data: ArticleResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Gagal membuat artikel."
    );
  }

  return data.data;
}

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

export async function updateArticle(
  id: number,
  payload: ArticlePayload
): Promise<Article> {
  const token = getToken();

  const formData =
    new FormData();

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
    `${API_URL}/admin/articles/${id}`,
    {
      method: "POST",

      headers: {
        Accept: "application/json",
        Authorization:
          `Bearer ${token}`,
      },

      body: formData,
    }
  );

  const data: ArticleResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Gagal memperbarui artikel."
    );
  }

  return data.data;
}

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export async function deleteArticle(
  id: number
): Promise<void> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/admin/articles/${id}`,
    {
      method: "DELETE",

      headers: {
        Accept: "application/json",
        Authorization:
          `Bearer ${token}`,
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
        "Gagal menghapus artikel."
    );
  }
}