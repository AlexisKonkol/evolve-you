import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, ArrowLeft, Sparkles, RefreshCw,
  Sun, Zap, Star, Brain, Clock, TrendingUp,
  HelpCircle, Plus, X, ChevronDown, ChevronUp, Eye,
} from "lucide-react";
import navoLogo from "@/assets/navo-logo";
import { toast } from "sonner";

const FUTURE_YOU_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/future-you`;

// ── Sample paths to explore ─────────────────────────────────────────
const samplePaths = [
  { title: "AI Product Builder",       icon: Brain,     hsl: "var(--coral)",  desc: "Design tools that use AI to solve real problems" },
  { title: "Learning Experience Designer", icon: Star,  hsl: "var(--amber)",  desc: "Shape how people grow and develop skills" },
  { title: "Startup Operator",         icon: Zap,       hsl: "var(--violet)", desc: "Build something from nothing with a small team" },
  { title: "Community Architect",      icon: Sun,       hsl: "var(--coral)",  desc: "Create spaces where people connect and grow" },
  { title: "Strategic Consultant",     icon: TrendingUp,hsl: "var(--amber)",  desc: "Help organisations solve complex challenges" },
  { title: "Independent Creator",      icon: Sparkles,  hsl: "var(--violet)", desc: "Build an audience around ideas and craft" },
];

// ── Types ──────────────────────────────────────────────────────────
interface FutureProfile {
  pathTitle: string;
  hsl: string;
  whoYouBecome: string[];
  dayInLife: string;
  skillsYouBuild: string[];
  oneYear: string[];
  identityShift: string;
  questionsToSitWith: string[];
  raw: string;
}

// ── Parser ────────────────────────────────────────────────────────
function parseProfile(raw: string, pathTitle: string, hsl: string): FutureProfile {
  const extractSection = (text: string, header: string): string => {
    const idx = text.indexOf(`## ${header}`);
    if (idx === -1) return "";
    const after = text.slice(idx + header.length + 3).trim();
    const next = after.search(/^## /m);
    return (next === -1 ? after : after.slice(0, next)).trim();
  };

  const toBullets = (raw: string) =>
    raw.split("\n").map((s) => s.replace(/^[•\-*]\s*/, "").trim()).filter(Boolean);

  const toList = (raw: string) =>
    raw.split(",").map((s) => s.replace(/^[•\-*]\s*/, "").trim()).filter(Boolean);

  return {
    pathTitle,
    hsl,
    whoYouBecome: toBullets(extractSection(raw, "WHO_YOU_BECOME")),
    dayInLife: extractSection(raw, "DAY_IN_LIFE"),
    skillsYouBuild: toList(extractSection(raw, "SKILLS_YOU_BUILD")),
    oneYear: toBullets(extractSection(raw, "ONE_YEAR")),
    identityShift: extractSection(raw, "IDENTITY_SHIFT"),
    questionsToSitWith: toBullets(extractSection(raw, "QUESTIONS_TO_SIT_WITH")),
    raw,
  };
}

