import { Link } from "react-router-dom";
import { ArrowRight, Snowflake, Droplets, Zap, TreePine, Paintbrush, Wrench, Fan, Sparkles, Droplet, LayoutGrid, Home, Server, BrickWall } from "lucide-react";
import { trackWhatsAppClick } from "@/lib/analytics";

const WHATSAPP_NUMBER = "971505387736";

const iconMap = {
  Snowflake, Droplets, Zap, TreePine, Paintbrush,
  Wrench, Fan, Sparkles, Droplet, LayoutGrid, Home, Server, BrickWall,
};

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

const ServiceCard = ({ service, index }) => {
  const Icon = iconMap[service.icon] || Wrench;

  const handleWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = encodeURIComponent(
      `Hi! I'm interested in your *${service.title}* service. Can you please provide more details and availability?`
    );
    trackWhatsAppClick("Service Card", service.title);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <Link
        to={`/services/${service.id}`}
        className="group relative flex flex-col h-full bg-card rounded-xl overflow-hidden border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300"
      >
        <div className="relative h-48 overflow-hidden bg-navy-light/20">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
            width="400"
            height="240"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
          <div className="absolute top-3 right-3 w-9 h-9 rounded-md bg-accent/90 backdrop-blur-sm flex items-center justify-center text-accent-foreground shadow-md">
            <Icon className="w-5 h-5" />
          </div>
        </div>

        <div className="flex flex-col flex-1 p-6">
          <h3 className="text-xl font-bold font-['Montserrat'] text-foreground group-hover:text-accent transition-colors">
            {service.title}
          </h3>

          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 flex-1">
            {service.description}
          </p>

          <ul className="mt-4 space-y-1.5 border-t border-border/60 pt-4">
            {service.features.slice(0, 3).map((f, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span className="truncate">{f}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
            <span className="inline-flex items-center justify-center gap-1.5 flex-1 px-4 py-2.5 rounded-md bg-accent text-accent-foreground font-semibold text-xs group-hover:brightness-110 transition-all">
              View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <button
              onClick={handleWhatsApp}
              aria-label={`WhatsApp about ${service.title}`}
              className="w-9 h-9 rounded-md bg-[#25D366] text-white flex items-center justify-center hover:bg-[#1ebe5d] transition-colors shrink-0"
            >
              <WhatsAppIcon />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ServiceCard;
