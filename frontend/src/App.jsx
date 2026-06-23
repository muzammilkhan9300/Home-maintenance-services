import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// ── Public pages — loaded eagerly (visitors need these immediately) ─────────
import Landing       from "./pages/Landing";
import About         from "./pages/About";
import Services      from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Contact       from "./pages/Contact";
import NotFound      from "./pages/NotFound";
import ACCleaningLanding from "./pages/ACCleaningLanding";

// ── Admin layout (lightweight shell — loaded eagerly for fast login redirect) ─
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin  from "./pages/admin/AdminLogin";

// ── Admin pages — lazy loaded (visitors NEVER need these) ─────────────────────
// Saves ~300KB of JS from the initial payload for all non-admin visitors
const AdminDashboard   = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLeads       = lazy(() => import("./pages/admin/AdminLeads"));
const AdminCareers     = lazy(() => import("./pages/admin/AdminCareers"));
const AdminAds         = lazy(() => import("./pages/admin/AdminAds"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminNotices     = lazy(() => import("./pages/admin/AdminNotices"));
const AdminAnalytics   = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminPlugins     = lazy(() => import("./pages/admin/AdminPlugins"));
const AdminSettings    = lazy(() => import("./pages/admin/AdminSettings"));

// ── Global components ─────────────────────────────────────────────────────────
import ScriptInjector   from "./components/ScriptInjector";
import AnalyticsTracker from "./components/AnalyticsTracker";

// ── Loading fallback for lazy admin routes ────────────────────────────────────
const AdminLoader = () => (
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
            <Route path="/"             element={<Landing />} />
            <Route path="/about"        element={<About />} />
            <Route path="/services"     element={<Services />} />
            <Route path="/services/ac-cleaning" element={<ACCleaningLanding />} />
            <Route path="/ac-cleaning"  element={<ACCleaningLanding />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/contact"      element={<Contact />} />

            {/* ── Admin Routes (lazy loaded) ─────────────────────────── */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index                element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"     element={<Suspense fallback={<AdminLoader />}><AdminDashboard /></Suspense>} />
              <Route path="leads"         element={<Suspense fallback={<AdminLoader />}><AdminLeads /></Suspense>} />
              <Route path="careers"       element={<Suspense fallback={<AdminLoader />}><AdminCareers /></Suspense>} />
              <Route path="ads"           element={<Suspense fallback={<AdminLoader />}><AdminAds /></Suspense>} />
              <Route path="testimonials"  element={<Suspense fallback={<AdminLoader />}><AdminTestimonials /></Suspense>} />
              <Route path="notices"       element={<Suspense fallback={<AdminLoader />}><AdminNotices /></Suspense>} />
              <Route path="analytics"     element={<Suspense fallback={<AdminLoader />}><AdminAnalytics /></Suspense>} />
              <Route path="plugins"       element={<Suspense fallback={<AdminLoader />}><AdminPlugins /></Suspense>} />
              <Route path="settings"      element={<Suspense fallback={<AdminLoader />}><AdminSettings /></Suspense>} />
            </Route>

            {/* ── 404 ───────────────────────────────────────────────── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
