// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import App from './App'
import { questions } from './data/questions'
import { SESSION_KEY } from './utils/persistence'

beforeEach(() => localStorage.clear())
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  localStorage.clear()
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

describe('simpan & lanjutkan (localStorage)', () => {
  it('muat ulang halaman → muncul banner → Lanjutkan kembali ke soal yang sama', () => {
    const first = render(<App />)
    startGame(first.container, 5)
    const q = currentQuestion()
    expect(localStorage.getItem(SESSION_KEY)).not.toBeNull()
    first.unmount() // simulasi refresh

    const { container } = render(<App />)
    expect(screen.getByText(/Ada permainan yang belum selesai/)).toBeTruthy()
    expect(container.textContent).toContain('Soal 1 dari 5')
    click(/Lanjutkan Permainan/)
    expect(document.body.textContent).toContain(q.text)
    expect(screen.queryByText(/Ada permainan yang belum selesai/)).toBeNull()
  })

  it('refresh saat fase hasil (reveal) → jawaban & penilaian ikut pulih', () => {
    const first = render(<App />)
    startGame(first.container, 5)
    const q = currentQuestion()
    click(/Mulai Menjawab/)
    fireEvent.change(screen.getByLabelText('Jawaban Tim Hipotenusa'), { target: { value: q.answer } })
    click(/Periksa Jawaban/)
    expect(screen.getByText(/1 \/ 4 Benar/)).toBeTruthy()
    first.unmount()

    render(<App />)
    click(/Lanjutkan Permainan/)
    expect(screen.getByText(/1 \/ 4 Benar/)).toBeTruthy()
    expect((screen.getByLabelText('Jawaban Tim Hipotenusa') as HTMLInputElement).value).toBe(q.answer)
    expect(screen.getByText(/Soal Berikutnya/)).toBeTruthy()
  })

  it('Buang menghapus sesi tersimpan', () => {
    const first = render(<App />)
    startGame(first.container, 5)
    first.unmount()
    render(<App />)
    click(/^Buang$/)
    expect(screen.queryByText(/Ada permainan yang belum selesai/)).toBeNull()
    expect(localStorage.getItem(SESSION_KEY)).toBeNull()
  })

  it('permainan selesai → sesi dihapus, tidak ada banner lagi', () => {
    const first = render(<App />)
    startGame(first.container, 5)
    for (let i = 0; i < 5; i++) {
      click(/Mulai Menjawab/)
      click(/Periksa Jawaban/)
      click(i === 4 ? /Lihat Hasil/ : /Soal Berikutnya/)
    }
    expect(localStorage.getItem(SESSION_KEY)).toBeNull()
    first.unmount()
    render(<App />)
    expect(screen.queryByText(/Ada permainan yang belum selesai/)).toBeNull()
  })

  it('data tersimpan yang rusak diabaikan tanpa error', () => {
    localStorage.setItem(SESSION_KEY, '{"v":1,"phase":"reading"')
    render(<App />)
    expect(screen.queryByText(/Ada permainan yang belum selesai/)).toBeNull()
    expect(screen.getByRole('button', { name: /Mulai Game Kuis/ })).toBeTruthy()
  })
})

