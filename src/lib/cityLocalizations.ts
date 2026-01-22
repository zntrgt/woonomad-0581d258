import { Language } from '@/contexts/SettingsContext';

export interface CityLocalization {
  name: string;
  country: string;
  slug: string; // Localized slug for URL
}

// City localizations for all supported languages
// Format: citySlug -> Language -> CityLocalization
export const cityLocalizations: Record<string, Record<Language, CityLocalization>> = {
  // === TÜRKİYE ===
  'istanbul': {
    tr: { name: 'İstanbul', country: 'Türkiye', slug: 'istanbul' },
    en: { name: 'Istanbul', country: 'Turkey', slug: 'istanbul' },
    de: { name: 'Istanbul', country: 'Türkei', slug: 'istanbul' },
    fr: { name: 'Istanbul', country: 'Turquie', slug: 'istanbul' },
    es: { name: 'Estambul', country: 'Turquía', slug: 'estambul' },
    ar: { name: 'إسطنبول', country: 'تركيا', slug: 'istanbul' },
  },
  'antalya': {
    tr: { name: 'Antalya', country: 'Türkiye', slug: 'antalya' },
    en: { name: 'Antalya', country: 'Turkey', slug: 'antalya' },
    de: { name: 'Antalya', country: 'Türkei', slug: 'antalya' },
    fr: { name: 'Antalya', country: 'Turquie', slug: 'antalya' },
    es: { name: 'Antalya', country: 'Turquía', slug: 'antalya' },
    ar: { name: 'أنطاليا', country: 'تركيا', slug: 'antalya' },
  },
  'izmir': {
    tr: { name: 'İzmir', country: 'Türkiye', slug: 'izmir' },
    en: { name: 'Izmir', country: 'Turkey', slug: 'izmir' },
    de: { name: 'Izmir', country: 'Türkei', slug: 'izmir' },
    fr: { name: 'Izmir', country: 'Turquie', slug: 'izmir' },
    es: { name: 'Esmirna', country: 'Turquía', slug: 'esmirna' },
    ar: { name: 'إزمير', country: 'تركيا', slug: 'izmir' },
  },
  'bodrum': {
    tr: { name: 'Bodrum', country: 'Türkiye', slug: 'bodrum' },
    en: { name: 'Bodrum', country: 'Turkey', slug: 'bodrum' },
    de: { name: 'Bodrum', country: 'Türkei', slug: 'bodrum' },
    fr: { name: 'Bodrum', country: 'Turquie', slug: 'bodrum' },
    es: { name: 'Bodrum', country: 'Turquía', slug: 'bodrum' },
    ar: { name: 'بودروم', country: 'تركيا', slug: 'bodrum' },
  },
  'ankara': {
    tr: { name: 'Ankara', country: 'Türkiye', slug: 'ankara' },
    en: { name: 'Ankara', country: 'Turkey', slug: 'ankara' },
    de: { name: 'Ankara', country: 'Türkei', slug: 'ankara' },
    fr: { name: 'Ankara', country: 'Turquie', slug: 'ankara' },
    es: { name: 'Ankara', country: 'Turquía', slug: 'ankara' },
    ar: { name: 'أنقرة', country: 'تركيا', slug: 'ankara' },
  },
  'kapadokya': {
    tr: { name: 'Kapadokya', country: 'Türkiye', slug: 'kapadokya' },
    en: { name: 'Cappadocia', country: 'Turkey', slug: 'cappadocia' },
    de: { name: 'Kappadokien', country: 'Türkei', slug: 'kappadokien' },
    fr: { name: 'Cappadoce', country: 'Turquie', slug: 'cappadoce' },
    es: { name: 'Capadocia', country: 'Turquía', slug: 'capadocia' },
    ar: { name: 'كابادوكيا', country: 'تركيا', slug: 'kapadokya' },
  },
  'trabzon': {
    tr: { name: 'Trabzon', country: 'Türkiye', slug: 'trabzon' },
    en: { name: 'Trabzon', country: 'Turkey', slug: 'trabzon' },
    de: { name: 'Trabzon', country: 'Türkei', slug: 'trabzon' },
    fr: { name: 'Trabzon', country: 'Turquie', slug: 'trabzon' },
    es: { name: 'Trebisonda', country: 'Turquía', slug: 'trebisonda' },
    ar: { name: 'طرابزون', country: 'تركيا', slug: 'trabzon' },
  },
  // === AVRUPA ===
  'paris': {
    tr: { name: 'Paris', country: 'Fransa', slug: 'paris' },
    en: { name: 'Paris', country: 'France', slug: 'paris' },
    de: { name: 'Paris', country: 'Frankreich', slug: 'paris' },
    fr: { name: 'Paris', country: 'France', slug: 'paris' },
    es: { name: 'París', country: 'Francia', slug: 'paris' },
    ar: { name: 'باريس', country: 'فرنسا', slug: 'paris' },
  },
  'london': {
    tr: { name: 'Londra', country: 'İngiltere', slug: 'londra' },
    en: { name: 'London', country: 'United Kingdom', slug: 'london' },
    de: { name: 'London', country: 'Vereinigtes Königreich', slug: 'london' },
    fr: { name: 'Londres', country: 'Royaume-Uni', slug: 'londres' },
    es: { name: 'Londres', country: 'Reino Unido', slug: 'londres' },
    ar: { name: 'لندن', country: 'المملكة المتحدة', slug: 'london' },
  },
  'barcelona': {
    tr: { name: 'Barselona', country: 'İspanya', slug: 'barselona' },
    en: { name: 'Barcelona', country: 'Spain', slug: 'barcelona' },
    de: { name: 'Barcelona', country: 'Spanien', slug: 'barcelona' },
    fr: { name: 'Barcelone', country: 'Espagne', slug: 'barcelone' },
    es: { name: 'Barcelona', country: 'España', slug: 'barcelona' },
    ar: { name: 'برشلونة', country: 'إسبانيا', slug: 'barcelona' },
  },
  'rome': {
    tr: { name: 'Roma', country: 'İtalya', slug: 'roma' },
    en: { name: 'Rome', country: 'Italy', slug: 'rome' },
    de: { name: 'Rom', country: 'Italien', slug: 'rom' },
    fr: { name: 'Rome', country: 'Italie', slug: 'rome' },
    es: { name: 'Roma', country: 'Italia', slug: 'roma' },
    ar: { name: 'روما', country: 'إيطاليا', slug: 'rome' },
  },
  'amsterdam': {
    tr: { name: 'Amsterdam', country: 'Hollanda', slug: 'amsterdam' },
    en: { name: 'Amsterdam', country: 'Netherlands', slug: 'amsterdam' },
    de: { name: 'Amsterdam', country: 'Niederlande', slug: 'amsterdam' },
    fr: { name: 'Amsterdam', country: 'Pays-Bas', slug: 'amsterdam' },
    es: { name: 'Ámsterdam', country: 'Países Bajos', slug: 'amsterdam' },
    ar: { name: 'أمستردام', country: 'هولندا', slug: 'amsterdam' },
  },
  'berlin': {
    tr: { name: 'Berlin', country: 'Almanya', slug: 'berlin' },
    en: { name: 'Berlin', country: 'Germany', slug: 'berlin' },
    de: { name: 'Berlin', country: 'Deutschland', slug: 'berlin' },
    fr: { name: 'Berlin', country: 'Allemagne', slug: 'berlin' },
    es: { name: 'Berlín', country: 'Alemania', slug: 'berlin' },
    ar: { name: 'برلين', country: 'ألمانيا', slug: 'berlin' },
  },
  'vienna': {
    tr: { name: 'Viyana', country: 'Avusturya', slug: 'viyana' },
    en: { name: 'Vienna', country: 'Austria', slug: 'vienna' },
    de: { name: 'Wien', country: 'Österreich', slug: 'wien' },
    fr: { name: 'Vienne', country: 'Autriche', slug: 'vienne' },
    es: { name: 'Viena', country: 'Austria', slug: 'viena' },
    ar: { name: 'فيينا', country: 'النمسا', slug: 'vienna' },
  },
  'prague': {
    tr: { name: 'Prag', country: 'Çekya', slug: 'prag' },
    en: { name: 'Prague', country: 'Czech Republic', slug: 'prague' },
    de: { name: 'Prag', country: 'Tschechien', slug: 'prag' },
    fr: { name: 'Prague', country: 'Tchéquie', slug: 'prague' },
    es: { name: 'Praga', country: 'República Checa', slug: 'praga' },
    ar: { name: 'براغ', country: 'التشيك', slug: 'prague' },
  },
  'athens': {
    tr: { name: 'Atina', country: 'Yunanistan', slug: 'atina' },
    en: { name: 'Athens', country: 'Greece', slug: 'athens' },
    de: { name: 'Athen', country: 'Griechenland', slug: 'athen' },
    fr: { name: 'Athènes', country: 'Grèce', slug: 'athenes' },
    es: { name: 'Atenas', country: 'Grecia', slug: 'atenas' },
    ar: { name: 'أثينا', country: 'اليونان', slug: 'athens' },
  },
  'lisbon': {
    tr: { name: 'Lizbon', country: 'Portekiz', slug: 'lizbon' },
    en: { name: 'Lisbon', country: 'Portugal', slug: 'lisbon' },
    de: { name: 'Lissabon', country: 'Portugal', slug: 'lissabon' },
    fr: { name: 'Lisbonne', country: 'Portugal', slug: 'lisbonne' },
    es: { name: 'Lisboa', country: 'Portugal', slug: 'lisboa' },
    ar: { name: 'لشبونة', country: 'البرتغال', slug: 'lisbon' },
  },
  // === BALKANLAR ===
  'tbilisi': {
    tr: { name: 'Tiflis', country: 'Gürcistan', slug: 'tiflis' },
    en: { name: 'Tbilisi', country: 'Georgia', slug: 'tbilisi' },
    de: { name: 'Tiflis', country: 'Georgien', slug: 'tiflis' },
    fr: { name: 'Tbilissi', country: 'Géorgie', slug: 'tbilissi' },
    es: { name: 'Tiflis', country: 'Georgia', slug: 'tiflis' },
    ar: { name: 'تبليسي', country: 'جورجيا', slug: 'tbilisi' },
  },
  'skopje': {
    tr: { name: 'Üsküp', country: 'Kuzey Makedonya', slug: 'uskup' },
    en: { name: 'Skopje', country: 'North Macedonia', slug: 'skopje' },
    de: { name: 'Skopje', country: 'Nordmazedonien', slug: 'skopje' },
    fr: { name: 'Skopje', country: 'Macédoine du Nord', slug: 'skopje' },
    es: { name: 'Skopie', country: 'Macedonia del Norte', slug: 'skopie' },
    ar: { name: 'سكوبيه', country: 'مقدونيا الشمالية', slug: 'skopje' },
  },
  'sofia': {
    tr: { name: 'Sofya', country: 'Bulgaristan', slug: 'sofya' },
    en: { name: 'Sofia', country: 'Bulgaria', slug: 'sofia' },
    de: { name: 'Sofia', country: 'Bulgarien', slug: 'sofia' },
    fr: { name: 'Sofia', country: 'Bulgarie', slug: 'sofia' },
    es: { name: 'Sofía', country: 'Bulgaria', slug: 'sofia' },
    ar: { name: 'صوفيا', country: 'بلغاريا', slug: 'sofia' },
  },
  'belgrade': {
    tr: { name: 'Belgrad', country: 'Sırbistan', slug: 'belgrad' },
    en: { name: 'Belgrade', country: 'Serbia', slug: 'belgrade' },
    de: { name: 'Belgrad', country: 'Serbien', slug: 'belgrad' },
    fr: { name: 'Belgrade', country: 'Serbie', slug: 'belgrade' },
    es: { name: 'Belgrado', country: 'Serbia', slug: 'belgrado' },
    ar: { name: 'بلغراد', country: 'صربيا', slug: 'belgrade' },
  },
  // === ASYA ===
  'tokyo': {
    tr: { name: 'Tokyo', country: 'Japonya', slug: 'tokyo' },
    en: { name: 'Tokyo', country: 'Japan', slug: 'tokyo' },
    de: { name: 'Tokio', country: 'Japan', slug: 'tokio' },
    fr: { name: 'Tokyo', country: 'Japon', slug: 'tokyo' },
    es: { name: 'Tokio', country: 'Japón', slug: 'tokio' },
    ar: { name: 'طوكيو', country: 'اليابان', slug: 'tokyo' },
  },
  'bangkok': {
    tr: { name: 'Bangkok', country: 'Tayland', slug: 'bangkok' },
    en: { name: 'Bangkok', country: 'Thailand', slug: 'bangkok' },
    de: { name: 'Bangkok', country: 'Thailand', slug: 'bangkok' },
    fr: { name: 'Bangkok', country: 'Thaïlande', slug: 'bangkok' },
    es: { name: 'Bangkok', country: 'Tailandia', slug: 'bangkok' },
    ar: { name: 'بانكوك', country: 'تايلاند', slug: 'bangkok' },
  },
  'bali': {
    tr: { name: 'Bali', country: 'Endonezya', slug: 'bali' },
    en: { name: 'Bali', country: 'Indonesia', slug: 'bali' },
    de: { name: 'Bali', country: 'Indonesien', slug: 'bali' },
    fr: { name: 'Bali', country: 'Indonésie', slug: 'bali' },
    es: { name: 'Bali', country: 'Indonesia', slug: 'bali' },
    ar: { name: 'بالي', country: 'إندونيسيا', slug: 'bali' },
  },
  'singapore': {
    tr: { name: 'Singapur', country: 'Singapur', slug: 'singapur' },
    en: { name: 'Singapore', country: 'Singapore', slug: 'singapore' },
    de: { name: 'Singapur', country: 'Singapur', slug: 'singapur' },
    fr: { name: 'Singapour', country: 'Singapour', slug: 'singapour' },
    es: { name: 'Singapur', country: 'Singapur', slug: 'singapur' },
    ar: { name: 'سنغافورة', country: 'سنغافورة', slug: 'singapore' },
  },
  'dubai': {
    tr: { name: 'Dubai', country: 'BAE', slug: 'dubai' },
    en: { name: 'Dubai', country: 'UAE', slug: 'dubai' },
    de: { name: 'Dubai', country: 'VAE', slug: 'dubai' },
    fr: { name: 'Dubaï', country: 'EAU', slug: 'dubai' },
    es: { name: 'Dubái', country: 'EAU', slug: 'dubai' },
    ar: { name: 'دبي', country: 'الإمارات', slug: 'dubai' },
  },
};

