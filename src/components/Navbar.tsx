import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu, X, Zap, LayoutDashboard, Map, Compass, GitBranch,
  BookOpen, FlaskConical, Users, MessageCircle, User, ChevronDown
} from "lucide-react";

const appLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Identity Map", href: "/identity-map", icon: Map },
  { label: "Opportunities", href: "/opportunities", icon: Compass },
  { label: "Paths", href: "/paths", icon: GitBranch },
  { label: "Learning", href: "/learn", icon: BookOpen },
  { label: "Experiments", href: "/experiments", icon: FlaskConical },
  { label: "Community", href: "/community", icon: Users },
  { label: "AI Coach", href: "/coach", icon: MessageCircle },
  { label: "Profile", href: "/profile", icon: User },
];

const marketingLinks = [
  { label: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [appMenuOpen, setAppMenuOpen] = useState(false);
  const location = useLocation();

  const isAppRoute = appLinks.some((l) => location.pathname === l.href);
  const activeApp = appLinks.find((l) => location.pathname === l.href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setAppMenuOpen(false);
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-border/50 py-3" : "py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-teal flex items-center justify-center glow-teal group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-wide text-foreground">
            EV<span className="text-gradient-teal">OLV</span>E
          </span>
        </Link>

        {/* Desktop nav */}
        {isAppRoute ? (
          /* App navigation — dropdown mega menu */
          <nav className="hidden md:flex items-center gap-1">
            {/* Quick links — show 5 most important */}
            {appLinks.slice(0, 5).map((l) => {
              const Icon = l.icon;
              return (
                <Link
                  key={l.href}
                  to={l.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === l.href
                      ? "text-teal bg-teal-500/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {l.label}
                </Link>
              );
            })}
            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setAppMenuOpen(!appMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  appMenuOpen ? "text-teal bg-teal-500/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                More
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${appMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {appMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-surface-2 border border-border rounded-xl shadow-card overflow-hidden animate-fade-in">
                  {appLinks.slice(5).map((l) => {
                    const Icon = l.icon;
                    return (
                      <Link
                        key={l.href}
                        to={l.href}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                          location.pathname === l.href
                            ? "text-teal bg-teal-500/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-surface-3"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {l.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        ) : (
          /* Marketing navigation */
          <nav className="hidden md:flex items-center gap-1">
            {marketingLinks.map((l) => (
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
        )}

        {/* Right side CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAppRoute ? (
            <Link to="/coach">
              <Button size="sm" className="bg-gradient-teal text-primary-foreground font-semibold hover:opacity-90 gap-2">
                <MessageCircle className="w-3.5 h-3.5" />
                AI Coach
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground hover:border-primary/50">
                  Sign In
                </Button>
              </Link>
              <Link to="/onboarding">
                <Button size="sm" className="bg-gradient-teal text-primary-foreground font-semibold hover:opacity-90 glow-teal">
                  Start Free
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
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
            {(isAppRoute ? appLinks : [{ label: "Home", href: "/", icon: LayoutDashboard }, ...marketingLinks.map(l => ({ ...l, icon: LayoutDashboard }))]).map((l) => {
              const Icon = "icon" in l ? l.icon : LayoutDashboard;
              return (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === l.href
                      ? "text-teal bg-teal-500/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {l.label}
                </Link>
              );
            })}
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
