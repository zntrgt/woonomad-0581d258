import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent } from '@/components/ui/card';

const CookiePolicy = () => {
  const currentYear = new Date().getFullYear();
  
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Çerez Politikası' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Çerez Politikası | WooNomad</title>
        <meta name="description" content="WooNomad çerez politikası. Web sitemizde kullanılan çerezler hakkında bilgi edinin." />
        <link rel="canonical" href="https://woonomad.co/cerez-politikasi" />
      </Helmet>

      <Header />

      <main className="container py-8 max-w-4xl">
        <Breadcrumb items={breadcrumbItems} />
        
        <h1 className="text-3xl md:text-4xl font-display font-bold mt-6 mb-8">
          Çerez Politikası
        </h1>

        <Card variant="elevated">
          <CardContent className="p-6 md:p-8 prose prose-lg max-w-none">
            <p className="text-muted-foreground">
              Son güncelleme: {currentYear}
            </p>

            <h2>Çerez Nedir?</h2>
            <p>
              Çerezler, web sitelerinin cihazınıza yerleştirdiği küçük metin dosyalarıdır. 
              Çerezler, web sitesinin tercihlerinizi hatırlamasına ve size daha iyi bir deneyim sunmasına yardımcı olur.
            </p>

            <h2>Kullandığımız Çerez Türleri</h2>
            
            <h3>1. Zorunlu Çerezler</h3>
            <p>
              Web sitesinin çalışması için gerekli olan çerezlerdir. Bu çerezler olmadan bazı özellikler kullanılamaz.
            </p>

            <h3>2. Performans Çerezleri</h3>
            <p>
              Web sitesinin nasıl kullanıldığını anlamamıza yardımcı olan anonim veriler toplar. 
              Bu veriler, siteyi geliştirmek için kullanılır.
            </p>

            <h3>3. İşlevsellik Çerezleri</h3>
            <p>
              Tercihlerinizi hatırlamamıza yardımcı olur (örneğin, dil tercihi, tema seçimi).
            </p>

            <h3>4. Hedefleme/Reklam Çerezleri</h3>
            <p>
              İlgi alanlarınıza uygun reklamlar göstermek için kullanılır. Bu çerezler üçüncü taraflar tarafından yerleştirilebilir.
            </p>

            <h2>Üçüncü Taraf Çerezleri</h2>
            <p>Web sitemizde aşağıdaki üçüncü taraf hizmetlerinin çerezleri bulunabilir:</p>
            <ul>
              <li><strong>Google Analytics:</strong> Web sitesi trafiğini analiz etmek için</li>
              <li><strong>Google Tag Manager:</strong> Pazarlama etiketlerini yönetmek için</li>
              <li><strong>Google AdSense:</strong> Reklam gösterimi için</li>
            </ul>

            <h2>Çerezleri Yönetme</h2>
            <p>
              Çerezleri tarayıcı ayarlarınızdan yönetebilirsiniz. Çerezleri reddederseniz, 
              web sitesinin bazı özellikleri düzgün çalışmayabilir.
            </p>

            <h3>Tarayıcılarda Çerez Ayarları:</h3>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/tr/kb/cerezleri-silme-web-sitelerinin-bilgilerini-kaldirma" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/tr-tr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
              <li><a href="https://support.microsoft.com/tr-tr/microsoft-edge/microsoft-edge-de-tanımlama-bilgilerini-silme-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
            </ul>

            <h2>İletişim</h2>
            <p>
              Çerez politikamız hakkında sorularınız için:
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

export default CookiePolicy;
