import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Hotel, Star, MapPin, Check, ArrowRight, Plane } from 'lucide-react';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getHotelBySlug, getRelatedHotels } from '@/lib/hotels';
import { getCityBySlug } from '@/lib/cities';
import { getCountryFlag } from '@/lib/destinations';

const HotelDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const hotel = slug ? getHotelBySlug(slug) : null;
  const city = hotel ? getCityBySlug(hotel.citySlug) : null;
  const relatedHotels = hotel ? getRelatedHotels(hotel.slug, hotel.citySlug) : [];

  if (!hotel || !city) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Otel Bulunamadı</h1>
          <Link to="/oteller" className="text-primary hover:underline">Tüm Otellere Gözat</Link>
        </div>
      </div>
    );
  }

  const flag = getCountryFlag(city.countryCode);
  const currentYear = new Date().getFullYear();

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: city.name, href: `/sehir/${city.slug}` },
    { label: 'Oteller', href: `/sehir/${city.slug}/oteller` },
    { label: hotel.name }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": hotel.name,
    "description": hotel.summary,
    "address": { "@type": "PostalAddress", "addressLocality": city.name, "addressCountry": city.country },
    "starRating": { "@type": "Rating", "ratingValue": hotel.stars },
    ...(hotel.rating && { "aggregateRating": { "@type": "AggregateRating", "ratingValue": hotel.rating, "reviewCount": hotel.reviewCount } }),
    ...(hotel.priceRange && { "priceRange": `${hotel.priceRange.min} - ${hotel.priceRange.max} ${hotel.priceRange.currency}` }),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${hotel.name} | ${city.name} Otel - WooNomad`}</title>
        <meta name="description" content={`${hotel.name} - ${city.name} ${hotel.stars} yıldızlı otel. ${hotel.summary}`} />
        <link rel="canonical" href={`https://woonomad.co/otel/${hotel.slug}`} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header />

      <main className="container py-6">
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <section className="mt-4 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="flex">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            {hotel.rating && (
              <Badge variant="secondary">{hotel.rating} ({hotel.reviewCount} yorum)</Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{hotel.name}</h1>
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {hotel.neighborhood && `${hotel.neighborhood}, `}{city.name}, {city.country}
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="aspect-video rounded-xl overflow-hidden bg-muted">
              <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
            </div>

            {/* Summary */}
            <Card variant="elevated">
              <CardContent className="p-6">
                <h2 className="text-xl md:text-2xl font-display font-bold mb-3">Otel Hakkında</h2>
                <p className="text-muted-foreground">{hotel.summary}</p>
              </CardContent>
            </Card>

            {/* Reasons to Choose */}
            <Card variant="elevated">
              <CardContent className="p-6">
                <h2 className="text-xl md:text-2xl font-display font-bold mb-4">Bu Oteli Seçmek İçin 3 Neden</h2>
                <div className="space-y-3">
                  {hotel.reasonsToChoose.map((reason, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm">{reason}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suitable For */}
            <Card variant="elevated">
              <CardContent className="p-6">
                <h2 className="text-xl md:text-2xl font-display font-bold mb-3">Kimler İçin Uygun?</h2>
                <div className="flex flex-wrap gap-2">
                  {hotel.suitableFor.map(type => (
                    <Badge key={type} variant="secondary">{type}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card variant="elevated">
              <CardContent className="p-6">
                <h2 className="text-xl md:text-2xl font-display font-bold mb-3">Olanaklar</h2>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map(amenity => (
                    <Badge key={amenity} variant="outline">{amenity}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Price Card */}
            <Card className="gradient-hero text-white border-0">
              <CardContent className="p-6 text-center">
                {hotel.priceRange ? (
                  <>
                    <p className="text-white/80 text-sm mb-1">Fiyatlar</p>
                    <p className="text-2xl font-bold mb-1">
                      {hotel.priceRange.min.toLocaleString('tr-TR')}₺
                    </p>
                    <p className="text-white/80 text-xs mb-4">gecelik başlangıç fiyatı</p>
                  </>
                ) : (
                  <p className="text-white/80 text-sm mb-4">Fiyatlar tarih seçimine göre değişir</p>
                )}
                <Button asChild variant="secondary" className="w-full">
                  <Link to={`/sehir/${city.slug}/oteller`}>
                    Fiyat Karşılaştır
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Related CTAs */}
            <Card variant="elevated">
              <CardContent className="p-4 space-y-3">
                <Link to={`/sehir/${city.slug}/oteller`} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{city.name} Otelleri</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>
                <Link to={`/sehir/${city.slug}/ucuslar`} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{city.name} Uçuşları</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>

            {/* Related Hotels */}
            {relatedHotels.length > 0 && (
              <Card variant="elevated">
                <CardContent className="p-4">
                  <h3 className="font-bold mb-3">Benzer Oteller</h3>
                  <div className="space-y-2">
                    {relatedHotels.map(h => (
                      <Link key={h.slug} to={`/otel/${h.slug}`} className="block p-2 hover:bg-muted rounded-lg transition-colors">
                        <p className="font-medium text-sm">{h.name}</p>
                        <p className="text-xs text-muted-foreground">{h.stars} yıldız</p>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8 mb-20 md:mb-0 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          © {currentYear} WooNomad. Tüm hakları saklıdır.
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
};

export default HotelDetail;
