import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SettingsProvider } from "./contexts/SettingsContext";
import { LanguageRouter } from "./components/LanguageRouter";
import { HreflangTags } from "./components/HreflangTags";
import "@/i18n";
import Index from "./pages/Index";
import FlightRoute from "./pages/FlightRoute";
import FlightRoutes from "./pages/FlightRoutes";
import City from "./pages/City";
import Cities from "./pages/Cities";
import CityFlights from "./pages/CityFlights";
import CityHotels from "./pages/CityHotels";
import CityTickets from "./pages/CityTickets";
import CityNomad from "./pages/CityNomad";
import CoworkingDetail from "./pages/CoworkingDetail";
import CityActivities from "./pages/CityActivities";
import HotelDetailPage from "./pages/HotelDetailPage";
import Hotels from "./pages/Hotels";
import Esim from "./pages/Esim";
import NomadHub from "./pages/NomadHub";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogAdmin from "./pages/BlogAdmin";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import KVKK from "./pages/KVKK";
import CookiePolicy from "./pages/CookiePolicy";
import { CookieBanner } from "./components/CookieBanner";

const queryClient = new QueryClient();

// Language prefixes for non-default languages
const langPrefixes = ['en', 'de', 'fr', 'es', 'ar'];

// Route definitions with translations
const routeConfig = {
  // Home
  home: { tr: '/', en: '/', de: '/', fr: '/', es: '/', ar: '/' },
  // Cities
  cities: { tr: '/sehirler', en: '/cities', de: '/staedte', fr: '/villes', es: '/ciudades', ar: '/cities' },
  city: { tr: '/sehir/:slug', en: '/city/:slug', de: '/stadt/:slug', fr: '/ville/:slug', es: '/ciudad/:slug', ar: '/city/:slug' },
  cityHotels: { tr: '/sehir/:slug/oteller', en: '/city/:slug/hotels', de: '/stadt/:slug/hotels', fr: '/ville/:slug/hotels', es: '/ciudad/:slug/hoteles', ar: '/city/:slug/hotels' },
  cityHotelDetail: { tr: '/sehir/:citySlug/otel/:hotelSlug', en: '/city/:citySlug/hotel/:hotelSlug', de: '/stadt/:citySlug/hotel/:hotelSlug', fr: '/ville/:citySlug/hotel/:hotelSlug', es: '/ciudad/:citySlug/hotel/:hotelSlug', ar: '/city/:citySlug/hotel/:hotelSlug' },
  cityFlights: { tr: '/sehir/:slug/ucuslar', en: '/city/:slug/flights', de: '/stadt/:slug/fluege', fr: '/ville/:slug/vols', es: '/ciudad/:slug/vuelos', ar: '/city/:slug/flights' },
  cityNomad: { tr: '/sehir/:slug/nomad', en: '/city/:slug/nomad', de: '/stadt/:slug/nomad', fr: '/ville/:slug/nomade', es: '/ciudad/:slug/nomada', ar: '/city/:slug/nomad' },
  cityCoworking: { tr: '/sehir/:slug/coworking', en: '/city/:slug/coworking', de: '/stadt/:slug/coworking', fr: '/ville/:slug/coworking', es: '/ciudad/:slug/coworking', ar: '/city/:slug/coworking' },
  cityActivities: { tr: '/sehir/:slug/aktiviteler', en: '/city/:slug/activities', de: '/stadt/:slug/aktivitaeten', fr: '/ville/:slug/activites', es: '/ciudad/:slug/actividades', ar: '/city/:slug/activities' },
  // Hotels
  hotels: { tr: '/oteller', en: '/hotels', de: '/hotels', fr: '/hotels', es: '/hoteles', ar: '/hotels' },
  hotelDetail: { tr: '/otel/:slug', en: '/hotel/:slug', de: '/hotel/:slug', fr: '/hotel/:slug', es: '/hotel/:slug', ar: '/hotel/:slug' },
  // eSIM
  esim: { tr: '/esim', en: '/esim', de: '/esim', fr: '/esim', es: '/esim', ar: '/esim' },
  // Flights
  flights: { tr: '/ucuslar', en: '/flights', de: '/fluege', fr: '/vols', es: '/vuelos', ar: '/flights' },
  flightRoute: { tr: '/ucus/:slug', en: '/flight/:slug', de: '/flug/:slug', fr: '/vol/:slug', es: '/vuelo/:slug', ar: '/flight/:slug' },
  // Nomad
  nomadHub: { tr: '/dijital-gocebe', en: '/digital-nomad', de: '/digitale-nomaden', fr: '/nomade-numerique', es: '/nomada-digital', ar: '/digital-nomad' },
  nomadHubAlt: { tr: '/nomad-hub', en: '/nomad-hub', de: '/nomad-hub', fr: '/nomad-hub', es: '/nomad-hub', ar: '/nomad-hub' },
  coworkingDetail: { tr: '/coworking/:slug', en: '/coworking/:slug', de: '/coworking/:slug', fr: '/coworking/:slug', es: '/coworking/:slug', ar: '/coworking/:slug' },
  // Blog
  blog: { tr: '/blog', en: '/blog', de: '/blog', fr: '/blog', es: '/blog', ar: '/blog' },
  blogPost: { tr: '/blog/:slug', en: '/blog/:slug', de: '/blog/:slug', fr: '/blog/:slug', es: '/blog/:slug', ar: '/blog/:slug' },
  blogAdmin: { tr: '/admin/blog', en: '/admin/blog', de: '/admin/blog', fr: '/admin/blog', es: '/admin/blog', ar: '/admin/blog' },
  // Auth
  auth: { tr: '/auth', en: '/auth', de: '/auth', fr: '/auth', es: '/auth', ar: '/auth' },
  account: { tr: '/hesabim', en: '/account', de: '/konto', fr: '/compte', es: '/cuenta', ar: '/account' },
  // Legal
  privacy: { tr: '/gizlilik-politikasi', en: '/privacy-policy', de: '/datenschutz', fr: '/politique-de-confidentialite', es: '/politica-privacidad', ar: '/privacy-policy' },
  terms: { tr: '/kullanim-kosullari', en: '/terms-of-service', de: '/nutzungsbedingungen', fr: '/conditions-utilisation', es: '/terminos-servicio', ar: '/terms-of-service' },
  kvkk: { tr: '/kvkk', en: '/data-protection', de: '/datenschutz-kvkk', fr: '/protection-donnees', es: '/proteccion-datos', ar: '/data-protection' },
  cookies: { tr: '/cerez-politikasi', en: '/cookie-policy', de: '/cookie-richtlinie', fr: '/politique-cookies', es: '/politica-cookies', ar: '/cookie-policy' },
};

