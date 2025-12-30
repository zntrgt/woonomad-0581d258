import { destinationData, DestinationInfo, getCountryFlag } from './destinations';

export interface Highlight {
  name: string;
  description: string;
}

export interface SEODestination {
  slug: string;
  airportCode: string;
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  visaRequired: boolean;
  continent: 'europe' | 'asia' | 'americas' | 'africa' | 'oceania';
  description: string;
  highlights: Highlight[];
  bestTimeToVisit: string;
  averageFlightDuration: string;
  imageUrl: string;
  keywords: string[];
}

// Create URL-friendly slug from city name
function createSlug(city: string): string {
  return city
    .toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, '') // Remove parentheses content
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Visa-free destinations for Turkish passport
const VISA_FREE_CODES = [
  'TIR', 'PRN', 'SKP', 'SJJ', 'TGD', 'BEG', // Balkans
  'ICN', 'GMP', 'NRT', 'HND', 'KIX', // Korea, Japan
  'SIN', 'KUL', 'BKK', 'DMK', 'CGK', 'DPS', 'MNL', 'HKG', 'TPE', 'KTM', // SE Asia
  'DOH', 'DXB', 'AUH', 'BAH', 'MCT', 'KWI', 'AMM', 'BEY', // Middle East
  'TUN', 'CMN', 'RAK', 'CPT', 'JNB', 'NBO', 'DAR', 'ZNZ', // Africa
  'GRU', 'GIG', 'BSB', 'EZE', 'SCL', 'BOG', 'LIM', 'UIO', 'PTY', 'SJO', // S. America
  'NAS', 'MBJ', 'SDQ', 'HAV', // Caribbean
  'ALA', 'NQZ', 'TAS', 'FRU', 'GYD', 'TBS', // Central Asia
  'ECN', // N. Cyprus
];

// Continent mapping
const CONTINENT_MAP: Record<string, SEODestination['continent']> = {
  'AL': 'europe', 'XK': 'europe', 'MK': 'europe', 'BA': 'europe', 'ME': 'europe', 'RS': 'europe',
  'FR': 'europe', 'GB': 'europe', 'DE': 'europe', 'NL': 'europe', 'BE': 'europe', 'AT': 'europe',
  'CH': 'europe', 'IT': 'europe', 'ES': 'europe', 'PT': 'europe', 'GR': 'europe', 'CZ': 'europe',
  'PL': 'europe', 'HU': 'europe', 'RO': 'europe', 'BG': 'europe', 'DK': 'europe', 'SE': 'europe',
  'NO': 'europe', 'FI': 'europe', 'IE': 'europe', 'LV': 'europe', 'LT': 'europe', 'EE': 'europe',
  'RU': 'europe',
  'KR': 'asia', 'JP': 'asia', 'SG': 'asia', 'MY': 'asia', 'TH': 'asia', 'ID': 'asia', 'PH': 'asia',
  'HK': 'asia', 'TW': 'asia', 'NP': 'asia', 'QA': 'asia', 'AE': 'asia', 'BH': 'asia', 'OM': 'asia',
  'KW': 'asia', 'JO': 'asia', 'LB': 'asia', 'KZ': 'asia', 'UZ': 'asia', 'KG': 'asia', 'AZ': 'asia',
  'GE': 'asia', 'CN': 'asia', 'IN': 'asia', 'CY': 'asia', 'TR': 'asia',
  'TN': 'africa', 'MA': 'africa', 'ZA': 'africa', 'KE': 'africa', 'TZ': 'africa',
  'BR': 'americas', 'AR': 'americas', 'CL': 'americas', 'CO': 'americas', 'PE': 'americas',
  'EC': 'americas', 'PA': 'americas', 'CR': 'americas', 'BS': 'americas', 'JM': 'americas',
  'DO': 'americas', 'CU': 'americas', 'US': 'americas', 'CA': 'americas',
  'AU': 'oceania', 'NZ': 'oceania',
};

