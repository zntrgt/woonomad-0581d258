import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Star, ExternalLink, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHotelSearch, Hotel as APIHotel } from '@/hooks/useHotelSearch';
import { getHotelsByCity, HotelData } from '@/lib/hotels';
import { format, addDays } from 'date-fns';

interface CityHotelsWidgetProps {
  citySlug: string;
  cityName: string;
  cityNameEn?: string;
}

export function CityHotelsWidget({ citySlug, cityName, cityNameEn }: CityHotelsWidgetProps) {
  const { hotels: apiHotels, isLoading, searchHotels, affiliateLink } = useHotelSearch();
  const staticHotels = getHotelsByCity(citySlug).slice(0, 3);
  
  const today = new Date();
  const checkIn = format(addDays(today, 7), 'yyyy-MM-dd');
  const checkOut = format(addDays(today, 9), 'yyyy-MM-dd');

  useEffect(() => {
    // Fetch live prices from API
    searchHotels({
      location: cityNameEn || cityName,
      checkIn,
      checkOut,
      adults: 2,
      limit: 3,
    });
  }, [cityName, cityNameEn]);

  // Combine static data with live API prices
  const displayHotels = apiHotels.length > 0 ? apiHotels.slice(0, 3) : [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Hotel className="h-4 w-4 text-primary" />
            {cityName} Otelleri
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
            <Link to={`/sehir/${citySlug}/oteller`}>
              Tümü →
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Fiyatlar yükleniyor...</span>
          </div>
        ) : displayHotels.length > 0 ? (
          <>
            {displayHotels.map((hotel, index) => (
              <div 
                key={hotel.id || index}
                className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                {hotel.photo && (
                  <img 
                    src={hotel.photo} 
                    alt={hotel.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    loading="lazy"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{hotel.name}</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    {Array.from({ length: hotel.stars }).map((_, i) => (
                      <Star key={i} className="h-2.5 w-2.5 fill-travel-gold text-travel-gold" />
                    ))}
                    {hotel.rating > 0 && (
                      <span className="text-xs text-muted-foreground ml-1">
                        {hotel.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-primary font-semibold">
                      ₺{hotel.priceFrom.toLocaleString('tr-TR')}/gece
                    </span>
                    {hotel.link && (
                      <a 
                        href={hotel.link}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="text-xs text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {affiliateLink && (
              <a 
                href={affiliateLink}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="block"
              >
                <Button variant="outline" size="sm" className="w-full gap-2 mt-2">
                  <Hotel className="h-4 w-4" />
                  Tüm {cityName} Otellerini Gör
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            )}
          </>
        ) : staticHotels.length > 0 ? (
          <>
            {staticHotels.map((hotel) => (
              <Link 
                key={hotel.slug}
                to={`/sehir/${citySlug}/otel/${hotel.slug}`}
                className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <img 
                  src={hotel.images[0]} 
                  alt={hotel.name}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{hotel.name}</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    {Array.from({ length: hotel.stars }).map((_, i) => (
                      <Star key={i} className="h-2.5 w-2.5 fill-travel-gold text-travel-gold" />
                    ))}
                  </div>
                  {hotel.priceRange && (
                    <span className="text-xs text-primary font-semibold">
                      ₺{hotel.priceRange.min.toLocaleString('tr-TR')}+
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </>
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground">
            <p>Otel verisi bulunamadı</p>
          </div>
        )}

        <Button asChild variant="secondary" size="sm" className="w-full mt-2">
          <Link to={`/sehir/${citySlug}/oteller`}>
            {cityName} Oteller Sayfasına Git
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
