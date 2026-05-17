export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: string
  note: string
  date: string // ISO YYYY-MM-DD
  createdAt: number
  fromPlannedId?: string
}

export interface Category {
  id: string
  label: string
  icon: string
  color: string
  type: TransactionType
}

export type PlannedKind = 'debt' | 'scheduled'
export type PlannedDirection = 'out' | 'in'
export type PlannedStatus = 'pending' | 'paid' | 'cancelled'

export interface Planned {
  id: string
  kind: PlannedKind
  direction: PlannedDirection
  title: string
  amount: number
  txCategory: string
  dueDate?: string // ISO YYYY-MM-DD — optionnel
  status: PlannedStatus
  paidAt?: string
  transactionId?: string
  note?: string
  createdAt: number
}

export type UserRole = 'admin' | 'user'

export interface User {
  id: string
  username: string // identifiant unique en minuscules
  fullName: string
  email: string
  location: string
  passwordHash: string
  salt: string
  role: UserRole
  createdAt: number
}

export interface Session {
  userId: string
  startedAt: number
}
