import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSenseProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// Google AdSense Client ID
const ADSENSE_CLIENT_ID = "ca-pub-8614552230353945";

/**
 * AdSense Component
 * 
 * NOTE: Otomatik reklamlar (auto-ads) aktifse, bu komponent genellikle gereksizdir.
 * Google otomatik olarak en uygun yerlere reklam yerleştirir.
 * 
 * Manuel reklam slotları kullanmak isterseniz:
 * 1. AdSense panelinden slot ID alın
 * 2. slot prop'unu doldurun
 */
export function AdSense({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  className = '',
  style 
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Auto-ads aktifse ve slot belirtilmemişse, reklam yükleme
    if (!slot) {
      console.info('AdSense: No slot provided. Using auto-ads.');
      return;
    }

    // Sadece bir kez yükle
    if (isLoaded.current) return;

    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle && adRef.current) {
          window.adsbygoogle.push({});
          isLoaded.current = true;
        }
      } catch (error) {
        console.warn('AdSense yüklenemedi:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [slot]);

  // Slot yoksa, auto-ads çalışsın - placeholder gösterme
  if (!slot) {
    return null;
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style || { display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

/**
 * Predefined ad formats for common use cases
 * 
 * NOT: Otomatik reklamlar aktifken bu komponentler boş döner.
 * Manuel slot kullanmak için slot prop'unu geçin.
 */
export function AdBanner({ className = '', slot }: { className?: string; slot?: string }) {
  if (!slot) return null;
  
  return (
    <div className={`my-6 ${className}`}>
      <AdSense 
        slot={slot} 
        format="horizontal"
        style={{ display: 'block', minHeight: '90px' }}
      />
    </div>
  );
}

export function AdInArticle({ className = '', slot }: { className?: string; slot?: string }) {
  if (!slot) return null;
  
  return (
    <div className={`my-8 ${className}`}>
      <AdSense 
        slot={slot} 
        format="fluid"
        style={{ display: 'block', textAlign: 'center' }}
      />
    </div>
  );
}

export function AdSidebar({ className = '', slot }: { className?: string; slot?: string }) {
  if (!slot) return null;
  
  return (
    <div className={`${className}`}>
      <AdSense 
        slot={slot} 
        format="vertical"
        style={{ display: 'block', minHeight: '250px' }}
      />
    </div>
  );
}

export function AdResponsive({ className = '', slot }: { className?: string; slot?: string }) {
  if (!slot) return null;
  
  return (
    <div className={`my-6 ${className}`}>
      <AdSense 
        slot={slot} 
        format="auto"
        responsive={true}
        style={{ display: 'block' }}
      />
    </div>
  );
}
