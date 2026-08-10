import ServiceLandingTemplate from "@/components/ServiceLandingTemplate";
import {
  Zap, Sparkles, Shield, Clock, BrickWall, Wrench,
  Tag, Package, Filter, Fan
} from "lucide-react";
import serviceElectrical from "@/assets/real_electrical_fittings.webp";

const WARNING_SIGNS = [
  { icon: Zap,       title: "Frequent Tripping",   desc: "Circuit breakers tripping repeatedly — a sign of overloaded or faulty electrical circuits." },
  { icon: Sparkles,  title: "Flickering Lights",   desc: "Lights flickering or dimming unexpectedly, indicating a loose connection or failing component." },
  { icon: Shield,    title: "Burning Smell",        desc: "A burning or plastic smell from outlets or switches — a serious fire hazard that requires urgent attention." },
  { icon: Wrench,    title: "Outdated DB Board",    desc: "Old fuse-based distribution board that can't safely handle modern power loads and appliances." },
  { icon: Clock,     title: "Hot Switch Plates",    desc: "Outlets or switch plates that feel warm to the touch — dangerously abnormal and a fire risk." },
  { icon: BrickWall, title: "No Earthing System",   desc: "Absence of proper earthing can cause severe electric shock risks throughout the entire property." },
];

const INCLUDED_SERVICES = [
  { icon: Zap,     title: "DB Board Upgrade & Repair",  desc: "Upgrading old fuse-based panels to modern MCB/RCCB distribution boards for safety and capacity." },
  { icon: Package, title: "Wiring & Rewiring",          desc: "Full residential wiring and rewiring services to UAE standards with DEWA-compliant documentation." },
  { icon: Sparkles,title: "Lighting Installation",      desc: "LED downlights, smart dimmer switches, feature lighting, and outdoor security light installation." },
  { icon: Filter,  title: "Fault Finding & Repair",     desc: "Advanced diagnostic testing to pinpoint and permanently fix intermittent or hidden electrical faults." },
];

const PROCESS_STEPS = [
  { num: "01", title: "Step 1: Report the Issue",     desc: "Call or message us describing the problem. We advise immediately and dispatch within the hour." },
  { num: "02", title: "Step 2: Technician Dispatch",  desc: "A certified DEWA-licensed electrician arrives with full tools and professional testing equipment." },
  { num: "03", title: "Step 3: Diagnosis & Quote",    desc: "Fault is identified and clearly explained to you with a fixed price before any work begins." },
  { num: "04", title: "Step 4: Safe Repair Executed", desc: "Work completed safely and efficiently using DEWA-approved materials and techniques." },
  { num: "05", title: "Step 5: Testing & Certificate", desc: "All circuits tested and documented. DEWA-compliant completion certificate issued upon handover." },
];

const REVIEWS = [
  { name: "Abdullah Al Farsi",  area: "Dubai Marina",  review: "Called at 10pm with a complete power outage. The electrician arrived within 45 minutes and had everything fixed within the hour. Exceptional emergency service." },
  { name: "Rachel Cooper",      area: "DIFC",          review: "Professional DB board upgrade completed without any disruption. The team was neat, explained everything clearly, and the price was exactly as quoted. Highly recommend." },
  { name: "Vikram Sharma",      area: "Mirdif",        review: "Had a persistent tripping issue no one could solve. Afnan's electrician found the fault in 20 minutes. Quality work and very fair pricing." },
];

const FAQS = [
  { q: "Are your electricians DEWA-certified?",           a: "Yes. All our electricians hold valid DEWA contractor licenses and follow UAE wiring standards (BS 7671 as adopted in Dubai). All work is fully documented." },
  { q: "Can you upgrade my distribution board?",          a: "Absolutely. We upgrade older fuse-based systems to modern MCB/RCCB boards for better safety, capacity, and compliance with current UAE electrical codes." },
  { q: "Do you handle smart home electrical work?",       a: "Yes — including smart switches, automated lighting, EV charger installation, home automation wiring, and smart panel integration for villas and apartments." },
  { q: "What are signs I need rewiring?",                 a: "Frequent circuit trips, flickering lights, burning smell from sockets, or a property over 20 years old are all serious warning signs requiring immediate inspection." },
  { q: "Do you provide 24/7 emergency electrical service?", a: "Yes. We provide round-the-clock emergency electrical response across all Dubai areas with a guaranteed on-site arrival within 60 minutes for urgent faults." },
  { q: "How long does a full rewiring take?",             a: "A standard 2-bedroom apartment rewiring takes 2–3 days depending on size and access. We work room by room to minimize disruption to your daily routine." },
  { q: "Can you fix outdoor and garden lighting?",        a: "Yes. We install and repair all outdoor lighting including garden lights, security floodlights, pool lighting, and DEWA-compliant external power outlets." },
];

