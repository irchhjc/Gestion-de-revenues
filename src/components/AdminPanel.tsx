import { useState } from 'react'
import {
  AtSign,
  Key,
  MapPin,
  Shield,
  ShieldCheck,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import type { User } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  users: User[]
  currentUserId: string
  onDeleteUser: (id: string) => void
  onResetPassword: (id: string, pin: string) => Promise<boolean>
  onSetRole: (id: string, role: 'admin' | 'user') => void
}

export function AdminPanel({
  open,
  onClose,
  users,
  currentUserId,
  onDeleteUser,
  onResetPassword,
  onSetRole,
}: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-ink-800 rounded-t-3xl sm:rounded-3xl border-t sm:border border-white/10 max-h-[92vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-ink-800/95 backdrop-blur-xl z-10 px-5 pt-4 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-accent-400" />
              <h2 className="text-white font-bold text-lg">Gestion des utilisateurs</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
            >
              <X size={18} className="text-white/70" />
            </button>
          </div>
          <p className="text-white/50 text-xs mt-1 flex items-center gap-1.5">
            <Users size={11} />
            {users.length} utilisateur{users.length > 1 ? 's' : ''} enregistré
            {users.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="p-5 space-y-3">
          {users.map(u => (
            <UserCard
              key={u.id}
              user={u}
              isCurrent={u.id === currentUserId}
              onDelete={() => onDeleteUser(u.id)}
              onResetPassword={pin => onResetPassword(u.id, pin)}
              onSetRole={r => onSetRole(u.id, r)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function UserCard({
  user,
  isCurrent,
  onDelete,
  onResetPassword,
  onSetRole,
}: {
  user: User
  isCurrent: boolean
  onDelete: () => void
  onResetPassword: (pin: string) => Promise<boolean>
  onSetRole: (r: 'admin' | 'user') => void
}) {
  const [resetOpen, setResetOpen] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [busy, setBusy] = useState(false)

  const handleReset = async () => {
    if (newPin.length !== 8) return
    setBusy(true)
    const ok = await onResetPassword(newPin)
    setBusy(false)
    if (ok) {
      alert(`Nouveau mot de passe défini pour @${user.username}`)
      setNewPin('')
      setResetOpen(false)
    }
  }

  const initials = user.fullName
    .split(' ')
    .map(s => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">{initials || 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-white font-semibold text-sm truncate">{user.fullName}</div>
              {user.role === 'admin' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-accent-500/15 text-accent-400 text-[9px] font-bold uppercase">
                  <ShieldCheck size={9} />
                  Admin
                </span>
              )}
              {isCurrent && (
                <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-white/60 text-[9px] font-bold uppercase">
                  Vous
                </span>
              )}
            </div>
            <div className="text-white/50 text-xs mt-0.5">@{user.username}</div>
            <div className="flex items-center gap-1 text-white/40 text-[11px] mt-1.5">
              <AtSign size={10} />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-1 text-white/40 text-[11px] mt-0.5">
              <MapPin size={10} />
              <span className="truncate">{user.location}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setResetOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 text-white/80 text-xs font-medium active:scale-95 transition"
          >
            <Key size={13} />
            Réinitialiser PIN
          </button>
          {!isCurrent && (
            <>
              <button
                onClick={() => onSetRole(user.role === 'admin' ? 'user' : 'admin')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 text-white/80 text-xs font-medium active:scale-95 transition"
              >
                {user.role === 'admin' ? (
                  <>
                    <UserMinus size={13} />
                    Retirer admin
                  </>
                ) : (
                  <>
                    <UserPlus size={13} />
                    Promouvoir admin
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  if (
                    confirm(
                      `Supprimer @${user.username} et toutes ses données ? Action irréversible.`
                    )
                  ) {
                    onDelete()
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-danger-500/10 text-danger-400 text-xs font-medium active:scale-95 transition"
              >
                <Trash2 size={13} />
                Supprimer
              </button>
            </>
          )}
        </div>

        {resetOpen && (
          <div className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-fade-in">
            <label className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">
              Nouveau mot de passe (8 chiffres)
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                maxLength={8}
                placeholder="••••••••"
                className="input-base flex-1 tracking-[0.3em]"
              />
              <button
                onClick={handleReset}
                disabled={busy || newPin.length !== 8}
                className="btn-primary px-4 rounded-2xl disabled:opacity-40 disabled:shadow-none"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
