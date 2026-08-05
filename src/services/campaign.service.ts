import { api } from './api'
import type { Campaign, PaginatedResponse } from '../types'

export const campaignService = {
  getCampaigns(filter?: { category?: string; page?: number }): Promise<PaginatedResponse<Campaign>> {
    const params = new URLSearchParams()
    if (filter?.category) params.set('category', filter.category)
    if (filter?.page) params.set('page', String(filter.page))
    return api.get<PaginatedResponse<Campaign>>(`/campaigns?${params}`)
  },

  getCampaignById(id: string): Promise<Campaign> {
    return api.get<Campaign>(`/campaigns/${id}`)
  },

  getFeaturedCampaigns(): Promise<Campaign[]> {
    return api.get<Campaign[]>('/campaigns/featured')
  },

  searchCampaigns(query: string): Promise<Campaign[]> {
    return api.get<Campaign[]>(`/campaigns/search?q=${encodeURIComponent(query)}`)
  },
}

