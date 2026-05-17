import { useCallback, useEffect, useState } from 'react'
import type { User } from '../types'
import {
  generateSalt,
  hashPassword,
  isValidEmail,
  isValidPin,
  loadSession,
  loadUsers,
  saveSession,
  saveUsers,
} from '../utils/auth'
import { clearUserData } from '../utils/storage'

export interface RegisterInput {
  username: string
  fullName: string
  email: string
  location: string
  password: string
}

export function useAuth() {
  const [users, setUsers] = useState<User[]>(() => loadUsers())
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const session = loadSession()
    if (!session) return null
    return loadUsers().find(u => u.id === session.userId) || null
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    saveUsers(users)
  }, [users])

  const register = useCallback(
    async (data: RegisterInput): Promise<boolean> => {
      setError(null)
      const username = data.username.trim().toLowerCase()
      const fullName = data.fullName.trim()
      const email = data.email.trim()
      const location = data.location.trim()

      if (!username) return setError('Nom d’utilisateur requis'), false
      if (username.length < 3) return setError('Nom d’utilisateur trop court (3 min)'), false
      if (!/^[a-z0-9_.-]+$/.test(username))
        return setError('Caractères autorisés : a-z 0-9 . _ -'), false
      if (!fullName) return setError('Nom complet requis'), false
      if (!isValidEmail(email)) return setError('Adresse email invalide'), false
      if (!location) return setError('Localisation requise'), false
      if (!isValidPin(data.password))
        return setError('Mot de passe : exactement 8 chiffres'), false
      if (users.some(u => u.username === username))
        return setError('Ce nom d’utilisateur existe déjà'), false
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase()))
        return setError('Cette adresse email est déjà utilisée'), false

      const salt = generateSalt()
      const passwordHash = await hashPassword(data.password, salt)
      const isFirst = users.length === 0
      const user: User = {
        id: crypto.randomUUID(),
        username,
        fullName,
        email,
        location,
        passwordHash,
        salt,
        role: isFirst ? 'admin' : 'user',
        createdAt: Date.now(),
      }
      setUsers(prev => [...prev, user])
      saveSession({ userId: user.id, startedAt: Date.now() })
      setCurrentUser(user)
      return true
    },
    [users]
  )

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      setError(null)
      const u = users.find(x => x.username === username.trim().toLowerCase())
      if (!u) return setError('Utilisateur introuvable'), false
      if (!isValidPin(password)) return setError('Le mot de passe est 8 chiffres'), false
      const hash = await hashPassword(password, u.salt)
      if (hash !== u.passwordHash) return setError('Mot de passe incorrect'), false
      saveSession({ userId: u.id, startedAt: Date.now() })
      setCurrentUser(u)
      return true
    },
    [users]
  )

  const logout = useCallback(() => {
    saveSession(null)
    setCurrentUser(null)
  }, [])

  const deleteUser = useCallback(
    (id: string) => {
      setUsers(prev => prev.filter(u => u.id !== id))
      clearUserData(id)
      if (currentUser?.id === id) {
        saveSession(null)
        setCurrentUser(null)
      }
    },
    [currentUser]
  )

  const resetPassword = useCallback(
    async (id: string, newPassword: string): Promise<boolean> => {
      if (!isValidPin(newPassword)) return false
      const u = users.find(x => x.id === id)
      if (!u) return false
      const salt = generateSalt()
      const passwordHash = await hashPassword(newPassword, salt)
      setUsers(prev => prev.map(x => (x.id === id ? { ...x, passwordHash, salt } : x)))
      return true
    },
    [users]
  )

  const setRole = useCallback((id: string, role: 'admin' | 'user') => {
    setUsers(prev => prev.map(x => (x.id === id ? { ...x, role } : x)))
    setCurrentUser(c => (c && c.id === id ? { ...c, role } : c))
  }, [])

  return {
    users,
    currentUser,
    error,
    clearError: () => setError(null),
    register,
    login,
    logout,
    deleteUser,
    resetPassword,
    setRole,
  }
}
