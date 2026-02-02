import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Hotel, Star, ArrowRight, MapPin, ExternalLink } from 'lucide-react';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TravelpayoutsHotelWidget } from '@/components/widgets';
import { getAllCities } from '@/lib/cities';
import { getCountryFlag } from '@/lib/destinations';
import { getAgodaUrl } from '@/lib/agodaMapping';

const Hotels = () => {
  const cities = getAllCities();
  const currentYear = new Date().getFullYear();

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Oteller' }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Popüler Şehirlerde Oteller",
    "description": "Dünyanın popüler şehirlerinde en uygun otel fiyatları",
    "numberOfItems": cities.length,
    "itemListElement": cities.map((city, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "LodgingBusiness",
        "name": `${city.name} Otelleri`,
        "url": `https://woonomad.co/sehir/${city.slug}/oteller`
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>{`Popüler Şehirlerde Oteller ${currentYear} | En Uygun Fiyatlarla Otel Rezervasyonu`}</title>
        <meta 
          name="description" 
          content="Berlin, Paris, Londra, Dubai ve daha birçok popüler şehirde en uygun otel fiyatları. Otel karşılaştırma ve online rezervasyon."
        />
        <meta name="keywords" content="otel, otel rezervasyon, ucuz otel, şehir otelleri, konaklama, hotel booking" />
        <link rel="canonical" href="https://woonomad.co/oteller" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="py-8 md:py-10 gradient-hero text-white">
          <div className="container">
            <Breadcrumb items={breadcrumbItems} className="text-white/70 mb-4" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Hotel className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold">
                  Popüler Şehirlerde Oteller
                </h1>
                <p className="text-lg text-white/80 mt-2">
                  En uygun fiyatlarla otel rezervasyonu yapın
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Hotel Search Widget */}
        <section className="py-6 md:py-8">
          <div className="container max-w-4xl">
            <TravelpayoutsHotelWidget subId="hotels-page" />
          </div>
        </section>

        {/* City Hotels Grid */}
        <section className="py-6 md:py-8">
          <div className="container">
            <h2 className="text-2xl font-display font-bold mb-6">Tüm Şehirler</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cities.map((city) => {
                const flag = getCountryFlag(city.countryCode);
                const agodaUrl = getAgodaUrl(city.slug, city.nameEn || city.name);
                
                return (
                  <Card key={city.slug} variant="interactive" className="group overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={city.image} 
                        alt={`${city.name} otelleri`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-white/90 text-foreground shadow-sm">
                          <Hotel className="w-3 h-3 mr-1" />
                          Oteller
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center gap-2 text-white">
                          <span className="text-2xl">{flag}</span>
                          <div>
                            <h3 className="font-display font-bold text-lg">{city.name}</h3>
                            <p className="text-white/80 text-sm">{city.country}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{city.highlights?.slice(0, 2).join(', ') || city.country}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link to={`/sehir/${city.slug}/oteller`} className="flex-1">
                          <Button variant="outline" className="w-full gap-2 group-hover:border-primary/30 transition-colors">
                            Detaylar
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </Button>
                        </Link>
                        <a href={agodaUrl} target="_blank" rel="noopener noreferrer sponsored">
                          <Button className="gradient-primary gap-2 shadow-md hover:shadow-lg transition-shadow">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-6 md:py-8 section-routes">
          <div className="container">
            <Card variant="elevated">
              <CardContent className="p-6">
                <h2 className="text-xl font-display font-bold mb-3">
                  Otel Rezervasyonu Hakkında
                </h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p>
                    WooNomad, dünyanın en popüler seyahat destinasyonlarında en uygun otel 
                    fiyatlarını bulmanızı sağlar. Berlin, Paris, Londra, Dubai gibi şehirlerde 
                    binlerce otel seçeneğini karşılaştırabilirsiniz.
                  </p>
                  <h3 className="text-xl font-display font-semibold text-foreground mt-6 mb-3">
                    Otel Rezervasyonu İpuçları
                  </h3>
                  <ul className="space-y-2">
                    <li>• Erken rezervasyon ile %20-30 tasarruf sağlayabilirsiniz</li>
                    <li>• Hafta içi konaklamalar genellikle daha uygun fiyatlıdır</li>
                    <li>• Şehir merkezine yakın oteller ulaşım masraflarını azaltır</li>
                    <li>• Kahvaltı dahil seçenekleri değerlendirin</li>
                    <li>• Kullanıcı yorumlarını mutlaka okuyun</li>
                  </ul>
                  <p className="mt-4">
                    Her şehir sayfasında detaylı otel bilgileri, fiyat karşılaştırması ve 
                    doğrudan rezervasyon seçenekleri bulabilirsiniz.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 mb-20 md:mb-0 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
            © {currentYear} WooNomad. Tüm hakları saklıdır.
          </div>
        </footer>

        <MobileBottomNav />
      </div>
    </>
  );
};

export default Hotels;