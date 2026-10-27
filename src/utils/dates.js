export const MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

const pad = (n) => String(n).padStart(2, '0')

export function parseDate(str) {
  return new Date(`${str}T00:00:00`)
}

// "26 Oktober 2026"
export function formatDateLong(str) {
  const d = parseDate(str)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

// "Senin, 26 Oktober 2026"
export function formatDateWithDay(str) {
  return parseDate(str).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// "27 Oktober 2026, 14.05"
export function formatDateTimeNow(date = new Date()) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${pad(
    date.getHours()
  )}.${pad(date.getMinutes())}`
}

// Tanggal awal dan akhir satu bulan (month: 1-12)
export function getMonthRange(year, month) {
  const last = new Date(year, month, 0).getDate()
  return {
    from: `${year}-${pad(month)}-01`,
    to: `${year}-${pad(month)}-${pad(last)}`,
  }
}

// Kalau rentang persis satu bulan penuh, kembalikan { month, year }, kalau tidak null
export function getMonthYear(from, to) {
  if (!from || !to) return null
  const d = parseDate(from)
  const range = getMonthRange(d.getFullYear(), d.getMonth() + 1)
  return range.from === from && range.to === to
    ? { month: d.getMonth() + 1, year: d.getFullYear() }
    : null
}

// Teks periode: "Oktober 2026" atau "1 Oktober 2026 – 15 Oktober 2026"
export function formatPeriod(from, to) {
  const monthYear = getMonthYear(from, to)
  if (monthYear) return `${MONTHS[monthYear.month - 1]} ${monthYear.year}`
  if (from && to) {
    return from === to ? formatDateLong(from) : `${formatDateLong(from)} – ${formatDateLong(to)}`
  }
  if (from) return `Sejak ${formatDateLong(from)}`
  if (to) return `Hingga ${formatDateLong(to)}`
  return ''
}