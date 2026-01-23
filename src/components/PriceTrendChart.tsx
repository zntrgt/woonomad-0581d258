import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMonthlyPrices, DayPrice } from '@/hooks/useMonthlyPrices';
import { useSettings } from '@/contexts/SettingsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Calendar, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format, parseISO, Locale } from 'date-fns';
import { tr, enUS, de, fr, es, ar } from 'date-fns/locale';

interface PriceTrendChartProps {
  origin: string;
  destination: string;
  month: string; // YYYY-MM
  className?: string;
}

const localeMap: Record<string, Locale> = {
  tr: tr,
  en: enUS,
  de: de,
  fr: fr,
  es: es,
  ar: ar,
};

export function PriceTrendChart({ origin, destination, month, className = '' }: PriceTrendChartProps) {
  const { t } = useTranslation();
  const { language, formatPrice, currency } = useSettings();
  const { prices, isLoading, error, minPrice, maxPrice, fetchMonthlyPrices } = useMonthlyPrices();

  const locale = localeMap[language] || tr;

  // Format chart data
  const chartData = useMemo(() => {
    if (!prices.length) return [];
    
    return prices.map((p: DayPrice) => ({
      date: p.date,
      price: p.price,
      displayDate: format(parseISO(p.date), 'd MMM', { locale }),
      airline: p.airline,
      isDirect: p.hasDirectFlight,
    }));
  }, [prices, locale]);

  // Calculate average price
  const avgPrice = useMemo(() => {
    if (!prices.length) return 0;
    return Math.round(prices.reduce((sum, p) => sum + p.price, 0) / prices.length);
  }, [prices]);

  // Find cheapest days
  const cheapestDays = useMemo(() => {
    if (!prices.length || !minPrice) return [];
    return prices
      .filter(p => p.price === minPrice)
      .slice(0, 3)
      .map(p => format(parseISO(p.date), 'd MMMM EEEE', { locale }));
  }, [prices, minPrice, locale]);

  const handleRefresh = () => {
    fetchMonthlyPrices({
      origin,
      destination,
      month,
      currency,
    });
  };

  // Auto-fetch when props change
  useMemo(() => {
    if (origin && destination && month) {
      fetchMonthlyPrices({ origin, destination, month, currency });
    }
  }, [origin, destination, month, currency]);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !chartData.length) {
    return null;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="font-semibold text-sm">{data.displayDate}</p>
          <p className="text-primary font-bold">{formatPrice(data.price)}</p>
          {data.airline && (
            <p className="text-xs text-muted-foreground">{data.airline}</p>
          )}
          {data.isDirect && (
            <p className="text-xs text-success">✓ Direkt uçuş</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`border-primary/20 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-primary" />
            {t('flights.priceCalendar', 'Fiyat Takvimi')}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={handleRefresh} className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {origin} → {destination} • {format(parseISO(`${month}-01`), 'MMMM yyyy', { locale })}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Price Chart */}
        <div className="h-40 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${Math.round(v / 1000)}K`}
                width={35}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={avgPrice} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="3 3"
                strokeOpacity={0.5}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-success">
              <TrendingDown className="h-3 w-3" />
              <span className="text-xs font-medium">{t('flights.cheapest', 'En Ucuz')}</span>
            </div>
            <p className="text-sm font-bold text-success">{formatPrice(minPrice || 0)}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span className="text-xs font-medium">{t('flights.average', 'Ortalama')}</span>
            </div>
            <p className="text-sm font-bold">{formatPrice(avgPrice)}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-destructive">
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs font-medium">{t('flights.expensive', 'En Pahalı')}</span>
            </div>
            <p className="text-sm font-bold text-destructive">{formatPrice(maxPrice || 0)}</p>
          </div>
        </div>

        {/* Cheapest days */}
        {cheapestDays.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">
              💡 {t('flights.cheapestDays', 'En uygun günler')}:
            </p>
            <p className="text-xs font-medium text-success">
              {cheapestDays.join(', ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
