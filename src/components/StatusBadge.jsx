const styles = {
  hadir: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  izin: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400',
  sakit: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  alpa: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  )
}