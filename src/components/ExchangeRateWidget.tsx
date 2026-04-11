import { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface ExchangeRateData {
  base: string;
  target: string;
  rate: number;
  displayRate: string;
  date?: string;
  source: string;
}

interface ExchangeRateWidgetProps {
  countryCode: string;
  currencyName: string;
}

export function ExchangeRateWidget({ countryCode, currencyName }: ExchangeRateWidgetProps) {
  const [rateData, setRateData] = useState<ExchangeRateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('get-exchange-rates', {
        body: { 
          countryCode,
          baseCurrency: 'TRY'
        }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setRateData(data);
    } catch (err) {
      console.error('Exchange rate fetch error:', err);
      setError('Kur alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRate();
  }, [countryCode]);

  if (loading) {
    return (
      <Card variant="elevated">
        <CardContent className="p-4">
          <Skeleton className="h-5 w-32 mb-3" />
          <Skeleton className="h-8 w-40" />
        </CardContent>
      </Card>
    );
  }

  if (error || !rateData) {
    return null;
  }

  // Don't show if same currency
  if (rateData.source === 'same-currency') {
    return null;
  }

  return (
    <Card variant="elevated">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-display font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Döviz Kuru
          </h3>
          <button 
            onClick={fetchRate}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            title="Yenile"
          >
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{rateData.rate.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">TRY</span>
          <span className="text-sm text-muted-foreground">= 1 {rateData.target}</span>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">
            {currencyName}
          </p>
          {rateData.date && (
            <span className="text-2xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {rateData.date}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
