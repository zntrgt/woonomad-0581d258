import { Link } from 'react-router-dom';
import { Smartphone, ExternalLink, Signal, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

interface EsimWidgetProps {
  countryCode: string;
  countryName: string;
  cityName?: string;
  className?: string;
}

// Travelpayouts Airalo Affiliate ID
const AIRALO_AFFILIATE_ID = "referral_woonomad";

// Country code to Airalo destination mapping
const countryMappings: Record<string, string> = {
  'TR': 'turkey',
  'DE': 'germany',
  'FR': 'france',
  'ES': 'spain',
  'IT': 'italy',
  'GB': 'united-kingdom',
  'NL': 'netherlands',
  'GR': 'greece',
  'PT': 'portugal',
  'AE': 'united-arab-emirates',
  'JP': 'japan',
  'TH': 'thailand',
  'SG': 'singapore',
  'ID': 'indonesia',
  'US': 'united-states',
  'GE': 'georgia',
  'MK': 'north-macedonia',
  'AT': 'austria',
  'CH': 'switzerland',
  'BE': 'belgium',
  'CZ': 'czech-republic',
  'PL': 'poland',
  'HU': 'hungary',
  'HR': 'croatia',
  'RO': 'romania',
  'BG': 'bulgaria',
};

const getAiraloUrl = (countryCode: string) => {
  const destination = countryMappings[countryCode] || 'global';
  return `https://www.airalo.com/${destination}-esim?${AIRALO_AFFILIATE_ID}`;
};

export function EsimWidget({ countryCode, countryName, cityName, className }: EsimWidgetProps) {
  const { t } = useTranslation();
  const airaloUrl = getAiraloUrl(countryCode);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" />
            {t('esim.title', 'eSIM Paketleri')}
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
            <Link to="/esim">
              {t('common.seeAll', 'Tümü')} →
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 text-center">
          <Smartphone className="h-8 w-8 mx-auto text-primary mb-2" />
          <h4 className="font-medium text-sm mb-1">
            {countryName} {t('esim.esimPackages', 'eSIM')}
          </h4>
          <p className="text-xs text-muted-foreground mb-3">
            {t('esim.stayConnected', 'SIM kart aramadan bağlı kal')}
          </p>
          
          <a 
            href={airaloUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block"
          >
            <Button className="w-full gap-2" size="sm">
              <Signal className="h-4 w-4" />
              {t('esim.viewPackages', 'Paketleri Gör')}
              <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
        </div>

        {/* Quick info */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-muted/50 rounded p-2 text-center">
            <Badge variant="outline" className="text-2xs mb-1">{t('esim.instant', 'Anında')}</Badge>
            <p className="text-muted-foreground">{t('esim.instantActivation', 'Aktivasyon')}</p>
          </div>
          <div className="bg-muted/50 rounded p-2 text-center">
            <Badge variant="outline" className="text-2xs mb-1">4G/5G</Badge>
            <p className="text-muted-foreground">{t('esim.highSpeed', 'Yüksek Hız')}</p>
          </div>
        </div>

        <Button asChild variant="secondary" size="sm" className="w-full mt-2">
          <Link to="/esim">
            <Globe className="h-4 w-4 mr-2" />
            {t('esim.allCountries', 'Tüm Ülkeler')}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
