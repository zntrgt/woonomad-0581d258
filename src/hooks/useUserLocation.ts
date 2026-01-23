import { useState, useEffect, useCallback } from 'react';

export interface UserLocationData {
  // Detected from IP/geolocation
  detectedCountryCode: string | null;
  detectedAirportCode: string | null;
  // User preference (can override detection)
  preferredNationality: string | null;
  preferredAirportCode: string | null;
  // Computed values
  originAirport: string;
  nationality: string;
  isLoading: boolean;
}

// Country code to main airport mapping
const COUNTRY_AIRPORTS: Record<string, string> = {
  'TR': 'IST',
  'DE': 'FRA',
  'GB': 'LHR',
  'FR': 'CDG',
  'ES': 'MAD',
  'IT': 'FCO',
  'NL': 'AMS',
  'BE': 'BRU',
  'AT': 'VIE',
  'CH': 'ZRH',
  'US': 'JFK',
  'AE': 'DXB',
  'SA': 'RUH',
  'GR': 'ATH',
  'GE': 'TBS',
  'AZ': 'GYD',
  'KZ': 'NQZ',
  'UA': 'KBP',
  'PL': 'WAW',
  'RU': 'SVO',
  'JP': 'NRT',
  'KR': 'ICN',
  'CN': 'PEK',
  'SG': 'SIN',
  'TH': 'BKK',
  'MY': 'KUL',
  'ID': 'CGK',
  'AU': 'SYD',
  'NZ': 'AKL',
  'BR': 'GRU',
  'MX': 'MEX',
  'CA': 'YYZ',
  'EG': 'CAI',
  'MA': 'CMN',
  'ZA': 'JNB',
  'IN': 'DEL',
};

// Turkish passport visa requirements by destination country code
const TURKISH_VISA_FREE: Set<string> = new Set([
  // Domestic
  'TR',
  // Balkans
  'AL', 'XK', 'MK', 'BA', 'ME', 'RS',
  // Other visa-free
  'GE', 'AZ', 'KZ', 'KG', 'UZ', 'TJ', 'TM',
  'KR', 'JP', 'SG', 'MY', 'TH', 'ID', 'PH', 'HK', 'MO',
  'BR', 'AR', 'CL', 'CO', 'PE', 'EC', 'PA', 'CR', 'MX',
  'MA', 'TN', 'JO', 'QA', 'BH', 'OM', 'KW',
  'UA', 'MD', 'BY',
  // Add more as needed
]);

// German passport visa requirements (mostly visa-free worldwide)
const GERMAN_VISA_FREE: Set<string> = new Set([
  // Schengen + EU
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  // Global visa-free
  'US', 'CA', 'GB', 'AU', 'NZ', 'JP', 'KR', 'SG', 'MY', 'TH', 'ID', 'BR', 'AR', 'CL', 'MX', 'TR', 'AE', 'IL', 'ZA', 'EG', 'MA', 'TN',
  // Most countries are visa-free for German passport
]);

// Nationality to visa-free set mapping
const VISA_FREE_BY_NATIONALITY: Record<string, Set<string>> = {
  'TR': TURKISH_VISA_FREE,
  'DE': GERMAN_VISA_FREE,
  // Default to a basic set for other nationalities
};

