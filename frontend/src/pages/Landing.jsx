import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Award, CheckCircle, Phone, Star, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import AdBanner from "@/components/AdBanner";
import { services } from "@/data/services";
import heroImage from "@/assets/hero-dubai-villa.webp";
import SEO from "@/components/SEO";
import { trackWhatsAppClick } from "@/lib/analytics";

const WHATSAPP_NUMBER = "971505387736";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" }
  })
};

const SERVICE_LINKS = [
  { id: "ac-cleaning",       label: "AC Cleaning Dubai",              icon: "❄️" },
  { id: "ac-ventilation",    label: "AC Maintenance & Ventilation",   icon: "🌀" },
  { id: "plumbing",          label: "Plumbing Services Dubai",        icon: "🔧" },
  { id: "electrical",        label: "Electrical Services Dubai",      icon: "⚡" },
  { id: "building-cleaning", label: "Building Cleaning Dubai",        icon: "✨" },
  { id: "painting",          label: "Painting Services Dubai",        icon: "🖌️" },
  { id: "tiling",            label: "Floor & Wall Tiling Dubai",      icon: "🪟" },
  { id: "plaster-works",     label: "Plaster Works Dubai",            icon: "🏗️" },
  { id: "property-care",     label: "Residential Property Care",      icon: "🏠" },
  { id: "systems-maintenance","label": "Smart Home Systems Dubai",    icon: "📡" },
];

