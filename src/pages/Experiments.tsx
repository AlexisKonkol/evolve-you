import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  FlaskConical, Plus, CheckCircle2, Clock, Lightbulb,
  ArrowUpRight, Target, BarChart3, MessageCircle
} from "lucide-react";
import { Link } from "react-router-dom";

type Status = "active" | "completed" | "idea";

interface Experiment {
  id: number;
  title: string;
  description: string;
  status: Status;
  days: number;
  category: string;
  outcome?: string;
}

const initialExperiments: Experiment[] = [
  {
    id: 1,
    title: "Build a simple AI workflow",
    description: "Automate a repetitive task using a no-code AI tool like Zapier or Make. Document what you learned.",
    status: "active",
    days: 3,
    category: "Automation",
  },
  {
    id: 2,
    title: "Write a digital product concept",
    description: "Draft a 1-page concept for an AI-assisted product you could build or sell.",
    status: "completed",
    days: 7,
    category: "Digital Product",
    outcome: "Created a concept for an AI onboarding toolkit for small teams. Potential $49/mo SaaS.",
  },
  {
    id: 3,
    title: "Launch a community discussion",
    description: "Post a thoughtful question or insight in the Career Pivots community group.",
    status: "idea",
    days: 0,
    category: "Community",
  },
  {
    id: 4,
    title: "Offer a micro consulting session",
    description: "Reach out to one person in your network and offer a free 30-min process optimization session.",
    status: "idea",
    days: 0,
    category: "Consulting",
  },
  {
    id: 5,
    title: "Create an automation tool",
    description: "Build a simple tool that saves you 1 hour per week. Document the process and share it.",
    status: "idea",
    days: 0,
    category: "Automation",
  },
];

const statusConfig: Record<Status, { label: string; bg: string; text: string; border: string; icon: typeof Clock }> = {
  active: { label: "In Progress", bg: "bg-amber-500/5", border: "border-amber-500/20", text: "text-amber", icon: Clock },
  completed: { label: "Completed", bg: "bg-teal-500/5", border: "border-teal-500/20", text: "text-teal", icon: CheckCircle2 },
  idea: { label: "Idea", bg: "bg-violet-500/5", border: "border-violet-500/20", text: "text-violet", icon: Lightbulb },
};

const ideaTemplates = [
  "Build a simple AI workflow",
  "Write an outline for a digital product",
  "Offer a small consulting service",
  "Build a micro community",
  "Create an automation for your work",
  "Write a 500-word essay on a new topic",
];

