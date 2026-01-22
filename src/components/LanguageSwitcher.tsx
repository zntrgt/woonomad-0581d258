import { useNavigate, useLocation } from 'react-router-dom';
import { useSettings, LANGUAGES, Language } from '@/contexts/SettingsContext';
import { translateUrl } from '@/lib/i18n-routes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentLangInfo = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  
  const handleLanguageChange = (newLang: Language) => {
    // Translate current URL to new language
    const newPath = translateUrl(location.pathname, newLang);
    
    // Update language setting
    setLanguage(newLang);
    
    // Navigate to translated URL
    navigate(newPath + location.search);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLangInfo.flag} {currentLangInfo.name}</span>
          <span className="sm:hidden">{currentLangInfo.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </span>
            {language === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
