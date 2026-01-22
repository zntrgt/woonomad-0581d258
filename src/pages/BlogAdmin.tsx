import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";
import { Header } from "@/components/Header";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { SEOScoreWidget } from "@/components/SEOScoreWidget";
import { SEOComparisonModal } from "@/components/SEOComparisonModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Trash2, Loader2, LogOut, Sparkles, Wand2, Upload, Image, Eye, X, Table2, ListChecks, HelpCircle, Code, FileText, ImagePlus, Download, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { blogPosts as staticBlogPosts, BlogPost as StaticBlogPost } from "@/lib/blog";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  city: string | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
}

interface SEOImproveResult {
  title: string;
  metaDescription: string;
  content: string;
  toc: Array<{ id: string; text: string; level: number }>;
  tables: Array<{ title: string; markdown: string }>;
  checklists: Array<{ title: string; items: string[] }>;
  faqs: Array<{ q: string; a: string }>;
  internalLinkSuggestions: Array<{ anchor: string; href: string; reason: string }>;
  schemaJsonLd: object;
  changeSummary: string[];
}

const BlogAdmin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, loading: authLoading, isAdmin, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [staticPosts, setStaticPosts] = useState<StaticBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingStaticPost, setEditingStaticPost] = useState<StaticBlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editorMode, setEditorMode] = useState<'markdown' | 'html'>('markdown');
  const [seoImproving, setSeoImproving] = useState(false);
  const [seoResult, setSeoResult] = useState<SEOImproveResult | null>(null);
  const [showSeoModal, setShowSeoModal] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [importingPost, setImportingPost] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    city: "",
    image_url: "",
    published: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchPosts();
    }
  }, [user, isAdmin]);

  // Handle edit query param - check both DB and static posts
  useEffect(() => {
    const editSlug = searchParams.get('edit');
    if (editSlug) {
      // First check DB posts
      if (posts.length > 0) {
        const postToEdit = posts.find(p => p.slug === editSlug);
        if (postToEdit) {
          handleEdit(postToEdit);
          return;
        }
      }
      // Then check static posts
      const staticPost = staticBlogPosts.find(p => p.slug === editSlug);
      if (staticPost) {
        handleEditStatic(staticPost);
      }
    }
  }, [searchParams, posts]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Hata",
        description: "Blog yazıları yüklenemedi.",
        variant: "destructive",
      });
    } else {
      setPosts(data || []);
      
      // Filter static posts that are NOT in DB (by slug)
      const dbSlugs = new Set((data || []).map(p => p.slug));
      const notInDb = staticBlogPosts.filter(sp => !dbSlugs.has(sp.slug));
      setStaticPosts(notInDb);
    }
    setLoading(false);
  };

  // Handle editing a static post - first import to DB
  const handleEditStatic = (staticPost: StaticBlogPost) => {
    setEditingStaticPost(staticPost);
    setFormData({
      title: staticPost.title,
      slug: staticPost.slug,
      excerpt: staticPost.excerpt || "",
      content: staticPost.content.trim(),
      category: staticPost.category || "",
      city: staticPost.citySlug || "",
      image_url: staticPost.coverImage || "",
      published: true,
    });
    setIsCreating(true);
  };

  // Import static post to database
  const importStaticPost = async (staticPost: StaticBlogPost) => {
    setImportingPost(staticPost.slug);
    
    try {
      const { error } = await supabase.from("blog_posts").insert({
        title: staticPost.title,
        slug: staticPost.slug,
        excerpt: staticPost.excerpt || null,
        content: staticPost.content.trim(),
        category: staticPost.category || null,
        city: staticPost.citySlug || null,
        image_url: staticPost.coverImage || null,
        published: true,
        author_id: user?.id,
      });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Uyarı",
            description: "Bu yazı zaten veritabanında mevcut.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "İçe Aktarıldı",
          description: `"${staticPost.title}" veritabanına aktarıldı.`,
        });
        fetchPosts();
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "İçe aktarma başarısız.",
        variant: "destructive",
      });
    } finally {
      setImportingPost(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      city: "",
      image_url: "",
      published: false,
    });
    setEditingPost(null);
    setEditingStaticPost(null);
    setIsCreating(false);
    setShowPreview(false);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast({
        title: "Hata",
        description: "Başlık, slug ve içerik zorunludur.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    if (editingPost) {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt || null,
          content: formData.content,
          category: formData.category || null,
          city: formData.city || null,
          image_url: formData.image_url || null,
          published: formData.published,
        })
        .eq("id", editingPost.id);

      if (error) {
        toast({
          title: "Hata",
          description: "Yazı güncellenemedi: " + error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Güncellendi",
          description: "Blog yazısı başarıyla güncellendi.",
        });
        // Redirect to the updated post
        const savedSlug = formData.slug;
        fetchPosts();
        resetForm();
        // Navigate to the blog post after successful update
        window.open(`/blog/${savedSlug}`, '_blank');
        fetchPosts();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("blog_posts").insert({
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        content: formData.content,
        category: formData.category || null,
        city: formData.city || null,
        image_url: formData.image_url || null,
        published: formData.published,
        author_id: user?.id,
      });

      if (error) {
        toast({
          title: "Hata",
          description: "Yazı oluşturulamadı: " + error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Oluşturuldu",
          description: "Blog yazısı başarıyla oluşturuldu.",
        });
        fetchPosts();
        resetForm();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      toast({
        title: "Hata",
        description: "Yazı silinemedi: " + error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Silindi",
        description: "Blog yazısı silindi.",
      });
      fetchPosts();
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      category: post.category || "",
      city: post.city || "",
      image_url: post.image_url || "",
      published: post.published,
    });
    setIsCreating(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Image upload handler
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Hata",
        description: "Sadece JPEG, PNG, WebP ve GIF formatları desteklenir.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Hata",
        description: "Dosya boyutu 5MB'dan küçük olmalıdır.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${formData.slug || Date.now()}-${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: data.publicUrl }));

      toast({
        title: "Başarılı",
        description: "Görsel yüklendi.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Görsel yüklenemedi.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const generateWithAI = async (type: 'full' | 'paragraph' | 'improve') => {
    if (type === 'full' && !formData.title) {
      toast({ title: "Hata", description: "Önce başlık girin", variant: "destructive" });
      return;
    }
    
    setGenerating(true);
    try {
      // Get auth token for authenticated API call
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      
      if (!accessToken) {
        toast({ title: "Hata", description: "Oturum süresi dolmuş. Lütfen tekrar giriş yapın.", variant: "destructive" });
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-blog-content`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          type,
          topic: formData.title,
          existingContent: formData.content,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        if (response.status === 401) {
          throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
        }
        if (response.status === 403) {
          throw new Error('Bu işlem için admin yetkisi gerekiyor.');
        }
        throw new Error(err.error || 'AI error');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let content = type === 'improve' ? '' : formData.content;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (!line.startsWith('data: ') || line.includes('[DONE]')) continue;
          try {
            const json = JSON.parse(line.slice(6));
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              content += delta;
              setFormData(prev => ({ ...prev, content }));
            }
          } catch {}
        }
      }
      
      toast({ title: "Başarılı", description: "AI içerik oluşturdu" });
    } catch (error) {
      toast({ 
        title: "Hata", 
        description: error instanceof Error ? error.message : "AI hatası",
        variant: "destructive" 
      });
    } finally {
      setGenerating(false);
    }
  };

  // SEO Improve with AI
  const handleSEOImprove = async () => {
    if (!formData.title || !formData.content) {
      toast({ title: "Hata", description: "Başlık ve içerik gerekli", variant: "destructive" });
      return;
    }

    setSeoImproving(true);
    try {
      // Get auth token for authenticated API call
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      
      if (!accessToken) {
        toast({ title: "Hata", description: "Oturum süresi dolmuş. Lütfen tekrar giriş yapın.", variant: "destructive" });
        setSeoImproving(false);
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seo-improve-blog`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          postId: editingPost?.id || 'new',
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          category: formData.category,
          city: formData.city,
          heroImageUrl: formData.image_url,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        if (response.status === 401) {
          throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
        }
        if (response.status === 403) {
          throw new Error('Bu işlem için admin yetkisi gerekiyor.');
        }
        if (response.status === 429) {
          throw new Error('Rate limit aşıldı. Lütfen biraz bekleyin.');
        }
        if (response.status === 402) {
          throw new Error('Kredi yetersiz. Lütfen kredi ekleyin.');
        }
        throw new Error(err.error || 'SEO iyileştirme hatası');
      }

      const result = await response.json();
      setSeoResult(result);
      setShowSeoModal(true);
      toast({ title: "Başarılı", description: "SEO analizi tamamlandı" });
    } catch (error) {
      toast({ 
        title: "Hata", 
        description: error instanceof Error ? error.message : "SEO iyileştirme hatası",
        variant: "destructive" 
      });
    } finally {
      setSeoImproving(false);
    }
  };

  const applySEOImprovements = (result: SEOImproveResult) => {
    setFormData(prev => ({
      ...prev,
      title: result.title,
      excerpt: result.metaDescription,
      content: result.content,
    }));
    setShowSeoModal(false);
    setSeoResult(null);
    toast({ title: "Uygulandı", description: "SEO iyileştirmeleri başarıyla uygulandı" });
  };

  // Generate AI image for blog
  const handleGenerateImage = async (imagePrompt?: string) => {
    const prompt = imagePrompt || formData.title;
    if (!prompt) {
      toast({ title: "Hata", description: "Görsel için bir başlık veya prompt gerekli", variant: "destructive" });
      return;
    }

    setGeneratingImage(true);
    try {
      // Get auth token for authenticated API call
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      
      if (!accessToken) {
        toast({ title: "Hata", description: "Oturum süresi dolmuş. Lütfen tekrar giriş yapın.", variant: "destructive" });
        setGeneratingImage(false);
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-blog-image`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          prompt: prompt,
          context: `Blog post about ${formData.category || 'travel'} - ${formData.city || 'destination'}`,
          slug: formData.slug || 'blog-image',
          generateAltText: true,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        if (response.status === 401) {
          throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
        }
        if (response.status === 403) {
          throw new Error('Bu işlem için admin yetkisi gerekiyor.');
        }
        if (response.status === 429) {
          throw new Error('Rate limit aşıldı. Lütfen biraz bekleyin.');
        }
        if (response.status === 402) {
          throw new Error('Kredi yetersiz. Lütfen kredi ekleyin.');
        }
        throw new Error(err.error || 'Görsel oluşturma hatası');
      }

      const result = await response.json();
      
      if (result.imageUrl) {
        setFormData(prev => ({ ...prev, image_url: result.imageUrl }));
        toast({ 
          title: "Görsel Oluşturuldu", 
          description: result.altText ? `Alt text: ${result.altText}` : "AI görsel başarıyla oluşturuldu" 
        });
      }
    } catch (error) {
      toast({ 
        title: "Hata", 
        description: error instanceof Error ? error.message : "Görsel oluşturma hatası",
        variant: "destructive" 
      });
    } finally {
      setGeneratingImage(false);
    }
  };

  // Insert markdown snippets
  const insertSnippet = (snippet: string) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + (prev.content ? '\n\n' : '') + snippet
    }));
  };

  const insertTable = () => {
    const tableSnippet = `## 📊 Karşılaştırma Tablosu

| Özellik | Seçenek A | Seçenek B | Seçenek C |
|---------|-----------|-----------|-----------|
| Fiyat   | €500/ay   | €800/ay   | €1200/ay  |
| İnternet| 50 Mbps   | 100 Mbps  | 200 Mbps  |
| Konum   | Merkez    | Banliyö   | Sahil     |

*Fiyatlar tahmini olup değişiklik gösterebilir.*`;
    insertSnippet(tableSnippet);
  };

  const insertChecklist = () => {
    const checklistSnippet = `## ✅ Kontrol Listesi

- [ ] Pasaport geçerliliğini kontrol et (min. 6 ay)
- [ ] Vize başvurusu yap
- [ ] Uçak bileti al
- [ ] Konaklama rezervasyonu yap
- [ ] Seyahat sigortası yaptır
- [ ] Yerel SIM kart araştır
- [ ] Banka kartlarını bilgilendir
- [ ] Acil durum numaralarını kaydet`;
    insertSnippet(checklistSnippet);
  };

  const insertFAQ = () => {
    const faqSnippet = `## ❓ Sıkça Sorulan Sorular

### Bu şehirde aylık yaşam maliyeti ne kadar?
Ortalama aylık yaşam maliyeti €800-1500 arasında değişmektedir. Bu miktar konaklamaya, yeme-içme alışkanlıklarına ve yaşam tarzına göre farklılık gösterebilir.

### İnternet hızı dijital çalışma için yeterli mi?
Evet, şehir genelinde ortalama 50-100 Mbps internet hızı mevcuttur. Coworking alanlarında bu hız 200 Mbps'e kadar çıkabilmektedir.

### Vize almak gerekiyor mu?
Türk vatandaşları için vize gereksinimleri ülkeye göre değişmektedir. Güncel bilgi için ilgili konsolosluğa başvurmanızı öneririz.

### En iyi ziyaret zamanı ne zaman?
İlkbahar (Nisan-Mayıs) ve sonbahar (Eylül-Ekim) ayları hem hava koşulları hem de turist yoğunluğu açısından ideal dönemlerdir.

### Coworking alanları nasıl?
Şehirde 20+ coworking alanı bulunmaktadır. Fiyatlar günlük €10-25, aylık €100-300 arasında değişmektedir.

### Güvenlik durumu nasıl?
Genel olarak güvenli bir şehirdir. Turistik bölgelerde standart önlemleri almanız yeterlidir.`;
    insertSnippet(faqSnippet);
  };

  const insertBudget = () => {
    const budgetSnippet = `## 💰 Aylık Bütçe Senaryoları

### Ekonomik Bütçe (€600-800/ay)
| Kalem | Tutar |
|-------|-------|
| Konaklama (paylaşımlı) | €300-400 |
| Yemek (ev yemekleri) | €150-200 |
| Ulaşım | €50-80 |
| Coworking (haftada 2 gün) | €40-60 |
| Diğer | €60-60 |

### Orta Bütçe (€1000-1400/ay)
| Kalem | Tutar |
|-------|-------|
| Konaklama (stüdyo) | €500-700 |
| Yemek (karışık) | €250-350 |
| Ulaşım | €80-100 |
| Coworking (tam üyelik) | €100-150 |
| Eğlence | €70-100 |

### Rahat Bütçe (€1800-2500/ay)
| Kalem | Tutar |
|-------|-------|
| Konaklama (1+1 daire) | €900-1200 |
| Yemek (restoran ağırlıklı) | €400-600 |
| Ulaşım (araç kiralama dahil) | €200-300 |
| Coworking (premium) | €200-250 |
| Eğlence ve aktiviteler | €100-150 |

*Bütçeler tahmini olup kişisel tercihlere göre değişiklik gösterebilir.*`;
    insertSnippet(budgetSnippet);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Yetkisiz Erişim | Woonomad</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <Header />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Yetkisiz Erişim</h1>
          <p className="text-muted-foreground mb-4">
            Bu sayfaya erişim yetkiniz bulunmamaktadır.
          </p>
          <Button onClick={() => navigate("/")}>Ana Sayfaya Dön</Button>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Blog Yönetimi | Woonomad</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-8 mb-20 md:mb-0">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Blog Yönetimi</h1>
          <div className="flex gap-2">
            {!isCreating && (
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Yazı
              </Button>
            )}
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış
            </Button>
          </div>
        </div>

        {isCreating ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <Card>
              <CardHeader>
                <CardTitle>{editingPost ? "Yazıyı Düzenle" : "Yeni Blog Yazısı"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Başlık (55-60 karakter ideal)</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          title: e.target.value,
                          slug: formData.slug || generateSlug(e.target.value),
                        });
                      }}
                      placeholder="Blog yazısı başlığı"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.title.length}/60 karakter
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="blog-yazisi-url"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="nomad, festival, culture, travel-tips"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Şehir (slug formatında)</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="istanbul, barcelona, lisbon"
                    />
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-2">
                  <Label>Kapak Görseli</Label>
                  <div className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://example.com/image.jpg veya yükle"
                      />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      title="Görsel Yükle"
                    >
                      {uploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => handleGenerateImage()}
                      disabled={generatingImage || !formData.title}
                      title="AI ile Görsel Oluştur"
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      {generatingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ImagePlus className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Görsel yükleyin veya AI ile başlığa uygun görsel oluşturun
                  </p>
                  {formData.image_url && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={formData.image_url} 
                        alt="Kapak" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Meta Açıklama (150-160 karakter ideal)</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="2026 güncel rehber, bütçe örnekleri, checklist ve araç önerileri..."
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.excerpt.length}/160 karakter
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="content">İçerik</Label>
                      <Tabs value={editorMode} onValueChange={(v) => setEditorMode(v as 'markdown' | 'html')}>
                        <TabsList className="h-7">
                          <TabsTrigger value="markdown" className="text-xs px-2 py-1">
                            <FileText className="w-3 h-3 mr-1" />
                            MD
                          </TabsTrigger>
                          <TabsTrigger value="html" className="text-xs px-2 py-1">
                            <Code className="w-3 h-3 mr-1" />
                            HTML
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Button type="button" size="sm" variant="outline" onClick={insertTable} title="Tablo Ekle">
                        <Table2 className="w-4 h-4" />
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={insertChecklist} title="Checklist Ekle">
                        <ListChecks className="w-4 h-4" />
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={insertBudget} title="Bütçe Tablosu Ekle">
                        💰
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={insertFAQ} title="FAQ Ekle">
                        <HelpCircle className="w-4 h-4" />
                      </Button>
                      <div className="w-px bg-border mx-1" />
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline"
                        onClick={() => generateWithAI('full')}
                        disabled={generating}
                      >
                        {generating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
                        AI
                      </Button>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline"
                        onClick={() => generateWithAI('improve')}
                        disabled={generating || !formData.content}
                      >
                        <Wand2 className="w-4 h-4 mr-1" />
                        İyileştir
                      </Button>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant={showPreview ? "default" : "outline"}
                        onClick={() => setShowPreview(!showPreview)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {showPreview ? (
                    <div className="border rounded-lg p-4 min-h-[300px] bg-muted/30 prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(
                          formData.content
                            .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
                            .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
                            .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-3">$1</h1>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/^\- (.*$)/gm, '<li class="ml-4">$1</li>')
                            .replace(/\n/g, '<br />'),
                          { 
                            ALLOWED_TAGS: ['h1', 'h2', 'h3', 'strong', 'em', 'li', 'br', 'p', 'ul', 'ol', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a', 'img'],
                            ALLOWED_ATTR: ['class', 'href', 'src', 'alt', 'target', 'rel']
                          }
                        )
                      }} />
                    </div>
                  ) : (
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="# Başlık&#10;&#10;Giriş paragrafı...&#10;&#10;## Alt Başlık&#10;&#10;İçerik..."
                      rows={16}
                      className="font-mono text-sm"
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formData.content.split(/\s+/).filter(w => w.length > 0).length} kelime (ideal: 900+)
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                  <Label htmlFor="published">Yayınla</Label>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleSEOImprove}
                    disabled={seoImproving || !formData.content}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    {seoImproving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        SEO Analiz...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        AI ile SEO İyileştir
                      </>
                    )}
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Kaydet
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    İptal
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* SEO Score Sidebar */}
            <div className="space-y-4">
              <SEOScoreWidget
                title={formData.title}
                excerpt={formData.excerpt}
                content={formData.content}
                slug={formData.slug}
                imageUrl={formData.image_url}
                category={formData.category}
              />
              
              {/* Quick Tips Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">📝 İçerik İpuçları</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-2">
                  <p>• İlk 120 kelimede konuyu, hedef kitleyi ve faydayı belirt</p>
                  <p>• En az 3 H2, 2 H3 başlık kullan</p>
                  <p>• 2+ tablo/bütçe örneği ekle</p>
                  <p>• 6-10 FAQ sorusu ekle</p>
                  <p>• İlgili şehir sayfalarına link ver</p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Database Posts Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Veritabanındaki Yazılar ({posts.length})</h2>
              </div>
              
              {posts.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Henüz veritabanında blog yazısı yok.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {post.image_url && (
                              <img 
                                src={post.image_url} 
                                alt="" 
                                className="w-16 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{post.title}</h3>
                                <Badge variant="outline" className="text-xs">DB</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                /{post.slug} • {post.category || "Kategori yok"}
                                {post.city && ` • ${post.city}`}
                                {post.published ? " • 🟢 Yayında" : " • 🟡 Taslak"}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                              Düzenle
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Static Posts Section (not yet in DB) */}
            {staticPosts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-semibold">Statik Yazılar ({staticPosts.length})</h2>
                  <Badge variant="secondary" className="text-xs">Kod İçinde</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Bu yazılar henüz veritabanında değil. "İçe Aktar" butonuyla veritabanına aktarabilir ve düzenleyebilirsiniz.
                </p>
                
                <div className="space-y-3">
                  {staticPosts.map((post) => (
                    <Card key={post.id} className="border-orange-200 dark:border-orange-900/50">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {post.coverImage && (
                              <img 
                                src={post.coverImage} 
                                alt="" 
                                className="w-16 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{post.title}</h3>
                                <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">Statik</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                /{post.slug} • {post.category || "Kategori yok"}
                                {post.citySlug && ` • ${post.citySlug}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => importStaticPost(post)}
                              disabled={importingPost === post.slug}
                              className="border-primary text-primary hover:bg-primary/10"
                            >
                              {importingPost === post.slug ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Download className="w-4 h-4 mr-1" />
                                  İçe Aktar
                                </>
                              )}
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={() => handleEditStatic(post)}
                            >
                              İçe Aktar & Düzenle
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <MobileBottomNav />

      {/* SEO Comparison Modal */}
      <SEOComparisonModal
        isOpen={showSeoModal}
        onClose={() => setShowSeoModal(false)}
        onApply={applySEOImprovements}
        currentData={{
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
        }}
        improvedData={seoResult}
      />
    </div>
  );
};

export default BlogAdmin;
