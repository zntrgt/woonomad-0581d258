import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSettings, Language } from '@/contexts/SettingsContext';
import { getLanguageFromPath, supportedLanguages, defaultLanguage, routeTranslations } from '@/lib/i18n-routes';

interface LanguageRouterProps {
  children: React.ReactNode;
}

export function LanguageRouter({ children }: LanguageRouterProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useSettings();
  
  useEffect(() => {
    // Detect language from URL
    const urlLanguage = getLanguageFromPath(location.pathname);
    
    // If URL language differs from context, update context
    if (urlLanguage !== language) {
      setLanguage(urlLanguage);
    }
  }, [location.pathname]);
  
  return <>{children}</>;
}

// Helper to normalize path for matching
export function normalizePathToTr(pathname: string, currentLang: Language): string {
  // Remove language prefix if present
  let normalizedPath = pathname;
  if (currentLang !== defaultLanguage) {
    normalizedPath = pathname.replace(new RegExp(`^/${currentLang}`), '') || '/';
  }
  
  // Convert route segments to TR base
  const langRoutes = routeTranslations[currentLang];
  const trRoutes = routeTranslations.tr;
  
  Object.entries(langRoutes).forEach(([key, value]) => {
    const trValue = trRoutes[key];
    if (trValue && value !== trValue) {
      normalizedPath = normalizedPath.replace(new RegExp(`/${value}(?=/|$)`, 'g'), `/${trValue}`);
    }
  });
  
  return normalizedPath;
}

// Hook to get normalized TR path from any language URL
export function useNormalizedPath() {
  const location = useLocation();
  const currentLang = getLanguageFromPath(location.pathname);
  return normalizePathToTr(location.pathname, currentLang);
}
