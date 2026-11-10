import { useGame } from '../../context/GameContext'
import { PodiumScreen } from './PodiumScreen'
import { FinalRankingList } from './FinalRankingList'
import type { Group } from '../../types'

export function ResultScreen() {
  const { state, resetGame } = useGame()

  const groups: Group[] = state.teams.map((t) => {
    const s = state.scores.find((sc) => sc.teamId === t.id)
    return {
      id:           t.id,
      name:         t.name,
      color:        t.color || '#D97706',
      score:        s?.score ?? 0,
      correctCount: s?.correctAnswers ?? 0,
    }
  })

  const sorted   = [...groups].sort((a, b) => b.score - a.score)
  const topThree = sorted.slice(0, 3)

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center font-body text-paper-text relative overflow-x-hidden">

      {/* Watermark */}
      <div className="pointer-events-none select-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.025] z-0">
        <div className="font-heading text-[18vw] text-navy whitespace-nowrap leading-none">
          a²+b²=c²
        </div>
      </div>

      {/* TOP NAV BAR */}
      <div className="w-full border-b border-muted-line bg-white/95 sticky top-0 z-40 shadow-sm">
        <div className="h-[3px] bg-gradient-to-r from-navy via-gold to-navy opacity-60" />
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-navy/50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <polygon points="3,21 21,21 21,5" strokeLinejoin="round" />
              <line x1="17" x2="17" y1="21" y2="17" strokeWidth="1" />
              <line x1="17" x2="21" y1="17" y2="17" strokeWidth="1" />
            </svg>
            <span className="font-heading text-ink/70 text-sm tracking-widest uppercase">
              Pythagoras · Hasil Akhir
            </span>
          </div>
          <span className="font-body text-[10px] text-gold uppercase tracking-widest font-semibold">
            {state.questions.length} Soal · {state.teams.length} Tim
          </span>
        </div>
      </div>

      {/* HERO HEADER */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-3 px-5 py-2 border border-navy/20 bg-navy/5 mb-6 rounded">
          <span className="text-navy text-xs">✦</span>
          <span className="font-body text-[11px] text-navy/70 uppercase tracking-[0.3em]">
            Sesi Kuis Selesai
          </span>
          <span className="text-navy text-xs">✦</span>
        </div>

        <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl text-ink font-normal leading-tight mb-2">
          Papan Skor Akhir
        </h1>
        <h2 className="font-heading text-2xl sm:text-3xl text-gold italic font-light">
          Kuis Kelompok Pythagoras
        </h2>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-gold/50" />
          <span className="text-gold text-xs">◆</span>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-gold/50" />
        </div>
      </div>

      {/* PODIUM */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-8 mb-12">
        <PodiumScreen topThree={topThree} />
      </div>

      {/* FULL STANDINGS */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-8 mb-12">
        <FinalRankingList groups={sorted} />
      </div>

      {/* FOOTER ACTION DOCK */}
      <div className="relative z-10 w-full border-t border-muted-line bg-white/95 sticky bottom-0 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="font-body text-[10px] text-ink/40 uppercase tracking-widest">
              Pemenang
            </div>
            <div className="font-heading text-navy text-lg font-semibold">
              {sorted[0]?.name ?? '—'}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetGame}
              className="px-6 py-2.5 border border-muted-line hover:border-navy/50 text-ink/60 hover:text-navy font-body text-sm uppercase tracking-wider transition-all duration-200 rounded h-[44px]"
            >
              Main Lagi
            </button>
            <button
              onClick={resetGame}
              className="px-8 py-2.5 bg-navy hover:bg-navy-hover text-white h-[44px] focus:ring-2 focus:ring-brass focus:ring-offset-2 font-body font-semibold text-sm uppercase tracking-wider transition-all duration-200 rounded"
            >
              Pengaturan Baru ✦
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
