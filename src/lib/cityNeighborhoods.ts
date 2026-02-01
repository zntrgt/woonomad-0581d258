// City neighborhoods data for SEO-optimized hotel pages
// Each city has recommended neighborhoods with descriptions

export interface Neighborhood {
  name: string;
  nameEn: string;
  description: string;
  forWhom: string; // "Aileler", "Çiftler", "İş seyahati", etc.
  priceLevel: 'ekonomik' | 'orta' | 'lüks';
}

export interface CityNeighborhoodData {
  neighborhoods: Neighborhood[];
  transportTip: string;
  safetyNote: string;
}

export const cityNeighborhoodsData: Record<string, CityNeighborhoodData> = {
  // === TÜRKİYE ===
  'istanbul': {
    neighborhoods: [
      { name: 'Sultanahmet', nameEn: 'Sultanahmet', description: 'Tarihi yarımada, Ayasofya ve Topkapı Sarayı\'na yürüme mesafesinde. Turistik ama atmosferik.', forWhom: 'İlk kez gelenler, tarih meraklıları', priceLevel: 'orta' },
      { name: 'Beyoğlu / Taksim', nameEn: 'Beyoglu / Taksim', description: 'Gece hayatı, restoranlar ve sanat galerileri. İstiklal Caddesi\'nin kalbi.', forWhom: 'Gençler, gece kuşları', priceLevel: 'orta' },
      { name: 'Kadıköy', nameEn: 'Kadikoy', description: 'Asya yakasının hipster merkezi. Yerel lezzetler, barlar sokağı ve deniz manzarası.', forWhom: 'Dijital göçebeler, yerel deneyim isteyenler', priceLevel: 'ekonomik' },
      { name: 'Beşiktaş', nameEn: 'Besiktas', description: 'Boğaz manzaralı, merkezi konum. Ortaköy ve Bebek\'e yakın.', forWhom: 'İş seyahati, çiftler', priceLevel: 'lüks' },
      { name: 'Karaköy', nameEn: 'Karakoy', description: 'Galata Kulesi etrafında butik oteller. Kahve kültürü ve vintage dükkanlar.', forWhom: 'Sanat severler, romantik kaçamak', priceLevel: 'orta' },
    ],
    transportTip: 'İstanbulkart alarak metro, tramvay ve vapurları ekonomik kullanabilirsiniz. Sultanahmet-Taksim arası tramvayla 15 dakika.',
    safetyNote: 'İstanbul genel olarak güvenli. Turistik bölgelerde yankesicilere dikkat edin. Gece Beyoğlu ve Kadıköy güvenle gezilebilir.',
  },
  'antalya': {
    neighborhoods: [
      { name: 'Kaleiçi', nameEn: 'Kaleici Old Town', description: 'Tarihi surlar içinde butik oteller, daracık sokaklar ve marina manzarası.', forWhom: 'Romantik kaçamak, tarih severler', priceLevel: 'orta' },
      { name: 'Lara', nameEn: 'Lara Beach', description: 'Uzun kumsal, all-inclusive resort cenneti. Aileler için ideal.', forWhom: 'Aileler, her şey dahil sevenler', priceLevel: 'lüks' },
      { name: 'Konyaaltı', nameEn: 'Konyaalti', description: 'Şehir merkezine yakın plaj bölgesi. Yürüyüş parkuru ve akşam yürüyüşleri.', forWhom: 'Aktif tatilciler, uzun konaklama', priceLevel: 'orta' },
      { name: 'Belek', nameEn: 'Belek', description: 'Golf sahaları ve lüks tatil köyleri. Spa ve wellness odaklı.', forWhom: 'Golf tutkunları, lüks tatil', priceLevel: 'lüks' },
    ],
    transportTip: 'Antray (tramvay) şehir içi ulaşımı sağlar. Kaleiçi\'nden havalimanına Havaş ile 45 dakika.',
    safetyNote: 'Antalya Türkiye\'nin en güvenli turizm şehirlerinden biri. Gece bile rahatça yürüyebilirsiniz.',
  },
  'izmir': {
    neighborhoods: [
      { name: 'Alsancak', nameEn: 'Alsancak', description: 'Kordon boyu yürüyüş, barlar sokağı ve butik mağazalar. Şehrin kalbi.', forWhom: 'Gençler, gece hayatı sevenler', priceLevel: 'orta' },
      { name: 'Konak', nameEn: 'Konak', description: 'Saat Kulesi, Kemeraltı Çarşısı\'na yürüme mesafesi. Tarihi atmosfer.', forWhom: 'Kültür turizmi, bütçe bilinçli', priceLevel: 'ekonomik' },
      { name: 'Çeşme', nameEn: 'Cesme', description: 'Turkuaz deniz, rüzgar sörfü ve gece hayatı. İzmir\'e 1 saat.', forWhom: 'Plaj tatilcileri, su sporları', priceLevel: 'lüks' },
      { name: 'Alaçatı', nameEn: 'Alacati', description: 'Taş evler, butik oteller ve gastronomi cenneti. Instagram\'ın gözdesi.', forWhom: 'Çiftler, foodie\'ler', priceLevel: 'lüks' },
      { name: 'Karşıyaka', nameEn: 'Karsiyaka', description: 'Vapur seferleriyle Alsancak\'a bağlı. Sakin, yerel atmosfer.', forWhom: 'Dijital göçebeler, uzun konaklama', priceLevel: 'ekonomik' },
    ],
    transportTip: 'İzmirim Kart ile metro, otobüs ve vapur kullanın. Alsancak-Konak arası metro 5 dakika.',
    safetyNote: 'İzmir Türkiye\'nin en yaşanabilir şehri seçildi. Tüm semtler gece bile güvenli.',
  },
  'bodrum': {
    neighborhoods: [
      { name: 'Bodrum Merkez', nameEn: 'Bodrum Center', description: 'Kale manzaralı marina, barlar sokağı ve hareketli gece hayatı.', forWhom: 'Gece kuşları, genç gruplar', priceLevel: 'orta' },
      { name: 'Yalıkavak', nameEn: 'Yalikavak', description: 'Lüks marinası ile ünlü. Süperstar yatları ve şık plaj kulüpleri.', forWhom: 'Lüks tatilciler, yelken severler', priceLevel: 'lüks' },
      { name: 'Türkbükü', nameEn: 'Turkbuku', description: 'Ünlülerin gözdesi, exclusive plaj kulüpleri ve butik oteller.', forWhom: 'VIP deneyim, çiftler', priceLevel: 'lüks' },
      { name: 'Gümbet', nameEn: 'Gumbet', description: 'Geniş kumsal, su sporları ve aileler için uygun fiyatlı oteller.', forWhom: 'Aileler, bütçe tatilciler', priceLevel: 'ekonomik' },
      { name: 'Bitez', nameEn: 'Bitez', description: 'Sakin mandalina bahçeleri, rüzgar sörfü ve organik restoranlar.', forWhom: 'Huzur arayanlar, wellness', priceLevel: 'orta' },
    ],
    transportTip: 'Dolmuşlar tüm koylara sefer yapar. Yalıkavak-Merkez arası 30 dakika. Tekne turları popüler.',
    safetyNote: 'Bodrum yaz boyunca çok kalabalık olabilir. Sezon dışı (Mayıs, Ekim) daha sakin.',
  },
  'kapadokya': {
    neighborhoods: [
      { name: 'Göreme', nameEn: 'Goreme', description: 'Peri bacaları arasında mağara oteller. Balon kalkış noktası.', forWhom: 'Romantik kaçamak, fotoğraf tutkunları', priceLevel: 'orta' },
      { name: 'Ürgüp', nameEn: 'Urgup', description: 'Şarap mahzenleri, butik cave oteller ve daha az turist.', forWhom: 'Şarap severler, sakin tatil', priceLevel: 'lüks' },
      { name: 'Uçhisar', nameEn: 'Uchisar', description: 'Kale manzaralı, tüm Kapadokya\'yı gören tepe konumu.', forWhom: 'Manzara tutkunları, fotoğrafçılar', priceLevel: 'lüks' },
      { name: 'Avanos', nameEn: 'Avanos', description: 'Kızılırmak kenarı, çömlek atölyeleri. Daha yerel deneyim.', forWhom: 'Zanaatkar ruhlar, bütçe bilinçli', priceLevel: 'ekonomik' },
    ],
    transportTip: 'Kayseri veya Nevşehir havalimanından transfer servisleri var. Bölge içinde araç kiralamak en pratik.',
    safetyNote: 'Kapadokya çok güvenli. Balon turları için hava koşullarını takip edin.',
  },

  // === AVRUPA ===
  'paris': {
    neighborhoods: [
      { name: 'Le Marais (3-4. Bölge)', nameEn: 'Le Marais', description: 'Tarihi Yahudi mahallesi, vintage dükkanlar, LGBT+ dostu. Merkezi konum.', forWhom: 'Şehir gezginleri, sanat severler', priceLevel: 'lüks' },
      { name: 'Saint-Germain (6. Bölge)', nameEn: 'Saint-Germain', description: 'Entelektüel Paris, efsanevi kafeler (Café de Flore) ve antikacılar.', forWhom: 'Romantik çiftler, edebiyat tutkunları', priceLevel: 'lüks' },
      { name: 'Montmartre (18. Bölge)', nameEn: 'Montmartre', description: 'Sanatçılar tepesi, Sacré-Cœur manzarası ve bohem atmosfer.', forWhom: 'Sanat severler, fotoğrafçılar', priceLevel: 'orta' },
      { name: 'Bastille (11-12. Bölge)', nameEn: 'Bastille', description: 'Gece hayatı, canlı barlar ve yerel Paris deneyimi.', forWhom: 'Gençler, bütçe bilinçli', priceLevel: 'orta' },
      { name: 'Champs-Élysées (8. Bölge)', nameEn: 'Champs-Elysees', description: 'İkonik bulvar, lüks mağazalar ve prestijli oteller.', forWhom: 'Lüks alışveriş, iş seyahati', priceLevel: 'lüks' },
    ],
    transportTip: 'Paris Metro\'su mükemmel. Navigo haftalık kart tüm bölgeleri kapsar. CDG\'den RER B ile şehir merkezine 35 dk.',
    safetyNote: 'Paris güvenli ama metro ve turistik bölgelerde yankesicilere dikkat. Gare du Nord çevresinde dikkatli olun.',
  },
  'londra': {
    neighborhoods: [
      { name: 'Westminster', nameEn: 'Westminster', description: 'Big Ben, Buckingham Sarayı. Turistik ama ikonik.', forWhom: 'İlk kez gelenler, tarih meraklıları', priceLevel: 'lüks' },
      { name: 'Shoreditch', nameEn: 'Shoreditch', description: 'Street art, bağımsız kafeler ve startup kültürü.', forWhom: 'Dijital göçebeler, sanat severler', priceLevel: 'orta' },
      { name: 'South Bank', nameEn: 'South Bank', description: 'Tate Modern, Thames yürüyüşü ve sokak sanatçıları.', forWhom: 'Kültür turizmi, aileler', priceLevel: 'orta' },
      { name: 'Covent Garden', nameEn: 'Covent Garden', description: 'Tiyatro bölgesi, sokak performansçıları ve butik mağazalar.', forWhom: 'Tiyatro severler, alışveriş', priceLevel: 'lüks' },
      { name: 'Camden', nameEn: 'Camden', description: 'Alternatif kültür, canlı müzik ve pazarlar.', forWhom: 'Genç gezginler, müzik tutkunları', priceLevel: 'ekonomik' },
    ],
    transportTip: 'Oyster Card veya Contactless ile Tube ekonomik. Heathrow\'dan Piccadilly Line ile merkeze 1 saat.',
    safetyNote: 'Londra güvenli bir başkent. Gece toplu taşıma güvenle kullanılabilir.',
  },
  'barcelona': {
    neighborhoods: [
      { name: 'Gothic Quarter', nameEn: 'Gothic Quarter', description: 'Ortaçağ sokakları, tapas barları ve kalabalık gece hayatı.', forWhom: 'Tarih ve gece hayatı sevenler', priceLevel: 'orta' },
      { name: 'Eixample', nameEn: 'Eixample', description: 'Gaudí eserleri (Sagrada Familia, Casa Batlló). Geniş bulvarlar.', forWhom: 'Mimarlık meraklıları, aileler', priceLevel: 'lüks' },
      { name: 'Barceloneta', nameEn: 'Barceloneta', description: 'Şehir plajı, deniz mahsulleri restoranları ve sahil yürüyüşü.', forWhom: 'Plaj severler, sportif tatilciler', priceLevel: 'orta' },
      { name: 'Gràcia', nameEn: 'Gracia', description: 'Köy atmosferinde meydanlar, bağımsız kafeler ve yerel yaşam.', forWhom: 'Dijital göçebeler, uzun konaklama', priceLevel: 'ekonomik' },
      { name: 'El Born', nameEn: 'El Born', description: 'Trendy butikler, kokteyl barları ve Picasso Müzesi.', forWhom: 'Moda tutkunları, gece kuşları', priceLevel: 'orta' },
    ],
    transportTip: 'T-Casual 10 geçişlik metro kartı en ekonomik. Havalimanından Aerobus ile 35 dk.',
    safetyNote: 'Barcelona\'da yankesicilik yaygın, özellikle La Rambla ve metroda dikkatli olun.',
  },
  'roma': {
    neighborhoods: [
      { name: 'Centro Storico', nameEn: 'Historic Center', description: 'Pantheon, Piazza Navona. Her köşe bir açık hava müzesi.', forWhom: 'İlk kez gelenler, tarih tutkunları', priceLevel: 'lüks' },
      { name: 'Trastevere', nameEn: 'Trastevere', description: 'Bohem atmosfer, sarmaşıklı sokaklar ve otantik tratoria\'lar.', forWhom: 'Romantik çiftler, gurme gezginler', priceLevel: 'orta' },
      { name: 'Monti', nameEn: 'Monti', description: 'Hipster mahallesi, vintage dükkanlar ve aperitivo kültürü.', forWhom: 'Trendsetterlar, genç çiftler', priceLevel: 'orta' },
      { name: 'Testaccio', nameEn: 'Testaccio', description: 'Yerel Roma mutfağı, gece kulüpleri ve daha az turist.', forWhom: 'Yemek tutkunları, gece hayatı', priceLevel: 'ekonomik' },
      { name: 'Vatikan Çevresi', nameEn: 'Vatican Area', description: 'Aziz Petrus\'a yürüme mesafesi. Sakin konut bölgesi.', forWhom: 'Aileler, dini turizm', priceLevel: 'orta' },
    ],
    transportTip: 'Roma Metro 2 hat, otobüsler daha kapsamlı. Fiumicino\'dan Leonardo Express ile Termini\'ye 32 dk.',
    safetyNote: 'Roma güvenli ama Termini çevresinde ve metroda yankesicilere dikkat.',
  },
  'amsterdam': {
    neighborhoods: [
      { name: 'Jordaan', nameEn: 'Jordaan', description: 'Kanal evleri, bağımsız galeriler ve kahverengi kafeler.', forWhom: 'Sanat severler, romantik kaçamak', priceLevel: 'lüks' },
      { name: 'De Pijp', nameEn: 'De Pijp', description: 'Multikulti Albert Cuyp pazarı ve canlı gece hayatı.', forWhom: 'Gurme gezginler, genç çiftler', priceLevel: 'orta' },
      { name: 'Centrum', nameEn: 'City Center', description: 'Dam Meydanı, Anne Frank Evi ve alışveriş caddeleri.', forWhom: 'İlk kez gelenler, alışveriş', priceLevel: 'lüks' },
      { name: 'Oost', nameEn: 'East Amsterdam', description: 'Tropenmuseum, parklar ve multicultural lezzetler.', forWhom: 'Dijital göçebeler, uzun konaklama', priceLevel: 'ekonomik' },
    ],
    transportTip: 'OV-chipkaart ile tramvay en pratik. Schiphol\'dan tren ile Centraal\'a 17 dk.',
    safetyNote: 'Amsterdam çok güvenli. Red Light District gece kalabalık ve güvenli ama fotoğraf çekmek yasak.',
  },
  'berlin': {
    neighborhoods: [
      { name: 'Mitte', nameEn: 'Mitte', description: 'Müze Adası, Brandenburg Kapısı ve galeriler.', forWhom: 'Kültür turizmi, iş seyahati', priceLevel: 'lüks' },
      { name: 'Kreuzberg', nameEn: 'Kreuzberg', description: 'Multikulti atmosfer, dönerci ve alternatif gece kulüpleri.', forWhom: 'Gece kuşları, bütçe bilinçli', priceLevel: 'ekonomik' },
      { name: 'Prenzlauer Berg', nameEn: 'Prenzlauer Berg', description: 'Genç aileler, organik pazarlar ve şık kafeler.', forWhom: 'Aileler, uzun konaklama', priceLevel: 'orta' },
      { name: 'Friedrichshain', nameEn: 'Friedrichshain', description: 'Techno kulüpleri (Berghain), East Side Gallery.', forWhom: 'Müzik tutkunları, genç gruplar', priceLevel: 'ekonomik' },
      { name: 'Charlottenburg', nameEn: 'Charlottenburg', description: 'Batı Berlin\'in şık yüzü, Kurfürstendamm alışverişi.', forWhom: 'Klasik zevkler, lüks alışveriş', priceLevel: 'lüks' },
    ],
    transportTip: 'Berlin WelcomeCard ile S/U-Bahn, tramvay sınırsız. BER havalimanından trenle 30 dk.',
    safetyNote: 'Berlin çok güvenli. Gece bile metrolar rahatça kullanılır.',
  },
  'prag': {
    neighborhoods: [
      { name: 'Staré Město', nameEn: 'Old Town', description: 'Astronomik Saat, gotik kiliseler ve turistik merkez.', forWhom: 'İlk kez gelenler, tarih severler', priceLevel: 'lüks' },
      { name: 'Malá Strana', nameEn: 'Lesser Town', description: 'Barok mimari, sakin sokaklar ve Kale manzarası.', forWhom: 'Romantik çiftler, fotoğrafçılar', priceLevel: 'lüks' },
      { name: 'Žižkov', nameEn: 'Zizkov', description: 'Bohemian, ucuz barlar ve yerel Prag deneyimi.', forWhom: 'Bütçe gezginler, gece hayatı', priceLevel: 'ekonomik' },
      { name: 'Vinohrady', nameEn: 'Vinohrady', description: 'Şık kafeler, parklar ve expat cenneti.', forWhom: 'Dijital göçebeler, çiftler', priceLevel: 'orta' },
    ],
    transportTip: 'Lítačka uygulaması ile metro ve tramvay bileti alın. Havalimanından 119 numaralı otobüs + metro.',
    safetyNote: 'Prag çok güvenli. Old Town\'da turistleri hedef alan dolandırıcılara dikkat.',
  },

  // === ASYA ===
  'tokyo': {
    neighborhoods: [
      { name: 'Shinjuku', nameEn: 'Shinjuku', description: 'Gökdelenler, neon ışıklar ve efsanevi gece hayatı. Golden Gai barları.', forWhom: 'Gece kuşları, ilk kez gelenler', priceLevel: 'lüks' },
      { name: 'Shibuya', nameEn: 'Shibuya', description: 'Meşhur kavşak, genç modası ve J-pop kültürü.', forWhom: 'Genç gezginler, moda tutkunları', priceLevel: 'orta' },
      { name: 'Asakusa', nameEn: 'Asakusa', description: 'Geleneksel Japonya, Senso-ji Tapınağı ve kimono deneyimi.', forWhom: 'Kültür turizmi, aileler', priceLevel: 'ekonomik' },
      { name: 'Ginza', nameEn: 'Ginza', description: 'Lüks alışveriş, Michelin restoranlar ve şık oteller.', forWhom: 'Lüks tatilciler, iş seyahati', priceLevel: 'lüks' },
      { name: 'Nakameguro', nameEn: 'Nakameguro', description: 'Hipster kafeler, kiraz ağaçlı kanal ve butik dükkanlar.', forWhom: 'Dijital göçebeler, romantik çiftler', priceLevel: 'orta' },
    ],
    transportTip: 'Suica/Pasmo kartı ile JR, metro ve otobüs. Narita\'dan N\'EX ile Tokyo\'ya 1 saat.',
    safetyNote: 'Tokyo dünyanın en güvenli metropollerinden biri. Gece bile her yerde rahat gezin.',
  },
  'bangkok': {
    neighborhoods: [
      { name: 'Sukhumvit', nameEn: 'Sukhumvit', description: 'Expat merkezi, rooftop barlar ve alışveriş merkezleri.', forWhom: 'Dijital göçebeler, gece hayatı', priceLevel: 'orta' },
      { name: 'Silom / Sathorn', nameEn: 'Silom / Sathorn', description: 'Finans merkezi, sky bar\'lar ve iş otelleri.', forWhom: 'İş seyahati, lüks konaklama', priceLevel: 'lüks' },
      { name: 'Khao San', nameEn: 'Khao San Road', description: 'Backpacker efsanesi, ucuz yemek ve party sokağı.', forWhom: 'Bütçe gezginler, genç gruplar', priceLevel: 'ekonomik' },
      { name: 'Riverside', nameEn: 'Riverside', description: 'Chao Phraya manzaralı lüks oteller ve ikonik tapınaklar.', forWhom: 'Romantik çiftler, lüks tatil', priceLevel: 'lüks' },
      { name: 'Chinatown', nameEn: 'Chinatown', description: 'Sokak yemeği cenneti, altın dükkanları ve yerel yaşam.', forWhom: 'Gurme gezginler, fotoğrafçılar', priceLevel: 'ekonomik' },
    ],
    transportTip: 'BTS Skytrain ve MRT metro en hızlı. Suvarnabhumi\'den City Line ile merkeze 30 dk.',
    safetyNote: 'Bangkok güvenli ama trafikte dikkatli olun. Tuk-tuk\'larda pazarlık yapın.',
  },
  'bali': {
    neighborhoods: [
      { name: 'Seminyak', nameEn: 'Seminyak', description: 'Plaj kulüpleri, butik mağazalar ve Instagram\'lık günbatımı.', forWhom: 'Parti sevenler, moda tutkunları', priceLevel: 'lüks' },
      { name: 'Ubud', nameEn: 'Ubud', description: 'Pirinç terasları, yoga retreatları ve sanat galerileri.', forWhom: 'Wellness, dijital göçebeler', priceLevel: 'orta' },
      { name: 'Canggu', nameEn: 'Canggu', description: 'Sörf, coworking space\'ler ve hipster kafeler.', forWhom: 'Dijital göçebeler, sörfçüler', priceLevel: 'orta' },
      { name: 'Nusa Dua', nameEn: 'Nusa Dua', description: 'All-inclusive resort kompleksi, özel plajlar.', forWhom: 'Aileler, lüks tatil', priceLevel: 'lüks' },
      { name: 'Kuta', nameEn: 'Kuta', description: 'Havalimanına yakın, bütçe otelleri ve gece hayatı.', forWhom: 'Bütçe gezginler, kısa konaklama', priceLevel: 'ekonomik' },
    ],
    transportTip: 'Scooter kiralamak en pratik (günlük 50-70K IDR). Grab uygulaması taksi için güvenilir.',
    safetyNote: 'Bali güvenli. Scooter kullanırken dikkatli olun, kask zorunlu.',
  },
  'singapur': {
    neighborhoods: [
      { name: 'Marina Bay', nameEn: 'Marina Bay', description: 'İkonik silüet, Gardens by the Bay ve lüks oteller.', forWhom: 'İlk kez gelenler, fotoğrafçılar', priceLevel: 'lüks' },
      { name: 'Orchard', nameEn: 'Orchard Road', description: 'Alışveriş cenneti, AVM\'ler ve prestijli oteller.', forWhom: 'Alışveriş tutkunları, aileler', priceLevel: 'lüks' },
      { name: 'Chinatown', nameEn: 'Chinatown', description: 'Tarihi sokaklar, hawker centerlar ve butik oteller.', forWhom: 'Gurme gezginler, bütçe bilinçli', priceLevel: 'orta' },
      { name: 'Little India', nameEn: 'Little India', description: 'Renkli sokaklar, ucuz konaklama ve otantik yemekler.', forWhom: 'Backpackerlar, kültür meraklıları', priceLevel: 'ekonomik' },
      { name: 'Sentosa', nameEn: 'Sentosa Island', description: 'Tema parkları, plajlar ve aile resortları.', forWhom: 'Aileler, tatil köyü sevenler', priceLevel: 'lüks' },
    ],
    transportTip: 'EZ-Link kartı ile MRT ve otobüs. Changi\'den MRT ile şehre 30 dk.',
    safetyNote: 'Singapur dünyanın en güvenli ülkelerinden biri. Sakız yasağı ve ağır para cezalarına dikkat.',
  },
  'dubai': {
    neighborhoods: [
      { name: 'Downtown', nameEn: 'Downtown Dubai', description: 'Burj Khalifa, Dubai Mall ve fıskiyeli gösteriler.', forWhom: 'İlk kez gelenler, lüks tatil', priceLevel: 'lüks' },
      { name: 'Dubai Marina', nameEn: 'Dubai Marina', description: 'Gökdelenler arasında yürüyüş, yat limanı ve plaj erişimi.', forWhom: 'Genç çiftler, şehir tatili', priceLevel: 'lüks' },
      { name: 'Palm Jumeirah', nameEn: 'Palm Jumeirah', description: 'Yapay ada, ikonik Atlantis ve özel plajlar.', forWhom: 'Balayı, ultra lüks', priceLevel: 'lüks' },
      { name: 'Deira', nameEn: 'Deira', description: 'Eski Dubai, Altın Pazarı ve otantik çarşılar.', forWhom: 'Bütçe bilinçli, kültür turizmi', priceLevel: 'ekonomik' },
      { name: 'Jumeirah Beach', nameEn: 'Jumeirah Beach', description: 'Burj Al Arab manzarası, plaj resortları.', forWhom: 'Plaj tatili, aileler', priceLevel: 'lüks' },
    ],
    transportTip: 'Dubai Metro temiz ve verimli. Nol kartı ile tüm toplu taşıma. DXB\'den metroya yürüme mesafesi.',
    safetyNote: 'Dubai çok güvenli. Giyim kurallarına (özellikle camilerde) dikkat edin.',
  },

  // === DİĞER ===
  'lizbon': {
    neighborhoods: [
      { name: 'Alfama', nameEn: 'Alfama', description: 'Fado müziği, dar sokaklar ve şehir manzarası (miradourolar).', forWhom: 'Romantik çiftler, müzik severler', priceLevel: 'orta' },
      { name: 'Baixa', nameEn: 'Baixa', description: 'Şehir merkezi, alışveriş caddeleri ve tarihi kafeler.', forWhom: 'İlk kez gelenler, alışveriş', priceLevel: 'orta' },
      { name: 'Bairro Alto', nameEn: 'Bairro Alto', description: 'Gece hayatı, küçük barlar ve alternatif atmosfer.', forWhom: 'Gece kuşları, genç gezginler', priceLevel: 'ekonomik' },
      { name: 'Belém', nameEn: 'Belem', description: 'Keşifler Anıtı, Pastéis de Belém ve müzeler.', forWhom: 'Tarih tutkunları, aileler', priceLevel: 'orta' },
      { name: 'Príncipe Real', nameEn: 'Principe Real', description: 'Trendy butikler, LGBT+ dostu ve şık kafeler.', forWhom: 'Dijital göçebeler, moda tutkunları', priceLevel: 'lüks' },
    ],
    transportTip: 'Viva Viagem kartı ile metro ve tramvay. 28 numaralı tramvay ikonik ama kalabalık.',
    safetyNote: 'Lizbon güvenli ama 28 tramvayı ve Rossio\'da yankesicilere dikkat.',
  },
  'tiflis': {
    neighborhoods: [
      { name: 'Old Town', nameEn: 'Old Tbilisi', description: 'Balkonlu evler, sulfur hamamları ve kale manzarası.', forWhom: 'İlk kez gelenler, tarih severler', priceLevel: 'ekonomik' },
      { name: 'Rustaveli', nameEn: 'Rustaveli Avenue', description: 'Ana bulvar, opera binası ve şık oteller.', forWhom: 'İş seyahati, kültür turizmi', priceLevel: 'orta' },
      { name: 'Marjanishvili', nameEn: 'Marjanishvili', description: 'Hipster kafeler, yerel restoranlar ve gece hayatı.', forWhom: 'Dijital göçebeler, gençler', priceLevel: 'ekonomik' },
      { name: 'Vake', nameEn: 'Vake', description: 'Yeşil parklar, şık konut bölgesi ve uluslararası restoranlar.', forWhom: 'Aileler, uzun konaklama', priceLevel: 'orta' },
    ],
    transportTip: 'Metro 2 hatlı, otobüsler yaygın. Havalimanından merkeze taksi 30-40 GEL.',
    safetyNote: 'Tiflis çok güvenli ve misafirperver. Gece bile rahat gezebilirsiniz.',
  },
  'atina': {
    neighborhoods: [
      { name: 'Plaka', nameEn: 'Plaka', description: 'Akropolis eteğinde, neoclassic evler ve tavernalar.', forWhom: 'İlk kez gelenler, romantik çiftler', priceLevel: 'orta' },
      { name: 'Monastiraki', nameEn: 'Monastiraki', description: 'Bit pazarı, streetfood ve Akropolis manzarası.', forWhom: 'Bütçe gezginler, alışveriş', priceLevel: 'ekonomik' },
      { name: 'Psiri', nameEn: 'Psiri', description: 'Barlar, canlı müzik ve alternatif gece hayatı.', forWhom: 'Gece kuşları, sanat severler', priceLevel: 'ekonomik' },
      { name: 'Kolonaki', nameEn: 'Kolonaki', description: 'Şık butikler, lüks kafeler ve expat cenneti.', forWhom: 'Lüks alışveriş, moda tutkunları', priceLevel: 'lüks' },
      { name: 'Koukaki', nameEn: 'Koukaki', description: 'Yerel mahalle, Akropolis\'e yürüyüş ve Airbnb cenneti.', forWhom: 'Dijital göçebeler, uzun konaklama', priceLevel: 'orta' },
    ],
    transportTip: 'Athens Transport kartı ile metro, otobüs, tramvay. Havalimanından metro X95 ile merkeze 1 saat.',
    safetyNote: 'Atina güvenli. Omonia çevresinde gece dikkatli olun.',
  },

  // === YENİ EKLENDİ ===
  'marakes': {
    neighborhoods: [
      { name: 'Medina', nameEn: 'Medina', description: 'UNESCO miras listesi, labirent sokaklar, çarşılar ve efsanevi Djemaa el-Fna meydanı.', forWhom: 'Kültür meraklıları, fotoğrafçılar', priceLevel: 'orta' },
      { name: 'Gueliz', nameEn: 'Gueliz', description: 'Yeni şehir, Avrupa tarzı kafeler, butik mağazalar ve galeri caddesi.', forWhom: 'Şehir gezginleri, alışveriş', priceLevel: 'orta' },
      { name: 'Hivernage', nameEn: 'Hivernage', description: 'Lüks oteller, gece kulüpleri ve palmiye ağaçlı bulvarlar.', forWhom: 'Lüks tatilciler, gece hayatı', priceLevel: 'lüks' },
      { name: 'Kasbah', nameEn: 'Kasbah', description: 'Saadiler Mezarlığı, yerel hayat ve daha az turist.', forWhom: 'Tarihi keşifler, sakin atmosfer', priceLevel: 'ekonomik' },
      { name: 'Palmeraie', nameEn: 'Palmeraie', description: 'Palmiye ormanı içinde resort ve villa konaklamaları.', forWhom: 'Wellness, ailelr', priceLevel: 'lüks' },
    ],
    transportTip: 'Medina içinde yürüyerek ulaşım en pratik. Taksiler pazarlıklı. Havalimanından taksi 15-20 dakika.',
    safetyNote: 'Marakeş turist dostu. Medinada sokak satıcılarına karşı nazik ama kararlı olun.',
  },
  'seul': {
    neighborhoods: [
      { name: 'Myeongdong', nameEn: 'Myeongdong', description: 'Alışveriş cenneti, K-beauty mağazaları ve streetfood sokakları.', forWhom: 'Alışveriş tutkunları, ilk kez gelenler', priceLevel: 'orta' },
      { name: 'Hongdae', nameEn: 'Hongdae', description: 'Üniversite bölgesi, indie müzik, gece hayatı ve sokak sanatçıları.', forWhom: 'Gençler, gece kuşları', priceLevel: 'ekonomik' },
      { name: 'Gangnam', nameEn: 'Gangnam', description: 'Modern gökdelenler, lüks mağazalar ve K-pop ajansları.', forWhom: 'Lüks alışveriş, K-pop hayranları', priceLevel: 'lüks' },
      { name: 'Insadong', nameEn: 'Insadong', description: 'Geleneksel sokak, çay evleri, antikalar ve el sanatları.', forWhom: 'Kültür turizmi, hediyelik', priceLevel: 'orta' },
      { name: 'Itaewon', nameEn: 'Itaewon', description: 'Uluslararası mutfaklar, rooftop barlar ve expat cenneti.', forWhom: 'Uluslararası gezginler, yemek tutkunları', priceLevel: 'orta' },
    ],
    transportTip: 'T-money kartı ile metro ve otobüs. Incheon\'dan AREX ile Seul İstasyonu\'na 43 dakika.',
    safetyNote: 'Seul dünyanın en güvenli başkentlerinden biri. Gece bile her yerde rahat gezebilirsiniz.',
  },
  'new-york': {
    neighborhoods: [
      { name: 'Midtown Manhattan', nameEn: 'Midtown Manhattan', description: 'Times Square, Empire State ve Broadway tiyatroları.', forWhom: 'İlk kez gelenler, tiyatro severler', priceLevel: 'lüks' },
      { name: 'Lower Manhattan', nameEn: 'Lower Manhattan', description: 'Wall Street, 9/11 Anıtı ve Özgürlük Heykeli feribotu.', forWhom: 'Tarih meraklıları, iş seyahati', priceLevel: 'lüks' },
      { name: 'SoHo / Tribeca', nameEn: 'SoHo / Tribeca', description: 'Döküm demir binalar, lüks butikler ve ünlü restoranlar.', forWhom: 'Moda tutkunları, gurme gezginler', priceLevel: 'lüks' },
      { name: 'Brooklyn (Williamsburg)', nameEn: 'Williamsburg Brooklyn', description: 'Hipster kültürü, bağımsız kafeler ve Smorgasburg.', forWhom: 'Dijital göçebeler, alternatif yaşam', priceLevel: 'orta' },
      { name: 'Harlem', nameEn: 'Harlem', description: 'Jazz mirası, Gospel brunch ve otantik New York.', forWhom: 'Müzik tutkunları, yerel deneyim', priceLevel: 'ekonomik' },
    ],
    transportTip: 'MetroCard veya OMNY ile metro 24 saat çalışır. JFK\'den metro veya AirTrain + metro ile Manhattan 1-1.5 saat.',
    safetyNote: 'New York güvenli, ancak gece metro istasyonlarında ve Central Park\'ta dikkatli olun.',
  },
  'rio-de-janeiro': {
    neighborhoods: [
      { name: 'Copacabana', nameEn: 'Copacabana', description: 'Efsanevi plaj, oteller ve canlı gece hayatı.', forWhom: 'Plaj sevenler, ilk kez gelenler', priceLevel: 'orta' },
      { name: 'Ipanema', nameEn: 'Ipanema', description: 'Şık plaj, trendy butikler ve kafeler.', forWhom: 'Moda tutkunları, şık tatil', priceLevel: 'lüks' },
      { name: 'Leblon', nameEn: 'Leblon', description: 'Ipanema\'nın sakin devamı, aileler ve premium restoranlar.', forWhom: 'Aileler, lüks konaklama', priceLevel: 'lüks' },
      { name: 'Santa Teresa', nameEn: 'Santa Teresa', description: 'Tepede bohem mahalle, eski tramvay ve sanat galerileri.', forWhom: 'Sanat severler, romantik kaçamak', priceLevel: 'orta' },
      { name: 'Lapa', nameEn: 'Lapa', description: 'Samba kulüpleri, renkli merdiven ve gece hayatı.', forWhom: 'Gece kuşları, müzik tutkunları', priceLevel: 'ekonomik' },
    ],
    transportTip: 'Metro Zona Sul\'u kapsar. Uber ve 99 (yerel uygulama) güvenilir. Galeão\'dan merkeze Uber yaklaşık 1 saat.',
    safetyNote: 'Plajlarda değerli eşya bırakmayın. Gece favela çevresinden kaçının. Turistik bölgeler güvenli.',
  },
  // === YENİ EKLENDİ - ASYA ===
  'osaka': {
    neighborhoods: [
      { name: 'Namba', nameEn: 'Namba', description: 'Dotonbori neon sokağı, takoyaki ve gece hayatı merkezi.', forWhom: 'Yemek tutkunları, gece kuşları', priceLevel: 'orta' },
      { name: 'Umeda', nameEn: 'Umeda', description: 'İş merkezi, gökdelenler ve lüks alışveriş.', forWhom: 'İş seyahati, şık oteller', priceLevel: 'lüks' },
      { name: 'Shinsaibashi', nameEn: 'Shinsaibashi', description: 'Kapalı alışveriş sokağı, moda ve Amerika-mura.', forWhom: 'Alışveriş tutkunları, gençler', priceLevel: 'orta' },
      { name: 'Tennoji', nameEn: 'Tennoji', description: 'Geleneksel tapınaklar, hayvanat bahçesi ve bütçe oteller.', forWhom: 'Aileler, bütçe bilinçli', priceLevel: 'ekonomik' },
      { name: 'Shinsekai', nameEn: 'Shinsekai', description: 'Retro atmosfer, kushikatsu ve Tsutenkaku Kulesi.', forWhom: 'Yerel deneyim, street food', priceLevel: 'ekonomik' },
    ],
    transportTip: 'ICOCA kartı ile metro, tren ve otobüs. Kansai havalimanından Nankai ile Namba\'ya 45 dk.',
    safetyNote: 'Osaka Tokyo kadar güvenli. Gece bile her yerde rahat gezebilirsiniz.',
  },
  'phuket': {
    neighborhoods: [
      { name: 'Patong', nameEn: 'Patong Beach', description: 'Canlı gece hayatı, Bangla Road ve geniş kumsal.', forWhom: 'Parti sevenler, gece kuşları', priceLevel: 'orta' },
      { name: 'Kata', nameEn: 'Kata Beach', description: 'Aileler için sakin plaj, sörf okulu ve rahat atmosfer.', forWhom: 'Aileler, sörf', priceLevel: 'orta' },
      { name: 'Kamala', nameEn: 'Kamala Beach', description: 'Lüks resortlar, wellness ve sakin günbatımı.', forWhom: 'Çiftler, wellness', priceLevel: 'lüks' },
      { name: 'Phuket Town', nameEn: 'Phuket Old Town', description: 'Sino-Portekiz mimarisi, yerel yemekler ve pazarlar.', forWhom: 'Kültür meraklıları, fotoğrafçılar', priceLevel: 'ekonomik' },
      { name: 'Rawai', nameEn: 'Rawai', description: 'Balıkçı köyü, deniz mahsulleri ve yerel yaşam.', forWhom: 'Uzun konaklama, yerel deneyim', priceLevel: 'ekonomik' },
    ],
    transportTip: 'Songthaew (paylaşımlı taksi) veya Grab. Scooter kiralamak popüler ama trafik kurallarına dikkat.',
    safetyNote: 'Phuket güvenli. Jet ski ve tur satıcılarında pazarlık yapın, yazılı anlaşma isteyin.',
  },
  'chiang-mai': {
    neighborhoods: [
      { name: 'Old City', nameEn: 'Old City', description: 'Sur içi, tapınaklar ve pazar sokakları.', forWhom: 'İlk kez gelenler, tarih severler', priceLevel: 'ekonomik' },
      { name: 'Nimman', nameEn: 'Nimman Road', description: 'Hipster kafeler, coworking space\'ler ve butik oteller.', forWhom: 'Dijital göçebeler, moda', priceLevel: 'orta' },
      { name: 'Night Bazaar', nameEn: 'Night Bazaar', description: 'Gece pazarı, sokak yemekleri ve uygun fiyatlı oteller.', forWhom: 'Alışveriş, bütçe bilinçli', priceLevel: 'ekonomik' },
      { name: 'Santitham', nameEn: 'Santitham', description: 'Yerel mahalle, vejetaryen restoranlar ve yoga stüdyoları.', forWhom: 'Wellness, uzun konaklama', priceLevel: 'ekonomik' },
    ],
    transportTip: 'Songthaew şehir içi 30 THB. Grab ve scooter yaygın. Havalimanı şehir içinde.',
    safetyNote: 'Chiang Mai çok güvenli ve misafirperver. Tapınaklarda uygun kıyafet giyin.',
  },
  'hong-kong': {
    neighborhoods: [
      { name: 'Central', nameEn: 'Central', description: 'Finans merkezi, gökdelenler ve lüks alışveriş.', forWhom: 'İş seyahati, lüks tatil', priceLevel: 'lüks' },
      { name: 'Tsim Sha Tsui', nameEn: 'Tsim Sha Tsui', description: 'Victoria Harbour manzarası, müzeler ve alışveriş.', forWhom: 'Aileler, ilk kez gelenler', priceLevel: 'lüks' },
      { name: 'Mong Kok', nameEn: 'Mong Kok', description: 'Kalabalık pazarlar, street food ve yerel yaşam.', forWhom: 'Bütçe bilinçli, alışveriş', priceLevel: 'ekonomik' },
      { name: 'Causeway Bay', nameEn: 'Causeway Bay', description: 'Alışveriş merkezleri, restoranlar ve gece hayatı.', forWhom: 'Alışveriş tutkunları, gençler', priceLevel: 'orta' },
      { name: 'Wan Chai', nameEn: 'Wan Chai', description: 'Geleneksel pazarlar, tarihi binalar ve barlar.', forWhom: 'Gece hayatı, kültür', priceLevel: 'orta' },
    ],
    transportTip: 'Octopus kartı ile MTR, otobüs, tramvay ve Star Ferry. Havalimanından Airport Express ile Central\'a 24 dk.',
    safetyNote: 'Hong Kong dünyanın en güvenli şehirlerinden biri. Gece bile her yerde rahat gezin.',
  },
  'kuala-lumpur': {
    neighborhoods: [
      { name: 'KLCC', nameEn: 'KLCC', description: 'Petronas Kuleleri, lüks alışveriş ve park.', forWhom: 'İlk kez gelenler, lüks tatil', priceLevel: 'lüks' },
      { name: 'Bukit Bintang', nameEn: 'Bukit Bintang', description: 'Alışveriş caddesi, gece hayatı ve sokak yemekleri.', forWhom: 'Alışveriş, gece kuşları', priceLevel: 'orta' },
      { name: 'Chinatown', nameEn: 'Chinatown', description: 'Petaling Street, budget oteller ve yerel lezzetler.', forWhom: 'Bütçe bilinçli, yemek tutkunları', priceLevel: 'ekonomik' },
      { name: 'Bangsar', nameEn: 'Bangsar', description: 'Expat mahallesi, şık kafeler ve gece hayatı.', forWhom: 'Dijital göçebeler, genç çiftler', priceLevel: 'orta' },
      { name: 'Mont Kiara', nameEn: 'Mont Kiara', description: 'Konut bölgesi, uluslararası restoranlar ve sakin atmosfer.', forWhom: 'Aileler, uzun konaklama', priceLevel: 'lüks' },
    ],
    transportTip: 'Touch n Go kartı ile LRT, MRT ve Monorail. KLIA\'dan KLIA Ekspres ile KL Sentral\'a 28 dk.',
    safetyNote: 'KL güvenli. Trafikte dikkatli olun, yürüyüş mesafeleri aldatıcı olabilir.',
  },
  'delhi': {
    neighborhoods: [
      { name: 'Connaught Place', nameEn: 'Connaught Place', description: 'Şehir merkezi, kolonyal mimari ve alışveriş.', forWhom: 'İş seyahati, ilk kez gelenler', priceLevel: 'orta' },
      { name: 'Paharganj', nameEn: 'Paharganj', description: 'Backpacker cenneti, ucuz oteller ve canlı pazarlar.', forWhom: 'Bütçe gezginler, macera', priceLevel: 'ekonomik' },
      { name: 'South Delhi', nameEn: 'South Delhi', description: 'Şık mahalleler, lüks restoranlar ve butik oteller.', forWhom: 'Lüks konaklama, gurme', priceLevel: 'lüks' },
      { name: 'Old Delhi', nameEn: 'Old Delhi', description: 'Chandni Chowk, Jama Masjid ve tarihi sokaklar.', forWhom: 'Kültür turizmi, fotoğrafçılar', priceLevel: 'ekonomik' },
      { name: 'Gurgaon', nameEn: 'Gurgaon', description: 'Modern iş bölgesi, alışveriş merkezleri ve uluslararası oteller.', forWhom: 'İş seyahati, modern konfor', priceLevel: 'lüks' },
    ],
    transportTip: 'Delhi Metro kapsamlı ve ucuz. IGI havalimanından Airport Express ile CP\'ye 20 dk.',
    safetyNote: 'Turistik bölgeler güvenli. Gece taksi yerine Uber/Ola tercih edin. Kadın gezginler için metro kadın vagonları var.',
  },

  // === YENİ EKLENDİ - AVRUPA ===
  'milano': {
    neighborhoods: [
      { name: 'Duomo', nameEn: 'Duomo', description: 'Katedral merkezi, Galleria Vittorio Emanuele ve lüks butikler.', forWhom: 'İlk kez gelenler, alışveriş', priceLevel: 'lüks' },
      { name: 'Navigli', nameEn: 'Navigli', description: 'Kanal kenarı barlar, vintage dükkanlar ve aperitivo kültürü.', forWhom: 'Gece hayatı, sanat severler', priceLevel: 'orta' },
      { name: 'Brera', nameEn: 'Brera', description: 'Sanat galerileri, butik oteller ve bohem atmosfer.', forWhom: 'Sanat tutkunları, romantik', priceLevel: 'lüks' },
      { name: 'Porta Venezia', nameEn: 'Porta Venezia', description: 'LGBT+ dostu, etnik restoranlar ve parklar.', forWhom: 'Çeşitlilik, uzun konaklama', priceLevel: 'orta' },
      { name: 'Centrale', nameEn: 'Stazione Centrale', description: 'Tren istasyonu çevresi, ulaşım merkezi ve bütçe oteller.', forWhom: 'Transit, bütçe bilinçli', priceLevel: 'ekonomik' },
    ],
    transportTip: 'ATM Milano kartı ile metro ve tramvay. Malpensa\'dan Express tren ile Centrale\'ye 52 dk.',
    safetyNote: 'Milano güvenli. Duomo ve metro çevresinde yankesicilere dikkat.',
  },
  'venedik': {
    neighborhoods: [
      { name: 'San Marco', nameEn: 'San Marco', description: 'Meydanı, Basilica ve lüks oteller. Turizmin kalbi.', forWhom: 'İlk kez gelenler, romantik', priceLevel: 'lüks' },
      { name: 'Dorsoduro', nameEn: 'Dorsoduro', description: 'Accademia müzesi, üniversite bölgesi ve yerel barlar.', forWhom: 'Sanat severler, gençler', priceLevel: 'orta' },
      { name: 'Cannaregio', nameEn: 'Cannaregio', description: 'Yahudi mahallesi, daha az turist ve otantik trattoria.', forWhom: 'Yerel deneyim, bütçe bilinçli', priceLevel: 'orta' },
      { name: 'Rialto', nameEn: 'Rialto', description: 'İkonik köprü, balık pazarı ve merkezi konum.', forWhom: 'Gurme gezginler, fotoğrafçılar', priceLevel: 'lüks' },
      { name: 'Mestre', nameEn: 'Mestre', description: 'Anakara, bütçe oteller ve Venedik\'e tren bağlantısı.', forWhom: 'Bütçe bilinçli, pratik', priceLevel: 'ekonomik' },
    ],
    transportTip: 'Vaporetto (su taksi) biletleri pahalı, günlük kart alın. Havalimanından Alilaguna ile Merkez\'e 1 saat.',
    safetyNote: 'Venedik çok güvenli. Acqua alta (yüksek su) dönemlerinde botlar gerekebilir.',
  },
  'viyana': {
    neighborhoods: [
      { name: 'Innere Stadt', nameEn: 'Innere Stadt', description: 'Stephansdom, Hofburg ve tarihi kahveler. UNESCO miras.', forWhom: 'İlk kez gelenler, kültür', priceLevel: 'lüks' },
      { name: 'Leopoldstadt', nameEn: 'Leopoldstadt', description: 'Prater, hipster kafeler ve canlı gece hayatı.', forWhom: 'Gençler, aileler', priceLevel: 'orta' },
      { name: 'Neubau', nameEn: 'Neubau', description: 'Trendy butikler, tasarım mağazaları ve şık kafeler.', forWhom: 'Moda tutkunları, sanat', priceLevel: 'orta' },
      { name: 'Mariahilf', nameEn: 'Mariahilf', description: 'Mariahilfer Straße alışverişi, müzeler yakını.', forWhom: 'Alışveriş, merkezi konum', priceLevel: 'orta' },
      { name: 'Landstraße', nameEn: 'Landstraße', description: 'Belvedere Sarayı, diplomatik bölge ve lüks oteller.', forWhom: 'Müze severler, lüks tatil', priceLevel: 'lüks' },
    ],
    transportTip: 'Wiener Linien kartı ile U-Bahn, tramvay ve otobüs. Havalimanından CAT ile Wien Mitte\'ye 16 dk.',
    safetyNote: 'Viyana dünyanın en yaşanabilir ve güvenli şehirlerinden biri.',
  },
  'zurich': {
    neighborhoods: [
      { name: 'Altstadt', nameEn: 'Old Town', description: 'Tarihi sokaklar, lüks mağazalar ve Grossmünster.', forWhom: 'İlk kez gelenler, tarih', priceLevel: 'lüks' },
      { name: 'Zürich West', nameEn: 'Zurich West', description: 'Eski sanayi bölgesi, trendy restoranlar ve gece kulüpleri.', forWhom: 'Gece hayatı, modern', priceLevel: 'lüks' },
      { name: 'Seefeld', nameEn: 'Seefeld', description: 'Göl kıyısı, yüzme alanları ve şık kafeler.', forWhom: 'Doğa sevenler, aileler', priceLevel: 'lüks' },
      { name: 'Oerlikon', nameEn: 'Oerlikon', description: 'Fuar bölgesi, iş otelleri ve ulaşım merkezi.', forWhom: 'İş seyahati, pratik', priceLevel: 'orta' },
    ],
    transportTip: 'ZVV kartı ile tren, tramvay ve otobüs. Havalimanı şehir merkezine tren ile 10 dk.',
    safetyNote: 'Zürih Avrupa\'nın en güvenli şehirlerinden. Her şey pahalı, bütçenizi planlayın.',
  },
  'kopenhag': {
    neighborhoods: [
      { name: 'Indre By', nameEn: 'City Center', description: 'Nyhavn, kraliyet sarayı ve alışveriş caddeleri.', forWhom: 'İlk kez gelenler, romantik', priceLevel: 'lüks' },
      { name: 'Vesterbro', nameEn: 'Vesterbro', description: 'Meatpacking District, barlar ve hipster kafeler.', forWhom: 'Gece hayatı, gençler', priceLevel: 'orta' },
      { name: 'Nørrebro', nameEn: 'Norrebro', description: 'Multikulti, vintage dükkanlar ve canlı sokak sahnesi.', forWhom: 'Alternatif, uzun konaklama', priceLevel: 'ekonomik' },
      { name: 'Frederiksberg', nameEn: 'Frederiksberg', description: 'Yeşil parklar, hayvanat bahçesi ve sakin atmosfer.', forWhom: 'Aileler, huzur arayanlar', priceLevel: 'orta' },
      { name: 'Christianshavn', nameEn: 'Christianshavn', description: 'Kanallar, Christiania ve alternatif yaşam.', forWhom: 'Alternatif kültür, fotoğrafçılar', priceLevel: 'orta' },
    ],
    transportTip: 'Rejsekort ile metro, S-tog ve otobüs. Havalimanından metro ile merkeze 15 dk.',
    safetyNote: 'Kopenhag çok güvenli. Bisikletlere dikkat, bisiklet yollarına basmayın.',
  },
  'stockholm': {
    neighborhoods: [
      { name: 'Gamla Stan', nameEn: 'Old Town', description: 'Ortaçağ sokakları, kraliyet sarayı ve Nobel Müzesi.', forWhom: 'İlk kez gelenler, tarih', priceLevel: 'lüks' },
      { name: 'Södermalm', nameEn: 'Sodermalm', description: 'Hipster mahallesi, vintage mağazalar ve manzara noktaları.', forWhom: 'Gençler, sanat severler', priceLevel: 'orta' },
      { name: 'Östermalm', nameEn: 'Ostermalm', description: 'Lüks alışveriş, şık restoranlar ve diplomatik bölge.', forWhom: 'Lüks tatil, gurme', priceLevel: 'lüks' },
      { name: 'Norrmalm', nameEn: 'Norrmalm', description: 'Merkez istasyon, alışveriş ve iş otelleri.', forWhom: 'İş seyahati, merkezi konum', priceLevel: 'lüks' },
      { name: 'Djurgården', nameEn: 'Djurgarden', description: 'Ada, ABBA müzesi, Skansen ve doğa.', forWhom: 'Aileler, müze severler', priceLevel: 'orta' },
    ],
    transportTip: 'SL kartı ile metro (Tunnelbana), otobüs ve feribot. Arlanda\'dan Arlanda Express ile merkeze 20 dk.',
    safetyNote: 'Stockholm çok güvenli. Kış aylarında erken karanlık olur, güneş gözlüğü yerine vitamin D tavsiye.',
  },
  'varsova': {
    neighborhoods: [
      { name: 'Old Town', nameEn: 'Old Town', description: 'UNESCO miras, yeniden inşa edilmiş tarihi merkez.', forWhom: 'Tarih meraklıları, fotoğrafçılar', priceLevel: 'orta' },
      { name: 'Śródmieście', nameEn: 'City Center', description: 'Kültür Sarayı, alışveriş ve modern gökdelenler.', forWhom: 'İş seyahati, şehir gezisi', priceLevel: 'lüks' },
      { name: 'Praga', nameEn: 'Praga', description: 'Alternatif sanat sahnesi, eski fabrikalar ve barlar.', forWhom: 'Alternatif kültür, sanat', priceLevel: 'ekonomik' },
      { name: 'Żoliborz', nameEn: 'Zoliborz', description: 'Yeşil ve sakin konut bölgesi, yerel yaşam.', forWhom: 'Uzun konaklama, aileler', priceLevel: 'orta' },
    ],
    transportTip: 'Karta Miejska ile metro ve tramvay. Chopin havalimanından S2 tren ile merkeze 25 dk.',
    safetyNote: 'Varşova güvenli ve misafirperver. İngilizce yaygın olarak konuşuluyor.',
  },
  'dublin': {
    neighborhoods: [
      { name: 'Temple Bar', nameEn: 'Temple Bar', description: 'Canlı pub\'lar, canlı müzik ve turist merkezi.', forWhom: 'Gece hayatı, ilk kez gelenler', priceLevel: 'orta' },
      { name: 'Georgian Dublin', nameEn: 'Georgian Dublin', description: 'Merrion Square, müzeler ve şık townhouse\'lar.', forWhom: 'Kültür, tarihi mimari', priceLevel: 'lüks' },
      { name: 'Docklands', nameEn: 'Docklands', description: 'Silikon Dock, tech şirketleri ve modern oteller.', forWhom: 'İş seyahati, modern', priceLevel: 'lüks' },
      { name: 'Smithfield', nameEn: 'Smithfield', description: 'Jameson fabrikası, yerel barlar ve sanat.', forWhom: 'Whiskey tutkunları, yerel deneyim', priceLevel: 'orta' },
      { name: 'Rathmines', nameEn: 'Rathmines', description: 'Öğrenci mahallesi, ucuz yemek ve canlı atmosfer.', forWhom: 'Bütçe bilinçli, gençler', priceLevel: 'ekonomik' },
    ],
    transportTip: 'Leap Card ile DART, Luas ve otobüs. Havalimanından 747 otobüs ile merkeze 30 dk.',
    safetyNote: 'Dublin güvenli. Pub\'larda canlı müzik geleneğini yaşayın.',
  },
  'helsinki': {
    neighborhoods: [
      { name: 'Kamppi', nameEn: 'Kamppi', description: 'Alışveriş merkezi, otobüs terminali ve merkezi konum.', forWhom: 'İş seyahati, pratik', priceLevel: 'lüks' },
      { name: 'Design District', nameEn: 'Design District', description: 'Fin tasarımı, butik mağazalar ve galeriler.', forWhom: 'Tasarım tutkunları, alışveriş', priceLevel: 'lüks' },
      { name: 'Kallio', nameEn: 'Kallio', description: 'Hipster mahallesi, barlar ve canlı gece hayatı.', forWhom: 'Gençler, alternatif kültür', priceLevel: 'ekonomik' },
      { name: 'Kruununhaka', nameEn: 'Kruununhaka', description: 'Tarihi binalar, antikacılar ve sakin sokaklar.', forWhom: 'Tarih severler, romantik', priceLevel: 'orta' },
    ],
    transportTip: 'HSL kartı ile tramvay, metro ve otobüs. Havalimanından tren ile merkeze 30 dk.',
    safetyNote: 'Helsinki dünyanın en güvenli başkentlerinden. Kış aylarında saunalar vazgeçilmez.',
  },

  // === YENİ EKLENDİ - AMERİKA ===
  'miami': {
    neighborhoods: [
      { name: 'South Beach', nameEn: 'South Beach', description: 'Art Deco binalar, beyaz kumsal ve gece hayatı.', forWhom: 'Plaj sevenler, parti', priceLevel: 'lüks' },
      { name: 'Brickell', nameEn: 'Brickell', description: 'Finans merkezi, gökdelenler ve şık restoranlar.', forWhom: 'İş seyahati, lüks', priceLevel: 'lüks' },
      { name: 'Wynwood', nameEn: 'Wynwood', description: 'Duvar resimleri, sanat galerileri ve hipster kafeler.', forWhom: 'Sanat severler, Instagram', priceLevel: 'orta' },
      { name: 'Little Havana', nameEn: 'Little Havana', description: 'Küba kültürü, cigar shop\'lar ve Latin lezzetler.', forWhom: 'Kültür turizmi, yemek', priceLevel: 'ekonomik' },
      { name: 'Coconut Grove', nameEn: 'Coconut Grove', description: 'Yeşil mahalle, butik mağazalar ve marina.', forWhom: 'Aileler, sakin tatil', priceLevel: 'lüks' },
    ],
    transportTip: 'Metromover ücretsiz downtown dolaşım. Uber yaygın. Havalimanından merkeze 20 dk.',
    safetyNote: 'Turistik bölgeler güvenli. Gece bazı downtown bölgelerinde dikkatli olun.',
  },
  'los-angeles': {
    neighborhoods: [
      { name: 'Hollywood', nameEn: 'Hollywood', description: 'Walk of Fame, stüdyo turları ve tema parkları.', forWhom: 'İlk kez gelenler, eğlence', priceLevel: 'orta' },
      { name: 'Santa Monica', nameEn: 'Santa Monica', description: 'İkonik pier, plaj ve Third Street alışveriş.', forWhom: 'Plaj tatili, aileler', priceLevel: 'lüks' },
      { name: 'Downtown LA', nameEn: 'Downtown LA', description: 'Arts District, Grand Central Market ve modern oteller.', forWhom: 'Sanat, yemek tutkunları', priceLevel: 'orta' },
      { name: 'Venice', nameEn: 'Venice Beach', description: 'Bohemian plaj, Muscle Beach ve kanal yürüyüşü.', forWhom: 'Alternatif, surf kültürü', priceLevel: 'orta' },
      { name: 'Beverly Hills', nameEn: 'Beverly Hills', description: 'Rodeo Drive, ünlü malikaneler ve lüks alışveriş.', forWhom: 'Lüks tatil, alışveriş', priceLevel: 'lüks' },
    ],
    transportTip: 'Araç kiralamak neredeyse zorunlu. Metro sınırlı ama genişliyor. LAX\'tan merkeze 45-90 dk (trafiğe bağlı).',
    safetyNote: 'Turistik bölgeler güvenli. Homeless sorunu bazı bölgelerde görünür.',
  },
  'chicago': {
    neighborhoods: [
      { name: 'The Loop', nameEn: 'The Loop', description: 'İş merkezi, Millennium Park ve Willis Tower.', forWhom: 'İş seyahati, mimari', priceLevel: 'lüks' },
      { name: 'River North', nameEn: 'River North', description: 'Galeriler, gece kulüpleri ve şık restoranlar.', forWhom: 'Gece hayatı, sanat', priceLevel: 'lüks' },
      { name: 'Magnificent Mile', nameEn: 'Magnificent Mile', description: 'Alışveriş caddesi, lüks mağazalar ve göl manzarası.', forWhom: 'Alışveriş, turistik', priceLevel: 'lüks' },
      { name: 'Wicker Park', nameEn: 'Wicker Park', description: 'Hipster mahallesi, vintage dükkanlar ve canlı barlar.', forWhom: 'Alternatif, gençler', priceLevel: 'orta' },
      { name: 'Hyde Park', nameEn: 'Hyde Park', description: 'Üniversite bölgesi, Obama mirası ve müzeler.', forWhom: 'Akademik, tarih', priceLevel: 'orta' },
    ],
    transportTip: 'CTA L treni ve otobüsler yaygın. O\'Hare\'den Blue Line ile merkeze 45 dk.',
    safetyNote: 'Downtown ve turistik bölgeler güvenli. South Side\'a gitmeden önce araştırın.',
  },
  'toronto': {
    neighborhoods: [
      { name: 'Downtown', nameEn: 'Downtown', description: 'CN Tower, Rogers Centre ve finans bölgesi.', forWhom: 'İş seyahati, ilk kez gelenler', priceLevel: 'lüks' },
      { name: 'Yorkville', nameEn: 'Yorkville', description: 'Lüks butikler, galeriler ve şık kafeler.', forWhom: 'Lüks alışveriş, romantik', priceLevel: 'lüks' },
      { name: 'Queen West', nameEn: 'Queen West', description: 'Sanat, moda ve gece hayatı merkezi.', forWhom: 'Hipster, sanat severler', priceLevel: 'orta' },
      { name: 'Kensington Market', nameEn: 'Kensington Market', description: 'Vintage, multikulti ve bohemian atmosfer.', forWhom: 'Alternatif, bütçe bilinçli', priceLevel: 'ekonomik' },
      { name: 'Distillery District', nameEn: 'Distillery District', description: 'Viktoryen endüstriyel miras, galeriler ve restoranlar.', forWhom: 'Fotoğrafçılar, romantik', priceLevel: 'lüks' },
    ],
    transportTip: 'TTC Presto kartı ile metro, streetcar ve otobüs. Pearson\'dan UP Express ile Union\'a 25 dk.',
    safetyNote: 'Toronto çok güvenli ve çok kültürlü. Kış soğuğuna hazırlıklı gelin.',
  },

  // === YENİ EKLENDİ - ORTA DOĞU / AFRİKA ===
  'doha': {
    neighborhoods: [
      { name: 'West Bay', nameEn: 'West Bay', description: 'Gökdelenler, lüks oteller ve Corniche yürüyüşü.', forWhom: 'İş seyahati, lüks tatil', priceLevel: 'lüks' },
      { name: 'Souq Waqif', nameEn: 'Souq Waqif', description: 'Geleneksel çarşı, baharatlar ve yerel lezzetler.', forWhom: 'Kültür turizmi, yemek', priceLevel: 'orta' },
      { name: 'The Pearl', nameEn: 'The Pearl', description: 'Yapay ada, lüks yaşam ve marina restoranları.', forWhom: 'Lüks alışveriş, çiftler', priceLevel: 'lüks' },
      { name: 'Katara', nameEn: 'Katara Cultural Village', description: 'Plajlar, galeriler ve kültürel etkinlikler.', forWhom: 'Aileler, plaj', priceLevel: 'orta' },
    ],
    transportTip: 'Doha Metro modern ve hızlı. Uber/Karwa taksi güvenilir. Havalimanı metro bağlantılı.',
    safetyNote: 'Katar dünyanın en güvenli ülkelerinden. Alkol sadece lisanslı mekanlarda satılır.',
  },
  'cape-town': {
    neighborhoods: [
      { name: 'Waterfront', nameEn: 'V&A Waterfront', description: 'Alışveriş, restoranlar ve Table Mountain manzarası.', forWhom: 'Turistik, aileler', priceLevel: 'lüks' },
      { name: 'Camps Bay', nameEn: 'Camps Bay', description: 'Plaj, palmiyeler ve sunset cocktail barları.', forWhom: 'Plaj tatili, lüks', priceLevel: 'lüks' },
      { name: 'City Bowl', nameEn: 'City Bowl', description: 'Şehir merkezi, Long Street ve canlı gece hayatı.', forWhom: 'Gece hayatı, backpackers', priceLevel: 'orta' },
      { name: 'Constantia', nameEn: 'Constantia', description: 'Şarap çiftlikleri, yeşillik ve lüks villalar.', forWhom: 'Şarap turları, huzur', priceLevel: 'lüks' },
      { name: 'Observatory', nameEn: 'Observatory', description: 'Öğrenci mahallesi, bohemian ve ucuz yemek.', forWhom: 'Bütçe bilinçli, alternatif', priceLevel: 'ekonomik' },
    ],
    transportTip: 'MyCiti otobüs sistemi Waterfront ve plajları bağlar. Uber güvenilir ve uygun fiyatlı.',
    safetyNote: 'Turistik bölgeler güvenli. Gece yalnız yürümeyin, Uber tercih edin. Değerli eşyaları göstermeyin.',
  },
  'zanzibar': {
    neighborhoods: [
      { name: 'Stone Town', nameEn: 'Stone Town', description: 'UNESCO miras, tarihi sokaklar ve Forodhani pazarı.', forWhom: 'Kültür turizmi, tarih', priceLevel: 'orta' },
      { name: 'Nungwi', nameEn: 'Nungwi', description: 'Kuzey ucunda beyaz kumsal ve canlı beach bar\'lar.', forWhom: 'Plaj tatili, genç çiftler', priceLevel: 'orta' },
      { name: 'Kendwa', nameEn: 'Kendwa', description: 'Gelgit sorunsuz plaj ve lüks resortlar.', forWhom: 'Balayı, lüks tatil', priceLevel: 'lüks' },
      { name: 'Paje', nameEn: 'Paje', description: 'Uçurtma sörfü, backpacker hosteller ve bohem.', forWhom: 'Su sporları, bütçe', priceLevel: 'ekonomik' },
      { name: 'Jambiani', nameEn: 'Jambiani', description: 'Sakin köy yaşamı, deniz yosunu çiftlikleri ve yerel deneyim.', forWhom: 'Huzur arayanlar, otantik', priceLevel: 'ekonomik' },
    ],
    transportTip: 'Dala dala (minibüs) ucuz ama kalabalık. Taksi pazarlıklı. Transfer düzenlemeniz önerilir.',
    safetyNote: 'Zanzibar güvenli ve misafirperver. İslami kültüre saygılı giyim tercih edin.',
  },
};

