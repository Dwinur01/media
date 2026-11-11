import { useState } from 'react'
import { BankSoalModal } from '../shared'
import { useGame } from '../../context/GameContext'
import { defaultQuizConfig, sampleQuestions } from '../../data/questions'

const QUESTION_COUNT = sampleQuestions.length

const DEFAULT_TEAMS_DATA = [
  { name: 'Tim Hipotenusa', color: '#EAB308', title: 'KELOMPOK I • HIPOTENUSA' },
  { name: 'Tim Sisi Alas', color: '#06B6D4', title: 'KELOMPOK II • SISI ALAS' },
  { name: 'Tim Sisi Tegak', color: '#A855F7', title: 'KELOMPOK III • SISI TEGAK' },
  { name: 'Tim Triple Pythagoras', color: '#F43F5E', title: 'KELOMPOK IV • TRIPLE PYTHAGORAS' },
  { name: 'Tim Sudut Siku', color: '#10B981', title: 'KELOMPOK V • SUDUT SIKU' },
  { name: 'Tim Emas Euclidean', color: '#F59E0B', title: 'KELOMPOK VI • EMAS EUCLIDEAN' },
  { name: 'Tim Segitiga Istimewa', color: '#3B82F6', title: 'KELOMPOK VII • SEGITIGA ISTIMEWA' },
  { name: 'Tim Teorema Kuno', color: '#EC4899', title: 'KELOMPOK VIII • TEOREMA KUNO' },
  { name: 'Tim Hipotesis Alpha', color: '#8B5CF6', title: 'KELOMPOK IX • HIPOTESIS ALPHA' },
  { name: 'Tim Vektor Euclid', color: '#14B8A6', title: 'KELOMPOK X • VEKTOR EUCLID' },
  { name: 'Tim Archimedes', color: '#F97316', title: 'KELOMPOK XI • ARCHIMEDES' },
  { name: 'Tim Pythagoras Sempurna', color: '#C9A227', title: 'KELOMPOK XII • PYTHAGORAS' },
]

