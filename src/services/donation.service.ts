import { api } from './api'
import type { Donation, PaymentMethod } from '../types'

export const donationService = {
  createDonation(data: { campaignId: string; amount: number; paymentMethod: string; userId?: string }): Promise<Donation> {
    return api.post<Donation>('/donations', data)
  },

  getDonationHistory(userId: string): Promise<Donation[]> {
    return api.get<Donation[]>(`/donations?userId=${userId}`)
  },

  getDonationById(id: string): Promise<Donation> {
    return api.get<Donation>(`/donations/${id}`)
  },

  getPaymentMethods(): Promise<PaymentMethod[]> {
    return api.get<PaymentMethod[]>('/payment-methods')
  },

  verifyPayment(id: string): Promise<Donation> {
    return api.post<Donation>(`/donations/${id}/verify`, {})
  },
}

