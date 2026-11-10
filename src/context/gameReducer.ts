import type {
  AnswerRecord,
  GamePhase,
  GameState,
  QuizConfig,
  Team,
  Question,
} from '../types'
import { defaultQuizConfig, sampleQuestions } from '../data/questions'
import { shuffle, computeScores } from '../utils'

export const createInitialState = (questions: Question[] = sampleQuestions): GameState => ({
  phase: 'setup',
  teams: [],
  scores: [],
  questions,
  currentQuestionIndex: 0,
  answers: [],
  config: defaultQuizConfig,
})

export type Action =
  | { type: 'SET_TEAMS'; teams: Team[] }
  | { type: 'SET_CONFIG'; config: Partial<QuizConfig> }
  | { type: 'START_GAME' }
  | { type: 'SET_PHASE'; phase: GamePhase }
  | { type: 'REVEAL'; records: AnswerRecord[] }
  | { type: 'TOGGLE_ANSWER'; teamId: string; questionId: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' }

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_TEAMS':
      return {
        ...state,
        teams: action.teams,
        scores: computeScores(action.teams, [], state.config),
      }

    case 'SET_CONFIG':
      return { ...state, config: { ...state.config, ...action.config } }

    case 'START_GAME': {
      const pool = state.config.shuffleQuestions ? shuffle(state.questions) : state.questions
      // jangan melebihi jumlah soal yang tersedia, minimal 1
      const count = Math.max(1, Math.min(state.config.questionsPerRound, pool.length))
      return {
        ...state,
        phase: 'reading',
        questions: pool.slice(0, count),
        currentQuestionIndex: 0,
        answers: [],
        scores: computeScores(state.teams, [], state.config),
        startedAt: new Date(),
        endedAt: undefined,
      }
    }

    case 'SET_PHASE':
      return { ...state, phase: action.phase }

    case 'REVEAL': {
      // jawaban untuk (tim, soal) yang sama diganti, bukan ditambah dua kali
      const keys = new Set(action.records.map((r) => `${r.teamId}|${r.questionId}`))
      const answers = [
        ...state.answers.filter((a) => !keys.has(`${a.teamId}|${a.questionId}`)),
        ...action.records,
      ]
      return {
        ...state,
        phase: 'reveal',
        answers,
        scores: computeScores(state.teams, answers, state.config),
      }
    }

    case 'TOGGLE_ANSWER': {
      const answers = state.answers.map((a) =>
        a.teamId === action.teamId && a.questionId === action.questionId
          ? { ...a, isCorrect: !a.isCorrect, overridden: !a.overridden }
          : a,
      )
      return { ...state, answers, scores: computeScores(state.teams, answers, state.config) }
    }

    case 'NEXT_QUESTION': {
      const next = state.currentQuestionIndex + 1
      if (next >= state.questions.length) {
        return { ...state, phase: 'result', endedAt: new Date() }
      }
      return { ...state, currentQuestionIndex: next, phase: 'reading' }
    }

    case 'END_GAME':
      return { ...state, phase: 'result', endedAt: new Date() }

    case 'RESET_GAME':
      return createInitialState()

    default:
      return state
  }
}
