import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Flight, SearchParams } from '@/lib/types';

interface FlightSearchResult {
  flights: Flight[];
  isLoading: boolean;
  error: string | null;
  searchFlights: (params: SearchParams) => Promise<void>;
}

export function useFlightSearch(): FlightSearchResult {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchFlights = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setFlights([]);

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

      const allFlights: Flight[] = data.data || [];
      
      // API already filters by date, just use results directly
      setFlights(allFlights);
      
      if (allFlights.length === 0) {
        setError('Bu rota için uçuş bulunamadı. Farklı bir destinasyon deneyin.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bir hata oluştu';
      setError(errorMessage);
      console.error('Flight search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { flights, isLoading, error, searchFlights };
}