// Generate routes for a specific language
function generateLangRoutes(lang: 'tr' | 'en' | 'de' | 'fr' | 'es' | 'ar', prefix: string = '') {
  return (
    <>
      <Route path={`${prefix}${routeConfig.home[lang]}`} element={lang === 'tr' ? <Index /> : <Index />} />
      {/* Cities */}
      <Route path={`${prefix}${routeConfig.cities[lang]}`} element={<Cities />} />
      <Route path={`${prefix}${routeConfig.city[lang]}`} element={<City />} />
      <Route path={`${prefix}${routeConfig.cityHotels[lang]}`} element={<CityHotels />} />
      <Route path={`${prefix}${routeConfig.cityHotelDetail[lang]}`} element={<HotelDetailPage />} />
      <Route path={`${prefix}${routeConfig.cityFlights[lang]}`} element={<CityFlights />} />
      <Route path={`${prefix}${routeConfig.cityNomad[lang]}`} element={<CityNomad />} />
      <Route path={`${prefix}${routeConfig.cityCoworking[lang]}`} element={<CityNomad />} />
      <Route path={`${prefix}${routeConfig.cityActivities[lang]}`} element={<CityActivities />} />
      {/* Hotels */}
      <Route path={`${prefix}${routeConfig.hotels[lang]}`} element={<Hotels />} />
      <Route path={`${prefix}${routeConfig.hotelDetail[lang]}`} element={<HotelDetailPage />} />
      {/* eSIM */}
      <Route path={`${prefix}${routeConfig.esim[lang]}`} element={<Esim />} />
      {/* Flights */}
      <Route path={`${prefix}${routeConfig.flights[lang]}`} element={<FlightRoutes />} />
      <Route path={`${prefix}${routeConfig.flightRoute[lang]}`} element={<FlightRoute />} />
      {/* Nomad */}
      <Route path={`${prefix}${routeConfig.nomadHub[lang]}`} element={<NomadHub />} />
      <Route path={`${prefix}${routeConfig.nomadHubAlt[lang]}`} element={<NomadHub />} />
      <Route path={`${prefix}${routeConfig.coworkingDetail[lang]}`} element={<CoworkingDetail />} />
      {/* Blog */}
      <Route path={`${prefix}${routeConfig.blog[lang]}`} element={<Blog />} />
      <Route path={`${prefix}${routeConfig.blogPost[lang]}`} element={<BlogPost />} />
      <Route path={`${prefix}${routeConfig.blogAdmin[lang]}`} element={<BlogAdmin />} />
      {/* Auth */}
      <Route path={`${prefix}${routeConfig.auth[lang]}`} element={<Auth />} />
      <Route path={`${prefix}${routeConfig.account[lang]}`} element={<Account />} />
      {/* Legal */}
      <Route path={`${prefix}${routeConfig.privacy[lang]}`} element={<PrivacyPolicy />} />
      <Route path={`${prefix}${routeConfig.terms[lang]}`} element={<TermsOfService />} />
      <Route path={`${prefix}${routeConfig.kvkk[lang]}`} element={<KVKK />} />
      <Route path={`${prefix}${routeConfig.cookies[lang]}`} element={<CookiePolicy />} />
    </>
  );
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LanguageRouter>
              <HreflangTags />
              <Routes>
                {/* Turkish routes (default, no prefix) */}
                {generateLangRoutes('tr')}
                
                {/* English routes */}
                {generateLangRoutes('en', '/en')}
                
                {/* German routes */}
                {generateLangRoutes('de', '/de')}
                
                {/* French routes */}
                {generateLangRoutes('fr', '/fr')}
                
                {/* Spanish routes */}
                {generateLangRoutes('es', '/es')}
                
                {/* Arabic routes */}
                {generateLangRoutes('ar', '/ar')}
                
                {/* Redirects from old routes */}
                <Route path="/ucak-bileti/:slug" element={<Navigate to="/sehir/:slug" replace />} />
                <Route path="/destinasyonlar" element={<Navigate to="/sehirler" replace />} />
                
                {/* CityTickets - keeping for backwards compatibility */}
                <Route path="/sehir/:slug/ucak-bileti" element={<CityTickets />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CookieBanner />
            </LanguageRouter>
          </BrowserRouter>
        </TooltipProvider>
      </SettingsProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

// Export route config for use in other components
export { routeConfig };
