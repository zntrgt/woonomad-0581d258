import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { 
  Plane, 
  Hotel, 
  MapPin, 
  Clock, 
  Globe, 
  Users, 
  Banknote, 
  Languages, 
  Calendar as CalendarIcon,
  Star,
  ChevronRight,
  ArrowRight,
  Laptop,
  Wifi,
  Shield,
  Sun,
  Building2,
  Coffee,
  Search,
  AlertTriangle,
  Compass,
  ExternalLink
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TripPlanner } from '@/components/TripPlanner';
import { EventCountdownList } from '@/components/EventCountdown';
import { WeatherWidget, TravelTips } from '@/components/WeatherWidget';
import { CityHotelsWidget } from '@/components/CityHotelsWidget';
import { getCityBySlug, getAllCities, CityInfo } from '@/lib/cities';
import { generateFlightRoutes } from '@/lib/flightRoutes';
import { getCountryFlag } from '@/lib/destinations';
import { nomadMetrics, coworkingSpaces } from '@/lib/nomad';
import { useCityDisplay } from '@/hooks/useCityDisplay';
import { KlookActivitiesWidget } from '@/components/KlookActivitiesWidget';
import { EsimWidget } from '@/components/EsimWidget';
import { getAgodaUrl, getCityEnglishName } from '@/lib/agodaMapping';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Helper to check if city has sufficient data
const hasSufficientData = (city: CityInfo): boolean => {
  const hasBasicInfo = Boolean(city.description && city.description.length > 50);
  const hasHighlights = Boolean(city.highlights && city.highlights.length >= 3);
  const hasVisitInfo = Boolean(city.bestTimeToVisit && city.currency && city.language);
  return hasBasicInfo && hasHighlights && hasVisitInfo;
};

// Get similar cities based on country or region
const getSimilarCities = (currentCity: CityInfo, allCities: CityInfo[]): CityInfo[] => {
  // First, get cities from same country
  const sameCountry = allCities.filter(c => 
    c.slug !== currentCity.slug && c.country === currentCity.country
  );
  
  // Then add nearby region cities if needed
  const europeCountries = ['Almanya', 'Fransa', 'İtalya', 'İspanya', 'Hollanda', 'Portekiz', 'İngiltere', 'Avusturya', 'Belçika', 'Çekya', 'Macaristan', 'Polonya', 'İsviçre'];
  const asiaCountries = ['Japonya', 'Singapur', 'Tayland', 'Endonezya', 'Güney Kore', 'Tayvan', 'Vietnam', 'Malezya'];
  
  let regionCities: CityInfo[] = [];
  if (europeCountries.includes(currentCity.country)) {
    regionCities = allCities.filter(c => 
      c.slug !== currentCity.slug && 
      europeCountries.includes(c.country) && 
      c.country !== currentCity.country
    );
  } else if (asiaCountries.includes(currentCity.country)) {
    regionCities = allCities.filter(c => 
      c.slug !== currentCity.slug && 
      asiaCountries.includes(c.country) && 
      c.country !== currentCity.country
    );
  }
  
  // Combine and limit to 6
  return [...sameCountry, ...regionCities].slice(0, 6);
};

