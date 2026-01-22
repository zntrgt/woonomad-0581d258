import { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Calendar, Clock, ChevronRight, Sparkles, Filter, User, Loader2, Edit, Languages } from 'lucide-react';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllPosts, blogCategories, BlogPost, getCategoryInfo } from '@/lib/blog';
import { getAllCities } from '@/lib/cities';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, parseISO } from 'date-fns';
import { tr as trLocale, enUS, de, fr, es, ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface BackendBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  city: string | null;
  image_url: string | null;
  created_at: string;
  published: boolean;
}

function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const { t, i18n } = useTranslation();
  const categoryInfo = getCategoryInfo(post.category);
  
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'en': return enUS;
      case 'de': return de;
      case 'fr': return fr;
      case 'es': return es;
      case 'ar': return ar;
      default: return trLocale;
    }
  };
  
  const getCategoryName = () => {
    const categoryKey = `blog.categories.${post.category}`;
    const translated = t(categoryKey);
    return translated !== categoryKey ? translated : categoryInfo?.name;
  };
  
  return (
    <Link 
      to={`/blog/${post.slug}`}
      className={cn(
        "group card-modern overflow-hidden",
        featured && "md:col-span-2 md:row-span-2"
      )}
    >
      {/* Cover Image */}
      <div className={cn(
        "relative overflow-hidden",
        featured ? "aspect-[16/9] md:aspect-[2/1]" : "aspect-video"
      )}>
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="popular" className="backdrop-blur-sm">
            {categoryInfo?.emoji} {getCategoryName()}
          </Badge>
        </div>
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4">
            <Badge variant="deal" className="backdrop-blur-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              {t('blog.featured')}
            </Badge>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5 md:p-6">
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {format(parseISO(post.publishedAt), 'd MMMM yyyy', { locale: getDateLocale() })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {post.readingTime} {t('blog.readTime')}
          </span>
        </div>
        
        {/* Title */}
        <h2 className={cn(
          "font-display font-bold text-foreground group-hover:text-primary transition-colors mb-3",
          featured ? "text-xl md:text-2xl" : "text-lg"
        )}>
          {post.title}
        </h2>
        
        {/* Excerpt */}
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {post.excerpt}
        </p>
        
        {/* Author & Read More */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {post.author.avatar ? (
              <img 
                src={post.author.avatar} 
                alt={post.author.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <span className="text-sm font-medium">{post.author.name}</span>
          </div>
          
          <span className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
            {t('blog.readMore')}
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Blog() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [backendPosts, setBackendPosts] = useState<BackendBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  
  const staticPosts = getAllPosts();
  const cities = getAllCities();
  
  const getCategoryTranslation = (categoryId: string) => {
    if (categoryId === 'all') return t('common.all');
    const categoryKey = `blog.categories.${categoryId}`;
    const translated = t(categoryKey);
    if (translated !== categoryKey) return translated;
    const cat = blogCategories.find(c => c.id === categoryId);
    return cat?.name || categoryId;
  };

  // Fetch backend posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setBackendPosts(data);
        }
      } catch (e) {
        console.error('Error fetching posts:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Combine backend posts with static posts (backend takes priority for matching slugs)
  const allPosts = useMemo(() => {
    const backendConverted: BlogPost[] = backendPosts.map(bp => ({
      id: bp.id,
      slug: bp.slug,
      title: bp.title,
      excerpt: bp.excerpt || '',
      content: bp.content,
      coverImage: bp.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop',
      category: (bp.category as BlogPost['category']) || 'travel-tips',
      citySlug: bp.city || undefined,
      author: { name: 'WooNomad Editör' },
      publishedAt: bp.created_at,
      readingTime: Math.ceil(bp.content.split(/\s+/).length / 200),
      tags: bp.category ? [bp.category] : [],
    }));

    // Merge: backend posts first, then static posts not in backend
    const backendSlugs = new Set(backendConverted.map(p => p.slug));
    const uniqueStaticPosts = staticPosts.filter(p => !backendSlugs.has(p.slug));
    
    return [...backendConverted, ...uniqueStaticPosts];
  }, [backendPosts, staticPosts]);
  
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }
      
      // Category filter
      if (selectedCategory !== 'all' && post.category !== selectedCategory) {
        return false;
      }
      
      // City filter
      if (selectedCity !== 'all') {
        if (post.citySlug !== selectedCity && !post.relatedCities?.includes(selectedCity)) {
          return false;
        }
      }
      
      return true;
    });
  }, [allPosts, searchQuery, selectedCategory, selectedCity]);
  
  const featuredPosts = filteredPosts.filter(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured);
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'WooNomad Seyahat Blogu - Dijital Göçebe, Festival ve Kültür Rehberi',
    description: 'Dijital göçebeler için kapsamlı seyahat rehberi. Festival haberleri, kültür yazıları, nomad şehir önerileri, coworking mekanları ve yaşam tarzı ipuçları. Avrupa, Asya ve dünyadan en iyi destinasyonlar.',
    url: 'https://woonomad.co/blog',
    inLanguage: 'tr-TR',
    publisher: {
      '@type': 'Organization',
      name: 'WooNomad',
      logo: {
        '@type': 'ImageObject',
        url: 'https://woonomad.co/woonomad-logo.png'
      }
    },
    blogPost: filteredPosts.slice(0, 10).map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAt,
      author: {
        '@type': 'Person',
        name: post.author.name
      },
      url: `https://woonomad.co/blog/${post.slug}`
    }))
  };

  return (
    <>
      <Helmet>
        <title>Seyahat Blogu - Dijital Göçebe Rehberi, Festival ve Kültür | WooNomad</title>
        <meta 
          name="description" 
          content="Dijital göçebeler için eksiksiz seyahat rehberi. En iyi nomad şehirleri, coworking alanları, festival haberleri, kültür yazıları ve yaşam tarzı ipuçları. Avrupa, Asya ve dünyadan ilham verici hikayeler."
        />
        <meta name="keywords" content="dijital göçebe, digital nomad, seyahat blogu, festival rehberi, nomad şehirleri, coworking, uzaktan çalışma, remote work, Avrupa seyahat, Asya seyahat" />
        <link rel="canonical" href="https://woonomad.co/blog" />
        <meta property="og:title" content="Seyahat Blogu - Dijital Göçebe Rehberi | WooNomad" />
        <meta property="og:description" content="Dijital göçebeler için kapsamlı seyahat rehberi. Festival haberleri, nomad şehirleri ve yaşam tarzı ipuçları." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://woonomad.co/blog" />
        <meta property="og:site_name" content="WooNomad" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Seyahat Blogu | WooNomad" />
        <meta name="twitter:description" content="Dijital göçebeler için kapsamlı seyahat rehberi ve festival haberleri." />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 pb-24 md:pb-8">
          <Breadcrumb 
            items={[
              { label: t('nav.home'), href: '/' },
              { label: t('blog.title') }
            ]}
          />
          
          {/* Hero Section */}
          <section className="text-center mb-8 md:mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
              <span>{t('blog.travelInspiration')}</span>
            </div>
            
            <h1 className="text-2xl md:text-5xl font-display font-bold text-foreground mb-3 md:mb-4">
              {t('blog.title')} <span className="text-gradient">{t('blog.subtitle')}</span>
            </h1>
            
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              {t('blog.subtitle')}
            </p>
            
            {isAdmin && (
              <Link to="/admin/blog" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  {t('blog.blogManagement')}
                </Button>
              </Link>
            )}
          </section>
          
          {/* Filters */}
          <section className="mb-6 md:mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="card-modern p-4 md:p-6">
              {/* Search - Always visible */}
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                    <Input
                      placeholder={t('blog.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 md:pl-10 text-sm"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setSearchQuery((q) => q.trim())}
                    className="shrink-0"
                  >
                    <Search className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">{t('common.search')}</span>
                  </Button>
                </div>
              
              {/* Category Filter - Horizontal scroll on mobile */}
              <div className="flex gap-4 items-start md:items-center flex-col md:flex-row">
                <div className="w-full md:w-auto overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                  <div className="flex gap-2 pb-2 md:pb-0 min-w-max md:flex-wrap">
                    {blogCategories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={cn(
                          "px-3 py-1.5 md:px-4 md:py-2 rounded-full md:rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap",
                          selectedCategory === category.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {category.emoji} {getCategoryTranslation(category.id)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* City Filter */}
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full md:w-auto px-3 py-2 rounded-xl border border-border bg-background text-xs md:text-sm font-medium"
                >
                  <option value="all">{t('blog.allCities')}</option>
                  {cities.map(city => (
                    <option key={city.slug} value={city.slug}>{city.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>
          
          {/* Results Count */}
          <div className="flex items-center gap-2 mb-4 md:mb-6 text-xs md:text-sm text-muted-foreground">
            <Filter className="h-3 w-3 md:h-4 md:w-4" />
            <span>
              {loading ? t('common.loading') : t('blog.postsFound', { count: filteredPosts.length })}
            </span>
          </div>
          
          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPosts.length > 0 ? (
            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Featured Posts */}
              {featuredPosts.map((post, index) => (
                <div 
                  key={post.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <BlogCard post={post} featured />
                </div>
              ))}
              
              {/* Regular Posts */}
              {regularPosts.map((post, index) => (
                <div 
                  key={post.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${(featuredPosts.length + index) * 0.05}s` }}
                >
                  <BlogCard post={post} />
                </div>
              ))}
            </section>
          ) : (
            <div className="text-center py-16">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="font-display font-semibold text-lg mb-2">{t('blog.noPostsFound')}</h3>
              <p className="text-muted-foreground">
                {t('blog.tryDifferentFilters')}
              </p>
            </div>
          )}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-border py-8 mt-16 mb-20 md:mb-0 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </>
  );
}
