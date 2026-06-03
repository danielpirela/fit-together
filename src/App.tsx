import { TabLayout } from '@/presentation/components/layout/TabLayout';
import { LoadingScreen } from '@/presentation/components/ui/LoadingSpinner';
import { ToastProvider } from '@/presentation/components/ui/Toast';
import { useAuthStore } from '@/presentation/contexts/AuthContext';
import { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import { LoginPage } from '@/presentation/pages/auth/LoginPage';
import { ResetPasswordPage } from '@/presentation/pages/auth/ResetPasswordPage';
import { SignUpPage } from '@/presentation/pages/auth/SignUpPage';
import { CreateCouplePage } from '@/presentation/pages/couple/CreateCouplePage';
import { InvitePartnerPage } from '@/presentation/pages/couple/InvitePartnerPage';
import { AddHabitPage } from '@/presentation/pages/habits/AddHabitPage';
import { HabitDetailPage } from '@/presentation/pages/habits/HabitDetailPage';
import { HabitsPage } from '@/presentation/pages/habits/HabitsPage';
import { HomePage } from '@/presentation/pages/HomePage';
import { InvitePage } from '@/presentation/pages/InvitePage';
import { ProfilePage } from '@/presentation/pages/ProfilePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && !user) {
      navigate('/login');
    }
  }, [user, isInitialized, navigate]);

  if (!isInitialized) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  const initialize = useAuthStore((s) => s.initialize);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) return <LoadingScreen />;

  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/sign-up" element={user ? <Navigate to="/" replace /> : <SignUpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/invite/:token" element={<InvitePage />} />

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
          <Route path="/add-habit" element={<AddHabitPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-couple" element={<CreateCouplePage />} />
          <Route path="/invite-partner" element={<InvitePartnerPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
