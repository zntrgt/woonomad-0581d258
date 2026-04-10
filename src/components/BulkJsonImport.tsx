import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload, Check, X, Loader2, FileText, MapPin, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// ============ BLOG POST FORMAT ============
const BLOG_EXAMPLE = `[
  {
    "title": "Roma Seyahat Rehberi 2026",
    "slug": "roma-seyahat-rehberi-2026",
    "excerpt": "Roma'da nerede kalınır, ne yenir, ne kadar harcanır.",
    "content": "## Roma Hakkında\\nAntik tarihin modern yaşamla buluştuğu Roma...\\n\\n## Ne Zaman Gidilir\\nNisan-Haziran en ideal dönem...",
    "category": "travel-tips",
    "city": "roma",
    "image_url": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200",
    "published": true
  }
]`;

// ============ CITY GEO FORMAT ============
const CITY_GEO_EXAMPLE = `{
  "roma": {
    "tldr": "Roma, Avrupa'nın en tarihi şehri. Günlük bütçe €55-80. Nisan-Haziran en ideal dönem.",
    "quickAnswer": "Roma'da 3-5 gün kalın, günlük €55-80 bütçe ayırın.",
    "lastUpdated": "Nisan 2026",
    "visa": "Schengen vizesi gerekli (90/180 gün).",
    "safety": "Genel olarak güvenli. Turistik bölgelerde yankesicilere dikkat.",
    "seasons": [
      { "period": "Mar-May", "temp": "12-22°C", "crowd": "Orta", "price": "Orta", "note": "En ideal dönem" },
      { "period": "Haz-Ağu", "temp": "25-35°C", "crowd": "Yüksek", "price": "Yüksek", "note": "Sıcak ve kalabalık" }
    ],
    "costs": [
      { "item": "Konaklama", "budget": "€25-40", "mid": "€80-120", "comfort": "€180+" },
      { "item": "Yemek", "budget": "€15-25", "mid": "€30-50", "comfort": "€60+" },
      { "item": "TOPLAM/gün", "budget": "€55-80", "mid": "€140-220", "comfort": "€300+" }
    ],
    "faqs": [
      { "question": "Roma'da kaç gün kalmalı?", "answer": "Temel noktalar için 3 gün, derinlemesine 5 gün." },
      { "question": "Roma pahalı mı?", "answer": "Orta seviye. Günlük €55-80 ile rahat gezilebilir." }
    ]
  }
}`;

interface ImportResult {
  slug: string;
  status: "success" | "error" | "duplicate";
  message: string;
}

