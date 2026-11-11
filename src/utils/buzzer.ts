/** Tombol keyboard buzzer: tim 1–9 → "1"–"9", tim 10 → "0". Tim 11–12 lewat klik. */
export function keyForIndex(index: number): string | null {
  if (index >= 0 && index <= 8) return String(index + 1)
  if (index === 9) return '0'
  return null
}

export function indexForKey(key: string): number | null {
  if (/^[1-9]$/.test(key)) return Number(key) - 1
  if (key === '0') return 9
  return null
}
