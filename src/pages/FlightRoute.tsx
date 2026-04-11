import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Plane, MapPin, Clock, ArrowRight,
  CheckCircle, Users, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PriceAlertButton } from '@/components/PriceAlertButton';
import { AdBanner, AdInArticle } from '@/components/AdSense';
import { TravelpayoutsFlightWidget, TravelpayoutsCalendarWidget } from '@/components/widgets';
import { useSettings } from '@/contexts/SettingsContext';
import { getRouteBySlug, generateFlightRoutes, ROUTE_REDIRECTS } from '@/lib/flightRoutes';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FlightRoute() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Handle old malformed slugs - redirect to correct URL
  useEffect(() => {
    if (slug && ROUTE_REDIRECTS[slug]) {
      navigate(`/ucus/${ROUTE_REDIRECTS[slug]}`, { replace: true });
    }
  }, [slug, navigate]);
  
  const route = slug ? getRouteBySlug(slug) : undefined;
  const { formatPrice } = useSettings();

  if (!route) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Helmet>
          <title>Sayfa Bulunamadı | WooNomad</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Uçuş Rotası Bulunamadı</h1>
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
      url: 'https://woonomad.co',
      logo: 'https://woonomad.co/pwa-512x512.png',
    },
    estimatedFlightDuration: route.estimatedDuration,
    flightDistance: {
      '@type': 'Distance',
      name: route.distance,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'TRY',
      lowPrice: route.priceRange.min,
      highPrice: route.priceRange.max,
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString().split('T')[0],
      seller: {
        '@type': 'Organization',
        name: 'WooNomad'
      }
    }
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
          text: `${route.originCity} - ${route.destinationCity} arası uçakla ${flightHours} sürmektedir.`,
        },
      },
      {
        '@type': 'Question',
        name: `${route.originCity} ${route.destinationCity} uçak bileti ne kadar?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${route.originCity} - ${route.destinationCity} uçak bileti fiyatları ${formatPrice(route.priceRange.min)} ile ${formatPrice(route.priceRange.max)} arasında değişmektedir.`,
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

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-3 md:py-6 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2 sm:mb-3">
              <div className="flex items-center gap-1.5 sm:gap-2 sm:flex-col sm:text-center">
                <span className="text-xl sm:text-3xl">{route.originFlag}</span>
                <div className="sm:text-center">
                  <h2 className="text-xl md:text-2xl font-display font-bold">{route.originCity}</h2>
                  <p className="text-2xs sm:text-xs text-muted-foreground">{route.originCode}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 sm:flex-col sm:px-4">
                <Plane className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                <span className="text-2xs sm:text-xs text-muted-foreground whitespace-nowrap">{route.estimatedDuration}</span>
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2 sm:flex-col sm:text-center">
                <span className="text-xl sm:text-3xl">{route.destinationFlag}</span>
                <div className="sm:text-center">
                  <h2 className="text-xl md:text-2xl font-display font-bold">{route.destinationCity}</h2>
                  <p className="text-2xs sm:text-xs text-muted-foreground">{route.destinationCode}</p>
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold text-center mb-1">
              {route.originCity} - {route.destinationCity} Uçak Bileti
            </h1>
            <p className="text-center text-muted-foreground text-xs sm:text-sm max-w-2xl mx-auto line-clamp-2 sm:line-clamp-none">
              {route.description}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          {/* Quick Info */}
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
            <h2 className="text-xl md:text-2xl font-display font-bold mb-4 flex items-center gap-2">
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
            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-muted-foreground">
                * Tahmini fiyat aralığı: <strong>{formatPrice(route.priceRange.min)}</strong> - <strong>{formatPrice(route.priceRange.max)}</strong>
              </p>
              <PriceAlertButton 
                originCode={route.originCode}
                destinationCode={route.destinationCode}
                currentPrice={route.priceRange.min}
              />
            </div>
          </section>

          {/* Flight Search Widget */}
          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-4 flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              {route.originCity} - {route.destinationCity} Uçuş Ara
            </h2>
            <TravelpayoutsFlightWidget 
              origin={route.originCode}
              destination={route.destinationCode}
              subId={`route-${route.slug}`}
            />
          </section>

          {/* Low Fares Calendar */}
          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Fiyat Takvimi
            </h2>
            <TravelpayoutsCalendarWidget 
              origin={route.originCode}
              destination={route.destinationCode}
              subId={`calendar-${route.slug}`}
            />
          </section>

          {/* Tips Section */}
          <section className="mb-6">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-4">
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
            <h2 className="text-xl md:text-2xl font-display font-bold mb-4">
              {route.originCity} - {route.destinationCity} Sıkça Sorulan Sorular
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="flight-hours">
                <AccordionTrigger>
                  {route.originCity} {route.destinationCity} uçakla kaç saat?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <strong>{route.originCity} - {route.destinationCity} arası uçakla {flightHours} sürmektedir.</strong> Direkt uçuşlarda toplam uçuş süresi {route.estimatedDuration} olup, aktarmalı uçuşlarda bu süre 2-6 saat daha uzayabilir.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="distance">
                <AccordionTrigger>
                  {route.originCity} {route.destinationCity} arası kaç km?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {route.originCity} - {route.destinationCity} arası mesafe yaklaşık <strong>{route.distance}</strong>'dir.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="price">
                <AccordionTrigger>
                  {route.originCity} {route.destinationCity} uçak bileti ne kadar?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {route.originCity} - {route.destinationCity} uçak bileti fiyatları <strong>{formatPrice(route.priceRange.min)}</strong> ile <strong>{formatPrice(route.priceRange.max)}</strong> arasında değişmektedir.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="airlines">
                <AccordionTrigger>
                  {route.originCity}'den {route.destinationCity}'e hangi havayolları uçuyor?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Bu rotada <strong>{route.airlines.join(', ')}</strong> havayolları hizmet vermektedir.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* In-Article Ad */}
          <AdInArticle />

          {/* Technical Info */}
          <section className="mb-8 bg-muted/30 rounded-xl p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-4">
              {route.originCity} - {route.destinationCity} Teknik Bilgiler
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="bg-background rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">Uçuş süresi</div>
                <div className="text-lg font-bold text-primary">{route.estimatedDuration}</div>
              </div>
              <div className="bg-background rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">Mesafe</div>
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
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-3">
                <h3 className="font-semibold text-sm mb-2">Kalkış: {route.originCity}</h3>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Ülke</dt>
                    <dd className="font-medium">{route.originCountry}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">IATA</dt>
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
                    <dt className="text-muted-foreground">IATA</dt>
                    <dd className="font-medium">{route.destinationCode}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          {/* Related Routes */}
          {relatedRoutes.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-display font-bold mb-6">İlgili Uçuş Rotaları</h2>
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
