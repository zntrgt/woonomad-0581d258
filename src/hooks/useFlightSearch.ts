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

export function useFlightSearch(): FlightSearchResult {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchFlights = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setFlights([]);

    try {
      console.log('Searching flights with params:', params);
      
      const { data, error: fnError } = await supabase.functions.invoke('search-flights', {
        body: params,
      });

      console.log('Search response:', data);

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Uçuş araması başarısız oldu');
      }

      const allFlights = data.data || [];
      console.log('Total flights from API:', allFlights.length);

      // Filter flights by the selected departure date
      const selectedDepartDate = params.departDate; // Format: YYYY-MM-DD
      
      const filteredFlights = allFlights.filter((flight: Flight) => {
        // Get just the date part from departure_at (e.g., "2026-01-03T10:00:00" -> "2026-01-03")
        const flightDepartDate = flight.departure_at.split('T')[0];
        
        // Check if flight departs on the selected date
        const matchesDepartDate = flightDepartDate === selectedDepartDate;
        
        console.log(`Flight ${flight.flight_number}: depart=${flightDepartDate}, selected=${selectedDepartDate}, matches=${matchesDepartDate}`);
        
        return matchesDepartDate;
      });

      console.log('Filtered flights count:', filteredFlights.length);
      
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
