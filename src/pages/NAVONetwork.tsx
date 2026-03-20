import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Users, MessageCircle, ArrowRight, Plus, Search,
  Zap, BookOpen, Rocket, Lightbulb, Globe, Heart,
  FlaskConical, Star, Sparkles, Check, ChevronRight,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────

const communities = [
  {
    id: 1,
    name: "AI Builders",
    icon: Zap,
    color: "coral",
    members: 3847,
    active: "2 min ago",
    desc: "People learning to build with AI tools. No experience required — just curiosity.",
    tags: ["AI Tools", "Building", "Exploration"],
    highlights: ["Weekly build challenges", "Beginner resources", "Tool reviews"],
  },
  {
    id: 2,
    name: "Creative Entrepreneurs",
    icon: Sparkles,
    color: "violet",
    members: 2614,
    active: "5 min ago",
    desc: "People blending creativity with entrepreneurship to build something meaningful.",
    tags: ["Creativity", "Entrepreneurship", "Vision"],
    highlights: ["Project showcases", "Feedback sessions", "Monthly experiments"],
  },
  {
    id: 3,
    name: "Startup Explorers",
    icon: Rocket,
    color: "amber",
    members: 1932,
    active: "12 min ago",
    desc: "Early-stage thinkers exploring startup ideas, lean experiments, and small bets.",
    tags: ["Startups", "Experiments", "Ideas"],
    highlights: ["Idea validation threads", "Founder conversations", "Experiment sprints"],
  },
  {
    id: 4,
    name: "Learning Designers",
    icon: BookOpen,
    color: "coral",
    members: 1248,
    active: "20 min ago",
    desc: "People designing learning experiences, courses, and educational communities.",
    tags: ["Education", "Design", "Curriculum"],
    highlights: ["Course critiques", "Learning science", "Community case studies"],
  },
  {
    id: 5,
    name: "Future of Work",
    icon: Globe,
    color: "violet",
    members: 4201,
    active: "1 min ago",
    desc: "Exploring how work is changing and how to position yourself for what's coming.",
    tags: ["Future Work", "Careers", "Trends"],
    highlights: ["Trend analysis", "Path discussions", "Weekly insights"],
  },
  {
    id: 6,
    name: "Digital Entrepreneurs",
    icon: Lightbulb,
    color: "amber",
    members: 2987,
    active: "8 min ago",
    desc: "Building sustainable income and businesses in the digital economy.",
    tags: ["Digital Business", "Income", "Independence"],
    highlights: ["Income reports", "Tool stacks", "Accountability threads"],
  },
];

const smallGroups = [
  {
    id: 1,
    name: "AI Exploration Circle",
    members: 8,
    max: 12,
    focus: "AI Builders",
    focusColor: "coral",
    description: "A small group experimenting with AI tools together and sharing weekly discoveries.",
    experiments: ["7-Day AI Tool Sprint", "Build Something Real"],
    next: "Wednesday at 7pm",
  },
  {
    id: 2,
    name: "Creative Direction Lab",
    members: 6,
    max: 10,
    focus: "Creative Entrepreneurs",
    focusColor: "violet",
    description: "Exploring the intersection of creativity and business in a supportive, intimate setting.",
    experiments: ["Creative Business Model Canvas", "Brand Identity Experiment"],
    next: "Thursday at 6pm",
  },
  {
    id: 3,
    name: "Startup Idea Incubator",
    members: 9,
    max: 12,
    focus: "Startup Explorers",
    focusColor: "amber",
    description: "Testing startup ideas through low-cost experiments in a 14-day sprint format.",
    experiments: ["14-Day Startup Sprint", "Idea Validation Challenge"],
    next: "Tuesday at 8pm",
  },
  {
    id: 4,
    name: "Learning Design Studio",
    members: 5,
    max: 8,
    focus: "Learning Designers",
    focusColor: "coral",
    description: "Building and critiquing learning experiences together — from concept to cohort.",
    experiments: ["Build Your First Course", "Community Design Sprint"],
    next: "Friday at 5pm",
  },
];

