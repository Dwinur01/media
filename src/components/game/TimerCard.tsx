interface TimerCardProps {
  timeRemaining?: number
  duration?: number
  isRunning?: boolean
  onToggle?: () => void
  onReset?: () => void
  className?: string
}

const RADIUS = 88
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function TimerCard({
  timeRemaining = 90,
  duration = 90,
  isRunning = true,
  onToggle,
  onReset,
  className = '',
}: TimerCardProps) {
  const m = Math.floor(timeRemaining / 60)
  const s = timeRemaining % 60
  const timeFormatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`

  const fraction = Math.max(0, Math.min(1, timeRemaining / (duration || 90)))
  const isUrgent = timeRemaining <= 10
  const isWarning = timeRemaining <= 30 && !isUrgent

  const ringColor = isUrgent ? '#DC2626' : isWarning ? '#EA580C' : '#1E3A8A'
  const statusLabel = isRunning ? (isUrgent ? 'Kritis' : 'Berjalan') : 'Dijeda'

  return (
    <div
      className={[
        'relative overflow-hidden bg-white border transition-colors duration-500 rounded-lg shadow-sm',
        isUrgent ? 'border-red-300' : 'border-muted-line',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Top colored strip */}
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${
          isUrgent ? 'from-red-400 via-red-500 to-red-400' : 'from-transparent via-navy to-transparent'
        }`}
      />

      <div className="relative z-10 p-5 sm:p-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-body text-sm text-ink/70 font-medium">Sisa waktu</span>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                isRunning ? (isUrgent ? 'bg-red-500 animate-pulse' : 'bg-right animate-pulse') : 'bg-muted-line'
              }`}
            />
            <span className="text-sm font-body text-ink/70 font-medium">{statusLabel}</span>
          </div>
        </div>

        {/* Cincin hitung mundur + angka */}
        <div className="relative mx-auto w-48 h-48 sm:w-52 sm:h-52 xl:w-56 xl:h-56">
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full -rotate-90" aria-hidden="true">
            <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#E2E8F0" strokeWidth="10" />
            <circle
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              stroke={ringColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
            />
          </svg>
          <div
            role="timer"
            aria-live="off"
            aria-label={`Sisa waktu ${timeFormatted}`}
            className={`absolute inset-0 flex items-center justify-center font-body font-bold text-5xl xl:text-6xl tracking-tight tabular-nums transition-colors duration-500 ${
              isUrgent && isRunning ? 'animate-pulse' : ''
            }`}
            style={{ color: ringColor }}
          >
            {timeFormatted}
          </div>
        </div>

        {/* Controls */}
        {(onToggle || onReset) && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {onToggle && (
              <button
                onClick={onToggle}
                className="flex items-center gap-2 px-4 h-11 text-sm border border-muted-line hover:border-navy/50 text-ink/80 hover:text-navy transition-all duration-200 font-body font-medium rounded"
              >
                {isRunning ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    Jeda
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><polygon points="5,3 19,12 5,21"/></svg>
                    Lanjut
                  </>
                )}
              </button>
            )}
            {onReset && (
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-4 h-11 text-sm border border-muted-line hover:border-navy/50 text-ink/80 hover:text-navy transition-all duration-200 font-body font-medium rounded"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                Reset
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
