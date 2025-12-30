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
      <div className={cn(
        "bg-card/80 backdrop-blur-lg rounded-3xl p-6 md:p-8",
        "border border-border/50 shadow-card",
        "animate-fade-in"
      )}>
        <div className="flex flex-col gap-6">
          {/* Trip Type Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-full bg-muted/50 p-1">
              <button
                onClick={() => setIsOneWay(false)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
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
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  isOneWay 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Tek Yön
              </button>
            </div>
            {isAnywhereSearch && (
              <span className={cn(
                "px-3 py-1 rounded-full text-sm",
                "bg-accent/10 text-accent font-medium"
              )}>
                🌍 Her Yere Arama
              </span>
            )}
          </div>

          {/* Origin & Destination */}
          <div className="flex flex-col md:flex-row gap-4 items-end">
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
                "h-14 w-14 rounded-full shrink-0",
                "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground",
                "transition-all duration-300 hover:rotate-180",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <ArrowRightLeft className="h-5 w-5" />
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
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground/80">Kabin Sınıfı</label>
              <CabinClassSelector value={cabinClass} onChange={setCabinClass} />
            </div>
            
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
            >
              {showAdvanced ? 'Daha az seçenek' : 'Daha fazla seçenek'}
            </button>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="flex flex-col gap-4 pt-4 border-t border-border/30 animate-fade-in">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground/80">Vize Durumu (Opsiyonel)</label>
                <VisaSelector value={visaOption} onChange={setVisaOption} />
                <p className="text-xs text-muted-foreground">
                  * Vize gereklilikleri ülkeye ve pasaport türüne göre değişebilir
                </p>
              </div>
            </div>
          )}

          {/* Passengers */}
          <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Yolcular
              </label>
              <div className="flex items-center gap-4 bg-muted/50 rounded-2xl p-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Users className="h-4 w-4" />
                </div>
                
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Adults */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Yetişkin</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPassengers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                        className="w-8 h-8 rounded-full bg-card border border-border text-foreground hover:bg-muted transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{passengers.adults}</span>
                      <button
                        onClick={() => setPassengers(p => ({ ...p, adults: Math.min(9, p.adults + 1) }))}
                        className="w-8 h-8 rounded-full bg-card border border-border text-foreground hover:bg-muted transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Çocuk</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPassengers(p => ({ ...p, children: Math.max(0, p.children - 1) }))}
                        className="w-8 h-8 rounded-full bg-card border border-border text-foreground hover:bg-muted transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{passengers.children}</span>
                      <button
                        onClick={() => setPassengers(p => ({ ...p, children: Math.min(9, p.children + 1) }))}
                        className="w-8 h-8 rounded-full bg-card border border-border text-foreground hover:bg-muted transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Bebek</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPassengers(p => ({ ...p, infants: Math.max(0, p.infants - 1) }))}
                        className="w-8 h-8 rounded-full bg-card border border-border text-foreground hover:bg-muted transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{passengers.infants}</span>
                      <button
                        onClick={() => setPassengers(p => ({ ...p, infants: Math.min(passengers.adults, p.infants + 1) }))}
                        className="w-8 h-8 rounded-full bg-card border border-border text-foreground hover:bg-muted transition-colors"
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
              size="lg"
              className={cn(
                "h-14 px-8 rounded-2xl text-lg font-semibold",
                "gradient-primary text-primary-foreground",
                "shadow-glow hover:shadow-card-hover",
                "transition-all duration-300 hover:scale-105",
                "disabled:opacity-50 disabled:hover:scale-100"
              )}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Plane className="h-5 w-5 animate-bounce" />
                  <span>Aranıyor...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
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
