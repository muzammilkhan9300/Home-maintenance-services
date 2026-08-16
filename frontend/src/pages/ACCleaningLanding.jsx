import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Link } from "react-router-dom";

import {
  Phone, Check, MessageCircle, Building2, Clock, Tag, Zap,
  MapPin, Send, PhoneCall, ShieldCheck, Wind, Droplets, Receipt,
  Cloud, Volume2, Package, Fan, Filter, GitBranch, Wrench,
  HeartHandshake, Award, ChevronDown, Snowflake
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { trackWhatsAppClick, trackLead, trackPhoneClick } from "@/lib/analytics";
import serviceAcCleaning from "@/assets/real_ac_cleaning.webp";

// ── Lazy-load heavy below-fold sections so they don't block first paint ─────
const Footer = lazy(() => import("@/components/Footer"));

const WHATSAPP_NUMBER = "971505387736";
const CALL_NUMBER = "971505387736";

const DUBAI_AREAS = [
  "Dubai Marina", "JVC", "Palm Jumeirah", "Downtown",
  "Business Bay", "Jumeirah", "DIFC", "Al Barsha",
  "Mirdif", "Deira", "Bur Dubai", "JLT"
];

const WARNING_SIGNS = [
  { icon: Snowflake, title: "Weak Cooling", desc: "Your AC runs constantly but the air coming out isn't cold enough to cool the room." },
  { icon: Wind, title: "Bad Smell", desc: "Musty or unpleasant odors coming from your AC vents every time you switch it on." },
  { icon: Droplets, title: "Water Leakage", desc: "Water dripping or pooling around the indoor unit, risking damage to walls and ceilings." },
  { icon: Receipt, title: "High Electricity Bills", desc: "Your DEWA bills keep climbing every month despite no change in your AC usage patterns." },
  { icon: Cloud, title: "Dusty Air", desc: "Visible dust particles blowing out of the vents and settling on your furniture." },
  { icon: Volume2, title: "Noisy Operation", desc: "Unusual rattling, buzzing or grinding sounds when your AC is running." }
];

const BEFORE_AFTER = {
  before: ["Weak airflow from vents", "Higher DEWA bills every month", "Dust and allergens in the air", "Unpleasant odor from AC"],
  after: ["Strong, consistent cooling", "Better indoor air quality", "Lower energy usage & bills", "Fresh, clean air throughout"]
};

const INCLUDED_SERVICES = [
  { icon: Package,   title: "Indoor Unit Deep Cleaning",  desc: "Complete dismantling and deep cleaning of all indoor unit components including coils and blower wheel." },
  { icon: Fan,       title: "Outdoor Unit Cleaning",      desc: "Thorough cleaning of the condenser unit to remove dirt and debris, improving heat exchange efficiency." },
  { icon: Filter,    title: "Filter Sanitization",        desc: "Anti-bacterial treatment and sanitization of filters to eliminate mold, bacteria and allergens." },
  { icon: GitBranch, title: "Drain Line Inspection",      desc: "Complete inspection and clearing of condensate drain lines to prevent water leakage and damage." }
];

const WHY_CHOOSE_US = [
  { icon: ShieldCheck,    title: "Licensed Company",       desc: "Fully licensed LLC in Dubai with trade license #1571076." },
  { icon: Award,          title: "Certified Technicians",  desc: "Trained and certified AC technicians with years of field experience." },
  { icon: Wrench,         title: "Premium Equipment",      desc: "Professional-grade tools and cleaning equipment for the best results." },
  { icon: Tag,            title: "Transparent Pricing",    desc: "No hidden charges. You pay exactly what was quoted upfront." },
  { icon: Zap,            title: "Same-Day Service",       desc: "Available 7 days a week with same-day appointments in Dubai." },
  { icon: HeartHandshake, title: "Satisfaction Guaranteed",desc: "We're not done until you're completely satisfied with the results." }
];

const FAQ_ITEMS = [
  { 
    q: "How often should I get my AC cleaned in Dubai?",
    a: "We recommend a professional AC deep cleaning at least twice a year in Dubai — ideally before summer (April) and after summer (October). Dubai desert dust and humidity create mold growth inside AC ducts and coils." 
  },
  { 
    q: "What is included in your AC deep cleaning service in Dubai?",
    a: "Our deep cleaning service includes complete dismantling and pressure washing of indoor coils, blower wheel cleaning, filter sanitization, outdoor condenser coil washing, drain line flushing, and medical-grade anti-bacterial fogging." 
  },
  { 
    q: "How much does AC cleaning cost in Dubai?",
    a: "Our professional AC cleaning prices start from AED 150 per unit with transparent, upfront pricing and no hidden fees. We also offer discounted package rates for multi-unit apartments and villas." 
  },
  { 
    q: "Can dirty AC coils increase my DEWA electricity bill?",
    a: "Yes. Clogged AC coils and dirty filters restrict airflow, forcing your compressor to work up to 30% harder to cool your home. Regular coil deep cleaning lowers your DEWA monthly power consumption significantly." 
  },
  { 
    q: "How long does an AC cleaning service take per unit?",
    a: "A thorough AC deep cleaning takes approximately 45 to 60 minutes per split or package unit, depending on the level of dust buildup and accessibility." 
  },
  { 
    q: "Do you provide same-day AC cleaning service in Dubai?",
    a: "Yes, we offer same-day AC cleaning appointments 7 days a week across all Dubai areas, including Dubai Marina, JVC, Palm Jumeirah, Downtown, and Deira." 
  },
  { 
    q: "Are your technicians certified and company licensed in Dubai?",
    a: "Absolutely. Muhammad Afnan Residential Property Care Services L.L.C is a fully licensed Dubai maintenance company under Trade License #1571076, employing certified, background-checked technicians." 
  }
];

const REVIEWS = [
  { name: "Ahmed Al Mansoori", area: "Dubai Marina",   review: "Excellent AC cleaning service. The technician was punctual, professional and did a thorough job. My AC cools much better now and the air feels noticeably cleaner." },
  { name: "Sarah Williams",    area: "Palm Jumeirah",  review: "Very professional technicians. They explained everything clearly and the pricing was transparent. Highly recommended for AC cleaning in Dubai." },
  { name: "Rajesh Kumar",      area: "JVC",            review: "Cooling improved immediately after the cleaning. The team was on time and cleaned up everything before leaving. Will definitely use them again." }
];

// ── Lightweight CSS-based fade-in (replaces framer-motion for below-fold) ────
const useFadeIn = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; obs.unobserve(el); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
};

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity: 0, transition: `opacity 0.4s ease ${delay}ms` }}
    >
      {children}
    </div>
  );
};

