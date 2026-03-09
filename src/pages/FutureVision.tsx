import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, ArrowLeft, Eye, RefreshCw,
  Sparkles, Star, Target, Briefcase, Sun, TrendingUp, MessageSquare,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import pathlyLogo from "@/assets/pathly-logo.png";
import { toast } from "sonner";

const FUTURE_VISION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/future-vision`;

// ── Questions ─────────────────────────────────────────────────────
const questions = [
  {
    id: 1,
    icon: Sun,
    label: "Your Future Life",
    question: "Imagine your life three years from now. What does it look like?",
    hint: "Picture yourself waking up in that future. Where are you? What's different? Let yourself dream a little.",
    placeholder: "Three years from now, I'm waking up to...",
  },
  {
    id: 2,
    icon: Briefcase,
    label: "Your Work",
    question: "What kind of work are you doing?",
    hint: "Think about the problems you're solving, the people you're serving, and how your work feels each day.",
    placeholder: "I'm spending my days working on...",
  },
  {
    id: 3,
    icon: Sun,
    label: "Your Day",
    question: "What does a typical day in your future life look like?",
    hint: "Walk through your day hour by hour. Morning rituals, how you work, who you're with, how you wind down.",
    placeholder: "I wake up at... and spend my morning...",
  },
  {
    id: 4,
    icon: Target,
    label: "Your Impact",
    question: "Who are you helping, and how?",
    hint: "Think about the people whose lives are better because of what you do. What's changed for them?",
    placeholder: "I'm helping people who... by...",
  },
  {
    id: 5,
    icon: Star,
    label: "Your World",
    question: "Where are you living, and what does your environment feel like?",
    hint: "Not just geography — the energy, the space, the people around you. What environment brings out your best?",
    placeholder: "I'm living in... surrounded by...",
  },
  {
    id: 6,
    icon: TrendingUp,
    label: "Your Skills",
    question: "What skills and capabilities have you mastered?",
    hint: "Think about what you've learned and practiced. What can you do now that you couldn't do three years ago?",
    placeholder: "I've become deeply skilled at... I've mastered...",
  },
];

// ── Streaming helper ───────────────────────────────────────────────
async function streamVision({
  answers,
  onDelta,
  onDone,
  onError,
}: {
  answers: { question: string; answer: string }[];
  onDelta: (chunk: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const resp = await fetch(FUTURE_VISION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ answers }),
  });

  if (!resp.ok || !resp.body) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error ?? "Could not generate your vision. Please try again.");
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

// ── Section icons for the rendered profile ────────────────────────
const sectionMeta: Record<string, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  "Your Future Identity":    { icon: Eye,           color: "text-violet",         bg: "bg-violet-500/10",  border: "border-violet-500/20" },
  "Skills You'll Have Mastered": { icon: Star,      color: "text-amber",           bg: "bg-amber-500/10",   border: "border-amber-500/20" },
  "The Impact You're Creating":  { icon: Target,    color: "text-teal",            bg: "bg-teal-500/10",    border: "border-teal-500/20" },
  "Your Lifestyle Design":       { icon: Sun,       color: "text-amber",           bg: "bg-amber-500/10",   border: "border-amber-500/20" },
  "Income & Opportunity Possibilities": { icon: TrendingUp, color: "text-teal",   bg: "bg-teal-500/10",    border: "border-teal-500/20" },
  "A Message From Your Future Self":    { icon: MessageSquare, color: "text-violet", bg: "bg-violet-500/10", border: "border-violet-500/20" },
};

type Stage = "intro" | "questions" | "generating" | "vision";

export default function FutureVision() {
  const [stage, setStage] = useState<Stage>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [vision, setVision] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const currentAnswer = answers[current] ?? "";
  const canContinue = currentAnswer.trim().length > 10;
  const isLast = current === questions.length - 1;

  const goToQuestion = (idx: number) => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrent(idx);
      setFadeIn(true);
      setTimeout(() => textRef.current?.focus(), 50);
    }, 180);
  };

  const next = () => {
    if (!isLast) { goToQuestion(current + 1); } else { generate(); }
  };
  const prev = () => { if (current > 0) goToQuestion(current - 1); };

  const updateAnswer = (val: string) => {
    setAnswers((prev) => { const next = [...prev]; next[current] = val; return next; });
  };

  const generate = async () => {
    setStage("generating");
    setTimeout(() => setStage("vision"), 600);

    const payload = questions.map((q, i) => ({
      question: q.question,
      answer: answers[i] || "(no answer provided)",
    }));

    let visionText = "";
    setIsStreaming(true);

    try {
      await streamVision({
        answers: payload,
        onDelta: (chunk) => {
          visionText += chunk;
          setVision(visionText);
        },
        onDone: () => setIsStreaming(false),
        onError: (msg) => {
          setIsStreaming(false);
          toast.error(msg);
        },
      });
    } catch {
      setIsStreaming(false);
      toast.error("Connection error. Please try again.");
    }
  };

  const restart = () => {
    setAnswers(Array(questions.length).fill(""));
    setVision("");
    setCurrent(0);
    setStage("intro");
  };

  // ── INTRO ──────────────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--violet) / 0.06)" }} />
          <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[300px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--teal) / 0.05)" }} />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[250px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--amber) / 0.05)" }} />
        </div>

        <div className="relative z-10 max-w-xl w-full text-center animate-fade-up">
          {/* Icon */}
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 glow-teal"
            style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--teal)))" }}>
            <Eye className="w-10 h-10 text-primary-foreground" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-8 border"
            style={{ background: "hsl(var(--violet) / 0.1)", borderColor: "hsl(var(--violet) / 0.2)", color: "hsl(var(--violet))" }}>
            <Sparkles className="w-3.5 h-3.5" />
            Future Vision · 6-Minute Exercise
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight mb-6">
            See who you're becoming.<br />
            <span className="text-gradient-coral">Then step into it.</span>
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            Most people never stop to imagine who they're becoming — only what they should do next.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-10 max-w-md mx-auto">
            You'll answer <span className="text-foreground font-medium">6 vivid prompts</span> about your life three years from now. Then your AI guide will craft a personalized <span className="text-foreground font-medium">Future Identity Profile</span> — a portrait of who you're growing into.
          </p>

          {/* Stats row */}
          <div className="flex justify-center gap-8 mb-10">
            {[
              { label: "Questions", value: "6" },
              { label: "Minutes", value: "~6" },
              { label: "Sections in your vision", value: "5" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={() => { setStage("questions"); setTimeout(() => textRef.current?.focus(), 100); }}
              className="bg-gradient-teal text-primary-foreground px-8 py-3 h-auto text-base font-semibold hover:opacity-90 glow-teal gap-2"
            >
              Begin Your Vision
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Return to Dashboard
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
        <div className="text-center animate-fade-in space-y-5">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto animate-pulse"
            style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--teal)))" }}>
            <Eye className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <p className="text-foreground font-semibold text-lg mb-1">Crafting your Future Vision…</p>
            <p className="text-muted-foreground text-sm">Reading your reflections and imagining your path</p>
          </div>
          <div className="flex gap-1.5 justify-center">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-teal animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── VISION PROFILE ────────────────────────────────────────────
  if (stage === "vision") {
    // Parse sections from markdown for card rendering once streaming is done
    const sections = !isStreaming ? parseSections(vision) : null;

    return (
      <div className="min-h-screen bg-background">
        {/* Ambient glow */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--violet) / 0.04)" }} />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--teal) / 0.03)" }} />
        </div>

        <div className="relative z-10 container max-w-2xl py-16 px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 glow-teal"
              style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--teal)))" }}>
              <Eye className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
              Your Future Vision Profile
            </h1>
            <p className="text-muted-foreground">
              Three years from now — built from your own reflections.
            </p>
          </div>

          {/* Streaming: show raw markdown while generating */}
          {isStreaming && (
            <div className="bg-gradient-card border border-border/50 rounded-2xl p-8 mb-8 animate-fade-in">
              <div className="prose prose-sm prose-invert max-w-none
                prose-h2:text-foreground prose-h2:font-bold prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-li:text-muted-foreground
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:my-2 [&>h2:first-child]:mt-0">
                <ReactMarkdown>{vision}</ReactMarkdown>
                <span className="inline-block w-2 h-4 bg-teal ml-0.5 animate-pulse rounded-sm" />
              </div>
            </div>
          )}

          {/* Done: beautiful sectioned cards */}
          {!isStreaming && sections && (
            <div className="space-y-4 mb-8 animate-fade-in">
              {sections.map((section, idx) => {
                const meta = sectionMeta[section.title] ?? {
                  icon: Star,
                  color: "text-teal",
                  bg: "bg-teal-500/10",
                  border: "border-teal-500/20",
                };
                const Icon = meta.icon;
                const isMessage = section.title === "A Message From Your Future Self";

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-6 transition-all duration-300 animate-fade-up ${
                      isMessage
                        ? "bg-gradient-card border-violet-500/20"
                        : "bg-surface-1 border-border/50 hover:border-border"
                    }`}
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    {/* Section header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.bg} border ${meta.border}`}>
                        <Icon className={`w-4 h-4 ${meta.color}`} />
                      </div>
                      <h3 className={`text-sm font-bold uppercase tracking-widest ${meta.color}`}>
                        {section.title}
                      </h3>
                    </div>

                    {/* Content */}
                    {isMessage ? (
                      <blockquote className="border-l-2 pl-4 italic text-muted-foreground leading-relaxed"
                        style={{ borderColor: "hsl(var(--violet) / 0.4)" }}>
                        <div className="prose prose-sm prose-invert max-w-none
                          prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:italic
                          prose-li:text-muted-foreground prose-strong:text-foreground">
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

          {/* Skeleton while waiting */}
          {!isStreaming && !sections && !vision && (
            <div className="space-y-4 mb-8">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="bg-surface-1 border border-border/50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-surface-3 animate-pulse" />
                    <div className="h-3 bg-surface-3 rounded animate-pulse w-32" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-surface-3 rounded animate-pulse" />
                    <div className="h-3 bg-surface-3 rounded animate-pulse w-4/5" />
                    <div className="h-3 bg-surface-3 rounded animate-pulse w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {!isStreaming && (
            <div className="flex flex-col sm:flex-row gap-3 mb-12 animate-fade-up">
              <Button
                onClick={restart}
                variant="outline"
                className="border-border hover:border-teal-500/40 gap-2 flex-1"
              >
                <RefreshCw className="w-4 h-4" />
                Reimagine
              </Button>
              <Link to="/paths" className="flex-1">
                <Button className="w-full bg-gradient-teal text-primary-foreground gap-2 hover:opacity-90">
                  Build Your Reinvention Path
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}

          {/* Next steps */}
          {!isStreaming && vision && (
            <div className="bg-gradient-card border rounded-2xl p-6 animate-fade-up"
              style={{ borderColor: "hsl(var(--teal) / 0.15)" }}>
              <h3 className="font-semibold text-foreground mb-4">Turn your vision into reality</h3>
              <div className="space-y-3">
                {[
                  { label: "Explore Career Paths", sub: "Find routes toward your future identity", href: "/paths", color: "teal" as const },
                  { label: "Discover Opportunities", sub: "Roles that align with your vision", href: "/opportunities", color: "violet" as const },
                  { label: "Talk to your AI Coach", sub: "\"How do I get from here to there?\"", href: "/coach", color: "amber" as const },
                ].map((item) => {
                  const colorStyles = {
                    teal: { text: "text-teal", bg: "bg-teal-500/10", border: "border-teal-500/20" },
                    violet: { text: "text-violet", bg: "bg-violet-500/10", border: "border-violet-500/20" },
                    amber: { text: "text-amber", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                  }[item.color];
                  const icons = { teal: GitBranch, violet: Eye, amber: MessageSquare };
                  const ItemIcon = icons[item.color];
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center gap-4 p-3 rounded-xl bg-surface-2 hover:bg-surface-3 transition-colors group"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${colorStyles.bg} ${colorStyles.border}`}>
                        <ItemIcon className={`w-3.5 h-3.5 ${colorStyles.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.sub}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-teal group-hover:translate-x-0.5 transition-all" />
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

  // ── QUESTIONS ─────────────────────────────────────────────────
  const q = questions[current];
  const QIcon = q.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-3xl transition-all duration-1000"
          style={{ background: "hsl(var(--violet) / 0.05)" }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full blur-3xl"
          style={{ background: "hsl(var(--teal) / 0.04)" }} />
      </div>

      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-50"
        style={{ background: "hsl(var(--border) / 0.4)" }}>
        <div
          className="h-full transition-all duration-700"
          style={{
            width: `${((current + 1) / questions.length) * 100}%`,
            background: "linear-gradient(90deg, hsl(var(--violet)), hsl(var(--teal)))",
          }}
        />
      </div>

      {/* Minimal nav */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <img src={pathlyLogo} alt="Pathly" className="w-7 h-7 rounded-lg object-contain" />
          <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
        </Link>
        {/* Step indicators */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{current + 1} of {questions.length}</span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i < current
                    ? "w-6"
                    : i === current
                    ? "w-6 animate-pulse"
                    : "w-1.5 bg-border"
                }`}
                style={i <= current
                  ? { background: "linear-gradient(90deg, hsl(var(--violet)), hsl(var(--teal)))" }
                  : {}}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div
          className={`w-full max-w-xl transition-all duration-200 ${
            fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Icon + label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "hsl(var(--violet) / 0.15)", border: "1px solid hsl(var(--violet) / 0.25)" }}>
              <QIcon className="w-4.5 h-4.5 text-violet" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-violet">{q.label}</span>
          </div>

          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-tight mb-3">
            {q.question}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">{q.hint}</p>

          {/* Textarea */}
          <textarea
            ref={textRef}
            value={currentAnswer}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder={q.placeholder}
            rows={5}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && canContinue) next();
            }}
            className="w-full rounded-2xl border px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 transition-all leading-relaxed"
            style={{
              background: "hsl(var(--surface-1))",
              borderColor: currentAnswer.length > 0 ? "hsl(var(--violet) / 0.35)" : "hsl(var(--border))",
              boxShadow: currentAnswer.length > 0
                ? "0 0 0 1px hsl(var(--violet) / 0.15), 0 4px 20px -4px hsl(var(--violet) / 0.1)"
                : "none",
            }}
          />

          {/* Footer controls */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={prev}
              disabled={current === 0}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground/60 hidden sm:block">
                ⌘ + Enter to continue
              </span>
              <Button
                onClick={next}
                disabled={!canContinue}
                className="gap-2 font-semibold"
                style={canContinue
                  ? { background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--teal)))", color: "hsl(var(--primary-foreground))" }
                  : {}}
              >
                {isLast ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Create My Vision
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────
import { GitBranch } from "lucide-react";

function parseSections(markdown: string): { title: string; content: string }[] {
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
