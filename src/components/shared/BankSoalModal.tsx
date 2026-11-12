import { useState, useMemo, useEffect, useRef } from 'react'
import { questions, CATEGORIES } from '../../data/questions'
import type { QuestionType } from '../../types'
import { sanitizeSvg } from '../../utils'
import { Badge } from './Badge'
import { GoldDivider } from './GoldDivider'
import { Button } from './Button'

interface BankSoalModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BankSoalModal({ isOpen, onClose }: BankSoalModalProps) {
  const [selectedType, setSelectedType] = useState<QuestionType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchType = selectedType === 'all' || q.type === selectedType
      const matchSearch =
        searchQuery.trim() === '' ||
        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.explanation && q.explanation.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchType && matchSearch
    })
  }, [selectedType, searchQuery])

  const dialogRef = useRef<HTMLDivElement>(null)

  // Esc menutup, Tab terkunci di dalam dialog, fokus kembali ke pemicu saat ditutup
  useEffect(() => {
    if (!isOpen) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || active === dialogRef.current)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      previouslyFocused?.focus?.()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const categoryCounts = {
    all: questions.length,
    rumus: questions.filter((q) => q.type === 'rumus').length,
    tripel: questions.filter((q) => q.type === 'tripel').length,
    jenis: questions.filter((q) => q.type === 'jenis').length,
    istimewa: questions.filter((q) => q.type === 'istimewa').length,
    aplikasi: questions.filter((q) => q.type === 'aplikasi').length,
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bank-soal-title"
        tabIndex={-1}
        className="bg-white border border-muted-line rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden outline-none animate-slide-up"
      >
        {/* Header */}
        <div className="p-6 border-b border-muted-line flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xl">📚</span>
              <h2 id="bank-soal-title" className="font-heading text-2xl sm:text-3xl text-ink font-semibold">
                Bank Soal Pythagoras
              </h2>
            </div>
            <p className="font-body text-xs sm:text-sm text-ink/70 mt-1">
              {questions.length} Soal Terstandarisasi dalam 5 Kategori (Termasuk Ilustrasi SVG)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-ink/70 hover:text-ink text-2xl font-bold p-2 transition-colors rounded hover:bg-surface-container"
            title="Tutup"
            aria-label="Tutup bank soal"
          >
            ✕
          </button>
        </div>

        {/* Filter Bar & Search */}
        <div className="p-4 sm:p-6 border-b border-muted-line space-y-4 bg-surface-container/40">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all ${
                selectedType === 'all'
                  ? 'bg-navy text-white font-semibold shadow-sm'
                  : 'bg-white text-ink/70 border border-muted-line hover:bg-surface-container'
              }`}
            >
              Semua ({categoryCounts.all})
            </button>
            {(Object.keys(CATEGORIES) as QuestionType[]).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all ${
                  selectedType === type
                    ? 'bg-navy text-white font-semibold shadow-sm'
                    : 'bg-white text-ink/70 border border-muted-line hover:bg-surface-container'
                }`}
              >
                {CATEGORIES[type].name} ({categoryCounts[type]})
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Cari teks soal, jawaban, atau pembahasan..."
              className="w-full bg-white border border-muted-line rounded-lg px-4 py-2 text-sm text-ink placeholder-ink/40 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy/20 transition-colors font-body shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-ink/70 hover:text-ink"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Soal List Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-bg-base">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-ink/70 font-body">
              Tidak ada soal yang cocok dengan pencarian atau filter kategori ini.
            </div>
          ) : (
            filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="border border-muted-line hover:border-navy/30 rounded-xl p-5 bg-white shadow-sm transition-all space-y-3"
              >
                {/* Meta info */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-lg text-navy font-bold">
                      #{idx + 1}
                    </span>
                    <Badge
                      label={CATEGORIES[q.type]?.name || q.type}
                      color="gold"
                    />
                    <Badge
                      label={
                        q.difficulty === 'easy'
                          ? 'Mudah'
                          : q.difficulty === 'medium'
                          ? 'Sedang'
                          : 'Sulit'
                      }
                      color={
                        q.difficulty === 'easy'
                          ? 'right'
                          : q.difficulty === 'medium'
                          ? 'gold'
                          : 'wrong'
                      }
                    />
                  </div>
                  <span className="text-xs text-ink/70 font-mono">
                    ID: {q.id}
                  </span>
                </div>

                {/* Soal Text & Illustration */}
                <div className="flex flex-col md:flex-row gap-4">
                  <p className="font-heading text-xl text-ink leading-snug flex-1">
                    {q.text}
                  </p>
                  {q.svgIllustration && (
                    <div
                      className="shrink-0 bg-surface-container rounded-lg p-3 border border-muted-line flex items-center justify-center min-w-[120px] max-w-[200px]"
                      dangerouslySetInnerHTML={{ __html: sanitizeSvg(q.svgIllustration) }}
                    />
                  )}
                </div>

                <GoldDivider />

                {/* Answer and Alternatives */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm font-body">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <span className="text-xs text-emerald-700 block font-semibold mb-1">
                      Kunci Jawaban:
                    </span>
                    <span className="font-heading text-lg text-emerald-800 font-bold">
                      {q.answer}
                    </span>
                  </div>

                  <div className="bg-surface-container border border-muted-line rounded-lg p-3">
                    <span className="text-xs text-ink/70 block font-semibold mb-1">
                      Alternatif Diterima:
                    </span>
                    {q.alternativeAnswers && q.alternativeAnswers.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {q.alternativeAnswers.map((alt) => (
                          <span
                            key={alt}
                            className="bg-gold/15 text-brass-text border border-gold/30 px-2 py-0.5 rounded text-xs font-medium"
                          >
                            {alt}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-ink/70 text-xs italic">
                        Tidak ada alternatif
                      </span>
                    )}
                  </div>
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="bg-surface-container border border-muted-line rounded-lg p-3.5 mt-2">
                    <span className="text-xs uppercase tracking-wider text-navy font-semibold mb-1 block">
                      📖 Pembahasan:
                    </span>
                    <p className="font-body text-sm text-ink/80 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-muted-line bg-white flex justify-between items-center text-xs text-ink/70 font-body">
          <span>Menampilkan {filteredQuestions.length} dari {questions.length} soal</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  )
}
