import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
  position: string; // "after:heading-id" or "section:intro"
  prompt: string;
  altText: string;
  caption?: string;
  purpose: string; // "illustration" | "infographic" | "comparison" | "hero"
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
  // New LLM visibility fields
  llmOptimizations: {
    entityMarkup: Array<{ entity: string; type: string; description: string }>;
    semanticSections: Array<{ id: string; purpose: string; keyTopics: string[] }>;
    conversationalQueries: string[];
    featuredSnippetTargets: Array<{ query: string; answer: string }>;
    speakableContent: string[];
  };
  imageSuggestions: ImageSuggestion[];
  generatedImages?: Array<{
    position: string;
    imageUrl: string;
    altText: string;
    caption?: string;
  }>;
}

const SYSTEM_PROMPT = `Sen bir SEO, içerik iyileştirme ve LLM görünürlük (AI search optimization) uzmanısın. Blog yazılarını hem geleneksel SEO hem de AI asistanları (ChatGPT, Perplexity, Gemini, Copilot) için optimize ediyorsun.

KURALLAR (KESİNLİKLE UYULMALI):
1. Kullanıcıya hiçbir şey sorma.
2. Dış kaynaktan uydurma veri ekleme (istatistik, fiyat, oran, "2026'da şunlar oldu" gibi iddialar yok). Emin olmadığın şeyleri "genel eğilim" diye çerçevele ama sayı verme.
3. İçeriğin ana anlamını bozma; sadeleştir, güçlendir, yapılandır.
4. Dil: mevcut içerik hangi dildense o dilde devam et.
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

7) Entity Markup:
- İçerikteki önemli varlıkları (kişi, yer, organizasyon, kavram, ürün) tespit et
- Her entity için: isim, tür, kısa açıklama

8) Semantic Sections:
- Her bölümün amacını belirle (tanım, karşılaştırma, nasıl yapılır, öneri listesi, vb.)
- Her bölümün anahtar konularını listele (LLM'lerin bağlam anlaması için)

9) Conversational Queries:
- İçeriğin cevaplayabileceği doğal dil sorularını üret (8-12 adet)
- Bunlar AI asistanlarının bu içeriği kaynak olarak kullanmasını sağlar
- Örnek: "Dijital göçebe için en iyi şehir hangisi?", "Tiflis'te coworking maliyeti ne kadar?"

10) Featured Snippet Targets:
- Google featured snippet ve AI arama sonuçları için optimize edilmiş soru-cevap çiftleri
- Kısa, öz, direkt cevaplar (50-80 kelime)

11) Speakable Content:
- Sesli asistanlar ve TTS için uygun paragrafları belirle
- Kısa, akıcı, kolay anlaşılır cümleler

=== GÖRSEL ÖNERİLERİ ===

12) Image Suggestions:
- İçeriğin akışına göre 2-4 görsel önerisi üret
- Her öneri için:
  - position: görselin nereye ekleneceği (örn: "after:dijital-gocebe-nedir", "section:maliyet-karsilastirma")
  - prompt: AI görsel oluşturmak için detaylı prompt (İngilizce, 50-100 kelime)
  - altText: SEO için alt text (içerik dilinde)
  - caption: varsa başlık (içerik dilinde)
  - purpose: "illustration" | "infographic" | "comparison" | "hero" | "mood"
- Promptlar şunları içermeli:
  - Görsel tarzı (flat illustration, realistic photo, isometric, watercolor, vb.)
  - Ana öğeler ve kompozisyon
  - Renk paleti veya atmosfer
  - "High quality, professional, suitable for travel blog" ekle

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
  "schemaJsonLd": {...},
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: authError } = await supabase.auth.getClaims(token);
    
    if (authError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;

    // Verify admin role
    const { data: roleData, error: roleError } = await supabase
      .rpc('has_role', { _user_id: userId, _role: 'admin' });

    if (roleError || !roleData) {
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const today = new Date().toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const userPrompt = `Aşağıdaki blog yazısını SEO ve LLM görünürlüğü açısından iyileştir.

MEVCUT İÇERİK:
Başlık: ${title}
Slug: ${slug}
Kategori: ${category || 'Belirtilmemiş'}
Şehir: ${city || 'Belirtilmemiş'}
Görsel: ${heroImageUrl ? 'Var' : 'Yok'}

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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 12000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (!aiContent) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "No response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON from AI response
    let result: SEOImproveResponse;
    try {
      // Try to extract JSON from the response (it might be wrapped in markdown code blocks)
      let jsonStr = aiContent;
      const jsonMatch = aiContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      }
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.log("Raw AI content:", aiContent);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response", rawContent: aiContent }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If generateImages is true, generate the suggested images
    if (generateImages && result.imageSuggestions && result.imageSuggestions.length > 0) {
      console.log(`Generating ${result.imageSuggestions.length} images for post: ${slug}`);
      
      const generatedImages: Array<{
        position: string;
        imageUrl: string;
        altText: string;
        caption?: string;
      }> = [];

      // Generate images one by one (to avoid rate limits)
      for (const suggestion of result.imageSuggestions.slice(0, 3)) { // Max 3 images
        try {
          const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image-preview",
              messages: [
                {
                  role: "user",
                  content: `Generate a professional blog image: ${suggestion.prompt}. Style: Modern, clean, suitable for a travel/digital nomad blog. Dimensions: 16:9 aspect ratio, high quality.`
                }
              ],
              modalities: ["image", "text"]
            }),
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            const imageBase64 = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

            if (imageBase64) {
              // Upload to Supabase storage
              const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
              const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
              
              const fileName = `seo-${slug}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;
              const filePath = `generated/${fileName}`;

              const { error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(filePath, imageBuffer, {
                  contentType: 'image/png',
                  cacheControl: '31536000'
                });

              if (!uploadError) {
                const { data: urlData } = supabase.storage
                  .from('blog-images')
                  .getPublicUrl(filePath);

                generatedImages.push({
                  position: suggestion.position,
                  imageUrl: urlData.publicUrl,
                  altText: suggestion.altText,
                  caption: suggestion.caption
                });
              }
            }
          }
        } catch (imgError) {
          console.error("Image generation error:", imgError);
          // Continue with other images
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
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
