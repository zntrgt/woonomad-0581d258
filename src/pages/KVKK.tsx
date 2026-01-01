import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent } from '@/components/ui/card';

const KVKK = () => {
  const currentYear = new Date().getFullYear();
  
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'KVKK Aydınlatma Metni' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>KVKK Aydınlatma Metni | WooNomad</title>
        <meta name="description" content="WooNomad KVKK Aydınlatma Metni. 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında bilgilendirme." />
        <link rel="canonical" href="https://woonomad.co/kvkk" />
      </Helmet>

      <Header />

      <main className="container py-8 max-w-4xl">
        <Breadcrumb items={breadcrumbItems} />
        
        <h1 className="text-3xl md:text-4xl font-display font-bold mt-6 mb-8">
          KVKK Aydınlatma Metni
        </h1>

        <Card variant="elevated">
          <CardContent className="p-6 md:p-8 prose prose-lg max-w-none">
            <p className="text-muted-foreground">
              6698 Sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında aydınlatma metni
            </p>

            <h2>1. Veri Sorumlusu</h2>
            <p>
              WooNomad ("Şirket") olarak, kişisel verilerinizin güvenliği konusunda azami hassasiyet göstermekteyiz. 
              Bu aydınlatma metni, KVKK'nın 10. maddesi uyarınca hazırlanmıştır.
            </p>

            <h2>2. İşlenen Kişisel Veriler</h2>
            <p>Web sitemizi kullandığınızda aşağıdaki veriler işlenebilir:</p>
            <ul>
              <li><strong>Kimlik Bilgileri:</strong> Ad, soyad (üyelik durumunda)</li>
              <li><strong>İletişim Bilgileri:</strong> E-posta adresi</li>
              <li><strong>Dijital İzler:</strong> IP adresi, çerez verileri, cihaz bilgileri</li>
              <li><strong>İşlem Güvenliği:</strong> Log kayıtları, oturum bilgileri</li>
            </ul>

            <h2>3. Kişisel Verilerin İşlenme Amaçları</h2>
            <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
            <ul>
              <li>Web sitesi hizmetlerinin sunulması</li>
              <li>Kullanıcı deneyiminin iyileştirilmesi</li>
              <li>İstatistiksel analizlerin yapılması</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Bilgi güvenliğinin sağlanması</li>
            </ul>

            <h2>4. Kişisel Verilerin Aktarılması</h2>
            <p>
              Kişisel verileriniz, yasal zorunluluklar ve hizmet gereksinimleri çerçevesinde; 
              yetkili kamu kurum ve kuruluşlarına, iş ortaklarımıza ve hizmet sağlayıcılarımıza aktarılabilir.
            </p>

            <h2>5. Veri İşlemenin Hukuki Sebepleri</h2>
            <p>Kişisel verileriniz, KVKK'nın 5. maddesi kapsamında:</p>
            <ul>
              <li>Açık rızanız</li>
              <li>Sözleşmenin ifası</li>
              <li>Hukuki yükümlülükler</li>
              <li>Meşru menfaatler</li>
            </ul>
            <p>hukuki sebeplerine dayanarak işlenmektedir.</p>

            <h2>6. KVKK Kapsamındaki Haklarınız</h2>
            <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
            <ul>
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
              <li>Eksik veya yanlış işlenmiş olması halinde düzeltilmesini isteme</li>
              <li>KVKK'nın 7. maddesindeki şartlar çerçevesinde silinmesini/yok edilmesini isteme</li>
              <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
              <li>Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
            </ul>

            <h2>7. Başvuru</h2>
            <p>
              Yukarıda belirtilen haklarınızı kullanmak için aşağıdaki kanallardan bizimle iletişime geçebilirsiniz:
              <br />
              E-posta: kvkk@woonomad.co
            </p>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-border py-8 mt-12 mb-20 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © {currentYear} WooNomad. Tüm hakları saklıdır.
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
};

export default KVKK;
