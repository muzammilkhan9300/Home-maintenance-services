import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, CheckCircle } from "lucide-react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { services } from "@/data/services";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

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
      // Use proxy or relative path for deployment instead of hardcoded localhost
      const apiEndpoint = import.meta.env.PROD
        ? "/api/contact" // Assumes backend runs on same domain via reverse proxy or subfolder
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
      title="Contact Us | Book a Service in Dubai"
      description="Get in touch with Afnan Property Care. Request a free quote or book an AC, plumbing, electrical, or handyman service. Available 24/7."
      canonicalUrl="/contact"
    />
    <Navbar />

    <section className="pt-28 pb-16 bg-navy text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial="hidden" animate="visible">
          <motion.span variants={fadeUp} custom={0} className="text-gold text-sm font-semibold tracking-wider uppercase">
            Contact Us
          </motion.span>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold mt-2 font-['Montserrat']">
            Get in Touch
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/70 mt-4 max-w-xl text-lg">
            Request a free quote or book a service. We'll respond within 24 hours.
          </motion.p>
        </motion.div>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {
            /* Info */
          }
          <div className="space-y-8">
            <div>
              <h3 className="font-bold font-['Montserrat'] text-foreground mb-4">Contact Information</h3>
              <div className="space-y-4">
                {[
                  { icon: MapPin, text: "Rolex Twin Tower - 33 Baniyas Rd - Al Rigga - Deira - Dubai" },
                  { icon: Phone, text: "+971-504200736" },
                  { icon: Mail, text: "info@maresidentialpropertycareservicellc.com" }
                ].map((c) => <div key={c.text} className="flex items-center gap-3">
                  <c.icon className="w-5 h-5 text-accent shrink-0" />
                  <span className="text-sm text-muted-foreground">{c.text}</span>
                </div>)}
              </div>
            </div>
            <div>
              <h3 className="font-bold font-['Montserrat'] text-foreground mb-2">Working Hours</h3>
              <p className="text-sm text-muted-foreground">Monday – Saturday: 9 AM – 5 PM</p>
              <p className="text-sm text-muted-foreground">Sunday: Closed</p>
              <p className="text-sm text-muted-foreground mt-1">Emergency services available 24/7</p>
            </div>
            <div className="p-5 rounded-lg bg-gold-light border border-accent/20">
              <p className="text-sm font-medium text-foreground">Trade License No. 1571076</p>
              <p className="text-xs text-muted-foreground mt-1">
                Muhammad Afnan Residential Property Care Services L.L.C — Licensed by Dubai DET
              </p>
            </div>
          </div>

          {
            /* Form */
          }
          <div className="lg:col-span-2">
            {submitted ? <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold font-['Montserrat'] text-foreground">Thank You!</h3>
              <p className="text-muted-foreground mt-2">Your request has been submitted. We'll contact you within 24 hours.</p>
            </motion.div> : <form onSubmit={handleSubmit} className="space-y-5">
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
                  <label className="block text-sm font-medium text-foreground mb-1.5">Phone *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+971-504200736" />
                  {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Service *</label>
                  <select name="service" value={form.service} onChange={handleChange} className={inputClass}>
                    <option value="">Select a service</option>
                    {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                  {errors.service && <p className="text-xs text-destructive mt-1">{errors.service}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={5} className={inputClass} placeholder="Describe your requirements..." />
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-accent text-accent-foreground font-semibold hover:brightness-110 transition-all shadow-gold disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {loading ? "Sending..." : "Send Request"}
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
