import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, User, ChevronRight, Plane, MapPin, Share2, ArrowLeft, Tag } from 'lucide-react';
import DOMPurify from 'dompurify';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HotelWidget } from '@/components/HotelWidget';
import { getPostBySlug, getRelatedPosts, getCategoryInfo, BlogPost as BlogPostType } from '@/lib/blog';
import { getCityBySlug, CityInfo } from '@/lib/cities';
import { getCountryFlag } from '@/lib/destinations';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Widget: Related City Card
function CityWidget({ citySlug }: { citySlug: string }) {
  const city = getCityBySlug(citySlug);
  if (!city) return null;
  
  return (
    <div className="card-modern p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold">İlgili Şehir</h3>
      </div>
      
      <Link 
        to={`/sehir/${city.slug}`}
        className="flex items-center gap-4 group"
      >
        <span className="text-4xl">{getCountryFlag(city.countryCode)}</span>
        <div>
          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {city.name}
          </div>
          <div className="text-sm text-muted-foreground">{city.country}</div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </Link>
    </div>
  );
}

// Widget: Flight Search
function FlightSearchWidget({ cityName, citySlug }: { cityName: string; citySlug: string }) {
  return (
    <div className="card-modern p-5 mb-6 gradient-primary text-primary-foreground">
      <div className="flex items-center gap-2 mb-4">
        <Plane className="h-5 w-5" />
        <h3 className="font-display font-semibold">Uçuş Ara</h3>
      </div>
      
      <p className="text-sm opacity-90 mb-4">
        {cityName} için en uygun uçak bileti fiyatlarını karşılaştırın
      </p>
      
      <Link to={`/sehir/${citySlug}/ucak-bileti`}>
        <Button variant="secondary" className="w-full">
          <Plane className="h-4 w-4 mr-2" />
          {cityName} Uçuşlarını Ara
        </Button>
      </Link>
    </div>
  );
}

// HotelsWidget is now replaced by HotelWidget component from @/components/HotelWidget