// Get localized city info
export function getLocalizedCity(
  citySlug: string, 
  language: Language
): CityLocalization | null {
  const normalizedSlug = citySlug.toLowerCase();
  
  // First try direct match
  if (cityLocalizations[normalizedSlug]) {
    return cityLocalizations[normalizedSlug][language] || cityLocalizations[normalizedSlug].tr;
  }
  
  // Then try to find by localized slug
  for (const [baseSlug, localizations] of Object.entries(cityLocalizations)) {
    for (const [lang, localization] of Object.entries(localizations)) {
      if (localization.slug === normalizedSlug) {
        return localizations[language] || localizations.tr;
      }
    }
  }
  
  return null;
}

// Get base slug from any localized slug
export function getBaseCitySlug(localizedSlug: string): string {
  const normalizedSlug = localizedSlug.toLowerCase();
  
  // First check if it's already a base slug
  if (cityLocalizations[normalizedSlug]) {
    return normalizedSlug;
  }
  
  // Search through all localizations
  for (const [baseSlug, localizations] of Object.entries(cityLocalizations)) {
    for (const localization of Object.values(localizations)) {
      if (localization.slug === normalizedSlug) {
        return baseSlug;
      }
    }
  }
  
  // Return as-is if not found
  return normalizedSlug;
}

// Get localized slug for a city
export function getLocalizedCitySlug(baseSlug: string, language: Language): string {
  const normalizedSlug = baseSlug.toLowerCase();
  
  if (cityLocalizations[normalizedSlug]) {
    return cityLocalizations[normalizedSlug][language]?.slug || normalizedSlug;
  }
  
  return normalizedSlug;
}

// Hook-friendly helper to get display name and country
export function useCityLocalization(citySlug: string, language: Language): {
  displayName: string;
  displayCountry: string;
  localizedSlug: string;
} {
  const localization = getLocalizedCity(citySlug, language);
  
  if (localization) {
    return {
      displayName: localization.name,
      displayCountry: localization.country,
      localizedSlug: localization.slug,
    };
  }
  
  // Fallback to original slug formatted as name
  return {
    displayName: citySlug.charAt(0).toUpperCase() + citySlug.slice(1),
    displayCountry: '',
    localizedSlug: citySlug,
  };
}
