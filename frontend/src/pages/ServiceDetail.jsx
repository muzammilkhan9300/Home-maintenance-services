import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, CheckCircle, Phone, ArrowLeft, ChevronDown,
  Snowflake, Droplets, Zap, TreePine, Paintbrush, Star, Leaf,
  Wrench, Fan, Sparkles, Droplet, LayoutGrid, Home, Server, BrickWall, Clock, Shield, MapPin,
  AlertTriangle, ArrowLeftRight, Quote,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import SEO from "@/components/SEO";
import { services } from "@/data/services";
import { trackWhatsAppClick } from "@/lib/analytics";

const WHATSAPP_NUMBER = "971505387736";
const CALL_NUMBER = "971505387736";

const iconMap = {
  Snowflake, Droplets, Zap, TreePine, Paintbrush, Star, Leaf,
  Wrench, Fan, Sparkles, Droplet, LayoutGrid, Home, Server, BrickWall, Clock, Shield, CheckCircle,
};

const DUBAI_AREAS = [
  "Dubai Marina", "JVC", "Palm Jumeirah", "Downtown",
  "Business Bay", "Jumeirah", "DIFC", "Al Barsha",
  "Mirdif", "Deira", "Bur Dubai", "JLT",
];

const TESTIMONIALS = [
  {
    name: "Ahmed Al Rashid",
    area: "Dubai Marina",
    rating: 5,
    review: "Excellent service! The team arrived on time, were very professional and resolved everything quickly. Highly recommend Afnan Property Care.",
  },
  {
    name: "Sarah Johnson",
    area: "JVC",
    rating: 5,
    review: "Outstanding work. Very clean, respectful of our home, and the quality was exceptional. Will definitely use them again.",
  },
  {
    name: "Mohammed Al Zaabi",
    area: "Palm Jumeirah",
    rating: 5,
    review: "Best maintenance company in Dubai! Fast response, fair pricing, and the technicians really know their stuff. Five stars.",
  },
];

const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

