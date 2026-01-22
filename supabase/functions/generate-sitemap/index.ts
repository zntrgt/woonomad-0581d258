import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Complete cities list matching cities.ts
const cities = [
  // Türkiye
  "istanbul", "antalya", "izmir", "bodrum", "kapadokya",
  // Germany
  "berlin", "munih", "frankfurt",
  // France
  "paris",
  // UK
  "londra",
  // Netherlands
  "amsterdam",
  // Spain
  "barcelona", "madrid",
  // Italy
  "roma", "milano", "venedik", "floransa",
  // Portugal
  "lizbon", "porto",
  // Greece
  "atina",
  // Central Europe
  "prag", "viyana", "budapeste",
  // Scandinavia
  "kopenhag", "stockholm",
  // Middle East & Caucasus
  "dubai", "amman", "tiflis", "baku",
  // Asia
  "tokyo", "bangkok", "singapur", "bali", "seul",
  // Americas
  "newyork",
  // Balkans
  "belgrad", "sarajevo",
  // Other
  "marakes", "zanzibar"
];

// Static hotel data for sitemap (from hotels.ts)
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

// Flight routes for sitemap
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Cities Index -->
  <url>
    <loc>${baseUrl}/sehirler</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Blog Index -->
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Flight Routes Index -->
  <url>
    <loc>${baseUrl}/ucuslar</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Nomad Hub -->
  <url>
    <loc>${baseUrl}/nomad-hub</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Hotels Index -->
  <url>
    <loc>${baseUrl}/oteller</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Legal Pages -->
  <url>
    <loc>${baseUrl}/gizlilik-politikasi</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/kullanim-kosullari</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/kvkk</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/cerez-politikasi</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
`;

    // Add city pages with all sub-routes
    for (const city of cities) {
      sitemap += `
  <!-- ${city} City Hub -->
  <url>
    <loc>${baseUrl}/sehir/${city}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/sehir/${city}/oteller</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/sehir/${city}/ucuslar</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/sehir/${city}/ucak-bileti</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/sehir/${city}/nomad</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/sehir/${city}/coworking</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }

    // Add hotel detail pages
    for (const hotel of hotelData) {
      sitemap += `
  <url>
    <loc>${baseUrl}/sehir/${hotel.citySlug}/otel/${hotel.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }

    // Add flight route pages
    for (const route of flightRoutes) {
      sitemap += `
  <url>
    <loc>${baseUrl}/ucus/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
    }

    // Add blog posts
    if (blogPosts && blogPosts.length > 0) {
      for (const post of blogPosts) {
        const lastMod = post.updated_at 
          ? new Date(post.updated_at).toISOString().split("T")[0]
          : today;
        sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      }
    }

    // Close sitemap
    sitemap += `
</urlset>`;

    const totalUrls = cities.length * 6 + hotelData.length + flightRoutes.length + (blogPosts?.length || 0) + 10;
    console.log(`Sitemap generated with ${totalUrls} URLs: ${cities.length} cities, ${hotelData.length} hotels, ${flightRoutes.length} routes, ${blogPosts?.length || 0} blog posts`);

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
