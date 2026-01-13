import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateRequest {
  type: 'full' | 'paragraph' | 'improve';
  topic?: string;
  title?: string;
  existingContent?: string;
  language?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, topic, title, existingContent, language = 'tr' } = await req.json() as GenerateRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'full') {
      systemPrompt = `Sen profesyonel bir seyahat blog yazarısın. Dijital göçebeler, festivaller, kültür ve seyahat konularında uzmanlaşmış bir içerik üreticisisin.

Blog yazısı formatı:
- Minimum 250 kelime (tercihen 400-600 kelime)
- 3 ana bölüm: Giriş, Gelişme, Sonuç
- SEO dostu başlıklar (H2, H3)
- Markdown formatında yaz
- Pratik ipuçları ekle
- İlgi çekici ve bilgilendirici ol

Dil: ${language === 'tr' ? 'Türkçe' : 'English'}`;

      userPrompt = `"${topic || title}" konusunda kapsamlı bir blog yazısı oluştur.

Yapı:
## Giriş
(Konuyu tanıt, okuyucunun ilgisini çek)

## [Ana Konu Başlığı]
(Detaylı bilgi, ipuçları, liste formatında öneriler)

## [İkinci Alt Başlık]
(Ek detaylar, pratik bilgiler)

## Sonuç
(Özet ve çağrı)`;

    } else if (type === 'paragraph') {
      systemPrompt = `Sen seyahat blogu için paragraf üreten bir asistansın. Akıcı, bilgilendirici ve SEO dostu paragraflar yazıyorsun.`;
      
      userPrompt = `"${topic}" hakkında 2-3 cümlelik akıcı bir paragraf yaz. Mevcut içerikle uyumlu olsun.
      
${existingContent ? `Mevcut içerik:\n${existingContent.slice(-500)}` : ''}`;

    } else if (type === 'improve') {
      systemPrompt = `Sen bir editörsün. Verilen içeriği iyileştir - daha akıcı, daha bilgilendirici ve SEO dostu hale getir. Minimum 250 kelime olsun.`;
      
      userPrompt = `Bu içeriği iyileştir ve genişlet:\n\n${existingContent}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Generate blog content error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
