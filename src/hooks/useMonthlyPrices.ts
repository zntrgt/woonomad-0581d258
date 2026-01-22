import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DayPrice {
  date: string;
  price: number;
  airline?: string;
  hasDirectFlight?: boolean;
}

export interface MonthlyPricesResult {
  prices: DayPrice[];
  minPrice: number | null;
  maxPrice: number | null;
  currency: string;
}

export function useMonthlyPrices() {
  const [prices, setPrices] = useState<DayPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const fetchMonthlyPrices = useCallback(async (params: {
    origin: string;
    destination: string;
    month: string; // YYYY-MM
    currency?: string;
  }) => {
    if (!params.origin || !params.destination) {
      setError('Kalkış ve varış havalimanları gerekli');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setPrices([]);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('get-monthly-prices', {
        body: params
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.prices) {
        setPrices(data.prices);
        setMinPrice(data.minPrice);
        setMaxPrice(data.maxPrice);
        return data as MonthlyPricesResult;
      }

      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fiyat bilgisi alınamadı';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearPrices = useCallback(() => {
    setPrices([]);
    setMinPrice(null);
    setMaxPrice(null);
    setError(null);
  }, []);

  return {
    prices,
    isLoading,
    error,
    minPrice,
    maxPrice,
    fetchMonthlyPrices,
    clearPrices,
  };
}
