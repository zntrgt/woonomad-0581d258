import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plane, Search, Globe, Shield, Clock, CreditCard } from 'lucide-react';
import { SearchForm, SearchFormRef } from '@/components/SearchForm';
import { PopularRoutes } from '@/components/PopularRoutes';
import { FlightCard } from '@/components/FlightCard';
import { FlightFilters, FilterOptions } from '@/components/FlightFilters';
import { SettingsDropdown } from '@/components/SettingsDropdown';
import { Logo } from '@/components/Logo';
import { AdBanner, AdInArticle } from '@/components/AdSense';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { useFavorites } from '@/hooks/useFavorites';
import { useSettings } from '@/contexts/SettingsContext';
import { SearchParams, Flight, Airport } from '@/lib/types';
import { cn } from '@/lib/utils';
import { parseISO, format } from 'date-fns';
import { tr } from 'date-fns/locale';

type SortOption = 'price' | 'duration' | 'departure' | 'best';

// Airport lookup for popular routes
const airportLookup: Record<string, Airport> = {
  'IST': { code: 'IST', name: 'İstanbul Havalimanı', city: 'İstanbul', country: 'Türkiye' },
  'SAW': { code: 'SAW', name: 'Sabiha Gökçen', city: 'İstanbul', country: 'Türkiye' },
  'ESB': { code: 'ESB', name: 'Esenboğa Havalimanı', city: 'Ankara', country: 'Türkiye' },
  'AYT': { code: 'AYT', name: 'Antalya Havalimanı', city: 'Antalya', country: 'Türkiye' },
  'ADB': { code: 'ADB', name: 'Adnan Menderes', city: 'İzmir', country: 'Türkiye' },
  'BCN': { code: 'BCN', name: 'El Prat', city: 'Barselona', country: 'İspanya' },
  'ATH': { code: 'ATH', name: 'Eleftherios Venizelos', city: 'Atina', country: 'Yunanistan' },
  'CDG': { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'Fransa' },
  'FCO': { code: 'FCO', name: 'Fiumicino', city: 'Roma', country: 'İtalya' },
  'DXB': { code: 'DXB', name: 'Dubai', city: 'Dubai', country: 'BAE' },
};

