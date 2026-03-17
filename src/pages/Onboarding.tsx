import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";

/* ── Context options — why they're here ─────────────────────────── */
const contextOptions = [
  {
    id: "laid-off",
    emoji: "💼",
    text: "I was recently laid off",
    subtext: "The rug got pulled. You didn't see it coming, or you did — either way, here you are.",
  },
  {
    id: "ai-worried",
    emoji: "🤖",
    text: "AI is changing my industry and I'm worried",
    subtext: "You can see what's coming. You just don't know yet what it means for you.",
  },
  {
    id: "hollow",
    emoji: "🪞",
    text: "I've been successful but something feels empty",
    subtext: "On paper it looks right. Inside it doesn't. That gap is trying to tell you something.",
  },
  {
    id: "change",
    emoji: "🧭",
    text: "I just know something needs to change",
    subtext: "You can't name it yet. But you feel it. That feeling is enough to start with.",
  },
];

/* ── Personalized copy by context ───────────────────────────────── */
const contextCopy: Record<string, { hint: string; closing: string }> = {
  "laid-off": {
    hint: "The job ended. But you didn't. These questions help us find the difference.",
    closing: "What happened to you isn't the whole story. Let's find out what the rest of it is.",
  },
  "ai-worried": {
    hint: "The market is shifting. That's real. But who you are doesn't shift with it.",
    closing: "The most resilient thing you can do right now isn't learn a new skill. It's understand yourself more deeply.",
  },
  "hollow": {
    hint: "Success without alignment is just well-decorated emptiness. These questions get underneath it.",
    closing: "You built a life that looks good from the outside. Now let's build one that feels right from the inside.",
  },
  "change": {
    hint: "You don't need to know where you're going to start. You just need to be honest about where you are.",
    closing: "The fact that you're here means something. Let's figure out what.",
  },
};

