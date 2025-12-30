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
        body: { query },
      });
      
      if (error) {
        console.error('Airport search error:', error);
        setAirports([]);
        return;
      }
      
      if (data?.success && data.data) {
        setAirports(data.data);
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
