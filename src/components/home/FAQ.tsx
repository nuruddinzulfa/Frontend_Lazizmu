import { useEffect, useState } from 'react'
import { useInView } from '../../hooks/useInView'
import API_URL from '../../lib/api'

type FAQItem = {
  id: number
  question: string
  answer: string
  category: string | null
  sort_order: number
  status: string
}

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [open, setOpen] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const { inView, ref } = useInView()

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch(`${API_URL}/faqs`)

        if (!response.ok) {
          throw new Error('Gagal mengambil data FAQ')
        }

        const result = await response.json()

        const items: FAQItem[] = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : []

        const activeFaqs = items
          .filter((faq) => faq.status === 'active')
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

        setFaqs(activeFaqs)

        if (activeFaqs.length > 0) {
          setOpen(activeFaqs[0].id)
        }
      } catch (error) {
        console.error('Error fetching FAQ:', error)
        setFaqs([])
      } finally {
        setLoading(false)
      }
    }

    fetchFaqs()
  }, [])

  return (
    <section className="py-20 bg-[#FFF8F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-14 transition-all duration-700 ${
            inView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="text-[#F58220] text-sm font-semibold uppercase tracking-wider">
            FAQ
          </span>

          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Pertanyaan yang Sering Ditanyakan
          </h2>

          <p className="text-gray-500">
            Temukan jawaban dari pertanyaan yang sering diajukan.
          </p>
        </div>

        <div
          className={`space-y-3 transition-all duration-700 delay-200 ${
            inView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {loading && (
            <div className="bg-white border border-[#F3DEC8] rounded-2xl p-6 text-center">
              <p className="text-gray-500 text-sm">
                Memuat pertanyaan...
              </p>
            </div>
          )}

          {!loading && faqs.length === 0 && (
            <div className="bg-white border border-[#F3DEC8] rounded-2xl p-6 text-center">
              <p className="text-gray-500 text-sm">
                Belum ada FAQ yang tersedia.
              </p>
            </div>
          )}

          {!loading &&
            faqs.map((faq) => {
              const isOpen = open === faq.id

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? 'bg-white border-[#F58220] shadow-sm'
                      : 'bg-white border-[#F3DEC8]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpen(isOpen ? null : faq.id)
                    }
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <div className="pr-8">
                      {faq.category && (
                        <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#F58220] mb-1">
                          {faq.category}
                        </span>
                      )}

                      <span
                        className={`font-semibold text-sm leading-snug ${
                          isOpen
                            ? 'text-[#F58220]'
                            : 'text-gray-800'
                        }`}
                        style={{
                          fontFamily:
                            "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {faq.question}
                      </span>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                        isOpen
                          ? 'bg-[#F58220] text-white rotate-45'
                          : 'bg-[#FEF0E4] text-[#F58220]'
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M12 6v12M6 12h12"
                        />
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      </div>
    </section>
  )
}