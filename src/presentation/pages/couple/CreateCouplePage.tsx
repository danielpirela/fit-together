import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../contexts/AuthContext';
import { useCoupleStore } from '../../contexts/CoupleContext';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { useToast } from '../../components/ui/Toast';

export function CreateCouplePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { createCouple, isLoading } = useCoupleStore();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Couple name is required');
      return;
    }

    try {
      await createCouple(name.trim(), user!.id);
      showToast('Couple created!', 'success');
      navigate('/');
    } catch {
      showToast('Failed to create couple', 'error');
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-2">Create Your Couple</h1>
        <p className="text-[var(--color-text-secondary)] mb-6">
          Give your couple a name to get started.
        </p>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              label="Couple Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g., The Smiths"
            />
            {error && <p className="text-sm text-[var(--color-red-completion)]">{error}</p>}
            <Button
              type="submit"
              title="Create Couple"
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
