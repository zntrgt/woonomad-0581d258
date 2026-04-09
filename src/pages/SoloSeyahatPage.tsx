import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, MapPin, Train, Users, Wallet, CheckCircle2 } from 'lucide-react';

const topCities = [
  { name: 'Lizbon', slug: 'lizbon', score: 9, country: 'Portekiz', budget: '€40–60', highlight: "Avrupa'nın en güvenli başkentlerinden biri. D7 dijital göçebe vizesi, uygun fiyatlar ve güçlü topluluk." },
  { name: 'Berlin', slug: 'berlin', score: 8, country: 'Almanya', budget: '€45–70', highlight: 'En uygun fiyatlı büyük başkent. Alternatif kültür, startup sahnesi ve mükemmel toplu taşıma.' },
  { name: 'Barselona', slug: 'barselona', score: 7, country: 'İspanya', budget: '€50–75', highlight: "Akdeniz sahili, Gaudí ve güçlü nomad sahnesi. El Born ve Gràcia hosteller için ideal." },
  { name: 'İstanbul', slug: 'istanbul', score: 7, country: 'Türkiye', budget: '€30–50', highlight: 'İki kıtayı birleştiren şehir. Zengin tarih, uygun fiyatlar ve eşsiz gastronomi.' },
  { name: 'Bali', slug: 'bali', score: 7, country: 'Endonezya', budget: '$25–45', highlight: 'Canggu ve Ubud solo gezginlerin buluşma noktası. Coliving seçenekleri zengin.' },
];

const criteria = [
  { icon: Shield, label: 'Güvenlik skoru', desc: "Solo gezginlerin %72'si birincil kriter" },
  { icon: MapPin, label: 'Yürünebilir merkez', desc: 'Gece güvenli dönüş imkanı' },
  { icon: Train, label: 'Toplu taşıma', desc: 'Ucuz ve güvenilir ulaşım' },
  { icon: Users, label: 'Hostel kalitesi', desc: 'Sosyalleşme + güvenlik' },
  { icon: Wallet, label: 'Uygun fiyat', desc: 'Uzun süreli solo seyahat bütçesi' },
];

const tips = [
  'Merkezi ve iyi aydınlatılmış bölgelerde konaklayın',
  'eSIM ile sürekli internet bağlantısı sağlayın',
  'Hostel seçerken sosyalleşme alanlarına dikkat edin',
  "Free walking tour'lar şehri tanımanın en iyi yolu",
  'Seyahat sigortası mutlaka yaptırın',
];

const SoloSeyahatPage = () => {
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Solo Seyahat' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Solo Seyahat Rehberi 2026 — En Güvenli Şehirler | WooNomad</title>
        <meta name="description" content="Solo gezginler için en güvenli ve uygun fiyatlı şehirler. Güvenlik skorları, hostel önerileri ve pratik ipuçları." />
        <link rel="canonical" href="https://woonomad.co/solo-seyahat" />
        <link rel="canonical" href="https://woonomad.co/solo-seyahat" />
      </Helmet>

      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-900 to-emerald-700 text-white py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="outline" className="border-emerald-400 text-emerald-200 mb-4">Gezgin Tipi</Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Solo Seyahat Rehberi</h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            Solo seyahat küresel olarak %59 artış gösterdi. Solo gezginlerin
            %72'si güvenliği birincil kriter olarak değerlendiriyor.
          </p>
        </div>
      </div>

      <main className="container py-8 max-w-4xl">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* TL;DR */}
        <Card className="border-l-4 border-l-emerald-500 mb-8">
          <CardContent className="p-5">
            <p className="font-semibold text-sm mb-1">Kısa Özet</p>
            <p className="text-sm text-muted-foreground">
              Solo gezginler için en güvenli şehirler Lizbon (9/10), Berlin (8/10)
              ve Barselona (7/10). Günlük €30–75 bütçeyle güvenli, yürünebilir ve sosyal
              şehirlerde keyifli bir deneyim mümkün.
            </p>
          </CardContent>
        </Card>

        {/* Top Cities */}
        <h2 className="text-2xl font-display font-bold mb-6">Solo Gezginler İçin En İyi Şehirler</h2>
        <div className="space-y-3 mb-12">
          {topCities.map((city, i) => (
            <Link key={city.slug} to={`/sehir/${city.slug}`} className="block">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold">{i + 1}. {city.name}</span>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                      Güvenlik: {city.score}/10
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
        <h2 className="text-2xl font-display font-bold mb-4">Karar Kriterleri</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
          {criteria.map((c) => (
            <Card key={c.label}>
              <CardContent className="p-4 flex items-start gap-3">
                <c.icon className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips */}
        <h2 className="text-2xl font-display font-bold mb-4">Solo Seyahat İpuçları</h2>
        <Card className="mb-12">
          <CardContent className="p-6">
            <ul className="space-y-3">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
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

export default SoloSeyahatPage;
