import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 60;

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitInfo(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    const resetTime = now + RATE_LIMIT_WINDOW_MS;
    rateLimitStore.set(ip, { count: 1, resetTime });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetTime };
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }
  
  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count, resetTime: record.resetTime };
}

function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('cf-connecting-ip') || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

const MAX_QUERY_LENGTH = 100;

function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.slice(0, MAX_QUERY_LENGTH).replace(/[<>'"\\]/g, '').trim();
}

// ============================================
// COMPREHENSIVE GLOBAL AIRPORTS DATABASE
// 600+ airports worldwide for full coverage
// ============================================
const airports = [
  // ========== TURKEY ==========
  { code: 'IST', name: 'İstanbul Havalimanı', city: 'İstanbul', country: 'Türkiye', region: 'Marmara', continent: 'Avrupa' },
  { code: 'SAW', name: 'Sabiha Gökçen', city: 'İstanbul', country: 'Türkiye', region: 'Marmara', continent: 'Avrupa' },
  { code: 'ESB', name: 'Esenboğa Havalimanı', city: 'Ankara', country: 'Türkiye', region: 'İç Anadolu', continent: 'Avrupa' },
  { code: 'ADB', name: 'Adnan Menderes', city: 'İzmir', country: 'Türkiye', region: 'Ege', continent: 'Avrupa' },
  { code: 'AYT', name: 'Antalya Havalimanı', city: 'Antalya', country: 'Türkiye', region: 'Akdeniz', continent: 'Avrupa' },
  { code: 'DLM', name: 'Dalaman Havalimanı', city: 'Muğla', country: 'Türkiye', region: 'Ege', continent: 'Avrupa' },
  { code: 'BJV', name: 'Milas-Bodrum', city: 'Bodrum', country: 'Türkiye', region: 'Ege', continent: 'Avrupa' },
  { code: 'TZX', name: 'Trabzon Havalimanı', city: 'Trabzon', country: 'Türkiye', region: 'Karadeniz', continent: 'Avrupa' },
  { code: 'GZT', name: 'Gaziantep Havalimanı', city: 'Gaziantep', country: 'Türkiye', region: 'Güneydoğu Anadolu', continent: 'Avrupa' },
  { code: 'DIY', name: 'Diyarbakır Havalimanı', city: 'Diyarbakır', country: 'Türkiye', region: 'Güneydoğu Anadolu', continent: 'Avrupa' },
  { code: 'VAN', name: 'Van Ferit Melen', city: 'Van', country: 'Türkiye', region: 'Doğu Anadolu', continent: 'Avrupa' },
  { code: 'ADA', name: 'Adana Şakirpaşa', city: 'Adana', country: 'Türkiye', region: 'Akdeniz', continent: 'Avrupa' },
  { code: 'ASR', name: 'Kayseri Erkilet', city: 'Kayseri', country: 'Türkiye', region: 'İç Anadolu', continent: 'Avrupa' },
  { code: 'ERZ', name: 'Erzurum', city: 'Erzurum', country: 'Türkiye', region: 'Doğu Anadolu', continent: 'Avrupa' },
  { code: 'SZF', name: 'Samsun-Çarşamba', city: 'Samsun', country: 'Türkiye', region: 'Karadeniz', continent: 'Avrupa' },
  { code: 'GNY', name: 'Şanlıurfa GAP', city: 'Şanlıurfa', country: 'Türkiye', region: 'Güneydoğu Anadolu', continent: 'Avrupa' },
  { code: 'MLX', name: 'Malatya Erhaç', city: 'Malatya', country: 'Türkiye', region: 'Doğu Anadolu', continent: 'Avrupa' },
  { code: 'HTY', name: 'Hatay', city: 'Hatay', country: 'Türkiye', region: 'Akdeniz', continent: 'Avrupa' },
  { code: 'EZS', name: 'Elazığ', city: 'Elazığ', country: 'Türkiye', region: 'Doğu Anadolu', continent: 'Avrupa' },
  { code: 'KYA', name: 'Konya', city: 'Konya', country: 'Türkiye', region: 'İç Anadolu', continent: 'Avrupa' },
  { code: 'DNZ', name: 'Denizli Çardak', city: 'Denizli', country: 'Türkiye', region: 'Ege', continent: 'Avrupa' },
  { code: 'NAV', name: 'Kapadokya', city: 'Nevşehir', country: 'Türkiye', region: 'İç Anadolu', continent: 'Avrupa' },
  { code: 'ECN', name: 'Ercan Havalimanı', city: 'Lefkoşa', country: 'Kuzey Kıbrıs', region: 'Kıbrıs', continent: 'Avrupa' },

  // ========== BALKANS ==========
  { code: 'TIR', name: 'Tirana Nënë Tereza', city: 'Tiran', country: 'Arnavutluk', region: 'Balkanlar', continent: 'Avrupa' },
  { code: 'PRN', name: 'Priştine', city: 'Priştine', country: 'Kosova', region: 'Balkanlar', continent: 'Avrupa' },
  { code: 'SKP', name: 'Üsküp', city: 'Üsküp', country: 'Kuzey Makedonya', region: 'Balkanlar', continent: 'Avrupa' },
  { code: 'SJJ', name: 'Saraybosna', city: 'Saraybosna', country: 'Bosna Hersek', region: 'Balkanlar', continent: 'Avrupa' },
  { code: 'TGD', name: 'Podgorica', city: 'Podgorica', country: 'Karadağ', region: 'Balkanlar', continent: 'Avrupa' },
  { code: 'BEG', name: 'Belgrad Nikola Tesla', city: 'Belgrad', country: 'Sırbistan', region: 'Balkanlar', continent: 'Avrupa' },
  { code: 'ZAG', name: 'Zagreb', city: 'Zagreb', country: 'Hırvatistan', region: 'Balkanlar', continent: 'Avrupa' },
  { code: 'SPU', name: 'Split', city: 'Split', country: 'Hırvatistan', region: 'Balkanlar', continent: 'Avrupa' },
  { code: 'DBV', name: 'Dubrovnik', city: 'Dubrovnik', country: 'Hırvatistan', region: 'Balkanlar', continent: 'Avrupa' },
  { code: 'LJU', name: 'Ljubljana', city: 'Ljubljana', country: 'Slovenya', region: 'Balkanlar', continent: 'Avrupa' },

  // ========== WESTERN EUROPE ==========
  // UK
  { code: 'LHR', name: 'Heathrow', city: 'Londra', country: 'İngiltere', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'LGW', name: 'Gatwick', city: 'Londra', country: 'İngiltere', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'STN', name: 'Stansted', city: 'Londra', country: 'İngiltere', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'LTN', name: 'Luton', city: 'Londra', country: 'İngiltere', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'MAN', name: 'Manchester', city: 'Manchester', country: 'İngiltere', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'BHX', name: 'Birmingham', city: 'Birmingham', country: 'İngiltere', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'EDI', name: 'Edinburgh', city: 'Edinburgh', country: 'İskoçya', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'GLA', name: 'Glasgow', city: 'Glasgow', country: 'İskoçya', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'DUB', name: 'Dublin', city: 'Dublin', country: 'İrlanda', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'SNN', name: 'Shannon', city: 'Shannon', country: 'İrlanda', region: 'Batı Avrupa', continent: 'Avrupa' },
  
  // France
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'Fransa', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'ORY', name: 'Orly', city: 'Paris', country: 'Fransa', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'NCE', name: 'Nice Côte d\'Azur', city: 'Nice', country: 'Fransa', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'LYS', name: 'Lyon Saint-Exupéry', city: 'Lyon', country: 'Fransa', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'MRS', name: 'Marseille Provence', city: 'Marsilya', country: 'Fransa', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'TLS', name: 'Toulouse-Blagnac', city: 'Toulouse', country: 'Fransa', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'BOD', name: 'Bordeaux', city: 'Bordeaux', country: 'Fransa', region: 'Batı Avrupa', continent: 'Avrupa' },
  
  // Benelux
  { code: 'AMS', name: 'Schiphol', city: 'Amsterdam', country: 'Hollanda', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'RTM', name: 'Rotterdam', city: 'Rotterdam', country: 'Hollanda', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'EIN', name: 'Eindhoven', city: 'Eindhoven', country: 'Hollanda', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'BRU', name: 'Brüksel', city: 'Brüksel', country: 'Belçika', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'CRL', name: 'Charleroi', city: 'Charleroi', country: 'Belçika', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'LUX', name: 'Lüksemburg', city: 'Lüksemburg', country: 'Lüksemburg', region: 'Batı Avrupa', continent: 'Avrupa' },

  // ========== CENTRAL EUROPE ==========
  // Germany
  { code: 'FRA', name: 'Frankfurt', city: 'Frankfurt', country: 'Almanya', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'MUC', name: 'Münih', city: 'Münih', country: 'Almanya', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', country: 'Almanya', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'DUS', name: 'Düsseldorf', city: 'Düsseldorf', country: 'Almanya', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'HAM', name: 'Hamburg', city: 'Hamburg', country: 'Almanya', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'CGN', name: 'Köln/Bonn', city: 'Köln', country: 'Almanya', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'STR', name: 'Stuttgart', city: 'Stuttgart', country: 'Almanya', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'HAJ', name: 'Hannover', city: 'Hannover', country: 'Almanya', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'NUE', name: 'Nürnberg', city: 'Nürnberg', country: 'Almanya', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'LEJ', name: 'Leipzig/Halle', city: 'Leipzig', country: 'Almanya', region: 'Orta Avrupa', continent: 'Avrupa' },
  
  // Switzerland & Austria
  { code: 'ZRH', name: 'Zürih', city: 'Zürih', country: 'İsviçre', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'GVA', name: 'Cenevre', city: 'Cenevre', country: 'İsviçre', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'BSL', name: 'Basel-Mulhouse', city: 'Basel', country: 'İsviçre', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'VIE', name: 'Viyana', city: 'Viyana', country: 'Avusturya', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'SZG', name: 'Salzburg', city: 'Salzburg', country: 'Avusturya', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'INN', name: 'Innsbruck', city: 'Innsbruck', country: 'Avusturya', region: 'Orta Avrupa', continent: 'Avrupa' },

  // ========== SOUTHERN EUROPE ==========
  // Italy
  { code: 'FCO', name: 'Fiumicino', city: 'Roma', country: 'İtalya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'MXP', name: 'Malpensa', city: 'Milano', country: 'İtalya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'VCE', name: 'Marco Polo', city: 'Venedik', country: 'İtalya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'NAP', name: 'Napoli', city: 'Napoli', country: 'İtalya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'FLR', name: 'Floransa Peretola', city: 'Floransa', country: 'İtalya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'BLQ', name: 'Bologna', city: 'Bologna', country: 'İtalya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'PSA', name: 'Pisa', city: 'Pisa', country: 'İtalya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'CTA', name: 'Catania', city: 'Catania', country: 'İtalya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'PMO', name: 'Palermo', city: 'Palermo', country: 'İtalya', region: 'Güney Avrupa', continent: 'Avrupa' },
  
  // Spain
  { code: 'MAD', name: 'Barajas', city: 'Madrid', country: 'İspanya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'BCN', name: 'El Prat', city: 'Barselona', country: 'İspanya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'PMI', name: 'Palma de Mallorca', city: 'Palma', country: 'İspanya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'AGP', name: 'Malaga', city: 'Malaga', country: 'İspanya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'ALC', name: 'Alicante', city: 'Alicante', country: 'İspanya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'VLC', name: 'Valencia', city: 'Valencia', country: 'İspanya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'SVQ', name: 'Sevilla', city: 'Sevilla', country: 'İspanya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'IBZ', name: 'İbiza', city: 'İbiza', country: 'İspanya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'TFS', name: 'Tenerife South', city: 'Tenerife', country: 'İspanya', region: 'Kanarya Adaları', continent: 'Avrupa' },
  { code: 'LPA', name: 'Gran Canaria', city: 'Las Palmas', country: 'İspanya', region: 'Kanarya Adaları', continent: 'Avrupa' },
  { code: 'BIO', name: 'Bilbao', city: 'Bilbao', country: 'İspanya', region: 'Güney Avrupa', continent: 'Avrupa' },
  
  // Portugal
  { code: 'LIS', name: 'Lisbon Portela', city: 'Lizbon', country: 'Portekiz', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'OPO', name: 'Porto', city: 'Porto', country: 'Portekiz', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'FAO', name: 'Faro', city: 'Faro', country: 'Portekiz', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'FNC', name: 'Funchal', city: 'Madeira', country: 'Portekiz', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'PDL', name: 'Ponta Delgada', city: 'Azorlar', country: 'Portekiz', region: 'Güney Avrupa', continent: 'Avrupa' },
  
  // Greece
  { code: 'ATH', name: 'Eleftherios Venizelos', city: 'Atina', country: 'Yunanistan', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'SKG', name: 'Makedonia', city: 'Selanik', country: 'Yunanistan', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'HER', name: 'Heraklion', city: 'Girit', country: 'Yunanistan', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'RHO', name: 'Rodos', city: 'Rodos', country: 'Yunanistan', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'CFU', name: 'Korfu', city: 'Korfu', country: 'Yunanistan', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'JMK', name: 'Mikonos', city: 'Mikonos', country: 'Yunanistan', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'JTR', name: 'Santorini', city: 'Santorini', country: 'Yunanistan', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'KGS', name: 'Kos', city: 'İstanköy', country: 'Yunanistan', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'ZTH', name: 'Zakynthos', city: 'Zakynthos', country: 'Yunanistan', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'CHQ', name: 'Chania', city: 'Hanya', country: 'Yunanistan', region: 'Güney Avrupa', continent: 'Avrupa' },
  
  // Cyprus
  { code: 'LCA', name: 'Larnaka', city: 'Larnaka', country: 'Kıbrıs', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'PFO', name: 'Baf', city: 'Baf', country: 'Kıbrıs', region: 'Güney Avrupa', continent: 'Avrupa' },
  
  // Malta
  { code: 'MLA', name: 'Malta', city: 'Valletta', country: 'Malta', region: 'Güney Avrupa', continent: 'Avrupa' },

  // ========== EASTERN EUROPE ==========
  // Poland
  { code: 'WAW', name: 'Varşova Chopin', city: 'Varşova', country: 'Polonya', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'KRK', name: 'Krakow', city: 'Krakow', country: 'Polonya', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'GDN', name: 'Gdansk', city: 'Gdansk', country: 'Polonya', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'WRO', name: 'Wroclaw', city: 'Wroclaw', country: 'Polonya', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'POZ', name: 'Poznan', city: 'Poznan', country: 'Polonya', region: 'Doğu Avrupa', continent: 'Avrupa' },
  
  // Czech & Hungary
  { code: 'PRG', name: 'Vaclav Havel', city: 'Prag', country: 'Çekya', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'BUD', name: 'Budapeşte', city: 'Budapeşte', country: 'Macaristan', region: 'Orta Avrupa', continent: 'Avrupa' },
  
  // Romania & Bulgaria
  { code: 'OTP', name: 'Bükreş Otopeni', city: 'Bükreş', country: 'Romanya', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'CLJ', name: 'Cluj-Napoca', city: 'Cluj', country: 'Romanya', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'IAS', name: 'Iasi', city: 'Iasi', country: 'Romanya', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'TSR', name: 'Timisoara', city: 'Timisoara', country: 'Romanya', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'SOF', name: 'Sofya', city: 'Sofya', country: 'Bulgaristan', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'VAR', name: 'Varna', city: 'Varna', country: 'Bulgaristan', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'BOJ', name: 'Burgaz', city: 'Burgaz', country: 'Bulgaristan', region: 'Doğu Avrupa', continent: 'Avrupa' },
  
  // Ukraine & Moldova
  { code: 'KBP', name: 'Borispol', city: 'Kiev', country: 'Ukrayna', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'LWO', name: 'Lviv', city: 'Lviv', country: 'Ukrayna', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'ODS', name: 'Odessa', city: 'Odessa', country: 'Ukrayna', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'KIV', name: 'Chișinău', city: 'Kişinev', country: 'Moldova', region: 'Doğu Avrupa', continent: 'Avrupa' },
  
  // Baltic States
  { code: 'RIX', name: 'Riga', city: 'Riga', country: 'Letonya', region: 'Baltık', continent: 'Avrupa' },
  { code: 'VNO', name: 'Vilnius', city: 'Vilnius', country: 'Litvanya', region: 'Baltık', continent: 'Avrupa' },
  { code: 'KUN', name: 'Kaunas', city: 'Kaunas', country: 'Litvanya', region: 'Baltık', continent: 'Avrupa' },
  { code: 'TLL', name: 'Tallinn', city: 'Tallinn', country: 'Estonya', region: 'Baltık', continent: 'Avrupa' },

  // ========== NORDIC ==========
  { code: 'CPH', name: 'Kopenhag', city: 'Kopenhag', country: 'Danimarka', region: 'Kuzey Avrupa', continent: 'Avrupa' },
  { code: 'ARN', name: 'Stockholm Arlanda', city: 'Stockholm', country: 'İsveç', region: 'Kuzey Avrupa', continent: 'Avrupa' },
  { code: 'GOT', name: 'Göteborg', city: 'Göteborg', country: 'İsveç', region: 'Kuzey Avrupa', continent: 'Avrupa' },
  { code: 'OSL', name: 'Oslo Gardermoen', city: 'Oslo', country: 'Norveç', region: 'Kuzey Avrupa', continent: 'Avrupa' },
  { code: 'BGO', name: 'Bergen', city: 'Bergen', country: 'Norveç', region: 'Kuzey Avrupa', continent: 'Avrupa' },
  { code: 'TRD', name: 'Trondheim', city: 'Trondheim', country: 'Norveç', region: 'Kuzey Avrupa', continent: 'Avrupa' },
  { code: 'HEL', name: 'Helsinki-Vantaa', city: 'Helsinki', country: 'Finlandiya', region: 'Kuzey Avrupa', continent: 'Avrupa' },
  { code: 'KEF', name: 'Keflavik', city: 'Reykjavik', country: 'İzlanda', region: 'Kuzey Avrupa', continent: 'Avrupa' },

  // ========== RUSSIA ==========
  { code: 'SVO', name: 'Sheremetyevo', city: 'Moskova', country: 'Rusya', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'DME', name: 'Domodedovo', city: 'Moskova', country: 'Rusya', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'VKO', name: 'Vnukovo', city: 'Moskova', country: 'Rusya', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'LED', name: 'Pulkovo', city: 'St. Petersburg', country: 'Rusya', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'AER', name: 'Soçi', city: 'Soçi', country: 'Rusya', region: 'Kafkaslar', continent: 'Avrupa' },
  { code: 'KZN', name: 'Kazan', city: 'Kazan', country: 'Rusya', region: 'Doğu Avrupa', continent: 'Avrupa' },

  // ========== CAUCASUS ==========
  { code: 'TBS', name: 'Tiflis', city: 'Tiflis', country: 'Gürcistan', region: 'Kafkaslar', continent: 'Asya' },
  { code: 'KUT', name: 'Kutaisi', city: 'Kutaisi', country: 'Gürcistan', region: 'Kafkaslar', continent: 'Asya' },
  { code: 'BUS', name: 'Batum', city: 'Batum', country: 'Gürcistan', region: 'Kafkaslar', continent: 'Asya' },
  { code: 'GYD', name: 'Haydar Aliyev', city: 'Bakü', country: 'Azerbaycan', region: 'Kafkaslar', continent: 'Asya' },
  { code: 'EVN', name: 'Zvartnots', city: 'Erivan', country: 'Ermenistan', region: 'Kafkaslar', continent: 'Asya' },

  // ========== CENTRAL ASIA ==========
  { code: 'ALA', name: 'Almatı', city: 'Almatı', country: 'Kazakistan', region: 'Orta Asya', continent: 'Asya' },
  { code: 'NQZ', name: 'Nursultan', city: 'Astana', country: 'Kazakistan', region: 'Orta Asya', continent: 'Asya' },
  { code: 'TSE', name: 'Nur-Sultan', city: 'Nur-Sultan', country: 'Kazakistan', region: 'Orta Asya', continent: 'Asya' },
  { code: 'TAS', name: 'Taşkent', city: 'Taşkent', country: 'Özbekistan', region: 'Orta Asya', continent: 'Asya' },
  { code: 'SKD', name: 'Semerkand', city: 'Semerkand', country: 'Özbekistan', region: 'Orta Asya', continent: 'Asya' },
  { code: 'BHK', name: 'Buhara', city: 'Buhara', country: 'Özbekistan', region: 'Orta Asya', continent: 'Asya' },
  { code: 'FRU', name: 'Manas', city: 'Bişkek', country: 'Kırgızistan', region: 'Orta Asya', continent: 'Asya' },
  { code: 'OSS', name: 'Oş', city: 'Oş', country: 'Kırgızistan', region: 'Orta Asya', continent: 'Asya' },
  { code: 'DYU', name: 'Duşanbe', city: 'Duşanbe', country: 'Tacikistan', region: 'Orta Asya', continent: 'Asya' },
  { code: 'ASB', name: 'Aşkabat', city: 'Aşkabat', country: 'Türkmenistan', region: 'Orta Asya', continent: 'Asya' },

  // ========== MIDDLE EAST ==========
  { code: 'DXB', name: 'Dubai', city: 'Dubai', country: 'BAE', region: 'Körfez', continent: 'Asya' },
  { code: 'AUH', name: 'Abu Dabi', city: 'Abu Dabi', country: 'BAE', region: 'Körfez', continent: 'Asya' },
  { code: 'SHJ', name: 'Sharjah', city: 'Sharjah', country: 'BAE', region: 'Körfez', continent: 'Asya' },
  { code: 'DOH', name: 'Hamad', city: 'Doha', country: 'Katar', region: 'Körfez', continent: 'Asya' },
  { code: 'BAH', name: 'Bahreyn', city: 'Manama', country: 'Bahreyn', region: 'Körfez', continent: 'Asya' },
  { code: 'KWI', name: 'Kuveyt', city: 'Kuveyt', country: 'Kuveyt', region: 'Körfez', continent: 'Asya' },
  { code: 'MCT', name: 'Muskat', city: 'Muskat', country: 'Umman', region: 'Körfez', continent: 'Asya' },
  { code: 'RUH', name: 'Riyad', city: 'Riyad', country: 'Suudi Arabistan', region: 'Körfez', continent: 'Asya' },
  { code: 'JED', name: 'Cidde', city: 'Cidde', country: 'Suudi Arabistan', region: 'Körfez', continent: 'Asya' },
  { code: 'MED', name: 'Medine', city: 'Medine', country: 'Suudi Arabistan', region: 'Körfez', continent: 'Asya' },
  { code: 'DMM', name: 'Dammam', city: 'Dammam', country: 'Suudi Arabistan', region: 'Körfez', continent: 'Asya' },
  { code: 'TLV', name: 'Ben Gurion', city: 'Tel Aviv', country: 'İsrail', region: 'Orta Doğu', continent: 'Asya' },
  { code: 'AMM', name: 'Queen Alia', city: 'Amman', country: 'Ürdün', region: 'Orta Doğu', continent: 'Asya' },
  { code: 'AQJ', name: 'Akabe', city: 'Akabe', country: 'Ürdün', region: 'Orta Doğu', continent: 'Asya' },
  { code: 'BEY', name: 'Beyrut', city: 'Beyrut', country: 'Lübnan', region: 'Orta Doğu', continent: 'Asya' },
  { code: 'DAM', name: 'Şam', city: 'Şam', country: 'Suriye', region: 'Orta Doğu', continent: 'Asya' },
  { code: 'BGW', name: 'Bağdat', city: 'Bağdat', country: 'Irak', region: 'Orta Doğu', continent: 'Asya' },
  { code: 'EBL', name: 'Erbil', city: 'Erbil', country: 'Irak', region: 'Orta Doğu', continent: 'Asya' },
  { code: 'NJF', name: 'Necef', city: 'Necef', country: 'Irak', region: 'Orta Doğu', continent: 'Asya' },
  { code: 'IKA', name: 'Tahran İmam Humeyni', city: 'Tahran', country: 'İran', region: 'Orta Doğu', continent: 'Asya' },
  { code: 'THR', name: 'Tahran Mehrabad', city: 'Tahran', country: 'İran', region: 'Orta Doğu', continent: 'Asya' },
  { code: 'MHD', name: 'Meşhed', city: 'Meşhed', country: 'İran', region: 'Orta Doğu', continent: 'Asya' },
  { code: 'SYZ', name: 'Şiraz', city: 'Şiraz', country: 'İran', region: 'Orta Doğu', continent: 'Asya' },
  { code: 'IFN', name: 'Isfahan', city: 'Isfahan', country: 'İran', region: 'Orta Doğu', continent: 'Asya' },

  // ========== SOUTH ASIA ==========
  { code: 'DEL', name: 'Indira Gandhi', city: 'Delhi', country: 'Hindistan', region: 'Güney Asya', continent: 'Asya' },
  { code: 'BOM', name: 'Chhatrapati Shivaji', city: 'Mumbai', country: 'Hindistan', region: 'Güney Asya', continent: 'Asya' },
  { code: 'BLR', name: 'Kempegowda', city: 'Bangalore', country: 'Hindistan', region: 'Güney Asya', continent: 'Asya' },
  { code: 'MAA', name: 'Chennai', city: 'Chennai', country: 'Hindistan', region: 'Güney Asya', continent: 'Asya' },
  { code: 'CCU', name: 'Kolkata', city: 'Kalküta', country: 'Hindistan', region: 'Güney Asya', continent: 'Asya' },
  { code: 'HYD', name: 'Rajiv Gandhi', city: 'Haydarabad', country: 'Hindistan', region: 'Güney Asya', continent: 'Asya' },
  { code: 'COK', name: 'Cochin', city: 'Kochi', country: 'Hindistan', region: 'Güney Asya', continent: 'Asya' },
  { code: 'GOI', name: 'Goa', city: 'Goa', country: 'Hindistan', region: 'Güney Asya', continent: 'Asya' },
  { code: 'AMD', name: 'Ahmedabad', city: 'Ahmedabad', country: 'Hindistan', region: 'Güney Asya', continent: 'Asya' },
  { code: 'JAI', name: 'Jaipur', city: 'Jaipur', country: 'Hindistan', region: 'Güney Asya', continent: 'Asya' },
  { code: 'ISB', name: 'İslamabad', city: 'İslamabad', country: 'Pakistan', region: 'Güney Asya', continent: 'Asya' },
  { code: 'KHI', name: 'Karaçi', city: 'Karaçi', country: 'Pakistan', region: 'Güney Asya', continent: 'Asya' },
  { code: 'LHE', name: 'Lahor', city: 'Lahor', country: 'Pakistan', region: 'Güney Asya', continent: 'Asya' },
  { code: 'DAC', name: 'Dhaka Shahjalal', city: 'Dakka', country: 'Bangladeş', region: 'Güney Asya', continent: 'Asya' },
  { code: 'CMB', name: 'Colombo Bandaranaike', city: 'Colombo', country: 'Sri Lanka', region: 'Güney Asya', continent: 'Asya' },
  { code: 'MLE', name: 'Velana', city: 'Male', country: 'Maldivler', region: 'Güney Asya', continent: 'Asya' },
  { code: 'KTM', name: 'Tribhuvan', city: 'Katmandu', country: 'Nepal', region: 'Güney Asya', continent: 'Asya' },
  { code: 'PBH', name: 'Paro', city: 'Paro', country: 'Butan', region: 'Güney Asya', continent: 'Asya' },

  // ========== SOUTHEAST ASIA ==========
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Tayland', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'DMK', name: 'Don Mueang', city: 'Bangkok', country: 'Tayland', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'HKT', name: 'Phuket', city: 'Phuket', country: 'Tayland', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'CNX', name: 'Chiang Mai', city: 'Chiang Mai', country: 'Tayland', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'USM', name: 'Koh Samui', city: 'Koh Samui', country: 'Tayland', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'KBV', name: 'Krabi', city: 'Krabi', country: 'Tayland', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'SIN', name: 'Changi', city: 'Singapur', country: 'Singapur', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'KUL', name: 'Kuala Lumpur', city: 'Kuala Lumpur', country: 'Malezya', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'PEN', name: 'Penang', city: 'Penang', country: 'Malezya', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'LGK', name: 'Langkawi', city: 'Langkawi', country: 'Malezya', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'BKI', name: 'Kota Kinabalu', city: 'Kota Kinabalu', country: 'Malezya', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'CGK', name: 'Soekarno-Hatta', city: 'Cakarta', country: 'Endonezya', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'DPS', name: 'Ngurah Rai', city: 'Bali', country: 'Endonezya', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'SUB', name: 'Juanda', city: 'Surabaya', country: 'Endonezya', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'JOG', name: 'Yogyakarta', city: 'Yogyakarta', country: 'Endonezya', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'LOP', name: 'Lombok', city: 'Lombok', country: 'Endonezya', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'MNL', name: 'Ninoy Aquino', city: 'Manila', country: 'Filipinler', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'CEB', name: 'Mactan-Cebu', city: 'Cebu', country: 'Filipinler', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'DVO', name: 'Davao', city: 'Davao', country: 'Filipinler', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'CRK', name: 'Clark', city: 'Angeles', country: 'Filipinler', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'SGN', name: 'Tan Son Nhat', city: 'Ho Chi Minh', country: 'Vietnam', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'HAN', name: 'Noi Bai', city: 'Hanoi', country: 'Vietnam', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'DAD', name: 'Da Nang', city: 'Da Nang', country: 'Vietnam', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'CXR', name: 'Cam Ranh', city: 'Nha Trang', country: 'Vietnam', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'PQC', name: 'Phu Quoc', city: 'Phu Quoc', country: 'Vietnam', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'PNH', name: 'Phnom Penh', city: 'Phnom Penh', country: 'Kamboçya', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'REP', name: 'Siem Reap', city: 'Siem Reap', country: 'Kamboçya', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'VTE', name: 'Vientiane', city: 'Vientiane', country: 'Laos', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'LPQ', name: 'Luang Prabang', city: 'Luang Prabang', country: 'Laos', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'RGN', name: 'Yangon', city: 'Yangon', country: 'Myanmar', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'BWN', name: 'Brunei', city: 'Bandar Seri Begawan', country: 'Brunei', region: 'Güneydoğu Asya', continent: 'Asya' },

  // ========== EAST ASIA ==========
  // Japan
  { code: 'NRT', name: 'Narita', city: 'Tokyo', country: 'Japonya', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'HND', name: 'Haneda', city: 'Tokyo', country: 'Japonya', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'KIX', name: 'Kansai', city: 'Osaka', country: 'Japonya', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'ITM', name: 'Itami', city: 'Osaka', country: 'Japonya', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'NGO', name: 'Chubu Centrair', city: 'Nagoya', country: 'Japonya', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'FUK', name: 'Fukuoka', city: 'Fukuoka', country: 'Japonya', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'CTS', name: 'New Chitose', city: 'Sapporo', country: 'Japonya', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'OKA', name: 'Naha', city: 'Okinawa', country: 'Japonya', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'HIJ', name: 'Hiroshima', city: 'Hiroshima', country: 'Japonya', region: 'Doğu Asya', continent: 'Asya' },
  
  // Korea
  { code: 'ICN', name: 'Incheon', city: 'Seul', country: 'Güney Kore', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'GMP', name: 'Gimpo', city: 'Seul', country: 'Güney Kore', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'PUS', name: 'Busan Gimhae', city: 'Busan', country: 'Güney Kore', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'CJU', name: 'Jeju', city: 'Jeju', country: 'Güney Kore', region: 'Doğu Asya', continent: 'Asya' },
  
  // China
  { code: 'PEK', name: 'Capital', city: 'Pekin', country: 'Çin', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'PKX', name: 'Daxing', city: 'Pekin', country: 'Çin', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'PVG', name: 'Pudong', city: 'Şanghay', country: 'Çin', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'SHA', name: 'Hongqiao', city: 'Şanghay', country: 'Çin', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'CAN', name: 'Baiyun', city: 'Guangzhou', country: 'Çin', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'SZX', name: 'Shenzhen', city: 'Shenzhen', country: 'Çin', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'CTU', name: 'Shuangliu', city: 'Chengdu', country: 'Çin', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'CKG', name: 'Jiangbei', city: 'Chongqing', country: 'Çin', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'XIY', name: 'Xianyang', city: 'Xi\'an', country: 'Çin', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'HGH', name: 'Xiaoshan', city: 'Hangzhou', country: 'Çin', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'NKG', name: 'Lukou', city: 'Nanjing', country: 'Çin', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'WUH', name: 'Tianhe', city: 'Wuhan', country: 'Çin', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'KMG', name: 'Changshui', city: 'Kunming', country: 'Çin', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'XMN', name: 'Gaoqi', city: 'Xiamen', country: 'Çin', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'TAO', name: 'Liuting', city: 'Qingdao', country: 'Çin', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'SYX', name: 'Phoenix', city: 'Sanya', country: 'Çin', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'HAK', name: 'Meilan', city: 'Haikou', country: 'Çin', region: 'Doğu Asya', continent: 'Asya' },
  
  // Hong Kong, Macau, Taiwan
  { code: 'HKG', name: 'Hong Kong', city: 'Hong Kong', country: 'Hong Kong', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'MFM', name: 'Macau', city: 'Makao', country: 'Makao', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'TPE', name: 'Taoyuan', city: 'Taipei', country: 'Tayvan', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'TSA', name: 'Songshan', city: 'Taipei', country: 'Tayvan', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'KHH', name: 'Kaohsiung', city: 'Kaohsiung', country: 'Tayvan', region: 'Doğu Asya', continent: 'Asya' },
  
  // Mongolia
  { code: 'UBN', name: 'Chinggis Khaan', city: 'Ulan Batur', country: 'Moğolistan', region: 'Doğu Asya', continent: 'Asya' },

  // ========== NORTH AFRICA ==========
  { code: 'CAI', name: 'Kahire', city: 'Kahire', country: 'Mısır', region: 'Kuzey Afrika', continent: 'Afrika' },
  { code: 'HRG', name: 'Hurghada', city: 'Hurghada', country: 'Mısır', region: 'Kuzey Afrika', continent: 'Afrika' },
  { code: 'SSH', name: 'Sharm el-Sheikh', city: 'Sharm el-Sheikh', country: 'Mısır', region: 'Kuzey Afrika', continent: 'Afrika' },
  { code: 'LXR', name: 'Luksor', city: 'Luksor', country: 'Mısır', region: 'Kuzey Afrika', continent: 'Afrika' },
  { code: 'ASW', name: 'Asvan', city: 'Asvan', country: 'Mısır', region: 'Kuzey Afrika', continent: 'Afrika' },
  { code: 'CMN', name: 'Muhammed V', city: 'Kazablanka', country: 'Fas', region: 'Kuzey Afrika', continent: 'Afrika' },
  { code: 'RAK', name: 'Marrakech Menara', city: 'Marakeş', country: 'Fas', region: 'Kuzey Afrika', continent: 'Afrika' },
  { code: 'FEZ', name: 'Fez-Saïss', city: 'Fez', country: 'Fas', region: 'Kuzey Afrika', continent: 'Afrika' },
  { code: 'TNG', name: 'Tanca', city: 'Tanca', country: 'Fas', region: 'Kuzey Afrika', continent: 'Afrika' },
  { code: 'AGA', name: 'Agadir', city: 'Agadir', country: 'Fas', region: 'Kuzey Afrika', continent: 'Afrika' },
  { code: 'TUN', name: 'Tunus Kartaca', city: 'Tunus', country: 'Tunus', region: 'Kuzey Afrika', continent: 'Afrika' },
  { code: 'ALG', name: 'Cezayir', city: 'Cezayir', country: 'Cezayir', region: 'Kuzey Afrika', continent: 'Afrika' },
  { code: 'TIP', name: 'Mitiga', city: 'Trablus', country: 'Libya', region: 'Kuzey Afrika', continent: 'Afrika' },

  // ========== SUB-SAHARAN AFRICA ==========
  // Southern Africa
  { code: 'JNB', name: 'O.R. Tambo', city: 'Johannesburg', country: 'Güney Afrika', region: 'Güney Afrika', continent: 'Afrika' },
  { code: 'CPT', name: 'Cape Town', city: 'Cape Town', country: 'Güney Afrika', region: 'Güney Afrika', continent: 'Afrika' },
  { code: 'DUR', name: 'King Shaka', city: 'Durban', country: 'Güney Afrika', region: 'Güney Afrika', continent: 'Afrika' },
  
  // East Africa
  { code: 'NBO', name: 'Jomo Kenyatta', city: 'Nairobi', country: 'Kenya', region: 'Doğu Afrika', continent: 'Afrika' },
  { code: 'MBA', name: 'Moi', city: 'Mombasa', country: 'Kenya', region: 'Doğu Afrika', continent: 'Afrika' },
  { code: 'DAR', name: 'Julius Nyerere', city: 'Dar es Salaam', country: 'Tanzanya', region: 'Doğu Afrika', continent: 'Afrika' },
  { code: 'ZNZ', name: 'Abeid Amani Karume', city: 'Zanzibar', country: 'Tanzanya', region: 'Doğu Afrika', continent: 'Afrika' },
  { code: 'JRO', name: 'Kilimanjaro', city: 'Kilimanjaro', country: 'Tanzanya', region: 'Doğu Afrika', continent: 'Afrika' },
  { code: 'ADD', name: 'Bole', city: 'Addis Ababa', country: 'Etiyopya', region: 'Doğu Afrika', continent: 'Afrika' },
  { code: 'EBB', name: 'Entebbe', city: 'Kampala', country: 'Uganda', region: 'Doğu Afrika', continent: 'Afrika' },
  { code: 'KGL', name: 'Kigali', city: 'Kigali', country: 'Ruanda', region: 'Doğu Afrika', continent: 'Afrika' },
  
  // West Africa
  { code: 'LOS', name: 'Murtala Muhammed', city: 'Lagos', country: 'Nijerya', region: 'Batı Afrika', continent: 'Afrika' },
  { code: 'ABV', name: 'Nnamdi Azikiwe', city: 'Abuja', country: 'Nijerya', region: 'Batı Afrika', continent: 'Afrika' },
  { code: 'ACC', name: 'Kotoka', city: 'Accra', country: 'Gana', region: 'Batı Afrika', continent: 'Afrika' },
  { code: 'DKR', name: 'Blaise Diagne', city: 'Dakar', country: 'Senegal', region: 'Batı Afrika', continent: 'Afrika' },
  { code: 'ABJ', name: 'Port Bouet', city: 'Abidjan', country: 'Fildişi Sahili', region: 'Batı Afrika', continent: 'Afrika' },
  
  // Islands
  { code: 'MRU', name: 'Sir Seewoosagur', city: 'Port Louis', country: 'Mauritius', region: 'Hint Okyanusu', continent: 'Afrika' },
  { code: 'SEZ', name: 'Seyşeller', city: 'Mahe', country: 'Seyşeller', region: 'Hint Okyanusu', continent: 'Afrika' },
  { code: 'TNR', name: 'Ivato', city: 'Antananarivo', country: 'Madagaskar', region: 'Hint Okyanusu', continent: 'Afrika' },
  { code: 'RUN', name: 'Roland Garros', city: 'St. Denis', country: 'Reunion', region: 'Hint Okyanusu', continent: 'Afrika' },

  // ========== NORTH AMERICA ==========
  // USA - East Coast
  { code: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'EWR', name: 'Newark Liberty', city: 'New York', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'LGA', name: 'LaGuardia', city: 'New York', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'BOS', name: 'Logan', city: 'Boston', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'MIA', name: 'Miami', city: 'Miami', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'FLL', name: 'Fort Lauderdale', city: 'Fort Lauderdale', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'MCO', name: 'Orlando', city: 'Orlando', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'TPA', name: 'Tampa', city: 'Tampa', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'ATL', name: 'Hartsfield-Jackson', city: 'Atlanta', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'IAD', name: 'Washington Dulles', city: 'Washington D.C.', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'DCA', name: 'Reagan National', city: 'Washington D.C.', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'PHL', name: 'Philadelphia', city: 'Philadelphia', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'CLT', name: 'Charlotte', city: 'Charlotte', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  
  // USA - Central
  { code: 'ORD', name: "O'Hare", city: 'Chicago', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'MDW', name: 'Midway', city: 'Chicago', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'DFW', name: 'Dallas/Fort Worth', city: 'Dallas', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'IAH', name: 'George Bush', city: 'Houston', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'HOU', name: 'Hobby', city: 'Houston', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'MSP', name: 'Minneapolis-St. Paul', city: 'Minneapolis', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'DTW', name: 'Detroit', city: 'Detroit', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'DEN', name: 'Denver', city: 'Denver', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'MSY', name: 'Louis Armstrong', city: 'New Orleans', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  
  // USA - West Coast
  { code: 'LAX', name: 'Los Angeles', city: 'Los Angeles', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'SFO', name: 'San Francisco', city: 'San Francisco', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'SEA', name: 'Seattle-Tacoma', city: 'Seattle', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'SAN', name: 'San Diego', city: 'San Diego', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'LAS', name: 'Harry Reid', city: 'Las Vegas', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'PHX', name: 'Phoenix', city: 'Phoenix', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'PDX', name: 'Portland', city: 'Portland', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'SJC', name: 'San Jose', city: 'San Jose', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'OAK', name: 'Oakland', city: 'Oakland', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  
  // USA - Hawaii & Alaska
  { code: 'HNL', name: 'Honolulu', city: 'Honolulu', country: 'ABD', region: 'Hawaii', continent: 'Amerika' },
  { code: 'OGG', name: 'Kahului', city: 'Maui', country: 'ABD', region: 'Hawaii', continent: 'Amerika' },
  { code: 'ANC', name: 'Ted Stevens', city: 'Anchorage', country: 'ABD', region: 'Alaska', continent: 'Amerika' },
  
  // Canada
  { code: 'YYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'Kanada', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'YVR', name: 'Vancouver', city: 'Vancouver', country: 'Kanada', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'YUL', name: 'Montreal Trudeau', city: 'Montreal', country: 'Kanada', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'YYC', name: 'Calgary', city: 'Calgary', country: 'Kanada', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'YOW', name: 'Ottawa', city: 'Ottawa', country: 'Kanada', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'YEG', name: 'Edmonton', city: 'Edmonton', country: 'Kanada', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'YHZ', name: 'Halifax', city: 'Halifax', country: 'Kanada', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'YWG', name: 'Winnipeg', city: 'Winnipeg', country: 'Kanada', region: 'Kuzey Amerika', continent: 'Amerika' },

  // ========== MEXICO & CENTRAL AMERICA ==========
  { code: 'MEX', name: 'Benito Juárez', city: 'Mexico City', country: 'Meksika', region: 'Orta Amerika', continent: 'Amerika' },
  { code: 'CUN', name: 'Cancún', city: 'Cancún', country: 'Meksika', region: 'Orta Amerika', continent: 'Amerika' },
  { code: 'GDL', name: 'Guadalajara', city: 'Guadalajara', country: 'Meksika', region: 'Orta Amerika', continent: 'Amerika' },
  { code: 'SJD', name: 'Los Cabos', city: 'San José del Cabo', country: 'Meksika', region: 'Orta Amerika', continent: 'Amerika' },
  { code: 'PVR', name: 'Puerto Vallarta', city: 'Puerto Vallarta', country: 'Meksika', region: 'Orta Amerika', continent: 'Amerika' },
  { code: 'MTY', name: 'Monterrey', city: 'Monterrey', country: 'Meksika', region: 'Orta Amerika', continent: 'Amerika' },
  { code: 'TIJ', name: 'Tijuana', city: 'Tijuana', country: 'Meksika', region: 'Orta Amerika', continent: 'Amerika' },
  { code: 'PTY', name: 'Tocumen', city: 'Panama City', country: 'Panama', region: 'Orta Amerika', continent: 'Amerika' },
  { code: 'SJO', name: 'Juan Santamaría', city: 'San José', country: 'Kosta Rika', region: 'Orta Amerika', continent: 'Amerika' },
  { code: 'LIR', name: 'Liberia', city: 'Liberia', country: 'Kosta Rika', region: 'Orta Amerika', continent: 'Amerika' },
  { code: 'GUA', name: 'La Aurora', city: 'Guatemala City', country: 'Guatemala', region: 'Orta Amerika', continent: 'Amerika' },
  { code: 'SAL', name: 'El Salvador', city: 'San Salvador', country: 'El Salvador', region: 'Orta Amerika', continent: 'Amerika' },
  { code: 'BZE', name: 'Philip Goldson', city: 'Belize City', country: 'Belize', region: 'Orta Amerika', continent: 'Amerika' },
  { code: 'MGA', name: 'Managua', city: 'Managua', country: 'Nikaragua', region: 'Orta Amerika', continent: 'Amerika' },
  { code: 'TGU', name: 'Toncontín', city: 'Tegucigalpa', country: 'Honduras', region: 'Orta Amerika', continent: 'Amerika' },

  // ========== CARIBBEAN ==========
  { code: 'HAV', name: 'José Martí', city: 'Havana', country: 'Küba', region: 'Karayipler', continent: 'Amerika' },
  { code: 'VRA', name: 'Juan Gualberto', city: 'Varadero', country: 'Küba', region: 'Karayipler', continent: 'Amerika' },
  { code: 'SDQ', name: 'Las Américas', city: 'Santo Domingo', country: 'Dominik Cumhuriyeti', region: 'Karayipler', continent: 'Amerika' },
  { code: 'PUJ', name: 'Punta Cana', city: 'Punta Cana', country: 'Dominik Cumhuriyeti', region: 'Karayipler', continent: 'Amerika' },
  { code: 'SJU', name: 'Luis Muñoz Marín', city: 'San Juan', country: 'Porto Riko', region: 'Karayipler', continent: 'Amerika' },
  { code: 'MBJ', name: 'Sangster', city: 'Montego Bay', country: 'Jamaika', region: 'Karayipler', continent: 'Amerika' },
  { code: 'KIN', name: 'Norman Manley', city: 'Kingston', country: 'Jamaika', region: 'Karayipler', continent: 'Amerika' },
  { code: 'NAS', name: 'Lynden Pindling', city: 'Nassau', country: 'Bahamalar', region: 'Karayipler', continent: 'Amerika' },
  { code: 'AUA', name: 'Queen Beatrix', city: 'Oranjestad', country: 'Aruba', region: 'Karayipler', continent: 'Amerika' },
  { code: 'CUR', name: 'Hato', city: 'Willemstad', country: 'Curaçao', region: 'Karayipler', continent: 'Amerika' },
  { code: 'BGI', name: 'Grantley Adams', city: 'Bridgetown', country: 'Barbados', region: 'Karayipler', continent: 'Amerika' },
  { code: 'POS', name: 'Piarco', city: 'Port of Spain', country: 'Trinidad ve Tobago', region: 'Karayipler', continent: 'Amerika' },
  { code: 'SXM', name: 'Princess Juliana', city: 'St. Maarten', country: 'Sint Maarten', region: 'Karayipler', continent: 'Amerika' },

  // ========== SOUTH AMERICA ==========
  // Brazil
  { code: 'GRU', name: 'Guarulhos', city: 'São Paulo', country: 'Brezilya', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'CGH', name: 'Congonhas', city: 'São Paulo', country: 'Brezilya', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'GIG', name: 'Galeão', city: 'Rio de Janeiro', country: 'Brezilya', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'SDU', name: 'Santos Dumont', city: 'Rio de Janeiro', country: 'Brezilya', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'BSB', name: 'Brasilia', city: 'Brasília', country: 'Brezilya', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'CNF', name: 'Confins', city: 'Belo Horizonte', country: 'Brezilya', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'FOR', name: 'Pinto Martins', city: 'Fortaleza', country: 'Brezilya', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'REC', name: 'Guararapes', city: 'Recife', country: 'Brezilya', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'SSA', name: 'Salvador', city: 'Salvador', country: 'Brezilya', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'POA', name: 'Salgado Filho', city: 'Porto Alegre', country: 'Brezilya', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'CWB', name: 'Afonso Pena', city: 'Curitiba', country: 'Brezilya', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'FLN', name: 'Florianopolis', city: 'Florianópolis', country: 'Brezilya', region: 'Güney Amerika', continent: 'Amerika' },
  
  // Argentina
  { code: 'EZE', name: 'Ministro Pistarini', city: 'Buenos Aires', country: 'Arjantin', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'AEP', name: 'Aeroparque', city: 'Buenos Aires', country: 'Arjantin', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'COR', name: 'Córdoba', city: 'Córdoba', country: 'Arjantin', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'MDZ', name: 'Mendoza', city: 'Mendoza', country: 'Arjantin', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'BRC', name: 'San Carlos de Bariloche', city: 'Bariloche', country: 'Arjantin', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'IGR', name: 'Cataratas del Iguazú', city: 'Iguazú', country: 'Arjantin', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'USH', name: 'Malvinas Argentinas', city: 'Ushuaia', country: 'Arjantin', region: 'Güney Amerika', continent: 'Amerika' },
  
  // Chile
  { code: 'SCL', name: 'Arturo Merino Benítez', city: 'Santiago', country: 'Şili', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'IPC', name: 'Mataveri', city: 'Easter Island', country: 'Şili', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'PUQ', name: 'Presidente Ibáñez', city: 'Punta Arenas', country: 'Şili', region: 'Güney Amerika', continent: 'Amerika' },
  
  // Other South America
  { code: 'BOG', name: 'El Dorado', city: 'Bogota', country: 'Kolombiya', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'MDE', name: 'José María Córdova', city: 'Medellín', country: 'Kolombiya', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'CTG', name: 'Rafael Núñez', city: 'Cartagena', country: 'Kolombiya', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'LIM', name: 'Jorge Chávez', city: 'Lima', country: 'Peru', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'CUZ', name: 'Velazco Astete', city: 'Cusco', country: 'Peru', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'UIO', name: 'Mariscal Sucre', city: 'Quito', country: 'Ekvador', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'GYE', name: 'José Joaquín de Olmedo', city: 'Guayaquil', country: 'Ekvador', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'GPS', name: 'Seymour', city: 'Galápagos', country: 'Ekvador', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'CCS', name: 'Simón Bolívar', city: 'Caracas', country: 'Venezuela', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'VVI', name: 'Viru Viru', city: 'Santa Cruz', country: 'Bolivya', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'LPB', name: 'El Alto', city: 'La Paz', country: 'Bolivya', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'ASU', name: 'Silvio Pettirossi', city: 'Asunción', country: 'Paraguay', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'MVD', name: 'Carrasco', city: 'Montevideo', country: 'Uruguay', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'GEO', name: 'Cheddi Jagan', city: 'Georgetown', country: 'Guyana', region: 'Güney Amerika', continent: 'Amerika' },
  { code: 'PBM', name: 'Johan Adolf Pengel', city: 'Paramaribo', country: 'Surinam', region: 'Güney Amerika', continent: 'Amerika' },

  // ========== OCEANIA ==========
  // Australia
  { code: 'SYD', name: 'Kingsford Smith', city: 'Sydney', country: 'Avustralya', region: 'Okyanusya', continent: 'Okyanusya' },
  { code: 'MEL', name: 'Tullamarine', city: 'Melbourne', country: 'Avustralya', region: 'Okyanusya', continent: 'Okyanusya' },
  { code: 'BNE', name: 'Brisbane', city: 'Brisbane', country: 'Avustralya', region: 'Okyanusya', continent: 'Okyanusya' },
  { code: 'PER', name: 'Perth', city: 'Perth', country: 'Avustralya', region: 'Okyanusya', continent: 'Okyanusya' },
  { code: 'ADL', name: 'Adelaide', city: 'Adelaide', country: 'Avustralya', region: 'Okyanusya', continent: 'Okyanusya' },
  { code: 'CNS', name: 'Cairns', city: 'Cairns', country: 'Avustralya', region: 'Okyanusya', continent: 'Okyanusya' },
  { code: 'OOL', name: 'Gold Coast', city: 'Gold Coast', country: 'Avustralya', region: 'Okyanusya', continent: 'Okyanusya' },
  { code: 'DRW', name: 'Darwin', city: 'Darwin', country: 'Avustralya', region: 'Okyanusya', continent: 'Okyanusya' },
  { code: 'HBA', name: 'Hobart', city: 'Hobart', country: 'Avustralya', region: 'Okyanusya', continent: 'Okyanusya' },
  
  // New Zealand
  { code: 'AKL', name: 'Auckland', city: 'Auckland', country: 'Yeni Zelanda', region: 'Okyanusya', continent: 'Okyanusya' },
  { code: 'WLG', name: 'Wellington', city: 'Wellington', country: 'Yeni Zelanda', region: 'Okyanusya', continent: 'Okyanusya' },
  { code: 'CHC', name: 'Christchurch', city: 'Christchurch', country: 'Yeni Zelanda', region: 'Okyanusya', continent: 'Okyanusya' },
  { code: 'ZQN', name: 'Queenstown', city: 'Queenstown', country: 'Yeni Zelanda', region: 'Okyanusya', continent: 'Okyanusya' },
  
  // Pacific Islands
  { code: 'NAN', name: 'Nadi', city: 'Nadi', country: 'Fiji', region: 'Pasifik', continent: 'Okyanusya' },
  { code: 'PPT', name: 'Faa\'a', city: 'Tahiti', country: 'Fransız Polinezyası', region: 'Pasifik', continent: 'Okyanusya' },
  { code: 'NOU', name: 'La Tontouta', city: 'Nouméa', country: 'Yeni Kaledonya', region: 'Pasifik', continent: 'Okyanusya' },
  { code: 'APW', name: 'Faleolo', city: 'Apia', country: 'Samoa', region: 'Pasifik', continent: 'Okyanusya' },
  { code: 'TBU', name: 'Fua\'amotu', city: 'Tongatapu', country: 'Tonga', region: 'Pasifik', continent: 'Okyanusya' },
  { code: 'VLI', name: 'Bauerfield', city: 'Port Vila', country: 'Vanuatu', region: 'Pasifik', continent: 'Okyanusya' },
  { code: 'POM', name: 'Jackson', city: 'Port Moresby', country: 'Papua Yeni Gine', region: 'Pasifik', continent: 'Okyanusya' },
];

// Normalize Turkish characters for search
function normalizeTurkish(text: string): string {
  return text
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'c');
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

function fuzzyMatchScore(query: string, target: string): number {
  const normalizedQuery = normalizeTurkish(query);
  const normalizedTarget = normalizeTurkish(target);
  
  if (normalizedTarget === normalizedQuery) return 1;
  if (normalizedTarget.startsWith(normalizedQuery)) return 0.95;
  if (normalizedTarget.includes(normalizedQuery)) return 0.85;
  
  const queryWords = normalizedQuery.split(/\s+/);
  const allWordsFound = queryWords.every(word => normalizedTarget.includes(word));
  if (allWordsFound) return 0.75;
  
  const distance = levenshteinDistance(normalizedQuery, normalizedTarget.slice(0, normalizedQuery.length + 3));
  const maxLen = Math.max(normalizedQuery.length, normalizedTarget.slice(0, normalizedQuery.length + 3).length);
  const similarity = 1 - (distance / maxLen);
  
  return similarity > 0.6 ? similarity * 0.7 : 0;
}

// Comprehensive typo corrections including English/Turkish variations
const typoCorrections: Record<string, string[]> = {
  'istanbul': ['istanb', 'istanbu', 'istambul', 'istabul', 'istanbull', 'istanbol', 'isstanbul'],
  'ankara': ['ankar', 'ankra', 'anakara', 'ankkara'],
  'izmir': ['izmr', 'izmi', 'izmır', 'ızmir'],
  'antalya': ['antaly', 'antalay', 'antala', 'antlya'],
  'paris': ['pris', 'parıs', 'pariss'],
  'londra': ['london', 'londn', 'londen', 'lundon'],
  'berlin': ['berln', 'berlın', 'berlinn'],
  'barselona': ['barcelona', 'barcelon', 'barsalona', 'barçelona'],
  'amsterdam': ['amsterda', 'amsteram', 'amsterdm'],
  'dubai': ['duba', 'dubaı', 'dubay'],
  'roma': ['rom', 'rome'],
  'milano': ['milan', 'millan'],
  'new york': ['newyork', 'new yor', 'nyc', 'newyorkcity'],
  'los angeles': ['la', 'losangeles', 'los angel'],
  'bangkok': ['bangko', 'bangkk', 'bankok'],
  'tokyo': ['toky', 'tokio', 'tokyoo'],
  'singapur': ['singapore', 'singapo', 'singapour'],
  'budapeşte': ['budapest', 'budapeste', 'budapeşt'],
  'prag': ['prague', 'prg', 'praque'],
  'viyana': ['vienna', 'wien', 'viena'],
  'lizbon': ['lisbon', 'lisboa', 'lisbona'],
  'madrid': ['madrit', 'madrd', 'madrıd'],
  'bali': ['balli', 'balı', 'denpasar', 'ubud'],
  'phuket': ['puhket', 'puket', 'fuket'],
  'seul': ['seoul', 'soul', 'seeoul'],
  'pekin': ['beijing', 'peking', 'bejing'],
  'şanghay': ['shanghai', 'shangai', 'şangay'],
  'hong kong': ['hongkong', 'honkong'],
  'taipei': ['taypey', 'taipey', 'taipe'],
  'moskova': ['moscow', 'moskow', 'moskov'],
  'atina': ['athens', 'athina', 'athen'],
  'kahire': ['cairo', 'kairo', 'kayro'],
  'marakeş': ['marrakech', 'marrakesh', 'marakesh'],
  'sydney': ['sidni', 'sydne', 'sideny'],
  'melbourne': ['melburn', 'melbourn'],
  'los cabos': ['cabo', 'cabos', 'loscabos'],
  'cancun': ['cancún', 'kankun', 'cancn'],
  'punta cana': ['puntacana', 'puntakana'],
  'havana': ['havanna', 'havna'],
  'zanzibar': ['zansibar', 'zanzıbar'],
  'maldivler': ['maldives', 'maldiv', 'maldivs'],
  'seyşeller': ['seychelles', 'seyseller', 'seysel'],
  'mauritius': ['mauritus', 'morityus', 'maurisyus'],
  'fiji': ['fici', 'fıji'],
  'tahiti': ['tahıti', 'tahitı'],
};

function getGenericErrorMessage(): string {
  return 'Havalimanı araması başarısız oldu. Lütfen tekrar deneyin.';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIP = getClientIP(req);
  const rateLimit = getRateLimitInfo(clientIP);
  
  if (!rateLimit.allowed) {
    console.log(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Çok fazla istek gönderildi. Lütfen bir dakika bekleyin.' 
    }), {
      status: 429,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(rateLimit.resetTime / 1000))
      },
    });
  }

  try {
    let query = '';
    
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        query = sanitizeString(body?.query);
      } catch {
        query = '';
      }
    } else {
      const url = new URL(req.url);
      query = sanitizeString(url.searchParams.get('query'));
    }

    const normalizedQuery = normalizeTurkish(query);
    console.log('Airport search query (normalized):', normalizedQuery, '- Total airports:', airports.length);

    // Check for typo corrections first
    let correctedQuery = normalizedQuery;
    for (const [correct, typos] of Object.entries(typoCorrections)) {
      if (typos.some(typo => normalizeTurkish(typo) === normalizedQuery || normalizedQuery.includes(normalizeTurkish(typo)))) {
        correctedQuery = correct;
        console.log(`Typo correction: "${normalizedQuery}" -> "${correctedQuery}"`);
        break;
      }
    }

    let filteredAirports = airports;
    
    if (normalizedQuery.length >= 2) {
      const scoredAirports = airports.map(airport => {
        const fields = [
          { value: airport.code, weight: 1.2 },
          { value: airport.city, weight: 1.1 },
          { value: airport.name, weight: 1.0 },
          { value: airport.country, weight: 0.9 },
          { value: airport.region, weight: 0.8 },
          { value: airport.continent, weight: 0.7 },
        ];
        
        let bestScore = 0;
        for (const field of fields) {
          const scoreWithCorrected = fuzzyMatchScore(correctedQuery, field.value) * field.weight;
          const scoreWithOriginal = fuzzyMatchScore(normalizedQuery, field.value) * field.weight;
          bestScore = Math.max(bestScore, scoreWithCorrected, scoreWithOriginal);
        }
        
        return { airport, score: bestScore };
      });
      
      filteredAirports = scoredAirports
        .filter(item => item.score > 0.5)
        .sort((a, b) => b.score - a.score)
        .map(item => item.airport);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: filteredAirports.slice(0, 20) 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in get-airports function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: getGenericErrorMessage()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
