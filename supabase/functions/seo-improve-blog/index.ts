import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Use flash for text generation, image generation model for images
const TEXT_MODEL = "gemini-2.5-flash-preview-05-20";
const IMAGE_MODEL = "gemini-2.0-flash-preview-image-generation";

interface SEOImproveRequest {
  postId: string;
  title: string;
  slug: string;
  content: string;
  category?: string;
  city?: string;
  heroImageUrl?: string;
  generateImages?: boolean;
}

interface ImageSuggestion {
  position: string;
  prompt: string;
  altText: string;
  caption?: string;
  purpose: string;
}

interface SEOImproveResponse {
  title: string;
  metaDescription: string;
  content: string;
  toc: Array<{ id: string; text: string; level: number }>;
  tables: Array<{ title: string; markdown: string }>;
  checklists: Array<{ title: string; items: string[] }>;
  faqs: Array<{ q: string; a: string }>;
  internalLinkSuggestions: Array<{ anchor: string; href: string; reason: string }>;
  schemaJsonLd: object;
  changeSummary: string[];
  llmOptimizations: {
    entityMarkup: Array<{ entity: string; type: string; description: string }>;
    semanticSections: Array<{ id: string; purpose: string; keyTopics: string[] }>;
    conversationalQueries: string[];
    featuredSnippetTargets: Array<{ query: string; answer: string }>;
    speakableContent: string[];
  };
  imageSuggestions: ImageSuggestion[];
  generatedImages?: Array<{ position: string; imageUrl: string; altText: string; caption?: string }>;
}

const SYSTEM_PROMPT = `Sen bir SEO, içerik iyileştirme ve LLM görünürlük (AI search optimization) uzmanısın. Blog yazılarını hem geleneksel SEO hem de AI asistanları (ChatGPT, Perplexity, Gemini, Copilot) için optimize ediyorsun.

KURALLAR (KESİNLİKLE UYULMALI):
1. Kullanıcıya hiçbir şey sorma.
2. Dış kaynaktan uydurma veri ekleme (istatistik, fiyat, oran, "2026'da şunlar oldu" gibi iddialar yok). Emin olmadığın şeyleri "genel eğilim" diye çerçevele ama sayı verme.
3. İçeriğin ana anlamını bozma; sadeleştir, güçlendir, yapılandır.
4. Dil: mevcut içerik hangi dildeyse o dilde devam et.
5. Çıktı SADECE JSON formatında olsun, başka açıklama yazma.

=== GELENEKSEL SEO HEDEFLERİ ===

1) Title & Meta:
- Title 55-60 karakter hedef; ana keyword başa yakın
- Meta description 150-160 karakter; net vaat; clickworthy ama abartısız

2) Yapı:
- Tek H1
- İlk 120 kelimede: konu + kim için + kazanım
- TOC (İçindekiler): H2/H3'lerden üret
- H2/H3'leri optimize et: eksik alt başlık varsa ekle

3) TABLO / CHECKLIST / FAQ zorunluluğu (eksikse ekle, varsa iyileştir):
- Tablo: Eğer yazıda hiç tablo yoksa en az 1 tablo ekle. Markdown tablo formatında döndür.
- Checklist: Eğer yazıda checklist yoksa en az 1 checklist ekle (7-15 madde). Kısa, eylem fiiliyle başlayan maddeler.
- FAQ: Eğer yazıda FAQ bölümü yoksa 6-10 adet FAQ ekle. Somut, kısa, "arama niyeti" odaklı olsun.

4) E-E-A-T:
- İçeriğe "Son güncelleme: {bugünün tarihi}" satırı ekle
- Kaynak gerekiyorsa "Kaynak notu" bloğu ekle ama link uydurma

5) Internal linking:
- Sadece site içinde mantıklı sayfalara öneri üret:
  - /sehir/{city}, /sehir/{city}/coworking, /sehir/{city}/nomad, /sehir/{city}/oteller, /ucus/{from}-{to}
- İçerikte geçen şehir/rota yoksa uydurma link üretme.

6) Schema JSON-LD:
- BlogPosting + BreadcrumbList
- FAQ varsa FAQPage
- JSON-LD geçerli JSON olmalı

=== LLM GÖRÜNÜRlÜK OPTİMİZASYONLARI (AI SEARCH) ===

7) Entity Markup, 8) Semantic Sections, 9) Conversational Queries, 10) Featured Snippet Targets, 11) Speakable Content

=== GÖRSEL ÖNERİLERİ ===

12) Image Suggestions: 2-4 görsel önerisi, her biri için position, prompt (İngilizce), altText, caption, purpose

ÇIKTI FORMATI (SADECE BU JSON):
{
  "title": "...",
  "metaDescription": "...",
  "content": "...",
  "toc": [{"id":"...", "text":"...", "level":2}],
  "tables": [{"title":"...", "markdown":"..."}],
  "checklists": [{"title":"...", "items":["...","..."]}],
  "faqs": [{"q":"...","a":"..."}],
  "internalLinkSuggestions": [{"anchor":"...","href":"...","reason":"..."}],
  "schemaJsonLd": {},
  "changeSummary": ["...","..."],
  "llmOptimizations": {
    "entityMarkup": [{"entity":"...", "type":"...", "description":"..."}],
    "semanticSections": [{"id":"...", "purpose":"...", "keyTopics":["..."]}],
    "conversationalQueries": ["..."],
    "featuredSnippetTargets": [{"query":"...", "answer":"..."}],
    "speakableContent": ["..."]
  },
  "imageSuggestions": [
    {
      "position": "after:section-id",
      "prompt": "...",
      "altText": "...",
      "caption": "...",
      "purpose": "illustration"
    }
  ]
}`;

