import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Zap, Check, Sparkles } from "lucide-react";

const questions = [
  {
    id: "energized",
    question: "When do you feel most energized or alive?",
    subtitle: "Not when you're productive — when you feel genuinely lit up. Think about specific moments, not job descriptions.",
    hint: "Your answer here is one of the most important signals of who you actually are.",
    options: [
      { text: "When I'm helping someone have a breakthrough", emoji: "🤝" },
      { text: "When I'm deep in a complex problem", emoji: "🔍" },
      { text: "When I'm creating something from nothing", emoji: "✨" },
      { text: "When I'm bringing order to chaos", emoji: "⚡" },
      { text: "When I'm exploring a completely new idea", emoji: "🧭" },
      { text: "When I'm connecting people or ideas together", emoji: "🌐" },
    ],
  },
  {
    id: "problems",
    question: "What kinds of problems do you naturally enjoy solving?",
    subtitle: "The problems you'd think about on a Sunday morning, not because you have to — because you can't help it.",
    hint: "The problems you're drawn to reveal your natural intelligence. There's no wrong answer.",
    options: [
      { text: "How to help people understand something difficult", emoji: "💡" },
      { text: "How systems work and why they break", emoji: "⚙️" },
      { text: "How to make something beautiful or meaningful", emoji: "🎨" },
      { text: "Why people behave and feel the way they do", emoji: "🧠" },
      { text: "How ideas can be turned into real things", emoji: "🔨" },
      { text: "How to make something run better or faster", emoji: "🚀" },
    ],
  },
  {
    id: "flow",
    question: "What activities make you lose track of time?",
    subtitle: "Flow states reveal your deepest identity. These aren't hobbies — they're clues about who you really are.",
    hint: "Select all that feel genuinely true. The more honest you are, the more accurate your profile.",
    multi: true,
    options: [
      { text: "Writing, storytelling, or explaining ideas", emoji: "✍️" },
      { text: "Building, coding, or making things work", emoji: "💻" },
      { text: "Learning something new and connecting dots", emoji: "🔗" },
      { text: "Having deep conversations with interesting people", emoji: "💬" },
      { text: "Designing, drawing, or creating visually", emoji: "🎭" },
      { text: "Organizing, planning, or solving logistical puzzles", emoji: "📋" },
    ],
  },
  {
    id: "proud",
    question: "What moments in your life made you feel most proud of yourself?",
    subtitle: "Forget accolades. Think about moments where you felt — quietly, genuinely — like you showed up as your best self.",
    hint: "Pride points to your core identity. When you felt most yourself, that's the signal we're looking for.",
    options: [
      { text: "When I helped someone navigate something hard", emoji: "🤲" },
      { text: "When I built or shipped something real", emoji: "🏗️" },
      { text: "When I figured out a problem no one else could", emoji: "🎯" },
      { text: "When I brought people together around something meaningful", emoji: "🌟" },
      { text: "When I created something that moved or inspired someone", emoji: "💫" },
      { text: "When I led something from uncertainty to clarity", emoji: "🧭" },
    ],
  },
  {
    id: "environment",
    question: "What kind of environment helps you thrive?",
    subtitle: "Identity includes how you work, not just what you do. Your environment is part of who you are.",
    hint: "Most people have never been asked this. Your ideal environment says a lot about your identity.",
    options: [
      { text: "Deep focus with long stretches of uninterrupted time", emoji: "🎯" },
      { text: "Collaborative energy with a team I trust", emoji: "👥" },
      { text: "Freedom to explore and change direction", emoji: "🌊" },
      { text: "Clear structure with meaningful goals", emoji: "📐" },
      { text: "A mix of solitude and rich conversations", emoji: "⚖️" },
      { text: "Spaces where I'm always learning something new", emoji: "📚" },
    ],
  },
  {
    id: "values",
    question: "What matters most to you in how you spend your time?",
    subtitle: "Not what you think you should value — what you actually feel when you're living in alignment.",
    hint: "This is the foundation of your identity. Choose what feels true, not what sounds impressive.",
    multi: true,
    options: [
      { text: "Creating genuine impact in people's lives", emoji: "❤️" },
      { text: "Mastery and depth in something I care about", emoji: "🎓" },
      { text: "Freedom to design my own days", emoji: "🕊️" },
      { text: "Building something that could outlast me", emoji: "🏛️" },
      { text: "Being part of a community I belong to", emoji: "🌿" },
      { text: "Continuous growth and becoming more", emoji: "📈" },
    ],
  },
];

