import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AdSense({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  className = '',
  style 
}: AdSenseProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style || { display: 'block' }}
        data-ad-client="ca-pub-8614552230353945"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

// Predefined ad formats for common use cases
export function AdBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`my-6 ${className}`}>
      <AdSense 
        slot="YOUR_BANNER_SLOT_ID" 
        format="horizontal"
        style={{ display: 'block', minHeight: '90px' }}
      />
    </div>
  );
}

export function AdInArticle({ className = '' }: { className?: string }) {
  return (
    <div className={`my-8 ${className}`}>
      <AdSense 
        slot="YOUR_IN_ARTICLE_SLOT_ID" 
        format="fluid"
        style={{ display: 'block', textAlign: 'center' }}
      />
    </div>
  );
}

export function AdSidebar({ className = '' }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <AdSense 
        slot="YOUR_SIDEBAR_SLOT_ID" 
        format="vertical"
        style={{ display: 'block', minHeight: '250px' }}
      />
    </div>
  );
}

export function AdResponsive({ className = '' }: { className?: string }) {
  return (
    <div className={`my-6 ${className}`}>
      <AdSense 
        slot="YOUR_RESPONSIVE_SLOT_ID" 
        format="auto"
        responsive={true}
        style={{ display: 'block' }}
      />
    </div>
  );
}
