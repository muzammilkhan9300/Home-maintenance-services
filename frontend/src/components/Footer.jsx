import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
const Footer = () => <footer className="bg-navy text-primary-foreground">
  <div className="container mx-auto px-4 lg:px-8 py-16">
    <div className="grid md:grid-cols-3 gap-12">
      <div>
        <h3 className="text-lg font-bold font-['Montserrat'] mb-2">AFNAN PROPERTY CARE SERVICES</h3>
        <p className="text-sm text-primary-foreground/60 mb-4">
          Licensed residential property maintenance company in Dubai, UAE. Trade License No. 1571076.
        </p>
        <p className="text-xs text-primary-foreground/40">
          MUHAMMAD AFNAN RESIDENTIAL PROPERTY CARE SERVICES L.L.C
        </p>
      </div>

      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">Quick Links</h4>
        <div className="space-y-2">
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About Us" },
            { to: "/services", label: "Services" },
            { to: "/contact", label: "Contact" }
          ].map((l) => <Link key={l.to} to={l.to} className="block text-sm text-primary-foreground/70 hover:text-gold transition-colors">
            {l.label}
          </Link>)}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">Contact Info</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
            <span className="text-sm text-primary-foreground/70">Rolex Twin Tower - 33 Baniyas Rd - Al Rigga - Deira - Dubai</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gold shrink-0" />
            <span className="text-sm text-primary-foreground/70">+971-504200736</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gold shrink-0" />
            <span className="text-sm text-primary-foreground/70">info@maresidentialpropertycareservicellc.com</span>
          </div>
        </div>
      </div>
    </div>

    <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
      <p className="text-xs text-primary-foreground/40">
        © {(/* @__PURE__ */ new Date()).getFullYear()} Muhammad Afnan Residential Property Care Services L.L.C. All rights reserved.
      </p>
    </div>
  </div>
</footer>;
export default Footer;
