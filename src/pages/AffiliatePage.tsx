import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent } from '@/components/ui/card';

const partners = [
  { name: 'Agoda', cat: 'Konaklama', desc: 'Otel, hostel, apartman karşılaştırma' },
  { name: 'GetYourGuide', cat: 'Aktivite', desc: 'Tur ve deneyim rezervasyonu' },
  { name: 'Airalo', cat: 'eSIM', desc: 'Seyahat eSIM planları' },
  { name: 'Yesim', cat: 'eSIM', desc: 'İsviçre menşeli eSIM çözümleri' },
  { name: 'DiscoverCars', cat: 'Araç Kiralama', desc: 'Araç kiralama karşılaştırma' },
  { name: 'EKTA', cat: 'Sigorta', desc: 'Seyahat ve nomad sigortası' },
  { name: 'Omio', cat: 'Ulaşım', desc: 'Tren, otobüs, uçuş karşılaştırma' },
  { name: 'Tiqets', cat: 'Bilet', desc: 'Müze ve etkinlik bileti' },
  { name: 'Aviasales', cat: 'Uçuş', desc: 'Ucuz uçak bileti karşılaştırma' },
];

const AffiliatePage = () => {
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Affiliate Açıklama' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Affiliate Açıklama | WooNomad</title>
        <meta name="description" content="WooNomad affiliate bağlantıları ve partner programları hakkında bilgi. İçerik bağımsızlığı politikamız." />
        <link rel="canonical" href="https://woonomad.co/affiliate-aciklama" />
      </Helmet>

      <Header />

      <main className="container py-8 max-w-4xl">
        <Breadcrumb items={breadcrumbItems} />

        <h1 className="text-3xl md:text-4xl font-display font-bold mt-6 mb-4">
          Affiliate Açıklama
        </h1>

        <Card>
          <CardContent className="p-6 md:p-8 prose prose-lg max-w-none">
            <p>
              WooNomad bağımsız bir seyahat rehberi platformudur. İçeriklerimizin
              bir kısmında affiliate (ortaklık) bağlantıları bulunur. Bu bağlantılar
              üzerinden yapılan rezervasyonlardan komisyon alabiliriz.{' '}
              <strong>Bu durum size ek maliyet yansıtmaz</strong> — ödediğiniz fiyat,
              doğrudan o siteye gitseydiniz ödeyeceğiniz fiyatla aynıdır.
            </p>

            <h2>Partnerlerimiz</h2>
            <div className="overflow-x-auto not-prose">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-semibold">Partner</th>
                    <th className="text-left py-3 px-4 font-semibold">Kategori</th>
                    <th className="text-left py-3 px-4 font-semibold">Açıklama</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((p) => (
                    <tr key={p.name} className="border-b">
                      <td className="py-3 px-4 font-medium">{p.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{p.cat}</td>
                      <td className="py-3 px-4 text-muted-foreground">{p.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>İçerik Bağımsızlığı</h2>
            <p>
              Önerilerimiz komisyon oranına göre değil, gezgin deneyimine göre
              şekillenir. Bir ürünü veya destinasyonu yalnızca gerçek değer
              sunduğuna inandığımız için öneriyoruz. Hiçbir partner içeriklerimizin
              yönünü belirlemez.
            </p>

            <h2>Gelir Kullanımı</h2>
            <p>
              Affiliate geliri; içeriğin güncel tutulması, yeni destinasyon
              rehberlerinin üretilmesi, AI planlayıcının geliştirilmesi ve sitenin
              ücretsiz kalması için kullanılır.
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default AffiliatePage;
