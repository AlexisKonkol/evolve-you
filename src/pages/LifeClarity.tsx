import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Sparkles, RefreshCw, Download, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import pathlyLogo from "@/assets/pathly-logo.png";

const LIFE_CLARITY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/life-clarity`;

const questions = [
  {
    id: 1,
    question: "What kind of problems do you naturally care about?",
    hint: "Think about the issues in the world or in people's lives that genuinely move you — even if you've never acted on them.",
    placeholder: "For example: helping people find their confidence, making systems more fair, solving complex puzzles...",
  },
  {
    id: 2,
    question: "What activities make you lose track of time?",
    hint: "Recall moments when hours passed like minutes. What were you doing?",
    placeholder: "For example: deep conversations, building things, teaching, writing, organizing, creating...",
  },
  {
    id: 3,
    question: "When do you feel most alive?",
    hint: "Not just happy — truly alive. Present, energized, and fully yourself.",
    placeholder: "For example: when I'm leading a team through a challenge, when I'm learning something entirely new...",
  },
  {
    id: 4,
    question: "What kind of work environment helps you thrive?",
    hint: "Think about the conditions that bring out your best — not just what you've experienced, but what you'd truly love.",
    placeholder: "For example: autonomy over my schedule, collaborating closely with a small team, big creative challenges...",
  },
  {
    id: 5,
    question: "What impact would you love to make in the world?",
    hint: "Imagine looking back at the end of your life. What would make you feel like your time here truly mattered?",
    placeholder: "For example: helping thousands of people change careers, building tools that make work more human...",
  },
  {
    id: 6,
    question: "What would you do if you knew you couldn't fail?",
    hint: "Remove all fear, judgment, and practical constraints for a moment. What's the version of life you'd reach for?",
    placeholder: "For example: I'd start my own consulting firm, I'd write a book, I'd build a school...",
  },
  {
    id: 7,
    question: "What does a deeply fulfilling day look like to you?",
    hint: "Be specific. Who are you with? What are you doing? How does it feel?",
    placeholder: "For example: I wake up with purpose, spend the morning deep in meaningful work, collaborate in the afternoon...",
  },
];

type Stage = "intro" | "questions" | "generating" | "summary";

async function streamSummary({
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
  const resp = await fetch(LIFE_CLARITY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ answers }),
  });

  if (!resp.ok || !resp.body) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error ?? "Could not generate your summary. Please try again.");
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

export default function LifeClarity() {
  const [stage, setStage] = useState<Stage>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [summary, setSummary] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const progress = ((current) / questions.length) * 100;
  const currentAnswer = answers[current] ?? "";
  const canContinue = currentAnswer.trim().length > 10;

  // Smooth transition on question change
  const goToQuestion = (idx: number) => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrent(idx);
      setFadeIn(true);
      setTimeout(() => textRef.current?.focus(), 50);
    }, 200);
  };

  const next = () => {
    if (current < questions.length - 1) {
      goToQuestion(current + 1);
    } else {
      generate();
    }
  };

  const prev = () => {
    if (current > 0) goToQuestion(current - 1);
  };

  const updateAnswer = (val: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = val;
      return next;
    });
  };

  const generate = async () => {
    setStage("generating");
    setTimeout(() => setStage("summary"), 600);

    const payload = questions.map((q, i) => ({
      question: q.question,
      answer: answers[i] || "(no answer provided)",
    }));

    let summaryText = "";
    setIsStreaming(true);

    try {
      await streamSummary({
        answers: payload,
        onDelta: (chunk) => {
          summaryText += chunk;
          setSummary(summaryText);
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
    setSummary("");
    setCurrent(0);
    setStage("intro");
  };

  // ────────────────────────────────────────────────
  // INTRO
  // ────────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[300px] bg-violet-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-xl w-full text-center animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-coral-500/10 border border-coral-500/20 rounded-full px-4 py-2 text-sm text-coral font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Life Clarity · The Pause
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight mb-6">
            Stop asking what to do.<br />
            <span className="text-gradient-coral">Start asking who you are.</span>
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            This is a quiet space to understand yourself more deeply than ever before.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-10 max-w-md mx-auto">
            You'll be guided through <span className="text-foreground font-medium">7 honest questions</span>. Take your time. There are no right answers — only yours. At the end, your AI guide will reveal a personalized Life Clarity profile of who you are becoming.
          </p>

          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={() => { setStage("questions"); setTimeout(() => textRef.current?.focus(), 100); }}
              className="bg-gradient-coral text-primary-foreground px-8 py-3 h-auto text-base font-semibold hover:opacity-90 glow-coral gap-2"
            >
              Begin Your Reflection
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

  // ────────────────────────────────────────────────
  // GENERATING TRANSITION
  // ────────────────────────────────────────────────
  if (stage === "generating") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 bg-gradient-teal rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">Reading your reflections…</p>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // SUMMARY
  // ────────────────────────────────────────────────
  if (stage === "summary") {
    return (
      <div className="min-h-screen bg-background">
        {/* Ambient glow */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/4 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container max-w-2xl py-16 px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <div className="w-14 h-14 bg-gradient-teal rounded-2xl flex items-center justify-center mx-auto mb-5 glow-teal">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
              Your Life Clarity Summary
            </h1>
            <p className="text-muted-foreground">
              Generated from your honest reflections.
            </p>
          </div>

          {/* Summary content */}
          <div className="bg-gradient-card border border-border/50 rounded-2xl p-8 mb-8 animate-fade-in">
            {summary ? (
              <div className="prose prose-sm prose-invert max-w-none
                prose-h2:text-foreground prose-h2:font-bold prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-li:text-muted-foreground
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:my-2 prose-ol:my-2
                [&>h2:first-child]:mt-0">
                <ReactMarkdown>{summary}</ReactMarkdown>
                {isStreaming && (
                  <span className="inline-block w-2 h-4 bg-teal ml-0.5 animate-pulse rounded-sm" />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-4 bg-surface-3 rounded animate-pulse" style={{ width: `${70 + Math.random() * 30}%` }} />
                ))}
              </div>
            )}
          </div>

          {/* Action bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Button
              onClick={restart}
              variant="outline"
              className="border-border hover:border-teal-500/40 gap-2 flex-1"
              disabled={isStreaming}
            >
              <RefreshCw className="w-4 h-4" />
              Reflect Again
            </Button>
            <Link to="/dashboard" className="flex-1">
              <Button
                className="w-full bg-gradient-teal text-primary-foreground gap-2 hover:opacity-90"
                disabled={isStreaming}
              >
                Continue Your Journey
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Next steps */}
          {!isStreaming && summary && (
            <div className="bg-gradient-card border border-teal-500/15 rounded-2xl p-6 animate-fade-up">
              <h3 className="font-semibold text-foreground mb-4">Turn this insight into action</h3>
              <div className="space-y-3">
                {[
                  { label: "Explore your Identity Map", sub: "See how your clarity maps to strengths", href: "/identity-map", color: "teal" },
                  { label: "Scan Opportunities", sub: "Find roles that match who you are", href: "/opportunities", color: "violet" },
                  { label: "Talk to your AI Coach", sub: "Ask what to do next", href: "/coach", color: "amber" },
                ].map((item) => {
                  const colorClass = {
                    teal: "text-teal bg-teal-500/10 border-teal-500/20",
                    violet: "text-violet bg-violet-500/10 border-violet-500/20",
                    amber: "text-amber bg-amber-500/10 border-amber-500/20",
                  }[item.color];
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center gap-4 p-3 rounded-xl bg-surface-2 hover:bg-surface-3 transition-colors group"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${colorClass} shrink-0`}>
                        <ArrowRight className="w-3.5 h-3.5" />
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

  // ────────────────────────────────────────────────
  // QUESTIONS
  // ────────────────────────────────────────────────
  const q = questions[current];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-teal-500/4 rounded-full blur-3xl transition-all duration-1000" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-violet-500/3 rounded-full blur-3xl" />
      </div>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-border/50 z-50">
        <div
          className="h-full bg-gradient-teal transition-all duration-700"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Nav */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <img src={pathlyLogo} alt="Pathly" className="w-7 h-7 rounded-lg object-contain" />
          <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{current + 1} of {questions.length}</span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i < current ? "w-6 bg-teal" : i === current ? "w-6 bg-teal animate-pulse" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main question area */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div
          className={`w-full max-w-xl transition-all duration-200 ${
            fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Question number */}
          <p className="text-xs font-semibold uppercase tracking-widest text-teal mb-6">
            Question {current + 1} · Reflection
          </p>

          {/* Question */}
          <h2 className="font-display text-3xl md:text-4xl text-foreground leading-tight mb-4">
            {q.question}
          </h2>

          {/* Hint */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            {q.hint}
          </p>

          {/* Textarea */}
          <textarea
            ref={textRef}
            value={currentAnswer}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder={q.placeholder}
            rows={5}
            className="w-full bg-surface-2/60 border border-border/60 hover:border-teal-500/30 focus:border-teal-500/50 rounded-2xl px-5 py-4 text-foreground placeholder:text-muted-foreground/40 text-base leading-relaxed resize-none focus:outline-none transition-colors backdrop-blur-sm"
          />

          {/* Character hint */}
          <p className={`text-xs mt-2 transition-colors ${currentAnswer.length < 10 ? "text-muted-foreground/40" : "text-teal/60"}`}>
            {currentAnswer.length < 10 ? "Take your time — be as open as you'd like" : "✓ Looking good"}
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              onClick={prev}
              variant="ghost"
              disabled={current === 0}
              className="text-muted-foreground hover:text-foreground gap-2 disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              onClick={next}
              disabled={!canContinue}
              className="bg-gradient-teal text-primary-foreground px-6 gap-2 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {current === questions.length - 1 ? (
                <>
                  Generate My Clarity
                  <Sparkles className="w-4 h-4" />
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
  );
}
