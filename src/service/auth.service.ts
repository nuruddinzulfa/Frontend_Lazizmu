import API_URL from "../lib/api";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    photo?: string | null;
    status: string;
    role: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: User;
    };
}

export async function getProfile(): Promise<User> {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Token tidak ditemukan.");
    }

    const response = await fetch(`${API_URL}/admin/profile`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Sesi tidak valid.");
    }

    return data.data;
}
export async function login(
    payload: LoginPayload
): Promise<LoginResponse> {

    const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(payload),
    });


    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login gagal");
    }

    return data;
}

export async function logout(): Promise<void> {
    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    const response = await fetch(`${API_URL}/admin/logout`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
            data?.message || "Logout gagal."
        );
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
}