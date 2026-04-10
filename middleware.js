import { next, rewrite } from "@vercel/functions";

export const config = {
  matcher: ["/((?!_vercel|assets|sitemap\\.xml|robots\\.txt|ads\\.txt|sw\\.js|workbox|manifest|favicon|pwa|apple-touch|og-image).*)"],
};

export default async function middleware(request) {
  const isHtmlRequest = (request.headers.get("accept") || "").includes("text/html");

  if (request.method !== "GET" || !isHtmlRequest) {
    return next();
  }

  try {
    const apiKey = process.env.LOVABLEHTML_API_KEY;
    if (apiKey) {
      const r = await fetch(
        "https://lovablehtml.com/api/prerender/render?url=" + encodeURIComponent(request.url),
        {
          headers: {
            "x-lovablehtml-api-key": apiKey,
            "accept": "text/html",
            "user-agent": request.headers.get("user-agent") || "",
          },
        }
      );

      if (r.status === 200 && (r.headers.get("content-type") || "").includes("text/html")) {
        return new Response(r.body, {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }
    }
  } catch {
    // Prerender başarısız → SPA'ya düş
  }

  return rewrite(new URL("/index.html", request.url));
}
