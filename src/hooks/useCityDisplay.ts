import { useMemo } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { getLocalizedCity, CityLocalization } from '@/lib/cityLocalizations';
import { CityInfo } from '@/lib/cities';

interface UseCityDisplayResult {
  displayName: string;
  displayCountry: string;
  localizedSlug: string;
  originalName: string;
  originalCountry: string;
}

/**
 * Hook to get localized city display information
 * Falls back to original city data if no localization is available
 */
export function useCityDisplay(city: CityInfo | null): UseCityDisplayResult {
  const { language } = useSettings();

  return useMemo(() => {
    if (!city) {
      return {
        displayName: '',
        displayCountry: '',
        localizedSlug: '',
        originalName: '',
        originalCountry: '',
      };
    }

    const localization = getLocalizedCity(city.slug, language);

    if (localization) {
      return {
        displayName: localization.name,
        displayCountry: localization.country,
        localizedSlug: localization.slug,
        originalName: city.name,
        originalCountry: city.country,
      };
    }

    // Fallback to original city data
    return {
      displayName: city.name,
      displayCountry: city.country,
      localizedSlug: city.slug,
      originalName: city.name,
      originalCountry: city.country,
    };
  }, [city, language]);
}

/**
 * Hook to get localized display info for multiple cities
 */
export function useCitiesDisplay(cities: CityInfo[]): Map<string, UseCityDisplayResult> {
  const { language } = useSettings();

  return useMemo(() => {
    const result = new Map<string, UseCityDisplayResult>();

    cities.forEach(city => {
      const localization = getLocalizedCity(city.slug, language);

      if (localization) {
        result.set(city.slug, {
          displayName: localization.name,
          displayCountry: localization.country,
          localizedSlug: localization.slug,
          originalName: city.name,
          originalCountry: city.country,
        });
      } else {
        result.set(city.slug, {
          displayName: city.name,
          displayCountry: city.country,
          localizedSlug: city.slug,
          originalName: city.name,
          originalCountry: city.country,
        });
      }
    });

    return result;
  }, [cities, language]);
}
