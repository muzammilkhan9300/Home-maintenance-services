import ServiceLandingTemplate from "@/components/ServiceLandingTemplate";
import {
  BrickWall, Droplets, Sparkles, Shield, Wrench, Clock,
  Tag, Zap, Package, Filter
} from "lucide-react";
import servicePlaster from "@/assets/real_plaster_works.webp";

const WARNING_SIGNS = [
  { icon: BrickWall, title: "Visible Cracks",      desc: "Hairline or widening cracks in walls and ceilings — a structural or moisture warning requiring attention." },
  { icon: Droplets,  title: "Damp Patches",        desc: "Wet or discolored patches on plaster indicating water ingress or condensation problems behind the surface." },
  { icon: Sparkles,  title: "Bumpy, Uneven Walls",  desc: "Rough or textured surfaces that show through paint, looking highly unprofessional and dated." },
  { icon: Shield,    title: "Hollow Plaster",       desc: "Sections that sound hollow when tapped — plaster has separated from the wall and will fall without warning." },
  { icon: Wrench,    title: "Peeling Plaster",      desc: "Chunks of plaster falling away — a safety hazard that worsens quickly and damages surrounding finishes." },
  { icon: Clock,     title: "Post-Renovation Gaps", desc: "Rough, unfinished gaps left after electrical or plumbing work done inside walls and ceilings." },
];

const INCLUDED_SERVICES = [
  { icon: BrickWall, title: "Skim Coat Plastering",     desc: "Ultra-smooth multi-coat skim plaster applied over existing walls for a mirror-like, paint-ready surface." },
  { icon: Wrench,    title: "Crack Repair & Filling",   desc: "Cut-out, mesh-reinforced crack repair that creates a permanent fix preventing future re-cracking." },
  { icon: Package,   title: "Drywall Installation",     desc: "Full gypsum board partition and ceiling installation including fire-rated systems for any property type." },
  { icon: Filter,    title: "Decorative Plastering",    desc: "Venetian plaster, sand texture, and decorative wall finish application for premium interior aesthetics." },
];

const PROCESS_STEPS = [
  { num: "01", title: "Step 1: Wall Assessment",       desc: "We check for damp, structural cracks, and substrate quality thoroughly before starting any work." },
  { num: "02", title: "Step 2: Substrate Preparation", desc: "Walls are bonded and primed to ensure the plaster achieves maximum adhesion throughout." },
  { num: "03", title: "Step 3: Base Coat Application", desc: "Scratch coat applied to level the wall, fill all imperfections, and create a perfect base for finishing." },
  { num: "04", title: "Step 4: Skim Finish Coat",      desc: "Ultra-fine finishing plaster applied in thin, smooth layers for a flawless, mirror-like surface." },
  { num: "05", title: "Step 5: Sanding & Handover",    desc: "Once fully cured, walls are lightly sanded to a flawless, paint-ready finish and handed over." },
];

const REVIEWS = [
  { name: "Yousef Al Sayed",    area: "Jumeirah",       review: "Complete skim plaster throughout our villa — the walls are completely smooth and the finish is absolutely flawless. Painting came out perfect on top. Highly recommend." },
  { name: "Hannah Clarke",      area: "Al Barsha",       review: "Had major cracks in our apartment walls repaired. They cut out the old plaster properly, applied mesh, and skimmed over. Two months later, no cracks at all." },
  { name: "Sunil Varghese",     area: "Dubai Marina",   review: "Drywall partition installed to create an extra room. Clean, straight work, finished with a perfect skim coat. On time and exactly as quoted. Excellent." },
];

const FAQS = [
  { q: "What is the difference between plastering and skimming?", a: "Plastering applies a thick base coat to rough walls. Skimming is a thin, smooth finishing coat applied over existing plaster to create a perfectly flat, paint-ready surface." },
  { q: "How long does plaster take to dry before painting?",      a: "Base coats need 24–48 hours. Skim finish needs at least 5–7 days before painting to fully cure — longer in humid Dubai conditions to prevent paint adhesion issues." },
  { q: "Can you permanently repair wall cracks?",                 a: "Yes. We cut out the crack, fill with fibre-reinforced filler, apply alkali-resistant mesh tape, then skim over — creating a permanent repair that won't re-crack." },
  { q: "Do you install drywall (gypsum board) partitions?",       a: "Yes. We design, frame, and install gypsum board partitions and ceilings for studios, apartments, villas, and offices — including fire-rated systems." },
  { q: "Can you skim plaster over existing tiles or painted walls?", a: "Yes with proper preparation. We apply a bonding primer or mechanical key to ensure adhesion, then skim over the surface for a smooth finish." },
  { q: "How do I know if my plaster is failing?",                 a: "Key signs include hollow sounds when you tap, cracks forming at corners or joints, bulging sections, and plaster that crumbles or breaks away at the edges." },
  { q: "Can you match existing plaster texture in other rooms?",  a: "Yes. We carefully match the texture, grain, and depth of existing plasterwork so repairs are completely invisible once painted." },
];

