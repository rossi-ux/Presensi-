import { countStatus, getPercentage } from './stats'
import { getClassName } from '../data/classes'
import { formatDateTimeNow, formatPeriod } from './dates'

// Susun semua data yang dibutuhkan laporan dari hasil filter
export function buildReport({ records, filters, tab, instructorName }) {
  const isStudents = tab === 'students'
  const dates = records.map((r) => r.date).sort()

  // Periode mengikuti filter tanggal; kalau kosong, pakai rentang data yang ada
  const hasPeriodFilter = Boolean(filters.from || filters.to)
  const period = hasPeriodFilter
    ? formatPeriod(filters.from, filters.to)
    : dates.length
      ? formatPeriod(dates[0], dates[dates.length - 1])
      : '-'

  const stats = countStatus(records)
  const percent = getPercentage(records)

  // Rincian: urut tanggal naik, lalu nama
  const rows = [...records]
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) || (a.studentName || '').localeCompare(b.studentName || '')
    )
    .map((r) => ({ ...r, className: r.classId ? getClassName(r.classId) : '' }))

  // Rekap per murid (hanya untuk laporan murid)
  const perStudent = []
  if (isStudents) {
    const groups = new Map()
    records.forEach((r) => {
      if (!groups.has(r.studentId)) groups.set(r.studentId, [])
      groups.get(r.studentId).push(r)
    })
    groups.forEach((list) => {
      const first = list[0]
      perStudent.push({
        studentId: first.studentId,
        name: first.studentName,
        className: getClassName(first.classId),
        ...countStatus(list),
        percent: getPercentage(list),
      })
    })
    perStudent.sort((a, b) => a.name.localeCompare(b.name))
  }

  const classLabel =
    filters.classId === 'semua' ? 'Semua kelas' : getClassName(filters.classId)
  const studentLabel =
    filters.studentId === 'semua'
      ? 'Semua murid'
      : (records.find((r) => String(r.studentId) === String(filters.studentId))?.studentName ??
        '-')
  const statusLabel =
    filters.status === 'semua'
      ? 'Semua status'
      : filters.status.charAt(0).toUpperCase() + filters.status.slice(1)

  const title = isStudents ? 'Laporan Presensi Murid' : 'Laporan Presensi Instruktur'

  return {
    isStudents,
    title,
    fileTitle: `${title} - ${period}`, // dipakai sebagai nama file PDF
    period,
    classLabel,
    studentLabel,
    statusLabel,
    instructorName,
    generatedAt: formatDateTimeNow(),
    stats,
    percent,
    perStudent,
    rows,
  }
}