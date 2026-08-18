import { api } from "./api";

type Role =
  | "Super Admin"
  | "Admin Konten"
  | "Admin Donasi";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  photo: string | null;
  status: "active" | "inactive";
  role: Role | null;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

export const authService = {
  async login(
    email: string,
    password: string
  ): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>(
      "/admin/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem(
      "token",
      res.data.token
    );

    return res;
  },

  async getCurrentUser(): Promise<User> {
    const res =
      await api.get<ProfileResponse>(
        "/admin/profile"
      );

    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post<LogoutResponse>(
        "/admin/logout",
        {}
      );
    } finally {
      localStorage.removeItem("token");
    }
  },
};