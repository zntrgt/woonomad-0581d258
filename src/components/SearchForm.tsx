import { useState, forwardRef, useImperativeHandle, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ArrowRightLeft, Plane, Sparkles, Settings2, Plus, X, MapPin } from 'lucide-react';
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
import { PopularRouteChips } from './PopularRouteChips';
import { Airport, SearchParams, CabinClass, VisaOption } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useSettings } from '@/contexts/SettingsContext';
import { Badge } from '@/components/ui/badge';
import { useUserLocation } from '@/hooks/useUserLocation';

export interface SearchFormRef {
  setAirports: (origin: Airport | undefined, destination: Airport) => void;
  triggerSearch: () => void;
}

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading?: boolean;
}

interface FlightLeg {
  origin: Airport | null;
  destination: Airport | null;
  date: Date | undefined;
}

type TripType = 'roundtrip' | 'oneway' | 'multicity';

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
    const { originAirport } = useUserLocation();
    
    // Trip type state
    const [tripType, setTripType] = useState<TripType>('roundtrip');
    
    // Standard round-trip / one-way state
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
    
    // Multi-city legs
    const [legs, setLegs] = useState<FlightLeg[]>([
      { origin: null, destination: null, date: nextWeekend.saturday },
      { origin: null, destination: null, date: addDays(nextWeekend.saturday, 3) },
    ]);
    
    const isAnywhereSearch = destination?.code === '';
    const isOneWay = tripType === 'oneway';
    const isMultiCity = tripType === 'multicity';

    // Handle popular route selection
    const handlePopularRouteSelect = useCallback((destinationCode: string) => {
      // Set origin based on user's location if not already set
      if (!origin) {
        setOrigin({
          code: originAirport,
          name: originAirport,
          city: originAirport === 'IST' ? 'İstanbul' : originAirport,
          country: 'Türkiye',
        });
      }
      // Set destination
      setDestination({
        code: destinationCode,
        name: destinationCode,
        city: destinationCode,
        country: '',
      });
    }, [origin, originAirport]);

    useImperativeHandle(ref, () => ({
      setAirports: (newOrigin: Airport | undefined, newDestination: Airport) => {
        if (newOrigin) setOrigin(newOrigin);
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

    // Multi-city leg handlers
    const updateLeg = (index: number, field: keyof FlightLeg, value: Airport | null | Date | undefined) => {
      setLegs(prev => {
        const newLegs = [...prev];
        newLegs[index] = { ...newLegs[index], [field]: value };
        
        // Auto-chain: next leg's origin = current leg's destination
        if (field === 'destination' && index < newLegs.length - 1) {
          newLegs[index + 1].origin = value as Airport | null;
        }
        
        return newLegs;
      });
    };

    const addLeg = () => {
      if (legs.length >= 6) return;
      const lastLeg = legs[legs.length - 1];
      const newDate = lastLeg.date ? addDays(lastLeg.date, 3) : addDays(startOfToday(), 7);
      setLegs([...legs, { 
        origin: lastLeg.destination, 
        destination: null, 
        date: newDate 
      }]);
    };

    const removeLeg = (index: number) => {
      if (legs.length <= 2) return;
      setLegs(prev => prev.filter((_, i) => i !== index));
    };

    const handleSearch = () => {
      if (isMultiCity) {
        // For multi-city, send all legs to backend
        const validLegs = legs.filter(l => l.origin && l.destination && l.date);
        if (validLegs.length < 2) return;
        
        // Create legs array for backend
        const legParams = validLegs.map(l => ({
          origin: l.origin!.code,
          destination: l.destination!.code,
          departDate: format(l.date!, 'yyyy-MM-dd'),
        }));
        
        onSearch({
          origin: legParams[0].origin,
          destination: legParams[0].destination,
          departDate: legParams[0].departDate,
          returnDate: undefined,
          adults: passengers.adults,
          children: passengers.children,
          infants: passengers.infants,
          tripClass: cabinClass,
          visaFilter: visaOption,
          flexibleDates: isFlexible,
          currency,
          tripType: 'multicity',
          legs: legParams,
        });
        return;
      }
      
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
        tripType: isOneWay ? 'oneway' : 'roundtrip',
      });
    };

    // Trip type options
    const tripTypeOptions = [
      { label: t('search.roundTrip'), value: 'roundtrip' as TripType },
      { label: t('search.oneWay'), value: 'oneway' as TripType },
      { label: 'Çoklu Şehir', value: 'multicity' as TripType },
    ];

    return (
      <div className="space-y-3 sm:space-y-4">
        {/* Standard Search (Round-trip / One-way) */}
        {!isMultiCity && (
          <>
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
              originCode={origin?.code}
              destinationCode={destination?.code}
              currency={currency}
            />
          </>
        )}

        {/* Multi-City Search */}
        {isMultiCity && (
          <div className="space-y-3">
            {legs.map((leg, index) => (
              <div 
                key={index} 
                className="relative p-3 rounded-xl border border-border bg-card/50"
              >
                {/* Leg number badge */}
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 left-3 text-[10px] px-2 py-0"
                >
                  Uçuş {index + 1}
                </Badge>
                
                {/* Remove button */}
                {legs.length > 2 && (
                  <button
                    onClick={() => removeLeg(index)}
                    className="absolute -top-2 right-3 p-0.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                
                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end mt-2">
                  <div className="flex-1">
                    <AirportInput
                      label="Nereden"
                      placeholder="Havalimanı seç"
                      value={leg.origin}
                      onChange={(val) => updateLeg(index, 'origin', val)}
                      icon="origin"
                    />
                  </div>
                  
                  <div className="self-center sm:self-auto px-2">
                    <Plane className="h-4 w-4 text-muted-foreground rotate-90 sm:rotate-0" />
                  </div>

                  <div className="flex-1">
                    <AirportInput
                      label="Nereye"
                      placeholder="Havalimanı seç"
                      value={leg.destination}
                      onChange={(val) => updateLeg(index, 'destination', val)}
                      icon="destination"
                    />
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all min-w-[80px]">
                          <span className="text-[10px] text-muted-foreground">Tarih</span>
                          <span className="text-sm font-semibold">
                            {leg.date ? format(leg.date, 'd MMM') : 'Seç'}
                          </span>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <div className="p-3">
                          <input
                            type="date"
                            value={leg.date ? format(leg.date, 'yyyy-MM-dd') : ''}
                            onChange={(e) => updateLeg(index, 'date', e.target.value ? new Date(e.target.value) : undefined)}
                            min={format(startOfToday(), 'yyyy-MM-dd')}
                            className="w-full p-2 rounded-md border border-border bg-background text-sm"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Leg Button */}
            {legs.length < 6 && (
              <button
                onClick={addLeg}
                className="w-full py-2 rounded-lg border border-dashed border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Uçuş Ekle
              </button>
            )}
            
            {/* Multi-city route summary */}
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>
                {legs.filter(l => l.origin && l.destination).length} uçuş seçili
                {legs.every(l => l.destination) && legs[0].origin && legs[legs.length - 1].destination && (
                  <span className="ml-1">
                    ({legs[0].origin?.city} → {legs[legs.length - 1].destination?.city})
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Compact Options Row */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {/* Trip Type Toggle */}
          <div className="flex items-center bg-muted rounded-full p-0.5">
            {tripTypeOptions.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setTripType(value)}
                className={cn(
                  "px-2 sm:px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all",
                  tripType === value
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
          
          {isAnywhereSearch && !isMultiCity && (
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
            disabled={
              isMultiCity 
                ? !legs[0].origin || !legs[0].destination || !legs[0].date
                : !origin || (!isAnywhereSearch && !destination) || !departDate || isLoading
            }
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
                <span>
                  {isAnywhereSearch 
                    ? t('home.exploreMore') 
                    : isMultiCity 
                      ? 'Çoklu Şehir Ara' 
                      : t('search.searchFlights')
                  }
                </span>
              </div>
            )}
          </Button>
        </div>

        {/* Popular Route Chips - Show when no destination selected */}
        {!isMultiCity && !destination && (
          <PopularRouteChips 
            onSelect={handlePopularRouteSelect}
            className="pt-2"
          />
        )}
      </div>
    );
  }
);

SearchForm.displayName = 'SearchForm';
