import StatusBadge from './StatusBadge'
import { getClassName } from '../data/classes'
import { getToday } from '../data/attendance'

const PAGE_SIZE = 10

function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function HistoryTable({ records, showStudent, page, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const rows = records.slice(start, start + PAGE_SIZE)
  const today = getToday()

  const th = 'px-5 py-3 font-semibold'

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-700/50 dark:text-slate-400">
            <tr>
              <th className={th}>No</th>
              <th className={th}>Tanggal</th>
              {showStudent && <th className={th}>Nama Murid</th>}
              <th className={th}>Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={showStudent ? 4 : 3}
                  className="px-5 py-10 text-center text-slate-500 dark:text-slate-400"
                >
                  Tidak ada data yang sesuai dengan filter.
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr
                  key={`${r.studentId ?? 'me'}-${r.date}`}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/40"
                >
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{start + i + 1}</td>

                  {/* Tanggal + label "Mendatang" */}
                  <td className="px-5 py-3">
                    {formatDate(r.date)}
                    {r.date > today && (
                      <span className="ml-2 rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                        Mendatang
                      </span>
                    )}
                  </td>

                  {/* Nama murid + nama kelas */}
                  {showStudent && (
                    <td className="px-5 py-3 font-medium">
                      {r.studentName}
                      <span className="ml-2 text-xs font-normal text-slate-400 dark:text-slate-500">
                        {getClassName(r.classId)}
                      </span>
                    </td>
                  )}

                  {/* Status + label "Manual" */}
                  <td className="px-5 py-3">
                    <StatusBadge status={r.status} />
                    {r.manual && (
                      <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">
                        Manual
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginasi */}
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm dark:border-slate-700">
        <span className="text-slate-500 dark:text-slate-400">
          Halaman {currentPage} dari {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            Sebelumnya
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  )
}