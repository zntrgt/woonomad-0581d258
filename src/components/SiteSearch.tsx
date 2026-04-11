import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Plane, Building2, Hotel, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getAllCities, CityInfo } from '@/lib/cities';
import { generateFlightRoutes } from '@/lib/flightRoutes';

interface SearchResult {
  type: 'city' | 'route' | 'hotel' | 'page';
  title: string;
  subtitle?: string;
  href: string;
  icon: React.ReactNode;
}

const staticPages = [
  { title: 'Ana Sayfa', href: '/', keywords: ['ana', 'home', 'anasayfa'] },
  { title: 'Şehirler', href: '/sehirler', keywords: ['şehir', 'city', 'destinasyon'] },
  { title: 'Uçuş Rotaları', href: '/ucuslar', keywords: ['uçuş', 'rota', 'flight'] },
  { title: 'Oteller', href: '/oteller', keywords: ['otel', 'hotel', 'konaklama'] },
  { title: 'Blog', href: '/blog', keywords: ['blog', 'yazı', 'haber'] },
];

export function SiteSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const cities = getAllCities();
  const routes = generateFlightRoutes();

  // Keyboard shortcut: Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const searchContent = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const q = searchQuery.toLowerCase().trim();
    const found: SearchResult[] = [];

    // Search cities
    cities.forEach((city: CityInfo) => {
      if (
        city.name.toLowerCase().includes(q) ||
        city.nameEn.toLowerCase().includes(q) ||
        city.country.toLowerCase().includes(q) ||
        city.airportCodes.some(code => code.toLowerCase().includes(q))
      ) {
        found.push({
          type: 'city',
          title: city.name,
          subtitle: `${city.country} • ${city.airportCodes.join(', ')}`,
          href: `/sehir/${city.slug}`,
          icon: <Building2 className="w-4 h-4" />
        });
        // Also add hotel result
        found.push({
          type: 'hotel',
          title: `${city.name} Otelleri`,
          subtitle: city.country,
          href: `/sehir/${city.slug}/oteller`,
          icon: <Hotel className="w-4 h-4" />
        });
      }
    });

    // Search routes
    routes.forEach((route) => {
      const searchStr = `${route.originCity} ${route.destinationCity} ${route.originCode} ${route.destinationCode}`.toLowerCase();
      if (searchStr.includes(q)) {
        found.push({
          type: 'route',
          title: `${route.originCity} → ${route.destinationCity}`,
          subtitle: `${route.originCode} - ${route.destinationCode}`,
          href: `/ucus/${route.slug}`,
          icon: <Plane className="w-4 h-4" />
        });
      }
    });

    // Search static pages
    staticPages.forEach((page) => {
      if (
        page.title.toLowerCase().includes(q) ||
        page.keywords.some(k => k.includes(q))
      ) {
        found.push({
          type: 'page',
          title: page.title,
          href: page.href,
          icon: <MapPin className="w-4 h-4" />
        });
      }
    });

    // Limit results
    setResults(found.slice(0, 10));
  }, [cities, routes]);

  useEffect(() => {
    const timer = setTimeout(() => searchContent(query), 200);
    return () => clearTimeout(timer);
  }, [query, searchContent]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.href);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Search Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Ara...</span>
        <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-2xs font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </Button>

      {/* Mobile Search Icon */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="md:hidden"
        aria-label="Ara"
      >
        <Search className="w-5 h-5" />
      </Button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="sr-only">Site İçi Arama</DialogTitle>
          </DialogHeader>
          <div className="relative p-4 pt-0">
            <Search className="absolute left-7 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Şehir, uçuş rotası veya sayfa ara..."
              className="pl-10 pr-10"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-5 top-1 h-8 w-8"
                onClick={() => setQuery('')}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-[300px] overflow-y-auto border-t border-border">
            {results.length > 0 ? (
              <ul className="py-2">
                {results.map((result, i) => (
                  <li key={`${result.href}-${i}`}>
                    <button
                      onClick={() => handleSelect(result)}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors text-left"
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {result.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{result.title}</p>
                        {result.subtitle && (
                          <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : query ? (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>"{query}" için sonuç bulunamadı</p>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p className="text-sm">Şehir, havalimanı kodu veya rota arayın</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
