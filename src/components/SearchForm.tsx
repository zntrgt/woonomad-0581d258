import { useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ArrowRightLeft, Plane, Sparkles, Settings2 } from 'lucide-react';
import { format, addDays, startOfWeek, startOfToday, isBefore } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AirportInput } from './AirportInput';
import { CabinClassSelector } from './CabinClassSelector';
import { VisaSelector } from './VisaSelector';
import { FlightDatePicker } from './FlightDatePicker';
import { PassengerSelector } from './PassengerSelector';
import { Airport, SearchParams, CabinClass, VisaOption } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useSettings } from '@/contexts/SettingsContext';

export interface SearchFormRef {
  setAirports: (origin: Airport, destination: Airport) => void;
  triggerSearch: () => void;
}

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading?: boolean;
}

// Helper to get the next weekend
function getNextWeekend() {
  const today = startOfToday();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  let saturday = addDays(currentWeekStart, 5);
  let sunday = addDays(currentWeekStart, 6);
  
  if (isBefore(sunday, today)) {
    saturday = addDays(saturday, 7);
    sunday = addDays(sunday, 7);
  }
  
  return { saturday, sunday };
}

export const SearchForm = forwardRef<SearchFormRef, SearchFormProps>(
  ({ onSearch, isLoading }, ref) => {
    const { t } = useTranslation();
    const { currency } = useSettings();
    const [origin, setOrigin] = useState<Airport | null>(null);
    const [destination, setDestination] = useState<Airport | null>(null);
    const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
    const [cabinClass, setCabinClass] = useState<CabinClass>('Y');
    const [visaOption, setVisaOption] = useState<VisaOption>('all');
    const [advancedOpen, setAdvancedOpen] = useState(false);
    
    const nextWeekend = useMemo(() => getNextWeekend(), []);
    const [departDate, setDepartDate] = useState<Date | undefined>(() => nextWeekend.saturday);
    const [returnDate, setReturnDate] = useState<Date | undefined>(() => nextWeekend.sunday);
    const [isFlexible, setIsFlexible] = useState(false);
    const [isOneWay, setIsOneWay] = useState(false);
    
    const isAnywhereSearch = destination?.code === '';

    useImperativeHandle(ref, () => ({
      setAirports: (newOrigin: Airport, newDestination: Airport) => {
        setOrigin(newOrigin);
        setDestination(newDestination);
      },
      triggerSearch: () => {
        handleSearch();
      }
    }));

    const handleSwap = () => {
      if (isAnywhereSearch) return;
      const temp = origin;
      setOrigin(destination);
      setDestination(temp);
    };

    const handleSearch = () => {
      if (!origin) return;
      if (!isAnywhereSearch && !destination) return;
      if (!departDate) return;

      onSearch({
        origin: origin.code,
        destination: destination?.code || '',
        departDate: format(departDate, 'yyyy-MM-dd'),
        returnDate: !isOneWay && returnDate ? format(returnDate, 'yyyy-MM-dd') : undefined,
        adults: passengers.adults,
        children: passengers.children,
        infants: passengers.infants,
        tripClass: cabinClass,
        visaFilter: visaOption,
        flexibleDates: isFlexible,
        currency,
      });
    };

    return (
      <div className="space-y-3 sm:space-y-4">
        {/* Origin & Destination */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-end">
          <div className="flex-1">
            <AirportInput
              label={t('search.from')}
              placeholder={t('search.selectAirport')}
              value={origin}
              onChange={setOrigin}
              icon="origin"
            />
          </div>
          
          <button
            onClick={handleSwap}
            disabled={isAnywhereSearch}
            className="self-center sm:self-auto p-2.5 rounded-lg border border-border bg-card hover:bg-muted hover:border-primary/30 transition-all disabled:opacity-40 group"
            aria-label="Swap"
          >
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors rotate-90 sm:rotate-0" />
          </button>

          <div className="flex-1">
            <AirportInput
              label={t('search.to')}
              placeholder={t('search.selectAirport')}
              value={destination}
              onChange={setDestination}
              icon="destination"
              showAnywhereOption={true}
            />
          </div>
        </div>

        {/* Date Selection */}
        <FlightDatePicker
          departDate={departDate}
          returnDate={returnDate}
          onDepartDateChange={setDepartDate}
          onReturnDateChange={setReturnDate}
          isFlexible={isFlexible}
          onFlexibleChange={setIsFlexible}
          isOneWay={isOneWay}
        />

        {/* Compact Options Row */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {/* Trip Type Toggle */}
          <div className="flex items-center bg-muted rounded-full p-0.5">
            {[
              { label: t('search.roundTrip'), value: false },
              { label: t('search.oneWay'), value: true },
            ].map(({ label, value }) => (
              <button
                key={label}
                onClick={() => setIsOneWay(value)}
                className={cn(
                  "px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all",
                  isOneWay === value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          
          {/* Passengers Selector */}
          <PassengerSelector value={passengers} onChange={setPassengers} />
          
          {/* Advanced Options Popover */}
          <Popover open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 px-2.5 py-2 rounded-full border transition-all text-xs font-medium",
                  advancedOpen 
                    ? "bg-primary/10 border-primary/30 text-primary" 
                    : "border-border text-muted-foreground hover:border-primary/30"
                )}
              >
                <Settings2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t('search.options')}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="center" sideOffset={8}>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    {t('search.cabinClass')}
                  </label>
                  <CabinClassSelector value={cabinClass} onChange={setCabinClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    {t('search.visaFilter')}
                  </label>
                  <VisaSelector value={visaOption} onChange={setVisaOption} />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {isAnywhereSearch && (
            <span className="px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs bg-primary/10 text-primary font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {t('home.exploreMore')}
            </span>
          )}
        </div>

        {/* Search Button */}
        <div className="flex justify-center pt-1 sm:pt-2">
          <Button
            onClick={handleSearch}
            disabled={!origin || (!isAnywhereSearch && !destination) || !departDate || isLoading}
            size="lg"
            className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 rounded-xl gradient-primary hover:opacity-90 text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4 animate-bounce" />
                <span>{t('common.loading')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>{isAnywhereSearch ? t('home.exploreMore') : t('search.searchFlights')}</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    );
  }
);

SearchForm.displayName = 'SearchForm';