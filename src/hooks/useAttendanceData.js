import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useManualAttendance } from '../context/AttendanceContext'
import { getStudents } from '../services/api'
import { generateAttendance, generateStudentsAttendance } from '../data/attendance'
import { assignClasses } from '../data/classes'
import { sanitizeRecords, VALID_STATUS } from '../utils/validators'

export default function useAttendanceData() {
  const { user } = useAuth()
  const { overrides } = useManualAttendance()

  const [rawStudents, setRawStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  // Ambil data murid; dijalankan ulang setiap "attempt" bertambah (tombol Coba lagi)
  useEffect(() => {
    let cancelled = false

    getStudents()
      .then((data) => {
        if (!cancelled) setRawStudents(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [attempt])

  const reload = useCallback(() => {
    setLoading(true)
    setError('')
    setAttempt((a) => a + 1)
  }, [])

  const students = useMemo(() => assignClasses(rawStudents), [rawStudents])

  const personalRecords = useMemo(() => sanitizeRecords(generateAttendance(user.id)), [user.id])

  const baseStudentRecords = useMemo(
    () => sanitizeRecords(generateStudentsAttendance(students)),
    [students]
  )

  // Data akhir = data awal + input manual (input manual menimpa data awal)
  const studentRecords = useMemo(() => {
    const merged = new Map()

    baseStudentRecords.forEach((r) => merged.set(`${r.studentId}|${r.date}`, r))

    Object.entries(overrides).forEach(([key, status]) => {
      if (!VALID_STATUS.includes(status)) return
      const [id, date] = key.split('|')
      const student = students.find((s) => s.id === Number(id))
      if (!student) return
      merged.set(key, {
        date,
        status,
        studentId: student.id,
        studentName: student.name,
        classId: student.classId,
        manual: true,
      })
    })

    return sanitizeRecords(Array.from(merged.values()))
  }, [baseStudentRecords, overrides, students])

  return { students, personalRecords, studentRecords, loading, error, reload }
}