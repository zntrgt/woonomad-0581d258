import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, MapPin, Calendar, Users, Baby, Laptop, Filter, Globe } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllCities, CityInfo } from '@/lib/cities';
import { getCountryFlag } from '@/lib/destinations';
import { nomadMetrics } from '@/lib/nomad';
import { cityGeoData } from '@/lib/cityGeoData';

// Segment definitions
const segments = [
  { key: 'all', label: 'Tümü', icon: Globe },
  { key: 'solo', label: 'Solo', icon: Users },
  { key: 'family', label: 'Aile', icon: Baby },
  { key: 'nomad', label: 'Nomad', icon: Laptop },
] as const;

type SegmentKey = typeof segments[number]['key'];

// Region definitions
const regionMap: Record<string, string> = {
  'TR': 'Türkiye',
  'DE': 'Avrupa', 'FR': 'Avrupa', 'GB': 'Avrupa', 'NL': 'Avrupa', 'ES': 'Avrupa',
  'IT': 'Avrupa', 'PT': 'Avrupa', 'GR': 'Avrupa', 'CZ': 'Avrupa', 'AT': 'Avrupa',
  'HU': 'Avrupa', 'DK': 'Avrupa', 'SE': 'Avrupa', 'RS': 'Avrupa', 'BA': 'Avrupa',
  'MK': 'Avrupa', 'GE': 'Avrupa', 'AZ': 'Avrupa',
  'AE': 'Ortadoğu', 'JO': 'Ortadoğu',
  'JP': 'Asya', 'TH': 'Asya', 'ID': 'Asya', 'SG': 'Asya', 'KR': 'Asya',
  'US': 'Amerika',
  'ZA': 'Afrika',
};

// Budget display from GEO data
const getBudgetDisplay = (slug: string): string | null => {
  const geo = cityGeoData[slug];
  if (!geo?.costs) return null;
  const total = geo.costs.find(c => c.item.startsWith('TOPLAM'));
  return total?.budget || null;
};

