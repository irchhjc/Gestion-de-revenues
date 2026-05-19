export type TransactionType = 'income' | 'expense' | 'transfer'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: string // pour transfer, vide ou '__transfer__'
  note: string
  date: string // ISO YYYY-MM-DD
  createdAt: number
  accountId: string // compte source (ou compte concerné pour income/expense)
  toAccountId?: string // pour transfer : compte destination
  fromPlannedId?: string
}

export interface Category {
  id: string
  label: string
  icon: string
  color: string
  type: 'income' | 'expense'
}

export type AccountKind = 'checking' | 'savings' | 'cash' | 'mobile_money' | 'other'

export interface Account {
  id: string
  name: string
  kind: AccountKind
  initialBalance: number
  createdAt: number
  archived?: boolean
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
  accountId: string // compte impacté lors de la validation
  dueDate?: string
  status: PlannedStatus
  paidAt?: string
  transactionId?: string
  note?: string
  createdAt: number
}

export type UserRole = 'admin' | 'user'

export interface User {
  id: string
  username: string
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
