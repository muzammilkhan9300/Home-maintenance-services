import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { useState, useEffect } from "react";
const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" }
];
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const isHome = location.pathname === "/";
  const scrolledOrNotHome = scrolled || !isHome;
  const navBg = scrolledOrNotHome ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent";

  const logoColor = scrolledOrNotHome ? "text-primary" : "text-white";
  const subLogoColor = scrolledOrNotHome ? "text-muted-foreground" : "text-white/80";
  const linkColor = (path) => {
    if (path === location.pathname) return "text-accent";
    return scrolledOrNotHome ? "text-foreground/80 hover:text-accent" : "text-white/90 hover:text-white";
  };
  const menuBtnColor = scrolledOrNotHome ? "text-foreground" : "text-white";

  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
    <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
      <Link to="/" className="flex flex-col">
        <span className={`text-lg font-bold font-['Montserrat'] tracking-tight leading-tight transition-colors ${logoColor}`}>
          AFNAN PROPERTY CARE
        </span>
        <span className={`text-lg font-bold font-['Montserrat'] tracking-[0.1em] uppercase transition-colors text-gradient-gold`}>
          Services L.L.C
        </span>
      </Link>

      {
        /* Desktop */
      }
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((l) => <Link
          key={l.to}
          to={l.to}
          className={`text-sm font-medium transition-colors ${linkColor(l.to)}`}
        >
          {l.label}
        </Link>)}
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent text-accent-foreground text-sm font-semibold hover:brightness-110 transition-all shadow-gold"
        >
          <Phone className="w-4 h-4" /> Book Now
        </Link>
      </div>

      <button onClick={() => setOpen(!open)} className={`md:hidden ${menuBtnColor}`}>
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>

    {open && <div className="md:hidden bg-background border-t border-border px-4 py-4 space-y-3">
      {navLinks.map((l) => <Link
        key={l.to}
        to={l.to}
        onClick={() => setOpen(false)}
        className="block text-sm font-medium text-foreground/80 hover:text-accent py-2"
      >
        {l.label}
      </Link>)}
      <Link
        to="/contact"
        onClick={() => setOpen(false)}
        className="block text-center px-5 py-2.5 rounded-md bg-accent text-accent-foreground text-sm font-semibold"
      >
        Book Now
      </Link>
    </div>}
  </nav>;
};
export default Navbar;
