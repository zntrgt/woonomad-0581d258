import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent } from '@/components/ui/card';

const MetodolojiPage = () => {
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Metodoloji' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Metodoloji — Değerlendirme Kriterleri | WooNomad</title>
        <meta name="description" content="WooNomad rehberlerinin veri kaynakları, destinasyon puanlama metodolojisi ve güncelleme politikası." />
        <link rel="canonical" href="https://woonomad.co/metodoloji" />
      </Helmet>

      <Header />

      <main className="container py-8 max-w-4xl">
        <Breadcrumb items={breadcrumbItems} />

        <h1 className="text-3xl md:text-4xl font-display font-bold mt-6 mb-8">
          Metodoloji
        </h1>

        <Card>
          <CardContent className="p-6 md:p-8 prose prose-lg max-w-none">
            <h2>Veri Kaynakları</h2>
            <p>WooNomad rehberleri aşağıdaki kaynaklardan derlenen verilere dayanır:</p>
            <ul>
              <li><strong>Booking.com</strong> — Konaklama fiyatları ve iptal politikaları</li>
              <li><strong>Expedia</strong> — Seyahat trendleri ve karşılaştırma verileri</li>
              <li><strong>Skift</strong> — Sektör analizi ve istatistikler</li>
              <li><strong>Phocuswright</strong> — Tüketici davranışı araştırmaları</li>
              <li><strong>MBO Partners</strong> — Dijital göçebe istatistikleri</li>
              <li><strong>Amadeus</strong> — Teknoloji trendleri (eSIM, dijital araçlar)</li>
              <li><strong>Euromonitor</strong> — Şehir turizmi verileri</li>
            </ul>

            <h2>Değerlendirme Eksenleri</h2>
            <p>Her destinasyon üç ana eksende 1–10 arası puanlanır:</p>

            <div className="not-prose space-y-4 my-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Solo Güvenlik Skoru</h3>
                <p className="text-sm text-muted-foreground">
                  Şehir güvenlik endeksi, toplu taşıma güvenliği, gece güvenliği,
                  solo gezgin deneyimleri ve hostel kalitesi.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Aile Uygunluk Skoru</h3>
                <p className="text-sm text-muted-foreground">
                  Esnek iptal oranları, çocuk dostu aktivite sayısı, sağlık altyapısı
                  ve aile konaklama seçenekleri.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Dijital Göçebe Hazırlık Skoru</h3>
                <p className="text-sm text-muted-foreground">
                  Ortalama Wi-Fi hızı, coworking alan sayısı, dijital göçebe vizesi
                  varlığı, aylık yaşam maliyeti ve topluluk büyüklüğü.
                </p>
              </div>
            </div>

            <h2>Fiyat Verileri</h2>
            <p>
              Fiyat bilgileri periyodik olarak güncellenir ve "yaklaşık" niteliğindedir.
              Döviz kurları, mevsimsellik ve arz-talep dengesine göre değişkenlik
              gösterebilir. Fiyatlar son güncelleme tarihindeki verileri yansıtır.
            </p>

            <h2>Güncelleme Sıklığı</h2>
            <ul>
              <li>Fiyat verileri: çeyreklik</li>
              <li>Vize bilgileri: değişiklik oldukça</li>
              <li>Genel içerik: 6 aylık</li>
              <li>Son güncelleme tarihi her sayfada görünür</li>
            </ul>
          </CardContent>
        </Card>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default MetodolojiPage;
