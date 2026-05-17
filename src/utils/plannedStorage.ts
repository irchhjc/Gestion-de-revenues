import type { Planned } from '../types'

const BASE = 'mon-budget:planned:v1'
const keyFor = (userId: string) => `${BASE}:${userId}`

export function loadPlanned(userId: string): Planned[] {
  try {
    const raw = localStorage.getItem(keyFor(userId))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function savePlanned(userId: string, items: Planned[]): void {
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(items))
  } catch (e) {
    console.error('Erreur de sauvegarde planned', e)
  }
}
