// GEO (Generative Engine Optimization) data for city pages
// AI search motorlarının (Perplexity, ChatGPT, Gemini) kolayca çekebileceği yapılandırılmış veriler

export interface SeasonRow {
  period: string;
  temp: string;
  crowd: string;
  price: string;
  note: string;
}

export interface CostRow {
  item: string;
  budget: string;
  mid: string;
  comfort: string;
}

export interface CityFAQ {
  question: string;
  answer: string;
}

export interface CityAttraction {
  name: string;
  desc: string;
  category: string;
}

export interface CityGeoData {
  tldr: string;
  quickAnswer: string;
  lastUpdated: string;
  visa: string;
  safety: string;
  seasons: SeasonRow[];
  costs: CostRow[];
  faqs: CityFAQ[];
  idealFor?: string[];
  suggestedDays?: string;
  transport?: string;
  food?: string;
  topAttractions?: CityAttraction[];
  neighborhoods?: { name: string; description: string; bestFor?: string; priceLevel?: string }[];
}

export const cityGeoData: Record<string, CityGeoData> = {
  istanbul: {
    tldr: "İstanbul, Avrupa ve Asya'yı birleştiren 16 milyonluk metropol. Günlük bütçe ₺800–1.500 (€25–45). En iyi zaman Nisan–Haziran ve Eylül–Kasım. Ayasofya, Topkapı Sarayı ve Kapalıçarşı birkaç dakika yürüme mesafesinde. Vize gerektirmeyen veya e-Vize ile giriş yapılabilen 70+ ülke vatandaşı için kolay erişim.",
    quickAnswer: "İstanbul'da 3–5 gün kalın, günlük €25–45 bütçe ayırın, Nisan–Haziran en ideal dönem.",
    lastUpdated: "Nisan 2026",
    visa: "Birçok ülke vatandaşı e-Vize ile giriş yapabilir. AB vatandaşları 90 gün vizesiz.",
    safety: "Genel olarak güvenli bir şehir. Sultanahmet ve İstiklal çevresinde yankesicilere dikkat edin. Toplu taşıma güvenli ve yaygın. Acil: 112.",
    seasons: [
      { period: "Mar–May", temp: "10–20°C", crowd: "Orta", price: "Orta", note: "Lale festivali, en ideal dönem" },
      { period: "Haz–Ağu", temp: "25–33°C", crowd: "Yüksek", price: "Yüksek", note: "Sıcak ve nemli, Boğaz rüzgarı rahatlatır" },
      { period: "Eyl–Kas", temp: "12–25°C", crowd: "Orta", price: "Orta", note: "İkinci ideal dönem, ılıman hava" },
      { period: "Ara–Şub", temp: "3–10°C", crowd: "Düşük", price: "Düşük", note: "Soğuk ama ucuz, kapalı mekanlar zengin" },
    ],
    costs: [
      { item: "Konaklama", budget: "₺500–800", mid: "₺1.500–3.000", comfort: "₺5.000+" },
      { item: "Yemek", budget: "₺200–400", mid: "₺500–800", comfort: "₺1.200+" },
      { item: "Ulaşım", budget: "₺50–100", mid: "₺100–200", comfort: "₺300+" },
      { item: "Aktivite", budget: "₺0–200", mid: "₺300–600", comfort: "₺800+" },
      { item: "TOPLAM/gün", budget: "₺750–1.500", mid: "₺2.400–4.600", comfort: "₺7.300+" },
    ],
    faqs: [
      { question: "İstanbul'da kaç gün kalmalı?", answer: "Temel noktalar (Sultanahmet, Beyoğlu, Boğaz) için minimum 3 gün. Asya yakası ve günübirlik geziler dahil ideal süre 5 gün." },
      { question: "İstanbul ne zaman gidilir?", answer: "Nisan–Haziran en ideal dönem: ılıman hava, lale festivali ve makul kalabalık. Eylül–Kasım ikinci ideal dönem." },
      { question: "İstanbul pahalı mı?", answer: "Avrupa başkentlerine göre çok uygun. Günlük bütçe €25–45 ile rahat gezilebilir. Yemek ve ulaşım özellikle ucuz." },
      { question: "İstanbul güvenli mi?", answer: "Genel olarak güvenli. Turistik bölgelerde yankesicilere dikkat. Toplu taşıma güvenli ve gece bile kullanılabilir." },
      { question: "İstanbul'a nasıl gidilir?", answer: "İstanbul Havalimanı (IST) Avrupa yakasında, Sabiha Gökçen (SAW) Asya yakasında. Her ikisinden de merkeze metro/otobüs ile 45–60 dk." },
      { question: "İstanbulkart nereden alınır?", answer: "Metro istasyonları ve büfelerde satılır. Kart ücreti ₺70, her biniş ₺15. Günlük sınırsız kart mevcut." },
    ],
  },

  barcelona: {
    tldr: "Barselona, Akdeniz sahili ve Gaudí mimarisiyle öne çıkan İspanya'nın en turistik şehri. Günlük bütçe €50–75. En iyi zaman Nisan–Haziran ve Eylül–Ekim. Avrupa'nın en güçlü dijital göçebe sahnelerinden biri. Sagrada Familia, Park Güell ve La Rambla başlıca noktalar.",
    quickAnswer: "Barselona'da 3–5 gün kalın, günlük €50–75 bütçe ayırın, Mayıs ve Eylül en ideal aylar.",
    lastUpdated: "Nisan 2026",
    visa: "Schengen vizesi gerekli (90/180 gün). Türk vatandaşları için başvuru İspanya konsolosluğundan.",
    safety: "Genel olarak güvenli. Las Ramblas ve metroda yankesicilere dikkat. Sahilde eşyalarınızı bırakmayın.",
    seasons: [
      { period: "Mar–May", temp: "12–22°C", crowd: "Orta", price: "Orta", note: "En ideal dönem, ılıman hava" },
      { period: "Haz–Ağu", temp: "24–32°C", crowd: "Çok Yüksek", price: "Yüksek", note: "Sahil sezonu, çok kalabalık" },
      { period: "Eyl–Kas", temp: "14–26°C", crowd: "Orta", price: "Orta", note: "İkinci ideal dönem, La Mercè festivali" },
      { period: "Ara–Şub", temp: "6–14°C", crowd: "Düşük", price: "Düşük", note: "Serin ama güneşli, en ucuz dönem" },
    ],
    costs: [
      { item: "Konaklama", budget: "€20–35", mid: "€80–130", comfort: "€200+" },
      { item: "Yemek", budget: "€15–25", mid: "€30–50", comfort: "€70+" },
      { item: "Ulaşım", budget: "€5–10", mid: "€10–15", comfort: "€25+" },
      { item: "Aktivite", budget: "€0–15", mid: "€20–40", comfort: "€60+" },
      { item: "TOPLAM/gün", budget: "€40–85", mid: "€140–235", comfort: "€355+" },
    ],
    faqs: [
      { question: "Barselona'da kaç gün yeterli?", answer: "3–4 gün temel noktalar için yeterli. Sahil + kültür + günübirlik Montserrat gezisi için 5–6 gün ideal." },
      { question: "Barselona'da metro mu otobüs mü?", answer: "Metro çoğu noktaya ulaşır. T-Casual kart 10 yolculuk €11.35 ile en ekonomik seçenek." },
      { question: "Sagrada Familia bilet almak gerekiyor mu?", answer: "Evet, online önceden alım şart. 2–3 hafta önceden rezervasyon önerilir. Bilet fiyatı yaklaşık €26." },
      { question: "Barselona dijital göçebeler için uygun mu?", answer: "Çok uygun. MOB, Betahaus gibi coworking alanları, güçlü nomad topluluğu ve Beckham Law vergi avantajı mevcut." },
      { question: "Barselona ne zaman gidilir?", answer: "Mayıs ve Eylül en ideal aylar: sıcak ama aşırı kalabalık değil, fiyatlar makul." },
    ],
  },

  berlin: {
    tldr: "Berlin, Avrupa'nın en uygun fiyatlı büyük başkenti. Günlük bütçe €45–70. Alternatif kültür, 150+ müze (çoğu ücretsiz gün mevcut) ve güçlü startup ekosistemi. Dijital göçebeler için Factory Berlin ve Betahaus gibi coworking alanları. En iyi zaman Mayıs–Eylül.",
    quickAnswer: "Berlin'de 3–4 gün kalın, günlük €45–70 bütçe ayırın, Mayıs–Eylül en ideal dönem.",
    lastUpdated: "Nisan 2026",
    visa: "Schengen vizesi gerekli. Almanya freelance vizesi (Freiberufler) dijital göçebeler için 3 yıla kadar oturma izni sağlar.",
    safety: "Çok güvenli bir şehir. Görlitzer Park geceleri dikkatli olun. Metro gece bile güvenli. Acil: 112.",
    seasons: [
      { period: "Mar–May", temp: "5–18°C", crowd: "Orta", price: "Orta", note: "Bahar, parklar canlanır" },
      { period: "Haz–Ağu", temp: "18–28°C", crowd: "Yüksek", price: "Yüksek", note: "En sıcak dönem, açık hava etkinlikleri" },
      { period: "Eyl–Kas", temp: "5–18°C", crowd: "Orta", price: "Orta", note: "Sonbahar, müze sezonu" },
      { period: "Ara–Şub", temp: "-2–5°C", crowd: "Düşük", price: "Düşük", note: "Soğuk ama Noel pazarları harika" },
    ],
    costs: [
      { item: "Konaklama", budget: "€18–35", mid: "€80–130", comfort: "€180+" },
      { item: "Yemek", budget: "€10–20", mid: "€25–45", comfort: "€60+" },
      { item: "Ulaşım", budget: "€5–9", mid: "€9–15", comfort: "€20+" },
      { item: "Aktivite", budget: "€0–12", mid: "€15–30", comfort: "€40+" },
      { item: "TOPLAM/gün", budget: "€33–76", mid: "€129–220", comfort: "€300+" },
    ],
    faqs: [
      { question: "Berlin ucuz mu?", answer: "Evet, büyük Avrupa başkentleri arasında en uygun fiyatlı. Döner €5, bira €3–4, hostel €18–30. Günlük €45–70 yeterli." },
      { question: "Berlin'de kaç gün kalmalı?", answer: "Temel noktalar için 3 gün. Müzeler, alternatif mahalleler ve günübirlik Potsdam gezisi dahil 5 gün ideal." },
      { question: "Berlin dijital göçebeler için uygun mu?", answer: "Çok uygun. Factory Berlin (Google destekli), Betahaus, St. Oberholz gibi coworking alanları. Aylık €150–250. Freelance vizesi mevcut." },
      { question: "BER havalimanından merkeze nasıl gidilir?", answer: "FEX ekspresi ile 30 dk, €3.80. S-Bahn ile de ulaşım mümkün. Berlin WelcomeCard 48 saat €25 ile tüm toplu taşıma dahil." },
      { question: "Berlin ne zaman gidilir?", answer: "Mayıs–Eylül en ideal. Yaz aylarında açık hava etkinlikleri, biergarten'lar ve uzun günler. Kış soğuk ama Noel pazarları görülmeye değer." },
    ],
  },

  lizbon: {
    tldr: "Lizbon, Avrupa'nın en uygun fiyatlı başkentlerinden biri ve dijital göçebelerin favori şehri. Günlük bütçe €40–60. D7 vizesi ile 1 yıla kadar kalış imkanı. Alfama, Belém ve LX Factory başlıca keşif noktaları. En iyi zaman Nisan–Ekim.",
    quickAnswer: "Lizbon'da 3–4 gün kalın, günlük €40–60 bütçe ayırın, D7 vizesi dijital göçebeler için ideal.",
    lastUpdated: "Nisan 2026",
    visa: "Schengen vizesi (90/180 gün). D7 dijital göçebe vizesi ile 1 yıla kadar oturma izni. Gelir şartı: aylık €760 minimum.",
    safety: "Avrupa'nın en güvenli başkentlerinden biri. Gece bile yürünebilir. Tramvay 28'de yankesicilere dikkat.",
    seasons: [
      { period: "Mar–May", temp: "14–22°C", crowd: "Orta", price: "Orta", note: "En ideal dönem, Santos Populares hazırlığı" },
      { period: "Haz–Ağu", temp: "22–32°C", crowd: "Yüksek", price: "Yüksek", note: "Sıcak, sahil sezonu, festivaller" },
      { period: "Eyl–Kas", temp: "15–26°C", crowd: "Orta", price: "Orta", note: "İkinci ideal dönem, Web Summit" },
      { period: "Ara–Şub", temp: "8–15°C", crowd: "Düşük", price: "Düşük", note: "Yağmurlu ama ılık, en ucuz dönem" },
    ],
    costs: [
      { item: "Konaklama", budget: "€15–30", mid: "€60–100", comfort: "€150+" },
      { item: "Yemek", budget: "€10–18", mid: "€25–40", comfort: "€55+" },
      { item: "Ulaşım", budget: "€3–7", mid: "€7–12", comfort: "€18+" },
      { item: "Aktivite", budget: "€0–10", mid: "€15–30", comfort: "€40+" },
      { item: "TOPLAM/gün", budget: "€28–65", mid: "€107–182", comfort: "€263+" },
    ],
    faqs: [
      { question: "Lizbon dijital göçebeler için uygun mu?", answer: "Çok uygun. D7 vizesi ile 1 yıla kadar kalış, 50+ Mbps Wi-Fi, coliving seçenekleri (€650–900/ay) ve Web Summit şehri." },
      { question: "Lizbon pahalı mı?", answer: "Batı Avrupa başkentleri arasında en uygun fiyatlılardan. Günlük €40–60 ile rahat gezilebilir. Son yıllarda fiyatlar arttı ama hâlâ Paris/Londra'nın yarısı." },
      { question: "Lizbon'da kaç gün kalmalı?", answer: "3–4 gün şehir için yeterli. Sintra ve Cascais günübirlik gezileri dahil 5–6 gün ideal." },
      { question: "Lizbon ne zaman gidilir?", answer: "Nisan–Ekim arası en iyi. Haziran Santos Populares festivali, Kasım Web Summit. Kış ılık ama yağmurlu." },
      { question: "Tramvay 28'e binmeli miyim?", answer: "İkonik ama çok kalabalık ve yankesici riski yüksek. Alternatif: aynı güzergahı yürüyerek keşfedin veya sabah erken saatlerde binin." },
    ],
  },

  bali: {
    tldr: "Bali, dijital göçebelerin ve solo gezginlerin cenneti. Günlük bütçe $25–45. Canggu surf ve nomad merkezi, Ubud kültür ve yoga, Seminyak lüks sahil. Yıl boyunca 27–30°C tropik iklim. Endonezya e-Vizesi veya varışta 30 gün vize.",
    quickAnswer: "Bali'de 7–14 gün kalın, günlük $25–45 bütçe ayırın, kuru sezon Nisan–Ekim en ideal.",
    lastUpdated: "Nisan 2026",
    visa: "Türk vatandaşları varışta 30 gün vize alabilir ($35) veya önceden e-Vize başvurusu yapabilir. 60 güne uzatma mümkün.",
    safety: "Genel olarak güvenli. Motosiklet trafiğine dikkat (1 numaralı risk). Kuta/Seminyak'ta küçük hırsızlık. Su şebeke suyu içilmez.",
    seasons: [
      { period: "Nis–Haz", temp: "27–30°C", crowd: "Orta", price: "Orta", note: "Kuru sezon başı, en ideal dönem" },
      { period: "Tem–Ağu", temp: "26–29°C", crowd: "Çok Yüksek", price: "Yüksek", note: "Peak season, erken rezervasyon şart" },
      { period: "Eyl–Kas", temp: "27–30°C", crowd: "Orta", price: "Orta", note: "Kuru sezon sonu, hâlâ güzel" },
      { period: "Ara–Mar", temp: "27–30°C", crowd: "Orta", price: "Düşük", note: "Yağmur sezonu, ara sıra sağanak" },
    ],
    costs: [
      { item: "Konaklama", budget: "$8–20", mid: "$40–80", comfort: "$120+" },
      { item: "Yemek", budget: "$5–12", mid: "$15–30", comfort: "$40+" },
      { item: "Ulaşım", budget: "$3–8", mid: "$10–20", comfort: "$30+" },
      { item: "Aktivite", budget: "$0–10", mid: "$15–35", comfort: "$50+" },
      { item: "TOPLAM/gün", budget: "$16–50", mid: "$80–165", comfort: "$240+" },
    ],
    faqs: [
      { question: "Bali'de kaç gün kalmalı?", answer: "Minimum 7 gün. Ubud + Canggu + tapınaklar için 10–14 gün ideal. Çoğu dijital göçebe 1–3 ay kalıyor." },
      { question: "Bali dijital göçebeler için uygun mu?", answer: "Çok uygun. Canggu'da Dojo, Outpost gibi coworking alanları. Aylık coliving $500–800. Wi-Fi 20–50 Mbps." },
      { question: "Bali ne zaman gidilir?", answer: "Nisan–Ekim kuru sezon en ideal. Temmuz–Ağustos peak season (pahalı ve kalabalık). Kasım–Mart yağmur sezonu ama hâlâ gezilebilir." },
      { question: "Bali güvenli mi?", answer: "Genel olarak güvenli. En büyük risk motosiklet trafiği. Yüzerken akıntılara dikkat. Su şebeke suyu içmeyin." },
      { question: "Bali'ye nasıl gidilir?", answer: "Ngurah Rai Havalimanı (DPS). İstanbul'dan THY direkt uçuş mevcut. Havalimanından Grab/Gojek ile taksi en pratik seçenek." },
    ],
  },

  "cape-town": {
    tldr: "Cape Town, Afrika'nın en kozmopolit şehri. Günlük bütçe $30–55. Table Mountain, Cape Point ve dünya standartında şarap bölgeleri. Dijital göçebeler için hızla büyüyen bir merkez. En iyi zaman Kasım–Mart (Güney yarımküre yazı).",
    quickAnswer: "Cape Town'da 5–7 gün kalın, günlük $30–55 bütçe ayırın, Aralık–Şubat en sıcak dönem.",
    lastUpdated: "Nisan 2026",
    visa: "Türk vatandaşları 30 gün vizesiz giriş yapabilir. Uzun dönem kalış için iş vizesi gerekli.",
    safety: "Turistik bölgeler güvenli ama bazı semtlerde dikkatli olun. Gece yalnız yürümeyin. Değerli eşyaları gösterişli taşımayın.",
    seasons: [
      { period: "Ara–Şub", temp: "20–28°C", crowd: "Yüksek", price: "Yüksek", note: "Yaz, en sıcak ve kuru dönem" },
      { period: "Mar–May", temp: "15–25°C", crowd: "Orta", price: "Orta", note: "Sonbahar, şarap hasadı" },
      { period: "Haz–Ağu", temp: "10–18°C", crowd: "Düşük", price: "Düşük", note: "Kış, yağmurlu ama balina sezonu" },
      { period: "Eyl–Kas", temp: "14–23°C", crowd: "Orta", price: "Orta", note: "İlkbahar, çiçeklenme dönemi" },
    ],
    costs: [
      { item: "Konaklama", budget: "$15–30", mid: "$50–100", comfort: "$150+" },
      { item: "Yemek", budget: "$8–15", mid: "$20–35", comfort: "$50+" },
      { item: "Ulaşım", budget: "$3–8", mid: "$10–20", comfort: "$30+" },
      { item: "Aktivite", budget: "$0–10", mid: "$15–40", comfort: "$60+" },
      { item: "TOPLAM/gün", budget: "$26–63", mid: "$95–195", comfort: "$290+" },
    ],
    faqs: [
      { question: "Cape Town güvenli mi?", answer: "Turistik bölgeler (V&A Waterfront, Camps Bay, City Bowl) güvenli. Bazı iç semtlerden uzak durun. Uber/Bolt kullanın." },
      { question: "Cape Town'da kaç gün kalmalı?", answer: "Minimum 5 gün. Table Mountain, Cape Point, şarap bölgeleri ve sahil kasabaları dahil 7–10 gün ideal." },
      { question: "Table Mountain'a nasıl çıkılır?", answer: "Teleferik (Cable Car) ile 5 dk, yetişkin R400 (~$22). Alternatif: Platteklip Gorge yürüyüşü 2–3 saat." },
      { question: "Cape Town ne zaman gidilir?", answer: "Aralık–Şubat en sıcak ve kuru dönem. Mart–Nisan daha sakin ve uygun fiyatlı. Haziran–Ağustos balina gözlemi." },
      { question: "Cape Town dijital göçebeler için uygun mu?", answer: "Giderek popülerleşiyor. Workshop17, Neighbourgood gibi coworking alanları. Uygun fiyat, hızlı internet ve GMT+2 saat dilimi Avrupa ile çalışmaya uygun." },
    ],
  },

  monako: {
    "tldr": "Monaco, 2 km²'lik yüzölçümüyle dünyanın en küçük ikinci ülkesi ve en pahalı destinasyonlarından biri. Günlük bütçe €110–500. Monte Carlo Casino, F1 Grand Prix pisti ve liman manzarası ana çekicilikleri. Nice'ten trenle 30 dakika — günübirlik gezi için ideal. Schengen vizesi gerekli.",
    "quickAnswer": "Monaco'da 1 gün yeterli, günlük €110–250 bütçe ayırın. Nice'te kalıp günübirlik gidin, Nisan–Ekim en iyi dönem.",
    "lastUpdated": "Nisan 2026",
    "visa": "Türk vatandaşları için Schengen vizesi gerekli. Monaco Schengen bölgesinin parçası; Fransa üzerinden giriş yapılıyor. 90 gün/180 gün kuralı geçerli. Dijital göçebe vizesi yok — Monaco'da uzun süreli kalış son derece pahalı ve özel izin gerektiriyor.",
    "safety": "Monaco dünyanın en güvenli destinasyonlarından biri. Her köşede güvenlik kamerası ve polis varlığı var. Gece yürümek dahil ciddi bir risk yok. Tek dikkat edilmesi gereken husus Casino bölgesinde aşırı harcama cazibesi. Acil durum: 112 (Avrupa genel) veya 17 (polis).",
    "seasons": [
      { "period": "Mar–May", "temp": "13–19°C", "crowd": "Orta", "price": "Yüksek", "note": "F1 Grand Prix Mayıs sonu, fiyatlar zirve" },
      { "period": "Haz–Ağu", "temp": "21–28°C", "crowd": "Yüksek", "price": "Yüksek", "note": "Plaj sezonu, yat şovları, en kalabalık dönem" },
      { "period": "Eyl–Kas", "temp": "15–24°C", "crowd": "Orta", "price": "Yüksek", "note": "Yat Şovu Eylül, hava hâlâ güzel" },
      { "period": "Ara–Şub", "temp": "8–13°C", "crowd": "Düşük", "price": "Orta", "note": "En uygun dönem ama birçok yer kapalı" }
    ],
    "costs": [
      { "item": "Konaklama", "budget": "€80–130", "mid": "€200–350", "comfort": "€600+" },
      { "item": "Yemek", "budget": "€20–35", "mid": "€50–80", "comfort": "€120+" },
      { "item": "Ulaşım", "budget": "€5–10", "mid": "€15–25", "comfort": "€50+" },
      { "item": "Aktivite", "budget": "€5–15", "mid": "€25–50", "comfort": "€100+" },
      { "item": "TOPLAM/gün", "budget": "€110–190", "mid": "€290–505", "comfort": "€870+" }
    ],
    "faqs": [
      { "question": "Monaco'da kaç gün kalmalı?", "answer": "Çoğu gezgin için 1 gün yeterli. Monaco 2 km²'lik bir alan — Prens Sarayı, Casino, Oşinografi Müzesi ve limanı tek günde rahatça gezebilirsiniz. Nice'ten trenle 30 dakika." },
      { "question": "Monaco'ya ne zaman gidilir?", "answer": "Nisan–Ekim arası hava güzel. F1 Grand Prix (Mayıs sonu) döneminde fiyatlar 3–5 kat artıyor. En uygun dönem Mart–Nisan veya Ekim." },
      { "question": "Monaco pahalı mı?", "answer": "Evet, dünyanın en pahalı destinasyonlarından biri. Bir restoranda akşam yemeği kişi başı €70'ten başlıyor. Ama Nice'te kalıp günübirlik giderseniz maliyeti ciddi şekilde düşürürsünüz — tren bileti yaklaşık €5." },
      { "question": "Monaco güvenli mi?", "answer": "Dünyanın en güvenli yerlerinden biri. Yoğun kamera ve polis ağı var. Gece dahil ciddi bir güvenlik sorunu yok." },
      { "question": "Monaco'ya nasıl gidilir?", "answer": "En yakın havalimanı Nice (NCE), 30 km mesafede. Nice'ten Monaco'ya tren 25–30 dakika, bilet yaklaşık €4–5. Şehir içi yürünerek 30–45 dakikada baştan sona gezilebilir. Ücretsiz asansörler ve yürüyen merdivenler dik yamaçlarda ulaşımı kolaylaştırıyor." },
      { "question": "Monaco'da Casino'ya girmek ücretsiz mi?", "answer": "Monte Carlo Casino'nun lobisine giriş ücretsiz. Oyun salonlarına giriş €17'den başlıyor. 18 yaş altı giremez. Pasaport veya kimlik zorunlu." },
      { "question": "Monaco'da ücretsiz ne yapılır?", "answer": "Prens Sarayı nöbet değişimi (11:55, ücretsiz), liman yürüyüşü, Japon Bahçesi, Place d'Armes pazarı ve sahil boyunca yürüyüş ücretsiz. Oşinografi Müzesi girişi yetişkin €20." }
    ]
  },
  "marsilya": {
    "tldr": "Marsilya, Fransa'nın en eski ve ikinci büyük şehri; Akdeniz limanı, Calanques kayalıkları ve çok kültürlü sokak yaşamıyla tanınıyor. Günlük bütçe €60–120. Paris'e TGV ile 3 saat 15 dakika, Nice'e 2,5 saat. Cannes ve Riviera rotalarıyla kolayca birleştirilebilir. Schengen vizesi gerekli.",
    "quickAnswer": "Marsilya'da 2–3 gün kalın, günlük €60–120 bütçe ayırın. Nisan–Haziran veya Eylül–Ekim en ideal dönem.",
    "lastUpdated": "Nisan 2026",
    "visa": "Türk vatandaşları için Schengen vizesi gerekli. 90 gün/180 gün kuralı geçerli. ETIAS sistemi 2026 sonunda devreye girebilir ama henüz zorunlu değil — seyahat öncesi resmi AB kaynaklarından kontrol edin.",
    "safety": "Vieux-Port ve merkezi turistik bölgeler gündüz genel olarak güvenli. Le Panier ve Noailles'de yankesiciye dikkat edin, özellikle kalabalık saatlerde. Kuzey banliyöleri (Quartiers Nord) turistik değil ve gece kaçınılmalı. Genel güvenlik büyük Avrupa şehirleriyle benzer düzeyde. Acil durum: 112 veya 17 (polis).",
    "seasons": [
      { "period": "Mar–May", "temp": "12–22°C", "crowd": "Orta", "price": "Orta", "note": "Calanques yürüyüşü için ideal, omuz sezon" },
      { "period": "Haz–Ağu", "temp": "22–32°C", "crowd": "Yüksek", "price": "Yüksek", "note": "Plaj sezonu, Calanques yangın riski ile kapalı olabilir" },
      { "period": "Eyl–Kas", "temp": "14–25°C", "crowd": "Orta", "price": "Orta", "note": "En iyi dönemlerden biri, Mistral rüzgarına dikkat" },
      { "period": "Ara–Şub", "temp": "5–12°C", "crowd": "Düşük", "price": "Düşük", "note": "Rüzgârlı ve serin, fiyatlar %25–35 düşük" }
    ],
    "costs": [
      { "item": "Konaklama", "budget": "€25–45", "mid": "€80–140", "comfort": "€200+" },
      { "item": "Yemek", "budget": "€15–25", "mid": "€30–50", "comfort": "€70+" },
      { "item": "Ulaşım", "budget": "€5–8", "mid": "€10–20", "comfort": "€30+" },
      { "item": "Aktivite", "budget": "€0–10", "mid": "€15–30", "comfort": "€50+" },
      { "item": "TOPLAM/gün", "budget": "€45–88", "mid": "€135–240", "comfort": "€350+" }
    ],
    "faqs": [
      { "question": "Marsilya'da kaç gün kalmalı?", "answer": "2–3 gün ideal. Vieux-Port, Notre-Dame de la Garde, Le Panier ve MuCEM'i 2 günde gezebilirsiniz. Calanques yürüyüşü için +1 gün ekleyin." },
      { "question": "Marsilya'ya ne zaman gidilir?", "answer": "Nisan–Haziran ve Eylül–Ekim en iyi dönem; 18–28°C, daha az kalabalık. Temmuz–Ağustos 32°C'ye çıkıyor ve Calanques yangın riski nedeniyle kapanabiliyor." },
      { "question": "Marsilya pahalı mı?", "answer": "Paris'e göre belirgin şekilde ucuz. Yerel bir restoranda öğle yemeği €12–18, hostel geceliği €25–35. Noailles pazarı ve Capucins pazarı uygun fiyatlı taze ürünler için iyi adresler." },
      { "question": "Marsilya güvenli mi?", "answer": "Merkez ve turistik bölgeler gündüz güvenli. Metroda ve kalabalık pazarlarda yankesiciye dikkat edin. Kuzey banliyölerden uzak durun. Genel olarak büyük Avrupa şehirleriyle benzer risk seviyesi." },
      { "question": "Marsilya'ya nasıl gidilir?", "answer": "Marsilya Provence Havalimanı (MRS) şehre 27 km. Shuttle ile Gare Saint-Charles'a 25 dakikada ulaşılıyor, bilet yaklaşık €11. Paris'ten TGV 3 saat 15 dakika (€32–108), Nice'ten tren 2,5 saat, Cannes'tan yaklaşık 2 saat." },
      { "question": "Marsilya'da toplu taşıma nasıl?", "answer": "2 metro hattı, tramvay ve otobüs ağı var. Tek bilet €2, günlük pas €6. RTM uygulamasından mobil bilet alınabiliyor. Merkez yürünebilir ama tepeli — rahat ayakkabı şart." },
      { "question": "Marsilya'da ücretsiz ne yapılır?", "answer": "Notre-Dame de la Garde Bazilikası (giriş ücretsiz, panoramik manzara), Fort Saint-Jean bahçeleri ve köprüleri (MuCEM yanı), Cathédrale de la Major, Prado plajları ve Parc Borély hepsi ücretsiz." }
    ]
  },

  dusseldorf: {
    tldr: "Düsseldorf, Almanya'nın moda ve iş başkenti. Günlük bütçe €50–80. Altstadt (Eski Şehir) 'dünyanın en uzun barı' olarak anılır. Japonya dışındaki en büyük Japon topluluğuna ev sahipliği yapar. En iyi zaman Mayıs–Eylül.",
    quickAnswer: "Düsseldorf'ta 2–3 gün kalın, günlük €50–80 bütçe ayırın, Mayıs–Eylül en ideal dönem.",
    lastUpdated: "Nisan 2026",
    visa: "Schengen vizesi gerekli. Almanya freelance vizesi (Freiberufler) uzun dönem kalış için uygun.",
    safety: "Çok güvenli bir şehir. Altstadt'ta gece partilerden sonra dikkatli olun. Genel olarak Almanya standartlarında güvenli.",
    seasons: [
      { period: "Mar–May", temp: "6–18°C", crowd: "Orta", price: "Orta", note: "Bahar, Ren nehri kenarı güzel" },
      { period: "Haz–Ağu", temp: "17–26°C", crowd: "Yüksek", price: "Yüksek", note: "En sıcak dönem, açık hava etkinlikleri" },
      { period: "Eyl–Kas", temp: "7–18°C", crowd: "Orta", price: "Orta", note: "Sonbahar, fuar sezonu" },
      { period: "Ara–Şub", temp: "0–6°C", crowd: "Düşük", price: "Düşük", note: "Karnaval sezonu (Şubat), Noel pazarları" },
    ],
    costs: [
      { item: "Konaklama", budget: "€25–45", mid: "€80–140", comfort: "€200+" },
      { item: "Yemek", budget: "€12–22", mid: "€30–50", comfort: "€70+" },
      { item: "Ulaşım", budget: "€5–10", mid: "€10–18", comfort: "€25+" },
      { item: "Aktivite", budget: "€0–10", mid: "€15–30", comfort: "€45+" },
      { item: "TOPLAM/gün", budget: "€42–87", mid: "€135–238", comfort: "€340+" },
    ],
    faqs: [
      { question: "Düsseldorf'ta kaç gün yeterli?", answer: "2–3 gün şehir için yeterli. Köln günübirlik gezi (30 dk tren) dahil 4 gün ideal." },
      { question: "Altstadt'ı neden 'en uzun bar' diyorlar?", answer: "300+ bar, pub ve restoran tek bir sokaklarda sıralanmış. Altbier (yerel bira) mutlaka denenmeli." },
      { question: "Düsseldorf'ta Japon kültürü?", answer: "Immermannstraße çevresinde 'Little Tokyo' — otantik Japon restoranları, süpermarketler ve kültür merkezi. Japonya günü (Haziran) büyük festival." },
      { question: "Düsseldorf ne zaman gidilir?", answer: "Mayıs–Eylül en ideal. Şubat karnaval sezonu çok eğlenceli. Noel pazarları Aralık'ta harika." },
      { question: "Düsseldorf'tan Köln'e nasıl gidilir?", answer: "RE tren ile 30 dk, yaklaşık €12. S-Bahn ile 45 dk. Günübirlik gezi için ideal mesafe." },
    ],
  },

  paris: {
    tldr: "Paris, yılda 30+ milyon turist ağırlayan dünyanın en çok ziyaret edilen şehri. Günlük bütçe €70–130. Eyfel Kulesi, Louvre ve Montmartre başlıca noktalar. Metro ağı mükemmel — şehrin her yerine 30 dk'da ulaşılır. Schengen vizesi gerekli.",
    quickAnswer: "Paris'te 4–5 gün kalın, günlük €70–130 bütçe ayırın, Nisan–Haziran ve Eylül–Ekim en ideal dönem.",
    lastUpdated: "Nisan 2026",
    visa: "Schengen vizesi gerekli. 90 gün/180 gün kuralı geçerli. Fransa konsolosluğundan başvuru.",
    safety: "Genel olarak güvenli. Metro ve turistik alanlarda yankesicilere dikkat. Gece bazı banliyölerden uzak durun. Acil: 112.",
    seasons: [
      { period: "Mar–May", temp: "8–19°C", crowd: "Orta", price: "Orta", note: "Bahar çiçekleri, en güzel dönem" },
      { period: "Haz–Ağu", temp: "16–26°C", crowd: "Yüksek", price: "Yüksek", note: "Yaz, uzun günler, kalabalık" },
      { period: "Eyl–Kas", temp: "8–20°C", crowd: "Orta", price: "Orta", note: "Sonbahar, müze sezonu, uygun fiyat" },
      { period: "Ara–Şub", temp: "2–8°C", crowd: "Düşük", price: "Düşük", note: "Noel pazarları, kısa günler" },
    ],
    costs: [
      { item: "Konaklama", budget: "€35–60", mid: "€100–180", comfort: "€250+" },
      { item: "Yemek", budget: "€15–25", mid: "€35–60", comfort: "€80+" },
      { item: "Ulaşım", budget: "€5–8", mid: "€10–15", comfort: "€30+" },
      { item: "Aktivite", budget: "€0–15", mid: "€20–40", comfort: "€60+" },
      { item: "TOPLAM/gün", budget: "€55–108", mid: "€165–295", comfort: "€420+" },
    ],
    faqs: [
      { question: "Paris'te kaç gün yeterli?", answer: "4–5 gün temel noktalar için yeterli. Versailles ve Disneyland dahil 7 gün ideal." },
      { question: "Paris'te en ucuz ulaşım nedir?", answer: "Navigo haftalık kartı €30'a tüm metro, RER ve otobüslerde sınırsız geçiş sağlıyor." },
      { question: "Eyfel Kulesi'ne bilet nasıl alınır?", answer: "Online ön rezervasyon şart — yerinde kuyruk 2+ saat. Tepeye asansör €26.80, merdiven €11.30." },
      { question: "Paris dijital göçebeler için uygun mu?", answer: "Evet ama pahalı. WeWork ve Morning coworking alanları var. Kafe kültürü güçlü ama Wi-Fi hızları değişken." },
    ],
  },

  roma: {
    tldr: "Roma, 2.800 yıllık tarihi ve açık hava müzesi atmosferiyle İtalya'nın başkenti. Günlük bütçe €50–90. Kolezyum, Vatikan ve Trevi Çeşmesi birkaç km mesafede. Pizza ve pasta €5–8 arası. Schengen vizesi gerekli.",
    quickAnswer: "Roma'da 3–5 gün kalın, günlük €50–90 bütçe ayırın, Nisan–Haziran en ideal dönem.",
    lastUpdated: "Nisan 2026",
    visa: "Schengen vizesi gerekli. İtalya konsolosluğundan başvuru.",
    safety: "Genel olarak güvenli. Termini çevresi ve metro hattında yankesicilere dikkat. Gece Trastevere güvenli ve canlı.",
    seasons: [
      { period: "Mar–May", temp: "10–23°C", crowd: "Orta-Yüksek", price: "Orta", note: "En güzel dönem, Paskalya kalabalık" },
      { period: "Haz–Ağu", temp: "20–33°C", crowd: "Çok Yüksek", price: "Yüksek", note: "Çok sıcak, Ağustos'ta yerel tatil" },
      { period: "Eyl–Kas", temp: "12–26°C", crowd: "Orta", price: "Orta", note: "Eylül ideal, Kasım yağmurlu" },
      { period: "Ara–Şub", temp: "3–12°C", crowd: "Düşük", price: "Düşük", note: "Kısa kuyruklar, soğuk ama güneşli günler" },
    ],
    costs: [
      { item: "Konaklama", budget: "€25–45", mid: "€80–140", comfort: "€200+" },
      { item: "Yemek", budget: "€12–20", mid: "€30–50", comfort: "€70+" },
      { item: "Ulaşım", budget: "€5–7", mid: "€10–15", comfort: "€25+" },
      { item: "Aktivite", budget: "€0–16", mid: "€20–40", comfort: "€50+" },
      { item: "TOPLAM/gün", budget: "€42–88", mid: "€140–245", comfort: "€345+" },
    ],
    faqs: [
      { question: "Roma'da kaç gün yeterli?", answer: "3 gün minimum (Kolezyum, Vatikan, merkez). 5 gün ile Trastevere, Appian Way ve günübirlik geziler dahil." },
      { question: "Vatikan'a bilet nasıl alınır?", answer: "Online ön rezervasyon kesinlikle önerilir — yerinde 3+ saat kuyruk. Müze + Sistine Şapeli €17." },
      { question: "Roma'da su içilebilir mi?", answer: "Evet! Nasoni adlı 2.500+ ücretsiz çeşmeden içilebilir su akıyor. Şişe taşıyıp doldurun." },
    ],
  },

  londra: {
    tldr: "Londra, dünyanın en kozmopolit şehirlerinden biri. Günlük bütçe £60–120. British Museum, Tower Bridge ve West End müzikalleri başlıca çekicilikler. Çoğu müze ücretsiz. Schengen dışı — ayrı UK vizesi gerekli.",
    quickAnswer: "Londra'da 4–5 gün kalın, günlük £60–120 bütçe ayırın, Mayıs–Eylül en iyi dönem.",
    lastUpdated: "Nisan 2026",
    visa: "UK Standard Visitor vizesi gerekli (Türk vatandaşları). Schengen vizesi geçersiz.",
    safety: "Genel olarak güvenli. Metroda ve Oxford Street'te yankesiciye dikkat. Gece güvenli ama bazı doğu bölgelerinde dikkatli olun.",
    seasons: [
      { period: "Mar–May", temp: "7–17°C", crowd: "Orta", price: "Orta", note: "Bahar parkları muhteşem" },
      { period: "Haz–Ağu", temp: "14–24°C", crowd: "Yüksek", price: "Yüksek", note: "Yaz festivalleri, uzun günler" },
      { period: "Eyl–Kas", temp: "8–18°C", crowd: "Orta", price: "Orta", note: "Sonbahar, tiyatro sezonu" },
      { period: "Ara–Şub", temp: "3–8°C", crowd: "Düşük", price: "Düşük", note: "Noel ışıkları, kısa günler" },
    ],
    costs: [
      { item: "Konaklama", budget: "£30–55", mid: "£100–180", comfort: "£250+" },
      { item: "Yemek", budget: "£12–22", mid: "£30–55", comfort: "£70+" },
      { item: "Ulaşım", budget: "£8–12", mid: "£15–20", comfort: "£30+" },
      { item: "Aktivite", budget: "£0–10", mid: "£20–40", comfort: "£60+" },
      { item: "TOPLAM/gün", budget: "£50–99", mid: "£165–295", comfort: "£410+" },
    ],
    faqs: [
      { question: "Londra'da en ucuz ulaşım nedir?", answer: "Oyster Card veya kontaktöre ödeme (tap-in/tap-out). Günlük cap £8.10 ile sınırsız metro/otobüs." },
      { question: "Ücretsiz müzeler hangileri?", answer: "British Museum, National Gallery, Tate Modern, Natural History Museum, V&A — hepsi ücretsiz." },
    ],
  },

  tokyo: {
    tldr: "Tokyo, geleneksel tapınaklar ile fütüristik teknolojiyi bir arada sunan dünyanın en büyük metropolü. Günlük bütçe ¥8.000–15.000 ($55–100). Shibuya, Akihabara, Senso-ji ve Tsukiji pazarı başlıca noktalar. Metro sistemi mükemmel ama karmaşık.",
    quickAnswer: "Tokyo'da 5–7 gün kalın, günlük $55–100 bütçe ayırın, kiraz çiçeği sezonu (Mart sonu–Nisan) veya sonbahar (Ekim–Kasım) en ideal.",
    lastUpdated: "Nisan 2026",
    visa: "Türk vatandaşları 90 gün vizesiz giriş yapabilir. e-Vize sistemi mevcut.",
    safety: "Dünyanın en güvenli büyük şehri. Gece bile her yerde rahatça yürünebilir. Kayıp eşya bulma oranı çok yüksek.",
    seasons: [
      { period: "Mar–May", temp: "10–22°C", crowd: "Yüksek", price: "Yüksek", note: "Kiraz çiçeği sezonu, en popüler dönem" },
      { period: "Haz–Ağu", temp: "22–33°C", crowd: "Orta", price: "Orta", note: "Yağmur mevsimi (Haziran), nemli yaz" },
      { period: "Eyl–Kas", temp: "15–27°C", crowd: "Orta", price: "Orta", note: "Sonbahar yaprakları, ideal hava" },
      { period: "Ara–Şub", temp: "2–12°C", crowd: "Düşük", price: "Düşük", note: "Soğuk ama güneşli, kış illuminasyonları" },
    ],
    costs: [
      { item: "Konaklama", budget: "$25–40", mid: "$80–150", comfort: "$200+" },
      { item: "Yemek", budget: "$10–18", mid: "$25–45", comfort: "$70+" },
      { item: "Ulaşım", budget: "$8–12", mid: "$15–20", comfort: "$30+" },
      { item: "Aktivite", budget: "$0–10", mid: "$15–30", comfort: "$50+" },
      { item: "TOPLAM/gün", budget: "$43–80", mid: "$135–245", comfort: "$350+" },
    ],
    faqs: [
      { question: "Tokyo'da kaç gün yeterli?", answer: "5 gün minimum. Kyoto günübirlik dahil 7–10 gün ideal. Shinkansen ile Kyoto 2 saat 15 dk." },
      { question: "Japan Rail Pass gerekli mi?", answer: "Sadece Tokyo kalacaksanız hayır. Kyoto/Osaka da gezecekseniz 7 günlük JR Pass (~$200) tasarruf sağlar." },
      { question: "Tokyo'da İngilizce yeterli mi?", answer: "Turistik alanlarda evet. Google Translate kamera çevirisi menüler için çok işe yarıyor." },
    ],
  },

  dubai: {
    tldr: "Dubai, çöl ile modern lüksün buluştuğu küresel hub. Günlük bütçe $60–150. Burj Khalifa, Dubai Mall, Desert Safari ve Palm Jumeirah başlıca çekicilikler. Yıl boyu güneşli ama yaz aylarında 45°C+ sıcaklık. Türk vatandaşları vizesiz giriş yapabilir.",
    quickAnswer: "Dubai'de 3–5 gün kalın, günlük $60–150 bütçe ayırın, Kasım–Mart en ideal dönem.",
    lastUpdated: "Nisan 2026",
    visa: "Türk vatandaşları 90 gün vizesiz giriş yapabilir. Dijital göçebe vizesi (1 yıl) aylık $5.000+ gelir şartıyla mevcut.",
    safety: "Dünyanın en güvenli şehirlerinden biri. Suç oranı çok düşük. Gece bile her yerde güvenle dolaşılabilir.",
    seasons: [
      { period: "Mar–May", temp: "24–38°C", crowd: "Orta", price: "Orta", note: "Geçiş dönemi, plaj sezonu başlangıcı" },
      { period: "Haz–Ağu", temp: "34–45°C", crowd: "Düşük", price: "Düşük", note: "Aşırı sıcak, iç mekan aktiviteleri" },
      { period: "Eyl–Kas", temp: "28–38°C", crowd: "Orta", price: "Orta", note: "Yaz sonu, fiyatlar düşmeye başlıyor" },
      { period: "Ara–Şub", temp: "16–26°C", crowd: "Yüksek", price: "Yüksek", note: "En iyi dönem, alışveriş festivali" },
    ],
    costs: [
      { item: "Konaklama", budget: "$25–45", mid: "$80–150", comfort: "$250+" },
      { item: "Yemek", budget: "$10–18", mid: "$30–50", comfort: "$80+" },
      { item: "Ulaşım", budget: "$5–10", mid: "$15–25", comfort: "$40+" },
      { item: "Aktivite", budget: "$0–15", mid: "$30–60", comfort: "$100+" },
      { item: "TOPLAM/gün", budget: "$40–88", mid: "$155–285", comfort: "$470+" },
    ],
    faqs: [
      { question: "Dubai pahalı mı?", answer: "Lüks imajına rağmen bütçe dostu seçenekler var. Deira ve Bur Dubai'de uygun oteller, yerel restoranlarda yemek $5–8." },
      { question: "Dubai'de alkol içilebilir mi?", answer: "Lisanslı oteller, barlar ve restoranlarda evet. Kamusal alanda alkol yasak. Turist lisansı artık gerekmiyor." },
    ],
  },

  bangkok: {
    tldr: "Bangkok, Güneydoğu Asya'nın en canlı başkenti. Günlük bütçe $25–50. Tapınaklar, gece pazarları ve street food cenneti. Khao San Road backpacker merkezi, Sukhumvit modern şehir hayatı. Türk vatandaşları 30 gün vizesiz.",
    quickAnswer: "Bangkok'ta 3–5 gün kalın, günlük $25–50 bütçe ayırın, Kasım–Şubat en ideal (kuru sezon).",
    lastUpdated: "Nisan 2026",
    visa: "Türk vatandaşları 30 gün vizesiz giriş yapabilir. 60 güne uzatma mümkün.",
    safety: "Genel olarak güvenli. Tuk-tuk dolandırıcılığına ve sahte tur acentelerine dikkat. Taksi taksimetresi açtırın.",
    seasons: [
      { period: "Mar–May", temp: "28–36°C", crowd: "Düşük", price: "Düşük", note: "En sıcak dönem, Songkran festivali Nisan" },
      { period: "Haz–Eki", temp: "26–33°C", crowd: "Düşük", price: "Düşük", note: "Yağmur mevsimi, kısa ama yoğun yağışlar" },
      { period: "Kas–Şub", temp: "22–32°C", crowd: "Yüksek", price: "Orta", note: "Kuru sezon, en iyi dönem" },
    ],
    costs: [
      { item: "Konaklama", budget: "$8–15", mid: "$30–60", comfort: "$100+" },
      { item: "Yemek", budget: "$3–8", mid: "$10–20", comfort: "$40+" },
      { item: "Ulaşım", budget: "$2–5", mid: "$5–12", comfort: "$20+" },
      { item: "Aktivite", budget: "$0–5", mid: "$10–20", comfort: "$40+" },
      { item: "TOPLAM/gün", budget: "$13–33", mid: "$55–112", comfort: "$200+" },
    ],
    faqs: [
      { question: "Bangkok'ta kaç gün yeterli?", answer: "3 gün şehir için yeterli. Ayutthaya günübirlik gezi dahil 4–5 gün ideal." },
      { question: "Bangkok'ta su içilebilir mi?", answer: "Şebeke suyu içilmez. Her yerde ucuz şişe su ($0.20) mevcut." },
    ],
  },

  amsterdam: {
    tldr: "Amsterdam, kanallar, bisiklet kültürü ve müzeleriyle Hollanda'nın başkenti. Günlük bütçe €60–100. Van Gogh Müzesi, Anne Frank Evi ve Rijksmuseum başlıca noktalar. Bisiklet kiralayarak şehri keşfetmek en iyi yol. Schengen vizesi gerekli.",
    quickAnswer: "Amsterdam'da 2–4 gün kalın, günlük €60–100 bütçe ayırın, Nisan–Ekim en ideal.",
    lastUpdated: "Nisan 2026",
    visa: "Schengen vizesi gerekli. 90/180 gün kuralı.",
    safety: "Güvenli ama bisiklet yollarında yürümeyin — ciddi kaza riski. Turistik alanlarda yankesiciye dikkat.",
    seasons: [
      { period: "Mar–May", temp: "6–17°C", crowd: "Yüksek", price: "Yüksek", note: "Lale sezonu Nisan, Keukenhof açık" },
      { period: "Haz–Ağu", temp: "14–23°C", crowd: "Çok Yüksek", price: "Yüksek", note: "Festival sezonu, uzun günler" },
      { period: "Eyl–Kas", temp: "8–17°C", crowd: "Orta", price: "Orta", note: "Sonbahar, müze sezonu" },
      { period: "Ara–Şub", temp: "1–6°C", crowd: "Düşük", price: "Düşük", note: "Soğuk ama atmosferik, ışık festivali" },
    ],
    costs: [
      { item: "Konaklama", budget: "€30–55", mid: "€100–170", comfort: "€220+" },
      { item: "Yemek", budget: "€12–22", mid: "€30–50", comfort: "€70+" },
      { item: "Ulaşım", budget: "€5–10", mid: "€10–15", comfort: "€25+" },
      { item: "Aktivite", budget: "€0–15", mid: "€20–35", comfort: "€50+" },
      { item: "TOPLAM/gün", budget: "€47–102", mid: "€160–270", comfort: "€365+" },
    ],
    faqs: [
      { question: "Amsterdam'da bisiklet kiralamak güvenli mi?", answer: "Evet ama trafik kurallarını bilin. Swapfiets veya MacBike'tan günlük €10–15. Tramvay raylarında dikkatli olun." },
      { question: "Amsterdam Card almalı mıyım?", answer: "3+ müze gezecekseniz I amsterdam City Card (€65/gün) tasarruf sağlar. Toplu taşıma dahil." },
    ],
  },

  atina: {
    tldr: "Atina, Batı medeniyetinin beşiği ve Akdeniz mutfağının kalbi. Günlük bütçe €40–70. Akropolis, Plaka mahallesi ve Monastiraki pazarı başlıca noktalar. Adalar için feribot hub'ı. Schengen vizesi gerekli.",
    quickAnswer: "Atina'da 2–3 gün kalın, günlük €40–70 bütçe ayırın, Nisan–Haziran ve Eylül–Ekim en ideal.",
    lastUpdated: "Nisan 2026",
    visa: "Schengen vizesi gerekli. Yunanistan dijital göçebe vizesi mevcut — aylık €3.500+ gelir şartıyla 1 yıl.",
    safety: "Genel olarak güvenli. Omonia meydanı çevresinde gece dikkatli olun. Plaka ve Monastiraki güvenli.",
    seasons: [
      { period: "Mar–May", temp: "12–25°C", crowd: "Orta", price: "Orta", note: "Paskalya özel, ideal hava" },
      { period: "Haz–Ağu", temp: "25–35°C", crowd: "Yüksek", price: "Yüksek", note: "Çok sıcak, ada sezonu" },
      { period: "Eyl–Kas", temp: "15–28°C", crowd: "Orta", price: "Orta", note: "En iyi dönem, deniz hâlâ sıcak" },
      { period: "Ara–Şub", temp: "7–14°C", crowd: "Düşük", price: "Düşük", note: "Yağışlı ama turistsiz" },
    ],
    costs: [
      { item: "Konaklama", budget: "€20–35", mid: "€60–110", comfort: "€160+" },
      { item: "Yemek", budget: "€8–15", mid: "€20–35", comfort: "€50+" },
      { item: "Ulaşım", budget: "€3–6", mid: "€8–12", comfort: "€20+" },
      { item: "Aktivite", budget: "€0–10", mid: "€15–25", comfort: "€40+" },
      { item: "TOPLAM/gün", budget: "€31–66", mid: "€103–182", comfort: "€270+" },
    ],
    faqs: [
      { question: "Atina'dan adalara nasıl gidilir?", answer: "Pire limanından feribot. Santorini'ye 5–8 saat (€35–65), Mykonos'a 3–5 saat. Hızlı feribot 2 kat pahalı." },
      { question: "Akropolis'e ne zaman gidilir?", answer: "Sabah açılışta (8:00) veya kış aylarında. Yaz öğlen 40°C+ — sabah gidin. Bilet €20, online alın." },
    ],
  },

  budapeste: {
    tldr: "Budapeşte, Tuna Nehri'nin ikiye böldüğü Macaristan'ın başkenti — Avrupa'nın en uygun fiyatlı ve görsel açıdan en etkileyici başkentlerinden biri. Günlük bütçe €35–60 (orta segment €85–150). 118 doğal sıcak su kaynağıyla 'Kaplıcalar Şehri' ünvanını taşıyor. Ruin bar kültürü, UNESCO listesindeki Tuna kıyıları ve Buda Kalesi, Osmanlı mirası hamamlar ve Sziget Festivali ile her türden gezgine hitap ediyor. Dijital göçebeler için hızla popülerleşen bir merkez. Türk vatandaşları için Schengen vizesi gerekli.",
    quickAnswer: "Budapeşte'de 3–5 gün kalın, günlük €35–60 bütçe ayırın, Nisan–Haziran ve Eylül–Ekim en ideal dönem. Havalimanından merkeze 100E otobüsüyle 30 dk.",
    lastUpdated: "Nisan 2026",
    idealFor: ["Çiftler", "Solo Gezginler", "Dijital Göçebeler", "Bütçe Gezginleri", "Kültür Meraklıları"],
    suggestedDays: "3–5 gün",
    visa: "Türk vatandaşları için Schengen vizesi gerekli. Macaristan büyükelçiliği veya VFS Global üzerinden başvuru. Beyaz kart (White Card) dijital göçebe programı değerlendirme aşamasında — henüz aktif değil.",
    safety: "Genel olarak güvenli bir şehir. Buda tarafı gece çok sakin, Pest tarafı canlı ve kalabalık. 4-6 numaralı tramvay hattı ile metro istasyonlarında ve turistik alanlarda (Váci utca, Büyük Pazar) yankesicilere dikkat. Acil durumlar: 112 (genel), 107 (polis). Türkiye'den 2 saat geri (yaz saati uygulamasında 1 saat).",
    transport: "Ferenc Liszt Havalimanı'ndan (BUD) merkeze 100E ekspres otobüsü ile 30 dk, bilet ~2.200 HUF (~€5.50). Taksi sabit fiyat ~€25. Şehir içinde metro (4 hat), tramvay ve otobüs ağı çok iyi. 24 saatlik ulaşım kartı ~2.500 HUF, 72 saatlik ~5.500 HUF. Lime e-scooter ve MOL Bubi bisiklet paylaşımı yaygın.",
    food: "Gulyás (gulaş çorbası), lángos (kızarmış hamur + ekşi krema + peynir), kürtőskalács (baca pasta), paprikás csirke (paprikalı tavuk), töltött káposzta (lahana sarması). Merkez Hali'nde (Nagy Vásárcsarnok) yerel lezzetleri uygun fiyata deneyebilirsiniz. Restoranda ana yemek: bütçe €5–8, orta €12–20.",
    topAttractions: [
      { name: "Parlamento Binası", desc: "Neo-Gotik başyapıt, Tuna kıyısında. İç tur mutlaka yapılmalı. Gece aydınlatması muhteşem.", category: "Tarih" },
      { name: "Buda Kalesi (Budavári Palota)", desc: "UNESCO listesinde. Ulusal Galeri ve Tarih Müzesi burada. Tepeden Pest manzarası.", category: "Tarih" },
      { name: "Balıkçı Tabyası", desc: "Neo-Roman kuleleri ve panoramik Tuna manzarası. Gün batımında gidin.", category: "Manzara" },
      { name: "Széchenyi Termal Hamamı", desc: "Avrupa'nın en büyük açık hava termal kompleksi. Sarı Neo-Barok bina, 18 havuz.", category: "Deneyim" },
      { name: "Gellért Hamamı ve Tepesi", desc: "Art Nouveau iç tasarımlı hamam. Tepeden 360° şehir manzarası.", category: "Deneyim" },
      { name: "Szimpla Kert", desc: "Dünyanın en ünlü ruin bar'ı. Pazar günü farmer's market. Gece canlı müzik.", category: "Gece Hayatı" },
      { name: "Aziz Stefan Bazilikası", desc: "Şehrin en büyük kilisesi. Kubbesine çıkın — 360° manzara.", category: "Tarih" },
      { name: "Büyük Pazar Hali", desc: "1897'den beri açık. Alt kat taze ürünler, üst kat hediyelik ve lángos.", category: "Yerel" },
    ],
    seasons: [
      { period: "Mar–May", temp: "8–22°C", crowd: "Orta", price: "Orta", note: "Bahar festivali, Tuna kenarı yürüyüşleri, parklar çiçek açıyor" },
      { period: "Haz–Ağu", temp: "18–33°C", crowd: "Yüksek", price: "Yüksek", note: "Sziget Festivali (Ağustos), açık hava etkinlikleri" },
      { period: "Eyl–Kas", temp: "8–20°C", crowd: "Orta", price: "Düşük", note: "Şarap festivali (Eylül), en iyi fiyat-deneyim dengesi" },
      { period: "Ara–Şub", temp: "-2–5°C", crowd: "Düşük", price: "Düşük", note: "Noel pazarları, termal hamam sezonu, buz pateni" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "€15–30", mid: "€50–90", comfort: "€140+" },
      { item: "Yemek (gün)", budget: "€8–14", mid: "€18–30", comfort: "€50+" },
      { item: "Ulaşım (gün)", budget: "€3–5", mid: "€6–10", comfort: "€18+" },
      { item: "Aktivite (gün)", budget: "€0–8", mid: "€12–22", comfort: "€35+" },
      { item: "TOPLAM/gün", budget: "€26–57", mid: "€86–152", comfort: "€243+" },
    ],
    faqs: [
      { question: "Budapeşte'de kaç gün kalınmalı?", answer: "Şehrin ana noktalarını görmek için 3 gün yeterli. Termal hamamlara zaman ayırmak ve günübirlik geziler (Szentendre, Esztergom) eklemek isterseniz 5 gün ideal." },
      { question: "Budapeşte'de hangi hamama gidilmeli?", answer: "Széchenyi: açık hava, büyük, fotoğrafik. Gellért: Art Nouveau iç tasarım, daha sakin. Rudas: Osmanlı dönemi kubbeli hamam, gece seansları var. Hafta içi gidin — kalabalık çok daha az." },
      { question: "Ruin bar nedir?", answer: "Terk edilmiş binalarda açılan, eklektik dekorasyonlu barlar. 7. Bölge'de (Erzsébetváros) yoğunlaşmış. Szimpla Kert en ünlüsü — pazar günleri farmer's market oluyor. Instant-Fogas ve Anker't de popüler." },
      { question: "Budapeşte pahalı mı?", answer: "Avrupa standartlarında ucuz. Günlük bütçe €35–60 ile rahat gezilir. Bir bira €1.50–3, restoranda ana yemek €5–12, metro bileti ~€1.20. Prag ve Viyana'dan belirgin şekilde ucuz." },
      { question: "Havalimanından merkeze nasıl gidilir?", answer: "100E ekspres otobüsü ile Deák Ferenc Meydanı'na 30 dk, bilet ~2.200 HUF (~€5.50). Taksi sabit fiyat ~€25. miniBUD shuttle da seçenek. 200E + metro M3 daha ucuz ama daha uzun." },
      { question: "Budapeşte güvenli mi?", answer: "Evet, genel olarak güvenli. Gece bile çoğu bölgede rahat yürünür. Yankesicilere turistik alanlarda (Váci utca, tramvay 4-6, Büyük Pazar) dikkat edin. Acil durum: 112." },
      { question: "Budapeşte'de para birimi nedir?", answer: "Macar Forinti (HUF). 1 EUR ≈ 400 HUF (Nisan 2026). Euro bazı turistik yerlerde kabul edilir ama kur çok kötü — mutlaka Forint kullanın. ATM yaygın, kartla ödeme çoğu yerde mümkün." },
      { question: "Viyana'dan Budapeşte'ye nasıl gidilir?", answer: "Tren (ÖBB/MÁV) ile 2,5 saat, bilet €15–30. Flixbus ile 2,5–3 saat, €10–20. RegioJet daha konforlu ve uygun fiyatlı. Günübirlik gezi için uygun mesafe." },
      { question: "Budapeşte'de en iyi mevsim hangisi?", answer: "Nisan–Haziran (bahar, ılık, az kalabalık) ve Eylül–Ekim (sonbahar, şarap festivali, uygun fiyat). Yaz sıcak ve kalabalık ama Sziget Festivali Ağustos'ta. Kış soğuk ama Noel pazarları ve termal hamamlar için ideal." },
      { question: "Budapeşte'de toplu taşıma nasıl?", answer: "Metro (4 hat), tramvay, otobüs ve troleybus ağı çok iyi. 24 saatlik kart ~2.500 HUF (~€6.25), 72 saatlik ~5.500 HUF (~€13.75). Budapest Card ile ulaşım + müze girişleri dahil." },
    ],
  },

  prag: {
    tldr: "Prag, Avrupa'nın en iyi korunmuş ortaçağ şehir merkezine sahip başkent. Günlük bütçe €40–70. Karlova Köprüsü, eski şehir meydanı ve astronomik saat başlıca noktalar. Bira kültürü güçlü — yarım litre bira €1.50. Schengen vizesi gerekli.",
    quickAnswer: "Prag'da 2–3 gün kalın, günlük €40–70 bütçe ayırın, Nisan–Haziran en ideal dönem.",
    lastUpdated: "Nisan 2026",
    visa: "Schengen vizesi gerekli. Çek Cumhuriyeti zivexpress ile dijital göçebe geçici izni alınabiliyor.",
    safety: "Güvenli bir şehir. Turistik alanlarda (Karlova Köprüsü, Eski Şehir Meydanı) yankesiciye dikkat.",
    seasons: [
      { period: "Mar–May", temp: "5–19°C", crowd: "Orta", price: "Orta", note: "Bahar, Paskalya pazarları" },
      { period: "Haz–Ağu", temp: "15–26°C", crowd: "Yüksek", price: "Yüksek", note: "Yaz, müzik festivalleri" },
      { period: "Eyl–Kas", temp: "6–18°C", crowd: "Orta", price: "Orta", note: "Sonbahar, bira festivali Eylül" },
      { period: "Ara–Şub", temp: "-2–4°C", crowd: "Orta", price: "Orta", note: "Noel pazarları çok popüler" },
    ],
    costs: [
      { item: "Konaklama", budget: "€15–30", mid: "€50–100", comfort: "€160+" },
      { item: "Yemek", budget: "€8–14", mid: "€18–30", comfort: "€50+" },
      { item: "Ulaşım", budget: "€3–5", mid: "€5–10", comfort: "€15+" },
      { item: "Aktivite", budget: "€0–8", mid: "€12–25", comfort: "€40+" },
      { item: "TOPLAM/gün", budget: "€26–57", mid: "€85–165", comfort: "€265+" },
    ],
    faqs: [
      { question: "Prag'da kaç gün yeterli?", answer: "2–3 gün şehir için yeterli. Kutná Hora veya Český Krumlov günübirlik gezi dahil 4 gün ideal." },
      { question: "Prag'da para birimi nedir?", answer: "Çek Korunası (CZK). Euro kabul eden yerler var ama kur çok kötü — Korun kullanın." },
    ],
  },

  tiflis: {
    tldr: "Tiflis, dijital göçebelerin Avrupa'nın keşfedilmemiş cevheri dediği Gürcistan'ın başkenti. Günlük bütçe $20–40. Eski şehir, kükürt hamamları ve dünyaca ünlü Gürcü mutfağı. 1 yıl vizesiz kalış hakkı. İnanılmaz uygun fiyatlı.",
    quickAnswer: "Tiflis'te 3–5 gün kalın, günlük $20–40 bütçe ayırın, Mayıs–Haziran ve Eylül–Ekim en ideal dönem.",
    lastUpdated: "Nisan 2026",
    visa: "Türk vatandaşları 1 yıl vizesiz kalabilir. Dijital göçebeler için en kolay ülkelerden biri.",
    safety: "Çok güvenli. Gece bile rahatça yürünebilir. İnsanlar çok misafirperver. Araç trafiğine dikkat.",
    seasons: [
      { period: "Mar–May", temp: "8–22°C", crowd: "Orta", price: "Düşük", note: "Bahar, çiçeklenme dönemi" },
      { period: "Haz–Ağu", temp: "22–35°C", crowd: "Yüksek", price: "Orta", note: "Sıcak yaz, dağ kaçamakları ideal" },
      { period: "Eyl–Kas", temp: "10–25°C", crowd: "Orta", price: "Düşük", note: "Üzüm hasadı, şarap sezonu" },
      { period: "Ara–Şub", temp: "-1–7°C", crowd: "Düşük", price: "Düşük", note: "Soğuk, kayak sezonu Gudauri'de" },
    ],
    costs: [
      { item: "Konaklama", budget: "$8–15", mid: "$25–50", comfort: "$80+" },
      { item: "Yemek", budget: "$5–10", mid: "$12–20", comfort: "$35+" },
      { item: "Ulaşım", budget: "$1–3", mid: "$3–8", comfort: "$15+" },
      { item: "Aktivite", budget: "$0–5", mid: "$8–15", comfort: "$25+" },
      { item: "TOPLAM/gün", budget: "$14–33", mid: "$48–93", comfort: "$155+" },
    ],
    faqs: [
      { question: "Tiflis neden dijital göçebeler arasında popüler?", answer: "1 yıl vizesiz kalış, $20–30/gün yaşam maliyeti, hızlı internet, sıcak topluluk ve Georgian küzinesi." },
      { question: "Gürcü yemekleri neler denenmeli?", answer: "Khachapuri (peynirli ekmek), khinkali (mantı), churchkhela (cevizli sucuk), pkhali ve lobio mutlaka deneyin." },
    ],
  },

  viyana: {
    tldr: "Viyana, dünyanın en yaşanabilir şehirlerinden biri. Günlük bütçe €55–90. İmparatorluk sarayları, opera, kahve kültürü ve Naschmarkt. Müzik tarihinin başkenti — Mozart, Beethoven, Strauss. Schengen vizesi gerekli.",
    quickAnswer: "Viyana'da 2–4 gün kalın, günlük €55–90 bütçe ayırın, Nisan–Haziran ve Eylül–Ekim en ideal.",
    lastUpdated: "Nisan 2026",
    visa: "Schengen vizesi gerekli. Avusturya kırmızı-beyaz-kırmızı kartı uzun süreli dijital çalışma izni sağlıyor.",
    safety: "Dünyanın en güvenli başkentlerinden biri. Gece dahil her yerde rahat. Toplu taşıma mükemmel ve güvenli.",
    seasons: [
      { period: "Mar–May", temp: "6–20°C", crowd: "Orta", price: "Orta", note: "Bahar, park bahçeleri açılıyor" },
      { period: "Haz–Ağu", temp: "17–28°C", crowd: "Yüksek", price: "Yüksek", note: "Yaz, açık hava konserleri" },
      { period: "Eyl–Kas", temp: "7–19°C", crowd: "Orta", price: "Orta", note: "Balo sezonu başlangıcı" },
      { period: "Ara–Şub", temp: "-1–4°C", crowd: "Orta", price: "Orta", note: "Noel pazarları, opera sezonu zirve" },
    ],
    costs: [
      { item: "Konaklama", budget: "€25–45", mid: "€80–140", comfort: "€200+" },
      { item: "Yemek", budget: "€10–18", mid: "€25–40", comfort: "€60+" },
      { item: "Ulaşım", budget: "€5–8", mid: "€10–15", comfort: "€25+" },
      { item: "Aktivite", budget: "€0–12", mid: "€18–30", comfort: "€50+" },
      { item: "TOPLAM/gün", budget: "€40–83", mid: "€133–225", comfort: "€335+" },
    ],
    faqs: [
      { question: "Viyana'da Kahve kültürü nasıl?", answer: "UNESCO somut olmayan kültürel mirası. Café Central, Demel ve Sacher deneyin. Melange (Viyana cappuccino) klasik." },
      { question: "Viyana'dan Budapeşte'ye nasıl gidilir?", answer: "Tren ile 2,5 saat, bilet €15–30. Günübirlik gezi için uygun." },
    ],
  },

  porto: {
    tldr: "Porto, Portekiz'in kuzey başkenti ve port şarabının ana yurdu. Günlük bütçe €35–60. Ribeira (UNESCO), Livraria Lello ve Vila Nova de Gaia şarap mahzenleri başlıca çekicilikler. Lizbon'dan trenle 2,5 saat.",
    quickAnswer: "Porto'da 2–3 gün kalın, günlük €35–60 bütçe ayırın, Mayıs–Ekim en ideal dönem.",
    lastUpdated: "Nisan 2026",
    visa: "Schengen vizesi gerekli. Portekiz D7 dijital göçebe vizesi Porto'da da geçerli.",
    safety: "Çok güvenli. Gece bile rahat yürünebilir. Turistik alanlarda küçük hırsızlığa dikkat.",
    seasons: [
      { period: "Mar–May", temp: "11–19°C", crowd: "Orta", price: "Orta", note: "Bahar, yağmur azalıyor" },
      { period: "Haz–Ağu", temp: "17–27°C", crowd: "Yüksek", price: "Yüksek", note: "São João festivali Haziran" },
      { period: "Eyl–Kas", temp: "12–23°C", crowd: "Orta", price: "Orta", note: "Üzüm hasadı, şarap turu zamanı" },
      { period: "Ara–Şub", temp: "6–14°C", crowd: "Düşük", price: "Düşük", note: "Yağışlı ama otantik" },
    ],
    costs: [
      { item: "Konaklama", budget: "€18–35", mid: "€55–100", comfort: "€150+" },
      { item: "Yemek", budget: "€8–14", mid: "€18–30", comfort: "€45+" },
      { item: "Ulaşım", budget: "€3–5", mid: "€5–10", comfort: "€18+" },
      { item: "Aktivite", budget: "€0–8", mid: "€12–22", comfort: "€35+" },
      { item: "TOPLAM/gün", budget: "€29–62", mid: "€90–162", comfort: "€248+" },
    ],
    faqs: [
      { question: "Porto'da şarap tadımı nasıl yapılır?", answer: "Vila Nova de Gaia'da 30+ şarap mahzeninde tasting var. Taylor's, Sandeman ve Graham's en popüler. Tasting €15–25." },
      { question: "Francesinha nedir?", answer: "Porto'nun ikonik sandviçi — et, sosis, peynir ve bira sosu ile. Café Santiago ve Lado B en iyileri." },
    ],
  },

  singapur: {
    tldr: "Singapur, Asya'nın en modern ve düzenli şehir devleti. Günlük bütçe $50–100. Marina Bay, Gardens by the Bay ve hawker center street food başlıca deneyimler. Dünyanın en temiz ve güvenli şehirlerinden biri. Türk vatandaşları 90 gün vizesiz.",
    quickAnswer: "Singapur'da 2–4 gün kalın, günlük $50–100 bütçe ayırın, yıl boyu tropikal iklim.",
    lastUpdated: "Nisan 2026",
    visa: "Türk vatandaşları 90 gün vizesiz giriş yapabilir.",
    safety: "Dünyanın en güvenli şehirlerinden biri. Suç oranı son derece düşük. Sakız çiğnemek ve yere tükürmek yasak — para cezası var.",
    seasons: [
      { period: "Mar–May", temp: "25–33°C", crowd: "Orta", price: "Orta", note: "Nispeten kuru dönem" },
      { period: "Haz–Ağu", temp: "25–32°C", crowd: "Yüksek", price: "Yüksek", note: "Great Singapore Sale" },
      { period: "Eyl–Kas", temp: "24–32°C", crowd: "Orta", price: "Orta", note: "Haze sezonu (Ekim), F1 Eylül" },
      { period: "Ara–Şub", temp: "23–31°C", crowd: "Yüksek", price: "Yüksek", note: "En yağışlı dönem, Çin Yeni Yılı" },
    ],
    costs: [
      { item: "Konaklama", budget: "$25–45", mid: "$80–150", comfort: "$250+" },
      { item: "Yemek", budget: "$5–12", mid: "$20–35", comfort: "$60+" },
      { item: "Ulaşım", budget: "$5–8", mid: "$10–15", comfort: "$25+" },
      { item: "Aktivite", budget: "$0–10", mid: "$20–40", comfort: "$60+" },
      { item: "TOPLAM/gün", budget: "$35–75", mid: "$130–240", comfort: "$395+" },
    ],
    faqs: [
      { question: "Hawker center nedir?", answer: "Açık hava yemek merkezleri — Michelin yıldızlı sokak yemeği $3–5. Maxwell Food Centre ve Lau Pa Sat en ünlüleri." },
      { question: "Singapur'da neye dikkat etmeli?", answer: "Sakız ithalatı ve satışı yasak. Toplu taşımada yiyip içmek yasak. Sigara çok sınırlı alanlarda." },
    ],
  },

  // ═══════ EKSİK ŞEHİRLER — YENİ GEO VERİLERİ ═══════

  antalya: {
    tldr: "Antalya, Türkiye'nin güney sahilinde Akdeniz'in incisi. Yılın 300+ günü güneşli. Antik Perge, Aspendos ve Side kalıntıları; Düden ve Manavgat şelaleleri; Kaleiçi'nin tarihi dokusu ve turkuaz sahilleri. Günlük bütçe ₺1.000–2.000 (~€30–55). Türk Rivierası'nın kalbi.",
    quickAnswer: "Antalya'da 3–5 gün kalın, Nisan–Haziran ve Eylül–Kasım en ideal dönem. Sahil, antik kentler ve doğa bir arada.",
    lastUpdated: "Nisan 2026",
    idealFor: ["Aileler", "Çiftler", "Plaj Tatilcileri", "Tarih Meraklıları"],
    suggestedDays: "3–5 gün",
    visa: "Birçok ülke vatandaşı e-Vize ile giriş yapabilir. AB vatandaşları 90 gün vizesiz.",
    safety: "Güvenli bir tatil bölgesi. Turistik alanlarda standart önlemler yeterli. Acil durum: 112.",
    transport: "Antalya Havalimanı (AYT) şehir merkezine 13 km. Havaş shuttle, tramvay (Antray) ve otobüs (Antalyakart) mevcut. Kemer, Side, Alanya gibi tatil bölgelerine düzenli servisler var.",
    food: "Piyaz (Antalya usulü fasulye salatası), tandır kebabı, şiş köfte, tahinli piyaz, turunç reçeli. Kaleiçi'nde atmosferik restoranlar, Lara'da plaj barları. Ana yemek: bütçe ₺150–250, orta ₺300–500.",
    seasons: [
      { period: "Mar–May", temp: "15–25°C", crowd: "Orta", price: "Orta", note: "Bahar, antik kent gezileri için ideal" },
      { period: "Haz–Ağu", temp: "25–35°C", crowd: "Çok Yüksek", price: "Yüksek", note: "Plaj sezonu, sıcak" },
      { period: "Eyl–Kas", temp: "18–30°C", crowd: "Orta", price: "Orta", note: "Deniz hâlâ sıcak, kalabalık azalmış" },
      { period: "Ara–Şub", temp: "8–15°C", crowd: "Düşük", price: "Düşük", note: "Kış güneşi, Saklikent kayak" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "₺800–1.500", mid: "₺2.000–4.000", comfort: "₺6.000+" },
      { item: "Yemek (gün)", budget: "₺300–600", mid: "₺700–1.200", comfort: "₺2.000+" },
      { item: "Ulaşım (gün)", budget: "₺50–150", mid: "₺200–400", comfort: "₺600+" },
      { item: "Aktivite (gün)", budget: "₺0–300", mid: "₺400–800", comfort: "₺1.500+" },
      { item: "TOPLAM/gün", budget: "₺1.150–2.550", mid: "₺3.300–6.400", comfort: "₺10.100+" },
    ],
    faqs: [
      { question: "Antalya'da en iyi plajlar hangileri?", answer: "Konyaaltı (şehir merkezi), Lara (uzun kumsal), Kaputaş (koyda turkuaz), Olympos (tarihi), Phaselis (antik kent yanı). Kleopatra Plajı Alanya'da." },
      { question: "Antalya'dan günübirlik nereler gezilir?", answer: "Perge ve Aspendos antik kentleri (30–45 dk), Düden Şelalesi (15 dk), Manavgat (75 dk), Pamukkale (3 saat), Saklıkent Kanyonu (2 saat)." },
      { question: "Antalya pahalı mı?", answer: "Türkiye ortalamasında. All-inclusive oteller rekabetçi fiyatlı. Kaleiçi'nde butik oteller €40–80/gece. Sokak yemeği ₺100–200." },
    ],
  },

  izmir: {
    tldr: "İzmir, Ege kıyısında Türkiye'nin üçüncü büyük şehri. Kordon boyu yürüyüşü, Kemeraltı Çarşısı, antik Efes harabeleri ve Çeşme-Alaçatı plajları. Ege mutfağının başkenti — zeytinyağlılar, otlar ve deniz ürünleri. Günlük bütçe ₺800–1.800. Dijital göçebeler için yükselen bir merkez.",
    quickAnswer: "İzmir'de 3–4 gün kalın (Efes ve Çeşme dahil), Mayıs–Ekim en ideal dönem.",
    lastUpdated: "Nisan 2026",
    idealFor: ["Dijital Göçebeler", "Gurme Gezginler", "Çiftler", "Kültür Meraklıları"],
    suggestedDays: "3–4 gün",
    visa: "Birçok ülke vatandaşı e-Vize ile giriş yapabilir.",
    safety: "Güvenli ve yaşanabilir bir şehir. Gece bile rahat. Kordon ve Alsancak bölgeleri canlı.",
    transport: "Adnan Menderes Havalimanı (ADB) merkeze İZBAN treni ile 25 dk. Şehir içi metro, İZBAN, otobüs ve vapur (Karşıyaka-Konak). İzmirkart zorunlu.",
    food: "Boyoz (İzmir'e özel hamur işi), kumru (Çeşme sandviçi), lokma, İzmir köfte, zeytinyağlılar, enginar. Kemeraltı'nda sokak lezzetleri, Kordon'da balık restoranları.",
    seasons: [
      { period: "Mar–May", temp: "12–25°C", crowd: "Orta", price: "Orta", note: "Alaçatı Ot Festivali, Efes gezisi için ideal" },
      { period: "Haz–Ağu", temp: "25–35°C", crowd: "Yüksek", price: "Yüksek", note: "Çeşme-Alaçatı sezonu, rüzgar sörfü" },
      { period: "Eyl–Kas", temp: "18–28°C", crowd: "Orta", price: "Orta", note: "İzmir Fuarı Eylül, deniz hâlâ sıcak" },
      { period: "Ara–Şub", temp: "6–14°C", crowd: "Düşük", price: "Düşük", note: "Kış, yerel yaşam deneyimi" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "₺600–1.200", mid: "₺1.500–3.000", comfort: "₺5.000+" },
      { item: "Yemek (gün)", budget: "₺250–500", mid: "₺600–1.000", comfort: "₺1.500+" },
      { item: "Ulaşım (gün)", budget: "₺30–100", mid: "₺150–300", comfort: "₺500+" },
      { item: "Aktivite (gün)", budget: "₺0–200", mid: "₺300–600", comfort: "₺1.000+" },
      { item: "TOPLAM/gün", budget: "₺880–2.000", mid: "₺2.550–4.900", comfort: "₺8.000+" },
    ],
    faqs: [
      { question: "İzmir'den Efes'e nasıl gidilir?", answer: "Selçuk'a İZBAN + minibüs ile ~1,5 saat. Organize turlar da mevcut. Efes, Türkiye'nin en iyi korunmuş antik kenti." },
      { question: "Çeşme-Alaçatı ne zaman gidilir?", answer: "Haziran–Eylül plaj ve rüzgar sörfü sezonu. Nisan'da Ot Festivali. Kış aylarında sakin ama termal oteller açık." },
      { question: "İzmir'de nomad olarak yaşamak nasıl?", answer: "Alsancak ve Bornova'da kafeler bol. Coworking alanları artıyor. Aylık yaşam maliyeti İstanbul'dan %30 düşük. İnternet hızı iyi." },
    ],
  },

  bodrum: {
    tldr: "Bodrum, Ege'nin en glamuröz tatil beldesi. Beyaz badanalı evleri, marina kültürü, antik Mausoleum ve dünyaca ünlü gece hayatı. Günlük bütçe ₺1.200–3.000. Yaz aylarında jet-set destinasyonu, kışın sakin sahil kasabası.",
    quickAnswer: "Bodrum'da 3–5 gün kalın, Haziran–Eylül plaj sezonu, Nisan–Mayıs sakin ve uygun fiyatlı.",
    lastUpdated: "Nisan 2026",
    idealFor: ["Çiftler", "Gece Hayatı", "Yelken", "Lüks Tatil"],
    suggestedDays: "3–5 gün",
    visa: "Birçok ülke vatandaşı e-Vize ile giriş yapabilir.",
    safety: "Çok güvenli tatil beldesi. Gece hayatında standart önlemler yeterli.",
    transport: "Milas-Bodrum Havalimanı (BJV) merkeze 35 km, shuttle ve dolmuş mevcut. Şehir içi dolmuşlar yaygın. Tekne turları ile koylar arası ulaşım.",
    food: "Ege otları, çökertme kebabı, ahtapot ızgara, enginar, kabak çiçeği dolması. Gümüşlük'te balıkçı restoranları, Bodrum Marina'da üst segment mekanlar.",
    seasons: [
      { period: "Mar–May", temp: "15–25°C", crowd: "Düşük", price: "Düşük", note: "Sakin, fiyatlar uygun, doğa yeşil" },
      { period: "Haz–Ağu", temp: "25–35°C", crowd: "Çok Yüksek", price: "Çok Yüksek", note: "Yaz sezonu, beach clublar, gece hayatı" },
      { period: "Eyl–Kas", temp: "18–28°C", crowd: "Orta", price: "Orta", note: "Deniz hâlâ sıcak, kalabalık azalmış" },
      { period: "Ara–Şub", temp: "8–15°C", crowd: "Çok Düşük", price: "Düşük", note: "Sakin, mandalina sezonu" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "₺1.000–2.500", mid: "₺3.000–6.000", comfort: "₺10.000+" },
      { item: "Yemek (gün)", budget: "₺400–700", mid: "₺800–1.500", comfort: "₺3.000+" },
      { item: "Ulaşım (gün)", budget: "₺50–150", mid: "₺200–500", comfort: "₺800+" },
      { item: "Aktivite (gün)", budget: "₺0–300", mid: "₺500–1.000", comfort: "₺2.000+" },
      { item: "TOPLAM/gün", budget: "₺1.450–3.650", mid: "₺4.500–9.000", comfort: "₺15.800+" },
    ],
    faqs: [
      { question: "Bodrum'da en iyi plajlar hangileri?", answer: "Bitez (sakin, rüzgar sörfü), Gümbet (gece hayatına yakın), Camel Beach (doğal), Akyarlar (kumsal), Gümüşlük (gün batımı)." },
      { question: "Bodrum pahalı mı?", answer: "Yaz aylarında Türkiye'nin en pahalı bölgelerinden biri. Nisan–Mayıs ve Ekim'de fiyatlar %50 düşer. Beach club girişleri ₺500–2.000." },
    ],
  },

  kapadokya: {
    tldr: "Kapadokya, peri bacaları, yeraltı şehirleri ve sıcak hava balonlarıyla dünyanın en sürreal destinasyonu. Göreme Açık Hava Müzesi (UNESCO), kaya oteller ve vadiler. Günlük bütçe ₺1.000–2.500. 3 gün yeterli ama 5 gün ideal.",
    quickAnswer: "Kapadokya'da 3–5 gün kalın, Nisan–Haziran ve Eylül–Kasım en ideal dönem. Balon turu mutlaka.",
    lastUpdated: "Nisan 2026",
    idealFor: ["Çiftler", "Fotoğrafçılar", "Macera Gezginleri", "Kültür Meraklıları"],
    suggestedDays: "3–5 gün",
    visa: "Birçok ülke vatandaşı e-Vize ile giriş yapabilir.",
    safety: "Çok güvenli. Kırsal alan, suç oranı düşük. Vadilerde yürüyüşte harita/GPS kullanın.",
    transport: "Nevşehir (NAV) ve Kayseri (ASR) havalimanlarından shuttle servisler (~1 saat). Bölge içi araç kiralama veya tur önerilir. Göreme merkezde yürüyerek ulaşım mümkün.",
    food: "Testi kebabı (Kapadokya'ya özel), mantı, gözleme, çömlek kebabı, pekmez ve pastırma. Şarapçılık gelişiyor — yerel Emir ve Kalecik Karası üzümlerinden.",
    seasons: [
      { period: "Mar–May", temp: "5–20°C", crowd: "Orta", price: "Orta", note: "Bahar, yeşil vadiler, balon uçuşları stabil" },
      { period: "Haz–Ağu", temp: "18–32°C", crowd: "Yüksek", price: "Yüksek", note: "Sıcak günler, serin geceler" },
      { period: "Eyl–Kas", temp: "8–22°C", crowd: "Orta", price: "Orta", note: "Bağ bozumu, sonbahar renkleri" },
      { period: "Ara–Şub", temp: "-5–5°C", crowd: "Düşük", price: "Düşük", note: "Kar altında peri bacaları, kaya otel keyfi" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "₺800–1.500", mid: "₺2.500–5.000", comfort: "₺8.000+" },
      { item: "Yemek (gün)", budget: "₺300–500", mid: "₺600–1.000", comfort: "₺1.500+" },
      { item: "Ulaşım (gün)", budget: "₺100–200", mid: "₺300–600", comfort: "₺1.000+" },
      { item: "Aktivite (gün)", budget: "₺200–500", mid: "₺1.500–3.000", comfort: "₺5.000+" },
      { item: "TOPLAM/gün", budget: "₺1.400–2.700", mid: "₺4.900–9.600", comfort: "₺15.500+" },
    ],
    faqs: [
      { question: "Balon turu ne kadar?", answer: "Standart tur €150–250/kişi (60 dk), deluxe turlar €300+. Sabah şafakta kalkılır. Hava durumuna bağlı — iptal olabilir. En az 2 sabah ayırın." },
      { question: "Kapadokya'da kaç gün yeterli?", answer: "Ana noktalar için 2–3 gün. Vadilerde yürüyüş, yeraltı şehirleri ve Ihlara Vadisi dahil 4–5 gün ideal." },
      { question: "Kaya otelde kalmak nasıl?", answer: "Benzersiz bir deneyim. Göreme ve Uçhisar'da seçenekler bol. Bütçe kaya hosteller ₺500/gece'den, lüks suit'ler ₺5.000+/gece'den başlıyor." },
    ],
  },

  amman: {
    tldr: "Amman, Ürdün'ün başkenti ve Ortadoğu'nun en kozmopolit şehirlerinden biri. Roma kalıntıları, renkli sokak sanatı ve Arap mutfağının en iyileri. Petra ve Ölü Deniz'e kapı. Günlük bütçe $40–80. Türk vatandaşları vizesiz.",
    quickAnswer: "Amman'da 2–3 gün kalın (Petra ve Ölü Deniz dahil 5–7 gün), Mart–Mayıs ve Eylül–Kasım en ideal.",
    lastUpdated: "Nisan 2026",
    idealFor: ["Tarih Meraklıları", "Macera Gezginleri", "Gurme Gezginler"],
    suggestedDays: "2–3 gün (sadece şehir), 5–7 gün (ülke turu)",
    visa: "Türk vatandaşları vizesiz (90 gün). Jordan Pass ($70–80) ile vize + Petra girişi dahil.",
    safety: "Bölgenin en güvenli ülkelerinden. Gece bile rahat. İnsanlar çok misafirperver.",
    transport: "Queen Alia Havalimanı (AMM) merkeze 35 km, Airport Express ~5 JOD. Şehir içi taksi ve Uber/Careem yaygın. Petra'ya JETT otobüsü 4 saat.",
    food: "Mansaf (ulusal yemek, kuzu + yoğurt), falafel, hummus, kunafa (kadayıf tatlısı), şawarma. Hashem Restaurant efsanevi (1950'den beri). Rainbow Street'te kafeler.",
    seasons: [
      { period: "Mar–May", temp: "12–25°C", crowd: "Orta", price: "Orta", note: "En iyi dönem, çiçeklenme" },
      { period: "Haz–Ağu", temp: "22–35°C", crowd: "Düşük", price: "Düşük", note: "Sıcak ama kuru, Ölü Deniz ideal" },
      { period: "Eyl–Kas", temp: "15–28°C", crowd: "Orta", price: "Orta", note: "Sonbahar, Petra için ideal" },
      { period: "Ara–Şub", temp: "4–12°C", crowd: "Düşük", price: "Düşük", note: "Soğuk, ara sıra yağmur" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "$15–30", mid: "$50–100", comfort: "$150+" },
      { item: "Yemek (gün)", budget: "$8–15", mid: "$20–35", comfort: "$50+" },
      { item: "Ulaşım (gün)", budget: "$3–8", mid: "$10–20", comfort: "$40+" },
      { item: "Aktivite (gün)", budget: "$0–10", mid: "$20–50", comfort: "$80+" },
      { item: "TOPLAM/gün", budget: "$26–63", mid: "$100–205", comfort: "$320+" },
    ],
    faqs: [
      { question: "Jordan Pass nedir?", answer: "Vize ücreti + Petra girişi + 40'tan fazla yer dahil. $70 (1 gün Petra) veya $75 (2 gün) veya $80 (3 gün). Havalimanından önce online alın." },
      { question: "Amman'dan Petra'ya nasıl gidilir?", answer: "JETT otobüsü ~4 saat, 11 JOD. Araç kiralama da yaygın. Organize turlar 1 veya 2 günlük." },
    ],
  },

  baku: {
    tldr: "Bakü, Azerbaycan'ın başkenti ve Hazar Denizi kıyısında modern ile tarihin buluştuğu şehir. Alevler Kulesi, UNESCO listesindeki İçerişehir, Haydar Aliyev Merkezi. Günlük bütçe $25–50. Türk vatandaşları e-Vize veya ASAN vize ile girebilir.",
    quickAnswer: "Bakü'de 3–4 gün kalın, Nisan–Haziran ve Eylül–Ekim en ideal dönem.",
    lastUpdated: "Nisan 2026",
    idealFor: ["Fotoğrafçılar", "Kültür Meraklıları", "Bütçe Gezginleri"],
    suggestedDays: "3–4 gün",
    visa: "Türk vatandaşları ASAN vize ($20) veya e-Vize ile girebilir. Havalimanında da alınabilir.",
    safety: "Güvenli bir başkent. Gece bile rahat yürünebilir. Yardımsever insanlar.",
    transport: "Heydar Aliyev Havalimanı (GYD) merkeze 25 km, Airport Express otobüsü ~30 dk. Metro, otobüs ve BakuCard ile ulaşım.",
    food: "Plov (pirinç pilavı), dolma, piti (et çorbası), gutab (ince börek), şah plov, baklava. Bulvar'da balık restoranları, İçerişehir'de geleneksel mekanlar.",
    seasons: [
      { period: "Mar–May", temp: "8–22°C", crowd: "Orta", price: "Orta", note: "Bahar, Novruz Bayramı" },
      { period: "Haz–Ağu", temp: "22–35°C", crowd: "Yüksek", price: "Yüksek", note: "F1 Grand Prix Haziran" },
      { period: "Eyl–Kas", temp: "12–25°C", crowd: "Orta", price: "Orta", note: "Sonbahar, ılık" },
      { period: "Ara–Şub", temp: "2–8°C", crowd: "Düşük", price: "Düşük", note: "Rüzgarlı, soğuk" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "$12–25", mid: "$40–80", comfort: "$120+" },
      { item: "Yemek (gün)", budget: "$8–15", mid: "$18–30", comfort: "$45+" },
      { item: "Ulaşım (gün)", budget: "$2–5", mid: "$5–12", comfort: "$20+" },
      { item: "Aktivite (gün)", budget: "$0–5", mid: "$10–20", comfort: "$30+" },
      { item: "TOPLAM/gün", budget: "$22–50", mid: "$73–142", comfort: "$215+" },
    ],
    faqs: [
      { question: "Bakü pahalı mı?", answer: "Avrupa'ya göre çok uygun. Günlük $25–50 ile rahat gezilir. Taksi çok ucuz (~$2–5 şehir içi)." },
      { question: "Bakü'de kaç gün yeterli?", answer: "Şehir için 2–3 gün yeterli. Gobustan kaya resimleri ve çamur volkanları için +1 gün ekleyin." },
    ],
  },

  belgrad: {
    tldr: "Belgrad, Sırbistan'ın başkenti ve Avrupa'nın en dinamik gece hayatına sahip şehri. Tuna ve Sava nehirlerinin birleştiği noktada, Kalemegdan Kalesi ile taçlanan tarihi merkez. Günlük bütçe €25–50. Schengen vizesi gerekli değil — vizesiz giriş.",
    quickAnswer: "Belgrad'da 2–4 gün kalın, Mayıs–Ekim en ideal dönem. Gece hayatı Avrupa'nın en iyilerinden.",
    lastUpdated: "Nisan 2026",
    idealFor: ["Gece Hayatı", "Bütçe Gezginleri", "Solo Gezginler", "Dijital Göçebeler"],
    suggestedDays: "2–4 gün",
    visa: "Türk vatandaşları 90 gün vizesiz. AB vatandaşları da vizesiz.",
    safety: "Genel olarak güvenli. Gece hayatı bölgelerinde standart dikkat yeterli.",
    transport: "Nikola Tesla Havalimanı (BEG) merkeze 18 km, otobüs veya taksi ~30 dk. Şehir içi otobüs ve tramvay. Taksi uygun fiyatlı.",
    food: "Ćevapi (köfte), pljeskavica (dev hamburger), burek, sarma, kaymak. Skadarlija sokağında (Belgrad'ın Montmartre'ı) canlı müzik eşliğinde yemek.",
    seasons: [
      { period: "Mar–May", temp: "8–22°C", crowd: "Orta", price: "Düşük", note: "Bahar, parklar yeşeriyor" },
      { period: "Haz–Ağu", temp: "18–32°C", crowd: "Yüksek", price: "Orta", note: "EXIT Festival Temmuz, nehir barları" },
      { period: "Eyl–Kas", temp: "8–22°C", crowd: "Orta", price: "Düşük", note: "Sonbahar, şarap sezonu" },
      { period: "Ara–Şub", temp: "-2–5°C", crowd: "Düşük", price: "Düşük", note: "Soğuk, ama kapalı mekanlar canlı" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "€10–20", mid: "€35–70", comfort: "€100+" },
      { item: "Yemek (gün)", budget: "€5–12", mid: "€15–25", comfort: "€40+" },
      { item: "Ulaşım (gün)", budget: "€2–4", mid: "€5–10", comfort: "€15+" },
      { item: "Aktivite (gün)", budget: "€0–5", mid: "€8–15", comfort: "€25+" },
      { item: "TOPLAM/gün", budget: "€17–41", mid: "€63–120", comfort: "€180+" },
    ],
    faqs: [
      { question: "Belgrad gece hayatı nasıl?", answer: "Avrupa'nın en iyi gece hayatlarından biri. Savamala bölgesi ve nehir üstü splavovi (yüzen barlar) efsanevi. Gece 02:00'de başlar, sabaha kadar sürer." },
      { question: "Belgrad ucuz mu?", answer: "Avrupa'nın en ucuz başkentlerinden. Bira €1.50, yemek €5–8, hostel €10/gece." },
    ],
  },

  floransa: {
    tldr: "Floransa, Rönesans'ın doğduğu şehir ve İtalya'nın sanat başkenti. Uffizi Galerisi, Duomo, Ponte Vecchio ve Michelangelo'nun Davut heykeli. Toskana mutfağının merkezi. Günlük bütçe €60–100. Schengen vizesi gerekli.",
    quickAnswer: "Floransa'da 2–4 gün kalın, Nisan–Haziran ve Eylül–Ekim en ideal. Müze biletlerini önceden alın.",
    lastUpdated: "Nisan 2026",
    idealFor: ["Sanat Meraklıları", "Çiftler", "Gurme Gezginler", "Kültür Meraklıları"],
    suggestedDays: "2–4 gün",
    visa: "Schengen vizesi gerekli.",
    safety: "Güvenli bir şehir. Turistik alanlarda yankesicilere dikkat.",
    transport: "Amerigo Vespucci Havalimanı (FLR) merkeze 5 km, tramvay ile 20 dk. Pisa Havalimanı da seçenek (1 saat). Tarihi merkez yürüyerek gezilir.",
    food: "Bistecca alla fiorentina (T-bone steak), ribollita (ekmek çorbası), pappa al pomodoro, lampredotto (İşkembe sandviç — sokak yemeği), gelato. Mercato Centrale'de yerel lezzetler.",
    seasons: [
      { period: "Mar–May", temp: "10–23°C", crowd: "Yüksek", price: "Yüksek", note: "Bahar, çiçeklenme, Paskalya" },
      { period: "Haz–Ağu", temp: "20–35°C", crowd: "Çok Yüksek", price: "Çok Yüksek", note: "Sıcak, çok kalabalık" },
      { period: "Eyl–Kas", temp: "12–25°C", crowd: "Yüksek", price: "Yüksek", note: "Sonbahar, Toskana üzüm hasadı" },
      { period: "Ara–Şub", temp: "2–10°C", crowd: "Düşük", price: "Orta", note: "Sakin, müzelerde kuyruk yok" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "€30–60", mid: "€80–150", comfort: "€250+" },
      { item: "Yemek (gün)", budget: "€15–25", mid: "€30–50", comfort: "€80+" },
      { item: "Ulaşım (gün)", budget: "€0–5", mid: "€5–10", comfort: "€20+" },
      { item: "Aktivite (gün)", budget: "€10–20", mid: "€25–50", comfort: "€80+" },
      { item: "TOPLAM/gün", budget: "€55–110", mid: "€140–260", comfort: "€430+" },
    ],
    faqs: [
      { question: "Uffizi bileti önceden alınmalı mı?", answer: "Kesinlikle evet. Özellikle ilkbahar ve yaz aylarında kuyruklar saatlerce. Online bilet €20–25. Combo bilet ile Palazzo Pitti dahil." },
      { question: "Floransa'dan Toskana günübirlik gezi?", answer: "Siena (1,5 saat), San Gimignano (1 saat), Chianti bölgesi (şarap turları), Pisa (1 saat), Lucca (1,5 saat)." },
    ],
  },

  kopenhag: {
    tldr: "Kopenhag, Danimarka'nın başkenti ve 'hygge' kavramının doğum yeri. Nyhavn'ın renkli evleri, Tivoli Bahçeleri, bisiklet kültürü ve Yeni İskandinav mutfağı. Dünyanın en yaşanabilir şehirlerinden biri. Günlük bütçe €70–120. Schengen vizesi gerekli.",
    quickAnswer: "Kopenhag'da 2–4 gün kalın, Mayıs–Eylül en ideal dönem. Bisiklet kiralayın.",
    lastUpdated: "Nisan 2026",
    idealFor: ["Tasarım Meraklıları", "Çiftler", "Bisiklet Severler", "Gurme Gezginler"],
    suggestedDays: "2–4 gün",
    visa: "Schengen vizesi gerekli.",
    safety: "Dünyanın en güvenli başkentlerinden biri.",
    transport: "Kastrup Havalimanı (CPH) merkeze metro ile 15 dk. Şehir bisikletle gezilir — Donkey Republic veya Bycyklen. Metro, S-tog ve otobüs yaygın. Copenhagen Card ile ulaşım + müzeler dahil.",
    food: "Smørrebrød (açık yüzlü sandviç), frikadeller (köfte), kanelsnegle (tarçınlı çörek), hot dog (pølsevogn). Torvehallerne'de gurme market. Noma ve Geranium dünyanın en iyi restoranları arasında.",
    seasons: [
      { period: "Mar–May", temp: "3–16°C", crowd: "Orta", price: "Orta", note: "Bahar, Tivoli açılışı Nisan" },
      { period: "Haz–Ağu", temp: "14–23°C", crowd: "Yüksek", price: "Yüksek", note: "Uzun günler, açık hava etkinlikleri" },
      { period: "Eyl–Kas", temp: "5–15°C", crowd: "Orta", price: "Orta", note: "Sonbahar, Tivoli Cadılar Bayramı" },
      { period: "Ara–Şub", temp: "-1–4°C", crowd: "Düşük", price: "Orta", note: "Tivoli Noel, hygge sezonu" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "€30–60", mid: "€100–180", comfort: "€250+" },
      { item: "Yemek (gün)", budget: "€20–35", mid: "€40–60", comfort: "€100+" },
      { item: "Ulaşım (gün)", budget: "€5–10", mid: "€12–18", comfort: "€25+" },
      { item: "Aktivite (gün)", budget: "€5–15", mid: "€20–40", comfort: "€60+" },
      { item: "TOPLAM/gün", budget: "€60–120", mid: "€172–298", comfort: "€435+" },
    ],
    faqs: [
      { question: "Kopenhag pahalı mı?", answer: "Evet, Avrupa'nın en pahalı şehirlerinden. Ama Copenhagen Card (€60–100) ile ulaşım ve müzeler dahil. Sokak yemeği ve market alışverişi ile bütçe düşer." },
      { question: "Christiania nedir?", answer: "1971'den beri var olan özerk topluluk / 'serbest şehir'. Renkli duvar resimleri, alternatif yaşam. Fotoğraf çekmek hassas konu — önceden sorun." },
    ],
  },

  madrid: {
    tldr: "Madrid, İspanya'nın başkenti ve kültür merkezi. Prado Müzesi, Kraliyet Sarayı, Retiro Parkı ve dünyanın en geç yenen akşam yemekleri. Tapas kültürü, flamenko ve futbol tutkusu. Günlük bütçe €50–90. Schengen vizesi gerekli.",
    quickAnswer: "Madrid'de 3–4 gün kalın, Nisan–Haziran ve Eylül–Kasım en ideal. Tapas turuna çıkın.",
    lastUpdated: "Nisan 2026",
    idealFor: ["Kültür Meraklıları", "Gurme Gezginler", "Gece Hayatı", "Sanat Meraklıları"],
    suggestedDays: "3–4 gün",
    visa: "Schengen vizesi gerekli.",
    safety: "Güvenli bir başkent. Metro ve turistik alanlarda yankesicilere dikkat.",
    transport: "Barajas Havalimanı (MAD) merkeze metro ile 30 dk (~€5). Metro çok kapsamlı (13 hat). 10'lu bilet €12.20. Cercanías banliyö trenleri. Toledo ve Segovia günübirlik tren ile.",
    food: "Tapas (patatas bravas, jamón, croquetas), bocadillo de calamares (kalamar sandviçi), cocido madrileño (nohut güveci), churros con chocolate. Mercado de San Miguel'de gurme tapas.",
    seasons: [
      { period: "Mar–May", temp: "10–22°C", crowd: "Orta", price: "Orta", note: "Bahar, San Isidro festivali Mayıs" },
      { period: "Haz–Ağu", temp: "20–36°C", crowd: "Yüksek", price: "Yüksek", note: "Çok sıcak, plaj yok ama havuzlar açık" },
      { period: "Eyl–Kas", temp: "10–25°C", crowd: "Orta", price: "Orta", note: "Sonbahar, kültürel sezon başlangıcı" },
      { period: "Ara–Şub", temp: "2–10°C", crowd: "Düşük", price: "Düşük", note: "Soğuk ama güneşli, Noel pazarları" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "€25–50", mid: "€70–130", comfort: "€200+" },
      { item: "Yemek (gün)", budget: "€12–20", mid: "€25–45", comfort: "€70+" },
      { item: "Ulaşım (gün)", budget: "€3–6", mid: "€8–15", comfort: "€25+" },
      { item: "Aktivite (gün)", budget: "€0–10", mid: "€15–30", comfort: "€50+" },
      { item: "TOPLAM/gün", budget: "€40–86", mid: "€118–220", comfort: "€345+" },
    ],
    faqs: [
      { question: "Madrid'de ne zaman yemek yenir?", answer: "Öğle yemeği 14:00–16:00, akşam yemeği 21:00–23:00. Restoranlar bu saatlere göre açılır. Menú del día (günün menüsü) öğle yemeğinde €12–18 ile 3 çeşit." },
      { question: "Madrid'den günübirlik nereler gezilir?", answer: "Toledo (30 dk tren, UNESCO), Segovia (30 dk hızlı tren, su kemeri), El Escorial (1 saat), Ávila (1,5 saat)." },
    ],
  },

  marakes: {
    tldr: "Marakeş, Fas'ın kızıl şehri ve duyuları uyandıran bir destinasyon. Jemaa el-Fna meydanının kaotik enerjisi, medina sokaklarının labirenti, Majorelle Bahçesi ve hammam kültürü. Günlük bütçe €25–60. Vizesiz giriş (Türk vatandaşları 90 gün).",
    quickAnswer: "Marakeş'te 3–4 gün kalın, Mart–Mayıs ve Eylül–Kasım en ideal dönem. Medina'da bir riad'da kalın.",
    lastUpdated: "Nisan 2026",
    idealFor: ["Macera Gezginleri", "Fotoğrafçılar", "Çiftler", "Bütçe Gezginleri"],
    suggestedDays: "3–4 gün",
    visa: "Türk vatandaşları 90 gün vizesiz.",
    safety: "Genel olarak güvenli. Medina'da ısrarcı satıcılara ve sahte rehberlere dikkat. Gece medina sokaklarında dikkatli olun.",
    transport: "Menara Havalimanı (RAK) merkeze 6 km, taksi ~70 MAD. Medina içi yürüyerek. Calèche (at arabası) ve taksi şehir içi. Atlas Dağları ve Sahara turları organize.",
    food: "Tagine (güveç), couscous, pastilla (yufkalı pasta), harira (çorba), msemen (yağlı gözleme), nane çayı. Jemaa el-Fna meydanında sokak yemeği (akşam stantları). Riad'larda Fas mutfağı deneyimi.",
    seasons: [
      { period: "Mar–May", temp: "15–28°C", crowd: "Orta", price: "Orta", note: "Bahar, en iyi dönem, bahçeler çiçekte" },
      { period: "Haz–Ağu", temp: "25–40°C", crowd: "Düşük", price: "Düşük", note: "Çok sıcak, havuzlu riad şart" },
      { period: "Eyl–Kas", temp: "18–30°C", crowd: "Orta", price: "Orta", note: "Sonbahar, ılık" },
      { period: "Ara–Şub", temp: "8–18°C", crowd: "Düşük", price: "Düşük", note: "Serin, gece soğuk" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "€10–25", mid: "€40–80", comfort: "€150+" },
      { item: "Yemek (gün)", budget: "€5–12", mid: "€15–30", comfort: "€50+" },
      { item: "Ulaşım (gün)", budget: "€2–5", mid: "€5–12", comfort: "€20+" },
      { item: "Aktivite (gün)", budget: "€0–8", mid: "€15–30", comfort: "€50+" },
      { item: "TOPLAM/gün", budget: "€17–50", mid: "€75–152", comfort: "€270+" },
    ],
    faqs: [
      { question: "Medina'da kaybolur muyum?", answer: "Büyük ihtimalle evet — ve bu deneyimin parçası. Google Maps çoğu sokakta çalışır. Büyük camilere ve minarelere yönelin. Riad'ınızın adresini yazılı taşıyın." },
      { question: "Pazarlık nasıl yapılır?", answer: "Souk'larda pazarlık zorunlu. İlk fiyatın %40–60'ını teklif edin. Gülümseyerek, sakin pazarlık edin. Yürüyüp gitmek en iyi taktik." },
    ],
  },

  milano: {
    tldr: "Milano, İtalya'nın moda ve iş başkenti. Duomo katedrali, La Scala Operası, Son Akşam Yemeği freskosu ve Quadrilatero della Moda alışveriş bölgesi. Günlük bütçe €55–100. İtalya'nın en kozmopolit şehri.",
    quickAnswer: "Milano'da 2–3 gün kalın, Nisan–Haziran ve Eylül–Kasım en ideal. Design Week Nisan'da.",
    lastUpdated: "Nisan 2026",
    idealFor: ["Alışveriş Tutkunları", "Tasarım Meraklıları", "Sanat Meraklıları"],
    suggestedDays: "2–3 gün",
    visa: "Schengen vizesi gerekli.",
    safety: "Güvenli. Merkez istasyonu ve metro'da yankesicilere dikkat.",
    transport: "Malpensa Havalimanı (MXP) merkeze Malpensa Express ile 50 dk (€13). Linate (LIN) daha yakın. Metro 5 hat, tramvay yaygın.",
    food: "Risotto alla milanese (safranli pirinç), cotoletta (şnitzel), panettone (Noel keki), ossobuco, aperitivo kültürü (içkiyle büfe yemek, 18:00–21:00). Navigli bölgesinde aperitivo barları.",
    seasons: [
      { period: "Mar–May", temp: "10–22°C", crowd: "Yüksek", price: "Yüksek", note: "Design Week Nisan, moda haftası" },
      { period: "Haz–Ağu", temp: "20–32°C", crowd: "Orta", price: "Orta", note: "Sıcak, yerel halk sahile gider" },
      { period: "Eyl–Kas", temp: "10–22°C", crowd: "Yüksek", price: "Yüksek", note: "Moda haftası Eylül, kültürel sezon" },
      { period: "Ara–Şub", temp: "0–8°C", crowd: "Orta", price: "Orta", note: "Sisli, ama La Scala sezonu zirve" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "€30–55", mid: "€80–150", comfort: "€250+" },
      { item: "Yemek (gün)", budget: "€15–25", mid: "€30–50", comfort: "€80+" },
      { item: "Ulaşım (gün)", budget: "€5–8", mid: "€10–15", comfort: "€25+" },
      { item: "Aktivite (gün)", budget: "€5–15", mid: "€20–40", comfort: "€60+" },
      { item: "TOPLAM/gün", budget: "€55–103", mid: "€140–255", comfort: "€415+" },
    ],
    faqs: [
      { question: "Son Akşam Yemeği nasıl görülür?", answer: "Santa Maria delle Grazie kilisesinde. Bilet MUTLAKA önceden alın (aylar öncesinden doluyor). 15 dakikalık turlar, max 25 kişi. €15 + rezervasyon ücreti." },
      { question: "Aperitivo kültürü nedir?", answer: "18:00–21:00 arası bir içecek alınca büfe yemek dahil. Navigli ve Brera bölgesinde en iyi mekanlar. İçecek €8–12 ile akşam yemeği yerine geçer." },
    ],
  },

  munih: {
    tldr: "Münih, Bavyera'nın başkenti ve Alman kültürünün kalbi. Oktoberfest'in doğum yeri, bira bahçeleri, BMW, Alp Dağları'na kapı. Marienplatz, Nymphenburg Sarayı ve İngiliz Bahçesi. Günlük bütçe €55–95. Schengen vizesi gerekli.",
    quickAnswer: "Münih'te 2–4 gün kalın, Haziran–Ekim en ideal (Oktoberfest Eylül sonu). Bira bahçelerini kaçırmayın.",
    lastUpdated: "Nisan 2026",
    idealFor: ["Bira Tutkunları", "Aileler", "Kültür Meraklıları", "Kış Sporları"],
    suggestedDays: "2–4 gün",
    visa: "Schengen vizesi gerekli.",
    safety: "Almanya'nın en güvenli büyük şehirlerinden biri.",
    transport: "Franz Josef Strauss Havalimanı (MUC) merkeze S-Bahn ile 40 dk (€13). Şehir içi U-Bahn, S-Bahn, tramvay ve otobüs. Bayern Ticket ile bölgesel geziler.",
    food: "Weißwurst (beyaz sosis, sabah 12:00'den önce yenir), Schweinshaxe (domuz incik), Brezel, Obatzda (peynir ezmesi), Kaiserschmarrn (tatlı). Hofbräuhaus efsanevi bira salonu.",
    seasons: [
      { period: "Mar–May", temp: "3–18°C", crowd: "Orta", price: "Orta", note: "Bahar, bira bahçeleri açılıyor" },
      { period: "Haz–Ağu", temp: "14–25°C", crowd: "Yüksek", price: "Yüksek", note: "Yaz, İngiliz Bahçesi'nde bira" },
      { period: "Eyl–Kas", temp: "5–18°C", crowd: "Çok Yüksek", price: "Çok Yüksek", note: "Oktoberfest! Otel 6 ay öncesinden dolur" },
      { period: "Ara–Şub", temp: "-3–4°C", crowd: "Orta", price: "Orta", note: "Noel pazarları, kayak sezonu" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "€25–50", mid: "€80–150", comfort: "€220+" },
      { item: "Yemek (gün)", budget: "€12–22", mid: "€25–45", comfort: "€70+" },
      { item: "Ulaşım (gün)", budget: "€5–8", mid: "€10–15", comfort: "€25+" },
      { item: "Aktivite (gün)", budget: "€0–10", mid: "€15–30", comfort: "€50+" },
      { item: "TOPLAM/gün", budget: "€42–90", mid: "€130–240", comfort: "€365+" },
    ],
    faqs: [
      { question: "Oktoberfest ne zaman?", answer: "Eylül ortası – Ekim ilk haftası (16 gün). Giriş ücretsiz ama masa bulmak zor. Sabah erken gidin veya hafta içi deneyin. Bir maß (1L) bira €14–16." },
      { question: "Münih'ten Alpler'e gidilebilir mi?", answer: "Evet, Bayern Ticket (€27) ile Garmisch-Partenkirchen (1,5 saat), Neuschwanstein Şatosu (2 saat), Salzburg (1,5 saat) günübirlik." },
    ],
  },

  frankfurt: {
    tldr: "Frankfurt, Avrupa'nın finans merkezi ve Almanya'nın ulaşım hub'ı. Modern gökdelenler ('Mainhattan'), tarihi Römer Meydanı ve Müze Kıyısı (Museumsufer). Avrupa Merkez Bankası ve elma şarabı kültürü. Günlük bütçe €50–90.",
    quickAnswer: "Frankfurt'ta 1–2 gün yeterli, transit hub olarak ideal. Römer, müzeler ve Sachsenhausen.",
    lastUpdated: "Nisan 2026",
    idealFor: ["İş Seyahati", "Transit Gezginler", "Kültür Meraklıları"],
    suggestedDays: "1–2 gün",
    visa: "Schengen vizesi gerekli.",
    safety: "Güvenli. Hauptbahnhof çevresi gece biraz hassas.",
    transport: "Frankfurt Havalimanı (FRA) Avrupa'nın en büyük hub'larından. S-Bahn ile merkeze 15 dk. Şehir içi U-Bahn, S-Bahn ve tramvay.",
    food: "Grüne Soße (yeşil sos, yumurta ile), Handkäs mit Musik (el peyniri), Rippchen (kaburga), Apfelwein (elma şarabı). Sachsenhausen'de geleneksel elma şarabı lokantaları.",
    seasons: [
      { period: "Mar–May", temp: "5–20°C", crowd: "Orta", price: "Orta", note: "Bahar, Main nehri kenarında yürüyüş" },
      { period: "Haz–Ağu", temp: "15–28°C", crowd: "Yüksek", price: "Yüksek", note: "Museumsuferfest Ağustos" },
      { period: "Eyl–Kas", temp: "6–18°C", crowd: "Yüksek", price: "Yüksek", note: "Kitap fuarı Ekim" },
      { period: "Ara–Şub", temp: "-1–5°C", crowd: "Orta", price: "Orta", note: "Noel pazarı Römerberg'de" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "€25–50", mid: "€70–140", comfort: "€200+" },
      { item: "Yemek (gün)", budget: "€12–20", mid: "€25–45", comfort: "€70+" },
      { item: "Ulaşım (gün)", budget: "€5–8", mid: "€10–15", comfort: "€25+" },
      { item: "Aktivite (gün)", budget: "€0–10", mid: "€15–30", comfort: "€50+" },
      { item: "TOPLAM/gün", budget: "€42–88", mid: "€120–230", comfort: "€345+" },
    ],
    faqs: [
      { question: "Frankfurt transit için kaç saat yeterli?", answer: "Havalimanından merkeze 15 dk. 4–6 saat ile Römer Meydanı, Alte Oper ve Sachsenhausen'de elma şarabı mümkün." },
    ],
  },

  newyork: {
    tldr: "New York, 'asla uyumayan şehir' ve dünyanın kültür başkenti. Times Square, Central Park, Özgürlük Anıtı, Broadway ve 800+ dil konuşulan kozmopolit yapı. Günlük bütçe $80–150. ESTA veya B1/B2 vize gerekli.",
    quickAnswer: "New York'ta 4–7 gün kalın, Nisan–Haziran ve Eylül–Kasım en ideal. CityPASS ile tasarruf edin.",
    lastUpdated: "Nisan 2026",
    idealFor: ["Kültür Meraklıları", "Alışveriş Tutkunları", "Solo Gezginler", "Sanat Meraklıları"],
    suggestedDays: "4–7 gün",
    visa: "Türk vatandaşları B1/B2 turist vizesi başvurusu yapmalı. ABD vizesi süreci uzun.",
    safety: "Büyük şehir tedbirleri gerekli. Manhattan genelde güvenli. Metro gece biraz hassas. Times Square ve turistik alanlar kalabalık.",
    transport: "JFK, LaGuardia ve Newark havalimanları. JFK'dan AirTrain + metro ile Manhattan'a ~1 saat ($10.75). Metro 24 saat çalışır. MetroCard veya OMNY kontaksız ödeme. Uber/Lyft yaygın.",
    food: "Pizza (Joe's Pizza, Di Fara), bagel (Russ & Daughters), pastrami sandviç (Katz's Deli), cheesecake, hot dog. Chinatown, Little Italy, Koreatown'da etnik mutfaklar. Halal Guys sokak yemeği.",
    seasons: [
      { period: "Mar–May", temp: "5–22°C", crowd: "Yüksek", price: "Yüksek", note: "Bahar, Central Park çiçeklenme" },
      { period: "Haz–Ağu", temp: "22–33°C", crowd: "Çok Yüksek", price: "Çok Yüksek", note: "Sıcak ve nemli, açık hava etkinlikleri" },
      { period: "Eyl–Kas", temp: "8–22°C", crowd: "Yüksek", price: "Yüksek", note: "Sonbahar, Central Park'ta yaprak renkleri" },
      { period: "Ara–Şub", temp: "-3–5°C", crowd: "Orta", price: "Orta", note: "Kış, Noel vitrini, buz pateni" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "$40–80", mid: "$150–300", comfort: "$400+" },
      { item: "Yemek (gün)", budget: "$20–35", mid: "$40–70", comfort: "$120+" },
      { item: "Ulaşım (gün)", budget: "$5–10", mid: "$15–30", comfort: "$50+" },
      { item: "Aktivite (gün)", budget: "$0–20", mid: "$30–60", comfort: "$100+" },
      { item: "TOPLAM/gün", budget: "$65–145", mid: "$235–460", comfort: "$670+" },
    ],
    faqs: [
      { question: "New York pahalı mı?", answer: "Evet, dünyanın en pahalı şehirlerinden. Ama $1 pizza dilimi, ücretsiz park ve müzeler (bazı günler) ile bütçe yönetilebilir. Konaklama en büyük kalem." },
      { question: "Broadway bileti nasıl alınır?", answer: "TKTS kabininden (Times Square) aynı gün %20–50 indirimli. Lottery ve rush ticket'lar $30–40. Hamilton, Wicked, Lion King en popüler." },
      { question: "Manhattan'da hangi bölgede kalınır?", answer: "Midtown (merkezi, turistik), Lower East Side (trendy, daha uygun), Brooklyn Williamsburg (hipster, Manhattan'a metro ile 10 dk), Upper West Side (sakin, Central Park yanı)." },
    ],
  },

  sarajevo: {
    tldr: "Saraybosna, Bosna Hersek'in başkenti ve Doğu ile Batı'nın buluştuğu benzersiz şehir. Osmanlı Baščaršija çarşısı, Avusturya-Macaristan mimarisi ve savaş tarihinin izleri bir arada. Günlük bütçe €20–40. Türk vatandaşları vizesiz.",
    quickAnswer: "Saraybosna'da 2–3 gün kalın, Mayıs–Ekim en ideal. Osmanlı mirası ve savaş tarihi bir arada.",
    lastUpdated: "Nisan 2026",
    idealFor: ["Tarih Meraklıları", "Bütçe Gezginleri", "Solo Gezginler"],
    suggestedDays: "2–3 gün",
    visa: "Türk vatandaşları 90 gün vizesiz.",
    safety: "Güvenli. Savaştan kalan mayın riski sadece kırsal alanlarda — işaretli yollardan çıkmayın.",
    transport: "Saraybosna Havalimanı (SJJ) merkeze 12 km, taksi ~15 BAM. Tramvay şehir merkezinde. Mostar'a tren veya otobüs 2–3 saat.",
    food: "Ćevapi (Baščaršija'da mutlaka deneyin), burek, begova čorba, bosanski lonac, tufahije (elma tatlısı), Bosna kahvesi. Zeljo's en ünlü ćevapi restoranı.",
    seasons: [
      { period: "Mar–May", temp: "5–20°C", crowd: "Düşük", price: "Düşük", note: "Bahar, şehir yeşeriyor" },
      { period: "Haz–Ağu", temp: "15–30°C", crowd: "Orta", price: "Orta", note: "Yaz festivali, Sarajevo Film Festivali" },
      { period: "Eyl–Kas", temp: "6–20°C", crowd: "Düşük", price: "Düşük", note: "Sonbahar, sakin" },
      { period: "Ara–Şub", temp: "-4–3°C", crowd: "Düşük", price: "Düşük", note: "Kar, kayak (Jahorina, Bjelašnica)" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "€8–18", mid: "€30–60", comfort: "€90+" },
      { item: "Yemek (gün)", budget: "€5–10", mid: "€12–22", comfort: "€35+" },
      { item: "Ulaşım (gün)", budget: "€1–3", mid: "€3–8", comfort: "€15+" },
      { item: "Aktivite (gün)", budget: "€0–5", mid: "€8–15", comfort: "€25+" },
      { item: "TOPLAM/gün", budget: "€14–36", mid: "€53–105", comfort: "€165+" },
    ],
    faqs: [
      { question: "Saraybosna güvenli mi?", answer: "Evet, şehir çok güvenli. Savaş izleri görünür ama insanlar sıcak ve yardımsever. Kırsal alanlarda mayınlı bölgelere dikkat (işaretli)." },
      { question: "Mostar günübirlik gezi yapılabilir mi?", answer: "Evet, otobüs veya araçla 2–2,5 saat. Stari Most köprüsü, Osmanlı çarşısı. Blagaj Tekkesi de yakın. Tam gün ayırın." },
    ],
  },

  seul: {
    tldr: "Seul, Güney Kore'nin başkenti ve K-pop, K-drama kültürünün merkezi. Antik saraylar ile geleceğin mimarisinin yan yana durduğu mega metropol. Sokak yemeği cenneti. Günlük bütçe $40–80. e-Vize veya K-ETA gerekli.",
    quickAnswer: "Seul'de 4–5 gün kalın, Nisan (kiraz çiçeği) ve Eylül–Kasım en ideal dönem.",
    lastUpdated: "Nisan 2026",
    idealFor: ["K-pop Hayranları", "Gurme Gezginler", "Alışveriş Tutkunları", "Kültür Meraklıları"],
    suggestedDays: "4–5 gün",
    visa: "Türk vatandaşları K-ETA ile 90 gün vizesiz (ön başvuru gerekli). Bazı dönemlerde K-ETA muafiyeti uygulanıyor.",
    safety: "Dünyanın en güvenli büyük şehirlerinden biri. Gece bile her yerde rahat.",
    transport: "Incheon Havalimanı (ICN) merkeze AREX ekspres ile 45 dk (₩9.500). Metro 23 hat ile devasa. T-Money kart zorunlu. KTX hızlı tren Busan'a 2,5 saat.",
    food: "Korean BBQ (samgyeopsal, galbi), bibimbap, tteokbokki (acılı pirinç keki), kimchi jjigae, chimaek (tavuk + bira). Gwangjang Market'te sokak yemeği. Michelin yıldızlı restoranlar da uygun fiyatlı.",
    seasons: [
      { period: "Mar–May", temp: "5–22°C", crowd: "Yüksek", price: "Yüksek", note: "Kiraz çiçeği Nisan, en güzel dönem" },
      { period: "Haz–Ağu", temp: "22–32°C", crowd: "Orta", price: "Orta", note: "Muson yağmurları Temmuz, nemli" },
      { period: "Eyl–Kas", temp: "8–25°C", crowd: "Yüksek", price: "Yüksek", note: "Sonbahar renkleri, Chuseok festivali" },
      { period: "Ara–Şub", temp: "-8–3°C", crowd: "Düşük", price: "Düşük", note: "Çok soğuk, kayak, kış festivalleri" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "$15–30", mid: "$50–100", comfort: "$180+" },
      { item: "Yemek (gün)", budget: "$10–18", mid: "$25–40", comfort: "$60+" },
      { item: "Ulaşım (gün)", budget: "$3–6", mid: "$8–15", comfort: "$25+" },
      { item: "Aktivite (gün)", budget: "$0–10", mid: "$15–30", comfort: "$50+" },
      { item: "TOPLAM/gün", budget: "$28–64", mid: "$98–185", comfort: "$315+" },
    ],
    faqs: [
      { question: "Seul'de hangi bölgede kalınır?", answer: "Myeongdong (alışveriş, turistik), Hongdae (genç, gece hayatı, K-pop), Itaewon (uluslararası, barlar), Gangnam (lüks, K-pop merkezleri), Insadong (geleneksel, sanat)." },
      { question: "K-pop deneyimi nasıl yaşanır?", answer: "HYBE Insight (BTS), SM Town (COEX Mall), K-pop road (Gangnam). Inkigayo ve Music Bank canlı yayın kayıtları ücretsiz ama bilet zor bulunur." },
    ],
  },

  stockholm: {
    tldr: "Stockholm, İsveç'in başkenti ve 14 adanın üzerinde kurulu 'Kuzey'in Venedik'i'. Nobel Müzesi, ABBA Müzesi, Gamla Stan ve İskandinav tasarım mirası. Günlük bütçe €70–120. Schengen vizesi gerekli.",
    quickAnswer: "Stockholm'de 3–4 gün kalın, Mayıs–Eylül en ideal (uzun günler, +18 saat güneş).",
    lastUpdated: "Nisan 2026",
    idealFor: ["Tasarım Meraklıları", "Doğa Severler", "Kültür Meraklıları"],
    suggestedDays: "3–4 gün",
    visa: "Schengen vizesi gerekli.",
    safety: "Dünyanın en güvenli başkentlerinden biri.",
    transport: "Arlanda Havalimanı (ARN) merkeze Arlanda Express ile 20 dk (~SEK 299). Metro, otobüs ve vapur. SL Access kart zorunlu. Adalar arası vapur keyifli.",
    food: "Köttbullar (İsveç köftesi), smörgåsbord (büfe), kanelbullar (tarçınlı çörek), gravlax (somon), fika kültürü (kahve + pasta). Östermalms Saluhall'da gurme market.",
    seasons: [
      { period: "Mar–May", temp: "0–15°C", crowd: "Orta", price: "Orta", note: "Bahar, günler uzuyor" },
      { period: "Haz–Ağu", temp: "15–25°C", crowd: "Yüksek", price: "Yüksek", note: "Beyaz geceler, Midsommar" },
      { period: "Eyl–Kas", temp: "3–12°C", crowd: "Orta", price: "Orta", note: "Sonbahar renkleri, Nobel sezonu" },
      { period: "Ara–Şub", temp: "-5–2°C", crowd: "Düşük", price: "Orta", note: "Karanlık ama Noel pazarları" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "€30–60", mid: "€100–180", comfort: "€280+" },
      { item: "Yemek (gün)", budget: "€18–30", mid: "€35–55", comfort: "€90+" },
      { item: "Ulaşım (gün)", budget: "€5–10", mid: "€12–18", comfort: "€25+" },
      { item: "Aktivite (gün)", budget: "€5–15", mid: "€20–40", comfort: "€60+" },
      { item: "TOPLAM/gün", budget: "€58–115", mid: "€167–293", comfort: "€455+" },
    ],
    faqs: [
      { question: "Stockholm pahalı mı?", answer: "Evet, İskandinav standartlarında orta. Stockholm Pass (€70–100) ile müzeler ve toplu taşıma dahil. Fika (kahve+pasta) en ucuz keyif ~SEK 50–80." },
      { question: "Gamla Stan'da ne yapılır?", answer: "Ortaçağ sokakları, Kraliyet Sarayı, Nobel Müzesi, Stortorget meydanı. 2–3 saatte yürüyerek gezilir. Kalabalık ama kaçırılmamalı." },
    ],
  },

  venedik: {
    tldr: "Venedik, su üzerine kurulu eşsiz şehir ve İtalya'nın en romantik destinasyonu. 118 ada, 400+ köprü, San Marco Meydanı, gondol turları ve Murano cam sanatı. Günlük bütçe €65–120. Giriş ücreti uygulanıyor (2024'ten beri bazı günler €5).",
    quickAnswer: "Venedik'te 2–3 gün kalın, Nisan–Haziran ve Eylül–Ekim en ideal. Karnaval Şubat'ta.",
    lastUpdated: "Nisan 2026",
    idealFor: ["Çiftler", "Sanat Meraklıları", "Fotoğrafçılar"],
    suggestedDays: "2–3 gün",
    visa: "Schengen vizesi gerekli.",
    safety: "Çok güvenli. Su baskını (acqua alta) riski sonbahar/kış — bot getirin.",
    transport: "Marco Polo Havalimanı (VCE) merkeze vaporetto veya Alilaguna su otobüsü ile 1 saat (€15). Şehir içi vaporetto (su otobüsü). ACTV 24/48/72 saatlik kart (€25/35/45). Araba yok.",
    food: "Cicchetti (Venedik tapası), risotto al nero di seppia (mürekkep balıklı risotto), sarde in saor (sardalya), fegato alla veneziana (ciğer), spritz (aperitif). Rialto Köprüsü yanında Cantina Do Spade.",
    seasons: [
      { period: "Mar–May", temp: "8–22°C", crowd: "Yüksek", price: "Yüksek", note: "Karnaval Şubat sonu, Bienal tek yıllar" },
      { period: "Haz–Ağu", temp: "20–30°C", crowd: "Çok Yüksek", price: "Çok Yüksek", note: "Film festivali Eylül" },
      { period: "Eyl–Kas", temp: "10–22°C", crowd: "Yüksek", price: "Yüksek", note: "Acqua alta riski Kasım" },
      { period: "Ara–Şub", temp: "0–8°C", crowd: "Orta", price: "Orta", note: "Karnaval, sisli romantik atmosfer" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "€30–70", mid: "€100–200", comfort: "€350+" },
      { item: "Yemek (gün)", budget: "€15–25", mid: "€35–60", comfort: "€100+" },
      { item: "Ulaşım (gün)", budget: "€10–15", mid: "€18–25", comfort: "€40+" },
      { item: "Aktivite (gün)", budget: "€5–15", mid: "€25–50", comfort: "€80+" },
      { item: "TOPLAM/gün", budget: "€60–125", mid: "€178–335", comfort: "€570+" },
    ],
    faqs: [
      { question: "Gondol turu ne kadar?", answer: "Resmi fiyat €80/30 dk (gündüz), €100 (gece). Max 6 kişi. Pazarlık yapılmıyor — fiyat belediye tarafından belirleniyor. Traghetto (gondol ferry) ise sadece €2." },
      { question: "Venedik giriş ücreti var mı?", answer: "2024'ten beri belirli yoğun günlerde (özellikle hafta sonları ve tatiller) €5 günlük giriş ücreti uygulanıyor. QR kod ile online ödeme. Konaklayanlar muaf." },
    ],
  },

  zanzibar: {
    tldr: "Zanzibar, Tanzanya'ya bağlı Hint Okyanusu'ndaki egzotik takımada. Beyaz kumlu plajlar, turkuaz deniz, baharat turları ve UNESCO listesindeki Stone Town. Günlük bütçe $30–70. Havalimanında vize alınabilir ($50).",
    quickAnswer: "Zanzibar'da 4–7 gün kalın, Haziran–Ekim kuru sezon en ideal. Stone Town + plaj kombinasyonu.",
    lastUpdated: "Nisan 2026",
    idealFor: ["Çiftler", "Plaj Tatilcileri", "Macera Gezginleri", "Balayı"],
    suggestedDays: "4–7 gün",
    visa: "Havalimanında vize $50. Bazı ülkelere e-Vize. Sarıhumma aşısı bazı durumlarda gerekli.",
    safety: "Genel olarak güvenli. Stone Town'da gece dikkatli olun. Plaj bölgeleri çok güvenli.",
    transport: "Abeid Amani Karume Havalimanı (ZNZ). Stone Town'a taksi ~$10. Ada içi dala dala (minibüs), taksi veya scooter kiralama. Plajlara transfer organize.",
    food: "Zanzibar pizza (gözleme tarzı), biryani, pilau, ugali, taze deniz ürünleri, baharat çayları. Forodhani Gardens gece pazarı efsanevi — taze ızgara deniz ürünleri $3–8.",
    seasons: [
      { period: "Mar–May", temp: "25–32°C", crowd: "Düşük", price: "Düşük", note: "Büyük yağmur sezonu" },
      { period: "Haz–Ekim", temp: "24–30°C", crowd: "Yüksek", price: "Yüksek", note: "Kuru sezon, en ideal dönem" },
      { period: "Kas–Ara", temp: "26–33°C", crowd: "Orta", price: "Orta", note: "Kısa yağmur sezonu" },
      { period: "Oca–Şub", temp: "26–34°C", crowd: "Orta", price: "Orta", note: "Sıcak, deniz sakin" },
    ],
    costs: [
      { item: "Konaklama (gece)", budget: "$15–35", mid: "$60–120", comfort: "$200+" },
      { item: "Yemek (gün)", budget: "$5–12", mid: "$15–30", comfort: "$50+" },
      { item: "Ulaşım (gün)", budget: "$2–5", mid: "$8–15", comfort: "$30+" },
      { item: "Aktivite (gün)", budget: "$0–10", mid: "$20–40", comfort: "$70+" },
      { item: "TOPLAM/gün", budget: "$22–62", mid: "$103–205", comfort: "$350+" },
    ],
    faqs: [
      { question: "Zanzibar'da en iyi plaj hangisi?", answer: "Nungwi (gün batımı, canlı), Kendwa (gelgit az etkiler), Paje (kite surf), Matemwe (sakin, mercan resifi). Doğu sahili gelgitten etkilenir — önceden araştırın." },
      { question: "Baharat turu yapılmalı mı?", answer: "Kesinlikle — Zanzibar 'Baharat Adası' olarak bilinir. Yarım günlük tur $20–30. Karanfil, tarçın, vanilya, zencefil, kakao plantasyonları." },
    ],
  },
};
