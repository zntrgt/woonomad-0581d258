import { CityHotelsDynamicContent } from '@/components/CityHotelsDynamicContent';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Hotel, ExternalLink, Calendar as CalendarIcon, Users, MapPin, Star, Building, CreditCard, ChevronDown, ChevronUp, Bus, Shield, HelpCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCityBySlug } from '@/lib/cities';
import { getCountryFlag } from '@/lib/destinations';
import { KlookActivitiesWidget } from '@/components/KlookActivitiesWidget';
import { useCityDisplay } from '@/hooks/useCityDisplay';
import { format, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { getAgodaUrl, openAgodaUrl } from '@/lib/agodaMapping';
import { getCityNeighborhoods, getHotelFAQItems } from '@/lib/cityNeighborhoods';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { TravelpayoutsHotelWidget } from '@/components/widgets';

const CityHotels = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const city = slug ? getCityBySlug(slug) : null;
  const { displayName, displayCountry } = useCityDisplay(city);
  const [showAllNeighborhoods, setShowAllNeighborhoods] = useState(false);
  
  // Interactive date/guest states
  const today = new Date();
  const [checkInDate, setCheckInDate] = useState<Date>(addDays(today, 7));
  const [checkOutDate, setCheckOutDate] = useState<Date>(addDays(today, 9));
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  
  // Format dates for URL
  const checkIn = format(checkInDate, 'yyyy-MM-dd');
  const checkOut = format(checkOutDate, 'yyyy-MM-dd');
  
  // Generate Agoda affiliate search URL
  const searchCity = city?.nameEn || city?.name || '';
  const citySlug = city?.slug || '';
  const agodaSearchUrl = getAgodaUrl(citySlug, searchCity, checkIn, checkOut);

  const updateGuests = (type: 'adults' | 'children' | 'rooms', delta: number) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(type === 'adults' ? 1 : type === 'rooms' ? 1 : 0, prev[type] + delta)
    }));
  };

  const guestSummary = `${guests.adults} Yetişkin${guests.children > 0 ? `, ${guests.children} Çocuk` : ''}, ${guests.rooms} Oda`;
  
  // Get neighborhood data
  const neighborhoodData = getCityNeighborhoods(citySlug);
  const faqItems = city ? getHotelFAQItems(city.name, city.country) : [];
  
  if (!city) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{t('cityNotFound', 'Şehir Bulunamadı')}</h1>
          <Link to="/sehirler" className="text-primary hover:underline">
            {t('browseAllCities', 'Tüm Şehirlere Gözat')}
          </Link>
        </div>
      </div>
    );
  }

  const flag = getCountryFlag(city.countryCode);
  const currentYear = new Date().getFullYear();

  const breadcrumbItems = [
    { label: t('nav.home', 'Ana Sayfa'), href: '/' },
    { label: t('nav.cities', 'Şehirler'), href: '/sehirler' },
    { label: displayName, href: `/sehir/${city.slug}` },
    { label: t('nav.hotels', 'Oteller') }
  ];

  // Enhanced structured data with FAQPage
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "name": `${displayName} ${t('nav.hotels', 'Otelleri')}`,
        "description": `${displayName} otel fiyatları, bölge rehberi ve en iyi konaklama seçenekleri ${currentYear}`,
        "numberOfItems": 50,
        "itemListElement": neighborhoodData?.neighborhoods.slice(0, 5).map((n, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": `${n.name} Otelleri`,
          "description": n.description
        })) || []
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqItems.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.label,
          "item": item.href ? `https://woonomad.co${item.href}` : undefined
        }))
      }
    ]
  };

  const displayedNeighborhoods = neighborhoodData?.neighborhoods 
    ? (showAllNeighborhoods ? neighborhoodData.neighborhoods : neighborhoodData.neighborhoods.slice(0, 4))
    : [];

  return (
    <>
      <Helmet>
        <title>{`${displayName} Otelleri ${currentYear} | Bölgeler, Fiyatlar, En İyi Konaklama | WooNomad`}</title>
        <meta 
          name="description" 
          content={`${displayName}'de nerede kalınır? Bölge bazlı otel önerileri, ${currentYear} güncel fiyatları ve erken rezervasyonla %30'a varan tasarruf fırsatları.`}
        />
        <link rel="canonical" href={`https://woonomad.co/sehir/${city.slug}/oteller`} />
        <meta property="og:title" content={`${displayName} Otelleri ${currentYear} | Bölgeler ve Fiyatlar`} />
        <meta property="og:description" content={`${displayName}'de en iyi konaklama bölgeleri, otel karşılaştırması ve rezervasyon`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Hero Section */}
          <section className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-3">
              <Hotel className="h-4 w-4" />
              <span>{t('hotels.hotelComparison', 'Otel Karşılaştırma')}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              {flag} {displayName} <span className="text-gradient">Otelleri ({currentYear})</span>
            </h1>
            
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              {displayName}'de nerede kalınır? Bölge bazlı otel önerileri, fiyat karşılaştırması ve erken rezervasyonla tasarruf fırsatları.
            </p>
            
            {/* Interactive Date/Guest Selectors */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              {/* Check-in Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal bg-background/80 backdrop-blur-sm">
                    <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">
                      {format(checkInDate, 'd MMM', { locale: tr })}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
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
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              <span className="text-muted-foreground">→</span>

              {/* Check-out Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal bg-background/80 backdrop-blur-sm">
                    <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">
                      {format(checkOutDate, 'd MMM', { locale: tr })}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={(date) => date && setCheckOutDate(date)}
                    disabled={(date) => date <= checkInDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              {/* Guest Selector */}
              <Popover open={isGuestsOpen} onOpenChange={setIsGuestsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal bg-background/80 backdrop-blur-sm">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm truncate max-w-[120px]">{guestSummary}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="center">
                  <div className="space-y-4">
                    {/* Adults */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{t('hotels.adults', 'Yetişkin')}</div>
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
                        <div className="font-medium text-sm">{t('hotels.children', 'Çocuk')}</div>
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
                        <div className="font-medium text-sm">{t('hotels.rooms', 'Oda')}</div>
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
                      className="w-full gradient-primary" 
                      onClick={() => setIsGuestsOpen(false)}
                    >
                      {t('common.apply', 'Uygula')}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Country Badge */}
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{displayCountry}</span>
              </div>
            </div>
            
            {/* Main CTA */}
            <Button 
              size="lg" 
              className="gradient-primary hover:opacity-90 gap-2"
              onClick={() => openAgodaUrl(citySlug, searchCity, checkIn, checkOut, { adults: guests.adults, rooms: guests.rooms })}
            >
              <Hotel className="h-5 w-5" />
              {t('hotels.searchHotels', 'Otel Ara')}
              <ExternalLink className="h-4 w-4" />
            </Button>
          </section>
          
          {/* Travelpayouts Hotel Widget */}
          <section className="mb-8">
            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-display font-bold mb-4 flex items-center gap-2">
                  <Hotel className="h-5 w-5 text-primary" />
                  {displayName} {t('hotels.searchWidget', 'Otel Arama')}
                </h2>
                <TravelpayoutsHotelWidget 
                  cityName={city.nameEn || city.name}
                  subId={`city-hotels-${citySlug}`}
                />
              </CardContent>
            </Card>
          </section>
          
          {/* Quick Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center p-4">
              <Hotel className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">{t('hotels.hotelOptions', 'Otel Seçeneği')}</div>
            </Card>
            <Card className="text-center p-4">
              <Star className="h-8 w-8 mx-auto text-travel-gold mb-2" />
              <div className="text-2xl font-bold text-primary">4.5+</div>
              <div className="text-sm text-muted-foreground">{t('hotels.avgRating', 'Ortalama Puan')}</div>
            </Card>
            <Card className="text-center p-4">
              <CreditCard className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold text-primary">%30</div>
              <div className="text-sm text-muted-foreground">{t('hotels.savingsUpTo', 'Tasarruf')}</div>
            </Card>
            <Card className="text-center p-4">
              <Building className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold text-primary">1-5★</div>
              <div className="text-sm text-muted-foreground">{t('hotels.allCategories', 'Tüm Kategoriler')}</div>
            </Card>
          </section>

          {/* NEIGHBORHOOD GUIDE - NEW SEO SECTION */}
          {neighborhoodData && (
            <section className="mb-8">
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-xl md:text-2xl font-display font-bold mb-2 flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-primary" />
                    {displayName}'de Hangi Bölgede Kalınır?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Seyahat amacınıza göre en uygun konaklama bölgesini seçin. Her bölge farklı deneyimler sunar.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {displayedNeighborhoods.map((neighborhood, idx) => (
                      <div 
                        key={idx} 
                        className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-display font-semibold text-lg">{neighborhood.name}</h3>
                          <Badge 
                            variant={neighborhood.priceLevel === 'lüks' ? 'default' : 'outline'}
                            className={
                              neighborhood.priceLevel === 'lüks' ? 'bg-amber-500 hover:bg-amber-600' : 
                              neighborhood.priceLevel === 'ekonomik' ? 'border-green-500 text-green-600' : ''
                            }
                          >
                            {neighborhood.priceLevel === 'lüks' ? '💎 Lüks' : 
                             neighborhood.priceLevel === 'ekonomik' ? '💰 Ekonomik' : '⭐ Orta'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{neighborhood.description}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {neighborhood.forWhom}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {neighborhoodData.neighborhoods.length > 4 && (
                    <Button 
                      variant="ghost" 
                      className="w-full" 
                      onClick={() => setShowAllNeighborhoods(!showAllNeighborhoods)}
                    >
                      {showAllNeighborhoods ? (
                        <>Daha Az Göster <ChevronUp className="ml-2 h-4 w-4" /></>
                      ) : (
                        <>Tüm Bölgeleri Gör ({neighborhoodData.neighborhoods.length}) <ChevronDown className="ml-2 h-4 w-4" /></>
                      )}
                    </Button>
                  )}
                  
                  {/* Transport & Safety Tips */}
                  <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                    <div className="flex gap-3">
                      <Bus className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Ulaşım İpucu</h4>
                        <p className="text-sm text-muted-foreground">{neighborhoodData.transportTip}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Güvenlik Notu</h4>
                        <p className="text-sm text-muted-foreground">{neighborhoodData.safetyNote}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
          
          {/* Hotel Search Widget */}
          <section className="mb-8">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-primary/5 via-background to-primary/10 p-8 text-center">
                  <Hotel className="h-16 w-16 mx-auto text-primary mb-4" />
                  <h2 className="text-xl md:text-2xl font-display font-bold mb-3">
                    {displayName} {t('hotels.findBestHotels', 'En İyi Otelleri Keşfet')}
                  </h2>
                  <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                    {t('hotels.compareHotelPrices', 'Binlerce oteli karşılaştır, en uygun fiyatı bul')}. 
                    Agoda {t('hotels.poweredSearch', 'destekli arama ile güvenilir fiyat karşılaştırması')}.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      className="gradient-primary hover:opacity-90 w-full sm:w-auto gap-2"
                      onClick={() => openAgodaUrl(citySlug, searchCity, checkIn, checkOut, { adults: guests.adults, rooms: guests.rooms })}
                    >
                      <Hotel className="h-5 w-5" />
                      {t('hotels.searchAllHotels', 'Tüm Otelleri Ara')}
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="w-full sm:w-auto gap-2"
                      onClick={() => openAgodaUrl(citySlug, searchCity, checkIn, checkOut, { adults: guests.adults, rooms: guests.rooms })}
                    >
                      <Star className="h-5 w-5 text-travel-gold" />
                      {t('hotels.luxuryHotels', '5 Yıldızlı Oteller')}
                    </Button>
                  </div>
                  
                  {/* Trust badges */}
                  <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">✓ {t('hotels.freeCancellation', 'Ücretsiz İptal')}</span>
                    <span className="flex items-center gap-1">✓ {t('hotels.bestPriceGuarantee', 'En İyi Fiyat Garantisi')}</span>
                    <span className="flex items-center gap-1">✓ {t('hotels.securePayment', 'Güvenli Ödeme')}</span>
                    <span className="flex items-center gap-1">✓ {t('hotels.support247', '7/24 Destek')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* Hotel Categories - Budget Based */}
          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-4">Bütçeye Göre {displayName} Otelleri</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'luxury', label: '5 Yıldızlı Lüks', color: 'from-amber-500 to-yellow-400', priceSort: undefined as 'asc' | undefined, priceRange: '150€+', stars: 5 },
                { id: 'premium', label: '4 Yıldızlı Premium', color: 'from-blue-500 to-cyan-400', priceSort: undefined as 'asc' | undefined, priceRange: '80-150€', stars: 4 },
                { id: 'comfort', label: '3 Yıldızlı Konfor', color: 'from-green-500 to-emerald-400', priceSort: undefined as 'asc' | undefined, priceRange: '50-80€', stars: 3 },
                { id: 'budget', label: 'Bütçe Dostu', color: 'from-purple-500 to-pink-400', priceSort: 'asc' as const, priceRange: '20-50€', stars: undefined },
              ].map((category) => (
                <button 
                  key={category.id}
                  onClick={() => openAgodaUrl(citySlug, searchCity, checkIn, checkOut, { stars: category.stars, priceSort: category.priceSort, adults: guests.adults, rooms: guests.rooms })}
                  className="group text-left"
                >
                  <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
                    <div className={`bg-gradient-to-br ${category.color} p-4 text-white`}>
                      <div className="flex items-center gap-1 mb-2">
                        {category.stars ? (
                          Array.from({ length: category.stars }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-white" />
                          ))
                        ) : (
                          <CreditCard className="h-5 w-5" />
                        )}
                      </div>
                      <h3 className="font-semibold">{category.label}</h3>
                      <p className="text-sm opacity-80">{category.priceRange}/gece</p>
                      <div className="flex items-center gap-1 mt-2 text-sm opacity-80 group-hover:opacity-100">
                        <span>{t('hotels.viewHotels', 'Otelleri Gör')}</span>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          </section>
          
          {/* Dynamic Weather & Currency Content */}
          <section className="mb-8">
            <CityHotelsDynamicContent
              cityName={city.name}
              cityNameEn={city.nameEn}
              currency={city.currency}
              countryCode={city.countryCode}
              bestTimeToVisit={city.bestTimeToVisit}
            />
          </section>
          
          {/* FAQ Section - SEO Critical */}
          <section className="card-modern p-6 mb-8">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              {displayName} Otelleri Sıkça Sorulan Sorular
            </h2>
            
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
          
          {/* SEO Content */}
          <section className="card-modern p-6 mb-6">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-4">{city.name} Otel Rehberi {currentYear}</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                {city.name}, {city.country}'nın en popüler destinasyonlarından biri olarak her yıl milyonlarca turisti ağırlamaktadır. {currentYear} yılı için güncel otel fiyatları ve konaklama seçenekleri sizi bekliyor.
              </p>
              
              <h3 className="text-xl font-display font-semibold text-foreground mt-6 mb-3">
                Konaklama İpuçları
              </h3>
              <ul className="space-y-2">
                <li>• Şehir merkezinde konaklamak ulaşım masraflarını azaltır</li>
                <li>• <strong>Erken rezervasyonla %20-30 tasarruf</strong> sağlayabilirsiniz</li>
                <li>• Kahvaltı dahil seçenekleri değerlendirin</li>
                <li>• Hafta içi konaklamalar genellikle daha uygun</li>
                <li>• <strong>30+ gün kalacaksanız:</strong> Airbnb veya coliving seçenekleri daha ekonomik</li>
              </ul>
              
              <h3 className="text-xl font-display font-semibold text-foreground mt-6 mb-3">
                Neden WooNomad ile Otel Aramalısınız?
              </h3>
              <ul className="space-y-2">
                <li>• Agoda üzerinden en güncel fiyat karşılaştırması</li>
                <li>• Ücretsiz iptal seçenekleri olan oteller</li>
                <li>• Gerçek misafir yorumları ve puanları</li>
                <li>• En iyi fiyat garantisi</li>
              </ul>
            </div>
          </section>
          
          {/* Klook Activities Widget */}
          <section className="mb-6">
            <KlookActivitiesWidget 
              citySlug={city.slug}
              cityName={city.name}
            />
          </section>
          
          {/* Related Links - Internal Linking */}
          <section className="grid md:grid-cols-3 gap-4">
            <Link to={`/sehir/${city.slug}`} className="card-modern p-6 group hover:border-primary/30">
              <h3 className="font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                🏙️ {city.name} Şehir Rehberi
              </h3>
              <p className="text-sm text-muted-foreground">Gezilecek yerler ve pratik bilgiler</p>
            </Link>
            <Link to={`/sehir/${city.slug}/nomad`} className="card-modern p-6 group hover:border-primary/30">
              <h3 className="font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                💻 {city.name} Dijital Göçebe Rehberi
              </h3>
              <p className="text-sm text-muted-foreground">Coworking, internet hızı ve yaşam maliyeti</p>
            </Link>
            <Link to={`/sehir/${city.slug}/ucuslar`} className="card-modern p-6 group hover:border-primary/30">
              <h3 className="font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                ✈️ {city.name} Uçak Bileti
              </h3>
              <p className="text-sm text-muted-foreground">En uygun uçuş fiyatlarını karşılaştırın</p>
            </Link>
          </section>
        </main>
        
        <Footer />

        <MobileBottomNav />
      </div>
    </>
  );
};

export default CityHotels;
