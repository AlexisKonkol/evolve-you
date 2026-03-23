import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Zap, Brain, Lightbulb, Users, Globe, BookOpen,
  ArrowRight, TrendingUp, Rocket, Sparkles, Target,
  FlaskConical, Rss, ChevronDown, ChevronUp, Star,
  DollarSign, Clock, Compass,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────

const opportunities = [
  {
    id: 1,
    title: "AI Product Builder",
    type: "Emerging Career",
    typeColor: "coral",
    icon: Zap,
    growth: "+340%",
    income: "$90K–$180K",
    time: "6–12 months",
    match: 94,
    description:
      "AI products are rapidly transforming how businesses operate. People in this field design tools that use artificial intelligence to solve real-world problems.",
    whyInteresting:
      "You show curiosity about technology and problem solving. AI product roles sit at the intersection of systems thinking and human impact — a rare and powerful combination.",
    skills: ["AI literacy", "Product thinking", "User research", "Systems design", "Prompt engineering"],
    steps: [
      "Learn how AI tools work through hands-on experimentation",
      "Experiment with building a simple AI-powered project",
      "Explore companies building products in the AI space",
      "Study how successful AI products solve real problems",
      "Build a small portfolio of AI product concepts",
    ],
    tag: "Fastest Growing",
    tagColor: "coral",
  },
  {
    id: 2,
    title: "Learning Designer",
    type: "Emerging Career",
    typeColor: "violet",
    icon: BookOpen,
    growth: "+190%",
    income: "$65K–$130K",
    time: "3–9 months",
    match: 89,
    description:
      "Design learning experiences that help people develop new skills and unlock their potential. A deeply human role in a world that needs more of it.",
    whyInteresting:
      "You frequently express a desire to help others grow. Learning designers combine empathy, structure, and creativity — all signals visible in your profile.",
    skills: ["Curriculum design", "Empathy", "Communication", "Content creation", "Facilitation"],
    steps: [
      "Identify a skill or topic you understand deeply",
      "Design a short course or workshop around it",
      "Test it with a small group and gather feedback",
      "Study learning science and instructional design",
      "Build a portfolio of learning experiences you've created",
    ],
    tag: "High Alignment",
    tagColor: "violet",
  },
  {
    id: 3,
    title: "Startup Operator",
    type: "Emerging Career",
    typeColor: "amber",
    icon: Rocket,
    growth: "+220%",
    income: "$80K–$200K+",
    time: "6–18 months",
    match: 82,
    description:
      "Startup operators are the people who make things actually work — coordinating teams, managing processes, and turning vision into execution.",
    whyInteresting:
      "Your communication strengths and natural leadership signal an ability to hold teams together. Operators are the invisible force behind every successful startup.",
    skills: ["Project management", "Communication", "Process design", "Team coordination", "Strategic thinking"],
    steps: [
      "Get involved with an early-stage project or startup",
      "Study how high-performing operations teams function",
      "Practice managing small cross-functional projects",
      "Learn tools like Notion, Linear, and Slack deeply",
      "Build a track record of shipping things on time",
    ],
    tag: "High Impact",
    tagColor: "amber",
  },
  {
    id: 4,
    title: "Creative Strategist",
    type: "Emerging Career",
    typeColor: "coral",
    icon: Sparkles,
    growth: "+170%",
    income: "$70K–$160K",
    time: "4–10 months",
    match: 77,
    description:
      "Creative strategists help brands, products, and movements communicate their ideas in ways that resonate with real people.",
    whyInteresting:
      "You show signals of creativity combined with an interest in human behaviour. Strategy roles that blend these two are rare and increasingly valuable.",
    skills: ["Storytelling", "Brand thinking", "Content strategy", "Audience psychology", "Creative direction"],
    steps: [
      "Document your personal creative process and thinking",
      "Study successful brand campaigns and why they worked",
      "Create a personal case study of a problem you solved creatively",
      "Develop your strategic writing and communication",
      "Build relationships in the brand and creative strategy space",
    ],
    tag: "Creative Path",
    tagColor: "coral",
  },
  {
    id: 5,
    title: "Community Architect",
    type: "Emerging Career",
    typeColor: "violet",
    icon: Users,
    growth: "+280%",
    income: "$60K–$150K+",
    time: "3–9 months",
    match: 74,
    description:
      "Build and nurture online and offline communities around ideas, products, and movements. One of the most human roles in the digital economy.",
    whyInteresting:
      "You appear energized by connection and collaboration. Community architects shape how groups of people think, learn, and grow together.",
    skills: ["Community platforms", "Engagement strategy", "Event design", "Audience building", "Analytics"],
    steps: [
      "Start or join a small community you genuinely care about",
      "Learn the platforms communities live on",
      "Grow engagement in a community from the inside",
      "Document what works and build your playbook",
      "Offer your skills to brands or startups building communities",
    ],
    tag: "High Demand",
    tagColor: "violet",
  },
];

