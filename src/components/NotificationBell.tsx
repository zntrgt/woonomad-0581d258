import { useState } from 'react';
import { Bell, BellOff, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface NotificationBellProps {
  citySlugs?: string[];
  routeKeys?: string[];
  className?: string;
}

export function NotificationBell({ 
  citySlugs = [], 
  routeKeys = [],
  className 
}: NotificationBellProps) {
  const { user } = useAuth();
  const { 
    isSupported, 
    isSubscribed, 
    isLoading, 
    subscribe, 
    unsubscribe 
  } = usePushNotifications();
  const [isOpen, setIsOpen] = useState(false);

  if (!isSupported) return null;

  const handleToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe(citySlugs, routeKeys);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative", className)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isSubscribed ? (
            <>
              <Bell className="h-5 w-5 text-primary" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
            </>
          ) : (
            <BellOff className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              isSubscribed ? "bg-primary/10" : "bg-muted"
            )}>
              {isSubscribed ? (
                <Bell className="h-5 w-5 text-primary" />
              ) : (
                <BellOff className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">
                {isSubscribed ? 'Bildirimler Aktif' : 'Bildirimleri Aç'}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {isSubscribed 
                  ? 'Fiyat düşüşlerinden anında haberdar olun' 
                  : 'Fırsatları kaçırmamak için bildirimleri açın'}
              </p>
            </div>
          </div>

          {!user ? (
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Bildirimleri açmak için giriş yapmanız gerekiyor
              </p>
            </div>
          ) : (
            <>
              {isSubscribed && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Takip edilen:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {citySlugs.length > 0 ? (
                      citySlugs.map(slug => (
                        <Badge key={slug} variant="secondary" className="text-xs">
                          {slug}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">Tüm rotalar</span>
                    )}
                  </div>
                </div>
              )}

              <Button
                onClick={handleToggle}
                disabled={isLoading}
                className="w-full"
                variant={isSubscribed ? "outline" : "default"}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : isSubscribed ? (
                  <BellOff className="h-4 w-4 mr-2" />
                ) : (
                  <Bell className="h-4 w-4 mr-2" />
                )}
                {isSubscribed ? 'Bildirimleri Kapat' : 'Bildirimleri Aç'}
              </Button>
            </>
          )}

          {isSubscribed && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="h-3 w-3 text-primary" />
              <span>Fiyat düşüşlerinde bildirim alacaksınız</span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
