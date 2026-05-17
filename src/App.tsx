import { useState } from 'react'
import { useTransactions } from './hooks/useTransactions'
import { usePlanned } from './hooks/usePlanned'
import { Dashboard } from './components/Dashboard'
import { TransactionList } from './components/TransactionList'
import { TransactionForm } from './components/TransactionForm'
import { StatsView } from './components/StatsView'
import { BottomNav, type Tab } from './components/BottomNav'
import { PlannedForm } from './components/PlannedForm'
import { PlannedView } from './components/PlannedView'
import { ActionSheet } from './components/ActionSheet'
import { exportJSON } from './utils/storage'
import { Download, Trash2 } from 'lucide-react'
import type { Planned } from './types'

export default function App() {
  const tx = useTransactions()
  const planned = usePlanned()
  const [tab, setTab] = useState<Tab>('home')
  const [actionOpen, setActionOpen] = useState(false)
  const [txFormOpen, setTxFormOpen] = useState(false)
  const [plannedFormOpen, setPlannedFormOpen] = useState(false)

  const handleValidatePlanned = (p: Planned) => {
    const created = tx.add({
      type: p.direction === 'out' ? 'expense' : 'income',
      amount: p.amount,
      category: p.txCategory,
      note: p.title + (p.note ? ` — ${p.note}` : ''),
      date: new Date().toISOString().slice(0, 10),
      fromPlannedId: p.id,
    })
    planned.markPaid(p.id, created.id)
  }

  return (
    <div className="min-h-dvh max-w-md mx-auto safe-top">
      <header className="px-5 pt-6 flex items-center justify-between">
        <div>
          <p className="text-white/50 text-xs font-medium">Bienvenue 👋</p>
          <h1 className="text-white font-extrabold text-xl tracking-tight">Mon Budget</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportJSON(tx.items, planned.items)}
            className="p-2.5 rounded-2xl glass hover:bg-white/[0.08] transition"
            aria-label="Exporter"
          >
            <Download size={18} className="text-white/70" />
          </button>
          <button
            onClick={() => {
              if (
                confirm(
                  'Supprimer toutes les transactions et échéances ? Cette action est irréversible.'
                )
              ) {
                tx.clearAll()
                // also clear planned through forEach delete
                planned.items.forEach(p => planned.remove(p.id))
              }
            }}
            className="p-2.5 rounded-2xl glass hover:bg-danger-500/10 transition"
            aria-label="Tout effacer"
          >
            <Trash2 size={18} className="text-white/70" />
          </button>
        </div>
      </header>

      {tab === 'home' && (
        <>
          <Dashboard
            balance={tx.totals.balance}
            income={tx.totals.income}
            expense={tx.totals.expense}
            monthIncome={tx.monthTotals.income}
            monthExpense={tx.monthTotals.expense}
            toPay={planned.totals.toPay}
            toReceive={planned.totals.toReceive}
            overdueCount={planned.totals.overdueCount}
            onOpenPlanned={() => setTab('planned')}
          />
          <div className="mt-6 px-5">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-base">Transactions récentes</h2>
              <span className="text-white/40 text-xs">{tx.items.length} total</span>
            </div>
          </div>
          <TransactionList items={tx.items.slice(0, 30)} onDelete={tx.remove} />
        </>
      )}

      {tab === 'planned' && (
        <>
          <div className="px-5 pt-2">
            <h2 className="text-white font-extrabold text-2xl tracking-tight">Échéances</h2>
            <p className="text-white/50 text-sm mt-1">Dettes, factures et dépenses prévues</p>
          </div>
          <PlannedView
            totals={planned.totals}
            grouped={planned.grouped}
            onValidate={handleValidatePlanned}
            onCancel={planned.cancel}
            onRestore={planned.restore}
            onDelete={planned.remove}
          />
        </>
      )}

      {tab === 'stats' && (
        <>
          <div className="px-5 pt-2">
            <h2 className="text-white font-extrabold text-2xl tracking-tight">Statistiques</h2>
            <p className="text-white/50 text-sm mt-1">Vue d'ensemble de votre budget</p>
          </div>
          <StatsView items={tx.items} />
        </>
      )}

      <BottomNav
        active={tab}
        onChange={setTab}
        onAdd={() => setActionOpen(true)}
        badge={planned.totals.overdueCount}
      />

      <ActionSheet
        open={actionOpen}
        onClose={() => setActionOpen(false)}
        onTransaction={() => setTxFormOpen(true)}
        onPlanned={() => setPlannedFormOpen(true)}
      />

      <TransactionForm
        open={txFormOpen}
        onClose={() => setTxFormOpen(false)}
        onSubmit={tx.add}
      />

      <PlannedForm
        open={plannedFormOpen}
        onClose={() => setPlannedFormOpen(false)}
        onSubmit={planned.add}
      />
    </div>
  )
}
