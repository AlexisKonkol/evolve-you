import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowRight, Sparkles, Brain, Compass, FlaskConical,
  TrendingUp, BookOpen, Heart, Eye,
  Flame, ChevronRight, Check, X as XIcon,
} from "lucide-react";

/* ── Pattern-interrupt rotating hooks ──────────────────────────────── */
const rotatingHooks = [
  "your job title.",
  "your salary.",
  "your LinkedIn.",
  "what you produce.",
  "your last role.",
  "what the market wants.",
];

/* ── Identity mirror questions — Socratic, emotionally specific ─────── */
const mirrorQuestions = [
  {
    q: "What did you love doing at 12 — before anyone told you it wasn't a career?",
    hint: "That thing didn't disappear. It went quiet.",
  },
  {
    q: "When do you finish a conversation and feel more alive than when it started?",
    hint: "Energy doesn't lie. Your interests do.",
  },
  {
    q: "What do people thank you for — that you barely think of as a skill?",
    hint: "The thing that feels obvious to you is rare to everyone else.",
  },
  {
    q: "What problem in the world quietly bothers you — even when it has nothing to do with your job?",
    hint: "That frustration is a signal. Not a distraction.",
  },
  {
    q: "If you couldn't fail — and no one was watching — what would you try?",
    hint: "Remove the audience. What remains is you.",
  },
];

/* ── Testimonials — emotionally specific, identity-framed ───────────── */
const testimonials = [
  {
    name: "Maya C.",
    context: "After a tech layoff",
    quote: "I kept trying to explain the gap on my resume. Pathly helped me realize — the gap wasn't the problem. I'd been misaligned for years. I just needed a layoff to see it.",
    archetype: "The Connector-Builder",
  },
  {
    name: "James O.",
    context: "10 years in education",
    quote: "I thought burnout meant I chose wrong. Turns out I'd outgrown one version of myself. Pathly showed me who I was becoming — and that changed everything.",
    archetype: "The Educator-Strategist",
  },
  {
    name: "Sofia R.",
    context: "Career pivot at 38",
    quote: "The questions felt almost too personal. Then I realized — that was the point. Every other platform had been asking the wrong questions.",
    archetype: "The Creative-Explorer",
  },
];

/* ── Journey steps ─────────────────────────────────────────────────── */
const steps = [
  {
    step: "01", word: "Reflect", color: "coral", icon: Brain,
    headline: "Peel back the job title",
    body: "Guided questions help you separate who you are from what you do. Your energy, values, and natural tendencies — the parts of you that exist regardless of any employer.",
  },
  {
    step: "02", word: "Discover", color: "violet", icon: Sparkles,
    headline: "See the patterns you've been living",
    body: "AI surfaces the invisible threads connecting everything you've ever done — your curiosity themes, strength signals, and the energy sources you've always had.",
  },
  {
    step: "03", word: "Explore", color: "amber", icon: FlaskConical,
    headline: "Try a direction before committing to it",
    body: "Small experiments. Real signal. Test paths, projects, and ideas aligned to who you actually are — before making any irreversible decisions.",
  },
  {
    step: "04", word: "Design", color: "coral", icon: TrendingUp,
    headline: "Build the chapter that fits",
    body: "Not a career plan. A life design. Skills, communities, experiments — organized around the person you're becoming, not the job market's current mood.",
  },
];

/* ── Features ─────────────────────────────────────────────────────── */
const features = [
  { icon: Brain,        title: "Identity Reset",         desc: "Separate who you are from what you do. Guided reflections reveal the self that was there long before the job title.", color: "coral"  },
  { icon: Compass,      title: "Pattern Discovery",       desc: "Surface the themes that keep appearing across your life. The threads you've been ignoring are your most important signal.", color: "violet" },
  { icon: Sparkles,     title: "AI Identity Profile",     desc: "Your personal narrative — who you're becoming, your archetype, your energy sources, your natural direction.", color: "amber"  },
  { icon: FlaskConical, title: "Path Exploration",        desc: "Directions built on your identity. Not your last role, not the job market — you. Paths you may not have considered.", color: "coral"  },
  { icon: TrendingUp,   title: "Reinvention Roadmap",     desc: "A real plan for your next chapter. Every step tied to who you are — not a recruiter's checklist.", color: "violet" },
  { icon: BookOpen,     title: "Reflection Journal",      desc: "Watch yourself evolve in real time. Track how your self-understanding deepens, week by week.", color: "amber"  },
];

