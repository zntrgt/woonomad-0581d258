import { Button } from '@/components/ui/button';
import { openCookiePreferences } from '@/lib/consent';

export function AffiliateConsentNotice() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
      <p>Bu seyahat aracı üçüncü taraf sağlayıcı tarafından sunulur. Görüntülemek için iş ortağı araçlarına izin verebilirsiniz.</p>
      <Button type="button" variant="outline" size="sm" onClick={openCookiePreferences} className="mt-3">Çerez tercihleri</Button>
    </div>
  );
}
