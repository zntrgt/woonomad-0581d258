import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SettingsProvider } from "./contexts/SettingsContext";
import Index from "./pages/Index";
import Destination from "./pages/Destination";
import Destinations from "./pages/Destinations";
import FlightRoute from "./pages/FlightRoute";
import FlightRoutes from "./pages/FlightRoutes";
import City from "./pages/City";
import Cities from "./pages/Cities";
import CityFlights from "./pages/CityFlights";
import CityHotels from "./pages/CityHotels";
import CityTickets from "./pages/CityTickets";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";

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
              <Route path="/ucak-bileti/:slug" element={<Destination />} />
              <Route path="/destinasyonlar" element={<Destinations />} />
              <Route path="/ucus/:slug" element={<FlightRoute />} />
              <Route path="/ucuslar" element={<FlightRoutes />} />
              {/* City Hub Pages */}
              <Route path="/sehir/:slug" element={<City />} />
              <Route path="/sehir/:slug/ucuslar" element={<CityFlights />} />
              <Route path="/sehir/:slug/oteller" element={<CityHotels />} />
              <Route path="/sehir/:slug/ucak-bileti" element={<CityTickets />} />
              <Route path="/sehirler" element={<Cities />} />
              {/* Blog Routes */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SettingsProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
