import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plane, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
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
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/ucuslar" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.flights')}
                </Link>
              </li>
              <li>
                <Link to="/sehirler" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.cities')}
                </Link>
              </li>
              <li>
                <Link to="/oteller" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.hotels')}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.blog')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="font-display font-bold mb-4">{t('home.popularDestinations')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/sehir/paris" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Paris
                </Link>
              </li>
              <li>
                <Link to="/sehir/londra" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> London
                </Link>
              </li>
              <li>
                <Link to="/sehir/tokyo" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Tokyo
                </Link>
              </li>
              <li>
                <Link to="/sehir/bali" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Bali
                </Link>
              </li>
              <li>
                <Link to="/sehir/bangkok" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Bangkok
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-bold mb-4">{t('footer.terms')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/gizlilik-politikasi" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/kullanim-kosullari" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/kvkk" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.kvkk')}
                </Link>
              </li>
              <li>
                <Link to="/cerez-politikasi" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.cookies')}
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