export function SetupScreen() {
  const { setTeams, setConfig, startGame, savedSession, resumeGame, discardSavedGame } = useGame()

  // Form states
  const [groupCount, setGroupCount] = useState<number>(4)
  const [timerDuration, setTimerDuration] = useState<number>(45)
  const [totalQuestions, setTotalQuestions] = useState<number>(Math.min(15, QUESTION_COUNT))
  const [pointsPerCorrect, setPointsPerCorrect] = useState<number>(10)
  const [streakBonus, setStreakBonus] = useState<boolean>(true)
  const [liveRanking, setLiveRanking] = useState<boolean>(true)
  const [soundEffects, setSoundEffects] = useState<boolean>(true)
  const [buzzerMode, setBuzzerMode] = useState<boolean>(false)

  const [teamNames, setTeamNames] = useState<string[]>(
    DEFAULT_TEAMS_DATA.map((t) => t.name)
  )

  const [showBankSoal, setShowBankSoal] = useState<boolean>(false)

  const handleGroupCountChange = (count: number) => {
    const clamped = Math.max(2, Math.min(12, count))
    setGroupCount(clamped)
  }

  const handleTeamNameChange = (index: number, newName: string) => {
    setTeamNames((prev) => {
      const next = [...prev]
      next[index] = newName
      return next
    })
  }

  const handleStartGame = () => {
    const teams = teamNames.slice(0, groupCount).map((name, i) => ({
      id: `group-${i + 1}`,
      name: name.trim() || DEFAULT_TEAMS_DATA[i].name,
      color: DEFAULT_TEAMS_DATA[i].color,
    }))

    setTeams(teams)
    setConfig({
      questionsPerRound: totalQuestions,
      defaultTimeLimit: timerDuration,
      pointsPerCorrect,
      bonusStreak: streakBonus ? defaultQuizConfig.bonusStreak : 0,
      showLiveRanking: liveRanking,
      soundEffects,
      buzzerMode,
    })
    startGame()
  }

  const estimatedMinutes = Math.round((totalQuestions * (timerDuration + 25)) / 60)

  return (
    <div className="bg-bg-base text-ink min-h-screen flex flex-col font-body selection:bg-navy selection:text-white relative overflow-x-hidden">
      {/* Background Watermark & Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025] select-none flex items-center justify-center">
        <span className="font-heading text-[22vw] leading-none text-navy">a² + b² = c²</span>
      </div>

      {/* Top Navigation Bar */}
      <header className="w-full px-6 lg:px-16 py-4 flex justify-between items-center bg-white/95 border-b border-muted-line sticky top-0 z-40 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            {/* Euclidean Geometric Right-Triangle Emblem */}
            <div className="w-10 h-10 border border-navy/30 bg-navy/5 flex items-center justify-center rounded">
              <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <polygon points="4,20 20,20 20,4" />
                <line x1="16" x2="16" y1="20" y2="16" />
                <line x1="16" x2="20" y1="16" y2="16" />
              </svg>
            </div>
            <div>
              <span className="font-heading text-xl sm:text-2xl tracking-wider text-ink uppercase block leading-none font-semibold">
                Kuis Kelompok Pythagoras
              </span>
              <span className="text-[11px] font-body text-gold uppercase tracking-widest mt-1 block font-medium">
                Mode Turnamen Kelas • Matematika VIII
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <span className="text-navy font-semibold border-b-2 border-navy pb-1 cursor-default">
            Arena Setup
          </span>
          <button
            onClick={() => setShowBankSoal(true)}
            className="text-ink/70 hover:text-navy transition-colors pb-1 flex items-center gap-1.5"
          >
            <span>Bank Soal</span>
            <span className="text-[10px] bg-navy/10 text-navy font-bold px-1.5 py-0.5 rounded">{QUESTION_COUNT}</span>
          </button>
          <span className="text-ink/40 cursor-not-allowed pb-1">Klasemen</span>
          <span className="text-ink/40 cursor-not-allowed pb-1">Panduan</span>
        </nav>

        {/* Trailing Actions Cluster */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 border border-muted-line bg-surface-container text-xs text-ink/70 uppercase tracking-wider rounded">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Bank: {QUESTION_COUNT} Soal Terverifikasi</span>
          </div>
          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {})
              } else {
                document.exitFullscreen().catch(() => {})
              }
            }}
            className="p-2 text-ink/60 hover:text-navy transition-colors border border-muted-line hover:border-navy/40 rounded bg-white shadow-sm"
            title="Mode Layar Penuh Proyektor"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Workspace Area (12-Column Arena Grid) */}
      <main className="flex-1 w-full px-6 lg:px-16 py-8 max-w-[1920px] mx-auto flex flex-col justify-start">
        {savedSession && (
          <div
            role="region"
            aria-label="Permainan tersimpan"
            className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brass-soft border border-gold/40 rounded-lg px-5 py-4"
          >
            <div>
              <p className="font-heading text-lg text-brass-text font-semibold leading-tight">
                Ada permainan yang belum selesai
              </p>
              <p className="text-xs text-brass-text/80 mt-0.5">
                Soal {savedSession.questionNumber} dari {savedSession.totalQuestions} · {savedSession.teamCount} tim ·
                disimpan {new Date(savedSession.savedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={discardSavedGame}
                className="px-4 py-2 text-sm border border-gold/50 text-brass-text rounded hover:bg-white/60 transition-colors"
              >
                Buang
              </button>
              <button
                type="button"
                onClick={resumeGame}
                className="px-5 py-2 text-sm font-semibold bg-navy text-white rounded hover:bg-navy-hover focus:ring-2 focus:ring-brass focus:ring-offset-2 transition-colors"
              >
                Lanjutkan Permainan
              </button>
            </div>
          </div>
        )}
        {/* Arena Header Title */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-muted-line pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs text-gold uppercase tracking-widest font-semibold">
              <span>Konfigurasi Pertandingan Langsung</span>
              <span className="text-muted-line">/</span>
              <span className="text-ink/50">Fase 1: Setup Parameter</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl text-ink tracking-wide font-normal">
              Ruang Pengaturan Arena Kuis
            </h1>
          </div>
          <div className="flex items-center gap-2.5 text-ink/70 text-sm font-body">
            <span className="text-navy text-lg">📺</span>
            <span>Output Tampilan: <strong className="text-ink font-semibold">Proyektor Kelas</strong> (1080p 60Hz)</span>
          </div>
        </div>

        {/* Two-Column Asymmetrical Grid Layout (7 cols Left, 5 cols Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* LEFT COLUMN: Parameter Permainan (7 Columns) */}
          <section className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-muted-line p-6 lg:p-8 rounded-xl shadow-sm relative">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-muted-line pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 bg-navy rounded-sm" />
                  <h2 className="font-heading text-2xl text-ink font-medium">
                    Parameter Permainan
                  </h2>
                </div>
                <span className="text-xs uppercase tracking-widest text-navy/70 font-mono font-semibold">
                  Aturan Kuis Utama
                </span>
              </div>

              <div className="space-y-6">
                {/* Control 1: Jumlah Tim / Kelompok */}
                <div className="space-y-3 bg-surface-container p-5 border border-muted-line rounded-lg">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <label className="text-base font-semibold text-ink block">
                        Jumlah Tim / Kelompok
                      </label>
                      <p className="text-xs text-ink/60">
                        Roster aktif yang akan bertanding di papan skor proyektor
                      </p>
                    </div>
                    <div className="flex items-baseline gap-1 bg-white px-3.5 py-1 border border-muted-line rounded shadow-sm">
                      <span className="font-heading text-2xl text-navy font-bold">{groupCount}</span>
                      <span className="text-xs text-ink/60 font-medium">Kelompok</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min={2}
                    max={12}
                    step={1}
                    value={groupCount}
                    onChange={(e) => handleGroupCountChange(Number(e.target.value))}
                    className="w-full h-2 bg-muted-line appearance-none cursor-pointer accent-navy rounded-full"
                  />

                  {/* Quick Selector Pills */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] tracking-wider uppercase text-ink/50 font-semibold">PILIHAN CEPAT:</span>
                    <div className="flex gap-2">
                      {[2, 4, 6, 8, 12].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => handleGroupCountChange(n)}
                          className={`px-3 py-1 text-xs rounded transition-all ${
                            groupCount === n
                              ? 'border border-navy bg-navy text-white font-bold shadow-sm'
                              : 'border border-muted-line bg-white text-ink/70 hover:bg-surface-container hover:text-navy'
                          }`}
                        >
                          {n} Tim
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Control 2: Durasi Waktu Per Soal */}
                <div className="space-y-3 bg-surface-container p-5 border border-muted-line rounded-lg">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <label className="text-base font-semibold text-ink block">
                        Durasi Waktu Per Soal
                      </label>
                      <p className="text-xs text-ink/60">
                        Batas hitung mundur proyektor sebelum sesi pembuktian jawaban dikunci
                      </p>
                    </div>
                    <div className="flex items-baseline gap-1 bg-white px-3.5 py-1 border border-muted-line rounded shadow-sm">
                      <span className="font-heading text-2xl text-navy font-bold">{timerDuration}</span>
                      <span className="text-xs text-ink/60 font-medium">Detik</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min={15}
                    max={300}
                    step={5}
                    value={timerDuration}
                    onChange={(e) => setTimerDuration(Number(e.target.value))}
                    className="w-full h-2 bg-muted-line appearance-none cursor-pointer accent-navy rounded-full"
                  />

                  {/* Quick Presets */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] tracking-wider uppercase text-ink/50 font-semibold">PRESET WAKTU:</span>
                    <div className="flex gap-2">
                      {[
                        { s: 30, label: '30s (Kilat)' },
                        { s: 45, label: '45s (Standar)' },
                        { s: 60, label: '60s (Analisis)' },
                        { s: 90, label: '90s (Eksplorasi)' },
                      ].map((preset) => (
                        <button
                          key={preset.s}
                          type="button"
                          onClick={() => setTimerDuration(preset.s)}
                          className={`px-2.5 py-1 text-xs rounded transition-all ${
                            timerDuration === preset.s
                              ? 'border border-navy bg-navy text-white font-bold shadow-sm'
                              : 'border border-muted-line bg-white text-ink/70 hover:bg-surface-container hover:text-navy'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Subgrid: Total Soal & Poin Benar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Control 3: Total Soal Dimainkan */}
                  <div className="bg-surface-container p-5 border border-muted-line rounded-lg space-y-3">
                    <div className="flex justify-between items-baseline">
                      <label className="text-sm font-semibold text-ink">Total Soal</label>
                      <div className="flex items-baseline gap-1 bg-white px-2.5 py-0.5 border border-muted-line rounded shadow-sm">
                        <span className="font-heading text-xl text-navy font-bold">{totalQuestions}</span>
                        <span className="text-[10px] text-ink/40">/ {QUESTION_COUNT} Soal</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={Math.min(5, QUESTION_COUNT)}
                      max={QUESTION_COUNT}
                      step={1}
                      value={totalQuestions}
                      onChange={(e) => setTotalQuestions(Number(e.target.value))}
                      className="w-full h-2 bg-muted-line appearance-none cursor-pointer accent-navy rounded-full"
                    />
                    <div className="flex justify-between text-[11px] text-ink/50">
                      <span>Min: 5 Soal</span>
                      <span className="text-navy font-medium">Maks Bank: {QUESTION_COUNT} Soal</span>
                    </div>
                  </div>

                  {/* Control 4: Poin Per Jawaban Benar */}
                  <div className="bg-surface-container p-5 border border-muted-line rounded-lg space-y-3">
                    <div className="flex justify-between items-baseline">
                      <label className="text-sm font-semibold text-ink">Poin Benar</label>
                      <div className="flex items-baseline gap-1 bg-white px-2.5 py-0.5 border border-muted-line rounded shadow-sm">
                        <span className="font-heading text-xl text-navy font-bold">+{pointsPerCorrect}</span>
                        <span className="text-[10px] text-ink/60">Poin</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      step={1}
                      value={pointsPerCorrect}
                      onChange={(e) => setPointsPerCorrect(Number(e.target.value))}
                      className="w-full h-2 bg-muted-line appearance-none cursor-pointer accent-navy rounded-full"
                    />
                    <div className="flex items-center justify-between text-[11px] text-ink/50">
                      <span>Skala: 1 - 100</span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-navy hover:text-navy-hover font-medium">
                        <input
                          type="checkbox"
                          checked={streakBonus}
                          onChange={(e) => setStreakBonus(e.target.checked)}
                          className="accent-navy w-3.5 h-3.5 rounded"
                        />
                        <span>Bonus Streak</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Quick Settings Architectural Checkboxes */}
                <div className="pt-2 border-t border-muted-line grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="flex items-start gap-2.5 p-3 bg-surface-container border border-muted-line rounded hover:border-navy/40 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={liveRanking}
                      onChange={(e) => setLiveRanking(e.target.checked)}
                      className="mt-0.5 accent-navy w-4 h-4 rounded"
                    />
                    <div>
                      <span className="text-xs font-semibold text-ink block leading-tight">Peringkat Langsung</span>
                      <span className="text-[10px] text-ink/50">Tampilkan klasemen selama permainan</span>
                    </div>
                  </label>


                  <label className="flex items-start gap-2.5 p-3 bg-surface-container border border-muted-line rounded hover:border-navy/40 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={buzzerMode}
                      onChange={(e) => setBuzzerMode(e.target.checked)}
                      className="mt-0.5 accent-navy w-4 h-4 rounded"
                    />
                    <div>
                      <span className="text-xs font-semibold text-ink block leading-tight">Mode Rebutan</span>
                      <span className="text-[10px] text-ink/50">Tercepat menekan buzzer yang menjawab</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 bg-surface-container border border-muted-line rounded hover:border-navy/40 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={soundEffects}
                      onChange={(e) => setSoundEffects(e.target.checked)}
                      className="mt-0.5 accent-navy w-4 h-4 rounded"
                    />
                    <div>
                      <span className="text-xs font-semibold text-ink block leading-tight">Efek Audio Bel</span>
                      <span className="text-[10px] text-ink/50">Bunyi bel &amp; buzzer</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: Kustomisasi Tim & Anggota (5 Columns) */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-muted-line p-6 lg:p-8 rounded-xl shadow-sm relative">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-muted-line pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 bg-navy rounded-sm" />
                    <h2 className="font-heading text-2xl text-ink font-medium">
                      Daftar Tim Bertanding
                    </h2>
                  </div>
                  <p className="text-xs text-ink/50 mt-1">
                    Nama dan warna identitas kelompok untuk tampilan proyektor
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTeamNames((prev) => [...prev].sort(() => Math.random() - 0.5))
                  }}
                  className="px-2.5 py-1 text-xs border border-muted-line rounded text-ink/70 hover:border-navy hover:text-navy transition-colors flex items-center gap-1.5 bg-white shadow-sm"
                  title="Acak Urutan Tim"
                >
                  <span>⇄</span>
                  <span>Acak Nama</span>
                </button>
              </div>

              {/* Team Cards Grid */}
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
                {Array.from({ length: groupCount }).map((_, i) => {
                  const defaultMeta = DEFAULT_TEAMS_DATA[i % DEFAULT_TEAMS_DATA.length]
                  const color = defaultMeta.color
                  const currentName = teamNames[i] || defaultMeta.name

                  return (
                    <div
                      key={i}
                      className="p-3.5 bg-surface-container border border-muted-line hover:border-navy/40 rounded-lg transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Rotating Square Color Badge */}
                        <div
                          className="w-9 h-9 border flex items-center justify-center relative flex-shrink-0 rounded bg-white shadow-sm"
                          style={{ borderColor: `${color}60` }}
                        >
                          <span
                            className="w-3.5 h-3.5 rotate-45 shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider truncate"
                              style={{ color }}
                            >
                              {defaultMeta.title}
                            </span>
                            <span className="text-[10px] text-ink/40">5 Anggota</span>
                          </div>
                          <input
                            type="text"
                            value={currentName}
                            onChange={(e) => handleTeamNameChange(i, e.target.value)}
                            placeholder={defaultMeta.name}
                            maxLength={24}
                            className="w-full bg-white border border-muted-line focus:border-navy text-ink font-heading text-lg px-2.5 py-1 focus:outline-none rounded"
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Academic Protocol Box */}
              <div className="mt-5 p-4 border-l-2 border-navy bg-surface-container rounded-r flex items-start gap-3">
                <span className="text-navy text-lg leading-none">🏛</span>
                <p className="text-xs text-ink/70 leading-relaxed font-body">
                  Sistem kuis dikonfigurasi sesuai silabus Teorema Pythagoras SMP Kelas VIII. Skor dan latensi respon tiap tim diproyeksikan otomatis pada layar utama.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Sticky Footer Action Dock */}
      <footer className="w-full bg-white/95 backdrop-blur-md border-t border-muted-line px-6 lg:px-16 py-4 sticky bottom-0 z-30 shadow-md">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Action: Open Bank Soal */}
          <button
            onClick={() => setShowBankSoal(true)}
            className="w-full md:w-auto px-5 py-2.5 border border-muted-line text-ink/80 hover:border-navy hover:text-navy bg-white hover:bg-surface-container flex items-center justify-center gap-2.5 transition-all text-sm font-semibold rounded active:scale-[0.99] h-[44px]"
          >
            <span className="text-base">📚</span>
            <span>Lihat Bank Soal ({QUESTION_COUNT} Soal)</span>
          </button>

          {/* Middle Telemetry Info */}
          <div className="flex items-center gap-3 text-center">
            <div className="flex items-center gap-2 text-xs font-mono text-ink/80 uppercase tracking-widest bg-surface-container px-4 py-2 border border-muted-line rounded">
              <span className="text-navy font-bold">⏱</span>
              <span>Estimasi: ±{estimatedMinutes} Menit</span>
              <span className="text-muted-line">•</span>
              <span>{totalQuestions} Soal</span>
              <span className="text-muted-line">•</span>
              <span className="text-navy font-bold">{groupCount} Tim Bertanding</span>
            </div>
          </div>

          {/* Right Action: Launch Game Button */}
          <button
            onClick={handleStartGame}
            className="w-full md:w-auto px-10 py-2.5 bg-navy text-white font-heading text-xl font-bold tracking-wide rounded hover:bg-navy-hover transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.99] border border-navy cursor-pointer focus:ring-2 focus:ring-brass focus:ring-offset-2 h-[48px]"
          >
            <span>Mulai Game Kuis ✦</span>
            <span className="text-xl">▶</span>
          </button>
        </div>
      </footer>

      {/* Modal Bank Soal */}
      <BankSoalModal
        isOpen={showBankSoal}
        onClose={() => setShowBankSoal(false)}
      />
    </div>
  )
}
