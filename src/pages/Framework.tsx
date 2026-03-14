import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Zap, Target, Compass, Heart, Globe, Layers,
  ArrowRight, ChevronDown, ChevronUp, Sparkles,
  Brain, FlaskConical, Map, TrendingUp,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   THE PATH SIGNAL FRAMEWORK
   6 dimensions × identity synthesis → life direction
───────────────────────────────────────────────────────────────── */

const frameworkName = "The PATH Signal Framework";
const frameworkTagline = "A psychologically grounded model for mapping who you are beyond your job — and where that points.";

const overview = [
  {
    letter: "P",
    word: "Patterns",
    sub: "What consistently shows up across your life",
    color: "coral",
  },
  {
    letter: "A",
    word: "Activation",
    sub: "What makes you come alive",
    color: "amber",
  },
  {
    letter: "T",
    word: "Truth",
    sub: "What you actually value at the core",
    color: "violet",
  },
  {
    letter: "H",
    word: "Horizon",
    sub: "Where those signals point you",
    color: "rose",
  },
];

const dimensions = [
  {
    id: "energy",
    number: "01",
    icon: Zap,
    name: "Energy Signature",
    color: "coral",
    pillar: "P — Patterns",
    tagline: "What fills you vs. what drains you",
    what: "Measures the specific conditions, activities, and interactions that create natural momentum for you — and which ones consistently deplete you.",
    why: "Energy is the most honest signal in self-discovery. You can fake motivation. You cannot fake energy. When someone consistently loses track of time doing something, that's a signal worth following — regardless of whether it matches their career history.",
    psychBasis: "Csikszentmihalyi's Flow Theory shows that optimal experience occurs when challenge matches skill in intrinsically motivating conditions. Energy signatures predict flow states better than interest surveys.",
    questions: [
      "Describe the last time you lost track of time completely. What were you doing?",
      "What kind of work feels effortless to start, even when you're tired?",
      "After what types of activities do you feel more energized than when you started?",
      "What have you done purely for the pleasure of doing it — with no external reward?",
    ],
    insight: "\"You consistently find energy in [connecting ideas across different domains] — this is a rare cognitive strength that shows up in roles like strategist, synthesizer, and designer of complex systems.\"",
    visualization: "Energy Pulse Map — a radial chart showing high-energy vs. low-energy activity clusters",
  },
  {
    id: "strengths",
    number: "02",
    icon: Target,
    name: "Strength Signals",
    color: "amber",
    pillar: "P — Patterns",
    tagline: "Natural abilities that show up without trying",
    what: "Identifies natural capabilities that appear consistently across different contexts — the things people remark on, the problems others instinctively bring to you.",
    why: "Most people undervalue their natural strengths because they feel easy. What comes effortlessly to you is often exceptional to others. Strength signals are best detected through pattern recognition across multiple life contexts — not a single career.",
    psychBasis: "Positive Psychology (Seligman, Peterson) distinguishes between achieved skills and character strengths. Signature strengths create both performance and wellbeing when used regularly.",
    questions: [
      "What do people consistently come to you for help with — across all areas of life, not just work?",
      "What skills have you developed across completely different jobs or roles?",
      "What kinds of problems do you solve that others seem to find genuinely difficult?",
      "What have you been praised for so often that it's started to feel unremarkable to you?",
    ],
    insight: "\"You have an unusual combination of [systems thinking] and [human empathy] — a signal profile that typically belongs to people who bridge between technical teams and human needs.\"",
    visualization: "Strength Cluster Diagram — overlapping circles showing where natural abilities concentrate",
  },
  {
    id: "curiosity",
    number: "03",
    icon: Compass,
    name: "Curiosity Threads",
    color: "violet",
    pillar: "A — Activation",
    tagline: "The ideas you keep returning to",
    what: "Maps the persistent intellectual and creative territories your mind keeps revisiting — the topics you read about without being asked, the problems you think about on weekends.",
    why: "Sustained curiosity is one of the strongest predictors of long-term fulfillment. Unlike skill, curiosity cannot be manufactured. When you track what someone returns to over years, you find the direction their life wants to go.",
    psychBasis: "Information Gap Theory (Loewenstein) explains that curiosity arises when we perceive a gap between what we know and what we want to know. Persistent curiosity threads reveal identity-level drives, not passing interests.",
    questions: [
      "What topics have you explored purely out of interest — in books, videos, or conversations — for more than two years?",
      "What kind of content do you consume when no one is watching and nothing is required?",
      "If you had unlimited time to learn anything, what would you explore first?",
      "What subjects were you fascinated by as a child that still show up in different forms today?",
    ],
    insight: "\"Your curiosity consistently orbits [human decision-making and systems design] — two threads that rarely appear together and signal someone built for [behavioral design or organizational strategy].\"",
    visualization: "Curiosity Web — an interconnected node diagram showing how interest threads connect across time",
  },
  {
    id: "values",
    number: "04",
    icon: Heart,
    name: "Value Anchors",
    color: "rose",
    pillar: "T — Truth",
    tagline: "What you can't compromise on",
    what: "Identifies the non-negotiable principles that guide decisions — especially under pressure. These aren't stated values. They're revealed values, surfaced through how you've actually behaved at key decision points.",
    why: "Most life dissatisfaction comes from value misalignment, not skill deficiency. When someone's daily work conflicts with their deep values, no amount of competence creates fulfillment. Values are the invisible architecture of identity.",
    psychBasis: "Self-Determination Theory (Deci & Ryan) identifies autonomy, mastery, and belonging as universal psychological needs. Personal value systems are the individual layer on top — they determine which specific expression of these needs feels right.",
    questions: [
      "Describe a decision you made that cost you something but still felt right. What principle drove it?",
      "What injustice or problem in the world genuinely angers you — not because it's trendy, but because it personally bothers you?",
      "What environments or situations make you feel like you're compromising who you are?",
      "Looking back at your proudest moments: what do they have in common?",
    ],
    insight: "\"Your choices consistently reflect a deep value around [independence and original thinking] — you've repeatedly chosen creative freedom over security. This is a defining signal for entrepreneurial or pioneering paths.\"",
    visualization: "Value Compass — a four-quadrant map positioning the user's core anchors relative to major life domains",
  },
  {
    id: "environment",
    number: "05",
    icon: Globe,
    name: "Environment Fit",
    color: "amber",
    pillar: "T — Truth",
    tagline: "The conditions where you do your best work",
    what: "Captures the specific structural, social, and creative conditions under which the person consistently performs, thinks, and creates at their highest level.",
    why: "Talent is context-dependent. A person who thrives in autonomous, self-directed environments may struggle in highly structured ones — not because of lack of skill, but because of environmental mismatch. Environment fit determines whether strengths can actually activate.",
    psychBasis: "Person-Environment Fit Theory (Holland, Dawis & Lofquist) demonstrates that congruence between a person's characteristics and their environment predicts both performance and job satisfaction more reliably than skills alone.",
    questions: [
      "When have you felt most free to do your best thinking? What were the conditions?",
      "Do you do better work alone with deep focus or in collaborative, dynamic situations?",
      "What pace of change energizes you — rapid iteration or careful, considered progress?",
      "What was the best environment you ever worked or created in? What made it different?",
    ],
    insight: "\"You show a strong preference for [low-structure, high-trust environments with creative latitude] — a profile that indicates you'll significantly underperform in conventional corporate settings regardless of competence.\"",
    visualization: "Environment Matrix — a 2×2 showing the user's ideal work conditions across autonomy, pace, collaboration, and structure dimensions",
  },
  {
    id: "narrative",
    number: "06",
    icon: Layers,
    name: "Identity Narrative",
    color: "coral",
    pillar: "H — Horizon",
    tagline: "The story you're telling about who you're becoming",
    what: "Synthesizes all five dimensions into a coherent identity story — not who you were, but who you are becoming. Captures the through-line of the person's life across change and transition.",
    why: "Identity is not a fixed state — it is an evolving narrative. People who successfully navigate major life transitions do so by constructing a coherent story that connects their past self to their future possibilities. This dimension anchors everything else.",
    psychBasis: "McAdams' Narrative Identity Theory shows that personal identity is essentially the internalized story we tell about ourselves. Pathly helps users author a forward-facing identity narrative rather than defining themselves by their past roles.",
    questions: [
      "If the best version of yourself looked back on this period in five years, what would they say it was really about?",
      "What old version of yourself are you outgrowing right now?",
      "What are you becoming — not doing, but becoming?",
      "What chapter of your life is this, and what needs to be true by the end of it?",
    ],
    insight: "\"Your answers consistently describe someone in the middle of a meaningful transition — from [executor of others' visions] to [architect of your own]. That shift is the real work Pathly is here to support.\"",
    visualization: "Identity Timeline — a narrative arc showing past identity anchors, current transition zone, and future horizon",
  },
];