// City descriptions - comprehensive data for all destinations
const CITY_DESCRIPTIONS: Record<string, { description: string; highlights: Highlight[]; bestTime: string; duration: string }> = {
  // === AVRUPA ===
  'Atina': {
    description: 'Antik Yunan medeniyetinin kalbi Atina, tarihi zenginlikleri, muhteşem Akropolisi ve canlı gece hayatıyla unutulmaz bir tatil deneyimi sunuyor.',
    highlights: [
      { name: 'Akropolis ve Parthenon', description: 'MÖ 5. yüzyıldan kalma UNESCO Dünya Mirası, Antik Yunan\'ın sembolü kutsal tepe.' },
      { name: 'Plaka Mahallesi', description: 'Akropolis eteklerinde dar sokakları, tavernaları ve hediyelik eşya dükkanlarıyla nostaljik mahalle.' },
      { name: 'Monastiraki Meydanı', description: 'Bit pazarı, antika dükkanları ve sokak sanatçılarıyla canlı buluşma noktası.' },
      { name: 'Ulusal Arkeoloji Müzesi', description: 'Dünyanın en zengin antik Yunan koleksiyonuna ev sahipliği yapan müze.' },
      { name: 'Syntagma Meydanı', description: 'Parlamento binası önünde geleneksel Evzon nöbet değişimi töreni.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '1 saat 20 dk',
  },
  'Paris': {
    description: 'Aşkın ve sanatın başkenti Paris, Eyfel Kulesi, Louvre Müzesi ve romantik sokakalarıyla dünyanın en çok ziyaret edilen şehirlerinden.',
    highlights: [
      { name: 'Eyfel Kulesi', description: '1889 yapımı 330 metre yüksekliğindeki demir kule, Paris\'in ikonik sembolü.' },
      { name: 'Louvre Müzesi', description: 'Mona Lisa dahil 35.000 eser barındıran dünyanın en büyük sanat müzesi.' },
      { name: 'Champs-Élysées', description: 'Lüks mağazalar, kafeler ve Zafer Takı ile sonlanan ikonik bulvar.' },
      { name: 'Montmartre', description: 'Sacré-Cœur Bazilikası, sanatçı atölyeleri ve panoramik Paris manzarasıyla tepe mahallesi.' },
      { name: 'Seine Nehri Turu', description: 'Notre-Dame, Musée d\'Orsay ve köprüleri keşfetmek için romantik tekne gezisi.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Kasım',
    duration: '3 saat 30 dk',
  },
  'Roma': {
    description: 'Antik Roma İmparatorluğunun kalbi, Kolezyum, Vatikan ve eşsiz İtalyan mutfağıyla tarih ve lezzet tutkunlarının vazgeçilmez durağı.',
    highlights: [
      { name: 'Kolezyum', description: '2000 yıllık amfi tiyatro, 50.000 seyirci kapasiteli gladyatör arenası.' },
      { name: 'Vatikan Müzeleri', description: 'Sistine Şapeli ve Michelangelo\'nun tavan freskleriyle dünyaca ünlü koleksiyon.' },
      { name: 'Trevi Çeşmesi', description: 'Barok tarzda 26 metre yüksekliğinde, para atma geleneğiyle ünlü çeşme.' },
      { name: 'Pantheon', description: 'MS 125\'ten kalma dünyanın en iyi korunmuş antik Roma tapınağı.' },
      { name: 'İspanyol Merdivenleri', description: '135 basamaklı, moda markaları ve çiçeklerle süslü buluşma noktası.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '2 saat 15 dk',
  },
  'Barselona': {
    description: 'Gaudi\'nin mimari şaheserleri, muhteşem plajları ve canlı kültürüyle Akdeniz\'in incisi Barselona, her mevsim tatilcileri bekliyor.',
    highlights: [
      { name: 'Sagrada Familia', description: 'Gaudi\'nin 1882\'den beri devam eden, 2026 bitirilmesi planlanan efsanevi bazilikası.' },
      { name: 'Park Güell', description: 'Renkli mozaikler ve fantastik yapılarla süslü UNESCO Dünya Mirası park.' },
      { name: 'La Rambla', description: 'Sokak sanatçıları, çiçekçiler ve kafelerle dolu 1.2 km\'lik yaya caddesi.' },
      { name: 'Barceloneta Plajı', description: 'Şehir merkezine yakın, deniz ürünleri restoranları ve gece hayatıyla ünlü plaj.' },
      { name: 'Camp Nou Stadyumu', description: 'FC Barcelona\'nın 99.000 kişilik efsanevi stadyumu ve müzesi.' }
    ],
    bestTime: 'Mayıs-Haziran, Eylül-Ekim',
    duration: '3 saat',
  },
  'Amsterdam': {
    description: 'Kanalları, bisiklet kültürü, müzeleri ve özgür atmosferiyle Amsterdam, Avrupa\'nın en renkli başkentlerinden biri.',
    highlights: [
      { name: 'Anne Frank Evi', description: 'II. Dünya Savaşı\'nda Yahudi Anne Frank\'ın saklandığı ev-müze.' },
      { name: 'Van Gogh Müzesi', description: '200\'den fazla tablo ve 500 çizimle dünyanın en büyük Van Gogh koleksiyonu.' },
      { name: 'Rijksmuseum', description: 'Rembrandt\'ın Gece Nöbeti dahil Hollanda altın çağı şaheserleri.' },
      { name: 'Vondelpark', description: 'Yıllık 10 milyon ziyaretçisiyle Amsterdam\'ın en büyük şehir parkı.' },
      { name: 'Kanal Turu', description: 'UNESCO listesindeki 17. yüzyıl kanallarını keşfetmek için tekne gezisi.' }
    ],
    bestTime: 'Nisan-Eylül',
    duration: '3 saat 15 dk',
  },
  'Londra': {
    description: 'Kraliyet sarayları, dünyaca ünlü müzeleri ve kozmopolit yapısıyla Londra, kültür ve tarih tutkunları için eşsiz bir deneyim.',
    highlights: [
      { name: 'Big Ben', description: '1859\'dan beri çalışan 96 metre yüksekliğindeki ikonik saat kulesi.' },
      { name: 'Tower Bridge', description: 'Açılır köprü mekanizması ve cam taban yürüyüşüyle Viktorya dönemi mühendislik harikası.' },
      { name: 'British Museum', description: '8 milyon eserle insanlık tarihinin en kapsamlı koleksiyonu, ücretsiz giriş.' },
      { name: 'Buckingham Sarayı', description: 'Kraliyet ailesinin resmi konutu, muhafız değişimi törenleri.' },
      { name: 'Westminster Abbey', description: 'Kraliyet düğünleri ve taç giyme törenlerinin bin yıllık mekanı.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '4 saat',
  },
  'Berlin': {
    description: 'Tarihi ve modern yanıyla Berlin, sanat galerileri, gece hayatı ve kültürel çeşitliliğiyle Avrupa\'nın en dinamik başkenti.',
    highlights: [
      { name: 'Brandenburg Kapısı', description: '1791 yapımı Neoklasik zafer takı, Almanya birleşmesinin sembolü.' },
      { name: 'Berlin Duvarı', description: 'East Side Gallery\'de 1.3 km\'lik grafiti sanatıyla kaplanmış tarihi duvar kalıntısı.' },
      { name: 'Reichstag', description: 'Cam kubbesiyle modern Alman demokrasisinin merkezi, panoramik manzara.' },
      { name: 'Museum Island', description: 'Spree Nehri üzerinde 5 dünyaca ünlü müzeyle UNESCO Dünya Mirası.' },
      { name: 'Checkpoint Charlie', description: 'Soğuk Savaş döneminden kalma tarihi sınır geçiş noktası ve müzesi.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '2 saat 45 dk',
  },
  'Münih': {
    description: 'Bavyera\'nın başkenti Münih, geleneksel bira bahçeleri, muhteşem sarayları ve Alp manzarasıyla büyülüyor.',
    highlights: [
      { name: 'Marienplatz', description: 'Gotik Yeni Belediye Binası ve günde 3 kez çalan Glockenspiel ile merkez meydan.' },
      { name: 'Nymphenburg Sarayı', description: 'Bavyera krallarının 180 hektarlık bahçeli barok yazlık sarayı.' },
      { name: 'Englischer Garten', description: 'Central Park\'tan büyük, nehirde sörf ve bira bahçeleriyle şehir parkı.' },
      { name: 'BMW Müzesi', description: 'Fütüristik yapıda BMW\'nin tarihini sergileyen interaktif müze.' },
      { name: 'Viktualienmarkt', description: '1807\'den beri faaliyet gösteren, 140 tezgahlı açık hava gıda pazarı.' }
    ],
    bestTime: 'Mayıs-Ekim',
    duration: '2 saat 30 dk',
  },
  'Frankfurt': {
    description: 'Almanya\'nın finans merkezi Frankfurt, modern gökdelenleri ve tarihi eski şehriyle ilginç bir kontrast sunuyor.',
    highlights: [
      { name: 'Römerberg Meydanı', description: 'Ortaçağ tarzında yeniden inşa edilmiş, renkli ahşap evlerle çevrili meydan.' },
      { name: 'Main Kulesi', description: '200 metre yükseklikte açık gözlem platformuyla Frankfurt skyline panoraması.' },
      { name: 'Palmengarten', description: '22 hektar alanda tropik seralar ve botanik bahçesiyle yeşil vaha.' },
      { name: 'Städel Müzesi', description: '700 yıllık Avrupa sanatını kapsayan, Almanya\'nın en önemli müzelerinden.' },
      { name: 'Sachsenhausen', description: 'Geleneksel elma şarabı tavernaları ve canlı gece hayatıyla tarihi mahalle.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '2 saat 45 dk',
  },
  'Prag': {
    description: 'Ortaçağ mimarisi, tarihi köprüleri ve masalsı atmosferiyle Prag, Avrupa\'nın en romantik şehirlerinden biri.',
    highlights: [
      { name: 'Charles Köprüsü', description: '1402 yapımı, 30 barok heykel ile süslü 500 metre uzunluğunda taş köprü.' },
      { name: 'Eski Kent Meydanı', description: 'Gotik kiliseler, barok yapılar ve ünlü Astronomik Saat ile tarihi merkez.' },
      { name: 'Prag Kalesi', description: 'Guinness\'e göre dünyanın en büyük antik kalesi, cumhurbaşkanlığı konutu.' },
      { name: 'Astronomik Saat', description: '1410\'dan çalışan dünyanın en eski çalışır astronomik saati.' },
      { name: 'Yahudi Mahallesi', description: 'Ortaçağ sinagogları ve tarihi mezarlıkla Avrupa\'nın en iyi korunmuş Yahudi mirası.' }
    ],
    bestTime: 'Nisan-Mayıs, Eylül-Ekim',
    duration: '2 saat 30 dk',
  },
  'Budapeşte': {
    description: 'Tuna Nehri\'nin iki yakasında kurulu Budapeşte, termal kaplıcaları, muhteşem mimarisi ve canlı gece hayatıyla büyülüyor.',
    highlights: [
      { name: 'Parlamento Binası', description: 'Neo-Gotik tarzda, 691 odalı, Avrupa\'nın en büyük parlamento binalarından.' },
      { name: 'Balıkçı Kalesi', description: 'Tuna ve Pest manzarasıyla 7 kulelei neo-Gotik terasa sahip platform.' },
      { name: 'Széchenyi Kaplıcası', description: 'Avrupa\'nın en büyük termal hamamı, 18 havuz ve 37°C sıcaklıkta şifa.' },
      { name: 'Zincir Köprü', description: '1849 yapımı, Buda ve Pest\'i birleştiren ilk kalıcı köprü.' },
      { name: 'Buda Kalesi', description: 'UNESCO Dünya Mirası, Macar krallarının tarihi sarayı ve müzeler kompleksi.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '2 saat',
  },
  'Viyana': {
    description: 'Habsburg İmparatorluğunun başkenti Viyana, klasik müziği, imparatorluk sarayları ve kahve kültürüyle Avrupa\'nın kültür merkezi.',
    highlights: [
      { name: 'Schönbrunn Sarayı', description: '1.441 odalı barok saray, 160 hektarlık bahçesi ve hayvanat bahçesiyle.' },
      { name: 'St. Stephen Katedrali', description: '136 metre yüksekliğinde Gotik kule, Viyana\'nın tarihi kalbi.' },
      { name: 'Belvedere Müzesi', description: 'Klimt\'in Öpücük tablosuyla ünlü, barok saray içindeki sanat müzesi.' },
      { name: 'Viyana Operası', description: 'Dünyanın en prestijli opera sahnelerinden, 300+ gösteri yılda.' },
      { name: 'Naschmarkt', description: '1774\'ten beri açık, 120+ tezgahla Viyana\'nın en popüler açık pazarı.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '2 saat 15 dk',
  },
  'Lizbon': {
    description: 'Yedi tepe üzerine kurulu Lizbon, nostaljik tramvayları, fado müziği ve pastéis de nata ile Portekiz\'in ruhunu yansıtıyor.',
    highlights: [
      { name: 'Belém Kulesi', description: '1521 yapımı UNESCO Dünya Mirası, Portekiz keşifler çağının simgesi.' },
      { name: 'Alfama Mahallesi', description: 'Labirent sokaklar, fado barları ve muhteşem manzaralarla en eski mahalle.' },
      { name: 'Jerónimos Manastırı', description: 'Manuelin gotik tarzında, Vasco da Gama\'nın mezarını barındıran UNESCO mirası.' },
      { name: '28 Numaralı Tramvay', description: 'Dar sokaklarda nostaljik yolculuk, Lizbon\'un en ikonik deneyimi.' },
      { name: 'Time Out Market', description: '35+ restoran ve barla Lizbon\'un en iyi mutfağını tek çatıda sunan pazar.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '3 saat 45 dk',
  },
  'Porto': {
    description: 'Douro Nehri kıyısında şarap mahzenleri, renkli evleri ve tarihi köprüleriyle Porto, Portekiz\'in kuzey incisi.',
    highlights: [
      { name: 'Ribeira Mahallesi', description: 'UNESCO Dünya Mirası, renkli evler ve nehir kenarı restoranlarıyla tarihi bölge.' },
      { name: 'Livraria Lello', description: '1906\'dan kalma, Harry Potter\'a ilham veren dünyanın en güzel kitapçısı.' },
      { name: 'Dom Luís Köprüsü', description: 'Eiffel\'in öğrencisi tarafından tasarlanan iki katlı demir köprü.' },
      { name: 'Şarap Mahzenleri', description: 'Vila Nova de Gaia\'da 60+ Port şarabı mahzeni ve tadım turları.' },
      { name: 'Clérigos Kulesi', description: '76 metre yüksekliğinde barok çan kulesi, Porto panoraması için ideal.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '3 saat 30 dk',
  },
  'Madrid': {
    description: 'İspanya\'nın başkenti Madrid, dünyaca ünlü müzeleri, canlı tapas kültürü ve coşkulu gece hayatıyla büyülüyor.',
    highlights: [
      { name: 'Prado Müzesi', description: 'Velázquez, Goya, El Greco başyapıtlarıyla dünyanın en iyi sanat müzelerinden.' },
      { name: 'Retiro Parkı', description: '125 hektarlık kraliyet parkı, kristal saray ve göl üzerinde kürek gezisi.' },
      { name: 'Plaza Mayor', description: '17. yüzyıldan kalma, 237 balkonu olan görkemli barok meydan.' },
      { name: 'Kraliyet Sarayı', description: '3.418 odalı Avrupa\'nın en büyük kraliyet sarayı, resmi tören mekanı.' },
      { name: 'Gran Vía', description: '1910\'da açılan, tiyatrolar ve mağazalarla Madrid\'in Broadway\'i.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Kasım',
    duration: '3 saat 30 dk',
  },
  'Palma de Mallorca': {
    description: 'Akdeniz\'in gözde adası Mallorca, turkuaz plajları, tarihi katedrali ve lüks marinalarıyla tatil cenneti.',
    highlights: [
      { name: 'Palma Katedrali', description: 'Gaudi\'nin dokunuşlarıyla 14. yüzyıl Gotik katedrali, deniz kenarında.' },
      { name: 'Bellver Kalesi', description: 'Avrupa\'nın nadir dairesel kalelerinden, 14. yüzyıl ve panoramik manzara.' },
      { name: 'Eski Şehir', description: 'Arap hamamları, avlulu evler ve butik dükkanlarla tarihi merkez.' },
      { name: 'Paseo Marítimo', description: 'Lüks yatlar, restoranlar ve gece kulüpleriyle sahil promenadı.' },
      { name: 'Serra de Tramuntana', description: 'UNESCO Dünya Mirası dağ sırası, yürüyüş parkurları ve köyler.' }
    ],
    bestTime: 'Mayıs-Ekim',
    duration: '3 saat 15 dk',
  },
  'Malaga': {
    description: 'Costa del Sol\'un incisi Malaga, Picasso\'nun doğduğu şehir olarak sanat, plaj ve İspanyol kültürünü bir arada sunuyor.',
    highlights: [
      { name: 'Alcazaba Kalesi', description: '11. yüzyıldan Endülüs dönemi Moor kalesi, bahçeler ve manzara.' },
      { name: 'Picasso Müzesi', description: '285 eserle Picasso\'nun doğduğu şehirdeki kapsamlı retrospektif.' },
      { name: 'Malagueta Plajı', description: 'Şehir merkezinde 1.2 km uzunluğunda, çapa sembolüyle ünlü plaj.' },
      { name: 'Atarazanas Pazarı', description: '19. yüzyıl Moorish tarzı bina içinde taze deniz ürünleri ve tapaslar.' },
      { name: 'Gibralfaro Kalesi', description: '14. yüzyıl Moorish kale, en iyi Costa del Sol manzarası için tırmanış.' }
    ],
    bestTime: 'Nisan-Kasım',
    duration: '3 saat 15 dk',
  },
  'Milano': {
    description: 'Moda ve tasarımın başkenti Milano, ikonik katedrali, La Scala operası ve lüks alışverişiyle İtalya\'nın modern yüzü.',
    highlights: [
      { name: 'Duomo Katedrali', description: '600 yıl süren inşaat, 3.400 heykel ve 135 kule ile Gotik şaheser.' },
      { name: 'Galleria Vittorio Emanuele II', description: '1877 yapımı cam kubbeli pasaj, Prada ve Louis Vuitton ile lüks alışveriş.' },
      { name: 'La Scala', description: '1778\'den beri dünyanın en prestijli opera sahnesi, opera tutkunları için hac yeri.' },
      { name: 'Son Akşam Yemeği', description: 'Leonardo da Vinci\'nin ikonik fresği, Santa Maria delle Grazie\'de.' },
      { name: 'Navigli Kanalları', description: 'Kafeler, barlar ve vintage dükkanlarla canlı kanal mahallesi.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '2 saat 30 dk',
  },
  'Venedik': {
    description: 'Su üzerinde kurulu eşsiz şehir Venedik, gondol turları, tarihi meydanları ve romantik atmosferiyle dünya harikası.',
    highlights: [
      { name: 'San Marco Meydanı', description: 'Napolyon\'un "Avrupa\'nın salonu" dediği, bazilika ve çan kulesiyle ikonik meydan.' },
      { name: 'Rialto Köprüsü', description: '1591 yapımı, Büyük Kanal üzerindeki en eski ve en ünlü köprü.' },
      { name: 'Gondol Turu', description: 'Dar kanallarda 800 yıllık gelenekle romantik yolculuk.' },
      { name: 'Doge Sarayı', description: 'Venedik Cumhuriyeti\'nin hükümet sarayı, Gotik mimari ve sanat.' },
      { name: 'Murano Adası', description: '700 yıllık cam üfleme geleneği, atölye ziyaretleri ve cam sanatı.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '2 saat',
  },
  'Napoli': {
    description: 'Pizzanın doğduğu şehir Napoli, Vezüv\'ün gölgesinde tarihi hazineleri, sokak lezzetleri ve Akdeniz ruhuyla büyülüyor.',
    highlights: [
      { name: 'Pompei Antik Kenti', description: 'MS 79\'da lav altında kalan, mükemmel korunmuş Roma şehri.' },
      { name: 'Napoli Ulusal Müzesi', description: 'Pompei buluntuları ve Farnese koleksiyonuyla dünya çapında arkeoloji müzesi.' },
      { name: 'Spaccanapoli', description: 'Napoli\'yi ikiye bölen tarihi sokak, kiliseler ve pizzacılar.' },
      { name: 'Castel dell\'Ovo', description: 'Deniz kenarında 2000 yıllık kale, efsanevi Virgilius yumurtası hikayesi.' },
      { name: 'Amalfi Sahili', description: 'UNESCO Dünya Mirası, uçurumlar, limon bahçeleri ve renkli köyler.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '2 saat 15 dk',
  },
  'Brüksel': {
    description: 'Avrupa\'nın başkenti Brüksel, Grand Place\'i, çikolata dükkanları ve Art Nouveau mimarisiyle büyülüyor.',
    highlights: [
      { name: 'Grand Place', description: 'UNESCO Dünya Mirası, altın yaldızlı barok cephelerle dünyanın en güzel meydanı.' },
      { name: 'Atomium', description: '1958 Expo\'dan kalma, 102 metre yüksekliğinde demir kristal modeli.' },
      { name: 'Manneken Pis', description: '1619\'dan 61 cm\'lik bronz heykel, 1000+ kostüm koleksiyonu.' },
      { name: 'Çikolata Müzesi', description: 'Belçika çikolatasının tarihi, üretimi ve sınırsız tadım.' },
      { name: 'Kraliyet Sarayı', description: 'Buckingham\'dan büyük cephesi, yaz aylarında halka açık.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '2 saat 45 dk',
  },
  'Zürih': {
    description: 'İsviçre\'nin finans merkezi Zürih, göl manzarası, temiz sokakları ve yüksek yaşam kalitesiyle etkileyici.',
    highlights: [
      { name: 'Zürih Gölü', description: '40 km uzunluğunda göl, yüzme, kürek ve tekne turları.' },
      { name: 'Bahnhofstrasse', description: 'Dünyanın en pahalı alışveriş caddelerinden, 1.4 km lüks mağazalar.' },
      { name: 'Eski Şehir', description: 'Ortaçağ sokakları, Grossmünster katedrali ve tarihi loncalar.' },
      { name: 'Kunsthaus Müzesi', description: 'İsviçre\'nin en büyük sanat koleksiyonu, Monet, Picasso, Chagall.' },
      { name: 'Uetliberg Dağı', description: '870 metre yükseklikte panoramik Alp ve göl manzarası.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '2 saat 30 dk',
  },
  'Cenevre': {
    description: 'Uluslararası diplomasinin merkezi Cenevre, göl manzarası, lüks saatçilik ve çok kültürlü yapısıyla büyüleyici.',
    highlights: [
      { name: 'Jet d\'Eau Çeşmesi', description: '140 metre yükseğe fışkıran su jeti, Cenevre\'nin ikonik simgesi.' },
      { name: 'Eski Şehir', description: 'St. Pierre Katedrali ve Calvin\'in izi sürülen tarihi mahalle.' },
      { name: 'BM Ofisi', description: 'Milletler Sarayı, New York\'tan sonra en büyük BM merkezi.' },
      { name: 'CERN', description: 'Büyük Hadron Çarpıştırıcısı ve evrenin sırlarını araştıran bilim merkezi.' },
      { name: 'Cenevre Gölü', description: 'Alp manzarası, göl turları ve sahil yürüyüşleri için ideal.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '2 saat 45 dk',
  },
  'Kopenhag': {
    description: 'Danimarka\'nın başkenti Kopenhag, bisiklet kültürü, renkli evleri ve hygge yaşam tarzıyla Kuzey\'in incisi.',
    highlights: [
      { name: 'Nyhavn', description: '17. yüzyıl limanı, renkli ahşap evler ve açık hava kafeleriyle ikonik görüntü.' },
      { name: 'Tivoli Bahçeleri', description: '1843\'ten dünyanın en eski eğlence parklarından, Walt Disney\'e ilham.' },
      { name: 'Küçük Deniz Kızı', description: 'Andersen\'in masalından 1913 yapımı bronz heykel, şehrin sembolü.' },
      { name: 'Rosenborg Kalesi', description: '17. yüzyıl Rönesans şatosu, Danimarka taç mücevherleri.' },
      { name: 'Strøget Caddesi', description: 'Avrupa\'nın en uzun yaya alışveriş caddelerinden, 1.1 km.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '3 saat',
  },
  'Stockholm': {
    description: '14 adadan oluşan Stockholm, zarif mimarisi, temiz suları ve İskandinav tasarımıyla Kuzey\'in Venedik\'i.',
    highlights: [
      { name: 'Gamla Stan', description: '13. yüzyıldan kalma dar sokaklar, renkli binalar ve Kraliyet Sarayı.' },
      { name: 'Vasa Müzesi', description: '1628\'de batan, %98 orijinal parçalarla kurtarılan savaş gemisi.' },
      { name: 'ABBA Müzesi', description: 'Efsanevi İsveç grubunun interaktif müzesi, sahne kostümleri ve hologramlar.' },
      { name: 'Kraliyet Sarayı', description: '600 odalı, Avrupa\'nın en büyük kraliyet saraylarından.' },
      { name: 'Djurgården Adası', description: 'Müzeler, parklar ve yürüyüş yollarıyla doğa ile iç içe ada.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '3 saat 15 dk',
  },
  'Oslo': {
    description: 'Fiyortların kapısı Oslo, modern mimarisi, müzeleri ve doğayla iç içe yaşam tarzıyla Norveç\'in kalbini yansıtıyor.',
    highlights: [
      { name: 'Vigeland Parkı', description: '200+ çıplak insan heykeli, Gustav Vigeland\'ın yaşam boyu eseri.' },
      { name: 'Opera Binası', description: 'Çatısında yürüyüş imkanı veren, fiyort kenarında modern mimari şaheseri.' },
      { name: 'Munch Müzesi', description: 'Çığlık tablosunun evi, Edvard Munch\'ün en büyük koleksiyonu.' },
      { name: 'Akershus Kalesi', description: '1299\'dan kalma ortaçağ kalesi, şehir ve fiyort manzarası.' },
      { name: 'Holmenkollen Atlama Kulesi', description: '120 yılı aşkın geçmişle kayak atlama kulesi ve müze.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '3 saat 30 dk',
  },
  'Helsinki': {
    description: 'Baltık\'ın beyaz incisi Helsinki, modern tasarımı, saunası ve denizle iç içe yaşamıyla Finlandiya\'nın gururu.',
    highlights: [
      { name: 'Helsinki Katedrali', description: 'Beyaz neoklasik katedral, Senaatör Meydanı\'na hakim landmark.' },
      { name: 'Suomenlinna Kalesi', description: 'UNESCO Dünya Mirası, 6 ada üzerinde 18. yüzyıl deniz kalesi.' },
      { name: 'Market Meydanı', description: 'Liman kenarında taze balık, yerel ürünler ve kahve satışı.' },
      { name: 'Temppeliaukio Kilisesi', description: 'Katı granit kayaya oyulmuş, eşsiz akustiğe sahip kaya kilisesi.' },
      { name: 'Design District', description: '25+ sokakta 200+ tasarım mağazası, galeri ve atölye.' }
    ],
    bestTime: 'Haziran-Ağustos',
    duration: '3 saat',
  },
  'Dublin': {
    description: 'İrlanda\'nın başkenti Dublin, edebi mirası, canlı pub kültürü ve yeşil parkalarıyla misafirperver bir atmosfer sunuyor.',
    highlights: [
      { name: 'Trinity College', description: '1592 kuruluşlu, Book of Kells el yazmasıyla ünlü tarihi üniversite.' },
      { name: 'Temple Bar', description: 'Canlı müzik, pub\'lar ve sokak sanatçılarıyla bohemian mahalle.' },
      { name: 'Guinness Storehouse', description: '7 katlı interaktif müze, 360° Dublin manzarasıyla bira tadımı.' },
      { name: 'St. Patrick Katedrali', description: 'İrlanda\'nın en büyük katedrali, 800 yıllık tarihi.' },
      { name: 'Phoenix Park', description: 'Avrupa\'nın en büyük kapalı şehir parklarından, 707 hektar, geyik sürüleri.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '4 saat 15 dk',
  },
  'Varşova': {
    description: 'II. Dünya Savaşı\'ndan yeniden doğan Varşova, tarihi eski şehri, modern gökdelenleri ve dinamik kültür sahnesiylebüyülüyor.',
    highlights: [
      { name: 'Eski Şehir Meydanı', description: 'Savaş sonrası yeniden inşa edilen UNESCO Dünya Mirası tarihi merkez.' },
      { name: 'Kraliyet Kalesi', description: 'Polonya krallarının konutu, barok iç mekanlar ve Rembrandt tabloları.' },
      { name: 'Chopin Müzesi', description: 'Ünlü bestecinin hayatını anlatan interaktif multimedya müzesi.' },
      { name: 'Lazienki Parkı', description: '76 hektar kraliyet parkı, Su Sarayı ve tavuskuşları.' },
      { name: 'POLIN Müzesi', description: 'Polonya Yahudilerinin 1000 yıllık hikayesini anlatan ödüllü müze.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '2 saat 30 dk',
  },
  'Bükreş': {
    description: 'Romanya\'nın başkenti Bükreş, devasa Parlamento Sarayı, tarihi mahalleleri ve canlı gece hayatıyla şaşırtıyor.',
    highlights: [
      { name: 'Parlamento Sarayı', description: 'Pentagon\'dan sonra dünyanın en büyük idari binası, 1.100 oda.' },
      { name: 'Eski Şehir', description: 'Lipscani sokakları, restoranlar ve gece kulüpleriyle tarihi merkez.' },
      { name: 'Romanya Athenaeum', description: '1888\'den konser salonu, Bükreş\'in kültürel kalbi.' },
      { name: 'Herastrau Parkı', description: '187 hektar göl kenarında park, tekne ve bisiklet.' },
      { name: 'Köy Müzesi', description: 'Romanya\'nın farklı bölgelerinden 300+ geleneksel ev.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '1 saat 45 dk',
  },
  'Sofya': {
    description: 'Bulgaristan\'ın başkenti Sofya, Osmanlı, Sovyet ve modern izlerin bir arada yaşadığı uygun fiyatlı bir Balkan cenneti.',
    highlights: [
      { name: 'Alexander Nevsky Katedrali', description: 'Balkanların en büyük Ortodoks katedrali, altın kubbeli landmark.' },
      { name: 'Vitosha Dağı', description: 'Şehir merkezinden 30 dk, yürüyüş ve kış sporları için 2.290 m zirve.' },
      { name: 'Boyana Kilisesi', description: 'UNESCO Mirası, 13. yüzyıl freskleri ile erken Rönesans öncüsü.' },
      { name: 'Ulusal Kültür Sarayı', description: 'Güneydoğu Avrupa\'nın en büyük kongre merkezi, parklar içinde.' },
      { name: 'Serdika Kalıntıları', description: 'Metro istasyonu altında Roma İmparatoru Konstantin döneminden kalıntılar.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '1 saat 30 dk',
  },
  'Riga': {
    description: 'Letonya\'nın başkenti Riga, Art Nouveau mimarisi, ortaçağ sokakları ve Baltık ruhunu yansıtan canlı bir şehir.',
    highlights: [
      { name: 'Eski Şehir', description: 'UNESCO Dünya Mirası, ortaçağ sokakları ve Gotik kiliseler.' },
      { name: 'Art Nouveau Bölgesi', description: 'Avrupa\'nın en yoğun Art Nouveau yapı koleksiyonu, 800+ bina.' },
      { name: 'Merkez Pazarı', description: 'Eski Zeppelin hangarlarında Avrupa\'nın en büyük pazarı.' },
      { name: 'Özgürlük Anıtı', description: '42 metre yüksekliğinde, Letonya bağımsızlığının sembolü.' },
      { name: 'St. Peter Kilisesi', description: '123 metre kulesinden 360° panoramik Riga manzarası.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '2 saat 45 dk',
  },
  'Vilnius': {
    description: 'Litvanya\'nın başkenti Vilnius, barok mimarisi, bohemian Užupis mahallesi ve samimi atmosferiyle gizli bir hazine.',
    highlights: [
      { name: 'Gediminas Kulesi', description: '14. yüzyıldan kalıntı, Vilnius manzarasının en iyi noktası.' },
      { name: 'Vilnius Katedrali', description: 'Neoklasik katedral ve Litvanya\'nın en kutsal mekanı.' },
      { name: 'Užupis Cumhuriyeti', description: 'Kendi anayasası olan sanatçı mahallesi, "Montmartre of the East".' },
      { name: 'Trakai Kalesi', description: '30 dk uzaklıkta, göl üzerinde 14. yüzyıl ada kalesi.' },
      { name: 'Eski Şehir', description: 'Orta Avrupa\'nın en büyük barok eski şehri, UNESCO Mirası.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '2 saat 30 dk',
  },
  'Tallinn': {
    description: 'Estonya\'nın başkenti Tallinn, ortaçağ surları, dijital yenilikçiliği ve Baltık cazibesini bir arada sunuyor.',
    highlights: [
      { name: 'Eski Şehir', description: 'Avrupa\'nın en iyi korunmuş ortaçağ şehirlerinden, UNESCO Mirası.' },
      { name: 'Toompea Kalesi', description: 'Estonya parlamentosuna ev sahipliği yapan tarihi tepe kalesi.' },
      { name: 'Raekoja Plats', description: 'Kuzey Avrupa\'nın tek orijinal Gotik belediye binasıyla meydan.' },
      { name: 'Telliskivi Yaratıcı Şehir', description: 'Eski endüstri alanında sanat galerileri, kafeler ve butikler.' },
      { name: 'Kadriorg Parkı', description: 'Petro I\'in eşi için yaptırdığı barok saray ve bahçeler.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '2 saat 45 dk',
  },
  'Selanik': {
    description: 'Yunanistan\'ın ikinci büyük şehri Selanik, Osmanlı ve Bizans mirası, canlı sahil şeridi ve leziz mutfağıyla büyüleyici.',
    highlights: [
      { name: 'Beyaz Kule', description: 'Osmanlı döneminden kalma, şehrin ikonik sembolü ve müze.' },
      { name: 'Aristoteles Meydanı', description: 'Deniz manzaralı, kafeler ve buluşma noktasıyla merkez meydan.' },
      { name: 'Ladadika', description: 'Restore edilmiş depolar içinde restoranlar ve gece hayatı.' },
      { name: 'Ano Poli', description: 'UNESCO Mirası surlar, Bizans kiliseleri ve dar sokaklar.' },
      { name: 'Arkeoloji Müzesi', description: 'Vergina\'dan Makedon krallarının altın hazineleri.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '1 saat 15 dk',
  },
  
  // === BALKANLAR (Vizesiz) ===
  'Tiran': {
    description: 'Arnavutluk\'un renkli başkenti Tiran, pastel boyalı binaları, canlı kafeler ve Balkan misafirperverliğiyle şaşırtıyor.',
    highlights: [
      { name: 'Skanderbeg Meydanı', description: 'Ulusal kahraman heykeli ve renkli binalarla çevrili merkez meydan.' },
      { name: 'Bunk\'Art Müzesi', description: 'Soğuk Savaş döneminden devasa sığınak, şimdi multimedya sanat müzesi.' },
      { name: 'Dajti Dağı Teleferik', description: 'Şehir merkezinden 15 dk teleferikle Tiran panoraması.' },
      { name: 'Blok Mahallesi', description: 'Komünist elitlerin yaşadığı, şimdi trendy kafeler ve barlar.' },
      { name: 'Et\'hem Bey Camii', description: '18. yüzyıl Osmanlı camii, komünizm sonrası yeniden açıldı.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '1 saat 30 dk',
  },
  'Priştine': {
    description: 'Kosova\'nın genç başkenti Priştine, Osmanlı mirası, modern heykelleri ve enerjik atmosferiyle keşfedilmeyi bekliyor.',
    highlights: [
      { name: 'Newborn Anıtı', description: 'Her yıl yeniden boyanan, bağımsızlık sembolü dev harfler.' },
      { name: 'Ulusal Kütüphane', description: 'Dünyanın en tuhaf binaları listelerinde, kubbeli brutalist yapı.' },
      { name: 'Çarşı Camii', description: '15. yüzyıl Osmanlı camii, şehrin en eski dini yapısı.' },
      { name: 'Mother Teresa Bulvarı', description: 'Kafeler, restoranlar ve butiklarla işlek yaya caddesi.' },
      { name: 'Etnografya Müzesi', description: 'Geleneksel Kosova evi içinde yerel yaşam ve el sanatları.' }
    ],
    bestTime: 'Mayıs-Ekim',
    duration: '1 saat 20 dk',
  },
  'Üsküp': {
    description: 'Kuzey Makedonya\'nın başkenti Üsküp, Osmanlı köprüsü, barok heykelleri ve Balkan kültürünün buluştuğu bir mozaik.',
    highlights: [
      { name: 'Taş Köprü', description: '15. yüzyıl Osmanlı köprüsü, Vardar Nehri üzerinde şehrin simgesi.' },
      { name: 'Makedonya Meydanı', description: 'Büyük İskender heykeli ve fıskiyelerle tartışmalı barok meydan.' },
      { name: 'Eski Çarşı', description: 'Balkanların en büyük Osmanlı çarşılarından, el sanatları ve kafeler.' },
      { name: 'Kale Fortress', description: 'Bizans döneminden 6. yüzyıl kalesi, şehir panoraması.' },
      { name: 'Mustafa Paşa Camii', description: '1492 yapımı, ince kalem işçiliğiyle Osmanlı mimarisi örneği.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '1 saat 15 dk',
  },
  'Saraybosna': {
    description: 'Doğu ile Batı\'nın buluştuğu Saraybosna, Osmanlı çarşısı, dramatik tarihi ve sıcak insanlarıyla unutulmaz.',
    highlights: [
      { name: 'Başçarşı', description: '15. yüzyıl Osmanlı çarşısı, bakırcılar ve Türk kahvesi.' },
      { name: 'Latin Köprüsü', description: '1. Dünya Savaşı\'nın kıvılcımı, Franz Ferdinand suikasti yeri.' },
      { name: 'Sebilj Çeşmesi', description: 'Osmanlı tarzı ahşap çeşme, Başçarşı\'nın kalbi ve buluşma noktası.' },
      { name: 'Sarı Kale', description: 'Şehir manzarası ve gün batımı için ideal 18. yüzyıl kalesi.' },
      { name: 'Tunnel of Hope', description: 'Kuşatma döneminden hayat hattı tünel müzesi.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '1 saat 40 dk',
  },
  'Podgorica': {
    description: 'Karadağ\'ın başkenti Podgorica, modern yapısı, çevresindeki doğal güzellikler ve Balkan sadeliğini yansıtıyor.',
    highlights: [
      { name: 'Millenium Köprüsü', description: 'Moraca Nehri üzerinde modern yaya köprüsü, şehrin yeni simgesi.' },
      { name: 'Kral Nikola Müzesi', description: 'Son Karadağ kralının eski sarayında tarih müzesi.' },
      { name: 'Skadar Gölü', description: 'Balkanların en büyük gölü, kuş gözlemi ve tekne turları.' },
      { name: 'Clock Tower', description: '17. yüzyıl Osmanlı saat kulesi, eski şehrin kalıntısı.' },
      { name: 'Stara Varos', description: 'Osmanlı döneminden Türk mahallesi kalıntıları.' }
    ],
    bestTime: 'Mayıs-Ekim',
    duration: '1 saat 25 dk',
  },
  'Belgrad': {
    description: 'Balkanların kalbi Belgrad, canlı gece hayatı, tarihi kaleleri ve nehir manzarasıyla genç gezginlerin favorisi.',
    highlights: [
      { name: 'Kalemegdan Kalesi', description: 'Tuna ve Sava nehirlerinin buluştuğu noktada 2000 yıllık kale.' },
      { name: 'Skadarlija Sokağı', description: 'Belgrad\'ın Montmartre\'ı, canlı müzik ve Sırp restoranları.' },
      { name: 'Nehir Barları', description: 'Splavovi denilen yüzen gece kulüpleri, efsanevi parti kültürü.' },
      { name: 'St. Sava Kilisesi', description: 'Dünyanın en büyük Ortodoks kiliselerinden, 70 m kubbe.' },
      { name: 'Ada Ciganlija', description: 'Belgrad\'ın denizi, 7 km plaj ve su sporları.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '1 saat 30 dk',
  },
  
  // === KAFKASYA & ORTA ASYA ===
  'Tiflis': {
    description: 'Kafkasların gizli cenneti Tiflis, tarihi mahalleleri, leziz mutfağı ve misafirperver insanlarıyla keşfedilmeyi bekliyor.',
    highlights: [
      { name: 'Eski Şehir', description: 'Ahşap balkonlu evler, dar sokaklar ve geleneksel Gürcü mimarisi.' },
      { name: 'Narikala Kalesi', description: '4. yüzyıldan kalma kale, teleferikle ulaşım ve panoramik manzara.' },
      { name: 'Kükürt Hamamları', description: 'Abanotubani\'de 300 yıllık geleneksel kükürtlü hamam deneyimi.' },
      { name: 'Rustaveli Caddesi', description: 'Opera, müzeler ve kafelerle Tiflis\'in ana bulvarı.' },
      { name: 'Şarap Mahzenleri', description: '8.000 yıllık şarap geleneği, qvevri yöntemi ve tadım turları.' }
    ],
    bestTime: 'Mayıs-Haziran, Eylül-Ekim',
    duration: '2 saat',
  },
  'Bakü': {
    description: 'Modern gökdelenleri ve tarihi surlarıyla Bakü, Doğu ile Batının sentezini sunan dinamik bir Kafkas başkenti.',
    highlights: [
      { name: 'Flame Towers', description: '3 alev şeklinde 182 metre gökdelen, akşam LED ışık gösterisi.' },
      { name: 'İçeri Şeher', description: 'UNESCO Dünya Mirası, 12. yüzyıl surları içinde eski şehir.' },
      { name: 'Haydar Aliyev Merkezi', description: 'Zaha Hadid tasarımı, dalgalı formlu çarpıcı kültür merkezi.' },
      { name: 'Deniz Kenarı Bulvarı', description: '3 km sahil yürüyüşü, parklar ve eğlence alanları.' },
      { name: 'Kız Kulesi', description: '12. yüzyıl gizemli kulesi, şehrin sembolü ve müze.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '2 saat 30 dk',
  },
  'Almatı': {
    description: 'Kazakistan\'ın eski başkenti Almatı, Tien Şan dağları manzarası, yeşil parkları ve Orta Asya modernizminin merkezi.',
    highlights: [
      { name: 'Zenkov Katedrali', description: '54 metre yüksekliğinde, çivisiz ahşap yapı, depreme dayanıklı.' },
      { name: 'Medeo Kayak Merkezi', description: 'Dünyanın en yüksek buz pateni pisti, 1.691 metre rakımda.' },
      { name: 'Kok Tobe Tepesi', description: 'Teleferikle çıkılan, şehir panoraması ve eğlence parkı.' },
      { name: 'Merkez Çarşı', description: 'Zelyony Bazar, yerel lezzetler ve Orta Asya baharatları.' },
      { name: 'Panfilov Parkı', description: '28 Panfilov Muhafızı Anıtı ve Zenkov Katedrali ile geniş park.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '4 saat 30 dk',
  },
  'Astana': {
    description: 'Kazakistan\'ın fütüristik başkenti Astana (Nur-Sultan), cesur mimarisi ve bozkır ortasındaki modern yapılarıyla şaşırtıyor.',
    highlights: [
      { name: 'Bayterek Kulesi', description: '97 metre, efsanevi altın yumurtayı tutan hayat ağacı.' },
      { name: 'Han Şatır', description: 'Dünyanın en büyük çadır yapısı, içinde plaj ve alışveriş.' },
      { name: 'Hazret Sultan Camii', description: 'Orta Asya\'nın en büyük camisi, 10.000 kişi kapasiteli.' },
      { name: 'Barış ve Uzlaşma Sarayı', description: 'Foster tasarımı piramit, dinlerarası diyalog merkezi.' },
      { name: 'Expo 2017 Alanı', description: 'Nur Alem küre yapısı, gelecek enerji teknolojileri müzesi.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '4 saat',
  },
  'Taşkent': {
    description: 'Özbekistan\'ın başkenti Taşkent, geniş bulvarları, metro sanatı ve İpek Yolu mirasıyla Orta Asya\'nın kapısı.',
    highlights: [
      { name: 'Hazrati Imam Kompleksi', description: 'Osman\'ın Kuran\'ı dahil dini el yazmaları koleksiyonu.' },
      { name: 'Çorsu Çarşısı', description: 'Yeşil kubbeli tarihi pazar, baharatlar ve yöresel ürünler.' },
      { name: 'Taşkent Metrosu', description: 'Her istasyonu farklı temayla süslenmiş yeraltı sanat galerisi.' },
      { name: 'Amir Timur Meydanı', description: 'Fatih Timur heykeli ve çevresinde parklar.' },
      { name: 'Televizyon Kulesi', description: '375 metre, Orta Asya\'nın en yüksek yapısı, döner restoran.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '4 saat 15 dk',
  },
  'Bişkek': {
    description: 'Kırgızistan\'ın başkenti Bişkek, Tien Şan dağlarının eteklerinde yeşil parkları ve göçebe kültürüyle büyülüyor.',
    highlights: [
      { name: 'Ala-Too Meydanı', description: 'Manas heykeli ve bağımsızlık sembolü ile merkez meydan.' },
      { name: 'Oş Pazarı', description: 'Orta Asya\'nın en büyük açık pazarlarından, her şey bulunur.' },
      { name: 'Ala Archa Milli Parkı', description: '40 km uzaklıkta Tien Şan dağlarında yürüyüş parkuru.' },
      { name: 'Issık Göl', description: 'Dünyanın 2. en büyük dağ gölü, plajlar ve sanatoriumlar.' },
      { name: 'Frunze Müzesi', description: 'Sovyet generali Frunze\'nin doğduğu ev, şimdi müze.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '4 saat 45 dk',
  },
  
  // === ORTA DOĞU ===
  'Dubai': {
    description: 'Modern mimarisi, lüks alışveriş merkezleri ve çöl safarileriyle Dubai, Doğu ile Batının buluştuğu göz kamaştırıcı bir metropol.',
    highlights: [
      { name: 'Burj Khalifa', description: '828 metre ile dünyanın en yüksek binası, 148. katta gözlem platformu.' },
      { name: 'Dubai Mall', description: '1.200 mağaza, akvaryum ve buz pisti ile dünyanın en büyük AVM\'si.' },
      { name: 'Palm Jumeirah', description: 'Palmiye şeklinde yapay ada, lüks oteller ve plajlar.' },
      { name: 'Çöl Safari', description: '4x4 araçlarla kumul macerası, deve binme ve Bedeevi kampı.' },
      { name: 'Gold Souk', description: 'Deira\'da 300+ mağazayla dünyanın en büyük altın pazarı.' }
    ],
    bestTime: 'Kasım-Mart',
    duration: '4 saat 30 dk',
  },
  'Abu Dabi': {
    description: 'BAE\'nin başkenti Abu Dabi, muhteşem Şeyh Zayed Camii, Louvre müzesi ve lüks yaşam tarzıyla etkileyici.',
    highlights: [
      { name: 'Şeyh Zayed Camii', description: 'Dünyanın en büyük halısı ve avizesiyle muhteşem beyaz cami.' },
      { name: 'Louvre Abu Dabi', description: 'Jean Nouvel tasarımı, yağmur ışığı kubbesiyle dünya çapında sanat.' },
      { name: 'Ferrari World', description: 'Dünyanın en hızlı roller coaster\'ı ile Ferrari temalı park.' },
      { name: 'Emirates Palace', description: '$3 milyarlık ultra lüks otel, altın kaplama iç mekanlar.' },
      { name: 'Yas Adası', description: 'F1 pisti, su parkı ve eğlence merkezi.' }
    ],
    bestTime: 'Kasım-Mart',
    duration: '4 saat 45 dk',
  },
  'Doha': {
    description: 'Katar\'ın başkenti Doha, ultra-modern mimarisi, İslam Sanatları Müzesi ve 2022 Dünya Kupası mirası ile yükselişte.',
    highlights: [
      { name: 'İslam Sanatları Müzesi', description: 'I.M. Pei tasarımı, 1.400 yıllık İslam sanatı koleksiyonu.' },
      { name: 'Souq Waqif', description: 'Yenilenen geleneksel çarşı, baharat, şahin ve Katar mutfağı.' },
      { name: 'The Pearl', description: 'Yapay ada üzerinde lüks marinalar, butikler ve restoranlar.' },
      { name: 'Katara Kültür Köyü', description: 'Amfitiyatro, galeriler ve plajlarla kültür merkezi.' },
      { name: 'Corniche', description: '7 km sahil promenadı, skyline manzarası ve parklar.' }
    ],
    bestTime: 'Kasım-Mart',
    duration: '4 saat 15 dk',
  },
  'Amman': {
    description: 'Ürdün\'ün başkenti Amman, antik Roma kalıntıları, canlı pazarları ve Petra\'ya kapı olarak stratejik konumuyla çekici.',
    highlights: [
      { name: 'Citadel', description: 'Bronz Çağı\'ndan kalma höyük, Roma tapınağı ve Emevi sarayı.' },
      { name: 'Roma Tiyatrosu', description: 'MS 2. yüzyıldan 6.000 kişilik amfi tiyatro, hala kullanımda.' },
      { name: 'Rainbow Street', description: 'Kafeler, galeriler ve vintage dükkanlarla trendy mahalle.' },
      { name: 'Ürdün Müzesi', description: 'Ölü Deniz Yazmaları dahil 2.000 yıllık tarih koleksiyonu.' },
      { name: 'Petra Günlük Tur', description: '3 saat uzaklıkta, Dünya\'nın yeni 7 harikasından biri.' }
    ],
    bestTime: 'Mart-Mayıs, Eylül-Kasım',
    duration: '2 saat 30 dk',
  },
  'Beyrut': {
    description: 'Lübnan\'ın başkenti Beyrut, Akdeniz mutfağı, tarihi mahalleleri ve dirençli ruhuyla Orta Doğu\'nun Paris\'i.',
    highlights: [
      { name: 'Hamra Caddesi', description: 'Kafeler, kitapçılar ve AUB ile entelektüel mahalle.' },
      { name: 'Raouche Kayalıkları', description: 'Denizden yükselen ikonik kaya oluşumları, gün batımı noktası.' },
      { name: 'Ulusal Müze', description: 'Fenike\'den Roma\'ya Lübnan tarihinin en zengin koleksiyonu.' },
      { name: 'Jeita Mağarası', description: '9 km yeraltı mağara sistemi, tekne ve yürüyüş turları.' },
      { name: 'Byblos Antik Kenti', description: '7.000 yıllık sürekli yerleşim, dünyanın en eski şehirlerinden.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Kasım',
    duration: '2 saat',
  },
  'Bahreyn': {
    description: 'Körfez\'in küçük incisi Bahreyn, antik Dilmun medeniyeti, F1 pisti ve adaları keşfetmek için ideal.',
    highlights: [
      { name: 'Bahreyn Kalesi', description: 'UNESCO Mirası, 4.000 yıllık Dilmun medeniyeti kalıntıları.' },
      { name: 'Manama Souq', description: 'Geleneksel çarşıda altın, inciler ve baharat.' },
      { name: 'Al Fatih Camii', description: '7.000 kişilik kapasite, dünyanın en büyük fiberglas kubbesi.' },
      { name: 'F1 Pisti', description: 'Bahreyn Grand Prix, çöl ortasında gece yarışı.' },
      { name: 'Tree of Life', description: 'Çölün ortasında 400 yıllık, su kaynağı olmadan yaşayan ağaç.' }
    ],
    bestTime: 'Kasım-Mart',
    duration: '3 saat 30 dk',
  },
  'Maskat': {
    description: 'Umman\'ın başkenti Maskat, dramatik dağ manzaraları, geleneksel soukları ve Arap misafirperverliğiyle otantik.',
    highlights: [
      { name: 'Sultan Qaboos Camii', description: '20.000 kişilik, dünyanın 2. büyük el dokuma halısı.' },
      { name: 'Mutrah Souq', description: 'Labirent sokaklar, buhur, kılıç ve gümüş takılarla geleneksel çarşı.' },
      { name: 'Kraliyet Opera Evi', description: 'Körfez\'in ilk opera evi, dünya çapında performanslar.' },
      { name: 'Bait Al Zubair Müzesi', description: 'Umman kültür ve tarihini sergileyen özel koleksiyon.' },
      { name: 'Wadi Shab', description: 'Turkuaz havuzlar, şelaleler ve tırmanış yürüyüşüyle vadi.' }
    ],
    bestTime: 'Ekim-Mart',
    duration: '4 saat 30 dk',
  },
  'Kuveyt': {
    description: 'Körfez\'in petrol zengini Kuveyt, modern kuleleri, geleneksel pazarları ve çöl deneyimiyle ilgi çekici.',
    highlights: [
      { name: 'Kuveyt Kuleleri', description: '3 kule, küresel tasarım ve döner restoran, ülke simgesi.' },
      { name: 'Grand Mosque', description: 'Kuveyt\'in ana camisi, 72.000 m2 alan, rehberli turlar.' },
      { name: 'Souq Al-Mubarakiya', description: '200 yıllık tarihi pazar, baharatlar ve geleneksel ürünler.' },
      { name: 'Scientific Center', description: 'Körfez\'in en büyük akvaryumu ve IMAX sineması.' },
      { name: 'Failaka Adası', description: 'Yunan döneminden kalıntılar, antik Ikaros yerleşimi.' }
    ],
    bestTime: 'Kasım-Mart',
    duration: '3 saat 45 dk',
  },
  
  // === ASYA ===
  'Tokyo': {
    description: 'Geleneksel tapınakları ile ultra-modern teknolojinin iç içe geçtiği Tokyo, benzersiz bir kültürel deneyim sunuyor.',
    highlights: [
      { name: 'Senso-ji Tapınağı', description: 'Tokyo\'nun en eski Budist tapınağı, 645 yılından.' },
      { name: 'Shibuya Kavşağı', description: 'Dünyanın en kalabalık yaya geçidi, bir seferde 3.000 kişi.' },
      { name: 'Tokyo Kulesi', description: '333 metre, Eyfel\'den esinlenen ikonik kırmızı kule.' },
      { name: 'Harajuku', description: 'Genç moda kültürü, cosplay ve Takeshita Caddesi.' },
      { name: 'Tsukiji Balık Pazarı', description: 'Dış pazar, taze suşi ve deniz ürünleri kahvaltısı.' }
    ],
    bestTime: 'Mart-Mayıs, Ekim-Kasım',
    duration: '11 saat',
  },
  'Osaka': {
    description: 'Japonya\'nın mutfak başkenti Osaka, sokak lezzetleri, eğlence parkları ve samimi atmosferiyle Tokyo\'ya alternatif.',
    highlights: [
      { name: 'Osaka Kalesi', description: '1583 yapımı, Japon birleşmesinin sembolü, 8 katlı donjon.' },
      { name: 'Dotonbori', description: 'Neon ışıklar, dev tabelalar ve takoyaki ile sokak yemekleri.' },
      { name: 'Universal Studios Japan', description: 'Super Nintendo World ve Harry Potter dünyası.' },
      { name: 'Shinsekai', description: 'Retro atmosfer, Tsutenkaku Kulesi ve kushikatsu.' },
      { name: 'Kuromon Pazarı', description: '"Osaka\'nın mutfağı", 170 yıllık taze deniz ürünleri pazarı.' }
    ],
    bestTime: 'Mart-Mayıs, Ekim-Kasım',
    duration: '11 saat 30 dk',
  },
  'Seul': {
    description: 'K-pop ve geleneklerin buluştuğu Seul, sarayları, teknolojisi ve canlı gece hayatıyla Asya\'nın yükselen yıldızı.',
    highlights: [
      { name: 'Gyeongbokgung Sarayı', description: '1395\'ten Joseon hanedanlığının ana sarayı, muhafız töreni.' },
      { name: 'Bukchon Hanok Köyü', description: '600 yıllık geleneksel Kore evleri, fotoğraf cenneti.' },
      { name: 'Myeongdong', description: 'K-beauty mağazaları, sokak yemekleri ve alışveriş cenneti.' },
      { name: 'Namsan Kulesi', description: 'Aşk kiliteri geleneği ve 360° Seul manzarası.' },
      { name: 'Dongdaemun', description: '24 saat açık alışveriş bölgesi, 30+ AVM ve pazarlar.' }
    ],
    bestTime: 'Nisan-Mayıs, Eylül-Kasım',
    duration: '10 saat',
  },
  'Singapur': {
    description: 'Temizliği, düzeni ve çok kültürlü yapısıyla Singapur, Güneydoğu Asya\'nın parlayan yıldızı.',
    highlights: [
      { name: 'Marina Bay Sands', description: 'Çatıdaki infinity pool ve skypark manzarasıyla ikonik otel.' },
      { name: 'Gardens by the Bay', description: 'Supertree Grove ve Cloud Forest ile fütüristik bahçeler.' },
      { name: 'Sentosa Adası', description: 'Universal Studios, S.E.A. Aquarium ve plajlar.' },
      { name: 'Chinatown', description: 'Buddha Tooth Relic Tapınağı ve sokak yemekleriyle tarihi mahalle.' },
      { name: 'Little India', description: 'Renkli sokaklar, baharat dükkanları ve Hint mutfağı.' }
    ],
    bestTime: 'Şubat-Nisan',
    duration: '10 saat 30 dk',
  },
  'Kuala Lumpur': {
    description: 'Malezya\'nın başkenti KL, ikonik ikiz kuleleri, çok kültürlü mutfağı ve tropik atmosferiyle büyülüyor.',
    highlights: [
      { name: 'Petronas İkiz Kuleleri', description: '452 metre, 1998-2004 arası dünyanın en yükseği, köprü geçişi.' },
      { name: 'Batu Mağaraları', description: '272 basamaklı merdiven, dev Murugan heykeli ve Hindu tapınakları.' },
      { name: 'Central Market', description: 'Art Deco binada el sanatları, batik ve yerel ürünler.' },
      { name: 'Merdeka Meydanı', description: 'Malezya bağımsızlığının ilan edildiği tarihi meydan.' },
      { name: 'Bukit Bintang', description: 'Alışveriş merkezleri, gece hayatı ve Jalan Alor sokak yemekleri.' }
    ],
    bestTime: 'Mart-Ekim',
    duration: '10 saat',
  },
  'Bangkok': {
    description: 'Altın tapınakları, sokak lezzetleri ve canlı gece hayatıyla Bangkok, Güneydoğu Asya\'nın nabzını tutuyor.',
    highlights: [
      { name: 'Grand Palace', description: '1782\'den Tayland krallarının konutu, Zümrüt Buda.' },
      { name: 'Wat Arun', description: 'Şafak Tapınağı, Chao Phraya kıyısında seramik kaplı pagoda.' },
      { name: 'Chatuchak Pazarı', description: 'Dünyanın en büyük hafta sonu pazarı, 15.000+ tezgah.' },
      { name: 'Khao San Road', description: 'Backpacker merkezi, barlar, ucuz konaklama ve canlı atmosfer.' },
      { name: 'Chao Phraya Nehri', description: 'Express bot ile tapınak turları, akşam yemeği tekneleri.' }
    ],
    bestTime: 'Kasım-Şubat',
    duration: '9 saat',
  },
  'Bali': {
    description: 'Pirinç terasları, tapınakları ve muhteşem plajlarıyla Bali, huzur ve macera arayanların cennet adası.',
    highlights: [
      { name: 'Ubud Pirinç Terasları', description: 'Tegallalang\'da UNESCO Mirası, su sistemi ve jungle swing.' },
      { name: 'Tanah Lot Tapınağı', description: 'Deniz üzerinde kaya üstü tapınak, gün batımı için efsanevi.' },
      { name: 'Kuta Plajı', description: 'Sörf, gün batımı ve canlı gece hayatıyla popüler sahil.' },
      { name: 'Maymun Ormanı', description: 'Ubud\'da 700+ makak maymunu ve antik tapınaklarla kutsal orman.' },
      { name: 'Uluwatu', description: 'Uçurum tapınağı, sörf ve Kecak dans gösterisi.' }
    ],
    bestTime: 'Nisan-Ekim',
    duration: '12 saat',
  },
  'Cakarta': {
    description: 'Endonezya\'nın devasa başkenti Cakarta, çeşitli mahalleleri, alışveriş merkezleri ve ada turlarıyla keşfedilmeye değer.',
    highlights: [
      { name: 'Monas Anıtı', description: '132 metre ulusal anıt, altın kaplı alev ve bağımsızlık müzesi.' },
      { name: 'Kota Tua', description: 'Hollanda sömürge dönemi binaları ve Fatahillah Meydanı.' },
      { name: 'Istiqlal Camii', description: 'Güneydoğu Asya\'nın en büyük camisi, 200.000 kişi kapasiteli.' },
      { name: 'Thousand Islands', description: 'Jakarta açıklarında tropik adalar, şnorkel ve dalış.' },
      { name: 'Taman Mini', description: 'Endonezya\'nın 27 eyaletini minyatürde sergileyen tema parkı.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '11 saat',
  },
  'Manila': {
    description: 'Filipinler\'in kaotik başkenti Manila, İspanyol mirası, sıcak insanları ve tropik adaların kapısı olarak çekici.',
    highlights: [
      { name: 'Intramuros', description: '16. yüzyıl İspanyol surlı şehir, Fort Santiago ve at arabası.' },
      { name: 'Rizal Parkı', description: 'Ulusal kahraman Jose Rizal anıtı, 60 hektarlık şehir parkı.' },
      { name: 'San Agustin Kilisesi', description: '1607\'den UNESCO Mirası, Filipinler\'in en eski taş kilisesi.' },
      { name: 'SM Mall of Asia', description: 'Asya\'nın en büyük AVM\'lerinden, IMAX ve deniz manzarası.' },
      { name: 'Makati', description: 'Modern iş merkezi, gece hayatı ve uluslararası restoranlar.' }
    ],
    bestTime: 'Kasım-Nisan',
    duration: '11 saat',
  },
  'Hong Kong': {
    description: 'Gökdelenler ile geleneksel tapınakların buluştuğu Hong Kong, alışveriş cenneti ve nefes kesen manzaralarıyla ikonik.',
    highlights: [
      { name: 'Victoria Peak', description: '552 metre tepeden Hong Kong skyline, tramvay ile çıkış.' },
      { name: 'Star Ferry', description: '1888\'den Victoria Limanı\'nı geçen ikonik feribot.' },
      { name: 'Lan Kwai Fong', description: 'Barlar, restoranlar ve gece hayatıyla ünlü eğlence bölgesi.' },
      { name: 'Tian Tan Buddha', description: 'Lantau Adası\'nda 34 metre bronz Buda, 268 basamak.' },
      { name: 'Temple Street', description: 'Gece pazarı, sokak yemekleri ve falcılar.' }
    ],
    bestTime: 'Ekim-Aralık',
    duration: '10 saat 30 dk',
  },
  'Taipei': {
    description: 'Tayvan\'ın başkenti Taipei, gece pazarları, 101 kulesi ve sıcak kaynaklarıyla Asya\'nın gizli hazinesi.',
    highlights: [
      { name: 'Taipei 101', description: '509 metre, 2004-2010 dünyanın en yükseği, 382 metre gözlem katı.' },
      { name: 'Shilin Gece Pazarı', description: 'Tayvan\'ın en büyük gece pazarı, stinky tofu ve bubble tea.' },
      { name: 'Longshan Tapınağı', description: '1738\'den Budist-Taoist tapınak, yerel ibadet deneyimi.' },
      { name: 'Beitou Sıcak Kaynakları', description: 'Volkanik kaplıcalar, açık hava havuzları ve ryokanlar.' },
      { name: 'Jiufen', description: 'Spirited Away\'e ilham veren, dağ yamacında nostaljik kasaba.' }
    ],
    bestTime: 'Mart-Mayıs, Eylül-Kasım',
    duration: '11 saat',
  },
  'Katmandu': {
    description: 'Nepal\'in başkenti Katmandu, Himalaya\'nın kapısında antik tapınakları ve spiritüel atmosferiyle büyülüyor.',
    highlights: [
      { name: 'Swayambhunath', description: 'Maymun Tapınağı, 2.500 yıllık Budist stupa, şehir manzarası.' },
      { name: 'Pashupatinath', description: 'Nepal\'in en kutsal Hindu tapınağı, Bagmati Nehri\'nde kremasyonlar.' },
      { name: 'Boudhanath Stupa', description: 'Dünyanın en büyük küresel stupalarından, Tibet kültür merkezi.' },
      { name: 'Durbar Meydanı', description: 'UNESCO Mirası, Nepal krallarının saray kompleksi.' },
      { name: 'Thamel', description: 'Turistik merkez, dağcılık ekipmanları ve Nepali mutfağı.' }
    ],
    bestTime: 'Ekim-Kasım, Mart-Nisan',
    duration: '6 saat',
  },
  'Pekin': {
    description: 'Çin\'in kadim başkenti Pekin, Yasak Şehir, Çin Seddi ve imparatorluk mirası ile tarih tutkunlarının vazgeçilmezi.',
    highlights: [
      { name: 'Yasak Şehir', description: '500 yıl imparatorluk konutu, 9.999 oda ve UNESCO Mirası.' },
      { name: 'Çin Seddi', description: 'Badaling veya Mutianyu bölümü, 2.700 km+ uzunluğunda harika.' },
      { name: 'Tiananmen Meydanı', description: 'Dünyanın en büyük kamusal meydanlarından, Mao Mozolesi.' },
      { name: 'Yaz Sarayı', description: 'İmparatoriçe Cixi\'nin göl kenarında yazlık saray ve bahçeleri.' },
      { name: 'Hutong Mahalleleri', description: 'Geleneksel dar sokaklar, avlulu evler ve bisiklet turları.' }
    ],
    bestTime: 'Nisan-Mayıs, Eylül-Ekim',
    duration: '9 saat',
  },
  'Şanghay': {
    description: 'Çin\'in modern yüzü Şanghay, Art Deco mimarisi, fütüristik gökdelenleri ve canlı ticaretiyle Asya\'nın New York\'u.',
    highlights: [
      { name: 'The Bund', description: '1920\'ler Avrupa mimarisi ve Pudong skyline manzarasıyla sahil.' },
      { name: 'Pudong Skyline', description: 'Oriental Pearl Kulesi ve Shanghai Tower ile fütüristik siluet.' },
      { name: 'Yu Garden', description: '450 yıllık Çin bahçesi, köprüler, göletler ve pavilyonlar.' },
      { name: 'Nanjing Road', description: '5 km uzunluğunda Çin\'in en işlek alışveriş caddesi.' },
      { name: 'Zhujiajiao Su Kasabası', description: '30 km uzaklıkta, 1.700 yıllık kanallar ve köprüler.' }
    ],
    bestTime: 'Nisan-Mayıs, Eylül-Ekim',
    duration: '10 saat',
  },
  'Delhi': {
    description: 'Hindistan\'ın başkenti Delhi, Mughal imparatorluğu mirası, kaotik sokakları ve baharatlı mutfağıyla sarsıcı.',
    highlights: [
      { name: 'Kızıl Kale', description: 'UNESCO Mirası, Mughal imparatorlarının 17. yüzyıl kalesi.' },
      { name: 'Qutub Minar', description: '72 metre tuğla minare, 800 yıllık UNESCO Mirası.' },
      { name: 'Lotus Temple', description: 'Lotus çiçeği şeklinde Bahai tapınağı, tüm dinlere açık.' },
      { name: 'Humayun Türbesi', description: 'Tac Mahal\'in ilham kaynağı, Mughal bahçe mimarisi.' },
      { name: 'Chandni Chowk', description: '17. yüzyıldan labirent çarşı, sokak yemekleri ve kaos.' }
    ],
    bestTime: 'Ekim-Mart',
    duration: '6 saat',
  },
  'Mumbai': {
    description: 'Bollywood\'un kalbi Mumbai, Gateway of India, çeşitli mahalleleri ve Hindistan\'ın ekonomik motoruyla hareketli.',
    highlights: [
      { name: 'Gateway of India', description: '1924 yapımı zafer takı, Raj döneminin sembolü.' },
      { name: 'Marine Drive', description: '"Kraliçenin Kolyesi", 3.6 km sahil yolu gece ışıklarıyla.' },
      { name: 'Elephanta Mağaraları', description: 'Feribot ile 1 saat, 7. yüzyıl Hindu kaya tapınakları.' },
      { name: 'Dharavi', description: 'Asya\'nın en büyük gecekondularından, turist turları.' },
      { name: 'CST Terminali', description: 'UNESCO Mirası, Viktorya Gotik tarzı tren istasyonu.' }
    ],
    bestTime: 'Kasım-Şubat',
    duration: '6 saat 30 dk',
  },
  
  // === AFRİKA ===
  'Tunus': {
    description: 'Akdeniz ve çöl kültürünün buluştuğu Tunus, antik Kartaca, medina sokakları ve sahil resoortlarıyla çeşitli.',
    highlights: [
      { name: 'Kartaca Antik Kenti', description: 'Fenike ve Roma kalıntıları, UNESCO Mirası arkeolojik alan.' },
      { name: 'Tunus Medina', description: 'UNESCO Mirası, 7. yüzyıldan dar sokaklar ve souklar.' },
      { name: 'Bardo Müzesi', description: 'Dünyanın en zengin Roma mozaik koleksiyonu.' },
      { name: 'Sidi Bou Said', description: 'Mavi-beyaz Akdeniz köyü, sanatçı kafeleri ve manzara.' },
      { name: 'El Jem Amfitiyatrosu', description: 'Roma Kolezyumu\'ndan sonra en büyük amfi tiyatro.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Kasım',
    duration: '2 saat 30 dk',
  },
  'Kazablanka': {
    description: 'Fas\'ın en büyük şehri Kazablanka, muhteşem Hassan II Camii, Art Deco mimarisi ve Atlantik sahiliyle modern.',
    highlights: [
      { name: 'Hassan II Camii', description: 'Dünyanın en yüksek minaresi (210 m), deniz üzerine inşa.' },
      { name: 'Corniche', description: 'Atlantik sahilinde plajlar, restoranlar ve gece kulüpleri.' },
      { name: 'Eski Medina', description: 'Fransız sömürge döneminden önce kurulan tarihi çekirdek.' },
      { name: 'Morocco Mall', description: 'Afrika\'nın en büyük AVM\'lerinden, akvaryum içinde.' },
      { name: 'Rick\'s Cafe', description: 'Casablanca filmine saygı, canlı müzik ve nostaljik atmosfer.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Kasım',
    duration: '4 saat',
  },
  'Marakeş': {
    description: 'Fas\'ın kırmızı şehri Marakeş, Jemaa el-Fna meydanı, büyülü soukları ve Berberi kültürüyle otantik.',
    highlights: [
      { name: 'Jemaa el-Fna', description: 'UNESCO Mirası, yılan oynatıcıları, akrobatlar ve yemek tezgahları.' },
      { name: 'Majorelle Bahçesi', description: 'Yves Saint Laurent\'ın koruduğu mavi villa ve tropik bahçe.' },
      { name: 'Bahia Sarayı', description: '19. yüzyıl vizir sarayı, İslami sanat ve bahçeler.' },
      { name: 'Souklar', description: 'Labirent çarşılar, deri, halı, baharat ve el sanatları.' },
      { name: 'Koutoubia Camii', description: '12. yüzyıl, 77 metre minare, şehrin simgesi.' }
    ],
    bestTime: 'Mart-Mayıs, Eylül-Kasım',
    duration: '4 saat 15 dk',
  },
  'Cape Town': {
    description: 'Güney Afrika\'nın mücevheri Cape Town, Table Mountain, şarap bağları ve muhteşem sahilleriyle nefes kesici.',
    highlights: [
      { name: 'Table Mountain', description: 'Teleferik ile 1.085 metre, UNESCO Mirası ve 360° manzara.' },
      { name: 'V&A Waterfront', description: 'Tarihi liman, AVM, restoranlar ve Two Oceans Aquarium.' },
      { name: 'Robben Adası', description: 'Mandela\'nın 18 yıl tutulduğu, artık UNESCO Mirası müze.' },
      { name: 'Cape Point', description: 'Hint ve Atlas okyanuslarının buluştuğu dramatik uçurum.' },
      { name: 'Camps Bay', description: 'Beyaz kumlu plaj, Twelve Apostles dağları manzarasıyla.' }
    ],
    bestTime: 'Kasım-Mart',
    duration: '12 saat',
  },
  'Johannesburg': {
    description: 'Güney Afrika\'nın ekonomik merkezi Johannesburg, Apartheid tarihi, sanat galerileri ve safari turlarının kapısı.',
    highlights: [
      { name: 'Apartheid Müzesi', description: 'Güney Afrika\'nın ırk ayrımcılığı tarihini anlatan müze.' },
      { name: 'Constitution Hill', description: 'Mandela ve Gandhi\'nin tutulduğu eski hapishane, şimdi müze.' },
      { name: 'Maboneng', description: 'Kentsel dönüşümle canlandırılan sanat bölgesi, galeriler ve kafeler.' },
      { name: 'Gold Reef City', description: 'Eski altın madeni üzerine kurulu tema parkı ve müze.' },
      { name: 'Lion & Safari Park', description: 'Johannesburg yakınında yaban hayatı deneyimi.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '11 saat',
  },
  'Nairobi': {
    description: 'Kenya\'nın başkenti Nairobi, dünyaca ünlü safari parkları, fil yetimhanesi ve Afrika\'nın yaban hayatının kapısı.',
    highlights: [
      { name: 'Nairobi Ulusal Parkı', description: 'Şehir manzarasıyla aslan, gergedan ve zürafaları görün.' },
      { name: 'David Sheldrick', description: 'Yetim fil ve gergedan rehabilitasyon merkezi, sabah ziyareti.' },
      { name: 'Karen Blixen Müzesi', description: '"Out of Africa" yazarının tarihi çiftlik evi.' },
      { name: 'Giraffe Centre', description: 'Nesli tehlike altında Rothschild zürafalarını besleme imkanı.' },
      { name: 'Maasai Market', description: 'Renkli Maasai el sanatları ve hediyelik eşya pazarı.' }
    ],
    bestTime: 'Haziran-Ekim, Ocak-Şubat',
    duration: '7 saat',
  },
  'Zanzibar': {
    description: 'Hint Okyanusu\'nun baharat adası Zanzibar, turkuaz suları, tarihi Stone Town\'ı ve tropikal cennetiyle büyüleyici.',
    highlights: [
      { name: 'Stone Town', description: 'UNESCO Mirası, Arap, Hint ve Avrupa etkilerinin kaynaştığı tarihi merkez.' },
      { name: 'Nungwi Plajı', description: 'Adanın kuzey ucunda, beyaz kum ve kristal berrak deniz.' },
      { name: 'Prison Island', description: 'Eski karantina adası, dev Aldabra kaplumbağaları ve şnorkel.' },
      { name: 'Jozani Ormanı', description: 'Endemik kırmızı kolobus maymunları ve mangrov turları.' },
      { name: 'Baharat Turu', description: 'Tarçın, karanfil ve vanilya yetiştiriciliği, tadım deneyimi.' }
    ],
    bestTime: 'Haziran-Ekim, Aralık-Şubat',
    duration: '8 saat',
  },
  'Darüsselam': {
    description: 'Tanzanya\'nın en büyük şehri Darüsselam, Zanzibar\'a feribot bağlantısı, canlı pazarları ve Swahili kültürüyle ilgi çekici.',
    highlights: [
      { name: 'Kariakoo Pazarı', description: 'Doğu Afrika\'nın en büyük açık pazarlarından, yerel yaşam.' },
      { name: 'Village Museum', description: 'Tanzanya\'nın 16 kabilesinin geleneksel evleri ve kültürü.' },
      { name: 'Coco Beach', description: 'Şehir yakınında popüler plaj, hafta sonu etkinlikleri.' },
      { name: 'Askari Anıtı', description: 'I. Dünya Savaşı askerleri anısına bronz heykel.' },
      { name: 'Zanzibar Feribotu', description: '2 saat feribot ile Zanzibar\'a ulaşım noktası.' }
    ],
    bestTime: 'Haziran-Ekim',
    duration: '7 saat 30 dk',
  },
  
  // === AMERİKA ===
  'New York': {
    description: 'Dünyanın kültür ve finans başkenti New York, Times Square, Broadway ve ikonik skyline\'ıyla rüya şehri.',
    highlights: [
      { name: 'Times Square', description: 'Neon ışıklar, Broadway tiyatroları ve yılbaşı kutlamasıyla ikonik meydan.' },
      { name: 'Central Park', description: '341 hektar kentsel vaha, göller, heykeller ve ücretsiz konserler.' },
      { name: 'Özgürlük Heykeli', description: '1886\'dan Fransa hediyesi, demokrasi ve özgürlüğün sembolü.' },
      { name: 'Empire State Building', description: '381 metre Art Deco gökdelen, 86. kat gözlem platformu.' },
      { name: 'Brooklyn Köprüsü', description: '1883 yapımı asma köprü, Manhattan skyline yürüyüşü.' }
    ],
    bestTime: 'Nisan-Haziran, Eylül-Kasım',
    duration: '10 saat',
  },
  'Los Angeles': {
    description: 'Hollywood\'un evi Los Angeles, yıldızlar, plajlar ve çeşitli mahalleleriyle Amerikan rüyasının sembolü.',
    highlights: [
      { name: 'Hollywood Sign', description: 'Griffith Park\'tan veya yürüyüşle görülebilen ikonik harfler.' },
      { name: 'Santa Monica', description: 'İskelesi, lunapark ve bisiklet yollarıyla sahil cenneti.' },
      { name: 'Walk of Fame', description: 'Hollywood Bulvarı\'nda 2.600+ yıldız, el izleri.' },
      { name: 'Universal Studios', description: 'Stüdyo turu, Harry Potter dünyası ve roller coaster\'lar.' },
      { name: 'Venice Beach', description: 'Muscle Beach, sokak sanatçıları ve özgür ruhlu atmosfer.' }
    ],
    bestTime: 'Yıl boyu',
    duration: '13 saat',
  },
  'Chicago': {
    description: 'Rüzgarlı şehir Chicago, çığır açan mimarisi, blues müziği ve derin pizza lezzetiyle Midwest\'in gururu.',
    highlights: [
      { name: 'Millennium Park', description: 'Cloud Gate (The Bean) heykeli ve açık hava konser alanı.' },
      { name: 'Willis Tower', description: '442 metre, Skydeck\'te cam balkon ile vertiyo deneyimi.' },
      { name: 'Navy Pier', description: 'Dönme dolap, çocuk müzesi ve Michigan Gölü manzarası.' },
      { name: 'Art Institute', description: 'ABD\'nin en büyük sanat müzelerinden, Seurat\'ın başyapıtı.' },
      { name: 'Magnificent Mile', description: '1.6 km\'lik lüks mağazalar ve tarihi binalar.' }
    ],
    bestTime: 'Mayıs-Ekim',
    duration: '11 saat',
  },
  'Miami': {
    description: 'Florida\'nın tropikal cenneti Miami, Art Deco mimarisi, Latin kültürü ve beyaz kumlu plajlarıyla tatil cenneti.',
    highlights: [
      { name: 'South Beach', description: 'Pastel renkli Art Deco binalar ve ünlülerin gözdesi sahil.' },
      { name: 'Art Deco District', description: '1920-40 arası 800+ tarihi bina, rehberli yürüyüş turları.' },
      { name: 'Little Havana', description: 'Küba kültürü, domino parkı ve Calle Ocho festivali.' },
      { name: 'Wynwood', description: 'Açık hava sokak sanatı galerisi, Wynwood Walls.' },
      { name: 'Vizcaya Museum', description: 'İtalyan Rönesans tarzı villa, 10 hektarlık bahçeler.' }
    ],
    bestTime: 'Kasım-Nisan',
    duration: '12 saat',
  },
  'San Francisco': {
    description: 'Golden Gate\'in şehri San Francisco, viktoryen evleri, teknoloji kültürü ve eşsiz tepeleriyle ikonik.',
    highlights: [
      { name: 'Golden Gate Köprüsü', description: '1937 yapımı turuncu asma köprü, bisiklet veya yürüyüşle geçiş.' },
      { name: 'Alcatraz', description: 'Eski federal hapishane adası, feribot ile tur.' },
      { name: 'Fisherman\'s Wharf', description: 'Deniz aslanları, clam chowder ve Pier 39.' },
      { name: 'Chinatown', description: 'Asya dışındaki en eski Çin mahallesi, dim sum ve tapınaklar.' },
      { name: 'Cable Cars', description: '1873\'ten kalma tarihi tramvaylar, dikliği hissedin.' }
    ],
    bestTime: 'Eylül-Kasım',
    duration: '13 saat',
  },
  'Toronto': {
    description: 'Kanada\'nın en büyük şehri Toronto, CN Kulesi, çok kültürlü mahalleleri ve Niagara Şelalesi\'ne yakınlığıyla çekici.',
    highlights: [
      { name: 'CN Kulesi', description: '553 metre, cam taban EdgeWalk ile dünyanın en yükseğinde yürüyüş.' },
      { name: 'Niagara Şelalesi', description: '1.5 saat uzaklıkta, 3 şelaleden oluşan doğa harikası.' },
      { name: 'Distillery District', description: '19. yüzyıl viski fabrikası, galeriler ve kafeler.' },
      { name: 'St. Lawrence Market', description: '200 yıllık gıda pazarı, peameal bacon sandviç.' },
      { name: 'Toronto Adaları', description: 'Feribot ile 15 dk, plajlar ve şehir skyline manzarası.' }
    ],
    bestTime: 'Mayıs-Ekim',
    duration: '10 saat',
  },
  'Vancouver': {
    description: 'Dağlar ve okyanus arasında kurulan Vancouver, doğa sporları, Stanley Park ve yaşam kalitesiyle Kanada\'nın incisi.',
    highlights: [
      { name: 'Stanley Park', description: '405 hektar yarımada parkı, deniz duvarı ve totem direkleri.' },
      { name: 'Grouse Mountain', description: 'Teleferikte 15 dk, kış sporları ve ayı yaşam alanı.' },
      { name: 'Granville Island', description: 'Kamu pazarı, sanat stüdyoları ve feribot taşımacılığı.' },
      { name: 'Gastown', description: 'Buhar saati ve tuğla döşeli sokaklarla tarihi mahalle.' },
      { name: 'Capilano Asma Köprüsü', description: '137 metre uzunluk, 70 metre yükseklikte orman deneyimi.' }
    ],
    bestTime: 'Haziran-Eylül',
    duration: '12 saat',
  },
  'Montreal': {
    description: 'Fransız kültürünün Kuzey Amerika\'daki kalesi Montreal, tarihi mimarisi, canlı festivalleri ve leziz mutfağıyla büyüleyici.',
    highlights: [
      { name: 'Old Montreal', description: '17. yüzyıldan parke taşı sokaklar, at arabaları ve tarihi binalar.' },
      { name: 'Notre-Dame Basilica', description: 'Gotik Revival şaheseri, mavi ve altın iç mekan ışık gösterisi.' },
      { name: 'Mount Royal', description: 'Şehri gören 233 metre tepe, kış kros kayağı, yaz piknik.' },
      { name: 'Plateau Mont-Royal', description: 'Renkli merdiven evler, vintage dükkanlar ve brunch kültürü.' },
      { name: 'Jean-Talon Market', description: 'Kuzey Amerika\'nın en büyük açık gıda pazarlarından.' }
    ],
    bestTime: 'Mayıs-Ekim',
    duration: '9 saat 30 dk',
  },
  'Sao Paulo': {
    description: 'Güney Amerika\'nın en büyük şehri Sao Paulo, kültür sahnesi, gastronomi ve kentsel enerjisiyle Brezilya\'nın kalbi.',
    highlights: [
      { name: 'Paulista Caddesi', description: 'Finans, kültür ve pazar günü yaya caddesi festivali.' },
      { name: 'Ibirapuera Parkı', description: '158 hektar yeşil alan, müzeler, bisiklet ve koşu.' },
      { name: 'MASP', description: 'Latin Amerika\'nın en önemli sanat müzesi, havada asılı koleksiyon.' },
      { name: 'Pinacoteca', description: 'Sao Paulo\'nun en eski müzesi, Brezilya sanatı.' },
      { name: 'Vila Madalena', description: 'Grafiti sokakları, barlar ve bohemian gece hayatı.' }
    ],
    bestTime: 'Nisan-Kasım',
    duration: '12 saat',
  },
  'Rio de Janeiro': {
    description: 'Karnaval, samba ve Kurtarıcı İsa\'nın şehri Rio, Copacabana plajları ve dramatik manzarasıyla dünyanın en güzel şehirlerinden.',
    highlights: [
      { name: 'Kurtarıcı İsa Heykeli', description: '30 metre Art Deco heykel, Corcovado Dağı\'nda 710 metre yükseklikte.' },
      { name: 'Şeker Kamışı Dağı', description: 'Teleferikle 396 metre, körfez ve şehir panoraması.' },
      { name: 'Copacabana', description: '4 km ikonik plaj, dalgalı kaldırım deseni.' },
      { name: 'Ipanema', description: 'Ünlü şarkıyla anılan, gün batımı ritüeliyle modacı sahil.' },
      { name: 'Maracana Stadyumu', description: '78.000 kişilik efsanevi futbol mabedi, tur imkanı.' }
    ],
    bestTime: 'Mayıs-Ekim',
    duration: '13 saat',
  },
  'Buenos Aires': {
    description: 'Tango\'nun doğduğu Buenos Aires, Avrupa mimarisi, biftek kültürü ve Latin tutkusuyla Güney Amerika\'nın Paris\'i.',
    highlights: [
      { name: 'Plaza de Mayo', description: 'Casa Rosada (Pembe Saray) ve Arjantin tarihinin merkezi.' },
      { name: 'La Boca', description: 'Renkli konvansiyonel evler, Caminito sokağı ve tango.' },
      { name: 'San Telmo', description: 'Antika pazarı, kopya taş sokaklar ve sokak tangocuları.' },
      { name: 'Recoleta Mezarlığı', description: 'Evita dahil ünlülerin anıt mezarları, açık hava müze.' },
      { name: 'Teatro Colón', description: 'Dünyanın en iyi akustiğine sahip opera sahnelerinden.' }
    ],
    bestTime: 'Mart-Mayıs, Eylül-Kasım',
    duration: '14 saat',
  },
  'Santiago': {
    description: 'And Dağları\'nın eteklerinde Santiago, şarap bölgeleri, kayak merkezleri ve modern Şili kültürüyle çeşitli.',
    highlights: [
      { name: 'San Cristobal Tepesi', description: 'Teleferikle 880 metre, Meryem Ana heykeli ve şehir panoraması.' },
      { name: 'Plaza de Armas', description: 'Koloni döneminden merkez meydan, katedral ve şatranç oyuncuları.' },
      { name: 'La Chascona', description: 'Pablo Neruda\'nın tuhaf evi, şimdi müze.' },
      { name: 'Mercado Central', description: 'UNESCO\'nun dünya mirası gastronomik pazar, deniz ürünleri.' },
      { name: 'Şarap Turları', description: 'Maipo Vadisi, Concha y Toro dahil şarap mahzeni ziyaretleri.' }
    ],
    bestTime: 'Ekim-Nisan',
    duration: '15 saat',
  },
  'Bogota': {
    description: 'Kolombiya\'nın dağ başkenti Bogota, grafiti sanatı, kahve kültürü ve yeniden doğan turizmiyle şaşırtıcı.',
    highlights: [
      { name: 'La Candelaria', description: 'Koloni mimarisi, müzeler ve sokak sanatıyla tarihi merkez.' },
      { name: 'Monserrate Dağı', description: '3.152 metre teleferik ile kilise ve şehir manzarası.' },
      { name: 'Altın Müzesi', description: '55.000+ pre-Kolomb altın eseriyle dünyanın en önemli koleksiyonu.' },
      { name: 'Usaquen Pazar', description: 'Pazar günü bit pazarı, el sanatları ve gastronomi.' },
      { name: 'Graffiti Turu', description: 'Şehrin politik ve sanatsal duvar resimleri keşfi.' }
    ],
    bestTime: 'Aralık-Mart',
    duration: '11 saat',
  },
  'Lima': {
    description: 'Peru\'nun başkenti Lima, dünyaca ünlü gastronomisi, sömürge mimarisi ve Machu Picchu\'ya kapı olarak stratejik.',
    highlights: [
      { name: 'Miraflores', description: 'Uçurumlarda parklar, alışveriş ve gün batımı manzarası.' },
      { name: 'Plaza de Armas', description: 'Koloni merkez meydanı, başkanlık sarayı ve katedral.' },
      { name: 'Larco Müzesi', description: 'Pre-Kolomb seramik ve altın, erotik galeri dahil.' },
      { name: 'Barranco', description: 'Bohemian mahalle, sanat galerileri ve canlı gece hayatı.' },
      { name: 'Ceviche Deneyimi', description: 'Peru\'nun ulusal yemeği, taze deniz ürünleri ve acı.' }
    ],
    bestTime: 'Aralık-Nisan',
    duration: '12 saat',
  },
  'Havana': {
    description: 'Zamanda donmuş şehir Havana, vintage arabalar, renkli binalar ve salsa ritmiyle Karayip\'in kalbi.',
    highlights: [
      { name: 'Havana Vieja', description: 'UNESCO Mirası, 500 yıllık İspanyol koloni mimarisi.' },
      { name: 'Malecon', description: '8 km sahil yolu, gün batımı ve sosyal yaşam merkezi.' },
      { name: 'El Capitolio', description: 'ABD Capitol\'ü benzeri 1929 yapımı ulusal meclis binası.' },
      { name: 'Plaza de la Revolución', description: 'Che Guevara anıtı ve devrim tarihinin merkezi.' },
      { name: 'Fusterlandia', description: 'Sanatçı José Fuster\'ın mozaiklerle kapladığı renkli mahalle.' }
    ],
    bestTime: 'Kasım-Nisan',
    duration: '3 saat',
  },
  
  // === OKYANUSYA ===
  'Sidney': {
    description: 'Avustralya\'nın simgesi Sidney, Opera Binası, Harbour Bridge ve muhteşem plajlarıyla dünyanın en yaşanabilir şehirlerinden.',
    highlights: [
      { name: 'Opera Binası', description: '1973 açılışlı, UNESCO Mirası, ikonik yelken kabuklu tasarım.' },
      { name: 'Harbour Bridge', description: '1932 yapımı, BridgeClimb ile 134 metre yükseklikte yürüyüş.' },
      { name: 'Bondi Beach', description: 'Sörf, yaşam tarzı ve Bondi to Coogee sahil yürüyüşü.' },
      { name: 'Darling Harbour', description: 'Akvaryum, müzeler, restoranlar ve eğlence merkezi.' },
      { name: 'The Rocks', description: 'Sidney\'nin ilk yerleşimi, tarihi binalar ve hafta sonu pazarı.' }
    ],
    bestTime: 'Eylül-Kasım, Mart-Mayıs',
    duration: '17 saat',
  },
  'Melbourne': {
    description: 'Avustralya\'nın kültür başkenti Melbourne, sokak sanatı, kahve kültürü ve spor etkinlikleriyle cool ve yaratıcı.',
    highlights: [
      { name: 'Federation Square', description: 'Dekonstrüktivist mimari, galeriler ve etkinlik mekanı.' },
      { name: 'Hosier Lane', description: 'Dünyanın en ünlü grafiti sokaklarından, sürekli değişen.' },
      { name: 'Queen Victoria Market', description: '140+ yıllık tarihi pazar, taze ürünler ve hediyelik.' },
      { name: 'St Kilda', description: 'Lunapark, plaj ve akşam penguen seyri.' },
      { name: 'Great Ocean Road', description: '12 Havari kayalıkları ve dramatik sahil manzarası sürüşü.' }
    ],
    bestTime: 'Mart-Mayıs, Eylül-Kasım',
    duration: '18 saat',
  },
  'Auckland': {
    description: 'Yeni Zelanda\'nın en büyük şehri Auckland, volkanik adaları, yelken kültürü ve Maori mirası ile doğa cenneti.',
    highlights: [
      { name: 'Sky Tower', description: '328 metre, SkyWalk ve SkyJump macera aktiviteleri.' },
      { name: 'Waiheke Adası', description: '35 dk feribot, şarap mahzenleri ve zeytinyağı çiftlikleri.' },
      { name: 'Mount Eden', description: 'En yüksek volkanik koni, 360° Auckland manzarası.' },
      { name: 'Viaduct Harbour', description: 'Süper yatlar, restoranlar ve America\'s Cup mirası.' },
      { name: 'Rangitoto Adası', description: 'Kayak ile veya feribot, volkanik ada yürüyüşü.' }
    ],
    bestTime: 'Kasım-Nisan',
    duration: '20 saat',
  },
  
  // === DİĞER ===
  'Moskova': {
    description: 'Rusya\'nın dev başkenti Moskova, Kremlin, Kızıl Meydan ve görkemli metro istasyonlarıyla imparatorluk ihtişamını yansıtıyor.',
    highlights: [
      { name: 'Kızıl Meydan', description: 'Kremlin, St. Basil Katedrali ve Lenin Mozolesi ile tarihi merkez.' },
      { name: 'Kremlin', description: '15. yüzyıldan hükümet kompleksi, hazine ve silah koleksiyonları.' },
      { name: 'St. Basil Katedrali', description: '1561 yapımı, renkli soğan kubbeleri ile ikonik Rus mimarisi.' },
      { name: 'Bolşoy Tiyatrosu', description: '1776\'dan dünyaca ünlü bale ve opera sahnesi.' },
      { name: 'GUM Alışveriş Merkezi', description: '1893 yapımı cam kubbeli lüks mağaza, Kızıl Meydan\'da.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '3 saat',
  },
  'St. Petersburg': {
    description: 'Rusya\'nın kültür başkenti St. Petersburg, Hermitage Müzesi, beyaz geceler ve çarlık saraylarıyla büyüleyici.',
    highlights: [
      { name: 'Hermitage Müzesi', description: '3 milyon+ eserle dünyanın en büyük müzelerinden, Kış Sarayı içinde.' },
      { name: 'Church of Spilled Blood', description: 'Mozaikle kaplı soğan kubbeli kilise, II. Aleksandr anısına.' },
      { name: 'Peterhof Sarayı', description: 'Rus Versailles\'ı, 150+ fıskiye ve altın süslemeli bahçeler.' },
      { name: 'Nevsky Prospect', description: '4.5 km\'lik ana cadde, alışveriş, kafeler ve tarihi binalar.' },
      { name: 'Yaz Bahçesi', description: 'Petro I\'in 1704\'te kurduğu, heykeller ve ıhlamurlarla en eski park.' }
    ],
    bestTime: 'Mayıs-Eylül',
    duration: '3 saat 30 dk',
  },
  'Ercan': {
    description: 'Kuzey Kıbrıs\'ın kapısı Ercan, tarihi Lefkoşa, muhteşem plajları ve Türk misafirperverliğiyle yakın bir tatil cenneti.',
    highlights: [
      { name: 'Girne Kalesi', description: 'Bizans döneminden, iç limana bakan ortaçağ kalesi ve batık gemi müzesi.' },
      { name: 'Bellapais Manastırı', description: '13. yüzyıl Gotik manastır, Lawrence Durrell\'in yazdığı köy.' },
      { name: 'St. Hilarion Kalesi', description: 'Beşparmak Dağları\'nda peri masalı kalesi, Disney\'e ilham.' },
      { name: 'Salamis Antik Kenti', description: 'MÖ 11. yüzyıldan Roma tiyatrosu ve hamamlarla arkeolojik alan.' },
      { name: 'Karpaz Yarımadası', description: 'Yaban eşekleri, bakir plajlar ve Apostolos Andreas Manastırı.' }
    ],
    bestTime: 'Nisan-Kasım',
    duration: '1 saat 15 dk',
  },
};

// Default descriptions for cities without specific content
const DEFAULT_DESCRIPTION = {
  description: 'Keşfedilmeyi bekleyen harika bir destinasyon. Hafta sonu kaçamağı için ideal.',
  highlights: [
    { name: 'Şehir Merkezi', description: 'Tarihi ve modern yapıların buluştuğu merkez bölge.' },
    { name: 'Yerel Mutfak', description: 'Bölgeye özgü lezzetler ve geleneksel yemekler.' },
    { name: 'Tarihi Yerler', description: 'Şehrin zengin geçmişini yansıtan tarihi mekanlar.' },
    { name: 'Alışveriş', description: 'Yerel ürünler ve hediyelik eşyalar için çarşı ve pazarlar.' }
  ],
  bestTime: 'İlkbahar ve Sonbahar',
  duration: '2-4 saat',
};

// City images for SEO pages
const CITY_IMAGES: Record<string, string> = {
  'Atina': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1200&h=630&fit=crop',
  'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=630&fit=crop',
  'Roma': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&h=630&fit=crop',
  'Barselona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&h=630&fit=crop',
  'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&h=630&fit=crop',
  'Londra': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=630&fit=crop',
  'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=630&fit=crop',
  'Prag': 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=1200&h=630&fit=crop',
  'Budapeşte': 'https://images.unsplash.com/photo-1551867633-194f125bddfa?w=1200&h=630&fit=crop',
  'Viyana': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1200&h=630&fit=crop',
  'Berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&h=630&fit=crop',
  'Tiflis': 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1200&h=630&fit=crop',
  'Bakü': 'https://images.unsplash.com/photo-1603554593710-89285534dc90?w=1200&h=630&fit=crop',
  'Belgrad': 'https://images.unsplash.com/photo-1555990793-da11153b2473?w=1200&h=630&fit=crop',
  'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=630&fit=crop',
  'Singapur': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop',
  'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&h=630&fit=crop',
  'Bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579c4e?w=1200&h=630&fit=crop',
  'Lizbon': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1200&h=630&fit=crop',
  'Milano': 'https://images.unsplash.com/photo-1520440229-6469a149ac59?w=1200&h=630&fit=crop',
  'Madrid': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&h=630&fit=crop',
  'Selanik': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=630&fit=crop';

// Generate SEO destinations from destination data
export function generateSEODestinations(): SEODestination[] {
  const destinations: SEODestination[] = [];
  const seenSlugs = new Set<string>();

  for (const [code, info] of Object.entries(destinationData)) {
    // Skip Turkish airports
    if (info.countryCode === 'TR') continue;

    const cleanCity = info.city.split('(')[0].trim();
    const slug = createSlug(cleanCity);

    // Skip duplicates (e.g., multiple airports for same city)
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const cityInfo = CITY_DESCRIPTIONS[cleanCity] || DEFAULT_DESCRIPTION;

    destinations.push({
      slug,
      airportCode: code,
      city: cleanCity,
      country: info.country,
      countryCode: info.countryCode,
      flag: getCountryFlag(info.countryCode),
      visaRequired: !VISA_FREE_CODES.includes(code),
      continent: CONTINENT_MAP[info.countryCode] || 'europe',
      description: cityInfo.description,
      highlights: cityInfo.highlights,
      bestTimeToVisit: cityInfo.bestTime,
      averageFlightDuration: cityInfo.duration,
      imageUrl: CITY_IMAGES[cleanCity] || DEFAULT_IMAGE,
      keywords: generateKeywords(cleanCity, info.country),
    });
  }

  return destinations.sort((a, b) => a.city.localeCompare(b.city, 'tr'));
}

function generateKeywords(city: string, country: string): string[] {
  return [
    `${city} uçak bileti`,
    `${city} ucuz bilet`,
    `${city} hafta sonu`,
    `İstanbul ${city} uçuş`,
    `${city} gidiş dönüş`,
    `${city} ${country} bilet`,
    `${city} tatil`,
    `${city} tur`,
  ];
}

// Get destination by slug
export function getDestinationBySlug(slug: string): SEODestination | undefined {
  const destinations = generateSEODestinations();
  return destinations.find(d => d.slug === slug);
}

// Get all destination slugs for static generation
export function getAllDestinationSlugs(): string[] {
  return generateSEODestinations().map(d => d.slug);
}

// Get popular destinations for homepage
export function getPopularDestinations(limit = 12): SEODestination[] {
  const popular = ['paris', 'roma', 'barselona', 'amsterdam', 'londra', 'atina', 'prag', 'budapeşte', 'viyana', 'dubai', 'tiflis', 'baku'];
  const destinations = generateSEODestinations();
  
  return popular
    .map(slug => destinations.find(d => d.slug === slug || d.slug === createSlug(slug)))
    .filter((d): d is SEODestination => d !== undefined)
    .slice(0, limit);
}
