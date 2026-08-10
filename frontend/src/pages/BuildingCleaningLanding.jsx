import ServiceLandingTemplate from "@/components/ServiceLandingTemplate";
import {
  Sparkles, Droplets, Leaf, Shield, Clock, Wind,
  Package, Fan, Filter, Zap
} from "lucide-react";
import serviceCleaning from "@/assets/real_building_cleaning.webp";

const WARNING_SIGNS = [
  { icon: Sparkles, title: "Accumulated Dust",    desc: "Thick dust on surfaces, shelves, and behind furniture affecting health and air quality." },
  { icon: Droplets, title: "Stained Windows",     desc: "Grimy, smeared windows blocking natural light and harming the building's curb appeal." },
  { icon: Leaf,     title: "Mold & Mildew",       desc: "Visible mold spots or musty smell in bathrooms, kitchens, or on walls and ceilings." },
  { icon: Wind,     title: "Post-Construction Mess", desc: "Cement dust, paint residue, and construction debris left after renovation work." },
  { icon: Shield,   title: "Unhygienic Spaces",   desc: "Germs, bacteria, and allergens building up in uncleaned, overlooked corners." },
  { icon: Clock,    title: "Long Neglected Areas",desc: "Deep cleaning hasn't been done in months — visible buildup and grime everywhere." },
];

const INCLUDED_SERVICES = [
  { icon: Sparkles, title: "Deep Interior Cleaning",    desc: "Every surface scrubbed from floor to ceiling including inside cabinets and behind appliances." },
  { icon: Droplets, title: "Window & Glass Polishing",  desc: "Interior and exterior window cleaning for crystal-clear, streak-free glass throughout." },
  { icon: Filter,   title: "Anti-Bacterial Sanitization", desc: "Medical-grade disinfection of all high-touch surfaces, bathrooms, and kitchen areas." },
  { icon: Package,  title: "Post-Construction Cleanup", desc: "Removal of cement dust, paint splatter, adhesive residue, and construction debris." },
];

const PROCESS_STEPS = [
  { num: "01", title: "Step 1: Choose Your Package", desc: "Select from one-time deep clean, regular maintenance, or post-construction cleanup." },
  { num: "02", title: "Step 2: Fixed Quote Provided", desc: "We provide a transparent fixed price upfront — no surprises. Pick a date that works for you." },
  { num: "03", title: "Step 3: Team Arrives Ready", desc: "Our trained team arrives with all equipment, eco-friendly cleaning products, and protective gear." },
  { num: "04", title: "Step 4: Deep Clean Executed", desc: "Systematic room-by-room cleaning with quality checks at every stage of the process." },
  { num: "05", title: "Step 5: Inspection & Sign-Off", desc: "You inspect the completed work and sign off only when fully satisfied with every detail." },
];

const REVIEWS = [
  { name: "Fatima Al Rashidi", area: "Jumeirah",       review: "Absolutely spotless results! The team was professional, thorough and finished on time. My villa has never looked this clean. Highly recommend for anyone in Dubai." },
  { name: "James Robertson",   area: "Business Bay",   review: "Used them for a post-construction cleanup and was blown away. Every trace of cement dust and paint splatter was gone. Perfect service." },
  { name: "Priya Nair",        area: "Al Barsha",      review: "Regular monthly cleaning with Afnan Property Care — they're consistent, punctual, and the standard never drops. Best cleaning company in Dubai." },
];

const FAQS = [
  { q: "Do I need to be home during the cleaning?",      a: "Not necessarily. Many clients provide a key or building access. We take full responsibility for the security of your property during the entire service." },
  { q: "What's included in a deep cleaning package?",    a: "Deep cleaning covers every surface: inside kitchen cabinets, behind appliances, bathroom descaling, window interiors, balconies, ceiling fans, and floor-to-ceiling scrubbing." },
  { q: "Do you clean post-construction properties?",     a: "Yes — post-construction cleanup is one of our specialties. We remove cement dust, paint splatter, adhesive residue, and construction debris from all surfaces." },
  { q: "How long does a villa deep clean take?",         a: "A standard 3-bedroom villa takes 4–6 hours with a 2-person team. Larger properties are quoted individually based on size and condition." },
  { q: "What cleaning products do you use?",             a: "We use eco-friendly, child-safe, and pet-safe cleaning agents throughout. For sanitization, we apply hospital-grade, non-toxic disinfectants." },
  { q: "Do you offer regular maintenance cleaning?",     a: "Yes. We offer weekly, bi-weekly, and monthly cleaning contracts at discounted rates. Our regular clients get priority scheduling and preferred pricing." },
  { q: "Can you clean office buildings and commercial spaces?", a: "Absolutely. We clean apartments, villas, townhouses, office buildings, retail spaces, and commercial properties across all Dubai areas." },
];

