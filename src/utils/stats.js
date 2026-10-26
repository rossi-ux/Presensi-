import { VALID_STATUS } from './validators'

// Hitung jumlah tiap status. Catatan dengan status tidak dikenal diabaikan.
export function countStatus(records = []) {
  const result = { hadir: 0, izin: 0, sakit: 0, alpa: 0, total: 0 }
  records.forEach((r) => {
    if (r && VALID_STATUS.includes(r.status)) {
      result[r.status] += 1
      result.total += 1
    }
  })
  return result
}

// Persentase kehadiran = hadir / total x 100
export function getPercentage(records = []) {
  const { hadir, total } = countStatus(records)
  return total === 0 ? 0 : Math.round((hadir / total) * 100)
}

// Persentase kehadiran per tanggal (untuk grafik tren)
export function getDailyTrend(records = []) {
  const byDate = {}

  records.forEach((r) => {
    if (!r || !VALID_STATUS.includes(r.status)) return
    if (!byDate[r.date]) byDate[r.date] = { total: 0, hadir: 0 }
    byDate[r.date].total += 1
    if (r.status === 'hadir') byDate[r.date].hadir += 1
  })

  return Object.keys(byDate)
    .sort()
    .map((date) => ({
      date,
      label: `${date.slice(8, 10)}/${date.slice(5, 7)}`,
      percent: Math.round((byDate[date].hadir / byDate[date].total) * 100),
    }))
}