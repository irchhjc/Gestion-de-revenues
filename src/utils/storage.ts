import type { Planned, Transaction } from '../types'

const TX_BASE = 'mon-budget:transactions:v1'
const txKey = (userId: string) => `${TX_BASE}:${userId}`

export function loadTransactions(userId: string): Transaction[] {
  try {
    const raw = localStorage.getItem(txKey(userId))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveTransactions(userId: string, items: Transaction[]): void {
  try {
    localStorage.setItem(txKey(userId), JSON.stringify(items))
  } catch (e) {
    console.error('Erreur de sauvegarde', e)
  }
}

export function clearUserData(userId: string): void {
  localStorage.removeItem(txKey(userId))
  localStorage.removeItem(`mon-budget:planned:v1:${userId}`)
}

export function exportJSON(transactions: Transaction[], planned: Planned[]): void {
  const payload = {
    exportedAt: new Date().toISOString(),
    transactions,
    planned,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mon-budget-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
