import serviceAc from "@/assets/real_ac_ventilation.png";
import serviceCleaning from "@/assets/real_building_cleaning.png";
import servicePainting from "@/assets/real_painting_contracting.png";
import serviceElectrical from "@/assets/real_electrical_fittings.png";
import servicePlumbing from "@/assets/real_plumbing_sanitary.png";
import serviceTiling from "@/assets/real_tiling_works.png";
import servicePlaster from "@/assets/real_plaster_works.png";

export const services = [
  {
    id: "ac-ventilation",
    title: "Air-Conditioning, Ventilations & Air Filtration",
    description: "Complete HVAC solutions guaranteeing pristine air quality and cooling efficiency for residential and commercial spaces.",
    features: ["Split & Central AC Repair", "Ventilation System Cleaning", "Air Filter Replacement", "New Unit Installation", "Periodic Maintenance"],
    image: serviceAc,
    icon: "Fan"
  },
  {
    id: "building-cleaning",
    title: "Building Cleaning Services",
    description: "Professional cleaning services delivering spotless exteriors and interiors for office buildings, luxury villas, and apartments.",
    features: ["Deep Cleaning", "Window & Facade Washing", "Post-Construction Cleanup", "Regular Maintenance", "Sanitization Services"],
    image: serviceCleaning,
    icon: "Sparkles"
  },
  {
    id: "painting",
    title: "Painting Contracting",
    description: "High-quality, durable interior and exterior painting services executed by skilled professionals for a flawless finish.",
    features: ["Interior Wall Painting", "Exterior Villa Painting", "Texture & Feature Walls", "Waterproofing", "Epoxy Floor Coatings"],
    image: servicePainting,
    icon: "Paintbrush"
  },
  {
    id: "electrical",
    title: "Electrical Fittings & Fixtures Repairing & Maintenance",
    description: "Safe, compliant, and reliable electrical services handled by certified technicians for all building types.",
    features: ["Wiring & Rewiring", "Distribution Board Repair", "Lighting Installation", "Fault Finding", "Safety Inspections"],
    image: serviceElectrical,
    icon: "Zap"
  },
  {
    id: "plumbing",
    title: "Plumbing & Sanitary Installation",
    description: "Expert plumbing solutions ranging from routine maintenance to full-scale sanitary and water network installations.",
    features: ["Leak Detection & Repair", "Water Heater Services", "Pump Installation", "Bathroom & Kitchen Fixtures", "Drain Unblocking"],
    image: servicePlumbing,
    icon: "Droplet"
  },
  {
    id: "sanitary-pipes",
    title: "Sanitary Installation & Pipes Repairing",
    description: "Comprehensive installation and repair of structural sanitary networks, drainage systems, and external water piping.",
    features: ["PVC & Copper Pipe Repair", "Drainage System Setup", "Sewer Line Maintenance", "Underground Piping", "Valve Replacements"],
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800&auto=format&fit=crop",
    icon: "Wrench"
  },
  {
    id: "tiling",
    title: "Floor & Wall Tiling Works",
    description: "Precision installation of premium ceramic, porcelain, and marble tiles for stunning and durable floors and walls.",
    features: ["Ceramic & Porcelain Laying", "Marble Installation", "Grout Restoration", "Bathroom Wall Tiling", "Outdoor Pavers"],
    image: serviceTiling,
    icon: "LayoutGrid"
  },
  {
    id: "property-care",
    title: "Residential Property Care Services",
    description: "All-encompassing care for your home ensuring longevity, aesthetic appeal, and structural integrity year-round.",
    features: ["Annual Maintenance Contracts", "Routine Inspections", "General Handyman", "Preventative Care", "Emergency Callouts"],
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop",
    icon: "Home"
  },
  {
    id: "systems-maintenance",
    title: "Systems Installation & Maintenance",
    description: "Modern integration and upkeep of smart home systems, security panels, and intricate property management setups.",
    features: ["Smart Home Automation", "Security System Setup", "CCTV Installation", "Intercoms", "Control Panel Calibration"],
    image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=800&auto=format&fit=crop",
    icon: "Server"
  },
  {
    id: "plaster-works",
    title: "Plaster Works",
    description: "Professional plastering and skimming services delivering perfectly smooth walls ready for premium paint or wallpaper.",
    features: ["Wall Skimming", "Crack Repairs", "Decorative Plastering", "Ceiling Repairs", "Drywall Installation"],
    image: servicePlaster,
    icon: "BrickWall"
  }
];
