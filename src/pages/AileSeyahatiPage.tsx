import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Baby, Plane, Clock, Heart, CheckCircle2 } from 'lucide-react';

const topCities = [
  { name: 'İstanbul', slug: 'istanbul', score: 8, country: 'Türkiye', budget: '€40–70', highlight: 'Direkt uçuşlar, zengin tarih, çocuk dostu sokak yemekleri ve parklar. Bütçeye uygun aile otelleri.' },
  { name: 'Barselona', slug: 'barselona', score: 8, country: 'İspanya', budget: '€50–75', highlight: 'Sahil + kültür kombinasyonu. Tibidabo lunapark, CosmoCaixa bilim müzesi. Metro erişimi mükemmel.' },
  { name: 'Lizbon', slug: 'lizbon', score: 7, country: 'Portekiz', budget: '€40–60', highlight: 'Okyanus Akvaryumu, Belém Kulesi, Sintra günübirlik gezi. Tramvay 28 çocuklar için eğlenceli.' },
  { name: 'Berlin', slug: 'berlin', score: 6, country: 'Almanya', budget: '€45–70', highlight: 'Doğa Tarihi Müzesi, Berlin Zoo, Legoland Discovery. Parkları ve oyun alanları bol.' },
  { name: 'Bali', slug: 'bali', score: 7, country: 'Endonezya', budget: '$30–55', highlight: 'Tropik cennet. Maymun Ormanı, pirinç terasları, plaj aktiviteleri. Aile villaları uygun fiyatlı.' },
];

const criteriaItems = [
  { icon: Clock, label: 'Esnek iptal politikası', desc: "Ailelerin %45'i birincil kriter" },
  { icon: Plane, label: 'Direkt uçuş', desc: 'Çocuklarla aktarmasız seyahat' },
  { icon: Baby, label: 'Çocuk dostu aktiviteler', desc: 'Müze, park, interaktif deneyim' },
  { icon: Shield, label: 'Güvenli bölgeler', desc: 'Aile konaklama seçenekleri' },
  { icon: Heart, label: 'Sağlık altyapısı', desc: 'Hastane ve eczane erişimi' },
];

const tips = [
  'Esnek iptal politikası olan otelleri tercih edin',
  'Apartman kiralama mutfak imkanıyla masrafları düşürür',
  'Çocukla seyahatte direkt uçuş öncelik',
  'Aile seyahat sigortası mutlaka yaptırın',
  'Planlama 50–70 gün önceden başlasın',
];

const AileSeyahatiPage = () => {
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Aile Seyahati' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Aile Seyahati Rehberi 2026 — Çocuk Dostu Şehirler | WooNomad</title>
        <meta name="description" content="Aileler için en uygun şehirler. Esnek iptal, çocuk dostu aktiviteler, güvenli bölgeler ve bütçe ipuçları." />
        <link rel="canonical" href="https://woonomad.co/aile-seyahati" />
        <link rel="canonical" href="https://woonomad.co/aile-seyahati" />
      </Helmet>

      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-900 to-amber-700 text-white py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="outline" className="border-amber-400 text-amber-200 mb-4">Gezgin Tipi</Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Aile Seyahati Rehberi</h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            Ailelerin %45'i konaklama seçerken esnek iptal politikasını en önemli kriter
            olarak belirtiyor. Planlama süresi ortalama 50–70 gün önceden.
          </p>
        </div>
      </div>

      <main className="container py-8 max-w-4xl">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* TL;DR */}
        <Card className="border-l-4 border-l-amber-500 mb-8">
          <CardContent className="p-5">
            <p className="font-semibold text-sm mb-1">Kısa Özet</p>
            <p className="text-sm text-muted-foreground">
              Aileler için en uygun şehirler İstanbul ve Barselona (8/10),
              Lizbon ve Bali (7/10). Esnek iptal politikası, çocuk dostu aktiviteler
              ve güvenli bölgeler temel kriterler.
            </p>
          </CardContent>
        </Card>

        {/* Top Cities */}
        <h2 className="text-2xl font-display font-bold mb-6">Aileler İçin En İyi Şehirler</h2>
        <div className="space-y-3 mb-12">
          {topCities.map((city, i) => (
            <Link key={city.slug} to={`/sehir/${city.slug}`} className="block">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold">{i + 1}. {city.name}</span>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                      Aile: {city.score}/10
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{city.country} · Günlük bütçe: {city.budget}</p>
                  <p className="text-sm text-muted-foreground">{city.highlight}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Criteria */}
        <h2 className="text-2xl font-display font-bold mb-4">Aile Seyahati Kriterleri</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
          {criteriaItems.map((c) => (
            <Card key={c.label}>
              <CardContent className="p-4 flex items-start gap-3">
                <c.icon className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips */}
        <h2 className="text-2xl font-display font-bold mb-4">Aile Seyahati İpuçları</h2>
        <Card className="mb-12">
          <CardContent className="p-6">
            <ul className="space-y-3">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default AileSeyahatiPage;
