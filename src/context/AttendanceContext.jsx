import { createContext, useContext, useEffect, useState } from 'react'
import { VALID_STATUS } from '../utils/validators'

const AttendanceContext = createContext(null)
const STORAGE_KEY = 'manual_attendance'

function loadOverrides() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}

    // Simpan hanya entri dengan kunci "idMurid|YYYY-MM-DD" dan status yang valid
    const clean = {}
    Object.entries(parsed).forEach(([key, status]) => {
      if (/^\d+\|\d{4}-\d{2}-\d{2}$/.test(key) && VALID_STATUS.includes(status)) {
        clean[key] = status
      }
    })
    return clean
  } catch {
    return {}
  }
}

export function AttendanceProvider({ children }) {
  // Bentuk data: { "12|2026-10-26": "izin", ... }
  const [overrides, setOverrides] = useState(loadOverrides)

  // Setiap ada perubahan, simpan ke localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  }, [overrides])

  // Ubah status satu murid pada satu tanggal
  const setStatus = (studentId, date, status) => {
    setOverrides((prev) => ({ ...prev, [`${studentId}|${date}`]: status }))
  }

  // Ubah status banyak murid sekaligus (misalnya "Tandai semua hadir")
  const setManyStatus = (studentIds, date, status) => {
    setOverrides((prev) => {
      const next = { ...prev }
      studentIds.forEach((id) => {
        next[`${id}|${date}`] = status
      })
      return next
    })
  }

  // Batalkan input manual satu murid (kembali ke data awal)
  const removeStatus = (studentId, date) => {
    setOverrides((prev) => {
      const next = { ...prev }
      delete next[`${studentId}|${date}`]
      return next
    })
  }

  // Hapus semua input manual
  const clearAll = () => setOverrides({})

  return (
    <AttendanceContext.Provider
      value={{ overrides, setStatus, setManyStatus, removeStatus, clearAll }}
    >
      {children}
    </AttendanceContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useManualAttendance() {
  return useContext(AttendanceContext)
}