/* ── Identity archetype preview based on answers ──────────────────── */
function getArchetypeHint(answers: Record<string, string[]>): { name: string; desc: string } | null {
  const all = Object.values(answers).flat().join(" ").toLowerCase();
  if (all.includes("helping") || all.includes("people") || all.includes("impact")) {
    return { name: "The Connector", desc: "You light up when you're helping others grow." };
  }
  if (all.includes("building") || all.includes("creating") || all.includes("built")) {
    return { name: "The Builder", desc: "You're driven to make real things in the world." };
  }
  if (all.includes("complex") || all.includes("systems") || all.includes("problem")) {
    return { name: "The Strategist", desc: "You think several layers deeper than most." };
  }
  if (all.includes("learning") || all.includes("exploring") || all.includes("new idea")) {
    return { name: "The Explorer", desc: "Your curiosity is your greatest superpower." };
  }
  return null;
}

export default function Onboarding() {
  const [phase, setPhase] = useState<"intro" | "questions" | "summary">("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  const current = questions[step];
  const selected = answers[current?.id] || [];
  const total = questions.length;
  const progress = phase === "questions" ? ((step + 1) / total) * 100 : phase === "summary" ? 100 : 0;
  const archetypeHint = getArchetypeHint(answers);

  const toggle = (opt: string) => {
    if (current.multi) {
      setAnswers((prev) => {
        const cur = prev[current.id] || [];
        return {
          ...prev,
          [current.id]: cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt],
        };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [current.id]: [opt] }));
    }
  };

  const animateNext = (fn: () => void) => {
    setAnimating(true);
    setTimeout(() => { fn(); setAnimating(false); }, 280);
  };

  const next = () => {
    if (step < total - 1) animateNext(() => setStep(step + 1));
    else animateNext(() => setPhase("summary"));
  };

  const back = () => {
    if (step > 0) animateNext(() => setStep(step - 1));
    else animateNext(() => setPhase("intro"));
  };

  const canProceed = selected.length > 0;

  /* ── Intro phase ──────────────────────────────────────────────── */
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        {/* Top bar */}
        <div className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/50 px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-coral flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground tracking-wide text-sm">
                Path<span className="text-gradient-coral">ly</span>
              </span>
            </div>
            <div className="text-xs text-muted-foreground font-medium">Identity Reset · 4 min</div>
          </div>
        </div>

        <div className="max-w-lg w-full text-center animate-fade-up pt-20">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium mb-8 border"
            style={{ background: "hsl(var(--coral) / 0.08)", borderColor: "hsl(var(--coral) / 0.2)", color: "hsl(var(--coral))" }}>
            <Sparkles className="w-3 h-3" />
            This is unlike any career quiz you've taken
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-5 leading-snug">
            Before we talk about paths,<br />
            <span className="text-gradient-coral italic font-display">let's talk about you.</span>
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md mx-auto">
            We're going to ask you 6 questions. Not about your job history. Not about your skills.
            About what genuinely energizes you, what you find yourself drawn to, and who you actually are.
          </p>

          {/* What this isn't */}
          <div className="bg-gradient-card border border-border/40 rounded-2xl p-5 mb-8 text-left space-y-3">
            {[
              { cross: true,  text: "We won't ask about your job title or resume" },
              { cross: true,  text: "We won't give you a generic personality type" },
              { cross: false, text: "We will help you see patterns you might have missed" },
              { cross: false, text: "We will show you who you're becoming — not just who you were" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  item.cross
                    ? "bg-muted text-muted-foreground"
                    : "bg-coral-500/15 text-coral"
                }`}>
                  {item.cross ? "✕" : "✓"}
                </span>
                <span className={item.cross ? "text-muted-foreground/60 line-through" : "text-foreground"}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground/50 mb-8 italic">
            There are no right answers. Choose what actually resonates — not what sounds impressive.
          </p>

          <Button
            onClick={() => setPhase("questions")}
            className="bg-gradient-coral text-primary-foreground font-semibold px-8 py-6 text-base rounded-xl glow-coral hover:opacity-90 gap-2 group">
            I'm ready — let's go
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    );
  }

  /* ── Summary phase ───────────────────────────────────────────── */
  if (phase === "summary") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/50 px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-coral flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground tracking-wide text-sm">
                Path<span className="text-gradient-coral">ly</span>
              </span>
            </div>
            <div className="text-xs text-muted-foreground font-medium">Identity Reset · Complete ✓</div>
          </div>
          <div className="mt-3 max-w-2xl mx-auto">
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-coral rounded-full transition-all duration-700" style={{ width: "100%" }} />
            </div>
          </div>
        </div>

        <div className="max-w-lg w-full text-center animate-fade-up pt-24 pb-16">
          <div className="w-16 h-16 rounded-2xl bg-gradient-coral flex items-center justify-center mx-auto mb-6 glow-coral">
            <Sparkles className="w-7 h-7 text-primary-foreground" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3">
            Your identity signal is being mapped.
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md mx-auto">
            Based on your responses, our AI is building your identity profile. You'll see your archetype, curiosity patterns, strength signals, and energy drivers.
          </p>

          {/* Sneak peek */}
          {archetypeHint && (
            <div className="bg-gradient-card border border-border/40 rounded-2xl p-6 mb-6 text-left">
              <p className="text-xs text-coral font-semibold uppercase tracking-wider mb-2">Early signal detected</p>
              <p className="text-lg font-bold text-foreground mb-1">{archetypeHint.name}</p>
              <p className="text-sm text-muted-foreground">{archetypeHint.desc}</p>
              <p className="text-xs text-muted-foreground/50 mt-3 italic">Your full profile will reveal much more →</p>
            </div>
          )}

          {/* What they'll get */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { label: "Identity Archetype",    sub: "Who you naturally are",       color: "coral"  },
              { label: "Curiosity Themes",       sub: "What draws you in",           color: "violet" },
              { label: "Strength Signals",       sub: "What you're actually good at", color: "amber"  },
              { label: "Path Directions",        sub: "What's possible for you",     color: "coral"  },
            ].map((item, i) => (
              <div key={i} className="bg-surface-2 rounded-xl p-3 text-left">
                <p className={`text-xs font-semibold mb-0.5 ${
                  item.color === "coral" ? "text-coral" : item.color === "violet" ? "text-violet" : "text-amber"
                }`}>{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>

          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-gradient-coral text-primary-foreground font-semibold py-6 text-base rounded-xl glow-coral hover:opacity-90 gap-2 group">
            Show me my identity profile
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
          <p className="text-xs text-muted-foreground/40 mt-3">Your profile evolves the more you use Pathly.</p>
        </div>
      </div>
    );
  }

  /* ── Questions phase ─────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/50 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-coral flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground tracking-wide text-sm">
              Path<span className="text-gradient-coral">ly</span>
            </span>
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            Identity Reset · {step + 1} of {total}
          </div>
        </div>
        {/* Progress */}
        <div className="mt-3 max-w-2xl mx-auto">
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-coral rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pt-28 pb-16">
        <div
          className="w-full max-w-2xl transition-all duration-280"
          style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(10px)" : "translateY(0)" }}
        >
          {/* Step dots */}
          <div className="flex gap-2 justify-center mb-10">
            {questions.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === step ? "24px" : "8px",
                  height: "8px",
                  background: i === step
                    ? "hsl(var(--coral))"
                    : i < step
                    ? "hsl(var(--coral) / 0.4)"
                    : "hsl(var(--border))",
                }}
              />
            ))}
          </div>

          {/* Question */}
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-coral mb-3">
              Rediscovering who you are
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 leading-snug">
              {current.question}
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">{current.subtitle}</p>
            {/* Psychological reframe hint */}
            <div className="mt-4 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border"
              style={{ background: "hsl(var(--surface-2))", borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
              <Sparkles className="w-3 h-3 text-amber shrink-0" />
              <span className="italic">{current.hint}</span>
            </div>
            {current.multi && (
              <span className="inline-block mt-3 text-xs text-amber bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
                Select all that feel true
              </span>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {current.options.map((opt) => {
              const isSelected = selected.includes(opt.text);
              return (
                <button
                  key={opt.text}
                  onClick={() => toggle(opt.text)}
                  className={`relative p-4 rounded-xl border text-left transition-all duration-200 group ${
                    isSelected
                      ? "border-coral-500/60 bg-coral-500/10 text-foreground shadow-coral/10 shadow-lg"
                      : "border-border bg-surface-1 text-muted-foreground hover:border-coral-500/30 hover:bg-surface-2 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg shrink-0">{opt.emoji}</span>
                    <span className="text-sm font-medium leading-snug flex-1">{opt.text}</span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? "border-coral bg-coral"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-center text-xs text-muted-foreground/40 mb-6 italic">
            There are no right or wrong answers. Choose what actually resonates — not what sounds good.
          </p>

          {/* Nav */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={back}
              className="text-muted-foreground hover:text-foreground gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={next}
              disabled={!canProceed}
              className="bg-gradient-coral text-primary-foreground font-semibold px-7 gap-2 hover:opacity-90 disabled:opacity-30"
            >
              {step === total - 1 ? "See my identity signals" : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