const FLOATING_CARDS = [
  { icon: Tag,       label: "Starting Price",   value: "AED 299",        colorClass: "bg-gold/15 text-gold",         valueClass: "text-gold" },
  { icon: Zap,       label: "Same-Day",         value: "Appointments",   colorClass: "bg-[#22c55e]/15 text-[#22c55e]", valueClass: "text-slate-900" },
  { icon: Shield,    label: "Eco-Friendly",     value: "Products Used",  colorClass: "bg-gold/15 text-gold",         valueClass: "text-slate-900" },
];

const INTERNAL_LINKS = [
  { to: "/services/ac-cleaning",  emoji: "❄️",  label: "professional AC cleaning Dubai" },
  { to: "/services/plumbing",     emoji: "🚿",  label: "emergency plumbing services Dubai" },
  { to: "/services/painting",     emoji: "🎨",  label: "professional painting services Dubai" },
];

const BuildingCleaningLanding = () => (
  <ServiceLandingTemplate
    seo={{
      title: "Building Cleaning Services Dubai | Afnan Property Care",
      description: "Professional deep cleaning services in Dubai for villas, apartments & offices. Post-construction cleanup, sanitization & regular maintenance. Licensed LLC. Book now!",
      keywords: "building cleaning Dubai, deep cleaning Dubai, villa cleaning Dubai, apartment cleaning Dubai, post construction cleaning Dubai, professional cleaning company Dubai, sanitization services Dubai, office cleaning Dubai",
      canonicalUrl: "/services/building-cleaning",
      ogImage: "https://maresidentialpropertycareservicellc.com/og-images/building-cleaning-dubai.jpg",
    }}
    heroImage={serviceCleaning}
    h1Plain="Professional Building"
    h1Gradient="Cleaning Services Dubai"
    heroTag="Available Today Across Dubai"
    heroSubtitle="Deep Cleaning Services For Villas, Apartments & Commercial Buildings"
    heroDesc="Spotlessly clean every surface with hospital-grade products and certified cleaning professionals — same-day booking available."
    heroBadges={["Same-Day Service", "Licensed LLC", "Eco-Friendly Products", "All Dubai Areas"]}
    floatingCards={FLOATING_CARDS}
    warningSigns={WARNING_SIGNS}
    warningTitle="Is Your Property Due For a Deep Clean?"
    warningSubtitle="If you're experiencing any of these issues, it's time to call in our professional cleaning team for a thorough deep clean."
    beforeAfter={{
      title: "Before vs After Deep Cleaning",
      subtitle: "See the remarkable transformation our professional building cleaning service delivers.",
      before: ["Dusty surfaces and grimy shelves", "Smeared windows blocking natural light", "Lingering odors and stale air", "Visible stains on floors and tiles"],
      after: ["Spotlessly clean every surface", "Crystal-clear, streak-free windows", "Fresh, clean-smelling environment", "Gleaming floors and polished tiles"],
    }}
    includedServices={INCLUDED_SERVICES}
    includedTitle="Comprehensive Building Cleaning Services in Dubai"
    includedSubtitle="Our certified cleaning teams follow strict protocols to deep clean, sanitize, and restore your property to showroom condition."
    processSteps={PROCESS_STEPS}
    processTitle="Our 5-Step Professional Cleaning Process"
    processSubtitle="Systematic, mess-free deep cleaning designed for Dubai's residential and commercial properties."
    stats={[["1,500+", "Properties Cleaned"], ["4.8★", "Customer Rating"], ["200+", "Hours/Week"], ["100%", "Satisfaction Goal"]]}
    reviews={REVIEWS}
    faqs={FAQS}
    faqTitle="Frequently Asked Questions About Building Cleaning in Dubai"
    faqSubtitle="Direct answers to the most common questions about our deep cleaning and sanitization services."
    serviceSlug="building-cleaning"
    serviceName="Building Cleaning"
    ctaHeading="Need Professional Cleaning Today?"
    ctaSubtitle="Call now and get a cleaning team dispatched anywhere in Dubai."
    formUnitLabel="Property Type"
    formUnitOptions={[
      { value: "Studio",       label: "Studio Apartment" },
      { value: "1BR",          label: "1 Bedroom Apartment" },
      { value: "2BR",          label: "2 Bedroom Apartment" },
      { value: "3BR",          label: "3 Bedroom Apartment" },
      { value: "Villa",        label: "Villa / Townhouse" },
      { value: "Commercial",   label: "Commercial / Office" },
    ]}
    internalLinks={INTERNAL_LINKS}
  />
);

export default BuildingCleaningLanding;
