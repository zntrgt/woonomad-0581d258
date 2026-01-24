import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateAltTextRequest {
  imageUrl: string;
  context?: string;
}

interface BatchGenerateAltTextRequest {
  images: Array<{
    imageUrl: string;
    context?: string;
  }>;
  blogContext?: string;
}

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
    
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: authError } = await supabaseAuth.auth.getClaims(token);
    
    if (authError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;

    // Verify admin role
    const { data: roleData, error: roleError } = await supabaseAuth
      .rpc('has_role', { _user_id: userId, _role: 'admin' });

    if (roleError || !roleData) {
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    const body = await req.json();

    // Check if it's a batch request
    if (body.images && Array.isArray(body.images)) {
      const batchRequest: BatchGenerateAltTextRequest = body;
      const results: Array<{ imageUrl: string; altText: string; success: boolean }> = [];

      for (const image of batchRequest.images) {
        try {
          const altText = await generateAltTextForImage(
            LOVABLE_API_KEY,
            image.imageUrl,
            image.context || batchRequest.blogContext
          );
          results.push({ imageUrl: image.imageUrl, altText, success: true });
          
          // Small delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Alt text generation failed for ${image.imageUrl}:`, error);
          results.push({ imageUrl: image.imageUrl, altText: '', success: false });
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
      LOVABLE_API_KEY,
      singleRequest.imageUrl,
      singleRequest.context
    );

    return new Response(
      JSON.stringify({ success: true, altText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Generate alt text error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function generateAltTextForImage(
  apiKey: string,
  imageUrl: string,
  context?: string
): Promise<string> {
  // Use vision model to analyze the image and generate alt text
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `You are an SEO and accessibility expert. Analyze the image and generate a concise, descriptive alt text.

RULES:
- Max 125 characters
- Include relevant keywords naturally
- Be specific and descriptive about what's IN the image
- Don't start with "Image of" or "Picture of"
- Focus on the main subject and key details
- Consider the context if provided
- Output ONLY the alt text, nothing else`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Generate SEO-friendly alt text for this image.${context ? ` Context: ${context}` : ''}`
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      temperature: 0.5,
      max_tokens: 150,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    if (response.status === 402) {
      throw new Error("Payment required");
    }
    throw new Error(`AI request failed: ${response.status}`);
  }

  const data = await response.json();
  const altText = data.choices?.[0]?.message?.content?.trim() || "";
  
  // Clean up the alt text (remove quotes if present)
  return altText.replace(/^["']|["']$/g, '').trim();
}
