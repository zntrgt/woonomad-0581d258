import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callAI, MODELS } from "../_shared/openrouter.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};


interface GenerateAltTextRequest {
  imageUrl: string;
  context?: string;
}

interface BatchGenerateAltTextRequest {
  images: Array<{ imageUrl: string; context?: string }>;
  blogContext?: string;
}

async function generateAltTextForImage(
  apiKey: string,
  imageUrl: string,
  context?: string
): Promise<string> {
  // Fetch image and convert to base64 for Gemini vision
  const imgResponse = await fetch(imageUrl);
  if (!imgResponse.ok) throw new Error(`Could not fetch image: ${imgResponse.status}`);
  const imgBuffer = await imgResponse.arrayBuffer();
  const base64Data = btoa(String.fromCharCode(...new Uint8Array(imgBuffer)));
  const mimeType = imgResponse.headers.get("content-type") ?? "image/jpeg";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{
          text: `You are an SEO and accessibility expert. Analyze the image and generate a concise, descriptive alt text.
RULES:
- Max 125 characters
- Include relevant keywords naturally
- Be specific and descriptive about what's IN the image
- Don't start with "Image of" or "Picture of"
- Focus on the main subject and key details
- Consider the context if provided
- Output ONLY the alt text, nothing else`,
        }],
      },
      contents: [{
        role: "user",
        parts: [
          {
            text: `Generate SEO-friendly alt text for this image.${context ? ` Context: ${context}` : ""}`,
          },
          {
            inlineData: { mimeType, data: base64Data },
          },
        ],
      }],
      generationConfig: { maxOutputTokens: 150 },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 429) throw new Error("RATE_LIMIT");
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const altText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
  return altText.replace(/^["']|["']$/g, "").trim();
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

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();

    // Batch request
    if (body.images && Array.isArray(body.images)) {
      const batchRequest: BatchGenerateAltTextRequest = body;
      const results: Array<{ imageUrl: string; altText: string; success: boolean }> = [];

      for (const image of batchRequest.images) {
        try {
          const altText = await generateAltTextForImage(
            GEMINI_API_KEY,
            image.imageUrl,
            image.context || batchRequest.blogContext
          );
          results.push({ imageUrl: image.imageUrl, altText, success: true });
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Alt text generation failed for ${image.imageUrl}:`, error);
          results.push({ imageUrl: image.imageUrl, altText: "", success: false });
        }
      }

      return new Response(
        JSON.stringify({ success: true, results }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Single image request
    const singleRequest: GenerateAltTextRequest = body;

    if (!singleRequest.imageUrl) {
      return new Response(
        JSON.stringify({ error: "imageUrl is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const altText = await generateAltTextForImage(
      GEMINI_API_KEY,
      singleRequest.imageUrl,
      singleRequest.context
    );

    return new Response(
      JSON.stringify({ success: true, altText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Generate alt text error:", error);

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
