import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent } from '@/components/ui/card';

const TermsOfService = () => {
  const currentYear = new Date().getFullYear();
  
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Kullanım Koşulları' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Kullanım Koşulları | WooNomad</title>
        <meta name="description" content="WooNomad kullanım koşulları. Web sitemizi kullanırken uymanız gereken kurallar ve şartlar." />
        <link rel="canonical" href="https://woonomad.co/kullanim-kosullari" />
      </Helmet>

      <Header />

      <main className="container py-8 max-w-4xl">
        <Breadcrumb items={breadcrumbItems} />
        
        <h1 className="text-3xl md:text-4xl font-display font-bold mt-6 mb-8">
          Kullanım Koşulları
        </h1>

        <Card variant="elevated">
          <CardContent className="p-6 md:p-8 prose prose-lg max-w-none">
            <p className="text-muted-foreground">
              Son güncelleme: {currentYear}
            </p>

            <h2>1. Genel</h2>
            <p>
              WooNomad web sitesini kullanarak bu kullanım koşullarını kabul etmiş olursunuz. 
              Bu koşulları kabul etmiyorsanız, lütfen sitemizi kullanmayın.
            </p>

            <h2>2. Hizmetlerimiz</h2>
            <p>
              WooNomad, uçak bileti ve otel fiyatlarını karşılaştırmanıza yardımcı olan bir arama motorudur. 
              Biz bir seyahat acentesi değiliz ve doğrudan rezervasyon almıyoruz. 
              Rezervasyonlar, yönlendirdiğimiz üçüncü taraf web siteleri üzerinden gerçekleştirilir.
            </p>

            <h2>3. Fiyat Bilgileri</h2>
            <p>
              Gösterilen fiyatlar anlık olarak üçüncü taraf kaynaklardan alınmaktadır. 
              Fiyatlar değişkenlik gösterebilir ve nihai fiyat, rezervasyon yapacağınız sitede belirlenecektir. 
              WooNomad, gösterilen fiyatların doğruluğunu garanti etmez.
            </p>

            <h2>4. Kullanıcı Sorumlulukları</h2>
            <p>Web sitemizi kullanırken aşağıdakileri kabul edersiniz:</p>
            <ul>
              <li>Yasalara uygun davranmak</li>
              <li>Siteyi kötüye kullanmamak</li>
              <li>Başkalarının haklarına saygı göstermek</li>
              <li>Doğru ve güncel bilgi sağlamak</li>
            </ul>

            <h2>5. Fikri Mülkiyet</h2>
            <p>
              Web sitemizdeki tüm içerik, tasarım, logo ve materyaller WooNomad'a aittir 
              veya lisans altında kullanılmaktadır. İzinsiz kullanım yasaktır.
            </p>

            <h2>6. Sorumluluk Sınırlaması</h2>
            <p>
              WooNomad, web sitesinin kesintisiz veya hatasız çalışacağını garanti etmez. 
              Üçüncü taraf sitelerdeki işlemlerden sorumlu değiliz.
            </p>

            <h2>7. Değişiklikler</h2>
            <p>
              Bu kullanım koşullarını önceden bildirimde bulunmaksızın değiştirme hakkını saklı tutarız. 
              Değişiklikler, web sitesinde yayınlandığı anda yürürlüğe girer.
            </p>

            <h2>8. İletişim</h2>
            <p>
              Kullanım koşulları hakkında sorularınız için:
              <br />
              E-posta: info@woonomad.co
            </p>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-border py-8 mt-12 mb-20 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © {currentYear} WooNomad. Tüm hakları saklıdır.
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
};

export default TermsOfService;
