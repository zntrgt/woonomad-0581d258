import { useState } from 'react';
import { Calendar as CalendarIcon, Plane, ArrowRight, ChevronDown, TrendingDown } from 'lucide-react';
import { format, addDays, startOfWeek, startOfToday, isBefore, isSameDay, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { PriceCalendar } from './PriceCalendar';

interface FlightDatePickerProps {
  departDate: Date | undefined;
  returnDate: Date | undefined;
  onDepartDateChange: (date: Date | undefined) => void;
  onReturnDateChange: (date: Date | undefined) => void;
  isFlexible: boolean;
  onFlexibleChange: (flexible: boolean) => void;
  isOneWay?: boolean;
  originCode?: string;
  destinationCode?: string;
  currency?: string;
}

export function FlightDatePicker({
  departDate,
  returnDate,
  onDepartDateChange,
  onReturnDateChange,
  isFlexible,
  onFlexibleChange,
  isOneWay = false,
  originCode,
  destinationCode,
  currency = 'TRY',
}: FlightDatePickerProps) {
  const [activeCalendar, setActiveCalendar] = useState<'depart' | 'return' | null>(null);
  const [priceCalendarOpen, setPriceCalendarOpen] = useState(false);

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
      // ALWAYS set return date to departure + 1 day when departure changes
      // This provides better UX - user doesn't need to manually adjust return date
      onReturnDateChange(addDays(date, 1));
      // Auto-open return calendar so user can adjust if needed
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
              <span className="text-2xs sm:text-xs text-muted-foreground uppercase tracking-wide">Gidiş</span>
              <span className="text-base sm:text-lg font-bold text-foreground">{formatCompact(departDate)}</span>
              <span className="text-2xs sm:text-xs text-muted-foreground">{formatDayName(departDate)}</span>
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
                head_cell: "text-muted-foreground rounded-md w-8 sm:w-9 font-medium text-2xs sm:text-xs",
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
                <span className="text-2xs sm:text-xs text-muted-foreground uppercase tracking-wide">Dönüş</span>
                <span className="text-base sm:text-lg font-bold text-foreground">{formatCompact(returnDate)}</span>
                <span className="text-2xs sm:text-xs text-muted-foreground">{formatDayName(returnDate)}</span>
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
                  head_cell: "text-muted-foreground rounded-md w-8 sm:w-9 font-medium text-2xs sm:text-xs",
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
            <span className="text-2xs sm:text-xs text-muted-foreground">Tek yön</span>
          </div>
        )}
      </div>

      {/* Quick Actions Row */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {/* Weekend Quick Select */}
        {[
          { label: 'Bu Hafta Sonu', offset: 0 },
          { label: 'Gelecek Hafta Sonu', offset: 1 },
        ].map(({ label, offset }) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            onClick={() => selectWeekend(offset)}
            className={cn(
              "rounded-full text-2xs sm:text-xs h-6 sm:h-7 px-2 sm:px-2.5 font-medium",
              weekendLabel === label && "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
            )}
          >
            {label}
          </Button>
        ))}

        {/* More Date Options Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-2xs sm:text-xs h-6 sm:h-7 px-2 sm:px-2.5 font-medium"
            >
              Daha Fazla
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            <DropdownMenuLabel className="text-xs">Hafta Sonları</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => selectWeekend(2)} className="text-sm">
              +2 Hafta Sonra
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => selectWeekend(3)} className="text-sm">
              +3 Hafta Sonra
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => selectWeekend(4)} className="text-sm">
              +4 Hafta Sonra
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs">Aylık</DropdownMenuLabel>
            <DropdownMenuItem 
              onClick={() => {
                const thisMonth = startOfMonth(today);
                const monthEnd = endOfMonth(today);
                onDepartDateChange(isBefore(today, thisMonth) ? thisMonth : today);
                if (!isOneWay) onReturnDateChange(monthEnd);
              }}
              className="text-sm"
            >
              Bu Ay ({format(today, 'MMMM', { locale: tr })})
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                const nextMonth = addMonths(today, 1);
                onDepartDateChange(startOfMonth(nextMonth));
                if (!isOneWay) onReturnDateChange(endOfMonth(nextMonth));
              }}
              className="text-sm"
            >
              Gelecek Ay ({format(addMonths(today, 1), 'MMMM', { locale: tr })})
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                const twoMonthsLater = addMonths(today, 2);
                onDepartDateChange(startOfMonth(twoMonthsLater));
                if (!isOneWay) onReturnDateChange(endOfMonth(twoMonthsLater));
              }}
              className="text-sm"
            >
              {format(addMonths(today, 2), 'MMMM', { locale: tr })}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs">Uzun Süreli</DropdownMenuLabel>
            <DropdownMenuItem 
              onClick={() => {
                onDepartDateChange(addDays(today, 7));
                if (!isOneWay) onReturnDateChange(addDays(today, 37)); // ~1 month
              }}
              className="text-sm"
            >
              1 Ay (30 gün)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                onDepartDateChange(addDays(today, 7));
                if (!isOneWay) onReturnDateChange(addDays(today, 97)); // ~3 months
              }}
              className="text-sm"
            >
              3 Ay (90 gün)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

        {/* Price Calendar Button */}
        <Dialog open={priceCalendarOpen} onOpenChange={setPriceCalendarOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-2xs sm:text-xs h-6 sm:h-7 px-2 sm:px-2.5 font-medium gap-1"
            >
              <TrendingDown className="h-3 w-3" />
              <span className="hidden sm:inline">Fiyat</span> Takvimi
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-primary" />
                Fiyat Takvimi
              </DialogTitle>
            </DialogHeader>
            <PriceCalendar
              origin={originCode}
              destination={destinationCode}
              selectedDate={departDate}
              onSelectDate={(date) => {
                onDepartDateChange(date);
                if (!isOneWay) {
                  onReturnDateChange(addDays(date, 1));
                }
                setPriceCalendarOpen(false);
              }}
              currency={currency}
            />
          </DialogContent>
        </Dialog>

        {/* Flexible Toggle - Compact */}
        <button
          onClick={() => onFlexibleChange(!isFlexible)}
          className={cn(
            "flex items-center gap-1.5 rounded-full text-2xs sm:text-xs h-6 sm:h-7 px-2 sm:px-2.5 font-medium border transition-all",
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