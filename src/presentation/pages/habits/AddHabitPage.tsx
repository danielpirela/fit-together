import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { easeOutQuart, gsap } from '@/presentation/motion/gsap';
import { useReducedMotion } from '@/presentation/motion/useReducedMotion';
import { Button } from '@/presentation/components/ui/Button';
import { TextInput } from '@/presentation/components/ui/TextInput';

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

/* ── ParticleBurst — fires colored dots from trigger element ── */
function ParticleBurst({ triggerRef }: { triggerRef: React.RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    const trigger = triggerRef.current;
    if (!el || !trigger) return;

    const parent = trigger.offsetParent as HTMLElement | null;
    if (!parent) return;

    const rect = trigger.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - parentRect.left;
    const cy = rect.top + rect.height / 2 - parentRect.top;

    const particles = el.querySelectorAll<HTMLDivElement>('.p');
    if (reducedMotion) {
      gsap.set(particles, { opacity: 0.4, scale: 1 });
      gsap.to(el, { opacity: 0, duration: 0.15, delay: 0.05, onComplete: () => gsap.set(el, { display: 'none' }) });
      return;
    }

    particles.forEach((p, i) => {
      const angle = (i / particles.length) * Math.PI * 2;
      const distance = 40 + Math.random() * 30;
      gsap.set(p, { x: cx, y: cy, opacity: 1, scale: 1 });
      gsap.to(p, {
        x: cx + Math.cos(angle) * distance,
        y: cy + Math.sin(angle) * distance,
        opacity: 0,
        scale: 0.3,
        duration: 0.5,
        ease: 'power2.out',
        delay: i * 0.015,
      });
    });
    gsap.to(el, { opacity: 0, duration: 0.55, onComplete: () => gsap.set(el, { display: 'none' }) });
  }, [reducedMotion, triggerRef]);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ display: 'none' }}
      aria-hidden="true"
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="p absolute w-2 h-2 rounded-full"
          style={{ background: ['#00D4AA', '#FFD700', '#FF6B35', '#A855F7', '#3B82F6'][i % 5] }}
        />
      ))}
    </div>
  );
}

export function AddHabitPage() {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const submitRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLORS[0].value);
  const [icon, setIcon] = useState(ICONS[0]);
  const [targetCount, setTargetCount] = useState('3');
  const [targetDays, setTargetDays] = useState<string[]>(['monday', 'wednesday', 'friday']);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showBurst, setShowBurst] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

    setSubmitted(true);
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 600);
    setTimeout(() => navigate('/habits'), 350);
  };

  /* Staggered entrance */
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context();

    if (headingRef.current) {
      ctx.add(() => {
        gsap.fromTo(headingRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, delay: 0.1, ease: easeOutQuart });
      });
    }

    if (formRef.current) {
      const fields = formRef.current.querySelectorAll('.field-group');
      ctx.add(() => {
        gsap.fromTo(
          fields,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.25, stagger: 0.06, ease: easeOutQuart, delay: 0.15 }
        );
      });
    }

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface-primary)' }}>
      {showBurst && <ParticleBurst triggerRef={submitRef} />}

      <div className="max-w-md mx-auto px-4 pt-4 pb-8">
        <h1
          ref={headingRef}
          className="text-2xl font-bold mb-6"
          style={{ color: 'var(--color-text-primary)', opacity: reducedMotion ? 1 : 0 }}
        >
          New Habit
        </h1>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="field-group">
            <TextInput
              label="Habit Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g., Morning Run"
              error={errors.name}
            />
          </div>

          <div className="field-group">
            <TextInput
              label="Description (optional)"
              value={description}
              onChangeText={setDescription}
              placeholder="Add a description"
            />
          </div>

          <div className="field-group">
            <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={clsx(
                    'w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all',
                    icon === i
                      ? 'ring-2 ring-[var(--color-green-primary)]'
                      : 'bg-[var(--color-surface-secondary)]'
                  )}
                  style={icon === i ? { background: `${color}20` } : undefined}
                  aria-pressed={icon === i}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={clsx('w-10 h-10 rounded-full transition-all', color === c.value && 'ring-2 ring-offset-2')}
                  style={{ backgroundColor: c.value }}
                  aria-pressed={color === c.value}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          <div className="field-group">
            <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
              Days
            </label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={clsx(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all',
                    targetDays.includes(day.value)
                      ? 'text-white'
                      : 'bg-[var(--color-surface-secondary)]'
                  )}
                  style={targetDays.includes(day.value) ? { background: 'var(--color-accent-primary)' } : undefined}
                  aria-pressed={targetDays.includes(day.value)}
                >
                  {day.name}
                </button>
              ))}
            </div>
            {errors.days && (
              <p className="text-sm mt-1" style={{ color: 'var(--color-feedback-error)' }}>
                {errors.days}
              </p>
            )}
          </div>

          <div className="field-group">
            <TextInput
              label="Times per week"
              type="number"
              value={targetCount}
              onChangeText={setTargetCount}
              placeholder="3"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              title={submitted ? 'Creating…' : 'Create Habit'}
              variant="primary"
              size="large"
              fullWidth
              disabled={submitted}
            />
          </div>
        </form>
      </div>
    </div>
  );
}