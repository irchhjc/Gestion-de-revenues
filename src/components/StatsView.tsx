import { useMemo, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts'
import {
  ArrowDownRight,
  ArrowUpRight,
  Coins,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import type { Transaction } from '../types'
import { formatAmount } from '../utils/format'
import { getCategory } from '../utils/categories'
import { Icon } from './Icon'

interface Props {
  items: Transaction[]
}

type Period = 'month' | '30d' | '6m' | '12m' | 'all'

const PALETTE_EXPENSE = ['#F25757', '#FB923C', '#FFB547', '#F472B6', '#FB7185', '#A78BFA', '#22D3EE', '#34D399', '#5B7FFF', '#94A3B8']
const PALETTE_INCOME = ['#22C586', '#3DDC97', '#22D3EE', '#7C9CFF', '#A78BFA', '#F472B6', '#FFB547']

function startOfPeriod(p: Period): Date | null {
  const now = new Date()
  if (p === 'month') return new Date(now.getFullYear(), now.getMonth(), 1)
  if (p === '30d') {
    const d = new Date(now)
    d.setDate(d.getDate() - 30)
    return d
  }
  if (p === '6m') {
    const d = new Date(now)
    d.setMonth(d.getMonth() - 6)
    return d
  }
  if (p === '12m') {
    const d = new Date(now)
    d.setMonth(d.getMonth() - 12)
    return d
  }
  return null
}

const PERIODS: { value: Period; label: string }[] = [
  { value: 'month', label: 'Ce mois' },
  { value: '30d', label: '30 jours' },
  { value: '6m', label: '6 mois' },
  { value: '12m', label: '12 mois' },
  { value: 'all', label: 'Tout' },
]

export function StatsView({ items }: Props) {
  const [period, setPeriod] = useState<Period>('month')

  const filtered = useMemo(() => {
    const start = startOfPeriod(period)
    if (!start) return items
    const startISO = start.toISOString().slice(0, 10)
    return items.filter(t => t.date >= startISO)
  }, [items, period])

  const totals = useMemo(() => {
    let income = 0
    let expense = 0
    let largestExpense: Transaction | null = null
    let largestIncome: Transaction | null = null
    for (const t of filtered) {
      if (t.type === 'income') {
        income += t.amount
        if (!largestIncome || t.amount > largestIncome.amount) largestIncome = t
      } else {
        expense += t.amount
        if (!largestExpense || t.amount > largestExpense.amount) largestExpense = t
      }
    }
    return { income, expense, net: income - expense, largestExpense, largestIncome }
  }, [filtered])

  const days = useMemo(() => {
    if (filtered.length === 0) return 1
    const start = startOfPeriod(period)
    if (start) {
      const ms = Date.now() - start.getTime()
      return Math.max(1, Math.round(ms / 86400000))
    }
    // all time : use range between first and last
    const sorted = [...filtered].sort((a, b) => (a.date < b.date ? -1 : 1))
    const first = new Date(sorted[0].date).getTime()
    const last = Date.now()
    return Math.max(1, Math.round((last - first) / 86400000))
  }, [filtered, period])

  const avgDailySpend = totals.expense / days

  const categoryData = useMemo(() => {
    const exp = new Map<string, number>()
    const inc = new Map<string, number>()
    for (const t of filtered) {
      const map = t.type === 'expense' ? exp : inc
      map.set(t.category, (map.get(t.category) || 0) + t.amount)
    }
    const toList = (m: Map<string, number>) =>
      Array.from(m.entries())
        .map(([id, value]) => ({ id, name: getCategory(id)?.label || 'Autre', value }))
        .sort((a, b) => b.value - a.value)
    return { expense: toList(exp), income: toList(inc) }
  }, [filtered])

  const monthly = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>()
    for (const t of filtered) {
      const key = t.date.slice(0, 7)
      const e = map.get(key) || { income: 0, expense: 0 }
      if (t.type === 'income') e.income += t.amount
      else e.expense += t.amount
      map.set(key, e)
    }
    const months = Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? -1 : 1))
    return months.map(([key, v]) => {
      const [y, m] = key.split('-')
      const label = new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(
        new Date(parseInt(y), parseInt(m) - 1)
      )
      return { month: label.replace('.', ''), key, ...v, net: v.income - v.expense }
    })
  }, [filtered])

  const balanceSeries = useMemo(() => {
    // cumulative net by date (sorted ASC)
    const sorted = [...filtered].sort((a, b) => (a.date < b.date ? -1 : 1))
    let running = 0
    const points: { date: string; balance: number }[] = []
    const byDay = new Map<string, number>()
    for (const t of sorted) {
      const delta = t.type === 'income' ? t.amount : -t.amount
      byDay.set(t.date, (byDay.get(t.date) || 0) + delta)
    }
    const dates = Array.from(byDay.keys()).sort()
    for (const d of dates) {
      running += byDay.get(d) || 0
      points.push({ date: d, balance: running })
    }
    return points
  }, [filtered])

  const top5 = useMemo(
    () => [...filtered].sort((a, b) => b.amount - a.amount).slice(0, 5),
    [filtered]
  )

  const topExpenseCategory = categoryData.expense[0]

  if (items.length === 0) {
    return (
      <div className="px-5 mt-8">
        <div className="glass rounded-3xl p-8 text-center">
          <div className="text-5xl mb-3">📊</div>
          <h3 className="text-white font-semibold text-lg">Pas encore de statistiques</h3>
          <p className="text-white/50 text-sm mt-1">
            Ajoutez des transactions pour voir vos analyses
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 mt-4 space-y-5 pb-32 animate-fade-in">
      {/* Period selector */}
      <div className="-mx-1 px-1 overflow-x-auto">
        <div className="flex gap-2 min-w-min">
          {PERIODS.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                period === p.value
                  ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-card'
                  : 'bg-white/[0.04] text-white/60'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3">
        <KpiCard
          icon={<Coins size={14} />}
          label="Solde net"
          value={formatAmount(totals.net, { compact: true, showSign: true })}
          tone={totals.net >= 0 ? 'success' : 'danger'}
        />
        <KpiCard
          icon={<TrendingDown size={14} />}
          label="Moy./jour (dépense)"
          value={formatAmount(Math.round(avgDailySpend), { compact: true })}
          tone="muted"
        />
        <KpiCard
          icon={<Target size={14} />}
          label="Top catégorie"
          value={topExpenseCategory?.name || '—'}
          subValue={
            topExpenseCategory
              ? formatAmount(topExpenseCategory.value, { compact: true })
              : undefined
          }
          tone="warning"
        />
        <KpiCard
          icon={<Trophy size={14} />}
          label="Plus grosse dépense"
          value={
            totals.largestExpense
              ? formatAmount(totals.largestExpense.amount, { compact: true })
              : '—'
          }
          subValue={
            totals.largestExpense
              ? getCategory(totals.largestExpense.category)?.label
              : undefined
          }
          tone="muted"
        />
      </div>

      {/* Income vs expense summary */}
      <div className="glass rounded-3xl p-5">
        <h3 className="text-white font-bold text-base mb-3">Flux du période</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-success-500/5 border border-success-500/20 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-success-400 text-xs font-medium">
              <ArrowUpRight size={13} />
              <span>Revenus</span>
            </div>
            <div className="mt-1 text-success-400 font-bold text-lg">
              {formatAmount(totals.income, { compact: true })}
            </div>
          </div>
          <div className="bg-danger-500/5 border border-danger-500/20 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-danger-400 text-xs font-medium">
              <ArrowDownRight size={13} />
              <span>Dépenses</span>
            </div>
            <div className="mt-1 text-danger-400 font-bold text-lg">
              {formatAmount(totals.expense, { compact: true })}
            </div>
          </div>
        </div>
        {totals.income > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] text-white/40 mb-1">
              <span>Ratio dépenses / revenus</span>
              <span>{Math.round((totals.expense / totals.income) * 100)}%</span>
            </div>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  totals.expense > totals.income
                    ? 'bg-gradient-to-r from-danger-500 to-danger-400'
                    : 'bg-gradient-to-r from-accent-500 to-success-400'
                }`}
                style={{
                  width: `${Math.min(100, (totals.expense / totals.income) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Balance evolution */}
      {balanceSeries.length > 1 && (
        <div className="glass rounded-3xl p-5">
          <h3 className="text-white font-bold text-base">Évolution du solde</h3>
          <p className="text-white/50 text-xs mt-0.5">Cumul net sur la période</p>
          <div className="mt-4 h-40 -mx-2">
            <ResponsiveContainer>
              <AreaChart data={balanceSeries}>
                <defs>
                  <linearGradient id="balG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5B7FFF" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#5B7FFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#ffffff50', fontSize: 10 }}
                  tickFormatter={(v: string) =>
                    new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' })
                      .format(new Date(v))
                      .replace('.', '')
                  }
                  minTickGap={30}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161D33',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: '#ffffff80' }}
                  formatter={(v: number) => formatAmount(v, { compact: true })}
                  labelFormatter={(v: string) =>
                    new Intl.DateTimeFormat('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                    }).format(new Date(v))
                  }
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#5B7FFF"
                  strokeWidth={2}
                  fill="url(#balG)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Expenses pie */}
      {categoryData.expense.length > 0 && (
        <CategoryBreakdown
          title="Dépenses par catégorie"
          total={totals.expense}
          data={categoryData.expense}
          palette={PALETTE_EXPENSE}
        />
      )}

      {/* Income breakdown */}
      {categoryData.income.length > 0 && (
        <CategoryBreakdown
          title="Revenus par source"
          total={totals.income}
          data={categoryData.income}
          palette={PALETTE_INCOME}
        />
      )}

      {/* Monthly bar */}
      {monthly.length > 1 && (
        <div className="glass rounded-3xl p-5">
          <h3 className="text-white font-bold text-base">Évolution mensuelle</h3>
          <div className="mt-4 h-48 -mx-2">
            <ResponsiveContainer>
              <BarChart data={monthly} barCategoryGap="20%">
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#ffffff60', fontSize: 11 }}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{
                    backgroundColor: '#161D33',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => formatAmount(v, { compact: true })}
                  labelStyle={{ color: '#ffffff80' }}
                />
                <Bar dataKey="income" fill="#22C586" radius={[6, 6, 0, 0]} name="Revenus" />
                <Bar dataKey="expense" fill="#F25757" radius={[6, 6, 0, 0]} name="Dépenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top transactions */}
      {top5.length > 0 && (
        <div className="glass rounded-3xl p-5">
          <h3 className="text-white font-bold text-base">Top transactions</h3>
          <p className="text-white/50 text-xs mt-0.5">Les 5 plus gros montants</p>
          <div className="mt-3 space-y-2">
            {top5.map(t => {
              const cat = getCategory(t.category)
              return (
                <div key={t.id} className="flex items-center gap-3">
                  <div
                    className={`shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${
                      cat?.color || 'from-slate-400 to-slate-600'
                    } flex items-center justify-center`}
                  >
                    <Icon name={cat?.icon || 'Circle'} size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">
                      {cat?.label || 'Autre'}
                    </div>
                    <div className="text-white/40 text-xs truncate">{t.note || '—'}</div>
                  </div>
                  <div
                    className={`font-bold text-sm ${
                      t.type === 'income' ? 'text-success-400' : 'text-white'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'}
                    {formatAmount(t.amount, { compact: true })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function KpiCard({
  icon,
  label,
  value,
  subValue,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  subValue?: string
  tone: 'success' | 'danger' | 'warning' | 'muted'
}) {
  const tones = {
    success: 'text-success-400',
    danger: 'text-danger-400',
    warning: 'text-amber-400',
    muted: 'text-white',
  } as const
  return (
    <div className="glass rounded-2xl p-3">
      <div className="flex items-center gap-1.5 text-white/50 text-[10px] font-semibold uppercase tracking-wider">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div className={`mt-1.5 font-bold text-base truncate ${tones[tone]}`}>{value}</div>
      {subValue && <div className="text-white/40 text-[10px] truncate">{subValue}</div>}
    </div>
  )
}

function CategoryBreakdown({
  title,
  total,
  data,
  palette,
}: {
  title: string
  total: number
  data: { id: string; name: string; value: number }[]
  palette: string[]
}) {
  return (
    <div className="glass rounded-3xl p-5">
      <h3 className="text-white font-bold text-base">{title}</h3>
      <p className="text-white/50 text-xs mt-0.5">Total : {formatAmount(total)}</p>

      <div className="mt-4 flex items-center">
        <div className="w-32 h-32 shrink-0">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                innerRadius={38}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, idx) => (
                  <Cell key={idx} fill={palette[idx % palette.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          {data.slice(0, 5).map((c, idx) => {
            const pct = total > 0 ? (c.value / total) * 100 : 0
            return (
              <div key={c.id} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: palette[idx % palette.length] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium truncate">{c.name}</div>
                  <div className="text-white/40 text-[10px]">{pct.toFixed(0)}%</div>
                </div>
                <div className="text-white/80 text-xs font-bold">
                  {formatAmount(c.value, { compact: true })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