const projects = [
  {
    id: 1,
    icon: Zap,
    title: "Build a simple AI-powered tool",
    desc: "Pick a small problem you face and use AI to solve it. No coding needed.",
    timeframe: "1–2 weeks",
    difficulty: "Beginner",
    color: "coral",
  },
  {
    id: 2,
    icon: BookOpen,
    title: "Start a newsletter about emerging technology",
    desc: "Write about something you're curious about. Share it with people who care.",
    timeframe: "1 week to start",
    difficulty: "Beginner",
    color: "violet",
  },
  {
    id: 3,
    icon: Users,
    title: "Run a small community experiment",
    desc: "Create a Discord or Slack group around a topic you know well. See who shows up.",
    timeframe: "2–3 weeks",
    difficulty: "Intermediate",
    color: "amber",
  },
  {
    id: 4,
    icon: FlaskConical,
    title: "Launch a micro startup idea",
    desc: "Build the smallest possible version of a product idea you've had. Ship it.",
    timeframe: "3–4 weeks",
    difficulty: "Intermediate",
    color: "coral",
  },
  {
    id: 5,
    icon: Lightbulb,
    title: "Create a short online course",
    desc: "Teach one thing you know to a small audience. Use Notion, Gumroad, or Loom.",
    timeframe: "2–3 weeks",
    difficulty: "Beginner",
    color: "violet",
  },
  {
    id: 6,
    icon: Globe,
    title: "Build a personal website with your ideas",
    desc: "Document your thinking publicly. Create a space that represents your emerging identity.",
    timeframe: "1 week",
    difficulty: "Beginner",
    color: "amber",
  },
];

const futureSkills = [
  { label: "AI Literacy",               signal: 95, desc: "Understanding and using AI tools effectively",       color: "coral"  },
  { label: "Creative Problem Solving",  signal: 88, desc: "Reframing challenges and generating novel solutions", color: "violet" },
  { label: "Product Thinking",          signal: 84, desc: "Designing solutions that create real user value",     color: "amber"  },
  { label: "Communication",             signal: 91, desc: "Translating complex ideas into clear messages",       color: "coral"  },
  { label: "Digital Entrepreneurship",  signal: 79, desc: "Building things independently in the digital economy", color: "violet"},
  { label: "Systems Thinking",          signal: 76, desc: "Understanding how complex systems interact",          color: "amber"  },
];

const opportunityFeed = [
  { label: "AI Product Strategy",       match: 94, trend: "+340%", icon: Zap,        href: "/path-finder" },
  { label: "Learning Design",           match: 89, trend: "+190%", icon: BookOpen,    href: "/path-finder" },
  { label: "Startup Operations",        match: 82, trend: "+220%", icon: Rocket,      href: "/path-finder" },
  { label: "Community Architecture",    match: 74, trend: "+280%", icon: Users,       href: "/path-finder" },
  { label: "Creative Strategy",         match: 77, trend: "+170%", icon: Sparkles,    href: "/path-finder" },
  { label: "Digital Entrepreneurship",  match: 71, trend: "+250%", icon: Globe,       href: "/path-finder" },
];

// ── Component ─────────────────────────────────────────────────────────────────

const tagColorMap: Record<string, string> = {
  coral:  "bg-indigo-500-500/10 text-indigo-400 border-coral-500/20",
  violet: "bg-violet-500/10 text-violet border-violet-500/20",
  amber:  "bg-amber-500/10 text-amber border-amber-500/20",
};

const iconColorMap: Record<string, string> = {
  coral:  "text-indigo-400",
  violet: "text-violet",
  amber:  "text-amber",
};

