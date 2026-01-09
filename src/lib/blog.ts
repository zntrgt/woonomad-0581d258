export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: 'festival' | 'culture' | 'lifestyle' | 'travel-tips' | 'food' | 'nomad';
  city?: string;
  citySlug?: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  tags: string[];
  relatedCities?: string[];
  featured?: boolean;
}

export const blogCategories = [
  { id: 'all', name: 'Tümü', emoji: '📚' },
  { id: 'nomad', name: 'Dijital Göçebe', emoji: '🏝️' },
  { id: 'festival', name: 'Festival', emoji: '🎉' },
  { id: 'culture', name: 'Kültür', emoji: '🏛️' },
  { id: 'lifestyle', name: 'Yaşam Tarzı', emoji: '✨' },
  { id: 'travel-tips', name: 'Seyahat İpuçları', emoji: '💡' },
  { id: 'food', name: 'Yeme-İçme', emoji: '🍽️' },
];

// Sample blog posts - in production, this would come from a CMS or database
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'istanbul-lale-festivali-2026',
    title: 'İstanbul Lale Festivali 2026: Baharın En Renkli Etkinliği',
    excerpt: 'Her yıl milyonlarca ziyaretçiyi ağırlayan İstanbul Lale Festivali bu yıl daha da görkemli. Emirgan Korusu başta olmak üzere şehrin dört bir yanı lalelere bezeniyor.',
    content: `
# İstanbul Lale Festivali 2026

Her yıl bahar aylarında İstanbul'u rengarenk bir tabloya dönüştüren **Lale Festivali**, bu yıl 1 Nisan - 30 Nisan tarihleri arasında gerçekleşecek.

## Festival Hakkında

İstanbul'un simgesi haline gelen laleler, Osmanlı döneminden bu yana şehrin vazgeçilmez çiçeği. Belediye tarafından organize edilen festival kapsamında:

- **30 milyon** lale dikildi
- **150+** farklı lale türü sergileniyor
- **Ücretsiz** etkinlikler düzenleniyor

## En İyi Lale Noktaları

### 1. Emirgan Korusu
Festival'in kalbi Emirgan Korusu. Burada hem laleleri görebilir hem de piknik yapabilirsiniz.

### 2. Gülhane Parkı
Sultanahmet'e yakın konumuyla turistlerin favorisi.

### 3. Yıldız Parkı
Daha sakin bir atmosfer arayanlar için ideal.

## Ulaşım ve Konaklama

Festival döneminde oteller hızla doluyor. Erken rezervasyon yapmanızı öneririz. İstanbul'a uçuş arayanlar için uygun fiyatlı seçenekler mevcut.

## İpuçları

1. Hafta içi ziyaret edin
2. Sabah erken saatleri tercih edin
3. Fotoğraf makinenizi unutmayın
4. Piknik sepeti hazırlayın

Festival boyunca şehrin her köşesi ayrı bir güzellik sunuyor. Baharın tadını çıkarmak için İstanbul'u ziyaret etmeyi ihmal etmeyin!
    `,
    coverImage: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=1200&h=600&fit=crop',
    category: 'festival',
    city: 'İstanbul',
    citySlug: 'istanbul',
    author: {
      name: 'Ayşe Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      bio: 'Seyahat yazarı ve fotoğrafçı',
    },
    publishedAt: '2026-01-01',
    readingTime: 5,
    tags: ['istanbul', 'lale', 'festival', 'bahar', 'etkinlik'],
    relatedCities: ['istanbul'],
    featured: true,
  },
  {
    id: '2',
    slug: 'barcelona-la-merce-festivali',
    title: 'Barcelona La Mercè Festivali: Katalanların En Büyük Kutlaması',
    excerpt: 'Her yıl Eylül ayında Barcelona sokaklarını dolduran La Mercè Festivali, müzik, dans ve ateş gösterileriyle unutulmaz anlar sunuyor.',
    content: `
# Barcelona La Mercè Festivali

**La Mercè**, Barcelona'nın koruyucu azizesi Meryem Ana onuruna her yıl Eylül'ün son haftasında kutlanan dev bir sokak festivali.

## Festival Özellikleri

- **500+** ücretsiz etkinlik
- **200+** konser
- Dev kukla geçitleri (Gegants)
- Ateşli şeytanlar (Correfoc)

## Kaçırılmaması Gerekenler

### Correfoc (Ateş Koşusu)
Festivali'n en heyecan verici etkinliği. Şeytana benzeyen kostümlerle sokakları kaplayan dansçılar...

### Castells (İnsan Kuleleri)
UNESCO Dünya Mirası listesindeki gelenek.

### Açık Hava Konserleri
Barselona'nın en iyi meydanlarında ücretsiz konserler.

## Pratik Bilgiler

Festival döneminde şehir çok kalabalık oluyor. Uçuş ve otel rezervasyonlarınızı en az 2 ay önceden yapmanızı öneririz.
    `,
    coverImage: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&h=600&fit=crop',
    category: 'festival',
    city: 'Barselona',
    citySlug: 'barcelona',
    author: {
      name: 'Mehmet Demir',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      bio: 'Avrupa seyahat uzmanı',
    },
    publishedAt: '2025-12-28',
    readingTime: 6,
    tags: ['barcelona', 'ispanya', 'festival', 'la-merce', 'kultur'],
    relatedCities: ['barcelona'],
  },
  {
    id: '3',
    slug: 'dijital-gocebe-olmak-icin-en-iyi-sehirler',
    title: 'Dijital Göçebe Olmak İçin En İyi 10 Şehir',
    excerpt: 'Uzaktan çalışarak dünyayı gezmek mi istiyorsunuz? İşte dijital göçebeler için internet hızı, yaşam maliyeti ve yaşam kalitesi açısından en iyi şehirler.',
    content: `
# Dijital Göçebe Olmak İçin En İyi 10 Şehir

Remote çalışma kültürü yaygınlaştıkça, dünyayı gezerken çalışmak artık bir hayal değil. İşte dijital göçebeler için ideal şehirler:

## 1. Lizbon, Portekiz
- Uygun yaşam maliyeti
- Güçlü WiFi altyapısı
- Aktif göçebe topluluğu

## 2. Bali, Endonezya
- Düşük maliyetler
- Harika coworking alanları
- Cennet gibi doğa

## 3. Tiflis, Gürcistan
- Vizesiz 1 yıl kalış hakkı
- Çok düşük yaşam maliyeti
- Zengin mutfak kültürü

## 4. Berlin, Almanya
- Startup ekosistemi
- Kültürel çeşitlilik
- Merkezi konum

## 5. Bangkok, Tayland
- 7/24 yaşayan şehir
- Uygun fiyatlı
- Lezzetli sokak yemekleri

## Dijital Göçebe İpuçları

1. **VPN kullanın** - Güvenlik için şart
2. **Yerel SIM kart alın** - Mobil internet için
3. **Coworking üyeliği** - Profesyonel ortam
4. **Sağlık sigortası** - Mutlaka yaptırın

Hangi şehri seçerseniz seçin, planlı hareket edin ve yerel kültüre saygı gösterin!
    `,
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop',
    category: 'lifestyle',
    author: {
      name: 'Zeynep Kaya',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      bio: 'Dijital göçebe ve içerik üreticisi',
    },
    publishedAt: '2025-12-25',
    readingTime: 8,
    tags: ['dijital-gocebe', 'remote-calisma', 'seyahat', 'yasam-tarzi'],
    relatedCities: ['lisbon', 'berlin', 'tiflis', 'bangkok'],
    featured: true,
  },
  {
    id: '4',
    slug: 'roma-antik-kent-rehberi',
    title: 'Roma Antik Kent Rehberi: 2000 Yıllık Tarihe Yolculuk',
    excerpt: 'Kolezyum\'dan Pantheon\'a, Roma\'nın antik harikalarını keşfedin. Tarihi mekanları en verimli şekilde gezmenin ipuçları.',
    content: `
# Roma Antik Kent Rehberi

Ebedi Şehir Roma, her köşesinde tarihin izlerini taşıyor. İşte mutlaka görmeniz gereken antik yapılar:

## Kolezyum

Dünyanın en ünlü amfi tiyatrosu. 50.000 seyirci kapasiteli bu yapı, gladyatör dövüşlerine ev sahipliği yapıyordu.

**İpucu:** Roma Pass alarak kuyrukları atlayabilirsiniz.

## Forum Romanum

Antik Roma'nın kalbi. Tapınaklar, bazilkalar ve zafer takları burada.

## Pantheon

2000 yıldır ayakta duran mühendislik harikası. Ücretsiz giriş!

## Pratik Bilgiler

- **En iyi zaman:** İlkbahar ve sonbahar
- **Kaçının:** Ağustos ayı (çok sıcak ve kalabalık)
- **Giyim:** Rahat yürüyüş ayakkabısı şart

Roma'ya uçuşları karşılaştırmayı ve uygun otel bulmayı unutmayın!
    `,
    coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&h=600&fit=crop',
    category: 'culture',
    city: 'Roma',
    citySlug: 'roma',
    author: {
      name: 'Ali Öztürk',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      bio: 'Tarih meraklısı ve gezi yazarı',
    },
    publishedAt: '2025-12-20',
    readingTime: 7,
    tags: ['roma', 'italya', 'antik', 'tarih', 'kultur'],
    relatedCities: ['roma'],
  },
  {
    id: '5',
    slug: 'ucuz-ucak-bileti-bulma-taktikleri',
    title: 'Ucuz Uçak Bileti Bulma Taktikleri: 2026 Güncel Rehber',
    excerpt: 'Uçak bileti fiyatları cebinizi yakmasın! Profesyonellerin kullandığı tasarruf yöntemlerini öğrenin.',
    content: `
# Ucuz Uçak Bileti Bulma Taktikleri

Seyahat bütçenizin en büyük kalemini genellikle uçak biletleri oluşturur. İşte tasarruf yöntemleri:

## 1. Doğru Zamanda Arayın

- **Salı ve Çarşamba** günleri genelde daha ucuz
- Uçuştan **6-8 hafta** önce en iyi fiyatlar
- Gece yarısı fiyat güncellemelerini takip edin

## 2. Esnek Olun

- **±3 gün** esnek tarih araması yapın
- Alternatif havalimanlarını değerlendirin
- Tek yön biletleri karşılaştırın

## 3. Doğru Araçları Kullanın

WooNomad gibi karşılaştırma siteleri kullanarak tüm havayollarını tek seferde tarayabilirsiniz.

## 4. Mil ve Puan Programları

- Havayolu sadakat programlarına üye olun
- Kredi kartı bonuslarını değerlendirin

## 5. Hata Biletlerini Yakalayın

Bazen havayolları hatalı fiyat yayınlar. Bu fırsatları kaçırmamak için sosyal medyayı takip edin.

## Sonuç

Sabır ve doğru stratejiyle ciddi tasarruf yapabilirsiniz. Aramaya başlamak için ana sayfamızı ziyaret edin!
    `,
    coverImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=600&fit=crop',
    category: 'travel-tips',
    author: {
      name: 'Ayşe Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      bio: 'Seyahat yazarı ve fotoğrafçı',
    },
    publishedAt: '2025-12-15',
    readingTime: 6,
    tags: ['ucuz-bilet', 'tasarruf', 'ipuclari', 'ucak-bileti'],
  },
  {
    id: '6',
    slug: 'paris-gastronomi-rehberi',
    title: 'Paris Gastronomi Rehberi: Croissant\'dan Michelin Yıldızlı Restoranlara',
    excerpt: 'Işıklar şehrinde damak tadınıza hitap edecek en iyi mekanları keşfedin. Sokak lezzetlerinden fine dining\'e Paris mutfak turu.',
    content: `
# Paris Gastronomi Rehberi

Paris, sadece romantizmin değil, gastronominin de başkenti. İşte kaçırılmaması gereken lezzetler:

## Kahvaltı Klasikleri

### Croissant
En iyisini **Poilâne** veya **Du Pain et des Idées**'de bulabilirsiniz.

### Pain au Chocolat
Çikolatalı kruasan aşıkları için sabah ritüeli.

## Öğle Yemeği

- **Bistro:** Yerel atmosfer, uygun fiyat
- **Brasserie:** Daha geniş menü
- **Bouillon:** Geleneksel ve ekonomik

## Akşam Yemeği

### Michelin Deneyimi
**Le Jules Verne** - Eyfel Kulesi'nde yemek
**L'Ambroisie** - 3 yıldızlı klasik

### Yerel Favoriler
**Chez Janou** - En iyi çikolatalı mus
**Le Comptoir** - Rezervasyon şart!

## Sokak Lezzetleri

- Crêpe (Montmartre bölgesi)
- Falafel (Marais)
- Makaron (Ladurée)

## Pratik İpuçları

1. Rezervasyon yapın (özellikle akşam)
2. Öğlen menüleri daha uygun
3. Bahşiş servise dahil

Paris'e uçuşları karşılaştırarak seyahatinizi planlamaya başlayın!
    `,
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=600&fit=crop',
    category: 'food',
    city: 'Paris',
    citySlug: 'paris',
    author: {
      name: 'Zeynep Kaya',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      bio: 'Dijital göçebe ve içerik üreticisi',
    },
    publishedAt: '2025-12-10',
    readingTime: 7,
    tags: ['paris', 'fransa', 'yemek', 'gastronomi', 'restoran'],
    relatedCities: ['paris'],
  },
  // ===== NOMAD LIFE BLOG POSTS =====
  {
    id: '7',
    slug: 'dijital-gocebe-yasam-rehberi-2026',
    title: 'Dijital Göçebe Yaşam Rehberi 2026: Sıfırdan Başlayanlar İçin',
    excerpt: 'Uzaktan çalışarak dünyayı gezmek isteyenler için kapsamlı başlangıç rehberi. Vize, finans, sağlık ve iş yönetimi hakkında bilmeniz gerekenler.',
    content: `
# Dijital Göçebe Yaşam Rehberi 2026

Dijital göçebe olmak artık bir hayal değil, gerçek bir yaşam tarzı. İşte başlamanız için bilmeniz gerekenler.

## Dijital Göçebe Nedir?

Lokasyondan bağımsız çalışarak farklı ülkelerde yaşayan profesyoneller. Yazılımcılar, tasarımcılar, pazarlamacılar, yazarlar...

## İlk Adımlar

### 1. Remote İş Bulun
- Mevcut işinizi uzaktan yapmayı teklif edin
- Freelance platformlara kaydolun (Upwork, Toptal)
- Remote-first şirketlere başvurun

### 2. Finanslarınızı Düzenleyin
- 6 aylık acil durum fonu oluşturun
- Uluslararası banka kartları edinin (Wise, Revolut)
- Vergi durumunuzu araştırın

### 3. Sağlık Sigortası
- World Nomads, SafetyWing gibi göçebe sigortaları
- Türkiye'deki SGK durumunuz

## İlk Destinasyon Seçimi

Yeni başlayanlar için öneriler:
- **Lizbon** - Avrupa'da uygun fiyat
- **Bali** - Düşük maliyet, güçlü topluluk
- **Tiflis** - Vizesiz 1 yıl
- **Bangkok** - 7/24 altyapı

## Coworking Önerileri

Her şehirde güvenilir internet için coworking şart. WeWork, Regus veya yerel alternatifler.

Dijital göçebe hayatına hoş geldiniz!
    `,
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop',
    category: 'nomad',
    author: {
      name: 'Zeynep Kaya',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      bio: 'Dijital göçebe ve içerik üreticisi',
    },
    publishedAt: '2026-01-08',
    readingTime: 10,
    tags: ['dijital-gocebe', 'remote-calisma', 'baslangic', 'rehber'],
    featured: true,
  },
  {
    id: '8',
    slug: 'en-iyi-coworking-alanlari-avrupa',
    title: 'Avrupa\'nın En İyi 15 Coworking Alanı: Dijital Göçebeler İçin',
    excerpt: 'Hızlı internet, ergonomik çalışma ortamı ve networking fırsatları sunan Avrupa\'nın en iyi coworking mekanları.',
    content: `
# Avrupa'nın En İyi 15 Coworking Alanı

Dijital göçebe olarak Avrupa'da çalışırken verimli olabileceğiniz en iyi mekanlar.

## Lizbon, Portekiz

### 1. Heden
- **Fiyat:** €200/ay
- **Internet:** 500 Mbps
- **Atmosfer:** Startup vibes

### 2. Second Home
- **Fiyat:** €350/ay
- **Özellik:** Bitkilerle dolu tropikal ortam

## Berlin, Almanya

### 3. Factory Berlin
- **Fiyat:** €299/ay
- **Networking:** Startup ekosistemi

### 4. betahaus
- **Fiyat:** €229/ay
- **Topluluk:** Güçlü sosyal etkinlikler

## Barselona, İspanya

### 5. Aticco
- **Fiyat:** €250/ay
- **Konum:** Merkezi

### 6. MOB
- **Fiyat:** €180/ay
- **Vibe:** Sanatsal

## Amsterdam, Hollanda

### 7. B. Amsterdam
- **Fiyat:** €300/ay
- **Boyut:** Avrupa'nın en büyüklerinden

## Budapeşte, Macaristan

### 8. Loffice
- **Fiyat:** €120/ay
- **Avantaj:** Çok uygun fiyat

## İpuçları

- Haftalık geçişle başlayın
- Sessiz alanları tercih edin
- Kahve kalitesini test edin!
    `,
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop',
    category: 'nomad',
    author: {
      name: 'Ali Öztürk',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      bio: 'Tarih meraklısı ve gezi yazarı',
    },
    publishedAt: '2026-01-07',
    readingTime: 8,
    tags: ['coworking', 'avrupa', 'dijital-gocebe', 'calisma-alani'],
    relatedCities: ['lisbon', 'berlin', 'barcelona', 'amsterdam'],
  },
  {
    id: '9',
    slug: 'dijital-gocebe-vize-rehberi',
    title: 'Dijital Göçebe Vizesi: Hangi Ülkeler Sunuyor?',
    excerpt: '2026\'da dijital göçebelere özel vize sunan 30+ ülke ve başvuru şartları. Portekiz\'den Endonezya\'ya detaylı rehber.',
    content: `
# Dijital Göçebe Vizesi Rehberi 2026

Birçok ülke artık dijital göçebelere özel vize programları sunuyor.

## Avrupa

### Portekiz D7 Vizesi
- **Süre:** 2 yıl (yenilenebilir)
- **Gelir şartı:** €760/ay
- **Vergi:** Yıllık 20%

### İspanya Dijital Göçebe Vizesi
- **Süre:** 1 yıl (3 yıla uzatılabilir)
- **Gelir şartı:** €2,520/ay
- **Avantaj:** Schengen erişimi

### Hırvatistan
- **Süre:** 1 yıl
- **Gelir şartı:** €2,470/ay
- **Vergi:** Yok!

### Estonya
- **Süre:** 1 yıl
- **Gelir şartı:** €4,500/ay
- **Dijital:** Tamamen online başvuru

## Asya

### Endonezya (Bali)
- **Süre:** 5 yıl çoklu giriş
- **Gelir şartı:** Yok
- **Vergi:** Yurtdışı gelirlerde yok

### Tayland
- **Süre:** 10 yıl
- **Gelir şartı:** $80,000/yıl
- **Avantaj:** Sınırsız giriş-çıkış

## Vizesiz Seçenekler

- **Gürcistan:** 1 yıl vizesiz
- **Arnavutluk:** 1 yıl vizesiz
- **Sırbistan:** 90 gün vizesiz

Türk pasaportu ile en avantajlı destinasyonlar bunlar!
    `,
    coverImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=600&fit=crop',
    category: 'nomad',
    author: {
      name: 'Mehmet Demir',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      bio: 'Avrupa seyahat uzmanı',
    },
    publishedAt: '2026-01-06',
    readingTime: 12,
    tags: ['vize', 'dijital-gocebe', 'pasaport', 'ulkeler'],
    featured: true,
  },
  {
    id: '10',
    slug: 'remote-calisma-uretkenlik-ipuclari',
    title: 'Remote Çalışırken Üretken Kalmanın 20 Yolu',
    excerpt: 'Evden veya kafeden çalışırken odaklanmak zor olabilir. İşte profesyonellerin kullandığı üretkenlik teknikleri.',
    content: `
# Remote Çalışırken Üretken Kalmanın 20 Yolu

Dijital göçebe hayatının en büyük zorluklarından biri üretkenlik. İşte kanıtlanmış çözümler.

## Çalışma Ortamı

1. **Ayrı bir çalışma alanı oluşturun**
2. **Ergonomik oturuş pozisyonu**
3. **İyi aydınlatma**
4. **Gürültü engelleyici kulaklık**

## Zaman Yönetimi

5. **Pomodoro Tekniği** (25 dk çalış, 5 dk ara)
6. **Time blocking** ile gününüzü planlayın
7. **Deep work saatleri** belirleyin
8. **Toplantıları günün belirli saatlerine sıkıştırın**

## Dijital Araçlar

9. **Notion** - Not ve proje yönetimi
10. **Todoist** - Görev takibi
11. **Forest** - Telefon bağımlılığını azaltma
12. **RescueTime** - Zaman analizi

## Sağlık

13. **Düzenli molalar**
14. **Egzersiz rutini**
15. **Yeterli uyku**
16. **Su içmeyi unutmayın**

## Sosyal

17. **Coworking kullanın**
18. **Nomad buluşmalarına katılın**
19. **Online topluluklar** (Nomad List, Reddit)
20. **Mentör veya accountability partner bulun**

## Bonus: Saat Dilimi Yönetimi

Müşterilerinizin saat dilimini takip edin. Google Calendar'da birden fazla saat dilimi gösterin.

Üretkenlik bir alışkanlıktır. Sabırlı olun!
    `,
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=600&fit=crop',
    category: 'nomad',
    author: {
      name: 'Zeynep Kaya',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      bio: 'Dijital göçebe ve içerik üreticisi',
    },
    publishedAt: '2026-01-05',
    readingTime: 7,
    tags: ['uretkenlik', 'remote-calisma', 'zaman-yonetimi', 'araclar'],
  },
  {
    id: '11',
    slug: 'bali-dijital-gocebe-rehberi',
    title: 'Bali Dijital Göçebe Rehberi: Cennet\'te Çalışmak',
    excerpt: 'Canggu, Ubud, Seminyak... Bali\'nin nomad bölgeleri, coworking alanları, yaşam maliyeti ve pratik ipuçları.',
    content: `
# Bali Dijital Göçebe Rehberi

Bali, dijital göçebelerin cenneti. İşte bilmeniz gerekenler.

## Neden Bali?

- Düşük yaşam maliyeti
- Güçlü nomad topluluğu
- Harika hava
- Zengin kültür

## En İyi Bölgeler

### Canggu
- **Profil:** Sörfçü, genç, dinamik
- **Coworking:** Dojo, Outpost
- **Fiyat:** Orta

### Ubud
- **Profil:** Yoga, doğa, sakinlik
- **Coworking:** Outpost Ubud, Hubud
- **Fiyat:** Uygun

### Seminyak
- **Profil:** Lüks, beach club
- **Coworking:** Az seçenek
- **Fiyat:** Yüksek

## Yaşam Maliyeti (Aylık)

| Kalem | Maliyet |
|-------|---------|
| Konaklama | $400-800 |
| Yemek | $200-400 |
| Coworking | $100-200 |
| Scooter | $50-80 |
| Toplam | $750-1480 |

## Pratik İpuçları

1. **Scooter kullanımı** - Ehliyet şart (uluslararası)
2. **SIM kart** - Telkomsel veya XL
3. **Para çekme** - ATM limitleri düşük
4. **Sağlık** - Bali belly'e dikkat!

## Vize

B211A vizesi ile 6 ay kalabilirsiniz (yenilenebilir).

Bali sizi bekliyor!
    `,
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&h=600&fit=crop',
    category: 'nomad',
    city: 'Bali',
    citySlug: 'bali',
    author: {
      name: 'Ayşe Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      bio: 'Seyahat yazarı ve fotoğrafçı',
    },
    publishedAt: '2026-01-04',
    readingTime: 9,
    tags: ['bali', 'endonezya', 'dijital-gocebe', 'asya'],
    featured: true,
  },
  {
    id: '12',
    slug: 'tiflis-dijital-gocebe-rehberi',
    title: 'Tiflis: Avrupa\'nın En Uygun Fiyatlı Nomad Cenneti',
    excerpt: 'Vizesiz 1 yıl kalış hakkı, düşük maliyetler, lezzetli mutfak. Gürcistan\'ın başkenti Tiflis\'te göçebe hayatı.',
    content: `
# Tiflis Dijital Göçebe Rehberi

Gürcistan, Türk vatandaşları için en cazip destinasyonlardan biri. 1 yıl vizesiz!

## Neden Tiflis?

- **1 yıl vizesiz** kalış hakkı
- **Çok düşük maliyetler**
- **Harika şarap ve yemek**
- **Türkiye'ye yakın** (2 saat uçuş)

## Yaşam Maliyeti (Aylık)

| Kalem | Maliyet |
|-------|---------|
| Daire (1+1) | $300-500 |
| Yemek | $150-250 |
| Ulaşım | $20-40 |
| Coworking | $80-150 |
| Toplam | $550-940 |

## En İyi Mahalleler

### Fabrika
- Hipster merkezi
- Coworking ve kafeler
- Gece hayatı

### Vera
- Sakin, yeşil
- Aileler için uygun

### Sololaki
- Tarihi merkezde
- Turistik ama güzel

## Coworking Alanları

- **Impact Hub Tbilisi** - En popüler
- **Terminal** - Merkezi
- **Lokal** - Uygun fiyatlı

## Mutfak Deneyimi

- **Hinkali** (mantı benzeri)
- **Khachapuri** (peynirli ekmek)
- **Şarap** (8000 yıllık gelenek)

## Dikkat Edilmesi Gerekenler

- Kışlar soğuk (-5°C)
- İngilizce sınırlı olabilir
- Sağlık hizmetleri gelişmekte

Tiflis, bütçe dostu nomadlar için ideal!
    `,
    coverImage: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1200&h=600&fit=crop',
    category: 'nomad',
    city: 'Tiflis',
    citySlug: 'tiflis',
    author: {
      name: 'Mehmet Demir',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      bio: 'Avrupa seyahat uzmanı',
    },
    publishedAt: '2026-01-03',
    readingTime: 8,
    tags: ['tiflis', 'gurcistan', 'dijital-gocebe', 'dusuk-maliyet'],
  },
  {
    id: '13',
    slug: 'dijital-gocebe-saglik-sigortasi',
    title: 'Dijital Göçebeler İçin Sağlık Sigortası Rehberi',
    excerpt: 'World Nomads, SafetyWing, Passport Card... Uzun süreli seyahat edenlerin sigortası seçerken bilmesi gerekenler.',
    content: `
# Dijital Göçebe Sağlık Sigortası Rehberi

Yurtdışında sağlık harcamaları çok yüksek olabilir. Doğru sigorta hayat kurtarır.

## Neden Önemli?

- ABD'de basit bir ameliyat: $50,000+
- Avrupa'da hastane: €5,000+
- Tahliye maliyeti: $100,000+

## En İyi Seçenekler

### SafetyWing
- **Fiyat:** $45/ay
- **Kapsam:** Tıbbi + seyahat
- **Avantaj:** Esnek başlatma/durdurma
- **Dezavantaj:** Kronik hastalık kapsamı sınırlı

### World Nomads
- **Fiyat:** Değişken (destination'a göre)
- **Kapsam:** Kapsamlı
- **Avantaj:** Aktivite sporları dahil
- **Dezavantaj:** Uzun süreli için pahalı

### Passport Card
- **Fiyat:** €80/ay
- **Kapsam:** Global
- **Avantaj:** Türkiye ve AB'de geçerli
- **Dezavantaj:** Başvuru süreci

## Nelere Dikkat Edilmeli?

1. **Coğrafi kapsam** - ABD dahil mi?
2. **Maksimum limit** - En az $1M
3. **Muafiyet (deductible)**
4. **Mevcut hastalıklar**
5. **Spor aktiviteleri**
6. **Diş tedavisi**

## Türk SGK

- Yurtdışında tedavi için ön onay gerekir
- Kapsam sınırlı
- Özel sigorta şart

## Önerim

SafetyWing ile başlayın, deneyim kazandıkça değerlendirin.
    `,
    coverImage: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1200&h=600&fit=crop',
    category: 'nomad',
    author: {
      name: 'Zeynep Kaya',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      bio: 'Dijital göçebe ve içerik üreticisi',
    },
    publishedAt: '2026-01-02',
    readingTime: 9,
    tags: ['sigorta', 'saglik', 'dijital-gocebe', 'guvenlik'],
  },
  {
    id: '14',
    slug: 'nomad-finans-yonetimi',
    title: 'Dijital Göçebe Finans Yönetimi: Wise, Revolut ve Daha Fazlası',
    excerpt: 'Birden fazla ülkede para yönetimi, döviz, uluslararası transferler ve vergi konularında rehber.',
    content: `
# Dijital Göçebe Finans Yönetimi

Para yönetimi dijital göçebe hayatının en kritik konularından.

## Uluslararası Banka Kartları

### Wise (TransferWise)
- **Avantaj:** En iyi döviz kuru
- **Kart:** Çoklu para birimi
- **Transfer:** Hızlı ve ucuz
- **Türkiye:** Hesap açılabilir

### Revolut
- **Avantaj:** Kripto ve hisse senedi
- **Kart:** Metal seçeneği
- **Premium:** €7.99/ay ile ek özellikler
- **Dikkat:** Türk vatandaşlarına sınırlı

### N26
- **Avantaj:** Alman bankası güvenliği
- **Kart:** Şık tasarım
- **Dezavantaj:** Sadece AB/İngiltere

## Döviz Stratejileri

1. **Kazancınızı güçlü para biriminde tutun** (USD, EUR)
2. **Yerel harcamalar için lokal para**
3. **ATM'den büyük miktarda çekin** (komisyon azaltma)
4. **Dinamik döviz reddedin** (ödeme terminallerinde)

## Vergi Konuları

### Türkiye'de Mükelleflik
- 183 günden fazla Türkiye'de = vergi mükellefi
- Yurtdışı gelirler beyan edilmeli

### Vergi Cenneti Ülkeler
- **Portekiz NHR:** 10 yıl düşük vergi
- **Paraguay:** Yurtdışı gelire %0
- **Gürcistan:** Düşük vergi

## Fatura ve Ödeme

- Stripe Atlas (ABD şirketi)
- Payoneer
- PayPal Business

## Acil Durum Fonu

En az 6 aylık harcamayı likit tutun!
    `,
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop',
    category: 'nomad',
    author: {
      name: 'Ali Öztürk',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      bio: 'Tarih meraklısı ve gezi yazarı',
    },
    publishedAt: '2025-12-30',
    readingTime: 11,
    tags: ['finans', 'banka', 'doviz', 'dijital-gocebe'],
  },
  {
    id: '15',
    slug: 'lizbon-dijital-gocebe-rehberi',
    title: 'Lizbon Dijital Göçebe Rehberi: Avrupa\'nın Güneşli Başkenti',
    excerpt: 'Portekiz\'in renkli başkenti Lizbon\'da çalışmak ve yaşamak. Mahalleler, coworking, yemek ve yerel ipuçları.',
    content: `
# Lizbon Dijital Göçebe Rehberi

Lizbon, Avrupa'nın en popüler dijital göçebe destinasyonlarından. İşte bilmeniz gerekenler.

## Neden Lizbon?

- **Harika hava** (yılda 300 gün güneş)
- **Güçlü topluluk** (çok sayıda nomad)
- **Uygun fiyatlar** (Batı Avrupa'ya göre)
- **İngilizce yaygın**
- **D7 vizesi** imkanı

## En İyi Mahalleler

### Alfama
- Tarihi atmosfer
- Dar sokaklar, tramvay
- Turistik ama otantik

### Bairro Alto
- Gece hayatı merkezi
- Genç kitle
- Gürültülü olabilir

### Príncipe Real
- Hipster favori
- Kafeler, butikler
- Coworking seçenekleri

### Cais do Sodré
- LX Factory yakın
- Time Out Market
- Dinamik

## Coworking Alanları

- **Heden** - €200/ay, modern
- **Second Home** - €350/ay, tropikal
- **Cowork Central** - €180/ay, merkezi

## Yaşam Maliyeti (Aylık)

| Kalem | Maliyet |
|-------|---------|
| Daire (1+1) | €800-1200 |
| Yemek | €300-400 |
| Metro kartı | €40 |
| Coworking | €200 |
| Toplam | €1340-1840 |

## Yemek Önerileri

- **Pastel de Nata** - Her sabah şart
- **Bacalhau** - Portekiz'in ikon balığı
- **Francesinha** - Porto'dan ama Lizbon'da da var

Lizbon sizi bekliyor!
    `,
    coverImage: 'https://images.unsplash.com/photo-1536663815808-535e2280d2c2?w=1200&h=600&fit=crop',
    category: 'nomad',
    city: 'Lizbon',
    citySlug: 'lisbon',
    author: {
      name: 'Ayşe Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      bio: 'Seyahat yazarı ve fotoğrafçı',
    },
    publishedAt: '2025-12-28',
    readingTime: 9,
    tags: ['lizbon', 'portekiz', 'dijital-gocebe', 'avrupa'],
    featured: true,
  },
  {
    id: '16',
    slug: 'slow-travel-nedir',
    title: 'Slow Travel Nedir? Dijital Göçebeler İçin Yavaş Seyahat',
    excerpt: 'Her hafta şehir değiştirmek yerine aylarca tek yerde kalmak. Slow travel\'ın faydaları ve nasıl yapılacağı.',
    content: `
# Slow Travel: Yavaş Seyahatin Güzelliği

Sürekli hareket etmek yerine bir yere yerleşmek ve gerçekten yaşamak.

## Slow Travel Nedir?

- En az **1 ay** bir yerde kalmak
- Turist gibi değil, **yerel gibi** yaşamak
- **Derin bağlantılar** kurmak
- **Sürdürülebilir** seyahat

## Avantajları

### Maliyet
- Uzun süreli kiralama indirimi (%30-50)
- Yerel pazarlardan alışveriş
- Daha az ulaşım masrafı

### Verimlilik
- Rutin oluşturma
- İş-yaşam dengesi
- Daha az karar yorgunluğu

### Deneyim
- Yerel arkadaşlar
- Gizli mekanları keşfet
- Dil öğrenme fırsatı

## Nasıl Yapılır?

1. **Bir şehir seçin** (başlangıç için 2 ay planlayın)
2. **Uzun süreli konaklama bulun** (Airbnb monthly)
3. **Rutin oluşturun** (kahve, spor, iş)
4. **Topluluğa katılın** (meetup, coworking)
5. **Yerel olun** (market, esnaf, komşular)

## En İyi Slow Travel Destinasyonları

- **Lizbon** - 2-3 ay ideal
- **Chiang Mai** - 3+ ay bütçe dostu
- **Buenos Aires** - 2-4 ay kültür dolu
- **Split** - Yaz ayları 2 ay

## Benim Deneyimim

Lizbon'da 3 ay kaldım. İlk hafta turist, sonraki haftalar yerel gibi hissettim. Favori kafem, berberim, pazarcım oldu.

Slow travel hayatınızı değiştirir!
    `,
    coverImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&h=600&fit=crop',
    category: 'nomad',
    author: {
      name: 'Zeynep Kaya',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      bio: 'Dijital göçebe ve içerik üreticisi',
    },
    publishedAt: '2025-12-25',
    readingTime: 7,
    tags: ['slow-travel', 'yavas-seyahat', 'dijital-gocebe', 'yasam-tarzi'],
  },
  {
    id: '17',
    slug: 'dijital-gocebe-ekipmanlari',
    title: 'Dijital Göçebe Ekipman Listesi: Minimalist ve Etkili',
    excerpt: 'Laptop, çanta, adaptör, kulaklık... Uzun süreli seyahat için gereken tüm teknoloji ve ekipmanlar.',
    content: `
# Dijital Göçebe Ekipman Listesi

Minimalist ama eksiksiz bir setup ile her yerde çalışabilirsiniz.

## Temel Teknoloji

### Laptop
- **MacBook Air M2** - Hafif, güçlü, uzun pil
- **ThinkPad X1 Carbon** - İş odaklı Windows
- **Alternatif:** Framework Laptop (tamir edilebilir)

### Aksesuarlar
- **Laptop standı** (Roost veya Nexstand)
- **Bluetooth klavye** (Logitech MX Keys Mini)
- **Mouse** (Logitech MX Anywhere 3)
- **USB-C hub** (Anker 7-in-1)

### Ses
- **Noise-cancelling kulaklık** (Sony WH-1000XM5)
- **Earbuds** (AirPods Pro 2)
- **Mikrofon** (Rode Wireless Go II)

## Güç ve Bağlantı

- **Universal adaptör** (Cepte 3 şekil)
- **Powerbank** (20,000mAh minimum)
- **Uzatma kablosu** (hafif, kısa)
- **Mobile hotspot** veya eSIM

## Çanta Seçimi

### Carry-on Sırt Çantası
- **Peak Design Travel** (45L)
- **Minaal Carry-on 3.0** (35L)
- **Aer Travel Pack 3** (35L)

### Packing Cubes
Organizasyon için şart!

## Güvenlik

- **VPN aboneliği** (ExpressVPN, NordVPN)
- **Password manager** (1Password)
- **2FA cihazı** (YubiKey)
- **Laptop kilidi** (Kensington)

## Sağlık

- **Mavi ışık gözlüğü**
- **Ergonomik bilek desteği**
- **Portatif ayakta çalışma standı**

## Minimalizm İpucu

Her şeyi 7-10 kg'a sığdırın. Daha az eşya = daha fazla özgürlük!
    `,
    coverImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=600&fit=crop',
    category: 'nomad',
    author: {
      name: 'Ali Öztürk',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      bio: 'Tarih meraklısı ve gezi yazarı',
    },
    publishedAt: '2025-12-22',
    readingTime: 8,
    tags: ['ekipman', 'teknoloji', 'dijital-gocebe', 'minimalizm'],
  },
  {
    id: '18',
    slug: 'coliving-nedir-en-iyi-mekanlar',
    title: 'Coliving Nedir? Dijital Göçebeler İçin En İyi Coliving Mekanları',
    excerpt: 'Konaklama, çalışma alanı ve topluluk bir arada. Coliving kavramı ve dünyanın en iyi coliving mekanları.',
    content: `
# Coliving: Çalışmak ve Yaşamak Bir Arada

Coliving, dijital göçebelerin hayatını kolaylaştıran modern bir konsept.

## Coliving Nedir?

- **Paylaşımlı yaşam alanları**
- **Dahil coworking**
- **Topluluk etkinlikleri**
- **Esnek kiralama** (1 hafta - 6 ay)
- **Her şey dahil** fiyatlandırma

## Avantajları

1. **Yalnızlık yok** - Anında topluluk
2. **Kolay** - Tek fatura, her şey dahil
3. **Networking** - İş fırsatları
4. **Esneklik** - Kısa süreli kiralama
5. **Kaliteli** - Profesyonel yönetim

## En İyi Coliving Markaları

### Selina
- **Lokasyonlar:** Global (50+ ülke)
- **Fiyat:** $500-1500/ay
- **Özellik:** Surf, yoga dahil

### Outsite
- **Lokasyonlar:** ABD, Avrupa, Güney Amerika
- **Fiyat:** $1200-2500/ay
- **Özellik:** Premium lokasyonlar

### Roam
- **Lokasyonlar:** Bali, Miami, Tokyo
- **Fiyat:** $1800+/ay
- **Özellik:** Lüks segment

### Sun and Co
- **Lokasyon:** İspanya (Javea)
- **Fiyat:** €800/ay
- **Özellik:** Küçük, samimi topluluk

## Dikkat Edilecekler

- **Gürültü seviyeleri**
- **Özel oda vs paylaşımlı**
- **İnternet hızı**
- **İptal politikası**
- **Minimum kalış süresi**

## Alternatifler

- **Hostel + Coworking** kombinasyonu
- **Airbnb + günlük coworking**
- **Yerel ev paylaşımı**

Coliving, nomad hayatının en kolay başlangıcı!
    `,
    coverImage: 'https://images.unsplash.com/photo-1529408632839-a54952c491e5?w=1200&h=600&fit=crop',
    category: 'nomad',
    author: {
      name: 'Mehmet Demir',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      bio: 'Avrupa seyahat uzmanı',
    },
    publishedAt: '2025-12-20',
    readingTime: 8,
    tags: ['coliving', 'konaklama', 'dijital-gocebe', 'topluluk'],
  },
  {
    id: '19',
    slug: 'dijital-gocebe-sozlugu',
    title: 'Dijital Göçebe Sözlüğü: Bilmeniz Gereken 50 Terim',
    excerpt: 'Remote work, coliving, digital detox, workcation... Nomad dünyasının tüm terimleri ve anlamları.',
    content: `
# Dijital Göçebe Sözlüğü

Nomad dünyasına hoş geldiniz! İşte bilmeniz gereken terimler.

## Çalışma Terimleri

1. **Remote Work** - Uzaktan çalışma
2. **Async Work** - Eş zamansız çalışma
3. **Deep Work** - Kesintisiz odaklanmış çalışma
4. **Digital Detox** - Dijital detoks
5. **Workation** - Çalışma + tatil
6. **Bleisure** - Business + leisure
7. **Side Hustle** - Yan iş
8. **Gig Economy** - Proje bazlı ekonomi
9. **Freelancer** - Serbest çalışan
10. **Solopreneur** - Tek kişilik girişimci

## Yaşam Tarzı

11. **Slow Travel** - Yavaş seyahat
12. **Coliving** - Ortak yaşam alanı
13. **Coworking** - Ortak çalışma alanı
14. **Location Independent** - Lokasyondan bağımsız
15. **Perpetual Traveler** - Sürekli gezgin
16. **Flag Theory** - Çoklu ülke stratejisi
17. **Geo-Arbitrage** - Coğrafi arbitraj
18. **Digital Minimalism** - Dijital minimalizm

## Vize ve Yasal

19. **Digital Nomad Visa** - Göçebe vizesi
20. **Remote Work Visa** - Uzaktan çalışma vizesi
21. **Tax Residency** - Vergi mukimliği
22. **Perpetual Tourist** - Sürekli turist
23. **Visa Run** - Vize yenileme seyahati
24. **E-Residency** - Dijital vatandaşlık (Estonya)

## Finans

25. **Geo-Arbitrage** - Ucuz ülkede yaşayıp zengin ülkeye çalışmak
26. **FIRE** - Financial Independence Retire Early
27. **Passive Income** - Pasif gelir
28. **Multiple Streams** - Çoklu gelir kaynağı

## Topluluk

29. **Nomad List** - Nomad şehir veritabanı
30. **Workaway** - Çalışma karşılığı konaklama
31. **Couchsurfing** - Ücretsiz konaklama ağı
32. **Meetup** - Yerel buluşma platformu

## Daha fazlası var ama bunlar temel!
    `,
    coverImage: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1200&h=600&fit=crop',
    category: 'nomad',
    author: {
      name: 'Zeynep Kaya',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      bio: 'Dijital göçebe ve içerik üreticisi',
    },
    publishedAt: '2025-12-18',
    readingTime: 10,
    tags: ['sozluk', 'terimler', 'dijital-gocebe', 'egitim'],
  },
  {
    id: '20',
    slug: 'nomad-iliskileri-ve-arkadas-bulma',
    title: 'Dijital Göçebe Olarak Arkadaş Bulmak ve İlişki Yönetimi',
    excerpt: 'Sürekli hareket ederken dostluklar kurmak, romantik ilişkiler ve yalnızlıkla başa çıkma stratejileri.',
    content: `
# Dijital Göçebe İlişkileri

Nomad hayatının en zor yanlarından biri: sosyal bağlar.

## Yalnızlık Gerçeği

Kabul edelim, sürekli seyahat yalnızlaştırabilir:
- Derin arkadaşlıklar kurmak zor
- Aile ve eski arkadaşlardan uzak
- Sürekli veda etmek yorucu

## Arkadaş Bulma Stratejileri

### Coworking Kullanın
En kolay yol! Her gün aynı insanları görüyorsunuz.

### Nomad Toplulukları
- **Nomad List Slack** - 30,000+ üye
- **Reddit r/digitalnomad** - Sorular ve paylaşımlar
- **Facebook grupları** - Şehir bazlı gruplar

### Meetup.com
Her şehirde etkinlikler var. Dil değişimi, hiking, tech meetup...

### Spor ve Hobiler
- Yoga stüdyoları
- Surf okulları
- Koşu grupları
- Dil kursları

## Romantik İlişkiler

### Başka Bir Nomad ile
- **Avantaj:** Yaşam tarzını anlıyor
- **Zorluk:** Farklı yönlere gidebilirsiniz

### Yerel Biriyle
- **Avantaj:** Kültür deneyimi
- **Zorluk:** Uzun mesafe veya yerleşme kararı

### Uzun Mesafe
- Düzenli video görüşmeleri
- Ortak hedefler belirleyin
- Buluşma planları yapın

## Eski Arkadaşlarla Bağ

- Düzenli video call planlayın
- Yıllık buluşmalar organize edin
- Sosyal medya güncellemeleri
- Onlara hediye gönderin

## Yalnızlıkla Başa Çıkma

1. **Rutin oluşturun**
2. **Topluluk aktivitelerine katılın**
3. **Slow travel yapın** (1+ ay)
4. **Coliving deneyin**
5. **Profesyonel yardım alın** (terapist)

Yalnızlık geçici, bağlantılar kalıcı!
    `,
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=600&fit=crop',
    category: 'nomad',
    author: {
      name: 'Ayşe Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      bio: 'Seyahat yazarı ve fotoğrafçı',
    },
    publishedAt: '2025-12-15',
    readingTime: 9,
    tags: ['iliskiler', 'arkadaslik', 'dijital-gocebe', 'mental-saglik'],
  },
  {
    id: '21',
    slug: 'bangkok-dijital-gocebe-rehberi',
    title: 'Bangkok Dijital Göçebe Rehberi: 7/24 Yaşayan Şehir',
    excerpt: 'Tayland\'ın kaotik ama büyüleyici başkentinde çalışmak. Mahalleler, internet, yemek ve yaşam maliyeti.',
    content: `
# Bangkok Dijital Göçebe Rehberi

Bangkok, Güneydoğu Asya'nın kalbi. Kaotik, renkli ve çok uygun fiyatlı.

## Neden Bangkok?

- **Çok düşük maliyetler**
- **Mükemmel yemek** (sokak lezzetleri)
- **7/24 uyanık** şehir
- **Harika ulaşım** (BTS, MRT)
- **Hızlı internet**

## En İyi Mahalleler

### Ekkamai/Thonglor
- Hipster merkezi
- Kafeler, barlar
- Expat friendly

### Ari
- Sakin, yeşil
- Yerel atmosfer
- Uygun fiyatlı

### Silom/Sathorn
- İş merkezi
- Gökdelenler
- Uluslararası şirketler

### Sukhumvit
- Uzun cadde
- Her şey var
- Farklı bölümler farklı karakterde

## Coworking Alanları

- **AIS D.C.** - Ücretsiz! (AIS SIM ile)
- **HUBBA** - Thailand'ın en büyüğü
- **Launchpad** - Startup odaklı
- **WeWork** - Premium

## Yaşam Maliyeti (Aylık)

| Kalem | Maliyet |
|-------|---------|
| Daire (stüdyo) | $300-600 |
| Yemek (sokak) | $100-200 |
| Ulaşım (BTS) | $30-50 |
| Coworking | $100-200 |
| Toplam | $530-1050 |

## Pratik İpuçları

- **Grab** - Uber yerine
- **7-Eleven** - Her köşede ATM, kahve
- **AIS SIM** - Turist paketi uygun
- **Massaj** - Haftada 2-3 kez ($5-10!)

## Vize

30 gün vizesiz, uzatma ile 60 gün, sonra visa run.

Bangkok'un kaosuna hazır mısınız?
    `,
    coverImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&h=600&fit=crop',
    category: 'nomad',
    city: 'Bangkok',
    citySlug: 'bangkok',
    author: {
      name: 'Mehmet Demir',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      bio: 'Avrupa seyahat uzmanı',
    },
    publishedAt: '2025-12-12',
    readingTime: 8,
    tags: ['bangkok', 'tayland', 'dijital-gocebe', 'asya'],
  },
  {
    id: '22',
    slug: 'freelance-is-bulma-platformlari',
    title: 'Freelance İş Bulma: En İyi 15 Platform ve Stratejiler',
    excerpt: 'Upwork, Fiverr, Toptal ve daha fazlası. Freelance iş bulmak için platform karşılaştırması ve başarı taktikleri.',
    content: `
# Freelance İş Bulma Rehberi

Remote iş bulmanın en yaygın yolu freelance platformları.

## Platform Karşılaştırması

### Upwork
- **İçin:** Genel freelance
- **Komisyon:** %20 → %10 → %5
- **Rekabet:** Yüksek
- **İpucu:** Niş alanında uzmanlaşın

### Fiverr
- **İçin:** Hızlı, tek seferlik işler
- **Komisyon:** %20
- **Avantaj:** Gig tabanlı satış
- **Dikkat:** Fiyat yarışı riski

### Toptal
- **İçin:** Üst düzey yazılım/tasarım
- **Komisyon:** Yok (müşteriden alınır)
- **Giriş:** Zorlu mülakatlar
- **Ücretler:** Çok yüksek ($60-200/saat)

### 99designs
- **İçin:** Tasarım yarışmaları
- **Model:** Yarışma veya doğrudan
- **İpucu:** Portföy çok önemli

### Contra
- **İçin:** Komisyonsuz freelance
- **Komisyon:** %0!
- **Özellik:** Portföy showcase

## Niş Platformlar

- **Dribbble** - Tasarımcılar
- **GitHub Jobs** - Yazılımcılar
- **Contently** - İçerik yazarları
- **CloudPeeps** - Pazarlama
- **FlexJobs** - Remote işler

## Başarı Stratejileri

### Profil Optimizasyonu
1. Profesyonel fotoğraf
2. Spesifik başlık (örn: "B2B SaaS SEO Uzmanı")
3. Sonuç odaklı açıklama
4. Portföy örnekleri

### Teklif Yazma
1. Müşterinin sorununa odaklanın
2. İlgili deneyim paylaşın
3. Sorular sorun
4. Kısa ve öz tutun

### Fiyatlandırma
- Saatlik yerine proje bazlı tercih edin
- Değer odaklı fiyatlandırma
- Başlangıçta düşük, yorum kazanın

## Alternatif: Doğrudan Müşteri

- LinkedIn outreach
- Content marketing
- Referanslar
- Cold email

Freelance başarı sabır ister!
    `,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
    category: 'nomad',
    author: {
      name: 'Ali Öztürk',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      bio: 'Tarih meraklısı ve gezi yazarı',
    },
    publishedAt: '2025-12-10',
    readingTime: 10,
    tags: ['freelance', 'is-bulma', 'dijital-gocebe', 'platformlar'],
  },
  {
    id: '23',
    slug: 'dijital-gocebe-hatalari',
    title: 'Dijital Göçebe Olarak Yapılan 15 Büyük Hata',
    excerpt: 'Deneyimli nomadların yaptığı hatalardan ders alın. Vize sorunlarından burnout\'a kadar kaçınılması gerekenler.',
    content: `
# Dijital Göçebe Hataları

Tecrübeli nomadların düştüğü tuzaklar ve nasıl kaçınılacağı.

## Finansal Hatalar

### 1. Acil Durum Fonu Olmadan Başlamak
**Çözüm:** En az 6 aylık harcamayı yedekte tutun.

### 2. Döviz Kuru Planlaması Yapmamak
**Çözüm:** Wise/Revolut kullanın, yerel paraya çevirmeden harcayın.

### 3. Vergi Konusunu İhmal Etmek
**Çözüm:** Bir muhasebeci ile çalışın, vergi mukimliğinizi netleştirin.

## Vize Hataları

### 4. Vize Süresini Aşmak
**Çözüm:** Takvim hatırlatıcıları kurun, visa run planlayın.

### 5. Vize Kurallarını Araştırmamak
**Çözüm:** Her ülke için resmi kaynaklardan kontrol edin.

## Sağlık Hataları

### 6. Sigorta Yaptırmamak
**Çözüm:** SafetyWing veya World Nomads minimum.

### 7. Mental Sağlığı İhmal Etmek
**Çözüm:** Rutin, egzersiz, topluluk, gerekirse terapi.

## Çalışma Hataları

### 8. İş-Yaşam Dengesi Kurmamak
**Çözüm:** Çalışma saatleri belirleyin, laptop'u kapatın.

### 9. Sadece Kafelerden Çalışmak
**Çözüm:** Coworking üyeliği alın, güvenilir internet garantisi.

### 10. Burnout'a Kadar Çalışmak
**Çözüm:** Tatil yapın, slow travel deneyin.

## Sosyal Hatalar

### 11. Hiç Topluluk Aramamamak
**Çözüm:** Coworking, meetup, coliving deneyin.

### 12. Sürekli Hareket Etmek
**Çözüm:** Slow travel, minimum 1 ay bir yerde.

## Lojistik Hatalar

### 13. Çok Fazla Eşya Taşımak
**Çözüm:** 7-10 kg sınırı koyun.

### 14. Backup Planı Yapmamak
**Çözüm:** Yedek SIM, yedek banka kartı, cloud backup.

### 15. Araştırma Yapmadan Gitmek
**Çözüm:** Nomad List, Reddit, blog yazıları okuyun.

Hatalardan öğrenmek en iyi öğretmen!
    `,
    coverImage: 'https://images.unsplash.com/photo-1494178270175-e96de2971df9?w=1200&h=600&fit=crop',
    category: 'nomad',
    author: {
      name: 'Zeynep Kaya',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      bio: 'Dijital göçebe ve içerik üreticisi',
    },
    publishedAt: '2025-12-08',
    readingTime: 10,
    tags: ['hatalar', 'deneyim', 'dijital-gocebe', 'ipuclari'],
  },
  {
    id: '24',
    slug: 'chiang-mai-dijital-gocebe',
    title: 'Chiang Mai: Dijital Göçebelerin Efsanevi Şehri',
    excerpt: 'Tayland\'ın kuzeyindeki Chiang Mai neden dünya nomadlarının favorisi? Yaşam maliyeti, mahalleler ve topluluk.',
    content: `
# Chiang Mai Dijital Göçebe Rehberi

Chiang Mai, OG (original) nomad destinasyonu. 2010'lardan beri binlerce göçebenin evi.

## Neden Chiang Mai?

- **Ultra düşük maliyet** ($800-1200/ay)
- **Dev nomad topluluğu**
- **Yavaş tempolu yaşam**
- **Dağlarla çevrili doğa**
- **Thai güleryüzlülüğü**

## En İyi Mahalleler

### Nimman (Nimmanhaemin)
- Hipster merkezi
- Kafeler, butikler
- Üniversite yakını
- Fiyat: Orta-yüksek

### Old City
- Tarihi surlar içinde
- Tapınaklar
- Turistik ama güzel
- Fiyat: Uygun

### Santitham
- Yerel, sakin
- Pazar yakını
- Otantik Thai yaşam
- Fiyat: Düşük

## Coworking

- **CAMP (Maya Mall)** - Ücretsiz! (Tüketim zorunlu)
- **Punspace** - OG nomad hub
- **Hub53** - Topluluk odaklı
- **Yellow** - Coliving + coworking

## Yaşam Maliyeti (Aylık)

| Kalem | Maliyet |
|-------|---------|
| Daire (stüdyo) | $200-400 |
| Yemek | $100-200 |
| Scooter | $50 |
| Coworking | $50-100 |
| Toplam | $400-750 |

## Aktiviteler

- **Doi Suthep** tapınağı
- **Elephant sanctuaries**
- **Thai yemek kursları
- **Trekking**
- **Weekend markets**

## Dezavantajlar

- Yanan mevsimi (Mart-Nisan) - hava kirliliği
- Sıcak ve nemli
- Bazılarına "çok sakin" gelebilir

Chiang Mai, nomad hayatına başlamak için ideal!
    `,
    coverImage: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&h=600&fit=crop',
    category: 'nomad',
    city: 'Chiang Mai',
    citySlug: 'chiang-mai',
    author: {
      name: 'Ayşe Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      bio: 'Seyahat yazarı ve fotoğrafçı',
    },
    publishedAt: '2025-12-05',
    readingTime: 8,
    tags: ['chiang-mai', 'tayland', 'dijital-gocebe', 'asya'],
  },
  {
    id: '25',
    slug: 'nomad-ve-aile-cocuklu-seyahat',
    title: 'Çocuklu Dijital Göçebe: Aile ile Dünyayı Gezmek',
    excerpt: 'Çocuklarla birlikte nomad yaşamı mümkün mü? Eğitim, sağlık, lojistik ve deneyim paylaşımları.',
    content: `
# Çocuklu Dijital Göçebe Olmak

Aile ile dünyayı gezmek hayal değil, gerçek!

## Mümkün mü?

Evet! Binlerce aile bunu yapıyor. Ama planlama şart.

## Eğitim Seçenekleri

### Homeschooling (Ev Eğitimi)
- **Avantaj:** Esnek, seyahatle uyumlu
- **Zorluk:** Planlama gerekli
- **Kaynaklar:** Khan Academy, Outschool

### World Schooling
- Seyahati eğitime dönüştürme
- Müze, tarih, coğrafya canlı öğrenme
- Dil pratiği

### Online Okullar
- Türk okulları uzaktan eğitim
- Uluslararası programlar (IB)
- Sanal sınıflar

### Uluslararası Okullar
- Uzun süreli kalışlarda
- Yerel + uluslararası mix
- Pahalı ama kaliteli

## Sağlık

- **Aile sigortası** - SafetyWing Family
- **Aşı takibi** - WHO önerileri
- **Acil durum planı** - Yakın hastane araştırması
- **İlaç stoğu** - Temel ilaçlar yanınızda

## Lojistik

### Konaklama
- Airbnb mutfaklı evler
- Apart otel seçenekleri
- Minimum 1 hafta kalış

### Ulaşım
- Uçuşlarda çocuk koltuğu
- Bebek arabası hafif model
- Araba koltuğu (Doona gibi combo)

### Yemek
- Ev yemekleri mutfakta
- Çocuk dostu restoranlar
- Tanıdık atıştırmalıklar

## Zorluklar

1. **Rutin bozulması** - Esnek olun
2. **Arkadaşlık** - Playground, coliving
3. **Yorgunluk** - Slow travel şart
4. **Maliyet** - Aile bütçesi daha yüksek

## Avantajlar

- Dünyayı görmek
- Dil öğrenme
- Adaptasyon becerileri
- Aile bağı güçlenmesi

Çocuklarınızla dünyayı keşfedin!
    `,
    coverImage: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&h=600&fit=crop',
    category: 'nomad',
    author: {
      name: 'Mehmet Demir',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      bio: 'Avrupa seyahat uzmanı',
    },
    publishedAt: '2025-12-02',
    readingTime: 11,
    tags: ['aile', 'cocuk', 'dijital-gocebe', 'egitim'],
  },
  {
    id: '26',
    slug: 'nomad-kaynaklari-ve-topluluklar',
    title: 'Dijital Göçebe Kaynakları: Web Siteleri, Gruplar ve Araçlar',
    excerpt: 'Nomad List\'ten Reddit\'e, SafetyWing\'den Wise\'a. Her nomadın bilmesi gereken tüm kaynaklar.',
    content: `
# Dijital Göçebe Kaynakları

Hayatınızı kolaylaştıracak tüm araçlar ve topluluklar.

## Şehir Araştırma

### Nomad List
- **Ne:** Nomad şehir veritabanı
- **Fiyat:** Ücretsiz / $99 ömür boyu
- **Özellik:** Maliyet, internet, hava, güvenlik

### The Earth Awaits
- **Ne:** Yaşam maliyeti karşılaştırma
- **Fiyat:** Ücretsiz
- **Özellik:** Filtreli arama

### Numbeo
- **Ne:** Global maliyet veritabanı
- **Fiyat:** Ücretsiz
- **Özellik:** Detaylı breakdown

## Topluluklar

### Reddit
- r/digitalnomad
- r/remotework
- r/solotravel

### Facebook Grupları
- Digital Nomads Around The World
- Girls Gone Digital Nomad
- Türk Digital Nomad (Türkçe)

### Slack
- Nomad List Community
- Remote Work Hub

### Discord
- Nomads Talk
- Indie Hackers

## Finans Araçları

- **Wise** - Döviz transferi
- **Revolut** - Çoklu para birimi
- **PayPal** - Ödeme alma
- **Payoneer** - Freelance ödemeler

## Konaklama

- **Airbnb** - Kısa-uzun süreli
- **Booking.com** - Oteller
- **Hostelworld** - Bütçe
- **Coliving.com** - Coliving arama

## Coworking

- **Coworker.com** - Global arama
- **WorkFrom** - Kafe veritabanı
- **Croissant** - Çoklu üyelik

## Sigorta

- **SafetyWing** - Esnek, uygun
- **World Nomads** - Aktiviteler dahil
- **Genki** - AB odaklı

## Üretkenlik

- **Notion** - Her şey bir arada
- **Todoist** - Görev yönetimi
- **Forest** - Odaklanma
- **Loom** - Video mesaj

## Güvenlik

- **1Password** - Şifre yönetimi
- **NordVPN** - VPN
- **Authy** - 2FA

Araçlarınız hazır, şimdi yola çıkma zamanı!
    `,
    coverImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop',
    category: 'nomad',
    author: {
      name: 'Ali Öztürk',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      bio: 'Tarih meraklısı ve gezi yazarı',
    },
    publishedAt: '2025-11-28',
    readingTime: 8,
    tags: ['kaynaklar', 'araclar', 'dijital-gocebe', 'topluluk'],
  },
];

export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === 'all') return getAllPosts();
  return getAllPosts().filter(post => post.category === category);
}

export function getPostsByCity(citySlug: string): BlogPost[] {
  return getAllPosts().filter(post => 
    post.citySlug === citySlug || post.relatedCities?.includes(citySlug)
  );
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter(post => post.featured);
}

export function getRelatedPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
  return getAllPosts()
    .filter(post => 
      post.id !== currentPost.id && 
      (post.category === currentPost.category || 
       post.tags.some(tag => currentPost.tags.includes(tag)))
    )
    .slice(0, limit);
}

export function getCategoryInfo(categoryId: string) {
  return blogCategories.find(cat => cat.id === categoryId);
}
