import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Brain, Sparkles, TrendingUp, Map, ArrowRight,
  Zap, Target, Heart, BookOpen, Users, MessageCircle,
  Share2, Compass, Eye, Shield, Lightbulb,
} from "lucide-react";
import { TodayEvolution } from "@/components/dashboard/TodayEvolution";
import { ReinventionStreaks } from "@/components/dashboard/ReinventionStreaks";
import { FutureIdentityTracker } from "@/components/dashboard/FutureIdentityTracker";
import { MicroExperiments } from "@/components/dashboard/MicroExperiments";
import { ReinventionInsights } from "@/components/dashboard/ReinventionInsights";
import { EvolutionMap } from "@/components/dashboard/EvolutionMap";
import { EmergingIdentity } from "@/components/dashboard/EmergingIdentity";
import { MomentumTracker } from "@/components/dashboard/MomentumTracker";

const strengthClusters = [
  { label: "Communication",    score: 92, color: "teal"   },
  { label: "Systems Thinking", score: 78, color: "violet" },
  { label: "Leadership",       score: 85, color: "amber"  },
  { label: "Problem Solving",  score: 88, color: "teal"   },
  { label: "Creativity",       score: 71, color: "violet" },
];

const identityProfile = {
  archetype: "The Connector-Builder",
  strengths: ["Cross-functional communication", "Team coordination", "Process optimisation", "Client empathy"],
  curiosityPatterns: ["Systems & automation", "Human behaviour", "Emerging technology", "Org design"],
  workStyle: "Collaborative with independent depth",
  motivations: ["Tangible impact", "Continuous learning", "Building teams"],
  values: ["Integrity", "Growth", "Connection", "Autonomy"],
};

const suggestedRoles = [
  { title: "AI Workflow Designer",          match: 94, icon: Zap,    tag: "Fastest Growing", tagColor: "teal"   },
  { title: "Digital Experience Strategist", match: 88, icon: Target, tag: "High Income",     tagColor: "amber"  },
  { title: "Automation Consultant",         match: 82, icon: Brain,  tag: "Emerging Field",  tagColor: "violet" },
];