const synthesis = [
  {
    icon: Brain,
    title: "Identity Profile",
    desc: "Pathly combines your 6 signal dimensions to generate a personal archetype and narrative — not a job title, but a portrait of who you are and the conditions where you come alive.",
    color: "coral",
  },
  {
    icon: Compass,
    title: "Life Directions",
    desc: "Your signal combination maps to a range of possible directions — careers, creative projects, entrepreneurial paths, learning orientations. The system shows why each one fits, not just what it is.",
    color: "amber",
  },
  {
    icon: FlaskConical,
    title: "Micro-Experiments",
    desc: "Rather than forcing a decision, Pathly generates specific low-commitment experiments — actions you can take in the next 7–14 days to test a direction before committing to it.",
    color: "violet",
  },
  {
    icon: Map,
    title: "Reinvention Roadmap",
    desc: "For users ready to move, the framework generates a structured roadmap: skills to develop, communities to explore, and people to learn from — all filtered through your signal profile.",
    color: "rose",
  },
];

const colorTokens: Record<string, { text: string; bg: string; border: string; dot: string }> = {
  coral:  { text: "text-coral",  bg: "bg-coral-500/8",  border: "border-coral-500/20",  dot: "bg-coral-500"  },
  amber:  { text: "text-amber",  bg: "bg-amber-500/8",  border: "border-amber-500/20",  dot: "bg-amber-500"  },
  violet: { text: "text-violet", bg: "bg-violet-500/8", border: "border-violet-500/20", dot: "bg-violet-500" },
  rose:   { text: "text-rose",   bg: "bg-rose-500/8",   border: "border-rose-500/20",   dot: "bg-rose-500"   },
};

