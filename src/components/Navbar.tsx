import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { label: "Journey", href: "/dashboard" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Learn", href: "/learn" },
  { label: "Community", href: "/community" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-border/50 py-3" : "py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-teal flex items-center justify-center glow-teal group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-wide text-foreground">
            EV<span className="text-gradient-teal">OLV</span>E
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === l.href
                  ? "text-teal bg-teal-500/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/onboarding">
            <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground hover:border-primary/50">
              Sign In
            </Button>
          </Link>
          <Link to="/onboarding">
            <Button size="sm" className="bg-gradient-teal text-primary-foreground font-semibold hover:opacity-90 glow-teal">
              Start Free
            </Button>
          </Link>
        </div>

        {/* Mobile */}
        <button
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-border/50 mt-2">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <Link to="/onboarding" onClick={() => setOpen(false)}>
                <Button className="w-full bg-gradient-teal text-primary-foreground font-semibold">
                  Start Your Reinvention
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