export default function Experiments() {
  const [experiments, setExperiments] = useState(initialExperiments);
  const [showTemplates, setShowTemplates] = useState(false);

  const complete = (id: number) =>
    setExperiments((prev) => prev.map((e) => e.id === id ? { ...e, status: "completed" as Status } : e));

  const activate = (id: number) =>
    setExperiments((prev) => prev.map((e) => e.id === id ? { ...e, status: "active" as Status, days: 0 } : e));

  const addFromTemplate = (title: string) => {
    const newExp: Experiment = {
      id: Date.now(),
      title,
      description: "Add your own details and goal for this experiment.",
      status: "idea",
      days: 0,
      category: "Custom",
    };
    setExperiments((prev) => [...prev, newExp]);
    setShowTemplates(false);
  };

  const stats = {
    active: experiments.filter((e) => e.status === "active").length,
    completed: experiments.filter((e) => e.status === "completed").length,
    ideas: experiments.filter((e) => e.status === "idea").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container max-w-4xl">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 text-sm text-amber font-medium mb-4">
                <FlaskConical className="w-4 h-4" />
                Micro Experiments
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Test before you <span className="text-gradient-amber">commit</span>
              </h1>
              <p className="text-muted-foreground max-w-lg">
                Small experiments are the fastest path to clarity. Run cheap tests of new directions before making big leaps.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                onClick={() => setShowTemplates(!showTemplates)}
                className="bg-gradient-amber text-primary-foreground gap-2 hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                New Experiment
              </Button>
            </div>
          </div>

          {/* Template picker */}
          {showTemplates && (
            <div className="bg-gradient-card border border-amber-500/20 rounded-2xl p-5 mb-6 animate-fade-in">
              <p className="text-sm font-semibold text-foreground mb-3">Quick-start templates:</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {ideaTemplates.map((t) => (
                  <button
                    key={t}
                    onClick={() => addFromTemplate(t)}
                    className="text-left px-4 py-3 bg-surface-2 hover:bg-surface-3 border border-border hover:border-amber-500/30 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    + {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Active", value: stats.active, color: "amber" },
              { label: "Completed", value: stats.completed, color: "teal" },
              { label: "Ideas", value: stats.ideas, color: "violet" },
            ].map((s) => {
              const colorClass = {
                teal: "text-teal bg-teal-500/10 border-teal-500/20",
                amber: "text-amber bg-amber-500/10 border-amber-500/20",
                violet: "text-violet bg-violet-500/10 border-violet-500/20",
              }[s.color];
              return (
                <div key={s.label} className={`bg-gradient-card border rounded-2xl p-4 text-center ${colorClass}`}>
                  <p className="text-3xl font-bold">{s.value}</p>
                  <p className="text-xs font-medium mt-1 opacity-80">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Experiments by status */}
          {(["active", "completed", "idea"] as Status[]).map((status) => {
            const group = experiments.filter((e) => e.status === status);
            if (group.length === 0) return null;
            const cfg = statusConfig[status];
            const Icon = cfg.icon;
            return (
              <div key={status} className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Icon className={`w-4 h-4 ${cfg.text}`} />
                  <h2 className={`text-sm font-semibold uppercase tracking-wider ${cfg.text}`}>{cfg.label}</h2>
                  <span className="text-xs text-muted-foreground">({group.length})</span>
                </div>
                <div className="space-y-4">
                  {group.map((exp) => (
                    <div
                      key={exp.id}
                      className={`border rounded-2xl p-5 ${cfg.bg} ${cfg.border} bg-gradient-card`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-3 ${cfg.text}`}>
                              {exp.category}
                            </span>
                            {exp.days > 0 && (
                              <span className="text-xs text-muted-foreground/60">{exp.days} days in</span>
                            )}
                          </div>
                          <h3 className="font-semibold text-foreground mb-1">{exp.title}</h3>
                          <p className="text-sm text-muted-foreground">{exp.description}</p>
                        </div>
                      </div>

                      {exp.outcome && (
                        <div className="mt-3 p-3 bg-teal-500/5 border border-teal-500/15 rounded-xl">
                          <p className="text-xs font-semibold text-teal mb-1">Outcome</p>
                          <p className="text-sm text-muted-foreground">{exp.outcome}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mt-4">
                        {exp.status === "active" && (
                          <button
                            onClick={() => complete(exp.id)}
                            className={`flex items-center gap-1.5 text-xs font-medium ${cfg.text} hover:opacity-80 transition-opacity`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mark complete
                          </button>
                        )}
                        {exp.status === "idea" && (
                          <button
                            onClick={() => activate(exp.id)}
                            className={`flex items-center gap-1.5 text-xs font-medium ${cfg.text} hover:opacity-80 transition-opacity`}
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            Start this experiment
                          </button>
                        )}
                        {exp.status === "completed" && (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-teal">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Complete
                          </span>
                        )}
                        <Link to="/coach" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-teal transition-colors ml-auto">
                          <MessageCircle className="w-3.5 h-3.5" />
                          Ask AI Coach
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Philosophy callout */}
          <div className="bg-gradient-card border border-border/50 rounded-2xl p-6 text-center">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="w-5 h-5 text-amber" />
            </div>
            <h3 className="font-bold text-foreground mb-2">The Experiment Mindset</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
              Every major reinvention starts with a small experiment. You don't need a perfect plan — you need 10 small bets.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-teal" />
                {stats.completed} experiments complete
              </div>
              <div className="flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-amber" />
                {stats.active + stats.ideas} in the pipeline
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
