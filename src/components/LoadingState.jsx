export default function LoadingState({ text = 'Memuat data...' }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500 dark:text-slate-400"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
      <p className="text-sm">{text}</p>
    </div>
  )
}