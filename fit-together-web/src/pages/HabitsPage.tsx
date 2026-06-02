import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/auth-store'
import { useCoupleStore } from '../stores/couple-store'
import { useHabitsStore } from '../stores/habits-store'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { clsx } from 'clsx'

type TabType = 'active' | 'archived'

export function HabitsPage() {
  const user = useAuthStore((s) => s.user)
  const couple = useCoupleStore((s) => s.couple)
  const { habits, fetchHabits, isLoading } = useHabitsStore()
  const [activeTab, setActiveTab] = useState<TabType>('active')

  useEffect(() => {
    if (user?.id && couple?.id) {
      fetchHabits(couple.id)
    }
  }, [user?.id, couple?.id, fetchHabits])

  const activeHabits = habits.filter((h) => h.is_active)
  const archivedHabits = habits.filter((h) => !h.is_active)
  const displayedHabits = activeTab === 'active' ? activeHabits : archivedHabits

  if (isLoading && habits.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('active')}
          className={clsx(
            'flex-1 py-2 rounded-lg font-semibold text-sm transition-colors',
            activeTab === 'active'
              ? 'bg-[var(--color-green-primary)] text-white'
              : 'bg-gray-100 text-[var(--color-text-secondary)]'
          )}
        >
          Active ({activeHabits.length})
        </button>
        <button
          onClick={() => setActiveTab('archived')}
          className={clsx(
            'flex-1 py-2 rounded-lg font-semibold text-sm transition-colors',
            activeTab === 'archived'
              ? 'bg-[var(--color-green-primary)] text-white'
              : 'bg-gray-100 text-[var(--color-text-secondary)]'
          )}
        >
          Archived ({archivedHabits.length})
        </button>
      </div>

      {/* Habit List */}
      {displayedHabits.length === 0 ? (
        <EmptyState
          title={activeTab === 'active' ? 'No active habits' : 'No archived habits'}
          description={
            activeTab === 'active'
              ? 'Create your first habit to get started!'
              : 'Archived habits will appear here'
          }
          icon={activeTab === 'active' ? '📝' : '📦'}
          action={
            activeTab === 'active'
              ? { title: 'Create Habit', onClick: () => window.location.href = '/add-habit' }
              : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {displayedHabits.map((habit) => (
            <Link
              key={habit.id}
              to={`/habit/${habit.id}`}
              className="block bg-white rounded-xl p-4 shadow-sm active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${habit.color}20` }}
                >
                  <span className="text-2xl">{habit.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{habit.name}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {habit.target_count}x per week • {habit.target_days.length} days
                  </p>
                </div>
                <span className="text-2xl text-gray-300">›</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Button */}
      {activeTab === 'active' && (
        <div className="mt-6">
          <Link to="/add-habit">
            <Button title="Add Habit" variant="primary" size="large" fullWidth />
          </Link>
        </div>
      )}
    </div>
  )
}
