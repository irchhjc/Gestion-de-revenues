import { AlertTriangle, ArrowDownRight, ArrowUpRight, Eye, EyeOff, TrendingDown, Wallet } from 'lucide-react'
import { useState } from 'react'
import { formatAmount } from '../utils/format'

interface Props {
  balance: number
  income: number
  expense: number
  monthIncome: number
  monthExpense: number
  toPay: number
  toReceive: number
  overdueCount: number
  onOpenPlanned: () => void
}

export function Dashboard({
  balance,
  income,
  expense,
  monthIncome,
  monthExpense,
  toPay,
  toReceive,
  overdueCount,
  onOpenPlanned,
}: Props) {
  const [hidden, setHidden] = useState(false)
  const projected = balance + toReceive - toPay
  const hasForecast = toPay > 0 || toReceive > 0

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

          {hasForecast && !hidden && (
            <div className="mt-2 flex items-center gap-1.5 text-white/80 text-xs">
              <TrendingDown size={12} />
              <span>Après échéances :</span>
              <span className="font-bold text-white">{formatAmount(projected, { compact: true })}</span>
            </div>
          )}

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

      {overdueCount > 0 && (
        <button
          onClick={onOpenPlanned}
          className="mt-4 w-full flex items-center gap-3 bg-danger-500/10 border border-danger-500/30 rounded-2xl p-3 active:scale-[0.98] transition"
        >
          <AlertTriangle size={18} className="text-danger-400 shrink-0" />
          <p className="flex-1 text-left text-danger-400 text-sm font-medium">
            {overdueCount} échéance{overdueCount > 1 ? 's' : ''} en retard
          </p>
          <span className="text-danger-400 text-xs font-semibold">Voir →</span>
        </button>
      )}

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

      {hasForecast && (
        <button
          onClick={onOpenPlanned}
          className="mt-3 w-full grid grid-cols-2 gap-3 text-left"
        >
          <div className="glass rounded-2xl p-4 active:scale-[0.98] transition">
            <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <span>À payer</span>
            </div>
            <div className="mt-2 text-orange-400 font-bold text-lg">
              {hidden ? '•••' : formatAmount(toPay, { compact: true })}
            </div>
          </div>
          <div className="glass rounded-2xl p-4 active:scale-[0.98] transition">
            <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>À recevoir</span>
            </div>
            <div className="mt-2 text-cyan-400 font-bold text-lg">
              {hidden ? '•••' : formatAmount(toReceive, { compact: true })}
            </div>
          </div>
        </button>
      )}
    </div>
  )
}