/* ── Questions ───────────────────────────────────────────────────── */
const questions = [
  {
    id: "energized",
    question: "When do you feel most energized — genuinely alive?",
    subtitle: "Not when you're being productive. Not when you're performing. When you feel lit up from the inside.",
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
    question: "What problems do you find yourself thinking about — even when no one asked you to?",
    subtitle: "The ones that show up on Sunday morning. Not because you have to think about them. Because you can't help it.",
    hint: "The problems you're drawn to reveal your natural intelligence. There's no wrong answer here.",
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
    question: "What makes you lose track of time?",
    subtitle: "Flow states don't lie. These aren't hobbies — they're the closest thing to a compass you have.",
    hint: "Be honest, not impressive. The more truthful you are, the more accurate your profile will be.",
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
    question: "When did you last feel quietly, genuinely proud of yourself?",
    subtitle: "Forget the accolades. Forget what looked impressive to others. Think about the moments you showed up as your actual best self.",
    hint: "Pride points to core identity. When you felt most yourself — that's the signal.",
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
    question: "What kind of environment helps you do your best thinking?",
    subtitle: "Identity includes how you work, not just what you work on. Most people have never been asked this.",
    hint: "Your ideal environment says more about who you are than most job descriptions ever will.",
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
    question: "What does it feel like when you're living in alignment?",
    subtitle: "Not what you think you should value. Not what sounds good. What you actually feel when a day was worth it.",
    hint: "This is the foundation everything else gets built on. Choose what's true — not what's admirable.",
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

/* ── Archetype hint ──────────────────────────────────────────────── */
function getArchetypeHint(answers: Record<string, string[]>): { name: string; desc: string } {
  const all = Object.values(answers).flat().join(" ").toLowerCase();
  if (all.includes("helping") || all.includes("people") || all.includes("impact") || all.includes("breakthrough")) {
    return { name: "The Connector", desc: "You light up in the spaces between people. That's rarer than you think." };
  }
  if (all.includes("building") || all.includes("creating") || all.includes("built") || all.includes("shipped")) {
    return { name: "The Builder", desc: "You're not satisfied until something real exists in the world." };
  }
  if (all.includes("complex") || all.includes("systems") || all.includes("problem") || all.includes("figured")) {
    return { name: "The Strategist", desc: "You think several layers deeper than the room you're in." };
  }
  if (all.includes("learning") || all.includes("exploring") || all.includes("new") || all.includes("connecting dots")) {
    return { name: "The Explorer", desc: "Your curiosity isn't a distraction. It's your greatest asset." };
  }
  if (all.includes("beautiful") || all.includes("design") || all.includes("inspired")) {
    return { name: "The Maker", desc: "You turn raw materials — ideas, words, code — into things that move people." };
  }
  return { name: "The Catalyst", desc: "You have a rare ability to make things move that were stuck. People feel it around you." };
}

/* ── Slow reveal ─────────────────────────────────────────────────── */
function SlowReveal({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  const messages = [
    "We're reading between the lines of what you told us.",
    "Most people have never been asked these questions before.",
    "Which means most people have never heard what we're about to tell you.",
    "Give us one more moment.",
  ];

  useEffect(() => {
    const timings = [0, 2200, 4400, 6200];
    const timers = timings.map((delay, i) =>
      setTimeout(() => setStage(i), delay)
    );
    const completeTimer = setTimeout(onComplete, 8500);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="relative mb-12">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: "hsl(var(--coral) / 0.12)", border: "1px solid hsl(var(--coral) / 0.2)" }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "hsl(var(--coral) / 0.2)" }}>
            <Sparkles className="w-8 h-8 text-coral animate-pulse" />
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="absolute inset-0 rounded-full border animate-ping"
            style={{
              borderColor: `hsl(var(--coral) / ${0.15 / i})`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: "2.5s",
            }}
          />
        ))}
      </div>
      <div className="max-w-md text-center space-y-4">
        {messages.map((msg, i) => (
          <p key={i} className="text-base text-foreground leading-relaxed transition-all duration-700"
            style={{
              opacity: stage >= i ? 1 : 0,
              transform: stage >= i ? "translateY(0)" : "translateY(12px)",
              fontStyle: i === 2 ? "italic" : "normal",
              color: i === 3 ? "hsl(var(--coral))" : undefined,
            }}>
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────────── */
export default function Onboarding() {
  const [phase, setPhase] = useState<"intro" | "context" | "breathe" | "questions" | "slowreveal" | "summary">("intro");
  const [context, setContext] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  const current = questions[step];
  const selected = answers[current?.id] || [];
  const total = questions.length;
  const progress = phase === "questions" ? ((step + 1) / total) * 100 : 0;
  const archetypeHint = getArchetypeHint(answers);
  const ctxCopy = context ? contextCopy[context] : contextCopy["change"];

  const toggle = (opt: string) => {
    if (current.multi) {
      setAnswers((prev) => {
        const cur = prev[current.id] || [];
        return { ...prev, [current.id]: cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt] };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [current.id]: [opt] }));
      setTimeout(() => {
        setAnimating(true);
        setTimeout(() => {
          if (step < total - 1) setStep((s) => s + 1);
          else setPhase("slowreveal");
          setAnimating(false);
        }, 280);
      }, 420);
    }
  };

  const animateNext = (fn: () => void) => {
    setAnimating(true);
    setTimeout(() => { fn(); setAnimating(false); }, 280);
  };

  const next = () => {
    if (current.multi) {
      if (step < total - 1) animateNext(() => setStep(step + 1));
      else setPhase("slowreveal");
    }
  };

  const back = () => {
    if (step > 0) animateNext(() => setStep(step - 1));
    else animateNext(() => setPhase("context"));
  };

  const canProceed = selected.length > 0;

  /* ── Intro ───────────────────────────────────────────────────── */
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/50 px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" rx="22" fill="#000"/>
                <ellipse cx="50" cy="56" rx="38" ry="11" stroke="#D85A30" strokeWidth="2.5" fill="none" opacity="0.6"/>
                <ellipse cx="50" cy="56" rx="30" ry="8" stroke="#D85A30" strokeWidth="1" fill="none" opacity="0.3"/>
                <path d="M50 12 L39 58 L50 53 Z" fill="#9B3520"/>
                <path d="M50 12 L61 58 L50 53 Z" fill="#F07050"/>
                <path d="M39 58 L50 53 L50 70 Z" fill="#C04535"/>
                <path d="M61 58 L50 53 L50 70 Z" fill="#E05540"/>
                <circle cx="50" cy="12" r="3" fill="white" opacity="0.9"/>
                <path d="M26 22 L27.5 26 L32 28 L27.5 30 L26 34 L24.5 30 L20 28 L24.5 26 Z" fill="#FFB090" opacity="0.8"/>
              </svg>
              <span className="font-bold text-foreground tracking-wide text-sm">NAV<span className="text-gradient-coral">O</span></span>
            </div>
            <div className="text-xs text-muted-foreground font-medium">4 minutes · No resume required</div>
          </div>
        </div>

        <div className="max-w-lg w-full text-center animate-fade-up pt-20">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-snug">
            You didn't end up here by accident.
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-md mx-auto">
            Something shifted — a layoff, a hollow promotion, a Sunday night feeling that wouldn't go away. Whatever brought you here, it's telling you something important.
          </p>
          <p className="text-muted-foreground text-base leading-relaxed mb-10 max-w-md mx-auto">
            We're going to help you hear it. Not with a personality quiz. Not with a job recommendation. With 6 questions that most people have never been asked — about who you actually are, underneath everything that happened.
          </p>

          <div className="bg-gradient-card border border-border/40 rounded-2xl p-5 mb-10 text-left space-y-3">
            {[
              { cross: true,  text: "We won't ask about your job title or resume" },
              { cross: true,  text: "We won't give you a generic personality type" },
              { cross: false, text: "We will help you see patterns you might have missed" },
              { cross: false, text: "We will show you who you're becoming — not just who you were" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${item.cross ? "bg-muted text-muted-foreground" : "bg-coral-500/15 text-coral"}`}>
                  {item.cross ? "✕" : "✓"}
                </span>
                <span className={item.cross ? "text-muted-foreground/60 line-through" : "text-foreground"}>{item.text}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground/50 mb-8 italic">There are no right answers. There is only what's true for you.</p>

          <Button onClick={() => setPhase("context")}
            className="bg-gradient-coral text-primary-foreground font-semibold px-8 py-6 text-base rounded-xl glow-coral hover:opacity-90 gap-2 group">
            I'm ready
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    );
  }

  /* ── Context ─────────────────────────────────────────────────── */
  if (phase === "context") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/50 px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" rx="22" fill="#000"/>
                <ellipse cx="50" cy="56" rx="38" ry="11" stroke="#D85A30" strokeWidth="2.5" fill="none" opacity="0.6"/>
                <ellipse cx="50" cy="56" rx="30" ry="8" stroke="#D85A30" strokeWidth="1" fill="none" opacity="0.3"/>
                <path d="M50 12 L39 58 L50 53 Z" fill="#9B3520"/>
                <path d="M50 12 L61 58 L50 53 Z" fill="#F07050"/>
                <path d="M39 58 L50 53 L50 70 Z" fill="#C04535"/>
                <path d="M61 58 L50 53 L50 70 Z" fill="#E05540"/>
                <circle cx="50" cy="12" r="3" fill="white" opacity="0.9"/>
                <path d="M26 22 L27.5 26 L32 28 L27.5 30 L26 34 L24.5 30 L20 28 L24.5 26 Z" fill="#FFB090" opacity="0.8"/>
              </svg>
              <span className="font-bold text-foreground tracking-wide text-sm">NAV<span className="text-gradient-coral">O</span></span>
            </div>
          </div>
        </div>

        <div className="max-w-lg w-full animate-fade-up pt-20">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-coral mb-3">Before we begin</p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 leading-snug">What brought you here today?</h1>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">Be honest. No one else will see this. And it changes everything about what we tell you.</p>
          </div>

          <div className="space-y-3 mb-8">
            {contextOptions.map((opt) => (
              <button key={opt.id}
                onClick={() => { setContext(opt.id); setTimeout(() => setPhase("breathe"), 300); }}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${context === opt.id ? "border-coral-500/60 bg-coral-500/10" : "border-border bg-surface-1 hover:border-coral-500/30 hover:bg-surface-2"}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0 mt-0.5">{opt.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">{opt.text}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{opt.subtext}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button onClick={() => setPhase("intro")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>
    );
  }

  /* ── Breathe ─────────────────────────────────────────────────── */
  if (phase === "breathe") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="max-w-md text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-8 flex items-center justify-center"
            style={{ background: "hsl(var(--coral) / 0.1)", border: "1px solid hsl(var(--coral) / 0.2)" }}>
            <span className="text-2xl">🌱</span>
          </div>
          <p className="text-xl font-bold text-foreground mb-4 leading-snug">{ctxCopy.closing}</p>
          <p className="text-sm text-muted-foreground mb-10 leading-relaxed">Six questions. No resume. No job title. Just you, being honest for the next few minutes.</p>
          <Button onClick={() => setPhase("questions")}
            className="bg-gradient-coral text-primary-foreground font-semibold px-8 py-6 text-base rounded-xl glow-coral hover:opacity-90 gap-2 group">
            Let's begin
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    );
  }

  /* ── Slow reveal ─────────────────────────────────────────────── */
  if (phase === "slowreveal") {
    return <SlowReveal onComplete={() => setPhase("summary")} />;
  }

  /* ── Summary ─────────────────────────────────────────────────── */
  if (phase === "summary") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/50 px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" rx="22" fill="#000"/>
                <ellipse cx="50" cy="56" rx="38" ry="11" stroke="#D85A30" strokeWidth="2.5" fill="none" opacity="0.6"/>
                <ellipse cx="50" cy="56" rx="30" ry="8" stroke="#D85A30" strokeWidth="1" fill="none" opacity="0.3"/>
                <path d="M50 12 L39 58 L50 53 Z" fill="#9B3520"/>
                <path d="M50 12 L61 58 L50 53 Z" fill="#F07050"/>
                <path d="M39 58 L50 53 L50 70 Z" fill="#C04535"/>
                <path d="M61 58 L50 53 L50 70 Z" fill="#E05540"/>
                <circle cx="50" cy="12" r="3" fill="white" opacity="0.9"/>
                <path d="M26 22 L27.5 26 L32 28 L27.5 30 L26 34 L24.5 30 L20 28 L24.5 26 Z" fill="#FFB090" opacity="0.8"/>
              </svg>
              <span className="font-bold text-foreground tracking-wide text-sm">NAV<span className="text-gradient-coral">O</span></span>
            </div>
            <div className="text-xs text-muted-foreground font-medium">Complete ✓</div>
          </div>
          <div className="mt-3 max-w-2xl mx-auto">
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-coral rounded-full" style={{ width: "100%" }} />
            </div>
          </div>
        </div>

        <div className="max-w-lg w-full text-center animate-fade-up pt-24 pb-16">
          <div className="w-16 h-16 rounded-2xl bg-gradient-coral flex items-center justify-center mx-auto mb-6 glow-coral">
            <Sparkles className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">What you shared just revealed something important.</h1>
          <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md mx-auto">
            We found it in what you told us. Your full profile will show you your archetype, the patterns you've been living, your hidden strengths, and the paths aligned with who you are.
          </p>

          <div className="bg-gradient-card border border-border/40 rounded-2xl p-6 mb-6 text-left">
            <p className="text-xs text-coral font-semibold uppercase tracking-wider mb-2">Early signal</p>
            <p className="text-xl font-bold text-foreground mb-2">{archetypeHint.name}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{archetypeHint.desc}</p>
            <p className="text-xs text-muted-foreground/50 mt-3 italic">Your full profile goes much deeper than this →</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { label: "Identity Archetype", sub: "Who you naturally are", color: "coral" },
              { label: "Curiosity Themes", sub: "What draws you in", color: "violet" },
              { label: "Hidden Strengths", sub: "What you're actually good at", color: "amber" },
              { label: "Path Directions", sub: "What's possible for you", color: "coral" },
            ].map((item, i) => (
              <div key={i} className="bg-surface-2 rounded-xl p-3 text-left">
                <p className={`text-xs font-semibold mb-0.5 ${item.color === "coral" ? "text-coral" : item.color === "violet" ? "text-violet" : "text-amber"}`}>{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>

          <Button onClick={() => navigate("/identity-profile", { state: { answers, context } })}
            className="w-full bg-gradient-coral text-primary-foreground font-semibold py-6 text-base rounded-xl glow-coral hover:opacity-90 gap-2 group">
            Show me who I am
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
          <p className="text-xs text-muted-foreground/40 mt-3">Your profile deepens the more you use NAVO.</p>
        </div>
      </div>
    );
  }

  /* ── Questions ───────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/50 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" rx="22" fill="#000"/>
              <ellipse cx="50" cy="56" rx="38" ry="11" stroke="#D85A30" strokeWidth="2.5" fill="none" opacity="0.6"/>
              <ellipse cx="50" cy="56" rx="30" ry="8" stroke="#D85A30" strokeWidth="1" fill="none" opacity="0.3"/>
              <path d="M50 12 L39 58 L50 53 Z" fill="#9B3520"/>
              <path d="M50 12 L61 58 L50 53 Z" fill="#F07050"/>
              <path d="M39 58 L50 53 L50 70 Z" fill="#C04535"/>
              <path d="M61 58 L50 53 L50 70 Z" fill="#E05540"/>
              <circle cx="50" cy="12" r="3" fill="white" opacity="0.9"/>
              <path d="M26 22 L27.5 26 L32 28 L27.5 30 L26 34 L24.5 30 L20 28 L24.5 26 Z" fill="#FFB090" opacity="0.8"/>
            </svg>
            <span className="font-bold text-foreground tracking-wide text-sm">NAV<span className="text-gradient-coral">O</span></span>
          </div>
          <div className="text-xs text-muted-foreground font-medium">{step + 1} of {total}</div>
        </div>
        <div className="mt-3 max-w-2xl mx-auto">
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-gradient-coral rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pt-28 pb-16">
        <div className="w-full max-w-2xl transition-all duration-280"
          style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(10px)" : "translateY(0)" }}>

          <div className="flex gap-2 justify-center mb-10">
            {questions.map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-300"
                style={{
                  width: i === step ? "24px" : "8px", height: "8px",
                  background: i === step ? "hsl(var(--coral))" : i < step ? "hsl(var(--coral) / 0.4)" : "hsl(var(--border))",
                }} />
            ))}
          </div>

          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-coral mb-3">Getting to know you</p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 leading-snug">{current.question}</h1>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">{current.subtitle}</p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border"
              style={{ background: "hsl(var(--surface-2))", borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
              <Sparkles className="w-3 h-3 text-amber shrink-0" />
              <span className="italic">{ctxCopy.hint}</span>
            </div>
            {current.multi && (
              <span className="inline-block mt-3 text-xs text-amber bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">Select all that feel true</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {current.options.map((opt) => {
              const isSelected = selected.includes(opt.text);
              return (
                <button key={opt.text} onClick={() => toggle(opt.text)}
                  className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${isSelected ? "border-coral-500/60 bg-coral-500/10 text-foreground shadow-lg" : "border-border bg-surface-1 text-muted-foreground hover:border-coral-500/30 hover:bg-surface-2 hover:text-foreground"}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg shrink-0">{opt.emoji}</span>
                    <span className="text-sm font-medium leading-snug flex-1">{opt.text}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? "border-coral bg-coral" : "border-muted-foreground/30"}`}>
                      {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-center text-xs text-muted-foreground/40 mb-6 italic">No right answers. Only honest ones.</p>

          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={back} className="text-muted-foreground hover:text-foreground gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            {current.multi && (
              <Button onClick={next} disabled={!canProceed}
                className="bg-gradient-coral text-primary-foreground font-semibold px-7 gap-2 hover:opacity-90 disabled:opacity-30">
                {step === total - 1 ? "See what we found" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
