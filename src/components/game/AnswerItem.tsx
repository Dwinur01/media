import type { Group } from '../../types'

interface AnswerItemProps {
  group: Group
  value?: string
  isCorrect?: boolean | null
  overridden?: boolean
  disabled?: boolean
  onChange?: (val: string) => void
  /** Guru membalik penilaian (hanya tampil setelah jawaban diperiksa) */
  onToggleCorrect?: () => void
}

export function AnswerItem({
  group,
  value = '',
  isCorrect = null,
  overridden = false,
  disabled = false,
  onChange,
  onToggleCorrect,
}: AnswerItemProps) {
  const isRight = isCorrect === true
  const isWrong = isCorrect === false

  return (
    <div
      className={[
        'relative p-4 border transition-all duration-300 rounded-lg',
        isRight
          ? 'bg-emerald-50 border-emerald-300 shadow-sm'
          : isWrong
          ? 'bg-red-50 border-red-300 shadow-sm'
          : 'bg-white border-muted-line hover:border-navy/30',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Left color accent stripe */}
      <div
        className="absolute top-0 left-0 w-0.5 h-full rounded-l-lg"
        style={{ backgroundColor: group.color || '#D97706', opacity: 0.8 }}
      />

      {/* Team name row */}
      <div className="flex items-center justify-between mb-3 pl-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: group.color || '#D97706' }}
          />
          <span className="font-heading text-ink text-sm sm:text-base font-medium truncate">
            {group.name}
          </span>
        </div>

        {/* Status badge */}
        {isRight && (
          <span className="flex items-center gap-1 text-[11px] font-body font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 border border-emerald-300 uppercase tracking-wider rounded">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Benar{overridden ? ' (dikoreksi)' : ''}
          </span>
        )}
        {isWrong && (
          <span className="flex items-center gap-1 text-[11px] font-body font-semibold text-red-600 bg-red-100 px-2 py-0.5 border border-red-300 uppercase tracking-wider rounded">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
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
          onChange={(e) => onChange?.(e.target.value)}
          aria-label={`Jawaban ${group.name}`}
          placeholder="Jawaban kelompok…"
          className={[
            'w-full px-3.5 py-2.5 text-sm font-body border outline-none transition-all duration-200 rounded',
            'placeholder-ink/30 disabled:cursor-not-allowed',
            isRight
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
              : isWrong
              ? 'bg-red-50 border-red-300 text-red-700 font-semibold'
              : 'bg-surface-container border-muted-line text-ink focus:border-navy focus:ring-1 focus:ring-navy/20',
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
            className="text-[11px] font-body font-medium text-navy hover:text-navy-hover underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-brass rounded"
          >
            {isRight ? 'Ubah ke Salah' : 'Ubah ke Benar'}
          </button>
        </div>
      )}
    </div>
  )
}
