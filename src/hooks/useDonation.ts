import { useState, useEffect } from 'react'
import type { PaymentMethod } from '../types'

export function useDonation() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])

  useEffect(() => {
    // Mock payment methods
    setPaymentMethods([
      { id: '1', name: 'BCA', code: 'bca', logo: '', type: 'bank' },
      { id: '2', name: 'BRI', code: 'bri', logo: '', type: 'bank' },
      { id: '3', name: 'Mandiri', code: 'mandiri', logo: '', type: 'bank' },
      { id: '4', name: 'GoPay', code: 'gopay', logo: '', type: 'ewallet' },
      { id: '5', name: 'OVO', code: 'ovo', logo: '', type: 'ewallet' },
      { id: '6', name: 'QRIS', code: 'qris', logo: '', type: 'qris' },
    ])
  }, [])

  const submitDonation = async (data: { campaignId: string; amount: number; paymentMethod: string }) => {
    setIsLoading(true)
    setError(null)
    try {
      await new Promise(r => setTimeout(r, 1500))
      return { id: Date.now().toString(), ...data, status: 'Pending' as const }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan')
      throw e
    } finally {
      setIsLoading(false)
    }
  }

  return { submitDonation, isLoading, error, paymentMethods }
}
