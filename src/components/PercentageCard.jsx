export default function PercentageCard({ title, percent, note }) {
  const barColor =
    percent >= 85 ? 'bg-emerald-500' : percent >= 70 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <div className="flex items-end justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-bold">{percent}%</p>
      </div>

      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{note}</p>
    </div>
  )
}