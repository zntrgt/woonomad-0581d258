import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Smartphone, Compass, Plane, BookOpen, Laptop } from 'lucide-react';
import { Logo } from './Logo';
import { useLocalizedRoutes } from '@/hooks/useLocalizedLink';

const popularCities = [
  { name: 'İstanbul', slug: 'istanbul' },
  { name: 'Barselona', slug: 'barselona' },
  { name: 'Berlin', slug: 'berlin' },
  { name: 'Bali', slug: 'bali' },
  { name: 'Lizbon', slug: 'lizbon' },
  { name: 'Paris', slug: 'paris' },
  { name: 'Roma', slug: 'roma' },
  { name: 'Tokyo', slug: 'tokyo' },
  { name: 'Tiflis', slug: 'tiflis' },
  { name: 'Dubai', slug: 'dubai' },
];

export function Footer() {
  const { t } = useTranslation();
  const { getRoute } = useLocalizedRoutes();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sand-900 text-sand-300 mb-20 md:mb-0" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-16 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-ocean-400" />
              <span className="font-display font-bold text-lg text-white">WooNomad</span>
            </div>
            <p className="text-sm text-sand-400 max-w-xs leading-relaxed">
              Dijital göçebeler ve bağımsız gezginler için şehir rehberleri, uçak bileti karşılaştırma, otel arama ve seyahat araçları.
            </p>
            <a href="mailto:info@woonomad.co" className="inline-flex items-center gap-2 text-sm text-sand-400 hover:text-ocean-400 transition-colors">
              <Mail className="w-4 h-4" />
              info@woonomad.co
            </a>
          </div>

          {/* Keşfet */}
          <div>
            <h4 className="text-xs font-semibold text-sand-200 uppercase tracking-wider mb-4">Keşfet</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to={getRoute('cities')} className="text-sand-400 hover:text-white transition-colors flex items-center gap-1.5"><MapPin className="w-3 h-3 shrink-0" />{t('nav.cities')}</Link></li>
              <li><Link to={getRoute('flights')} className="text-sand-400 hover:text-white transition-colors flex items-center gap-1.5"><Plane className="w-3 h-3 shrink-0" />{t('nav.flights')}</Link></li>
              <li><Link to={getRoute('hotels')} className="text-sand-400 hover:text-white transition-colors">{t('nav.hotels')}</Link></li>
              <li><Link to={getRoute('nomadHub')} className="text-sand-400 hover:text-white transition-colors flex items-center gap-1.5"><Laptop className="w-3 h-3 shrink-0" />{t('nav.nomadHub')}</Link></li>
              <li><Link to={getRoute('esim')} className="text-sand-400 hover:text-white transition-colors flex items-center gap-1.5"><Smartphone className="w-3 h-3 shrink-0" />{t('nav.esim')}</Link></li>
              <li><Link to={getRoute('blog')} className="text-sand-400 hover:text-white transition-colors flex items-center gap-1.5"><BookOpen className="w-3 h-3 shrink-0" />{t('nav.blog')}</Link></li>
              <li><Link to={getRoute('soloTravel')} className="text-sand-400 hover:text-white transition-colors flex items-center gap-1.5"><Compass className="w-3 h-3 shrink-0" />Solo Seyahat</Link></li>
              <li><Link to={getRoute('familyTravel')} className="text-sand-400 hover:text-white transition-colors flex items-center gap-1.5"><Compass className="w-3 h-3 shrink-0" />Aile Seyahati</Link></li>
            </ul>
          </div>

          {/* Popüler Şehirler */}
          <div>
            <h4 className="text-xs font-semibold text-sand-200 uppercase tracking-wider mb-4">Popüler Şehirler</h4>
            <ul className="space-y-2.5 text-sm">
              {popularCities.map((city) => (
                <li key={city.slug}>
                  <Link to={getRoute('city', { slug: city.slug })} className="text-sand-400 hover:text-white transition-colors">
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Yasal */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-xs font-semibold text-sand-200 uppercase tracking-wider mb-4">Bilgi</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to={getRoute('privacy')} className="text-sand-400 hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to={getRoute('terms')} className="text-sand-400 hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to={getRoute('kvkk')} className="text-sand-400 hover:text-white transition-colors">{t('footer.kvkk')}</Link></li>
              <li><Link to={getRoute('cookies')} className="text-sand-400 hover:text-white transition-colors">{t('footer.cookies')}</Link></li>
              <li><Link to={getRoute('affiliate')} className="text-sand-400 hover:text-white transition-colors">Affiliate Açıklama</Link></li>
              <li><Link to={getRoute('metodoloji')} className="text-sand-400 hover:text-white transition-colors">Metodoloji</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sand-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-sand-500">
            © {currentYear} WooNomad. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-sand-600">
            Keşfet · Planla · Yaşa
          </p>
        </div>
      </div>
    </footer>
  );
}
