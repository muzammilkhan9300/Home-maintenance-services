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
const Services = () => <div className="min-h-screen bg-background">
  <SEO
    title="Our Services | AC, Plumbing, Electrical & More"
    description="Explore our complete range of home maintenance services in Dubai including AC servicing, plumbing repairs, painting, and landscaping."
    canonicalUrl="/services"
  />
  <Navbar />

  <section className="pt-28 pb-16 bg-navy text-primary-foreground">
    <div className="container mx-auto px-4 lg:px-8">
      <motion.div initial="hidden" animate="visible">
        <motion.span variants={fadeUp} custom={0} className="text-gold text-sm font-semibold tracking-wider uppercase">
          Our Services
        </motion.span>
        <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold mt-2 font-['Montserrat']">
          Complete Property Care Solutions
        </motion.h1>
        <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/70 mt-4 max-w-xl text-lg">
          From AC maintenance to landscaping, we cover every aspect of residential property care in Dubai.
        </motion.p>
      </motion.div>
    </div>
  </section>

  <section className="py-20">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="space-y-20">
        {services.map((s, i) => {
          const Icon = iconMap[s.icon] || Wrench;
          const isEven = i % 2 === 0;
          return <motion.div
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
                <img src={s.image} alt={s.title} className="w-full h-72 lg:h-80 object-cover" loading="lazy" />
              </div>
            </div>
            <div className={`${!isEven ? "lg:order-1" : ""}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-md bg-accent/15 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-2xl font-bold font-['Montserrat'] text-foreground">{s.title}</h2>
              </div>
              <p className="text-muted-foreground mb-5">{s.description}</p>
              <ul className="space-y-2 mb-6">
                {s.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                  <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                  {f}
                </li>)}
              </ul>
              <Link
                to={`/contact?service=${s.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-accent text-accent-foreground font-semibold hover:brightness-110 transition-all shadow-gold text-sm"
              >
                Book This Service <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>;
        })}
      </div>
    </div>
  </section>

  <Footer />
</div>;
export default Services;