const Cities = () => {
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState<SegmentKey>('all');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const allCities = getAllCities();
  const currentYear = new Date().getFullYear();

  // Get unique regions
  const regions = useMemo(() => {
    const regionSet = new Set(allCities.map(c => regionMap[c.countryCode] || 'Diğer'));
    return Array.from(regionSet).sort();
  }, [allCities]);

  // Filter and sort cities
  const filteredCities = useMemo(() => {
    let cities = [...allCities];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      cities = cities.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q)
      );
    }

    // Region filter
    if (selectedRegion) {
      cities = cities.filter(c => (regionMap[c.countryCode] || 'Diğer') === selectedRegion);
    }

    // Segment sort (nomad cities with data first)
    if (segment === 'nomad') {
      cities.sort((a, b) => {
        const aN = nomadMetrics[a.slug] ? 1 : 0;
        const bN = nomadMetrics[b.slug] ? 1 : 0;
        return bN - aN;
      });
    }

    return cities;
  }, [allCities, search, segment, selectedRegion]);

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Şehirler' }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Popüler Seyahat Şehirleri",
    "numberOfItems": filteredCities.length,
    "itemListElement": filteredCities.slice(0, 20).map((city, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "City",
        "name": city.name,
        "url": `https://woonomad.co/sehir/${city.slug}`
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`Seyahat Şehirleri ${currentYear} — Destinasyon Rehberi | WooNomad`}</title>
        <meta
          name="description"
          content={`${currentYear} için en popüler seyahat şehirleri. Solo, aile ve dijital göçebe gezginler için rehberler, bütçe bilgileri ve konaklama önerileri.`}
        />
        <link rel="canonical" href="https://woonomad.co/sehirler" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header />

      {/* Hero */}
      <section className="py-8 md:py-12 gradient-hero text-white">
        <div className="container">
          <Breadcrumb items={breadcrumbItems} className="text-white/70 mb-4" />
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Seyahat Şehirleri
          </h1>
          <p className="text-base text-white/80 max-w-2xl mb-6">
            Solo, aile veya dijital göçebe — seyahat tipine göre filtrelenmiş şehir rehberleri, 
            bütçe bilgileri ve konaklama önerileri.
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              type="text"
              placeholder="Şehir veya ülke ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-background sticky top-[57px] z-30">
        <div className="container py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {/* Segment Filters */}
            {segments.map((seg) => (
              <Button
                key={seg.key}
                variant={segment === seg.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSegment(seg.key)}
                className="gap-1.5 flex-shrink-0"
              >
                <seg.icon className="h-3.5 w-3.5" />
                {seg.label}
              </Button>
            ))}

            <div className="w-px h-6 bg-border mx-1 flex-shrink-0" />

            {/* Region Filters */}
            {regions.map((region) => (
              <Button
                key={region}
                variant={selectedRegion === region ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
                className="flex-shrink-0 text-xs"
              >
                {region}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="py-4">
        <div className="container">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredCities.length} şehir
              {segment !== 'all' && ` · ${segments.find(s => s.key === segment)?.label}`}
              {selectedRegion && ` · ${selectedRegion}`}
            </p>
            {segment !== 'all' && (
              <Link
                to={segment === 'solo' ? '/solo-seyahat' : segment === 'family' ? '/aile-seyahati' : '/dijital-gocebe'}
                className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
              >
                {segments.find(s => s.key === segment)?.label} Rehberi <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="pb-8">
        <div className="container">
          {filteredCities.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aramanızla eşleşen şehir bulunamadı.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => { setSearch(''); setSelectedRegion(null); }}>
                Filtreleri Temizle
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCities.map((city) => {
                const flag = getCountryFlag(city.countryCode);
                const nomad = nomadMetrics[city.slug];
                const budget = getBudgetDisplay(city.slug);
                const geo = cityGeoData[city.slug];

                return (
                  <Link key={city.slug} to={`/sehir/${city.slug}`}>
                    <Card variant="interactive" className="h-full group overflow-hidden">
                      {/* Image */}
                      <div className="aspect-[16/9] overflow-hidden relative">
                        <img
                          src={city.image}
                          alt={`${city.name}, ${city.country}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                        {/* Budget badge */}
                        {budget && (
                          <div className="absolute bottom-3 left-3">
                            <Badge className="bg-black/60 text-white border-0 backdrop-blur-sm text-xs">
                              {budget}/gün
                            </Badge>
                          </div>
                        )}

                        {/* Best time badge */}
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="bg-white/90 text-foreground backdrop-blur-sm text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {city.bestTimeToVisit.split(',')[0]}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{flag}</span>
                            <div>
                              <h3 className="font-display font-bold text-base group-hover:text-primary transition-colors">
                                {city.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">{city.country}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                        </div>

                        {/* Quick Info */}
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {geo?.quickAnswer || city.description.slice(0, 100) + '...'}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {city.airportCodes.slice(0, 2).map(code => (
                            <Badge key={code} variant="outline" className="text-[10px] px-1.5 py-0">
                              ✈ {code}
                            </Badge>
                          ))}
                          {nomad && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-violet-300 text-violet-600">
                              💻 Nomad
                            </Badge>
                          )}
                          {geo && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-300 text-emerald-600">
                              📋 Rehber
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Segment CTA Cards */}
      <section className="py-8 bg-muted/30">
        <div className="container">
          <h2 className="text-xl font-display font-bold mb-4">Gezgin Tipine Göre Keşfet</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/solo-seyahat" className="group">
              <Card className="h-full hover:border-emerald-500/30 transition-all">
                <CardContent className="p-5">
                  <Users className="h-6 w-6 text-emerald-600 mb-3" />
                  <h3 className="font-display font-semibold mb-1">Solo Seyahat</h3>
                  <p className="text-sm text-muted-foreground">Güvenlik skorları, hostel önerileri ve solo ipuçları.</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/aile-seyahati" className="group">
              <Card className="h-full hover:border-amber-500/30 transition-all">
                <CardContent className="p-5">
                  <Baby className="h-6 w-6 text-amber-600 mb-3" />
                  <h3 className="font-display font-semibold mb-1">Aile Seyahati</h3>
                  <p className="text-sm text-muted-foreground">Çocuk dostu aktiviteler ve esnek iptal seçenekleri.</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/dijital-gocebe" className="group">
              <Card className="h-full hover:border-violet-500/30 transition-all">
                <CardContent className="p-5">
                  <Laptop className="h-6 w-6 text-violet-600 mb-3" />
                  <h3 className="font-display font-semibold mb-1">Dijital Göçebe</h3>
                  <p className="text-sm text-muted-foreground">Coworking, Wi-Fi, nomad vizeleri ve yaşam maliyeti.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Cities;
