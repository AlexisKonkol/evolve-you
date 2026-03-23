import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Sparkles, ArrowRight, Copy, Check, Share2, Heart,
  Eye, Flame, Compass, ChevronDown, RotateCcw, ArrowUpRight,
  Star, Shield, Lightbulb, Wind, Moon, Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/* ── Types ───────────────────────────────────────────────────────── */
interface IdentityProfileData {
  archetype: { name: string; tagline: string; description: string; rarity: string };
  coreDrivers: { name: string; description: string; signal: string }[];
  hiddenStrengths: { strength: string; insight: string; unlocks: string }[];
  environmentFit: { thrive: string[]; drain: string[]; workStyle: string };
  pathDirections: { title: string; description: string; alignment: number; firstStep: string }[];
  mirrorMoment: string;
  curiosityThread: string;
  identityNarrative: string;
  displacementStory?: string;
}

/* ── Archetype color map ─────────────────────────────────────────── */
const archetypeAccent = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("builder") || n.includes("maker"))  return { color: "coral",  cssVar: "--coral"  };
  if (n.includes("strategist") || n.includes("architect")) return { color: "violet", cssVar: "--violet" };
  if (n.includes("connector") || n.includes("guide")) return { color: "peach",  cssVar: "--peach"  };
  if (n.includes("explorer") || n.includes("seeker")) return { color: "amber",  cssVar: "--amber"  };
  if (n.includes("healer") || n.includes("nurturer")) return { color: "rose",   cssVar: "--rose"   };
  if (n.includes("educator") || n.includes("teacher"))return { color: "violet", cssVar: "--violet" };
  return { color: "coral", cssVar: "--coral" };
};

/* ── Shimmer loading ─────────────────────────────────────────────── */
function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl animate-pulse ${className}`}
      style={{ background: "hsl(var(--surface-2))" }}
    />
  );
}

/* ── Section reveal wrapper ──────────────────────────────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
        { threshold: 0.1 }
      );
      if (ref.current) obs.observe(ref.current);
      return () => obs.disconnect();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Alignment bar ───────────────────────────────────────────────── */
function AlignmentBar({ value, cssVar }: { value: number; cssVar: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(value), 400); return () => clearTimeout(t); }, [value]);
  return (
    <div className="h-1.5 bg-border rounded-full overflow-hidden mt-2">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%`, background: `hsl(var(${cssVar}))` }}
      />
    </div>
  );
}

