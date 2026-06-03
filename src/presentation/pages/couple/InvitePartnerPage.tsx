import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../contexts/AuthContext';
import { useCoupleStore } from '../../contexts/CoupleContext';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { useToast } from '../../components/ui/Toast';

export function InvitePartnerPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { couple, invitePartner, isLoading } = useCoupleStore();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!email.includes('@')) {
      setError('Invalid email');
      return;
    }
    if (email === user?.email) {
      setError('You cannot invite yourself');
      return;
    }

    try {
      await invitePartner(couple!.id, user!.id, email);
      setSent(true);
      showToast('Invitation sent!', 'success');
    } catch {
      showToast('Failed to send invitation', 'error');
    }
  };

  if (sent) {
    return (
      <div className="p-4">
        <div className="max-w-md mx-auto text-center">
          <span className="text-6xl mb-4 block">🎉</span>
          <h1 className="text-2xl font-bold mb-2">Invitation Sent!</h1>
          <p className="text-[var(--color-text-secondary)] mb-6">
            Once they accept, you'll be able to track habits together!
          </p>
          <Button title="Back to Home" onClick={() => navigate('/')} variant="primary" fullWidth />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-2">Invite Your Partner</h1>
        <p className="text-[var(--color-text-secondary)] mb-6">
          Enter your partner's email to send them an invitation.
        </p>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              label="Partner's Email"
              type="email"
              value={email}
              onChangeText={setEmail}
              placeholder="partner@example.com"
              autoComplete="email"
            />
            {error && <p className="text-sm text-[var(--color-red-completion)]">{error}</p>}
            <Button
              type="submit"
              title="Send Invitation"
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
