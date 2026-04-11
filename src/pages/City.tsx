import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Star, ChevronRight, AlertTriangle, Building2, Coffee, Globe, Users, Sun, Calendar, DollarSign, HelpCircle, Info, ShieldCheck, MapPin, Bus, UtensilsCrossed } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cityGeoData } from '@/lib/cityGeoData';
import { TripPlanner } from '@/components/TripPlanner';
import { EventCountdownList } from '@/components/EventCountdown';
import { WeatherWidget, TravelTips } from '@/components/WeatherWidget';
import { CityHotelsWidget } from '@/components/CityHotelsWidget';
import { KlookActivitiesWidget } from '@/components/KlookActivitiesWidget';
import { TravelpayoutsToursWidget } from '@/components/TravelpayoutsToursWidget';
import { EsimWidget } from '@/components/EsimWidget';
import { ExchangeRateWidget } from '@/components/ExchangeRateWidget';
import { getCityBySlug, getAllCities, CityInfo } from '@/lib/cities';
import { getCountryFlag } from '@/lib/destinations';
import { nomadMetrics, coworkingSpaces } from '@/lib/nomad';
import { useCityDisplay } from '@/hooks/useCityDisplay';
import {
  CityHeroSection,
  CityQuickStats,
  CityNomadStats,
  CityNeighborhoods,
  CitySimilar,
  CityPopularSearches,
} from '@/components/city';

// Helper to check if city has sufficient data
const hasSufficientData = (city: CityInfo): boolean => {
  const hasBasicInfo = Boolean(city.description && city.description.length > 50);
  const hasHighlights = Boolean(city.highlights && city.highlights.length >= 3);
  const hasVisitInfo = Boolean(city.bestTimeToVisit && city.currency && city.language);
  return hasBasicInfo && hasHighlights && hasVisitInfo;
};