export function useUserLocation(): UserLocationData & {
  setPreferredNationality: (code: string) => void;
  setPreferredAirport: (code: string) => void;
  getVisaStatus: (destinationCountry: string) => 'domestic' | 'visa-free' | 'visa-required';
} {
  const [detectedCountryCode, setDetectedCountryCode] = useState<string | null>(null);
  const [detectedAirportCode, setDetectedAirportCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // User preferences from localStorage
  const [preferredNationality, setPreferredNationalityState] = useState<string | null>(() => {
    return localStorage.getItem('user-nationality');
  });

  const [preferredAirportCode, setPreferredAirportState] = useState<string | null>(() => {
    return localStorage.getItem('user-airport');
  });

  // Detect location from IP
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Use a free IP geolocation API
        const response = await fetch('https://ipapi.co/json/', {
          signal: AbortSignal.timeout(3000), // 3 second timeout
        });
        
        if (response.ok) {
          const data = await response.json();
          const countryCode = data.country_code?.toUpperCase();
          
          if (countryCode) {
            setDetectedCountryCode(countryCode);
            setDetectedAirportCode(COUNTRY_AIRPORTS[countryCode] || null);
          }
        }
      } catch (error) {
        console.log('Location detection failed, using defaults');
      } finally {
        setIsLoading(false);
      }
    };

    detectLocation();
  }, []);

  const setPreferredNationality = useCallback((code: string) => {
    setPreferredNationalityState(code);
    localStorage.setItem('user-nationality', code);
  }, []);

  const setPreferredAirport = useCallback((code: string) => {
    setPreferredAirportState(code);
    localStorage.setItem('user-airport', code);
  }, []);

  // Computed values - prefer user settings, fall back to detected, default to TR/IST
  const nationality = preferredNationality || detectedCountryCode || 'TR';
  const originAirport = preferredAirportCode || detectedAirportCode || 'IST';

  const getVisaStatus = useCallback((destinationCountry: string): 'domestic' | 'visa-free' | 'visa-required' => {
    // If same country, it's domestic
    if (destinationCountry === nationality) {
      return 'domestic';
    }

    // Check visa-free list for nationality
    const visaFreeSet = VISA_FREE_BY_NATIONALITY[nationality] || TURKISH_VISA_FREE;
    
    if (visaFreeSet.has(destinationCountry)) {
      return 'visa-free';
    }

    return 'visa-required';
  }, [nationality]);

  return {
    detectedCountryCode,
    detectedAirportCode,
    preferredNationality,
    preferredAirportCode,
    originAirport,
    nationality,
    isLoading,
    setPreferredNationality,
    setPreferredAirport,
    getVisaStatus,
  };
}

// Airport code to country code mapping for destinations
export const AIRPORT_TO_COUNTRY: Record<string, string> = {
  // Turkey
  'IST': 'TR', 'SAW': 'TR', 'ESB': 'TR', 'ADB': 'TR', 'AYT': 'TR', 'BJV': 'TR', 'DLM': 'TR',
  // Greece
  'ATH': 'GR', 'SKG': 'GR', 'HER': 'GR', 'RHO': 'GR',
  // Georgia
  'TBS': 'GE', 'BUS': 'GE',
  // North Macedonia
  'SKP': 'MK',
  // France
  'CDG': 'FR', 'ORY': 'FR', 'NCE': 'FR', 'LYS': 'FR',
  // Italy
  'FCO': 'IT', 'MXP': 'IT', 'VCE': 'IT', 'NAP': 'IT',
  // Spain
  'BCN': 'ES', 'MAD': 'ES', 'AGP': 'ES', 'PMI': 'ES',
  // Germany
  'FRA': 'DE', 'MUC': 'DE', 'BER': 'DE', 'DUS': 'DE',
  // UK
  'LHR': 'GB', 'LGW': 'GB', 'STN': 'GB', 'MAN': 'GB',
  // Netherlands
  'AMS': 'NL',
  // UAE
  'DXB': 'AE', 'AUH': 'AE',
  // USA
  'JFK': 'US', 'LAX': 'US', 'ORD': 'US', 'MIA': 'US',
  // Thailand
  'BKK': 'TH', 'HKT': 'TH', 'CNX': 'TH',
  // Indonesia
  'CGK': 'ID', 'DPS': 'ID',
  // Japan
  'NRT': 'JP', 'HND': 'JP', 'KIX': 'JP',
  // South Korea
  'ICN': 'KR', 'GMP': 'KR',
  // Singapore
  'SIN': 'SG',
  // Malaysia
  'KUL': 'MY',
  // Add more as needed
};
