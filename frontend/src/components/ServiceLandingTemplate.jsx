import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  Phone, Check, MessageCircle, Building2, Clock, Tag, Zap,
  MapPin, Send, PhoneCall, ShieldCheck, ChevronDown
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { trackWhatsAppClick, trackLead, trackPhoneClick } from "@/lib/analytics";

const Footer = lazy(() => import("@/components/Footer"));

const WHATSAPP_NUMBER = "971505387736";
const CALL_NUMBER = "971505387736";

const DUBAI_AREAS = [
  "Dubai Marina", "JVC", "Palm Jumeirah", "Downtown",
  "Business Bay", "Jumeirah", "DIFC", "Al Barsha",
  "Mirdif", "Deira", "Bur Dubai", "JLT"
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
      style={{ opacity: 0, transform: "translateY(24px)", transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms` }}
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

// ── WHY_CHOOSE_US (static — same for all pages) ───────────────────────────────
const WHY_CHOOSE_US = [
  { icon: ShieldCheck, title: "Licensed Company",       desc: "Fully licensed LLC in Dubai with trade license #1571076." },
  { icon: Zap,         title: "Certified Technicians",  desc: "Trained and certified technicians with years of Dubai field experience." },
  { icon: Tag,         title: "Premium Equipment",      desc: "Professional-grade tools and equipment for the best results." },
  { icon: Check,       title: "Transparent Pricing",    desc: "No hidden charges. You pay exactly what was quoted upfront." },
  { icon: Clock,       title: "Same-Day Service",       desc: "Available 7 days a week with same-day appointments in Dubai." },
  { icon: ShieldCheck, title: "Satisfaction Guaranteed",desc: "We're not done until you're completely satisfied with the results." }
];

// ── Main Template ─────────────────────────────────────────────────────────────
/**
 * ServiceLandingTemplate
 *
 * Props:
 *  seo             – { title, description, keywords, canonicalUrl, ogImage }
 *  heroImage       – imported WebP asset (string URL)
 *  h1Plain         – plain text part of h1
 *  h1Gradient      – gradient (gold) text part of h1
 *  heroTag         – badge text, e.g. "Available Today Across Dubai"
 *  heroSubtitle    – bold subtitle below h1
 *  heroDesc        – paragraph description below subtitle
 *  heroBadges      – array of 4 short strings for checkmark grid
 *  floatingCards   – array of {icon, label, value, colorClass} for hero image overlays
 *  warningSigns    – array of {icon: LucideComponent, title, desc}
 *  warningTitle    – section heading
 *  warningSubtitle – section subheading
 *  beforeAfter     – { before: string[], after: string[], title?, subtitle? }
 *  includedServices– array of {icon: LucideComponent, title, desc}
 *  includedTitle   – section heading
 *  includedSubtitle– section subheading
 *  processSteps    – array of {num, title, desc}
 *  processTitle    – section heading
 *  processSubtitle – section subheading
 *  stats           – array of [value, label] pairs (max 4)
 *  reviews         – array of {name, area, review}
 *  faqs            – array of {q, a}
 *  faqTitle        – FAQ section heading
 *  faqSubtitle     – FAQ section subheading
 *  serviceSlug     – URL slug, e.g. "plumbing"
 *  serviceName     – display name, e.g. "Plumbing"
 *  ctaHeading      – final CTA heading
 *  ctaSubtitle     – final CTA subheading
 *  formUnitLabel   – label for the 4th form field (default "Number of Units")
 *  formUnitOptions – options for 4th field select (default unit counts)
 *  internalLinks   – array of {to, emoji, label} for internal linking section
 */
const ServiceLandingTemplate = ({
  seo,
  heroImage,
  h1Plain,
  h1Gradient,
  heroTag = "Available Today Across Dubai",
  heroSubtitle,
  heroDesc,
  heroBadges = ["Same-Day Service", "Licensed LLC", "Fully Insured", "All Dubai Areas"],
  floatingCards = [],
  warningSigns = [],
  warningTitle,
  warningSubtitle,
  beforeAfter = { before: [], after: [] },
  includedServices = [],
  includedTitle,
  includedSubtitle,
  processSteps = [],
  processTitle,
  processSubtitle,
  stats = [["2,000+", "Jobs Completed"], ["4.9★", "Customer Rating"], ["<1 Hr", "Response Time"], ["100%", "Satisfaction Goal"]],
  reviews = [],
  faqs = [],
  faqTitle,
  faqSubtitle,
  serviceSlug,
  serviceName,
  ctaHeading,
  ctaSubtitle,
  formUnitLabel = "Number of Units",
  formUnitOptions = [
    { value: "1", label: "1 Unit" },
    { value: "2", label: "2 Units" },
    { value: "3", label: "3 Units" },
    { value: "4", label: "4 Units" },
    { value: "5+", label: "5+ Units" },
  ],
  internalLinks = [],
}) => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", location: "", detail: "" });
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

  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const id = hash.replace("#", "");
          const element = document.getElementById(id);
          if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 400);
      }
    };
    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);

  const handleWhatsAppRedirect = (data) => {
    const message = `Hello Afnan Property Care, I'd like to request a callback for ${serviceName}.%0A%0AName: ${encodeURIComponent(data.name)}%0APhone: ${encodeURIComponent(data.phone)}%0ALocation: ${encodeURIComponent(data.location)}%0ADetails: ${encodeURIComponent(data.detail)}`;
    trackWhatsAppClick(`${serviceName} Landing Page Form`, serviceName);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  const handleWhatsAppGeneral = () => {
    const msg = encodeURIComponent(`Hi! I'm interested in your ${serviceName} services. Can you please provide more details and availability?`);
    trackWhatsAppClick(`${serviceName} Landing Page Float`, serviceName);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.location || !form.detail) {
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
          service: serviceSlug,
          message: `Request from ${serviceName} landing page. Location: ${form.location}, Detail: ${form.detail}`
        })
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || "Failed to submit request");
      trackLead({ name: form.name, email: `${form.name}@placeholder.com`, service: serviceSlug });
      toast({ title: "Request Submitted!", description: "We have saved your lead and will redirect you to WhatsApp." });
      handleWhatsAppRedirect(form);
      setForm({ name: "", phone: "", location: "", detail: "" });
    } catch (err) {
      console.error(err);
      toast({ title: "Connecting you...", description: "Opening WhatsApp for immediate scheduling.", variant: "default" });
      handleWhatsAppRedirect(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden antialiased">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonicalUrl={seo.canonicalUrl}
        robots="index, follow, max-image-preview:large"
        themeColor="#0F6CBD"
        ogTitle={`${seo.title} | Afnan Property Care`}
        ogDescription={seo.description}
        ogImage={seo.ogImage}
        twitterTitle={`${seo.title} | Afnan Property Care`}
        twitterDescription={seo.description}
        twitterImage={seo.ogImage}
      />

      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-28 lg:pt-36 pb-20 overflow-hidden bg-navy text-primary-foreground">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0,transparent_60%)]" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-gold/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: text */}
            <div className="space-y-6 hero-fade-in" style={{ animationDelay: "0ms" }}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                  {heroTag}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold">
                  Trade License #1571076
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-['Montserrat'] tracking-tight leading-tight">
                {h1Plain} <br />
                <span className="text-gradient-gold">{h1Gradient}</span>
              </h1>

              <p className="text-lg sm:text-xl font-bold text-white/90 leading-snug">{heroSubtitle}</p>
              <p className="text-sm sm:text-base text-primary-foreground/75 leading-relaxed max-w-xl">{heroDesc}</p>

              <div className="grid grid-cols-2 gap-3 max-w-xl">
                {heroBadges.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-gold" />
                    </div>
                    <span className="text-sm font-semibold text-white/90">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
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
                <div className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-gold" /><span className="text-white/60">2,000+ Jobs Done</span></div>
                <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gold" /><span className="text-white/60">&lt;1 Hour Response</span></div>
              </div>
            </div>

            {/* Right: hero image */}
            <div className="hero-fade-in relative aspect-[4/5] max-w-md mx-auto lg:max-w-none w-full rounded-3xl overflow-hidden border border-gold/10 shadow-gold/20 shadow-2xl" style={{ animationDelay: "150ms" }}>
              <img
                src={heroImage}
                alt={`Afnan Professional ${serviceName} service in Dubai`}
                className="w-full h-full object-cover"
                fetchpriority="high"
                loading="eager"
                decoding="async"
                width="600"
                height="750"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />

              {/* Floating cards */}
              {floatingCards.map((card, i) => {
                const CardIcon = card.icon;
                const positions = [
                  "absolute top-6 left-6",
                  "absolute top-1/2 right-6 -translate-y-1/2",
                  "absolute bottom-6 left-6",
                ];
                const durations = ["3s", "4s", "5s"];
                const delays = ["0s", "1s", "2s"];
                return (
                  <div
                    key={i}
                    className={`${positions[i] || "absolute top-6 left-6"} p-4 rounded-2xl bg-white/95 border border-gold/25 shadow-lg flex items-center gap-3 backdrop-blur-md animate-bounce`}
                    style={{ animationDuration: durations[i] || "3s", animationDelay: delays[i] || "0s" }}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.colorClass || "bg-gold/15 text-gold"}`}>
                      <CardIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none font-semibold">{card.label}</p>
                      <p className={`font-extrabold text-base mt-1 ${card.valueClass || "text-gold"}`}>{card.value}</p>
                    </div>
                  </div>
                );
              })}
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

      {/* ── WARNING SIGNS ── */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">{warningTitle}</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{warningSubtitle}</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {warningSigns.map((sign, idx) => {
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
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">
              {beforeAfter.title || "Before vs After Our Service"}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {beforeAfter.subtitle || `See the transformation our professional ${serviceName} service delivers.`}
            </p>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn className="p-6 sm:p-8 rounded-2xl border border-red-500/20 bg-red-500/[0.02] space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 font-extrabold shrink-0">✕</div>
                <h3 className="text-lg font-extrabold text-red-500 font-['Montserrat']">Before Service</h3>
              </div>
              <ul className="space-y-3.5">
                {beforeAfter.before.map((item) => (
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
                <h3 className="text-lg font-extrabold text-green-500 font-['Montserrat']">After Our Service</h3>
              </div>
              <ul className="space-y-3.5">
                {beforeAfter.after.map((item) => (
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
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">{includedTitle}</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{includedSubtitle}</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {includedServices.map((item, idx) => {
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

      {/* ── STEP-BY-STEP PROCESS ── */}
      <section className="py-20 lg:py-24 bg-gold-light/10 border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">{processTitle}</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{processSubtitle}</p>
          </FadeIn>
          <div className={`grid sm:grid-cols-2 ${processSteps.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"} gap-4 max-w-6xl mx-auto`}>
            {processSteps.map((step, idx) => (
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
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">Why Choose Afnan Property Care for {serviceName} in Dubai</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">Trusted by homeowners, villa residents, and property managers across Dubai.</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE_US.map((item, idx) => {
              const WIcon = item.icon;
              return (
                <FadeIn key={item.title + idx} delay={idx * 80} className="flex gap-4 p-5 rounded-2xl bg-card border border-border hover:border-gold/30 hover:bg-gold-light/5 transition-all duration-300">
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
            {stats.map(([val, lbl]) => (
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
            {reviews.map((rev, idx) => (
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
                  <label className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2">{formUnitLabel} *</label>
                  <select required value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-200">
                    <option value="">Select option</option>
                    {formUnitOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Montserrat'] text-white tracking-tight leading-tight max-w-xl mx-auto">{ctaHeading}</h2>
          <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto">{ctaSubtitle}</p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a href={`tel:+${CALL_NUMBER}`}
              onClick={() => trackPhoneClick(`${serviceName} - CTA Section`, serviceName)}
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

      {/* ── INTERNAL LINKING HUB ── */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6 text-center">
            <h3 className="text-xl font-bold font-['Montserrat'] text-foreground">Explore Our Full Range of Dubai Home Maintenance Services</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              As a top-rated <Link to="/" className="text-gold font-bold underline hover:text-gold/80 transition-colors">licensed Dubai home maintenance company</Link>, we provide complete property upkeep solutions. You can also <Link to="/contact" className="text-gold font-bold underline hover:text-gold/80 transition-colors">schedule a custom maintenance consultation</Link> with our engineering team today.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {internalLinks.map((link) => (
                <Link key={link.to} to={link.to} className="px-4 py-2 rounded-xl bg-gold-light/20 border border-gold/20 text-xs font-semibold text-foreground hover:bg-gold/10 transition-colors">
                  {link.emoji} <span className="underline">{link.label}</span>
                </Link>
              ))}
              <Link to="/services" className="px-4 py-2 rounded-xl bg-gold-light/20 border border-gold/20 text-xs font-semibold text-foreground hover:bg-gold/10 transition-colors">
                🛠️ <span className="underline">explore full property maintenance services</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOCAL SEO & MAPS ── */}
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
                <span className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 text-xs font-bold">✓ Verified Local Business</span>
                <span className="px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/30 text-gold text-xs font-bold">Last Updated: August 2026</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border shadow-lg h-72">
              <iframe
                title="Afnan Property Care Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.2341234!2d55.31!3d25.26!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5cd!2sRolex%20Twin%20Towers!5e0!3m2!1sen!2sae"
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
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">{faqTitle}</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{faqSubtitle}</p>
          </FadeIn>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((item, idx) => <FAQItem key={idx} q={item.q} a={item.a} />)}
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
          onClick={() => trackPhoneClick(`${serviceName} - Mobile Sticky Bar`, serviceName)}
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

export default ServiceLandingTemplate;