// Get neighborhood data for a city
export function getCityNeighborhoods(citySlug: string): CityNeighborhoodData | null {
  return cityNeighborhoodsData[citySlug.toLowerCase()] || null;
}

// Get default FAQ items for hotel pages
export function getHotelFAQItems(cityName: string, country: string): Array<{ question: string; answer: string }> {
  return [
    {
      question: `${cityName}'de en iyi konaklama bölgesi neresi?`,
      answer: `${cityName}'de konaklama bölgesi seyahat amacınıza göre değişir. İlk kez ziyaret ediyorsanız şehir merkezi veya tarihi bölgeler idealdir. Uzun süreli konaklama için yerel mahalleleri tercih edebilirsiniz.`,
    },
    {
      question: `${cityName} otel fiyatları ne kadar?`,
      answer: `${cityName}'de otel fiyatları kategoriye göre değişir. Ekonomik seçenekler 30-60€, orta segment 60-120€, lüks oteller 150€ ve üzeri gecelik ücretlendirmeye sahiptir. Erken rezervasyonla %20-30 tasarruf mümkün.`,
    },
    {
      question: `${cityName}'e kaç gün yeterli?`,
      answer: `${cityName}'in temel noktalarını görmek için 3-4 gün ideal. Daha derin bir keşif için 5-7 gün planlamanızı öneririz. Çevredeki günübirlik turlar için ek günler ekleyebilirsiniz.`,
    },
    {
      question: `${cityName}'de solo seyahat güvenli mi?`,
      answer: `${cityName} solo gezginler için oldukça güvenlidir. Turistik bölgeler iyi aydınlatılmış ve kalabalıktır. Temel önlemleri alarak (değerli eşyalara dikkat, gece merkezi bölgelerde kalma) güvenle seyahat edebilirsiniz.`,
    },
    {
      question: `${cityName} otelleri havalimanına yakın mı?`,
      answer: `${cityName} havalimanından şehir merkezine toplu taşıma veya taksi ile kolay ulaşım var. Çoğu otel transfer hizmeti sunuyor. Erken uçuşlar için havalimanı yakınında konaklama seçenekleri de mevcut.`,
    },
    {
      question: `${cityName}'de aile ile kalınacak en iyi bölge?`,
      answer: `Aileler için geniş odalar, havuz ve çocuk aktiviteleri sunan oteller ideal. Şehir merkezine yakın ama sakin mahalleleri tercih edin. All-inclusive resortlar da aile dostu seçenekler arasında.`,
    },
    {
      question: `${cityName} otellerinde erken check-in / geç check-out yapılabilir mi?`,
      answer: `Çoğu ${cityName} oteli erken check-in (genelde 14:00) ve geç check-out (genelde 12:00) için esneklik sunar. Oda müsaitliğine göre ücretsiz veya ek ücretli olabilir. Rezervasyon sırasında talep etmeniz önerilir.`,
    },
    {
      question: `${cityName}'de otel rezervasyonunda depozito ve iptal koşulları neler?`,
      answer: `${cityName} otellerinin çoğu kredi kartı garantisi ile rezervasyon kabul eder. Esnek tarifelerde 24-48 saat öncesine kadar ücretsiz iptal mümkün. Non-refundable tarifelerde indirim yapılır ancak iptal halinde iade yoktur.`,
    },
  ];
}
