import { api } from './api'
import type { AuthResponse, User } from '../types'

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', { email, password })
    localStorage.setItem('lazismu_token', res.token)
    localStorage.setItem('lazismu_refresh_token', res.refreshToken)
    return res
  },

  async register(data: { name: string; email: string; phone: string; password: string }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', data)
    localStorage.setItem('lazismu_token', res.token)
    return res
  },

  logout(): void {
    localStorage.removeItem('lazismu_token')
    localStorage.removeItem('lazismu_refresh_token')
  },

  async getCurrentUser(): Promise<User> {
    return api.get<User>('/auth/me')
  },

  async refreshToken(): Promise<AuthResponse> {
    const refresh = localStorage.getItem('lazismu_refresh_token')
    return api.post<AuthResponse>('/auth/refresh', { refreshToken: refresh })
  },
}

