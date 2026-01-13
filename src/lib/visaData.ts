// Visa data for digital nomads - requirements, costs, and durations

export interface VisaProgram {
  id: string;
  country: string;
  countryCode: string;
  programName: string;
  programNameEn: string;
  type: 'nomad-visa' | 'freelancer-visa' | 'residence-permit' | 'visa-free' | 'eVisa';
  duration: string;
  maxStay: string;
  cost: number;
  costCurrency: string;
  incomeRequirement: number;
  incomeRequirementCurrency: string;
  processingTime: string;
  renewability: string;
  taxBenefits: string;
  healthInsurance: boolean;
  remoteWorkProof: boolean;
  highlights: string[];
  requirements: string[];
  pros: string[];
  cons: string[];
  applicationUrl?: string;
  lastUpdated: string;
}

export const visaPrograms: VisaProgram[] = [
  // Europe
  {
    id: 'portugal-d7',
    country: 'Portekiz',
    countryCode: 'PT',
    programName: 'D7 Vizesi',
    programNameEn: 'D7 Visa',
    type: 'residence-permit',
    duration: '2 yıl (yenilenebilir)',
    maxStay: 'Süresiz',
    cost: 180,
    costCurrency: 'EUR',
    incomeRequirement: 760,
    incomeRequirementCurrency: 'EUR',
    processingTime: '2-4 ay',
    renewability: '3 yıllık dönemlerle yenilenebilir',
    taxBenefits: 'NHR programı ile %20 sabit vergi (ilk 10 yıl)',
    healthInsurance: true,
    remoteWorkProof: true,
    highlights: ['Schengen bölgesi', 'AB oturma izni yolu', 'Düşük gelir şartı'],
    requirements: [
      'Aylık €760+ pasif gelir kanıtı',
      'Temiz sabıka kaydı',
      'Sağlık sigortası',
      'Portekiz\'de konaklama kanıtı',
      'Portekiz bankasında hesap'
    ],
    pros: ['AB vatandaşlığı yolu', 'Düşük yaşam maliyeti', 'Güçlü nomad topluluğu'],
    cons: ['Yılda 183 gün kalma zorunluluğu', 'Uzun başvuru süreci'],
    applicationUrl: 'https://vistos.mne.gov.pt',
    lastUpdated: '2026-01'
  },
  {
    id: 'spain-nomad',
    country: 'İspanya',
    countryCode: 'ES',
    programName: 'Dijital Göçebe Vizesi',
    programNameEn: 'Digital Nomad Visa',
    type: 'nomad-visa',
    duration: '1 yıl (3 yıla uzatılabilir)',
    maxStay: '3 yıl',
    cost: 80,
    costCurrency: 'EUR',
    incomeRequirement: 2520,
    incomeRequirementCurrency: 'EUR',
    processingTime: '20 iş günü',
    renewability: '2 yıllık uzatma mümkün',
    taxBenefits: 'İlk 4 yıl %15 sabit vergi (Beckham Yasası)',
    healthInsurance: true,
    remoteWorkProof: true,
    highlights: ['Hızlı işlem', 'Vergi avantajları', 'Aile dahil edilebilir'],
    requirements: [
      'Aylık €2,520 gelir kanıtı',
      'Minimum 3 aylık iş deneyimi',
      'Yabancı şirkette çalışıyor olma',
      'Sağlık sigortası',
      'Temiz sabıka kaydı'
    ],
    pros: ['Hızlı başvuru', 'Düşük vergi', 'Aile vizesi'],
    cons: ['Yüksek gelir şartı', 'İspanya dışında çalışma zorunluluğu'],
    applicationUrl: 'https://www.exteriores.gob.es',
    lastUpdated: '2026-01'
  },
  {
    id: 'germany-freelancer',
    country: 'Almanya',
    countryCode: 'DE',
    programName: 'Serbest Meslek Vizesi',
    programNameEn: 'Freelancer Visa',
    type: 'freelancer-visa',
    duration: '3 yıl',
    maxStay: 'Süresiz (kalıcı oturum yolu)',
    cost: 100,
    costCurrency: 'EUR',
    incomeRequirement: 0,
    incomeRequirementCurrency: 'EUR',
    processingTime: '1-3 ay',
    renewability: 'Yenilenebilir, 5 yıl sonra kalıcı oturum',
    taxBenefits: 'Standart Alman vergi oranları',
    healthInsurance: true,
    remoteWorkProof: true,
    highlights: ['Kalıcı oturum yolu', 'Güçlü ekonomi', 'Startup ekosistemi'],
    requirements: [
      'İş planı veya müşteri sözleşmeleri',
      'Finansal sürdürülebilirlik kanıtı',
      'Sağlık sigortası',
      'Uygun konaklama kanıtı',
      'Alman ekonomisine katkı planı'
    ],
    pros: ['AB merkezli lokasyon', 'Kalıcı oturum imkanı', 'Güçlü startup sahnes'],
    cons: ['Yüksek yaşam maliyeti', 'Karmaşık vergi sistemi', 'Almanca gerekebilir'],
    lastUpdated: '2026-01'
  },
  {
    id: 'estonia-digital-nomad',
    country: 'Estonya',
    countryCode: 'EE',
    programName: 'Dijital Göçebe Vizesi',
    programNameEn: 'Digital Nomad Visa',
    type: 'nomad-visa',
    duration: '1 yıl',
    maxStay: '1 yıl',
    cost: 100,
    costCurrency: 'EUR',
    incomeRequirement: 4500,
    incomeRequirementCurrency: 'EUR',
    processingTime: '15-30 gün',
    renewability: 'Yenilenemez (çıkış + yeniden başvuru)',
    taxBenefits: 'Estonya\'da vergi yok (yabancı gelir)',
    healthInsurance: true,
    remoteWorkProof: true,
    highlights: ['e-Residency programı', 'Dijital devlet', 'Startup ülkesi'],
    requirements: [
      'Son 6 ayda aylık €4,500+ gelir',
      'Uzaktan çalışma kanıtı',
      'Sağlık sigortası',
      'Temiz sabıka kaydı'
    ],
    pros: ['Dijital altyapı', 'e-Residency ile şirket kurma', 'Vergi avantajı'],
    cons: ['Yüksek gelir şartı', 'Soğuk iklim', 'Yenilenemez'],
    applicationUrl: 'https://www.e-resident.gov.ee',
    lastUpdated: '2026-01'
  },
  {
    id: 'croatia-nomad',
    country: 'Hırvatistan',
    countryCode: 'HR',
    programName: 'Dijital Göçebe İzni',
    programNameEn: 'Digital Nomad Permit',
    type: 'nomad-visa',
    duration: '1 yıl',
    maxStay: '1 yıl',
    cost: 55,
    costCurrency: 'EUR',
    incomeRequirement: 2540,
    incomeRequirementCurrency: 'EUR',
    processingTime: '15-20 gün',
    renewability: 'Yenilenebilir',
    taxBenefits: 'Gelir vergisi yok (yabancı gelir)',
    healthInsurance: true,
    remoteWorkProof: true,
    highlights: ['Vergi avantajı', 'Akdeniz iklimi', 'Düşük maliyet'],
    requirements: [
      'Aylık €2,540+ gelir',
      'Sağlık sigortası',
      'Yabancı şirkette çalışma kanıtı',
      'Konaklama kanıtı'
    ],
    pros: ['Vergi muafiyeti', 'Güzel sahiller', 'Uygun fiyat'],
    cons: ['AB üyesi değil (Schengen)', 'Kış ayları sakin'],
    lastUpdated: '2026-01'
  },
  {
    id: 'greece-nomad',
    country: 'Yunanistan',
    countryCode: 'GR',
    programName: 'Dijital Göçebe Vizesi',
    programNameEn: 'Digital Nomad Visa',
    type: 'nomad-visa',
    duration: '1 yıl (2 yıla uzatılabilir)',
    maxStay: '2 yıl',
    cost: 75,
    costCurrency: 'EUR',
    incomeRequirement: 3500,
    incomeRequirementCurrency: 'EUR',
    processingTime: '1-2 ay',
    renewability: '1 yıl uzatma mümkün',
    taxBenefits: '%50 vergi indirimi (ilk 7 yıl)',
    healthInsurance: true,
    remoteWorkProof: true,
    highlights: ['%50 vergi indirimi', 'Akdeniz yaşamı', 'Adalar'],
    requirements: [
      'Aylık €3,500+ gelir',
      'Yabancı işveren veya müşteri',
      'Sağlık sigortası',
      'Konaklama kanıtı'
    ],
    pros: ['Vergi avantajı', 'Ada yaşamı seçeneği', 'Uygun yaşam maliyeti'],
    cons: ['Bürokrasi', 'Yaz ayları kalabalık'],
    lastUpdated: '2026-01'
  },

  // Asia
  {
    id: 'thailand-ltr',
    country: 'Tayland',
    countryCode: 'TH',
    programName: 'Uzun Süreli İkamet (LTR)',
    programNameEn: 'Long-Term Resident Visa',
    type: 'residence-permit',
    duration: '5 yıl (10 yıla uzatılabilir)',
    maxStay: '10 yıl',
    cost: 1600,
    costCurrency: 'USD',
    incomeRequirement: 80000,
    incomeRequirementCurrency: 'USD',
    processingTime: '20-60 gün',
    renewability: '5 yıl daha uzatılabilir',
    taxBenefits: 'Yabancı gelirde vergi muafiyeti',
    healthInsurance: true,
    remoteWorkProof: true,
    highlights: ['10 yıl kalış', 'Vergi muafiyeti', 'Aile dahil'],
    requirements: [
      'Son 2 yılda yıllık $80,000+ gelir',
      'veya $250,000 yatırım',
      'Sağlık sigortası',
      'Temiz sabıka kaydı'
    ],
    pros: ['Uzun süre', 'Vergi avantajı', 'Düşük yaşam maliyeti'],
    cons: ['Yüksek gelir şartı', 'Yüksek başvuru ücreti'],
    applicationUrl: 'https://ltr.boi.go.th',
    lastUpdated: '2026-01'
  },
  {
    id: 'indonesia-b211a',
    country: 'Endonezya (Bali)',
    countryCode: 'ID',
    programName: 'Remote Worker Visa (B211A)',
    programNameEn: 'B211A Remote Worker Visa',
    type: 'nomad-visa',
    duration: '6 ay (yenilenebilir)',
    maxStay: '1 yıl',
    cost: 350,
    costCurrency: 'USD',
    incomeRequirement: 2000,
    incomeRequirementCurrency: 'USD',
    processingTime: '5-10 iş günü',
    renewability: '180 gün uzatma mümkün',
    taxBenefits: 'Endonezya\'da çalışmazsanız vergi yok',
    healthInsurance: true,
    remoteWorkProof: true,
    highlights: ['Bali cennet', 'Hızlı işlem', 'Düşük maliyet'],
    requirements: [
      'Aylık $2,000+ gelir kanıtı',
      'Uzaktan çalışma kanıtı',
      'Sağlık sigortası',
      'Dönüş bileti',
      'Banka hesap özeti'
    ],
    pros: ['Hızlı başvuru', 'Düşük maliyet', 'Güçlü nomad topluluğu'],
    cons: ['6 aylık süre', 'Vize uzatma gerekliliği'],
    lastUpdated: '2026-01'
  },
  {
    id: 'malaysia-de-rantau',
    country: 'Malezya',
    countryCode: 'MY',
    programName: 'DE Rantau Nomad Pass',
    programNameEn: 'DE Rantau Nomad Pass',
    type: 'nomad-visa',
    duration: '1 yıl',
    maxStay: '1 yıl',
    cost: 215,
    costCurrency: 'USD',
    incomeRequirement: 2000,
    incomeRequirementCurrency: 'USD',
    processingTime: '14 iş günü',
    renewability: 'Yenilenebilir',
    taxBenefits: 'Yabancı gelir vergiden muaf',
    healthInsurance: false,
    remoteWorkProof: true,
    highlights: ['Düşük maliyet', 'Kolay başvuru', 'Çeşitli kültür'],
    requirements: [
      'Aylık $2,000+ gelir',
      'Dijital sektörde çalışma kanıtı',
      'Pasaport (6+ ay geçerli)',
      'Fotoğraf'
    ],
    pros: ['Hızlı işlem', 'Düşük yaşam maliyeti', 'İngilizce yaygın'],
    cons: ['Sigorta dahil değil', 'Dijital sektör şartı'],
    applicationUrl: 'https://mdec.my/derantau',
    lastUpdated: '2026-01'
  },
  {
    id: 'japan-digital-nomad',
    country: 'Japonya',
    countryCode: 'JP',
    programName: 'Dijital Göçebe Vizesi',
    programNameEn: 'Digital Nomad Visa',
    type: 'nomad-visa',
    duration: '6 ay',
    maxStay: '6 ay',
    cost: 25,
    costCurrency: 'USD',
    incomeRequirement: 6850,
    incomeRequirementCurrency: 'USD',
    processingTime: '2-4 hafta',
    renewability: 'Yenilenemez',
    taxBenefits: 'Vergi muafiyeti',
    healthInsurance: true,
    remoteWorkProof: true,
    highlights: ['Benzersiz kültür', 'Güvenlik', 'Teknoloji'],
    requirements: [
      'Yıllık $82,000+ gelir',
      'Sağlık sigortası',
      'Yabancı işveren veya kendi işi',
      'Temiz sabıka kaydı'
    ],
    pros: ['Japon kültürü deneyimi', 'Güvenli', 'Düzenli'],
    cons: ['Çok yüksek gelir şartı', 'Kısa süre', 'Yenilenemez'],
    lastUpdated: '2026-01'
  },
  {
    id: 'uae-virtual-working',
    country: 'BAE (Dubai)',
    countryCode: 'AE',
    programName: 'Virtual Working Visa',
    programNameEn: 'Virtual Working Program',
    type: 'nomad-visa',
    duration: '1 yıl',
    maxStay: '1 yıl',
    cost: 287,
    costCurrency: 'USD',
    incomeRequirement: 5000,
    incomeRequirementCurrency: 'USD',
    processingTime: '5-7 iş günü',
    renewability: 'Yenilenebilir',
    taxBenefits: 'Gelir vergisi YOK',
    healthInsurance: true,
    remoteWorkProof: true,
    highlights: ['Vergisiz', 'Lüks yaşam', 'Merkezi konum'],
    requirements: [
      'Aylık $5,000+ gelir',
      'İş sözleşmesi veya şirket sahipliği',
      'Sağlık sigortası',
      'Son 1 aylık banka hesabı',
      'Pasaport kopyası'
    ],
    pros: ['Sıfır gelir vergisi', 'Hızlı işlem', 'Dünya class altyapı'],
    cons: ['Yüksek yaşam maliyeti', 'Sıcak yaz ayları'],
    applicationUrl: 'https://www.dubaifuture.ae/virtual-working-programme',
    lastUpdated: '2026-01'
  },

  // Americas
  {
    id: 'mexico-temporary',
    country: 'Meksika',
    countryCode: 'MX',
    programName: 'Geçici Oturum Vizesi',
    programNameEn: 'Temporary Resident Visa',
    type: 'residence-permit',
    duration: '1-4 yıl',
    maxStay: '4 yıl',
    cost: 50,
    costCurrency: 'USD',
    incomeRequirement: 2600,
    incomeRequirementCurrency: 'USD',
    processingTime: '10-15 iş günü',
    renewability: 'Yenilenebilir',
    taxBenefits: 'Yabancı gelir vergiden muaf olabilir',
    healthInsurance: false,
    remoteWorkProof: false,
    highlights: ['Kolay başvuru', 'Vizesiz giriş', 'Zengin kültür'],
    requirements: [
      'Son 12 ayda aylık $2,600+ gelir',
      'veya $43,000+ banka bakiyesi',
      'Pasaport',
      'Fotoğraflar'
    ],
    pros: ['Vizesiz 6 ay giriş', 'Uygun yaşam maliyeti', 'ABD\'ye yakın'],
    cons: ['Güvenlik endişeleri (bazı bölgeler)', 'İspanyolca gerekebilir'],
    lastUpdated: '2026-01'
  },
  {
    id: 'costa-rica-rentista',
    country: 'Kosta Rika',
    countryCode: 'CR',
    programName: 'Rentista Vizesi',
    programNameEn: 'Rentista Visa',
    type: 'residence-permit',
    duration: '2 yıl',
    maxStay: '2 yıl (yenilenebilir)',
    cost: 300,
    costCurrency: 'USD',
    incomeRequirement: 2500,
    incomeRequirementCurrency: 'USD',
    processingTime: '3-6 ay',
    renewability: 'Yenilenebilir, 3 yıl sonra kalıcı oturum',
    taxBenefits: 'Yabancı gelir vergiden muaf',
    healthInsurance: true,
    remoteWorkProof: false,
    highlights: ['Doğa cenneti', 'Pura Vida', 'Stabil demokrasi'],
    requirements: [
      'Aylık $2,500+ sabit gelir (2 yıl garantili)',
      'Temiz sabıka kaydı',
      'Sağlık sigortası',
      'Pasaport'
    ],
    pros: ['Doğal güzellik', 'Politik istikrar', 'İyi sağlık sistemi'],
    cons: ['Uzun işlem süresi', 'Yüksek yaşam maliyeti (Latin Amerika\'ya göre)'],
    lastUpdated: '2026-01'
  },
  {
    id: 'colombia-digital-nomad',
    country: 'Kolombiya',
    countryCode: 'CO',
    programName: 'Dijital Göçebe Vizesi',
    programNameEn: 'Digital Nomad Visa',
    type: 'nomad-visa',
    duration: '2 yıl',
    maxStay: '2 yıl',
    cost: 177,
    costCurrency: 'USD',
    incomeRequirement: 684,
    incomeRequirementCurrency: 'USD',
    processingTime: '5-10 iş günü',
    renewability: 'Yenilenebilir',
    taxBenefits: 'Yabancı gelir vergiden muaf',
    healthInsurance: true,
    remoteWorkProof: true,
    highlights: ['Düşük maliyet', 'Medellín hub', 'Uzun süre'],
    requirements: [
      'Aylık asgari ücretin 3 katı (~$684)',
      'Sağlık sigortası',
      'Uzaktan çalışma kanıtı',
      'Pasaport'
    ],
    pros: ['Çok düşük gelir şartı', 'Canlı nomad topluluğu', '2 yıl süre'],
    cons: ['Güvenlik algısı', 'İspanyolca öğrenme gerekliliği'],
    lastUpdated: '2026-01'
  },

  // Other Regions
  {
    id: 'georgia-visa-free',
    country: 'Gürcistan',
    countryCode: 'GE',
    programName: 'Vizesiz Kalış',
    programNameEn: 'Visa-Free Stay',
    type: 'visa-free',
    duration: '1 yıl',
    maxStay: '1 yıl',
    cost: 0,
    costCurrency: 'USD',
    incomeRequirement: 0,
    incomeRequirementCurrency: 'USD',
    processingTime: 'Anında',
    renewability: 'Sınır çıkış-giriş ile sıfırlanır',
    taxBenefits: 'Yabancı gelir vergiden muaf',
    healthInsurance: false,
    remoteWorkProof: false,
    highlights: ['Ücretsiz', 'Vizesiz 1 yıl', 'Düşük maliyet'],
    requirements: [
      'Türk vatandaşları için kimlikle giriş',
      'Geçerli pasaport'
    ],
    pros: ['Vize yok', 'Çok düşük yaşam maliyeti', 'Kolay şirket kurma'],
    cons: ['Altyapı sorunları', 'Dil bariyeri', 'Soğuk kışlar'],
    lastUpdated: '2026-01'
  },
  {
    id: 'mauritius-premium',
    country: 'Mauritius',
    countryCode: 'MU',
    programName: 'Premium Travel Visa',
    programNameEn: 'Premium Travel Visa',
    type: 'nomad-visa',
    duration: '1 yıl',
    maxStay: '1 yıl',
    cost: 0,
    costCurrency: 'USD',
    incomeRequirement: 1500,
    incomeRequirementCurrency: 'USD',
    processingTime: '48 saat',
    renewability: 'Yenilenebilir',
    taxBenefits: 'Yabancı gelir vergiden muaf',
    healthInsurance: true,
    remoteWorkProof: true,
    highlights: ['Tropik ada', 'Ücretsiz vize', 'Hızlı işlem'],
    requirements: [
      'Aylık $1,500+ gelir',
      'Sağlık sigortası',
      'Konaklama rezervasyonu',
      'Dönüş bileti'
    ],
    pros: ['Tropik cennet', 'Ücretsiz', 'Hızlı'],
    cons: ['İzole konum', 'Pahalı uçuşlar', 'Küçük topluluk'],
    lastUpdated: '2026-01'
  },
  {
    id: 'south-africa-nomad',
    country: 'Güney Afrika',
    countryCode: 'ZA',
    programName: 'Dijital Göçebe Vizesi',
    programNameEn: 'Digital Nomad Visa',
    type: 'nomad-visa',
    duration: '1 yıl (3 yıla uzatılabilir)',
    maxStay: '3 yıl',
    cost: 150,
    costCurrency: 'USD',
    incomeRequirement: 2850,
    incomeRequirementCurrency: 'USD',
    processingTime: '8-12 hafta',
    renewability: '2 yıl uzatma mümkün',
    taxBenefits: 'Yabancı gelir üzerinden muafiyet mümkün',
    healthInsurance: true,
    remoteWorkProof: true,
    highlights: ['Cape Town', 'Safari', 'Çeşitlilik'],
    requirements: [
      'Aylık ~$2,850 (asgari ücretin 2 katı) gelir',
      'Sağlık sigortası',
      'Uzaktan çalışma kanıtı',
      'Temiz sabıka kaydı'
    ],
    pros: ['Çeşitli yaşam', 'Güçlü altyapı', 'İngilizce'],
    cons: ['Güvenlik endişeleri', 'Uzak konum'],
    lastUpdated: '2026-01'
  }
];

