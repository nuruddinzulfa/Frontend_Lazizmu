import { useState, useCallback } from 'react'
import type { User } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isLoggedIn = user !== null

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate login - replace with authService.login in real usage
      await new Promise(r => setTimeout(r, 1000))
      const mockUser: User = { id: '1', name: 'Bapak Ahmad', email, phone: '081234567890', createdAt: new Date().toISOString() }
      setUser(mockUser)
      return mockUser
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('lazismu_token')
  }, [])

  return { user, isLoggedIn, login, logout, isLoading }
}