const experiments = [
  {
    id: 1,
    title: "7 Day AI Builder Challenge",
    icon: Zap,
    color: "coral",
    participants: 142,
    duration: "7 days",
    status: "Active now",
    desc: "Each day you build or explore one AI tool. Share what you made and what you learned.",
    commitments: ["Build one thing per day", "Share a reflection", "Give feedback to one other member"],
  },
  {
    id: 2,
    title: "14 Day Creative Project Challenge",
    icon: Sparkles,
    color: "violet",
    participants: 87,
    duration: "14 days",
    status: "Starting soon",
    desc: "Launch a small creative project from scratch — a newsletter, digital product, or piece of art.",
    commitments: ["Define your project on day 1", "Share daily progress", "Publish something by day 14"],
  },
  {
    id: 3,
    title: "Startup Idea Exploration Sprint",
    icon: Rocket,
    color: "amber",
    participants: 63,
    duration: "10 days",
    status: "Active now",
    desc: "Explore, validate, and pressure-test a startup idea without spending any money.",
    commitments: ["Describe your idea on day 1", "Interview 3 potential users", "Present findings to the group"],
  },
];

const stories = [
  {
    name: "Maya L.",
    initials: "ML",
    direction: "AI Product Design",
    color: "coral",
    experiment: "7 Day AI Builder Challenge",
    discovery: "I discovered I actually enjoy the technical side of AI. I always thought I was just a designer. Turns out I'm a designer who loves to build.",
    next: "Exploring product roles at early-stage AI startups.",
    time: "3 days ago",
    likes: 84,
  },
  {
    name: "James T.",
    initials: "JT",
    direction: "Learning Design",
    color: "violet",
    experiment: "14 Day Creative Project Challenge",
    discovery: "I launched a small email course about systems thinking. 60 people signed up in the first week. I had no idea people would care that much.",
    next: "Building out a second course and exploring the Learning Designers group.",
    time: "1 week ago",
    likes: 127,
  },
  {
    name: "Sofia R.",
    initials: "SR",
    direction: "Digital Entrepreneurship",
    color: "amber",
    experiment: "Startup Idea Exploration Sprint",
    discovery: "I found out my idea wasn't what people wanted — but the conversations led me to a completely different idea that actually resonated. Failure pointed the way.",
    next: "Testing a new concept with a landing page and 10 conversations.",
    time: "5 days ago",
    likes: 96,
  },
  {
    name: "David K.",
    initials: "DK",
    direction: "AI Builders",
    color: "coral",
    experiment: "7 Day AI Builder Challenge",
    discovery: "By day 4 I had built something I was genuinely proud of. By day 7 I had a portfolio piece. I never would have done this without the group accountability.",
    next: "Applying for AI product roles and working on a side project.",
    time: "2 weeks ago",
    likes: 153,
  },
];