function DimensionCard({ d, index }: { d: typeof dimensions[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const c = colorTokens[d.color];
  const Icon = d.icon;

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        open ? c.border : "border-border/50"
      }`}
      style={{ background: open ? `hsl(var(--${d.color}) / 0.03)` : "hsl(var(--surface-1))" }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-4 p-5 text-left group"
      >
        {/* Number + Icon */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 mt-0.5">
          <span className="text-xs font-mono text-muted-foreground/50">{d.number}</span>
          <div
            className={`w-10 h-10 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center`}
          >
            <Icon className={`w-5 h-5 ${c.text}`} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h3 className="font-bold text-foreground text-base">{d.name}</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${c.bg} ${c.border} ${c.text} font-medium`}
            >
              {d.pillar}
            </span>
          </div>
          <p className="text-sm text-muted-foreground italic">{d.tagline}</p>
        </div>

        <div className={`shrink-0 mt-1 transition-transform duration-200 ${open ? "rotate-0" : ""}`}>
          {open
            ? <ChevronUp className={`w-5 h-5 ${c.text}`} />
            : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded body */}
      {open && (
        <div className="px-5 pb-6 space-y-5 animate-fade-in">
          <div className="section-divider" />

          {/* What + Why */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">What it measures</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{d.what}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Why it matters</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{d.why}</p>
            </div>
          </div>

          {/* Psych basis */}
          <div
            className={`rounded-xl p-4 border ${c.border}`}
            style={{ background: `hsl(var(--${d.color}) / 0.05)` }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-muted-foreground">
              Psychological Basis
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">{d.psychBasis}</p>
          </div>

          {/* Questions */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Discovery Questions
            </p>
            <div className="space-y-2">
              {d.questions.map((q, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${c.dot}`} />
                  <p className="text-sm text-foreground leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sample insight */}
          <div className="rounded-xl border border-border/50 p-4 bg-surface-2">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className={`w-4 h-4 ${c.text}`} />
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Example AI Insight Generated
              </p>
            </div>
            <p className="text-sm text-foreground italic leading-relaxed">{d.insight}</p>
          </div>

          {/* Visualization */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Map className={`w-3.5 h-3.5 ${c.text}`} />
            <span>Visualized as: <span className="text-foreground font-medium">{d.visualization}</span></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Framework() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-24">
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pb-24">
          <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ background: "hsl(var(--coral) / 0.12)" }}
          />

          <div className="container max-w-3xl px-6 text-center relative z-10">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-8 border"
              style={{
                background: "hsl(var(--violet) / 0.08)",
                borderColor: "hsl(var(--violet) / 0.2)",
                color: "hsl(var(--violet))",
              }}
            >
              <Brain className="w-4 h-4" />
              Pathly's Intellectual Model
            </div>

            <h1 className="font-display text-5xl md:text-6xl text-foreground leading-[1.1] tracking-tight mb-5">
              The PATH Signal
              <br />
              <span className="text-gradient-coral">Framework</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
              {frameworkTagline}
            </p>

            {/* P A T H breakdown */}
            <div className="flex items-stretch justify-center gap-3 flex-wrap mt-10">
              {overview.map((o, i) => {
                const c = colorTokens[o.color];
                return (
                  <div
                    key={i}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl px-6 py-5 border transition-all duration-200 hover:-translate-y-0.5 cursor-default w-32`}
                    style={{
                      background: `hsl(var(--${o.color}) / 0.07)`,
                      borderColor: `hsl(var(--${o.color}) / 0.2)`,
                    }}
                  >
                    <span
                      className="font-display text-5xl font-bold leading-none"
                      style={{ color: `hsl(var(--${o.color}))` }}
                    >
                      {o.letter}
                    </span>
                    <span className="text-sm font-bold text-foreground">{o.word}</span>
                    <span className="text-xs text-muted-foreground text-center leading-snug">{o.sub}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Why this framework ─────────────────────────────────────── */}
        <section
          className="py-20 border-y border-border/40"
          style={{ background: "hsl(var(--surface-1))" }}
        >
          <div className="container max-w-3xl px-6">
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              {[
                {
                  label: "Not another personality test",
                  body: "PATH Signal doesn't put you in a box. It maps the signals that are already in you — and shows where they point.",
                },
                {
                  label: "Identity first. Career second.",
                  body: "Most frameworks ask 'what should you do?' PATH asks 'who are you?' — and trusts that direction emerges naturally from that answer.",
                },
                {
                  label: "Built for transitions",
                  body: "Designed specifically for the moments when an old identity ends and a new one hasn't fully formed — layoffs, burnout, mid-life pivots, and reinventions.",
                },
              ].map((p, i) => (
                <div key={i} className="space-y-2">
                  <p className="font-bold text-foreground text-sm">{p.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The 6 Dimensions ───────────────────────────────────────── */}
        <section className="py-20">
          <div className="container max-w-3xl px-6">
            <div className="text-center mb-12">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "hsl(var(--coral))" }}
              >
                The Six Dimensions
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                What PATH Signal measures
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
                Each dimension captures a different layer of your identity. Together, they create a signal profile that tells a story no résumé ever could.
              </p>
            </div>

            <div className="space-y-3">
              {dimensions.map((d, i) => (
                <DimensionCard key={d.id} d={d} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Identity Visualization ─────────────────────────────────── */}
        <section
          className="py-20 border-y border-border/40"
          style={{ background: "hsl(var(--surface-1))" }}
        >
          <div className="container max-w-4xl px-6">
            <div className="text-center mb-12">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "hsl(var(--amber))" }}
              >
                The Visual Map
              </p>
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Your identity as a living map
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
                Pathly visualizes your PATH Signal as an interconnected system — not a flat chart, but a network showing how your dimensions relate, reinforce, and point toward each other.
              </p>
            </div>

            {/* Visual mock of the identity map */}
            <div
              className="rounded-2xl border border-border/50 p-8 relative overflow-hidden"
              style={{ background: "hsl(var(--surface-2))" }}
            >
              {/* Background glow */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
                style={{ background: "hsl(var(--coral) / 0.3)" }}
              />

              <div className="relative z-10">
                {/* Center identity node */}
                <div className="flex justify-center mb-8">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center border-2 relative"
                    style={{
                      background: "hsl(var(--coral) / 0.15)",
                      borderColor: "hsl(var(--coral) / 0.4)",
                      boxShadow: "0 0 40px hsl(var(--coral) / 0.2)",
                    }}
                  >
                    <span className="text-xs font-bold text-coral text-center leading-tight">Identity<br/>Core</span>
                    {/* Pulse ring */}
                    <div
                      className="absolute inset-0 rounded-full border animate-ping opacity-20"
                      style={{ borderColor: "hsl(var(--coral) / 0.4)" }}
                    />
                  </div>
                </div>

                {/* 6 dimension nodes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {dimensions.map((d) => {
                    const c = colorTokens[d.color];
                    const Icon = d.icon;
                    return (
                      <div
                        key={d.id}
                        className={`rounded-xl p-4 border flex flex-col gap-2 card-hover`}
                        style={{
                          background: `hsl(var(--${d.color}) / 0.06)`,
                          borderColor: `hsl(var(--${d.color}) / 0.2)`,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${c.text}`} />
                          <span className="text-xs font-bold text-foreground">{d.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{d.tagline}</p>
                        <div
                          className="h-1 rounded-full mt-1 opacity-60"
                          style={{
                            background: `linear-gradient(90deg, hsl(var(--${d.color})), transparent)`,
                            width: `${60 + Math.random() * 35}%`,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                <p className="text-center text-xs text-muted-foreground mt-6 italic">
                  Each dimension feeds into your Identity Core — and the combination determines your unique signal profile.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Generates Outputs ────────────────────────────────── */}
        <section className="py-20">
          <div className="container max-w-3xl px-6">
            <div className="text-center mb-12">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "hsl(var(--violet))" }}
              >
                Framework Outputs
              </p>
              <h2 className="text-3xl font-bold text-foreground mb-3">
                What PATH Signal generates
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
                The framework isn't just a diagnostic. It generates four types of forward-facing outputs that help users move from insight to action.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {synthesis.map((s, i) => {
                const c = colorTokens[s.color];
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    className="rounded-2xl p-5 border card-hover"
                    style={{
                      background: `hsl(var(--${s.color}) / 0.05)`,
                      borderColor: `hsl(var(--${s.color}) / 0.18)`,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border"
                      style={{
                        background: `hsl(var(--${s.color}) / 0.1)`,
                        borderColor: `hsl(var(--${s.color}) / 0.2)`,
                      }}
                    >
                      <Icon className={`w-5 h-5 ${c.text}`} />
                    </div>
                    <h3 className="font-bold text-foreground mb-1.5">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Comparison vs Others ─────────────────────────────────────── */}
        <section
          className="py-20 border-y border-border/40"
          style={{ background: "hsl(var(--surface-1))" }}
        >
          <div className="container max-w-3xl px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                How PATH Signal is different
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Positioned alongside the frameworks people already know — to show what's genuinely new.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/50">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "hsl(var(--surface-2))" }}>
                    <th className="text-left p-4 font-semibold text-foreground">Framework</th>
                    <th className="text-left p-4 font-semibold text-foreground">What it maps</th>
                    <th className="text-left p-4 font-semibold text-foreground">Designed for</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {[
                    { name: "Myers-Briggs", what: "Personality types (fixed)", for: "Self-awareness" },
                    { name: "StrengthsFinder", what: "Top 5 talent themes", for: "Workplace performance" },
                    { name: "Ikigai", what: "Purpose intersection", for: "Career clarity" },
                    { name: "Holland Codes", what: "Work personality types", for: "Career matching" },
                    { name: "PATH Signal ✦", what: "Identity signals across 6 life dimensions", for: "Identity reinvention & life direction", highlight: true },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      style={row.highlight ? { background: "hsl(var(--coral) / 0.06)" } : { background: "hsl(var(--surface-1))" }}
                    >
                      <td className={`p-4 font-medium ${row.highlight ? "text-coral" : "text-foreground"}`}>
                        {row.name}
                      </td>
                      <td className="p-4 text-muted-foreground">{row.what}</td>
                      <td className="p-4 text-muted-foreground">{row.for}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
          <div className="container max-w-xl px-6 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to discover your<br />
              <span className="text-gradient-coral">PATH Signal?</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              The framework comes to life through Pathly's guided identity experience. It takes about 12 minutes and produces something no career quiz ever has.
            </p>
            <Link to="/onboarding">
              <Button
                size="lg"
                className="bg-gradient-coral text-primary-foreground font-semibold px-8 py-6 rounded-xl glow-coral hover:opacity-90 transition-all hover:scale-[1.02] gap-2 group"
              >
                Begin your PATH Signal
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
