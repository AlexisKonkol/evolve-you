import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, ArrowLeft, Sparkles, RefreshCw, Compass,
  Zap, Heart, Star, Briefcase, FlaskConical, ChevronDown,
  ChevronUp, BookOpen, Users, Globe, Lightbulb, Map,
} from "lucide-react";
import pathlyLogo from "@/assets/pathly-logo.png";
import { toast } from "sonner";

const PATH_FINDER_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/path-finder`;

// ── Input questions ────────────────────────────────────────────────
const inputQuestions = [
  {
    id: "reflections",
    icon: Heart,
    label: "What You Care About",
    question: "What problems genuinely stir something in you?",
    hint: "Not problems you think you should care about — the ones that actually get under your skin. They don't have to be world-changing.",
    placeholder: "For example: people feeling misunderstood, broken systems, things that are needlessly complicated…",
  },
  {
    id: "interests",
    icon: Lightbulb,
    label: "Your Curiosities",
    question: "What topics or ideas do you find yourself naturally drawn to?",
    hint: "Think about what you read about for fun, what you talk about when no one's watching, what you'd explore even if it didn't pay.",
    placeholder: "For example: how organisations work, emerging tech, human psychology, design, storytelling…",
  },
  {
    id: "strengths",
    icon: Star,
    label: "What You're Good At",
    question: "What do you do noticeably well — even if you don't always label it a strength?",
    hint: "Include things people come to you for, things that feel easy to you but hard for others, even soft skills.",
    placeholder: "For example: explaining things clearly, spotting patterns, making people feel heard, building things…",
  },
  {
    id: "motivations",
    icon: Zap,
    label: "What Drives You",
    question: "What motivates you more than money or titles?",
    hint: "Think about what makes work feel meaningful. What would make you feel proud at the end of a day?",
    placeholder: "For example: making a real difference, creating something lasting, learning constantly, helping others grow…",
  },
  {
    id: "energySources",
    icon: Compass,
    label: "Your Energy Patterns",
    question: "What kinds of activities give you energy rather than drain you?",
    hint: "Think about when time passes quickly. When do you feel most alive at work — and what are the conditions?",
    placeholder: "For example: deep focused thinking, collaborating with smart people, building from scratch, teaching others…",
  },
];

// ── Path block parser ──────────────────────────────────────────────
interface ParsedPath {
  title: string;
  whyFit: string;
  description: string;
  skills: string[];
  industries: string[];
  roles: string[];
  experiments: string[];
}

function parsePaths(markdown: string): ParsedPath[] {
  const pathBlocks = markdown.split(/^## PATH:/m).filter(Boolean);
  return pathBlocks.map((block) => {
    const lines = block.split("\n");
    const title = lines[0]?.trim() ?? "Untitled Path";

    const extract = (tag: string): string => {
      const idx = block.indexOf(`### ${tag}`);
      if (idx === -1) return "";
      const after = block.slice(idx + tag.length + 4).trim();
      const nextSection = after.indexOf("### ");
      return (nextSection === -1 ? after : after.slice(0, nextSection)).trim();
    };

    const toList = (raw: string) =>
      raw.split(",").map((s) => s.replace(/^•\s*/, "").trim()).filter(Boolean);

    const toBullets = (raw: string) =>
      raw.split("\n").map((s) => s.replace(/^•\s*/, "").trim()).filter(Boolean);

    return {
      title,
      whyFit: extract("WHY_FIT"),
      description: extract("DESCRIPTION"),
      skills: toList(extract("SKILLS")),
      industries: toList(extract("INDUSTRIES")),
      roles: toList(extract("ROLES")),
      experiments: toBullets(extract("EXPERIMENTS")),
    };
  });
}

