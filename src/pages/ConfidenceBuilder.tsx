import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, ArrowLeft, Shield, RefreshCw, Sparkles,
  Star, Wrench, Users, Brain, Heart,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import pathlyLogo from "@/assets/pathly-logo.png";
import { toast } from "sonner";

const CONFIDENCE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/confidence-builder`;

// ── Questions ─────────────────────────────────────────────────────
const questions = [
  {
    id: 1,
    icon: Shield,
    label: "Challenges Overcome",
    question: "List three challenges you have overcome in your life.",
    hint: "These don't need to be dramatic. Hard seasons, difficult decisions, moments where you kept going despite uncertainty — all count.",
    placeholder: "1. When I lost my job and had to...\n2. When I navigated...\n3. The time I had to...",
  },
  {
    id: 2,
    icon: Wrench,
    label: "Skills That Carried You",
    question: "What skills helped you get through those moments?",
    hint: "Think about what you actually drew on — persistence, communication, resourcefulness, creativity, calm under pressure.",
    placeholder: "I relied on my ability to stay calm, my habit of breaking big problems into...",
  },
  {
    id: 3,
    icon: Users,
    label: "What Others Rely On You For",
    question: "What have people consistently relied on you for?",
    hint: "Friends, family, teammates, colleagues. What do they come to you for? What do they trust you with?",
    placeholder: "People often come to me when they need... My colleagues have relied on me to...",
  },
  {
    id: 4,
    icon: Star,
    label: "Impossible Made Possible",
    question: "What have you done that you once thought was impossible?",
    hint: "A moment where you surprised yourself. Where the thing felt out of reach — and then you did it anyway.",
    placeholder: "I once thought I could never... but I ended up...",
  },
  {
    id: 5,
    icon: Brain,
    label: "Your Approach",
    question: "How do you typically approach a difficult problem?",
    hint: "What's your instinct? Do you research, talk it through, make a plan, try and iterate? What does your problem-solving look like?",
    placeholder: "When I face a hard problem, I usually start by... Then I...",
  },
  {
    id: 6,
    icon: Heart,
    label: "Underestimated Strengths",
    question: "What strengths do you think people underestimate in you?",
    hint: "The quiet capabilities. The things you just do naturally that others find difficult. What do you downplay?",
    placeholder: "I think people don't realize how much I...",
  },
];

// ── Section metadata ───────────────────────────────────────────────
const sectionMeta: Record<string, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  "Your Resilience":           { icon: Shield, color: "text-amber",  bg: "bg-amber-500/10",  border: "border-amber-500/20" },
  "Your Transferable Skills":  { icon: Wrench, color: "text-teal",   bg: "bg-teal-500/10",   border: "border-teal-500/20" },
  "Your Leadership Traits":    { icon: Users,  color: "text-violet", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  "Your Problem-Solving Ability": { icon: Brain, color: "text-teal", bg: "bg-teal-500/10",   border: "border-teal-500/20" },
  "What You're Capable Of (That You Might Not See)": { icon: Star, color: "text-amber", bg: "bg-amber-500/10", border: "border-amber-500/20" },
};

// ── Streaming helper ───────────────────────────────────────────────
async function streamReflection({
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
  const resp = await fetch(CONFIDENCE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ answers }),
  });

  if (!resp.ok || !resp.body) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error ?? "Could not generate your reflection. Please try again.");
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

type Stage = "intro" | "questions" | "generating" | "reflection";

export default function ConfidenceBuilder() {
  const [stage, setStage] = useState<Stage>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [reflection, setReflection] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const currentAnswer = answers[current] ?? "";
  const canContinue = currentAnswer.trim().length > 10;
  const isLast = current === questions.length - 1;

  const goToQuestion = (idx: number) => {
    setFadeIn(false);
    setTimeout(() => { setCurrent(idx); setFadeIn(true); setTimeout(() => textRef.current?.focus(), 50); }, 180);
  };
  const next = () => { if (!isLast) goToQuestion(current + 1); else generate(); };
  const prev = () => { if (current > 0) goToQuestion(current - 1); };
  const updateAnswer = (val: string) => setAnswers((p) => { const n = [...p]; n[current] = val; return n; });

  const generate = async () => {
    setStage("generating");
    setTimeout(() => setStage("reflection"), 600);
    const payload = questions.map((q, i) => ({ question: q.question, answer: answers[i] || "(no answer provided)" }));
    let text = "";
    setIsStreaming(true);
    try {
      await streamReflection({
        answers: payload,
        onDelta: (chunk) => { text += chunk; setReflection(text); },
        onDone: () => setIsStreaming(false),
        onError: (msg) => { setIsStreaming(false); toast.error(msg); },
      });
    } catch {
      setIsStreaming(false);
      toast.error("Connection error. Please try again.");
    }
  };

  const restart = () => { setAnswers(Array(questions.length).fill("")); setReflection(""); setCurrent(0); setStage("intro"); };

  // ── INTRO ────────────────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--amber) / 0.06)" }} />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[300px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--teal) / 0.05)" }} />
        </div>

        <div className="relative z-10 max-w-xl w-full text-center animate-fade-up">
          {/* Icon */}
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8"
            style={{ background: "linear-gradient(135deg, hsl(var(--amber)), hsl(38 90% 65%))", boxShadow: "0 0 40px -8px hsl(var(--amber) / 0.4)" }}>
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-8 border"
            style={{ background: "hsl(var(--amber) / 0.1)", borderColor: "hsl(var(--amber) / 0.25)", color: "hsl(var(--amber))" }}>
            <Sparkles className="w-3.5 h-3.5" />
            Confidence Builder · Strength Reflection
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight mb-6">
            You are more capable<br />
            <span className="text-gradient-amber">than you realize.</span>
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            Most people dramatically underestimate their own strength.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-10 max-w-md mx-auto">
            Answer <span className="text-foreground font-medium">6 honest prompts</span> about your real experiences. Then your AI coach will reveal the depth of capability already inside you — resilience, skills, leadership, and more.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-10">
            {[
              { label: "Prompts", value: "6" },
              { label: "Minutes", value: "~8" },
              { label: "Strength areas", value: "4" },
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
              className="px-8 py-3 h-auto text-base font-semibold hover:opacity-90 gap-2"
              style={{ background: "linear-gradient(135deg, hsl(var(--amber)), hsl(38 90% 65%))", color: "hsl(var(--primary-foreground))", boxShadow: "0 0 30px -8px hsl(var(--amber) / 0.4)" }}
            >
              Discover My Strengths
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

  // ── GENERATING ───────────────────────────────────────────────────
  if (stage === "generating") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="text-center animate-fade-in space-y-5">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto animate-pulse"
            style={{ background: "linear-gradient(135deg, hsl(var(--amber)), hsl(38 90% 65%))" }}>
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <p className="text-foreground font-semibold text-lg mb-1">Uncovering your strengths…</p>
            <p className="text-muted-foreground text-sm">Reading what you've been through and what it says about you</p>
          </div>
          <div className="flex gap-1.5 justify-center">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "hsl(var(--amber))", animationDelay: `${i * 200}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── STRENGTH REFLECTION ──────────────────────────────────────────
  if (stage === "reflection") {
    const sections = !isStreaming ? parseSections(reflection) : null;

    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--amber) / 0.04)" }} />
          <div className="absolute bottom-0 right-1/3 w-[500px] h-[350px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--teal) / 0.03)" }} />
        </div>

        <div className="relative z-10 container max-w-2xl py-16 px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "linear-gradient(135deg, hsl(var(--amber)), hsl(38 90% 65%))", boxShadow: "0 0 30px -8px hsl(var(--amber) / 0.4)" }}>
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
              Your Strength Reflection
            </h1>
            <p className="text-muted-foreground">
              Built from your real experiences — what you've done and who you've been.
            </p>
          </div>

          {/* Streaming: raw markdown */}
          {isStreaming && (
            <div className="bg-gradient-card border border-border/50 rounded-2xl p-8 mb-8 animate-fade-in">
              <div className="prose prose-sm prose-invert max-w-none
                prose-h2:text-foreground prose-h2:font-bold prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-li:text-muted-foreground prose-strong:text-foreground
                prose-ul:my-2 [&>h2:first-child]:mt-0">
                <ReactMarkdown>{reflection}</ReactMarkdown>
                <span className="inline-block w-2 h-4 ml-0.5 animate-pulse rounded-sm"
                  style={{ background: "hsl(var(--amber))" }} />
              </div>
            </div>
          )}

          {/* Done: sectioned cards */}
          {!isStreaming && sections && (
            <div className="space-y-4 mb-8">
              {sections.map((section, idx) => {
                const meta = sectionMeta[section.title] ?? {
                  icon: Star, color: "text-amber", bg: "bg-amber-500/10", border: "border-amber-500/20",
                };
                const Icon = meta.icon;
                const isCapable = section.title.includes("Capable Of");

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-6 animate-fade-up transition-all duration-300 ${
                      isCapable
                        ? "bg-gradient-card border-amber-500/25"
                        : "bg-surface-1 border-border/50 hover:border-border"
                    }`}
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.bg} border ${meta.border}`}>
                        <Icon className={`w-4 h-4 ${meta.color}`} />
                      </div>
                      <h3 className={`text-sm font-bold uppercase tracking-widest ${meta.color}`}>
                        {section.title}
                      </h3>
                    </div>

                    {isCapable ? (
                      <div className="border-l-2 pl-4"
                        style={{ borderColor: "hsl(var(--amber) / 0.4)" }}>
                        <div className="prose prose-sm prose-invert max-w-none
                          prose-p:text-muted-foreground prose-p:leading-relaxed
                          prose-li:text-muted-foreground prose-strong:text-foreground prose-ul:my-1">
                          <ReactMarkdown>{section.content}</ReactMarkdown>
                        </div>
                      </div>
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

          {/* Skeleton */}
          {!isStreaming && !sections && !reflection && (
            <div className="space-y-4 mb-8">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-surface-1 border border-border/50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-surface-3 animate-pulse" />
                    <div className="h-3 bg-surface-3 rounded animate-pulse w-40" />
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
                className="border-border hover:border-amber-500/40 gap-2 flex-1"
              >
                <RefreshCw className="w-4 h-4" />
                Reflect Again
              </Button>
              <Link to="/identity-map" className="flex-1">
                <Button
                  className="w-full gap-2 hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, hsl(var(--amber)), hsl(38 90% 65%))", color: "hsl(var(--primary-foreground))" }}
                >
                  See Your Identity Map
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}

          {/* Next steps */}
          {!isStreaming && reflection && (
            <div className="bg-gradient-card border rounded-2xl p-6 animate-fade-up"
              style={{ borderColor: "hsl(var(--amber) / 0.15)" }}>
              <h3 className="font-semibold text-foreground mb-4">Put your strengths to work</h3>
              <div className="space-y-3">
                {[
                  { label: "Explore Career Paths", sub: "Find paths that leverage what you already have", href: "/paths", color: "amber" as const },
                  { label: "Discover Opportunities", sub: "Roles matched to your real strengths", href: "/opportunities", color: "teal" as const },
                  { label: "Talk to your AI Coach", sub: "\"What should I do with these strengths?\"", href: "/coach", color: "violet" as const },
                ].map((item) => {
                  const styles = {
                    amber:  { text: "text-amber",  bg: "bg-amber-500/10",  border: "border-amber-500/20",  Icon: Shield },
                    teal:   { text: "text-teal",   bg: "bg-teal-500/10",   border: "border-teal-500/20",   Icon: Star },
                    violet: { text: "text-violet", bg: "bg-violet-500/10", border: "border-violet-500/20", Icon: Brain },
                  }[item.color];
                  const { Icon, text, bg, border } = styles;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center gap-4 p-3 rounded-xl bg-surface-2 hover:bg-surface-3 transition-colors group"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${bg} ${border}`}>
                        <Icon className={`w-3.5 h-3.5 ${text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.sub}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-amber group-hover:translate-x-0.5 transition-all" />
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

  // ── QUESTIONS ────────────────────────────────────────────────────
  const q = questions[current];
  const QIcon = q.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-3xl transition-all duration-1000"
          style={{ background: "hsl(var(--amber) / 0.05)" }} />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] rounded-full blur-3xl"
          style={{ background: "hsl(var(--teal) / 0.04)" }} />
      </div>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-50"
        style={{ background: "hsl(var(--border) / 0.4)" }}>
        <div
          className="h-full transition-all duration-700"
          style={{
            width: `${((current + 1) / questions.length) * 100}%`,
            background: "linear-gradient(90deg, hsl(var(--amber)), hsl(38 90% 65%))",
          }}
        />
      </div>

      {/* Nav */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-teal flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground">EV<span className="text-gradient-teal">OLV</span>E</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{current + 1} of {questions.length}</span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${i > current ? "w-1.5 bg-border" : ""}`}
                style={i <= current
                  ? { width: "24px", background: "linear-gradient(90deg, hsl(var(--amber)), hsl(38 90% 65%))" }
                  : {}}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className={`w-full max-w-xl transition-all duration-200 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {/* Icon + label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "hsl(var(--amber) / 0.15)", border: "1px solid hsl(var(--amber) / 0.25)" }}>
              <QIcon className="w-4 h-4 text-amber" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber">{q.label}</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-tight mb-3">
            {q.question}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">{q.hint}</p>

          <textarea
            ref={textRef}
            value={currentAnswer}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder={q.placeholder}
            rows={5}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && canContinue) next(); }}
            className="w-full rounded-2xl border px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none transition-all leading-relaxed"
            style={{
              background: "hsl(var(--surface-1))",
              borderColor: currentAnswer.length > 0 ? "hsl(var(--amber) / 0.4)" : "hsl(var(--border))",
              boxShadow: currentAnswer.length > 0
                ? "0 0 0 1px hsl(var(--amber) / 0.15), 0 4px 20px -4px hsl(var(--amber) / 0.1)"
                : "none",
            }}
          />

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
              <span className="text-xs text-muted-foreground/60 hidden sm:block">⌘ + Enter to continue</span>
              <Button
                onClick={next}
                disabled={!canContinue}
                className="gap-2 font-semibold"
                style={canContinue
                  ? { background: "linear-gradient(135deg, hsl(var(--amber)), hsl(38 90% 65%))", color: "hsl(var(--primary-foreground))" }
                  : {}}
              >
                {isLast ? (
                  <><Sparkles className="w-4 h-4" /> Reveal My Strengths</>
                ) : (
                  <>Continue <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
