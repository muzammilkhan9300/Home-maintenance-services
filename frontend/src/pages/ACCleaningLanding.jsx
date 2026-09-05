import { useState, useEffect, lazy, Suspense } from "react";
import { useRef } from "react";
import {
  Phone, Check, MessageCircle, Building2, Clock, Tag, Zap,
  Send, ShieldCheck
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { trackWhatsAppClick, trackPhoneClick } from "@/lib/analytics";
import serviceAcCleaning from "@/assets/real_ac_cleaning.webp";

// ── Lazy-load everything below the hero so first paint only needs to
//    download/parse/execute the hero itself — the rest (locations bar,
//    warning signs, before/after, included services, process steps, why
//    choose us, stats, reviews, quote form, final CTA, internal links, the
//    maps embed, and FAQ) loads in its own chunk right after, off the
//    critical path. Same pattern already used for Footer below.
const BelowFold = lazy(() => import("./ACCleaningBelowFold"));
const Footer = lazy(() => import("@/components/Footer"));

const WHATSAPP_NUMBER = "971505387736";
const CALL_NUMBER = "971505387736";

// ── Main component ────────────────────────────────────────────────────────────
const ACCleaningLanding = () => {
  const [hideSticky, setHideSticky] = useState(true);
  const heroButtonsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { setHideSticky(entry.isIntersecting); },
      { threshold: 0, rootMargin: "0px" }
    );
    if (heroButtonsRef.current) observer.observe(heroButtonsRef.current);
    return () => observer.disconnect();
  }, []);

  // Handle smooth scroll on landing with hash anchor (e.g. #reviews) — these
  // ids live in the lazy-loaded BelowFold chunk, hence the delay to let it mount.
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const id = hash.replace("#", "");
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 400); // 400ms delay to allow React Suspense chunks to finish mounting
      }
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);

  const handleWhatsAppGeneral = () => {
    const msg = encodeURIComponent("Hi! I'm interested in your AC Cleaning services. Can you please provide more details and availability?");
    trackWhatsAppClick("AC Cleaning Landing Page Float", "AC Cleaning");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <SEO
        title="AC Cleaning Service Dubai | Same Day Deep Clean"
        description="Top-rated AC cleaning service in Dubai. Same-day AC deep cleaning, coil sanitization & duct cleaning. Certified technicians, licensed LLC. Book today!"
        keywords="AC cleaning service Dubai, AC deep cleaning Dubai, AC duct cleaning Dubai, split AC cleaning Dubai, AC coil cleaning Dubai, AC sanitization Dubai, best AC cleaning company Dubai, AC mold removal Dubai, residential AC maintenance Dubai"
        canonicalUrl="/services/ac-cleaning"
        robots="index, follow, max-image-preview:large"
        themeColor="#0F6CBD"
        ogTitle="AC Cleaning Service Dubai | Same Day Deep Clean | Afnan Property Care"
        ogDescription="Top-rated AC cleaning service in Dubai. Same-day AC deep cleaning, coil sanitization & duct cleaning. Certified technicians, licensed LLC. Book today!"
        ogImage="https://maresidentialpropertycareservicellc.com/og-images/ac-cleaning-dubai.jpg"
        twitterTitle="AC Cleaning Service Dubai | Same Day Deep Clean | Afnan Property Care"
        twitterDescription="Top-rated AC cleaning service in Dubai. Same-day AC deep cleaning, coil sanitization & duct cleaning. Certified technicians, licensed LLC. Book today!"
        twitterImage="https://maresidentialpropertycareservicellc.com/og-images/ac-cleaning-dubai.jpg"
      />

      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-28 lg:pt-36 pb-20 overflow-hidden bg-navy text-primary-foreground">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0,transparent_60%)]" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-gold/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: text — CSS fade-in to avoid Framer in critical path */}
            <div className="space-y-6 hero-fade-in" style={{ animationDelay: '0ms' }}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                  Available Today Across Dubai
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold">
                  Trade License #1571076
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-['Montserrat'] tracking-tight leading-tight">
                Professional AC Cleaning <br />
                <span className="text-gradient-gold">Service in Dubai</span>
              </h1>

              <p className="text-lg sm:text-xl font-bold text-white/90 leading-snug">
                Professional AC Cleaning Services For Villas, Apartments &amp; Offices
              </p>
              <p className="text-sm sm:text-base text-primary-foreground/75 leading-relaxed max-w-xl">
                Improve cooling performance, remove dust and odors, and reduce electricity consumption with certified AC technicians.
              </p>

              <div className="grid grid-cols-2 gap-3 max-w-xl">
                {["Same-Day Service", "Licensed LLC", "Fully Insured", "All Dubai Areas"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-gold" />
                    </div>
                    <span className="text-sm font-semibold text-white/90">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA buttons — observed to toggle sticky bar */}
              <div ref={heroButtonsRef} className="flex flex-row gap-3 pt-4 w-full">
                <a
                  href="#pricing"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3.5 rounded-xl bg-accent text-accent-foreground font-bold hover:brightness-110 active:scale-95 transition-all shadow-gold text-xs sm:text-sm sm:px-7 sm:py-4 sm:gap-2 shrink-0"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Get Free Quote</span>
                </a>
                <button
                  onClick={handleWhatsAppGeneral}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3.5 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#1ebe5d] active:scale-95 transition-all shadow-lg text-xs sm:text-sm sm:px-7 sm:py-4 sm:gap-2 shrink-0"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">WhatsApp Now</span>
                </button>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-white/10 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5"><div className="text-gold font-bold">★★★★★</div><span className="text-white/60">4.9 Rating</span></div>
                <div className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-gold" /><span className="text-white/60">2,000+ Units Serviced</span></div>
                <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gold" /><span className="text-white/60">&lt;1 Hour Response</span></div>
              </div>
            </div>

            {/* Right: hero image — visible immediately, no fade (this is the LCP element;
                an opacity animation here would delay its paint and hurt LCP) */}
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-none w-full rounded-3xl overflow-hidden border border-gold/10 shadow-gold/20 shadow-2xl">
              <img
                src={serviceAcCleaning}
                alt="Afnan Professional AC cleaning service"
                className="w-full h-full object-cover"
                fetchpriority="high"
                loading="eager"
                decoding="async"
                width="600"
                height="750"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />

              {/* Floating cards */}
              <div className="absolute top-6 left-6 p-4 rounded-2xl bg-white/95 border border-gold/25 shadow-lg flex items-center gap-3 backdrop-blur-md animate-bounce" style={{ animationDuration: "3s" }}>
                <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-gold"><Tag className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none font-semibold">Starting Price</p>
                  <p className="font-extrabold text-base text-gold mt-1">AED 150</p>
                </div>
              </div>
              <div className="absolute top-1/2 right-6 -translate-y-1/2 p-4 rounded-2xl bg-white/95 border border-gold/25 shadow-lg flex items-center gap-3 backdrop-blur-md animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}>
                <div className="w-10 h-10 rounded-xl bg-[#22c55e]/15 flex items-center justify-center text-[#22c55e]"><Zap className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none font-semibold">Same-Day</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">Appointments</p>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 p-4 rounded-2xl bg-white/95 border border-gold/25 shadow-lg flex items-center gap-3 backdrop-blur-md animate-bounce" style={{ animationDuration: "5s", animationDelay: "2s" }}>
                <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-gold"><ShieldCheck className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none font-semibold">Free Inspection</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">No Obligation</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Lazy-loaded: everything below the hero */}
      <Suspense fallback={null}>
        <BelowFold />
      </Suspense>

      {/* Lazy-loaded Footer */}
      <Suspense fallback={<div className="h-32 bg-navy" />}>
        <Footer />
      </Suspense>

      {/* ── MOBILE STICKY BAR ── */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 border-t border-border/80 backdrop-blur-md px-4 py-3 flex gap-3 shadow-2xl transition-all duration-500 ease-in-out ${
        hideSticky ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      }`}>
        <a href={`tel:+${CALL_NUMBER}`}
          onClick={() => trackPhoneClick("AC Cleaning - Mobile Sticky Bar", "AC Cleaning")}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-accent text-accent-foreground font-bold text-xs active:scale-95 transition-all border border-gold/10">
          <Phone className="w-3.5 h-3.5" />Call
        </a>
        <button onClick={handleWhatsAppGeneral}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#25D366] text-white font-bold text-xs active:scale-95 transition-all shadow-md">
          <MessageCircle className="w-3.5 h-3.5" />WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ACCleaningLanding;