// Helper functions
export function getVisaProgramsByCountry(countryCode: string): VisaProgram[] {
  return visaPrograms.filter(p => p.countryCode === countryCode);
}

export function getVisaProgramById(id: string): VisaProgram | null {
  return visaPrograms.find(p => p.id === id) || null;
}

export function getVisaProgramsByType(type: VisaProgram['type']): VisaProgram[] {
  return visaPrograms.filter(p => p.type === type);
}

export function getAffordableVisas(maxIncome: number): VisaProgram[] {
  return visaPrograms
    .filter(p => p.incomeRequirement <= maxIncome || p.incomeRequirement === 0)
    .sort((a, b) => a.incomeRequirement - b.incomeRequirement);
}

export function getLongestStayVisas(): VisaProgram[] {
  return [...visaPrograms].sort((a, b) => {
    const getDuration = (d: string) => {
      if (d.includes('Süresiz') || d.includes('10')) return 10;
      if (d.includes('5')) return 5;
      if (d.includes('4')) return 4;
      if (d.includes('3')) return 3;
      if (d.includes('2')) return 2;
      if (d.includes('1')) return 1;
      return 0.5;
    };
    return getDuration(b.maxStay) - getDuration(a.maxStay);
  });
}

export function getTaxFreeVisas(): VisaProgram[] {
  return visaPrograms.filter(p => 
    p.taxBenefits.toLowerCase().includes('muaf') || 
    p.taxBenefits.toLowerCase().includes('yok') ||
    p.taxBenefits.toLowerCase().includes('%0')
  );
}
