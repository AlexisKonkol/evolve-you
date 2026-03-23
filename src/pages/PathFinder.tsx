import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, ArrowLeft, Sparkles, RefreshCw, Compass,
  Zap, Heart, Star, Briefcase, FlaskConical,
  BookOpen, Users, Globe, Lightbulb, Map, Brain,
  CheckCircle2, Circle,
} from "lucide-react";
import navoLogo from "@/assets/navo-logo";
import { toast } from "sonner";

const PATH_FINDER_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/path-finder`;

// ── Input questions ─────────────────────────────────────────────────
const inputQuestions = [
  {
    id: "reflections",
    icon: Heart,
    label: "What You Care About",
    question: "What problems genuinely stir something in you?",
    hint: "Not the ones you think you should care about — the ones that actually get under your skin. They don't have to be world-changing.",
    placeholder: "For example: people feeling misunderstood, broken systems, things that are needlessly complicated…",
  },
  {
    id: "interests",
    icon: Lightbulb,
    label: "Your Curiosities",
    question: "What topics or ideas do you naturally find yourself drawn to?",
    hint: "Think about what you read about for fun, what you talk about when no one's watching, what you'd explore even if it didn't pay.",
    placeholder: "For example: how organisations work, emerging tech, human psychology, design, storytelling…",
  },
  {
    id: "strengths",
    icon: Star,
    label: "What You're Good At",
    question: "What do you do noticeably well — even if you don't always label it a strength?",
    hint: "Include things people come to you for, things that feel easy to you but harder for others, even soft skills.",
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
    hint: "Think about when time passes quickly. When do you feel most alive — and what were the conditions?",
    placeholder: "For example: deep focused thinking, collaborating with smart people, building from scratch, teaching others…",
  },
];

// ── Types ──────────────────────────────────────────────────────────
interface Patterns {
  strengths: string[];
  curiosities: string[];
  energySources: string[];
  motivations: string[];
  values: string[];
  identityStatement: string;
}

interface ParsedPath {
  title: string;
  story: string;
  whyFit: string;
  whatPeopleDo: string[];
  skills: string[];
  experiments: string[];
}

// ── Parser ────────────────────────────────────────────────────────
function parseOutput(raw: string): { patterns: Patterns; paths: ParsedPath[] } {
  const extractSection = (text: string, header: string): string => {
    const idx = text.indexOf(`### ${header}`);
    if (idx === -1) return "";
    const after = text.slice(idx + header.length + 4).trim();
    const next = after.search(/^###/m);
    return (next === -1 ? after : after.slice(0, next)).trim();
  };

  const toBullets = (raw: string) =>
    raw.split("\n").map((s) => s.replace(/^[•\-*]\s*/, "").trim()).filter(Boolean);

  const toList = (raw: string) =>
    raw.split(",").map((s) => s.replace(/^[•\-*]\s*/, "").trim()).filter(Boolean);

  // Extract patterns section
  const patternsIdx = raw.indexOf("## PATTERNS");
  const firstPathIdx = raw.indexOf("## PATH:");
  const patternsBlock = patternsIdx !== -1
    ? raw.slice(patternsIdx, firstPathIdx !== -1 ? firstPathIdx : undefined)
    : "";

  const patterns: Patterns = {
    strengths: toBullets(extractSection(patternsBlock, "STRENGTHS")),
    curiosities: toBullets(extractSection(patternsBlock, "CURIOSITIES")),
    energySources: toBullets(extractSection(patternsBlock, "ENERGY_SOURCES")),
    motivations: toBullets(extractSection(patternsBlock, "MOTIVATIONS")),
    values: toBullets(extractSection(patternsBlock, "VALUES")),
    identityStatement: extractSection(patternsBlock, "IDENTITY_STATEMENT"),
  };

  // Extract paths
  const pathBlocks = raw.split(/^## PATH:/m).filter(Boolean);
  const paths: ParsedPath[] = pathBlocks.map((block) => {
    const lines = block.split("\n");
    const title = lines[0]?.trim() ?? "Untitled Path";
    return {
      title,
      story: extractSection(block, "STORY"),
      whyFit: extractSection(block, "WHY_FIT"),
      whatPeopleDo: toBullets(extractSection(block, "WHAT_PEOPLE_DO")),
      skills: toList(extractSection(block, "SKILLS")),
      experiments: toBullets(extractSection(block, "EXPERIMENTS")),
    };
  });

  return { patterns, paths };
}

