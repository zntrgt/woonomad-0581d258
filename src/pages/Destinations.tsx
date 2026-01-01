import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, CheckCircle, XCircle, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SettingsDropdown } from '@/components/SettingsDropdown';
import { Logo } from '@/components/Logo';
import { AdBanner, AdInArticle } from '@/components/AdSense';
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

const BASE_URL = 'https://woonomad.co';

export default function Destinations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [continentFilter, setContinentFilter] = useState<ContinentFilter>('all');
  const [visaFilter, setVisaFilter] = useState<VisaFilter>('all');
  const currentYear = new Date().getFullYear();

  const allDestinations = useMemo(() => generateSEODestinations(), []);

  const filteredDestinations = useMemo(() => {
    return allDestinations.filter((dest) => {
      const matchesSearch = searchQuery === '' || 
        dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesContinent = continentFilter === 'all' || dest.continent === continentFilter;

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
    description: 'En ucuz uçak bileti fiyatları için popüler uçuş destinasyonları',
    numberOfItems: allDestinations.length,
    itemListElement: allDestinations.slice(0, 20).map((dest, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TouristDestination',
        name: dest.city,
        description: dest.description,
        url: `${BASE_URL}/ucak-bileti/${dest.slug}`,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Destinasyonlar', item: `${BASE_URL}/destinasyonlar` },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Tüm Destinasyonlar | Uçak Bileti Fiyatları {currentYear} - WooNomad</title>
        <meta 
          name="description" 
          content="Dünyanın dört bir yanına en ucuz uçak bileti fiyatları. Avrupa, Asya, Amerika ve daha fazlası için uçuş fiyatlarını karşılaştırın. Vizesiz ve vizeli destinasyonlar." 
        />
        <meta name="keywords" content="uçak bileti destinasyonları, ucuz uçuş, vizesiz ülkeler, avrupa uçak bileti, asya uçuşları, amerika bileti" />
        <link rel="canonical" href={`${BASE_URL}/destinasyonlar`} />
        <meta property="og:title" content={`Tüm Destinasyonlar | Uçak Bileti ${currentYear} - WooNomad`} />
        <meta property="og:description" content="Dünyanın dört bir yanına uçak bileti fiyatları ve en ucuz uçuşlar" />
        <meta property="og:url" content={`${BASE_URL}/destinasyonlar`} />
        <meta property="og:site_name" content="WooNomad" />
        <meta property="og:locale" content="tr_TR" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
            <Logo size="sm" showText={true} className="hidden sm:flex" />
            <Logo size="sm" showText={false} className="sm:hidden" />
            <SettingsDropdown />
          </div>
        </header>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Uçak Bileti Destinasyonları
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dünyanın dört bir yanına en ucuz uçak bileti. Hayalinizdeki şehri bulun ve keşfe çıkın.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-12 z-30 bg-background border-b border-border py-4">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  placeholder="Şehir veya ülke ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  aria-label="Destinasyon ara"
                />
              </div>

              {/* Continent Filter */}
              <div className="flex flex-wrap gap-2" role="group" aria-label="Kıta filtresi">
                {(Object.keys(continentNames) as ContinentFilter[]).map((continent) => (
                  <Button
                    key={continent}
                    variant={continentFilter === continent ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setContinentFilter(continent)}
                    aria-pressed={continentFilter === continent}
                  >
                    {continentNames[continent]}
                  </Button>
                ))}
              </div>

              {/* Visa Filter */}
              <div className="flex gap-2" role="group" aria-label="Vize filtresi">
                <Button
                  variant={visaFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setVisaFilter('all')}
                  aria-pressed={visaFilter === 'all'}
                >
                  Tümü
                </Button>
                <Button
                  variant={visaFilter === 'visa-free' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setVisaFilter('visa-free')}
                  className="gap-1"
                  aria-pressed={visaFilter === 'visa-free'}
                >
                  <CheckCircle className="h-3 w-3" aria-hidden="true" />
                  Vizesiz
                </Button>
                <Button
                  variant={visaFilter === 'visa-required' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setVisaFilter('visa-required')}
                  className="gap-1"
                  aria-pressed={visaFilter === 'visa-required'}
                >
                  <XCircle className="h-3 w-3" aria-hidden="true" />
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

        {/* Banner Ad */}
        <div className="max-w-6xl mx-auto px-4">
          <AdBanner />
        </div>

        {/* Destinations Grid */}
        <main className="max-w-6xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDestinations.map((dest, index) => (
              <>
                <Link
                  key={dest.slug}
                  to={`/ucak-bileti/${dest.slug}`}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all"
                  aria-label={`${dest.city} uçak bileti - ${dest.country}`}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={dest.imageUrl} 
                      alt={`${dest.city} şehir manzarası - ${dest.country} ucuz uçak bileti`}
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
                          <MapPin className="h-3 w-3" aria-hidden="true" />
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
                {/* Insert ad after every 12 items */}
                {(index + 1) % 12 === 0 && index !== filteredDestinations.length - 1 && (
                  <div key={`ad-${index}`} className="col-span-full">
                    <AdInArticle />
                  </div>
                )}
              </>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Arama kriterlerinize uygun destinasyon bulunamadı.</p>
            </div>
          )}
        </main>

        {/* SEO Content */}
        <section className="max-w-4xl mx-auto px-4 py-12 seo-content">
          <h2 className="text-2xl font-bold mb-6">Popüler Uçuş Destinasyonları</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="leading-relaxed mb-4">
              WooNomad ile dünyanın dört bir yanına <strong>en ucuz uçak bileti</strong> fiyatlarını 
              karşılaştırın. Avrupa'nın romantik şehirlerinden Asya'nın egzotik destinasyonlarına, 
              Amerika'nın metropollerinden Afrika'nın vahşi doğasına kadar tüm uçuşları tek platformda bulun.
            </p>
            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Vizesiz Destinasyonlar</h3>
            <p className="leading-relaxed">
              Türk vatandaşları için vizesiz giriş imkanı sunan ülkelere uçak bileti bulmak artık çok kolay. 
              Gürcistan, Sırbistan, Karadağ, Malezya, Singapur ve daha birçok vizesiz destinasyona 
              uygun fiyatlı uçuşlar için WooNomad'ı kullanın.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-muted border-t border-border py-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {currentYear} WooNomad. Tüm hakları saklıdır.</p>
            <p className="mt-2">
              Uçak bileti destinasyonları • Ucuz uçuş • Vizesiz ülkeler • Online bilet
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
