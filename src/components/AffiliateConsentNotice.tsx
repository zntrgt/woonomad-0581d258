import { Button } from '@/components/ui/button';
import { setAffiliateConsent } from '@/lib/consent';
import { Link } from 'react-router-dom';

export function AffiliateConsentNotice() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
      <p>Travelpayouts ve ilgili seyahat sağlayıcılarının gömülü araçları bu sayfada etkinleştirilebilir. Bu araçlar cihazınıza çerez veya benzeri veriler yerleştirebilir ve ziyaret bilgilerini ilgili sağlayıcılarla paylaşabilir. İzin vermeden rehberleri ve doğrudan bağlantıları kullanabilirsiniz.</p>
      <p className="mt-2"><Link to="/cerez-politikasi" className="underline text-primary">Çerez politikası ve sağlayıcı bilgileri</Link></p>
      <Button type="button" variant="outline" size="sm" onClick={() => setAffiliateConsent(true)} className="mt-3">İş ortağı araçlarına izin ver</Button>
    </div>
  );
}
