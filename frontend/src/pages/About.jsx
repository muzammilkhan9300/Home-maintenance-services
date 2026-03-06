import { motion } from "framer-motion";
import { Award, Users, Calendar, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 }
  })
};
const About = () => {
  const stats = [
    { icon: Calendar, value: "2024", label: "Established" },
    { icon: Users, value: "500+", label: "Happy Clients" },
    { icon: Award, value: "1571076", label: "Trade License" },
    { icon: Shield, value: "100%", label: "Satisfaction" }
  ];
  return <div className="min-h-screen bg-background">
    <SEO
      title="About Us | Trusted Property Care"
      description="Learn about Afnan Property Care, a licensed Dubai DET property maintenance LLC dedicated to premium residential services."
      canonicalUrl="/about"
    />
    <Navbar />

    {
      /* Hero */
    }
    <section className="pt-28 pb-16 bg-navy text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial="hidden" animate="visible" className="max-w-2xl">
          <motion.span variants={fadeUp} custom={0} className="text-gold text-sm font-semibold tracking-wider uppercase">
            About Us
          </motion.span>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold mt-2 font-['Montserrat']">
            Your Trusted Property Care Partner in Dubai
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/70 mt-4 text-lg">
            Muhammad Afnan Residential Property Care Services L.L.C is a licensed and insured property maintenance company based in Dubai, UAE.
          </motion.p>
        </motion.div>
      </div>
    </section>

    {
      /* Stats */
    }
    <section className="py-12 bg-gold-light">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => <motion.div
            key={s.label}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i}
            className="text-center"
          >
            <s.icon className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold font-['Montserrat'] text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </motion.div>)}
        </div>
      </div>
    </section>

    {
      /* Story */
    }
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold font-['Montserrat'] text-foreground mb-6">
            Our Story
          </motion.h2>
          <motion.div variants={fadeUp} custom={1} className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Founded in Dubai, Muhammad Afnan Residential Property Care Services L.L.C was established with a clear mission: to provide premium-quality home maintenance services to residential properties across the emirate.
            </p>
            <p>
              Operating under <strong className="text-foreground">Trade License No. 1571076</strong>, we are a fully compliant and licensed LLC in the Dubai Department of Economy and Tourism. Our team of certified technicians brings years of experience across AC maintenance, plumbing, electrical work, landscaping, painting, and general handyman services.
            </p>
            <p>
              We believe that every home deserves professional care. Whether it's a luxury villa in Emirates Hills or an apartment in Downtown Dubai, our services are tailored to meet the highest standards of quality and reliability.
            </p>
            <p>
              Our commitment to transparent pricing, punctual service delivery, and customer satisfaction has made us a trusted name among homeowners, property managers, and real estate companies across Dubai.
            </p>
          </motion.div>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16">
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold font-['Montserrat'] text-foreground mb-6">
            Our Values
          </motion.h2>
          <motion.div variants={fadeUp} custom={1} className="grid sm:grid-cols-2 gap-6">
            {[
              { title: "Quality First", desc: "We never compromise on materials or workmanship." },
              { title: "Reliability", desc: "On time, every time. We respect your schedule." },
              { title: "Transparency", desc: "Clear pricing upfront with no hidden charges." },
              { title: "Safety", desc: "All work complies with UAE safety regulations." }
            ].map((v) => <div key={v.title} className="p-5 rounded-lg border border-border bg-muted/30">
              <h3 className="font-bold font-['Montserrat'] text-foreground mb-1">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>)}
          </motion.div>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>;
};
export default About;
