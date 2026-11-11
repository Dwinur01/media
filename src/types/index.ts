// ============================================================
//  src/types/index.ts — Satu-satunya sumber tipe data aplikasi
// ============================================================

export type QuestionType = 'rumus' | 'tripel' | 'jenis' | 'istimewa' | 'aplikasi'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Option {
  id: string
  text: string
}

export interface Question {
  id: string
  type: QuestionType
  text: string
  svgIllustration?: string
  extraNote?: string
  /** Kunci jawaban utama */
  answer: string
  /** Variasi jawaban lain yang diterima */
  alternativeAnswers?: string[]
  explanation: string
  options: Option[]
  correctOptionId: string
  difficulty: Difficulty
  category?: string
  /** Batas waktu (detik). Jika kosong memakai config.defaultTimeLimit */
  timeLimit?: number
}

export interface Team {
  id: string
  name: string
  color?: string
}

/** Tampilan tim untuk panel skor / papan peringkat */
export interface Group {
  id: string
  name: string
  color: string
  score: number
  correctCount: number
}

/** Isian jawaban satu kelompok pada soal yang sedang berjalan */
export interface AnswerInput {
  groupId: string
  value: string
  /** null = belum diperiksa */
  isCorrect: boolean | null
  /** true jika hasilnya diubah manual oleh guru */
  overridden?: boolean
}

export type GamePhase = 'setup' | 'reading' | 'answering' | 'reveal' | 'result'

export interface TeamScore {
  teamId: string
  score: number
  correctAnswers: number
  wrongAnswers: number
  streak: number
}

export interface AnswerRecord {
  teamId: string
  questionId: string
  /** Teks jawaban asli yang diketik kelompok */
  answerText: string
  isCorrect: boolean
  /** Waktu (ms) sejak soal dibuka sampai jawaban diperiksa */
  timeMs: number
  /** true jika guru mengubah penilaian otomatis */
  overridden?: boolean
}

export interface QuizConfig {
  questionsPerRound: number
  defaultTimeLimit: number
  pointsPerCorrect: number
  /** Poin tambahan untuk streak benar berturut-turut (0 = nonaktif) */
  bonusStreak: number
  shuffleQuestions: boolean
  /** Tampilkan papan peringkat selama permainan */
  showLiveRanking: boolean
  /** Bunyi bel saat waktu habis / buzzer */
  soundEffects: boolean
  /** Mode Rebutan: kelompok berebut menekan buzzer, tercepat yang menjawab */
  buzzerMode: boolean
}

export interface GameState {
  phase: GamePhase
  teams: Team[]
  scores: TeamScore[]
  questions: Question[]
  currentQuestionIndex: number
  answers: AnswerRecord[]
  config: QuizConfig
  startedAt?: Date
  endedAt?: Date
}
