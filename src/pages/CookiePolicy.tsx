import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { openCookiePreferences, setAffiliateConsent, useConsent } from '@/lib/consent';

const CookiePolicy = () => {
  const currentYear = new Date().getFullYear();
  const { affiliate } = useConsent();
  
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
              Son güncelleme: 25 Kasım 2026
            </p>

            <h2>Çerez Nedir?</h2>
            <p>
              Çerezler, web sitelerinin cihazınıza yerleştirdiği küçük metin dosyalarıdır. 
              Çerezler, web sitesinin tercihlerinizi hatırlamasına ve size daha iyi bir deneyim sunmasına yardımcı olur.
            </p>

            <h2>Depolama ve izin kategorileri</h2>
            <ul>
              <li><strong>Zorunlu tercihler:</strong> Google ve reklam izinleri InMobi Choice CMP aracılığıyla yönetilir ve CMP’nin tercih saklama mekanizmasında tutulur. İş ortağı araçlarına ilişkin ayrı izin yalnızca açık sayfa oturumunda, bellekte tutulur. Site işlevleri ayrıca gerekli oturum ve tercih verilerini kullanabilir.</li>
              <li><strong>Analitik (isteğe bağlı):</strong> Google Tag Manager ve Google Analytics, yalnızca analitik izniyle yüklenir. GA4 ziyaret, gezinme ve affiliate tıklamalarını ölçebilir; Google'ın analitik çerezleri (_ga ve _ga_*) kullanılabilir.</li>
              <li><strong>İş ortağı araçları (isteğe bağlı):</strong> Travelpayouts ve ilgili üçüncü taraf gömülü seyahat araçları ayrı izinle yüklenebilir. Sağlayıcılar kendi depolama ve izleme teknolojilerini kullanabilir. Doğrudan dış bağlantılar çalışır; tıkladığınızda hedef sitenin kendi koşulları uygulanır.</li>
              <li><strong>Reklam:</strong> Bu sürümde doğrudan AdSense yüklemesi devre dışıdır; reklam tercihleri InMobi Choice üzerinden yönetilir; AdSense yüklemesi teknik doğrulama tamamlanana kadar kapalıdır.</li>
            </ul>
            <h2>Çerezleri Yönetme</h2>
            <p>İsteğe bağlı izinler varsayılan olarak kapalıdır. Kabul etmek zorunlu değildir. Google tercihlerinizi InMobi panelinden, gömülü seyahat araçlarının iznini ise ayrı kontrol üzerinden değiştirebilirsiniz. İzni geri aldığınızda site yeniden yüklenerek ilgili araçların sonraki yüklenmesi engellenir. Üçüncü taraf sitelerin çerezlerini tarayıcı ayarlarınızdan yönetebilirsiniz.</p>
            <button type="button" className="underline text-primary" onClick={openCookiePreferences}>Google ve reklam tercihlerini değiştir</button>
            <p><button type="button" className="underline text-primary" onClick={() => setAffiliateConsent(!affiliate)}>{affiliate ? "İş ortağı iznini geri al" : "İş ortağı araçlarına izin ver"}</button></p>
            <h3>Sağlayıcıların açıklamaları</h3>
            <ul>
              <li><a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">Google çerez açıklaması ve saklama bilgileri</a></li>
              <li><a href="https://www.travelpayouts.com/privacy" target="_blank" rel="noopener noreferrer">Travelpayouts gizlilik açıklaması</a></li>
            </ul>
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
