import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Airport } from '@/lib/types';

export function useAirportSearch() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchAirports = useCallback(async (query: string) => {
    if (query.length < 2) {
      setAirports([]);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('get-airports', {
        body: null,
        headers: {},
      });

      // Call with query param through URL doesn't work with invoke, so filter locally
      // Get all airports and filter
      const { data: allData } = await supabase.functions.invoke('get-airports');
      
      if (allData?.success && allData.data) {
        const filtered = allData.data.filter((airport: Airport) =>
          airport.code.toLowerCase().includes(query.toLowerCase()) ||
          airport.name.toLowerCase().includes(query.toLowerCase()) ||
          airport.city.toLowerCase().includes(query.toLowerCase()) ||
          airport.country.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);
        setAirports(filtered);
      }
    } catch (err) {
      console.error('Airport search error:', err);
      setAirports([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAirports = useCallback(() => {
    setAirports([]);
  }, []);

  return { airports, isLoading, searchAirports, clearAirports };
}
