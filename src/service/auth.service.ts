import API_URL from "../lib/api";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: {
            id: number;
            name: string;
            email: string;
            phone: string;
            photo?: string | null;
            status: string;
            role: string;
        };
    };
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
    

    const text = await response.text();

    console.log("STATUS:", response.status);
    console.log("CONTENT TYPE:", response.headers.get("content-type"));
    console.log("RAW RESPONSE:", text);
    

    let data: LoginResponse;

    try {
        data = JSON.parse(text);
    } catch {
        console.error("Response bukan JSON:", text);

        throw new Error(
            "Server mengembalikan response yang bukan JSON."
        );
    }

    if (!response.ok) {
        throw new Error(data.message || "Login gagal");
    }

    return data;
}