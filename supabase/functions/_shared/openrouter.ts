/**
 * OpenRouter API Helper — WooNomad Edge Functions
 * 
 * Tüm Edge Function'larda paylaşılan AI çağrı modülü.
 * OpenRouter üzerinden Gemini, Claude, GPT ve diğer modellere erişim sağlar.
 */

export const MODELS = {
  GEMINI_FLASH: "google/gemini-2.5-flash-preview",
  GEMINI_PRO: "google/gemini-2.5-pro-preview",
  CLAUDE_SONNET: "anthropic/claude-sonnet-4-20250514",
  GPT_4O_MINI: "openai/gpt-4o-mini",
} as const;

export type ModelId = (typeof MODELS)[keyof typeof MODELS];

interface CallAIOptions {
  prompt: string;
  systemPrompt?: string;
  model?: ModelId;
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
}

interface AIResponse {
  ok: boolean;
  text: string;
  error: string | null;
  model: string;
}

export async function callAI({
  prompt,
  systemPrompt,
  model = MODELS.GEMINI_FLASH,
  maxTokens = 4096,
  temperature = 0.7,
  timeoutMs = 30_000,
}: CallAIOptions): Promise<AIResponse> {
  const apiKey = Deno.env.get("OPENROUTER_API_KEY");
  if (!apiKey) {
    return { ok: false, text: "", error: "OPENROUTER_API_KEY is not set", model };
  }

  const messages: Array<{ role: string; content: string }> = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: prompt });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://woonomad.co",
        "X-Title": "WooNomad",
      },
      body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 429) return { ok: false, text: "", error: "RATE_LIMIT", model };
      return { ok: false, text: "", error: `HTTP ${response.status}: ${errText.slice(0, 200)}`, model };
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "";
    if (!text) return { ok: false, text: "", error: "Empty response", model: data.model || model };
    return { ok: true, text, error: null, model: data.model || model };
  } catch (err) {
    clearTimeout(timeout);
    const msg = err instanceof Error
      ? err.name === "AbortError" ? `Timeout (${timeoutMs / 1000}s)` : err.message
      : "Unknown error";
    return { ok: false, text: "", error: msg, model };
  }
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