// Generate neighborhoods based on city
const getNeighborhoods = (citySlug: string): { name: string; description: string }[] => {
  const neighborhoodData: Record<string, { name: string; description: string }[]> = {
    'berlin': [
      { name: 'Kreuzberg', description: 'Alternatif kültür, gece hayatı ve çok kültürlü mutfak' },
      { name: 'Mitte', description: 'Müzeler, tarihi yerler ve lüks alışveriş' },
      { name: 'Prenzlauer Berg', description: 'Butik kafeler, parklar ve aile dostu atmosfer' },
      { name: 'Friedrichshain', description: 'Sanat galerileri, kulüpler ve genç enerji' },
      { name: 'Charlottenburg', description: 'Klasik mimari, saray ve sofistike ortam' },
    ],
    'paris': [
      { name: 'Le Marais', description: 'Tarihi sokaklar, galeriler ve trendy butikler' },
      { name: 'Saint-Germain-des-Prés', description: 'Entelektüel atmosfer, kafeler ve kitapçılar' },
      { name: 'Montmartre', description: 'Sanatçı mahallesi, panoramik manzara ve boemvari hava' },
      { name: 'Latin Quarter', description: 'Üniversiteler, canli sokaklar ve tarihi mekanlar' },
      { name: 'Belleville', description: 'Kozmopolit mahalle, sanat ve uygun fiyatlı mekanlar' },
    ],
    'londra': [
      { name: 'Shoreditch', description: 'Street art, teknoloji startup\'ları ve hipster kültürü' },
      { name: 'Soho', description: 'Tiyatrolar, barlar ve canlı gece hayatı' },
      { name: 'Camden', description: 'Alternatif pazar, canlı müzik ve eklektik atmosfer' },
      { name: 'Notting Hill', description: 'Renkli evler, antika pazarı ve şık kafeler' },
      { name: 'South Bank', description: 'Kültür merkezi, Thames manzarası ve modern sanat' },
    ],
    'barcelona': [
      { name: 'El Born', description: 'Ortaçağ sokakları, butikler ve trendy restoranlar' },
      { name: 'Gràcia', description: 'Bohem atmosfer, meydanlar ve yerel yaşam' },
      { name: 'Eixample', description: 'Modernist mimari, alışveriş ve geniş bulvarlar' },
      { name: 'Barceloneta', description: 'Plaj yaşamı, deniz ürünleri ve yaz enerjisi' },
      { name: 'Raval', description: 'Çok kültürlü, sanat merkezleri ve alternatif mekanlar' },
    ],
    'amsterdam': [
      { name: 'Jordaan', description: 'Pitoresk kanallar, galeriler ve butik dükkanlar' },
      { name: 'De Pijp', description: 'Albert Cuyp pazarı, çok kültürlü mutfak ve kafeler' },
      { name: 'Centrum', description: 'Tarihi merkez, müzeler ve ana turistik noktalar' },
      { name: 'Oud-West', description: 'Yerel parklar, trendy restoranlar ve sakin atmosfer' },
      { name: 'Noord', description: 'Endüstriyel dönüşüm, sanat merkezleri ve modern yaşam' },
    ],
    'lizbon': [
      { name: 'Alfama', description: 'Eski şehir, fado müziği ve dar sokaklar' },
      { name: 'Bairro Alto', description: 'Gece hayatı, barlar ve bohem atmosfer' },
      { name: 'Chiado', description: 'Kültürel merkez, tiyatrolar ve şık kafeler' },
      { name: 'Belém', description: 'Tarihi anıtlar, pastéis de Belém ve müzeler' },
      { name: 'LX Factory', description: 'Yaratıcı hub, sanat ve endüstriyel tasarım' },
    ],
    'tokyo': [
      { name: 'Shibuya', description: 'Gençlik kültürü, alışveriş ve ikonik kavşak' },
      { name: 'Shinjuku', description: 'Gökdelenler, gece hayatı ve ulaşım merkezi' },
      { name: 'Harajuku', description: 'Moda sokağı, pop kültür ve benzersiz stil' },
      { name: 'Asakusa', description: 'Geleneksel tapınaklar, tarihi atmosfer' },
      { name: 'Nakameguro', description: 'Kanal kenarı, trendy kafeler ve butikler' },
    ],
    'bali': [
      { name: 'Canggu', description: 'Sörf, dijital göçebeler ve plaj kulüpleri' },
      { name: 'Ubud', description: 'Sanat, yoga ve pirinç terasları' },
      { name: 'Seminyak', description: 'Lüks oteller, plaj barları ve alışveriş' },
      { name: 'Uluwatu', description: 'Uçurum tapınakları ve sörf noktaları' },
      { name: 'Sanur', description: 'Sakin plajlar, aile dostu ve geleneksel' },
    ],
    'bangkok': [
      { name: 'Sukhumvit', description: 'Expat merkezi, alışveriş ve gece hayatı' },
      { name: 'Silom', description: 'İş merkezi, gece pazarları ve çeşitlilik' },
      { name: 'Khao San', description: 'Backpacker cenneti, barlar ve sokak yemekleri' },
      { name: 'Thonglor', description: 'Trendy kafeler, gece kulüpleri ve modern yaşam' },
      { name: 'Rattanakosin', description: 'Tarihi merkez, tapınaklar ve saraylar' },
    ],
  };
  
  return neighborhoodData[citySlug] || [
    { name: 'Şehir Merkezi', description: 'Ana turistik noktalar ve kolay ulaşım' },
    { name: 'Tarihi Bölge', description: 'Kültürel miras ve yerel atmosfer' },
    { name: 'Modern Bölge', description: 'Alışveriş merkezleri ve iş alanları' },
  ];
};

