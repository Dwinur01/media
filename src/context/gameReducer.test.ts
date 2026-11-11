import { describe, expect, it } from 'vitest'
import { createInitialState, gameReducer } from './gameReducer'
import type { AnswerRecord, GameState } from '../types'

const teams = [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }]
const rec = (teamId: string, questionId: string, isCorrect: boolean): AnswerRecord => ({
  teamId, questionId, answerText: '', isCorrect, timeMs: 1000,
})

function started(overrides: Partial<GameState['config']> = {}): GameState {
  let s = createInitialState()
  s = gameReducer(s, { type: 'SET_TEAMS', teams })
  s = gameReducer(s, { type: 'SET_CONFIG', config: { shuffleQuestions: false, ...overrides } })
  return gameReducer(s, { type: 'START_GAME' })
}

describe('gameReducer', () => {
  it('START_GAME tidak melebihi jumlah soal yang ada', () => {
    const s = started({ questionsPerRound: 999 })
    expect(s.questions.length).toBe(createInitialState().questions.length)
    expect(s.phase).toBe('reading')
  })

  it('REVEAL menyimpan jawaban, menghitung skor, dan pindah ke fase reveal', () => {
    const s = gameReducer(started(), { type: 'REVEAL', records: [rec('a', 'x', true), rec('b', 'x', false)] })
    expect(s.phase).toBe('reveal')
    expect(s.scores.find((x) => x.teamId === 'a')?.score).toBe(10)
    expect(s.scores.find((x) => x.teamId === 'b')?.score).toBe(0)
  })

  it('REVEAL dua kali untuk soal yang sama tidak menggandakan skor', () => {
    let s = started()
    s = gameReducer(s, { type: 'REVEAL', records: [rec('a', 'x', true), rec('b', 'x', true)] })
    s = gameReducer(s, { type: 'REVEAL', records: [rec('a', 'x', true), rec('b', 'x', true)] })
    expect(s.answers.length).toBe(2)
    expect(s.scores[0].score).toBe(10)
  })

  it('TOGGLE_ANSWER membalik penilaian dan menghitung ulang skor + streak', () => {
    let s = started()
    s = gameReducer(s, { type: 'REVEAL', records: [rec('a', 'q1', true), rec('b', 'q1', true)] })
    s = gameReducer(s, { type: 'NEXT_QUESTION' })
    s = gameReducer(s, { type: 'REVEAL', records: [rec('a', 'q2', true), rec('b', 'q2', true)] })
    expect(s.scores[0].score).toBe(10 + 12) // streak 2 → bonus
    // koreksi q1 milik A → salah: streak A putus, bonus hilang
    s = gameReducer(s, { type: 'TOGGLE_ANSWER', teamId: 'a', questionId: 'q1' })
    expect(s.scores[0].score).toBe(10)
    expect(s.answers.find((a) => a.teamId === 'a' && a.questionId === 'q1')?.overridden).toBe(true)
    // dibalik lagi → kembali seperti semula
    s = gameReducer(s, { type: 'TOGGLE_ANSWER', teamId: 'a', questionId: 'q1' })
    expect(s.scores[0].score).toBe(22)
    expect(s.answers.find((a) => a.teamId === 'a' && a.questionId === 'q1')?.overridden).toBe(false)
  })

  it('NEXT_QUESTION di soal terakhir → fase result', () => {
    let s = started({ questionsPerRound: 1 })
    s = gameReducer(s, { type: 'NEXT_QUESTION' })
    expect(s.phase).toBe('result')
    expect(s.endedAt).toBeInstanceOf(Date)
  })

  it('RESET_GAME kembali ke setup', () => {
    const s = gameReducer(started(), { type: 'RESET_GAME' })
    expect(s.phase).toBe('setup')
    expect(s.answers).toEqual([])
  })

  it('RECORD_ATTEMPT (rebutan): hanya yang menjawab dihitung; fase tidak berubah; yang diam tidak kehilangan streak', () => {
    let s = started()
    // soal 1: A benar, B benar
    s = gameReducer(s, { type: 'REVEAL', records: [rec('a', 'q1', true), rec('b', 'q1', true)] })
    s = gameReducer(s, { type: 'NEXT_QUESTION' })
    // soal 2 (rebutan): B salah dulu, lalu A benar
    s = gameReducer(s, { type: 'RECORD_ATTEMPT', record: rec('b', 'q2', false) })
    expect(s.phase).toBe('reading')
    expect(s.scores[1].wrongAnswers).toBe(1)
    s = gameReducer(s, { type: 'REVEAL', records: [rec('a', 'q2', true)] })
    expect(s.phase).toBe('reveal')
    expect(s.answers.filter((a) => a.questionId === 'q2').length).toBe(2)
    expect(s.scores[0]).toMatchObject({ score: 10 + 12, streak: 2 })
    expect(s.scores[1]).toMatchObject({ score: 10, streak: 0 })
  })

  it('REVEAL([]) menutup soal tanpa menambah jawaban (waktu habis di rebutan)', () => {
    let s = started()
    s = gameReducer(s, { type: 'REVEAL', records: [] })
    expect(s.phase).toBe('reveal')
    expect(s.answers).toEqual([])
  })

  it('LOAD_STATE mengganti seluruh state', () => {
    const saved = started({ questionsPerRound: 3 })
    const s = gameReducer(createInitialState(), { type: 'LOAD_STATE', state: saved })
    expect(s).toBe(saved)
  })
})
