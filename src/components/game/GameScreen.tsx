import { useState, useEffect, useMemo } from 'react'
import { useGame } from '../../context/GameContext'
import { useCountdown } from '../../hooks/useCountdown'
import { isAnswerCorrect, playBell } from '../../utils'
import { BankSoalModal } from '../shared'
import { GameHeader } from './GameHeader'
import { QuestionCard } from './QuestionCard'
import { TimerCard } from './TimerCard'
import { GroupsPanel } from './GroupsPanel'
import { AnswerGrid } from './AnswerGrid'
import { RevealPanel } from './RevealPanel'
import { LeaderboardPanel } from './LeaderboardPanel'
import type { Group, AnswerInput, AnswerRecord } from '../../types'

export function GameScreen() {
  const { state, currentQuestion, setPhase, revealAnswers, toggleAnswer, nextQuestion } = useGame()

  const [showBankSoal, setShowBankSoal] = useState(false)
  // draf ketikan kelompok; baru dinilai saat "Periksa Jawaban"
  const [groupAnswers, setGroupAnswers] = useState<Record<string, string>>({})

  const totalQuestions = state.questions.length
  const qIndex = state.currentQuestionIndex
  const revealed = state.phase === 'reveal'
  const limit = currentQuestion?.timeLimit ?? state.config.defaultTimeLimit

  const { timeLeft, running, start, pause, toggle, reset, getRemainingMs } = useCountdown(
    limit,
    () => handleReveal(true),
  )

  const groups: Group[] = useMemo(
    () =>
      state.teams.map((t) => {
        const s = state.scores.find((sc) => sc.teamId === t.id)
        return {
          id: t.id,
          name: t.name,
          color: t.color || '#D97706',
          score: s?.score ?? 0,
          correctCount: s?.correctAnswers ?? 0,
        }
      }),
    [state.teams, state.scores],
  )

  // Soal baru → timer kembali ke batas waktu soal itu, isian dikosongkan
  useEffect(() => {
    pause()
    reset(limit)
    setGroupAnswers({})
  }, [currentQuestion?.id, limit, pause, reset])

  function handleStartAnswering() {
    setPhase('answering')
    start()
  }

  function handleInputChange(groupId: string, val: string) {
    if (revealed) return
    setGroupAnswers((prev) => ({ ...prev, [groupId]: val }))
  }

  function handleReveal(expired = false) {
    if (!currentQuestion || state.phase !== 'answering') return
    const elapsed = Math.round(limit * 1000 - getRemainingMs())
    pause()
    if (expired && state.config.soundEffects) playBell()

    const records: AnswerRecord[] = state.teams.map((team) => {
      const text = groupAnswers[team.id] ?? ''
      return {
        teamId: team.id,
        questionId: currentQuestion.id,
        answerText: text,
        isCorrect: isAnswerCorrect(currentQuestion, text),
        timeMs: elapsed,
      }
    })
    revealAnswers(records)
  }

  if (!currentQuestion) return null

  // Hasil benar/salah di layar diambil dari record yang sama dengan yang dipakai skor
  const inputsForGrid: Record<string, AnswerInput> = {}
  state.teams.forEach((team) => {
    const record = state.answers.find(
      (a) => a.teamId === team.id && a.questionId === currentQuestion.id,
    )
    inputsForGrid[team.id] = {
      groupId: team.id,
      value: groupAnswers[team.id] ?? '',
      isCorrect: revealed ? (record?.isCorrect ?? false) : null,
      overridden: record?.overridden,
    }
  })

  const correctNow = Object.values(inputsForGrid).filter((i) => i.isCorrect === true).length
  const statusMessage =
    state.phase === 'answering'
      ? 'Waktu menjawab dimulai.'
      : revealed
        ? `Jawaban diperiksa. ${correctNow} dari ${state.teams.length} kelompok benar.`
        : `Soal ${qIndex + 1} dari ${totalQuestions}. Baca soal terlebih dahulu.`

  return (
    <div className="min-h-screen bg-bg-base flex flex-col font-body text-paper-text relative overflow-x-hidden">
      {/* Pengumuman untuk pembaca layar */}
      <div className="sr-only" role="status" aria-live="polite">
        {statusMessage}
      </div>

      {/* Watermark */}
      <div className="pointer-events-none select-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] z-0" aria-hidden="true">
        <div className="font-heading text-[20vw] text-gold whitespace-nowrap leading-none">a²+b²=c²</div>
      </div>

      <GameHeader
        currentQuestionNumber={qIndex + 1}
        totalQuestions={totalQuestions}
        groupCount={state.teams.length}
        onOpenBankSoal={() => setShowBankSoal(true)}
      />

      <main className="relative z-10 flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-14 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">

        <section className="lg:col-span-8 flex flex-col gap-6">
          <QuestionCard question={currentQuestion} categoryName={currentQuestion.category} />

          {state.phase === 'reading' && (
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3 text-[11px] font-body text-paper-text/40 uppercase tracking-widest">
                <div className="w-6 h-px bg-muted-line" />
                Baca soal, lalu mulai
                <div className="w-6 h-px bg-muted-line" />
              </div>
              <button
                onClick={handleStartAnswering}
                className="flex items-center gap-2 px-7 py-3 bg-navy hover:bg-navy-hover text-white h-[44px] focus:ring-2 focus:ring-brass focus:ring-offset-2 font-body font-semibold text-sm uppercase tracking-widest transition-all duration-200"
              >
                Mulai Menjawab
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {(state.phase === 'answering' || revealed) && (
            <div className="bg-white border border-muted-line p-6 sm:p-8 shadow-sm rounded-lg">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-px h-4 bg-navy" />
                <span className="text-[10px] font-body text-navy/60 uppercase tracking-[0.25em]">Arena Jawaban</span>
                <div className="flex-1 h-px bg-muted-line" />
              </div>
              <AnswerGrid
                groups={groups}
                inputs={inputsForGrid}
                revealed={revealed}
                isLastQuestion={qIndex + 1 >= totalQuestions}
                onInputChange={handleInputChange}
                onCheckAnswers={() => handleReveal(false)}
                onToggleCorrect={(teamId) => toggleAnswer(teamId, currentQuestion.id)}
                onNextQuestion={nextQuestion}
              />
            </div>
          )}

          {revealed && (
            <RevealPanel
              answer={currentQuestion.answer}
              alternativeAnswers={currentQuestion.alternativeAnswers}
              explanation={currentQuestion.explanation}
            />
          )}
        </section>

        <aside className="lg:col-span-4 flex flex-col gap-4 lg:sticky lg:top-[80px]">
          <TimerCard
            timeRemaining={timeLeft}
            duration={limit}
            isRunning={running && state.phase === 'answering'}
            onToggle={state.phase === 'answering' ? toggle : undefined}
            onReset={revealed ? undefined : () => reset(limit)}
          />
          {state.config.showLiveRanking && <LeaderboardPanel groups={groups} />}
          <GroupsPanel groups={groups} />
          <div className="border border-muted-line bg-white p-4 text-center rounded-lg shadow-sm">
            <div className="font-body text-[10px] text-ink/40 uppercase tracking-[0.2em] mb-1">Progress Soal</div>
            <div className="font-heading text-navy text-2xl font-bold">
              {qIndex + 1}
              <span className="text-ink/30 text-base font-normal"> / {totalQuestions}</span>
            </div>
            <div className="flex items-center justify-center gap-1 mt-3 flex-wrap">
              {Array.from({ length: totalQuestions }, (_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i < qIndex ? 'w-2 h-2 bg-navy/40' : i === qIndex ? 'w-2.5 h-2.5 bg-navy' : 'w-2 h-2 bg-muted-line'
                  }`}
                />
              ))}
            </div>
          </div>
        </aside>
      </main>

      <BankSoalModal isOpen={showBankSoal} onClose={() => setShowBankSoal(false)} />
    </div>
  )
}
