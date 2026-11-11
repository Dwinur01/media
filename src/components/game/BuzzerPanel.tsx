import type { Group } from '../../types'
import { keyForIndex } from '../../utils'

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
      <div className="flex items-center gap-2 mb-6">
        <div className="w-px h-4 bg-navy" />
        <span className="text-[10px] font-body text-navy/60 uppercase tracking-[0.25em]">Arena Rebutan</span>
        <div className="flex-1 h-px bg-muted-line" />
      </div>

      {buzzed ? (
        <div
          className="border-2 rounded-lg p-5 sm:p-6"
          style={{ borderColor: buzzed.color }}
          role="group"
          aria-label={`Giliran ${buzzed.name}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: buzzed.color }} />
            <h3 className="font-heading text-2xl text-ink font-semibold">{buzzed.name} menjawab!</h3>
          </div>

          <label className="block text-xs text-ink/60 mb-1.5" htmlFor="jawaban-rebutan">
            Ketik jawaban (opsional jika dijawab lisan)
          </label>
          <input
            id="jawaban-rebutan"
            type="text"
            autoFocus
            value={answerText}
            onChange={(e) => onAnswerTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && answerText.trim()) onCheckTyped()
            }}
            placeholder="Jawaban kelompok…"
            className="w-full px-3.5 py-2.5 text-sm font-body border border-muted-line bg-surface-container text-ink rounded outline-none focus:border-navy focus:ring-1 focus:ring-navy/20"
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onCheckTyped}
              disabled={!answerText.trim()}
              className="px-5 py-2.5 h-[44px] bg-navy hover:bg-navy-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-body font-semibold text-sm uppercase tracking-wider rounded focus:ring-2 focus:ring-brass focus:ring-offset-2"
            >
              Periksa Ketikan
            </button>
            <button
              type="button"
              onClick={() => onJudge(true)}
              className="px-4 py-2.5 h-[44px] border border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-body font-semibold text-sm rounded"
            >
              ✓ Tandai Benar
            </button>
            <button
              type="button"
              onClick={() => onJudge(false)}
              className="px-4 py-2.5 h-[44px] border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 font-body font-semibold text-sm rounded"
            >
              ✗ Tandai Salah
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="ml-auto text-xs text-ink/60 hover:text-navy underline underline-offset-2"
            >
              Batal (salah pencet)
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-ink/60 mb-4">
            Tekan tombol kelompok atau angka di keyboard. Yang tercepat mendapat giliran menjawab;
            jika salah, kelompok itu gugur dan yang lain boleh merebut.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  className={[
                    'relative flex items-center gap-3 px-4 py-4 rounded-lg border text-left transition-all duration-150',
                    locked
                      ? 'bg-red-50 border-red-200 text-ink/40 cursor-not-allowed'
                      : 'bg-white border-muted-line hover:border-navy hover:shadow-md active:scale-[0.98] focus:ring-2 focus:ring-brass focus:ring-offset-2',
                  ].join(' ')}
                >
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                  <span className="font-heading text-lg font-medium truncate flex-1">{g.name}</span>
                  {locked ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-red-600">Gugur</span>
                  ) : (
                    key && (
                      <kbd className="text-xs font-mono px-2 py-0.5 rounded border border-muted-line bg-surface-container text-ink/60">
                        {key}
                      </kbd>
                    )
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex justify-end pt-5 mt-2 border-t border-muted-line">
            <button
              type="button"
              onClick={onEndQuestion}
              className="px-5 py-2.5 h-[44px] border border-navy/40 text-navy hover:bg-navy/5 font-body font-semibold text-sm uppercase tracking-wider rounded"
            >
              Tutup Soal &amp; Lihat Pembahasan
            </button>
          </div>
        </>
      )}
    </div>
  )
}