// Get similar cities based on country or region
const getSimilarCities = (currentCity: CityInfo, allCities: CityInfo[]): CityInfo[] => {
  const sameCountry = allCities.filter(c => 
    c.slug !== currentCity.slug && c.country === currentCity.country
  );
  
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
    'budapeste': [
      { name: 'Belváros (5. Bölge)', description: 'Şehrin kalbi. Parlamento, Bazilika, Váci utca. Her yere yürüme mesafesinde.' },
      { name: 'Erzsébetváros (7. Bölge)', description: 'Ruin bar bölgesi. Szimpla Kert, gece hayatı, sokak sanatı ve trendy kafeler.' },
      { name: 'Terézváros (6. Bölge)', description: 'Andrássy Bulvarı, Opera Binası, Terör Evi. Sofistike ve merkezi.' },
      { name: 'Buda – Kale Bölgesi (1. Bölge)', description: 'Tarihi kale, Balıkçı Tabyası, Matthias Kilisesi. Sakin ve romantik.' },
      { name: 'Újlipótváros (13. Bölge)', description: 'Yerel atmosfer, Tuna kenarı, uygun fiyat. Nomadlar ve uzun konaklama için ideal.' },
    ],
    'tiflis': [
      { name: 'Old Tbilisi', description: 'Tarihi merkez, dar sokaklar ve geleneksel mimari' },
      { name: 'Vake', description: 'Lüks mahalle, parklar ve modern kafeler' },
      { name: 'Saburtalo', description: 'Yerel yaşam, uygun fiyatlar ve metro erişimi' },
      { name: 'Marjanishvili', description: 'Sanat galerileri, restoranlar ve gece hayatı' },
      { name: 'Vera', description: 'Bohem atmosfer, vintage dükkanlar ve kültürel mekanlar' },
    ],
    'istanbul': [
      { name: 'Sultanahmet', description: 'Ayasofya, Topkapı Sarayı, Sultanahmet Camii. Tarihin kalbi.' },
      { name: 'Beyoğlu / İstiklal', description: 'İstiklal Caddesi, Galata Kulesi, gece hayatı ve kafeler.' },
      { name: 'Kadıköy', description: 'Asya yakasında yerel lezzetler, çarşı, canlı sokak kültürü.' },
      { name: 'Karaköy', description: 'Trendy kafeler, galeriler, Boğaz manzarası. Hipster bölgesi.' },
      { name: 'Beşiktaş', description: 'Yerel hayat, sahil, Ortaköy Camii ve Boğaz kenarı.' },
    ],
    'roma': [
      { name: 'Centro Storico', description: 'Pantheon, Piazza Navona, Trevi Çeşmesi. Yürüyerek her yere.' },
      { name: 'Trastevere', description: 'Bohem atmosfer, arnavut kaldırımı, en iyi restoranlar.' },
      { name: 'Monti', description: 'Trendy butikler, vintage dükkanlar, kafeler. Colosseum yakını.' },
      { name: 'Testaccio', description: 'Yerel mutfak merkezi, gece hayatı, turistik olmayan.' },
      { name: 'Vatikan Çevresi (Prati)', description: 'Vatikan Müzeleri yakını, sakin, iyi restoranlar.' },
    ],
    'amsterdam': [
      { name: 'Centrum', description: 'Dam Meydanı, Red Light District, kanallar. Her şeye yakın.' },
      { name: 'Jordaan', description: 'Pitoresk kanallar, butik dükkanlar, kafeler. En güzel mahalle.' },
      { name: 'De Pijp', description: 'Albert Cuyp Pazarı, çok kültürlü, canlı. Heineken deneyimi.' },
      { name: 'Oud-West / Vondelpark', description: 'Vondelpark yanı, sakin, yerel hayat, müzelere yakın.' },
      { name: 'Noord', description: 'NDSM Wharf, yaratıcı endüstri, ücretsiz feribot ile merkeze.' },
    ],
    'tokyo': [
      { name: 'Shinjuku', description: 'Gökdelenler, gece hayatı, Golden Gai barları, büyük istasyon.' },
      { name: 'Shibuya', description: 'Ünlü kavşak, alışveriş, genç kültür, Meiji Tapınağı yakın.' },
      { name: 'Asakusa', description: 'Senso-ji tapınağı, geleneksel atmosfer, Sumida nehri.' },
      { name: 'Akihabara', description: 'Anime, manga, elektronik. Otaku kültürünün merkezi.' },
      { name: 'Roppongi', description: 'Gece hayatı, sanat müzeleri, uluslararası atmosfer.' },
    ],
    'dubai': [
      { name: 'Downtown / Burj Khalifa', description: 'Dubai Mall, çeşme show, lüks. Şehrin merkezi.' },
      { name: 'Dubai Marina', description: 'Gökdelen silueti, sahil yürüyüşü, restoranlar.' },
      { name: 'Deira / Old Dubai', description: 'Gold Souk, Spice Souk, geleneksel abra tekneleri.' },
      { name: 'JBR (Jumeirah Beach)', description: 'Plaj, açık hava mekanları, aile dostu.' },
      { name: 'Business Bay', description: 'Modern, Downtown yakını, daha uygun fiyatlı oteller.' },
    ],
    'lizbon': [
      { name: 'Alfama', description: 'En eski mahalle, fado müziği, dar sokaklar, manzara.' },
      { name: 'Baixa / Chiado', description: 'Şehir merkezi, alışveriş, kafeler, tram 28.' },
      { name: 'Bairro Alto', description: 'Gece hayatı merkezi, barlar, restoranlar.' },
      { name: 'Belém', description: 'Pastéis de Belém, kule, keşif anıtı. Biraz dışarıda.' },
      { name: 'LX Factory / Alcântara', description: 'Yaratıcı merkez, restoranlar, pazar.' },
    ],
    'prag': [
      { name: 'Staré Město (Eski Şehir)', description: 'Astronomik saat, Karlova Köprüsü yanı, turistik merkez.' },
      { name: 'Malá Strana', description: 'Kale altı, barok mimari, sakin kafeler.' },
      { name: 'Vinohrady', description: 'Yerel atmosfer, şık restoranlar, parklar. Nomad favori.' },
      { name: 'Žižkov', description: 'Bütçe dostu, barlar, TV kulesi, alternatif.' },
      { name: 'Holešovice', description: 'Yükselen bölge, çağdaş sanat, DOX merkezi.' },
    ],
    'viyana': [
      { name: 'Innere Stadt (1. Bölge)', description: 'Stephansdom, opera, Graben. Tarihi merkez, pahalı.' },
      { name: 'Leopoldstadt (2. Bölge)', description: 'Prater, çok kültürlü, Tuna kanalı barları.' },
      { name: 'Neubau (7. Bölge)', description: 'Hipster mahalle, butikler, kafeler, MuseumsQuartier.' },
      { name: 'Mariahilf (6. Bölge)', description: 'Naschmarkt pazarı, alışveriş, canlı.' },
      { name: 'Wieden (4. Bölge)', description: 'Sakin, Belvedere yakını, yerel kafeler.' },
    ],
    'porto': [
      { name: 'Ribeira', description: 'UNESCO bölgesi, Douro kıyısı, renkli evler.' },
      { name: 'Baixa', description: 'Şehir merkezi, Clerigos Kulesi, Livraria Lello.' },
      { name: 'Cedofeita / Bonfim', description: 'Yerel hayat, street art, uygun fiyatlı.' },
      { name: 'Vila Nova de Gaia', description: 'Karşı kıyı, port şarabı mahzenleri, nehir manzarası.' },
    ],
    'bangkok': [
      { name: 'Sukhumvit', description: 'Expat merkezi, BTS hattı, gece hayatı, alışveriş.' },
      { name: 'Old Town (Rattanakosin)', description: 'Grand Palace, Wat Pho, Khao San Road.' },
      { name: 'Silom / Sathorn', description: 'İş merkezi, gece pazarları, sky barlar.' },
      { name: 'Chinatown (Yaowarat)', description: 'Sokak yemeği cenneti, altın dükkanları, Wat Traimit.' },
      { name: 'Ari / Chatuchak', description: 'Yerel atmosfer, hafta sonu pazarı, kafeler.' },
    ],
    'bali': [
      { name: 'Ubud', description: 'Pirinç terasları, yoga, sanat galerileri, maymun ormanı.' },
      { name: 'Seminyak', description: 'Beach clublar, lüks, restoranlar, alışveriş.' },
      { name: 'Canggu', description: 'Sörf, dijital göçebe merkezi, kafeler, rice paddies.' },
      { name: 'Uluwatu', description: 'Uçurum tapınağı, sörf, lüks villalar, gün batımı.' },
      { name: 'Sanur', description: 'Sakin sahil, aile dostu, geleneksel, dalış.' },
    ],
    'singapur': [
      { name: 'Marina Bay', description: 'Marina Bay Sands, Gardens by the Bay, sky bar.' },
      { name: 'Chinatown', description: 'Sokak yemeği, tapınaklar, gece pazarı.' },
      { name: 'Little India', description: 'Renkli, aromatik, Mustafa Centre 24 saat açık.' },
      { name: 'Kampong Glam', description: 'Malay mirası, street art, Haji Lane butikleri.' },
      { name: 'Orchard Road', description: 'Alışveriş cenneti, ünlü marka mağazaları.' },
    ],
    'seul': [
      { name: 'Myeongdong', description: 'Alışveriş, K-beauty, sokak yemeği, turistik merkez.' },
      { name: 'Hongdae', description: 'Genç kültür, K-pop, gece hayatı, street art.' },
      { name: 'Gangnam', description: 'Lüks alışveriş, K-pop merkezleri, COEX Mall.' },
      { name: 'Insadong', description: 'Geleneksel sanat, çay evleri, hediyelik eşya.' },
      { name: 'Itaewon', description: 'Uluslararası, barlar, çok kültürlü restoranlar.' },
    ],
    'madrid': [
      { name: 'Sol / Centro', description: 'Puerta del Sol, Gran Vía, tapas barları, merkez.' },
      { name: 'La Latina', description: 'Pazar günü El Rastro, tapas, canlı meydanlar.' },
      { name: 'Malasaña', description: 'Hipster, vintage, barlar, Plaza del Dos de Mayo.' },
      { name: 'Salamanca', description: 'Lüks alışveriş, Michelin restoranlar, şık.' },
      { name: 'Lavapiés', description: 'Çok kültürlü, sanat galerileri, uygun fiyatlı.' },
    ],
    'newyork': [
      { name: 'Midtown Manhattan', description: 'Times Square, Empire State, Broadway. Turistik merkez.' },
      { name: 'Lower Manhattan', description: 'Wall Street, One WTC, Özgürlük Anıtı feribotu.' },
      { name: 'Williamsburg (Brooklyn)', description: 'Hipster, vintage, müzik mekanları, nehir manzarası.' },
      { name: 'Upper West Side', description: 'Central Park yanı, sakin, müzeler, aile dostu.' },
      { name: 'East Village / LES', description: 'Barlar, restoranlar, sanat, genç enerji.' },
    ],
    'marakes': [
      { name: 'Medina', description: 'UNESCO mirası, souklar, riad\'lar, Jemaa el-Fna.' },
      { name: 'Gueliz (Ville Nouvelle)', description: 'Modern şehir, Fransız etkisi, kafeler, galeriler.' },
      { name: 'Kasbah', description: 'Saadien Mezarları, el-Badi Sarayı yanı, sakin.' },
      { name: 'Hivernage', description: 'Lüks oteller, barlar, gece hayatı.' },
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
  const currentYear = new Date().getFullYear();
  
  if (!city) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Şehir Bulunamadı</h1>
          <p className="text-muted-foreground mb-4">Aradığınız şehir mevcut değil.</p>
          <Button asChild>
            <Link to="/sehirler">Tüm Şehirlere Gözat</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const similarCities = getSimilarCities(city, allCities);
  const neighborhoods = getNeighborhoods(city.slug);
  const cityNomadData = nomadMetrics[city.slug];
  const cityCoworkings = coworkingSpaces.filter(c => c.citySlug === city.slug);
  const hasSufficient = hasSufficientData(city);
  const flag = getCountryFlag(city.countryCode);
  const geo = cityGeoData[city.slug];

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Şehirler', href: '/sehirler' },
    { label: displayName }
  ];

  const seoTitle = `${displayName} Gezi Rehberi ${currentYear} — Ne Zaman Gidilir, Nerede Kalınır | WooNomad`;
  
  const metaDescParts = [`${displayName} gezi rehberi ${currentYear}.`];
  if (geo?.quickAnswer) {
    metaDescParts.push(geo.quickAnswer);
  } else if (cityNomadData) {
    metaDescParts.push(`İnternet: ${cityNomadData.internetSpeed}, Aylık maliyet: ${cityNomadData.costOfLiving}.`);
  }
  metaDescParts.push(`Mahalleler, gezilecek yerler, maliyet tablosu ve nomad bilgileri.`);
  const metaDescription = metaDescParts.join(' ').slice(0, 160);

  const canonicalUrl = `https://woonomad.co/sehir/${city.slug}`;

  const combinedSchema: any[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "url": canonicalUrl,
      "name": seoTitle,
      "description": metaDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "City",
      "name": city.name,
      "alternateName": city.nameEn,
      "description": city.description,
      "image": city.image,
      "containedInPlace": { "@type": "Country", "name": city.country },
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `${displayName} Gezi Rehberi ${currentYear}`,
      "about": { "@type": "City", "name": city.name },
      "author": { "@type": "Organization", "name": "WooNomad", "url": "https://woonomad.co" },
      "publisher": { "@type": "Organization", "name": "WooNomad", "url": "https://woonomad.co" },
      "dateModified": new Date().toISOString().split('T')[0],
      "datePublished": "2024-01-01",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://woonomad.co/" },
        { "@type": "ListItem", "position": 2, "name": "Şehirler", "item": "https://woonomad.co/sehirler" },
        { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl },
      ],
    },
  ];

  if (geo?.faqs) {
    combinedSchema.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": geo.faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": { "@type": "Answer", "text": f.answer },
      })),
    });
  }

  if (geo?.topAttractions && geo.topAttractions.length > 0) {
    combinedSchema.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `${displayName} Gezilecek Yerler`,
      "itemListOrder": "https://schema.org/ItemListOrderDescending",
      "numberOfItems": geo.topAttractions.length,
      "itemListElement": geo.topAttractions.map((a, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": a.name,
        "description": a.desc,
      })),
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        {!hasSufficient && <meta name="robots" content="noindex, follow" />}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={city.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(combinedSchema)}</script>
      </Helmet>

      <Header />

      {/* Hero & Quick Actions */}
      <CityHeroSection
        city={city}
        displayName={displayName}
        displayCountry={displayCountry}
        flag={flag}
        currentYear={currentYear}
        breadcrumbItems={breadcrumbItems}
      />

      {/* Thin Content Warning */}
      {!hasSufficient && (
        <section className="py-3 bg-warning/10 border-b border-warning/20">
          <div className="container">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm">
                <strong>{city.name}</strong> için detaylı bilgiler yakında eklenecek.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Main Content - Single Column Mobile, 2-Column Desktop */}
      <section className="py-4 md:py-6">
        <div className="container">

          {/* GEO: TL;DR + Last Updated */}
          {geo && (
            <div className="mb-6">
              {geo.lastUpdated && (
                <p className="text-xs text-muted-foreground mb-2">Son güncelleme: {geo.lastUpdated}</p>
              )}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-start gap-2 mb-2">
                    <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-semibold text-sm">Kısa Özet</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{geo.tldr}</p>
                  
                  {/* Ideal For tags + Suggested Days */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {geo.suggestedDays && (
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {geo.suggestedDays}
                      </Badge>
                    )}
                    {geo.idealFor?.map((tag: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              
              {/* Quick Stats - Mobile Only */}
              <Card variant="elevated" className="lg:hidden">
                <CardContent className="p-4">
                  <CityQuickStats city={city} />
                </CardContent>
              </Card>

              {/* About City */}
              <Card variant="elevated">
                <CardContent className="p-4 md:p-5">
                  <h2 className="text-xl md:text-2xl font-display font-bold mb-3">
                    {city.name} Hakkında
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {city.description}
                  </p>
                  
                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {city.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs py-1">
                        <Star className="w-3 h-3 mr-1 text-warning" />
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Digital Nomad Stats */}
              <Card variant="elevated">
                <CardContent className="p-4 md:p-5">
                  <h2 className="text-xl md:text-2xl font-display font-bold mb-3">
                    Dijital Göçebeler İçin
                  </h2>
                  <CityNomadStats
                    citySlug={city.slug}
                    cityName={city.name}
                    nomadData={cityNomadData}
                  />
                </CardContent>
              </Card>

              {/* GEO: Season Table */}
              {geo?.seasons && (
                <Card variant="elevated">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h2 className="text-xl md:text-2xl font-display font-bold">{city.name} Ne Zaman Gidilir?</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left py-2.5 px-3 font-semibold">Dönem</th>
                            <th className="text-left py-2.5 px-3 font-semibold">Sıcaklık</th>
                            <th className="text-left py-2.5 px-3 font-semibold">Kalabalık</th>
                            <th className="text-left py-2.5 px-3 font-semibold">Fiyat</th>
                            <th className="text-left py-2.5 px-3 font-semibold hidden md:table-cell">Not</th>
                          </tr>
                        </thead>
                        <tbody>
                          {geo.seasons.map((s, i) => (
                            <tr key={i} className="border-b">
                              <td className="py-2.5 px-3 font-medium">{s.period}</td>
                              <td className="py-2.5 px-3">{s.temp}</td>
                              <td className="py-2.5 px-3">{s.crowd}</td>
                              <td className="py-2.5 px-3">{s.price}</td>
                              <td className="py-2.5 px-3 text-muted-foreground hidden md:table-cell">{s.note}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* GEO: Cost Table */}
              {geo?.costs && (
                <Card variant="elevated">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <h2 className="text-xl md:text-2xl font-display font-bold">{city.name} Ne Kadar Tutar?</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left py-2.5 px-3 font-semibold">Kalem</th>
                            <th className="text-left py-2.5 px-3 font-semibold">Bütçe</th>
                            <th className="text-left py-2.5 px-3 font-semibold">Orta</th>
                            <th className="text-left py-2.5 px-3 font-semibold">Konfor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {geo.costs.map((c, i) => (
                            <tr key={i} className={`border-b ${c.item.startsWith('TOPLAM') ? 'font-bold bg-muted/30' : ''}`}>
                              <td className="py-2.5 px-3">{c.item}</td>
                              <td className="py-2.5 px-3 text-emerald-600">{c.budget}</td>
                              <td className="py-2.5 px-3 text-amber-600">{c.mid}</td>
                              <td className="py-2.5 px-3 text-violet-600">{c.comfort}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* GEO: Safety & Visa */}
              {geo && (geo.safety || geo.visa) && (
                <Card variant="elevated">
                  <CardContent className="p-4 md:p-5 space-y-4">
                    {geo.safety && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck className="h-5 w-5 text-emerald-500" />
                          <h2 className="text-xl md:text-2xl font-display font-bold">Güvenlik</h2>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{geo.safety}</p>
                      </div>
                    )}
                    {geo.visa && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-display font-bold">Vize Bilgisi</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{geo.visa}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* GEO: Top Attractions */}
              {geo?.topAttractions && geo.topAttractions.length > 0 && (
                <Card variant="elevated">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h2 className="text-xl md:text-2xl font-display font-bold">{city.name} Gezilecek Yerler</h2>
                    </div>
                    <div className="space-y-3">
                      {geo.topAttractions.map((attraction: { name: string; desc: string; category: string }, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-primary">{i + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-medium text-sm">{attraction.name}</p>
                              <Badge variant="outline" className="text-2xs py-0 px-1.5">{attraction.category}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{attraction.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Travelpayouts Klook Tours Widget */}
              <TravelpayoutsToursWidget
                citySlug={city.slug}
                cityNameEn={city.nameEn}
              />

              {/* GEO: Transport */}
              {geo?.transport && (
                <Card variant="elevated">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Bus className="h-5 w-5 text-primary" />
                      <h2 className="text-xl md:text-2xl font-display font-bold">Ulaşım</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{geo.transport}</p>
                  </CardContent>
                </Card>
              )}

              {/* GEO: Food */}
              {geo?.food && (
                <Card variant="elevated">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <UtensilsCrossed className="h-5 w-5 text-primary" />
                      <h2 className="text-xl md:text-2xl font-display font-bold">Yeme İçme</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{geo.food}</p>
                  </CardContent>
                </Card>
              )}

              {/* Neighborhoods */}
              <Card variant="elevated">
                <CardContent className="p-4 md:p-5">
                  <h2 className="text-xl md:text-2xl font-display font-bold mb-3">
                    En İyi Bölgeler
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    {city.name}'de konaklama için popüler mahalleler:
                  </p>
                  <CityNeighborhoods
                    citySlug={city.slug}
                    cityName={city.name}
                    cityNameEn={city.nameEn}
                    neighborhoods={neighborhoods}
                  />
                </CardContent>
              </Card>

              {/* Coworking Summary */}
              <Card variant="elevated">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl md:text-2xl font-display font-bold">
                      Coworking Alanları
                    </h2>
                    <Button asChild variant="ghost" size="sm" className="gap-1">
                      <Link to={`/sehir/${city.slug}/coworking`}>
                        Tümü <ChevronRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                  
                  {cityCoworkings.length > 0 ? (
                    <div className="space-y-2">
                      {cityCoworkings.slice(0, 3).map((space) => (
                        <Link
                          key={space.slug}
                          to={`/coworking/${space.slug}`}
                          className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                              {space.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {space.neighborhood} • {space.pricing?.monthly ? `${space.pricing.monthly}${space.pricing.currency}/ay` : 'Fiyat için iletişime geçin'}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {city.name} için coworking alanları yakında eklenecek.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Nomad Guide Summary */}
              <Card variant="elevated">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl md:text-2xl font-display font-bold">
                      Nomad Rehberi
                    </h2>
                    <Button asChild variant="ghost" size="sm" className="gap-1">
                      <Link to={`/sehir/${city.slug}/nomad`}>
                        Rehber <ChevronRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">
                    {city.name}'de uzaktan çalışmak için kapsamlı rehber.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: Coffee, label: 'WiFi\'lı kafeler' },
                      { icon: Globe, label: 'Vize bilgileri' },
                      { icon: Users, label: 'Nomad etkinlikleri' },
                      { icon: Sun, label: 'İklim rehberi' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <item.icon className="w-4 h-4 text-primary" />
                        {item.label}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Events */}
              {city.events && city.events.length > 0 && (
                <Card variant="elevated">
                  <CardContent className="p-4 md:p-5">
                    <h2 className="text-xl md:text-2xl font-display font-bold mb-3">
                      Yaklaşan Etkinlikler
                    </h2>
                    <EventCountdownList 
                      events={city.events}
                      citySlug={city.slug}
                      cityName={city.name}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Trip Planner */}
              <TripPlanner 
                cityName={city.name} 
                cityNameEn={city.nameEn}
                country={city.country} 
              />
            </div>

            {/* Sidebar - Desktop Only */}
            <div className="hidden lg:block space-y-4">
              {/* Quick Info */}
              <Card variant="elevated" className="sticky top-20">
                <CardContent className="p-4">
                  <h3 className="text-lg font-display font-bold mb-3">
                    Hızlı Bilgiler
                  </h3>
                  <CityQuickStats city={city} layout="list" />
                </CardContent>
              </Card>

              {/* Weather */}
              <WeatherWidget cityName={city.name} citySlug={city.slug} />

              {/* Exchange Rate */}
              <ExchangeRateWidget 
                countryCode={city.countryCode} 
                currencyName={city.currency} 
              />

              {/* Klook Activities */}
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

              {/* eSIM */}
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

              {/* CTA */}
              <Card className="gradient-hero text-white border-0">
                <CardContent className="p-4 text-center">
                  <h3 className="text-lg font-display font-bold mb-2">
                    {city.name}'e Uçun
                  </h3>
                  <p className="text-white/80 text-sm mb-3">
                    En uygun biletleri karşılaştırın
                  </p>
                  <Button asChild variant="secondary" size="sm" className="w-full">
                    <Link to={`/sehir/${city.slug}/ucuslar`}>
                      Bilet Ara
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* GEO: FAQ Section */}
      {geo?.faqs && geo.faqs.length > 0 && (
        <section className="py-4 md:py-6">
          <div className="container">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h2 className="text-xl md:text-2xl font-display font-bold">Sık Sorulan Sorular</h2>
            </div>
            <div className="space-y-2 max-w-3xl">
              {geo.faqs.map((faq, i) => (
                <Card key={i} variant="elevated">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Searches */}
      <section className="py-4 md:py-6 bg-muted/30">
        <div className="container">
          <h2 className="text-xl md:text-2xl font-display font-bold mb-4">
            Popüler Aramalar
          </h2>
          <CityPopularSearches citySlug={city.slug} cityName={city.name} />
        </div>
      </section>

      {/* Similar Cities */}
      {similarCities.length > 0 && (
        <section className="py-4 md:py-6">
          <div className="container">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-display font-bold">
                Benzer Şehirler
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/sehirler">Tümü</Link>
              </Button>
            </div>
            <CitySimilar similarCities={similarCities} />
          </div>
        </section>
      )}

      {/* Mobile Sidebar Widgets */}
      <section className="lg:hidden py-4 space-y-4">
        <div className="container space-y-4">
          <WeatherWidget cityName={city.name} citySlug={city.slug} />
          <ExchangeRateWidget countryCode={city.countryCode} currencyName={city.currency} />
          <KlookActivitiesWidget citySlug={city.slug} cityName={city.name} />
          <TravelpayoutsToursWidget citySlug={city.slug} cityNameEn={city.nameEn} />
          <CityHotelsWidget citySlug={city.slug} cityName={city.name} cityNameEn={city.nameEn} />
          <EsimWidget countryCode={city.countryCode} countryName={city.country} cityName={city.name} />
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default City;
