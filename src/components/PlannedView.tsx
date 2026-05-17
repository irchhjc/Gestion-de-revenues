import { useState } from 'react'
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Handshake,
  RotateCcw,
  Trash2,
  Undo2,
  XCircle,
} from 'lucide-react'
import type { Planned } from '../types'
import type { PlannedTotals } from '../hooks/usePlanned'
import { formatAmount, formatDate } from '../utils/format'
import { getCategory } from '../utils/categories'
import { Icon } from './Icon'

interface Props {
  totals: PlannedTotals
  grouped: { overdue: Planned[]; upcoming: Planned[]; undated: Planned[]; done: Planned[] }
  onValidate: (p: Planned) => void
  onUnvalidate: (p: Planned) => void
  onCancel: (id: string) => void
  onRestore: (id: string) => void
  onDelete: (id: string) => void
}

export function PlannedView({
  totals,
  grouped,
  onValidate,
  onUnvalidate,
  onCancel,
  onRestore,
  onDelete,
}: Props) {
  const [doneOpen, setDoneOpen] = useState(false)
  const hasAny =
    grouped.overdue.length + grouped.upcoming.length + grouped.undated.length + grouped.done.length >
    0

  return (
    <div className="px-5 mt-6 space-y-5 pb-32 animate-fade-in">
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
            <ArrowUpFromLine size={14} className="text-danger-400" />
            <span>À payer</span>
          </div>
          <div className="mt-2 text-danger-400 font-bold text-lg">
            {formatAmount(totals.toPay, { compact: true })}
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
            <ArrowDownToLine size={14} className="text-success-400" />
            <span>À recevoir</span>
          </div>
          <div className="mt-2 text-success-400 font-bold text-lg">
            {formatAmount(totals.toReceive, { compact: true })}
          </div>
        </div>
      </div>

      {totals.overdueCount > 0 && (
        <div className="flex items-center gap-3 bg-danger-500/10 border border-danger-500/30 rounded-2xl p-3">
          <AlertTriangle size={18} className="text-danger-400 shrink-0" />
          <p className="text-danger-400 text-sm font-medium">
            {totals.overdueCount} échéance{totals.overdueCount > 1 ? 's' : ''} en retard
          </p>
        </div>
      )}

      {!hasAny && (
        <div className="glass rounded-3xl p-8 text-center">
          <div className="text-5xl mb-3">📅</div>
          <h3 className="text-white font-semibold text-lg">Aucune échéance</h3>
          <p className="text-white/50 text-sm mt-1">
            Ajoutez vos dettes et dépenses prévues pour mieux gérer vos finances
          </p>
        </div>
      )}

      {grouped.overdue.length > 0 && (
        <Section title="En retard" tone="danger" count={grouped.overdue.length}>
          {grouped.overdue.map(p => (
            <PlannedItem
              key={p.id}
              p={p}
              tone="danger"
              onValidate={() => onValidate(p)}
              onUnvalidate={() => onUnvalidate(p)}
              onCancel={() => onCancel(p.id)}
              onDelete={() => onDelete(p.id)}
            />
          ))}
        </Section>
      )}

      {grouped.upcoming.length > 0 && (
        <Section title="À venir" tone="accent" count={grouped.upcoming.length}>
          {grouped.upcoming.map(p => (
            <PlannedItem
              key={p.id}
              p={p}
              tone="accent"
              onValidate={() => onValidate(p)}
              onUnvalidate={() => onUnvalidate(p)}
              onCancel={() => onCancel(p.id)}
              onDelete={() => onDelete(p.id)}
            />
          ))}
        </Section>
      )}

      {grouped.undated.length > 0 && (
        <Section title="Sans date" tone="muted" count={grouped.undated.length}>
          {grouped.undated.map(p => (
            <PlannedItem
              key={p.id}
              p={p}
              tone="accent"
              onValidate={() => onValidate(p)}
              onUnvalidate={() => onUnvalidate(p)}
              onCancel={() => onCancel(p.id)}
              onDelete={() => onDelete(p.id)}
            />
          ))}
        </Section>
      )}

      {grouped.done.length > 0 && (
        <div>
          <button
            onClick={() => setDoneOpen(o => !o)}
            className="w-full flex items-center justify-between px-1 py-1"
          >
            <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider">
              Historique ({grouped.done.length})
            </h3>
            <ChevronDown
              size={16}
              className={`text-white/40 transition ${doneOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {doneOpen && (
            <div className="mt-2 space-y-2 animate-fade-in">
              {grouped.done.map(p => (
                <PlannedItem
                  key={p.id}
                  p={p}
                  tone="done"
                  onValidate={() => {}}
                  onUnvalidate={() => onUnvalidate(p)}
                  onRestore={() => onRestore(p.id)}
                  onCancel={() => onCancel(p.id)}
                  onDelete={() => onDelete(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Section({
  title,
  tone,
  count,
  children,
}: {
  title: string
  tone: 'danger' | 'accent' | 'muted'
  count: number
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <h3
          className={`text-xs font-semibold uppercase tracking-wider ${
            tone === 'danger' ? 'text-danger-400' : tone === 'muted' ? 'text-white/40' : 'text-white/60'
          }`}
        >
          {title}
        </h3>
        <span className="text-white/40 text-xs">{count}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function PlannedItem({
  p,
  tone,
  onValidate,
  onUnvalidate,
  onCancel,
  onRestore,
  onDelete,
}: {
  p: Planned
  tone: 'danger' | 'accent' | 'done'
  onValidate: () => void
  onUnvalidate: () => void
  onCancel: () => void
  onRestore?: () => void
  onDelete: () => void
}) {
  const [openActions, setOpenActions] = useState(false)
  const cat = getCategory(p.txCategory)
  const isDebt = p.kind === 'debt'
  const dirLabel =
    p.direction === 'out'
      ? isDebt
        ? 'Je dois'
        : 'Dépense prévue'
      : isDebt
      ? 'On me doit'
      : 'Revenu prévu'

  return (
    <div
      className={`glass rounded-2xl overflow-hidden ${
        tone === 'done' ? 'opacity-60' : ''
      } animate-slide-up`}
    >
      <button
        onClick={() => setOpenActions(o => !o)}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        <div
          className={`shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${
            cat?.color || 'from-slate-400 to-slate-600'
          } flex items-center justify-center shadow-card relative`}
        >
          <Icon name={cat?.icon || 'Circle'} size={20} className="text-white" />
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-ink-800 flex items-center justify-center">
            {isDebt ? (
              <Handshake size={9} className="text-white/80" />
            ) : (
              <Calendar size={9} className="text-white/80" />
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold text-sm truncate">{p.title}</div>
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={`${
                p.direction === 'out' ? 'text-danger-400' : 'text-success-400'
              } font-medium`}
            >
              {dirLabel}
            </span>
            <span className="text-white/30">•</span>
            <span
              className={`${
                tone === 'danger'
                  ? 'text-danger-400 font-semibold'
                  : tone === 'done'
                  ? 'text-white/40'
                  : 'text-white/50'
              }`}
            >
              {p.status === 'paid' && p.paidAt
                ? `Validé ${formatDate(p.paidAt)}`
                : p.status === 'cancelled'
                ? 'Annulé'
                : p.dueDate
                ? formatDate(p.dueDate)
                : 'Sans date'}
            </span>
          </div>
          {p.note && <div className="text-white/40 text-[11px] truncate mt-0.5">{p.note}</div>}
        </div>
        <div className="text-right">
          <div
            className={`font-bold text-sm ${
              p.direction === 'out' ? 'text-white' : 'text-success-400'
            }`}
          >
            {p.direction === 'out' ? '-' : '+'}
            {formatAmount(p.amount, { compact: true })}
          </div>
          {p.status === 'paid' && (
            <div className="flex items-center justify-end gap-0.5 text-success-400 text-[10px] mt-0.5">
              <CheckCircle2 size={10} />
              <span>Validé</span>
            </div>
          )}
          {p.status === 'cancelled' && (
            <div className="flex items-center justify-end gap-0.5 text-white/40 text-[10px] mt-0.5">
              <XCircle size={10} />
              <span>Annulé</span>
            </div>
          )}
        </div>
      </button>

      {openActions && (
        <div className="px-3 pb-3 pt-1 flex flex-wrap gap-2 border-t border-white/[0.04] animate-fade-in">
          {p.status === 'pending' && (
            <>
              <button
                onClick={onValidate}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-success-500 to-success-600 text-white font-semibold text-xs active:scale-95 transition"
              >
                <Check size={14} />
                {p.direction === 'out' ? 'Marquer payé' : 'Marquer reçu'}
              </button>
              <button
                onClick={onCancel}
                className="px-3 py-2.5 rounded-xl bg-white/5 text-white/60 text-xs font-medium active:scale-95 transition"
              >
                Annuler
              </button>
            </>
          )}
          {p.status === 'paid' && (
            <button
              onClick={onUnvalidate}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 font-semibold text-xs active:scale-95 transition"
            >
              <Undo2 size={14} />
              Annuler la validation
            </button>
          )}
          {p.status === 'cancelled' && onRestore && (
            <button
              onClick={onRestore}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 text-white/80 font-semibold text-xs active:scale-95 transition"
            >
              <RotateCcw size={14} />
              Réactiver
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-2.5 rounded-xl bg-danger-500/10 text-danger-400 active:scale-95 transition"
            aria-label="Supprimer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
