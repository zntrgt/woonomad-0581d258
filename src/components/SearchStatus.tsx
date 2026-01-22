import { useState, useEffect, useRef } from 'react';
import { Loader2, CheckCircle, AlertCircle, Info, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type SearchState = 'idle' | 'loading' | 'success' | 'no-results' | 'error';

interface SearchStatusProps {
  state: SearchState;
  resultsCount?: number;
  errorMessage?: string;
  onScrollToResults?: () => void;
  className?: string;
}

export function SearchStatus({ 
  state, 
  resultsCount = 0, 
  errorMessage,
  onScrollToResults,
  className 
}: SearchStatusProps) {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    if (state === 'success' && resultsCount > 0) {
      setShowScrollButton(true);
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => setShowScrollButton(false), 10000);
      return () => clearTimeout(timer);
    } else {
      setShowScrollButton(false);
    }
  }, [state, resultsCount]);

  const getStatusContent = () => {
    switch (state) {
      case 'idle':
        return (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Info className="h-4 w-4" />
            <span className="text-sm">Tarih ve yolcu seçip arayın.</span>
          </div>
        );
      case 'loading':
        return (
          <div className="flex items-center gap-2 text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Uçuşlar aranıyor…</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{resultsCount} sonuç bulundu</span>
            </div>
            {showScrollButton && onScrollToResults && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onScrollToResults}
                className="gap-1"
              >
                <ArrowDown className="h-3 w-3" />
                Sonuçlara git
              </Button>
            )}
          </div>
        );
      case 'no-results':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-warning">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Bu kriterlerde sonuç bulunamadı.</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Tarihleri değiştirin veya yakın havalimanlarını deneyin.
            </p>
          </div>
        );
      case 'error':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Arama sırasında hata oluştu.</span>
            </div>
            {errorMessage && (
              <p className="text-xs text-muted-foreground">{errorMessage}</p>
            )}
            <p className="text-xs text-muted-foreground">Lütfen tekrar deneyin.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={cn("transition-all duration-300", className)}>
      <CardContent className="py-3 px-4">
        {getStatusContent()}
      </CardContent>
    </Card>
  );
}

// Sticky scroll-to-results button
interface StickyScrollButtonProps {
  visible: boolean;
  onClick: () => void;
}

export function StickyScrollButton({ visible, onClick }: StickyScrollButtonProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <Button 
        onClick={onClick}
        className="shadow-lg gap-2"
      >
        <ArrowDown className="h-4 w-4" />
        Sonuçlara git
      </Button>
    </div>
  );
}

// Skeleton loader for flight results
export function FlightResultsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-3 w-32 bg-muted rounded" />
              </div>
              <div className="h-6 w-20 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Telemetry helper (silent in production)
const isDev = import.meta.env.DEV;

export const flightSearchTelemetry = {
  submitted: (_params: object) => {
    if (isDev) console.log('[Telemetry] flight_search_submitted');
  },
  success: (_resultsCount: number) => {
    // Silent in production
  },
  noResults: () => {
    // Silent in production
  },
  error: (error: string) => {
    if (isDev) console.error('[Telemetry] flight_search_error', { error });
  },
};
