import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Snowflake, Award, Phone, Check, MessageCircle, Building2, Clock, Tag, Zap,
  MapPin, AlertTriangle, ArrowLeftRight, Quote, Send, PhoneCall, ArrowRight,
  Menu, X, ShieldCheck, Thermometer, Wind, Droplets, Receipt, Cloud, Volume2,
  Package, Fan, Filter, GitBranch, Wrench, HeartHandshake, TrendingUp, Star,
  ChevronDown, Home
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { trackWhatsAppClick, trackLead } from "@/lib/analytics";
import serviceAcCleaning from "@/assets/real_ac_cleaning.png";

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
  before: [
    "Weak airflow from vents",
    "Higher DEWA bills every month",
    "Dust and allergens in the air",
    "Unpleasant odor from AC"
  ],
  after: [
    "Strong, consistent cooling",
    "Better indoor air quality",
    "Lower energy usage & bills",
    "Fresh, clean air throughout"
  ]
};

const INCLUDED_SERVICES = [
  {
    icon: Home,
    title: "Indoor Unit Deep Cleaning",
    desc: "Complete dismantling and deep cleaning of all indoor unit components including coils and blower wheel."
  },
  {
    icon: Fan,
    title: "Outdoor Unit Cleaning",
    desc: "Thorough cleaning of the condenser unit to remove dirt and debris, improving heat exchange efficiency."
  },
  {
    icon: Filter,
    title: "Filter Sanitization",
    desc: "Anti-bacterial treatment and sanitization of filters to eliminate mold, bacteria and allergens."
  },
  {
    icon: GitBranch,
    title: "Drain Line Inspection",
    desc: "Complete inspection and clearing of condensate drain lines to prevent water leakage and damage."
  }
];

const WHY_CHOOSE_US = [
  { icon: ShieldCheck, title: "Licensed Company", desc: "Fully licensed LLC in Dubai with trade license #1571076." },
  { icon: Award, title: "Certified Technicians", desc: "Trained and certified AC technicians with years of field experience." },
  { icon: Wrench, title: "Premium Equipment", desc: "Professional-grade tools and cleaning equipment for the best results." },
  { icon: Tag, title: "Transparent Pricing", desc: "No hidden charges. You pay exactly what was quoted upfront." },
  { icon: Zap, title: "Same-Day Service", desc: "Available 7 days a week with same-day appointments in Dubai." },
  { icon: HeartHandshake, title: "Satisfaction Guaranteed", desc: "We're not done until you're completely satisfied with the results." }
];

const FAQ_ITEMS = [
  {
    q: "How often should I service my AC in Dubai?",
    a: "At minimum twice a year — before summer (April) and at the start of winter (October). Dubai's dusty climate clogs filters fast, reducing efficiency and air quality."
  },
  {
    q: "What AC brands do you service?",
    a: "We service all major brands including Daikin, Mitsubishi, LG, Samsung, Carrier, Hitachi, Gree, and more. Our technicians carry parts for the most common models."
  },
  {
    q: "Do you offer annual maintenance contracts?",
    a: "Yes. Our AMC packages cover unlimited visits, priority scheduling, and discounted parts for a fixed annual fee — great value for villas and apartments."
  },
  {
    q: "Can you install a new AC unit?",
    a: "Absolutely. We supply and install split units, cassette ACs, and central systems with full DEWA-compliant wiring and drainage."
  }
];

const REVIEWS = [
  {
    name: "Ahmed Al Mansoori",
    area: "Dubai Marina",
    review: "Excellent AC cleaning service. The technician was punctual, professional and did a thorough job. My AC cools much better now and the air feels noticeably cleaner."
  },
  {
    name: "Sarah Williams",
    area: "Palm Jumeirah",
    review: "Very professional technicians. They explained everything clearly and the pricing was transparent. Highly recommended for AC cleaning in Dubai."
  },
  {
    name: "Rajesh Kumar",
    area: "JVC",
    review: "Cooling improved immediately after the cleaning. The team was on time and cleaned up everything before leaving. Will definitely use them again."
  }
];

// Helper component for count-up stats on scroll
const StatCounter = ({ value, label }) => {
  return (
    <div className="flex flex-col items-center p-5 rounded-2xl bg-slate-900/40 border border-gold/10 text-center">
      <span className="text-gold font-extrabold text-2xl lg:text-4xl leading-none mb-1 text-gradient-gold">
        {value}
      </span>
      <span className="text-slate-300 text-xs uppercase tracking-wider">{label}</span>
    </div>
  );
};

