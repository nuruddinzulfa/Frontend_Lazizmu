import { api } from './api'
import type { Article, PaginatedResponse } from '../types'

export const articleService = {
  getArticles(filter?: { category?: string; page?: number }): Promise<PaginatedResponse<Article>> {
    const params = new URLSearchParams()
    if (filter?.category) params.set('category', filter.category)
    if (filter?.page) params.set('page', String(filter.page))
    return api.get<PaginatedResponse<Article>>(`/articles?${params}`)
  },

  getArticleById(id: string): Promise<Article> {
    return api.get<Article>(`/articles/${id}`)
  },

  getArticlesByCategory(category: string): Promise<Article[]> {
    return api.get<Article[]>(`/articles?category=${encodeURIComponent(category)}`)
  },

  searchArticles(query: string): Promise<Article[]> {
    return api.get<Article[]>(`/articles/search?q=${encodeURIComponent(query)}`)
  },
}

