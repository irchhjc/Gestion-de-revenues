import { Home, BarChart3, Plus, CalendarClock } from 'lucide-react'

export type Tab = 'home' | 'planned' | 'stats'

interface Props {
  active: Tab
  onChange: (t: Tab) => void
  onAdd: () => void
  badge?: number
}

export function BottomNav({ active, onChange, onAdd, badge = 0 }: Props) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 safe-bottom">
      <div className="mx-auto max-w-md px-4 pb-3">
        <div className="glass-strong rounded-3xl px-2 py-2 shadow-card">
          <div className="grid grid-cols-4 items-center">
            <NavButton
              icon={<Home size={20} />}
              label="Accueil"
              active={active === 'home'}
              onClick={() => onChange('home')}
            />
            <NavButton
              icon={<CalendarClock size={20} />}
              label="Échéances"
              active={active === 'planned'}
              onClick={() => onChange('planned')}
              badge={badge}
            />
            <div className="flex justify-center">
              <button
                onClick={onAdd}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 shadow-glow flex items-center justify-center active:scale-95 transition"
                aria-label="Ajouter"
              >
                <Plus size={22} className="text-white" strokeWidth={2.5} />
              </button>
            </div>
            <NavButton
              icon={<BarChart3 size={20} />}
              label="Stats"
              active={active === 'stats'}
              onClick={() => onChange('stats')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function NavButton({
  icon,
  label,
  active,
  onClick,
  badge = 0,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
  badge?: number
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-0.5 py-2 rounded-2xl transition ${
        active ? 'text-accent-400' : 'text-white/40'
      }`}
    >
      <div className="relative">
        {icon}
        {badge > 0 && (
          <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-danger-500 text-white text-[9px] font-bold flex items-center justify-center">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  )
}
