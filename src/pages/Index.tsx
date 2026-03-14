import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowRight, Sparkles, Brain, Compass, FlaskConical,
  TrendingUp, Star, BookOpen, Heart, Zap, Quote,
  Flame, Eye, Lightbulb, Target, ChevronRight, Layers,
} from "lucide-react";

/* ── Rotating curiosity-gap hooks ───────────────────────────────────── */
const rotatingHooks = [
  "your job title.",
  "your LinkedIn bio.",
  "your last performance review.",
  "your salary.",
  "your industry.",
  "your resume.",
];

/* ── Identity mirror questions — creates the curiosity gap immediately ─ */
const mirrorQuestions = [
  { q: "When was the last time you lost track of time?", hint: "That thing you were doing — that's a clue." },
  { q: "What problems do you think about on Sundays?", hint: "Not because you have to. Because you can't help it." },
  { q: "What do people always come to you for?", hint: "You probably don't realize how rare it is." },
];

/* ── Real transformation stories ─────────────────────────────────────── */
const testimonials = [
  {
    name: "Maya Chen",
    context: "After a tech layoff",
    quote: "I spent three months applying to jobs that felt wrong. Pathly helped me realize I wasn't looking for a new job — I was looking for a new identity. That shift changed everything.",
    archetype: "The Connector-Builder",
    stars: 5,
  },
  {
    name: "James Okafor",
    context: "After 10 years in education",
    quote: "I thought burnout meant I'd chosen the wrong career. Turns out I'd just outgrown one version of myself. Pathly helped me see who I was becoming next.",
    archetype: "The Educator-Strategist",
    stars: 5,
  },
  {
    name: "Sofia Reyes",
    context: "Career transition at 38",
    quote: "The identity questions felt almost too personal at first. Then I realized that's exactly what was missing from every other career platform I'd tried.",
    archetype: "The Creative-Explorer",
    stars: 5,
  },
];

/* ── Journey steps ─────────────────────────────────────────────────── */
const steps = [
  {
    step: "01", word: "Reset", color: "coral", icon: Brain,
    headline: "Separate your identity from your job",
    body: "Most people define themselves by what they do. Pathly helps you reconnect with who you actually are — your energy, values, and natural tendencies.",
  },
  {
    step: "02", word: "Discover", color: "violet", icon: Sparkles,
    headline: "Uncover your patterns and strengths",
    body: "AI analyzes your reflections to surface curiosity themes, strength signals, and energy drivers — the building blocks of your real identity.",
  },
  {
    step: "03", word: "Explore", color: "amber", icon: FlaskConical,
    headline: "See what's possible for someone like you",
    body: "Discover paths, projects, and experiments aligned to your identity — not your old resume. Run small tests without committing to anything.",
  },
  {
    step: "04", word: "Design", color: "coral", icon: TrendingUp,
    headline: "Design the next chapter of your life",
    body: "Build a reinvention roadmap. Skills to develop, communities to join, experiments to run. A life that fits who you're becoming.",
  },
];

/* ── Features ─────────────────────────────────────────────────────── */
const features = [
  { icon: Brain,        title: "Identity Reset",       desc: "Separate who you are from what you do. A reflective experience that helps you rediscover your real self.", color: "coral"  },
  { icon: Compass,      title: "Pattern Discovery",    desc: "Surface the themes, strengths, and drives that appear across all your reflections. Your identity fingerprint.", color: "violet" },
  { icon: Sparkles,     title: "AI Identity Profile",  desc: "A personal narrative that captures who you're becoming — your archetype, values, working style, and what energizes you.", color: "amber"  },
  { icon: FlaskConical, title: "Path Exploration",     desc: "Paths aligned to your identity, not your job history. Careers, creative projects, entrepreneurial directions.", color: "coral"  },
  { icon: TrendingUp,   title: "Reinvention Roadmap",  desc: "A non-linear plan for your next chapter. Skills to build, experiments to run, people to learn from.", color: "violet" },
  { icon: BookOpen,     title: "Reflection & Growth",  desc: "Track your evolution over time. Journal, log curiosity, and watch your self-understanding deepen.", color: "amber"  },
];

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  coral:  { text: "text-coral",  bg: "bg-coral-500/10",  border: "border-coral-500/20"  },
  violet: { text: "text-violet", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  amber:  { text: "text-amber",  bg: "bg-amber-500/10",  border: "border-amber-500/20"  },
};

