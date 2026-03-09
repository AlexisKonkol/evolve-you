import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import heroBg from "@/assets/hero-bg.jpg";
import {
  ArrowRight,
  Brain,
  Map,
  Compass,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Users,
  BookOpen,
  Shield,
  ChevronRight,
  Star,
} from "lucide-react";

const journeySteps = [
  {
    num: "01",
    title: "Identity Discovery",
    desc: "Uncover your strengths, values, and what truly energizes you through AI-guided questions.",
    icon: Brain,
    color: "teal",
  },
  {
    num: "02",
    title: "Skill Translation",
    desc: "Map your existing experience into the language of tomorrow's economy.",
    icon: Map,
    color: "violet",
  },
  {
    num: "03",
    title: "Opportunity Mapping",
    desc: "Discover emerging roles aligned with your identity and global trends.",
    icon: Compass,
    color: "amber",
  },
  {
    num: "04",
    title: "Reinvention Paths",
    desc: "Get a step-by-step roadmap to move from where you are to where you want to be.",
    icon: TrendingUp,
    color: "teal",
  },
  {
    num: "05",
    title: "Continuous Evolution",
    desc: "Keep growing with AI coaching, learning modules, and a global community.",
    icon: RefreshCw,
    color: "violet",
  },
];

const whyCards = [
  {
    icon: Sparkles,
    title: "AI Is Reshaping Every Career",
    body: "44% of job skills will be disrupted by AI in the next 5 years. The question isn't whether your work will change — it's whether you're prepared.",
    stat: "44%",
    statLabel: "of jobs will shift",
  },
  {
    icon: Brain,
    title: "Identity Comes Before Strategy",
    body: "Most career advice starts with job titles. We start with who you are. When you understand your identity, every next step becomes clearer.",
    stat: "3x",
    statLabel: "more likely to succeed",
  },
  {
    icon: RefreshCw,
    title: "Reinvention Is a Skill",
    body: "The most resilient professionals aren't the ones with the most credentials — they're the ones who can continuously adapt and evolve.",
    stat: "∞",
    statLabel: "possible futures",
  },
];

const features = [
  {
    icon: Brain,
    title: "AI Identity Profile",
    desc: "A deep personal map of your strengths, curiosity patterns, work style, and values.",
  },
  {
    icon: Compass,
    title: "Opportunity Scanner",
    desc: "Discover emerging roles powered by real global trends in AI, automation, and the creator economy.",
  },
  {
    icon: TrendingUp,
    title: "Reinvention Roadmaps",
    desc: "Step-by-step transformation plans: exactly what to learn, build, and do next.",
  },
  {
    icon: BookOpen,
    title: "Learning Modules",
    desc: "Short, focused lessons on AI literacy, systems thinking, and career strategy.",
  },
  {
    icon: Sparkles,
    title: "AI Reinvention Coach",
    desc: "A personal AI strategist available 24/7 to answer your toughest career questions.",
  },
  {
    icon: Users,
    title: "Global Community",
    desc: "Connect with thousands navigating the same reinvention journey. You're not alone.",
  },
];

