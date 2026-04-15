import { useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Travelpayouts Generic iFrame Embed ───────────────────────
// Kullanım: flights, hotels, car rental vb. iFrame widget'ları için
// Travelpayouts marker: 261144

interface TravelpayoutsEmbedProps {
  /** iFrame src URL (Travelpayouts widget URL) */
  src: string;
  /** Widget yüksekliği (px). Varsayılan: 450 */
  height?: number;
  /** Widget başlığı (erişilebilirlik için) */
  title?: string;
  className?: string;
}

export function TravelpayoutsEmbed({
  src,
  height = 450,
  title = 'Travelpayouts Widget',
  className = '',
}: TravelpayoutsEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative w-full ${className}`} style={{ height }}>
      {!isLoaded && (
        <div className="absolute inset-0 space-y-2 p-1">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-16 w-3/4 rounded-lg" />
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        width="100%"
        height={height}
        frameBorder="0"
        scrolling="no"
        onLoad={() => setIsLoaded(true)}
        className={`w-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ border: 'none' }}
      />
    </div>
  );
}
