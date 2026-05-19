import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, X } from 'lucide-react'
import type { Account } from '../types'
import { ACCOUNT_KINDS } from '../utils/accounts'
import { formatAmount, todayISO } from '../utils/format'
import { Icon } from './Icon'
import { AccountSelector } from './AccountSelector'

interface Props {
  open: boolean
  onClose: () => void
  accounts: Account[]
  balances: Map<string, number>
  onSubmit: (t: {
    amount: number
    accountId: string
    toAccountId: string
    date: string
    note: string
  }) => void
}

export function TransferForm({ open, onClose, accounts, balances, onSubmit }: Props) {
  const usable = accounts.filter(a => !a.archived)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(todayISO())
  const [note, setNote] = useState('')

  useEffect(() => {
    if (open) {
      const first = usable[0]?.id || ''
      const second = usable.find(a => a.id !== first)?.id || ''
      setFrom(first)
      setTo(second)
      setAmount('')
      setDate(todayISO())
      setNote('')
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const fromAccount = useMemo(() => usable.find(a => a.id === from), [from, usable])
  const toAccount = useMemo(() => usable.find(a => a.id === to), [to, usable])
  const fromBalance = from ? balances.get(from) || 0 : 0
  const numAmount = parseFloat(amount.replace(',', '.')) || 0
  const valid = numAmount > 0 && from && to && from !== to

  if (!open) return null

  const submit = () => {
    if (!valid) return
    onSubmit({
      amount: Math.round(numAmount),
      accountId: from,
      toAccountId: to,
      date,
      note: note.trim(),
    })
    onClose()
  }

  return (
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
            <h2 className="text-white font-bold text-lg">Nouveau transfert</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
            >
              <X size={18} className="text-white/70" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* From → To visual */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <AccountChip account={fromAccount} balance={fromBalance} label="Depuis" />
            <div className="w-9 h-9 rounded-full bg-accent-500/15 flex items-center justify-center">
              <ArrowRight size={16} className="text-accent-400" />
            </div>
            <AccountChip
              account={toAccount}
              balance={to ? balances.get(to) || 0 : 0}
              label="Vers"
            />
          </div>

          <AccountSelector
            accounts={usable}
            value={from}
            onChange={id => {
              setFrom(id)
              if (id === to) setTo(usable.find(a => a.id !== id)?.id || '')
            }}
            label="Compte source"
          />

          <AccountSelector
            accounts={usable}
            value={to}
            onChange={setTo}
            excludeId={from}
            label="Compte destination"
          />

          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider px-1">
              Montant à transférer
            </label>
            <div className="mt-2 relative">
              <input
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/[^0-9.,]/g, ''))}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl pl-4 pr-20 py-4 text-2xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-accent-500/60 transition"
                autoFocus
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-semibold">
                FCFA
              </div>
            </div>
            {numAmount > 0 && fromBalance < numAmount && (
              <p className="mt-2 text-amber-400 text-[11px] px-1">
                ⚠ Le compte source n'a que {formatAmount(fromBalance, { compact: true })}.
                Le solde deviendra négatif.
              </p>
            )}
          </div>

          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider px-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="input-base mt-2"
            />
          </div>

          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider px-1">
              Note (optionnel)
            </label>
            <input
              type="text"
              placeholder="ex : Retrait DAB"
              value={note}
              onChange={e => setNote(e.target.value)}
              maxLength={80}
              className="input-base mt-2"
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-ink-800/95 backdrop-blur-xl border-t border-white/[0.06] p-4 safe-bottom">
          <button
            onClick={submit}
            disabled={!valid}
            className="w-full btn-primary rounded-2xl py-4 flex items-center justify-center gap-2 disabled:opacity-40 disabled:shadow-none"
          >
            <Check size={18} />
            <span>Effectuer le transfert</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function AccountChip({
  account,
  balance,
  label,
}: {
  account?: Account
  balance: number
  label: string
}) {
  if (!account) {
    return (
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
        <p className="text-white/40 text-[10px] uppercase font-semibold">{label}</p>
        <p className="text-white/50 text-xs mt-1">—</p>
      </div>
    )
  }
  const meta = ACCOUNT_KINDS[account.kind]
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-3">
      <p className="text-white/40 text-[10px] uppercase font-semibold">{label}</p>
      <div className="mt-1.5 flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${meta.color} flex items-center justify-center shrink-0`}
        >
          <Icon name={meta.icon} size={14} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white text-xs font-semibold truncate">{account.name}</p>
          <p className="text-white/50 text-[10px]">{formatAmount(balance, { compact: true })}</p>
        </div>
      </div>
    </div>
  )
}
