import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Clock, ArrowRight, Plane } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AdBanner } from '@/components/AdSense';
import { generateFlightRoutes, FlightRoute } from '@/lib/flightRoutes';

type OriginFilter = 'all' | 'istanbul' | 'europe' | 'other';

const originFilters: Record<OriginFilter, string> = {
  all: 'Tümü',
  istanbul: 'İstanbul Çıkışlı',
  europe: 'Avrupa İçi',
  other: 'Diğer',
};

const BASE_URL = 'https://woonomad.co';

export default function FlightRoutes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [originFilter, setOriginFilter] = useState<OriginFilter>('all');
  const currentYear = new Date().getFullYear();

  const allRoutes = useMemo(() => generateFlightRoutes(), []);

  const filteredRoutes = useMemo(() => {
    return allRoutes.filter((route) => {
      const matchesSearch = searchQuery === '' ||
        route.originCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.destinationCity.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesOrigin = true;
      if (originFilter === 'istanbul') {
        matchesOrigin = route.originCode === 'IST' || route.originCode === 'SAW';
      } else if (originFilter === 'europe') {
        matchesOrigin = !['IST', 'SAW', 'ESB', 'ADB', 'AYT'].includes(route.originCode);
      } else if (originFilter === 'other') {
        matchesOrigin = ['ESB', 'ADB', 'AYT'].includes(route.originCode);
      }

      return matchesSearch && matchesOrigin;
    });
  }, [allRoutes, searchQuery, originFilter]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Uçuş Rotaları',
    description: 'Popüler uçuş rotaları ve bilet fiyatları',
    numberOfItems: allRoutes.length,
    itemListElement: allRoutes.slice(0, 20).map((route, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Flight',
        name: `${route.originCity} - ${route.destinationCity}`,
        url: `${BASE_URL}/ucus/${route.slug}`,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>{`Uçuş Rotaları | Uçak Bileti Fiyatları ${currentYear} - WooNomad`}</title>
        <meta 
          name="description" 
          content="Popüler uçuş rotaları ve uçak bileti fiyatları. İstanbul, Ankara, İzmir çıkışlı ve Avrupa içi uçuşlar için en ucuz biletleri bulun." 
        />
        <link rel="canonical" href={`${BASE_URL}/ucuslar`} />
        <meta property="og:title" content={`Uçuş Rotaları - WooNomad`} />
        <meta property="og:url" content={`${BASE_URL}/ucuslar`} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Breadcrumb items={[{ label: 'Uçuş Rotaları' }]} />
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-6 md:py-10 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <Plane className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Uçuş Rotaları
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Popüler uçuş rotalarını keşfedin, en uygun fiyatlı biletleri bulun.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-12 z-30 bg-background border-b border-border py-4">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Şehir ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {(Object.keys(originFilters) as OriginFilter[]).map((filter) => (
                  <Button
                    key={filter}
                    variant={originFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOriginFilter(filter)}
                  >
                    {originFilters[filter]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Results Count */}
        <div className="max-w-6xl mx-auto px-4 py-4">
          <p className="text-sm text-muted-foreground">
            {filteredRoutes.length} uçuş rotası bulundu
          </p>
        </div>

        {/* Ad Banner */}
        <div className="max-w-6xl mx-auto px-4">
          <AdBanner />
        </div>

        {/* Routes Grid */}
        <main className="max-w-6xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredRoutes.map((route) => (
              <Link
                key={route.slug}
                to={`/ucus/${route.slug}`}
                className="group bg-card rounded-xl border border-border p-4 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{route.originFlag}</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <div className="w-8 h-px bg-border" />
                    <Plane className="h-4 w-4" />
                    <div className="w-8 h-px bg-border" />
                  </div>
                  <span className="text-2xl">{route.destinationFlag}</span>
                </div>
                
                <h2 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {route.originCity}
                </h2>
                <div className="flex items-center gap-1 text-muted-foreground mb-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>{route.destinationCity}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {route.estimatedDuration}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {route.originCode} → {route.destinationCode}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filteredRoutes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Arama kriterlerinize uygun uçuş rotası bulunamadı.</p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-muted border-t border-border py-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {currentYear} WooNomad. Tüm hakları saklıdır.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
