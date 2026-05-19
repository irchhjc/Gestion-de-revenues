import { useState } from 'react'
import { Pencil, Plus, Wallet, X } from 'lucide-react'
import type { Account, AccountKind } from '../types'
import { ACCOUNT_KINDS } from '../utils/accounts'
import { formatAmount } from '../utils/format'
import { Icon } from './Icon'
import { AccountForm } from './AccountForm'

interface Props {
  open: boolean
  onClose: () => void
  accounts: Account[]
  balances: Map<string, number>
  totalBalance: number
  onAdd: (a: { name: string; kind: AccountKind; initialBalance: number }) => void
  onUpdate: (id: string, a: { name: string; kind: AccountKind; initialBalance: number }) => void
  onDelete: (id: string) => void
}

export function AccountsPanel({
  open,
  onClose,
  accounts,
  balances,
  totalBalance,
  onAdd,
  onUpdate,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState<Account | null>(null)
  const [adding, setAdding] = useState(false)

  if (!open && !editing && !adding) return null

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in"
          onClick={onClose}
        >
          <div
            className="w-full sm:max-w-md bg-ink-800 rounded-t-3xl sm:rounded-3xl border-t sm:border border-white/10 max-h-[92vh] overflow-y-auto animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-ink-800/95 backdrop-blur-xl z-10 px-5 pt-4 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet size={20} className="text-accent-400" />
                  <h2 className="text-white font-bold text-lg">Mes comptes</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
                >
                  <X size={18} className="text-white/70" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-white/50 text-xs">
                  {accounts.length} compte{accounts.length > 1 ? 's' : ''}
                </p>
                <p className="text-white font-bold text-sm">
                  Total : {formatAmount(totalBalance)}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-2">
              {accounts.map(a => {
                const meta = ACCOUNT_KINDS[a.kind]
                const balance = balances.get(a.id) || 0
                return (
                  <button
                    key={a.id}
                    onClick={() => setEditing(a)}
                    className="w-full glass rounded-2xl p-3 flex items-center gap-3 active:scale-[0.98] transition text-left"
                  >
                    <div
                      className={`shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center shadow-card`}
                    >
                      <Icon name={meta.icon} size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold text-sm truncate">{a.name}</div>
                      <div className="text-white/40 text-[11px]">{meta.label}</div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-bold text-sm ${
                          balance >= 0 ? 'text-white' : 'text-danger-400'
                        }`}
                      >
                        {formatAmount(balance, { compact: true })}
                      </div>
                    </div>
                    <Pencil size={14} className="text-white/30 shrink-0 ml-1" />
                  </button>
                )
              })}

              <button
                onClick={() => setAdding(true)}
                className="w-full mt-2 flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-dashed border-white/15 text-white/60 text-sm font-semibold active:scale-[0.98] transition"
              >
                <Plus size={16} />
                Ajouter un compte
              </button>
            </div>
          </div>
        </div>
      )}

      <AccountForm
        open={adding}
        onClose={() => setAdding(false)}
        onSubmit={a => {
          onAdd(a)
          setAdding(false)
        }}
      />

      <AccountForm
        open={!!editing}
        initial={editing || undefined}
        onClose={() => setEditing(null)}
        onSubmit={a => {
          if (editing) onUpdate(editing.id, a)
          setEditing(null)
        }}
        onDelete={
          editing && accounts.length > 1
            ? () => {
                onDelete(editing.id)
                setEditing(null)
              }
            : undefined
        }
      />
    </>
  )
}
