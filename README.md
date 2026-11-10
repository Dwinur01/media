# Kuis Kelompok Pythagoras

Game kuis kelas interaktif tentang Teorema Pythagoras. Satu perangkat (misalnya diproyeksikan) dipakai bersama
oleh 2–12 kelompok; guru mengendalikan jalannya soal.

**Stack:** React 18 · Vite 5 · TypeScript · Tailwind CSS 3 · Vitest

## Menjalankan
```bash
npm install
npm run dev       # pengembangan
npm run build     # typecheck + build produksi
npm run lint      # ESLint
npm test          # unit test + tes alur UI
```

## Cara bermain
1. **Setup** — atur tim, durasi, jumlah soal, poin, lalu *Mulai Game Kuis*.
2. **Baca soal** → *Mulai Menjawab* (timer berjalan; bisa dijeda/diatur ulang).
3. Tiap kelompok mengetik jawaban. *Periksa Jawaban* (atau waktu habis) menilai semua kelompok sekaligus.
4. Guru dapat menekan **Ubah ke Benar/Salah** pada kelompok mana pun; skor dan streak dihitung ulang otomatis.
5. *Soal Berikutnya* … sampai *Lihat Hasil* (podium + klasemen).

## Aturan penilaian (`src/utils/grading.ts`)
Satu fungsi `isAnswerCorrect(question, teks)` dipakai untuk skor **dan** warna di layar. Jawaban diterima bila:
- sama dengan kunci / variasi jawaban, tanpa membedakan huruf besar-kecil, spasi, tanda hubung, atau titik di akhir;
- huruf opsi yang benar (A–D), atau teks opsi yang benar;
- angka dengan nilai sama, dengan/tanpa satuan ukur: `10`, `10 cm`, `10,0`, `c = 10`;
- bentuk akar: `8√2`, `8 akar 2`, `8*√2`, `sqrt(2)`; kata: `segitiga siku-siku`, `iya`.

Satuan ukur dibuat longgar (10 m dianggap sama dengan 10 cm); gunakan koreksi guru bila perlu lebih ketat.

Skor: `pointsPerCorrect` per jawaban benar + bonus streak (`bonusStreak × ⌊streak/2⌋` mulai streak ke-2).
Skor selalu **dihitung ulang dari daftar jawaban** (`src/utils/scoring.ts`), sehingga koreksi manual konsisten.

## Struktur
```
src/
  components/{setup,game,result,shared}   UI per layar
  context/        gameReducer.ts (logika murni) + GameContext.tsx (provider & hook)
  hooks/          useCountdown (timer berbasis jam sistem)
  utils/          grading, scoring, sanitizeSvg, sound
  data/           questions.ts (bank 50 soal, 5 kategori)
  types/          index.ts (satu-satunya sumber tipe)
```

## Menambah soal
Tambahkan objek ke `questions` di `src/data/questions.ts` (id unik, `answer`, `options`, `correctOptionId`).
Tes `grading.test.ts` otomatis memeriksa bahwa kunci, variasi, huruf & teks opsi benar dinilai **benar**
dan opsi salah dinilai **salah** untuk setiap soal.

## Keamanan
Ilustrasi SVG dipasang lewat `dangerouslySetInnerHTML`, tetapi selalu dibersihkan dengan DOMPurify (`sanitizeSvg`).
