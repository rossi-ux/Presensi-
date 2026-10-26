import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import useAttendanceData from '../hooks/useAttendanceData'
import { useManualAttendance } from '../context/AttendanceContext'
import { getToday } from '../data/attendance'
import { CLASSES } from '../data/classes'
import { countStatus } from '../utils/stats'
import Avatar from '../components/Avatar'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'

const OPTIONS = [
  { key: 'hadir', label: 'Hadir', active: 'border-emerald-500 bg-emerald-500 text-white' },
  { key: 'izin', label: 'Izin', active: 'border-sky-500 bg-sky-500 text-white' },
  { key: 'sakit', label: 'Sakit', active: 'border-amber-500 bg-amber-500 text-white' },
  { key: 'alpa', label: 'Alpa', active: 'border-red-500 bg-red-500 text-white' },
]

const idle =
  'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:[color-scheme:dark] dark:focus:ring-indigo-500/30'

function formatLongDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function TakeAttendance() {
  const { students, studentRecords, loading, error, reload } = useAttendanceData()
  const { overrides, setStatus, setManyStatus, removeStatus, clearAll } = useManualAttendance()

  const [date, setDate] = useState(getToday())
  const [classId, setClassId] = useState(CLASSES[0].id)
  const [search, setSearch] = useState('')

  const currentClass = CLASSES.find((c) => c.id === classId)

  // Murid pada kelas yang dipilih
  const classStudents = useMemo(
    () => students.filter((s) => s.classId === classId),
    [students, classId]
  )

  // Catatan kehadiran pada tanggal terpilih, dikelompokkan per murid
  const recordByStudent = useMemo(() => {
    const map = {}
    studentRecords.forEach((r) => {
      if (r.date === date) map[r.studentId] = r
    })
    return map
  }, [studentRecords, date])

  const visibleStudents = classStudents.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const dayRecords = classStudents.map((s) => recordByStudent[s.id]).filter(Boolean)
  const dayStats = countStatus(dayRecords)
  const notFilled = classStudents.length - dayRecords.length
  const isWeekend = [0, 6].includes(new Date(`${date}T00:00:00`).getDay())
  const manualCount = Object.keys(overrides).length

  const summary = [
    { label: 'Hadir', value: dayStats.hadir },
    { label: 'Izin', value: dayStats.izin },
    { label: 'Sakit', value: dayStats.sakit },
    { label: 'Alpa', value: dayStats.alpa },
    { label: 'Belum diisi', value: notFilled },
  ]

  const handleClearAll = () => {
    if (window.confirm('Hapus semua input manual (semua kelas) dan kembali ke data awal?')) {
      clearAll()
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold">Presensi Murid</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Pilih kelas, lalu catat kehadiran murid. Perubahan tersimpan otomatis dan langsung
            tampil di Dashboard dan Riwayat.
          </p>
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
            {/* Tab kelas */}
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {CLASSES.map((c) => {
                const active = c.id === classId
                const count = students.filter((s) => s.classId === c.id).length
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setClassId(c.id)
                      setSearch('')
                    }}
                    className={`rounded-2xl border p-4 text-left transition ${
                      active
                        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200 dark:bg-indigo-500/10 dark:ring-indigo-500/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <p className="font-semibold">{c.name}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {c.schedule} &middot; {count} murid
                    </p>
                  </button>
                )
              })}
            </section>

            {/* Kontrol: tanggal, cari, aksi cepat */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => e.target.value && setDate(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Cari murid
                  </label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Ketik nama..."
                    className={inputClass}
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setDate(getToday())}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
                  >
                    Hari ini
                  </button>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() =>
                      setManyStatus(
                        classStudents.map((s) => s.id),
                        date,
                        'hadir'
                      )
                    }
                    className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Semua hadir (kelas ini)
                  </button>
                </div>
              </div>

              <p className="mt-4 text-sm font-medium">
                {currentClass.name} &middot; {formatLongDate(date)}
              </p>
              {isWeekend && (
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  Tanggal ini akhir pekan (bukan hari kerja), tetapi tetap bisa diisi.
                </p>
              )}
            </section>

            {/* Ringkasan tanggal terpilih (kelas terpilih) */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
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

            {/* Daftar murid */}
            <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                {visibleStudents.length === 0 && (
                  <li className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                    Murid tidak ditemukan.
                  </li>
                )}

                {visibleStudents.map((s) => {
                  const rec = recordByStudent[s.id]

                  return (
                    <li
                      key={s.id}
                      className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                                                <Avatar src={s.image} name={s.name} />
                        <div>
                          <p className="font-medium">{s.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {rec ? (rec.manual ? 'Diisi manual' : 'Data awal') : 'Belum diisi'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {OPTIONS.map((o) => (
                          <button
                            key={o.key}
                            onClick={() => setStatus(s.id, date, o.key)}
                            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                              rec?.status === o.key ? o.active : idle
                            }`}
                          >
                            {o.label}
                          </button>
                        ))}

                        {rec?.manual && (
                          <button
                            onClick={() => removeStatus(s.id, date)}
                            title="Kembalikan ke data awal"
                            className="rounded-lg px-2 py-1.5 text-xs text-slate-500 underline hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                          >
                            Batalkan
                          </button>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>

            {manualCount > 0 && (
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>{manualCount} catatan diisi manual (semua kelas)</span>
                <button onClick={handleClearAll} className="underline hover:text-red-600">
                  Reset semua input manual
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}