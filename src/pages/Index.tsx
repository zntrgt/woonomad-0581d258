import { useState, useMemo, useRef } from 'react';
import { Plane } from 'lucide-react';
import { WeekendSelector } from '@/components/WeekendSelector';
import { SearchForm, SearchFormRef } from '@/components/SearchForm';
import { PopularRoutes } from '@/components/PopularRoutes';
import { FlightCard } from '@/components/FlightCard';
import { FlightFilters, FilterOptions } from '@/components/FlightFilters';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { useWeekendDates } from '@/hooks/useWeekendDates';
import { useFavorites } from '@/hooks/useFavorites';
import { SearchParams, Flight, Airport } from '@/lib/types';
import { cn } from '@/lib/utils';
import { parseISO } from 'date-fns';

type SortOption = 'price' | 'duration' | 'departure' | 'best';

// Airport lookup for popular routes
const airportLookup: Record<string, Airport> = {
  'IST': { code: 'IST', name: 'İstanbul Havalimanı', city: 'İstanbul', country: 'Türkiye' },
  'SAW': { code: 'SAW', name: 'Sabiha Gökçen', city: 'İstanbul', country: 'Türkiye' },
  'ESB': { code: 'ESB', name: 'Esenboğa Havalimanı', city: 'Ankara', country: 'Türkiye' },
  'AYT': { code: 'AYT', name: 'Antalya Havalimanı', city: 'Antalya', country: 'Türkiye' },
  'ADB': { code: 'ADB', name: 'Adnan Menderes', city: 'İzmir', country: 'Türkiye' },
  'BCN': { code: 'BCN', name: 'El Prat', city: 'Barselona', country: 'İspanya' },
  'ATH': { code: 'ATH', name: 'Eleftherios Venizelos', city: 'Atina', country: 'Yunanistan' },
  'CDG': { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'Fransa' },
  'FCO': { code: 'FCO', name: 'Fiumicino', city: 'Roma', country: 'İtalya' },
  'DXB': { code: 'DXB', name: 'Dubai', city: 'Dubai', country: 'BAE' },
};

const Index = () => {
  const { 
    currentWeekend, 
    tripDuration, 
    setTripDuration,
    goToNextWeek,
    goToPrevWeek,
    canGoPrev,
    canGoNext,
    formatDate, 
    formatDateForApi 
  } = useWeekendDates();
  const { flights, isLoading, error, searchFlights } = useFlightSearch();
  const { isFavorite, toggleFavorite } = useFavorites();
  const searchFormRef = useRef<SearchFormRef>(null);
  
  const [sortBy, setSortBy] = useState<SortOption>('best');
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 100000],
    maxStops: -1,
    airlines: [],
    departureTimeRange: [0, 24],
  });

  const handleSearch = (params: SearchParams) => {
    searchFlights(params);
  };

  const handlePopularRouteSelect = (originCode: string, destinationCode: string) => {
    const origin = airportLookup[originCode];
    const destination = airportLookup[destinationCode];
    
    if (origin && destination && searchFormRef.current) {
      searchFormRef.current.setAirports(origin, destination);
    }
  };

  const availableAirlines = useMemo(() => {
    return [...new Set(flights.map(f => f.airline))];
  }, [flights]);

  const maxPrice = useMemo(() => {
    return Math.max(...flights.map(f => f.price), 10000);
  }, [flights]);

  const filteredAndSortedFlights = useMemo(() => {
    let result = flights.filter(flight => {
      if (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1]) return false;
      if (filters.maxStops !== -1 && flight.transfers > filters.maxStops) return false;
      if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) return false;
      const departHour = parseISO(flight.departure_at).getHours();
      if (departHour < filters.departureTimeRange[0] || departHour > filters.departureTimeRange[1]) return false;
      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price': return a.price - b.price;
        case 'duration': return a.duration - b.duration;
        case 'departure': return new Date(a.departure_at).getTime() - new Date(b.departure_at).getTime();
        case 'best': return (a.price / 1000 + a.duration / 60) - (b.price / 1000 + b.duration / 60);
        default: return 0;
      }
    });

    return result;
  }, [flights, filters, sortBy]);

  const getRank = (flight: Flight, index: number): 'cheapest' | 'fastest' | 'best' | null => {
    if (flights.length < 3) return null;
    const cheapest = [...flights].sort((a, b) => a.price - b.price)[0];
    const fastest = [...flights].sort((a, b) => a.duration - b.duration)[0];
    if (flight === cheapest) return 'cheapest';
    if (flight === fastest) return 'fastest';
    if (index === 0 && sortBy === 'best') return 'best';
    return null;
  };

  // Calculate return date based on trip duration
  const departDate = formatDateForApi(currentWeekend.saturday);
  const returnDate = tripDuration === '1-1' ? undefined : formatDateForApi(currentWeekend.sunday);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float">✈️</div>
        <div className="absolute top-40 right-20 text-4xl opacity-10 animate-float-delayed">☁️</div>
        <div className="absolute bottom-40 left-1/4 text-5xl opacity-10 animate-float">🌴</div>
        <div className="absolute top-1/3 right-1/3 text-3xl opacity-10 animate-float-delayed">🌍</div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl gradient-primary shadow-glow">
              <Plane className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient">
              Hafta Sonu Kaçamağı
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            En uygun hafta sonu uçuşlarını bul, hemen rezervasyon yap!
          </p>
        </header>

        {/* Weekend Selector */}
        <div className="mb-8">
          <WeekendSelector
            startDate={currentWeekend.saturday}
            endDate={currentWeekend.sunday}
            label={currentWeekend.label}
            tripDuration={tripDuration}
            onTripDurationChange={setTripDuration}
            onPrev={goToPrevWeek}
            onNext={goToNextWeek}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            formatDate={formatDate}
          />
        </div>

        {/* Popular Routes */}
        <div className="max-w-4xl mx-auto mb-8">
          <PopularRoutes onRouteSelect={handlePopularRouteSelect} />
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto mb-10">
          <SearchForm
            ref={searchFormRef}
            departDate={departDate}
            returnDate={returnDate}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>

        {/* Results */}
        {(flights.length > 0 || isLoading || error) && (
          <div className="max-w-4xl mx-auto">
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-2xl mb-6 text-center">
                {error}
              </div>
            )}

            {flights.length > 0 && (
              <>
                <FlightFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  availableAirlines={availableAirlines}
                  maxPrice={maxPrice}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />

                <div className="mt-4 mb-2 text-sm text-muted-foreground">
                  {filteredAndSortedFlights.length} uçuş bulundu
                </div>

                <div className="space-y-4">
                  {filteredAndSortedFlights.map((flight, index) => (
                    <FlightCard
                      key={`${flight.flight_number}-${flight.departure_at}`}
                      flight={flight}
                      isFavorite={isFavorite(flight)}
                      onToggleFavorite={() => toggleFavorite(flight)}
                      rank={getRank(flight, index)}
                    />
                  ))}
                </div>

                {filteredAndSortedFlights.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    Filtrelere uygun uçuş bulunamadı
                  </div>
                )}
              </>
            )}

            {isLoading && (
              <div className="text-center py-16">
                <Plane className="h-12 w-12 mx-auto text-primary animate-bounce mb-4" />
                <p className="text-muted-foreground">Uçuşlar aranıyor...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
