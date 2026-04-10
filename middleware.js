import { next } from "@vercel/functions";

export const config = {
  matcher: [
    '/((?!api|_vercel|assets|sw|workbox|favicon|pwa|apple-touch|og-image|robots|sitemap|ads|manifest|.*\\..*).*)',
  ],
};

export default async function middleware(request) {
  const isHtmlRequest = (request.headers.get("accept") || "").includes("text/html");

  if (request.method !== "GET" || !isHtmlRequest) {
    return next();
  }

  try {
    const headers = {
      "x-lovablehtml-api-key": process.env.LOVABLEHTML_API_KEY,
      "accept": "text/html",
      "accept-language": request.headers.get("accept-language") || "",
      "sec-fetch-mode": request.headers.get("sec-fetch-mode") || "",
      "sec-fetch-site": request.headers.get("sec-fetch-site") || "",
      "sec-fetch-dest": request.headers.get("sec-fetch-dest") || "",
      "sec-fetch-user": request.headers.get("sec-fetch-user") || "",
      "upgrade-insecure-requests": request.headers.get("upgrade-insecure-requests") || "",
      "referer": request.headers.get("referer") || "",
      "user-agent": request.headers.get("user-agent") || "",
    };

    const r = await fetch(
      "https://lovablehtml.com/api/prerender/render?url=" + encodeURIComponent(request.url),
      { headers }
    );

    if (r.status === 304) {
      return next();
    }

    if ((r.headers.get("content-type") || "").includes("text/html")) {
      return new Response(r.body, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  } catch {
    // Hata durumunda normal SPA'ya düş
  }

  return next();
}
