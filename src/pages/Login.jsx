import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'

const REMEMBER_KEY = 'remembered_email'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  // Kalau ada email tersimpan, langsung isi form dan centang "Ingat saya"
  const savedEmail = localStorage.getItem(REMEMBER_KEY) || ''

  const [email, setEmail] = useState(savedEmail)
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(Boolean(savedEmail))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)

      // Simpan atau hapus email sesuai pilihan "Ingat saya"
      if (remember) {
        localStorage.setItem(REMEMBER_KEY, email.trim())
      } else {
        localStorage.removeItem(REMEMBER_KEY)
      }

      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-400 p-4 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-800">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-800">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-2xl dark:bg-indigo-500/20">
            📋
          </div>
          <h1 className="text-2xl font-bold">Instructor Attendance</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Masuk untuk melihat data kehadiran
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="instruktur@email.com"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:placeholder:text-slate-400 dark:focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:placeholder:text-slate-400 dark:focus:ring-indigo-500/30"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
            />
            Ingat saya
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}