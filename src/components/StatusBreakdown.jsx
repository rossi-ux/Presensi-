const items = [
  { key: 'hadir', label: 'Hadir', style: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
  { key: 'izin', label: 'Izin', style: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400' },
  { key: 'sakit', label: 'Sakit', style: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' },
  { key: 'alpa', label: 'Alpa', style: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400' },
]

export default function StatusBreakdown({ title, stats }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <h3 className="mb-4 font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.key} className={`rounded-xl p-3 text-center ${item.style}`}>
            <p className="text-2xl font-bold">{stats[item.key]}</p>
            <p className="text-xs font-medium">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}