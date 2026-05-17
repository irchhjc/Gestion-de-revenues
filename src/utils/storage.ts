import type { Transaction } from '../types'

const KEY = 'mon-budget:transactions:v1'

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export function saveTransactions(items: Transaction[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch (e) {
    console.error('Erreur de sauvegarde', e)
  }
}

export function exportJSON(items: Transaction[]): void {
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mon-budget-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
