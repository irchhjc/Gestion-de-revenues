import type { Category } from '../types'

export const CATEGORIES: Category[] = [
  // Revenus
  { id: 'salary', label: 'Salaire', icon: 'Briefcase', color: 'from-emerald-400 to-emerald-600', type: 'income' },
  { id: 'business', label: 'Business', icon: 'Store', color: 'from-teal-400 to-teal-600', type: 'income' },
  { id: 'freelance', label: 'Freelance', icon: 'Laptop', color: 'from-cyan-400 to-cyan-600', type: 'income' },
  { id: 'gift', label: 'Cadeau', icon: 'Gift', color: 'from-pink-400 to-pink-600', type: 'income' },
  { id: 'investment', label: 'Investissement', icon: 'TrendingUp', color: 'from-violet-400 to-violet-600', type: 'income' },
  { id: 'other-income', label: 'Autre', icon: 'PlusCircle', color: 'from-blue-400 to-blue-600', type: 'income' },

  // Dépenses
  { id: 'food', label: 'Alimentation', icon: 'UtensilsCrossed', color: 'from-orange-400 to-orange-600', type: 'expense' },
  { id: 'transport', label: 'Transport', icon: 'Car', color: 'from-amber-400 to-amber-600', type: 'expense' },
  { id: 'housing', label: 'Logement', icon: 'Home', color: 'from-rose-400 to-rose-600', type: 'expense' },
  { id: 'health', label: 'Santé', icon: 'Heart', color: 'from-red-400 to-red-600', type: 'expense' },
  { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag', color: 'from-fuchsia-400 to-fuchsia-600', type: 'expense' },
  { id: 'leisure', label: 'Loisirs', icon: 'Gamepad2', color: 'from-purple-400 to-purple-600', type: 'expense' },
  { id: 'bills', label: 'Factures', icon: 'Receipt', color: 'from-yellow-400 to-yellow-600', type: 'expense' },
  { id: 'education', label: 'Éducation', icon: 'GraduationCap', color: 'from-indigo-400 to-indigo-600', type: 'expense' },
  { id: 'family', label: 'Famille', icon: 'Users', color: 'from-pink-400 to-pink-600', type: 'expense' },
  { id: 'other-expense', label: 'Autre', icon: 'MoreHorizontal', color: 'from-slate-400 to-slate-600', type: 'expense' },
]

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find(c => c.id === id)
}

export function categoriesByType(type: 'income' | 'expense'): Category[] {
  return CATEGORIES.filter(c => c.type === type)
}
