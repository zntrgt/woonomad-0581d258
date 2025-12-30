import { cn } from '@/lib/utils';
import { VisaOption } from '@/lib/types';
import { Globe, FileCheck, FileX } from 'lucide-react';

interface VisaSelectorProps {
  value: VisaOption;
  onChange: (value: VisaOption) => void;
}

export function VisaSelector({ value, onChange }: VisaSelectorProps) {
  const options: { id: VisaOption; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Hepsi', icon: <Globe className="h-4 w-4" /> },
    { id: 'visa-free', label: 'Vizesiz', icon: <FileCheck className="h-4 w-4" /> },
    { id: 'visa-required', label: 'Vizeli', icon: <FileX className="h-4 w-4" /> },
  ];

  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300",
            value === option.id
              ? "bg-secondary text-secondary-foreground shadow-md"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}