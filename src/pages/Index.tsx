import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowRight, Sparkles, Brain, Compass, FlaskConical,
  TrendingUp, Star, BookOpen, Heart, Zap, Quote,
  Flame, Eye, Lightbulb, Target, ChevronRight, Layers,
  Check, X as XIcon,
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

/* ── Identity mirror questions ─────────────────────────────────────── */
const mirrorQuestions = [
  { q: "When was the last time you lost track of time doing something?", hint: "That thing you were doing — that's a clue to who you actually are." },
  { q: "What problems do you think about even when nobody's paying you?", hint: "Not because you have to. Because something in you can't let go." },
  { q: "What do people always come to you for — even when it's not your job?", hint: "You probably don't realize how rare that thing is." },
  { q: "If you could spend a year learning anything, what would pull you in?", hint: "Your curiosity knows things your resume doesn't." },
];

/* ── Testimonials ───────────────────────────────────────────────────── */
const testimonials = [
  {
    name: "Maya C.",
    context: "After a tech layoff",
    quote: "I spent three months applying to jobs that felt wrong. Pathly helped me realize I wasn't looking for a new job — I was looking for a new identity.",
    archetype: "The Connector-Builder",
  },
  {
    name: "James O.",
    context: "After 10 years in education",
    quote: "I thought burnout meant I'd chosen wrong. Turns out I'd just outgrown one version of myself. Pathly helped me see who I was becoming next.",
    archetype: "The Educator-Strategist",
  },
  {
    name: "Sofia R.",
    context: "Career transition at 38",
    quote: "The identity questions felt almost too personal. Then I realized — that's exactly what was missing from every other platform I'd tried.",
    archetype: "The Creative-Explorer",
  },
];

/* ── Journey steps ─────────────────────────────────────────────────── */
const steps = [
  {
    step: "01", word: "Reflect", color: "coral", icon: Brain,
    headline: "Separate who you are from what you do",
    body: "Guided reflections help you reconnect with your energy, values, and natural tendencies — the parts of you that exist regardless of any job.",
  },
  {
    step: "02", word: "Discover", color: "violet", icon: Sparkles,
    headline: "See the patterns you've been living",
    body: "AI surfaces your curiosity themes, strength signals, and energy drivers — the invisible threads that connect everything you've ever done.",
  },
  {
    step: "03", word: "Explore", color: "amber", icon: FlaskConical,
    headline: "Try new directions without committing",
    body: "Run small experiments aligned to your identity. Test paths, projects, and ideas before making big decisions.",
  },
  {
    step: "04", word: "Design", color: "coral", icon: TrendingUp,
    headline: "Build a life that fits who you're becoming",
    body: "A reinvention roadmap: skills to develop, communities to join, experiments to deepen. Your next chapter — designed by you.",
  },
];

/* ── Features ─────────────────────────────────────────────────────── */
const features = [
  { icon: Brain,        title: "Identity Reset",       desc: "Separate who you are from what you do through guided reflections that reveal your real self.", color: "coral"  },
  { icon: Compass,      title: "Pattern Discovery",    desc: "Surface the themes, strengths, and drives that appear across all your reflections.", color: "violet" },
  { icon: Sparkles,     title: "AI Identity Profile",  desc: "A personal narrative capturing who you're becoming — your archetype, values, and what energizes you.", color: "amber"  },
  { icon: FlaskConical, title: "Path Exploration",     desc: "Directions aligned to your identity, not your job history. Careers, projects, creative experiments.", color: "coral"  },
  { icon: TrendingUp,   title: "Reinvention Roadmap",  desc: "A plan for your next chapter. Skills, experiments, communities — all built around who you are.", color: "violet" },
  { icon: BookOpen,     title: "Reflection Journal",   desc: "Track your evolution over time. Watch your self-understanding deepen week by week.", color: "amber"  },
];

/* ── Archetypes ─────────────────────────────────────────────────── */
const archetypes = [
  { name: "The Builder",    trait: "You create things that last",         color: "coral",  emoji: "🔨" },
  { name: "The Connector",  trait: "You make the room come alive",        color: "violet", emoji: "🌐" },
  { name: "The Strategist", trait: "You see three moves ahead",           color: "amber",  emoji: "♟️" },
  { name: "The Explorer",   trait: "You find what others overlook",       color: "coral",  emoji: "🧭" },
  { name: "The Educator",   trait: "You make the complex feel simple",    color: "violet", emoji: "✨" },
  { name: "The Maker",      trait: "You build beauty from raw materials", color: "amber",  emoji: "🎨" },
];

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  coral:  { text: "text-coral",  bg: "bg-coral-500/10",  border: "border-coral-500/20"  },
  violet: { text: "text-violet", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  amber:  { text: "text-amber",  bg: "bg-amber-500/10",  border: "border-amber-500/20"  },
};

