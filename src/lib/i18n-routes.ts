import { Language } from '@/contexts/SettingsContext';

// Route translations for each language
export const routeTranslations: Record<Language, Record<string, string>> = {
  tr: {
    // TR is default, no prefix needed
    city: 'sehir',
    cities: 'sehirler',
    hotels: 'oteller',
    hotel: 'otel',
    flights: 'ucuslar',
    flight: 'ucus',
    nomad: 'nomad',
    coworking: 'coworking',
    blog: 'blog',
    account: 'hesabim',
    auth: 'auth',
    'nomad-hub': 'dijital-gocebe',
    'privacy-policy': 'gizlilik-politikasi',
    'terms-of-service': 'kullanim-kosullari',
    'cookie-policy': 'cerez-politikasi',
    kvkk: 'kvkk',
  },
  en: {
    city: 'city',
    cities: 'cities',
    hotels: 'hotels',
    hotel: 'hotel',
    flights: 'flights',
    flight: 'flight',
    nomad: 'nomad',
    coworking: 'coworking',
    blog: 'blog',
    account: 'account',
    auth: 'auth',
    'nomad-hub': 'digital-nomad',
    'privacy-policy': 'privacy-policy',
    'terms-of-service': 'terms-of-service',
    'cookie-policy': 'cookie-policy',
    kvkk: 'data-protection',
  },
  de: {
    city: 'stadt',
    cities: 'staedte',
    hotels: 'hotels',
    hotel: 'hotel',
    flights: 'fluege',
    flight: 'flug',
    nomad: 'nomad',
    coworking: 'coworking',
    blog: 'blog',
    account: 'konto',
    auth: 'auth',
    'nomad-hub': 'digitale-nomaden',
    'privacy-policy': 'datenschutz',
    'terms-of-service': 'nutzungsbedingungen',
    'cookie-policy': 'cookie-richtlinie',
    kvkk: 'datenschutz',
  },
  fr: {
    city: 'ville',
    cities: 'villes',
    hotels: 'hotels',
    hotel: 'hotel',
    flights: 'vols',
    flight: 'vol',
    nomad: 'nomade',
    coworking: 'coworking',
    blog: 'blog',
    account: 'compte',
    auth: 'auth',
    'nomad-hub': 'nomade-numerique',
    'privacy-policy': 'politique-de-confidentialite',
    'terms-of-service': 'conditions-utilisation',
    'cookie-policy': 'politique-cookies',
    kvkk: 'protection-donnees',
  },
  es: {
    city: 'ciudad',
    cities: 'ciudades',
    hotels: 'hoteles',
    hotel: 'hotel',
    flights: 'vuelos',
    flight: 'vuelo',
    nomad: 'nomada',
    coworking: 'coworking',
    blog: 'blog',
    account: 'cuenta',
    auth: 'auth',
    'nomad-hub': 'nomada-digital',
    'privacy-policy': 'politica-privacidad',
    'terms-of-service': 'terminos-servicio',
    'cookie-policy': 'politica-cookies',
    kvkk: 'proteccion-datos',
  },
  ar: {
    city: 'city',
    cities: 'cities',
    hotels: 'hotels',
    hotel: 'hotel',
    flights: 'flights',
    flight: 'flight',
    nomad: 'nomad',
    coworking: 'coworking',
    blog: 'blog',
    account: 'account',
    auth: 'auth',
    'nomad-hub': 'digital-nomad',
    'privacy-policy': 'privacy-policy',
    'terms-of-service': 'terms-of-service',
    'cookie-policy': 'cookie-policy',
    kvkk: 'data-protection',
  },
};

// Supported languages with their URL prefixes
export const supportedLanguages: Language[] = ['tr', 'en', 'de', 'fr', 'es', 'ar'];
export const defaultLanguage: Language = 'tr';

// Get language from URL path
export function getLanguageFromPath(pathname: string): Language {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  // Check if first segment is a language code (excluding tr which has no prefix)
  if (firstSegment && supportedLanguages.includes(firstSegment as Language) && firstSegment !== 'tr') {
    return firstSegment as Language;
  }
  
  return defaultLanguage;
}

