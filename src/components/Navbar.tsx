import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "COMPASS", href: "/compass" },
  { label: "Dashboard", href: "/dashboard" },
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
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <>
      <style>{`
        .navbar-desktop {
          display: none;
        }
        .navbar-mobile {
          display: block;
        }
        @media (min-width: 768px) {
          .navbar-desktop {
            display: flex;
          }
          .navbar-mobile {
            display: none;
          }
        }
      `}</style>
      <header 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "all 0.3s ease",
          backgroundColor: scrolled ? "rgba(10,10,10,0.95)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
          paddingTop: scrolled ? "12px" : "16px",
          paddingBottom: scrolled ? "12px" : "16px"
        }}
      >
        <nav style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px" }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
            <NavoLogo size={32} />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "20px", fontWeight: 600, color: "white" }}>NAVO</span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <div className="navbar-desktop" style={{ gap: "28px" }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    textDecoration: "none",
                    color: location.pathname === link.href ? "#FF6B2B" : "rgba(255,255,255,0.5)",
                    transition: "color 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = location.pathname === link.href ? "#FF6B2B" : "rgba(255,255,255,0.5)";
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side buttons */}
            <div className="navbar-desktop" style={{ alignItems: "center", gap: "12px" }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Sign In
              </button>
              
              <button
                onClick={() => navigate('/signup')}
                style={{
                  background: "#FF6B2B",
                  border: "none",
                  color: "white",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  borderRadius: "999px",
                  padding: "10px 20px",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 107, 43, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Find Your Direction →
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="navbar-mobile"
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              padding: "8px"
            }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "rgba(10,10,10,0.98)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            padding: "24px"
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "16px",
                    fontWeight: 500,
                    textDecoration: "none",
                    color: location.pathname === link.href ? "#FF6B2B" : "rgba(255,255,255,0.7)",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = location.pathname === link.href ? "#FF6B2B" : "rgba(255,255,255,0.7)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {link.label}
                </Link>
              ))}
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" }}>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "white",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    width: "100%",
                    textAlign: "center"
                  }}
                >
                  Sign In
                </button>
                
                <button
                  onClick={() => navigate('/signup')}
                  style={{
                    background: "#FF6B2B",
                    border: "none",
                    color: "white",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    width: "100%",
                    textAlign: "center"
                  }}
                >
                  Find Your Direction →
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
