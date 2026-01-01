import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { Plane, Home, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // Track 404 event
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: '404_error',
        page_path: location.pathname
      });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Sayfa Bulunamadı - 404 | WooNomad</title>
        <meta name="description" content="Aradığınız sayfa bulunamadı. Ana sayfaya dönün veya uçuş arama yapın." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Header />

      <main className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        {/* Animated Plane */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Plane className="w-16 h-16 text-primary animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
            <span className="text-warning font-bold">?</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-6xl md:text-8xl font-display font-bold text-primary mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
          Rotadan Saptınız! ✈️
        </h2>
        <p className="text-muted-foreground text-lg max-w-md mb-8">
          Aradığınız sayfa bulunamadı. Belki de bu sayfa başka bir destinasyona uçtu!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button asChild size="lg" className="gap-2">
            <Link to="/">
              <Home className="w-5 h-5" />
              Ana Sayfaya Dön
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/ucus-rotalari">
              <Search className="w-5 h-5" />
              Uçuş Ara
            </Link>
          </Button>
        </div>

        {/* Suggested Links */}
        <div className="bg-muted/50 rounded-2xl p-6 max-w-lg w-full">
          <h3 className="font-medium mb-4 flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Popüler Destinasyonlar
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {['paris', 'londra', 'roma', 'barcelona', 'amsterdam'].map(city => (
              <Link
                key={city}
                to={`/sehir/${city}`}
                className="px-4 py-2 bg-background rounded-full text-sm hover:bg-primary/10 transition-colors capitalize"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12 mb-20 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} WooNomad. Tüm hakları saklıdır.
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
};

export default NotFound;
