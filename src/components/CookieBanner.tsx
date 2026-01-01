import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'woonomad-cookie-consent';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay to prevent flash on page load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
    // Track acceptance event
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'cookie_consent',
        consent_type: 'accepted'
      });
    }
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setIsVisible(false);
    // Track rejection event
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'cookie_consent',
        consent_type: 'rejected'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom-5 duration-500">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-2xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Cookie className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-lg mb-1">Çerez Kullanımı</h3>
            <p className="text-sm text-muted-foreground">
              Size daha iyi bir deneyim sunmak için çerezleri kullanıyoruz. Sitemizi kullanmaya devam ederek{' '}
              <Link to="/gizlilik-politikasi" className="text-primary hover:underline">
                Gizlilik Politikamızı
              </Link>{' '}
              ve{' '}
              <Link to="/cerez-politikasi" className="text-primary hover:underline">
                Çerez Politikamızı
              </Link>{' '}
              kabul etmiş olursunuz.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={handleReject}
              className="flex-1 md:flex-none"
            >
              Reddet
            </Button>
            <Button 
              onClick={handleAccept}
              className="flex-1 md:flex-none"
            >
              Kabul Et
            </Button>
          </div>
          <button
            onClick={handleReject}
            className="absolute top-4 right-4 md:static text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
