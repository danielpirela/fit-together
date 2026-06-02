import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth-store'
import { useCoupleStore } from '../stores/couple-store'
import { Button } from '../components/Button'
import { TextInput } from '../components/TextInput'
import { useToast } from '../components/Toast'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, signOut, updateProfile, isLoading } = useAuthStore()
  const { couple, leaveCouple } = useCoupleStore()
  const { showToast } = useToast()

  const [displayName, setDisplayName] = useState(user?.display_name || '')
  const [isEditing, setIsEditing] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch {
      showToast('Failed to sign out', 'error')
    }
  }

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(displayName)
      setIsEditing(false)
      showToast('Profile updated', 'success')
    } catch {
      showToast('Failed to update profile', 'error')
    }
  }

  const handleLeaveCouple = async () => {
    if (!confirm('Are you sure you want to leave this couple? Your habits will be archived.')) {
      return
    }
    try {
      await leaveCouple(user!.id)
      showToast('Left the couple', 'success')
    } catch {
      showToast('Failed to leave couple', 'error')
    }
  }

  return (
    <div className="p-4">
      {/* Profile Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[var(--color-green-light)] flex items-center justify-center">
            <span className="text-3xl">👤</span>
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <TextInput
                  label="Display Name"
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Your name"
                />
                <div className="flex gap-2">
                  <Button
                    title="Save"
                    onClick={handleUpdateProfile}
                    loading={isLoading}
                    size="small"
                  />
                  <Button
                    title="Cancel"
                    onClick={() => {
                      setIsEditing(false)
                      setDisplayName(user?.display_name || '')
                    }}
                    variant="ghost"
                    size="small"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold">{user?.display_name}</h2>
                <p className="text-[var(--color-text-secondary)]">{user?.email}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-[var(--color-green-primary)] font-medium mt-1"
                >
                  Edit profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Couple Card */}
      {couple && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <h3 className="font-semibold mb-3">💑 Your Couple</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Couple name</span>
              <span className="font-medium">{couple.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Status</span>
              <span className="font-medium text-[var(--color-green-primary)]">
                {couple.partner_b_id ? 'Complete' : 'Waiting for partner'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLeaveCouple}
            className="mt-4 text-sm text-[var(--color-red-completion)] font-medium"
          >
            Leave couple
          </button>
        </div>
      )}

      {/* Sign Out */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <Button
          title="Sign Out"
          onClick={handleSignOut}
          variant="destructive"
          fullWidth
          loading={isLoading}
        />
      </div>
    </div>
  )
}
