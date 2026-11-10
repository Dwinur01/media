import type { Group } from '../../types'

interface LeaderboardPanelProps {
  groups: Group[]
  className?: string
}

const RANK_MEDALS = ['🥇', '🥈', '🥉']

export function LeaderboardPanel({
  groups,
  className = '',
}: LeaderboardPanelProps) {
  const sorted = [...groups].sort((a, b) => b.score - a.score)
  const maxScore = Math.max(...sorted.map((g) => g.score), 1)

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
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-muted-line">
          <div className="flex items-center gap-2.5">
            <div className="w-[2px] h-4 bg-navy" />
            <span className="font-heading text-ink text-lg font-medium tracking-wide">
              Klasemen
            </span>
          </div>
          <span className="text-[10px] font-body text-gold uppercase tracking-widest font-semibold">
            Live
          </span>
        </div>

        {/* Rankings */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-0.5">
          {sorted.map((group, idx) => {
            const pct = Math.max(6, (group.score / maxScore) * 100)
            const isFirst = idx === 0
            const medal = RANK_MEDALS[idx]

            return (
              <div
                key={group.id}
                className={[
                  'transition-all duration-300',
                  isFirst ? 'opacity-100' : 'opacity-80 hover:opacity-100',
                ].join(' ')}
              >
                {/* Name + score row */}
                <div className="flex items-center justify-between mb-1.5 text-xs font-body">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 text-center shrink-0">
                      {medal ? (
                        <span className="text-sm">{medal}</span>
                      ) : (
                        <span className="font-mono text-ink/30">#{idx + 1}</span>
                      )}
                    </span>
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: group.color || '#D97706' }}
                    />
                    <span className={`truncate max-w-[110px] font-medium ${
                      isFirst ? 'text-navy font-bold' : 'text-ink/70'
                    }`}>
                      {group.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-ink/30 text-[10px]">{group.correctCount}✓</span>
                    <span className={`font-bold tabular-nums ${
                      isFirst ? 'text-navy' : 'text-ink/60'
                    }`}>
                      {group.score}
                    </span>
                  </div>
                </div>

                {/* Score bar */}
                <div className="flex items-center gap-2">
                  <div className="w-5 shrink-0" />
                  <div className="flex-1 h-1.5 bg-surface-container overflow-hidden rounded-full">
                    <div
                      className={`h-full transition-all duration-700 ease-out rounded-full ${
                        isFirst
                          ? 'bg-gradient-to-r from-navy to-gold'
                          : 'bg-gradient-to-r from-muted-line to-surface-container-highest'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
