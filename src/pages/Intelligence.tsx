import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Brain, Sparkles, Zap, ArrowRight, TrendingUp,
  Lightbulb, Users, BookOpen, Rocket, Globe,
  Network, GitBranch, Star, Compass, FlaskConical,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────

const patternInsights = [
  {
    id: 1,
    from: "AI Tools Exploration",
    to: "Product Building",
    fromColor: "coral",
    toColor: "violet",
    pct: 72,
    insight:
      "People who explore AI tools often become interested in product building. The hands-on experience with building creates an appetite for creating things with AI.",
    n: 3840,
    icon: Zap,
  },
  {
    id: 2,
    from: "Storytelling Curiosity",
    to: "Content Creation & Brand Strategy",
    fromColor: "amber",
    toColor: "coral",
    pct: 68,
    insight:
      "Users curious about storytelling frequently explore content creation and brand strategy. The thread connecting them is the love of communicating ideas that matter.",
    n: 2614,
    icon: BookOpen,
  },
  {
    id: 3,
    from: "Startup Experiments",
    to: "Product Design & Community",
    fromColor: "violet",
    toColor: "amber",
    pct: 61,
    insight:
      "People experimenting with startups often explore product design and community building. The builder instinct naturally extends into both craft and connection.",
    n: 1987,
    icon: Rocket,
  },
  {
    id: 4,
    from: "Learning & Teaching",
    to: "Curriculum & Coaching",
    fromColor: "coral",
    toColor: "violet",
    pct: 79,
    insight:
      "People who enjoy teaching others often discover a passion for designing structured learning experiences — turning knowledge into journeys others can follow.",
    n: 1542,
    icon: Users,
  },
  {
    id: 5,
    from: "Systems Thinking",
    to: "Automation & Operations",
    fromColor: "amber",
    toColor: "coral",
    pct: 65,
    insight:
      "Those drawn to systems and processes often find fulfilment in automation strategy and operational design — turning complexity into clarity at scale.",
    n: 2208,
    icon: GitBranch,
  },
];

const pathConnections = [
  {
    chain: [
      { label: "AI Tools",          color: "coral"  },
      { label: "AI Product Builder", color: "violet" },
      { label: "AI Startup Founder", color: "amber"  },
    ],
    desc: "Curiosity about AI tools often evolves into building with them — and for many, that becomes the foundation of a startup.",
    explorers: 4200,
  },
  {
    chain: [
      { label: "Writing",                 color: "amber"  },
      { label: "Content Strategy",        color: "coral"  },
      { label: "Brand Strategy",          color: "violet" },
      { label: "Creative Entrepreneurship", color: "amber" },
    ],
    desc: "A love of writing, when directed with strategy, naturally evolves into brand-shaping and creative business building.",
    explorers: 2870,
  },
  {
    chain: [
      { label: "Education Interest",      color: "coral"  },
      { label: "Learning Design",         color: "violet" },
      { label: "Knowledge Platform",      color: "amber"  },
    ],
    desc: "People who care about how others learn often design better learning experiences and ultimately build platforms around that passion.",
    explorers: 1640,
  },
  {
    chain: [
      { label: "Community Interest",      color: "violet" },
      { label: "Community Building",      color: "coral"  },
      { label: "Platform Thinking",       color: "amber"  },
      { label: "Network Entrepreneur",    color: "violet" },
    ],
    desc: "Connecting people is a skill that compounds. Community builders often discover they're building the infrastructure for entirely new economies.",
    explorers: 1920,
  },
];

