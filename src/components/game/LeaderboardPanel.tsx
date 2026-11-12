import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Group } from '../../types'
import { teamNumber } from '../../utils'
import { AnimatedNumber } from '../shared'

interface LeaderboardPanelProps {
  groups: Group[]
  className?: string
}

const RANK_MEDALS = ['🥇', '🥈', '🥉']

function prefersReducedMotion(): boolean {
  return !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function LeaderboardPanel({
  groups,
  className = '',
}: LeaderboardPanelProps) {
  const sorted = [...groups].sort((a, b) => b.score - a.score)
  const maxScore = Math.max(...sorted.map((g) => g.score), 1)
  // Banyak tim (>8): rapatkan baris & sembunyikan bar agar semua muat di layar proyektor
  const compact = sorted.length > 8

  // ---- Animasi geser saat urutan berubah (FLIP) ----
  const rowRefs = useRef(new Map<string, HTMLDivElement>())
  const prevTops = useRef(new Map<string, number>())

  useLayoutEffect(() => {
    const reduce = prefersReducedMotion()
    rowRefs.current.forEach((el, id) => {
      const top = el.offsetTop
      const prev = prevTops.current.get(id)
      if (!reduce && prev !== undefined && prev !== top) {
        el.style.transition = 'none'
        el.style.transform = `translateY(${prev - top}px)`
        void el.offsetHeight // paksa reflow
        el.style.transition = 'transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1)'
        el.style.transform = ''
      }
      prevTops.current.set(id, top)
    })
  })

  // ---- Lencana "+N" yang melayang saat skor bertambah ----
  const prevScores = useRef<Map<string, number> | null>(null)
  const [gains, setGains] = useState<Record<string, number>>({})

  useEffect(() => {
    const prev = prevScores.current
    prevScores.current = new Map(groups.map((g) => [g.id, g.score]))
    if (!prev) return
    const next: Record<string, number> = {}
    groups.forEach((g) => {
      const d = g.score - (prev.get(g.id) ?? g.score)
      if (d > 0) next[g.id] = d
    })
    if (Object.keys(next).length === 0) return
    setGains(next)
    const id = window.setTimeout(() => setGains({}), 1800)
    return () => window.clearTimeout(id)
  }, [groups])

  return (
    <div
      className={[
        'relative overflow-hidden bg-white border border-muted-line rounded-lg shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Top navy strip */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-navy to-transparent opacity-40" />

      <div className="relative z-10 p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-muted-line">
          <div className="flex items-center gap-2.5">
            <div className="w-[3px] h-5 bg-navy" />
            <span className="font-heading text-ink text-xl font-semibold tracking-wide">
              Klasemen
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-sm font-body text-gold font-semibold">
            <span className="w-2 h-2 rounded-full bg-right" aria-hidden="true" />
            Langsung
          </span>
        </div>

        {/* Rankings */}
        <ol className={`relative ${compact ? 'space-y-1.5' : 'space-y-3'}`}>
          {sorted.map((group, idx) => {
            const pct = Math.max(6, (group.score / maxScore) * 100)
            const isFirst = idx === 0
            const medal = RANK_MEDALS[idx]
            const gain = gains[group.id]

            return (
              <li
                key={group.id}
                ref={(el) => {
                  if (el) rowRefs.current.set(group.id, el as unknown as HTMLDivElement)
                  else rowRefs.current.delete(group.id)
                }}
                className="relative"
              >
                {/* Name + score row */}
                <div className="flex items-center justify-between mb-1.5 font-body">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 text-center shrink-0">
                      {medal ? (
                        <span className="text-lg" aria-label={`Peringkat ${idx + 1}`}>{medal}</span>
                      ) : (
                        <span className="font-mono text-sm text-ink/70">#{idx + 1}</span>
                      )}
                    </span>
                    <span
                      className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: group.color || '#0369A1' }}
                      aria-hidden="true"
                    >
                      {teamNumber(group.id) ?? idx + 1}
                    </span>
                    <span className={`truncate text-base ${isFirst ? 'text-navy font-bold' : 'text-ink font-medium'}`}>
                      {group.name}
                    </span>
                  </div>
                  <div className="relative flex items-center gap-2 shrink-0">
                    <span className="text-ink/70 text-sm">{group.correctCount}✓</span>
                    <span className={`text-xl font-bold tabular-nums ${isFirst ? 'text-navy' : 'text-ink'}`}>
                      <AnimatedNumber value={group.score} />
                    </span>
                    {gain && (
                      <span
                        aria-hidden="true"
                        className="absolute right-0 -top-5 text-base font-bold text-emerald-600 animate-float-up pointer-events-none"
                      >
                        +{gain}
                      </span>
                    )}
                  </div>
                </div>

                {/* Score bar */}
                <div className={`flex items-center gap-2 ${compact ? 'hidden' : ''}`}>
                  <div className="w-7 shrink-0" />
                  <div className="flex-1 h-2 bg-surface-container overflow-hidden rounded-full">
                    <div
                      className={`h-full transition-all duration-700 ease-out rounded-full ${
                        isFirst
                          ? 'bg-gradient-to-r from-navy to-gold'
                          : 'bg-gradient-to-r from-slate-300 to-slate-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