/* ── Viral: Identity Archetype peek cards ─────────────────────────── */
const archetypes = [
  { name: "The Builder",    trait: "You create things that last",         color: "coral",  emoji: "🔨" },
  { name: "The Connector",  trait: "You make the room come alive",        color: "violet", emoji: "🌐" },
  { name: "The Strategist", trait: "You see three moves ahead",           color: "amber",  emoji: "♟️" },
  { name: "The Explorer",   trait: "You find what others overlook",       color: "coral",  emoji: "🧭" },
  { name: "The Educator",   trait: "You make the complex feel simple",    color: "violet", emoji: "✨" },
  { name: "The Maker",      trait: "You build beauty from raw materials", color: "amber",  emoji: "🎨" },
];

/* ── Live pulse counter ───────────────────────────────────────────── */
function usePulsingCount(base: number, interval = 12000) {
  const [count, setCount] = useState(base);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + Math.floor(Math.random() * 3) + 1), interval);
    return () => clearInterval(id);
  }, [interval]);
  return count;
}

/* ── Rotating headline ───────────────────────────────────────────── */
function RotatingHook() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % rotatingHooks.length);
        setVisible(true);
      }, 350);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="text-gradient-coral italic inline-block transition-all duration-300"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)" }}
    >
      {rotatingHooks[idx]}
    </span>
  );
}

/* ── Mirror moment component ─────────────────────────────────────── */
function MirrorMoment() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % mirrorQuestions.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative rounded-2xl border overflow-hidden"
      style={{ background: "linear-gradient(135deg, hsl(var(--surface-1)), hsl(var(--surface-2)))", borderColor: "hsl(var(--coral) / 0.15)" }}>
      {/* Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl pointer-events-none"
        style={{ background: "hsl(var(--coral) / 0.08)" }} />
      <div className="p-8">
        <div className="flex items-center gap-2 mb-6">
          <Eye className="w-4 h-4 text-coral" />
          <span className="text-xs font-semibold uppercase tracking-widest text-coral">A question for you</span>
        </div>
        <div className="min-h-[72px] mb-3 transition-all duration-500">
          <p className="text-xl font-bold text-foreground leading-snug mb-2 font-display">
            "{mirrorQuestions[active].q}"
          </p>
          <p className="text-sm text-muted-foreground italic">{mirrorQuestions[active].hint}</p>
        </div>
        {/* Dots */}
        <div className="flex gap-1.5 mt-5">
          {mirrorQuestions.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? "20px" : "6px", height: "6px",
                background: i === active ? "hsl(var(--coral))" : "hsl(var(--border))",
              }} />
          ))}
        </div>
      </div>
      <div className="border-t px-8 py-4 flex items-center justify-between"
        style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface-2) / 0.5)" }}>
        <span className="text-xs text-muted-foreground">These questions reveal something most platforms never ask.</span>
        <Link to="/onboarding">
          <span className="text-xs font-semibold text-coral flex items-center gap-1 hover:gap-2 transition-all">
            Explore yours <ChevronRight className="w-3 h-3" />
          </span>
        </Link>
      </div>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────────── */
