import { destinationData, DestinationInfo, getCountryFlag } from './destinations';

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
  highlights: string[];
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
const CITY_DESCRIPTIONS: Record<string, { description: string; highlights: string[]; bestTime: string; duration: string }> = {
  // === AVRUPA ===
  'Atina': {
    description: 'Antik Yunan medeniyetinin kalbi Atina, tarihi zenginlikleri, muhteşem Akropolisi ve canlı gece hayatıyla unutulmaz bir tatil deneyimi sunuyor.',
    highlights: ['Akropolis ve Parthenon', 'Plaka Mahallesi', 'Monastiraki Meydanı', 'Ulusal Arkeoloji Müzesi', 'Syntagma Meydanı'],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '1 saat 20 dk',
  },
  'Paris': {
    description: 'Aşkın ve sanatın başkenti Paris, Eyfel Kulesi, Louvre Müzesi ve romantik sokakalarıyla dünyanın en çok ziyaret edilen şehirlerinden.',
    highlights: ['Eyfel Kulesi', 'Louvre Müzesi', 'Champs-Élysées', 'Montmartre', 'Seine Nehri Turu'],
    bestTime: 'Nisan-Haziran, Eylül-Kasım',
    duration: '3 saat 30 dk',
  },
  'Roma': {
    description: 'Antik Roma İmparatorluğunun kalbi, Kolezyum, Vatikan ve eşsiz İtalyan mutfağıyla tarih ve lezzet tutkunlarının vazgeçilmez durağı.',
    highlights: ['Kolezyum', 'Vatikan Müzeleri', 'Trevi Çeşmesi', 'Pantheon', 'İspanyol Merdivenleri'],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '2 saat 15 dk',
  },
  'Barselona': {
    description: 'Gaudi\'nin mimari şaheserleri, muhteşem plajları ve canlı kültürüyle Akdeniz\'in incisi Barselona, her mevsim tatilcileri bekliyor.',
    highlights: ['Sagrada Familia', 'Park Güell', 'La Rambla', 'Barceloneta Plajı', 'Camp Nou Stadyumu'],
    bestTime: 'Mayıs-Haziran, Eylül-Ekim',
    duration: '3 saat',
  },
  'Amsterdam': {
    description: 'Kanalları, bisiklet kültürü, müzeleri ve özgür atmosferiyle Amsterdam, Avrupa\'nın en renkli başkentlerinden biri.',
    highlights: ['Anne Frank Evi', 'Van Gogh Müzesi', 'Rijksmuseum', 'Vondelpark', 'Kanal Turu'],
    bestTime: 'Nisan-Eylül',
    duration: '3 saat 15 dk',
  },
  'Londra': {
    description: 'Kraliyet sarayları, dünyaca ünlü müzeleri ve kozmopolit yapısıyla Londra, kültür ve tarih tutkunları için eşsiz bir deneyim.',
    highlights: ['Big Ben', 'Tower Bridge', 'British Museum', 'Buckingham Sarayı', 'Westminster Abbey'],
    bestTime: 'Mayıs-Eylül',
    duration: '4 saat',
  },
  'Berlin': {
    description: 'Tarihi ve modern yanıyla Berlin, sanat galerileri, gece hayatı ve kültürel çeşitliliğiyle Avrupa\'nın en dinamik başkenti.',
    highlights: ['Brandenburg Kapısı', 'Berlin Duvarı', 'Reichstag', 'Museum Island', 'Checkpoint Charlie'],
    bestTime: 'Mayıs-Eylül',
    duration: '2 saat 45 dk',
  },
  'Münih': {
    description: 'Bavyera\'nın başkenti Münih, geleneksel bira bahçeleri, muhteşem sarayları ve Alp manzarasıyla büyülüyor.',
    highlights: ['Marienplatz', 'Nymphenburg Sarayı', 'Englischer Garten', 'BMW Müzesi', 'Viktualienmarkt'],
    bestTime: 'Mayıs-Ekim',
    duration: '2 saat 30 dk',
  },
  'Frankfurt': {
    description: 'Almanya\'nın finans merkezi Frankfurt, modern gökdelenleri ve tarihi eski şehriyle ilginç bir kontrast sunuyor.',
    highlights: ['Römerberg Meydanı', 'Main Kulesi', 'Palmengarten', 'Städel Müzesi', 'Sachsenhausen'],
    bestTime: 'Mayıs-Eylül',
    duration: '2 saat 45 dk',
  },
  'Prag': {
    description: 'Ortaçağ mimarisi, tarihi köprüleri ve masalsı atmosferiyle Prag, Avrupa\'nın en romantik şehirlerinden biri.',
    highlights: ['Charles Köprüsü', 'Eski Kent Meydanı', 'Prag Kalesi', 'Astronomik Saat', 'Yahudi Mahallesi'],
    bestTime: 'Nisan-Mayıs, Eylül-Ekim',
    duration: '2 saat 30 dk',
  },
  'Budapeşte': {
    description: 'Tuna Nehri\'nin iki yakasında kurulu Budapeşte, termal kaplıcaları, muhteşem mimarisi ve canlı gece hayatıyla büyülüyor.',
    highlights: ['Parlamento Binası', 'Balıkçı Kalesi', 'Széchenyi Kaplıcası', 'Zincir Köprü', 'Buda Kalesi'],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '2 saat',
  },
  'Viyana': {
    description: 'Habsburg İmparatorluğunun başkenti Viyana, klasik müziği, imparatorluk sarayları ve kahve kültürüyle Avrupa\'nın kültür merkezi.',
    highlights: ['Schönbrunn Sarayı', 'St. Stephen Katedrali', 'Belvedere Müzesi', 'Viyana Operası', 'Naschmarkt'],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '2 saat 15 dk',
  },
  'Lizbon': {
    description: 'Yedi tepe üzerine kurulu Lizbon, nostaljik tramvayları, fado müziği ve pastéis de nata ile Portekiz\'in ruhunu yansıtıyor.',
    highlights: ['Belém Kulesi', 'Alfama Mahallesi', 'Jerónimos Manastırı', '28 Numaralı Tramvay', 'Time Out Market'],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '3 saat 45 dk',
  },
  'Porto': {
    description: 'Douro Nehri kıyısında şarap mahzenleri, renkli evleri ve tarihi köprüleriyle Porto, Portekiz\'in kuzey incisi.',
    highlights: ['Ribeira Mahallesi', 'Livraria Lello', 'Dom Luís Köprüsü', 'Şarap Mahzenleri', 'Clérigos Kulesi'],
    bestTime: 'Mayıs-Eylül',
    duration: '3 saat 30 dk',
  },
  'Madrid': {
    description: 'İspanya\'nın başkenti Madrid, dünyaca ünlü müzeleri, canlı tapas kültürü ve coşkulu gece hayatıyla büyülüyor.',
    highlights: ['Prado Müzesi', 'Retiro Parkı', 'Plaza Mayor', 'Kraliyet Sarayı', 'Gran Vía'],
    bestTime: 'Nisan-Haziran, Eylül-Kasım',
    duration: '3 saat 30 dk',
  },
  'Palma de Mallorca': {
    description: 'Akdeniz\'in gözde adası Mallorca, turkuaz plajları, tarihi katedrali ve lüks marinalarıyla tatil cenneti.',
    highlights: ['Palma Katedrali', 'Bellver Kalesi', 'Eski Şehir', 'Paseo Marítimo', 'Serra de Tramuntana'],
    bestTime: 'Mayıs-Ekim',
    duration: '3 saat 15 dk',
  },
  'Malaga': {
    description: 'Costa del Sol\'un incisi Malaga, Picasso\'nun doğduğu şehir olarak sanat, plaj ve İspanyol kültürünü bir arada sunuyor.',
    highlights: ['Alcazaba Kalesi', 'Picasso Müzesi', 'Malagueta Plajı', 'Atarazanas Pazarı', 'Gibralfaro Kalesi'],
    bestTime: 'Nisan-Kasım',
    duration: '3 saat 15 dk',
  },
  'Milano': {
    description: 'Moda ve tasarımın başkenti Milano, ikonik katedrali, La Scala operası ve lüks alışverişiyle İtalya\'nın modern yüzü.',
    highlights: ['Duomo Katedrali', 'Galleria Vittorio Emanuele II', 'La Scala', 'Son Akşam Yemeği', 'Navigli Kanalları'],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '2 saat 30 dk',
  },
  'Venedik': {
    description: 'Su üzerinde kurulu eşsiz şehir Venedik, gondol turları, tarihi meydanları ve romantik atmosferiyle dünya harikası.',
    highlights: ['San Marco Meydanı', 'Rialto Köprüsü', 'Gondol Turu', 'Doge Sarayı', 'Murano Adası'],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '2 saat',
  },
  'Napoli': {
    description: 'Pizzanın doğduğu şehir Napoli, Vezüv\'ün gölgesinde tarihi hazineleri, sokak lezzetleri ve Akdeniz ruhuyla büyülüyor.',
    highlights: ['Pompei Antik Kenti', 'Napoli Ulusal Müzesi', 'Spaccanapoli', 'Castel dell\'Ovo', 'Amalfi Sahili'],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '2 saat 15 dk',
  },
  'Brüksel': {
    description: 'Avrupa\'nın başkenti Brüksel, Grand Place\'i, çikolata dükkanları ve Art Nouveau mimarisiyle büyülüyor.',
    highlights: ['Grand Place', 'Atomium', 'Manneken Pis', 'Çikolata Müzesi', 'Kraliyet Sarayı'],
    bestTime: 'Mayıs-Eylül',
    duration: '2 saat 45 dk',
  },
  'Zürih': {
    description: 'İsviçre\'nin finans merkezi Zürih, göl manzarası, temiz sokakları ve yüksek yaşam kalitesiyle etkileyici.',
    highlights: ['Zürih Gölü', 'Bahnhofstrasse', 'Eski Şehir', 'Kunsthaus Müzesi', 'Uetliberg Dağı'],
    bestTime: 'Mayıs-Eylül',
    duration: '2 saat 30 dk',
  },
  'Cenevre': {
    description: 'Uluslararası diplomasinin merkezi Cenevre, göl manzarası, lüks saatçilik ve çok kültürlü yapısıyla büyüleyici.',
    highlights: ['Jet d\'Eau Çeşmesi', 'Eski Şehir', 'BM Ofisi', 'CERN', 'Cenevre Gölü'],
    bestTime: 'Mayıs-Eylül',
    duration: '2 saat 45 dk',
  },
  'Kopenhag': {
    description: 'Danimarka\'nın başkenti Kopenhag, bisiklet kültürü, renkli evleri ve hygge yaşam tarzıyla Kuzey\'in incisi.',
    highlights: ['Nyhavn', 'Tivoli Bahçeleri', 'Küçük Deniz Kızı', 'Rosenborg Kalesi', 'Strøget Caddesi'],
    bestTime: 'Mayıs-Eylül',
    duration: '3 saat',
  },
  'Stockholm': {
    description: '14 adadan oluşan Stockholm, zarif mimarisi, temiz suları ve İskandinav tasarımıyla Kuzey\'in Venedik\'i.',
    highlights: ['Gamla Stan', 'Vasa Müzesi', 'ABBA Müzesi', 'Kraliyet Sarayı', 'Djurgården Adası'],
    bestTime: 'Mayıs-Eylül',
    duration: '3 saat 15 dk',
  },
  'Oslo': {
    description: 'Fiyortların kapısı Oslo, modern mimarisi, müzeleri ve doğayla iç içe yaşam tarzıyla Norveç\'in kalbini yansıtıyor.',
    highlights: ['Vigeland Parkı', 'Opera Binası', 'Munch Müzesi', 'Akershus Kalesi', 'Holmenkollen Atlama Kulesi'],
    bestTime: 'Mayıs-Eylül',
    duration: '3 saat 30 dk',
  },
  'Helsinki': {
    description: 'Baltık\'ın beyaz incisi Helsinki, modern tasarımı, saunası ve denizle iç içe yaşamıyla Finlandiya\'nın gururu.',
    highlights: ['Helsinki Katedrali', 'Suomenlinna Kalesi', 'Market Meydanı', 'Temppeliaukio Kilisesi', 'Design District'],
    bestTime: 'Haziran-Ağustos',
    duration: '3 saat',
  },
  'Dublin': {
    description: 'İrlanda\'nın başkenti Dublin, edebi mirası, canlı pub kültürü ve yeşil parkalarıyla misafirperver bir atmosfer sunuyor.',
    highlights: ['Trinity College', 'Temple Bar', 'Guinness Storehouse', 'St. Patrick Katedrali', 'Phoenix Park'],
    bestTime: 'Mayıs-Eylül',
    duration: '4 saat 15 dk',
  },
  'Varşova': {
    description: 'II. Dünya Savaşı\'ndan yeniden doğan Varşova, tarihi eski şehri, modern gökdelenleri ve dinamik kültür sahnesiylebüyülüyor.',
    highlights: ['Eski Şehir Meydanı', 'Kraliyet Kalesi', 'Chopin Müzesi', 'Lazienki Parkı', 'POLIN Müzesi'],
    bestTime: 'Mayıs-Eylül',
    duration: '2 saat 30 dk',
  },
  'Bükreş': {
    description: 'Romanya\'nın başkenti Bükreş, devasa Parlamento Sarayı, tarihi mahalleleri ve canlı gece hayatıyla şaşırtıyor.',
    highlights: ['Parlamento Sarayı', 'Eski Şehir', 'Romanya Athenaeum', 'Herastrau Parkı', 'Köy Müzesi'],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '1 saat 45 dk',
  },
  'Sofya': {
    description: 'Bulgaristan\'ın başkenti Sofya, Osmanlı, Sovyet ve modern izlerin bir arada yaşadığı uygun fiyatlı bir Balkan cenneti.',
    highlights: ['Alexander Nevsky Katedrali', 'Vitosha Dağı', 'Boyana Kilisesi', 'Ulusal Kültür Sarayı', 'Serdika Kalıntıları'],
    bestTime: 'Mayıs-Eylül',
    duration: '1 saat 30 dk',
  },
  'Riga': {
    description: 'Letonya\'nın başkenti Riga, Art Nouveau mimarisi, ortaçağ sokakları ve Baltık ruhunu yansıtan canlı bir şehir.',
    highlights: ['Eski Şehir', 'Art Nouveau Bölgesi', 'Merkez Pazarı', 'Özgürlük Anıtı', 'St. Peter Kilisesi'],
    bestTime: 'Mayıs-Eylül',
    duration: '2 saat 45 dk',
  },
  'Vilnius': {
    description: 'Litvanya\'nın başkenti Vilnius, barok mimarisi, bohemian Užupis mahallesi ve samimi atmosferiyle gizli bir hazine.',
    highlights: ['Gediminas Kulesi', 'Vilnius Katedrali', 'Užupis Cumhuriyeti', 'Trakai Kalesi', 'Eski Şehir'],
    bestTime: 'Mayıs-Eylül',
    duration: '2 saat 30 dk',
  },
  'Tallinn': {
    description: 'Estonya\'nın başkenti Tallinn, ortaçağ surları, dijital yenilikçiliği ve Baltık cazibesini bir arada sunuyor.',
    highlights: ['Eski Şehir', 'Toompea Kalesi', 'Raekoja Plats', 'Telliskivi Yaratıcı Şehir', 'Kadriorg Parkı'],
    bestTime: 'Mayıs-Eylül',
    duration: '2 saat 45 dk',
  },
  'Selanik': {
    description: 'Yunanistan\'ın ikinci büyük şehri Selanik, Osmanlı ve Bizans mirası, canlı sahil şeridi ve leziz mutfağıyla büyüleyici.',
    highlights: ['Beyaz Kule', 'Aristoteles Meydanı', 'Ladadika', 'Ano Poli', 'Arkeoloji Müzesi'],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '1 saat 15 dk',
  },
  
  // === BALKANLAR (Vizesiz) ===
  'Tiran': {
    description: 'Arnavutluk\'un renkli başkenti Tiran, pastel boyalı binaları, canlı kafeler ve Balkan misafirperverliğiyle şaşırtıyor.',
    highlights: ['Skanderbeg Meydanı', 'Bunk\'Art Müzesi', 'Dajti Dağı Teleferik', 'Blok Mahallesi', 'Et\'hem Bey Camii'],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '1 saat 30 dk',
  },
  'Priştine': {
    description: 'Kosova\'nın genç başkenti Priştine, Osmanlı mirası, modern heykelleri ve enerjik atmosferiyle keşfedilmeyi bekliyor.',
    highlights: ['Newborn Anıtı', 'Ulusal Kütüphane', 'Çarşı Camii', 'Mother Teresa Bulvarı', 'Etnografya Müzesi'],
    bestTime: 'Mayıs-Ekim',
    duration: '1 saat 20 dk',
  },
  'Üsküp': {
    description: 'Kuzey Makedonya\'nın başkenti Üsküp, Osmanlı köprüsü, barok heykelleri ve Balkan kültürünün buluştuğu bir mozaik.',
    highlights: ['Taş Köprü', 'Makedonya Meydanı', 'Eski Çarşı', 'Kale Fortress', 'Mustafa Paşa Camii'],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '1 saat 15 dk',
  },
  'Saraybosna': {
    description: 'Doğu ile Batı\'nın buluştuğu Saraybosna, Osmanlı çarşısı, dramatik tarihi ve sıcak insanlarıyla unutulmaz.',
    highlights: ['Başçarşı', 'Latin Köprüsü', 'Sebilj Çeşmesi', 'Sarı Kale', 'Tunnel of Hope'],
    bestTime: 'Mayıs-Eylül',
    duration: '1 saat 40 dk',
  },
  'Podgorica': {
    description: 'Karadağ\'ın başkenti Podgorica, modern yapısı, çevresindeki doğal güzellikler ve Balkan sadeliğini yansıtıyor.',
    highlights: ['Millenium Köprüsü', 'Kral Nikola Müzesi', 'Skadar Gölü', 'Clock Tower', 'Stara Varos'],
    bestTime: 'Mayıs-Ekim',
    duration: '1 saat 25 dk',
  },
  'Belgrad': {
    description: 'Balkanların kalbi Belgrad, canlı gece hayatı, tarihi kaleleri ve nehir manzarasıyla genç gezginlerin favorisi.',
    highlights: ['Kalemegdan Kalesi', 'Skadarlija Sokağı', 'Nehir Barları', 'St. Sava Kilisesi', 'Ada Ciganlija'],
    bestTime: 'Mayıs-Eylül',
    duration: '1 saat 30 dk',
  },
  
  // === KAFKASYA & ORTA ASYA ===
  'Tiflis': {
    description: 'Kafkasların gizli cenneti Tiflis, tarihi mahalleleri, leziz mutfağı ve misafirperver insanlarıyla keşfedilmeyi bekliyor.',
    highlights: ['Eski Şehir', 'Narikala Kalesi', 'Kükürt Hamamları', 'Rustaveli Caddesi', 'Şarap Mahzenleri'],
    bestTime: 'Mayıs-Haziran, Eylül-Ekim',
    duration: '2 saat',
  },
  'Bakü': {
    description: 'Modern gökdelenleri ve tarihi surlarıyla Bakü, Doğu ile Batının sentezini sunan dinamik bir Kafkas başkenti.',
    highlights: ['Flame Towers', 'İçeri Şeher', 'Haydar Aliyev Merkezi', 'Deniz Kenarı Bulvarı', 'Kız Kulesi'],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '2 saat 30 dk',
  },
  'Almatı': {
    description: 'Kazakistan\'ın eski başkenti Almatı, Tien Şan dağları manzarası, yeşil parkları ve Orta Asya modernizminin merkezi.',
    highlights: ['Zenkov Katedrali', 'Medeo Kayak Merkezi', 'Kok Tobe Tepesi', 'Merkez Çarşı', 'Panfilov Parkı'],
    bestTime: 'Mayıs-Eylül',
    duration: '4 saat 30 dk',
  },
  'Astana': {
    description: 'Kazakistan\'ın fütüristik başkenti Astana (Nur-Sultan), cesur mimarisi ve bozkır ortasındaki modern yapılarıyla şaşırtıyor.',
    highlights: ['Bayterek Kulesi', 'Han Şatır', 'Hazret Sultan Camii', 'Barış ve Uzlaşma Sarayı', 'Expo 2017 Alanı'],
    bestTime: 'Mayıs-Eylül',
    duration: '4 saat',
  },
  'Taşkent': {
    description: 'Özbekistan\'ın başkenti Taşkent, geniş bulvarları, metro sanatı ve İpek Yolu mirasıyla Orta Asya\'nın kapısı.',
    highlights: ['Hazrati Imam Kompleksi', 'Çorsu Çarşısı', 'Taşkent Metrosu', 'Amir Timur Meydanı', 'Televizyon Kulesi'],
    bestTime: 'Nisan-Haziran, Eylül-Ekim',
    duration: '4 saat 15 dk',
  },
  'Bişkek': {
    description: 'Kırgızistan\'ın başkenti Bişkek, Tien Şan dağlarının eteklerinde yeşil parkları ve göçebe kültürüyle büyülüyor.',
    highlights: ['Ala-Too Meydanı', 'Oş Pazarı', 'Ala Archa Milli Parkı', 'Issık Göl (günübirlik)', 'Frunze Müzesi'],
    bestTime: 'Mayıs-Eylül',
    duration: '4 saat 45 dk',
  },
  
  // === ORTA DOĞU ===
  'Dubai': {
    description: 'Modern mimarisi, lüks alışveriş merkezleri ve çöl safarileriyle Dubai, Doğu ile Batının buluştuğu göz kamaştırıcı bir metropol.',
    highlights: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Çöl Safari', 'Gold Souk'],
    bestTime: 'Kasım-Mart',
    duration: '4 saat 30 dk',
  },
  'Abu Dabi': {
    description: 'BAE\'nin başkenti Abu Dabi, muhteşem Şeyh Zayed Camii, Louvre müzesi ve lüks yaşam tarzıyla etkileyici.',
    highlights: ['Şeyh Zayed Camii', 'Louvre Abu Dabi', 'Ferrari World', 'Emirates Palace', 'Yas Adası'],
    bestTime: 'Kasım-Mart',
    duration: '4 saat 45 dk',
  },
  'Doha': {
    description: 'Katar\'ın başkenti Doha, ultra-modern mimarisi, İslam Sanatları Müzesi ve 2022 Dünya Kupası mirası ile yükselişte.',
    highlights: ['İslam Sanatları Müzesi', 'Souq Waqif', 'The Pearl', 'Katara Kültür Köyü', 'Corniche'],
    bestTime: 'Kasım-Mart',
    duration: '4 saat 15 dk',
  },
  'Amman': {
    description: 'Ürdün\'ün başkenti Amman, antik Roma kalıntıları, canlı pazarları ve Petra\'ya kapı olarak stratejik konumuyla çekici.',
    highlights: ['Citadel', 'Roma Tiyatrosu', 'Rainbow Street', 'Ürdün Müzesi', 'Petra (günlük tur)'],
    bestTime: 'Mart-Mayıs, Eylül-Kasım',
    duration: '2 saat 30 dk',
  },
  'Beyrut': {
    description: 'Lübnan\'ın başkenti Beyrut, Akdeniz mutfağı, tarihi mahalleleri ve dirençli ruhuyla Orta Doğu\'nun Paris\'i.',
    highlights: ['Hamra Caddesi', 'Raouche Kayalıkları', 'Ulusal Müze', 'Zeytin Dağı', 'Byblos Antik Kenti'],
    bestTime: 'Nisan-Haziran, Eylül-Kasım',
    duration: '2 saat',
  },
  'Bahreyn': {
    description: 'Körfez\'in küçük incisi Bahreyn, antik Dilmun medeniyeti, F1 pisti ve adaları keşfetmek için ideal.',
    highlights: ['Bahreyn Kalesi', 'Manama Souq', 'Al Fatih Camii', 'F1 Pisti', 'Tree of Life'],
    bestTime: 'Kasım-Mart',
    duration: '3 saat 30 dk',
  },
  'Maskat': {
    description: 'Umman\'ın başkenti Maskat, dramatik dağ manzaraları, geleneksel soukları ve Arap misafirperverliğiyle otantik.',
    highlights: ['Sultan Qaboos Camii', 'Mutrah Souq', 'Kraliyet Opera Evi', 'Bait Al Zubair Müzesi', 'Wadi Shab'],
    bestTime: 'Ekim-Mart',
    duration: '4 saat 30 dk',
  },
  'Kuveyt': {
    description: 'Körfez\'in petrol zengini Kuveyt, modern kuleleri, geleneksel pazarları ve çöl deneyimiyle ilgi çekici.',
    highlights: ['Kuveyt Kuleleri', 'Grand Mosque', 'Souq Al-Mubarakiya', 'Scientific Center', 'Failaka Adası'],
    bestTime: 'Kasım-Mart',
    duration: '3 saat 45 dk',
  },
  
  // === ASYA ===
  'Tokyo': {
    description: 'Geleneksel tapınakları ile ultra-modern teknolojinin iç içe geçtiği Tokyo, benzersiz bir kültürel deneyim sunuyor.',
    highlights: ['Senso-ji Tapınağı', 'Shibuya Kavşağı', 'Tokyo Kulesi', 'Harajuku', 'Tsukiji Balık Pazarı'],
    bestTime: 'Mart-Mayıs, Ekim-Kasım',
    duration: '11 saat',
  },
  'Osaka': {
    description: 'Japonya\'nın mutfak başkenti Osaka, sokak lezzetleri, eğlence parkları ve samimi atmosferiyle Tokyo\'ya alternatif.',
    highlights: ['Osaka Kalesi', 'Dotonbori', 'Universal Studios Japan', 'Shinsekai', 'Kuromon Pazarı'],
    bestTime: 'Mart-Mayıs, Ekim-Kasım',
    duration: '11 saat 30 dk',
  },
  'Seul': {
    description: 'K-pop ve geleneklerin buluştuğu Seul, sarayları, teknolojisi ve canlı gece hayatıyla Asya\'nın yükselen yıldızı.',
    highlights: ['Gyeongbokgung Sarayı', 'Bukchon Hanok Köyü', 'Myeongdong', 'Namsan Kulesi', 'Dongdaemun'],
    bestTime: 'Nisan-Mayıs, Eylül-Kasım',
    duration: '10 saat',
  },
  'Singapur': {
    description: 'Temizliği, düzeni ve çok kültürlü yapısıyla Singapur, Güneydoğu Asya\'nın parlayan yıldızı.',
    highlights: ['Marina Bay Sands', 'Gardens by the Bay', 'Sentosa Adası', 'Chinatown', 'Little India'],
    bestTime: 'Şubat-Nisan',
    duration: '10 saat 30 dk',
  },
  'Kuala Lumpur': {
    description: 'Malezya\'nın başkenti KL, ikonik ikiz kuleleri, çok kültürlü mutfağı ve tropik atmosferiyle büyülüyor.',
    highlights: ['Petronas İkiz Kuleleri', 'Batu Mağaraları', 'Central Market', 'Merdeka Meydanı', 'Bukit Bintang'],
    bestTime: 'Mart-Ekim',
    duration: '10 saat',
  },
  'Bangkok': {
    description: 'Altın tapınakları, sokak lezzetleri ve canlı gece hayatıyla Bangkok, Güneydoğu Asya\'nın nabzını tutuyor.',
    highlights: ['Grand Palace', 'Wat Arun', 'Chatuchak Pazarı', 'Khao San Road', 'Chao Phraya Nehri'],
    bestTime: 'Kasım-Şubat',
    duration: '9 saat',
  },
  'Bali': {
    description: 'Pirinç terasları, tapınakları ve muhteşem plajlarıyla Bali, huzur ve macera arayanların cennet adası.',
    highlights: ['Ubud Pirinç Terasları', 'Tanah Lot Tapınağı', 'Kuta Plajı', 'Maymun Ormanı', 'Uluwatu'],
    bestTime: 'Nisan-Ekim',
    duration: '12 saat',
  },
  'Cakarta': {
    description: 'Endonezya\'nın devasa başkenti Cakarta, çeşitli mahalleleri, alışveriş merkezleri ve ada turlarıyla keşfedilmeye değer.',
    highlights: ['Monas Anıtı', 'Kota Tua', 'Istiqlal Camii', 'Thousand Islands', 'Taman Mini'],
    bestTime: 'Mayıs-Eylül',
    duration: '11 saat',
  },
  'Manila': {
    description: 'Filipinler\'in kaotik başkenti Manila, İspanyol mirası, sıcak insanları ve tropik adaların kapısı olarak çekici.',
    highlights: ['Intramuros', 'Rizal Parkı', 'San Agustin Kilisesi', 'SM Mall of Asia', 'Makati'],
    bestTime: 'Kasım-Nisan',
    duration: '11 saat',
  },
  'Hong Kong': {
    description: 'Gökdelenler ile geleneksel tapınakların buluştuğu Hong Kong, alışveriş cenneti ve nefes kesen manzaralarıyla ikonik.',
    highlights: ['Victoria Peak', 'Star Ferry', 'Lan Kwai Fong', 'Tian Tan Buddha', 'Temple Street'],
    bestTime: 'Ekim-Aralık',
    duration: '10 saat 30 dk',
  },
  'Taipei': {
    description: 'Tayvan\'ın başkenti Taipei, gece pazarları, 101 kulesi ve sıcak kaynaklarıyla Asya\'nın gizli hazinesi.',
    highlights: ['Taipei 101', 'Shilin Gece Pazarı', 'Longshan Tapınağı', 'Beitou Sıcak Kaynakları', 'Jiufen'],
    bestTime: 'Mart-Mayıs, Eylül-Kasım',
    duration: '11 saat',
  },
  'Katmandu': {
    description: 'Nepal\'in başkenti Katmandu, Himalaya\'nın kapısında antik tapınakları ve spiritüel atmosferiyle büyülüyor.',
    highlights: ['Swayambhunath (Maymun Tapınağı)', 'Pashupatinath', 'Boudhanath Stupa', 'Durbar Meydanı', 'Thamel'],
    bestTime: 'Ekim-Kasım, Mart-Nisan',
    duration: '6 saat',
  },
  'Pekin': {
    description: 'Çin\'in kadim başkenti Pekin, Yasak Şehir, Çin Seddi ve imparatorluk mirası ile tarih tutkunlarının vazgeçilmezi.',
    highlights: ['Yasak Şehir', 'Çin Seddi', 'Tiananmen Meydanı', 'Yaz Sarayı', 'Hutong Mahalleleri'],
    bestTime: 'Nisan-Mayıs, Eylül-Ekim',
    duration: '9 saat',
  },
  'Şanghay': {
    description: 'Çin\'in modern yüzü Şanghay, Art Deco mimarisi, fütüristik gökdelenleri ve canlı ticaretiyle Asya\'nın New York\'u.',
    highlights: ['The Bund', 'Pudong Skyline', 'Yu Garden', 'Nanjing Road', 'Zhujiajiao Su Kasabası'],
    bestTime: 'Nisan-Mayıs, Eylül-Ekim',
    duration: '10 saat',
  },
  'Delhi': {
    description: 'Hindistan\'ın başkenti Delhi, Mughal imparatorluğu mirası, kaotik sokakları ve baharatlı mutfağıyla sarsıcı.',
    highlights: ['Kızıl Kale', 'Qutub Minar', 'Lotus Temple', 'Humayun Türbesi', 'Chandni Chowk'],
    bestTime: 'Ekim-Mart',
    duration: '6 saat',
  },
  'Mumbai': {
    description: 'Bollywood\'un kalbi Mumbai, Gateway of India, çeşitli mahalleleri ve Hindistan\'ın ekonomik motoruyla hareketli.',
    highlights: ['Gateway of India', 'Marine Drive', 'Elephanta Mağaraları', 'Dharavi', 'Chhatrapati Shivaji Terminali'],
    bestTime: 'Kasım-Şubat',
    duration: '6 saat 30 dk',
  },
  
  // === AFRİKA ===
  'Tunus': {
    description: 'Akdeniz ve çöl kültürünün buluştuğu Tunus, antik Kartaca, medina sokakları ve sahil resoortlarıyla çeşitli.',
    highlights: ['Kartaca Antik Kenti', 'Tunus Medina', 'Bardo Müzesi', 'Sidi Bou Said', 'El Jem Amfitiyatrosu'],
    bestTime: 'Nisan-Haziran, Eylül-Kasım',
    duration: '2 saat 30 dk',
  },
  'Kazablanka': {
    description: 'Fas\'ın en büyük şehri Kazablanka, muhteşem Hassan II Camii, Art Deco mimarisi ve Atlantik sahiliyle modern.',
    highlights: ['Hassan II Camii', 'Corniche', 'Eski Medina', 'Morocco Mall', 'Rick\'s Cafe'],
    bestTime: 'Nisan-Haziran, Eylül-Kasım',
    duration: '4 saat',
  },
  'Marakeş': {
    description: 'Fas\'ın kırmızı şehri Marakeş, Jemaa el-Fna meydanı, büyülü soukları ve Berberi kültürüyle otantik.',
    highlights: ['Jemaa el-Fna', 'Majorelle Bahçesi', 'Bahia Sarayı', 'Souklar', 'Koutoubia Camii'],
    bestTime: 'Mart-Mayıs, Eylül-Kasım',
    duration: '4 saat 15 dk',
  },
  'Cape Town': {
    description: 'Güney Afrika\'nın mücevheri Cape Town, Table Mountain, şarap bağları ve muhteşem sahilleriyle nefes kesici.',
    highlights: ['Table Mountain', 'V&A Waterfront', 'Robben Adası', 'Cape Point', 'Camps Bay'],
    bestTime: 'Kasım-Mart',
    duration: '12 saat',
  },
  'Johannesburg': {
    description: 'Güney Afrika\'nın ekonomik merkezi Johannesburg, Apartheid tarihi, sanat galerileri ve safari turlarının kapısı.',
    highlights: ['Apartheid Müzesi', 'Constitution Hill', 'Maboneng', 'Gold Reef City', 'Lion & Safari Park'],
    bestTime: 'Mayıs-Eylül',
    duration: '11 saat',
  },
  'Nairobi': {
    description: 'Kenya\'nın başkenti Nairobi, dünyaca ünlü safari parkları, fil yetimhanesi ve Afrika\'nın yaban hayatının kapısı.',
    highlights: ['Nairobi Ulusal Parkı', 'David Sheldrick Fil Yetimhanesi', 'Karen Blixen Müzesi', 'Giraffe Centre', 'Maasai Market'],
    bestTime: 'Haziran-Ekim, Ocak-Şubat',
    duration: '7 saat',
  },
  'Zanzibar': {
    description: 'Hint Okyanusu\'nun baharat adası Zanzibar, turkuaz suları, tarihi Stone Town\'ı ve tropikal cennetiyle büyüleyici.',
    highlights: ['Stone Town', 'Nungwi Plajı', 'Prison Island', 'Jozani Ormanı', 'Baharat Turu'],
    bestTime: 'Haziran-Ekim, Aralık-Şubat',
    duration: '8 saat',
  },
  'Darüsselam': {
    description: 'Tanzanya\'nın en büyük şehri Darüsselam, Zanzibar\'a feribot bağlantısı, canlı pazarları ve Swahili kültürüyle ilgi çekici.',
    highlights: ['Kariakoo Pazarı', 'Village Museum', 'Coco Beach', 'Askari Anıtı', 'Zanzibar Feribotu'],
    bestTime: 'Haziran-Ekim',
    duration: '7 saat 30 dk',
  },
  
  // === AMERİKA ===
  'New York': {
    description: 'Dünyanın kültür ve finans başkenti New York, Times Square, Broadway ve ikonik skyline\'ıyla rüya şehri.',
    highlights: ['Times Square', 'Central Park', 'Özgürlük Heykeli', 'Empire State Building', 'Brooklyn Köprüsü'],
    bestTime: 'Nisan-Haziran, Eylül-Kasım',
    duration: '10 saat',
  },
  'Los Angeles': {
    description: 'Hollywood\'un evi Los Angeles, yıldızlar, plajlar ve çeşitli mahalleleriyle Amerikan rüyasının sembolü.',
    highlights: ['Hollywood Sign', 'Santa Monica', 'Walk of Fame', 'Universal Studios', 'Venice Beach'],
    bestTime: 'Yıl boyu',
    duration: '13 saat',
  },
  'Chicago': {
    description: 'Rüzgarlı şehir Chicago, çığır açan mimarisi, blues müziği ve derin pizza lezzetiyle Midwest\'in gururu.',
    highlights: ['Millennium Park', 'Willis Tower', 'Navy Pier', 'Art Institute', 'Magnificent Mile'],
    bestTime: 'Mayıs-Ekim',
    duration: '11 saat',
  },
  'Miami': {
    description: 'Florida\'nın tropikal cenneti Miami, Art Deco mimarisi, Latin kültürü ve beyaz kumlu plajlarıyla tatil cenneti.',
    highlights: ['South Beach', 'Art Deco District', 'Little Havana', 'Wynwood', 'Vizcaya Museum'],
    bestTime: 'Kasım-Nisan',
    duration: '12 saat',
  },
  'San Francisco': {
    description: 'Golden Gate\'in şehri San Francisco, viktoryen evleri, teknoloji kültürü ve eşsiz tepeleriyle ikonik.',
    highlights: ['Golden Gate Köprüsü', 'Alcatraz', 'Fisherman\'s Wharf', 'Chinatown', 'Cable Cars'],
    bestTime: 'Eylül-Kasım',
    duration: '13 saat',
  },
  'Toronto': {
    description: 'Kanada\'nın en büyük şehri Toronto, CN Kulesi, çok kültürlü mahalleleri ve Niagara Şelalesi\'ne yakınlığıyla çekici.',
    highlights: ['CN Kulesi', 'Niagara Şelalesi', 'Distillery District', 'St. Lawrence Market', 'Toronto Adaları'],
    bestTime: 'Mayıs-Ekim',
    duration: '10 saat',
  },
  'Vancouver': {
    description: 'Dağlar ve okyanus arasında kurulan Vancouver, doğa sporları, Stanley Park ve yaşam kalitesiyle Kanada\'nın incisi.',
    highlights: ['Stanley Park', 'Grouse Mountain', 'Granville Island', 'Gastown', 'Capilano Asma Köprüsü'],
    bestTime: 'Haziran-Eylül',
    duration: '12 saat',
  },
  'Montreal': {
    description: 'Fransız kültürünün Kuzey Amerika\'daki kalesi Montreal, tarihi mimarisi, canlı festivalleri ve leziz mutfağıyla büyüleyici.',
    highlights: ['Old Montreal', 'Notre-Dame Basilica', 'Mount Royal', 'Plateau Mont-Royal', 'Jean-Talon Market'],
    bestTime: 'Mayıs-Ekim',
    duration: '9 saat 30 dk',
  },
  'Sao Paulo': {
    description: 'Güney Amerika\'nın en büyük şehri Sao Paulo, kültür sahnesi, gastronomi ve kentsel enerjisiyle Brezilya\'nın kalbi.',
    highlights: ['Paulista Caddesi', 'Ibirapuera Parkı', 'MASP', 'Pinacoteca', 'Vila Madalena'],
    bestTime: 'Nisan-Kasım',
    duration: '12 saat',
  },
  'Rio de Janeiro': {
    description: 'Karnaval, samba ve Kurtarıcı İsa\'nın şehri Rio, Copacabana plajları ve dramatik manzarasıyla dünyanın en güzel şehirlerinden.',
    highlights: ['Kurtarıcı İsa Heykeli', 'Şeker Kamışı Dağı', 'Copacabana', 'Ipanema', 'Maracana Stadyumu'],
    bestTime: 'Mayıs-Ekim',
    duration: '13 saat',
  },
  'Buenos Aires': {
    description: 'Tango\'nun doğduğu Buenos Aires, Avrupa mimarisi, biftek kültürü ve Latin tutkusuyla Güney Amerika\'nın Paris\'i.',
    highlights: ['Plaza de Mayo', 'La Boca', 'San Telmo', 'Recoleta Mezarlığı', 'Teatro Colón'],
    bestTime: 'Mart-Mayıs, Eylül-Kasım',
    duration: '14 saat',
  },
  'Santiago': {
    description: 'And Dağları\'nın eteklerinde Santiago, şarap bölgeleri, kayak merkezleri ve modern Şili kültürüyle çeşitli.',
    highlights: ['San Cristobal Tepesi', 'Plaza de Armas', 'La Chascona', 'Mercado Central', 'Şarap Turları'],
    bestTime: 'Ekim-Nisan',
    duration: '15 saat',
  },
  'Bogota': {
    description: 'Kolombiya\'nın dağ başkenti Bogota, grafiti sanatı, kahve kültürü ve yeniden doğan turizmiyle şaşırtıcı.',
    highlights: ['La Candelaria', 'Monserrate Dağı', 'Altın Müzesi', 'Usaquen Pazar', 'Graffiti Turu'],
    bestTime: 'Aralık-Mart',
    duration: '11 saat',
  },
  'Lima': {
    description: 'Peru\'nun başkenti Lima, dünyaca ünlü gastronomisi, sömürge mimarisi ve Machu Picchu\'ya kapı olarak stratejik.',
    highlights: ['Miraflores', 'Plaza de Armas', 'Larco Müzesi', 'Barranco', 'Ceviche Deneyimi'],
    bestTime: 'Aralık-Nisan',
    duration: '12 saat',
  },
  'Havana': {
    description: 'Zamanda donmuş şehir Havana, vintage arabalar, renkli binalar ve salsa ritmiyle Karayip\'in kalbi.',
    highlights: ['Havana Vieja', 'Malecon', 'El Capitolio', 'Plaza de la Revolución', 'Fusterlandia'],
    bestTime: 'Kasım-Nisan',
    duration: '3 saat',
  },
  
  // === OKYANUSYA ===
  'Sidney': {
    description: 'Avustralya\'nın simgesi Sidney, Opera Binası, Harbour Bridge ve muhteşem plajlarıyla dünyanın en yaşanabilir şehirlerinden.',
    highlights: ['Opera Binası', 'Harbour Bridge', 'Bondi Beach', 'Darling Harbour', 'The Rocks'],
    bestTime: 'Eylül-Kasım, Mart-Mayıs',
    duration: '17 saat',
  },
  'Melbourne': {
    description: 'Avustralya\'nın kültür başkenti Melbourne, sokak sanatı, kahve kültürü ve spor etkinlikleriyle cool ve yaratıcı.',
    highlights: ['Federation Square', 'Hosier Lane', 'Queen Victoria Market', 'St Kilda', 'Great Ocean Road'],
    bestTime: 'Mart-Mayıs, Eylül-Kasım',
    duration: '18 saat',
  },
  'Auckland': {
    description: 'Yeni Zelanda\'nın en büyük şehri Auckland, volkanik adaları, yelken kültürü ve Maori mirası ile doğa cenneti.',
    highlights: ['Sky Tower', 'Waiheke Adası', 'Mount Eden', 'Viaduct Harbour', 'Rangitoto Adası'],
    bestTime: 'Kasım-Nisan',
    duration: '20 saat',
  },
  
  // === DİĞER ===
  'Moskova': {
    description: 'Rusya\'nın dev başkenti Moskova, Kremlin, Kızıl Meydan ve görkemli metro istasyonlarıyla imparatorluk ihtişamını yansıtıyor.',
    highlights: ['Kızıl Meydan', 'Kremlin', 'St. Basil Katedrali', 'Bolşoy Tiyatrosu', 'GUM Alışveriş Merkezi'],
    bestTime: 'Mayıs-Eylül',
    duration: '3 saat',
  },
  'St. Petersburg': {
    description: 'Rusya\'nın kültür başkenti St. Petersburg, Hermitage Müzesi, beyaz geceler ve çarlık saraylarıyla büyüleyici.',
    highlights: ['Hermitage Müzesi', 'Church of Spilled Blood', 'Peterhof Sarayı', 'Nevsky Prospect', 'Yaz Bahçesi'],
    bestTime: 'Mayıs-Eylül',
    duration: '3 saat 30 dk',
  },
  'Ercan': {
    description: 'Kuzey Kıbrıs\'ın kapısı Ercan, tarihi Lefkoşa, muhteşem plajları ve Türk misafirperverliğiyle yakın bir tatil cenneti.',
    highlights: ['Girne Kalesi', 'Bellapais Manastırı', 'St. Hilarion Kalesi', 'Salamis Antik Kenti', 'Karpaz Yarımadası'],
    bestTime: 'Nisan-Kasım',
    duration: '1 saat 15 dk',
  },
};

// Default descriptions for cities without specific content
const DEFAULT_DESCRIPTION = {
  description: 'Keşfedilmeyi bekleyen harika bir destinasyon. Hafta sonu kaçamağı için ideal.',
  highlights: ['Şehir Merkezi', 'Yerel Mutfak', 'Tarihi Yerler', 'Alışveriş'],
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
