import { useState, useEffect, useMemo } from 'react'
import { useGame } from '../../context/GameContext'
import { useCountdown } from '../../hooks/useCountdown'
import { indexForKey, isAnswerCorrect, playBell, playBuzz, playTick } from '../../utils'
import { BankSoalModal } from '../shared'
import { GameHeader } from './GameHeader'
import { QuestionCard } from './QuestionCard'
import { TimerCard } from './TimerCard'
import { GroupsPanel } from './GroupsPanel'
import { AnswerGrid } from './AnswerGrid'
import { BuzzerPanel } from './BuzzerPanel'
import { RevealPanel } from './RevealPanel'
import { LeaderboardPanel } from './LeaderboardPanel'
import type { Group, AnswerInput, AnswerRecord } from '../../types'

export function GameScreen() {
  const { state, currentQuestion, setPhase, revealAnswers, recordAttempt, toggleAnswer, nextQuestion } = useGame()

  const [showBankSoal, setShowBankSoal] = useState(false)
  // draf ketikan kelompok; baru dinilai saat "Periksa Jawaban"
  const [groupAnswers, setGroupAnswers] = useState<Record<string, string>>({})
  // Mode Rebutan: kelompok yang sedang memegang giliran + ketikan jawabannya
  const [buzzedId, setBuzzedId] = useState<string | null>(null)
  const [buzzText, setBuzzText] = useState('')

  const totalQuestions = state.questions.length
  const qIndex = state.currentQuestionIndex
  const revealed = state.phase === 'reveal'
  const buzzer = state.config.buzzerMode
  // kelompok yang sudah mencoba pada soal ini (gugur di Mode Rebutan)
  const attemptedIds = state.answers
    .filter((a) => a.questionId === currentQuestion?.id)
    .map((a) => a.teamId)
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
          color: t.color || '#0369A1',
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
    setBuzzedId(null)
    setBuzzText('')
  }, [currentQuestion?.id, limit, pause, reset])

  // Tombol angka 1–9 (0 = tim ke-10) sebagai buzzer
  useEffect(() => {
    if (!buzzer || state.phase !== 'answering' || buzzedId) return
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return
      const idx = indexForKey(e.key)
      const team = idx === null ? undefined : state.teams[idx]
      if (team) handleBuzz(team.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const urgent = state.phase === 'answering' && running && timeLeft > 0 && timeLeft <= 10

  // Soal baru → kembali ke atas layar (tombol lanjut ada di bagian bawah halaman)
  useEffect(() => {
    document.scrollingElement?.scrollTo?.({ top: 0, behavior: 'smooth' })
  }, [currentQuestion?.id])

  // Tik tiap detik pada 10 detik terakhir
  useEffect(() => {
    if (urgent && state.config.soundEffects) playTick()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, urgent])

  // Spasi = jeda / lanjut timer (tidak aktif saat mengetik atau modal terbuka)
  useEffect(() => {
    if (state.phase !== 'answering' || buzzedId || showBankSoal) return
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return
      const el = e.target as HTMLElement | null
      if (el && ['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT', 'A'].includes(el.tagName)) return
      if (el?.isContentEditable) return
      e.preventDefault()
      toggle()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.phase, buzzedId, showBankSoal, toggle])

  // Setelah "Mulai Menjawab", fokus langsung ke isian tim pertama
  useEffect(() => {
    if (state.phase !== 'answering' || buzzer) return
    // Di HP/tablet, fokus otomatis akan memunculkan keyboard dan menggeser layar: lewati
    if (!window.matchMedia?.('(pointer: fine)').matches) return
    const id = window.requestAnimationFrame(() => {
      document.querySelector<HTMLInputElement>('[data-team-input="0"]')?.focus({ preventScroll: true })
    })
    return () => window.cancelAnimationFrame(id)
  }, [state.phase, buzzer, currentQuestion?.id])

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
    setBuzzedId(null)

    if (buzzer) {
      // Rebutan: hanya kelompok yang sudah mencoba punya catatan; sisanya tidak menjawab
      revealAnswers([])
      return
    }

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

  function handleBuzz(teamId: string) {
    if (state.phase !== 'answering' || buzzedId || attemptedIds.includes(teamId)) return
    pause()
    setBuzzedId(teamId)
    setBuzzText('')
    if (state.config.soundEffects) playBuzz()
  }

  function handleCancelBuzz() {
    setBuzzedId(null)
    setBuzzText('')
    start()
  }

  function handleJudge(correct: boolean) {
    if (!currentQuestion || !buzzedId) return
    const record: AnswerRecord = {
      teamId: buzzedId,
      questionId: currentQuestion.id,
      answerText: buzzText.trim() || '(jawaban lisan)',
      isCorrect: correct,
      timeMs: Math.round(limit * 1000 - getRemainingMs()),
    }
    const othersLeft = state.teams.some((t) => t.id !== buzzedId && !attemptedIds.includes(t.id))
    setBuzzedId(null)
    setBuzzText('')
    if (correct || !othersLeft) {
      revealAnswers([record]) // soal selesai (timer sudah dijeda saat buzz)
    } else {
      recordAttempt(record) // kelompok ini gugur, yang lain boleh merebut
      start()
    }
  }

  function handleCheckTyped() {
    if (!currentQuestion || !buzzText.trim()) return
    handleJudge(isAnswerCorrect(currentQuestion, buzzText))
  }

  if (!currentQuestion) return null

  // Hasil benar/salah di layar diambil dari record yang sama dengan yang dipakai skor
  const inputsForGrid: Record<string, AnswerInput> = {}
  state.teams.forEach((team) => {
    const record = state.answers.find(
      (a) => a.teamId === team.id && a.questionId === currentQuestion.id,
    )
    const noAnswer = revealed && !record
    inputsForGrid[team.id] = {
      groupId: team.id,
      value: noAnswer ? '— tidak menjawab —' : (groupAnswers[team.id] ?? record?.answerText ?? ''),
      isCorrect: revealed ? (record?.isCorrect ?? null) : null,
      overridden: record?.overridden,
    }
  })

  const correctNow = Object.values(inputsForGrid).filter((i) => i.isCorrect === true).length
  const statusMessage =
    state.phase === 'answering'
      ? buzzedId
        ? `${state.teams.find((t) => t.id === buzzedId)?.name ?? 'Kelompok'} menekan buzzer.`
        : buzzer
          ? 'Buzzer terbuka.'
          : 'Waktu menjawab dimulai.'
      : revealed
        ? `Jawaban diperiksa. ${correctNow} dari ${state.teams.length} kelompok benar.`
        : `Soal ${qIndex + 1} dari ${totalQuestions}. Baca soal terlebih dahulu.`

  return (
    <div className="min-h-screen bg-bg-base flex flex-col font-body text-paper-text relative overflow-x-clip">
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
        timeLeft={state.phase === 'answering' ? timeLeft : undefined}
        timerRunning={running}
      />

      {/* Denyut tepi layar merah pada 10 detik terakhir */}
      {urgent && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-30 animate-edge-pulse"
          style={{ boxShadow: 'inset 0 0 90px 10px rgba(220, 38, 38, 0.5)' }}
        />
      )}

      <main className="relative z-10 flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-14 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">

        <section className="lg:col-span-8 flex flex-col gap-6">
          <div key={currentQuestion.id} className="animate-slide-up">
            <QuestionCard question={currentQuestion} categoryName={currentQuestion.category} />
          </div>

          {state.phase === 'reading' && (
            <div className="flex flex-col-reverse gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center justify-center sm:justify-start gap-3 text-sm font-body text-paper-text/70">
                <div className="w-6 h-px bg-muted-line" />
                Baca soal, lalu mulai
                <div className="w-6 h-px bg-muted-line" />
              </div>
              <button
                onClick={handleStartAnswering}
                className="w-full sm:w-auto justify-center flex items-center gap-2 px-7 py-3 bg-navy hover:bg-navy-hover text-white h-[52px] rounded focus:ring-2 focus:ring-brass focus:ring-offset-2 font-body font-semibold text-base tracking-wide transition-all duration-200"
              >
                {buzzer ? 'Buka Buzzer' : 'Mulai Menjawab'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {state.phase === 'answering' && buzzer && (
            <BuzzerPanel
              groups={groups}
              lockedIds={attemptedIds}
              buzzedId={buzzedId}
              answerText={buzzText}
              onAnswerTextChange={setBuzzText}
              onBuzz={handleBuzz}
              onCancel={handleCancelBuzz}
              onCheckTyped={handleCheckTyped}
              onJudge={handleJudge}
              onEndQuestion={() => handleReveal(false)}
            />
          )}

          {revealed && (
            <RevealPanel
              answer={currentQuestion.answer}
              alternativeAnswers={currentQuestion.alternativeAnswers}
              explanation={currentQuestion.explanation}
            />
          )}

          {((state.phase === 'answering' && !buzzer) || revealed) && (
            <div className="bg-white border border-muted-line p-6 sm:p-8 shadow-sm rounded-lg">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-px h-4 bg-navy" />
                <span className="text-sm font-body text-navy font-semibold">Arena Jawaban</span>
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

        </section>

        <aside className="lg:col-span-4 flex flex-col gap-4 lg:sticky lg:top-[88px] lg:max-h-[calc(100vh-104px)] lg:overflow-y-auto lg:pr-1 custom-scrollbar [&>*]:shrink-0">
          <TimerCard
            timeRemaining={timeLeft}
            duration={limit}
            isRunning={running && state.phase === 'answering'}
            onToggle={state.phase === 'answering' ? toggle : undefined}
            onReset={revealed ? undefined : () => reset(limit)}
          />
          {/* Satu panel saja: klasemen jika peringkat langsung aktif, kalau tidak daftar tim */}
          {state.config.showLiveRanking ? <LeaderboardPanel groups={groups} /> : <GroupsPanel groups={groups} />}
        </aside>
      </main>

      <BankSoalModal isOpen={showBankSoal} onClose={() => setShowBankSoal(false)} />
    </div>
  )
}
