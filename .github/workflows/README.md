# CI/CD Workflows

## ci.yml — Ana CI Kontrolü

**Tetikleyiciler:** `main`'e push + `main`'e PR

**Adımlar:**
1. **TypeScript type check** — `tsc --noEmit` ile derleme hatası var mı kontrol
2. **ESLint** — lint kurallarına uyum
3. **Vite build** — production build başarıyla tamamlanıyor mu
4. **Bundle size raporu** — her build'de dist boyutu GitHub summary'e yazılır (bilgi amaçlı)

**Notlar:**
- Build adımında placeholder Supabase değerleri kullanılır (gerçek key'ler deployment env'de)
- `concurrency` ayarı sayesinde aynı branch'e hızlı push yapıldığında eski iş iptal edilir
- Timeout: 10 dakika

## Gelecekte eklenebilecekler
- `lighthouse-ci` — SEO ve performance skorları için
- `deploy-preview` — Netlify/Vercel preview URL
- `test` — birim testler (test altyapısı kurulunca)
