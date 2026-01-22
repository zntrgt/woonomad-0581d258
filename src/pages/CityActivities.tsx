import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  ExternalLink, 
  Camera, 
  Utensils, 
  Mountain, 
  Waves, 
  Building2, 
  Music, 
  Ship, 
  Bike, 
  Coffee, 
  Ticket, 
  Star, 
  ChevronRight,
  Hotel,
  Plane
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getCityBySlug } from '@/lib/cities';
import { getCountryFlag } from '@/lib/destinations';
import { useKlookActivities } from '@/hooks/useKlookActivities';
import { useCityDisplay } from '@/hooks/useCityDisplay';
import { useTranslation } from 'react-i18next';

// Activity category icons
const categoryIcons: Record<string, typeof Compass> = {
  'tours': MapPin,
  'attractions': Ticket,
  'food-experiences': Utensils,
  'day-trips': Camera,
  'museums': Building2,
  'outdoor-activities': Mountain,
  'water-sports': Waves,
  'boat-tours': Ship,
  'nightlife': Music,
  'canal-cruises': Ship,
  'bike-tours': Bike,
  'history': Building2,
  'concerts': Music,
  'theme-parks': Ticket,
  'temples': Building2,
  'markets': Coffee,
};

// Sample popular activities for cities
const getCityActivities = (citySlug: string) => {
  const activities: Record<string, { title: string; description: string; category: string }[]> = {
    'antalya': [
      { title: 'Düden Şelalesi Turu', description: 'Antalya\'nın ünlü şelalesini keşfedin', category: 'attractions' },
      { title: 'Kaleiçi Yürüyüş Turu', description: 'Tarihi merkezde rehberli tur', category: 'tours' },
      { title: 'Tekne Turu & Yüzme', description: 'Akdeniz\'de günlük tekne gezisi', category: 'boat-tours' },
      { title: 'Rafting Macerası', description: 'Köprülü Kanyon\'da rafting deneyimi', category: 'outdoor-activities' },
      { title: 'Antik Kent Gezisi', description: 'Perge, Aspendos, Side turları', category: 'day-trips' },
      { title: 'Türk Gecesi & Yemek', description: 'Geleneksel yemek ve dans gösterisi', category: 'food-experiences' },
    ],
    'istanbul': [
      { title: 'Boğaz Turu', description: 'Boğaz\'ın iki yakasını keşfedin', category: 'boat-tours' },
      { title: 'Ayasofya & Sultanahmet', description: 'Tarihi yarımada rehberli tur', category: 'attractions' },
      { title: 'Sokak Yemekleri Turu', description: 'Lezzetli street food deneyimi', category: 'food-experiences' },
      { title: 'Prens Adaları Gezisi', description: 'Heybeliada & Büyükada günübirlik tur', category: 'day-trips' },
      { title: 'Hamam Deneyimi', description: 'Geleneksel Türk hamamı', category: 'tours' },
      { title: 'Çatı Barları Turu', description: 'İstanbul\'un en iyi rooftop mekanları', category: 'nightlife' },
    ],
    'paris': [
      { title: 'Eyfel Kulesi Skip-the-Line', description: 'Kuyruksuz Eyfel Kulesi bileti', category: 'attractions' },
      { title: 'Louvre Müzesi Turu', description: 'Rehberli müze deneyimi', category: 'museums' },
      { title: 'Seine Nehri Gezisi', description: 'Romantik tekne turu', category: 'boat-tours' },
      { title: 'Montmartre Yürüyüş Turu', description: 'Sanatçılar mahallesi keşfi', category: 'tours' },
      { title: 'Şarap & Peynir Tadımı', description: 'Fransız gastronomi deneyimi', category: 'food-experiences' },
      { title: 'Versay Sarayı Gezisi', description: 'Günübirlik saray turu', category: 'day-trips' },
    ],
  };
  return activities[citySlug] || [];
};

