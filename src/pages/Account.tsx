import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  User,
  Heart,
  Search,
  Map,
  Settings,
  LogOut,
  Plane,
  Hotel,
  Building2,
  Laptop,
  Calendar,
  MapPin,
  Trash2,
  ExternalLink,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useUserFavorites, Favorite, SavedSearch } from '@/hooks/useUserFavorites';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';

export default function Account() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const {
    favorites,
    savedSearches,
    loading: favLoading,
    removeFavorite,
    deleteSavedSearch,
    getFavoritesByType,
  } = useUserFavorites();

  const dateLocale = i18n.language === 'tr' ? tr : enUS;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getFavoriteIcon = (type: Favorite['favorite_type']) => {
    switch (type) {
      case 'city':
        return <Building2 className="h-4 w-4" />;
      case 'flight':
        return <Plane className="h-4 w-4" />;
      case 'hotel':
        return <Hotel className="h-4 w-4" />;
      case 'coworking':
        return <Laptop className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  const getFavoriteLink = (fav: Favorite) => {
    switch (fav.favorite_type) {
      case 'city':
        return `/sehir/${fav.item_slug}`;
      case 'coworking':
        return `/coworking/${fav.item_slug}`;
      case 'hotel':
        return `/otel/${fav.item_slug}`;
      default:
        return '#';
    }
  };

  const getSearchTypeIcon = (type: SavedSearch['search_type']) => {
    switch (type) {
      case 'flight':
        return <Plane className="h-4 w-4" />;
      case 'hotel':
        return <Hotel className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const cityFavorites = getFavoritesByType('city');
  const hotelFavorites = getFavoritesByType('hotel');
  const coworkingFavorites = getFavoritesByType('coworking');

  return (
    <>
      <Helmet>
        <title>{t('account.title')} | WooNomad</title>
        <meta name="description" content={t('account.title')} />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 container py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">{t('account.title')}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('nav.logout')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Heart className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{favorites.length}</p>
                  <p className="text-sm text-muted-foreground">{t('account.favorites')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Search className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{savedSearches.length}</p>
                  <p className="text-sm text-muted-foreground">{t('account.savedSearches')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Building2 className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{cityFavorites.length}</p>
                  <p className="text-sm text-muted-foreground">{t('nav.cities')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Laptop className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{coworkingFavorites.length}</p>
                  <p className="text-sm text-muted-foreground">{t('cities.coworking')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="favorites" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="favorites" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('account.favorites')}</span>
                </TabsTrigger>
                <TabsTrigger value="searches" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('account.savedSearches')}</span>
                </TabsTrigger>
                <TabsTrigger value="trips" className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('account.tripPlanning')}</span>
                </TabsTrigger>
              </TabsList>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="mt-6">
                {favLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : favorites.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">{t('account.noFavorites')}</p>
                      <Button asChild className="mt-4">
                        <Link to="/sehirler">{t('cities.explore')}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {favorites.map((fav) => (
                      <Card key={fav.id} className="group hover:border-primary/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              {getFavoriteIcon(fav.favorite_type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link
                                to={getFavoriteLink(fav)}
                                className="font-medium hover:text-primary transition-colors block truncate"
                              >
                                {fav.item_name}
                              </Link>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="secondary" className="capitalize">
                                  {fav.favorite_type}
                                </Badge>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(fav.created_at), 'dd MMM yyyy', { locale: dateLocale })}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Link to={getFavoriteLink(fav)}>
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFavorite(fav.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Saved Searches Tab */}
              <TabsContent value="searches" className="mt-6">
                {favLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : savedSearches.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">{t('account.noSavedSearches')}</p>
                      <Button asChild className="mt-4">
                        <Link to="/">{t('home.searchFlights')}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {savedSearches.map((search) => (
                      <Card key={search.id} className="group hover:border-primary/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              {getSearchTypeIcon(search.search_type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {search.search_name || `${search.search_type} ${t('common.search')}`}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="secondary" className="capitalize">
                                  {search.search_type}
                                </Badge>
                                {search.last_min_price && (
                                  <span className="text-primary font-medium">
                                    €{search.last_min_price}
                                  </span>
                                )}
                                {search.last_result_count !== null && (
                                  <span>{search.last_result_count} {t('flights.results')}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteSavedSearch(search.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Trip Planning Tab */}
              <TabsContent value="trips" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="h-5 w-5" />
                      {t('account.tripPlanning')}
                    </CardTitle>
                    <CardDescription>
                      {i18n.language === 'tr'
                        ? 'Favori şehirlerinizi kullanarak seyahat planınızı oluşturun'
                        : 'Create your travel plan using your favorite cities'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {cityFavorites.length === 0 ? (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">
                          {i18n.language === 'tr'
                            ? 'Seyahat planı oluşturmak için önce şehirleri favorilere ekleyin'
                            : 'Add cities to favorites first to create a travel plan'}
                        </p>
                        <Button asChild>
                          <Link to="/sehirler">{t('cities.explore')}</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          {i18n.language === 'tr'
                            ? `${cityFavorites.length} favori şehriniz var:`
                            : `You have ${cityFavorites.length} favorite cities:`}
                        </p>
                        <div className="grid gap-3">
                          {cityFavorites.map((city, index) => (
                            <div
                              key={city.id}
                              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                            >
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{city.item_name}</p>
                              </div>
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/sehir/${city.item_slug}`}>
                                  <ChevronRight className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="pt-4 border-t">
                          <Button asChild className="w-full">
                            <Link to="/nomad-hub">
                              <Laptop className="h-4 w-4 mr-2" />
                              {t('nomad.cityComparison')}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
        <MobileBottomNav />
      </div>
    </>
  );
}
