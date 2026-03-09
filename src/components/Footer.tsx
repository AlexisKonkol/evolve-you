import { Link } from "react-router-dom";
import pathlyLogo from "@/assets/pathly-logo.png";

const footerLinks = {
  Platform: [
    { label: "How It Works",  href: "/"             },
    { label: "Opportunities", href: "/opportunities" },
    { label: "Learn",         href: "/learn"         },
    { label: "AI Coach",      href: "/coach"         },
  ],
  Community: [
    { label: "Community Hub",       href: "/community" },
    { label: "Career Pivots",       href: "/community" },
    { label: "Midlife Reinvention", href: "/community" },
    { label: "AI Beginners",        href: "/community" },
  ],
  Company: [
    { label: "Our Mission", href: "/"        },
    { label: "Pricing",     href: "/pricing" },
    { label: "Blog",        href: "/"        },
    { label: "Contact",     href: "/"        },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/40" style={{ background: "hsl(var(--surface-1))" }}>
      <div className="container max-w-5xl py-16 px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src={pathlyLogo} alt="Pathly" className="w-7 h-7 rounded-lg object-contain" />
              <span className="font-bold text-foreground tracking-tight">
                Path<span className="text-gradient-coral">ly</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
              Find Your Next Path. A platform for discovering your direction in the AI age.
            </p>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="section-divider mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© 2025 Pathly. All rights reserved.</span>
          <span>Find Your Next Path.</span>
        </div>
      </div>
    </footer>
  );
}