const bgColorMap: Record<string, string> = {
  coral:  "bg-indigo-500-500/10",
  violet: "bg-violet-500/10",
  amber:  "bg-amber-500/10",
};

const barColorMap: Record<string, string> = {
  coral:  "bg-gradient-coral",
  violet: "",
  amber:  "bg-gradient-amber",
};

export default function OpportunityEngine() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-24">
        <div className="container max-w-5xl px-6">

          {/* ── Header ───────────────────────────────────────────── */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5 text-xs font-semibold uppercase tracking-widest"
              style={{
                background: "hsl(var(--coral) / 0.08)",
                borderColor: "hsl(var(--coral) / 0.2)",
                color: "hsl(var(--coral))",
              }}>
              <Compass className="w-3.5 h-3.5" />
              Opportunity Engine
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Connect who you are<br className="hidden sm:block" /> with what the world needs
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Understanding yourself is the first step. The Opportunity Engine connects your interests 
              and strengths with real paths you can begin exploring today.
            </p>
          </div>

          {/* ── Growth trend stats ───────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {[
              { label: "AI & Automation",        growth: "+340%", icon: Zap     },
              { label: "Creator Economy",         growth: "+280%", icon: Star    },
              { label: "Digital Services",        growth: "+170%", icon: Globe   },
              { label: "Digital Entrepreneurship",growth: "+250%", icon: Rocket  },
            ].map((t) => (
              <div key={t.label} className="bg-gradient-card border border-border/50 rounded-xl p-4 text-center">
                <t.icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">{t.label}</p>
                <p className="text-xl font-bold text-gradient-coral">{t.growth}</p>
              </div>
            ))}
          </div>

          {/* ── Opportunity Cards ────────────────────────────────── */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-indigo-500-500/10 rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Emerging Opportunities</h2>
                <p className="text-sm text-muted-foreground">Matched to your identity signals</p>
              </div>
            </div>

            <div className="space-y-4">
              {opportunities.map((opp) => {
                const isOpen = expanded === opp.id;
                const OppIcon = opp.icon;
                return (
                  <div key={opp.id}
                    className="bg-gradient-card border border-border/50 rounded-2xl overflow-hidden hover:border-coral-500/20 transition-colors">

                    {/* Card header (always visible) */}
                    <button
                      className="w-full p-6 text-left"
                      onClick={() => setExpanded(isOpen ? null : opp.id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${tagColorMap[opp.tagColor]}`}>
                              {opp.tag}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <OppIcon className="w-3 h-3" />
                              {opp.type}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground">{opp.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{opp.description}</p>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-1 shrink-0">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gradient-coral">{opp.match}%</div>
                            <div className="text-xs text-muted-foreground">match</div>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-indigo-400" />
                              {opp.growth}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3 text-amber" />
                              {opp.income}
                            </span>
                          </div>
                          {isOpen
                            ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>
                    </button>

                    {/* Expanded detail */}
                    {isOpen && (
                      <div className="px-6 pb-6 border-t border-border/40">
                        <div className="grid md:grid-cols-2 gap-6 mt-5">
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                              Why this may interest you
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{opp.whyInteresting}</p>

                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-5 mb-3">
                              Key skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {opp.skills.map((s) => (
                                <span key={s} className="text-xs bg-surface-2 border border-border rounded-lg px-3 py-1.5 text-foreground/80">
                                  {s}
                                </span>
                              ))}
                            </div>

                            <div className="flex gap-4 mt-5">
                              <div className="flex items-center gap-2 text-sm">
                                <DollarSign className="w-4 h-4 text-amber" />
                                <span className="text-foreground font-semibold">{opp.income}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-indigo-400" />
                                <span className="text-muted-foreground">{opp.time}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                              Possible first steps
                            </h4>
                            <div className="space-y-2.5">
                              {opp.steps.map((step, i) => (
                                <div key={i} className="flex gap-3 text-sm">
                                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                                    style={{ background: "hsl(var(--coral) / 0.15)" }}>
                                    <span className="text-indigo-400 text-xs font-bold">{i + 1}</span>
                                  </div>
                                  <p className="text-muted-foreground leading-relaxed">{step}</p>
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-2 mt-5">
                              <Link to="/path-finder" className="flex-1">
                                <Button className="w-full bg-gradient-coral text-primary-foreground font-semibold gap-2 hover:opacity-90 text-sm">
                                  Explore this path
                                  <ArrowRight className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Link to="/experiments">
                                <Button variant="outline" className="border-border hover:border-coral-500/40 gap-2 text-sm">
                                  <FlaskConical className="w-4 h-4 text-indigo-400" />
                                  Try an experiment
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Project Discovery ────────────────────────────────── */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-violet-500/10 rounded-xl flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-violet" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Projects Worth Trying</h2>
                <p className="text-sm text-muted-foreground">Small experiments that create real clarity</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {projects.map((p) => {
                const PIcon = p.icon;
                return (
                  <div key={p.id} className="bg-gradient-card border border-border/50 rounded-2xl p-5 hover:border-coral-500/20 transition-colors group">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${bgColorMap[p.color]}`}>
                      <PIcon className={`w-4 h-4 ${iconColorMap[p.color]}`} />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-2">{p.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {p.timeframe}
                      </span>
                      <span className={`${tagColorMap[p.color]} px-2 py-0.5 rounded-full border text-xs`}>
                        {p.difficulty}
                      </span>
                    </div>
                    <Link to="/experiments">
                      <Button variant="ghost" size="sm"
                        className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground gap-1.5 group-hover:text-indigo-400 transition-colors">
                        Try this project
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Skill Signals ────────────────────────────────────── */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Brain className="w-4 h-4 text-amber" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Skills Worth Building</h2>
                <p className="text-sm text-muted-foreground">High-signal capabilities for the future economy</p>
              </div>
            </div>

            <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                {futureSkills.map((skill) => (
                  <div key={skill.label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`text-sm font-semibold ${iconColorMap[skill.color]}`}>{skill.label}</span>
                      <span className="text-xs text-muted-foreground">{skill.signal}% relevance</span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          skill.color === "violet"
                            ? ""
                            : barColorMap[skill.color]
                        }`}
                        style={
                          skill.color === "violet"
                            ? { background: "hsl(var(--violet))", width: `${skill.signal}%` }
                            : { width: `${skill.signal}%` }
                        }
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{skill.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-border/40 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground mb-1">These are not rigid scores</p>
                  <p className="text-xs text-muted-foreground">
                    These signals reflect what you explore and express. They grow as you grow.
                  </p>
                </div>
                <Link to="/learn">
                  <Button className="bg-gradient-amber text-primary-foreground font-semibold gap-2 hover:opacity-90 shrink-0">
                    Start building skills
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* ── Opportunity Feed ─────────────────────────────────── */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-indigo-500-500/10 rounded-xl flex items-center justify-center">
                <Rss className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Your Opportunity Feed</h2>
                <p className="text-sm text-muted-foreground">People with similar interests often explore these</p>
              </div>
            </div>

            <div className="bg-gradient-card border border-border/50 rounded-2xl overflow-hidden">
              {opportunityFeed.map((item, i) => {
                const FeedIcon = item.icon;
                return (
                  <Link key={item.label} to={item.href}
                    className={`flex items-center gap-4 p-4 hover:bg-surface-2 transition-colors group ${
                      i < opportunityFeed.length - 1 ? "border-b border-border/40" : ""
                    }`}>
                    <div className="w-9 h-9 bg-indigo-500-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <FeedIcon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">Demand growth: {item.trend}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-lg font-bold text-gradient-coral">{item.match}%</span>
                      <span className="text-xs text-muted-foreground">match</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── CTA Banner ───────────────────────────────────────── */}
          <section>
            <div className="rounded-2xl p-8 text-center"
              style={{ background: "linear-gradient(135deg, hsl(var(--coral) / 0.08), hsl(var(--violet) / 0.08))", border: "1px solid hsl(var(--coral) / 0.2)" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "linear-gradient(135deg, hsl(var(--coral)), hsl(var(--peach)))" }}>
                <Compass className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Your future becomes clearer when you begin
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-6 leading-relaxed">
                The right path is not found by thinking more. It's found by exploring more.
                Take one small step today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/path-finder">
                  <Button className="bg-gradient-coral text-primary-foreground font-semibold gap-2 hover:opacity-90">
                    Discover my paths
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/experiments">
                  <Button variant="outline" className="border-border hover:border-coral-500/40 gap-2">
                    <FlaskConical className="w-4 h-4 text-indigo-400" />
                    Try a small experiment
                  </Button>
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
