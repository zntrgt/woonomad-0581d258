import { Link } from 'react-router-dom';
import { Smartphone, ExternalLink, Signal, Globe, ArrowRight } from 'lucide-react';
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

// ─── Affiliate Configuration ───────────────────────────────────
// IMPORTANT: Replace with your actual Impact tracking links
const AIRALO_BASE_URL = "https://www.airalo.com";
const AIRALO_AFFILIATE_PARAM = "ref=woonomad"; // TODO: Replace with Impact tracking parameter

// Country code → Airalo destination + network info
const countryMappings: Record<string, { slug: string; network: string; speed: string }> = {
  'TR': { slug: 'turkey', network: 'Turkcell', speed: '4G/5G' },
  'DE': { slug: 'germany', network: 'T-Mobile', speed: '5G' },
  'FR': { slug: 'france', network: 'Orange', speed: '4G/5G' },
  'ES': { slug: 'spain', network: 'Movistar', speed: '4G/5G' },
  'IT': { slug: 'italy', network: 'TIM', speed: '4G' },
  'GB': { slug: 'united-kingdom', network: 'EE', speed: '5G' },
  'NL': { slug: 'netherlands', network: 'KPN', speed: '4G/5G' },
  'GR': { slug: 'greece', network: 'Cosmote', speed: '4G' },
  'PT': { slug: 'portugal', network: 'MEO', speed: '4G/5G' },
  'AE': { slug: 'united-arab-emirates', network: 'du', speed: '5G' },
  'JP': { slug: 'japan', network: 'SoftBank', speed: '5G' },
  'TH': { slug: 'thailand', network: 'AIS', speed: '4G/5G' },
  'SG': { slug: 'singapore', network: 'Singtel', speed: '5G' },
  'ID': { slug: 'indonesia', network: 'Telkomsel', speed: '4G' },
  'US': { slug: 'united-states', network: 'T-Mobile', speed: '5G' },
  'GE': { slug: 'georgia', network: 'Magti', speed: '4G' },
  'MK': { slug: 'north-macedonia', network: 'A1', speed: '4G' },
  'AT': { slug: 'austria', network: 'A1', speed: '5G' },
  'CH': { slug: 'switzerland', network: 'Swisscom', speed: '5G' },
  'BE': { slug: 'belgium', network: 'Proximus', speed: '4G/5G' },
  'CZ': { slug: 'czech-republic', network: 'T-Mobile', speed: '4G' },
  'PL': { slug: 'poland', network: 'Plus', speed: '4G/5G' },
  'HU': { slug: 'hungary', network: 'Telekom', speed: '4G' },
  'HR': { slug: 'croatia', network: 'A1', speed: '4G' },
  'RO': { slug: 'romania', network: 'Vodafone', speed: '4G' },
  'BG': { slug: 'bulgaria', network: 'A1', speed: '4G' },
};

const getCountryInfo = (countryCode: string) => {
  return countryMappings[countryCode] || { slug: 'global', network: 'Yerel operatör', speed: '4G' };
};

const getAiraloUrl = (countryCode: string) => {
  const info = getCountryInfo(countryCode);
  return `${AIRALO_BASE_URL}/${info.slug}-esim?${AIRALO_AFFILIATE_PARAM}`;
};

export function EsimWidget({ countryCode, countryName, cityName, className }: EsimWidgetProps) {
  const { t } = useTranslation();
  const airaloUrl = getAiraloUrl(countryCode);
  const countryInfo = getCountryInfo(countryCode);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" />
            eSIM
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
            <Link to="/esim">
              Rehber →
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-1">
            {countryName} eSIM
          </h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Signal className="h-3 w-3" />
            <span>{countryInfo.network} · {countryInfo.speed}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {cityName 
              ? `${cityName}'de SIM kart aramadan internete bağlan.` 
              : 'SIM kart aramadan, anında internete bağlan.'
            }
          </p>
          
          <a 
            href={airaloUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block"
          >
            <Button className="w-full gap-2" size="sm">
              Paketleri Gör
              <ExternalLink className="h-3 w-3" />
            </Button>
          </a>

          <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">
            Airalo · Affiliate bağlantı
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to="/esim" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            eSIM Rehberi ve Karşılaştırma
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
