import { useSettings } from '@/contexts/SettingsContext';
import { translateUrl, getLanguageFromPath, routeTranslations, defaultLanguage } from '@/lib/i18n-routes';

// Import route config - defined separately to avoid circular dependency
const routeConfig = {
  home: { tr: '/', en: '/', de: '/', fr: '/', es: '/', ar: '/' },
  cities: { tr: '/sehirler', en: '/cities', de: '/staedte', fr: '/villes', es: '/ciudades', ar: '/cities' },
  city: { tr: '/sehir/:slug', en: '/city/:slug', de: '/stadt/:slug', fr: '/ville/:slug', es: '/ciudad/:slug', ar: '/city/:slug' },
  cityHotels: { tr: '/sehir/:slug/oteller', en: '/city/:slug/hotels', de: '/stadt/:slug/hotels', fr: '/ville/:slug/hotels', es: '/ciudad/:slug/hoteles', ar: '/city/:slug/hotels' },
  cityHotelDetail: { tr: '/sehir/:citySlug/otel/:hotelSlug', en: '/city/:citySlug/hotel/:hotelSlug', de: '/stadt/:citySlug/hotel/:hotelSlug', fr: '/ville/:citySlug/hotel/:hotelSlug', es: '/ciudad/:citySlug/hotel/:hotelSlug', ar: '/city/:citySlug/hotel/:hotelSlug' },
  cityFlights: { tr: '/sehir/:slug/ucuslar', en: '/city/:slug/flights', de: '/stadt/:slug/fluege', fr: '/ville/:slug/vols', es: '/ciudad/:slug/vuelos', ar: '/city/:slug/flights' },
  cityNomad: { tr: '/sehir/:slug/nomad', en: '/city/:slug/nomad', de: '/stadt/:slug/nomad', fr: '/ville/:slug/nomade', es: '/ciudad/:slug/nomada', ar: '/city/:slug/nomad' },
  hotels: { tr: '/oteller', en: '/hotels', de: '/hotels', fr: '/hotels', es: '/hoteles', ar: '/hotels' },
  flights: { tr: '/ucuslar', en: '/flights', de: '/fluege', fr: '/vols', es: '/vuelos', ar: '/flights' },
  nomadHub: { tr: '/dijital-gocebe', en: '/digital-nomad', de: '/digitale-nomaden', fr: '/nomade-numerique', es: '/nomada-digital', ar: '/digital-nomad' },
  blog: { tr: '/blog', en: '/blog', de: '/blog', fr: '/blog', es: '/blog', ar: '/blog' },
  blogAdmin: { tr: '/admin/blog', en: '/admin/blog', de: '/admin/blog', fr: '/admin/blog', es: '/admin/blog', ar: '/admin/blog' },
  account: { tr: '/hesabim', en: '/account', de: '/konto', fr: '/compte', es: '/cuenta', ar: '/account' },
} as const;

// Hook to generate localized links
export function useLocalizedLink() {
  const { language } = useSettings();
  
  // Generate a localized path from a base TR path
  const getLocalizedPath = (trPath: string): string => {
    if (language === 'tr') return trPath;
    return translateUrl(trPath, language);
  };
  
  return { getLocalizedPath, language };
}

// Hook to get localized route paths based on current language
export function useLocalizedRoutes() {
  const { language } = useSettings();
  
  const getRoute = (routeKey: keyof typeof routeConfig, params?: Record<string, string>): string => {
    const langKey = language as keyof typeof routeConfig.home;
    let path: string = routeConfig[routeKey][langKey] || routeConfig[routeKey].tr;
    
    // Add language prefix for non-default languages
    if (language !== defaultLanguage) {
      path = `/${language}${path}`;
    }
    
    // Replace params
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        path = path.replace(`:${key}`, value);
      });
    }
    
    return path;
  };
  
  return { getRoute, language };
}

// Get params from any language URL normalized to base keys
export function extractParamsFromPath(pathname: string): Record<string, string> {
  const lang = getLanguageFromPath(pathname);
  let normalizedPath = pathname;
  
  // Remove language prefix
  if (lang !== defaultLanguage) {
    normalizedPath = pathname.replace(new RegExp(`^/${lang}`), '');
  }
  
  // Extract slug patterns
  const segments = normalizedPath.split('/').filter(Boolean);
  const params: Record<string, string> = {};
  
  // Common patterns: /sehir/:slug, /sehir/:citySlug/otel/:hotelSlug, etc.
  const routes = routeTranslations[lang];
  
  // City page patterns
  if (segments[0] === routes.city || segments[0] === 'sehir' || segments[0] === 'city' || segments[0] === 'stadt' || segments[0] === 'ville' || segments[0] === 'ciudad') {
    if (segments[1]) params.slug = segments[1];
    if (segments[1]) params.citySlug = segments[1];
    if (segments[3]) params.hotelSlug = segments[3];
  }
  
  // Flight route patterns
  if (segments[0] === routes.flight || segments[0] === 'ucus' || segments[0] === 'flight' || segments[0] === 'flug' || segments[0] === 'vol' || segments[0] === 'vuelo') {
    if (segments[1]) params.slug = segments[1];
  }
  
  // Blog patterns
  if (segments[0] === 'blog' && segments[1]) {
    params.slug = segments[1];
  }
  
  return params;
}
