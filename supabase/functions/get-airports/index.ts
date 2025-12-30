import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let query = '';
    
    // Try to get query from body (POST request)
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        query = normalizeTurkish(body?.query || '');
      } catch {
        query = '';
      }
    } else {
      // Fallback to URL params (GET request)
      const url = new URL(req.url);
      query = normalizeTurkish(url.searchParams.get('query') || '');
    }

    console.log('Airport search query (normalized):', query);

    let filteredAirports = airports;
    
    if (query.length >= 2) {
      filteredAirports = airports.filter(airport => {
        const normalizedCode = normalizeTurkish(airport.code);
        const normalizedName = normalizeTurkish(airport.name);
        const normalizedCity = normalizeTurkish(airport.city);
        const normalizedCountry = normalizeTurkish(airport.country);
        const normalizedRegion = normalizeTurkish(airport.region);
        const normalizedContinent = normalizeTurkish(airport.continent);
        
        return normalizedCode.includes(query) ||
          normalizedName.includes(query) ||
          normalizedCity.includes(query) ||
          normalizedCountry.includes(query) ||
          normalizedRegion.includes(query) ||
          normalizedContinent.includes(query);
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: filteredAirports.slice(0, 15) 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in get-airports function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