export default function Index() {
  const liveCount = usePulsingCount(50247);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-50"
          style={{ background: "hsl(var(--coral) / 0.07)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-40"
          style={{ background: "hsl(var(--rose) / 0.06)" }} />

        <div className="container relative z-10 text-center max-w-3xl mx-auto px-6">
          {/* Live pulse badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-10 animate-fade-up border"
            style={{ background: "hsl(var(--coral) / 0.08)", borderColor: "hsl(var(--coral) / 0.18)", color: "hsl(var(--coral))" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "hsl(var(--coral))" }} />
              <span className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: "hsl(var(--coral))" }} />
            </span>
            {liveCount.toLocaleString()} people rediscovering themselves right now
          </div>

          {/* Headline with rotating hook */}
          <h1 className="font-display text-5xl md:text-7xl text-foreground leading-[1.08] tracking-tight mb-6 animate-fade-up">
            You are not
            <br />
            <RotatingHook />
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-5 leading-relaxed animate-fade-up">
            Pathly helps you rediscover who you are beyond your career — and design the next chapter of your life.
          </p>

          <p className="text-sm text-muted-foreground/70 max-w-md mx-auto mb-10 leading-relaxed animate-fade-up italic">
            For the person who just left a job and feels lost. For the person who succeeded but doesn't feel fulfilled. For the person ready to design a life that actually fits.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16 animate-fade-up">
            <Link to="/onboarding">
              <Button size="lg"
                className="bg-gradient-coral text-primary-foreground font-semibold text-base px-8 py-6 rounded-xl glow-coral hover:opacity-90 transition-all hover:scale-[1.02] group gap-2">
                Begin your identity discovery
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link to="/life-clarity">
              <Button size="lg" variant="outline"
                className="border-border text-muted-foreground hover:text-foreground hover:border-coral-500/40 text-base px-8 py-6 rounded-xl gap-2 bg-transparent">
                Try a free reflection
              </Button>
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in flex-wrap">
            {[
              { n: "94%", l: "shifted their self-perception" },
              { n: "4.9★", l: "from users in transition" },
              { n: "Free", l: "to start · no job title needed" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl font-bold text-foreground tracking-tight">{s.n}</div>
                <div className="text-xs mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-muted-foreground mx-auto" />
        </div>
      </section>

      {/* ── Mirror Moment ─────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: "hsl(var(--surface-1))" }}>
        <div className="container max-w-2xl px-6">
          <div className="text-center mb-10">
            <p className="text-coral text-xs font-semibold uppercase tracking-widest mb-3">Before we talk about paths</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Let's start with a mirror.
            </h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Most platforms start with your job history. Pathly starts somewhere more interesting.
            </p>
          </div>
          <MirrorMoment />
        </div>
      </section>

      {/* ── The Real Problem ─────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="container max-w-2xl px-6 text-center relative z-10">
          <p className="text-coral text-xs font-semibold uppercase tracking-widest mb-4">Why Pathly exists</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10 leading-snug">
            Most people tie their identity to their job.
          </h2>
          <div className="text-muted-foreground text-base leading-[1.9] space-y-5 text-left max-w-xl mx-auto">
            <p>When a job disappears, so does the person.</p>
            <p>Layoffs. Burnout. Industry shifts. Life transitions.</p>
            <p>Millions of people are left asking a question no career platform was ever designed to answer:</p>
            <div className="border-l-2 pl-5 my-6" style={{ borderColor: "hsl(var(--coral) / 0.4)" }}>
              <p className="text-foreground font-semibold text-lg italic font-display">
                "If I'm not my job... who am I?"
              </p>
            </div>
            <p>
              Pathly was built to answer that question. Not with a job recommendation. With a genuine process of self-discovery — one that helps you understand your energy, your strengths, your values, and your natural curiosity before suggesting any path forward.
            </p>
            <p className="text-foreground font-medium">
              Understanding yourself is the beginning of designing your future.
            </p>
          </div>
        </div>
      </section>

      {/* ── Archetype Peek — Viral Feature ──────────────────────────── */}
      <section className="py-28" style={{ background: "hsl(var(--surface-1))" }}>
        <div className="container max-w-4xl px-6">
          <div className="text-center mb-12">
            <p className="text-violet text-xs font-semibold uppercase tracking-widest mb-3">Which one are you?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              6 identity archetypes.<br />
              <span className="text-gradient-coral">Which one resonates?</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              These aren't personality types. They're identity orientations — how your natural strengths cluster together.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {archetypes.map((a, i) => {
              const c = colorMap[a.color];
              return (
                <div key={i}
                  className="group bg-gradient-card border border-border/40 rounded-2xl p-5 card-hover cursor-pointer hover:border-coral-500/30 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{a.emoji}</span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${c.text}`}>{a.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a.trait}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors">
                    <span>See if this is you</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link to="/onboarding">
              <Button className="bg-gradient-coral text-primary-foreground font-semibold px-8 gap-2 hover:opacity-90">
                Discover your real archetype
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground/50 mt-3">Takes 4 minutes. No email required to start.</p>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="container max-w-4xl relative z-10 px-6">
          <div className="text-center mb-14">
            <p className="text-amber text-xs font-semibold uppercase tracking-widest mb-3">The journey</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              From identity confusion
              <span className="text-gradient-coral"> to personal clarity</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
              A structured journey through self-discovery — at your own pace, guided by AI.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const c = colorMap[step.color];
              return (
                <div key={i}
                  className="bg-gradient-card border border-border/40 rounded-2xl p-7 card-hover group flex gap-5">
                  <div className="shrink-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${c.bg} ${c.border}`}>
                      <span className={`text-sm font-bold ${c.text}`}>{step.step}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-bold uppercase tracking-widest ${c.text}`}>{step.word}</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{step.headline}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="py-32" style={{ background: "hsl(var(--surface-1))" }}>
        <div className="container max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-coral text-xs font-semibold uppercase tracking-widest mb-3">Platform features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Built for real reinvention</h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
              Not a job board. Not a resume tool. A complete system for discovering who you are.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const c = colorMap[f.color];
              return (
                <div key={i}
                  className="bg-gradient-card border border-border/40 rounded-2xl p-6 card-hover group">
                  <div className={`w-9 h-9 ${c.bg} rounded-lg flex items-center justify-center mb-4 transition-colors`}>
                    <f.icon className={`w-4 h-4 ${c.text}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="py-32">
        <div className="container max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-violet text-xs font-semibold uppercase tracking-widest mb-3">Real stories</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">You're not the only one who felt this way</h2>
            <p className="text-muted-foreground text-base max-w-sm mx-auto">From people who were exactly where you are now.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gradient-card border border-border/40 rounded-2xl p-7 flex flex-col">
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-amber fill-current" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground/60 mb-4 italic">{t.context}</p>
                <p className="text-muted-foreground leading-relaxed mb-6 text-sm flex-1">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  {/* Viral: their discovered archetype */}
                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                    style={{ background: "hsl(var(--coral) / 0.1)", color: "hsl(var(--coral))", border: "1px solid hsl(var(--coral) / 0.2)" }}>
                    <Sparkles className="w-2.5 h-2.5" />
                    {t.archetype}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Identity Arc ─────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: "hsl(var(--surface-1))" }}>
        <div className="container max-w-3xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
            The emotional arc Pathly guides you through
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            {[
              { label: "Confusion",    color: "text-muted-foreground",          desc: "Who am I without my job?" },
              { label: "→",           color: "text-border",                     desc: "" },
              { label: "Curiosity",   color: "text-violet",                     desc: "What do I actually care about?" },
              { label: "→",           color: "text-border",                     desc: "" },
              { label: "Recognition", color: "text-amber",                      desc: "Oh — that's always been me." },
              { label: "→",           color: "text-border",                     desc: "" },
              { label: "Possibility", color: "text-coral",                      desc: "There's more than one path." },
              { label: "→",           color: "text-border",                     desc: "" },
              { label: "Agency",      color: "text-foreground font-semibold",   desc: "I know what to do next." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <span className={`font-medium ${item.color}`}>{item.label}</span>
                {item.desc && <p className="text-xs text-muted-foreground/40 mt-1 max-w-[80px] leading-tight">{item.desc}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-36 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-3xl"
          style={{ background: "hsl(var(--coral) / 0.07)" }} />

        <div className="container max-w-2xl text-center relative z-10 px-6">
          <div className="inline-flex items-center gap-2 border rounded-full px-4 py-2 text-sm font-medium mb-8"
            style={{ borderColor: "hsl(var(--coral) / 0.2)", color: "hsl(var(--coral))" }}>
            <Flame className="w-3.5 h-3.5" />
            The next chapter won't design itself
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6 leading-[1.1]">
            The next chapter starts with
            <br />
            <span className="text-gradient-coral italic">knowing who you are.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
            Most platforms start with what job you want. Pathly starts with who you actually are. That one difference changes everything.
          </p>
          <p className="text-sm text-muted-foreground/50 italic mb-12">
            Takes 4 minutes. No email required to start. No job title asked.
          </p>
          <Link to="/onboarding">
            <Button size="lg"
              className="bg-gradient-coral text-primary-foreground font-semibold text-base px-10 py-6 rounded-xl glow-coral hover:opacity-90 transition-all hover:scale-[1.02] group gap-2">
              Begin your identity discovery
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground/40 mt-5">
            Join {liveCount.toLocaleString()} people already discovering who they're becoming.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
