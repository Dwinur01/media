import { describe, expect, it } from 'vitest'
import { calcScoreDelta, computeScores } from './scoring'
import type { AnswerRecord, Team } from '../types'

const teams: Team[] = [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }]
const rec = (teamId: string, q: string, isCorrect: boolean): AnswerRecord => ({
  teamId, questionId: q, answerText: '', isCorrect, timeMs: 0,
})

describe('calcScoreDelta', () => {
  it('salah = 0', () => expect(calcScoreDelta(false, 10, 2, 5)).toBe(0))
  it('streak 1 tanpa bonus', () => expect(calcScoreDelta(true, 10, 2, 1)).toBe(10))
  it('streak 2 → +2, streak 4 → +4, streak 5 → +4', () => {
    expect(calcScoreDelta(true, 10, 2, 2)).toBe(12)
    expect(calcScoreDelta(true, 10, 2, 4)).toBe(14)
    expect(calcScoreDelta(true, 10, 2, 5)).toBe(14)
  })
})

describe('computeScores', () => {
  const answers = [
    rec('a', 'q1', true), rec('b', 'q1', false),
    rec('a', 'q2', true), rec('b', 'q2', true),
    rec('a', 'q3', false), rec('b', 'q3', true),
  ]
  it('menghitung skor, benar/salah, dan streak', () => {
    const [a, b] = computeScores(teams, answers, { pointsPerCorrect: 10, bonusStreak: 2 })
    expect(a).toMatchObject({ score: 10 + 12, correctAnswers: 2, wrongAnswers: 1, streak: 0 })
    expect(b).toMatchObject({ score: 0 + 10 + 12, correctAnswers: 2, wrongAnswers: 1, streak: 2 })
  })
  it('bonus nonaktif jika bonusStreak = 0', () => {
    const [a] = computeScores(teams, answers, { pointsPerCorrect: 10, bonusStreak: 0 })
    expect(a.score).toBe(20)
  })
  it('tanpa jawaban → semua nol', () => {
    expect(computeScores(teams, [], { pointsPerCorrect: 10, bonusStreak: 2 }).every((s) => s.score === 0)).toBe(true)
  })
})
