
# Travelpayouts Widget Entegrasyonu Planı

## Genel Bakış

Mevcut özel Edge Function tabanlı uçuş ve otel arama sistemini, doğrudan Travelpayouts'un hazır widget embed kodlarıyla değiştireceğiz. Bu geçiş, bakım maliyetini azaltacak ve daha güvenilir bir arama deneyimi sağlayacak.

---

## Mevcut Durum Analizi

### Şu Anda Ne Var?
- **Uçuş Araması**: `search-flights` Edge Function (836 satır kod) → Travelpayouts API
- **Otel Araması**: `search-hotels` Edge Function (693 satır kod) → Hotellook API
- **Sonuç Gösterimi**: Özel `FlightCard`, `HotelCard` component'leri
- **Sorunlar**: 
  - API rate limiting
  - Arama sonuçlarının tutarsızlığı
  - Bazı destinasyonlar için boş sonuçlar
  - Bakım zorluğu

### Widget Geçişinin Avantajları
- Travelpayouts tarafından bakım yapılır
- Her zaman güncel fiyatlar
- Daha güvenilir arama sonuçları
- Daha az sunucu maliyeti (Edge Function çağrıları azalır)
- Otomatik para birimi ve dil desteği

### Dezavantajları
- Özelleştirme kısıtlı (renk, boyut dışında)
- Arama sonuçları site içinde değil, yeni sekmede açılır
- "Powered by Travelpayouts" etiketi zorunlu

---

## Widget Tipleri

Travelpayouts'tan kullanacağımız widget'lar:

### 1. Flight Search Form Widget
- Kalkış/varış seçimi
- Tarih seçimi
- Yolcu sayısı
- Arama butonu → Aviasales'e yönlendirme

### 2. Low Fares Calendar Widget
- Aylık en ucuz fiyatları gösterir
- Belirli bir rota için ideal

### 3. Hotel Search Widget (Agoda)
- Şehir seçimi
- Giriş/çıkış tarihleri
- Misafir sayısı
- Arama → Agoda'ya yönlendirme

### 4. Popular Destinations Widget
- Belirli bir şehirden en ucuz destinasyonları gösterir

---

## Uygulama Planı

### Aşama 1: Widget Wrapper Component'leri Oluşturma

#### 1.1 `TravelpayoutsFlightWidget.tsx`
Uçuş arama widget'ını sarmalayan React component:

```text
src/components/widgets/
├── TravelpayoutsFlightWidget.tsx    # Ana uçuş arama formu
├── TravelpayoutsCalendarWidget.tsx  # Fiyat takvimi widget'ı
├── TravelpayoutsHotelWidget.tsx     # Otel arama widget'ı
├── TravelpayoutsMapWidget.tsx       # Harita widget'ı
└── WidgetContainer.tsx              # Ortak container
```

Her widget:
- Partner ID'yi otomatik alır (mevcut secret: `TRAVELPAYOUTS_PARTNER_ID`)
- Dil ayarını site diline göre belirler
- Para birimini kullanıcı tercihine göre ayarlar
- Responsive tasarım sağlar

### Aşama 2: Sayfa Bazlı Değişiklikler

#### 2.1 Ana Sayfa (`src/pages/Index.tsx`)
**Önce:**
- `SearchForm` component + `useFlightSearch` hook
- `FlightCard` ile sonuç listesi

**Sonra:**
- `TravelpayoutsFlightWidget` (uçuş arama formu)
- `TravelpayoutsHotelWidget` (otel arama formu)
- `PopularRoutes` ve `PopularHotels` kalsın (bunlar link tabanlı)

#### 2.2 Uçuş Rotası Sayfası (`src/pages/FlightRoute.tsx`)
**Önce:**
- `SearchForm` + `useFlightSearch`
- `FlightCard` listesi
- `PriceTrendChart`

**Sonra:**
- `TravelpayoutsFlightWidget` (rota önceden doldurulmuş)
- `TravelpayoutsCalendarWidget` (o rota için fiyat takvimi)
- SEO içerikleri (mevcut FAQ, rota bilgileri) kalır

#### 2.3 Şehir Uçuşları Sayfası (`src/pages/CityFlights.tsx`)
- `TravelpayoutsFlightWidget` (şehir önceden doldurulmuş)
- `TravelpayoutsCalendarWidget`

