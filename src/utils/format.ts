export const CURRENCY = 'FCFA'

export function formatAmount(value: number, opts?: { compact?: boolean; showSign?: boolean }): string {
  const sign = opts?.showSign ? (value > 0 ? '+' : value < 0 ? '-' : '') : ''
  const abs = Math.abs(value)
  if (opts?.compact && abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M ${CURRENCY}`
  }
  if (opts?.compact && abs >= 10_000) {
    return `${sign}${(abs / 1_000).toFixed(0)}k ${CURRENCY}`
  }
  const formatted = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(abs)
  return `${sign}${formatted} ${CURRENCY}`
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  if (isSameDay(d, today)) return "Aujourd'hui"
  if (isSameDay(d, yesterday)) return 'Hier'

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: d.getFullYear() === today.getFullYear() ? undefined : 'numeric',
  }).format(d)
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
  }).format(d)
}

export function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function monthLabel(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date)
}