// Related Post Card
function RelatedPostCard({ post }: { post: BlogPostType }) {
  const categoryInfo = getCategoryInfo(post.category);
  
  return (
    <Link 
      to={`/blog/${post.slug}`}
      className="card-modern overflow-hidden group"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <Badge variant="outline" className="mb-2 text-xs">
          {categoryInfo?.emoji} {categoryInfo?.name}
        </Badge>
        <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h4>
      </div>
    </Link>
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  
  if (!post) {
    return <Navigate to="/blog" replace />;
  }
  
  const relatedPosts = getRelatedPosts(post, 3);
  const categoryInfo = getCategoryInfo(post.category);
  const city = post.citySlug ? getCityBySlug(post.citySlug) : undefined;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'WooNomad',
      logo: {
        '@type': 'ImageObject',
        url: 'https://woonomad.co/woonomad-logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://woonomad.co/blog/${post.slug}`
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Parse markdown-like content to HTML with inline widgets
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    const totalLines = lines.length;
    const insertWidgetAfterLine = Math.floor(totalLines * 0.4); // Insert widget at ~40% of content
    let widgetInserted = false;

    lines.forEach((line, index) => {
      // Headers
      if (line.startsWith('### ')) {
        elements.push(<h3 key={index} className="text-lg font-display font-semibold mt-8 mb-3 text-foreground">{line.slice(4)}</h3>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={index} className="text-xl font-display font-bold mt-10 mb-4 text-foreground">{line.slice(3)}</h2>);
      } else if (line.startsWith('# ')) {
        elements.push(<h1 key={index} className="text-2xl font-display font-bold mt-8 mb-4 text-foreground">{line.slice(2)}</h1>);
      }
      // List items
      else if (line.startsWith('- ')) {
        elements.push(
          <li key={index} className="flex items-start gap-2 mb-2">
            <span className="text-primary mt-1">•</span>
            <span dangerouslySetInnerHTML={{ __html: formatInlineText(line.slice(2)) }} />
          </li>
        );
      }
      // Numbered list
      else if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+)\.\s(.*)$/);
        if (match) {
          elements.push(
            <li key={index} className="flex items-start gap-3 mb-2">
              <span className="font-semibold text-primary min-w-[1.5rem]">{match[1]}.</span>
              <span dangerouslySetInnerHTML={{ __html: formatInlineText(match[2]) }} />
            </li>
          );
        }
      }
      // Regular paragraph
      else if (line.trim()) {
        elements.push(
          <p key={index} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineText(line) }} />
        );
      }

      // Insert inline hotel widget after ~40% of content (only if city exists)
      if (!widgetInserted && index >= insertWidgetAfterLine && city) {
        elements.push(
          <HotelWidget 
            key={`hotel-widget-${index}`} 
            cityName={city.name} 
            citySlug={city.slug} 
            variant="inline" 
          />
        );
        widgetInserted = true;
      }
    });

    return elements;
  };

  // Format bold text with XSS sanitization
  const formatInlineText = (text: string) => {
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Sanitize to prevent XSS attacks
    return DOMPurify.sanitize(formatted, {
      ALLOWED_TAGS: ['strong', 'em', 'a'],
      ALLOWED_ATTR: ['href', 'class', 'target', 'rel']
    });
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | WooNomad Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://woonomad.co/blog/${post.slug}`} />
        
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.coverImage} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:author" content={post.author.name} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.coverImage} />
        
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Cover Image */}
        <div className="relative h-[35vh] md:h-[50vh] overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        
        <main className="max-w-7xl mx-auto px-4 -mt-24 md:-mt-32 relative z-10 pb-20 md:pb-0">
          <div className="grid lg:grid-cols-[1fr_320px] gap-6 lg:gap-8">
            {/* Main Content */}
            <article className="card-modern p-4 md:p-8 lg:p-10">
              <Breadcrumb 
                items={[
                  { label: 'Ana Sayfa', href: '/' },
                  { label: 'Blog', href: '/blog' },
                  { label: post.title }
                ]}
              />
              
              {/* Category & Meta */}
              <div className="flex flex-wrap items-center gap-3 mt-6 mb-4">
                <Badge variant="popular">
                  {categoryInfo?.emoji} {categoryInfo?.name}
                </Badge>
                {city && (
                  <Badge variant="outline">
                    {getCountryFlag(city.countryCode)} {city.name}
                  </Badge>
                )}
              </div>
              
              {/* Title */}
              <h1 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-6">
                {post.title}
              </h1>
              
              {/* Author & Date */}
              <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-border mb-8">
                <div className="flex items-center gap-3">
                  {post.author.avatar ? (
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{post.author.name}</div>
                    {post.author.bio && (
                      <div className="text-sm text-muted-foreground">{post.author.bio}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {format(parseISO(post.publishedAt), 'd MMMM yyyy', { locale: tr })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {post.readingTime} dk
                  </span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleShare}
                  className="ml-auto"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Paylaş
                </Button>
              </div>
              
              {/* Content */}
              <div className="prose prose-lg max-w-none text-muted-foreground">
                {renderContent(post.content)}
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-border">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {post.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              {/* Back to Blog */}
              <div className="mt-8">
                <Link to="/blog">
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Tüm Yazılar
                  </Button>
                </Link>
              </div>
            </article>
            
            {/* Sidebar */}
            <aside className="space-y-6 hidden lg:block">
              {/* City Widget */}
              {city && <CityWidget citySlug={city.slug} />}
              
              {/* Flight Search Widget */}
              {city && <FlightSearchWidget cityName={city.name} citySlug={city.slug} />}
              
              {/* Hotels Widget - Trip.com Affiliate */}
              {city && <HotelWidget cityName={city.name} citySlug={city.slug} variant="sidebar" />}
              
              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="card-modern p-5">
                  <h3 className="font-display font-semibold mb-4">İlgili Yazılar</h3>
                  <div className="space-y-4">
                    {relatedPosts.map(relatedPost => (
                      <RelatedPostCard key={relatedPost.id} post={relatedPost} />
                    ))}
                  </div>
                </div>
              )}
            </aside>

            {/* Mobile Widgets - below content */}
            <aside className="lg:hidden space-y-4 mt-8">
              {city && <HotelWidget cityName={city.name} citySlug={city.slug} variant="compact" />}
              {city && (
                <Link to={`/sehir/${city.slug}/ucak-bileti`} className="block">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Plane className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{city.name} Uçuşları</div>
                      <div className="text-xs text-muted-foreground">En ucuz fiyatları bul</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              )}
            </aside>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-border py-8 mt-16 mb-20 md:mb-0 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} WooNomad. Tüm hakları saklıdır.
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </>
  );
}