describe('Mode Rebutan', () => {
  function startBuzzer(container: HTMLElement, total = 5) {
    fireEvent.click(screen.getByLabelText(/Mode Rebutan/))
    startGame(container, total)
  }
  const answerBox = () => screen.getByLabelText(/Ketik jawaban/)

  it('tanpa mode rebutan tidak ada buzzer (mode klasik tetap)', () => {
    const { container } = render(<App />)
    startGame(container, 5)
    click(/Mulai Menjawab/)
    expect(screen.queryByText(/Arena Rebutan/)).toBeNull()
  })

  it('salah → kelompok gugur → kelompok lain merebut lewat keyboard & benar', () => {
    const { container } = render(<App />)
    startBuzzer(container)
    const q = currentQuestion()
    click(/Buka Buzzer/)
    expect(screen.getByText(/Arena Rebutan/)).toBeTruthy()

    click(/^Buzzer Tim Hipotenusa$/)
    expect(screen.getByText(/Tim Hipotenusa menjawab!/)).toBeTruthy()
    fireEvent.change(answerBox(), { target: { value: 'ngawur' } })
    click(/Periksa Ketikan/)

    // Tim 1 gugur; menekan "1" lagi tidak berpengaruh
    expect((screen.getByRole('button', { name: /Buzzer Tim Hipotenusa \(gugur\)/ }) as HTMLButtonElement).disabled).toBe(true)
    fireEvent.keyDown(window, { key: '1' })
    expect(screen.queryByText(/Tim Hipotenusa menjawab!/)).toBeNull()

    // Tim 2 merebut lewat tombol "2"
    fireEvent.keyDown(window, { key: '2' })
    expect(screen.getByText(/Tim Sisi Alas menjawab!/)).toBeTruthy()
    fireEvent.change(answerBox(), { target: { value: q.answer } })
    click(/Periksa Ketikan/)

    expect(screen.getByText(/1 \/ 4 Benar/)).toBeTruthy()
    expect(screen.getAllByDisplayValue('— tidak menjawab —')).toHaveLength(2)
    expect(screen.getByText(/Soal Berikutnya/)).toBeTruthy()
  })

  it('jawaban lisan: guru menekan Tandai Benar', () => {
    const { container } = render(<App />)
    startBuzzer(container)
    click(/Buka Buzzer/)
    fireEvent.keyDown(window, { key: '3' })
    click(/Tandai Benar/)
    expect(screen.getByText(/1 \/ 4 Benar/)).toBeTruthy()
    expect(screen.getByDisplayValue('(jawaban lisan)')).toBeTruthy()
  })

  it('semua kelompok salah → soal otomatis ditutup', () => {
    const { container } = render(<App />)
    startBuzzer(container)
    click(/Buka Buzzer/)
    for (let i = 1; i <= 3; i++) {
      fireEvent.keyDown(window, { key: String(i) })
      click(/Tandai Salah/)
      expect(screen.queryByText(/Soal Berikutnya/)).toBeNull() // masih ada yang boleh merebut
    }
    fireEvent.keyDown(window, { key: '4' })
    click(/Tandai Salah/)
    expect(screen.getByText(/0 \/ 4 Benar/)).toBeTruthy()
    expect(screen.getByText(/Soal Berikutnya/)).toBeTruthy()
  })

  it('Batal (salah pencet) mengembalikan buzzer tanpa menggugurkan', () => {
    const { container } = render(<App />)
    startBuzzer(container)
    click(/Buka Buzzer/)
    fireEvent.keyDown(window, { key: '1' })
    click(/Batal/)
    expect(screen.getByText(/Arena Rebutan/)).toBeTruthy()
    expect((screen.getByRole('button', { name: /^Buzzer Tim Hipotenusa$/ }) as HTMLButtonElement).disabled).toBe(false)
  })

  it('timer berhenti saat ada yang menekan buzzer, lanjut setelah batal', () => {
    vi.useFakeTimers()
    const { container } = render(<App />)
    startBuzzer(container)
    click(/Buka Buzzer/)
    act(() => { vi.advanceTimersByTime(3000) })
    fireEvent.keyDown(window, { key: '1' })
    const frozen = screen.getByRole('timer').textContent
    act(() => { vi.advanceTimersByTime(20000) })
    expect(screen.getByRole('timer').textContent).toBe(frozen)
    click(/Batal/)
    act(() => { vi.advanceTimersByTime(2000) })
    expect(screen.getByRole('timer').textContent).not.toBe(frozen)
  })

  it('waktu habis tanpa yang menekan → soal ditutup, tidak ada yang dinilai salah', () => {
    vi.useFakeTimers()
    const { container } = render(<App />)
    startBuzzer(container)
    click(/Buka Buzzer/)
    act(() => { vi.advanceTimersByTime(300 * 1000) })
    expect(screen.getByText(/0 \/ 4 Benar/)).toBeTruthy()
    expect(screen.getAllByDisplayValue('— tidak menjawab —')).toHaveLength(4)
  })

  it('tombol angka diabaikan saat mengetik di kotak jawaban', () => {
    const { container } = render(<App />)
    startBuzzer(container)
    click(/Buka Buzzer/)
    fireEvent.keyDown(window, { key: '1' })
    const box = answerBox()
    fireEvent.keyDown(box, { key: '2', bubbles: true })
    expect(screen.getByText(/Tim Hipotenusa menjawab!/)).toBeTruthy()
    expect(screen.queryByText(/Tim Sisi Alas menjawab!/)).toBeNull()
  })

  it('Tutup Soal mengakhiri rebutan tanpa pemenang', () => {
    const { container } = render(<App />)
    startBuzzer(container)
    click(/Buka Buzzer/)
    click(/Tutup Soal/)
    expect(screen.getByText(/0 \/ 4 Benar/)).toBeTruthy()
  })
})
