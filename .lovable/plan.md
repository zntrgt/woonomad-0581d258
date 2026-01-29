
Kapsam (Sorun Tanımı)
- /sehir/berlin/oteller sayfasında “5 Yıldızlı / Premium” gibi kategori linkine tıklayınca Agoda’da “Aramanızı tamamlarken bir sorun oluştu.” hatası alınabiliyor.
- Şu an CityHotels.tsx içinde kategori linkleri `getAgodaUrl(citySlug, searchCity, checkIn, checkOut, { stars: ... })` ile üretiliyor; ancak `getAgodaUrl` içinde “stars” parametresi bilerek kullanılmıyor (yorum satırına alınmış). Bu yüzden “5 yıldız” butonu aslında çoğu zaman “normal arama” ile aynı URL’yi üretiyor; yani hatayı tetikleyen şey büyük olasılıkla yıldız filtresi değil, URL parametre kombinasyonu.

Hızlı Teşhis (Neyi Kontrol Ettim)
- CityHotels.tsx içinde 5 yıldız butonu ve bütçe kartlarının hepsi `getAgodaUrl(...)` ile dışarı yönleniyor.
- getAgodaUrl son değişiklikte `checkOut` parametresini kaldırıp “checkIn + los (length of stay)” modeline geçti. Agoda tarafında bazı lokasyonlarda / bazı senaryolarda “checkOut yokken” arama endpoint’inin hata verebilme ihtimali var (özellikle affiliate cid ile birleşince).

Karar Gerektiren Nokta (Widget konusu)
- “Widget” iki farklı anlama gelebilir:
  1) Site içinde kendi “otel arama mini arayüzümüz” (tarih/kişi seç, butona basınca Agoda yeni sekmede açılır) — önerdiğim güvenli seçenek.
  2) Agoda’nın/3. tarafın gömülebilir iframe/script widget’ı — genelde X-Frame-Options / CSP sebebiyle ya çalışmaz ya da tasarım/performans sorunları çıkarabilir.

Bu nedenle planı iki aşamalı yapıyorum: önce link hatasını kökten düzeltip (minimum risk), ardından isterseniz link yerine “site içi widget UI”ya geçmek.

Uygulama Planı (Link Hatasını Düzeltme – Öncelikli)
1) Sorunu net yeniden üretme ve URL doğrulama
   - /sehir/berlin/oteller sayfasındaki “5 Yıldızlı Oteller” ve “4 Yıldızlı Premium” butonlarının ürettiği gerçek href’leri alıp kaydedeceğim.
   - Aynı URL’leri:
     - (a) normal tarayıcı sekmesinde
     - (b) farklı şehirlerde (Berlin + İzmir gibi)
     test ederek hatanın “şehir özelinde mi” yoksa “parametre seti özelinde mi” olduğunu netleştireceğim.

2) getAgodaUrl parametre setini daha “Agoda-uyumlu ve toleranslı” hale getirme
   - Şu anki: `checkIn + los` yaklaşımını daha güvenli hale getireceğim:
     - checkIn ve checkOut veriliyorsa:
       - URL’ye `checkIn` ve `checkOut` ikisini de ekleyeceğim (Agoda’nın en yaygın desteklediği çift).
       - los’u istersek opsiyonel olarak ekleriz; ama temel doğrulama için checkOut’a geri dönmek daha güvenli.
     - checkOut yoksa: sadece city + cid + rooms + adults gönderip tarih seçimini Agoda’ya bırakacağım (fallback).
   - “stars” gibi hata üretebilecek parametreleri eklemeyeceğim (zaten daha önce sorun oluşturduğu biliniyor). Yıldız kategorilerini UI metni olarak tutup, kullanıcıya Agoda’da filtreletmek conversion açısından genelde daha stabil.

3) “Kategori linkleri” stratejisini düzeltme (5 yıldız/premium/konfor/bütçe)
   - Amaç: Her kategori butonu aynı “boş” aramaya gitmesin; en azından farklı bir davranış göstersin.
   - Önerilen davranış:
     - 5/4/3 yıldız butonları: sadece şehir araması + tarih/kişi (yıldız parametresi yok) → hata riskini minimize eder.
     - “Bütçe Dostu”: `sort=priceLowToHigh` kalır (bu parametre genelde güvenli).
   - Böylece “Premium linkine tıkladım ama aynı sayfa açılıyor” hissi azalır; asıl hedef olan “hatasız açılma” garantiye yaklaşır.

4) Doğrulama (bitince yapılacak testler)
   - Berlin: “5 Yıldızlı Oteller” ve “4 Yıldızlı Premium” tıklayınca Agoda’da hata çıkmıyor mu?
   - İzmir: “3 Yıldızlı Konfor” ve “Bütçe Dostu” tıklayınca sonuçlar geliyor mu?
   - 2-3 farklı şehir daha: Tokyo/Paris gibi mapping’i kuvvetli şehirlerde hızlı kontrol.

Uygulama Planı (Link yerine “Widget UI” – İkinci aşama / opsiyonel)
5) CityHotels sayfasına “Otel Arama Widget” (site içi)
   - Sayfanın üst CTA alanında zaten var; bunu daha “widget” gibi hale getireceğim:
     - tarih seçimi (mevcut date-fns akışına uyumlu)
     - yetişkin/oda seçimi
     - “Agoda’da Ara” butonu (getAgodaUrl ile açar)
   - Kategori kartları (Premium/Konfor vb.) tıklanınca:
     - ya widget içinde “önerilen ayar” preset’i seçtirir (ör. bütçe: fiyat düşükten)
     - ya da direkt yeni sekmede arama açar.
   - Avantaj: linkleri azaltır, kullanıcı niyeti netleşir, hata olasılığı düşer.
   - Not: Agoda sayfasını iframe ile gömmeye çalışmayacağım; büyük olasılıkla engellenir ve SEO/UX’i bozar.

Kritik Notlar / Riskler
- Agoda tarafındaki hata bazen anlık/region bazlı da olabiliyor. Bu yüzden:
  - Parametre setini “en basit, en stabil” noktaya çekmek (checkIn+checkOut ya da tarihsiz) en iyi yaklaşım.
- “5 yıldız filtresi Agoda’da otomatik seçilsin” hedefi, daha önce sorun çıkaran parametreler yüzünden güvenilir değil. Bunu isterseniz ayrı bir iterasyonda, şehir bazında A/B test ederek ele alalım.

Kabul Kriterleri (Done)
- Berlin /sehir/berlin/oteller sayfasında premium/5 yıldız butonları Agoda’da hata vermeden açılıyor.
- İzmir’de 3 yıldız konfor ve bütçe linkleri “sonuç görülebilen” bir aramaya gidiyor.
- Linklerin hepsi “rel=noopener noreferrer sponsored” ile kalıyor ve tp-em benzeri interceptor’lar devrede değil.
