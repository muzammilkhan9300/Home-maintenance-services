import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Snowflake, Droplets, Zap, TreePine, Paintbrush, Wrench, Fan, Sparkles, Droplet, LayoutGrid, Home, Server, BrickWall } from "lucide-react";
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
const ServiceCard = ({ service, index }) => {
  const Icon = iconMap[service.icon] || Wrench;
  return <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="group bg-card rounded-lg overflow-hidden shadow-premium hover:shadow-gold transition-all duration-500 border border-border"
  >
    <div className="relative h-52 overflow-hidden">
      <img
        src={service.image}
        alt={service.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center">
          <Icon className="w-5 h-5 text-accent-foreground" />
        </div>
        <h3 className="text-lg font-bold text-primary-foreground font-['Montserrat']">{service.title}</h3>
      </div>
    </div>
    <div className="p-5">
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{service.description}</p>
      <Link
        to={`/contact?service=${service.id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
      >
        Book Service <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </motion.div>;
};
export default ServiceCard;
