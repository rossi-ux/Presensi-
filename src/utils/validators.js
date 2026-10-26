export const VALID_STATUS = ['hadir', 'izin', 'sakit', 'alpa']

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

// Catatan absensi valid: tanggal berformat YYYY-MM-DD dan status yang dikenal
export function isValidRecord(r) {
  return Boolean(r) && DATE_PATTERN.test(r.date) && VALID_STATUS.includes(r.status)
}

// Buang catatan yang rusak agar tidak merusak perhitungan dan tampilan
export function sanitizeRecords(records) {
  return Array.isArray(records) ? records.filter(isValidRecord) : []
}