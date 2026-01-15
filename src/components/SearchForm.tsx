import { useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Users, ArrowRightLeft, Plane, Sparkles } from 'lucide-react';
import { format, addDays, startOfWeek, startOfToday, isBefore } from 'date-fns';
import { Button } from '@/components/ui/button';
import { AirportInput } from './AirportInput';
import { CabinClassSelector } from './CabinClassSelector';
import { VisaSelector } from './VisaSelector';
import { FlightDatePicker } from './FlightDatePicker';
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

// Helper to get the next weekend - always calculate fresh
function getNextWeekend() {
  const today = startOfToday();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  let saturday = addDays(currentWeekStart, 5);
  let sunday = addDays(currentWeekStart, 6);
  
  // If this weekend has passed, get next week's weekend
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
    const [showAdvanced, setShowAdvanced] = useState(false);
    
    // Date state - calculate fresh on each render to ensure daily updates
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
        currency: currency, // Pass user's selected currency to API
      });
    };

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Main Search Box */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Origin & Destination - Stack on mobile */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">
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
              className="self-center sm:self-auto p-3 rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/30 transition-all duration-200 disabled:opacity-40 group btn-interactive touch-target"
              aria-label={t('search.from') + ' / ' + t('search.to')}
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

        {/* Options Row - Scrollable on mobile */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm">
          {/* Trip Type */}
          <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
            {[t('search.roundTrip'), t('search.oneWay')].map((label, i) => (
              <button
                key={label}
                onClick={() => setIsOneWay(i === 1)}
                className={cn(
                  "px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 touch-target",
                  (i === 0 ? !isOneWay : isOneWay)
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          
          {/* Passengers */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border transition-all duration-200 touch-target",
              showAdvanced 
                ? "bg-primary/10 border-primary/30 text-primary" 
                : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
            )}
          >
            <Users className="h-4 w-4" />
            <span className="font-medium text-xs sm:text-sm">{passengers.adults + passengers.children} {t('search.passengers')}</span>
          </button>
          
          {isAnywhereSearch && (
            <span className="px-3 py-2 rounded-xl text-xs bg-primary/10 text-primary font-semibold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              {t('home.exploreMore')}
            </span>
          )}
        </div>

        {/* Expanded Options */}
        {showAdvanced && (
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-border animate-fade-in">
            {/* Passengers */}
            <div className="flex items-center gap-4 sm:gap-6">
              {[
                { key: 'adults', label: t('search.adults'), min: 1, desc: '12+' },
                { key: 'children', label: t('search.children'), min: 0, desc: '2-11' },
                { key: 'infants', label: t('search.infants'), min: 0, desc: '0-2' },
              ].map(({ key, label, min, desc }) => (
                <div key={key} className="flex flex-col items-center gap-1.5 sm:gap-2">
                  <span className="text-xs sm:text-sm font-medium text-foreground">{label}</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">{desc}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPassengers(p => ({ ...p, [key]: Math.max(min, (p as any)[key] - 1) }))}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-border text-sm hover:bg-muted hover:border-primary/30 transition-all btn-interactive touch-target flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-6 sm:w-8 text-center text-sm font-semibold">{(passengers as any)[key]}</span>
                    <button
                      onClick={() => setPassengers(p => ({ ...p, [key]: Math.min(9, (p as any)[key] + 1) }))}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-border text-sm hover:bg-muted hover:border-primary/30 transition-all btn-interactive touch-target flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="h-12 w-px bg-border hidden md:block" />
            
            <CabinClassSelector value={cabinClass} onChange={setCabinClass} />
            
            <div className="h-12 w-px bg-border hidden md:block" />
            
            <VisaSelector value={visaOption} onChange={setVisaOption} />
          </div>
        )}

        {/* Search Button */}
        <div className="flex justify-center pt-2 sm:pt-4">
          <Button
            onClick={handleSearch}
            disabled={!origin || (!isAnywhereSearch && !destination) || !departDate || isLoading}
            size="lg"
            className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 rounded-xl sm:rounded-2xl gradient-primary hover:opacity-90 text-primary-foreground font-semibold text-sm sm:text-base shadow-lg shadow-primary/25 btn-interactive disabled:opacity-50 touch-target"
          >
            {isLoading ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Plane className="h-5 w-5 animate-bounce-gentle" />
                <span>{t('common.loading')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Search className="h-5 w-5" />
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