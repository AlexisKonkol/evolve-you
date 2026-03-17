import { Link } from "react-router-dom";

const footerLinks = {
  Product: [
    { label: "How It Works",  href: "/" },
    { label: "Identity Reset", href: "/onboarding" },
    { label: "My Paths",      href: "/paths" },
    { label: "AI Coach",      href: "/coach" },
  ],
  Community: [
    { label: "Career Transitions", href: "/community" },
    { label: "AI Displacement",    href: "/community" },
    { label: "Reinvention Stories", href: "/community" },
    { label: "Journal",            href: "/journal" },
  ],
  Company: [
    { label: "Our Mission", href: "/" },
    { label: "Pricing",     href: "/pricing" },
    { label: "Blog",        href: "/" },
    { label: "Contact",     href: "/" },
  ],
};

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
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/40" style={{ background: "hsl(var(--surface-1))" }}>
      <div className="container max-w-5xl py-16 px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <NavoLogo size={28} />
              <span className="font-bold text-foreground tracking-tight text-sm">
                NAV<span className="text-gradient-coral">O</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
              Rediscover your edge. Built for the person AI displaced, laid off, or burned out.
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
          <span>© 2025 NAVO. All rights reserved.</span>
          <span>Rediscover your edge.</span>
        </div>
      </div>
    </footer>
  );
}
