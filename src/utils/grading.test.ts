import { describe, expect, it } from 'vitest'
import { isAnswerCorrect, normalizeAnswer } from './grading'
import { questions } from '../data/questions'
import type { Question } from '../types'

const base: Question = {
  id: 't',
  type: 'rumus',
  text: '',
  answer: '10',
  alternativeAnswers: ['10cm', '10 cm'],
  explanation: '',
  difficulty: 'easy',
  options: [
    { id: 'A', text: '10 cm' },
    { id: 'B', text: '12 cm' },
    { id: 'C', text: '14 cm' },
    { id: 'D', text: '7 cm' },
  ],
  correctOptionId: 'A',
}

describe('isAnswerCorrect — jawaban angka', () => {
  it.each(['10', '10cm', '10 cm', '  10   CM ', '10 cm.', '10,0', '10.0', 'c = 10', '= 10 cm', '10 meter'])(
    'menerima %j',
    (v) => expect(isAnswerCorrect(base, v)).toBe(true),
  )
  it.each(['', '  ', '12', '12 cm', '100', '1', 'sepuluh', '10x'])('menolak %j', (v) =>
    expect(isAnswerCorrect(base, v)).toBe(false),
  )
})

describe('isAnswerCorrect — huruf & teks opsi', () => {
  it('menerima huruf opsi benar (besar/kecil)', () => {
    expect(isAnswerCorrect(base, 'A')).toBe(true)
    expect(isAnswerCorrect(base, 'a')).toBe(true)
  })
  it('menolak huruf opsi salah', () => {
    expect(isAnswerCorrect(base, 'B')).toBe(false)
    expect(isAnswerCorrect(base, 'd')).toBe(false)
  })
})

describe('isAnswerCorrect — bentuk akar & kata', () => {
  const akar: Question = { ...base, answer: '8√2', alternativeAnswers: [], options: [], correctOptionId: '' }
  it.each(['8√2', '8 √2', '8 akar 2', '8akar(2)', '8*√2', '8 x √2', '8 sqrt(2)'])('akar menerima %j', (v) =>
    expect(isAnswerCorrect(akar, v)).toBe(true),
  )
  it.each(['8', '2', '8√3', '√2', '16√2'])('akar menolak %j', (v) => expect(isAnswerCorrect(akar, v)).toBe(false))

  const kata: Question = { ...base, answer: 'siku-siku', alternativeAnswers: [], options: [], correctOptionId: '' }
  it.each(['siku-siku', 'Siku siku', 'sikusiku', 'segitiga siku-siku', 'SIKU-SIKU.'])('kata menerima %j', (v) =>
    expect(isAnswerCorrect(kata, v)).toBe(true),
  )
  it.each(['lancip', 'tumpul', ''])('kata menolak %j', (v) => expect(isAnswerCorrect(kata, v)).toBe(false))

  const ya: Question = { ...base, answer: 'ya', alternativeAnswers: [], options: [], correctOptionId: '' }
  it('ya / iya diterima, bukan/tidak ditolak', () => {
    expect(isAnswerCorrect(ya, 'Iya')).toBe(true)
    expect(isAnswerCorrect(ya, 'bukan')).toBe(false)
    expect(isAnswerCorrect(ya, 'tidak')).toBe(false)
  })
})

describe('normalizeAnswer', () => {
  it('menyeragamkan spasi, huruf besar, titik akhir, koma desimal', () => {
    expect(normalizeAnswer('  10,5   CM. ')).toBe('10.5cm')
  })
})

describe('seluruh bank soal', () => {
  it('jumlah soal & id unik', () => {
    expect(questions.length).toBe(50)
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length)
  })

  it.each(questions.map((q) => [q.id, q] as const))('%s: kunci, variasi, huruf & teks opsi benar → BENAR', (_id, q) => {
    expect(isAnswerCorrect(q, q.answer)).toBe(true)
    q.alternativeAnswers?.forEach((a) => expect(isAnswerCorrect(q, a)).toBe(true))
    expect(isAnswerCorrect(q, q.correctOptionId)).toBe(true)
    const correct = q.options.find((o) => o.id === q.correctOptionId)
    expect(correct).toBeDefined()
    expect(isAnswerCorrect(q, correct!.text)).toBe(true)
  })

  it.each(questions.map((q) => [q.id, q] as const))('%s: huruf & teks opsi salah → SALAH', (_id, q) => {
    q.options
      .filter((o) => o.id !== q.correctOptionId)
      .forEach((o) => {
        expect(isAnswerCorrect(q, o.id)).toBe(false)
        // teks opsi salah tidak boleh kebetulan sama dengan kunci
        const sameAsKey = [q.answer, ...(q.alternativeAnswers ?? [])].some(
          (k) => normalizeAnswer(k) === normalizeAnswer(o.text),
        )
        if (!sameAsKey) expect(isAnswerCorrect(q, o.text)).toBe(false)
      })
  })
})
