import ServiceLandingTemplate from "@/components/ServiceLandingTemplate";
import {
  Droplets, Wrench, Zap, BrickWall, Clock, Shield,
  Tag, Package, Filter, Fan
} from "lucide-react";
import servicePlumbing from "@/assets/real_plumbing_sanitary.webp";

const WARNING_SIGNS = [
  { icon: Droplets,  title: "Dripping Faucets",    desc: "Constant dripping wastes hundreds of liters daily and significantly inflates your DEWA water bill." },
  { icon: Wrench,    title: "Slow Drains",          desc: "Sinks, showers, or bathtubs draining very slowly — a clear sign of a developing blockage or buildup." },
  { icon: Zap,       title: "Low Water Pressure",   desc: "Weak water flow from taps or showerheads affecting your daily comfort and property functionality." },
  { icon: BrickWall, title: "Wall Water Stains",    desc: "Yellow or brown wall stains indicating a concealed, ongoing pipe leak behind your walls or ceiling." },
  { icon: Clock,     title: "Running Toilet",       desc: "Toilet that keeps running after flushing — silently wasting thousands of liters every month." },
  { icon: Shield,    title: "No Hot Water",         desc: "Water heater failure suddenly leaving your household or business without reliable hot water." },
];

const INCLUDED_SERVICES = [
  { icon: Droplets, title: "Leak Detection & Repair",     desc: "Acoustic and thermal imaging to locate hidden leaks without unnecessary wall demolition." },
  { icon: Package,  title: "Water Heater Services",       desc: "Repair and replacement of all water heater types — instant, storage, and solar systems." },
  { icon: Wrench,   title: "Drain Unblocking",            desc: "Hydro-jetting equipment to clear stubborn blockages from drains, grease traps, and sewer lines." },
  { icon: Filter,   title: "Bathroom & Kitchen Fixtures", desc: "Full installation of taps, showers, toilets, vanity units, and kitchen sink assemblies." },
];

const PROCESS_STEPS = [
  { num: "01", title: "Step 1: Describe the Problem",   desc: "Call or WhatsApp us — describe the issue and we'll estimate cost on the spot within minutes." },
  { num: "02", title: "Step 2: Plumber Dispatched",     desc: "A certified plumber arrives with full equipment and testing tools — within 60 minutes for emergencies." },
  { num: "03", title: "Step 3: Inspection & Fixed Quote", desc: "Plumber inspects the issue and provides a fixed written quote before any work begins." },
  { num: "04", title: "Step 4: Repair or Installation", desc: "Work completed using quality UAE-approved fittings from trusted local suppliers." },
  { num: "05", title: "Step 5: Pressure Test & Sign-Off", desc: "All pipes pressure-tested for leaks. Area fully cleaned up. Job signed off with guarantee." },
];

const REVIEWS = [
  { name: "Mohammed Al Zarouni", area: "JLT",           review: "Burst pipe at 2am and they arrived in under an hour. Professional, efficient, and the price was very fair for an emergency callout. Will always use them." },
  { name: "Anna Kowalski",       area: "Palm Jumeirah",  review: "Had a hidden leak inside our wall they found without any major demolition. Fixed perfectly and no mess left behind. Highly skilled team." },
  { name: "Suresh Pillai",       area: "Bur Dubai",      review: "Full bathroom fixture replacement done in one day. All new taps, shower head and toilet installed properly. Excellent workmanship and very clean." },
];

const FAQS = [
  { q: "Do you fix water heater issues?",              a: "Yes. We repair and replace all types of water heaters including instant, storage, and solar water heaters. We carry stock of common sizes for same-day replacement." },
  { q: "Can you detect concealed water leaks?",        a: "Yes. We use acoustic leak detectors and thermal imaging to locate hidden leaks within walls and floors without unnecessary demolition or tile breakage." },
  { q: "How quickly can you respond to a burst pipe?", a: "We guarantee to be on-site within 60 minutes for emergency plumbing anywhere in Dubai — 24 hours a day, 7 days a week, including weekends and public holidays." },
  { q: "Do you install bathroom fixtures?",            a: "Absolutely. From taps and showers to full bathroom renovations including toilet replacement, vanity installation, shower tray fitting, and complete bathroom setups." },
  { q: "What warranty do you offer on plumbing repairs?", a: "All our plumbing repairs come with a 90-day workmanship warranty. If the same issue recurs within 90 days, we fix it at no additional charge." },
  { q: "Can you fix low water pressure?",              a: "Yes. We diagnose the cause — which could be a blocked aerator, pressure regulator fault, partially closed valve, or pipe scale buildup — and fix it correctly." },
  { q: "Do you unblock drainage systems?",             a: "Yes. We use professional hydro-jetting equipment to clear all types of blockages including grease buildup, tree roots, scale deposits, and solid waste accumulation." },
];

