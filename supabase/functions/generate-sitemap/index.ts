import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Supported languages
const languages = ["tr", "en", "de", "fr", "es", "ar"] as const;
type Language = typeof languages[number];

// Route translations for multilingual sitemap
const routeTranslations: Record<Language, {
  city: string;
  cities: string;
  hotels: string;
  hotel: string;
  flights: string;
  flight: string;
  nomad: string;
  coworking: string;
  blog: string;
  'nomad-hub': string;
  'privacy-policy': string;
  'terms-of-service': string;
  'cookie-policy': string;
  kvkk: string;
}> = {
  tr: {
    city: 'sehir',
    cities: 'sehirler',
    hotels: 'oteller',
    hotel: 'otel',
    flights: 'ucuslar',
    flight: 'ucus',
    nomad: 'nomad',
    coworking: 'coworking',
    blog: 'blog',
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
    'nomad-hub': 'digital-nomad',
    'privacy-policy': 'privacy-policy',
    'terms-of-service': 'terms-of-service',
    'cookie-policy': 'cookie-policy',
    kvkk: 'data-protection',
  },
};

// Helper to get URL prefix for language
function getLangPrefix(lang: Language): string {
  return lang === 'tr' ? '' : `/${lang}`;
}

// Generate hreflang alternates for a URL
function generateXhtmlLinks(baseUrl: string, path: string, allPaths: Record<Language, string>): string {
  return languages.map(lang => {
    const hreflang = lang === 'tr' ? 'tr-TR' : lang;
    return `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${baseUrl}${allPaths[lang]}" />`;
  }).join('\n') + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${allPaths.tr}" />`;
}

// Complete cities list
const cities = [
  "istanbul", "antalya", "izmir", "bodrum", "kapadokya",
  "berlin", "munih", "frankfurt",
  "paris", "londra", "amsterdam",
  "barcelona", "madrid",
  "roma", "milano", "venedik", "floransa",
  "lizbon", "porto", "atina",
  "prag", "viyana", "budapeste",
  "kopenhag", "stockholm",
  "dubai", "amman", "tiflis", "baku",
  "tokyo", "bangkok", "singapur", "bali", "seul",
  "newyork", "belgrad", "sarajevo",
  "marakes", "zanzibar"
];

