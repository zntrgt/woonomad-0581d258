import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Flight, SearchParams, MultiCityResult } from '@/lib/types';
import { SearchState, flightSearchTelemetry } from '@/components/SearchStatus';

interface FlightSearchResult {
  flights: Flight[];
  isLoading: boolean;
  error: string | null;
  searchState: SearchState;
  searchFlights: (params: SearchParams) => Promise<void>;
  // Multi-city results
  isMultiCity: boolean;
  multiCityResults: MultiCityResult | null;
}

export function useFlightSearch(): FlightSearchResult {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [isMultiCity, setIsMultiCity] = useState(false);
  const [multiCityResults, setMultiCityResults] = useState<MultiCityResult | null>(null);

  const searchFlights = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setFlights([]);
    setSearchState('loading');
    setIsMultiCity(params.tripType === 'multicity');
    setMultiCityResults(null);
    
    // Telemetry: search submitted
    flightSearchTelemetry.submitted(params);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('search-flights', {
        body: params,
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Uçuş araması başarısız oldu');
      }

      // Handle multi-city response
      if (data.isMultiCity && data.data?.legs) {
        setMultiCityResults(data.data as MultiCityResult);
        
        // Flatten all flights from all legs for display
        const allFlights: Flight[] = data.data.legs.flatMap((leg: any) => 
          leg.flights.map((f: any) => ({
            ...f,
            legIndex: leg.legIndex,
            legOrigin: leg.origin,
            legDestination: leg.destination,
            legDate: leg.date,
          }))
        );
        
        setFlights(allFlights);
        
        if (allFlights.length === 0) {
          setSearchState('no-results');
          setError('Çoklu şehir araması için uygun uçuş bulunamadı.');
          flightSearchTelemetry.noResults();
        } else {
          setSearchState('success');
          flightSearchTelemetry.success(allFlights.length);
        }
      } else {
        // Standard search response
        const allFlights: Flight[] = data.data || [];
        
        setFlights(allFlights);
        
        if (allFlights.length === 0) {
          setSearchState('no-results');
          setError('Bu rota için uçuş bulunamadı. Farklı bir destinasyon deneyin.');
          flightSearchTelemetry.noResults();
        } else {
          setSearchState('success');
          flightSearchTelemetry.success(allFlights.length);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bir hata oluştu';
      setError(errorMessage);
      setSearchState('error');
      flightSearchTelemetry.error(errorMessage);
      console.error('Flight search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { flights, isLoading, error, searchState, searchFlights, isMultiCity, multiCityResults };
}
