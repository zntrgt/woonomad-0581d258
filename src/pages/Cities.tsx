import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAllCities } from '@/lib/cities';
import { getCountryFlag } from '@/lib/destinations';

// Import local city images for better reliability
import antalyaImg from '@/assets/cities/antalya.jpg';
import izmirImg from '@/assets/cities/izmir.jpg';
import bodrumImg from '@/assets/cities/bodrum.jpg';
import athensImg from '@/assets/cities/athens.jpg';
import tbilisiImg from '@/assets/cities/tbilisi.jpg';
import skopjeImg from '@/assets/cities/skopje.jpg';
import parisImg from '@/assets/cities/paris.jpg';
import romeImg from '@/assets/cities/rome.jpg';
import barcelonaImg from '@/assets/cities/barcelona.jpg';
import florenceImg from '@/assets/cities/florence.jpg';

// Local image mapping with fallback to remote URL
const localCityImages: Record<string, string> = {
  'antalya': antalyaImg,
  'izmir': izmirImg,
  'bodrum': bodrumImg,
  'atina': athensImg,
  'tiflis': tbilisiImg,
  'uskup': skopjeImg,
  'paris': parisImg,
  'roma': romeImg,
  'barcelona': barcelonaImg,
  'floransa': florenceImg,
};

const getCityImage = (citySlug: string, remoteUrl: string): string => {
  return localCityImages[citySlug] || remoteUrl;
};

const Cities = () => {
  const cities = getAllCities();
  const currentYear = new Date().getFullYear();

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Şehirler' }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Popüler Seyahat Şehirleri",
    "numberOfItems": cities.length,
    "itemListElement": cities.map((city, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "City",
        "name": city.name,
        "url": `https://woonomad.com/sehir/${city.slug}`
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`Popüler Seyahat Şehirleri ${currentYear} | Uçak Bileti ve Otel`}</title>
        <meta 
          name="description" 
          content={`Dünyanın en popüler seyahat şehirleri. Berlin, Paris, Londra, Dubai ve daha fazlası. Uçak bileti, otel ve gezi rehberleri.`}
        />
        <link rel="canonical" href="https://woonomad.com/sehirler" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="py-6 md:py-8 gradient-hero text-white">
        <div className="container">
          <Breadcrumb items={breadcrumbItems} className="text-white/70 mb-4" />
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Popüler Seyahat Şehirleri
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Dünyanın en çok ziyaret edilen şehirlerine uçak bileti ve otel seçeneklerini keşfedin. 
            Her şehir için uçuş rotaları ve konaklama tavsiyeleri.
          </p>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="py-6 md:py-8">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cities.map((city) => {
              const flag = getCountryFlag(city.countryCode);
              return (
                <Link key={city.slug} to={`/sehir/${city.slug}`}>
                  <Card variant="elevated" className="h-full group cursor-pointer overflow-hidden">
                    <div className="card-image-hover aspect-[4/3]">
                      <img 
                        src={getCityImage(city.slug, city.image)} 
                        alt={`${city.name} şehir manzarası`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{flag}</span>
                        <div>
                          <h3 className="font-display font-bold text-lg group-hover:text-primary transition-colors">
                            {city.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{city.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex flex-wrap gap-1">
                          {city.airportCodes.slice(0, 2).map(code => (
                            <Badge key={code} variant="secondary" className="text-xs">
                              {code}
                            </Badge>
                          ))}
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-6 section-routes">
        <div className="container">
          <Card variant="elevated">
            <CardContent className="p-6">
              <h2 className="text-xl font-display font-bold mb-3">
                Dünya Şehirlerine Seyahat
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  WooNomad, dünyanın en popüler seyahat destinasyonlarına ulaşmanızı kolaylaştırır. 
                  Avrupa'nın tarihi şehirleri Paris, Londra, Berlin ve Roma'dan, Asya'nın modern 
                  metropolleri Tokyo, Singapur ve Bangkok'a kadar geniş bir yelpazede seyahat 
                  seçenekleri sunuyoruz.
                </p>
                <p>
                  Her şehir sayfasında detaylı uçuş bilgileri, havalimanı rehberi, otel tavsiyeleri 
                  ve gezilecek yerler hakkında kapsamlı bilgiler bulabilirsiniz. İster iş seyahati 
                  ister tatil planlıyor olun, ihtiyacınız olan tüm bilgiler tek bir yerde.
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
  );
};

export default Cities;