const coachInsights = [
  "Your communication strengths are rare in technical fields — this is who you're becoming.",
  "You've grown leadership naturally. That's an identity, not just a skill.",
  "Your curiosity about systems is a signal — lean into it. It's pointing somewhere.",
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="container max-w-7xl px-6">

          {/* ── Header ──────────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-coral mb-2">Your journey</p>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Welcome back, <span className="text-gradient-coral">Alex</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1.5">
                You're becoming someone new · 12-day streak 🔥
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link to="/profile">
                <Button variant="outline" size="sm" className="border-border hover:border-coral-500/40 gap-2 text-xs">
                  <Share2 className="w-3.5 h-3.5 text-coral" />
                  My Profile
                </Button>
              </Link>
              <Link to="/coach">
                <Button variant="outline" size="sm" className="border-border hover:border-coral-500/40 gap-2 text-xs">
                  <MessageCircle className="w-3.5 h-3.5 text-coral" />
                  Talk to your coach
                </Button>
              </Link>
              <Link to="/opportunities">
                <Button size="sm" className="bg-gradient-coral text-primary-foreground gap-2 hover:opacity-90 text-xs">
                  Explore paths that fit you
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* ── PATH progress ───────────────────────────────────── */}
          <div className="bg-gradient-card border border-border/50 rounded-2xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-semibold text-foreground text-sm">Your PATH journey</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  You're in the <span className="text-amber">Assess</span> phase — understanding who you are
                </p>
              </div>
              <span className="text-coral font-bold text-xl">35%</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-coral rounded-full transition-all duration-700" style={{ width: "35%" }} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "Pause",        done: true,  active: false },
                { label: "Assess",       done: false, active: true  },
                { label: "Test",         done: false, active: false },
                { label: "Head Forward", done: false, active: false },
              ].map((s) => (
                <span key={s.label} className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  s.done   ? "border-coral-500/35 bg-coral-500/10 text-coral"  :
                  s.active ? "border-amber-500/35 bg-amber-500/10 text-amber"  :
                             "border-border text-muted-foreground"
                }`}>
                  {s.done ? "✓ " : ""}{s.label}{s.active ? " →" : ""}
                </span>
              ))}
            </div>
          </div>

          {/* ── Main grid ───────────────────────────────────────── */}
          <div className="grid lg:grid-cols-3 gap-5">

            {/* Left col */}
            <div className="lg:col-span-2 space-y-5">

              <MomentumTracker />

              {/* Identity Profile */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 bg-coral-500/10 rounded-xl flex items-center justify-center">
                    <Brain className="w-4 h-4 text-coral" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-sm">Who You Are</h2>
                    <p className="text-xs text-muted-foreground">Your identity profile — the foundation of your path</p>
                  </div>
                </div>

                {/* Archetype */}
                <div className="rounded-xl p-4 mb-5 border"
                  style={{ background: "hsl(var(--coral) / 0.05)", borderColor: "hsl(var(--coral) / 0.15)" }}>
                  <p className="text-xs text-coral font-semibold uppercase tracking-wider mb-1">Your archetype</p>
                  <p className="text-lg font-bold text-foreground">{identityProfile.archetype}</p>
                  <p className="text-xs text-muted-foreground mt-1">This is how your strengths naturally cluster — not a label, a lens.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: "Natural Strengths",    items: identityProfile.strengths,        icon: Zap,      color: "coral"  },
                    { label: "What Draws You In",    items: identityProfile.curiosityPatterns, icon: Sparkles, color: "violet" },
                    { label: "What Motivates You",   items: identityProfile.motivations,      icon: Heart,    color: "amber"  },
                    { label: "What You Stand For",   items: identityProfile.values,           icon: Target,   color: "coral"  },
                  ].map((section) => (
                    <div key={section.label} className="bg-surface-2 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <section.icon className={`w-3.5 h-3.5 ${
                          section.color === "coral"  ? "text-coral"  :
                          section.color === "amber"  ? "text-amber"  : "text-violet"
                        }`} />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{section.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {section.items.map((item) => (
                          <span key={item} className="text-xs px-2 py-0.5 bg-surface-3 rounded-md text-foreground/75">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 bg-surface-2 rounded-xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">How you work best</p>
                  <p className="text-sm text-foreground">{identityProfile.workStyle}</p>
                </div>
              </div>

              {/* Strengths */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 bg-violet-500/10 rounded-xl flex items-center justify-center">
                    <Map className="w-4 h-4 text-violet" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-sm">Your Strength Map</h2>
                    <p className="text-xs text-muted-foreground">The capabilities you're building into your identity</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {strengthClusters.map((s) => {
                    const barColor = s.color === "teal" ? "bg-gradient-coral" : s.color === "amber" ? "bg-gradient-amber" : "";
                    const barStyle = s.color === "violet" ? { background: "hsl(var(--violet))", width: `${s.score}%` } : { width: `${s.score}%` };
                    return (
                      <div key={s.label}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-foreground font-medium">{s.label}</span>
                          <span className="text-muted-foreground">{s.score}%</span>
                        </div>
                        <div className="h-1.5 bg-border rounded-full overflow-hidden">
                          <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={barStyle} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <MicroExperiments />
              <EvolutionMap />
            </div>

            {/* Right col */}
            <div className="space-y-5">
              <ReinventionStreaks />

              {/* Emerging Identity — the centerpiece */}
              <EmergingIdentity />

              <FutureIdentityTracker />

              {/* AI Coach */}
              <div className="bg-gradient-card border rounded-2xl p-5" style={{ borderColor: "hsl(var(--coral) / 0.2)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-coral rounded-xl flex items-center justify-center glow-coral shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Your coach sees this in you</h3>
                    <p className="text-xs text-muted-foreground">Identity insights for today</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {coachInsights.map((insight, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "hsl(var(--coral) / 0.15)" }}>
                        <span className="text-coral text-xs font-bold">{i + 1}</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-xs">{insight}</p>
                    </div>
                  ))}
                </div>
                <Link to="/coach" className="block mt-4">
                  <Button size="sm" className="w-full gap-2 text-xs"
                    style={{ background: "hsl(var(--coral) / 0.1)", border: "1px solid hsl(var(--coral) / 0.25)", color: "hsl(var(--coral))" }}>
                    <MessageCircle className="w-3.5 h-3.5" />
                    Ask who you're becoming
                  </Button>
                </Link>
              </div>

              {/* Paths that match you */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-amber" />
                  <h3 className="font-semibold text-foreground text-sm">Paths that match who you are</h3>
                </div>
                <div className="space-y-2.5">
                  {suggestedRoles.map((r) => (
                    <div key={r.title} className="flex items-center gap-3 bg-surface-2 rounded-xl p-3">
                      <div className="w-8 h-8 bg-coral-500/10 rounded-lg flex items-center justify-center shrink-0">
                        <r.icon className="w-3.5 h-3.5 text-coral" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{r.title}</p>
                        <span className={`text-xs ${
                          r.tagColor === "teal"   ? "text-coral"  :
                          r.tagColor === "amber"  ? "text-amber"  : "text-violet"
                        }`}>{r.tag}</span>
                      </div>
                      <span className="text-coral font-bold text-xs">{r.match}%</span>
                    </div>
                  ))}
                </div>
                <Link to="/opportunities">
                  <Button size="sm" variant="outline" className="w-full mt-3 border-border hover:border-coral-500/40 text-xs">
                    Explore paths that fit you →
                  </Button>
                </Link>
              </div>

              <ReinventionInsights />

              {/* Continue growing */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-5">
                <h3 className="font-semibold text-foreground text-sm mb-1">Keep becoming</h3>
                <p className="text-xs text-muted-foreground mb-4">Become the kind of person who builds new skills, one step at a time.</p>
                <div className="space-y-1.5">
                  {[
                    { icon: Eye,      label: "Life Clarity",                   sub: "Discover who you are right now",          href: "/life-clarity",       highlight: true  },
                    { icon: Lightbulb,label: "Clarity Engine",                  sub: "Go from confusion to clarity",            href: "/clarity-engine",     highlight: false },
                    { icon: Map,      label: "Path Finder",                     sub: "Discover paths you haven't seen yet",     href: "/path-finder",        highlight: false },
                    { icon: Shield,   label: "Build Your Confidence",          sub: "Step into a stronger version of yourself", href: "/confidence-builder", highlight: false },
                    { icon: Compass,  label: "Your Future Vision",             sub: "See who you're becoming in 3 years",      href: "/future-vision",      highlight: false },
                    { icon: BookOpen, label: "Become someone who understands AI", sub: "15 min · Beginner",                   href: "/learn",              highlight: false },
                    { icon: Map,      label: "Explore paths that match you",   sub: "3 paths aligned to your identity",        href: "/paths",              highlight: false },
                    { icon: Users,    label: "Join others on this journey",    sub: "Career Pivots community",                 href: "/community",          highlight: false },
                  ].map((item) => (
                    <Link key={item.label} to={item.href}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors group ${
                        item.highlight
                          ? "border border-coral-500/15 hover:bg-coral-500/10"
                          : "hover:bg-surface-2"
                      }`}
                      style={item.highlight ? { background: "hsl(var(--coral) / 0.05)" } : {}}>
                      <item.icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        item.highlight ? "text-coral" : "text-muted-foreground group-hover:text-coral"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.sub}</p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-coral group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
