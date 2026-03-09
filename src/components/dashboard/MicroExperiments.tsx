import { useState } from "react";
import { FlaskConical, Plus, CheckCircle2, Clock, Lightbulb, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "active" | "completed" | "idea";

interface Experiment {
  id: number;
  title: string;
  description: string;
  status: Status;
  days: number;
  outcome?: string;
}

const initialExperiments: Experiment[] = [
  {
    id: 1,
    title: "Build a simple AI workflow",
    description: "Automate a repetitive task using a no-code AI tool",
    status: "active",
    days: 3,
  },
  {
    id: 2,
    title: "Write a digital product idea",
    description: "Draft a 1-page concept for an AI-assisted product",
    status: "completed",
    days: 7,
    outcome: "Created a concept for an AI onboarding toolkit",
  },
  {
    id: 3,
    title: "Launch a community discussion",
    description: "Post a question in the Career Pivots group",
    status: "idea",
    days: 0,
  },
];

const statusConfig: Record<Status, { label: string; bg: string; text: string; icon: typeof Clock }> = {
  active: { label: "In Progress", bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber", icon: Clock },
  completed: { label: "Completed", bg: "bg-teal-500/10 border-teal-500/20", text: "text-teal", icon: CheckCircle2 },
  idea: { label: "Idea", bg: "bg-violet-500/10 border-violet-500/20", text: "text-violet", icon: Lightbulb },
};

export function MicroExperiments() {
  const [experiments, setExperiments] = useState(initialExperiments);

  const complete = (id: number) => {
    setExperiments((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "completed" as Status } : e))
    );
  };

  const activate = (id: number) => {
    setExperiments((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "active" as Status } : e))
    );
  };

  const completed = experiments.filter((e) => e.status === "completed").length;

  return (
    <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-amber" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Micro Experiments</h2>
            <p className="text-xs text-muted-foreground">{completed} completed · test before you commit</p>
          </div>
        </div>
        <Button size="sm" className="bg-surface-2 border border-border hover:border-amber-500/30 text-muted-foreground hover:text-amber h-8 gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          New
        </Button>
      </div>

      <div className="space-y-3">
        {experiments.map((exp) => {
          const cfg = statusConfig[exp.status];
          const Icon = cfg.icon;
          return (
            <div key={exp.id} className={`border rounded-xl p-4 transition-all ${cfg.bg}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-3.5 h-3.5 ${cfg.text} shrink-0`} />
                    <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.text}`}>{cfg.label}</span>
                    {exp.days > 0 && (
                      <span className="text-xs text-muted-foreground/60 ml-auto">{exp.days}d</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{exp.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{exp.description}</p>
                </div>
              </div>
              {exp.outcome && (
                <div className="mt-2 p-2 bg-teal-500/5 border border-teal-500/10 rounded-lg">
                  <p className="text-xs text-teal">
                    <span className="font-semibold">Outcome:</span> {exp.outcome}
                  </p>
                </div>
              )}
              {exp.status === "active" && (
                <button
                  onClick={() => complete(exp.id)}
                  className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-teal transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mark as complete
                </button>
              )}
              {exp.status === "idea" && (
                <button
                  onClick={() => activate(exp.id)}
                  className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-amber transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" /> Start this experiment
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
