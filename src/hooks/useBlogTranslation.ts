import { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

interface BlogTranslation {
  title: string;
  excerpt: string;
  content: string;
}

interface UseBlogTranslationResult {
  translatedContent: BlogTranslation | null;
  isTranslating: boolean;
  error: string | null;
}

// Helper to make raw Supabase requests for blog_translations table
// This bypasses the typed client since blog_translations may not be in types.ts yet
async function fetchBlogTranslation(postId: string, language: string): Promise<BlogTranslation | null> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    const response = await fetch(
      `${supabaseUrl}/rest/v1/blog_translations?blog_post_id=eq.${postId}&language=eq.${language}&select=title,excerpt,content`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        title: data[0].title,
        excerpt: data[0].excerpt || '',
        content: data[0].content,
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function upsertBlogTranslation(
  postId: string, 
  language: string, 
  translation: BlogTranslation
): Promise<void> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    await fetch(
      `${supabaseUrl}/rest/v1/blog_translations`,
      {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          blog_post_id: postId,
          language: language,
          title: translation.title,
          excerpt: translation.excerpt,
          content: translation.content,
        }),
      }
    );
  } catch (err) {
    console.warn('Failed to cache translation:', err);
  }
}

async function fetchBlogTranslationsBatch(
  postIds: string[], 
  language: string
): Promise<Map<string, { title: string; excerpt: string }>> {
  const result = new Map<string, { title: string; excerpt: string }>();
  
  if (postIds.length === 0) return result;
  
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    const idsParam = postIds.map(id => `"${id}"`).join(',');
    const response = await fetch(
      `${supabaseUrl}/rest/v1/blog_translations?blog_post_id=in.(${idsParam})&language=eq.${language}&select=blog_post_id,title,excerpt`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );
    
    if (!response.ok) return result;
    
    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?.forEach((item: any) => {
      result.set(item.blog_post_id, {
        title: item.title,
        excerpt: item.excerpt || '',
      });
    });
  } catch {
    // Ignore errors
  }
  
  return result;
}

export function useBlogTranslation(
  postId: string | undefined,
  originalContent: { title: string; excerpt: string; content: string } | null
): UseBlogTranslationResult {
  const { language, translatePageContent } = useSettings();
  const [translatedContent, setTranslatedContent] = useState<BlogTranslation | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrTranslate = async () => {
      setError(null);

      // If Turkish or no content, use original
      if (language === 'tr' || !postId || !originalContent) {
        setTranslatedContent(null);
        return;
      }

      setIsTranslating(true);

      try {
        // 1. Check cache
        const cached = await fetchBlogTranslation(postId, language);
        
        if (cached) {
          setTranslatedContent(cached);
          setIsTranslating(false);
          return;
        }

        // 2. Translate via AI
        const contentToTranslate = originalContent.content.slice(0, 8000);
        
        const result = await translatePageContent({
          title: originalContent.title,
          excerpt: originalContent.excerpt,
          content: contentToTranslate,
        });

        if (result) {
          const translated: BlogTranslation = {
            title: result.title || originalContent.title,
            excerpt: result.excerpt || originalContent.excerpt,
            content: result.content 
              ? originalContent.content.replace(contentToTranslate, result.content)
              : originalContent.content,
          };

          setTranslatedContent(translated);

          // 3. Cache (fire and forget)
          upsertBlogTranslation(postId, language, translated);
        } else {
          setTranslatedContent(null);
        }
      } catch (err) {
        console.error('Translation error:', err);
        setError('Çeviri yapılamadı');
        setTranslatedContent(null);
      } finally {
        setIsTranslating(false);
      }
    };

    fetchOrTranslate();
  }, [postId, language, originalContent, translatePageContent]);

  return {
    translatedContent,
    isTranslating,
    error,
  };
}

// Hook for translating blog list items
export function useBlogListTranslation(
  posts: Array<{ id: string; title: string; excerpt: string }>,
  enabled: boolean = true
): {
  translatedPosts: Map<string, { title: string; excerpt: string }>;
  isTranslating: boolean;
} {
  const { language, translatePageContent } = useSettings();
  const [translatedPosts, setTranslatedPosts] = useState<Map<string, { title: string; excerpt: string }>>(new Map());
  const [isTranslating, setIsTranslating] = useState(false);

  // Create a stable string key from post IDs
  const postIdsKey = posts.map(p => p.id).join(',');

  useEffect(() => {
    const translatePosts = async () => {
      if (language === 'tr' || !enabled || posts.length === 0) {
        setTranslatedPosts(new Map());
        return;
      }

      setIsTranslating(true);

      try {
        // Check cache
        const cachedMap = await fetchBlogTranslationsBatch(
          posts.map(p => p.id),
          language
        );

        // Find posts needing translation
        const needsTranslation = posts.filter(p => !cachedMap.has(p.id));

        if (needsTranslation.length > 0) {
          // Batch translate (max 5)
          const batch = needsTranslation.slice(0, 5);
          const textsToTranslate: Record<string, string> = {};
          
          batch.forEach(post => {
            textsToTranslate[`title_${post.id}`] = post.title;
            textsToTranslate[`excerpt_${post.id}`] = post.excerpt.slice(0, 200);
          });

          const result = await translatePageContent(textsToTranslate);

          if (result) {
            batch.forEach(post => {
              cachedMap.set(post.id, {
                title: result[`title_${post.id}`] || post.title,
                excerpt: result[`excerpt_${post.id}`] || post.excerpt,
              });
            });
          }
        }

        setTranslatedPosts(cachedMap);
      } catch (err) {
        console.error('Batch translation error:', err);
      } finally {
        setIsTranslating(false);
      }
    };

    translatePosts();
  }, [postIdsKey, language, enabled, translatePageContent, posts]);

  return {
    translatedPosts,
    isTranslating,
  };
}
