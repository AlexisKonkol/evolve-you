import { useState } from "react";
import { Flame, Share2, Copy, Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const archetypeData = {
  name: "The Connector-Builder",
  tagline: "You bring people together and build things that last.",
  traits: ["Systems Thinker", "Empathetic Communicator", "Relentless Builder"],
  curiosity: "Human systems, emerging technology, and what makes teams great",
  superpower: "Translating complexity into clarity for people who need it most",
  nextChapter: "Roles at the intersection of people and technology",
};

export function ShareableIdentityCard() {
  const [copied, setCopied] = useState(false);

  const shareText = `My NAVO identity archetype: "${archetypeData.name}" — ${archetypeData.tagline} Discover yours at navo.app`;

  const copy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      toast.success("Copied! Share your identity archetype.", {
        icon: "✨",
        style: {
          background: "hsl(var(--surface-2))",
          border: "1px solid hsl(var(--coral) / 0.25)",
          color: "hsl(var(--foreground))",
        },
      });
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="bg-gradient-card border border-border/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-coral flex items-center justify-center glow-coral">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground text-sm">Your Identity Card</h2>
            <p className="text-xs text-muted-foreground">Share who you're becoming</p>
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full font-semibold text-amber bg-amber-500/10 border border-amber-500/20">
          🔥 Shareable
        </span>
      </div>

      {/* The card itself */}
      <div className="mx-6 mb-4 rounded-2xl overflow-hidden relative"
        style={{
          background: "linear-gradient(135deg, hsl(var(--surface-1)) 0%, hsl(20 14% 11%) 100%)",
          border: "1px solid hsl(var(--coral) / 0.2)",
        }}>
        {/* Decorative radial */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 80% 20%, hsl(var(--coral) / 0.07), transparent)" }} />

        <div className="relative p-5">
          {/* Brand mark */}
          <div className="flex items-center gap-1.5 mb-4">
            <div className="w-5 h-5 rounded-md bg-gradient-coral flex items-center justify-center">
              <Flame className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
            <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">NAVO</span>
          </div>

          {/* Archetype */}
          <p className="text-xs font-semibold uppercase tracking-widest text-coral mb-1">My Identity Archetype</p>
          <h3 className="text-xl font-bold text-foreground mb-1">{archetypeData.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{archetypeData.tagline}</p>

          {/* Traits */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {archetypeData.traits.map((t) => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: "hsl(var(--coral) / 0.1)", color: "hsl(var(--coral))", border: "1px solid hsl(var(--coral) / 0.2)" }}>
                {t}
              </span>
            ))}
          </div>

          {/* Superpower */}
          <div className="rounded-xl p-3"
            style={{ background: "hsl(var(--surface-2))", border: "1px solid hsl(var(--border))" }}>
            <p className="text-xs text-muted-foreground/60 mb-0.5">Superpower</p>
            <p className="text-xs font-medium text-foreground">{archetypeData.superpower}</p>
          </div>
        </div>
      </div>

      {/* Share actions */}
      <div className="px-6 pb-6 space-y-2">
        <Button
          onClick={copy}
          className="w-full gap-2 text-xs font-semibold"
          style={{
            background: "hsl(var(--coral) / 0.1)",
            border: "1px solid hsl(var(--coral) / 0.25)",
            color: "hsl(var(--coral))",
          }}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied to clipboard!" : "Copy & share your archetype"}
        </Button>
        <p className="text-center text-xs text-muted-foreground/40">
          Your card evolves as you discover more about yourself.
        </p>
      </div>
    </div>
  );
}
