import { Globe, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSettings, LANGUAGES, CURRENCIES, Language, Currency } from '@/contexts/SettingsContext';
import { cn } from '@/lib/utils';

export function SettingsDropdown() {
  const { language, currency, setLanguage, setCurrency, getLanguageInfo, getCurrencyInfo } = useSettings();

  const langInfo = getLanguageInfo();
  const currInfo = getCurrencyInfo();

  return (
    <div className="flex items-center gap-1">
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
          <DropdownMenuLabel className="text-xs text-muted-foreground">Dil Seçin</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
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
          <DropdownMenuLabel className="text-xs text-muted-foreground">Para Birimi</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {CURRENCIES.map((curr) => (
            <DropdownMenuItem
              key={curr.code}
              onClick={() => setCurrency(curr.code)}
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
