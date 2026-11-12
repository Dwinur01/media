interface GameHeaderProps {
  currentQuestionNumber?: number
  totalQuestions?: number
  groupCount?: number
  onOpenBankSoal?: () => void
  /** Mini-timer di header (hanya tampil di layar < lg, saat timer utama ada di bawah) */
  timeLeft?: number
  timerRunning?: boolean
}

export function GameHeader({
  currentQuestionNumber = 1,
  totalQuestions = 15,
  groupCount = 8,
  onOpenBankSoal,
  timeLeft,
  timerRunning = false,
}: GameHeaderProps) {
  const progress = Math.round((currentQuestionNumber / totalQuestions) * 100)
  const showMiniTimer = typeof timeLeft === 'number'
  const urgent = showMiniTimer && timeLeft <= 10
  const warning = showMiniTimer && timeLeft <= 30 && !urgent
  const mm = showMiniTimer ? String(Math.floor(timeLeft / 60)).padStart(2, '0') : ''
  const ss = showMiniTimer ? String(timeLeft % 60).padStart(2, '0') : ''

  return (
    <header className="w-full sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-muted-line shadow-sm">
      {/* Progress bar at very top */}
      <div
        className="w-full h-[4px] bg-muted-line"
        role="progressbar"
        aria-label="Kemajuan soal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="h-full bg-gradient-to-r from-navy via-navy to-gold transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between gap-3">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 flex items-center justify-center border border-navy/30 bg-navy/5 rounded">
            <svg className="w-5 h-5 text-navy" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
              <polygon points="3,21 21,21 21,5" strokeLinejoin="round" />
              <line x1="17" x2="17" y1="21" y2="17" strokeWidth="1" />
              <line x1="17" x2="21" y1="17" y2="17" strokeWidth="1" />
            </svg>
          </div>
          <div className="min-w-0 hidden sm:block">
            <div className="font-heading text-ink text-lg sm:text-xl tracking-widest uppercase leading-none font-semibold">
              Pythagoras
            </div>
            <div className="hidden sm:block font-body text-gold text-xs tracking-[0.2em] uppercase mt-1 font-medium">
              Arena Kuis Kelompok
            </div>
          </div>
        </div>

        {/* Right: Mini timer (mobile) + badges + Bank Soal */}
        <div className="flex items-center gap-2 sm:gap-3">
          {showMiniTimer && (
            <div
              aria-hidden="true"
              className={`lg:hidden flex items-center gap-1.5 px-3 h-11 rounded border font-body font-bold text-xl tabular-nums ${
                urgent
                  ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
                  : warning
                  ? 'bg-orange-50 border-orange-300 text-orange-700'
                  : 'bg-navy/5 border-navy/30 text-navy'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${timerRunning ? 'bg-current' : 'bg-muted-line'}`} />
              {mm}:{ss}
            </div>
          )}

          {/* Soal # badge */}
          <div className="flex items-center gap-1.5 px-3 h-11 border border-navy/30 bg-navy/5 rounded">
            <span className="font-body text-sm text-navy font-medium">Soal</span>
            <span className="font-heading text-2xl text-navy font-bold leading-none">
              {String(currentQuestionNumber).padStart(2, '0')}
            </span>
            <span className="font-body text-sm text-ink/70">/{totalQuestions}</span>
          </div>

          {/* Teams badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 h-11 border border-muted-line bg-surface-container rounded">
            <svg className="w-4 h-4 text-ink/70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="font-body text-ink/70 text-sm">{groupCount} Tim</span>
          </div>

          {/* Bank Soal button */}
          {onOpenBankSoal && (
            <button
              type="button"
              onClick={onOpenBankSoal}
              aria-label="Buka bank soal"
              className="flex items-center justify-center gap-1.5 px-3 h-11 min-w-11 border border-muted-line hover:border-navy/50 text-ink/70 hover:text-navy text-sm font-body transition-all duration-200 bg-white hover:bg-navy/5 rounded"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span className="hidden md:inline tracking-wide">Bank Soal</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
