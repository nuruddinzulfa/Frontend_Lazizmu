import { api } from './api'
import type { Publication } from '../types'

export const publicationService = {
  getPublications(type?: string): Promise<Publication[]> {
    const params = type ? `?type=${encodeURIComponent(type)}` : ''
    return api.get<Publication[]>(`/publications${params}`)
  },

  getPublicationById(id: string): Promise<Publication> {
    return api.get<Publication>(`/publications/${id}`)
  },

  async downloadPublication(id: string): Promise<void> {
    const pub = await api.get<Publication>(`/publications/${id}`)
    window.open(pub.fileUrl, '_blank')
  },
}

