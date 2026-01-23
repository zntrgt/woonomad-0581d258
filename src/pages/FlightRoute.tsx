import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Plane, MapPin, Clock, Calendar, ArrowRight, ArrowLeft,
  Building2, CreditCard, Info, CheckCircle, Users, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SearchForm, SearchFormRef } from '@/components/SearchForm';
import { FlightCard } from '@/components/FlightCard';
import { SearchStatus, FlightResultsSkeleton, StickyScrollButton } from '@/components/SearchStatus';
import { PriceTrendChart } from '@/components/PriceTrendChart';
import { AdBanner, AdInArticle } from '@/components/AdSense';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { useFavorites } from '@/hooks/useFavorites';
import { useSettings } from '@/contexts/SettingsContext';
import { getRouteBySlug, generateFlightRoutes, FlightRoute as FlightRouteType } from '@/lib/flightRoutes';
import { SearchParams, Airport } from '@/lib/types';
import { format, addMonths, startOfMonth } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FlightRoute() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const searchFormRef = useRef<SearchFormRef>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const route = slug ? getRouteBySlug(slug) : undefined;
  const { flights, isLoading, searchState, searchFlights } = useFlightSearch();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { formatPrice } = useSettings();
  
  // State for price trend chart
  const [searchedOrigin, setSearchedOrigin] = useState<string | null>(null);
  const [searchedDestination, setSearchedDestination] = useState<string | null>(null);
  const [searchedMonth, setSearchedMonth] = useState<string | null>(null);

  // Calculate current month for default price trend
  const currentMonth = useMemo(() => format(startOfMonth(new Date()), 'yyyy-MM'), []);

  // Auto-populate search form
  useEffect(() => {
    if (route && searchFormRef.current) {
      const originAirport: Airport = {
        code: route.originCode,
        name: route.originCity,
        city: route.originCity,
        country: route.originCountry,
      };
      const destAirport: Airport = {
        code: route.destinationCode,
        name: route.destinationCity,
        city: route.destinationCity,
        country: route.destinationCountry,
      };
      
      searchFormRef.current.setAirports(originAirport, destAirport);
    }
  }, [route]);

  // Auto-scroll to results when search completes
  const scrollToResults = useCallback(() => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    if (searchState === 'success' || searchState === 'no-results') {
      setTimeout(scrollToResults, 300);
    }
  }, [searchState, scrollToResults]);

  const handleSearch = (params: SearchParams) => {
    // Store search parameters for price trend chart
    setSearchedOrigin(params.origin);
    setSearchedDestination(params.destination);
    setSearchedMonth(params.departDate.substring(0, 7)); // Extract YYYY-MM
    
    searchFlights(params);
  };

  if (!route) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Helmet>
          <title>Sayfa Bulunamadı | WooNomad</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <h1 className="text-2xl font-bold mb-4">Uçuş Rotası Bulunamadı</h1>
        <p className="text-muted-foreground mb-6">Aradığınız uçuş rotası sayfası mevcut değil.</p>
        <Button asChild>
          <Link to="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
    );
  }

  const BASE_URL = 'https://woonomad.co';
  const currentYear = new Date().getFullYear();

  const pageTitle = `${route.originCity} ${route.destinationCity} Uçak Bileti ${currentYear} | Uçuş Süresi, Fiyat - WooNomad`;
  const pageDescription = `${route.originCity} - ${route.destinationCity} uçak bileti fiyatları, uçuş süresi ${route.estimatedDuration}, mesafe ${route.distance}. ${route.originCity} ${route.destinationCity} arası en ucuz bilet ${formatPrice(route.priceRange.min)} fiyatlarla.`;
  const pageKeywords = `${route.originCity} ${route.destinationCity} uçak bileti, ${route.originCity} ${route.destinationCity} uçuş süresi, ${route.originCity} ${route.destinationCity} kaç km, ${route.originCity} ${route.destinationCity} kaç saat, ${route.originCity.toLowerCase()} ${route.destinationCity.toLowerCase()} bilet fiyatları, ${route.originCode} ${route.destinationCode} uçuş`;

  // JSON-LD Schemas
  const flightSchema = {
    '@context': 'https://schema.org',
    '@type': 'Flight',
    departureAirport: {
      '@type': 'Airport',
      name: route.originCity,
      iataCode: route.originCode,
    },
    arrivalAirport: {
      '@type': 'Airport',
      name: route.destinationCity,
      iataCode: route.destinationCode,
    },
    provider: {
      '@type': 'Organization',
      name: 'WooNomad',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Uçuşlar', item: `${BASE_URL}/ucuslar` },
      { '@type': 'ListItem', position: 3, name: `${route.originCity} - ${route.destinationCity}`, item: `${BASE_URL}/ucus/${route.slug}` },
    ],
  };

  // Parse duration to get hours for natural language
  const parseDurationHours = (duration: string): string => {
    const match = duration.match(/(\d+)\s*saat/);
    if (match) {
      const hours = parseInt(match[1]);
      if (hours < 2) return 'yaklaşık 1 saat';
      if (hours <= 3) return `yaklaşık ${hours} saat`;
      return `${hours} saat civarında`;
    }
    return duration;
  };

  const flightHours = parseDurationHours(route.estimatedDuration);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `${route.originCity} ${route.destinationCity} uçakla kaç saat?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${route.originCity} - ${route.destinationCity} arası uçakla ${flightHours} sürmektedir. Direkt uçuşlarda uçuş süresi ${route.estimatedDuration} olup, aktarmalı uçuşlarda bu süre aktarma noktasına bağlı olarak 2-6 saat daha uzayabilir. ${route.airlines.slice(0, 3).join(', ')} gibi havayolları bu rotada hizmet vermektedir.`,
        },
      },
      {
        '@type': 'Question',
        name: `${route.originCity} ${route.destinationCity} uçuş süresi ne kadar?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${route.originCity} - ${route.destinationCity} arası uçuş süresi ortalama ${route.estimatedDuration}'dir. Mesafe yaklaşık ${route.distance} olup, direkt ve aktarmalı uçuş seçenekleri mevcuttur.`,
        },
      },
      {
        '@type': 'Question',
        name: `${route.originCity} ${route.destinationCity} uçak bileti ne kadar?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${route.originCity} - ${route.destinationCity} uçak bileti fiyatları ${formatPrice(route.priceRange.min)} ile ${formatPrice(route.priceRange.max)} arasında değişmektedir. En ucuz bilet için erken rezervasyon yapın, hafta içi uçuşları tercih edin ve WooNomad ile tüm havayollarını karşılaştırın.`,
        },
      },
      {
        '@type': 'Question',
        name: `${route.originCity}'den ${route.destinationCity}'e hangi havayolları uçuyor?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${route.originCity} - ${route.destinationCity} rotasında ${route.airlines.join(', ')} havayolları hizmet vermektedir. WooNomad ile tüm havayollarının fiyatlarını karşılaştırabilirsiniz.`,
        },
      },
      {
        '@type': 'Question',
        name: `${route.originCity} ${route.destinationCity} arası kaç km?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${route.originCity} - ${route.destinationCity} arası mesafe ${route.distance}'dir. Bu mesafe uçakla ${route.estimatedDuration} sürede katedilmektedir.`,
        },
      },
      {
        '@type': 'Question',
        name: `En ucuz ${route.originCity} ${route.destinationCity} bileti nasıl bulunur?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `En ucuz ${route.originCity} ${route.destinationCity} bileti için: 1) Seyahatinizden 6-8 hafta önce rezervasyon yapın, 2) Salı ve Çarşamba günlerini tercih edin, 3) Esnek tarih araması kullanın, 4) Aktarmalı uçuşları değerlendirin, 5) WooNomad ile tüm havayollarının fiyatlarını anında karşılaştırın.`,
        },
      },
    ],
  };

  // Get related routes
  const allRoutes = generateFlightRoutes();
  const relatedRoutes = allRoutes
    .filter(r => 
      r.slug !== route.slug && 
      (r.originCode === route.originCode || r.destinationCode === route.destinationCode)
    )
    .slice(0, 6);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <link rel="canonical" href={`${BASE_URL}/ucus/${route.slug}`} />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={`${BASE_URL}/ucus/${route.slug}`} />
        <meta property="og:site_name" content="WooNomad" />
        <meta property="og:locale" content="tr_TR" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        <script type="application/ld+json">{JSON.stringify(flightSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Breadcrumb items={[
            { label: 'Uçuş Rotaları', href: '/ucuslar' },
            { label: `${route.originCity} - ${route.destinationCity}` },
          ]} />
        </div>

        {/* Hero Section - Ultra Compact */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-3 md:py-6 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Mobile: Horizontal compact row | Desktop: Standard layout */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2 sm:mb-3">
              {/* Origin */}
              <div className="flex items-center gap-1.5 sm:gap-2 sm:flex-col sm:text-center">
                <span className="text-xl sm:text-3xl">{route.originFlag}</span>
                <div className="sm:text-center">
                  <h2 className="text-sm sm:text-xl font-semibold leading-tight">{route.originCity}</h2>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{route.originCode}</p>
                </div>
              </div>
              
              {/* Flight Icon & Duration */}
              <div className="flex items-center gap-1 sm:flex-col sm:px-4">
                <Plane className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{route.estimatedDuration}</span>
              </div>
              
              {/* Destination */}
              <div className="flex items-center gap-1.5 sm:gap-2 sm:flex-col sm:text-center">
                <span className="text-xl sm:text-3xl">{route.destinationFlag}</span>
                <div className="sm:text-center">
                  <h2 className="text-sm sm:text-xl font-semibold leading-tight">{route.destinationCity}</h2>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{route.destinationCode}</p>
                </div>
              </div>
            </div>
            
            <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-center mb-1">
              {route.originCity} - {route.destinationCity} Uçak Bileti
            </h1>
            <p className="text-center text-muted-foreground text-xs sm:text-sm max-w-2xl mx-auto line-clamp-2 sm:line-clamp-none">
              {route.description}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          {/* Quick Info - Compact */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Card>
              <CardContent className="p-3 flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">Uçuş Süresi</div>
                  <div className="font-semibold text-sm">{route.estimatedDuration}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">Mesafe</div>
                  <div className="font-semibold text-sm">{route.distance}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">Fiyat Aralığı</div>
                  <div className="font-semibold text-xs">
                    {formatPrice(route.priceRange.min)} - {formatPrice(route.priceRange.max)}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 flex items-center gap-2">
                <Users className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">Havayolları</div>
                  <div className="font-semibold text-sm">{route.airlines.length}+ Havayolu</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Airlines Section */}
          <section className="mb-8 bg-muted/50 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              Bu Rotada Uçan Havayolları
            </h2>
            <div className="flex flex-wrap gap-2">
              {route.airlines.map((airline) => (
                <Badge key={airline} variant="secondary" className="text-sm py-1 px-3">
                  {airline}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              * Tahmini fiyat aralığı: <strong>{formatPrice(route.priceRange.min)}</strong> - <strong>{formatPrice(route.priceRange.max)}</strong> (tek yön, ekonomi sınıfı)
            </p>
          </section>

          {/* Search Form */}
          <section className="mb-6 bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              {route.originCity} - {route.destinationCity} Uçuş Ara
            </h2>
            <SearchForm
              ref={searchFormRef}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
            
            {/* Search Status */}
            <SearchStatus 
              state={searchState}
              resultsCount={flights.length}
              onScrollToResults={scrollToResults}
              className="mt-4"
            />
          </section>

          {/* Flight Results */}
          <div ref={resultsRef}>
            {isLoading && <FlightResultsSkeleton count={3} />}
            
            {/* Price Trend Chart - Shows after search */}
            {(searchedOrigin && searchedDestination && searchedMonth) && (
              <PriceTrendChart
                origin={searchedOrigin}
                destination={searchedDestination}
                month={searchedMonth}
                className="mb-6"
              />
            )}
            
            {flights.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">
                  Bulunan Uçuşlar ({flights.length} sonuç)
                </h2>
                <div className="space-y-3">
                  {flights.slice(0, 10).map((flight, index) => (
                    <FlightCard
                      key={`${flight.flight_number}-${flight.departure_at}`}
                      flight={flight}
                      isFavorite={isFavorite(flight)}
                      onToggleFavorite={() => toggleFavorite(flight)}
                      rank={index === 0 ? 'cheapest' : null}
                    />
                  ))}
                </div>
                
                {flights.length > 5 && <AdInArticle />}
              </section>
            )}
          </div>

          {/* Sticky Scroll Button */}
          <StickyScrollButton 
            visible={searchState === 'success' && flights.length > 0} 
            onClick={scrollToResults} 
          />

          {/* Tips Section */}
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-4">
              {route.originCity} - {route.destinationCity} Uçuş İpuçları
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {route.tips.map((tip, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">{tip}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Ad Banner */}
          <div className="mb-6">
            <AdBanner />
          </div>

          {/* FAQ Section */}
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-4">
              {route.originCity} - {route.destinationCity} Sıkça Sorulan Sorular
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="flight-hours">
                <AccordionTrigger>
                  {route.originCity} {route.destinationCity} uçakla kaç saat?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <strong>{route.originCity} - {route.destinationCity} arası uçakla {flightHours} sürmektedir.</strong> Direkt uçuşlarda toplam uçuş süresi {route.estimatedDuration} olup, aktarmalı uçuşlarda bu süre aktarma noktasına bağlı olarak 2-6 saat daha uzayabilir. {route.airlines.slice(0, 3).join(', ')} gibi havayolları bu rotada hizmet vermektedir.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="duration">
                <AccordionTrigger>
                  {route.originCity} {route.destinationCity} uçuş süresi ne kadar?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {route.originCity} - {route.destinationCity} arası direkt uçuş süresi ortalama <strong>{route.estimatedDuration}</strong>'dir. 
                  Aktarmalı uçuşlarda bu süre aktarma noktasına göre 2-6 saat uzayabilir. İki şehir arası mesafe yaklaşık {route.distance}'dir.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="distance">
                <AccordionTrigger>
                  {route.originCity} {route.destinationCity} arası kaç km?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {route.originCity} - {route.destinationCity} arası mesafe yaklaşık <strong>{route.distance}</strong>'dir. 
                  Bu mesafe uçakla {route.estimatedDuration} sürede katedilmektedir.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="price">
                <AccordionTrigger>
                  {route.originCity} {route.destinationCity} uçak bileti ne kadar?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {route.originCity} - {route.destinationCity} uçak bileti fiyatları <strong>{formatPrice(route.priceRange.min)}</strong> ile <strong>{formatPrice(route.priceRange.max)}</strong> arasında değişmektedir. 
                  En ucuz bilet için erken rezervasyon yapmanızı ve hafta içi uçuşları tercih etmenizi öneririz.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="airlines">
                <AccordionTrigger>
                  {route.originCity}'den {route.destinationCity}'e hangi havayolları uçuyor?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {route.originCity} - {route.destinationCity} rotasında <strong>{route.airlines.join(', ')}</strong> havayolları hizmet vermektedir. 
                  WooNomad ile tüm havayollarının fiyatlarını karşılaştırabilirsiniz.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="cheap">
                <AccordionTrigger>
                  En ucuz {route.originCity} {route.destinationCity} bileti nasıl bulunur?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  En ucuz bilet için: 1) Seyahatinizden 6-8 hafta önce rezervasyon yapın, 
                  2) Salı ve Çarşamba günlerini tercih edin, 3) Esnek tarih araması kullanın, 
                  4) Aktarmalı uçuşları değerlendirin, 5) WooNomad ile tüm havayollarını karşılaştırın.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* SEO/LLM Technical Info Section */}
          <section className="mb-8 bg-muted/30 rounded-xl p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4">
              {route.originCity} - {route.destinationCity} Teknik Bilgiler
            </h2>
            
            {/* Key Facts Table for LLM */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="bg-background rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">{route.originCity} {route.destinationCity} uçuş süresi</div>
                <div className="text-lg font-bold text-primary">{route.estimatedDuration}</div>
              </div>
              <div className="bg-background rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">{route.originCity} {route.destinationCity} kaç km</div>
                <div className="text-lg font-bold text-primary">{route.distance}</div>
              </div>
              <div className="bg-background rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">En ucuz bilet</div>
                <div className="text-lg font-bold text-primary">{formatPrice(route.priceRange.min)}</div>
              </div>
              <div className="bg-background rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">Havayolu sayısı</div>
                <div className="text-lg font-bold text-primary">{route.airlines.length}+</div>
              </div>
            </div>
            
            {/* Detailed Flight Info for SEO */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-background rounded-lg p-3">
                <h3 className="font-semibold text-sm mb-2">Kalkış: {route.originCity}</h3>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Ülke</dt>
                    <dd className="font-medium">{route.originCountry}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">IATA Kodu</dt>
                    <dd className="font-medium">{route.originCode}</dd>
                  </div>
                </dl>
              </div>
              <div className="bg-background rounded-lg p-3">
                <h3 className="font-semibold text-sm mb-2">Varış: {route.destinationCity}</h3>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Ülke</dt>
                    <dd className="font-medium">{route.destinationCountry}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">IATA Kodu</dt>
                    <dd className="font-medium">{route.destinationCode}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {/* LLM Optimized Summary */}
            <div className="p-3 bg-background rounded-lg text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>{route.originCity} {route.destinationCity} uçak bileti</strong> fiyatları {formatPrice(route.priceRange.min)} ile {formatPrice(route.priceRange.max)} arasında değişmektedir. 
                <strong> {route.originCity} {route.destinationCity} uçuş süresi</strong> ortalama {route.estimatedDuration} olup, iki şehir arası mesafe yaklaşık {route.distance}'dir.
              </p>
              <p>
                <strong>{route.originCity} {route.destinationCity} kaç saat:</strong> Direkt uçuşlarla {route.estimatedDuration}, aktarmalı uçuşlarda ise 4-8 saat arası sürmektedir. 
                Bu rotada {route.airlines.join(', ')} gibi havayolları hizmet vermektedir.
              </p>
            </div>
          </section>

          {/* Related Routes */}
          {relatedRoutes.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">İlgili Uçuş Rotaları</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {relatedRoutes.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/ucus/${r.slug}`}
                    className="group bg-card rounded-xl border border-border p-4 hover:border-primary/50 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{r.originFlag}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <span className="text-2xl">{r.destinationFlag}</span>
                    </div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {r.originCity} - {r.destinationCity}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {r.estimatedDuration}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-muted border-t border-border py-8 mb-20 md:mb-0">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {currentYear} WooNomad. Tüm hakları saklıdır.</p>
            <p className="mt-2">
              {route.originCity} {route.destinationCity} uçak bileti • Uçuş fiyatları • Online rezervasyon
            </p>
          </div>
        </footer>

        <MobileBottomNav />
      </div>
    </>
  );
}
