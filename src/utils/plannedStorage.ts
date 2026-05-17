import type { Planned } from '../types'

const KEY = 'mon-budget:planned:v1'

export function loadPlanned(): Planned[] {
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

export function savePlanned(items: Planned[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch (e) {
    console.error('Erreur de sauvegarde planned', e)
  }
}
