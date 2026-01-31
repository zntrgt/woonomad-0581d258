
# Uygulama Planı

Kullanıcının 4 farklı isteği var. Bunları tek tek inceleyelim:

---

## 1. Blog Sayfalarına Yazılan Linkleri Otomatik Algıla

### Mevcut Durum
- `BlogPost.tsx` içinde `formatInlineText` fonksiyonu var
- Bu fonksiyon **bold** ve *italic* formatlarını işliyor
- Şehir isimlerini otomatik internal link'e çeviriyor
- Ancak Markdown formatındaki external linkler (`[metin](url)`) algılanmıyor

### Yapılacaklar
1. **`formatInlineText` fonksiyonunu genişlet**:
   - Markdown link formatı: `[link metni](https://example.com)` 
   - Regex ile algıla ve `<a>` tag'ine dönüştür
   - External linkler için `target="_blank"` ve `rel="noopener noreferrer sponsored"` ekle
   - Internal linkler için (woonomad.co veya `/` ile başlayanlar) normal `<a>` kullan

2. **DOMPurify ayarlarını güncelle**:
   - `ALLOWED_ATTR` listesine `target` ve `rel` ekle (zaten var, doğrulama gerekli)

---

## 2. Şehir Sayfalarındaki "En İyi Bölgeler"e Tıklayınca Otel Ara

### Mevcut Durum
- `City.tsx` içinde `getNeighborhoods()` fonksiyonu var (satır 84-156)
- Bölgeler sadece statik metin olarak gösteriliyor
- Tıklanabilir değiller

### Yapılacaklar
1. **Bölge kartlarını tıklanabilir yap**:
   - Her bölge kartına Agoda arama linki ekle
   - `getAgodaUrl` fonksiyonunu kullan
   - `textToSearch` parametresine bölge + şehir adını ekle (örn: "Kreuzberg Berlin")

2. **UI güncellemesi**:
   - Bölge kartlarına "Otel Ara" butonu veya tıklanabilir overlay ekle
   - Hover state ile kullanıcıya tıklanabilir olduğunu göster

---

## 3. Skyscanner Impact API Araştırması

### Araştırma Sonuçları
Skyscanner iki tür affiliate program sunuyor:

1. **Affiliate Program (Link Bazlı)**:
   - impact.com üzerinden yönetiliyor
   - Komisyon bazlı (77% booking artışı case study'de bahsedilmiş)
   - API gerektirmiyor, sadece affiliate link'ler

2. **Travel API (Partners Program)**:
   - partners.skyscanner.net üzerinden başvuru gerekli
   - Tam API erişimi: uçuş arama, fiyat karşılaştırma
   - Endpoint: `partners.api.skyscanner.net/apiservices/v3/flights/`
   - API Key gerekli (`x-api-key` header)
   - Indicative Prices, Live Prices, Autosuggest endpoint'leri var

### Sonuç
**Evet, Skyscanner API sağlıyor.** Ancak:
- Partner başvurusu yapılması gerekiyor
- Onay süreci var
- Mevcut Travelpayouts entegrasyonuna alternatif olarak değerlendirilebilir

Bu konuda herhangi bir kod değişikliği yapmıyorum - sadece bilgi verdim. İsterseniz Skyscanner Partner başvurusu yapabilirsiniz.

---

## 4. Anchor ID'leri Çalışır Hale Getir

### Mevcut Durum
- `BlogPost.tsx` içinde heading'lere ID ekleniyor (satır 600-616)
- `id={`heading-${index}`}` formatında
- `scroll-mt-20` class'ı var (sticky header için offset)
- `TableOfContents` bileşeni anchor linkler oluşturuyor (satır 170: `href={`#${heading.id}`}`)

### Sorun
- Browser'ın native hash navigation'ı çalışmıyor olabilir
- React Router hash handling eksik olabilir
- Sayfa yüklendiğinde hash'e scroll yapılmıyor

### Yapılacaklar
1. **Hash navigation hook'u ekle**:
   - Sayfa yüklendiğinde URL'deki hash'i kontrol et
   - İlgili elemente `scrollIntoView` ile scroll yap
   - `scroll-margin-top` CSS property'si ile header offset'i ayarla

2. **TOC linklerine smooth scroll ekle**:
   - Click event handler ile native behavior'u override et
   - `scrollIntoView({ behavior: 'smooth', block: 'start' })` kullan

---

## Teknik Detaylar

### Dosya Değişiklikleri

| Dosya | Değişiklik |
|-------|------------|
| `src/pages/BlogPost.tsx` | Markdown link parsing + anchor hash handling |
| `src/pages/City.tsx` | Neighborhood kartlarına Agoda link ekleme |

### Kod Örnekleri

**1. Markdown Link Parsing (BlogPost.tsx)**
```typescript
// formatInlineText içine eklenecek
// [link metni](url) formatını algıla
formatted = formatted.replace(
  /\[([^\]]+)\]\(([^)]+)\)/g,
  (match, text, url) => {
    const isExternal = url.startsWith('http');
    if (isExternal) {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer sponsored" class="text-primary hover:underline">${text}</a>`;
    }
    return `<a href="${url}" class="text-primary hover:underline">${text}</a>`;
  }
);
```

**2. Neighborhood Link (City.tsx)**
```typescript
// Bölge kartlarına eklenecek
const neighborhoodSearchUrl = getAgodaUrl(
  city.slug, 
  `${neighborhood.name} ${city.name}`, 
  checkIn, 
  checkOut
);
```

**3. Anchor Hash Handling (BlogPost.tsx)**
```typescript
useEffect(() => {
  const hash = window.location.hash;
  if (hash) {
    const element = document.querySelector(hash);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }
}, [post]);
```

---

## Uygulama Sırası

1. **Blog Markdown Link Parsing** - Öncelikli (içerik zenginleştirme)
2. **Anchor ID'leri Düzeltme** - Blog deneyimini iyileştirir
3. **Neighborhood Otel Arama** - Conversion artırıcı
4. **Skyscanner** - Sadece bilgi (kod değişikliği yok)

---

## Kabul Kriterleri

- [ ] Blog içeriğindeki `[metin](url)` formatındaki linkler tıklanabilir olacak
- [ ] External linkler yeni sekmede açılacak, internal linkler aynı sekmede
- [ ] Şehir sayfasındaki bölge kartlarına tıklayınca Agoda'da o bölge için otel araması açılacak
- [ ] Blog TOC'taki anchor linkleri çalışacak ve smooth scroll yapacak
- [ ] Sayfa URL'sinde hash varsa (#heading-5 gibi) sayfa o başlığa scroll edecek
