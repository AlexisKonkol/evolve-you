import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, ArrowLeft, Sparkles, RefreshCw,
  Lightbulb, Zap, Compass, Heart, Star,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import navoLogo from "@/assets/navo-logo";
import { toast } from "sonner";

const CLARITY_ENGINE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/clarity-engine`;

// ── Questions ─────────────────────────────────────────────────────
const questions = [
  {
    id: 1,
    icon: Lightbulb,
    label: "What You Care About",
    question: "What problems do you genuinely care about solving?",
    hint: "Not problems you think you should care about — problems that actually stir something in you. Even if you've never acted on them.",
    placeholder: "For example: people feeling misunderstood, broken systems, things that are harder than they need to be…",
  },
  {
    id: 2,
    icon: Zap,
    label: "Your Energy",
    question: "What activities give you energy rather than drain you?",
    hint: "Think about tasks or moments where time passed quickly, where you felt alive and engaged — not just productive.",
    placeholder: "For example: teaching someone something, working through a complex problem, creating something from scratch…",
  },
  {
    id: 3,
    icon: Star,
    label: "Flow States",
    question: "When do you feel most engaged in your work?",
    hint: "Recall a time when you were fully in the zone — absorbed, clear, and energised. What were the conditions? What were you doing?",
    placeholder: "For example: when I'm collaborating on something meaningful, when I'm figuring out how things connect…",
  },
  {
    id: 4,
    icon: Heart,
    label: "Meaningful Impact",
    question: "What kind of impact would feel meaningful to you?",
    hint: "If your work left a mark on the world, what would you want that mark to be? Think about people, not metrics.",
    placeholder: "For example: helping people feel less alone, building things that outlast me, making complex ideas accessible…",
  },
  {
    id: 5,
    icon: Compass,
    label: "Your Direction",
    question: "What kind of life are you moving toward?",
    hint: "Not the life others expect — the life that genuinely feels like yours. What would it feel like to live it?",
    placeholder: "For example: working with autonomy, doing deep focused work, building something that matters, being around curious people…",
  },
];

// ── Section metadata for the profile cards ────────────────────────
const sectionMeta: Record<string, { icon: React.ElementType; colorClass: string; bgClass: string; borderClass: string }> = {
  "Core Motivations":    { icon: Heart,    colorClass: "text-indigo-400",  bgClass: "bg-indigo-500-500/10",  borderClass: "border-coral-500/20"  },
  "Energy Sources":      { icon: Zap,      colorClass: "text-amber",  bgClass: "bg-amber-500/10",  borderClass: "border-amber-500/20"  },
  "Natural Strengths":   { icon: Star,     colorClass: "text-violet", bgClass: "bg-violet-500/10", borderClass: "border-violet-500/20" },
  "Meaningful Directions": { icon: Compass, colorClass: "text-indigo-400", bgClass: "bg-indigo-500-500/10",  borderClass: "border-coral-500/20"  },
  "A Grounding Note":    { icon: Sparkles, colorClass: "text-amber",  bgClass: "bg-amber-500/10",  borderClass: "border-amber-500/20"  },
};

// ── Section parser ─────────────────────────────────────────────────
function parseSections(markdown: string) {
  const lines = markdown.split("\n");
  const sections: { title: string; content: string }[] = [];
  let current: { title: string; lines: string[] } | null = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) sections.push({ title: current.title, content: current.lines.join("\n").trim() });
      current = { title: line.replace("## ", "").trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push({ title: current.title, content: current.lines.join("\n").trim() });
  return sections.filter((s) => s.content.length > 0);
}

// ── Streaming helper ───────────────────────────────────────────────
async function streamProfile({
  answers, onDelta, onDone, onError,
}: {
  answers: { question: string; answer: string }[];
  onDelta: (chunk: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const resp = await fetch(CLARITY_ENGINE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ answers }),
  });

  if (!resp.ok || !resp.body) {
    const data = await resp.json().catch(() => ({}));
    onError((data as { error?: string }).error ?? "Could not generate your profile. Please try again.");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let done = false;

  while (!done) {
    const { done: rd, value } = await reader.read();
    if (rd) break;
    buf += decoder.decode(value, { stream: true });

    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }
  onDone();
}

type Stage = "intro" | "questions" | "generating" | "profile";

export default function ClarityEngine() {
  const [stage, setStage] = useState<Stage>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [profile, setProfile] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const currentAnswer = answers[current] ?? "";
  const canContinue = currentAnswer.trim().length > 10;
  const isLast = current === questions.length - 1;
  const progressPct = ((current + 1) / questions.length) * 100;

  const goToQuestion = (idx: number) => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrent(idx);
      setFadeIn(true);
      setTimeout(() => textRef.current?.focus(), 50);
    }, 200);
  };

  const next = () => { if (!isLast) goToQuestion(current + 1); else generate(); };
  const prev = () => { if (current > 0) goToQuestion(current - 1); };

  const updateAnswer = (val: string) => {
    setAnswers((prev) => { const next = [...prev]; next[current] = val; return next; });
  };

  const generate = async () => {
    setStage("generating");
    setTimeout(() => setStage("profile"), 700);

    const payload = questions.map((q, i) => ({
      question: q.question,
      answer: answers[i] || "(no answer provided)",
    }));

    let text = "";
    setIsStreaming(true);

    try {
      await streamProfile({
        answers: payload,
        onDelta: (chunk) => { text += chunk; setProfile(text); },
        onDone: () => setIsStreaming(false),
        onError: (msg) => { setIsStreaming(false); toast.error(msg); },
      });
    } catch {
      setIsStreaming(false);
      toast.error("Connection error. Please try again.");
    }
  };

  const restart = () => {
    setAnswers(Array(questions.length).fill(""));
    setProfile("");
    setCurrent(0);
    setStage("intro");
  };

  // ── INTRO ──────────────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--coral) / 0.06)" }} />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--amber) / 0.04)" }} />
        </div>

        <div className="relative z-10 max-w-lg w-full text-center animate-fade-up">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-10">
            <img src={navoLogo} alt="NAVO" className="w-7 h-7 rounded-lg object-contain" />
            <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
          </Link>

          {/* Icon */}
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8"
            style={{ background: "linear-gradient(135deg, hsl(var(--coral)), hsl(var(--amber)))" }}>
            <Lightbulb className="w-10 h-10 text-primary-foreground" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-8 border"
            style={{ background: "hsl(var(--coral) / 0.08)", borderColor: "hsl(var(--coral) / 0.2)", color: "hsl(var(--coral))" }}>
            <Sparkles className="w-3.5 h-3.5" />
            Clarity Engine · 5 Questions
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight mb-5">
            From confusion<br />
            <span className="text-gradient-coral italic">to clarity.</span>
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            Most people feel stuck not because they lack ability — but because they lack clarity.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-10 max-w-md mx-auto">
            Five quiet questions. No right answers. Just honest reflection. At the end, your AI guide will create a{" "}
            <span className="text-foreground font-medium">personal Clarity Profile</span>{" "}
            — a clear picture of what drives you, what energises you, and where you belong.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-10">
            {[
              { v: "5", l: "Questions" },
              { v: "~5", l: "Minutes" },
              { v: "5", l: "Profile sections" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-2xl font-bold text-foreground">{s.v}</p>
                <p className="text-xs text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={() => { setStage("questions"); setTimeout(() => textRef.current?.focus(), 100); }}
              className="bg-gradient-coral text-primary-foreground px-8 py-3 h-auto text-base font-semibold hover:opacity-90 glow-coral gap-2"
            >
              Find My Clarity
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── GENERATING ────────────────────────────────────────────────
  if (stage === "generating") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="text-center animate-fade-in space-y-6 max-w-sm">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto animate-pulse"
            style={{ background: "linear-gradient(135deg, hsl(var(--coral)), hsl(var(--amber)))" }}>
            <Lightbulb className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <p className="text-foreground font-semibold text-xl mb-2">Reading your reflections…</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Finding the patterns in what you shared. This takes just a moment.
            </p>
          </div>
          <div className="flex gap-1.5 justify-center">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── PROFILE ────────────────────────────────────────────────────
  if (stage === "profile") {
    const sections = !isStreaming ? parseSections(profile) : null;

    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--coral) / 0.04)" }} />
        </div>

        <div className="relative z-10 container max-w-2xl py-16 px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <img src={navoLogo} alt="NAVO" className="w-6 h-6 rounded-md object-contain" />
              <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
            </Link>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "linear-gradient(135deg, hsl(var(--coral)), hsl(var(--amber)))" }}>
              <Lightbulb className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
              Your Clarity Profile
            </h1>
            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Built from your honest reflections — a clear picture of who you are and what you need.
            </p>
          </div>

          {/* Streaming: raw markdown while generating */}
          {isStreaming && (
            <div className="bg-gradient-card border border-border/50 rounded-2xl p-8 mb-8 animate-fade-in">
              <div className="prose prose-sm prose-invert max-w-none
                prose-h2:text-foreground prose-h2:font-bold prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-li:text-muted-foreground
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:my-2 [&>h2:first-child]:mt-0">
                <ReactMarkdown>{profile}</ReactMarkdown>
                <span className="inline-block w-2 h-4 bg-indigo-500 ml-0.5 animate-pulse rounded-sm" />
              </div>
            </div>
          )}

          {/* Done: sectioned cards */}
          {!isStreaming && sections && sections.length > 0 && (
            <div className="space-y-4 mb-8 animate-fade-in">
              {sections.map((section, idx) => {
                const meta = sectionMeta[section.title] ?? {
                  icon: Sparkles,
                  colorClass: "text-indigo-400",
                  bgClass: "bg-indigo-500-500/10",
                  borderClass: "border-coral-500/20",
                };
                const Icon = meta.icon;
                const isGrounding = section.title === "A Grounding Note";

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-6 animate-fade-up ${
                      isGrounding
                        ? "bg-gradient-card"
                        : "bg-surface-1 border-border/50 hover:border-border transition-colors"
                    }`}
                    style={{
                      animationDelay: `${idx * 80}ms`,
                      borderColor: isGrounding ? "hsl(var(--coral) / 0.2)" : undefined,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${meta.bgClass} ${meta.borderClass}`}>
                        <Icon className={`w-4 h-4 ${meta.colorClass}`} />
                      </div>
                      <h3 className={`text-sm font-bold uppercase tracking-widest ${meta.colorClass}`}>
                        {section.title}
                      </h3>
                    </div>

                    {isGrounding ? (
                      <blockquote className="border-l-2 pl-4 italic text-muted-foreground leading-relaxed"
                        style={{ borderColor: "hsl(var(--coral) / 0.4)" }}>
                        <div className="prose prose-sm prose-invert max-w-none
                          prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:italic
                          prose-strong:text-foreground">
                          <ReactMarkdown>{section.content}</ReactMarkdown>
                        </div>
                      </blockquote>
                    ) : (
                      <div className="prose prose-sm prose-invert max-w-none
                        prose-p:text-muted-foreground prose-p:leading-relaxed
                        prose-li:text-muted-foreground prose-strong:text-foreground
                        prose-ul:my-1 prose-li:my-0.5">
                        <ReactMarkdown>{section.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Skeleton while waiting for first tokens */}
          {!isStreaming && !sections && !profile && (
            <div className="space-y-4 mb-8">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="bg-surface-1 border border-border/50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 bg-surface-3 rounded-xl animate-pulse" />
                    <div className="h-3 w-28 bg-surface-3 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-surface-3 rounded animate-pulse w-full" />
                    <div className="h-3 bg-surface-3 rounded animate-pulse w-4/5" />
                    <div className="h-3 bg-surface-3 rounded animate-pulse w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Button
              onClick={restart}
              variant="outline"
              className="border-border hover:border-coral-500/40 gap-2 flex-1"
              disabled={isStreaming}
            >
              <RefreshCw className="w-4 h-4" />
              Reflect Again
            </Button>
            <Link to="/dashboard" className="flex-1">
              <Button
                className="w-full bg-gradient-coral text-primary-foreground gap-2 hover:opacity-90"
                disabled={isStreaming}
              >
                Continue Your Journey
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Next steps */}
          {!isStreaming && profile && (
            <div className="bg-gradient-card border rounded-2xl p-6 animate-fade-up"
              style={{ borderColor: "hsl(var(--coral) / 0.15)" }}>
              <h3 className="font-semibold text-foreground mb-1 text-sm">Turn clarity into direction</h3>
              <p className="text-xs text-muted-foreground mb-4">Your clarity profile is just the beginning.</p>
              <div className="space-y-2">
                {[
                  { label: "See your Future Identity",     sub: "Explore the paths that match who you are becoming", href: "/future-vision",      colorKey: "coral" },
                  { label: "Explore your Identity Map",    sub: "See how your strengths connect and cluster",        href: "/identity-map",        colorKey: "violet" },
                  { label: "Talk to your AI Coach",        sub: "Ask what to do with this clarity",                  href: "/coach",              colorKey: "amber" },
                ].map((item) => {
                  const color = item.colorKey === "coral"
                    ? "text-indigo-400 bg-indigo-500-500/10 border-coral-500/20"
                    : item.colorKey === "violet"
                    ? "text-violet bg-violet-500/10 border-violet-500/20"
                    : "text-amber bg-amber-500/10 border-amber-500/20";
                  return (
                    <Link key={item.href} to={item.href}
                      className="flex items-center gap-4 p-3 rounded-xl bg-surface-2 hover:bg-surface-3 transition-colors group">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${color} shrink-0`}>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.sub}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── QUESTIONS ──────────────────────────────────────────────────
  const q = questions[current];
  const QIcon = q.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-3xl transition-all duration-1000"
          style={{ background: "hsl(var(--coral) / 0.05)" }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full blur-3xl"
          style={{ background: "hsl(var(--amber) / 0.04)" }} />
      </div>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-50" style={{ background: "hsl(var(--border))" }}>
        <div
          className="h-full bg-gradient-coral transition-all duration-700"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Nav */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <img src={navoLogo} alt="NAVO" className="w-7 h-7 rounded-lg object-contain" />
          <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{current + 1} of {questions.length}</span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i < current ? "w-5 bg-indigo-500" : i === current ? "w-5 bg-indigo-500 animate-pulse" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className={`w-full max-w-xl transition-all duration-200 ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>

          {/* Topic badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold mb-7 border"
            style={{ background: "hsl(var(--coral) / 0.08)", borderColor: "hsl(var(--coral) / 0.18)", color: "hsl(var(--coral))" }}>
            <QIcon className="w-3 h-3" />
            {q.label}
          </div>

          {/* Question */}
          <h1 className="font-display text-3xl md:text-4xl text-foreground leading-snug mb-3">
            {q.question}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">{q.hint}</p>

          {/* Textarea */}
          <textarea
            ref={textRef}
            value={answers[current]}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder={q.placeholder}
            rows={5}
            className="w-full bg-surface-1 border border-border/60 rounded-2xl px-5 py-4 text-foreground text-sm leading-relaxed resize-none focus:outline-none focus:ring-1 placeholder:text-muted-foreground/40 transition-all duration-200"
            style={{ "--tw-ring-color": "hsl(var(--coral) / 0.4)" } as React.CSSProperties}
            onFocus={(e) => { e.target.style.borderColor = "hsl(var(--coral) / 0.4)"; }}
            onBlur={(e) => { e.target.style.borderColor = ""; }}
          />

          {/* Char hint */}
          {answers[current].length > 0 && answers[current].length < 10 && (
            <p className="text-xs text-muted-foreground/60 mt-2 ml-1">A little more detail helps…</p>
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="ghost"
              onClick={prev}
              disabled={current === 0}
              className="text-muted-foreground hover:text-foreground gap-2 disabled:opacity-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={next}
              disabled={!canContinue}
              className="bg-gradient-coral text-primary-foreground font-semibold px-7 gap-2 hover:opacity-90 disabled:opacity-30"
            >
              {isLast ? "Reveal My Clarity Profile" : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
