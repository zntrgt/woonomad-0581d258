import { Building, ExternalLink, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HotelWidgetProps {
  cityName: string;
  citySlug: string;
  variant?: 'sidebar' | 'inline' | 'compact';
  className?: string;
}

// City name mappings for Trip.com URLs
const cityMappings: Record<string, { tripcomId: string; tripcomName: string }> = {
  'berlin': { tripcomId: '376', tripcomName: 'Berlin' },
  'londra': { tripcomId: '50', tripcomName: 'London' },
  'paris': { tripcomId: '418', tripcomName: 'Paris' },
  'amsterdam': { tripcomId: '395', tripcomName: 'Amsterdam' },
  'barcelona': { tripcomId: '387', tripcomName: 'Barcelona' },
  'roma': { tripcomId: '425', tripcomName: 'Rome' },
  'prag': { tripcomId: '422', tripcomName: 'Prague' },
  'viyana': { tripcomId: '400', tripcomName: 'Vienna' },
  'lisbon': { tripcomId: '419', tripcomName: 'Lisbon' },
  'dublin': { tripcomId: '408', tripcomName: 'Dublin' },
  'kopenhag': { tripcomId: '405', tripcomName: 'Copenhagen' },
  'stockholm': { tripcomId: '429', tripcomName: 'Stockholm' },
  'oslo': { tripcomId: '421', tripcomName: 'Oslo' },
  'helsinki': { tripcomId: '413', tripcomName: 'Helsinki' },
  'budapeşte': { tripcomId: '397', tripcomName: 'Budapest' },
  'varsova': { tripcomId: '423', tripcomName: 'Warsaw' },
  'atina': { tripcomId: '389', tripcomName: 'Athens' },
  'brüksel': { tripcomId: '396', tripcomName: 'Brussels' },
  'münih': { tripcomId: '377', tripcomName: 'Munich' },
  'milano': { tripcomId: '420', tripcomName: 'Milan' },
  'tokyo': { tripcomId: '60', tripcomName: 'Tokyo' },
  'new-york': { tripcomId: '159', tripcomName: 'New-York' },
  'bangkok': { tripcomId: '142', tripcomName: 'Bangkok' },
  'singapur': { tripcomId: '141', tripcomName: 'Singapore' },
  'dubai': { tripcomId: '122', tripcomName: 'Dubai' },
  'istanbul': { tripcomId: '83', tripcomName: 'Istanbul' },
};

function getTripcomUrl(citySlug: string): string {
  const mapping = cityMappings[citySlug.toLowerCase()];
  if (mapping) {
    return `https://www.trip.com/hotels/list?city=${mapping.tripcomId}&cityName=${mapping.tripcomName}`;
  }
  // Fallback to search
  return `https://www.trip.com/hotels/`;
}

// Sample featured hotels for widget display
const featuredHotels = [
  { name: 'Boutique Hotel', rating: 4.8, price: '€89', type: 'Butik' },
  { name: 'City Center Inn', rating: 4.5, price: '€65', type: 'Merkezi' },
  { name: 'Budget Hostel', rating: 4.2, price: '€25', type: 'Ekonomik' },
];

export function HotelWidget({ cityName, citySlug, variant = 'sidebar', className }: HotelWidgetProps) {
  const tripcomUrl = getTripcomUrl(citySlug);

  if (variant === 'compact') {
    return (
      <a
        href={tripcomUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={cn(
          "flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all group",
          className
        )}
      >
        <div className="p-2 rounded-lg bg-primary/10">
          <Building className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{cityName} Otelleri</div>
          <div className="text-xs text-muted-foreground">Trip.com'da incele</div>
        </div>
        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
      </a>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn("my-8 p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-background to-primary/10 border border-border", className)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold">{cityName} Otel Önerileri</h3>
            <p className="text-sm text-muted-foreground">En iyi fiyatlarla konaklama</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {featuredHotels.map((hotel, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-card border border-border/50 text-center">
              <Badge variant="outline" className="text-[10px] mb-2">{hotel.type}</Badge>
              <div className="flex items-center justify-center gap-1 text-xs mb-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="font-medium">{hotel.rating}</span>
              </div>
              <div className="text-sm font-bold text-primary">{hotel.price}<span className="text-xs font-normal text-muted-foreground">/gece</span></div>
            </div>
          ))}
        </div>

        <a
          href={tripcomUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
        >
          <Button className="w-full" size="lg">
            <Building className="h-4 w-4 mr-2" />
            {cityName} Otellerini Gör
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </a>
      </div>
    );
  }

  // Default: sidebar variant
  return (
    <div className={cn("card-modern p-5", className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Building className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-sm">{cityName} Otelleri</h3>
          <p className="text-xs text-muted-foreground">Trip.com Partner</p>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        {featuredHotels.slice(0, 2).map((hotel, idx) => (
          <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">{hotel.type}</Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {hotel.rating}
              </div>
            </div>
            <span className="text-sm font-bold text-primary">{hotel.price}</span>
          </div>
        ))}
      </div>

      <a
        href={tripcomUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
      >
        <Button variant="outline" className="w-full text-sm" size="sm">
          <MapPin className="h-4 w-4 mr-2" />
          Otelleri Gör
          <ExternalLink className="h-3 w-3 ml-2" />
        </Button>
      </a>
    </div>
  );
}
