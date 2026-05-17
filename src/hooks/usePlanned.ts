import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Planned } from '../types'
import { loadPlanned, savePlanned } from '../utils/plannedStorage'

export interface PlannedTotals {
  toPay: number
  toReceive: number
  overdueCount: number
  upcomingCount: number
}

function isOverdue(p: Planned, today: string): boolean {
  return p.status === 'pending' && !!p.dueDate && p.dueDate < today
}

function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function usePlanned(userId: string) {
  const [items, setItems] = useState<Planned[]>(() => loadPlanned(userId))

  useEffect(() => {
    savePlanned(userId, items)
  }, [userId, items])

  const add = useCallback((p: Omit<Planned, 'id' | 'createdAt' | 'status'>) => {
    const planned: Planned = {
      ...p,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: Date.now(),
    }
    setItems(prev => [planned, ...prev])
    return planned
  }, [])

  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(p => p.id !== id))
  }, [])

  const update = useCallback((id: string, patch: Partial<Planned>) => {
    setItems(prev => prev.map(p => (p.id === id ? { ...p, ...patch } : p)))
  }, [])

  const markPaid = useCallback((id: string, transactionId: string) => {
    setItems(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              status: 'paid' as const,
              paidAt: todayISO(),
              transactionId,
            }
          : p
      )
    )
  }, [])

  const cancel = useCallback((id: string) => {
    setItems(prev => prev.map(p => (p.id === id ? { ...p, status: 'cancelled' as const } : p)))
  }, [])

  const restore = useCallback((id: string) => {
    setItems(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status: 'pending' as const, paidAt: undefined, transactionId: undefined }
          : p
      )
    )
  }, [])

  const clearAll = useCallback(() => setItems([]), [])

  const totals: PlannedTotals = useMemo(() => {
    const today = todayISO()
    let toPay = 0
    let toReceive = 0
    let overdueCount = 0
    let upcomingCount = 0
    for (const p of items) {
      if (p.status !== 'pending') continue
      if (p.direction === 'out') toPay += p.amount
      else toReceive += p.amount
      if (isOverdue(p, today)) overdueCount++
      else upcomingCount++
    }
    return { toPay, toReceive, overdueCount, upcomingCount }
  }, [items])

  const grouped = useMemo(() => {
    const today = todayISO()
    const overdue: Planned[] = []
    const upcoming: Planned[] = []
    const undated: Planned[] = []
    const done: Planned[] = []
    for (const p of items) {
      if (p.status === 'pending') {
        if (!p.dueDate) undated.push(p)
        else if (isOverdue(p, today)) overdue.push(p)
        else upcoming.push(p)
      } else {
        done.push(p)
      }
    }
    overdue.sort((a, b) => ((a.dueDate || '') < (b.dueDate || '') ? -1 : 1))
    upcoming.sort((a, b) => ((a.dueDate || '') < (b.dueDate || '') ? -1 : 1))
    undated.sort((a, b) => b.createdAt - a.createdAt)
    done.sort((a, b) => ((a.paidAt || '') < (b.paidAt || '') ? 1 : -1))
    return { overdue, upcoming, undated, done }
  }, [items])

  return { items, add, remove, update, markPaid, cancel, restore, clearAll, totals, grouped }
}
