import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './lib/auth'
import { LoginPage } from './pages/LoginPage'
import { AdminLayout } from './pages/AdminLayout'
import { TransfersPage } from './pages/TransfersPage'
import { ActivityLogPage } from './pages/ActivityLogPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/transfers" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="transfers" replace />} />
        <Route path="transfers" element={<TransfersPage />} />
        <Route path="activity" element={<ActivityLogPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