// ── Streaming helper ──────────────────────────────────────────────
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

type Stage = "intro" | "questions" | "generating" | "patterns" | "paths" | "map";

// ── Pattern category config ───────────────────────────────────────
const patternCategories = [
  { key: "strengths",     label: "Natural Strengths",  icon: Star,      hsl: "var(--coral)",  bgAlpha: 0.1 },
  { key: "curiosities",   label: "Curiosity Signals",  icon: Lightbulb, hsl: "var(--amber)",  bgAlpha: 0.1 },
  { key: "energySources", label: "Energy Sources",     icon: Zap,       hsl: "var(--violet)", bgAlpha: 0.1 },
  { key: "motivations",   label: "Deep Motivations",   icon: Heart,     hsl: "var(--coral)",  bgAlpha: 0.08 },
  { key: "values",        label: "Core Values",        icon: Brain,     hsl: "var(--amber)",  bgAlpha: 0.08 },
] as const;

// ── Path accent colors ────────────────────────────────────────────
const pathColors = [
  { hsl: "var(--coral)",  gradFrom: "var(--coral)",  gradTo: "var(--peach)"  },
  { hsl: "var(--violet)", gradFrom: "var(--violet)", gradTo: "var(--coral)"  },
  { hsl: "var(--amber)",  gradFrom: "var(--amber)",  gradTo: "var(--coral)"  },
  { hsl: "var(--coral)",  gradFrom: "var(--coral)",  gradTo: "var(--violet)" },
];

