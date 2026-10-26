export default function EmptyState({ icon = '📭', title, description }) {
  return (
    <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <p className="text-3xl">{icon}</p>
      <h3 className="mt-2 font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
    </div>
  )
}