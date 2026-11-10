interface TimerCardProps {
  timeRemaining?: number
  duration?: number
  isRunning?: boolean
  onToggle?: () => void
  onReset?: () => void
  className?: string
}

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

  const pct = Math.max(0, Math.min(100, (timeRemaining / (duration || 90)) * 100))
  const isUrgent  = timeRemaining <= 10
  const isWarning = timeRemaining <= 30 && !isUrgent

  const digitColor = isUrgent ? '#DC2626' : isWarning ? '#D97706' : '#1E3A8A'
  const barClass = isUrgent
    ? 'from-red-500 to-red-400'
    : isWarning
    ? 'from-gold to-gold-soft'
    : 'from-navy to-blue-500'

  return (
    <div
      className={[
        'relative overflow-hidden bg-white border transition-all duration-500 rounded-lg shadow-sm',
        isUrgent ? 'border-red-300 shadow-red-100' : 'border-muted-line',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Top colored strip */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${
        isUrgent ? 'from-red-400 via-red-500 to-red-400' : 'from-transparent via-navy to-transparent'
      }`} />

      {/* Subtle corner geometry */}
      <div className="absolute bottom-0 left-0 pointer-events-none opacity-[0.04]">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <polygon points="0,80 80,80 80,0" stroke="#1E3A8A" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10 p-5 sm:p-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-body text-[10px] text-ink/40 uppercase tracking-[0.25em]">
            Sisa Waktu
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              isRunning
                ? isUrgent ? 'bg-red-500 animate-pulse' : 'bg-right animate-pulse'
                : 'bg-muted-line'
            }`} />
            <span className="text-[10px] font-body text-ink/40">
              {isRunning ? (isUrgent ? 'KRITIS' : 'BERJALAN') : 'DIJEDA'}
            </span>
          </div>
        </div>

        {/* Big countdown digits */}
        <div
          role="timer"
          aria-live="off"
          aria-label={`Sisa waktu ${timeFormatted}`}
          className="font-body font-bold text-5xl sm:text-6xl md:text-7xl tracking-tight text-center my-1 transition-colors duration-500 tabular-nums"
          style={{ color: digitColor }}
        >
          {timeFormatted}
        </div>

        {/* Progress bar */}
        <div className="mt-5 space-y-1">
          <div className="w-full h-2 bg-muted-line overflow-hidden rounded-full">
            <div
              className={`h-full bg-gradient-to-r ${barClass} transition-all duration-1000 ease-linear rounded-full`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-ink/30">
            <span>0</span>
            <span>{duration}s</span>
          </div>
        </div>

        {/* Controls */}
        {(onToggle || onReset) && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {onToggle && (
              <button
                onClick={onToggle}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] border border-muted-line hover:border-navy/50 text-ink/50 hover:text-navy transition-all duration-200 font-body uppercase tracking-wider rounded"
              >
                {isRunning ? (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    Jeda
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
                    Lanjut
                  </>
                )}
              </button>
            )}
            {onReset && (
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] border border-muted-line hover:border-navy/50 text-ink/50 hover:text-navy transition-all duration-200 font-body uppercase tracking-wider rounded"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
