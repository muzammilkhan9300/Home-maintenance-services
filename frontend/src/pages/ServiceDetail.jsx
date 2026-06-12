import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle, Phone, ArrowLeft,
  Snowflake, Droplets, Zap, TreePine, Paintbrush,
  Wrench, Fan, Sparkles, Droplet, LayoutGrid, Home, Server, BrickWall,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import SEO from "@/components/SEO";
import { services } from "@/data/services";
import { trackWhatsAppClick } from "@/lib/analytics";

const WHATSAPP_NUMBER = "971505387736";

const iconMap = {
  Snowflake, Droplets, Zap, TreePine, Paintbrush,
  Wrench, Fan, Sparkles, Droplet, LayoutGrid, Home, Server, BrickWall,
};

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: "easeOut" },
  }),
};

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const service = services.find((s) => s.id === id);
  const otherServices = services.filter((s) => s.id !== id);
  const Icon = service ? (iconMap[service.icon] || Wrench) : Wrench;

  const handleWhatsApp = () => {
    if (!service) return;
    const msg = encodeURIComponent(
      `Hi! I'm interested in your *${service.title}* service. Can you please provide more details and availability?`
    );
    trackWhatsAppClick("Service Detail Page", service.title);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  // ── Service Not Found ───────────────────────────────────────────────────
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
        title={`${service.title} | Afnan Property Care Dubai`}
        description={`${service.description} Book professional ${service.title.toLowerCase()} in Dubai with Afnan Property Care. Licensed & certified technicians, 24/7 availability.`}
        canonicalUrl={`/services/${service.id}`}
      />

      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[55vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-foreground/20" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-28 pb-12">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-primary-foreground/60 text-sm mb-6"
          >
            <Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-primary-foreground transition-colors">Services</Link>
            <span>/</span>
            <span className="text-primary-foreground/90 truncate max-w-[200px]">{service.title}</span>
          </motion.div>

          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-md bg-accent flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold tracking-wider uppercase border border-accent/30">
                Professional Service
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-3xl md:text-5xl font-bold text-primary-foreground font-['Montserrat'] leading-tight"
            >
              {service.title}
            </motion.h1>
          </motion.div>
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10 items-start">

            {/* Left — Description + Features */}
            <motion.div
              initial="hidden"
              animate="visible"
              className="lg:col-span-2 space-y-8"
            >
              <motion.div variants={fadeUp} custom={0}>
                <h2 className="text-2xl font-bold font-['Montserrat'] text-foreground mb-4">
                  About This Service
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {service.description}
                </p>
              </motion.div>

              <motion.div variants={fadeUp} custom={1}>
                <h3 className="text-xl font-bold font-['Montserrat'] text-foreground mb-5">
                  What's Included
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {service.features.map((feature, i) => (
                    <motion.div
                      key={feature}
                      variants={fadeUp}
                      custom={i * 0.5 + 2}
                      className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-accent/40 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Why Choose Us strip */}
              <motion.div
                variants={fadeUp}
                custom={3}
                className="rounded-xl bg-card border border-border p-6"
              >
                <h3 className="text-lg font-bold font-['Montserrat'] text-foreground mb-4">
                  Why Choose Afnan Property Care?
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "Licensed & insured company in Dubai",
                    "Certified & experienced technicians",
                    "Transparent pricing, no hidden fees",
                    "Same-day service for emergencies",
                    "Premium quality materials & equipment",
                    "100% customer satisfaction guarantee",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right — Sticky Booking Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="lg:sticky lg:top-8"
            >
              <div className="rounded-2xl bg-card border border-border shadow-premium overflow-hidden">
                {/* Card header */}
                <div className="bg-accent/10 border-b border-accent/20 px-6 py-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-md bg-accent flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <span className="text-sm font-semibold text-accent uppercase tracking-wider">Book This Service</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Get a free quote within minutes. Our team is available 24/7.
                  </p>
                </div>

                {/* Card body */}
                <div className="p-6 space-y-4">
                  <Link
                    to={`/contact?service=${service.id}`}
                    id={`book-service-${service.id}`}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-accent text-accent-foreground font-semibold hover:brightness-110 transition-all shadow-gold text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    Get a Free Quote
                  </Link>

                  <button
                    onClick={handleWhatsApp}
                    id={`whatsapp-service-${service.id}`}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#1ebe5d] transition-all text-sm"
                  >
                    <WhatsAppIcon />
                    Chat on WhatsApp
                  </button>

                  {/* Trust signals */}
                  <div className="pt-2 border-t border-border space-y-2.5">
                    {[
                      { icon: "✅", text: "Licensed LLC — Trade No. 1571076" },
                      { icon: "⏰", text: "24/7 Emergency Availability" },
                      { icon: "📍", text: "Serving all of Dubai, UAE" },
                      { icon: "🛡️", text: "Fully insured & certified" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.icon}</span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Back to services */}
              <button
                onClick={() => navigate(-1)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border text-muted-foreground text-sm hover:text-foreground hover:border-accent/40 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Services
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Other Services ────────────────────────────────────────────── */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <span className="text-accent text-sm font-semibold tracking-wider uppercase">Explore More</span>
            <h2 className="text-2xl md:text-3xl font-bold font-['Montserrat'] text-foreground mt-2">
              Our Other Services
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto text-sm">
              Comprehensive property care solutions for every need across Dubai.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherServices.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-accent/30 text-accent font-semibold hover:bg-accent/5 transition-all text-sm"
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
