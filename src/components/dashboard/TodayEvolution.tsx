import { useState } from "react";
import { CheckCircle2, Circle, Zap, BookOpen, MessageCircle, Compass, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const dailyActions = [
  {
    id: 1,
    label: "Explore a new opportunity space",
    sub: "AI Operations is trending this week",
    icon: Compass,
    href: "/opportunities",
    color: "teal",
    xp: 20,
  },
  {
    id: 2,
    label: "Complete a short learning module",
    sub: "AI Literacy for Professionals · 15 min",
    icon: BookOpen,
    href: "/learn",
    color: "violet",
    xp: 30,
  },
  {
    id: 3,
    label: "Ask the AI coach a question",
    sub: "What skill should I focus on this week?",
    icon: MessageCircle,
    href: "/coach",
    color: "amber",
    xp: 10,
  },
];

export function TodayEvolution() {
  const [completed, setCompleted] = useState<number[]>([]);

  const toggle = (id: number) =>
    setCompleted((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const totalXP = completed.reduce((sum, id) => {
    const a = dailyActions.find((a) => a.id === id);
    return sum + (a?.xp ?? 0);
  }, 0);

  return (
    <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-teal rounded-xl flex items-center justify-center glow-teal">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Today's Evolution</h2>
            <p className="text-xs text-muted-foreground">
              {completed.length}/{dailyActions.length} actions complete
            </p>
          </div>
        </div>
        {totalXP > 0 && (
          <div className="flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1">
            <Zap className="w-3 h-3 text-teal" />
            <span className="text-teal text-xs font-bold">+{totalXP} XP</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-border rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-teal rounded-full transition-all duration-500"
          style={{ width: `${(completed.length / dailyActions.length) * 100}%` }}
        />
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {dailyActions.map((action) => {
          const done = completed.includes(action.id);
          const Icon = action.icon;
          const colorMap = {
            teal: "text-teal bg-teal-500/10",
            violet: "text-violet bg-violet-500/10",
            amber: "text-amber bg-amber-500/10",
          };
          const borderMap = {
            teal: "border-teal-500/30",
            violet: "border-violet-500/30",
            amber: "border-amber-500/30",
          };
          return (
            <div
              key={action.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                done
                  ? "bg-teal-500/5 border-teal-500/20 opacity-70"
                  : `bg-surface-2 ${borderMap[action.color as keyof typeof borderMap]}`
              }`}
            >
              <button onClick={() => toggle(action.id)} className="shrink-0">
                {done ? (
                  <CheckCircle2 className="w-5 h-5 text-teal" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground/40" />
                )}
              </button>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${colorMap[action.color as keyof typeof colorMap]}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {action.label}
                </p>
                <p className="text-xs text-muted-foreground truncate">{action.sub}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground/60">+{action.xp} XP</span>
                <Link to={action.href}>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-surface-3">
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {completed.length === dailyActions.length && (
        <div className="mt-4 bg-teal-500/10 border border-teal-500/20 rounded-xl p-3 text-center animate-fade-in">
          <p className="text-teal font-semibold text-sm">🎉 All done for today! You're evolving.</p>
        </div>
      )}
    </div>
  );
}
