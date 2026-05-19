import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import type { Account, AccountKind } from '../types'
import { ACCOUNT_KINDS } from '../utils/accounts'
import { Icon } from './Icon'

interface Props {
  open: boolean
  onClose: () => void
  initial?: Account
  onSubmit: (a: { name: string; kind: AccountKind; initialBalance: number }) => void
  onDelete?: () => void
}

export function AccountForm({ open, onClose, initial, onSubmit, onDelete }: Props) {
  const [name, setName] = useState('')
  const [kind, setKind] = useState<AccountKind>('checking')
  const [balance, setBalance] = useState('')

  useEffect(() => {
    if (open) {
      setName(initial?.name || '')
      setKind(initial?.kind || 'checking')
      setBalance(initial?.initialBalance ? String(initial.initialBalance) : '')
    }
  }, [open, initial])

  if (!open) return null

  const numBalance = parseFloat(balance.replace(',', '.')) || 0
  const valid = name.trim().length > 0

  const submit = () => {
    if (!valid) return
    onSubmit({ name: name.trim(), kind, initialBalance: Math.round(numBalance) })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-ink-800 rounded-t-3xl sm:rounded-3xl border-t sm:border border-white/10 max-h-[92vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-ink-800/95 backdrop-blur-xl z-10 px-5 pt-4 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">
              {initial ? 'Modifier le compte' : 'Nouveau compte'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
            >
              <X size={18} className="text-white/70" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider px-1">
              Type de compte
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(Object.keys(ACCOUNT_KINDS) as AccountKind[]).map(k => {
                const meta = ACCOUNT_KINDS[k]
                const active = kind === k
                return (
                  <button
                    key={k}
                    onClick={() => {
                      setKind(k)
                      if (!initial && !name) setName(meta.label)
                    }}
                    className={`flex items-center gap-2 p-3 rounded-2xl border transition ${
                      active
                        ? 'bg-white/10 border-white/20'
                        : 'bg-white/[0.03] border-white/[0.06] active:scale-95'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center`}
                    >
                      <Icon name={meta.icon} size={16} className="text-white" />
                    </div>
                    <span
                      className={`text-xs font-semibold text-left ${
                        active ? 'text-white' : 'text-white/70'
                      }`}
                    >
                      {meta.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider px-1">
              Nom du compte
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="ex : Compte BICEC, Cash maison..."
              maxLength={40}
              className="input-base mt-2"
            />
          </div>

          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider px-1">
              {initial ? 'Solde de départ (ajustable)' : 'Solde de départ'}
            </label>
            <div className="mt-2 relative">
              <input
                type="text"
                inputMode="decimal"
                value={balance}
                onChange={e => setBalance(e.target.value.replace(/[^0-9.,-]/g, ''))}
                placeholder="0"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl pl-4 pr-20 py-4 text-2xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-accent-500/60 transition"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-semibold">
                FCFA
              </div>
            </div>
            <p className="text-white/40 text-[11px] mt-2 px-1">
              Le solde de départ est ajouté à votre solde calculé à partir des transactions.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-ink-800/95 backdrop-blur-xl border-t border-white/[0.06] p-4 safe-bottom flex gap-2">
          {initial && onDelete && (
            <button
              onClick={() => {
                if (
                  confirm(
                    `Supprimer le compte "${initial.name}" ? Les transactions liées resteront mais devront être réaffectées.`
                  )
                ) {
                  onDelete()
                  onClose()
                }
              }}
              className="px-4 py-4 rounded-2xl bg-danger-500/10 text-danger-400 text-sm font-semibold active:scale-95 transition"
            >
              Supprimer
            </button>
          )}
          <button
            onClick={submit}
            disabled={!valid}
            className="flex-1 btn-primary rounded-2xl py-4 flex items-center justify-center gap-2 disabled:opacity-40 disabled:shadow-none"
          >
            <Check size={18} />
            <span>{initial ? 'Enregistrer' : 'Créer'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
