import { useEffect, useState } from 'react'
import type { Group } from '../../types'
import { AnimatedNumber } from '../shared'

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
    labelColor: '#0369A1',
    nameColor:  '#1E3A8A',
    scoreColor: '#0369A1',
    pillBg:     'bg-gradient-to-t from-sky-100 to-sky-50',
    pillBorder: 'border-sky-500',
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

/** Urutan naik podium: juara 3 → 2 → 1, tiap tahap diberi jeda */
const STEP_MS = 900
const RISE_MS = 700
const CONFETTI_COLORS = ['#2563EB', '#0EA5E9', '#16A34A', '#DB2777', '#EA580C', '#9333EA', '#0D9488']

function Confetti({ startMs }: { startMs: number }) {
  const [pieces] = useState(() =>
    Array.from({ length: 44 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      dx: Math.round((Math.random() - 0.5) * 160),
      delay: startMs + Math.random() * 1600,
      duration: 3200 + Math.random() * 2200,
      size: 7 + Math.random() * 7,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      round: i % 3 === 0,
    })),
  )
  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden motion-reduce:hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 animate-confetti"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.round ? p.size : p.size * 1.6,
            borderRadius: p.round ? '9999px' : '2px',
            backgroundColor: p.color,
            animationDelay: `${p.delay}ms`,
            animationDuration: `${p.duration}ms`,
            ['--dx' as string]: `${p.dx}px`,
          }}
        />
      ))}
    </div>
  )
}

function PodiumScore({ score, delayMs }: { score: number; delayMs: number }) {
  const [go, setGo] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setGo(true), delayMs)
    return () => window.clearTimeout(id)
  }, [delayMs])
  return <AnimatedNumber value={go ? score : 0} durationMs={900} />
}

export function PodiumScreen({
  topThree,
  className = '',
}: PodiumScreenProps) {
  // juara 1 naik paling akhir → konfeti muncul setelah pilar juara 1 berdiri
  const confettiStart = 2 * STEP_MS + RISE_MS
  return (
    <div className={['w-full max-w-3xl mx-auto', className].filter(Boolean).join(' ')}>
      {topThree.length > 0 && <Confetti startMs={confettiStart} />}

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 px-5 py-2 border border-navy/20 bg-navy/5 mb-4 rounded">
          <span className="text-navy text-sm">✦</span>
          <span className="font-body text-sm text-navy font-semibold tracking-wide">
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
          // juara 3 naik dulu (0), lalu juara 2, terakhir juara 1
          const riseDelay = (3 - config.rank) * STEP_MS
          const infoDelay = riseDelay + RISE_MS - 150

          return (
            <div key={group.id} className="flex flex-col items-center">
              <div className="flex flex-col items-center w-full animate-slide-up" style={{ animationDelay: `${infoDelay}ms` }}>
                {/* Medal */}
                <div className="text-3xl sm:text-4xl mb-1">{config.medal}</div>

                {/* Rank label */}
                <div
                  className="font-body text-sm font-bold mb-1"
                  style={{ color: config.labelColor }}
                >
                  Juara {config.rank}
                </div>

                {/* Team name */}
                <p
                  className="font-heading text-lg sm:text-2xl text-center font-semibold px-1 truncate w-full"
                  style={{ color: config.nameColor }}
                >
                  {group.name}
                </p>

                {/* Score */}
                <span
                  className="font-body text-lg sm:text-xl font-bold mt-0.5 tabular-nums"
                  style={{ color: config.scoreColor }}
                >
                  <PodiumScore score={group.score} delayMs={infoDelay} /> pts
                </span>
              </div>

              {/* Pillar block */}
              <div
                style={{ animationDelay: `${riseDelay}ms` }}
                className={[
                  'w-full mt-4 border-t-2 border-x flex flex-col justify-end items-center pb-4 origin-bottom animate-rise',
                  config.pillarH,
                  config.pillBg,
                  config.pillBorder,
                  isFirst ? 'shadow-[0_0_40px_rgba(30,58,138,0.15),inset_0_0_30px_rgba(2,132,199,0.08)]' : 'shadow-sm',
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
