import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Hotel {
  id: string;
  name: string;
  stars: number;
  priceFrom: number;
  priceAvg: number;
  rating: number;
  reviews: number;
  location: {
    lat: number;
    lon: number;
  };
  photo: string | null;
  link: string;
}

export interface HotelSearchResult {
  hotels: Hotel[];
  cityId: string;
  checkIn: string;
  checkOut: string;
  currency: string;
}

export function useHotelSearch() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const searchHotels = async (params: {
    location: string;
    checkIn: string;
    checkOut: string;
    adults?: number;
    limit?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    setHotels([]);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('search-hotels', {
        body: params
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        setError(data.error);
        setHotels([]);
      } else {
        setHotels(data?.hotels || []);
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Otel arama hatası';
      setError(message);
      toast({
        title: 'Hata',
        description: message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    hotels,
    isLoading,
    error,
    searchHotels,
  };
}
