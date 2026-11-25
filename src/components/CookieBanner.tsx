import { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { openPreferencesEvent, saveConsent, useConsent } from '@/lib/consent';

export function CookieBanner() {
  const consent = useConsent();
  const [editing, setEditing] = useState(false);
  const [analytics, setAnalytics] = useState(consent.analytics);
  const [affiliate, setAffiliate] = useState(consent.affiliate);
  const [error, setError] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  function showPreferences() {
    setAnalytics(consent.analytics);
    setAffiliate(consent.affiliate);
    setError(false);
    setSettingsOpen(true);
    setEditing(true);
  }

  useEffect(() => {
    const open = () => {
      setAnalytics(consent.analytics);
      setAffiliate(consent.affiliate);
      setError(false);
      setSettingsOpen(true);
      setEditing(true);
    };
    window.addEventListener(openPreferencesEvent, open);
    return () => window.removeEventListener(openPreferencesEvent, open);
  }, [consent.analytics, consent.affiliate]);

  function choose(allowAnalytics: boolean, allowAffiliate: boolean) {
    if (!saveConsent(allowAnalytics, allowAffiliate)) {
      setError(true);
      return;
    }
    setEditing(false);
    setSettingsOpen(false);
  }

  if (consent.decided && !editing) {
    return (
      <button type="button" onClick={showPreferences}
        className="fixed bottom-24 left-3 md:bottom-3 z-40 rounded-full border border-border bg-card px-3 py-2 text-xs text-foreground shadow-sm hover:bg-muted"
        aria-label="Çerez tercihlerini değiştir">
        Çerez tercihleri
      </button>
    );
  }

  return (
    <section aria-label="Çerez tercihleri" className="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-6">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-2xl p-4 md:p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-start gap-3">
          <Cookie className="w-6 h-6 text-primary shrink-0 mt-1" aria-hidden="true" />
          <div className="flex-1">
            <h2 className="font-display font-bold text-lg mb-1">Çerez tercihleri</h2>
            <p className="text-sm text-muted-foreground">
              Zorunlu depolama dışında Google Analytics ve üçüncü taraf seyahat araçları yalnızca seçiminize göre etkinleştirilir. Reddetseniz de rehberleri okuyabilir ve doğrudan bağlantıları kullanabilirsiniz. Tercihinizi her zaman değiştirebilirsiniz.{' '}
              <Link to="/cerez-politikasi" className="text-primary underline">Çerez Politikası</Link>{' · '}
              <Link to="/gizlilik-politikasi" className="text-primary underline">Gizlilik Politikası</Link>
            </p>
            {settingsOpen && (
              <fieldset className="mt-4 space-y-3">
                <legend className="font-medium text-sm">İsteğe bağlı izinler</legend>
                <label className="flex gap-3 items-start text-sm">
                  <input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} className="mt-1" />
                  <span><strong>Analitik</strong> — Google Analytics ile ziyaret ve bağlantı tıklaması ölçümü.</span>
                </label>
                <label className="flex gap-3 items-start text-sm">
                  <input type="checkbox" checked={affiliate} onChange={e => setAffiliate(e.target.checked)} className="mt-1" />
                  <span><strong>İş ortağı araçları</strong> — Travelpayouts gibi üçüncü taraf seyahat widget'larının yüklenmesi.</span>
                </label>
                <p className="text-xs text-muted-foreground">Reklam izinleri bu sürümde kapalıdır.</p>
              </fieldset>
            )}
            {error && <p role="alert" className="text-sm text-destructive mt-2">İzin ayarları yüklenemedi. İsteğe bağlı etiketler etkinleştirilmedi.</p>}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button variant="outline" onClick={() => choose(false, false)} className="flex-1">Tümünü reddet</Button>
              {settingsOpen
                ? <Button variant="outline" onClick={() => choose(analytics, affiliate)} className="flex-1">Tercihlerimi kaydet</Button>
                : <Button variant="outline" onClick={() => setSettingsOpen(true)} className="flex-1">Tercihleri yönet</Button>}
              <Button variant="outline" onClick={() => choose(true, true)} className="flex-1">Tümünü kabul et</Button>
              {consent.decided && <Button variant="ghost" onClick={() => setEditing(false)}>Vazgeç</Button>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