/* ── "Not this / This" differentiation items ──────────────────────── */
const notThis = [
  "Starts with your job history",
  "Optimizes your resume",
  "Matches you to open roles",
  "Measures skills gaps",
];
const yesThis = [
  "Starts with who you are",
  "Surfaces your hidden patterns",
  "Reveals paths you haven't imagined",
  "Builds on your natural strengths",
];

/* ── Rotating headline hook ───────────────────────────────────────── */
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

/* ── Mirror moment ────────────────────────────────────────────────── */
function MirrorMoment() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % mirrorQuestions.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative rounded-2xl border overflow-hidden"
      style={{ background: "linear-gradient(135deg, hsl(var(--surface-1)), hsl(var(--surface-2)))", borderColor: "hsl(var(--coral) / 0.15)" }}>
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl pointer-events-none"
        style={{ background: "hsl(var(--coral) / 0.08)" }} />
      <div className="p-8">
        <div className="flex items-center gap-2 mb-6">
          <Eye className="w-4 h-4 text-coral" />
          <span className="text-xs font-semibold uppercase tracking-widest text-coral">A question for you</span>
        </div>
        <div className="min-h-[80px] mb-3 transition-all duration-500">
          <p className="text-xl font-bold text-foreground leading-snug mb-2 font-display">
            "{mirrorQuestions[active].q}"
          </p>
          <p className="text-sm text-muted-foreground italic">{mirrorQuestions[active].hint}</p>
        </div>
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
        <span className="text-xs text-muted-foreground">These questions reveal more than any resume ever could.</span>
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
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-50"
          style={{ background: "hsl(var(--coral) / 0.07)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-40"
          style={{ background: "hsl(var(--rose) / 0.06)" }} />

        <div className="container relative z-10 text-center max-w-3xl mx-auto px-6">
          {/* Emotional context badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-10 animate-fade-up border"
            style={{ background: "hsl(var(--coral) / 0.08)", borderColor: "hsl(var(--coral) / 0.18)", color: "hsl(var(--coral))" }}>
            <Heart className="w-3.5 h-3.5" />
            For the person who knows there's more to them than their career
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl text-foreground leading-[1.08] tracking-tight mb-6 animate-fade-up">
            You are more than
            <br />
            <RotatingHook />
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-5 leading-relaxed animate-fade-up">
            Pathly helps you rediscover who you are beyond your career — and design a life that actually fits who you're becoming.
          </p>

          <p className="text-sm text-muted-foreground/60 max-w-lg mx-auto mb-10 leading-relaxed animate-fade-up">
            For the person who left a job and feels lost. The person who succeeded but doesn't feel fulfilled. The person ready to stop drifting and start designing.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14 animate-fade-up">
            <Link to="/onboarding">
              <Button size="lg"
                className="bg-gradient-coral text-primary-foreground font-semibold text-base px-8 py-6 rounded-xl glow-coral hover:opacity-90 transition-all hover:scale-[1.02] group gap-2">
                Discover who you really are
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
              { n: "4 min", l: "to your first insight" },
              { n: "Free", l: "to start · no signup needed" },
              { n: "94%", l: "say it shifted how they see themselves" },
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

      {/* ── THE REAL PROBLEM ─────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="container max-w-2xl px-6 text-center relative z-10">
          <p className="text-coral text-xs font-semibold uppercase tracking-widest mb-4">The problem nobody talks about</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10 leading-snug">
            When your career changes, your identity breaks.
          </h2>
          <div className="text-muted-foreground text-base leading-[1.9] space-y-5 text-left max-w-xl mx-auto">
            <p>Layoffs. Burnout. Industry collapse. A quiet sense that your work no longer reflects who you are.</p>
            <p>When a job disappears, most people don't just lose income. They lose their sense of self.</p>
            <p>And the question they're left with is one no career platform was ever designed to answer:</p>
            <div className="border-l-2 pl-5 my-6" style={{ borderColor: "hsl(var(--coral) / 0.4)" }}>
              <p className="text-foreground font-semibold text-lg italic font-display">
                "If I'm not my job title... who am I?"
              </p>
            </div>
            <p>
              Pathly was built for that moment. Not with a job recommendation — with a genuine process of self-discovery that helps you understand your energy, strengths, values, and curiosity <em>before</em> choosing any path forward.
            </p>
            <p className="text-foreground font-medium">
              Because the best next step starts with knowing who you actually are.
            </p>
          </div>
        </div>
      </section>

      {/* ── MIRROR MOMENT ─────────────────────────────────────────── */}
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

      {/* ── NOT THIS / YES THIS — Differentiation ──────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="container max-w-3xl px-6 relative z-10">
          <div className="text-center mb-12">
            <p className="text-violet text-xs font-semibold uppercase tracking-widest mb-3">What makes Pathly different</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              This isn't another career platform.
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Career platforms optimize your resume. Pathly helps you understand yourself.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Not this */}
            <div className="rounded-2xl border p-6" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface-1))" }}>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">Every other platform</p>
              <div className="space-y-3.5">
                {notThis.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "hsl(var(--muted))" }}>
                      <XIcon className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Yes this */}
            <div className="rounded-2xl border p-6" style={{ borderColor: "hsl(var(--coral) / 0.2)", background: "hsl(var(--coral) / 0.04)" }}>
              <p className="text-xs font-bold uppercase tracking-widest text-coral mb-5">Pathly</p>
              <div className="space-y-3.5">
                {yesThis.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "hsl(var(--coral) / 0.15)" }}>
                      <Check className="w-3 h-3 text-coral" />
                    </div>
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARCHETYPE PEEK ────────────────────────────────────────── */}
      <section className="py-28" style={{ background: "hsl(var(--surface-1))" }}>
        <div className="container max-w-4xl px-6">
          <div className="text-center mb-12">
            <p className="text-violet text-xs font-semibold uppercase tracking-widest mb-3">Which one are you?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              6 identity archetypes.<br />
              <span className="text-gradient-coral">Which one resonates?</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Not personality types. Identity orientations — how your natural strengths cluster together.
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

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="container max-w-4xl relative z-10 px-6">
          <div className="text-center mb-14">
            <p className="text-amber text-xs font-semibold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              From identity confusion
              <span className="text-gradient-coral"> to personal clarity</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
              Four steps. At your own pace. Guided by AI that listens.
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

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section className="py-32" style={{ background: "hsl(var(--surface-1))" }}>
        <div className="container max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-coral text-xs font-semibold uppercase tracking-widest mb-3">What's inside</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Tools built for real reinvention</h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
              Not a job board. Not a resume tool. A system for discovering who you are and designing what's next.
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

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section className="py-32">
        <div className="container max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-violet text-xs font-semibold uppercase tracking-widest mb-3">Real stories</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              You're not the only one who felt this way
            </h2>
            <p className="text-muted-foreground text-base max-w-sm mx-auto">From people who were exactly where you are now.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gradient-card border border-border/40 rounded-2xl p-7 flex flex-col">
                <p className="text-xs text-muted-foreground/60 mb-4 italic">{t.context}</p>
                <p className="text-muted-foreground leading-relaxed mb-6 text-sm flex-1">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
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

      {/* ── EMOTIONAL ARC ─────────────────────────────────────────── */}
      <section className="py-24" style={{ background: "hsl(var(--surface-1))" }}>
        <div className="container max-w-3xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
            The journey Pathly guides you through
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            {[
              { label: "Lost",        color: "text-muted-foreground",        desc: "Who am I without my job?" },
              { label: "→",           color: "text-border",                   desc: "" },
              { label: "Curious",     color: "text-violet",                   desc: "What do I actually care about?" },
              { label: "→",           color: "text-border",                   desc: "" },
              { label: "Recognized",  color: "text-amber",                    desc: "Oh — that's always been me." },
              { label: "→",           color: "text-border",                   desc: "" },
              { label: "Possible",    color: "text-coral",                    desc: "There's more than one path." },
              { label: "→",           color: "text-border",                   desc: "" },
              { label: "Clear",       color: "text-foreground font-semibold", desc: "I know who I am and what's next." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <span className={`font-medium ${item.color}`}>{item.label}</span>
                {item.desc && <p className="text-xs text-muted-foreground/40 mt-1 max-w-[90px] leading-tight">{item.desc}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="py-36 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-3xl"
          style={{ background: "hsl(var(--coral) / 0.07)" }} />

        <div className="container max-w-2xl text-center relative z-10 px-6">
          <div className="inline-flex items-center gap-2 border rounded-full px-4 py-2 text-sm font-medium mb-8"
            style={{ borderColor: "hsl(var(--coral) / 0.2)", color: "hsl(var(--coral))" }}>
            <Flame className="w-3.5 h-3.5" />
            Your next chapter won't design itself
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6 leading-[1.1]">
            It starts with knowing
            <br />
            <span className="text-gradient-coral italic">who you really are.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-4 leading-relaxed max-w-lg mx-auto">
            Most platforms ask what job you want. Pathly asks who you are. That one difference changes everything.
          </p>
          <p className="text-sm text-muted-foreground/50 italic mb-12">
            4 minutes. No signup. No job title asked.
          </p>
          <Link to="/onboarding">
            <Button size="lg"
              className="bg-gradient-coral text-primary-foreground font-semibold text-base px-10 py-6 rounded-xl glow-coral hover:opacity-90 transition-all hover:scale-[1.02] group gap-2">
              Discover who you really are
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
