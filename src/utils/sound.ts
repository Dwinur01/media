let ctx: AudioContext | null = null

/** Bel pendek saat waktu habis. Diam-diam gagal jika audio tidak tersedia. */
export function playBell(): void {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    ctx = ctx ?? new AC()
    void ctx.resume()
    const now = ctx.currentTime
    ;[880, 1320].forEach((freq, i) => {
      const osc = ctx!.createOscillator()
      const gain = ctx!.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, now + i * 0.18)
      gain.gain.exponentialRampToValueAtTime(0.25, now + i * 0.18 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.18 + 0.9)
      osc.connect(gain).connect(ctx!.destination)
      osc.start(now + i * 0.18)
      osc.stop(now + i * 0.18 + 1)
    })
  } catch {
    /* audio tidak tersedia — abaikan */
  }
}
