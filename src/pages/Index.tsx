import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowRight, Brain, Map, Compass, TrendingUp,
  RefreshCw, Sparkles, Users, BookOpen, Shield,
  Star, Eye, Zap,
} from "lucide-react";

const journeySteps = [
  { num: "01", title: "Discover who you are",       desc: "Uncover the strengths, values, and energy patterns that are uniquely yours.", icon: Brain,      color: "teal"   },
  { num: "02", title: "Translate your experience",  desc: "See how everything you've done becomes an asset in a changing world.",       icon: Map,        color: "violet" },
  { num: "03", title: "Find your direction",        desc: "Explore emerging roles that actually align with who you are.",               icon: Compass,    color: "amber"  },
  { num: "04", title: "Build your path",            desc: "Get a clear, step-by-step plan — not advice, a real roadmap.",              icon: TrendingUp, color: "teal"   },
  { num: "05", title: "Keep evolving",              desc: "AI coaching, focused learning, and a community to grow with.",              icon: RefreshCw,  color: "violet" },
];

const whyCards = [
  {
    icon: Sparkles,
    title: "AI is changing work",
    body: "44% of job skills will shift in the next five years. The people who thrive won't be the most credentialed — they'll be the most adaptable.",
    stat: "44%", statLabel: "of skills will shift",
  },
  {
    icon: Brain,
    title: "Identity first",
    body: "Most advice starts with job titles. We start with who you are. When your direction is grounded in your identity, everything becomes clearer.",
    stat: "3×", statLabel: "clarity when purpose-led",
  },
  {
    icon: RefreshCw,
    title: "Reinvention is learnable",
    body: "The most resilient people aren't the most qualified. They're the ones who know how to adapt, evolve, and build something new from what they have.",
    stat: "∞", statLabel: "possible next chapters",
  },
];

const features = [
  { icon: Brain,     title: "Who You Are",       desc: "A deep personal map of your strengths, values, work style, and what energizes you." },
  { icon: Compass,   title: "Your Next Role",     desc: "Emerging opportunities matched to your identity and real global trends." },
  { icon: TrendingUp,title: "Your Roadmap",       desc: "A clear path: what to learn, what to build, what to do next — step by step." },
  { icon: BookOpen,  title: "Focused Learning",   desc: "Short lessons on AI literacy, systems thinking, and reinvention strategy." },
  { icon: Sparkles,  title: "AI Coach",           desc: "A personal strategist available 24/7. Ask it anything about your direction." },
  { icon: Users,     title: "A Community",        desc: "Thousands of people on the same journey. You're not doing this alone." },
];

