import { useEffect, useState } from 'react'
import type { Group, AnswerInput } from '../../types'
import { AnswerItem } from './AnswerItem'

interface AnswerGridProps {
  groups: Group[]
  inputs: Record<string, AnswerInput>
  /** true setelah jawaban diperiksa (fase reveal) */
  revealed: boolean
  isLastQuestion: boolean
  onInputChange: (groupId: string, value: string) => void
  onCheckAnswers: () => void
  onToggleCorrect: (groupId: string) => void
  onNextQuestion: () => void
  className?: string
}

const STAGGER_MS = 90

export function AnswerGrid({
  groups,
  inputs,
  revealed,
  isLastQuestion,
  onInputChange,
  onCheckAnswers,
  onToggleCorrect,
  onNextQuestion,
  className = '',
}: AnswerGridProps) {
  const correctCount = revealed
    ? groups.filter((g) => inputs[g.id]?.isCorrect === true).length
    : 0

  // Hasil muncul berurutan hanya pada reveal pertama; koreksi manual sesudahnya langsung berubah
  const [staggerDone, setStaggerDone] = useState(false)
  useEffect(() => {
    if (!revealed) {
      setStaggerDone(false)
      return
    }
    const id = window.setTimeout(() => setStaggerDone(true), groups.length * STAGGER_MS + 700)
    return () => window.clearTimeout(id)
  }, [revealed, groups.length])

  return (
    <div className={`space-y-0 ${className}`}>
      {/* Section header */}
      <div className="flex items-center justify-between px-1 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-[3px] h-6 bg-gold" />
          <h3 className="font-heading text-paper-text text-xl sm:text-2xl font-semibold tracking-wide">
            Jawaban Kelompok
          </h3>
        </div>
        <div className="text-right">
          {revealed ? (
            <span className="text-base font-body text-gold font-semibold">
              {correctCount} / {groups.length} Benar
            </span>
          ) : (
            <span className="hidden sm:inline text-sm font-body text-paper-text/70">
              Enter = tim berikutnya
            </span>
          )}
        </div>
      </div>

      {/* Answer items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {groups.map((group, i) => {
          const input = inputs[group.id]
          return (
            <AnswerItem
              key={group.id}
              group={group}
              index={i}
              value={input?.value ?? ''}
              isCorrect={input?.isCorrect ?? null}
              overridden={input?.overridden}
              disabled={revealed}
              revealDelayMs={revealed && !staggerDone ? Math.min(i * STAGGER_MS, 1200) : 0}
              onChange={(val) => onInputChange(group.id, val)}
              onSubmit={onCheckAnswers}
              onToggleCorrect={revealed ? () => onToggleCorrect(group.id) : undefined}
            />
          )
        })}
      </div>

      {/* Action bar — menempel di bawah layar agar tombol utama selalu terjangkau */}
      <div className="sticky bottom-0 z-20 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 mt-4 px-6 sm:px-8 py-3 bg-white/95 backdrop-blur border-t border-muted-line rounded-b-lg flex items-center justify-between gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="hidden sm:block text-sm font-body text-paper-text/70">
          {groups.length} kelompok
        </div>

        <div className="flex w-full sm:w-auto items-center gap-3">
          {!revealed ? (
            <button
              onClick={onCheckAnswers}
              className="w-full sm:w-auto justify-center flex items-center gap-2 px-7 bg-navy hover:bg-navy-hover text-white h-[52px] rounded focus:ring-2 focus:ring-brass focus:ring-offset-2 font-body font-semibold text-base tracking-wide transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Periksa Jawaban
            </button>
          ) : (
            <button
              onClick={onNextQuestion}
              className="w-full sm:w-auto justify-center flex items-center gap-2 px-7 bg-navy hover:bg-navy-hover text-white h-[52px] rounded focus:ring-2 focus:ring-brass focus:ring-offset-2 font-body font-semibold text-base tracking-wide transition-all duration-200"
            >
              {isLastQuestion ? 'Lihat Hasil' : 'Soal Berikutnya'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
