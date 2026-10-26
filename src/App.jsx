import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { ThemeProvider } from './context/ThemeContext'
import History from './pages/History'
import TakeAttendance from './pages/TakeAttendance'
import { AttendanceProvider } from './context/AttendanceContext'

// Halaman yang hanya boleh dibuka kalau sudah login
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" replace />
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/riwayat"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
            <Route
        path="/presensi"
        element={
          <ProtectedRoute>
            <TakeAttendance />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AttendanceProvider>
          <AppRoutes />
          </AttendanceProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}