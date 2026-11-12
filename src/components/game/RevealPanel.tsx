interface RevealPanelProps {
  answer?: string
  alternativeAnswers?: string[]
  explanation?: string
  className?: string
}

export function RevealPanel({
  answer = '10',
  alternativeAnswers = ['10cm', '10 cm'],
  explanation = 'c² = a² + b² = 6² + 8² = 36 + 64 = 100 → c = √100 = 10 cm',
  className = '',
}: RevealPanelProps) {
  return (
    <div
      className={[
        'relative overflow-hidden bg-white border border-emerald-300 rounded-lg animate-slide-up',
        'shadow-[0_4px_24px_rgba(16,185,129,0.12)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Top green accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

      {/* Background geometry */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-[0.04]">
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
          <circle cx="80" cy="80" r="60" stroke="#0D9488" strokeWidth="40" />
        </svg>
      </div>

      <div className="relative z-10 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 border border-emerald-300 rounded">
            <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div>
            <h3 className="font-heading text-ink text-xl sm:text-2xl font-medium leading-none">
              Kunci Jawaban
            </h3>
            <p className="font-body text-sm text-emerald-700 font-medium mt-1">
              Pembahasan Soal
            </p>
          </div>
        </div>

        {/* Main answer + alternatives */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Primary answer */}
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="text-sm font-body text-emerald-700 font-medium mb-2">
              Jawaban Utama
            </div>
            <div className="font-heading text-emerald-800 text-3xl sm:text-4xl font-bold leading-none">
              {answer}
            </div>
          </div>

          {/* Alternatives */}
          <div className="p-5 bg-surface-container border border-muted-line rounded-lg">
            <div className="text-sm font-body text-ink/70 font-medium mb-3">
              Variasi Diterima
            </div>
            {alternativeAnswers && alternativeAnswers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {alternativeAnswers.map((alt) => (
                  <span
                    key={alt}
                    className="px-2.5 py-1 bg-gold/10 border border-gold/30 text-brass-text text-sm font-body font-medium rounded"
                  >
                    {alt}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-ink/70 italic">Hanya jawaban utama</span>
            )}
          </div>
        </div>

        {/* Explanation */}
        <div className="p-5 bg-surface-container border border-muted-line rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-[2px] h-4 bg-navy" />
            <span className="text-sm font-body text-navy font-semibold">
              Langkah Penyelesaian
            </span>
          </div>
          <p className="font-body text-base sm:text-lg text-ink/80 leading-relaxed">
            {explanation}
          </p>
        </div>
      </div>
    </div>
  )
}
