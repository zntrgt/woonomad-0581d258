import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plane, Search, Globe, Shield, Clock, CreditCard, Sparkles, MapPin, TrendingUp, Star } from 'lucide-react';
import { SearchForm, SearchFormRef } from '@/components/SearchForm';
import { PopularRoutes } from '@/components/PopularRoutes';
import { FlightCard } from '@/components/FlightCard';
import { FlightFilters, FilterOptions } from '@/components/FlightFilters';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { AdBanner, AdInArticle } from '@/components/AdSense';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { useFavorites } from '@/hooks/useFavorites';
import { useSettings } from '@/contexts/SettingsContext';
import { SearchParams, Flight, Airport } from '@/lib/types';
import { cn } from '@/lib/utils';
import { parseISO, format } from 'date-fns';
import { tr } from 'date-fns/locale';

type SortOption = 'price' | 'duration' | 'departure' | 'best';

// Airport lookup for popular routes - includes all destinations
const airportLookup: Record<string, Airport> = {
  'IST': { code: 'IST', name: 'İstanbul Havalimanı', city: 'İstanbul', country: 'Türkiye' },
  'SAW': { code: 'SAW', name: 'Sabiha Gökçen', city: 'İstanbul', country: 'Türkiye' },
  'ESB': { code: 'ESB', name: 'Esenboğa Havalimanı', city: 'Ankara', country: 'Türkiye' },
  'AYT': { code: 'AYT', name: 'Antalya Havalimanı', city: 'Antalya', country: 'Türkiye' },
  'ADB': { code: 'ADB', name: 'Adnan Menderes', city: 'İzmir', country: 'Türkiye' },
  'BJV': { code: 'BJV', name: 'Milas-Bodrum Havalimanı', city: 'Bodrum', country: 'Türkiye' },
  'BCN': { code: 'BCN', name: 'El Prat', city: 'Barselona', country: 'İspanya' },
  'ATH': { code: 'ATH', name: 'Eleftherios Venizelos', city: 'Atina', country: 'Yunanistan' },
  'CDG': { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'Fransa' },
  'FCO': { code: 'FCO', name: 'Fiumicino', city: 'Roma', country: 'İtalya' },
  'DXB': { code: 'DXB', name: 'Dubai', city: 'Dubai', country: 'BAE' },
  'TBS': { code: 'TBS', name: 'Tiflis Havalimanı', city: 'Tiflis', country: 'Gürcistan' },
  'SKP': { code: 'SKP', name: 'Üsküp Havalimanı', city: 'Üsküp', country: 'Kuzey Makedonya' },
  'LHR': { code: 'LHR', name: 'Heathrow', city: 'Londra', country: 'İngiltere' },
  'AMS': { code: 'AMS', name: 'Schiphol', city: 'Amsterdam', country: 'Hollanda' },
  'FRA': { code: 'FRA', name: 'Frankfurt', city: 'Frankfurt', country: 'Almanya' },
  'BER': { code: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', country: 'Almanya' },
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

  // JSON-LD Structured Data for SEO and LLM
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'WooNomad',
    alternateName: 'WooNomad Uçak Bileti',
    url: BASE_URL,
    description: 'Türkiye\'nin en kapsamlı uçak bileti karşılaştırma platformu. Tüm havayollarının biletlerini tek seferde arayın, en ucuz uçuş fırsatlarını yakalayın.',
    inLanguage: 'tr-TR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/?search={search_term}`,
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
    description: 'Türkiye\'nin en kapsamlı uçak bileti karşılaştırma platformu. 500\'den fazla havayolunun biletlerini karşılaştırın.',
    foundingDate: '2024',
    areaServed: {
      '@type': 'Country',
      name: 'Türkiye',
    },
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Turkish', 'English'],
    },
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Uçak Bileti Arama ve Karşılaştırma',
    provider: {
      '@type': 'Organization',
      name: 'WooNomad',
      url: BASE_URL,
    },
    description: 'Tüm havayollarının uçak biletlerini karşılaştırın, en ucuz fiyatları bulun. Komisyonsuz, şeffaf fiyatlandırma.',
    serviceType: 'Flight Search and Comparison',
    areaServed: {
      '@type': 'Country',
      name: 'Turkey',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'TRY',
      },
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
          text: 'WooNomad, tüm havayollarının uçak biletlerini karşılaştırarak en ucuz fiyatları bulmanızı sağlayan bir uçak bileti arama motorudur. Komisyon almadan, şeffaf fiyatlarla güvenli rezervasyon yapabilirsiniz.',
        },
      },
      {
        '@type': 'Question',
        name: 'En ucuz uçak bileti nasıl bulunur?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'En ucuz uçak bileti için erken rezervasyon yapın (6-8 hafta öncesi ideal), hafta içi uçuşları tercih edin (Salı-Çarşamba en uygun), esnek tarih araması kullanın ve WooNomad ile tüm havayollarını tek seferde karşılaştırın.',
        },
      },
      {
        '@type': 'Question',
        name: 'Uçak bileti ne zaman daha ucuz?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Uçak biletleri genellikle Salı ve Çarşamba günleri, düşük sezonlarda (Ocak-Şubat, Kasım) ve seyahatten 6-8 hafta önce daha ucuzdur. Ayrıca gece yarısı ve sabah erken saatlerde fiyat güncellemeleri olabilir.',
        },
      },
      {
        '@type': 'Question',
        name: 'Hangi havayolları karşılaştırılıyor?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'WooNomad, Turkish Airlines, Pegasus, SunExpress, AnadoluJet dahil 500\'den fazla havayolunun biletlerini karşılaştırır. Hem yurt içi hem de yurt dışı uçuşlar için en uygun fiyatları bulabilirsiniz.',
        },
      },
      {
        '@type': 'Question',
        name: 'WooNomad komisyon alıyor mu?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hayır, WooNomad herhangi bir komisyon almaz. Doğrudan havayolu sitelerine yönlendirme yapılır ve ödemeyi orada gerçekleştirirsiniz. Gördüğünüz fiyat, ödeyeceğiniz fiyattır.',
        },
      },
    ],
  };

  // Breadcrumb Schema for SEO
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Ana Sayfa',
        item: BASE_URL,
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{`En Ucuz Uçak Bileti Fiyatları ${currentYear} - WooNomad`}</title>
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
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        {/* Sticky Results Banner */}
        {flights.length > 0 && !isLoading && (
          <div className="sticky top-[41px] z-30 gradient-primary text-primary-foreground py-3 px-4 text-center text-sm font-medium shadow-lg animate-fade-in">
            <span className="inline-flex items-center gap-3 flex-wrap justify-center">
              <span className="inline-flex items-center gap-2">
                <Plane className="h-4 w-4 animate-bounce-gentle" aria-hidden="true" />
                <span className="font-semibold">{filteredAndSortedFlights.length} uçuş bulundu</span>
              </span>
              {priceRange && (
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
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
          {/* Hero Section */}
          <section
            className={cn(
              "relative flex flex-col items-center px-4 md:px-6",
              hasResultsSection ? "py-8 md:py-12" : "py-12 md:py-20"
            )}
            aria-labelledby="hero-title"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-travel-coral/5 rounded-full blur-3xl animate-float-delayed" />
            </div>

            {/* Hero Content */}
            <div className={cn(
              "relative text-center max-w-3xl mx-auto",
              hasResultsSection ? "mb-6 md:mb-8" : "mb-8 md:mb-12"
            )}>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
                <Sparkles className="h-4 w-4" />
                <span>Türkiye'nin En Kapsamlı Uçuş Karşılaştırma Platformu</span>
              </div>
              
              <h1 
                id="hero-title" 
                className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 animate-fade-in-up"
                style={{ animationDelay: '0.1s' }}
              >
                En Ucuz <span className="text-gradient">Uçak Bileti</span>
              </h1>
              
              <p 
                className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up"
                style={{ animationDelay: '0.2s' }}
              >
                Tüm havayollarını tek seferde karşılaştırın, en uygun fiyatı bulun. 
                Hızlı, güvenli ve komisyonsuz.
              </p>
            </div>

            {/* Floating Search Form */}
            <div 
              className="relative w-full max-w-3xl animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="search-bar-float p-6 md:p-8">
                <SearchForm
                  ref={searchFormRef}
                  onSearch={handleSearch}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Trust Badges */}
            {!hasResultsSection && (
              <div 
                className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground animate-fade-in"
                style={{ animationDelay: '0.4s' }}
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-success" />
                  <span>Güvenli Ödeme</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>En İyi Fiyat Garantisi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-travel-gold" />
                  <span>500+ Havayolu</span>
                </div>
              </div>
            )}

            {/* Results Section */}
            {hasResultsSection && (
              <div ref={resultsRef} className="w-full max-w-4xl mt-8 md:mt-12 animate-fade-in-up">
                <div className="card-modern p-6 md:p-8">
                  {error && (
                    <div className="bg-destructive/10 text-destructive p-4 rounded-xl mb-6 text-center text-sm font-medium border border-destructive/20">
                      {error}
                    </div>
                  )}

                  {flights.length > 0 && (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border/50">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          <span className="font-semibold text-foreground">
                            {filteredAndSortedFlights.length} uçuş bulundu
                          </span>
                        </div>

                        <FlightFilters
                          filters={filters}
                          onFiltersChange={setFilters}
                          availableAirlines={availableAirlines}
                          maxPrice={maxPrice}
                          sortBy={sortBy}
                          onSortChange={setSortBy}
                        />
                      </div>

                      <div className="space-y-4">
                        {filteredAndSortedFlights.map((flight, index) => (
                          <div 
                            key={`${flight.flight_number}-${flight.departure_at}`}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.05}s` }}
                          >
                            <FlightCard
                              flight={flight}
                              isFavorite={isFavorite(flight)}
                              onToggleFavorite={() => toggleFavorite(flight)}
                              rank={getRank(flight, index)}
                            />
                          </div>
                        ))}
                      </div>

                      {filteredAndSortedFlights.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
                          <p className="font-medium">Filtrelere uygun uçuş bulunamadı</p>
                          <p className="text-sm mt-1">Farklı filtreler deneyebilirsiniz</p>
                        </div>
                      )}
                    </>
                  )}

                  {isLoading && (
                    <div className="text-center py-16">
                      <div className="relative inline-block">
                        <Plane className="h-12 w-12 text-primary animate-bounce-gentle" aria-hidden="true" />
                        <div className="absolute inset-0 rounded-full animate-pulse-ring border-2 border-primary" />
                      </div>
                      <p className="text-muted-foreground mt-4 font-medium">Uçuşlar aranıyor...</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">Lütfen bekleyin</p>
                    </div>
                  )}
                </div>

                {/* In-Article Ad after results */}
                {flights.length > 5 && <AdInArticle />}
              </div>
            )}

            {/* Popular Routes */}
            <div className={cn("w-full max-w-3xl", hasResultsSection ? "mt-12" : "mt-10 md:mt-16")}>
              <PopularRoutes onRouteSelect={handlePopularRouteSelect} />
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 md:py-24 section-routes" aria-labelledby="seo-features">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 id="seo-features" className="text-2xl md:text-4xl font-display font-bold text-foreground mb-4">
                  Neden WooNomad?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Seyahat planlamanızı kolaylaştıran güçlü özellikler
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {[
                  {
                    icon: Search,
                    title: 'Kapsamlı Arama',
                    description: 'Tüm havayollarının uçak biletlerini tek seferde karşılaştırın. En ucuz bilet fiyatlarını anında görün.',
                    color: 'bg-primary/10 text-primary'
                  },
                  {
                    icon: Shield,
                    title: 'Güvenli Rezervasyon',
                    description: 'Doğrudan havayolu sitelerine yönlendirme ile güvenli online bilet alımı. Aracı komisyon yok.',
                    color: 'bg-success/10 text-success'
                  },
                  {
                    icon: Clock,
                    title: 'Hızlı Sonuçlar',
                    description: 'Saniyeler içinde yüzlerce uçuş seçeneği. Esnek tarih ve filtre seçenekleriyle arama yapın.',
                    color: 'bg-travel-coral/10 text-travel-coral'
                  }
                ].map((feature, index) => (
                  <div 
                    key={feature.title}
                    className="card-modern p-8 text-center group hover:border-primary/30"
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110",
                      feature.color
                    )}>
                      <feature.icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Banner Ad */}
          <div className="max-w-4xl mx-auto px-4 py-8">
            <AdBanner />
          </div>

          {/* LLM-Friendly Content */}
          <section className="max-w-4xl mx-auto px-4 py-12 md:py-16 seo-content" aria-labelledby="seo-info">
            <div className="card-modern p-8 md:p-12">
              <h2 id="seo-info" className="text-2xl md:text-3xl font-display font-bold mb-8 text-foreground">
                Ucuz Uçak Bileti Nasıl Bulunur?
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                <p className="leading-relaxed text-base md:text-lg">
                  En uygun uçak bileti fiyatlarını bulmak için doğru zamanı ve stratejileri bilmek önemlidir. 
                  WooNomad olarak, yolcuların en avantajlı fiyatları yakalamasına yardımcı oluyoruz.
                </p>

                <div className="grid md:grid-cols-2 gap-8 my-10">
                  <div className="space-y-4">
                    <h3 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      En Uygun Alım Zamanı
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Yurt içi uçuşlar için 2-4 hafta önceden</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Yurt dışı uçuşlar için 6-8 hafta önceden</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Salı ve Çarşamba günleri genelde daha ucuz</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Gece yarısı fiyat düşüşleri takip edin</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-success" />
                      </div>
                      Tasarruf İpuçları
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-success mt-1">•</span>
                        <span>Esnek tarih araması yapın</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-success mt-1">•</span>
                        <span>Aktarmalı uçuşları değerlendirin</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-success mt-1">•</span>
                        <span>Alternatif havalimanlarını kontrol edin</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-success mt-1">•</span>
                        <span>Son dakika fırsatlarını kaçırmayın</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-2xl p-6 border border-border/50">
                  <h3 className="text-lg font-display font-semibold text-foreground mb-3">
                    WooNomad Avantajları
                  </h3>
                  <p className="text-sm leading-relaxed">
                    WooNomad, yüzlerce havayolunun uçak biletlerini tek bir platformda karşılaştırmanızı sağlar. 
                    Gerçek zamanlı fiyat takibi, esnek arama filtreleri ve şeffaf fiyatlandırma ile en uygun 
                    uçak biletini bulmanız artık çok kolay. Komisyon almadan, doğrudan havayollarından 
                    güvenli bilet alımı yapabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="max-w-4xl mx-auto px-4 pb-16 md:pb-24">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-10">
              Sık Sorulan Sorular
            </h2>
            <div className="space-y-4">
              {[
                {
                  question: 'WooNomad nedir?',
                  answer: 'WooNomad, tüm havayollarının uçak biletlerini karşılaştırarak en ucuz fiyatları bulmanızı sağlayan bir uçak bileti arama motorudur. Komisyon almadan, şeffaf fiyatlarla güvenli rezervasyon yapabilirsiniz.'
                },
                {
                  question: 'En ucuz uçak bileti nasıl bulunur?',
                  answer: 'En ucuz uçak bileti için erken rezervasyon yapın, hafta içi uçuşları tercih edin ve esnek tarih araması kullanın. WooNomad ile tüm havayollarını tek seferde karşılaştırabilirsiniz.'
                },
                {
                  question: 'Uçak bileti ne zaman daha ucuz?',
                  answer: 'Uçak biletleri genellikle Salı ve Çarşamba günleri, düşük sezonlarda (Ocak-Şubat, Kasım) ve seyahatten 6-8 hafta önce daha ucuzdur.'
                }
              ].map((faq, index) => (
                <div key={index} className="card-modern p-6">
                  <h3 className="font-display font-semibold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-8 md:py-12 mb-20 md:mb-0 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                  <span className="font-display font-bold text-lg">WooNomad</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Türkiye'nin en kapsamlı uçak bileti karşılaştırma platformu.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-foreground">Keşfet</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="/sehirler" className="hover:text-primary transition-colors">Şehirler</a></li>
                  <li><a href="/ucuslar" className="hover:text-primary transition-colors">Uçuşlar</a></li>
                  <li><a href="/oteller" className="hover:text-primary transition-colors">Oteller</a></li>
                  <li><a href="/blog" className="hover:text-primary transition-colors">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-foreground">Popüler</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="/sehir/paris" className="hover:text-primary transition-colors">Paris</a></li>
                  <li><a href="/sehir/amsterdam" className="hover:text-primary transition-colors">Amsterdam</a></li>
                  <li><a href="/sehir/barcelona" className="hover:text-primary transition-colors">Barcelona</a></li>
                  <li><a href="/sehir/roma" className="hover:text-primary transition-colors">Roma</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-foreground">Yasal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="/gizlilik-politikasi" className="hover:text-primary transition-colors">Gizlilik Politikası</a></li>
                  <li><a href="/kullanim-kosullari" className="hover:text-primary transition-colors">Kullanım Koşulları</a></li>
                  <li><a href="/kvkk" className="hover:text-primary transition-colors">KVKK</a></li>
                  <li><a href="/cerez-politikasi" className="hover:text-primary transition-colors">Çerez Politikası</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                © {currentYear} WooNomad. Tüm hakları saklıdır.
              </p>
              <p className="text-xs text-muted-foreground/70">
                Uçak bileti fiyatları değişkenlik gösterebilir.
              </p>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </>
  );
};

export default Index;
