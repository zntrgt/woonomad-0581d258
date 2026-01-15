import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SettingsProvider } from "./contexts/SettingsContext";
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
import HotelDetail from "./pages/HotelDetail";
import Hotels from "./pages/Hotels";
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

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* Redirects from old routes */}
              <Route path="/ucak-bileti/:slug" element={<Navigate to="/sehir/:slug" replace />} />
              <Route path="/destinasyonlar" element={<Navigate to="/sehirler" replace />} />
              {/* Flight Routes */}
              <Route path="/ucus/:slug" element={<FlightRoute />} />
              <Route path="/ucuslar" element={<FlightRoutes />} />
              {/* City Hub Pages */}
              <Route path="/sehir/:slug" element={<City />} />
              <Route path="/sehir/:slug/ucuslar" element={<CityFlights />} />
              <Route path="/sehir/:slug/oteller" element={<CityHotels />} />
              <Route path="/sehir/:slug/ucak-bileti" element={<CityTickets />} />
              <Route path="/sehir/:slug/nomad" element={<CityNomad />} />
              <Route path="/sehir/:slug/coworking" element={<CityNomad />} />
              <Route path="/sehirler" element={<Cities />} />
              {/* Coworking Detail */}
              <Route path="/coworking/:slug" element={<CoworkingDetail />} />
              {/* Hotels */}
              <Route path="/oteller" element={<Hotels />} />
              <Route path="/otel/:slug" element={<HotelDetail />} />
              {/* Nomad Hub */}
              <Route path="/nomad-hub" element={<NomadHub />} />
              <Route path="/dijital-gocebe" element={<NomadHub />} />
              {/* Blog Routes */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/admin/blog" element={<BlogAdmin />} />
              {/* Auth & Account */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/hesabim" element={<Account />} />
              {/* Legal Pages */}
              <Route path="/gizlilik-politikasi" element={<PrivacyPolicy />} />
              <Route path="/kullanim-kosullari" element={<TermsOfService />} />
              <Route path="/kvkk" element={<KVKK />} />
              <Route path="/cerez-politikasi" element={<CookiePolicy />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieBanner />
          </BrowserRouter>
        </TooltipProvider>
      </SettingsProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