async function callGeminiText(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  maxOutputTokens = 12000
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { maxOutputTokens, temperature: 0.7 },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 429) throw new Error("RATE_LIMIT");
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!text) throw new Error("Empty response from Gemini");
  return text;
}

async function generateAndUploadImage(
  apiKey: string,
  supabase: ReturnType<typeof createClient>,
  prompt: string,
  slug: string
): Promise<{ imageUrl: string; success: boolean }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent`;

  const imageResponse = await fetch(url, {
    method: "POST",
    headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [{
          text: `Generate a professional blog image: ${prompt}. Style: Modern, clean, suitable for a travel/digital nomad blog. Dimensions: 16:9 aspect ratio, high quality.`,
        }],
      }],
      generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
    }),
  });

  if (!imageResponse.ok) return { imageUrl: "", success: false };

  const imageData = await imageResponse.json();
  const parts = imageData.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData);

  if (!imagePart?.inlineData?.data) return { imageUrl: "", success: false };

  const base64Data = imagePart.inlineData.data;
  const mimeType = imagePart.inlineData.mimeType ?? "image/png";
  const ext = mimeType.split("/")[1] ?? "png";
  const imageBuffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

  const fileName = `seo-${slug}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
  const filePath = `generated/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("blog-images")
    .upload(filePath, imageBuffer, { contentType: mimeType, cacheControl: "31536000" });

  if (uploadError) return { imageUrl: "", success: false };

  const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(filePath);
  return { imageUrl: urlData.publicUrl, success: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: authError } = await supabase.auth.getClaims(token);

    if (authError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;

    const { data: roleData, error: roleError } = await supabase
      .rpc("has_role", { _user_id: userId, _role: "admin" });

    if (roleError || !roleData) {
      return new Response(
        JSON.stringify({ error: "Forbidden - Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: SEOImproveRequest = await req.json();
    const { title, slug, content, category, city, heroImageUrl, generateImages = false } = body;

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: "Title and content are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For image uploads we need service role
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

    const today = new Date().toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const userPrompt = `Aşağıdaki blog yazısını SEO ve LLM görünürlüğü açısından iyileştir.

MEVCUT İÇERİK:
Başlık: ${title}
Slug: ${slug}
Kategori: ${category || "Belirtilmemiş"}
Şehir: ${city || "Belirtilmemiş"}
Görsel: ${heroImageUrl ? "Var" : "Yok"}

İçerik:
${content}

---
Bugünün tarihi: ${today}

ÖNEMLİ NOTLAR:
1. İçeriği hem Google SEO hem de AI asistanlar (ChatGPT, Perplexity, Gemini) için optimize et
2. Conversational queries bölümünde gerçek kullanıcıların sorabileceği doğal sorular yaz
3. Featured snippet targets bölümünde kısa, direkt cevaplar ver
4. Entity markup ile içerikteki önemli kavramları işaretle
5. Görsel önerileri için detaylı, AI image generation'a uygun promptlar yaz

Lütfen yukarıdaki kurallara göre iyileştirilmiş versiyonu JSON formatında döndür.`;

    console.log(`Admin ${userId} improving SEO+LLM for post: ${slug}`);

    const aiContent = await callGeminiText(GEMINI_API_KEY, SYSTEM_PROMPT, userPrompt);

    let result: SEOImproveResponse;
    try {
      let jsonStr = aiContent;
      const jsonMatch = aiContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) jsonStr = jsonMatch[1].trim();
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response", rawContent: aiContent }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate images if requested
    if (generateImages && result.imageSuggestions?.length > 0) {
      console.log(`Generating ${result.imageSuggestions.length} images for post: ${slug}`);
      const generatedImages: SEOImproveResponse["generatedImages"] = [];

      for (const suggestion of result.imageSuggestions.slice(0, 3)) {
        try {
          const { imageUrl, success } = await generateAndUploadImage(
            GEMINI_API_KEY,
            supabaseService,
            suggestion.prompt,
            slug
          );
          if (success) {
            generatedImages.push({
              position: suggestion.position,
              imageUrl,
              altText: suggestion.altText,
              caption: suggestion.caption,
            });
          }
        } catch (imgError) {
          console.error("Image generation error:", imgError);
        }
      }

      result.generatedImages = generatedImages;
    }

    console.log("SEO+LLM improvement successful");

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("SEO improve error:", error);

    if (error instanceof Error && error.message === "RATE_LIMIT") {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
