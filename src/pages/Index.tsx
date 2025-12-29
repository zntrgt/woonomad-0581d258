import { useState, useMemo } from 'react';
import { Plane, Cloud, Heart } from 'lucide-react';
import { WeekendSelector } from '@/components/WeekendSelector';
import { SearchForm } from '@/components/SearchForm';
import { FlightCard } from '@/components/FlightCard';
import { FlightFilters, FilterOptions } from '@/components/FlightFilters';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { useWeekendDates } from '@/hooks/useWeekendDates';
import { useFavorites } from '@/hooks/useFavorites';
import { SearchParams, Flight } from '@/lib/types';
import { cn } from '@/lib/utils';
import { parseISO } from 'date-fns';

type SortOption = 'price' | 'duration' | 'departure' | 'best';

const Index = () => {
  const { currentWeekend, formatDateForApi } = useWeekendDates();
  const { flights, isLoading, error, searchFlights } = useFlightSearch();
  const { isFavorite, toggleFavorite } = useFavorites();
  
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
          <WeekendSelector />
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto mb-10">
          <SearchForm
            departDate={formatDateForApi(currentWeekend.saturday)}
            returnDate={formatDateForApi(currentWeekend.sunday)}
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
