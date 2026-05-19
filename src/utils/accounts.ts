import type { Account, AccountKind, Transaction } from '../types'

export const ACCOUNT_KINDS: Record<
  AccountKind,
  { label: string; icon: string; color: string }
> = {
  checking: { label: 'Compte courant', icon: 'Landmark', color: 'from-blue-500 to-blue-700' },
  savings: { label: 'Compte épargne', icon: 'PiggyBank', color: 'from-emerald-500 to-emerald-700' },
  cash: { label: 'Argent en main', icon: 'Banknote', color: 'from-orange-400 to-orange-600' },
  mobile_money: {
    label: 'Mobile money',
    icon: 'Smartphone',
    color: 'from-violet-500 to-violet-700',
  },
  other: { label: 'Autre', icon: 'CircleDollarSign', color: 'from-slate-500 to-slate-700' },
}

export const DEFAULT_ACCOUNTS: Array<Omit<Account, 'id' | 'createdAt'>> = [
  { name: 'Compte courant', kind: 'checking', initialBalance: 0 },
  { name: 'Compte épargne', kind: 'savings', initialBalance: 0 },
  { name: 'Argent en main', kind: 'cash', initialBalance: 0 },
]

const BASE = 'mon-budget:accounts:v1'
const keyFor = (userId: string) => `${BASE}:${userId}`

export function loadAccounts(userId: string): Account[] {
  try {
    const raw = localStorage.getItem(keyFor(userId))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveAccounts(userId: string, accounts: Account[]): void {
  localStorage.setItem(keyFor(userId), JSON.stringify(accounts))
}

export function clearAccounts(userId: string): void {
  localStorage.removeItem(keyFor(userId))
}

export function createDefaults(): Account[] {
  const now = Date.now()
  return DEFAULT_ACCOUNTS.map((a, i) => ({
    ...a,
    id: crypto.randomUUID(),
    createdAt: now + i,
  }))
}

export function computeBalances(
  accounts: Account[],
  transactions: Transaction[]
): Map<string, number> {
  const map = new Map<string, number>()
  for (const a of accounts) map.set(a.id, a.initialBalance)
  for (const t of transactions) {
    if (t.type === 'income') {
      map.set(t.accountId, (map.get(t.accountId) || 0) + t.amount)
    } else if (t.type === 'expense') {
      map.set(t.accountId, (map.get(t.accountId) || 0) - t.amount)
    } else if (t.type === 'transfer') {
      map.set(t.accountId, (map.get(t.accountId) || 0) - t.amount)
      if (t.toAccountId) {
        map.set(t.toAccountId, (map.get(t.toAccountId) || 0) + t.amount)
      }
    }
  }
  return map
}

export function totalNetBalance(accounts: Account[], transactions: Transaction[]): number {
  let total = 0
  for (const a of accounts) total += a.initialBalance
  for (const t of transactions) {
    if (t.type === 'income') total += t.amount
    else if (t.type === 'expense') total -= t.amount
    // transfers : net zero
  }
  return total
}
