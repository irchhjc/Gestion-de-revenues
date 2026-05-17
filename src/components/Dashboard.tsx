import { ArrowDownRight, ArrowUpRight, Eye, EyeOff, Wallet } from 'lucide-react'
import { useState } from 'react'
import { formatAmount } from '../utils/format'

interface Props {
  balance: number
  income: number
  expense: number
  monthIncome: number
  monthExpense: number
}

export function Dashboard({ balance, income, expense, monthIncome, monthExpense }: Props) {
  const [hidden, setHidden] = useState(false)

  return (
    <div className="px-5 pt-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-accent-600 via-accent-500 to-accent-400 shadow-glow">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Wallet size={16} />
              <span className="font-medium">Solde restant</span>
            </div>
            <button
              onClick={() => setHidden(h => !h)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
              aria-label={hidden ? 'Afficher' : 'Masquer'}
            >
              {hidden ? <EyeOff size={16} className="text-white" /> : <Eye size={16} className="text-white" />}
            </button>
          </div>

          <div className="mt-3 text-4xl font-extrabold tracking-tight text-white">
            {hidden ? '••••••' : formatAmount(balance)}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-3">
              <div className="flex items-center gap-1.5 text-white/70 text-xs">
                <ArrowUpRight size={14} />
                <span>Revenus</span>
              </div>
              <div className="mt-1 text-white font-bold text-base">
                {hidden ? '•••' : formatAmount(income, { compact: true })}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-3">
              <div className="flex items-center gap-1.5 text-white/70 text-xs">
                <ArrowDownRight size={14} />
                <span>Dépenses</span>
              </div>
              <div className="mt-1 text-white font-bold text-base">
                {hidden ? '•••' : formatAmount(expense, { compact: true })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-success-400" />
            <span>Revenus du mois</span>
          </div>
          <div className="mt-2 text-success-400 font-bold text-lg">
            {hidden ? '•••' : formatAmount(monthIncome, { compact: true })}
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-danger-400" />
            <span>Dépenses du mois</span>
          </div>
          <div className="mt-2 text-danger-400 font-bold text-lg">
            {hidden ? '•••' : formatAmount(monthExpense, { compact: true })}
          </div>
        </div>
      </div>
    </div>
  )
}
