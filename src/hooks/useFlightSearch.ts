import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Flight, SearchParams } from '@/lib/types';
import { parseISO, isSameDay, isWithinInterval, addDays } from 'date-fns';

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

      if (!data.success) {
        throw new Error(data.error || 'Uçuş araması başarısız oldu');
      }

      // Filter flights to only show ones matching the selected weekend dates
      const departDate = parseISO(params.departDate);
      const returnDate = params.returnDate ? parseISO(params.returnDate) : null;
      
      const filteredFlights = (data.data || []).filter((flight: Flight) => {
        const flightDepartDate = parseISO(flight.departure_at);
        
        // Check if departure is on the selected depart date (or within 1 day for flexibility)
        const departInterval = {
          start: departDate,
          end: addDays(departDate, 1)
        };
        const isDepartValid = isWithinInterval(flightDepartDate, departInterval) || 
                              isSameDay(flightDepartDate, departDate);
        
        // If it's a round trip, also check return date
        if (returnDate && flight.return_at) {
          const flightReturnDate = parseISO(flight.return_at);
          const returnInterval = {
            start: returnDate,
            end: addDays(returnDate, 1)
          };
          const isReturnValid = isWithinInterval(flightReturnDate, returnInterval) || 
                                isSameDay(flightReturnDate, returnDate);
          return isDepartValid && isReturnValid;
        }
        
        return isDepartValid;
      });

      setFlights(filteredFlights);
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
