import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface WidgetContainerProps {
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
  loadingText?: string;
  minHeight?: string;
}

export function WidgetContainer({
  children,
  className,
  isLoading = false,
  loadingText = 'Widget yükleniyor...',
  minHeight = '300px',
}: WidgetContainerProps) {
  return (
    <div
      className={cn(
        'relative w-full rounded-xl overflow-hidden bg-card border border-border',
        className
      )}
      style={{ minHeight }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <span className="text-sm text-muted-foreground">{loadingText}</span>
        </div>
      )}
      {children}
    </div>
  );
}

// Widget fallback component
export function WidgetFallback({
  title,
  description,
  actionUrl,
  actionText,
}: {
  title: string;
  description: string;
  actionUrl: string;
  actionText: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-lg font-medium text-foreground mb-2">{title}</p>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <a
        href={actionUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        {actionText}
      </a>
    </div>
  );
}
