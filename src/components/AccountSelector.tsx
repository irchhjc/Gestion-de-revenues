import type { Account } from '../types'
import { ACCOUNT_KINDS } from '../utils/accounts'
import { Icon } from './Icon'

interface Props {
  accounts: Account[]
  value: string
  onChange: (id: string) => void
  excludeId?: string
  label?: string
}

export function AccountSelector({ accounts, value, onChange, excludeId, label }: Props) {
  const active = accounts.filter(a => !a.archived && a.id !== excludeId)
  return (
    <div>
      {label && (
        <label className="text-white/60 text-xs font-semibold uppercase tracking-wider px-1">
          {label}
        </label>
      )}
      <div className={`${label ? 'mt-2' : ''} -mx-1 px-1 overflow-x-auto`}>
        <div className="flex gap-2 min-w-min">
          {active.map(a => {
            const meta = ACCOUNT_KINDS[a.kind]
            const selected = value === a.id
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => onChange(a.id)}
                className={`shrink-0 flex items-center gap-2 pl-2 pr-3 py-2 rounded-2xl border transition ${
                  selected
                    ? 'bg-white/10 border-white/20 scale-[1.02]'
                    : 'bg-white/[0.03] border-white/[0.06] active:scale-95'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center`}
                >
                  <Icon name={meta.icon} size={16} className="text-white" />
                </div>
                <span
                  className={`text-xs font-semibold ${
                    selected ? 'text-white' : 'text-white/70'
                  }`}
                >
                  {a.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
