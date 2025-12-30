import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plane, Search, Filter, CheckCircle, XCircle, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SettingsDropdown } from '@/components/SettingsDropdown';
import { generateSEODestinations, SEODestination } from '@/lib/seoDestinations';
import { cn } from '@/lib/utils';

type ContinentFilter = 'all' | 'europe' | 'asia' | 'americas' | 'africa' | 'oceania';
type VisaFilter = 'all' | 'visa-free' | 'visa-required';

const continentNames: Record<ContinentFilter, string> = {
  all: 'Tümü',
  europe: 'Avrupa',
  asia: 'Asya',
  americas: 'Amerika',
  africa: 'Afrika',
  oceania: 'Okyanusya',
};

export default function Destinations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [continentFilter, setContinentFilter] = useState<ContinentFilter>('all');
  const [visaFilter, setVisaFilter] = useState<VisaFilter>('all');

  const allDestinations = useMemo(() => generateSEODestinations(), []);

  const filteredDestinations = useMemo(() => {
    return allDestinations.filter((dest) => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase());

      // Continent filter
      const matchesContinent = continentFilter === 'all' || dest.continent === continentFilter;

      // Visa filter
      const matchesVisa = visaFilter === 'all' || 
        (visaFilter === 'visa-free' && !dest.visaRequired) ||
        (visaFilter === 'visa-required' && dest.visaRequired);

      return matchesSearch && matchesContinent && matchesVisa;
    });
  }, [allDestinations, searchQuery, continentFilter, visaFilter]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Uçak Bileti Destinasyonları',
    description: 'Hafta sonu kaçamağı için popüler uçuş destinasyonları',
    numberOfItems: allDestinations.length,
    itemListElement: allDestinations.slice(0, 20).map((dest, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TouristDestination',
        name: dest.city,
        description: dest.description,
        url: `https://haftasonukacamagi.com/ucak-bileti/${dest.slug}`,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>Tüm Destinasyonlar | Uçak Bileti Fiyatları | Hafta Sonu Kaçamağı</title>
        <meta 
          name="description" 
          content="Dünyanın dört bir yanına uçak bileti fiyatları. Avrupa, Asya, Amerika ve daha fazlası için en ucuz uçuşları keşfedin. Vizesiz ve vizeli destinasyonlar." 
        />
        <link rel="canonical" href="https://haftasonukacamagi.com/destinasyonlar" />
        <meta property="og:title" content="Tüm Destinasyonlar | Hafta Sonu Kaçamağı" />
        <meta property="og:description" content="Dünyanın dört bir yanına uçak bileti fiyatları ve en ucuz uçuşlar" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm text-foreground hidden sm:inline">Hafta Sonu Kaçamağı</span>
            </Link>
            <SettingsDropdown />
          </div>
        </header>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Tüm Destinasyonlar
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dünyanın dört bir yanına uçak bileti. Hayalinizdeki şehri bulun ve keşfe çıkın.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-12 z-30 bg-background border-b border-border py-4">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Şehir veya ülke ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Continent Filter */}
              <div className="flex flex-wrap gap-2">
                {(Object.keys(continentNames) as ContinentFilter[]).map((continent) => (
                  <Button
                    key={continent}
                    variant={continentFilter === continent ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setContinentFilter(continent)}
                  >
                    {continentNames[continent]}
                  </Button>
                ))}
              </div>

              {/* Visa Filter */}
              <div className="flex gap-2">
                <Button
                  variant={visaFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setVisaFilter('all')}
                >
                  Tümü
                </Button>
                <Button
                  variant={visaFilter === 'visa-free' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setVisaFilter('visa-free')}
                  className="gap-1"
                >
                  <CheckCircle className="h-3 w-3" />
                  Vizesiz
                </Button>
                <Button
                  variant={visaFilter === 'visa-required' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setVisaFilter('visa-required')}
                  className="gap-1"
                >
                  <XCircle className="h-3 w-3" />
                  Vizeli
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Count */}
        <div className="max-w-6xl mx-auto px-4 py-4">
          <p className="text-sm text-muted-foreground">
            {filteredDestinations.length} destinasyon bulundu
          </p>
        </div>

        {/* Destinations Grid */}
        <main className="max-w-6xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDestinations.map((dest) => (
              <Link
                key={dest.slug}
                to={`/ucak-bileti/${dest.slug}`}
                className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={dest.imageUrl} 
                    alt={`${dest.city} uçak bileti`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={dest.visaRequired ? 'destructive' : 'default'} className="text-xs">
                      {dest.visaRequired ? 'Vizeli' : 'Vizesiz'}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h2 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {dest.flag} {dest.city}
                      </h2>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {dest.country}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {dest.airportCode}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {dest.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Arama kriterlerinize uygun destinasyon bulunamadı.</p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-muted border-t border-border py-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© 2024 Hafta Sonu Kaçamağı. Tüm hakları saklıdır.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
