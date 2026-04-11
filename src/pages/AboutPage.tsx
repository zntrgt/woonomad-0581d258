import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Users, Shield, BookOpen, Mail, MapPin, Calendar } from 'lucide-react';
import { OrganizationSchema } from '@/components/StructuredData';

// ============================================================
// TODO: Bu bilgileri gerçek verilerle değiştir
// ============================================================
const TEAM = [
  {
    name: 'Ozan Turgut', // Gerçek isim
    role: 'Kurucu & Baş Editör',
    bio: 'Dijital göçebe olarak 10+ ülkede yaşadı. Yazılım geliştirici ve seyahat tutkunu.',
    countries: 15, // Ziyaret edilen ülke sayısı
    image: '/team/ozan.jpg', // Fotoğraf ekle: public/team/ozan.jpg
  },
];

const STATS = {
  citiesReviewed: 39,
  countriesCovered: 25,
  monthlyUpdates: true,
  foundedYear: 2024,
  lastFullAudit: '2026-04-10',
};
// ============================================================

const AboutPage = () => {
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Hakkımızda' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Hakkımızda — WooNomad Ekibi ve Misyonumuz</title>
        <meta name="description" content="WooNomad'ı kim yapıyor, nasıl çalışıyoruz, verilerimizi nereden alıyoruz. Seyahat rehberlerimizin arkasındaki ekip ve metodoloji." />
        <link rel="canonical" href="https://woonomad.co/hakkimizda" />
      </Helmet>

      <OrganizationSchema />
      <Header />

      <main className="container py-8 max-w-4xl">
        <Breadcrumb items={breadcrumbItems} />

        <h1 className="text-3xl md:text-4xl font-display font-bold mt-6 mb-4">
          Hakkımızda
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          WooNomad, gerçek deneyime dayalı, veri odaklı seyahat rehberleri sunan bağımsız bir platformdur.
        </p>

        {/* Mission */}
        <Card className="mb-8">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Misyonumuz
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Seyahat kararı vermek zordur. Çoğu site ya yüzeysel bilgi verir ya da reklam dolu sayfalarla 
              sizi yönlendirir. WooNomad, her destinasyonu gerçek verilerle değerlendiren, 
              dürüst trade-off'ları gösteren ve karar vermenizi kolaylaştıran bir platform olmayı hedefler.
              Affiliate bağlantıları kullanıyoruz — ama içerik bağımsızlığımız her zaman önceliğimizdir.
            </p>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: MapPin, label: 'Şehir Rehberi', value: STATS.citiesReviewed },
            { icon: Globe, label: 'Ülke', value: STATS.countriesCovered },
            { icon: Calendar, label: 'Kuruluş', value: STATS.foundedYear },
            { icon: Shield, label: 'Son Güncelleme', value: STATS.lastFullAudit },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team */}
        <h2 className="text-xl md:text-2xl font-display font-bold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Ekip
        </h2>
        <div className="space-y-4 mb-8">
          {TEAM.map((member) => (
            <Card key={member.name}>
              <CardContent className="p-6 flex gap-4 items-start">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground shrink-0">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <Badge variant="secondary" className="mb-2">{member.role}</Badge>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {member.countries}+ ülke deneyimi
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How we work */}
        <h2 className="text-xl md:text-2xl font-display font-bold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Nasıl Çalışıyoruz
        </h2>
        <Card className="mb-8">
          <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Veri Odaklı Değerlendirme</h3>
              <p>Her şehir sayfası; yaşam maliyeti, güvenlik, internet hızı, iklim ve nomad altyapısı gibi ölçülebilir verilere dayanır. Kaynaklarımızı <Link to="/metodoloji" className="text-primary hover:underline">metodoloji sayfamızda</Link> açıklıyoruz.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Düzenli Güncelleme</h3>
              <p>Fiyatlar, vize kuralları ve güvenlik bilgileri değişir. Tüm rehberlerimizi düzenli olarak güncelliyoruz. Her sayfada "son güncelleme" tarihi gösterilir.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Bağımsız İçerik</h3>
              <p>Affiliate bağlantıları kullanıyoruz — ancak hiçbir partner içerik kararlarımızı etkilemez. <Link to="/affiliate-aciklama" className="text-primary hover:underline">Affiliate açıklamamızı</Link> okuyabilirsiniz.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Gerçek Deneyim</h3>
              <p>Ekibimiz, yazdığı destinasyonlarda bizzat bulunmuş kişilerden oluşur. Genel bilgi kopyalayan bir site değiliz — yaşanmış deneyimleri aktarıyoruz.</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardContent className="p-6 flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold">İletişim</h3>
              <p className="text-sm text-muted-foreground">
                Soru, öneri veya düzeltme bildirimi için: <a href="mailto:info@woonomad.co" className="text-primary hover:underline">info@woonomad.co</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default AboutPage;