const testimonials = [
  {
    name: "Maya Chen",  role: "Retail → AI Experience Design",
    quote: "EVOLVE helped me see that 12 years of customer experience wasn't 'just retail' — it was exactly what AI companies need.",
    stars: 5,
  },
  {
    name: "James Okafor", role: "Teacher → Digital Curriculum",
    quote: "I was scared AI would replace me. Instead, it became my greatest tool. This platform showed me the path.",
    stars: 5,
  },
  {
    name: "Sofia Reyes", role: "Accountant → Automation Strategy",
    quote: "The identity map was eye-opening. I thought I needed to start over. Turns out I just needed a new lens.",
    stars: 5,
  },
];

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  teal:   { text: "text-teal",   bg: "bg-teal-500/10",   border: "border-teal-500/20"   },
  violet: { text: "text-violet", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  amber:  { text: "text-amber",  bg: "bg-amber-500/10",  border: "border-amber-500/20"  },
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Soft ambient background */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-60"
          style={{ background: "hsl(var(--teal) / 0.07)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-50"
          style={{ background: "hsl(var(--violet) / 0.06)" }} />

        <div className="container relative z-10 text-center max-w-4xl mx-auto px-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-10 animate-fade-up border"
            style={{ background: "hsl(var(--teal) / 0.08)", borderColor: "hsl(var(--teal) / 0.18)", color: "hsl(var(--teal))" }}>
            <Sparkles className="w-3.5 h-3.5" />
            AI-powered career reinvention
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl text-foreground leading-[1.08] tracking-tight mb-6 animate-fade-up">
            Know yourself.<br />
            <span className="text-gradient-teal italic">Build what's next.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed animate-fade-up">
            The world is changing fast. EVOLVE helps you understand who you are, where you fit, and how to get there — with AI as your guide.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16 animate-fade-up">
            <Link to="/onboarding">
              <Button size="lg"
                className="bg-gradient-teal text-primary-foreground font-semibold text-base px-8 py-6 rounded-xl glow-teal hover:opacity-90 transition-all hover:scale-[1.02] group gap-2">
                Start for free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link to="/life-clarity">
              <Button size="lg" variant="outline"
                className="border-border text-muted-foreground hover:text-foreground hover:border-teal-500/40 text-base px-8 py-6 rounded-xl gap-2 bg-transparent">
                <Eye className="w-4 h-4" />
                Try Life Clarity
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-10 text-sm text-muted-foreground animate-fade-in">
            {[
              { n: "50K+", l: "people evolving" },
              { n: "200+", l: "future roles mapped" },
              { n: "94%",  l: "found clarity" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl font-bold text-foreground tracking-tight">{s.n}</div>
                <div className="text-xs mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/40 text-xs animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-muted-foreground/25" />
        </div>
      </section>

      {/* ── Why it matters ─────────────────────────────────────── */}
      <section className="py-28 relative">
        <div className="container max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-teal text-xs font-semibold uppercase tracking-widest mb-3">The moment we're in</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why now matters</h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
              AI isn't the threat. Being unprepared is. Here's what's shifting — and why identity-first reinvention is the answer.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {whyCards.map((c, i) => (
              <div key={i}
                className="bg-gradient-card border border-border/50 rounded-2xl p-7 card-hover group">
                <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-teal-500/15 transition-colors">
                  <c.icon className="w-5 h-5 text-teal" />
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold text-gradient-teal">{c.stat}</span>
                  <span className="text-xs text-muted-foreground">{c.statLabel}</span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5-Step Journey ──────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden" style={{ background: "hsl(var(--surface-1))" }}>
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="container max-w-3xl relative z-10 px-6">
          <div className="text-center mb-14">
            <p className="text-amber text-xs font-semibold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Five steps to your next chapter</h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
              A guided, AI-powered process built around how people actually change.
            </p>
          </div>

          <div className="space-y-3">
            {journeySteps.map((step, i) => {
              const Icon = step.icon;
              const c = colorMap[step.color];
              return (
                <div key={i}
                  className="flex items-start gap-5 bg-gradient-card border border-border/40 rounded-2xl p-6 card-hover group cursor-default">
                  <span className="text-2xl font-bold tabular-nums shrink-0 mt-0.5"
                    style={{ color: "hsl(var(--border))", fontVariantNumeric: "tabular-nums" }}>{step.num}</span>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 ${c.bg} ${c.border}`}>
                    <Icon className={`w-4 h-4 ${c.text}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="py-28">
        <div className="container max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-teal text-xs font-semibold uppercase tracking-widest mb-3">Everything you need</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Built for real reinvention</h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
              Not a job board. Not a resume tool. A complete system for becoming who you're meant to be next.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i}
                className="bg-gradient-card border border-border/40 rounded-2xl p-6 card-hover group">
                <div className="w-9 h-9 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-500/15 transition-colors">
                  <f.icon className="w-4 h-4 text-teal" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────── */}
      <section className="py-28" style={{ background: "hsl(var(--surface-1))" }}>
        <div className="container max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-violet text-xs font-semibold uppercase tracking-widest mb-3">Real reinventions</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Their story could be yours</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gradient-card border border-border/40 rounded-2xl p-7">
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-amber fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 text-sm">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-teal mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-3xl"
          style={{ background: "hsl(var(--teal) / 0.07)" }} />

        <div className="container max-w-2xl text-center relative z-10 px-6">
          <div className="inline-flex items-center gap-2 border rounded-full px-4 py-2 text-sm font-medium mb-8"
            style={{ borderColor: "hsl(var(--teal) / 0.2)", color: "hsl(var(--teal))" }}>
            <Shield className="w-3.5 h-3.5" />
            Our belief
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6 leading-[1.1]">
            The future belongs to those<br />
            <span className="text-gradient-teal italic">who keep evolving.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-12 leading-relaxed">
            Start building that ability today. Your reinvention begins with a single honest question.
          </p>
          <Link to="/onboarding">
            <Button size="lg"
              className="bg-gradient-teal text-primary-foreground font-semibold text-base px-10 py-6 rounded-xl glow-teal hover:opacity-90 transition-all hover:scale-[1.02] group gap-2">
              Begin your journey
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          <p className="text-muted-foreground/50 text-sm mt-4">Free forever · No credit card required</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
