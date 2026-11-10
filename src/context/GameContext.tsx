/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react'
import type {
  GameState,
  GamePhase,
  Team,
  Question,
  QuizConfig,
  AnswerRecord,
} from '../types'
import { createInitialState, gameReducer } from './gameReducer'

interface GameContextValue {
  state: GameState
  currentQuestion: Question | null
  setTeams: (teams: Team[]) => void
  setConfig: (config: Partial<QuizConfig>) => void
  startGame: () => void
  setPhase: (phase: GamePhase) => void
  /** Kunci jawaban semua kelompok dan buka pembahasan */
  revealAnswers: (records: AnswerRecord[]) => void
  /** Guru membalik penilaian benar/salah satu kelompok */
  toggleAnswer: (teamId: string, questionId: string) => void
  nextQuestion: () => void
  endGame: () => void
  resetGame: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialState())

  const currentQuestion = state.questions[state.currentQuestionIndex] ?? null

  const setTeams = useCallback((teams: Team[]) => dispatch({ type: 'SET_TEAMS', teams }), [])
  const setConfig = useCallback(
    (config: Partial<QuizConfig>) => dispatch({ type: 'SET_CONFIG', config }),
    [],
  )
  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), [])
  const setPhase = useCallback((phase: GamePhase) => dispatch({ type: 'SET_PHASE', phase }), [])
  const revealAnswers = useCallback(
    (records: AnswerRecord[]) => dispatch({ type: 'REVEAL', records }),
    [],
  )
  const toggleAnswer = useCallback(
    (teamId: string, questionId: string) => dispatch({ type: 'TOGGLE_ANSWER', teamId, questionId }),
    [],
  )
  const nextQuestion = useCallback(() => dispatch({ type: 'NEXT_QUESTION' }), [])
  const endGame = useCallback(() => dispatch({ type: 'END_GAME' }), [])
  const resetGame = useCallback(() => dispatch({ type: 'RESET_GAME' }), [])

  const value: GameContextValue = {
    state,
    currentQuestion,
    setTeams,
    setConfig,
    startGame,
    setPhase,
    revealAnswers,
    toggleAnswer,
    nextQuestion,
    endGame,
    resetGame,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>')
  return ctx
}
