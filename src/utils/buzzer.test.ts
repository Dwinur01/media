import { describe, expect, it } from 'vitest'
import { indexForKey, keyForIndex } from './buzzer'

describe('tombol buzzer', () => {
  it('tim 1–9 → "1"–"9", tim 10 → "0", selebihnya tanpa tombol', () => {
    expect(keyForIndex(0)).toBe('1')
    expect(keyForIndex(8)).toBe('9')
    expect(keyForIndex(9)).toBe('0')
    expect(keyForIndex(10)).toBeNull()
    expect(keyForIndex(-1)).toBeNull()
  })
  it('kebalikannya konsisten', () => {
    for (let i = 0; i < 10; i++) expect(indexForKey(keyForIndex(i)!)).toBe(i)
    expect(indexForKey('a')).toBeNull()
    expect(indexForKey('10')).toBeNull()
    expect(indexForKey('Enter')).toBeNull()
  })
})
