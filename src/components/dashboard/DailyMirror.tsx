import { useState, useEffect } from "react";
import { Brain, Sparkles, RefreshCw, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const reflections = [
  {
    prompt: "What's one thing you did this week that felt genuinely like you — not just what was expected?",
    followUp: "That feeling you just thought of? That's an identity signal.",
    category: "Identity Signal",
  },
  {
    prompt: "What problem are you secretly hoping someone will ask you to solve?",
    followUp: "The problems you want to be asked about reveal your deepest strengths.",
    category: "Strength Signal",
  },
  {
    prompt: "If you could spend the next 6 months learning anything — and it didn't have to lead to a job — what would it be?",
    followUp: "Pure curiosity without external pressure is one of the strongest identity signals.",
    category: "Curiosity Signal",
  },
  {
    prompt: "Who's living a kind of life that makes you think 'I want some of that'?",
    followUp: "The lives you're drawn to reveal values you haven't named yet.",
    category: "Values Signal",
  },
  {
    prompt: "What would you do differently if no one was watching and nothing was being measured?",
    followUp: "Remove performance from the equation — what's left is pure identity.",
    category: "Identity Signal",
  },
  {
    prompt: "What's a belief you held about yourself five years ago that turned out to be wrong?",
    followUp: "Identity evolves. The most interesting version of you is still emerging.",
    category: "Growth Signal",
  },
  {
    prompt: "When you imagine your future self at their most alive, what are they doing?",
    followUp: "This isn't fantasy — it's your identity showing you where it wants to go.",
    category: "Future Signal",
  },
];

const categoryColors: Record<string, { text: string; bg: string; border: string }> = {
  "Identity Signal": { text: "text-coral",  bg: "bg-coral-500/10",  border: "border-coral-500/20"  },
  "Strength Signal": { text: "text-amber",  bg: "bg-amber-500/10",  border: "border-amber-500/20"  },
  "Curiosity Signal":{ text: "text-violet", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  "Values Signal":   { text: "text-amber",  bg: "bg-amber-500/10",  border: "border-amber-500/20"  },
  "Growth Signal":   { text: "text-violet", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  "Future Signal":   { text: "text-coral",  bg: "bg-coral-500/10",  border: "border-coral-500/20"  },
};

function getDailyIndex() {
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return day % reflections.length;
}

export function DailyMirror() {
  const [idx, setIdx] = useState(getDailyIndex());
  const [revealed, setRevealed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const r = reflections[idx];
  const c = categoryColors[r.category];

  const refresh = () => {
    setRefreshing(true);
    setRevealed(false);
    setTimeout(() => {
      setIdx((i) => (i + 1) % reflections.length);
      setRefreshing(false);
    }, 350);
  };

  return (
    <div className="bg-gradient-card border border-border/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "hsl(var(--coral) / 0.12)" }}>
            <Brain className="w-4 h-4 text-coral" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground text-sm">Today's Mirror</h2>
            <p className="text-xs text-muted-foreground">One question. No wrong answer.</p>
          </div>
        </div>
        <button
          onClick={refresh}
          className="p-1.5 rounded-lg hover:bg-surface-2 transition-colors text-muted-foreground hover:text-foreground"
          title="Different question"
        >
          <RefreshCw className={`w-3.5 h-3.5 transition-transform duration-350 ${refreshing ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Category badge */}
      <div className="px-6 mb-4">
        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${c.bg} ${c.border} ${c.text}`}>
          {r.category}
        </span>
      </div>

      {/* Question */}
      <div className="px-6 pb-4">
        <p className="text-base font-semibold text-foreground leading-relaxed mb-4 font-display">
          "{r.prompt}"
        </p>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors italic flex items-center gap-1 group"
          >
            <Sparkles className="w-3 h-3 group-hover:text-amber transition-colors" />
            Tap to see what this question reveals
          </button>
        ) : (
          <div
            className="rounded-xl p-3 text-sm text-muted-foreground leading-relaxed border"
            style={{
              background: "hsl(var(--surface-2))",
              borderColor: "hsl(var(--coral) / 0.15)",
              animation: "fadeIn 0.4s ease-out both",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-coral inline mr-1.5 -mt-0.5" />
            {r.followUp}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between"
        style={{ background: "hsl(var(--surface-2) / 0.4)" }}>
        <span className="text-xs text-muted-foreground/50">Reflect, then journal your answer</span>
        <Link to="/journal" className="flex items-center gap-1 text-xs text-coral hover:text-coral/80 font-semibold transition-colors">
          Open Journal <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
