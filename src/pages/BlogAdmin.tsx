import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  city?: string;
  published: boolean;
  createdAt: Date;
}

const BlogAdmin = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    city: "",
    published: false,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      city: "",
      published: false,
    });
    setEditingPost(null);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast({
        title: "Hata",
        description: "Başlık, slug ve içerik zorunludur.",
        variant: "destructive",
      });
      return;
    }

    if (editingPost) {
      setPosts(posts.map(p => 
        p.id === editingPost.id 
          ? { ...p, ...formData }
          : p
      ));
      toast({
        title: "Güncellendi",
        description: "Blog yazısı başarıyla güncellendi.",
      });
    } else {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
      };
      setPosts([...posts, newPost]);
      toast({
        title: "Oluşturuldu",
        description: "Blog yazısı başarıyla oluşturuldu.",
      });
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
    toast({
      title: "Silindi",
      description: "Blog yazısı silindi.",
    });
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      city: post.city || "",
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
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Yazı
            </Button>
          )}
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
                        slug: formData.slug || generateSlug(e.target.value)
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
                <Label htmlFor="content">İçerik (HTML destekli)</Label>
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
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Kaydet
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
                          /{post.slug} • {post.category}
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
