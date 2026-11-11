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

## Mode Rebutan
Aktifkan di Setup (*Mode Rebutan*). Alurnya:
1. *Buka Buzzer* — timer berjalan, semua kelompok boleh menekan.
2. Kelompok tercepat menekan tombolnya (atau angka **1–9**, **0** = tim ke-10; tim 11–12 lewat klik). Timer berhenti.
3. Guru mengetik jawaban lalu *Periksa Ketikan*, atau menilai jawaban lisan dengan *Tandai Benar/Salah*.
4. **Benar** → poin untuk kelompok itu, soal selesai. **Salah** → kelompok itu gugur untuk soal ini, timer lanjut, kelompok lain boleh merebut.
5. Semua gugur, waktu habis, atau *Tutup Soal* → pembahasan. Kelompok yang tidak menjawab tidak dihitung salah dan streaknya tidak putus.

*Batal (salah pencet)* mengembalikan buzzer tanpa menggugurkan. Koreksi guru (*Ubah ke Benar/Salah*) tetap tersedia setelah pembahasan.

## Simpan otomatis
Selama permainan berjalan, sesi disimpan ke `localStorage` (hanya id soal, tim, jawaban, dan pengaturan; skor dihitung ulang).
Saat halaman dibuka lagi muncul banner **Lanjutkan Permainan / Buang**. Soal yang sedang berjalan kembali ke fase baca
(timer tidak bisa dilanjutkan persis); fase pembahasan dipulihkan lengkap dengan jawaban dan penilaiannya.
Sesi dihapus otomatis saat permainan selesai. Data rusak atau dari versi lain diabaikan.

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
  utils/          grading, scoring, persistence, buzzer, sanitizeSvg, sound
  data/           questions.ts (bank 50 soal, 5 kategori)
  types/          index.ts (satu-satunya sumber tipe)
```

## Menambah soal
Tambahkan objek ke `questions` di `src/data/questions.ts` (id unik, `answer`, `options`, `correctOptionId`).
Tes `grading.test.ts` otomatis memeriksa bahwa kunci, variasi, huruf & teks opsi benar dinilai **benar**
dan opsi salah dinilai **salah** untuk setiap soal.

## Keamanan
Ilustrasi SVG dipasang lewat `dangerouslySetInnerHTML`, tetapi selalu dibersihkan dengan DOMPurify (`sanitizeSvg`).