// ── Streaming helper ───────────────────────────────────────────────
async function streamPaths({
  signals, onDelta, onDone, onError,
}: {
  signals: Record<string, string>;
  onDelta: (chunk: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const resp = await fetch(PATH_FINDER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ signals }),
  });

  if (!resp.ok || !resp.body) {
    const data = await resp.json().catch(() => ({}));
    onError((data as { error?: string }).error ?? "Could not generate your paths. Please try again.");
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

type Stage = "intro" | "questions" | "generating" | "paths";

// ── Path Card ──────────────────────────────────────────────────────
function PathCard({ path, index }: { path: ParsedPath; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [experimentIdx, setExperimentIdx] = useState<number | null>(null);

  const colors = [
    { accent: "coral",  accentHsl: "var(--coral)",  bg: "hsl(var(--coral) / 0.06)", border: "hsl(var(--coral) / 0.2)"  },
    { accent: "violet", accentHsl: "var(--violet)", bg: "hsl(var(--violet) / 0.06)", border: "hsl(var(--violet) / 0.2)" },
    { accent: "amber",  accentHsl: "var(--amber)",  bg: "hsl(var(--amber) / 0.06)",  border: "hsl(var(--amber) / 0.2)"  },
    { accent: "coral",  accentHsl: "var(--coral)",  bg: "hsl(var(--coral) / 0.04)", border: "hsl(var(--coral) / 0.15)" },
  ];
  const c = colors[index % colors.length];

  return (
    <div
      className="rounded-2xl border transition-all duration-300 animate-fade-up overflow-hidden"
      style={{ animationDelay: `${index * 100}ms`, background: c.bg, borderColor: c.border }}
    >
      {/* Card header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `hsl(${c.accentHsl} / 0.15)` }}>
              <Compass className="w-5 h-5" style={{ color: `hsl(${c.accentHsl})` }} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-0.5"
                style={{ color: `hsl(${c.accentHsl})` }}>
                Path {index + 1}
              </p>
              <h3 className="text-lg font-bold text-foreground leading-tight">{path.title}</h3>
            </div>
          </div>
        </div>

        {/* Description */}
        {path.description && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{path.description}</p>
        )}

        {/* Why fit */}
        {path.whyFit && (
          <div className="rounded-xl p-4 mb-4"
            style={{ background: `hsl(${c.accentHsl} / 0.08)`, border: `1px solid hsl(${c.accentHsl} / 0.15)` }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: `hsl(${c.accentHsl})` }}>
              Why this may fit you
            </p>
            <p className="text-sm text-foreground leading-relaxed">{path.whyFit}</p>
          </div>
        )}

        {/* CTA row */}
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            className="gap-1.5 text-xs font-semibold hover:opacity-90 transition-opacity"
            style={{
              background: `hsl(${c.accentHsl})`,
              color: "hsl(var(--primary-foreground))",
            }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Close" : "Explore This Path"}
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Button>
          {path.experiments.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs border-border hover:border-current transition-colors"
              style={{ color: `hsl(${c.accentHsl})`, borderColor: `hsl(${c.accentHsl} / 0.3)` }}
              onClick={() => { setExpanded(true); setExperimentIdx(0); }}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Try a Small Experiment
            </Button>
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t px-6 pb-6 pt-5 space-y-5 animate-fade-in"
          style={{ borderColor: c.border }}>

          {/* Skills */}
          {path.skills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-3.5 h-3.5" style={{ color: `hsl(${c.accentHsl})` }} />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Skills You'd Build</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {path.skills.map((skill) => (
                  <span key={skill} className="text-xs px-3 py-1 rounded-full bg-surface-2 text-foreground border border-border/50">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Industries & Roles side by side */}
          <div className="grid sm:grid-cols-2 gap-4">
            {path.industries.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-3.5 h-3.5" style={{ color: `hsl(${c.accentHsl})` }} />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Industries</span>
                </div>
                <div className="space-y-1.5">
                  {path.industries.map((ind) => (
                    <div key={ind} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full" style={{ background: `hsl(${c.accentHsl})` }} />
                      <span className="text-sm text-foreground/80">{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {path.roles.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-3.5 h-3.5" style={{ color: `hsl(${c.accentHsl})` }} />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Example Roles</span>
                </div>
                <div className="space-y-1.5">
                  {path.roles.map((role) => (
                    <div key={role} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full" style={{ background: `hsl(${c.accentHsl})` }} />
                      <span className="text-sm text-foreground/80">{role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Experiments */}
          {path.experiments.length > 0 && (
            <div>
              <div className="rounded-xl p-4"
                style={{ background: "hsl(var(--surface-2))", border: "1px solid hsl(var(--border) / 0.5)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <FlaskConical className="w-3.5 h-3.5" style={{ color: `hsl(${c.accentHsl})` }} />
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: `hsl(${c.accentHsl})` }}>
                    Try a Small Experiment
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Test this path before committing. Each experiment takes less than an hour.
                </p>
                <div className="space-y-2">
                  {path.experiments.map((exp, i) => (
                    <button
                      key={i}
                      onClick={() => setExperimentIdx(experimentIdx === i ? null : i)}
                      className="w-full text-left flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-surface-3"
                      style={{
                        background: experimentIdx === i ? `hsl(${c.accentHsl} / 0.08)` : undefined,
                        border: experimentIdx === i ? `1px solid hsl(${c.accentHsl} / 0.2)` : "1px solid transparent",
                      }}
                    >
                      <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                        style={{ background: `hsl(${c.accentHsl} / 0.15)`, color: `hsl(${c.accentHsl})` }}>
                        {i + 1}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{exp}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Learning nudge */}
          <div className="flex gap-2 flex-wrap pt-1">
            <Link to="/learn">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs border-border hover:border-current"
                style={{ color: `hsl(${c.accentHsl})` }}>
                <BookOpen className="w-3.5 h-3.5" />
                Find Learning Resources
              </Button>
            </Link>
            <Link to="/community">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs border-border hover:border-current"
                style={{ color: `hsl(${c.accentHsl})` }}>
                <Users className="w-3.5 h-3.5" />
                Talk to Someone in This Field
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────
export default function PathFinder() {
  const [stage, setStage] = useState<Stage>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [rawPaths, setRawPaths] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const q = inputQuestions[current];
  const currentAnswer = answers[q?.id ?? ""] ?? "";
  const canContinue = currentAnswer.trim().length > 10;
  const isLast = current === inputQuestions.length - 1;
  const progressPct = ((current + 1) / inputQuestions.length) * 100;

  const goTo = (idx: number) => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrent(idx);
      setFadeIn(true);
      setTimeout(() => textRef.current?.focus(), 50);
    }, 200);
  };

  const next = () => { if (!isLast) goTo(current + 1); else generate(); };
  const prev = () => { if (current > 0) goTo(current - 1); };

  const updateAnswer = (val: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: val }));
  };

  const generate = async () => {
    setStage("generating");
    setTimeout(() => setStage("paths"), 700);

    const signals = {
      reflections: answers["reflections"] || "(not provided)",
      interests: answers["interests"] || "(not provided)",
      strengths: answers["strengths"] || "(not provided)",
      motivations: answers["motivations"] || "(not provided)",
      energySources: answers["energySources"] || "(not provided)",
    };

    let text = "";
    setIsStreaming(true);

    try {
      await streamPaths({
        signals,
        onDelta: (chunk) => { text += chunk; setRawPaths(text); },
        onDone: () => setIsStreaming(false),
        onError: (msg) => { setIsStreaming(false); toast.error(msg); },
      });
    } catch {
      setIsStreaming(false);
      toast.error("Connection error. Please try again.");
    }
  };

  const restart = () => {
    setAnswers({});
    setRawPaths("");
    setCurrent(0);
    setStage("intro");
  };

  // ── INTRO ────────────────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--violet) / 0.05)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--coral) / 0.04)" }} />
        </div>

        <div className="relative z-10 max-w-lg w-full text-center animate-fade-up">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-10">
            <img src={pathlyLogo} alt="Pathly" className="w-7 h-7 rounded-lg object-contain" />
            <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
          </Link>

          {/* Icon */}
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8"
            style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}>
            <Map className="w-10 h-10 text-primary-foreground" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-8 border"
            style={{ background: "hsl(var(--violet) / 0.08)", borderColor: "hsl(var(--violet) / 0.2)", color: "hsl(var(--violet))" }}>
            <Sparkles className="w-3.5 h-3.5" />
            Path Finder · AI-Powered Discovery
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight mb-5">
            Discover the paths<br />
            <span className="italic" style={{
              background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>you haven't seen yet.</span>
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            Sometimes the hardest part of moving forward is simply seeing what paths exist.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto">
            The Path Finder analyzes your strengths, interests, motivations, and curiosity patterns to reveal possible directions — including ones you may never have considered.
          </p>
          <p className="text-sm text-muted-foreground/70 leading-relaxed mb-10 max-w-sm mx-auto italic">
            It doesn't tell you what to do. It helps you see what's possible.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-10">
            {[
              { v: "5", l: "Questions" },
              { v: "~5", l: "Minutes" },
              { v: "4", l: "Paths revealed" },
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
              className="text-primary-foreground px-8 py-3 h-auto text-base font-semibold hover:opacity-90 gap-2"
              style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}
            >
              Reveal My Paths
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

  // ── GENERATING ──────────────────────────────────────────────────
  if (stage === "generating") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="text-center animate-fade-in space-y-6 max-w-sm">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto animate-pulse"
            style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}>
            <Map className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <p className="text-foreground font-semibold text-xl mb-2">Reading your signals…</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Finding the paths aligned with who you are becoming. This takes just a moment.
            </p>
          </div>
          <div className="flex gap-1.5 justify-center">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "hsl(var(--violet))", animationDelay: `${i * 200}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── QUESTIONS ───────────────────────────────────────────────────
  if (stage === "questions") {
    const Icon = q.icon;
    return (
      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--violet) / 0.05)" }} />
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-border w-full">
          <div className="h-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, hsl(var(--violet)), hsl(var(--coral)))",
            }} />
        </div>

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <img src={pathlyLogo} alt="Pathly" className="w-6 h-6 rounded-md object-contain" />
            <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
          </Link>
          <div className="text-xs text-muted-foreground">
            {current + 1} of {inputQuestions.length}
          </div>
          <button onClick={restart}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            Start over
          </button>
        </div>

        {/* Main */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className={`w-full max-w-xl transition-all duration-300 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "hsl(var(--violet) / 0.12)" }}>
                <Icon className="w-4 h-4" style={{ color: "hsl(var(--violet))" }} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(var(--violet))" }}>
                {q.label}
              </span>
            </div>

            {/* Question */}
            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3">
              {q.question}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{q.hint}</p>

            {/* Textarea */}
            <textarea
              ref={textRef}
              value={currentAnswer}
              onChange={(e) => updateAnswer(e.target.value)}
              placeholder={q.placeholder}
              rows={5}
              className="w-full bg-surface-2 border border-border/60 rounded-xl p-4 text-sm text-foreground
                placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 transition-all
                leading-relaxed"
              style={{ "--tw-ring-color": "hsl(var(--violet) / 0.4)" } as React.CSSProperties}
              onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey && canContinue) next(); }}
            />
            <p className="text-xs text-muted-foreground/50 mt-2">⌘ + Enter to continue</p>

            {/* Navigation */}
            <div className="flex gap-3 mt-6">
              {current > 0 && (
                <Button variant="outline" size="sm" onClick={prev}
                  className="gap-2 border-border hover:border-border/80 text-muted-foreground">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </Button>
              )}
              <Button
                size="sm"
                disabled={!canContinue}
                onClick={next}
                className="gap-2 text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-30"
                style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}
              >
                {isLast ? "Reveal My Paths" : "Next Question"}
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 pb-8 shrink-0">
          {inputQuestions.map((_, i) => (
            <button
              key={i}
              onClick={() => { if (i <= current || answers[inputQuestions[i].id]?.trim().length > 10) goTo(i); }}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i === current
                  ? "hsl(var(--violet))"
                  : i < current
                    ? "hsl(var(--coral) / 0.6)"
                    : "hsl(var(--border))",
                transform: i === current ? "scale(1.3)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── PATHS ────────────────────────────────────────────────────────
  const parsedPaths = !isStreaming ? parsePaths(rawPaths) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-3xl"
          style={{ background: "hsl(var(--violet) / 0.04)" }} />
      </div>

      <div className="relative z-10 container max-w-2xl py-16 px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <img src={pathlyLogo} alt="Pathly" className="w-6 h-6 rounded-md object-contain" />
            <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
          </Link>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}>
            <Map className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-5 border"
            style={{ background: "hsl(var(--violet) / 0.08)", borderColor: "hsl(var(--violet) / 0.2)", color: "hsl(var(--violet))" }}>
            <Sparkles className="w-3.5 h-3.5" />
            Your Path Discovery
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Paths aligned with who you are
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
            These paths were surfaced from your signals — not assigned to you, but revealed for you to explore.
          </p>
        </div>

        {/* Streaming: live output */}
        {isStreaming && (
          <div className="bg-gradient-card border border-border/50 rounded-2xl p-8 mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: "hsl(var(--violet))", animationDelay: `${i * 200}ms` }} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Mapping your paths…</p>
            </div>
            <div className="font-mono text-xs text-muted-foreground/60 leading-relaxed whitespace-pre-wrap max-h-48 overflow-hidden">
              {rawPaths.slice(-400)}
              <span className="inline-block w-1.5 h-3.5 ml-0.5 animate-pulse rounded-sm"
                style={{ background: "hsl(var(--violet))" }} />
            </div>
          </div>
        )}

        {/* Path cards */}
        {!isStreaming && parsedPaths.length > 0 && (
          <div className="space-y-4 mb-10">
            {parsedPaths.map((path, i) => (
              <PathCard key={i} path={path} index={i} />
            ))}
          </div>
        )}

        {/* Psychological footer */}
        {!isStreaming && parsedPaths.length > 0 && (
          <div className="text-center animate-fade-up space-y-4 mb-10"
            style={{ animationDelay: "400ms" }}>
            <div className="rounded-2xl border border-border/40 p-6 bg-gradient-card">
              <p className="text-sm font-semibold text-foreground mb-2">You have more options than you realize.</p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                These paths are starting points, not destinations. You can explore multiple directions. You can combine elements of different paths. You can build something entirely your own.
              </p>
            </div>
          </div>
        )}

        {/* Action bar */}
        {!isStreaming && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up"
            style={{ animationDelay: "500ms" }}>
            <Button
              onClick={restart}
              variant="outline"
              className="gap-2 border-border hover:border-border/80 text-muted-foreground"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Explore different answers
            </Button>
            <Link to="/dashboard">
              <Button className="gap-2 text-primary-foreground font-semibold hover:opacity-90"
                style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}>
                Back to Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