const testimonials = [
  {
    name: "Maya Chen",
    role: "Retail Manager → AI Experience Designer",
    quote: "EVOLVE helped me see that 12 years of customer experience wasn't 'just retail' — it was exactly what AI companies need.",
    stars: 5,
  },
  {
    name: "James Okafor",
    role: "Teacher → Digital Curriculum Creator",
    quote: "I was terrified AI would replace me. Instead, it became my greatest tool. This platform showed me the path.",
    stars: 5,
  },
  {
    name: "Sofia Reyes",
    role: "Accountant → Automation Strategist",
    quote: "The identity map was eye-opening. I thought I needed to start over. Turns out I just needed a new lens.",
    stars: 5,
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-glow)" }}
        />

        {/* Floating orbs */}
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-teal-500/8 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-violet-500/8 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-amber-500/8 blur-3xl animate-pulse delay-500" />

        <div className="container relative z-10 text-center max-w-5xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-2 text-sm text-teal font-medium mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4" />
            AI-Powered Career Reinvention Platform
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight mb-6 animate-fade-up">
            <span className="text-foreground">Reinvent Yourself</span>
            <br />
            <span className="font-display italic text-gradient-teal">in the Age of AI</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up">
            Technology is changing the world faster than ever. Your job was never your identity.{" "}
            <span className="text-foreground font-medium">Design what comes next.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up">
            <Link to="/onboarding">
              <Button
                size="lg"
                className="bg-gradient-teal text-primary-foreground font-bold text-base px-8 py-6 rounded-xl glow-teal hover:opacity-90 transition-all hover:scale-105 group"
              >
                Start Your Reinvention
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-border text-muted-foreground hover:text-foreground hover:border-teal-500/50 text-base px-8 py-6 rounded-xl bg-transparent"
              >
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-8 mt-14 text-sm text-muted-foreground animate-fade-in">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">50K+</div>
              <div>people evolving</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">200+</div>
              <div>future roles mapped</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">94%</div>
              <div>found clarity</div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50 text-xs animate-bounce">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-muted-foreground/30" />
          scroll
        </div>
      </section>

      {/* Why it matters */}
      <section className="py-24 relative">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-3">The Moment We're In</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why now is the right time
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              AI isn't the problem. Being unprepared is. Here's what's happening — and why identity-first reinvention is the answer.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {whyCards.map((c, i) => (
              <div
                key={i}
                className="bg-gradient-card border border-border/50 rounded-2xl p-8 hover:border-teal-500/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition-colors">
                  <c.icon className="w-6 h-6 text-teal" />
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-bold text-gradient-teal">{c.stat}</span>
                  <span className="text-sm text-muted-foreground">{c.statLabel}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{c.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5-Step Journey */}
      <section className="py-24 bg-surface-1 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="container max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <p className="text-amber text-sm font-semibold uppercase tracking-widest mb-3">The Reinvention Journey</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Five steps to your next chapter
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A guided, AI-powered process designed around how humans actually change.
            </p>
          </div>

          <div className="space-y-4">
            {journeySteps.map((step, i) => {
              const Icon = step.icon;
              const colorMap: Record<string, string> = {
                teal: "text-teal bg-teal-500/10 border-teal-500/20",
                violet: "text-violet-500 bg-violet-500/10 border-violet-500/20",
                amber: "text-amber bg-amber-500/10 border-amber-500/20",
              };
              const colorClass = colorMap[step.color];
              return (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-start gap-6 bg-gradient-card border border-border/50 rounded-2xl p-6 md:p-8 hover:border-teal-500/20 transition-all group"
                >
                  <div className="flex items-center gap-4 sm:w-16 shrink-0">
                    <span className="text-3xl font-bold text-muted-foreground/30 font-display w-12">{step.num}</span>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClass} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-teal transition-colors hidden sm:block shrink-0 self-center" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-3">Everything You Need</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Built for complete reinvention
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Not a job board. Not a resume tool. A full reinvention operating system.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-gradient-card border border-border/50 rounded-2xl p-6 hover:border-teal-500/30 transition-all group hover:-translate-y-1 duration-300"
              >
                <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-500/20 transition-colors">
                  <f.icon className="w-5 h-5 text-teal" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-surface-1">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-violet-500 text-sm font-semibold uppercase tracking-widest mb-3">Real Reinventions</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Their story could be yours
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gradient-card border border-border/50 rounded-2xl p-7">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber fill-current" />
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

      {/* Philosophy / CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal-500/8 rounded-full blur-3xl" />

        <div className="container max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 border border-teal-500/20 rounded-full px-4 py-2 text-sm text-teal font-medium mb-8">
            <Shield className="w-4 h-4" />
            Our Core Philosophy
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            The future doesn't belong to people with one career.
            <br />
            <span className="font-display italic text-gradient-teal">It belongs to those who can evolve.</span>
          </h2>
          <p className="text-muted-foreground text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Start building that ability today. Your reinvention begins with a single conversation.
          </p>
          <Link to="/onboarding">
            <Button
              size="lg"
              className="bg-gradient-teal text-primary-foreground font-bold text-lg px-10 py-7 rounded-xl glow-teal hover:opacity-90 transition-all hover:scale-105 group"
            >
              Begin Your Reinvention Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-muted-foreground/60 text-sm mt-4">Free forever. No credit card required.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
