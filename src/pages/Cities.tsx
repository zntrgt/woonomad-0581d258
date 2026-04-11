import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, MapPin, Calendar, Users, Baby, Laptop, Globe, Star, Wifi, Wallet } from 'lucide-react';
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

const segments = [
  { key: 'all', label: 'Tümü', icon: Globe },
  { key: 'solo', label: 'Solo', icon: Users },
  { key: 'family', label: 'Aile', icon: Baby },
  { key: 'nomad', label: 'Nomad', icon: Laptop },
] as const;

type SegmentKey = typeof segments[number]['key'];

const regionMap: Record<string, string> = {
  'TR': 'Türkiye',
  'DE': 'Avrupa', 'FR': 'Avrupa', 'GB': 'Avrupa', 'NL': 'Avrupa', 'ES': 'Avrupa',
  'IT': 'Avrupa', 'PT': 'Avrupa', 'GR': 'Avrupa', 'CZ': 'Avrupa', 'AT': 'Avrupa',
  'HU': 'Avrupa', 'DK': 'Avrupa', 'SE': 'Avrupa', 'RS': 'Avrupa', 'BA': 'Avrupa',
  'MK': 'Avrupa', 'GE': 'Avrupa', 'AZ': 'Avrupa',
  'AE': 'Ortadoğu', 'JO': 'Ortadoğu',
  'JP': 'Asya', 'TH': 'Asya', 'ID': 'Asya', 'SG': 'Asya', 'KR': 'Asya',
  'US': 'Amerika', 'MA': 'Afrika', 'ZA': 'Afrika', 'TZ': 'Afrika',
};

const getBudgetDisplay = (slug: string): string | null => {
  const geo = cityGeoData[slug];
  if (!geo?.costs) return null;
  const total = geo.costs.find(c => c.item.startsWith('TOPLAM'));
  return total?.budget || null;
};

// Editör seçimi: öne çıkan şehirler
const editorPicks = ['lizbon', 'istanbul', 'bali', 'tokyo', 'tiflis', 'budapeste'];

