import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  action?: {
    title: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <span className="text-5xl mb-4">{icon}</span>}
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">{title}</h3>
      {description && (
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-sm">{description}</p>
      )}
      {action && <Button title={action.title} onClick={action.onClick} variant="primary" />}
    </div>
  );
}
