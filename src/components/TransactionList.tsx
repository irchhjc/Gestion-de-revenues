import { Trash2 } from 'lucide-react'
import type { Transaction } from '../types'
import { formatAmount, formatDate } from '../utils/format'
import { getCategory } from '../utils/categories'
import { Icon } from './Icon'

interface Props {
  items: Transaction[]
  onDelete: (id: string) => void
}

export function TransactionList({ items, onDelete }: Props) {
  if (items.length === 0) {
    return (
      <div className="px-5 mt-8">
        <div className="glass rounded-3xl p-8 text-center">
          <div className="text-5xl mb-3">💸</div>
          <h3 className="text-white font-semibold text-lg">Aucune transaction</h3>
          <p className="text-white/50 text-sm mt-1">
            Ajoutez votre premier revenu ou dépense avec le bouton +
          </p>
        </div>
      </div>
    )
  }

  // Group by date
  const groups = new Map<string, Transaction[]>()
  for (const t of items) {
    const key = t.date
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(t)
  }

  return (
    <div className="px-5 mt-6 space-y-5 pb-32">
      {Array.from(groups.entries()).map(([date, txs]) => {
        const dayTotal = txs.reduce(
          (acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount),
          0
        )
        return (
          <div key={date} className="animate-slide-up">
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                {formatDate(date)}
              </h3>
              <span
                className={`text-xs font-bold ${
                  dayTotal >= 0 ? 'text-success-400' : 'text-danger-400'
                }`}
              >
                {formatAmount(dayTotal, { showSign: true, compact: true })}
              </span>
            </div>
            <div className="glass rounded-2xl overflow-hidden">
              {txs.map((t, idx) => {
                const cat = getCategory(t.category)
                return (
                  <div
                    key={t.id}
                    className={`group flex items-center gap-3 p-3 ${
                      idx !== txs.length - 1 ? 'border-b border-white/[0.04]' : ''
                    }`}
                  >
                    <div
                      className={`shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${
                        cat?.color || 'from-slate-400 to-slate-600'
                      } flex items-center justify-center shadow-card`}
                    >
                      <Icon name={cat?.icon || 'Circle'} size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold text-sm truncate">
                        {cat?.label || 'Autre'}
                      </div>
                      {t.note && (
                        <div className="text-white/50 text-xs truncate">{t.note}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`font-bold text-sm ${
                          t.type === 'income' ? 'text-success-400' : 'text-white'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '-'}
                        {formatAmount(t.amount, { compact: true })}
                      </div>
                      <button
                        onClick={() => onDelete(t.id)}
                        className="p-2 rounded-lg text-white/30 hover:text-danger-400 hover:bg-danger-500/10 transition opacity-0 group-hover:opacity-100 active:opacity-100"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
