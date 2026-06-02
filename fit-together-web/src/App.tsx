import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import { TabLayout } from './components/Layout'
import { useAuthStore } from './stores/auth-store'
import { LoadingScreen } from './components/LoadingSpinner'

// Pages
import { HomePage } from './pages/HomePage'
import { HabitsPage } from './pages/HabitsPage'
import { ProfilePage } from './pages/ProfilePage'
import { LoginPage } from './pages/auth/LoginPage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'
import { CreateCouplePage } from './pages/couple/CreateCouplePage'
import { InvitePartnerPage } from './pages/couple/InvitePartnerPage'
import { HabitDetailPage } from './pages/HabitDetailPage'
import { AddHabitPage } from './pages/AddHabitPage'
import { InvitePage } from './pages/InvitePage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const isInitialized = useAuthStore((s) => s.isInitialized)
  const navigate = useNavigate()

  useEffect(() => {
    if (isInitialized && !user) {
      navigate('/login')
    }
  }, [user, isInitialized, navigate])

  if (!isInitialized) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  const initialize = useAuthStore((s) => s.initialize)
  const isInitialized = useAuthStore((s) => s.isInitialized)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    initialize()
  }, [initialize])

  if (!isInitialized) {
    return <LoadingScreen />
  }

  return (
    <ToastProvider>
      <Routes>
        {/* Auth routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/sign-up"
          element={user ? <Navigate to="/" replace /> : <SignUpPage />}
        />
        <Route
          path="/reset-password"
          element={user ? <Navigate to="/" replace /> : <ResetPasswordPage />}
        />

        {/* Invitation route (public) */}
        <Route path="/invite/:token" element={<InvitePage />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <TabLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/habit/:id" element={<HabitDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-couple" element={<CreateCouplePage />} />
          <Route path="/invite-partner" element={<InvitePartnerPage />} />
          <Route path="/add-habit" element={<AddHabitPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  )
}

export default App
