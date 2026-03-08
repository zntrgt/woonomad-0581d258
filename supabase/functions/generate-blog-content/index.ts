import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GEMINI_MODEL = "gemini-2.0-flash";

interface GenerateRequest {
  type: "full" | "paragraph" | "improve";
  topic?: string;
  title?: string;
  existingContent?: string;
  language?: string;
}

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  maxOutputTokens = 8192
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { maxOutputTokens },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 429) throw new Error("RATE_LIMIT");
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini");
  return text;
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

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { type, topic, title, existingContent, language = "tr" } = await req.json() as GenerateRequest;

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "full") {
      systemPrompt = `Sen profesyonel bir seyahat blog yazarısın. Dijital göçebeler, festivaller, kültür ve seyahat konularında uzmanlaşmış bir içerik üreticisisin.

Blog yazısı formatı:
- Minimum 250 kelime (tercihen 400-600 kelime)
- 3 ana bölüm: Giriş, Gelişme, Sonuç
- SEO dostu başlıklar (H2, H3)
- Markdown formatında yaz
- Pratik ipuçları ekle
- İlgi çekici ve bilgilendirici ol

Dil: ${language === "tr" ? "Türkçe" : "English"}`;

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
    } else if (type === "paragraph") {
      systemPrompt = `Sen seyahat blogu için paragraf üreten bir asistansın. Akıcı, bilgilendirici ve SEO dostu paragraflar yazıyorsun.`;
      userPrompt = `"${topic}" hakkında 2-3 cümlelik akıcı bir paragraf yaz. Mevcut içerikle uyumlu olsun.
      
${existingContent ? `Mevcut içerik:\n${existingContent.slice(-500)}` : ""}`;
    } else if (type === "improve") {
      systemPrompt = `Sen bir editörsün. Verilen içeriği iyileştir - daha akıcı, daha bilgilendirici ve SEO dostu hale getir. Minimum 250 kelime olsun.`;
      userPrompt = `Bu içeriği iyileştir ve genişlet:\n\n${existingContent}`;
    }

    console.log(`Admin ${userId} generating blog content: ${type}`);

    const content = await callGemini(GEMINI_API_KEY, systemPrompt, userPrompt);

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Generate blog content error:", error);

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
