import { Home, BarChart3, Plus } from 'lucide-react'

export type Tab = 'home' | 'stats'

interface Props {
  active: Tab
  onChange: (t: Tab) => void
  onAdd: () => void
}

export function BottomNav({ active, onChange, onAdd }: Props) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 safe-bottom">
      <div className="mx-auto max-w-md px-4 pb-3">
        <div className="relative glass-strong rounded-3xl px-2 py-2 shadow-card">
          <div className="grid grid-cols-3 items-center">
            <NavButton
              icon={<Home size={20} />}
              label="Accueil"
              active={active === 'home'}
              onClick={() => onChange('home')}
            />
            <div className="flex justify-center">
              <button
                onClick={onAdd}
                className="-mt-8 w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 shadow-glow flex items-center justify-center active:scale-95 transition"
                aria-label="Ajouter"
              >
                <Plus size={26} className="text-white" strokeWidth={2.5} />
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
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 py-2 rounded-2xl transition ${
        active ? 'text-accent-400' : 'text-white/40'
      }`}
    >
      {icon}
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  )
}