// Static hotel data - synced with src/lib/hotels.ts and src/lib/hotelsExpanded.ts
const hotelData = [
  // Istanbul (base + expanded)
  { citySlug: "istanbul", slug: "four-seasons-sultanahmet-istanbul" },
  { citySlug: "istanbul", slug: "ciragan-palace-kempinski-istanbul" },
  { citySlug: "istanbul", slug: "soho-house-istanbul" },
  { citySlug: "istanbul", slug: "the-marmara-taksim-istanbul" },
  { citySlug: "istanbul", slug: "raffles-istanbul" },
  { citySlug: "istanbul", slug: "st-regis-istanbul" },
  { citySlug: "istanbul", slug: "shangri-la-bosphorus-istanbul" },
  { citySlug: "istanbul", slug: "pera-palace-hotel-istanbul" },
  { citySlug: "istanbul", slug: "ajwa-hotel-sultanahmet-istanbul" },
  { citySlug: "istanbul", slug: "ritz-carlton-istanbul" },
  { citySlug: "istanbul", slug: "swissotel-bosphorus-istanbul" },
  { citySlug: "istanbul", slug: "w-istanbul" },
  { citySlug: "istanbul", slug: "hotel-niles-istanbul" },
  { citySlug: "istanbul", slug: "ada-hotel-istanbul" },
  // Antalya (base + expanded)
  { citySlug: "antalya", slug: "regnum-carya-antalya" },
  { citySlug: "antalya", slug: "titanic-mardan-palace-antalya" },
  { citySlug: "antalya", slug: "akra-hotel-antalya" },
  { citySlug: "antalya", slug: "maxx-royal-belek-antalya" },
  { citySlug: "antalya", slug: "rixos-premium-belek-antalya" },
  { citySlug: "antalya", slug: "calista-luxury-resort-antalya" },
  { citySlug: "antalya", slug: "gloria-serenity-resort-antalya" },
  { citySlug: "antalya", slug: "susesi-luxury-resort-antalya" },
  { citySlug: "antalya", slug: "delphin-imperial-antalya" },
  { citySlug: "antalya", slug: "club-hotel-sera-antalya" },
  { citySlug: "antalya", slug: "hillside-su-antalya" },
  { citySlug: "antalya", slug: "voyage-belek-antalya" },
  { citySlug: "antalya", slug: "tui-blue-palm-garden-antalya" },
  // Izmir
  { citySlug: "izmir", slug: "swissotel-buyuk-efes-izmir" },
  { citySlug: "izmir", slug: "alacati-la-vela-izmir" },
  // Bodrum
  { citySlug: "bodrum", slug: "mandarin-oriental-bodrum" },
  { citySlug: "bodrum", slug: "the-bodrum-edition" },
  { citySlug: "bodrum", slug: "kempinski-barbaros-bay-bodrum" },
  // Berlin
  { citySlug: "berlin", slug: "hotel-adlon-kempinski-berlin" },
  { citySlug: "berlin", slug: "soho-house-berlin" },
  { citySlug: "berlin", slug: "the-circus-hotel-berlin" },
  { citySlug: "berlin", slug: "hotel-zoo-berlin" },
  { citySlug: "berlin", slug: "the-ritz-carlton-berlin" },
  { citySlug: "berlin", slug: "michelberger-hotel-berlin" },
  // Lizbon
  { citySlug: "lizbon", slug: "santiago-de-alfama-lisbon" },
  { citySlug: "lizbon", slug: "martinhal-lisbon-chiado" },
  { citySlug: "lizbon", slug: "lx-boutique-hotel-lisbon" },
  { citySlug: "lizbon", slug: "pestana-palace-lisbon" },
  { citySlug: "lizbon", slug: "memmo-alfama-lisbon" },
  // Barcelona
  { citySlug: "barcelona", slug: "hotel-arts-barcelona" },
  { citySlug: "barcelona", slug: "hotel-casa-camper-barcelona" },
  { citySlug: "barcelona", slug: "w-hotel-barcelona" },
  { citySlug: "barcelona", slug: "hotel-1898-barcelona" },
  { citySlug: "barcelona", slug: "generator-barcelona" },
  // Amsterdam
  { citySlug: "amsterdam", slug: "the-hoxton-amsterdam" },
  { citySlug: "amsterdam", slug: "pulitzer-amsterdam" },
  { citySlug: "amsterdam", slug: "citizen-m-amsterdam-south" },
  { citySlug: "amsterdam", slug: "hotel-v-nesplein-amsterdam" },
  // Paris
  { citySlug: "paris", slug: "hotel-le-marais-paris" },
  { citySlug: "paris", slug: "hotel-plaza-athenee-paris" },
  { citySlug: "paris", slug: "hotel-le-cinq-codet-paris" },
  { citySlug: "paris", slug: "generator-paris" },
  // Prag
  { citySlug: "prag", slug: "aria-hotel-prague" },
  { citySlug: "prag", slug: "hotel-josef-prague" },
  // Viyana
  { citySlug: "viyana", slug: "hotel-sacher-wien" },
  { citySlug: "viyana", slug: "25hours-hotel-vienna" },
  // Budapeşte
  { citySlug: "budapeste", slug: "four-seasons-gresham-palace-budapest" },
  { citySlug: "budapeste", slug: "brody-house-budapest" },
  // Roma
  { citySlug: "roma", slug: "hotel-de-russie-rome" },
  { citySlug: "roma", slug: "the-hoxton-rome" },
  // Milano
  { citySlug: "milano", slug: "armani-hotel-milano" },
  // Dubai (base + expanded)
  { citySlug: "dubai", slug: "burj-al-arab-dubai" },
  { citySlug: "dubai", slug: "atlantis-the-palm-dubai" },
  { citySlug: "dubai", slug: "one-only-the-palm-dubai" },
  { citySlug: "dubai", slug: "jumeirah-al-qasr-dubai" },
  { citySlug: "dubai", slug: "address-downtown-dubai" },
  { citySlug: "dubai", slug: "armani-hotel-dubai" },
  { citySlug: "dubai", slug: "four-seasons-dubai-jumeirah" },
  { citySlug: "dubai", slug: "raffles-dubai" },
  { citySlug: "dubai", slug: "waldorf-astoria-palm-jumeirah-dubai" },
  { citySlug: "dubai", slug: "ritz-carlton-dubai" },
  { citySlug: "dubai", slug: "palace-downtown-dubai" },
  // Tokyo (base + expanded)
  { citySlug: "tokyo", slug: "park-hyatt-tokyo" },
  { citySlug: "tokyo", slug: "aman-tokyo" },
  { citySlug: "tokyo", slug: "mandarin-oriental-tokyo" },
  { citySlug: "tokyo", slug: "andaz-tokyo-toranomon-hills" },
  { citySlug: "tokyo", slug: "the-peninsula-tokyo" },
  { citySlug: "tokyo", slug: "hoshinoya-tokyo" },
  { citySlug: "tokyo", slug: "the-ritz-carlton-tokyo" },
  { citySlug: "tokyo", slug: "conrad-tokyo" },
  { citySlug: "tokyo", slug: "granbell-hotel-shinjuku-tokyo" },
  { citySlug: "tokyo", slug: "the-prince-gallery-tokyo" },
  { citySlug: "tokyo", slug: "trunk-hotel-tokyo" },
  // Bali (base + expanded)
  { citySlug: "bali", slug: "four-seasons-bali-sayan" },
  { citySlug: "bali", slug: "como-shambhala-estate-bali" },
  { citySlug: "bali", slug: "bulgari-resort-bali" },
  { citySlug: "bali", slug: "mandapa-ritz-carlton-bali" },
  { citySlug: "bali", slug: "st-regis-bali" },
  { citySlug: "bali", slug: "ayana-resort-bali" },
  { citySlug: "bali", slug: "mulia-resort-bali" },
  { citySlug: "bali", slug: "alila-ubud-bali" },
  { citySlug: "bali", slug: "capella-ubud-bali" },
  { citySlug: "bali", slug: "w-bali-seminyak" },
  { citySlug: "bali", slug: "hanging-gardens-bali" },
];