export default function CityActivities() {
  const { slug } = useParams<{ slug: string }>();
  const city = getCityBySlug(slug || '');
  const { data: klookData, isLoading } = useKlookActivities(slug);
  const { displayName } = useCityDisplay(city);
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  if (!city) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">{t('cityActivities.cityNotFound', 'Şehir Bulunamadı')}</h1>
          <Link to="/sehirler" className="text-primary hover:underline">{t('cityActivities.browseCities', 'Tüm Şehirlere Gözat')}</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const flag = getCountryFlag(city.countryCode);
  const popularActivities = getCityActivities(city.slug);
  
  const breadcrumbItems = [
    { label: t('nav.home', 'Ana Sayfa'), href: '/' },
    { label: t('nav.cities', 'Şehirler'), href: '/sehirler' },
    { label: displayName, href: `/sehir/${city.slug}` },
    { label: t('cityActivities.activities', 'Aktiviteler') }
  ];

  // SEO
  const seoTitle = t('cityActivities.seoTitle', '{{city}} Aktiviteleri & Turları {{year}} | En Popüler Deneyimler', { city: displayName, year: currentYear });
  const seoDescription = t('cityActivities.seoDescription', '{{city}} için en popüler turlar, aktiviteler ve deneyimler. Şehir turları, tekne gezileri, yemek turları ve daha fazlası.', { city: displayName });
  const canonicalUrl = `https://woonomad.co/sehir/${city.slug}/aktiviteler`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      <main className="pt-20 pb-24 md:pb-8">
        <div className="container">
          <Breadcrumb items={breadcrumbItems} />

          {/* Hero Section */}
          <section className="mb-8">
            <div className="relative h-[250px] md:h-[300px] rounded-2xl overflow-hidden mb-6">
              <img
                src={city.image}
                alt={displayName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                  <span className="text-xl">{flag}</span>
                  <span>{city.country}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                  {t('cityActivities.pageTitle', '{{city}} Aktiviteleri & Turları', { city: displayName })}
                </h1>
                <p className="text-white/80 mt-2">
                  {t('cityActivities.pageSubtitle', 'En popüler deneyimler ve turlar')}
                </p>
              </div>
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Klook Categories */}
              {isLoading ? (
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent className="grid sm:grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map(i => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </CardContent>
                </Card>
              ) : klookData?.supported && klookData.activities ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Compass className="h-5 w-5 text-primary" />
                      {t('cityActivities.exploreCategories', 'Kategorilere Göre Keşfet')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid sm:grid-cols-2 gap-3">
                    {klookData.activities.map((activity) => {
                      const Icon = categoryIcons[activity.id] || Compass;
                      return (
                        <a
                          key={activity.id}
                          href={activity.link}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group border border-transparent hover:border-primary/20"
                        >
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                            <span className="text-2xl">{activity.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium group-hover:text-primary transition-colors">{activity.label}</p>
                            <p className="text-xs text-muted-foreground">{t('cityActivities.viewAllIn', '{{city}} için tümünü gör', { city: displayName })}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                        </a>
                      );
                    })}
                  </CardContent>
                </Card>
              ) : null}

              {/* Popular Activities */}
              {popularActivities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-warning" />
                      {t('cityActivities.popularActivities', 'Popüler Aktiviteler')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {popularActivities.map((activity, index) => {
                      const Icon = categoryIcons[activity.category] || Compass;
                      const klookLink = klookData?.cityLink || `https://www.klook.com/search/result/?keyword=${encodeURIComponent(displayName + ' ' + activity.title)}`;
                      return (
                        <a
                          key={index}
                          href={klookLink}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium group-hover:text-primary transition-colors">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </div>
                          <Badge variant="secondary" className="flex-shrink-0 text-xs">
                            {t('common.view', 'Görüntüle')}
                          </Badge>
                        </a>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* About Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('cityActivities.aboutTitle', '{{city}} Hakkında Aktiviteler', { city: displayName })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-lg max-w-none text-muted-foreground">
                  <p>
                    {t('cityActivities.aboutText', '{{city}}, ziyaretçilere sunduğu çeşitli aktiviteler ve deneyimlerle ünlüdür. Şehir turlarından tekne gezilerine, yemek deneyimlerinden macera sporlarına kadar her zevke uygun seçenekler bulunmaktadır.', { city: displayName })}
                  </p>
                  <h3 className="text-lg font-display font-semibold text-foreground mt-4 mb-2">
                    {t('cityActivities.tipsTitle', 'Aktivite İpuçları')}
                  </h3>
                  <ul className="space-y-2 list-none pl-0">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {t('cityActivities.tip1', 'Popüler turistik yerlere erken saatlerde gidin')}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {t('cityActivities.tip2', 'Online rezervasyon yaparak kuyrukları atlayın')}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {t('cityActivities.tip3', 'Yerel rehberli turları tercih edin')}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {t('cityActivities.tip4', 'Grup turlarında indirimlerden yararlanın')}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Links */}
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-lg">{t('cityActivities.quickLinks', 'Hızlı Linkler')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link
                    to={`/sehir/${city.slug}/oteller`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <Hotel className="h-5 w-5 text-primary" />
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {t('cityActivities.findHotels', '{{city}} Otelleri', { city: displayName })}
                    </span>
                    <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                  </Link>
                  <Link
                    to={`/sehir/${city.slug}/ucak-bileti`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <Plane className="h-5 w-5 text-primary" />
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {t('cityActivities.findFlights', '{{city}} Uçuşları', { city: displayName })}
                    </span>
                    <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                  </Link>
                  <Link
                    to={`/sehir/${city.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {t('cityActivities.cityGuide', '{{city}} Rehberi', { city: displayName })}
                    </span>
                    <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                  </Link>
                </CardContent>
              </Card>

              {/* All Activities CTA */}
              {klookData?.cityLink && (
                <Card className="gradient-hero text-white border-0">
                  <CardContent className="p-6 text-center">
                    <Compass className="h-10 w-10 mx-auto mb-3 opacity-90" />
                    <h3 className="text-xl font-display font-bold mb-2">
                      {t('cityActivities.discoverAll', 'Tüm Aktiviteleri Keşfet')}
                    </h3>
                    <p className="text-white/80 text-sm mb-4">
                      {t('cityActivities.discoverAllDesc', '{{city}} için yüzlerce aktivite ve tur seçeneği', { city: displayName })}
                    </p>
                    <Button asChild variant="secondary" className="w-full">
                      <a
                        href={klookData.cityLink}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                      >
                        Klook'ta Gör
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
