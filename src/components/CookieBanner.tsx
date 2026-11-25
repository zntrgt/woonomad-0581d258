import { openCookiePreferences, setAffiliateConsent, useConsent } from '@/lib/consent';

// No second CMP banner. The vendor CMP owns its notice; this is a withdrawal control
// only for separately activated partner embeds.
export function CookieBanner() {
  const { affiliate } = useConsent();
  return (
    <div className="fixed bottom-24 left-3 md:bottom-3 z-40 flex flex-wrap gap-1">
      <button type="button" onClick={openCookiePreferences}
        className="rounded-full border border-border bg-card px-3 py-2 text-xs text-foreground shadow-sm hover:bg-muted">
        Gizlilik tercihleri
      </button>
      {affiliate && (
        <button type="button" onClick={() => setAffiliateConsent(false)}
          className="rounded-full border border-border bg-card px-3 py-2 text-xs text-foreground shadow-sm hover:bg-muted">
          İş ortağı iznini geri al
        </button>
      )}
    </div>
  );
}
