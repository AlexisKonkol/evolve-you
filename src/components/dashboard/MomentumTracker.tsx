import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, Brain, Compass, FlaskConical, Sparkles,
  CheckCircle2, Circle, ArrowRight, ChevronRight,
  Lightbulb, MessageCircle, BookOpen, Heart,
} from "lucide-react";
import { toast } from "sonner";

// ── Momentum metrics ─────────────────────────────────────────────
const metrics = [
  {
    label: "Reflections",
    value: 3,
    max: 7,
    icon: Brain,
    color: "coral",
    desc: "Questions answered",
  },
  {
    label: "Strengths found",
    value: 5,
    max: 10,
    icon: Sparkles,
    color: "violet",
    desc: "Capabilities uncovered",
  },
  {
    label: "Opportunities",
    value: 4,
    max: 12,
    icon: Compass,
    color: "amber",
    desc: "Paths explored",
  },
  {
    label: "Experiments",
    value: 2,
    max: 8,
    icon: FlaskConical,
    color: "violet",
    desc: "Tests completed",
  },
];

// ── Daily next steps ──────────────────────────────────────────────
const nextSteps = [
  {
    id: 1,
    label: "Reflect on one strength",
    sub: "Takes less than 5 minutes",
    icon: Brain,
    href: "/life-clarity",
    color: "coral",
    celebration: "You uncovered a new strength. Keep going.",
  },
  {
    id: 2,
    label: "Explore one new opportunity",
    sub: "AI Operations is trending this week",
    icon: Compass,
    href: "/opportunities",
    color: "amber",
    celebration: "You explored a new possibility. You're gaining momentum.",
  },
  {
    id: 3,
    label: "Ask your AI coach a question",
    sub: "What should I focus on this week?",
    icon: MessageCircle,
    href: "/coach",
    color: "violet",
    celebration: "Great question. Curious people grow faster.",
  },
  {
    id: 4,
    label: "Log a small experiment",
    sub: "Track something you tried today",
    icon: FlaskConical,
    href: "/experiments",
    color: "coral",
    celebration: "You ran an experiment. That takes courage.",
  },
  {
    id: 5,
    label: "Find your clarity",
    sub: "5 quiet questions about who you are",
    icon: Lightbulb,
    href: "/clarity-engine",
    color: "amber",
    celebration: "You are gaining clarity. That changes everything.",
  },
];

// ── Color helpers ─────────────────────────────────────────────────
const colorClasses = {
  coral:  { text: "text-indigo-400",  bg: "bg-indigo-500-500/10",  border: "border-coral-500/20",  bar: "bg-gradient-coral"  },
  violet: { text: "text-violet", bg: "bg-violet-500/10", border: "border-violet-500/20", bar: ""                   },
  amber:  { text: "text-amber",  bg: "bg-amber-500/10",  border: "border-amber-500/20",  bar: "bg-gradient-amber"  },
} as const;

type ColorKey = keyof typeof colorClasses;

// ── Momentum score ────────────────────────────────────────────────
const totalProgress = metrics.reduce((s, m) => s + m.value / m.max, 0) / metrics.length;
const momentumScore = Math.round(totalProgress * 100);

