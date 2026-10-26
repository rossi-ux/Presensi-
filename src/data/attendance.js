// Status: 'hadir' | 'izin' | 'sakit' | 'alpa'

const DAYS_BACK = 30 // berapa hari ke belakang
const DAYS_AHEAD = 7 // berapa hari ke depan (data demo untuk presentasi)

// Ubah teks menjadi angka acak 0-1 yang SELALU sama untuk teks yang sama.
// Jadi status di tanggal tertentu tidak berubah walau halaman di-refresh
// atau dibuka di hari lain.
function hashToUnit(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  h ^= h >>> 13
  h = Math.imul(h, 0x5bd1e995)
  h ^= h >>> 15
  return (h >>> 0) / 4294967296
}

// Peluang status: 80% hadir, 8% izin, 7% sakit, 5% alpa
function pickStatus(r) {
  if (r < 0.8) return 'hadir'
  if (r < 0.88) return 'izin'
  if (r < 0.95) return 'sakit'
  return 'alpa'
}

// Format tanggal lokal menjadi "YYYY-MM-DD"
function formatDate(d) {
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

// Tanggal hari ini dalam format yang sama (dipakai untuk menandai data "mendatang")
export function getToday() {
  return formatDate(new Date())
}

// Daftar hari kerja (Senin-Jumat) dari N hari lalu sampai M hari ke depan
function getWorkdays(daysBack, daysAhead) {
  const dates = []
  const today = new Date()

  for (let i = -daysAhead; i < daysBack; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i) // i negatif = hari ke depan
    const dayOfWeek = d.getDay() // 0 = Minggu, 6 = Sabtu
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push(formatDate(d))
    }
  }
  return dates
}

// Absensi untuk SATU orang (dipakai untuk instruktur)
export function generateAttendance(personId, daysBack = DAYS_BACK, daysAhead = DAYS_AHEAD) {
  return getWorkdays(daysBack, daysAhead).map((date) => ({
    date,
    status: pickStatus(hashToUnit(`${personId}-${date}`)),
  }))
}

// Absensi untuk SEMUA murid (digabung jadi satu array)
export function generateStudentsAttendance(
  students,
  daysBack = DAYS_BACK,
  daysAhead = DAYS_AHEAD
) {
  return students.flatMap((student) =>
    generateAttendance(student.id, daysBack, daysAhead).map((record) => ({
      ...record,
      studentId: student.id,
      studentName: student.name,
      classId: student.classId,
    }))
  )
}