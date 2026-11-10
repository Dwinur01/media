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

  return (
    <div className={`space-y-0 ${className}`}>
      {/* Section header */}
      <div className="flex items-center justify-between px-1 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-[2px] h-5 bg-gold" />
          <h3 className="font-heading text-paper-text text-lg sm:text-xl font-medium tracking-wide">
            Jawaban Kelompok
          </h3>
        </div>
        <div className="text-right">
          {revealed ? (
            <span className="text-[11px] font-body text-gold uppercase tracking-widest">
              {correctCount} / {groups.length} Benar
            </span>
          ) : (
            <span className="text-[11px] font-body text-paper-text/30 uppercase tracking-widest">
              Input Jawaban
            </span>
          )}
        </div>
      </div>

      {/* Answer items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {groups.map((group) => {
          const input = inputs[group.id]
          return (
            <AnswerItem
              key={group.id}
              group={group}
              value={input?.value ?? ''}
              isCorrect={input?.isCorrect ?? null}
              overridden={input?.overridden}
              disabled={revealed}
              onChange={(val) => onInputChange(group.id, val)}
              onToggleCorrect={revealed ? () => onToggleCorrect(group.id) : undefined}
            />
          )
        })}
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between pt-5 mt-2 border-t border-muted-line">
        <div className="text-[10px] font-mono text-paper-text/40 uppercase tracking-widest">
          {groups.length} Kelompok
        </div>

        <div className="flex items-center gap-3">
          {!revealed ? (
            <button
              onClick={onCheckAnswers}
              className="flex items-center gap-2 px-6 py-2.5 bg-navy hover:bg-navy-hover text-white h-[44px] focus:ring-2 focus:ring-brass focus:ring-offset-2 font-body font-semibold text-sm uppercase tracking-wider transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Periksa Jawaban
            </button>
          ) : (
            <button
              onClick={onNextQuestion}
              className="flex items-center gap-2 px-6 py-2.5 bg-navy hover:bg-navy-hover text-white h-[44px] focus:ring-2 focus:ring-brass focus:ring-offset-2 font-body font-semibold text-sm uppercase tracking-wider transition-all duration-200"
            >
              {isLastQuestion ? 'Lihat Hasil' : 'Soal Berikutnya'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
