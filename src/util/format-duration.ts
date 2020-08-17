export function formatChrono(d: number) {
  let seconds = d / 1000

  const h = Math.floor(seconds / 3600)
  seconds %= 3600
  const m = Math.floor(seconds / 60)
  seconds = Math.floor(seconds % 60)

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`
}
