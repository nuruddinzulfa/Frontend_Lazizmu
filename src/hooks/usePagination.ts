import { useState } from 'react'

export function usePagination(initialTotalPages = 1) {
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(initialTotalPages)

  const nextPage = () => setPage(p => Math.min(p + 1, totalPages))
  const prevPage = () => setPage(p => Math.max(p - 1, 1))
  const goToPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)))

  return { page, totalPages, setTotalPages, nextPage, prevPage, goToPage }
}
