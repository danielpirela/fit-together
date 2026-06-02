import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/auth-store'
import { useCoupleStore } from '../stores/couple-store'
import { Button } from '../components/Button'
import { LoadingSpinner } from '../components/LoadingSpinner'

export function HomePage() {
  const user = useAuthStore((s) => s.user)
  const couple = useCoupleStore((s) => s.couple)
  const fetchCouple = useCoupleStore((s) => s.fetchCouple)
  const isLoading = useCoupleStore((s) => s.isLoading)

  useEffect(() => {
    if (user?.id) {
      fetchCouple(user.id)
    }
  }, [user?.id, fetchCouple])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Hello, {user?.display_name || 'there'}! 👋
        </h2>
        <p className="text-[var(--color-text-secondary)] mt-1">
          {couple ? `Tracking with ${couple.name}` : 'Start your journey together'}
        </p>
      </div>

      {/* Couple status */}
      {!couple ? (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <div className="text-center">
            <span className="text-4xl mb-4 block">💑</span>
            <h3 className="text-lg font-semibold mb-2">Create Your Couple</h3>
            <p className="text-[var(--color-text-secondary)] mb-4">
              Start tracking habits together with your partner
            </p>
            <Link to="/create-couple">
              <Button title="Create Couple" variant="primary" fullWidth />
            </Link>
          </div>
        </div>
      ) : !couple.partner_b_id ? (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <div className="text-center">
            <span className="text-4xl mb-4 block">🤝</span>
            <h3 className="text-lg font-semibold mb-2">Invite Your Partner</h3>
            <p className="text-[var(--color-text-secondary)] mb-4">
              Share the invitation with your partner to start tracking together
            </p>
            <Link to="/invite-partner">
              <Button title="Invite Partner" variant="primary" fullWidth />
            </Link>
          </div>
        </div>
      ) : null}

      {/* Quick actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Link
            to="/habits"
            className="flex items-center gap-4 p-4 rounded-lg bg-[var(--color-bg-primary)] hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl">✓</span>
            <div>
              <p className="font-medium">View Habits</p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Check today's progress
              </p>
            </div>
          </Link>
          <Link
            to="/add-habit"
            className="flex items-center gap-4 p-4 rounded-lg bg-[var(--color-bg-primary)] hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl">➕</span>
            <div>
              <p className="font-medium">Add New Habit</p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Create a new habit to track
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