/* ── Mirror moment reveal ────────────────────────────────────────── */
function MirrorMoment({ text }: { text: string }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Copied — share this insight.", { icon: "✨" });
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden border"
      style={{
        background: "linear-gradient(135deg, hsl(var(--surface-1)), hsl(20 14% 11%))",
        borderColor: "hsl(var(--coral) / 0.25)",
      }}
    >
      {/* Glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--coral) / 0.08), transparent)" }}
      />
      <div className="relative p-6 md:p-8">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-gradient-coral flex items-center justify-center glow-coral">
            <Eye className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Mirror Moment</p>
            <p className="text-xs text-muted-foreground">The insight we think you've been waiting to hear</p>
          </div>
        </div>

        {!revealed ? (
          <div className="text-center py-8">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: "hsl(var(--coral) / 0.1)", border: "1px solid hsl(var(--coral) / 0.2)" }}
            >
              <Eye className="w-7 h-7 text-indigo-400" />
            </div>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
              Your most powerful insight is ready. This is the part most people screenshot.
            </p>
            <Button
              onClick={() => setRevealed(true)}
              className="bg-gradient-coral text-primary-foreground font-semibold px-8 py-5 rounded-xl glow-coral hover:opacity-90 gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Reveal my mirror moment
            </Button>
          </div>
        ) : (
          <div className="animate-fade-up">
            <blockquote
              className="text-lg md:text-xl font-medium text-foreground leading-relaxed mb-6 italic"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              "{text}"
            </blockquote>
            <div className="flex gap-2">
              <Button
                onClick={copy}
                size="sm"
                className="gap-2 text-xs font-semibold"
                style={{
                  background: "hsl(var(--coral) / 0.1)",
                  border: "1px solid hsl(var(--coral) / 0.25)",
                  color: "hsl(var(--coral))",
                }}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy to share"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Shareable card ──────────────────────────────────────────────── */
function ShareCard({ profile }: { profile: IdentityProfileData }) {
  const [copied, setCopied] = useState(false);
  const accent = archetypeAccent(profile.archetype.name);

  const shareText = `My NAVO identity: ${profile.archetype.name}\n\n"${profile.archetype.tagline}"\n\nMirror moment: "${profile.mirrorMoment.slice(0, 120)}..."\n\nDiscover yours at navo.app`;

  const copy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      toast.success("Copied! Your friends need to see this.", { icon: "🔥" });
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{
        background: "linear-gradient(135deg, hsl(var(--surface-1)), hsl(20 14% 11%))",
        borderColor: `hsl(var(${accent.cssVar}) / 0.25)`,
      }}
    >
      {/* Card preview */}
      <div
        className="relative p-6 overflow-hidden"
        style={{ background: `radial-gradient(ellipse 70% 50% at 80% 20%, hsl(var(${accent.cssVar}) / 0.1), transparent)` }}
      >
        {/* NAVO mark */}
        <div className="flex items-center gap-1.5 mb-5">
          <div className="w-5 h-5 rounded-md bg-gradient-coral flex items-center justify-center">
            <Flame className="w-2.5 h-2.5 text-primary-foreground" />
          </div>
          <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">NAVO · Identity Profile</span>
        </div>

        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `hsl(var(${accent.cssVar}))` }}>
          My Identity Archetype
        </p>
        <h3 className="text-2xl font-bold text-foreground mb-1">{profile.archetype.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-sm italic">"{profile.archetype.tagline}"</p>

        {/* Top drivers */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {profile.coreDrivers.map((d) => (
            <span
              key={d.name}
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                background: `hsl(var(${accent.cssVar}) / 0.1)`,
                color: `hsl(var(${accent.cssVar}))`,
                border: `1px solid hsl(var(${accent.cssVar}) / 0.2)`,
              }}
            >
              {d.name}
            </span>
          ))}
        </div>

        {/* Rarity */}
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            background: "hsl(var(--amber) / 0.1)",
            border: "1px solid hsl(var(--amber) / 0.2)",
            color: "hsl(var(--amber))",
          }}
        >
          <Star className="w-3 h-3" />
          {profile.archetype.rarity}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 pt-2 space-y-2">
        <Button
          onClick={copy}
          className="w-full gap-2 text-xs font-semibold"
          style={{
            background: `hsl(var(${accent.cssVar}) / 0.1)`,
            border: `1px solid hsl(var(${accent.cssVar}) / 0.25)`,
            color: `hsl(var(${accent.cssVar}))`,
          }}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Share my identity profile"}
        </Button>
        <p className="text-center text-xs text-muted-foreground/40">
          Your profile evolves as you discover more.
        </p>
      </div>
    </div>
  );
}

