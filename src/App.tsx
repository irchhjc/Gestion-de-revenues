import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
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
import { AuthScreen } from './components/auth/AuthScreen'
import { UserMenu } from './components/UserMenu'
import { AdminPanel } from './components/AdminPanel'
import { exportJSON } from './utils/storage'
import type { Planned, User } from './types'

export default function App() {
  const auth = useAuth()

  if (!auth.currentUser) {
    return (
      <AuthScreen
        hasUsers={auth.users.length > 0}
        error={auth.error}
        onLogin={auth.login}
        onRegister={auth.register}
        onClearError={auth.clearError}
      />
    )
  }

  return <AuthedApp key={auth.currentUser.id} user={auth.currentUser} auth={auth} />
}

function AuthedApp({
  user,
  auth,
}: {
  user: User
  auth: ReturnType<typeof useAuth>
}) {
  const tx = useTransactions(user.id)
  const planned = usePlanned(user.id)
  const [tab, setTab] = useState<Tab>('home')
  const [actionOpen, setActionOpen] = useState(false)
  const [txFormOpen, setTxFormOpen] = useState(false)
  const [plannedFormOpen, setPlannedFormOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)

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

  const handleUnvalidate = (p: Planned) => {
    if (p.transactionId) {
      tx.remove(p.transactionId)
    }
    planned.restore(p.id)
  }

  const handleClearData = () => {
    if (
      confirm(
        `Supprimer toutes vos transactions et échéances ? Cette action est irréversible et ne supprime pas votre compte.`
      )
    ) {
      tx.clearAll()
      planned.clearAll()
    }
  }

  return (
    <div className="min-h-dvh max-w-md mx-auto safe-top">
      <header className="px-5 pt-6 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-white/50 text-xs font-medium truncate">
            Bienvenue, {user.fullName.split(' ')[0]} 👋
          </p>
          <h1 className="text-white font-extrabold text-xl tracking-tight">Mon Budget</h1>
        </div>
        <UserMenu
          user={user}
          onLogout={auth.logout}
          onExport={() => exportJSON(tx.items, planned.items)}
          onClearData={handleClearData}
          onOpenAdmin={() => setAdminOpen(true)}
        />
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
            onUnvalidate={handleUnvalidate}
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

      <TransactionForm open={txFormOpen} onClose={() => setTxFormOpen(false)} onSubmit={tx.add} />

      <PlannedForm
        open={plannedFormOpen}
        onClose={() => setPlannedFormOpen(false)}
        onSubmit={planned.add}
      />

      {user.role === 'admin' && (
        <AdminPanel
          open={adminOpen}
          onClose={() => setAdminOpen(false)}
          users={auth.users}
          currentUserId={user.id}
          onDeleteUser={auth.deleteUser}
          onResetPassword={auth.resetPassword}
          onSetRole={auth.setRole}
        />
      )}
    </div>
  )
}