const Landing = () => {
  const highlights = [
    { icon: Shield, title: "Licensed & Insured", desc: "Fully licensed LLC — Trade License No. 1571076" },
    { icon: Clock,  title: "24/7 Availability",  desc: "Same-day & emergency services across Dubai"   },
    { icon: Award,  title: "Certified Technicians", desc: "DEWA-certified, experienced professionals"  }
  ];

  return <div className="min-h-screen bg-background">
    <SEO
      title="Home Maintenance Services Dubai | Afnan Property Care — Licensed LLC"
      description="Licensed home maintenance company in Dubai. Expert AC cleaning, plumbing, electrical & handyman services. Certified technicians. Call now for a free quote! Trade License No. 1571076."
      keywords="home maintenance dubai, property maintenance dubai, handyman dubai, AC cleaning dubai, plumbing dubai, electrical services dubai, villa maintenance dubai, painting dubai, building cleaning dubai, licensed maintenance company dubai"
      canonicalUrl="/"
      robots="index, follow, max-image-preview:large"
      themeColor="#0F6CBD"
      pageType="homepage"
      ogTitle="Afnan Property Care | #1 Home Maintenance Services in Dubai"
      ogDescription="Trusted licensed residential property maintenance across Dubai. AC cleaning, plumbing, electrical, painting & more. Trade License No. 1571076. Get a free quote today!"
      ogImage="https://maresidentialpropertycareservicellc.com/og-image.jpg"
      twitterTitle="Home Maintenance Services Dubai | Afnan Property Care"
      twitterDescription="Expert AC, plumbing, electrical & property maintenance in Dubai. Licensed LLC, certified technicians. Call +971-505387736."
      twitterImage="https://maresidentialpropertycareservicellc.com/og-image.jpg"
    />

    {/* Promotional banner — only shows when an active hero_banner ad exists */}
    <AdBanner placement="hero_banner" />
    <Navbar />

    {/* ── Hero ──────────────────────────────────────────────────────── */}
    <section className="relative min-h-[90vh] flex items-center" aria-label="Hero — Home Maintenance Services Dubai">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury Dubai villa property maintenance by Afnan Property Care"
          className="w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
          width="1920"
          height="1080"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>
      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20">
        <motion.div initial="hidden" animate="visible" className="max-w-2xl">
          <motion.div variants={fadeUp} custom={0}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-semibold tracking-wider uppercase mb-6 border border-accent/30">
              Dubai's Trusted Licensed Property Care — Trade License No. 1571076
            </span>
          </motion.div>

          {/* PRIMARY H1 — contains exact-match keyword for ranking */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-4 font-['Montserrat']"
          >
            Home Maintenance Services{" "}
            <span className="text-gradient-gold">in Dubai</span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={1.5} className="text-xl md:text-2xl text-primary-foreground/90 font-medium font-['Montserrat'] mb-6">
            AC Cleaning • Plumbing • Electrical • Painting • More
          </motion.p>

          <motion.div variants={fadeUp} custom={2} className="flex items-center gap-3 max-w-lg mb-8">
            <p className="text-lg text-primary-foreground/80 flex-1">
              Licensed residential property maintenance in Dubai — certified technicians, same-day service, 100% satisfaction guarantee.
            </p>
            <button
              onClick={() => {
                const msg = encodeURIComponent(
                  "Hi! I'm interested in your property care services. Can you please provide more details?"
                );
                trackWhatsAppClick('Hero Floating Button');
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank", "noopener,noreferrer");
              }}
              aria-label="Chat with us on WhatsApp"
              className="w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0 hover:bg-[#1ebe5d] hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <WhatsAppIcon />
            </button>
          </motion.div>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact"
              id="hero-book-now"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-accent text-accent-foreground font-semibold hover:brightness-110 transition-all shadow-gold"
            >
              <Phone className="w-5 h-5" /> Get a Free Quote
            </Link>
            <Link
              to="/services"
              id="hero-view-services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-primary-foreground/10 text-primary-foreground font-semibold backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all"
            >
              View All Services <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* ── Trust Badges ──────────────────────────────────────────────── */}
    <section className="py-16 bg-gold-light" aria-label="Why choose us">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {highlights.map((h, i) => <motion.div
            key={h.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i}
            className="flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-md bg-accent/15 flex items-center justify-center shrink-0">
              <h.icon className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-foreground font-['Montserrat']">{h.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{h.desc}</p>
            </div>
          </motion.div>)}
        </div>
      </div>
    </section>

    {/* ── Services Preview ──────────────────────────────────────────── */}
    <section className="py-20" id="services" aria-label="Our home maintenance services in Dubai">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-center mb-14"
        >
          <span className="text-accent text-sm font-semibold tracking-wider uppercase">What We Offer</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 font-['Montserrat'] text-foreground">
            Complete Home Maintenance Services in Dubai
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            From urgent AC repairs to full property care contracts — Afnan Property Care is Dubai's one-stop licensed maintenance company serving villas, apartments, and townhouses across all areas.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
        </div>
        <div className="text-center mt-10">
          <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 rounded-md border border-accent text-accent font-semibold hover:bg-accent hover:text-accent-foreground transition-all">
            View All Services <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>

    {/* ── About / Company Intro — content for Google ────────────────── */}
    <section className="py-20 bg-gold-light" aria-label="About Afnan Property Care Dubai">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.span variants={fadeUp} custom={0} className="text-accent text-sm font-semibold tracking-wider uppercase">
              About Us
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold mt-2 font-['Montserrat'] text-foreground">
              Dubai's Licensed Residential Property Care Company
            </motion.h2>
            <motion.div variants={fadeUp} custom={2} className="space-y-4 mt-4">
              <p className="text-muted-foreground leading-relaxed">
                <strong>Muhammad Afnan Residential Property Care Services L.L.C</strong> (Trade License No. 1571076) is a fully licensed and insured home maintenance company based in Dubai, UAE. Since 2024, we have served over 500 satisfied clients across Dubai — from luxury villas in Palm Jumeirah and Dubai Marina to apartments in JVC, Downtown, Deira, and Al Barsha.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our team of certified technicians specialises in <Link to="/services/ac-cleaning" className="text-accent hover:underline font-medium">AC cleaning and maintenance</Link>, <Link to="/services/plumbing" className="text-accent hover:underline font-medium">plumbing and sanitary repairs</Link>, <Link to="/services/electrical" className="text-accent hover:underline font-medium">electrical fittings</Link>, <Link to="/services/painting" className="text-accent hover:underline font-medium">painting contracting</Link>, <Link to="/services/building-cleaning" className="text-accent hover:underline font-medium">building cleaning</Link>, <Link to="/services/tiling" className="text-accent hover:underline font-medium">tiling works</Link>, and complete <Link to="/services/property-care" className="text-accent hover:underline font-medium">residential property care</Link>.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We offer flexible Annual Maintenance Contracts (AMC) for landlords, property managers, and homeowners who want complete peace of mind. Our transparent pricing model means you receive a fixed quote before work begins — no hidden fees, no surprises.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} custom={3} className="mt-6">
              <Link to="/about" className="inline-flex items-center gap-2 text-accent font-semibold hover:underline">
                Learn more about us <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
            {/* Service quick-links for internal linking + keyword signals */}
            <motion.h3 variants={fadeUp} custom={0} className="text-lg font-bold font-['Montserrat'] text-foreground">
              Our Services in Dubai
            </motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SERVICE_LINKS.map((s, i) => (
                <motion.div key={s.id} variants={fadeUp} custom={i * 0.1}>
                  <Link
                    to={`/services/${s.id}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all text-sm font-medium text-foreground/80 hover:text-accent"
                  >
                    <span aria-hidden="true">{s.icon}</span>
                    {s.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
              {[
                { value: "500+", label: "Happy Clients" },
                { value: "24/7", label: "Availability" },
                { value: "1571076", label: "Trade License" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-bold text-accent font-['Montserrat']">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ── Why Choose Us ─────────────────────────────────────────────── */}
    <section className="py-20 bg-navy text-primary-foreground" aria-label="Why choose Afnan Property Care Dubai">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.span variants={fadeUp} custom={0} className="text-gold text-sm font-semibold tracking-wider uppercase">
              Why Choose Us
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold mt-2 font-['Montserrat']">
              Dubai's #1 Residential Property Maintenance Company
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/70 mt-4 max-w-lg">
              With Trade License No. 1571076, we are a fully licensed LLC committed to delivering exceptional home maintenance services across Dubai. Our certified technicians serve all Dubai areas — villas, apartments, and commercial properties.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              "Licensed & fully insured LLC in Dubai (Trade License No. 1571076)",
              "DEWA-certified & experienced technicians",
              "Transparent fixed pricing — no hidden fees",
              "Same-day emergency service across all Dubai areas",
              "Annual Maintenance Contracts (AMC) available",
              "100% customer satisfaction guarantee",
              "Serving villas, apartments & townhouses",
              "Available 7 days a week including public holidays",
            ].map((item, i) => <motion.div key={i} variants={fadeUp} custom={i * 0.3} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-gold shrink-0" />
              <span className="text-primary-foreground/85">{item}</span>
            </motion.div>)}
          </motion.div>
        </div>
      </div>
    </section>

    {/* ── Service Areas ─────────────────────────────────────────────── */}
    <section className="py-16" aria-label="Home maintenance service areas in Dubai">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.span variants={fadeUp} custom={0} className="text-accent text-sm font-semibold tracking-wider uppercase">
            Service Areas
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold mt-2 font-['Montserrat'] text-foreground">
            We Cover All Areas of Dubai
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Our licensed home maintenance teams are deployed across every neighbourhood in Dubai for fast, same-day response.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              "Dubai Marina", "Palm Jumeirah", "JVC", "Downtown Dubai",
              "Business Bay", "Jumeirah", "DIFC", "Al Barsha",
              "Arabian Ranches", "Mirdif", "Deira", "Bur Dubai",
              "JLT", "Motor City", "Sports City", "Silicon Oasis"
            ].map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-foreground text-sm font-medium"
              >
                <MapPin className="w-3.5 h-3.5 text-accent" />
                {area}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* ── Testimonials ──────────────────────────────────────────────── */}
    <section className="py-20 bg-gold-light" aria-label="Customer reviews for Afnan Property Care Dubai">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
          <motion.span variants={fadeUp} custom={0} className="text-accent text-sm font-semibold tracking-wider uppercase">
            Customer Reviews
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold mt-2 font-['Montserrat'] text-foreground">
            What Our Dubai Clients Say
          </motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Ahmed Al Rashid",  area: "Dubai Marina",   stars: 5, review: "Excellent AC cleaning service! The team arrived on time, were very professional and completely transformed our units. Highly recommend Afnan Property Care for any home maintenance in Dubai." },
            { name: "Sarah Johnson",    area: "JVC",            stars: 5, review: "Outstanding plumbing work. Very clean, respectful of our home, and the quality was exceptional. Fixed our burst pipe within the hour. Will definitely use them again." },
            { name: "Mohammed Al Zaabi", area: "Palm Jumeirah", stars: 5, review: "Best home maintenance company in Dubai! Fast response, fair pricing, and the technicians really know their stuff. Their electrical work is superb. Five stars." },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="bg-background rounded-xl p-6 border border-border shadow-sm"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{t.review}"</p>
              <div>
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.area}, Dubai</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── FAQ Section — for Google Featured Snippets ────────────────── */}
    <section className="py-20" aria-label="Frequently asked questions about home maintenance in Dubai">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
          <motion.span variants={fadeUp} custom={0} className="text-accent text-sm font-semibold tracking-wider uppercase">
            FAQs
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold mt-2 font-['Montserrat'] text-foreground">
            Home Maintenance Dubai — FAQs
          </motion.h2>
        </motion.div>
        <div className="space-y-4">
          {[
            {
              q: "What home maintenance services do you offer in Dubai?",
              a: "Afnan Property Care offers AC cleaning & maintenance, plumbing & sanitary repair, electrical fittings, building cleaning, painting contracting, floor & wall tiling, plaster works, CCTV & systems installation, and comprehensive residential property care across all areas of Dubai."
            },
            {
              q: "Are you a licensed home maintenance company in Dubai?",
              a: "Yes. Muhammad Afnan Residential Property Care Services L.L.C is a fully licensed limited liability company in Dubai, UAE. Our Trade License number is 1571076. All our technicians are certified, background-checked, and DEWA-compliant."
            },
            {
              q: "Do you offer same-day home maintenance service in Dubai?",
              a: "Yes. We offer same-day and emergency property maintenance services across all areas of Dubai — Dubai Marina, JVC, Palm Jumeirah, Downtown, Business Bay, Jumeirah, Al Barsha, Mirdif, Deira, and Bur Dubai. Call +971-505387736 for immediate assistance."
            },
            {
              q: "How much do home maintenance services cost in Dubai?",
              a: "Our services start from AED 150 per visit. We provide transparent, upfront fixed quotes before any work begins — no hidden fees. Annual Maintenance Contracts (AMC) are also available for comprehensive year-round coverage at reduced rates."
            },
            {
              q: "Do you cover villas and apartments in Dubai?",
              a: "Yes. We provide home maintenance for villas, apartments, townhouses, and penthouses across all Dubai communities."
            },
          ].map((faq, i) => (
            <motion.details
              key={faq.q}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="group border border-border rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer bg-card hover:bg-accent/5 transition-colors font-semibold text-foreground text-sm">
                {faq.q}
                <span className="text-accent shrink-0 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-5 py-4 text-sm text-muted-foreground leading-relaxed border-t border-border bg-card/50">
                {faq.a}
              </div>
            </motion.details>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ───────────────────────────────────────────────────────── */}
    <section className="py-20 bg-navy text-primary-foreground" aria-label="Contact Afnan Property Care Dubai">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-['Montserrat'] mb-4">
            Book Your Home Maintenance in Dubai Today
          </h2>
          <p className="text-primary-foreground/70 max-w-lg mx-auto mb-8">
            Get a free quote for any of our property care services. Our team is ready to help maintain your home to the highest standards — available 24/7, same-day service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              id="cta-get-quote"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-accent text-accent-foreground font-semibold hover:brightness-110 transition-all shadow-gold"
            >
              Get a Free Quote <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+971505387736"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-primary-foreground/10 text-primary-foreground font-semibold border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all"
            >
              <Phone className="w-5 h-5" /> Call +971-505387736
            </a>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Footer promotional strip */}
    <AdBanner placement="footer_strip" />
    <Footer />
  </div>;
};
export default Landing;
