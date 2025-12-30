import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TripDurationSelector } from '@/components/TripDurationSelector';
import { TripDuration } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WeekendSelectorProps {
  startDate: Date;
  endDate: Date;
  label: string;
  tripDuration: TripDuration;
  onTripDurationChange: (duration: TripDuration) => void;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  formatDate: (date: Date) => string;
}

export function WeekendSelector({
  startDate,
  endDate,
  label,
  tripDuration,
  onTripDurationChange,
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
  formatDate,
}: WeekendSelectorProps) {
  const isSameDay = startDate.getTime() === endDate.getTime();

  return (
    <div className="flex flex-col items-center gap-4">
      <TripDurationSelector value={tripDuration} onChange={onTripDurationChange} />
      
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrev}
          disabled={!canGoPrev}
          className={cn(
            "h-12 w-12 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-soft transition-all duration-300",
            "hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-glow",
            "disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
          )}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="relative">
          <div className={cn(
            "px-8 py-6 rounded-3xl gradient-primary shadow-card",
            "min-w-[280px] text-center text-primary-foreground"
          )}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium opacity-90">
                {label}
              </span>
            </div>
            <div className="text-2xl md:text-3xl font-display font-bold">
              {isSameDay ? formatDate(startDate) : `${formatDate(startDate)} - ${formatDate(endDate)}`}
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-flight-orange rounded-full animate-bounce-gentle" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-flight-teal rounded-full animate-bounce-gentle" style={{ animationDelay: '0.5s' }} />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={!canGoNext}
          className={cn(
            "h-12 w-12 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-soft transition-all duration-300",
            "hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-glow",
            "disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
          )}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {tripDuration === '1-1' ? 'Günübirlik uçuşlar' : 'Gidiş-dönüş uçuşları ara'}
      </p>
    </div>
  );
}
