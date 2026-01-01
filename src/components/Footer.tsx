import { Link } from 'react-router-dom';
import { Plane, Mail, MapPin } from 'lucide-react';

export function Footer() {
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
              En uygun uçak bileti ve otel fiyatlarını karşılaştırın, seyahat planınızı oluşturun.
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
            <h4 className="font-display font-bold mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/ucus-rotalari" className="text-muted-foreground hover:text-primary transition-colors">
                  Uçuş Rotaları
                </Link>
              </li>
              <li>
                <Link to="/sehirler" className="text-muted-foreground hover:text-primary transition-colors">
                  Şehir Rehberleri
                </Link>
              </li>
              <li>
                <Link to="/oteller" className="text-muted-foreground hover:text-primary transition-colors">
                  Oteller
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="font-display font-bold mb-4">Popüler Şehirler</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/sehir/paris" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Paris
                </Link>
              </li>
              <li>
                <Link to="/sehir/londra" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Londra
                </Link>
              </li>
              <li>
                <Link to="/sehir/roma" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Roma
                </Link>
              </li>
              <li>
                <Link to="/sehir/barcelona" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Barcelona
                </Link>
              </li>
              <li>
                <Link to="/sehir/amsterdam" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Amsterdam
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-bold mb-4">Yasal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/gizlilik-politikasi" className="text-muted-foreground hover:text-primary transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link to="/kullanim-kosullari" className="text-muted-foreground hover:text-primary transition-colors">
                  Kullanım Koşulları
                </Link>
              </li>
              <li>
                <Link to="/kvkk" className="text-muted-foreground hover:text-primary transition-colors">
                  KVKK Aydınlatma Metni
                </Link>
              </li>
              <li>
                <Link to="/cerez-politikasi" className="text-muted-foreground hover:text-primary transition-colors">
                  Çerez Politikası
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} WooNomad. Tüm hakları saklıdır.</p>
          <p className="mt-2 text-xs">
            WooNomad bir uçak bileti ve otel karşılaştırma platformudur. Rezervasyonlar üçüncü taraf siteler üzerinden gerçekleştirilir.
          </p>
        </div>
      </div>
    </footer>
  );
}
