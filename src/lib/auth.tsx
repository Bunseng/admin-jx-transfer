import { createContext, type ReactNode, useContext, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface AdminUser {
  username: string
}

interface AuthContextValue {
  admin: AdminUser | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'transfer-admin.session'

// Demo LDAP bind — no directory server wired up yet, so this stands in for one.
// Swap loginWithLdap for a real call to your LDAP/AD bind endpoint when it's ready.
async function loginWithLdap(username: string, password: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const valid = username.trim().length > 0 && password === 'admin123'
  if (!valid) {
    throw new Error('Invalid LDAP username or password.')
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return stored ? { username: stored } : null
  })

  async function login(username: string, password: string) {
    await loginWithLdap(username, password)
    sessionStorage.setItem(STORAGE_KEY, username)
    setAdmin({ username })
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY)
    setAdmin(null)
  }

  return <AuthContext.Provider value={{ admin, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { admin } = useAuth()
  const location = useLocation()

  if (!admin) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
