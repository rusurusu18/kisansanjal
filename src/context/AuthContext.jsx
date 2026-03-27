import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadDB, saveDB } from '../data/storage.js'
import { uid } from '../utils/format.js'

const AuthContext = createContext(null)

const AUTH_KEY = 'kisanSanjalAuth_v1'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_KEY)
    if (raw) setUser(JSON.parse(raw))
  }, [])

  const login = async ({ email, password }) => {
    const db = loadDB()
    const found = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!found) throw new Error('Invalid email or password')
    const safe = { id: found.id, name: found.name, email: found.email, role: found.role, verified: found.verified ?? true }
    localStorage.setItem(AUTH_KEY, JSON.stringify(safe))
    setUser(safe)
    return safe
  }

  const logout = () => {
    localStorage.removeItem(AUTH_KEY)
    setUser(null)
  }

  const register = async ({ name, email, password, role, extra }) => {
    const db = loadDB()
    const exists = db.users.some(u => u.email.toLowerCase() === email.toLowerCase())
    if (exists) throw new Error('Email already registered')

    const newUser = {
      id: uid('u'),
      name,
      email,
      password,
      role,
      verified: role === 'admin' ? true : false, // admin must verify farmer/buyer by default
      ...extra,
    }
    db.users.push(newUser)
    saveDB(db)

    // auto-login after registration (still shows verification if needed)
    const safe = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, verified: newUser.verified }
    localStorage.setItem(AUTH_KEY, JSON.stringify(safe))
    setUser(safe)
    return safe
  }

  const value = useMemo(() => ({ user, login, logout, register }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
