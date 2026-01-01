import { Clock, Plane, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getFlightDurationBetween, getFlightDistanceBetween } from '@/lib/flightRoutes';

interface DynamicFlightInfoProps {
  originCode: string;
  originCity: string;
  destinationCode: string;
  destinationCity: string;
  fallbackDuration?: string;
}

export function DynamicFlightInfo({
  originCode,
  originCity,
  destinationCode,
  destinationCity,
  fallbackDuration = '2-4 saat',
}: DynamicFlightInfoProps) {
  const duration = getFlightDurationBetween(originCode, destinationCode);
  const distance = getFlightDistanceBetween(originCode, destinationCode);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
            <div className="text-3xl font-bold text-primary mb-2">{duration}</div>
            <p className="text-muted-foreground">Tahmini Uçuş Süresi</p>
            <p className="text-sm text-muted-foreground/70 mt-2">
              {originCity} → {destinationCity}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Uçuş Detayları
          </h3>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li className="flex justify-between">
              <span>Mesafe:</span>
              <span className="font-medium text-foreground">{distance}</span>
            </li>
            <li className="flex justify-between">
              <span>Kalkış:</span>
              <span className="font-medium text-foreground">{originCity} ({originCode})</span>
            </li>
            <li className="flex justify-between">
              <span>Varış:</span>
              <span className="font-medium text-foreground">{destinationCity} ({destinationCode})</span>
            </li>
            <li className="flex justify-between">
              <span>Sefer Tipi:</span>
              <span className="font-medium text-foreground">Direkt & Aktarmalı</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
