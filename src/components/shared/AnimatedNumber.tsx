import { useEffect, useRef, useState } from 'react'

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

interface AnimatedNumberProps {
  value: number
  /** Lama animasi hitung naik (ms) */
  durationMs?: number
}

/** Angka yang menghitung naik/turun ke nilai baru. Nilai pertama langsung tampil tanpa animasi. */
export function AnimatedNumber({ value, durationMs = 700 }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value)
  const shown = useRef(value)

  useEffect(() => {
    const from = shown.current
    if (from === value) return
    if (prefersReducedMotion() || typeof requestAnimationFrame === 'undefined') {
      shown.current = value
      setDisplay(value)
      return
    }
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - p, 3)
      const v = Math.round(from + (value - from) * eased)
      shown.current = v
      setDisplay(v)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, durationMs])

  return <>{display}</>
}
