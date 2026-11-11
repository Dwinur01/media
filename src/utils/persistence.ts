// ============================================================
//  Simpan & pulihkan sesi permainan (localStorage)
//  Yang disimpan hanya data minimal; skor DIHITUNG ULANG saat dipulihkan.
// ============================================================
import type { AnswerRecord, GamePhase, GameState, Question, QuizConfig, Team } from '../types'
import { computeScores } from './scoring'

export const SESSION_KEY = 'kuis-pythagoras:session'
const VERSION = 1

const RESUMABLE: GamePhase[] = ['reading', 'answering', 'reveal']

interface StoredSession {
  v: number
  savedAt: number
  phase: GamePhase
  teams: Team[]
  questionIds: string[]
  currentQuestionIndex: number
  answers: AnswerRecord[]
  config: QuizConfig
  startedAt?: string
}

/** Ringkasan untuk banner "Lanjutkan permainan". */
export interface SessionSummary {
  savedAt: number
  teamCount: number
  questionNumber: number
  totalQuestions: number
}

export function isResumable(phase: GamePhase): boolean {
  return RESUMABLE.includes(phase)
}

export function serializeSession(state: GameState, now = Date.now()): string {
  const data: StoredSession = {
    v: VERSION,
    savedAt: now,
    phase: state.phase,
    teams: state.teams,
    questionIds: state.questions.map((q) => q.id),
    currentQuestionIndex: state.currentQuestionIndex,
    answers: state.answers,
    config: state.config,
    startedAt: state.startedAt?.toISOString(),
  }
  return JSON.stringify(data)
}

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null

function validTeam(t: unknown): t is Team {
  return isObj(t) && typeof t.id === 'string' && typeof t.name === 'string'
}

function validAnswer(a: unknown): a is AnswerRecord {
  return (
    isObj(a) &&
    typeof a.teamId === 'string' &&
    typeof a.questionId === 'string' &&
    typeof a.answerText === 'string' &&
    typeof a.isCorrect === 'boolean' &&
    typeof a.timeMs === 'number'
  )
}

/**
 * Pulihkan sesi dari JSON. Mengembalikan null jika rusak, versi lain,
 * atau soal yang tersimpan sudah tidak ada di bank soal.
 * Fase "answering" dipulihkan sebagai "reading" (timer tidak bisa dilanjutkan persis).
 */
export function deserializeSession(
  json: string,
  bank: Question[],
  defaults: QuizConfig,
): { state: GameState; savedAt: number } | null {
  try {
    const raw: unknown = JSON.parse(json)
    if (!isObj(raw) || raw.v !== VERSION) return null
    if (typeof raw.phase !== 'string' || !isResumable(raw.phase as GamePhase)) return null
    if (!Array.isArray(raw.teams) || raw.teams.length < 1 || !raw.teams.every(validTeam)) return null
    if (!Array.isArray(raw.answers) || !raw.answers.every(validAnswer)) return null
    if (!Array.isArray(raw.questionIds) || raw.questionIds.length < 1) return null
    if (!isObj(raw.config)) return null

    const byId = new Map(bank.map((q) => [q.id, q]))
    const questions: Question[] = []
    for (const id of raw.questionIds) {
      const q = typeof id === 'string' ? byId.get(id) : undefined
      if (!q) return null
      questions.push(q)
    }

    const idx = raw.currentQuestionIndex
    if (typeof idx !== 'number' || !Number.isInteger(idx) || idx < 0 || idx >= questions.length) return null

    const teams = raw.teams as Team[]
    const answers = raw.answers as AnswerRecord[]
    const config: QuizConfig = { ...defaults, ...(raw.config as Partial<QuizConfig>) }
    const phase: GamePhase = raw.phase === 'answering' ? 'reading' : (raw.phase as GamePhase)
    const startedAt = typeof raw.startedAt === 'string' ? new Date(raw.startedAt) : undefined

    return {
      savedAt: typeof raw.savedAt === 'number' ? raw.savedAt : Date.now(),
      state: {
        phase,
        teams,
        questions,
        currentQuestionIndex: idx,
        answers,
        config,
        scores: computeScores(teams, answers, config),
        startedAt: startedAt && !Number.isNaN(startedAt.getTime()) ? startedAt : undefined,
      },
    }
  } catch {
    return null
  }
}

// ---- akses localStorage (aman jika diblokir / penuh) ----

export function saveSession(state: GameState): void {
  try {
    localStorage.setItem(SESSION_KEY, serializeSession(state))
  } catch {
    /* penyimpanan tidak tersedia — abaikan */
  }
}

export function loadSession(
  bank: Question[],
  defaults: QuizConfig,
): { state: GameState; savedAt: number } | null {
  try {
    const json = localStorage.getItem(SESSION_KEY)
    if (!json) return null
    const parsed = deserializeSession(json, bank, defaults)
    if (!parsed) localStorage.removeItem(SESSION_KEY) // data rusak: buang
    return parsed
  } catch {
    return null
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    /* abaikan */
  }
}

export function summarizeSession(s: { state: GameState; savedAt: number }): SessionSummary {
  return {
    savedAt: s.savedAt,
    teamCount: s.state.teams.length,
    questionNumber: s.state.currentQuestionIndex + 1,
    totalQuestions: s.state.questions.length,
  }
}
