import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Brain, Sparkles, TrendingUp, Map, ArrowRight,
  Zap, Target, Heart, BookOpen, Users, MessageCircle,
  Share2, Compass, Eye, Shield,
} from "lucide-react";
import { TodayEvolution } from "@/components/dashboard/TodayEvolution";
import { ReinventionStreaks } from "@/components/dashboard/ReinventionStreaks";
import { FutureIdentityTracker } from "@/components/dashboard/FutureIdentityTracker";
import { MicroExperiments } from "@/components/dashboard/MicroExperiments";
import { ReinventionInsights } from "@/components/dashboard/ReinventionInsights";
import { EvolutionMap } from "@/components/dashboard/EvolutionMap";

const strengthClusters = [
  { label: "Communication",   score: 92, color: "teal"   },
  { label: "Systems Thinking",score: 78, color: "violet" },
  { label: "Leadership",      score: 85, color: "amber"  },
  { label: "Problem Solving", score: 88, color: "teal"   },
  { label: "Creativity",      score: 71, color: "violet" },
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
  "Your communication skills are rare in technical fields — this is your edge.",
  "You've built leadership organically. AI tools will amplify it.",
  "Your curiosity about systems maps directly to the automation economy.",
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
              <p className="text-xs font-semibold uppercase tracking-widest text-teal mb-2">Your dashboard</p>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Welcome back, <span className="text-gradient-teal">Alex</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1.5">
                Your journey is 35% complete · 12-day streak 🔥
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link to="/profile">
                <Button variant="outline" size="sm" className="border-border hover:border-teal-500/40 gap-2 text-xs">
                  <Share2 className="w-3.5 h-3.5 text-teal" />
                  Profile
                </Button>
              </Link>
              <Link to="/coach">
                <Button variant="outline" size="sm" className="border-border hover:border-teal-500/40 gap-2 text-xs">
                  <MessageCircle className="w-3.5 h-3.5 text-teal" />
                  Ask your coach
                </Button>
              </Link>
              <Link to="/opportunities">
                <Button size="sm" className="bg-gradient-teal text-primary-foreground gap-2 hover:opacity-90 text-xs">
                  Explore opportunities
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* ── Journey progress ────────────────────────────────── */}
          <div className="bg-gradient-card border border-border/50 rounded-2xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-semibold text-foreground text-sm">Your reinvention journey</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Stage 2 of 5 · Skill Translation</p>
              </div>
              <span className="text-teal font-bold text-xl">35%</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-teal rounded-full transition-all duration-700" style={{ width: "35%" }} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "Who You Are",      done: true,    active: false },
                { label: "Your Skills",      done: false,   active: true  },
                { label: "Find Direction",   done: false,   active: false },
                { label: "Build Your Path",  done: false,   active: false },
                { label: "Keep Evolving",    done: false,   active: false },
              ].map((s) => (
                <span key={s.label} className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  s.done   ? "border-teal-500/35 bg-teal-500/10 text-teal"   :
                  s.active ? "border-amber-500/35 bg-amber-500/10 text-amber" :
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

              <TodayEvolution />

              {/* Identity Profile */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 bg-teal-500/10 rounded-xl flex items-center justify-center">
                    <Brain className="w-4 h-4 text-teal" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-sm">Who You Are</h2>
                    <p className="text-xs text-muted-foreground">Your identity profile</p>
                  </div>
                </div>

                {/* Archetype */}
                <div className="rounded-xl p-4 mb-5 border"
                  style={{ background: "hsl(var(--teal) / 0.05)", borderColor: "hsl(var(--teal) / 0.15)" }}>
                  <p className="text-xs text-teal font-semibold uppercase tracking-wider mb-1">Your archetype</p>
                  <p className="text-lg font-bold text-foreground">{identityProfile.archetype}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: "Core Strengths",    items: identityProfile.strengths,        icon: Zap,      color: "teal"   },
                    { label: "Curiosity Patterns",items: identityProfile.curiosityPatterns, icon: Sparkles, color: "violet" },
                    { label: "Motivations",       items: identityProfile.motivations,      icon: Heart,    color: "amber"  },
                    { label: "Core Values",       items: identityProfile.values,           icon: Target,   color: "teal"   },
                  ].map((section) => (
                    <div key={section.label} className="bg-surface-2 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <section.icon className={`w-3.5 h-3.5 ${
                          section.color === "teal" ? "text-teal" :
                          section.color === "amber" ? "text-amber" : "text-violet"
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
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Work style</p>
                  <p className="text-sm text-foreground">{identityProfile.workStyle}</p>
                </div>
              </div>

              {/* Strengths */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 bg-violet-500/10 rounded-xl flex items-center justify-center">
                    <Map className="w-4 h-4 text-violet" />
                  </div>
                  <h2 className="font-semibold text-foreground text-sm">Your Strengths</h2>
                </div>
                <div className="space-y-4">
                  {strengthClusters.map((s) => {
                    const barColor = s.color === "teal" ? "bg-gradient-teal" : s.color === "amber" ? "bg-gradient-amber" : "";
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
              <FutureIdentityTracker />

              {/* AI Coach */}
              <div className="bg-gradient-card border rounded-2xl p-5" style={{ borderColor: "hsl(var(--teal) / 0.2)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-teal rounded-xl flex items-center justify-center glow-teal shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Your coach says</h3>
                    <p className="text-xs text-muted-foreground">Insights for today</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {coachInsights.map((insight, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-teal-500/15 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-teal text-xs font-bold">{i + 1}</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-xs">{insight}</p>
                    </div>
                  ))}
                </div>
                <Link to="/coach" className="block mt-4">
                  <Button size="sm" className="w-full gap-2 text-xs"
                    style={{ background: "hsl(var(--teal) / 0.1)", border: "1px solid hsl(var(--teal) / 0.25)", color: "hsl(var(--teal))" }}>
                    <MessageCircle className="w-3.5 h-3.5" />
                    Ask a question
                  </Button>
                </Link>
              </div>

              {/* Top matches */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-amber" />
                  <h3 className="font-semibold text-foreground text-sm">Roles that fit you</h3>
                </div>
                <div className="space-y-2.5">
                  {suggestedRoles.map((r) => (
                    <div key={r.title} className="flex items-center gap-3 bg-surface-2 rounded-xl p-3">
                      <div className="w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center shrink-0">
                        <r.icon className="w-3.5 h-3.5 text-teal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{r.title}</p>
                        <span className={`text-xs ${
                          r.tagColor === "teal" ? "text-teal" :
                          r.tagColor === "amber" ? "text-amber" : "text-violet"
                        }`}>{r.tag}</span>
                      </div>
                      <span className="text-teal font-bold text-xs">{r.match}%</span>
                    </div>
                  ))}
                </div>
                <Link to="/opportunities">
                  <Button size="sm" variant="outline" className="w-full mt-3 border-border hover:border-teal-500/40 text-xs">
                    See all opportunities →
                  </Button>
                </Link>
              </div>

              <ReinventionInsights />

              {/* Quick links */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-5">
                <h3 className="font-semibold text-foreground text-sm mb-3">Continue your journey</h3>
                <div className="space-y-1.5">
                  {[
                    { icon: Eye,     label: "Life Clarity",       sub: "7 guided questions",   href: "/life-clarity",        highlight: true  },
                    { icon: Shield,  label: "Build Confidence",    sub: "Discover your strengths",href: "/confidence-builder", highlight: false },
                    { icon: Compass, label: "Future Vision",       sub: "Imagine 3 years ahead", href: "/future-vision",      highlight: false },
                    { icon: BookOpen,label: "AI Literacy Module",  sub: "15 min · Beginner",    href: "/learn",               highlight: false },
                    { icon: Map,     label: "Explore Paths",       sub: "3 paths ready",        href: "/paths",               highlight: false },
                    { icon: Users,   label: "Join Community",      sub: "Career Pivots group",  href: "/community",           highlight: false },
                  ].map((item) => (
                    <Link key={item.label} to={item.href}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors group ${
                        item.highlight
                          ? "border border-teal-500/15 hover:bg-teal-500/10"
                          : "hover:bg-surface-2"
                      }`}
                      style={item.highlight ? { background: "hsl(var(--teal) / 0.05)" } : {}}>
                      <item.icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        item.highlight ? "text-teal" : "text-muted-foreground group-hover:text-teal"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.sub}</p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-teal group-hover:translate-x-0.5 transition-all" />
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