// ── FAQ accordion ─────────────────────────────────────────────────────────────
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-card hover:bg-gold-light/20 transition-colors"
      >
        <span className="font-semibold text-foreground text-sm sm:text-base leading-snug">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gold shrink-0 transition-transform duration-250 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 py-4 text-sm text-muted-foreground leading-relaxed border-t border-border bg-card/50">
          {a}
        </div>
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const ACCleaningLanding = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", location: "", units: "" });
  const [loading, setLoading] = useState(false);
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

  // Handle smooth scroll on landing with hash anchor (e.g. #reviews)
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

  const handleWhatsAppRedirect = (data) => {
    const message = `Hello Afnan Property Care, I'd like to request a callback for AC Cleaning.%0A%0AName: ${encodeURIComponent(data.name)}%0APhone: ${encodeURIComponent(data.phone)}%0ALocation: ${encodeURIComponent(data.location)}%0AUnits: ${encodeURIComponent(data.units)}`;
    trackWhatsAppClick("AC Cleaning Landing Page Form", "AC Cleaning");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  const handleWhatsAppGeneral = () => {
    const msg = encodeURIComponent("Hi! I'm interested in your AC Cleaning services. Can you please provide more details and availability?");
    trackWhatsAppClick("AC Cleaning Landing Page Float", "AC Cleaning");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.location || !form.units) {
      toast({ title: "Validation Error", description: "All fields are required.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const apiEndpoint = import.meta.env.PROD ? "/api/contact" : "http://localhost:5000/api/contact";
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: `${form.name.replace(/\s+/g, "").toLowerCase()}@afnanpropertycare.com`,
          phone: form.phone,
          service: "ac-cleaning",
          message: `Request from dedicated landing page. Location: ${form.location}, Units: ${form.units}`
        })
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || "Failed to submit request");
      trackLead({ name: form.name, email: `${form.name}@placeholder.com`, service: "ac-cleaning" });
      toast({ title: "Request Submitted!", description: "We have saved your lead and will redirect you to WhatsApp." });
      handleWhatsAppRedirect(form);
      setForm({ name: "", phone: "", location: "", units: "" });
    } catch (err) {
      console.error(err);
      toast({ title: "Connecting you...", description: "Opening WhatsApp for immediate scheduling.", variant: "default" });
      handleWhatsAppRedirect(form);
    } finally {
      setLoading(false);
    }
  };

  // heroFade removed — hero now uses CSS animations to avoid Framer in critical path

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

            {/* Right: hero image — CSS fade-in, fetchpriority HIGH for LCP */}
            <div className="hero-fade-in relative aspect-[4/5] max-w-md mx-auto lg:max-w-none w-full rounded-3xl overflow-hidden border border-gold/10 shadow-gold/20 shadow-2xl" style={{ animationDelay: '150ms' }}>
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

      {/* ── LOCATIONS BAR ── */}
      <section id="areas" className="bg-gold-light border-y border-gold/10 py-6 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-center text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-4">
            Trusted By Homeowners Across Dubai
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {DUBAI_AREAS.slice(0, 8).map((area) => (
              <div key={area} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background border border-gold/15 shadow-sm text-xs sm:text-sm font-semibold text-navy hover:border-gold/40 hover:shadow-md transition-all duration-300 shrink-0">
                <div className="w-6 h-6 rounded-lg bg-gold/10 flex items-center justify-center text-gold shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WARNING SIGNS ── CSS fade-in (no framer-motion) ── */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">Is Your AC Showing These Signs?</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">If you're experiencing any of these issues, it's time to call in the professionals for a deep AC clean.</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WARNING_SIGNS.map((sign, idx) => {
              const SIcon = sign.icon;
              return (
                <FadeIn key={sign.title} delay={idx * 80} className="flex gap-5 p-6 rounded-2xl bg-card border border-border shadow-sm hover:border-gold/30 hover:-translate-y-1.5 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 group-hover:bg-gold/15 flex items-center justify-center shrink-0 text-gold transition-colors">
                    <SIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm sm:text-base mb-1.5">{sign.title}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{sign.desc}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER ── */}
      <section id="before-after" className="py-20 bg-gold-light/20 border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">Before vs After Cleaning</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">See the transformation our professional AC cleaning service delivers.</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn className="p-6 sm:p-8 rounded-2xl border border-red-500/20 bg-red-500/[0.02] space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 font-extrabold shrink-0">✕</div>
                <h3 className="text-lg font-extrabold text-red-500 font-['Montserrat']">Before Cleaning</h3>
              </div>
              <ul className="space-y-3.5">
                {BEFORE_AFTER.before.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground/80 leading-snug">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5 text-[10px] text-red-500 font-bold">✕</div>
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={100} className="p-6 sm:p-8 rounded-2xl border border-green-500/20 bg-green-500/[0.02] space-y-5 relative">
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gold text-white font-extrabold text-[9px] tracking-widest uppercase shadow-md">Recommended</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 font-extrabold shrink-0">✓</div>
                <h3 className="text-lg font-extrabold text-green-500 font-['Montserrat']">After Cleaning</h3>
              </div>
              <ul className="space-y-3.5">
                {BEFORE_AFTER.after.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground/90 font-medium leading-snug">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5 text-[10px] text-green-500 font-bold">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">Comprehensive AC Deep Cleaning Services in Dubai</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">Our certified technicians follow strict HVAC protocols to clean, sanitize, and restore your cooling units.</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INCLUDED_SERVICES.map((item, idx) => {
              const IncIcon = item.icon;
              return (
                <FadeIn key={item.title} delay={idx * 80} className="p-6 rounded-2xl bg-card border border-border hover:border-gold/20 transition-all duration-300 flex flex-col space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold-light flex items-center justify-center text-gold shrink-0"><IncIcon className="w-6 h-6" /></div>
                  <h3 className="font-bold text-foreground text-sm sm:text-base">{item.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5-STEP PROCESS SECTION ── */}
      <section className="py-20 lg:py-24 bg-gold-light/10 border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">Our 5-Step Professional AC Cleaning Process</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">Systematic, mess-free deep cleaning engineered for peak cooling efficiency in Dubai's hot desert climate.</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {[
              { num: "01", title: "Step 1: Inspection & Airflow Check", desc: "Initial diagnostic check of air output velocity, thermostat responsiveness, and electrical current." },
              { num: "02", title: "Step 2: Masking & Dismantling", desc: "Wall and furniture protection covers installed before removing front covers and filters." },
              { num: "03", title: "Step 3: Jet Pressure Coil Wash", desc: "High-pressure wash bag system flushes all dirt, dust, and debris from evaporator coils." },
              { num: "04", title: "Step 4: Anti-Bacterial Fogging", desc: "Medical-grade non-toxic disinfectant treatment applied to eliminate mold spores and odor." },
              { num: "05", title: "Step 5: Final Testing & Reassembly", desc: "Complete reassembly followed by temperature drop test to verify cold air distribution." }
            ].map((step, idx) => (
              <FadeIn key={step.num} delay={idx * 70} className="p-5 rounded-2xl bg-card border border-border space-y-2 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-2xl font-black text-gold font-['Montserrat']">{step.num}</span>
                  <h3 className="font-bold text-foreground text-xs sm:text-sm mt-1 mb-2 leading-snug">{step.title}</h3>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">Why Choose Afnan Property Care for AC Cleaning in Dubai</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">Trusted by homeowners, villa residents, and property managers across Dubai.</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE_US.map((item, idx) => {
              const WIcon = item.icon;
              return (
                <FadeIn key={item.title} delay={idx * 80} className="flex gap-4 p-5 rounded-2xl bg-card border border-border hover:border-gold/30 hover:bg-gold-light/5 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-navy flex items-center justify-center shrink-0 text-gold shadow-md"><WIcon className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm sm:text-base mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 lg:py-24 bg-navy text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.2)_0,transparent_60%)]" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center space-y-12">
          <FadeIn className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-white">Our Track Record</h2>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed">Numbers that speak to our commitment and quality of service.</p>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[["2,000+","Units Serviced"],["4.9★","Customer Rating"],["<1 Hr","Response Time"],["100%","Satisfaction Goal"]].map(([val, lbl]) => (
              <div key={lbl} className="flex flex-col items-center p-5 rounded-2xl bg-slate-900/40 border border-gold/10 text-center">
                <span className="text-gold font-extrabold text-2xl lg:text-4xl leading-none mb-1 text-gradient-gold">{val}</span>
                <span className="text-slate-300 text-xs uppercase tracking-wider">{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section id="reviews" className="py-20 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">Customer Reviews</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">Real feedback from real customers across Dubai.</p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((rev, idx) => (
              <FadeIn key={rev.name} delay={idx * 100} className="p-6 sm:p-8 rounded-2xl bg-card border border-border flex flex-col justify-between shadow-sm hover:border-gold/20 transition-all duration-300">
                <div>
                  <div className="text-gold font-bold text-sm mb-4">★★★★★</div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">"{rev.review}"</p>
                </div>
                <div className="flex items-center gap-3.5 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-navy text-gold flex items-center justify-center font-bold font-['Montserrat'] shrink-0 shadow-md">{rev.name[0]}</div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{rev.name}</h4>
                    <p className="text-muted-foreground text-[11px] font-medium">{rev.area}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE FORM ── */}
      <section id="pricing" className="py-20 lg:py-24 bg-gold-light/20 border-t border-border relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-10 border-b border-border bg-navy text-primary-foreground relative overflow-hidden text-center space-y-2">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.2)_0,transparent_60%)]" />
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Montserrat'] text-white relative z-10">Get Your Free Quote</h2>
              <p className="text-white/70 text-xs sm:text-sm max-w-sm mx-auto relative z-10 leading-snug">Fill in your details and our team will call you back within 30 minutes.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2">Name *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-200"
                    placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2">Phone *</label>
                  <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-200"
                    placeholder="+971 5X XXX XXXX" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2">Location *</label>
                  <input type="text" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-200"
                    placeholder="e.g. Dubai Marina" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2">Number of Units *</label>
                  <select required value={form.units} onChange={(e) => setForm({ ...form, units: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-200">
                    <option value="">Select units</option>
                    <option value="1">1 Unit</option>
                    <option value="2">2 Units</option>
                    <option value="3">3 Units</option>
                    <option value="4">4 Units</option>
                    <option value="5+">5+ Units</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-accent text-accent-foreground font-extrabold text-sm sm:text-base hover:brightness-110 active:scale-95 transition-all shadow-gold disabled:opacity-50 mt-2">
                <PhoneCall className="w-4 h-4" />
                {loading ? "Submitting..." : "Request Callback"}
              </button>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-4 font-medium">
                <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                We'll call you back within 30 minutes.
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 lg:py-24 bg-navy text-primary-foreground relative overflow-hidden border-t border-gold/15">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.25)_0,transparent_60%)]" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />Available Now
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Montserrat'] text-white tracking-tight leading-tight max-w-xl mx-auto">Need AC Cleaning Today?</h2>
          <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto">Call now and get a technician dispatched anywhere in Dubai.</p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a href={`tel:+${CALL_NUMBER}`}
              onClick={() => trackPhoneClick("AC Cleaning - CTA Section", "AC Cleaning")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-navy font-bold hover:bg-gold-light active:scale-95 transition-all shadow-lg text-sm sm:text-base border border-gold/10">
              <Phone className="w-4 h-4 text-gold shrink-0" />Call Now
            </a>
            <button onClick={handleWhatsAppGeneral}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#1ebe5d] active:scale-95 transition-all shadow-lg text-sm sm:text-base">
              <MessageCircle className="w-4 h-4 shrink-0" />WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* ── INTERNAL LINKING & OTHER SERVICES HUB ── */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6 text-center">
            <h3 className="text-xl font-bold font-['Montserrat'] text-foreground">Explore Our Full Range of Dubai Home Maintenance Services</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              As a top-rated <Link to="/" className="text-gold font-bold underline hover:text-gold/80 transition-colors">licensed Dubai home maintenance company</Link>, we provide complete property upkeep solutions. You can also <Link to="/contact" className="text-gold font-bold underline hover:text-gold/80 transition-colors">schedule a custom maintenance consultation</Link> with our engineering team today.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link to="/services/plumbing" className="px-4 py-2 rounded-xl bg-gold-light/20 border border-gold/20 text-xs font-semibold text-foreground hover:bg-gold/10 transition-colors">
                🚿 <span className="underline">emergency plumbing services in Dubai</span>
              </Link>
              <Link to="/services/electrical" className="px-4 py-2 rounded-xl bg-gold-light/20 border border-gold/20 text-xs font-semibold text-foreground hover:bg-gold/10 transition-colors">
                ⚡ <span className="underline">certified residential electrical repairs</span>
              </Link>
              <Link to="/services" className="px-4 py-2 rounded-xl bg-gold-light/20 border border-gold/20 text-xs font-semibold text-foreground hover:bg-gold/10 transition-colors">
                🛠️ <span className="underline">explore full property maintenance services</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOCAL SEO & MAPS SECTION ── */}
      <section className="py-20 bg-gold-light/10 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider">
                Official Dubai Office Location
              </div>
              <h3 className="text-2xl lg:text-3xl font-extrabold font-['Montserrat'] text-foreground">Muhammad Afnan Residential Property Care Services L.L.C</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span><strong>Address:</strong> Rolex Twin Tower, 33 Baniyas Rd, Al Rigga, Deira, Dubai, UAE</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold shrink-0" />
                  <span><strong>Phone:</strong> +971 50 538 7736</span>
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                  <span><strong>Trade License No.:</strong> 1571076</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold shrink-0" />
                  <span><strong>Operating Hours:</strong> Open 24/7 for Emergency Appointments</span>
                </p>
              </div>
              <div className="pt-2 flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 text-xs font-bold">
                  ✓ Verified Local Business
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/30 text-gold text-xs font-bold">
                  Last Updated: August 2026
                </span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border shadow-lg h-72">
              <iframe
                title="Afnan Property Care Location Map"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d16178401.047389235!2d43.20972260441566!3d23.67500795662452!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f4307195fe9cf%3A0x8296ae4aaa9acb14!2sAfnan%20Property%20Care%20Services%20LLC!5e0!3m2!1sen!2s!4v1786377585483!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">Frequently Asked Questions About AC Cleaning in Dubai</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">Find direct answers to common questions about our AC cleaning services and DEWA energy efficiency.</p>
          </FadeIn>
          <div className="max-w-3xl mx-auto space-y-4">
            {FAQ_ITEMS.map((item, idx) => <FAQItem key={idx} q={item.q} a={item.a} />)}
          </div>
        </div>
      </section>

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
