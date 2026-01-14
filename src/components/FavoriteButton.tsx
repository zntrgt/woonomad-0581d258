import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserFavorites, Favorite } from '@/hooks/useUserFavorites';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  type: Favorite['favorite_type'];
  slug: string;
  name: string;
  data?: Record<string, unknown>;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  className?: string;
}

export function FavoriteButton({
  type,
  slug,
  name,
  data = {},
  size = 'md',
  variant = 'icon',
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, loading } = useUserFavorites();
  const { user } = useAuth();
  
  const isFav = isFavorite(type, slug);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(type, slug, name, data);
  };

  if (!user) {
    return null;
  }

  if (variant === 'button') {
    return (
      <Button
        variant={isFav ? 'default' : 'outline'}
        size="sm"
        onClick={handleClick}
        disabled={loading}
        className={cn('gap-2', className)}
      >
        <Heart
          className={cn(iconSizes[size], isFav && 'fill-current')}
        />
        {isFav ? 'Favorilerde' : 'Favorilere Ekle'}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        sizeClasses[size],
        'rounded-full hover:bg-primary/10',
        isFav && 'text-red-500',
        className
      )}
      aria-label={isFav ? 'Favorilerden kaldır' : 'Favorilere ekle'}
    >
      <Heart
        className={cn(iconSizes[size], isFav && 'fill-current')}
      />
    </Button>
  );
}
