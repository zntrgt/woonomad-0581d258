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

// Static hotel data
const hotelData = [
  { citySlug: "istanbul", slug: "four-seasons-sultanahmet" },
  { citySlug: "istanbul", slug: "ciragan-palace-kempinski" },
  { citySlug: "istanbul", slug: "raffles-istanbul" },
  { citySlug: "istanbul", slug: "the-ritz-carlton-istanbul" },
  { citySlug: "antalya", slug: "regnum-carya" },
  { citySlug: "antalya", slug: "titanic-mardan-palace" },
  { citySlug: "antalya", slug: "maxx-royal-belek" },
  { citySlug: "izmir", slug: "swissotel-buyuk-efes" },
  { citySlug: "izmir", slug: "movenpick-hotel-izmir" },
  { citySlug: "bodrum", slug: "mandarin-oriental-bodrum" },
  { citySlug: "bodrum", slug: "the-bodrum-edition" },
  { citySlug: "berlin", slug: "hotel-adlon-kempinski" },
  { citySlug: "berlin", slug: "the-ritz-carlton-berlin" },
  { citySlug: "lizbon", slug: "four-seasons-ritz-lisbon" },
  { citySlug: "lizbon", slug: "pestana-palace-lisboa" },
  { citySlug: "barcelona", slug: "hotel-arts-barcelona" },
  { citySlug: "barcelona", slug: "w-barcelona" },
  { citySlug: "amsterdam", slug: "waldorf-astoria-amsterdam" },
  { citySlug: "amsterdam", slug: "conservatorium-hotel" },
  { citySlug: "paris", slug: "le-bristol-paris" },
  { citySlug: "paris", slug: "four-seasons-george-v" },
  { citySlug: "prag", slug: "four-seasons-prague" },
  { citySlug: "prag", slug: "mandarin-oriental-prague" },
  { citySlug: "viyana", slug: "hotel-sacher-wien" },
  { citySlug: "viyana", slug: "park-hyatt-vienna" },
  { citySlug: "budapeste", slug: "four-seasons-gresham-palace" },
  { citySlug: "budapeste", slug: "aria-hotel-budapest" },
  { citySlug: "roma", slug: "hotel-hassler-roma" },
  { citySlug: "roma", slug: "hotel-de-russie" },
  { citySlug: "milano", slug: "armani-hotel-milano" },
  { citySlug: "milano", slug: "park-hyatt-milan" },
  { citySlug: "dubai", slug: "burj-al-arab" },
  { citySlug: "dubai", slug: "atlantis-the-palm" },
  { citySlug: "tokyo", slug: "aman-tokyo" },
  { citySlug: "tokyo", slug: "park-hyatt-tokyo" },
  { citySlug: "bali", slug: "como-shambhala" },
  { citySlug: "bali", slug: "four-seasons-jimbaran" },
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