// ── PatternCard ───────────────────────────────────────────────────
function PatternCard({
  category, items, delay,
}: {
  category: typeof patternCategories[number];
  items: string[];
  delay: number;
}) {
  const Icon = category.icon;
  return (
    <div
      className="rounded-2xl border p-5 animate-fade-up"
      style={{
        animationDelay: `${delay}ms`,
        background: `hsl(${category.hsl} / ${category.bgAlpha})`,
        borderColor: `hsl(${category.hsl} / 0.2)`,
      }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `hsl(${category.hsl} / 0.15)` }}>
          <Icon className="w-4 h-4" style={{ color: `hsl(${category.hsl})` }} />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest"
          style={{ color: `hsl(${category.hsl})` }}>
          {category.label}
        </p>
      </div>
      <ul className="space-y-2">
        {items.slice(0, 5).map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-foreground leading-relaxed">
            <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
              style={{ background: `hsl(${category.hsl} / 0.6)` }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── PathStoryCard ─────────────────────────────────────────────────
function PathStoryCard({
  path, index, isSelected, onSelect,
}: {
  path: ParsedPath;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [experimentsDone, setExperimentsDone] = useState<Set<number>>(new Set());
  const c = pathColors[index % pathColors.length];

  const toggleExperiment = (i: number) => {
    setExperimentsDone((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      if (!prev.has(i)) toast.success("Experiment logged!", { description: "You're building momentum." });
      return next;
    });
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-300 animate-fade-up"
      style={{
        animationDelay: `${index * 120}ms`,
        borderColor: isSelected ? `hsl(${c.hsl} / 0.4)` : `hsl(${c.hsl} / 0.18)`,
        background: isSelected
          ? `hsl(${c.hsl} / 0.07)`
          : `hsl(${c.hsl} / 0.04)`,
      }}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: `linear-gradient(135deg, hsl(${c.gradFrom}), hsl(${c.gradTo}))`,
            }}>
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: `hsl(${c.hsl})` }}>
              Path {index + 1}
            </p>
            <h3 className="text-xl font-bold text-foreground leading-tight">{path.title}</h3>
          </div>
        </div>

        {/* Story */}
        {path.story && (
          <p className="text-sm text-muted-foreground leading-relaxed italic mb-4 pl-1 border-l-2"
            style={{ borderColor: `hsl(${c.hsl} / 0.3)` }}>
            {path.story}
          </p>
        )}

        {/* Why fit */}
        {path.whyFit && (
          <div className="rounded-xl p-4 mb-4"
            style={{
              background: `hsl(${c.hsl} / 0.07)`,
              border: `1px solid hsl(${c.hsl} / 0.15)`,
            }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: `hsl(${c.hsl})` }}>
              Why this may fit you
            </p>
            <p className="text-sm text-foreground leading-relaxed">{path.whyFit}</p>
          </div>
        )}

        <Button
          size="sm"
          onClick={onSelect}
          className="gap-1.5 text-xs font-semibold transition-all hover:opacity-90 text-white"
          style={{ background: `linear-gradient(135deg, hsl(${c.gradFrom}), hsl(${c.gradTo}))` }}
        >
          {isSelected ? "Exploring this path ✓" : "Explore This Path"}
          {!isSelected && <ArrowRight className="w-3.5 h-3.5" />}
        </Button>
      </div>

      {/* Expanded detail */}
      {isSelected && (
        <div className="border-t px-6 pb-6 pt-5 space-y-6 animate-fade-in"
          style={{ borderColor: `hsl(${c.hsl} / 0.15)` }}>

          {/* What people do */}
          {path.whatPeopleDo.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-3.5 h-3.5" style={{ color: `hsl(${c.hsl})` }} />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  What People in This Path Do
                </span>
              </div>
              <ul className="space-y-2">
                {path.whatPeopleDo.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                      style={{ background: `hsl(${c.hsl} / 0.7)` }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {path.skills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-3.5 h-3.5" style={{ color: `hsl(${c.hsl})` }} />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Skills You'd Build
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {path.skills.map((skill) => (
                  <span key={skill}
                    className="text-xs px-3 py-1 rounded-full border text-foreground"
                    style={{
                      background: `hsl(${c.hsl} / 0.08)`,
                      borderColor: `hsl(${c.hsl} / 0.2)`,
                    }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Micro Experiments */}
          {path.experiments.length > 0 && (
            <div>
              <div className="rounded-xl p-5"
                style={{
                  background: "hsl(var(--surface-2))",
                  border: "1px solid hsl(var(--border))",
                }}>
                <div className="flex items-center gap-2 mb-1">
                  <FlaskConical className="w-3.5 h-3.5" style={{ color: `hsl(${c.hsl})` }} />
                  <span className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: `hsl(${c.hsl})` }}>
                    Try a Small Experiment
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-4 ml-5.5">
                  Test this direction before committing. Each takes less than an hour.
                </p>
                <div className="space-y-2">
                  {path.experiments.map((exp, i) => (
                    <button
                      key={i}
                      onClick={() => toggleExperiment(i)}
                      className="w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all hover:scale-[1.01]"
                      style={{
                        background: experimentsDone.has(i)
                          ? `hsl(${c.hsl} / 0.1)`
                          : "hsl(var(--surface-3))",
                        border: `1px solid ${experimentsDone.has(i) ? `hsl(${c.hsl} / 0.3)` : "transparent"}`,
                      }}
                    >
                      {experimentsDone.has(i)
                        ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: `hsl(${c.hsl})` }} />
                        : <Circle className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground/40" />
                      }
                      <p className={`text-sm leading-relaxed transition-colors ${
                        experimentsDone.has(i) ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {exp}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action links */}
          <div className="flex gap-2 flex-wrap">
            <Link to="/learn">
              <Button size="sm" variant="outline"
                className="gap-1.5 text-xs border-border hover:border-current transition-colors"
                style={{ color: `hsl(${c.hsl})` }}>
                <BookOpen className="w-3.5 h-3.5" />
                Find Learning Resources
              </Button>
            </Link>
            <Link to="/community">
              <Button size="sm" variant="outline"
                className="gap-1.5 text-xs border-border hover:border-current transition-colors"
                style={{ color: `hsl(${c.hsl})` }}>
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

// ── Path Map (visual) ────────────────────────────────────────────
function PathMap({ patterns, paths }: { patterns: Patterns; paths: ParsedPath[] }) {
  const patternItems = [
    ...patterns.strengths.slice(0, 2).map((s) => ({ text: s, hsl: "var(--coral)" })),
    ...patterns.curiosities.slice(0, 2).map((s) => ({ text: s, hsl: "var(--amber)" })),
    ...patterns.energySources.slice(0, 2).map((s) => ({ text: s, hsl: "var(--violet)" })),
    ...patterns.values.slice(0, 2).map((s) => ({ text: s, hsl: "var(--coral)" })),
  ];

  return (
    <div className="animate-fade-up">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-5 border"
          style={{ background: "hsl(var(--violet) / 0.08)", borderColor: "hsl(var(--violet) / 0.2)", color: "hsl(var(--violet))" }}>
          <Map className="w-3.5 h-3.5" />
          Your Path Map
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">See how everything connects</h2>
        <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
          Your patterns don't point to one destination — they open multiple doors. Here's how your identity connects to possible directions.
        </p>
      </div>

      <div className="relative">
        {/* Map layout */}
        <div className="grid md:grid-cols-3 gap-4 items-start">

          {/* Left: identity patterns */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 text-center">
              Who You Are
            </p>
            {patternItems.slice(0, 6).map((item, i) => (
              <div key={i} className="rounded-xl px-3 py-2.5 text-center animate-fade-up"
                style={{
                  animationDelay: `${i * 60}ms`,
                  background: `hsl(${item.hsl} / 0.07)`,
                  border: `1px solid hsl(${item.hsl} / 0.18)`,
                }}>
                <p className="text-xs text-foreground/80 leading-snug">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Center: connector node */}
          <div className="flex flex-col items-center justify-center py-4 md:py-8">
            {/* Connector lines (visual only) */}
            <div className="hidden md:flex flex-col items-center gap-1 mb-4 opacity-30">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-16 h-px"
                  style={{ background: "linear-gradient(90deg, hsl(var(--coral)), transparent)" }} />
              ))}
            </div>
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center relative"
              style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}>
              <Sparkles className="w-10 h-10 text-white" />
              <div className="absolute inset-0 rounded-3xl animate-pulse"
                style={{ background: "hsl(var(--violet) / 0.2)", boxShadow: "0 0 40px hsl(var(--violet) / 0.3)" }} />
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center font-medium">Your emerging identity</p>
            <div className="hidden md:flex flex-col items-center gap-1 mt-4 opacity-30">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-16 h-px"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(var(--coral)))" }} />
              ))}
            </div>
          </div>

          {/* Right: possible paths */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 text-center">
              Where It Can Lead
            </p>
            {paths.map((path, i) => {
              const c = pathColors[i % pathColors.length];
              return (
                <div key={i} className="rounded-xl px-3 py-2.5 text-center animate-fade-up"
                  style={{
                    animationDelay: `${i * 80}ms`,
                    background: `hsl(${c.hsl} / 0.07)`,
                    border: `1px solid hsl(${c.hsl} / 0.2)`,
                  }}>
                  <p className="text-xs font-semibold text-foreground leading-snug">{path.title}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Identity statement */}
        {patterns.identityStatement && (
          <div className="mt-8 rounded-2xl border p-6 text-center"
            style={{
              background: "hsl(var(--coral) / 0.05)",
              borderColor: "hsl(var(--coral) / 0.2)",
            }}>
            <Sparkles className="w-5 h-5 text-indigo-400 mx-auto mb-3" />
            <p className="text-base font-medium text-foreground leading-relaxed max-w-xl mx-auto">
              {patterns.identityStatement}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function PathFinder() {
  const [stage, setStage] = useState<Stage>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [rawOutput, setRawOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [patterns, setPatterns] = useState<Patterns | null>(null);
  const [paths, setPaths] = useState<ParsedPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<number | null>(null);
  const [fadeIn, setFadeIn] = useState(true);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const q = inputQuestions[current];
  const currentAnswer = answers[q?.id ?? ""] ?? "";
  const canContinue = currentAnswer.trim().length > 10;
  const isLast = current === inputQuestions.length - 1;
  const progressPct = ((current + 1) / inputQuestions.length) * 100;

  // When streaming completes, parse and move to patterns stage
  useEffect(() => {
    if (!isStreaming && rawOutput.length > 100 && stage === "generating") {
      const { patterns: p, paths: pa } = parseOutput(rawOutput);
      setPatterns(p);
      setPaths(pa);
      setStage("patterns");
    }
  }, [isStreaming, rawOutput, stage]);

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
        onDelta: (chunk) => { text += chunk; setRawOutput(text); },
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
    setRawOutput("");
    setPatterns(null);
    setPaths([]);
    setSelectedPath(null);
    setCurrent(0);
    setStage("intro");
  };

  // ── INTRO ────────────────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--violet) / 0.05)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--coral) / 0.04)" }} />
        </div>

        <div className="relative z-10 max-w-xl w-full text-center animate-fade-up">
          <Link to="/" className="inline-flex items-center gap-2 mb-10">
            <img src={navoLogo} alt="NAVO" className="w-7 h-7 rounded-lg object-contain" />
            <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
          </Link>

          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8"
            style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}>
            <Map className="w-10 h-10 text-white" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-8 border"
            style={{ background: "hsl(var(--violet) / 0.08)", borderColor: "hsl(var(--violet) / 0.2)", color: "hsl(var(--violet))" }}>
            <Sparkles className="w-3.5 h-3.5" />
            Path Finder · Core Intelligence
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight mb-6">
            Discover the paths<br />
            <span className="italic" style={{
              background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              aligned with who you are.
            </span>
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed mb-5 max-w-md mx-auto">
            Most people feel lost not because they lack potential — but because they lack clarity about themselves.
          </p>
          <p className="text-muted-foreground/70 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
            The Path Finder analyzes your patterns and surfaces directions you may never have considered. It doesn't tell you what to do — it helps you see what's possible.
          </p>

          {/* 3-step overview */}
          <div className="grid grid-cols-3 gap-3 mb-10 text-left">
            {[
              { step: "01", title: "Pattern Discovery", desc: "See the patterns that define who you are", hsl: "var(--coral)" },
              { step: "02", title: "Path Stories",       desc: "Explore directions as narratives, not job titles", hsl: "var(--violet)" },
              { step: "03", title: "Micro Experiments",  desc: "Test directions with small, low-pressure steps", hsl: "var(--amber)" },
            ].map((item) => (
              <div key={item.step} className="rounded-xl p-4"
                style={{ background: `hsl(${item.hsl} / 0.06)`, border: `1px solid hsl(${item.hsl} / 0.15)` }}>
                <p className="text-xs font-bold mb-1" style={{ color: `hsl(${item.hsl})` }}>{item.step}</p>
                <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={() => { setStage("questions"); setTimeout(() => textRef.current?.focus(), 100); }}
              className="text-white px-8 py-3 h-auto text-base font-semibold hover:opacity-90 gap-2"
              style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}
            >
              Begin My Discovery
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

  // ── GENERATING ───────────────────────────────────────────────────
  if (stage === "generating") {
    const loadingSteps = [
      "Reading your signals…",
      "Identifying your patterns…",
      "Mapping possible directions…",
      "Writing your path stories…",
    ];
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="text-center animate-fade-in space-y-6 max-w-sm">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto"
            style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}>
            <Map className="w-10 h-10 text-white animate-pulse" />
          </div>
          <div>
            <p className="text-foreground font-semibold text-xl mb-2">Discovering your paths…</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Reading everything you shared and finding the patterns only you have.
            </p>
          </div>
          <div className="space-y-2 text-left">
            {loadingSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground/60 animate-fade-up"
                style={{ animationDelay: `${i * 400}ms` }}>
                <div className="w-1.5 h-1.5 rounded-full"
                  style={{ background: `hsl(var(--violet) / 0.5)` }} />
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── QUESTIONS ────────────────────────────────────────────────────
  if (stage === "questions") {
    const Icon = q.icon;
    return (
      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--violet) / 0.05)" }} />
        </div>

        {/* Progress */}
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
            <img src={navoLogo} alt="NAVO" className="w-6 h-6 rounded-md object-contain" />
            <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
          </Link>
          <div className="text-xs text-muted-foreground">{current + 1} of {inputQuestions.length}</div>
          <button onClick={restart}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            Start over
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className={`w-full max-w-xl transition-all duration-300 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "hsl(var(--violet) / 0.12)" }}>
                <Icon className="w-4 h-4" style={{ color: "hsl(var(--violet))" }} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(var(--violet))" }}>
                {q.label}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3">{q.question}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{q.hint}</p>

            <textarea
              ref={textRef}
              value={currentAnswer}
              onChange={(e) => updateAnswer(e.target.value)}
              placeholder={q.placeholder}
              rows={5}
              className="w-full bg-surface-2 border border-border/60 rounded-xl p-4 text-sm text-foreground
                placeholder:text-muted-foreground/50 resize-none focus:outline-none transition-all leading-relaxed"
              style={{ outline: "none", boxShadow: "none" }}
              onFocus={(e) => { e.target.style.borderColor = "hsl(var(--violet) / 0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = ""; }}
              onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey && canContinue) next(); }}
            />
            <p className="text-xs text-muted-foreground/50 mt-2">⌘ + Enter to continue</p>

            <div className="flex gap-3 mt-6">
              {current > 0 && (
                <Button variant="outline" size="sm" onClick={prev}
                  className="gap-2 border-border text-muted-foreground">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </Button>
              )}
              <Button
                size="sm"
                disabled={!canContinue}
                onClick={next}
                className="gap-2 text-white font-semibold hover:opacity-90 disabled:opacity-30"
                style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}
              >
                {isLast ? "Reveal My Patterns & Paths" : "Next Question"}
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 pb-8 shrink-0">
          {inputQuestions.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i === current ? "hsl(var(--violet))" : i < current ? "hsl(var(--coral) / 0.6)" : "hsl(var(--border))",
                transform: i === current ? "scale(1.3)" : "scale(1)",
              }} />
          ))}
        </div>
      </div>
    );
  }

  // ── PATTERNS ─────────────────────────────────────────────────────
  if (stage === "patterns" && patterns) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--coral) / 0.04)" }} />
        </div>

        <div className="relative z-10 container max-w-2xl py-16 px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <img src={navoLogo} alt="NAVO" className="w-6 h-6 rounded-md object-contain" />
              <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-5 border"
              style={{ background: "hsl(var(--coral) / 0.08)", borderColor: "hsl(var(--coral) / 0.2)", color: "hsl(var(--coral))" }}>
              <Brain className="w-3.5 h-3.5" />
              Step 1 of 3 · Pattern Discovery
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
              Patterns we see in you
            </h1>
            <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
              These patterns emerged from what you shared. They're not labels — they're a lens for seeing yourself more clearly.
            </p>
          </div>

          {/* Identity statement */}
          {patterns.identityStatement && (
            <div className="rounded-2xl border p-6 mb-8 text-center animate-fade-up"
              style={{
                background: "hsl(var(--coral) / 0.06)",
                borderColor: "hsl(var(--coral) / 0.2)",
              }}>
              <Sparkles className="w-5 h-5 text-indigo-400 mx-auto mb-3" />
              <p className="text-base font-medium text-foreground leading-relaxed">{patterns.identityStatement}</p>
            </div>
          )}

          {/* Pattern cards grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {patternCategories.map((cat, i) => (
              <PatternCard
                key={cat.key}
                category={cat}
                items={patterns[cat.key] as string[]}
                delay={i * 80}
              />
            ))}
          </div>

          {/* CTA to paths */}
          <div className="text-center animate-fade-up" style={{ animationDelay: "400ms" }}>
            <p className="text-sm text-muted-foreground mb-6">
              Now let's explore the directions that match these patterns.
            </p>
            <Button
              onClick={() => setStage("paths")}
              className="text-white px-8 py-3 h-auto text-base font-semibold hover:opacity-90 gap-2"
              style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}
            >
              See My Paths
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── PATHS ────────────────────────────────────────────────────────
  if (stage === "paths" && paths.length > 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--violet) / 0.04)" }} />
        </div>

        <div className="relative z-10 container max-w-2xl py-16 px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <img src={navoLogo} alt="NAVO" className="w-6 h-6 rounded-md object-contain" />
              <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-5 border"
              style={{ background: "hsl(var(--violet) / 0.08)", borderColor: "hsl(var(--violet) / 0.2)", color: "hsl(var(--violet))" }}>
              <Compass className="w-3.5 h-3.5" />
              Step 2 of 3 · Path Stories
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
              Possible directions to explore
            </h1>
            <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
              These aren't prescriptions — they're invitations. Explore each one, then test the ones that resonate.
            </p>
          </div>

          {/* Path story cards */}
          <div className="space-y-4 mb-10">
            {paths.map((path, i) => (
              <PathStoryCard
                key={i}
                path={path}
                index={i}
                isSelected={selectedPath === i}
                onSelect={() => setSelectedPath(selectedPath === i ? null : i)}
              />
            ))}
          </div>

          {/* Psychological note */}
          <div className="rounded-2xl border border-border/40 p-6 text-center mb-8 animate-fade-up bg-gradient-card"
            style={{ animationDelay: "400ms" }}>
            <p className="text-sm font-semibold text-foreground mb-2">You have more options than you realize.</p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              You don't have to choose one path. You can explore multiple directions, combine elements, or build something entirely your own.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up"
            style={{ animationDelay: "500ms" }}>
            <Button
              variant="outline"
              className="gap-2 border-border text-muted-foreground hover:text-foreground"
              onClick={() => setStage("patterns")}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Patterns
            </Button>
            <Button
              onClick={() => setStage("map")}
              className="gap-2 text-white font-semibold hover:opacity-90"
              style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}
            >
              See My Path Map
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAP ──────────────────────────────────────────────────────────
  if (stage === "map" && patterns && paths.length > 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--violet) / 0.04)" }} />
        </div>

        <div className="relative z-10 container max-w-3xl py-16 px-6">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <Link to="/" className="flex items-center gap-2">
              <img src={navoLogo} alt="NAVO" className="w-6 h-6 rounded-md object-contain" />
              <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
            </Link>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-10 border mx-auto flex w-fit"
            style={{ background: "hsl(var(--amber) / 0.08)", borderColor: "hsl(var(--amber) / 0.2)", color: "hsl(var(--amber))" }}>
            <Map className="w-3.5 h-3.5" />
            Step 3 of 3 · Your Path Map
          </div>

          <PathMap patterns={patterns} paths={paths} />

          {/* Action bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-12 animate-fade-up">
            <Button
              onClick={restart}
              variant="outline"
              className="gap-2 border-border text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Explore different answers
            </Button>
            <Button
              onClick={() => setStage("paths")}
              variant="outline"
              className="gap-2 border-border text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Paths
            </Button>
            <Link to="/dashboard">
              <Button className="gap-2 text-white font-semibold hover:opacity-90 w-full sm:w-auto"
                style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}>
                Back to Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fallback loading
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "hsl(var(--violet))", animationDelay: `${i * 200}ms` }} />
        ))}
      </div>
    </div>
  );
}
