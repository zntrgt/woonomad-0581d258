import { Link } from 'react-router-dom';
import { Laptop, Wifi, Coffee, Users, ChevronRight, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCityNomadData, getCoworkingSpacesByCity } from '@/lib/nomad';

interface NomadEntryCardProps {
  citySlug: string;
  cityName: string;
}

export function NomadEntryCard({ citySlug, cityName }: NomadEntryCardProps) {
  const nomadData = getCityNomadData(citySlug);
  const coworkingSpaces = getCoworkingSpacesByCity(citySlug);
  
  if (!nomadData && coworkingSpaces.length === 0) {
    return null;
  }

  return (
    <Card variant="elevated" className="overflow-hidden">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Laptop className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg">Digital Nomad Rehberi</h3>
            <p className="text-sm text-muted-foreground">{cityName}'de uzaktan çalışın</p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        {/* Quick Stats */}
        {nomadData && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-muted/50 rounded-xl">
              <div className="text-xl font-bold text-primary">{nomadData.nomadScore}/10</div>
              <div className="text-xs text-muted-foreground">Nomad Skoru</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-xl">
              <div className="flex items-center justify-center gap-1">
                <Wifi className="w-4 h-4 text-primary" />
                <span className="text-xl font-bold">{nomadData.internetSpeed}</span>
              </div>
              <div className="text-xs text-muted-foreground">Mbps</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-xl">
              <div className="flex items-center justify-center gap-1">
                <Coffee className="w-4 h-4 text-primary" />
                <span className="text-xl font-bold">{coworkingSpaces.length}+</span>
              </div>
              <div className="text-xs text-muted-foreground">Coworking</div>
            </div>
          </div>
        )}

        {/* Coworking Preview */}
        {coworkingSpaces.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Popüler Coworking Alanları</span>
              <Link 
                to={`/sehir/${citySlug}/coworking`}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Tümü <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {coworkingSpaces.slice(0, 2).map((space) => (
                <Link
                  key={space.slug}
                  to={`/coworking/${space.slug}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium group-hover:text-primary transition-colors">
                        {space.name}
                      </div>
                      {space.neighborhood && (
                        <div className="text-xs text-muted-foreground">{space.neighborhood}</div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Highlights */}
        {nomadData?.highlights && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {nomadData.highlights.slice(0, 4).map((highlight, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {highlight}
              </Badge>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="flex gap-2">
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link to={`/sehir/${citySlug}/nomad`}>
              <Laptop className="w-4 h-4 mr-1" />
              Nomad Rehberi
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to={`/sehir/${citySlug}/coworking`}>
              <Users className="w-4 h-4 mr-1" />
              Coworking
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
