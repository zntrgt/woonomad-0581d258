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
      <div className="space-y-4">
        <div className="flex flex-col gap-5">
          {/* Trip Type Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg bg-muted p-0.5">
              <button
                onClick={() => setIsOneWay(false)}
                className={cn(
                  "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                  !isOneWay 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Gidiş-Dönüş
              </button>
              <button
                onClick={() => setIsOneWay(true)}
                className={cn(
                  "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                  isOneWay 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Tek Yön
              </button>
            </div>
            {isAnywhereSearch && (
              <span className="px-2.5 py-1 rounded-lg text-xs bg-accent/10 text-accent font-medium">
                🌍 Her Yere Arama
              </span>
            )}
          </div>

          {/* Origin & Destination */}
          <div className="flex flex-col md:flex-row gap-3 items-end">
            <AirportInput
              label="Nereden"
              placeholder="Şehir, ülke, bölge veya kıta ara..."
              value={origin}
              onChange={setOrigin}
              icon="origin"
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwap}
              disabled={isAnywhereSearch}
              className={cn(
                "h-11 w-11 rounded-lg shrink-0",
                "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground",
                "transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>

            <AirportInput
              label="Nereye"
              placeholder="Şehir, ülke, bölge veya kıta ara..."
              value={destination}
              onChange={setDestination}
              icon="destination"
              showAnywhereOption={true}
            />
          </div>

          {/* Date Picker */}
          <FlightDatePicker
            departDate={departDate}
            returnDate={returnDate}
            onDepartDateChange={setDepartDate}
            onReturnDateChange={setReturnDate}
            isFlexible={isFlexible}
            onFlexibleChange={setIsFlexible}
            isOneWay={isOneWay}
          />

          {/* Cabin Class & Visa Options */}
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Kabin Sınıfı</label>
              <CabinClassSelector value={cabinClass} onChange={setCabinClass} />
            </div>
            
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
            >
              {showAdvanced ? 'Daha az seçenek' : 'Daha fazla seçenek'}
            </button>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="flex flex-col gap-3 pt-3 border-t border-border">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Vize Durumu (Opsiyonel)</label>
                <VisaSelector value={visaOption} onChange={setVisaOption} />
                <p className="text-xs text-muted-foreground">
                  * Vize gereklilikleri ülkeye ve pasaport türüne göre değişebilir
                </p>
              </div>
            </div>
          )}

          {/* Passengers */}
          <div className="flex flex-col md:flex-row gap-3 items-end justify-between">
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Yolcular
              </label>
              <div className="flex items-center gap-3 bg-muted rounded-lg p-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Adults */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Yetişkin</span>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => setPassengers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                        className="w-7 h-7 rounded-md bg-card border border-border text-foreground hover:bg-background transition-colors text-sm"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{passengers.adults}</span>
                      <button
                        onClick={() => setPassengers(p => ({ ...p, adults: Math.min(9, p.adults + 1) }))}
                        className="w-7 h-7 rounded-md bg-card border border-border text-foreground hover:bg-background transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Çocuk</span>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => setPassengers(p => ({ ...p, children: Math.max(0, p.children - 1) }))}
                        className="w-7 h-7 rounded-md bg-card border border-border text-foreground hover:bg-background transition-colors text-sm"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{passengers.children}</span>
                      <button
                        onClick={() => setPassengers(p => ({ ...p, children: Math.min(9, p.children + 1) }))}
                        className="w-7 h-7 rounded-md bg-card border border-border text-foreground hover:bg-background transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Bebek</span>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => setPassengers(p => ({ ...p, infants: Math.max(0, p.infants - 1) }))}
                        className="w-7 h-7 rounded-md bg-card border border-border text-foreground hover:bg-background transition-colors text-sm"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{passengers.infants}</span>
                      <button
                        onClick={() => setPassengers(p => ({ ...p, infants: Math.min(passengers.adults, p.infants + 1) }))}
                        className="w-7 h-7 rounded-md bg-card border border-border text-foreground hover:bg-background transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={!origin || (!isAnywhereSearch && !destination) || !departDate || isLoading}
              className="h-11 px-6 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-1.5">
                  <Plane className="h-4 w-4 animate-bounce" />
                  <span>Aranıyor...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Search className="h-4 w-4" />
                  <span>{isAnywhereSearch ? 'Her Yeri Ara' : 'Uçuş Ara'}</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

SearchForm.displayName = 'SearchForm';
