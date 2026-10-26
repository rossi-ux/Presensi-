export const EMPTY_FILTERS = {
  status: 'semua',
  from: '',
  to: '',
  studentId: 'semua',
  classId: 'semua',
}

// Tanggal "dari" tidak boleh lebih besar dari tanggal "sampai"
export function isInvalidRange(from, to) {
  return Boolean(from && to && from > to)
}

export function filterByClass(records, classId) {
  return classId === 'semua' ? records : records.filter((r) => r.classId === classId)
}

// tab: 'personal' | 'students'
export function filterHistory(records, filters, tab) {
  if (isInvalidRange(filters.from, filters.to)) return []

  return records
    .filter((r) => filters.status === 'semua' || r.status === filters.status)
    .filter((r) => !filters.from || r.date >= filters.from)
    .filter((r) => !filters.to || r.date <= filters.to)
    .filter((r) => tab === 'personal' || filters.classId === 'semua' || r.classId === filters.classId)
    .filter(
      (r) =>
        tab === 'personal' ||
        filters.studentId === 'semua' ||
        r.studentId === Number(filters.studentId)
    )
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) || (a.studentName || '').localeCompare(b.studentName || '')
    )
}