import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import Avatar from './Avatar'

// NavLink memberi tahu kita menu mana yang sedang aktif (isActive)
const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
    isActive
      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
  }`

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          <span className="hidden font-bold text-indigo-600 dark:text-indigo-400 md:inline">
            Presensi Muridku 
          </span>

          <nav className="flex gap-1 md:ml-4">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/presensi" className={linkClass}>
              Presensi
            </NavLink>
            <NavLink to="/riwayat" className={linkClass}>
              Riwayat
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
                    <Avatar src={user.image} name={user.name} size="h-9 w-9" />
          <div className="hidden leading-tight lg:block">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Instruktur</p>
          </div>
          <button
            onClick={logout}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            Keluar
          </button>
        </div>
      </div>
    </header>
  )
}