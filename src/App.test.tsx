// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import App from './App'
import { questions } from './data/questions'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

const click = (name: RegExp | string) => fireEvent.click(screen.getByRole('button', { name }))

function startGame(container: HTMLElement, total?: number) {
  if (total) {
    const range = Array.from(container.querySelectorAll<HTMLInputElement>('input[type=range]')).find(
      (i) => i.max === String(questions.length),
    )!
    fireEvent.change(range, { target: { value: String(total) } })
  }
  click(/Mulai Game Kuis/)
}

/** Cari soal yang sedang tampil dari teks layar. */
function currentQuestion() {
  const body = document.body.textContent ?? ''
  const q = questions.find((x) => body.includes(x.text))
  if (!q) throw new Error('soal tidak ditemukan di layar')
  return q
}

describe('alur permainan (UI)', () => {
  it('batas "maks bank" mengikuti jumlah soal sebenarnya', () => {
    const { container } = render(<App />)
    expect(container.textContent).toContain(`Maks Bank: ${questions.length} Soal`)
    const range = Array.from(container.querySelectorAll<HTMLInputElement>('input[type=range]')).find(
      (i) => i.max === String(questions.length),
    )
    expect(range).toBeDefined()
  })

  it('jawaban diketik → dinilai konsisten dengan skor → guru bisa mengoreksi → sampai hasil', () => {
    const { container } = render(<App />)
    startGame(container, 5)

    const q = currentQuestion()
    click(/Mulai Menjawab/)

    fireEvent.change(screen.getByLabelText('Jawaban Tim Hipotenusa'), { target: { value: `  ${q.answer.toUpperCase()}  ` } })
    fireEvent.change(screen.getByLabelText('Jawaban Tim Sisi Alas'), { target: { value: q.correctOptionId.toLowerCase() } }) // huruf opsi
    fireEvent.change(screen.getByLabelText('Jawaban Tim Sisi Tegak'), { target: { value: 'jawaban ngawur' } })
    click(/Periksa Jawaban/)

    // 2 benar (jawaban + huruf opsi) — dan layar SAMA dengan skor
    expect(screen.getByText(/2 \/ 4 Benar/)).toBeTruthy()
    expect(screen.getAllByText('Ubah ke Salah')).toHaveLength(2)
    expect(screen.getAllByText('Ubah ke Benar')).toHaveLength(2)

    // guru membenarkan Tim Sisi Tegak
    fireEvent.click(screen.getAllByText('Ubah ke Benar')[0])
    expect(screen.getByText(/3 \/ 4 Benar/)).toBeTruthy()
    expect(container.textContent).toContain('(dikoreksi)')

    // lanjutkan sampai selesai (5 soal)
    for (let i = 0; i < 4; i++) {
      click(/Soal Berikutnya/)
      click(/Mulai Menjawab/)
      click(/Periksa Jawaban/)
    }
    expect(screen.queryByText(/Soal Berikutnya/)).toBeNull()
    click(/Lihat Hasil/)
    expect(screen.getByRole('button', { name: /Main Lagi/ })).toBeTruthy()
  })

  it('waktu habis → jawaban otomatis diperiksa', () => {
    vi.useFakeTimers()
    const { container } = render(<App />)
    startGame(container, 5)
    click(/Mulai Menjawab/)
    expect(screen.queryByText(/Soal Berikutnya/)).toBeNull()

    act(() => {
      vi.advanceTimersByTime(300 * 1000) // melewati batas waktu soal mana pun
    })
    expect(screen.getByText(/Soal Berikutnya/)).toBeTruthy()
    expect(screen.getByText(/0 \/ 4 Benar/)).toBeTruthy()
  })

  it('jeda menghentikan hitung mundur', () => {
    vi.useFakeTimers()
    const { container } = render(<App />)
    startGame(container, 5)
    click(/Mulai Menjawab/)
    act(() => { vi.advanceTimersByTime(3000) })
    const before = screen.getByRole('timer').textContent
    click(/Jeda/)
    act(() => { vi.advanceTimersByTime(20000) })
    expect(screen.getByRole('timer').textContent).toBe(before)
    click(/Lanjut/)
    act(() => { vi.advanceTimersByTime(2000) })
    expect(screen.getByRole('timer').textContent).not.toBe(before)
  })
})