// ── Streaming helper ──────────────────────────────────────────────
async function streamProfile({
  pathTitle, whyFit, onDelta, onDone, onError,
}: {
  pathTitle: string;
  whyFit?: string;
  onDelta: (chunk: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const resp = await fetch(FUTURE_YOU_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ pathTitle, whyFit }),
  });

  if (!resp.ok || !resp.body) {
    const data = await resp.json().catch(() => ({}));
    onError((data as { error?: string }).error ?? "Could not generate your future profile. Please try again.");
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

type Stage = "intro" | "select" | "generating" | "profile" | "map";

// ── Future Profile Card ────────────────────────────────────────────
function FutureProfileCard({ profile, compact = false }: { profile: FutureProfile; compact?: boolean }) {
  const [expanded, setExpanded] = useState(!compact);

  const sectionConfig = [
    {
      key: "dayInLife",
      label: "A Day in Your Future Life",
      icon: Sun,
      content: profile.dayInLife,
      type: "paragraph" as const,
    },
    {
      key: "skillsYouBuild",
      label: "Skills You'd Build",
      icon: Zap,
      content: profile.skillsYouBuild,
      type: "chips" as const,
    },
    {
      key: "oneYear",
      label: "One Year From Now",
      icon: TrendingUp,
      content: profile.oneYear,
      type: "bullets" as const,
    },
    {
      key: "questionsToSitWith",
      label: "Questions Worth Sitting With",
      icon: HelpCircle,
      content: profile.questionsToSitWith,
      type: "bullets" as const,
    },
  ];

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{
        background: `hsl(${profile.hsl} / 0.05)`,
        borderColor: `hsl(${profile.hsl} / 0.2)`,
      }}>
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: `hsl(${profile.hsl} / 0.2)` }}>
            <Eye className="w-5 h-5" style={{ color: `hsl(${profile.hsl})` }} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: `hsl(${profile.hsl})` }}>
              Future You
            </p>
            <h3 className="text-xl font-bold text-foreground">{profile.pathTitle}</h3>
          </div>
        </div>

        {/* Who you become */}
        {profile.whoYouBecome.length > 0 && (
          <div className="rounded-xl p-4 mb-4"
            style={{ background: `hsl(${profile.hsl} / 0.08)`, border: `1px solid hsl(${profile.hsl} / 0.15)` }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: `hsl(${profile.hsl})` }}>
              If you pursue this path, you could become someone who…
            </p>
            <ul className="space-y-2">
              {profile.whoYouBecome.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                    style={{ background: `hsl(${profile.hsl} / 0.7)` }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Identity shift */}
        {profile.identityShift && (
          <blockquote className="border-l-2 pl-4 italic text-sm text-muted-foreground leading-relaxed mb-4"
            style={{ borderColor: `hsl(${profile.hsl} / 0.4)` }}>
            {profile.identityShift}
          </blockquote>
        )}

        {compact && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
            style={{ color: `hsl(${profile.hsl})` }}
          >
            {expanded ? "Show less" : "See full profile"}
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Expanded sections */}
      {expanded && (
        <div className="border-t px-6 pb-6 pt-5 space-y-6 animate-fade-in"
          style={{ borderColor: `hsl(${profile.hsl} / 0.15)` }}>
          {sectionConfig.map((section) => {
            const Icon = section.icon;
            const isEmpty = Array.isArray(section.content)
              ? section.content.length === 0
              : !section.content;
            if (isEmpty) return null;

            return (
              <div key={section.key}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-3.5 h-3.5" style={{ color: `hsl(${profile.hsl})` }} />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {section.label}
                  </span>
                </div>

                {section.type === "paragraph" && (
                  <p className="text-sm text-foreground leading-relaxed">{section.content as string}</p>
                )}

                {section.type === "chips" && (
                  <div className="flex flex-wrap gap-2">
                    {(section.content as string[]).map((item) => (
                      <span key={item}
                        className="text-xs px-3 py-1 rounded-full border text-foreground"
                        style={{ background: `hsl(${profile.hsl} / 0.08)`, borderColor: `hsl(${profile.hsl} / 0.2)` }}>
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {section.type === "bullets" && (
                  <ul className="space-y-2">
                    {(section.content as string[]).map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed"
                        style={{
                          color: section.key === "questionsToSitWith"
                            ? "hsl(var(--muted-foreground))"
                            : "hsl(var(--foreground) / 0.85)",
                        }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                          style={{ background: `hsl(${profile.hsl} / 0.6)` }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Visual Future Map ─────────────────────────────────────────────
function FutureMap({ profiles }: { profiles: FutureProfile[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div>
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-5 border"
          style={{ background: "hsl(var(--amber) / 0.08)", borderColor: "hsl(var(--amber) / 0.2)", color: "hsl(var(--amber))" }}>
          <Eye className="w-3.5 h-3.5" />
          Your Possible Futures
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Multiple futures, all yours to explore
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
          You don't have to pick one. These are possibilities — starting points, not destinations. Tap any path to revisit its profile.
        </p>
      </div>

      {/* Map visualization */}
      <div className="relative">
        {/* Timeline spine */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-0">

          {/* "Now" node */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10"
              style={{ background: "hsl(var(--surface-2))", border: "2px solid hsl(var(--border))" }}>
              <Star className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">You, Now</p>
          </div>

          {/* Arrow / connector */}
          <div className="hidden md:flex flex-col items-center flex-1 px-4">
            <div className="w-full h-0.5 relative"
              style={{ background: "linear-gradient(90deg, hsl(var(--border)), hsl(var(--border) / 0))" }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-lg">→</div>
            </div>
            <p className="text-xs text-muted-foreground/50 mt-1">explore →</p>
          </div>
          <div className="md:hidden text-muted-foreground/40 text-2xl">↓</div>

          {/* Future path nodes */}
          <div className="flex flex-col md:flex-row gap-3 flex-1">
            {profiles.map((p, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(activeIdx === i ? null : i)}
                className="flex-1 rounded-2xl border p-4 text-left transition-all hover:scale-[1.02] animate-fade-up"
                style={{
                  animationDelay: `${i * 80}ms`,
                  background: activeIdx === i ? `hsl(${p.hsl} / 0.1)` : `hsl(${p.hsl} / 0.05)`,
                  borderColor: activeIdx === i ? `hsl(${p.hsl} / 0.4)` : `hsl(${p.hsl} / 0.18)`,
                }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `hsl(${p.hsl} / 0.15)` }}>
                  <Eye className="w-4 h-4" style={{ color: `hsl(${p.hsl})` }} />
                </div>
                <p className="text-sm font-semibold text-foreground leading-tight mb-1">{p.pathTitle}</p>
                <p className="text-xs text-muted-foreground/70">Future version</p>
                {activeIdx === i && (
                  <p className="text-xs font-semibold mt-2" style={{ color: `hsl(${p.hsl})` }}>
                    Viewing ↓
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Expanded profile below */}
        {activeIdx !== null && (
          <div className="mt-8 animate-fade-in">
            <FutureProfileCard profile={profiles[activeIdx]} compact />
          </div>
        )}
      </div>

      {/* Core message */}
      <div className="mt-10 rounded-2xl border border-border/40 p-6 text-center bg-gradient-card">
        <p className="text-sm font-semibold text-foreground mb-2">
          The future is not something you wait for.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          It is something you design — through the paths you explore, the experiments you try, and the version of yourself you choose to grow into.
        </p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function FutureYou() {
  const [stage, setStage] = useState<Stage>("intro");
  const [selectedPath, setSelectedPath] = useState<{ title: string; hsl: string } | null>(null);
  const [customPath, setCustomPath] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [rawOutput, setRawOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [profiles, setProfiles] = useState<FutureProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<FutureProfile | null>(null);
  const customRef = useRef<HTMLInputElement>(null);

  const generateProfile = async (pathTitle: string, hsl: string) => {
    setStage("generating");
    let text = "";
    setIsStreaming(true);
    setRawOutput("");

    try {
      await streamProfile({
        pathTitle,
        onDelta: (chunk) => { text += chunk; setRawOutput(text); },
        onDone: () => {
          setIsStreaming(false);
          const profile = parseProfile(text, pathTitle, hsl);
          setCurrentProfile(profile);
          setProfiles((prev) => {
            // Replace if already explored same path, otherwise add
            const idx = prev.findIndex((p) => p.pathTitle === pathTitle);
            if (idx !== -1) {
              const next = [...prev];
              next[idx] = profile;
              return next;
            }
            return [...prev, profile];
          });
          setStage("profile");
        },
        onError: (msg) => {
          setIsStreaming(false);
          toast.error(msg);
          setStage("select");
        },
      });
    } catch {
      setIsStreaming(false);
      toast.error("Connection error. Please try again.");
      setStage("select");
    }
  };

  const handlePathSelect = (path: typeof samplePaths[0]) => {
    setSelectedPath({ title: path.title, hsl: path.hsl });
    generateProfile(path.title, path.hsl);
  };

  const handleCustomSubmit = () => {
    const title = customPath.trim();
    if (title.length < 3) return;
    setSelectedPath({ title, hsl: "var(--violet)" });
    generateProfile(title, "var(--violet)");
  };

  // ── INTRO ──────────────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--amber) / 0.05)" }} />
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[400px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--coral) / 0.04)" }} />
        </div>

        <div className="relative z-10 max-w-xl w-full text-center animate-fade-up">
          <Link to="/" className="inline-flex items-center gap-2 mb-10">
            <img src={navoLogo} alt="NAVO" className="w-7 h-7 rounded-lg object-contain" />
            <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
          </Link>

          {/* Icon */}
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8"
            style={{ background: "linear-gradient(135deg, hsl(var(--amber)), hsl(var(--coral)))" }}>
            <Sun className="w-10 h-10 text-white" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-8 border"
            style={{ background: "hsl(var(--amber) / 0.08)", borderColor: "hsl(var(--amber) / 0.2)", color: "hsl(var(--amber))" }}>
            <Eye className="w-3.5 h-3.5" />
            Future You · Visualize Your Possibilities
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight mb-6">
            Your future is<br />
            <span className="italic" style={{
              background: "linear-gradient(135deg, hsl(var(--amber)), hsl(var(--coral)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              not fixed.
            </span>
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed mb-5 max-w-md mx-auto">
            Every path you explore leads to a different version of who you could become.
          </p>
          <p className="text-muted-foreground/70 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
            Future You helps you imagine those possibilities — not as predictions, but as invitations. When you can see a future version of yourself, you can begin moving toward it.
          </p>

          {/* What you'll see */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 text-left">
            {[
              { label: "Who You Could Become",  icon: Star,       hsl: "var(--coral)"  },
              { label: "A Day in That Future",   icon: Sun,        hsl: "var(--amber)"  },
              { label: "Skills You'd Build",     icon: Zap,        hsl: "var(--violet)" },
              { label: "One Year Out",           icon: TrendingUp, hsl: "var(--amber)"  },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-xl p-3 text-center"
                  style={{ background: `hsl(${item.hsl} / 0.07)`, border: `1px solid hsl(${item.hsl} / 0.15)` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                    style={{ background: `hsl(${item.hsl} / 0.15)` }}>
                    <Icon className="w-4 h-4" style={{ color: `hsl(${item.hsl})` }} />
                  </div>
                  <p className="text-xs font-medium text-foreground leading-tight">{item.label}</p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={() => setStage("select")}
              className="text-white px-8 py-3 h-auto text-base font-semibold hover:opacity-90 gap-2"
              style={{ background: "linear-gradient(135deg, hsl(var(--amber)), hsl(var(--coral)))" }}
            >
              Explore My Futures
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

  // ── GENERATING ─────────────────────────────────────────────────
  if (stage === "generating") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="text-center animate-fade-in space-y-6 max-w-sm">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto"
            style={{ background: "linear-gradient(135deg, hsl(var(--amber)), hsl(var(--coral)))" }}>
            <Sun className="w-10 h-10 text-white animate-pulse" />
          </div>
          <div>
            <p className="text-foreground font-semibold text-xl mb-2">
              Imagining your future as a <span className="italic" style={{ color: "hsl(var(--amber))" }}>
                {selectedPath?.title}
              </span>…
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Creating a vivid, honest picture of what this version of you could look like.
            </p>
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

  // ── PATH SELECTION ─────────────────────────────────────────────
  if (stage === "select") {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--amber) / 0.05)" }} />
        </div>

        <div className="relative z-10 container max-w-2xl py-16 px-6">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-up">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <img src={navoLogo} alt="NAVO" className="w-6 h-6 rounded-md object-contain" />
              <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-5 border"
              style={{ background: "hsl(var(--amber) / 0.08)", borderColor: "hsl(var(--amber) / 0.2)", color: "hsl(var(--amber))" }}>
              <Eye className="w-3.5 h-3.5" />
              Choose a direction to imagine
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
              Which future would you like to explore?
            </h1>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
              Pick a path to see who you could become. You can explore as many as you like.
            </p>
            {profiles.length > 0 && (
              <button
                onClick={() => setStage("map")}
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium transition-colors"
                style={{ color: "hsl(var(--amber))" }}>
                View your {profiles.length} explored future{profiles.length > 1 ? "s" : ""} →
              </button>
            )}
          </div>

          {/* Sample path cards */}
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {samplePaths.map((path, i) => {
              const Icon = path.icon;
              const alreadyExplored = profiles.some((p) => p.pathTitle === path.title);
              return (
                <button
                  key={path.title}
                  onClick={() => handlePathSelect(path)}
                  className="text-left rounded-2xl border p-5 transition-all hover:scale-[1.02] animate-fade-up group"
                  style={{
                    animationDelay: `${i * 60}ms`,
                    background: `hsl(${path.hsl} / 0.05)`,
                    borderColor: `hsl(${path.hsl} / 0.18)`,
                  }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                      style={{ background: `hsl(${path.hsl} / 0.15)` }}>
                      <Icon className="w-5 h-5" style={{ color: `hsl(${path.hsl})` }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{path.title}</p>
                        {alreadyExplored && (
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: `hsl(${path.hsl} / 0.15)`, color: `hsl(${path.hsl})` }}>
                            Explored ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{path.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-current transition-colors mt-0.5 shrink-0"
                      style={{ color: alreadyExplored ? `hsl(${path.hsl} / 0.5)` : undefined }} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom path */}
          <div className="rounded-2xl border border-border/50 p-5 bg-gradient-card">
            <button
              onClick={() => { setShowCustomInput(true); setTimeout(() => customRef.current?.focus(), 50); }}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full text-left">
              <Plus className="w-4 h-4" />
              Imagine a different path — type your own direction
            </button>
            {showCustomInput && (
              <div className="mt-3 flex gap-2 animate-fade-in">
                <input
                  ref={customRef}
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  placeholder="e.g. UX researcher, solo founder, educator…"
                  className="flex-1 bg-surface-2 border border-border/60 rounded-lg px-3 py-2 text-sm text-foreground
                    placeholder:text-muted-foreground/50 focus:outline-none"
                  onFocus={(e) => { e.target.style.borderColor = "hsl(var(--amber) / 0.5)"; }}
                  onBlur={(e) => { e.target.style.borderColor = ""; }}
                  onKeyDown={(e) => { if (e.key === "Enter" && customPath.trim().length >= 3) handleCustomSubmit(); }}
                />
                <Button
                  size="sm"
                  disabled={customPath.trim().length < 3}
                  onClick={handleCustomSubmit}
                  className="text-white shrink-0 hover:opacity-90 disabled:opacity-30"
                  style={{ background: "linear-gradient(135deg, hsl(var(--amber)), hsl(var(--coral)))" }}>
                  Explore
                </Button>
                <button onClick={() => { setShowCustomInput(false); setCustomPath(""); }}
                  className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Nav */}
          <div className="flex justify-center gap-3 mt-8">
            <Button variant="outline" size="sm"
              className="gap-2 border-border text-muted-foreground hover:text-foreground"
              onClick={() => setStage("intro")}>
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </Button>
            {profiles.length > 0 && (
              <Button size="sm"
                className="gap-2 text-white hover:opacity-90"
                style={{ background: "linear-gradient(135deg, hsl(var(--amber)), hsl(var(--coral)))" }}
                onClick={() => setStage("map")}>
                View Future Map
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── PROFILE ────────────────────────────────────────────────────
  if (stage === "profile" && currentProfile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--amber) / 0.04)" }} />
        </div>

        <div className="relative z-10 container max-w-2xl py-16 px-6">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-up">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <img src={navoLogo} alt="NAVO" className="w-6 h-6 rounded-md object-contain" />
              <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
            </Link>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "linear-gradient(135deg, hsl(var(--amber)), hsl(var(--coral)))" }}>
              <Sun className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2">
              A possible future version of you
            </h1>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Not a prediction. An invitation to imagine.
            </p>
          </div>

          {/* Full profile */}
          <div className="mb-8 animate-fade-up">
            <FutureProfileCard profile={currentProfile} />
          </div>

          {/* Action bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up"
            style={{ animationDelay: "200ms" }}>
            <Button variant="outline"
              className="gap-2 border-border text-muted-foreground hover:text-foreground"
              onClick={() => setStage("select")}>
              <ArrowLeft className="w-3.5 h-3.5" />
              Explore another path
            </Button>
            {profiles.length > 1 && (
              <Button
                className="gap-2 text-white font-semibold hover:opacity-90"
                style={{ background: "linear-gradient(135deg, hsl(var(--amber)), hsl(var(--coral)))" }}
                onClick={() => setStage("map")}>
                See Future Map ({profiles.length} paths)
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )}
            <Link to="/dashboard">
              <Button variant="outline"
                className="gap-2 border-border text-muted-foreground hover:text-foreground w-full sm:w-auto">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── MAP ────────────────────────────────────────────────────────
  if (stage === "map") {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-3xl"
            style={{ background: "hsl(var(--amber) / 0.04)" }} />
        </div>

        <div className="relative z-10 container max-w-3xl py-16 px-6">
          <div className="flex justify-center mb-10">
            <Link to="/" className="flex items-center gap-2">
              <img src={navoLogo} alt="NAVO" className="w-6 h-6 rounded-md object-contain" />
              <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
            </Link>
          </div>

          <FutureMap profiles={profiles} />

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <Button variant="outline"
              className="gap-2 border-border text-muted-foreground hover:text-foreground"
              onClick={() => setStage("select")}>
              <Plus className="w-3.5 h-3.5" />
              Explore another path
            </Button>
            <Link to="/path-finder">
              <Button variant="outline"
                className="gap-2 border-border hover:border-current transition-colors w-full sm:w-auto"
                style={{ color: "hsl(var(--violet))" }}>
                Discover more paths →
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                className="gap-2 text-white font-semibold hover:opacity-90 w-full sm:w-auto"
                style={{ background: "linear-gradient(135deg, hsl(var(--amber)), hsl(var(--coral)))" }}>
                Back to Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
