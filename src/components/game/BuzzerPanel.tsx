import type { Group } from '../../types'
import { keyForIndex, teamNumber } from '../../utils'

interface BuzzerPanelProps {
  groups: Group[]
  /** Kelompok yang sudah mencoba menjawab soal ini (gugur) */
  lockedIds: string[]
  /** Kelompok yang sedang memegang giliran */
  buzzedId: string | null
  answerText: string
  onAnswerTextChange: (value: string) => void
  onBuzz: (groupId: string) => void
  onCancel: () => void
  /** Periksa otomatis teks yang diketik */
  onCheckTyped: () => void
  /** Guru menilai jawaban lisan */
  onJudge: (correct: boolean) => void
  /** Tutup soal tanpa pemenang */
  onEndQuestion: () => void
}

export function BuzzerPanel({
  groups,
  lockedIds,
  buzzedId,
  answerText,
  onAnswerTextChange,
  onBuzz,
  onCancel,
  onCheckTyped,
  onJudge,
  onEndQuestion,
}: BuzzerPanelProps) {
  const buzzed = groups.find((g) => g.id === buzzedId) ?? null

  return (
    <div className="bg-white border border-muted-line p-6 sm:p-8 shadow-sm rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-[3px] h-5 bg-navy" />
        <span className="text-lg font-heading text-navy font-semibold">Arena Rebutan</span>
        <div className="flex-1 h-px bg-muted-line" />
      </div>

      {buzzed ? (
        <>
          {/* Kilatan warna tim saat buzzer ditekan */}
          <div
            key={buzzed.id}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-30 animate-flash"
            style={{ backgroundColor: buzzed.color }}
          />

          <div
            className="rounded-lg overflow-hidden border-2 animate-pop"
            style={{ borderColor: buzzed.color }}
            role="group"
            aria-label={`Giliran ${buzzed.name}`}
          >
            {/* Pita nama tim: besar & berwarna agar terbaca dari belakang kelas */}
            <div
              className="flex items-center gap-4 px-5 sm:px-6 py-5 text-white"
              style={{ backgroundColor: buzzed.color }}
            >
              <span className="w-12 h-12 rounded-full bg-white/25 flex items-center justify-center font-heading text-3xl font-bold shrink-0" aria-hidden="true">
                {teamNumber(buzzed.id) ?? '•'}
              </span>
              <h3 className="font-heading text-3xl sm:text-4xl font-bold leading-tight">{buzzed.name} menjawab!</h3>
            </div>

            <div className="p-5 sm:p-6">
              <label className="block text-sm text-ink/70 mb-2" htmlFor="jawaban-rebutan">
                Ketik jawaban (opsional jika dijawab lisan)
              </label>
              <input
                id="jawaban-rebutan"
                type="text"
                autoFocus
                autoComplete="off"
                value={answerText}
                onChange={(e) => onAnswerTextChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && answerText.trim()) onCheckTyped()
                }}
                placeholder="Jawaban kelompok…"
                className="w-full px-4 py-3 text-lg font-body border border-muted-line bg-surface-container text-ink rounded outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
              />

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onCheckTyped}
                  disabled={!answerText.trim()}
                  className="px-5 h-[52px] bg-navy hover:bg-navy-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-body font-semibold text-base rounded focus:ring-2 focus:ring-brass focus:ring-offset-2"
                >
                  Periksa Ketikan
                </button>
                <button
                  type="button"
                  onClick={() => onJudge(true)}
                  className="px-5 h-[52px] border border-emerald-500 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-body font-semibold text-base rounded"
                >
                  ✓ Tandai Benar
                </button>
                <button
                  type="button"
                  onClick={() => onJudge(false)}
                  className="px-5 h-[52px] border border-red-400 bg-red-50 text-red-700 hover:bg-red-100 font-body font-semibold text-base rounded"
                >
                  ✗ Tandai Salah
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="ml-auto px-2 h-11 text-sm text-ink/70 hover:text-navy underline underline-offset-2"
                >
                  Batal (salah pencet)
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="text-base text-ink/70 mb-4">
            Tekan tombol kelompok atau angka di keyboard. Yang tercepat mendapat giliran menjawab;
            jika salah, kelompok itu gugur dan yang lain boleh merebut.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {groups.map((g, i) => {
              const locked = lockedIds.includes(g.id)
              const key = keyForIndex(i)
              return (
                <button
                  key={g.id}
                  type="button"
                  disabled={locked}
                  onClick={() => onBuzz(g.id)}
                  aria-label={`Buzzer ${g.name}${locked ? ' (gugur)' : ''}`}
                  style={locked ? undefined : { borderColor: g.color, backgroundColor: `${g.color}14` }}
                  className={[
                    'relative flex items-center gap-3 px-4 min-h-[88px] rounded-lg border-2 text-left transition-all duration-150',
                    locked
                      ? 'bg-red-50 border-red-200 text-ink/70 cursor-not-allowed'
                      : 'hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97] focus:ring-2 focus:ring-brass focus:ring-offset-2',
                  ].join(' ')}
                >
                  <span
                    className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-white font-heading text-2xl font-bold"
                    style={{ backgroundColor: locked ? '#94A3B8' : g.color }}
                    aria-hidden="true"
                  >
                    {teamNumber(g.id) ?? i + 1}
                  </span>
                  <span className="font-heading text-xl font-semibold leading-tight flex-1 min-w-0 break-words">{g.name}</span>
                  {locked ? (
                    <span className="text-sm font-semibold text-red-700">Gugur</span>
                  ) : (
                    key && (
                      <kbd className="text-sm font-mono px-2 py-0.5 rounded border border-muted-line bg-white text-ink/70 shrink-0">
                        {key}
                      </kbd>
                    )
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex justify-end pt-5 mt-4 border-t border-muted-line">
            <button
              type="button"
              onClick={onEndQuestion}
              className="px-6 h-[52px] border border-navy/40 text-navy hover:bg-navy/5 font-body font-semibold text-base rounded"
            >
              Tutup Soal &amp; Lihat Pembahasan
            </button>
          </div>
        </>
      )}
    </div>
  )
}
