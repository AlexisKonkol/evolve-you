import { Sparkles, TrendingUp, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const insights = [
  {
    id: 1,
    text: "You're developing strong strengths in systems thinking and automation — two of the fastest growing skill sets in the AI economy.",
    tag: "Strength Signal",
    tagColor: "teal",
  },
  {
    id: 2,
    text: "You're well positioned for emerging roles in AI operations and digital consulting based on your curiosity patterns.",
    tag: "Opportunity Alert",
    tagColor: "amber",
  },
  {
    id: 3,
    text: "Your communication strengths are rare in technical fields. Leaning into this gives you a unique hybrid advantage.",
    tag: "Identity Edge",
    tagColor: "violet",
  },
];

const growthStats = [
  { label: "Skills mapped", value: "8", delta: "+2 this week" },
  { label: "Opportunities explored", value: "14", delta: "+5 this week" },
  { label: "Learning hours", value: "3.5h", delta: "this month" },
];

export function ReinventionInsights() {
  const tagColorMap = {
    teal: "bg-teal-500/10 text-teal border-teal-500/20",
    amber: "bg-amber-500/10 text-amber border-amber-500/20",
    violet: "bg-violet-500/10 text-violet border-violet-500/20",
  };

  return (
    <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-teal" />
        </div>
        <div>
          <h2 className="font-bold text-foreground">Reinvention Insights</h2>
          <p className="text-xs text-muted-foreground">AI-generated · updated weekly</p>
        </div>
      </div>

      {/* Growth stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {growthStats.map((s) => (
          <div key={s.label} className="bg-surface-2 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-teal">{s.value}</p>
            <p className="text-xs text-foreground font-medium">{s.label}</p>
            <p className="text-xs text-muted-foreground/60">{s.delta}</p>
          </div>
        ))}
      </div>

      {/* Insight cards */}
      <div className="space-y-3">
        {insights.map((ins) => (
          <div key={ins.id} className="bg-surface-2 rounded-xl p-4">
            <span
              className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border mb-2 ${
                tagColorMap[ins.tagColor as keyof typeof tagColorMap]
              }`}
            >
              {ins.tag}
            </span>
            <p className="text-sm text-muted-foreground leading-relaxed">{ins.text}</p>
          </div>
        ))}
      </div>

      <Link to="/opportunities" className="flex items-center gap-1 mt-4 text-xs text-teal hover:text-teal/80 transition-colors">
        <TrendingUp className="w-3.5 h-3.5" />
        See opportunities tailored to you
        <ChevronRight className="w-3.5 h-3.5 ml-auto" />
      </Link>
    </div>
  );
}
