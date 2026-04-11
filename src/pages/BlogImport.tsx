import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const BlogImport = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImport = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const posts = JSON.parse(jsonInput);
      const arr = Array.isArray(posts) ? posts : [posts];

      for (const post of arr) {
        const row: any = {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content || '',
          category: post.category || 'travel-tips',
          city: post.city || null,
          image_url: post.image_url || null,
          language: post.language || 'tr',
          status: post.published ? 'published' : 'draft',
          published: post.published ?? false,
          meta_title: post.meta_title || post.title,
          meta_description: post.meta_description || post.excerpt || '',
          og_title: post.og_title || post.title,
          og_description: post.og_description || post.excerpt || '',
          faq_items: post.faq_items || [],
          key_takeaways: post.key_takeaways || [],
          cta_json: post.cta_json || {},
          translations: post.translations || {},
          published_at: post.published ? new Date().toISOString() : null,
        };

       const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug' });
        if (error) throw new Error(`"${post.title}": ${error.message}`);
      }

      setStatus(`${arr.length} yazı başarıyla eklendi.`);
      setJsonInput('');
    } catch (err: any) {
      setStatus(`Hata: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Toplu JSON İçe Aktarma</h1>
          <button
            onClick={() => navigate('/admin/blog')}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            ← Blog Yönetimi
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blog JSON yapıştır (tekli veya array):
          </label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={20}
            className="w-full border border-gray-300 rounded-lg p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder={`[
  {
    "title": "Yazı Başlığı",
    "slug": "yazi-basligi",
    "excerpt": "Kısa açıklama...",
    "content": "# Markdown içerik...",
    "category": "travel-tips",
    "city": "lizbon",
    "published": true
  }
]`}
          />
        </div>

        {status && (
          <div className={`p-4 rounded-lg mb-4 ${status.startsWith('Hata') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {status}
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={loading || !jsonInput.trim()}
          className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          {loading ? 'İçe aktarılıyor...' : 'İçe Aktar'}
        </button>
      </div>
    </div>
  );
};

export default BlogImport;