const skillNetwork = [
  {
    skill: "Communication",
    color: "coral",
    icon: Users,
    unlocks: ["Leadership", "Marketing", "Community Building", "Coaching", "Brand Strategy"],
    desc: "The ability to translate ideas clearly is foundational to almost every meaningful path.",
    strength: 94,
  },
  {
    skill: "Product Thinking",
    color: "violet",
    icon: Lightbulb,
    unlocks: ["Technology", "Design", "Entrepreneurship", "AI Strategy", "UX Design"],
    desc: "Thinking in systems and user value creates a rare fluency between business, technology, and people.",
    strength: 88,
  },
  {
    skill: "Learning Design",
    color: "amber",
    icon: BookOpen,
    unlocks: ["Education", "Coaching", "Knowledge Platforms", "Content Creation", "Community Building"],
    desc: "The ability to turn complex ideas into journeys that others can follow unlocks a wide network of high-meaning paths.",
    strength: 82,
  },
  {
    skill: "Creative Problem Solving",
    color: "coral",
    icon: Sparkles,
    unlocks: ["Innovation", "Startup Operations", "Design Thinking", "Brand Strategy", "New Ventures"],
    desc: "Reframing problems and generating novel solutions is increasingly rare — and increasingly valuable.",
    strength: 91,
  },
  {
    skill: "AI Literacy",
    color: "violet",
    icon: Zap,
    unlocks: ["AI Product Building", "Automation Strategy", "Data Insights", "AI Consulting", "Future Industries"],
    desc: "Understanding and using AI tools is the fastest-growing leverage skill of our generation.",
    strength: 97,
  },
  {
    skill: "Systems Thinking",
    color: "amber",
    icon: GitBranch,
    unlocks: ["Operations", "Automation", "Strategy", "Org Design", "Product Architecture"],
    desc: "Seeing how parts connect and interact gives you the ability to improve, scale, and redesign almost anything.",
    strength: 85,
  },
];

const recommendations = [
  { label: "AI Product Strategy",         match: 94, icon: Zap,       color: "coral",  href: "/opportunity-engine" },
  { label: "Learning Experience Design",  match: 89, icon: BookOpen,  color: "violet", href: "/opportunity-engine" },
  { label: "Startup Operations",          match: 82, icon: Rocket,    color: "amber",  href: "/opportunity-engine" },
  { label: "Creative Entrepreneurship",   match: 78, icon: Sparkles,  color: "coral",  href: "/opportunity-engine" },
  { label: "Community Architecture",      match: 74, icon: Users,     color: "violet", href: "/network"            },
  { label: "Digital Publishing",          match: 71, icon: Globe,     color: "amber",  href: "/opportunity-engine" },
];