const discoveryPeople = [
  { name: "Aiden P.",   initials: "AP", direction: "AI Product Design",        shared: 3, color: "coral"  },
  { name: "Nadia S.",   initials: "NS", direction: "Digital Entrepreneurship",  shared: 5, color: "violet" },
  { name: "Carlos M.",  initials: "CM", direction: "Learning Design",           shared: 4, color: "amber"  },
  { name: "Leah W.",    initials: "LW", direction: "Creative Strategy",         shared: 2, color: "coral"  },
  { name: "Omar B.",    initials: "OB", direction: "Future of Work",            shared: 6, color: "violet" },
  { name: "Ingrid T.",  initials: "IT", direction: "Startup Operations",        shared: 3, color: "amber"  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const cIcon: Record<string, string> = {
  coral:  "text-coral",
  violet: "text-violet",
  amber:  "text-amber",
};
const cBg: Record<string, string> = {
  coral:  "bg-coral-500/10",
  violet: "bg-violet-500/10",
  amber:  "bg-amber-500/10",
};
const cBorder: Record<string, string> = {
  coral:  "border-coral-500/20",
  violet: "border-violet-500/20",
  amber:  "border-amber-500/20",
};
const cTag: Record<string, string> = {
  coral:  "bg-coral-500/10 text-coral border-coral-500/20",
  violet: "bg-violet-500/10 text-violet border-violet-500/20",
  amber:  "bg-amber-500/10 text-amber border-amber-500/20",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function NAVONetwork() {
  const [joinedCommunities, setJoinedCommunities] = useState<number[]>([1]);
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);
  const [joinedExperiments, setJoinedExperiments] = useState<number[]>([]);
  const [likedStories, setLikedStories] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"communities" | "groups" | "experiments" | "stories" | "discover">("communities");

  const filteredCommunities = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase())
  );

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: "communities", label: "Communities" },
    { key: "groups",      label: "Small Groups" },
    { key: "experiments", label: "Experiments"  },
    { key: "stories",     label: "Stories"      },
    { key: "discover",    label: "Discover"     },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-24">
        <div className="container max-w-5xl px-6">

          {/* ── Header ────────────────────────────────────────────── */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5 text-xs font-semibold uppercase tracking-widest"
              style={{
                background: "hsl(var(--violet) / 0.08)",
                borderColor: "hsl(var(--violet) / 0.2)",
                color: "hsl(var(--violet))",
              }}>
              <Users className="w-3.5 h-3.5" />
              NAVO Network
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              You are not alone<br className="hidden sm:block" /> in exploring your future
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              The NAVO Network connects you with others who are also exploring new directions, 
              learning new skills, and designing their next chapter.
            </p>
          </div>

          {/* ── Stats strip ───────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[
              { label: "Explorers",        value: "12,400+", icon: Users          },
              { label: "Active Groups",    value: "48",      icon: MessageCircle  },
              { label: "Live Experiments", value: "16",      icon: FlaskConical   },
              { label: "Stories Shared",   value: "3,200+",  icon: Star           },
            ].map((s) => (
              <div key={s.label} className="bg-gradient-card border border-border/50 rounded-xl p-4 text-center">
                <s.icon className="w-5 h-5 text-violet mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Tabs ──────────────────────────────────────────────── */}
          <div className="flex gap-1 bg-surface-2 rounded-xl p-1 mb-8 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 min-w-fit px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === t.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ══ COMMUNITIES ══════════════════════════════════════════ */}
          {activeTab === "communities" && (
            <div>
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search communities..."
                  className="w-full bg-surface-1 border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {filteredCommunities.map((c) => {
                  const CIcon = c.icon;
                  const isJoined = joinedCommunities.includes(c.id);
                  return (
                    <div key={c.id}
                      className={`bg-gradient-card border rounded-2xl p-5 transition-all hover:${cBorder[c.color]}`}
                      style={{ borderColor: `hsl(var(--border) / 0.5)` }}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cBg[c.color]}`}>
                          <CIcon className={`w-5 h-5 ${cIcon[c.color]}`} />
                        </div>
                        <Button
                          size="sm"
                          onClick={() =>
                            setJoinedCommunities((prev) =>
                              prev.includes(c.id) ? prev.filter((id) => id !== c.id) : [...prev, c.id]
                            )
                          }
                          className={`text-xs shrink-0 ${
                            isJoined
                              ? `${cBg[c.color]} border ${cBorder[c.color]} ${cIcon[c.color]} hover:opacity-80`
                              : "bg-gradient-coral text-primary-foreground hover:opacity-90"
                          }`}
                        >
                          {isJoined ? <><Check className="w-3 h-3 mr-1" />Joined</> : <><Plus className="w-3 h-3 mr-1" />Join</>}
                        </Button>
                      </div>

                      <h3 className="font-bold text-foreground mb-1.5">{c.name}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{c.desc}</p>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {c.tags.map((t) => (
                          <span key={t} className={`text-xs px-2 py-0.5 rounded-full border ${cTag[c.color]}`}>{t}</span>
                        ))}
                      </div>

                      <div className="space-y-1 mb-3">
                        {c.highlights.map((h) => (
                          <div key={h} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className={`w-1 h-1 rounded-full ${c.color === "coral" ? "bg-coral" : c.color === "violet" ? "bg-violet" : "bg-amber"}`} />
                            {h}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3 mt-2">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.members.toLocaleString()}</span>
                        <span>Active {c.active}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ SMALL GROUPS ═════════════════════════════════════════ */}
          {activeTab === "groups" && (
            <div>
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-violet-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-violet" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Why small groups?</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Groups of 5–12 people create genuine connection. You get to know people. You feel safe to share. You hold each other accountable.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {smallGroups.map((g) => {
                  const isJoined = joinedGroups.includes(g.id);
                  const spotsLeft = g.max - g.members;
                  return (
                    <div key={g.id} className="bg-gradient-card border border-border/50 rounded-2xl p-6 hover:border-violet-500/20 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cTag[g.focusColor]}`}>
                              {g.focus}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {g.members}/{g.max} members
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-foreground mb-1.5">{g.name}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{g.description}</p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {g.experiments.map((e) => (
                              <span key={e} className="text-xs bg-surface-2 border border-border rounded-lg px-3 py-1 text-foreground/80 flex items-center gap-1.5">
                                <FlaskConical className="w-3 h-3 text-muted-foreground" />
                                {e}
                              </span>
                            ))}
                          </div>

                          <p className="text-xs text-muted-foreground">Next meeting: <span className="text-foreground font-medium">{g.next}</span></p>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="text-right">
                            <div className={`text-lg font-bold ${cIcon[g.focusColor]}`}>{spotsLeft}</div>
                            <div className="text-xs text-muted-foreground">spots left</div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() =>
                              setJoinedGroups((prev) =>
                                prev.includes(g.id) ? prev.filter((id) => id !== g.id) : [...prev, g.id]
                              )
                            }
                            className={`text-xs ${
                              isJoined
                                ? `${cBg[g.focusColor]} border ${cBorder[g.focusColor]} ${cIcon[g.focusColor]} hover:opacity-80`
                                : "bg-gradient-coral text-primary-foreground hover:opacity-90"
                            }`}
                          >
                            {isJoined ? <><Check className="w-3 h-3 mr-1" />Joined</> : <><Plus className="w-3 h-3 mr-1" />Request to join</>}
                          </Button>
                        </div>
                      </div>

                      {/* Member count bar */}
                      <div className="mt-4 pt-4 border-t border-border/40">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                          <span>Group capacity</span>
                          <span>{g.members}/{g.max}</span>
                        </div>
                        <div className="h-1 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-coral rounded-full transition-all"
                            style={{ width: `${(g.members / g.max) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ EXPERIMENTS ══════════════════════════════════════════ */}
          {activeTab === "experiments" && (
            <div className="space-y-5">
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-5 mb-2">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-semibold">Experiment together.</span>{" "}
                  Collaborative experiments help you stay accountable, learn faster, and discover things you wouldn't find alone. 
                  Join one that resonates and see what you discover.
                </p>
              </div>

              {experiments.map((exp) => {
                const ExpIcon = exp.icon;
                const isJoined = joinedExperiments.includes(exp.id);
                return (
                  <div key={exp.id} className="bg-gradient-card border border-border/50 rounded-2xl p-6 hover:border-coral-500/20 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${cBg[exp.color]}`}>
                        <ExpIcon className={`w-6 h-6 ${cIcon[exp.color]}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                            exp.status === "Active now"
                              ? "bg-coral-500/10 text-coral border-coral-500/20"
                              : "bg-amber-500/10 text-amber border-amber-500/20"
                          }`}>
                            {exp.status}
                          </span>
                          <span className="text-xs text-muted-foreground">{exp.duration}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {exp.participants} participants
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-2">{exp.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{exp.desc}</p>

                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Your commitments</p>
                          <div className="space-y-1.5">
                            {exp.commitments.map((c, i) => (
                              <div key={i} className="flex items-center gap-2.5 text-sm">
                                <div className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
                                  style={{ borderColor: "hsl(var(--coral) / 0.4)" }}>
                                  <span className="text-coral text-xs font-bold">{i + 1}</span>
                                </div>
                                <span className="text-muted-foreground">{c}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <Button
                          onClick={() =>
                            setJoinedExperiments((prev) =>
                              prev.includes(exp.id) ? prev.filter((id) => id !== exp.id) : [...prev, exp.id]
                            )
                          }
                          className={`${
                            isJoined
                              ? `${cBg[exp.color]} border ${cBorder[exp.color]} ${cIcon[exp.color]} hover:opacity-80`
                              : "bg-gradient-coral text-primary-foreground hover:opacity-90"
                          }`}
                        >
                          {isJoined ? <><Check className="w-4 h-4 mr-1.5" />Joined</> : <>Join Experiment</>}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══ STORIES ══════════════════════════════════════════════ */}
          {activeTab === "stories" && (
            <div>
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-5 mb-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-semibold">Real stories from real explorers.</span>{" "}
                  These aren't polished success stories. They're honest reflections from people in the process of figuring things out — just like you.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {stories.map((story, i) => {
                  const isLiked = likedStories.includes(i);
                  return (
                    <div key={i} className="bg-gradient-card border border-border/50 rounded-2xl p-5 hover:border-violet-500/20 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-primary-foreground shrink-0`}
                          style={{ background: `linear-gradient(135deg, hsl(var(--${story.color})), hsl(var(--peach)))` }}>
                          {story.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{story.name}</p>
                          <p className={`text-xs font-medium ${cIcon[story.color]}`}>{story.direction}</p>
                        </div>
                        <span className="ml-auto text-xs text-muted-foreground">{story.time}</span>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Experiment tried</p>
                        <span className="text-xs bg-surface-2 border border-border rounded-lg px-2.5 py-1 text-foreground/80 inline-flex items-center gap-1.5">
                          <FlaskConical className="w-3 h-3 text-muted-foreground" />
                          {story.experiment}
                        </span>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">What I discovered</p>
                        <p className="text-sm text-foreground/90 leading-relaxed">{story.discovery}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">What's next</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{story.next}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-border/40 pt-3">
                        <button
                          onClick={() =>
                            setLikedStories((prev) =>
                              prev.includes(i) ? prev.filter((id) => id !== i) : [...prev, i]
                            )
                          }
                          className={`flex items-center gap-1.5 text-xs transition-colors ${
                            isLiked ? "text-coral" : "text-muted-foreground hover:text-coral"
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-coral" : ""}`} />
                          {story.likes + (isLiked ? 1 : 0)}
                        </button>
                        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          Reply
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ DISCOVER ═════════════════════════════════════════════ */}
          {activeTab === "discover" && (
            <div>
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-coral-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-coral" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">People exploring similar paths</h3>
                    <p className="text-xs text-muted-foreground">
                      Based on your identity signals and the areas you're exploring.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {discoveryPeople.map((person) => (
                  <div key={person.name} className="bg-gradient-card border border-border/50 rounded-2xl p-5 hover:border-coral-500/20 transition-colors text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-primary-foreground mx-auto mb-3`}
                      style={{ background: `linear-gradient(135deg, hsl(var(--${person.color})), hsl(var(--peach)))` }}>
                      {person.initials}
                    </div>
                    <p className="font-semibold text-foreground text-sm mb-0.5">{person.name}</p>
                    <p className={`text-xs font-medium mb-2 ${cIcon[person.color]}`}>{person.direction}</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {person.shared} interests in common
                    </p>
                    <Button size="sm" variant="outline" className="w-full text-xs border-border hover:border-coral-500/40 gap-1">
                      Connect
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Paths worth exploring together */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-1">Directions people like you are exploring</h3>
                <p className="text-xs text-muted-foreground mb-5">People with similar curiosity signals often explore these paths</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: "AI Product Design",       icon: Zap,       color: "coral",  members: 847  },
                    { label: "Digital Entrepreneurship", icon: Rocket,    color: "amber",  members: 1204 },
                    { label: "Learning & Education",     icon: BookOpen,  color: "violet", members: 632  },
                    { label: "Creative Strategy",        icon: Sparkles,  color: "coral",  members: 519  },
                  ].map((path) => {
                    const PathIcon = path.icon;
                    return (
                      <Link key={path.label} to="/opportunity-engine"
                        className="flex items-center gap-3 bg-surface-2 rounded-xl p-3 hover:bg-surface-3 transition-colors group">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cBg[path.color]}`}>
                          <PathIcon className={`w-4 h-4 ${cIcon[path.color]}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{path.label}</p>
                          <p className="text-xs text-muted-foreground">{path.members.toLocaleString()} explorers</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-coral group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Footer CTA ────────────────────────────────────────── */}
          <div className="mt-14 rounded-2xl p-8 text-center"
            style={{
              background: "linear-gradient(135deg, hsl(var(--violet) / 0.08), hsl(var(--coral) / 0.08))",
              border: "1px solid hsl(var(--violet) / 0.2)",
            }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}>
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Your path is easier when you don't walk it alone
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-6 leading-relaxed">
              There are thousands of people exploring similar directions right now. 
              Join a community, try an experiment together, share what you're discovering.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="text-primary-foreground font-semibold gap-2 hover:opacity-90"
                style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}
                onClick={() => setActiveTab("communities")}
              >
                <Users className="w-4 h-4" />
                Find my community
              </Button>
              <Button variant="outline" className="border-border hover:border-violet-500/40 gap-2"
                onClick={() => setActiveTab("experiments")}>
                <FlaskConical className="w-4 h-4 text-violet" />
                Join an experiment
              </Button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
