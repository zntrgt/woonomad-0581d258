import { useState, useMemo } from 'react';
import { Calendar, DollarSign, Percent, TrendingDown, Hotel, Home, Building2, Calculator, Info, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LongStayPricingProps {
  cityName: string;
  citySlug: string;
  baseNightlyPrice?: number; // Base hotel price per night
  currency?: string;
}

interface PricingTier {
  days: number;
  label: string;
  discount: number;
  hotelTotal: number;
  hotelDaily: number;
  airbnbTotal: number;
  airbnbDaily: number;
  coliving: number;
  recommended: 'hotel' | 'airbnb' | 'coliving';
}

const accommodationTypes = [
  { id: 'hotel', label: 'Otel', icon: Hotel, description: 'Günlük temizlik, kahvaltı' },
  { id: 'airbnb', label: 'Airbnb', icon: Home, description: 'Mutfak, ev konforu' },
  { id: 'coliving', label: 'Coliving', icon: Building2, description: 'Topluluk, networking' },
];

export function LongStayPricing({ 
  cityName, 
  citySlug, 
  baseNightlyPrice = 1500, 
  currency = '₺' 
}: LongStayPricingProps) {
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [showDetails, setShowDetails] = useState(false);

  // Calculate pricing for different durations
  const pricingTiers = useMemo((): PricingTier[] => {
    const tiers = [
      { days: 7, label: '1 Hafta', baseDiscount: 0 },
      { days: 14, label: '2 Hafta', baseDiscount: 5 },
      { days: 30, label: '1 Ay', baseDiscount: 15 },
      { days: 60, label: '2 Ay', baseDiscount: 25 },
      { days: 90, label: '3 Ay', baseDiscount: 35 },
    ];

    return tiers.map(tier => {
      // Hotel pricing with volume discount
      const hotelDiscount = tier.baseDiscount;
      const hotelDaily = Math.round(baseNightlyPrice * (1 - hotelDiscount / 100));
      const hotelTotal = hotelDaily * tier.days;

      // Airbnb: typically 30% cheaper than hotels for long stays
      const airbnbBaseDiscount = 30;
      const airbnbLongStayBonus = tier.days >= 30 ? 15 : tier.days >= 14 ? 8 : 0;
      const airbnbDaily = Math.round(baseNightlyPrice * (1 - (airbnbBaseDiscount + airbnbLongStayBonus) / 100));
      const airbnbTotal = airbnbDaily * tier.days;

      // Coliving: fixed monthly rate, best value for 30+ days
      const colivingMonthly = Math.round(baseNightlyPrice * 20); // ~20 nights worth
      const coliving = Math.round((colivingMonthly / 30) * tier.days);

      // Determine recommended option
      let recommended: 'hotel' | 'airbnb' | 'coliving' = 'hotel';
      if (tier.days >= 30) {
        recommended = coliving < airbnbTotal ? 'coliving' : 'airbnb';
      } else if (tier.days >= 14) {
        recommended = 'airbnb';
      }

      return {
        days: tier.days,
        label: tier.label,
        discount: hotelDiscount,
        hotelTotal,
        hotelDaily,
        airbnbTotal,
        airbnbDaily,
        coliving,
        recommended,
      };
    });
  }, [baseNightlyPrice]);

  const selectedTier = pricingTiers.find(t => t.days === selectedDuration) || pricingTiers[2];

  // Calculate savings
  const standardTotal = baseNightlyPrice * selectedDuration;
  const bestPrice = Math.min(selectedTier.hotelTotal, selectedTier.airbnbTotal, selectedTier.coliving);
  const totalSavings = standardTotal - bestPrice;
  const savingsPercent = Math.round((totalSavings / standardTotal) * 100);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Long-Stay Fiyat Hesaplayıcı
            </CardTitle>
            <CardDescription className="mt-1">
              {cityName} için 30-90 günlük konaklama karşılaştırması
            </CardDescription>
          </div>
          {savingsPercent > 0 && selectedDuration >= 30 && (
            <Badge className="bg-green-500 hover:bg-green-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              %{savingsPercent} Tasarruf
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Duration Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Kalış Süresi</label>
            <Badge variant="secondary" className="text-sm">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {selectedTier.label} ({selectedDuration} gün)
            </Badge>
          </div>
          
          <div className="flex gap-2">
            {pricingTiers.map((tier) => (
              <Button
                key={tier.days}
                variant={selectedDuration === tier.days ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDuration(tier.days)}
                className="flex-1"
              >
                {tier.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Pricing Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accommodationTypes.map((type) => {
            const price = type.id === 'hotel' 
              ? selectedTier.hotelTotal 
              : type.id === 'airbnb' 
                ? selectedTier.airbnbTotal 
                : selectedTier.coliving;
            
            const dailyPrice = type.id === 'hotel'
              ? selectedTier.hotelDaily
              : type.id === 'airbnb'
                ? selectedTier.airbnbDaily
                : Math.round(selectedTier.coliving / selectedDuration);

            const isRecommended = selectedTier.recommended === type.id;
            const isBestPrice = price === bestPrice;

            return (
              <Card 
                key={type.id}
                className={`relative transition-all ${
                  isRecommended 
                    ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                    : 'hover:border-primary/30'
                }`}
              >
                {isRecommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary shadow-sm">
                      Önerilen
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-4 pt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <type.icon className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{type.label}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-2xl font-display font-bold text-primary">
                      {currency}{price.toLocaleString('tr-TR')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ~{currency}{dailyPrice}/gün
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-3">
                    {type.description}
                  </p>

                  {isBestPrice && selectedDuration >= 30 && (
                    <Badge variant="outline" className="mt-3 w-full justify-center text-green-600 border-green-200">
                      <Percent className="h-3 w-3 mr-1" />
                      En Uygun
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Savings Summary */}
        {selectedDuration >= 30 && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    {selectedTier.label} Toplam Tasarruf
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Normal otel fiyatına göre ({selectedTier.recommended === 'coliving' ? 'coliving' : 'Airbnb'} seçeneği)
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {currency}{totalSavings.toLocaleString('tr-TR')}
                  </div>
                  <Badge variant="outline" className="border-green-300 text-green-700 dark:border-green-600 dark:text-green-300">
                    %{savingsPercent} indirim
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Long-Stay İpuçları</p>
            <ul className="text-muted-foreground space-y-1 text-xs">
              <li>• <strong>30+ gün:</strong> Airbnb ve booking.com'da aylık indirimler aktif olur</li>
              <li>• <strong>60+ gün:</strong> Ev sahipleriyle doğrudan pazarlık yapın</li>
              <li>• <strong>90+ gün:</strong> Coliving/furnished apartment en ekonomik seçenek</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <Button className="flex-1 gradient-primary" asChild>
            <a href={`/sehir/${citySlug}/oteller`}>
              <Hotel className="h-4 w-4 mr-2" />
              Otelleri Gör
            </a>
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="flex-1" asChild>
                  <a 
                    href={`https://www.airbnb.com/s/${cityName}/homes?checkin=&checkout=&adults=1&monthly_start_date=&monthly_length=3&monthly_end_date=`}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Airbnb
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Aylık Airbnb seçeneklerini görüntüle</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
