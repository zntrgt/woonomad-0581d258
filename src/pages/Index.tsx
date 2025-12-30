import { useState, useMemo, useRef } from 'react';
import { Plane } from 'lucide-react';
import { SearchForm, SearchFormRef } from '@/components/SearchForm';
import { PopularRoutes } from '@/components/PopularRoutes';
import { FlightCard } from '@/components/FlightCard';
import { FlightFilters, FilterOptions } from '@/components/FlightFilters';
import { SettingsDropdown } from '@/components/SettingsDropdown';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { useFavorites } from '@/hooks/useFavorites';
import { useSettings } from '@/contexts/SettingsContext';
import { SearchParams, Flight, Airport } from '@/lib/types';
import { cn } from '@/lib/utils';
import { parseISO, format } from 'date-fns';
import { tr } from 'date-fns/locale';

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
  const [lastSearchParams, setLastSearchParams] = useState<SearchParams | null>(null);

  const handleSearch = (params: SearchParams) => {
    setLastSearchParams(params);
    searchFlights(params);
  };

  const handlePopularRouteSelect = (originCode: string, destinationCode: string) => {
    const origin = airportLookup[originCode];
    const destination = airportLookup[destinationCode];
    
    if (origin && destination && searchFormRef.current) {
      searchFormRef.current.setAirports(origin, destination);
      // Trigger search after a brief delay to allow state update
      setTimeout(() => {
        searchFormRef.current?.triggerSearch();
      }, 100);
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

  // Format date for display
  const formatDisplayDate = (dateStr: string) => {
    return format(parseISO(dateStr), 'd MMMM', { locale: tr });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header with Settings */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm text-foreground hidden sm:inline">Hafta Sonu Kaçamağı</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/destinasyonlar" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Tüm Destinasyonlar
            </a>
            <SettingsDropdown />
          </div>
        </div>
      </header>

      {/* Hero Section - Google style centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 md:px-4 py-6 md:py-8">
        {/* Logo & Title */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Plane className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
          <h1 className="text-xl md:text-3xl font-display font-semibold text-foreground">
            Hafta Sonu Kaçamağı
          </h1>
        </div>

        {/* Search Form - centered like Google */}
        <div className="w-full max-w-2xl px-1">
          <SearchForm
            ref={searchFormRef}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>

        {/* Popular Routes - subtle below search */}
        <div className="mt-6 md:mt-8 w-full max-w-2xl">
          <PopularRoutes onRouteSelect={handlePopularRouteSelect} />
        </div>
      </div>

      {/* Results Section - only appears after search */}
      {(flights.length > 0 || isLoading || error) && (
        <div className="bg-muted border-t border-border">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-4 text-center text-sm">
                {error}
              </div>
            )}

            {flights.length > 0 && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <span className="text-sm text-muted-foreground">
                    {filteredAndSortedFlights.length} uçuş bulundu
                  </span>
                  
                  <FlightFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    availableAirlines={availableAirlines}
                    maxPrice={maxPrice}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                  />
                </div>

                <div className="space-y-2">
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
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Filtrelere uygun uçuş bulunamadı
                  </div>
                )}
              </>
            )}

            {isLoading && (
              <div className="text-center py-10">
                <Plane className="h-8 w-8 mx-auto text-primary animate-bounce mb-2" />
                <p className="text-muted-foreground text-sm">Uçuşlar aranıyor...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
