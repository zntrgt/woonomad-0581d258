import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callAI, MODELS } from "../_shared/openrouter.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const IMAGE_MODEL = "gemini-2.0-flash-preview-image-generation";
// Note: Image generation stays on Gemini direct API (OpenRouter doesn't support image gen)
// Text generation (alt text) uses OpenRouter via callAI

interface GenerateImageRequest {
  prompt: string;
  context?: string;
  slug?: string;
  generateAltText?: boolean;
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
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: authError } = await supabaseAuth.auth.getClaims(token);

    if (authError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;

    const { data: roleData, error: roleError } = await supabaseAuth
      .rpc("has_role", { _user_id: userId, _role: "admin" });

    if (roleError || !roleData) {
      return new Response(
        JSON.stringify({ error: "Forbidden - Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: GenerateImageRequest = await req.json();
    const { prompt, context, slug, generateAltText = true } = body;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
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

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const enhancedPrompt = `Professional travel photography style, high quality, 16:9 aspect ratio, vibrant colors, natural lighting: ${prompt}. ${context ? `Context: ${context}` : ""}. Ultra high resolution.`;

    console.log(`Admin ${userId} generating image: ${enhancedPrompt.substring(0, 100)}...`);

    // Generate image using Gemini image generation model
    const imageUrl = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent`;
    const imageResponse = await fetch(imageUrl, {
      method: "POST",
      headers: { "x-goog-api-key": GEMINI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: enhancedPrompt }] }],
        generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
      }),
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error("Image generation error:", imageResponse.status, errorText);

      if (imageResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "Image generation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const imageData = await imageResponse.json();
    const parts = imageData.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData);

    if (!imagePart?.inlineData?.data) {
      console.error("No image in response:", JSON.stringify(imageData).substring(0, 500));
      return new Response(
        JSON.stringify({ error: "No image generated" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // inlineData.data is already raw base64 (no data URL prefix)
    const base64Data = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType ?? "image/png";
    const ext = mimeType.split("/")[1] ?? "png";
    const imageBuffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    const fileName = `ai-generated/${slug || Date.now()}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(fileName, imageBuffer, { contentType: mimeType, upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(
        JSON.stringify({ error: "Failed to upload image: " + uploadError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;

    // Generate SEO alt text if requested
    let altText = "";
    if (generateAltText) {
      try {
        const altResult = await callAI({
          prompt: `Generate SEO-friendly alt text for this image. Image prompt: "${prompt}". Context: ${context || "travel blog image"}`,
          systemPrompt: `You are an SEO and accessibility expert. Generate a concise, descriptive alt text.\nRULES:\n- Max 125 characters\n- Include relevant keywords naturally\n- Be specific and descriptive\n- Don't start with "Image of" or "Picture of"\n- Output ONLY the alt text, nothing else`,
          model: MODELS.GEMINI_FLASH,
          maxTokens: 150,
          temperature: 0.3,
        });
        altText = altResult.ok ? altResult.text : "";
        altText = altText.replace(/^["']|["']$/g, "").trim();
      } catch (altError) {
        console.error("Alt text generation error:", altError);
      }
    }

    console.log("Image generated and uploaded:", publicUrl);

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: publicUrl,
        altText: altText || `${prompt.substring(0, 100)}...`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Generate blog image error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
