export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID')
}

export function formatDate(date: string): string {
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
