// ============================================================
//  Utility helpers for Kuis Kelompok Pythagoras
// ============================================================

/**
 * Fisher-Yates shuffle — returns a new shuffled array.
 */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Format seconds → "MM:SS" string.
 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * Generate a simple unique id.
 */
export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Return ordinal suffix for a rank number (1st, 2nd, 3rd …).
 */
export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0])
}

export { calcScoreDelta, computeScores } from './scoring'
export { isAnswerCorrect, normalizeAnswer } from './grading'
export { sanitizeSvg } from './sanitizeSvg'
export { playBell, playBuzz, playTick } from './sound'
export { teamNumber } from './teamNumber'
export {
  saveSession,
  loadSession,
  clearSession,
  summarizeSession,
  isResumable,
  type SessionSummary,
} from './persistence'
export { keyForIndex, indexForKey } from './buzzer'
