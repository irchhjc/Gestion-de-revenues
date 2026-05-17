import { useEffect, useState } from 'react'
import { X, Check } from 'lucide-react'
import type { TransactionType } from '../types'
import { categoriesByType } from '../utils/categories'
import { todayISO } from '../utils/format'
import { Icon } from './Icon'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (t: { type: TransactionType; amount: number; category: string; note: string; date: string }) => void
}

export function TransactionForm({ open, onClose, onSubmit }: Props) {
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(todayISO())

  useEffect(() => {
    if (open) {
      setType('expense')
      setAmount('')
      setCategory('')
      setNote('')
      setDate(todayISO())
    }
  }, [open])

  useEffect(() => {
    setCategory('')
  }, [type])

  if (!open) return null

  const cats = categoriesByType(type)
  const numAmount = parseFloat(amount.replace(',', '.')) || 0
  const valid = numAmount > 0 && category

  const handleSubmit = () => {
    if (!valid) return
    onSubmit({ type, amount: Math.round(numAmount), category, note: note.trim(), date })
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
        {/* Header */}
        <div className="sticky top-0 bg-ink-800/95 backdrop-blur-xl z-10 px-5 pt-4 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">Nouvelle transaction</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
            >
              <X size={18} className="text-white/70" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.04] rounded-2xl">
            <button
              onClick={() => setType('expense')}
              className={`py-3 rounded-xl font-semibold text-sm transition ${
                type === 'expense'
                  ? 'bg-gradient-to-r from-danger-500 to-danger-600 text-white shadow-card'
                  : 'text-white/50'
              }`}
            >
              Dépense
            </button>
            <button
              onClick={() => setType('income')}
              className={`py-3 rounded-xl font-semibold text-sm transition ${
                type === 'income'
                  ? 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-card'
                  : 'text-white/50'
              }`}
            >
              Revenu
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider px-1">
              Montant
            </label>
            <div className="mt-2 relative">
              <input
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/[^0-9.,]/g, ''))}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl pl-4 pr-20 py-4 text-2xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-accent-500/60 focus:bg-white/[0.06] transition"
                autoFocus
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-semibold">
                FCFA
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider px-1">
              Catégorie
            </label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {cats.map(c => {
                const active = category === c.id
                return (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition ${
                      active
                        ? 'bg-white/10 border border-white/20 scale-105'
                        : 'bg-white/[0.03] border border-white/[0.06] active:scale-95'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center`}
                    >
                      <Icon name={c.icon} size={18} className="text-white" />
                    </div>
                    <span className="text-white/80 text-[10px] font-medium leading-tight text-center">
                      {c.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider px-1">
              Note (optionnel)
            </label>
            <input
              type="text"
              placeholder="Ex : Courses du marché..."
              value={note}
              onChange={e => setNote(e.target.value)}
              maxLength={80}
              className="input-base mt-2"
            />
          </div>

          {/* Date */}
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
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-ink-800/95 backdrop-blur-xl border-t border-white/[0.06] p-4 safe-bottom">
          <button
            onClick={handleSubmit}
            disabled={!valid}
            className="w-full btn-primary rounded-2xl py-4 flex items-center justify-center gap-2 disabled:opacity-40 disabled:shadow-none"
          >
            <Check size={18} />
            <span>Enregistrer</span>
          </button>
        </div>
      </div>
    </div>
  )
}
