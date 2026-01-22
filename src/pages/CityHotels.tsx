import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Hotel, ExternalLink, Calendar, Users, MapPin, Star, Building, CreditCard } from 'lucide-react';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCityBySlug } from '@/lib/cities';
import { getCountryFlag } from '@/lib/destinations';
import { KlookActivitiesWidget } from '@/components/KlookActivitiesWidget';
import { useCityDisplay } from '@/hooks/useCityDisplay';
import { format, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

// Travelpayouts Partner ID for Booking.com
const TRAVELPAYOUTS_MARKER = "261144";

const CityHotels = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const city = slug ? getCityBySlug(slug) : null;
  const { displayName, displayCountry } = useCityDisplay(city);
  
  // Default dates
  const today = new Date();
  const checkIn = format(addDays(today, 7), 'yyyy-MM-dd');
  const checkOut = format(addDays(today, 9), 'yyyy-MM-dd');
  
  // Language for Booking.com
  const tpLanguage = i18n.language === 'tr' ? 'tr' : i18n.language === 'de' ? 'de' : i18n.language === 'fr' ? 'fr' : i18n.language === 'es' ? 'es' : 'en';
  
  // Generate Booking.com affiliate search URL via Travelpayouts
  const searchCity = city?.nameEn || city?.name || '';
  const bookingSearchUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(searchCity)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=2&no_rooms=1&aid=2311236&label=woonomad-${TRAVELPAYOUTS_MARKER}`;
  
  // Alternative: Agoda affiliate link
  const agodaSearchUrl = `https://www.agoda.com/search?city=${encodeURIComponent(searchCity)}&checkIn=${checkIn}&checkOut=${checkOut}&rooms=1&adults=2&cid=1844104`;
  
  if (!city) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">{t('cityNotFound', 'Şehir Bulunamadı')}</h1>
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${displayName} ${t('nav.hotels', 'Otelleri')}`,
    "description": `${displayName} ${t('hotels.hotelPricesAndBooking', 'otel fiyatları ve rezervasyon')}`,
    "numberOfItems": 50,
  };

  return (
    <>
      <Helmet>
        <title>{`${displayName} ${t('nav.hotels', 'Otelleri')} - ${t('hotels.bestPricesHotelBooking', 'En İyi Fiyatlarla Otel Rezervasyonu')} ${currentYear} | WooNomad`}</title>
        <meta 
          name="description" 
          content={`${displayName} ${t('hotels.hotelPricesOnlineBooking', 'otel fiyatları ve online rezervasyon')}. ${displayCountry}'da ${t('hotels.compareBestHotels', "en iyi otelleri karşılaştırın, uygun fiyatlarla rezervasyon yapın")}.`}
        />
        <link rel="canonical" href={`https://woonomad.co/sehir/${city.slug}/oteller`} />
        <meta property="og:title" content={`${displayName} ${t('nav.hotels', 'Otelleri')} | WooNomad`} />
        <meta property="og:description" content={`${displayName} ${t('hotels.hotelPricesAndBooking', 'otel fiyatları ve rezervasyon')}`} />
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
            
            <h1 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-3">
              {flag} {displayName} <span className="text-gradient">{t('nav.hotels', 'Otelleri')}</span>
            </h1>
            
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              {displayName} {t('hotels.compareHotelPricesFor', 'için en uygun otel fiyatlarını karşılaştırın')}
            </p>
            
            {/* Search Info */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(checkIn), 'd MMM', { locale: tr })} - {format(new Date(checkOut), 'd MMM', { locale: tr })}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
                <Users className="h-4 w-4" />
                <span>2 {t('hotels.adults', 'Yetişkin')}</span>
              </div>
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
                <MapPin className="h-4 w-4" />
                <span>{displayCountry}</span>
              </div>
            </div>
            
            {/* Main CTA */}
            <a 
              href={bookingSearchUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
            >
              <Button size="lg" className="gradient-primary hover:opacity-90 gap-2">
                <Hotel className="h-5 w-5" />
                {t('hotels.searchHotels', 'Otel Ara')}
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
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
              <CreditCard className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-primary">%30</div>
              <div className="text-sm text-muted-foreground">{t('hotels.savingsUpTo', 'Tasarruf')}</div>
            </Card>
            <Card className="text-center p-4">
              <Building className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-primary">1-5★</div>
              <div className="text-sm text-muted-foreground">{t('hotels.allCategories', 'Tüm Kategoriler')}</div>
            </Card>
          </section>
          
          {/* Hotel Search Widget */}
          <section className="mb-8">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-primary/5 via-background to-primary/10 p-8 text-center">
                  <Hotel className="h-16 w-16 mx-auto text-primary mb-4" />
                  <h2 className="text-2xl font-display font-bold mb-3">
                    {displayName} {t('hotels.findBestHotels', 'En İyi Otelleri Keşfet')}
                  </h2>
                  <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                    {t('hotels.compareHotelPrices', 'Binlerce oteli karşılaştır, en uygun fiyatı bul')}. 
                    Booking.com {t('hotels.poweredSearch', 'destekli arama ile güvenilir fiyat karşılaştırması')}.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                      href={bookingSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                    >
                      <Button size="lg" className="gradient-primary hover:opacity-90 w-full sm:w-auto gap-2">
                        <Hotel className="h-5 w-5" />
                        {t('hotels.searchAllHotels', 'Tüm Otelleri Ara')}
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                    <a 
                      href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(searchCity)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=2&no_rooms=1&aid=2311236&label=woonomad-${TRAVELPAYOUTS_MARKER}&nflt=class%3D5`}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                    >
                      <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                        <Star className="h-5 w-5 text-travel-gold" />
                        {t('hotels.luxuryHotels', '5 Yıldızlı Oteller')}
                      </Button>
                    </a>
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
          
          {/* Hotel Categories */}
          <section className="mb-8">
            <h2 className="text-xl font-display font-bold mb-4">{t('hotels.hotelsByCategory', 'Kategoriye Göre Oteller')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { stars: 5, filter: 'class%3D5', label: t('hotels.luxuryHotels', '5 Yıldızlı Lüks'), color: 'from-amber-500 to-yellow-400' },
                { stars: 4, filter: 'class%3D4', label: t('hotels.premiumHotels', '4 Yıldızlı Premium'), color: 'from-blue-500 to-cyan-400' },
                { stars: 3, filter: 'class%3D3', label: t('hotels.comfortHotels', '3 Yıldızlı Konfor'), color: 'from-green-500 to-emerald-400' },
                { stars: 0, filter: 'price%3DTRY-min-500-1', label: t('hotels.budgetHotels', 'Bütçe Dostu'), color: 'from-purple-500 to-pink-400' },
              ].map((category) => (
                <a 
                  key={category.stars}
                  href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(searchCity)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=2&no_rooms=1&aid=2311236&label=woonomad-${TRAVELPAYOUTS_MARKER}${category.filter ? `&nflt=${category.filter}` : ''}`}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="group"
                >
                  <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
                    <div className={`bg-gradient-to-br ${category.color} p-4 text-white`}>
                      <div className="flex items-center gap-1 mb-2">
                        {category.stars > 0 ? (
                          Array.from({ length: category.stars }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-white" />
                          ))
                        ) : (
                          <CreditCard className="h-5 w-5" />
                        )}
                      </div>
                      <h3 className="font-semibold">{category.label}</h3>
                      <div className="flex items-center gap-1 mt-2 text-sm opacity-80 group-hover:opacity-100">
                        <span>{t('hotels.viewHotels', 'Otelleri Gör')}</span>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </section>
          
          {/* SEO Content */}
          <section className="card-modern p-6 mb-6">
            <h2 className="text-xl font-display font-bold mb-4">{city.name} {t('hotels.hotelGuide', 'Otel Rehberi')}</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                {city.name}, {city.country} {t('hotels.hotelGuideIntro', "'nın en popüler destinasyonlarından biri olarak her yıl milyonlarca turisti ağırlamaktadır. Şehirde her bütçeye uygun konaklama seçenekleri bulunmaktadır.")}
              </p>
              
              <h3 className="text-xl font-display font-semibold text-foreground mt-6 mb-3">
                {t('hotels.accommodationTips', 'Konaklama İpuçları')}
              </h3>
              <ul className="space-y-2">
                <li>• {t('hotels.tip1', 'Şehir merkezinde konaklamak ulaşım masraflarını azaltır')}</li>
                <li>• {t('hotels.tip2', 'Erken rezervasyon ile %20-30 tasarruf sağlayabilirsiniz')}</li>
                <li>• {t('hotels.tip3', 'Kahvaltı dahil seçenekleri değerlendirin')}</li>
                <li>• {t('hotels.tip4', 'Hafta içi konaklamalar genellikle daha uygun')}</li>
                <li>• <strong>{t('hotels.tip5LongStay', '30+ gün kalacaksanız:')}</strong> {t('hotels.tip5Desc', 'Airbnb veya coliving seçenekleri daha ekonomik')}</li>
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
          
          {/* Related Links */}
          <section className="grid md:grid-cols-3 gap-4">
            <Link to={`/sehir/${city.slug}/aktiviteler`} className="card-modern p-6 group hover:border-primary/30">
              <h3 className="font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                🎯 {city.name} {t('activities.title', 'Aktiviteleri')}
              </h3>
              <p className="text-sm text-muted-foreground">{t('activities.toursAndExperiences', 'Turlar ve deneyimler')}</p>
            </Link>
            <Link to={`/sehir/${city.slug}/ucak-bileti`} className="card-modern p-6 group hover:border-primary/30">
              <h3 className="font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                ✈️ {city.name} {t('flights.flightTicket', 'Uçak Bileti')}
              </h3>
              <p className="text-sm text-muted-foreground">{t('flights.compareFlightPrices', 'En uygun uçuş fiyatlarını karşılaştırın')}</p>
            </Link>
            <Link to={`/sehir/${city.slug}`} className="card-modern p-6 group hover:border-primary/30">
              <h3 className="font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                🏙️ {city.name} {t('cities.about', 'Şehir Rehberi')}
              </h3>
              <p className="text-sm text-muted-foreground">{t('cities.highlights', 'Gezilecek yerler ve pratik bilgiler')}</p>
            </Link>
          </section>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-border py-8 mb-20 md:mb-0 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
            © {currentYear} WooNomad. {t('common.allRightsReserved', 'Tüm hakları saklıdır')}.
          </div>
        </footer>

        <MobileBottomNav />
      </div>
    </>
  );
};

export default CityHotels;