export function MomentumTracker() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [celebrating, setCelebrating] = useState<number | null>(null);

  const complete = (step: typeof nextSteps[0]) => {
    if (completed.includes(step.id)) return;

    setCompleted((prev) => [...prev, step.id]);
    setCelebrating(step.id);
    setTimeout(() => setCelebrating(null), 1800);

    toast.success(step.celebration, {
      duration: 4000,
      icon: "✨",
      style: {
        background: "hsl(var(--surface-2))",
        border: "1px solid hsl(var(--coral) / 0.25)",
        color: "hsl(var(--foreground))",
      },
    });
  };

  const allDone = completed.length === nextSteps.length;

  return (
    <div className="space-y-5">

      {/* ── Momentum Score ──────────────────────────────────────── */}
      <div className="bg-gradient-card border rounded-2xl p-6 relative overflow-hidden"
        style={{ borderColor: "hsl(var(--coral) / 0.2)" }}>

        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
          style={{ background: "hsl(var(--coral) / 0.06)" }} />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-coral rounded-xl flex items-center justify-center glow-coral">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Momentum</h2>
                <p className="text-xs text-muted-foreground">Your progress toward your path</p>
              </div>
            </div>
            {/* Score badge */}
            <div className="text-right">
              <p className="text-3xl font-bold text-gradient-coral leading-none">{momentumScore}</p>
              <p className="text-xs text-muted-foreground mt-0.5">momentum score</p>
            </div>
          </div>

          {/* Overall bar */}
          <div className="mb-5">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Overall progress</span>
              <span className="text-indigo-400 font-medium">{momentumScore}%</span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-coral rounded-full transition-all duration-700"
                style={{ width: `${momentumScore}%` }}
              />
            </div>
          </div>

          {/* Metric grid */}
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((m) => {
              const c = colorClasses[m.color as ColorKey];
              const Icon = m.icon;
              const pct = Math.round((m.value / m.max) * 100);
              return (
                <div key={m.label} className={`bg-surface-2 border ${c.border} rounded-xl p-3`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${c.bg}`}>
                      <Icon className={`w-3 h-3 ${c.text}`} />
                    </div>
                    <span className="text-xs font-medium text-foreground">{m.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-1.5">
                    <span className={`text-xl font-bold ${c.text}`}>{m.value}</span>
                    <span className="text-xs text-muted-foreground">/ {m.max}</span>
                  </div>
                  <div className="h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${c.bar}`}
                      style={m.color === "violet"
                        ? { background: "hsl(var(--violet))", width: `${pct}%` }
                        : { width: `${pct}%` }
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground/60 mt-1">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Daily Next Step ─────────────────────────────────────── */}
      <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <Heart className="w-4 h-4 text-amber" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-sm">Today's Small Steps</h2>
              <p className="text-xs text-muted-foreground">
                {completed.length}/{nextSteps.length} done · each under 5 min
              </p>
            </div>
          </div>
          {completed.length > 0 && (
            <div className="flex items-center gap-1.5 border rounded-full px-2.5 py-1"
              style={{ background: "hsl(var(--coral) / 0.08)", borderColor: "hsl(var(--coral) / 0.2)" }}>
              <TrendingUp className="w-3 h-3 text-indigo-400" />
              <span className="text-indigo-400 text-xs font-bold">+{completed.length * 15} momentum</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-border rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-gradient-coral rounded-full transition-all duration-500"
            style={{ width: `${(completed.length / nextSteps.length) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-2.5">
          {nextSteps.map((step) => {
            const done = completed.includes(step.id);
            const celebrating_ = celebrating === step.id;
            const Icon = step.icon;
            const c = colorClasses[step.color as ColorKey];

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 ${
                  celebrating_
                    ? "border-coral-500/40 bg-indigo-500-500/10 scale-[1.01]"
                    : done
                    ? "border-border/30 bg-transparent opacity-60"
                    : `bg-surface-2 border-border/40 hover:border-border`
                }`}
              >
                {/* Check button */}
                <button
                  onClick={() => complete(step)}
                  disabled={done}
                  className="shrink-0 transition-transform active:scale-90"
                >
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground/30 hover:text-indigo-400/50 transition-colors" />
                  )}
                </button>

                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${c.text}`} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium transition-all ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground/70 truncate">{step.sub}</p>
                </div>

                {/* Link arrow */}
                {!done && (
                  <Link to={step.href} className="shrink-0">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-surface-3">
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* All done celebration */}
        {allDone && (
          <div className="mt-4 rounded-xl p-4 text-center animate-fade-in border"
            style={{ background: "hsl(var(--coral) / 0.07)", borderColor: "hsl(var(--coral) / 0.2)" }}>
            <p className="text-lg mb-1">🎉</p>
            <p className="text-sm font-semibold text-foreground">You built real momentum today.</p>
            <p className="text-xs text-muted-foreground mt-0.5">Small steps compound into big change.</p>
          </div>
        )}
      </div>

      {/* ── Progress celebration messages ───────────────────────── */}
      {completed.length >= 2 && completed.length < nextSteps.length && (
        <div className="rounded-xl px-4 py-3 border text-sm animate-fade-in"
          style={{ background: "hsl(var(--amber) / 0.07)", borderColor: "hsl(var(--amber) / 0.2)" }}>
          <p className="text-amber font-medium">
            {completed.length === 2 && "You're gaining momentum. Keep going."}
            {completed.length === 3 && "You are gaining clarity. Each step matters."}
            {completed.length === 4 && "You're almost there. One more."}
          </p>
        </div>
      )}
    </div>
  );
}
