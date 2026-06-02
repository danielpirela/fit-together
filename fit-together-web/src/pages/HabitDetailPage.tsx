import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth-store'
import { useCoupleStore } from '../stores/couple-store'
import { useHabitsStore } from '../stores/habits-store'
import { Button } from '../components/Button'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { useToast } from '../components/Toast'
import gsap from 'gsap'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function HabitDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const couple = useCoupleStore((s) => s.couple)
  const { habits, completions, toggleCompletion, deleteHabit, fetchHabits } = useHabitsStore()
  const { showToast } = useToast()

  const [isInitialized, setIsInitialized] = useState(false)

  const habit = habits.find((h) => h.id === id)
  const habitCompletions = completions.get(id || '') || []

  if (!isInitialized && couple?.id) {
    if (habits.length === 0) {
      fetchHabits(couple.id)
    }
    setIsInitialized(true)
  }

  const isLoading = !isInitialized

  useEffect(() => {
    gsap.from('.grid-cell', {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      stagger: 0.02,
      ease: 'power2.out',
    })
  }, [habit])

  const today = new Date().toISOString().split('T')[0]
  const isCompletedToday = habitCompletions.some(
    (c) => c.user_id === user?.id && c.date === today
  )

  const handleToggle = async () => {
    try {
      await toggleCompletion(id!, user!.id, today)
    } catch {
      showToast('Failed to update completion', 'error')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to archive this habit?')) return
    try {
      await deleteHabit(id!)
      showToast('Habit archived', 'success')
      navigate('/habits')
    } catch {
      showToast('Failed to delete habit', 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (!habit) {
    return (
      <div className="p-4 text-center">
        <p className="text-[var(--color-text-secondary)]">Habit not found</p>
        <Button title="Go Back" onClick={() => navigate('/habits')} variant="ghost" className="mt-4" />
      </div>
    )
  }

  // Generate last 4 weeks of data
  const gridData: { date: string; completed: boolean }[] = []
  const currentDate = new Date()
  for (let i = 27; i >= 0; i--) {
    const date = new Date(currentDate)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const completed = habitCompletions.some((c) => c.user_id === user?.id && c.date === dateStr)
    gridData.push({ date: dateStr, completed })
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button type="button" onClick={() => navigate(-1)} className="text-2xl text-gray-400">‹</button>
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${habit.color}20` }}
        >
          <span className="text-3xl">{habit.icon}</span>
        </div>
        <div>
          <h1 className="text-xl font-bold">{habit.name}</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {habit.target_count}x per week
          </p>
        </div>
      </div>

      {/* Today's completion */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Today's Progress</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {isCompletedToday ? 'Completed!' : 'Not yet completed'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggle}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${
              isCompletedToday
                ? 'bg-[var(--color-green-primary)] text-white'
                : 'bg-gray-100 text-gray-300'
            }`}
          >
            {isCompletedToday ? '✓' : '○'}
          </button>
        </div>
      </div>

      {/* Activity Grid */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
        <p className="font-semibold mb-4">Last 4 Weeks</p>
        <div className="flex justify-between mb-2">
          {DAYS.map((day) => (
            <span key={day} className="text-xs text-[var(--color-text-secondary)] w-8 text-center">
              {day[0]}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {gridData.map((day, i) => (
            <div
              key={i}
              className={`grid-cell aspect-square rounded-sm transition-colors ${
                day.completed
                  ? 'bg-[var(--color-green-primary)]'
                  : 'bg-gray-100'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          title="Archive Habit"
          variant="destructive"
          fullWidth
          onClick={handleDelete}
        />
      </div>
    </div>
  )
}
