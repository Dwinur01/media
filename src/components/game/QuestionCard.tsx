import { sanitizeSvg } from '../../utils'
import type { Question } from '../../types'

interface QuestionCardProps {
  question?: Partial<Question>
  categoryName?: string
  className?: string
}

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  rumus:     { label: 'Rumus Pythagoras',   icon: '∑' },
  tripel:    { label: 'Tripel Pythagoras',  icon: '△' },
  jenis:     { label: 'Jenis Segitiga',     icon: '▷' },
  istimewa:  { label: 'Segitiga Istimewa',  icon: '✦' },
  aplikasi:  { label: 'Aplikasi Nyata',     icon: '◈' },
}

export function QuestionCard({
  question,
  categoryName = 'rumus',
  className = '',
}: QuestionCardProps) {
  const qText =
    question?.text ||
    'Segitiga siku-siku memiliki sisi tegak 6 cm dan 8 cm. Berapakah panjang hipotenusanya?'

  const catKey = (question?.type || categoryName || 'rumus').toLowerCase()
  const cat = CATEGORY_LABELS[catKey] || { label: catKey, icon: '△' }
  const svg = question?.svgIllustration
  const note = question?.extraNote

  return (
    <div
      className={[
        'relative overflow-hidden rounded-lg bg-white border border-muted-line',
        'shadow-[0_4px_24px_rgba(15,23,42,0.08),0_0_0_1px_rgba(217,119,6,0.1)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Gold top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Geometric watermark in background */}
      <div className="absolute bottom-0 right-0 pointer-events-none select-none opacity-[0.04]">
        <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
          <polygon points="10,210 210,210 210,10" stroke="#0F172A" strokeWidth="8" />
          <line x1="178" x2="178" y1="210" y2="178" stroke="#0F172A" strokeWidth="4" />
          <line x1="178" x2="210" y1="178" y2="178" stroke="#0F172A" strokeWidth="4" />
          <line x1="110" x2="110" y1="10" y2="210" stroke="#0F172A" strokeWidth="2" strokeDasharray="8 8" />
          <line x1="10" x2="210" y1="110" y2="110" stroke="#0F172A" strokeWidth="2" strokeDasharray="8 8" />
        </svg>
      </div>

      <div className="relative z-10 p-7 sm:p-10 md:p-12">
        {/* Top row: category badge + question id */}
        <div className="flex items-center justify-between mb-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-bg-base border border-gold/40">
            <span className="font-heading text-gold text-sm leading-none">{cat.icon}</span>
            <span className="font-body text-gold text-[11px] uppercase tracking-[0.2em] font-medium">
              {cat.label}
            </span>
          </div>

          {question?.id && (
            <span className="font-mono text-[10px] text-ink/30 tracking-[0.2em] uppercase">
              #{question.id}
            </span>
          )}
        </div>

        {/* Question text — large serif */}
        <h2 className="font-heading text-ink text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug font-normal mb-6">
          {qText}
        </h2>

        {/* Extra note if any */}
        {note && (
          <div className="flex items-start gap-3 mt-4 p-4 bg-gold/8 border-l-2 border-gold">
            <span className="text-gold text-sm mt-0.5">ℹ</span>
            <p className="font-body text-sm text-ink/70 italic leading-relaxed">{note}</p>
          </div>
        )}

        {/* SVG illustration */}
        {svg ? (
          <div
            className="mt-6 p-6 bg-bg-panel border border-ink/10 flex justify-center items-center"
            dangerouslySetInnerHTML={{ __html: sanitizeSvg(svg) }}
          />
        ) : (
          /* Minimal Pythagorean geometric corner mark */
          <div className="mt-6 flex justify-end items-end gap-3 opacity-20">
            <div className="text-ink font-heading text-xs tracking-widest">a² + b² = c²</div>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <polygon points="2,34 34,34 34,2" stroke="#0F172A" strokeWidth="1.5" />
              <line x1="28" x2="28" y1="34" y2="28" stroke="#0F172A" strokeWidth="1" />
              <line x1="28" x2="34" y1="28" y2="28" stroke="#0F172A" strokeWidth="1" />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
