import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Transaction } from '../types'
import { loadTransactions, saveTransactions } from '../utils/storage'

export function useTransactions() {
  const [items, setItems] = useState<Transaction[]>(() => loadTransactions())

  useEffect(() => {
    saveTransactions(items)
  }, [items])

  const add = useCallback((t: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
    const tx: Transaction = {
      ...t,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }
    setItems(prev => [tx, ...prev])
    return tx
  }, [])

  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(t => t.id !== id))
  }, [])

  const update = useCallback((id: string, patch: Partial<Transaction>) => {
    setItems(prev => prev.map(t => (t.id === id ? { ...t, ...patch } : t)))
  }, [])

  const clearAll = useCallback(() => setItems([]), [])

  const totals = useMemo(() => {
    let income = 0
    let expense = 0
    for (const t of items) {
      if (t.type === 'income') income += t.amount
      else expense += t.amount
    }
    return { income, expense, balance: income - expense }
  }, [items])

  const monthTotals = useMemo(() => {
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()
    let income = 0
    let expense = 0
    for (const t of items) {
      const d = new Date(t.date)
      if (d.getMonth() === month && d.getFullYear() === year) {
        if (t.type === 'income') income += t.amount
        else expense += t.amount
      }
    }
    return { income, expense, balance: income - expense }
  }, [items])

  const sorted = useMemo(
    () => [...items].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt - a.createdAt)),
    [items]
  )

  return { items: sorted, add, remove, update, clearAll, totals, monthTotals }
}
