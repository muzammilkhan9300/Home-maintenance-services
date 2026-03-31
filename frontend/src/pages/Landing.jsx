import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Award, CheckCircle, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { services } from "@/data/services";
import heroImage from "@/assets/hero-dubai-villa.jpg";
import SEO from "@/components/SEO";

// ✅ Same number as ServiceCard — update here too if you change it
const WHATSAPP_NUMBER = "971504200736";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

const heroServices = [
  "Residential Property Care Services",
  "Air-Conditioning Services",
  "Painting Contracting",
  "Carpentry & Woodwork",
  "Cleaning Services",
  "Electrical Works",
  "Plumbing & Sanitary",
  "Tiling Works",
];
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" }
  })
};
const Landing = () => {
  const highlights = [
    { icon: Shield, title: "Licensed & Insured", desc: "Fully licensed LLC operating in Dubai" },
    { icon: Clock, title: "24/7 Availability", desc: "Emergency services when you need them" },
    { icon: Award, title: "Certified Technicians", desc: "Skilled professionals with UAE certifications" }
  ];
  return <div className="min-h-screen bg-background">
    <SEO
      title="Home Maintenance & Handyman Services in Dubai"
      description="Afnan Property Care offers premium residential property maintenance in Dubai. Expert AC repair, plumbing, electrical, and handyman services."
      canonicalUrl=""
    />
    <Navbar />

    {
      /* Hero */
    }
    <section className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Luxury Dubai villa" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>
      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20">
        <motion.div initial="hidden" animate="visible" className="max-w-2xl">
          <motion.div variants={fadeUp} custom={0}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-semibold tracking-wider uppercase mb-6 border border-accent/30">
              Dubai's Trusted Property Care Services
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-4 font-['Montserrat']">
            Your space, <span className="text-gradient-gold">our priority</span>
          </motion.h1>
          <motion.h2 variants={fadeUp} custom={1.5} className="text-2xl md:text-3xl text-primary-foreground/90 font-medium font-['Montserrat'] mb-6">
            Reliable maintenance, lasting results
          </motion.h2>
          <motion.div variants={fadeUp} custom={2} className="flex items-center gap-3 max-w-lg mb-8">
            <p className="text-lg text-primary-foreground/80 flex-1">
              Residential Property Care Service, air-conditioning services, painting, carpentry, cleaning services etc.
            </p>
            <button
              onClick={() => {
                const msg = encodeURIComponent(
                  "Hi! I'm interested in your property care services. Can you please provide more details?"
                );
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
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-accent text-accent-foreground font-semibold hover:brightness-110 transition-all shadow-gold"
            >
              <Phone className="w-5 h-5" /> Book Now
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-primary-foreground/10 text-primary-foreground font-semibold backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all"
            >
              Our Services <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {
      /* Highlights */
    }
    <section className="py-16 bg-gold-light">
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

    {
      /* Services Preview */
    }
    <section className="py-20">
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
          <h2 className="text-3xl md:text-4xl font-bold mt-2 font-['Montserrat'] text-foreground">Our Services</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Comprehensive property maintenance solutions tailored for Dubai's luxury residential market.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
        </div>
      </div>
    </section>

    {
      /* Why Choose Us */
    }
    <section className="py-20 bg-navy text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.span variants={fadeUp} custom={0} className="text-gold text-sm font-semibold tracking-wider uppercase">
              Why Choose Us
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold mt-2 font-['Montserrat']">
              Dubai's Reliable Property Care Partner
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/70 mt-4 max-w-lg">
              With Trade License No. 1571076, we are a fully licensed LLC committed to delivering exceptional home maintenance services across Dubai.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              "Licensed & fully insured company in Dubai",
              "Certified & experienced technicians",
              "Transparent pricing with no hidden fees",
              "Same-day service for emergencies",
              "Premium quality materials & equipment",
              "100% customer satisfaction guarantee"
            ].map((item, i) => <motion.div key={i} variants={fadeUp} custom={i * 0.5} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-gold shrink-0" />
              <span className="text-primary-foreground/85">{item}</span>
            </motion.div>)}
          </motion.div>
        </div>
      </div>
    </section>

    {
      /* CTA */
    }
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="bg-accent/5 border border-accent/20 rounded-lg p-10 md:p-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-['Montserrat'] text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Get a free quote for any of our property care services. Our team is ready to help maintain your home to the highest standards.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-accent text-accent-foreground font-semibold hover:brightness-110 transition-all shadow-gold"
          >
            Get a Free Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>;
};
export default Landing;