export function BulkJsonImport() {
  const [blogJson, setBlogJson] = useState("");
  const [cityJson, setCityJson] = useState("");
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<ImportResult[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // ============ BLOG IMPORT ============
  const handleBlogImport = async () => {
    if (!blogJson.trim()) return;

    setImporting(true);
    setResults([]);
    const importResults: ImportResult[] = [];

    try {
      const posts = JSON.parse(blogJson);
      const postArray = Array.isArray(posts) ? posts : [posts];

      for (const post of postArray) {
        if (!post.title || !post.slug || !post.content) {
          importResults.push({
            slug: post.slug || "?",
            status: "error",
            message: "title, slug ve content zorunlu",
          });
          continue;
        }

        const { error } = await supabase.from("blog_posts").insert({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || null,
          content: post.content,
          category: post.category || null,
          city: post.city || null,
          image_url: post.image_url || null,
          published: post.published ?? false,
          author_id: user?.id || null,
        });

        if (error) {
          if (error.code === "23505") {
            importResults.push({ slug: post.slug, status: "duplicate", message: "Zaten mevcut" });
          } else {
            importResults.push({ slug: post.slug, status: "error", message: error.message });
          }
        } else {
          importResults.push({ slug: post.slug, status: "success", message: "Eklendi" });
        }
      }
    } catch (e: any) {
      importResults.push({ slug: "-", status: "error", message: "JSON parse hatası: " + e.message });
    }

    setResults(importResults);
    setImporting(false);

    const successCount = importResults.filter((r) => r.status === "success").length;
    toast({
      title: `${successCount} / ${importResults.length} yazı aktarıldı`,
      description: successCount > 0 ? "Blog yazıları başarıyla eklendi." : "Hata oluştu.",
      variant: successCount > 0 ? "default" : "destructive",
    });
  };

  // ============ CITY GEO EXPORT (generates code) ============
  const handleCityGeoGenerate = () => {
    if (!cityJson.trim()) return;

    try {
      const parsed = JSON.parse(cityJson);
      // Validate structure
      const keys = Object.keys(parsed);
      if (keys.length === 0) throw new Error("Boş JSON");

      const code = `// cityGeoData.ts'e eklenecek veriler\n// Her şehir slug'ını cityGeoData objesine ekleyin.\n\n${JSON.stringify(parsed, null, 2)}`;

      navigator.clipboard.writeText(JSON.stringify(parsed, null, 2));
      toast({
        title: `${keys.length} şehir verisi panoya kopyalandı`,
        description: "cityGeoData.ts dosyasına yapıştırın.",
      });
    } catch (e: any) {
      toast({
        title: "JSON Hatası",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="h-5 w-5" />
          Toplu JSON İçe Aktarma
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="blog">
          <TabsList className="mb-4">
            <TabsTrigger value="blog" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Blog Yazıları
            </TabsTrigger>
            <TabsTrigger value="city" className="gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Şehir GEO Verisi
            </TabsTrigger>
          </TabsList>

          {/* ============ BLOG TAB ============ */}
          <TabsContent value="blog" className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">
              <p className="font-medium mb-1">Zorunlu alanlar: <code>title</code>, <code>slug</code>, <code>content</code></p>
              <p>Opsiyonel: <code>excerpt</code>, <code>category</code>, <code>city</code>, <code>image_url</code>, <code>published</code></p>
              <p className="mt-1">Kategoriler: <code>festival</code>, <code>culture</code>, <code>lifestyle</code>, <code>travel-tips</code>, <code>food</code>, <code>nomad</code></p>
            </div>

            <details className="text-xs">
              <summary className="cursor-pointer text-primary font-medium">Örnek JSON göster</summary>
              <pre className="mt-2 p-3 bg-muted rounded-lg overflow-x-auto text-[11px] leading-relaxed">{BLOG_EXAMPLE}</pre>
            </details>

            <Textarea
              value={blogJson}
              onChange={(e) => setBlogJson(e.target.value)}
              placeholder='[{"title": "...", "slug": "...", "content": "..."}]'
              className="font-mono text-xs min-h-[200px]"
            />

            <div className="flex items-center gap-2">
              <Button onClick={handleBlogImport} disabled={importing || !blogJson.trim()}>
                {importing ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Aktarılıyor...</>
                ) : (
                  <><Upload className="h-4 w-4 mr-2" /> Supabase'e Aktar</>
                )}
              </Button>
              <span className="text-xs text-muted-foreground">
                Direkt blog_posts tablosuna insert eder
              </span>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-1 mt-4">
                {results.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {r.status === "success" && <Check className="h-4 w-4 text-emerald-500" />}
                    {r.status === "error" && <X className="h-4 w-4 text-red-500" />}
                    {r.status === "duplicate" && <Badge variant="outline" className="text-xs">Mevcut</Badge>}
                    <code className="text-xs">{r.slug}</code>
                    <span className="text-xs text-muted-foreground">{r.message}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ============ CITY GEO TAB ============ */}
          <TabsContent value="city" className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">
              <p className="font-medium mb-1">Şehir GEO verisi (TL;DR, sezon tablosu, maliyet, FAQ)</p>
              <p>Bu veri <code>cityGeoData.ts</code> dosyasına eklenir. JSON'u yapıştır → "Kodu Kopyala" → GitHub'da dosyaya ekle.</p>
            </div>

            <details className="text-xs">
              <summary className="cursor-pointer text-primary font-medium">Örnek JSON göster</summary>
              <pre className="mt-2 p-3 bg-muted rounded-lg overflow-x-auto text-[11px] leading-relaxed">{CITY_GEO_EXAMPLE}</pre>
            </details>

            <Textarea
              value={cityJson}
              onChange={(e) => setCityJson(e.target.value)}
              placeholder='{"sehir-slug": {"tldr": "...", "seasons": [...], "costs": [...], "faqs": [...]}}'
              className="font-mono text-xs min-h-[200px]"
            />

            <div className="flex items-center gap-2">
              <Button onClick={handleCityGeoGenerate} disabled={!cityJson.trim()} variant="secondary">
                <Copy className="h-4 w-4 mr-2" /> Kodu Kopyala
              </Button>
              <span className="text-xs text-muted-foreground">
                Panoya kopyalar → cityGeoData.ts'e yapıştır
              </span>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
