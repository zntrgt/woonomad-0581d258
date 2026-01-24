import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Loader2, Check, X, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
}

interface TranslationStatus {
  postId: string;
  postTitle: string;
  language: string;
  status: 'pending' | 'translating' | 'success' | 'error' | 'cached';
  error?: string;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

interface BatchTranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: BlogPost[];
}

export function BatchTranslationModal({
  isOpen,
  onClose,
  posts,
}: BatchTranslationModalProps) {
  const { toast } = useToast();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(LANGUAGES.map(l => l.code));
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [statusList, setStatusList] = useState<TranslationStatus[]>([]);
  const [progress, setProgress] = useState(0);

  const toggleLanguage = (code: string) => {
    setSelectedLanguages(prev =>
      prev.includes(code) ? prev.filter(l => l !== code) : [...prev, code]
    );
  };

  const togglePost = (id: string) => {
    setSelectedPosts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectAllPosts = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map(p => p.id));
    }
  };

  const checkExistingTranslations = async (postId: string, language: string): Promise<boolean> => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      const response = await fetch(
        `${supabaseUrl}/rest/v1/blog_translations?blog_post_id=eq.${postId}&language=eq.${language}&select=id`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
        }
      );
      
      if (!response.ok) return false;
      const data = await response.json();
      return data && data.length > 0;
    } catch {
      return false;
    }
  };

  const translatePost = async (
    post: BlogPost,
    language: string,
    accessToken: string
  ): Promise<{ success: boolean; cached?: boolean; error?: string }> => {
    // Check if translation already exists
    const exists = await checkExistingTranslations(post.id, language);
    if (exists) {
      return { success: true, cached: true };
    }

    try {
      const contentToTranslate = post.content.slice(0, 8000);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          texts: {
            title: post.title,
            excerpt: post.excerpt || '',
            content: contentToTranslate,
          },
          targetLanguage: language,
          sourceLanguage: 'tr',
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        if (response.status === 429) {
          return { success: false, error: 'Rate limit aşıldı' };
        }
        if (response.status === 402) {
          return { success: false, error: 'Kredi yetersiz' };
        }
        return { success: false, error: err.error || 'Çeviri hatası' };
      }

      const result = await response.json();
      
      if (result.translations) {
        // Save to database
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        
        const fullContent = result.translations.content 
          ? post.content.replace(contentToTranslate, result.translations.content)
          : post.content;
        
        await fetch(`${supabaseUrl}/rest/v1/blog_translations`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            blog_post_id: post.id,
            language: language,
            title: result.translations.title || post.title,
            excerpt: result.translations.excerpt || post.excerpt || '',
            content: fullContent,
          }),
        });
        
        return { success: true };
      }

      return { success: false, error: 'Çeviri sonucu alınamadı' };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Bilinmeyen hata' };
    }
  };

  const startBatchTranslation = async () => {
    if (selectedPosts.length === 0 || selectedLanguages.length === 0) {
      toast({
        title: 'Uyarı',
        description: 'Lütfen en az bir yazı ve bir dil seçin.',
        variant: 'destructive',
      });
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;

    if (!accessToken) {
      toast({
        title: 'Hata',
        description: 'Oturum süresi dolmuş. Lütfen tekrar giriş yapın.',
        variant: 'destructive',
      });
      return;
    }

    setIsTranslating(true);
    
    // Create status list
    const postsToTranslate = posts.filter(p => selectedPosts.includes(p.id));
    const totalTasks = postsToTranslate.length * selectedLanguages.length;
    const initialStatus: TranslationStatus[] = [];
    
    postsToTranslate.forEach(post => {
      selectedLanguages.forEach(lang => {
        initialStatus.push({
          postId: post.id,
          postTitle: post.title,
          language: lang,
          status: 'pending',
        });
      });
    });
    
    setStatusList(initialStatus);
    
    let completed = 0;
    
    // Process translations one by one to avoid rate limits
    for (const post of postsToTranslate) {
      for (const lang of selectedLanguages) {
        // Update status to translating
        setStatusList(prev =>
          prev.map(s =>
            s.postId === post.id && s.language === lang
              ? { ...s, status: 'translating' }
              : s
          )
        );

        const result = await translatePost(post, lang, accessToken);

        // Update status based on result
        setStatusList(prev =>
          prev.map(s =>
            s.postId === post.id && s.language === lang
              ? {
                  ...s,
                  status: result.cached ? 'cached' : result.success ? 'success' : 'error',
                  error: result.error,
                }
              : s
          )
        );

        completed++;
        setProgress((completed / totalTasks) * 100);

        // Add delay between requests to avoid rate limits
        if (!result.cached) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
    }

    setIsTranslating(false);
    
    const successCount = statusList.filter(s => s.status === 'success' || s.status === 'cached').length;
    toast({
      title: 'Toplu Çeviri Tamamlandı',
      description: `${successCount}/${totalTasks} çeviri başarılı.`,
    });
  };

  const getStatusIcon = (status: TranslationStatus['status']) => {
    switch (status) {
      case 'pending':
        return <div className="w-4 h-4 rounded-full bg-muted" />;
      case 'translating':
        return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'cached':
        return <Check className="w-4 h-4 text-blue-500" />;
      case 'error':
        return <X className="w-4 h-4 text-destructive" />;
    }
  };

  const getLanguageFlag = (code: string) => {
    return LANGUAGES.find(l => l.code === code)?.flag || '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Toplu Çeviri
          </DialogTitle>
          <DialogDescription>
            Seçili blog yazılarını birden fazla dile çevirin.
          </DialogDescription>
        </DialogHeader>

        {!isTranslating ? (
          <>
            {/* Language Selection */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Hedef Diller</h3>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(lang => (
                  <Badge
                    key={lang.code}
                    variant={selectedLanguages.includes(lang.code) ? 'default' : 'outline'}
                    className="cursor-pointer px-3 py-1"
                    onClick={() => toggleLanguage(lang.code)}
                  >
                    {lang.flag} {lang.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Post Selection */}
            <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">Blog Yazıları ({selectedPosts.length}/{posts.length})</h3>
                <Button variant="ghost" size="sm" onClick={selectAllPosts}>
                  {selectedPosts.length === posts.length ? 'Seçimi Kaldır' : 'Tümünü Seç'}
                </Button>
              </div>
              <ScrollArea className="flex-1 border rounded-lg p-3">
                <div className="space-y-2">
                  {posts.map(post => (
                    <div
                      key={post.id}
                      className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer"
                      onClick={() => togglePost(post.id)}
                    >
                      <Checkbox
                        checked={selectedPosts.includes(post.id)}
                        onCheckedChange={() => togglePost(post.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{post.title}</p>
                        <p className="text-xs text-muted-foreground truncate">/{post.slug}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Estimate */}
            <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {selectedPosts.length * selectedLanguages.length} çeviri yapılacak.
                Tahmini süre: ~{Math.ceil(selectedPosts.length * selectedLanguages.length * 2 / 60)} dakika
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">İlerleme</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Status List */}
            <ScrollArea className="flex-1 border rounded-lg p-3">
              <div className="space-y-2">
                {statusList.map((status, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg"
                  >
                    {getStatusIcon(status.status)}
                    <span className="text-lg">{getLanguageFlag(status.language)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{status.postTitle}</p>
                      {status.error && (
                        <p className="text-xs text-destructive">{status.error}</p>
                      )}
                      {status.status === 'cached' && (
                        <p className="text-xs text-blue-500">Zaten mevcut</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isTranslating}>
            {isTranslating ? 'Çeviriler Devam Ediyor...' : 'Kapat'}
          </Button>
          {!isTranslating && (
            <Button
              onClick={startBatchTranslation}
              disabled={selectedPosts.length === 0 || selectedLanguages.length === 0}
            >
              <Globe className="w-4 h-4 mr-2" />
              Çeviriyi Başlat
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
