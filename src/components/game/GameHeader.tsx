interface GameHeaderProps {
  currentQuestionNumber?: number
  totalQuestions?: number
  groupCount?: number
  onOpenBankSoal?: () => void
}

export function GameHeader({
  currentQuestionNumber = 1,
  totalQuestions = 15,
  groupCount = 8,
  onOpenBankSoal,
}: GameHeaderProps) {
  const progress = Math.round((currentQuestionNumber / totalQuestions) * 100)

  return (
    <header className="w-full sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-muted-line shadow-sm">
      {/* Progress bar at very top */}
      <div className="w-full h-[3px] bg-muted-line">
        <div
          className="h-full bg-gradient-to-r from-navy via-navy to-gold transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-3 flex items-center justify-between">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center border border-navy/30 bg-navy/5 rounded">
            <svg className="w-5 h-5 text-navy" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <polygon points="3,21 21,21 21,5" strokeLinejoin="round" />
              <line x1="17" x2="17" y1="21" y2="17" strokeWidth="1" />
              <line x1="17" x2="21" y1="17" y2="17" strokeWidth="1" />
            </svg>
          </div>
          <div>
            <div className="font-heading text-ink text-base sm:text-lg tracking-widest uppercase leading-none font-medium">
              Pythagoras
            </div>
            <div className="font-body text-gold text-[9px] tracking-[0.3em] uppercase mt-0.5">
              Arena Kuis Kelompok
            </div>
          </div>
        </div>

        {/* Center: Question progress indicator */}
        <div className="hidden md:flex items-center gap-2">
          {Array.from({ length: Math.min(totalQuestions, 20) }, (_, i) => (
            <div
              key={i}
              className={`h-1 transition-all duration-300 rounded-full ${
                i < currentQuestionNumber
                  ? 'bg-navy w-5'
                  : i === currentQuestionNumber - 1
                  ? 'bg-gold w-5'
                  : 'bg-muted-line w-3'
              }`}
            />
          ))}
        </div>

        {/* Right: Badges + Bank Soal */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Soal # badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 border border-navy/30 bg-navy/5 rounded">
            <span className="font-body text-[10px] text-navy/60 uppercase tracking-widest">Soal</span>
            <span className="font-heading text-xl text-navy font-bold leading-none">
              {String(currentQuestionNumber).padStart(2, '0')}
            </span>
            <span className="font-body text-[10px] text-ink/30">/{totalQuestions}</span>
          </div>

          {/* Teams badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-muted-line bg-surface-container rounded">
            <svg className="w-3.5 h-3.5 text-ink/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="font-body text-ink/60 text-[11px]">{groupCount} Tim</span>
          </div>

          {/* Bank Soal button */}
          {onOpenBankSoal && (
            <button
              onClick={onOpenBankSoal}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-muted-line hover:border-navy/50 text-ink/50 hover:text-navy text-[11px] font-body transition-all duration-200 bg-white hover:bg-navy/5 rounded"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
