export function money(n) {
  const num = Number(n ?? 0)
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'NPR' }).format(num)
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

export function avgRating(reviews = []) {
  if (!reviews.length) return 0
  const s = reviews.reduce((a, r) => a + Number(r.rating || 0), 0)
  return Math.round((s / reviews.length) * 10) / 10
}
