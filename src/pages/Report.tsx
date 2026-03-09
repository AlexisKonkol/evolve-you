import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Sparkles, Zap, Brain, Heart, BookOpen, Rocket,
  Users, Globe, FlaskConical, ArrowRight, Share2,
  Download, Twitter, Link2, Check, Star, Lightbulb,
  Target, TrendingUp, GitBranch, RefreshCw,
} from "lucide-react";

// ── Static report data (would come from user profile in production) ───────────

const reportMeta = {
  name: "Alex",
  archetype: "The Connector-Builder",
  generatedDate: "March 2026",
  explorationDays: 42,
  journalEntries: 14,
  experimentsCompleted: 3,
  pathsExplored: 8,
};

const curiosityProfile = [
  { label: "Technology & AI",        pct: 91, color: "coral",  icon: Zap      },
  { label: "Entrepreneurship",       pct: 84, color: "violet", icon: Rocket   },
  { label: "Creativity & Design",    pct: 76, color: "amber",  icon: Sparkles },
  { label: "Learning & Education",   pct: 82, color: "coral",  icon: BookOpen },
  { label: "Community Building",     pct: 68, color: "violet", icon: Users    },
  { label: "Future of Work",         pct: 73, color: "amber",  icon: Globe    },
];

const strengthSignals = [
  {
    label: "Creative Thinking",
    desc: "You naturally connect ideas across domains and generate novel approaches to problems.",
    strength: 88,
    color: "coral",
    icon: Sparkles,
  },
  {
    label: "Problem Solving",
    desc: "You appear energized by working through complexity. You look for root causes, not quick fixes.",
    strength: 92,
    color: "violet",
    icon: Brain,
  },
  {
    label: "Communication",
    desc: "Your reflections show a strong ability to articulate complex ideas in clear, human language.",
    strength: 94,
    color: "amber",
    icon: Users,
  },
  {
    label: "Strategic Thinking",
    desc: "You tend to see the bigger picture — how individual actions connect to longer-term directions.",
    strength: 85,
    color: "coral",
    icon: Target,
  },
];

const energySources = [
  { label: "Learning new ideas",              icon: BookOpen,   color: "coral"  },
  { label: "Building projects",              icon: Zap,        color: "violet" },
  { label: "Helping others grow",            icon: Heart,      color: "amber"  },
  { label: "Exploring emerging technologies", icon: Brain,      color: "coral"  },
  { label: "Connecting with curious people", icon: Users,      color: "violet" },
  { label: "Creating something original",    icon: Sparkles,   color: "amber"  },
];

const pathSuggestions = [
  {
    title: "AI Product Builder",
    match: 94,
    color: "coral",
    icon: Zap,
    desc: "Design AI-powered tools that solve real problems. You show the curiosity and systems thinking this path demands.",
    href: "/opportunity-engine",
  },
  {
    title: "Creative Strategist",
    match: 88,
    color: "violet",
    icon: Sparkles,
    desc: "Blend creative instincts with strategic direction. Your communication strength gives you a natural edge here.",
    href: "/opportunity-engine",
  },
  {
    title: "Learning Designer",
    match: 82,
    color: "amber",
    icon: BookOpen,
    desc: "Turn your knowledge and empathy into learning experiences that genuinely help people grow.",
    href: "/opportunity-engine",
  },
  {
    title: "Startup Explorer",
    match: 77,
    color: "coral",
    icon: Rocket,
    desc: "Your curiosity about entrepreneurship and technology creates strong alignment with early-stage building.",
    href: "/path-finder",
  },
];

const experiments = [
  {
    title: "7 Day AI Builder Challenge",
    color: "coral",
    icon: Zap,
    insight: "Discovered genuine enjoyment in the technical side of AI — not just the strategy layer.",
    days: 7,
    date: "February 2026",
  },
  {
    title: "Creative Project Sprint",
    color: "violet",
    icon: Sparkles,
    insight: "Launched a small newsletter. 60 people subscribed. Realized people valued my perspective more than I knew.",
    days: 14,
    date: "January 2026",
  },
  {
    title: "Startup Idea Exploration",
    color: "amber",
    icon: Rocket,
    insight: "My first idea didn't land — but the conversations pointed me toward something much more interesting.",
    days: 10,
    date: "December 2025",
  },
];

