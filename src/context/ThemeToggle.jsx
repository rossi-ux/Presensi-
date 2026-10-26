import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label="Ganti tema"
      title={theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-lg transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}