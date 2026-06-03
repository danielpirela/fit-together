import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../contexts/AuthContext';
import { useCoupleStore } from '../../contexts/CoupleContext';
import { useHabitsStore } from '../../contexts/HabitsContext';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { useToast } from '../../components/ui/Toast';
import { clsx } from 'clsx';

const COLORS = [
  { name: 'Green', value: '#34C759' },
  { name: 'Purple', value: '#AF52DE' },
  { name: 'Blue', value: '#007AFF' },
  { name: 'Orange', value: '#FF9500' },
  { name: 'Red', value: '#FF3B30' },
  { name: 'Teal', value: '#5AC8FA' },
];

const ICONS = ['✓', '💪', '🏃', '📚', '💧', '🧘', '😴', '🍎', '💊', '🎯'];

const WEEKDAYS = [
  { name: 'Mon', value: 'monday' },
  { name: 'Tue', value: 'tuesday' },
  { name: 'Wed', value: 'wednesday' },
  { name: 'Thu', value: 'thursday' },
  { name: 'Fri', value: 'friday' },
  { name: 'Sat', value: 'saturday' },
  { name: 'Sun', value: 'sunday' },
];

export function AddHabitPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const couple = useCoupleStore((s) => s.couple);
  const { createHabit, isLoading } = useHabitsStore();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLORS[0].value);
  const [icon, setIcon] = useState(ICONS[0]);
  const [targetCount, setTargetCount] = useState('3');
  const [targetDays, setTargetDays] = useState<string[]>(['monday', 'wednesday', 'friday']);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleDay = (day: string) => {
    setTargetDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (targetDays.length === 0) newErrors.days = 'Select at least one day';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createHabit({
        coupleId: couple!.id,
        name: name.trim(),
        description: description.trim() || null,
        color,
        icon,
        frequency: 'weekly',
        targetDays,
        targetCount: parseInt(targetCount) || 3,
        createdBy: user!.id,
      });
      showToast('Habit created!', 'success');
      navigate('/habits');
    } catch {
      showToast('Failed to create habit', 'error');
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Habit</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TextInput
            label="Habit Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g., Exercise"
            error={errors.name}
          />
          <TextInput
            label="Description (optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Add a description"
          />

          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={clsx(
                    'w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all',
                    icon === i
                      ? 'ring-2 ring-[var(--color-green-primary)] bg-[var(--color-green-light)]'
                      : 'bg-gray-100'
                  )}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={clsx(
                    'w-10 h-10 rounded-full transition-all',
                    color === c.value && 'ring-2 ring-offset-2'
                  )}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Days</label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={clsx(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all',
                    targetDays.includes(day.value)
                      ? 'bg-[var(--color-green-primary)] text-white'
                      : 'bg-gray-100 text-[var(--color-text-secondary)]'
                  )}
                >
                  {day.name}
                </button>
              ))}
            </div>
            {errors.days && <p className="text-sm text-red-500 mt-1">{errors.days}</p>}
          </div>

          <TextInput
            label="Times per week"
            type="number"
            value={targetCount}
            onChangeText={setTargetCount}
            placeholder="3"
          />

          <div className="pt-4">
            <Button
              type="submit"
              title="Create Habit"
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
