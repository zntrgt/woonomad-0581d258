import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute per IP

// In-memory rate limit store (resets on cold start, but provides basic protection)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitInfo(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    // New window
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

// Input validation helpers
const MAX_QUERY_LENGTH = 100;

function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  // Remove any potentially dangerous characters, limit length
  return input.slice(0, MAX_QUERY_LENGTH).replace(/[<>'"\\]/g, '').trim();
}

// Popular Turkish airports and major international destinations with regions
const airports = [
  // Turkey - Marmara
  { code: 'IST', name: 'İstanbul Havalimanı', city: 'İstanbul', country: 'Türkiye', region: 'Marmara', continent: 'Avrupa' },
  { code: 'SAW', name: 'Sabiha Gökçen', city: 'İstanbul', country: 'Türkiye', region: 'Marmara', continent: 'Avrupa' },
  // Turkey - İç Anadolu
  { code: 'ESB', name: 'Esenboğa Havalimanı', city: 'Ankara', country: 'Türkiye', region: 'İç Anadolu', continent: 'Avrupa' },
  // Turkey - Ege
  { code: 'ADB', name: 'Adnan Menderes', city: 'İzmir', country: 'Türkiye', region: 'Ege', continent: 'Avrupa' },
  { code: 'DLM', name: 'Dalaman Havalimanı', city: 'Muğla', country: 'Türkiye', region: 'Ege', continent: 'Avrupa' },
  { code: 'BJV', name: 'Milas-Bodrum', city: 'Bodrum', country: 'Türkiye', region: 'Ege', continent: 'Avrupa' },
  // Turkey - Akdeniz
  { code: 'AYT', name: 'Antalya Havalimanı', city: 'Antalya', country: 'Türkiye', region: 'Akdeniz', continent: 'Avrupa' },
  // Turkey - Karadeniz
  { code: 'TZX', name: 'Trabzon Havalimanı', city: 'Trabzon', country: 'Türkiye', region: 'Karadeniz', continent: 'Avrupa' },
  // Turkey - Güneydoğu
  { code: 'GZT', name: 'Gaziantep Havalimanı', city: 'Gaziantep', country: 'Türkiye', region: 'Güneydoğu Anadolu', continent: 'Avrupa' },
  { code: 'DIY', name: 'Diyarbakır Havalimanı', city: 'Diyarbakır', country: 'Türkiye', region: 'Güneydoğu Anadolu', continent: 'Avrupa' },
  // Turkey - Doğu
  { code: 'VAN', name: 'Van Ferit Melen', city: 'Van', country: 'Türkiye', region: 'Doğu Anadolu', continent: 'Avrupa' },
  // Cyprus
  { code: 'ECN', name: 'Ercan Havalimanı', city: 'Lefkoşa', country: 'Kuzey Kıbrıs', region: 'Kıbrıs', continent: 'Avrupa' },
  
  // Europe - Western
  { code: 'LHR', name: 'Heathrow', city: 'Londra', country: 'İngiltere', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'Fransa', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'AMS', name: 'Schiphol', city: 'Amsterdam', country: 'Hollanda', region: 'Batı Avrupa', continent: 'Avrupa' },
  { code: 'BRU', name: 'Brüksel', city: 'Brüksel', country: 'Belçika', region: 'Batı Avrupa', continent: 'Avrupa' },
  
  // Europe - Southern
  { code: 'FCO', name: 'Fiumicino', city: 'Roma', country: 'İtalya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'MXP', name: 'Malpensa', city: 'Milano', country: 'İtalya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'BCN', name: 'El Prat', city: 'Barselona', country: 'İspanya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'MAD', name: 'Barajas', city: 'Madrid', country: 'İspanya', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'LIS', name: 'Lisbon Portela', city: 'Lizbon', country: 'Portekiz', region: 'Güney Avrupa', continent: 'Avrupa' },
  { code: 'ATH', name: 'Eleftherios Venizelos', city: 'Atina', country: 'Yunanistan', region: 'Güney Avrupa', continent: 'Avrupa' },
  
  // Europe - Central
  { code: 'FRA', name: 'Frankfurt', city: 'Frankfurt', country: 'Almanya', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'MUC', name: 'Münih', city: 'Münih', country: 'Almanya', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', country: 'Almanya', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'ZRH', name: 'Zürih', city: 'Zürih', country: 'İsviçre', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'VIE', name: 'Viyana', city: 'Viyana', country: 'Avusturya', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'PRG', name: 'Vaclav Havel', city: 'Prag', country: 'Çekya', region: 'Orta Avrupa', continent: 'Avrupa' },
  { code: 'BUD', name: 'Budapeşte', city: 'Budapeşte', country: 'Macaristan', region: 'Orta Avrupa', continent: 'Avrupa' },
  
  // Europe - Eastern
  { code: 'WAW', name: 'Varşova Chopin', city: 'Varşova', country: 'Polonya', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'OTP', name: 'Bükreş Otopeni', city: 'Bükreş', country: 'Romanya', region: 'Doğu Avrupa', continent: 'Avrupa' },
  { code: 'SOF', name: 'Sofya', city: 'Sofya', country: 'Bulgaristan', region: 'Doğu Avrupa', continent: 'Avrupa' },
  
  // Europe - Nordic
  { code: 'CPH', name: 'Kopenhag', city: 'Kopenhag', country: 'Danimarka', region: 'Kuzey Avrupa', continent: 'Avrupa' },
  { code: 'ARN', name: 'Stockholm Arlanda', city: 'Stockholm', country: 'İsveç', region: 'Kuzey Avrupa', continent: 'Avrupa' },
  { code: 'HEL', name: 'Helsinki-Vantaa', city: 'Helsinki', country: 'Finlandiya', region: 'Kuzey Avrupa', continent: 'Avrupa' },
  
  // Middle East
  { code: 'DXB', name: 'Dubai', city: 'Dubai', country: 'BAE', region: 'Körfez', continent: 'Asya' },
  { code: 'AUH', name: 'Abu Dabi', city: 'Abu Dabi', country: 'BAE', region: 'Körfez', continent: 'Asya' },
  { code: 'DOH', name: 'Hamad', city: 'Doha', country: 'Katar', region: 'Körfez', continent: 'Asya' },
  { code: 'TLV', name: 'Ben Gurion', city: 'Tel Aviv', country: 'İsrail', region: 'Orta Doğu', continent: 'Asya' },
  { code: 'AMM', name: 'Queen Alia', city: 'Amman', country: 'Ürdün', region: 'Orta Doğu', continent: 'Asya' },
  
  // Americas
  { code: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'LAX', name: 'Los Angeles', city: 'Los Angeles', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'MIA', name: 'Miami', city: 'Miami', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'ORD', name: "O'Hare", city: 'Chicago', country: 'ABD', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'YYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'Kanada', region: 'Kuzey Amerika', continent: 'Amerika' },
  { code: 'GRU', name: 'Guarulhos', city: 'São Paulo', country: 'Brezilya', region: 'Güney Amerika', continent: 'Amerika' },
  
  // Asia
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Tayland', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'SIN', name: 'Changi', city: 'Singapur', country: 'Singapur', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'KUL', name: 'Kuala Lumpur', city: 'Kuala Lumpur', country: 'Malezya', region: 'Güneydoğu Asya', continent: 'Asya' },
  { code: 'HKG', name: 'Hong Kong', city: 'Hong Kong', country: 'Çin', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'NRT', name: 'Narita', city: 'Tokyo', country: 'Japonya', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'ICN', name: 'Incheon', city: 'Seul', country: 'Güney Kore', region: 'Doğu Asya', continent: 'Asya' },
  { code: 'DEL', name: 'Indira Gandhi', city: 'Delhi', country: 'Hindistan', region: 'Güney Asya', continent: 'Asya' },
  
  // Africa
  { code: 'CAI', name: 'Kahire', city: 'Kahire', country: 'Mısır', region: 'Kuzey Afrika', continent: 'Afrika' },
  { code: 'CMN', name: 'Muhammed V', city: 'Kazablanka', country: 'Fas', region: 'Kuzey Afrika', continent: 'Afrika' },
  { code: 'JNB', name: 'O.R. Tambo', city: 'Johannesburg', country: 'Güney Afrika', region: 'Güney Afrika', continent: 'Afrika' },
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

// Calculate fuzzy match score (0-1, higher is better)
function fuzzyMatchScore(query: string, target: string): number {
  const normalizedQuery = normalizeTurkish(query);
  const normalizedTarget = normalizeTurkish(target);
  
  // Exact match
  if (normalizedTarget === normalizedQuery) return 1;
  
  // Starts with query
  if (normalizedTarget.startsWith(normalizedQuery)) return 0.95;
  
  // Contains query
  if (normalizedTarget.includes(normalizedQuery)) return 0.85;
  
  // Check if query words are in target
  const queryWords = normalizedQuery.split(/\s+/);
  const allWordsFound = queryWords.every(word => normalizedTarget.includes(word));
  if (allWordsFound) return 0.75;
  
  // Levenshtein distance based scoring
  const distance = levenshteinDistance(normalizedQuery, normalizedTarget.slice(0, normalizedQuery.length + 3));
  const maxLen = Math.max(normalizedQuery.length, normalizedTarget.slice(0, normalizedQuery.length + 3).length);
  const similarity = 1 - (distance / maxLen);
  
  // Only return if similarity is above threshold
  return similarity > 0.6 ? similarity * 0.7 : 0;
}

// Common typo corrections
const typoCorrections: Record<string, string[]> = {
  'istanbul': ['istanb', 'istanbu', 'istambul', 'istabul', 'istanbull', 'istanbol', 'istanbul', 'isstanbul'],
  'ankara': ['ankar', 'ankra', 'anakara', 'ankkara'],
  'izmir': ['izmr', 'izmi', 'izmır', 'ızmir'],
  'antalya': ['antaly', 'antalay', 'antala', 'antlya'],
  'paris': ['pris', 'paris', 'parıs', 'pariss'],
  'london': ['londn', 'londra', 'londen', 'lundon'],
  'berlin': ['berln', 'berlın', 'berlinn'],
  'barcelona': ['barcelon', 'barselona', 'barsalona', 'barçelona'],
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
};

// Generic error message - don't expose internal details
function getGenericErrorMessage(): string {
  return 'Havalimanı araması başarısız oldu. Lütfen tekrar deneyin.';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
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
    
    // Try to get query from body (POST request)
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        query = sanitizeString(body?.query);
      } catch {
        query = '';
      }
    } else {
      // Fallback to URL params (GET request)
      const url = new URL(req.url);
      query = sanitizeString(url.searchParams.get('query'));
    }

    const normalizedQuery = normalizeTurkish(query);
    console.log('Airport search query (normalized):', normalizedQuery);

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
      // Score each airport based on fuzzy matching
      const scoredAirports = airports.map(airport => {
        const fields = [
          { value: airport.code, weight: 1.2 },
          { value: airport.city, weight: 1.1 },
          { value: airport.name, weight: 1.0 },
          { value: airport.country, weight: 0.9 },
          { value: airport.region, weight: 0.8 },
          { value: airport.continent, weight: 0.7 },
        ];
        
        // Calculate best score across all fields, using corrected query
        let bestScore = 0;
        for (const field of fields) {
          const scoreWithCorrected = fuzzyMatchScore(correctedQuery, field.value) * field.weight;
          const scoreWithOriginal = fuzzyMatchScore(normalizedQuery, field.value) * field.weight;
          bestScore = Math.max(bestScore, scoreWithCorrected, scoreWithOriginal);
        }
        
        return { airport, score: bestScore };
      });
      
      // Filter and sort by score
      filteredAirports = scoredAirports
        .filter(item => item.score > 0.5)
        .sort((a, b) => b.score - a.score)
        .map(item => item.airport);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: filteredAirports.slice(0, 15) 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    // Log full error for debugging, return generic message to client
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
