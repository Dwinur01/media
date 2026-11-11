import { describe, expect, it } from 'vitest'
import { deserializeSession, serializeSession } from './persistence'
import { createInitialState, gameReducer } from '../context/gameReducer'
import { defaultQuizConfig, questions } from '../data/questions'
import type { AnswerRecord, GameState } from '../types'

const teams = [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }]

function playing(): GameState {
  let s = createInitialState()
  s = gameReducer(s, { type: 'SET_TEAMS', teams })
  s = gameReducer(s, { type: 'SET_CONFIG', config: { shuffleQuestions: false, questionsPerRound: 5, buzzerMode: true } })
  return gameReducer(s, { type: 'START_GAME' })
}
const rec = (teamId: string, isCorrect: boolean): AnswerRecord => ({
  teamId, questionId: questions[0].id, answerText: 'x', isCorrect, timeMs: 5,
})
const load = (json: string) => deserializeSession(json, questions, defaultQuizConfig)

describe('persistensi sesi', () => {
  it('bolak-balik: tim, soal, jawaban, config, indeks soal terjaga; skor dihitung ulang', () => {
    let s = playing()
    s = gameReducer(s, { type: 'REVEAL', records: [rec('a', true), rec('b', false)] })
    s = gameReducer(s, { type: 'NEXT_QUESTION' })
    const out = load(serializeSession(s))!
    expect(out.state.phase).toBe('reading')
    expect(out.state.teams).toEqual(teams)
    expect(out.state.questions.map((q) => q.id)).toEqual(s.questions.map((q) => q.id))
    expect(out.state.currentQuestionIndex).toBe(1)
    expect(out.state.answers).toEqual(s.answers)
    expect(out.state.config.buzzerMode).toBe(true)
    expect(out.state.scores).toEqual(s.scores)
    expect(out.state.startedAt).toBeInstanceOf(Date)
  })

  it('fase reveal dipulihkan apa adanya; answering dipulihkan sebagai reading', () => {
    let s = playing()
    s = gameReducer(s, { type: 'SET_PHASE', phase: 'answering' })
    expect(load(serializeSession(s))!.state.phase).toBe('reading')
    s = gameReducer(s, { type: 'REVEAL', records: [rec('a', true)] })
    expect(load(serializeSession(s))!.state.phase).toBe('reveal')
  })

  it('config lama tanpa field baru dilengkapi nilai bawaan', () => {
    const s = playing()
    const obj = JSON.parse(serializeSession(s))
    delete obj.config.buzzerMode
    expect(load(JSON.stringify(obj))!.state.config.buzzerMode).toBe(false)
  })

  it('menolak data rusak / versi lain / fase tidak valid', () => {
    const good = JSON.parse(serializeSession(playing()))
    expect(load('bukan json')).toBeNull()
    expect(load('null')).toBeNull()
    expect(load(JSON.stringify({ ...good, v: 99 }))).toBeNull()
    expect(load(JSON.stringify({ ...good, phase: 'setup' }))).toBeNull()
    expect(load(JSON.stringify({ ...good, phase: 'result' }))).toBeNull()
    expect(load(JSON.stringify({ ...good, teams: [] }))).toBeNull()
    expect(load(JSON.stringify({ ...good, teams: [{ id: 1 }] }))).toBeNull()
    expect(load(JSON.stringify({ ...good, answers: [{ teamId: 'a' }] }))).toBeNull()
    expect(load(JSON.stringify({ ...good, currentQuestionIndex: 99 }))).toBeNull()
    expect(load(JSON.stringify({ ...good, currentQuestionIndex: -1 }))).toBeNull()
    expect(load(JSON.stringify({ ...good, currentQuestionIndex: 1.5 }))).toBeNull()
  })

  it('menolak sesi yang soalnya sudah tidak ada di bank', () => {
    const good = JSON.parse(serializeSession(playing()))
    expect(load(JSON.stringify({ ...good, questionIds: ['soal-hilang'] }))).toBeNull()
  })

  it('tidak menyimpan isi soal (hanya id) agar ringan', () => {
    const json = serializeSession(playing())
    expect(json).not.toContain('svg')
    expect(json.length).toBeLessThan(2000)
  })
})
