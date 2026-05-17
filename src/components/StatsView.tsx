import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import type { Transaction } from '../types'
import { formatAmount } from '../utils/format'
import { getCategory } from '../utils/categories'

interface Props {
  items: Transaction[]
}

const COLORS = ['#5B7FFF', '#3DDC97', '#F25757', '#FFB547', '#A78BFA', '#F472B6', '#22D3EE', '#FB923C', '#FB7185', '#34D399']

export function StatsView({ items }: Props) {
  const categoryData = useMemo(() => {
    const map = new Map<string, number>()
    for (const t of items) {
      if (t.type !== 'expense') continue
      map.set(t.category, (map.get(t.category) || 0) + t.amount)
    }
    return Array.from(map.entries())
      .map(([id, value]) => ({
        id,
        name: getCategory(id)?.label || 'Autre',
        value,
      }))
      .sort((a, b) => b.value - a.value)
  }, [items])

  const monthlyData = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>()
    for (const t of items) {
      const key = t.date.slice(0, 7) // YYYY-MM
      const existing = map.get(key) || { income: 0, expense: 0 }
      if (t.type === 'income') existing.income += t.amount
      else existing.expense += t.amount
      map.set(key, existing)
    }
    return Array.from(map.entries())
      .map(([key, v]) => {
        const [y, m] = key.split('-')
        const label = new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(
          new Date(parseInt(y), parseInt(m) - 1)
        )
        return { month: label.replace('.', ''), ...v, key }
      })
      .sort((a, b) => (a.key < b.key ? -1 : 1))
      .slice(-6)
  }, [items])

  const totalExpense = categoryData.reduce((a, b) => a + b.value, 0)

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
    <div className="px-5 mt-6 space-y-5 pb-32 animate-fade-in">
      {/* Categories pie */}
      {categoryData.length > 0 && (
        <div className="glass rounded-3xl p-5">
          <h3 className="text-white font-bold text-base">Dépenses par catégorie</h3>
          <p className="text-white/50 text-xs mt-0.5">Total : {formatAmount(totalExpense)}</p>

          <div className="mt-4 flex items-center">
            <div className="w-32 h-32 shrink-0">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={38}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              {categoryData.slice(0, 5).map((c, idx) => {
                const pct = totalExpense > 0 ? (c.value / totalExpense) * 100 : 0
                return (
                  <div key={c.id} className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
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
      )}

      {/* Monthly bar */}
      {monthlyData.length > 0 && (
        <div className="glass rounded-3xl p-5">
          <h3 className="text-white font-bold text-base">Évolution mensuelle</h3>
          <p className="text-white/50 text-xs mt-0.5">6 derniers mois</p>

          <div className="mt-4 h-48 -mx-2">
            <ResponsiveContainer>
              <BarChart data={monthlyData} barCategoryGap="20%">
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#ffffff60', fontSize: 11 }} />
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
    </div>
  )
}