const discoveryInsights = [
  {
    icon: FlaskConical,
    color: "coral",
    title: "Experiments reveal directions",
    insight:
      "Many people discover their direction after experimenting with several small projects. The first experiment rarely becomes the path — but it almost always points toward it.",
    stat: "71% of users report that a side experiment revealed their primary path",
  },
  {
    icon: Star,
    color: "violet",
    title: "Creative interests lead somewhere unexpected",
    insight:
      "Exploring creative interests often leads to unexpected career paths. What feels like a hobby frequently turns out to be a deep signal pointing toward meaningful work.",
    stat: "64% of creative explorers find a professional path through their creative interests",
  },
  {
    icon: Brain,
    color: "amber",
    title: "New technologies unlock new identities",
    insight:
      "Learning new technologies often unlocks opportunities in emerging industries. The person who masters a new tool early often shapes how it gets used by everyone else.",
    stat: "People who explore AI tools are 3x more likely to explore new career paths",
  },
  {
    icon: Network,
    color: "coral",
    title: "Connection accelerates discovery",
    insight:
      "People who engage with others exploring similar paths discover their direction significantly faster. Reflection in community deepens insight.",
    stat: "Community-active users report clarity 2x faster than solo explorers",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const cIcon: Record<string, string>   = { coral: "text-indigo-400", violet: "text-violet", amber: "text-amber" };
const cBg: Record<string, string>     = { coral: "bg-indigo-500-500/10", violet: "bg-violet-500/10", amber: "bg-amber-500/10" };
const cBorder: Record<string, string> = { coral: "border-coral-500/20", violet: "border-violet-500/20", amber: "border-amber-500/20" };
const cTag: Record<string, string>    = {
  coral:  "bg-indigo-500-500/10 text-indigo-400 border-coral-500/20",
  violet: "bg-violet-500/10 text-violet border-violet-500/20",
  amber:  "bg-amber-500/10 text-amber border-amber-500/20",
};
const barStyle = (color: string, pct: number) =>
  color === "violet"
    ? { background: "hsl(var(--violet))", width: `${pct}%` }
    : { width: `${pct}%` };
const barClass = (color: string) =>
  color === "coral" ? "bg-gradient-coral" : color === "amber" ? "bg-gradient-amber" : "";

// ── Component ─────────────────────────────────────────────────────────────────

export default function Intelligence() {
  const [activePattern, setActivePattern] = useState<number | null>(null);
  const [activeSkill, setActiveSkill] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-24">
        <div className="container max-w-5xl px-6">

          {/* ── Header ────────────────────────────────────────────── */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5 text-xs font-semibold uppercase tracking-widest"
              style={{
                background: "hsl(var(--violet) / 0.08)",
                borderColor: "hsl(var(--violet) / 0.2)",
                color: "hsl(var(--violet))",
              }}>
              <Brain className="w-3.5 h-3.5" />
              NAVO Intelligence
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Patterns of discovery<br className="hidden sm:block" /> across every path
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Every person exploring their path generates valuable insight. The NAVO Intelligence Engine 
              learns from patterns across the platform to help reveal new possibilities for you.
            </p>
          </div>

          {/* ── Platform stats ────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14">
            {[
              { label: "Exploration Paths",  value: "48K+",   icon: Compass     },
              { label: "Pattern Signals",    value: "2.1M+",  icon: Network     },
              { label: "Skill Connections",  value: "18,400", icon: GitBranch   },
              { label: "Insights Generated", value: "94K+",   icon: Sparkles    },
            ].map((s) => (
              <div key={s.label} className="bg-gradient-card border border-border/50 rounded-xl p-4 text-center">
                <s.icon className="w-5 h-5 text-violet mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Pattern Insights ──────────────────────────────────── */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-indigo-500-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Pattern Insights</h2>
                <p className="text-sm text-muted-foreground">What we've learned from thousands of exploration journeys</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-6 ml-11">
              Click any pattern to explore the insight in depth.
            </p>

            <div className="space-y-3">
              {patternInsights.map((p) => {
                const PIcon = p.icon;
                const isOpen = activePattern === p.id;
                return (
                  <button
                    key={p.id}
                    className="w-full text-left bg-gradient-card border border-border/50 rounded-2xl overflow-hidden hover:border-coral-500/20 transition-colors"
                    onClick={() => setActivePattern(isOpen ? null : p.id)}
                  >
                    <div className="p-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cBg[p.fromColor]}`}>
                          <PIcon className={`w-4 h-4 ${cIcon[p.fromColor]}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cTag[p.fromColor]}`}>
                              {p.from}
                            </span>
                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cTag[p.toColor]}`}>
                              {p.to}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${barClass(p.fromColor)}`}
                                style={barStyle(p.fromColor, p.pct)}
                              />
                            </div>
                            <span className={`text-sm font-bold shrink-0 ${cIcon[p.fromColor]}`}>{p.pct}%</span>
                            <span className="text-xs text-muted-foreground shrink-0">of {p.n.toLocaleString()} explorers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-border/40 pt-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">{p.insight}</p>
                        <div className="flex gap-2 mt-4">
                          <Link to="/journal" onClick={(e) => e.stopPropagation()}>
                            <Button size="sm" variant="outline" className="text-xs border-border hover:border-coral-500/40 gap-1.5">
                              <BookOpen className="w-3 h-3 text-indigo-400" />
                              Reflect on this in your journal
                            </Button>
                          </Link>
                          <Link to="/opportunity-engine" onClick={(e) => e.stopPropagation()}>
                            <Button size="sm" className="text-xs bg-gradient-coral text-primary-foreground hover:opacity-90 gap-1.5">
                              Explore this path
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Path Connections ──────────────────────────────────── */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-violet-500/10 rounded-xl flex items-center justify-center">
                <GitBranch className="w-4 h-4 text-violet" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Path Connections</h2>
                <p className="text-sm text-muted-foreground">How paths evolve and connect over time</p>
              </div>
            </div>

            <div className="space-y-4">
              {pathConnections.map((pc, i) => (
                <div key={i} className="bg-gradient-card border border-border/50 rounded-2xl p-6 hover:border-violet-500/20 transition-colors">
                  {/* Chain visualization */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {pc.chain.map((node, ni) => (
                      <div key={ni} className="flex items-center gap-2">
                        <span className={`text-sm font-semibold px-3 py-1.5 rounded-xl border ${cTag[node.color]}`}>
                          {node.label}
                        </span>
                        {ni < pc.chain.length - 1 && (
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{pc.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Users className="w-3 h-3" />
                      {pc.explorers.toLocaleString()} people explored this sequence
                    </span>
                    <Link to="/path-finder">
                      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-indigo-400 gap-1">
                        Explore this chain <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Skill Network ─────────────────────────────────────── */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Network className="w-4 h-4 text-amber" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Skill Network</h2>
                <p className="text-sm text-muted-foreground">Skills that unlock the most new opportunities</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {skillNetwork.map((s, i) => {
                const SIcon = s.icon;
                const isActive = activeSkill === i;
                return (
                  <button
                    key={s.skill}
                    className={`text-left bg-gradient-card border rounded-2xl p-5 transition-all ${
                      isActive ? `${cBorder[s.color]}` : "border-border/50 hover:border-border"
                    }`}
                    onClick={() => setActiveSkill(isActive ? null : i)}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cBg[s.color]}`}>
                        <SIcon className={`w-4 h-4 ${cIcon[s.color]}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-bold text-sm ${cIcon[s.color]}`}>{s.skill}</h3>
                          <span className="text-xs text-muted-foreground">{s.strength}% relevance</span>
                        </div>
                        <div className="h-1 bg-border rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${barClass(s.color)}`}
                            style={barStyle(s.color, s.strength)}
                          />
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{s.desc}</p>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Unlocks</p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.unlocks.map((u) => (
                          <span key={u} className="text-xs bg-surface-2 border border-border rounded-lg px-2 py-0.5 text-foreground/80">
                            {u}
                          </span>
                        ))}
                      </div>
                    </div>

                    {isActive && (
                      <div className="mt-4 pt-3 border-t border-border/40">
                        <Link to="/learn" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" className={`text-xs ${cBg[s.color]} border ${cBorder[s.color]} ${cIcon[s.color]} hover:opacity-80 gap-1.5`}>
                            Start building this skill
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Recommendations ───────────────────────────────────── */}
          <section className="mb-16">
            <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, hsl(var(--coral)), hsl(var(--violet)))" }}>
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">For Someone Like You</h2>
                  <p className="text-xs text-muted-foreground">
                    People with similar curiosity patterns often explore these directions
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground ml-12 mb-6 leading-relaxed">
                Based on your interests in technology, problem solving, and continuous learning.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {recommendations.map((r) => {
                  const RIcon = r.icon;
                  return (
                    <Link key={r.label} to={r.href}
                      className="flex items-center gap-3 bg-surface-2 rounded-xl p-3 hover:bg-surface-3 transition-colors group">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cBg[r.color]}`}>
                        <RIcon className={`w-4 h-4 ${cIcon[r.color]}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{r.label}</p>
                        <p className="text-xs text-muted-foreground">Curiosity match</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-sm font-bold ${cIcon[r.color]}`}>{r.match}%</span>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  These are possibilities, not prescriptions. Your path is yours to shape.
                </p>
                <Link to="/path-finder">
                  <Button size="sm" className="bg-gradient-coral text-primary-foreground font-semibold gap-2 hover:opacity-90 shrink-0 text-xs">
                    Run AI Path Finder
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* ── Discovery Insights ────────────────────────────────── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-indigo-500-500/10 rounded-xl flex items-center justify-center">
                <Star className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Paths Others Have Discovered</h2>
                <p className="text-sm text-muted-foreground">What we've learned from thousands of exploration journeys</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {discoveryInsights.map((d, i) => {
                const DIcon = d.icon;
                return (
                  <div key={i} className={`bg-gradient-card border rounded-2xl p-5 ${cBorder[d.color]} hover:opacity-90 transition-opacity`}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${cBg[d.color]}`}>
                      <DIcon className={`w-5 h-5 ${cIcon[d.color]}`} />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{d.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{d.insight}</p>
                    <div className={`text-xs font-semibold px-3 py-2 rounded-xl ${cBg[d.color]} ${cIcon[d.color]}`}>
                      📊 {d.stat}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Footer CTA ────────────────────────────────────────── */}
          <section>
            <div className="rounded-2xl p-8 text-center"
              style={{
                background: "linear-gradient(135deg, hsl(var(--violet) / 0.07), hsl(var(--coral) / 0.07))",
                border: "1px solid hsl(var(--violet) / 0.2)",
              }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}>
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Your path is unique. But patterns can illuminate it.
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-6 leading-relaxed">
                The most important discovery is the one you make yourself. Let the patterns inspire curiosity —
                then go explore.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/path-finder">
                  <Button className="text-primary-foreground font-semibold gap-2 hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}>
                    Discover my paths
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/journal">
                  <Button variant="outline" className="border-border hover:border-violet-500/40 gap-2">
                    <BookOpen className="w-4 h-4 text-violet" />
                    Reflect in my journal
                  </Button>
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