const City = () => {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? getCityBySlug(slug) : null;
  const { displayName, displayCountry } = useCityDisplay(city);
  const allCities = getAllCities();
  const allFlightRoutes = generateFlightRoutes();
  const currentYear = new Date().getFullYear();
  
  // Date states for neighborhood hotel search
  const today = new Date();
  const [checkInDate, setCheckInDate] = useState<Date>(addDays(today, 7));
  const [checkOutDate, setCheckOutDate] = useState<Date>(addDays(today, 9));
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  
  // Format dates for Agoda URL
  const checkIn = format(checkInDate, 'yyyy-MM-dd');
  const checkOut = format(checkOutDate, 'yyyy-MM-dd');
  
  const updateGuests = (type: 'adults' | 'children' | 'rooms', delta: number) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(type === 'adults' ? 1 : type === 'rooms' ? 1 : 0, prev[type] + delta)
    }));
  };
  
  const guestSummary = `${guests.adults} Yetişkin${guests.children > 0 ? `, ${guests.children} Çocuk` : ''}, ${guests.rooms} Oda`;
  
  if (!city) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Şehir Bulunamadı</h1>
          <p className="text-muted-foreground mb-4">Aradığınız şehir mevcut değil veya henüz eklenmemiş.</p>
          <Button asChild>
            <Link to="/sehirler">Tüm Şehirlere Gözat</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Get related data
  const relatedRoutes = allFlightRoutes.filter(route => 
    city.airportCodes.includes(route.originCode) || 
    city.airportCodes.includes(route.destinationCode)
  ).slice(0, 8);

  const similarCities = getSimilarCities(city, allCities);
  const neighborhoods = getNeighborhoods(city.slug);
  const cityNomadData = nomadMetrics[city.slug];
  const cityCoworkings = coworkingSpaces.filter(c => c.citySlug === city.slug);
  const hasSufficient = hasSufficientData(city);
  const flag = getCountryFlag(city.countryCode);

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Şehirler', href: '/sehirler' },
    { label: displayName }
  ];

  // SEO: Dynamic title and description - use localized names
  const seoTitle = `${displayName} Seyahat Rehberi ${currentYear} | Uçuş, Otel, Coworking, Nomad`;
  
  // Build meta description with actual data (150-160 chars)
  const metaDescParts = [`${displayName} seyahat rehberi.`];
  if (cityNomadData) {
    metaDescParts.push(`İnternet: ${cityNomadData.internetSpeed}, Aylık maliyet: ${cityNomadData.costOfLiving}.`);
  }
  metaDescParts.push(`${displayCountry}'da gezilecek yerler, otel ve uçuş fırsatları.`);
  const metaDescription = metaDescParts.join(' ').slice(0, 160);

  const canonicalUrl = `https://woonomad.co/sehir/${city.slug}`;

  // Schema.org: WebPage
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    "url": canonicalUrl,
    "name": seoTitle,
    "description": metaDescription,
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://woonomad.co/#website",
      "url": "https://woonomad.co",
      "name": "WooNomad"
    },
    "about": {
      "@type": "City",
      "name": city.name
    },
    "inLanguage": "tr-TR"
  };

  // Schema.org: BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Sayfa",
        "item": "https://woonomad.co"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Şehirler",
        "item": "https://woonomad.co/sehirler"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": city.name,
        "item": canonicalUrl
      }
    ]
  };

  // Schema.org: City/Place
  const citySchema = {
    "@context": "https://schema.org",
    "@type": "City",
    "@id": `${canonicalUrl}#city`,
    "name": city.name,
    "alternateName": city.nameEn,
    "description": city.description,
    "image": city.image,
    "containedInPlace": {
      "@type": "Country",
      "name": city.country
    },
    "geo": {
      "@type": "GeoCoordinates"
    },
    "touristType": ["Digital Nomad", "Solo Traveler", "Business Traveler", "Couples"]
  };

  // Schema.org: ItemList for sub-pages
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${city.name} Seyahat Rehberi`,
    "description": `${city.name} için uçuş, otel, coworking ve dijital göçebe bilgileri`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": `${city.name} Uçuşları`,
        "url": `https://woonomad.co/sehir/${city.slug}/ucuslar`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `${city.name} Otelleri`,
        "url": `https://woonomad.co/sehir/${city.slug}/oteller`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${city.name} Coworking Alanları`,
        "url": `https://woonomad.co/sehir/${city.slug}/coworking`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": `${city.name} Dijital Göçebe Rehberi`,
        "url": `https://woonomad.co/sehir/${city.slug}/nomad`
      }
    ]
  };

  // Combined schema
  const combinedSchema = [webPageSchema, breadcrumbSchema, citySchema, itemListSchema];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${city.name}, ${city.name} seyahat, ${city.name} uçak bileti, ${city.name} otel, ${city.name} coworking, ${city.name} dijital göçebe, ${city.country} gezi`} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Thin content guardrail */}
        {!hasSufficient && <meta name="robots" content="noindex, follow" />}
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={city.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="tr_TR" />
        <meta property="og:site_name" content="WooNomad" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={city.image} />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(combinedSchema)}</script>
      </Helmet>

      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[35vh] min-h-[280px] overflow-hidden">
        <img 
          src={city.image} 
          alt={`${city.name}, ${city.country} şehir manzarası - seyahat rehberi`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="container">
            <Breadcrumb items={breadcrumbItems} />
            <div className="mt-3 flex items-center gap-3">
              <span className="text-4xl md:text-5xl">{flag}</span>
              <div>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground">
                  {city.name} Seyahat Rehberi ({currentYear})
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  {city.country} • {city.population} • {city.timezone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thin Content Warning */}
      {!hasSufficient && (
        <section className="py-4 bg-warning/10 border-b border-warning/20">
          <div className="container">
            <div className="flex items-center gap-3 text-warning">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">
                <strong>{city.name}</strong> için detaylı bilgiler yakında eklenecek. 
                Şimdilik <Link to="/sehirler" className="underline hover:text-warning/80">diğer popüler şehirleri</Link> keşfedebilirsiniz.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="py-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-40">
        <div className="container">
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" className="gap-1.5">
              <Link to={`/sehir/${city.slug}/ucuslar`}>
                <Plane className="w-4 h-4" />
                Uçuşlar
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="gap-1.5">
              <Link to={`/sehir/${city.slug}/oteller`}>
                <Hotel className="w-4 h-4" />
                Oteller
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="gap-1.5">
              <Link to={`/sehir/${city.slug}/coworking`}>
                <Building2 className="w-4 h-4" />
                Coworking
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="gap-1.5">
              <Link to={`/sehir/${city.slug}/aktiviteler`}>
                <Compass className="w-4 h-4" />
                Aktiviteler
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="gap-1.5">
              <Link to={`/sehir/${city.slug}/nomad`}>
                <Laptop className="w-4 h-4" />
                Nomad Rehberi
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-4">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6 min-w-0">
              
              {/* H2: About City */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-display font-bold mb-4">
                    {city.name} Hakkında
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {city.description}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {city.name}, {city.country}'nın en önemli şehirlerinden biri olarak hem iş hem de tatil amaçlı seyahat edenler için ideal bir destinasyondur. 
                    Şehir, {city.highlights.slice(0, 3).join(', ')} gibi önemli noktalarıyla ünlüdür ve yılın her döneminde ziyaretçi çeker. 
                    {city.airportCodes.length > 1 
                      ? ` ${city.airportCodes.join(' ve ')} havalimanları ile uluslararası bağlantıları güçlüdür.`
                      : ` ${city.airportCodes[0]} havalimanı üzerinden kolay ulaşım sağlanır.`
                    }
                  </p>
                  
                  {/* Highlights */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Öne Çıkan Yerler</h3>
                    <div className="flex flex-wrap gap-2">
                      {city.highlights.map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1.5">
                          <Star className="w-3 h-3 mr-1.5 text-warning" />
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* H2: Digital Nomad Summary */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-display font-bold mb-4">
                    Dijital Göçebeler İçin {city.name}
                  </h2>
                  
                  {cityNomadData ? (
                    <>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {city.name}, dijital göçebeler için {cityNomadData.nomadScore >= 8 ? 'mükemmel' : cityNomadData.nomadScore >= 6 ? 'iyi' : 'gelişmekte olan'} bir destinasyondur. 
                        Şehirde {cityNomadData.coworkingCount}+ coworking alanı, {cityNomadData.cafesWithWifi}+ WiFi'lı kafe bulunur ve ortalama internet hızı {cityNomadData.internetSpeed}'dir. 
                        Aylık yaşam maliyeti yaklaşık {cityNomadData.costOfLiving} olup, {cityNomadData.visaInfo} seçeneği mevcuttur.
                      </p>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Wifi className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">İnternet Hızı</p>
                            <p className="font-medium">{cityNomadData.internetSpeed}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Banknote className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Aylık Maliyet</p>
                            <p className="font-medium">{cityNomadData.costOfLiving}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Shield className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Güvenlik</p>
                            <p className="font-medium">{cityNomadData.safetyScore}/10</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Users className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Topluluk</p>
                            <p className="font-medium">{cityNomadData.communityScore}/10</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Button asChild variant="outline" className="gap-2">
                          <Link to={`/sehir/${city.slug}/nomad`}>
                            <Laptop className="w-4 h-4" />
                            Detaylı Nomad Rehberi
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">
                        {city.name} için dijital göçebe verileri henüz eklenmedi. 
                        Tahmini veriler yakında eklenecektir.
                      </p>
                      <Button asChild variant="outline">
                        <Link to="/nomad-hub">Diğer Nomad Şehirlerini Keşfet</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* H2: Best Neighborhoods */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-display font-bold mb-4">
                    {city.name}'de En İyi Bölgeler
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {city.name}'de konaklama için en popüler mahalleler ve her birinin sunduğu deneyimler:
                  </p>
                  
                  {/* Interactive Date & Guest Selector */}
                  <div className="bg-muted/50 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <CalendarIcon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Tarih ve Misafir Seçin</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Check-in Date */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal h-10">
                            <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                            {format(checkInDate, 'd MMM', { locale: tr })}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-50" align="start">
                          <Calendar
                            mode="single"
                            selected={checkInDate}
                            onSelect={(date) => {
                              if (date) {
                                setCheckInDate(date);
                                if (checkOutDate <= date) {
                                  setCheckOutDate(addDays(date, 2));
                                }
                              }
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      {/* Check-out Date */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal h-10">
                            <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                            {format(checkOutDate, 'd MMM', { locale: tr })}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-50" align="start">
                          <Calendar
                            mode="single"
                            selected={checkOutDate}
                            onSelect={(date) => date && setCheckOutDate(date)}
                            disabled={(date) => date <= checkInDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      {/* Guests */}
                      <Popover open={isGuestsOpen} onOpenChange={setIsGuestsOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal h-10">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="truncate text-sm">{guestSummary}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 z-50" align="end">
                          <div className="space-y-4">
                            {/* Adults */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-sm">Yetişkin</div>
                                <div className="text-xs text-muted-foreground">18+ yaş</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateGuests('adults', -1)}
                                  disabled={guests.adults <= 1}
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center">{guests.adults}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateGuests('adults', 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </div>

                            {/* Children */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-sm">Çocuk</div>
                                <div className="text-xs text-muted-foreground">0-17 yaş</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateGuests('children', -1)}
                                  disabled={guests.children <= 0}
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center">{guests.children}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateGuests('children', 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </div>

                            {/* Rooms */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-sm">Oda</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateGuests('rooms', -1)}
                                  disabled={guests.rooms <= 1}
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center">{guests.rooms}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateGuests('rooms', 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </div>

                            <Button 
                              className="w-full" 
                              onClick={() => setIsGuestsOpen(false)}
                            >
                              Tamam
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {neighborhoods.map((neighborhood, index) => {
                      // Generate Agoda search URL for this neighborhood with selected dates
                      const cityEnName = getCityEnglishName(city.slug) || city.nameEn || city.name;
                      const searchQuery = `${neighborhood.name} ${cityEnName}`;
                      const neighborhoodUrl = getAgodaUrl(city.slug, searchQuery, checkIn, checkOut, {
                        adults: guests.adults,
                        rooms: guests.rooms
                      });
                      
                      return (
                        <a 
                          key={index}
                          href={neighborhoodUrl}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-muted/50 hover:bg-primary/10 transition-colors group cursor-pointer"
                        >
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold mb-0.5 sm:mb-1 group-hover:text-primary transition-colors text-sm sm:text-base">
                              {neighborhood.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{neighborhood.description}</p>
                          </div>
                          <div className="hidden sm:flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <Hotel className="w-4 h-4" />
                            <span>Otel Ara</span>
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* H2: Hotels Summary */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-display font-bold">
                      {city.name} Otelleri
                    </h2>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/sehir/${city.slug}/oteller`}>
                        Tümünü Gör
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {city.name}'de bütçenize ve tercihlerinize uygun yüzlerce konaklama seçeneği bulunmaktadır. 
                    Şehir merkezindeki lüks otellerden, tarihi bölgelerdeki butik pansiyonlara kadar geniş bir yelpaze mevcuttur. 
                    {neighborhoods[0] && ` ${neighborhoods[0].name} bölgesi, merkezi konumu ile en popüler konaklama alanlarından biridir.`}
                  </p>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {['Merkez Otelleri', 'Butik Oteller', 'Uygun Fiyatlı'].map((type, i) => (
                      <Link 
                        key={i}
                        to={`/sehir/${city.slug}/oteller`}
                        className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <Hotel className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium group-hover:text-primary transition-colors">
                          {city.name} {type}
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* H2: Flights Summary */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-display font-bold">
                      {city.name} Uçuşları
                    </h2>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/sehir/${city.slug}/ucuslar`}>
                        Tümünü Gör
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {city.name}'e {city.airportCodes.length > 1 
                      ? `${city.airportCodes.join(' ve ')} havalimanları` 
                      : `${city.airportCodes[0]} havalimanı`
                    } üzerinden ulaşabilirsiniz. 
                    Türkiye'den {city.name}'e direkt ve aktarmalı uçuş seçenekleri mevcuttur. 
                    En uygun fiyatlar için {city.bestTimeToVisit} döneminin dışındaki tarihleri tercih edebilirsiniz.
                  </p>
                  
                  {relatedRoutes.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {relatedRoutes.slice(0, 6).map((route) => (
                        <Link
                          key={route.slug}
                          to={`/ucus/${route.slug}`}
                          className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                        >
                          <span className="font-medium text-sm">
                            {route.originCode} → {route.destinationCode}
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* H2: Coworking Summary */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-display font-bold">
                      {city.name} Coworking Alanları
                    </h2>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/sehir/${city.slug}/coworking`}>
                        Tümünü Gör
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                  
                  {cityCoworkings.length > 0 ? (
                    <>
                      <p className="text-muted-foreground mb-6">
                        {city.name}'de {cityNomadData ? cityNomadData.coworkingCount + '+' : 'birçok'} coworking alanı bulunmaktadır. 
                        Startup hub'larından butik çalışma alanlarına kadar farklı ihtiyaçlara uygun seçenekler mevcuttur.
                      </p>
                      <div className="space-y-3">
                        {cityCoworkings.slice(0, 3).map((space) => (
                          <Link
                            key={space.slug}
                            to={`/coworking/${space.slug}`}
                            className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                                {space.name}
                              </h3>
                              <p className="text-sm text-muted-foreground truncate">
                                {space.neighborhood} • {space.pricing?.monthly ? `${space.pricing.monthly}${space.pricing.currency}/ay` : 'Fiyat için iletişime geçin'}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      {city.name} için coworking alanları yakında eklenecektir. 
                      {cityNomadData && ` Şehirde tahmini ${cityNomadData.coworkingCount}+ coworking alanı bulunmaktadır.`}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* H2: Nomad Guide Summary */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-display font-bold">
                      {city.name} Dijital Göçebe Rehberi
                    </h2>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/sehir/${city.slug}/nomad`}>
                        Rehbere Git
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {city.name}'de uzaktan çalışmak isteyenler için kapsamlı rehberimiz; yaşam maliyetleri, vize gereksinimleri, 
                    en iyi mahalleler, internet altyapısı ve yerel nomad topluluğu hakkında detaylı bilgiler sunmaktadır.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-primary" />
                      WiFi'lı kafeler ve çalışma alanları
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />
                      Vize ve çalışma izni bilgileri
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      Nomad etkinlikleri ve networking
                    </li>
                    <li className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-primary" />
                      İklim ve en iyi ziyaret zamanı
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Events Section */}
              {city.events && city.events.length > 0 && (
                <Card variant="elevated">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-display font-bold mb-4">
                      {city.name} Yaklaşan Etkinlikler
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {city.name}'deki önemli etkinlik ve festival tarihlerine göre seyahatinizi planlayın:
                    </p>
                    <EventCountdownList 
                      events={city.events}
                      citySlug={city.slug}
                      cityName={city.name}
                    />
                  </CardContent>
                </Card>
              )}

              {/* AI Trip Planner */}
              <TripPlanner 
                cityName={city.name} 
                cityNameEn={city.nameEn}
                country={city.country} 
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6 min-w-0">
              {/* Quick Info Card */}
              <Card variant="elevated" className="sticky top-20 overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-lg font-display font-bold mb-4">
                    {city.name} Hızlı Bilgiler
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">En İyi Zaman</p>
                        <p className="font-medium">{city.bestTimeToVisit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Saat Dilimi</p>
                        <p className="font-medium">{city.timezone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Banknote className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Para Birimi</p>
                        <p className="font-medium">{city.currency}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Languages className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Dil</p>
                        <p className="font-medium">{city.language}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nüfus</p>
                        <p className="font-medium">{city.population}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Plane className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Havalimanları</p>
                        <p className="font-medium">{city.airportCodes.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weather Widget */}
              <WeatherWidget cityName={city.name} />

              {/* Klook Activities Widget */}
              <KlookActivitiesWidget 
                citySlug={city.slug}
                cityName={city.name}
              />

              {/* Hotels Widget */}
              <CityHotelsWidget 
                citySlug={city.slug}
                cityName={city.name}
                cityNameEn={city.nameEn}
              />

              {/* eSIM Widget */}
              <EsimWidget 
                countryCode={city.countryCode}
                countryName={city.country}
                cityName={city.name}
              />

              {/* Travel Tips */}
              <TravelTips 
                cityName={city.name}
                bestTimeToVisit={city.bestTimeToVisit}
                currency={city.currency}
                language={city.language}
              />

              {/* CTA Card */}
              <Card className="gradient-hero text-white border-0">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-display font-bold mb-2">
                    {city.name}'e Uçun
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    En uygun {city.name} uçak biletlerini karşılaştırın
                  </p>
                  <Button asChild variant="secondary" className="w-full">
                    <Link to={`/sehir/${city.slug}/ucak-bileti`}>
                      Bilet Ara
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Searches Module */}
      <section className="py-6 bg-muted/30">
        <div className="container">
          <Card variant="elevated">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-display font-bold">
                  {city.name} Popüler Aramalar
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link 
                  to={`/sehir/${city.slug}/ucuslar`}
                  className="p-4 rounded-xl bg-background hover:bg-muted transition-colors group"
                >
                  <Plane className="w-5 h-5 text-primary mb-2" />
                  <p className="font-medium group-hover:text-primary transition-colors">
                    {city.name} uçak bileti
                  </p>
                  <p className="text-sm text-muted-foreground">En ucuz uçuşları bul</p>
                </Link>
                <Link 
                  to={`/sehir/${city.slug}/oteller`}
                  className="p-4 rounded-xl bg-background hover:bg-muted transition-colors group"
                >
                  <Hotel className="w-5 h-5 text-primary mb-2" />
                  <p className="font-medium group-hover:text-primary transition-colors">
                    {city.name} otelleri
                  </p>
                  <p className="text-sm text-muted-foreground">Konaklama seçenekleri</p>
                </Link>
                <Link 
                  to={`/sehir/${city.slug}/coworking`}
                  className="p-4 rounded-xl bg-background hover:bg-muted transition-colors group"
                >
                  <Building2 className="w-5 h-5 text-primary mb-2" />
                  <p className="font-medium group-hover:text-primary transition-colors">
                    {city.name} coworking
                  </p>
                  <p className="text-sm text-muted-foreground">Çalışma alanları</p>
                </Link>
                <Link 
                  to={`/sehir/${city.slug}/nomad`}
                  className="p-4 rounded-xl bg-background hover:bg-muted transition-colors group"
                >
                  <Laptop className="w-5 h-5 text-primary mb-2" />
                  <p className="font-medium group-hover:text-primary transition-colors">
                    {city.name} nomad rehberi
                  </p>
                  <p className="text-sm text-muted-foreground">Dijital göçebe bilgileri</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Similar Cities Module */}
      {similarCities.length > 0 && (
        <section className="py-6">
          <div className="container">
            <Card variant="elevated">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-display font-bold">
                      Benzer Şehirler
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      {city.name} ile benzer destinasyonları keşfedin
                    </p>
                  </div>
                  <Button asChild variant="outline">
                    <Link to="/sehirler">
                      Tüm Şehirler
                    </Link>
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similarCities.map((similarCity) => (
                    <Link
                      key={similarCity.slug}
                      to={`/sehir/${similarCity.slug}`}
                      className="group relative overflow-hidden rounded-xl aspect-[16/9]"
                    >
                      <img 
                        src={similarCity.image} 
                        alt={`${similarCity.name} şehir manzarası`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getCountryFlag(similarCity.countryCode)}</span>
                          <div>
                            <h3 className="font-bold text-white group-hover:text-primary transition-colors">
                              {similarCity.name}
                            </h3>
                            <p className="text-sm text-white/80">{similarCity.country}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default City;
