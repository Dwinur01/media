import type { Group } from '../../types'

interface PodiumScreenProps {
  topThree: Group[]
  className?: string
}

/* Podium config: [2nd, 1st, 3rd] visual order */
const PODIUM_ORDER = [1, 0, 2]

const PODIUM_CONFIG = [
  {
    rank:       2,
    pillarH:    'h-36 sm:h-44',
    medal:      '🥈',
    labelColor: '#64748B',
    nameColor:  '#0F172A',
    scoreColor: '#64748B',
    pillBg:     'bg-gradient-to-t from-slate-100 to-slate-50',
    pillBorder: 'border-slate-300',
    rankNum:    '2',
  },
  {
    rank:       1,
    pillarH:    'h-52 sm:h-64',
    medal:      '👑',
    labelColor: '#D97706',
    nameColor:  '#1E3A8A',
    scoreColor: '#D97706',
    pillBg:     'bg-gradient-to-t from-amber-50 to-yellow-50',
    pillBorder: 'border-gold',
    rankNum:    '1',
  },
  {
    rank:       3,
    pillarH:    'h-24 sm:h-32',
    medal:      '🥉',
    labelColor: '#B45309',
    nameColor:  '#0F172A',
    scoreColor: '#B45309',
    pillBg:     'bg-gradient-to-t from-orange-50 to-amber-50',
    pillBorder: 'border-amber-300',
    rankNum:    '3',
  },
]

export function PodiumScreen({
  topThree,
  className = '',
}: PodiumScreenProps) {
  return (
    <div className={['w-full max-w-3xl mx-auto', className].filter(Boolean).join(' ')}>
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 px-5 py-2 border border-navy/20 bg-navy/5 mb-4 rounded">
          <span className="text-navy text-sm">✦</span>
          <span className="font-body text-[11px] text-navy/70 uppercase tracking-[0.3em]">
            Podium Kejuaraan
          </span>
          <span className="text-navy text-sm">✦</span>
        </div>
        <h2 className="font-heading text-4xl sm:text-5xl text-ink font-normal">
          Tiga Besar Pemenang
        </h2>
      </div>

      {/* 3-column podium */}
      <div className="grid grid-cols-3 gap-3 sm:gap-5 items-end px-2">
        {PODIUM_ORDER.map((teamIdx, colIdx) => {
          const group  = topThree[teamIdx]
          const config = PODIUM_CONFIG[colIdx]
          if (!group) return <div key={colIdx} />

          const isFirst = config.rank === 1

          return (
            <div key={group.id} className="flex flex-col items-center">
              {/* Medal */}
              <div className="text-3xl sm:text-4xl mb-1">{config.medal}</div>

              {/* Rank label */}
              <div
                className="font-body text-[10px] uppercase tracking-[0.2em] font-semibold mb-1"
                style={{ color: config.labelColor }}
              >
                Juara {config.rank}
              </div>

              {/* Team name */}
              <p
                className="font-heading text-base sm:text-xl text-center font-medium px-1 truncate w-full"
                style={{ color: config.nameColor }}
              >
                {group.name}
              </p>

              {/* Score */}
              <span
                className="font-body text-sm font-bold mt-0.5 tabular-nums"
                style={{ color: config.scoreColor }}
              >
                {group.score} pts
              </span>

              {/* Pillar block */}
              <div
                className={[
                  'w-full mt-4 border-t-2 border-x flex flex-col justify-end items-center pb-4 transition-all duration-500',
                  config.pillarH,
                  config.pillBg,
                  config.pillBorder,
                  isFirst ? 'shadow-[0_0_40px_rgba(30,58,138,0.15),inset_0_0_30px_rgba(217,119,6,0.05)]' : 'shadow-sm',
                ].join(' ')}
              >
                <span
                  className="font-heading text-3xl sm:text-4xl font-extrabold opacity-20"
                  style={{ color: config.labelColor }}
                >
                  {config.rankNum}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
