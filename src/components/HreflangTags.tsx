import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { generateHreflangLinks, getLanguageFromPath } from '@/lib/i18n-routes';

// Only TR and EN should be indexed — DE/FR/ES/AR noindex until content is ready
const INDEXED_LANGUAGES = ['tr', 'en'];

interface HreflangTagsProps {
  baseUrl?: string;
}

export function HreflangTags({ baseUrl = 'https://woonomad.co' }: HreflangTagsProps) {
  const location = useLocation();
  const currentLang = getLanguageFromPath(location.pathname);
  const shouldIndex = INDEXED_LANGUAGES.includes(currentLang);
  
  // Only generate hreflang for indexed languages
  const hreflangLinks = shouldIndex 
    ? generateHreflangLinks(location.pathname, baseUrl).filter(
        link => link.hreflang === 'x-default' || INDEXED_LANGUAGES.includes(link.hreflang.split('-')[0])
      )
    : [];
  
  return (
    <Helmet>
      {/* Current page language */}
      <html lang={currentLang} dir={currentLang === 'ar' ? 'rtl' : 'ltr'} />
      
      {/* noindex for non-primary languages */}
      {!shouldIndex && (
        <meta name="robots" content="noindex, nofollow" />
      )}
      
      {/* Canonical URL */}
      {shouldIndex && (
        <link rel="canonical" href={`${baseUrl}${location.pathname}`} />
      )}
      
      {/* Hreflang tags only for indexed language versions */}
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
