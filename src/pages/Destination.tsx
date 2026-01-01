import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Plane, MapPin, Clock, Calendar, CheckCircle, XCircle, 
  ChevronRight, ArrowLeft, Star, Globe, Info, AlertCircle,
  Building2, CreditCard, Luggage, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SearchForm, SearchFormRef } from '@/components/SearchForm';
import { FlightCard } from '@/components/FlightCard';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { useFavorites } from '@/hooks/useFavorites';
import { getDestinationBySlug, getPopularDestinations, SEODestination } from '@/lib/seoDestinations';
import { generateFlightRoutes, FlightRoute } from '@/lib/flightRoutes';
import { SearchParams, Airport } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Destination() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const searchFormRef = useRef<SearchFormRef>(null);
  const destination = slug ? getDestinationBySlug(slug) : undefined;
  const { flights, isLoading, searchFlights } = useFlightSearch();
  const { isFavorite, toggleFavorite } = useFavorites();
  const popularDestinations = getPopularDestinations(6);
  
  // Get related routes to this destination
  const relatedRoutes = useMemo(() => {
    if (!destination) return [];
    const allRoutes = generateFlightRoutes();
    return allRoutes.filter(
      r => r.destinationCode === destination.airportCode || r.originCode === destination.airportCode
    ).slice(0, 8);
  }, [destination]);

  // Auto-search on page load
  useEffect(() => {
    if (destination && searchFormRef.current) {
      const destAirport: Airport = {
        code: destination.airportCode,
        name: destination.city,
        city: destination.city,
        country: destination.country,
      };
      
      // Set destination in search form
      searchFormRef.current.setAirports(
        { code: 'IST', name: 'İstanbul Havalimanı', city: 'İstanbul', country: 'Türkiye' },
        destAirport
      );
    }
  }, [destination]);

  const handleSearch = (params: SearchParams) => {
    searchFlights(params);
  };

  if (!destination) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Helmet>
          <title>Sayfa Bulunamadı | WooNomad</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <h1 className="text-2xl font-bold mb-4">Destinasyon Bulunamadı</h1>
        <p className="text-muted-foreground mb-6">Aradığınız destinasyon sayfası mevcut değil.</p>
        <Button asChild>
          <Link to="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
    );
  }

  const BASE_URL = 'https://woonomad.co';
  const currentYear = new Date().getFullYear();

  // SEO optimized title and description
  const pageTitle = `En Ucuz ${destination.city} Bileti Fiyatları ${currentYear} - WooNomad`;
  const pageDescription = `${destination.city} bileti arıyorsanız en doğru adrestesiniz! Tüm hava yollarını karşılaştırın, en uygun ${destination.city} uçak bileti fırsatlarını yakalayın. Hızlı ve güvenli rezervasyon için tıkla.`;

  // Generate structured data for SEO - TouristDestination
  const touristDestinationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.city,
    description: destination.description,
    image: destination.imageUrl,
    url: `${BASE_URL}/ucak-bileti/${destination.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: destination.countryCode,
      addressLocality: destination.city,
    },
    touristType: ['Weekend travelers', 'Budget travelers', 'Adventure seekers'],
    containsPlace: destination.highlights.map(h => ({
      '@type': 'TouristAttraction',
      name: h.name,
      description: h.description,
    })),
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Destinasyonlar', item: `${BASE_URL}/destinasyonlar` },
      { '@type': 'ListItem', position: 3, name: `${destination.city} Uçak Bileti`, item: `${BASE_URL}/ucak-bileti/${destination.slug}` },
    ],
  };

  // Enhanced FAQPage Schema - genel sorular (rotaya özel değil)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `${destination.city}'e nasıl uçak bileti alabilirim?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${destination.city} uçak bileti için WooNomad ile tüm havayollarının fiyatlarını karşılaştırabilirsiniz. İstanbul, Ankara, İzmir gibi şehirlerden ${destination.city}'e uçuş seçenekleri mevcuttur. Detaylı uçuş süresi ve fiyat bilgisi için ilgili rota sayfalarını inceleyebilirsiniz.`,
        },
      },
      {
        '@type': 'Question',
        name: `${destination.city} için vize gerekli mi?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: destination.visaRequired 
            ? `Evet, Türk vatandaşları için ${destination.city} (${destination.country}) seyahatinde vize gereklidir. Vize başvurusu için konsolosluğa başvurmanız gerekmektedir.`
            : `Hayır, Türk vatandaşları ${destination.city} (${destination.country}) için vizesiz giriş yapabilir. Pasaportunuzun en az 6 ay geçerli olması gerekmektedir.`,
        },
      },
      {
        '@type': 'Question',
        name: `${destination.city} seyahati için en iyi zaman ne zaman?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${destination.city} ziyareti için en uygun dönem ${destination.bestTimeToVisit} aylarıdır. Bu dönemde hava koşulları en ideal seviyededir ve uçak biletleri genellikle daha uygun fiyatlıdır.`,
        },
      },
      {
        '@type': 'Question',
        name: `${destination.city} uçak bileti ne kadar?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${destination.city} uçak bileti fiyatları sezon, havayolu ve rezervasyon zamanına göre değişiklik gösterir. En ucuz ${destination.city} bileti için erken rezervasyon yapmanızı ve hafta içi günleri tercih etmenizi öneririz.`,
        },
      },
      {
        '@type': 'Question',
        name: `${destination.city} havalimanı kodu nedir?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${destination.city} havalimanı kodu ${destination.airportCode}'dir. Havalimanı şehir merkezine yakın konumdadır ve toplu taşıma ile kolayca ulaşılabilir.`,
        },
      },
      {
        '@type': 'Question',
        name: `${destination.city}'e ne zaman daha ucuza uçulur?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${destination.city}'e en ucuz uçak bileti genellikle yoğun olmayan sezonlarda bulunur. Hafta içi uçuşları, erken rezervasyon (2-3 ay öncesi) ve esnek tarih araması yaparak %30-40 tasarruf sağlayabilirsiniz.`,
        },
      },
    ],
  };

  // WebPage Schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    description: pageDescription,
    url: `${BASE_URL}/ucak-bileti/${destination.slug}`,
    inLanguage: 'tr-TR',
    isPartOf: {
      '@type': 'WebSite',
      name: 'WooNomad',
      url: BASE_URL,
    },
    about: {
      '@type': 'Place',
      name: destination.city,
      address: {
        '@type': 'PostalAddress',
        addressCountry: destination.countryCode,
      },
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: destination.imageUrl,
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.seo-content p']
    }
  };

  // Product Schema for flight tickets
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${destination.city} Uçak Bileti`,
    description: `İstanbul'dan ${destination.city}'e uçak bileti. ${destination.country} uçuşu için en uygun fiyatlar.`,
    brand: {
      '@type': 'Brand',
      name: 'WooNomad'
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'TRY',
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/ucak-bileti/${destination.slug}`
    }
  };

  // Get continent name in Turkish
  const getContinentName = (continent: string) => {
    const continentMap: Record<string, string> = {
      'europe': 'Avrupa',
      'asia': 'Asya',
      'americas': 'Amerika',
      'africa': 'Afrika',
      'oceania': 'Okyanusya'
    };
    return continentMap[continent] || continent;
  };

  // LSI Keywords for content
  const lsiKeywords = [
    `${destination.country} uçuşu`,
    'havalimanı transferi',
    'gidiş-dönüş bilet',
    'direkt uçuş',
    'aktarmalı sefer',
    'ekonomik bilet',
    'business class',
    'online rezervasyon'
  ];

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={[...destination.keywords, ...lsiKeywords].join(', ')} />
        <link rel="canonical" href={`${BASE_URL}/ucak-bileti/${destination.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={destination.imageUrl} />
        <meta property="og:image:alt" content={`${destination.city} şehir manzarası - ${destination.country} uçak bileti`} />
        <meta property="og:url" content={`${BASE_URL}/ucak-bileti/${destination.slug}`} />
        <meta property="og:site_name" content="WooNomad" />
        <meta property="og:locale" content="tr_TR" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={destination.imageUrl} />
        <meta name="twitter:image:alt" content={`${destination.city} uçak bileti fiyatları`} />
        
        {/* Structured Data - JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(touristDestinationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Breadcrumb items={[
            { label: 'Destinasyonlar', href: '/destinasyonlar' },
            { label: `${destination.city} Uçak Bileti` },
          ]} />
        </div>

        {/* Hero Section */}
        <section className="relative h-64 md:h-80 overflow-hidden">
          <img 
            src={destination.imageUrl} 
            alt={`${destination.city} şehir manzarası - ${destination.country} uçak bileti için en uygun fiyatlar`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl" role="img" aria-label={`${destination.country} bayrağı`}>{destination.flag}</span>
                <Badge variant={destination.visaRequired ? 'destructive' : 'default'} className="gap-1">
                  {destination.visaRequired ? (
                    <><XCircle className="h-3 w-3" aria-hidden="true" /> Vize Gerekli</>
                  ) : (
                    <><CheckCircle className="h-3 w-3" aria-hidden="true" /> Vizesiz</>
                  )}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
                {destination.city} Uçak Bileti
              </h1>
              <p className="text-lg text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span>{destination.country} • {getContinentName(destination.continent)}</span>
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                {destination.visaRequired ? (
                  <XCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-primary" aria-hidden="true" />
                )}
                <div>
                  <div className="text-sm text-muted-foreground">Vize Durumu</div>
                  <div className="font-semibold">{destination.visaRequired ? 'Vize Gerekli' : 'Vizesiz'}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="h-8 w-8 text-primary" aria-hidden="true" />
                <div>
                  <div className="text-sm text-muted-foreground">En İyi Zaman</div>
                  <div className="font-semibold text-sm">{destination.bestTimeToVisit}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Building2 className="h-8 w-8 text-primary" aria-hidden="true" />
                <div>
                  <div className="text-sm text-muted-foreground">Havalimanı</div>
                  <div className="font-semibold">{destination.airportCode}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Globe className="h-8 w-8 text-primary" aria-hidden="true" />
                <div>
                  <div className="text-sm text-muted-foreground">Kıta</div>
                  <div className="font-semibold">{getContinentName(destination.continent)}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Routes to this Destination */}
          {relatedRoutes.length > 0 && (
            <section className="mb-8" aria-labelledby="routes-section">
              <h2 id="routes-section" className="text-xl font-bold mb-4 flex items-center gap-2">
                <Plane className="h-5 w-5 text-primary" aria-hidden="true" />
                {destination.city} Uçuş Rotaları
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {relatedRoutes.map((route) => (
                  <Link
                    key={route.slug}
                    to={`/ucus/${route.slug}`}
                    className="group bg-card rounded-lg border border-border p-4 hover:border-primary/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span>{route.originFlag}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span>{route.destinationFlag}</span>
                    </div>
                    <div className="font-medium text-sm group-hover:text-primary transition-colors">
                      {route.originCity} - {route.destinationCity}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {route.estimatedDuration}
                    </div>
                  </Link>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Uçuş süresi ve mesafe bilgileri için yukarıdaki rota sayfalarını ziyaret edin.
              </p>
            </section>
          )}

          {/* Search Form */}
          <section className="mb-8 bg-card rounded-xl border border-border p-6" aria-labelledby="search-section">
            <h2 id="search-section" className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" aria-hidden="true" />
              {destination.city} Uçuşu Ara
            </h2>
            <SearchForm
              ref={searchFormRef}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          </section>

          {/* Flight Results */}
          {flights.length > 0 && (
            <section className="mb-8" aria-labelledby="flights-section">
              <h2 id="flights-section" className="text-xl font-bold mb-4">
                {destination.city} Uçuşları ({flights.length} sonuç)
              </h2>
              <div className="space-y-3">
                {flights.slice(0, 5).map((flight, index) => (
                  <FlightCard
                    key={`${flight.flight_number}-${flight.departure_at}`}
                    flight={flight}
                    isFavorite={isFavorite(flight)}
                    onToggleFavorite={() => toggleFavorite(flight)}
                    rank={index === 0 ? 'cheapest' : null}
                  />
                ))}
              </div>
            </section>
          )}

          {/* SEO Content Section - H2: Dikkat Edilmesi Gerekenler */}
          <section className="mb-12 seo-content" aria-labelledby="tips-section">
            <h2 id="tips-section" className="text-2xl font-bold mb-6">
              {destination.city} Bileti Alırken Dikkat Edilmesi Gerekenler
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <CreditCard className="h-6 w-6 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold mb-2">Erken Rezervasyon Avantajı</h3>
                      <p className="text-muted-foreground">
                        {destination.city} uçak bileti fiyatlarından en iyi şekilde yararlanmak için 
                        seyahatinizden en az 2-3 ay önce rezervasyon yapmanızı öneririz. Erken 
                        rezervasyon ile %30-40 oranında tasarruf sağlayabilirsiniz.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Calendar className="h-6 w-6 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold mb-2">Esnek Tarih Seçimi</h3>
                      <p className="text-muted-foreground">
                        Hafta içi günleri (Salı, Çarşamba) genellikle daha ucuz bilet bulabilirsiniz. 
                        {destination.country} uçuşu için esnek tarih araması yaparak farklı günlerdeki 
                        fiyat farklarını karşılaştırın.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Luggage className="h-6 w-6 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold mb-2">Bagaj Hakları</h3>
                      <p className="text-muted-foreground">
                        {destination.city} gidiş-dönüş bilet alırken bagaj haklarını kontrol edin. 
                        Ekonomik biletlerde genellikle 20-23 kg check-in bagajı ve 8 kg kabin bagajı 
                        dahildir. Business class tercihinde bu limitler artar.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Info className="h-6 w-6 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold mb-2">Online Rezervasyon</h3>
                      <p className="text-muted-foreground">
                        WooNomad üzerinden {destination.city} ucuz uçak bileti araması yaparak 
                        tüm havayollarının fiyatlarını tek seferde karşılaştırabilirsiniz. 
                        Hızlı ve güvenli online rezervasyon sistemiyle anında biletinizi alın.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* SEO Content Section - H2: Uygun Uçuş Seferleri */}
          <section className="mb-12 seo-content" aria-labelledby="flights-info-section">
            <h2 id="flights-info-section" className="text-2xl font-bold mb-6">
              {destination.city}'e En Uygun Uçuş Seferleri ve Hava Yolları
            </h2>
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-muted-foreground leading-relaxed">
                İstanbul'dan {destination.city}'e birçok havayolu ile direkt uçuş ve aktarmalı sefer 
                bulunmaktadır. Türk Hava Yolları başta olmak üzere, çeşitli Avrupa ve uluslararası 
                havayolları bu rotada hizmet vermektedir. {destination.country} uçuşu için en popüler 
                tercihler arasında sabah erken saatlerdeki ve akşam geç saatlerdeki seferler yer almaktadır.
              </p>
            </div>

            {/* H3: Havalimanı Ulaşım İpuçları */}
            <div className="bg-muted/50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">
                {destination.airportCode} Havalimanı Ulaşım İpuçları
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span>
                    <strong>{destination.city} havalimanı</strong> ({destination.airportCode}) şehir merkezine 
                    genellikle metro, otobüs veya taksi ile 30-60 dakika mesafededir.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span>
                    Havalimanı transferi için toplu taşıma en ekonomik seçenektir. 
                    Taksi veya özel transfer hizmetleri daha konforlu ancak pahalıdır.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span>
                    Uçuşunuzdan en az 2-3 saat önce havalimanında olmanızı öneririz, 
                    özellikle yoğun sezonlarda güvenlik kontrolleri uzun sürebilir.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Fiyat Bilgisi Bölümü */}
          <section className="mb-12 seo-content" aria-labelledby="price-section">
            <h2 id="price-section" className="text-2xl font-bold mb-6">
              {destination.city}'e Ne Zaman Daha Ucuza Uçulur?
            </h2>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                {destination.city} uçak bileti fiyatları sezona, havayoluna ve rezervasyon zamanına 
                göre önemli ölçüde değişiklik gösterir. En uygun fiyatlı {destination.city} bileti 
                bulmak için şu stratejileri uygulayabilirsiniz:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Düşük sezon:</strong> Ocak-Şubat ve Kasım aylarında fiyatlar genellikle daha uygun</li>
                <li>• <strong>Hafta içi uçuşlar:</strong> Salı ve Çarşamba günleri en ucuz günlerdir</li>
                <li>• <strong>Erken rezervasyon:</strong> 6-8 hafta önceden alınan biletler %20-30 daha uygun</li>
                <li>• <strong>Son dakika:</strong> Doluluk düşükse son dakika fırsatları da olabilir</li>
              </ul>
            </div>
          </section>

          {/* Uçuş Süresi Bilgisi */}
          <section className="mb-12 seo-content" aria-labelledby="duration-section">
            <h2 id="duration-section" className="text-2xl font-bold mb-6">
              İstanbul - {destination.city} Arası Kaç Saat?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Clock className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
                    <div className="text-3xl font-bold text-primary mb-2">{destination.averageFlightDuration}</div>
                    <p className="text-muted-foreground">Ortalama Uçuş Süresi</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Uçuş Detayları</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• <strong>Direkt uçuş:</strong> {destination.averageFlightDuration}</li>
                    <li>• <strong>Aktarmalı sefer:</strong> +2-4 saat (aktarma noktasına göre değişir)</li>
                    <li>• <strong>Kalkış:</strong> İstanbul Havalimanı (IST) veya Sabiha Gökçen (SAW)</li>
                    <li>• <strong>Varış:</strong> {destination.city} ({destination.airportCode})</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Görülecek Yerler */}
          <section className="mb-12" aria-labelledby="highlights-section">
            <h2 id="highlights-section" className="text-2xl font-bold mb-6">{destination.city}'de Gezilecek Yerler</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {destination.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {destination.highlights.map((highlight, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-1">{highlight.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{highlight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* SSS Bölümü */}
          <section className="mb-12" aria-labelledby="faq-section">
            <h2 id="faq-section" className="text-2xl font-bold mb-6">
              {destination.city} Uçak Bileti Sıkça Sorulan Sorular
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  İstanbul'dan {destination.city} uçuş süresi ne kadar?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  İstanbul'dan {destination.city} uçuş süresi ortalama {destination.averageFlightDuration}'dir. 
                  Direkt uçuşlar genellikle daha kısa sürerken, aktarmalı seferler 2-4 saat daha uzun sürebilir. 
                  Uçuş süreniz hava koşullarına ve rota yoğunluğuna göre değişiklik gösterebilir.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  {destination.city} için vize gerekli mi?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {destination.visaRequired 
                    ? `Evet, Türk vatandaşları için ${destination.city} (${destination.country}) seyahatinde vize gereklidir. Vize başvurusu için ilgili ülkenin konsolosluğuna başvurmanız gerekmektedir. Başvuru sürecini seyahatinizden en az 1 ay önce başlatmanızı öneririz.`
                    : `Hayır, Türk vatandaşları ${destination.city} (${destination.country}) için vizesiz giriş yapabilir. Pasaportunuzun seyahat tarihinizden itibaren en az 6 ay geçerli olması gerekmektedir. Vizesiz kalış süresi genellikle 90 gündür.`
                  }
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  {destination.city} uçak bileti ne kadar?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {destination.city} uçak bileti fiyatları sezon, havayolu ve rezervasyon zamanına göre 
                  değişiklik gösterir. En ucuz {destination.city} bileti için erken rezervasyon yapmanızı 
                  ve hafta içi günleri tercih etmenizi öneririz. WooNomad üzerinden tüm havayollarını 
                  karşılaştırarak en uygun fiyatı bulabilirsiniz.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  {destination.city}'e ne zaman gidilir?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {destination.city} ziyareti için en uygun dönem {destination.bestTimeToVisit} aylarıdır. 
                  Bu dönemde hava koşulları idealdir ve turistik mekanlarda aşırı kalabalık olmaz. 
                  Ayrıca bu dönemlerde uçak bileti fiyatları da genellikle daha uygun seviyelerdedir.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  {destination.city} havalimanından şehir merkezine nasıl gidilir?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {destination.city} havalimanından ({destination.airportCode}) şehir merkezine ulaşım için 
                  metro, otobüs, taksi veya özel transfer hizmetlerini kullanabilirsiniz. En ekonomik 
                  seçenek toplu taşımadır. Taksi veya özel transfer daha konforlu ancak daha pahalıdır. 
                  Yolculuk süresi genellikle 30-60 dakika arasındadır.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">
                  {destination.city}'e en ucuz uçan havayolu hangisi?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {destination.city}'e en ucuz uçan havayolu sezona ve tarih esnekliğinize göre değişir. 
                  Low-cost havayolları genellikle daha uygun fiyatlar sunar ancak bagaj ve ikram dahil 
                  değildir. WooNomad ile tüm havayollarının fiyatlarını karşılaştırarak en uygun seçeneği 
                  bulabilirsiniz.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* LLM Uyumlu İçerik - Yapılandırılmış Bilgi */}
          <section className="mb-12 seo-content bg-muted/30 rounded-xl p-6" aria-labelledby="llm-section">
            <h2 id="llm-section" className="text-2xl font-bold mb-6">
              {destination.city} Hakkında Temel Bilgiler
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Genel Bilgiler</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Şehir</dt>
                    <dd className="font-medium">{destination.city}</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Ülke</dt>
                    <dd className="font-medium">{destination.country}</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Kıta</dt>
                    <dd className="font-medium">{getContinentName(destination.continent)}</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Havalimanı Kodu</dt>
                    <dd className="font-medium">{destination.airportCode}</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Vize Durumu</dt>
                    <dd className="font-medium">{destination.visaRequired ? 'Vize Gerekli' : 'Vizesiz'}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Uçuş Bilgileri</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Kalkış</dt>
                    <dd className="font-medium">İstanbul (IST/SAW)</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Varış</dt>
                    <dd className="font-medium">{destination.city} ({destination.airportCode})</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Uçuş Süresi</dt>
                    <dd className="font-medium">{destination.averageFlightDuration}</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">En İyi Sezon</dt>
                    <dd className="font-medium">{destination.bestTimeToVisit}</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Sefer Tipi</dt>
                    <dd className="font-medium">Direkt & Aktarmalı</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {/* Özet Paragraf - LLM için */}
            <div className="mt-8 p-4 bg-background rounded-lg">
              <p className="text-muted-foreground leading-relaxed">
                <strong>{destination.city} uçak bileti</strong> arayanlar için özet: {destination.city} ({destination.country}), 
                {getContinentName(destination.continent)} kıtasında yer almaktadır. 
                {destination.visaRequired 
                  ? ` Türk vatandaşları için vize gereklidir.` 
                  : ` Türk vatandaşları vizesiz giriş yapabilir.`
                } {destination.city} havalimanı kodu {destination.airportCode}'dir. 
                En uygun seyahat zamanı {destination.bestTimeToVisit} dönemleridir. 
                En ucuz {destination.city} bileti için erken rezervasyon ve hafta içi uçuşlar önerilir.
                Uçuş süresi ve mesafe bilgileri için yukarıdaki uçuş rotası sayfalarını inceleyebilirsiniz.
              </p>
            </div>
          </section>

          {/* Popular Destinations */}
          <section className="mt-12" aria-labelledby="popular-destinations">
            <h2 id="popular-destinations" className="text-2xl font-bold mb-6">Diğer Popüler Destinasyonlar</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularDestinations
                .filter(d => d.slug !== destination.slug)
                .slice(0, 6)
                .map((dest) => (
                  <Link
                    key={dest.slug}
                    to={`/ucak-bileti/${dest.slug}`}
                    className="group relative rounded-xl overflow-hidden aspect-square"
                    aria-label={`${dest.city} uçak bileti`}
                  >
                    <img 
                      src={dest.imageUrl} 
                      alt={`${dest.city} şehir manzarası - ${dest.country} ucuz uçak bileti`}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <div className="text-lg font-semibold">{dest.flag} {dest.city}</div>
                      <div className="text-xs opacity-80">{dest.country}</div>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-muted border-t border-border py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {currentYear} WooNomad. Tüm hakları saklıdır.</p>
            <p className="mt-2">
              {destination.city} uçak bileti • {destination.country} uçuşu • Gidiş-dönüş bilet • 
              Hafta sonu tatili • Online rezervasyon
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
