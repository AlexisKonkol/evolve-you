import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowRight, Sparkles, Brain, Compass, FlaskConical,
  TrendingUp, Star, Users, BookOpen, Shield,
} from "lucide-react";

/* ── PATH Method steps ─────────────────────────────────── */
const pathSteps = [
  {
    letter: "P",
    word: "Pause",
    color: "coral",
    icon: Brain,
    headline: "Slow down and reflect",
    body: "Answer reflective questions that help you understand your life, interests, strengths, and motivations more clearly.",
  },
  {
    letter: "A",
    word: "Assess",
    color: "violet",
    icon: Compass,
    headline: "Know your strengths",
    body: "Identify your natural skills, values, and experiences. Pathly generates an identity profile that highlights your patterns and capabilities.",
  },
  {
    letter: "T",
    word: "Test",
    color: "amber",
    icon: FlaskConical,
    headline: "Explore what's possible",
    body: "Run small experiments. Discover new career paths and opportunities. Learn what energises you without committing to anything.",
  },
  {
    letter: "H",
    word: "Head Forward",
    color: "coral",
    icon: TrendingUp,
    headline: "Design your next chapter",
    body: "Build a clear, step-by-step plan toward the life you truly want — with AI as your guide and a community beside you.",
  },
];

/* ── Features ──────────────────────────────────────────── */
const features = [
  { icon: Brain,       title: "Life Clarity",      desc: "Become the kind of person who knows exactly what they value and why. Deep reflection that reveals who you already are." },
  { icon: Compass,     title: "Future Vision",      desc: "Stop asking what you should do next. See who you're becoming — and step into that version of yourself." },
  { icon: FlaskConical,title: "Micro-Experiments",  desc: "Explore the paths that match who you are becoming. Test new directions without committing to anything." },
  { icon: TrendingUp,  title: "Career Paths",       desc: "Become someone with a clear, step-by-step direction. Not generic advice — your path, built around your identity." },
  { icon: BookOpen,    title: "Focused Learning",   desc: "Become the kind of person who builds new skills. Short, practical lessons designed around your emerging identity." },
  { icon: Users,       title: "A Community",        desc: "Become part of something bigger. Thousands of people on the same journey — none of you are doing this alone." },
];

/* ── Testimonials ──────────────────────────────────────── */
const testimonials = [
  {
    name: "Maya Chen",
    role: "Retail → AI Experience Design",
    quote: "Pathly helped me see that 12 years in customer experience wasn't 'just retail' — it was exactly what AI companies need.",
    stars: 5,
  },
  {
    name: "James Okafor",
    role: "Teacher → Digital Curriculum",
    quote: "I was scared AI would replace me. Instead it became my greatest tool. Pathly showed me the way.",
    stars: 5,
  },
  {
    name: "Sofia Reyes",
    role: "Accountant → Automation Strategy",
    quote: "The identity map was eye-opening. I thought I needed to start over. Turns out I just needed a new lens.",
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
            Who are you becoming?
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl text-foreground leading-[1.08] tracking-tight mb-6 animate-fade-up">
            Find Your
            <br />
            <span className="text-gradient-coral italic">Next Path.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed animate-fade-up">
            The world is changing faster than ever. Pathly helps you discover who you are, see who you're becoming, and step into your next chapter — with AI as your guide.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16 animate-fade-up">
            <Link to="/onboarding">
              <Button size="lg"
                className="bg-gradient-coral text-primary-foreground font-semibold text-base px-8 py-6 rounded-xl glow-coral hover:opacity-90 transition-all hover:scale-[1.02] group gap-2">
                Start Your Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link to="/life-clarity">
              <Button size="lg" variant="outline"
                className="border-border text-muted-foreground hover:text-foreground hover:border-coral-500/40 text-base px-8 py-6 rounded-xl gap-2 bg-transparent">
                Try Life Clarity
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-10 text-sm text-muted-foreground animate-fade-in">
            {[
              { n: "50K+", l: "people finding their path" },
              { n: "200+", l: "futures mapped" },
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
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-muted-foreground mx-auto" />
        </div>
      </section>

      {/* ── Why Pathly Exists ─────────────────────────────────── */}
      <section className="py-32" style={{ background: "hsl(var(--surface-1))" }}>
        <div className="container max-w-2xl px-6 text-center">
          <p className="text-coral text-xs font-semibold uppercase tracking-widest mb-4">Our story</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10 leading-snug">
            Why Pathly Exists
          </h2>

          <div className="text-muted-foreground text-base leading-[1.9] space-y-5 text-left max-w-xl mx-auto">
            <p>At some point, almost everyone feels lost.</p>
            <p>Not because they lack talent.<br />Not because they lack ambition.</p>
            <p>But because the world is changing faster than ever.</p>
            <div className="border-l-2 pl-5 space-y-2 my-6" style={{ borderColor: "hsl(var(--coral) / 0.4)" }}>
              <p className="text-foreground/80">Careers are shifting.</p>
              <p className="text-foreground/80">Industries are evolving.</p>
              <p className="text-foreground/80">Artificial intelligence is redefining what's possible.</p>
            </div>
            <p>Many people are left asking a simple question:</p>
            <p className="text-lg font-semibold text-foreground italic font-display">
              "What should I do next?"
            </p>
            <p>
              Pathly helps people rediscover their direction, unlock their strengths, and design a path toward the life they truly want.
            </p>
          </div>
        </div>
      </section>

      {/* ── The PATH Method ───────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="container max-w-4xl relative z-10 px-6">
          <div className="text-center mb-14">
            <p className="text-amber text-xs font-semibold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The{" "}
              <span className="text-gradient-coral">PATH</span>
              {" "}Method
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
              A simple, powerful framework that guides your entire Pathly experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {pathSteps.map((step, i) => {
              const Icon = step.icon;
              const c = colorMap[step.color];
              return (
                <div key={i}
                  className="bg-gradient-card border border-border/40 rounded-2xl p-7 card-hover group flex gap-5">
                  {/* Letter badge */}
                  <div className="shrink-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${c.bg} ${c.border}`}>
                      <span className={`text-xl font-bold ${c.text}`}>{step.letter}</span>
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
            <p className="text-coral text-xs font-semibold uppercase tracking-widest mb-3">Everything you need</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Built for real reinvention</h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
              Not a job board. Not a resume tool. A complete system for becoming who you're meant to be next.
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
            <p className="text-violet text-xs font-semibold uppercase tracking-widest mb-3">Real paths taken</p>
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
                  <div className="text-xs text-coral mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-36 relative overflow-hidden" style={{ background: "hsl(var(--surface-1))" }}>
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-3xl"
          style={{ background: "hsl(var(--coral) / 0.07)" }} />

        <div className="container max-w-2xl text-center relative z-10 px-6">
          <div className="inline-flex items-center gap-2 border rounded-full px-4 py-2 text-sm font-medium mb-8"
            style={{ borderColor: "hsl(var(--coral) / 0.2)", color: "hsl(var(--coral))" }}>
            <Shield className="w-3.5 h-3.5" />
            Our belief
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6 leading-[1.1]">
            The future belongs to those
            <br />
            <span className="text-gradient-coral italic">who keep evolving.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-12 leading-relaxed">
            Your next path is waiting. It begins with a single honest question.
          </p>
          <Link to="/onboarding">
            <Button size="lg"
              className="bg-gradient-coral text-primary-foreground font-semibold text-base px-10 py-6 rounded-xl glow-coral hover:opacity-90 transition-all hover:scale-[1.02] group gap-2">
              Start Your Journey
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
