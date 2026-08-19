import ServiceLandingTemplate from "@/components/ServiceLandingTemplate";
import {
  Shield, Zap, Wrench, Clock, Home, Server,
  Tag, Package, Filter, Eye
} from "lucide-react";
// Uses electrical fittings webp as closest visual match
import serviceElectrical from "@/assets/real_electrical_fittings.webp";

const WARNING_SIGNS = [
  { icon: Shield,  title: "No Security System",    desc: "Your property has no alarm or access control — leaving it completely vulnerable to theft and intrusion." },
  { icon: Server,  title: "Outdated Intercom",      desc: "Old, broken intercom or door entry systems causing daily inconvenience and security gaps." },
  { icon: Zap,     title: "Faulty Intercom",        desc: "Broken intercom or door access system causing daily inconvenience and security gaps." },
  { icon: Wrench,  title: "Manual Controls",        desc: "Still using manual switches for everything when smart automation could save you time and energy." },
  { icon: Clock,   title: "Systems Going Offline",  desc: "Security panels or smart systems frequently losing connection, leaving your property unmonitored." },
  { icon: Home,    title: "No Remote Access",       desc: "Unable to check or control your Dubai property remotely when you're traveling or overseas." },
];

const INCLUDED_SERVICES = [
  { icon: Eye,      title: "Smart Home Automation",     desc: "Voice-controlled lighting, automated blinds, smart climate control, and complete scene programming." },
  { icon: Shield,   title: "Access Control Systems",    desc: "Keypad entry, card readers, biometric fingerprint access, and video intercom systems." },
  { icon: Package,  title: "Intercom & Door Systems",   desc: "Video intercoms, smart doorbells, and integrated door release systems for villas and apartments." },
  { icon: Server,   title: "System Maintenance & Support", desc: "Ongoing technical support, remote monitoring setup, and regular software updates for all systems." },
];

const PROCESS_STEPS = [
  { num: "01", title: "Step 1: Needs Analysis",        desc: "We assess your security and automation requirements and recommend the right systems for your property." },
  { num: "02", title: "Step 2: System Design",         desc: "A custom layout plan showing sensor placements, intercom positions, and cabling routes is presented." },
  { num: "03", title: "Step 3: Professional Install",  desc: "Neat, fully concealed cabling with all devices properly mounted, configured, and tested on-site." },
  { num: "04", title: "Step 4: App Setup & Training",  desc: "Mobile app configured for remote access. You're shown how to use every system completely." },
  { num: "05", title: "Step 5: Ongoing Support",       desc: "Remote support available for troubleshooting, system updates, and adding new devices anytime." },
];

const REVIEWS = [
  { name: "Nasser Al Hamdan",   area: "Palm Jumeirah",  review: "Full smart home setup with lighting automation, smart locks, and access control. The installation was clean, professional, and the app works perfectly." },
  { name: "Marina Petrov",      area: "JLT",            review: "Video intercom and access control installed in our apartment building. Crystal clear quality and the mobile app lets me manage entry from anywhere in the world." },
  { name: "Arjun Malhotra",     area: "Business Bay",   review: "Smart switches and dimmers installed throughout the apartment. The retrofit was seamless — no major wall work needed. Excellent team and fair pricing." },
];

const FAQS = [
  { q: "What smart home systems do you install?",       a: "We install smart switches, dimmers, thermostats, smart locks, video doorbells, blinds motors, and voice assistant integrations (Alexa, Google Home)." },
  { q: "Can you add smart home to an existing property?", a: "Yes — we retrofit smart switches, dimmers, thermostats, and video doorbells into existing properties with minimal wall work required." },
  { q: "Do you install intercoms and access control?",  a: "Yes. Video intercoms, keypad entry, card readers, and biometric access systems for villas, apartments, and offices across Dubai." },
  { q: "How long does a smart home installation take?", a: "A standard smart lighting setup for a 2-bedroom apartment takes approximately 4–6 hours. Larger projects are quoted individually following a site survey." },
  { q: "Can I control my home remotely from overseas?", a: "Yes. We set up remote access apps so you can control lighting, locks, and intercoms from your smartphone anywhere in the world." },
  { q: "Do you service and maintain installed systems?", a: "Yes. We provide ongoing maintenance contracts for smart home and access control systems — including software updates, health checks, and priority support." },
  { q: "What smart home devices can you integrate?",    a: "We integrate smart switches, dimmers, thermostats, smart locks, video doorbells, blinds motors, and voice assistants (Alexa, Google Home) into one unified system." },
];

