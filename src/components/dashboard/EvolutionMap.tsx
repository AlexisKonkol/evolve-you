import { Map, ArrowRight, CheckCircle2, Circle } from "lucide-react";

const journeySteps = [
  {
    label: "Started",
    sub: "Identity Discovery",
    detail: "Defined archetype: The Connector-Builder",
    done: true,
    date: "Feb 12",
  },
  {
    label: "Skills Mapped",
    sub: "Skill Translation",
    detail: "8 skills translated to AI-era relevance",
    done: true,
    date: "Feb 19",
  },
  {
    label: "Opportunities Explored",
    sub: "Opportunity Mapping",
    detail: "14 future roles explored, 3 shortlisted",
    done: true,
    date: "Mar 1",
  },
  {
    label: "Path Building",
    sub: "Reinvention Paths",
    detail: "AI Consultant roadmap 35% complete",
    done: false,
    date: "In Progress",
  },
  {
    label: "Continuous Evolution",
    sub: "Ongoing Growth",
    detail: "Unlock after completing a full path",
    done: false,
    date: "Future",
  },
];

const skillGains = [
  { label: "AI Literacy", weeks: 3, color: "teal" },
  { label: "Systems Thinking", weeks: 5, color: "violet" },
  { label: "Automation", weeks: 2, color: "amber" },
  { label: "Digital Strategy", weeks: 1, color: "teal" },
];

export function EvolutionMap() {
  const completedSteps = journeySteps.filter((s) => s.done).length;

  return (
    <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center">
          <Map className="w-5 h-5 text-teal" />
        </div>
        <div>
          <h2 className="font-bold text-foreground">Your Evolution Map</h2>
          <p className="text-xs text-muted-foreground">{completedSteps} of {journeySteps.length} stages complete</p>
        </div>
      </div>

      {/* Journey timeline */}
      <div className="relative mb-6">
        {journeySteps.map((step, i) => (
          <div key={i} className="flex gap-4 relative">
            {/* Connector line */}
            {i < journeySteps.length - 1 && (
              <div className="absolute left-[11px] top-6 w-0.5 h-full bg-border" />
            )}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 mt-0.5 ${step.done ? "bg-gradient-teal" : "bg-surface-3 border border-border"}`}>
              {step.done ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
              ) : (
                <Circle className="w-3 h-3 text-muted-foreground/40" />
              )}
            </div>
            <div className={`flex-1 pb-5 ${i === journeySteps.length - 1 ? "pb-0" : ""}`}>
              <div className="flex items-center justify-between mb-0.5">
                <p className={`text-sm font-semibold ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </p>
                <span className="text-xs text-muted-foreground/50">{step.date}</span>
              </div>
              <p className="text-xs text-teal font-medium mb-0.5">{step.sub}</p>
              <p className="text-xs text-muted-foreground">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Skills gained */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Skills Gained</p>
        <div className="space-y-2">
          {skillGains.map((sk) => {
            const barColor = sk.color === "teal" ? "bg-gradient-teal" : sk.color === "amber" ? "bg-gradient-amber" : "bg-violet-500";
            return (
              <div key={sk.label} className="flex items-center gap-3">
                <span className="text-xs text-foreground/80 w-28 shrink-0">{sk.label}</span>
                <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                  <div className={`h-full ${barColor} rounded-full`} style={{ width: `${Math.min(sk.weeks * 15, 100)}%` }} />
                </div>
                <span className="text-xs text-muted-foreground/50 w-14 text-right">{sk.weeks}w in</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Where they're headed */}
      <div className="mt-5 bg-teal-500/5 border border-teal-500/15 rounded-xl p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Destination</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">Retail Manager</span>
          <ArrowRight className="w-4 h-4 text-teal" />
          <span className="text-sm font-bold text-teal">AI Customer Experience Leader</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Estimated timeline: 6–9 months at current pace</p>
      </div>
    </div>
  );
}
