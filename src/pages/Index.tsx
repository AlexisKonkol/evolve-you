import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowRight, Sparkles, Brain, Compass, FlaskConical,
  TrendingUp, Star, Users, BookOpen, Heart, Zap, Shield,
} from "lucide-react";

/* ── Transformation steps ─────────────────────────────── */
const steps = [
  {
    step: "01",
    word: "Reset",
    color: "coral",
    icon: Brain,
    headline: "Separate your identity from your job",
    body: "Most people define themselves by what they do. Pathly helps you reconnect with who you actually are — your energy, values, and natural tendencies — independent of any job title.",
  },
  {
    step: "02",
    word: "Discover",
    color: "violet",
    icon: Sparkles,
    headline: "Uncover your patterns and strengths",
    body: "AI analyzes your reflections to surface curiosity themes, strength signals, and energy drivers — the building blocks of your real identity.",
  },
  {
    step: "03",
    word: "Explore",
    color: "amber",
    icon: FlaskConical,
    headline: "See what's possible for someone like you",
    body: "Discover paths, projects, and experiments aligned to your identity — not your old resume. Run small tests without committing to anything.",
  },
  {
    step: "04",
    word: "Design",
    color: "coral",
    icon: TrendingUp,
    headline: "Design the next chapter of your life",
    body: "Build a reinvention roadmap. Skills to develop, communities to join, experiments to run. A life that fits who you're becoming — not who you were.",
  },
];

/* ── Features ──────────────────────────────────────────── */
const features = [
  { icon: Brain,        title: "Identity Reset",         desc: "Separate who you are from what you do. A reflective experience that helps you rediscover your real self." },
  { icon: Compass,      title: "Pattern Discovery",      desc: "Surface the themes, strengths, and drives that appear across all your reflections. Your identity fingerprint." },
  { icon: Sparkles,     title: "AI Identity Profile",    desc: "A personal narrative that captures who you're becoming — your archetype, values, working style, and what energizes you." },
  { icon: FlaskConical, title: "Path Exploration",       desc: "Paths aligned to your identity, not your job history. Careers, creative projects, entrepreneurial directions, and more." },
  { icon: TrendingUp,   title: "Reinvention Roadmap",    desc: "A non-linear plan for exploring your next chapter. Skills to build, experiments to run, people to learn from." },
  { icon: BookOpen,     title: "Reflection & Growth",    desc: "Track your evolution over time. Journal, log curiosity, and watch your self-understanding deepen with every session." },
];

/* ── Testimonials ──────────────────────────────────────── */
const testimonials = [
  {
    name: "Maya Chen",
    context: "After a tech layoff",
    quote: "I spent three months applying to jobs that felt wrong. Pathly helped me realize I wasn't looking for a new job — I was looking for a new identity. That shift changed everything.",
    stars: 5,
  },
  {
    name: "James Okafor",
    context: "After 10 years in education",
    quote: "I thought burnout meant I'd chosen the wrong career. Turns out I'd just outgrown one version of myself. Pathly helped me see who I was becoming next.",
    stars: 5,
  },
  {
    name: "Sofia Reyes",
    context: "Career transition at 38",
    quote: "The identity questions felt almost too personal at first. Then I realized that's exactly what was missing from every other career platform I'd tried.",
    stars: 5,
  },
];

