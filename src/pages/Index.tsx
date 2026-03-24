import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function Index() {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');
        
        @media (max-width: 768px) {
          .hero-headline {
            font-size: 28px !important;
          }
          .hero-subline {
            font-size: 14px !important;
            max-width: 300px !important;
          }
          .hero-container {
            padding: 0 20px !important;
          }
        }
        
        @media (max-width: 480px) {
          .hero-headline {
            font-size: 24px !important;
          }
          .hero-subline {
            font-size: 13px !important;
            max-width: 280px !important;
          }
          .hero-container {
            padding: 0 15px !important;
          }
        }
      `}</style>
      
      {/* SECTION 1 — HERO */}
      <section style={{
        backgroundImage: "url('/hero-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden"
      }}>
        {/* Overlays */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(4,0,10,0.15) 0%, rgba(4,0,10,0.0) 20%, rgba(4,0,10,0.0) 50%, rgba(4,0,10,0.65) 82%, rgba(4,0,10,0.95) 100%)",
          zIndex: 1
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(4,0,10,0.25) 0%, transparent 22%, transparent 78%, rgba(4,0,10,0.25) 100%)",
          zIndex: 1
        }} />

        {/* NAVBAR */}
        <nav style={{
          position: "absolute",
          top: 0,
          width: "100%",
          padding: "20px 44px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10
        }}>
          {/* Left: Logo */}
          <a 
            href="/"
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "white",
              letterSpacing: "0.1em",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              textDecoration: "none"
            }}
          >
            NAVO
          </a>

          {/* Centre: Nav links */}
          <div style={{
            display: "flex",
            gap: "30px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "12px",
            color: "rgba(255,255,255,0.42)"
          }}>
            <a 
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                scrollToHowItWorks();
              }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              How it works
            </a>
            <a 
              href="/compass"
              onClick={(e) => {
                e.preventDefault();
                navigate('/compass');
              }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              COMPASS
            </a>
            <a 
              href="/dashboard"
              onClick={(e) => {
                e.preventDefault();
                navigate('/dashboard');
              }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Dashboard
            </a>
          </div>

          {/* Right: Buttons */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: "none",
                border: "none",
                fontSize: "12px",
                color: "rgba(255,255,255,0.35)",
                cursor: "pointer",
                fontFamily: "inherit"
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              style={{
                background: "white",
                color: "#0D0028",
                padding: "9px 20px",
                borderRadius: "3px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                cursor: "pointer",
                border: "none",
                fontFamily: "inherit"
              }}
            >
              Find Your Direction →
            </button>
          </div>
        </nav>

        {/* HERO TEXT */}
        <div style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          padding: "0 clamp(20px, 8vw, 140px)",
          zIndex: 5,
          width: "100%",
          boxSizing: "border-box"
        }} className="hero-container">
          {/* Badge pill */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            background: "rgba(192,132,252,0.1)",
            border: "1px solid rgba(192,132,252,0.22)",
            borderRadius: "999px",
            padding: "5px 16px",
            marginBottom: "20px"
          }}>
            <div style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#C084FC"
            }} />
            <span style={{
              fontSize: "10px",
              color: "rgba(192,132,252,0.75)",
              letterSpacing: "0.1em",
              fontWeight: 500,
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              For when surviving isn't enough anymore
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 5vw, 46px)",
            color: "white",
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            margin: "0 0 6px"
          }} className="hero-headline">
            When you can't see a way forward —
          </h1>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 5vw, 46px)",
            color: "#E9D5FF",
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 1.2,
            margin: "0 0 16px"
          }} className="hero-headline">
            NAVO helps you find one.
          </h2>

          {/* Subline */}
          <p style={{
            fontSize: "clamp(14px, 3vw, 15px)",
            color: "rgba(255,255,255,0.35)",
            lineHeight: 1.95,
            fontWeight: 300,
            marginBottom: "40px",
            maxWidth: "clamp(300px, 80vw, 450px)",
            marginLeft: "auto",
            marginRight: "auto",
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }} className="hero-subline">
            Direction, support and clarity —<br />
            for the moments that feel unbearable.
          </p>

          {/* CTA row */}
          <div style={{
            display: "flex",
            gap: "14px",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <button
              onClick={scrollToHowItWorks}
              style={{
                color: "rgba(220,190,255,0.35)",
                fontSize: "12px",
                fontWeight: 300,
                letterSpacing: "0.05em",
                cursor: "pointer",
                background: "none",
                border: "none",
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              See how it works ↓
            </button>
          </div>
        </div>

        {/* BOTTOM STATS */}
        <div style={{
          position: "absolute",
          bottom: "22px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: "38px",
          zIndex: 5
        }}>
          {/* Free stat */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "14px",
              color: "rgba(220,190,255,0.5)"
            }}>
              Free
            </div>
            <div style={{
              fontSize: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: "rgba(255,255,255,0.16)",
              marginTop: "3px",
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              to start
            </div>
          </div>

          {/* Divider */}
          <div style={{
            width: "1px",
            height: "26px",
            background: "rgba(255,255,255,0.07)"
          }} />

          {/* Time stat */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "14px",
              color: "rgba(220,190,255,0.5)"
            }}>
              4 min
            </div>
            <div style={{
              fontSize: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: "rgba(255,255,255,0.16)",
              marginTop: "3px",
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              to first insight
            </div>
          </div>

          {/* Divider */}
          <div style={{
            width: "1px",
            height: "26px",
            background: "rgba(255,255,255,0.07)"
          }} />

          {/* AI Coach stat */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "14px",
              color: "rgba(220,190,255,0.5)"
            }}>
              AI Coach
            </div>
            <div style={{
              fontSize: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: "rgba(255,255,255,0.16)",
              marginTop: "3px",
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              built in
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — HOW IT WORKS */}
      <section id="how-it-works" style={{
        background: "#06000F",
        padding: "72px 60px",
        borderTop: "1px solid rgba(139,92,246,0.08)"
      }}>
        {/* Centre label */}
        <div style={{
          fontSize: "9px",
          textTransform: "uppercase",
          letterSpacing: "0.24em",
          color: "rgba(192,132,252,0.35)",
          marginBottom: "22px",
          textAlign: "center",
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}>
          The NAVO Method
        </div>

        {/* Centre headline */}
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "28px",
          color: "white",
          lineHeight: 1.6,
          marginBottom: "14px",
          maxWidth: "560px",
          margin: "0 auto 14px",
          textAlign: "center",
          fontWeight: 400
        }}>
          The fog isn't failure.<br />
          <span style={{ color: "#E9D5FF", fontStyle: "italic" }}>
            It's the moment before clarity.
          </span>
        </h2>

        {/* Centre subline */}
        <p style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.28)",
          lineHeight: 1.95,
          fontWeight: 300,
          marginBottom: "44px",
          textAlign: "center",
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}>
          NAVO asks the questions that cut through the noise.<br />
          Your answers become your direction.
        </p>

        {/* 3 feature cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "14px",
          maxWidth: "660px",
          margin: "0 auto"
        }}>
          {/* COMPASS card */}
          <div
            onClick={() => navigate('/compass')}
            style={{
              background: "rgba(139,92,246,0.06)",
              border: "1px solid rgba(139,92,246,0.13)",
              borderRadius: "12px",
              padding: "26px 18px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139,92,246,0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(139,92,246,0.06)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "rgba(192,132,252,0.5)",
              marginBottom: "12px",
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              COMPASS
            </div>
            <p style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.48)",
              lineHeight: 1.75,
              margin: 0,
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              7 honest questions. What's<br />
              blocking you. What lights you up.
            </p>
          </div>

          {/* Spark Profile card */}
          <div
            onClick={() => navigate('/signup')}
            style={{
              background: "rgba(139,92,246,0.06)",
              border: "1px solid rgba(139,92,246,0.13)",
              borderRadius: "12px",
              padding: "26px 18px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139,92,246,0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(139,92,246,0.06)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "rgba(192,132,252,0.5)",
              marginBottom: "12px",
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              Spark Profile
            </div>
            <p style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.48)",
              lineHeight: 1.75,
              margin: 0,
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              Your purpose. Your energy.<br />
              Your possible futures — all mapped.
            </p>
          </div>

          {/* AI Coach card */}
          <div
            onClick={() => navigate('/signup')}
            style={{
              background: "rgba(139,92,246,0.06)",
              border: "1px solid rgba(139,92,246,0.13)",
              borderRadius: "12px",
              padding: "26px 18px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139,92,246,0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(139,92,246,0.06)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "rgba(192,132,252,0.5)",
              marginBottom: "12px",
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              AI Coach
            </div>
            <p style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.48)",
              lineHeight: 1.75,
              margin: 0,
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              Knows your whole story.<br />
              Holds you accountable every day.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 — WHO THIS IS FOR */}
      <section style={{
        background: "#04000A",
        padding: "72px 60px",
        borderTop: "1px solid rgba(139,92,246,0.06)"
      }}>
        {/* Centre headline */}
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "28px",
          color: "white",
          lineHeight: 1.55,
          marginBottom: "32px",
          textAlign: "center",
          fontWeight: 400
        }}>
          Your stars are already there.<br />
          <span style={{ color: "#E9D5FF", fontStyle: "italic" }}>
            NAVO helps you read them.
          </span>
        </h2>

        {/* 3 bullet rows */}
        <div style={{
          maxWidth: "500px",
          margin: "0 auto 38px",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          {/* Row 1 */}
          <div style={{
            display: "flex",
            gap: "14px",
            alignItems: "flex-start",
            padding: "16px 20px",
            background: "rgba(139,92,246,0.05)",
            border: "1px solid rgba(139,92,246,0.11)",
            borderRadius: "10px"
          }}>
            <div style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "rgba(192,132,252,0.55)",
              flexShrink: 0,
              marginTop: "6px"
            }} />
            <p style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.65,
              fontWeight: 300,
              margin: 0,
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              You've been running on empty and don't know how to stop
            </p>
          </div>

          {/* Row 2 */}
          <div style={{
            display: "flex",
            gap: "14px",
            alignItems: "flex-start",
            padding: "16px 20px",
            background: "rgba(139,92,246,0.05)",
            border: "1px solid rgba(139,92,246,0.11)",
            borderRadius: "10px"
          }}>
            <div style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "rgba(192,132,252,0.55)",
              flexShrink: 0,
              marginTop: "6px"
            }} />
            <p style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.65,
              fontWeight: 300,
              margin: 0,
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              Something happened that changed everything — and you're still standing
            </p>
          </div>

          {/* Row 3 */}
          <div style={{
            display: "flex",
            gap: "14px",
            alignItems: "flex-start",
            padding: "16px 20px",
            background: "rgba(139,92,246,0.05)",
            border: "1px solid rgba(139,92,246,0.11)",
            borderRadius: "10px"
          }}>
            <div style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "rgba(192,132,252,0.55)",
              flexShrink: 0,
              marginTop: "6px"
            }} />
            <p style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.65,
              fontWeight: 300,
              margin: 0,
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              You know there's more — you just can't see the path to it yet
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate('/signup')}
            style={{
              background: "white",
              color: "#0D0028",
              padding: "15px 38px",
              borderRadius: "3px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              cursor: "pointer",
              border: "none",
              marginBottom: "14px",
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            Start for free →
          </button>
          <p style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.14)",
            fontWeight: 300,
            margin: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            No credit card · 4 minutes to your first insight
          </p>
        </div>
      </section>
    </>
  );
}
