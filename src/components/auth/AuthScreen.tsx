import { useState } from 'react'
import {
  AtSign,
  Eye,
  EyeOff,
  Lock,
  MapPin,
  ShieldCheck,
  User as UserIcon,
  UserPlus,
} from 'lucide-react'
import type { RegisterInput } from '../../hooks/useAuth'

type Mode = 'login' | 'register'

interface Props {
  hasUsers: boolean
  error: string | null
  onLogin: (username: string, password: string) => Promise<boolean>
  onRegister: (data: RegisterInput) => Promise<boolean>
  onClearError: () => void
}

export function AuthScreen({ hasUsers, error, onLogin, onRegister, onClearError }: Props) {
  const [mode, setMode] = useState<Mode>(hasUsers ? 'login' : 'register')

  return (
    <div className="min-h-dvh max-w-md mx-auto px-6 pt-12 pb-8 flex flex-col safe-top safe-bottom">
      <div className="flex flex-col items-center text-center mb-8 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-accent-400 to-accent-600 shadow-glow flex items-center justify-center">
          <ShieldCheck size={30} className="text-white" />
        </div>
        <h1 className="mt-4 text-white text-2xl font-extrabold tracking-tight">Mon Budget</h1>
        <p className="text-white/50 text-sm mt-1">
          {mode === 'login'
            ? 'Connectez-vous pour accéder à vos finances'
            : hasUsers
            ? 'Créez votre compte personnel'
            : 'Créez le premier compte (administrateur)'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.04] rounded-2xl mb-6">
        <button
          onClick={() => {
            setMode('login')
            onClearError()
          }}
          className={`py-3 rounded-xl font-semibold text-sm transition ${
            mode === 'login'
              ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-card'
              : 'text-white/50'
          }`}
        >
          Connexion
        </button>
        <button
          onClick={() => {
            setMode('register')
            onClearError()
          }}
          className={`py-3 rounded-xl font-semibold text-sm transition ${
            mode === 'register'
              ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-card'
              : 'text-white/50'
          }`}
        >
          Inscription
        </button>
      </div>

      {mode === 'login' ? (
        <LoginForm onLogin={onLogin} error={error} onClearError={onClearError} />
      ) : (
        <RegisterForm
          onRegister={onRegister}
          error={error}
          onClearError={onClearError}
          isFirst={!hasUsers}
        />
      )}
    </div>
  )
}

function LoginForm({
  onLogin,
  error,
  onClearError,
}: {
  onLogin: (u: string, p: string) => Promise<boolean>
  error: string | null
  onClearError: () => void
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    await onLogin(username, password)
    setBusy(false)
  }

  return (
    <form onSubmit={submit} className="space-y-4 animate-fade-in">
      <Field icon={<UserIcon size={16} />} label="Nom d’utilisateur">
        <input
          type="text"
          value={username}
          onChange={e => {
            setUsername(e.target.value)
            onClearError()
          }}
          placeholder="ex : irchhjc"
          autoCapitalize="none"
          autoComplete="username"
          className="input-base"
        />
      </Field>

      <Field icon={<Lock size={16} />} label="Mot de passe (8 chiffres)">
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={password}
            onChange={e => {
              setPassword(e.target.value.replace(/\D/g, '').slice(0, 8))
              onClearError()
            }}
            inputMode="numeric"
            placeholder="••••••••"
            maxLength={8}
            autoComplete="current-password"
            className="input-base pr-12 tracking-[0.4em]"
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white/80"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Field>

      {error && <ErrorBox message={error} />}

      <button
        type="submit"
        disabled={busy || !username || password.length !== 8}
        className="w-full btn-primary rounded-2xl py-4 disabled:opacity-40 disabled:shadow-none"
      >
        {busy ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  )
}

function RegisterForm({
  onRegister,
  error,
  onClearError,
  isFirst,
}: {
  onRegister: (d: RegisterInput) => Promise<boolean>
  error: string | null
  onClearError: () => void
  isFirst: boolean
}) {
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)

  const pinValid = password.length === 8 && password === confirm

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    if (password !== confirm) {
      alert('Les mots de passe ne correspondent pas')
      return
    }
    setBusy(true)
    await onRegister({ username, fullName, email, location, password })
    setBusy(false)
  }

  return (
    <form onSubmit={submit} className="space-y-4 animate-fade-in">
      {isFirst && (
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-accent-500/10 border border-accent-500/30">
          <ShieldCheck size={16} className="text-accent-400 shrink-0" />
          <p className="text-accent-400 text-xs">
            Ce compte sera l’<strong>administrateur</strong> de l’application
          </p>
        </div>
      )}

      <Field icon={<UserIcon size={16} />} label="Nom d’utilisateur">
        <input
          type="text"
          value={username}
          onChange={e => {
            setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))
            onClearError()
          }}
          placeholder="ex : marie_dupont"
          autoCapitalize="none"
          autoComplete="username"
          className="input-base"
        />
      </Field>

      <Field icon={<UserPlus size={16} />} label="Nom complet">
        <input
          type="text"
          value={fullName}
          onChange={e => {
            setFullName(e.target.value)
            onClearError()
          }}
          placeholder="ex : Marie Dupont"
          autoComplete="name"
          className="input-base"
        />
      </Field>

      <Field icon={<AtSign size={16} />} label="Adresse email">
        <input
          type="email"
          value={email}
          onChange={e => {
            setEmail(e.target.value)
            onClearError()
          }}
          placeholder="ex : marie@email.com"
          autoCapitalize="none"
          autoComplete="email"
          className="input-base"
        />
      </Field>

      <Field icon={<MapPin size={16} />} label="Localisation">
        <input
          type="text"
          value={location}
          onChange={e => {
            setLocation(e.target.value)
            onClearError()
          }}
          placeholder="ex : Yaoundé, Cameroun"
          autoComplete="address-level2"
          className="input-base"
        />
      </Field>

      <Field icon={<Lock size={16} />} label="Mot de passe (8 chiffres)">
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={password}
            onChange={e => {
              setPassword(e.target.value.replace(/\D/g, '').slice(0, 8))
              onClearError()
            }}
            inputMode="numeric"
            placeholder="••••••••"
            maxLength={8}
            className="input-base pr-12 tracking-[0.4em]"
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white/80"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Field>

      <Field icon={<Lock size={16} />} label="Confirmer le mot de passe">
        <input
          type={show ? 'text' : 'password'}
          value={confirm}
          onChange={e => setConfirm(e.target.value.replace(/\D/g, '').slice(0, 8))}
          inputMode="numeric"
          placeholder="••••••••"
          maxLength={8}
          className="input-base tracking-[0.4em]"
        />
      </Field>

      {error && <ErrorBox message={error} />}

      <button
        type="submit"
        disabled={busy || !pinValid || !username || !fullName || !email || !location}
        className="w-full btn-primary rounded-2xl py-4 disabled:opacity-40 disabled:shadow-none"
      >
        {busy ? 'Création...' : 'Créer mon compte'}
      </button>
    </form>
  )
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-white/60 text-xs font-semibold uppercase tracking-wider px-1 mb-2">
        <span className="text-white/40">{icon}</span>
        <span>{label}</span>
      </label>
      {children}
    </div>
  )
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-2xl bg-danger-500/10 border border-danger-500/30 px-4 py-3">
      <p className="text-danger-400 text-sm font-medium">{message}</p>
    </div>
  )
}
