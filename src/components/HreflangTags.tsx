import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { generateHreflangLinks, getLanguageFromPath } from '@/lib/i18n-routes';

interface HreflangTagsProps {
  baseUrl?: string;
}

export function HreflangTags({ baseUrl = 'https://woonomad.co' }: HreflangTagsProps) {
  const location = useLocation();
  const currentLang = getLanguageFromPath(location.pathname);
  const hreflangLinks = generateHreflangLinks(location.pathname, baseUrl);
  
  return (
    <Helmet>
      {/* Current page language */}
      <html lang={currentLang} dir={currentLang === 'ar' ? 'rtl' : 'ltr'} />
      
      {/* Hreflang tags for all language versions */}
      {hreflangLinks.map((link, index) => (
        <link
          key={index}
          rel={link.rel}
          hrefLang={link.hreflang}
          href={link.href}
        />
      ))}
    </Helmet>
  );
}
