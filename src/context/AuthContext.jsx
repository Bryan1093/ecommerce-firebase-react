import { createContext, useContext, useMemo, useState } from 'react'

const AUTH_STORAGE_KEY = 'ecommerceSessionV2'

const AuthContext = createContext(null)

const demoProfiles = {
  admin: {
    id: 'admin-1',
    name: 'Bryan Admin',
    email: 'admin@mitienda.demo',
    role: 'admin',
  },
  customer: {
    id: 'customer-1',
    name: 'Laura Gómez',
    email: 'laura@demo.com',
    role: 'customer',
  },
}

function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const storedValue = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!storedValue) {
      return demoProfiles.admin
    }

    try {
      const parsed = JSON.parse(storedValue)
      return parsed?.role ? parsed : demoProfiles.admin
    } catch {
      return demoProfiles.admin
    }
  })

  const loginAs = (role) => {
    const profile = demoProfiles[role] ?? demoProfiles.customer
    setSession(profile)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile))
  }

  const logout = () => {
    setSession(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      session,
      user: session,
      isAuthenticated: Boolean(session),
      isAdmin: session?.role === 'admin',
      loginAs,
      logout,
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

export { AuthProvider, useAuth }