// ── FAQ Item ─────────────────────────────────────────────────────────────────
const FAQItem = ({ q, a, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="border border-border rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-card hover:bg-accent/5 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-foreground text-sm leading-snug">{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-accent" />
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
    </motion.div>
  );
};

// ── Desktop Booking Card ──────────────────────────────────────────────────────
const DesktopBookingCard = ({ service, Icon, handleWhatsApp }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.35, duration: 0.5 }}
    className="rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl"
    style={{ background: "linear-gradient(135deg, rgba(30,27,20,0.95) 0%, rgba(15,12,8,0.98) 100%)" }}
  >
    <div className="px-6 py-5 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/15 to-transparent">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
          <Icon className="w-4 h-4 text-slate-900" />
        </div>
        <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">Book This Service</span>
      </div>
      <p className="text-white/50 text-xs mt-2">Get a free quote in under 30 minutes. Available 24/7.</p>
    </div>
    <div className="p-6 space-y-3">
      <Link
        to={`/contact?service=${service.id}`}
        id={`book-service-${service.id}`}
        className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-slate-900 text-sm hover:brightness-110 active:scale-95 transition-all"
        style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
      >
        <Phone className="w-4 h-4" />
        Get a Free Quote
      </Link>
      <button
        onClick={handleWhatsApp}
        id={`whatsapp-service-${service.id}`}
        className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#1ebe5d] active:scale-95 transition-all text-sm"
      >
        <WhatsAppIcon />
        Chat on WhatsApp
      </button>
      <div className="pt-3 border-t border-white/10 space-y-2.5">
        {[
          { emoji: "✅", text: "Trade License No. 1571076" },
          { emoji: "⏰", text: "24/7 Emergency Availability" },
          { emoji: "📍", text: "All areas of Dubai covered" },
          { emoji: "🛡️", text: "Fully insured & DEWA certified" },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-2 text-xs text-white/50">
            <span>{item.emoji}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

// ── Section Badge ─────────────────────────────────────────────────────────────
const SectionBadge = ({ icon: BadgeIcon, label, color = "amber" }) => {
  const colorMap = {
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    red:   "bg-red-500/10 border-red-500/20 text-red-400",
    green: "bg-green-500/10 border-green-500/20 text-green-400",
    blue:  "bg-blue-500/10 border-blue-500/20 text-blue-400",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold tracking-widest uppercase mb-3 ${colorMap[color]}`}>
      <BadgeIcon className="w-3 h-3" />
      {label}
    </span>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const service = services.find((s) => s.id === id);
  const otherServices = services.filter((s) => s.id !== id).slice(0, 6);
  const Icon = service ? (iconMap[service.icon] || Wrench) : Wrench;

  const handleWhatsApp = () => {
    if (!service) return;
    const msg = encodeURIComponent(
      `Hi! I'm interested in your *${service.title}* service. Can you please provide more details and availability?`
    );
    trackWhatsAppClick("Service Detail Page", service.title);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const handleCall = () => {
    window.location.href = `tel:+${CALL_NUMBER}`;
  };

  // ── Not Found ───────────────────────────────────────────────────────────────
  if (!service) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-28 pb-20">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
            <Wrench className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-3xl font-bold font-['Montserrat'] text-foreground mb-3">Service Not Found</h1>
          <p className="text-muted-foreground max-w-sm mb-8">
            The service you're looking for doesn't exist. Browse all our available services below.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-accent text-accent-foreground font-semibold hover:brightness-110 transition-all shadow-gold text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> View All Services
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${service.title} in Dubai | Afnan Property Care`}
        description={`${service.description} Book professional ${service.title.toLowerCase()} in Dubai with Afnan Property Care. Licensed, certified, 24/7 availability.`}
        canonicalUrl={`/services/${service.id}`}
      />

      <Navbar />

      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE HERO — text-first, conversion-focused
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="lg:hidden pt-20 pb-6 px-4" style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e1b12 60%, #0c0a06 100%)" }}>
        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 mb-5"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-400 text-xs font-semibold">Available Today Across Dubai</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-3xl font-extrabold text-white font-['Montserrat'] leading-tight mb-3"
        >
          {service.title}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-white/60 text-sm leading-relaxed mb-5"
        >
          {service.description}
        </motion.p>

        {/* 2×2 Trust checkmarks */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-6"
        >
          {["Same-Day Service", "Licensed LLC", "Fully Insured", "All Dubai Areas"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-white/80 text-sm font-medium">{item}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
          className="flex gap-3 mb-6"
        >
          <Link
            to={`/contact?service=${service.id}`}
            id={`book-mob-${service.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-bold text-slate-900 text-sm active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
          >
            <Phone className="w-4 h-4" />
            Get Free Quote
          </Link>
          <button
            onClick={handleWhatsApp}
            id={`wa-mob-${service.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-[#25D366] text-white font-bold hover:bg-[#1ebe5d] active:scale-95 transition-all text-sm"
          >
            <WhatsAppIcon />
            WhatsApp Now
          </button>
        </motion.div>

        {/* Stats row */}
        {service.stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="flex flex-wrap gap-x-5 gap-y-2"
          >
            {service.stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5">
                <span className="text-amber-400 font-extrabold text-sm">{stat.value}</span>
                <span className="text-white/40 text-xs">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          DESKTOP HERO — parallax bg image with overlay
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="hidden lg:flex relative min-h-[60vh] items-end overflow-hidden"
        style={{
          backgroundImage: `url(${service.image})`,
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-slate-900/20" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="container mx-auto px-8 relative z-10 pt-28 pb-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <span>/</span>
            <span className="text-white/80 line-clamp-1">{service.title}</span>
          </nav>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Icon className="w-5 h-5 text-slate-900" />
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold tracking-wider uppercase border border-amber-500/30">
                Professional Service — Dubai, UAE
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white font-['Montserrat'] leading-tight mb-8">
              {service.title}
            </h1>
            {service.stats && (
              <div className="flex flex-wrap gap-3">
                {[...service.stats, { label: "Trade License", value: "✓ LLC" }].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <span className="text-amber-400 font-extrabold text-lg leading-none">{stat.value}</span>
                    <span className="text-white/60 text-[10px] uppercase tracking-wider mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE SERVICE IMAGE — full-width, rounded, with caption
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden px-4 mb-0 mt-0">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-56 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-white/60 text-[10px] uppercase tracking-wider">Certified Team</p>
              <p className="text-white font-bold text-sm">Fully Equipped & Insured</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE AREAS MARQUEE
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden py-4 border-y border-border overflow-hidden">
        <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest mb-3">
          Trusted by homeowners across
        </p>
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-1">
          {DUBAI_AREAS.map((area) => (
            <div key={area} className="flex items-center gap-1.5 shrink-0">
              <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="text-foreground text-xs font-medium whitespace-nowrap">{area}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          WARNING SIGNS SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      {service.warningSigns && (
        <section className="py-10 lg:py-14" style={{ background: "var(--card, #f9f9f9)" }}>
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeUp} custom={0} className="text-center mb-7">
                <SectionBadge icon={AlertTriangle} label="Warning Signs" color="red" />
                <h2 className="text-xl lg:text-3xl font-extrabold font-['Montserrat'] text-foreground">
                  Is Your Property Showing These Signs?
                </h2>
                <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
                  If you're experiencing any of these issues, it's time to call in the professionals.
                </p>
              </motion.div>

              <div className="flex flex-col gap-3 lg:grid lg:grid-cols-3 lg:gap-5">
                {service.warningSigns.map((sign, i) => {
                  const SIcon = iconMap[sign.icon] || AlertTriangle;
                  return (
                    <motion.div
                      key={sign.title}
                      variants={fadeUp}
                      custom={i}
                      className="flex gap-4 p-5 rounded-2xl bg-background border border-border"
                    >
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                        <SIcon className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-sm mb-1">{sign.title}</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">{sign.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          BEFORE vs AFTER SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      {service.beforeAfter && (
        <section className="py-10 lg:py-14 border-t border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeUp} custom={0} className="text-center mb-7">
                <SectionBadge icon={ArrowLeftRight} label="The Difference" color="blue" />
                <h2 className="text-xl lg:text-3xl font-extrabold font-['Montserrat'] text-foreground">
                  Before vs After Our Service
                </h2>
                <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
                  See the transformation our professional service delivers.
                </p>
              </motion.div>

              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {/* Before card */}
                <motion.div
                  variants={fadeUp}
                  custom={1}
                  className="p-5 rounded-2xl border border-red-500/20"
                  style={{ background: "rgba(239,68,68,0.05)" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center">
                      <span className="text-red-400 font-bold text-base">✕</span>
                    </div>
                    <h3 className="font-extrabold text-red-400 text-base">Before Our Service</h3>
                  </div>
                  <ul className="space-y-3">
                    {service.beforeAfter.before.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-red-500/15 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-red-400 text-[10px] font-bold">✕</span>
                        </div>
                        <span className="text-foreground text-sm leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* After card */}
                <motion.div
                  variants={fadeUp}
                  custom={2}
                  className="p-5 rounded-2xl border border-green-500/20"
                  style={{ background: "rgba(34,197,94,0.05)" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center">
                      <span className="text-green-400 font-bold text-base">✓</span>
                    </div>
                    <h3 className="font-extrabold text-green-400 text-base">After Our Service</h3>
                  </div>
                  <ul className="space-y-3">
                    {service.beforeAfter.after.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-green-400 text-[10px] font-bold">✓</span>
                        </div>
                        <span className="text-foreground text-sm leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          KEY BENEFITS
      ═══════════════════════════════════════════════════════════════════ */}
      {service.keyBenefits && (
        <section className="py-10 lg:py-12 border-t border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="lg:hidden text-center mb-5">
              <SectionBadge icon={Zap} label="Key Benefits" color="amber" />
              <h2 className="text-xl font-extrabold text-foreground font-['Montserrat']">Why Choose Us?</h2>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-5"
            >
              {service.keyBenefits.map((benefit, i) => {
                const BIcon = iconMap[benefit.icon] || CheckCircle;
                return (
                  <motion.div
                    key={benefit.title}
                    variants={fadeUp}
                    custom={i}
                    className="flex gap-4 p-5 rounded-2xl bg-card lg:bg-gradient-to-br lg:from-amber-500/10 lg:to-transparent border border-border lg:border-amber-500/20 hover:border-amber-500/30 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                      <BIcon className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground font-['Montserrat'] text-sm mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">{benefit.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN CONTENT — 2/3 + 1/3 (desktop) / single col (mobile)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-8 lg:py-14 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10 items-start">

            {/* ── LEFT / MAIN COLUMN ──────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-10 lg:space-y-12">

              {/* What's Included */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.div variants={fadeUp} custom={0} className="mb-5">
                  <SectionBadge icon={CheckCircle} label="Complete Service" color="amber" />
                  <h2 className="text-xl lg:text-2xl font-extrabold font-['Montserrat'] text-foreground">What's Included</h2>
                  <p className="text-muted-foreground text-sm mt-1">Our comprehensive service covers every detail.</p>
                </motion.div>

                {/* Mobile: big stacked cards */}
                <div className="flex flex-col gap-3 lg:hidden">
                  {service.features.map((feature, i) => (
                    <motion.div
                      key={feature}
                      variants={fadeUp}
                      custom={i}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border"
                    >
                      <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5 text-amber-500" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Desktop: 2-col compact grid */}
                <motion.div variants={fadeUp} custom={1} className="hidden lg:grid grid-cols-2 gap-3">
                  {service.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 flex items-center justify-center shrink-0 transition-colors">
                        <CheckCircle className="w-4 h-4 text-amber-500" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{feature}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* About This Service */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.div variants={fadeUp} custom={0}>
                  <SectionBadge icon={Sparkles} label="Overview" color="amber" />
                  <h2 className="text-xl lg:text-2xl font-extrabold font-['Montserrat'] text-foreground mb-3">About This Service</h2>
                  <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">{service.description}</p>
                </motion.div>
              </motion.div>

              {/* How It Works */}
              {service.processSteps && (
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <motion.div variants={fadeUp} custom={0} className="mb-5">
                    <SectionBadge icon={Clock} label="Our Process" color="amber" />
                    <h2 className="text-xl lg:text-2xl font-extrabold font-['Montserrat'] text-foreground">How It Works</h2>
                  </motion.div>
                  <div className="space-y-4">
                    {service.processSteps.map((step, i) => (
                      <motion.div
                        key={step.step}
                        variants={fadeUp}
                        custom={i * 0.5 + 1}
                        className="flex gap-4 items-start"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shrink-0 text-slate-900 font-extrabold text-xs shadow-lg shadow-amber-500/20">
                          {step.step}
                        </div>
                        <div className="flex-1 p-4 rounded-xl bg-card border border-border hover:border-amber-500/30 transition-all duration-200">
                          <h3 className="font-bold text-foreground text-sm font-['Montserrat'] mb-1">{step.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Why Choose Afnan */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.div variants={fadeUp} custom={0} className="mb-5">
                  <SectionBadge icon={Shield} label="Our Promise" color="amber" />
                  <h2 className="text-xl lg:text-2xl font-extrabold font-['Montserrat'] text-foreground">Why Choose Afnan?</h2>
                </motion.div>
                <motion.div
                  variants={fadeUp}
                  custom={1}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-amber-500/20"
                >
                  {[
                    { icon: Shield, text: "Licensed LLC — Trade No. 1571076" },
                    { icon: CheckCircle, text: "Certified & experienced technicians" },
                    { icon: Zap, text: "Transparent pricing, no hidden fees" },
                    { icon: Clock, text: "Same-day service for emergencies" },
                    { icon: Star, text: "Premium quality materials & equipment" },
                    { icon: Home, text: "100% customer satisfaction guarantee" },
                  ].map((item) => {
                    const IIcon = item.icon;
                    return (
                      <div key={item.text} className="flex items-center gap-3 text-sm text-white/80">
                        <IIcon className="w-4 h-4 text-amber-500 shrink-0" />
                        {item.text}
                      </div>
                    );
                  })}
                </motion.div>
              </motion.div>

              {/* FAQ */}
              {service.faqs && service.faqs.length > 0 && (
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <motion.div variants={fadeUp} custom={0} className="mb-5">
                    <SectionBadge icon={ChevronDown} label="Common Questions" color="amber" />
                    <h2 className="text-xl lg:text-2xl font-extrabold font-['Montserrat'] text-foreground">Frequently Asked Questions</h2>
                  </motion.div>
                  <div className="space-y-3">
                    {service.faqs.map((faq, i) => (
                      <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
                    ))}
                  </div>
                </motion.div>
              )}

            </div>

            {/* ── RIGHT COLUMN — Desktop Booking Sidebar ──────────────── */}
            <div className="hidden lg:block lg:sticky lg:top-8 space-y-4">
              <DesktopBookingCard service={service} Icon={Icon} handleWhatsApp={handleWhatsApp} />

              {service.stats && (
                <div className="grid grid-cols-3 gap-2">
                  {service.stats.map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center p-3 rounded-xl bg-card border border-border text-center">
                      <span className="text-amber-500 font-extrabold text-base leading-none">{stat.value}</span>
                      <span className="text-muted-foreground text-[10px] uppercase tracking-wide mt-1 leading-tight">{stat.label}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => navigate(-1)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border text-muted-foreground text-sm hover:text-foreground hover:border-amber-500/30 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Services
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TRACK RECORD — stats bar
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-10 border-t border-border" style={{ background: "var(--card, #f9f9f9)" }}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <SectionBadge icon={Star} label="Our Track Record" color="amber" />
            <h2 className="text-xl lg:text-3xl font-extrabold font-['Montserrat'] text-foreground">
              Numbers That Speak for Themselves
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { value: "13,000+", label: "Jobs Completed" },
              { value: "4.9★", label: "Average Rating" },
              { value: "8+", label: "Years in Dubai" },
              { value: "All", label: "Dubai Areas Covered" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={i}
                className="flex flex-col items-center p-5 rounded-2xl bg-background border border-border text-center"
              >
                <span className="text-amber-500 font-extrabold text-2xl lg:text-3xl leading-none mb-1">{stat.value}</span>
                <span className="text-muted-foreground text-xs uppercase tracking-wider">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CUSTOMER REVIEWS / TESTIMONIALS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-10 lg:py-14 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <SectionBadge icon={Quote} label="Customer Reviews" color="amber" />
            <h2 className="text-xl lg:text-3xl font-extrabold font-['Montserrat'] text-foreground">
              What Our Clients Say
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              Trusted by hundreds of homeowners across Dubai.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col lg:grid lg:grid-cols-3 gap-4"
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                custom={i}
                className="p-5 rounded-2xl bg-card border border-border"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {/* Review text */}
                <p className="text-foreground text-sm leading-relaxed mb-4">"{t.review}"</p>
                {/* Reviewer */}
                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <div className="w-9 h-9 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
                    <span className="text-amber-500 font-bold text-sm">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{t.name}</p>
                    <p className="text-muted-foreground text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {t.area}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CONTACT CTA SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-10 lg:py-14 border-t border-border"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b12 60%, #0c0a06 100%)" }}>
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 mb-5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400 text-xs font-semibold">Available Today Across Dubai</span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-2xl lg:text-4xl font-extrabold text-white font-['Montserrat'] mb-3"
            >
              Ready to Book?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-white/60 text-sm lg:text-base max-w-md mx-auto mb-7"
            >
              Get a free quote in under 30 minutes. Licensed, certified, and available 24/7 across all Dubai areas.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
              <Link
                to={`/contact?service=${service.id}`}
                id={`book-cta-${service.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-slate-900 text-sm active:scale-95 transition-all"
                style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
              >
                <Phone className="w-4 h-4" />
                Get Free Quote
              </Link>
              <button
                onClick={handleWhatsApp}
                id={`wa-cta-${service.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#25D366] text-white font-bold hover:bg-[#1ebe5d] active:scale-95 transition-all text-sm"
              >
                <WhatsAppIcon />
                WhatsApp Now
              </button>
            </motion.div>

            {/* Trust badges row */}
            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-6">
              {["✅ Trade License No. 1571076", "⏰ 24/7 Emergency", "📍 All Dubai Areas", "🛡️ Fully Insured"].map((t) => (
                <span key={t} className="text-white/40 text-xs">{t}</span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          OTHER SERVICES
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 lg:py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-8 lg:mb-12"
          >
            <motion.span variants={fadeUp} custom={0} className="text-amber-500 text-xs font-bold tracking-widest uppercase">
              Explore More
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-xl lg:text-3xl font-bold font-['Montserrat'] text-foreground mt-2">
              Our Other Services
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground mt-2 max-w-md mx-auto text-sm">
              Comprehensive property care solutions for every need across Dubai.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherServices.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>

          <div className="text-center mt-8 lg:mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-amber-500/30 text-amber-500 font-semibold hover:bg-amber-500/5 transition-all text-sm"
            >
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE STICKY BOTTOM BAR — rounded pill buttons
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-4 pt-3"
        style={{ background: "rgba(10,8,5,0.96)", backdropFilter: "blur(14px)" }}
      >
        <div className="flex gap-3">
          <button
            onClick={handleCall}
            id={`call-sticky-${service.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white text-sm active:opacity-80 transition-opacity"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #1e40af)" }}
            aria-label="Call us"
          >
            <Phone className="w-4 h-4" />
            Call
          </button>
          <button
            onClick={handleWhatsApp}
            id={`wa-sticky-${service.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white text-sm active:opacity-80 transition-opacity"
            style={{ background: "#25D366" }}
            aria-label="Chat on WhatsApp"
          >
            <WhatsAppIcon />
            WhatsApp
          </button>
        </div>
      </div>

      {/* Bottom padding so content isn't hidden behind sticky bar */}
      <div className="h-20 lg:hidden" />
    </div>
  );
};

export default ServiceDetail;
