import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const insights = [
  "You naturally gravitate toward helping others grow.",
  "You enjoy solving complex, multi-layered problems.",
  "You show strong curiosity about emerging technologies.",
  "You bring a human lens to systems and processes.",
  "You thrive when your work creates visible impact.",
];

const identityStatements = [
  "enjoys solving meaningful problems",
  "learns quickly in changing environments",
  "helps others navigate complexity",
  "bridges the human and the technical",
];

export function EmergingIdentity() {
  return (
    <div className="bg-gradient-card border rounded-2xl p-6 relative overflow-hidden"
      style={{ borderColor: "hsl(var(--coral) / 0.2)" }}>

      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none"
        style={{ background: "hsl(var(--coral) / 0.05)" }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-gradient-coral rounded-xl flex items-center justify-center glow-coral shrink-0">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground text-sm">Your Emerging Identity</h2>
            <p className="text-xs text-muted-foreground">Patterns from your reflections</p>
          </div>
        </div>

        {/* Identity statement block */}
        <div className="rounded-xl p-5 mb-5 border"
          style={{ background: "hsl(var(--coral) / 0.05)", borderColor: "hsl(var(--coral) / 0.15)" }}>
          <p className="text-xs text-coral font-semibold uppercase tracking-widest mb-3">You are becoming someone who:</p>
          <ul className="space-y-2">
            {identityStatements.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-coral mt-2 shrink-0" />
                <span className="text-sm text-foreground/85 leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Insight pills */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Patterns we notice in you</p>
          <div className="space-y-2">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-surface-2 rounded-xl">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "hsl(var(--coral) / 0.15)" }}>
                  <span className="text-coral text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Identity shift prompt */}
        <div className="rounded-xl p-4 mb-5 bg-surface-2 border border-border/40">
          <p className="text-xs text-muted-foreground leading-relaxed italic">
            "The most powerful shift isn't asking{" "}
            <span className="text-foreground not-italic font-medium">what should I do</span>
            {" "}— it's asking{" "}
            <span className="text-coral not-italic font-medium">who am I becoming?</span>"
          </p>
        </div>

        <Link to="/life-clarity">
          <Button size="sm" className="w-full gap-2 text-xs"
            style={{ background: "hsl(var(--coral) / 0.1)", border: "1px solid hsl(var(--coral) / 0.25)", color: "hsl(var(--coral))" }}>
            Deepen your self-understanding
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
