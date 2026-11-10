import type { AnswerRecord, QuizConfig, Team, TeamScore } from '../types'

/**
 * Poin untuk satu jawaban. Bonus streak diberikan jika streak >= 2.
 */
export function calcScoreDelta(
  isCorrect: boolean,
  pointsPerCorrect: number,
  bonusStreak: number,
  streak: number,
): number {
  if (!isCorrect) return 0
  const bonus = streak >= 2 ? bonusStreak * Math.floor(streak / 2) : 0
  return pointsPerCorrect + bonus
}

/**
 * Hitung ulang SELURUH skor dari daftar jawaban (berurutan).
 * Dengan begitu koreksi manual guru otomatis memperbaiki skor dan streak.
 */
export function computeScores(
  teams: Team[],
  answers: AnswerRecord[],
  config: Pick<QuizConfig, 'pointsPerCorrect' | 'bonusStreak'>,
): TeamScore[] {
  const scores: TeamScore[] = teams.map((t) => ({
    teamId: t.id,
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    streak: 0,
  }))
  const byTeam = new Map(scores.map((s) => [s.teamId, s]))

  for (const a of answers) {
    const s = byTeam.get(a.teamId)
    if (!s) continue
    s.streak = a.isCorrect ? s.streak + 1 : 0
    s.score += calcScoreDelta(a.isCorrect, config.pointsPerCorrect, config.bonusStreak, s.streak)
    if (a.isCorrect) s.correctAnswers += 1
    else s.wrongAnswers += 1
  }
  return scores
}
