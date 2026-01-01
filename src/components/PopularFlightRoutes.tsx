import { Link } from 'react-router-dom';
import { Plane, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlightRoute, getRoutesForCity } from '@/lib/flightRoutes';

interface PopularFlightRoutesProps {
  cityCode: string;
  cityName: string;
  maxRoutes?: number;
}

export function PopularFlightRoutes({ cityCode, cityName, maxRoutes = 6 }: PopularFlightRoutesProps) {
  const routes = getRoutesForCity(cityCode).slice(0, maxRoutes);

  if (routes.length === 0) return null;

  return (
    <section className="mb-12" aria-labelledby="flight-routes-section">
      <h2 id="flight-routes-section" className="text-2xl font-bold mb-6">
        {cityName} Popüler Uçuş Rotaları
      </h2>
      <p className="text-muted-foreground mb-6">
        {cityName} çıkışlı ve varışlı en popüler uçuş rotalarını keşfedin. Her rota için detaylı bilgi, 
        tahmini uçuş süresi ve fiyat karşılaştırması.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.map((route) => {
          // Determine if this city is origin or destination
          const isOrigin = route.originCode === cityCode;
          const otherCity = isOrigin ? route.destinationCity : route.originCity;
          const otherFlag = isOrigin ? route.destinationFlag : route.originFlag;
          const otherCountry = isOrigin ? route.destinationCountry : route.originCountry;

          return (
            <Link
              key={route.slug}
              to={`/ucus/${route.slug}`}
              className="group"
            >
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{isOrigin ? route.originFlag : route.destinationFlag}</span>
                      <Plane className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span className="text-xl">{otherFlag}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {route.estimatedDuration}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                    {route.originCity} - {route.destinationCity}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {route.distance}
                  </p>
                  
                  <div className="flex items-center text-primary text-sm font-medium">
                    <span>Uçuş Ara</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
      
      {routes.length >= maxRoutes && (
        <div className="mt-6 text-center">
          <Link 
            to="/ucuslar" 
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            Tüm Uçuş Rotalarını Gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
