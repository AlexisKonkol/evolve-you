import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu, X, Zap, LayoutDashboard, Map, Star, Heart, Sparkles,
  Shield, Compass, Eye, GitBranch, TrendingUp, BookOpen,
  FlaskConical, Wrench, Users, MessagesSquare, Handshake,
  Rss, ChevronDown,
} from "lucide-react";

// ─── Nav structure ───────────────────────────────────────────────
const navSections = [
  {
    label: "Identity",
    color: "teal" as const,
    items: [
      { label: "Identity Map", href: "/identity-map", icon: Map, desc: "Visualize your strengths network" },
      { label: "Strengths", href: "/identity-map", icon: Star, desc: "Explore your core capabilities" },
      { label: "Values", href: "/life-clarity", icon: Heart, desc: "Discover what drives you" },
      { label: "Life Clarity", href: "/life-clarity", icon: Sparkles, desc: "Guided deep reflection" },
      { label: "Confidence Builder", href: "/confidence-builder", icon: Shield, desc: "Build belief in yourself" },
    ],
  },
  {
    label: "Explore",
    color: "violet" as const,
    items: [
      { label: "Opportunity Radar", href: "/opportunities", icon: Compass, desc: "Scan emerging roles & trends" },
      { label: "Future Vision", href: "/future-vision", icon: Eye, desc: "Define who you want to become" },
      { label: "Career Paths", href: "/paths", icon: GitBranch, desc: "Step-by-step transition roadmaps" },
      { label: "Industry Trends", href: "/opportunities", icon: TrendingUp, desc: "AI & automation insights" },
    ],
  },
  {
    label: "Build",
    color: "amber" as const,
    items: [
      { label: "Learning Modules", href: "/learn", icon: BookOpen, desc: "Short, focused skill lessons" },
      { label: "Reinvention Paths", href: "/paths", icon: GitBranch, desc: "Your personalized roadmap" },
      { label: "Experiments", href: "/experiments", icon: FlaskConical, desc: "Test new directions safely" },
      { label: "Skill Builder", href: "/learn", icon: Wrench, desc: "Develop in-demand capabilities" },
    ],
  },
  {
    label: "Community",
    color: "teal" as const,
    items: [
      { label: "Discussion Groups", href: "/community", icon: MessagesSquare, desc: "Connect with reinventors" },
      { label: "Shared Experiments", href: "/experiments", icon: FlaskConical, desc: "See what others are testing" },
      { label: "Mentorship", href: "/community", icon: Handshake, desc: "Find a guide for your journey" },
      { label: "Community Feed", href: "/community", icon: Rss, desc: "Stories from the community" },
    ],
  },
];

const colorMap = {
  teal: {
    text: "text-teal",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    dot: "bg-teal",
    active: "text-teal bg-teal-500/10",
  },
  violet: {
    text: "text-violet",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    dot: "bg-violet-500",
    active: "text-violet bg-violet-500/10",
  },
  amber: {
    text: "text-amber",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    dot: "bg-amber",
    active: "text-amber bg-amber-500/10",
  },
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);

  const isAppRoute = ["/dashboard", "/identity-map", "/opportunities", "/paths", "/learn",
    "/experiments", "/coach", "/community", "/profile", "/life-clarity"].some(
    (p) => location.pathname === p
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [location.pathname]);

  const isSectionActive = (section: typeof navSections[0]) =>
    section.items.some((i) => i.href === location.pathname);

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-border/50 py-3" : "py-4"
      }`}
    >
      <div className="container flex items-center gap-2">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0 mr-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-teal flex items-center justify-center glow-teal group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-wide text-foreground">
            EV<span className="text-gradient-teal">OLV</span>E
          </span>
        </Link>

        {/* ── Desktop navigation ── */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1">

          {/* Dashboard — always visible single link */}
          <Link
            to="/dashboard"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/dashboard"
                ? "text-teal bg-teal-500/10"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </Link>

          {/* Dropdown sections */}
          {navSections.map((section) => {
            const cm = colorMap[section.color];
            const isActive = isSectionActive(section);
            const isOpen = openDropdown === section.label;

            return (
              <div key={section.label} className="relative">
                <button
                  onClick={() => setOpenDropdown(isOpen ? null : section.label)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive || isOpen
                      ? cm.active
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {section.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown panel */}
                {isOpen && (
                  <div className={`absolute top-full left-0 mt-2 w-64 bg-surface-2 border ${cm.border} rounded-2xl shadow-card overflow-hidden animate-fade-in`}>
                    {/* Header stripe */}
                    <div className={`px-4 py-2.5 border-b border-border/40 ${cm.bg}`}>
                      <p className={`text-xs font-bold uppercase tracking-widest ${cm.text}`}>
                        {section.label}
                      </p>
                    </div>
                    <div className="p-2">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.href;
                        return (
                          <Link
                            key={item.label}
                            to={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                              active
                                ? `${cm.bg} ${cm.text}`
                                : "hover:bg-surface-3 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${active ? cm.bg : "bg-surface-3"}`}>
                              <Icon className={`w-3.5 h-3.5 ${active ? cm.text : "text-muted-foreground"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${active ? cm.text : "text-foreground"}`}>
                                {item.label}
                              </p>
                              <p className="text-xs text-muted-foreground/70 truncate">{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ── Right actions ── */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          {isAppRoute ? (
            <Link to="/profile">
              <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground hover:border-primary/40 h-8 text-xs">
                My Profile
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground hover:border-primary/40 h-8 text-xs">
                  Sign In
                </Button>
              </Link>
              <Link to="/onboarding">
                <Button size="sm" className="bg-gradient-teal text-primary-foreground font-semibold hover:opacity-90 glow-teal h-8 text-xs">
                  Start Free
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden ml-auto text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-border/50 mt-1 max-h-[80vh] overflow-y-auto">
          <div className="container py-4 space-y-1">
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === "/dashboard" ? "text-teal bg-teal-500/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>

            {navSections.map((section) => {
              const cm = colorMap[section.color];
              return (
                <div key={section.label}>
                  <p className={`px-4 py-2 text-xs font-bold uppercase tracking-widest ${cm.text}`}>
                    {section.label}
                  </p>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                          location.pathname === item.href
                            ? `${cm.bg} ${cm.text}`
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              );
            })}

            <div className="pt-3 border-t border-border">
              <Link to="/onboarding" onClick={() => setMobileOpen(false)}>
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
