import { useSettings } from '@/contexts/SettingsContext';
import { getAgodaUrl } from '@/lib/agodaMapping';
import { format, addDays } from 'date-fns';
import { Hotel, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TravelpayoutsHotelWidgetProps {
  cityName?: string; // City name for search
  citySlug?: string; // City slug for Agoda mapping
  subId?: string;
  className?: string;
}

export function TravelpayoutsHotelWidget({
  cityName = '',
  citySlug = '',
  subId = 'hotels',
  className,
}: TravelpayoutsHotelWidgetProps) {
  const { language } = useSettings();

  // Calculate dynamic dates for hotel search (7 days from now check-in, 10 days checkout)
  const today = new Date();
  const checkInDate = format(addDays(today, 7), 'yyyy-MM-dd');
  const checkOutDate = format(addDays(today, 10), 'yyyy-MM-dd');

  // Use the existing Agoda URL generator
  const slug = citySlug || cityName.toLowerCase().replace(/\s+/g, '-');
  const agodaUrl = getAgodaUrl(slug, cityName, checkInDate, checkOutDate, {
    adults: 2,
    rooms: 1,
  });

  const displayCity = cityName || 'Dünya Geneli';

  return (
    <div className={`relative w-full rounded-xl overflow-hidden bg-card border border-border p-6 ${className || ''}`}>
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Hotel className="h-8 w-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            {cityName 
              ? `${cityName} Otelleri`
              : 'Otel Ara'}
          </h3>
          <p className="text-muted-foreground text-sm max-w-md">
            {cityName 
              ? `${displayCity} için en iyi otel fırsatlarını keşfedin`
              : 'Dünya genelinde binlerce otelden en uygun fiyatları bulun'}
          </p>
        </div>

        <Button
          asChild
          size="lg"
          className="gap-2"
        >
          <a
            href={agodaUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
          >
            Agoda'da Ara
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>

        <p className="text-xs text-muted-foreground">
          Agoda ile {cityName ? `${cityName} için` : ''} en düşük fiyat garantisi
        </p>
      </div>
    </div>
  );
}
