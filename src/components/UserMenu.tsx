import { useEffect, useRef, useState } from 'react'
import { Download, LogOut, Shield, ShieldCheck, Trash2, User as UserIcon } from 'lucide-react'
import type { User } from '../types'

interface Props {
  user: User
  onLogout: () => void
  onExport: () => void
  onClearData: () => void
  onOpenAdmin: () => void
}

export function UserMenu({ user, onLogout, onExport, onClearData, onOpenAdmin }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const initials = user.fullName
    .split(' ')
    .map(s => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl glass hover:bg-white/[0.08] transition"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-card">
          <span className="text-white text-xs font-bold">{initials || 'U'}</span>
        </div>
        {user.role === 'admin' && <ShieldCheck size={14} className="text-accent-400" />}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 glass-strong rounded-2xl shadow-card overflow-hidden z-50 animate-scale-in origin-top-right">
          <div className="p-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-bold">{initials || 'U'}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-white font-semibold text-sm truncate">{user.fullName}</div>
                <div className="flex items-center gap-1.5 text-white/50 text-xs">
                  <UserIcon size={10} />
                  <span className="truncate">@{user.username}</span>
                </div>
              </div>
            </div>
            {user.role === 'admin' && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent-500/15 text-accent-400 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck size={10} />
                <span>Administrateur</span>
              </div>
            )}
          </div>

          <div className="p-1.5">
            {user.role === 'admin' && (
              <MenuItem
                icon={<Shield size={16} />}
                label="Gestion des utilisateurs"
                onClick={() => {
                  onOpenAdmin()
                  setOpen(false)
                }}
              />
            )}
            <MenuItem
              icon={<Download size={16} />}
              label="Exporter mes données"
              onClick={() => {
                onExport()
                setOpen(false)
              }}
            />
            <MenuItem
              icon={<Trash2 size={16} />}
              label="Effacer mes données"
              onClick={() => {
                onClearData()
                setOpen(false)
              }}
              danger
            />
            <div className="my-1 h-px bg-white/[0.06]" />
            <MenuItem
              icon={<LogOut size={16} />}
              label="Se déconnecter"
              onClick={() => {
                onLogout()
                setOpen(false)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition ${
        danger
          ? 'text-danger-400 hover:bg-danger-500/10'
          : 'text-white/80 hover:bg-white/[0.05]'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
