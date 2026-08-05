import { api } from './api'
import type { News, PaginatedResponse } from '../types'

export const newsService = {
  getNews(page = 1, category?: string): Promise<PaginatedResponse<News>> {
    const params = new URLSearchParams({ page: String(page) })
    if (category) params.set('category', category)
    return api.get<PaginatedResponse<News>>(`/news?${params}`)
  },

  getNewsById(id: string): Promise<News> {
    return api.get<News>(`/news/${id}`)
  },

  getFeaturedNews(): Promise<News[]> {
    return api.get<News[]>('/news/featured')
  },

  getCategories(): Promise<string[]> {
    return api.get<string[]>('/news/categories')
  },
}

