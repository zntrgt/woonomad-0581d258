import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Smartphone, Download, CheckCircle, Apple, Chrome, Share2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileBottomNav } from '@/components/MobileBottomNav';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Install() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const features = [
    { icon: '⚡', title: t('install.feature1', 'Anında Erişim'), desc: t('install.feature1Desc', 'Ana ekrandan tek tıkla açın') },
    { icon: '📴', title: t('install.feature2', 'Çevrimdışı Destek'), desc: t('install.feature2Desc', 'İnternet olmadan da çalışır') },
    { icon: '🔔', title: t('install.feature3', 'Bildirimler'), desc: t('install.feature3Desc', 'Fiyat düşüşlerinden haberdar olun') },
    { icon: '🚀', title: t('install.feature4', 'Hızlı Yükleme'), desc: t('install.feature4Desc', 'Tarayıcıdan 2x daha hızlı') },
  ];

  return (
    <>
      <Helmet>
        <title>{t('install.title', 'Uygulamayı Yükle')} - WooNomad</title>
        <meta name="description" content={t('install.metaDesc', 'WooNomad uygulamasını telefonunuza yükleyin ve en ucuz uçak biletlerini anında bulun.')} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
          {/* Hero */}
          <section className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
              <Smartphone className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t('install.heroTitle', 'WooNomad\'ı Telefonunuza Ekleyin')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('install.heroDesc', 'Uygulamamızı ana ekranınıza ekleyerek en ucuz uçak biletlerine anında erişin. App Store veya Play Store indirmesi gerektirmez!')}
            </p>
          </section>

          {/* Install Status */}
          {isInstalled ? (
            <Card className="mb-10 border-success/50 bg-success/10">
              <CardContent className="p-6 flex items-center gap-4">
                <CheckCircle className="h-12 w-12 text-success" />
                <div>
                  <h2 className="text-xl md:text-2xl font-display font-bold">
                    {t('install.alreadyInstalled', 'Uygulama Zaten Yüklü!')}
                  </h2>
                  <p className="text-muted-foreground">
                    {t('install.alreadyInstalledDesc', 'WooNomad ana ekranınızdan erişime hazır.')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Install Button (Chrome/Android) */}
              {deferredPrompt && (
                <Card className="mb-10 border-primary/50">
                  <CardContent className="p-6 text-center">
                    <Button 
                      size="lg" 
                      onClick={handleInstall}
                      className="w-full sm:w-auto h-14 px-8 text-lg gap-2"
                    >
                      <Download className="h-5 w-5" />
                      {t('install.installNow', 'Hemen Yükle')}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-3">
                      {t('install.noAppStore', 'App Store veya Play Store gerektirmez')}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* iOS Instructions */}
              {isIOS && !deferredPrompt && (
                <Card className="mb-10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Apple className="h-5 w-5" />
                      iPhone / iPad için Kurulum
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                      <div>
                        <p className="font-medium">Safari'de Paylaş düğmesine tıklayın</p>
                        <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                          <Share2 className="h-4 w-4" />
                          <span className="text-sm">Alttaki paylaşım simgesi</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                      <div>
                        <p className="font-medium">"Ana Ekrana Ekle" seçeneğini bulun</p>
                        <p className="text-sm text-muted-foreground">Menüyü aşağı kaydırın</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
                      <div>
                        <p className="font-medium">"Ekle" düğmesine tıklayın</p>
                        <p className="text-sm text-muted-foreground">WooNomad ana ekranınızda görünecek</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Android Instructions (when no prompt) */}
              {isAndroid && !deferredPrompt && (
                <Card className="mb-10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Chrome className="h-5 w-5" />
                      Android için Kurulum
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                      <div>
                        <p className="font-medium">Chrome menüsünü açın</p>
                        <p className="text-sm text-muted-foreground">Sağ üstteki üç nokta ⋮</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                      <div>
                        <p className="font-medium">"Uygulamayı yükle" veya "Ana ekrana ekle"</p>
                        <p className="text-sm text-muted-foreground">Menüde bu seçeneği bulun</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
                      <div>
                        <p className="font-medium">"Yükle" düğmesine tıklayın</p>
                        <p className="text-sm text-muted-foreground">WooNomad uygulamanız hazır!</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Features */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-6">
              {t('install.whyInstall', 'Neden Yüklemelisiniz?')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-4">
                    <span className="text-3xl mb-2 block">{feature.icon}</span>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* PWA Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                💡 {t('install.pwaInfo', 'WooNomad bir Progressive Web App (PWA)\'dır. Tarayıcınızdan doğrudan yükleyebilir, uygulama mağazası indirmesi gerektirmeden gerçek bir uygulama deneyimi yaşayabilirsiniz.')}
              </p>
            </CardContent>
          </Card>
        </main>

        <Footer />
        <MobileBottomNav />
      </div>
    </>
  );
}
