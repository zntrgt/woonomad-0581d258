import { useKlookActivities } from '@/hooks/useKlookActivities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface KlookActivitiesWidgetProps {
  citySlug: string;
  cityName?: string;
  className?: string;
}

export function KlookActivitiesWidget({ citySlug, cityName, className = '' }: KlookActivitiesWidgetProps) {
  const { data, isLoading, error } = useKlookActivities(citySlug);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.supported) {
    return null;
  }

  return (
    <Card className={`border-primary/20 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Compass className="h-5 w-5 text-primary" />
          {cityName || data.cityName} {t('activities', 'Aktiviteleri')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.activities?.slice(0, 4).map((activity) => (
          <a
            key={activity.id}
            href={activity.link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">{activity.icon}</span>
              <span className="font-medium text-sm">{activity.label}</span>
            </span>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
        ))}
        
        {data.cityLink && (
          <Button
            asChild
            variant="outline"
            className="w-full mt-3 border-primary/30 hover:bg-primary/10"
          >
            <a
              href={data.cityLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
            >
              {t('viewAllActivities', 'Tüm Aktiviteleri Gör')}
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        )}
        
        <p className="text-xs text-muted-foreground text-center pt-2">
          Powered by Klook
        </p>
      </CardContent>
    </Card>
  );
}
