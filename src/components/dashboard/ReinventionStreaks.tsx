import { Flame, BookOpen, Compass, FlaskConical, Trophy } from "lucide-react";

const streaks = [
  { label: "Reflecting",   days: 12, icon: BookOpen,    color: "coral",  best: 18 },
  { label: "Exploring",    days: 7,  icon: Compass,     color: "violet", best: 7  },
  { label: "Experimenting",days: 4,  icon: FlaskConical, color: "amber", best: 9  },
];

const milestones = [
  { days: 7,  label: "7 days of small steps",     achieved: true  },
  { days: 30, label: "30 days of becoming",        achieved: false },
  { days: 90, label: "90 days of real momentum",   achieved: false },
];

const weekDots = ["M", "T", "W", "T", "F", "S", "S"];
const activeWeek = [true, true, true, true, true, false, false];

export function ReinventionStreaks() {
  return (
    <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
          <Flame className="w-5 h-5 text-amber" />
        </div>
        <div>
          <h2 className="font-bold text-foreground">Your Streaks</h2>
          <p className="text-xs text-muted-foreground">Consistency builds momentum</p>
        </div>
      </div>

      {/* Weekly activity dots */}
      <div className="flex gap-2 mb-5">
        {weekDots.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div className={`w-full aspect-square rounded-md transition-colors ${activeWeek[i] ? "bg-gradient-coral" : "bg-surface-3"}`} />
            <span className="text-xs text-muted-foreground/50">{day}</span>
          </div>
        ))}
      </div>

      {/* Streak counters */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {streaks.map((s) => {
          const Icon = s.icon;
          const colorMap = {
            coral:  { bg: "bg-indigo-500-500/10",  text: "text-indigo-400",  border: "border-coral-500/20"  },
            violet: { bg: "bg-violet-500/10", text: "text-violet", border: "border-violet-500/20" },
            amber:  { bg: "bg-amber-500/10",  text: "text-amber",  border: "border-amber-500/20"  },
          };
          const c = colorMap[s.color as keyof typeof colorMap];
          return (
            <div key={s.label} className={`bg-surface-2 border ${c.border} rounded-xl p-3 text-center`}>
              <div className={`w-8 h-8 ${c.bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-4 h-4 ${c.text}`} />
              </div>
              <p className={`text-xl font-bold ${c.text}`}>{s.days}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xs text-muted-foreground/50 mt-0.5">Best: {s.best}d</p>
            </div>
          );
        })}
      </div>

      {/* Milestones */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Milestones</p>
        <div className="space-y-2">
          {milestones.map((m) => (
            <div key={m.days} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                m.achieved ? "bg-gradient-coral" : "bg-surface-3 border border-border"
              }`}>
                {m.achieved ? (
                  <Trophy className="w-3.5 h-3.5 text-primary-foreground" />
                ) : (
                  <span className="text-xs text-muted-foreground/40">{m.days}</span>
                )}
              </div>
              <p className={`text-sm ${m.achieved ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {m.label}
              </p>
              {m.achieved && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full border"
                  style={{ background: "hsl(var(--coral) / 0.1)", borderColor: "hsl(var(--coral) / 0.2)", color: "hsl(var(--coral))" }}>
                  Achieved ✓
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
