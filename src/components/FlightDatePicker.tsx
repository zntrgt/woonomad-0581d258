import { useState } from 'react';
import { Calendar as CalendarIcon, Plane, ArrowRight } from 'lucide-react';
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
  const [activeCalendar, setActiveCalendar] = useState<'depart' | 'return' | null>(null);

  const today = startOfToday();

  // Quick weekend selection helpers
  const getNextWeekend = (offset: number = 0) => {
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    const targetWeekStart = addDays(currentWeekStart, offset * 7);
    const saturday = addDays(targetWeekStart, 5);
    const sunday = addDays(targetWeekStart, 6);
    
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

  // Compact date format for buttons
  const formatCompact = (date: Date | undefined) => {
    if (!date) return 'Seç';
    return format(date, 'd MMM', { locale: tr });
  };

  const formatDayName = (date: Date | undefined) => {
    if (!date) return '';
    return format(date, 'EEE', { locale: tr });
  };

  // Get weekend label
  const getWeekendLabel = () => {
    if (!departDate) return null;
    
    const thisWeekend = getNextWeekend(0);
    const nextWeekend = getNextWeekend(1);
    const thirdWeekend = getNextWeekend(2);
    
    if (isSameDay(departDate, thisWeekend.saturday)) return 'Bu Hafta Sonu';
    if (isSameDay(departDate, nextWeekend.saturday)) return 'Gelecek Hafta Sonu';
    if (isSameDay(departDate, thirdWeekend.saturday)) return '+2 Hafta';
    return null;
  };

  const weekendLabel = getWeekendLabel();

  const handleDepartSelect = (date: Date | undefined) => {
    onDepartDateChange(date);
    if (date && !isOneWay) {
      // Auto-set return date if needed
      if (!returnDate || isBefore(returnDate, date)) {
        onReturnDateChange(addDays(date, 1));
      }
      // Auto-open return calendar
      setActiveCalendar('return');
    } else {
      setActiveCalendar(null);
    }
  };

  const handleReturnSelect = (date: Date | undefined) => {
    onReturnDateChange(date);
    setActiveCalendar(null);
  };

  return (
    <div className="space-y-3">
      {/* Main Date Selection - Unified compact row */}
      <div className="flex items-stretch gap-2">
        {/* Departure Date */}
        <Popover 
          open={activeCalendar === 'depart'} 
          onOpenChange={(open) => setActiveCalendar(open ? 'depart' : null)}
        >
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex-1 flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border transition-all",
                "hover:border-primary/50 hover:bg-muted/50",
                activeCalendar === 'depart' 
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                  : "border-border bg-card",
                !departDate && "text-muted-foreground"
              )}
            >
              <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Gidiş</span>
              <span className="text-base sm:text-lg font-bold text-foreground">{formatCompact(departDate)}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">{formatDayName(departDate)}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center" sideOffset={8}>
            <div className="p-2 border-b border-border bg-muted/50">
              <p className="text-xs font-medium text-center">Gidiş Tarihi Seçin</p>
            </div>
            <Calendar
              mode="single"
              selected={departDate}
              onSelect={handleDepartSelect}
              disabled={(date) => isBefore(date, today)}
              initialFocus
              locale={tr}
              className="p-2 sm:p-3 pointer-events-auto"
              classNames={{
                months: "flex flex-col",
                month: "space-y-2",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-semibold",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-muted rounded-md",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-8 sm:w-9 font-medium text-[10px] sm:text-xs",
                row: "flex w-full mt-1",
                cell: "h-8 w-8 sm:h-9 sm:w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                day: "h-8 w-8 sm:h-9 sm:w-9 p-0 font-normal text-xs sm:text-sm rounded-md hover:bg-muted aria-selected:opacity-100",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground font-semibold",
                day_outside: "text-muted-foreground opacity-40",
                day_disabled: "text-muted-foreground opacity-30",
              }}
            />
          </PopoverContent>
        </Popover>

        {/* Arrow / Divider */}
        <div className="flex items-center justify-center px-1">
          {isOneWay ? (
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          ) : (
            <div className="flex flex-col items-center gap-0.5">
              <Plane className="h-3.5 w-3.5 text-primary" />
              <div className="h-3 w-px bg-border" />
              <Plane className="h-3.5 w-3.5 text-primary rotate-180" />
            </div>
          )}
        </div>

        {/* Return Date */}
        {!isOneWay ? (
          <Popover 
            open={activeCalendar === 'return'} 
            onOpenChange={(open) => setActiveCalendar(open ? 'return' : null)}
          >
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex-1 flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border transition-all",
                  "hover:border-primary/50 hover:bg-muted/50",
                  activeCalendar === 'return' 
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                    : "border-border bg-card",
                  !returnDate && "text-muted-foreground"
                )}
              >
                <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Dönüş</span>
                <span className="text-base sm:text-lg font-bold text-foreground">{formatCompact(returnDate)}</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">{formatDayName(returnDate)}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" sideOffset={8}>
              <div className="p-2 border-b border-border bg-muted/50">
                <p className="text-xs font-medium text-center">Dönüş Tarihi Seçin</p>
              </div>
              <Calendar
                mode="single"
                selected={returnDate}
                onSelect={handleReturnSelect}
                disabled={(date) => departDate ? isBefore(date, departDate) : isBefore(date, today)}
                initialFocus
                locale={tr}
                className="p-2 sm:p-3 pointer-events-auto"
                classNames={{
                  months: "flex flex-col",
                  month: "space-y-2",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-semibold",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-muted rounded-md",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-8 sm:w-9 font-medium text-[10px] sm:text-xs",
                  row: "flex w-full mt-1",
                  cell: "h-8 w-8 sm:h-9 sm:w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                  day: "h-8 w-8 sm:h-9 sm:w-9 p-0 font-normal text-xs sm:text-sm rounded-md hover:bg-muted aria-selected:opacity-100",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground font-semibold",
                  day_outside: "text-muted-foreground opacity-40",
                  day_disabled: "text-muted-foreground opacity-30",
                }}
              />
            </PopoverContent>
          </Popover>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border border-dashed border-border/50 bg-muted/20">
            <span className="text-[10px] sm:text-xs text-muted-foreground">Tek yön</span>
          </div>
        )}
      </div>

      {/* Quick Actions Row */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {/* Weekend Quick Select */}
        {[
          { label: 'Bu Hafta Sonu', offset: 0 },
          { label: 'Gelecek Hafta Sonu', offset: 1 },
          { label: '+2 Hafta', offset: 2 },
        ].map(({ label, offset }) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            onClick={() => selectWeekend(offset)}
            className={cn(
              "rounded-full text-[10px] sm:text-xs h-6 sm:h-7 px-2 sm:px-2.5 font-medium",
              weekendLabel === label && "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
            )}
          >
            {label}
          </Button>
        ))}

        {/* Divider */}
        <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

        {/* Flexible Toggle - Compact */}
        <button
          onClick={() => onFlexibleChange(!isFlexible)}
          className={cn(
            "flex items-center gap-1.5 rounded-full text-[10px] sm:text-xs h-6 sm:h-7 px-2 sm:px-2.5 font-medium border transition-all",
            isFlexible 
              ? "bg-primary/10 text-primary border-primary/30" 
              : "bg-card text-muted-foreground border-border hover:border-primary/30"
          )}
        >
          <CalendarIcon className="h-3 w-3" />
          <span>±1 gün</span>
        </button>
      </div>
    </div>
  );
}