import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, Heart, ChevronDown } from "lucide-react";

/* ── COMPASS steps ─────────────────────────────────────────────────── */
const compassSteps = [
  {
    letter: "C",
    name: "Clear the Noise",
    desc: "Separate who you are from the role you lost.",
  },
  {
    letter: "O",
    name: "Offer Yourself Respect",
    desc: "Stop treating this moment as a failure. It isn't.",
  },
  {
    letter: "M",
    name: "Map What Matters",
    desc: "Surface the values, strengths, and energy that were always yours.",
  },
  {
    letter: "P",
    name: "Pick Your Next Move",
    desc: "Choose one direction worth exploring — not committing to.",
  },
  {
    letter: "A",
    name: "Adjust Your Environment",
    desc: "Design the conditions that let the real you show up.",
  },
  {
    letter: "S",
    name: "Stack Small Proofs",
    desc: "Build evidence for your new identity one small action at a time.",
  },
  {
    letter: "S",
    name: "Stay With It",
    desc: "Reinvention isn't an event. It's a practice. Keep going.",
  },
];

/* ── Main ───────────────────────────────────────────────────────────── */
export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div
          className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ background: "hsl(var(--coral) / 0.07)" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: "hsl(45 90% 50% / 0.05)" }}
        />

        <div className="container relative z-10 text-center max-w-3xl mx-auto px-6">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-10 border"
            style={{
              background: "hsl(var(--coral) / 0.08)",
              borderColor: "hsl(var(--coral) / 0.18)",
              color: "hsl(var(--coral))",
            }}
          >
            <Heart className="w-3.5 h-3.5" />
            For the person AI displaced, laid off, or burned out
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl text-foreground leading-[1.08] tracking-tight mb-6">
            The job ended.
            <br />
            <span className="text-gradient-coral italic">You didn't.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            NAVO helps you find your direction and take your next step —
            one honest move at a time.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <Link to="/compass">
              <Button
                size="lg"
                className="bg-gradient-coral text-primary-foreground font-semibold text-base px-8 py-6 rounded-xl glow-coral hover:opacity-90 transition-all hover:scale-[1.02] group gap-2"
              >
                Find Your Direction
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <a href="#compass-method">
              <Button
                size="lg"
                variant="outline"
                className="border-border text-muted-foreground hover:text-foreground hover:border-coral-500/40 text-base px-8 py-6 rounded-xl gap-2 bg-transparent"
              >
                See how it works ↓
              </Button>
            </a>
          </div>

          {/* Trust stats */}
          <div className="flex items-center justify-center gap-10 text-sm text-muted-foreground flex-wrap">
            {[
              { n: "4 min", l: "to first insight" },
              { n: "Free", l: "to start" },
              { n: "Built", l: "for right now" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl font-bold text-foreground tracking-tight">{s.n}</div>
                <div className="text-xs mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll nudge */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 animate-bounce">
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </div>
      </section>

      {/* ── SECTION 2 — THE PROBLEM ────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="container max-w-2xl px-6 text-center relative z-10">
          <p className="text-coral text-xs font-semibold uppercase tracking-widest mb-5">
            The thing no one talks about
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 leading-snug">
            Most people respond to a crisis by doing more of what already felt wrong.
          </h2>
          <div
            className="rounded-2xl border p-8 text-left"
            style={{
              background: "hsl(var(--surface-1))",
              borderColor: "hsl(var(--border))",
            }}
          >
            <div
              className="border-l-2 pl-6 mb-6"
              style={{ borderColor: "hsl(var(--coral) / 0.5)" }}
            >
              <p className="text-lg font-semibold text-foreground italic font-display leading-relaxed">
                "Update the résumé. Apply to more jobs. Do more of what already felt wrong."
              </p>
            </div>
            <p className="text-muted-foreground leading-[1.9]">
              NAVO does something different. Before any path, any plan, any next step —
              we help you understand who you actually are.
            </p>
            <p className="text-muted-foreground leading-[1.9] mt-4">
              Not a job recommendation. Not a skills assessment. A real mirror held up to the person
              that existed long before any job title — and will exist long after the next one.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — THE COMPASS METHOD ────────────────────────────── */}
      <section
        id="compass-method"
        className="py-28 relative overflow-hidden"
        style={{ background: "hsl(var(--surface-1))" }}
      >
        <div className="container max-w-5xl px-6 relative z-10">
          <div className="text-center mb-14">
            {/* Compass icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
              style={{ background: "hsl(45 90% 50% / 0.1)", border: "1px solid hsl(45 90% 50% / 0.2)" }}>
              <svg width="26" height="26" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="40" stroke="hsl(45, 90%, 50%)" strokeWidth="4" fill="none" opacity="0.6"/>
                <circle cx="50" cy="50" r="30" stroke="hsl(45, 90%, 50%)" strokeWidth="2" fill="none" opacity="0.3"/>
                <path d="M50 14 L43 52 L50 48 Z" fill="hsl(30, 60%, 35%)"/>
                <path d="M50 14 L57 52 L50 48 Z" fill="hsl(25, 80%, 55%)"/>
                <path d="M43 52 L50 48 L50 62 Z" fill="hsl(28, 70%, 45%)"/>
                <path d="M57 52 L50 48 L50 62 Z" fill="hsl(22, 75%, 50%)"/>
                <circle cx="50" cy="14" r="3" fill="white" opacity="0.9"/>
              </svg>
            </div>

            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "hsl(45, 90%, 55%)" }}
            >
              The method
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Introducing the COMPASS Method™
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              7 steps. Your pace. AI that listens instead of pitches.
            </p>
          </div>

          {/* Cards grid — horizontal feel on wide, wraps on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {compassSteps.map((step, i) => (
              <div
                key={i}
                className="bg-gradient-card border border-border/40 rounded-2xl p-5 card-hover group"
                style={i === 6 ? { gridColumn: "span 1" } : {}}
              >
                {/* Letter pill */}
                <div
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl font-bold text-base mb-4 shrink-0"
                  style={{
                    background: "hsl(45 90% 50% / 0.12)",
                    border: "1px solid hsl(45 90% 50% / 0.25)",
                    color: "hsl(45, 90%, 55%)",
                  }}
                >
                  {step.letter}
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1.5">{step.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — FINAL CTA ──────────────────────────────────────── */}
      <section className="py-36 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "hsl(var(--coral) / 0.07)" }}
        />

        <div className="container max-w-2xl text-center relative z-10 px-6">
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6 leading-[1.1]">
            Clarity isn't found.
            <br />
            <span className="text-gradient-coral italic">It's built — one step at a time.</span>
          </h2>

          <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-lg mx-auto">
            Seven honest steps. No résumé required. No pretending you have it figured out.
          </p>

          <Link to="/compass">
            <Button
              size="lg"
              className="bg-gradient-coral text-primary-foreground font-semibold text-base px-10 py-6 rounded-xl glow-coral hover:opacity-90 transition-all hover:scale-[1.02] group gap-2"
            >
              Start Your Compass Session
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>

          <p className="text-xs text-muted-foreground/40 mt-6">
            Free to start. No email required. Your pace.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