const Index = () => {
  const { flights, isLoading, error, searchFlights } = useFlightSearch();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { formatPrice } = useSettings();
  const searchFormRef = useRef<SearchFormRef>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const didAutoScrollRef = useRef(false);

  const [sortBy, setSortBy] = useState<SortOption>('best');
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 100000],
    maxStops: -1,
    airlines: [],
    departureTimeRange: [0, 24],
  });
  const [lastSearchParams, setLastSearchParams] = useState<SearchParams | null>(null);

  const hasResultsSection = flights.length > 0 || isLoading || !!error;
  const currentYear = new Date().getFullYear();
  const BASE_URL = 'https://woonomad.co';

  const handleSearch = (params: SearchParams) => {
    didAutoScrollRef.current = false;
    setLastSearchParams(params);
    searchFlights(params);
  };

  useEffect(() => {
    if (!hasResultsSection) return;
    if (didAutoScrollRef.current) return;

    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      didAutoScrollRef.current = true;
    });
  }, [hasResultsSection]);

  const handlePopularRouteSelect = (originCode: string, destinationCode: string) => {
    const origin = airportLookup[originCode];
    const destination = airportLookup[destinationCode];

    if (origin && destination && searchFormRef.current) {
      searchFormRef.current.setAirports(origin, destination);
      setTimeout(() => {
        searchFormRef.current?.triggerSearch();
      }, 100);
    }
  };

  const availableAirlines = useMemo(() => {
    return [...new Set(flights.map(f => f.airline))];
  }, [flights]);

  const maxPrice = useMemo(() => {
    return Math.max(...flights.map(f => f.price), 10000);
  }, [flights]);

  const filteredAndSortedFlights = useMemo(() => {
    let result = flights.filter(flight => {
      if (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1]) return false;
      if (filters.maxStops !== -1 && flight.transfers > filters.maxStops) return false;
      if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) return false;
      const departHour = parseISO(flight.departure_at).getHours();
      if (departHour < filters.departureTimeRange[0] || departHour > filters.departureTimeRange[1]) return false;
      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price': return a.price - b.price;
        case 'duration': return a.duration - b.duration;
        case 'departure': return new Date(a.departure_at).getTime() - new Date(b.departure_at).getTime();
        case 'best': return (a.price / 1000 + a.duration / 60) - (b.price / 1000 + b.duration / 60);
        default: return 0;
      }
    });

    return result;
  }, [flights, filters, sortBy]);

  const priceRange = useMemo(() => {
    if (filteredAndSortedFlights.length === 0) return null;
    const prices = filteredAndSortedFlights.map(f => f.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [filteredAndSortedFlights]);

  const getRank = (flight: Flight, index: number): 'cheapest' | 'fastest' | 'best' | null => {
    if (flights.length < 3) return null;
    const cheapest = [...flights].sort((a, b) => a.price - b.price)[0];
    const fastest = [...flights].sort((a, b) => a.duration - b.duration)[0];
    if (flight === cheapest) return 'cheapest';
    if (flight === fastest) return 'fastest';
    if (index === 0 && sortBy === 'best') return 'best';
    return null;
  };

  // JSON-LD Structured Data
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'WooNomad',
    alternateName: 'WooNomad Uçak Bileti',
    url: BASE_URL,
    description: 'En ucuz uçak bileti fiyatlarını karşılaştırın. Tüm havayollarının biletlerini tek seferde arayın.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/ucak-bileti/{search_term}`,
      },
      'query-input': 'required name=search_term',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'WooNomad',
    url: BASE_URL,
    logo: `${BASE_URL}/woonomad-logo.png`,
    description: 'Türkiye\'nin en kapsamlı uçak bileti karşılaştırma platformu',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Turkish',
    },
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Uçak Bileti Arama ve Karşılaştırma',
    provider: {
      '@type': 'Organization',
      name: 'WooNomad',
    },
    description: 'Tüm havayollarının uçak biletlerini karşılaştırın, en ucuz fiyatları bulun',
    serviceType: 'Flight Search',
    areaServed: {
      '@type': 'Country',
      name: 'Turkey',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'WooNomad nedir?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'WooNomad, tüm havayollarının uçak biletlerini karşılaştırarak en ucuz fiyatları bulmanızı sağlayan bir uçak bileti arama motorudur.',
        },
      },
      {
        '@type': 'Question',
        name: 'En ucuz uçak bileti nasıl bulunur?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'En ucuz uçak bileti için erken rezervasyon yapın, hafta içi uçuşları tercih edin ve esnek tarih araması kullanın. WooNomad ile tüm havayollarını tek seferde karşılaştırabilirsiniz.',
        },
      },
      {
        '@type': 'Question',
        name: 'Uçak bileti ne zaman daha ucuz?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Uçak biletleri genellikle Salı ve Çarşamba günleri, düşük sezonlarda (Ocak-Şubat, Kasım) ve seyahatten 6-8 hafta önce daha ucuzdur.',
        },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>En Ucuz Uçak Bileti Fiyatları {currentYear} - WooNomad</title>
        <meta 
          name="description" 
          content={`En ucuz uçak bileti fiyatlarını karşılaştırın. Tüm havayollarının biletlerini tek seferde arayın, en uygun ${currentYear} uçuş fırsatlarını yakalayın. Hızlı ve güvenli rezervasyon.`}
        />
        <meta name="keywords" content="ucuz uçak bileti, uçak bileti, en ucuz bilet, uçak bileti fiyatları, online bilet, havayolu bileti, uçuş ara, bilet karşılaştırma" />
        <link rel="canonical" href={BASE_URL} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`En Ucuz Uçak Bileti Fiyatları ${currentYear} - WooNomad`} />
        <meta property="og:description" content="Tüm havayollarının biletlerini karşılaştırın, en uygun uçak bileti fırsatlarını yakalayın." />
        <meta property="og:url" content={BASE_URL} />
        <meta property="og:site_name" content="WooNomad" />
        <meta property="og:locale" content="tr_TR" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="En Ucuz Uçak Bileti - WooNomad" />
        <meta name="twitter:description" content="Tüm havayollarının biletlerini karşılaştırın, en uygun fiyatları bulun." />
        
        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
            <Logo size="sm" showText={true} className="hidden sm:flex" />
            <Logo size="sm" showText={false} className="sm:hidden" />
            <div className="flex items-center gap-2">
              <a 
                href="/destinasyonlar" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                Tüm Destinasyonlar
              </a>
              <SettingsDropdown />
            </div>
          </div>
        </header>

        {/* Sticky Results Banner */}
        {flights.length > 0 && !isLoading && (
          <div className="sticky top-[41px] z-30 bg-primary text-primary-foreground py-2 px-4 text-center text-sm font-medium shadow-md animate-in slide-in-from-top duration-300">
            <span className="inline-flex items-center gap-2 flex-wrap justify-center">
              <span className="inline-flex items-center gap-2">
                <Plane className="h-4 w-4" aria-hidden="true" />
                {filteredAndSortedFlights.length} uçuş bulundu
              </span>
              {priceRange && (
                <span className="text-primary-foreground/90 bg-primary-foreground/10 px-2 py-0.5 rounded-full text-xs">
                  {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                </span>
              )}
              {filteredAndSortedFlights.length !== flights.length && (
                <span className="text-primary-foreground/70 text-xs">
                  ({flights.length} toplam)
                </span>
              )}
            </span>
          </div>
        )}

        <main className="flex-1">
          {/* Hero + Results */}
          <section
            className={cn(
              "flex flex-col items-center px-3 md:px-4 py-6 md:py-8",
              hasResultsSection ? "justify-start" : "flex-1 justify-center"
            )}
            aria-labelledby="hero-title"
          >
            {/* Logo & Title */}
            <div className={cn("text-center", hasResultsSection ? "mb-5 md:mb-6" : "mb-6 md:mb-8")}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Globe className="h-8 w-8 md:h-10 md:w-10 text-primary" aria-hidden="true" />
              </div>
              <h1 id="hero-title" className="text-xl md:text-3xl font-display font-semibold text-foreground">
                En Ucuz Uçak Bileti
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                Tüm havayollarını karşılaştırın, en uygun fiyatı bulun
              </p>
            </div>

            {/* Search Form */}
            <div className="w-full max-w-2xl px-1">
              <SearchForm
                ref={searchFormRef}
                onSearch={handleSearch}
                isLoading={isLoading}
              />
            </div>

            {/* Results Section */}
            {hasResultsSection && (
              <div ref={resultsRef} className="w-full max-w-3xl mt-6 md:mt-8">
                <div className="bg-muted border border-border/50 rounded-2xl">
                  <div className="px-4 py-6">
                    {error && (
                      <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-4 text-center text-sm">
                        {error}
                      </div>
                    )}

                    {flights.length > 0 && (
                      <>
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                          <span className="text-sm text-muted-foreground">
                            {filteredAndSortedFlights.length} uçuş bulundu
                          </span>

                          <FlightFilters
                            filters={filters}
                            onFiltersChange={setFilters}
                            availableAirlines={availableAirlines}
                            maxPrice={maxPrice}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                          />
                        </div>

                        <div className="space-y-2">
                          {filteredAndSortedFlights.map((flight, index) => (
                            <FlightCard
                              key={`${flight.flight_number}-${flight.departure_at}`}
                              flight={flight}
                              isFavorite={isFavorite(flight)}
                              onToggleFavorite={() => toggleFavorite(flight)}
                              rank={getRank(flight, index)}
                            />
                          ))}
                        </div>

                        {filteredAndSortedFlights.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            Filtrelere uygun uçuş bulunamadı
                          </div>
                        )}
                      </>
                    )}

                    {isLoading && (
                      <div className="text-center py-10">
                        <Plane className="h-8 w-8 mx-auto text-primary animate-bounce mb-2" aria-hidden="true" />
                        <p className="text-muted-foreground text-sm">Uçuşlar aranıyor...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* In-Article Ad after results */}
                {flights.length > 5 && <AdInArticle />}
              </div>
            )}

            {/* Popular Routes */}
            <div className={cn("w-full max-w-2xl", hasResultsSection ? "mt-10" : "mt-6 md:mt-8")}>
              <PopularRoutes onRouteSelect={handlePopularRouteSelect} />
            </div>
          </section>

          {/* SEO Content Section */}
          <section className="max-w-4xl mx-auto px-4 py-12" aria-labelledby="seo-features">
            <h2 id="seo-features" className="text-2xl font-bold text-center mb-8">
              Neden WooNomad?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-muted rounded-xl">
                <Search className="h-10 w-10 text-primary mx-auto mb-4" aria-hidden="true" />
                <h3 className="font-semibold mb-2">Kapsamlı Arama</h3>
                <p className="text-sm text-muted-foreground">
                  Tüm havayollarının uçak biletlerini tek seferde karşılaştırın. 
                  En ucuz bilet fiyatlarını anında görün.
                </p>
              </div>
              <div className="text-center p-6 bg-muted rounded-xl">
                <Shield className="h-10 w-10 text-primary mx-auto mb-4" aria-hidden="true" />
                <h3 className="font-semibold mb-2">Güvenli Rezervasyon</h3>
                <p className="text-sm text-muted-foreground">
                  Doğrudan havayolu sitelerine yönlendirme ile güvenli online bilet alımı. 
                  Aracı komisyon yok.
                </p>
              </div>
              <div className="text-center p-6 bg-muted rounded-xl">
                <Clock className="h-10 w-10 text-primary mx-auto mb-4" aria-hidden="true" />
                <h3 className="font-semibold mb-2">Hızlı Sonuçlar</h3>
                <p className="text-sm text-muted-foreground">
                  Saniyeler içinde yüzlerce uçuş seçeneği. Esnek tarih ve filtre 
                  seçenekleriyle arama yapın.
                </p>
              </div>
            </div>
          </section>

          {/* Banner Ad */}
          <div className="max-w-4xl mx-auto px-4">
            <AdBanner />
          </div>

          {/* LLM-Friendly Content */}
          <section className="max-w-4xl mx-auto px-4 py-12 seo-content" aria-labelledby="seo-info">
            <h2 id="seo-info" className="text-2xl font-bold mb-6">
              Ucuz Uçak Bileti Nasıl Bulunur?
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="leading-relaxed mb-4">
                <strong>En ucuz uçak bileti</strong> bulmak için doğru zamanda, doğru stratejiyle arama yapmak 
                önemlidir. WooNomad ile tüm havayollarının biletlerini karşılaştırarak en uygun fiyatları 
                bulabilirsiniz.
              </p>
              
              <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
                Ucuz Bilet İçin İpuçları
              </h3>
              <ul className="space-y-2 mb-6">
                <li>• <strong>Erken rezervasyon yapın:</strong> Seyahatinizden 6-8 hafta önce bilet almak genellikle %20-30 tasarruf sağlar.</li>
                <li>• <strong>Hafta içi uçuşları tercih edin:</strong> Salı ve Çarşamba günleri genellikle en ucuz günlerdir.</li>
                <li>• <strong>Esnek tarih araması kullanın:</strong> Bir gün öncesi veya sonrası önemli fiyat farkları yaratabilir.</li>
                <li>• <strong>Düşük sezonu değerlendirin:</strong> Ocak-Şubat ve Kasım aylarında uçak bileti fiyatları düşer.</li>
                <li>• <strong>Fiyat karşılaştırması yapın:</strong> WooNomad ile tüm havayollarını tek seferde karşılaştırın.</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
                WooNomad ile Uçak Bileti Arama
              </h3>
              <p className="leading-relaxed">
                WooNomad, Türkiye'den dünyaya tüm uçuşları karşılaştırmanızı sağlayan bir uçak bileti arama 
                motorudur. İstanbul, Ankara, İzmir ve diğer şehirlerden Avrupa, Asya, Amerika ve tüm dünyaya 
                uçuş arayabilirsiniz. Gidiş-dönüş bilet, tek yön bilet veya çoklu şehir seçenekleriyle 
                ihtiyacınıza uygun uçuşları bulun.
              </p>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="max-w-4xl mx-auto px-4 py-12 bg-muted/30" aria-labelledby="faq-section">
            <h2 id="faq-section" className="text-2xl font-bold mb-6 text-center">
              Sıkça Sorulan Sorular
            </h2>
            <div className="space-y-4">
              <details className="bg-background rounded-lg p-4 border border-border">
                <summary className="font-semibold cursor-pointer">WooNomad nedir?</summary>
                <p className="mt-3 text-muted-foreground">
                  WooNomad, tüm havayollarının uçak biletlerini karşılaştırarak en ucuz fiyatları bulmanızı 
                  sağlayan bir uçak bileti arama motorudur. Doğrudan havayolu sitelerine yönlendirme yapar, 
                  komisyon almaz.
                </p>
              </details>
              <details className="bg-background rounded-lg p-4 border border-border">
                <summary className="font-semibold cursor-pointer">En ucuz uçak bileti nasıl bulunur?</summary>
                <p className="mt-3 text-muted-foreground">
                  En ucuz uçak bileti için erken rezervasyon yapın (6-8 hafta önce), hafta içi günleri tercih 
                  edin (Salı-Çarşamba), esnek tarih araması kullanın ve düşük sezon dönemlerini değerlendirin.
                </p>
              </details>
              <details className="bg-background rounded-lg p-4 border border-border">
                <summary className="font-semibold cursor-pointer">Uçak bileti ne zaman daha ucuz?</summary>
                <p className="mt-3 text-muted-foreground">
                  Uçak biletleri genellikle Salı ve Çarşamba günleri, yılın düşük sezonlarında (Ocak-Şubat, 
                  Kasım) ve seyahatten 6-8 hafta önce daha ucuzdur. Son dakika biletleri ise doluluk durumuna 
                  göre değişir.
                </p>
              </details>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-muted border-t border-border py-8 mt-auto">
          <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {currentYear} WooNomad. Tüm hakları saklıdır.</p>
            <p className="mt-2">
              Ucuz uçak bileti • Uçak bileti fiyatları • Online bilet • Havayolu karşılaştırma
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
