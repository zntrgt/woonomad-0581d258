import { cn } from '@/lib/utils';
import { TripDuration } from '@/lib/types';

interface TripDurationSelectorProps {
  value: TripDuration;
  onChange: (duration: TripDuration) => void;
}

const options: { value: TripDuration; label: string; description: string }[] = [
  { value: '1-1', label: '1 Gün', description: 'Günübirlik' },
  { value: '2-2', label: '2 Gün', description: 'Hafta sonu' },
  { value: '3-3', label: '3 Gün', description: 'Uzun hafta sonu' },
];

export function TripDurationSelector({ value, onChange }: TripDurationSelectorProps) {
  return (
    <div className="flex gap-2 justify-center">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
            "border border-border/50 hover:border-primary/50",
            value === option.value
              ? "bg-primary text-primary-foreground shadow-glow"
              : "bg-card/80 text-muted-foreground hover:bg-card"
          )}
        >
          <span className="block">{option.label}</span>
          <span className="text-xs opacity-75">{option.description}</span>
        </button>
      ))}
    </div>
  );
}
