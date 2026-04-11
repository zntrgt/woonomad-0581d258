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

export interface CityGeoData {
  tldr: string;
  quickAnswer: string;
  lastUpdated: string;
  visa: string;
  safety: string;
  seasons: SeasonRow[];
  costs: CostRow[];
  faqs: CityFAQ[];
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

  barselona: {
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
    tldr: "Budapeşte, Avrupa'nın en uygun fiyatlı ve göz alıcı başkentlerinden biri. Günlük bütçe €35–60. Tuna nehri, termal hamamlar ve ruin bar kültürü. Dijital göçebeler için hızla popülerleşen bir merkez. Schengen vizesi gerekli.",
    quickAnswer: "Budapeşte'de 3–4 gün kalın, günlük €35–60 bütçe ayırın, Nisan–Ekim en ideal dönem.",
    lastUpdated: "Nisan 2026",
    visa: "Schengen vizesi gerekli. Macaristan beyaz göçebe vizesi programı değerlendirme altında.",
    safety: "Güvenli bir şehir. Gece Buda tarafı sakin, Pest tarafı canlı. 4-6 numaralı tramvayda yankesiciye dikkat.",
    seasons: [
      { period: "Mar–May", temp: "8–22°C", crowd: "Orta", price: "Orta", note: "Bahar, Tuna kenarında yürüyüş" },
      { period: "Haz–Ağu", temp: "18–30°C", crowd: "Yüksek", price: "Orta", note: "Sziget festivali Ağustos" },
      { period: "Eyl–Kas", temp: "8–20°C", crowd: "Orta", price: "Düşük", note: "Sonbahar, şarap sezonu" },
      { period: "Ara–Şub", temp: "-1–5°C", crowd: "Düşük", price: "Düşük", note: "Termal hamam sezonu, Noel pazarları" },
    ],
    costs: [
      { item: "Konaklama", budget: "€15–30", mid: "€50–90", comfort: "€140+" },
      { item: "Yemek", budget: "€8–14", mid: "€18–30", comfort: "€50+" },
      { item: "Ulaşım", budget: "€3–5", mid: "€6–10", comfort: "€18+" },
      { item: "Aktivite", budget: "€0–8", mid: "€12–22", comfort: "€35+" },
      { item: "TOPLAM/gün", budget: "€26–57", mid: "€86–152", comfort: "€243+" },
    ],
    faqs: [
      { question: "Budapeşte'de hangi hamama gidilmeli?", answer: "Széchenyi (açık hava, büyük), Gellért (Art Nouveau mimari), Rudas (Osmanlı dönemi). Hafta içi daha sakin." },
      { question: "Ruin bar nedir?", answer: "Terk edilmiş binalarda açılan barlar. Szimpla Kert en ünlüsü — pazar günü farmer's market var." },
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
};