const Cities = () => {
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState<SegmentKey>('all');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const allCities = getAllCities();
  const currentYear = new Date().getFullYear();

  const regions = useMemo(() => {
    const regionSet = new Set(allCities.map(c => regionMap[c.countryCode] || 'Diğer'));
    return Array.from(regionSet).sort();
  }, [allCities]);

  const filteredCities = useMemo(() => {
    let cities = [...allCities];
    if (search) {
      const q = search.toLowerCase();
      cities = cities.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q)
      );
    }
    if (selectedRegion) {
      cities = cities.filter(c => (regionMap[c.countryCode] || 'Diğer') === selectedRegion);
    }
    if (segment === 'nomad') {
      cities.sort((a, b) => {
        const aN = nomadMetrics[a.slug] ? 1 : 0;
        const bN = nomadMetrics[b.slug] ? 1 : 0;
        return bN - aN;
      });
    }
    return cities;
  }, [allCities, search, segment, selectedRegion]);

  // Editör seçimi şehirler
  const featuredCities = useMemo(() => {
    return editorPicks.map(slug => allCities.find(c => c.slug === slug)).filter(Boolean) as CityInfo[];
  }, [allCities]);

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Destinasyonlar' }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${currentYear} Seyahat Destinasyonları`,
    "description": `${allCities.length} şehir için detaylı rehber, günlük bütçe, en iyi zaman ve konaklama önerileri.`,
    "numberOfItems": allCities.length,
    "itemListElement": allCities.slice(0, 30).map((city, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "City",
        "name": city.name,
        "url": `https://woonomad.co/sehir/${city.slug}`,
        "description": cityGeoData[city.slug]?.quickAnswer || city.description.slice(0, 160)
      }
    }))
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Dijital göçebeler için en uygun şehirler hangileri?",
        "acceptedAnswer": { "@type": "Answer", "text": "Lizbon (D7 vizesi, günlük €40–60), Tiflis (1 yıl vizesiz, günlük $20–40), Bali (günlük $25–45), Budapeşte (günlük €35–60) ve Berlin (günlük €45–70) dijital göçebeler arasında en popüler şehirler." }
      },
      {
        "@type": "Question",
        "name": "En ucuz seyahat edilebilecek şehirler hangileri?",
        "acceptedAnswer": { "@type": "Answer", "text": "Bangkok (günlük $13–33), Tiflis (günlük $14–33), Bali (günlük $25–45) ve Budapeşte (günlük €26–57) bütçe gezginleri için en uygun destinasyonlar." }
      },
      {
        "@type": "Question",
        "name": "Avrupa'da vizesiz gidilebilecek yerler neresi?",
        "acceptedAnswer": { "@type": "Answer", "text": "Türk vatandaşları Schengen vizesiyle Avrupa'nın büyük bölümüne gidebilir. Vizesiz seçenekler: Tiflis (1 yıl), Belgrad (90 gün), Saraybosna (90 gün), Üsküp (90 gün). Dubai, Bangkok ve Bali de vizesiz." }
      },
    ]
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <Helmet>
        <title>{`${allCities.length} Şehir Rehberi ${currentYear} — Bütçe, Vize, En İyi Zaman | WooNomad`}</title>
        <meta
          name="description"
          content={`${currentYear} için ${allCities.length} şehir rehberi. Günlük bütçe, en iyi zaman, vize bilgisi ve konaklama önerileri. Solo, aile ve dijital göçebe gezginler için.`}
        />
        <link rel="canonical" href="https://woonomad.co/sehirler" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqData)}</script>
      </Helmet>

      <Header />

      {/* Hero — clean, warm, no gradient-hero */}
      <section className="bg-sand-900 text-white py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <Breadcrumb items={breadcrumbItems} className="text-sand-400 mb-5" />
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Nereye Gitmeli?
          </h1>
          {/* TL;DR — GEO optimized, AI-quotable */}
          <p className="text-base md:text-lg text-sand-300 max-w-2xl mb-8 leading-relaxed">
            {allCities.length} şehir, her biri için günlük bütçe, en iyi zaman, vize durumu ve
            konaklama rehberi. Bali'de günlük $25'a yaşamaktan Tokyo'da kiraz çiçeği
            sezonunu yakalamaya — planınıza uyan yeri bulun.
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sand-500" />
            <Input
              type="text"
              placeholder="Şehir veya ülke ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-sand-500 rounded-xl focus:bg-white/15 focus:border-ocean-400"
            />
          </div>
        </div>
      </section>

      {/* Filters — sticky */}
      <section className="border-b border-sand-200 bg-white sticky top-[57px] z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {segments.map((seg) => (
              <Button
                key={seg.key}
                variant={segment === seg.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSegment(seg.key)}
                className="gap-1.5 flex-shrink-0 rounded-full"
              >
                <seg.icon className="h-3.5 w-3.5" />
                {seg.label}
              </Button>
            ))}

            <div className="w-px h-6 bg-sand-200 mx-1 flex-shrink-0" />

            {regions.map((region) => (
              <Button
                key={region}
                variant={selectedRegion === region ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
                className="flex-shrink-0 text-xs rounded-full"
              >
                {region}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Editor's Picks — only when no filter active */}
      {!search && segment === 'all' && !selectedRegion && (
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-xl md:text-2xl font-bold text-sand-900">Editör Seçimi</h2>
                <p className="text-sm text-sand-500 mt-1">Uzun süreli kalış ve keşif için en iyi 6 şehir</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredCities.map((city) => {
                const flag = getCountryFlag(city.countryCode);
                const geo = cityGeoData[city.slug];
                const budget = getBudgetDisplay(city.slug);
                const nomad = nomadMetrics[city.slug];

                return (
                  <Link key={city.slug} to={`/sehir/${city.slug}`} className="group">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-sand-200">
                      <img
                        src={city.image}
                        alt={`${city.name}, ${city.country}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Top badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        {nomad && (
                          <span className="px-2.5 py-1 rounded-full bg-ocean-500 text-white text-xs font-semibold">
                            Nomad Dostu
                          </span>
                        )}
                      </div>

                      {/* Bottom content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xl">{flag}</span>
                          <h3 className="font-display text-xl font-bold text-white group-hover:text-ocean-300 transition-colors">
                            {city.name}
                          </h3>
                        </div>
                        <p className="text-sm text-white/70 mb-3">{city.country}</p>

                        {/* Quick stats row */}
                        <div className="flex flex-wrap gap-3 text-xs text-white/80">
                          {budget && (
                            <span className="flex items-center gap-1">
                              <Wallet className="h-3 w-3" /> {budget}/gün
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {city.bestTimeToVisit.split(',')[0]}
                          </span>
                          {nomad?.wifiSpeed && (
                            <span className="flex items-center gap-1">
                              <Wifi className="h-3 w-3" /> {nomad.wifiSpeed} Mbps
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Results Count */}
      <section className="py-4 border-b border-sand-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-sand-500">
              {filteredCities.length} şehir
              {segment !== 'all' && ` · ${segments.find(s => s.key === segment)?.label}`}
              {selectedRegion && ` · ${selectedRegion}`}
            </p>
            {(search || segment !== 'all' || selectedRegion) && (
              <button
                onClick={() => { setSearch(''); setSegment('all'); setSelectedRegion(null); }}
                className="text-sm text-ocean-600 font-medium hover:underline"
              >
                Filtreleri temizle
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {filteredCities.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="h-12 w-12 text-sand-300 mx-auto mb-4" />
              <p className="text-sand-500 mb-3">Bu kriterlere uyan şehir bulamadık.</p>
              <Button variant="outline" size="sm" onClick={() => { setSearch(''); setSelectedRegion(null); setSegment('all'); }}>
                Tümünü Göster
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCities.map((city) => {
                const flag = getCountryFlag(city.countryCode);
                const nomad = nomadMetrics[city.slug];
                const budget = getBudgetDisplay(city.slug);
                const geo = cityGeoData[city.slug];

                return (
                  <Link key={city.slug} to={`/sehir/${city.slug}`}>
                    <Card className="h-full group overflow-hidden border-sand-200 hover:border-ocean-200 hover:shadow-card-hover transition-all duration-300 bg-white">
                      <div className="aspect-[16/9] overflow-hidden relative">
                        <img
                          src={city.image}
                          alt={`${city.name}, ${city.country}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                        {budget && (
                          <div className="absolute bottom-2.5 left-2.5">
                            <span className="px-2 py-1 rounded-lg bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
                              {budget}/gün
                            </span>
                          </div>
                        )}

                        <div className="absolute top-2.5 right-2.5">
                          <span className="px-2 py-1 rounded-lg bg-white/90 text-sand-700 text-xs font-medium backdrop-blur-sm flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {city.bestTimeToVisit.split(',')[0].trim()}
                          </span>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-lg shrink-0">{flag}</span>
                            <div className="min-w-0">
                              <h3 className="font-display font-bold text-sm text-sand-900 group-hover:text-ocean-600 transition-colors truncate">
                                {city.name}
                              </h3>
                              <p className="text-xs text-sand-500">{city.country}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-sand-400 group-hover:text-ocean-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
                        </div>

                        <p className="text-xs text-sand-500 line-clamp-2 mb-3 leading-relaxed">
                          {geo?.quickAnswer || city.description.slice(0, 100) + '...'}
                        </p>

                        <div className="flex flex-wrap gap-1">
                          {nomad && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-ocean-200 text-ocean-600 bg-ocean-50">
                              Nomad
                            </Badge>
                          )}
                          {geo && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-forest-200 text-forest-600 bg-forest-50">
                              Rehber
                            </Badge>
                          )}
                          {city.airportCodes.slice(0, 1).map(code => (
                            <Badge key={code} variant="outline" className="text-[10px] px-1.5 py-0 border-sand-200 text-sand-500">
                              {code}
                            </Badge>
                          ))}
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

      {/* Segment CTAs */}
      <section className="py-10 md:py-14 bg-sand-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="font-display text-xl md:text-2xl font-bold text-sand-900 mb-2">Nasıl seyahat ediyorsunuz?</h2>
          <p className="text-sand-500 mb-6">Gezgin tipinize göre filtrelenmiş rehberler ve öneriler.</p>

          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/solo-seyahat" className="group">
              <div className="bg-white rounded-xl p-6 border border-sand-200 hover:border-ocean-300 hover:shadow-card-hover transition-all h-full">
                <div className="w-10 h-10 rounded-xl bg-ocean-50 flex items-center justify-center mb-4">
                  <Users className="h-5 w-5 text-ocean-600" />
                </div>
                <h3 className="font-display font-bold text-sand-900 mb-1.5">Solo Seyahat</h3>
                <p className="text-sm text-sand-500 leading-relaxed">
                  Güvenlik skorları, hostel önerileri, tek kişilik bütçe tabloları ve
                  yalnız gezginlerin en çok tercih ettiği şehirler.
                </p>
              </div>
            </Link>
            <Link to="/aile-seyahati" className="group">
              <div className="bg-white rounded-xl p-6 border border-sand-200 hover:border-coral-300 hover:shadow-card-hover transition-all h-full">
                <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center mb-4">
                  <Baby className="h-5 w-5 text-coral-600" />
                </div>
                <h3 className="font-display font-bold text-sand-900 mb-1.5">Aile Seyahati</h3>
                <p className="text-sm text-sand-500 leading-relaxed">
                  Çocuk dostu aktiviteler, aile oteli seçenekleri,
                  sağlık ve güvenlik bilgileri, esnek iptal koşulları.
                </p>
              </div>
            </Link>
            <Link to="/dijital-gocebe" className="group">
              <div className="bg-white rounded-xl p-6 border border-sand-200 hover:border-forest-300 hover:shadow-card-hover transition-all h-full">
                <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center mb-4">
                  <Laptop className="h-5 w-5 text-forest-600" />
                </div>
                <h3 className="font-display font-bold text-sand-900 mb-1.5">Dijital Göçebe</h3>
                <p className="text-sm text-sand-500 leading-relaxed">
                  Coworking alanları, Wi-Fi hızları, nomad vizeleri,
                  aylık yaşam maliyeti karşılaştırmaları.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ — GEO critical */}
      <section className="py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-8">
          <h2 className="font-display text-xl md:text-2xl font-bold text-sand-900 mb-6">Sık Sorulan Sorular</h2>
          <div className="space-y-3">
            {[
              {
                q: "Dijital göçebeler için en uygun şehirler hangileri?",
                a: "Lizbon (D7 vizesi, günlük €40–60), Tiflis (1 yıl vizesiz, günlük $20–40), Bali (günlük $25–45), Budapeşte (günlük €35–60) ve Berlin (günlük €45–70) dijital göçebeler arasında en popüler şehirler. Hızlı internet, coworking alanları ve makul yaşam maliyeti ortak özellikleri."
              },
              {
                q: "En ucuz seyahat edilebilecek şehirler hangileri?",
                a: "Bangkok (günlük $13–33), Tiflis (günlük $14–33) ve Bali (günlük $25–45) bütçe gezginleri için en uygun destinasyonlar. Avrupa'da ise Budapeşte (günlük €26–57) ve Prag (günlük €26–57) öne çıkıyor."
              },
              {
                q: "Hangi şehirlere vizesiz gidebilirim?",
                a: "Türk vatandaşları Dubai (90 gün), Bangkok (30 gün), Bali (30 gün), Tokyo (90 gün), Singapur (90 gün), Tiflis (1 yıl), Belgrad (90 gün) ve Saraybosna'ya (90 gün) vizesiz giriş yapabilir."
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl border border-sand-200 overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-medium text-sand-900 hover:bg-sand-50 transition-colors">
                  {faq.q}
                  <ArrowRight className="h-4 w-4 text-sand-400 transition-transform group-open:rotate-90 shrink-0 ml-3" />
                </summary>
                <div className="px-5 pb-5 text-sm text-sand-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Cities;
