import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import useAttendanceData from '../hooks/useAttendanceData'
import { CLASSES, getClassName } from '../data/classes'
import { countStatus, getPercentage, getDailyTrend } from '../utils/stats'
import { filterByClass } from '../utils/filters'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import PercentageCard from '../components/PercentageCard'
import StatusBreakdown from '../components/StatusBreakdown'
import StatusPieChart from '../components/StatusPieChart'
import TrendChart from '../components/TrendChart'
import ClassBarChart from '../components/ClassBarChart'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'

export default function Dashboard() {
  const { user } = useAuth()
  const { students, personalRecords, studentRecords, loading, error, reload } =
    useAttendanceData()

  const [classId, setClassId] = useState('semua')

  // Data murid disaring sesuai kelas yang dipilih
  const scopedStudents = useMemo(
    () => (classId === 'semua' ? students : students.filter((s) => s.classId === classId)),
    [students, classId]
  )
  const scopedRecords = useMemo(
    () => filterByClass(studentRecords, classId),
    [studentRecords, classId]
  )

  // Perbandingan semua kelas (tidak terpengaruh filter)
  const classComparison = useMemo(
    () =>
      CLASSES.map((c) => ({
        name: c.short,
        percent: getPercentage(filterByClass(studentRecords, c.id)),
      })),
    [studentRecords]
  )

  const personalStats = countStatus(personalRecords)
  const studentStats = countStatus(scopedRecords)
  const trend = useMemo(() => getDailyTrend(scopedRecords), [scopedRecords])

  const scopeLabel = classId === 'semua' ? 'Semua Kelas' : getClassName(classId)

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Halo, {user.name} 👋</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Ringkasan kehadiran Anda dan murid: 30 hari terakhir hingga 7 hari ke depan.
            </p>
          </div>

          <div className="sm:w-64">
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Kelas
            </label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:focus:ring-indigo-500/30"
            >
              <option value="semua">Semua kelas</option>
              {CLASSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
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
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Hari Hadir Saya"
                value={personalStats.hadir}
                subtitle={`dari ${personalStats.total} hari kerja`}
                icon="🧑‍🏫"
                accent="bg-indigo-100 dark:bg-indigo-500/20"
              />
              <StatCard
                title="Jumlah Murid"
                value={scopedStudents.length}
                subtitle={scopeLabel}
                icon="🎓"
                accent="bg-sky-100 dark:bg-sky-500/20"
              />
              <StatCard
                title="Total Absensi Murid"
                value={studentStats.total}
                subtitle="catatan kehadiran"
                icon="🗂️"
                accent="bg-amber-100 dark:bg-amber-500/20"
              />
              <StatCard
                title="Total Murid Hadir"
                value={studentStats.hadir}
                subtitle="catatan berstatus hadir"
                icon="✅"
                accent="bg-emerald-100 dark:bg-emerald-500/20"
              />
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <PercentageCard
                title="Persentase Kehadiran Saya"
                percent={getPercentage(personalRecords)}
                note={`${personalStats.hadir} hadir dari ${personalStats.total} hari`}
              />
              <PercentageCard
                title={`Persentase Kehadiran Murid (${scopeLabel})`}
                percent={getPercentage(scopedRecords)}
                note={`${studentStats.hadir} hadir dari ${studentStats.total} catatan`}
              />
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <StatusBreakdown title="Rincian Kehadiran Saya" stats={personalStats} />
              <StatusBreakdown
                title={`Rincian Kehadiran Murid (${scopeLabel})`}
                stats={studentStats}
              />
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <StatusPieChart title="Distribusi Status Saya" stats={personalStats} />
              <StatusPieChart
                title={`Distribusi Status Murid (${scopeLabel})`}
                stats={studentStats}
              />
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ClassBarChart data={classComparison} />
              <TrendChart data={trend} />
            </section>
          </>
        )}
      </main>
    </div>
  )
}