import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, Compass, BookOpen, Sparkles } from "lucide-react";

const navLinks = [
  { label: "Identity", href: "/identity-profile", icon: Sparkles },
  { label: "Paths", href: "/paths", icon: Compass },
  { label: "Journal", href: "/journal", icon: BookOpen },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

function NavoLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="22" fill="#000"/>
      <ellipse cx="50" cy="56" rx="38" ry="11" stroke="#D85A30" strokeWidth="2.5" fill="none" opacity="0.6"/>
      <ellipse cx="50" cy="56" rx="30" ry="8" stroke="#D85A30" strokeWidth="1" fill="none" opacity="0.3"/>
      <path d="M50 12 L39 58 L50 53 Z" fill="#9B3520"/>
      <path d="M50 12 L61 58 L50 53 Z" fill="#F07050"/>
      <path d="M39 58 L50 53 L50 70 Z" fill="#C04535"/>
      <path d="M61 58 L50 53 L50 70 Z" fill="#E05540"/>
      <circle cx="50" cy="12" r="3" fill="white" opacity="0.9"/>
      <path d="M26 22 L27.5 26 L32 28 L27.5 30 L26 34 L24.5 30 L20 28 L24.5 26 Z" fill="#FFB090" opacity="0.8"/>
      <path d="M72 20 L73 22.5 L75.5 23.5 L73 24.5 L72 27 L71 24.5 L68.5 23.5 L71 22.5 Z" fill="#FFB090" opacity="0.7"/>
      <circle cx="35" cy="15" r="1" fill="#FFB090" opacity="0.5"/>
      <circle cx="68" cy="35" r="1" fill="#FFB090" opacity="0.4"/>
    </svg>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isAppRoute = navLinks.some((l) => l.href === location.pathname);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "glass border-b border-border/40 py-3" : "py-4"
    }`}>
      <div className="container max-w-6xl flex items-center gap-2 px-6">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0 mr-4">
          <NavoLogo size={30} />
          <span className="font-bold text-foreground tracking-tight text-sm">
            NAV<span className="text-gradient-coral">O</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5 flex-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.href;
            return (
              <Link key={link.href} to={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? "text-coral bg-coral-500/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}>
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2 ml-auto">
          {isAppRoute ? (
            <Link to="/profile">
              <Button variant="outline" size="sm" className="border-border/60 text-muted-foreground hover:text-foreground hover:border-coral-500/40 h-8 text-xs rounded-lg">
                My Profile
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="border-border/60 text-muted-foreground hover:text-foreground hover:border-coral-500/40 h-8 text-xs rounded-lg">
                  Sign In
                </Button>
              </Link>
              <Link to="/onboarding">
                <Button size="sm" className="bg-gradient-coral text-primary-foreground font-semibold hover:opacity-90 h-8 text-xs rounded-lg glow-coral">
                  Rediscover your edge
                </Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden ml-auto text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass border-t border-border/40 mt-1">
          <div className="container px-6 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = location.pathname === link.href;
              return (
                <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active ? "text-coral bg-coral-500/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}>
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-border/40">
              <Link to="/onboarding" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-gradient-coral text-primary-foreground font-semibold">
                  Rediscover your edge
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
