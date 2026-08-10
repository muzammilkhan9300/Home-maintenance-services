import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { services } from "@/data/services";
import { Link } from "react-router-dom";
import { ArrowRight, Snowflake, Droplets, Zap, TreePine, Paintbrush, Wrench, CheckCircle, Fan, Sparkles, Droplet, LayoutGrid, Home, Server, BrickWall } from "lucide-react";
import SEO from "@/components/SEO";

const iconMap = {
  Snowflake,
  Droplets,
  Zap,
  TreePine,
  Paintbrush,
  Wrench,
  Fan,
  Sparkles,
  Droplet,
  LayoutGrid,
  Home,
  Server,
  BrickWall
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 }
  })
};

const Services = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Home Maintenance Services Dubai | Afnan Property Care"
      description="Browse all residential property maintenance services in Dubai — AC cleaning, plumbing repairs, electrical fittings, painting, tiling & more. Licensed LLC."
      keywords="home maintenance services dubai, AC cleaning dubai, plumbing services dubai, electrical services dubai, painting dubai, tiling dubai, property care dubai, villa maintenance"
      canonicalUrl="/services"
      robots="index, follow, max-image-preview:large"
      themeColor="#0F6CBD"
      pageType="services-list"
      serviceList={services}
      ogTitle="Home Maintenance Services Dubai | Afnan Property Care"
      ogDescription="AC cleaning, plumbing, electrical, painting, tiling & more. Professional property maintenance services across all Dubai areas. Licensed LLC, certified technicians."
      ogImage="https://maresidentialpropertycareservicellc.com/og-image.jpg"
      twitterTitle="Home Maintenance Services Dubai | Afnan Property Care"
      twitterDescription="Explore our full suite of Dubai residential maintenance services. Licensed LLC, Trade License #1571076."
      twitterImage="https://maresidentialpropertycareservicellc.com/og-image.jpg"
    />
    <Navbar />

    {/* Hero Header */}
    <section className="pt-28 pb-16 bg-navy text-primary-foreground" aria-label="Services Page Hero">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial="hidden" animate="visible">
          <motion.span variants={fadeUp} custom={0} className="text-gold text-sm font-semibold tracking-wider uppercase">
            Our Services in Dubai
          </motion.span>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold mt-2 font-['Montserrat']">
            Complete Home Maintenance Services in Dubai
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/70 mt-4 max-w-xl text-lg">
            From AC deep cleaning to plumbing, electrical fittings, and full property care — we maintain villas and apartments across Dubai.
          </motion.p>
        </motion.div>
      </div>
    </section>

    {/* Services Listing */}
    <section className="py-20" aria-label="Services Catalog">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="space-y-20">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon] || Wrench;
            const isEven = i % 2 === 0;
            return <motion.article
              key={s.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className={`grid lg:grid-cols-2 gap-10 items-center ${!isEven ? "lg:direction-rtl" : ""}`}
            >
              <div className={`${!isEven ? "lg:order-2" : ""}`}>
                <div className="rounded-lg overflow-hidden shadow-premium">
                  <img
                    src={s.image}
                    alt={`${s.title} service in Dubai by Afnan Property Care`}
                    className="w-full h-72 lg:h-80 object-cover"
                    loading="lazy"
                    width="600"
                    height="400"
                  />
                </div>
              </div>
              <div className={`${!isEven ? "lg:order-1" : ""}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-md bg-accent/15 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold font-['Montserrat'] text-foreground">
                    {s.title} in Dubai
                  </h2>
                </div>
                <p className="text-muted-foreground mb-5 leading-relaxed">{s.description}</p>
                <ul className="space-y-2 mb-6">
                  {s.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                    <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                    {f}
                  </li>)}
                </ul>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to={`/contact?service=${s.id}`}
                    id={`book-service-btn-${s.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-accent text-accent-foreground font-semibold hover:brightness-110 transition-all shadow-gold text-sm"
                  >
                    Book This Service <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/services/${s.id}`}
                    id={`view-details-btn-${s.id}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-accent/30 text-accent font-semibold hover:bg-accent/5 transition-all text-sm"
                  >
                    View Full Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.article>;
          })}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Services;
