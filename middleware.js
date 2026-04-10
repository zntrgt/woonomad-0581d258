import { next, rewrite } from "@vercel/functions";

export const config = {
  matcher: [
    "/((?!_vercel|assets|sitemap\\.xml|robots\\.txt|ads\\.txt|sw\\.js|workbox-[^/]+\\.js|manifest\\.webmanifest|favicon\\.ico|favicon\\.png|pwa-[^/]+\\.png|apple-touch-icon\\.png|og-image\\.png|registerSW\\.js).*)"
  ],
};

export default async function middleware(request) {
  const url = new URL(request.url);

  if (url.pathname.includes(".")) {
    return next();
  }

  const isHtml = (request.headers.get("accept") || "").includes("text/html");
  if (request.method !== "GET" || !isHtml) {
    return next();
  }

  try {
    const apiKey = process.env.LOVABLEHTML_API_KEY;
    if (apiKey) {
          const r = await fetch(
        "https://lovablehtml.com/api/prerender/render?url=" + encodeURIComponent(request.url),
        {
          signal: AbortSignal.timeout(3000),
          headers: {
            "x-lovablehtml-api-key": apiKey,
            accept: "text/html",
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
  } catch {}

  return rewrite(new URL("/index.html", request.url));
}