const FLOATING_CARDS = [
  { icon: Tag,    label: "Starting Price",  value: "AED 199",       colorClass: "bg-gold/15 text-gold",           valueClass: "text-gold" },
  { icon: Zap,    label: "Emergency",       value: "24/7 Response", colorClass: "bg-[#22c55e]/15 text-[#22c55e]", valueClass: "text-slate-900" },
  { icon: Shield, label: "DEWA",            value: "Certified",     colorClass: "bg-gold/15 text-gold",           valueClass: "text-slate-900" },
];

const INTERNAL_LINKS = [
  { to: "/services/plumbing",          emoji: "🚿", label: "emergency plumbing services Dubai" },
  { to: "/services/systems-maintenance", emoji: "📡", label: "CCTV and smart home systems Dubai" },
  { to: "/services/ac-cleaning",       emoji: "❄️", label: "professional AC cleaning Dubai" },
];

const ElectricalLanding = () => (
  <ServiceLandingTemplate
    seo={{
      title: "Electrical Repair Services Dubai | Afnan Property Care",
      description: "Licensed electricians in Dubai for DB board upgrades, wiring, fault finding & emergency electrical repairs. DEWA-certified, 24/7 emergency. Call now for a free quote!",
      keywords: "electrician Dubai, electrical repair Dubai, DEWA certified electrician Dubai, DB board upgrade Dubai, electrical wiring Dubai, emergency electrician Dubai, residential electrician Dubai, electrical fault Dubai, lighting installation Dubai",
      canonicalUrl: "/services/electrical",
      ogImage: "https://maresidentialpropertycareservicellc.com/og-images/electrical-dubai.jpg",
    }}
    heroImage={serviceElectrical}
    h1Plain="Certified Electrical"
    h1Gradient="Repair Services Dubai"
    heroTag="24/7 Emergency Electricians Available"
    heroSubtitle="DEWA-Certified Electrical Services for Villas, Apartments & Commercial Buildings"
    heroDesc="Safe, compliant, and reliable electrical repairs handled by DEWA-licensed technicians — from DB board upgrades to full rewiring."
    heroBadges={["24/7 Emergency", "DEWA Certified", "Licensed LLC", "All Dubai Areas"]}
    floatingCards={FLOATING_CARDS}
    warningSigns={WARNING_SIGNS}
    warningTitle="Is Your Electrical System Showing These Warning Signs?"
    warningSubtitle="Don't ignore electrical issues — they're fire hazards. If you notice any of these, call our DEWA-certified electricians immediately."
    beforeAfter={{
      title: "Before vs After Electrical Service",
      subtitle: "See the difference our certified electrical services make for Dubai properties.",
      before: ["Frequent power trips and outages", "Flickering lights and dead sockets", "Outdated, unsafe wiring throughout", "No safety certifications or earthing"],
      after: ["Stable, reliable power throughout", "Fully functional lighting & outlets", "Safe, up-to-code electrical system", "DEWA-certified and fully documented"],
    }}
    includedServices={INCLUDED_SERVICES}
    includedTitle="Complete Electrical Services in Dubai"
    includedSubtitle="DEWA-licensed electricians handling everything from fault finding to full installations — safely, efficiently, and on schedule."
    processSteps={PROCESS_STEPS}
    processTitle="Our 5-Step Professional Electrical Service Process"
    processSubtitle="From emergency response to planned installations — every job handled safely and professionally."
    stats={[["3,000+", "Electrical Jobs Done"], ["4.9★", "Customer Rating"], ["<1 Hr", "Emergency Response"], ["100%", "DEWA Compliant"]]}
    reviews={REVIEWS}
    faqs={FAQS}
    faqTitle="Frequently Asked Questions About Electrical Services in Dubai"
    faqSubtitle="Direct answers to common questions about our residential and emergency electrical repair services."
    serviceSlug="electrical"
    serviceName="Electrical"
    ctaHeading="Electrical Problem? Call Now."
    ctaSubtitle="DEWA-certified electricians dispatched anywhere in Dubai — 24 hours, 7 days a week."
    formUnitLabel="Type of Electrical Work"
    formUnitOptions={[
      { value: "Fault Finding",   label: "Fault Finding / Tripping" },
      { value: "Rewiring",        label: "Wiring / Rewiring" },
      { value: "DB Upgrade",      label: "DB Board Upgrade" },
      { value: "Lighting",        label: "Lighting Installation" },
      { value: "Emergency",       label: "Emergency Callout" },
      { value: "Smart Home",      label: "Smart Home / EV Charger" },
    ]}
    internalLinks={INTERNAL_LINKS}
  />
);

export default ElectricalLanding;
