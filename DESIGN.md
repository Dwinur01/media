# DESIGN.md — Pythagoras Academic (Tema Terang Navy)

Sistem desain awalnya dibuat lewat Stitch AI (`projects/7467567948730528501`) dengan tema gelap
"Academic Luxury", lalu dialihkan ke **tema terang navy + amber** (commit `feat: implement light theme`).
Dokumen ini mengikuti nilai yang benar-benar dipakai di `tailwind.config.js` dan `src/index.css`.

## 1. Design Tokens

### Warna
| Token | Hex | Pemakaian |
|---|---|---|
| `bg-base` | `#F8FAFC` | Latar halaman |
| `bg-panel` / `surface-elevated` | `#FFFFFF` | Kartu, panel, modal |
| `surface-container` | `#F1F5F9` | Kontainer sekunder, input |
| `ink` / `paper-text` | `#0F172A` | Teks utama |
| `navy` / `navy-hover` | `#1E3A8A` / `#172554` | Tombol utama, aksen, timer normal |
| `gold` / `brass` | `#D97706` | Aksen hangat (sebenarnya amber/oranye), peringatan timer |
| `gold-soft` | `#FCD34D` | Aksen lembut, ikon favicon |
| `brass-soft` / `brass-text` | `#FEF3C7` / `#92400E` | Latar & teks lencana amber |
| `muted-line` | `#E2E8F0` | Garis tipis / border |
| `right` | `#0D9488` | Jawaban benar |
| `wrong` | `#DC2626` | Jawaban salah, timer kritis |

> Catatan: nama token `gold`/`brass` dipertahankan agar kelas Tailwind lama tetap bekerja, padahal nilainya kini amber `#D97706`.

### Tipografi
- **Judul & rumus**: Cormorant Garamond (cadangan EB Garamond, Georgia)
- **Isi, input, data**: Inter (angka tabular untuk timer)
- **Label**: Inter huruf kapital, `tracking` 0.15–0.25em
- Font dimuat **lokal** lewat paket `@fontsource/*` (lihat `src/main.tsx`), jadi tetap tampil tanpa internet.

### Elevasi
- `shadow-gold-glow` `0 0 24px rgba(217,119,6,.25)` · `shadow-gold-glow-lg` `0 0 36px rgba(217,119,6,.4)`
- `shadow-card-ambient` `0 20px 60px rgba(15,23,42,.08)`
- Hairline: border 1px `muted-line`

## 2. Layar
1. **Setup** — jumlah & nama tim (2–12), durasi per soal, jumlah soal (maks sesuai bank, kini 50), poin benar, Bonus Streak, Peringkat Langsung, Efek Audio Bel, akses Bank Soal.
2. **Game** — grid 12 kolom: 8 kolom soal + arena jawaban, 4 kolom timer / peringkat / tim / progres. Fase: *reading → answering → reveal*.
3. **Reveal** — hasil benar/salah per tim, tombol **Ubah ke Benar/Salah** untuk koreksi guru, kunci jawaban & pembahasan.
4. **Podium (Result)** — podium 3 juara + tabel klasemen lengkap.
5. **Bank Soal (modal)** — 50 soal di 5 kategori (10 per kategori), dapat disaring dan dicari.

## 3. Aksesibilitas
- Timer memakai `role="timer"` dan label teks sisa waktu.
- Wilayah `role="status"` (tersembunyi visual) mengumumkan perubahan fase dan hasil.
- Status benar/salah selalu disertai ikon dan teks, bukan warna saja.
- Setiap input jawaban punya `aria-label` nama kelompok.