#### 2.4 Şehir Otelleri Sayfası (`src/pages/CityHotels.tsx`)
- `TravelpayoutsHotelWidget` (şehir önceden doldurulmuş)
- Neighborhood kartları (mevcut Agoda link sistemi kalabilir)

#### 2.5 Otel Ana Sayfası (`src/pages/Hotels.tsx`)
- `TravelpayoutsHotelWidget`
- `PopularHotels` kalır

### Aşama 3: Kaldırılacaklar

#### 3.1 Kullanılmayacak Component'ler
- `src/components/SearchForm.tsx` → Widget ile değiştirilecek
- `src/components/FlightCard.tsx` → Sonuçlar harici sitede gösterilecek
- `src/components/FlightFilters.tsx` → Harici sitede filtreleme yapılacak
- `src/components/FlightDatePicker.tsx` → Widget içinde mevcut
- `src/hooks/useFlightSearch.ts` → Artık gerekli değil
- `src/hooks/useHotelSearch.ts` → Artık gerekli değil
- `src/components/SearchStatus.tsx` → Widget kendi durumunu yönetir

#### 3.2 Edge Function'lar
- `supabase/functions/search-flights/` → **Silinebilir** (widget devralacak)
- `supabase/functions/search-hotels/` → **Silinebilir** (widget devralacak)

#### 3.3 Korunacaklar
- `supabase/functions/get-monthly-prices/` → PriceCalendar için hala kullanılabilir
- `supabase/functions/check-price-alerts/` → Fiyat uyarıları için gerekli
- Mevcut Agoda link sistemi (`getAgodaUrl`) → Neighborhood kartları için

### Aşama 4: Widget Konfigürasyonu

Widget'ları Travelpayouts hesabından özelleştirmek:

1. **Renk Teması**: Site temasına uygun (primary: `#8B5CF6`)
2. **Dil**: Site diline göre dinamik (tr, en, de, fr, es, ar)
3. **Para Birimi**: Kullanıcı tercihine göre (TRY, EUR, USD)
4. **Boyut**: Responsive (mobile/desktop)
5. **SubID**: Sayfa bazlı tracking (homepage, city-page, route-page)

---

## Teknik Detaylar

### Widget Embed Yöntemi
Travelpayouts widget'ları `<script>` tag'i ile yüklenir:

```text
// Widget div + script yapısı
<div id="tp-widget-xxx" data-params="..."></div>
<script src="https://tp.media/xxx/widget.js"></script>
```

React'ta bu yapıyı güvenli şekilde yönetmek için:
1. `useEffect` ile script'i dinamik yükle
2. Component unmount'ta temizle
3. Props değiştiğinde widget'ı yeniden oluştur

### Partner ID Kullanımı
Mevcut `TRAVELPAYOUTS_PARTNER_ID` secret'ı:
- Edge Function'larda kullanılıyordu
- Widget'larda da aynı ID kullanılacak
- Frontend'de public olarak embed edilebilir (affiliate ID olduğu için güvenli)

### Dil Mapping
```text
Site Dili → Widget Dili
tr → tr
en → en
de → de
fr → fr
es → es
ar → ar
```

---

## Zaman Çizelgesi

| Aşama | Açıklama | Süre |
|-------|----------|------|
| 1 | Widget wrapper component'leri oluştur | 1 mesaj |
| 2 | Ana sayfa widget entegrasyonu | 1 mesaj |
| 3 | Rota ve şehir sayfaları entegrasyonu | 1 mesaj |
| 4 | Eski component ve hook'ları kaldır | 1 mesaj |
| 5 | Test ve optimizasyon | 1 mesaj |

---

## Önemli Notlar

### Widget Sınırlamaları
1. **Arama sonuçları harici sitede açılır** - Kullanıcı Aviasales/Agoda'ya yönlendirilir
2. **Site içi filtreleme yok** - Filtreleme harici sitede yapılır
3. **"Powered by" etiketi** - Kaldırılamaz

### Korunacak Özellikler
1. **SEO İçerikleri** - Tüm rota açıklamaları, FAQ'lar kalır
2. **PopularRoutes/PopularHotels** - Link tabanlı, widget değil
3. **Neighborhood Kartları** - Mevcut Agoda link sistemi
4. **Fiyat Uyarıları** - `check-price-alerts` Edge Function kalır
5. **Blog İçerikleri** - Hiçbir değişiklik yok

### Fallback Planı
Widget'lar yüklenmezse:
- Agoda/Aviasales'e direkt link gösteren fallback UI
- "Widget yüklenemiyor" mesajı
