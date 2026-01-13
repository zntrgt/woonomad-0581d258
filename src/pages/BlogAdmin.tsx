import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Plus, Save, Trash2, Loader2, LogOut, Sparkles, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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

const BlogAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, isAdmin, signOut } = useAuth();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [generating, setGenerating] = useState(false);

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
    }
    setLoading(false);
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
    setIsCreating(false);
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

  const generateWithAI = async (type: 'full' | 'paragraph' | 'improve') => {
    if (type === 'full' && !formData.title) {
      toast({ title: "Hata", description: "Önce başlık girin", variant: "destructive" });
      return;
    }
    
    setGenerating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-blog-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          topic: formData.title,
          existingContent: formData.content,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
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
          <Card>
            <CardHeader>
              <CardTitle>{editingPost ? "Yazıyı Düzenle" : "Yeni Blog Yazısı"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Başlık</Label>
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
                    placeholder="Seyahat, Rehber, vb."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Şehir (opsiyonel)</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="İstanbul, Londra, vb."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Görsel URL (opsiyonel)</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Özet</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Kısa özet (arama sonuçlarında görünür)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">İçerik (Markdown destekli)</Label>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={() => generateWithAI('full')}
                      disabled={generating}
                    >
                      {generating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
                      AI ile Oluştur
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
                  </div>
                </div>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Blog yazısı içeriği..."
                  rows={12}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label htmlFor="published">Yayınla</Label>
              </div>

              <div className="flex gap-2">
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
        ) : (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Henüz blog yazısı yok. Yeni bir yazı oluşturmak için "Yeni Yazı" butonuna tıklayın.
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          /{post.slug} • {post.category || "Kategori yok"}
                          {post.city && ` • ${post.city}`}
                          {post.published ? " • Yayında" : " • Taslak"}
                        </p>
                      </div>
                      <div className="flex gap-2">
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
              ))
            )}
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default BlogAdmin;
