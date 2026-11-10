import type { Group } from '../../types'

interface FinalRankingListProps {
  groups: Group[]
  className?: string
}

const MEDALS = ['🥇', '🥈', '🥉']

export function FinalRankingList({
  groups,
  className = '',
}: FinalRankingListProps) {
  const sorted   = [...groups].sort((a, b) => b.score - a.score)
  const maxScore = Math.max(...sorted.map((g) => g.score), 1)

  return (
    <div
      className={[
        'w-full max-w-3xl mx-auto relative overflow-hidden bg-white border border-muted-line rounded-xl',
        'shadow-[0_4px_24px_rgba(15,23,42,0.08)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Navy top strip */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-navy to-transparent opacity-60" />

      {/* Header */}
      <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-muted-line flex items-center justify-between">
        <div>
          <h3 className="font-heading text-ink text-2xl sm:text-3xl font-normal">
            Klasemen Lengkap
          </h3>
          <p className="font-body text-[11px] text-gold uppercase tracking-widest mt-0.5 font-semibold">
            Hasil Akhir Seluruh Kelompok
          </p>
        </div>
        <div className="font-mono text-[10px] text-ink/30 uppercase tracking-wider">
          {sorted.length} Tim
        </div>
      </div>

      {/* Rankings */}
      <div className="px-4 sm:px-6 py-4 space-y-2">
        {sorted.map((group, idx) => {
          const pct    = Math.max(4, (group.score / maxScore) * 100)
          const medal  = MEDALS[idx]
          const isTop  = idx < 3
          const isFirst = idx === 0

          return (
            <div
              key={group.id}
              className={[
                'relative overflow-hidden border transition-all duration-200 rounded-lg',
                isFirst
                  ? 'bg-amber-50 border-gold/40'
                  : isTop
                  ? 'bg-white border-muted-line hover:border-navy/20'
                  : 'bg-surface-container border-muted-line hover:border-navy/20',
              ].join(' ')}
            >
              {/* Left color stripe */}
              <div
                className="absolute left-0 top-0 bottom-0 w-0.5"
                style={{ backgroundColor: group.color || '#D97706', opacity: isFirst ? 1 : 0.5 }}
              />

              <div className="pl-5 pr-4 py-3.5">
                {/* Top row: rank + name + score */}
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank / Medal */}
                    <div className="w-8 text-center shrink-0">
                      {medal ? (
                        <span className="text-xl">{medal}</span>
                      ) : (
                        <span className="font-mono text-sm text-ink/30">#{idx + 1}</span>
                      )}
                    </div>

                    {/* Color dot + name */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rotate-45 shrink-0"
                        style={{ backgroundColor: group.color || '#D97706' }}
                      />
                      <span
                        className={`font-heading text-base sm:text-lg truncate ${
                          isFirst ? 'text-navy font-bold' : 'text-ink/80'
                        }`}
                      >
                        {group.name}
                      </span>
                    </div>
                  </div>

                  {/* Score + correct */}
                  <div className="flex items-baseline gap-2 shrink-0">
                    <span className="text-[11px] text-ink/30 font-body hidden sm:inline">
                      {group.correctCount} benar
                    </span>
                    <span
                      className={`font-body font-bold text-lg tabular-nums ${
                        isFirst ? 'text-navy' : 'text-ink/70'
                      }`}
                    >
                      {group.score}
                      <span className="text-xs font-normal text-ink/30 ml-1">pts</span>
                    </span>
                  </div>
                </div>

                {/* Score bar */}
                <div className="ml-11 h-1.5 bg-muted-line overflow-hidden rounded-full">
                  <div
                    className={`h-full transition-all duration-700 ease-out rounded-full ${
                      isFirst
                        ? 'bg-gradient-to-r from-navy to-gold'
                        : isTop
                        ? 'bg-gradient-to-r from-navy/40 to-navy/20'
                        : 'bg-muted-line'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-muted-line flex items-center justify-center">
        <span className="font-body text-[10px] text-ink/30 uppercase tracking-widest">
          — Akhir Pertandingan —
        </span>
      </div>
    </div>
  )
}
