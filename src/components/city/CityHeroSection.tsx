import { Link } from 'react-router-dom';
import { Plane, Hotel, Building2, Compass, Laptop } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { CityInfo } from '@/lib/cities';

interface CityHeroSectionProps {
  city: CityInfo;
  displayName: string;
  displayCountry: string;
  flag: string;
  currentYear: number;
  breadcrumbItems: { label: string; href?: string }[];
}

export const CityHeroSection = ({
  city,
  displayName,
  flag,
  currentYear,
  breadcrumbItems,
}: CityHeroSectionProps) => {
  return (
    <>
      {/* Hero Section - Compact */}
      <section className="relative h-[30vh] min-h-[220px] overflow-hidden">
        <img 
          src={city.image} 
          alt={`${city.name} ${city.highlights?.[0] || city.country} manzarası — ${city.country} gezi rehberi`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="container">
            <Breadcrumb items={breadcrumbItems} className="mb-2" />
            <div className="flex items-center gap-3">
              <span className="text-3xl md:text-4xl">{flag}</span>
              <div className="min-w-0">
                <h1 className="text-2xl md:text-4xl font-display font-bold text-foreground truncate">
                  {displayName}
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {city.country} • {city.timezone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions - Horizontal Scroll on Mobile */}
      <section className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-md z-40">
        <div className="container py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
            <Button asChild size="sm" className="gap-1.5 flex-shrink-0">
              <Link to={`/sehir/${city.slug}/ucuslar`}>
                <Plane className="w-4 h-4" />
                <span className="hidden sm:inline">Uçuşlar</span>
                <span className="sm:hidden">Uçuş</span>
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="gap-1.5 flex-shrink-0">
              <Link to={`/sehir/${city.slug}/oteller`}>
                <Hotel className="w-4 h-4" />
                <span className="hidden sm:inline">Oteller</span>
                <span className="sm:hidden">Otel</span>
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="gap-1.5 flex-shrink-0">
              <Link to={`/sehir/${city.slug}/coworking`}>
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Coworking</span>
                <span className="sm:hidden">Co-Work</span>
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="gap-1.5 flex-shrink-0">
              <Link to={`/sehir/${city.slug}/aktiviteler`}>
                <Compass className="w-4 h-4" />
                <span className="hidden sm:inline">Aktiviteler</span>
                <span className="sm:hidden">Aktivite</span>
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="gap-1.5 flex-shrink-0">
              <Link to={`/sehir/${city.slug}/nomad`}>
                <Laptop className="w-4 h-4" />
                <span className="hidden sm:inline">Nomad Rehberi</span>
                <span className="sm:hidden">Nomad</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
