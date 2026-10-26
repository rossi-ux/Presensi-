export default function ErrorState({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="rounded-2xl bg-red-50 p-8 text-center ring-1 ring-red-200 dark:bg-red-500/10 dark:ring-red-500/30"
    >
      <p className="text-3xl">⚠️</p>
      <h3 className="mt-2 font-semibold text-red-700 dark:text-red-400">Terjadi kesalahan</h3>
      <p className="mt-1 text-sm text-red-600 dark:text-red-300">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Coba lagi
        </button>
      )}
    </div>
  )
}