const FLOATING_CARDS = [
  { icon: Tag,     label: "Smart Setup",   value: "From AED 499", colorClass: "bg-gold/15 text-gold",           valueClass: "text-gold" },
  { icon: Zap,     label: "Remote Access", value: "Anywhere",     colorClass: "bg-[#22c55e]/15 text-[#22c55e]", valueClass: "text-slate-900" },
  { icon: Shield,  label: "Professional",  value: "Installation",  colorClass: "bg-gold/15 text-gold",           valueClass: "text-slate-900" },
];

const INTERNAL_LINKS = [
  { to: "/services/electrical",   emoji: "⚡", label: "certified electrical repair Dubai" },
  { to: "/services/property-care",emoji: "🏠", label: "residential property care Dubai" },
  { to: "/services/ac-cleaning",  emoji: "❄️", label: "professional AC cleaning Dubai" },
];

const SystemsMaintenanceLanding = () => (
  <ServiceLandingTemplate
    seo={{
      title: "Smart Home & Access Control Installation Dubai | Afnan",
      description: "Professional smart home automation, access control & intercom installation in Dubai. Smart switches, video doorbells, keypad entry & more. Licensed LLC. Book now!",
      keywords: "smart home Dubai, access control Dubai, intercom Dubai, home automation Dubai, smart switches Dubai, video doorbell Dubai, smart locks Dubai, biometric access Dubai, alarm system Dubai, smart home installation Dubai",
      canonicalUrl: "/services/systems-maintenance",
      ogImage: "https://maresidentialpropertycareservicellc.com/og-images/systems-maintenance-dubai.jpg",
    }}
    heroImage={serviceElectrical}
    h1Plain="Smart Home & Access Control"
    h1Gradient="Systems in Dubai"
    heroTag="Professional Smart Systems Specialist"
    heroSubtitle="Smart Home Automation, Access Control & Intercom Systems for Dubai Villas & Apartments"
    heroDesc="Automate your home and secure your property with professional-grade smart home and access control systems — installed, configured, and remotely accessible."
    heroBadges={["Remote Access App", "Licensed LLC", "Certified Engineers", "All Dubai Areas"]}
    floatingCards={FLOATING_CARDS}
    warningSigns={WARNING_SIGNS}
    warningTitle="Is Your Property Security Up To Standard?"
    warningSubtitle="Don't leave your Dubai property vulnerable. If any of these apply to you, it's time to upgrade your security and smart systems."
    beforeAfter={{
      title: "Before vs After Smart Systems Installation",
      subtitle: "See how our professional smart home and access control services transform your property's security and convenience.",
      before: ["No remote control of home devices", "Manual, inefficient home controls", "Security blind spots and vulnerabilities", "Systems offline with no monitoring"],
      after: ["Full smart home control via app", "Smart, automated home control from anywhere", "Complete access control from every entry point", "Remote monitoring from anywhere in the world"],
    }}
    includedServices={INCLUDED_SERVICES}
    includedTitle="Complete Smart Home & Access Control Services in Dubai"
    includedSubtitle="Certified engineers installing and maintaining smart home, intercom, and access control systems across Dubai."
    processSteps={PROCESS_STEPS}
    processTitle="Our 5-Step Systems Installation Process"
    processSubtitle="From needs assessment to remote app setup — professional installation with ongoing support."
    stats={[["500+", "Systems Installed"], ["4.8★", "Customer Rating"], ["15+", "Brands Available"], ["24/7", "Remote Support"]]}
    reviews={REVIEWS}
    faqs={FAQS}
    faqTitle="Frequently Asked Questions About Smart Home & Access Control in Dubai"
    faqSubtitle="Answers to the most common questions about our smart home automation and access control installation services."
    serviceSlug="systems-maintenance"
    serviceName="Smart Home & Access Control Systems"
    ctaHeading="Automate & Secure Your Dubai Property Today."
    ctaSubtitle="Get a free site survey and quote for smart home or access control installation anywhere in Dubai."
    formUnitLabel="Type of System"
    formUnitOptions={[
      { value: "Smart Home",     label: "Smart Home Automation" },
      { value: "Access Control", label: "Access Control / Intercom" },
      { value: "Smart Lighting", label: "Smart Lighting & Dimmers" },
      { value: "Video Doorbell", label: "Video Doorbell / Intercom" },
      { value: "Alarm System",   label: "Alarm / Security System" },
      { value: "Full Package",   label: "Full Smart Home Package" },
    ]}
    internalLinks={INTERNAL_LINKS}
  />
);

export default SystemsMaintenanceLanding;
