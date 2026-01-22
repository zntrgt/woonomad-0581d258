import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek, startOfToday, isBefore, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface FlightDatePickerProps {
  departDate: Date | undefined;
  returnDate: Date | undefined;
  onDepartDateChange: (date: Date | undefined) => void;
  onReturnDateChange: (date: Date | undefined) => void;
  isFlexible: boolean;
  onFlexibleChange: (flexible: boolean) => void;
  isOneWay?: boolean;
}

export function FlightDatePicker({
  departDate,
  returnDate,
  onDepartDateChange,
  onReturnDateChange,
  isFlexible,
  onFlexibleChange,
  isOneWay = false,
}: FlightDatePickerProps) {
  const [departOpen, setDepartOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);

  const today = startOfToday();

  // Quick weekend selection helpers
  const getNextWeekend = (offset: number = 0) => {
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    const targetWeekStart = addDays(currentWeekStart, offset * 7);
    const saturday = addDays(targetWeekStart, 5);
    const sunday = addDays(targetWeekStart, 6);
    
    // If this weekend has passed, get next
    if (isBefore(sunday, today) && offset === 0) {
      return getNextWeekend(1);
    }
    
    return { saturday, sunday };
  };

  const selectWeekend = (offset: number) => {
    const weekend = getNextWeekend(offset);
    onDepartDateChange(weekend.saturday);
    if (!isOneWay) {
      onReturnDateChange(weekend.sunday);
    }
  };

  const formatDateDisplay = (date: Date | undefined) => {
    if (!date) return 'Tarih Seç';
    return format(date, 'd MMM yyyy, EEEE', { locale: tr });
  };

  const formatShortDate = (date: Date | undefined) => {
    if (!date) return 'Tarih Seç';
    return format(date, 'd MMM', { locale: tr });
  };

  // Get weekend label
  const getWeekendLabel = () => {
    if (!departDate) return null;
    
    const thisWeekend = getNextWeekend(0);
    const nextWeekend = getNextWeekend(1);
    
    if (isSameDay(departDate, thisWeekend.saturday)) {
      return 'Bu Hafta Sonu';
    } else if (isSameDay(departDate, nextWeekend.saturday)) {
      return 'Gelecek Hafta Sonu';
    }
    return null;
  };

  const weekendLabel = getWeekendLabel();

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Quick Weekend Buttons - Compact */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <span className="text-xs sm:text-sm text-muted-foreground mr-1">Hızlı:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => selectWeekend(0)}
          className={cn(
            "rounded-full text-[10px] sm:text-xs h-7 sm:h-8 px-2.5 sm:px-3",
            weekendLabel === 'Bu Hafta Sonu' && "bg-primary text-primary-foreground border-primary"
          )}
        >
          Bu Hafta Sonu
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => selectWeekend(1)}
          className={cn(
            "rounded-full text-[10px] sm:text-xs h-7 sm:h-8 px-2.5 sm:px-3",
            weekendLabel === 'Gelecek Hafta Sonu' && "bg-primary text-primary-foreground border-primary"
          )}
        >
          Gelecek Hafta Sonu
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => selectWeekend(2)}
          className="rounded-full text-[10px] sm:text-xs h-7 sm:h-8 px-2.5 sm:px-3"
        >
          +2 Hafta
        </Button>
      </div>

      {/* Date Pickers */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Departure Date */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground/80 mb-2">
            Gidiş Tarihi
          </label>
          <Popover open={departOpen} onOpenChange={setDepartOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12 rounded-xl",
                  "bg-muted/50 border-border/50 hover:bg-muted",
                  !departDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                {formatDateDisplay(departDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={departDate}
                onSelect={(date) => {
                  onDepartDateChange(date);
                  setDepartOpen(false);
                  // Auto-set return date to next day if not set or before new depart date
                  if (date && !isOneWay && (!returnDate || isBefore(returnDate, date))) {
                    onReturnDateChange(addDays(date, 1));
                  }
                }}
                disabled={(date) => isBefore(date, today)}
                initialFocus
                locale={tr}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Return Date */}
        {!isOneWay && (
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Dönüş Tarihi
            </label>
            <Popover open={returnOpen} onOpenChange={setReturnOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 rounded-xl",
                    "bg-muted/50 border-border/50 hover:bg-muted",
                    !returnDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {formatDateDisplay(returnDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={(date) => {
                    onReturnDateChange(date);
                    setReturnOpen(false);
                  }}
                  disabled={(date) => departDate ? isBefore(date, departDate) : isBefore(date, today)}
                  initialFocus
                  locale={tr}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* Flexible Dates Toggle - Inline compact */}
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-lg bg-muted/30 border border-border/30">
          <Switch
            checked={isFlexible}
            onCheckedChange={onFlexibleChange}
            className="scale-90 sm:scale-100"
          />
          <span className="text-xs sm:text-sm font-medium">±1 gün esnek</span>
        </div>
        
        {/* Weekend label badge - no date repetition */}
        {weekendLabel && (
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {weekendLabel}
          </span>
        )}
      </div>
    </div>
  );
}
