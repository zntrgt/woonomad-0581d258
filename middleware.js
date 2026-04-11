import { next, rewrite } from "@vercel/functions";

export const config = {
  matcher: [
    "/((?!_vercel|assets|sitemap\\.xml|robots\\.txt|ads\\.txt|sw\\.js|workbox-[^/]+\\.js|manifest\\.webmanifest|favicon\\.ico|favicon\\.png|pwa-[^/]+\\.png|apple-touch-icon\\.png|og-image\\.png|registerSW\\.js).*)",
  ],
};

// ─── BOT DETECTION ─────────────────────────────────────────
// Sadece bu botlara prerender edilmiş HTML gönder.
// İnsan ziyaretçiler normal SPA'yı görür → kota korunur, hız artar.
const BOT_AGENTS = [
  // Arama motorları
  "googlebot",
  "bingbot",
  "yandex",
  "baiduspider",
  "duckduckbot",
  "slurp",
  "exabot",
  "applebot",

  // AI arama motorları (GEO için kritik)
  "gptbot",
  "chatgpt-user",
  "perplexitybot",
  "claudebot",
  "anthropic-ai",
  "google-extended",
  "ccbot",
  "cohere-ai",

  // Sosyal medya crawler'ları
  "facebookexternalhit",
  "facebot",
  "twitterbot",
  "linkedinbot",
  "whatsapp",
  "discordbot",
  "telegrambot",
  "slackbot",
  "pinterestbot",

  // SEO araçları
  "semrushbot",
  "ahrefsbot",
  "dotbot",
  "rogerbot",
  "screaming frog",

  // Diğer
  "embedly",
  "quora link preview",
  "outbrain",
  "flipboard",
  "w3c_validator",
  "prerender",
];

function isBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_AGENTS.some((bot) => ua.includes(bot));
}

// ─── MIDDLEWARE ─────────────────────────────────────────────
export default async function middleware(request) {
  const url = new URL(request.url);

  // Statik dosyaları atla
  if (url.pathname.includes(".")) {
    return next();
  }

  // Sadece GET + HTML isteklerini yakala
  const isHtml = (request.headers.get("accept") || "").includes("text/html");
  if (request.method !== "GET" || !isHtml) {
    return next();
  }

  const userAgent = request.headers.get("user-agent") || "";

  // ─── İNSAN ZİYARETÇİ → Normal SPA ───
  if (!isBot(userAgent)) {
    return rewrite(new URL("/index.html", request.url));
  }

  // ─── BOT → Prerender edilmiş HTML ───
  // Öncelik 1: Prerender.io
  try {
    const prerenderToken = process.env.PRERENDER_TOKEN;
    if (prerenderToken) {
      const prerenderUrl = `https://service.prerender.io/${request.url}`;
      const r = await fetch(prerenderUrl, {
        signal: AbortSignal.timeout(5000), // Bot'lar için 5 saniye OK
        headers: {
          "X-Prerender-Token": prerenderToken,
          "User-Agent": userAgent,
          Accept: "text/html",
        },
      });

      if (
        r.status === 200 &&
        (r.headers.get("content-type") || "").includes("text/html")
      ) {
        const html = await r.text();

        // Boş veya çok kısa yanıt kontrolü
        if (html.length > 500) {
          return new Response(html, {
            headers: {
              "content-type": "text/html; charset=utf-8",
              "x-prerendered": "prerender.io",
              // Cache: aynı URL için 1 saat boyunca tekrar prerender etme
              "Cache-Control": "public, max-age=3600, s-maxage=3600",
            },
          });
        }
      }
    }
  } catch (e) {
    // Prerender.io başarısız → fallback'e düş
    console.error("[prerender.io] Error:", e.message);
  }

  // Öncelik 2: LovableHTML (fallback)
  try {
    const lovableKey = process.env.LOVABLEHTML_API_KEY;
    if (lovableKey) {
      const r = await fetch(
        "https://lovablehtml.com/api/prerender/render?url=" +
          encodeURIComponent(request.url),
        {
          signal: AbortSignal.timeout(4000),
          headers: {
            "x-lovablehtml-api-key": lovableKey,
            accept: "text/html",
            "user-agent": userAgent,
          },
        }
      );

      if (
        r.status === 200 &&
        (r.headers.get("content-type") || "").includes("text/html")
      ) {
        return new Response(r.body, {
          headers: {
            "content-type": "text/html; charset=utf-8",
            "x-prerendered": "lovablehtml",
          },
        });
      }
    }
  } catch (e) {
    console.error("[lovablehtml] Error:", e.message);
  }

  // Her iki servis de başarısız → SPA fallback
  return rewrite(new URL("/index.html", request.url));
}
