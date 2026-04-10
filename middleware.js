import { next } from "@vercel/functions";

export const config = {
  matcher: ["/((?!_vercel|assets/).*)"],
};

export default async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Statik dosyalar → dokunma, filesystem serve etsin
  if (pathname.match(/\.\w{2,5}$/)) {
    return next();
  }

  // Sadece GET + HTML istekleri için prerender dene
  const isHtmlRequest = (request.headers.get("accept") || "").includes("text/html");

  if (request.method === "GET" && isHtmlRequest) {
    // Prerender denemesi (LovableHTML)
    try {
      const apiKey = process.env.LOVABLEHTML_API_KEY;
      if (apiKey) {
        const headers = {
          "x-lovablehtml-api-key": apiKey,
          "accept": "text/html",
          "user-agent": request.headers.get("user-agent") || "",
          "referer": request.headers.get("referer") || "",
        };

        const r = await fetch(
          "https://lovablehtml.com/api/prerender/render?url=" + encodeURIComponent(request.url),
          { headers }
        );

        // Prerender başarılı → bot'a HTML sun
        if (r.status === 200 && (r.headers.get("content-type") || "").includes("text/html")) {
          return new Response(r.body, {
            headers: { "content-type": "text/html; charset=utf-8" },
          });
        }
      }
    } catch {
      // Prerender başarısız → normal SPA'ya düş
    }

    // SPA fallback: /index.html'e yönlendir
    return next({ rewrite: new URL("/index.html", request.url) });
  }

  return next();
}
