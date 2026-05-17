import { useState } from 'react'
import { useTransactions } from './hooks/useTransactions'
import { Dashboard } from './components/Dashboard'
import { TransactionList } from './components/TransactionList'
import { TransactionForm } from './components/TransactionForm'
import { StatsView } from './components/StatsView'
import { BottomNav, type Tab } from './components/BottomNav'
import { exportJSON } from './utils/storage'
import { Download, Trash2 } from 'lucide-react'

export default function App() {
  const { items, add, remove, clearAll, totals, monthTotals } = useTransactions()
  const [tab, setTab] = useState<Tab>('home')
  const [formOpen, setFormOpen] = useState(false)

  return (
    <div className="min-h-dvh max-w-md mx-auto safe-top">
      {/* Header */}
      <header className="px-5 pt-6 flex items-center justify-between">
        <div>
          <p className="text-white/50 text-xs font-medium">Bienvenue 👋</p>
          <h1 className="text-white font-extrabold text-xl tracking-tight">Mon Budget</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportJSON(items)}
            className="p-2.5 rounded-2xl glass hover:bg-white/[0.08] transition"
            aria-label="Exporter"
          >
            <Download size={18} className="text-white/70" />
          </button>
          <button
            onClick={() => {
              if (confirm('Supprimer toutes les transactions ? Cette action est irréversible.')) {
                clearAll()
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
            balance={totals.balance}
            income={totals.income}
            expense={totals.expense}
            monthIncome={monthTotals.income}
            monthExpense={monthTotals.expense}
          />
          <div className="mt-6 px-5">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-base">Transactions récentes</h2>
              <span className="text-white/40 text-xs">{items.length} total</span>
            </div>
          </div>
          <TransactionList items={items.slice(0, 30)} onDelete={remove} />
        </>
      )}

      {tab === 'stats' && (
        <>
          <div className="px-5 pt-2">
            <h2 className="text-white font-extrabold text-2xl tracking-tight">Statistiques</h2>
            <p className="text-white/50 text-sm mt-1">Vue d'ensemble de votre budget</p>
          </div>
          <StatsView items={items} />
        </>
      )}

      <BottomNav active={tab} onChange={setTab} onAdd={() => setFormOpen(true)} />

      <TransactionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={add}
      />
    </div>
  )
}