const nextDirections = [
  { label: "Explore building a small AI-powered tool",             icon: Zap,       color: "coral",  href: "/experiments"      },
  { label: "Learn the fundamentals of product design",            icon: Lightbulb, color: "violet", href: "/learn"            },
  { label: "Start a creative writing or content project",         icon: BookOpen,  color: "amber",  href: "/experiments"      },
  { label: "Have three conversations with people in AI products", icon: Users,     color: "coral",  href: "/network"          },
  { label: "Map your ideal workday and what it reveals",          icon: Target,    color: "violet", href: "/journal"          },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const cIcon: Record<string, string>   = { coral: "text-coral", violet: "text-violet", amber: "text-amber" };
const cBg: Record<string, string>     = { coral: "bg-coral-500/10", violet: "bg-violet-500/10", amber: "bg-amber-500/10" };
const cBorder: Record<string, string> = { coral: "border-coral-500/20", violet: "border-violet-500/20", amber: "border-amber-500/20" };
const cGrad: Record<string, string>   = {
  coral: "linear-gradient(135deg, hsl(var(--coral)), hsl(var(--peach)))",
  violet: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))",
  amber: "linear-gradient(135deg, hsl(var(--amber)), hsl(var(--coral)))",
};

function BarFill({ color, pct }: { color: string; pct: number }) {
  const cls = color === "coral" ? "bg-gradient-coral" : color === "amber" ? "bg-gradient-amber" : "";
  const style = color === "violet"
    ? { background: "hsl(var(--violet))", width: `${pct}%` }
    : { width: `${pct}%` };
  return (
    <div className="h-2 bg-border rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${cls}`} style={style} />
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Report() {
  const [copied, setCopied] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + "/report");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-24">
        <div className="container max-w-3xl px-6" ref={reportRef}>

          {/* ── Report header card ────────────────────────────────── */}
          <div className="rounded-3xl p-8 mb-8 relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, hsl(var(--coral) / 0.12), hsl(var(--violet) / 0.1), hsl(var(--amber) / 0.08))",
              border: "1px solid hsl(var(--coral) / 0.2)",
            }}>
            {/* Decorative glow */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(var(--coral)), transparent)" }} />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-10 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(var(--violet)), transparent)" }} />

            <div className="relative">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
                    style={{ background: "hsl(var(--coral) / 0.15)", color: "hsl(var(--coral))", border: "1px solid hsl(var(--coral) / 0.25)" }}>
                    <Sparkles className="w-3 h-3" />
                    Pathly Report · {reportMeta.generatedDate}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {reportMeta.name}'s Path Report
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Archetype: <span className="text-foreground font-semibold">{reportMeta.archetype}</span>
                  </p>
                </div>
                {/* Share buttons */}
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline"
                    className="border-border hover:border-coral-500/40 gap-1.5 text-xs"
                    onClick={handleCopyLink}>
                    {copied ? <Check className="w-3.5 h-3.5 text-coral" /> : <Link2 className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy link"}
                  </Button>
                  <Button size="sm"
                    className="gap-1.5 text-xs text-primary-foreground font-semibold hover:opacity-90"
                    style={{ background: cGrad.coral }}>
                    <Share2 className="w-3.5 h-3.5" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Days exploring",       value: reportMeta.explorationDays },
                  { label: "Journal entries",       value: reportMeta.journalEntries  },
                  { label: "Experiments tried",     value: reportMeta.experimentsCompleted },
                  { label: "Paths explored",        value: reportMeta.pathsExplored   },
                ].map((s) => (
                  <div key={s.label} className="text-center rounded-xl p-3"
                    style={{ background: "hsl(var(--background) / 0.5)", border: "1px solid hsl(var(--border) / 0.6)" }}>
                    <div className="text-2xl font-bold text-foreground">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Section 1: Curiosity Profile ──────────────────────── */}
          <section className="mb-8">
            <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
              <SectionHeader
                icon={<Brain className="w-4 h-4 text-coral" />}
                iconBg="bg-coral-500/10"
                number="01"
                title="Your Curiosity Profile"
                desc="The areas where your attention naturally returns — signals of who you're becoming."
              />
              <div className="space-y-4 mt-5">
                {curiosityProfile.map((c) => {
                  const CIcon = c.icon;
                  return (
                    <div key={c.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <CIcon className={`w-3.5 h-3.5 ${cIcon[c.color]}`} />
                          <span className="text-sm font-medium text-foreground">{c.label}</span>
                        </div>
                        <span className={`text-sm font-bold ${cIcon[c.color]}`}>{c.pct}%</span>
                      </div>
                      <BarFill color={c.color} pct={c.pct} />
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-5 leading-relaxed italic">
                These aren't personality labels — they're patterns of where your curiosity naturally travels.
              </p>
            </div>
          </section>

          {/* ── Section 2: Strength Signals ───────────────────────── */}
          <section className="mb-8">
            <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
              <SectionHeader
                icon={<Star className="w-4 h-4 text-amber" />}
                iconBg="bg-amber-500/10"
                number="02"
                title="Your Strength Signals"
                desc="Capabilities that appear consistently across your reflections and activities."
              />
              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                {strengthSignals.map((s) => {
                  const SIcon = s.icon;
                  return (
                    <div key={s.label} className={`rounded-xl p-4 border ${cBorder[s.color]}`}
                      style={{ background: `hsl(var(--${s.color === "coral" ? "coral" : s.color === "violet" ? "violet" : "amber"}) / 0.04)` }}>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${cBg[s.color]}`}>
                          <SIcon className={`w-3.5 h-3.5 ${cIcon[s.color]}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-bold ${cIcon[s.color]}`}>{s.label}</span>
                            <span className="text-xs text-muted-foreground">{s.strength}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <BarFill color={s.color} pct={s.strength} />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Section 3: Energy Sources ─────────────────────────── */}
          <section className="mb-8">
            <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
              <SectionHeader
                icon={<Heart className="w-4 h-4 text-coral" />}
                iconBg="bg-coral-500/10"
                number="03"
                title="Your Energy Sources"
                desc="Activities and experiences that appear to give you momentum and drive."
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
                {energySources.map((e) => {
                  const EIcon = e.icon;
                  return (
                    <div key={e.label} className={`rounded-xl p-3 border ${cBorder[e.color]} text-center`}
                      style={{ background: `hsl(var(--${e.color === "coral" ? "coral" : e.color === "violet" ? "violet" : "amber"}) / 0.05)` }}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2 ${cBg[e.color]}`}>
                        <EIcon className={`w-4 h-4 ${cIcon[e.color]}`} />
                      </div>
                      <p className="text-xs font-medium text-foreground leading-tight">{e.label}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed italic">
                These signals emerged from your journal reflections and exploration patterns.
              </p>
            </div>
          </section>

          {/* ── Section 4: Path Suggestions ───────────────────────── */}
          <section className="mb-8">
            <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
              <SectionHeader
                icon={<GitBranch className="w-4 h-4 text-violet" />}
                iconBg="bg-violet-500/10"
                number="04"
                title="Paths You May Enjoy Exploring"
                desc="These aren't prescriptions — they're invitations. Each one aligns with different aspects of who you are."
              />
              <div className="space-y-3 mt-5">
                {pathSuggestions.map((p) => {
                  const PIcon = p.icon;
                  return (
                    <Link key={p.title} to={p.href}
                      className="flex items-center gap-4 bg-surface-2 rounded-xl p-4 hover:bg-surface-3 transition-colors group">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cBg[p.color]}`}
                        style={{ background: cGrad[p.color] }}>
                        <PIcon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm font-bold text-foreground">{p.title}</h3>
                          <span className={`text-xs font-semibold ${cIcon[p.color]}`}>{p.match}% match</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-coral group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Section 5: Experiments ────────────────────────────── */}
          <section className="mb-8">
            <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
              <SectionHeader
                icon={<FlaskConical className="w-4 h-4 text-amber" />}
                iconBg="bg-amber-500/10"
                number="05"
                title="Experiments You've Completed"
                desc="Each experiment revealed something new about your interests, energy, and direction."
              />
              <div className="space-y-4 mt-5">
                {experiments.map((exp, i) => {
                  const EIcon = exp.icon;
                  return (
                    <div key={i} className={`border rounded-xl p-4 ${cBorder[exp.color]}`}
                      style={{ background: `hsl(var(--${exp.color === "coral" ? "coral" : exp.color === "violet" ? "violet" : "amber"}) / 0.04)` }}>
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cBg[exp.color]}`}>
                          <EIcon className={`w-4 h-4 ${cIcon[exp.color]}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-sm font-bold text-foreground">{exp.title}</h3>
                            <span className="text-xs text-muted-foreground">{exp.days} days · {exp.date}</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <Sparkles className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                            <p className="text-xs text-muted-foreground leading-relaxed italic">"{exp.insight}"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Section 6: Next Directions ────────────────────────── */}
          <section className="mb-8">
            <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
              <SectionHeader
                icon={<TrendingUp className="w-4 h-4 text-coral" />}
                iconBg="bg-coral-500/10"
                number="06"
                title="Your Next Possible Directions"
                desc="Small steps worth exploring. Take one that feels right."
              />
              <div className="space-y-2 mt-5">
                {nextDirections.map((d, i) => {
                  const DIcon = d.icon;
                  return (
                    <Link key={i} to={d.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2 transition-colors group">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cBg[d.color]}`}>
                        <DIcon className={`w-3.5 h-3.5 ${cIcon[d.color]}`} />
                      </div>
                      <span className="text-sm text-foreground flex-1">{d.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-coral group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Share block ───────────────────────────────────────── */}
          <section className="mb-8">
            <div className="rounded-2xl p-8 text-center"
              style={{
                background: "linear-gradient(135deg, hsl(var(--coral) / 0.08), hsl(var(--violet) / 0.08))",
                border: "1px solid hsl(var(--coral) / 0.2)",
              }}>
              <h2 className="text-xl font-bold text-foreground mb-2">Share your report</h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Understanding yourself is the beginning of designing your future. Share this with someone who matters to you.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  className="gap-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  style={{ background: cGrad.coral }}
                  onClick={handleCopyLink}>
                  {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                  {copied ? "Link copied!" : "Copy report link"}
                </Button>
                <a
                  href={`https://twitter.com/intent/tweet?text=Just+read+my+Pathly+Report+—+it+revealed+patterns+I+hadn%27t+seen+in+myself.+Understanding+yourself+is+the+beginning.+%23Pathly`}
                  target="_blank"
                  rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2 text-sm border-border hover:border-coral-500/40">
                    <Twitter className="w-4 h-4" />
                    Share on X
                  </Button>
                </a>
                <Button variant="outline" className="gap-2 text-sm border-border hover:border-coral-500/40"
                  onClick={() => window.print()}>
                  <Download className="w-4 h-4" />
                  Save as PDF
                </Button>
              </div>
            </div>
          </section>

          {/* ── Footer message ────────────────────────────────────── */}
          <div className="text-center py-6 border-t border-border/40">
            <p className="text-sm text-muted-foreground italic">
              "Understanding yourself is the beginning of designing your future."
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2">Pathly · {reportMeta.generatedDate}</p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  iconBg,
  number,
  title,
  desc,
}: {
  icon: React.ReactNode;
  iconBg: string;
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">{number}</span>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
