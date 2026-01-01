import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, ChevronRight, Sparkles, Filter, User } from 'lucide-react';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getAllPosts, blogCategories, BlogPost, getCategoryInfo } from '@/lib/blog';
import { getAllCities } from '@/lib/cities';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const categoryInfo = getCategoryInfo(post.category);
  
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
            {categoryInfo?.emoji} {categoryInfo?.name}
          </Badge>
        </div>
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4">
            <Badge variant="deal" className="backdrop-blur-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              Öne Çıkan
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
            {format(parseISO(post.publishedAt), 'd MMMM yyyy', { locale: tr })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {post.readingTime} dk okuma
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
            Devamını Oku
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  
  const allPosts = getAllPosts();
  const cities = getAllCities();
  
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
    name: 'WooNomad Blog',
    description: 'Seyahat ipuçları, festival rehberleri ve destinasyon önerileri',
    url: 'https://woonomad.co/blog',
    publisher: {
      '@type': 'Organization',
      name: 'WooNomad',
      logo: 'https://woonomad.co/woonomad-logo.png'
    }
  };

  return (
    <>
      <Helmet>
        <title>Seyahat Blogu - Festival, Kültür ve Yaşam Tarzı | WooNomad</title>
        <meta 
          name="description" 
          content="En güncel seyahat ipuçları, festival rehberleri ve destinasyon önerileri. Dünya'nın dört bir yanından ilham verici hikayeler."
        />
        <link rel="canonical" href="https://woonomad.co/blog" />
        <meta property="og:title" content="Seyahat Blogu | WooNomad" />
        <meta property="og:description" content="Festival rehberleri, kültür yazıları ve seyahat ipuçları" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Breadcrumb 
            items={[
              { label: 'Ana Sayfa', href: '/' },
              { label: 'Blog' }
            ]}
          />
          
          {/* Hero Section */}
          <section className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Seyahat İlhamı</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Seyahat <span className="text-gradient">Blogu</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Festival rehberleri, kültür yazıları, dijital göçebe ipuçları ve daha fazlası. 
              Dünyayı keşfetmeye ilham veren hikayeler.
            </p>
          </section>
          
          {/* Filters */}
          <section className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="card-modern p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Blog yazılarında ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {blogCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                        selectedCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {category.emoji} {category.name}
                    </button>
                  ))}
                </div>
                
                {/* City Filter */}
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-border bg-background text-sm font-medium"
                >
                  <option value="all">Tüm Şehirler</option>
                  {cities.map(city => (
                    <option key={city.slug} value={city.slug}>{city.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>
          
          {/* Results Count */}
          <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>{filteredPosts.length} yazı bulundu</span>
          </div>
          
          {/* Blog Grid */}
          {filteredPosts.length > 0 ? (
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
              <h3 className="font-display font-semibold text-lg mb-2">Yazı bulunamadı</h3>
              <p className="text-muted-foreground">
                Farklı filtreler veya arama terimleri deneyebilirsiniz
              </p>
            </div>
          )}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-border py-8 mt-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} WooNomad. Tüm hakları saklıdır.
          </div>
        </footer>
      </div>
    </>
  );
}
