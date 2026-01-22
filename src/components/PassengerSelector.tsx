import { useState } from 'react';
import { Users, Minus, Plus, Baby, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Passengers {
  adults: number;
  children: number;
  infants: number;
}

interface PassengerSelectorProps {
  value: Passengers;
  onChange: (passengers: Passengers) => void;
}

export function PassengerSelector({ value, onChange }: PassengerSelectorProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const total = value.adults + value.children;

  const updatePassenger = (type: keyof Passengers, delta: number) => {
    const min = type === 'adults' ? 1 : 0;
    const max = 9;
    const newValue = Math.max(min, Math.min(max, value[type] + delta));
    onChange({ ...value, [type]: newValue });
  };

  const passengerTypes = [
    { 
      key: 'adults' as const, 
      label: t('search.adults'), 
      desc: '12+', 
      icon: User,
      min: 1 
    },
    { 
      key: 'children' as const, 
      label: t('search.children'), 
      desc: '2-11', 
      icon: User,
      min: 0 
    },
    { 
      key: 'infants' as const, 
      label: t('search.infants'), 
      desc: '0-2', 
      icon: Baby,
      min: 0 
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-full border transition-all text-xs sm:text-sm font-medium",
            open 
              ? "bg-primary/10 border-primary/30 text-primary" 
              : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
          )}
        >
          <Users className="h-3.5 w-3.5" />
          <span>{total} {t('search.passengers')}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="center" sideOffset={8}>
        <div className="space-y-3">
          {passengerTypes.map(({ key, label, desc, icon: Icon, min }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-[10px] text-muted-foreground">{desc}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updatePassenger(key, -1)}
                  disabled={value[key] <= min}
                  className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-5 text-center text-sm font-semibold">{value[key]}</span>
                <button
                  onClick={() => updatePassenger(key, 1)}
                  disabled={value[key] >= 9}
                  className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 pt-3 border-t border-border">
          <Button 
            size="sm" 
            className="w-full h-8 text-xs"
            onClick={() => setOpen(false)}
          >
            {t('common.confirm')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}