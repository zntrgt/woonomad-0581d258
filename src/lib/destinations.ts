// Destination metadata: airport code -> country code, city name, country name
export interface DestinationInfo {
  city: string;
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2
}

export const destinationData: Record<string, DestinationInfo> = {
  // === VISA-FREE DESTINATIONS ===
  // Europe (visa-free)
  'TIR': { city: 'Tiran', country: 'Arnavutluk', countryCode: 'AL' },
  'PRN': { city: 'Priştine', country: 'Kosova', countryCode: 'XK' },
  'SKP': { city: 'Üsküp', country: 'Kuzey Makedonya', countryCode: 'MK' },
  'SJJ': { city: 'Saraybosna', country: 'Bosna Hersek', countryCode: 'BA' },
  'TGD': { city: 'Podgorica', country: 'Karadağ', countryCode: 'ME' },
  'BEG': { city: 'Belgrad', country: 'Sırbistan', countryCode: 'RS' },
  
  // Asia
  'ICN': { city: 'Seul (Incheon)', country: 'Güney Kore', countryCode: 'KR' },
  'GMP': { city: 'Seul (Gimpo)', country: 'Güney Kore', countryCode: 'KR' },
  'NRT': { city: 'Tokyo (Narita)', country: 'Japonya', countryCode: 'JP' },
  'HND': { city: 'Tokyo (Haneda)', country: 'Japonya', countryCode: 'JP' },
  'KIX': { city: 'Osaka', country: 'Japonya', countryCode: 'JP' },
  'SIN': { city: 'Singapur', country: 'Singapur', countryCode: 'SG' },
  'KUL': { city: 'Kuala Lumpur', country: 'Malezya', countryCode: 'MY' },
  'BKK': { city: 'Bangkok', country: 'Tayland', countryCode: 'TH' },
  'DMK': { city: 'Bangkok (Don Mueang)', country: 'Tayland', countryCode: 'TH' },
  'CGK': { city: 'Cakarta', country: 'Endonezya', countryCode: 'ID' },
  'DPS': { city: 'Bali', country: 'Endonezya', countryCode: 'ID' },
  'MNL': { city: 'Manila', country: 'Filipinler', countryCode: 'PH' },
  'HKG': { city: 'Hong Kong', country: 'Hong Kong', countryCode: 'HK' },
  'TPE': { city: 'Taipei', country: 'Tayvan', countryCode: 'TW' },
  'KTM': { city: 'Katmandu', country: 'Nepal', countryCode: 'NP' },
  
  // Middle East
  'DOH': { city: 'Doha', country: 'Katar', countryCode: 'QA' },
  'DXB': { city: 'Dubai', country: 'BAE', countryCode: 'AE' },
  'AUH': { city: 'Abu Dabi', country: 'BAE', countryCode: 'AE' },
  'BAH': { city: 'Bahreyn', country: 'Bahreyn', countryCode: 'BH' },
  'MCT': { city: 'Maskat', country: 'Umman', countryCode: 'OM' },
  'KWI': { city: 'Kuveyt', country: 'Kuveyt', countryCode: 'KW' },
  'AMM': { city: 'Amman', country: 'Ürdün', countryCode: 'JO' },
  'BEY': { city: 'Beyrut', country: 'Lübnan', countryCode: 'LB' },
  
  // Africa
  'TUN': { city: 'Tunus', country: 'Tunus', countryCode: 'TN' },
  'CMN': { city: 'Kazablanka', country: 'Fas', countryCode: 'MA' },
  'RAK': { city: 'Marakeş', country: 'Fas', countryCode: 'MA' },
  'CPT': { city: 'Cape Town', country: 'Güney Afrika', countryCode: 'ZA' },
  'JNB': { city: 'Johannesburg', country: 'Güney Afrika', countryCode: 'ZA' },
  'NBO': { city: 'Nairobi', country: 'Kenya', countryCode: 'KE' },
  'DAR': { city: 'Darüsselam', country: 'Tanzanya', countryCode: 'TZ' },
  'ZNZ': { city: 'Zanzibar', country: 'Tanzanya', countryCode: 'TZ' },
  
  // Americas
  'GRU': { city: 'Sao Paulo', country: 'Brezilya', countryCode: 'BR' },
  'GIG': { city: 'Rio de Janeiro', country: 'Brezilya', countryCode: 'BR' },
  'BSB': { city: 'Brasília', country: 'Brezilya', countryCode: 'BR' },
  'EZE': { city: 'Buenos Aires', country: 'Arjantin', countryCode: 'AR' },
  'SCL': { city: 'Santiago', country: 'Şili', countryCode: 'CL' },
  'BOG': { city: 'Bogota', country: 'Kolombiya', countryCode: 'CO' },
  'LIM': { city: 'Lima', country: 'Peru', countryCode: 'PE' },
  'UIO': { city: 'Quito', country: 'Ekvador', countryCode: 'EC' },
  'PTY': { city: 'Panama City', country: 'Panama', countryCode: 'PA' },
  'SJO': { city: 'San Jose', country: 'Kosta Rika', countryCode: 'CR' },
  
  // Caribbean
  'NAS': { city: 'Nassau', country: 'Bahamalar', countryCode: 'BS' },
  'MBJ': { city: 'Montego Bay', country: 'Jamaika', countryCode: 'JM' },
  'SDQ': { city: 'Santo Domingo', country: 'Dominik Cumhuriyeti', countryCode: 'DO' },
  'HAV': { city: 'Havana', country: 'Küba', countryCode: 'CU' },
  
  // Central Asia
  'ALA': { city: 'Almatı', country: 'Kazakistan', countryCode: 'KZ' },
  'NQZ': { city: 'Astana', country: 'Kazakistan', countryCode: 'KZ' },
  'TAS': { city: 'Taşkent', country: 'Özbekistan', countryCode: 'UZ' },
  'FRU': { city: 'Bişkek', country: 'Kırgızistan', countryCode: 'KG' },
  'GYD': { city: 'Bakü', country: 'Azerbaycan', countryCode: 'AZ' },
  'TBS': { city: 'Tiflis', country: 'Gürcistan', countryCode: 'GE' },
  
  // Other
  'ECN': { city: 'Ercan', country: 'Kuzey Kıbrıs', countryCode: 'CY' },
  
  // === VISA-REQUIRED DESTINATIONS ===
  // France
  'CDG': { city: 'Paris (CDG)', country: 'Fransa', countryCode: 'FR' },
  'ORY': { city: 'Paris (Orly)', country: 'Fransa', countryCode: 'FR' },
  
  // UK
  'LHR': { city: 'Londra (Heathrow)', country: 'İngiltere', countryCode: 'GB' },
  'LGW': { city: 'Londra (Gatwick)', country: 'İngiltere', countryCode: 'GB' },
  'STN': { city: 'Londra (Stansted)', country: 'İngiltere', countryCode: 'GB' },
  
  // Germany
  'FRA': { city: 'Frankfurt', country: 'Almanya', countryCode: 'DE' },
  'MUC': { city: 'Münih', country: 'Almanya', countryCode: 'DE' },
  'BER': { city: 'Berlin', country: 'Almanya', countryCode: 'DE' },
  'TXL': { city: 'Berlin (Tegel)', country: 'Almanya', countryCode: 'DE' },
  
  // Benelux & Central
  'AMS': { city: 'Amsterdam', country: 'Hollanda', countryCode: 'NL' },
  'BRU': { city: 'Brüksel', country: 'Belçika', countryCode: 'BE' },
  'VIE': { city: 'Viyana', country: 'Avusturya', countryCode: 'AT' },
  'ZRH': { city: 'Zürih', country: 'İsviçre', countryCode: 'CH' },
  'GVA': { city: 'Cenevre', country: 'İsviçre', countryCode: 'CH' },
  
  // Italy
  'FCO': { city: 'Roma', country: 'İtalya', countryCode: 'IT' },
  'MXP': { city: 'Milano', country: 'İtalya', countryCode: 'IT' },
  'VCE': { city: 'Venedik', country: 'İtalya', countryCode: 'IT' },
  'NAP': { city: 'Napoli', country: 'İtalya', countryCode: 'IT' },
  
  // Spain
  'MAD': { city: 'Madrid', country: 'İspanya', countryCode: 'ES' },
  'BCN': { city: 'Barselona', country: 'İspanya', countryCode: 'ES' },
  'PMI': { city: 'Palma de Mallorca', country: 'İspanya', countryCode: 'ES' },
  'AGP': { city: 'Malaga', country: 'İspanya', countryCode: 'ES' },
  
  // Portugal & Greece
  'LIS': { city: 'Lizbon', country: 'Portekiz', countryCode: 'PT' },
  'OPO': { city: 'Porto', country: 'Portekiz', countryCode: 'PT' },
  'ATH': { city: 'Atina', country: 'Yunanistan', countryCode: 'GR' },
  'SKG': { city: 'Selanik', country: 'Yunanistan', countryCode: 'GR' },
  
  // Eastern Europe
  'PRG': { city: 'Prag', country: 'Çekya', countryCode: 'CZ' },
  'WAW': { city: 'Varşova', country: 'Polonya', countryCode: 'PL' },
  'BUD': { city: 'Budapeşte', country: 'Macaristan', countryCode: 'HU' },
  'OTP': { city: 'Bükreş', country: 'Romanya', countryCode: 'RO' },
  'SOF': { city: 'Sofya', country: 'Bulgaristan', countryCode: 'BG' },
  
  // Nordics
  'CPH': { city: 'Kopenhag', country: 'Danimarka', countryCode: 'DK' },
  'ARN': { city: 'Stockholm', country: 'İsveç', countryCode: 'SE' },
  'OSL': { city: 'Oslo', country: 'Norveç', countryCode: 'NO' },
  'HEL': { city: 'Helsinki', country: 'Finlandiya', countryCode: 'FI' },
  
  // Baltics & Ireland
  'DUB': { city: 'Dublin', country: 'İrlanda', countryCode: 'IE' },
  'RIX': { city: 'Riga', country: 'Letonya', countryCode: 'LV' },
  'VNO': { city: 'Vilnius', country: 'Litvanya', countryCode: 'LT' },
  'TLL': { city: 'Tallinn', country: 'Estonya', countryCode: 'EE' },
  
  // North America
  'JFK': { city: 'New York (JFK)', country: 'ABD', countryCode: 'US' },
  'LAX': { city: 'Los Angeles', country: 'ABD', countryCode: 'US' },
  'ORD': { city: 'Chicago', country: 'ABD', countryCode: 'US' },
  'MIA': { city: 'Miami', country: 'ABD', countryCode: 'US' },
  'SFO': { city: 'San Francisco', country: 'ABD', countryCode: 'US' },
  'EWR': { city: 'New York (Newark)', country: 'ABD', countryCode: 'US' },
  'YYZ': { city: 'Toronto', country: 'Kanada', countryCode: 'CA' },
  'YVR': { city: 'Vancouver', country: 'Kanada', countryCode: 'CA' },
  'YUL': { city: 'Montreal', country: 'Kanada', countryCode: 'CA' },
  
  // Australia/Oceania
  'SYD': { city: 'Sidney', country: 'Avustralya', countryCode: 'AU' },
  'MEL': { city: 'Melbourne', country: 'Avustralya', countryCode: 'AU' },
  'AKL': { city: 'Auckland', country: 'Yeni Zelanda', countryCode: 'NZ' },
  
  // China
  'PEK': { city: 'Pekin', country: 'Çin', countryCode: 'CN' },
  'PVG': { city: 'Şanghay', country: 'Çin', countryCode: 'CN' },
  'HGH': { city: 'Hangzhou', country: 'Çin', countryCode: 'CN' },
  'CAN': { city: 'Guangzhou', country: 'Çin', countryCode: 'CN' },
  
  // India
  'DEL': { city: 'Delhi', country: 'Hindistan', countryCode: 'IN' },
  'BOM': { city: 'Mumbai', country: 'Hindistan', countryCode: 'IN' },
  'BLR': { city: 'Bangalore', country: 'Hindistan', countryCode: 'IN' },
  
  // Russia
  'SVO': { city: 'Moskova', country: 'Rusya', countryCode: 'RU' },
  'LED': { city: 'St. Petersburg', country: 'Rusya', countryCode: 'RU' },
  
  // Turkey (origin)
  'IST': { city: 'İstanbul', country: 'Türkiye', countryCode: 'TR' },
  'SAW': { city: 'İstanbul (Sabiha)', country: 'Türkiye', countryCode: 'TR' },
  'ESB': { city: 'Ankara', country: 'Türkiye', countryCode: 'TR' },
  'ADB': { city: 'İzmir', country: 'Türkiye', countryCode: 'TR' },
  'AYT': { city: 'Antalya', country: 'Türkiye', countryCode: 'TR' },
};

// Get flag emoji from country code
export function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  
  // Special case for Kosovo (XK is unofficial)
  if (countryCode === 'XK') return '🇽🇰';
  
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
}

// Get destination info by airport code
export function getDestinationInfo(airportCode: string): DestinationInfo | null {
  return destinationData[airportCode] || null;
}

// Get city image URL (using Unsplash source for free city images)
export function getCityImageUrl(cityName: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
  const dimensions = {
    small: '200x150',
    medium: '400x300',
    large: '800x600'
  };
  
  // Clean city name for URL (remove parentheses content)
  const cleanCity = cityName.split('(')[0].trim().toLowerCase().replace(/\s+/g, '-');
  
  return `https://source.unsplash.com/${dimensions[size]}/?${encodeURIComponent(cleanCity)},city,travel`;
}
