export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: 'festival' | 'culture' | 'lifestyle' | 'travel-tips' | 'food';
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
