import { createContext, useContext, useState } from 'react'
import { loginInstructor } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Saat pertama dibuka, cek apakah sebelumnya sudah login (data di localStorage)
    const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('instructor')
      const parsed = saved ? JSON.parse(saved) : null
      // Pakai hanya kalau bentuknya benar
      return parsed && parsed.id && parsed.name ? parsed : null
    } catch {
      return null
    }
  })

  const login = async (email, password) => {
    const data = await loginInstructor(email, password)
    setUser(data)
    localStorage.setItem('instructor', JSON.stringify(data))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('instructor')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}