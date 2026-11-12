# 📐 Kuis Kelompok Pythagoras

> Kuis kelas yang seru, interaktif, dan bikin Teorema Pythagoras nggak lagi bikin ngantuk! 🎉

Halo! 👋 Ini adalah game kuis buat seisi kelas dengan topik **Teorema Pythagoras**. Cukup satu perangkat (laptop yang diproyeksikan ke layar, misalnya), lalu **2–12 kelompok** bisa bertanding bareng. Guru jadi "host" yang memegang kendali jalannya soal. Skor, timer, papan peringkat, sampai pembahasan semuanya jalan otomatis. Tinggal fokus seru-seruan!

## ✨ Fitur Unggulan

- 👥 **2–12 kelompok** dalam satu layar, dibedakan warna dan nomor
- ⏱️ **Timer** yang bisa dijeda dan diatur ulang
- 🤖 **Penilaian otomatis yang pintar**: jawaban `10`, `10 cm`, `c = 10`, atau `8 akar 2` sama-sama dikenali
- ✏️ **Koreksi guru**: salah nilai? Tinggal klik *Ubah ke Benar/Salah*, skor langsung dihitung ulang
- 🔥 **Bonus streak** kalau kelompok benar beruntun
- ⚡ **Mode Rebutan** ala cerdas cermat, pakai buzzer (tombol angka **1–9** dan **0**)
- 🏆 **Podium juara** dan klasemen lengkap di akhir permainan
- 📚 **Bank 50 soal** dalam 5 kategori, bisa dicari dan disaring
- 💾 **Simpan otomatis**: browser tertutup di tengah permainan? Tenang, bisa lanjut lagi
- 🔊 Efek bunyi bel dan tampilan yang nyaman dibaca lewat proyektor

## 🧰 Dibangun Dengan

React 18 · Vite 5 · TypeScript · Tailwind CSS 3 · Vitest

## 🚀 Cara Menjalankan

**Yang perlu disiapkan:** [Node.js](https://nodejs.org) versi 18 ke atas dan Git.

```bash
# 1. Clone dulu repo-nya
git clone https://github.com/Dwinur01/media.git

# 2. Masuk ke foldernya
cd media

# 3. Install semua kebutuhannya
npm install

# 4. Jalankan!
npm run dev
```

Setelah itu buka alamat yang muncul di terminal (biasanya `http://localhost:5173`) dan kuis siap dimainkan. 🎮

### Perintah lain yang berguna

| Perintah | Fungsinya |
|---|---|
| `npm run dev` | Jalankan mode pengembangan |
| `npm run build` | Cek tipe, lalu bikin versi produksi |
| `npm run preview` | Coba hasil build di lokal |
| `npm run lint` | Cek kerapian kode dengan ESLint |
| `npm test` | Jalankan semua tes |

## 🎮 Cara Bermain

1. **Setup**: atur jumlah dan nama kelompok, durasi, jumlah soal, dan poin, lalu klik *Mulai Game Kuis*.
2. **Baca soal**, lalu klik *Mulai Menjawab*. Timer langsung jalan.
3. Tiap kelompok mengetik jawabannya. Klik *Periksa Jawaban* (atau tunggu waktu habis) dan semua kelompok dinilai sekaligus.
4. Kalau ada penilaian yang kurang pas, guru bisa menekan **Ubah ke Benar/Salah**.
5. Lanjut *Soal Berikutnya* sampai *Lihat Hasil* untuk melihat podium juara. 🏆

### ⚡ Mode Rebutan

Aktifkan lewat pengaturan di layar Setup:

1. Guru menekan *Buka Buzzer*, dan semua kelompok boleh berebut.
2. Kelompok tercepat menekan tombolnya (atau angka **1–9**, **0** untuk tim ke-10). Timer berhenti.
3. Jawaban dinilai: **benar** berarti poin untuk kelompok itu dan soal selesai, **salah** berarti kelompok itu gugur dan yang lain boleh merebut.
4. Salah pencet? Pakai tombol *Batal* supaya buzzer kembali tanpa ada yang gugur.

## 🛠️ Mau Ikut Memperbaiki? Yuk Clone!

Kamu menemukan bug, mau menambah soal, atau punya ide fitur baru? Mantap! Begini caranya:

1. **Fork** repo ini lewat tombol *Fork* di GitHub (opsional, tapi disarankan kalau kamu bukan pemilik repo).
2. **Clone** ke komputermu:
   ```bash
   git clone https://github.com/Dwinur01/media.git
   cd media
   npm install
   ```
3. **Buat branch baru** supaya rapi:
   ```bash
   git checkout -b perbaikan-keren
   ```
4. **Ubah kodenya** sesukamu, lalu pastikan semuanya aman:
   ```bash
   npm run lint
   npm test
   ```
5. **Commit dan push:**
   ```bash
   git add .
   git commit -m "Jelaskan perbaikanmu di sini"
   git push origin perbaikan-keren
   ```
6. Buka GitHub dan buat **Pull Request**. Nanti kita lihat bareng-bareng! 🙌

### ➕ Menambah Soal Baru

Tambahkan satu objek ke `questions` di `src/data/questions.ts` (isi `id` yang unik, `answer`, `options`, dan `correctOptionId`). Tes otomatis akan memeriksa apakah kunci jawabannya dinilai benar dan opsi yang salah dinilai salah.

## 🗂️ Struktur Folder

```
src/
  components/   # Tampilan: setup, game, result, shared
  context/      # Logika game (gameReducer) + provider
  hooks/        # useCountdown (timer)
  utils/        # Penilaian, skor, simpan otomatis, buzzer, suara
  data/         # Bank 50 soal
  types/        # Definisi tipe TypeScript
```

Detail tampilan dan warna ada di [`DESIGN.md`](./DESIGN.md).

## 💡 Catatan Kecil

- **Penilaian satuan itu longgar.** `10 m` dianggap sama dengan `10 cm`. Kalau butuh lebih ketat, pakai fitur koreksi guru.
- **Soal yang sedang berjalan** akan kembali ke fase baca saat sesi dilanjutkan, karena timer tidak bisa dilanjutkan persis.
- **Aman dari kode jahil.** Ilustrasi SVG selalu dibersihkan dengan DOMPurify sebelum ditampilkan.

## 👤 Pembuat

Dibuat dengan ☕ oleh [@Dwinur01](https://github.com/Dwinur01)

---

⭐ Kalau proyek ini berguna buat kelasmu, jangan lupa kasih bintang ya!
