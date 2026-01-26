import { Link } from 'react-router-dom';
import { Hotel, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, addDays } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { getAgodaUrl } from '@/lib/agodaMapping';

interface CityHotelsWidgetProps {
  citySlug: string;
  cityName: string;
  cityNameEn?: string;
}

export function CityHotelsWidget({ citySlug, cityName, cityNameEn }: CityHotelsWidgetProps) {
  const { t } = useTranslation();
  
  const today = new Date();
  const checkIn = format(addDays(today, 7), 'yyyy-MM-dd');
  const checkOut = format(addDays(today, 9), 'yyyy-MM-dd');
  
  const searchCity = cityNameEn || cityName;
  
  // Use centralized Agoda URL generator
  const affiliateLink = getAgodaUrl(citySlug, searchCity, checkIn, checkOut);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Hotel className="h-4 w-4 text-primary" />
            {cityName} {t('nav.hotels', 'Otelleri')}
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
            <Link to={`/sehir/${citySlug}/oteller`}>
              {t('common.seeAll', 'Tümü')} →
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Travelpayouts Hotel Search Widget */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 text-center">
          <Hotel className="h-8 w-8 mx-auto text-primary mb-2" />
          <h4 className="font-medium text-sm mb-1">
            {t('hotels.findBestHotels', 'En İyi Otelleri Keşfet')}
          </h4>
          <p className="text-xs text-muted-foreground mb-3">
            {t('hotels.compareHotelPrices', 'Binlerce oteli karşılaştır, en uygun fiyatı bul')}
          </p>
          
          <a 
            href={affiliateLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block"
          >
            <Button className="w-full gap-2" size="sm">
              <Hotel className="h-4 w-4" />
              {t('hotels.searchHotels', 'Otel Ara')}
              <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
        </div>

        {/* Quick info */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-muted/50 rounded p-2 text-center">
            <span className="font-semibold text-primary">50+</span>
            <p className="text-muted-foreground">{t('hotels.hotelOptions', 'Otel Seçeneği')}</p>
          </div>
          <div className="bg-muted/50 rounded p-2 text-center">
            <span className="font-semibold text-primary">%30</span>
            <p className="text-muted-foreground">{t('hotels.savingsUpTo', 'Tasarruf')}</p>
          </div>
        </div>

        <Button asChild variant="secondary" size="sm" className="w-full mt-2">
          <Link to={`/sehir/${citySlug}/oteller`}>
            {cityName} {t('hotels.title', 'Oteller')}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
