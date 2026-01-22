import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { CityComparison } from '@/components/CityComparison';
import { NomadCostCalculator } from '@/components/NomadCostCalculator';
import { VisaComparisonTool } from '@/components/VisaComparisonTool';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Laptop, Wifi, MapPin, Globe, Users, Coffee, 
  Sun, Shield, Star, TrendingUp, Search, ArrowRight,
  Building2, BookOpen, Plane, Calendar, DollarSign, Scale, FileCheck
} from 'lucide-react';
import { nomadMetrics, coworkingSpaces, getAllCoworkingSpaces, getCitiesWithNomadData } from '@/lib/nomad';
import { cityData, getAllCities } from '@/lib/cities';
import { getPostsByCategory, blogCategories } from '@/lib/blog';

const NomadHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('cities');

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Dijital Göçebe Hub', current: true },
  ];

  // Get all nomad-friendly cities with their data
  const nomadCities = useMemo(() => {
    const citySlugs = getCitiesWithNomadData();
    return citySlugs
      .map(slug => {
        const city = cityData[slug];
        const metrics = nomadMetrics[slug];
        if (!city || !metrics) return null;
        return { ...city, slug, metrics };
      })
      .filter(Boolean)
      .sort((a, b) => (b?.metrics.nomadScore || 0) - (a?.metrics.nomadScore || 0));
  }, []);

  // Get all coworking spaces
  const allCoworkings = useMemo(() => getAllCoworkingSpaces(), []);

  // Get nomad blog posts
  const nomadPosts = useMemo(() => getPostsByCategory('nomad').slice(0, 6), []);

  // Filter based on search
  const filteredCities = useMemo(() => {
    if (!searchQuery) return nomadCities;
    const query = searchQuery.toLowerCase();
    return nomadCities.filter(city => 
      city?.name.toLowerCase().includes(query) || 
      city?.country.toLowerCase().includes(query)
    );
  }, [nomadCities, searchQuery]);

  const filteredCoworkings = useMemo(() => {
    if (!searchQuery) return allCoworkings;
    const query = searchQuery.toLowerCase();
    return allCoworkings.filter(space => 
      space.name.toLowerCase().includes(query) || 
      space.citySlug.toLowerCase().includes(query) ||
      space.neighborhood?.toLowerCase().includes(query)
    );
  }, [allCoworkings, searchQuery]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dijital Göçebe Hub | Coworking, Şehir Rehberleri, Nomad İpuçları | WooNomad</title>
        <meta name="description" content="Dijital göçebeler için eksiksiz kaynak merkezi. En iyi nomad şehirleri, coworking alanları, vize bilgileri, yaşam maliyetleri ve topluluk önerileri." />
        <link rel="canonical" href="https://woonomad.com/nomad-hub" />
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-4 md:py-6">
        <Breadcrumb items={breadcrumbItems} />

        {/* Hero Section */}
        <section className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background border">
          <div className="relative z-10 py-6 px-4 md:py-8 md:px-10">
            <div className="flex items-center gap-2 mb-4">
              <Laptop className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-primary">Dijital Göçebe Merkezi</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Dijital Göçebe Hub
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl mb-4">
              Dünyanın dört bir yanından çalışın. En iyi nomad şehirleri, coworking alanları, 
              vize rehberleri ve topluluk ipuçları tek bir yerde.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border">
                <div className="text-2xl font-bold text-primary">{nomadCities.length}+</div>
                <div className="text-sm text-muted-foreground">Nomad Şehri</div>
              </div>
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border">
                <div className="text-2xl font-bold text-primary">{allCoworkings.length}+</div>
                <div className="text-sm text-muted-foreground">Coworking Alanı</div>
              </div>
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border">
                <div className="text-2xl font-bold text-primary">{nomadPosts.length}+</div>
                <div className="text-sm text-muted-foreground">Nomad Rehberi</div>
              </div>
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border">
                <div className="text-2xl font-bold text-primary">30+</div>
                <div className="text-sm text-muted-foreground">Vize Programı</div>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Şehir veya coworking ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </section>

        {/* Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="cities" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Şehirler</span>
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              <span>Karşılaştır</span>
            </TabsTrigger>
            <TabsTrigger value="coworking" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>Coworking</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Rehberler</span>
            </TabsTrigger>
            <TabsTrigger value="visa" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              <span>Vizeler</span>
            </TabsTrigger>
          </TabsList>

          {/* Cities Tab */}
          <TabsContent value="cities" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">En İyi Nomad Şehirleri</h2>
              <Link to="/sehirler">
                <Button variant="outline" size="sm">
                  Tüm Şehirler <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCities.slice(0, 9).map((city) => city && (
                <Link key={city.slug} to={`/sehir/${city.slug}/nomad`}>
                  <Card className="h-full hover:shadow-lg transition-all group overflow-hidden">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className={getScoreColor(city.metrics.nomadScore)}>
                          <Star className="h-3 w-3 mr-1" />
                          {city.metrics.nomadScore}/10
                        </Badge>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <h3 className="text-white font-bold text-lg">{city.name}</h3>
                        <p className="text-white/80 text-sm">{city.country}</p>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Wifi className="h-4 w-4 text-primary" />
                          <span>{city.metrics.internetSpeed}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span>{city.metrics.costOfLiving}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          <span>{city.metrics.coworkingCount} coworking</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Coffee className="h-4 w-4 text-primary" />
                          <span>{city.metrics.cafesWithWifi} kafe</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {city.metrics.safetyScore >= 8 && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" /> Güvenli
                          </Badge>
                        )}
                        {city.metrics.weatherScore >= 8 && (
                          <Badge variant="secondary" className="text-xs">
                            <Sun className="h-3 w-3 mr-1" /> İyi Hava
                          </Badge>
                        )}
                        {city.metrics.communityScore >= 8 && (
                          <Badge variant="secondary" className="text-xs">
                            <Users className="h-3 w-3 mr-1" /> Topluluk
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredCities.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>"{searchQuery}" için şehir bulunamadı.</p>
              </div>
            )}
          </TabsContent>

          {/* Compare Tab */}
          <TabsContent value="compare" className="space-y-4">
            <div className="grid lg:grid-cols-[1fr_380px] gap-6">
              <div>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">Şehir Karşılaştırma Aracı</h2>
                  <p className="text-muted-foreground mt-1">
                    Dijital göçebe metriklerini yan yana karşılaştırın
                  </p>
                </div>
                <CityComparison />
              </div>
              
              {/* Cost Calculator Sidebar */}
              <div className="lg:sticky lg:top-20 h-fit">
                <NomadCostCalculator />
              </div>
            </div>
          </TabsContent>

          {/* Coworking Tab */}
          <TabsContent value="coworking" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Coworking Alanları</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCoworkings.map((space) => {
                const city = cityData[space.citySlug];
                return (
                  <Link key={space.slug} to={`/coworking/${space.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-all group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {space.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {city?.name || space.citySlug}, {space.neighborhood}
                            </CardDescription>
                          </div>
                          {space.rating && (
                            <Badge className="bg-yellow-100 text-yellow-700">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              {space.rating}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {space.summary}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {space.amenities.slice(0, 4).map((amenity) => (
                            <Badge key={amenity} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        {space.pricing && (
                          <div className="flex items-center gap-4 text-sm">
                            {space.pricing.daily && (
                              <span>
                                <strong>{space.pricing.currency} {space.pricing.daily}</strong>/gün
                              </span>
                            )}
                            {space.pricing.monthly && (
                              <span>
                                <strong>{space.pricing.currency} {space.pricing.monthly}</strong>/ay
                              </span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {filteredCoworkings.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>"{searchQuery}" için coworking bulunamadı.</p>
              </div>
            )}
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Dijital Göçebe Rehberleri</h2>
              <Link to="/blog">
                <Button variant="outline" size="sm">
                  Tüm Yazılar <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nomadPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all group overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary text-primary-foreground">
                          🏝️ Dijital Göçebe
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.publishedAt).toLocaleDateString('tr-TR')}
                        </span>
                        <span>{post.readingTime} dk okuma</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <Plane className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold mb-1">Vize Rehberi</h3>
                  <p className="text-sm text-muted-foreground">Dijital göçebe vizeleri ve başvuru şartları</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                  <DollarSign className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold mb-1">Finans Yönetimi</h3>
                  <p className="text-sm text-muted-foreground">Uluslararası bankalar ve vergi ipuçları</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
                <CardContent className="pt-6">
                  <Shield className="h-8 w-8 text-purple-600 mb-3" />
                  <h3 className="font-semibold mb-1">Sağlık Sigortası</h3>
                  <p className="text-sm text-muted-foreground">Göçebe sigortası karşılaştırması</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
                <CardContent className="pt-6">
                  <TrendingUp className="h-8 w-8 text-orange-600 mb-3" />
                  <h3 className="font-semibold mb-1">Freelance İş</h3>
                  <p className="text-sm text-muted-foreground">Remote iş bulma platformları</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Visa Tab */}
          <TabsContent value="visa" className="space-y-6">
            <VisaComparisonTool />
          </TabsContent>
        </Tabs>

        {/* Featured Cities Comparison */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Şehir Karşılaştırması</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Şehir</th>
                  <th className="text-center py-3 px-4 font-medium">Nomad Skoru</th>
                  <th className="text-center py-3 px-4 font-medium">İnternet</th>
                  <th className="text-center py-3 px-4 font-medium">Yaşam Maliyeti</th>
                  <th className="text-center py-3 px-4 font-medium">Güvenlik</th>
                  <th className="text-center py-3 px-4 font-medium">Topluluk</th>
                </tr>
              </thead>
              <tbody>
                {nomadCities.slice(0, 6).map((city) => city && (
                  <tr key={city.slug} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <Link 
                        to={`/sehir/${city.slug}/nomad`}
                        className="flex items-center gap-3 hover:text-primary"
                      >
                        <img 
                          src={city.image} 
                          alt={city.name} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{city.name}</div>
                          <div className="text-sm text-muted-foreground">{city.country}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge className={getScoreColor(city.metrics.nomadScore)}>
                        {city.metrics.nomadScore}/10
                      </Badge>
                    </td>
                    <td className="text-center py-3 px-4">{city.metrics.internetSpeed}</td>
                    <td className="text-center py-3 px-4">{city.metrics.costOfLiving}</td>
                    <td className="text-center py-3 px-4">
                      <Badge className={getScoreColor(city.metrics.safetyScore)}>
                        {city.metrics.safetyScore}/10
                      </Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge className={getScoreColor(city.metrics.communityScore)}>
                        {city.metrics.communityScore}/10
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center">
          <Laptop className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Dijital Göçebe Olmaya Hazır mısınız?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            İlk adımı atın! Ucuz uçuş bulun, en iyi şehirleri keşfedin ve 
            remote çalışma hayatına başlayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg">
                <Plane className="mr-2 h-5 w-5" />
                Uçuş Ara
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="outline" size="lg">
                <BookOpen className="mr-2 h-5 w-5" />
                Rehberleri Oku
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default NomadHub;