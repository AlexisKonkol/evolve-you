import { useState } from "react";
import { Target, ChevronDown, CheckCircle2, Circle, Star } from "lucide-react";

const futureIdentities = [
  { id: "ai-consultant", label: "AI Workflow Consultant", progress: 42, color: "teal" },
  { id: "creator-educator", label: "Creator Educator", progress: 18, color: "violet" },
  { id: "automation-strategist", label: "Automation Strategist", progress: 61, color: "amber" },
];

const milestones = [
  { label: "Completed AI Literacy module", done: true },
  { label: "Mapped 3 future opportunity spaces", done: true },
  { label: "Launched first micro experiment", done: true },
  { label: "Built first automation workflow", done: false },
  { label: "Completed 5 learning modules", done: false },
  { label: "Shared Identity Profile publicly", done: false },
];

export function FutureIdentityTracker() {
  const [selected, setSelected] = useState("automation-strategist");
  const [open, setOpen] = useState(false);

  const current = futureIdentities.find((f) => f.id === selected)!;
  const completedCount = milestones.filter((m) => m.done).length;

  const colorMap = {
    teal: {
      bar: "bg-gradient-teal",
      text: "text-teal",
      bg: "bg-teal-500/10",
      border: "border-teal-500/20",
    },
    violet: {
      bar: "bg-violet-500",
      text: "text-violet",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    amber: {
      bar: "bg-gradient-amber",
      text: "text-amber",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  };
  const c = colorMap[current.color as keyof typeof colorMap];

  return (
    <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center">
          <Target className="w-5 h-5 text-violet" />
        </div>
        <div>
          <h2 className="font-bold text-foreground">Future Identity</h2>
          <p className="text-xs text-muted-foreground">Who you are becoming</p>
        </div>
      </div>

      {/* Identity selector */}
      <div className="relative mb-5">
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between p-3 rounded-xl border ${c.border} ${c.bg} transition-colors`}
        >
          <div className="flex items-center gap-2">
            <Star className={`w-4 h-4 ${c.text}`} />
            <span className={`text-sm font-semibold ${c.text}`}>{current.label}</span>
          </div>
          <ChevronDown className={`w-4 h-4 ${c.text} transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface-2 border border-border rounded-xl overflow-hidden z-10 shadow-card animate-fade-in">
            {futureIdentities.map((fi) => (
              <button
                key={fi.id}
                onClick={() => { setSelected(fi.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-3 text-left transition-colors ${fi.id === selected ? "bg-surface-3" : ""}`}
              >
                <Star className={`w-3.5 h-3.5 ${colorMap[fi.color as keyof typeof colorMap].text}`} />
                <span className="text-sm text-foreground">{fi.label}</span>
                <span className={`ml-auto text-xs font-bold ${colorMap[fi.color as keyof typeof colorMap].text}`}>{fi.progress}%</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Progress ring area */}
      <div className="flex items-center gap-5 mb-5">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="32"
              fill="none"
              stroke={current.color === "violet" ? "hsl(260 60% 60%)" : current.color === "amber" ? "hsl(38 90% 55%)" : "hsl(172 80% 40%)"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 32}`}
              strokeDashoffset={`${2 * Math.PI * 32 * (1 - current.progress / 100)}`}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${c.text}`}>{current.progress}%</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground mb-1">Path to <span className={c.text}>{current.label}</span></p>
          <p className="text-xs text-muted-foreground mb-2">{completedCount} of {milestones.length} milestones completed</p>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div className={`h-full ${c.bar} rounded-full transition-all duration-700`} style={{ width: `${(completedCount / milestones.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Milestones list */}
      <div className="space-y-2">
        {milestones.map((m, i) => (
          <div key={i} className="flex items-center gap-3">
            {m.done ? (
              <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-muted-foreground/30 shrink-0" />
            )}
            <span className={`text-sm ${m.done ? "text-foreground" : "text-muted-foreground"}`}>{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
