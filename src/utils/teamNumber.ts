/** Nomor tim (1, 2, …) dari id "group-N". Dipakai sebagai penanda selain warna. */
export function teamNumber(id: string): number | null {
  const n = Number(id.replace(/\D/g, ''))
  return Number.isFinite(n) && n > 0 ? n : null
}