const FLOATING_CARDS = [
  { icon: Tag,     label: "Starting Price",  value: "AED 149",        colorClass: "bg-gold/15 text-gold",           valueClass: "text-gold" },
  { icon: Zap,     label: "Emergency",       value: "60-Min Response", colorClass: "bg-[#22c55e]/15 text-[#22c55e]", valueClass: "text-slate-900" },
  { icon: Shield,  label: "90-Day",          value: "Guarantee",       colorClass: "bg-gold/15 text-gold",           valueClass: "text-slate-900" },
];

const INTERNAL_LINKS = [
  { to: "/services/sanitary-pipes", emoji: "🔧", label: "sanitary installation and pipe repair Dubai" },
  { to: "/services/electrical",     emoji: "⚡", label: "certified electrical repair services Dubai" },
  { to: "/services/ac-cleaning",    emoji: "❄️", label: "professional AC cleaning service Dubai" },
];

const PlumbingLanding = () => (
  <ServiceLandingTemplate
    seo={{
      title: "Plumbing Services Dubai | Emergency Plumber | Afnan",
      description: "Expert plumber in Dubai for leak detection, drain unblocking, water heater repair & emergency plumbing. 60-min response, 90-day guarantee. Licensed LLC. Call now!",
      keywords: "plumber Dubai, plumbing services Dubai, emergency plumber Dubai, leak detection Dubai, drain unblocking Dubai, water heater repair Dubai, pipe repair Dubai, bathroom plumbing Dubai, plumbing company Dubai",
      canonicalUrl: "/services/plumbing",
      ogImage: "https://maresidentialpropertycareservicellc.com/og-images/plumbing-dubai.jpg",
    }}
    heroImage={servicePlumbing}
    h1Plain="Professional Plumbing"
    h1Gradient="Services in Dubai"
    heroTag="Emergency Plumbers Available 24/7"
    heroSubtitle="Expert Plumbing Solutions for Villas, Apartments & Commercial Properties"
    heroDesc="From dripping faucets to burst pipes — certified plumbers dispatched anywhere in Dubai within 60 minutes with a 90-day workmanship guarantee."
    heroBadges={["60-Min Emergency", "Licensed LLC", "90-Day Guarantee", "All Dubai Areas"]}
    floatingCards={FLOATING_CARDS}
    warningSigns={WARNING_SIGNS}
    warningTitle="Is Your Plumbing Showing These Problems?"
    warningSubtitle="Don't let plumbing issues escalate — every drip and slow drain costs you money. Call our certified Dubai plumbers today."
    beforeAfter={{
      title: "Before vs After Our Plumbing Service",
      subtitle: "See the difference our professional plumbing service makes to Dubai properties.",
      before: ["Dripping taps wasting water all day", "Slow, smelly, blocked drains", "Low water pressure in all areas", "Concealed leaks damaging walls & floors"],
      after: ["All taps sealed, zero water wastage", "Free-flowing, odor-free drains", "Full water pressure fully restored", "Leaks fixed with 90-day guarantee"],
    }}
    includedServices={INCLUDED_SERVICES}
    includedTitle="Complete Plumbing Services in Dubai"
    includedSubtitle="Certified plumbers handling all residential and commercial plumbing needs — repairs, installations, and emergency callouts."
    processSteps={PROCESS_STEPS}
    processTitle="Our 5-Step Professional Plumbing Process"
    processSubtitle="Fast, clean, and guaranteed plumbing repairs — from emergency response to full bathroom installations."
    stats={[["5,000+", "Leaks Fixed"], ["4.8★", "Customer Rating"], ["<60 Min", "Emergency Response"], ["90 Days", "Warranty"]]}
    reviews={REVIEWS}
    faqs={FAQS}
    faqTitle="Frequently Asked Questions About Plumbing Services in Dubai"
    faqSubtitle="Direct answers to the most common plumbing questions from Dubai homeowners and property managers."
    serviceSlug="plumbing"
    serviceName="Plumbing"
    ctaHeading="Plumbing Emergency? Call Now."
    ctaSubtitle="Certified plumbers dispatched anywhere in Dubai within 60 minutes — day or night."
    formUnitLabel="Type of Plumbing Issue"
    formUnitOptions={[
      { value: "Leak / Drip",     label: "Leak or Dripping Tap" },
      { value: "Blockage",        label: "Blocked Drain or Toilet" },
      { value: "Water Heater",    label: "Water Heater Issue" },
      { value: "Low Pressure",    label: "Low Water Pressure" },
      { value: "Fixture Install", label: "Fixture Installation" },
      { value: "Emergency",       label: "Emergency / Burst Pipe" },
    ]}
    internalLinks={INTERNAL_LINKS}
  />
);

export default PlumbingLanding;