// Build localized URL
export function buildLocalizedUrl(
  basePath: string,
  lang: Language,
  params?: Record<string, string>
): string {
  const routes = routeTranslations[lang];
  let path = basePath;
  
  // Replace route segments with translations
  Object.entries(routes).forEach(([key, value]) => {
    const trValue = routeTranslations.tr[key];
    if (trValue) {
      path = path.replace(new RegExp(`/${trValue}(?=/|$)`, 'g'), `/${value}`);
    }
  });
  
  // Replace params
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, value);
    });
  }
  
  // Add language prefix for non-default languages
  if (lang !== defaultLanguage) {
    path = `/${lang}${path}`;
  }
  
  return path;
}

// Convert any URL to a specific language version
export function translateUrl(currentPath: string, targetLang: Language): string {
  const currentLang = getLanguageFromPath(currentPath);
  
  // Remove current language prefix if exists
  let normalizedPath = currentPath;
  if (currentLang !== defaultLanguage) {
    normalizedPath = currentPath.replace(new RegExp(`^/${currentLang}`), '');
  }
  
  // Convert path segments back to TR (base language)
  const currentRoutes = routeTranslations[currentLang];
  const trRoutes = routeTranslations.tr;
  
  Object.entries(currentRoutes).forEach(([key, value]) => {
    const trValue = trRoutes[key];
    if (trValue && value !== trValue) {
      normalizedPath = normalizedPath.replace(new RegExp(`/${value}(?=/|$)`, 'g'), `/${trValue}`);
    }
  });
  
  // Now convert from TR to target language
  return buildLocalizedUrl(normalizedPath, targetLang);
}

// Get all alternate URLs for hreflang tags
export function getAlternateUrls(
  basePath: string,
  baseUrl: string = 'https://woonomad.co'
): { lang: Language; url: string }[] {
  return supportedLanguages.map(lang => ({
    lang,
    url: `${baseUrl}${translateUrl(basePath, lang)}`,
  }));
}

// Generate hreflang link elements
export function generateHreflangLinks(
  currentPath: string,
  baseUrl: string = 'https://woonomad.co'
): { rel: string; hreflang: string; href: string }[] {
  const alternates = getAlternateUrls(currentPath, baseUrl);
  
  const links = alternates.map(({ lang, url }) => ({
    rel: 'alternate',
    hreflang: lang === 'tr' ? 'tr-TR' : lang === 'en' ? 'en' : `${lang}`,
    href: url,
  }));
  
  // Add x-default (points to default language version)
  const defaultUrl = alternates.find(a => a.lang === defaultLanguage)?.url || `${baseUrl}/`;
  links.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: defaultUrl,
  });
  
  return links;
}

// Route pattern matching for dynamic segments
export interface RoutePattern {
  pattern: string;
  trPattern: string;
  params: string[];
}

export const routePatterns: RoutePattern[] = [
  { pattern: 'city/:slug', trPattern: 'sehir/:slug', params: ['slug'] },
  { pattern: 'city/:slug/hotels', trPattern: 'sehir/:slug/oteller', params: ['slug'] },
  { pattern: 'city/:citySlug/hotel/:hotelSlug', trPattern: 'sehir/:citySlug/otel/:hotelSlug', params: ['citySlug', 'hotelSlug'] },
  { pattern: 'city/:slug/flights', trPattern: 'sehir/:slug/ucuslar', params: ['slug'] },
  { pattern: 'city/:slug/nomad', trPattern: 'sehir/:slug/nomad', params: ['slug'] },
  { pattern: 'city/:slug/coworking', trPattern: 'sehir/:slug/coworking', params: ['slug'] },
  { pattern: 'cities', trPattern: 'sehirler', params: [] },
  { pattern: 'hotels', trPattern: 'oteller', params: [] },
  { pattern: 'flights', trPattern: 'ucuslar', params: [] },
  { pattern: 'flight/:slug', trPattern: 'ucus/:slug', params: ['slug'] },
  { pattern: 'blog', trPattern: 'blog', params: [] },
  { pattern: 'blog/:slug', trPattern: 'blog/:slug', params: ['slug'] },
];
