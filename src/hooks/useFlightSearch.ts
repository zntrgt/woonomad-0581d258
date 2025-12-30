import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Flight, SearchParams } from '@/lib/types';
import { parseISO, format } from 'date-fns';

interface FlightSearchResult {
  flights: Flight[];
  isLoading: boolean;
  error: string | null;
  searchFlights: (params: SearchParams) => Promise<void>;
}

function isoToLocalDate(iso: string): string | null {
  try {
    const d = parseISO(iso);
    if (Number.isNaN(d.getTime())) return null;
    return format(d, 'yyyy-MM-dd');
  } catch {
    return null;
  }
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

      // Strictly filter by the selected weekend dates (but timezone-safe).
      const filteredFlights = allFlights.filter((flight) => {
        const depart = isoToLocalDate(flight.departure_at);
        if (!depart || depart !== params.departDate) return false;

        if (params.returnDate) {
          if (!flight.return_at) return false;
          const ret = isoToLocalDate(flight.return_at);
          return !!ret && ret === params.returnDate;
        }

        return true;
      });

      setFlights(filteredFlights);
      if (filteredFlights.length === 0) {
        setError('Seçilen hafta sonu için uçuş bulunamadı.');
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
