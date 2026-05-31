import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Public pages
import Landing  from "./pages/Landing";
import About    from "./pages/About";
import Services from "./pages/Services";
import Contact  from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLayout      from "./components/admin/AdminLayout";
import AdminLogin       from "./pages/admin/AdminLogin";
import AdminDashboard   from "./pages/admin/AdminDashboard";
import AdminLeads       from "./pages/admin/AdminLeads";
import AdminCareers     from "./pages/admin/AdminCareers";
import AdminAds         from "./pages/admin/AdminAds";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminNotices     from "./pages/admin/AdminNotices";
import AdminAnalytics   from "./pages/admin/AdminAnalytics";
import AdminSettings    from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* ── Public Routes ───────────────────────────────────── */}
            <Route path="/"         element={<Landing />} />
            <Route path="/about"    element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact"  element={<Contact />} />

            {/* ── Admin Routes ─────────────────────────────────────── */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index                element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"     element={<AdminDashboard />} />
              <Route path="leads"         element={<AdminLeads />} />
              <Route path="careers"       element={<AdminCareers />} />
              <Route path="ads"           element={<AdminAds />} />
              <Route path="testimonials"  element={<AdminTestimonials />} />
              <Route path="notices"       element={<AdminNotices />} />
              <Route path="analytics"     element={<AdminAnalytics />} />
              <Route path="settings"      element={<AdminSettings />} />
            </Route>

            {/* ── 404 ─────────────────────────────────────────────── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
