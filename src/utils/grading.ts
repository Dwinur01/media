// ============================================================
//  Penilaian jawaban — satu-satunya sumber kebenaran
//  (dipakai untuk skor DAN untuk warna benar/salah di layar)
// ============================================================
import type { Question } from '../types'

/** Satuan ukur yang boleh ditambahkan/dihilangkan pada jawaban angka. */
const MEASURE_UNITS = new Set([
  '', 'cm', 'm', 'km', 'mm', 'dm', 'cm2', 'm2', 'km2', 'cm²', 'm²', 'km²',
  'cm^2', 'm^2', 'satuan', 'meter', 'sentimeter', 'derajat', '°', 'deg', 'persegi',
])

const SYNONYMS: Record<string, string> = {
  iya: 'ya',
  yes: 'ya',
  tidak: 'bukan',
  'tidakbenar': 'bukan',
}

/**
 * Menyeragamkan teks jawaban: huruf kecil, tanpa spasi/tanda hubung,
 * titik akhir, awalan "c =", kata "segitiga", dan bentuk akar ditulis √.
 */
export function normalizeAnswer(raw: string): string {
  let s = raw
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u2212\u2013\u2014]/g, '-')
    .trim()

  // "c = 10", "x=10", "= 10" → "10"
  s = s.replace(/^\s*[a-z]?\s*=\s*/, '')
  // "akar 2", "akar(2)", "sqrt(2)", "sqrt 2" → "√2"
  s = s.replace(/(?:akar|sqrt)\s*\(?\s*(\d+)\s*\)?/g, '√$1')
  // tanda kali eksplisit: 8*√2, 8×√2, 8·√2 → 8√2
  s = s.replace(/\s*[*×·x]\s*(?=√)/g, '')

  // buang spasi dan tanda hubung, titik/koma di akhir
  s = s.replace(/[\s-]+/g, '').replace(/[.,!?;:]+$/g, '')
  // "segitigasikusiku" → "sikusiku"
  s = s.replace(/^segitiga(?=.)/, '')
  // koma desimal → titik (10,5 → 10.5)
  s = s.replace(/(\d),(\d)/g, '$1.$2')

  return SYNONYMS[s] ?? s
}

interface NumericParts {
  value: number
  unit: string
}

function parseNumeric(normalized: string): NumericParts | null {
  const m = /^([-+]?\d+(?:\.\d+)?)(.*)$/.exec(normalized)
  if (!m) return null
  const value = Number(m[1])
  if (!Number.isFinite(value)) return null
  return { value, unit: m[2] }
}

/** Dua jawaban angka dianggap sama jika nilainya sama dan satuannya cocok. */
function numericEqual(a: NumericParts, b: NumericParts): boolean {
  if (Math.abs(a.value - b.value) > 1e-9) return false
  if (a.unit === b.unit) return true
  // satuan ukur boleh dihilangkan/ditambah (10 = 10 cm). Bentuk akar (8√2) tidak.
  return MEASURE_UNITS.has(a.unit) && MEASURE_UNITS.has(b.unit)
}

/**
 * Apakah teks yang diketik kelompok cocok dengan kunci jawaban soal?
 * Menerima: jawaban utama, variasi, huruf opsi (A–D), teks opsi benar,
 * dan angka dengan/tanpa satuan ("10", "10 cm", "10,0").
 */
export function isAnswerCorrect(question: Question, raw: string): boolean {
  const input = normalizeAnswer(raw ?? '')
  if (!input) return false

  const correctOption = question.options?.find((o) => o.id === question.correctOptionId)
  const candidates = [
    question.answer,
    ...(question.alternativeAnswers ?? []),
    ...(correctOption ? [correctOption.text] : []),
  ].map(normalizeAnswer)

  if (candidates.includes(input)) return true

  // Huruf opsi: "A", "b" … (opsi yang salah → salah)
  const chosen = question.options?.find((o) => normalizeAnswer(o.id) === input)
  if (chosen) return chosen.id === question.correctOptionId

  // Angka: bandingkan nilainya, bukan tulisannya
  const inputNum = parseNumeric(input)
  if (inputNum) {
    return candidates.some((c) => {
      const cNum = parseNumeric(c)
      return cNum !== null && numericEqual(inputNum, cNum)
    })
  }

  return false
}
