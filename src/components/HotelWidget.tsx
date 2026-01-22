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

// Travelpayouts Partner ID - Hotellook affiliate
const HOTELLOOK_PARTNER_ID = "261144";

// City name mappings for Hotellook URLs
const cityMappings: Record<string, { locationId: string; englishName: string }> = {
  'berlin': { locationId: '12153', englishName: 'Berlin' },
  'londra': { locationId: '12190', englishName: 'London' },
  'paris': { locationId: '12220', englishName: 'Paris' },
  'amsterdam': { locationId: '12086', englishName: 'Amsterdam' },
  'barcelona': { locationId: '12093', englishName: 'Barcelona' },
  'roma': { locationId: '12233', englishName: 'Rome' },
  'prag': { locationId: '12225', englishName: 'Prague' },
  'viyana': { locationId: '12272', englishName: 'Vienna' },
  'lisbon': { locationId: '12187', englishName: 'Lisbon' },
  'dublin': { locationId: '12155', englishName: 'Dublin' },
  'kopenhag': { locationId: '12150', englishName: 'Copenhagen' },
  'stockholm': { locationId: '12256', englishName: 'Stockholm' },
  'oslo': { locationId: '12218', englishName: 'Oslo' },
  'helsinki': { locationId: '12172', englishName: 'Helsinki' },
  'budapeşte': { locationId: '12119', englishName: 'Budapest' },
  'varsova': { locationId: '12280', englishName: 'Warsaw' },
  'atina': { locationId: '12091', englishName: 'Athens' },
  'brüksel': { locationId: '12118', englishName: 'Brussels' },
  'münih': { locationId: '12208', englishName: 'Munich' },
  'milano': { locationId: '12200', englishName: 'Milan' },
  'tokyo': { locationId: '12266', englishName: 'Tokyo' },
  'new-york': { locationId: '12212', englishName: 'New York' },
  'bangkok': { locationId: '12092', englishName: 'Bangkok' },
  'singapur': { locationId: '12248', englishName: 'Singapore' },
  'dubai': { locationId: '12154', englishName: 'Dubai' },
  'istanbul': { locationId: '12180', englishName: 'Istanbul' },
  'antalya': { locationId: '12088', englishName: 'Antalya' },
  'izmir': { locationId: '12181', englishName: 'Izmir' },
  'bodrum': { locationId: '12112', englishName: 'Bodrum' },
};

function getHotellookUrl(citySlug: string, cityName: string): string {
  const mapping = cityMappings[citySlug.toLowerCase()];
  const destination = mapping?.englishName || cityName;
  const locationId = mapping?.locationId || '';
  
  const params = new URLSearchParams({
    marker: HOTELLOOK_PARTNER_ID,
    destination: destination,
    language: 'tr',
    currency: 'TRY',
  });
  
  if (locationId) {
    params.append('locationId', locationId);
  }
  
  return `https://search.hotellook.com/?${params.toString()}`;
}

// Sample featured hotels for widget display
const featuredHotels = [
  { name: 'Boutique Hotel', rating: 4.8, price: '€89', type: 'Butik' },
  { name: 'City Center Inn', rating: 4.5, price: '€65', type: 'Merkezi' },
  { name: 'Budget Hostel', rating: 4.2, price: '€25', type: 'Ekonomik' },
];

export function HotelWidget({ cityName, citySlug, variant = 'sidebar', className }: HotelWidgetProps) {
  const hotellookUrl = getHotellookUrl(citySlug, cityName);

  if (variant === 'compact') {
    return (
      <a
        href={hotellookUrl}
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
          <div className="text-xs text-muted-foreground">Hotellook'ta incele</div>
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
                <Star className="h-3 w-3 fill-travel-gold text-travel-gold" />
                <span className="font-medium">{hotel.rating}</span>
              </div>
              <div className="text-sm font-bold text-primary">{hotel.price}<span className="text-xs font-normal text-muted-foreground">/gece</span></div>
            </div>
          ))}
        </div>

        <a
          href={hotellookUrl}
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
          <p className="text-xs text-muted-foreground">Hotellook Partner</p>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        {featuredHotels.slice(0, 2).map((hotel, idx) => (
          <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">{hotel.type}</Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-travel-gold text-travel-gold" />
                {hotel.rating}
              </div>
            </div>
            <span className="text-sm font-bold text-primary">{hotel.price}</span>
          </div>
        ))}
      </div>

      <a
        href={hotellookUrl}
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