const FLOATING_CARDS = [
  { icon: Tag,       label: "Starting Price",  value: "AED 199/room", colorClass: "bg-gold/15 text-gold",           valueClass: "text-gold" },
  { icon: Zap,       label: "Mirror-Smooth",   value: "Finish",       colorClass: "bg-[#22c55e]/15 text-[#22c55e]", valueClass: "text-slate-900" },
  { icon: Shield,    label: "Crack-Free",      value: "Guarantee",    colorClass: "bg-gold/15 text-gold",           valueClass: "text-slate-900" },
];

const INTERNAL_LINKS = [
  { to: "/services/painting",   emoji: "🎨", label: "professional painting services Dubai" },
  { to: "/services/tiling",     emoji: "🔲", label: "floor and wall tiling contractor Dubai" },
  { to: "/services/electrical", emoji: "⚡", label: "certified electrical repair Dubai" },
];

const PlasterWorksLanding = () => (
  <ServiceLandingTemplate
    seo={{
      title: "Plastering Services Dubai | Skim Coat | Afnan Property Care",
      description: "Professional plastering & skimming services in Dubai. Crack repair, skim coat, drywall installation & decorative plastering. Mirror-smooth finish guaranteed. Book now!",
      keywords: "plastering Dubai, skimming Dubai, skim coat Dubai, wall plastering Dubai, crack repair Dubai, drywall installation Dubai, gypsum partition Dubai, decorative plaster Dubai, plaster works Dubai, smooth walls Dubai",
      canonicalUrl: "/services/plaster-works",
      ogImage: "https://maresidentialpropertycareservicellc.com/og-images/plaster-works-dubai.jpg",
    }}
    heroImage={servicePlaster}
    h1Plain="Professional Plastering"
    h1Gradient="Services in Dubai"
    heroTag="Mirror-Smooth Finish Guaranteed"
    heroSubtitle="Skim Coat, Crack Repair & Drywall Installation for Dubai Villas & Apartments"
    heroDesc="Perfectly smooth, paint-ready walls delivered by expert plasterers — from crack repairs to full skim coat and decorative finishes."
    heroBadges={["Mirror-Smooth Finish", "Licensed LLC", "Crack-Free Guarantee", "All Dubai Areas"]}
    floatingCards={FLOATING_CARDS}
    warningSigns={WARNING_SIGNS}
    warningTitle="Are Your Walls Showing These Problems?"
    warningSubtitle="Plaster issues worsen quickly and affect your paint, property value, and safety. Our plasterers fix it right the first time."
    beforeAfter={{
      title: "Before vs After Professional Plastering",
      subtitle: "See the remarkable transformation our plastering and skimming service delivers to Dubai properties.",
      before: ["Cracked and uneven wall surfaces", "Hollow, peeling, or damp plaster", "Rough finishes showing through paint", "Post-renovation gaps and patchwork"],
      after: ["Mirror-smooth, perfect paint-ready surface", "Solid, fully bonded plaster throughout", "Invisible repairs that last for years", "Seamless, professional finish top to bottom"],
    }}
    includedServices={INCLUDED_SERVICES}
    includedTitle="Complete Plastering & Skimming Services in Dubai"
    includedSubtitle="Expert plasterers delivering flawlessly smooth walls for painting — from crack repair to full skim coat and drywall partitions."
    processSteps={PROCESS_STEPS}
    processTitle="Our 5-Step Professional Plastering Process"
    processSubtitle="Systematic, multi-coat plastering precision — engineered for a mirror-smooth, long-lasting finish."
    stats={[["30,000+", "sqm Plastered"], ["4.8★", "Customer Rating"], ["All Types", "Wall Surfaces"], ["100%", "Crack-Free Results"]]}
    reviews={REVIEWS}
    faqs={FAQS}
    faqTitle="Frequently Asked Questions About Plastering Services in Dubai"
    faqSubtitle="Direct answers to the most common questions about our skim coat, crack repair, and drywall services."
    serviceSlug="plaster-works"
    serviceName="Plaster Works"
    ctaHeading="Ready for Perfectly Smooth Walls?"
    ctaSubtitle="Get a free plastering consultation and quote anywhere in Dubai — same-day visits available."
    formUnitLabel="Type of Plastering Work"
    formUnitOptions={[
      { value: "Crack Repair",    label: "Crack Repair" },
      { value: "Skim Coat",       label: "Skim Coat (1 Room)" },
      { value: "Skim Full",       label: "Full Apartment Skim" },
      { value: "Drywall",         label: "Drywall / Partition" },
      { value: "Decorative",      label: "Decorative / Venetian" },
      { value: "Full Project",    label: "Full Plastering Project" },
    ]}
    internalLinks={INTERNAL_LINKS}
  />
);

export default PlasterWorksLanding;
