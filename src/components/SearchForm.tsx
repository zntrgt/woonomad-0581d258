import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Search, Users, ArrowRightLeft, Plane } from 'lucide-react';
import { format, addDays, startOfWeek, startOfToday, isBefore } from 'date-fns';
import { Button } from '@/components/ui/button';
import { AirportInput } from './AirportInput';
import { CabinClassSelector } from './CabinClassSelector';
import { VisaSelector } from './VisaSelector';
import { FlightDatePicker } from './FlightDatePicker';
import { Airport, SearchParams, CabinClass, VisaOption } from '@/lib/types';
import { cn } from '@/lib/utils';

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
  
  // If this weekend has passed, get next week's weekend
  if (isBefore(sunday, today)) {
    saturday = addDays(saturday, 7);
    sunday = addDays(sunday, 7);
  }
  
  return { saturday, sunday };
}

export const SearchForm = forwardRef<SearchFormRef, SearchFormProps>(
  ({ onSearch, isLoading }, ref) => {
    const [origin, setOrigin] = useState<Airport | null>(null);
    const [destination, setDestination] = useState<Airport | null>(null);
    const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
    const [cabinClass, setCabinClass] = useState<CabinClass>('Y');
    const [visaOption, setVisaOption] = useState<VisaOption>('all');
    const [showAdvanced, setShowAdvanced] = useState(false);
    
    // Date state - default to next weekend
    const nextWeekend = getNextWeekend();
    const [departDate, setDepartDate] = useState<Date | undefined>(nextWeekend.saturday);
    const [returnDate, setReturnDate] = useState<Date | undefined>(nextWeekend.sunday);
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
      });
    };

    const totalPassengers = passengers.adults + passengers.children + passengers.infants;

    return (
      <div className="space-y-5">
        {/* Main Search Box */}
        <div className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1">
            <AirportInput
              label="Nereden"
              placeholder="Şehir veya havalimanı"
              value={origin}
              onChange={setOrigin}
              icon="origin"
            />
          </div>
          
          <button
            onClick={handleSwap}
            disabled={isAnywhereSearch}
            className="p-2.5 rounded-full border border-border hover:bg-muted transition-colors disabled:opacity-40 mb-1"
          >
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </button>

          <div className="flex-1">
            <AirportInput
              label="Nereye"
              placeholder="Şehir veya havalimanı"
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

        {/* Options Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          {/* Trip Type */}
          <div className="flex items-center gap-1 bg-muted rounded-full p-0.5">
            {['Gidiş-Dönüş', 'Tek Yön'].map((label, i) => (
              <button
                key={label}
                onClick={() => setIsOneWay(i === 1)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm transition-colors",
                  (i === 0 ? !isOneWay : isOneWay)
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          
          {/* Passengers */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Users className="h-4 w-4" />
            <span>{passengers.adults + passengers.children} yolcu</span>
          </button>
          
          {isAnywhereSearch && (
            <span className="px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">
              🌍 Her Yer
            </span>
          )}
        </div>

        {/* Expanded Options */}
        {showAdvanced && (
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-border">
            {/* Passengers */}
            <div className="flex items-center gap-4">
              {[
                { key: 'adults', label: 'Yetişkin', min: 1 },
                { key: 'children', label: 'Çocuk', min: 0 },
                { key: 'infants', label: 'Bebek', min: 0 },
              ].map(({ key, label, min }) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <div className="flex items-center">
                    <button
                      onClick={() => setPassengers(p => ({ ...p, [key]: Math.max(min, (p as any)[key] - 1) }))}
                      className="w-7 h-7 rounded-full border border-border text-sm hover:bg-muted"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm">{(passengers as any)[key]}</span>
                    <button
                      onClick={() => setPassengers(p => ({ ...p, [key]: Math.min(9, (p as any)[key] + 1) }))}
                      className="w-7 h-7 rounded-full border border-border text-sm hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="h-5 w-px bg-border" />
            
            <CabinClassSelector value={cabinClass} onChange={setCabinClass} />
            
            <div className="h-5 w-px bg-border" />
            
            <VisaSelector value={visaOption} onChange={setVisaOption} />
          </div>
        )}

        {/* Search Button */}
        <div className="flex justify-center pt-2">
          <Button
            onClick={handleSearch}
            disabled={!origin || (!isAnywhereSearch && !destination) || !departDate || isLoading}
            className="h-11 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4 animate-bounce" />
                <span>Aranıyor...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>{isAnywhereSearch ? 'Her Yeri Ara' : 'Uçuş Ara'}</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    );
  }
);

SearchForm.displayName = 'SearchForm';
