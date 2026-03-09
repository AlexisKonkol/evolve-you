import { useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Brain, Sparkles, ArrowRight, Zap, Heart, Star,
  Map, TrendingUp, Lightbulb, RefreshCw, Clock,
  FlaskConical, BookOpen, Compass, Eye,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface InterestBubble {
  id: string;
  label: string;
  category: "tech" | "creative" | "people" | "strategy" | "learning";
  weight: number; // 1–5, drives bubble size
  cx: number;     // % of container width
  cy: number;     // % of container height
}

interface StrengthSignal {
  label: string;
  level: "emerging" | "developing" | "strong";
  score: number; // 0–100
  colorKey: "coral" | "amber" | "violet";
}

interface TimelineEvent {
  label: string;
  sub: string;
  icon: React.ElementType;
  colorKey: "coral" | "amber" | "violet" | "teal";
  date: string;
}

interface FuturePath {
  title: string;
  why: string;
  icon: React.ElementType;
  colorKey: "coral" | "amber" | "violet" | "teal";
  href: string;
}

// ── Static identity data (represents a profile) ───────────────────────────────

const interests: InterestBubble[] = [
  { id: "ai",          label: "AI & Tech",           category: "tech",     weight: 5, cx: 58, cy: 22 },
  { id: "problem",     label: "Problem Solving",     category: "strategy", weight: 5, cx: 30, cy: 38 },
  { id: "learning",    label: "Learning",            category: "learning", weight: 4, cx: 72, cy: 55 },
  { id: "systems",     label: "Systems Thinking",    category: "strategy", weight: 4, cx: 18, cy: 62 },
  { id: "entrep",      label: "Entrepreneurship",    category: "strategy", weight: 3, cx: 50, cy: 72 },
  { id: "creative",    label: "Creative Work",       category: "creative", weight: 3, cx: 82, cy: 30 },
  { id: "people",      label: "Helping People",      category: "people",   weight: 4, cx: 40, cy: 17 },
  { id: "design",      label: "Design Thinking",     category: "creative", weight: 2, cx: 67, cy: 80 },
  { id: "community",   label: "Community",           category: "people",   weight: 2, cx: 12, cy: 30 },
  { id: "strategy",    label: "Strategy",            category: "strategy", weight: 3, cx: 88, cy: 66 },
  { id: "data",        label: "Data & Insights",     category: "tech",     weight: 2, cx: 24, cy: 82 },
  { id: "storytelling",label: "Storytelling",        category: "creative", weight: 2, cx: 46, cy: 50 },
];

const categoryColor: Record<InterestBubble["category"], string> = {
  tech:     "hsl(var(--amber))",
  creative: "hsl(var(--coral))",
  people:   "hsl(150 55% 52%)",
  strategy: "hsl(var(--violet))",
  learning: "hsl(var(--coral))",
};

const strengthSignals: StrengthSignal[] = [
  { label: "Communication",    level: "strong",     score: 91, colorKey: "coral"  },
  { label: "Problem Solving",  level: "strong",     score: 87, colorKey: "coral"  },
  { label: "Systems Thinking", level: "developing", score: 76, colorKey: "violet" },
  { label: "Creative Thinking",level: "developing", score: 72, colorKey: "amber"  },
  { label: "Strategic Vision", level: "developing", score: 68, colorKey: "violet" },
  { label: "Technical Fluency",level: "emerging",   score: 55, colorKey: "amber"  },
  { label: "Facilitation",     level: "emerging",   score: 48, colorKey: "coral"  },
];

const levelLabel: Record<StrengthSignal["level"], string> = {
  emerging:   "Emerging signal",
  developing: "Developing",
  strong:     "Strong signal",
};

const timelineEvents: TimelineEvent[] = [
  { label: "Started Life Clarity",         sub: "Began exploring who you are today",      icon: Eye,          colorKey: "coral",  date: "Day 1"  },
  { label: "Completed Path Finder",        sub: "Discovered 4 potential directions",       icon: Compass,      colorKey: "violet", date: "Day 3"  },
  { label: "First Journal Entry",          sub: "Reflected on what gives you energy",      icon: BookOpen,     colorKey: "coral",  date: "Day 4"  },
  { label: "Started AI Builder Experiment",sub: "Testing curiosity about AI products",     icon: FlaskConical, colorKey: "amber",  date: "Day 6"  },
  { label: "Explored the Path Graph",      sub: "Discovered 8 connected possibilities",    icon: Map,          colorKey: "violet", date: "Day 7"  },
  { label: "5 Journal Reflections",        sub: "Curiosity patterns beginning to emerge",  icon: Sparkles,     colorKey: "coral",  date: "Day 9"  },
  { label: "Strength Map Updated",         sub: "Communication identified as core signal", icon: Star,         colorKey: "amber",  date: "Day 11" },
];

const futurePaths: FuturePath[] = [
  { title: "AI Product Builder", why: "Your curiosity about technology and love of solving meaningful problems align strongly with this direction.", icon: Zap, colorKey: "amber", href: "/path-finder" },
  { title: "Learning Designer",  why: "You're drawn to helping others grow and have a natural instinct for breaking complex ideas into clear frameworks.", icon: BookOpen, colorKey: "coral", href: "/path-finder" },
  { title: "Startup Operator",   why: "Systems thinking combined with communication makes you unusually well-suited for building and running new ventures.", icon: TrendingUp, colorKey: "violet", href: "/path-finder" },
  { title: "Creative Strategist",why: "You bridge creative thinking with strategic analysis — a rare combination that organizations and founders need.", icon: Lightbulb, colorKey: "coral", href: "/path-finder" },
];

// ── Color tokens ──────────────────────────────────────────────────────────────

const ct = {
  coral:  { bg: "hsl(var(--coral) / 0.08)",  border: "hsl(var(--coral) / 0.22)",  text: "text-coral",  dot: "hsl(var(--coral))"  },
  amber:  { bg: "hsl(var(--amber) / 0.08)",  border: "hsl(var(--amber) / 0.22)",  text: "text-amber",  dot: "hsl(var(--amber))"  },
  violet: { bg: "hsl(var(--violet) / 0.08)", border: "hsl(var(--violet) / 0.22)", text: "text-violet", dot: "hsl(var(--violet))" },
  teal:   { bg: "hsl(150 55% 52% / 0.08)",   border: "hsl(150 55% 52% / 0.22)",   text: "text-teal",   dot: "hsl(150 55% 52%)"   },
};

// ── Interest Map ──────────────────────────────────────────────────────────────

function InterestMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative w-full" style={{ height: "340px" }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"
        style={{ overflow: "visible" }}>
        {/* Faint grid lines for depth */}
        {[20, 40, 60, 80].map((v) => (
          <g key={v}>
            <line x1={v} y1={0} x2={v} y2={100} stroke="hsl(var(--border))" strokeWidth="0.3" strokeDasharray="1,2" opacity={0.4} />
            <line x1={0} y1={v} x2={100} y2={v} stroke="hsl(var(--border))" strokeWidth="0.3" strokeDasharray="1,2" opacity={0.4} />
          </g>
        ))}

        {/* Connection lines to the strongest bubbles */}
        {interests.filter((b) => b.weight >= 4).flatMap((b, i) =>
          interests.filter((b2) => b2.weight >= 4 && b2.id !== b.id).slice(0, 2).map((b2, j) => (
            <line key={`${b.id}-${b2.id}-${i}-${j}`}
              x1={b.cx} y1={b.cy} x2={b2.cx} y2={b2.cy}
              stroke="hsl(var(--border))" strokeWidth="0.4" opacity={0.25} />
          ))
        )}

        {/* Bubbles */}
        {interests.map((bubble) => {
          const r = 3 + bubble.weight * 2.2;
          const color = categoryColor[bubble.category];
          const isHovered = hovered === bubble.id;
          const isStrong = bubble.weight >= 4;
          return (
            <g key={bubble.id}
              style={{ cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={() => setHovered(bubble.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Glow ring for strong interests */}
              {isStrong && (
                <circle cx={bubble.cx} cy={bubble.cy} r={r + 2.5}
                  fill="none" stroke={color} strokeWidth="0.5" opacity={isHovered ? 0.5 : 0.2}
                  style={{ transition: "opacity 0.2s" }} />
              )}
              <circle cx={bubble.cx} cy={bubble.cy} r={isHovered ? r + 1.5 : r}
                fill={color}
                fillOpacity={isHovered ? 0.85 : isStrong ? 0.75 : 0.55}
                style={{ transition: "all 0.2s" }}
              />
              {/* Label */}
              <text x={bubble.cx} y={bubble.cy + r + 3.5}
                textAnchor="middle"
                fontSize={bubble.weight >= 4 ? "3" : "2.5"}
                fill={isHovered ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))"}
                style={{ transition: "fill 0.2s", pointerEvents: "none", fontWeight: bubble.weight >= 4 ? "600" : "400" }}
              >
                {bubble.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-0 left-0 flex gap-3 flex-wrap">
        {(["tech", "creative", "people", "strategy", "learning"] as InterestBubble["category"][]).map((cat) => (
          <div key={cat} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: categoryColor[cat] }} />
            <span className="text-xs text-muted-foreground/60 capitalize">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Strength Signals ──────────────────────────────────────────────────────────

function StrengthSignalBar({ signal }: { signal: StrengthSignal }) {
  const c = ct[signal.colorKey];
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{signal.label}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.text}`}
          style={{ background: c.bg }}>
          {levelLabel[signal.level]}
        </span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${signal.score}%`, background: c.dot }}
        />
      </div>
    </div>
  );
}

// ── AI Insights Panel ─────────────────────────────────────────────────────────

function InsightsPanel() {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const generate = async () => {
    setLoading(true);
    setInsights("");
    setDone(false);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/identity-insights`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            interests: interests.filter((i) => i.weight >= 3).map((i) => i.label),
            strengths: strengthSignals.filter((s) => s.score >= 68).map((s) => s.label),
            archetype: "The Connector-Builder",
          }),
        }
      );
      if (!response.ok || !response.body) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamDone = false;
      while (!streamDone) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") { streamDone = true; break; }
          try {
            const p = JSON.parse(j);
            const chunk = p.choices?.[0]?.delta?.content;
            if (chunk) setInsights((prev) => prev + chunk);
          } catch { /* skip */ }
        }
      }
      setDone(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't generate insights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-2xl p-5"
      style={{ background: "hsl(var(--violet) / 0.04)", borderColor: "hsl(var(--violet) / 0.2)" }}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "hsl(var(--violet) / 0.15)" }}>
            <Brain className="w-4 h-4 text-violet" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Identity Insights</h3>
            <p className="text-xs text-muted-foreground">AI-generated from your patterns</p>
          </div>
        </div>
        <Button size="sm" onClick={generate} disabled={loading}
          className="text-xs gap-1.5 text-primary-foreground hover:opacity-90 shrink-0"
          style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}>
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {loading ? "Analyzing…" : done ? "Refresh" : "Reveal insights"}
        </Button>
      </div>

      {insights ? (
        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line rounded-xl p-4"
          style={{ background: "hsl(var(--violet) / 0.07)" }}>
          {insights}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Tap "Reveal insights" to see patterns emerging across your strengths, curiosities, and exploration history.
        </p>
      )}
    </div>
  );
}

// ── Evolution Timeline ────────────────────────────────────────────────────────

function EvolutionTimeline() {
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-0 bottom-0 w-px bg-border/60" />
      <div className="space-y-3 pl-10">
        {timelineEvents.map((ev, i) => {
          const c = ct[ev.colorKey];
          const Icon = ev.icon;
          const isLast = i === timelineEvents.length - 1;
          return (
            <div key={ev.label} className="relative">
              <div
                className="absolute -left-[1.65rem] w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0"
                style={{
                  background: isLast ? c.dot : c.bg,
                  borderColor: c.dot,
                }}
              >
                <Icon className="w-3 h-3" style={{ color: isLast ? "hsl(var(--background))" : c.dot }} />
              </div>
              <div
                className="border rounded-xl p-3 transition-colors"
                style={{
                  background: isLast ? c.bg : "hsl(var(--card))",
                  borderColor: isLast ? c.border : "hsl(var(--border))",
                }}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-xs font-semibold text-foreground">{ev.label}</p>
                  <span className="text-xs text-muted-foreground/50">{ev.date}</span>
                </div>
                <p className="text-xs text-muted-foreground">{ev.sub}</p>
              </div>
            </div>
          );
        })}

        {/* Future node */}
        <div className="relative">
          <div className="absolute -left-[1.65rem] w-6 h-6 rounded-full border-2 border-dashed border-border"
            style={{ background: "transparent" }} />
          <div className="border border-dashed border-border/40 rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground/40">Your next milestone</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Possible Futures ──────────────────────────────────────────────────────────

function PossibleFutures() {
  return (
    <div className="space-y-3">
      {futurePaths.map((path) => {
        const c = ct[path.colorKey];
        const Icon = path.icon;
        return (
          <div key={path.title}
            className="border rounded-2xl p-4 transition-all hover:scale-[1.01]"
            style={{ background: c.bg, borderColor: c.border }}>
            <div className="flex items-start gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${c.bg.replace("0.08", "0.18")}` }}>
                <Icon className={`w-4 h-4 ${c.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${c.text}`}>{path.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{path.why}</p>
              </div>
            </div>
            <Link to={path.href}>
              <button className={`text-xs font-medium flex items-center gap-1 ${c.text} hover:opacity-80 transition-opacity`}>
                Explore this path <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

// ── Curiosity Signals ─────────────────────────────────────────────────────────

const curiositySignals = [
  { text: "Strong curiosity about emerging AI and technology tools",              icon: Zap,        colorKey: "amber"  as const },
  { text: "Drawn toward solving meaningful, real-world problems",                 icon: Lightbulb,  colorKey: "coral"  as const },
  { text: "Frequently explores ideas related to learning and education",          icon: BookOpen,   colorKey: "coral"  as const },
  { text: "Motivated by helping others grow and navigate change",                 icon: Heart,      colorKey: "violet" as const },
  { text: "Shows patterns of interest in systems, structure, and organization",   icon: Map,        colorKey: "violet" as const },
];

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function IdentityDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container max-w-7xl px-6">

          {/* ── Header ─────────────────────────────────────── */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-4 border"
              style={{ background: "hsl(var(--coral) / 0.06)", borderColor: "hsl(var(--coral) / 0.2)" }}>
              <Brain className="w-4 h-4 text-coral" />
              <span className="text-coral">Identity Dashboard</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Who you are{" "}
                  <span className="bg-gradient-coral bg-clip-text text-transparent">becoming</span>
                </h1>
                <p className="text-muted-foreground max-w-xl">
                  Your path is not something you find once. It is something you discover as you grow.
                  This dashboard reflects the patterns emerging in who you are becoming.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to="/journal">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs border-border hover:border-coral/40">
                    <BookOpen className="w-3.5 h-3.5 text-coral" />
                    Add reflection
                  </Button>
                </Link>
                <Link to="/path-finder">
                  <Button size="sm" className="gap-1.5 text-xs text-primary-foreground hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, hsl(var(--coral)), hsl(var(--peach)))" }}>
                    Explore paths
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* ── Identity archetype card ─────────────────────────────── */}
          <div className="rounded-2xl p-6 mb-8 border"
            style={{ background: "linear-gradient(135deg, hsl(var(--coral) / 0.08), hsl(var(--violet) / 0.08))", borderColor: "hsl(var(--coral) / 0.2)" }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, hsl(var(--coral)), hsl(var(--peach)))" }}>
                <Brain className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-coral font-semibold uppercase tracking-wider mb-1">Your emerging identity</p>
                <h2 className="text-xl font-bold text-foreground mb-1">The Connector-Builder</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You bridge people, ideas, and systems. You're energized by meaningful problems and naturally build
                  clarity in complex situations. Your identity is still evolving — and that's exactly where the
                  most interesting paths are found.
                </p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0 min-w-[120px]">
                {[
                  { label: "Clarity",     pct: 62 },
                  { label: "Exploration", pct: 78 },
                  { label: "Growth",      pct: 55 },
                ].map(({ label, pct }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-16 shrink-0">{label}</span>
                    <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                      <div className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: "hsl(var(--coral))" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Main grid ──────────────────────────────────────────── */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* ── Left + Center (2/3) ─────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* AI Insights */}
              <InsightsPanel />

              {/* Interest Map */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "hsl(var(--amber) / 0.15)" }}>
                    <Map className="w-4 h-4 text-amber" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-sm">Interest Map</h2>
                    <p className="text-xs text-muted-foreground">Topics and fields you keep returning to</p>
                  </div>
                </div>
                <InterestMap />
              </div>

              {/* Curiosity Signals */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "hsl(var(--coral) / 0.12)" }}>
                    <Sparkles className="w-4 h-4 text-coral" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-sm">Curiosity Signals</h2>
                    <p className="text-xs text-muted-foreground">Patterns noticed in your exploration</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {curiositySignals.map(({ text, icon: Icon, colorKey }, i) => {
                    const c = ct[colorKey];
                    return (
                      <div key={i}
                        className="flex items-start gap-3 p-3 rounded-xl border"
                        style={{ background: c.bg, borderColor: c.border }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: `${c.bg.replace("0.08", "0.18")}` }}>
                          <Icon className={`w-3.5 h-3.5 ${c.text}`} />
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Evolution Timeline */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "hsl(var(--violet) / 0.15)" }}>
                    <Clock className="w-4 h-4 text-violet" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-sm">Evolution Timeline</h2>
                    <p className="text-xs text-muted-foreground">Your journey of discovery so far</p>
                  </div>
                </div>
                <EvolutionTimeline />
              </div>
            </div>

            {/* ── Right col (1/3) ─────────────────────────────── */}
            <div className="space-y-6">

              {/* Strength Signals */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "hsl(var(--amber) / 0.12)" }}>
                    <Star className="w-4 h-4 text-amber" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-sm">Strength Signals</h2>
                    <p className="text-xs text-muted-foreground">Evolving, not fixed</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {strengthSignals.map((signal) => (
                    <StrengthSignalBar key={signal.label} signal={signal} />
                  ))}
                </div>
              </div>

              {/* Possible Futures */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "hsl(var(--coral) / 0.12)" }}>
                    <TrendingUp className="w-4 h-4 text-coral" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-sm">Possible Futures</h2>
                    <p className="text-xs text-muted-foreground">Paths that fit your emerging identity</p>
                  </div>
                </div>
                <PossibleFutures />
                <Link to="/path-finder" className="block mt-4">
                  <Button size="sm" variant="outline"
                    className="w-full gap-1.5 text-xs border-border hover:border-coral/40 text-muted-foreground hover:text-coral">
                    Discover more paths with AI
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              {/* Quick links */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-5">
                <h3 className="font-semibold text-foreground text-sm mb-3">Deepen your self-knowledge</h3>
                <div className="space-y-1.5">
                  {[
                    { href: "/journal",    icon: BookOpen,    label: "Path Journal",    sub: "Reflect and discover patterns"     },
                    { href: "/mentor",     icon: Compass,     label: "Path Mentor",     sub: "Think through your direction"      },
                    { href: "/experiments",icon: FlaskConical,label: "Life Experiments",sub: "Test paths through small actions"  },
                    { href: "/path-graph", icon: Map,         label: "Path Graph",      sub: "Explore your network of paths"     },
                  ].map((item) => (
                    <Link key={item.label} to={item.href}
                      className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-surface-2 group">
                      <item.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-coral transition-colors shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.sub}</p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-coral transition-colors" />
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
