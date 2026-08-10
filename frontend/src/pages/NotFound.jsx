import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Wrench, Home, ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Page Not Found | 404 Error | Afnan Property Care"
        description="The requested page could not be found. Return to Afnan Property Care home page or browse our property maintenance services in Dubai."
        robots="noindex, nofollow"
        pageType="notfound"
      />
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
          <Wrench className="w-10 h-10 text-accent" />
        </div>
        <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-4">
          Error 404
        </span>
        <h1 className="text-4xl md:text-5xl font-bold font-['Montserrat'] text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-accent text-accent-foreground font-semibold hover:brightness-110 transition-all shadow-gold text-sm"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-border text-foreground font-semibold hover:bg-accent/5 transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> View All Services
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
