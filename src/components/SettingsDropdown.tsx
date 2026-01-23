import { Globe, ChevronDown, Check, MapPin, Flag, Plane } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { useSettings, LANGUAGES, CURRENCIES, Language, Currency } from '@/contexts/SettingsContext';
import { translateUrl } from '@/lib/i18n-routes';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useUserLocation } from '@/hooks/useUserLocation';

// Nationality options
const NATIONALITIES = [
  { code: 'TR', name: 'Türkiye', flag: '🇹🇷' },
  { code: 'DE', name: 'Almanya', flag: '🇩🇪' },
  { code: 'GB', name: 'İngiltere', flag: '🇬🇧' },
  { code: 'FR', name: 'Fransa', flag: '🇫🇷' },
  { code: 'NL', name: 'Hollanda', flag: '🇳🇱' },
  { code: 'US', name: 'ABD', flag: '🇺🇸' },
  { code: 'AE', name: 'BAE', flag: '🇦🇪' },
  { code: 'SA', name: 'Suudi Arabistan', flag: '🇸🇦' },
  { code: 'RU', name: 'Rusya', flag: '🇷🇺' },
];

// Airport options
const AIRPORTS = [
  { code: 'IST', name: 'İstanbul', country: 'TR' },
  { code: 'SAW', name: 'İstanbul Sabiha', country: 'TR' },
  { code: 'ESB', name: 'Ankara', country: 'TR' },
  { code: 'ADB', name: 'İzmir', country: 'TR' },
  { code: 'AYT', name: 'Antalya', country: 'TR' },
  { code: 'FRA', name: 'Frankfurt', country: 'DE' },
  { code: 'MUC', name: 'Münih', country: 'DE' },
  { code: 'LHR', name: 'Londra', country: 'GB' },
  { code: 'CDG', name: 'Paris', country: 'FR' },
  { code: 'AMS', name: 'Amsterdam', country: 'NL' },
  { code: 'DXB', name: 'Dubai', country: 'AE' },
  { code: 'JFK', name: 'New York', country: 'US' },
];

export function SettingsDropdown() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, currency, setLanguage, setCurrency, getLanguageInfo, getCurrencyInfo } = useSettings();
  const { toast } = useToast();
  const { 
    nationality, 
    originAirport, 
    setPreferredNationality, 
    setPreferredAirport 
  } = useUserLocation();

  const langInfo = getLanguageInfo();
  const currInfo = getCurrencyInfo();
  const currentNationality = NATIONALITIES.find(n => n.code === nationality) || NATIONALITIES[0];
  const currentAirport = AIRPORTS.find(a => a.code === originAirport) || AIRPORTS[0];

  const handleLanguageChange = (lang: Language) => {
    const newPath = translateUrl(location.pathname, lang);
    setLanguage(lang);
    navigate(newPath + location.search);
    
    const langName = LANGUAGES.find(l => l.code === lang)?.name || lang;
    toast({
      title: t('settings.languageChanged'),
      description: `${langName} ${lang === 'en' ? 'selected' : 'seçildi'}.`,
    });
  };

  const handleCurrencyChange = (curr: Currency) => {
    setCurrency(curr);
    const currName = CURRENCIES.find(c => c.code === curr)?.name || curr;
    toast({
      title: t('settings.currencyChanged'),
      description: `${currName} ${language === 'en' ? 'selected' : 'seçildi'}.`,
    });
  };

  const handleNationalityChange = (code: string) => {
    setPreferredNationality(code);
    const nat = NATIONALITIES.find(n => n.code === code);
    toast({
      title: t('destinations.yourNationality'),
      description: `${nat?.flag} ${nat?.name} ${language === 'en' ? 'selected' : 'seçildi'}.`,
    });
  };

  const handleAirportChange = (code: string) => {
    setPreferredAirport(code);
    const apt = AIRPORTS.find(a => a.code === code);
    toast({
      title: t('destinations.yourLocation'),
      description: `${apt?.name} (${code}) ${language === 'en' ? 'selected' : 'seçildi'}.`,
    });
  };

  return (
    <div className="flex items-center gap-1">
      {/* Location & Nationality Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1 text-xs font-normal">
            <MapPin className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{currentAirport.code}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 bg-popover z-50">
          {/* Nationality Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <Flag className="h-4 w-4 mr-2" />
              <span className="flex-1">{t('destinations.yourNationality')}</span>
              <span className="text-xs ml-2">{currentNationality.flag}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-44">
                {NATIONALITIES.map((nat) => (
                  <DropdownMenuItem
                    key={nat.code}
                    onClick={() => handleNationalityChange(nat.code)}
                    className={cn(
                      "cursor-pointer flex items-center justify-between",
                      nationality === nat.code && "bg-accent"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span>{nat.flag}</span>
                      <span>{nat.name}</span>
                    </span>
                    {nationality === nat.code && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          {/* Airport Selection */}
          <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Plane className="h-3.5 w-3.5" />
            {t('destinations.yourLocation')}
          </DropdownMenuLabel>
          {AIRPORTS.slice(0, 8).map((apt) => (
            <DropdownMenuItem
              key={apt.code}
              onClick={() => handleAirportChange(apt.code)}
              className={cn(
                "cursor-pointer flex items-center justify-between text-sm",
                originAirport === apt.code && "bg-accent"
              )}
            >
              <span className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-8">{apt.code}</span>
                <span>{apt.name}</span>
              </span>
              {originAirport === apt.code && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Language Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1 text-xs font-normal">
            <span className="text-base">{langInfo.flag}</span>
            <span className="hidden sm:inline">{langInfo.code.toUpperCase()}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 bg-popover z-50">
          <DropdownMenuLabel className="text-xs text-muted-foreground">{t('settings.language')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                "cursor-pointer flex items-center justify-between",
                language === lang.code && "bg-accent"
              )}
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
              {language === lang.code && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Currency Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1 text-xs font-normal">
            <span className="font-medium">{currInfo.symbol}</span>
            <span className="hidden sm:inline">{currInfo.code}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 bg-popover z-50">
          <DropdownMenuLabel className="text-xs text-muted-foreground">{t('settings.currency')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {CURRENCIES.map((curr) => (
            <DropdownMenuItem
              key={curr.code}
              onClick={() => handleCurrencyChange(curr.code)}
              className={cn(
                "cursor-pointer flex items-center justify-between",
                currency === curr.code && "bg-accent"
              )}
            >
              <span className="flex items-center gap-2">
                <span className="w-5 text-center font-medium">{curr.symbol}</span>
                <span>{curr.name}</span>
              </span>
              {currency === curr.code && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
