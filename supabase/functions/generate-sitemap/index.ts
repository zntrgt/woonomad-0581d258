import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Static cities list
const cities = [
  "berlin", "lisbon", "barcelona", "amsterdam", "paris", "london", "dublin", "prague",
  "budapest", "vienna", "milan", "rome", "madrid", "porto", "bangkok", "bali", "chiang-mai",
  "ho-chi-minh", "kuala-lumpur", "singapore", "tokyo", "seoul", "taipei", "istanbul",
  "antalya", "izmir", "tbilisi", "dubai", "tel-aviv", "cape-town", "medellin", "mexico-city",
  "buenos-aires", "playa-del-carmen", "tulum"
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

    const baseUrl = "https://woonomad.lovable.app";
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
`;

    // Add city pages
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
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/sehir/${city}/nomad</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/sehir/${city}/ucak-bileti</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
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

    console.log(`Sitemap generated with ${cities.length} cities and ${blogPosts?.length || 0} blog posts`);

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
