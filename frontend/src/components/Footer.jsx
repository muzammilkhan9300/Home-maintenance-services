import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Shield } from "lucide-react";
import { useState } from "react";
import CareerModal from "@/components/CareerModal";

const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Footer = () => {
  const [careerOpen, setCareerOpen] = useState(false);
  const isAdminLoggedIn = !!localStorage.getItem('adminToken');

  return (
    <footer className="bg-navy text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-lg font-bold font-['Montserrat'] mb-2">AFNAN PROPERTY CARE SERVICES</h3>
            <p className="text-sm text-primary-foreground/60 mb-4">
              Licensed residential property maintenance company in Dubai, UAE. Trade License No. 1571076.
            </p>
            <p className="text-xs text-primary-foreground/40 mb-6">
              MUHAMMAD AFNAN RESIDENTIAL PROPERTY CARE SERVICES L.L.C
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/AfnanPropertyCare"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-gold hover:text-navy flex items-center justify-center transition-all duration-300 text-primary-foreground"
                aria-label="Facebook"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://instagram.com/afnan_propertycareservices"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-gold hover:text-navy flex items-center justify-center transition-all duration-300 text-primary-foreground"
                aria-label="Instagram"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://tiktok.com/@afnanpropertycare"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-gold hover:text-navy flex items-center justify-center transition-all duration-300 text-primary-foreground"
                aria-label="TikTok"
              >
                <TiktokIcon />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/services", label: "Services" },
                { to: "/contact", label: "Contact" }
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              {/* Careers link — opens modal */}
              <button
                onClick={() => setCareerOpen(true)}
                className="block text-left text-sm text-primary-foreground/70 hover:text-gold transition-colors"
              >
                Careers
              </button>
              {/* Admin Panel — hidden in footer for easy access */}
              <Link
                to={isAdminLoggedIn ? "/admin/dashboard" : "/admin/login"}
                className="flex items-center gap-1.5 text-sm text-primary-foreground/40 hover:text-gold transition-colors pt-1 border-t border-primary-foreground/10 mt-1"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
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
                <span className="text-sm text-primary-foreground/70">+971-505387736</span>
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
            © {new Date().getFullYear()} Muhammad Afnan Residential Property Care Services L.L.C. All rights reserved.
          </p>
        </div>
      </div>

      <CareerModal open={careerOpen} onClose={() => setCareerOpen(false)} />
    </footer>
  );
};
export default Footer;
