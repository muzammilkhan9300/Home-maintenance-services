import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, CheckCircle, Clock, Shield } from "lucide-react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { services } from "@/data/services";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { trackLead } from "@/lib/analytics";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(20),
  service: z.string().min(1, "Please select a service"),
  message: z.string().trim().min(1, "Message is required").max(2e3)
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 }
  })
};

const Contact = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: searchParams.get("service") || "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const svc = searchParams.get("service");
    if (svc) setForm((f) => ({ ...f, service: svc }));
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e2) => ({ ...e2, [name]: void 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    try {
      const apiEndpoint = import.meta.env.PROD
        ? "/api/contact"
        : "http://localhost:5000/api/contact";

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitted(true);
      trackLead({
        name: result.data.name,
        email: result.data.email,
        service: result.data.service
      });
      toast({ title: "Request sent!", description: "We'll get back to you shortly." });
    } catch (error) {
      console.error("Contact form error:", error);
      toast({ title: "Failed to send", description: "Please try again or call us directly.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors";

  return <div className="min-h-screen bg-background">
    <SEO
      title="Contact Afnan Property Care | Book Home Maintenance Dubai"
      description="Contact Afnan Property Care to book home maintenance in Dubai. AC, plumbing, electrical & more. Licensed LLC (Trade License #1571076). Call +971-505387736!"
      keywords="contact afnan property care, book home maintenance dubai, free quote dubai, AC repair booking dubai, plumbing service dubai contact, electrical service contact dubai"
      canonicalUrl="/contact"
      robots="index, follow, max-image-preview:large"
      themeColor="#0F6CBD"
      pageType="contact"
      ogTitle="Contact Afnan Property Care | Book Property Maintenance Dubai"
      ogDescription="Get a free quote or book same-day AC, plumbing, electrical & maintenance services across Dubai. Licensed LLC, Trade License #1571076."
      ogImage="https://maresidentialpropertycareservicellc.com/og-image.jpg"
      twitterTitle="Contact Afnan Property Care | Book Home Maintenance Dubai"
      twitterDescription="Book property maintenance services in Dubai. Licensed company, certified technicians, available 24/7."
      twitterImage="https://maresidentialpropertycareservicellc.com/og-image.jpg"
    />
    <Navbar />

    {/* Hero Header */}
    <section className="pt-28 pb-16 bg-navy text-primary-foreground" aria-label="Contact Us Header">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial="hidden" animate="visible">
          <motion.span variants={fadeUp} custom={0} className="text-gold text-sm font-semibold tracking-wider uppercase">
            Get In Touch
          </motion.span>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold mt-2 font-['Montserrat']">
            Contact Us — Book Home Maintenance in Dubai
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/70 mt-4 max-w-xl text-lg">
            Request a free quote or schedule a site visit. Our team responds within 30 minutes — available 24/7 for emergency callouts.
          </motion.p>
        </motion.div>
      </div>
    </section>

    <section className="py-20" aria-label="Contact Form and Details">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Info Side Panel */}
          <div className="space-y-8" itemscope itemtype="https://schema.org/LocalBusiness">
            <div>
              <h2 className="text-xl font-bold font-['Montserrat'] text-foreground mb-4">
                Office Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground" itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
                    <span itemprop="streetAddress">Rolex Twin Tower, 33 Baniyas Rd, Al Rigga, Deira</span>,{" "}
                    <span itemprop="addressLocality">Dubai</span>, <span itemprop="addressCountry">UAE</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-accent shrink-0" />
                  <a href="tel:+971505387736" className="text-sm text-muted-foreground hover:text-accent font-medium" itemprop="telephone">
                    +971-505387736
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-accent shrink-0" />
                  <a href="mailto:info@maresidentialpropertycareservicellc.com" className="text-sm text-muted-foreground hover:text-accent font-medium" itemprop="email">
                    info@maresidentialpropertycareservicellc.com
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold font-['Montserrat'] text-foreground mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" /> Working Hours
              </h2>
              <p className="text-sm text-muted-foreground">Monday – Saturday: 9:00 AM – 6:00 PM</p>
              <p className="text-sm text-muted-foreground">Sunday: Emergency Services Only</p>
              <p className="text-sm text-accent font-semibold mt-2">⚡ 24/7 Emergency Response Active</p>
            </div>

            <div className="p-5 rounded-lg bg-gold-light border border-accent/20">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-accent shrink-0" />
                <p className="text-sm font-bold text-foreground font-['Montserrat']">Trade License No. 1571076</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                MUHAMMAD AFNAN RESIDENTIAL PROPERTY CARE SERVICES L.L.C — Licensed by Dubai DET. Fully insured & DEWA-compliant.
              </p>
            </div>

            {/* Embedded Map */}
            <div className="rounded-xl overflow-hidden border border-border shadow-sm">
              <iframe
                title="Afnan Property Care Location — Rolex Twin Tower Dubai"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d16178401.047389235!2d43.20972260441566!3d23.67500795662452!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f4307195fe9cf%3A0x8296ae4aaa9acb14!2sAfnan%20Property%20Care%20Services%20LLC!5e0!3m2!1sen!2s!4v1786377585483!5m2!1sen!2s"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-accent/5 border border-accent/20 rounded-2xl p-8"
            >
              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold font-['Montserrat'] text-foreground">Quote Request Received!</h2>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Thank you for contacting Afnan Property Care. Our Dubai service coordinator will call you back within 30 minutes.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-sm text-accent hover:underline font-semibold"
              >
                Send another message
              </button>
            </motion.div> : <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-2xl font-bold font-['Montserrat'] text-foreground mb-4">
                Request a Free Quote
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="Your full name" />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="your@email.com" />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+971-505387736" />
                  {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Service Required *</label>
                  <select name="service" value={form.service} onChange={handleChange} className={inputClass}>
                    <option value="">Select a service</option>
                    {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                  {errors.service && <p className="text-xs text-destructive mt-1">{errors.service}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Your Property & Requirements *</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={5} className={inputClass} placeholder="Describe your property (villa/apartment, location in Dubai, issue description)..." />
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
              </div>
              <button
                type="submit"
                id="submit-contact-form"
                disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-accent text-accent-foreground font-semibold hover:brightness-110 transition-all shadow-gold disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {loading ? "Sending Quote Request..." : "Send Free Quote Request"}
              </button>
            </form>}
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>;
};

export default Contact;
