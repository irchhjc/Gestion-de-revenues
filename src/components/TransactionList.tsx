import { ArrowRight, Trash2 } from 'lucide-react'
import type { Account, Transaction } from '../types'
import { formatAmount, formatDate } from '../utils/format'
import { getCategory } from '../utils/categories'
import { ACCOUNT_KINDS } from '../utils/accounts'
import { Icon } from './Icon'

interface Props {
  items: Transaction[]
  accounts: Account[]
  onDelete: (id: string) => void
}

export function TransactionList({ items, accounts, onDelete }: Props) {
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

  const accountById = new Map(accounts.map(a => [a.id, a]))

  const groups = new Map<string, Transaction[]>()
  for (const t of items) {
    const key = t.date
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(t)
  }

  return (
    <div className="px-5 mt-6 space-y-5 pb-32">
      {Array.from(groups.entries()).map(([date, txs]) => {
        const dayTotal = txs.reduce((acc, t) => {
          if (t.type === 'income') return acc + t.amount
          if (t.type === 'expense') return acc - t.amount
          return acc
        }, 0)
        return (
          <div key={date} className="animate-slide-up">
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                {formatDate(date)}
              </h3>
              <span
                className={`text-xs font-bold ${
                  dayTotal === 0
                    ? 'text-white/30'
                    : dayTotal >= 0
                    ? 'text-success-400'
                    : 'text-danger-400'
                }`}
              >
                {dayTotal === 0
                  ? '—'
                  : formatAmount(dayTotal, { showSign: true, compact: true })}
              </span>
            </div>
            <div className="glass rounded-2xl overflow-hidden">
              {txs.map((t, idx) => {
                const last = idx === txs.length - 1
                if (t.type === 'transfer') {
                  return (
                    <TransferRow
                      key={t.id}
                      t={t}
                      from={accountById.get(t.accountId)}
                      to={t.toAccountId ? accountById.get(t.toAccountId) : undefined}
                      last={last}
                      onDelete={() => onDelete(t.id)}
                    />
                  )
                }
                return (
                  <TxRow
                    key={t.id}
                    t={t}
                    account={accountById.get(t.accountId)}
                    last={last}
                    onDelete={() => onDelete(t.id)}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TxRow({
  t,
  account,
  last,
  onDelete,
}: {
  t: Transaction
  account?: Account
  last: boolean
  onDelete: () => void
}) {
  const cat = getCategory(t.category)
  return (
    <div
      className={`group flex items-center gap-3 p-3 ${
        !last ? 'border-b border-white/[0.04]' : ''
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
        <div className="text-white font-semibold text-sm truncate">{cat?.label || 'Autre'}</div>
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          {account && <span className="truncate">{account.name}</span>}
          {account && t.note && <span className="text-white/20">•</span>}
          {t.note && <span className="truncate">{t.note}</span>}
        </div>
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
          onClick={onDelete}
          className="p-2 rounded-lg text-white/30 hover:text-danger-400 hover:bg-danger-500/10 transition opacity-0 group-hover:opacity-100 active:opacity-100"
          aria-label="Supprimer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

function TransferRow({
  t,
  from,
  to,
  last,
  onDelete,
}: {
  t: Transaction
  from?: Account
  to?: Account
  last: boolean
  onDelete: () => void
}) {
  const fromMeta = from ? ACCOUNT_KINDS[from.kind] : null
  const toMeta = to ? ACCOUNT_KINDS[to.kind] : null
  return (
    <div
      className={`group flex items-center gap-3 p-3 ${
        !last ? 'border-b border-white/[0.04]' : ''
      }`}
    >
      <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-card">
        <ArrowRight size={20} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white font-semibold text-sm truncate">Transfert</div>
        <div className="flex items-center gap-1 text-xs text-white/50">
          {fromMeta && (
            <span className="inline-flex items-center gap-1">
              <Icon name={fromMeta.icon} size={10} className="text-white/60" />
              <span className="truncate">{from?.name}</span>
            </span>
          )}
          <ArrowRight size={10} className="text-white/30" />
          {toMeta && (
            <span className="inline-flex items-center gap-1">
              <Icon name={toMeta.icon} size={10} className="text-white/60" />
              <span className="truncate">{to?.name}</span>
            </span>
          )}
        </div>
        {t.note && <div className="text-white/40 text-[11px] truncate mt-0.5">{t.note}</div>}
      </div>
      <div className="flex items-center gap-2">
        <div className="text-cyan-400 font-bold text-sm">
          {formatAmount(t.amount, { compact: true })}
        </div>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg text-white/30 hover:text-danger-400 hover:bg-danger-500/10 transition opacity-0 group-hover:opacity-100 active:opacity-100"
          aria-label="Supprimer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
