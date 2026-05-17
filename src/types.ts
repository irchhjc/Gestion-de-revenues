export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: string
  note: string
  date: string // ISO
  createdAt: number
}

export interface Category {
  id: string
  label: string
  icon: string // lucide icon name
  color: string // tailwind gradient classes
  type: TransactionType
}
