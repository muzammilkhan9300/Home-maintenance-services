import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// ── Public pages — ALL lazy loaded so initial bundle is minimal ──────────────
const Landing       = lazy(() => import("./pages/Landing"));
const About         = lazy(() => import("./pages/About"));
const Services      = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Contact       = lazy(() => import("./pages/Contact"));
const NotFound      = lazy(() => import("./pages/NotFound"));
const ACCleaningLanding         = lazy(() => import("./pages/ACCleaningLanding"));
const BuildingCleaningLanding   = lazy(() => import("./pages/BuildingCleaningLanding"));
const PaintingLanding           = lazy(() => import("./pages/PaintingLanding"));
const ElectricalLanding         = lazy(() => import("./pages/ElectricalLanding"));
const PlumbingLanding           = lazy(() => import("./pages/PlumbingLanding"));
const SanitaryPipesLanding      = lazy(() => import("./pages/SanitaryPipesLanding"));
const TilingLanding             = lazy(() => import("./pages/TilingLanding"));
const PropertyCareLanding       = lazy(() => import("./pages/PropertyCareLanding"));
const SystemsMaintenanceLanding = lazy(() => import("./pages/SystemsMaintenanceLanding"));
const PlasterWorksLanding       = lazy(() => import("./pages/PlasterWorksLanding"));

// ── Admin layout + login — lazy loaded (public visitors never need these) ─────
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminLogin  = lazy(() => import("./pages/admin/AdminLogin"));

// ── Admin pages — lazy loaded (visitors NEVER need these) ─────────────────────
// Saves ~300KB of JS from the initial payload for all non-admin visitors
const AdminDashboard    = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLeads        = lazy(() => import("./pages/admin/AdminLeads"));
const AdminCareers      = lazy(() => import("./pages/admin/AdminCareers"));
const AdminAds          = lazy(() => import("./pages/admin/AdminAds"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminNotices      = lazy(() => import("./pages/admin/AdminNotices"));
const AdminAnalytics    = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminPlugins      = lazy(() => import("./pages/admin/AdminPlugins"));
const AdminSettings     = lazy(() => import("./pages/admin/AdminSettings"));

// ── Global components ─────────────────────────────────────────────────────────
import ScriptInjector   from "./components/ScriptInjector";
import AnalyticsTracker from "./components/AnalyticsTracker";

// ── Loading fallback for lazy routes ──────────────────────────────────────────
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);


const queryClient = new QueryClient();

// ── Scroll to top on every route change ──────────────────────────────────────
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <ScriptInjector />
          <AnalyticsTracker />
          <Routes>
            {/* ── Public Routes ─────────────────────────────────────── */}
            <Route path="/"             element={<Suspense fallback={<PageLoader />}><Landing /></Suspense>} />
            <Route path="/about"        element={<Suspense fallback={<PageLoader />}><About /></Suspense>} />
            <Route path="/services"     element={<Suspense fallback={<PageLoader />}><Services /></Suspense>} />
            <Route path="/services/ac-cleaning"          element={<Suspense fallback={<PageLoader />}><ACCleaningLanding /></Suspense>} />
            <Route path="/ac-cleaning"                    element={<Suspense fallback={<PageLoader />}><ACCleaningLanding /></Suspense>} />
            <Route path="/services/building-cleaning"     element={<Suspense fallback={<PageLoader />}><BuildingCleaningLanding /></Suspense>} />
            <Route path="/services/painting"              element={<Suspense fallback={<PageLoader />}><PaintingLanding /></Suspense>} />
            <Route path="/services/electrical"            element={<Suspense fallback={<PageLoader />}><ElectricalLanding /></Suspense>} />
            <Route path="/services/plumbing"              element={<Suspense fallback={<PageLoader />}><PlumbingLanding /></Suspense>} />
            <Route path="/services/sanitary-pipes"        element={<Suspense fallback={<PageLoader />}><SanitaryPipesLanding /></Suspense>} />
            <Route path="/services/tiling"                element={<Suspense fallback={<PageLoader />}><TilingLanding /></Suspense>} />
            <Route path="/services/property-care"         element={<Suspense fallback={<PageLoader />}><PropertyCareLanding /></Suspense>} />
            <Route path="/services/systems-maintenance"   element={<Suspense fallback={<PageLoader />}><SystemsMaintenanceLanding /></Suspense>} />
            <Route path="/services/plaster-works"         element={<Suspense fallback={<PageLoader />}><PlasterWorksLanding /></Suspense>} />
            <Route path="/services/:id"                   element={<Suspense fallback={<PageLoader />}><ServiceDetail /></Suspense>} />
            <Route path="/contact"      element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />

            {/* ── Admin Routes (lazy loaded) ─────────────────────────── */}
            <Route path="/admin/login" element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>} />
            <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminLayout /></Suspense>}>
              <Route index                element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"     element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
              <Route path="leads"         element={<Suspense fallback={<PageLoader />}><AdminLeads /></Suspense>} />
              <Route path="careers"       element={<Suspense fallback={<PageLoader />}><AdminCareers /></Suspense>} />
              <Route path="ads"           element={<Suspense fallback={<PageLoader />}><AdminAds /></Suspense>} />
              <Route path="testimonials"  element={<Suspense fallback={<PageLoader />}><AdminTestimonials /></Suspense>} />
              <Route path="notices"       element={<Suspense fallback={<PageLoader />}><AdminNotices /></Suspense>} />
              <Route path="analytics"     element={<Suspense fallback={<PageLoader />}><AdminAnalytics /></Suspense>} />
              <Route path="plugins"       element={<Suspense fallback={<PageLoader />}><AdminPlugins /></Suspense>} />
              <Route path="settings"      element={<Suspense fallback={<PageLoader />}><AdminSettings /></Suspense>} />
            </Route>

            {/* ── 404 ───────────────────────────────────────────────── */}
            <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
