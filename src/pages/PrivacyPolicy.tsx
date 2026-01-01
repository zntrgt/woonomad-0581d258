import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPolicy = () => {
  const currentYear = new Date().getFullYear();
  
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Gizlilik Politikası' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Gizlilik Politikası | WooNomad</title>
        <meta name="description" content="WooNomad gizlilik politikası. Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi edinin." />
        <link rel="canonical" href="https://woonomad.co/gizlilik-politikasi" />
      </Helmet>

      <Header />

      <main className="container py-8 max-w-4xl">
        <Breadcrumb items={breadcrumbItems} />
        
        <h1 className="text-3xl md:text-4xl font-display font-bold mt-6 mb-8">
          Gizlilik Politikası
        </h1>

        <Card variant="elevated">
          <CardContent className="p-6 md:p-8 prose prose-lg max-w-none">
            <p className="text-muted-foreground">
              Son güncelleme: {currentYear}
            </p>

            <h2>1. Giriş</h2>
            <p>
              WooNomad olarak, gizliliğinize saygı duyuyor ve kişisel verilerinizi korumayı taahhüt ediyoruz. 
              Bu Gizlilik Politikası, web sitemizi kullandığınızda hangi bilgileri topladığımızı, 
              bu bilgileri nasıl kullandığımızı ve haklarınızı açıklamaktadır.
            </p>

            <h2>2. Toplanan Bilgiler</h2>
            <p>Web sitemizi kullandığınızda aşağıdaki bilgileri toplayabiliriz:</p>
            <ul>
              <li><strong>Kullanım Verileri:</strong> IP adresi, tarayıcı türü, ziyaret edilen sayfalar, ziyaret süresi</li>
              <li><strong>Çerez Verileri:</strong> Tercihlerinizi hatırlamak için kullanılan çerezler</li>
              <li><strong>Arama Verileri:</strong> Uçuş ve otel aramalarınız (kişisel bilgi içermez)</li>
            </ul>

            <h2>3. Bilgilerin Kullanımı</h2>
            <p>Topladığımız bilgileri aşağıdaki amaçlarla kullanıyoruz:</p>
            <ul>
              <li>Web sitesi deneyimini iyileştirmek</li>
              <li>Hizmet kalitesini artırmak</li>
              <li>İstatistiksel analizler yapmak</li>
              <li>Yasal yükümlülükleri yerine getirmek</li>
            </ul>

            <h2>4. Üçüncü Taraf Hizmetleri</h2>
            <p>
              Web sitemizde Google Analytics, Google Tag Manager ve reklam hizmetleri kullanıyoruz. 
              Bu hizmetler kendi gizlilik politikalarına tabidir.
            </p>

            <h2>5. Veri Güvenliği</h2>
            <p>
              Verilerinizi korumak için endüstri standardı güvenlik önlemleri uyguluyoruz. 
              Ancak, internet üzerinden yapılan hiçbir veri iletiminin %100 güvenli olmadığını unutmayın.
            </p>

            <h2>6. Haklarınız</h2>
            <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul>
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
              <li>Kişisel verilerinizin düzeltilmesini isteme</li>
              <li>Kişisel verilerinizin silinmesini isteme</li>
            </ul>

            <h2>7. İletişim</h2>
            <p>
              Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
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

export default PrivacyPolicy;
