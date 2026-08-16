import { useRef, useEffect } from "react";
import { Award, Users, Calendar, Shield, CheckCircle, ArrowRight, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

// CSS-based fade-in (zero JS weight)
const useFadeIn = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; obs.unobserve(el); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
};
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useFadeIn();
  return <div ref={ref} className={className} style={{ opacity: 0, transform: "translateY(20px)", transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms` }}>{children}</div>;
};

const About = () => {
  const stats = [
    { icon: Calendar, value: "2024", label: "Established" },
    { icon: Users, value: "500+", label: "Happy Clients" },
    { icon: Award, value: "1571076", label: "Trade License No." },
    { icon: Shield, value: "100%", label: "Licensed & Insured" }
  ];

  return <div className="min-h-screen bg-background">
    <SEO
      title="Licensed Maintenance Company Dubai | About Afnan Property Care"
      description="Muhammad Afnan Residential Property Care Services L.L.C is a licensed Dubai home maintenance company (Trade License #1571076). AC, plumbing, electrical & handyman."
      keywords="about afnan property care, dubai property maintenance company, licensed maintenance company dubai, trade license 1571076, property care dubai, villa maintenance company dubai"
      canonicalUrl="/about"
      robots="index, follow, max-image-preview:large"
      themeColor="#0F6CBD"
      pageType="about"
      ogTitle="About Afnan Property Care | Licensed Dubai Maintenance LLC"
      ogDescription="Trusted, licensed residential property maintenance company in Dubai. Trade License No. 1571076. Certified technicians serving villas & apartments."
      ogImage="https://maresidentialpropertycareservicellc.com/og-image.jpg"
      twitterTitle="About Afnan Property Care | Licensed Maintenance Company Dubai"
      twitterDescription="Licensed Dubai property maintenance LLC (Trade License #1571076). Certified AC, plumbing & electrical technicians."
      twitterImage="https://maresidentialpropertycareservicellc.com/og-image.jpg"
    />
    <Navbar />

    {/* Hero */}
    <section className="pt-28 pb-16 bg-navy text-primary-foreground" aria-label="About Us Hero">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl hero-fade-in">
          <span className="text-gold text-sm font-semibold tracking-wider uppercase">
            About Afnan Property Care
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 font-['Montserrat']">
            Licensed Residential Property Care Company in Dubai
          </h1>
          <p className="text-primary-foreground/70 mt-4 text-lg leading-relaxed">
            Muhammad Afnan Residential Property Care Services L.L.C is a fully licensed and insured home maintenance company based in Dubai, UAE (Trade License No. 1571076).
          </p>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-12 bg-gold-light" aria-label="Company Statistics">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => <FadeIn key={s.label} delay={i * 80} className="text-center">
            <s.icon className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold font-['Montserrat'] text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </FadeIn>)}
        </div>
      </div>
    </section>

    {/* Main Content / Story */}
    <section className="py-20" aria-label="Our Story and Mission">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <FadeIn>
          <h2 className="text-3xl font-bold font-['Montserrat'] text-foreground mb-6">
            Our Story & Commitment to Dubai Homeowners
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Founded in Dubai, <strong>Muhammad Afnan Residential Property Care Services L.L.C</strong> was established with a clear mission: to provide transparent, high-quality, and dependable home maintenance services to residential property owners and tenants across the emirate.
            </p>
            <p>
              Operating under official <strong>Trade License No. 1571076</strong> issued by the Dubai Department of Economy and Tourism (DET), we are a fully registered Limited Liability Company (LLC). Our certified, background-checked technicians bring extensive experience in <Link to="/services/ac-cleaning" className="text-accent hover:underline font-medium">AC cleaning & duct sanitization</Link>, <Link to="/services/plumbing" className="text-accent hover:underline font-medium">plumbing & leak detection</Link>, <Link to="/services/electrical" className="text-accent hover:underline font-medium">electrical fittings & safety inspections</Link>, <Link to="/services/painting" className="text-accent hover:underline font-medium">interior & exterior painting</Link>, <Link to="/services/building-cleaning" className="text-accent hover:underline font-medium">deep building cleaning</Link>, <Link to="/services/tiling" className="text-accent hover:underline font-medium">floor & wall tiling</Link>, and general handyman work.
            </p>
            <p>
              Whether you reside in a luxury villa in Palm Jumeirah, Emirates Hills, or Arabian Ranches, or an apartment in Dubai Marina, JVC, Downtown, or Deira — our team delivers fast, reliable, and standardized service 7 days a week.
            </p>
          </div>
        </FadeIn>

        {/* Trade License Certification Card */}
        <FadeIn delay={100} className="my-12 p-8 rounded-2xl bg-accent/5 border border-accent/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
              Verified Legal Registration
            </span>
            <h3 className="text-xl font-bold font-['Montserrat'] text-foreground">
              Trade License No. 1571076 — Dubai DET
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Registered Commercial License Entity: MUHAMMAD AFNAN RESIDENTIAL PROPERTY CARE SERVICES L.L.C. Fully insured and compliant with UAE laws.
            </p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 px-6 py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:brightness-110 transition-all shadow-gold text-sm inline-flex items-center gap-2"
          >
            Verify & Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </FadeIn>

        {/* Our Core Values */}
        <FadeIn delay={100} className="mt-16">
          <h2 className="text-3xl font-bold font-['Montserrat'] text-foreground mb-6">
            Why Property Owners Trust Afnan Property Care
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: "Licensed LLC & Insured", desc: "Trade License #1571076. Full liability insurance for total property safety." },
              { title: "DEWA-Certified Engineers", desc: "Trained professionals following strict UAE engineering and electrical codes." },
              { title: "Upfront Fixed Pricing", desc: "Transparent quotes provided before work starts. Zero hidden fees." },
              { title: "Same-Day Emergency Service", desc: "Technicians available 24/7 across all Dubai communities with fast arrival." },
              { title: "Premium Tools & Materials", desc: "We use only original spare parts, Jotun paints, and medical-grade sanitizers." },
              { title: "100% Workmanship Guarantee", desc: "All our repairs and installations come with a service warranty." }
            ].map((v) => <div key={v.title} className="p-6 rounded-xl border border-border bg-card hover:border-accent/30 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                <h3 className="font-bold font-['Montserrat'] text-foreground">{v.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>)}
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={100} className="mt-16 text-center pt-10 border-t border-border">
          <h3 className="text-2xl font-bold font-['Montserrat'] text-foreground mb-3">
            Need Reliable Maintenance in Dubai?
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm">
            Contact Afnan Property Care today for a free site inspection or instant quotation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-md bg-accent text-accent-foreground font-semibold hover:brightness-110 transition-all shadow-gold text-sm inline-flex items-center gap-2"
            >
              Get Free Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+971505387736"
              className="px-6 py-3 rounded-md border border-border text-foreground font-semibold hover:bg-accent/5 transition-all text-sm inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-accent" /> Call +971-505387736
            </a>
          </div>
        </FadeIn>
      </div>
    </section>

    <Footer />
  </div>;
};

export default About;
