import { api } from './api'
import type { DashboardStats, DonationSummary, Certificate, User } from '../types'

export const dashboardService = {
  getDashboardStats(userId: string): Promise<DashboardStats> {
    return api.get<DashboardStats>(`/dashboard/${userId}/stats`)
  },

  getDonationSummary(userId: string): Promise<DonationSummary[]> {
    return api.get<DonationSummary[]>(`/dashboard/${userId}/summary`)
  },

  getCertificates(userId: string): Promise<Certificate[]> {
    return api.get<Certificate[]>(`/dashboard/${userId}/certificates`)
  },

  getProfile(userId: string): Promise<User> {
    return api.get<User>(`/users/${userId}`)
  },

  updateProfile(userId: string, data: Partial<User>): Promise<User> {
    return api.put<User>(`/users/${userId}`, data)
  },
}

