import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "How It Works", href: "/" },
    { label: "Opportunities", href: "/opportunities" },
    { label: "Learning Modules", href: "/learn" },
    { label: "AI Coach", href: "/coach" },
  ],
  Community: [
    { label: "Community Hub", href: "/community" },
    { label: "Career Pivots", href: "/community" },
    { label: "Midlife Reinvention", href: "/community" },
    { label: "AI Beginners", href: "/community" },
  ],
  Company: [
    { label: "Mission", href: "/" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/" },
    { label: "Contact", href: "/" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-surface-1">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-teal flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                EV<span className="text-gradient-teal">OLV</span>E
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
              Help humans evolve in an AI-shaped world. Your next chapter starts here.
            </p>
          </div>
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© 2025 EVOLVE. All rights reserved.</span>
          <span>The future belongs to those who reinvent themselves.</span>
        </div>
      </div>
    </footer>
  );
}
