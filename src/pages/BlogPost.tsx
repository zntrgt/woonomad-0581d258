import { useParams, Link, Navigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, User, ChevronRight, Plane, MapPin, Share2, ArrowLeft, Tag, List, RefreshCcw, BookOpen, Edit } from 'lucide-react';
import DOMPurify from 'dompurify';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HotelWidget } from '@/components/HotelWidget';
import { BlogCountdown, parseCountdownFromHtml } from '@/components/BlogCountdown';
import { getPostBySlug, getRelatedPosts, getCategoryInfo, BlogPost as BlogPostType, getAllPosts } from '@/lib/blog';
import { getCityBySlug, CityInfo, getAllCities } from '@/lib/cities';
import { getCountryFlag } from '@/lib/destinations';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
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
  updated_at: string;
  published: boolean;
}

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

// Widget: Related Cities from content
function RelatedCitiesWidget({ cities }: { cities: CityInfo[] }) {
  if (cities.length === 0) return null;
  
  return (
    <div className="card-modern p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold">İlgili Şehirler</h3>
      </div>
      
      <div className="space-y-2">
        {cities.slice(0, 5).map(city => (
          <Link 
            key={city.slug}
            to={`/sehir/${city.slug}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
          >
            <span className="text-xl">{getCountryFlag(city.countryCode)}</span>
            <div className="flex-1">
              <div className="text-sm font-medium group-hover:text-primary transition-colors">{city.name}</div>
              <div className="text-xs text-muted-foreground">{city.country}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}

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

// Table of Contents Component
function TableOfContents({ headings }: { headings: { id: string; text: string; level: number }[] }) {
  if (headings.length === 0) return null;
  
  return (
    <nav className="card-modern p-5 mb-8" aria-label="İçindekiler">
      <div className="flex items-center gap-2 mb-4">
        <List className="h-5 w-5 text-primary" />
        <h2 className="font-display font-semibold">İçindekiler</h2>
      </div>
      
      <ol className="space-y-2 text-sm">
        {headings.map((heading, index) => (
          <li 
            key={heading.id}
            className={cn(
              "hover:text-primary transition-colors",
              heading.level === 3 && "ml-4"
            )}
          >
            <a href={`#${heading.id}`} className="flex items-start gap-2">
              <span className="text-muted-foreground">{index + 1}.</span>
              <span>{heading.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Author Box Component
function AuthorBox({ author, dateModified }: { author: { name: string; avatar?: string; bio?: string }; dateModified?: string }) {
  return (
    <div className="card-modern p-6 mb-8 bg-muted/30">
      <div className="flex items-start gap-4">
        {author.avatar ? (
          <img 
            src={author.avatar} 
            alt={author.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1">
          <div className="font-semibold text-lg">{author.name}</div>
          {author.bio && (
            <div className="text-sm text-muted-foreground mt-1">{author.bio}</div>
          )}
          {dateModified && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
              <RefreshCcw className="h-3 w-3" />
              <span>Son güncelleme: {format(parseISO(dateModified), 'd MMMM yyyy', { locale: tr })}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// FAQ Section Component
function FAQSection({ faqs }: { faqs: { question: string; answer: string }[] }) {
  if (faqs.length === 0) return null;
  
  return (
    <section className="mt-10 pt-6 border-t border-border">
      <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        Sıkça Sorulan Sorular
      </h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="card-modern p-5">
            <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [backendPost, setBackendPost] = useState<BackendBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  
  const staticPost = slug ? getPostBySlug(slug) : undefined;
  const allCities = getAllCities();
  
  // Fetch from database
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();
        
        if (!error && data) {
          setBackendPost(data);
        }
      } catch (e) {
        console.error('Error fetching post:', e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);
  
  // Convert backend post to BlogPostType format
  const post: BlogPostType | undefined = useMemo(() => {
    if (backendPost) {
      return {
        id: backendPost.id,
        slug: backendPost.slug,
        title: backendPost.title,
        excerpt: backendPost.excerpt || '',
        content: backendPost.content,
        coverImage: backendPost.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop',
        category: (backendPost.category as BlogPostType['category']) || 'travel-tips',
        citySlug: backendPost.city || undefined,
        author: { name: 'WooNomad Editör', bio: 'Seyahat ve dijital göçebe yaşam uzmanı' },
        publishedAt: backendPost.created_at,
        updatedAt: backendPost.updated_at,
        readingTime: Math.ceil(backendPost.content.split(/\s+/).length / 200),
        tags: backendPost.category ? [backendPost.category] : [],
      };
    }
    return staticPost;
  }, [backendPost, staticPost]);
  
  // Extract headings for TOC
  const headings = useMemo(() => {
    if (!post) return [];
    
    const lines = post.content.split('\n');
    const extractedHeadings: { id: string; text: string; level: number }[] = [];
    
    lines.forEach((line, index) => {
      if (line.startsWith('## ')) {
        const text = line.slice(3).trim();
        const id = `heading-${index}`;
        extractedHeadings.push({ id, text, level: 2 });
      } else if (line.startsWith('### ')) {
        const text = line.slice(4).trim();
        const id = `heading-${index}`;
        extractedHeadings.push({ id, text, level: 3 });
      }
    });
    
    return extractedHeadings;
  }, [post]);
  
  // Extract FAQs from content (### headers followed by content)
  const faqs = useMemo(() => {
    if (!post) return [];
    
    const faqPatterns = [
      /###\s*(.+\?)\s*\n([\s\S]*?)(?=###|##|$)/g,
    ];
    
    const extractedFaqs: { question: string; answer: string }[] = [];
    
    for (const pattern of faqPatterns) {
      let match;
      while ((match = pattern.exec(post.content)) !== null) {
        const question = match[1].trim();
        const answer = match[2].trim().slice(0, 500);
        if (question && answer && question.includes('?')) {
          extractedFaqs.push({ question, answer });
        }
      }
    }
    
    return extractedFaqs.slice(0, 8);
  }, [post]);
  
  // Extract related cities from content
  const relatedCities = useMemo(() => {
    if (!post) return [];
    
    const contentLower = post.content.toLowerCase();
    return allCities.filter(city => 
      contentLower.includes(city.name.toLowerCase()) ||
      contentLower.includes(city.slug.toLowerCase())
    ).slice(0, 5);
  }, [post, allCities]);
  
  // Parse countdown from content
  const countdownData = useMemo(() => {
    if (!post) return null;
    return parseCountdownFromHtml(post.content);
  }, [post]);
  
  // Show loading state
  if (loading && !staticPost) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!post) {
    return <Navigate to="/blog" replace />;
  }
  
  const relatedPosts = getRelatedPosts(post, 3);
  const categoryInfo = getCategoryInfo(post.category);
  const city = post.citySlug ? getCityBySlug(post.citySlug) : undefined;
  
  // Generate SEO-optimized title and description
  const seoTitle = post.title.length > 60 
    ? post.title.slice(0, 57) + '...' 
    : post.title;
  
  const seoDescription = post.excerpt.length > 160
    ? post.excerpt.slice(0, 157) + '...'
    : post.excerpt || `${post.title} hakkında kapsamlı rehber. 2026 güncel bilgiler, ipuçları ve öneriler.`;
  
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
      description: post.author.bio
    },
    publisher: {
      '@type': 'Organization',
      name: 'WooNomad',
      logo: {
        '@type': 'ImageObject',
        url: 'https://woonomad.lovable.app/woonomad-logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://woonomad.lovable.app/blog/${post.slug}`
    },
    keywords: post.tags.join(', '),
    articleSection: categoryInfo?.name || 'Seyahat',
    inLanguage: 'tr-TR',
    wordCount: post.content.split(/\s+/).length,
    ...(city && {
      about: {
        '@type': 'City',
        name: city.name,
        containedInPlace: {
          '@type': 'Country',
          name: city.country
        }
      }
    })
  };
  
  // Breadcrumb structured data
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Ana Sayfa',
        item: 'https://woonomad.lovable.app/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://woonomad.lovable.app/blog'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://woonomad.lovable.app/blog/${post.slug}`
      }
    ]
  };

  // FAQ structured data
  const faqData = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  } : null;

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

  // Parse markdown-like content to HTML with inline widgets, tables, and heading IDs
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    const totalLines = lines.length;
    const insertWidgetAfterLine = Math.floor(totalLines * 0.4);
    let widgetInserted = false;
    let headingIndex = 0;
    let inTable = false;
    let tableRows: string[][] = [];
    let tableHeaders: string[] = [];

    const flushTable = () => {
      if (tableRows.length > 0 || tableHeaders.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="overflow-x-auto my-6">
            <table className="w-full border-collapse text-sm">
              {tableHeaders.length > 0 && (
                <thead>
                  <tr className="bg-muted">
                    {tableHeaders.map((header, i) => (
                      <th key={i} className="border border-border px-4 py-2 text-left font-semibold text-foreground">
                        {header.trim()}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {tableRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-border px-4 py-2 text-muted-foreground">
                        <span dangerouslySetInnerHTML={{ __html: formatInlineText(cell.trim()) }} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        tableHeaders = [];
        inTable = false;
      }
    };

    lines.forEach((line, index) => {
      // Check for table rows (lines containing |)
      if (line.includes('|') && line.trim().startsWith('|')) {
        const cells = line.split('|').filter(cell => cell.trim() !== '');
        
        // Check if this is a separator row (|---|---|)
        if (cells.every(cell => /^[\s-:]+$/.test(cell))) {
          // Skip separator row but mark as in table
          inTable = true;
          return;
        }
        
        if (!inTable && tableHeaders.length === 0) {
          // First row is header
          tableHeaders = cells;
          inTable = true;
        } else {
          // Data row
          tableRows.push(cells);
        }
        return;
      } else if (inTable) {
        // End of table, flush it
        flushTable();
      }

      // Checklist items (- [ ] or - [x])
      if (line.match(/^-\s*\[([ x])\]\s*/)) {
        const isChecked = line.includes('[x]');
        const text = line.replace(/^-\s*\[[ x]\]\s*/, '');
        elements.push(
          <div key={index} className="flex items-start gap-3 mb-2">
            <span className={`mt-1 w-4 h-4 rounded border flex items-center justify-center text-xs ${isChecked ? 'bg-primary border-primary text-primary-foreground' : 'border-border'}`}>
              {isChecked ? '✓' : ''}
            </span>
            <span className={isChecked ? 'line-through text-muted-foreground' : ''} dangerouslySetInnerHTML={{ __html: formatInlineText(text) }} />
          </div>
        );
        return;
      }

      // Headers with IDs for anchor links
      if (line.startsWith('### ')) {
        const text = line.slice(4);
        const id = `heading-${index}`;
        elements.push(
          <h3 key={index} id={id} className="text-lg font-display font-semibold mt-8 mb-3 text-foreground scroll-mt-20">
            {text}
          </h3>
        );
        headingIndex++;
      } else if (line.startsWith('## ')) {
        const text = line.slice(3);
        const id = `heading-${index}`;
        elements.push(
          <h2 key={index} id={id} className="text-xl font-display font-bold mt-10 mb-4 text-foreground scroll-mt-20">
            {text}
          </h2>
        );
        headingIndex++;
      } else if (line.startsWith('# ')) {
        elements.push(<h1 key={index} className="text-2xl font-display font-bold mt-8 mb-4 text-foreground">{line.slice(2)}</h1>);
      }
      // Blockquote
      else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={index} className="border-l-4 border-primary pl-4 py-2 my-4 italic text-muted-foreground bg-muted/30 rounded-r-lg">
            <span dangerouslySetInnerHTML={{ __html: formatInlineText(line.slice(2)) }} />
          </blockquote>
        );
      }
      // Italic note (*Note: or *Fiyatlar)
      else if (line.startsWith('*') && !line.startsWith('**') && line.endsWith('*')) {
        elements.push(
          <p key={index} className="text-sm italic text-muted-foreground my-2">
            {line.slice(1, -1)}
          </p>
        );
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

    // Flush any remaining table
    flushTable();

    return elements;
  };

  // Format bold text with XSS sanitization and internal linking
  const formatInlineText = (text: string) => {
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Add internal links for city names
    allCities.forEach(city => {
      const regex = new RegExp(`\\b${city.name}\\b(?![^<]*>)`, 'gi');
      formatted = formatted.replace(regex, `<a href="/sehir/${city.slug}" class="text-primary hover:underline">${city.name}</a>`);
    });
    
    // Sanitize to prevent XSS attacks
    return DOMPurify.sanitize(formatted, {
      ALLOWED_TAGS: ['strong', 'em', 'a'],
      ALLOWED_ATTR: ['href', 'class', 'target', 'rel']
    });
  };

  return (
    <>
      <Helmet>
        <title>{seoTitle} | WooNomad Blog</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <link rel="canonical" href={`https://woonomad.lovable.app/blog/${post.slug}`} />
        
        <meta property="og:title" content={`${post.title} | WooNomad`} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={post.coverImage} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://woonomad.lovable.app/blog/${post.slug}`} />
        <meta property="og:site_name" content="WooNomad" />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:modified_time" content={post.updatedAt || post.publishedAt} />
        <meta property="article:author" content={post.author.name} />
        <meta property="article:section" content={categoryInfo?.name} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={post.coverImage} />
        
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbData)}</script>
        {faqData && <script type="application/ld+json">{JSON.stringify(faqData)}</script>}
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
                  <Link to={`/sehir/${city.slug}`}>
                    <Badge variant="outline" className="hover:bg-primary/10 transition-colors">
                      {getCountryFlag(city.countryCode)} {city.name}
                    </Badge>
                  </Link>
                )}
              </div>
              
              {/* Title - H1 */}
              <h1 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-6">
                {post.title}
              </h1>
              
              {/* Author Box with E-E-A-T signals */}
              <AuthorBox 
                author={post.author} 
                dateModified={post.updatedAt || post.publishedAt}
              />
              
              {/* Quick Meta Bar */}
              <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-border mb-8">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {format(parseISO(post.publishedAt), 'd MMMM yyyy', { locale: tr })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {post.readingTime} dk okuma
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    {post.content.split(/\s+/).length} kelime
                  </span>
                </div>
                
                <div className="flex items-center gap-2 ml-auto">
                  {isAdmin && (
                    <Link to={`/admin/blog?edit=${slug}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Paylaş
                  </Button>
                </div>
              </div>
              
              {/* Table of Contents */}
              {headings.length >= 3 && (
                <TableOfContents headings={headings} />
              )}
              
              {/* Countdown Widget if present */}
              {countdownData && (
                <BlogCountdown 
                  targetDate={countdownData.targetDate}
                  title={countdownData.title}
                  links={countdownData.links}
                />
              )}
              
              {/* Content */}
              <div className="prose prose-lg max-w-none text-muted-foreground">
                {renderContent(post.content)}
              </div>
              
              {/* FAQ Section */}
              {faqs.length > 0 && <FAQSection faqs={faqs} />}
              
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
              
              {/* Related Cities from Content */}
              {!city && relatedCities.length > 0 && (
                <RelatedCitiesWidget cities={relatedCities} />
              )}
              
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
              
              {/* Related Cities on Mobile */}
              {relatedCities.length > 0 && (
                <div className="card-modern p-4">
                  <h3 className="font-semibold text-sm mb-3">İlgili Şehirler</h3>
                  <div className="flex flex-wrap gap-2">
                    {relatedCities.slice(0, 4).map(c => (
                      <Link 
                        key={c.slug}
                        to={`/sehir/${c.slug}`}
                        className="text-xs bg-muted px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors"
                      >
                        {getCountryFlag(c.countryCode)} {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
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