/* ── Loading screen ──────────────────────────────────────────────── */
function LoadingProfile() {
  const [stage, setStage] = useState(0);
  const stages = [
    "Reading your energy patterns…",
    "Mapping your curiosity threads…",
    "Identifying hidden strengths…",
    "Surfacing your path directions…",
    "Writing your identity narrative…",
    "Almost ready…",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((s) => (s < stages.length - 1 ? s + 1 : s));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* Pulsing orb */}
      <div className="relative mb-12">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: "hsl(var(--coral) / 0.12)", border: "1px solid hsl(var(--coral) / 0.2)" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "hsl(var(--coral) / 0.2)" }}
          >
            <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
        </div>
        {/* Rings */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border animate-ping"
            style={{
              borderColor: `hsl(var(--coral) / ${0.15 / i})`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: "2.5s",
            }}
          />
        ))}
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-3 text-center">
        Building your identity profile
      </h2>
      <p
        className="text-muted-foreground text-sm mb-10 text-center transition-all duration-500"
        key={stage}
        style={{ animation: "fadeIn 0.5s ease both" }}
      >
        {stages[stage]}
      </p>

      {/* Progress indicators */}
      <div className="flex gap-2">
        {stages.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-500"
            style={{
              width: i === stage ? "24px" : "8px",
              height: "8px",
              background: i <= stage ? "hsl(var(--coral))" : "hsl(var(--border))",
            }}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground/40 mt-10 italic">
        We're synthesizing 6 dimensions of who you are
      </p>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────── */
export default function IdentityProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<IdentityProfileData | null>(null);

  const answers = (location.state as { answers?: Record<string, string[]> })?.answers;

  useEffect(() => {
    if (!answers) {
      // Demo mode: use sample answers
      fetchProfile({
        energized: ["When I'm bringing order to chaos"],
        problems: ["How systems work and why they break"],
        flow: ["Building, coding, or making things work", "Learning something new and connecting dots"],
        proud: ["When I built or shipped something real"],
        environment: ["Deep focus with long stretches of uninterrupted time"],
        values: ["Mastery and depth in something I care about", "Building something that could outlast me"],
      });
      return;
    }
    fetchProfile(answers);
  }, []);

  const fetchProfile = async (answersData: Record<string, string[]>) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("identity-profile", {
        body: { answers: answersData },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) {
        if (data.error.includes("Rate limit")) {
          toast.error("Rate limit reached. Retrying in a moment…");
          setTimeout(() => fetchProfile(answersData), 4000);
          return;
        }
        throw new Error(data.error);
      }
      if (!data?.profile) throw new Error("No profile returned");

      setProfile(data.profile);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingProfile />;

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <RotateCcw className="w-7 h-7 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Couldn't generate your profile</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-xs">{error}</p>
        <Button onClick={() => navigate("/onboarding")} variant="outline">
          Try again
        </Button>
      </div>
    );
  }

  if (!profile) return null;

  const accent = archetypeAccent(profile.archetype.name);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/50 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
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
          <span
            className="text-xs px-3 py-1 rounded-full font-semibold"
            style={{
              background: `hsl(var(${accent.cssVar}) / 0.1)`,
              border: `1px solid hsl(var(${accent.cssVar}) / 0.2)`,
              color: `hsl(var(${accent.cssVar}))`,
            }}
          >
            ✦ NAVO Identity Profile
          </span>
        </div>
      </div>

      <main className="pt-24 pb-24 px-4">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* ── HERO: Archetype reveal ──────────────────────────── */}
          <Reveal>
            <div
              className="relative rounded-2xl overflow-hidden border"
              style={{
                background: `linear-gradient(135deg, hsl(var(--surface-1)) 0%, hsl(20 14% 11%) 100%)`,
                borderColor: `hsl(var(${accent.cssVar}) / 0.3)`,
              }}
            >
              {/* Decorative */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 80% 60% at 60% 0%, hsl(var(${accent.cssVar}) / 0.12), transparent)`,
                }}
              />
              <div className="relative p-8 md:p-10">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-widest mb-2"
                      style={{ color: `hsl(var(${accent.cssVar}))` }}
                    >
                      Your NAVO Identity Archetype
                    </p>
                    <h1
                      className="text-4xl md:text-5xl font-bold text-foreground mb-3 leading-tight"
                      style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                    >
                      {profile.archetype.name}
                    </h1>
                    <p
                      className="text-lg text-muted-foreground leading-relaxed italic max-w-lg"
                      style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                    >
                      "{profile.archetype.tagline}"
                    </p>
                  </div>
                  {/* Rarity badge */}
                  <div
                    className="shrink-0 rounded-2xl p-3 text-center min-w-[80px]"
                    style={{
                      background: "hsl(var(--amber) / 0.08)",
                      border: "1px solid hsl(var(--amber) / 0.2)",
                    }}
                  >
                    <Star className="w-4 h-4 text-amber mx-auto mb-1" />
                    <p className="text-xs text-amber font-bold leading-tight">{profile.archetype.rarity}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-foreground/80 leading-relaxed text-base mb-6">
                  {profile.archetype.description}
                </p>

                {/* Curiosity thread */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: `hsl(var(${accent.cssVar}) / 0.06)`,
                    border: `1px solid hsl(var(${accent.cssVar}) / 0.15)`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Compass className={`w-3.5 h-3.5`} style={{ color: `hsl(var(${accent.cssVar}))` }} />
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: `hsl(var(${accent.cssVar}))` }}>
                      Your curiosity thread
                    </p>
                  </div>
                  <p className="text-sm text-foreground">{profile.curiosityThread}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── MIRROR MOMENT ───────────────────────────────────── */}
          <Reveal delay={100}>
            <MirrorMoment text={profile.mirrorMoment} />
          </Reveal>

          {/* ── THE REFRAME ─────────────────────────────────────────── */}
          <Reveal delay={125}>
            <div
              className="relative rounded-2xl overflow-hidden border"
              style={{
                background: "linear-gradient(135deg, hsl(258 40% 10%), hsl(258 30% 13%))",
                borderColor: "hsl(var(--violet) / 0.35)",
              }}
            >
              {/* Violet radial glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 90% 60% at 50% 0%, hsl(var(--violet) / 0.12), transparent)",
                }}
              />
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, hsl(var(--violet) / 0.6), transparent)" }}
              />
              <div className="relative p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: "hsl(var(--violet) / 0.18)",
                      border: "1px solid hsl(var(--violet) / 0.3)",
                      boxShadow: "0 0 16px -4px hsl(var(--violet) / 0.35)",
                    }}
                  >
                    <Wind className="w-4 h-4" style={{ color: "hsl(var(--violet))" }} />
                  </div>
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: "hsl(var(--violet))" }}
                    >
                      The Reframe
                    </p>
                    <p className="text-xs text-muted-foreground">A different way to see this moment</p>
                  </div>
                </div>
                <blockquote
                  className="text-lg md:text-xl font-medium leading-relaxed italic"
                  style={{
                    fontFamily: "'DM Serif Display', Georgia, serif",
                    color: "hsl(var(--foreground) / 0.9)",
                  }}
                >
                  "{profile.displacementStory || "This transition isn't a detour — it's the actual path. The version of you that exists on the other side of this moment is more aligned, more whole, and more you."}"
                </blockquote>
              </div>
            </div>
          </Reveal>

          {/* ── IDENTITY NARRATIVE ──────────────────────────────── */}
          <Reveal delay={150}>
            <div
              className="rounded-2xl border p-6 md:p-8"
              style={{
                background: "hsl(var(--surface-1))",
                borderColor: "hsl(var(--border))",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "hsl(var(--violet) / 0.1)" }}
                >
                  <Sparkles className="w-4 h-4 text-violet" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-violet">Your Identity Narrative</p>
                  <p className="text-xs text-muted-foreground">Written for you, about you</p>
                </div>
              </div>
              <p
                className="text-foreground/85 leading-relaxed text-base"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                {profile.identityNarrative}
              </p>
            </div>
          </Reveal>

          {/* ── TWO-COL: Drivers + Strengths ────────────────────── */}
          <div className="grid md:grid-cols-2 gap-5">

            {/* Core Drivers */}
            <Reveal delay={200}>
              <div
                className="rounded-2xl border p-5 h-full"
                style={{ background: "hsl(var(--surface-1))", borderColor: "hsl(var(--border))" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "hsl(var(--coral) / 0.1)" }}
                  >
                    <Heart className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Core Drivers</p>
                    <p className="text-xs text-muted-foreground">What fuels you</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {profile.coreDrivers.map((d, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-3"
                      style={{ background: "hsl(var(--surface-2))" }}
                    >
                      <p className="text-sm font-semibold text-foreground mb-1">{d.name}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{d.description}</p>
                      {d.signal && (
                        <p className="text-xs text-indigo-400/60 mt-1.5 italic">Signal: "{d.signal}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Hidden Strengths */}
            <Reveal delay={250}>
              <div
                className="rounded-2xl border p-5 h-full"
                style={{ background: "hsl(var(--surface-1))", borderColor: "hsl(var(--border))" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "hsl(var(--amber) / 0.1)" }}
                  >
                    <Lightbulb className="w-4 h-4 text-amber" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-amber">Hidden Strengths</p>
                    <p className="text-xs text-muted-foreground">What others may not see yet</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {profile.hiddenStrengths.map((s, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-3"
                      style={{ background: "hsl(var(--surface-2))" }}
                    >
                      <p className="text-sm font-semibold text-foreground mb-1">{s.strength}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{s.insight}</p>
                      {s.unlocks && (
                        <p className="text-xs text-amber/70 mt-1.5 font-medium">
                          ↳ Could unlock: {s.unlocks}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── Environment Fit ──────────────────────────────────── */}
          <Reveal delay={300}>
            <div
              className="rounded-2xl border p-6"
              style={{ background: "hsl(var(--surface-1))", borderColor: "hsl(var(--border))" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "hsl(var(--violet) / 0.1)" }}
                >
                  <Wind className="w-4 h-4 text-violet" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-violet">Environment Fit</p>
                  <p className="text-xs text-muted-foreground">Where you expand and where you contract</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {/* Thrive */}
                <div
                  className="rounded-xl p-4"
                  style={{ background: "hsl(var(--coral) / 0.05)", border: "1px solid hsl(var(--coral) / 0.15)" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sun className="w-3.5 h-3.5 text-indigo-400" />
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">You thrive in</p>
                  </div>
                  <ul className="space-y-2">
                    {profile.environmentFit.thrive.map((env, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                        <span className="text-indigo-400 mt-0.5">✦</span>
                        {env}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Drain */}
                <div
                  className="rounded-xl p-4"
                  style={{ background: "hsl(var(--muted) / 0.3)", border: "1px solid hsl(var(--border))" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Moon className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Drains you</p>
                  </div>
                  <ul className="space-y-2">
                    {profile.environmentFit.drain.map((env, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="mt-0.5">—</span>
                        {env}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                className="rounded-xl p-3"
                style={{ background: "hsl(var(--surface-2))" }}
              >
                <p className="text-xs text-muted-foreground/70 mb-0.5">Your ideal work style</p>
                <p className="text-sm text-foreground">{profile.environmentFit.workStyle}</p>
              </div>
            </div>
          </Reveal>

          {/* ── Path Directions ──────────────────────────────────── */}
          <Reveal delay={350}>
            <div
              className="rounded-2xl border p-6"
              style={{ background: "hsl(var(--surface-1))", borderColor: "hsl(var(--border))" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `hsl(var(${accent.cssVar}) / 0.1)` }}
                >
                  <Compass className="w-4 h-4" style={{ color: `hsl(var(${accent.cssVar}))` }} />
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: `hsl(var(${accent.cssVar}))` }}
                  >
                    Path Directions
                  </p>
                  <p className="text-xs text-muted-foreground">Naturally aligned with who you are</p>
                </div>
              </div>

              <div className="space-y-4">
                {profile.pathDirections.map((path, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4"
                    style={{ background: "hsl(var(--surface-2))", border: "1px solid hsl(var(--border))" }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm font-bold text-foreground">{path.title}</p>
                      <span
                        className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: `hsl(var(${accent.cssVar}) / 0.1)`,
                          color: `hsl(var(${accent.cssVar}))`,
                        }}
                      >
                        {path.alignment}% fit
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{path.description}</p>
                    <AlignmentBar value={path.alignment} cssVar={accent.cssVar} />
                    {path.firstStep && (
                      <div
                        className="mt-3 rounded-lg px-3 py-2 flex items-start gap-2"
                        style={{ background: `hsl(var(${accent.cssVar}) / 0.06)` }}
                      >
                        <ArrowRight className="w-3 h-3 shrink-0 mt-0.5" style={{ color: `hsl(var(${accent.cssVar}))` }} />
                        <p className="text-xs text-foreground/75">
                          <span className="font-semibold">Try this week:</span> {path.firstStep}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ── Shareable Card ───────────────────────────────────── */}
          <Reveal delay={400}>
            <ShareCard profile={profile} />
          </Reveal>

          {/* ── CTA: Enter dashboard ─────────────────────────────── */}
          <Reveal delay={450}>
            <div
              className="rounded-2xl p-6 md:p-8 text-center border"
              style={{
                background: `linear-gradient(135deg, hsl(var(${accent.cssVar}) / 0.06), hsl(var(--surface-1)))`,
                borderColor: `hsl(var(${accent.cssVar}) / 0.2)`,
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: `hsl(var(${accent.cssVar}) / 0.1)`, border: `1px solid hsl(var(${accent.cssVar}) / 0.2)` }}
              >
                <Shield className="w-6 h-6" style={{ color: `hsl(var(${accent.cssVar}))` }} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">This is just the beginning</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                Your identity profile evolves as you reflect, experiment, and grow. Enter your dashboard to continue the journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/dashboard">
                  <Button className="bg-gradient-coral text-primary-foreground font-semibold px-8 py-5 rounded-xl glow-coral hover:opacity-90 gap-2 group">
                    Go to my dashboard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link to="/coach">
                  <Button
                    variant="outline"
                    className="px-8 py-5 rounded-xl gap-2"
                    style={{ borderColor: `hsl(var(${accent.cssVar}) / 0.3)`, color: `hsl(var(${accent.cssVar}))` }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Ask your coach about this
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>

        </div>
      </main>
    </div>
  );
}
