import { useCallback, useEffect, useState } from 'react'
import type { Account } from '../types'
import { createDefaults, loadAccounts, saveAccounts } from '../utils/accounts'

export function useAccounts(userId: string) {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const existing = loadAccounts(userId)
    if (existing.length > 0) return existing
    const seeded = createDefaults()
    saveAccounts(userId, seeded)
    return seeded
  })

  useEffect(() => {
    saveAccounts(userId, accounts)
  }, [userId, accounts])

  const add = useCallback((a: Omit<Account, 'id' | 'createdAt'>): Account => {
    const acc: Account = { ...a, id: crypto.randomUUID(), createdAt: Date.now() }
    setAccounts(prev => [...prev, acc])
    return acc
  }, [])

  const update = useCallback((id: string, patch: Partial<Account>) => {
    setAccounts(prev => prev.map(a => (a.id === id ? { ...a, ...patch } : a)))
  }, [])

  const remove = useCallback((id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id))
  }, [])

  const archive = useCallback((id: string, archived = true) => {
    setAccounts(prev => prev.map(a => (a.id === id ? { ...a, archived } : a)))
  }, [])

  return { accounts, add, update, remove, archive }
}