// Flight routes
const flightRoutes = [
  "istanbul-paris", "istanbul-londra", "istanbul-barcelona", "istanbul-amsterdam",
  "istanbul-roma", "istanbul-berlin", "istanbul-viyana", "istanbul-prag",
  "istanbul-dubai", "istanbul-tokyo", "istanbul-bali", "istanbul-bangkok",
  "ankara-istanbul", "ankara-londra", "ankara-paris", "ankara-berlin",
  "izmir-istanbul", "izmir-londra", "izmir-paris", "izmir-amsterdam",
  "antalya-istanbul", "antalya-moskova", "antalya-berlin", "antalya-londra"
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all published blog posts
    const { data: blogPosts, error } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("published", true)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching blog posts:", error);
    }

    const baseUrl = "https://woonomad.co";
    const today = new Date().toISOString().split("T")[0];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    // Helper to add multilingual URL entry
    const addMultilingualUrl = (
      pathGenerator: (lang: Language) => string, 
      priority: string, 
      changefreq: string,
      lastmod: string = today
    ) => {
      const allPaths: Record<Language, string> = {} as Record<Language, string>;
      languages.forEach(lang => {
        allPaths[lang] = pathGenerator(lang);
      });

      languages.forEach(lang => {
        const path = allPaths[lang];
        sitemap += `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${generateXhtmlLinks(baseUrl, path, allPaths)}
  </url>
`;
      });
    };

    // Homepage
    addMultilingualUrl(
      (lang) => getLangPrefix(lang) + '/',
      '1.0', 'daily'
    );

    // Cities Index
    addMultilingualUrl(
      (lang) => getLangPrefix(lang) + '/' + routeTranslations[lang].cities,
      '0.9', 'weekly'
    );

    // Blog Index
    addMultilingualUrl(
      (lang) => getLangPrefix(lang) + '/' + routeTranslations[lang].blog,
      '0.9', 'daily'
    );

    // Flights Index
    addMultilingualUrl(
      (lang) => getLangPrefix(lang) + '/' + routeTranslations[lang].flights,
      '0.8', 'weekly'
    );

    // Nomad Hub
    addMultilingualUrl(
      (lang) => getLangPrefix(lang) + '/' + routeTranslations[lang]['nomad-hub'],
      '0.8', 'weekly'
    );

    // Hotels Index
    addMultilingualUrl(
      (lang) => getLangPrefix(lang) + '/' + routeTranslations[lang].hotels,
      '0.8', 'weekly'
    );

    // Legal Pages
    addMultilingualUrl(
      (lang) => getLangPrefix(lang) + '/' + routeTranslations[lang]['privacy-policy'],
      '0.3', 'monthly'
    );
    addMultilingualUrl(
      (lang) => getLangPrefix(lang) + '/' + routeTranslations[lang]['terms-of-service'],
      '0.3', 'monthly'
    );
    addMultilingualUrl(
      (lang) => getLangPrefix(lang) + '/' + routeTranslations[lang].kvkk,
      '0.3', 'monthly'
    );
    addMultilingualUrl(
      (lang) => getLangPrefix(lang) + '/' + routeTranslations[lang]['cookie-policy'],
      '0.3', 'monthly'
    );

    // City pages with sub-routes
    for (const city of cities) {
      // City hub
      addMultilingualUrl(
        (lang) => getLangPrefix(lang) + '/' + routeTranslations[lang].city + '/' + city,
        '0.8', 'weekly'
      );
      
      // City hotels
      addMultilingualUrl(
        (lang) => getLangPrefix(lang) + '/' + routeTranslations[lang].city + '/' + city + '/' + routeTranslations[lang].hotels,
        '0.7', 'daily'
      );
      
      // City flights
      addMultilingualUrl(
        (lang) => getLangPrefix(lang) + '/' + routeTranslations[lang].city + '/' + city + '/' + routeTranslations[lang].flights,
        '0.7', 'daily'
      );
      
      // City nomad
      addMultilingualUrl(
        (lang) => getLangPrefix(lang) + '/' + routeTranslations[lang].city + '/' + city + '/' + routeTranslations[lang].nomad,
        '0.6', 'weekly'
      );
      
      // City coworking
      addMultilingualUrl(
        (lang) => getLangPrefix(lang) + '/' + routeTranslations[lang].city + '/' + city + '/' + routeTranslations[lang].coworking,
        '0.6', 'weekly'
      );
    }

    // Hotel detail pages
    for (const hotel of hotelData) {
      addMultilingualUrl(
        (lang) => getLangPrefix(lang) + '/' + routeTranslations[lang].city + '/' + hotel.citySlug + '/' + routeTranslations[lang].hotel + '/' + hotel.slug,
        '0.6', 'weekly'
      );
    }

    // Flight routes
    for (const route of flightRoutes) {
      addMultilingualUrl(
        (lang) => getLangPrefix(lang) + '/' + routeTranslations[lang].flight + '/' + route,
        '0.7', 'daily'
      );
    }

    // Blog posts (same slug across languages for now)
    if (blogPosts && blogPosts.length > 0) {
      for (const post of blogPosts) {
        const lastMod = post.updated_at 
          ? new Date(post.updated_at).toISOString().split("T")[0]
          : today;
        addMultilingualUrl(
          (lang) => getLangPrefix(lang) + '/' + routeTranslations[lang].blog + '/' + post.slug,
          '0.6', 'monthly', lastMod
        );
      }
    }

    // Close sitemap
    sitemap += `</urlset>`;

    const urlsPerLang = 10 + cities.length * 5 + hotelData.length + flightRoutes.length + (blogPosts?.length || 0);
    const totalUrls = urlsPerLang * languages.length;
    console.log(`Multilingual sitemap generated with ${totalUrls} URLs across ${languages.length} languages`);

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml",
      },
    });

  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