/* ── Color maps ────────────────────────────────────────── */
const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  coral:  { text: "text-coral",  bg: "bg-coral-500/10",  border: "border-coral-500/20"  },
  violet: { text: "text-violet", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  amber:  { text: "text-amber",  bg: "bg-amber-500/10",  border: "border-amber-500/20"  },
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-50"
          style={{ background: "hsl(var(--coral) / 0.07)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-40"
          style={{ background: "hsl(var(--rose) / 0.06)" }} />

        <div className="container relative z-10 text-center max-w-3xl mx-auto px-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-10 animate-fade-up border"
            style={{ background: "hsl(var(--coral) / 0.08)", borderColor: "hsl(var(--coral) / 0.18)", color: "hsl(var(--coral))" }}>
            <Sparkles className="w-3.5 h-3.5" />
            A platform for discovering your path
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl text-foreground leading-[1.08] tracking-tight mb-6 animate-fade-up">
            You are not
            <br />
            <span className="text-gradient-coral italic">your job title.</span>
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
                Try a reflection
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-10 text-sm text-muted-foreground animate-fade-in">
            {[
              { n: "50K+",  l: "people rediscovering themselves" },
              { n: "94%",   l: "shifted their self-perception" },
              { n: "4.9★",  l: "from users in transition" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl font-bold text-foreground tracking-tight">{s.n}</div>
                <div className="text-xs mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-muted-foreground mx-auto" />
        </div>
      </section>

      {/* ── The Real Problem ─────────────────────────────────── */}
      <section className="py-32" style={{ background: "hsl(var(--surface-1))" }}>
        <div className="container max-w-2xl px-6 text-center">
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

      {/* ── How It Works ──────────────────────────────────────── */}
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

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="py-32" style={{ background: "hsl(var(--surface-1))" }}>
        <div className="container max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-coral text-xs font-semibold uppercase tracking-widest mb-3">Platform features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Built for real reinvention</h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
              Not a job board. Not a resume tool. A complete system for discovering who you are and designing what comes next.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i}
                className="bg-gradient-card border border-border/40 rounded-2xl p-6 card-hover group">
                <div className="w-9 h-9 bg-coral-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-coral-500/15 transition-colors">
                  <f.icon className="w-4 h-4 text-coral" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="py-32">
        <div className="container max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-violet text-xs font-semibold uppercase tracking-widest mb-3">Real stories</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">You're not the only one who felt this way</h2>
            <p className="text-muted-foreground text-base max-w-sm mx-auto">From people who were exactly where you are now.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gradient-card border border-border/40 rounded-2xl p-7">
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-amber fill-current" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground/60 mb-4 italic">{t.context}</p>
                <p className="text-muted-foreground leading-relaxed mb-6 text-sm">"{t.quote}"</p>
                <div className="font-semibold text-foreground text-sm">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Identity arc ─────────────────────────────────────── */}
      <section className="py-24" style={{ background: "hsl(var(--surface-1))" }}>
        <div className="container max-w-3xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">The emotional arc Pathly guides you through</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            {[
              { label: "Confusion", color: "text-muted-foreground" },
              { label: "→", color: "text-border" },
              { label: "Curiosity", color: "text-violet" },
              { label: "→", color: "text-border" },
              { label: "Recognition", color: "text-amber" },
              { label: "→", color: "text-border" },
              { label: "Possibility", color: "text-coral" },
              { label: "→", color: "text-border" },
              { label: "Agency", color: "text-foreground font-semibold" },
            ].map((item, i) => (
              <span key={i} className={`font-medium ${item.color}`}>{item.label}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-36 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-3xl"
          style={{ background: "hsl(var(--coral) / 0.07)" }} />

        <div className="container max-w-2xl text-center relative z-10 px-6">
          <div className="inline-flex items-center gap-2 border rounded-full px-4 py-2 text-sm font-medium mb-8"
            style={{ borderColor: "hsl(var(--coral) / 0.2)", color: "hsl(var(--coral))" }}>
            <Heart className="w-3.5 h-3.5" />
            A deeper kind of career platform
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6 leading-[1.1]">
            The next chapter starts with
            <br />
            <span className="text-gradient-coral italic">knowing who you are.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-12 leading-relaxed">
            Most platforms start with what job you want. Pathly starts with who you actually are. That one difference changes everything.
          </p>
          <Link to="/onboarding">
            <Button size="lg"
              className="bg-gradient-coral text-primary-foreground font-semibold text-base px-10 py-6 rounded-xl glow-coral hover:opacity-90 transition-all hover:scale-[1.02] group gap-2">
              Begin your identity discovery
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          <p className="text-muted-foreground/50 text-sm mt-4">Free to start · No job title required</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
