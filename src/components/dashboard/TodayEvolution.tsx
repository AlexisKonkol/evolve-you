import { useState } from "react";
import { CheckCircle2, Circle, Zap, BookOpen, MessageCircle, Compass, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const dailyActions = [
  {
    id: 1,
    label: "Explore a new opportunity space",
    sub: "AI Operations is trending this week",
    icon: Compass,
    href: "/opportunities",
    color: "coral",
    celebration: "You explored a new possibility. You're gaining momentum.",
  },
  {
    id: 2,
    label: "Complete a short learning module",
    sub: "AI Literacy for Professionals · 15 min",
    icon: BookOpen,
    href: "/learn",
    color: "violet",
    celebration: "You became the kind of person who builds new skills.",
  },
  {
    id: 3,
    label: "Ask the AI coach a question",
    sub: "What skill should I focus on this week?",
    icon: MessageCircle,
    href: "/coach",
    color: "amber",
    celebration: "Great question. Curious people grow faster.",
  },
];

export function TodayEvolution() {
  const [completed, setCompleted] = useState<number[]>([]);

  const toggle = (action: typeof dailyActions[0]) => {
    if (completed.includes(action.id)) {
      setCompleted((prev) => prev.filter((x) => x !== action.id));
      return;
    }
    setCompleted((prev) => [...prev, action.id]);
    toast.success(action.celebration, {
      duration: 4000,
      icon: "✨",
      style: {
        background: "hsl(var(--surface-2))",
        border: "1px solid hsl(var(--coral) / 0.25)",
        color: "hsl(var(--foreground))",
      },
    });
  };

  return (
    <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-coral rounded-xl flex items-center justify-center glow-coral">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Today's Becoming</h2>
            <p className="text-xs text-muted-foreground">
              {completed.length}/{dailyActions.length} steps taken today
            </p>
          </div>
        </div>
        {completed.length > 0 && (
          <div className="flex items-center gap-1.5 border rounded-full px-3 py-1"
            style={{ background: "hsl(var(--coral) / 0.08)", borderColor: "hsl(var(--coral) / 0.2)" }}>
            <Zap className="w-3 h-3 text-coral" />
            <span className="text-coral text-xs font-bold">+{completed.length * 20} momentum</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-border rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-coral rounded-full transition-all duration-500"
          style={{ width: `${(completed.length / dailyActions.length) * 100}%` }}
        />
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {dailyActions.map((action) => {
          const done = completed.includes(action.id);
          const Icon = action.icon;
          const colorMap = {
            coral:  "text-coral bg-coral-500/10",
            violet: "text-violet bg-violet-500/10",
            amber:  "text-amber bg-amber-500/10",
          };
          const borderMap = {
            coral:  "border-coral-500/30",
            violet: "border-violet-500/30",
            amber:  "border-amber-500/30",
          };
          return (
            <div
              key={action.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                done
                  ? "border-border/30 opacity-60 bg-transparent"
                  : `bg-surface-2 ${borderMap[action.color as keyof typeof borderMap]}`
              }`}
            >
              <button onClick={() => toggle(action)} className="shrink-0 transition-transform active:scale-90">
                {done ? (
                  <CheckCircle2 className="w-5 h-5 text-coral" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground/40 hover:text-coral/50 transition-colors" />
                )}
              </button>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${colorMap[action.color as keyof typeof colorMap]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {action.label}
                </p>
                <p className="text-xs text-muted-foreground truncate">{action.sub}</p>
              </div>
              {!done && (
                <Link to={action.href}>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-surface-3">
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {completed.length === dailyActions.length && (
        <div className="mt-4 rounded-xl p-3 text-center animate-fade-in border"
          style={{ background: "hsl(var(--coral) / 0.07)", borderColor: "hsl(var(--coral) / 0.2)" }}>
          <p className="text-sm font-semibold" style={{ color: "hsl(var(--coral))" }}>
            🎉 Every step counts. You're becoming.
          </p>
        </div>
      )}
    </div>
  );
}
