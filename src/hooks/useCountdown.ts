import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Hitung mundur berbasis jam sistem (Date.now), bukan setTimeout bertingkat,
 * sehingga tidak melenceng saat tab di-throttle atau perangkat lambat.
 */
export function useCountdown(initialSeconds: number, onExpire?: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds)
  const [running, setRunning] = useState(false)

  const remainingMs = useRef(initialSeconds * 1000)
  const endsAt = useRef<number | null>(null)
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onExpireRef.current = onExpire
  })

  useEffect(() => {
    if (!running) return
    endsAt.current = Date.now() + remainingMs.current
    const id = window.setInterval(() => {
      if (endsAt.current === null) return
      const left = Math.max(0, endsAt.current - Date.now())
      remainingMs.current = left
      setTimeLeft(Math.ceil(left / 1000))
      if (left <= 0) {
        window.clearInterval(id)
        endsAt.current = null
        setRunning(false)
        onExpireRef.current?.()
      }
    }, 200)
    return () => window.clearInterval(id)
  }, [running])

  const getRemainingMs = useCallback(
    () => (endsAt.current !== null ? Math.max(0, endsAt.current - Date.now()) : remainingMs.current),
    [],
  )

  const start = useCallback(() => {
    if (remainingMs.current > 0) setRunning(true)
  }, [])

  const pause = useCallback(() => {
    if (endsAt.current !== null) {
      remainingMs.current = Math.max(0, endsAt.current - Date.now())
    }
    endsAt.current = null
    setRunning(false)
  }, [])

  const toggle = useCallback(() => {
    if (running) pause()
    else start()
  }, [running, pause, start])

  /** Setel ulang ke `seconds`; tetap berjalan jika sedang berjalan. */
  const reset = useCallback((seconds: number) => {
    remainingMs.current = seconds * 1000
    if (endsAt.current !== null) endsAt.current = Date.now() + seconds * 1000
    setTimeLeft(seconds)
  }, [])

  return { timeLeft, running, start, pause, toggle, reset, getRemainingMs }
}
