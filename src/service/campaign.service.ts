import API_URL from "../lib/api";

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

export interface Campaign {
  id: number;

  title: string;
  slug: string;
  category: string;

  short_description: string;
  description: string;

  thumbnail: string | null;

  target_amount: number | string;
  collected_amount: number | string;

  /**
   * Campaign Unggulan
   */
  featured: boolean;

  /**
   * Campaign Urgent
   */
  urgent: boolean;

  status: "draft" | "published" | "closed";

  start_date: string | null;
  end_date: string | null;

  created_at: string;
  updated_at: string;
}

export interface CampaignPayload {
  title: string;
  slug: string;
  category: string;

  short_description: string;
  description: string;

  target_amount: number | string;

  start_date?: string | null;
  end_date?: string | null;

  /**
   * Campaign Unggulan
   */
  featured?: boolean;

  /**
   * Campaign Urgent
   */
  urgent?: boolean;

  status: "draft" | "published" | "closed";

  thumbnail?: File | null;
}

interface CampaignListResponse {
  success: boolean;
  message: string;
  data: Campaign[];
}

interface CampaignResponse {
  success: boolean;
  message: string;
  data: Campaign;
}

/*
|--------------------------------------------------------------------------
| TOKEN
|--------------------------------------------------------------------------
*/

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
 * Mengambil semua campaign yang berstatus published.
 *
 * GET /api/campaigns
 */
export async function getPublicCampaigns(): Promise<Campaign[]> {
  const response = await fetch(`${API_URL}/campaigns`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const data: CampaignListResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Gagal mengambil daftar campaign."
    );
  }

  return data.data;
}

/**
 * Mengambil detail campaign published berdasarkan ID.
 *
 * GET /api/campaigns/{id}
 */
export async function getPublicCampaignById(
  id: number
): Promise<Campaign> {
  const response = await fetch(`${API_URL}/campaigns/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const data: CampaignResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Gagal mengambil detail campaign."
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
 * Mengambil semua campaign untuk admin.
 *
 * GET /api/admin/campaigns
 */
export async function getAdminCampaigns(): Promise<Campaign[]> {
  const token = getToken();

  const response = await fetch(`${API_URL}/admin/campaigns`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data: CampaignListResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Gagal mengambil daftar campaign admin."
    );
  }

  return data.data;
}

/**
 * Mengambil detail campaign untuk admin.
 *
 * GET /api/admin/campaigns/{id}
 */
export async function getAdminCampaignById(
  id: number
): Promise<Campaign> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/admin/campaigns/${id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data: CampaignResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Gagal mengambil detail campaign admin."
    );
  }

  return data.data;
}

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

/**
 * Membuat campaign baru.
 *
 * POST /api/admin/campaigns
 */
export async function createCampaign(
  payload: CampaignPayload
): Promise<Campaign> {
  const token = getToken();

  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("slug", payload.slug);
  formData.append("category", payload.category);
  formData.append("short_description", payload.short_description);
  formData.append("description", payload.description);

  formData.append(
    "target_amount",
    String(payload.target_amount)
  );

  formData.append("status", payload.status);

  formData.append(
    "featured",
    payload.featured ? "1" : "0"
  );

  formData.append(
    "urgent",
    payload.urgent ? "1" : "0"
  );

  if (payload.start_date) {
    formData.append("start_date", payload.start_date);
  }

  if (payload.end_date) {
    formData.append("end_date", payload.end_date);
  }

  if (payload.thumbnail) {
    formData.append("thumbnail", payload.thumbnail);
  }

  const response = await fetch(`${API_URL}/admin/campaigns`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data: CampaignResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Gagal membuat campaign."
    );
  }

  return data.data;
}

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

/**
 * Memperbarui campaign.
 *
 * POST /api/admin/campaigns/{id}
 */
export async function updateCampaign(
  id: number,
  payload: CampaignPayload
): Promise<Campaign> {
  const token = getToken();

  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("slug", payload.slug);
  formData.append("category", payload.category);
  formData.append("short_description", payload.short_description);
  formData.append("description", payload.description);

  formData.append(
    "target_amount",
    String(payload.target_amount)
  );

  formData.append("status", payload.status);

  formData.append(
    "featured",
    payload.featured ? "1" : "0"
  );

  formData.append(
    "urgent",
    payload.urgent ? "1" : "0"
  );

  if (payload.start_date) {
    formData.append("start_date", payload.start_date);
  }

  if (payload.end_date) {
    formData.append("end_date", payload.end_date);
  }

  if (payload.thumbnail) {
    formData.append("thumbnail", payload.thumbnail);
  }

  const response = await fetch(
    `${API_URL}/admin/campaigns/${id}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data: CampaignResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Gagal memperbarui campaign."
    );
  }

  return data.data;
}

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

/**
 * Menghapus campaign.
 *
 * DELETE /api/admin/campaigns/{id}
 */
export async function deleteCampaign(
  id: number
): Promise<void> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/admin/campaigns/${id}`,
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
      data.message || "Gagal menghapus campaign."
    );
  }
}