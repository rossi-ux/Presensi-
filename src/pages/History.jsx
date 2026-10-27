import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import HistoryTable from '../components/HistoryTable'
import PrintReport from '../components/PrintReport'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import useAttendanceData from '../hooks/useAttendanceData'
import { CLASSES } from '../data/classes'
import { countStatus, getPercentage } from '../utils/stats'
import {
  EMPTY_FILTERS,
  filterHistory,
  getAvailableYears,
  isInvalidRange,
} from '../utils/filters'
import { MONTHS, getMonthRange, getMonthYear } from '../utils/dates'
import { buildReport } from '../utils/report'
import { printReport } from '../utils/print'

const tabs = [
  { key: 'personal', label: 'Riwayat Saya' },
  { key: 'students', label: 'Riwayat Murid' },
]

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:[color-scheme:dark] dark:focus:ring-indigo-500/30'

const labelClass = 'mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400'

export default function History() {
  const { user } = useAuth()
  const { students, personalRecords, studentRecords, loading, error, reload } =
    useAttendanceData()

  const [tab, setTab] = useState('personal')
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [page, setPage] = useState(1)

  const sourceRecords = tab === 'personal' ? personalRecords : studentRecords

  const updateFilter = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      // Kalau kelas berganti, pilihan murid ikut di-reset
      ...(name === 'classId' ? { studentId: 'semua' } : {}),
    }))
    setPage(1)
  }

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS)
    setPage(1)
  }

  const changeTab = (key) => {
    setTab(key)
    resetFilters()
  }

  // --- Bulan dan Tahun: tersinkron dengan "Dari tanggal" dan "Sampai tanggal" ---
  const monthYear = getMonthYear(filters.from, filters.to)
  const selectedMonth = monthYear ? monthYear.month : ''
  const selectedYear = monthYear ? monthYear.year : ''
  const years = useMemo(() => getAvailableYears(sourceRecords), [sourceRecords])

  const applyMonthYear = (month, year) => {
    const { from, to } = getMonthRange(year, month)
    setFilters((prev) => ({ ...prev, from, to }))
    setPage(1)
  }

  const clearPeriod = () => {
    setFilters((prev) => ({ ...prev, from: '', to: '' }))
    setPage(1)
  }

  const handleMonthChange = (value) => {
    if (!value) return clearPeriod()
    applyMonthYear(Number(value), monthYear?.year ?? new Date().getFullYear())
  }

  const handleYearChange = (value) => {
    if (!value) return clearPeriod()
    applyMonthYear(monthYear?.month ?? new Date().getMonth() + 1, Number(value))
  }

  const filtered = useMemo(
    () => filterHistory(sourceRecords, filters, tab),
    [sourceRecords, filters, tab]
  )

  const stats = countStatus(filtered)
  const invalidRange = isInvalidRange(filters.from, filters.to)

  const studentOptions = students.filter(
    (s) => filters.classId === 'semua' || s.classId === filters.classId
  )

  const summary = [
    { label: 'Total', value: stats.total },
    { label: 'Hadir', value: stats.hadir },
    { label: 'Izin', value: stats.izin },
    { label: 'Sakit', value: stats.sakit },
    { label: 'Alpa', value: stats.alpa },
    { label: 'Kehadiran', value: `${getPercentage(filtered)}%` },
  ]

  // Data laporan cetak (semua hasil filter, bukan hanya satu halaman tabel)
  const report = useMemo(
    () => buildReport({ records: filtered, filters, tab, instructorName: user.name }),
    [filtered, filters, tab, user.name]
  )

  const canPrint = filtered.length > 0 && !invalidRange

  return (
    <>
      {/* Tampilan layar (disembunyikan saat mencetak) */}
      <div className="min-h-screen print:hidden">
        <Navbar />

        <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Riwayat Kehadiran</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Lihat dan filter riwayat kehadiran Anda atau murid.
              </p>
            </div>

            <button
              onClick={() => printReport(report.fileTitle)}
              disabled={!canPrint}
              title={canPrint ? 'Cetak laporan sesuai filter' : 'Tidak ada data untuk dicetak'}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              🖨️ Cetak PDF
            </button>
          </div>

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : students.length === 0 ? (
            <EmptyState
              title="Belum ada data murid"
              description="Data murid tidak tersedia dari server."
            />
          ) : (
            <>
              {/* Tab */}
              <div className="inline-flex rounded-xl bg-slate-200 p-1 dark:bg-slate-800">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => changeTab(t.key)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      tab === t.key
                        ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-300'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Filter */}
              <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {tab === 'students' && (
                    <>
                      <div>
                        <label className={labelClass}>Kelas</label>
                        <select
                          value={filters.classId}
                          onChange={(e) => updateFilter('classId', e.target.value)}
                          className={inputClass}
                        >
                          <option value="semua">Semua kelas</option>
                          {CLASSES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>Murid</label>
                        <select
                          value={filters.studentId}
                          onChange={(e) => updateFilter('studentId', e.target.value)}
                          className={inputClass}
                        >
                          <option value="semua">Semua murid</option>
                          {studentOptions.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => updateFilter('status', e.target.value)}
                      className={inputClass}
                    >
                      <option value="semua">Semua status</option>
                      <option value="hadir">Hadir</option>
                      <option value="izin">Izin</option>
                      <option value="sakit">Sakit</option>
                      <option value="alpa">Alpa</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Bulan</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => handleMonthChange(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Semua bulan</option>
                      {MONTHS.map((m, i) => (
                        <option key={m} value={i + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Tahun</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => handleYearChange(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Semua tahun</option>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Dari tanggal</label>
                    <input
                      type="date"
                      value={filters.from}
                      onChange={(e) => updateFilter('from', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Sampai tanggal</label>
                    <input
                      type="date"
                      value={filters.to}
                      onChange={(e) => updateFilter('to', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={resetFilters}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
                    >
                      Reset filter
                    </button>
                  </div>
                </div>

                {invalidRange && (
                  <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                    Rentang tanggal tidak valid: tanggal awal lebih besar dari tanggal akhir.
                  </p>
                )}

                <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                  Laporan PDF mengikuti filter yang sedang aktif (kelas, murid, status, dan
                  periode).
                </p>
              </section>

              {/* Ringkasan hasil filter */}
              <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {summary.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
                  >
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                  </div>
                ))}
              </section>

              {/* Tabel */}
              <HistoryTable
                records={filtered}
                showStudent={tab === 'students'}
                page={page}
                onPageChange={setPage}
              />
            </>
          )}
        </main>
      </div>

      {/* Tampilan cetak (hanya muncul saat mencetak) */}
      {!loading && !error && <PrintReport report={report} />}
    </>
  )
}