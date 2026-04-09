import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plane, Mail, MapPin, Smartphone, Compass } from 'lucide-react';
import { useLocalizedRoutes } from '@/hooks/useLocalizedLink';

export function Footer() {
  const { t } = useTranslation();
  const { getRoute } = useLocalizedRoutes();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30 mb-20 md:mb-0">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Plane className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-xl">WooNomad</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <a href="mailto:info@woonomad.co" className="hover:text-primary transition-colors">
                info@woonomad.co
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold mb-4">{t('common.seeAll')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={getRoute('home')} className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to={getRoute('flights')} className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.flights')}
                </Link>
              </li>
              <li>
                <Link to={getRoute('cities')} className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.cities')}
                </Link>
              </li>
              <li>
                <Link to={getRoute('hotels')} className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.hotels')}
                </Link>
              </li>
              <li>
                <Link to={getRoute('esim')} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Smartphone className="w-3 h-3" /> {t('nav.esim')}
                </Link>
              </li>
              <li>
                <Link to={getRoute('blog')} className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link to={getRoute('soloTravel')} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Compass className="w-3 h-3" /> Solo Seyahat
                </Link>
              </li>
              <li>
                <Link to={getRoute('familyTravel')} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Compass className="w-3 h-3" /> Aile Seyahati
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="font-display font-bold mb-4">{t('home.popularDestinations')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={getRoute('city', { slug: 'istanbul' })} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> İstanbul
                </Link>
              </li>
              <li>
                <Link to={getRoute('city', { slug: 'barselona' })} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Barselona
                </Link>
              </li>
              <li>
                <Link to={getRoute('city', { slug: 'berlin' })} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Berlin
                </Link>
              </li>
              <li>
                <Link to={getRoute('city', { slug: 'bali' })} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Bali
                </Link>
              </li>
              <li>
                <Link to={getRoute('city', { slug: 'lizbon' })} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Compass className="w-3 h-3" /> Lizbon
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-bold mb-4">{t('footer.terms')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={getRoute('privacy')} className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to={getRoute('terms')} className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to={getRoute('kvkk')} className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.kvkk')}
                </Link>
              </li>
              <li>
                <Link to={getRoute('cookies')} className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.cookies')}
                </Link>
              </li>
              <li>
                <Link to={getRoute('affiliate')} className="text-muted-foreground hover:text-primary transition-colors">
                  Affiliate Açıklama
                </Link>
              </li>
              <li>
                <Link to={getRoute('metodoloji')} className="text-muted-foreground hover:text-primary transition-colors">
                  Metodoloji
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>{t('footer.copyright', { year: currentYear })}</p>
          <p className="mt-2 text-xs">
            WooNomad - {t('home.heroSubtitle')}
          </p>
        </div>
      </div>
    </footer>
  );
}