/* ── Archetypes ─────────────────────────────────────────────────── */
const archetypes = [
  { name: "The Builder",    trait: "You're not satisfied until it exists in the world.",      color: "coral",  emoji: "🔨" },
  { name: "The Connector",  trait: "You understand people before they understand themselves.", color: "violet", emoji: "🌐" },
  { name: "The Strategist", trait: "You're already thinking about what everyone else missed.", color: "amber",  emoji: "♟️" },
  { name: "The Explorer",   trait: "You find what's interesting before the world catches on.", color: "coral",  emoji: "🧭" },
  { name: "The Educator",   trait: "You make complicated things feel suddenly obvious.",        color: "violet", emoji: "✨" },
  { name: "The Maker",      trait: "You turn raw materials — ideas, words, code — into art.",  color: "amber",  emoji: "🎨" },
];

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  coral:  { text: "text-coral",  bg: "bg-coral-500/10",  border: "border-coral-500/20"  },
  violet: { text: "text-violet", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  amber:  { text: "text-amber",  bg: "bg-amber-500/10",  border: "border-amber-500/20"  },
};

/* ── Differentiation ──────────────────────────────────────────────── */
const notThis = [
  "Starts with your résumé",
  "Asks what job you want",
  "Optimises for the market",
  "Treats you as a candidate",
];
const yesThis = [
  "Starts with who you are",
  "Asks who you're becoming",
  "Optimises for your life",
  "Treats you as a whole person",
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
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="text-gradient-coral italic inline-block transition-all duration-300"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)" }}
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
    <div
      className="relative rounded-2xl border overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(var(--surface-1)), hsl(var(--surface-2)))",
        borderColor: "hsl(var(--coral) / 0.15)",
      }}
    >
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl pointer-events-none"
        style={{ background: "hsl(var(--coral) / 0.08)" }}
      />
      <div className="p-8">
        <div className="flex items-center gap-2 mb-6">
          <Eye className="w-4 h-4 text-coral" />
          <span className="text-xs font-semibold uppercase tracking-widest text-coral">
            A question for you
          </span>
        </div>
        <div className="min-h-[88px] mb-3 transition-all duration-500">
          <p className="text-xl font-bold text-foreground leading-snug mb-2 font-display">
            "{mirrorQuestions[active].q}"
          </p>
          <p className="text-sm text-muted-foreground italic">
            {mirrorQuestions[active].hint}
          </p>
        </div>
        <div className="flex gap-1.5 mt-5">
          {mirrorQuestions.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? "20px" : "6px",
                height: "6px",
                background: i === active ? "hsl(var(--coral))" : "hsl(var(--border))",
              }}
            />
          ))}
        </div>
      </div>
      <div
        className="border-t px-8 py-4 flex items-center justify-between"
        style={{
          borderColor: "hsl(var(--border))",
          background: "hsl(var(--surface-2) / 0.5)",
        }}
      >
        <span className="text-xs text-muted-foreground">
          Your answers to these reveal more than any résumé.
        </span>
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

      {/* ── HERO — Angle: Lost / Pattern interrupt ──────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div
          className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-50"
          style={{ background: "hsl(var(--coral) / 0.07)" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-40"
          style={{ background: "hsl(var(--rose) / 0.06)" }}
        />

        <div className="container relative z-10 text-center max-w-3xl mx-auto px-6">

          {/* Pattern-interrupt badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-10 animate-fade-up border"
            style={{
              background: "hsl(var(--coral) / 0.08)",
              borderColor: "hsl(var(--coral) / 0.18)",
              color: "hsl(var(--coral))",
            }}
          >
            <Heart className="w-3.5 h-3.5" />
            For the person who built a life that doesn't feel like theirs
          </div>

          {/* Headline — Version A: Lost / Pattern interrupt */}
          <h1 className="font-display text-5xl md:text-7xl text-foreground leading-[1.08] tracking-tight mb-6 animate-fade-up">
            You are more than
            <br />
            <RotatingHook />
          </h1>

          {/* Subheadline — emotionally mirroring, identity-framed */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-4 leading-relaxed animate-fade-up">
            Somewhere along the way, you became your job. Pathly helps you find the person who was there before it — and design what comes next.
          </p>

          {/* Micro-copy — emotionally specific context */}
          <p className="text-sm text-muted-foreground/55 max-w-lg mx-auto mb-10 leading-relaxed animate-fade-up">
            For the person who feels lost after a layoff. Who succeeded at work but feels empty. Who keeps thinking: <em>"there has to be more than this."</em>
          </p>

          {/* CTAs — curiosity-driven, pressure-reducing */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14 animate-fade-up">
            <Link to="/onboarding">
              <Button
                size="lg"
                className="bg-gradient-coral text-primary-foreground font-semibold text-base px-8 py-6 rounded-xl glow-coral hover:opacity-90 transition-all hover:scale-[1.02] group gap-2"
              >
                Start uncovering who you are
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link to="/life-clarity">
              <Button
                size="lg"
                variant="outline"
                className="border-border text-muted-foreground hover:text-foreground hover:border-coral-500/40 text-base px-8 py-6 rounded-xl gap-2 bg-transparent"
              >
                Try a free reflection first
              </Button>
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in flex-wrap">
            {[
              { n: "4 min",  l: "to your first real insight" },
              { n: "Free",   l: "no email required to start" },
              { n: "94%",    l: "say it changed how they see themselves" },
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

      {/* ── THE REAL PROBLEM — Emotional mirroring ─────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="container max-w-2xl px-6 text-center relative z-10">
          <p className="text-coral text-xs font-semibold uppercase tracking-widest mb-4">
            The thing no one talks about
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10 leading-snug">
            Losing a job isn't just financial.<br />
            It's an identity crisis.
          </h2>
          <div className="text-muted-foreground text-base leading-[1.9] space-y-5 text-left max-w-xl mx-auto">
            <p>
              Layoffs. Burnout. A promotion that felt hollow. A career that looks great on paper — and feels completely wrong inside.
            </p>
            <p>
              When your work changes, it doesn't just affect your income. It affects who you are. How you introduce yourself at parties. How you answer "so what do you do?"
            </p>
            <p>
              Most people respond by updating their résumé. By applying to more jobs. By doing more of what already feels wrong.
            </p>
            <div
              className="border-l-2 pl-5 my-6"
              style={{ borderColor: "hsl(var(--coral) / 0.4)" }}
            >
              <p className="text-foreground font-semibold text-lg italic font-display">
                "If I'm not my job title... who am I?"
              </p>
            </div>
            <p>
              That's the question no career platform was built to answer. Pathly was.
            </p>
            <p className="text-foreground font-medium">
              Not with a job recommendation. With a real process of self-discovery — before any path, any plan, any next step.
            </p>
          </div>
        </div>
      </section>

      {/* ── MIRROR MOMENT — Curiosity / self-discovery angle ────────── */}
      <section className="py-24" style={{ background: "hsl(var(--surface-1))" }}>
        <div className="container max-w-2xl px-6">
          <div className="text-center mb-10">
            <p className="text-coral text-xs font-semibold uppercase tracking-widest mb-3">
              Before we talk about paths
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Let's start where it actually matters.
            </h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Other platforms start with your job history. Pathly starts with you.
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
            <p className="text-violet text-xs font-semibold uppercase tracking-widest mb-3">
              What makes Pathly different
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              This isn't a career platform.
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Career platforms ask where you want to go. Pathly asks who you are. That's a different question — and a completely different answer.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div
              className="rounded-2xl border p-6"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface-1))" }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">
                Every other platform
              </p>
              <div className="space-y-3.5">
                {notThis.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "hsl(var(--muted))" }}
                    >
                      <XIcon className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl border p-6"
              style={{ borderColor: "hsl(var(--coral) / 0.2)", background: "hsl(var(--coral) / 0.04)" }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-coral mb-5">Pathly</p>
              <div className="space-y-3.5">
                {yesThis.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "hsl(var(--coral) / 0.15)" }}
                    >
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

      {/* ── ARCHETYPE PEEK — Identity language ──────────────────────── */}
      <section className="py-28" style={{ background: "hsl(var(--surface-1))" }}>
        <div className="container max-w-4xl px-6">
          <div className="text-center mb-12">
            <p className="text-violet text-xs font-semibold uppercase tracking-widest mb-3">
              Which one stops you?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Six ways of being in the world.
              <br />
              <span className="text-gradient-coral">One of them is unmistakably you.</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Not personality types. Not job categories. Identity orientations — the way you've always moved through the world, whether or not you had a word for it.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {archetypes.map((a, i) => {
              const c = colorMap[a.color];
              return (
                <div
                  key={i}
                  className="group bg-gradient-card border border-border/40 rounded-2xl p-5 card-hover cursor-pointer hover:border-coral-500/30 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{a.emoji}</span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${c.text}`}>
                      {a.name}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a.trait}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors">
                    <span>Is this you?</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link to="/onboarding">
              <Button className="bg-gradient-coral text-primary-foreground font-semibold px-8 gap-2 hover:opacity-90">
                Find out which archetype you really are
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground/50 mt-3">
              4 minutes. No email required. No job title asked.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="container max-w-4xl relative z-10 px-6">
          <div className="text-center mb-14">
            <p className="text-amber text-xs font-semibold uppercase tracking-widest mb-3">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              From "I don't know who I am"
              <span className="text-gradient-coral"> to "I know what's next."</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
              Four steps. Your pace. AI that listens instead of pitching.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const c = colorMap[step.color];
              return (
                <div
                  key={i}
                  className="bg-gradient-card border border-border/40 rounded-2xl p-7 card-hover group flex gap-5"
                >
                  <div className="shrink-0">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${c.bg} ${c.border}`}
                    >
                      <span className={`text-sm font-bold ${c.text}`}>{step.step}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-bold uppercase tracking-widest ${c.text}`}>
                        {step.word}
                      </span>
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
            <p className="text-coral text-xs font-semibold uppercase tracking-widest mb-3">
              What's inside
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tools built for real reinvention
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
              Not a job board. Not a résumé builder. A system for understanding who you are — and designing what comes next.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const c = colorMap[f.color];
              return (
                <div
                  key={i}
                  className="bg-gradient-card border border-border/40 rounded-2xl p-6 card-hover group"
                >
                  <div
                    className={`w-9 h-9 ${c.bg} rounded-lg flex items-center justify-center mb-4 transition-colors`}
                  >
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
            <p className="text-violet text-xs font-semibold uppercase tracking-widest mb-3">
              Real stories
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              You're not alone in this feeling.
            </h2>
            <p className="text-muted-foreground text-base max-w-sm mx-auto">
              From people who were sitting exactly where you are now.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-gradient-card border border-border/40 rounded-2xl p-7 flex flex-col"
              >
                <p className="text-xs text-muted-foreground/60 mb-4 italic">{t.context}</p>
                <p className="text-muted-foreground leading-relaxed mb-6 text-sm flex-1">
                  "{t.quote}"
                </p>
                <div>
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  <div
                    className="mt-2 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "hsl(var(--coral) / 0.1)",
                      color: "hsl(var(--coral))",
                      border: "1px solid hsl(var(--coral) / 0.2)",
                    }}
                  >
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
              { label: "Lost",        color: "text-muted-foreground",        desc: "Who am I without the job?" },
              { label: "→",           color: "text-border",                   desc: "" },
              { label: "Curious",     color: "text-violet",                   desc: "What do I actually care about?" },
              { label: "→",           color: "text-border",                   desc: "" },
              { label: "Seen",        color: "text-amber",                    desc: "That's always been me." },
              { label: "→",           color: "text-border",                   desc: "" },
              { label: "Open",        color: "text-coral",                    desc: "There's more than one path." },
              { label: "→",           color: "text-border",                   desc: "" },
              { label: "Clear",       color: "text-foreground font-semibold", desc: "I know who I am. I know what's next." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <span className={`font-medium ${item.color}`}>{item.label}</span>
                {item.desc && (
                  <p className="text-xs text-muted-foreground/40 mt-1 max-w-[90px] leading-tight">
                    {item.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA — Hope / new beginning angle ──────────────────── */}
      <section className="py-36 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-3xl"
          style={{ background: "hsl(var(--coral) / 0.07)" }}
        />

        <div className="container max-w-2xl text-center relative z-10 px-6">
          <div
            className="inline-flex items-center gap-2 border rounded-full px-4 py-2 text-sm font-medium mb-8"
            style={{ borderColor: "hsl(var(--coral) / 0.2)", color: "hsl(var(--coral))" }}
          >
            <Flame className="w-3.5 h-3.5" />
            Your next chapter won't design itself
          </div>

          {/* Final headline — Hope angle */}
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6 leading-[1.1]">
            You already know something
            <br />
            <span className="text-gradient-coral italic">needs to change.</span>
          </h2>

          {/* Final subheadline — Identity-first, empowering */}
          <p className="text-muted-foreground text-lg mb-4 leading-relaxed max-w-lg mx-auto">
            The version of you that exists outside of job titles, LinkedIn profiles, and market demand — that's the version worth designing around.
          </p>

          <p className="text-sm text-muted-foreground/50 italic mb-12">
            4 minutes. No sign-up. No job title asked.
          </p>

          {/* Final CTA — Safe, curious, pressure-reducing */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/onboarding">
              <Button
                size="lg"
                className="bg-gradient-coral text-primary-foreground font-semibold text-base px-10 py-6 rounded-xl glow-coral hover:opacity-90 transition-all hover:scale-[1.02] group gap-2"
              >
                See who you really are
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link to="/framework">
              <Button
                size="lg"
                variant="outline"
                className="border-border text-muted-foreground hover:text-foreground hover:border-coral-500/40 text-base px-8 py-6 rounded-xl gap-2 bg-transparent"
              >
                How Pathly works
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground/35 mt-6">
            Join the people who stopped fitting their life to a job description.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
