import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, CheckCircle, Phone, ArrowLeft, ChevronDown,
  Snowflake, Droplets, Zap, TreePine, Paintbrush, Star, Leaf,
  Wrench, Fan, Sparkles, Droplet, LayoutGrid, Home, Server, BrickWall, Clock, Shield,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import SEO from "@/components/SEO";
import { services } from "@/data/services";
import { trackWhatsAppClick } from "@/lib/analytics";

const WHATSAPP_NUMBER = "971505387736";

const iconMap = {
  Snowflake, Droplets, Zap, TreePine, Paintbrush, Star, Leaf,
  Wrench, Fan, Sparkles, Droplet, LayoutGrid, Home, Server, BrickWall, Clock, Shield, CheckCircle,
};

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

// ── FAQ Item ────────────────────────────────────────────────────────────────
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

// ── Main Component ───────────────────────────────────────────────────────────
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

  // ── Not Found ──────────────────────────────────────────────────────────────
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
          HERO — full-width image with stats bar
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        {/* Background image — fetchpriority for LCP */}
        <img
          src={service.image}
          alt={service.title}
          width="1920"
          height="1080"
          fetchpriority="high"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-slate-900/20" />

        {/* Decorative gold glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-28 pb-10">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-white/50 text-xs mb-6"
          >
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <span>/</span>
            <span className="text-white/80 line-clamp-1">{service.title}</span>
          </motion.nav>

          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            {/* Badge */}
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Icon className="w-5 h-5 text-slate-900" />
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold tracking-wider uppercase border border-amber-500/30">
                Professional Service — Dubai, UAE
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-3xl md:text-5xl font-extrabold text-white font-['Montserrat'] leading-tight mb-8"
            >
              {service.title}
            </motion.h1>

            {/* Stats bar */}
            {service.stats && (
              <motion.div
                variants={fadeUp}
                custom={2}
                className="flex flex-wrap gap-3"
              >
                {[
                  ...service.stats,
                  { label: "Trade License", value: "✓ LLC" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                  >
                    <span className="text-amber-400 font-extrabold text-lg leading-none">{stat.value}</span>
                    <span className="text-white/60 text-[10px] uppercase tracking-wider mt-1">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          KEY BENEFITS — 3 gradient cards
      ═══════════════════════════════════════════════════════════════════ */}
      {service.keyBenefits && (
        <section className="py-10 bg-card border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-5"
            >
              {service.keyBenefits.map((benefit, i) => {
                const BIcon = iconMap[benefit.icon] || CheckCircle;
                return (
                  <motion.div
                    key={benefit.title}
                    variants={fadeUp}
                    custom={i}
                    className="group flex gap-4 p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 hover:border-amber-500/40 hover:from-amber-500/15 transition-all duration-300"
                  >
                    <div className="w-11 h-11 rounded-xl bg-amber-500/20 group-hover:bg-amber-500/30 flex items-center justify-center shrink-0 transition-colors">
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
          MAIN CONTENT — 2/3 + 1/3 grid
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-14">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10 items-start">

            {/* ── LEFT COLUMN ───────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-12">

              {/* About */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.div variants={fadeUp} custom={0}>
                  <span className="text-amber-500 text-xs font-bold tracking-widest uppercase">Overview</span>
                  <h2 className="text-2xl font-bold font-['Montserrat'] text-foreground mt-2 mb-4">About This Service</h2>
                  <p className="text-muted-foreground text-base leading-relaxed">{service.description}</p>
                </motion.div>
              </motion.div>

              {/* What's Included */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.div variants={fadeUp} custom={0}>
                  <span className="text-amber-500 text-xs font-bold tracking-widest uppercase">What's Included</span>
                  <h2 className="text-2xl font-bold font-['Montserrat'] text-foreground mt-2 mb-5">Service Breakdown</h2>
                </motion.div>
                <motion.div variants={fadeUp} custom={1} className="grid sm:grid-cols-2 gap-3">
                  {service.features.map((feature, i) => (
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

              {/* How It Works */}
              {service.processSteps && (
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <motion.div variants={fadeUp} custom={0}>
                    <span className="text-amber-500 text-xs font-bold tracking-widest uppercase">Our Process</span>
                    <h2 className="text-2xl font-bold font-['Montserrat'] text-foreground mt-2 mb-6">How It Works</h2>
                  </motion.div>
                  <div className="relative">
                    {/* Connector line */}
                    <div className="absolute left-5 top-10 bottom-10 w-0.5 bg-gradient-to-b from-amber-500/60 via-amber-500/20 to-transparent hidden sm:block" />
                    <div className="space-y-5">
                      {service.processSteps.map((step, i) => (
                        <motion.div
                          key={step.step}
                          variants={fadeUp}
                          custom={i * 0.5 + 1}
                          className="flex gap-5 items-start group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shrink-0 text-slate-900 font-extrabold text-xs shadow-lg shadow-amber-500/20 relative z-10">
                            {step.step}
                          </div>
                          <div className="flex-1 p-4 rounded-xl bg-card border border-border group-hover:border-amber-500/30 group-hover:bg-amber-500/5 transition-all duration-200">
                            <h3 className="font-bold text-foreground text-sm font-['Montserrat'] mb-1">{step.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Why Choose Us */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.div variants={fadeUp} custom={0}>
                  <span className="text-amber-500 text-xs font-bold tracking-widest uppercase">Our Promise</span>
                  <h2 className="text-2xl font-bold font-['Montserrat'] text-foreground mt-2 mb-5">Why Choose Afnan?</h2>
                </motion.div>
                <motion.div
                  variants={fadeUp}
                  custom={1}
                  className="grid sm:grid-cols-2 gap-3 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-amber-500/20"
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
                  <motion.div variants={fadeUp} custom={0}>
                    <span className="text-amber-500 text-xs font-bold tracking-widest uppercase">Common Questions</span>
                    <h2 className="text-2xl font-bold font-['Montserrat'] text-foreground mt-2 mb-5">
                      Frequently Asked Questions
                    </h2>
                  </motion.div>
                  <div className="space-y-3">
                    {service.faqs.map((faq, i) => (
                      <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
                    ))}
                  </div>
                </motion.div>
              )}

            </div>

            {/* ── RIGHT COLUMN — Sticky booking card ──────────────────── */}
            <div className="lg:sticky lg:top-8 space-y-4">
              {/* Glassmorphism booking card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl"
                style={{ background: "linear-gradient(135deg, rgba(30,27,20,0.95) 0%, rgba(15,12,8,0.98) 100%)" }}
              >
                {/* Card header */}
                <div className="px-6 py-5 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/15 to-transparent">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                      <Icon className="w-4 h-4 text-slate-900" />
                    </div>
                    <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">Book This Service</span>
                  </div>
                  <p className="text-white/50 text-xs mt-2">
                    Get a free quote in under 30 minutes. Available 24/7.
                  </p>
                </div>

                {/* Buttons */}
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

                  {/* Trust signals */}
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

              {/* Quick stat cards */}
              {service.stats && (
                <div className="grid grid-cols-3 gap-2">
                  {service.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col items-center p-3 rounded-xl bg-card border border-border text-center"
                    >
                      <span className="text-amber-500 font-extrabold text-base leading-none">{stat.value}</span>
                      <span className="text-muted-foreground text-[10px] uppercase tracking-wide mt-1 leading-tight">{stat.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Back button */}
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
          OTHER SERVICES
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.span variants={fadeUp} custom={0} className="text-amber-500 text-xs font-bold tracking-widest uppercase">
              Explore More
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl font-bold font-['Montserrat'] text-foreground mt-2">
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

          <div className="text-center mt-10">
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
    </div>
  );
};

export default ServiceDetail;