const FAQItem = ({ q, a, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-card hover:bg-gold-light/20 transition-colors"
      >
        <span className="font-semibold text-foreground text-sm sm:text-base leading-snug">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="shrink-0">
          <ChevronDown className="w-4 h-4 text-gold" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 py-4 text-sm text-muted-foreground leading-relaxed border-t border-border bg-card/50">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ACCleaningLanding = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", location: "", units: "" });
  const [loading, setLoading] = useState(false);
  const [hideSticky, setHideSticky] = useState(true);
  const heroButtonsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideSticky(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" }
    );

    if (heroButtonsRef.current) {
      observer.observe(heroButtonsRef.current);
    }

    return () => {
      if (heroButtonsRef.current) {
        observer.unobserve(heroButtonsRef.current);
      }
    };
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
      const apiEndpoint = import.meta.env.PROD
        ? "/api/contact"
        : "http://localhost:5000/api/contact";

      // Post lead to the database
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: `${form.name.replace(/\s+/g, "").toLowerCase()}@afnanpropertycare.com`, // placeholder
          phone: form.phone,
          service: "ac-cleaning",
          message: `Request from dedicated landing page. Location: ${form.location}, Units: ${form.units}`
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to submit request");
      }

      trackLead({ name: form.name, email: `${form.name}@placeholder.com`, service: "ac-cleaning" });
      toast({ title: "Request Submitted!", description: "We have saved your lead and will redirect you to WhatsApp." });
      
      // Redirect to WhatsApp
      handleWhatsAppRedirect(form);
      setForm({ name: "", phone: "", location: "", units: "" });
    } catch (err) {
      console.error(err);
      // Fallback: still redirect to WhatsApp even if DB post fails
      toast({ title: "Connecting you...", description: "Opening WhatsApp for immediate scheduling.", variant: "default" });
      handleWhatsAppRedirect(form);
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
    })
  };

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden antialiased">
      <SEO
        title="AC Cleaning Services Dubai | Premium Deep Clean | Afnan Property Care"
        description="Professional AC Cleaning Services in Dubai for Villas, Apartments & Offices. Starting from AED 199. Deep cleaning, sanitization, leak checks, 24/7 service."
        canonicalUrl="/services/ac-cleaning"
      />

      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-28 lg:pt-36 pb-20 overflow-hidden bg-navy text-primary-foreground">
        {/* Subtle radial ambient atmosphere to fit the branding */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0,transparent_60%)]" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-gold/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Hero Content */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                Available Today Across Dubai
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-['Montserrat'] tracking-tight leading-tight">
                AC Cleaning <br />
                <span className="text-gradient-gold">Dubai</span>
              </h1>

              <p className="text-lg sm:text-xl font-bold text-white/90 leading-snug">
                Professional AC Cleaning Services For Villas, Apartments & Offices
              </p>
              <p className="text-sm sm:text-base text-primary-foreground/75 leading-relaxed max-w-xl">
                Improve cooling performance, remove dust and odors, and reduce electricity consumption with certified AC technicians.
              </p>

              {/* 2x2 grid checklist */}
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

              {/* Buttons */}
              <div ref={heroButtonsRef} className="flex flex-row gap-3 pt-4 w-full">
                <a
                  href="#quote"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3.5 rounded-xl bg-accent text-accent-foreground font-bold hover:brightness-110 active:scale-95 transition-all shadow-gold text-xs sm:text-sm sm:px-7 sm:py-4 sm:gap-2 shrink-0"
                >
                  <Send className="w-4.5 h-4.5 shrink-0" />
                  <span className="whitespace-nowrap">Get Free Quote</span>
                </a>
                <button
                  onClick={handleWhatsAppGeneral}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3.5 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#1ebe5d] active:scale-95 transition-all shadow-lg text-xs sm:text-sm sm:px-7 sm:py-4 sm:gap-2 shrink-0"
                >
                  <MessageCircle className="w-4.5 h-4.5 shrink-0" />
                  <span className="whitespace-nowrap">WhatsApp Now</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-white/10 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="text-gold font-bold">★★★★★</div>
                  <span className="text-white/60">4.9 Rating</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4.5 h-4.5 text-gold" />
                  <span className="text-white/60">2,000+ Units Serviced</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4.5 h-4.5 text-gold" />
                  <span className="text-white/60">&lt;1 Hour Response</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Hero Image with Floating Cards */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-none w-full rounded-3xl overflow-hidden border border-gold/10 shadow-gold/20 shadow-2xl"
            >
              <img
                src={serviceAcCleaning}
                alt="Afnan Professional AC cleaning service"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />

              {/* Floating Cards (using local HSL vars & animations) */}
              <div className="absolute top-6 left-6 p-4 rounded-2xl bg-white/95 border border-gold/25 shadow-lg flex items-center gap-3 backdrop-blur-md animate-bounce" style={{ animationDuration: "3s" }}>
                <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-gold">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none font-semibold">Starting Price</p>
                  <p className="font-extrabold text-base text-gold mt-1">AED 150</p>
                </div>
              </div>

              <div className="absolute top-1/2 right-6 -translate-y-1/2 p-4 rounded-2xl bg-white/95 border border-gold/25 shadow-lg flex items-center gap-3 backdrop-blur-md animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}>
                <div className="w-10 h-10 rounded-xl bg-[#22c55e]/15 flex items-center justify-center text-[#22c55e]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none font-semibold">Same-Day</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">Appointments</p>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 p-4 rounded-2xl bg-white/95 border border-gold/25 shadow-lg flex items-center gap-3 backdrop-blur-md animate-bounce" style={{ animationDuration: "5s", animationDelay: "2s" }}>
                <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-gold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none font-semibold">Free Inspection</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">No Obligation</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section className="bg-gold-light border-y border-gold/10 py-6 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-center text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-4">
            Trusted By Homeowners Across Dubai
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {DUBAI_AREAS.slice(0, 8).map((area) => (
              <motion.div
                key={area}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background border border-gold/15 shadow-sm text-xs sm:text-sm font-semibold text-navy hover:border-gold/40 hover:shadow-md transition-all duration-300 shrink-0"
              >
                <div className="w-6 h-6 rounded-lg bg-gold/10 flex items-center justify-center text-gold shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                {area}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM / WARNING SIGNS SECTION */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest">
              <AlertTriangle className="w-3.5 h-3.5" />
              Warning Signs
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">
              Is Your AC Showing These Signs?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              If you're experiencing any of these issues, it's time to call in the professionals for a deep AC clean.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WARNING_SIGNS.map((sign, idx) => {
              const SIcon = sign.icon;
              return (
                <motion.div
                  key={sign.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={idx}
                  className="flex gap-5 p-6 rounded-2xl bg-card border border-border shadow-sm hover:border-gold/30 hover:-translate-y-1.5 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/10 group-hover:bg-gold/15 flex items-center justify-center shrink-0 text-gold transition-colors">
                    <SIcon className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm sm:text-base mb-1.5">{sign.title}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{sign.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER SECTION */}
      <section className="py-20 bg-gold-light/20 border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              The Difference
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">
              Before vs After Cleaning
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              See the transformation our professional AC cleaning service delivers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Before Card */}
            <div className="p-6 sm:p-8 rounded-2xl border border-red-500/20 bg-red-500/[0.02] relative space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 font-extrabold shrink-0">
                  ✕
                </div>
                <h3 className="text-lg font-extrabold text-red-500 font-['Montserrat']">Before Cleaning</h3>
              </div>
              <ul className="space-y-3.5">
                {BEFORE_AFTER.before.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground/80 leading-snug">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5 text-[10px] text-red-500 font-bold">
                      ✕
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* After Card */}
            <div className="p-6 sm:p-8 rounded-2xl border border-green-500/20 bg-green-500/[0.02] relative space-y-5 shadow-premium">
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gold text-white font-extrabold text-[9px] tracking-widest uppercase shadow-md">
                Recommended
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 font-extrabold shrink-0">
                  ✓
                </div>
                <h3 className="text-lg font-extrabold text-green-500 font-['Montserrat']">After Cleaning</h3>
              </div>
              <ul className="space-y-3.5">
                {BEFORE_AFTER.after.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground/90 font-medium leading-snug">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5 text-[10px] text-green-500 font-bold">
                      ✓
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED SECTION */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest">
              <Package className="w-3.5 h-3.5" />
              Complete Service
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">
              What's Included
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Our comprehensive AC cleaning service covers every component of your cooling system.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INCLUDED_SERVICES.map((item, idx) => {
              const IncIcon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={idx}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-gold/20 transition-all duration-300 flex flex-col space-y-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gold-light flex items-center justify-center text-gold shrink-0">
                    <IncIcon className="w-6.5 h-6.5" />
                  </div>
                  <h3 className="font-bold text-foreground text-sm sm:text-base">{item.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-20 lg:py-24 bg-gold-light/10 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest">
              <Award className="w-3.5 h-3.5" />
              Why Us
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">
              Why Choose Afnan
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Six reasons Dubai homeowners trust us with their AC cleaning needs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE_US.map((item, idx) => {
              const WIcon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={idx}
                  className="flex gap-4 p-5 rounded-2xl bg-card border border-border hover:border-gold/30 hover:bg-gold-light/5 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-navy flex items-center justify-center shrink-0 text-gold shadow-md">
                    <WIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm sm:text-base mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATS TRACK RECORD SECTION */}
      <section className="py-20 lg:py-24 bg-navy text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.2)_0,transparent_60%)]" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center space-y-12">
          
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest">
              <TrendingUp className="w-3.5 h-3.5" />
              By The Numbers
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-white">
              Our Track Record
            </h2>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              Numbers that speak to our commitment and quality of service.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <StatCounter value="2,000+" label="Units Serviced" />
            <StatCounter value="4.9★" label="Customer Rating" />
            <StatCounter value="<1 Hr" label="Response Time" />
            <StatCounter value="100%" label="Satisfaction Goal" />
          </div>

        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest">
              <Quote className="w-3.5 h-3.5" />
              Testimonials
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">
              Customer Reviews
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Real feedback from real customers across Dubai.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((rev, idx) => (
              <motion.div
                key={rev.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={idx}
                className="p-6 sm:p-8 rounded-2xl bg-card border border-border relative flex flex-col justify-between shadow-sm hover:border-gold/20 transition-all duration-300"
              >
                <div>
                  <div className="text-gold font-bold text-sm mb-4">★★★★★</div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                    "{rev.review}"
                  </p>
                </div>
                <div className="flex items-center gap-3.5 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-navy text-gold flex items-center justify-center font-bold font-['Montserrat'] shrink-0 shadow-md">
                    {rev.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{rev.name}</h4>
                    <p className="text-muted-foreground text-[11px] font-medium">{rev.area}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE FORM SECTION */}
      <section id="quote" className="py-20 lg:py-24 bg-gold-light/20 border-t border-border relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
            
            <div className="p-6 sm:p-10 border-b border-border bg-navy text-primary-foreground relative overflow-hidden text-center space-y-2">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.2)_0,transparent_60%)]" />
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest relative z-10">
                <Send className="w-3 h-3" />
                Free Quote
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Montserrat'] text-white relative z-10">
                Get Your Free Quote
              </h2>
              <p className="text-white/70 text-xs sm:text-sm max-w-sm mx-auto relative z-10 leading-snug">
                Fill in your details and our team will call you back within 30 minutes.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-200"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-200"
                    placeholder="+971 5X XXX XXXX"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2">Location *</label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-200"
                    placeholder="e.g. Dubai Marina"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2">Number of Units *</label>
                  <select
                    required
                    value={form.units}
                    onChange={(e) => setForm({ ...form, units: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-200"
                  >
                    <option value="">Select units</option>
                    <option value="1">1 Unit</option>
                    <option value="2">2 Units</option>
                    <option value="3">3 Units</option>
                    <option value="4">4 Units</option>
                    <option value="5+">5+ Units</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-accent text-accent-foreground font-extrabold text-sm sm:text-base hover:brightness-110 active:scale-95 transition-all shadow-gold disabled:opacity-50 mt-2"
              >
                <PhoneCall className="w-4.5 h-4.5" />
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

      {/* FINAL CTA SECTION */}
      <section className="py-20 lg:py-24 bg-navy text-primary-foreground relative overflow-hidden border-t border-gold/15">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.25)_0,transparent_60%)]" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            Available Now
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Montserrat'] text-white tracking-tight leading-tight max-w-xl mx-auto">
            Need AC Cleaning Today?
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto">
            Call now and get a technician dispatched anywhere in Dubai.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href={`tel:+${CALL_NUMBER}`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-navy font-bold hover:bg-gold-light active:scale-95 transition-all shadow-lg text-sm sm:text-base border border-gold/10"
            >
              <Phone className="w-4.5 h-4.5 text-gold shrink-0" />
              Call Now
            </a>
            <button
              onClick={handleWhatsAppGeneral}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#1ebe5d] active:scale-95 transition-all shadow-lg text-sm sm:text-base"
            >
              <MessageCircle className="w-4.5 h-4.5 shrink-0" />
              WhatsApp
            </button>
          </div>

        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest">
              <ChevronDown className="w-3.5 h-3.5" />
              Common Questions
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Montserrat'] text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Find answers to common questions about our AC cleaning services.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <FAQItem key={idx} q={item.q} a={item.a} index={idx} />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* MOBILE STICKY CTA BAR (Call + WhatsApp) */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 border-t border-border/80 backdrop-blur-md px-4 py-3 flex gap-3 shadow-2xl transition-all duration-500 ease-in-out ${
        hideSticky ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      }`}>
        <a
          href={`tel:+${CALL_NUMBER}`}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-accent text-accent-foreground font-bold text-xs active:scale-95 transition-all border border-gold/10"
        >
          <Phone className="w-3.5 h-3.5" />
          Call
        </a>
        <button
          onClick={handleWhatsAppGeneral}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#25D366] text-white font-bold text-xs active:scale-95 transition-all shadow-md"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ACCleaningLanding;
