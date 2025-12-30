import { cn } from '@/lib/utils';
import { CabinClass } from '@/lib/types';
import { Briefcase, Users } from 'lucide-react';

interface CabinClassSelectorProps {
  value: CabinClass;
  onChange: (value: CabinClass) => void;
}

export function CabinClassSelector({ value, onChange }: CabinClassSelectorProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange('Y')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
          value === 'Y'
            ? "bg-primary text-primary-foreground shadow-glow"
            : "bg-muted/50 text-muted-foreground hover:bg-muted"
        )}
      >
        <Users className="h-4 w-4" />
        <span>Ekonomi</span>
      </button>
      <button
        onClick={() => onChange('C')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
          value === 'C'
            ? "bg-accent text-accent-foreground shadow-glow"
            : "bg-muted/50 text-muted-foreground hover:bg-muted"
        )}
      >
        <Briefcase className="h-4 w-4" />
        <span>Business</span>
      </button>
    </div>
  );
}