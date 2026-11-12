import type { Group } from '../../types'
import { teamNumber } from '../../utils'

interface AnswerItemProps {
  group: Group
  /** Urutan tim di grid (0-based): dipakai untuk fokus keyboard & jeda animasi */
  index?: number
  value?: string
  isCorrect?: boolean | null
  overridden?: boolean
  disabled?: boolean
  /** Jeda (ms) sebelum hasil benar/salah ditampilkan — memberi efek berurutan */
  revealDelayMs?: number
  onChange?: (val: string) => void
  /** Enter di isian terakhir */
  onSubmit?: () => void
  /** Guru membalik penilaian (hanya tampil setelah jawaban diperiksa) */
  onToggleCorrect?: () => void
}

export function AnswerItem({
  group,
  index = 0,
  value = '',
  isCorrect = null,
  overridden = false,
  disabled = false,
  revealDelayMs = 0,
  onChange,
  onSubmit,
  onToggleCorrect,
}: AnswerItemProps) {
  const isRight = isCorrect === true
  const isWrong = isCorrect === false
  const number = teamNumber(group.id) ?? index + 1
  const delayStyle = { animationDelay: `${revealDelayMs}ms`, transitionDelay: `${revealDelayMs}ms` }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return
    e.preventDefault()
    const next = document.querySelector<HTMLInputElement>(`[data-team-input="${index + 1}"]`)
    if (next) next.focus()
    else onSubmit?.()
  }

  return (
    <div
      style={delayStyle}
      className={[
        'relative p-4 border transition-all duration-300 rounded-lg',
        isRight
          ? 'bg-emerald-50 border-emerald-300 shadow-sm animate-pop'
          : isWrong
          ? 'bg-red-50 border-red-300 shadow-sm animate-shake'
          : 'bg-white border-muted-line hover:border-navy/30 focus-within:border-navy/50',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Left color accent stripe */}
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l-lg"
        style={{ backgroundColor: group.color || '#0369A1' }}
      />

      {/* Team name row */}
      <div className="flex items-center justify-between gap-2 mb-3 pl-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: group.color || '#0369A1' }}
            aria-hidden="true"
          >
            {number}
          </span>
          <span className="font-heading text-ink text-base sm:text-lg font-semibold truncate">
            {group.name}
          </span>
        </div>

        {/* Status badge */}
        {isRight && (
          <span
            style={{ animationDelay: `${revealDelayMs}ms` }}
            className="flex items-center gap-1 text-sm font-body font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 border border-emerald-300 rounded animate-fade-in shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Benar{overridden ? ' (dikoreksi)' : ''}
          </span>
        )}
        {isWrong && (
          <span
            style={{ animationDelay: `${revealDelayMs}ms` }}
            className="flex items-center gap-1 text-sm font-body font-semibold text-red-700 bg-red-100 px-2.5 py-0.5 border border-red-300 rounded animate-fade-in shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            Salah{overridden ? ' (dikoreksi)' : ''}
          </span>
        )}
      </div>

      {/* Input field */}
      <div className="pl-2 relative">
        <input
          type="text"
          value={value}
          disabled={disabled}
          data-team-input={index}
          enterKeyHint={onSubmit ? 'done' : 'next'}
          autoComplete="off"
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label={`Jawaban ${group.name}`}
          placeholder="Jawaban kelompok…"
          className={[
            'w-full px-3.5 py-3 text-base font-body border outline-none transition-all duration-200 rounded',
            'placeholder-ink/50 disabled:cursor-not-allowed',
            isRight
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
              : isWrong
              ? 'bg-red-50 border-red-300 text-red-800 font-semibold'
              : 'bg-surface-container border-muted-line text-ink focus:border-navy focus:ring-2 focus:ring-navy/20',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </div>

      {onToggleCorrect && isCorrect !== null && (
        <div className="pl-2 mt-2 flex justify-end">
          <button
            type="button"
            onClick={onToggleCorrect}
            className="text-sm font-body font-medium text-navy hover:text-navy-hover underline underline-offset-2 px-1 py-1.5 rounded"
          >
            {isRight ? 'Ubah ke Salah' : 'Ubah ke Benar'}
          </button>
        </div>
      )}
    </div>
  )
}
