import { useState, useEffect, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfToday, addMonths, subMonths } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Loader2, Plane, TrendingDown, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMonthlyPrices, DayPrice } from '@/hooks/useMonthlyPrices';

interface PriceCalendarProps {
  origin: string | undefined;
  destination: string | undefined;
  selectedDate: Date | undefined;
  onSelectDate: (date: Date) => void;
  currency?: string;
}

export function PriceCalendar({
  origin,
  destination,
  selectedDate,
  onSelectDate,
  currency = 'TRY',
}: PriceCalendarProps) {
  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(() => selectedDate || today);
  const { prices, isLoading, error, minPrice, maxPrice, fetchMonthlyPrices, clearPrices } = useMonthlyPrices();
  
  // Create a map for quick price lookup
  const priceMap = useMemo(() => {
    const map = new Map<string, DayPrice>();
    prices.forEach(p => map.set(p.date, p));
    return map;
  }, [prices]);

  // Fetch prices when month or airports change
  useEffect(() => {
    if (origin && destination) {
      const monthStr = format(currentMonth, 'yyyy-MM');
      fetchMonthlyPrices({ origin, destination, month: monthStr, currency });
    } else {
      clearPrices();
    }
  }, [origin, destination, currentMonth, currency, fetchMonthlyPrices, clearPrices]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day of week for first day (0 = Sunday)
  const startDayOfWeek = monthStart.getDay();
  // Adjust for Monday start (Turkish standard)
  const paddingDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const goToPrevMonth = () => {
    const prevMonth = subMonths(currentMonth, 1);
    if (!isBefore(endOfMonth(prevMonth), today)) {
      setCurrentMonth(prevMonth);
    }
  };

  const goToNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    const maxDate = addMonths(today, 12);
    if (isBefore(nextMonth, maxDate)) {
      setCurrentMonth(nextMonth);
    }
  };

  const canGoPrev = !isBefore(endOfMonth(subMonths(currentMonth, 1)), today);
  const canGoNext = isBefore(currentMonth, addMonths(today, 11));

  const getPriceColor = (price: number) => {
    if (!minPrice || !maxPrice || minPrice === maxPrice) return 'text-muted-foreground';
    const ratio = (price - minPrice) / (maxPrice - minPrice);
    if (ratio <= 0.25) return 'text-green-600 font-semibold';
    if (ratio <= 0.5) return 'text-green-500';
    if (ratio <= 0.75) return 'text-orange-500';
    return 'text-red-500';
  };

  const formatPrice = (price: number) => {
    if (price >= 10000) {
      return `${Math.round(price / 1000)}k`;
    }
    if (price >= 1000) {
      return `${(price / 1000).toFixed(1)}k`;
    }
    return price.toString();
  };

  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPrevMonth}
          disabled={!canGoPrev}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-sm font-semibold">
          {format(currentMonth, 'MMMM yyyy', { locale: tr })}
        </h3>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextMonth}
          disabled={!canGoNext}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Missing airports notice */}
      {(!origin || !destination) && (
        <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground text-sm">
          <Plane className="h-4 w-4" />
          <span>Fiyatları görmek için kalkış ve varış havalimanlarını seçin</span>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Fiyatlar yükleniyor...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-center gap-2 py-8 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Calendar Grid */}
      {origin && destination && !isLoading && (
        <>
          {/* Day names header */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {dayNames.map(day => (
              <div key={day} className="text-center text-[10px] font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Padding cells */}
            {Array.from({ length: paddingDays }).map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square" />
            ))}

            {/* Day cells */}
            {daysInMonth.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayPrice = priceMap.get(dateStr);
              const isPast = isBefore(day, today);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCheapest = dayPrice && minPrice && dayPrice.price === minPrice;

              return (
                <button
                  key={dateStr}
                  onClick={() => !isPast && onSelectDate(day)}
                  disabled={isPast}
                  className={cn(
                    "relative aspect-square flex flex-col items-center justify-center rounded-md text-xs transition-all",
                    "hover:bg-muted hover:ring-1 hover:ring-primary/20",
                    isPast && "opacity-40 cursor-not-allowed hover:bg-transparent hover:ring-0",
                    isSelected && "bg-primary text-primary-foreground hover:bg-primary",
                    isCheapest && !isSelected && "ring-2 ring-green-500/50 bg-green-50 dark:bg-green-950/30"
                  )}
                >
                  <span className={cn(
                    "text-[11px] font-medium",
                    isSelected && "text-primary-foreground"
                  )}>
                    {format(day, 'd')}
                  </span>
                  
                  {dayPrice && (
                    <span className={cn(
                      "text-[9px] leading-none mt-0.5",
                      isSelected ? "text-primary-foreground/80" : getPriceColor(dayPrice.price)
                    )}>
                      {formatPrice(dayPrice.price)}
                    </span>
                  )}
                  
                  {isCheapest && !isSelected && (
                    <TrendingDown className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 text-green-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          {prices.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>En Ucuz: {minPrice?.toLocaleString('tr-TR')}₺</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>En Pahalı: {maxPrice?.toLocaleString('tr-TR')}₺</span>
                </div>
              </div>
            </div>
          )}

          {/* No prices message */}
          {!isLoading && prices.length === 0 && origin && destination && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Bu ay için fiyat bilgisi bulunamadı
            </div>
          )}
        </>
      )}
    </div>
  );
}
